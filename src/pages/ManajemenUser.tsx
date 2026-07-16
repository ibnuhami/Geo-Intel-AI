/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Shield, 
  MapPin, 
  Mail, 
  User, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  UserCheck,
  Building
} from 'lucide-react';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin Wilayah' | 'Surveyor' | 'Viewer';
  regions: string[];
  status: 'Aktif' | 'Nonaktif';
  lastActive: string;
  avatarUrl?: string; // If undefined, show initials
}

export default function ManajemenUser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Semua' | 'Super Admin' | 'Admin Wilayah' | 'Surveyor' | 'Viewer'>('Semua');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Users initial list (including the 3 specific dummy users requested)
  const [users, setUsers] = useState<UserItem[]>([
    {
      id: 'USR-001',
      name: 'Budi Santoso',
      email: 'budi.santoso@geointel.id',
      role: 'Super Admin',
      regions: ['Nasional (Semua Wilayah)'],
      status: 'Aktif',
      lastActive: '2 Jam yang lalu',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 'USR-002',
      name: 'Siti Rahmawati',
      email: 'siti.r@geointel.id',
      role: 'Admin Wilayah',
      regions: ['Jawa Barat', 'Banten'],
      status: 'Aktif',
      lastActive: 'Kemarin, 14:30',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 'USR-003',
      name: 'Agus Gunawan',
      email: 'agus.g@geointel.id',
      role: 'Surveyor',
      regions: ['Bandung Raya'],
      status: 'Aktif',
      lastActive: 'Hari ini, 09:15' // Showing AG initials as avatar
    }
  ]);

  // Dropdown Action Popups
  const [activeActionsId, setActiveActionsId] = useState<string | null>(null);

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'Super Admin' | 'Admin Wilayah' | 'Surveyor' | 'Viewer'>('Surveyor');
  const [formRegionInput, setFormRegionInput] = useState('');
  const [formRegions, setFormRegions] = useState<string[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleStatus = (id: string, name: string, currentStatus: 'Aktif' | 'Nonaktif') => {
    const newStatus = currentStatus === 'Aktif' ? 'Nonaktif' : 'Aktif';
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    triggerToast(`⚡ Status ${name} diubah menjadi [${newStatus}]`);
  };

  const handleAddRegion = () => {
    if (formRegionInput.trim() && !formRegions.includes(formRegionInput.trim())) {
      setFormRegions([...formRegions, formRegionInput.trim()]);
      setFormRegionInput('');
    }
  };

  const handleRemoveRegion = (regionName: string) => {
    setFormRegions(formRegions.filter(r => r !== regionName));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      triggerToast('⚠️ Nama dan Email wajib diisi!');
      return;
    }

    const finalRegions = formRegions.length > 0 
      ? formRegions 
      : (formRole === 'Super Admin' ? ['Nasional (Semua Wilayah)'] : ['Jawa Barat']);

    const newUser: UserItem = {
      id: `USR-${(users.length + 1).toString().padStart(3, '0')}`,
      name: formName,
      email: formEmail,
      role: formRole,
      regions: finalRegions,
      status: 'Aktif',
      lastActive: 'Baru saja bergabung',
    };

    setUsers([...users, newUser]);
    setShowAddModal(false);
    
    // Reset form states
    setFormName('');
    setFormEmail('');
    setFormRole('Surveyor');
    setFormRegionInput('');
    setFormRegions([]);

    triggerToast(`✓ Berhasil menambahkan pengguna baru: ${formName}`);
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUsers(users.filter(u => u.id !== id));
    setActiveActionsId(null);
    triggerToast(`🗑️ Pengguna "${name}" telah dihapus.`);
  };

  // Helper to get initials
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Filtering users logic
  const filteredUsers = users.filter((user) => {
    const matchesTab = activeTab === 'Semua' || user.role === activeTab;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.regions.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 select-none animate-in fade-in duration-300">
      
      {/* 1. HEADER SECTION: judul, subteks, search input, & tombol "+ Tambah User" */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-1 rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Manajemen User
            </span>
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Kelola akses, peran, dan wilayah tanggung jawab pengguna.</p>
        </div>

        {/* Search input + Button block */}
        <div className="flex items-center gap-3 self-start md:self-auto w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search size={14} className="text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/10 transition shadow-sm placeholder-slate-400"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={12} className="stroke-[3]" />
              </button>
            )}
          </div>

          {/* Tombol "+ Tambah User" */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/10 active:scale-[0.98] transition shrink-0"
            id="btn-open-add-user-modal"
          >
            <UserPlus size={14} className="stroke-[2.5]" />
            <span>+ Tambah User</span>
          </button>
        </div>
      </div>

      {/* 2. TAB HORIZONTAL */}
      <div className="border-b border-slate-200 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {(['Semua', 'Super Admin', 'Admin Wilayah', 'Surveyor', 'Viewer'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1); // reset pagination
                triggerToast(`Menampilkan kategori: ${tab}`);
              }}
              className={`px-4.5 py-3 text-xs font-black relative transition-all whitespace-nowrap ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>{tab}</span>
              
              {/* Active Blue Underline */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-200" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. TABEL USER DI CARD PUTIH ROUNDED-XL */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-black tracking-wider uppercase text-[9px]">
                <th className="py-3.5 px-4.5 w-14">Avatar</th>
                <th className="py-3.5 px-4">Nama & Email</th>
                <th className="py-3.5 px-4 w-40">Role</th>
                <th className="py-3.5 px-4">Wilayah Tanggung Jawab</th>
                <th className="py-3.5 px-4 w-28">Status</th>
                <th className="py-3.5 px-4 w-36">Terakhir Aktif</th>
                <th className="py-3.5 px-4 w-16 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                      <User className="stroke-[1.5]" size={36} />
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-slate-700">Tidak ada pengguna ditemukan</p>
                        <p className="text-[10px] text-slate-400 font-bold">Coba cari dengan kata kunci lain atau pilih tab berbeda.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/40 transition">
                    
                    {/* Avatar Column */}
                    <td className="py-3.5 px-4.5">
                      {user.avatarUrl ? (
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200/60 shadow-inner flex items-center justify-center">
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        /* Initials Avatar (Light blue background, bold) */
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-black text-[11px] flex items-center justify-center shadow-inner tracking-wider">
                          {getInitials(user.name)}
                        </div>
                      )}
                    </td>

                    {/* Nama & Email Column */}
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 block leading-snug">{user.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{user.email}</span>
                    </td>

                    {/* Role Badge Column */}
                    <td className="py-3.5 px-4">
                      {user.role === 'Super Admin' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wide bg-[#0B1B3F] text-white">
                          <Shield size={10} className="stroke-[3]" />
                          <span>Super Admin</span>
                        </span>
                      )}
                      {user.role === 'Admin Wilayah' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wide bg-blue-600 text-white">
                          <Shield size={10} className="stroke-[2.5]" />
                          <span>Admin Wilayah</span>
                        </span>
                      )}
                      {user.role === 'Surveyor' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wide bg-blue-50 text-blue-700 border border-blue-100">
                          <User size={10} className="stroke-[2.5]" />
                          <span>Surveyor</span>
                        </span>
                      )}
                      {user.role === 'Viewer' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
                          <User size={10} className="stroke-[2]" />
                          <span>Viewer</span>
                        </span>
                      )}
                    </td>

                    {/* Wilayah Tanggung Jawab Column */}
                    <td className="py-3.5 px-4">
                      {user.regions[0].includes('Nasional') ? (
                        <span className="text-slate-800 font-black text-[11px]">
                          Nasional (Semua Wilayah)
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {user.regions.map((reg) => (
                            <span 
                              key={reg}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black bg-white border border-slate-200 text-slate-600 shadow-sm"
                            >
                              <MapPin size={9} className="text-slate-400 stroke-[2.5]" />
                              <span>{reg}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Status Toggle Switch Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => toggleStatus(user.id, user.name, user.status)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${
                            user.status === 'Aktif' ? 'bg-blue-600' : 'bg-slate-200'
                          }`}
                          title={`Toggle Status - ${user.status}`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md flex items-center justify-center transition-all ${
                              user.status === 'Aktif' ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          >
                            {user.status === 'Aktif' && (
                              <Check size={9} className="text-blue-600 stroke-[3.5]" />
                            )}
                          </div>
                        </button>
                      </div>
                    </td>

                    {/* Terakhir Aktif Column */}
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {user.lastActive}
                    </td>

                    {/* Aksi Column */}
                    <td className="py-3.5 px-4 text-center relative">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (activeActionsId === user.id) {
                              setActiveActionsId(null);
                            } else {
                              setActiveActionsId(user.id);
                            }
                          }}
                          className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition"
                        >
                          <MoreVertical size={14} className="stroke-[2.5]" />
                        </button>

                        {/* Interactive dropdown menu inside row */}
                        {activeActionsId === user.id && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setActiveActionsId(null)} />
                            <div className="absolute right-4.5 mt-7 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden font-black text-[11px]">
                              <button
                                type="button"
                                onClick={() => {
                                  triggerToast(`✏️ Mode Edit diaktifkan untuk: ${user.name}`);
                                  setActiveActionsId(null);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 transition"
                              >
                                Edit Profil & Role
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  triggerToast(`🔑 Reset password dikirimkan ke: ${user.email}`);
                                  setActiveActionsId(null);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 transition"
                              >
                                Reset Sandi Akses
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 transition border-t border-slate-100"
                              >
                                Hapus Pengguna
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. FOOTER TABEL: "Menampilkan..." & pagination (prev, 1 aktif, 2, 3, ..., next) */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-black gap-3">
          <span className="uppercase tracking-wider">Menampilkan 1-3 dari 45 pengguna</span>
          
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-xl shadow-sm">
            {/* Prev Button */}
            <button 
              type="button" 
              onClick={() => triggerToast('Halaman sebelumnya')}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft size={14} className="stroke-[2.5]" />
            </button>
            
            {/* Page Buttons */}
            <button 
              type="button"
              className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-mono font-black flex items-center justify-center text-[10px]"
            >
              1
            </button>
            <button 
              type="button"
              onClick={() => triggerToast('Halaman 2')}
              className="w-6 h-6 rounded-lg text-slate-500 hover:bg-slate-50 font-mono font-black flex items-center justify-center text-[10px]"
            >
              2
            </button>
            <button 
              type="button"
              onClick={() => triggerToast('Halaman 3')}
              className="w-6 h-6 rounded-lg text-slate-500 hover:bg-slate-50 font-mono font-black flex items-center justify-center text-[10px]"
            >
              3
            </button>
            <span className="px-1 text-slate-300 font-mono">...</span>
            
            {/* Next Button */}
            <button 
              type="button" 
              onClick={() => triggerToast('Halaman berikutnya')}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded"
              title="Halaman Berikutnya"
            >
              <ChevronRight size={14} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

      </div>

      {/* 5. ADD USER MODAL DIALOG POPUP */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#0B1B3F]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 text-left">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3.5 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <UserPlus size={14} className="stroke-[2.5]" />
                </div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Tambah User Baru</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)} 
                className="p-1 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={15} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-bold text-slate-700">
              
              {/* Field 1: Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">Nama Lengkap</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Masukkan nama lengkap..." 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none font-bold text-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition"
                  />
                </div>
              </div>

              {/* Field 2: Alamat Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">Alamat Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="nama@geointel.id" 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none font-bold text-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition"
                  />
                </div>
              </div>

              {/* Field 3: Peran / Role */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">Peran / Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Super Admin', 'Admin Wilayah', 'Surveyor', 'Viewer'] as const).map((role) => {
                    const isSelected = formRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setFormRole(role);
                          // Default national region for Super Admin
                          if (role === 'Super Admin' && formRegions.length === 0) {
                            setFormRegions(['Nasional (Semua Wilayah)']);
                          } else if (role !== 'Super Admin' && formRegions.includes('Nasional (Semua Wilayah)')) {
                            setFormRegions([]);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-[10.5px] font-black text-left flex items-center justify-between transition-all duration-200 ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50/40 text-blue-700 shadow-sm' 
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <span>{role}</span>
                        {isSelected && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 4: Wilayah Tanggung Jawab */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">
                  Wilayah Tanggung Jawab
                </label>
                
                {/* Input with Plus button to add multiple regions */}
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <Building size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      value={formRegionInput}
                      onChange={(e) => setFormRegionInput(e.target.value)}
                      placeholder="Contoh: Jawa Barat, DKI Jakarta..." 
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none font-bold text-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:bg-white transition"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRegion}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-black transition active:scale-[0.98]"
                  >
                    + Tambah
                  </button>
                </div>

                {/* List of currently added regions */}
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {formRegions.length === 0 ? (
                    <span className="text-[10px] text-slate-400 font-medium italic">
                      Belum ada wilayah spesifik ditambahkan. {formRole === 'Super Admin' ? 'Akan diatur ke "Nasional (Semua Wilayah)"' : 'Akan diatur ke "Jawa Barat" secara default.'}
                    </span>
                  ) : (
                    formRegions.map((r) => (
                      <span 
                        key={r}
                        className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-xl text-[9px] font-black"
                      >
                        <span>{r}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveRegion(r)}
                          className="text-slate-400 hover:text-red-500 transition"
                        >
                          <X size={10} className="stroke-[3]" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-2 justify-end pt-3.5 border-t border-slate-100 mt-5">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="border border-slate-200 hover:border-slate-300 text-slate-500 font-black px-4 py-2.5 rounded-xl hover:bg-slate-50 transition text-xs"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4.5 py-2.5 rounded-xl shadow-md shadow-blue-600/10 transition text-xs active:scale-[0.98]"
                  id="btn-submit-add-user"
                >
                  Daftarkan Anggota
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 6. TOAST NOTIFICATION SYSTEM */}
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
