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
// 日期、故事、数量均为演示数据。素材齐全后替换本段并关闭 demoMode。
const PERSONAL_CONFIG: Partial<Config> = {
  demoMode: true,
  demoNotice: '示例演示，内容待替换',
  repositoryUrl: 'https://github.com/1910853272/LovePage',
  boy: '你的名字',
  girl: 'TA的名字',
  loveDate: '2024-05-20',
  marriageDate: '2025-05-20',
  siteUrl: 'https://1910853272.github.io/LovePage/',
  siteName: 'LovePage · 示例版',
  siteLocale: 'zh-CN',
  seoDescription: 'LovePage 示例演示。名字、日期、故事与图片均为占位内容，等待替换为我们的回忆。',
  siteImage: '/images/share-cover.png',
  siteLogo: '/images/icon-512.png',
  motto: '把平凡的日子，写成我们的故事',
  quotes: ['把平凡的日子，写成我们的故事', '愿每一次回首，都有你在身旁', '慢慢走，把每一天都过成纪念日'],
  secretMessage: '这里会放上只属于你们的一句话。此刻的照片、日期和故事都是示例。♥',
  milestones: [
    { date: '2024-03-14', label: '初见 · 示例', icon: '🌷', story: '故事从一次相遇开始。这里会记录你们第一次见面的那一天。' },
    { date: '2024-05-20', label: '相恋 · 示例', icon: '💕', story: '把那句心意说出口，从此多了一个可以分享日常的人。请替换为你们的真实故事。' },
    { date: '2024-10-01', label: '旅行 · 示例', icon: '✈️', story: '一起走过的风景，都会成为回忆。这里等待你们的照片和旅途故事。' },
    { date: '2025-05-20', label: '约定 · 示例', icon: '💍', story: '未来还有很多值得纪念的日子，留给你们慢慢书写。' },
  ],
  photos: [
    { url: '/images/memory-01.svg', caption: '初见 · 待放入你们的照片' },
    { url: '/images/memory-02.svg', caption: '相伴 · 待放入你们的照片' },
    { url: '/images/memory-03.svg', caption: '远行 · 待放入你们的照片' },
  ],
  timers: [
    { date: '2024-05-20', label: '相恋时光（示例）', icon: '💕' },
    { date: '2025-05-20', label: '婚姻时光（示例）', icon: '💍' },
  ],
  anniversaries: [
    { date: '2024-05-20', label: '相恋（示例）', icon: '💕' },
    { date: '2025-05-20', label: '约定（示例）', icon: '💍' },
  ],
  includeDefaultAnniversaries: false,
  statsMode: 'manual',
  statsShowVisitCount: false,
  stats: [
    { label: '示例旅行', value: 3, icon: '✈️' },
    { label: '示例回忆', value: 4, icon: '📷' },
    { label: '示例纪念日', value: 2, icon: '💕' },
  ],
  wishes: [
    { text: '示例：一起去看一场日出', done: false },
    { text: '示例：把相遇的故事写下来', done: true },
    { text: '示例：每年留下一张合影', done: false },
  ],
  music: { ...DEFAULT_CONFIG.music, enabled: false, autoPlay: false, tracks: [] },
  passwordConfig: { ...DEFAULT_CONFIG.passwordConfig!, enabled: false, password: '' },
  privacy: { privateMode: true, noIndex: true },
  googleAnalyticsId: '',
  welcomeMessage: '欢迎预览 LovePage，当前内容均为示例 ♥',
};

const RAW_CONFIG: Config = deepMerge(deepMerge(DEFAULT_CONFIG, PERSONAL_CONFIG), ENV_CONFIG_PATCH);

if (RAW_CONFIG.passwordConfig?.enabled && RAW_CONFIG.passwordConfig.password) {
  RAW_CONFIG.passwordConfig.password = protectPassword(RAW_CONFIG.passwordConfig.password);
}

export const CONFIG: Config = RAW_CONFIG;
