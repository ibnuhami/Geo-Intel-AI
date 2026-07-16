/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Ruler, 
  Signal, 
  MapPin, 
  Crosshair, 
  Camera, 
  Plus, 
  ArrowLeft, 
  Save, 
  Check, 
  Wifi, 
  Battery, 
  Sparkles,
  Info
} from 'lucide-react';

export default function SurveyLapangan() {
  const [lat, setLat] = useState('-6.2088');
  const [lng, setLng] = useState('106.8456');
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Simulated GPS coordinate retrieval
  const handleGetGPS = () => {
    setIsGpsLoading(true);
    setTimeout(() => {
      // Simulate slight shift to show it loaded fresh
      setLat('-6.2425');
      setLng('106.7981');
      setIsGpsLoading(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-100 flex items-center justify-center py-8 px-4 select-none">
      
      {/* Centered Mobile Device Mockup Container (max-width ±400px) */}
      <div className="w-full max-w-[390px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-[6px] border-slate-800 shrink-0 relative flex flex-col overflow-hidden aspect-[9/19]">
        
        {/* Phone Notch Detail */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-slate-950 rounded-full z-50 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-900 rounded-full" />
        </div>

        {/* Inner Phone Screen */}
        <div className="flex-1 bg-slate-50 rounded-[32px] overflow-hidden flex flex-col relative text-slate-800">
          
          {/* Top Status Bar (Synthesized Mobile State) */}
          <div className="h-10 bg-[#0B1B3F] text-white px-6 pt-4 flex items-center justify-between text-[10px] font-black z-30 tracking-tight">
            <span>10:45 AM</span>
            <div className="flex items-center gap-1.5">
              <Signal size={11} className="text-white" />
              <Wifi size={11} className="text-white" />
              <Battery size={13} className="text-white rotate-0" />
            </div>
          </div>

          {/* Header dalam frame: bg navy gelap, icon ruler/tools putih, judul "SurveyMaster Pro" bold putih, icon signal bar di kanan */}
          <div className="bg-[#0B1B3F] text-white px-5 py-4 flex items-center justify-between shrink-0 z-20 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <Ruler size={14} className="stroke-[2.5]" />
              </div>
              <span className="text-xs font-black tracking-wider uppercase">SurveyMaster Pro</span>
            </div>
            <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[8px] font-extrabold border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ONLINE</span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white px-5 py-4 border-b border-slate-100 shrink-0">
            <div className="flex justify-between items-center text-[10px] font-black mb-1.5">
              <span className="text-slate-500">Step 1 dari 4: Lokasi</span>
              <span className="text-blue-600">25%</span>
            </div>
            {/* Horizontal progress bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-1/4 transition-all duration-500" />
            </div>
          </div>

          {/* Scrollable Mobile Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
            
            {/* Card "Pengambilan Lokasi": icon MapPin biru + judul bold */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5">
                <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg">
                  <MapPin size={15} className="stroke-[2.5]" />
                </div>
                <h4 className="text-xs font-black text-slate-900 tracking-tight">Pengambilan Lokasi</h4>
              </div>

              {/* Tombol full width biru rounded-full/lg "Ambil Lokasi GPS Sekarang" dengan icon crosshair/target */}
              <button 
                type="button"
                onClick={handleGetGPS}
                disabled={isGpsLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-black py-3 px-4 rounded-xl shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 transition active:scale-[0.98]"
                id="btn-get-gps"
              >
                <Crosshair size={14} className={`stroke-[2.5] ${isGpsLoading ? 'animate-spin' : ''}`} />
                <span>{isGpsLoading ? 'Menyinkronkan Satelit...' : 'Ambil Lokasi GPS Sekarang'}</span>
              </button>

              {/* 2 kotak input berdampingan (readonly, bg abu muda) */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold block mb-1 uppercase tracking-wider">Latitude</span>
                  <input 
                    type="text" 
                    readOnly 
                    value={lat} 
                    className="w-full bg-slate-100 border border-slate-200/60 rounded-xl p-2.5 text-slate-600 font-bold text-center outline-none cursor-not-allowed font-mono text-[11px]"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold block mb-1 uppercase tracking-wider">Longitude</span>
                  <input 
                    type="text" 
                    readOnly 
                    value={lng} 
                    className="w-full bg-slate-100 border border-slate-200/60 rounded-xl p-2.5 text-slate-600 font-bold text-center outline-none cursor-not-allowed font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Mini map placeholder (simulasi blok bangunan biru seperti sebelumnya) dengan 1 marker pin biru solid di tengah dan label kecil "Akurasi: 3m" */}
              <div className="h-32 bg-[#E2E8F0] rounded-xl border border-slate-200 overflow-hidden relative shadow-inner">
                
                {/* SVG design for simulated layout */}
                <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 320 128">
                  {/* Road network grids */}
                  <line x1="60" y1="0" x2="60" y2="128" stroke="#CBD5E1" strokeWidth="2.5" />
                  <line x1="160" y1="0" x2="160" y2="128" stroke="#CBD5E1" strokeWidth="3.5" />
                  <line x1="260" y1="0" x2="260" y2="128" stroke="#CBD5E1" strokeWidth="2.5" />
                  <line x1="0" y1="64" x2="320" y2="64" stroke="#CBD5E1" strokeWidth="3.5" />
                  
                  {/* Decorative blue building blocks */}
                  <rect x="15" y="15" width="30" height="20" fill="#93C5FD" rx="2" />
                  <rect x="80" y="20" width="40" height="30" fill="#93C5FD" rx="2" />
                  <rect x="180" y="15" width="50" height="25" fill="#93C5FD" rx="2" />
                  
                  <rect x="15" y="80" width="35" height="30" fill="#93C5FD" rx="2" />
                  <rect x="110" y="80" width="30" height="30" fill="#93C5FD" rx="2" />
                  <rect x="220" y="80" width="45" height="35" fill="#93C5FD" rx="2" />
                  
                  {/* Decorative parks green space */}
                  <rect x="275" y="10" width="35" height="40" fill="#BBF7D0" rx="3" />
                </svg>

                {/* Central glowing solid blue marker pin */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <span className="absolute -top-1 -left-1 w-7 h-7 rounded-full bg-blue-500 animate-ping opacity-30" />
                    <div className="bg-blue-600 text-white p-1.5 rounded-full border border-white shadow-lg relative z-10">
                      <MapPin size={13} className="stroke-[3]" />
                    </div>
                  </div>
                </div>

                {/* Accuracy HUD label at bottom-right of map */}
                <span className="absolute bottom-1.5 right-1.5 bg-slate-900/85 backdrop-blur text-white text-[7px] font-mono font-black px-1.5 py-0.5 rounded border border-slate-700 shadow-sm">
                  Akurasi: 3m
                </span>
              </div>

            </div>

            {/* Card "Dokumentasi Foto": icon kamera + judul, kotak dashed border persegi dengan icon "+" untuk tambah foto (kosong/belum ada foto) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5">
                <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg">
                  <Camera size={15} className="stroke-[2.5]" />
                </div>
                <h4 className="text-xs font-black text-slate-900 tracking-tight">Dokumentasi Foto</h4>
              </div>

              {/* Square dashed border box for photo upload */}
              <div 
                onClick={() => setPhotoUploaded(!photoUploaded)}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all aspect-video ${
                  photoUploaded 
                    ? 'border-emerald-500 bg-emerald-50/10' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/30 hover:bg-slate-50'
                }`}
                id="btn-photo-upload"
              >
                {photoUploaded ? (
                  <div className="flex flex-col items-center justify-center text-center space-y-1.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check size={16} className="stroke-[3]" />
                    </div>
                    <span className="text-[10px] text-emerald-700 font-black block">Foto Gedung Terunggah</span>
                    <span className="text-[8px] text-slate-400 font-bold block">Klik untuk reset / ganti foto</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                      <Plus size={20} className="stroke-[2.5]" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-600 font-extrabold block">Tambah Foto Kamera</span>
                      <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Format JPG, PNG Maks 5MB</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Footer sticky bawah frame: 2 tombol berdampingan, masing-masing 50% lebar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white rounded-b-[32px] flex items-center gap-3 shrink-0 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
            {/* Back button */}
            <button 
              type="button"
              onClick={() => alert('Kembali ke menu utama survey')}
              className="w-1/2 py-3 border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
              id="btn-mobile-back"
            >
              <ArrowLeft size={14} className="stroke-[2.5]" />
              <span>Back</span>
            </button>
            
            {/* Next / Save button */}
            <button 
              type="button"
              onClick={() => {
                alert('Menyimpan hasil survei lapangan untuk divalidasi oleh AI...');
              }}
              className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/10 transition active:scale-[0.98]"
              id="btn-mobile-save"
            >
              <Save size={14} className="stroke-[2.5]" />
              <span>Next / Save</span>
            </button>
          </div>

        </div>

        {/* Home Button Indicator */}
        <div className="h-5 flex items-center justify-center py-2 shrink-0 z-30">
          <div className="w-24 h-1 bg-slate-800 rounded-full" />
        </div>

      </div>

      {/* Floating toast notification for GPS coordinates change */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 bg-[#0B1B3F] text-white border border-slate-800 py-3 px-4 rounded-xl shadow-2xl flex items-center gap-2.5 max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center shrink-0">
            <Sparkles size={11} className="stroke-[3]" />
          </div>
          <span className="text-[10px] font-bold text-slate-200">Koordinat satelit GPS berhasil diperbarui!</span>
        </div>
      )}

    </div>
  );
}
