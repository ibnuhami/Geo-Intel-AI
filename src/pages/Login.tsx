/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@geointel.ai');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
    navigate('/dashboard');
  };

  const handleRoleSelect = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans text-slate-800 bg-[#F8FAFC] select-none">
      
      {/* COLUMN KIRI (±40% lebar, full height): bg gradient biru gelap */}
      <div className="w-full md:w-[40%] bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden shrink-0 min-h-[340px] md:min-h-screen">
        {/* Decorative Grid Lines Overlay */}
        <div className="absolute inset-0 opacity-10 bg-grid-pattern pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />

        {/* Brand logo header */}
        <div className="flex items-center gap-3 z-10 relative">
          <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/20 shadow-inner">
            <Map className="text-white animate-pulse" size={24} />
          </div>
          <div>
            <span className="text-base font-black tracking-wider block">GeoIntel AI</span>
            <span className="text-[9px] text-blue-200 font-bold tracking-widest block uppercase">Geospatial Platform</span>
          </div>
        </div>

        {/* Center Typography Tagline */}
        <div className="space-y-4 my-auto py-8 md:py-0 z-10 relative max-w-sm">
          <span className="text-[10px] bg-white/10 text-white font-extrabold px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest inline-block">
            Nusantara Edition
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
            Advanced Geospatial Intelligence and Predictive Mapping for Enterprise Data Dominance.
          </h1>
          <p className="text-blue-100 text-xs leading-relaxed font-medium">
            Sistem kecerdasan spasial nasional terpadu untuk analisis tata kota prediktif, validasi batas wilayah otonom, dan optimalisasi sebaran aset strategis nasional.
          </p>
        </div>

        {/* Footer badges */}
        <div className="z-10 relative pt-4 border-t border-white/10 flex flex-wrap gap-2.5">
          <div className="bg-white/10 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full border border-white/15 font-bold flex items-center gap-1.5">
            <span>🗺</span> Real-time Data
          </div>
          <div className="bg-white/10 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full border border-white/15 font-bold flex items-center gap-1.5">
            <span>📊</span> AI Predictions
          </div>
        </div>
      </div>

      {/* COLUMN KANAN (±60%, bg putih/abu sangat muda): Card login center */}
      <div className="flex-1 bg-slate-50 flex flex-col justify-center items-center p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          
          {/* Card Wrapper */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10 transition-all duration-300 hover:shadow-2xl">
            {/* Title & Subtitle */}
            <div className="text-center md:text-left mb-6">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Masuk ke GeoIntel AI</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-semibold">
                Silakan masukkan kredensial Anda untuk mengakses platform.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              
              {/* Input Email Address */}
              <div className="space-y-1.5">
                <label className="block text-slate-600 font-bold" htmlFor="login-email">Alamat Email</label>
                <div className="relative">
                  <Mail size={15} className="text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input 
                    id="login-email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@geointel.ai"
                    required
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none font-bold text-slate-800 bg-slate-50/50 focus:bg-white focus:border-blue-600 transition"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-slate-600 font-bold" htmlFor="login-password">Password</label>
                  <a href="#" className="text-[10px] text-blue-600 hover:underline font-extrabold">Lupa password?</a>
                </div>
                <div className="relative">
                  <Lock size={15} className="text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input 
                    id="login-password"
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-3 outline-none font-bold text-slate-800 bg-slate-50/50 focus:bg-white focus:border-blue-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md"
                    title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    id="btn-toggle-password"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Checkbox Remember Me */}
              <div className="flex items-center gap-2 pt-1 font-bold select-none">
                <input 
                  id="remember-me"
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer border-slate-300" 
                />
                <label htmlFor="remember-me" className="text-slate-500 text-[11px] cursor-pointer">Ingat saya di perangkat ini</label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-xl shadow-blue-600/20 active:scale-[0.99] transition duration-200 mt-2"
                id="btn-login-submit"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight size={15} />
              </button>
            </form>
          </div>

          {/* Under Card: AVAILABLE ROLES Demo Quick Links */}
          <div className="text-center pt-2">
            <span className="text-[10px] text-slate-400 font-extrabold tracking-widest block mb-3 uppercase">
              Available Demo Roles
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => handleRoleSelect('admin@geointel.ai')}
                className="border border-slate-200 hover:border-blue-500 text-slate-600 hover:text-blue-600 transition duration-200 cursor-pointer text-[10px] font-bold px-3 py-1.5 rounded-full bg-white shadow-sm hover:shadow"
                title="Login sebagai Super Admin"
                id="demo-role-superadmin"
              >
                Super Admin
              </button>
              <button 
                onClick={() => handleRoleSelect('wilayah@geointel.ai')}
                className="border border-slate-200 hover:border-blue-500 text-slate-600 hover:text-blue-600 transition duration-200 cursor-pointer text-[10px] font-bold px-3 py-1.5 rounded-full bg-white shadow-sm hover:shadow"
                title="Login sebagai Admin Wilayah"
                id="demo-role-wilayah"
              >
                Admin Wilayah
              </button>
              <button 
                onClick={() => handleRoleSelect('surveyor@geointel.ai')}
                className="border border-slate-200 hover:border-blue-500 text-slate-600 hover:text-blue-600 transition duration-200 cursor-pointer text-[10px] font-bold px-3 py-1.5 rounded-full bg-white shadow-sm hover:shadow"
                title="Login sebagai Surveyor Lapangan"
                id="demo-role-surveyor"
              >
                Surveyor
              </button>
              <button 
                onClick={() => handleRoleSelect('viewer@geointel.ai')}
                className="border border-slate-200 hover:border-blue-500 text-slate-600 hover:text-blue-600 transition duration-200 cursor-pointer text-[10px] font-bold px-3 py-1.5 rounded-full bg-white shadow-sm hover:shadow"
                title="Login sebagai Public Viewer"
                id="demo-role-viewer"
              >
                Viewer
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
