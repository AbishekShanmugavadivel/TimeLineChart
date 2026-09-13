import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const AccessCodeScreen = () => {
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyAccess } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verifyAccess(code);
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid access code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-3 border border-blue-100">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Private Application Access</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">GenAI Roadmap</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Enter your secret access code to unlock your personalized AI Engineer Roadmap.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold flex items-center gap-2 border border-red-200 shadow-sm animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1.5 tracking-wider">
            Secret Access Code
          </label>
          <div className="relative">
            <input
              type={showCode ? 'text' : 'password'}
              required
              autoComplete="off"
              placeholder="••••••••"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
            />
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
              aria-label={showCode ? 'Hide code' : 'Show code'}
              title={showCode ? 'Hide code' : 'Show code'}
            >
              {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
        >
          <Lock className="w-4 h-4" />
          {loading ? 'Verifying Code...' : 'Unlock Roadmap'}
        </button>
      </form>
    </div>
  );
};

export default AccessCodeScreen;
