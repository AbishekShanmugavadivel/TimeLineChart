import React, { useState, useEffect } from 'react';
import { resourceService } from '../services/resourceService';
import ResourceCard from '../components/ResourceCard';
import Modal from '../components/Modal';
import { EmptyState } from '../components/Skeleton';
import { Bookmark, Plus } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'Documentation',
    phaseNumber: 1,
    topicName: '',
    description: ''
  });

  const fetchResources = async () => {
    try {
      const res = await resourceService.getResources();
      if (res.success) setResources(res.data);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Remove resource bookmark?')) {
      try {
        await resourceService.deleteResource(id);
        fetchResources();
      } catch (err) {
        console.error('Failed to delete resource:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resourceService.createResource(formData);
      setIsModalOpen(false);
      fetchResources();
    } catch (err) {
      console.error('Failed to add resource:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Curated AI Resources</h2>
          <p className="text-xs font-medium text-slate-500">
            Handpicked documentation, tutorials, courses, and GitHub repositories.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Resource
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 font-bold">Loading resources...</div>
      ) : resources.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No resources found"
          description="Bookmark high quality tutorials and documentation for your roadmap."
          actionText="Add Resource"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((r) => (
            <ResourceCard key={r._id} resource={r} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Add Resource Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Custom Resource"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Resource Title</label>
            <input
              type="text"
              required
              placeholder="e.g. PyTorch Deep Learning Official Tutorial"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">URL</label>
            <input
              type="url"
              required
              placeholder="https://example.com/guide"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Resource Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="Documentation">Documentation</option>
                <option value="Course">Course</option>
                <option value="Video">Video</option>
                <option value="Article">Article</option>
                <option value="GitHub">GitHub</option>
                <option value="Practice">Practice</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Phase Number</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.phaseNumber}
                onChange={(e) => setFormData({ ...formData, phaseNumber: parseInt(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Brief summary of why this resource is useful..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Save Resource
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Resources;
