#!/usr/bin/env python3
"""
OpenAI API 文档批量下载工具

OpenAI 文档是 SPA 应用，需要用 Playwright 渲染页面后提取内容
"""

import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright
from markdownify import markdownify as md

sys.stdout.reconfigure(line_buffering=True)

OUTPUT_BASE = "OpenAI/docs"

# 从浏览器导出的 cookies（登录后，用于绕过人机验证）
OPENAI_COOKIES = [
    {"name": "oai-did", "value": "b6cd53eb-efd5-4eda-9138-aff16721378b", "domain": ".openai.com", "path": "/"},
    {"name": "_ga", "value": "GA1.1.983938521.1765938778", "domain": ".openai.com", "path": "/"},
    {"name": "_rdt_uuid", "value": "1765938779304.cace60ab-f5f6-4932-aaf1-3f128b2db506", "domain": ".openai.com", "path": "/"},
    {"name": "_ga_8MYC5SEFJ1", "value": "GS2.1.s1765945204$o2$g0$t1765945204$j60$l0$h0", "domain": ".openai.com", "path": "/"},
    {"name": "_legacy_auth0.app_2SKx67EdpoN0G6j64rFvigXD.is.authenticated", "value": "true", "domain": ".openai.com", "path": "/"},
    {"name": "auth0.app_2SKx67EdpoN0G6j64rFvigXD.is.authenticated", "value": "true", "domain": ".openai.com", "path": "/"},
    {"name": "_dd_s", "value": "logs=1&id=9e36342e-67ca-4e89-ad4d-e4279ced8b82&created=1766164479982&expire=1766166208878", "domain": ".openai.com", "path": "/"},
]

# 从浏览器获取的文档链接
# 先测试几个页面
OPENAI_PAGES_TEST = [
    "/docs/overview",
    "/docs/guides/images-vision",
    "/docs/guides/text",
]

OPENAI_PAGES_FULL = [
    "/docs/overview",
    "/docs/api-reference/introduction",
    "/docs/quickstart",
    "/docs/models",
    "/docs/pricing",
    "/docs/libraries",
    "/docs/guides/latest-model",
    "/docs/guides/text",
    "/docs/guides/code-generation",
    "/docs/guides/images-vision",
    "/docs/guides/audio",
    "/docs/guides/structured-outputs",
    "/docs/guides/function-calling",
    "/docs/guides/migrate-to-responses",
    "/docs/guides/agents",
    "/docs/guides/voice-agents",
    "/docs/guides/tools",
    "/docs/guides/tools-connectors-mcp",
    "/docs/guides/tools-web-search",
    "/docs/guides/tools-code-interpreter",
    "/docs/guides/conversation-state",
    "/docs/guides/background",
    "/docs/guides/streaming-responses",
    "/docs/guides/webhooks",
    "/docs/guides/pdf-files",
    "/docs/guides/evaluation-getting-started",
    "/docs/guides/evals",
    "/docs/guides/prompt-optimizer",
    "/docs/guides/external-models",
    "/docs/guides/evaluation-best-practices",
    "/docs/guides/realtime",
    "/docs/guides/model-optimization",
    "/docs/guides/graders",
    "/docs/guides/image-generation",
    "/docs/guides/video-generation",
    "/docs/guides/text-to-speech",
    "/docs/guides/speech-to-text",
    "/docs/guides/deep-research",
    "/docs/guides/embeddings",
    "/docs/guides/moderation",
    "/docs/guides/production-best-practices",
    "/docs/guides/optimizing-llm-accuracy",
    "/docs/changelog",
    "/docs/guides/your-data",
    "/docs/guides/rbac",
    "/docs/guides/rate-limits",
    "/docs/deprecations",
    "/docs/mcp",
    "/docs/guides/developer-mode",
    "/docs/models/gpt-5.2",
    "/docs/models/gpt-5-mini",
    "/docs/models/gpt-5-nano",
    "/docs/guides/images",
    "/docs/guides/reasoning",
    "/docs/guides/fine-tuning",
]

