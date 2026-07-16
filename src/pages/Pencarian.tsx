/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  MapPin, 
  Ruler, 
  Route, 
  Map, 
  List, 
  ChevronDown, 
  Check, 
  Clock, 
  X,
  Sliders,
  Menu,
  RotateCcw
} from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  address: string;
  areaSize: number;
  distance: number;
  category: 'BANGUNAN' | 'LAHAN' | 'FASILITAS UMUM' | string;
  categoryColor: string;
  status: 'Terverifikasi' | 'Pending' | 'Ditolak';
  mapType: 'Polygon' | 'Area' | 'Point';
  mapUrl: string;
}

export default function Pencarian() {
  // Filter States
  const [filterName, setFilterName] = useState('');
  
  // Custom Checkbox states: Bangunan, Lahan, Fasilitas Umum, Infrastruktur Jalan
  const [categories, setCategories] = useState({
    bangunan: true,
    lahan: true,
    fasum: false,
    jalan: false
  });

  // Dropdown states
  const [selectedProvinsi, setSelectedProvinsi] = useState('Semua Provinsi');
  const [selectedKabupaten, setSelectedKabupaten] = useState('Semua Kabupaten/Kota');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua Kecamatan/Desa');

  // Dropdown open states
  const [isOpenProv, setIsOpenProv] = useState(false);
  const [isOpenKab, setIsOpenKab] = useState(false);
  const [isOpenKec, setIsOpenKec] = useState(false);

  // Radius state (bind to input & slider)
  const [radius, setRadius] = useState(5.0);

  // Status Filter Pill toggles: Terverifikasi (aktif), Pending (aktif), Ditolak (tidak aktif)
  const [statusFilter, setStatusFilter] = useState({
    terverifikasi: true,
    pending: true,
    ditolak: false
  });

  // Active view toggle: 'list' (aktif) / 'map'
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');

  // Search Results
  const initialResults: SearchResult[] = [
    {
      id: '1',
      name: 'Gedung Perkantoran Sudirman',
      address: 'Kec. Setiabudi, Jakarta Selatan, DKI Jakarta',
      areaSize: 2450,
      distance: 1.2,
      category: 'BANGUNAN',
      categoryColor: 'bg-slate-100 text-slate-700 border-slate-200',
      status: 'Terverifikasi',
      mapType: 'Polygon',
      mapUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: '2',
      name: 'Lahan Kosong Ex-Pabrik',
      address: 'Kec. Pulo Gadung, Jakarta Timur, DKI Jakarta',
      areaSize: 15200,
      distance: 4.8,
      category: 'LAHAN',
      categoryColor: 'bg-orange-50 text-orange-700 border-orange-200/60',
      status: 'Pending',
      mapType: 'Area',
      mapUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: '3',
      name: 'Taman Kota Blok M',
      address: 'Kebayoran Baru, Jakarta Selatan, DKI Jakarta',
      areaSize: 5000,
      distance: 3.1,
      category: 'FASILITAS UMUM',
      categoryColor: 'bg-purple-50 text-purple-700 border-purple-200/60',
      status: 'Ditolak',
      mapType: 'Point',
      mapUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=200'
    }
  ];

  const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Reset Filters handler
  const handleReset = () => {
    setFilterName('');
    setCategories({
      bangunan: true,
      lahan: true,
      fasum: false,
      jalan: false
    });
    setSelectedProvinsi('Semua Provinsi');
    setSelectedKabupaten('Semua Kabupaten/Kota');
    setSelectedKecamatan('Semua Kecamatan/Desa');
    setRadius(5.0);
    setStatusFilter({
      terverifikasi: true,
      pending: true,
      ditolak: false
    });
    triggerToast('🔄 Filter berhasil di-reset ke kondisi awal');
  };

  // Apply filters trigger
  const handleApplyFilters = () => {
    triggerToast('⚡ Memfilter basis data spasial sesuai kriteria baru...');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start select-none animate-in fade-in duration-300">
      
      {/* LEFT COLUMN: Panel "Filter Lanjutan" (sticky, ±280px, card putih) */}
      <aside className="w-full lg:w-[280px] bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl flex flex-col shrink-0 lg:sticky lg:top-4 overflow-hidden">
        
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <SlidersHorizontal size={14} className="text-blue-600 stroke-[2.5]" />
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Filter Lanjutan</h3>
        </div>

        {/* Panel Body Scrollable Content */}
        <div className="p-4.5 space-y-5 text-xs text-slate-600 font-bold max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-none">
          
          {/* Input Filter Nama */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">Filter Nama</label>
            <input 
              type="text"
              placeholder="Masukkan nama..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10 transition-all shadow-inner"
            />
          </div>

          {/* Kategori - Checkboxes Custom rounded */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">Kategori</label>
            <div className="space-y-2 font-black text-slate-700">
              
              {/* Category 1: Bangunan */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <button
                  type="button"
                  onClick={() => setCategories({ ...categories, bangunan: !categories.bangunan })}
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    categories.bangunan 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                  }`}
                >
                  {categories.bangunan && <Check size={10} className="stroke-[3.5]" />}
                </button>
                <span className="text-[11px] group-hover:text-slate-900 transition-colors">Bangunan</span>
              </label>

              {/* Category 2: Lahan */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <button
                  type="button"
                  onClick={() => setCategories({ ...categories, lahan: !categories.lahan })}
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    categories.lahan 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                  }`}
                >
                  {categories.lahan && <Check size={10} className="stroke-[3.5]" />}
                </button>
                <span className="text-[11px] group-hover:text-slate-900 transition-colors">Lahan</span>
              </label>

              {/* Category 3: Fasilitas Umum */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <button
                  type="button"
                  onClick={() => setCategories({ ...categories, fasum: !categories.fasum })}
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    categories.fasum 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                  }`}
                >
                  {categories.fasum && <Check size={10} className="stroke-[3.5]" />}
                </button>
                <span className="text-[11px] group-hover:text-slate-900 transition-colors">Fasilitas Umum</span>
              </label>

              {/* Category 4: Infrastruktur Jalan */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <button
                  type="button"
                  onClick={() => setCategories({ ...categories, jalan: !categories.jalan })}
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    categories.jalan 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                  }`}
                >
                  {categories.jalan && <Check size={10} className="stroke-[3.5]" />}
                </button>
                <span className="text-[11px] group-hover:text-slate-900 transition-colors">Infrastruktur Jalan</span>
              </label>

            </div>
          </div>

          {/* Wilayah - 3 Dropdown bertingkat */}
          <div className="space-y-2 relative">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">Wilayah</label>
            
            {/* Dropdown 1: Provinsi */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => {
                  setIsOpenProv(!isOpenProv);
                  setIsOpenKab(false);
                  setIsOpenKec(false);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 flex items-center justify-between hover:bg-slate-50 transition active:scale-[0.99]"
              >
                <span>{selectedProvinsi}</span>
                <ChevronDown size={13} className={`text-slate-400 transition-transform ${isOpenProv ? 'rotate-180' : ''}`} />
              </button>
              {isOpenProv && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden font-black">
                  {['Semua Provinsi', 'DKI Jakarta', 'Jawa Barat', 'Banten'].map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => {
                        setSelectedProvinsi(prov);
                        setIsOpenProv(false);
                        triggerToast(`Provinsi terpilih: ${prov}`);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-[10px] text-slate-700 transition"
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 2: Kabupaten / Kota */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => {
                  setIsOpenKab(!isOpenKab);
                  setIsOpenProv(false);
                  setIsOpenKec(false);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 flex items-center justify-between hover:bg-slate-50 transition active:scale-[0.99]"
              >
                <span>{selectedKabupaten}</span>
                <ChevronDown size={13} className={`text-slate-400 transition-transform ${isOpenKab ? 'rotate-180' : ''}`} />
              </button>
              {isOpenKab && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden font-black">
                  {['Semua Kabupaten/Kota', 'Jakarta Selatan', 'Jakarta Timur', 'Kota Depok', 'Kota Bogor'].map((kab) => (
                    <button
                      key={kab}
                      type="button"
                      onClick={() => {
                        setSelectedKabupaten(kab);
                        setIsOpenKab(false);
                        triggerToast(`Kabupaten terpilih: ${kab}`);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-[10px] text-slate-700 transition"
                    >
                      {kab}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 3: Kecamatan / Desa */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => {
                  setIsOpenKec(!isOpenKec);
                  setIsOpenProv(false);
                  setIsOpenKab(false);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 flex items-center justify-between hover:bg-slate-50 transition active:scale-[0.99]"
              >
                <span>{selectedKecamatan}</span>
                <ChevronDown size={13} className={`text-slate-400 transition-transform ${isOpenKec ? 'rotate-180' : ''}`} />
              </button>
              {isOpenKec && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden font-black">
                  {['Semua Kecamatan/Desa', 'Kebayoran Baru', 'Setiabudi', 'Pulo Gadung', 'Beji'].map((kec) => (
                    <button
                      key={kec}
                      type="button"
                      onClick={() => {
                        setSelectedKecamatan(kec);
                        setIsOpenKec(false);
                        triggerToast(`Kecamatan terpilih: ${kec}`);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-[10px] text-slate-700 transition"
                    >
                      {kec}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Radius Maksimal with Input Angka Kecil + Slider Range */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">Radius Maksimal</label>
              {/* Input Angka Kecil */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 max-w-[72px]">
                <input 
                  type="number"
                  step="0.5"
                  min="0"
                  max="50"
                  value={radius}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) setRadius(Math.min(50, Math.max(0, val)));
                  }}
                  className="w-full bg-transparent text-[11px] font-mono font-black text-slate-800 focus:outline-none text-right"
                />
                <span className="text-[9px] text-slate-400 font-extrabold ml-1 font-mono">km</span>
              </div>
            </div>

            {/* Slider range */}
            <input 
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            
            {/* Range limit labels */}
            <div className="flex justify-between text-[9px] text-slate-400 font-extrabold font-mono">
              <span>0 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Status Data - 3 Pill Button Toggles */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">Status Data</label>
            <div className="flex flex-col gap-1.5">
              
              {/* Status 1: Terverifikasi */}
              <button
                type="button"
                onClick={() => {
                  setStatusFilter({ ...statusFilter, terverifikasi: !statusFilter.terverifikasi });
                  triggerToast(`${statusFilter.terverifikasi ? 'Menonaktifkan' : 'Mengaktifkan'} filter Terverifikasi`);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl border text-[11px] font-black tracking-wide transition-all flex items-center justify-between ${
                  statusFilter.terverifikasi 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-inner' 
                    : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                }`}
              >
                <span>✓ Terverifikasi</span>
                <span className={`w-1.5 h-1.5 rounded-full ${statusFilter.terverifikasi ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </button>

              {/* Status 2: Pending */}
              <button
                type="button"
                onClick={() => {
                  setStatusFilter({ ...statusFilter, pending: !statusFilter.pending });
                  triggerToast(`${statusFilter.pending ? 'Menonaktifkan' : 'Mengaktifkan'} filter Pending`);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl border text-[11px] font-black tracking-wide transition-all flex items-center justify-between ${
                  statusFilter.pending 
                    ? 'bg-amber-50 text-amber-800 border-amber-200/80 shadow-inner' 
                    : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                }`}
              >
                <span>🕐 Pending</span>
                <span className={`w-1.5 h-1.5 rounded-full ${statusFilter.pending ? 'bg-amber-500' : 'bg-slate-300'}`} />
              </button>

              {/* Status 3: Ditolak */}
              <button
                type="button"
                onClick={() => {
                  setStatusFilter({ ...statusFilter, ditolak: !statusFilter.ditolak });
                  triggerToast(`${statusFilter.ditolak ? 'Menonaktifkan' : 'Mengaktifkan'} filter Ditolak`);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl border text-[11px] font-black tracking-wide transition-all flex items-center justify-between ${
                  statusFilter.ditolak 
                    ? 'bg-slate-100 text-slate-800 border-slate-300 shadow-inner' 
                    : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                }`}
              >
                <span>⊗ Ditolak</span>
                <span className={`w-1.5 h-1.5 rounded-full ${statusFilter.ditolak ? 'bg-slate-600' : 'bg-slate-300'}`} />
              </button>

            </div>
          </div>

        </div>

        {/* Panel Footer Action Buttons */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 space-y-2">
          <button 
            type="button"
            onClick={handleApplyFilters}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/10 active:scale-[0.98]"
            id="btn-apply-filters"
          >
            <Menu size={13} className="stroke-[3]" />
            <span>☰ Terapkan Filter</span>
          </button>
          <button 
            type="button"
            onClick={handleReset}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-600 font-extrabold py-2 px-4 rounded-xl text-xs transition active:scale-[0.98] flex items-center justify-center gap-1.5"
            id="btn-reset-filters"
          >
            <RotateCcw size={12} className="stroke-[2.5]" />
            <span>Reset</span>
          </button>
        </div>

      </aside>

      {/* RIGHT COLUMN: Hasil Pencarian (flex-1) */}
      <main className="flex-1 w-full flex flex-col bg-white border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden min-h-[550px]">
        
        {/* Header Hasil Pencarian */}
        <div className="p-4.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Hasil Pencarian</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Menampilkan 42 data sesuai filter.</p>
          </div>

          {/* Toggle View: List (aktif) / Map Split */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm self-start sm:self-auto">
            <button 
              type="button"
              onClick={() => {
                setActiveView('list');
                triggerToast('Mode Tampilan: List aktif');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[10px] font-black transition-all ${
                activeView === 'list' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/40 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List size={12} className="stroke-[2.5]" />
              <span>List</span>
            </button>
            <button 
              type="button"
              onClick={() => {
                setActiveView('map');
                triggerToast('Mode Tampilan: Map Split aktif');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[10px] font-black transition-all ${
                activeView === 'map' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/40 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Map size={12} className="stroke-[2.5]" />
              <span>Map Split</span>
            </button>
          </div>
        </div>

        {/* Dynamic Main Body Content */}
        {activeView === 'list' ? (
          /* List Mode Scrollable results */
          <div className="p-5 space-y-4.5 flex-1">
            {searchResults.map((res) => (
              <div 
                key={res.id}
                className="border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 flex flex-col md:flex-row gap-4.5 hover:shadow-md transition duration-300 bg-white group"
              >
                
                {/* Thumbnail Peta Kecil Kiri */}
                <div className="w-full md:w-36 h-28 rounded-xl bg-[#E2E8F0] overflow-hidden relative shrink-0 border border-slate-200 shadow-inner flex items-center justify-center">
                  {/* Subtle map simulation svg lines inside picture background */}
                  <div className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:scale-105 transition duration-500" style={{ backgroundImage: `url('${res.mapUrl}')` }} />
                  
                  {/* Grid Lines inside photo thumbnail */}
                  <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100">
                    <line x1="25" y1="0" x2="25" y2="100" stroke="#94A3B8" strokeWidth="0.5" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="#94A3B8" strokeWidth="0.5" />
                    <line x1="75" y1="0" x2="75" y2="100" stroke="#94A3B8" strokeWidth="0.5" />
                    <line x1="0" y1="30" x2="100" y2="30" stroke="#94A3B8" strokeWidth="0.5" />
                    <line x1="0" y1="65" x2="100" y2="65" stroke="#94A3B8" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="15" fill="#3B82F6" fillOpacity="0.2" stroke="#1D4ED8" strokeWidth="1" />
                  </svg>

                  {/* Marker Pin Icon center */}
                  <div className="absolute bg-white/90 p-1.5 rounded-full shadow-md z-10 border border-slate-100 group-hover:scale-110 transition duration-300">
                    <MapPin size={15} className="text-blue-600 stroke-[2.5]" />
                  </div>

                  {/* Corner Map Type Label */}
                  <span className="absolute bottom-2 left-2 bg-[#0B1B3F]/90 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                    {res.mapType}
                  </span>
                </div>

                {/* Tengah: Deskripsi Info */}
                <div className="flex-1 flex flex-col justify-between text-xs font-bold text-slate-700 min-w-0">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-950 tracking-tight truncate leading-tight group-hover:text-blue-600 transition">
                      {res.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5 min-w-0 truncate">
                      <MapPin size={11} className="shrink-0 text-slate-400 stroke-[2.5]" />
                      <span>{res.address}</span>
                    </p>
                  </div>

                  {/* 2 Info Kecil di bawah */}
                  <div className="flex items-center gap-4.5 mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-black">
                    <div className="flex items-center gap-1.5">
                      <Ruler size={12} className="text-slate-400 stroke-[2.5]" />
                      <span>Luas:</span>
                      <span className="text-slate-700 font-mono font-black">{res.areaSize.toLocaleString()} m²</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Route size={12} className="text-slate-400 stroke-[2.5]" />
                      <span>Jarak:</span>
                      <span className="text-slate-700 font-mono font-black">{res.distance.toFixed(1)} km</span>
                    </div>
                  </div>
                </div>

                {/* Kanan: Badge Kategori & Status */}
                <div className="flex flex-row md:flex-col justify-between items-end shrink-0 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:w-32">
                  
                  {/* Category Badge top */}
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border text-right tracking-wide ${res.categoryColor}`}>
                    {res.category}
                  </span>

                  {/* Status Badge bottom */}
                  <div className="mt-auto">
                    {res.status === 'Terverifikasi' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Terverifikasi</span>
                      </span>
                    )}
                    {res.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black bg-amber-50 text-amber-800 border border-amber-200/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span>Pending</span>
                      </span>
                    )}
                    {res.status === 'Ditolak' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black bg-slate-100 text-slate-700 border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>Ditolak</span>
                      </span>
                    )}
                  </div>

                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Map Split Mode - Left List Sidebar, Right interactive map preview */
          <div className="flex-1 flex flex-col md:flex-row h-[500px]">
            {/* Sidebar list results */}
            <div className="w-full md:w-[260px] border-r border-slate-200 overflow-y-auto p-4 space-y-3 shrink-0">
              {searchResults.map((res) => (
                <div 
                  key={res.id} 
                  onClick={() => triggerToast(`Fokus ke koordinat ${res.name}`)}
                  className="p-3 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/20 cursor-pointer transition text-xs font-bold"
                >
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold">{res.category}</span>
                  <h5 className="text-slate-900 font-black mt-0.5 truncate">{res.name}</h5>
                  <p className="text-[9px] text-slate-400 font-medium truncate mt-0.5">{res.address}</p>
                </div>
              ))}
            </div>

            {/* Split map visualization */}
            <div className="flex-1 bg-slate-100 relative flex items-center justify-center">
              
              <svg className="w-full h-full absolute inset-0" viewBox="0 0 500 500">
                <defs>
                  <pattern id="splitMapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.75" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#splitMapGrid)" />
                
                {/* Simulated routes */}
                <path d="M -10,180 L 510,180" stroke="#CBD5E1" strokeWidth="8" fill="none" />
                <path d="M 220,-10 L 220,510" stroke="#CBD5E1" strokeWidth="8" fill="none" />
                
                {/* Interactive markers */}
                <circle cx="220" cy="180" r="28" fill="#3B82F6" fillOpacity="0.15" stroke="#1D4ED8" strokeWidth="1" className="animate-pulse" />
              </svg>

              {/* Map Pins overlay */}
              <div className="absolute top-[36%] left-[44%] bg-white border border-slate-200/80 shadow-lg px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] font-black text-slate-800 pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping shrink-0" />
                <span>Titik Pencarian Terpilih</span>
              </div>

              {/* Float helper instructions */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0B1B3F]/95 backdrop-blur text-white px-3 py-2 rounded-xl text-[10px] font-extrabold text-center max-w-xs mx-auto shadow-xl">
                🗺 Klik hasil list di samping untuk memindahkan fokus koordinat peta GIS.
              </div>

            </div>
          </div>
        )}

      </main>

      {/* FLOATING SYSTEM TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0B1B3F] text-white border border-slate-800 py-3 px-4.5 rounded-2xl shadow-2xl flex items-center gap-2.5 max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center shrink-0">
            <Check size={11} className="stroke-[3]" />
          </div>
          <span className="text-[11px] font-black text-slate-200 leading-tight">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
