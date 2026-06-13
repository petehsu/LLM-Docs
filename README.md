<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs-site/logos/llmdocs-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="docs-site/logos/llmdocs-logo-light.svg">
    <img src="docs-site/logos/llmdocs-logo-light.svg" alt="LLM Docs" width="80" height="80">
  </picture>
</p>

<h1 align="center">LLM API Documentation Collection</h1>

<p align="center">
  <strong>Aggregated API documentation from 10 major LLM providers</strong>
</p>

<p align="center">
  <a href="README.md">English</a> •
  <a href="README_CN.md">简体中文</a>
</p>

<p align="center">
  <a href="https://petehsu.github.io/LLM-Docs/">🌐 Live Demo</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/docs-1600+-blue" alt="Docs">
  <img src="https://img.shields.io/badge/vendors-10-green" alt="Vendors">
  <img src="https://img.shields.io/badge/languages-12-orange" alt="Languages">
  <img src="https://img.shields.io/badge/license-MIT-brightgreen" alt="License">
</p>

---

## ✨ Features

- 📚 **1600+ Documents** - Comprehensive API documentation from major LLM providers
- 🌍 **Multi-language** - Support for 12 languages including English, Chinese, Japanese, Korean, etc.
- 🔍 **Full-text Search** - Search across all documentation with instant results
- 🤖 **MCP Integration** - Let AI assistants read all docs via Model Context Protocol
- 🎨 **Modern UI** - Clean, responsive design with dark/light theme
- 📦 **Batch Download** - Download all docs as ZIP files

## 📋 Supported Vendors

| Vendor | Documents | Languages | Crawl Type |
|--------|-----------|-----------|------------|
| OpenAI | 51 | English | Manual |
| Anthropic Claude | 963 | 12 languages | Auto |
| Google Gemini | 67 | Chinese | Auto |
| Meta Llama | 22 | English | Manual |
| xAI Grok | 59 | English | Auto |
| Moonshot Kimi | 72 | Chinese, English | Manual |
| Zhipu BigModel | 242 | Chinese, English | Mixed |
| MiniMax | 84 | Chinese, English | Auto |
| MegaLLM | 120 | English, Chinese, Russian | Auto |
| DeepSeek | 61 | Chinese, English | Manual |
| Xiaomi MiMo | 65 | Chinese, English | Manual |

## 🚀 Quick Start

### View Documentation Website

```bash
# Build the docs index
python3 build_docs_site.py

# Start local server
cd docs-site && python3 -m http.server 8080

# Open http://localhost:8080 in browser
```

### Download Documentation

```bash
# Install dependencies
pip install requests

# Run batch download
python3 batch_download_docs.py
```

### MCP Server Integration

```bash
# Install MCP SDK
pip install mcp

# Add to your MCP client config
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

## 📁 Project Structure

```
├── docs-site/              # Static documentation website
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── logos/              # Vendor logos
├── OpenAI/                 # OpenAI docs
├── Anthropic Claude/       # Claude docs (12 languages)
├── Google Gemini/          # Gemini docs
├── Meta Llama/             # Llama docs
├── X Grok/                 # Grok docs
├── Moonshot Kimi/          # Kimi docs
├── BigModel Zhipu/         # Zhipu docs
├── MiniMax/                # MiniMax docs
├── MegaLLM/                # MegaLLM docs
├── DeepSeek/               # DeepSeek docs
├── Xiaomi MiMo/             # MiMo docs
├── mcp_server.py           # MCP server
├── build_docs_site.py      # Site builder
└── download_*.py           # Crawler scripts
```

---

## 📖 Technical Documentation

### Google Gemini

**URL Pattern**: `https://ai.google.dev/gemini-api/docs/{path}.md.txt?hl=zh-cn`

**Findings**:
- Google docs support `.md.txt` suffix to get Markdown format
- Use `?hl=zh-cn` parameter for Chinese version
- Crawled 70 document links from HTML page sidebar
- Downloaded content may have `<br />` tags at the beginning, needs cleaning
- **Multi-language**: Machine translation (Google Cloud Translation API), pages marked "translated by Google", only need to download one language

