import React from 'react';
import { CheckCircle2, Circle, Clock, BookOpen, Layers } from 'lucide-react';

const TaskCard = ({ task, onToggleComplete }) => {
  const isCompleted = task.completed || task.status === 'COMPLETED';

  return (
    <div
      onClick={() => onToggleComplete(task._id, !isCompleted)}
      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-3 ${
        isCompleted
          ? 'bg-slate-50 border-slate-200 text-slate-400'
          : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm text-slate-800'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task._id, !isCompleted);
          }}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300" />
          )}
        </button>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              Day {task.dayNumber}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {task.topicName}
            </span>
          </div>
          <h4
            className={`font-bold text-sm mt-1 ${
              isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
            }`}
          >
            {task.title}
          </h4>

          {task.tasksList && task.tasksList.length > 0 && (
            <ul className="mt-2 space-y-1">
              {task.tasksList.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {task.practiceTask && (
            <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60 text-xs text-slate-700">
              <span className="font-bold text-slate-900">Practice: </span>
              {task.practiceTask}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs text-slate-400 whitespace-nowrap font-medium">
        <Clock className="w-3.5 h-3.5" />
        <span>{task.estimatedHours || 4}h</span>
      </div>
    </div>
  );
};

export default TaskCard;
