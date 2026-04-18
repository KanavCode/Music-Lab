"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMarketTracks, MarketTrack } from "@/lib/api/marketClient";
import Portal from "@/components/Portal";
import MarketTrackCard from "@/components/market/MarketTrackCard";
import MarketAudioPlayer from "@/components/market/MarketAudioPlayer";
import TrackDetailsModal from "@/components/market/TrackDetailsModal";

export default function ArtistProfilePage() {
  const params = useParams();
  const artistId = params.id as string;
  
  const [tracks, setTracks] = useState<MarketTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<MarketTrack | null>(null);

  useEffect(() => {
    getMarketTracks()
      .then((data) => {
         setTracks(data.slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, [artistId]);

  // Mock Albums
  const albums = [
    { title: "Midnight Sessions", year: "2026", tracks: 12, cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80" },
    { title: "Golden Hour Beats", year: "2025", tracks: 8, cover: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5600c?w=300&q=80" },
    { title: "Street Vibes Vol.1", year: "2025", tracks: 15, cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-900 font-sans flex flex-col pb-32">
      
      {/* Header Back Button */}
      <div className="absolute top-6 left-8 z-50">
        <Link href="/marketplace" className="w-12 h-12 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-md border border-gray-200 hover:border-violet-400 transition-colors shadow-md">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="relative h-[350px] md:h-[400px] w-full overflow-hidden bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600">
         <img 
           src={`https://images.unsplash.com/photo-1598368195835-915049a4645d?w=1600&q=80`} 
           className="w-full h-full object-cover opacity-20 blur-sm scale-110" 
           alt="Artist Background" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fc] via-transparent to-transparent"></div>
         
         <div className="absolute bottom-10 left-8 md:left-24 flex items-end gap-6 md:gap-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white overflow-hidden bg-gray-200 shadow-2xl">
              <img src={`https://i.pravatar.cc/300?u=${artistId}`} alt="Artist Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                 <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-emerald-200">Verified Producer</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-gray-900">Producer {artistId}</h1>
              <p className="text-gray-500 text-sm md:text-base max-w-md">Multi-platinum certified producer. Specializing in Trap, R&B, and Cinematic soundscapes.</p>
              
              <div className="flex items-center gap-6 mt-5">
                 <div className="flex flex-col">
                    <span className="font-bold text-xl text-gray-900">4.9</span>
                    <span className="text-xs text-gray-400 uppercase font-bold">Rating</span>
                 </div>
                 <div className="w-px h-8 bg-gray-300" />
                 <div className="flex flex-col">
                    <span className="font-bold text-xl text-gray-900">12.4k</span>
                    <span className="text-xs text-gray-400 uppercase font-bold">Sales</span>
                 </div>
                 <div className="w-px h-8 bg-gray-300" />
                 <div className="flex flex-col">
                    <span className="font-bold text-xl text-gray-900">84</span>
                    <span className="text-xs text-gray-400 uppercase font-bold">Tracks</span>
                 </div>
              </div>
            </div>
         </div>
      </div>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 md:px-24 mt-10 space-y-14">
        
        {/* Albums / Discography */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-3">
            💿 Discography
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div key={album.title} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 transition-all hover:-translate-y-0.5 group cursor-pointer">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img src={album.cover} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900">{album.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{album.year} • {album.tracks} tracks</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Tracks */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-3">
            Popular Catalog 
            <span className="text-gray-400 font-normal text-base">({tracks.length})</span>
          </h2>
          
          {loading ? (
             <div className="animate-pulse flex gap-6 text-gray-400">Loading tracks...</div>
          ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tracks.map(track => (
                   <MarketTrackCard 
                     key={track.id} 
                     track={track} 
                     onClick={setSelectedTrack}
                   />
                ))}
             </div>
          )}
        </section>

        {/* Company / Label Info */}
        <section className="bg-white border border-gray-200 rounded-2xl p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">About & Label</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Biography</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Started producing beats in 2020, quickly rising through the Indian beat-making community. 
                Known for blending traditional Indian instruments with modern trap and hip-hop production. 
                Has worked with multiple independent artists and has had tracks featured in web series and short films.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Label</h3>
                <p className="text-gray-900 font-medium">MusicLab Independent</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Location</h3>
                <p className="text-gray-900 font-medium">Mumbai, India</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Member Since</h3>
                <p className="text-gray-900 font-medium">January 2024</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Portal>
        {selectedTrack && (
          <TrackDetailsModal 
            track={selectedTrack} 
            onClose={() => setSelectedTrack(null)} 
          />
        )}
        <MarketAudioPlayer />
      </Portal>
    </div>
  );
}
