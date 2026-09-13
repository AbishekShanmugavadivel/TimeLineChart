import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import StatCard from '../components/StatCard';
import { Shield, Users, Map, CheckSquare, Layers } from 'lucide-react';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers()
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (usersRes.success) setUsers(usersRes.data);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-bold">Loading admin panel...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Shield className="w-6 h-6 text-purple-600" />
          <span>Platform Admin Panel</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Manage roadmap curriculum, daily tasks, and view platform metrics.
        </p>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Registered Users" value={stats?.totalUsers || 0} icon={Users} color="purple" />
        <StatCard title="Roadmap Phases" value={stats?.totalPhases || 10} icon={Map} color="blue" />
        <StatCard title="Topics Configured" value={stats?.totalTopics || 0} icon={Layers} color="cyan" />
        <StatCard title="Total Daily Tasks" value={stats?.totalTasks || 299} icon={CheckSquare} color="green" />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900">Registered Platform Users</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">Target Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 px-4 text-slate-600">{u.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{u.college || 'N/A'}</td>
                  <td className="py-3 px-4 font-semibold text-blue-600">{u.targetRole || 'AI Engineer'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
