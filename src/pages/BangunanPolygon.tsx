/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  X, 
  MapPin, 
  Save, 
  CloudUpload, 
  Trash2, 
  Calendar, 
  Sparkles, 
  Info, 
  Share2, 
  Ruler, 
  Pen, 
  Check, 
  ChevronRight, 
  Layers, 
  Plus,
  Eye,
  Settings,
  HelpCircle
} from 'lucide-react';

interface PolygonData {
  id: string;
  name: string;
  category: string;
  areaSize: string;
  status: 'Draft' | 'Review' | 'Terverifikasi';
  notes: string;
  updatedAt: string;
  points: string; // SVG points coordinate
  pinLocation: { x: number; y: number };
  measurements: Array<{ x: number; y: number; text: string }>;
  nodes: Array<{ x: number; y: number; id: number }>;
}

export default function BangunanPolygon() {
  // Mock initial polygons requested
  const initialPolygons: PolygonData[] = [
    {
      id: 'POL-001',
      name: 'Kawasan Industri A',
      category: 'Bangunan',
      areaSize: '12,450 m²',
      status: 'Draft',
      notes: 'Kawasan pergudangan logistik utama tahap pengembangan I.',
      updatedAt: 'Hari ini, 10:30',
      points: '120,110 320,80 360,200 240,260 140,210',
      pinLocation: { x: 236, y: 172 },
      measurements: [
        { x: 220, y: 85, text: '200m' },
        { x: 350, y: 140, text: '120m' },
        { x: 300, y: 245, text: '140m' },
        { x: 180, y: 245, text: '110m' },
        { x: 120, y: 160, text: '100m' }
      ],
      nodes: [
        { id: 1, x: 120, y: 110 },
        { id: 2, x: 320, y: 80 },
        { id: 3, x: 360, y: 200 },
        { id: 4, x: 240, y: 260 },
        { id: 5, x: 140, y: 210 }
      ]
    },
    {
      id: 'POL-002',
      name: 'Lahan Parkir B',
      category: 'Lahan',
      areaSize: '5,200 m²',
      status: 'Draft',
      notes: 'Area fasilitas penunjang parkir kontainer dan armada logistik.',
      updatedAt: 'Kemarin, 14:15',
      points: '480,180 620,150 650,250 510,270',
      pinLocation: { x: 565, y: 212 },
      measurements: [
        { x: 550, y: 155, text: '140m' },
        { x: 645, y: 200, text: '100m' },
        { x: 580, y: 275, text: '140m' },
        { x: 485, y: 225, text: '90m' }
      ],
      nodes: [
        { id: 1, x: 480, y: 180 },
        { id: 2, x: 620, y: 150 },
        { id: 3, x: 650, y: 250 },
        { id: 4, x: 510, y: 270 }
      ]
    },
    {
      id: 'POL-003',
      name: 'SMAN 70 Jakarta Lahan Baru',
      category: 'Fasilitas Umum',
      areaSize: '15,800 m²',
      status: 'Review',
      notes: 'Rencana pemekaran ruang terbuka hijau dan lapangan olahraga.',
      updatedAt: '2 hari lalu, 09:12',
      points: '160,330 350,320 380,450 210,480 120,410',
      pinLocation: { x: 240, y: 400 },
      measurements: [
        { x: 255, y: 315, text: '190m' },
        { x: 375, y: 385, text: '130m' },
        { x: 295, y: 480, text: '170m' },
        { x: 155, y: 460, text: '110m' },
        { x: 130, y: 370, text: '95m' }
      ],
      nodes: [
        { id: 1, x: 160, y: 330 },
        { id: 2, x: 350, y: 320 },
        { id: 3, x: 380, y: 450 },
        { id: 4, x: 210, y: 480 },
        { id: 5, x: 120, y: 410 }
      ]
    }
  ];

  // States
  const [polygons, setPolygons] = useState<PolygonData[]>(initialPolygons);
  const [selectedPolyId, setSelectedPolyId] = useState<string>('POL-001');
  const [activeToolbar, setActiveToolbar] = useState<'none' | 'share' | 'draw' | 'delete' | 'measure'>('draw');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // File Upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState(initialPolygons[0].name);
  const [formCategory, setFormCategory] = useState(initialPolygons[0].category);
  const [formAreaSize, setFormAreaSize] = useState(initialPolygons[0].areaSize);
  const [formStatus, setFormStatus] = useState<string>(initialPolygons[0].status);
  const [formNotes, setFormNotes] = useState(initialPolygons[0].notes);

  // Load selected polygon details into form
  const handleSelectPolygon = (poly: PolygonData) => {
    setSelectedPolyId(poly.id);
    setFormName(poly.name);
    setFormCategory(poly.category);
    setFormAreaSize(poly.areaSize);
    setFormStatus(poly.status);
    setFormNotes(poly.notes);
  };

  // Form Save Action
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    // Update in polygons state
    setPolygons(prev => prev.map(p => {
      if (p.id === selectedPolyId) {
        return {
          ...p,
          name: formName,
          category: formCategory,
          status: formStatus as 'Draft' | 'Review' | 'Terverifikasi',
          notes: formNotes,
          updatedAt: 'Hari ini, 10:30' // match prompt updated format
        };
      }
      return p;
    }));

    setToastMessage(`Berhasil menyimpan perubahan data "${formName}"`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // File Input Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  // Drag and drop handlers
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
      setUploadedFileName(e.dataTransfer.files[0].name);
    }
  };

  // Floating Toolbar Actions trigger nice feedback
  const triggerToolbarAction = (mode: 'share' | 'draw' | 'delete' | 'measure') => {
    setActiveToolbar(mode);
    if (mode === 'delete') {
      // Simulate deleting
      setToastMessage("Mode Hapus diaktifkan. Klik pada node polygon untuk memotong batas kawasan.");
    } else if (mode === 'share') {
      setToastMessage("Menghubungkan simpul koordinat antar polygon...");
    } else if (mode === 'measure') {
      setToastMessage("Mode Pengukuran aktif. Menampilkan detail dimensi sisi polygon.");
    } else if (mode === 'draw') {
      setToastMessage("Mode Menggambar Aktif. Gambar titik batas wilayah di peta.");
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Helper colors for status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terverifikasi':
        return 'bg-emerald-500 text-white';
      case 'Review':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  // Current active polygon configuration
  const currentPoly = polygons.find(p => p.id === selectedPolyId) || polygons[0];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[500px] relative select-none">
      
      {/* LEFT COLUMN: Map Simulation (Full-Bleed feel inside container) */}
      <div className="flex-1 w-full h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 relative shadow-sm flex flex-col group">
        
        {/* Floating Toolbar on Top Center of map */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md shadow-xl rounded-xl py-1.5 px-3 flex items-center gap-1 z-30 border border-slate-200 animate-in fade-in slide-in-from-top-3 duration-300">
          
          <button 
            type="button"
            onClick={() => triggerToolbarAction('share')}
            className={`p-2.5 rounded-lg transition-all ${
              activeToolbar === 'share' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            title="Hubungkan Simpul (Share Nodes)"
            id="tool-share-nodes"
          >
            <Share2 size={16} className="stroke-[2.5]" />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button 
            type="button"
            onClick={() => triggerToolbarAction('draw')}
            className={`p-2.5 rounded-lg transition-all ${
              activeToolbar === 'draw' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            title="Gambar Polygon (Draw Line/Pen)"
            id="tool-draw-pen"
          >
            <Pen size={15} className="stroke-[2.5]" />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button 
            type="button"
            onClick={() => triggerToolbarAction('delete')}
            className={`p-2.5 rounded-lg transition-all ${
              activeToolbar === 'delete' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            title="Hapus Node (Delete)"
            id="tool-delete"
          >
            <Trash2 size={15} className="stroke-[2.5]" />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button 
            type="button"
            onClick={() => triggerToolbarAction('measure')}
            className={`p-2.5 rounded-lg transition-all ${
              activeToolbar === 'measure' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            title="Ukur Dimensi (Measure/Ruler)"
            id="tool-measure"
          >
            <Ruler size={15} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Floating Top Left Badge: Map info */}
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white border border-slate-700 rounded-xl px-3 py-1.5 z-20 text-[10px] font-bold tracking-wide shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>GIS VECTOR EDITOR</span>
        </div>

        {/* Floating Right Corner Control */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur border border-slate-200 rounded-xl p-2 z-20 shadow-sm flex flex-col gap-1">
          <button className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 text-xs font-bold font-mono">2D</button>
          <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-800 text-xs font-bold font-mono">3D</button>
        </div>

        {/* SIMULATED MAP SVG CANVAS */}
        <div className="w-full h-full relative overflow-hidden bg-[#E2E8F0] cursor-crosshair">
          <svg className="w-full h-full absolute inset-0 select-none" viewBox="0 0 800 550">
            
            {/* Grid Pattern Background */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D1D5DB" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Simulated streets / roads network */}
            <g opacity="0.6">
              <path d="M -10,180 L 820,180" stroke="#94A3B8" strokeWidth="18" fill="none" />
              <path d="M -10,180 L 820,180" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6,6" fill="none" />
              
              <path d="M 420,-10 L 420,560" stroke="#94A3B8" strokeWidth="18" fill="none" />
              <path d="M 420,-10 L 420,560" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6,6" fill="none" />

              <path d="M 120,-10 L 120,560" stroke="#94A3B8" strokeWidth="12" fill="none" />
              <path d="M 680,-10 L 680,560" stroke="#94A3B8" strokeWidth="12" fill="none" />
              
              <path d="M -10,420 L 820,420" stroke="#94A3B8" strokeWidth="12" fill="none" />
            </g>

            {/* Scattered Light Blue Buildings (Visual Background) */}
            <g fill="#BAE6FD" stroke="#93C5FD" strokeWidth="1" opacity="0.75">
              <rect x="40" y="40" width="50" height="30" rx="3" />
              <rect x="50" y="80" width="30" height="40" rx="3" />
              
              <rect x="180" y="30" width="60" height="35" rx="3" />
              <rect x="250" y="40" width="40" height="30" rx="3" />
              
              <rect x="480" y="40" width="55" height="40" rx="3" />
              <rect x="545" y="50" width="45" height="30" rx="3" />
              
              <rect x="710" y="60" width="50" height="60" rx="3" />
              <rect x="710" y="240" width="60" height="40" rx="3" />
              
              <rect x="40" y="260" width="45" height="35" rx="3" />
              <rect x="30" y="340" width="50" height="50" rx="3" />
            </g>

            {/* Green spaces (Taman/Hutan) */}
            <g fill="#DCFCE7" stroke="#BBF7D0" strokeWidth="1" opacity="0.75">
              <path d="M 480,350 Q 520,310 580,330 T 650,420 T 560,490 T 460,430 Z" />
              <path d="M 40,460 Q 80,440 120,460 T 150,510 T 80,540 Z" />
            </g>

            {/* DRAWS ALL THE SAVED POLYGONS */}
            {polygons.map((poly) => {
              const isSelected = poly.id === selectedPolyId;
              return (
                <g key={poly.id} className="cursor-pointer">
                  {/* Transparent Polygon fill with thick solid blue borders */}
                  <polygon 
                    points={poly.points}
                    onClick={() => handleSelectPolygon(poly)}
                    className="transition-all duration-300"
                    fill="#3B82F6"
                    fillOpacity={isSelected ? "0.15" : "0.04"}
                    stroke="#3B82F6"
                    strokeWidth={isSelected ? "3" : "1.8"}
                  />

                  {/* Draw Measurement Lines and small numbers if selected or measure mode active */}
                  {(isSelected || activeToolbar === 'measure') && poly.measurements.map((m, idx) => (
                    <g key={idx} className="pointer-events-none animate-in fade-in duration-300">
                      {/* measurement number white label */}
                      <rect 
                        x={m.x - 14} 
                        y={m.y - 7} 
                        width="28" 
                        height="14" 
                        rx="4" 
                        fill="#FFFFFF" 
                        stroke="#94A3B8" 
                        strokeWidth="0.5" 
                        className="shadow-sm"
                      />
                      <text 
                        x={m.x} 
                        y={m.y + 3} 
                        textAnchor="middle" 
                        className="font-mono text-[8px] font-black fill-slate-700"
                      >
                        {m.text}
                      </text>
                    </g>
                  ))}

                  {/* Vertices handles: circles on corners to show they are editable/being drawn */}
                  {isSelected && poly.nodes.map((n) => (
                    <circle 
                      key={n.id}
                      cx={n.x} 
                      cy={n.y} 
                      r="4.5" 
                      fill="#F97316" 
                      stroke="#FFFFFF" 
                      strokeWidth="1.5"
                      className="hover:scale-125 transition duration-150 cursor-pointer shadow-md"
                      onClick={() => {
                        setToastMessage(`Koordinat Simpul #${n.id}: Lat ${(-6.2425 + (n.y/10000)).toFixed(5)}, Lng ${(106.7981 + (n.x/10000)).toFixed(5)}`);
                        setShowToast(true);
                      }}
                      title={`Simpul ${n.id}`}
                    />
                  ))}
                </g>
              );
            })}

            {/* Glowing active marker pin for the selected polygon */}
            <g transform={`translate(${currentPoly.pinLocation.x}, ${currentPoly.pinLocation.y})`} className="pointer-events-none">
              {/* Outer pulsing shadow ring */}
              <circle r="14" className="fill-blue-500 opacity-25 animate-ping" />
              {/* Pulse circle */}
              <circle r="7" className="fill-blue-600 opacity-40 animate-pulse" />
              {/* Main mappin circle icon shape */}
              <circle r="4" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="1.5" className="shadow-lg" />
            </g>

          </svg>

          {/* Map Compass HUD on Bottom Left */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-md text-[10px] font-extrabold text-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-3">
            <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 font-mono text-[9px] relative font-black">
              <span className="absolute top-0.5">N</span>
              <span className="absolute bottom-0.5 text-[7px] text-slate-300">S</span>
              <div className="w-0.5 h-6 bg-red-500 transform rotate-12" />
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[8px] tracking-wide">PETA TERPILIH</span>
              <span className="text-slate-900 font-black">{currentPoly.name}</span>
            </div>
          </div>

          {/* Scale HUD on Bottom Right */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl px-3 py-1.5 shadow-md text-[9px] font-mono font-bold text-slate-500 flex items-center gap-2">
            <span>Scale 1 : 2,500</span>
            <div className="w-10 h-1.5 border-b-2 border-l-2 border-r-2 border-slate-600 inline-block" />
            <span>100 m</span>
          </div>

        </div>

      </div>

      {/* RIGHT COLUMN: "Atribut Polygon" Form Panel (width ±320px) */}
      <div className="w-full lg:w-[320px] bg-white border border-slate-200/80 shadow-xl rounded-2xl flex flex-col overflow-hidden shrink-0 animate-in fade-in slide-in-from-right-4 duration-300">
        
        {/* Atribut Polygon Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-blue-600 block" />
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Atribut Polygon</span>
          </div>
          <button 
            type="button"
            onClick={() => handleSelectPolygon(polygons[0])}
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition"
            title="Reset Pilihan"
          >
            <X size={15} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
            
            {/* Nama Kawasan */}
            <div>
              <label className="block text-slate-600 font-black mb-1.5 uppercase tracking-wider text-[9px]">Nama Kawasan</label>
              <input 
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Masukkan nama kawasan..."
                required
                className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-bold text-slate-800 bg-slate-50/40"
              />
            </div>

            {/* Kategori Dropdown */}
            <div>
              <label className="block text-slate-600 font-black mb-1.5 uppercase tracking-wider text-[9px]">Kategori</label>
              <select 
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 outline-none font-bold bg-white text-slate-800 cursor-pointer"
              >
                <option value="" disabled>Pilih kategori...</option>
                <option value="Bangunan">Bangunan</option>
                <option value="Lahan">Lahan</option>
                <option value="Fasilitas Umum">Fasilitas Umum</option>
                <option value="Infrastruktur Jalan">Infrastruktur Jalan</option>
              </select>
            </div>

            {/* Luas Area (Readonly, Gray BG, Auto-calculated) */}
            <div>
              <label className="block text-slate-600 font-black mb-1.5 uppercase tracking-wider text-[9px]">Luas Area</label>
              <input 
                type="text"
                value={formAreaSize}
                readOnly
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-slate-500 font-black outline-none cursor-not-allowed"
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-slate-600 font-black mb-1.5 uppercase tracking-wider text-[9px]">Status</label>
              <select 
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 outline-none font-bold bg-white text-slate-800 cursor-pointer"
              >
                <option value="Draft">Draft</option>
                <option value="Review">Review</option>
                <option value="Terverifikasi">Terverifikasi</option>
              </select>
            </div>

            {/* Catatan Textarea */}
            <div>
              <label className="block text-slate-600 font-black mb-1.5 uppercase tracking-wider text-[9px]">Catatan</label>
              <textarea 
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Tambahkan catatan opsional..."
                rows={2}
                className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-bold text-slate-800 bg-slate-50/40 resize-none"
              />
            </div>

            {/* Upload Area (Dashed border, supports Drag and Drop or click selection) */}
            <div>
              <label className="block text-slate-600 font-black mb-1.5 uppercase tracking-wider text-[9px]">Upload Foto</label>
              
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50/30' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/30 hover:bg-slate-50/80'
                }`}
              >
                <CloudUpload size={24} className="text-slate-400 mb-1" />
                <span className="text-[10px] text-slate-700 font-black block">Klik atau drag file ke sini</span>
                <span className="text-[8px] text-slate-400 block mt-0.5 uppercase font-bold">PNG, JPG Maksimal 10MB</span>
                
                {uploadedFileName && (
                  <div className="mt-2.5 flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100 text-[9px] font-black">
                    <Check size={10} className="stroke-[3]" />
                    <span className="truncate max-w-[140px]">{uploadedFileName}</span>
                  </div>
                )}
              </div>

              {/* Hidden Native File Input */}
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Simpan Polygon Action Button */}
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold py-2.5 px-4 rounded-xl shadow-md shadow-blue-600/10 flex items-center justify-center gap-1.5 transition"
              id="btn-save-polygon"
            >
              <Save size={14} className="stroke-[2.5]" />
              <span>Simpan Polygon</span>
            </button>

          </form>

          {/* Section: Riwayat Polygon */}
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center gap-1.5 mb-3.5">
              <Layers size={13} className="text-blue-600 stroke-[2.5]" />
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Riwayat Polygon</h4>
            </div>

            {/* Riwayat List Cards */}
            <div className="space-y-2.5">
              {polygons.map((poly) => {
                const isActive = poly.id === selectedPolyId;
                
                return (
                  <div 
                    key={poly.id}
                    onClick={() => handleSelectPolygon(poly)}
                    className={`border rounded-xl p-3 flex gap-3 cursor-pointer hover:bg-slate-50/50 transition-all ${
                      isActive 
                        ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/20 shadow-sm' 
                        : 'border-slate-100 bg-white'
                    }`}
                  >
                    {/* Thumbnail Grey (Visual representasi satelit) */}
                    <div className="w-11 h-11 rounded-lg bg-slate-100 shrink-0 flex items-center justify-center relative overflow-hidden border border-slate-200">
                      {/* Grey overlay to give neutral look */}
                      <div className="absolute inset-0 bg-slate-500/10 z-10" />
                      <MapPin size={15} className={`${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>

                    {/* Meta labels */}
                    <div className="text-[10px] flex-1 flex flex-col justify-between min-w-0">
                      <div className="space-y-0.5">
                        <h5 className="font-extrabold text-slate-900 leading-none truncate">{poly.name}</h5>
                        
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="bg-slate-100 text-slate-600 font-extrabold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider shrink-0">
                            {poly.category}
                          </span>
                          <span className="text-slate-400 font-bold shrink-0">{poly.areaSize}</span>
                        </div>
                      </div>
                      
                      <span className="text-[8px] text-slate-400 font-bold mt-1.5 block">
                        Diperbarui: {poly.updatedAt}
                      </span>
                    </div>

                    {/* Arrow chevron indicators */}
                    <div className="self-center text-slate-300">
                      <ChevronRight size={14} className="stroke-[2.5]" />
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

      {/* FLOATING RESPONSE TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-[#0B1B3F] text-white border border-slate-800 py-3 px-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center shrink-0">
            <Sparkles size={11} className="stroke-[3]" />
          </div>
          <span className="text-[11px] font-bold text-slate-200 leading-tight">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
