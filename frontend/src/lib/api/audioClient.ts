import { API_BASE_URL } from "@/lib/constants/index";

/**
 * Response shape from the Java backend's POST /api/v1/audio/upload.
 */
interface UploadResponse {
  status: string;
  message: string;
  originalFilename: string;
  storedFilename: string;
  sizeBytes: number;
  streamUrl: string;
}

/**
 * Uploads an audio file to the Spring Boot backend.
 * Constructs a FormData, POSTs to /api/v1/audio/upload,
 * and returns the streaming URL for the stored file.
 *
 * @param file - The audio File object from the file input
 * @returns The backend-generated stream URL (e.g., "/api/v1/audio/stream/uuid.wav")
 */
export async function uploadAudioFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/audio/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Upload failed" }));
    throw new Error(error.message || `Upload failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Constructs the full streaming URL for an audio file.
 *
 * @param streamPath - The relative stream path from the upload response (e.g., "/api/v1/audio/stream/uuid.wav")
 * @returns Full URL to stream the audio from the Java backend
 */
export function getStreamUrl(streamPath: string): string {
  return `${API_BASE_URL}${streamPath}`;
}
