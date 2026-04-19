import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';
import { Calendar, Quote, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, done: 0 });
  const [quote, setQuote] = useState({ text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/tasks');
        const allTasks = res.data;
        setTasks(allTasks.filter(t => t.status === 'In Progress'));
        
        let p = 0, i = 0, d = 0;
        allTasks.forEach(t => {
           if(t.status === 'Pending') p++;
           else if(t.status === 'In Progress') i++;
           else if(t.status === 'Done') d++;
        });
        setStats({ pending: p, inProgress: i, done: d });
        
        // Fetch quote optionally
        fetch('https://api.quotable.io/random')
          .then(r => r.json())
          .then(data => setQuote({ text: data.content, author: data.author }))
          .catch(() => {});
      } catch (err) {
        console.error('Error fetching dashboard', err);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Good morning, {user?.name?.split(' ')[0]}</h1>
        <p className="text-gray-500 mt-1">Here is what's happening with your projects today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-white hover:border-indigo-200 transition-all shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Pending Tasks</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.pending}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        
        <div className="card bg-white hover:border-indigo-200 transition-all shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">In Progress</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.inProgress}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="card bg-white hover:border-indigo-200 transition-all shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.done}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main tasks col */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Active Curations</h2>
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">No tasks currently in progress.</p>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200 cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 text-primary flex items-center justify-center font-bold">
                       {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-500">{task.category?.name || 'No Category'}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                       <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded-md mb-1">
                         {task.priority}
                       </span>
                       <span className="text-xs text-gray-500 flex items-center">
                         <Calendar className="w-3 h-3 mr-1"/>
                         {task.dueDate ? format(new Date(task.dueDate), 'MMM dd') : 'No Date'}
                       </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Side widgets */}
        <div className="space-y-6">
          <div className="card bg-gradient-to-br from-primary to-indigo-900 text-white relative overflow-hidden h-40 flex flex-col justify-center">
            <Quote className="absolute top-4 right-4 w-12 h-12 text-white/10" />
            <p className="font-medium flex-1 overflow-hidden italic text-indigo-50">"{quote.text}"</p>
            <p className="mt-2 text-sm text-indigo-200 tracking-wider">— {quote.author}</p>
          </div>

          <div className="card">
             <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Upcoming Syncs
             </h2>
             <div className="space-y-3">
               <div className="border-l-2 border-primary pl-3 py-1">
                 <p className="text-sm font-medium">Design Review</p>
                 <p className="text-xs text-gray-500">2:00 PM - 3:00 PM</p>
               </div>
               <div className="border-l-2 border-gray-300 pl-3 py-1 opacity-75">
                 <p className="text-sm font-medium">Engineering Standup</p>
                 <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
