
export type Trend = 'up' | 'down';
// Ini dummy ya sir maaf belum sampai backendnya, ini buat sementara aja biar bisa jalanin UI nya
export interface MarketIndex {
  symbol: string;
  value: string;
  changePercent: string;
  changeAbsolute: string;
  trend: Trend;
  turnover: string;
  sessionLabel: string;
  sparkline: number[];
}

export interface KpiCard {
  id: string;
  label: string;
  icon: string;
  value: string;
  caption?: string;
  secondary?: string;
  badge?: string;
  valueColorClass?: string;
}

export interface TimeRange {
  id: string;
  label: string;
}

export interface MarketChartPoint {
  x: number;
  value: number;
}

export interface MarketChart {
  indices: string[];
  activeIndex: string;
  ranges: TimeRange[];
  activeRange: string;
  changeLabel: string;
  changeTrend: Trend;
  points: MarketChartPoint[];
  macroPills: { label: string; trend: Trend }[];
  milestones: { label: string; highlight?: boolean }[];
}

export interface Archetype {
  id: string;
  title: string;
  description: string;
  companyCount: number;
  metricLabel: string;
  topTickers: string[];
  pillClasses: [string, string];
}

export interface WatchlistItem {
  ticker: string;
  sector: string;
  logo?: number;
  per: string;
  pbv: string;
  price: string;
  changePercent: string;
  trend: Trend;
  highlightPer?: boolean;
}

export const marketIndex: MarketIndex = {
  symbol: 'IHSG',
  value: '7,720.45',
  changePercent: '+0.55%',
  changeAbsolute: '+42.18',
  trend: 'up',
  turnover: 'Turnover Rp 12.4T',
  sessionLabel: 'Session II Active',
  sparkline: [0.2, 0.28, 0.18, 0.5, 0.42, 0.72, 0.6, 0.9],
};

export const kpiCards: KpiCard[] = [
  {
    id: 'composite',
    label: 'Composite',
    icon: 'show_chart',
    value: '7,720.45',
    secondary: '+0.55%',
    caption: 'Vol 18.4B sh',
    valueColorClass: 'text-on-surface',
  },
  {
    id: 'emiten',
    label: 'Emiten Base',
    icon: 'domain',
    value: '934',
    badge: '+3 IPO',
    caption: 'L:42 • M:186 • S:706',
  },
  {
    id: 'deep-value',
    label: 'Deep Value',
    icon: 'local_offer',
    value: '142',
    secondary: 'Stocks',
    caption: '< -1.0σ 5Y PER/PBV',
    valueColorClass: 'text-primary-container',
  },
  {
    id: 'multiples',
    label: 'Multiples',
    icon: 'data_thresholding',
    value: '14.8x',
    secondary: '-8.6% 5Y',
    caption: 'PBV 1.95x • Yield 3.42%',
  },
];

export const marketChart: MarketChart = {
  indices: ['IHSG', 'LQ45', 'IDX30'],
  activeIndex: 'IHSG',
  ranges: [
    { id: '1d', label: '1D' },
    { id: '1w', label: '1W' },
    { id: '1m', label: '1M' },
    { id: '3m', label: '3M' },
    { id: '1y', label: '1Y' },
    { id: 'all', label: 'ALL' },
  ],
  activeRange: '3m',
  changeLabel: '+4.82% QTD',
  changeTrend: 'up',
  points: [
    { x: 0.0, value: 7036 },
    { x: 0.17, value: 7120 },
    { x: 0.34, value: 7320 },
    { x: 0.5, value: 7280 },
    { x: 0.68, value: 7515 },
    { x: 0.85, value: 7680 },
    { x: 1.0, value: 7720 },
  ],
  macroPills: [
    { label: 'BI Rate 6.00%', trend: 'up' },
    { label: 'Q2 GDP +5.05%', trend: 'up' },
  ],
  milestones: [
    { label: '01 Jun' },
    { label: '01 Jul' },
    { label: '01 Aug' },
    { label: 'Today', highlight: true },
  ],
};

export const archetypes: Archetype[] = [
  {
    id: 'attractive-valuation',
    title: 'Attractive Valuation',
    description:
      'Discounted PER & PBV trading below 5Y historical sector medians with positive FCF.',
    companyCount: 34,
    metricLabel: 'Avg PER 7.2x',
    topTickers: ['ASII', 'INDF', 'PGAS'],
    pillClasses: ['bg-primary-container/15', 'text-primary'],
  },
  {
    id: 'strong-profitability',
    title: 'Strong Profitability',
    description:
      'Exceptional capital productivity. ROE consistently exceeding 18% and ROA above 8%.',
    companyCount: 28,
    metricLabel: 'ROE > 18%',
    topTickers: ['BBCA', 'UNVR', 'ICBP'],
    pillClasses: ['bg-tertiary/15', 'text-tertiary'],
  },
  {
    id: 'healthy-balance-sheet',
    title: 'Healthy Balance Sheet',
    description:
      'Net cash or low gearing with ICR > 8x, resilient against macro interest rate shocks.',
    companyCount: 52,
    metricLabel: 'DER < 0.4x',
    topTickers: ['CPIN', 'KLBF', 'MYOR'],
    pillClasses: ['bg-secondary-container/20', 'text-secondary'],
  },
  {
    id: 'dividend-aristocrats',
    title: 'Dividend Aristocrats',
    description:
      'Sustainable dividend yield over 6.5% backed by healthy payout ratio (35%-70%).',
    companyCount: 19,
    metricLabel: 'Yield > 6.5%',
    topTickers: ['ITMG', 'PTBA', 'BJBR'],
    pillClasses: ['bg-tertiary-fixed/15', 'text-tertiary'],
  },
];

export const watchlist: WatchlistItem[] = [
  {
    ticker: 'BBCA',
    sector: 'Fin',
    per: '23.4x',
    pbv: '4.7x',
    price: 'Rp 10,650',
    changePercent: '+1.19%',
    trend: 'up',
  },
  {
    ticker: 'BBRI',
    sector: 'Fin',
    per: '11.2x',
    pbv: '2.1x',
    price: 'Rp 4,820',
    changePercent: '-0.62%',
    trend: 'down',
  },
  {
    ticker: 'TLKM',
    sector: 'Telco',
    per: '12.8x',
    pbv: '2.3x',
    price: 'Rp 2,980',
    changePercent: '+0.34%',
    trend: 'up',
  },
  {
    ticker: 'ASII',
    sector: 'Conglom',
    per: '6.8x',
    pbv: '1.05x',
    price: 'Rp 5,175',
    changePercent: '+1.47%',
    trend: 'up',
    highlightPer: true,
  },
];
