#!/usr/bin/env python3
"""修复 Claude 文档中的 HTML 错误文件"""

import os
import time
import requests

PROXIES = {"http": "http://127.0.0.1:10808", "https": "http://127.0.0.1:10808"}

# 语言代码映射（文件夹名 -> URL 代码）
LANG_MAP = {
    "English": "en",
    "Deutsch": "de", 
    "Español": "es",
    "Français": "fr",
    "Italiano": "it",
    "日本語": "ja",
    "한국어": "ko",
    "Português-BR": "pt-BR",
    "Русский": "ru",
    "简体中文": "zh-CN",
    "繁體中文": "zh-TW",
    "Bahasa-Indonesia": "id",
}

def is_html(content):
    """检查内容是否为 HTML"""
    c = content.strip()
    return c.startswith('<!DOCTYPE') or c.startswith('<html')

def fix_file(lang_folder, rel_path):
    """修复单个文件"""
    lang_code = LANG_MAP.get(lang_folder)
    if not lang_code:
        return False
    
    # 构建 URL（去掉 .md 后缀再加回来）
    page = rel_path.replace('.md', '')
    url = f"https://platform.claude.com/docs/{lang_code}/{page}.md"
    output = f"Anthropic Claude/{lang_folder}/{rel_path}"
    
    try:
        resp = requests.get(url, proxies=PROXIES, timeout=30)
        content = resp.text.lstrip()
        
        if is_html(content):
            print(f"  ✗ 仍为 HTML: {rel_path}")
            return False
        
        os.makedirs(os.path.dirname(output), exist_ok=True)
        with open(output, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ {rel_path}")
        return True
    except Exception as e:
        print(f"  ✗ 错误: {rel_path} - {e}")
        return False

def scan_and_fix(lang_folder):
    """扫描并修复指定语言的 HTML 错误文件"""
    base = f"Anthropic Claude/{lang_folder}"
    if not os.path.exists(base):
        print(f"目录不存在: {base}")
        return
    
    html_files = []
    for root, dirs, files in os.walk(base):
        for f in files:
            if f.endswith('.md'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as fp:
                    content = fp.read(200)
                if is_html(content):
                    rel = path.replace(base + "/", "")
                    html_files.append(rel)
    
    if not html_files:
        print(f"[{lang_folder}] 无 HTML 错误文件")
        return
    
    print(f"\n[{lang_folder}] 发现 {len(html_files)} 个 HTML 错误文件，开始修复...")
    
    success = 0
    for rel_path in html_files:
        if fix_file(lang_folder, rel_path):
            success += 1
        time.sleep(0.3)
    
    print(f"  完成: {success}/{len(html_files)} 修复成功")

if __name__ == "__main__":
    # 修复所有语言
    for lang in LANG_MAP.keys():
        scan_and_fix(lang)
    print("\n✅ 全部完成!")
