#!/usr/bin/env python3
"""
爬取 DeepSeek API 文档 (使用 Selenium)
- 中文: https://api-docs.deepseek.com/zh-cn/
- 英文: https://api-docs.deepseek.com/
"""

import os
import re
import time
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import html2text
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL_ZH = "https://api-docs.deepseek.com/zh-cn/"
BASE_URL_EN = "https://api-docs.deepseek.com/"
OUTPUT_DIR = "DeepSeek"

# HTML to Markdown converter
h2t = html2text.HTML2Text()
h2t.ignore_links = False
h2t.ignore_images = False
h2t.body_width = 0
h2t.protect_links = True

# Global driver
driver = None


def init_driver():
    """初始化 Selenium driver"""
    global driver
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--proxy-server=http://127.0.0.1:10808')
    options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    
    driver = webdriver.Chrome(options=options)
    driver.set_page_load_timeout(30)
    return driver


def get_page(url, retries=2):
    """获取页面内容 (使用 Selenium)"""
    global driver
    for i in range(retries):
        try:
            driver.get(url)
            # 等待内容加载
            time.sleep(3)
            return driver.page_source
        except Exception as e:
            print(f"  Retry {i+1}/{retries}: {e}")
            time.sleep(1)
    # 即使超时也返回当前页面
    try:
        return driver.page_source
    except:
        return None


def extract_links(html, base_url, lang='en'):
    """从页面提取文档链接"""
    soup = BeautifulSoup(html, 'html.parser')
    links = set()
    
    # 查找侧边栏导航链接
    nav_selectors = [
        'nav a[href]',
        '.sidebar a[href]',
        '.menu a[href]',
        '[class*="sidebar"] a[href]',
        '[class*="nav"] a[href]',
        'a[href*="/docs/"]',
        'a[href*="/api/"]',
        'a[href*="/guide/"]',
    ]
    
    for selector in nav_selectors:
        for a in soup.select(selector):
            href = a.get('href', '')
            if not href or href.startswith('#') or href.startswith('javascript:'):
                continue
            
            full_url = urljoin(base_url, href)
            parsed = urlparse(full_url)
            
            # 只保留 deepseek.com 的文档链接
            if 'deepseek.com' in parsed.netloc:
                # 根据语言过滤
                if lang == 'zh':
                    if '/zh-cn/' in full_url or full_url.startswith(BASE_URL_ZH):
                        links.add(full_url.split('#')[0])
                else:
                    if '/zh-cn/' not in full_url:
                        links.add(full_url.split('#')[0])
    
    return links


def extract_content(html, url):
    """提取页面主要内容"""
    soup = BeautifulSoup(html, 'html.parser')
    
    # 移除不需要的元素
    for tag in soup.select('script, style, nav, header, footer, .sidebar, [class*="sidebar"], [class*="nav-"], .theme-doc-toc'):
        tag.decompose()
    
    # 尝试找到主内容区域 - Docusaurus 结构
    content_selectors = [
        'article',
        '.theme-doc-markdown',
        'main .container',
        'main',
        '.markdown',
        '.content',
    ]
    
    content = None
    for selector in content_selectors:
        content = soup.select_one(selector)
        if content and len(content.get_text(strip=True)) > 50:
            break
    
    if not content:
        content = soup.body if soup.body else soup
    
    # 提取标题
    title = None
    h1 = content.find('h1')
    if h1:
        title = h1.get_text(strip=True)
    else:
        title_tag = soup.find('title')
        if title_tag:
            title = title_tag.get_text(strip=True).split('|')[0].strip()
    
    # 转换为 Markdown
    markdown = h2t.handle(str(content))
    
    # 清理 Markdown
    markdown = re.sub(r'\n{3,}', '\n\n', markdown)
    markdown = re.sub(r'^\s*\n', '', markdown)
    markdown = markdown.strip()
    
    return title, markdown


def get_filename_from_url(url, lang):
    """从 URL 生成文件名"""
    parsed = urlparse(url)
    path = parsed.path.strip('/')
    
    # 移除语言前缀
    if path.startswith('zh-cn/'):
        path = path[6:]
    
    if not path:
        path = 'index'
    
    # 清理路径
    path = path.replace('/', '_')
    path = re.sub(r'[^\w\-_]', '_', path)
    path = re.sub(r'_+', '_', path)
    
    return f"{path}.md"


def crawl_deepseek(base_url, lang, output_subdir):
    """爬取 DeepSeek 文档"""
    output_path = os.path.join(OUTPUT_DIR, output_subdir)
    os.makedirs(output_path, exist_ok=True)
    
    print(f"\n{'='*50}")
    print(f"Crawling DeepSeek ({lang}): {base_url}")
    print(f"Output: {output_path}")
    print(f"{'='*50}")
    
    # 获取首页
    print("\nFetching homepage...")
    html = get_page(base_url)
    if not html:
        print("Failed to fetch homepage")
        return 0
    
    # 提取所有链接
    links = extract_links(html, base_url, lang)
    links.add(base_url)
    
    print(f"Found {len(links)} links")
    for link in sorted(links)[:10]:
        print(f"  - {link}")
    if len(links) > 10:
        print(f"  ... and {len(links) - 10} more")
    
    # 下载所有页面
    downloaded = 0
    all_links = sorted(links)
    
    for i, url in enumerate(all_links):
        print(f"[{i+1}/{len(all_links)}] {url}")
        
        html = get_page(url)
        if not html:
            print("  Failed")
            continue
        
        title, markdown = extract_content(html, url)
        if not markdown or len(markdown) < 50:
            print(f"  Skipped (content length: {len(markdown) if markdown else 0})")
            continue
        
        filename = get_filename_from_url(url, lang)
        filepath = os.path.join(output_path, filename)
        
        # 添加标题
        if title and not markdown.startswith(f'# {title}'):
            markdown = f"# {title}\n\n{markdown}"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(markdown)
        
        downloaded += 1
        print(f"  ✓ Saved: {filename} ({len(markdown)} chars)")
    
    return downloaded


def main():
    print("="*60)
    print("DeepSeek API Documentation Crawler")
    print("="*60)
    
    # 初始化浏览器
    print("\nInitializing browser...")
    init_driver()
    
    try:
        # 爬取中文文档
        zh_count = crawl_deepseek(BASE_URL_ZH, 'zh', '简体中文')
        
        # 爬取英文文档
        en_count = crawl_deepseek(BASE_URL_EN, 'en', 'English')
        
        print("\n" + "="*60)
        print(f"Done!")
        print(f"  Chinese: {zh_count} documents")
        print(f"  English: {en_count} documents")
        print(f"  Total: {zh_count + en_count} documents")
        print("="*60)
    finally:
        if driver:
            driver.quit()


if __name__ == "__main__":
    main()
