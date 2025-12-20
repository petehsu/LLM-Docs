#!/usr/bin/env python3
"""提取智谱文档链接"""
import re

with open('zhipu_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 提取所有 /cn/ 开头的链接
links = re.findall(r'href="(/cn/[^"#]+)"', html)
unique = sorted(set(links))

print(f"发现 {len(unique)} 个唯一链接:")
for link in unique:
    print(f"  {link}")

# 保存
with open('zhipu_links.txt', 'w') as f:
    f.write('\n'.join(unique))
print(f"\n已保存到 zhipu_links.txt")