**Download Result**: 67/70 successful (3 404s: nanobanana, pricing, partner-integration)

**Directory Structure**:
```
Google Gemini/docs/
├── 01-开始使用/     (5 docs)
├── 02-模型/         (8 docs)
├── 03-核心功能/     (12 docs)
├── 04-工具和代理/   (8 docs)
├── 05-Live API/     (5 docs)
├── 06-指南/         (15 docs)
├── 07-资源/         (12 docs)
└── 08-政策/         (2 docs)
```

---

### Anthropic Claude

**URL Pattern**: `https://platform.claude.com/docs/{locale}/{path}.md`

**Findings**:
- Claude docs is a Next.js app, supports `.md` suffix to get Markdown
- Supports 12 languages: en, de, es, fr, it, ja, ko, pt-BR, ru, zh-CN, zh-TW, id
- ⚠️ **Important**: Language codes are **case-sensitive**! `zh-CN` is correct, `zh-cn` returns HTML 404 page
- Extracted 85 document links from HTML page
- Returned Markdown contains some JSX component tags (e.g., `<DocsSearchBar />`)
- **Multi-language**: Native multi-language, each language maintained independently, content may differ, recommend downloading all

**Download Result**: 963 documents (some languages have fewer docs, e.g., Français 84, Italiano 30)

**Directory Structure**:
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
└── ... (other languages)
```

---

### Moonshot Kimi

**URL Pattern**: `https://platform.moonshot.cn/docs/{path}` (Chinese) / `https://platform.moonshot.cn/en-US/docs/{path}` (English)

**Findings**:
- Moonshot is a Next.js SPA, content rendered by JavaScript, cannot directly get Markdown
- Need to use Playwright to render page, extract content, then convert to Markdown with markdownify
- Supports 2 languages: zh-CN (Simplified Chinese), en-US (English)
- Uses Nextra documentation framework, well-structured HTML, good conversion results
- **Multi-language**: Native multi-language, Chinese and English maintained independently

**Download Result**: 36 pages × 2 languages = 72 documents

**Dependencies**: `pip install playwright markdownify && playwright install chromium`

---

### X Grok

**URL Pattern**: `https://docs.x.ai/llms{path}.md`

**Findings**:
- Document list available from `https://docs.x.ai/llms.txt`
- Requires User-Agent and Referer headers, otherwise returns 403
- Returned Markdown has `===/docs/xxx===` markers at the beginning, needs cleaning
- **Multi-language**: English only, no multi-language support

**Download Result**: 59 documents

---

### OpenAI

**URL Pattern**: No direct Markdown endpoint, need to render page and extract

**Findings**:
- OpenAI docs is a SPA with Cloudflare bot protection
- Official "Copy page" button can copy Markdown, but cannot directly request it
- Need to use `undetected-chromedriver` to bypass bot protection
- **Multi-language**: English only, no multi-language support

**Download Result**: 51/54 successful (3 model pages failed)

**Dependencies**: `pip install undetected-chromedriver selenium markdownify`

---

### Zhipu BigModel

Zhipu has two documentation sites with different content:

#### Chinese Site (docs.bigmodel.cn) - Mintlify Framework

**URL Pattern**: `https://docs.bigmodel.cn/cn/{section}/{path}.md`

- Uses Mintlify documentation framework, supports `.md` suffix to get Markdown directly
- **Download Result**: 129 documents

#### English Site (open.bigmodel.cn) - Vue SPA

- Vue SPA, content rendered by JavaScript
- Need to use Playwright to render page
- **Download Result**: 113 documents

**Dependencies**: `pip install playwright markdownify && playwright install chromium`

---

### MiniMax

**URL Pattern**: 
- English site: `https://platform.minimax.io/docs/{path}.md`
- Chinese site: `https://platform.minimaxi.com/docs/{path}.md`

**Findings**:
- Uses Mintlify documentation framework, supports `.md` suffix to get Markdown directly
- Chinese and English are two independent sites with different domains

