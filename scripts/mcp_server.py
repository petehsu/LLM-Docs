#!/usr/bin/env python3
"""
LLM Docs MCP Server
提供 MCP 协议接口，让 AI 助手可以读取所有 LLM API 文档

功能:
- 列出所有厂商
- 列出厂商的文档目录
- 读取文档内容
- 搜索文档
"""

import os
import sys
import json
import re
from pathlib import Path
from typing import Any

# MCP SDK
try:
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.types import (
        Tool,
        TextContent,
        Resource,
        ResourceTemplate,
    )
except ImportError:
    print("Error: MCP SDK not installed. Run: pip install mcp", file=sys.stderr)
    sys.exit(1)

# 项目根目录
SCRIPT_DIR = Path(__file__).parent.absolute()
ROOT_DIR = SCRIPT_DIR.parent  # docs-site 目录
DOCS_DIR = ROOT_DIR / "docs"
DOCS_INDEX_FILE = ROOT_DIR / "docs-index.json"

# 厂商配置
VENDORS = {
    "openai": {
        "name": "OpenAI",
        "folder": "OpenAI",
        "description": "OpenAI API documentation including GPT-4, GPT-4o, Assistants API, etc.",
    },
    "anthropic": {
        "name": "Anthropic Claude",
        "folder": "Anthropic Claude",
        "description": "Anthropic Claude API documentation, multi-language support.",
    },
    "google": {
        "name": "Google Gemini",
        "folder": "Google Gemini",
        "description": "Google Gemini API documentation.",
    },
    "meta": {
        "name": "Meta Llama",
        "folder": "Meta Llama",
        "description": "Meta Llama API documentation.",
    },
    "xai": {
        "name": "xAI Grok",
        "folder": "X Grok",
        "description": "xAI Grok API documentation.",
    },
    "moonshot": {
        "name": "Moonshot Kimi",
        "folder": "Moonshot Kimi",
        "description": "Moonshot Kimi API documentation (Chinese).",
    },
    "zhipu": {
        "name": "Zhipu BigModel",
        "folder": "BigModel Zhipu",
        "description": "Zhipu BigModel (智谱) API documentation.",
    },
    "minimax": {
        "name": "MiniMax",
        "folder": "MiniMax",
        "description": "MiniMax API documentation.",
    },
    "megallm": {
        "name": "MegaLLM",
        "folder": "MegaLLM",
        "description": "MegaLLM unified API documentation and model catalog.",
    },
    "deepseek": {
        "name": "DeepSeek",
        "folder": "DeepSeek",
        "description": "DeepSeek API documentation.",
    },
}


