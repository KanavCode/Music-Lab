"use client";

import { MarketTrack, formatDuration } from "@/lib/api/marketClient";
import { useMarketStore } from "@/store/useMarketStore";
import Link from "next/link";
import { useState } from "react";

interface Props {
  track: MarketTrack;
  onClick: (track: MarketTrack) => void;
}

export default function MarketTrackCard({ track, onClick }: Props) {
  const {
    playPreview,
    pausePreview,
    activePreviewTrack,
    isPreviewPlaying,
    wishlist,
    toggleWishlist,
  } = useMarketStore();

  const isPlaying = isPreviewPlaying && activePreviewTrack?.id === track.id;
  const isWishlisted = wishlist.includes(track.id);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      pausePreview();
    } else {
      playPreview(track);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(track.id);
  };

  return (
    <div
      onClick={() => onClick(track)}
      className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 group cursor-pointer hover:-translate-y-1 ${
        isPlaying
          ? "border-violet-400 shadow-lg shadow-violet-100 animate-pulse-glow"
          : "border-gray-200 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50"
      }`}
    >
      {/* Cover */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        {/* Skeleton while loading */}
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}

        {track.coverUrl && (
          <img
            src={track.coverUrl}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            alt={track.title}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Play button overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <button
            onClick={handlePlayToggle}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xl ${
              isPlaying
                ? "bg-violet-600 text-white shadow-violet-500/40"
                : "bg-white/95 text-gray-900 shadow-black/20"
            }`}
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                <path d="M6 3.5L19 12L6 20.5V3.5Z" />
              </svg>
            )}
          </button>
        </div>

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            isWishlisted
              ? "bg-pink-500/20 text-pink-500 backdrop-blur-md"
              : "bg-black/30 text-white/70 backdrop-blur-md opacity-0 group-hover:opacity-100 hover:text-pink-400"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>

        {/* Discount badge */}
        {track.isDiscounted && (
          <div className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-lg">
            Sale
          </div>
        )}

        {/* Duration pill */}
        <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-md">
          {formatDuration(track.duration || 0)}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm truncate leading-tight">
          {track.title}
        </h3>
        <Link
          href={`/market/artist/${track.sellerId}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-gray-500 mt-0.5 truncate hover:text-violet-600 transition-colors inline-block max-w-full"
        >
          {track.artistName}
        </Link>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5">
            {track.isDiscounted && track.originalPrice && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ₹{track.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
            <span
              className={`text-base font-black ${
                track.isDiscounted ? "text-red-500" : "text-emerald-600"
              }`}
            >
              ₹{track.basePrice.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-500 text-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-bold">{track.rating?.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
          <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
            {track.genre}
          </span>
          <span className="bg-gray-100 text-gray-500 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md">
            {track.bpm} BPM
          </span>
        </div>
      </div>
    </div>
  );
}
