/**
 * Spatial constants for the DAW timeline.
 * Used by both the visual rendering (CSS widths) and the playhead sync hook.
 */

/** How many pixels represent one second on the timeline. */
export const PIXELS_PER_SECOND = 50;

/** Default BPM for new projects. */
export const DEFAULT_BPM = 120;

/** API base URL for backend communication. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
