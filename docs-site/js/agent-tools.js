// ============ Agent Tools System ============
// 工具调用框架 - 让 Agent 具备执行能力

// 可用工具定义
const AGENT_TOOLS = {
    // 代码执行工具
    execute_code: {
        name: 'execute_code',
        description: 'Execute JavaScript code in a sandboxed environment. Use for calculations, data processing, or generating code examples.',
        parameters: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'JavaScript code to execute'
                },
                language: {
                    type: 'string',
                    enum: ['javascript'],
                    description: 'Programming language (currently only JavaScript supported in browser)'
                }
            },
            required: ['code']
        },
        execute: executeCode
    },

    // 文档搜索工具
    search_docs: {
        name: 'search_docs',
        description: 'Search across all LLM API documentation. Returns matching documents with snippets.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query'
                },
                vendor: {
                    type: 'string',
                    description: 'Optional: filter by vendor (openai, anthropic, google, etc.)'
                },
                limit: {
                    type: 'number',
                    description: 'Maximum results to return (default: 10)'
                }
            },
            required: ['query']
        },
        execute: searchDocs
    },

    // 读取文档工具
    read_doc: {
        name: 'read_doc',
        description: 'Read the full content of a specific document.',
        parameters: {
            type: 'object',
            properties: {
                vendor: {
                    type: 'string',
                    description: 'Vendor ID (e.g., openai, anthropic, deepseek)'
                },
                path: {
                    type: 'string',
                    description: 'Document path within the vendor folder'
                }
            },
            required: ['vendor', 'path']
        },
        execute: readDoc
    },

    // 列出文档工具
    list_docs: {
        name: 'list_docs',
        description: 'List all documents for a specific vendor.',
        parameters: {
            type: 'object',
            properties: {
                vendor: {
                    type: 'string',
                    description: 'Vendor ID'
                },
                language: {
                    type: 'string',
                    description: 'Optional: filter by language (English, 简体中文, etc.)'
                }
            },
            required: ['vendor']
        },
        execute: listDocs
    },

    // 获取脚本信息工具
    get_script_info: {
        name: 'get_script_info',
        description: 'Get information about crawler scripts, including dependencies and usage.',
        parameters: {
            type: 'object',
            properties: {
                script_name: {
                    type: 'string',
                    description: 'Script filename or partial name'
                },
                category: {
                    type: 'string',
                    enum: ['crawler', 'explore', 'test', 'utils', 'core'],
                    description: 'Script category'
                }
            }
        },
        execute: getScriptInfo
    },

    // 网络搜索工具 (需要配置 API)
    web_search: {
        name: 'web_search',
        description: 'Search the web for information. Requires search API configuration.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query'
                },
                num_results: {
                    type: 'number',
                    description: 'Number of results (default: 5)'
                }
            },
            required: ['query']
        },
        execute: webSearch
    },

    // 生成爬虫代码工具
    generate_crawler: {
        name: 'generate_crawler',
        description: 'Generate a crawler script based on URL pattern and requirements.',
        parameters: {
            type: 'object',
            properties: {
                target_url: {
                    type: 'string',
                    description: 'Target documentation URL'
                },
                framework: {
                    type: 'string',
                    enum: ['requests', 'playwright', 'selenium'],
                    description: 'Preferred framework'
                },
                output_format: {
                    type: 'string',
                    enum: ['markdown', 'json', 'html'],
                    description: 'Output format'
                }
            },
            required: ['target_url']
        },
        execute: generateCrawler
    }
};

// ============ 工具实现 ============

// 安全执行 JavaScript 代码
function executeCode(params) {
    const { code } = params;
    
    try {
        // 创建沙箱环境
        const sandbox = {
            console: {
                log: (...args) => sandbox._output.push(['log', args.join(' ')]),
                error: (...args) => sandbox._output.push(['error', args.join(' ')]),
                warn: (...args) => sandbox._output.push(['warn', args.join(' ')])
            },
            _output: [],
            _result: undefined,
            // 安全的内置函数
            Math, JSON, Date, Array, Object, String, Number, Boolean,
            parseInt, parseFloat, isNaN, isFinite,
            encodeURIComponent, decodeURIComponent,
            setTimeout: () => { throw new Error('setTimeout not allowed'); },
            setInterval: () => { throw new Error('setInterval not allowed'); },
            fetch: () => { throw new Error('fetch not allowed in sandbox'); }
        };

        // 使用 Function 构造器创建沙箱函数
        const sandboxedCode = `
            with (sandbox) {
                _result = (function() {
                    ${code}
                })();
            }
        `;
        
        const fn = new Function('sandbox', sandboxedCode);
        fn(sandbox);

        return {
            success: true,
            result: sandbox._result,
            output: sandbox._output,
            message: 'Code executed successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            message: 'Code execution failed'
        };
    }
}

