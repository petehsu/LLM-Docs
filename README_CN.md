<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs-site/logos/llmdocs-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="docs-site/logos/llmdocs-logo-light.svg">
    <img src="docs-site/logos/llmdocs-logo-light.svg" alt="LLM Docs" width="80" height="80">
  </picture>
</p>

<h1 align="center">大模型 API 文档收集</h1>

<p align="center">
  <strong>聚合 10 家主流大模型厂商的 API 文档</strong>
</p>

<p align="center">
  <a href="README.md">English</a> •
  <a href="README_CN.md">简体中文</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/文档-1600+-blue" alt="Docs">
  <img src="https://img.shields.io/badge/厂商-10-green" alt="Vendors">
  <img src="https://img.shields.io/badge/语言-12-orange" alt="Languages">
  <img src="https://img.shields.io/badge/协议-MIT-brightgreen" alt="License">
</p>

---

## ✨ 功能特性

- 📚 **1600+ 文档** - 收录主流大模型厂商的完整 API 文档
- 🌍 **多语言支持** - 支持 12 种语言，包括中文、英文、日文、韩文等
- 🔍 **全文搜索** - 跨所有文档即时搜索
- 🤖 **MCP 集成** - 通过 Model Context Protocol 让 AI 助手读取所有文档
- 🎨 **现代界面** - 简洁响应式设计，支持深色/浅色主题
- 📦 **批量下载** - 支持打包下载所有文档

## 📋 支持的厂商

| 厂商 | 文档数 | 语言 | 爬取方式 |
|------|--------|------|----------|
| OpenAI | 51 | 英文 | 手动 |
| Anthropic Claude | 963 | 12 种语言 | 自动 |
| Google Gemini | 67 | 中文 | 自动 |
| Meta Llama | 22 | 英文 | 手动 |
| xAI Grok | 59 | 英文 | 自动 |
| Moonshot Kimi | 72 | 中文、英文 | 手动 |
| 智谱 BigModel | 242 | 中文、英文 | 混合 |
| MiniMax | 84 | 中文、英文 | 自动 |
| MegaLLM | 120 | 英文、中文、俄文 | 自动 |
| DeepSeek | 61 | 中文、英文 | 手动 |

## 🚀 快速开始

### 查看文档网站

```bash
# 构建文档索引
python3 build_docs_site.py

# 启动本地服务器
cd docs-site && python3 -m http.server 8080

# 在浏览器中打开 http://localhost:8080
```

### 下载文档

```bash
# 安装依赖
pip install requests

# 运行批量下载
python3 batch_download_docs.py
```

### MCP 服务器集成

```bash
# 安装 MCP SDK
pip install mcp

# 添加到你的 MCP 客户端配置
```

```json
{
  "mcpServers": {
    "llm-docs": {
      "command": "python3",
      "args": ["mcp_server.py"],
      "disabled": false
    }
  }
}
```

## 📁 项目结构

```
├── docs-site/              # 静态文档网站
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── logos/              # 厂商 Logo
├── OpenAI/                 # OpenAI 文档
├── Anthropic Claude/       # Claude 文档（12 种语言）
├── Google Gemini/          # Gemini 文档
├── Meta Llama/             # Llama 文档
├── X Grok/                 # Grok 文档
├── Moonshot Kimi/          # Kimi 文档
├── BigModel Zhipu/         # 智谱文档
├── MiniMax/                # MiniMax 文档
├── MegaLLM/                # MegaLLM 文档
├── DeepSeek/               # DeepSeek 文档
├── mcp_server.py           # MCP 服务器
├── build_docs_site.py      # 网站构建脚本
└── download_*.py           # 爬虫脚本
```

---

## 📖 技术文档

### Google Gemini

**URL 规律**: `https://ai.google.dev/gemini-api/docs/{path}.md.txt?hl=zh-cn`

**发现**:
- Google 文档支持 `.md.txt` 后缀获取 Markdown 格式
- 通过 `?hl=zh-cn` 参数获取中文版本
- 从 HTML 页面侧边栏爬取到 70 个文档链接
- 下载的内容开头可能有 `<br />` 标签，需要清理
- **多语言方式**: 机器翻译（Google Cloud Translation API），页面标注 "translated by Google"，只需下载一种语言即可

**下载结果**: 67/70 成功（3 个 404：nanobanana, pricing, partner-integration）

