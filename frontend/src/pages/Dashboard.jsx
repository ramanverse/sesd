import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';
import { Calendar, Quote, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const MOTIVATIONAL_QUOTES = [
  { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Done is better than perfect.', author: 'Sheryl Sandberg' },
  { text: 'Work smarter, not harder.', author: 'Allen F. Morgenstern' },
  { text: "It's not about having time. It's about making time.", author: 'Unknown' },
];

const Dashboard = () => {
  const { user } = useAuthStore();
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, done: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [quote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Use the dedicated dashboard endpoint for stats
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
        });

        const allTasks = tasksRes.data.data || tasksRes.data;
        const active = Array.isArray(allTasks)
          ? allTasks.filter(t => t.status === 'In Progress' || t.status === 'IN_PROGRESS')
          : [];
        setInProgressTasks(active.slice(0, 5));
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your tasks today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-white hover:border-indigo-200 transition-all shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total</p>
            <h3 className="text-3xl font-bold text-gray-900">{loading ? '—' : stats.total}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-primary">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="card bg-white hover:border-orange-200 transition-all shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Pending</p>
            <h3 className="text-3xl font-bold text-gray-900">{loading ? '—' : stats.pending}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="card bg-white hover:border-blue-200 transition-all shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">In Progress</p>
            <h3 className="text-3xl font-bold text-gray-900">{loading ? '—' : stats.inProgress}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="card bg-white hover:border-green-200 transition-all shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
            <h3 className="text-3xl font-bold text-gray-900">{loading ? '—' : stats.done}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Overdue Banner */}
      {!loading && stats.overdue > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            You have <span className="font-bold">{stats.overdue}</span> overdue{' '}
            {stats.overdue === 1 ? 'task' : 'tasks'} — don't let them slip!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
              In Progress
            </h2>
            <div className="space-y-3">
              {loading ? (
                <p className="text-gray-400 text-sm py-4">Loading tasks...</p>
              ) : inProgressTasks.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">No tasks currently in progress. Go crush some! 💪</p>
              ) : (
                inProgressTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 text-primary flex items-center justify-center font-bold text-sm">
                      {task.title?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                      <p className="text-sm text-gray-500">{task.category?.name || 'No Category'}</p>
                    </div>
                    <div className="text-right flex flex-col items-end ml-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md mb-1 ${
                        (task.priority === 'HIGH' || task.priority === 'High')
                          ? 'bg-red-100 text-red-700'
                          : (task.priority === 'LOW' || task.priority === 'Low')
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {task.dueDate ? format(new Date(task.dueDate), 'MMM dd') : 'No Date'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Side Widgets */}
        <div className="space-y-6">
          {/* Quote Card */}
          <div className="card bg-gradient-to-br from-primary to-indigo-900 text-white relative overflow-hidden h-44 flex flex-col justify-center">
            <Quote className="absolute top-4 right-4 w-12 h-12 text-white/10" />
            <p className="font-medium flex-1 overflow-hidden italic text-indigo-50 line-clamp-3">
              "{quote.text}"
            </p>
            <p className="mt-2 text-sm text-indigo-200 tracking-wider">— {quote.author}</p>
          </div>

          {/* Progress Ring */}
          <div className="card text-center">
            <h2 className="text-base font-bold text-gray-900 mb-4">Completion Rate</h2>
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none" stroke="#E5E7EB" strokeWidth="3"
                />
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none" stroke="#4338CA" strokeWidth="3"
                  strokeDasharray={`${stats.total > 0 ? (stats.done / stats.total) * 100 : 0} 100`}
                  strokeLinecap="round"
                  strokeDashoffset="0"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500">{stats.done} of {stats.total} tasks done</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
