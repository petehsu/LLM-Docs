#!/usr/bin/env python3
"""
大模型 API 文档批量下载工具
支持: Google Gemini, OpenAI, Anthropic Claude, 智谱, Moonshot, Grok
"""

import sys
import time
import requests
from pathlib import Path

sys.stdout.reconfigure(line_buffering=True)

PROXIES = {"http": "http://127.0.0.1:10808", "https": "http://127.0.0.1:10808"}
USE_PROXY = True


def download_doc(url: str, output_path: str, validate_markdown: bool = False) -> bool:
    """下载单个文档
    
    Args:
        url: 下载地址
        output_path: 保存路径
        validate_markdown: 是否验证返回内容为 Markdown（检测 HTML 404）
    """
    try:
        resp = requests.get(url, proxies=PROXIES if USE_PROXY else None, timeout=30)
        resp.raise_for_status()
        content = resp.text.lstrip()
        
        # 验证是否为 Markdown（检测 HTML 404 页面）
        if validate_markdown:
            if content.startswith("<!DOCTYPE") or content.startswith("<html"):
                print(f"    ✗ 返回 HTML 而非 Markdown")
                return False
        
        # 清理 <br /> 标签
        while content.startswith("<br />") or content.startswith("<br/>"):
            content = content[6:].lstrip() if content.startswith("<br />") else content[5:].lstrip()
        
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"    ✗ 失败: {e}")
        return False


# ============ Google Gemini 分类结构 ============
GEMINI_STRUCTURE = {
    "01-开始使用": [
        ("", "index", "概览"),
        ("quickstart", "quickstart", "快速入门"),
        ("api-key", "api-key", "API 密钥"),
        ("libraries", "libraries", "库"),
        ("interactions", "interactions", "Interactions API"),
    ],
    "02-模型": [
        ("models", "models", "Gemini"),
        ("gemini-3", "gemini-3", "Gemini 3"),
        ("nanobanana", "nanobanana", "Nano Banana（图片生成）"),
        ("video", "video", "Veo（视频生成）"),
        ("music-generation", "music-generation", "Lyria（音乐生成）"),
        ("imagen", "imagen", "Imagen（图片生成）"),
        ("embeddings", "embeddings", "Embeddings"),
        ("robotics-overview", "robotics-overview", "机器人学"),
        ("pricing", "pricing", "价格"),
        ("rate-limits", "rate-limits", "速率限制"),
    ],
    "03-核心功能": [
        ("text-generation", "text-generation", "文本"),
        ("image-generation", "image-generation", "图片生成"),
        ("image-understanding", "image-understanding", "图片理解"),
        ("video-understanding", "video-understanding", "视频"),
        ("document-processing", "document-processing", "文档"),
        ("speech-generation", "speech-generation", "语音生成"),
        ("audio", "audio", "音频理解"),
        ("thinking", "thinking", "思考型"),
        ("thought-signatures", "thought-signatures", "思考签名"),
        ("structured-output", "structured-output", "结构化输出"),
        ("function-calling", "function-calling", "函数调用"),
        ("long-context", "long-context", "长上下文"),
    ],
    "04-工具和代理": [
        ("tools", "tools", "概览"),
        ("deep-research", "deep-research", "Deep Research"),
        ("google-search", "google-search", "Google Search"),
        ("maps-grounding", "maps-grounding", "Google Maps"),
        ("code-execution", "code-execution", "代码执行"),
        ("url-context", "url-context", "网址上下文"),
        ("computer-use", "computer-use", "计算机使用"),
        ("file-search", "file-search", "文件搜索"),
    ],
    "05-Live API": [
        ("live", "live", "开始使用"),
        ("live-guide", "live-guide", "功能"),
        ("live-tools", "live-tools", "工具使用"),
        ("live-session", "live-session", "会话管理"),
        ("ephemeral-tokens", "ephemeral-tokens", "临时令牌"),
    ],
    "06-指南": [
        ("batch-api", "batch-api", "Batch API"),
        ("files", "files", "文件 API"),
        ("caching", "caching", "上下文缓存"),
        ("openai", "openai", "OpenAI 兼容性"),
        ("media-resolution", "media-resolution", "媒体分辨率"),
        ("tokens", "tokens", "令牌计数"),
        ("prompting-strategies", "prompting-strategies", "提示工程"),
        ("logs-datasets", "logs-datasets", "日志使用入门"),
        ("logs-policy", "logs-policy", "数据记录和共享"),
        ("safety-settings", "safety-settings", "安全设置"),
        ("safety-guidance", "safety-guidance", "安全指导"),
        ("langgraph-example", "langgraph-example", "LangChain 和 LangGraph"),
        ("crewai-example", "crewai-example", "CrewAI"),
        ("llama-index", "llama-index", "LlamaIndex"),
        ("vercel-ai-sdk-example", "vercel-ai-sdk-example", "Vercel AI SDK"),
    ],
    "07-资源": [
        ("migrate", "migrate", "迁移到 Gen AI SDK"),
        ("changelog", "changelog", "版本说明"),
        ("deprecations", "deprecations", "弃用"),
        ("troubleshooting", "troubleshooting", "API 问题排查"),
        ("billing", "billing", "账单信息"),
        ("partner-integration", "partner-integration", "合作伙伴和库集成"),
        ("ai-studio-quickstart", "ai-studio-quickstart", "AI Studio 快速入门"),
        ("aistudio-build-mode", "aistudio-build-mode", "AI Studio 构建模式"),
        ("learnlm", "learnlm", "试用 LearnLM"),
        ("troubleshoot-ai-studio", "troubleshoot-ai-studio", "AI Studio 问题排查"),
        ("workspace", "workspace", "Workspace 用户访问权限"),
        ("migrate-to-cloud", "migrate-to-cloud", "VertexAI Gemini API"),
        ("oauth", "oauth", "OAuth 身份验证"),
    ],
    "08-政策": [
        ("available-regions", "available-regions", "可用区域"),
        ("usage-policies", "usage-policies", "其他使用政策"),
    ],
}


