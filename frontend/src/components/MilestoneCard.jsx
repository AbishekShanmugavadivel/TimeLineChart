import React from 'react';
import { Award, CheckCircle2, Circle } from 'lucide-react';

const MilestoneCard = ({ milestone, onToggle }) => {
  const isCompleted = milestone.completed;

  return (
    <div
      onClick={() => onToggle && onToggle(milestone._id)}
      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
        isCompleted
          ? 'bg-emerald-50/50 border-emerald-200'
          : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
      }`}
    >
      <div
        className={`p-3 rounded-2xl border flex items-center justify-center shrink-0 ${
          isCompleted
            ? 'bg-emerald-500 text-white border-emerald-600'
            : 'bg-slate-100 text-slate-400 border-slate-200'
        }`}
      >
        <Award className="w-6 h-6" />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={`font-extrabold text-base ${
              isCompleted ? 'text-emerald-900' : 'text-slate-900'
            }`}
          >
            {milestone.title}
          </h4>

          {isCompleted ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold flex items-center gap-1">
              <Circle className="w-3.5 h-3.5" /> Locked
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
          {milestone.description}
        </p>

        {milestone.phaseNumber && (
          <span className="inline-block mt-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Phase {milestone.phaseNumber} Milestone
          </span>
        )}
      </div>
    </div>
  );
};

export default MilestoneCard;
