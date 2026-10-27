import { useState, useCallback } from 'react';
import SEED_USERS from '../data/users.json';

/** A stored user record including the (mock) password. Internal to the auth layer. */
export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

/** A user object safe to expose to the UI (password stripped out). */
export type SafeUser = Omit<StoredUser, 'password'>;

/** Reactive authentication state exposed by {@link useAuth}. */
export interface AuthState {
  user: SafeUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

/** Result returned by the {@link useAuth} login/register actions. */
export type AuthResult =
  | { success: true; user: SafeUser }
  | { success: false; error: string };

/** Public API returned by the {@link useAuth} hook. */
export interface UseAuthReturn {
  auth: AuthState;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  clearError: () => void;
}

const mockDb: StoredUser[] = [...(SEED_USERS as StoredUser[])];

async function authenticateUser(email: string, password: string): Promise<SafeUser> {
  await new Promise<void>((resolve) => setTimeout(resolve, 800));

  const normalizedEmail = email.trim().toLowerCase();

  const match = mockDb.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!match) {
    throw new Error('Email atau kata sandi tidak valid.');
  }

  const { password: _pw, ...safeUser } = match;
  return safeUser;
}

async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<SafeUser> {
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));

  const normalizedEmail = email.trim().toLowerCase();

  const exists = mockDb.some((u) => u.email.toLowerCase() === normalizedEmail);

  if (exists) {
    throw new Error('Email sudah terdaftar. Silakan gunakan email lain.');
  }

  const newUser: StoredUser = {
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

export function useAuth(): UseAuthReturn {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  });

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setAuth((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await authenticateUser(email, password);
      setAuth({ user, isLoading: false, error: null, isAuthenticated: true });
      return { success: true, user };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.';
      setAuth((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
        isAuthenticated: false,
      }));
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      setAuth((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const user = await registerUser(name, email, password);
        setAuth({ user, isLoading: false, error: null, isAuthenticated: true });
        return { success: true, user };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.';
        setAuth((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
          isAuthenticated: false,
        }));
        return { success: false, error: message };
      }
    },
    []
  );

  const logout = useCallback(() => {
    setAuth({ user: null, isLoading: false, error: null, isAuthenticated: false });
  }, []);

  const clearError = useCallback(() => {
    setAuth((prev) => ({ ...prev, error: null }));
  }, []);

  return { auth, login, register, logout, clearError };
}
