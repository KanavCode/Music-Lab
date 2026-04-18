"use client";

import SidebarLayout from "@/components/SidebarLayout";

export default function HooksLabPage() {
  const hooks = [
    { name: "Melodic Hook #1", key: "C Major", bpm: 128, duration: "0:08", mood: "Uplifting" },
    { name: "Vocal Chop Drop", key: "A Minor", bpm: 140, duration: "0:05", mood: "Dark" },
    { name: "Guitar Riff Loop", key: "G Major", bpm: 95, duration: "0:12", mood: "Chill" },
    { name: "Tabla Pattern", key: "D Minor", bpm: 110, duration: "0:06", mood: "Ethnic" },
    { name: "Synth Arp Lead", key: "F# Minor", bpm: 150, duration: "0:04", mood: "Energetic" },
    { name: "Piano Melody", key: "Eb Major", bpm: 80, duration: "0:10", mood: "Emotional" },
  ];

  return (
    <SidebarLayout>
      <div className="min-h-screen">
        <header className="px-8 py-6 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <span className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20" /><circle cx="12" cy="12" r="4" />
              </svg>
            </span>
            Hooks Lab
          </h1>
          <p className="text-sm text-gray-500 mt-1">Discover and preview short melodic hooks, riffs, and loops</p>
        </header>

        <main className="px-8 py-8">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🧪</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What is Hooks Lab?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Hooks Lab is your creative sandbox for discovering short, reusable melodic ideas.
                  Browse through hooks, riffs, and loops that you can use as building blocks in your productions.
                  <em className="text-violet-600"> Coming soon: AI-powered hook generation!</em>
                </p>
              </div>
            </div>
          </div>

          {/* Hooks Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_80px_80px_100px_60px] gap-4 px-6 py-3 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <span>Hook Name</span>
              <span>Key</span>
              <span>BPM</span>
              <span>Length</span>
              <span>Mood</span>
              <span></span>
            </div>
            {hooks.map((hook, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_100px_80px_80px_100px_60px] gap-4 px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors items-center"
              >
                <div className="flex items-center gap-3">
                  <button className="w-8 h-8 bg-violet-100 hover:bg-violet-200 rounded-full flex items-center justify-center text-violet-600 transition-colors shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                      <path d="M6 3.5L19 12L6 20.5V3.5Z" />
                    </svg>
                  </button>
                  <span className="font-semibold text-gray-900 text-sm">{hook.name}</span>
                </div>
                <span className="text-sm text-gray-600 font-mono">{hook.key}</span>
                <span className="text-sm text-gray-600 font-mono">{hook.bpm}</span>
                <span className="text-sm text-gray-600 font-mono">{hook.duration}</span>
                <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-md w-fit">
                  {hook.mood}
                </span>
                <button className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </SidebarLayout>
  );
}
