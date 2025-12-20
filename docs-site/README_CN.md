# 大模型 API 文档收集

批量下载各家大模型 API 文档的工具和记录。

## 已支持厂商

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

## 使用方法

```bash
# 安装依赖
pip install requests

# 运行下载脚本
python3 batch_download_docs.py
```

修改 `batch_download_docs.py` 中的配置：
- `USE_PROXY`: 是否使用代理
- `PROXIES`: 代理地址（默认 127.0.0.1:10808）

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

**目录结构**:
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
    └── ... (同上)
```

**依赖**: `pip install playwright markdownify && playwright install chromium`

---

### X Grok

**URL 规律**: `https://docs.x.ai/llms{path}.md`

**发现**:
- 文档列表可从 `https://docs.x.ai/llms.txt` 获取
- 需要带 User-Agent 和 Referer 请求头，否则返回 403
- 返回的 Markdown 开头有 `===/docs/xxx===` 标记，需要清理
- **多语言方式**: 仅英文，无多语言支持

**下载结果**: 59 个文档

**目录结构**:
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

**URL 规律**: 无直接 Markdown 端点，需要渲染页面提取

**发现**:
- OpenAI 文档是 SPA 应用，有 Cloudflare 人机验证保护
- 官方提供"Copy page"按钮可复制 Markdown，但无法直接请求获取
- 需要使用 `undetected-chromedriver` 绕过人机验证
- **多语言方式**: 仅英文，无多语言支持

**下载结果**: 51/54 成功（3 个模型页面失败）

**目录结构**:
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

**依赖**: `pip install undetected-chromedriver selenium markdownify`

---

### 智谱 BigModel

智谱有两个文档站点，内容不同：

#### 中文站 (docs.bigmodel.cn) - Mintlify 框架

**URL 规律**: `https://docs.bigmodel.cn/cn/{section}/{path}.md`

**发现**:
- 使用 Mintlify 文档框架，支持 `.md` 后缀直接获取 Markdown
- 从多个 tab 页面（使用指南、API 文档、场景示例等）爬取侧边栏链接
- 返回的 Markdown 包含 Mintlify 组件标签（如 `<Frame>`, `<Card>`, `<Tabs>` 等）
- 文档末尾有 llms.txt 提示：`https://docs.bigmodel.cn/llms.txt`

**下载结果**: 129 个文档

**目录结构**:
```
BigModel Zhipu/docs/
├── api/                    # API 文档
├── asyncapi/               # 异步 API
├── best-practice/          # 最佳实践
├── coding-plan/            # 编码套餐
├── faq/                    # 常见问题
├── guide/                  # 使用指南
├── terms/                  # 条款与协议
└── update/                 # 更新日志
```

#### 英文站 (open.bigmodel.cn) - Vue SPA

**URL 规律**: 无直接 Markdown 端点，需要渲染页面提取

**发现**:
- Vue SPA 应用，内容由 JavaScript 动态渲染
- 需要使用 Playwright 渲染页面后提取内容，再用 markdownify 转换
- 内容与中文站不完全相同，有独立的文档结构

**下载结果**: 113 个文档

**目录结构**:
```
BigModel Zhipu/English/
├── api/
│   ├── agent/              # 智能体 API
│   ├── Agent_Platform/     # 智能体平台
│   ├── normal-model/       # 通用模型
│   ├── Reasoning-models/   # 推理模型
│   ├── videomodel/         # 视频模型
│   └── ...
├── howuse/                 # 使用指南
│   ├── llm/                # 语言模型
│   ├── vlm/                # 视觉模型
│   └── ...
└── ...
```

**依赖**: `pip install playwright markdownify && playwright install chromium`

**多语言方式**: 两个独立站点，中文站和英文站内容不同

---

### MiniMax

**URL 规律**: 
- 英文站: `https://platform.minimax.io/docs/{path}.md`
- 中文站: `https://platform.minimaxi.com/docs/{path}.md`

**发现**:
- 使用 Mintlify 文档框架，支持 `.md` 后缀直接获取 Markdown
- 中英文是两个独立站点，域名不同（minimax.io vs minimaxi.com）
- 返回的 Markdown 包含 Mintlify 组件标签（如 `<Card>`, `<CardGroup>` 等）
- **多语言方式**: 两个独立站点，内容有差异

**下载结果**: 英文 37 个 + 中文 47 个 = 84 个文档

**目录结构**:
```
MiniMax/
├── English/
│   ├── api-reference/      # API 参考
│   ├── coding-plan/        # 编码套餐
│   ├── faq/                # 常见问题
│   ├── guides/             # 使用指南
│   ├── pricing/            # 定价
│   ├── release-notes/      # 更新日志
│   └── solutions/          # 解决方案
└── 简体中文/
    └── ... (同上，内容更丰富)
```

---

### Meta Llama

**URL 规律**: 无直接 Markdown 端点，需要渲染页面提取

**发现**:
- React SPA 应用（Facebook 风格），内容由 JavaScript 动态渲染
- 需要使用 Playwright 渲染页面后提取内容，再用 markdownify 转换
- **多语言方式**: 仅英文，无多语言支持

**下载结果**: 22 个文档

**目录结构**:
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

**依赖**: `pip install playwright markdownify && playwright install chromium`

---

### MegaLLM

**URL 规律**: `https://docs.megallm.io/{lang}/{path}.md`

