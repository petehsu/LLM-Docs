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
├── mcp_server.py           # MCP server
├── build_docs_site.py      # Site builder
└── download_*.py           # Crawler scripts
```

## 🛠️ Dependencies

| Script | Dependencies |
|--------|--------------|
| Basic crawlers | `requests` |
| Moonshot, Meta, Zhipu EN | `playwright markdownify` |
| OpenAI | `undetected-chromedriver selenium markdownify` |
| DeepSeek | `selenium html2text` |

## 📖 Documentation

For detailed documentation about each vendor's API docs structure and crawling methods, see the full documentation in the project.

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
