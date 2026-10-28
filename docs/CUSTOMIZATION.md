# LovePage 个性化与发布

展示地址：https://1910853272.github.io/LovePage/

## 替换内容

修改 `src/config.ts` 中的 `PERSONAL_CONFIG`，保留通用默认值与环境覆盖机制。优先级为：通用默认配置 → 专属配置 → `VITE_LOVE_CONFIG_JSON`。数组整组替换；可继续使用 GitHub Actions 的可选 `LOVE_CONFIG_JSON` Secret。

当前姓名、初见与相恋日期、城市足迹和 4 张照片均为本人提供的信息；未婚，不展示婚姻时长。仅提供月份的足迹保留 `YYYY-MM`，不补造具体日期。`demoMode` 已关闭。后续愿望与故事等仅在收到本人内容后添加。

“我们的回忆”替换了首页数字区，复用 `photos` 的前 4 张照片；完整照片墙展示整个 `photos` 数组，点击照片可放大并切换。`memories` 配置标题、提示和查看全部按钮文案，`sections.memories` 控制显隐，`sectionOrder` 中用 `memories` 控制位置。当前手机布局为横向滑动卡片，桌面布局为四列。照片墙需保持开启以提供共享大图预览。

照片放在 `public/images/`，配置中使用 `/images/文件名.jpg`，并添加照片说明。程序会自动补齐 `/LovePage/`。推荐使用压缩后的 JPG/WebP；占位插画可在正式替换后移除。分享封面为 `public/images/share-cover.png`（1200×630），主屏幕图标为 `public/images/icon-512.png`（512×512）。

音乐可以放在 `public/music/`，配置曲目地址 `/music/文件名.mp3`，再开启 `music.enabled`；继续保持手动播放，兼容浏览器自动播放限制。未提供音乐时保持关闭。

## 本地检查与部署

```sh
npm ci
npm run test
npm run build
npm run check:dist
npm run preview
```

预览时访问 `/LovePage/`，英文页面为 `/LovePage/en-us/`。检查手机布局、照片切换、主题切换、计时与纪念卡下载。

仓库 `main` 分支推送后由 GitHub Actions 自动发布，Pages 的 Source 使用 GitHub Actions。只有测试、构建与产物检查通过后才部署。不要手动修改 `dist/`，不要设置自定义域名 CNAME。

网站和仓库公开。`noIndex` 仅表达不收录意愿，不构成访问控制。项目未启用访问密码、Google Analytics 或访问次数统计。

## 来源

本项目基于 [funnyzak/love-page](https://github.com/funnyzak/love-page) 二次开发，保留原作者署名和仓库中的 AGPL-3.0 许可证。
