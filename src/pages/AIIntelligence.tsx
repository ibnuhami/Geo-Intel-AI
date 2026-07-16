/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Copy, 
  Shapes, 
  Search, 
  Download, 
  Send, 
  Bot, 
  Building2, 
  Milestone, 
  ShoppingBag, 
  TreePine, 
  ExternalLink, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Filter
} from 'lucide-react';

interface AnalysisRow {
  id: string;
  type: string;
  category: 'Fasilitas Umum' | 'Infrastruktur Jalan' | 'Area Komersial' | 'Ruang Terbuka Hijau' | string;
  region: string;
  confidenceScore: number;
  aiStatus: 'Valid' | 'Perlu Review' | 'Invalid';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  hasActions?: boolean;
}

export default function AIIntelligence() {
  // Tabs config
  const tabs = [
    'Validasi Data', 
    'Deteksi Duplikasi', 
    'Klasifikasi Objek', 
    'Analisis Spasial', 
    'Rekomendasi Lokasi', 
    'AI Report Generator'
  ];
  const [activeTab, setActiveTab] = useState('Validasi Data');
  const [searchQuery, setSearchQuery] = useState('');

  // 4 Dummy rows as requested
  const initialRows: AnalysisRow[] = [
    { id: '#GEO-8021', type: 'Fasilitas Umum', category: 'Fasilitas Umum', region: 'Jakarta Selatan', confidenceScore: 0.98, aiStatus: 'Valid' },
    { id: '#GEO-8022', type: 'Infrastruktur Jalan', category: 'Infrastruktur Jalan', region: 'Jakarta Selatan', confidenceScore: 0.65, aiStatus: 'Perlu Review' },
    { id: '#GEO-8023', type: 'Area Komersial', category: 'Area Komersial', region: 'Depok', confidenceScore: 0.20, aiStatus: 'Invalid' },
    { id: '#GEO-8024', type: 'Ruang Terbuka Hijau', category: 'Ruang Terbuka Hijau', region: 'Bogor', confidenceScore: 0.95, aiStatus: 'Valid' },
  ];

  const [rows, setRows] = useState<AnalysisRow[]>(initialRows);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'anomalies_only'>('all');

  // Running validation states
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);

  // Chat message state (starts with 2 pre-baked AI assistant messages as requested)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Berdasarkan analisis terbaru, terdapat **5% anomali** pada data koordinat di wilayah Jakarta Selatan. Disarankan untuk melakukan pengecekan ulang pada `batch #802`.',
      timestamp: '10:48',
      hasActions: true
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text: 'Model klasifikasi objek selesai training dengan tingkat akurasi model 98%.',
      timestamp: '10:49'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Toast / Notifications state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Run validation emulation
  const handleRunValidation = () => {
    setIsValidating(true);
    setValidationProgress(10);
    
    const interval = setInterval(() => {
      setValidationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsValidating(false);
            // Randomize confidence scores slightly to simulate AI run
            setRows(prevRows => prevRows.map(r => ({
              ...r,
              confidenceScore: Math.round(Math.min(1.0, Math.max(0.1, r.confidenceScore + (Math.random() * 0.1 - 0.05))) * 100) / 100
            })));
            triggerToast('⚡ Validasi AI selesai memproses seluruh basis data spasial!');
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  // Search filtering + Option to filter only anomalies via the AI assistant trigger
  const filteredRows = rows.filter(row => {
    // text search matching
    const query = searchQuery.toLowerCase();
    const matchesSearch = row.id.toLowerCase().includes(query) || 
                          row.type.toLowerCase().includes(query) || 
                          row.region.toLowerCase().includes(query) || 
                          row.aiStatus.toLowerCase().includes(query);

    if (filterMode === 'anomalies_only') {
      return matchesSearch && row.aiStatus !== 'Valid';
    }
    return matchesSearch;
  });

  // Bulk Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredRows.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Export action
  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(filteredRows, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `GeoIntel_AI_Logs_${activeTab.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('↓ Log Analisis berhasil diexport ke JSON!');
  };

  // AI Chat Submit Handler
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsgId = `msg-user-${Date.now()}`;
    const userMessageText = chatInput;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Answer mock simulation
    setTimeout(() => {
      let aiResponseText = '';
      const textLower = userMessageText.toLowerCase();

      if (textLower.includes('anomali') || textLower.includes('anomali') || textLower.includes('error')) {
        aiResponseText = 'Mendeteksi anomali spasial di Jakarta Selatan (batch #802) akibat overlap koordinat tanah seluas 12.4m². Silakan klik tombol "Lihat Anomali" di pesan pertama untuk menyaring peta log.';
      } else if (textLower.includes('jakarta') || textLower.includes('depok') || textLower.includes('bogor')) {
        aiResponseText = `Melakukan pemindaian regional di Jawa Barat & Jakarta. Tingkat keyakinan model rata-rata untuk data Wilayah Jabodetabek berada pada rentang 92.4% hingga 98.2%.`;
      } else if (textLower.includes('export') || textLower.includes('unduh')) {
        aiResponseText = 'Anda dapat mengunduh seluruh data tabel log validasi saat ini dengan menekan tombol "↓ Export" di pojok kanan atas tabel.';
      } else {
        aiResponseText = `Sistem Geospatial AI memproses permintaan Anda. Model Klasifikasi Objek v4.2 siap mengidentifikasi layer data spasial baru secara real-time. Ada yang bisa saya bantu lagi?`;
      }

      setMessages(prev => [...prev, {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  // Render object type icons
  const renderTypeIcon = (category: string) => {
    switch (category) {
      case 'Fasilitas Umum':
        return <Building2 size={13} className="text-blue-500 shrink-0" />;
      case 'Infrastruktur Jalan':
        return <Milestone size={13} className="text-amber-500 shrink-0" />;
      case 'Area Komersial':
        return <ShoppingBag size={13} className="text-rose-500 shrink-0" />;
      case 'Ruang Terbuka Hijau':
        return <TreePine size={13} className="text-emerald-500 shrink-0" />;
      default:
        return <Shapes size={13} className="text-slate-500 shrink-0" />;
    }
  };

  // Helper colors for confidence score bar
  const getConfidenceBarColor = (score: number) => {
    if (score >= 0.8) return 'bg-emerald-500';
    if (score >= 0.5) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Helper status tags
  const getStatusBadge = (status: 'Valid' | 'Perlu Review' | 'Invalid') => {
    switch (status) {
      case 'Valid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Valid</span>
          </span>
        );
      case 'Perlu Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Perlu Review</span>
          </span>
        );
      case 'Invalid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>Invalid</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 select-none animate-in fade-in duration-300">
      
      {/* 1. Sub-navigation tab horizontal di atas */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                triggerToast(`Pindah ke modul: ${tab}`);
              }}
              className={`px-3.5 py-2 text-xs font-black tracking-wide rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/50 shadow-inner' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {tab === 'Validasi Data' && <CheckCircle size={12} className="stroke-[2.5]" />}
                {tab === 'Deteksi Duplikasi' && <Copy size={12} className="stroke-[2.5]" />}
                {tab === 'Klasifikasi Objek' && <Shapes size={12} className="stroke-[2.5]" />}
                {tab}
              </span>
            </button>
          ))}
        </div>

        {/* Searchbar kecil di ujung kanan tab bar */}
        <div className="relative w-full md:w-56">
          <Search size={13} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 stroke-[2.5]" />
          <input 
            type="text" 
            placeholder="Cari log atau wilayah..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-700"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={11} className="stroke-[3]" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 bg-white/40 p-1 rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-1.5">
              <Sparkles className="text-violet-600 animate-pulse stroke-[2.5]" size={20} /> AI Intelligence Analysis
            </span>
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Sistem validasi, deteksi duplikasi koordinat, dan klasifikasi otomatis berbasis kecerdasan buatan.</p>
        </div>

        <div className="flex items-center gap-4.5 bg-white border border-slate-200/80 p-3 rounded-2xl shadow-sm">
          {/* Accuracy display */}
          <div className="text-right">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 justify-end">
              <span>Overall AI Accuracy</span>
              <span className="text-violet-600 font-extrabold bg-violet-50 px-1.5 py-0.5 rounded border border-violet-100">94%</span>
            </div>
            {/* progress bar gradient ungu-ke-pink kecil */}
            <div className="w-32 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full" 
                style={{ width: '94%' }} 
              />
            </div>
          </div>

          <div className="w-px h-8 bg-slate-200" />

          {/* Tombol biru "⚡ Jalankan Validasi AI" */}
          <button 
            type="button"
            onClick={handleRunValidation}
            disabled={isValidating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-black rounded-xl px-4 py-2.5 flex items-center gap-1.5 shadow-md shadow-blue-600/10 transition active:scale-[0.98]"
            id="btn-run-validation"
          >
            <RefreshCw size={13} className={`stroke-[2.5] ${isValidating ? 'animate-spin' : ''}`} />
            <span>{isValidating ? `Validating ${validationProgress}%` : '⚡ Jalankan Validasi AI'}</span>
          </button>
        </div>
      </div>

      {/* Emulated validation screen progress alert */}
      {isValidating && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between text-xs font-extrabold text-blue-800 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-xl">
              <RefreshCw size={14} className="animate-spin" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-xs">Memproses Validasi AI...</p>
              <p className="text-slate-500 font-medium text-[10px] mt-0.5">Memindai koordinat ganda dan akurasi batas wilayah.</p>
            </div>
          </div>
          <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full font-mono font-black">{validationProgress}%</span>
        </div>
      )}

      {/* 3. Layout 2 kolom: kiri (±75%) & kanan (±25%) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* LEFT COLUMN: 3 cards + Log Table (Grid 3/4) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* 3 kartu statistik horizontal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: DATA TERVALIDASI */}
            <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-sm flex items-start gap-3.5 hover:shadow-md transition">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl shrink-0">
                <Check size={18} className="stroke-[3]" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">DATA TERVALIDASI</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1 leading-none">12,450</h3>
                <span className="text-emerald-600 text-[10px] font-extrabold mt-2 block flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full w-max border border-emerald-100">
                  <span>↗ +2.4% dari bulan lalu</span>
                </span>
              </div>
            </div>

            {/* Card 2: DUPLIKASI TERDETEKSI */}
            <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-sm flex items-start gap-3.5 hover:shadow-md transition">
              <div className="bg-amber-50 text-amber-600 p-3 rounded-xl shrink-0">
                <Copy size={18} className="stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">DUPLIKASI TERDETEKSI</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1 leading-none">84</h3>
                <span className="text-red-600 text-[10px] font-extrabold mt-2 block flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-full w-max border border-red-100">
                  <span>⚠ Perlu review segera</span>
                </span>
              </div>
            </div>

            {/* Card 3: OBJEK TERKLASIFIKASI */}
            <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-sm flex items-start gap-3.5 hover:shadow-md transition">
              <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl shrink-0">
                <Shapes size={18} className="stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">OBJEK TERKLASIFIKASI</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1 leading-none">5,200</h3>
                <span className="text-emerald-600 text-[10px] font-extrabold mt-2 block flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full w-max border border-emerald-100">
                  <span>↗ Akurasi model 98.2%</span>
                </span>
              </div>
            </div>

          </div>

          {/* Card "Log Analisis Survei" + tabel log */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col">
            
            {/* Header Card */}
            <div className="p-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 bg-blue-600 rounded-sm block" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Log Analisis Survei</h3>
                {filterMode === 'anomalies_only' && (
                  <span className="bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1">
                    <Filter size={10} />
                    <span>Filter: Hanya Anomali</span>
                    <button onClick={() => setFilterMode('all')} className="hover:text-red-900 font-bold ml-1">✕</button>
                  </span>
                )}
              </div>
              
              <button 
                type="button"
                onClick={handleExport}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-xs font-black text-slate-700 rounded-xl px-3 py-1.5 flex items-center gap-1.5 transition active:scale-[0.98] shadow-sm"
                id="btn-export-logs"
              >
                <Download size={13} className="stroke-[2.5]" />
                <span>↓ Export</span>
              </button>
            </div>

            {/* Table wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-400 font-black tracking-wider uppercase text-[9px]">
                    <th className="py-3 px-4 w-10 text-center">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={filteredRows.length > 0 && selectedIds.length === filteredRows.length}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer" 
                      />
                    </th>
                    <th className="py-3 px-4">ID Data</th>
                    <th className="py-3 px-4">Tipe Objek</th>
                    <th className="py-3 px-4">Wilayah</th>
                    <th className="py-3 px-4">Confidence Score</th>
                    <th className="py-3 px-4">AI Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-bold">
                  {filteredRows.length > 0 ? (
                    filteredRows.map((row) => {
                      const isSelected = selectedIds.includes(row.id);
                      return (
                        <tr 
                          key={row.id} 
                          className={`hover:bg-slate-50/50 transition-all ${
                            isSelected ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-3.5 px-4 text-center">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => handleSelectRow(row.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer" 
                            />
                          </td>

                          {/* ID Data (link biru) */}
                          <td className="py-3.5 px-4 font-mono">
                            <a 
                              href={`#${row.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                triggerToast(`Membuka detail survey untuk ID: ${row.id}`);
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 w-max"
                            >
                              <span>{row.id}</span>
                              <ExternalLink size={10} className="opacity-60" />
                            </a>
                          </td>

                          {/* Tipe Objek */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg shrink-0">
                                {renderTypeIcon(row.category)}
                              </span>
                              <span className="text-slate-800 text-[11px]">{row.type}</span>
                            </div>
                          </td>

                          {/* Wilayah */}
                          <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                            {row.region}
                          </td>

                          {/* Confidence Score progress bar mini horizontal */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2 max-w-[140px]">
                              <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${getConfidenceBarColor(row.confidenceScore)}`}
                                  style={{ width: `${row.confidenceScore * 100}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono tracking-tight shrink-0">
                                {row.confidenceScore.toFixed(2)}
                              </span>
                            </div>
                          </td>

                          {/* AI Status badge dot */}
                          <td className="py-3.5 px-4">
                            {getStatusBadge(row.aiStatus)}
                          </td>

                          {/* Aksi */}
                          <td className="py-3.5 px-4 text-right">
                            <button 
                              type="button"
                              onClick={() => triggerToast(`Reviewing data ${row.id}...`)}
                              className="text-[10px] bg-slate-100 hover:bg-blue-600 hover:text-white border border-slate-200 hover:border-blue-600 text-slate-600 font-extrabold px-2.5 py-1 rounded-lg transition"
                            >
                              Review
                            </button>
                          </td>

                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-bold bg-slate-50/30">
                        Tidak ada log validasi yang cocok dengan pencarian Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Stats Info */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-extrabold gap-3">
              <span className="uppercase tracking-wider">Menampilkan {filteredRows.length} dari {rows.length} total baris log</span>
              {selectedIds.length > 0 && (
                <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full">
                  {selectedIds.length} baris terpilih untuk tindakan massal
                </span>
              )}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: AI Assistant Chat (Grid 1/4) */}
        <div className="xl:col-span-1">
          
          {/* Panel AI Assistant Card */}
          <div className="bg-white border border-slate-200/80 shadow-xl rounded-2xl flex flex-col overflow-hidden min-h-[500px]">
            
            {/* Header Navy Gelap rounded-t */}
            <div className="bg-[#0B1B3F] text-white p-4.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md">
                  <Bot size={18} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wider uppercase leading-none">AI Assistant</h4>
                  <span className="text-[8px] text-emerald-400 font-black mt-1.5 block flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online • Analyzing</span>
                  </span>
                </div>
              </div>

              {/* Mini Info tooltip icon */}
              <button 
                type="button" 
                onClick={() => triggerToast('Asisten AI siap membantu mendeteksi dan menyelesaikan konflik data spasial.')}
                className="text-slate-400 hover:text-white transition"
              >
                <HelpCircle size={15} />
              </button>
            </div>

            {/* Chat list container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[360px] bg-slate-50/30">
              
              {messages.map((msg) => {
                const isAi = msg.sender === 'ai';
                return (
                  <div key={msg.id} className={`flex items-start gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}>
                    
                    {/* Bot / User Avatar */}
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      isAi ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isAi ? <Bot size={13} className="stroke-[2.5]" /> : <span className="text-[8px] font-black">U</span>}
                    </div>

                    {/* Chat Bubble content */}
                    <div className="space-y-1 max-w-[80%]">
                      <div className={`rounded-2xl p-3 text-[11px] leading-relaxed shadow-sm ${
                        isAi 
                          ? 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/40' 
                          : 'bg-blue-600 text-white rounded-tr-none'
                      }`}>
                        
                        {/* Process simple markdown markers manually or render nicely */}
                        {isAi ? (
                          <div className="space-y-1.5">
                            {/* Render text with bold text markers and code block indicators */}
                            {msg.text.split('\n').map((para, pIdx) => {
                              // Replace **5% anomali** with colored tag
                              // Replace `batch #802` with inline code block
                              let formattedText: React.ReactNode = para;
                              
                              if (para.includes('**5% anomali**')) {
                                const parts = para.split('**5% anomali**');
                                formattedText = (
                                  <>
                                    {parts[0]}
                                    <span className="text-red-600 font-extrabold bg-red-50 border border-red-100 px-1 py-0.5 rounded">5% anomali</span>
                                    {parts[1]}
                                  </>
                                );
                              }

                              if (typeof formattedText === 'string' && formattedText.includes('`batch #802`')) {
                                const parts = formattedText.split('`batch #802`');
                                formattedText = (
                                  <>
                                    {parts[0]}
                                    <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[10px] font-mono">batch #802</code>
                                    {parts[1]}
                                  </>
                                );
                              } else if (React.isValidElement(formattedText)) {
                                // Nested checks just in case
                              }

                              return <p key={pIdx}>{formattedText}</p>;
                            })}

                            {/* Sub-actions in bubble 1 */}
                            {msg.hasActions && (
                              <div className="flex gap-2 pt-2 border-t border-slate-200 mt-2">
                                <button 
                                  type="button"
                                  onClick={() => {
                                    setFilterMode('anomalies_only');
                                    triggerToast('Tabel Log disaring menampilkan wilayah Jakarta Selatan bermasalah!');
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-2.5 py-1 rounded-lg text-[9px] transition active:scale-95 shadow-sm"
                                  id="btn-lihat-anomali"
                                >
                                  Lihat Anomali
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    setFilterMode('all');
                                    triggerToast('Filter dibersihkan.');
                                  }}
                                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-extrabold px-2.5 py-1 rounded-lg text-[9px] transition active:scale-95"
                                  id="btn-abaikan"
                                >
                                  Abaikan
                                </button>
                              </div>
                            )}

                          </div>
                        ) : (
                          <p>{msg.text}</p>
                        )}

                      </div>
                      
                      {/* Message Time label */}
                      <span className="text-[8px] text-slate-400 font-bold block px-1 text-right">
                        {msg.timestamp}
                      </span>
                    </div>

                  </div>
                );
              })}

            </div>

            {/* Bottom input area form */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-100 bg-slate-50 shrink-0">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  placeholder="Tanya AI Assistant..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-10 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 transition-all shadow-inner"
                />
                
                <button 
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="absolute right-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-full transition-all active:scale-[0.9] shadow-sm"
                  id="btn-send-chat"
                >
                  <Send size={12} className="stroke-[2.5]" />
                </button>
              </div>
            </form>

          </div>

        </div>

      </div>

      {/* FLOATING TOAST NOTIFICATION SYSTEM */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0B1B3F] text-white border border-slate-800 py-3.5 px-4.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center shrink-0">
            <Check size={11} className="stroke-[3]" />
          </div>
          <span className="text-[11px] font-black text-slate-200 leading-tight">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
