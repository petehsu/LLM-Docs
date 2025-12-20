# LLM API Documentation Collection

Tools and records for batch downloading API documentation from major LLM providers.

## Supported Vendors

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

**Directory Structure**:
```
Moonshot Kimi/
├── 简体中文/
│   ├── overview.md
│   ├── introduction.md
│   ├── api/
│   │   ├── chat.md
│   │   ├── tool-use.md
│   │   └── ...
│   ├── pricing/
│   └── guide/
└── English/
    └── ... (same as above)
```

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

**Directory Structure**:
```
X Grok/docs/
├── overview.md
├── introduction.md
├── models.md
├── api-reference.md
├── collections-api/
├── management-api/
├── grok-business/
├── guides/
│   ├── chat.md
│   ├── function-calling.md
│   ├── reasoning.md
│   ├── tools/
│   └── ...
├── key-information/
└── resources/
```

---

### OpenAI

**URL Pattern**: No direct Markdown endpoint, need to render page and extract

**Findings**:
- OpenAI docs is a SPA with Cloudflare bot protection
- Official "Copy page" button can copy Markdown, but cannot directly request it
- Need to use `undetected-chromedriver` to bypass bot protection
- **Multi-language**: English only, no multi-language support

**Download Result**: 51/54 successful (3 model pages failed)

**Directory Structure**:
```
OpenAI/docs/
├── overview.md
├── quickstart.md
├── models.md
├── pricing.md
├── guides/
│   ├── text.md
│   ├── agents.md
│   ├── function-calling.md
│   ├── structured-outputs.md
│   ├── image-generation.md
│   ├── reasoning.md
│   └── ...
├── changelog.md
└── deprecations.md
```

**Dependencies**: `pip install undetected-chromedriver selenium markdownify`

---

### Zhipu BigModel

Zhipu has two documentation sites with different content:

#### Chinese Site (docs.bigmodel.cn) - Mintlify Framework

**URL Pattern**: `https://docs.bigmodel.cn/cn/{section}/{path}.md`

**Findings**:
- Uses Mintlify documentation framework, supports `.md` suffix to get Markdown directly
- Crawled sidebar links from multiple tab pages (User Guide, API Docs, Examples, etc.)
- Returned Markdown contains Mintlify component tags (e.g., `<Frame>`, `<Card>`, `<Tabs>`)
- llms.txt hint at the end of docs: `https://docs.bigmodel.cn/llms.txt`

**Download Result**: 129 documents

**Directory Structure**:
```
BigModel Zhipu/docs/
├── api/                    # API Documentation
├── asyncapi/               # Async API
├── best-practice/          # Best Practices
├── coding-plan/            # Coding Plans
├── faq/                    # FAQ
├── guide/                  # User Guide
├── terms/                  # Terms & Agreements
└── update/                 # Changelog
```

#### English Site (open.bigmodel.cn) - Vue SPA

**URL Pattern**: No direct Markdown endpoint, need to render page and extract

**Findings**:
- Vue SPA, content rendered by JavaScript
- Need to use Playwright to render page, extract content, then convert with markdownify
- Content differs from Chinese site, has independent documentation structure

**Download Result**: 113 documents

**Directory Structure**:
```
BigModel Zhipu/English/
├── api/
│   ├── agent/              # Agent API
│   ├── Agent_Platform/     # Agent Platform
│   ├── normal-model/       # General Models
│   ├── Reasoning-models/   # Reasoning Models
│   ├── videomodel/         # Video Models
│   └── ...
├── howuse/                 # User Guide
│   ├── llm/                # Language Models
│   ├── vlm/                # Vision Models
│   └── ...
└── ...
```

**Dependencies**: `pip install playwright markdownify && playwright install chromium`

**Multi-language**: Two independent sites, Chinese and English sites have different content

---

### MiniMax

**URL Pattern**: 
- English site: `https://platform.minimax.io/docs/{path}.md`
- Chinese site: `https://platform.minimaxi.com/docs/{path}.md`

**Findings**:
- Uses Mintlify documentation framework, supports `.md` suffix to get Markdown directly
- Chinese and English are two independent sites with different domains (minimax.io vs minimaxi.com)
- Returned Markdown contains Mintlify component tags (e.g., `<Card>`, `<CardGroup>`)
- **Multi-language**: Two independent sites, content differs

**Download Result**: English 37 + Chinese 47 = 84 documents

**Directory Structure**:
```
MiniMax/
├── English/
│   ├── api-reference/      # API Reference
│   ├── coding-plan/        # Coding Plans
│   ├── faq/                # FAQ
│   ├── guides/             # User Guide
│   ├── pricing/            # Pricing
│   ├── release-notes/      # Release Notes
│   └── solutions/          # Solutions
└── 简体中文/
    └── ... (same as above, more content)
```

---

### Meta Llama

**URL Pattern**: No direct Markdown endpoint, need to render page and extract

**Findings**:
- React SPA (Facebook style), content rendered by JavaScript
- Need to use Playwright to render page, extract content, then convert with markdownify
- **Multi-language**: English only, no multi-language support

**Download Result**: 22 documents

