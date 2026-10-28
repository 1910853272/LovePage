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
  boy: '李增圣',
  girl: '曾莎薇',
  loveDate: '2025-01-01',
  marriageDate: '',
  siteUrl: 'https://1910853272.github.io/LovePage/',
  siteName: '李增圣 ♥ 曾莎薇',
  siteLocale: 'zh-CN',
  defaultTheme: 'light',
  seoDescription: '李增圣与曾莎薇的故事：2024年8月8日初见，2025年1月1日相恋。记录广州、北京、武汉、长沙与洛阳的城市足迹。',
  siteImage: '/images/share-cover.png',
  siteLogo: '/images/icon-512.png',
  motto: '把平凡的日子，写成我们的故事',
  quotes: ['把平凡的日子，写成我们的故事', '愿每一次回首，都有你在身旁', '慢慢走，把每一天都过成纪念日'],
  secretMessage: '从初见到相恋，故事仍在继续。♥',
  milestones: [
    { date: '2024-08-08', label: '初见', icon: '🌷' },
    { date: '2025-01-01', label: '相恋', icon: '💕' },
    { date: '2025-02', label: '广州', icon: '📍' },
    { date: '2025-05-01', label: '广州', icon: '📍' },
    { date: '2025-07', label: '北京', icon: '📍' },
    { date: '2025-10-01', label: '武汉', icon: '📍' },
    { date: '2026-02', label: '长沙', icon: '📍' },
    { date: '2026-05-01', label: '洛阳', icon: '📍' },
    { date: '2026-10-01', label: '广州', icon: '📍' },
  ],
  photos: [
    { url: '/images/guangzhou-2025-05-01.jpg', caption: '广州 · 2025.05.01' },
    { url: '/images/beijing-2025-07.jpg', caption: '北京 · 2025.07' },
    { url: '/images/luoyang-2026-05-01-day.jpg', caption: '洛阳 · 2026.05.01' },
    { url: '/images/luoyang-2026-05-01-night.jpg', caption: '洛阳 · 2026.05.01 · 夜色' },
  ],
  memories: {
    title: '我们的回忆',
    hint: '把一起走过的日子，留在照片里',
    viewAllLabel: '查看全部照片',
  },
  sectionOrder: ['todaySummary', 'memories', 'timers', 'timeline', 'anniversary'],
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
    { label: '走过的城市', value: 5, icon: '🏙️' },
    { label: '城市足迹', value: 7, icon: '📍' },
    { label: '时光节点', value: 9, icon: '🗓️' },
  ],
  wishes: [],
  sections: { wishes: false, stats: false, memories: true },
  music: {
    ...DEFAULT_CONFIG.music,
    enabled: true,
    autoPlay: true,
    startOnInteraction: true,
    playMode: 'single',
    allowModeSwitch: false,
    volume: 0.5,
    tracks: [{ id: 'dong-feng-po', src: '/music/dong-feng-po.mp3', title: '东风破' }],
  },
  passwordConfig: { ...DEFAULT_CONFIG.passwordConfig!, enabled: false, password: '' },
  privacy: { privateMode: true, noIndex: true },
  googleAnalyticsId: '',
  welcomeMessage: '欢迎来到李增圣与曾莎薇的时光记录 ♥',
};

const RAW_CONFIG: Config = deepMerge(deepMerge(DEFAULT_CONFIG, PERSONAL_CONFIG), ENV_CONFIG_PATCH);

if (RAW_CONFIG.passwordConfig?.enabled && RAW_CONFIG.passwordConfig.password) {
  RAW_CONFIG.passwordConfig.password = protectPassword(RAW_CONFIG.passwordConfig.password);
}

export const CONFIG: Config = RAW_CONFIG;
