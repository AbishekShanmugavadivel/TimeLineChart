import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { roadmapService } from '../services/roadmapService';
import { taskService } from '../services/taskService';
import TaskCard from '../components/TaskCard';
import ProgressBar from '../components/ProgressBar';
import { ArrowLeft, Calendar, Clock, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';

const PhaseDetail = () => {
  const { phaseId } = useParams();
  const [phase, setPhase] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPhaseData = async () => {
    try {
      const res = await roadmapService.getPhaseById(phaseId);
      if (res.success) setPhase(res.data);
    } catch (err) {
      console.error('Failed to load phase details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhaseData();
  }, [phaseId]);

  const handleToggleTask = async (taskId, completed) => {
    try {
      if (completed) {
        await taskService.completeTask(taskId);
      } else {
        await taskService.uncompleteTask(taskId);
      }
      fetchPhaseData();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 font-bold">
        Loading phase details...
      </div>
    );
  }

  if (!phase) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-600 font-bold">Phase not found.</p>
        <Link to="/roadmap" className="text-blue-600 font-bold text-sm">
          ← Back to Roadmap
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/roadmap"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Roadmap
      </Link>

      {/* Phase Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-xs border border-blue-200 uppercase">
            PHASE {phase.phaseNumber}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{phase.title}</h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">{phase.description}</p>

        {/* Phase Statistics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Duration</span>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5">{phase.duration} Days</p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Study Hours</span>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5">{phase.studyHours} Hours</p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Total Topics</span>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5">{phase.topics?.length || 0}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Completion</span>
            <p className="text-lg font-extrabold text-blue-600 mt-0.5">{phase.progressPercent}%</p>
          </div>
        </div>

        <div className="pt-2">
          <ProgressBar progress={phase.progressPercent} showLabel={false} height="h-3" />
        </div>
      </div>

      {/* Learning Topics Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900">Learning Topics & Daily Tasks</h3>

        {phase.topics && phase.topics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {phase.topics.map((topic, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900">{topic.name || topic}</h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Est. {topic.estimatedHours || 6}h
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {topic.description || `Mastering ${topic.name || topic} concepts and hands-on implementation.`}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Daily Tasks List for Phase */}
        <div className="space-y-3">
          {phase.dailyTasks && phase.dailyTasks.map((task) => (
            <TaskCard key={task._id} task={task} onToggleComplete={handleToggleTask} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhaseDetail;
