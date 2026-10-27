import React, { useState } from 'react';
import { View } from 'react-native';

import DashboardScreen from '../screens/DashboardScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import BottomTabBar, { type AppTab } from './BottomTabBar';

/**
 * Authenticated area of the app. Hosts the bottom-tab destinations and renders
 * the active tab above a persistent {@link BottomTabBar}. "Overview" shows the
 * market dashboard; the remaining tabs render placeholders until designed.
 */
export default function AppNavigator({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<AppTab>('overview');

  function renderTab() {
    switch (tab) {
      case 'overview':
        return <DashboardScreen onLogout={onLogout} />;
      case 'screener':
        return (
          <PlaceholderScreen
            title="Screener"
            description="Fundamental stock screener akan segera hadir."
          />
        );
      case 'stock':
        return (
          <PlaceholderScreen
            title="Stock Analysis"
            description="Analisis fundamental per emiten akan segera hadir."
          />
        );
      case 'sector':
        return (
          <PlaceholderScreen
            title="Sector Radar"
            description="Analisis sektor akan segera hadir."
          />
        );
      case 'watchlist':
        return (
          <PlaceholderScreen
            title="Watchlist"
            description="Daftar pantau Anda akan segera hadir."
          />
        );
      default:
        return <DashboardScreen />;
    }
  }

  return (
    <View className="flex-1 bg-surface">
      <View className="flex-1">{renderTab()}</View>
      <BottomTabBar active={tab} onChange={setTab} />
    </View>
  );
}
