#!/usr/bin/env python3
"""
Moonshot Kimi 文档下载工具
使用 Playwright 爬取 SPA 页面，转换为 Markdown
"""
from playwright.sync_api import sync_playwright
from markdownify import markdownify as md
from pathlib import Path
import re
import time

# 文档页面列表
MOONSHOT_PAGES = [
    # 概览
    ("overview", "概览"),
    ("introduction", "使用手册"),
    # API 接口
    ("api/chat", "Chat API"),
    ("api/tool-use", "Tool Use"),
    ("api/partial", "Partial Mode"),
    ("api/files", "文件接口"),
    ("api/estimate", "计算 Token"),
    ("api/balance", "查询余额"),
    # 定价
    ("pricing/chat", "模型推理定价"),
    ("pricing/tools", "联网搜索定价"),
    ("pricing/limits", "充值与限速"),
    ("pricing/faq", "定价常见问题"),
    # 指南
    ("guide/kimi-k2-quickstart", "Kimi K2 快速开始"),
    ("guide/use-kimi-k2-thinking-model", "Kimi K2 Thinking"),
    ("guide/start-using-kimi-api", "开始使用 Kimi API"),
    ("guide/migrating-from-openai-to-kimi", "从 OpenAI 迁移"),
    ("guide/use-moonpalace", "调试工具使用说明"),
    ("guide/engage-in-multi-turn-conversations-using-kimi-api", "多轮对话指南"),
    ("guide/use-kimi-vision-model", "使用视觉模型"),
    ("guide/auto-reconnect", "自动断线重连"),
    ("guide/utilize-the-streaming-output-feature-of-kimi-api", "流式输出指南"),
    ("guide/use-kimi-api-to-complete-tool-calls", "Tool Calls 能力"),
    ("guide/use-web-search", "使用联网搜索"),
    ("guide/use-json-mode-feature-of-kimi-api", "JSON Mode"),
    ("guide/use-partial-mode-feature-of-kimi-api", "Partial Mode"),
    ("guide/use-kimi-api-for-file-based-qa", "文件问答指南"),
    ("guide/use-playground-to-debug-the-model", "开发工作台调试"),
    ("guide/agent-support", "编程工具中使用 Kimi K2"),
    ("guide/configure-the-modelscope-mcp-server", "ModelScope MCP 配置"),
    ("guide/use-official-tools", "Kimi 官方工具集成"),
    ("guide/kimi-cli-support", "Kimi CLI 使用指南"),
    ("guide/use-kimi-k2-to-setup-agent", "Kimi K2 搭建 Agent"),
    ("guide/benchmark-best-practice", "基准评估最佳实践"),
    ("guide/prompt-best-practice", "Prompt 最佳实践"),
    ("guide/org-best-practice", "组织管理最佳实践"),
    ("guide/faq", "常见问题"),
]

LANGUAGES = [
    ("zh-CN", "简体中文"),
    ("en-US", "English"),
]


def clean_html(html: str) -> str:
    """清理 HTML，移除不需要的元素"""
    # 移除按钮、SVG 等
    html = re.sub(r'<button[^>]*>.*?</button>', '', html, flags=re.DOTALL)
    html = re.sub(r'<svg[^>]*>.*?</svg>', '', html, flags=re.DOTALL)
    # 移除 style 属性中的 CSS 变量
    html = re.sub(r'style="[^"]*"', '', html)
    # 移除空的 span
    html = re.sub(r'<span[^>]*>\s*</span>', '', html)
    return html


def html_to_markdown(html: str) -> str:
    """将 HTML 转换为 Markdown"""
    html = clean_html(html)
    markdown = md(html, heading_style="ATX", code_language_callback=lambda el: el.get('data-language', ''))
    # 清理多余空行
    markdown = re.sub(r'\n{3,}', '\n\n', markdown)
    return markdown.strip()


def download_moonshot_docs():
    """下载 Moonshot 文档"""
    output_base = "Moonshot Kimi"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        for lang_code, lang_name in LANGUAGES:
            print(f"\n📚 下载 Moonshot Kimi 文档 [{lang_name}]")
            output_dir = f"{output_base}/{lang_name}"
            success, fail = 0, 0
            
            for path, title in MOONSHOT_PAGES:
                # 构建 URL
                if lang_code == "zh-CN":
                    url = f"https://platform.moonshot.cn/docs/{path}"
                else:
                    url = f"https://platform.moonshot.cn/en-US/docs/{path}"
                
                try:
                    page.goto(url, timeout=30000)
                    page.wait_for_load_state("networkidle")
                    time.sleep(1)
                    
                    # 获取文档内容
                    content_el = page.query_selector('main') or page.query_selector('article')
                    if content_el:
                        html = content_el.inner_html()
                        markdown = html_to_markdown(html)
                        
                        # 保存文件
                        # 保持路径结构
                        output_path = Path(f"{output_dir}/{path}.md")
                        output_path.parent.mkdir(parents=True, exist_ok=True)
                        output_path.write_text(markdown, encoding='utf-8')
                        
                        success += 1
                        print(f"  ✓ {title}")
                    else:
                        fail += 1
                        print(f"  ✗ {title} (未找到内容)")
                        
                except Exception as e:
                    fail += 1
                    print(f"  ✗ {title} ({e})")
                
                time.sleep(0.5)
            
            print(f"  {lang_name} 完成: {success} 成功, {fail} 失败")
        
        browser.close()


if __name__ == "__main__":
    print("=" * 50)
    print("Moonshot Kimi 文档下载工具")
    print("=" * 50)
    download_moonshot_docs()
    print("\n✅ 完成!")