**目录结构**:
```
Google Gemini/docs/
├── 01-开始使用/     (5个)
├── 02-模型/         (8个)
├── 03-核心功能/     (12个)
├── 04-工具和代理/   (8个)
├── 05-Live API/     (5个)
├── 06-指南/         (15个)
├── 07-资源/         (12个)
└── 08-政策/         (2个)
```

---

### Anthropic Claude

**URL 规律**: `https://platform.claude.com/docs/{locale}/{path}.md`

**发现**:
- Claude 文档是 Next.js 应用，支持 `.md` 后缀获取 Markdown
- 支持 12 种语言：en, de, es, fr, it, ja, ko, pt-BR, ru, zh-CN, zh-TW, id
- ⚠️ **重要**: 语言代码**大小写敏感**！`zh-CN` 正确，`zh-cn` 返回 HTML 404 页面
- 从 HTML 页面提取到 85 个文档链接
- 返回的 Markdown 内容混有一些 JSX 组件标签（如 `<DocsSearchBar />`）
- **多语言方式**: 原生多语言，每种语言独立维护，内容可能有差异，建议全部下载

**下载结果**: 963 个文档（部分语言文档数量略少，如 Français 84、Italiano 30）

**目录结构**:
```
Anthropic Claude/
├── English/
│   ├── home.md
│   ├── about-claude/
│   │   ├── models/
│   │   ├── pricing.md
│   │   └── model-deprecations.md
│   ├── build-with-claude/
│   │   ├── prompt-engineering/
│   │   └── ...
│   ├── agents-and-tools/
│   ├── agent-sdk/
│   ├── test-and-evaluate/
│   └── release-notes/
├── 简体中文/
├── 日本語/
└── ... (其他语言)
```

---

### Moonshot Kimi

**URL 规律**: `https://platform.moonshot.cn/docs/{path}` (中文) / `https://platform.moonshot.cn/en-US/docs/{path}` (英文)

**发现**:
- Moonshot 是 Next.js SPA 应用，内容由 JavaScript 动态渲染，无法直接获取 Markdown
- 需要使用 Playwright 渲染页面后提取内容，再用 markdownify 转换为 Markdown
- 支持 2 种语言：zh-CN（简体中文）、en-US（English）
- 使用 Nextra 文档框架，HTML 结构规范，转换效果好
- **多语言方式**: 原生多语言，中英文独立维护

**下载结果**: 36 页 × 2 语言 = 72 个文档

**依赖**: `pip install playwright markdownify && playwright install chromium`

---

### X Grok

**URL 规律**: `https://docs.x.ai/llms{path}.md`

**发现**:
- 文档列表可从 `https://docs.x.ai/llms.txt` 获取
- 需要设置 User-Agent 和 Referer 请求头，否则返回 403
- 返回的 Markdown 开头有 `===/docs/xxx===` 标记，需要清理
- **多语言方式**: 仅英文，无多语言支持

**下载结果**: 59 个文档

---

### OpenAI

**URL 规律**: 无直接 Markdown 端点，需要渲染页面后提取

**发现**:
- OpenAI 文档是 SPA 应用，有 Cloudflare 机器人防护
- 官方有 "Copy page" 按钮可复制 Markdown，但无法直接请求获取
- 需要使用 `undetected-chromedriver` 绕过机器人检测
- **多语言方式**: 仅英文，无多语言支持

**下载结果**: 51/54 成功（3 个模型页面失败）

**依赖**: `pip install undetected-chromedriver selenium markdownify`

---

### 智谱 BigModel

智谱有两个文档站点，内容不同：

#### 中文站 (docs.bigmodel.cn) - Mintlify 框架

**URL 规律**: `https://docs.bigmodel.cn/cn/{section}/{path}.md`

- 使用 Mintlify 文档框架，支持 `.md` 后缀直接获取 Markdown
- **下载结果**: 129 个文档

#### 英文站 (open.bigmodel.cn) - Vue SPA

- Vue SPA 应用，内容由 JavaScript 动态渲染
- 需要使用 Playwright 渲染页面
- **下载结果**: 113 个文档

**依赖**: `pip install playwright markdownify && playwright install chromium`

---

### MiniMax

**URL 规律**: 
- 英文站: `https://platform.minimax.io/docs/{path}.md`
- 中文站: `https://platform.minimaxi.com/docs/{path}.md`

**发现**:
- 使用 Mintlify 文档框架，支持 `.md` 后缀直接获取 Markdown
- 中英文是两个独立站点，域名不同（minimax.io vs minimaxi.com）

**下载结果**: 英文 37 + 中文 47 = 84 个文档

---

### Meta Llama

