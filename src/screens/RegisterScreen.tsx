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
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { SafeUser, UseAuthReturn } from '../auth/useAuth';

const LOGO = require('../../assets/Logo.png');

/** Screens in the auth flow that the parent navigator can switch to. */
type AuthScreen = 'login' | 'register';

/** Qualitative password-strength buckets. */
type PasswordStrength = 'weak' | 'fair' | 'strong';

/** Keys of the register form that carry validation messages. */
type RegisterField = 'name' | 'email' | 'password' | 'confirmPassword' | 'agreeTerms';

/** Map of each register field to its current error message ('' means valid). */
type RegisterErrors = Record<RegisterField, string>;

interface StrengthMeta {
  label: string;
  color: string;
  width: string;
}

const STRENGTH: Record<PasswordStrength, StrengthMeta> = {
  weak: { label: 'Lemah', color: 'bg-error', width: 'w-1/3' },
  fair: { label: 'Cukup', color: 'bg-tertiary-container', width: 'w-2/3' },
  strong: { label: 'Kuat', color: 'bg-tertiary', width: 'w-full' },
};

function getPasswordStrength(password: string): PasswordStrength | null {
  if (!password) return null;
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const longEnough = password.length >= 8;
  const score = [hasUpper, hasDigit, hasSymbol, longEnough].filter(Boolean).length;
  if (score <= 1) return 'weak';
  if (score <= 3) return 'fair';
  return 'strong';
}

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

interface FormInputProps {
  label: string;
  hint?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  rightSlot?: React.ReactNode;
  hasError?: boolean;
}

interface PasswordStrengthBarProps {
  strength: PasswordStrength | null;
}

interface TermsCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  hasError?: boolean;
}

interface SuccessStateProps {
  user: SafeUser | null;
}

interface RegisterScreenProps {
  authHook: UseAuthReturn;
  onNavigate: (screen: AuthScreen) => void;
}

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

function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <View className="flex-row items-start gap-2 px-4 py-3 rounded-xl bg-error-container">
      <View className="mt-1 w-2 h-2 rounded-full bg-on-error-container" />
      <Text className="flex-1 text-body-default text-on-error-container leading-5">
        {message}
      </Text>
      <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <Text className="text-headline-sm text-on-error-container">✕</Text>
      </TouchableOpacity>
    </View>
  );
}

