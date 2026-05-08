import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  loading: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'createdAt'>) => boolean;
  getUsers: () => User[];
  deleteUser: (id: string) => void;
  updatePassword: (userId: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USER: User = {
  id: 'admin-1',
  name: 'المدير',
  email: 'admin@eximq.com',
  password: 'admin123',
  role: 'admin',
  college: 'إدارة النظام',
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem('eximq_user');
    if (saved) {
  setCurrentUser(JSON.parse(saved));
}

setLoading(false);
    const users = JSON.parse(localStorage.getItem('eximq_users') || '[]');
    if (!users.find((u: User) => u.id === 'admin-1')) {
      localStorage.setItem('eximq_users', JSON.stringify([ADMIN_USER]));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('eximq_users') || '[]');
    const user = users.find((u: User) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('eximq_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eximq_user');
  };

  const register = (userData: Omit<User, 'id' | 'createdAt'>): boolean => {
    const users = JSON.parse(localStorage.getItem('eximq_users') || '[]');
    if (users.find((u: User) => u.email === userData.email)) return false;
    const newUser: User = { ...userData, id: `user-${Date.now()}`, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('eximq_users', JSON.stringify(users));
    return true;
  };

  const getUsers = (): User[] => JSON.parse(localStorage.getItem('eximq_users') || '[]');

  const deleteUser = (id: string) => {
    const users = JSON.parse(localStorage.getItem('eximq_users') || '[]').filter((u: User) => u.id !== id);
    localStorage.setItem('eximq_users', JSON.stringify(users));
    const bookings = JSON.parse(localStorage.getItem('eximq_bookings') || '[]').filter((b: any) => b.userId !== id);
    localStorage.setItem('eximq_bookings', JSON.stringify(bookings));
  };

  const updatePassword = (userId: string, newPassword: string): boolean => {
    const users = JSON.parse(localStorage.getItem('eximq_users') || '[]');
    const idx = users.findIndex((u: User) => u.id === userId);
    if (idx === -1) return false;
    users[idx].password = newPassword;
    localStorage.setItem('eximq_users', JSON.stringify(users));
    // Update current user if it's the same user
    if (currentUser && currentUser.id === userId) {
      const updated = { ...currentUser, password: newPassword };
      setCurrentUser(updated);
      localStorage.setItem('eximq_user', JSON.stringify(updated));
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout, register, getUsers, deleteUser, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
