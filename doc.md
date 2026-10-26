# Dokumentasi Integrasi NativeWind pada Expo React Native

Dokumen ini mencatat langkah-langkah yang dilakukan untuk menyambungkan dan mengonfigurasi **NativeWind v4** ke dalam proyek Expo ini.

---

## 1. Analisis Awal Proyek
Sebelum konfigurasi dilakukan, kondisi proyek adalah sebagai berikut:
- Terdapat dependensi `@tailwindcss/vite` dan `vite.config.js` yang tidak sesuai untuk ekosistem React Native / Expo (Vite ditujukan untuk web bundler biasa, sedangkan Expo menggunakan bundler **Metro**).
- Dependensi `tailwindcss` terpasang pada versi 4 (`^4.3.3`), padahal NativeWind v4 memerlukan Tailwind CSS v3 (`^3.4.17`).
- Belum ada konfigurasi `metro.config.js`, `babel.config.js`, dan `tailwind.config.js` untuk NativeWind.

---

## 2. Perubahan Dependensi & Pembersihan

1. **Menghapus dependensi dan berkas Vite**:
   - Menghapus `vite.config.js`.
   - Meng-uninstall dependensi `@tailwindcss/vite`.
2. **Memasang dependensi NativeWind & peer dependencies yang sesuai**:
   - `nativewind` (`^4.2.7`)
   - `react-native-reanimated` (`4.5.1`)
   - `react-native-safe-area-context` (`~5.7.0`)
   - `react-native-worklets` (`0.10.1`)
   - `react-native-css-interop` (`0.2.7`)
   - `babel-preset-expo` (`~57.0.0`)
3. **Memasang Tailwind CSS v3**:
   - `tailwindcss` (`^3.4.19` pada `devDependencies`).

---

## 3. Berkas Konfigurasi yang Dibuat

### a. `tailwind.config.js`
Menentukan direktori berkas yang menggunakan class Tailwind serta memuat preset `nativewind/preset`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### b. `metro.config.js`
Membungkus konfigurasi default Expo Metro dengan `withNativeWind` yang mengarahkan ke berkas `./global.css`:
```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

### c. `babel.config.js`
Mengonfigurasi compiler Babel agar mengenali JSX transform NativeWind:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

### d. `global.css`
Memuat direktif Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### e. `nativewind-env.d.ts`
Memberikan deklarasi tipe untuk dukungan TypeScript dan auto-complete pada editor / IDE:
```typescript
/// <reference types="nativewind/types" />
```

---

## 4. Pembaruan Komponen (`App.js`)
Mengimpor `./global.css` pada entry point dan menerapkan styling menggunakan Tailwind utility classes (`className`):

```javascript
import './global.css';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-blue-600 mb-2">
        Market Intelligence
      </Text>
      <Text className="text-base text-gray-600 text-center">
        NativeWind berhasil tersambung dan siap digunakan!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
```

---

## 5. Pengujian & Verifikasi
- Dilakukan verifikasi load module dan Babel transformation terhadap `App.js`.
- Dilakukan uji bundling Metro penuh menggunakan perintah:
  ```bash
  npx expo export --output-dir /tmp/test-expo-export --clear
  ```
- **Hasil**: Bundling berhasil 100% untuk platform iOS (`index-*.hbc`) dan Android (`index-*.hbc`) tanpa error.

---

## 6. Cara Menjalankan Aplikasi
Jalankan dev server Expo dengan membersihkan cache:
```bash
npx expo start --clear
```
Pilih `a` untuk membuka di emulator Android atau `i` untuk simulator iOS.

---
---

# Modul Login — Otrum Market Intelligence

> **Tanggal:** 2026-10-25  
> **Status:** ✅ Selesai — UI Login (mock JSON auth)  
> **Referensi desain:** `Guide/stitch_idx_market_intelligence_platform/institutional_login_mobile/`

---

## 7. Otrum Design System Tokens

Design tokens ditambahkan ke `tailwind.config.js` di bagian `theme.extend`. Semua token mengikuti palet **Material-You dark** yang dipakai dalam referensi desain.

### Warna Utama

| Token | Hex | Kegunaan |
|---|---|---|
| `surface` | `#0f131d` | Latar utama seluruh layar |
| `surface-container` | `#1c1f2a` | Kartu / form container |
| `surface-container-lowest` | `#0a0e18` | Input field background |
| `primary-container` | `#0ea5e9` | Tombol submit, aksen utama |
| `on-primary` | `#00344d` | Teks di atas tombol primary |
| `on-surface` | `#dfe2f1` | Teks utama |
| `on-surface-variant` | `#bec8d2` | Teks sekunder / placeholder label |
| `outline` | `#88929b` | Border, ikon subtle |
| `error` | `#ffb4ab` | Warna pesan error |
| `error-container` | `#93000a` | Background banner error |

