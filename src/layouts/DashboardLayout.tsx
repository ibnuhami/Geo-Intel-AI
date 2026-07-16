/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export default function DashboardLayout({ children, onLogout }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans">
      {/* Sidebar fixed left */}
      <Sidebar onLogout={onLogout} />

      {/* Main Container right */}
      <div className="flex-1 pl-[260px] flex flex-col min-h-screen">
        {/* Topbar sticky top */}
        <Topbar />

        {/* Dynamic Content scrollable */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
