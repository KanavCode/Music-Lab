"use client";

import { useMarketStore } from "@/store/useMarketStore";
import { purchaseTrack } from "@/lib/api/marketClient";
import { useState } from "react";

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, removeFromCart, clearCart } = useMarketStore();
  const [checkingOut, setCheckingOut] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);

    try {
      for (const item of cart) {
         await purchaseTrack(item.track.id, item.licenseType, 1);
      }
      alert(`🎉 Checkout complete for ${cart.length} track(s)!`);
      clearCart();
      toggleCart();
    } catch (err) {
      alert(`Checkout Failed: ${err instanceof Error ? err.message : "Error"}`);
    } finally {
      setCheckingOut(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity animate-fade-in" 
        onClick={toggleCart} 
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-gray-200 shadow-2xl z-[110] flex flex-col animate-slide-in-right">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            🛒 Your Cart <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{cart.length}</span>
          </h2>
          <button onClick={toggleCart} className="text-gray-400 hover:text-gray-600 transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <span className="text-4xl mb-4">🎵</span>
              <p className="font-medium">Your cart is empty.</p>
              <p className="text-xs mt-1">Add some tracks to get started.</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.track.id}-${idx}`} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                  {item.track.coverUrl ? (
                    <img src={item.track.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-400 to-indigo-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 truncate">{item.track.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{item.track.artistName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded">
                      {item.licenseType}
                    </span>
                    <span className="text-sm font-bold text-gray-900">₹{item.price.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.track.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900 font-medium">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between text-xl font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-emerald-600">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm tracking-wide transition-colors disabled:opacity-50 disabled:cursor-wait shadow-lg shadow-violet-200"
            >
              {checkingOut ? "Processing Transaction..." : "Checkout Now"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
