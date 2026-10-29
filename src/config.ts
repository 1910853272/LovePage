/**
 * Love Page — 配置入口
 *
 * 说明：
 * - 类型定义位于 ./config/types.ts
 * - 默认配置位于 ./config/defaults.ts
 * - 合并与环境变量解析位于 ./config/merge.ts
 * - 业务解析函数位于 ./config/resolvers.ts
 */

import { DEFAULT_CONFIG } from './config/defaults';
import album from './config/album.json';
import { deepMerge, parseEnvConfigPatch } from './config/merge';
import { type Config } from './config/types';
import { encryptPassword, isEncryptedPassword } from './passwordCipher';

export type {
  AnniversaryEasterEggTemplates,
  AnniversaryMark,
  Config,
  ConfigPatch,
  Milestone,
  MusicConfig,
  MusicPlayMode,
  MusicStartPolicy,
  MusicTrack,
  PasswordBruteForceProtectionConfig,
  PasswordConfig,
  PrivacyConfig,
  Photo,
  SectionKey,
  StartupImage,
  StatItem,
  StatsMode,
  TimeMark,
  WishItem,
} from './config/types';

export {
  resolveAnniversaries,
  resolveIosStartupImages,
  resolveMotto,
  resolveMusic,
  resolvePrivacySettings,
  resolveQuotes,
  resolveSectionOrder,
  resolveSiteImage,
  resolveSiteLogo,
  resolveStatsMode,
  resolveTimers,
} from './config/resolvers';

function protectPassword(password: string): string {
  if (!password) return '';
  if (isEncryptedPassword(password)) return password;
  return encryptPassword(password);
}

const ENV_CONFIG_PATCH = parseEnvConfigPatch(import.meta.env.VITE_LOVE_CONFIG_JSON);

// 专属内容统一在这里替换；环境变量仍可覆盖以下设置。
// 姓名、日期与照片由本人提供；月份记录保留原始精度。
const PERSONAL_CONFIG: Partial<Config> = {
  demoMode: false,
  repositoryUrl: 'https://github.com/1910853272/LovePage',
  boy: 'Mr Li',
  girl: 'Mrs Zeng',
  loveDate: '2025-01-01',
  marriageDate: '',
  siteUrl: 'https://1910853272.github.io/LovePage/',
  siteName: 'Mr Li ♥ Mrs Zeng',
  siteLocale: 'zh-CN',
  defaultTheme: 'light',
  seoDescription: 'Mr Li 与 Mrs Zeng 的故事：2024年8月8日初见，2025年1月1日相恋。记录萍乡、北京、广州、秦皇岛、天津、武汉、长沙与洛阳的回忆。',
  siteImage: '/images/share-cover.png',
  siteLogo: '/images/icon-512.png',
  motto: '其实我并不讨厌等待的感觉',
  quotes: ['其实我并不讨厌等待的感觉', '因为你等的时间越久', '见面的时候就越开心啊'],
  secretMessage: '从初见到相恋，故事仍在继续。♥',
  milestones: album.milestones,
  photos: album.photos,
  memories: {
    title: '我们的回忆',
    hint: '把一起走过的日子，留在照片里',
    viewAllLabel: '查看全部照片',
    featuredUrls: album.featuredUrls,
  },
  sectionOrder: ['todaySummary', 'memories', 'timers', 'timeline', 'anniversary', 'wishes'],
  timers: [
    { date: '2024-08-08', label: '从初见到现在', icon: '🌷' },
    { date: '2025-01-01', label: '相恋时光', icon: '💕' },
  ],
  anniversaries: [
    { date: '2024-08-08', label: '初见纪念日', icon: '🌷' },
    { date: '2025-01-01', label: '相恋纪念日', icon: '💕' },
  ],
  includeDefaultAnniversaries: false,
  statsMode: 'manual',
  statsShowVisitCount: false,
  stats: [
    { label: '走过的城市', value: 8, icon: '🏙️' },
    { label: '城市足迹', value: 9, icon: '📍' },
    { label: '时光节点', value: 11, icon: '🗓️' },
  ],
  wishes: DEFAULT_CONFIG.wishes!.map((wish) => ({ ...wish, done: false })),
  sections: { wishes: true, stats: false, memories: true },
  music: {
    ...DEFAULT_CONFIG.music,
    enabled: true,
    autoPlay: true,
    startOnInteraction: false,
    startPolicy: 'first',
    rememberState: false,
    playMode: 'single',
    allowModeSwitch: false,
    volume: 0.5,
    tracks: [{ id: 'dong-feng-po', src: '/music/dong-feng-po.m4a', title: '东风破' }],
  },
  passwordConfig: { ...DEFAULT_CONFIG.passwordConfig!, enabled: false, password: '' },
  privacy: { privateMode: true, noIndex: true },
  googleAnalyticsId: '',
  welcomeMessage: '欢迎来到 Mr Li 与 Mrs Zeng 的时光记录 ♥',
};

const RAW_CONFIG: Config = deepMerge(deepMerge(DEFAULT_CONFIG, PERSONAL_CONFIG), ENV_CONFIG_PATCH);

if (RAW_CONFIG.passwordConfig?.enabled && RAW_CONFIG.passwordConfig.password) {
  RAW_CONFIG.passwordConfig.password = protectPassword(RAW_CONFIG.passwordConfig.password);
}

export const CONFIG: Config = RAW_CONFIG;
