import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Line,
  Path,
  Stop,
} from 'react-native-svg';

import {
  archetypes,
  kpiCards,
  marketChart,
  marketIndex,
  watchlist,
  type Archetype,
  type KpiCard,
  type MarketChartPoint,
  type Trend,
  type WatchlistItem,
} from '../data/marketData';

const DUMMY_IMAGE = require('../../assets/Dummy.png');


function DummyIcon({ size = 20, label }: { size?: number; label: string }) {
  return (
    <Image
      source={DUMMY_IMAGE}
      accessibilityLabel={label}
      resizeMode="contain"
      style={{ width: size, height: size }}
    />
  );
}

function trendStyle(trend: Trend): { arrow: string; colorClass: string } {
  return trend === 'up'
    ? { arrow: '▲', colorClass: 'text-tertiary' }
    : { arrow: '▼', colorClass: 'text-error' };
}

function sparklinePath(values: number[], width: number, height: number): string {
  if (values.length === 0) return '';
  const step = width / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = height - v * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

interface AreaPaths {
  line: string;
  area: string;
  lastX: number;
  lastY: number;
}

function areaChartPaths(
  points: MarketChartPoint[],
  width: number,
  height: number,
  pad = 6
): AreaPaths {
  if (points.length === 0) return { line: '', area: '', lastX: 0, lastY: 0 };
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const plotH = height - pad * 2;

  const coords = points.map((p) => {
    const x = p.x * width;
    const y = pad + (1 - (p.value - min) / span) * plotH;
    return { x, y };
  });

  const line = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ');
  const last = coords[coords.length - 1];
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;

  return { line, area, lastX: last.x, lastY: last.y };
}

function Header({ onLogout }: { onLogout?: () => void }) {
  return (
    <View className="flex-row items-center justify-between px-margin h-14">
      <View className="flex-row items-center gap-space-sm min-w-0 flex-1">
        <View className="w-7 h-7 rounded-full bg-primary items-center justify-center">
          <View className="w-2.5 h-2.5 rounded-full bg-surface-container-lowest" />
        </View>
        <View className="min-w-0">
          <View className="flex-row items-center gap-space-xs">
            <Text className="text-headline-sm text-on-surface tracking-tight">
              Market Intel
            </Text>
            <View className="flex-row items-center gap-1 px-1.5 py-0.5 rounded-full bg-tertiary/10">
              <View className="w-1.5 h-1.5 rounded-full bg-tertiary" />
              <Text className="text-tertiary text-label-badge uppercase tracking-wider">
                IDX OPEN
              </Text>
            </View>
          </View>
          <Text className="text-label-mono-sm text-on-surface-variant">
            Session II • Overview
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-space-xs shrink-0">
        <TouchableOpacity
          accessibilityLabel="Notifikasi"
          className="w-11 h-11 items-center justify-center rounded-xl"
        >
          <DummyIcon size={20} label="Notifikasi" />
          <View className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-primary-container" />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel="Profil / Keluar"
          onPress={onLogout}
          className="w-8 h-8 rounded-full bg-primary items-center justify-center overflow-hidden"
        >
          <DummyIcon size={18} label="Profil / Keluar" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <View className="flex-row items-center gap-space-xs mt-space-xs">
      <View className="relative flex-1">
        <View className="absolute inset-y-0 left-0 pl-3 justify-center z-10">
          <DummyIcon size={16} label="Cari" />
        </View>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Search ticker (BBCA, BBRI, ASII...)"
          placeholderTextColor="#88929b99"
          autoCapitalize="characters"
          autoCorrect={false}
          className="w-full bg-surface-container-lowest text-on-surface text-body-compact rounded-xl pl-9 pr-12 h-10"
        />
        <View className="absolute inset-y-0 right-0 pr-2.5 justify-center">
          <Text className="text-label-mono-sm text-on-surface-variant uppercase bg-surface-container-high px-1.5 py-0.5 rounded">
            IDX
          </Text>
        </View>
      </View>
      <TouchableOpacity
        accessibilityLabel="Filter parameter"
        className="w-9 h-9 rounded-xl bg-surface-container-low items-center justify-center relative"
      >
        <DummyIcon size={16} label="Filter parameter" />
        <View className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary-container" />
      </TouchableOpacity>
    </View>
  );
}

function LiveStatusBar() {
  const ts = trendStyle(marketIndex.trend);
  const path = useMemo(() => sparklinePath(marketIndex.sparkline, 80, 28), []);
  const areaPath = useMemo(() => `${path} L 80 28 L 0 28 Z`, [path]);
  const last = marketIndex.sparkline[marketIndex.sparkline.length - 1];

  return (
    <View className="bg-surface-container-low rounded-xl p-space-sm flex-row items-center justify-between">
      <View className="min-w-0 pr-2 flex-1">
        <View className="flex-row items-end gap-1.5">
          <Text className="text-headline-sm text-on-surface">{marketIndex.symbol}</Text>
          <Text className="text-metric-large text-on-surface font-semibold tracking-tight">
            {marketIndex.value}
          </Text>
        </View>
        <View className="flex-row items-center gap-2 mt-0.5">
          <Text className={`text-label-mono-sm ${ts.colorClass}`}>
            {ts.arrow} {marketIndex.changePercent} ({marketIndex.changeAbsolute})
          </Text>
          <Text className="text-label-mono-sm text-on-surface-variant">
            {marketIndex.turnover}
          </Text>
        </View>
      </View>

      <View className="items-end shrink-0">
        <Svg width={80} height={28}>
          <Defs>
            <LinearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#4edea3" stopOpacity={0.3} />
              <Stop offset="100%" stopColor="#4edea3" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={areaPath} fill="url(#sparkGrad)" />
          <Path
            d={path}
            stroke="#4edea3"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Circle cx={80} cy={28 - last * 28} r={2.5} fill="#4edea3" />
        </Svg>
        <Text className="text-label-mono-sm text-tertiary mt-1 uppercase tracking-wider">
          {marketIndex.sessionLabel}
        </Text>
      </View>
    </View>
  );
}

function KpiCardView({ card }: { card: KpiCard }) {
  const ts = card.secondary?.startsWith('-') ? trendStyle('down') : trendStyle('up');
  const showTrendColor = card.secondary?.includes('%');

  return (
    <View className="flex-1 bg-surface-container rounded-xl p-3 justify-between overflow-hidden">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-label-badge text-on-surface-variant uppercase tracking-wider">
          {card.label}
        </Text>
        <DummyIcon size={15} label={card.label} />
      </View>
      <View>
        <View className="flex-row items-baseline gap-1.5">
          <Text
            className={`text-metric-large tracking-tight ${card.valueColorClass ?? 'text-on-surface'}`}
          >
            {card.value}
          </Text>
          {card.badge && (
            <Text className="text-label-mono-sm text-tertiary bg-tertiary/10 px-1 rounded">
              {card.badge}
            </Text>
          )}
          {card.secondary && !card.badge && (
            <Text
              className={`text-label-mono-sm ${
                showTrendColor ? ts.colorClass : 'text-on-surface-variant'
              }`}
            >
              {card.secondary}
            </Text>
          )}
        </View>
        {card.caption && (
          <Text className="text-label-mono-sm text-on-surface-variant mt-1" numberOfLines={1}>
            {card.caption}
          </Text>
        )}
      </View>
    </View>
  );
}

function KpiGrid() {
  return (
    <View className="gap-space-sm">
      <View className="flex-row gap-space-sm">
        <KpiCardView card={kpiCards[0]} />
        <KpiCardView card={kpiCards[1]} />
      </View>
      <View className="flex-row gap-space-sm">
        <KpiCardView card={kpiCards[2]} />
        <KpiCardView card={kpiCards[3]} />
      </View>
    </View>
  );
}

function PerformanceChart() {
  const [activeIndex, setActiveIndex] = useState(marketChart.activeIndex);
  const [activeRange, setActiveRange] = useState(marketChart.activeRange);

  const width = 320;
  const height = 150;
  const paths = useMemo(() => areaChartPaths(marketChart.points, width, height), []);
  const ts = trendStyle(marketChart.changeTrend);

  return (
    <View className="bg-surface-container-low rounded-2xl p-space-sm gap-space-xs">
      <View className="flex-row items-center justify-between">
        <View className="flex-row bg-surface-container-lowest p-0.5 rounded-lg gap-0.5">
          {marketChart.indices.map((idx) => {
            const active = idx === activeIndex;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setActiveIndex(idx)}
                className={`px-2.5 py-1 rounded ${active ? 'bg-surface-container' : ''}`}
              >
                <Text
                  className={`text-label-badge ${active ? 'text-primary' : 'text-on-surface-variant'}`}
                >
                  {idx}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-label-mono-sm uppercase tracking-wider">
          Demo Data
        </Text>
      </View>

      <View className="flex-row items-center justify-between pt-1 pb-0.5">
        <View className="flex-row items-center gap-1">
          {marketChart.ranges.map((r) => {
            const active = r.id === activeRange;
            return (
              <TouchableOpacity
                key={r.id}
                onPress={() => setActiveRange(r.id)}
                className={`px-2 py-0.5 rounded ${active ? 'bg-surface-container' : ''}`}
              >
                <Text
                  className={`text-label-mono-sm ${
                    active ? 'text-primary-container' : 'text-on-surface-variant'
                  }`}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text className={`text-label-mono-sm ${ts.colorClass}`}>↗ {marketChart.changeLabel}</Text>
      </View>

      <View className="relative bg-surface-container-lowest/60 rounded-xl p-2.5 gap-1">
        <View className="flex-row gap-1.5">
          {marketChart.macroPills.map((pill) => (
            <View
              key={pill.label}
              className="flex-row items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface-container-high"
            >
              <View
                className={`w-1.5 h-1.5 rounded-full ${
                  pill.trend === 'up' ? 'bg-tertiary' : 'bg-primary-container'
                }`}
              />
              <Text className="text-label-mono-sm text-on-surface-variant">{pill.label}</Text>
            </View>
          ))}
        </View>

        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
              <Stop offset="60%" stopColor="#4edea3" stopOpacity={0.08} />
              <Stop offset="100%" stopColor="#0f131d" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          {[0.25, 0.5, 0.75].map((frac) => (
            <Line
              key={frac}
              x1={0}
              x2={width}
              y1={height * frac}
              y2={height * frac}
              stroke="#313540"
              strokeWidth={0.75}
              strokeDasharray="3 3"
              opacity={0.4}
            />
          ))}
          <Path d={paths.area} fill="url(#areaGrad)" />
          <Path
            d={paths.line}
            stroke="#38bdf8"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Circle cx={paths.lastX} cy={paths.lastY} r={7} fill="#38bdf8" opacity={0.25} />
          <Circle cx={paths.lastX} cy={paths.lastY} r={3.5} fill="#38bdf8" />
        </Svg>

        <View className="flex-row items-center justify-between pt-1">
          {marketChart.milestones.map((m) => (
            <Text
              key={m.label}
              className={`text-label-mono-sm ${
                m.highlight ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              {m.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function ArchetypeCard({ item }: { item: Archetype }) {
  const [pillBg, pillText] = item.pillClasses;
  return (
    <View className="w-[245px] bg-surface-container rounded-xl p-3 justify-between">
      <View className="flex-row items-center justify-between mb-2">
        <Text className={`px-2 py-0.5 rounded-full text-label-badge ${pillBg} ${pillText}`}>
          {item.companyCount} Companies
        </Text>
        <Text className="text-label-mono-sm text-on-surface-variant">{item.metricLabel}</Text>
      </View>
      <View>
        <Text className="text-headline-sm text-on-surface">{item.title}</Text>
        <Text className="text-body-compact text-on-surface-variant mt-1" numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <View className="mt-3 pt-2.5 border-t border-surface-container-highest/60 flex-row items-center justify-between">
        <Text className="text-label-mono-sm text-tertiary">Top: {item.topTickers.join(', ')}</Text>
        <Text className="text-on-surface-variant">›</Text>
      </View>
    </View>
  );
}

function Archetypes() {
  return (
    <View className="gap-space-xs">
      <View className="flex-row items-center justify-between px-0.5">
        <View className="flex-row items-center gap-1.5">
          <DummyIcon size={18} label="Fundamental Archetypes" />
          <Text className="text-headline-sm text-on-surface">Fundamental Archetypes</Text>
        </View>
        <TouchableOpacity>
          <Text className="text-label-badge text-primary">Screen All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-space-sm px-margin"
        className="-mx-margin"
      >
        {archetypes.map((item) => (
          <ArchetypeCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}


function CompanyAvatar({ logo, label }: { logo?: number; label: string }) {
  const [failed, setFailed] = useState(false);
  const useFallback = !logo || failed;

  return (
    <View className="w-9 h-9 rounded-lg bg-surface-container-lowest items-center justify-center shrink-0 overflow-hidden">
      {useFallback ? (
        <Image
          source={DUMMY_IMAGE}
          accessibilityLabel={`${label} (logo tidak tersedia)`}
          resizeMode="cover"
          className="w-9 h-9"
        />
      ) : (
        <Image
          source={logo}
          accessibilityLabel={`Logo ${label}`}
          resizeMode="cover"
          className="w-9 h-9"
          onError={() => setFailed(true)}
        />
      )}
    </View>
  );
}

function WatchlistRow({ item }: { item: WatchlistItem }) {
  const ts = trendStyle(item.trend);
  return (
    <TouchableOpacity className="bg-surface-container rounded-xl p-2.5 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2.5 min-w-0 flex-1">
        <CompanyAvatar logo={item.logo} label={item.ticker} />
        <View className="min-w-0 flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-headline-sm text-on-surface font-semibold tracking-tight">
              {item.ticker}
            </Text>
            <Text className="text-label-mono-sm text-on-surface-variant px-1 rounded bg-surface-container-highest">
              {item.sector}
            </Text>
          </View>
          <View className="flex-row items-center gap-2 mt-0.5">
            <Text className="text-label-mono-sm text-on-surface-variant">
              PER{' '}
              <Text className={item.highlightPer ? 'text-tertiary' : 'text-on-surface'}>
                {item.per}
              </Text>
            </Text>
            <Text className="text-label-mono-sm text-on-surface-variant">•</Text>
            <Text className="text-label-mono-sm text-on-surface-variant">
              PBV <Text className="text-on-surface">{item.pbv}</Text>
            </Text>
          </View>
        </View>
      </View>
      <View className="items-end shrink-0 pl-2">
        <Text className="text-metric-default text-on-surface font-semibold">{item.price}</Text>
        <Text className={`text-label-mono-sm mt-0.5 ${ts.colorClass}`}>
          {ts.arrow} {item.changePercent}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function Watchlist() {
  return (
    <View className="bg-surface-container-low rounded-2xl p-space-sm gap-space-xs">
      <View className="flex-row items-center justify-between px-1">
        <View className="flex-row items-center gap-1.5">
          <DummyIcon size={18} label="Core Blue Chips" />
          <Text className="text-headline-sm text-on-surface">Core Blue Chips</Text>
        </View>
        <Text className="text-label-mono-sm text-on-surface-variant">IDX30 Selected</Text>
      </View>
      <View className="gap-1.5 mt-1">
        {watchlist.map((item) => (
          <WatchlistRow key={item.ticker} item={item} />
        ))}
      </View>
    </View>
  );
}

export default function DashboardScreen({ onLogout }: { onLogout?: () => void }) {
  const [query, setQuery] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <StatusBar style="light" />
      <Header onLogout={onLogout} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-margin pb-8 gap-space-md"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SearchBar value={query} onChange={setQuery} />
        <LiveStatusBar />
        <KpiGrid />
        <PerformanceChart />
        <Archetypes />
        <Watchlist />
      </ScrollView>
    </SafeAreaView>
  );
}
