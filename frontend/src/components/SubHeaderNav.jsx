import React from 'react';
import { ArrowRight, BookOpen, Hammer, Briefcase, Rocket } from 'lucide-react';

const SubHeaderNav = () => {
  const steps = [
    { label: 'Learn', icon: BookOpen, active: true },
    { label: 'Build', icon: Hammer, active: true },
    { label: 'Get Hired', icon: Briefcase, active: true },
    { label: 'Build Your Future', icon: Rocket, active: true }
  ];

  return (
    <div className="bg-slate-900 text-white py-3 px-4 shadow-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-2 text-xs sm:text-sm font-semibold">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          return (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-1.5 text-blue-300 hover:text-white transition-colors cursor-default">
                <IconComponent className="w-4 h-4 text-blue-400" />
                <span>{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 mx-1 sm:mx-2" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default SubHeaderNav;
