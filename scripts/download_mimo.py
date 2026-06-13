#!/usr/bin/env python3
"""
6bi46K+3IFhpYW9taSBNaU1vIEFQSSDkvb/nlJ/nianog4UpIChVc2luZyBTZWxlbml1bSkK
6L6T54mNIFVSTDoKLSB3YWyNlOi9rjogaHR0cHM6Ly9taW1vLm1pLmNvbS9kb2NzL3tsYW5nfS97cGF0aH0KLSBTaXRlbWFwOiAodHRwczovL21pb28ubWkuY29tL3NpdGVtYXAueG1sKQotIOaWhyA6IC9kb2NzL3poLUNOLy4uCi0gRW5nbGlzaDogL2RvY3MvZW4tVVMvLi4K
CueIgSBSZWFjdCBTUEEg5qCH5a+8IHhTZWxlbml1bSjpl7TnkIPpgInmlpnmnZAKLgo=
"""
import os, re, sys, time
import requests
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, quote
import html2text
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

sys.stdout.reconfigure(line_buffering=True)

PROXY = "http://127.0.0.1:10808"
USE_PROXY = True
SITEMAP_URL = "https://mimo.mi.com/sitemap.xml"
BASE_URL = "https://mimo.mi.com"
OUTPUT_DIR = "Xiaomi MiMo"

EXTRA_PAGES = [
    "quick-start/usage-guide/tool-calling/tool-call",
    "quick-start/terms/service",
    "quick-start/terms/privacy",
    "quick-start/terms/invite-friend",
]

h2t = html2text.HTML2Text()
h2t.ignore_links = False
h2t.ignore_images = False
h2t.body_width = 0
h2t.protect_links = True
h2t.unicode_snob = True

driver = None

def init_driver():
    global driver
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    if USE_PROXY:
        options.add_argument(f"--proxy-server={PROXY}")
    options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")
    driver = webdriver.Chrome(options=options)
    driver.set_page_load_timeout(30)
    return driver

def get_page(url, retries=2):
    global driver
    for i in range(retries):
        try:
            driver.get(url)
            time.sleep(3)
            try:
                WebDriverWait(driver, 8).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "article, .doc-content, main"))
                )
            except Exception:
                pass
            time.sleep(1)
            return driver.page_source
        except Exception as e:
            print(f"  Retry {i+1}/{retries}: {e}")
            time.sleep(2)
    try:
        return driver.page_source
    except:
        return None

def fetch_sitemap():
    print("Fetching sitemap...")
    proxies = {"http": PROXY, "https": PROXY} if USE_PROXY else None
    try:
        resp = requests.get(SITEMAP_URL, proxies=proxies, timeout=30)
        resp.raise_for_status()
    except Exception as e:
        print(f"  Failed: {e}")
        return []
    root = ET.fromstring(resp.text)
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = []
    for url_elem in root.findall(".//s:url", ns):
        loc = url_elem.find("s:loc", ns)
        if loc is not None and loc.text:
            urls.append(loc.text.strip())
    print(f"  Found {len(urls)} URLs")
    return urls

def get_all_doc_urls():
    sitemap_urls = fetch_sitemap()
    zh_urls = set()
    en_urls = set()
    for url in sitemap_urls:
        if "/docs/zh-CN/" in url:
            path = url.split("/docs/zh-CN/")[-1]
            if path and not path.endswith("/"):
                zh_urls.add(path)
        elif "/docs/en-US/" in url:
            path = url.split("/docs/en-US/")[-1]
            if path and not path.endswith("/"):
                en_urls.add(path)
    for extra in EXTRA_PAGES:
        zh_urls.add(extra)
        en_urls.add(extra)
    print(f"  zh-CN: {len(zh_urls)}, en-US: {len(en_urls)}")
    return sorted(zh_urls), sorted(en_urls)

def extract_content(html, url):
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup.select("script, style, nav, header, footer, [class*=sidebar], [class*=nav-], [class*=cookie], [class*=banner], [class*=announcement]"):
        tag.decompose()
    content_selectors = ["article", ".doc-content", "[class*=doc-content]", "[class*=markdown]", "main .content", "main article", "main"]
    content = None
    for sel in content_selectors:
        content = soup.select_one(sel)
        if content and len(content.get_text(strip=True)) > 50:
            break
    if not content:
        content = soup.body if soup.body else soup
    title = None
    h1 = content.find("h1")
    if h1:
        title = h1.get_text(strip=True)
    else:
        title_tag = soup.find("title")
        if title_tag:
            title = re.split(r"[|\uff5c]", title_tag.get_text(strip=True))[0].strip()
    for bc in content.select("[class*=breadcrumb], [class*=toc]"):
        bc.decompose()
    markdown = h2t.handle(str(content))
    markdown = re.sub(r"\n{3,}", "\n\n", markdown)
    markdown = markdown.strip()
    return title, markdown

