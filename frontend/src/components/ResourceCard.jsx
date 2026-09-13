import React from 'react';
import { Bookmark, ExternalLink, Trash2, Video, BookOpen, FileCode, Globe } from 'lucide-react';

const typeIconMap = {
  Documentation: BookOpen,
  Course: Video,
  Video: Video,
  Article: Globe,
  GitHub: FileCode,
  Practice: Bookmark
};

const ResourceCard = ({ resource, onDelete }) => {
  const IconComp = typeIconMap[resource.type] || Bookmark;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
              <IconComp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900 leading-tight">
                {resource.title}
              </h4>
              <span className="text-xs font-semibold text-slate-400">
                Phase {resource.phaseNumber} • {resource.type}
              </span>
            </div>
          </div>
          {onDelete && !resource.isGlobal && (
            <button
              onClick={() => onDelete(resource._id)}
              className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
              title="Delete Resource"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
          {resource.description || 'Curated learning resource for AI engineering.'}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500">{resource.topicName || 'General'}</span>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <span>Open Link</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default ResourceCard;
