import { createContext, useContext, useState } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kwau_admin')) || null; }
    catch { return null; }
  });

  const login = async (username, password) => {
    const res = await authApi.login({ username, password });
    const { token, admin: dataAdmin } = res.data.data;
    localStorage.setItem('kwau_token', token);
    localStorage.setItem('kwau_admin', JSON.stringify(dataAdmin));
    setAdmin(dataAdmin);
    return dataAdmin;
  };

  const logout = () => {
    localStorage.removeItem('kwau_token');
    localStorage.removeItem('kwau_admin');
    setAdmin(null);
  };

  return <AuthContext.Provider value={{ admin, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
