/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  Layers, 
  Maximize2, 
  PlusCircle, 
  MinusCircle, 
  Sparkles, 
  GraduationCap, 
  Activity, 
  Zap, 
  Landmark, 
  Store, 
  Download, 
  FileDown, 
  HelpCircle, 
  Compass, 
  TrendingUp, 
  Check, 
  Users,
  ChevronDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface ChartData {
  name: string;
  Actual: number;
  Projected: number;
}

export default function AIPrediktif() {
  const [selectedLocation, setSelectedLocation] = useState('Jakarta Selatan');
  const [activeCategory, setActiveCategory] = useState('Rumah Sakit');
  const [isRunningModel, setIsRunningModel] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Categories list
  const categories = [
    { name: 'Rumah Sakit', icon: <Plus size={13} className="stroke-[3]" /> },
    { name: 'Sekolah', icon: <GraduationCap size={13} /> },
    { name: 'Koperasi', icon: <Landmark size={13} /> },
    { name: 'SPPG', icon: <Zap size={13} /> },
    { name: 'UMKM', icon: <Store size={13} /> },
    { name: 'Infrastruktur Umum', icon: <Layers size={13} /> }
  ];

  // Chart data for Recharts as requested
  const chartData: ChartData[] = [
    { name: 'Kby. Baru', Actual: 6, Projected: 9 },
    { name: 'Tebet', Actual: 4, Projected: 7 },
    { name: 'Cilandak', Actual: 5, Projected: 8 },
    { name: 'Psr. Minggu', Actual: 7, Projected: 8 },
    { name: 'Pancoran', Actual: 3, Projected: 6 }
  ];

  // Simulated Map Markers data
  const mapMarkers = [
    { id: 1, type: 'H', color: 'bg-red-500 text-white border-red-200', x: 210, y: 150, tooltip: 'Puskesmas Kebayoran Baru - Kondisi: Siaga' },
    { id: 2, type: 'S', color: 'bg-emerald-600 text-white border-emerald-200', x: 120, y: 180, tooltip: 'SMAN 70 Jakarta - Kapasitas: Padat' },
    { id: 3, type: 'K', color: 'bg-indigo-600 text-white border-indigo-200', x: 380, y: 120, tooltip: 'Koperasi Serba Usaha Tebet' },
    { id: 4, type: 'Z', color: 'bg-amber-500 text-slate-900 border-amber-200', x: 440, y: 260, tooltip: 'Stasiun Pengisian Bahan Gas SPPG' },
    { id: 5, type: 'U', color: 'bg-rose-500 text-white border-rose-200', x: 290, y: 220, tooltip: 'Sentra UMKM Pasar Minggu' },
    { id: 6, type: 'H', color: 'bg-red-500 text-white border-red-200', x: 170, y: 320, tooltip: 'Rumah Sakit Umum Cilandak' },
    { id: 7, type: 'S', color: 'bg-emerald-600 text-white border-emerald-200', x: 550, y: 190, tooltip: 'SMPN 115 Jakarta - Kapasitas: Overload' },
    { id: 8, type: 'K', color: 'bg-indigo-600 text-white border-indigo-200', x: 620, y: 280, tooltip: 'Koperasi Unit Desa Jagakarsa' },
    { id: 9, type: 'Z', color: 'bg-amber-500 text-slate-900 border-amber-200', x: 350, y: 360, tooltip: 'SPKLU Protokol Pancoran' },
    { id: 10, type: 'U', color: 'bg-rose-500 text-white border-rose-200', x: 510, y: 340, tooltip: 'Klaster UMKM Batik Betawi' }
  ];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleRunModel = () => {
    setIsRunningModel(true);
    setRunProgress(15);
    
    const interval = setInterval(() => {
      setRunProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsRunningModel(false);
            triggerToast('⚡ Model Prediktif selesai melakukan analisis proyeksi!');
          }, 300);
          return 100;
        }
        return prev + 17;
      });
    }, 150);
  };

  const handleExportReport = () => {
    triggerToast('↓ Mempersiapkan laporan PDF / CSV hasil analisis prediksi...');
  };

  return (
    <div className="flex flex-col gap-6 select-none animate-in fade-in duration-300">
      
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-1.5 rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent flex items-center gap-1.5">
              <Sparkles className="text-indigo-600 animate-pulse stroke-[2.5]" size={20} /> AI Predictive Planning
            </span>
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Forecast infrastructure demand based on population growth and density models.</p>
        </div>

        {/* Right side Location dropdown & Run Model */}
        <div className="flex items-center gap-3 bg-white border border-slate-200/80 p-2.5 rounded-xl shadow-sm">
          {/* Dropdown Lokasi */}
          <div className="relative">
            <select 
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                triggerToast(`Mengubah wilayah fokus: ${e.target.value}`);
              }}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-black text-slate-800 rounded-xl pl-3 pr-8 py-2 outline-none appearance-none cursor-pointer min-w-[150px]"
            >
              <option value="Jakarta Selatan">📍 Jakarta Selatan</option>
              <option value="Jakarta Pusat">📍 Jakarta Pusat</option>
              <option value="Jakarta Timur">📍 Jakarta Timur</option>
              <option value="Depok">📍 Kota Depok</option>
              <option value="Bogor">📍 Kabupaten Bogor</option>
            </select>
            <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none">
              <ChevronDown size={14} className="stroke-[2.5]" />
            </div>
          </div>

          <div className="w-px h-6 bg-slate-200" />

          {/* Tombol biru "⚡ Run Model" */}
          <button
            type="button"
            onClick={handleRunModel}
            disabled={isRunningModel}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-black rounded-xl px-4 py-2 flex items-center gap-1.5 shadow-md shadow-blue-600/10 transition active:scale-[0.98]"
            id="btn-run-model"
          >
            <Sparkles size={13} className={`stroke-[2.5] ${isRunningModel ? 'animate-spin' : ''}`} />
            <span>{isRunningModel ? `Running ${runProgress}%` : '⚡ Run Model'}</span>
          </button>
        </div>
      </div>

      {/* Progress banner during simulation */}
      {isRunningModel && (
        <div className="bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between text-xs font-extrabold text-blue-800 shadow-inner animate-pulse">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-xl">
              <Sparkles size={14} className="animate-spin" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-xs">Menjalankan Prediksi AI Spasial...</p>
              <p className="text-slate-400 font-medium text-[10px] mt-0.5">Memodelkan pergeseran demografis & matriks utilitas infrastruktur.</p>
            </div>
          </div>
          <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full font-mono font-black">{runProgress}%</span>
        </div>
      )}

      {/* 2. Filter Kategori Horizontal Pill Buttons */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 flex items-center gap-2 overflow-x-auto shadow-sm scrollbar-none shrink-0">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2">Filter Model:</span>
        {categories.map((cat) => {
          const isActive = cat.name === activeCategory;
          // active is solid blue with plus icon if specified, others outline
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => {
                setActiveCategory(cat.name);
                triggerToast(`Menyaring proyeksi AI: ${cat.name}`);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white border border-blue-600 shadow-md' 
                  : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border border-slate-200'
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Layout 2 Kolom (±70/30) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        
        {/* LEFT COLUMN: Map + Chart (7/10 ratio) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card Demand Prediction Map */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col relative h-[420px] group">
            
            {/* Header Map */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">🗺 Demand Prediction Map</span>
              </div>
              
              {/* Legend with spectrum */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                  <span>Low</span>
                  <div className="w-16 h-2 rounded bg-gradient-to-r from-blue-100 via-blue-400 to-blue-900 border border-slate-200" />
                  <span>High</span>
                </div>
                
                <div className="w-px h-4 bg-slate-200 mx-1" />
                
                {/* Icons layers & fullscreen */}
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => triggerToast('Menampilkan seluruh layer spasial aktif')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="Layers"
                  >
                    <Layers size={13} className="stroke-[2.5]" />
                  </button>
                  <button 
                    onClick={() => triggerToast('Fullscreen dinonaktifkan di iframe')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="Fullscreen"
                  >
                    <Maximize2 size={13} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Peta Simulasi Map Body */}
            <div className="flex-1 bg-[#E2E8F0] relative overflow-hidden cursor-crosshair">
              
              <svg className="w-full h-full absolute inset-0 select-none" viewBox="0 0 700 350">
                
                {/* Grid Pattern */}
                <defs>
                  <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#D1D5DB" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapGrid)" />

                {/* Simulated Street Network Lines */}
                <g opacity="0.5">
                  <path d="M -20,120 L 720,120" stroke="#94A3B8" strokeWidth="12" fill="none" />
                  <path d="M -20,120 L 720,120" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                  
                  <path d="M 320,-20 L 320,380" stroke="#94A3B8" strokeWidth="12" fill="none" />
                  <path d="M 320,-20 L 320,380" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />

                  <path d="M 120,-20 L 120,380" stroke="#94A3B8" strokeWidth="8" fill="none" />
                  <path d="M 560,-20 L 560,380" stroke="#94A3B8" strokeWidth="8" fill="none" />
                </g>

                {/* Building blocks (Neutral light gray) */}
                <g fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.5" opacity="0.6">
                  <rect x="30" y="30" width="60" height="40" rx="3" />
                  <rect x="200" y="30" width="80" height="45" rx="3" />
                  <rect x="420" y="30" width="50" height="30" rx="3" />
                  <rect x="15" y="220" width="70" height="50" rx="3" />
                  <rect x="450" y="220" width="60" height="40" rx="3" />
                </g>

                {/* 1 Area Polygon Biru Transparan Highlight (Demand Index: High) */}
                <polygon 
                  points="140,80 300,60 350,180 220,240 100,160"
                  fill="#3B82F6"
                  fillOpacity="0.25"
                  stroke="#1D4ED8"
                  strokeWidth="2.5"
                  className="animate-pulse"
                />

                {/* Map labels */}
                <text x="210" y="140" textAnchor="middle" className="font-mono text-[9px] font-black fill-blue-900 pointer-events-none tracking-wide bg-white/50">
                  DEMAND ZONE A
                </text>

              </svg>

              {/* 10 Marker Kecil tersebar dengan icon berbeda */}
              {mapMarkers.map((m) => (
                <div 
                  key={m.id}
                  onClick={() => triggerToast(m.tooltip)}
                  className={`absolute w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border shadow-md cursor-pointer hover:scale-125 transition-all ${m.color}`}
                  style={{ left: `${(m.x / 700) * 100}%`, top: `${(m.y / 350) * 100}%` }}
                  title={m.tooltip}
                >
                  {m.type}
                </div>
              ))}

              {/* Popup label over highlighted polygon */}
              <div className="absolute left-[32%] top-[34%] bg-blue-950/95 backdrop-blur text-white px-3 py-2 rounded-xl border border-blue-700 shadow-xl pointer-events-none animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[10px] font-black tracking-wide uppercase">Kec. Kebayoran Baru</span>
                </div>
                <div className="mt-1 pt-1 border-t border-blue-800 flex items-center justify-between gap-4 text-[9px]">
                  <span className="text-slate-400">Demand Index:</span>
                  <span className="text-amber-400 font-mono font-black">High (0.84)</span>
                </div>
              </div>

              {/* Zoom buttons +/- pojok kanan bawah */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur border border-slate-200 rounded-xl p-1.5 shadow-md flex items-center gap-1 z-10">
                <button 
                  onClick={() => {
                    setZoomLevel(prev => Math.min(200, prev + 10));
                    triggerToast('Zoom In');
                  }}
                  className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded"
                  title="Zoom In"
                >
                  <PlusCircle size={15} className="stroke-[2.5]" />
                </button>
                <span className="text-[8px] font-mono font-black text-slate-400 min-w-[32px] text-center">{zoomLevel}%</span>
                <button 
                  onClick={() => {
                    setZoomLevel(prev => Math.max(50, prev - 10));
                    triggerToast('Zoom Out');
                  }}
                  className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded"
                  title="Zoom Out"
                >
                  <MinusCircle size={15} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Compass HUD bottom left */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-md flex items-center gap-2 pointer-events-none text-[8px] font-mono font-bold text-slate-500">
                <Compass size={12} className="text-slate-400 animate-spin-slow" />
                <span>GPS SYNCHRONIZED</span>
              </div>

            </div>

          </div>

          {/* Card di bawahnya: "Gap Analysis: Healthcare Infrastructure" */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Gap Analysis: Healthcare Infrastructure</h3>
                <p className="text-slate-400 text-[10px] font-bold">Perbandingan antara jumlah fasilitas aktual dengan kebutuhan terproyeksi.</p>
              </div>
              
              {/* Custom Legend at top-right */}
              <div className="flex items-center gap-3 text-[9px] font-extrabold shrink-0">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-900 rounded" />
                  <span className="text-slate-600">Actual</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-400 rounded" />
                  <span className="text-slate-600">Projected Demand</span>
                </div>
              </div>
            </div>

            {/* Recharts Bar Chart Container */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#64748B', fontSize: 10, fontWeight: '700' }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    tick={{ fill: '#64748B', fontSize: 10, fontWeight: '700' }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0F172A', 
                      borderRadius: '12px', 
                      border: 'none', 
                      color: '#FFF',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="Actual" fill="#1E3A8A" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="Projected" fill="#60A5FA" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: AI Predictions Panel (3/10 ratio) */}
        <div className="lg:col-span-3">
          
          <div className="bg-white border border-slate-200/80 shadow-md rounded-2xl p-4.5 flex flex-col gap-4">
            
            {/* Header Panel */}
            <div>
              <div className="flex items-center gap-1.5 text-blue-700">
                <Sparkles size={14} className="stroke-[2.5]" />
                <h3 className="text-xs font-black uppercase tracking-wider">AI Predictions</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase mt-1 block">2-Year Outlook • Jakarta Selatan</span>
            </div>

            {/* 3 cards insight */}
            <div className="space-y-3.5">
              
              {/* Card 1: Puskesmas */}
              <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col gap-2.5">
                <div className="flex items-start gap-2.5">
                  {/* Red health icon badge */}
                  <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <Activity size={14} className="stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-black text-slate-900 leading-snug">
                      Prediksi: Wilayah Jakarta Selatan membutuhkan 3 Puskesmas baru dalam 2 tahun.
                    </h5>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1">
                      Driven by 12% pop. growth in Tebet & Pancoran.
                    </p>
                  </div>
                </div>

                {/* Model Confidence progress bar */}
                <div className="pt-1.5 border-t border-slate-100/60">
                  <div className="flex items-center justify-between text-[8px] font-extrabold text-slate-400 mb-1">
                    <span>MODEL CONFIDENCE</span>
                    <span className="text-red-600">92%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>

              {/* Card 2: Pendidikan SMP */}
              <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col gap-2.5">
                <div className="flex items-start gap-2.5">
                  {/* Coklat/Orange education icon badge */}
                  <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <GraduationCap size={14} />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-black text-slate-900 leading-snug">
                      Prediksi: Kapasitas SMP di Kebayoran Baru akan over-capacity sebesar 15%.
                    </h5>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1">
                      Demographic shift indicates youth bulge.
                    </p>
                  </div>
                </div>

                {/* Model Confidence progress bar */}
                <div className="pt-1.5 border-t border-slate-100/60">
                  <div className="flex items-center justify-between text-[8px] font-extrabold text-slate-400 mb-1">
                    <span>MODEL CONFIDENCE</span>
                    <span className="text-amber-700">85%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>

              {/* Card 3: SPKLU EV */}
              <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col gap-2.5">
                <div className="flex items-start gap-2.5">
                  {/* Hijau EV charging icon badge */}
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Zap size={14} className="stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-black text-slate-900 leading-snug">
                      Rekomendasi: 5 titik strategis untuk penempatan SPKLU baru di jalur protokol.
                    </h5>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1">
                      Based on traffic density and EV adoption rates.
                    </p>
                  </div>
                </div>

                {/* Model Confidence progress bar */}
                <div className="pt-1.5 border-t border-slate-100/60">
                  <div className="flex items-center justify-between text-[8px] font-extrabold text-slate-400 mb-1">
                    <span>MODEL CONFIDENCE</span>
                    <span className="text-emerald-600">78%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
              </div>

            </div>

            {/* Tombol full width outline biru di bawah panel "Export Full Report" */}
            <button
              type="button"
              onClick={handleExportReport}
              className="w-full mt-2.5 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-300 font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-[0.98]"
              id="btn-export-predictions"
            >
              <Download size={13} className="stroke-[2.5]" />
              <span>Export Full Report</span>
            </button>

          </div>

        </div>

      </div>

      {/* TOAST SYSTEM FEEDBACK */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0B1B3F] text-white border border-slate-800 py-3 px-4.5 rounded-xl shadow-2xl flex items-center gap-2.5 max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center shrink-0">
            <Check size={11} className="stroke-[3]" />
          </div>
          <span className="text-[11px] font-black text-slate-200 leading-tight">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
