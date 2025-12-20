#!/usr/bin/env python3
"""
构建前端部署文件
从 data 目录复制配置和文档到 frontend 目录
"""

import os
import sys
import json
import shutil
from pathlib import Path
from datetime import datetime, timezone

# 项目根目录
ROOT_DIR = Path(__file__).parent.parent.absolute()
DATA_DIR = ROOT_DIR / "data"
FRONTEND_DIR = ROOT_DIR / "frontend"

def copy_config():
    """复制配置文件"""
    src = DATA_DIR / "config"
    dst = FRONTEND_DIR / "config"
    
    if src.exists():
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
        print(f"✓ Copied config files")

def copy_logos():
    """复制 logo 文件"""
    src = DATA_DIR / "logos"
    dst = FRONTEND_DIR / "logos"
    
    if src.exists():
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
        print(f"✓ Copied logo files")

def copy_docs():
    """复制文档文件"""
    src = DATA_DIR / "docs"
    dst = FRONTEND_DIR / "docs"
    
    if src.exists():
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
        
        # 统计文档数量
        doc_count = sum(1 for _ in dst.rglob("*.md"))
        print(f"✓ Copied {doc_count} documentation files")

def build_docs_index():
    """构建文档索引"""
    docs_dir = FRONTEND_DIR / "docs"
    index = {}
    
    # 加载厂商配置
    vendors_file = FRONTEND_DIR / "config" / "vendors.json"
    if vendors_file.exists():
        with open(vendors_file, 'r', encoding='utf-8') as f:
            vendors_data = json.load(f)
            vendors = {v['id']: v for v in vendors_data.get('vendors', [])}
    else:
        vendors = {}
    
    for vendor_id, vendor in vendors.items():
        vendor_folder = vendor.get('folder', vendor_id)
        vendor_path = docs_dir / vendor_folder.split('/')[0]
        
        if not vendor_path.exists():
            continue
        
        index[vendor_id] = {
            'name': vendor['name'],
            'totalDocs': 0,
            'languages': {}
        }
        
        for lang in vendor.get('languages', []):
            lang_code = lang['code']
            lang_folder = lang.get('folder', '')
            
            if lang_folder:
                lang_path = vendor_path / lang_folder
            else:
                lang_path = vendor_path
            
            if not lang_path.exists():
                continue
            
            docs = []
            for md_file in lang_path.rglob("*.md"):
                rel_path = md_file.relative_to(lang_path)
                
                # 提取标题
                title = md_file.stem
                try:
                    content = md_file.read_text(encoding='utf-8')
                    for line in content.split('\n'):
                        if line.startswith('# '):
                            title = line[2:].strip()
                            break
                except:
                    pass
                
                # 提取文件夹
                folder = str(rel_path.parent) if rel_path.parent != Path('.') else ''
                
                docs.append({
                    'name': md_file.name,
                    'path': str(rel_path),
                    'title': title,
                    'folder': folder
                })
            
            if docs:
                index[vendor_id]['languages'][lang_code] = docs
                index[vendor_id]['totalDocs'] += len(docs)
    
    # 保存索引
    index_file = FRONTEND_DIR / "docs-index.json"
    with open(index_file, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    
    total_docs = sum(v['totalDocs'] for v in index.values())
    print(f"✓ Built docs index: {len(index)} vendors, {total_docs} documents")

def update_build_info():
    """更新构建信息"""
    site_config_file = FRONTEND_DIR / "config" / "site.json"
    
    if site_config_file.exists():
        with open(site_config_file, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        config['lastBuild'] = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')
        
        with open(site_config_file, 'w', encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=2)
        
        print(f"✓ Updated build info")

def main():
    print("=" * 50)
    print("Building Frontend")
    print("=" * 50)
    
    # 确保 frontend 目录存在
    FRONTEND_DIR.mkdir(exist_ok=True)
    
    # 复制文件
    copy_config()
    copy_logos()
    copy_docs()
    
    # 构建索引
    build_docs_index()
    
    # 更新构建信息
    update_build_info()
    
    print("=" * 50)
    print("Build complete!")
    print(f"Output: {FRONTEND_DIR}")
    print("=" * 50)

if __name__ == "__main__":
    main()
