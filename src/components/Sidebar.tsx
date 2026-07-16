/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Building2, 
  Layers, 
  ClipboardList, 
  Sparkles, 
  TrendingUp, 
  Search, 
  ArrowUpDown, 
  FileSpreadsheet, 
  Users, 
  BellRing,
  User,
  LogOut,
  MapPin
} from 'lucide-react';

interface SidebarProps {
  onLogout?: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Peta GIS', path: '/peta-gis', icon: Map },
    { name: 'Aset & Fasilitas', path: '/aset-fasilitas', icon: Building2 },
    { name: 'Bangunan/Polygon', path: '/bangunan-polygon', icon: Layers },
    // { name: 'Survey Lapangan', path: '/survey-lapangan', icon: ClipboardList },
    { name: 'AI Intelligence', path: '/ai-intelligence', icon: Sparkles },
    { name: 'AI Prediktif', path: '/ai-prediktif', icon: TrendingUp },
    { name: 'Pencarian', path: '/pencarian', icon: Search },
    { name: 'Import/Export', path: '/import-export', icon: ArrowUpDown },
    { name: 'Report Center', path: '/report-center', icon: FileSpreadsheet },
    { name: 'Manajemen User', path: '/manajemen-user', icon: Users },
    { name: 'Notifikasi & Audit', path: '/notifikasi-audit', icon: BellRing },
  ];

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  return (
    <aside className="w-[260px] bg-[#0B1B3F] text-slate-100 flex flex-col h-screen fixed top-0 left-0 border-r border-slate-800/50 z-40 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800/60">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <MapPin size={22} className="animate-pulse" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white">GeoIntel AI</h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">Geospatial Intelligence</p>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' 
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`
              }
              id={`nav-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            >
              <Icon size={16} className="shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Profile / Utility Actions */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950/20 space-y-1.5 text-xs text-slate-300">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/50 hover:text-white transition"
          id="nav-profile"
        >
          <User size={16} className="text-slate-400" />
          <span>User Profile</span>
        </NavLink>
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-950/20 hover:text-red-300 transition text-left"
          id="btn-logout"
        >
          <LogOut size={16} />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
