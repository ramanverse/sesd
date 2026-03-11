import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Folder, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const PRESET_COLORS = [
  '#3730A3', '#6D28D9', '#DB2777', '#DC2626',
  '#D97706', '#059669', '#0284C7', '#374151',
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3730A3');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#3730A3');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      const data = res.data.data ?? res.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');
    setCreating(true);
    try {
      await api.post('/categories', { name: name.trim(), color });
      setName('');
      setColor('#3730A3');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Tasks will lose their category association.')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const startEdit = (cat) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color || '#3730A3');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
    setEditColor('#3730A3');
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      await api.put(`/categories/${id}`, { name: editName.trim(), color: editColor });
      cancelEdit();
      fetchCategories();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-500 mt-1">Organize your tasks into groups and projects.</p>
      </div>

      {/* Create Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-primary" />
          Create New Category
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary px-3 py-2 outline-none shadow-sm"
                placeholder="e.g. Work, Personal, Fitness"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-14 h-10 rounded-lg cursor-pointer border border-gray-200 p-1"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="btn-primary py-2.5 px-6 rounded-lg shadow hover:shadow-md transition disabled:opacity-60"
            >
              {creating ? 'Creating...' : 'Add'}
            </button>
          </div>

          {/* Preset colors */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 mr-1">Quick colors:</span>
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                title={c}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  color === c ? 'border-gray-800 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </form>
      </div>

      {/* Category Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 group hover:shadow-md transition-shadow"
            >
              {editId === cat.id ? (
                /* Edit Mode */
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="w-10 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setEditColor(c)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${
                            editColor === c ? 'border-gray-800' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      className="flex items-center gap-1 text-xs font-bold bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition"
                    >
                      <Check className="w-3 h-3" /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Display Mode */
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      <Folder className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                      <p className="text-xs text-gray-400">
                        {cat.taskCount ?? 0} {cat.taskCount === 1 ? 'task' : 'tasks'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(cat)}
                      className="text-gray-400 hover:text-blue-500 transition p-1"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-gray-400 hover:text-red-500 transition p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
              <Folder className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No categories yet. Create your first one above!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;
