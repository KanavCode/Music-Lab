"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function MarketUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setCoverImage(selected);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const removeCover = () => {
    setCoverImage(null);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-900 font-sans flex flex-col">
      <header className="px-8 py-5 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 flex items-center gap-4">
        <Link href="/marketplace" className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200 hover:border-violet-400 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Upload to Marketplace</h1>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-8 flex flex-col gap-8">
        
        {/* Upload Zone */}
        <div 
          className={`w-full p-12 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all ${dragActive ? 'border-violet-500 bg-violet-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Drag & Drop your Track</h2>
          <p className="text-gray-500 mb-6">WAV, MP3, or FLAC up to 50MB</p>
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            accept="audio/*"
            onChange={(e) => { if(e.target.files) setFile(e.target.files[0]) }}
          />
          <label htmlFor="file-upload" className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold uppercase tracking-wider text-sm rounded-full cursor-pointer transition shadow-lg shadow-violet-200">
            Browse Files
          </label>

          {file && (
            <div className="mt-8 p-4 bg-gray-50 rounded-xl flex items-center gap-4 w-full max-w-md border border-gray-200">
               <div className="w-10 h-10 bg-violet-600 rounded flex items-center justify-center font-bold text-xs uppercase text-white">
                 {file.name.split('.').pop()}
               </div>
               <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-bold truncate text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
               </div>
               <button onClick={() => setFile(null)} className="p-2 text-gray-400 hover:text-red-500 transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
               </button>
            </div>
          )}
        </div>

        {/* Metadata Form */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-gray-900">Track Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Track Title</label>
                <input type="text" placeholder="e.g. Neon Dreams" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 placeholder:text-gray-400" />
             </div>
             
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Primary Genre</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-violet-500 cursor-pointer appearance-none">
                  <option>Hip Hop</option>
                  <option>Trap</option>
                  <option>R&B</option>
                  <option>Pop</option>
                  <option>EDM</option>
                  <option>Bollywood</option>
                  <option>Lo-Fi</option>
                  <option>Classical Fusion</option>
                </select>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tempo (BPM)</label>
                <input type="number" placeholder="120" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 placeholder:text-gray-400" />
             </div>
             
             {/* FIXED: Cover Art Upload — now wired to a real file input */}
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cover Art (Optional)</label>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="cover-upload"
                  onChange={handleCoverSelect}
                />
                {coverPreview ? (
                  <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <img src={coverPreview} alt="Cover preview" className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{coverImage?.name}</p>
                      <p className="text-xs text-gray-500">{coverImage ? (coverImage.size / 1024).toFixed(0) + " KB" : ""}</p>
                    </div>
                    <button onClick={removeCover} className="p-1.5 text-gray-400 hover:text-red-500 transition">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="cover-upload"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-400 cursor-pointer hover:border-violet-400 hover:bg-violet-50 flex items-center justify-between transition-all"
                  >
                    <span className="text-sm">Choose image...</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </label>
                )}
             </div>
          </div>

          <div className="space-y-2 mt-6">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pricing (Standard Lease)</label>
             <div className="relative">
                <span className="absolute left-4 top-[14px] text-gray-400 font-bold">₹</span>
                <input type="number" placeholder="2999" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-gray-900 font-bold focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 placeholder:text-gray-400" />
             </div>
             <p className="text-xs text-gray-400">Exclusive rights will be automatically priced at 10x the standard lease.</p>
          </div>

          <button className="w-full mt-10 py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-violet-200 transition-all outline-none active:scale-[0.98]">
            List Track for Sale
          </button>
        </div>
      </main>
    </div>
  );
}
