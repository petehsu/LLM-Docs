#!/usr/bin/env python3
"""
X Grok API 文档批量下载工具

URL 规律:
- 文档列表: https://docs.x.ai/llms.txt
- Markdown: https://docs.x.ai/llms{path}.md (需要 User-Agent 和 Referer)
"""

import sys
import time
import requests
from pathlib import Path

sys.stdout.reconfigure(line_buffering=True)

PROXIES = {"http": "http://127.0.0.1:10808", "https": "http://127.0.0.1:10808"}
USE_PROXY = True

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/markdown,text/plain,*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://docs.x.ai/docs/overview',
}

OUTPUT_BASE = "X Grok/docs"


def get_doc_list():
    """从 llms.txt 获取文档列表"""
    url = "https://docs.x.ai/llms.txt"
    try:
        resp = requests.get(url, proxies=PROXIES if USE_PROXY else None, 
                          headers=HEADERS, timeout=30)
        resp.raise_for_status()
        
        docs = []
        for line in resp.text.split('\n'):
            if line.startswith('===/docs/'):
                path = line.replace('===', '').strip()
                docs.append(path)
        return docs
    except Exception as e:
        print(f"获取文档列表失败: {e}")
        return []


def download_doc(path):
    """下载单个文档"""
    # URL: https://docs.x.ai/llms/docs/xxx.md
    url = f"https://docs.x.ai/llms{path}.md"
    
    # 输出路径: X Grok/docs/xxx.md
    # 去掉开头的 /docs/
    rel_path = path.replace('/docs/', '', 1)
    output = f"{OUTPUT_BASE}/{rel_path}.md"
    
    try:
        resp = requests.get(url, proxies=PROXIES if USE_PROXY else None,
                          headers=HEADERS, timeout=30)
        resp.raise_for_status()
        
        content = resp.text
        
        # 检查是否为 HTML（403 等错误）
        if content.strip().startswith('<!DOCTYPE') or content.strip().startswith('<html'):
            print(f"    ✗ 返回 HTML: {path}")
            return False
        
        # 清理开头的 ===path=== 标记
        lines = content.split('\n')
        if lines and lines[0].startswith('==='):
            content = '\n'.join(lines[1:]).lstrip()
        
        Path(output).parent.mkdir(parents=True, exist_ok=True)
        with open(output, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"    ✗ 失败: {path} - {e}")
        return False


def main():
    print("=" * 50)
    print("X Grok API 文档下载工具")
    print("=" * 50)
    
    # 获取文档列表
    print("\n📋 获取文档列表...")
    docs = get_doc_list()
    
    if not docs:
        print("未找到文档")
        return
    
    print(f"   发现 {len(docs)} 个文档")
    
    # 下载文档
    print(f"\n📚 开始下载...")
    success, fail = 0, 0
    
    for path in docs:
        name = path.split('/')[-1]
        if download_doc(path):
            success += 1
            print(f"    ✓ {name}")
        else:
            fail += 1
        time.sleep(0.3)
    
    print(f"\n✅ 完成: {success} 成功, {fail} 失败")


if __name__ == "__main__":
    main()
