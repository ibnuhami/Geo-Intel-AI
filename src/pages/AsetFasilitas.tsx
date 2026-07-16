/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  Map as MapIcon, 
  ChevronLeft, 
  ChevronRight,
  MapPin, 
  Calendar,
  Layers,
  X,
  ExternalLink,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  category: string;
  status: 'Terverifikasi' | 'Pending';
  timestamp: string;
  coordinates: [number, number];
  areaSize: number;
  address: string;
  imageUrl: string;
  subtext: string;
  surveyor: string;
}

export default function AsetFasilitas() {
  const navigate = useNavigate();

  // Initial 6 dummy assets requested by the user
  const initialAssets: Asset[] = [
    {
      id: 'AST-2023-001',
      name: 'Puskesmas Kebon Jeruk',
      category: 'Kesehatan',
      status: 'Terverifikasi',
      timestamp: '2h ago',
      coordinates: [-6.1924, 106.7724],
      areaSize: 4200,
      address: 'Jl. Raya Kebon Jeruk No. 2, Kebon Jeruk, Jakarta Barat',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400',
      subtext: 'Pusat Kesehatan Masyarakat Kecamatan',
      surveyor: 'Budi S.'
    },
    {
      id: 'AST-2023-002',
      name: 'RSUD Tarakan',
      category: 'Rumah Sakit',
      status: 'Terverifikasi',
      timestamp: '1d ago',
      coordinates: [-6.1725, 106.8105],
      areaSize: 18500,
      address: 'Jl. Kyai Caringin No. 7, Cideng, Gambir, Jakarta Pusat',
      imageUrl: 'https://images.unsplash.com/photo-1586773860418-d3b3da9601ee?auto=format&fit=crop&q=80&w=400',
      subtext: 'Rumah Sakit Umum Daerah Rujukan Utama',
      surveyor: 'Ani R.'
    },
    {
      id: 'AST-2023-003',
      name: 'SMAN 70 Jakarta',
      category: 'Sekolah',
      status: 'Pending',
      timestamp: '3h ago',
      coordinates: [-6.2425, 106.7981],
      areaSize: 12450,
      address: 'Jl. Bulungan No. 1, Kramat Pela, Kebayoran Baru, Jakarta Selatan',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400',
      subtext: 'Sekolah Menengah Atas Negeri Unggulan',
      surveyor: 'Citra M.'
    },
    {
      id: 'AST-2023-004',
      name: 'Koperasi Merah Putih',
      category: 'Koperasi',
      status: 'Terverifikasi',
      timestamp: '5d ago',
      coordinates: [-6.2301, 106.8194],
      areaSize: 1500,
      address: 'Jl. Jenderal Sudirman Kav. 21, Karet Semanggi, Jakarta Selatan',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400',
      subtext: 'Koperasi Jasa Keuangan Sejahtera Bersama',
      surveyor: 'Budi S.'
    },
    {
      id: 'AST-2023-005',
      name: 'Gudang Logistik Cakung',
      category: 'Industri',
      status: 'Terverifikasi',
      timestamp: '1w ago',
      coordinates: [-6.1524, 106.7821],
      areaSize: 24000,
      address: 'Kawasan Industri Terpadu Cakung Blok B-3, Cakung, Jakarta Timur',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
      subtext: 'Kawasan Pergudangan Logistik Distribusi',
      surveyor: 'Dedi K.'
    },
    {
      id: 'AST-2023-006',
      name: 'BUMDes Maju Bersama',
      category: 'BUMDes',
      status: 'Pending',
      timestamp: '2w ago',
      coordinates: [-6.2891, 106.8452],
      areaSize: 3100,
      address: 'Jl. Sirsak No. 45, Jagakarsa, Jakarta Selatan',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
      subtext: 'Badan Usaha Milik Desa Unit Usaha Mandiri',
      surveyor: 'Eka P.'
    }
  ];

  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  
  // Default active asset is SMAN 70 Jakarta as per request (or fallback to first item if deleted)
  const [activeAsset, setActiveAsset] = useState<Asset | null>(initialAssets[2]);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState('Kesehatan');
  const [newAssetAddress, setNewAssetAddress] = useState('');
  const [newAssetStatus, setNewAssetStatus] = useState<'Terverifikasi' | 'Pending'>('Terverifikasi');
  const [newAssetArea, setNewAssetArea] = useState('5000');
  const [newAssetSubtext, setNewAssetSubtext] = useState('');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Category list as described in request plus others
  const categories = [
    'Semua', 
    'Rumah Sakit', 
    'Puskesmas', 
    'Sekolah', 
    'UMKM', 
    'Koperasi', 
    'Industri', 
    'BUMDes'
  ];

  // Map Category to colors as described
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Kesehatan':
        return 'bg-emerald-500 text-white';
      case 'Rumah Sakit':
        return 'bg-blue-500 text-white';
      case 'Sekolah':
        return 'bg-amber-500 text-white';
      case 'Koperasi':
        return 'bg-pink-500 text-white';
      case 'Industri':
        return 'bg-slate-500 text-white';
      case 'BUMDes':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName || !newAssetAddress) return;

    // Map categories to a coordinate to render nicely
    const mockCoord: [number, number] = [
      -6.2 + (Math.random() - 0.5) * 0.15,
      106.8 + (Math.random() - 0.5) * 0.15
    ];

    const newObj: Asset = {
      id: `AST-2023-0${assets.length + 10}`,
      name: newAssetName,
      category: newAssetCategory,
      status: newAssetStatus,
      timestamp: 'Just now',
      coordinates: [parseFloat(mockCoord[0].toFixed(4)), parseFloat(mockCoord[1].toFixed(4))],
      areaSize: parseInt(newAssetArea) || 3500,
      address: newAssetAddress,
      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=400',
      subtext: newAssetSubtext || `Fasilitas layanan ${newAssetCategory} regional`,
      surveyor: 'Admin Nusantara'
    };

    setAssets([newObj, ...assets]);
    setActiveAsset(newObj);
    setShowAddModal(false);

    // Reset Form
    setNewAssetName('');
    setNewAssetAddress('');
    setNewAssetSubtext('');
    setNewAssetArea('5000');
  };

  // Filtered Assets
  const filteredAssets = assets.filter(asset => {
    const matchesCat = selectedCategory === 'Semua' || asset.category === selectedCategory;
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 md:space-y-8 select-none">
      
      {/* 1. HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight" id="header-aset-title">
            Asset & Facility Mapping
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-semibold">
            Manage and track your geospatial assets.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative max-w-xs hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari nama atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-extrabold rounded-xl px-4 py-2.5 shadow-md shadow-blue-600/10 flex items-center gap-2 transition"
            id="btn-add-asset"
          >
            <Plus size={15} className="stroke-[3]" />
            <span>Tambah Aset</span>
          </button>
        </div>
      </div>

      {/* 2. FILTER TABS & VIEW TOGGLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        
        {/* Scrollable horizontal pills */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center overflow-x-auto gap-1.5 scrollbar-none pb-1 md:pb-0 scroll-smooth">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              // To match prompt requirement: "Kopera..." (terpotong) for Koperasi
              const displayName = cat === 'Koperasi' ? 'Kopera...' : cat;
              
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-black tracking-tight shrink-0 transition ${
                    isSelected 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                  title={cat}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        </div>

        {/* View Mode Toggle: 3 Icons (Grid, List, Map) */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1.5 rounded-xl self-end md:self-auto shadow-inner shrink-0">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            title="Grid View"
            id="toggle-view-grid"
          >
            <Grid size={15} className="stroke-[2.5]" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            title="List View"
            id="toggle-view-list"
          >
            <List size={15} className="stroke-[2.5]" />
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            title="Simulated Map View"
            id="toggle-view-map"
          >
            <MapIcon size={15} className="stroke-[2.5]" />
          </button>
        </div>

      </div>

      {/* 3. LAYOUT: 2 COLUMN (Grid/List content + Preview Lokasi sticky) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT COLUMN: Main listing area (flex-1) */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          
          {filteredAssets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Search size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-900">Aset Tidak Ditemukan</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto font-medium">
                Tidak ada data aset spasial yang sesuai dengan filter pencarian atau kategori Anda saat ini.
              </p>
              <button 
                onClick={() => { setSelectedCategory('Semua'); setSearchTerm(''); }}
                className="mt-4 text-xs font-extrabold text-blue-600 hover:underline"
              >
                Reset Filter & Pencarian
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            
            /* GRID VIEW (3 columns layout as specified) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAssets.map((asset) => {
                const isActive = activeAsset?.id === asset.id;
                return (
                  <div 
                    key={asset.id}
                    onClick={() => setActiveAsset(asset)}
                    className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col group ${
                      isActive 
                        ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg' 
                        : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {/* Thumbnail Image Container */}
                    <div className="relative h-44 bg-slate-100 overflow-hidden shrink-0">
                      <img 
                        src={asset.imageUrl} 
                        alt={asset.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Overlay Category Badge - Pojok kiri atas */}
                      <span className={`absolute top-3.5 left-3.5 text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md ${getCategoryColor(asset.category)}`}>
                        {asset.category}
                      </span>

                      {/* Overlay More Options Button - Pojok kanan atas */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Opsi untuk aset ${asset.name}`);
                        }}
                        className="absolute top-3.5 right-3.5 bg-black/40 hover:bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center transition"
                        title="Opsi Lainnya"
                      >
                        <MoreVertical size={13} className="stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-1">
                          {asset.name}
                        </h4>
                        
                        <p className="text-[10px] text-slate-500 flex items-start gap-1 font-bold leading-relaxed line-clamp-2">
                          <MapPin size={11} className="shrink-0 mt-0.5 text-slate-400" />
                          <span>{asset.address}</span>
                        </p>
                      </div>

                      {/* Bottom row: status dot + badge and relative time */}
                      <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 text-[10px] text-slate-400 font-black">
                        
                        {/* Status Badge with dot */}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                          asset.status === 'Terverifikasi' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            asset.status === 'Terverifikasi' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`} />
                          <span>{asset.status}</span>
                        </span>

                        <span className="text-slate-400 font-semibold">{asset.timestamp}</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          ) : viewMode === 'list' ? (
            
            /* LIST VIEW */
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-extrabold tracking-wider uppercase">
                      <th className="py-3 px-5">NAMA ASET</th>
                      <th className="py-3 px-5">KATEGORI</th>
                      <th className="py-3 px-5">ALAMAT LENGKAP</th>
                      <th className="py-3 px-5">STATUS AI</th>
                      <th className="py-3 px-5">TANGGAL</th>
                      <th className="py-3 px-5 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                    {filteredAssets.map((asset) => {
                      const isActive = activeAsset?.id === asset.id;
                      return (
                        <tr 
                          key={asset.id}
                          onClick={() => setActiveAsset(asset)}
                          className={`hover:bg-slate-50/70 transition cursor-pointer ${
                            isActive ? 'bg-blue-50/40 text-blue-900' : ''
                          }`}
                        >
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                <img src={asset.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <span className="font-black text-slate-900">{asset.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <span className={`inline-block text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getCategoryColor(asset.category)}`}>
                              {asset.category}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-slate-500 font-semibold max-w-xs truncate">
                            {asset.address}
                          </td>
                          <td className="py-4 px-5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${
                              asset.status === 'Terverifikasi' ? 'text-emerald-700' : 'text-amber-700'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                asset.status === 'Terverifikasi' ? 'bg-emerald-500' : 'bg-amber-500'
                              }`} />
                              <span>{asset.status}</span>
                            </span>
                          </td>
                          <td className="py-4 px-5 text-slate-400 font-semibold">{asset.timestamp}</td>
                          <td className="py-4 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => setActiveAsset(asset)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition"
                              title="Tampilkan Detail"
                            >
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          ) : (
            
            /* SIMULATED MAP VIEW INSIDE MAIN AREA */
            <div className="bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-[500px] relative">
              <div className="absolute inset-0 bg-[#F1F5F9] overflow-hidden">
                
                {/* SVG decorative road lines & blocks */}
                <svg className="w-full h-full absolute inset-0 opacity-40" viewBox="0 0 800 500">
                  {/* Streets */}
                  <line x1="100" y1="0" x2="100" y2="500" stroke="#CBD5E1" strokeWidth="6" />
                  <line x1="400" y1="0" x2="400" y2="500" stroke="#CBD5E1" strokeWidth="8" />
                  <line x1="700" y1="0" x2="700" y2="500" stroke="#CBD5E1" strokeWidth="6" />
                  <line x1="0" y1="150" x2="800" y2="150" stroke="#CBD5E1" strokeWidth="8" />
                  <line x1="0" y1="350" x2="800" y2="350" stroke="#CBD5E1" strokeWidth="6" />
                  
                  {/* Building blocks scattered */}
                  <rect x="150" y="50" width="30" height="30" fill="#93C5FD" rx="2" />
                  <rect x="220" y="80" width="20" height="40" fill="#93C5FD" rx="2" />
                  <rect x="480" y="200" width="45" height="30" fill="#93C5FD" rx="3" />
                  <rect x="620" y="60" width="30" height="30" fill="#93C5FD" rx="2" />
                  <rect x="120" y="420" width="40" height="25" fill="#93C5FD" rx="2" />
                  <rect x="250" y="380" width="35" height="35" fill="#93C5FD" rx="2" />
                  
                  {/* Green Park area */}
                  <path d="M 500 380 Q 550 340 620 400 T 700 450 T 600 480 Z" fill="#DCFCE7" />
                </svg>

                {/* Map Pins overlay based on indexes to render in distinct positions */}
                {filteredAssets.map((asset, index) => {
                  const isActive = activeAsset?.id === asset.id;
                  
                  // Static distributed coordinates inside the container
                  const layoutPositions = [
                    { x: '18%', y: '25%' }, // Puskesmas Jeruk
                    { x: '45%', y: '38%' }, // RSUD Tarakan
                    { x: '35%', y: '72%' }, // SMAN 70 Jakarta
                    { x: '58%', y: '28%' }, // Koperasi Merah Putih
                    { x: '72%', y: '48%' }, // Gudang Logistik
                    { x: '60%', y: '80%' }  // BUMDes Maju
                  ];
                  
                  // Wrap layout positions to prevent array bounds crash
                  const pos = layoutPositions[index % layoutPositions.length];

                  return (
                    <div 
                      key={asset.id}
                      className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300"
                      style={{ left: pos.x, top: pos.y }}
                      onClick={() => setActiveAsset(asset)}
                    >
                      <div className="flex flex-col items-center">
                        <div className={`p-2.5 rounded-full transition shadow-lg border-2 ${
                          isActive 
                            ? 'bg-blue-600 text-white scale-110 border-white ring-4 ring-blue-500/30' 
                            : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                        }`}>
                          <MapPin size={18} className="stroke-[2.5]" />
                        </div>
                        <div className="bg-[#0B1B3F] text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm mt-1 whitespace-nowrap border border-slate-700">
                          {asset.name}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Map Floating Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-md text-[10px] font-bold text-slate-700">
                  <span className="block mb-1.5 text-slate-400">PILIH MARKER</span>
                  <p className="leading-tight">Klik pada salah satu marker untuk melihat detail spasial.</p>
                </div>

              </div>
            </div>

          )}

          {/* 4. PAGINATION CONTROLS */}
          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 flex items-center justify-between text-xs font-black text-slate-600 shadow-sm">
            <span className="text-slate-400 font-semibold">
              Menampilkan {filteredAssets.length} dari {assets.length} Aset
            </span>
            
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 hover:bg-slate-50 border border-slate-100 rounded-xl transition text-slate-400 hover:text-slate-800">
                <ChevronLeft size={15} />
              </button>
              
              <button className="bg-blue-600 text-white w-7 h-7 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/10 transition">
                1
              </button>
              
              <button className="hover:bg-slate-50 border border-slate-100 w-7 h-7 rounded-xl flex items-center justify-center transition">
                2
              </button>
              
              <button className="hover:bg-slate-50 border border-slate-100 w-7 h-7 rounded-xl flex items-center justify-center transition">
                3
              </button>
              
              <span className="text-slate-300 px-1 font-semibold">...</span>

              <button className="p-1.5 hover:bg-slate-50 border border-slate-100 rounded-xl transition text-slate-400 hover:text-slate-800">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

        </div>

        {/* 5. RIGHT COLUMN: "Preview Lokasi" Sticky Panel (Lebar ±300px) */}
        {activeAsset ? (
          <div className="w-full lg:w-[300px] lg:sticky lg:top-6 bg-white border border-slate-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300 shrink-0">
            
            {/* Panel Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-black text-slate-900 tracking-tight">Preview Lokasi</span>
              <button 
                onClick={() => setActiveAsset(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition"
                title="Sembunyikan Panel"
                id="btn-close-preview"
              >
                <X size={15} className="stroke-[2.5]" />
              </button>
            </div>

            <div className="p-4 space-y-4 text-slate-800">
              
              {/* Mini Map Placeholder (Simulasi peta kecil seperti GIS dengan 1 marker) */}
              <div className="h-40 bg-[#E2E8F0] rounded-xl border border-slate-200 relative overflow-hidden shadow-inner">
                
                {/* SVG design for mini map layout */}
                <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 300 160">
                  <line x1="50" y1="0" x2="50" y2="160" stroke="#CBD5E1" strokeWidth="3" />
                  <line x1="150" y1="0" x2="150" y2="160" stroke="#CBD5E1" strokeWidth="4" />
                  <line x1="250" y1="0" x2="250" y2="160" stroke="#CBD5E1" strokeWidth="3" />
                  <line x1="0" y1="80" x2="300" y2="80" stroke="#CBD5E1" strokeWidth="4" />
                  
                  {/* Decorative green OpenSpace */}
                  <rect x="180" y="20" width="80" height="40" fill="#BBF7D0" rx="4" />
                  <rect x="20" y="100" width="60" height="40" fill="#BBF7D0" rx="4" />
                </svg>

                {/* Central Glowing Pulsing Marker */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <span className="absolute -top-1.5 -left-1.5 w-10 h-10 rounded-full bg-blue-500 animate-ping opacity-25" />
                    <div className="bg-blue-600 text-white p-2 rounded-full border border-white shadow-xl relative z-10">
                      <MapPin size={16} className="stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                {/* Mini coordinates scale overlay */}
                <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[8px] font-mono px-2 py-0.5 rounded border border-slate-700 shadow-sm">
                  GIS SCANNER LIVE
                </span>
              </div>

              {/* Detail Content */}
              <div className="space-y-1.5">
                <span className={`inline-block text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full ${getCategoryColor(activeAsset.category)}`}>
                  {activeAsset.category}
                </span>
                <h3 className="text-sm font-black text-slate-950 tracking-tight leading-tight pt-1">
                  {activeAsset.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                  {activeAsset.subtext}
                </p>
              </div>

              {/* Grid 2 boxes info */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                  <span className="text-[9px] text-slate-400 font-extrabold block uppercase tracking-wider">Koordinat</span>
                  <span className="text-[10px] font-black text-slate-800 block mt-1.5 font-mono">
                    {activeAsset.coordinates[0]}, {activeAsset.coordinates[1]}
                  </span>
                </div>
                
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                  <span className="text-[9px] text-slate-400 font-extrabold block uppercase tracking-wider">Area Polygon</span>
                  <span className="text-[10px] font-black text-slate-800 block mt-1.5">
                    {activeAsset.areaSize.toLocaleString()} m²
                  </span>
                </div>
              </div>

              {/* Extra Metadata */}
              <div className="border-t border-slate-100 pt-3.5 space-y-2 text-[10px] font-bold text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Surveyor Lapangan:</span>
                  <span className="text-slate-800">{activeAsset.surveyor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Identifikasi ID:</span>
                  <span className="text-slate-800 font-mono">{activeAsset.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Status Validasi:</span>
                  <span className={activeAsset.status === 'Terverifikasi' ? 'text-emerald-600' : 'text-amber-600'}>
                    {activeAsset.status}
                  </span>
                </div>
              </div>

              {/* Outline Button: "Buka di Peta GIS" */}
              <button 
                onClick={() => navigate('/peta-gis')}
                className="w-full bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-300 text-xs font-black py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
                id="btn-goto-gis"
              >
                <ExternalLink size={14} className="stroke-[2.5]" />
                <span>Buka di Peta GIS</span>
              </button>

            </div>

          </div>
        ) : (
          /* Empty / fallback state when active asset is cleared */
          <div className="w-full lg:w-[300px] bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center shrink-0 lg:sticky lg:top-6">
            <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Layers size={16} />
            </div>
            <h4 className="text-xs font-black text-slate-800">Tidak Ada Aset Terpilih</h4>
            <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">
              Silakan klik salah satu kartu aset di kolom kiri untuk meninjau pratinjau koordinat satelit GIS di sini.
            </p>
          </div>
        )}

      </div>

      {/* 4. MODAL: TAMBAH ASET BARU */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-slate-800 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600" />
                Tambah Aset Baru
              </h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-slate-400 hover:text-slate-600 w-6 h-6 rounded-lg hover:bg-slate-50 flex items-center justify-center font-black transition"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddAsset} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-600 font-extrabold mb-1.5">Nama Kawasan / Aset</label>
                <input 
                  type="text" 
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  placeholder="Contoh: SMAN 70 Jakarta" 
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-bold text-slate-800 bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-extrabold mb-1.5">Kategori</label>
                  <select 
                    value={newAssetCategory}
                    onChange={(e) => setNewAssetCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 outline-none font-bold bg-white text-slate-800"
                  >
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Rumah Sakit">Rumah Sakit</option>
                    <option value="Sekolah">Sekolah</option>
                    <option value="Koperasi">Koperasi</option>
                    <option value="Industri">Industri</option>
                    <option value="BUMDes">BUMDes</option>
                    <option value="UMKM">UMKM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-extrabold mb-1.5">Status Validasi</label>
                  <select 
                    value={newAssetStatus}
                    onChange={(e) => setNewAssetStatus(e.target.value as 'Terverifikasi' | 'Pending')}
                    className="w-full border border-slate-200 rounded-xl p-2.5 outline-none font-bold bg-white text-slate-800"
                  >
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-extrabold mb-1.5">Luas Area (m²)</label>
                  <input 
                    type="number" 
                    value={newAssetArea}
                    onChange={(e) => setNewAssetArea(e.target.value)}
                    placeholder="Contoh: 12450" 
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-bold text-slate-800 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-extrabold mb-1.5">Keterangan Subteks</label>
                  <input 
                    type="text" 
                    value={newAssetSubtext}
                    onChange={(e) => setNewAssetSubtext(e.target.value)}
                    placeholder="Contoh: Sekolah Unggulan" 
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-bold text-slate-800 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-extrabold mb-1.5">Alamat Lengkap</label>
                <textarea 
                  value={newAssetAddress}
                  onChange={(e) => setNewAssetAddress(e.target.value)}
                  placeholder="Masukkan jalan, kecamatan, kode pos..." 
                  rows={3}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-bold text-slate-800 bg-slate-50/50 resize-none"
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="border border-slate-200 text-slate-700 font-extrabold px-4 py-2 rounded-xl hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2 rounded-xl shadow-md shadow-blue-600/10 transition active:scale-[0.98]"
                >
                  Simpan Aset
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
