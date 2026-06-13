#!/usr/bin/env python3
"""
自动爬取调度器 - 定时爬取各家 LLM API 文档
包含详细的事件日志系统
"""

import os
import sys
import json
import subprocess
import time
import traceback
import re
from datetime import datetime
from pathlib import Path

# 爬虫配置
CRAWLERS = [
    {
        'id': 'grok',
        'name': 'xAI Grok',
        'script': 'download_grok.py',
        'auto': True,
        'interval': 86400,
    },
    {
        'id': 'megallm',
        'name': 'MegaLLM',
        'script': 'download_megallm.py',
        'auto': True,
        'interval': 86400,
    },
    {
        'id': 'minimax',
        'name': 'MiniMax',
        'script': 'download_minimax.py',
        'auto': True,
        'interval': 86400,
    },
    {
        'id': 'zhipu',
        'name': 'Zhipu BigModel (CN)',
        'script': 'download_zhipu.py',
        'auto': True,
        'interval': 86400,
    },
    {
        'id': 'claude',
        'name': 'Anthropic Claude',
        'script': 'batch_download_docs.py',
        'auto': True,
        'interval': 86400,
        'args': ['--claude-only'],
    },
    {
        'id': 'gemini',
        'name': 'Google Gemini',
        'script': 'batch_download_docs.py',
        'auto': True,
        'interval': 86400,
        'args': ['--gemini-only'],
    },
    {
        'id': 'openai',
        'name': 'OpenAI',
        'script': 'download_openai_uc.py',
        'auto': False,
        'interval': 86400,
    },
    {
        'id': 'moonshot',
        'name': 'Moonshot Kimi',
        'script': 'download_moonshot.py',
        'auto': False,
        'interval': 86400,
    },
    {
        'id': 'zhipu_en',
        'name': 'Zhipu BigModel (EN)',
        'script': 'download_zhipu_en.py',
        'auto': False,
        'interval': 86400,
    },
    {
        'id': 'meta',
        'name': 'Meta Llama',
        'script': 'download_meta.py',
        'auto': False,
        'interval': 86400,
    },
    {
        'id': 'deepseek',
        'name': 'DeepSeek',
        'script': 'download_deepseek.py',
        'auto': False,
        'interval': 86400,
    },
    {
        'id': 'mimo',
        'name': 'Xiaomi MiMo',
        'script': 'download_mimo.py',
        'auto': False,
        'interval': 86400,
    },
]

STATUS_FILE = 'data/crawl-status.json'
EVENTS_FILE = 'data/crawl-events.json'
DOCS_DIR = 'data/docs'
MAX_EVENTS = 500  # 最多保留的事件数量

# 爬取时间戳标记（多语言）
CRAWL_HEADER_MARKERS = {
    'en': '> 📄 *Auto-crawled by [LLM Docs](https://petehsu.github.io/LLM-Docs/) on {date}*\n\n',
    'zh': '> 📄 *由 [LLM Docs](https://petehsu.github.io/LLM-Docs/) 自动爬取于 {date}*\n\n',
    'ja': '> 📄 *[LLM Docs](https://petehsu.github.io/LLM-Docs/) により {date} に自動取得*\n\n',
}

# 检测语言的关键词
LANG_DETECT_PATTERNS = {
    'zh': [r'[\u4e00-\u9fff]'],  # 中文字符
    'ja': [r'[\u3040-\u309f\u30a0-\u30ff]'],  # 日文假名
}


def detect_doc_language(content, filepath):
    """检测文档语言"""
    # 先从路径判断
    path_lower = filepath.lower()
    if '/chinese/' in path_lower or '/zh/' in path_lower or '中文' in filepath:
        return 'zh'
    if '/japanese/' in path_lower or '/ja/' in path_lower or '日本語' in filepath:
        return 'ja'
    if '/english/' in path_lower or '/en/' in path_lower:
        return 'en'
    
    # 从内容判断
    sample = content[:1000]
    
    # 检测日文（先检测，因为日文也可能包含汉字）
    for pattern in LANG_DETECT_PATTERNS['ja']:
        if re.search(pattern, sample):
            return 'ja'
    
    # 检测中文
    for pattern in LANG_DETECT_PATTERNS['zh']:
        if re.search(pattern, sample):
            return 'zh'
    
    return 'en'


