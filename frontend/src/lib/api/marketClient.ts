import { API_BASE_URL } from "@/lib/constants/index";

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
  // --- Frontend-display fields (mocked until backend supports them) ---
  artistName?: string;
  genre?: string;
  bpm?: number;
  duration?: number; // in seconds
  coverUrl?: string;
  previewUrl?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  description?: string;
  isDiscounted?: boolean;
  originalPrice?: number;
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
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/market/tracks`);

    if (!response.ok) {
      throw new Error(`Failed to fetch tracks: ${response.status}`);
    }

    const tracks: MarketTrack[] = await response.json();
    return enhanceWithMockData(tracks);
  } catch (error) {
    console.warn("Backend not available, using Indian marketplace mock data.", error);
    return enhanceWithMockData([]);
  }
}

/** Format seconds → "3:24" */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Injects rich Indian-marketplace UI data for frontend-only development.
 */
function enhanceWithMockData(tracks: MarketTrack[]): MarketTrack[] {
  const mockCovers = [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
    "https://images.unsplash.com/photo-1493225457124-a1a2a5f5600c?w=400&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80",
    "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&q=80",
    "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400&q=80",
    "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80",
    "https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&q=80",
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80",
  ];

  const mockGenres = [
    "Bollywood",
    "Classical Fusion",
    "Trap",
    "Lo-Fi",
    "Sufi",
    "Hip Hop",
    "R&B",
    "EDM",
    "Indie Pop",
    "Drill",
  ];

  const mockTagsList = [
    ["filmy", "vibe", "romantic"],
    ["chill", "study", "lofi"],
    ["hard", "club", "banger"],
    ["emotional", "sitar", "tabla"],
    ["sufi", "qawwali", "spiritual"],
    ["dark", "bass", "808"],
    ["punjabi", "dhol", "party"],
    ["indie", "guitar", "acoustic"],
  ];

  const mockArtists = [
    "Aarav Beats",
    "Raga Revival",
    "Dhruv Bass",
    "Ananya Loops",
    "Kabir Soundz",
    "Priya Melody",
    "Arjun Trap",
    "Desi Frequency",
    "NeonRaga",
    "BeatsByVarun",
  ];

  const mockDescriptions = [
    "Premium Bollywood-inspired beat with rich tabla patterns and cinematic strings. Perfect for Hindi rap or playback tracks.",
    "A deep, atmospheric Lo-Fi beat blending sitar samples with modern 808s. Ideal for chill study sessions or ambient projects.",
    "High-energy Trap beat with aggressive bass and layered synths. Ready for your next viral hip-hop track.",
    "Emotional Sufi-fusion instrumental featuring harmonium, flute, and modern percussion. Great for soulful storytelling.",
    "Upbeat Punjabi party beat with dhol loops, brass stabs, and a festival-ready drop. Made for the dancefloor.",
    "Cinematic orchestral piece with Indian classical motifs. Perfect for film scores, intros, or dramatic content.",
    "Smooth R&B groove with Indian vocal chops and warm keys. Built for hook-driven melodies.",
    "Dark drill beat with distorted 808s and eerie samples. Underground sound with desi flavor.",
  ];

  const mockFallback: MarketTrack[] = [
    { id: 101, projectId: null, sellerId: 1, title: "Mumbai Midnight", basePrice: 2499, listedAt: "2026-04-10T10:00:00Z" },
    { id: 102, projectId: null, sellerId: 2, title: "Raga Trap", basePrice: 3999, listedAt: "2026-04-12T14:30:00Z" },
    { id: 103, projectId: null, sellerId: 3, title: "Monsoon Lo-Fi", basePrice: 1499, listedAt: "2026-04-14T09:15:00Z" },
    { id: 104, projectId: null, sellerId: 4, title: "Delhi Drill", basePrice: 4999, listedAt: "2026-04-15T18:45:00Z" },
    { id: 105, projectId: null, sellerId: 5, title: "Sufi Dreams", basePrice: 1999, listedAt: "2026-04-13T12:00:00Z" },
    { id: 106, projectId: null, sellerId: 1, title: "Bollywood Bounce", basePrice: 5999, listedAt: "2026-04-08T16:20:00Z" },
    { id: 107, projectId: null, sellerId: 6, title: "Tabla & 808s", basePrice: 3499, listedAt: "2026-04-11T11:30:00Z" },
    { id: 108, projectId: null, sellerId: 7, title: "Punjabi Heat", basePrice: 2999, listedAt: "2026-04-09T20:00:00Z" },
    { id: 109, projectId: null, sellerId: 2, title: "Chennai Chill", basePrice: 1299, listedAt: "2026-04-16T07:30:00Z" },
    { id: 110, projectId: null, sellerId: 8, title: "Neon Ghazal", basePrice: 6999, listedAt: "2026-04-07T22:15:00Z" },
    { id: 111, projectId: null, sellerId: 3, title: "Indie Sunrise", basePrice: 1799, listedAt: "2026-04-17T08:00:00Z" },
    { id: 112, projectId: null, sellerId: 9, title: "Filmi Frequency", basePrice: 8999, listedAt: "2026-04-06T13:45:00Z", isDiscounted: true, originalPrice: 12999 },
  ];

  const baseTracks = tracks.length > 0 ? tracks : mockFallback;

  return baseTracks.map((track) => {
    const seed = track.title.length + track.id;
    const discountChance = seed % 5 === 0;
    const baseP = track.basePrice;

    return {
      ...track,
      artistName: track.artistName || mockArtists[seed % mockArtists.length],
      genre: track.genre || mockGenres[seed % mockGenres.length],
      bpm: track.bpm || 80 + (seed % 80),
      duration: track.duration || 120 + (seed % 180),
      coverUrl: track.coverUrl || mockCovers[seed % mockCovers.length],
      previewUrl:
        track.previewUrl ||
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      rating: track.rating || +(4 + (seed % 10) / 10).toFixed(1),
      reviewCount: track.reviewCount || 10 + (seed % 200),
      tags: track.tags || mockTagsList[seed % mockTagsList.length],
      description:
        track.description || mockDescriptions[seed % mockDescriptions.length],
      isDiscounted: track.isDiscounted || discountChance,
      originalPrice:
        track.originalPrice || (discountChance ? Math.round(baseP * 1.4) : undefined),
    };
  });
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
