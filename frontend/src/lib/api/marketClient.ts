import { API_BASE_URL } from "@/lib/constants";

/**
 * Marketplace track from the Java backend.
 */
export interface MarketTrack {
  id: number;
  projectId: number | null;
  sellerId: number;
  title: string;
  basePrice: number;
  listedAt: string;
}

/**
 * Purchase response from the backend.
 */
export interface PurchaseResponse {
  status: string;
  message: string;
  transactionId?: number;
  amountPaid?: number;
  licenseType?: string;
  transactionDate?: string;
}

/**
 * Fetches all tracks currently listed on the marketplace.
 */
export async function getMarketTracks(): Promise<MarketTrack[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/market/tracks`);

  if (!response.ok) {
    throw new Error(`Failed to fetch tracks: ${response.status}`);
  }

  return response.json();
}

/**
 * Purchases a track from the marketplace.
 * The backend runs this inside a @Transactional boundary (Unit 4).
 * If the buyer has insufficient funds, the transaction is rolled back
 * and a 402 PAYMENT_REQUIRED is returned.
 *
 * @param trackId - ID of the marketplace track
 * @param licenseType - "standard" or "exclusive"
 * @param buyerId - ID of the purchasing user (hardcoded to 1 for MVP)
 */
export async function purchaseTrack(
  trackId: number,
  licenseType: string,
  buyerId: number = 1
): Promise<PurchaseResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/market/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trackId, licenseType, buyerId }),
  });

  const data: PurchaseResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Purchase failed");
  }

  return data;
}