def load_docs_index() -> dict:
    """加载文档索引"""
    if DOCS_INDEX_FILE.exists():
        with open(DOCS_INDEX_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def get_vendor_docs(vendor_id: str) -> list[dict]:
    """获取厂商的所有文档"""
    index = load_docs_index()
    vendor_data = index.get(vendor_id, {})
    languages = vendor_data.get("languages", {})
    
    docs = []
    for lang_code, lang_docs in languages.items():
        for doc in lang_docs:
            docs.append({
                "language": lang_code,
                "path": doc.get("path", ""),
                "title": doc.get("title", doc.get("name", "")),
                "folder": doc.get("folder", ""),
                "full_path": f"{lang_code}/{doc.get('path', '')}",
            })
    return docs


def read_doc_content(vendor_id: str, doc_path: str) -> str:
    """读取文档内容"""
    vendor = VENDORS.get(vendor_id)
    if not vendor:
        return f"Error: Unknown vendor '{vendor_id}'"
    
    # 解析路径
    parts = doc_path.split("/", 1)
    if len(parts) < 2:
        return f"Error: Invalid path format. Expected: <language>/<path>"
    
    lang_code = parts[0]
    actual_path = parts[1]
    
    # 构建文件路径 - 使用 DOCS_DIR
    vendor_folder = DOCS_DIR / vendor["folder"]
    
    # 尝试不同的路径组合
    possible_paths = [
        vendor_folder / lang_code / actual_path,
        vendor_folder / actual_path,
    ]
    
    # 语言文件夹映射
    lang_folder_map = {
        "en": ["English", "en", "docs"],
        "zh": ["简体中文", "zh", "zh-CN"],
        "zh-CN": ["简体中文", "zh-CN"],
        "zh-TW": ["繁體中文", "zh-TW"],
        "ja": ["日本語", "ja"],
        "ko": ["한국어", "ko"],
        "de": ["Deutsch", "de"],
        "es": ["Español", "es"],
        "fr": ["Français", "fr"],
        "it": ["Italiano", "it"],
        "ru": ["Русский", "ru"],
    }
    
    if lang_code in lang_folder_map:
        for folder_name in lang_folder_map[lang_code]:
            possible_paths.append(vendor_folder / folder_name / actual_path)
    
    for file_path in possible_paths:
        if file_path.exists() and file_path.is_file():
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    return f.read()
            except Exception as e:
                return f"Error reading file: {e}"
    
    return f"Error: Document not found at any of: {[str(p) for p in possible_paths]}"


def search_docs(query: str, vendor_id: str = None, limit: int = 20) -> list[dict]:
    """搜索文档"""
    results = []
    query_lower = query.lower()
    query_pattern = re.compile(re.escape(query), re.IGNORECASE)
    
    vendors_to_search = [vendor_id] if vendor_id else list(VENDORS.keys())
    
    for vid in vendors_to_search:
        vendor = VENDORS.get(vid)
        if not vendor:
            continue
        
        vendor_folder = DOCS_DIR / vendor["folder"]
        if not vendor_folder.exists():
            continue
        
        # 遍历所有 .md 文件
        for md_file in vendor_folder.rglob("*.md"):
            try:
                content = md_file.read_text(encoding="utf-8")
                
                # 检查标题或内容是否匹配
                title_match = query_pattern.search(md_file.stem)
                content_match = query_pattern.search(content)
                
                if title_match or content_match:
                    # 提取匹配的上下文
                    context = ""
                    if content_match:
                        start = max(0, content_match.start() - 100)
                        end = min(len(content), content_match.end() + 100)
                        context = "..." + content[start:end].replace("\n", " ") + "..."
                    
                    # 提取标题
                    title = md_file.stem
                    title_line = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
                    if title_line:
                        title = title_line.group(1)
                    
                    rel_path = md_file.relative_to(vendor_folder)
                    
                    results.append({
                        "vendor": vid,
                        "vendor_name": vendor["name"],
                        "path": str(rel_path),
                        "title": title,
                        "context": context[:300] if context else "",
                        "match_type": "title" if title_match else "content",
                    })
                    
                    if len(results) >= limit:
                        return results
                        
            except Exception:
                continue
    
    return results


# 创建 MCP Server
server = Server("llm-docs")


@server.list_tools()
async def list_tools() -> list[Tool]:
    """列出可用的工具"""
    return [
        Tool(
            name="list_vendors",
            description="List all LLM API documentation vendors available in this collection. Returns vendor IDs, names, and descriptions.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": [],
            },
        ),
        Tool(
            name="list_docs",
            description="List all documents for a specific vendor. Returns document paths, titles, languages, and folders.",
            inputSchema={
                "type": "object",
                "properties": {
                    "vendor_id": {
                        "type": "string",
                        "description": "Vendor ID (e.g., 'openai', 'anthropic', 'google', 'deepseek')",
                        "enum": list(VENDORS.keys()),
                    },
                },
                "required": ["vendor_id"],
            },
        ),
        Tool(
            name="read_doc",
            description="Read the full content of a specific document. Use list_docs first to get available paths.",
            inputSchema={
                "type": "object",
                "properties": {
                    "vendor_id": {
                        "type": "string",
                        "description": "Vendor ID",
                        "enum": list(VENDORS.keys()),
                    },
                    "doc_path": {
                        "type": "string",
                        "description": "Document path in format: <language>/<path>. Example: 'en/api/chat.md' or 'zh/quickstart.md'",
                    },
                },
                "required": ["vendor_id", "doc_path"],
            },
        ),
        Tool(
            name="search_docs",
            description="Search across all LLM API documentation for a specific term or topic. Returns matching documents with context.",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query (e.g., 'function calling', 'streaming', 'embeddings')",
                    },
                    "vendor_id": {
                        "type": "string",
                        "description": "Optional: limit search to specific vendor",
                        "enum": list(VENDORS.keys()),
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of results (default: 20)",
                        "default": 20,
                    },
                },
                "required": ["query"],
            },
        ),
        Tool(
            name="get_doc_stats",
            description="Get statistics about the documentation collection - total docs, docs per vendor, languages available.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": [],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
    """执行工具调用"""
    
    if name == "list_vendors":
        result = []
        for vid, vendor in VENDORS.items():
            docs = get_vendor_docs(vid)
            result.append({
                "id": vid,
                "name": vendor["name"],
                "description": vendor["description"],
                "doc_count": len(docs),
            })
        return [TextContent(type="text", text=json.dumps(result, indent=2, ensure_ascii=False))]
    
    elif name == "list_docs":
        vendor_id = arguments.get("vendor_id")
        if vendor_id not in VENDORS:
            return [TextContent(type="text", text=f"Error: Unknown vendor '{vendor_id}'")]
        
        docs = get_vendor_docs(vendor_id)
        
        # 按语言分组
        by_language = {}
        for doc in docs:
            lang = doc["language"]
            if lang not in by_language:
                by_language[lang] = []
            by_language[lang].append({
                "path": doc["full_path"],
                "title": doc["title"],
                "folder": doc["folder"],
            })
        
        result = {
            "vendor": VENDORS[vendor_id]["name"],
            "total_docs": len(docs),
            "languages": by_language,
        }
        return [TextContent(type="text", text=json.dumps(result, indent=2, ensure_ascii=False))]
    
    elif name == "read_doc":
        vendor_id = arguments.get("vendor_id")
        doc_path = arguments.get("doc_path")
        
        content = read_doc_content(vendor_id, doc_path)
        return [TextContent(type="text", text=content)]
    
    elif name == "search_docs":
        query = arguments.get("query", "")
        vendor_id = arguments.get("vendor_id")
        limit = arguments.get("limit", 20)
        
        results = search_docs(query, vendor_id, limit)
        
        output = {
            "query": query,
            "total_results": len(results),
            "results": results,
        }
        return [TextContent(type="text", text=json.dumps(output, indent=2, ensure_ascii=False))]
    
    elif name == "get_doc_stats":
        index = load_docs_index()
        
        stats = {
            "total_vendors": len(VENDORS),
            "vendors": {},
            "total_docs": 0,
            "all_languages": set(),
        }
        
        for vid, vendor in VENDORS.items():
            vendor_data = index.get(vid, {})
            languages = vendor_data.get("languages", {})
            doc_count = sum(len(docs) for docs in languages.values())
            
            stats["vendors"][vid] = {
                "name": vendor["name"],
                "doc_count": doc_count,
                "languages": list(languages.keys()),
            }
            stats["total_docs"] += doc_count
            stats["all_languages"].update(languages.keys())
        
        stats["all_languages"] = sorted(list(stats["all_languages"]))
        
        return [TextContent(type="text", text=json.dumps(stats, indent=2, ensure_ascii=False))]
    
    else:
        return [TextContent(type="text", text=f"Error: Unknown tool '{name}'")]


@server.list_resources()
async def list_resources() -> list[Resource]:
    """列出可用的资源"""
    resources = []
    
    for vid, vendor in VENDORS.items():
        resources.append(Resource(
            uri=f"llmdocs://{vid}",
            name=vendor["name"],
            description=vendor["description"],
            mimeType="application/json",
        ))
    
    return resources


@server.list_resource_templates()
async def list_resource_templates() -> list[ResourceTemplate]:
    """列出资源模板"""
    return [
        ResourceTemplate(
            uriTemplate="llmdocs://{vendor_id}/{doc_path}",
            name="LLM Documentation",
            description="Read a specific document from an LLM vendor",
            mimeType="text/markdown",
        ),
    ]


@server.read_resource()
async def read_resource(uri: str) -> str:
    """读取资源"""
    # 解析 URI: llmdocs://vendor_id/path
    if not uri.startswith("llmdocs://"):
        return f"Error: Invalid URI scheme"
    
    path = uri[len("llmdocs://"):]
    parts = path.split("/", 1)
    
    vendor_id = parts[0]
    
    if len(parts) == 1:
        # 返回厂商信息
        if vendor_id not in VENDORS:
            return f"Error: Unknown vendor '{vendor_id}'"
        
        docs = get_vendor_docs(vendor_id)
        result = {
            "vendor": VENDORS[vendor_id],
            "docs": docs,
        }
        return json.dumps(result, indent=2, ensure_ascii=False)
    else:
        # 返回文档内容
        doc_path = parts[1]
        return read_doc_content(vendor_id, doc_path)


async def main():
    """主函数"""
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
