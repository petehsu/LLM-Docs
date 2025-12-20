#!/usr/bin/env python3
"""
MegaLLM API 文档批量下载工具

URL 规律:
- 文档列表: https://docs.megallm.io/llms.txt
- Markdown: https://docs.megallm.io/en/{path}.md
- 仅英文，无中文支持
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

OUTPUT_BASE = "MegaLLM"

# 支持的语言
LANGUAGES = {
    'en': 'English',
    'cn': '简体中文',
    'ru': 'Русский',
}


def get_doc_list():
    """从 llms.txt 获取文档列表"""
    url = "https://docs.megallm.io/llms.txt"
    try:
        resp = requests.get(url, proxies=PROXIES if USE_PROXY else None,
                          headers=HEADERS, timeout=30)
        resp.raise_for_status()
        
        # 解析 llms.txt，提取 .md 链接
        docs = []
        for line in resp.text.split('\n'):
            # 匹配 markdown 链接格式 [title](url.md)
            matches = re.findall(r'\((https://docs\.megallm\.io/[^)]+\.md)\)', line)
            docs.extend(matches)
        
        return docs
    except Exception as e:
        print(f"获取文档列表失败: {e}")
        return []


def download_doc(url, lang_code, lang_name, skip_existing=True):
    """下载单个文档"""
    # 从 URL 提取路径
    # https://docs.megallm.io/en/xxx/yyy.md -> xxx/yyy.md
    path = url.replace('https://docs.megallm.io/', '')
    
    # 去掉语言前缀
    if path.startswith(f'{lang_code}/'):
        path = path[len(lang_code)+1:]
    
    # 去掉 .md 后缀再加回来（确保格式一致）
    if path.endswith('.md'):
        path = path[:-3]
    
    output = f"{OUTPUT_BASE}/{lang_name}/{path}.md"
    
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
        
        if len(content.strip()) < 10:
            return False, "空"
        
        Path(output).parent.mkdir(parents=True, exist_ok=True)
        with open(output, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, "OK"
    except Exception as e:
        return False, str(e)[:30]


def main():
    print("=" * 50)
    print("MegaLLM API 文档下载工具")
    print("=" * 50)
    
    # 获取文档列表（从英文版 llms.txt）
    print("\n📋 获取文档列表 (llms.txt)...")
    docs = get_doc_list()
    
    if not docs:
        print("未找到文档")
        return
    
    # 去重
    docs = sorted(set(docs))
    print(f"   发现 {len(docs)} 个文档模板")
    
    total_success, total_fail = 0, 0
    
    # 下载每种语言
    for lang_code, lang_name in LANGUAGES.items():
        print(f"\n{'='*50}")
        print(f"下载 {lang_name} ({lang_code})")
        print('='*50)
        
        success, skipped, fail = 0, 0, 0
        
        for url in docs:
            # 替换语言代码
            lang_url = url.replace('/en/', f'/{lang_code}/')
            name = url.split('/')[-1].replace('.md', '')
            
            ok, status = download_doc(lang_url, lang_code, lang_name)
            
            if ok:
                if status == "跳过":
                    skipped += 1
                else:
                    success += 1
                    print(f"    ✓ {name}")
            else:
                fail += 1
                if status != "404":  # 404 可能是该语言没有这个文档
                    print(f"    ✗ {name} ({status})")
            
            if status != "跳过":
                time.sleep(0.2)
        
        print(f"\n✅ {lang_name}: {success} 新下载, {skipped} 跳过, {fail} 失败")
        total_success += success + skipped
        total_fail += fail
    
    print(f"\n{'='*50}")
    print(f"全部完成: {total_success} 成功")


if __name__ == "__main__":
    main()
