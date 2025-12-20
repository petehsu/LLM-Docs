#!/usr/bin/env python3
"""
智谱 BigModel 英文站文档下载工具 (open.bigmodel.cn)

这是 Vue SPA 应用，需要用 Playwright 渲染页面后提取内容
"""

import sys
import time
import re
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
from markdownify import markdownify as md

sys.stdout.reconfigure(line_buffering=True)

OUTPUT_BASE = "BigModel Zhipu/English"

# 入口页面，用于爬取侧边栏链接
ENTRY_PAGES = [
    "/dev/api/normal-model/glm-4",
    "/dev/api/thirdparty/overview",
    "/dev/howuse/introduction",
    "/dev/api/devguide/model",
]

async def get_all_links(page):
    """从页面侧边栏获取所有文档链接"""
    all_links = set()
    
    for entry in ENTRY_PAGES:
        url = f"https://open.bigmodel.cn{entry}"
        print(f"  爬取 {entry}...")
        
        try:
            await page.goto(url, wait_until="networkidle", timeout=30000)
            await page.wait_for_timeout(2000)
            
            # 提取侧边栏链接
            links = await page.evaluate('''() => {
                const links = [];
                document.querySelectorAll('a[href^="/dev/"]').forEach(a => {
                    const href = a.getAttribute('href');
                    if (href && !href.includes('#')) {
                        links.push(href);
                    }
                });
                return links;
            }''')
            
            all_links.update(links)
            print(f"    发现 {len(links)} 个链接")
        except Exception as e:
            print(f"    失败: {e}")
    
    return sorted(all_links)


async def download_page(page, path):
    """下载单个页面"""
    url = f"https://open.bigmodel.cn{path}"
    
    # 输出路径
    rel_path = path.replace('/dev/', '', 1)
    output = f"{OUTPUT_BASE}/{rel_path}.md"
    
    # 跳过已存在
    if Path(output).exists():
        return True, "跳过"
    
    try:
        await page.goto(url, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(1500)
        
        # 提取主内容区域
        content_html = await page.evaluate('''() => {
            // 尝试多种选择器
            const selectors = [
                '.markdown-body',
                '.doc-content',
                '.content-wrapper',
                'article',
                'main',
                '.main-content'
            ];
            
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el && el.innerText.length > 100) {
                    return el.innerHTML;
                }
            }
            
            // 回退：获取整个页面内容区
            const main = document.querySelector('#app');
            return main ? main.innerHTML : document.body.innerHTML;
        }''')
        
        if not content_html or len(content_html) < 100:
            return False, "内容为空"
        
        # 转换为 Markdown
        markdown = md(content_html, heading_style="ATX", strip=['script', 'style', 'nav'])
        
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
    print("智谱 BigModel 英文站文档下载工具")
    print("=" * 50)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            proxy={"server": "http://127.0.0.1:10808"}
        )
        page = await browser.new_page()
        
        # 尝试从文件读取链接，否则爬取
        links_file = Path('zhipu_en_links.txt')
        if links_file.exists():
            print("\n📋 从文件读取链接...")
            docs = links_file.read_text().strip().split('\n')
        else:
            print("\n📋 爬取文档链接...")
            docs = await get_all_links(page)
            if docs:
                with open('zhipu_en_links.txt', 'w') as f:
                    f.write('\n'.join(docs))
        
        if not docs:
            print("未找到文档链接")
            await browser.close()
            return
        
        print(f"   共 {len(docs)} 个链接")
        
        # 下载
        print(f"\n📚 开始下载...")
        success, skipped, fail = 0, 0, 0
        failed_docs = []
        
        for path in docs:
            name = path.split('/')[-1]
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
