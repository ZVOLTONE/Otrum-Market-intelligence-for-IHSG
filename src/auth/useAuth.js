import { useState, useCallback } from 'react';
import SEED_USERS from '../data/users.json';

const mockDb = [...SEED_USERS];

async function authenticateUser(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const normalizedEmail = email.trim().toLowerCase();

  const match = mockDb.find(
    (u) =>
      u.email.toLowerCase() === normalizedEmail &&
      u.password === password
  );

  if (!match) {
    throw new Error('Email atau kata sandi tidak valid.');
  }

  const { password: _pw, ...safeUser } = match;
  return safeUser;
}

async function registerUser(name, email, password) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const normalizedEmail = email.trim().toLowerCase();

  const exists = mockDb.some(
    (u) => u.email.toLowerCase() === normalizedEmail
  );

  if (exists) {
    throw new Error('Email sudah terdaftar. Silakan gunakan email lain.');
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'investor',
    createdAt: new Date().toISOString(),
  };

  mockDb.push(newUser);

  const { password: _pw, ...safeUser } = newUser;
  return safeUser;
}

export function useAuth() {
  const [auth, setAuth] = useState({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  });

  const login = useCallback(async (email, password) => {
    setAuth((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await authenticateUser(email, password);
      setAuth({ user, isLoading: false, error: null, isAuthenticated: true });
      return { success: true, user };
    } catch (err) {
      const message = err.message ?? 'Terjadi kesalahan. Coba lagi.';
      setAuth((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
        isAuthenticated: false,
      }));
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setAuth((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await registerUser(name, email, password);
      setAuth({ user, isLoading: false, error: null, isAuthenticated: true });
      return { success: true, user };
    } catch (err) {
      const message = err.message ?? 'Terjadi kesalahan. Coba lagi.';
      setAuth((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
        isAuthenticated: false,
      }));
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    setAuth({ user: null, isLoading: false, error: null, isAuthenticated: false });
  }, []);

  const clearError = useCallback(() => {
    setAuth((prev) => ({ ...prev, error: null }));
  }, []);

  return { auth, login, register, logout, clearError };
}
