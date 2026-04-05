import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Calendar, Quote, CheckCircle, Clock, AlertCircle, TrendingUp, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const MOTIVATIONAL_QUOTES = [
  { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Done is better than perfect.', author: 'Sheryl Sandberg' },
  { text: 'Work smarter, not harder.', author: 'Allen F. Morgenstern' },
  { text: "It's not about having time. It's about making time.", author: 'Unknown' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [stats, setStats] = useState({ 
    total: 0, pending: 0, inProgress: 0, done: 0, overdue: 0, 
    completionRate: 0, upcomingSyncs: [] 
  });
  const [loading, setLoading] = useState(true);
  const [quote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashRes, tasksRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/tasks'),
        ]);

        const dashData = dashRes.data.data || dashRes.data;
        setStats({
          total: dashData.total || 0,
          pending: dashData.pending || 0,
          inProgress: dashData.inProgress || 0,
          done: dashData.done || 0,
          overdue: dashData.overdue || 0,
          completionRate: dashData.completionRate || 0,
          upcomingSyncs: dashData.upcomingSyncs || []
        });

        const allTasks = tasksRes.data.data || tasksRes.data;
        const active = Array.isArray(allTasks)
          ? allTasks.filter(t => t.status === 'In Progress' || t.status === 'IN_PROGRESS')
          : [];
        setInProgressTasks(active.slice(0, 3));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your productivity overview for today.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-gray-700">{format(new Date(), 'EEEE, MMM dd')}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card group hover:border-primary/30 transition-all flex items-center gap-5 p-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Pending</p>
            <h3 className="text-3xl font-black text-gray-900">{loading ? '—' : stats.pending}</h3>
          </div>
        </div>

        <div className="card group hover:border-primary/30 transition-all flex items-center gap-5 p-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">In Progress</p>
            <h3 className="text-3xl font-black text-gray-900">{loading ? '—' : stats.inProgress}</h3>
          </div>
        </div>

        <div className="card group hover:border-primary/30 transition-all flex items-center gap-5 p-6">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-3xl font-black text-gray-900">{loading ? '—' : stats.done}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Curations (Left) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-xl font-bold text-gray-900">Active Curations</h2>
            <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              [1, 2].map(i => <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-2xl"></div>)
            ) : inProgressTasks.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl">
                <p className="text-gray-500">No active tasks. Start a new one!</p>
              </div>
            ) : (
              inProgressTasks.map(task => (
                <div key={task.id} className="card bg-white p-5 hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-indigo-50 text-primary rounded">
                      {task.priority}
                    </span>
                    <Clock className="w-4 h-4 text-gray-300" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 truncate">{task.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">{task.description || 'No description provided.'}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] text-gray-400 font-medium">{task.category?.name || 'Uncategorized'}</span>
                    <span className="text-[10px] text-gray-900 font-bold">{task.dueDate ? format(new Date(task.dueDate), 'MMM dd') : 'No Date'}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Overdue Banner */}
          {!loading && stats.overdue > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-4 animate-bounce-subtle">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-900">Urgent: {stats.overdue} Overdue Tasks</h4>
                <p className="text-xs text-red-700">These items need your immediate attention to maintain momentum.</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Widgets (Right) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Progress Circle Card */}
          <div className="card p-8 text-center flex flex-col items-center">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Completion Rate</h3>
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-gray-50 mb-6">
              {/* CSS Circular Progress using Conic Gradient */}
              <div 
                className="absolute inset-0 rounded-full" 
                style={{
                  background: `conic-gradient(#3730A3 ${stats.completionRate}%, transparent 0)`
                }}
              ></div>
              <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl font-black text-gray-900">{stats.completionRate}%</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Target 100%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium">{stats.done} of {stats.total} goals achieved</p>
          </div>

          {/* Upcoming Syncs */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
               Upcoming Syncs <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">{stats.upcomingSyncs.length}</span>
            </h3>
            <div className="space-y-4">
              {stats.upcomingSyncs.map(sync => (
                <div key={sync.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                  <div>
                    <h5 className="text-sm font-bold text-gray-900">{sync.title}</h5>
                    <p className="text-[11px] text-gray-500">{sync.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Card */}
          <div className="card bg-gray-900 text-white p-6 relative overflow-hidden group">
            <Quote className="absolute -bottom-4 -right-4 w-20 h-20 text-white/5 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium italic mb-4 text-indigo-100 relative z-10 leading-relaxed">
              "{quote.text}"
            </p>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest relative z-10">
              — {quote.author}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
