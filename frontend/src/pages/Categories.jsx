import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Folder, Plus, Trash2 } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3730A3');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await api.post('/categories', { name, color });
      setName('');
      setColor('#3730A3');
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Tasks associated with it will have their category removed.')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-500">Manage your projects and groups.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-primary" />
          Create New Category
        </h2>
        <form onSubmit={handleCreate} className="flex items-end gap-4">
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
          <button type="submit" className="btn-primary py-2.5 px-6 rounded-lg shadow hover:shadow-md transition">
            Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between group hover:shadow-md transition">
            <div className="flex items-center">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
              >
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-xs text-gray-500">Project</p>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(cat.id)}
              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete Category"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        
        {categories.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            No categories created yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
