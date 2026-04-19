import { Bell, Search, LogOut } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 bg-card border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10 relative">
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96 border border-gray-200 focus-within:ring-2 ring-primary">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search objectives..." 
          className="bg-transparent ml-2 outline-none w-full text-sm placeholder-gray-500" 
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-primary transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-primary font-bold flex items-center justify-center border border-indigo-200 shadow-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="font-medium text-sm text-gray-700">{user?.name || 'User'}</span>
          <button onClick={logout} className="ml-2 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
