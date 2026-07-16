/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Layers, 
  Globe, 
  Compass, 
  MapPin, 
  Maximize2, 
  Minimize2,
  Crosshair, 
  Flame, 
  Route, 
  Waypoints, 
  Hexagon, 
  Check, 
  Search, 
  Plus, 
  Minus, 
  Building2, 
  Heart,
  Eye,
  Settings,
  Info,
  Sliders
} from 'lucide-react';

export default function PetaGIS() {
  // Layer state
  const [layers, setLayers] = useState({
    satellite: false,
    street: true,
    heatmap: true,
    provinsi: false,
    kabupaten: false,
    desa: false,
    polygon: true
  });

  // Map state
  const [zoom, setZoom] = useState(1);
  const [mapCenter, setMapCenter] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Marker state
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>('rsud-jakarta');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.6));
  const handleResetView = () => {
    setZoom(1);
    setMapCenter({ x: 0, y: 0 });
  };

  // Drag handlers for the interactive map canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapCenter.x, y: e.clientY - mapCenter.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMapCenter({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Map style depending on layers
  const getMapBackground = () => {
    if (layers.satellite) {
      // Sat Image background styling
      return 'bg-[#060D1E]';
    }
    return 'bg-[#F1F5F9]';
  };

  return (
    <div className={`w-full relative select-none overflow-hidden transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-0 z-50 h-screen' 
        : 'h-[calc(100vh-64px)]'
    }`}>
      
      {/* 1. THE INTERACTIVE MAP CANVAS */}
      <div 
        className={`w-full h-full relative cursor-grab active:cursor-grabbing transition-colors duration-500 overflow-hidden ${getMapBackground()}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        
        {/* SATELLITE IMAGE TILES BACKDROP (If satellite is active) */}
        {layers.satellite && (
          <div className="absolute inset-0 opacity-40 pointer-events-none scale-110 blur-[1px]">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover" 
              alt="Satellite Terrain Background" 
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* DRAGGABLE & ZOOMABLE CONTAINER */}
        <div 
          className="absolute inset-0 w-full h-full origin-center transition-transform duration-75 pointer-events-none"
          style={{
            transform: `translate(${mapCenter.x}px, ${mapCenter.y}px) scale(${zoom})`,
          }}
        >
          {/* THE SVG GRAPHICS LAYER */}
          <svg className="w-full h-full absolute inset-0 min-w-[1200px] min-h-[800px]" viewBox="0 0 1200 800">
            
            {/* GREEN AREAS (Blobs/Parks) */}
            <g id="parks" className="opacity-80 transition-opacity duration-300">
              {/* Taman Suropati */}
              <path 
                d="M 250 150 Q 280 120 340 180 T 400 250 T 300 300 T 220 220 Z" 
                fill={layers.satellite ? '#15803d' : '#DCFCE7'} 
                stroke={layers.satellite ? '#166534' : '#BBF7D0'} 
                strokeWidth="1.5"
                opacity={layers.satellite ? 0.35 : 0.75}
              />
              {/* Gelora Bung Karno Area */}
              <path 
                d="M 750 480 Q 820 400 900 480 T 850 600 T 700 580 Z" 
                fill={layers.satellite ? '#15803d' : '#DCFCE7'} 
                stroke={layers.satellite ? '#166534' : '#BBF7D0'} 
                strokeWidth="2"
                opacity={layers.satellite ? 0.35 : 0.75}
              />
            </g>

            {/* STREETS / ROADS SYSTEM (If streetView is active) */}
            {layers.street && (
              <g id="streets" className="transition-opacity duration-300" opacity={layers.satellite ? 0.4 : 0.85}>
                {/* Main Highways / Jenderal Sudirman */}
                <path 
                  d="M 100 700 L 1100 100" 
                  stroke={layers.satellite ? '#475569' : '#FFFFFF'} 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  fill="none" 
                />
                <path 
                  d="M 100 700 L 1100 100" 
                  stroke={layers.satellite ? '#94A3B8' : '#CBD5E1'} 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  fill="none" 
                />

                {/* Gatot Subroto Hwy */}
                <path 
                  d="M 150 150 L 1050 650" 
                  stroke={layers.satellite ? '#475569' : '#FFFFFF'} 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  fill="none" 
                />
                <path 
                  d="M 150 150 L 1050 650" 
                  stroke={layers.satellite ? '#94A3B8' : '#CBD5E1'} 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  fill="none" 
                />

                {/* secondary Grid Streets */}
                <path d="M 300 100 L 300 700" stroke={layers.satellite ? '#334155' : '#E2E8F0'} strokeWidth="2.5" fill="none" />
                <path d="M 600 100 L 600 700" stroke={layers.satellite ? '#334155' : '#E2E8F0'} strokeWidth="2.5" fill="none" />
                <path d="M 900 100 L 900 700" stroke={layers.satellite ? '#334155' : '#E2E8F0'} strokeWidth="2.5" fill="none" />
                
                <path d="M 100 300 L 1100 300" stroke={layers.satellite ? '#334155' : '#E2E8F0'} strokeWidth="2.5" fill="none" />
                <path d="M 100 500 L 1100 500" stroke={layers.satellite ? '#334155' : '#E2E8F0'} strokeWidth="2.5" fill="none" />
              </g>
            )}

            {/* BUILDING FOOTPRINTS (Blue Translucent Rectangles) */}
            <g id="buildings" className="opacity-70 transition-opacity duration-300">
              {/* Row 1 cluster */}
              <rect x="320" y="280" width="18" height="18" rx="2" fill="#93C5FD" opacity="0.45" />
              <rect x="345" y="280" width="22" height="14" rx="2" fill="#93C5FD" opacity="0.45" />
              <rect x="375" y="275" width="15" height="24" rx="2" fill="#93C5FD" opacity="0.45" />
              
              {/* Row 2 cluster */}
              <rect x="520" y="420" width="30" height="20" rx="3" fill="#93C5FD" opacity="0.5" />
              <rect x="560" y="415" width="24" height="28" rx="3" fill="#93C5FD" opacity="0.5" />
              <rect x="590" y="430" width="16" height="16" rx="2" fill="#93C5FD" opacity="0.5" />

              {/* Menteng cluster */}
              <rect x="180" y="480" width="22" height="22" rx="2" fill="#93C5FD" opacity="0.4" />
              <rect x="210" y="475" width="26" height="18" rx="2" fill="#93C5FD" opacity="0.4" />
              <rect x="245" y="490" width="14" height="14" rx="2" fill="#93C5FD" opacity="0.4" />

              {/* Tebet cluster */}
              <rect x="720" y="220" width="28" height="28" rx="3" fill="#93C5FD" opacity="0.5" />
              <rect x="755" y="215" width="18" height="36" rx="3" fill="#93C5FD" opacity="0.5" />
              <rect x="780" y="235" width="20" height="20" rx="2" fill="#93C5FD" opacity="0.5" />
            </g>

            {/* HEATMAP LAYER (If heatmap is active) */}
            {layers.heatmap && (
              <g id="heatmap" className="transition-opacity duration-500 select-none">
                {/* Hotspot 1 (Sangat Padat - RSUD Area) */}
                <circle cx="550" cy="350" r="140" fill="url(#heatGrad1)" opacity="0.6" />
                <circle cx="550" cy="350" r="70" fill="url(#heatGrad2)" opacity="0.75" />
                <circle cx="550" cy="350" r="25" fill="url(#heatGrad3)" opacity="0.85" />

                {/* Hotspot 2 (Sudirman Area) */}
                <circle cx="850" cy="220" r="110" fill="url(#heatGrad1)" opacity="0.55" />
                <circle cx="850" cy="220" r="50" fill="url(#heatGrad2)" opacity="0.7" />

                {/* Hotspot 3 (Kebayoran Area) */}
                <circle cx="320" cy="550" r="120" fill="url(#heatGrad1)" opacity="0.5" />
                <circle cx="320" cy="550" r="60" fill="url(#heatGrad2)" opacity="0.65" />
              </g>
            )}

            {/* BOUNDARY DESA DASHED (If boundaryDesa is active) */}
            {layers.desa && (
              <g id="boundary-desa" className="transition-opacity duration-300">
                {/* Desa 1 */}
                <path d="M 120 120 L 500 120 L 500 480 L 120 480 Z" stroke="#EAB308" strokeWidth="2.5" strokeDasharray="6,4" fill="none" opacity="0.75" />
                <text x="140" y="145" fill="#EAB308" fontSize="10" fontWeight="bold">BATAS DESA CIDENG</text>
                {/* Desa 2 */}
                <path d="M 500 120 L 1100 120 L 1100 480 L 500 480 Z" stroke="#EAB308" strokeWidth="2.5" strokeDasharray="6,4" fill="none" opacity="0.75" />
                <text x="520" y="145" fill="#EAB308" fontSize="10" fontWeight="bold">BATAS DESA MENTENG</text>
              </g>
            )}

            {/* BOUNDARY KABUPATEN DASHED (If boundaryKabupaten is active) */}
            {layers.kabupaten && (
              <g id="boundary-kabupaten" className="transition-opacity duration-300">
                <path d="M 80 80 L 1120 80 L 1120 720 L 80 720 Z" stroke="#EC4899" strokeWidth="3.5" strokeDasharray="8,5" fill="none" opacity="0.8" />
                <text x="100" y="110" fill="#EC4899" fontSize="11" fontWeight="extrabold">BATAS KABUPATEN JAKARTA PUSAT</text>
              </g>
            )}

            {/* BOUNDARY PROVINSI DASHED (If boundaryProvinsi is active) */}
            {layers.provinsi && (
              <g id="boundary-provinsi" className="transition-opacity duration-300">
                <path d="M 20 20 L 1180 20 L 1180 780 L 20 780 Z" stroke="#10B981" strokeWidth="4.5" strokeDasharray="12,6" fill="none" opacity="0.85" />
                <text x="40" y="60" fill="#10B981" fontSize="13" fontWeight="black">BATAS ADMINISTRATIF PROVINSI DKI JAKARTA</text>
              </g>
            )}

            {/* POLYGON AREA (If polygonArea is active) - Large Blue Border boundary */}
            {layers.polygon && (
              <g id="polygon-area" className="transition-opacity duration-300">
                {/* Thick blue boundary polygon */}
                <polygon 
                  points="220,130 520,110 980,210 1020,540 680,680 340,640 180,420" 
                  fill="rgba(37, 99, 235, 0.05)" 
                  stroke="#2563EB" 
                  strokeWidth="4" 
                  strokeLinejoin="round"
                  className="filter drop-shadow-md"
                />
                {/* Visual marker points along the polygon */}
                <circle cx="220" cy="130" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="520" cy="110" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="980" cy="210" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="1020" cy="540" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="680" cy="680" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="340" cy="640" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="180" cy="420" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>
            )}

            {/* DEF DEFINITIONS FOR GRADIENTS AND FILTERS */}
            <defs>
              <radialGradient id="heatGrad1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heatGrad2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.65" />
                <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heatGrad3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>

          {/* HTML PLACED MARKERS WITH ABSOLUTE COORDINATES TO MATCH THE SVG */}
          
          {/* Marker 1: RSUD Jakarta (Center) - Coordinates: X: 550, Y: 350 */}
          <div 
            className="absolute pointer-events-auto"
            style={{ left: '550px', top: '350px', transform: 'translate(-50%, -100%)' }}
          >
            <button 
              onClick={() => setActiveMarkerId(activeMarkerId === 'rsud-jakarta' ? null : 'rsud-jakarta')}
              className="group focus:outline-none flex flex-col items-center"
              title="RSUD Jakarta"
              id="marker-rsud"
            >
              <div className={`p-2.5 rounded-full transition-all duration-200 shadow-lg border-2 ${
                activeMarkerId === 'rsud-jakarta' 
                  ? 'bg-blue-600 text-white scale-110 border-white ring-4 ring-blue-500/30' 
                  : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
              }`}>
                <MapPin size={20} className="stroke-[2.5]" />
              </div>
              <div className="bg-[#0B1B3F] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-md mt-1 border border-slate-700 whitespace-nowrap">
                RSUD Jakarta
              </div>
            </button>
          </div>

          {/* Marker 2: SMAN 70 Jakarta (Bottom Left Cluster) - Coordinates: X: 320, Y: 550 */}
          <div 
            className="absolute pointer-events-auto"
            style={{ left: '320px', top: '550px', transform: 'translate(-50%, -100%)' }}
          >
            <button 
              onClick={() => setActiveMarkerId(activeMarkerId === 'sman-70' ? null : 'sman-70')}
              className="group focus:outline-none flex flex-col items-center"
              title="SMAN 70 Jakarta"
              id="marker-sman70"
            >
              <div className={`p-2.5 rounded-full transition-all duration-200 shadow-lg border-2 ${
                activeMarkerId === 'sman-70' 
                  ? 'bg-blue-600 text-white scale-110 border-white ring-4 ring-blue-500/30' 
                  : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
              }`}>
                <MapPin size={20} className="stroke-[2.5]" />
              </div>
              <div className="bg-[#0B1B3F] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-md mt-1 border border-slate-700 whitespace-nowrap">
                SMAN 70 Jakarta
              </div>
            </button>
          </div>

          {/* Marker 3: Kantor Bappeda (Top Right) - Coordinates: X: 850, Y: 220 */}
          <div 
            className="absolute pointer-events-auto"
            style={{ left: '850px', top: '220px', transform: 'translate(-50%, -100%)' }}
          >
            <button 
              onClick={() => setActiveMarkerId(activeMarkerId === 'bappeda' ? null : 'bappeda')}
              className="group focus:outline-none flex flex-col items-center"
              title="Kantor Bappeda Jakarta"
              id="marker-bappeda"
            >
              <div className={`p-2.5 rounded-full transition-all duration-200 shadow-lg border-2 ${
                activeMarkerId === 'bappeda' 
                  ? 'bg-blue-600 text-white scale-110 border-white ring-4 ring-blue-500/30' 
                  : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
              }`}>
                <MapPin size={20} className="stroke-[2.5]" />
              </div>
              <div className="bg-[#0B1B3F] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-md mt-1 border border-slate-700 whitespace-nowrap">
                Bappeda DKI
              </div>
            </button>
          </div>

        </div>

      </div>

      {/* 2. FLOATING PANEL LEFT TOP: "Layer Management" */}
      <div className="absolute top-5 left-5 w-72 bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200 rounded-2xl p-5 z-20 animate-fade-in text-slate-800">
        
        {/* Header layer */}
        <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100 mb-4">
          <div className="bg-blue-50 text-blue-600 p-2 rounded-xl border border-blue-100">
            <Layers size={18} />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 tracking-tight leading-none">Layer Management</h3>
            <span className="text-[9px] text-slate-400 font-bold mt-1 block uppercase tracking-wider">Map Configuration</span>
          </div>
        </div>

        {/* Toggles list */}
        <div className="space-y-3 text-xs font-semibold text-slate-600">
          
          {/* Satellite View */}
          <button 
            onClick={() => toggleLayer('satellite')}
            className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-2.5">
              <Globe size={14} className="text-slate-400" />
              <span>Satellite View</span>
            </div>
            <div className={`w-8 h-4 rounded-full transition-colors relative ${layers.satellite ? 'bg-blue-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${layers.satellite ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>

          {/* Street View */}
          <button 
            onClick={() => toggleLayer('street')}
            className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-2.5">
              <Route size={14} className="text-slate-400" />
              <span>Street View</span>
            </div>
            <div className={`w-8 h-4 rounded-full transition-colors relative ${layers.street ? 'bg-blue-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${layers.street ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>

          {/* Heatmap density */}
          <button 
            onClick={() => toggleLayer('heatmap')}
            className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-2.5">
              <Flame size={14} className="text-slate-400" />
              <span>Heatmap Density</span>
            </div>
            <div className={`w-8 h-4 rounded-full transition-colors relative ${layers.heatmap ? 'bg-blue-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${layers.heatmap ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>

          {/* Boundary Provinsi */}
          <button 
            onClick={() => toggleLayer('provinsi')}
            className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-2.5">
              <MapPin size={14} className="text-slate-400" />
              <span>Boundary Provinsi</span>
            </div>
            <div className={`w-8 h-4 rounded-full transition-colors relative ${layers.provinsi ? 'bg-blue-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${layers.provinsi ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>

          {/* Boundary Kabupaten */}
          <button 
            onClick={() => toggleLayer('kabupaten')}
            className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-2.5">
              <Waypoints size={14} className="text-slate-400" />
              <span>Boundary Kabupaten</span>
            </div>
            <div className={`w-8 h-4 rounded-full transition-colors relative ${layers.kabupaten ? 'bg-blue-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${layers.kabupaten ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>

          {/* Boundary Desa */}
          <button 
            onClick={() => toggleLayer('desa')}
            className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-2.5">
              <Compass size={14} className="text-slate-400" />
              <span>Boundary Desa</span>
            </div>
            <div className={`w-8 h-4 rounded-full transition-colors relative ${layers.desa ? 'bg-blue-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${layers.desa ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>

          {/* Polygon Area */}
          <button 
            onClick={() => toggleLayer('polygon')}
            className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-2.5">
              <Hexagon size={14} className="text-slate-400" />
              <span>Polygon Area</span>
            </div>
            <div className={`w-8 h-4 rounded-full transition-colors relative ${layers.polygon ? 'bg-blue-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${layers.polygon ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>

        </div>
      </div>

      {/* 3. FLOATING SEARCH BAR MIDDLE TOP */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4 z-20">
        <div className="bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200 rounded-2xl flex items-center gap-2 px-4 py-3">
          <Search className="text-slate-400 shrink-0" size={16} />
          <input 
            type="text" 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Cari lokasi atau koordinat..." 
            className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder-slate-400 font-bold"
          />
          {searchText && (
            <button 
              onClick={() => setSearchText('')}
              className="text-[10px] text-slate-400 hover:text-slate-600 font-black"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* 4. POPUP CARD DETAILS (For Active Markers) */}
      {activeMarkerId === 'rsud-jakarta' && (
        <div 
          className="absolute bottom-6 left-6 w-[340px] bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-4 z-20 border border-slate-200 text-slate-800 animate-slide-in"
          id="popup-rsud-jakarta"
        >
          {/* Header image and close */}
          <div className="relative h-32 bg-slate-100 rounded-xl overflow-hidden mb-3.5">
            <img 
              src="https://images.unsplash.com/photo-1586773860418-d3b3da9601ee?auto=format&fit=crop&q=80&w=400" 
              className="w-full h-full object-cover" 
              alt="RSUD Jakarta Building" 
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={() => setActiveMarkerId(null)}
              className="absolute top-2.5 right-2.5 bg-black/50 hover:bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center font-black transition text-xs"
              title="Close details"
            >
              ×
            </button>
            <span className="absolute bottom-2.5 left-2.5 bg-blue-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
              Kesehatan
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-black text-slate-950 tracking-tight leading-none">RSUD Jakarta</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1.5">Fasilitas kesehatan tingkat rujukan regional provinsi DKI Jakarta</p>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
              Fasilitas kesehatan tingkat lanjut dengan kapasitas 500 bed aktif, sistem integrasi otomatisasi GeoIntel.
            </p>

            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[10px] font-bold text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Koordinat:</span>
                <span className="font-extrabold text-slate-800">-6.1725, 106.8105</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Kapasitas Bed:</span>
                <span className="font-extrabold text-slate-800">500 Bed Aktif</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Status Validasi:</span>
                <span className="font-extrabold text-emerald-600">Valid</span>
              </div>
            </div>

            <button 
              onClick={() => alert('Membuka detail RSUD Jakarta di sistem rekam aset...')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold py-2 rounded-xl shadow-lg shadow-blue-600/10 flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
            >
              <span>Lihat Detail Lengkap</span>
            </button>
          </div>
        </div>
      )}

      {/* SMAN 70 Popup */}
      {activeMarkerId === 'sman-70' && (
        <div 
          className="absolute bottom-6 left-6 w-[340px] bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-4 z-20 border border-slate-200 text-slate-800 animate-slide-in"
          id="popup-sman-70"
        >
          <div className="relative h-32 bg-slate-100 rounded-xl overflow-hidden mb-3.5">
            <img 
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400" 
              className="w-full h-full object-cover" 
              alt="School Building" 
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={() => setActiveMarkerId(null)}
              className="absolute top-2.5 right-2.5 bg-black/50 hover:bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center font-black transition text-xs"
            >
              ×
            </button>
            <span className="absolute bottom-2.5 left-2.5 bg-purple-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
              Pendidikan
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-black text-slate-900 tracking-tight leading-none">SMAN 70 Jakarta</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1.5">Kebayoran Baru, Jakarta Selatan</p>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
              Sekolah Menengah Atas Negeri percontohan nasional untuk optimalisasi spasial zonasi daerah otonom DKI Jakarta.
            </p>

            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[10px] font-bold text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Koordinat:</span>
                <span className="font-extrabold text-slate-800">-6.2341, 106.7984</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Siswa:</span>
                <span className="font-extrabold text-slate-800">1,240 Siswa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Zonasi:</span>
                <span className="font-extrabold text-blue-600">Sesuai Batas</span>
              </div>
            </div>

            <button 
              onClick={() => alert('Membuka rincian pendidikan...')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold py-2 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition"
            >
              <span>Lihat Detail Lengkap</span>
            </button>
          </div>
        </div>
      )}

      {/* Bappeda Popup */}
      {activeMarkerId === 'bappeda' && (
        <div 
          className="absolute bottom-6 left-6 w-[340px] bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-4 z-20 border border-slate-200 text-slate-800 animate-slide-in"
          id="popup-bappeda"
        >
          <div className="relative h-32 bg-slate-100 rounded-xl overflow-hidden mb-3.5">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400" 
              className="w-full h-full object-cover" 
              alt="Bappeda DKI Building" 
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={() => setActiveMarkerId(null)}
              className="absolute top-2.5 right-2.5 bg-black/50 hover:bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center font-black transition text-xs"
            >
              ×
            </button>
            <span className="absolute bottom-2.5 left-2.5 bg-amber-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
              Pemerintah
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-black text-slate-900 tracking-tight leading-none">Bappeda DKI Jakarta</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1.5">Balai Kota DKI, Gambir</p>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
              Kantor Badan Perencanaan Pembangunan Daerah Provinsi Daerah Khusus Ibukota Jakarta.
            </p>

            <button 
              onClick={() => alert('Membuka info Bappeda...')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold py-2 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition"
            >
              <span>Lihat Detail Lengkap</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. FLOATING MAP CONTROLS (Right Top Round Buttons) */}
      <div className="absolute top-5 right-5 flex flex-col gap-2 z-20 text-slate-700">
        
        {/* Zoom In button */}
        <button 
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white hover:bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center shadow-xl transition hover:text-blue-600 active:scale-[0.95]"
          title="Zoom In (+)"
          id="btn-zoom-in"
        >
          <Plus size={16} className="stroke-[2.5]" />
        </button>

        {/* Zoom Out button */}
        <button 
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white hover:bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center shadow-xl transition hover:text-blue-600 active:scale-[0.95]"
          title="Zoom Out (-)"
          id="btn-zoom-out"
        >
          <Minus size={16} className="stroke-[2.5]" />
        </button>

        {/* Reset View / My Location button */}
        <button 
          onClick={handleResetView}
          className="w-10 h-10 bg-white hover:bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center shadow-xl transition hover:text-blue-600 active:scale-[0.95]"
          title="Reset View / My Location"
          id="btn-reset-view"
        >
          <Crosshair size={16} className="stroke-[2.5]" />
        </button>

        {/* Fullscreen button */}
        <button 
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-10 h-10 bg-white hover:bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center shadow-xl transition hover:text-blue-600 active:scale-[0.95]"
          title={isFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"}
          id="btn-toggle-fullscreen"
        >
          {isFullscreen ? <Minimize2 size={16} className="stroke-[2.5]" /> : <Maximize2 size={16} className="stroke-[2.5]" />}
        </button>

      </div>

      {/* 6. FLOATING DENSITY BAR BOTTOM MIDDLE */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur shadow-2xl border border-slate-200 rounded-2xl py-2.5 px-5 z-20 flex items-center gap-3.5 text-xs text-slate-800">
        <span className="font-extrabold text-slate-900 flex items-center gap-1.5 shrink-0">
          <Flame size={14} className="text-red-500 fill-red-100" />
          Kepadatan Data:
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-emerald-600 font-extrabold">Rendah</span>
          <div className="w-48 h-3 bg-gradient-to-r from-emerald-500 via-amber-400 to-red-600 rounded-full border border-slate-200/50" />
          <span className="text-[10px] text-red-600 font-extrabold">Tinggi</span>
        </div>
      </div>

    </div>
  );
}
