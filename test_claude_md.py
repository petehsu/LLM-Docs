#!/usr/bin/env python3
import requests

PROXIES = {"http": "http://127.0.0.1:10808", "https": "http://127.0.0.1:10808"}

# 测试不同的 markdown 格式
test_urls = [
    "https://platform.claude.com/docs/en/home.md",
    "https://platform.claude.com/docs/en/home.md.txt",
    "https://platform.claude.com/docs/en/home/raw",
    "https://platform.claude.com/docs/en/home?format=md",
]

output = []
for url in test_urls:
    try:
        resp = requests.get(url, proxies=PROXIES, timeout=10, allow_redirects=True)
        content_type = resp.headers.get('content-type', '')
        output.append(f"{url}")
        output.append(f"  Status: {resp.status_code}, Type: {content_type[:50]}, Size: {len(resp.text)}")
        if resp.status_code == 200:
            output.append(f"  Content preview: {resp.text[:300]}...")
    except Exception as e:
        output.append(f"{url} -> Error: {e}")
    output.append("")

with open("claude_test_result.txt", "w") as f:
    f.write("\n".join(output))
print("结果已保存到 claude_test_result.txt")
