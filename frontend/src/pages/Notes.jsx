import React, { useState, useEffect } from 'react';
import { noteService } from '../services/noteService';
import NoteCard from '../components/NoteCard';
import Modal from '../components/Modal';
import { EmptyState } from '../components/Skeleton';
import { FileText, Plus, Search } from 'lucide-react';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    phaseNumber: 1,
    topicName: '',
    tags: ''
  });

  const fetchNotes = async () => {
    try {
      const res = await noteService.getNotes({ search });
      if (res.success) setNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '', phaseNumber: 1, topicName: '', tags: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      phaseNumber: note.phaseNumber || 1,
      topicName: note.topicName || '',
      tags: note.tags ? note.tags.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this note?')) {
      try {
        await noteService.deleteNote(id);
        fetchNotes();
      } catch (err) {
        console.error('Failed to delete note:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await noteService.updateNote(editingNote._id, formData);
      } else {
        await noteService.createNote(formData);
      }
      setIsModalOpen(false);
      fetchNotes();
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Learning Notes</h2>
          <p className="text-xs font-medium text-slate-500">
            Capture essential concepts, code snippets, and cheat sheets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Note
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 font-bold">Loading notes...</div>
      ) : notes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes created yet"
          description="Capture what you learn every day to build a personal AI knowledge base."
          actionText="Create Note"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((n) => (
            <NoteCard key={n._id} note={n} onEdit={handleOpenEditModal} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Note Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNote ? 'Edit Study Note' : 'Create Study Note'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Python Decorators Cheat Sheet"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
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
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Topic Name</label>
              <input
                type="text"
                placeholder="e.g. Decorators"
                value={formData.topicName}
                onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Note Content</label>
            <textarea
              rows={6}
              required
              placeholder="Write your study notes or code examples here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="python, async, decorators"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
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
              {editingNote ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Notes;
