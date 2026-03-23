"use client";

import { useState } from "react";
import StudioLayout from "@/components/studio/StudioLayout";
import MarketplaceView from "@/components/market/MarketplaceView";

/**
 * Root page — toggles between the DAW Studio and the Marketplace.
 */
export default function Home() {
  const [view, setView] = useState<"studio" | "market">("studio");

  return (
    <div className="relative h-screen">
      {/* View Content */}
      {view === "studio" ? <StudioLayout /> : <MarketplaceView />}

      {/* Floating Navigation Toggle */}
      <div className="fixed bottom-6 right-6 z-[60] flex gap-2">
        <button
          onClick={() => setView("studio")}
          className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg ${
            view === "studio"
              ? "bg-violet-600 text-white shadow-violet-500/30"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
        >
          🎹 Studio
        </button>
        <button
          onClick={() => setView("market")}
          className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg ${
            view === "market"
              ? "bg-amber-600 text-white shadow-amber-500/30"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
        >
          🛒 Marketplace
        </button>
      </div>
    </div>
  );
}
