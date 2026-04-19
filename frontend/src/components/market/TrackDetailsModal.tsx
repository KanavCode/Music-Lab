"use client";

import { MarketTrack } from "@/lib/api/marketClient";
import { useMarketStore } from "@/store/useMarketStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TrackDetailsModalProps {
  track: MarketTrack;
  onClose: () => void;
}

function StarRating({ trackId }: { trackId: number }) {
  const { userRatings, setRating } = useMarketStore();
  const currentRating = userRatings[trackId] || 0;
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="star-rating flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setRating(trackId, star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="p-0.5"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={(hoverRating || currentRating) >= star ? "#f59e0b" : "none"}
            stroke={(hoverRating || currentRating) >= star ? "#f59e0b" : "#d1d5db"}
            strokeWidth="2"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
      {currentRating > 0 && (
        <span className="text-xs text-gray-500 ml-2">Your rating: {currentRating}/5</span>
      )}
    </div>
  );
}

export default function TrackDetailsModal({ track, onClose }: TrackDetailsModalProps) {
  const { toggleWishlist, wishlist, addToCart } = useMarketStore();
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const isWishlisted = wishlist.includes(track.id);
  const [selectedLicense, setSelectedLicense] = useState<"standard" | "exclusive">("standard");
  const licensePrice = selectedLicense === "standard" ? track.basePrice : track.basePrice * 10;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      onClose();
      router.push("/login");
      return;
    }
    addToCart({ track, licenseType: selectedLicense, price: licensePrice });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Top: Cover Image — fixed height, not flex-row */}
        <div className="relative w-full h-[260px] overflow-hidden bg-gray-100">
          {track.coverUrl ? (
            <img src={track.coverUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-400 to-indigo-500" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight">{track.title}</h1>
            <p className="text-base text-gray-300 mt-0.5">{track.artistName}</p>
          </div>
        </div>

        {/* Bottom: Details & Purchase — scrollable */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-260px)]">
          
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold tracking-wide">{track.genre}</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold font-mono tracking-wide">{track.bpm} BPM</span>
            <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold tracking-wide">
              ⭐ {track.rating?.toFixed(1)} ({track.reviewCount})
            </span>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            {track.description}
          </p>

          {/* User Rating */}
          <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rate this track</h4>
            <StarRating trackId={track.id} />
          </div>

          <h3 className="text-gray-900 font-bold mb-3 uppercase tracking-wider text-xs">Select License</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <button 
              onClick={() => setSelectedLicense("standard")}
              className={`text-left p-4 rounded-xl border-2 transition-all ${selectedLicense === "standard" ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-900 text-sm">Standard Lease</span>
                <span className="font-bold text-lg text-gray-900">₹{track.basePrice.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-xs text-gray-500">Non-exclusive, up to 100k streams.</p>
            </button>

            <button 
              onClick={() => setSelectedLicense("exclusive")}
              className={`text-left p-4 rounded-xl border-2 transition-all ${selectedLicense === "exclusive" ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-900 text-sm">Exclusive Rights</span>
                <span className="font-bold text-lg text-amber-600">₹{(track.basePrice * 10).toLocaleString("en-IN")}</span>
              </div>
              <p className="text-xs text-gray-500">Full ownership, unlimited streams.</p>
            </button>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => toggleWishlist(track.id)}
              className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-colors shrink-0 ${isWishlisted ? "border-pink-500 text-pink-500 bg-pink-50" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
            <button 
              onClick={handleAddToCart}
              className="flex-1 h-12 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-violet-200 flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
            >
              {isLoggedIn ? (
                <>Add to Cart • ₹{licensePrice.toLocaleString("en-IN")}</>
              ) : (
                <>Sign in to Purchase</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
