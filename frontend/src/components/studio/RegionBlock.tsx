"use client";

import type { AudioRegion } from "@/store/useStudioStore";
import { PIXELS_PER_SECOND } from "@/lib/constants/index";

/**
 * RegionBlock — visual representation of an audio clip on the timeline.
 * Positioned absolutely within its parent TrackRow.
 * Uses SVG waveform that always spans the full bubble width.
 * Color is inherited from trackIndex for consistency with the sidebar.
 */
interface RegionBlockProps {
  region: AudioRegion;
  trackIndex: number;
}

// Colors matching sidebar track colors: violet, emerald, amber, rose, sky
const TRACK_COLORS = [
  { bg: "bg-violet-400/20", border: "border-violet-400/60", fill: "fill-violet-500/30", stroke: "stroke-violet-400/50", label: "bg-violet-600 text-white" },
  { bg: "bg-emerald-400/20", border: "border-emerald-400/60", fill: "fill-emerald-500/30", stroke: "stroke-emerald-400/50", label: "bg-emerald-600 text-white" },
  { bg: "bg-amber-400/20", border: "border-amber-400/60", fill: "fill-amber-500/30", stroke: "stroke-amber-400/50", label: "bg-amber-600 text-white" },
  { bg: "bg-rose-400/20", border: "border-rose-400/60", fill: "fill-rose-500/30", stroke: "stroke-rose-400/50", label: "bg-rose-600 text-white" },
  { bg: "bg-sky-400/20", border: "border-sky-400/60", fill: "fill-sky-500/30", stroke: "stroke-sky-400/50", label: "bg-sky-600 text-white" },
];

/**
 * Generates a symmetric filled waveform SVG path that always spans the full
 * normalized viewBox width. Uses trackIndex as seed so each track looks unique.
 */
function generateWaveformPath(trackIndex: number): string {
  const W = 1000; // normalized viewBox width
  const H = 100;  // normalized viewBox height
  const center = H / 2;
  const numSegments = 250;
  const seed = trackIndex * 17 + 7;

  const amplitudes: number[] = [];
  for (let i = 0; i <= numSegments; i++) {
    const t = i / numSegments;
    const amp = Math.abs(
      Math.sin(t * 14.5 + seed) * 0.45 +
      Math.sin(t * 31.2 + seed * 2.3) * 0.28 +
      Math.cos(t * 53.7 + seed * 3.1) * 0.18 +
      Math.sin(t * 97.3 + seed * 0.7) * 0.09
    );
    amplitudes.push(amp * center * 0.88);
  }

  // Top edge: center minus amplitude
  let path = `M 0 ${center}`;
  for (let i = 0; i <= numSegments; i++) {
    const x = (i / numSegments) * W;
    path += ` L ${x.toFixed(1)} ${(center - amplitudes[i]).toFixed(1)}`;
  }
  // Bottom edge: reversed, center plus amplitude
  for (let i = numSegments; i >= 0; i--) {
    const x = (i / numSegments) * W;
    path += ` L ${x.toFixed(1)} ${(center + amplitudes[i]).toFixed(1)}`;
  }
  path += " Z";
  return path;
}

export default function RegionBlock({ region, trackIndex }: RegionBlockProps) {
  const color = TRACK_COLORS[trackIndex % TRACK_COLORS.length];
  const left = region.startTime * PIXELS_PER_SECOND;
  const width = region.duration * PIXELS_PER_SECOND;
  const displayWidth = Math.max(width, 30);

  // Format duration for the label
  const mins = Math.floor(region.duration / 60);
  const secs = Math.floor(region.duration % 60);
  const durationLabel = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  const wavePath = generateWaveformPath(trackIndex);

  return (
    <div
      className={`absolute top-1 bottom-1 rounded-md ${color.bg} border ${color.border} overflow-hidden cursor-pointer hover:brightness-110 transition-[filter]`}
      style={{ left, width: displayWidth }}
      title={`${region.startTime}s – ${(region.startTime + region.duration).toFixed(1)}s (${durationLabel})`}
    >
      {/* Full-width waveform SVG — viewBox + preserveAspectRatio="none" ensures
          the waveform ALWAYS stretches to fill the entire bubble regardless of duration */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
      >
        <path d={wavePath} className={color.fill} />
        <line x1="0" y1="50" x2="1000" y2="50" className={color.stroke} strokeWidth="0.5" />
      </svg>

      {/* Duration label — solid colored pill for maximum readability */}
      <div className="absolute top-1 left-1.5 z-10">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm ${color.label}`}>
          {durationLabel}
        </span>
      </div>
    </div>
  );
}
