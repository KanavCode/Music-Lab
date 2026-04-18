"use client";

import SidebarLayout from "@/components/SidebarLayout";

export default function ExplorePage() {
  const categories = [
    { name: "Trending Beats", icon: "🔥", count: 248, color: "from-orange-500 to-red-500" },
    { name: "New Releases", icon: "✨", count: 124, color: "from-violet-500 to-purple-500" },
    { name: "Bollywood", icon: "🎬", count: 86, color: "from-pink-500 to-rose-500" },
    { name: "Hip Hop & Trap", icon: "🎤", count: 312, color: "from-blue-500 to-indigo-500" },
    { name: "Lo-Fi Chill", icon: "☕", count: 159, color: "from-teal-500 to-emerald-500" },
    { name: "Classical Fusion", icon: "🎵", count: 67, color: "from-amber-500 to-yellow-500" },
    { name: "EDM & Dance", icon: "💿", count: 203, color: "from-cyan-500 to-blue-500" },
    { name: "Sufi & Devotional", icon: "🕊️", count: 45, color: "from-green-500 to-teal-500" },
  ];

  const featuredArtists = [
    { name: "Aarav Beats", tracks: 84, avatar: "https://i.pravatar.cc/150?u=aarav" },
    { name: "Raga Revival", tracks: 56, avatar: "https://i.pravatar.cc/150?u=raga" },
    { name: "Dhruv Bass", tracks: 42, avatar: "https://i.pravatar.cc/150?u=dhruv" },
    { name: "Ananya Loops", tracks: 38, avatar: "https://i.pravatar.cc/150?u=ananya" },
    { name: "Priya Melody", tracks: 29, avatar: "https://i.pravatar.cc/150?u=priya" },
    { name: "Kabir Soundz", tracks: 61, avatar: "https://i.pravatar.cc/150?u=kabir" },
  ];

  return (
    <SidebarLayout>
      <div className="min-h-screen">
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <h1 className="text-2xl font-black text-gray-900">Explore</h1>
          <p className="text-sm text-gray-500 mt-1">Discover beats, artists, and genres</p>
        </header>

        <main className="px-8 py-8 space-y-12">
          {/* Categories Grid */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-5">Browse by Genre</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <a
                  key={cat.name}
                  href="/marketplace"
                  className="group relative overflow-hidden rounded-2xl p-5 bg-white border border-gray-200 hover:shadow-lg hover:shadow-gray-200/50 transition-all hover:-translate-y-0.5"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cat.color} rounded-full opacity-10 -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform`} />
                  <span className="text-2xl mb-3 block">{cat.icon}</span>
                  <h3 className="font-bold text-gray-900 text-sm">{cat.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.count} tracks</p>
                </a>
              ))}
            </div>
          </section>

         {/* Featured Artists */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-5">Featured Artists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredArtists.map((artist) => (
                <a
                  key={artist.name}
                  href={`/market/artist/${artist.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-center p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-lg hover:shadow-gray-200/50 transition-all hover:-translate-y-0.5 group"
                >
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full mx-auto ring-2 ring-gray-100 group-hover:ring-violet-200 mb-3 transition-all object-cover"
                  />
                  <h3 className="font-bold text-sm text-gray-900 truncate">{artist.name}</h3>
                  <p className="text-xs text-gray-400">{artist.tracks} tracks</p>
                </a>
              ))}
            </div>
          </section>

          {/* Quick Stats mockup */}
          <section className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Platform Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Total Tracks", value: "12,450+", icon: "🎵" },
                { label: "Active Artists", value: "3,200+", icon: "🎤" },
                { label: "Daily Downloads", value: "8,500+", icon: "📥" },
                { label: "Genres", value: "25+", icon: "🎼" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="text-2xl block mb-1">{stat.icon}</span>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </SidebarLayout>
  );
}
