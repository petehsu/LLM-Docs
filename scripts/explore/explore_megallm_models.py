#!/usr/bin/env python3
"""
探测 MegaLLM 模型列表 API
"""

import requests

proxies = {'http': 'http://127.0.0.1:10808', 'https': 'http://127.0.0.1:10808'}
headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    'Accept': 'application/json',
}

# 尝试可能的 API 端点
urls = [
    'https://megallm.io/api/models',
    'https://megallm.io/api/v1/models',
    'https://api.megallm.io/models',
    'https://api.megallm.io/v1/models',
    'https://megallm.io/dashboard/models',
]

for url in urls:
    try:
        resp = requests.get(url, proxies=proxies, headers=headers, timeout=15)
        content_type = resp.headers.get('content-type', '')
        print(f'{resp.status_code} | {content_type[:30]} | {url}')
        if resp.status_code == 200 and 'json' in content_type:
            print(f'    预览: {resp.text[:200]}...')
    except Exception as e:
        print(f'ERROR | {url} | {e}')