function FormInput({
  label,
  hint,
  value,
  onChangeText,
  onBlur,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoComplete,
  rightSlot,
  hasError,
}: FormInputProps) {
  return (
    <View className="gap-1">
      <Text className="text-headline-sm text-on-surface">{label}</Text>
      <View
        className={`flex-row items-center rounded-xl bg-surface-container-lowest
          border ${hasError ? 'border-error' : 'border-transparent'}`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
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
      {!!hint && !hasError && (
        <Text className="text-body-compact text-on-surface-variant">{hint}</Text>
      )}
    </View>
  );
}

function PasswordStrengthBar({ strength }: PasswordStrengthBarProps) {
  if (!strength) return null;
  const meta = STRENGTH[strength];
  return (
    <View className="gap-1">
      <View className="h-1 w-full rounded-full bg-surface-container-highest overflow-hidden">
        <View className={`h-full rounded-full ${meta.color} ${meta.width}`} />
      </View>
      <Text
        className={`text-body-compact ${
          strength === 'weak' ? 'text-error' : 'text-tertiary'
        }`}
      >
        Kekuatan kata sandi: {meta.label}
      </Text>
    </View>
  );
}

function TermsCheckbox({ checked, onToggle, hasError }: TermsCheckboxProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      className="flex-row items-start gap-2"
    >
      <View
        className={`mt-0.5 w-4 h-4 rounded border items-center justify-center flex-shrink-0 ${
          checked
            ? 'bg-primary-container border-primary-container'
            : hasError
            ? 'bg-surface-container-lowest border-error'
            : 'bg-surface-container-lowest border-outline'
        }`}
      >
        {checked && (
          <Text className="text-on-primary text-[10px] leading-none">✓</Text>
        )}
      </View>
      <View className="flex-1">
        <Text className="text-body-compact text-on-surface-variant leading-5">
          Saya menyetujui{' '}
          <Text className="text-primary">Syarat & Ketentuan</Text>
          {' '}serta{' '}
          <Text className="text-primary">Kebijakan Privasi</Text>
          {' '}Otrum.
        </Text>
        {hasError && (
          <Text className="text-body-compact text-error mt-0.5">
            Anda harus menyetujui syarat & ketentuan untuk melanjutkan.
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function SuccessState({ user }: SuccessStateProps) {
  return (
    <View className="items-center gap-4 py-4">
      <View className="w-16 h-16 rounded-full bg-tertiary-container items-center justify-center">
        <Text className="text-[28px]">✓</Text>
      </View>

      <View className="items-center gap-1">
        <Text className="text-headline-md text-on-surface font-semibold text-center">
          Akun Berhasil Dibuat!
        </Text>
        <Text className="text-body-default text-on-surface-variant text-center max-w-xs">
          Selamat datang di Otrum, {user?.name ?? 'Pengguna'}. Anda akan diarahkan secara otomatis.
        </Text>
      </View>
    </View>
  );
}

export default function RegisterScreen({ authHook, onNavigate }: RegisterScreenProps) {
  const { auth, register, clearError } = authHook;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const [errors, setErrors] = useState<RegisterErrors>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: '',
  });

  const [scaleAnim] = useState(() => new Animated.Value(1));

  function animatePress() {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  }

  function validateName(val: string = name): string {
    if (!val.trim()) return 'Nama lengkap wajib diisi.';
    if (val.trim().length < 2) return 'Nama terlalu pendek.';
    return '';
  }

  function validateEmail(val: string = email): string {
    if (!val.trim()) return 'Email wajib diisi.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Format email tidak valid.';
    return '';
  }

  function validatePassword(val: string = password): string {
    if (!val) return 'Kata sandi wajib diisi.';
    if (val.length < 8) return 'Kata sandi minimal 8 karakter.';
    return '';
  }

  function validateConfirmPassword(val: string = confirmPassword, pw: string = password): string {
    if (!val) return 'Konfirmasi kata sandi wajib diisi.';
    if (val !== pw) return 'Kata sandi tidak cocok.';
    return '';
  }

  function validateTerms(val: boolean = agreeTerms): string {
    return val ? '' : 'Anda harus menyetujui syarat & ketentuan.';
  }

  function validateAll(): boolean {
    const next: RegisterErrors = {
      name: validateName(),
      email: validateEmail(),
      password: validatePassword(),
      confirmPassword: validateConfirmPassword(),
      agreeTerms: validateTerms(),
    };
    setErrors(next);
    return Object.values(next).every((e) => !e);
  }

  function handleNameChange(val: string) {
    setName(val);
    if (errors.name) setErrors((e) => ({ ...e, name: validateName(val) }));
    if (auth.error) clearError();
  }

  function handleEmailChange(val: string) {
    setEmail(val);
    if (errors.email) setErrors((e) => ({ ...e, email: validateEmail(val) }));
    if (auth.error) clearError();
  }

  function handlePasswordChange(val: string) {
    setPassword(val);
    if (errors.password) setErrors((e) => ({ ...e, password: validatePassword(val) }));
    if (errors.confirmPassword) {
      setErrors((e) => ({ ...e, confirmPassword: validateConfirmPassword(confirmPassword, val) }));
    }
    if (auth.error) clearError();
  }

  function handleConfirmChange(val: string) {
    setConfirmPassword(val);
    if (errors.confirmPassword) {
      setErrors((e) => ({ ...e, confirmPassword: validateConfirmPassword(val, password) }));
    }
    if (auth.error) clearError();
  }

  async function handleSubmit() {
    if (!validateAll()) return;
    animatePress();
    const result = await register(name, email, password);
    if (result.success) {
      setRegisterSuccess(true);
    }
  }

  function goToLogin() {
    clearError();
    onNavigate('login');
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <StatusBar style="light" />

      <View className="flex-row items-center justify-between px-margin h-14">
        <TouchableOpacity
          onPress={goToLogin}
          activeOpacity={0.7}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          className="flex-row items-center gap-2"
        >
          <Text className="text-headline-sm text-on-surface">←</Text>
          <Image
            source={LOGO}
            className="w-7 h-7 rounded-full"
            resizeMode="contain"
          />
          <Text className="text-headline-sm text-on-surface tracking-tight font-semibold">
            OTRUM
          </Text>
        </TouchableOpacity>

        <SecureBadge />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-margin pb-10 pt-2"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center gap-2 pt-2 mb-6">
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
              Buat Akun Baru
            </Text>
            <Text className="text-body-default text-on-surface-variant text-center max-w-xs">
              Bergabunglah dan mulai analisis fundamental Anda
            </Text>
          </View>

          <View className="bg-surface-container rounded-2xl p-space-lg gap-5 shadow-md">
            {registerSuccess ? (
              <SuccessState user={auth.user} />
            ) : (
              <>
                <FormInput
                  label="Nama Lengkap"
                  value={name}
                  onChangeText={handleNameChange}
                  onBlur={() => setErrors((e) => ({ ...e, name: validateName() }))}
                  placeholder="Masukkan nama lengkap Anda"
                  autoCapitalize="words"
                  autoComplete="name"
                  hasError={!!errors.name}
                />
                {!!errors.name && (
                  <Text className="text-body-compact text-error -mt-3">{errors.name}</Text>
                )}

                <FormInput
                  label="Alamat Email"
                  value={email}
                  onChangeText={handleEmailChange}
                  onBlur={() => setErrors((e) => ({ ...e, email: validateEmail() }))}
                  placeholder="nama@email.com"
                  keyboardType="email-address"
                  autoComplete="email"
                  hasError={!!errors.email}
                />
                {!!errors.email && (
                  <Text className="text-body-compact text-error -mt-3">{errors.email}</Text>
                )}

                <View className="gap-2">
                  <FormInput
                    label="Kata Sandi"
                    value={password}
                    onChangeText={handlePasswordChange}
                    onBlur={() => setErrors((e) => ({ ...e, password: validatePassword() }))}
                    placeholder="Min. 8 karakter"
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                    hasError={!!errors.password}
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
                  {!!errors.password && (
                    <Text className="text-body-compact text-error">{errors.password}</Text>
                  )}
                  {!errors.password && (
                    <PasswordStrengthBar strength={getPasswordStrength(password)} />
                  )}
                </View>

                <FormInput
                  label="Konfirmasi Kata Sandi"
                  value={confirmPassword}
                  onChangeText={handleConfirmChange}
                  onBlur={() =>
                    setErrors((e) => ({
                      ...e,
                      confirmPassword: validateConfirmPassword(),
                    }))
                  }
                  placeholder="Ulangi kata sandi"
                  secureTextEntry={!showConfirm}
                  autoComplete="new-password"
                  hasError={!!errors.confirmPassword}
                  rightSlot={
                    <TouchableOpacity
                      onPress={() => setShowConfirm((v) => !v)}
                      className="px-3 py-2"
                      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                      accessibilityLabel={showConfirm ? 'Sembunyikan konfirmasi' : 'Tampilkan konfirmasi'}
                    >
                      <Text className="text-outline text-body-default">
                        {showConfirm ? '🙈' : '👁'}
                      </Text>
                    </TouchableOpacity>
                  }
                />
                {!!errors.confirmPassword && (
                  <Text className="text-body-compact text-error -mt-3">{errors.confirmPassword}</Text>
                )}

                <TermsCheckbox
                  checked={agreeTerms}
                  onToggle={() => {
                    const next = !agreeTerms;
                    setAgreeTerms(next);
                    setErrors((e) => ({ ...e, agreeTerms: validateTerms(next) }));
                  }}
                  hasError={!!errors.agreeTerms}
                />

                {!!auth.error && (
                  <ErrorBanner message={auth.error} onDismiss={clearError} />
                )}

                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={auth.isLoading}
                    activeOpacity={0.85}
                    className={`h-12 rounded-xl flex-row items-center justify-center gap-2 shadow-sm
                      ${auth.isLoading ? 'bg-primary-container/60' : 'bg-primary-container'}`}
                  >
                    {auth.isLoading ? (
                      <ActivityIndicator color="#00344d" size="small" />
                    ) : (
                      <>
                        <Text className="text-headline-sm text-on-primary font-semibold">
                          Buat Akun
                        </Text>
                        <Text className="text-on-primary text-body-default">→</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}
          </View>

          {!registerSuccess && (
            <View className="flex-row items-center justify-center gap-1 mt-4">
              <Text className="text-body-compact text-on-surface-variant">
                Sudah punya akun?
              </Text>
              <TouchableOpacity onPress={goToLogin} activeOpacity={0.7}>
                <Text className="text-body-compact text-primary underline underline-offset-2">
                  Masuk sekarang
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