**Download Result**: English 37 + Chinese 47 = 84 documents

---

### Meta Llama

**URL Pattern**: No direct Markdown endpoint, need to render page and extract

**Findings**:
- React SPA (Facebook style), content rendered by JavaScript
- Need to use Playwright to render page

**Download Result**: 22 documents

**Dependencies**: `pip install playwright markdownify && playwright install chromium`

---

### MegaLLM

**URL Pattern**: `https://docs.megallm.io/{lang}/{path}.md`

**Findings**:
- Provides `llms.txt` file with complete document list: `https://docs.megallm.io/llms.txt`
- Supports `.md` suffix to get Markdown directly
- An aggregation platform connecting 70+ LLMs with unified API
- **Multi-language**: Supports 3 languages: en (English), cn (Chinese), ru (Russian)

**Download Result**: 40 × 3 = 120 documents

---

### DeepSeek

**URL Pattern**: `https://api-docs.deepseek.com/{path}` (English) / `https://api-docs.deepseek.com/zh-cn/{path}` (Chinese)

**Findings**:
- Uses Docusaurus documentation framework
- Need to use Selenium to render page

**Download Result**: 61 documents (31 English + 30 Chinese)

**Dependencies**: `pip install selenium html2text`

---

## 🛠️ Dependencies

| Script | Dependencies |
|--------|--------------|
| Basic crawlers | `requests` |
| Moonshot, Meta, Zhipu EN | `playwright markdownify` |
| OpenAI | `undetected-chromedriver selenium markdownify` |
| DeepSeek | `selenium html2text` |

## 📝 File Description

| File | Description |
|------|-------------|
| `batch_download_docs.py` | Gemini + Claude download script |
| `download_moonshot.py` | Moonshot download script |
| `download_grok.py` | X Grok download script |
| `download_openai_uc.py` | OpenAI download script |
| `download_zhipu.py` | Zhipu Chinese site download script |
| `download_zhipu_en.py` | Zhipu English site download script |
| `download_minimax.py` | MiniMax download script |
| `download_meta.py` | Meta Llama download script |
| `download_megallm.py` | MegaLLM download script |
| `download_deepseek.py` | DeepSeek download script |
| `build_docs_site.py` | Documentation site builder |
| `mcp_server.py` | MCP server for AI assistants |

---

## 🌐 Documentation Website

A static documentation website is included in the `docs-site/` folder:

```bash
python3 build_docs_site.py
cd docs-site && python3 -m http.server 8080
```

Features:
- 10 LLM vendor documentation aggregated
- Multi-language document tabs
- Site language switcher (English/Chinese/Japanese)
- Dark/Light theme toggle
- Code block copy buttons
- Category navigation in sidebar
- Modern responsive design

---

## 🤖 MCP Server

### Available Tools

| Tool | Description |
|------|-------------|
| `list_vendors` | List all LLM vendors with doc counts |
| `list_docs` | List all documents for a specific vendor |
| `read_doc` | Read full content of a document |
| `search_docs` | Search across all documentation |
| `get_doc_stats` | Get collection statistics |

### Configuration

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

### Resource URIs

- `llmdocs://openai` - Get OpenAI vendor info and doc list
- `llmdocs://anthropic/en/about-claude/pricing.md` - Read specific document

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This project is for **educational and research purposes only**.

- All documentation content belongs to their respective owners (OpenAI, Anthropic, Google, Meta, xAI, Moonshot, Zhipu, MiniMax, MegaLLM, DeepSeek)
- This project does not claim ownership of any documentation content
- The crawled documentation is intended for personal learning and development reference
- Please respect the terms of service of each platform
- Do not use this project for commercial purposes without proper authorization
- The maintainers are not responsible for any misuse of this project

**If you are a representative of any of the included platforms and have concerns about this project, please open an issue and we will address it promptly.**

## 🙏 Acknowledgments

- Thanks to all LLM providers for their excellent documentation
- Built with ❤️ for the developer community
