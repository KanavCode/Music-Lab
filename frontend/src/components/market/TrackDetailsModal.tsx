"use client";

import { MarketTrack } from "@/lib/api/marketClient";
import { useMarketStore } from "@/store/useMarketStore";
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
  const isWishlisted = wishlist.includes(track.id);
  const [selectedLicense, setSelectedLicense] = useState<"standard" | "exclusive">("standard");
  const licensePrice = selectedLicense === "standard" ? track.basePrice : track.basePrice * 10;

  const handleAddToCart = () => {
    addToCart({ track, licenseType: selectedLicense, price: licensePrice });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-scale-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Left: Art & Player Mock */}
        <div className="w-full md:w-1/2 relative bg-gray-100 group">
          <div className="aspect-square md:h-full relative overflow-hidden">
             {track.coverUrl ? (
               <img src={track.coverUrl} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             ) : (
               <div className="w-full h-full bg-gradient-to-br from-violet-400 to-indigo-500" />
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h1 className="text-3xl font-black text-white tracking-tight leading-tight">{track.title}</h1>
                <p className="text-lg text-gray-300 mt-1">{track.artistName}</p>
             </div>
          </div>
        </div>

        {/* Right: Details & Purchase */}
        <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
          
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold tracking-wide">{track.genre}</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold font-mono tracking-wide">{track.bpm} BPM</span>
            <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold tracking-wide">
              ⭐ {track.rating?.toFixed(1)} ({track.reviewCount})
            </span>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            {track.description}
          </p>

          {/* User Rating */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rate this track</h4>
            <StarRating trackId={track.id} />
          </div>

          <h3 className="text-gray-900 font-bold mb-4 uppercase tracking-wider text-xs">Select License</h3>
          <div className="space-y-3 mb-6">
            <button 
              onClick={() => setSelectedLicense("standard")}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedLicense === "standard" ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-900">Standard Lease</span>
                <span className="font-bold text-xl text-gray-900">₹{track.basePrice.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-xs text-gray-500">Non-exclusive, up to 100k streams.</p>
            </button>

            <button 
              onClick={() => setSelectedLicense("exclusive")}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedLicense === "exclusive" ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-900">Exclusive Rights</span>
                <span className="font-bold text-xl text-amber-600">₹{(track.basePrice * 10).toLocaleString("en-IN")}</span>
              </div>
              <p className="text-xs text-gray-500">Full ownership, unlimited streams. Track is removed.</p>
            </button>
          </div>

          <div className="mt-auto pt-4 flex gap-4">
            <button 
              onClick={() => toggleWishlist(track.id)}
              className={`flex items-center justify-center w-14 h-14 rounded-xl border-2 transition-colors ${isWishlisted ? "border-pink-500 text-pink-500 bg-pink-50" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
            <button 
              onClick={handleAddToCart}
              className="flex-1 h-14 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-violet-200 flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
            >
              Add to Cart
              <span>•</span>
              ₹{licensePrice.toLocaleString("en-IN")}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
