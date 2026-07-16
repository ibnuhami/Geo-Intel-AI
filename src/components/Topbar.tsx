/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Bell, Settings, HelpCircle, Filter } from 'lucide-react';
import { mockNotifications } from '../data/mockData';

interface TopbarProps {
  title?: string;
  onSearch?: (term: string) => void;
}

export default function Topbar({ title, onSearch }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="h-[70px] bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Search Input Bar */}
      <div className="flex-1 max-w-lg flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <Search className="text-slate-400" size={17} />
        <input 
          type="text" 
          placeholder="Cari lokasi, koordinat, aset atau survey..." 
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder-slate-400 font-medium"
        />
        <button className="text-slate-400 hover:text-slate-600">
          <Filter size={15} />
        </button>
      </div>

      {/* Right Side Utility Controls */}
      <div className="flex items-center gap-4">
        {/* Settings Button */}
        <button className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 p-2 rounded-lg transition">
          <Settings size={18} />
        </button>

        {/* Help Support Icon */}
        <button className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 p-2 rounded-lg transition">
          <HelpCircle size={18} />
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 p-2 rounded-lg transition relative"
            id="btn-notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-slate-800">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Notifikasi</span>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">{unreadCount} Baru</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${notif.read ? 'bg-transparent' : 'bg-blue-600'}`} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{notif.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{notif.description}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-1.5 text-center border-t border-slate-100">
                <a href="/notifikasi-audit" className="text-[10px] text-blue-600 hover:text-blue-700 font-bold">Lihat Semua Notifikasi</a>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* Active User Avatar Profile Section */}
        <div className="flex items-center gap-2.5 pl-1">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" 
            alt="User Avatar" 
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div className="hidden md:block text-left">
            <h4 className="text-xs font-bold text-slate-900 leading-none">Budi Santoso</h4>
            <span className="text-[9px] text-slate-400 font-medium mt-0.5 block">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
