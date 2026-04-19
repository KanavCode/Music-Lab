import { create } from "zustand";
import { MarketTrack } from "@/lib/api/marketClient";

// Persist wishlist to localStorage
function loadWishlist(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("musiclab_wishlist");
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function persistWishlist(ids: number[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("musiclab_wishlist", JSON.stringify(ids));
}

export interface CartItem {
  track: MarketTrack;
  licenseType: "standard" | "exclusive";
  price: number;
}

interface MarketState {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;

  // Wishlist (store track IDs)
  wishlist: number[];

  // Audio Preview
  activePreviewTrack: MarketTrack | null;
  isPreviewPlaying: boolean;
  allTracks: MarketTrack[]; // needed for next/prev

  // Purchase History (mock)
  purchaseHistory: MarketTrack[];

  // User Ratings
  userRatings: Record<number, number>;
}

interface MarketActions {
  // Cart
  addToCart: (item: CartItem) => void;
  removeFromCart: (trackId: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;

  // Wishlist
  toggleWishlist: (trackId: number) => void;
  isInWishlist: (trackId: number) => boolean;

  // Preview
  playPreview: (track: MarketTrack) => void;
  pausePreview: () => void;
  resumePreview: () => void;
  stopPreview: () => void;
  playNext: () => void;
  playPrev: () => void;
  setAllTracks: (tracks: MarketTrack[]) => void;

  // Purchase History
  addToPurchaseHistory: (track: MarketTrack) => void;

  // Ratings
  setRating: (trackId: number, rating: number) => void;
  getRating: (trackId: number) => number | undefined;
}

type MarketStore = MarketState & MarketActions;

export const useMarketStore = create<MarketStore>((set, get) => ({
  cart: [],
  isCartOpen: false,
  wishlist: loadWishlist(),
  activePreviewTrack: null,
  isPreviewPlaying: false,
  allTracks: [],
  purchaseHistory: [],
  userRatings: {},

  addToCart: (item) =>
    set((state) => {
      const exists = state.cart.find((c) => c.track.id === item.track.id);
      if (exists) return state;
      return { cart: [...state.cart, item], isCartOpen: true };
    }),

  removeFromCart: (trackId) =>
    set((state) => ({
      cart: state.cart.filter((c) => c.track.id !== trackId),
    })),

  clearCart: () => set({ cart: [] }),

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  setCartOpen: (open) => set({ isCartOpen: open }),

  toggleWishlist: (trackId) =>
    set((state) => {
      const isAdded = state.wishlist.includes(trackId);
      const newWishlist = isAdded
        ? state.wishlist.filter((id) => id !== trackId)
        : [...state.wishlist, trackId];
      persistWishlist(newWishlist);
      return { wishlist: newWishlist };
    }),

  isInWishlist: (trackId) => get().wishlist.includes(trackId),

  setAllTracks: (tracks) => set({ allTracks: tracks }),

  playPreview: (track) =>
    set({
      activePreviewTrack: track,
      isPreviewPlaying: true,
    }),

  pausePreview: () => set({ isPreviewPlaying: false }),

  resumePreview: () =>
    set((state) => ({
      isPreviewPlaying: state.activePreviewTrack !== null,
    })),

  stopPreview: () =>
    set({ activePreviewTrack: null, isPreviewPlaying: false }),

  playNext: () => {
    const { activePreviewTrack, allTracks } = get();
    if (!activePreviewTrack || allTracks.length === 0) return;
    const idx = allTracks.findIndex((t) => t.id === activePreviewTrack.id);
    const next = allTracks[(idx + 1) % allTracks.length];
    set({ activePreviewTrack: next, isPreviewPlaying: true });
  },

  playPrev: () => {
    const { activePreviewTrack, allTracks } = get();
    if (!activePreviewTrack || allTracks.length === 0) return;
    const idx = allTracks.findIndex((t) => t.id === activePreviewTrack.id);
    const prev = allTracks[(idx - 1 + allTracks.length) % allTracks.length];
    set({ activePreviewTrack: prev, isPreviewPlaying: true });
  },

  addToPurchaseHistory: (track) =>
    set((state) => ({
      purchaseHistory: [...state.purchaseHistory, track],
    })),

  setRating: (trackId, rating) =>
    set((state) => ({
      userRatings: { ...state.userRatings, [trackId]: rating },
    })),

  getRating: (trackId) => get().userRatings[trackId],
}));
