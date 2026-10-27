import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

/** Identifiers for the app's main bottom-tab destinations. */
export type AppTab = 'overview' | 'screener' | 'stock' | 'sector' | 'watchlist';

interface TabDef {
  id: AppTab;
  label: string;
}

const TABS: TabDef[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'screener', label: 'Screener' },
  { id: 'stock', label: 'Stock' },
  { id: 'sector', label: 'Sector' },
  { id: 'watchlist', label: 'Watchlist' },
];

/**
 * Temporary tab icon. The reference design uses Material Symbols; until an icon
 * set is wired up we render the shared `assets/Dummy.png` placeholder (dimmed
 * when the tab is inactive) so no emoji "tofu" boxes appear on-device.
 */
const TAB_ICON = require('../../assets/Dummy.png');

interface BottomTabBarProps {
  active: AppTab;
  onChange: (tab: AppTab) => void;
}

/**
 * Fixed bottom navigation mirroring the mobile dashboard design:
 * five destinations with an active indicator bar above the current tab.
 */
export default function BottomTabBar({ active, onChange }: BottomTabBarProps) {
  return (
    <View className="w-full bg-surface-container-lowest/95 border-t border-outline-variant/30">
      <View className="h-16 px-space-xs flex-row items-center justify-around">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <TouchableOpacity
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
              onPress={() => onChange(tab.id)}
              className="flex-1 h-full min-w-[44px] items-center justify-center gap-0.5 relative"
            >
              {isActive && (
                <View className="absolute top-0 w-8 h-0.5 rounded-full bg-primary-container" />
              )}
              <Image
                source={TAB_ICON}
                resizeMode="contain"
                style={{ width: 22, height: 22, opacity: isActive ? 1 : 0.5 }}
              />
              <Text
                className={`text-label-badge leading-tight ${
                  isActive ? 'text-primary-container' : 'text-on-surface-variant'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
