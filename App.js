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
