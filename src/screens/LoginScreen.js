/**

 * @module src/screens/LoginScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterScreen from './RegisterScreen';

// import gambar dll

const LOGO = require('../../assets/Logo.png');

// Sub component
function SecureBadge() {
  return (
    <View className="flex-row items-center gap-1 px-3 py-1 rounded-full bg-surface-container-low">
      <View className="w-2.5 h-2.5 rounded-full border border-outline" />
      <Text className="text-label-mono-sm text-outline uppercase tracking-widest">
        Secure Login
      </Text>
    </View>
  );
}

/**
 * @param {{ active: 'login'|'register', onSelect: Function }} props
 */
function TabSwitcher({ active, onSelect }) {
  return (
    <View className="flex-row p-1 rounded-2xl bg-surface-container-lowest">
      <TouchableOpacity
        onPress={() => onSelect('login')}
        activeOpacity={0.8}
        className={`flex-1 py-2 rounded-xl items-center ${
          active === 'login' ? 'bg-surface-container shadow-sm' : ''
        }`}
      >
        <Text
          className={`text-headline-sm ${
            active === 'login' ? 'text-on-surface' : 'text-on-surface-variant'
          }`}
        >
          Masuk
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelect('register')}
        activeOpacity={0.8}
        className={`flex-1 py-2 rounded-xl items-center ${
          active === 'register' ? 'bg-surface-container shadow-sm' : ''
        }`}
      >
        <Text
          className={`text-headline-sm ${
            active === 'register' ? 'text-on-surface' : 'text-on-surface-variant'
          }`}
        >
          Daftar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * @param {{ message: string, onDismiss: Function }} props
 */
function ErrorBanner({ message, onDismiss }) {
  return (
    <View className="flex-row items-start gap-2 px-4 py-3 rounded-xl bg-error-container">
      <View className="mt-0.5">
        {/* Error dot */}
        <View className="w-2 h-2 rounded-full bg-on-error-container" />
      </View>
      <Text className="flex-1 text-body-default text-on-error-container leading-5">
        {message}
      </Text>
      <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <Text className="text-headline-sm text-on-error-container">✕</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * @param {Object} props
 */
function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoComplete,
  rightSlot,
  hasError,
}) {
  return (
    <View className="gap-1">
      <Text className="text-headline-sm text-on-surface">{label}</Text>
      <View
        className={`flex-row items-center rounded-xl bg-surface-container-lowest
          border ${hasError ? 'border-error' : 'border-transparent'}
        `}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#88929b"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'none'}
          autoComplete={autoComplete}
          autoCorrect={false}
          className="flex-1 h-12 px-4 text-body-default text-on-surface"
          style={{ fontFamily: undefined }}
        />
        {rightSlot}
      </View>
    </View>
  );
}

//Tampilan utama
/**
 * @param {Object} props
 * @param {{ auth: Object, login: Function, clearError: Function }} props.authHook
 */
export default function LoginScreen({ authHook }) {
  const { auth, login, clearError } = authHook;

  const [activeTab, setActiveTab]         = useState('login');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [rememberMe, setRememberMe]       = useState(false);

  const [emailError, setEmailError]       = useState('');
  const [passwordError, setPasswordError] = useState('');


  const [scaleAnim] = useState(() => new Animated.Value(1));

  function animatePress() {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start();
  }

  function validateEmail(val) {
    if (!val.trim()) {
      setEmailError('Email wajib diisi.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      setEmailError('Format email tidak valid.');
      return false;
    }
    setEmailError('');
    return true;
  }

  function validatePassword(val) {
    if (!val) {
      setPasswordError('Kata sandi wajib diisi.');
      return false;
    }
    if (val.length < 6) {
      setPasswordError('Kata sandi minimal 6 karakter.');
      return false;
    }
    setPasswordError('');
    return true;
  }

  async function handleSubmit() {
    const emailOk    = validateEmail(email);
    const passwordOk = validatePassword(password);
    if (!emailOk || !passwordOk) return;

    animatePress();
    await login(email, password);
  }

  function handleTabSelect(tab) {
    setActiveTab(tab);
    clearError();
    setEmailError('');
    setPasswordError('');
  }

// Render utama
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <StatusBar style="light" />

      <View className="flex-row items-center justify-between px-margin h-14">
        <View className="flex-row items-center gap-2">
          <Image
            source={LOGO}
            className="w-7 h-7 rounded-full"
            resizeMode="contain"
          />
          <Text className="text-headline-sm text-on-surface tracking-tight font-semibold">
            OTRUM
          </Text>
        </View>

        <SecureBadge />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow justify-center px-margin pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center gap-2 pt-4 mb-6">
            <View className="relative w-16 h-16 items-center justify-center mb-1">
              <View
                className="absolute w-12 h-12 rounded-full bg-primary-container opacity-30"
                style={{ transform: [{ scale: 1.4 }] }}
              />
              <Image
                source={LOGO}
                className="w-12 h-12 rounded-full"
                resizeMode="contain"
              />
            </View>

            <Text className="text-headline-lg text-on-surface tracking-tight font-semibold text-center">
              {activeTab === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
            </Text>
            <Text className="text-body-default text-on-surface-variant text-center max-w-xs">
              {activeTab === 'login'
                ? 'Masuk untuk mengakses analisis fundamental IDX'
                : 'Bergabunglah dan mulai analisis fundamental Anda'}
            </Text>
          </View>

          <TabSwitcher active={activeTab} onSelect={handleTabSelect} />

          <View className="h-3" />

          {activeTab === 'register' && (
            <RegisterScreen
              authHook={authHook}
              onSwitch={() => handleTabSelect('login')}
            />
          )}

          {activeTab === 'login' && (
            <>
              <View className="bg-surface-container rounded-2xl p-space-lg gap-4 shadow-md">
                {/* Email */}
                <FormInput
                  label="Email Anda"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (emailError) validateEmail(val);
                    if (auth.error) clearError();
                  }}
                  placeholder="nama@email.com"
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCapitalize="none"
                  hasError={!!emailError}
                  rightSlot={null}
                />
                {!!emailError && (
                  <Text className="text-body-compact text-error -mt-2">{emailError}</Text>
                )}

                {/* Password */}
                <FormInput
                  label="Kata Sandi"
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (passwordError) validatePassword(val);
                    if (auth.error) clearError();
                  }}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  autoComplete="current-password"
                  hasError={!!passwordError}
                  rightSlot={
                    <TouchableOpacity
                      onPress={() => setShowPassword((v) => !v)}
                      className="px-3 py-2"
                      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                      accessibilityLabel={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      <Text className="text-outline text-body-default">
                        {showPassword ? '🙈' : '👁'}
                      </Text>
                    </TouchableOpacity>
                  }
                />
                {!!passwordError && (
                  <Text className="text-body-compact text-error -mt-2">{passwordError}</Text>
                )}

                {/* Remember me + forgot password */}
                <View className="flex-row items-center justify-between">
                  <TouchableOpacity
                    onPress={() => setRememberMe((v) => !v)}
                    className="flex-row items-center gap-2"
                    activeOpacity={0.7}
                  >
                    <View
                      className={`w-4 h-4 rounded border items-center justify-center ${
                        rememberMe
                          ? 'bg-primary-container border-primary-container'
                          : 'bg-surface-container-lowest border-outline'
                      }`}
                    >
                      {rememberMe && (
                        <Text className="text-on-primary text-[10px] leading-none">✓</Text>
                      )}
                    </View>
                    <Text className="text-body-compact text-on-surface">Ingat Saya</Text>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.7}>
                    <Text className="text-body-compact text-primary">Lupa Sandi?</Text>
                  </TouchableOpacity>
                </View>

                {/* Auth error banner */}
                {!!auth.error && (
                  <ErrorBanner message={auth.error} onDismiss={clearError} />
                )}

                {/* Submit button */}
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={auth.isLoading}
                    activeOpacity={0.85}
                    className={`h-12 rounded-xl flex-row items-center justify-center gap-2 shadow-sm
                      ${auth.isLoading ? 'bg-primary-container/60' : 'bg-primary-container'}
                    `}
                  >
                    {auth.isLoading ? (
                      <ActivityIndicator color="#00344d" size="small" />
                    ) : (
                      <>
                        <Text className="text-headline-sm text-on-primary font-semibold">
                          Masuk
                        </Text>
                        <Text className="text-on-primary text-body-default">→</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>

              {/* Register prompt */}
              <View className="flex-row items-center justify-center gap-1 mt-4">
                <Text className="text-body-compact text-on-surface-variant">
                  Belum punya akun?
                </Text>
                <TouchableOpacity onPress={() => handleTabSelect('register')} activeOpacity={0.7}>
                  <Text className="text-body-compact text-primary underline underline-offset-2">
                    Daftar sekarang
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Footer */}
      <View className="flex-row items-center justify-center gap-2 px-margin py-3 bg-surface/90">
        <View className="w-3 h-3 rounded-full border border-outline items-center justify-center">
          <View className="w-1.5 h-1.5 rounded-full bg-outline" />
        </View>
        <Text className="text-label-mono-sm text-outline uppercase tracking-widest">
          Terdaftar &amp; Diawasi OJK • 256-Bit SSL
        </Text>
      </View>
    </SafeAreaView>
  );
}
