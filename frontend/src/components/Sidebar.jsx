import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Droplets, Bell, Settings, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Droplets,        label: 'Releases',  path: '/releases' },
    { icon: Bell,            label: 'Alerts',    path: '/alerts' },
    { icon: Settings,        label: 'Settings',  path: '/profile' },
  ];

  if (user?.role === 'directeur') {
    menuItems.push({ icon: User, label: 'Agents', path: '/users' });
  }

  return (
    <aside className="w-52 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">

      {/* ── Logo ── */}
      <div className="px-6 py-7 flex items-center space-x-3">
        <div className="w-9 h-9 bg-[#0D9488] rounded-xl flex items-center justify-center shadow-sm shrink-0">
          <Droplets className="text-white" size={18} strokeWidth={2.2} />
        </div>
        <div className="leading-none">
          <p className="text-gray-900 font-bold text-[15px] tracking-tight">Oasis Flow</p>
          <p className="text-gray-400 text-[9px] uppercase tracking-widest mt-0.5">Liquid Earth Admin</p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 space-y-0.5">
        {menuItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `group flex items-center space-x-3 px-4 py-[10px] rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#CCFBF1] text-[#0D9488]'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  strokeWidth={2}
                  className={isActive ? 'text-[#0D9488]' : 'text-gray-400 group-hover:text-gray-500'}
                />
                <span className={`text-sm font-medium ${isActive ? 'text-[#0D9488]' : ''}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User Profile ── */}
      <div className="px-5 py-6 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-200 to-teal-400 flex items-center justify-center shrink-0 ring-2 ring-white shadow-sm overflow-hidden">
            <User className="text-white" size={17} strokeWidth={2} />
          </div>

          {/* Info */}
          <div className="overflow-hidden leading-tight">
            <p className="text-gray-800 text-sm font-semibold truncate capitalize">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-gray-400 text-[11px] truncate lowercase">
              {user?.email ?? `${user?.prenom?.toLowerCase()}.flow@oasis.io`}
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
