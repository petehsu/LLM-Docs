#!/usr/bin/env python3
"""
探测 OpenAI 文档结构
"""

import json
import re
from playwright.sync_api import sync_playwright

def explore_openai():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            proxy={"server": "http://127.0.0.1:10808"}
        )
        page = browser.new_page()
        
        print("📋 访问 OpenAI 文档页面...")
        # 使用 domcontentloaded 而不是 networkidle，更快
        page.goto("https://platform.openai.com/docs/overview", wait_until="domcontentloaded", timeout=90000)
        # 等待侧边栏加载
        print("   等待页面加载...")
        page.wait_for_timeout(8000)
        
        # 获取侧边栏链接
        print("\n📚 提取侧边栏链接...")
        links = page.evaluate("""
            () => {
                const links = [];
                // 查找侧边栏中的所有链接
                document.querySelectorAll('nav a[href^="/docs/"]').forEach(a => {
                    const href = a.getAttribute('href');
                    const text = a.textContent.trim();
                    if (href && !links.some(l => l.href === href)) {
                        links.push({href, text});
                    }
                });
                return links;
            }
        """)
        
        print(f"   发现 {len(links)} 个链接:")
        for link in links[:20]:
            print(f"   - {link['href']} ({link['text']})")
        if len(links) > 20:
            print(f"   ... 还有 {len(links) - 20} 个")
        
        # 保存链接
        with open("openai_links.txt", "w") as f:
            for link in links:
                f.write(f"{link['href']}\t{link['text']}\n")
        print(f"\n   已保存到 openai_links.txt")
        
        # 检查是否有多语言
        print("\n🌐 检查多语言支持...")
        lang_selector = page.query_selector('[data-testid="language-selector"], .language-selector, select[name="language"]')
        if lang_selector:
            print("   发现语言选择器")
        else:
            print("   未发现语言选择器，可能仅英文")
        
        # 尝试获取页面内容结构
        print("\n📄 检查页面内容结构...")
        content_selector = page.evaluate("""
            () => {
                // 常见的内容容器选择器
                const selectors = [
                    'article', 
                    'main article',
                    '[class*="content"]',
                    '[class*="markdown"]',
                    '.docs-content',
                ];
                for (const sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el && el.textContent.length > 500) {
                        return {
                            selector: sel,
                            length: el.textContent.length,
                            preview: el.textContent.substring(0, 200)
                        };
                    }
                }
                return null;
            }
        """)
        
        if content_selector:
            print(f"   找到内容容器: {content_selector['selector']}")
            print(f"   内容长度: {content_selector['length']} 字符")
            print(f"   预览: {content_selector['preview'][:100]}...")
        
        browser.close()

if __name__ == "__main__":
    explore_openai()
