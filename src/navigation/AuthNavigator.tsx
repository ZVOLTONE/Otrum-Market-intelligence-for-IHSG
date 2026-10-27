import React, { useState } from 'react';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import type { UseAuthReturn } from '../auth/useAuth';

/** Screens available in the unauthenticated (auth) flow. */
export type AuthScreen = 'login' | 'register';

interface AuthNavigatorProps {
  authHook: UseAuthReturn;
}

/**
 * Unauthenticated flow. Switches between the login and register screens using
 * local state; both screens share the same {@link UseAuthReturn} instance.
 */
export default function AuthNavigator({ authHook }: AuthNavigatorProps) {
  const [screen, setScreen] = useState<AuthScreen>('login');

  if (screen === 'register') {
    return <RegisterScreen authHook={authHook} onNavigate={setScreen} />;
  }
  return <LoginScreen authHook={authHook} onNavigate={setScreen} />;
}