**Directory Structure**:
```
Meta Llama/docs/
├── overview.md
├── quickstart.md
├── models.md
├── api-keys.md
├── api/
│   ├── chat.md
│   ├── models.md
│   └── moderations.md
├── features/
│   ├── chat-completion.md
│   ├── tool-calling.md
│   ├── structured-output.md
│   └── ...
├── guides/
│   ├── best-practices.md
│   ├── chat-guide.md
│   └── ...
└── trust/
    └── data-commitments.md
```

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

**Directory Structure**:
```
MegaLLM/
├── English/
│   ├── home/
│   ├── api-reference/
│   ├── agents/             # AI Coding Tool Configs
│   ├── cli/                # CLI Tools
│   ├── dev-docs/           # Developer Docs
│   └── releases/
├── 简体中文/
│   └── ... (same as above)
├── Русский/
│   └── ... (same as above)
└── models/                 # Model List (extracted from dashboard)
    ├── README.md           # Model Index
    ├── gpt-5.md
    ├── claude-opus-4-*.md
    └── ... (35 models)
```

**Model List**: Extracted from `https://megallm.io/dashboard/models`, contains basic info for 35 models

---

### DeepSeek

**URL Pattern**: `https://api-docs.deepseek.com/{path}` (English) / `https://api-docs.deepseek.com/zh-cn/{path}` (Chinese)

**Findings**:
- Uses Docusaurus documentation framework
- Need to use Selenium to render page, extract content, then convert with html2text
- **Multi-language**: Supports 2 languages: en (English), zh-cn (Simplified Chinese)

**Download Result**: 61 documents (31 English + 30 Chinese)

**Directory Structure**:
```
DeepSeek/
├── English/
│   ├── guides/             # User Guides
│   ├── news/               # News & Updates
│   └── quick_start/        # Quick Start
└── 简体中文/
    └── ... (same as above)
```

**Dependencies**: `pip install selenium html2text`

---

## Usage

```bash
# Install dependencies
pip install requests

# Run download script
python3 batch_download_docs.py
```

Modify configuration in `batch_download_docs.py`:
- `USE_PROXY`: Whether to use proxy
- `PROXIES`: Proxy address (default 127.0.0.1:10808)

---

## File Description

| File | Description |
|------|-------------|
| `batch_download_docs.py` | Gemini + Claude download script |
| `download_moonshot.py` | Moonshot download script (requires Playwright) |
| `download_grok.py` | X Grok download script |
| `download_openai_uc.py` | OpenAI download script (requires undetected-chromedriver) |
| `fix_claude_html.py` | Claude docs HTML error fix script |
| `explore_gemini.py` | Gemini docs structure exploration |
| `explore_claude.py` | Claude docs structure exploration |
| `explore_moonshot.py` | Moonshot docs structure exploration |
| `gemini_links.txt` | Gemini document links list |
| `claude_links.txt` | Claude document links list |
| `moonshot_links.txt` | Moonshot document links list |
| `download_zhipu.py` | Zhipu Chinese site download script |
| `download_zhipu_en.py` | Zhipu English site download script (requires Playwright) |
| `zhipu_links.txt` | Zhipu Chinese site links list |
| `zhipu_en_links.txt` | Zhipu English site links list |
| `download_minimax.py` | MiniMax download script |
| `download_meta.py` | Meta Llama download script (requires Playwright) |
| `meta_links.txt` | Meta Llama links list |
| `download_megallm.py` | MegaLLM download script |
| `megallm_links.txt` | MegaLLM links list |
| `parse_megallm_models.py` | MegaLLM model list parsing script |
| `download_deepseek.py` | DeepSeek download script (requires Selenium) |
| `build_docs_site.py` | Documentation site builder |

---

## Documentation Website

A static documentation website is included in the `docs-site/` folder. To use it:

```bash
# Build the docs index
python3 build_docs_site.py

# Start local server
cd docs-site && python3 -m http.server 8080

# Open in browser
# http://localhost:8080
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

## MCP Server Integration

This project includes a Model Context Protocol (MCP) server that allows AI assistants to read all LLM API documentation.

### Installation

```bash
# Install MCP SDK
pip install mcp
```

### Available Tools

| Tool | Description |
|------|-------------|
| `list_vendors` | List all LLM vendors with doc counts |
| `list_docs` | List all documents for a specific vendor |
| `read_doc` | Read full content of a document |
| `search_docs` | Search across all documentation |
| `get_doc_stats` | Get collection statistics |

### Configuration

Add to your MCP client config (e.g., `.kiro/settings/mcp.json`):

```json
{
  "mcpServers": {
    "llm-docs": {
      "command": "python3",
      "args": ["mcp_server.py"],
      "env": {},
      "disabled": false,
      "autoApprove": ["list_vendors", "list_docs", "read_doc", "search_docs", "get_doc_stats"]
    }
  }
}
```

### Usage Examples

Once connected, AI assistants can:

```
# List all vendors
list_vendors

# Get OpenAI docs list
list_docs vendor_id="openai"

# Read a specific document
read_doc vendor_id="anthropic" doc_path="en/build-with-claude/vision.md"

# Search for function calling docs
search_docs query="function calling"

# Get statistics
get_doc_stats
```

### Resource URIs

The MCP server also supports resource URIs:

- `llmdocs://openai` - Get OpenAI vendor info and doc list
- `llmdocs://anthropic/en/about-claude/pricing.md` - Read specific document
