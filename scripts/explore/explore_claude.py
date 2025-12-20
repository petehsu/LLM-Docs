#!/usr/bin/env python3
"""探测 Claude 文档结构"""
import requests
import re

PROXIES = {"http": "http://127.0.0.1:10808", "https": "http://127.0.0.1:10808"}

# 语言列表
LANGUAGES = [
    ("en", "English"),
    ("de", "Deutsch"),
    ("es", "Español"),
    ("fr", "Français"),
    ("it", "Italiano"),
    ("ja", "日本語"),
    ("ko", "한국어"),
    ("pt-br", "Português-BR"),
    ("ru", "Русский"),
    ("zh-cn", "简体中文"),
    ("zh-tw", "繁體中��"),
    ("id", "Bahasa-Indonesia"),
]

base_url = "https://platform.claude.com/docs"

# 测试 URL 格式: /docs/{locale}/home
print("测试 Claude 文档 URL 格式...\n")

for lang_code, lang_name in LANGUAGES[:3]:
    # 测试 HTML 页面
    url = f"{base_url}/{lang_code}/home"
    try:
        resp = requests.get(url, proxies=PROXIES, timeout=15)
        print(f"  {lang_name} ({lang_code}): {resp.status_code} ({len(resp.text)} bytes)")
    except Exception as e:
        print(f"  {lang_name}: 错误 - {e}")

# 获取英文版页面，提取所有文档链接
print("\n获取文档结构...")
resp = requests.get(f"{base_url}/en/home", proxies=PROXIES, timeout=30)

# 保存 HTML
with open("claude_page.html", "w", encoding="utf-8") as f:
    f.write(resp.text)

# 提取所有 /docs/en/ 链接
links = re.findall(r'href="(/docs/en/[^"#]+)"', resp.text)
links = list(set(links))
links.sort()

output = f"找到 {len(links)} 个文档链接:\n\n"
for link in links:
    path = link.replace("/docs/en/", "")
    output += f"{path}\n"

with open("claude_links.txt", "w") as f:
    f.write(output)

print(f"找到 {len(links)} 个链接，已保存到 claude_links.txt")