def url_path_to_filename(path, lang):
    if path.startswith("zh-CN/"):
        path = path[6:]
    elif path.startswith("en-US/"):
        path = path[6:]
    if not path:
        path = "index"
    path = quote(path, safe="/")
    filename = path.replace("/", "_")
    filename = re.sub(r"[^\w\-\u4e00-\u9fff.]", "_", filename)
    filename = re.sub(r"_+", "_", filename).strip("_")
    if not filename:
        filename = "index"
    return f"{filename}.md"

def crawl_language(doc_paths, lang_code, lang_name, output_subdir):
    output_path = os.path.join(OUTPUT_DIR, output_subdir)
    os.makedirs(output_path, exist_ok=True)
    sep = "=" * 50
    print(f"\n{sep}")
    print(f"Crawling MiMo ({lang_name}): {len(doc_paths)} pages")
    print(f"Output: {output_path}")
    print(sep)
    downloaded = skipped = failed = 0
    failed_pages = []
    for i, path in enumerate(doc_paths):
        url = f"{BASE_URL}/docs/{lang_code}/{path}"
        print(f"[{i+1}/{len(doc_paths)}] {path}")
        html = get_page(url)
        if not html:
            print("  Failed to load")
            failed += 1
            failed_pages.append(path)
            continue
        title, markdown = extract_content(html, url)
        if not markdown or len(markdown) < 30:
            print(f"  Skipped (too short: {len(markdown) if markdown else 0})")
            skipped += 1
            continue
        filename = url_path_to_filename(path, lang_code)
        filepath = os.path.join(output_path, filename)
        if title and not markdown.startswith(f"# {title}"):
            markdown = f"# {title}\n\n{markdown}"
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(markdown)
        downloaded += 1
        print(f"  Saved: {filename} ({len(markdown)} chars)")
        time.sleep(0.5)
    print(f"\n  Results: {downloaded} downloaded, {skipped} skipped, {failed} failed")
    if failed_pages:
        for p in failed_pages[:10]:
            print(f"    - {p}")
    return downloaded

def download_logo():
    logo_path = os.path.join("data", "logos", "mimo.svg")
    if os.path.exists(logo_path):
        print("Logo exists, skipping.")
        return
    print("Downloading MiMo logo...")
    proxies = {"http": PROXY, "https": PROXY} if USE_PROXY else None
    for logo_url in ["https://mimo.mi.com/favicon.svg", "https://mimo.mi.com/favicon.ico"]:
        try:
            resp = requests.get(logo_url, proxies=proxies, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
            if resp.status_code == 200 and len(resp.content) > 100:
                if "svg" in resp.headers.get("content-type", "") or logo_url.endswith(".svg"):
                    with open(logo_path, "w", encoding="utf-8") as f:
                        f.write(resp.text)
                else:
                    with open(logo_path, "wb") as f:
                        f.write(resp.content)
                print(f"  Saved from {logo_url}")
                return
        except Exception:
            continue
    with open(logo_path, "w", encoding="utf-8") as f:
        f.write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#FF6900"/><text x="50" y="60" font-size="40" text-anchor="middle" fill="white" font-family="Arial">Mi</text></svg>')
    print("  Created placeholder logo")

def main():
    print("=" * 60)
    print("Xiaomi MiMo API Documentation Crawler")
    print("=" * 60)
    download_logo()
    print("\nDiscovering pages...")
    zh_paths, en_paths = get_all_doc_urls()
    if not zh_paths and not en_paths:
        print("No pages found!")
        return
    print("\nInitializing browser...")
    init_driver()
    try:
        zh_count = crawl_language(zh_paths, "zh-CN", "简体中文", "简体中文")
        en_count = crawl_language(en_paths, "en-US", "English", "English")
        sep = "=" * 60
        print(f"\n{sep}")
        print(f"Done! zh-CN: {zh_count}, en-US: {en_count}, Total: {zh_count + en_count}")
        print(sep)
    finally:
        if driver:
            driver.quit()

if __name__ == "__main__":
    main()
