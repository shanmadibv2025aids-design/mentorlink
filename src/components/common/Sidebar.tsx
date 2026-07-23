import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  Calendar,
  MessageSquare,
  User,
  UserCheck,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, switchDemoRole } = useAuth();

  if (!user) return null;

  const isMentor = user.role === 'mentor';

  const navItems = [
    {
      label: 'Overview',
      path: isMentor ? '/mentor/dashboard' : '/student/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'AI Matcher',
      path: '/matching',
      icon: Compass,
      badge: 'AI',
    },
    {
      label: 'Bookings',
      path: '/bookings',
      icon: Calendar,
    },
    ...(isMentor
      ? [
          {
            label: 'Student Requests',
            path: '/mentor/requests',
            icon: UserCheck,
          },
        ]
      : []),
    {
      label: 'AI Chat Assistant',
      path: '/chat',
      icon: MessageSquare,
    },
    {
      label: 'Profile & Skills',
      path: '/profile',
      icon: User,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between p-4 bg-[#0D0D0D] border-r border-white/5 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        
        {/* User Role Card */}
        <div className="p-3.5 rounded-2xl bg-[#151515] border border-white/5">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/40"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-white truncate">
                {user.name}
              </h3>
              <p className="text-xs text-slate-400 capitalize flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {user.role} Mode
              </p>
            </div>
          </div>

          <button
            onClick={() => switchDemoRole(isMentor ? 'student' : 'mentor')}
            className="w-full mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors shadow-xs"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
            Switch to {isMentor ? 'Student' : 'Mentor'} View
          </button>
        </div>

        {/* Navigation List */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Platform Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom AI Helper Badge */}
      <div className="p-3.5 rounded-2xl bg-[#151515] border border-white/5 text-slate-300">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold">AI Match Engine v2.4</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          API URL: <code className="text-[10px] text-blue-400">http://localhost:8000</code>
        </p>
      </div>
    </aside>
  );
};
