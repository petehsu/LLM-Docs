#!/usr/bin/env python3
"""探测 Gemini 文档结构 - 从 HTML 页面爬取侧边栏分类"""
import requests
import re
import json

PROXIES = {"http": "http://127.0.0.1:10808", "https": "http://127.0.0.1:10808"}

# 获取 HTML 页面
base_url = "https://ai.google.dev/gemini-api/docs"
resp = requests.get(f"{base_url}?hl=zh-cn", proxies=PROXIES, timeout=30)

# 保存 HTML 用于分析
with open("gemini_page.html", "w", encoding="utf-8") as f:
    f.write(resp.text)

# 尝试找侧边栏导航结构
# 查找 devsite-nav 或类似结构
nav_pattern = r'<devsite-nav[^>]*>(.*?)</devsite-nav>'
nav_match = re.search(nav_pattern, resp.text, re.DOTALL)

if nav_match:
    nav_html = nav_match.group(1)
    with open("gemini_nav.html", "w", encoding="utf-8") as f:
        f.write(nav_html)
    print("侧边栏 HTML 已保存到 gemini_nav.html")
else:
    print("未找到 devsite-nav，尝试其他方式...")
    
# 查找 JSON 数据结构 (Google 站点通常有)
json_pattern = r'<script[^>]*>.*?(\{["\']navigation["\'].*?\})\s*</script>'
json_match = re.search(json_pattern, resp.text, re.DOTALL)

# 提取所有带分类的链接结构
# 查找类似 "核心功能" "工具和代理" 等分类标题
category_pattern = r'<[^>]+class="[^"]*devsite-nav-title[^"]*"[^>]*>([^<]+)</|<h\d[^>]*>([^<]+)</h\d>'
categories = re.findall(category_pattern, resp.text)

print(f"找到可能的分类: {categories[:20]}")
print(f"\nHTML 已保存到 gemini_page.html，可以手动查看结构")