def has_crawl_header(content):
    """检查文档是否已有爬取时间戳"""
    for marker in CRAWL_HEADER_MARKERS.values():
        # 检查是否包含 LLM Docs 标记
        if 'Auto-crawled by [LLM Docs]' in content or '由 [LLM Docs]' in content or '[LLM Docs]' in content[:500]:
            return True
    return False


def add_crawl_header(filepath, crawl_time=None):
    """为文档添加爬取时间戳"""
    if crawl_time is None:
        crawl_time = datetime.now()
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 已有标记则跳过
        if has_crawl_header(content):
            return False
        
        # 检测语言
        lang = detect_doc_language(content, filepath)
        
        # 格式化日期
        date_str = crawl_time.strftime('%Y-%m-%d %H:%M UTC')
        
        # 获取对应语言的标记
        header = CRAWL_HEADER_MARKERS.get(lang, CRAWL_HEADER_MARKERS['en'])
        header = header.format(date=date_str)
        
        # 添加到文档开头
        new_content = header + content
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return True
    except Exception as e:
        print(f"  ⚠️ Failed to add header to {filepath}: {e}")
        return False


def add_headers_to_new_docs(vendor_id, crawl_time):
    """为新爬取的文档添加时间戳"""
    vendor_docs_dir = None
    
    # 映射 vendor_id 到文档目录
    vendor_dir_map = {
        'grok': 'X Grok',
        'megallm': 'MegaLLM',
        'minimax': 'MiniMax',
        'zhipu': 'BigModel Zhipu',
        'claude': 'Anthropic Claude',
        'gemini': 'Google Gemini',
        'openai': 'OpenAI',
        'moonshot': 'Moonshot Kimi',
        'zhipu_en': 'BigModel Zhipu',
        'meta': 'Meta Llama',
        'deepseek': 'DeepSeek',
        'mimo': 'Xiaomi MiMo',
    }
    
    dir_name = vendor_dir_map.get(vendor_id)
    if dir_name:
        vendor_docs_dir = os.path.join(DOCS_DIR, dir_name)
    
    if not vendor_docs_dir or not os.path.exists(vendor_docs_dir):
        return 0
    
    added_count = 0
    for root, dirs, files in os.walk(vendor_docs_dir):
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                if add_crawl_header(filepath, crawl_time):
                    added_count += 1
    
    return added_count


# ============ 事件日志系统 ============

class EventType:
    INFO = 'info'
    SUCCESS = 'success'
    WARNING = 'warning'
    ERROR = 'error'
    START = 'start'
    COMPLETE = 'complete'
    SKIP = 'skip'


