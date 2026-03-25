import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10 relative">
      <div className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">
        System Overview
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
          <div className="flex flex-col items-end">
            <span className="font-bold text-sm text-gray-900">{user?.name || 'User'}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{user?.role || 'User'}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-primary font-black flex items-center justify-center border border-indigo-100 shadow-sm text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 p-2 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