**发现**:
- 提供 `llms.txt` 文件，可直接获取完整文档列表：`https://docs.megallm.io/llms.txt`
- 支持 `.md` 后缀直接获取 Markdown
- 是一个聚合平台，连接 70+ 大模型的统一 API
- **多语言方式**: 支持 3 种语言：en（英文）、cn（中文）、ru（俄文）

**下载结果**: 40 × 3 = 120 个文档

**目录结构**:
```
MegaLLM/
├── English/
│   ├── home/
│   ├── api-reference/
│   ├── agents/             # AI 编程工具配置
│   ├── cli/                # CLI 工具
│   ├── dev-docs/           # 开发文档
│   └── releases/
├── 简体中文/
│   └── ... (同上)
├── Русский/
│   └── ... (同上)
└── models/                 # 模型列表（从 dashboard 提取）
    ├── README.md           # 模型索引
    ├── gpt-5.md
    ├── claude-opus-4-*.md
    └── ... (35 个模型)
```

**模型列表**: 从 `https://megallm.io/dashboard/models` 提取，包含 35 个模型的基本信息

---

### DeepSeek

**URL 规律**: `https://api-docs.deepseek.com/{path}` (英文) / `https://api-docs.deepseek.com/zh-cn/{path}` (中文)

**发现**:
- 使用 Docusaurus 文档框架
- 需要使用 Selenium 渲染页面后提取内容，再用 html2text 转换为 Markdown
- **多语言方式**: 支持 2 种语言：en（英文）、zh-cn（简体中文）

**下载结果**: 61 个文档（英文 31 个 + 中文 30 个）

**目录结构**:
```
DeepSeek/
├── English/
│   ├── guides/             # 使用指南
│   ├── news/               # 新闻动态
│   └── quick_start/        # 快速开始
└── 简体中文/
    └── ... (同上)
```

**依赖**: `pip install selenium html2text`

---

## 文件说明

| 文件 | 说明 |
|------|------|
| `batch_download_docs.py` | Gemini + Claude 下载脚本 |
| `download_moonshot.py` | Moonshot 下载脚本（需要 Playwright） |
| `download_grok.py` | X Grok 下载脚本 |
| `download_openai_uc.py` | OpenAI 下载脚本（需要 undetected-chromedriver） |
| `fix_claude_html.py` | Claude 文档 HTML 错误修复脚本 |
| `explore_gemini.py` | Gemini 文档结构探测 |
| `explore_claude.py` | Claude 文档结构探测 |
| `explore_moonshot.py` | Moonshot 文档结构探测 |
| `gemini_links.txt` | Gemini 文档链接列表 |
| `claude_links.txt` | Claude 文档链接列表 |
| `moonshot_links.txt` | Moonshot 文档链接列表 |
| `download_zhipu.py` | 智谱中文站下载脚本 |
| `download_zhipu_en.py` | 智谱英文站下载脚本（需要 Playwright） |
| `zhipu_links.txt` | 智谱中文站链接列表 |
| `zhipu_en_links.txt` | 智谱英文站链接列表 |
| `download_minimax.py` | MiniMax 下载脚本 |
| `download_meta.py` | Meta Llama 下载脚本（需要 Playwright） |
| `meta_links.txt` | Meta Llama 链接列表 |
| `download_megallm.py` | MegaLLM 下载脚本 |
| `megallm_links.txt` | MegaLLM 链接列表 |
| `parse_megallm_models.py` | MegaLLM 模型列表解析脚本 |
| `download_deepseek.py` | DeepSeek 下载脚本（需要 Selenium） |
| `build_docs_site.py` | 文档网站构建脚本 |

---

## 文档网站

`docs-site/` 文件夹包含一个静态文档网站。使用方法：

```bash
# 构建文档索引
python3 build_docs_site.py

# 启动本地服务器
cd docs-site && python3 -m http.server 8080

# 在浏览器中打开
# http://localhost:8080
```

功能特性：
- 聚合 10 家大模型厂商文档
- 多语言文档标签切换
- 网站语言切换（英文/中文/日文）
- 深色/浅色主题切换
- 代码块一键复制
- 分类目录导航
- 现代响应式设计

---

## MCP Server 集成

本项目包含一个 Model Context Protocol (MCP) 服务器，让 AI 助手可以读取所有大模型 API 文档。

### 安装

```bash
# 安装 MCP SDK
pip install mcp
```

### 可用工具

| 工具 | 描述 |
|------|------|
| `list_vendors` | 列出所有厂商及文档数量 |
| `list_docs` | 列出指定厂商的所有文档 |
| `read_doc` | 读取文档完整内容 |
| `search_docs` | 跨所有文档搜索 |
| `get_doc_stats` | 获取文档集合统计信息 |

### 配置

添加到你的 MCP 客户端配置（如 `.kiro/settings/mcp.json`）：

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

### 使用示例

连接后，AI 助手可以：

```
# 列出所有厂商
list_vendors

# 获取 OpenAI 文档列表
list_docs vendor_id="openai"

# 读取指定文档
read_doc vendor_id="anthropic" doc_path="en/build-with-claude/vision.md"

# 搜索 function calling 相关文档
search_docs query="function calling"

# 获取统计信息
get_doc_stats
```

### 资源 URI

MCP 服务器还支持资源 URI：

- `llmdocs://openai` - 获取 OpenAI 厂商信息和文档列表
- `llmdocs://anthropic/en/about-claude/pricing.md` - 读取指定文档
