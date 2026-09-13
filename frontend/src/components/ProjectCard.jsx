import React from 'react';
import { Github, ExternalLink, Trash2, Edit2, FolderGit2 } from 'lucide-react';

const statusBadgeStyles = {
  IDEA: 'bg-purple-50 text-purple-700 border-purple-200',
  PLANNING: 'bg-amber-50 text-amber-700 border-amber-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900 leading-tight">
                {project.name}
              </h4>
              <span className="text-xs font-semibold text-slate-400">
                Phase {project.phaseNumber || 1} • {project.difficulty || 'Intermediate'}
              </span>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              statusBadgeStyles[project.status] || statusBadgeStyles.PLANNING
            }`}
          >
            {project.status ? project.status.replace('_', ' ') : 'PLANNING'}
          </span>
        </div>

        <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.technology &&
            project.technology.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                {tech}
              </span>
            ))}
        </div>
      </div>

      {/* Footer Links & Actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <Github className="w-4 h-4" /> Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 text-xs font-bold"
            >
              <ExternalLink className="w-4 h-4" /> Demo
            </a>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              title="Edit Project"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(project._id)}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
