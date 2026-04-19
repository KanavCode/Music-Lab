"use client";

import type { AudioTrack } from "@/store/useStudioStore";
import RegionBlock from "./RegionBlock";

/**
 * TrackRow — a single horizontal track lane in the DAW timeline.
 * Renders RegionBlock components with matching track colors.
 */
interface TrackRowProps {
  track: AudioTrack;
  index: number;
}

// Left accent colors matching the sidebar — same order
const LANE_ACCENTS = [
  "border-l-violet-400",
  "border-l-emerald-400",
  "border-l-amber-400",
  "border-l-rose-400",
  "border-l-sky-400",
];

export default function TrackRow({ track, index }: TrackRowProps) {
  return (
    <div
      className={`h-20 border-b border-gray-200 border-l-[3px] ${LANE_ACCENTS[index % LANE_ACCENTS.length]} relative ${
        index % 2 === 0 ? "bg-gray-100/50" : "bg-white/50"
      } ${track.isMuted ? "opacity-40" : ""}`}
    >
      {/* Mute indicator overlay */}
      {track.isMuted && (
        <div className="absolute top-1 right-2 z-20">
          <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider bg-red-100 px-1.5 py-0.5 rounded">
            Muted
          </span>
        </div>
      )}

      {/* Regions rendered as absolutely positioned blocks — trackIndex for color consistency */}
      {track.regions.map((region) => (
        <RegionBlock key={region.sampleId} region={region} trackIndex={index} />
      ))}

      {/* Empty track indicator */}
      {track.regions.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-gray-400 italic">Drop audio here</span>
        </div>
      )}
    </div>
  );
}
