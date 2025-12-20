#!/usr/bin/env python3
"""验证智谱文档下载质量"""
import os

base = "BigModel Zhipu/docs"
total = 0
valid = 0
html_errors = []
empty_files = []

for root, dirs, files in os.walk(base):
    for f in files:
        if f.endswith('.md'):
            total += 1
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as fp:
                content = fp.read(500)
            
            if content.strip().startswith('<!DOCTYPE') or content.strip().startswith('<html'):
                html_errors.append(path.replace(base + "/", ""))
            elif len(content.strip()) < 50:
                empty_files.append(path.replace(base + "/", ""))
            else:
                valid += 1

print(f"总文件: {total}")
print(f"有效: {valid}")
print(f"HTML错误: {len(html_errors)}")
print(f"空/短文件: {len(empty_files)}")

if html_errors:
    print("\nHTML错误文件:")
    for f in html_errors[:5]:
        print(f"  - {f}")

if empty_files:
    print("\n空/短文件:")
    for f in empty_files[:5]:
        print(f"  - {f}")