### Skala Tipografi

| Token | Ukuran | Kegunaan |
|---|---|---|
| `headline-lg` | 24px / 600 | Judul halaman |
| `headline-sm` | 15px / 600 | Label form, teks tombol |
| `body-default` | 13px / 400 | Teks deskripsi |
| `body-compact` | 12px / 400 | Helper text, footer |
| `label-mono-sm` | 10px / 500 | Badge teks monospace |

---

## 8. Struktur Berkas — Modul Auth & Login

```
src/
├── auth/
│   └── useAuth.js          ← Hook autentikasi (mock JSON)
├── data/
│   └── users.json          ← Data akun sementara (sebelum SQL)
└── screens/
    └── LoginScreen.js      ← Komponen UI login utama
App.js                      ← Entry point, mounts LoginScreen / HomeScreen
```

---

## 9. `src/data/users.json` — Mock User Store

Berisi array akun yang digunakan selama fase pengembangan. **Gantikan dengan endpoint SQL/API sebelum production.**

```json
[
  {
    "id": "usr_001",
    "name": "Budi Santoso",
    "email": "budi.santoso@example.com",
    "password": "Password123!",
    "role": "investor",
    "createdAt": "2025-01-15T08:00:00.000Z"
  },
  ...
]
```

> ⚠️ **Keamanan:** Password disimpan plaintext karena ini adalah mock lokal. Implementasi production **wajib** menggunakan hashing (bcrypt/argon2) dan transport HTTPS.

**Akun untuk testing:**

| Email | Password | Role |
|---|---|---|
| `budi.santoso@example.com` | `Password123!` | investor |
| `siti.rahayu@example.com` | `Rahayu2025!` | analyst |
| `demo@otrum.id` | `Demo1234!` | investor |

---

## 10. `src/auth/useAuth.js` — Authentication Hook

Hook React yang menyediakan state autentikasi dan fungsi login/logout.

### Interface

```javascript
const { auth, login, logout, clearError } = useAuth();
```

| Property | Tipe | Deskripsi |
|---|---|---|
| `auth.user` | `Object \| null` | Data user yang sedang login |
| `auth.isAuthenticated` | `boolean` | Apakah user sudah login |
| `auth.isLoading` | `boolean` | Sedang proses autentikasi |
| `auth.error` | `string \| null` | Pesan error jika login gagal |
| `login(email, password)` | `async Function` | Mencoba login, returns `{success, user}` atau `{success, error}` |
| `logout()` | `Function` | Reset state ke unauthenticated |
| `clearError()` | `Function` | Hapus pesan error |

### Migrasi ke SQL/API

Ganti implementasi fungsi `authenticateUser` di dalam hook:

```javascript
// SEBELUM (mock):
async function authenticateUser(email, password) {
  await new Promise(r => setTimeout(r, 800));
  const match = USERS.find(u => u.email === email && u.password === password);
  if (!match) throw new Error('...');
  const { password: _pw, ...safeUser } = match;
  return safeUser;
}

// SESUDAH (API):
async function authenticateUser(email, password) {
  const res = await fetch('https://api.otrum.id/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { id, name, email, role, token }
}
```

Interface hook **tidak perlu diubah** — LoginScreen dan App.js otomatis kompatibel.

---

## 11. `src/screens/LoginScreen.js` — Komponen UI Login

### Sub-komponen

| Nama | Deskripsi |
|---|---|
| `SecureBadge` | Pill badge "Secure Login" di header |
| `TabSwitcher` | Toggle antara tab "Masuk" dan "Daftar" |
| `FormInput` | Input field berlabel dengan slot ikon kanan |
| `ErrorBanner` | Banner error yang bisa di-dismiss |
| `LoginScreen` | Komponen utama (default export) |

### Props

```javascript
<LoginScreen authHook={useAuth()} />
```

