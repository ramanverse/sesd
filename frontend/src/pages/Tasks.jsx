import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';
import { Filter, Calendar as CalIcon, Search, Check, Plus, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import TaskModal from '../components/tasks/TaskModal';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filterPriority, setFilterPriority] = useState('All Priorities');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const completeTask = async (id) => {
    try {
      await api.put(`/tasks/${id}`, { status: 'Done' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    if(!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const onModalSave = () => {
    setIsModalOpen(false);
    fetchTasks();
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-700 bg-red-100 border-red-200';
      case 'Medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'Low': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Done': return 'text-green-600';
      case 'In Progress': return 'text-blue-600';
      default: return 'text-orange-500';
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filterPriority !== 'All Priorities' && t.priority !== filterPriority) return false;
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto flex h-full">
      <div className="flex-1 pr-6 flex flex-col">
        {/* Header & Filters */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Priority Queue</h1>
          <div className="flex gap-2 items-center">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 w-64 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 w-full text-sm outline-none bg-transparent"
              />
            </div>
            <select 
              value={filterPriority} 
              onChange={e => setFilterPriority(e.target.value)}
              className="bg-white border border-gray-200 text-sm rounded-lg focus:ring-primary focus:border-primary px-3 py-2 outline-none shadow-sm"
            >
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <select 
               value={filterStatus}
               onChange={e => setFilterStatus(e.target.value)}
              className="bg-white border border-gray-200 text-sm rounded-lg focus:ring-primary focus:border-primary px-3 py-2 outline-none shadow-sm"
            >
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 content-start">
          {filteredTasks.map(task => (
            <div key={task.id} className="card hover:shadow-md transition-shadow relative overflow-hidden group">
              {task.status === 'Done' && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
                  <Check className="w-12 h-12 text-green-500 opacity-50" />
                </div>
              )}
              <div className="flex justify-between items-start mb-3 z-20 relative">
                <span className={`text-xs font-semibold px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(task)} className="text-gray-400 hover:text-blue-500 transition">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 leading-snug truncate z-20 relative">{task.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2 z-20 relative">{task.description}</p>
              
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 z-20 relative">
                <span className="flex items-center text-xs font-medium text-gray-600">
                  <CalIcon className="w-4 h-4 mr-1 text-gray-400" />
                  {task.dueDate ? format(new Date(task.dueDate), 'MMM dd') : 'No set date'}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${getStatusColor(task.status)} uppercase tracking-wider`}>
                    {task.status}
                  </span>
                </div>
              </div>

              {task.status !== 'Done' && (
                <div className="absolute opacity-0 group-hover:opacity-100 bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white via-white to-transparent transition-opacity flex justify-end z-20 pointer-events-none">
                  <button 
                    onClick={() => completeTask(task.id)}
                    className="flex text-xs font-bold items-center bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 shadow-sm transition pointer-events-auto"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Complete
                  </button>
                </div>
              )}
            </div>
          ))}
          {filteredTasks.length === 0 && (
             <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
               No tasks found matching current filters.
             </div>
          )}
        </div>
      </div>

      {/* Focus Mode Sidebar */}
      <div className="w-64 bg-indigo-50/50 border-l border-indigo-100 rounded-r-xl p-5 shadow-inner">
        <h3 className="font-bold text-primary mb-1">Focus Mode</h3>
        <p className="text-xs text-gray-500 mb-6 border-b border-indigo-100 pb-4">Minimize distractions.</p>
        
        <div className="bg-white rounded-lg border border-indigo-100 p-4 text-center shadow-sm relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
           <p className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-1">High Priority Remaining</p>
           <p className="text-4xl font-extrabold text-gray-900">
             {tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length}
           </p>
        </div>

        <button className="mt-6 w-full py-2 bg-indigo-200 text-primary font-bold text-sm rounded-lg shadow hover:bg-indigo-300 transition-colors">
          Start Focus Timer
        </button>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={handleCreate}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 hover:bg-primary-dark transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={selectedTask} 
        onSave={onModalSave} 
      />
    </div>
  );
};

export default Tasks;
