/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Map, 
  Building2, 
  Waypoints, 
  ClipboardList, 
  Sparkles, 
  TrendingUp, 
  Search, 
  ArrowUpDown, 
  FileBarChart, 
  Users, 
  Bell, 
  User, 
  LogOut, 
  SlidersHorizontal, 
  Settings, 
  CircleHelp, 
  Globe 
} from 'lucide-react';
import { mockNotifications } from '../data/mockData';

interface MainLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  searchPlaceholder?: string;
}

export default function MainLayout({ children, onLogout, searchPlaceholder }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  // Menu items specification
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Peta GIS', path: '/peta-gis', icon: Map },
    { name: 'Aset & Fasilitas', path: '/aset-fasilitas', icon: Building2 },
    { name: 'Bangunan/Polygon', path: '/bangunan-polygon', icon: Waypoints },
    // { name: 'Survey Lapangan', path: '/survey-lapangan', icon: ClipboardList },
    { name: 'AI Intelligence', path: '/ai-intelligence', icon: Sparkles },
    { name: 'AI Prediktif', path: '/ai-prediktif', icon: TrendingUp },
    { name: 'Pencarian', path: '/pencarian', icon: Search },
    { name: 'Import/Export', path: '/import-export', icon: ArrowUpDown },
    { name: 'Report Center', path: '/report-center', icon: FileBarChart },
    { name: 'Manajemen User', path: '/manajemen-user', icon: Users },
    { name: 'Notifikasi & Audit', path: '/notifikasi-audit', icon: Bell },
  ];

  // Dynamic placeholders based on route if searchPlaceholder prop is not explicitly passed
  const getPlaceholder = () => {
    if (searchPlaceholder) return searchPlaceholder;
    
    switch (location.pathname) {
      case '/dashboard':
        return 'Cari ringkasan eksekutif, metrik, atau data spasial...';
      case '/peta-gis':
        return 'Cari lokasi koordinat, nama daerah, atau layer spasial...';
      case '/aset-fasilitas':
        return 'Cari nama infrastruktur, kode aset, atau sebaran daerah...';
      case '/bangunan-polygon':
        return 'Cari kode persil, ID polygon, koordinat batas wilayah...';
      case '/survey-lapangan':
        return 'Cari tugas survey, nama surveyor, atau lokasi GPS...';
      case '/ai-intelligence':
        return 'Tanya AI GeoIntel, cari klasifikasi citra satelit...';
      case '/ai-prediktif':
        return 'Cari analisis prediksi pertumbuhan, simulasi wilayah...';
      case '/pencarian':
        return 'Cari apa saja di seluruh database GeoIntel...';
      case '/import-export':
        return 'Cari log unggah file, riwayat ekspor data...';
      case '/report-center':
        return 'Cari laporan statistik, dokumen ekspor PDF/Word...';
      case '/manajemen-user':
        return 'Cari nama anggota tim, email instansi, role akses...';
      case '/notifikasi-audit':
        return 'Cari catatan aktivitas sistem, kode audit, alert...';
      default:
        return 'Cari lokasi, koordinat, aset atau survey...';
    }
  };

  const unreadCount = mockNotifications ? mockNotifications.filter(n => !n.read).length : 2;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans">
      
      {/* SIDEBAR - Fixed Left, 260px, bg navy #0B1B3F, full height */}
      <aside className="w-[260px] bg-[#0B1B3F] text-slate-300 flex flex-col h-screen fixed top-0 left-0 border-r border-slate-800/40 z-40 select-none">
        
        {/* Header Logo block */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/50">
          <div className="bg-blue-500/20 text-white p-2 rounded-full flex items-center justify-center">
            <Globe size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-wide leading-none">GeoIntel AI</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-1">Geospatial Intelligence</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 py-2.5 rounded-lg text-[11px] font-bold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-blue-500/10 text-white border-l-[3px] border-blue-500 pl-[9px]' 
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-white pl-3'
                  }`
                }
                id={`nav-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                <Icon size={15} className="shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-800/50 space-y-1 bg-slate-950/20">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 rounded-lg text-[11px] font-bold transition ${
                isActive 
                  ? 'bg-blue-500/10 text-white border-l-[3px] border-blue-500 pl-[9px]' 
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-white pl-3'
              }`
            }
            id="nav-profile"
          >
            <User size={15} className="text-slate-400" />
            <span>User Profile</span>
          </NavLink>
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 py-2.5 rounded-lg text-red-400 hover:bg-red-950/20 hover:text-red-300 transition text-left pl-3 text-[11px] font-bold"
            id="btn-logout"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Container Right */}
      <div className="flex-1 pl-[260px] flex flex-col min-h-screen">
        
        {/* TOPBAR - Fixed Top, bg white, border-bottom tipis, height ±64px */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 select-none">
          
          {/* Search bar */}
          <div className="flex-1 max-w-md flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 focus-within:border-blue-500 focus-within:bg-white transition">
            <Search className="text-slate-400 shrink-0" size={15} />
            <input 
              type="text" 
              placeholder={getPlaceholder()} 
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder-slate-400 font-semibold"
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            
            {/* Filter */}
            <button className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-lg transition" title="Filter">
              <SlidersHorizontal size={16} />
            </button>

            {/* Settings */}
            <button className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-lg transition" title="Settings">
              <Settings size={16} />
            </button>

            {/* Help */}
            <button className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-lg transition" title="Help & Support">
              <CircleHelp size={16} />
            </button>

            {/* Notification Bell with red dot */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-lg transition relative"
                id="btn-notifications"
                title="Notifications"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                )}
              </button>

              {/* Minimal Notification Popup */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-slate-800 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between font-bold">
                    <span className="text-slate-900">Notifikasi</span>
                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{unreadCount} Baru</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {mockNotifications && mockNotifications.map((notif) => (
                      <div key={notif.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${notif.read ? 'bg-transparent' : 'bg-blue-600'}`} />
                        <div>
                          <h4 className="font-bold text-slate-900 leading-snug">{notif.title}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{notif.description}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block font-semibold">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-1.5 text-center border-t border-slate-100">
                    <NavLink 
                      to="/notifikasi-audit" 
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-blue-600 hover:text-blue-700 font-bold block"
                    >
                      Lihat Semua Notifikasi
                    </NavLink>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-slate-200" />

            {/* User Profile Avatar with Blue Background or Image */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm border border-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to text initials if image fails
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="absolute">BS</span>
              </div>
              <div className="hidden md:block text-left">
                <h4 className="text-xs font-black text-slate-900 leading-none">Budi Santoso</h4>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5 block">Super Admin</span>
              </div>
            </div>

          </div>
        </header>

        {/* Dynamic Content - padding 32px (p-8), bg #F8FAFC, overflow-y-auto */}
        <main className={`flex-1 ${location.pathname === '/peta-gis' ? 'p-0 overflow-hidden h-[calc(100vh-64px)]' : 'p-8 overflow-y-auto'} bg-[#F8FAFC]`}>
          {children}
        </main>
      </div>
    </div>
  );
}