| Prop | Tipe | Deskripsi |
|---|---|---|
| `authHook` | `UseAuthReturn` | Hasil dari `useAuth()` — injected dari parent |

### Fitur UI

- ✅ Field email + validasi format inline
- ✅ Field password + tombol show/hide
- ✅ Checkbox "Ingat Saya"
- ✅ Link "Lupa Sandi?" (placeholder)
- ✅ Error banner (dari server) dengan dismiss
- ✅ Validasi field-level sebelum submit
- ✅ Loading state pada tombol submit (`ActivityIndicator`)
- ✅ Animasi skala tombol saat ditekan
- ✅ `KeyboardAvoidingView` — form tetap terlihat saat keyboard terbuka
- ✅ Tab "Daftar" sebagai placeholder (menampilkan pesan "segera hadir")
- ✅ SafeArea-aware (top + bottom insets)
- ✅ Logo Otrum dari `assets/Logo.png`

---

## 12. `App.js` — Entry Point (Updated)

```javascript
import { useAuth } from './src/auth/useAuth';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const authHook = useAuth();
  const { auth, logout } = authHook;

  return (
    <SafeAreaProvider>
      {auth.isAuthenticated
        ? <HomeScreen user={auth.user} onLogout={logout} />
        : <LoginScreen authHook={authHook} />
      }
    </SafeAreaProvider>
  );
}
```

Setelah login berhasil, `auth.isAuthenticated` menjadi `true` dan `HomeScreen` placeholder ditampilkan. Komponen ini akan digantikan navigator (Expo Router) pada sprint berikutnya.

---

## 13. Cara Menjalankan & Testing Manual

```bash
npx expo start --clear
```

1. Buka emulator Android (`a`) atau simulator iOS (`i`).
2. Coba login dengan salah satu akun dari tabel di bagian 9.
3. Coba login dengan data salah → banner error merah muncul.
4. Coba submit form kosong → validasi inline muncul per field.
5. Tap "Lupa Sandi?" — tidak ada aksi (placeholder).
6. Tap tab "Daftar" — pesan placeholder muncul.
7. Setelah login berhasil → layar HomeScreen placeholder tampil.
8. Tap "Keluar" → kembali ke LoginScreen.

---

## 14. Rencana Sprint Berikutnya

| Item | Prioritas |
|---|---|
| Unit testing `useAuth` hook (jest + @testing-library/react-hooks) | P0 |
| Unit testing validasi form LoginScreen & RegisterScreen | P0 |
| Integrasi Expo Router (navigasi antar layar) | P1 |
| Layar HomeScreen / Dashboard sesungguhnya | P1 |
| Migrasi dari `users.json` ke backend SQL + JWT | P1 |
| AsyncStorage untuk persistensi token "Ingat Saya" | P1 |
| Layar Lupa Sandi (reset via email) | P2 |

---

## 1. Analisis Awal Proyek
Sebelum konfigurasi dilakukan, kondisi proyek adalah sebagai berikut:
- Terdapat dependensi `@tailwindcss/vite` dan `vite.config.js` yang tidak sesuai untuk ekosistem React Native / Expo (Vite ditujukan untuk web bundler biasa, sedangkan Expo menggunakan bundler **Metro**).
- Dependensi `tailwindcss` terpasang pada versi 4 (`^4.3.3`), padahal NativeWind v4 memerlukan Tailwind CSS v3 (`^3.4.17`).
- Belum ada konfigurasi `metro.config.js`, `babel.config.js`, dan `tailwind.config.js` untuk NativeWind.

---

## 2. Perubahan Dependensi & Pembersihan

1. **Menghapus dependensi dan berkas Vite**:
   - Menghapus `vite.config.js`.
   - Meng-uninstall dependensi `@tailwindcss/vite`.
2. **Memasang dependensi NativeWind & peer dependencies yang sesuai**:
   - `nativewind` (`^4.2.7`)
   - `react-native-reanimated` (`4.5.1`)
   - `react-native-safe-area-context` (`~5.7.0`)
   - `react-native-worklets` (`0.10.1`)
   - `react-native-css-interop` (`0.2.7`)
   - `babel-preset-expo` (`~57.0.0`)
3. **Memasang Tailwind CSS v3**:
   - `tailwindcss` (`^3.4.19` pada `devDependencies`).

---

