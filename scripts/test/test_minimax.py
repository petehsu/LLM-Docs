#!/usr/bin/env python3
"""测试 MiniMax URL 格式"""
import requests

proxies = {'http': 'http://127.0.0.1:10808', 'https': 'http://127.0.0.1:10808'}
headers = {'User-Agent': 'Mozilla/5.0'}

urls = [
    ('EN', 'https://platform.minimax.io/docs/guides/models-intro.md'),
    ('CN', 'https://platform.minimaxi.com/docs/guides/models-intro.md'),
]

for lang, url in urls:
    try:
        resp = requests.get(url, proxies=proxies, headers=headers, timeout=20)
        content = resp.text[:300]
        is_html = content.strip().startswith('<!DOCTYPE') or content.strip().startswith('<html')
        is_md = content.strip().startswith('#') or '##' in content[:500]
        print(f'{lang}: {resp.status_code} | HTML={is_html} | MD={is_md}')
        if not is_html:
            print(f'    预览: {content[:150]}...')
    except Exception as e:
        print(f'{lang}: ERROR - {e}')
