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

## 🛠️ 依赖说明

| 脚本 | 依赖 |
|------|------|
| 基础爬虫 | `requests` |
| Moonshot、Meta、智谱英文站 | `playwright markdownify` |
| OpenAI | `undetected-chromedriver selenium markdownify` |
| DeepSeek | `selenium html2text` |

## 📖 详细文档

关于每个厂商的 API 文档结构和爬取方法的详细说明，请参阅项目中的完整文档。

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
