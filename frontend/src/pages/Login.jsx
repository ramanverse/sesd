import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setDemoLoading(true);
    try {
      await login('demo@taskflow.com', 'password123');
    } catch (err) {
      setError('Demo login failed. Please try again.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-bg">
      {/* Left side branding */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="z-10 text-center">
          <h1 className="text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">TaskFlow</h1>
          <p className="text-2xl font-light tracking-widest text-indigo-100 uppercase">The Quiet Authority</p>
        </div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-card shadow-2xl relative z-10">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Enter your details to access your dashboard</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-200 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="flex text-sm text-primary hover:text-primary-dark hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || demoLoading}
              className={`w-full btn-primary text-lg shadow-lg hover:shadow-xl py-3 transform transition-all active:scale-95 ${loading || demoLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? <LoadingSpinner color="white" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <button 
              onClick={handleDemoLogin}
              disabled={loading || demoLoading}
              className="w-full bg-white border-2 border-primary text-primary hover:bg-indigo-50 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {demoLoading ? <LoadingSpinner size="sm" /> : <span>Use Demo Account</span>}
            </button>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <hr className="w-full border-gray-200" />
            <span className="p-2 text-gray-400 text-sm">or continue with</span>
            <hr className="w-full border-gray-200" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
              Google
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition">
              <svg className="h-5 w-5 mr-2 text-black" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.873 13.921c-0.247-0.038-0.341-0.081-0.455-0.155s-0.204-0.171-0.253-0.283c-0.153-0.351-0.153-1.042 0-1.393c0.049-0.112 0.139-0.209 0.253-0.283s0.208-0.117 0.455-0.155c0.237-0.036 0.286-0.036 0.522 0s0.285 0.036 0.522 0.073l0.253 0.04c0.126 0.021 0.219 0.052 0.311 0.101s0.174 0.113 0.237 0.19c0.124 0.151 0.186 0.329 0.186 0.534s-0.062 0.383-0.186 0.534c-0.063 0.077-0.145 0.141-0.237 0.19s-0.185 0.08-0.311 0.101l-0.253 0.04c-0.237 0.037-0.286 0.037-0.522 0.073z" />
              </svg>
              Apple
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} className="text-primary hover:text-primary-dark font-medium underline">
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
