#!/usr/bin/env python3
"""
Meta Llama API 文档批量下载工具

URL: https://llama.developer.meta.com/docs/
这是 React SPA，需要 Playwright 渲染页面提取内容
"""

import sys
import time
import re
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
from markdownify import markdownify as md

sys.stdout.reconfigure(line_buffering=True)

OUTPUT_BASE = "Meta Llama/docs"

# 入口页面
ENTRY_URL = "https://llama.developer.meta.com/docs/overview"


async def get_all_links(page):
    """从侧边栏获取所有文档链接"""
    print("  等待页面加载...")
    await page.goto(ENTRY_URL, wait_until="networkidle", timeout=60000)
    await page.wait_for_timeout(3000)
    
    # 提取侧边栏链接
    links = await page.evaluate('''() => {
        const links = [];
        document.querySelectorAll('a[href^="/docs/"]').forEach(a => {
            const href = a.getAttribute('href');
            if (href && !href.includes('#')) {
                links.push(href);
            }
        });
        return [...new Set(links)];
    }''')
    
    return sorted(set(links))


async def download_page(page, path):
    """下载单个页面"""
    url = f"https://llama.developer.meta.com{path}"
    
    # 输出路径
    rel_path = path.replace('/docs/', '', 1)
    if not rel_path:
        rel_path = 'index'
    output = f"{OUTPUT_BASE}/{rel_path}.md"
    
    # 跳过已存在
    if Path(output).exists():
        return True, "跳过"
    
    try:
        await page.goto(url, wait_until="networkidle", timeout=60000)
        await page.wait_for_timeout(2000)
        
        # 提取主内容区域
        content_html = await page.evaluate('''() => {
            // 尝试多种选择器找到主内容
            const selectors = [
                'article',
                '[role="main"]',
                'main',
                '.markdown-body',
                '.doc-content',
            ];
            
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el && el.innerText.length > 100) {
                    return el.innerHTML;
                }
            }
            
            // 回退：尝试找最大的内容区域
            const divs = document.querySelectorAll('div');
            let maxDiv = null;
            let maxLen = 0;
            divs.forEach(div => {
                const text = div.innerText || '';
                if (text.length > maxLen && text.length < 50000) {
                    maxLen = text.length;
                    maxDiv = div;
                }
            });
            
            return maxDiv ? maxDiv.innerHTML : document.body.innerHTML;
        }''')
        
        if not content_html or len(content_html) < 100:
            return False, "内容为空"
        
        # 转换为 Markdown
        markdown = md(content_html, heading_style="ATX", strip=['script', 'style', 'nav', 'header', 'footer'])
        
        # 清理
        markdown = re.sub(r'\n{3,}', '\n\n', markdown)
        markdown = markdown.strip()
        
        if len(markdown) < 50:
            return False, "转换后内容太短"
        
        Path(output).parent.mkdir(parents=True, exist_ok=True)
        with open(output, 'w', encoding='utf-8') as f:
            f.write(markdown)
        
        return True, "OK"
    except Exception as e:
        return False, str(e)[:50]


async def main():
    print("=" * 50)
    print("Meta Llama API 文档下载工具")
    print("=" * 50)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            proxy={"server": "http://127.0.0.1:10808"}
        )
        page = await browser.new_page()
        
        # 获取所有链接
        print("\n📋 爬取文档链接...")
        docs = await get_all_links(page)
        
        if not docs:
            print("未找到文档链接")
            await browser.close()
            return
        
        print(f"   发现 {len(docs)} 个链接")
        
        # 保存链接
        with open('meta_links.txt', 'w') as f:
            f.write('\n'.join(docs))
        
        # 显示链接预览
        print("\n📄 链接预览:")
        for link in docs[:10]:
            print(f"   {link}")
        if len(docs) > 10:
            print(f"   ... 还有 {len(docs) - 10} 个")
        
        # 下载
        print(f"\n📚 开始下载...")
        success, skipped, fail = 0, 0, 0
        failed_docs = []
        
        for path in docs:
            name = path.split('/')[-1] or 'index'
            ok, status = await download_page(page, path)
            
            if ok:
                if status == "跳过":
                    skipped += 1
                else:
                    success += 1
                    print(f"    ✓ {name}")
            else:
                fail += 1
                failed_docs.append((path, status))
                print(f"    ✗ {name} ({status})")
            
            if status != "跳过":
                await page.wait_for_timeout(500)
        
        await browser.close()
        
        print(f"\n✅ 完成: {success} 新下载, {skipped} 跳过, {fail} 失败")
        
        if failed_docs:
            print("\n❌ 失败列表:")
            for path, status in failed_docs[:10]:
                print(f"    {path} - {status}")


if __name__ == "__main__":
    asyncio.run(main())
