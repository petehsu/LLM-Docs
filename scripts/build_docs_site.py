#!/usr/bin/env python3
"""
构建文档网站 - 生成文档索引和复制文件
"""

import os
import json
import shutil
import re
from pathlib import Path
from datetime import datetime

# 厂商配置（与 vendors.js 保持一致）
VENDORS = [
    {
        'id': 'openai',
        'name': 'OpenAI',
        'folder': 'OpenAI/docs',
        'languages': [
            {'code': 'en', 'folder': ''}
        ]
    },
    {
        'id': 'anthropic',
        'name': 'Anthropic Claude',
        'folder': 'Anthropic Claude',
        'languages': [
            {'code': 'en', 'folder': 'English'},
            {'code': 'zh-CN', 'folder': '简体中文'},
            {'code': 'zh-TW', 'folder': '繁體中文'},
            {'code': 'ja', 'folder': '日本語'},
            {'code': 'ko', 'folder': '한국어'},
            {'code': 'de', 'folder': 'Deutsch'},
            {'code': 'es', 'folder': 'Español'},
            {'code': 'fr', 'folder': 'Français'},
            {'code': 'it', 'folder': 'Italiano'},
            {'code': 'pt-BR', 'folder': 'Português'},
            {'code': 'ru', 'folder': 'Русский'},
            {'code': 'id', 'folder': 'Indonesia'},
        ]
    },
    {
        'id': 'google',
        'name': 'Google Gemini',
        'folder': 'Google Gemini/docs',
        'languages': [
            {'code': 'zh', 'folder': ''}
        ]
    },
    {
        'id': 'meta',
        'name': 'Meta Llama',
        'folder': 'Meta Llama/docs',
        'languages': [
            {'code': 'en', 'folder': ''}
        ]
    },
    {
        'id': 'xai',
        'name': 'xAI Grok',
        'folder': 'X Grok/docs',
        'languages': [
            {'code': 'en', 'folder': ''}
        ]
    },
    {
        'id': 'moonshot',
        'name': 'Moonshot Kimi',
        'folder': 'Moonshot Kimi',
        'languages': [
            {'code': 'zh', 'folder': '简体中文'},
            {'code': 'en', 'folder': 'English'}
        ]
    },
    {
        'id': 'zhipu',
        'name': 'Zhipu BigModel',
        'folder': 'BigModel Zhipu',
        'languages': [
            {'code': 'zh', 'folder': 'docs'},
            {'code': 'en', 'folder': 'English'}
        ]
    },
    {
        'id': 'minimax',
        'name': 'MiniMax',
        'folder': 'MiniMax',
        'languages': [
            {'code': 'en', 'folder': 'English'},
            {'code': 'zh', 'folder': '简体中文'}
        ]
    },
    {
        'id': 'megallm',
        'name': 'MegaLLM',
        'folder': 'MegaLLM',
        'languages': [
            {'code': 'en', 'folder': 'English'},
            {'code': 'zh', 'folder': '简体中文'},
            {'code': 'ru', 'folder': 'Русский'},
            {'code': 'models', 'folder': 'models'}  # 模型目录
        ]
    },
    {
        'id': 'deepseek',
        'name': 'DeepSeek',
        'folder': 'DeepSeek',
        'languages': [
            {'code': 'en', 'folder': 'English'},
            {'code': 'zh', 'folder': '简体中文'}
        ]
    },
]

SITE_DIR = 'docs-site'
DOCS_DIR = 'docs-site/docs'


def extract_title(filepath):
    """从 Markdown 文件提取标题"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read(1000)
            match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            if match:
                return match.group(1).strip()
    except:
        pass
    return None


def scan_language_docs(base_folder, lang_folder):
    """扫描特定语言的文档"""
    if lang_folder:
        folder = os.path.join(base_folder, lang_folder)
    else:
        folder = base_folder
    
    if not os.path.exists(folder):
        return []
    
    docs = []
    
    for root, dirs, files in os.walk(folder):
        for file in files:
            if not file.endswith('.md'):
                continue
            
            filepath = os.path.join(root, file)
            rel_path = os.path.relpath(filepath, folder)
            
            title = extract_title(filepath)
            if not title:
                title = file.replace('.md', '').replace('-', ' ').replace('_', ' ').title()
            
            parts = rel_path.split(os.sep)
            doc_folder = parts[0] if len(parts) > 1 else ''
            
            docs.append({
                'name': file,
                'path': rel_path.replace(os.sep, '/'),
                'title': title,
                'folder': doc_folder,
            })
    
    docs.sort(key=lambda x: x['path'])
    return docs


def scan_vendor(vendor):
    """扫描厂商所有语言的文档"""
    base_folder = vendor['folder']
    
    languages = {}
    total_docs = 0
    
    for lang in vendor['languages']:
        lang_code = lang['code']
        lang_folder = lang['folder']
        
        docs = scan_language_docs(base_folder, lang_folder)
        languages[lang_code] = docs
        total_docs += len(docs)
    
    return {
        'languages': languages,
        'totalDocs': total_docs,
    }


def copy_docs():
    """复制文档到网站目录"""
    os.makedirs(DOCS_DIR, exist_ok=True)
    
    for vendor in VENDORS:
        src_folder = vendor['folder']
        dst_folder = os.path.join(DOCS_DIR, vendor['folder'])
        
        if os.path.exists(src_folder):
            if os.path.exists(dst_folder):
                shutil.rmtree(dst_folder)
            shutil.copytree(src_folder, dst_folder)
            print(f"  Copied: {vendor['name']}")
    
    # 复制 README 文件到 docs-site 目录
    if os.path.exists('README.md'):
        shutil.copy('README.md', os.path.join(SITE_DIR, 'README.md'))
        print("  Copied: README.md")
    if os.path.exists('README_CN.md'):
        shutil.copy('README_CN.md', os.path.join(SITE_DIR, 'README_CN.md'))
        print("  Copied: README_CN.md")


def build_index():
    """构建文档索引"""
    print("=" * 50)
    print("Building Documentation Site")
    print("=" * 50)
    
    print("\nScanning documents...")
    index = {}
    total_docs = 0
    
    for vendor in VENDORS:
        vendor_data = scan_vendor(vendor)
        index[vendor['id']] = vendor_data
        total_docs += vendor_data['totalDocs']
        
        lang_counts = ', '.join([
            f"{code}: {len(docs)}" 
            for code, docs in vendor_data['languages'].items()
        ])
        print(f"  {vendor['name']}: {vendor_data['totalDocs']} docs ({lang_counts})")
    
    # 保存索引
    index_path = os.path.join(SITE_DIR, 'docs-index.json')
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    print(f"\nSaved index to {index_path}")
    
    # 复制文档
    print("\nCopying documents...")
    copy_docs()
    
    # 更新构建时间
    build_info = {
        'buildTime': datetime.now().isoformat(),
        'totalDocs': total_docs,
        'vendorCount': len(VENDORS),
    }
    build_info_path = os.path.join(SITE_DIR, 'build-info.json')
    with open(build_info_path, 'w', encoding='utf-8') as f:
        json.dump(build_info, f, ensure_ascii=False, indent=2)
    
    print(f"\nDone: {total_docs} documents")
    print(f"\nStart server: cd {SITE_DIR} && python3 -m http.server 8080")
    print(f"Open: http://localhost:8080")


if __name__ == "__main__":
    build_index()