## 3. Berkas Konfigurasi yang Dibuat

### a. `tailwind.config.js`
Menentukan direktori berkas yang menggunakan class Tailwind serta memuat preset `nativewind/preset`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### b. `metro.config.js`
Membungkus konfigurasi default Expo Metro dengan `withNativeWind` yang mengarahkan ke berkas `./global.css`:
```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

### c. `babel.config.js`
Mengonfigurasi compiler Babel agar mengenali JSX transform NativeWind:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

### d. `global.css`
Memuat direktif Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### e. `nativewind-env.d.ts`
Memberikan deklarasi tipe untuk dukungan TypeScript dan auto-complete pada editor / IDE:
```typescript
/// <reference types="nativewind/types" />
```

---

## 4. Pembaruan Komponen (`App.js`)
Mengimpor `./global.css` pada entry point dan menerapkan styling menggunakan Tailwind utility classes (`className`):

```javascript
import './global.css';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-blue-600 mb-2">
        Market Intelligence
      </Text>
      <Text className="text-base text-gray-600 text-center">
        NativeWind berhasil tersambung dan siap digunakan!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
```

---

## 5. Pengujian & Verifikasi
- Dilakukan verifikasi load module dan Babel transformation terhadap `App.js`.
- Dilakukan uji bundling Metro penuh menggunakan perintah:
  ```bash
  npx expo export --output-dir /tmp/test-expo-export --clear
  ```
- **Hasil**: Bundling berhasil 100% untuk platform iOS (`index-*.hbc`) dan Android (`index-*.hbc`) tanpa error.

---

## 6. Cara Menjalankan Aplikasi
Jalankan dev server Expo dengan membersihkan cache:
```bash
npx expo start --clear
```
Pilih `a` untuk membuka di emulator Android atau `i` untuk simulator iOS.

---
---

# Modul Register — Otrum Market Intelligence

> **Tanggal:** 2026-10-25  
> **Status:** ✅ Selesai — UI Register (mock JSON auth)

---

## 15. Struktur Berkas — Tambahan Modul Register

```
src/
├── auth/
│   └── useAuth.js          ← Ditambah fungsi register() + registerUser()
├── data/
│   └── users.json          ← Seed data; runtime store tumbuh di mockDb[]
└── screens/
    ├── LoginScreen.js      ← Tab "Daftar" sekarang menampilkan RegisterScreen
    └── RegisterScreen.js   ← Komponen UI register (baru)
```

---

## 16. Perubahan `useAuth.js` — Fungsi Register

### In-memory database

```javascript
const mockDb = [...SEED_USERS]; // tumbuh saat register dipanggil
```

Seed dari `users.json`, bisa menerima akun baru selama sesi berjalan.

### `registerUser(name, email, password, role)`

| Langkah | Keterangan |
|---|---|
| 1. Delay 1000 ms | Simulasi network latency |
| 2. Cek duplikat email | `throw Error` jika email sudah ada |
| 3. Buat record baru | `id` = `usr_<timestamp>`, `createdAt` = ISO string |
| 4. Push ke `mockDb` | Persisten dalam sesi ini |
| 5. Return safe user | Password tidak dikembalikan |

### Hook API (tambahan)

```javascript
const { auth, login, register, logout, clearError } = useAuth();

// Daftarkan akun baru + auto-login
const result = await register('Andi', 'andi@email.com', 'Pass1234!', 'investor');
// result: { success: true, user: { id, name, email, role, createdAt } }
//     or: { success: false, error: 'Email sudah terdaftar...' }
```

---

## 17. `src/screens/RegisterScreen.js` — Komponen UI Register

### Sub-komponen

| Nama | Deskripsi |
|---|---|
| `ErrorBanner` | Banner error dismissible (sama dengan Login) |
| `FormInput` | Input berlabel dengan slot kanan (sama pola dengan Login) |
| `PasswordStrengthBar` | Bar indikator kekuatan password (3 segmen) |
| `RolePicker` | Toggle pill dua pilihan: Investor Ritel / Analis |
| `TermsCheckbox` | Checkbox Syarat & Ketentuan dengan error inline |
| `SuccessState` | State sukses setelah akun berhasil dibuat |
| `RegisterScreen` | Komponen utama (default export) |

### Props

```javascript
<RegisterScreen
  authHook={useAuth()}  // hasil dari useAuth()
  onSwitch={fn}         // callback untuk kembali ke tab Login
