import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load persisted session if available
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cc_user');
      const rawTok = localStorage.getItem('cc_token');
      if (raw) setUser(JSON.parse(raw));
      if (rawTok) setToken(rawTok);
    } catch {}
  }, []);

  const login = (payload, jwt) => {
    setUser(payload);
    setToken(jwt || null);
    try { localStorage.setItem('cc_user', JSON.stringify(payload)); } catch {}
    try { if (jwt) localStorage.setItem('cc_token', jwt); } catch {}
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try { localStorage.removeItem('cc_user'); } catch {}
    try { localStorage.removeItem('cc_token'); } catch {}
  };

  const apiFetch = async (path, options = {}) => {
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(path.startsWith('/api') ? path : `/api${path}`, { ...options, headers });
    const text = await res.text();
    const hasBody = text && text.trim().length > 0;
    const data = hasBody ? JSON.parse(text) : {};
    if (!res.ok) {
      const message = data?.error || res.statusText || 'Request failed';
      throw new Error(message);
    }
    return data;
  };

  const value = useMemo(() => ({ user, token, login, logout, apiFetch }), [user, token]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
