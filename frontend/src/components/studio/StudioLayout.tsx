"use client";

import { useCallback, useEffect, useRef } from "react";
import useStudioStore from "@/store/useStudioStore";
import AudioEngine from "@/lib/audio/AudioEngine";
import { uploadAudioFile, getStreamUrl } from "@/lib/api/audioClient";
import { saveProject, loadProject } from "@/lib/api/projectClient";
import StudioSocketClient from "@/lib/api/socketClient";
import Playhead from "./Playhead";
import TrackRow from "./TrackRow";

/**
 * StudioLayout — the main DAW workspace shell.
 * Grid layout: top header (transport controls), left sidebar (track names),
 * and main right area (timeline with playhead).
 */
export default function StudioLayout() {
  const { isPlaying, isRehydrating, bpm, tracks, currentProjectId, togglePlay, setBpm, addTrack, addRegionToTrack, hydrateProject, setRehydrating, toggleTrackMute } =
    useStudioStore();

  // Hidden file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * WebSocket initialization — connects to STOMP broker and handles incoming sync events.
   * Runs once on mount and cleans up on unmount.
   */
  useEffect(() => {
    const socket = StudioSocketClient.getInstance();

    socket.connect(currentProjectId, (msg) => {
      // Route incoming sync events to the appropriate Zustand action
      if (msg.actionType === "TRACK_MUTE" && msg.trackId) {
        // isRemoteEvent = true → prevents infinite echo
        useStudioStore.getState().toggleTrackMute(msg.trackId, true);
      }
      // Future: handle PLAYHEAD_MOVE, BPM_CHANGE, etc.
    });

    console.log(`[StudioLayout] WebSocket connected for project: ${currentProjectId}`);

    return () => {
      socket.disconnect();
    };
  }, [currentProjectId]);

  /**
   * Play/Pause handler.
   * 1. Ensures AudioEngine is initialized (browser autoplay policy requires user gesture)
   * 2. Toggles Zustand's visual state
   * 3. Calls AudioEngine play/stop (Tone.js owns the actual audio time)
   */
  const handlePlayPause = useCallback(async () => {
    const engine = AudioEngine.getInstance();

    // Initialize on first interaction (browser requires user gesture for audio)
    if (!engine.isInitialized()) {
      await engine.initialize();
    }

    if (isPlaying) {
      engine.stop();
    } else {
      engine.play();
    }

    togglePlay();
  }, [isPlaying, togglePlay]);

  /**
   * Stop handler — resets playhead to beginning.
   */
  const handleStop = useCallback(() => {
    const engine = AudioEngine.getInstance();
    engine.stop();
    useStudioStore.getState().setPlaying(false);
  }, []);

  /**
   * BPM change handler — updates both Zustand and Tone.Transport.
   */
  const handleBpmChange = useCallback(
    (newBpm: number) => {
      const clampedBpm = Math.max(20, Math.min(300, newBpm));
      setBpm(clampedBpm);
      AudioEngine.getInstance().setBpm(clampedBpm);
    },
    [setBpm]
  );

  /**
   * File upload handler.
   * Flow: File → Java backend (store) → get stream URL → Zustand (visual) → AudioEngine (audio)
   */
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        // Ensure AudioEngine is initialized
        const engine = AudioEngine.getInstance();
        if (!engine.isInitialized()) {
          await engine.initialize();
        }

        // Step 1: Upload to Java backend
        const uploadResult = await uploadAudioFile(file);
        const streamUrl = getStreamUrl(uploadResult.streamUrl);

        // Step 2: Generate region ID and determine placement
        const regionId = `region-${Date.now()}`;
        const startTime = 0;
        const duration = 5; // Default duration (avoiding complex audio header parsing)

        // Step 3: Ensure a track exists — create default track if none
        const currentTracks = useStudioStore.getState().tracks;
        let targetTrackId: string;

        if (currentTracks.length === 0) {
          targetTrackId = `track-${Date.now()}`;
          addTrack({
            trackId: targetTrackId,
            name: "Track 1",
            volume: 0.8,
            isMuted: false,
            regions: [],
          });
        } else {
          targetTrackId = currentTracks[0].trackId;
        }

        // Step 4: Add region to Zustand store (visual representation)
        addRegionToTrack(targetTrackId, {
          sampleId: regionId,
          startTime,
          duration,
          audioFileUrl: streamUrl,
        });

        // Step 5: Load region into AudioEngine (Tone.js audio node)
        await engine.loadRegion(regionId, streamUrl, startTime);

        console.log(`[StudioLayout] Audio uploaded and loaded: ${uploadResult.storedFilename}`);
      } catch (error) {
        console.error("[StudioLayout] Upload failed:", error);
        alert("Failed to upload audio file. Ensure the backend is running.");
      }

      // Reset file input so the same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [addTrack, addRegionToTrack]
  );

  /**
   * Save Project handler.
   * Maps Zustand state → Java MusicProject POJO → POST to /api/v1/studio/save.
   * On the backend: JSON → MusicProject → ObjectOutputStream → byte[] → PostgreSQL BYTEA.
   */
  const handleSaveProject = useCallback(async () => {
    const state = useStudioStore.getState();

    // CRITICAL: Map frontend state to match Java MusicProject POJO structure exactly
    const payload = {
      projectId: `project-${Date.now()}`,
      userId: "1",
      projectName: "My Music Project",
      bpm: state.bpm,
      tracks: state.tracks.map((track) => ({
        trackId: track.trackId,
        name: track.name,
        volume: track.volume,
        isMuted: track.isMuted,
        regions: track.regions.map((region) => ({
          sampleId: region.sampleId,
          startTime: region.startTime,
          duration: region.duration,
          audioFileUrl: region.audioFileUrl,
        })),
      })),
    };

    try {
      await saveProject(payload);
      alert("Project Saved!");
      console.log("[StudioLayout] Project saved successfully", payload.projectId);
    } catch (error) {
      console.error("[StudioLayout] Save failed:", error);
      alert("Failed to save project. Ensure the backend is running.");
    }
  }, []);

  /**
   * Load Project handler.
   * CRITICAL REHYDRATION SEQUENCE:
   * 1. Fetch MusicProject JSON from Java backend (ObjectInputStream → Jackson → JSON)
   * 2. Hydrate Zustand store (visual UI reconstruction)
   * 3. Rebuild Tone.js audio graph (load each region into AudioEngine)
   */
  const handleLoadProject = useCallback(async () => {
    const projectId = prompt("Enter Project ID to load:");
    if (!projectId) return;

    try {
      setRehydrating(true);

      // Ensure AudioEngine is initialized
      const engine = AudioEngine.getInstance();
      if (!engine.isInitialized()) {
        await engine.initialize();
      }

      // Dispose all existing Tone.js players before rebuilding
      engine.disposeAll();

      // Step 1: Fetch project from Java backend
      const data = await loadProject(projectId);
      console.log("[StudioLayout] Project loaded from backend:", data.projectId);

      // Step 2: Hydrate Zustand store (visual reconstruction)
      const hydratedTracks = (data.tracks || []).map((t) => ({
        trackId: t.trackId,
        name: t.name,
        volume: t.volume,
        isMuted: t.isMuted,
        regions: (t.regions || []).map((r) => ({
          sampleId: r.sampleId,
          startTime: r.startTime,
          duration: r.duration,
          audioFileUrl: r.audioFileUrl,
        })),
      }));

      hydrateProject(data.bpm, hydratedTracks);
      engine.setBpm(data.bpm);

      // Step 3: Rebuild Tone.js audio graph — load every region
      for (const track of hydratedTracks) {
        for (const region of track.regions) {
          await engine.loadRegion(region.sampleId, region.audioFileUrl, region.startTime);
        }
      }

      console.log(`[StudioLayout] Rehydration complete. ${engine.getLoadedRegionCount()} regions loaded.`);
      alert("Project loaded successfully!");
    } catch (error) {
      console.error("[StudioLayout] Load failed:", error);
      alert("Failed to load project. Ensure the backend is running and the project ID is correct.");
    } finally {
      setRehydrating(false);
    }
  }, [hydrateProject, setRehydrating]);

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white font-sans">
      {/* ═══════ HEADER — Transport Controls ═══════ */}
      <header className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold">
            M
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            Music<span className="text-violet-400">Lab</span>
          </h1>
        </div>

        {/* Transport Controls */}
        <div className="flex items-center gap-3">
          {/* Stop Button */}
          <button
            onClick={handleStop}
            className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
            title="Stop"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect width="14" height="14" rx="2" />
            </svg>
          </button>

          {/* Play / Pause Button */}
          <button
            onClick={handlePlayPause}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isPlaying
                ? "bg-violet-500 hover:bg-violet-400 shadow-lg shadow-violet-500/30"
                : "bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 shadow-lg shadow-violet-500/20"
            }`}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="1" width="4" height="14" rx="1" />
                <rect x="10" y="1" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="ml-0.5">
                <path d="M3 1.7v12.6a1 1 0 001.5.87l10-6.3a1 1 0 000-1.74l-10-6.3A1 1 0 003 1.7z" />
              </svg>
            )}
          </button>

          {/* Upload Audio Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="h-10 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center gap-2 text-sm transition-colors"
            title="Upload Audio"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 2v8M4 6l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 10v3a1 1 0 001 1h10a1 1 0 001-1v-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Save Project Button */}
          <button
            onClick={handleSaveProject}
            className="h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2 text-sm font-medium transition-colors"
            title="Save Project"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M13 16H3a2 2 0 01-2-2V2a2 2 0 012-2h8l4 4v10a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 16v-5H5v5M5 0v4h4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Save
          </button>

          {/* Load Project Button */}
          <button
            onClick={handleLoadProject}
            disabled={isRehydrating}
            className="h-10 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-gray-700 disabled:cursor-wait flex items-center gap-2 text-sm font-medium transition-colors"
            title="Load Project"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 12v2a1 1 0 001 1h10a1 1 0 001-1v-2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 10V2M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {isRehydrating ? "Loading..." : "Load"}
          </button>
        </div>

        {/* BPM Control */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400 uppercase tracking-wider">BPM</label>
          <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => handleBpmChange(bpm - 1)}
              className="px-2 py-1.5 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              −
            </button>
            <input
              type="number"
              value={bpm}
              onChange={(e) => handleBpmChange(parseInt(e.target.value) || 120)}
              className="w-14 bg-transparent text-center text-sm font-mono focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min={20}
              max={300}
            />
            <button
              onClick={() => handleBpmChange(bpm + 1)}
              className="px-2 py-1.5 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </header>

      {/* ═══════ MAIN WORKSPACE ═══════ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Sidebar: Track Names ── */}
        <aside className="w-52 shrink-0 bg-gray-900 border-r border-gray-800 overflow-y-auto">
          <div className="p-3 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800">
            Tracks
          </div>
          {tracks.length === 0 ? (
            <div className="p-4 text-sm text-gray-600 italic">
              No tracks yet
            </div>
          ) : (
            tracks.map((track) => (
              <div
                key={track.trackId}
                className="flex items-center gap-2 px-3 py-3 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    track.isMuted ? "bg-gray-600" : "bg-emerald-400"
                  }`}
                />
                <span className="text-sm truncate flex-1">{track.name}</span>
                {/* Mute Toggle Button */}
                <button
                  onClick={() => toggleTrackMute(track.trackId, false)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    track.isMuted
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  }`}
                  title={track.isMuted ? "Unmute" : "Mute"}
                >
                  {track.isMuted ? "M" : "M"}
                </button>
                <span className="text-[10px] text-gray-600">
                  {track.regions.length} clip{track.regions.length !== 1 ? "s" : ""}
                </span>
              </div>
            ))
          )}
        </aside>

        {/* ── Main Timeline Area ── */}
        <main className="flex-1 relative overflow-x-auto overflow-y-auto bg-gray-950">
          {/* Timeline ruler (time markers) */}
          <div className="sticky top-0 z-40 h-8 bg-gray-900/90 backdrop-blur border-b border-gray-800 flex items-end">
            {Array.from({ length: 60 }, (_, i) => (
              <div
                key={i}
                className="shrink-0 border-l border-gray-700/50 h-full flex items-end px-1"
                style={{ width: 50 }}
              >
                <span className="text-[10px] text-gray-500 font-mono mb-1">{i}s</span>
              </div>
            ))}
          </div>

          {/* Track lanes + Playhead */}
          <div className="relative min-h-full" style={{ minWidth: 60 * 50 }}>
            {/* Playhead — animated via rAF, not React state */}
            <Playhead />

            {/* Track lanes — now using TrackRow component */}
            {tracks.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-600">
                <div className="text-center">
                  <p className="text-sm mb-2">No tracks yet</p>
                  <p className="text-xs text-gray-700">
                    Click &quot;Upload&quot; to add your first audio file
                  </p>
                </div>
              </div>
            ) : (
              tracks.map((track, index) => (
                <TrackRow key={track.trackId} track={track} index={index} />
              ))
            )}
          </div>
        </main>
      </div>

      {/* ═══════ STATUS BAR ═══════ */}
      <footer className="flex items-center justify-between px-4 py-1.5 bg-gray-900 border-t border-gray-800 text-xs text-gray-500 shrink-0">
        <span>{tracks.length} track{tracks.length !== 1 ? "s" : ""}</span>
        <span className={isPlaying ? "text-emerald-400" : "text-gray-500"}>
          {isPlaying ? "● Playing" : "■ Stopped"}
        </span>
        <span>{bpm} BPM</span>
      </footer>
    </div>
  );
}
