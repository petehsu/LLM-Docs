#!/usr/bin/env python3
"""探测 Moonshot Kimi 文档结构 - 使用 Playwright"""
from playwright.sync_api import sync_playwright
import re
import time

def get_moonshot_structure():
    """获取 Moonshot 文档结构"""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 访问文档首页
        print("访问 Moonshot 文档...")
        page.goto("https://platform.moonshot.cn/docs/intro", timeout=30000)
        page.wait_for_load_state("networkidle")
        time.sleep(2)
        
        # 获取侧边栏链接
        print("提取文档链接...")
        links = page.eval_on_selector_all(
            'a[href*="/docs/"]',
            'elements => elements.map(e => ({href: e.href, text: e.innerText}))'
        )
        
        # 去重并整理
        seen = set()
        doc_links = []
        for link in links:
            href = link['href']
            if href not in seen and '/docs/' in href:
                seen.add(href)
                doc_links.append(link)
        
        print(f"找到 {len(doc_links)} 个文档链接")
        
        # 保存结果
        with open("moonshot_links.txt", "w", encoding="utf-8") as f:
            f.write(f"找到 {len(doc_links)} 个文档链接:\n\n")
            for link in doc_links:
                path = link['href'].replace("https://platform.moonshot.cn", "")
                f.write(f"{path}  # {link['text']}\n")
        
        # 测试获取页面内容
        print("\n测试获取页面内容...")
        page.goto("https://platform.moonshot.cn/docs/api/tool-use", timeout=30000)
        page.wait_for_load_state("networkidle")
        time.sleep(2)
        
        # 获取文档正文
        content = page.query_selector('article') or page.query_selector('main') or page.query_selector('.markdown-body')
        if content:
            html = content.inner_html()
            print(f"获取到内容: {len(html)} 字符")
            with open("moonshot_content_sample.html", "w", encoding="utf-8") as f:
                f.write(html)
            print("已保存到 moonshot_content_sample.html")
        else:
            # 尝试其他选择器
            body_html = page.content()
            with open("moonshot_full_page.html", "w", encoding="utf-8") as f:
                f.write(body_html)
            print("未找到文档容器，已保存完整页面到 moonshot_full_page.html")
        
        browser.close()

if __name__ == "__main__":
    get_moonshot_structure()