**URL 规律**: 无直接 Markdown 端点，需要渲染页面后提取

**发现**:
- React SPA 应用（Facebook 风格），内容由 JavaScript 动态渲染
- 需要使用 Playwright 渲染页面

**下载结果**: 22 个文档

**依赖**: `pip install playwright markdownify && playwright install chromium`

---

### MegaLLM

**URL 规律**: `https://docs.megallm.io/{lang}/{path}.md`

**发现**:
- 提供 `llms.txt` 文件包含完整文档列表：`https://docs.megallm.io/llms.txt`
- 支持 `.md` 后缀直接获取 Markdown
- 聚合平台，连接 70+ 个大模型，统一 API
- **多语言方式**: 支持 3 种语言：en（英文）、cn（中文）、ru（俄文）

**下载结果**: 40 × 3 = 120 个文档

---

### DeepSeek

**URL 规律**: `https://api-docs.deepseek.com/{path}` (英文) / `https://api-docs.deepseek.com/zh-cn/{path}` (中文)

**发现**:
- 使用 Docusaurus 文档框架
- 需要使用 Selenium 渲染页面

**下载结果**: 61 个文档（英文 31 + 中文 30）

**依赖**: `pip install selenium html2text`

---

## 🛠️ 依赖说明

| 脚本 | 依赖 |
|------|------|
| 基础爬虫 | `requests` |
| Moonshot、Meta、智谱英文站 | `playwright markdownify` |
| OpenAI | `undetected-chromedriver selenium markdownify` |
| DeepSeek | `selenium html2text` |

## 📝 文件说明

| 文件 | 说明 |
|------|------|
| `batch_download_docs.py` | Gemini + Claude 下载脚本 |
| `download_moonshot.py` | Moonshot 下载脚本 |
| `download_grok.py` | X Grok 下载脚本 |
| `download_openai_uc.py` | OpenAI 下载脚本 |
| `download_zhipu.py` | 智谱中文站下载脚本 |
| `download_zhipu_en.py` | 智谱英文站下载脚本 |
| `download_minimax.py` | MiniMax 下载脚本 |
| `download_meta.py` | Meta Llama 下载脚本 |
| `download_megallm.py` | MegaLLM 下载脚本 |
| `download_deepseek.py` | DeepSeek 下载脚本 |
| `build_docs_site.py` | 文档网站构建脚本 |
| `mcp_server.py` | MCP 服务器 |

---

## 🌐 文档网站

项目包含一个静态文档网站，位于 `docs-site/` 目录：

```bash
python3 build_docs_site.py
cd docs-site && python3 -m http.server 8080
```

功能特性:
- 聚合 10 家大模型厂商文档
- 多语言文档标签页
- 网站语言切换（英文/中文/日文）
- 深色/浅色主题切换
- 代码块复制按钮
- 侧边栏分类导航
- 现代响应式设计

---

## 🤖 MCP 服务器

### 可用工具

| 工具 | 说明 |
|------|------|
| `list_vendors` | 列出所有厂商及文档数量 |
| `list_docs` | 列出指定厂商的所有文档 |
| `read_doc` | 读取文档完整内容 |
| `search_docs` | 跨所有文档搜索 |
| `get_doc_stats` | 获取文档统计信息 |

### 配置

```json
{
  "mcpServers": {
    "llm-docs": {
      "command": "python3",
      "args": ["mcp_server.py"],
      "disabled": false,
      "autoApprove": ["list_vendors", "list_docs", "read_doc", "search_docs", "get_doc_stats"]
    }
  }
}
```

### 资源 URI

- `llmdocs://openai` - 获取 OpenAI 厂商信息和文档列表
- `llmdocs://anthropic/en/about-claude/pricing.md` - 读取指定文档

---

## 🤝 贡献指南

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件。

## ⚠️ 免责声明

本项目仅供**学习和研究目的**使用。

- 所有文档内容的版权归其各自所有者（OpenAI、Anthropic、Google、Meta、xAI、Moonshot、智谱、MiniMax、MegaLLM、DeepSeek）所有
- 本项目不声称对任何文档内容拥有所有权
- 爬取的文档仅供个人学习和开发参考使用
- 请遵守各平台的服务条款
- 未经适当授权，请勿将本项目用于商业目的
- 维护者不对本项目的任何滥用行为负责

**如果您是任何被收录平台的代表，对本项目有任何疑虑，请提交 Issue，我们会及时处理。**

## 🙏 致谢

- 感谢所有大模型厂商提供的优秀文档
- 用 ❤️ 为开发者社区构建
