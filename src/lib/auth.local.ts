import { User } from "@/types";

const STORAGE_KEY = 'chaos_user';

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = '/';
};

export const loginWithEmail = (email: string, password: string): User | null => {
  // Simulated email login - in production, this would call your backend
  if (email && password) {
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      provider: 'email',
      addresses: [],
      createdAt: new Date()
    };
    saveUser(user);
    return user;
  }
  return null;
};

export const loginWithGoogle = (): User | null => {
  // Simulated Google login - in production, use Google OAuth
  const user: User = {
    id: `user-google-${Date.now()}`,
    email: 'user@gmail.com',
    name: 'Google User',
    provider: 'google',
    addresses: [],
    createdAt: new Date()
  };
  saveUser(user);
  return user;
};

export const signupWithEmail = (email: string, password: string, name: string): User | null => {
  // Simulated signup - in production, this would call your backend
  if (email && password && name) {
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      provider: 'email',
      addresses: [],
      createdAt: new Date()
    };
    saveUser(user);
    return user;
  }
  return null;
};
