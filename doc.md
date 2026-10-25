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
