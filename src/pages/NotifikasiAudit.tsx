/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  Settings, 
  Clock, 
  CheckCheck, 
  Mail, 
  MessageCircle, 
  LayoutGrid, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Check,
  ChevronDown,
  User,
  Activity,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'whatsapp' | 'inapp';
  icon: React.ReactNode;
  iconBg: string;
  enabled: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success';
  time: string;
  unread: boolean;
}

interface AuditLogItem {
  id: string;
  time: string;
  user: string;
  action: string;
  detail: string;
}

export default function NotifikasiAudit() {
  const [activeTab, setActiveTab] = useState<'Notifikasi' | 'Audit Trail'>('Notifikasi');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Notification channels state
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'email',
      name: 'Email Alerts',
      description: 'Daily summaries & critical alerts',
      type: 'email',
      icon: <Mail size={16} className="text-blue-600 stroke-[2.5]" />,
      iconBg: 'bg-blue-50 border-blue-100',
      enabled: true
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Instant critical notifications',
      type: 'whatsapp',
      icon: <MessageCircle size={16} className="text-emerald-600 stroke-[2.5]" />,
      iconBg: 'bg-emerald-50 border-emerald-100',
      enabled: false
    },
    {
      id: 'inapp',
      name: 'In-App Dashboard',
      description: 'All system activities & logs',
      type: 'inapp',
      icon: <LayoutGrid size={16} className="text-purple-600 stroke-[2.5]" />,
      iconBg: 'bg-purple-50 border-purple-100',
      enabled: true
    }
  ]);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Data Anomaly Detected',
      description: 'Unusual polygon area expansion detected in sector 7G. Requires manual verification.',
      type: 'warning',
      time: '10 mins ago',
      unread: true
    },
    {
      id: '2',
      title: 'System Update Complete',
      description: 'GeoIntel AI core engine updated to v2.4. Mapping rendering speed increased by 15%.',
      type: 'info',
      time: '2 hours ago',
      unread: true
    },
    {
      id: '3',
      title: 'Data Import Successful',
      description: 'Batch import of 5,000 asset coordinates completed without errors.',
      type: 'success',
      time: 'Yesterday, 14:30',
      unread: false
    }
  ]);

  // Audit trail state
  const [auditLogs] = useState<AuditLogItem[]>([
    {
      id: 'AUD-001',
      time: '16 Jul 2026, 10:45',
      user: 'Budi Santoso',
      action: 'Login Berhasil',
      detail: 'Sistem mendeteksi otentikasi sukses dari IP 182.253.30.2'
    },
    {
      id: 'AUD-002',
      time: '16 Jul 2026, 09:30',
      user: 'Agus Gunawan',
      action: 'Unggah Foto Survey',
      detail: 'Foto kerusakan tiang penyangga jembatan Sektor D berhasil divalidasi'
    },
    {
      id: 'AUD-003',
      time: '15 Jul 2026, 15:15',
      user: 'Siti Rahmawati',
      action: 'Perubahan Batas Poligon',
      detail: 'Poligon batas administratif wilayah Jawa Barat dimodifikasi'
    }
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleChannel = (id: string, name: string, currentState: boolean) => {
    setChannels(channels.map(c => c.id === id ? { ...c, enabled: !currentState } : c));
    triggerToast(`⚡ Saluran ${name} diatur ke [${!currentState ? 'AKTIF' : 'NONAKTIF'}]`);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    triggerToast('✓ Semua notifikasi telah ditandai sebagai dibaca');
  };

  const handleClearSingle = (id: string, title: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    triggerToast(`🗑️ Notifikasi "${title}" dihapus.`);
  };

  return (
    <div className="flex flex-col gap-6 select-none animate-in fade-in duration-300">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 p-1 rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Notifikasi & Audit Trail
            </span>
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Monitor system alerts and track user activities across the platform.</p>
        </div>
      </div>

      {/* 2. Tabs Switcher */}
      <div className="border-b border-slate-200 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {(['Notifikasi', 'Audit Trail'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                triggerToast(`Pindah ke tab: ${tab}`);
              }}
              className={`px-5 py-3 text-xs font-black relative transition-all whitespace-nowrap ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>{tab}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-200" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Conditional Tab Content */}
      {activeTab === 'Notifikasi' ? (
        <div className="space-y-6">
          
          {/* 3a. Grid 3 Kolom Channel Notifikasi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {channels.map((ch) => {
              return (
                <div 
                  key={ch.id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4.5 flex items-center justify-between shadow-sm hover:shadow-md transition duration-300"
                >
                  <div className="flex items-center gap-3">
                    {/* Icon container */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${ch.iconBg}`}>
                      {ch.icon}
                    </div>
                    {/* Title + Description */}
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-slate-900 leading-snug">
                        {ch.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                        {ch.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => toggleChannel(ch.id, ch.name, ch.enabled)}
                    className={`w-10 h-5.5 flex items-center rounded-full p-0.5 cursor-pointer transition-all shrink-0 ${
                      ch.enabled ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                    title={`Toggle ${ch.name}`}
                  >
                    <div
                      className={`bg-white w-4.5 h-4.5 rounded-full shadow-sm flex items-center justify-center transition-all ${
                        ch.enabled ? 'translate-x-4.5' : 'translate-x-0'
                      }`}
                    >
                      {ch.enabled && (
                        <Check size={8} className="text-blue-600 stroke-[3.5]" />
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* 3b. Card "Recent Notifications" */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
            
            {/* Card Header with "Mark all as read" */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-slate-50/40">
              <div className="flex items-center gap-2">
                <Bell size={14.5} className="text-blue-600 stroke-[2.5]" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Recent Notifications
                </h3>
              </div>
              <button 
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-black flex items-center gap-1 transition hover:underline"
              >
                <CheckCheck size={13} className="stroke-[2.5]" />
                <span>Mark all as read</span>
              </button>
            </div>

            {/* List of Notification Items */}
            <div className="divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-semibold space-y-2">
                  <Bell className="mx-auto stroke-[1.2] text-slate-300" size={36} />
                  <p className="text-xs font-black text-slate-700">Kotak masuk Anda bersih</p>
                  <p className="text-[10px] text-slate-400 font-bold">Tidak ada notifikasi sistem baru saat ini.</p>
                </div>
              ) : (
                notifications.map((item) => {
                  return (
                    <div 
                      key={item.id}
                      className={`p-4.5 flex items-start gap-3.5 transition group hover:bg-slate-50/40 ${
                        item.unread ? 'bg-blue-50/5' : 'bg-white'
                      }`}
                    >
                      {/* Left icon depending on type */}
                      <div className="shrink-0 mt-0.5">
                        {item.type === 'warning' && (
                          <div className="p-2 bg-amber-50 text-amber-500 border border-amber-100 rounded-xl">
                            <AlertTriangle size={15} className="stroke-[2.5]" />
                          </div>
                        )}
                        {item.type === 'info' && (
                          <div className="p-2 bg-blue-50 text-blue-500 border border-blue-100 rounded-xl">
                            <Info size={15} className="stroke-[2.5]" />
                          </div>
                        )}
                        {item.type === 'success' && (
                          <div className="p-2 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-xl">
                            <CheckCircle2 size={15} className="stroke-[2.5]" />
                          </div>
                        )}
                      </div>

                      {/* Middle description & headers */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            {/* Unread indicator blue dot */}
                            {item.unread && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 animate-pulse" title="Belum dibaca" />
                            )}
                            <h4 className="text-xs font-black text-slate-900 tracking-tight">
                              {item.title}
                            </h4>
                          </div>
                          {/* Relative Time on the Right */}
                          <span className="text-[9.5px] text-slate-400 font-bold font-mono shrink-0">
                            {item.time}
                          </span>
                        </div>
                        
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                          {item.description}
                        </p>
                      </div>

                      {/* Action Clear Single button visible on hover */}
                      <div className="shrink-0 self-center pl-2 opacity-0 group-hover:opacity-100 transition duration-200">
                        <button
                          type="button"
                          onClick={() => handleClearSingle(item.id, item.title)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition"
                          title="Hapus"
                        >
                          <Check size={14} className="stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* View All Notifications Link Center Bottom */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50/30 text-center">
              <button
                type="button"
                onClick={() => triggerToast('Membuka log notifikasi arsip terintegrasi...')}
                className="inline-flex items-center gap-1.5 text-[10.5px] text-blue-600 hover:text-blue-800 font-black hover:underline transition"
              >
                <span>View All Notifications</span>
                <ArrowRight size={11} className="stroke-[3]" />
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Audit Trail Tab */
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
          
          {/* Card Header */}
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={14.5} className="text-blue-600 stroke-[2.5]" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                System Audit Trail Logs
              </h3>
            </div>
            <span className="bg-blue-50 text-blue-700 text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-blue-100">
              REAL-TIME MONITOR
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-400 font-black tracking-wider uppercase text-[9px]">
                  <th className="py-3 px-4.5 w-44">Waktu</th>
                  <th className="py-3 px-4 w-44">User</th>
                  <th className="py-3 px-4 w-48">Aksi</th>
                  <th className="py-3 px-4.5">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/30 transition">
                    {/* Waktu */}
                    <td className="py-3 px-4.5 font-mono text-slate-400">
                      {log.time}
                    </td>
                    
                    {/* User */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-black text-[9px] flex items-center justify-center">
                          {log.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-extrabold text-slate-900">{log.user}</span>
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black ${
                        log.action.includes('Gagal') || log.action.includes('Hapus')
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : log.action.includes('Login') || log.action.includes('Berhasil')
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}>
                        {log.action}
                      </span>
                    </td>

                    {/* Detail */}
                    <td className="py-3 px-4.5 text-slate-500 font-medium leading-relaxed">
                      {log.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-3.5 bg-slate-50/30 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => triggerToast('Membuka seluruh log aktivitas audit...')}
              className="inline-flex items-center gap-1.5 text-[10.5px] text-blue-600 hover:text-blue-800 font-black hover:underline transition"
            >
              <span>Lihat Semua Log Audit</span>
              <ArrowRight size={11} className="stroke-[3]" />
            </button>
          </div>

        </div>
      )}

      {/* 4. Toast System */}
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