// 搜索文档
async function searchDocs(params) {
    const { query, vendor, limit = 10 } = params;
    const results = [];
    const queryLower = query.toLowerCase();

    for (const v of VENDORS) {
        if (vendor && v.id !== vendor) continue;
        
        const vendorDocs = docsIndex[v.id];
        if (!vendorDocs || !vendorDocs.languages) continue;

        for (const [langCode, docs] of Object.entries(vendorDocs.languages)) {
            for (const doc of docs) {
                const title = (doc.title || doc.name || '').toLowerCase();
                const path = (doc.path || '').toLowerCase();
                
                if (title.includes(queryLower) || path.includes(queryLower)) {
                    results.push({
                        vendor: v.id,
                        vendorName: v.name,
                        language: langCode,
                        title: doc.title || doc.name,
                        path: doc.path,
                        url: `#${v.id}/${langCode}/${doc.path}`
                    });
                }
                
                if (results.length >= limit) break;
            }
            if (results.length >= limit) break;
        }
        if (results.length >= limit) break;
    }

    return {
        success: true,
        query,
        count: results.length,
        results
    };
}

// 读取文档内容
async function readDoc(params) {
    const { vendor, path } = params;
    
    try {
        // 构建文档路径
        const docPath = `docs/${vendor}/${path}`;
        const response = await fetch(docPath);
        
        if (!response.ok) {
            return {
                success: false,
                error: `Document not found: ${docPath}`
            };
        }
        
        const content = await response.text();
        return {
            success: true,
            vendor,
            path,
            content: content.slice(0, 10000), // 限制长度
            truncated: content.length > 10000
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// 列出文档
function listDocs(params) {
    const { vendor, language } = params;
    
    const vendorDocs = docsIndex[vendor];
    if (!vendorDocs) {
        return {
            success: false,
            error: `Vendor not found: ${vendor}`
        };
    }

    const results = {};
    for (const [langCode, docs] of Object.entries(vendorDocs.languages || {})) {
        if (language && langCode !== language) continue;
        results[langCode] = docs.map(d => ({
            title: d.title || d.name,
            path: d.path
        }));
    }

    return {
        success: true,
        vendor,
        languages: Object.keys(results),
        docs: results
    };
}

// 获取脚本信息
function getScriptInfo(params) {
    const { script_name, category } = params;
    const allScripts = getAllScripts();
    
    let results = allScripts;
    
    if (category) {
        results = results.filter(s => s.category === category);
    }
    
    if (script_name) {
        const nameLower = script_name.toLowerCase();
        results = results.filter(s => 
            s.path.toLowerCase().includes(nameLower)
        );
    }

    return {
        success: true,
        count: results.length,
        scripts: results.map(s => ({
            path: s.path,
            category: s.category,
            vendor: s.vendor || s.target,
            deps: s.deps,
            description: s.desc[currentLang] || s.desc.en
        }))
    };
}

// 网络搜索 (需要配置搜索 API)
async function webSearch(params) {
    const { query, num_results = 5 } = params;
    const settings = getSettings();
    
    // 检查是否配置了搜索 API
    if (!settings.searchApiKey) {
        return {
            success: false,
            error: 'Web search requires API configuration. Please configure a search API (Tavily, SerpAPI, etc.) in settings.',
            suggestion: 'You can use search_docs to search within the local documentation instead.'
        };
    }

    // TODO: 实现实际的搜索 API 调用
    // 这里需要根据配置的搜索服务来实现
    return {
        success: false,
        error: 'Web search API not yet implemented',
        suggestion: 'Use search_docs for local documentation search'
    };
}

// 生成爬虫代码
function generateCrawler(params) {
    const { target_url, framework = 'requests', output_format = 'markdown' } = params;
    
    let code = '';
    
    if (framework === 'requests') {
        code = `#!/usr/bin/env python3
"""
Auto-generated crawler for: ${target_url}
Framework: requests
Output: ${output_format}
"""

import requests
import os
import re
from pathlib import Path

# Configuration
BASE_URL = "${target_url}"
OUTPUT_DIR = "downloaded_docs"
USE_PROXY = False
PROXIES = {"http": "http://127.0.0.1:10808", "https": "http://127.0.0.1:10808"}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

def download_doc(url, output_path):
    """Download a single document."""
    try:
        response = requests.get(
            url,
            headers=HEADERS,
            proxies=PROXIES if USE_PROXY else None,
            timeout=30
        )
        response.raise_for_status()
        
        # Save content
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(response.text)
        
        print(f"✓ Downloaded: {output_path}")
        return True
    except Exception as e:
        print(f"✗ Failed: {url} - {e}")
        return False

def main():
    """Main crawler function."""
    # TODO: Implement link discovery logic
    # 1. Fetch the main page
    # 2. Extract document links from sidebar/navigation
    # 3. Download each document
    
    print(f"Starting crawler for: {BASE_URL}")
    # Add your crawling logic here

if __name__ == "__main__":
    main()
`;
    } else if (framework === 'playwright') {
        code = `#!/usr/bin/env python3
"""
Auto-generated crawler for: ${target_url}
Framework: playwright (for JavaScript-rendered pages)
Output: ${output_format}
"""

import asyncio
from playwright.async_api import async_playwright
from markdownify import markdownify
from pathlib import Path

# Configuration
BASE_URL = "${target_url}"
OUTPUT_DIR = "downloaded_docs"

async def download_doc(page, url, output_path):
    """Download a single document using Playwright."""
    try:
        await page.goto(url, wait_until="networkidle")
        
        # Wait for content to load
        await page.wait_for_selector("main, article, .content", timeout=10000)
        
        # Extract main content
        content = await page.evaluate('''() => {
            const main = document.querySelector('main, article, .content, .docs-content');
            return main ? main.innerHTML : document.body.innerHTML;
        }''')
        
        # Convert to Markdown
        markdown = markdownify(content, heading_style="ATX")
        
        # Save
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(markdown)
        
        print(f"✓ Downloaded: {output_path}")
        return True
    except Exception as e:
        print(f"✗ Failed: {url} - {e}")
        return False

async def main():
    """Main crawler function."""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print(f"Starting crawler for: {BASE_URL}")
        # TODO: Add your crawling logic here
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
`;
    }

    return {
        success: true,
        framework,
        output_format,
        code,
        message: 'Crawler template generated. Customize the link discovery logic for your target site.'
    };
}

// ============ 工具调用处理 ============

// 解析工具调用
function parseToolCalls(content) {
    const toolCalls = [];
    
    // 格式1: ```json {"tool": "xxx", "args": {...}} ```
    const codeBlockRegex = /```json\s*(\{[\s\S]*?\})\s*```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
        try {
            const call = JSON.parse(match[1]);
            // 支持 {"tool": "xxx", "args": {...}} 格式
            if (call.tool && AGENT_TOOLS[call.tool]) {
                toolCalls.push({ name: call.tool, arguments: call.args || {} });
            }
            // 支持 {"name": "xxx", "arguments": {...}} 格式
            if (call.name && AGENT_TOOLS[call.name]) {
                toolCalls.push({ name: call.name, arguments: call.arguments || {} });
            }
        } catch (e) {
            // 解析失败，跳过
        }
    }
    
    // 格式2: <tool_call>{"name": "xxx", "arguments": {...}}</tool_call>
    const toolCallRegex = /<tool_call>\s*(\{[\s\S]*?\})\s*<\/tool_call>/g;
    while ((match = toolCallRegex.exec(content)) !== null) {
        try {
            const call = JSON.parse(match[1]);
            if (call.name && AGENT_TOOLS[call.name]) {
                toolCalls.push(call);
            }
        } catch (e) {
            // 解析失败，跳过
        }
    }
    
    return toolCalls;
}

// 执行工具调用
async function executeToolCall(toolCall) {
    const tool = AGENT_TOOLS[toolCall.name];
    if (!tool) {
        return {
            success: false,
            error: `Unknown tool: ${toolCall.name}`
        };
    }
    
    try {
        const result = await tool.execute(toolCall.arguments || {});
        return result;
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// 获取工具定义（用于 system prompt）
function getToolDefinitions() {
    return Object.values(AGENT_TOOLS).map(tool => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
    }));
}
