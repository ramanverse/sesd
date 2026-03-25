import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Folder, Archive, Plus } from 'lucide-react';
import { useModals } from '../../context/ModalContext';

const Sidebar = () => {
  const location = useLocation();
  const { openTaskModal } = useModals();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Categories', path: '/categories', icon: Folder },
    { name: 'Archive', path: '/archive', icon: Archive },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col items-center py-6 h-full shadow-sm z-10 relative">
      <div className="text-2xl font-bold text-primary mb-1">TaskFlow</div>
      <div className="text-[10px] text-gray-400 mb-10 tracking-[0.2em] uppercase font-bold">The Quiet Authority</div>

      <nav className="w-full px-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                isActive 
                  ? 'bg-indigo-50 text-primary' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 w-full">
        <button 
          onClick={() => openTaskModal()}
          className="bg-primary text-white w-full py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
