import React from 'react';
import { FileText, Calendar, Trash2, Edit2, Tag } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900 leading-tight">
                {note.title}
              </h4>
              <span className="text-xs font-semibold text-slate-400">
                Phase {note.phaseNumber || 1} • {note.topicName || 'General'}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-3 whitespace-pre-line line-clamp-4 leading-relaxed">
          {note.content}
        </p>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-slate-400" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1 font-medium">
          <Calendar className="w-3.5 h-3.5" /> {formatDate(note.createdAt)}
        </span>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(note)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
              title="Edit Note"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(note._id)}
              className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
              title="Delete Note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
