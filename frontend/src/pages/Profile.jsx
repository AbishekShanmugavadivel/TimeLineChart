import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, GraduationCap, Target, Save, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '3rd B.Sc Computer Science',
    degree: user?.degree || 'Bachelor of Science in Computer Science',
    year: user?.year || '3rd Year',
    graduationYear: user?.graduationYear || '2026-2027',
    targetRole: user?.targetRole || 'AI Engineer'
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await updateProfile(formData);
      if (res.success) {
        setMessage('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">User Profile</h2>
        <p className="text-xs font-medium text-slate-500">
          Manage your personal details, academic status, and target career role.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">College / University</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Degree</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Current Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Graduation Year</label>
              <input
                type="text"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Target Career Role</label>
            <select
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="AI Engineer">AI Engineer</option>
              <option value="ML Engineer">ML Engineer</option>
              <option value="GenAI Engineer">GenAI Engineer</option>
              <option value="Full Stack AI Engineer">Full Stack AI Engineer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="AI Developer">AI Developer</option>
            </select>
          </div>

          {message && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-2 border border-emerald-200">
              <CheckCircle className="w-4 h-4" /> {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
