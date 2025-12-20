#!/usr/bin/env python3
"""
智谱 BigModel API 文档批量下载工具

URL 规律:
- 页面: https://docs.bigmodel.cn/cn/{section}/{path}
- Markdown: https://docs.bigmodel.cn/cn/{section}/{path}.md
- 仅中文，无多语言支持
"""

import sys
import time
import re
import requests
from pathlib import Path

sys.stdout.reconfigure(line_buffering=True)

PROXIES = {"http": "http://127.0.0.1:10808", "https": "http://127.0.0.1:10808"}
USE_PROXY = True

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/markdown,text/plain,*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

OUTPUT_BASE = "BigModel Zhipu/docs"

# 各 tab 页面的入口，用于爬取完整链接列表
TAB_PAGES = [
    "/cn/guide/start/introduction",  # 使用指南
    "/cn/api/introduction",          # API 文档
    "/cn/guide/develop/claude",      # 场景示例
    "/cn/coding-plan/overview",      # 编码套餐
    "/cn/update/new-releases",       # 更新日志
    "/cn/update/promotion",          # 上新活动
    "/cn/terms/user-agreement",      # 条款与协议
    "/cn/faq/api-code",              # 常见问题
]


def fetch_page(path):
    """获取页面 HTML"""
    url = f"https://docs.bigmodel.cn{path}"
    try:
        resp = requests.get(url, proxies=PROXIES if USE_PROXY else None,
                          headers=HEADERS, timeout=30)
        return resp.text
    except Exception as e:
        print(f"    获取页面失败: {path} - {e}")
        return ""


def extract_links(html):
    """从 HTML 中提取文档链接"""
    links = re.findall(r'href="(/cn/[^"#]+)"', html)
    return set(links)


def get_all_doc_links():
    """从所有 tab 页面获取完整文档链接列表"""
    all_links = set()
    
    for tab in TAB_PAGES:
        print(f"  爬取 {tab}...")
        html = fetch_page(tab)
        if html:
            links = extract_links(html)
            all_links.update(links)
            print(f"    发现 {len(links)} 个链接")
        time.sleep(0.5)
    
    return sorted(all_links)


def download_doc(path, skip_existing=True):
    """下载单个文档"""
    url = f"https://docs.bigmodel.cn{path}.md"
    
    # 输出路径: BigModel Zhipu/docs/xxx.md
    # 去掉开头的 /cn/
    rel_path = path.replace('/cn/', '', 1)
    output = f"{OUTPUT_BASE}/{rel_path}.md"
    
    # 跳过已存在的文件
    if skip_existing and Path(output).exists():
        return True, "跳过"
    
    try:
        resp = requests.get(url, proxies=PROXIES if USE_PROXY else None,
                          headers=HEADERS, timeout=30)
        
        if resp.status_code == 404:
            return False, "404"
        
        content = resp.text
        
        # 检查是否为 HTML（错误页面）
        if content.strip().startswith('<!DOCTYPE') or content.strip().startswith('<html'):
            return False, "HTML"
        
        # 检查内容是否有效
        if len(content.strip()) < 10:
            return False, "空"
        
        Path(output).parent.mkdir(parents=True, exist_ok=True)
        with open(output, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, "OK"
    except Exception as e:
        return False, str(e)


def main():
    print("=" * 50)
    print("智谱 BigModel API 文档下载工具")
    print("=" * 50)
    
    # 获取所有文档链接
    print("\n📋 爬取文档链接...")
    docs = get_all_doc_links()
    
    if not docs:
        print("未找到文档")
        return
    
    print(f"\n   共发现 {len(docs)} 个唯一链接")
    
    # 保存链接列表
    with open('zhipu_links.txt', 'w') as f:
        f.write('\n'.join(docs))
    
    # 下载文档
    print(f"\n📚 开始下载...")
    success, fail = 0, 0
    failed_docs = []
    
    skipped = 0
    for path in docs:
        name = path.split('/')[-1]
        ok, status = download_doc(path)
        if ok:
            if status == "跳过":
                skipped += 1
            else:
                success += 1
                print(f"    ✓ {name}")
        else:
            fail += 1
            failed_docs.append((path, status))
            print(f"    ✗ {name} ({status})")
        if status != "跳过":
            time.sleep(0.3)
    
    print(f"\n✅ 完成: {success} 新下载, {skipped} 跳过, {fail} 失败")
    
    if failed_docs:
        print("\n❌ 失败列表:")
        for path, status in failed_docs[:10]:
            print(f"    {path} - {status}")
        if len(failed_docs) > 10:
            print(f"    ... 还有 {len(failed_docs) - 10} 个")


if __name__ == "__main__":
    main()
