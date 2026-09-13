import React, { useState, useEffect } from 'react';
import { progressService } from '../services/progressService';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Flame, Clock, Calendar, Trophy, BarChart3, Award } from 'lucide-react';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const [overallRes, weeklyRes, monthlyRes] = await Promise.all([
          progressService.getOverallProgress(),
          progressService.getWeeklyProgress(),
          progressService.getMonthlyProgress()
        ]);

        if (overallRes.success) setStats(overallRes.data);
        if (weeklyRes.success) setWeeklyData(weeklyRes.data);
        if (monthlyRes.success) setMonthlyData(monthlyRes.data);
      } catch (err) {
        console.error('Failed to load progress stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgressData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-bold">Loading analytics & progress...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Progress Tracking</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Detailed metrics, study hours analytics, and consistency streaks.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Overall Progress"
          value={`${stats?.overallProgressPercent || 0}%`}
          subtitle={`Days: ${stats?.completedDays || 0} / ${stats?.totalDays || 299}`}
          icon={Trophy}
          color="blue"
        />
        <StatCard
          title="Hours Studied"
          value={`${stats?.hoursStudied || 0} hrs`}
          subtitle={`Target: ${stats?.targetHours || 1495} hrs`}
          icon={Clock}
          color="purple"
        />
        <StatCard
          title="Current Streak"
          value={`${stats?.currentStreak || 0} Days`}
          subtitle={`Longest Streak: ${stats?.longestStreak || 0} Days`}
          icon={Flame}
          color="amber"
        />
        <StatCard
          title="Weekly Study"
          value={`${stats?.weeklyHours || 0} hrs`}
          subtitle={`Monthly: ${stats?.monthlyHours || 0} hrs`}
          icon={Calendar}
          color="green"
        />
      </div>

      {/* Overall Progress Bar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-extrabold text-base text-slate-900">Roadmap Completion Goal</h3>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            {stats?.completedDays || 0} / 299 Days Completed
          </span>
        </div>
        <ProgressBar progress={stats?.overallProgressPercent || 0} showLabel={false} height="h-3" color="blue" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Hours Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Weekly Study Hours</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">Current Week</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="hours" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Study Hours Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span>Monthly Study Hours</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">Current Year</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#9333ea" fill="#f3e8ff" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
