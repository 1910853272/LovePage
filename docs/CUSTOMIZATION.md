# LovePage 个性化与发布

展示地址：https://1910853272.github.io/LovePage/

## 替换内容

修改 `src/config.ts` 中的 `PERSONAL_CONFIG`，保留通用默认值与环境覆盖机制。优先级为：通用默认配置 → 专属配置 → `VITE_LOVE_CONFIG_JSON`。数组整组替换；可继续使用 GitHub Actions 的可选 `LOVE_CONFIG_JSON` Secret。

当前姓名、日期、城市足迹与照片均为本人提供的信息；未婚，不展示婚姻时长。时间线以本地 `Photo/` 的日期文件夹为准，初见和相恋计时仍由本人确认的日期决定。`demoMode` 已关闭。按本人要求保留“愿望清单”，放在纪念日下方，恢复原项目三条愿望并均默认待完成；可在 `wishes` 中替换内容。点击完成状态仅保存在当前浏览器，不在访客之间同步。后续故事内容收到后替换。

“我们的回忆”展示 `memories.featuredUrls` 指定的 4 张照片，点击使用完整相册中的真实索引打开；完整照片墙展示 58 张照片并按 11 个日期事件分组。`memories` 配置标题、提示和查看全部按钮文案，`sections.memories` 控制显隐，`sectionOrder` 中用 `memories` 控制位置。手机横向滑动卡片，桌面四列。照片墙需保持开启以提供共享大图预览。

本地新增照片后运行 `npm run import:photos`，读取 `Photo/YYYY.M.D事件/`，生成 `public/images/album/` 中 WebP 大图及缩略图和 `src/config/album.json`。导入保留图片比例、纠正 EXIF 朝向，去掉发布副本的元数据，不改原图。首页四张来源路径在 `scripts/import-photos.mjs` 的 `selected` 中指定。重新导入成功后只清理专属输出目录中已不在新清单的生成图；原始 `Photo/` 不上传仓库，CI 使用已生成的清单和资源构建。

照片放在 `public/images/`，配置中使用 `/images/文件名.jpg`，并添加照片说明。程序会自动补齐 `/LovePage/`。推荐使用压缩后的 JPG/WebP；占位插画可在正式替换后移除。分享封面为 `public/images/share-cover.png`（1200×630），主屏幕图标为 `public/images/icon-512.png`（512×512）。

音乐接入《东风破》，发布地址 `/music/dong-feng-po.m4a`，使用 AAC 64kbps 和 faststart，从原 MP3 约 5.05MB 缩至 2.59MB；原始素材 `music/` 保留且不上传。当前设置 `autoPlay: true`、`startOnInteraction: false`，页面首帧后尝试播放；若被浏览器拦截，首次真实点击页面时重试。手动暂停后其他点击不恢复。默认单曲循环、音量 50%，关闭播放模式切换。音乐面板默认显示在“今日摘要”上方，面板及音乐图标均可暂停或继续。

默认浅色主题，首屏与 manifest 同步设置浅色背景；主题存储使用新的偏好键，后续仍记住用户主动切换的主题。电脑端4个次要图标右下角竖排，正文两侧预留相同空间保持居中；手机端（640px及以下）图标放回姓名和文案下方，横排且参与正常布局，正文恢复对称16px边距。页脚文字不显示，原项目来源与许可证保留在源码及 README。手机大图翻页按钮在照片下方，避免遮挡。

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
