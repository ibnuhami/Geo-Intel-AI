/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, MapPin, Eye, Info, ZoomIn, ZoomOut, Compass, Trash2, Link as LinkIcon, Share2, Ruler } from 'lucide-react';
import { motion } from 'motion/react';

interface InteractiveMapProps {
  onPinClick?: (assetId: string) => void;
  showDrawingToolbar?: boolean;
  onPolygonDrawn?: (coords: [number, number][], area: number) => void;
  activeCategory?: string;
  heatmapOpacity?: number;
}

export default function InteractiveMap({
  onPinClick,
  showDrawingToolbar = false,
  onPolygonDrawn,
  activeCategory = 'Semua',
  heatmapOpacity = 0.8,
}: InteractiveMapProps) {
  // Layer states
  const [layers, setLayers] = useState({
    satellite: false,
    street: true,
    heatmap: true,
    boundaryProv: false,
    boundaryKab: false,
    boundaryDesa: false,
    polygonArea: true,
  });

  const [zoom, setZoom] = useState(13);
  const [showLayerMenu, setShowLayerMenu] = useState(true);
  const [drawnPolygons, setDrawnPolygons] = useState<Array<{ id: string; points: string; category: string }>>([
    { id: '1', points: '120,80 200,60 260,110 220,170 140,160', category: 'Bangunan' },
    { id: '2', points: '300,180 420,150 450,220 340,260', category: 'Lahan' },
    { id: '3', points: '150,280 280,280 260,340 180,330', category: 'Fasilitas Umum' }
  ]);

  const [activePin, setActivePin] = useState<string | null>(null);

  // Drawing mode simulation
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<string>('');

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawing) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      const newPoint = `${x},${y}`;
      setDrawingPoints(prev => prev ? `${prev} ${newPoint}` : newPoint);
    }
  };

  const finishDrawing = () => {
    if (!drawingPoints) return;
    const newPoly = {
      id: Math.random().toString(),
      points: drawingPoints,
      category: 'Bangunan'
    };
    setDrawnPolygons([...drawnPolygons, newPoly]);
    setDrawingPoints('');
    setIsDrawing(false);
    if (onPolygonDrawn) {
      onPolygonDrawn([[-6.2425, 106.7981]], 12450);
    }
  };

  const clearDrawing = () => {
    setDrawingPoints('');
    setIsDrawing(false);
  };

  const mockPins = [
    { id: 'AST-2023-091', name: 'Puskesmas Kebon Jeruk', x: 180, y: 130, category: 'Kesehatan' },
    { id: 'AST-2023-092', name: 'RSUD Tarakan', x: 380, y: 100, category: 'Rumah Sakit' },
    { id: 'AST-2023-093', name: 'SMAN 70 Jakarta', x: 230, y: 220, category: 'Sekolah' },
    { id: 'AST-2023-094', name: 'Koperasi Merah Putih', x: 440, y: 240, category: 'Koperasi' },
    { id: 'AST-2023-095', name: 'Gudang Logistik Indah', x: 580, y: 190, category: 'Industri' },
  ];

  const filteredPins = mockPins.filter(pin => {
    if (activeCategory === 'Semua') return true;
    return pin.category === activeCategory;
  });

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner flex flex-col">
      {/* Map Control Toolbar Top-Center */}
      {showDrawingToolbar && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur shadow-md rounded-xl py-2 px-4 flex items-center gap-3 z-30 border border-slate-200">
          <button 
            onClick={() => { setIsDrawing(true); setDrawingPoints(''); }}
            className={`p-2 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition ${isDrawing ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
            title="Mulai menggambar Polygon"
            id="btn-draw"
          >
            <Ruler size={16} />
            {isDrawing ? 'Menggambar...' : 'Gambar Area'}
          </button>
          
          {isDrawing && (
            <>
              <button 
                onClick={finishDrawing}
                className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded font-semibold"
                id="btn-finish-draw"
              >
                Selesai
              </button>
              <button 
                onClick={clearDrawing}
                className="p-1.5 hover:bg-red-50 text-red-600 rounded"
                title="Batal"
                id="btn-cancel-draw"
              >
                <Trash2 size={15} />
              </button>
            </>
          )}

          <div className="h-4 w-px bg-slate-200" />
          
          <button className="p-1.5 hover:bg-slate-100 text-slate-600 rounded" title="Bagikan Tautan">
            <Share2 size={15} />
          </button>
          <button className="p-1.5 hover:bg-slate-100 text-slate-600 rounded" title="Hubungkan">
            <LinkIcon size={15} />
          </button>
        </div>
      )}

      {/* Layer Management Overlay Box */}
      {showLayerMenu && (
        <div className="absolute top-4 left-4 w-64 bg-white/95 backdrop-blur-md shadow-lg rounded-xl p-4 z-30 border border-slate-100 text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Layers size={14} className="text-blue-600" /> Layer Management
            </span>
            <button onClick={() => setShowLayerMenu(false)} className="text-slate-400 hover:text-slate-600 text-xs font-medium">Sembunyikan</button>
          </div>
          <div className="space-y-1.5 text-xs">
            <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1">
              <span className="text-slate-700">Satellite View</span>
              <input type="checkbox" checked={layers.satellite} onChange={() => toggleLayer('satellite')} className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" />
            </label>
            <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1">
              <span className="text-slate-700 font-medium">Street View</span>
              <input type="checkbox" checked={layers.street} onChange={() => toggleLayer('street')} className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" />
            </label>
            <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1">
              <span className="text-slate-700 font-medium">Heatmap</span>
              <input type="checkbox" checked={layers.heatmap} onChange={() => toggleLayer('heatmap')} className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" />
            </label>
            <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1">
              <span className="text-slate-500">Boundary Provinsi</span>
              <input type="checkbox" checked={layers.boundaryProv} onChange={() => toggleLayer('boundaryProv')} className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" />
            </label>
            <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1">
              <span className="text-slate-500">Boundary Kabupaten</span>
              <input type="checkbox" checked={layers.boundaryKab} onChange={() => toggleLayer('boundaryKab')} className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" />
            </label>
            <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1">
              <span className="text-slate-500">Boundary Desa</span>
              <input type="checkbox" checked={layers.boundaryDesa} onChange={() => toggleLayer('boundaryDesa')} className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" />
            </label>
            <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1">
              <span className="text-slate-700 font-medium">Polygon Area</span>
              <input type="checkbox" checked={layers.polygonArea} onChange={() => toggleLayer('polygonArea')} className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" />
            </label>
          </div>
        </div>
      )}

      {!showLayerMenu && (
        <button 
          onClick={() => setShowLayerMenu(true)} 
          className="absolute top-4 left-4 bg-white hover:bg-slate-50 shadow-md p-2 rounded-lg z-30 border border-slate-200 text-slate-700"
          title="Tampilkan Layer"
          id="btn-show-layers"
        >
          <Layers size={18} />
        </button>
      )}

      {/* Map Search input Overlay Top-Center (if no toolbar) */}
      {!showDrawingToolbar && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-80 bg-white/95 backdrop-blur shadow-md rounded-xl px-3 py-2 flex items-center z-20 border border-slate-200">
          <input 
            type="text" 
            placeholder="Cari lokasi, koordinat atau aset..." 
            className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder-slate-400"
          />
          <Compass className="text-slate-400 hover:text-blue-600 cursor-pointer" size={16} />
        </div>
      )}

      {/* Map Right-Side Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-30">
        <button 
          onClick={() => setZoom(prev => Math.min(prev + 1, 18))} 
          className="bg-white hover:bg-slate-50 shadow-md p-2 rounded-lg border border-slate-200 text-slate-700 flex justify-center items-center"
          title="Zoom In"
          id="btn-zoomin"
        >
          <ZoomIn size={16} />
        </button>
        <button 
          onClick={() => setZoom(prev => Math.max(prev - 1, 10))} 
          className="bg-white hover:bg-slate-50 shadow-md p-2 rounded-lg border border-slate-200 text-slate-700 flex justify-center items-center"
          title="Zoom Out"
          id="btn-zoomout"
        >
          <ZoomOut size={16} />
        </button>
        <button 
          className="bg-white hover:bg-slate-50 shadow-md p-2 rounded-lg border border-slate-200 text-blue-600 flex justify-center items-center"
          title="Lokasi Saya"
        >
          <Compass className="animate-pulse" size={16} />
        </button>
      </div>

      {/* Actual SVG Interactive Map Drawing Area */}
      <div className="flex-1 w-full h-full relative cursor-crosshair">
        <svg 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: layers.satellite 
              ? 'radial-gradient(circle at 50% 50%, #1e293b 20%, #0f172a 80%)'
              : 'radial-gradient(circle at 50% 50%, #f8fafc 30%, #e2e8f0 90%)',
            transition: 'background-color 0.3s'
          }}
          onClick={handleMapClick}
        >
          {/* Grid lines simulating coordinates */}
          <g stroke={layers.satellite ? '#334155' : '#cbd5e1'} strokeWidth="0.5" strokeDasharray="5,5">
            <line x1="0" y1="100" x2="1000" y2="100" />
            <line x1="0" y1="200" x2="1000" y2="200" />
            <line x1="0" y1="300" x2="1000" y2="300" />
            <line x1="0" y1="400" x2="1000" y2="400" />
            <line x1="0" y1="500" x2="1000" y2="500" />
            <line x1="100" y1="0" x2="100" y2="600" />
            <line x1="200" y1="0" x2="200" y2="600" />
            <line x1="300" y1="0" x2="300" y2="600" />
            <line x1="400" y1="0" x2="400" y2="600" />
            <line x1="500" y1="0" x2="500" y2="600" />
            <line x1="600" y1="0" x2="600" y2="600" />
          </g>

          {/* District boundary maps overlay (simulated) */}
          {(layers.boundaryProv || layers.boundaryKab) && (
            <path 
              d="M 50,50 L 250,30 L 450,80 L 550,220 L 400,380 L 200,450 L 80,320 Z" 
              fill="none" 
              stroke={layers.boundaryProv ? '#ef4444' : '#f59e0b'} 
              strokeWidth="2" 
              strokeDasharray="4,4"
            />
          )}

          {/* Simulated heat map blob layer */}
          {layers.heatmap && (
            <g opacity={heatmapOpacity}>
              <circle cx="210" cy="180" r="100" fill="url(#heat-1)" />
              <circle cx="380" cy="220" r="130" fill="url(#heat-2)" />
              <circle cx="490" cy="120" r="80" fill="url(#heat-1)" />
            </g>
          )}

          {/* Drawn/persisted Polygons */}
          {layers.polygonArea && drawnPolygons.map((p) => (
            <polygon 
              key={p.id}
              points={p.points} 
              fill="rgba(37, 99, 235, 0.15)" 
              stroke="#2563eb" 
              strokeWidth="2" 
              className="hover:fill-blue-500/25 transition cursor-pointer"
            />
          ))}

          {/* Active drawing simulation points */}
          {isDrawing && drawingPoints && (
            <>
              <polygon 
                points={drawingPoints} 
                fill="rgba(59, 130, 246, 0.2)" 
                stroke="#3b82f6" 
                strokeWidth="1.5" 
                strokeDasharray="3,3"
              />
              {drawingPoints.split(' ').map((pt, idx) => {
                const [px, py] = pt.split(',');
                return (
                  <circle 
                    key={idx} 
                    cx={px} 
                    cy={py} 
                    r="4" 
                    fill="#3b82f6" 
                    stroke="white" 
                    strokeWidth="1" 
                  />
                );
              })}
            </>
          )}

          {/* SVG Definitions for Gradients */}
          <defs>
            <radialGradient id="heat-1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heat-2">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Map pins layer */}
          {filteredPins.map((pin) => (
            <g 
              key={pin.id} 
              transform={`translate(${pin.x}, ${pin.y})`}
              className="cursor-pointer"
              onClick={() => {
                setActivePin(pin.id);
                if (onPinClick) onPinClick(pin.id);
              }}
            >
              {/* Pulse effect */}
              <circle cx="0" cy="0" r="10" className="animate-ping" fill="rgba(37, 99, 235, 0.2)" />
              <circle cx="0" cy="0" r="4" fill="#2563eb" />
              <path 
                d="M -12,-35 L 12,-35 L 12,-12 L 0,0 L -12,-12 Z" 
                fill={activePin === pin.id ? '#1e3a8a' : '#2563eb'} 
                stroke="white" 
                strokeWidth="1.5" 
              />
              <text 
                x="0" 
                y="-21" 
                fill="white" 
                fontSize="8" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                GP
              </text>
            </g>
          ))}
        </svg>

        {/* Temporary Tooltip for active selected Pin */}
        {activePin && (
          <div className="absolute top-[80px] left-[260px] bg-white text-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 max-w-xs z-30">
            <div className="flex items-start justify-between mb-1">
              <h4 className="text-xs font-bold text-slate-900">RSUD Jakarta</h4>
              <button onClick={() => setActivePin(null)} className="text-slate-400 hover:text-slate-600 text-xs">×</button>
            </div>
            <p className="text-[10px] text-slate-500 mb-2">Fasilitas kesehatan tingkat lanjutan dengan kapasitas 500 bed.</p>
            <button 
              onClick={() => onPinClick && onPinClick('AST-2023-092')} 
              className="w-full py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] rounded font-semibold transition flex items-center justify-center gap-1"
              id="btn-pin-detail"
            >
              <Info size={10} />
              Lihat Detail
            </button>
          </div>
        )}

        {/* Legend Overlay (Bottom-Center) */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur shadow-sm rounded-lg px-4 py-1.5 flex items-center gap-3 z-20 border border-slate-100 text-[10px] font-medium text-slate-700">
          <span>Kepadatan Data:</span>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Rendah</span>
            <div className="w-24 h-2 rounded bg-gradient-to-r from-blue-300 via-amber-300 to-red-400" />
            <span className="text-slate-600 font-semibold">Tinggi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