/>
```

### Field & Validasi

| Field | Aturan |
|---|---|
| Nama Lengkap | Wajib, min 2 karakter |
| Alamat Email | Wajib, format email valid, unik (dicek server-side) |
| Kata Sandi | Wajib, min 8 karakter; indikator kekuatan ditampilkan |
| Konfirmasi Kata Sandi | Wajib, harus cocok dengan field Password |
| Peran Akun | Toggle: `investor` (default) / `analyst` |
| Syarat & Ketentuan | Wajib dicentang sebelum submit |

### Strategi Validasi

- **Touched-then-validate**: error hanya muncul setelah field di-blur atau submit pertama kali gagal.
- **Live re-validation**: setelah error muncul, error hilang real-time saat pengguna mengetik koreksi.
- `validateAll()` dipanggil saat submit — runs semua validator sekaligus dan menampilkan error secara bersama-sama.

### Password Strength Algorithm

```javascript
function getPasswordStrength(password) {
  const hasUpper   = /[A-Z]/.test(password);
  const hasDigit   = /\d/.test(password);
  const hasSymbol  = /[^A-Za-z0-9]/.test(password);
  const longEnough = password.length >= 8;
  const score = [hasUpper, hasDigit, hasSymbol, longEnough].filter(Boolean).length;
  if (score <= 1) return 'weak';   // bar 1/3, merah
  if (score <= 3) return 'fair';   // bar 2/3, hijau muda
  return 'strong';                 // bar penuh, hijau
}
```

### Fitur UI

- ✅ 5 field + role picker + terms checkbox
- ✅ Validasi inline per field (blur + live)
- ✅ Password strength indicator
- ✅ Show/hide password untuk kedua field password
- ✅ Role selector pill (Investor Ritel / Analis)
- ✅ Checkbox Syarat & Ketentuan dengan error state
- ✅ Error banner API (email sudah terdaftar, dsb.)
- ✅ Loading state tombol submit (`ActivityIndicator`)
- ✅ Animasi scale tombol
- ✅ Success state setelah akun berhasil dibuat
- ✅ Auto-login setelah register sukses
- ✅ `KeyboardAvoidingView` + `ScrollView`

---

## 18. Integrasi ke `LoginScreen.js`

Tab "Daftar" pada `LoginScreen` sekarang me-render `RegisterScreen` sesungguhnya:

```jsx
// Di dalam LoginScreen render:
{activeTab === 'register' && (
  <RegisterScreen
    authHook={authHook}         // shared hook — satu state auth untuk login & register
    onSwitch={() => handleTabSelect('login')}
  />
)}
```

Judul halaman berubah dinamis:
```jsx
{activeTab === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
```

---

## 19. Cara Testing Registrasi Manual

1. Buka aplikasi (`npx expo start --clear`)
2. Tap tab **Daftar**
3. Isi form:
   - Nama Lengkap: `Tes User`
   - Email: `tes@otrum.id` (baru, belum ada di users.json)
   - Password: `Kuat1234!` → strength bar harus menunjukkan "Kuat"
   - Konfirmasi: sama dengan password
   - Pilih role
   - Centang syarat & ketentuan
4. Tap **Buat Akun** → loading spinner muncul ±1 detik
5. Success state muncul dengan nama pengguna
6. Tap **Mulai Sekarang** atau tunggu → auto-login ke HomeScreen

**Testing error:**
- Email sudah ada (`demo@otrum.id`) → banner merah "Email sudah terdaftar"
- Submit tanpa centang terms → error inline di checkbox
- Password tidak cocok → error di field konfirmasi
- Password < 8 karakter → error + strength bar "Lemah"

---

## 20. Rencana Sprint Berikutnya

| Item | Prioritas |
|---|---|
| Unit testing `useAuth` — login, register, duplikat email, kredensial salah | P0 |
| Unit testing validasi form LoginScreen & RegisterScreen | P0 |
| Integrasi Expo Router (navigasi antar layar) | P1 |
| Layar HomeScreen / Dashboard sesungguhnya | P1 |
| Migrasi dari `users.json` ke backend SQL + JWT | P1 |
| AsyncStorage — persistensi "Ingat Saya" + token refresh | P1 |
| Layar Lupa Sandi (reset via email) | P2 |
