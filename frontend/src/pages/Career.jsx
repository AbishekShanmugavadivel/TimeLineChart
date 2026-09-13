import React, { useState, useEffect } from 'react';
import { careerService } from '../services/careerService';
import ProgressBar from '../components/ProgressBar';
import { Briefcase, Target, Award, CheckCircle2 } from 'lucide-react';

const Career = () => {
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        const res = await careerService.getCareerReadiness();
        if (res.success) setCareerData(res.data);
      } catch (err) {
        console.error('Failed to load career stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareerData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-bold">Loading career readiness metrics...</div>;
  }

  const overallReadiness = careerData?.overallReadiness || 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          AI Engineer Career Readiness
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Track your real-time readiness score for hiring manager interviews & top AI roles.
        </p>
      </div>

      {/* Hero Readiness Score Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <Target className="w-3.5 h-3.5" /> Target Role: {careerData?.targetRole || 'AI Engineer'}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black">Overall Career Readiness Score</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Calculated automatically based on completed daily roadmap tasks, PyTorch deep learning modules, and built portfolio projects.
          </p>
        </div>

        {/* Readiness Radial Circle Display */}
        <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shrink-0">
          <span className="text-5xl font-black tracking-tight text-emerald-400">{overallReadiness}%</span>
          <span className="text-xs font-extrabold uppercase text-blue-200 mt-1">Job Ready</span>
        </div>
      </div>

      {/* Technical Skill Percentages Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <span>Technical Skills & Competency Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careerData?.skillsBreakdown?.map((skill, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                <span>{skill.name}</span>
                <span className="text-blue-600 font-extrabold">{skill.percentage}%</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Category: {skill.category}</p>
              <ProgressBar progress={skill.percentage} showLabel={false} height="h-2" color="blue" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
