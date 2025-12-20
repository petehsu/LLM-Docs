#!/usr/bin/env python3
"""测试 MegaLLM 多语言支持"""
import requests

proxies = {'http': 'http://127.0.0.1:10808', 'https': 'http://127.0.0.1:10808'}
headers = {'User-Agent': 'Mozilla/5.0'}

langs = ['en', 'cn', 'ru', 'ja', 'ko', 'de', 'fr', 'es']

for lang in langs:
    url = f'https://docs.megallm.io/{lang}/home/introduction.md'
    try:
        resp = requests.get(url, proxies=proxies, headers=headers, timeout=15)
        is_html = resp.text[:100].strip().startswith('<!DOCTYPE')
        is_md = resp.text[:100].strip().startswith('#')
        print(f'{lang}: {resp.status_code} | MD={is_md}')
        if resp.status_code == 200 and is_md:
            print(f'    预览: {resp.text[:80]}...')
    except Exception as e:
        print(f'{lang}: ERROR - {e}')
