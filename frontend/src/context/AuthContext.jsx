import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

const initialState = {
  user: (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })(),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'AUTH_VERIFIED':
      return { ...state, isAuthenticated: true, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data.data || res.data;

    const token = data.accessToken || data.token;
    const user = data.user;

    localStorage.setItem('token', token);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    if (user) localStorage.setItem('user', JSON.stringify(user));

    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    return data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const data = res.data.data || res.data;

    const token = data.accessToken || data.token;
    const user = data.user;

    localStorage.setItem('token', token);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    if (user) localStorage.setItem('user', JSON.stringify(user));

    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    return data;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (e) {
      // Ignore
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const checkAuth = async () => {
    try {
      if (!localStorage.getItem('token')) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      await api.get('/auth/me');
      dispatch({ type: 'AUTH_VERIFIED' });
    } catch {
      logout();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
