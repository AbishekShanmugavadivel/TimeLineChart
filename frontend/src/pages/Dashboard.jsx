import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roadmapService } from '../services/roadmapService';
import { progressService } from '../services/progressService';
import RoadmapTimelineCard from '../components/RoadmapTimelineCard';
import { TimelineSkeleton } from '../components/Skeleton';
import {
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  FolderGit2,
  Target,
  CheckCircle2,
  Sparkles,
  Flame,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [phases, setPhases] = useState([]);
  const [progressStats, setProgressStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [phasesRes, progressRes] = await Promise.all([
          roadmapService.getAllPhases(),
          progressService.getOverallProgress()
        ]);

        if (phasesRes.success) setPhases(phasesRes.data);
        if (progressRes.success) setProgressStats(progressRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const studyHoursPerDay = user?.studyHoursPerDay || 5;
  const studyDaysPerWeek = user?.studyDaysPerWeek || 5;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> AI Engineer Career Operating System
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Future AI Engineer'}! 👋
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Your structured 299-day journey to mastering Machine Learning, Deep Learning, LLMs, RAG, and Voice AI.
          </p>
        </div>
      </div>

      {/* Top Status Cards matching reference UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* CARD 1: Current Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Status</p>
            <h3 className="text-xl font-extrabold text-slate-900">
              {user?.college || '3rd B.Sc Computer Science'}
            </h3>
            <p className="text-xs font-semibold text-blue-600">
              Graduation: {user?.graduationYear || '2026-2027'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
            <GraduationCap className="w-8 h-8" />
          </div>
        </div>

        {/* CARD 2: Total Days Available (Dynamic based on target date) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Days Available</p>
            <h3 className="text-3xl font-black text-slate-900">
              {progressStats?.remainingDaysAvailable || 299} Days
            </h3>
            <p className="text-xs font-semibold text-emerald-600">
              Overall Roadmap Progress: {progressStats?.overallProgressPercent || 0}%
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <Calendar className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Study Summary Section - 4 Cards matching reference UI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Study Hours / Day</span>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <h4 className="text-2xl font-black text-slate-900">{studyHoursPerDay} hours</h4>
          <p className="text-xs text-slate-500 mt-1 font-medium">Configured daily study target</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Study Days / Week</span>
            <Calendar className="w-5 h-5 text-emerald-500" />
          </div>
          <h4 className="text-2xl font-black text-slate-900">{studyDaysPerWeek} days</h4>
          <p className="text-xs text-slate-500 mt-1 font-medium">Dedicated active learning days</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Daily Plan</span>
            <BookOpen className="w-5 h-5 text-purple-500" />
          </div>
          <h4 className="text-2xl font-black text-slate-900">4-6 hours</h4>
          <p className="text-xs text-slate-500 mt-1 font-medium">Core Study + Practical Exercises</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Weekly Practice</span>
            <FolderGit2 className="w-5 h-5 text-amber-500" />
          </div>
          <h4 className="text-2xl font-black text-slate-900">1 day</h4>
          <p className="text-xs text-slate-500 mt-1 font-medium">Project Building / Weekly Revision</p>
        </div>
      </div>

      {/* Roadmap Timeline Header */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your 10-Step Roadmap</h3>
          <p className="text-xs text-slate-500 font-medium">
            Follow the sequential timeline to build production AI engineering competence.
          </p>
        </div>
        <Link
          to="/today"
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-700 shadow-sm flex items-center gap-2"
        >
          <span>Today's Task</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 10-Step Vertical Timeline */}
      {loading ? (
        <TimelineSkeleton />
      ) : (
        <div className="space-y-6">
          {phases.map((phase) => (
            <RoadmapTimelineCard key={phase._id} phase={phase} />
          ))}
        </div>
      )}

      {/* Bottom Dashboard Grid matching uploaded reference image */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {/* FINAL GOAL CARD */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-3 bg-blue-500/20 rounded-xl w-fit text-blue-300 border border-blue-400/30">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-300">Final Goal</span>
            <h4 className="text-xl font-black leading-tight">Become a GenAI / AI Engineer</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Build real-world projects, get hired, and create your own future.
            </p>
          </div>
          <Link
            to="/career"
            className="mt-6 py-2.5 px-4 bg-white text-slate-900 rounded-xl text-xs font-bold text-center hover:bg-slate-100 transition-colors"
          >
            Check Career Readiness →
          </Link>
        </div>

        {/* TIME SUMMARY */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Time Summary</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 font-semibold">
                <span className="text-slate-500">Total Days:</span>
                <span className="font-extrabold text-slate-900">299</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 font-semibold">
                <span className="text-slate-500">Total Hours:</span>
                <span className="font-extrabold text-slate-900">1,495 hrs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 font-semibold">
                <span className="text-slate-500">Study Days:</span>
                <span className="font-extrabold text-slate-900">43 weeks</span>
              </div>
              <div className="flex justify-between py-1 font-semibold">
                <span className="text-slate-500">Buffer / Revision:</span>
                <span className="font-extrabold text-slate-900">25 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* KEY MILESTONES */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Key Milestones</span>
            <ul className="space-y-1.5 text-xs font-semibold text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Python & DSA strong</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>ML & Deep Learning done</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>LLM + RAG project built</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>AI Agent working</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Voice AI + Multimodal project</span>
              </li>
            </ul>
          </div>
          <Link to="/milestones" className="mt-4 text-xs font-bold text-blue-600 hover:underline">
            View All Milestones →
          </Link>
        </div>

        {/* TIPS CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-600">
              <Lightbulb className="w-5 h-5 fill-amber-100" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Success Tips</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li>✓ Follow the daily plan strictly</li>
              <li>✓ Build real open-source projects</li>
              <li>✓ Keep your GitHub commit graph active</li>
              <li>✓ Solve coding problems daily</li>
              <li>✓ Stay consistent & log study sessions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
