/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CloudUpload, 
  Download, 
  RefreshCw, 
  FileText, 
  Info,
  Calendar,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  History,
  FileSpreadsheet,
  FileCode,
  FileJson,
  FileArchive,
  Compass,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  CalendarDays,
  File,
  AlertTriangle
} from 'lucide-react';

interface PreviewRow {
  id: string;
  name: string;
  type: string;
  coordinates: string;
}

interface ActivityRow {
  id: string;
  fileName: string;
  type: 'Import' | 'Export';
  dateTime: string;
  size: string;
  status: 'Proses' | 'Berhasil' | 'Gagal';
  hasWarning?: boolean;
}

export default function ImportExport() {
  const [selectedFormat, setSelectedFormat] = useState('GeoJSON');
  const [uploadProgress, setUploadProgress] = useState(65);
  const [isUploading, setIsUploading] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState('jalan_provinsi_jabar.geojson');
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter states
  const [selectedRegion, setSelectedRegion] = useState('Semua Wilayah');
  const [selectedLayer, setSelectedLayer] = useState('Infrastruktur Jalan');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Dropdown open states
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isLayerOpen, setIsLayerOpen] = useState(false);

  // Preview Data Rows
  const previewRows: PreviewRow[] = [
    { id: 'JLB-001', name: 'Jl. Asia Afrika', type: 'Arteri', coordinates: '[-6.9213, 107.6100]' },
    { id: 'JLB-002', name: 'Jl. Braga', type: 'Kolektor', coordinates: '[-6.9175, 107.6095]' },
    { id: 'JLB-003', name: 'Jl. Riau', type: 'Kolektor', coordinates: '[-6.9063, 107.6189]' },
  ];

  // Export formats (7 formats total as requested)
  const formats = [
    { name: 'Excel', icon: <FileSpreadsheet size={16} /> },
    { name: 'CSV', icon: <FileText size={16} /> },
    { name: 'GeoJSON', icon: <FileCode size={16} /> },
    { name: 'SHP', icon: <FileArchive size={16} /> },
    { name: 'KML/KMZ', icon: <Compass size={16} /> },
    { name: 'PDF', icon: <FileText size={16} className="text-red-500" /> },
    { name: 'Word', icon: <FileText size={16} className="text-blue-500" /> }
  ];

  // Activity History (4 items requested)
  const [activityHistory, setActivityHistory] = useState<ActivityRow[]>([
    {
      id: '1',
      fileName: 'jalan_provinsi_jabar.geojson',
      type: 'Import',
      dateTime: 'Hari ini 14:30',
      size: '24.5 MB',
      status: 'Proses'
    },
    {
      id: '2',
      fileName: 'export_fasilitas_kesehatan_jkt.shp',
      type: 'Export',
      dateTime: 'Kemarin 09:15',
      size: '12.8 MB',
      status: 'Berhasil'
    },
    {
      id: '3',
      fileName: 'data_sensor_cuaca_q1_2023.csv',
      type: 'Import',
      dateTime: '12 Okt 2023',
      size: '156.2 MB',
      status: 'Berhasil'
    },
    {
      id: '4',
      fileName: 'batas_admin_error.kml',
      type: 'Import',
      dateTime: '10 Okt 2023',
      size: '3.1 MB',
      status: 'Gagal',
      hasWarning: true
    }
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleRefreshHistory = () => {
    // Complete the process mock state
    setActivityHistory(prev => prev.map(item => {
      if (item.status === 'Proses') {
        return { ...item, status: 'Berhasil' };
      }
      return item;
    }));
    setUploadProgress(100);
    setIsUploading(false);
    triggerToast('⚡ Riwayat Aktivitas berhasil di-refresh!');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
      setUploadProgress(0);
      setIsUploading(true);
      triggerToast(`📁 File ${file.name} terdeteksi. Memulai unggahan...`);

      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Insert new row in activity history
          const newAct: ActivityRow = {
            id: String(activityHistory.length + 1),
            fileName: file.name,
            type: 'Import',
            dateTime: 'Hari ini ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            status: 'Berhasil'
          };
          setActivityHistory([newAct, ...activityHistory]);
          triggerToast('✓ Import data berhasil diproses!');
        }
      }, 100);
    }
  };

  const handleExportNow = () => {
    triggerToast(`📤 Mengekspor lapisan [${selectedLayer}] dalam format [${selectedFormat}]...`);
    
    // Simulate adding to history
    setTimeout(() => {
      const newAct: ActivityRow = {
        id: String(activityHistory.length + 1),
        fileName: `export_${selectedLayer.toLowerCase().replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}.${selectedFormat.toLowerCase().split('/')[0]}`,
        type: 'Export',
        dateTime: 'Hari ini ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        size: '8.4 MB',
        status: 'Berhasil'
      };
      setActivityHistory(prev => [newAct, ...prev]);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 select-none animate-in fade-in duration-300">
      
      {/* 1. Header Title Block */}
      <div className="flex items-center justify-between bg-white/40 p-1 rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent flex items-center gap-1.5">
              Import/Export Data
            </span>
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Manage your geospatial data imports and exports securely.</p>
        </div>
      </div>

      {/* 2. Grid 2 Kolom Sejajar (Import Kiri, Export Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* CARD KIRI: Import Data */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col gap-5 hover:shadow-md transition">
          
          {/* Header Card dengan Icon Info di pojok kanan */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Import Data</h3>
            </div>
            
            {/* Icon Info */}
            <button 
              type="button"
              onClick={() => triggerToast('Mendukung pengunggahan data spasial dalam format terkompresi.')}
              className="p-1 text-slate-400 hover:text-blue-600 transition"
              title="Informasi Format"
            >
              <Info size={15} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Dropzone besar dashed border rounded-xl */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
              isDragging 
                ? 'border-blue-600 bg-blue-50/40 scale-[0.99]' 
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            {/* Icon cloud-upload biru di lingkaran biru muda */}
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 mb-3 group-hover:scale-110 transition">
              <CloudUpload size={22} className="stroke-[2.5]" />
            </div>

            <p className="text-xs text-slate-800 font-black">Tarik file ke sini atau klik untuk upload</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 max-w-xs leading-normal">
              Maksimal ukuran file: 500MB per upload. Pastikan koordinat menggunakan sistem WGS84.
            </p>

            {/* Baris FORMAT DIDUKUNG + 5 badge pill kecil */}
            <div className="flex items-center justify-center gap-2 mt-4.5">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider mr-1">Format Didukung:</span>
              <div className="flex flex-wrap gap-1">
                {['Excel', 'CSV', 'GeoJSON', 'SHP', 'KML/KMZ'].map((format) => (
                  <span 
                    key={format} 
                    className="bg-white border border-slate-200 text-slate-500 text-[8.5px] font-black px-2 py-0.5 rounded-lg shadow-sm"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Progress card file sedang upload */}
          {isUploading && (
            <div className="bg-blue-50/30 border border-blue-100/70 p-3.5 rounded-2xl flex items-start gap-3.5 animate-in fade-in duration-300">
              <div className="bg-white border border-blue-100 p-2 rounded-xl text-blue-600 shrink-0">
                <FileText size={16} className="animate-pulse stroke-[2.5]" />
              </div>
              
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black">
                  <span className="text-slate-900 truncate max-w-[190px]">{uploadedFileName}</span>
                  <span className="text-blue-700 font-mono">{uploadProgress}%</span>
                </div>
                
                {/* Progress bar biru */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-150" 
                    style={{ width: `${uploadProgress}%` }} 
                  />
                </div>
                
                <span className="text-[9px] text-slate-400 font-bold block">
                  24.5 MB • Mengunggah...
                </span>
              </div>
            </div>
          )}

          {/* Section PREVIEW DATA (AUTO-DETECTED) */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase">PREVIEW DATA (AUTO-DETECTED)</span>
              <button 
                type="button"
                onClick={() => triggerToast('Membuka modal preview lengkap seluruh data terunggah.')}
                className="text-[10px] text-blue-600 hover:text-blue-800 font-black hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            {/* Mini Table 3 Kolom + Koordinat (Sample) */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl shadow-inner bg-slate-50/20">
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-black tracking-wide">
                    <th className="py-2 px-3.5">ID</th>
                    <th className="py-2 px-3.5">Nama Jalan</th>
                    <th className="py-2 px-3.5">Tipe</th>
                    <th className="py-2 px-3.5">Koordinat (Sample)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-bold">
                  {previewRows.map((p) => (
                    <tr key={p.id} className="hover:bg-white transition-all">
                      <td className="py-2.5 px-3.5 font-black text-slate-900 font-mono">{p.id}</td>
                      <td className="py-2.5 px-3.5">{p.name}</td>
                      <td className="py-2.5 px-3.5">
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[8.5px]">
                          {p.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-slate-500 text-[9px]">{p.coordinates}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* CARD KANAN: Export Data */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col gap-5 hover:shadow-md transition">
          
          {/* Header Card dengan Icon Download di pojok kanan */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Export Data</h3>
            </div>
            
            <button 
              type="button"
              onClick={() => triggerToast('Mengekspor seluruh arsip layer spasial.')}
              className="p-1 text-slate-400 hover:text-blue-600 transition"
              title="Unduh Massal"
            >
              <Download size={15} className="stroke-[2.5]" />
            </button>
          </div>

          {/* PILIH FORMAT OUTPUT: 7 Opsi total arranged in clean grid */}
          <div className="space-y-2">
            <label className="block text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">PILIH FORMAT OUTPUT</label>
            <div className="grid grid-cols-3 gap-2">
              {formats.map((f) => {
                const isSelected = selectedFormat === f.name;
                return (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => {
                      setSelectedFormat(f.name);
                      triggerToast(`Format output diatur ke: ${f.name}`);
                    }}
                    className={`py-2.5 px-3.5 rounded-xl border text-[11px] font-black flex items-center justify-between transition-all duration-200 relative ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/40 text-blue-700 shadow-sm ring-1 ring-blue-500/10' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600 bg-white hover:text-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {f.icon}
                      <span>{f.name}</span>
                    </span>

                    {/* Dot biru di pojok kanan saat terpilih */}
                    {isSelected && (
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FILTER DATA (OPSIONAL) */}
          <div className="space-y-3.5">
            <label className="block text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">FILTER DATA (OPSIONAL)</label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              {/* Dropdown Wilayah/Regional */}
              <div className="relative">
                <span className="text-[9px] text-slate-400 font-black block mb-1 uppercase tracking-wider">Wilayah / Regional</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegionOpen(!isRegionOpen);
                    setIsLayerOpen(false);
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 flex items-center justify-between transition active:scale-[0.99]"
                >
                  <span>{selectedRegion}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isRegionOpen ? 'rotate-180' : ''}`} />
                </button>
                {isRegionOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden font-black">
                    {['Semua Wilayah', 'Jakarta Selatan', 'Jakarta Pusat', 'Bandung'].map((reg) => (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => {
                          setSelectedRegion(reg);
                          setIsRegionOpen(false);
                          triggerToast(`Wilayah ekspor: ${reg}`);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-blue-50 text-[10px] text-slate-700 transition"
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown Kategori Lapisan (Layer) */}
              <div className="relative">
                <span className="text-[9px] text-slate-400 font-black block mb-1 uppercase tracking-wider">Kategori Lapisan (Layer)</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsLayerOpen(!isLayerOpen);
                    setIsRegionOpen(false);
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 flex items-center justify-between transition active:scale-[0.99]"
                >
                  <span>{selectedLayer}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isLayerOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLayerOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden font-black">
                    {['Infrastruktur Jalan', 'Fasilitas Umum', 'Batas Administratif', 'Ruang Terbuka Hijau'].map((lay) => (
                      <button
                        key={lay}
                        type="button"
                        onClick={() => {
                          setSelectedLayer(lay);
                          setIsLayerOpen(false);
                          triggerToast(`Layer ekspor: ${lay}`);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-blue-50 text-[10px] text-slate-700 transition"
                      >
                        {lay}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Rentang Tanggal Pembaruan */}
            <div>
              <span className="text-[9px] text-slate-400 font-black block mb-1 uppercase tracking-wider">Rentang Tanggal Pembaruan</span>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition shadow-inner"
                  />
                </div>
                <span className="text-slate-400 font-bold">-</span>
                <div className="flex-1 relative">
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition shadow-inner"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Action button export */}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleExportNow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/10 transition active:scale-[0.98]"
              id="btn-export-data-now"
            >
              <Download size={14} className="stroke-[2.5]" />
              <span>📤 Export Sekarang</span>
            </button>
            <p className="text-[9px] text-slate-400 font-bold text-center leading-normal">
              Estimasi waktu pemrosesan: ~2 menit berdasarkan filter yang dipilih.
            </p>
          </div>

        </div>

      </div>

      {/* 3. Section Bawah Full-Width "Riwayat Aktivitas" */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition">
        
        {/* Header Riwayat */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History size={15} className="text-blue-600 stroke-[2.5]" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Riwayat Aktivitas</h3>
          </div>

          <button 
            type="button"
            onClick={handleRefreshHistory}
            className="text-xs text-blue-600 hover:text-blue-800 font-black flex items-center gap-1 transition active:scale-[0.98]"
            id="btn-refresh-history-logs"
          >
            <RefreshCw size={13} className="stroke-[2.5]" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Tabel Riwayat */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-inner bg-slate-50/10">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-400 font-black tracking-wider uppercase text-[9px]">
                <th className="py-3 px-4">Nama File / Task</th>
                <th className="py-3 px-4">Tipe</th>
                <th className="py-3 px-4">Tanggal & Waktu</th>
                <th className="py-3 px-4">Ukuran</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-bold">
              {activityHistory.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/40 transition">
                  {/* Nama File */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      {act.hasWarning ? (
                        <div className="p-1.5 bg-red-50 text-red-500 rounded-lg border border-red-100 shrink-0">
                          <AlertTriangle size={14} className="stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg border border-slate-200/50 shrink-0">
                          <File size={14} className="stroke-[2]" />
                        </div>
                      )}
                      <span className="font-black text-slate-900">{act.fileName}</span>
                    </div>
                  </td>

                  {/* Tipe */}
                  <td className="py-3.5 px-4 text-xs">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                      act.type === 'Import' 
                        ? 'bg-blue-50 text-blue-700 border border-blue-100/50' 
                        : 'bg-purple-50 text-purple-700 border border-purple-100/50'
                    }`}>
                      {act.type}
                    </span>
                  </td>

                  {/* Tanggal & Waktu */}
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {act.dateTime}
                  </td>

                  {/* Ukuran */}
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {act.size}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    {act.status === 'Proses' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span>Proses</span>
                      </span>
                    )}
                    {act.status === 'Berhasil' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Berhasil</span>
                      </span>
                    )}
                    {act.status === 'Gagal' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-50 text-red-800 border border-red-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span>Gagal</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Tabel pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-black gap-3 pt-2">
          <span className="uppercase tracking-wider">Menampilkan 1-4 dari 42 riwayat</span>
          
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-xl shadow-sm">
            <button 
              type="button" 
              onClick={() => triggerToast('Halaman sebelumnya')}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded"
            >
              <ChevronLeft size={14} className="stroke-[2.5]" />
            </button>
            <span className="px-2.5 text-slate-700 font-mono font-black">1</span>
            <button 
              type="button" 
              onClick={() => triggerToast('Halaman berikutnya')}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded"
            >
              <ChevronRight size={14} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

      </div>

      {/* TOAST NOTIFICATION SYSTEM */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0B1B3F] text-white border border-slate-800 py-3.5 px-4.5 rounded-2xl shadow-2xl flex items-center gap-2.5 max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center shrink-0">
            <Check size={11} className="stroke-[3]" />
          </div>
          <span className="text-[11px] font-black text-slate-200 leading-tight">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
