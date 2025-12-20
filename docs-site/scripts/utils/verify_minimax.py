#!/usr/bin/env python3
"""验证 MiniMax 文档下载质量"""
import os

for lang in ['English', '简体中文']:
    base = f"MiniMax/{lang}"
    total = valid = 0
    html_errors = []
    
    for root, dirs, files in os.walk(base):
        for f in files:
            if f.endswith('.md'):
                total += 1
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as fp:
                    content = fp.read(500)
                
                if content.strip().startswith('<!DOCTYPE') or content.strip().startswith('<html'):
                    html_errors.append(path.replace(base + "/", ""))
                else:
                    valid += 1
    
    print(f"[{lang}] 总文件: {total}, 有效: {valid}, HTML错误: {len(html_errors)}")
