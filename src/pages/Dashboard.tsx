/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  MapPin, 
  ClipboardCheck, 
  Map, 
  AlertTriangle, 
  Download, 
  ChevronDown, 
  Eye, 
  Building2, 
  Plus,
  ZoomIn,
  ZoomOut,
  Calendar,
  Heart,
  GraduationCap,
  Store,
  Maximize2,
  Check,
  SlidersHorizontal,
  X,
  FileSpreadsheet
} from 'lucide-react';

export default function Dashboard() {
  const [provinsi, setProvinsi] = useState('DKI Jakarta');
  const [wilayah, setWilayah] = useState('Semua Wilayah');
  const [periode, setPeriode] = useState('7 Hari Terakhir');

  const [showProvMenu, setShowProvMenu] = useState(false);
  const [showWilMenu, setShowWilMenu] = useState(false);
  const [showPeriodeMenu, setShowPeriodeMenu] = useState(false);
  
  // Fullscreen heat map mock state
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Recharts weekly data (Sen - Min)
  const weeklyData = [
    { name: 'Sen', value: 120 },
    { name: 'Sel', value: 210 },
    { name: 'Rab', value: 150 },
    { name: 'Kam', value: 290 },
    { name: 'Jum', value: 240 },
    { name: 'Sab', value: 340, active: true },
    { name: 'Min', value: 280 }
  ];

  // Custom Bar Label Component to show "340" overlay tooltip permanently above Saturday
  const CustomBarLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (value !== 340) return null;
    return (
      <g>
        {/* Tooltip speech bubble container */}
        <rect 
          x={x + width / 2 - 22} 
          y={y - 32} 
          width="44" 
          height="22" 
          rx="6" 
          fill="#0B1B3F" 
          className="shadow-md"
        />
        {/* Tooltip speech bubble arrow */}
        <polygon 
          points={`${x + width / 2 - 4},${y - 10} ${x + width / 2 + 4},${y - 10} ${x + width / 2},${y - 6}`} 
          fill="#0B1B3F" 
        />
        <text 
          x={x + width / 2} 
          y={y - 17} 
          fill="#FFFFFF" 
          textAnchor="middle" 
          fontSize="10" 
          fontWeight="bold"
        >
          340
        </text>
      </g>
    );
  };

  // Category list
  const categories = [
    { name: 'Fasilitas Kesehatan', count: 4200, max: 5000, color: 'bg-blue-600', icon: Heart, textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Pendidikan', count: 3150, max: 5000, color: 'bg-purple-600', icon: GraduationCap, textColor: 'text-purple-600', bgColor: 'bg-purple-50' },
    { name: 'Area Komersial', count: 2800, max: 5000, color: 'bg-amber-500', icon: Store, textColor: 'text-amber-500', bgColor: 'bg-amber-50' }
  ];

  // Dummy activities specified in prompt
  const dummyActivities = [
    { id: 'AST-2023-091', category: 'Klinik', location: 'Kec. Kebayoran Baru', surveyor: 'Budi S.', status: 'Valid', categoryColor: 'bg-blue-50 text-blue-700 border border-blue-100', statusColor: 'bg-emerald-50 text-emerald-700' },
    { id: 'AST-2023-092', category: 'Ruko', location: 'Kec. Tebet', surveyor: 'Ani R.', status: 'Review', categoryColor: 'bg-amber-50 text-amber-700 border border-amber-100', statusColor: 'bg-amber-50 text-amber-700' },
    { id: 'AST-2023-093', category: 'Sekolah', location: 'Kec. Menteng', surveyor: 'Citra M.', status: 'Valid', categoryColor: 'bg-purple-50 text-purple-700 border border-purple-100', statusColor: 'bg-emerald-50 text-emerald-700' }
  ];

  return (
    <div className="space-y-6 md:space-y-8 select-none">
      
      {/* HEADER: Judul besar, subteks, dropdown filters, export button */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight" id="dashboard-title">Dashboard Analytics</h2>
          <p className="text-slate-500 text-xs mt-1 font-semibold">Ringkasan performa pemetaan dan validasi AI harian.</p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Dropdown Provinsi */}
          <div className="relative">
            <button 
              onClick={() => { setShowProvMenu(!showProvMenu); setShowWilMenu(false); setShowPeriodeMenu(false); }}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 flex items-center gap-2 transition"
              id="dropdown-provinsi"
            >
              <span className="text-slate-400 font-semibold">Provinsi:</span>
              <span className="text-slate-900 font-extrabold">{provinsi}</span>
              <ChevronDown size={14} className="text-slate-500" />
            </button>
            {showProvMenu && (
              <div className="absolute left-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs font-bold text-slate-700">
                {['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten'].map((p) => (
                  <button 
                    key={p}
                    onClick={() => { setProvinsi(p); setShowProvMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown Desa/Kel */}
          <div className="relative">
            <button 
              onClick={() => { setShowWilMenu(!showWilMenu); setShowProvMenu(false); setShowPeriodeMenu(false); }}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 flex items-center gap-2 transition"
              id="dropdown-wilayah"
            >
              <span className="text-slate-400 font-semibold">Desa/Kel:</span>
              <span className="text-slate-900 font-extrabold">{wilayah}</span>
              <ChevronDown size={14} className="text-slate-500" />
            </button>
            {showWilMenu && (
              <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs font-bold text-slate-700">
                {['Semua Wilayah', 'Kec. Kebayoran Baru', 'Kec. Tebet', 'Kec. Menteng', 'Kec. Setiabudi'].map((w) => (
                  <button 
                    key={w}
                    onClick={() => { setWilayah(w); setShowWilMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    {w}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown Periode (dengan icon kalender) */}
          <div className="relative">
            <button 
              onClick={() => { setShowPeriodeMenu(!showPeriodeMenu); setShowProvMenu(false); setShowWilMenu(false); }}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 flex items-center gap-2 transition"
              id="dropdown-periode"
            >
              <Calendar size={14} className="text-slate-500" />
              <span className="text-slate-900 font-extrabold">{periode}</span>
              <ChevronDown size={14} className="text-slate-500" />
            </button>
            {showPeriodeMenu && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs font-bold text-slate-700">
                {['Hari Ini', '7 Hari Terakhir', '30 Hari Terakhir', 'Tahun Ini'].map((per) => (
                  <button 
                    key={per}
                    onClick={() => { setPeriode(per); setShowPeriodeMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    {per}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Button Export Data (icon Download, bg biru) */}
          <button 
            className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-extrabold rounded-xl px-4 py-2 shadow-md shadow-blue-600/10 flex items-center gap-2 transition"
            id="btn-export-data"
            title="Ekspor seluruh data pemetaan"
          >
            <Download size={14} />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* GRID 4 KARTU STATISTIK (grid-cols-4 gap-4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: TOTAL ASET TERPETAKAN */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition duration-300">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
            <Plus size={20} className="stroke-[3]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase block">TOTAL ASET TERPETAKAN</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">12,450</h3>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 border border-emerald-100">
              <span className="text-[11px] font-black">↑</span> +5.2% minggu ini
            </span>
          </div>
        </div>

        {/* Card 2: TOTAL SURVEY SELESAI */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition duration-300">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl flex items-center justify-center border border-emerald-100 shrink-0">
            <ClipboardCheck size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase block">TOTAL SURVEY SELESAI</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">8,192</h3>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 border border-emerald-100">
              <span className="text-[11px] font-black">↑</span> +2.1% minggu ini
            </span>
          </div>
        </div>

        {/* Card 3: WILAYAH TERCOVER */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition duration-300">
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl flex items-center justify-center border border-indigo-100 shrink-0">
            <Map size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase block">WILAYAH TERCOVER</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">45<span className="text-slate-400 font-normal text-sm">/50</span></h3>
            <span className="text-slate-500 text-[10px] font-extrabold block mt-2.5">
              Kecamatan Aktif
            </span>
          </div>
        </div>

        {/* Card 4: VALIDASI AI PENDING */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition duration-300">
          <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center justify-center border border-red-100 shrink-0">
            <AlertTriangle size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase block">VALIDASI AI PENDING</span>
            <h3 className="text-2xl font-black text-red-600 mt-1.5 tracking-tight">342</h3>
            <a 
              href="/ai-intelligence" 
              className="inline-block text-blue-600 hover:text-blue-800 text-[10px] font-black mt-2.5 hover:underline"
            >
              Tinjau Sekarang →
            </a>
          </div>
        </div>

      </div>

      {/* BARIS KEDUA: GRID 2 KOLOM (Tren Pemetaan + Heatmap) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card Kiri: Tren Pemetaan Mingguan (2/3 width) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h4 className="text-sm font-black text-slate-900">Tren Pemetaan Mingguan</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Analisis kuantitas entitas spasial tervalidasi per hari</p>
            </div>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-extrabold border border-blue-100">
              Puncak: Hari Sabtu
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={weeklyData} margin={{ top: 25, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                <Tooltip cursor={{ fill: 'rgba(37, 99, 235, 0.03)' }} />
                <Bar 
                  dataKey="value" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                  label={<CustomBarLabel />}
                >
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === 'Sab' ? '#0B1B3F' : '#BFDBFE'} 
                    />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card Kanan: Kepadatan Data Heatmap (1/3 width) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h4 className="text-sm font-black text-slate-900">Kepadatan Data (Heatmap)</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Konsentrasi data sebaran objek terpetakan</p>
            </div>
            
            {/* Fullscreen Expand Button di Pojok */}
            <button 
              onClick={() => setIsFullscreenMap(true)}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-200 p-2 rounded-xl transition"
              title="Expand Fullscreen"
              id="btn-expand-heatmap"
            >
              <Maximize2 size={13} />
            </button>
          </div>

          {/* Choropleth Map Placeholder Sederhana */}
          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden min-h-[220px] flex items-center justify-center">
            
            {/* Simulated Heatmap Grid of different regions */}
            <div 
              className="absolute inset-0 p-4 grid grid-cols-4 grid-rows-3 gap-1.5 transition-all duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {[
                { name: 'Kec. Menteng', class: 'bg-blue-900/90 text-white', density: 'Sangat Tinggi (940)', id: 'MNT' },
                { name: 'Kec. Gambir', class: 'bg-blue-700/80 text-white', density: 'Tinggi (680)', id: 'GMB' },
                { name: 'Kec. Senen', class: 'bg-blue-500/70 text-white', density: 'Sedang-Tinggi (450)', id: 'SNN' },
                { name: 'Kec. Tebet', class: 'bg-blue-800/90 text-white', density: 'Sangat Tinggi (890)', id: 'TBT' },
                { name: 'Kec. Kebayoran Baru', class: 'bg-blue-900/95 text-white', density: 'Kepadatan Ekstrim (1,240)', id: 'KYB' },
                { name: 'Kec. Setiabudi', class: 'bg-blue-600/70 text-white', density: 'Sedang (390)', id: 'STB' },
                { name: 'Kec. Palmerah', class: 'bg-blue-400/60 text-slate-800', density: 'Rendah-Sedang (210)', id: 'PLM' },
                { name: 'Kec. Tanah Abang', class: 'bg-blue-800/80 text-white', density: 'Tinggi (790)', id: 'TAB' },
                { name: 'Kec. Kemayoran', class: 'bg-blue-500/60 text-slate-800', density: 'Sedang (310)', id: 'KMY' },
                { name: 'Kec. Penjaringan', class: 'bg-blue-300/50 text-slate-700', density: 'Rendah (120)', id: 'PJR' },
                { name: 'Kec. Kelapa Gading', class: 'bg-blue-700/75 text-white', density: 'Tinggi (620)', id: 'KGD' },
                { name: 'Kec. Matraman', class: 'bg-blue-200/40 text-slate-600', density: 'Sangat Rendah (70)', id: 'MTR' }
              ].map((reg, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedRegion(selectedRegion === reg.name ? null : reg.name)}
                  className={`${reg.class} rounded-lg p-2 flex flex-col justify-between text-left text-[8px] font-black tracking-tight cursor-pointer hover:ring-2 hover:ring-blue-500 transition relative overflow-hidden`}
                >
                  <span>{reg.id}</span>
                  <span className="truncate max-w-full block">{reg.name}</span>
                  
                  {selectedRegion === reg.name && (
                    <div className="absolute inset-0 bg-[#0B1B3F] text-white p-1.5 flex flex-col justify-center text-center">
                      <span className="text-[7px] text-slate-400 uppercase">Density</span>
                      <span className="text-[9px] font-bold leading-tight mt-0.5">{reg.density}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Legend Gradient "Kepadatan" di Pojok Kiri Bawah */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur border border-slate-200 rounded-lg p-2 shadow-md">
              <span className="text-[8px] text-slate-500 font-bold block mb-1">Kepadatan</span>
              <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-600">
                <span>Rendah</span>
                <div className="w-16 h-1.5 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-950 rounded-full" />
                <span>Tinggi</span>
              </div>
            </div>

            {/* Tombol Zoom +/- di Pojok Kanan Bawah */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-1 shadow-md rounded-lg overflow-hidden border border-slate-200">
              <button 
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))}
                className="bg-white hover:bg-slate-50 p-1.5 text-slate-600 border-b border-slate-100 transition"
                title="Zoom In"
              >
                <ZoomIn size={12} />
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 1))}
                className="bg-white hover:bg-slate-50 p-1.5 text-slate-600 transition"
                title="Zoom Out"
              >
                <ZoomOut size={12} />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* BARIS KETIGA: CARD "Distribusi Kategori Aset" */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h4 className="text-sm font-black text-slate-900">Distribusi Kategori Aset</h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Statistik proporsi klasifikasi kategori fasilitas utama wilayah</p>
          </div>
          <a href="/aset-fasilitas" className="text-xs text-blue-600 hover:underline font-extrabold" id="link-aset-detail">
            Lihat Detail
          </a>
        </div>

        {/* 3 Progress bars horizontal with icon, label, and number */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`${cat.bgColor} ${cat.textColor} p-2 rounded-lg border border-slate-200/40`}>
                      <IconComponent size={16} />
                    </div>
                    <span className="text-xs font-extrabold text-slate-800">{cat.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{(cat.count).toLocaleString()}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                      style={{ width: `${(cat.count / cat.max) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                    <span>{((cat.count / cat.max) * 100).toFixed(0)}% Kapasitas Terpetakan</span>
                    <span>Max: {cat.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BARIS KEEMPAT: CARD "Aktivitas Survey Terbaru" */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h4 className="text-sm font-black text-slate-900">Aktivitas Survey Terbaru</h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Entri data dan log validasi instan paling kini</p>
          </div>
          <a href="/survey-lapangan" className="text-xs text-blue-600 hover:underline font-extrabold">
            Lihat Semua
          </a>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] text-slate-400 font-extrabold tracking-wider uppercase">
                <th className="py-3 px-4 rounded-l-xl">ID ASET</th>
                <th className="py-3 px-4">KATEGORI</th>
                <th className="py-3 px-4">LOKASI</th>
                <th className="py-3 px-4">SURVEYOR</th>
                <th className="py-3 px-4">STATUS AI</th>
                <th className="py-3 px-4 text-center rounded-r-xl">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
              {dummyActivities.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/50 transition duration-150">
                  <td className="py-3.5 px-4 font-extrabold text-blue-600">{act.id}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${act.categoryColor}`}>
                      {act.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-600">{act.location}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#0B1B3F]/10 text-[#0B1B3F] flex items-center justify-center font-black text-[10px] border border-[#0B1B3F]/5">
                        {act.surveyor.substring(0, 2)}
                      </div>
                      <span className="font-bold text-slate-800">{act.surveyor}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                      act.status === 'Valid' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {act.status === 'Valid' ? (
                        <Check size={11} className="stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                      {act.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button 
                      className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-xl transition"
                      title="Lihat Detail Survey"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULLSCREEN MAP DIALOG */}
      {isFullscreenMap && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#0B1B3F] text-white">
              <div>
                <h3 className="text-sm font-black">Visualisasi Kepadatan Wilayah Nusantara</h3>
                <p className="text-[10px] text-slate-300">Resolusi Tinggi Heatmap GIS Regional</p>
              </div>
              <button 
                onClick={() => { setIsFullscreenMap(false); setSelectedRegion(null); }}
                className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 bg-slate-50 relative flex items-center justify-center overflow-hidden">
              <div 
                className="w-full h-full p-8 grid grid-cols-4 grid-rows-3 gap-3 transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel + 0.3})` }}
              >
                {[
                  { name: 'Kec. Menteng', class: 'bg-blue-900/90 text-white', density: 'Sangat Tinggi (940)', id: 'MNT' },
                  { name: 'Kec. Gambir', class: 'bg-blue-700/80 text-white', density: 'Tinggi (680)', id: 'GMB' },
                  { name: 'Kec. Senen', class: 'bg-blue-500/70 text-white', density: 'Sedang-Tinggi (450)', id: 'SNN' },
                  { name: 'Kec. Tebet', class: 'bg-blue-800/90 text-white', density: 'Sangat Tinggi (890)', id: 'TBT' },
                  { name: 'Kec. Kebayoran Baru', class: 'bg-blue-900/95 text-white', density: 'Kepadatan Ekstrim (1,240)', id: 'KYB' },
                  { name: 'Kec. Setiabudi', class: 'bg-blue-600/70 text-white', density: 'Sedang (390)', id: 'STB' },
                  { name: 'Kec. Palmerah', class: 'bg-blue-400/60 text-slate-800', density: 'Rendah-Sedang (210)', id: 'PLM' },
                  { name: 'Kec. Tanah Abang', class: 'bg-blue-800/80 text-white', density: 'Tinggi (790)', id: 'TAB' },
                  { name: 'Kec. Kemayoran', class: 'bg-blue-50/60 text-slate-800', density: 'Sedang (310)', id: 'KMY' },
                  { name: 'Kec. Penjaringan', class: 'bg-blue-300/50 text-slate-700', density: 'Rendah (120)', id: 'PJR' },
                  { name: 'Kec. Kelapa Gading', class: 'bg-blue-700/75 text-white', density: 'Tinggi (620)', id: 'KGD' },
                  { name: 'Kec. Matraman', class: 'bg-blue-200/40 text-slate-600', density: 'Sangat Rendah (70)', id: 'MTR' }
                ].map((reg, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedRegion(selectedRegion === reg.name ? null : reg.name)}
                    className={`${reg.class} rounded-xl p-4 flex flex-col justify-between text-left text-xs font-black cursor-pointer hover:ring-4 hover:ring-blue-500/50 transition relative overflow-hidden`}
                  >
                    <span>{reg.id}</span>
                    <span className="text-xs">{reg.name}</span>
                    
                    {selectedRegion === reg.name && (
                      <div className="absolute inset-0 bg-[#0B1B3F] text-white p-4 flex flex-col justify-center text-center">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">Density Score</span>
                        <span className="text-sm font-black leading-tight mt-1">{reg.density}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Float overlays in expanded view */}
              <div className="absolute bottom-6 left-6 bg-white border border-slate-200 rounded-xl p-3 shadow-xl">
                <span className="text-[10px] text-slate-400 font-extrabold block mb-1 uppercase tracking-wider">Legend</span>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <span>Rendah (70)</span>
                  <div className="w-24 h-2 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-950 rounded-full" />
                  <span>Tinggi (1,240)</span>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 flex gap-2">
                <button 
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))}
                  className="bg-white hover:bg-slate-50 p-2.5 text-slate-600 border border-slate-200 rounded-xl shadow-xl transition"
                >
                  <ZoomIn size={14} />
                </button>
                <button 
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                  className="bg-white hover:bg-slate-50 p-2.5 text-slate-600 border border-slate-200 rounded-xl shadow-xl transition"
                >
                  <ZoomOut size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
