/**
 * @module src/screens/RegisterScreen
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
  ActivityIndicator,
  Animated,
} from 'react-native';


const ROLES = [
  { value: 'investor', label: 'Investor Ritel' },
  { value: 'analyst',  label: 'Analis'         },
];

/** Password strength levels */
const STRENGTH = {
  weak:   { label: 'Lemah',  color: 'bg-error',             width: 'w-1/3' },
  fair:   { label: 'Cukup',  color: 'bg-tertiary-container', width: 'w-2/3' },
  strong: { label: 'Kuat',   color: 'bg-tertiary',           width: 'w-full' },
};


function getPasswordStrength(password) {
  if (!password) return null;
  const hasUpper  = /[A-Z]/.test(password);
  const hasDigit  = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const longEnough = password.length >= 8;
  const score = [hasUpper, hasDigit, hasSymbol, longEnough].filter(Boolean).length;
  if (score <= 1) return 'weak';
  if (score <= 3) return 'fair';
  return 'strong';
}

//subkomponen
/**
 * @param {{ message: string, onDismiss: Function }} props
 */
function ErrorBanner({ message, onDismiss }) {
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

// Salinan dari FormInput.js, karena kita tidak memiliki file terpisah untuk itu di sini.
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
}) {
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

/**
 * tiga klasifikasi kekuatan kata sandi: lemah, cukup, kuat
 * @param {{ strength: 'weak'|'fair'|'strong'|null }} props
 */
function PasswordStrengthBar({ strength }) {
  if (!strength) return null;
  const meta = STRENGTH[strength];
  return (
    <View className="gap-1">
      <View className="h-1 w-full rounded-full bg-surface-container-highest overflow-hidden">
        <View className={`h-full rounded-full ${meta.color} ${meta.width}`} />
      </View>
      <Text className={`text-body-compact ${
        strength === 'weak' ? 'text-error' :
        strength === 'fair' ? 'text-tertiary' :
        'text-tertiary'
      }`}>
        Kekuatan kata sandi: {meta.label}
      </Text>
    </View>
  );
}

/**
 * Role selector — two pill-style toggle buttons.
 * @param {{ value: string, onChange: Function }} props
 */
function RolePicker({ value, onChange }) {
  return (
    <View className="gap-1">
      <Text className="text-headline-sm text-on-surface">Peran Akun</Text>
      <View className="flex-row gap-2">
        {ROLES.map((role) => {
          const isSelected = value === role.value;
          return (
            <TouchableOpacity
              key={role.value}
              onPress={() => onChange(role.value)}
              activeOpacity={0.8}
              className={`flex-1 h-12 rounded-xl items-center justify-center border
                ${isSelected
                  ? 'bg-primary-container border-primary-container'
                  : 'bg-surface-container-lowest border-outline-variant'
                }`}
            >
              <Text
                className={`text-headline-sm ${
                  isSelected ? 'text-on-primary' : 'text-on-surface-variant'
                }`}
              >
                {role.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/**
 * Terms & conditions checkbox row.
 * @param {{ checked: boolean, onToggle: Function, hasError: boolean }} props
 */
function TermsCheckbox({ checked, onToggle, hasError }) {
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

/**
 * Animated success state shown after registration.
 * @param {{ user: Object, onContinue: Function }} props
 */
function SuccessState({ user, onContinue }) {
  return (
    <View className="items-center gap-4 py-4">
      {/* Icon */}
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

      <TouchableOpacity
        onPress={onContinue}
        activeOpacity={0.85}
        className="w-full h-12 rounded-xl bg-primary-container items-center justify-center mt-2"
      >
        <Text className="text-headline-sm text-on-primary font-semibold">
          Mulai Sekarang →
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Bagian utama register
/**
 * @param {Object} props
 * @param {Object}   props.authHook 
 * @param {Function} props.onSwitch  
 */
export default function RegisterScreen({ authHook, onSwitch }) {
  const { auth, register, clearError } = authHook;

  // Form
  const [name,             setName]             = useState('');
  const [email,            setEmail]            = useState('');
  const [password,         setPassword]         = useState('');
  const [confirmPassword,  setConfirmPassword]  = useState('');
  const [role,             setRole]             = useState('investor');
  const [agreeTerms,       setAgreeTerms]       = useState(false);
  const [showPassword,     setShowPassword]     = useState(false);
  const [showConfirm,      setShowConfirm]      = useState(false);
  const [registerSuccess,  setRegisterSuccess]  = useState(false);

// Validation error
  const [errors, setErrors] = useState({
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: '',
    agreeTerms:      '',
  });

  // Animasi
  const [scaleAnim] = useState(() => new Animated.Value(1));

  function animatePress() {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start();
  }

// Validation
  function validateName(val = name) {
    if (!val.trim()) return 'Nama lengkap wajib diisi.';
    if (val.trim().length < 2) return 'Nama terlalu pendek.';
    return '';
  }

  function validateEmail(val = email) {
    if (!val.trim()) return 'Email wajib diisi.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Format email tidak valid.';
    return '';
  }

  function validatePassword(val = password) {
    if (!val) return 'Kata sandi wajib diisi.';
    if (val.length < 8) return 'Kata sandi minimal 8 karakter.';
    return '';
  }

  function validateConfirmPassword(val = confirmPassword, pw = password) {
    if (!val) return 'Konfirmasi kata sandi wajib diisi.';
    if (val !== pw) return 'Kata sandi tidak cocok.';
    return '';
  }

  function validateTerms(val = agreeTerms) {
    return val ? '' : 'Anda harus menyetujui syarat & ketentuan.';
  }

// cek semua validasi sekaligus, mengembalikan true jika semua valid
  function validateAll() {
    const next = {
      name:            validateName(),
      email:           validateEmail(),
      password:        validatePassword(),
      confirmPassword: validateConfirmPassword(),
      agreeTerms:      validateTerms(),
    };
    setErrors(next);
    return Object.values(next).every((e) => !e);
  }


  function handleNameChange(val) {
    setName(val);
    if (errors.name) setErrors((e) => ({ ...e, name: validateName(val) }));
    if (auth.error) clearError();
  }

  function handleEmailChange(val) {
    setEmail(val);
    if (errors.email) setErrors((e) => ({ ...e, email: validateEmail(val) }));
    if (auth.error) clearError();
  }

  function handlePasswordChange(val) {
    setPassword(val);
    if (errors.password) setErrors((e) => ({ ...e, password: validatePassword(val) }));
    if (errors.confirmPassword) {
      setErrors((e) => ({ ...e, confirmPassword: validateConfirmPassword(confirmPassword, val) }));
    }
    if (auth.error) clearError();
  }

  function handleConfirmChange(val) {
    setConfirmPassword(val);
    if (errors.confirmPassword) {
      setErrors((e) => ({ ...e, confirmPassword: validateConfirmPassword(val, password) }));
    }
    if (auth.error) clearError();
  }

// Submit register
  async function handleSubmit() {
    if (!validateAll()) return;
    animatePress();
    const result = await register(name, email, password, role);
    if (result.success) {
      setRegisterSuccess(true);
    }
  }



  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-margin pb-10 pt-2"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Form card */}
        <View className="bg-surface-container rounded-2xl p-space-lg gap-5 shadow-md">

          {/* Success state */}
          {registerSuccess ? (
            <SuccessState user={auth.user} onContinue={() => {}} />
          ) : (
            <>
              {/* Nama Lengkap */}
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

              {/* Alamat Email */}
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

              {/* Sandi */}
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
                {/* Strength indicator — shown only when there's a value & no error */}
                {!errors.password && (
                  <PasswordStrengthBar strength={getPasswordStrength(password)} />
                )}
              </View>

              {/* Konfirmasi pasword */}
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

              {/* Pilih role */}
              <RolePicker value={role} onChange={setRole} />

              
              <TermsCheckbox
                checked={agreeTerms}
                onToggle={() => {
                  const next = !agreeTerms;
                  setAgreeTerms(next);
                  setErrors((e) => ({ ...e, agreeTerms: validateTerms(next) }));
                }}
                hasError={!!errors.agreeTerms}
              />

              {/* Error banner */}
              {!!auth.error && (
                <ErrorBanner message={auth.error} onDismiss={clearError} />
              )}

              {/* Submit sudah */}
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

        {/* Pindah ke login */}
        {!registerSuccess && (
          <View className="flex-row items-center justify-center gap-1 mt-4">
            <Text className="text-body-compact text-on-surface-variant">
              Sudah punya akun?
            </Text>
            <TouchableOpacity onPress={onSwitch} activeOpacity={0.7}>
              <Text className="text-body-compact text-primary underline underline-offset-2">
                Masuk sekarang
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