def download_gemini():
    """下载 Google Gemini 文档（按分类）"""
    base_url = "https://ai.google.dev/gemini-api/docs"
    suffix = ".md.txt?hl=zh-cn"
    output_base = "Google Gemini/docs"
    
    total = sum(len(pages) for pages in GEMINI_STRUCTURE.values())
    print(f"\n📚 下载 Google Gemini 文档 (共 {total} 个，按 {len(GEMINI_STRUCTURE)} 个分类)")
    
    success, fail = 0, 0
    for category, pages in GEMINI_STRUCTURE.items():
        print(f"\n  [{category}]")
        for path, filename, title in pages:
            url_path = f"/{path}" if path else ""
            url = f"{base_url}{url_path}{suffix}"
            output = f"{output_base}/{category}/{filename}.md"
            
            if download_doc(url, output):
                success += 1
                print(f"    ✓ {title}")
            else:
                fail += 1
            time.sleep(0.3)
    
    print(f"\n  Gemini 完成: {success} 成功, {fail} 失败")


# ============ Anthropic Claude ============
# 注意：语言代码大小写敏感！zh-CN 正确，zh-cn 返回 404
CLAUDE_LANGUAGES = [
    ("en", "English"),
    ("de", "Deutsch"),
    ("es", "Español"),
    ("fr", "Français"),
    ("it", "Italiano"),
    ("ja", "日本語"),
    ("ko", "한국어"),
    ("pt-BR", "Português-BR"),  # 注意大小写
    ("ru", "Русский"),
    ("zh-CN", "简体中文"),  # 注意大小写
    ("zh-TW", "繁體中文"),  # 注意大小写
    ("id", "Bahasa-Indonesia"),
]

