import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import StudyTimer from '../components/StudyTimer';
import TaskCard from '../components/TaskCard';
import { CalendarCheck, Clock, CheckCircle, Flame, Plus } from 'lucide-react';

const Today = () => {
  const { user } = useAuth();
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTodayData = async () => {
    try {
      const res = await taskService.getTodayTasks();
      if (res.success) setTodayData(res.data);
    } catch (err) {
      console.error('Failed to load today task data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayData();
  }, []);

  const handleToggleTask = async (taskId, completed) => {
    try {
      if (completed) {
        await taskService.completeTask(taskId);
      } else {
        await taskService.uncompleteTask(taskId);
      }
      fetchTodayData();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-bold">Loading today's learning plan...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'Engineer'}! 🚀
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Here is your custom daily study plan and active learning tasks for today.
        </p>
      </div>

      {/* Top Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Progress summary */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30">
              Today's Progress
            </span>
            <span className="text-xs font-extrabold text-blue-200">
              Day {todayData?.currentDay || 1} / 299
            </span>
          </div>

          <div className="my-4">
            <p className="text-xs text-blue-200 uppercase tracking-wider font-bold">Current Phase</p>
            <h3 className="text-2xl font-black">{todayData?.phaseTitle || 'Foundation & Core CS'}</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20 text-center">
            <div>
              <span className="text-[11px] text-blue-200 font-medium">Study Target</span>
              <p className="text-base font-extrabold">{todayData?.targetHours || 5} hrs</p>
            </div>
            <div>
              <span className="text-[11px] text-blue-200 font-medium">Completed</span>
              <p className="text-base font-extrabold text-emerald-300">{todayData?.completedHours || 0} hrs</p>
            </div>
            <div>
              <span className="text-[11px] text-blue-200 font-medium">Remaining</span>
              <p className="text-base font-extrabold text-amber-300">{todayData?.remainingHours || 5} hrs</p>
            </div>
          </div>
        </div>

        {/* Study Timer Component */}
        <div>
          <StudyTimer
            defaultPhaseNumber={todayData?.task?.phaseNumber || 1}
            defaultTopicName={todayData?.task?.topicName || 'Daily AI Study'}
            onSessionSaved={fetchTodayData}
          />
        </div>
      </div>

      {/* Today's Task Checklist */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-blue-600" />
          <span>Today's Learning Tasks</span>
        </h3>

        {todayData?.task ? (
          <TaskCard task={todayData.task} onToggleComplete={handleToggleTask} />
        ) : (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 font-medium">
            No tasks found for today.
          </div>
        )}
      </div>
    </div>
  );
};

export default Today;
