import * as Tone from "tone";

/**
 * Singleton class wrapping Tone.js Transport for audio engine management.
 *
 * CRITICAL (Agent.md §5): Tone.js owns the time.
 * The UI must NEVER manage playback state via React useState.
 * This singleton is the single source of truth for audio time.
 */
class AudioEngine {
  private static instance: AudioEngine | null = null;
  private initialized = false;
  private players: Map<string, Tone.Player> = new Map();

  private constructor() {
    // Private constructor enforces Singleton pattern (Unit 8)
  }

  /**
   * Returns the single AudioEngine instance.
   * Implements the Singleton Design Pattern (AJT Unit 8).
   */
  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  /**
   * Initializes the audio context.
   * Modern browsers require a user gesture before starting audio.
   * Must be called from a click/tap event handler.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Request user audio context (required by Chrome, Safari, Firefox)
    await Tone.start();
    console.log("[AudioEngine] Audio context started. State:", Tone.getContext().state);

    this.initialized = true;
  }

  /**
   * Loads an audio region: creates a Tone.Player, syncs it to Transport,
   * and routes it to the master output (Tone.Destination).
   *
   * @param regionId  - Unique identifier for this audio region
   * @param audioUrl  - URL to the audio file (from /api/v1/audio/stream/{filename})
   * @param startTime - When this region should start playing on the Transport timeline (in seconds)
   */
  async loadRegion(regionId: string, audioUrl: string, startTime: number): Promise<number> {
    // Dispose existing player for this region if reloading
    if (this.players.has(regionId)) {
      this.players.get(regionId)!.dispose();
      this.players.delete(regionId);
    }

    const player = new Tone.Player();

    // Route to master output (Tone.Destination)
    player.toDestination();

    // Load the audio file
    await player.load(audioUrl);

    // Sync to Transport and schedule start time
    player.sync().start(startTime);

    this.players.set(regionId, player);
    const duration = player.buffer.duration;
    console.log(`[AudioEngine] Loaded region '${regionId}' at ${startTime}s, duration: ${duration}s`);
    return duration;
  }

  /**
   * Disposes a single loaded region's player and removes it from the map.
   */
  disposeRegion(regionId: string): void {
    const player = this.players.get(regionId);
    if (player) {
      player.dispose();
      this.players.delete(regionId);
      console.log(`[AudioEngine] Disposed region '${regionId}'`);
    }
  }

  /**
   * Disposes all loaded players and clears the map.
   */
  disposeAll(): void {
    this.players.forEach((player, id) => {
      player.dispose();
      console.log(`[AudioEngine] Disposed region '${id}'`);
    });
    this.players.clear();
  }

  /**
   * Starts or resumes Transport playback.
   */
  play(): void {
    if (!this.initialized) {
      console.warn("[AudioEngine] Not initialized. Call initialize() first.");
      return;
    }
    Tone.getTransport().start();
    console.log("[AudioEngine] Transport started");
  }

  /**
   * Stops Transport playback and resets the position to 0.
   */
  stop(): void {
    Tone.getTransport().stop();
    Tone.getTransport().position = 0;
    console.log("[AudioEngine] Transport stopped, position reset");
  }

  /**
   * Pauses Transport playback at the current position.
   */
  pause(): void {
    Tone.getTransport().pause();
    console.log("[AudioEngine] Transport paused at", this.getCurrentTime());
  }

  /**
   * Seeks Transport to a specific position in seconds.
   */
  seek(seconds: number): void {
    Tone.getTransport().seconds = Math.max(0, seconds);
  }

  /**
   * Mutes or unmutes a specific player by region ID.
   */
  setPlayerMute(regionId: string, muted: boolean): void {
    const player = this.players.get(regionId);
    if (player) {
      player.mute = muted;
    }
  }

  /**
   * Sets the Transport BPM.
   */
  setBpm(bpm: number): void {
    Tone.getTransport().bpm.value = bpm;
    console.log("[AudioEngine] BPM set to", bpm);
  }

  /**
   * Returns the current Transport playhead position in seconds.
   * This is the value read by the requestAnimationFrame loop
   * to update the visual playhead WITHOUT triggering React re-renders.
   */
  getCurrentTime(): number {
    return Tone.getTransport().seconds;
  }

  /**
   * Returns whether the Transport is currently playing.
   */
  isPlaying(): boolean {
    return Tone.getTransport().state === "started";
  }

  /**
   * Returns whether the audio context has been initialized.
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Returns the number of currently loaded players.
   */
  getLoadedRegionCount(): number {
    return this.players.size;
  }
}

export default AudioEngine;

