import React from 'react';

import { useAuth } from '../auth/useAuth';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

/**
 * Top-level navigator. Owns the single auth hook instance and decides which
 * area to show: the authenticated app (bottom tabs + dashboard) when a user is
 * signed in, otherwise the auth flow (login / register).
 */
export default function RootNavigator() {
  const authHook = useAuth();
  const { auth, logout } = authHook;

  if (auth.isAuthenticated && auth.user) {
    return <AppNavigator onLogout={logout} />;
  }
  return <AuthNavigator authHook={authHook} />;
}