def load_events():
    """加载事件日志"""
    if os.path.exists(EVENTS_FILE):
        try:
            with open(EVENTS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    return []


def save_events(events):
    """保存事件日志"""
    os.makedirs(os.path.dirname(EVENTS_FILE), exist_ok=True)
    # 只保留最近的事件
    events = events[-MAX_EVENTS:]
    with open(EVENTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(events, f, ensure_ascii=False, indent=2)


def log_event(event_type, vendor_id, vendor_name, message, details=None):
    """记录事件"""
    events = load_events()
    
    event = {
        'id': len(events) + 1,
        'timestamp': datetime.now().isoformat(),
        'type': event_type,
        'vendorId': vendor_id,
        'vendorName': vendor_name,
        'message': message,
        'details': details,
    }
    
    events.append(event)
    save_events(events)
    
    # 同时打印到控制台
    icon_map = {
        EventType.INFO: 'ℹ️',
        EventType.SUCCESS: '✅',
        EventType.WARNING: '⚠️',
        EventType.ERROR: '❌',
        EventType.START: '🚀',
        EventType.COMPLETE: '🎉',
        EventType.SKIP: '⏭️',
    }
    icon = icon_map.get(event_type, '•')
    print(f"  {icon} [{vendor_name}] {message}")
    
    return event


def log_system_event(event_type, message, details=None):
    """记录系统事件"""
    return log_event(event_type, 'system', 'System', message, details)


# ============ 状态管理 ============

def load_status():
    """加载爬取状态"""
    if os.path.exists(STATUS_FILE):
        with open(STATUS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def save_status(status):
    """保存爬取状态"""
    os.makedirs(os.path.dirname(STATUS_FILE), exist_ok=True)
    with open(STATUS_FILE, 'w', encoding='utf-8') as f:
        json.dump(status, f, ensure_ascii=False, indent=2)


# ============ 爬虫执行 ============

def run_crawler(crawler):
    """运行单个爬虫"""
    script = crawler['script']
    args = crawler.get('args', [])
    crawler_id = crawler['id']
    crawler_name = crawler['name']
    
    if not os.path.exists(script):
        log_event(EventType.ERROR, crawler_id, crawler_name, 
                  f"Script not found: {script}")
        return False, "Script not found", 0, 0
    
    log_event(EventType.START, crawler_id, crawler_name,
              f"Starting crawler: {script} {' '.join(args)}")
    
    start_time = time.time()
    crawl_time = datetime.now()
    
    try:
        cmd = [sys.executable, '-u', script] + args
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=600
        )
        
        duration = round(time.time() - start_time, 2)
        
        # 解析输出获取文档数量
        doc_count = 0
        output_lines = result.stdout.split('\n') if result.stdout else []
        for line in output_lines:
            if 'docs' in line.lower() or '文档' in line:
                # 尝试提取数字
                numbers = re.findall(r'\d+', line)
                if numbers:
                    doc_count = max(doc_count, int(numbers[0]))
        
        if result.returncode == 0:
            # 为新爬取的文档添加时间戳
            headers_added = add_headers_to_new_docs(crawler_id, crawl_time)
            
            log_event(EventType.SUCCESS, crawler_id, crawler_name,
                      f"Completed successfully in {duration}s, {headers_added} docs stamped",
                      {
                          'duration': duration,
                          'docCount': doc_count,
                          'headersAdded': headers_added,
                          'outputLines': len(output_lines),
                      })
            return True, None, duration, doc_count
        else:
            error_msg = result.stderr[:1000] if result.stderr else "Unknown error"
            log_event(EventType.ERROR, crawler_id, crawler_name,
                      f"Failed with exit code {result.returncode}",
                      {
                          'exitCode': result.returncode,
                          'error': error_msg,
                          'duration': duration,
                          'stdout': result.stdout[:500] if result.stdout else None,
                      })
            return False, error_msg, duration, 0
            
    except subprocess.TimeoutExpired:
        duration = round(time.time() - start_time, 2)
        log_event(EventType.ERROR, crawler_id, crawler_name,
                  f"Timeout after {duration}s (limit: 600s)")
        return False, "Timeout (10 min)", duration, 0
        
    except Exception as e:
        duration = round(time.time() - start_time, 2)
        error_trace = traceback.format_exc()
        log_event(EventType.ERROR, crawler_id, crawler_name,
                  f"Exception: {str(e)}",
                  {
                      'exception': str(e),
                      'traceback': error_trace,
                      'duration': duration,
                  })
        return False, str(e), duration, 0


def crawl_vendor(crawler_id, force=False):
    """爬取指定厂商"""
    crawler = next((c for c in CRAWLERS if c['id'] == crawler_id), None)
    if not crawler:
        log_system_event(EventType.ERROR, f"Unknown crawler: {crawler_id}")
        return False
    
    status = load_status()
    now = datetime.now()
    now_ts = now.timestamp()
    
    # 检查是否需要爬取
    vendor_status = status.get(crawler_id, {})
    last_crawl = vendor_status.get('lastCrawl', 0)
    
    if not force and (now_ts - last_crawl) < crawler['interval']:
        remaining = int(crawler['interval'] - (now_ts - last_crawl))
        hours = remaining // 3600
        minutes = (remaining % 3600) // 60
        log_event(EventType.SKIP, crawler_id, crawler['name'],
                  f"Skipped (next crawl in {hours}h {minutes}m)")
        return True
    
    success, error, duration, doc_count = run_crawler(crawler)
    
    # 更新状态
    status[crawler_id] = {
        'lastCrawl': now_ts,
        'lastCrawlTime': now.isoformat(),
        'success': success,
        'error': error,
        'auto': crawler['auto'],
        'duration': duration,
        'docCount': doc_count,
    }
    save_status(status)
    
    return success


def crawl_all(auto_only=True, force=False):
    """爬取所有厂商"""
    log_system_event(EventType.START, 
                     f"Batch crawl started (auto_only={auto_only}, force={force})")
    
    print("=" * 60)
    print("LLM Docs Auto Crawler")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    results = []
    total_start = time.time()
    
    for crawler in CRAWLERS:
        if auto_only and not crawler['auto']:
            log_event(EventType.SKIP, crawler['id'], crawler['name'],
                      "Skipped (requires browser)")
            continue
        
        success = crawl_vendor(crawler['id'], force=force)
        results.append((crawler['name'], success))
    
    total_duration = round(time.time() - total_start, 2)
    
    # 重建文档索引
    log_system_event(EventType.INFO, "Rebuilding docs index...")
    
    try:
        from build_docs_site import build_index
        build_index()
        log_system_event(EventType.SUCCESS, "Docs index rebuilt successfully")
    except Exception as e:
        log_system_event(EventType.ERROR, f"Failed to rebuild index: {e}",
                        {'traceback': traceback.format_exc()})
    
    # 统计结果
    success_count = sum(1 for _, s in results if s)
    fail_count = len(results) - success_count
    
    log_system_event(EventType.COMPLETE,
                     f"Batch crawl completed: {success_count} success, {fail_count} failed",
                     {
                         'totalDuration': total_duration,
                         'successCount': success_count,
                         'failCount': fail_count,
                         'results': [{'name': n, 'success': s} for n, s in results],
                     })
    
    print("\n" + "=" * 50)
    print(f"Summary ({total_duration}s)")
    print("=" * 50)
    
    for name, success in results:
        status_icon = "✅" if success else "❌"
        print(f"  {status_icon} {name}")
    
    return all(s for _, s in results)


def show_status():
    """显示爬取状态"""
    status = load_status()
    
    print("=" * 60)
    print("Crawl Status")
    print("=" * 60)
    
    for crawler in CRAWLERS:
        vendor_status = status.get(crawler['id'], {})
        last_time = vendor_status.get('lastCrawlTime', 'Never')
        success = vendor_status.get('success', None)
        auto = "🤖" if crawler['auto'] else "👤"
        
        if success is None:
            status_icon = "⚪"
        elif success:
            status_icon = "✅"
        else:
            status_icon = "❌"
        
        print(f"  {auto} {status_icon} {crawler['name']:<25} Last: {last_time}")


def show_events(count=20):
    """显示最近的事件"""
    events = load_events()
    
    print("=" * 60)
    print(f"Recent Events (last {count})")
    print("=" * 60)
    
    for event in events[-count:]:
        ts = event['timestamp'][:19].replace('T', ' ')
        event_type = event['type']
        vendor = event['vendorName']
        msg = event['message']
        
        icon_map = {
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌',
            'start': '🚀',
            'complete': '🎉',
            'skip': '⏭️',
        }
        icon = icon_map.get(event_type, '•')
        
        print(f"  {ts} {icon} [{vendor}] {msg}")


def clear_events():
    """清空事件日志"""
    save_events([])
    print("Events cleared.")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='LLM Docs Auto Crawler')
    parser.add_argument('--all', action='store_true', help='Crawl all vendors (including browser-based)')
    parser.add_argument('--force', action='store_true', help='Force crawl even if recently crawled')
    parser.add_argument('--vendor', type=str, help='Crawl specific vendor by ID')
    parser.add_argument('--status', action='store_true', help='Show crawl status')
    parser.add_argument('--list', action='store_true', help='List all crawlers')
    parser.add_argument('--events', type=int, nargs='?', const=20, help='Show recent events')
    parser.add_argument('--clear-events', action='store_true', help='Clear event log')
    
    args = parser.parse_args()
    
    if args.status:
        show_status()
    elif args.list:
        print("Available crawlers:")
        for c in CRAWLERS:
            auto = "🤖 auto" if c['auto'] else "👤 manual"
            print(f"  {c['id']:<15} {c['name']:<25} ({auto})")
    elif args.events:
        show_events(args.events)
    elif args.clear_events:
        clear_events()
    elif args.vendor:
        crawl_vendor(args.vendor, force=args.force)
    else:
        crawl_all(auto_only=not args.all, force=args.force)
