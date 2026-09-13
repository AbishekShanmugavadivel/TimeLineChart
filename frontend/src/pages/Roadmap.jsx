import React, { useState, useEffect } from 'react';
import { roadmapService } from '../services/roadmapService';
import RoadmapTimelineCard from '../components/RoadmapTimelineCard';
import { TimelineSkeleton } from '../components/Skeleton';
import { Search } from 'lucide-react';

const Roadmap = () => {
  const [phases, setPhases] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const res = await roadmapService.getAllPhases();
        if (res.success) setPhases(res.data);
      } catch (err) {
        console.error('Failed to load roadmap phases:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhases();
  }, []);

  const filteredPhases = phases.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.topics.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Complete Roadmap</h2>
          <p className="text-xs font-medium text-slate-500">
            Explore all 10 phases of the GenAI Engineer curriculum.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topic or phase..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      {loading ? (
        <TimelineSkeleton />
      ) : (
        <div className="space-y-6">
          {filteredPhases.map((phase) => (
            <RoadmapTimelineCard key={phase._id} phase={phase} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Roadmap;
