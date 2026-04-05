import { useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { Archive as ArchiveIcon, RefreshCw, Trash2, Calendar as CalIcon } from 'lucide-react';
import { format } from 'date-fns';

const Archive = () => {
  const { archivedTasks, fetchArchivedTasks, archiveTask, deleteTask, loading } = useTasks();

  useEffect(() => {
    fetchArchivedTasks();
  }, []);

  const handleRestore = async (id) => {
    try {
      await archiveTask(id, false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Permanently delete this task? This action cannot be undone.')) return;
    try {
      await deleteTask(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight text-center">Historical Archive</h1>
        <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-[0.3em] text-center">Completed & Vaulted Missions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && archivedTasks.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Accessing Vault...</p>
          </div>
        ) : archivedTasks.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-3xl">
            <ArchiveIcon className="w-12 h-12 mx-auto mb-4 text-gray-200" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">The vault is currently empty</p>
          </div>
        ) : (
          archivedTasks.map(task => (
            <div key={task.id} className="card bg-white p-6 opacity-80 hover:opacity-100 transition-all border-gray-100 grayscale hover:grayscale-0">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-tighter">
                  Archived
                </span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleRestore(task.id)}
                    className="text-gray-400 hover:text-primary hover:bg-indigo-50 rounded-lg p-2 transition"
                    title="Restore to active"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-2 transition"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 truncate text-lg line-through decoration-gray-300">{task.title}</h3>
              <p className="text-sm text-gray-400 mb-6 line-clamp-2 font-medium italic">"{task.description || 'No details preserved.'}"</p>
              
              <div className="flex justify-between items-center mt-auto pt-5 border-t border-gray-50">
                <span className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                  <CalIcon className="w-3.5 h-3.5 mr-1.5 text-gray-300" />
                  Completed {task.updatedAt ? format(new Date(task.updatedAt), 'MMM dd, yyyy') : 'Unknown'}
                </span>
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest px-2 py-1 bg-gray-50 rounded-full">
                  Locked
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Archive;
