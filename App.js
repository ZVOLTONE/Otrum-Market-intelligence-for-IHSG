/**
 * App — Otrum Market Intelligence (entry point)
 *
 * Wires together:
 *  - NativeWind global CSS
 *  - SafeAreaProvider (required by react-native-safe-area-context)
 *  - useAuth hook (JSON mock store; swap with API later)
 *  - LoginScreen (the first screen in the auth flow)
 *
 * Once the full navigation stack is added (Expo Router / React Navigation),
 * this file will be replaced by the navigator root. For now it renders the
 * login screen directly, switching to a placeholder home when authenticated.
 */

import './global.css';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuth } from './src/auth/useAuth';
import LoginScreen from './src/screens/LoginScreen';

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder home screen shown after successful login
// ─────────────────────────────────────────────────────────────────────────────

function HomeScreen({ user, onLogout }) {
  return (
    <View className="flex-1 items-center justify-center bg-surface gap-4 px-8">
      <StatusBar style="light" />

      <View className="items-center gap-2">
        <View className="w-14 h-14 rounded-full bg-primary-container items-center justify-center">
          <Text className="text-headline-md text-on-primary font-bold">
            {user.name?.charAt(0).toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text className="text-headline-lg text-on-surface font-semibold text-center">
          Halo, {user.name}!
        </Text>
        <Text className="text-body-default text-on-surface-variant text-center">
          Selamat datang di Otrum Market Intelligence.{'\n'}
          Dashboard akan segera hadir.
        </Text>
      </View>

      <View
        onTouchEnd={onLogout}
        className="mt-6 px-6 py-3 rounded-xl bg-surface-container-high"
      >
        <Text className="text-headline-sm text-on-surface-variant">Keluar</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const authHook = useAuth();
  const { auth, logout } = authHook;

  return (
    <SafeAreaProvider>
      {auth.isAuthenticated ? (
        <HomeScreen user={auth.user} onLogout={logout} />
      ) : (
        <LoginScreen authHook={authHook} />
      )}
    </SafeAreaProvider>
  );
}
