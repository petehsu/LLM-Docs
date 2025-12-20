#!/usr/bin/env python3
"""
MiniMax API 文档批量下载工具

URL 规律:
- 英文站: https://platform.minimax.io/docs/{path}.md
- 中文站: https://platform.minimaxi.com/docs/{path}.md
"""

import sys
import time
import re
import requests
from pathlib import Path

sys.stdout.reconfigure(line_buffering=True)

PROXIES = {"http": "http://127.0.0.1:10808", "https": "http://127.0.0.1:10808"}
USE_PROXY = True

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/markdown,text/plain,*/*',
}

# 两个站点配置
SITES = {
    'English': {
        'base_url': 'https://platform.minimax.io',
        'output_dir': 'MiniMax/English',
    },
    '简体中文': {
        'base_url': 'https://platform.minimaxi.com',
        'output_dir': 'MiniMax/简体中文',
    },
}

# 入口页面，用于爬取链接
ENTRY_PAGES = [
    '/docs/guides/models-intro',
    '/docs/guides/quickstart',
    '/docs/api-reference/text-intro',
    '/docs/coding-plan/intro',
    '/docs/faq/about-apis',
    '/docs/pricing/overview',
    '/docs/release-notes/models',
    '/docs/solutions/audiobook',
]


def fetch_page(base_url, path):
    """获取页面 HTML"""
    url = f"{base_url}{path}"
    try:
        resp = requests.get(url, proxies=PROXIES if USE_PROXY else None,
                          headers=HEADERS, timeout=30)
        return resp.text
    except Exception as e:
        print(f"    获取页面失败: {path} - {e}")
        return ""


def extract_links(html):
    """从 HTML 中提取文档链接"""
    # 匹配 /docs/ 开头的链接
    links = re.findall(r'href="(/docs/[^"#]+)"', html)
    
    # 过滤掉非文档链接
    filtered = []
    exclude_patterns = ['.png', '.ico', '.jpg', '.svg', '.css', '.js', '.woff', '.xml', '?', '_next', '_mintlify']
    for link in links:
        if not any(ext in link for ext in exclude_patterns):
            # 确保是有效的文档路径
            if link.count('/') >= 2:
                filtered.append(link)
    
    return set(filtered)


def get_all_doc_links(base_url):
    """从入口页面获取所有文档链接"""
    all_links = set()
    
    for entry in ENTRY_PAGES:
        print(f"  爬取 {entry}...")
        html = fetch_page(base_url, entry)
        if html:
            links = extract_links(html)
            all_links.update(links)
            print(f"    发现 {len(links)} 个链接")
        time.sleep(0.5)
    
    return sorted(all_links)


def download_doc(base_url, path, output_dir, skip_existing=True):
    """下载单个文档"""
    url = f"{base_url}{path}.md"
    
    # 输出路径
    rel_path = path.replace('/docs/', '', 1)
    output = f"{output_dir}/{rel_path}.md"
    
    # 跳过已存在
    if skip_existing and Path(output).exists():
        return True, "跳过"
    
    try:
        resp = requests.get(url, proxies=PROXIES if USE_PROXY else None,
                          headers=HEADERS, timeout=30)
        
        if resp.status_code == 404:
            return False, "404"
        
        content = resp.text
        
        # 检查是否为 HTML
        if content.strip().startswith('<!DOCTYPE') or content.strip().startswith('<html'):
            return False, "HTML"
        
        # 检查内容是否有效
        if len(content.strip()) < 10:
            return False, "空"
        
        Path(output).parent.mkdir(parents=True, exist_ok=True)
        with open(output, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, "OK"
    except Exception as e:
        return False, str(e)[:30]


def download_site(lang, config):
    """下载单个站点的所有文档"""
    base_url = config['base_url']
    output_dir = config['output_dir']
    
    print(f"\n{'='*50}")
    print(f"下载 {lang} 站点: {base_url}")
    print('='*50)
    
    # 获取链接
    print("\n📋 爬取文档链接...")
    docs = get_all_doc_links(base_url)
    
    if not docs:
        print("未找到文档")
        return 0, 0
    
    print(f"\n   共发现 {len(docs)} 个唯一链接")
    
    # 下载
    print(f"\n📚 开始下载...")
    success, skipped, fail = 0, 0, 0
    failed_docs = []
    
    for path in docs:
        name = path.split('/')[-1]
        ok, status = download_doc(base_url, path, output_dir)
        
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
            time.sleep(0.3)
    
    print(f"\n✅ {lang}: {success} 新下载, {skipped} 跳过, {fail} 失败")
    
    if failed_docs:
        print(f"\n❌ 失败列表:")
        for path, status in failed_docs[:5]:
            print(f"    {path} - {status}")
    
    return success + skipped, fail


def main():
    print("=" * 50)
    print("MiniMax API 文档下载工具")
    print("=" * 50)
    
    total_success, total_fail = 0, 0
    
    for lang, config in SITES.items():
        success, fail = download_site(lang, config)
        total_success += success
        total_fail += fail
    
    print(f"\n{'='*50}")
    print(f"全部完成: {total_success} 成功, {total_fail} 失败")


if __name__ == "__main__":
    main()