# 使用测试列表或完整列表
OPENAI_PAGES = OPENAI_PAGES_TEST  # 改为 OPENAI_PAGES_FULL 下载全部


def extract_content(page):
    """从页面提取主要内容"""
    # OpenAI 文档的内容在 main > div 里，class 是动态的
    # 需要找到包含实际内容的 div（排除侧边栏）
    
    try:
        # 方法1: 使用 JavaScript 找到正确的内容容器
        html = page.evaluate("""
            () => {
                // 找 main 下的第一个 div（通常是内容区）
                const mainDivs = document.querySelectorAll('main > div');
                for (const div of mainDivs) {
                    // 跳过侧边栏（通常包含 nav）
                    if (div.querySelector('nav')) continue;
                    // 找到包含标题的内容区
                    if (div.querySelector('h1') && div.textContent.length > 500) {
                        return div.innerHTML;
                    }
                }
                // 备选：直接找包含 h1 的容器
                const h1 = document.querySelector('main h1');
                if (h1) {
                    let container = h1.parentElement;
                    while (container && container.tagName !== 'MAIN') {
                        if (container.textContent.length > 500) {
                            return container.innerHTML;
                        }
                        container = container.parentElement;
                    }
                }
                return null;
            }
        """)
        if html and len(html) > 500:
            return html
    except Exception as e:
        print(f"      提取错误: {e}")
    
    return None


def html_to_markdown(html):
    """将 HTML 转换为 Markdown"""
    # 使用 markdownify 转换
    markdown = md(
        html,
        heading_style="ATX",
        code_language_callback=lambda el: el.get('class', [''])[0].replace('language-', '') if el.get('class') else '',
        strip=['script', 'style', 'nav', 'footer', 'header'],
    )
    
    # 清理多余空行
    lines = markdown.split('\n')
    cleaned = []
    prev_empty = False
    for line in lines:
        is_empty = not line.strip()
        if is_empty and prev_empty:
            continue
        cleaned.append(line)
        prev_empty = is_empty
    
    return '\n'.join(cleaned).strip()


def download_page(page, path):
    """下载单个页面"""
    url = f"https://platform.openai.com{path}"
    
    # 计算输出路径
    rel_path = path.replace('/docs/', '', 1)
    output = f"{OUTPUT_BASE}/{rel_path}.md"
    
    try:
        page.goto(url, wait_until="networkidle", timeout=90000)
        page.wait_for_timeout(5000)  # 等待 JS 渲染完成
        
        # 提取内容
        html = extract_content(page)
        if not html:
            print(f"    ✗ 未找到内容: {path}")
            return False
        
        # 转换为 Markdown
        markdown = html_to_markdown(html)
        if len(markdown) < 100:
            print(f"    ✗ 内容太短: {path}")
            return False
        
        # 保存
        Path(output).parent.mkdir(parents=True, exist_ok=True)
        with open(output, 'w', encoding='utf-8') as f:
            f.write(markdown)
        
        return True
    except Exception as e:
        print(f"    ✗ 错误: {path} - {e}")
        return False


def main():
    print("=" * 50)
    print("OpenAI API 文档下载工具")
    print("=" * 50)
    
    print(f"\n📚 共 {len(OPENAI_PAGES)} 个页面")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,  # 使用有头模式，更像真实浏览器
            proxy={"server": "http://127.0.0.1:10808"}
        )
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1920, "height": 1080},
            locale="en-US",
        )
        
        # 添加 cookies
        context.add_cookies(OPENAI_COOKIES)
        
        page = context.new_page()
        
        success, fail = 0, 0
        
        for path in OPENAI_PAGES:
            name = path.split('/')[-1]
            if download_page(page, path):
                success += 1
                print(f"    ✓ {name}")
            else:
                fail += 1
            time.sleep(1)  # 避免请求过快
        
        browser.close()
    
    print(f"\n✅ 完成: {success} 成功, {fail} 失败")


if __name__ == "__main__":
    main()
