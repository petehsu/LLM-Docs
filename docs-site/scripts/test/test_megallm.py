#!/usr/bin/env python3
"""测试 MegaLLM URL 格式"""
import requests

proxies = {'http': 'http://127.0.0.1:10808', 'https': 'http://127.0.0.1:10808'}
headers = {'User-Agent': 'Mozilla/5.0'}

urls = [
    'https://docs.megallm.io/en/home/introduction.md',
    'https://docs.megallm.io/zh/home/introduction.md',
    'https://docs.megallm.io/llms.txt',
]

for url in urls:
    try:
        resp = requests.get(url, proxies=proxies, headers=headers, timeout=20)
        content = resp.text[:300]
        is_html = content.strip().startswith('<!DOCTYPE') or content.strip().startswith('<html')
        is_md = content.strip().startswith('#') or '##' in content[:500]
        print(f'{resp.status_code} | HTML={is_html} | MD={is_md} | {url}')
        if not is_html and resp.status_code == 200:
            print(f'    预览: {content[:150]}...')
    except Exception as e:
        print(f'ERROR | {url} | {e}')
