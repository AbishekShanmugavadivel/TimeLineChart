import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import { EmptyState } from '../components/Skeleton';
import { FolderGit2, Plus } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technology: '',
    phaseNumber: 1,
    githubUrl: '',
    liveUrl: '',
    status: 'PLANNING',
    difficulty: 'Intermediate'
  });

  const fetchProjects = async () => {
    try {
      const res = await projectService.getProjects();
      if (res.success) setProjects(res.data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      technology: '',
      phaseNumber: 1,
      githubUrl: '',
      liveUrl: '',
      status: 'PLANNING',
      difficulty: 'Intermediate'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      name: proj.name,
      description: proj.description || '',
      technology: proj.technology ? proj.technology.join(', ') : '',
      phaseNumber: proj.phaseNumber || 1,
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      status: proj.status || 'PLANNING',
      difficulty: proj.difficulty || 'Intermediate'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(id);
        fetchProjects();
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject._id, formData);
      } else {
        await projectService.createProject(formData);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Failed to save project:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Project Portfolio Tracker</h2>
          <p className="text-xs font-medium text-slate-500">
            Build and showcase 3-4 real-world AI applications to get hired.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Project
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 font-bold">Loading portfolio projects...</div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects created yet"
          description="Start building your first AI project portfolio to showcase your ML, RAG, and Agent capabilities."
          actionText="Create Project"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <ProjectCard
              key={proj._id}
              project={proj}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit AI Project' : 'Create New AI Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Project Name</label>
            <input
              type="text"
              required
              placeholder="e.g. RAG Document Intelligence Assistant"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Brief description of the AI application architecture and features..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="IDEA">IDEA</option>
                <option value="PLANNING">PLANNING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Technologies (comma separated)</label>
            <input
              type="text"
              placeholder="Python, PyTorch, LangChain, ChromaDB, FastAPI"
              value={formData.technology}
              onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">GitHub URL</label>
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Live Demo URL</label>
              <input
                type="url"
                placeholder="https://my-ai-app.vercel.app"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
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
              {editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
