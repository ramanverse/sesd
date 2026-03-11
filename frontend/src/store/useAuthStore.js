import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })(),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  /**
   * Login — stores both access token and refresh token.
   */
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data.data || res.data;

    const accessToken = data.accessToken || data.token;
    const refreshToken = data.refreshToken;
    const user = data.user;

    localStorage.setItem('token', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    if (user) localStorage.setItem('user', JSON.stringify(user));

    set({ user, token: accessToken, isAuthenticated: true });
    return data;
  },

  /**
   * Register — same as login but hits /register endpoint.
   */
  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const data = res.data.data || res.data;

    const accessToken = data.accessToken || data.token;
    const refreshToken = data.refreshToken;
    const user = data.user;

    localStorage.setItem('token', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    if (user) localStorage.setItem('user', JSON.stringify(user));

    set({ user, token: accessToken, isAuthenticated: true });
    return data;
  },

  /**
   * Logout — revokes refresh token on server and clears local storage.
   */
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (e) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  /**
   * Check auth status — validates token with server.
   */
  checkAuth: async () => {
    try {
      if (!localStorage.getItem('token')) return;
      await api.get('/auth/me');
      set({ isAuthenticated: true });
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
