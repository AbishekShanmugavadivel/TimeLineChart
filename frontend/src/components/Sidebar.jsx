import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Map,
  CalendarCheck,
  BarChart3,
  FolderGit2,
  FileText,
  Bookmark,
  Briefcase,
  Award,
  User,
  Settings,
  Shield,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Roadmap', path: '/roadmap', icon: Map },
    { label: 'Today', path: '/today', icon: CalendarCheck },
    { label: 'Progress', path: '/progress', icon: BarChart3 },
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
    { label: 'Notes', path: '/notes', icon: FileText },
    { label: 'Resources', path: '/resources', icon: Bookmark },
    { label: 'Career', path: '/career', icon: Briefcase },
    { label: 'Milestones', path: '/milestones', icon: Award },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  if (user && user.role === 'ADMIN') {
    navItems.push({ label: 'Admin', path: '/admin', icon: Shield });
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col justify-between h-full">
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 lg:hidden">
              <span>Navigation</span>
              <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Bottom user status widget */}
          {user && (
            <div className="pt-4 mt-6 border-t border-slate-100 px-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Role</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5 truncate">{user.targetRole || 'AI Engineer'}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{user.college || 'CS Student'}</span>
                  <span className="font-semibold text-blue-600">{user.graduationYear || '2026'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
