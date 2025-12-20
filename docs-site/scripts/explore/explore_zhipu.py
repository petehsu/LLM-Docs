#!/usr/bin/env python3
"""
探测智谱 BigModel 文档结构
"""

import requests
import re
import json

PROXIES = {'http': 'http://127.0.0.1:10808', 'https': 'http://127.0.0.1:10808'}
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

def fetch_page():
    """获取文档首页 HTML"""
    url = "https://docs.bigmodel.cn/cn/guide/start/introduction"
    resp = requests.get(url, proxies=PROXIES, headers=HEADERS, timeout=30)
    return resp.text

def extract_links(html):
    """从 HTML 中提取文档链接"""
    # 查找侧边栏链接
    # 常见模式: href="/cn/xxx/yyy"
    pattern = r'href="(/cn/[^"]+)"'
    links = re.findall(pattern, html)
    
    # 去重并排序
    unique = sorted(set(links))
    return unique

def test_md_url(path):
    """测试 .md URL 是否可用"""
    url = f"https://docs.bigmodel.cn{path}.md"
    try:
        resp = requests.get(url, proxies=PROXIES, headers=HEADERS, timeout=10)
        if resp.status_code == 200:
            content = resp.text[:100]
            is_html = content.strip().startswith('<!DOCTYPE') or content.strip().startswith('<html')
            return not is_html
    except:
        pass
    return False

def main():
    print("=" * 50)
    print("智谱 BigModel 文档结构探测")
    print("=" * 50)
    
    print("\n📋 获取页面...")
    html = fetch_page()
    print(f"   页面大小: {len(html)} 字节")
    
    # 保存 HTML 供分析
    with open('zhipu_page.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("   已保存到 zhipu_page.html")
    
    print("\n🔍 提取链接...")
    links = extract_links(html)
    print(f"   发现 {len(links)} 个链接")
    
    # 过滤文档链接
    doc_links = [l for l in links if not l.endswith('/') and '#' not in l]
    print(f"   文档链接: {len(doc_links)} 个")
    
    # 显示前 20 个
    print("\n📄 链接预览:")
    for link in doc_links[:20]:
        print(f"   {link}")
    if len(doc_links) > 20:
        print(f"   ... 还有 {len(doc_links) - 20} 个")
    
    # 保存链接
    with open('zhipu_links.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(doc_links))
    print(f"\n   已保存到 zhipu_links.txt")
    
    # 测试几个 .md URL
    print("\n🧪 测试 .md URL...")
    test_paths = doc_links[:5] if doc_links else ['/cn/guide/start/introduction']
    for path in test_paths:
        ok = test_md_url(path)
        status = "✓" if ok else "✗"
        print(f"   {status} {path}.md")

if __name__ == "__main__":
    main()
