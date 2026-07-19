# 心跳之间 · GEMpick

当 G.E.M. 邓紫棋遇上世界杯：先由 10 首种子歌和用户选择的 6 首歌组成歌曲 16 强，再经过 15 次两两 Pick，一路走到决赛，得到个人排行榜和最 Pick 的歌。

这是非官方、非商业粉丝项目，与艺人本人及相关团队不存在隶属或授权关系。网站不托管音频，不展示歌词、专辑封面、艺人照片或官方 Logo，也不生成全站排名。

## 当前产品体验

- 首页直接说明“预选阶段 → 歌曲 16 强 → Pick 阶段 → 决赛”，并展示最终结果页的效果示例；
- 10 首种子歌自动入围，用户按专辑逐首选择另外 6 首；
- 选满六个自选席位后组成固定的歌曲 16 强；
- 自选席位、剩余数量、自动保存状态和继续按钮都位于页面上方；
- 生成一次稳定的 16 强对阵，刷新后不会改变；
- 每次相遇对称展示两首歌的作品线索、专辑发行背景、语言、唱片信息和资料来源；
- 第一次试听时选择 QQ 音乐、Apple Music、网易云音乐或酷狗音乐，之后全站沿用，返回后进度仍在；
- 支持自动保存、刷新恢复、撤销最近一次 Pick 和继续刚才的 Pick；
- 完成后显示“我最 Pick 的 G.E.M. 邓紫棋的歌”、立即试听、最后一次遇见、完整旅程和可保存的结果图片；
- 支持键盘方向键、移动端布局和 `prefers-reduced-motion`。

## 本地运行

需要 Node.js 20.9 或更高版本。

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

质量检查：

```bash
npm run lint
npm test
npm run build
npm audit
```

当前项目使用 Next.js 16、React 19、TypeScript、自定义 CSS 和 Vitest。生产构建采用 `output: "export"`，输出到 `out/`，不需要数据库或服务器运行时。

## GitHub Pages 部署

项目已经提供 [deploy-pages.yml](./.github/workflows/deploy-pages.yml)。推送到 GitHub 的 `main` 分支后，该流程会自动检查代码、运行测试、生成静态站点并部署至 GitHub Pages。

部署前在 GitHub 仓库的 **Settings → Pages → Build and deployment** 中将 Source 设置为 **GitHub Actions**。项目型 Pages 地址会自动使用仓库名作为子路径；如果仓库名本身以 `.github.io` 结尾，则使用根路径。自定义域名可在构建环境中将 `NEXT_PUBLIC_BASE_PATH` 设置为空字符串。

## 核心文档

- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)：当前产品规则、页面流程、技术架构和验收标准；
- [VISUAL_DESIGN.md](./VISUAL_DESIGN.md)：Purple Orbit 视觉、响应式布局和动效规则；
- [COPY_SYSTEM.md](./COPY_SYSTEM.md)：确认文案、统一词汇及文案来源；
- [outputs/文案控制表.numbers](./outputs/文案控制表.numbers)：唯一的确认文案源文件。

## 内容数据

核心数据位于 [data/gem-discography.json](./data/gem-discography.json)，截至 2026-07-19，包含 15 张专辑或 EP 的 129 个录音版本，以及补充的精选、现场、影视、公益与合作单曲索引；这些补充单曲也会进入逐首候选池。

运行时会为每个录音版本生成稳定 ID：

```text
{release-id}--{track-position}
```

不同语言、现场、混音和重录版本不会只按歌名去重。

`tracks[].description` 是本站自行整理的主题摘要，不是歌词转载。专辑简介、发行日期、语言、唱片信息和来源链接用于作品背景展示与事实核验；来源链接不等于取得素材授权。

## 快速检查

```bash
jq empty data/gem-discography.json
jq '.releases[] | {title, release_type, track_count: (.tracks | length)}' data/gem-discography.json
```

## 发布前仍需完成

- 配置真实版权联系邮箱；
- 完成手机、桌面和屏幕阅读器人工验收；
- 逐条复核 QQ 音乐、Apple Music、网易云音乐、酷狗音乐链接和资料来源；
- 发布前再次确认非官方声明、删除请求流程和内容授权边界。
