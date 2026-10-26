/**
 * useAuth — Authentication hook (JSON mock store)
 *
 * Provides login / logout / register state management backed by a local
 * JSON file. The in-memory `mockDb` array is pre-seeded from the bundled
 * `users.json` and grows as new accounts are registered during the session.
 *
 * Replace `authenticateUser` / `registerUser` internals with real API calls
 * when the backend (SQL) is ready — the hook interface stays the same.
 *
 * @module src/auth/useAuth
 */

import { useState, useCallback } from 'react';
import SEED_USERS from '../data/users.json';

// ─────────────────────────────────────────────────────────────────────────────
// In-memory database (seeded from JSON; grows at runtime)
// ─────────────────────────────────────────────────────────────────────────────

/** Mutable runtime store — replace with async storage / SQL in production. */
const mockDb = [...SEED_USERS];

// ─────────────────────────────────────────────────────────────────────────────
// Types (JSDoc)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} AuthState
 * @property {Object|null} user             - The authenticated user object, or null.
 * @property {boolean}     isLoading        - True while an async auth operation is in progress.
 * @property {string|null} error            - Human-readable error message, or null.
 * @property {boolean}     isAuthenticated  - Convenience flag derived from `user`.
 */

/**
 * @typedef {Object} UseAuthReturn
 * @property {AuthState}  auth        - Current authentication state.
 * @property {Function}   login       - Async login(email, password).
 * @property {Function}   register    - Async register(name, email, password, role).
 * @property {Function}   logout      - Resets auth state to unauthenticated.
 * @property {Function}   clearError  - Clears the current error message.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Mock authentication logic
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Simulates an async credential check against the in-memory store.
 * Adds an 800 ms artificial delay to mirror a real network call.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Resolves with the user record (minus password).
 * @throws {Error} On invalid credentials.
 */
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

  // Return a sanitized user object — never expose the password downstream
  const { password: _pw, ...safeUser } = match;
  return safeUser;
}

/**
 * Simulates an async account creation against the in-memory store.
 * Adds a 1 000 ms artificial delay to mirror a real network call.
 *
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {string} role   - 'investor' | 'analyst'
 * @returns {Promise<Object>} Resolves with the new user record (minus password).
 * @throws {Error} If the email is already registered.
 */
async function registerUser(name, email, password, role) {
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
    password,           // plaintext — mock only; hash in production
    role,
    createdAt: new Date().toISOString(),
  };

  // Persist to the in-memory store for this session
  mockDb.push(newUser);

  const { password: _pw, ...safeUser } = newUser;
  return safeUser;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useAuth hook.
 *
 * @returns {UseAuthReturn}
 *
 * @example
 * const { auth, login, register, logout } = useAuth();
 * await login('demo@otrum.id', 'Demo1234!');
 * await register('Andi', 'andi@email.com', 'Pass1234!', 'investor');
 */
export function useAuth() {
  const [auth, setAuth] = useState({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  });

  /** Attempt to sign in. Updates state with the result. */
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

  /**
   * Create a new account, then auto-login on success.
   * Returns { success, user } or { success: false, error }.
   */
  const register = useCallback(async (name, email, password, role) => {
    setAuth((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await registerUser(name, email, password, role);
      // Auto-login after successful registration
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

  /** Sign out the current user and reset state. */
  const logout = useCallback(() => {
    setAuth({ user: null, isLoading: false, error: null, isAuthenticated: false });
  }, []);

  /** Dismiss the current error banner. */
  const clearError = useCallback(() => {
    setAuth((prev) => ({ ...prev, error: null }));
  }, []);

  return { auth, login, register, logout, clearError };
}
