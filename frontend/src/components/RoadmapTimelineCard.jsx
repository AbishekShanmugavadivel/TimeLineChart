import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, CheckCircle2, Lock, Terminal, Code, Calculator, Cpu, Network, Eye, Sparkles, Database, Bot, Mic } from 'lucide-react';
import ProgressBar from './ProgressBar';

const iconMap = {
  Terminal,
  Code,
  Calculator,
  Cpu,
  Network,
  Eye,
  Sparkles,
  Database,
  Bot,
  Mic
};

const themeColorStyles = {
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-600',
    lightBg: 'bg-blue-50',
    border: 'border-blue-200',
    progress: 'blue'
  },
  green: {
    bg: 'bg-emerald-500',
    text: 'text-emerald-600',
    lightBg: 'bg-emerald-50',
    border: 'border-emerald-200',
    progress: 'green'
  },
  purple: {
    bg: 'bg-purple-500',
    text: 'text-purple-600',
    lightBg: 'bg-purple-50',
    border: 'border-purple-200',
    progress: 'purple'
  },
  orange: {
    bg: 'bg-amber-500',
    text: 'text-amber-600',
    lightBg: 'bg-amber-50',
    border: 'border-amber-200',
    progress: 'orange'
  },
  pink: {
    bg: 'bg-pink-500',
    text: 'text-pink-600',
    lightBg: 'bg-pink-50',
    border: 'border-pink-200',
    progress: 'pink'
  },
  cyan: {
    bg: 'bg-cyan-500',
    text: 'text-cyan-600',
    lightBg: 'bg-cyan-50',
    border: 'border-cyan-200',
    progress: 'cyan'
  },
  indigo: {
    bg: 'bg-indigo-500',
    text: 'text-indigo-600',
    lightBg: 'bg-indigo-50',
    border: 'border-indigo-200',
    progress: 'indigo'
  }
};

const RoadmapTimelineCard = ({ phase }) => {
  const navigate = useNavigate();
  const theme = themeColorStyles[phase.theme] || themeColorStyles.blue;
  const IconComponent = iconMap[phase.icon] || Code;

  const isCompleted = phase.status === 'COMPLETED' || phase.progressPercent === 100;
  const isInProgress = phase.progressPercent > 0 && !isCompleted;

  const handleAction = () => {
    navigate(`/roadmap/${phase.phaseNumber}`);
  };

  return (
    <div className="relative flex items-stretch gap-4 sm:gap-6 group">
      {/* Vertical Timeline Left Line & Number Node */}
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm text-white shadow-md z-10 ${
            isCompleted ? 'bg-emerald-600 ring-4 ring-emerald-100' : theme.bg
          }`}
        >
          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : phase.phaseNumber}
        </div>
        <div className="w-1 bg-slate-200 flex-1 my-2 group-last:hidden" />
      </div>

      {/* Main Horizontal Card Content */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Title & Topics */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`p-2 rounded-xl ${theme.lightBg} ${theme.text} ${theme.border} border`}>
                <IconComponent className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  PHASE {phase.phaseNumber}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {phase.title}
                </h3>
              </div>
              {isCompleted && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
              )}
            </div>

            {/* Topics Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {phase.topics &&
                phase.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
                  >
                    {t}
                  </span>
                ))}
            </div>
          </div>

          {/* Right Metrics & Action Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 min-w-[220px]">
            <div className="flex items-center gap-4 text-xs text-slate-600 font-semibold">
              <div className="flex items-center gap-1.5" title="Days Duration">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Days {phase.startDay}-{phase.endDay} ({phase.duration}d)</span>
              </div>
              <div className="flex items-center gap-1.5" title="Study Hours">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{phase.studyHours} hrs</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-[180px]">
              <ProgressBar
                progress={phase.progressPercent || 0}
                color={theme.progress}
                height="h-2"
                showLabel={true}
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleAction}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                isCompleted
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                  : isInProgress
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <span>{isCompleted ? 'Review Phase' : isInProgress ? 'Continue →' : 'Start Phase →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapTimelineCard;
