import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useCategories } from '../context/CategoryContext';
import { useModals } from '../context/ModalContext';
import { Calendar as CalIcon, Search, Check, Plus, Trash2, Edit2, Archive as ArchiveIcon } from 'lucide-react';
import { format } from 'date-fns';

const Tasks = () => {
  const { tasks, fetchTasks, deleteTask, cycleStatus, archiveTask, loading } = useTasks();
  const { fetchCategories } = useCategories();
  const { openTaskModal } = useModals();
  
  const [filterPriority, setFilterPriority] = useState('All Priorities');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-700 bg-red-100 border-red-200';
      case 'Medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'Low': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filterPriority !== 'All Priorities' && t.priority !== filterPriority) return false;
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto flex h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 pr-6 flex flex-col">
        {/* Header & Filters */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Priority Queue</h1>
          <div className="flex gap-3 items-center">
            <div className="flex items-center bg-white border border-gray-100 rounded-xl px-4 py-2 w-64 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Find a mission..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 w-full text-sm font-medium outline-none bg-transparent text-gray-700"
              />
            </div>
            <select 
              value={filterPriority} 
              onChange={e => setFilterPriority(e.target.value)}
              className="bg-white border border-gray-100 text-sm font-bold rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent px-4 py-2 outline-none shadow-sm text-gray-600"
            >
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <select 
               value={filterStatus}
               onChange={e => setFilterStatus(e.target.value)}
              className="bg-white border border-gray-100 text-sm font-bold rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent px-4 py-2 outline-none shadow-sm text-gray-600"
            >
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 content-start pb-10">
          {loading && tasks.length === 0 ? (
             <div className="col-span-full py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-400 font-bold uppercase text-xs tracking-widest">Loading Repository...</p>
             </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="card bg-white p-6 hover:shadow-xl transition-all relative overflow-hidden group border-gray-100">
                {task.status === 'Done' && (
                  <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border-4 border-green-500/30">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-start mb-4 z-20 relative">
                  <div className="flex flex-col gap-1.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border self-start tracking-tighter ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    {task.category && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border self-start bg-indigo-50 text-primary border-indigo-100">
                        {task.category.name}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => archiveTask(task.id, true)} className="text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg p-2 transition" title="Archive">
                      <ArchiveIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => openTaskModal(task)} className="text-gray-400 hover:text-primary hover:bg-indigo-50 rounded-lg p-2 transition">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-2 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 leading-snug truncate z-20 relative text-lg">{task.title}</h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2 z-20 relative leading-relaxed font-medium">{task.description}</p>
                
                <div className="flex justify-between items-center mt-auto pt-5 border-t border-gray-50 z-20 relative">
                  <span className="flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                    <CalIcon className="w-3.5 h-3.5 mr-1.5 text-gray-300" />
                    {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No set date'}
                  </span>
                  
                  {/* Status Toggle Pill */}
                  <button 
                    onClick={() => cycleStatus(task.id)}
                    className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border transition-all hover:scale-105 active:scale-95 ${
                      task.status === 'Done' ? 'bg-green-100 text-green-700 border-green-200' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      'bg-orange-100 text-orange-700 border-orange-200'
                    }`}
                  >
                    {task.status}
                  </button>
                </div>
              </div>
            ))
          )}
          {!loading && filteredTasks.length === 0 && (
             <div className="col-span-full py-20 text-center bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-3xl">
               <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No active curations match your criteria</p>
             </div>
          )}
        </div>
      </div>

      {/* Focus Mode Sidebar */}
      <div className="w-72 bg-white/40 border-l border-gray-100 p-8 hidden xl:block animate-in slide-in-from-right-8 duration-700">
        <h3 className="font-black text-gray-900 mb-1 text-xl tracking-tight">Focus Chamber</h3>
        <p className="text-xs font-bold text-gray-400 mb-8 border-b border-gray-100 pb-6 uppercase tracking-widest">Silent Productivity</p>
        
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
             <p className="text-gray-400 text-[10px] font-black tracking-widest uppercase mb-2">Priority Debt</p>
             <p className="text-5xl font-black text-gray-900 group-hover:scale-110 transition-transform">
               {tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length}
             </p>
             <p className="mt-3 text-[10px] font-bold text-red-500 uppercase">Critical tasks remaining</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
             <p className="text-gray-400 text-[10px] font-black tracking-widest uppercase mb-2">Daily Quota</p>
             <p className="text-5xl font-black text-gray-900 group-hover:scale-110 transition-transform">
               {tasks.filter(t => t.status === 'Done' && format(new Date(t.updatedAt), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length}
             </p>
             <p className="mt-3 text-[10px] font-bold text-green-500 uppercase">Completed today</p>
          </div>

          <button className="w-full py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-gray-200 hover:bg-black hover:-translate-y-1 transition-all active:scale-95">
            Initialize Deep Work
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => openTaskModal()}
        className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 hover:rotate-90 transition-all z-40"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
};

export default Tasks;
