import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Folder, Archive, Plus } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Categories', path: '/categories', icon: Folder },
    { name: 'Archive', path: '/archive', icon: Archive },
  ];

  return (
    <div className="w-64 bg-card border-r border-gray-200 flex flex-col items-center py-6 h-full shadow-sm z-10 relative">
      <div className="text-2xl font-bold text-primary mb-2">TaskFlow</div>
      <div className="text-sm text-gray-500 mb-10 tracking-widest uppercase">The Quiet Authority</div>

      <nav className="w-full px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors font-medium ${
                isActive ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 w-full">
        <button className="btn-primary w-full shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5 transition-all">
          <Plus className="w-5 h-5 mr-2" />
          New Task
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
