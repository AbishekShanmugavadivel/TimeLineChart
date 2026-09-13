import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SubHeaderNav from '../components/SubHeaderNav';
import Sidebar from '../components/Sidebar';
import { progressService } from '../services/progressService';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchStreak = async () => {
      if (isAuthenticated) {
        try {
          const res = await progressService.getOverallProgress();
          if (res.success && res.data) {
            setStreakCount(res.data.currentStreak || 0);
          }
        } catch (err) {
          console.error('Failed to load streak:', err);
        }
      }
    };
    fetchStreak();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} streakCount={streakCount} />

      {/* SubHeader Step Banner matching reference UI */}
      <SubHeaderNav />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
