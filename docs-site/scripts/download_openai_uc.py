#!/usr/bin/env python3
"""
OpenAI API 文档批量下载工具 (使用 undetected-chromedriver)

undetected-chromedriver 可以绕过 Cloudflare 等人机验证
"""

import sys
import time
import os
from pathlib import Path

sys.stdout.reconfigure(line_buffering=True)

try:
    import undetected_chromedriver as uc
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
except ImportError:
    print("请先安装依赖: pip install undetected-chromedriver selenium")
    sys.exit(1)

try:
    from markdownify import markdownify as md
except ImportError:
    print("请先安装依赖: pip install markdownify")
    sys.exit(1)

OUTPUT_BASE = "OpenAI/docs"

# 文档页面列表
OPENAI_PAGES = [
    "/docs/overview",
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


def html_to_markdown(html):
    """将 HTML 转换为 Markdown"""
    markdown = md(
        html,
        heading_style="ATX",
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


def extract_content(driver):
    """从页面提取主要内容"""
    try:
        # 使用 JavaScript 找到内容容器
        script = """
            // 找 main 下包含 h1 的 div
            const mainDivs = document.querySelectorAll('main > div');
            for (const div of mainDivs) {
                if (div.querySelector('nav')) continue;
                if (div.querySelector('h1') && div.textContent.length > 500) {
                    return div.innerHTML;
                }
            }
            // 备选
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
        """
        html = driver.execute_script(script)
        return html
    except Exception as e:
        print(f"      提取错误: {e}")
        return None


def download_page(driver, path):
    """下载单个页面"""
    url = f"https://platform.openai.com{path}"
    
    rel_path = path.replace('/docs/', '', 1)
    output = f"{OUTPUT_BASE}/{rel_path}.md"
    
    try:
        driver.get(url)
        time.sleep(5)  # 等待页面加载
        
        # 检查是否有人机验证
        if "challenge" in driver.current_url or "captcha" in driver.page_source.lower():
            print(f"    ⚠️ 遇到人机验证，等待 30 秒...")
            time.sleep(30)  # 给用户时间手动处理
        
        # 等待内容加载
        try:
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "main h1"))
            )
        except:
            pass
        
        time.sleep(2)
        
        # 提取内容
        html = extract_content(driver)
        if not html or len(html) < 500:
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
    print("OpenAI API 文档下载工具 (undetected-chromedriver)")
    print("=" * 50)
    
    print(f"\n📚 共 {len(OPENAI_PAGES)} 个页面")
    print("⚠️ 如果遇到人机验证，请在浏览器窗口中手动完成验证")
    
    # 配置 Chrome 选项
    options = uc.ChromeOptions()
    options.add_argument('--proxy-server=http://127.0.0.1:10808')
    options.add_argument('--window-size=1920,1080')
    
    # 创建浏览器实例
    driver = uc.Chrome(options=options, headless=False)
    
    try:
        # 先访问首页，让用户有机会处理验证
        print("\n🌐 访问 OpenAI 文档首页...")
        driver.get("https://platform.openai.com/docs/overview")
        print("   如果出现人机验证，请手动完成。完成后按 Enter 继续...")
        input()
        
        success, fail = 0, 0
        
        for path in OPENAI_PAGES:
            name = path.split('/')[-1]
            if download_page(driver, path):
                success += 1
                print(f"    ✓ {name}")
            else:
                fail += 1
            time.sleep(2)
        
        print(f"\n✅ 完成: {success} 成功, {fail} 失败")
        
    finally:
        driver.quit()


if __name__ == "__main__":
    main()
