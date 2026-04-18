"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore, User } from "@/store/useAuthStore";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<User["role"]>("listener");
  const [error, setError] = useState("");
  const { signup } = useAuthStore();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const success = signup(name, email, password, role);
    if (success) {
      router.push("/");
    } else {
      setError("Signup failed. Please try again.");
    }
  };

  const roles: { value: User["role"]; label: string; desc: string; icon: string }[] = [
    { value: "listener", label: "Listener", desc: "Discover & buy beats", icon: "🎧" },
    { value: "artist", label: "Artist", desc: "Publish & sell music", icon: "🎤" },
    { value: "producer", label: "Producer", desc: "Create & collaborate", icon: "🎹" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image src="/musiclablogo.svg" alt="MusicLab" width={44} height={44} className="rounded-xl" />
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              Music<span className="text-violet-600">Lab</span>
            </h1>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Create your account and start creating.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>

            {/* Role selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center ${
                      role === r.value
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xl">{r.icon}</span>
                    <span className="text-xs font-bold">{r.label}</span>
                    <span className="text-[10px] text-gray-400 leading-tight">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-200 active:scale-[0.98]"
            >
              Create Account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-600 hover:text-violet-700 font-semibold">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
