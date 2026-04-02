import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search, HelpCircle, LayoutGrid } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-[72px] border-b border-gray-100 flex items-center justify-between px-8 bg-white flex-shrink-0">
          <div className="relative w-96 font-sans">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search aquifers..." 
              className="w-full bg-gray-50 border border-transparent rounded-full py-2 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:bg-white transition-colors"
            />
          </div>
          
          <div className="flex items-center space-x-5 text-gray-400">
             <HelpCircle className="hover:text-gray-600 cursor-pointer transition-colors" size={20} />
             <LayoutGrid className="hover:text-gray-600 cursor-pointer transition-colors" size={20} />
             <div className="flex flex-col items-end pl-5 border-l border-gray-100">
                <span className="text-[#0D626A] text-[10px] font-extrabold uppercase tracking-widest">Oasis Flow</span>
                <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">v2.4.1 Light-Mode</span>
             </div>
          </div>
        </header>

        {/* Page Content - No Padding so pages can manage their own borders seamlessly */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
