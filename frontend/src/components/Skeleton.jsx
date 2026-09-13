import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse">
    <div className="h-4 bg-slate-200 rounded w-1/3" />
    <div className="h-8 bg-slate-200 rounded w-2/3" />
    <div className="h-3 bg-slate-200 rounded w-1/2" />
  </div>
);

export const TimelineSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-4 items-center animate-pulse">
        <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-3 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center my-6">
    {Icon && (
      <div className="p-4 rounded-full bg-blue-50 text-blue-600 mb-4">
        <Icon className="w-8 h-8" />
      </div>
    )}
    <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-500 mt-1 max-w-sm">{description}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
      >
        {actionText}
      </button>
    )}
  </div>
);
