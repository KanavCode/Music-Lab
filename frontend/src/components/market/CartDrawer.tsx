"use client";

import { useMarketStore } from "@/store/useMarketStore";
import { useAuthStore } from "@/store/useAuthStore";
import { purchaseTrack } from "@/lib/api/marketClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

type CheckoutStep = "cart" | "details" | "confirm";

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, removeFromCart, clearCart } = useMarketStore();
  const { isLoggedIn, user } = useAuthStore();
  const router = useRouter();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Payment form state
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const gst = Math.round(total * 0.18); // 18% GST
  const grandTotal = total + gst;

  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      toggleCart();
      router.push("/login");
      return;
    }
    setStep("details");
  };

  const handlePlaceOrder = async () => {
    if (!paymentDetails.nameOnCard || !paymentDetails.cardNumber) return;
    setCheckingOut(true);
    
    try {
      for (const item of cart) {
        await purchaseTrack(item.track.id, item.licenseType, 1);
      }
      const id = `ML-${Date.now().toString(36).toUpperCase()}`;
      setOrderId(id);
      setOrderComplete(true);
      clearCart();
      setStep("confirm");
    } catch (err) {
      alert(`Checkout Failed: ${err instanceof Error ? err.message : "Error"}`);
    } finally {
      setCheckingOut(false);
    }
  };

  const handleClose = () => {
    toggleCart();
    setStep("cart");
    setOrderComplete(false);
    setPaymentDetails({ cardNumber: "", expiry: "", cvv: "", nameOnCard: "" });
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity animate-fade-in" onClick={handleClose} />
      
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-gray-200 shadow-2xl z-[110] flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {step === "cart" && <>🛒 Your Cart <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{cart.length}</span></>}
            {step === "details" && <>💳 Checkout</>}
            {step === "confirm" && <>✅ Order Confirmed</>}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Step: Cart */}
        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">🎵</span>
                  </div>
                  <p className="font-medium text-gray-500">Your cart is empty</p>
                  <p className="text-xs mt-1">Explore the marketplace to add tracks.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.track.id}-${idx}`} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div className="w-14 h-14 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                      {item.track.coverUrl ? (
                        <img src={item.track.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-400 to-indigo-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">{item.track.title}</h4>
                      <p className="text-xs text-gray-500 truncate">{item.track.artistName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] uppercase font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded">{item.licenseType}</span>
                        <span className="text-sm font-bold text-gray-900">₹{item.price.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.track.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-5 border-t border-gray-200 bg-gray-50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900 font-medium">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GST (18%)</span>
                  <span className="text-gray-900 font-medium">₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-emerald-600">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
                <button onClick={handleProceedToCheckout}
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm tracking-wide transition-colors shadow-lg shadow-violet-200">
                  {isLoggedIn ? "Proceed to Checkout" : "Sign in to Checkout"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Step: Payment Details */}
        {step === "details" && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Order summary */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Summary</h3>
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1.5 text-sm">
                    <span className="text-gray-700 truncate max-w-[200px]">{item.track.title} ({item.licenseType})</span>
                    <span className="text-gray-900 font-medium">₹{item.price.toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-sm">
                  <span className="text-gray-500">+ GST (18%)</span>
                  <span>₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-1 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-emerald-600">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Billing info */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Billing Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Email</label>
                    <input type="email" value={user?.email || ""} disabled
                      className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Name on Card</label>
                    <input type="text" value={paymentDetails.nameOnCard}
                      onChange={(e) => setPaymentDetails({...paymentDetails, nameOnCard: e.target.value})}
                      placeholder={user?.name || "Full name"}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 mt-1" />
                  </div>
                </div>
              </div>

              {/* Card details */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Method</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Card Number</label>
                    <input type="text" value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19)})}
                      placeholder="1234 5678 9012 3456" maxLength={19}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 mt-1 font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 font-medium">Expiry</label>
                      <input type="text" value={paymentDetails.expiry}
                        onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value.replace(/\D/g, "").replace(/^(\d{2})/, "$1/").slice(0, 5)})}
                        placeholder="MM/YY" maxLength={5}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 mt-1 font-mono" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium">CVV</label>
                      <input type="password" value={paymentDetails.cvv}
                        onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value.replace(/\D/g, "").slice(0, 3)})}
                        placeholder="•••" maxLength={3}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 mt-1 font-mono" />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 leading-relaxed">
                By clicking &quot;Place Order&quot; you agree to our Terms of Service and License Agreement. Payment is processed securely. 
                You will receive download links via email.
              </p>
            </div>
            <div className="p-5 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button onClick={() => setStep("cart")}
                className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors">
                Back
              </button>
              <button onClick={handlePlaceOrder} disabled={checkingOut || !paymentDetails.cardNumber || !paymentDetails.nameOnCard}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors shadow-lg shadow-emerald-200">
                {checkingOut ? "Processing..." : `Pay ₹${grandTotal.toLocaleString("en-IN")}`}
              </button>
            </div>
          </>
        )}

        {/* Step: Confirmation */}
        {step === "confirm" && orderComplete && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-scale-in">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-sm text-gray-500 mb-1">Your order has been confirmed.</p>
            <p className="text-xs text-gray-400 font-mono mb-6">Order ID: {orderId}</p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 w-full max-w-xs text-left mb-6">
              <p className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider">What&apos;s next?</p>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> License files sent to your email
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Download links available in Library
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Receipt generated for your records
                </li>
              </ul>
            </div>
            <button onClick={handleClose}
              className="w-full max-w-xs py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-colors shadow-lg shadow-violet-200">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
