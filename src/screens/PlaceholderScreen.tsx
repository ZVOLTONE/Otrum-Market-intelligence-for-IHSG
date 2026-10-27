import React from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface PlaceholderScreenProps {
  title: string;
  description?: string;
}

/** Shared placeholder image used in place of a screen-specific icon (temporary). */
const PLACEHOLDER_ICON = require('../../assets/Dummy.png');

/**
 * Lightweight "coming soon" screen used for tabs whose UI has not been
 * designed yet (Screener, Stock, Sector, Watchlist). Keeps navigation
 * functional without inventing UI beyond the provided dashboard design.
 */
export default function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-surface items-center justify-center px-8 gap-3" edges={['top']}>
      <StatusBar style="light" />
      <View className="w-16 h-16 rounded-2xl bg-surface-container items-center justify-center overflow-hidden">
        <Image
          source={PLACEHOLDER_ICON}
          accessibilityLabel={title}
          resizeMode="contain"
          style={{ width: 40, height: 40 }}
        />
      </View>
      <Text className="text-headline-lg text-on-surface font-semibold text-center">{title}</Text>
      <Text className="text-body-default text-on-surface-variant text-center max-w-xs">
        {description ?? 'Halaman ini akan segera hadir.'}
      </Text>
    </SafeAreaView>
  );
}
