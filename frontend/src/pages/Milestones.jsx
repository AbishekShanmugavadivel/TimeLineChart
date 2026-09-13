import React, { useState, useEffect } from 'react';
import { milestoneService } from '../services/milestoneService';
import MilestoneCard from '../components/MilestoneCard';
import { Award } from 'lucide-react';

const Milestones = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMilestones = async () => {
    try {
      const res = await milestoneService.getMilestones();
      if (res.success) setMilestones(res.data);
    } catch (err) {
      console.error('Failed to load milestones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleToggle = async (id) => {
    try {
      await milestoneService.toggleMilestone(id);
      fetchMilestones();
    } catch (err) {
      console.error('Failed to toggle milestone:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Key Milestones & Achievements
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Track major career breakthroughs as you progress through the 10 roadmap phases.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 font-bold">Loading milestones...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {milestones.map((m) => (
            <MilestoneCard key={m._id} milestone={m} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Milestones;