CLAUDE_PAGES = [
    "home", "intro", "get-started",
    "about-claude/models/overview", "about-claude/models/choosing-a-model",
    "about-claude/models/migrating-to-claude-4", "about-claude/models/whats-new-claude-4-5",
    "about-claude/model-deprecations", "about-claude/pricing",
    "api/overview",
    "build-with-claude/overview", "build-with-claude/working-with-messages",
    "build-with-claude/streaming", "build-with-claude/vision", "build-with-claude/pdf-support",
    "build-with-claude/files", "build-with-claude/citations", "build-with-claude/embeddings",
    "build-with-claude/extended-thinking", "build-with-claude/effort",
    "build-with-claude/context-windows", "build-with-claude/context-editing",
    "build-with-claude/structured-outputs", "build-with-claude/token-counting",
    "build-with-claude/prompt-caching", "build-with-claude/batch-processing",
    "build-with-claude/multilingual-support", "build-with-claude/search-results",
    "build-with-claude/skills-guide", "build-with-claude/usage-cost-api",
    "build-with-claude/administration-api", "build-with-claude/claude-code-analytics-api",
    "build-with-claude/claude-on-amazon-bedrock", "build-with-claude/claude-on-vertex-ai",
    "build-with-claude/claude-in-microsoft-foundry",
    "build-with-claude/prompt-engineering/overview",
    "build-with-claude/prompt-engineering/be-clear-and-direct",
    "build-with-claude/prompt-engineering/use-xml-tags",
    "build-with-claude/prompt-engineering/chain-of-thought",
    "build-with-claude/prompt-engineering/multishot-prompting",
    "build-with-claude/prompt-engineering/chain-prompts",
    "build-with-claude/prompt-engineering/prefill-claudes-response",
    "build-with-claude/prompt-engineering/system-prompts",
    "build-with-claude/prompt-engineering/long-context-tips",
    "build-with-claude/prompt-engineering/extended-thinking-tips",
    "build-with-claude/prompt-engineering/claude-4-best-practices",
    "build-with-claude/prompt-engineering/prompt-generator",
    "build-with-claude/prompt-engineering/prompt-improver",
    "build-with-claude/prompt-engineering/prompt-templates-and-variables",
    "agents-and-tools/tool-use/overview", "agents-and-tools/tool-use/implement-tool-use",
    "agents-and-tools/tool-use/programmatic-tool-calling",
    "agents-and-tools/tool-use/fine-grained-tool-streaming",
    "agents-and-tools/tool-use/computer-use-tool", "agents-and-tools/tool-use/text-editor-tool",
    "agents-and-tools/tool-use/bash-tool", "agents-and-tools/tool-use/web-search-tool",
    "agents-and-tools/tool-use/web-fetch-tool", "agents-and-tools/tool-use/code-execution-tool",
    "agents-and-tools/tool-use/memory-tool", "agents-and-tools/tool-use/tool-search-tool",
    "agents-and-tools/mcp-connector", "agents-and-tools/remote-mcp-servers",
    "agents-and-tools/agent-skills/overview", "agents-and-tools/agent-skills/quickstart",
    "agents-and-tools/agent-skills/best-practices",
    "agent-sdk/overview", "agent-sdk/quickstart", "agent-sdk/python",
    "agent-sdk/typescript", "agent-sdk/typescript-v2-preview", "agent-sdk/migration-guide",
    "test-and-evaluate/define-success", "test-and-evaluate/develop-tests",
    "test-and-evaluate/eval-tool",
    "test-and-evaluate/strengthen-guardrails/reduce-hallucinations",
    "test-and-evaluate/strengthen-guardrails/increase-consistency",
    "test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks",
    "test-and-evaluate/strengthen-guardrails/reduce-latency",
    "test-and-evaluate/strengthen-guardrails/keep-claude-in-character",
    "test-and-evaluate/strengthen-guardrails/reduce-prompt-leak",
    "test-and-evaluate/strengthen-guardrails/handle-streaming-refusals",
    "release-notes/overview", "release-notes/api",
    "resources/overview",
]


def download_claude(languages=None):
    """下载 Anthropic Claude 文档（按语言分类）
    
    Args:
        languages: 要下载的语言列表，None 表示全部
    """
    base_url = "https://platform.claude.com/docs"
    output_base = "Anthropic Claude"
    
    langs_to_download = languages if languages else CLAUDE_LANGUAGES

    total = len(CLAUDE_PAGES) * len(langs_to_download)
    print(f"\n📚 下载 Anthropic Claude 文档 ({len(CLAUDE_PAGES)} 页 x {len(langs_to_download)} 语言 = {total} 个)")

    for lang_code, lang_name in langs_to_download:
        print(f"\n  [{lang_name}]")
        success, fail = 0, 0

        for page in CLAUDE_PAGES:
            url = f"{base_url}/{lang_code}/{page}.md"
            # 保持原有路径结构
            output = f"{output_base}/{lang_name}/{page}.md"

            if download_doc(url, output, validate_markdown=True):
                success += 1
                name = page.split("/")[-1]
                print(f"    ✓ {name}")
            else:
                fail += 1
            time.sleep(0.2)

        print(f"  {lang_name} 完成: {success} 成功, {fail} 失败")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='LLM API Docs Batch Downloader')
    parser.add_argument('--claude-only', action='store_true', help='Only download Claude docs')
    parser.add_argument('--gemini-only', action='store_true', help='Only download Gemini docs')
    
    args = parser.parse_args()
    
    print("=" * 50)
    print("大模型 API 文档批量下载工具")
    print("=" * 50)

    if args.claude_only:
        download_claude()
    elif args.gemini_only:
        download_gemini()
    else:
        download_gemini()
        download_claude()

    print("\n✅ 全部完成!")

