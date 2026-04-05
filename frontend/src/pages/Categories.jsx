import { useState, useEffect } from 'react';
import { useCategories } from '../context/CategoryContext';
import { Folder, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const PRESET_COLORS = [
  '#3730A3', '#6D28D9', '#DB2777', '#DC2626',
  '#D97706', '#059669', '#0284C7', '#374151',
];

const Categories = () => {
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory, loading } = useCategories();
  
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3730A3');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#3730A3');

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');
    setCreating(true);
    try {
      await createCategory({ name: name.trim(), color });
      setName('');
      setColor('#3730A3');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Tasks will lose their category association.')) return;
    try {
      await deleteCategory(id);
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
      await updateCategory(id, { name: editName.trim(), color: editColor });
      cancelEdit();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Categories</h1>
        <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Organize your workspace</p>
      </div>

      {/* Create Form */}
      <div className="card bg-white p-8 border-gray-100 shadow-xl shadow-gray-100/50">
        <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Initialize New Category
        </h2>

        {error && (
          <div className="mb-6 text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category Identifier</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent px-4 py-3 outline-none transition-all font-bold text-gray-700"
                placeholder="e.g. CORE MISSIONS"
                required
              />
            </div>
            <div className="w-full md:w-auto">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Visual ID</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border border-gray-100 p-1 bg-white"
                />
                <div className="flex gap-1.5 flex-wrap max-w-[150px]">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                        color === c ? 'border-gray-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="bg-primary text-white font-black text-xs uppercase tracking-widest py-4 px-10 rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 w-full md:w-auto"
            >
              {creating ? 'Processing...' : 'Register'}
            </button>
          </div>
        </form>
      </div>

      {/* Category Grid */}
      {loading && categories.length === 0 ? (
        <div className="text-center py-20">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
           <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Curations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="card bg-white p-6 hover:shadow-xl transition-all border-gray-100 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: cat.color }}></div>
              
              {editId === cat.id ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                    autoFocus
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-gray-100 p-1"
                    />
                    <div className="flex gap-1.5 flex-wrap">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setEditColor(c)}
                          className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-110 ${
                            editColor === c ? 'border-gray-900' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      <Check className="w-3 h-3" /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Display Mode */
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      <Folder className="w-6 h-6" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(cat)}
                        className="text-gray-400 hover:text-primary hover:bg-indigo-50 rounded-lg p-2 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-2 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">{cat.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {cat.taskCount ?? 0} active curations
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-50 flex justify-end">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-3xl">
              <Folder className="w-12 h-12 mx-auto mb-4 text-gray-200" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No curations registered in the system</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;
