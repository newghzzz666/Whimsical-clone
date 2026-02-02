# Whimsical Clone - 协作无限画布

一个功能丰富的协作式思维导图和笔记应用，灵感来自 Whimsical。支持无限画布、自动保存、AI 内容生成和云存储。

![构建状态](https://img.shields.io/badge/build-passing-brightgreen)
![许可证](https://img.shields.io/badge/license-MIT-blue)
![版本](https://img.shields.io/badge/version-1.0.0-blue)

## 功能特性

- 🎨 **无限画布** - 可拖拽移动、缩放的无限工作空间
- 📝 **富文本笔记** - 创建、编辑、删除和调整笔记大小
- 🔗 **连接关系** - 在笔记之间创建有向连接，表示关系
- ✨ **AI 助手** - 使用 AI 快速生成和优化内容
- ☁️ **云端同步** - 使用 Cloudflare R2 存储保存数据
- 💾 **自动保存** - 定时自动保存到本地存储
- 📊 **多色笔记** - 5 种颜色的笔记卡片
- 🎯 **缩放控制** - 灵活的缩放功能（30% - 300%）
- 📥 **PDF 导出** - 将画布导出为高质量 PDF
- 🎨 **深色/浅色主题** - Tailwind CSS 驱动的响应式设计

## 技术栈

### 前端
- **React 18** - UI 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 新一代构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **html2canvas** - 画布截图
- **jsPDF** - PDF 生成

### 后端 / 部署
- **Cloudflare Workers** - 无服务器计算
- **Cloudflare R2** - 对象存储
- **Wrangler** - Cloudflare Workers CLI

## 快速开始

### 前置要求

- Node.js 16+ 和 npm / yarn
- Cloudflare 账户（用于部署）

### 安装

1. **克隆仓库**
```bash
git clone https://github.com/newghzzz666/Whimsical-clone.git
cd Whimsical-clone
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

访问 `http://localhost:5173` 即可在浏览器中查看应用。

## 使用指南

### 基础操作

#### 创建笔记
1. 点击底部工具栏的彩色圆形按钮创建笔记
2. 笔记会在视口中心创建，可以立即开始输入

#### 编辑笔记
- **输入文本** - 点击笔记卡片，在文本框中输入内容
- **移动笔记** - 点击并拖拽笔记卡片移动位置
- **调整大小** - 拖动笔记右下角的调整手柄改变大小
- **改变层级** - 点击笔记时自动将其置于最前

#### 删除笔记
- 点击笔记右上角的 ✕ 按钮删除

#### 创建连接
1. 点击源笔记右上角的 🔗 按钮，进入链接模式
2. 点击目标笔记完成连接
3. 点击连接中点的圆形按钮可以删除连接

#### 缩放画布
- 点击工具栏的 **−** 和 **+** 按钮调整缩放级别（30% - 300%）
- 显示当前缩放百分比

#### AI 内容生成
1. 点击笔记右上角的 ✨ 按钮
2. 在 AI Modal 中输入提示语
3. AI 将根据当前笔记内容和其他笔记上下文生成新内容
4. 预览生成的内容后点击 **Apply Content** 应用

#### 导出 PDF
- 点击工具栏的 **📄 PDF** 按钮
- 自动生成包含所有笔记的 PDF 文件并下载

#### 数据同步到 R2
1. 点击工具栏的 **⚙️** 按钮打开设置
2. 配置 Cloudflare R2 凭证：
   - R2 Account ID
   - R2 Access Key ID
   - R2 Secret Access Key
   - R2 Bucket Name
   - R2 Endpoint
3. 点击工具栏的 **☁️ Sync** 按钮同步数据

### 键盘快捷键

| 操作 | 快捷键 |
|-----|--------|
| 创建笔记 | 点击工具栏按钮 |
| 删除笔记 | 点击 ✕ 按钮 |
| 取消选择 | 点击空白画布 |

## 部署到 Cloudflare

### 前置要求

1. **Cloudflare 账户** - [注册](https://dash.cloudflare.com/sign-up)
2. **Wrangler CLI** - 已通过 npm 安装
3. **R2 Bucket** - 用于存储数据
4. **API Token** - 用于 Wrangler 认证

### 步骤 1: 配置 Wrangler

1. **登录 Cloudflare**
```bash
wrangler login
```
浏览器会打开 Cloudflare 仪表板，授权 Wrangler 访问权限。

2. **更新 wrangler.toml**
```toml
name = "whimsical-clone"
account_id = "YOUR_ACCOUNT_ID"  # 从 Cloudflare 仪表板获取
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.production]
route = "your-domain.com/*"     # 替换为您的域名
zone_name = "your-domain.com"
```

### 步骤 2: 创建 R2 Bucket

1. 登录 [Cloudflare 仪表板](https://dash.cloudflare.com/)
2. 进入 **R2** 部分
3. 点击 **Create bucket** 创建新 bucket
4. 命名为 `whimsical-clone-data`（或其他名称）
5. 记下 Endpoint URL

### 步骤 3: 生成 R2 API Token

1. 在 R2 页面，点击右上角的 **Manage API tokens**
2. 点击 **Create API token**
3. 选择以下权限：
   - Object Read
   - Object Write
   - List Buckets
4. 设置 TTL（可选）
5. 点击 **Create API Token**
6. 复制以下信息：
   - Access Key ID
   - Secret Access Key

### 步骤 4: 设置环境变量

在项目根目录创建 `.env.production.local` 文件：

```bash
VITE_API_BASE_URL=https://whimsical-clone.your-domain.com
VITE_R2_BUCKET_NAME=whimsical-clone-data
```

在 Wrangler Secrets 中添加 R2 凭证：

```bash
wrangler secret put R2_ACCOUNT_ID
wrangler secret put R2_ACCESS_KEY_ID
wrangler secret put R2_SECRET_ACCESS_KEY
wrangler secret put R2_BUCKET_NAME
wrangler secret put R2_ENDPOINT
```

### 步骤 5: 构建和部署

1. **构建前端**
```bash
npm run build
```

2. **部署到 Cloudflare Workers**
```bash
wrangler deploy
```

3. **验证部署**
访问您配置的域名或 Workers 自动分配的 URL：
```
https://whimsical-clone.<your-account>.workers.dev
```

### 步骤 6: 配置应用设置

1. 在部署的应用中打开设置（⚙️ 按钮）
2. 输入以下信息：
   - **R2 Account ID**: 从 Cloudflare 仪表板获取
   - **R2 Access Key ID**: 从 API Token 复制
   - **R2 Secret Access Key**: 从 API Token 复制
   - **R2 Bucket Name**: 您创建的 bucket 名称
   - **R2 Endpoint**: R2 bucket 的端点 URL
3. 点击 **Save** 保存设置

### 部署故障排除

| 问题 | 解决方案 |
|-----|---------|
| `wrangler not found` | 运行 `npm install -g wrangler` 或使用 `npx wrangler` |
| Authentication failed | 运行 `wrangler logout` 然后 `wrangler login` 重新认证 |
| R2 credentials invalid | 检查 API Token 是否过期，在仪表板重新生成 |
| 403 Forbidden | 确保 R2 API Token 拥有读写权限 |
| 数据同步失败 | 检查网络连接，验证 R2 bucket 名称和 endpoint 是否正确 |

## 开发

### 可用脚本

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行 ESLint 检查代码
npm run lint

# 部署到 Cloudflare Workers
npm run deploy
```

### 项目结构

```
src/
├── App.tsx                 # 主应用组件
├── main.tsx                # 应用入口
├── index.css               # 全局样式
│
├── components/             # React 组件
│   ├── Note.tsx            # 笔记卡片组件
│   ├── Toolbar.tsx         # 工具栏组件
│   ├── Connection.tsx      # 连接关系组件
│   ├── AIModal.tsx         # AI 对话模态框
│   └── SettingsModal.tsx   # 设置模态框
│
├── services/               # 业务逻辑服务
│   ├── storageService.ts   # 存储和 R2 同步
│   └── aiService.ts        # AI 内容生成
│
├── types/                  # TypeScript 类型定义
│   └── index.ts            # 共享类型
│
└── constants/              # 常量定义
    └── index.ts            # 应用常量
```

### 添加新功能

1. **新组件** - 在 `src/components/` 创建新文件
2. **新服务** - 在 `src/services/` 添加业务逻辑
3. **新类型** - 在 `src/types/index.ts` 定义类型
4. **常量** - 在 `src/constants/index.ts` 添加

## 配置说明

### Tailwind CSS

项目使用 Tailwind CSS 用于样式。配置文件：
- `tailwind.config.js` - Tailwind 主配置
- `postcss.config.cjs` - PostCSS 配置

### TypeScript

严格的 TypeScript 配置确保类型安全：
- `tsconfig.json` - 主 TypeScript 配置
- `tsconfig.node.json` - Node 脚本的 TypeScript 配置

### Vite

优化的 Vite 配置用于快速开发和生产构建：
- `vite.config.ts` - Vite 配置

## 浏览器支持

- Chrome / Chromium (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 贡献

欢迎提交 Pull Request！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 联系方式

- GitHub: [@newghzzz666](https://github.com/newghzzz666)

## 相关资源

- [Cloudflare 文档](https://developers.cloudflare.com/)
- [Cloudflare R2 指南](https://developers.cloudflare.com/r2/)
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vite 文档](https://vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

## 快速体验链接

项目配置了 GitHub Actions 自动部署到 GitHub Pages（分支 `gh-pages`）。在向 `main` 分支推送后，CI 会自动构建并将 `dist/` 发布到 GitHub Pages。

预期的体验链接（若仓库为公开且使用默认 pages 域）：

```
https://newghzzz666.github.io/Whimsical-clone/
```

注意：要触发部署请将更改推送到 `main`：

```bash
git add .
git commit -m "Enable GitHub Pages auto-deploy"
git push origin main
```

部署完成后，上述 URL 将提供一个快速在线体验页面（由 GitHub Pages 提供）。