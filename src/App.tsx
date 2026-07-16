/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import PetaGIS from './pages/PetaGIS';
import AsetFasilitas from './pages/AsetFasilitas';
import BangunanPolygon from './pages/BangunanPolygon';
import SurveyLapangan from './pages/SurveyLapangan';
import AIIntelligence from './pages/AIIntelligence';
import AIPrediktif from './pages/AIPrediktif';
import Pencarian from './pages/Pencarian';
import ImportExport from './pages/ImportExport';
import ReportCenter from './pages/ReportCenter';
import ManajemenUser from './pages/ManajemenUser';
import NotifikasiAudit from './pages/NotifikasiAudit';
import Login from './pages/Login';

// Optional simple Profile view to avoid broken links
function Profile() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md mx-auto shadow-sm text-xs space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
            alt="Admin" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900">Admin Nusantara</h3>
          <p className="text-slate-400 font-bold">admin@geointel.ai</p>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-4 space-y-2 text-slate-600 font-semibold">
        <div className="flex justify-between"><span>Sistem Role:</span><span className="text-blue-600 font-extrabold">Administrator Utama</span></div>
        <div className="flex justify-between"><span>Wilayah Penugasan:</span><span className="text-slate-800">Nasional</span></div>
        <div className="flex justify-between"><span>Instansi:</span><span className="text-slate-800">Bappeda / Pemda DKI Jakarta</span></div>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
        
        {/* Main protected layout */}
        <Route
          path="/*"
          element={
            <MainLayout onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/peta-gis" element={<PetaGIS />} />
                <Route path="/aset-fasilitas" element={<AsetFasilitas />} />
                <Route path="/bangunan-polygon" element={<BangunanPolygon />} />
                <Route path="/survey-lapangan" element={<SurveyLapangan />} />
                <Route path="/ai-intelligence" element={<AIIntelligence />} />
                <Route path="/ai-prediktif" element={<AIPrediktif />} />
                <Route path="/pencarian" element={<Pencarian />} />
                <Route path="/import-export" element={<ImportExport />} />
                <Route path="/report-center" element={<ReportCenter />} />
                <Route path="/manajemen-user" element={<ManajemenUser />} />
                <Route path="/notifikasi-audit" element={<NotifikasiAudit />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
