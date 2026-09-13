import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Save, CheckCircle, Clock, Calendar } from 'lucide-react';

const Settings = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    studyHoursPerDay: user?.studyHoursPerDay || 5,
    studyDaysPerWeek: user?.studyDaysPerWeek || 5,
    weeklyProjectDay: user?.weeklyProjectDay || 1,
    targetDate: user?.targetDate ? new Date(user.targetDate).toISOString().split('T')[0] : ''
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
        setMessage('Settings saved successfully!');
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Roadmap Settings</h2>
        <p className="text-xs font-medium text-slate-500">
          Configure your daily study targets, weekly practice days, and target date.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Study Hours Per Day
            </label>
            <input
              type="number"
              min="1"
              max="16"
              value={formData.studyHoursPerDay}
              onChange={(e) => setFormData({ ...formData, studyHoursPerDay: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Daily study time allocated to roadmap topics.</p>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Study Days Per Week
            </label>
            <input
              type="number"
              min="1"
              max="7"
              value={formData.studyDaysPerWeek}
              onChange={(e) => setFormData({ ...formData, studyDaysPerWeek: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Number of active study days per week.</p>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Target Completion Date</label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Used to dynamically compute total days available on dashboard.</p>
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
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
