/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ChevronDown, 
  Sparkles, 
  X, 
  History, 
  Share2, 
  Trash2, 
  Filter, 
  AlertTriangle, 
  Plus, 
  Search, 
  Eye, 
  Settings, 
  MapPin, 
  TrendingUp, 
  Compass, 
  Layers, 
  Globe, 
  Bot,
  HelpCircle,
  Check,
  Briefcase,
  FileCode,
  RefreshCw
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Wilayah' | 'Aset' | 'Survey' | 'AI';
  icon: React.ReactNode;
  iconBg: string;
  isSpecial?: boolean;
}

interface HistoricalReport {
  id: string;
  title: string;
  date: string;
  format: 'PDF' | 'DOCX' | 'CSV' | string;
  size: string;
  isAlert?: boolean;
}

export default function ReportCenter() {
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState('All Templates');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);

  // Historical reports state (for interactivity)
  const [historyList, setHistoryList] = useState<HistoricalReport[]>([
    {
      id: '1',
      title: 'Laporan Bulanan Aset Regional Barat',
      date: '24 Oct 09:41 AM',
      format: 'PDF',
      size: '2.4MB'
    },
    {
      id: '2',
      title: 'Analisis Vegetasi Koridor SUTET 500kV',
      date: '22 Oct 14:15 PM',
      format: 'PDF',
      size: '5.1MB'
    },
    {
      id: '3',
      title: 'Incident Report: Flooding Sektor D',
      date: '18 Oct 08:30 AM',
      format: 'DOCX',
      size: '1.2MB',
      isAlert: true
    },
    {
      id: '4',
      title: 'Survey Topografi Kuartal 3',
      date: '10 Oct 11:20 AM',
      format: 'CSV/PDF',
      size: '8.4MB'
    }
  ]);

  // Selected preview document
  const [previewTitle, setPreviewTitle] = useState('Laporan AI Analysis - Sektor C');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleGenerateTemplate = (template: ReportTemplate) => {
    setGeneratingReportId(template.id);
    triggerToast(`🤖 Memproses mesin cerdas untuk menghasilkan [${template.title}]...`);
    
    setTimeout(() => {
      setGeneratingReportId(null);
      
      // Add item to history list
      const formatType = template.id === 'ai-analysis' ? 'PDF' : 'PDF';
      const newReport: HistoricalReport = {
        id: String(Date.now()),
        title: template.title + ' - Hasil Generasi',
        date: 'Hari ini ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        format: formatType,
        size: (Math.random() * 5 + 1).toFixed(1) + 'MB',
        isAlert: template.id === 'survey-report'
      };

      setHistoryList([newReport, ...historyList]);
      setPreviewTitle(template.title);
      triggerToast(`✓ Berhasil membuat laporan baru: ${template.title}`);
    }, 2000);
  };

  const handleGenerateNewReport = () => {
    triggerToast('➕ Membuka wizard konfigurasi laporan spasial terpadu...');
  };

  const handleDeleteHistory = (id: string, title: string) => {
    setHistoryList(historyList.filter(item => item.id !== id));
    triggerToast(`🗑️ Laporan "${title}" dihapus dari riwayat.`);
  };

  const templates: ReportTemplate[] = [
    {
      id: 'wilayah',
      title: 'Laporan Wilayah',
      description: 'Ringkasan demografi, batas administratif, dan cakupan spasial.',
      category: 'Wilayah',
      icon: <Globe size={18} className="text-blue-600 stroke-[2.5]" />,
      iconBg: 'bg-blue-50 border-blue-100'
    },
    {
      id: 'aset',
      title: 'Laporan Kategori Aset',
      description: 'Inventaris lengkap status kelayakan, tipe konstruksi, dan luas bangunan.',
      category: 'Aset',
      icon: <Layers size={18} className="text-emerald-600 stroke-[2.5]" />,
      iconBg: 'bg-emerald-50 border-emerald-100'
    },
    {
      id: 'survey',
      title: 'Laporan Survey',
      description: 'Hasil temuan lapangan, foto dokumentasi, dan verifikasi koordinat.',
      category: 'Survey',
      icon: <Compass size={18} className="text-amber-600 stroke-[2.5]" />,
      iconBg: 'bg-amber-50 border-amber-100'
    },
    {
      id: 'ai-analysis',
      title: 'Laporan AI Analysis',
      description: 'Prediksi risiko infrastruktur, deteksi kerusakan, dan analisis prediktif.',
      category: 'AI',
      icon: <Sparkles size={18} className="text-purple-600 stroke-[2.5]" />,
      iconBg: 'bg-purple-100/70 border-purple-200',
      isSpecial: true
    }
  ];

  const filteredTemplates = templates.filter(t => {
    if (selectedTemplateFilter === 'All Templates') return true;
    if (selectedTemplateFilter === 'Laporan Wilayah' && t.id === 'wilayah') return true;
    if (selectedTemplateFilter === 'Laporan Kategori Aset' && t.id === 'aset') return true;
    if (selectedTemplateFilter === 'Laporan Survey' && t.id === 'survey') return true;
    if (selectedTemplateFilter === 'Laporan AI Analysis' && t.id === 'ai-analysis') return true;
    return false;
  });

  return (
    <div className="flex flex-col gap-6 select-none animate-in fade-in duration-300">
      
      {/* 1. Header Area with Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 p-1 rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Report Center</h2>
          <p className="text-slate-500 text-xs mt-0.5">Generate, view, and manage comprehensive geospatial reports.</p>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Dropdown "All Templates" */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-black px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition"
            >
              <span>{selectedTemplateFilter}</span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden font-black">
                {['All Templates', 'Laporan Wilayah', 'Laporan Kategori Aset', 'Laporan Survey', 'Laporan AI Analysis'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSelectedTemplateFilter(opt);
                      setIsDropdownOpen(false);
                      triggerToast(`Filter template: ${opt}`);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-[11px] hover:bg-slate-50 transition border-b border-slate-50 last:border-0 ${
                      selectedTemplateFilter === opt ? 'text-blue-600 bg-blue-50/20' : 'text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tombol biru "+ Generate Laporan Baru" */}
          <button
            type="button"
            onClick={handleGenerateNewReport}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/10 active:scale-[0.98] transition"
            id="btn-generate-new-report"
          >
            <Plus size={14} className="stroke-[3]" />
            <span>+ Generate Laporan Baru</span>
          </button>
        </div>
      </div>

      {/* 2. Section "📋 Template Laporan" (4 card grid) */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">📋 Template Laporan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTemplates.map((temp) => {
            const isAI = temp.id === 'ai-analysis';
            const isGenerating = generatingReportId === temp.id;

            return (
              <div 
                key={temp.id}
                className={`rounded-2xl p-4.5 border transition-all duration-300 flex flex-col justify-between gap-4.5 group ${
                  isAI 
                    ? 'bg-gradient-to-br from-purple-50/40 via-indigo-50/25 to-white border-purple-200 hover:border-purple-300 shadow-sm shadow-purple-100/50 hover:shadow-md' 
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Upper block */}
                <div className="space-y-3">
                  {/* Icon dalam kotak rounded biru muda / ungu muda */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${temp.iconBg}`}>
                    {temp.icon}
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition">
                      {temp.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      {temp.description}
                    </p>
                  </div>
                </div>

                {/* Lower button action */}
                <div>
                  {isAI ? (
                    /* AI template: solid blue button as requested */
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={() => handleGenerateTemplate(temp)}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-2 px-3 rounded-xl text-[10px] transition active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/10"
                    >
                      <Sparkles size={11} className={isGenerating ? 'animate-spin' : ''} />
                      <span>{isGenerating ? 'Generating...' : 'Generate Laporan'}</span>
                    </button>
                  ) : (
                    /* Other templates: outline buttons */
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={() => handleGenerateTemplate(temp)}
                      className="w-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600 font-black py-2 px-3 rounded-xl text-[10px] transition active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw size={11} className="animate-spin text-blue-600" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <FileText size={11} className="text-slate-400" />
                          <span>Generate</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Layout 2 Kolom Bawah: Kiri Live Preview, Kanan Riwayat Laporan */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* KOLOM KIRI (±75%): Live Preview */}
        <section className="w-full lg:w-[73%] bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col gap-4">
          
          {/* Header Preview */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              <Eye size={15} className="text-blue-600 stroke-[2.5]" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                👁 Live Preview <span className="text-slate-400 lowercase font-medium">({previewTitle})</span>
              </h3>
            </div>

            {/* Print and Download Actions */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-xl transition shadow-sm active:scale-[0.97]"
                title="Cetak Laporan"
              >
                <Printer size={13.5} className="stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => triggerToast(`💾 Berhasil mengunduh salinan berkas "${previewTitle}" ke penyimpanan lokal.`)}
                className="p-2 bg-blue-50/50 hover:bg-blue-50 text-blue-600 hover:text-blue-800 border border-blue-100/50 rounded-xl transition shadow-sm active:scale-[0.97]"
                title="Unduh PDF"
              >
                <Download size={13.5} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* White Paper Frame simulating a PDF document */}
          <div className="bg-slate-100/60 rounded-2xl p-6 border border-slate-150/80 shadow-inner flex justify-center">
            
            {/* The Document Page Sheet */}
            <div className="w-full max-w-[800px] bg-white border border-slate-200 shadow-xl p-8 rounded-xl font-sans text-xs text-slate-700 space-y-6 relative overflow-hidden min-h-[620px]">
              
              {/* PDF Sheet Grid watermark or subtle corner decorations */}
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />

              {/* Document Header */}
              <div className="flex justify-between items-start pb-4.5 border-b border-slate-200/80">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-950 tracking-wider">INTELLIGENCE REPORT</h4>
                  <p className="text-[10px] text-blue-600 font-extrabold tracking-widest uppercase">
                    SEKTOR C - ANALISIS INFRASTRUKTUR KRITIS
                  </p>
                </div>

                <div className="text-right space-y-1">
                  {/* Logo GeoIntel AI kanan atas */}
                  <div className="flex items-center justify-end gap-1.5 font-black text-slate-900 text-[11px] tracking-wide">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm" />
                    <span>GeoIntel AI</span>
                  </div>
                  {/* Info kanan: Date & Ref Number */}
                  <div className="text-[8.5px] text-slate-400 font-semibold font-mono space-y-0.5">
                    <div>Date: 16 Juli 2026</div>
                    <div className="text-slate-500 font-black">Ref: REF-2026-AI-SEC-C</div>
                  </div>
                </div>
              </div>

              {/* Thick blue divider line */}
              <div className="h-1 bg-blue-600 w-full rounded" />

              {/* Section "Executive Summary" with left blue bar */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 bg-blue-600 h-4 rounded-full" />
                  <h5 className="font-black text-slate-950 text-[10.5px] uppercase tracking-wide">Executive Summary</h5>
                </div>
                
                {/* Paragraph dummy on subsidence risk analysis */}
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  Berdasarkan analisis citra satelit SAR (Synthetic Aperture Radar) dan model kecerdasan buatan, Sektor C mengalami laju penurunan tanah (subsidence) rata-rata 4.2 cm per tahun. Hal ini menimbulkan risiko tinggi terhadap stabilitas pondasi jalan layang dan pipa transmisi air utama di sepanjang koridor korosi tinggi.
                </p>
              </div>

              {/* 2 Kolom: Kiri Donut Chart, Kanan Peta Mini */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1.5">
                
                {/* KOLOM KIRI: DISTRIBUSI RISIKO ASET */}
                <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/40 flex flex-col justify-between">
                  <div>
                    <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">DISTRIBUSI RISIKO ASET</h6>
                  </div>

                  <div className="flex items-center justify-around gap-4 py-2">
                    {/* SVG Donut Chart Placeholder */}
                    <div className="relative w-20 h-20 shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {/* Circle background */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                        
                        {/* Red: Tinggi (35%) */}
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="15.915" 
                          fill="none" 
                          stroke="#EF4444" 
                          strokeWidth="3.2" 
                          strokeDasharray="35 65" 
                          strokeDashoffset="100" 
                        />
                        
                        {/* Amber: Sedang (35%) */}
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="15.915" 
                          fill="none" 
                          stroke="#F59E0B" 
                          strokeWidth="3.2" 
                          strokeDasharray="35 65" 
                          strokeDashoffset="65" 
                        />
                        
                        {/* Emerald: Rendah (30%) */}
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="15.915" 
                          fill="none" 
                          stroke="#10B981" 
                          strokeWidth="3.2" 
                          strokeDasharray="30 70" 
                          strokeDashoffset="30" 
                        />
                      </svg>
                      {/* Central label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center font-black text-slate-800 text-[10px] leading-none">
                        <span>42</span>
                        <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Aset</span>
                      </div>
                    </div>

                    {/* Legend list right */}
                    <div className="space-y-1.5 font-bold text-[9px]">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                        <span className="w-10">Tinggi</span>
                        <span className="text-slate-900 font-black">35%</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="w-10">Sedang</span>
                        <span className="text-slate-900 font-black">35%</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="w-10">Rendah</span>
                        <span className="text-slate-900 font-black">30%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KOLOM KANAN: PETA ZONA C (AREA TERDAMPAK) */}
                <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/40 flex flex-col justify-between">
                  <div>
                    <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">PETA ZONA C (AREA TERDAMPAK)</h6>
                  </div>

                  {/* SVG mini map placeholder with grid lines, danger polygon, and marker */}
                  <div className="h-20 w-full rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative">
                    <svg className="w-full h-full" viewBox="0 0 160 80">
                      <defs>
                        <pattern id="previewGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#previewGrid)" />
                      
                      {/* Shaded Hazard Area Polygon */}
                      <polygon points="40,20 110,15 130,65 50,70" fill="#EF4444" fillOpacity="0.18" stroke="#EF4444" strokeWidth="1" strokeDasharray="2,2" />
                      
                      {/* Roads lines */}
                      <path d="M 0,35 L 160,35" stroke="#CBD5E1" strokeWidth="3" fill="none" />
                      <path d="M 80,0 L 80,80" stroke="#CBD5E1" strokeWidth="3" fill="none" />

                      {/* Hazard area contour line */}
                      <path d="M 80,35 L 105,55" stroke="#3B82F6" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                    </svg>

                    {/* Pulse red marker on map */}
                    <div className="absolute top-[40%] left-[50%] flex items-center justify-center">
                      <span className="absolute inline-flex h-3.5 w-3.5 rounded-full bg-red-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600" />
                    </div>

                    {/* Map corner label */}
                    <div className="absolute bottom-1 right-1.5 bg-black/75 text-[7px] text-white font-black px-1 py-0.2 rounded font-mono uppercase tracking-wider">
                      GIS - SAR Overlay
                    </div>
                  </div>
                </div>

              </div>

              {/* TABEL TEMUAN KRITIS (TOP 3) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase">TABEL TEMUAN KRITIS (TOP 3)</span>
                  <span className="text-[8px] text-slate-400 font-bold">Teridentifikasi Otomatis oleh AI</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white">
                  <table className="w-full text-left text-[9.5px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black uppercase">
                        <th className="py-2 px-3">ID Aset</th>
                        <th className="py-2 px-3">Kategori</th>
                        <th className="py-2 px-3 text-center">Koordinat</th>
                        <th className="py-2 px-3 text-right">Skor Risiko (AI)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                      {/* Row 1 */}
                      <tr className="hover:bg-slate-50/50 transition">
                        <td className="py-2 px-3 font-mono font-black text-slate-900">WT-092</td>
                        <td className="py-2 px-3">Pipa Air Utama</td>
                        <td className="py-2 px-3 font-mono text-center">-6.208, 106.845</td>
                        <td className="py-2 px-3 text-right">
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded text-[8.5px] font-black font-mono">
                            88 / 100
                          </span>
                        </td>
                      </tr>
                      {/* Row 2 */}
                      <tr className="hover:bg-slate-50/50 transition">
                        <td className="py-2 px-3 font-mono font-black text-slate-900">BR-104</td>
                        <td className="py-2 px-3">Pondasi Jembatan</td>
                        <td className="py-2 px-3 font-mono text-center">-6.210, 106.842</td>
                        <td className="py-2 px-3 text-right">
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded text-[8.5px] font-black font-mono">
                            75 / 100
                          </span>
                        </td>
                      </tr>
                      {/* Row 3 */}
                      <tr className="hover:bg-slate-50/50 transition">
                        <td className="py-2 px-3 font-mono font-black text-slate-900">RD-301</td>
                        <td className="py-2 px-3">Jalur Tol Utama</td>
                        <td className="py-2 px-3 font-mono text-center">-6.205, 106.849</td>
                        <td className="py-2 px-3 text-right">
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[8.5px] font-black font-mono">
                            45 / 100
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signature block of PDF */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[8px] text-slate-400 font-semibold">
                <span>GeoIntel Automated AI Analytics Engine • CONFIDENTIAL</span>
                <div className="text-right">
                  <span>Disetujui Oleh</span>
                  <span className="font-extrabold text-slate-800 block mt-0.5">Tim Analis Spasial AI</span>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* PANEL KANAN (±25%): Riwayat Laporan */}
        <aside className="w-full lg:w-[27%] bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-sm hover:shadow-md transition shrink-0 flex flex-col gap-4">
          
          {/* Header Riwayat Laporan dengan Icon Filter di kanan */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History size={14.5} className="text-blue-600 stroke-[2.5]" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Riwayat Laporan</h3>
            </div>

            {/* Icon Filter */}
            <button
              type="button"
              onClick={() => triggerToast('Menyaring riwayat laporan berdasarkan kriteria pembuatan.')}
              className="p-1.5 text-slate-400 hover:text-blue-600 border border-slate-100 rounded-lg hover:bg-slate-50 transition"
              title="Filter Riwayat"
            >
              <Filter size={13} className="stroke-[2.5]" />
            </button>
          </div>

          {/* List Card Laporan */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto scrollbar-none pr-0.5">
            {historyList.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setPreviewTitle(item.title);
                  triggerToast(`👁 Menampilkan berkas: ${item.title}`);
                }}
                className={`p-3 border rounded-xl flex items-start gap-2.5 transition cursor-pointer ${
                  previewTitle === item.title 
                    ? 'border-blue-500 bg-blue-50/10' 
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 bg-white'
                }`}
              >
                {/* Icon File: warning kuning untuk item alert, file biasa untuk lainnya */}
                {item.isAlert ? (
                  <div className="p-2 bg-amber-50 text-amber-500 border border-amber-100 rounded-xl shrink-0 mt-0.5 animate-pulse">
                    <AlertTriangle size={15} className="stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="p-2 bg-slate-50 text-slate-400 border border-slate-200/50 rounded-xl shrink-0 mt-0.5">
                    <FileText size={15} className="stroke-[2]" />
                  </div>
                )}

                {/* Info Text */}
                <div className="flex-1 min-w-0 text-left space-y-1">
                  <h5 className="text-[10.5px] font-black text-slate-900 leading-tight line-clamp-2">
                    {item.title}
                  </h5>
                  <p className="text-[9px] text-slate-400 font-bold font-mono">
                    {item.date} • {item.format} • {item.size}
                  </p>
                </div>

                {/* 3 Icon Aksi Kanan (Download, Share, Trash) */}
                <div className="flex flex-col items-center gap-1.5 shrink-0 pl-1.5 border-l border-slate-50">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerToast(`💾 Berhasil mengunduh "${item.title}"`);
                    }}
                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                    title="Download File"
                  >
                    <Download size={11.5} className="stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerToast(`🔗 Link unduh untuk "${item.title}" disalin ke clipboard.`);
                    }}
                    className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
                    title="Bagikan Tautan"
                  >
                    <Share2 size={11.5} className="stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHistory(item.id, item.title);
                    }}
                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                    title="Hapus"
                  >
                    <Trash2 size={11.5} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Link Lihat Semua Riwayat di bawah list */}
          <div className="pt-2 border-t border-slate-100 mt-1">
            <button
              type="button"
              onClick={() => triggerToast('Membuka seluruh log pengarsipan sistem...')}
              className="w-full text-center text-[10px] text-blue-600 hover:text-blue-800 font-black hover:underline"
            >
              Lihat Semua Riwayat
            </button>
          </div>

        </aside>

      </div>

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
