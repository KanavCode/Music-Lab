"use client";

import { useState, useEffect, useCallback } from "react";
import { getMarketTracks, purchaseTrack, type MarketTrack } from "@/lib/api/marketClient";

/**
 * MarketplaceView — storefront for browsing and purchasing tracks.
 * Connects to the Phase 4 JDBC Transaction Engine via REST API.
 */
export default function MarketplaceView() {
  const [tracks, setTracks] = useState<MarketTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<MarketTrack | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<"standard" | "exclusive">("standard");
  const [purchasing, setPurchasing] = useState(false);

  // Fetch marketplace tracks on mount
  useEffect(() => {
    getMarketTracks()
      .then(setTracks)
      .catch((err) => console.error("[Marketplace] Failed to fetch tracks:", err))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Checkout handler.
   * CRITICAL (Unit 4): The backend's @Transactional ensures atomicity.
   * If InsufficientFundsException is thrown, the entire transaction
   * (wallet deduction + ledger entry) is rolled back — no partial state.
   * The frontend try/catch maps directly to this JDBC rollback.
   */
  const handleCheckout = useCallback(async () => {
    if (!selectedTrack) return;

    setPurchasing(true);
    try {
      const result = await purchaseTrack(selectedTrack.id, selectedLicense, 1);
      alert(
        `🎉 Track Added to Library!\n\nTransaction ID: ${result.transactionId}\nAmount Paid: $${result.amountPaid}\nLicense: ${result.licenseType}`
      );
      setSelectedTrack(null);
    } catch (error) {
      // This catch directly corresponds to the backend's @Transactional rollback.
      // When the Java service throws InsufficientFundsException, Spring rolls back
      // the entire transaction and returns 402. The frontend displays the error.
      alert(
        `Transaction Failed: ${error instanceof Error ? error.message : "Insufficient Funds or Server Error"}`
      );
    } finally {
      setPurchasing(false);
    }
  }, [selectedTrack, selectedLicense]);

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-sm font-bold">
            $
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            Music<span className="text-amber-400">Lab</span>
            <span className="text-gray-500 text-sm ml-2">Marketplace</span>
          </h1>
        </div>
        <div className="text-xs text-gray-500">
          {tracks.length} track{tracks.length !== 1 ? "s" : ""} available
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 animate-pulse">Loading marketplace...</div>
          </div>
        ) : tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-600">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 text-gray-700">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8M12 8v8" />
            </svg>
            <p className="text-sm">No tracks listed yet</p>
            <p className="text-xs text-gray-700 mt-1">Tracks will appear here once sellers list them</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors group"
              >
                {/* Cover Gradient */}
                <div className="h-32 bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500 group-hover:text-violet-400 transition-colors">
                    <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm truncate">{track.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">Seller #{track.sellerId}</p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-emerald-400">
                      ${Number(track.basePrice).toFixed(2)}
                    </span>
                    <button
                      onClick={() => setSelectedTrack(track)}
                      className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-medium transition-colors"
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Purchase Modal */}
      {selectedTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-semibold mb-1">Purchase Track</h2>
            <p className="text-sm text-gray-400 mb-4">{selectedTrack.title}</p>

            {/* License Selection */}
            <div className="space-y-2 mb-5">
              <label className="text-xs text-gray-500 uppercase tracking-wider">License Type</label>

              <button
                onClick={() => setSelectedLicense("standard")}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  selectedLicense === "standard"
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Standard Lease</span>
                  <span className="text-sm text-emerald-400 font-bold">
                    ${Number(selectedTrack.basePrice).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Non-exclusive usage rights</p>
              </button>

              <button
                onClick={() => setSelectedLicense("exclusive")}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  selectedLicense === "exclusive"
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Exclusive Rights</span>
                  <span className="text-sm text-amber-400 font-bold">
                    ${(Number(selectedTrack.basePrice) * 10).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Full ownership transfer (10x price)</p>
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedTrack(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-700 text-sm hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={purchasing}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-wait text-sm font-medium transition-all"
              >
                {purchasing ? "Processing..." : "Confirm Purchase"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
