// ============ MCP 配置页面渲染 ============

// MCP 配置内容
const MCP_CONFIGS = {
    kiro: {
        filename: 'mcp.json',
        content: `{
  "mcpServers": {
    "llm-docs": {
      "command": "python3",
      "args": ["mcp_server.py"],
      "env": {},
      "disabled": false,
      "autoApprove": [
        "list_vendors",
        "list_docs", 
        "read_doc",
        "search_docs",
        "get_doc_stats"
      ]
    }
  }
}`
    },
    claude: {
        filename: 'claude_desktop_config.json',
        content: `{
  "mcpServers": {
    "llm-docs": {
      "command": "python3",
      "args": ["/path/to/llm-docs/mcp_server.py"]
    }
  }
}`
    },
    cursor: {
        filename: 'mcp.json',
        content: `{
  "mcpServers": {
    "llm-docs": {
      "command": "python3",
      "args": ["mcp_server.py"],
      "cwd": "/path/to/llm-docs"
    }
  }
}`
    },
    vscode: {
        filename: 'config.json',
        content: `{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "transport": {
          "type": "stdio",
          "command": "python3",
          "args": ["/path/to/llm-docs/mcp_server.py"]
        }
      }
    ]
  }
}`
    }
};

// 复制 MCP 配置
function copyMcpConfig(configType) {
    const config = MCP_CONFIGS[configType];
    if (!config) return;
    
    navigator.clipboard.writeText(config.content).then(() => {
        showToast(t('copied'));
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}

// 下载 MCP 配置
function downloadMcpConfig(configType) {
    const config = MCP_CONFIGS[configType];
    if (!config) return;
    
    const blob = new Blob([config.content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = config.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 显示 Toast 提示
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 复制 MCP 页面全文
function copyMcpPageContent() {
    const mcpFullContent = `# MCP Server Integration

## What is MCP?

Model Context Protocol (MCP) is an open standard that enables AI assistants to securely access external data sources and tools. With our MCP server, AI assistants can search and read all 1600+ LLM API documents.

## Installation

\`\`\`bash
# Install MCP SDK
pip install mcp

# Clone the repository (if not already)
git clone https://github.com/petehsu/LLM-Docs.git
cd LLM-Docs

# Build docs index (required)
python3 build_docs_site.py
\`\`\`

## Configuration

### Kiro (.kiro/settings/mcp.json)
${MCP_CONFIGS.kiro.content}

### Claude Desktop
${MCP_CONFIGS.claude.content}

### Cursor (.cursor/mcp.json)
${MCP_CONFIGS.cursor.content}

### VS Code (.continue/config.json)
${MCP_CONFIGS.vscode.content}

## Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| list_vendors | List all LLM vendors with doc counts | - |
| list_docs | List all documents for a vendor | vendor_id |
| read_doc | Read full content of a document | vendor_id, doc_path |
| search_docs | Search across all documentation | query, [vendor_id], [limit] |
| get_doc_stats | Get collection statistics | - |

## Usage Examples

\`\`\`python
# List all vendors
list_vendors

# Get OpenAI docs list  
list_docs vendor_id="openai"

# Read a specific document
read_doc vendor_id="anthropic" doc_path="en/build-with-claude/vision.md"

# Search for function calling docs
search_docs query="function calling" limit=10

# Get statistics
get_doc_stats
\`\`\`

## Resource URIs

\`\`\`
llmdocs://openai
llmdocs://anthropic
llmdocs://anthropic/en/about-claude/pricing.md
\`\`\`
`;
    
    navigator.clipboard.writeText(mcpFullContent).then(() => {
        showToast(t('copied'));
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}

// MCP 工具配置
const MCP_TOOLS = [
    {
        name: 'list_vendors',
        desc: {
            en: 'List all LLM vendors with doc counts',
            zh: '列出所有厂商及文档数量',
            ja: 'すべてのベンダーとドキュメント数を一覧表示'
        },
        params: '-',
        example: 'list_vendors'
    },
    {
        name: 'list_docs',
        desc: {
            en: 'List all documents for a vendor',
            zh: '列出指定厂商的所有文档',
            ja: 'ベンダーのすべてのドキュメントを一覧表示'
        },
        params: 'vendor_id',
        example: 'list_docs vendor_id="openai"'
    },
    {
        name: 'read_doc',
        desc: {
            en: 'Read full content of a document',
            zh: '读取文档完整内容',
            ja: 'ドキュメントの全内容を読み取り'
        },
        params: 'vendor_id, doc_path',
        example: 'read_doc vendor_id="anthropic" doc_path="en/build-with-claude/vision.md"'
    },
    {
        name: 'search_docs',
        desc: {
            en: 'Search across all documentation',
            zh: '跨所有文档搜索',
            ja: 'すべてのドキュメントを横断検索'
        },
        params: 'query, [vendor_id], [limit]',
        example: 'search_docs query="function calling" limit=10'
    },
    {
        name: 'get_doc_stats',
        desc: {
            en: 'Get collection statistics',
            zh: '获取文档集合统计信息',
            ja: 'コレクション統計を取得'
        },
        params: '-',
        example: 'get_doc_stats'
    }
];

// MCP 客户端配置
const MCP_CLIENTS = [
    { name: 'Kiro', icon: '<img src="logos/kiro.svg" class="client-logo" alt="Kiro">', config: '.kiro/settings/mcp.json' },
    { name: 'Claude Desktop', icon: '<img src="logos/claude.svg" class="client-logo" alt="Claude">', config: 'claude_desktop_config.json' },
    { name: 'Cursor', icon: '<img src="logos/cursor.svg" class="client-logo" alt="Cursor">', config: '.cursor/mcp.json' },
    { name: 'VS Code', icon: '<img src="logos/vscode.svg" class="client-logo" alt="VS Code">', config: '.vscode/mcp.json' },
    { name: 'Cline', icon: '<img src="logos/cline.svg" class="client-logo" alt="Cline">', config: 'cline_mcp_settings.json' },
];

// 渲染 MCP 页面
function renderMcpPage() {
    const wrapper = document.getElementById('content-wrapper');
    const tocList = document.getElementById('toc-list');
    
    let totalDocs = 0;
    VENDORS.forEach(vendor => {
        totalDocs += docsIndex[vendor.id]?.totalDocs || 0;
    });
    
    const toolsHtml = MCP_TOOLS.map(tool => `
        <tr>
            <td><code class="tool-name">${tool.name}</code></td>
            <td>${tool.desc[currentLang] || tool.desc.en}</td>
            <td><code>${tool.params}</code></td>
        </tr>
    `).join('');
    
    const clientsHtml = MCP_CLIENTS.map(client => `
        <div class="mcp-client-card">
            <span class="client-icon">${client.icon}</span>
            <div class="client-info">
                <div class="client-name">${client.name}</div>
                <code class="client-config">${client.config}</code>
            </div>
        </div>
    `).join('');
    
    wrapper.innerHTML = `
        <div class="breadcrumb">
            <a href="#">${t('home')}</a>
            <span class="breadcrumb-sep">/</span>
            <span>${t('mcpSetup')}</span>
        </div>
        
        <div class="page-title-row">
            <h1>${t('mcpTitle')}</h1>
            <button class="copy-page-btn" onclick="copyMcpPageContent()" title="${t('copyAll')}">
                ${icon('copy')} ${t('copyAll')}
            </button>
        </div>
        <p class="lead">${t('mcpDesc')}</p>
        
        <div class="mcp-hero">
            <div class="mcp-hero-stats">
                <div class="mcp-stat">
                    <span class="mcp-stat-value">${totalDocs}+</span>
                    <span class="mcp-stat-label">${t('statDocs')}</span>
                </div>
                <div class="mcp-stat">
                    <span class="mcp-stat-value">${VENDORS.length}</span>
                    <span class="mcp-stat-label">${t('statVendors')}</span>
                </div>
                <div class="mcp-stat">
                    <span class="mcp-stat-value">5</span>
                    <span class="mcp-stat-label">Tools</span>
                </div>
            </div>
        </div>
        
        <h2 id="what-is-mcp">${t('mcpWhatIs')}</h2>
        <div class="mcp-info-box">
            <p>${t('mcpWhatIsDesc')}</p>
            <div class="mcp-features">
                <div class="mcp-feature">
                    <span class="feature-icon">${icon('list')}</span>
                    <span>${t('mcpFeature1')}</span>
                </div>
                <div class="mcp-feature">
                    <span class="feature-icon">${icon('read')}</span>
                    <span>${t('mcpFeature2')}</span>
                </div>
                <div class="mcp-feature">
                    <span class="feature-icon">${icon('search')}</span>
                    <span>${t('mcpFeature3')}</span>
                </div>
                <div class="mcp-feature">
                    <span class="feature-icon">${icon('stats')}</span>
                    <span>${t('mcpFeature4')}</span>
                </div>
            </div>
        </div>
        
        <h2 id="installation">${t('mcpInstall')}</h2>
        <div class="markdown-body">
            <pre><code class="language-bash"># Install MCP SDK
pip install mcp

# Clone the repository (if not already)
git clone https://github.com/user/llm-docs.git
cd llm-docs

# Build docs index (required)
python3 build_docs_site.py</code></pre>
        </div>
        
        <h2 id="configuration">${t('mcpConfig')}</h2>
        <p>${t('mcpConfigDesc')}</p>
        
        <div class="mcp-config-tabs">
            <button class="config-tab active" data-config="kiro">Kiro</button>
            <button class="config-tab" data-config="claude">Claude Desktop</button>
            <button class="config-tab" data-config="cursor">Cursor</button>
            <button class="config-tab" data-config="vscode">VS Code</button>
        </div>
        
        <div class="mcp-config-content" id="mcp-config-content">
            <div class="config-panel active" data-config="kiro">
                <p class="config-path"><span class="path-icon">${icon('folder')}</span> <code>.kiro/settings/mcp.json</code></p>
                <div class="config-actions">
                    <button class="config-action-btn" onclick="copyMcpConfig('kiro')" title="${t('copy')}">
                        ${icon('copy')} ${t('copy')}
                    </button>
                    <button class="config-action-btn" onclick="downloadMcpConfig('kiro')" title="${t('download')}">
                        ${icon('download')} ${t('download')}
                    </button>
                </div>
                <div class="markdown-body">
                    <pre><code class="language-json" id="config-kiro">{
  "mcpServers": {
    "llm-docs": {
      "command": "python3",
      "args": ["mcp_server.py"],
      "env": {},
      "disabled": false,
      "autoApprove": [
        "list_vendors",
        "list_docs", 
        "read_doc",
        "search_docs",
        "get_doc_stats"
      ]
    }
  }
}</code></pre>
                </div>
            </div>
            <div class="config-panel" data-config="claude">
                <p class="config-path"><span class="path-icon">${icon('folder')}</span> <code>~/Library/Application Support/Claude/claude_desktop_config.json</code> (macOS)</p>
                <p class="config-path"><span class="path-icon">${icon('folder')}</span> <code>%APPDATA%\\Claude\\claude_desktop_config.json</code> (Windows)</p>
                <div class="config-actions">
                    <button class="config-action-btn" onclick="copyMcpConfig('claude')" title="${t('copy')}">
                        ${icon('copy')} ${t('copy')}
                    </button>
                    <button class="config-action-btn" onclick="downloadMcpConfig('claude')" title="${t('download')}">
                        ${icon('download')} ${t('download')}
                    </button>
                </div>
                <div class="markdown-body">
                    <pre><code class="language-json" id="config-claude">{
  "mcpServers": {
    "llm-docs": {
      "command": "python3",
      "args": ["/path/to/llm-docs/mcp_server.py"]
    }
  }
}</code></pre>
                </div>
            </div>
            <div class="config-panel" data-config="cursor">
                <p class="config-path"><span class="path-icon">${icon('folder')}</span> <code>.cursor/mcp.json</code></p>
                <div class="config-actions">
                    <button class="config-action-btn" onclick="copyMcpConfig('cursor')" title="${t('copy')}">
                        ${icon('copy')} ${t('copy')}
                    </button>
                    <button class="config-action-btn" onclick="downloadMcpConfig('cursor')" title="${t('download')}">
                        ${icon('download')} ${t('download')}
                    </button>
                </div>
                <div class="markdown-body">
                    <pre><code class="language-json" id="config-cursor">{
  "mcpServers": {
    "llm-docs": {
      "command": "python3",
      "args": ["mcp_server.py"],
      "cwd": "/path/to/llm-docs"
    }
  }
}</code></pre>
                </div>
            </div>
            <div class="config-panel" data-config="vscode">
                <p class="config-path"><span class="path-icon">${icon('folder')}</span> <code>.continue/config.json</code></p>
                <div class="config-actions">
                    <button class="config-action-btn" onclick="copyMcpConfig('vscode')" title="${t('copy')}">
                        ${icon('copy')} ${t('copy')}
                    </button>
                    <button class="config-action-btn" onclick="downloadMcpConfig('vscode')" title="${t('download')}">
                        ${icon('download')} ${t('download')}
                    </button>
                </div>
                <div class="markdown-body">
                    <pre><code class="language-json" id="config-vscode">{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "transport": {
          "type": "stdio",
          "command": "python3",
          "args": ["/path/to/llm-docs/mcp_server.py"]
        }
      }
    ]
  }
}</code></pre>
                </div>
            </div>
        </div>
        
        <h2 id="tools">${t('mcpTools')}</h2>
        <div class="scripts-table-wrapper">
            <table class="scripts-table mcp-tools-table">
                <thead>
                    <tr>
                        <th>${t('mcpToolName')}</th>
                        <th>${t('mcpToolDesc')}</th>
                        <th>${t('mcpToolParams')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${toolsHtml}
                </tbody>
            </table>
        </div>
        
        <h2 id="examples">${t('mcpExamples')}</h2>
        <div class="markdown-body">
            <pre><code class="language-python"># List all vendors
list_vendors

# Get OpenAI docs list  
list_docs vendor_id="openai"

# Read a specific document
read_doc vendor_id="anthropic" doc_path="en/build-with-claude/vision.md"

# Search for function calling docs
search_docs query="function calling" limit=10

# Search within a specific vendor
search_docs query="streaming" vendor_id="openai"

# Get statistics
get_doc_stats</code></pre>
        </div>
        
        <h2 id="resources">${t('mcpResources')}</h2>
        <p>${t('mcpResourcesDesc')}</p>
        <div class="markdown-body">
            <pre><code class="language-text"># Get vendor info and doc list
llmdocs://openai
llmdocs://anthropic
llmdocs://deepseek

# Read specific document
llmdocs://anthropic/en/about-claude/pricing.md
llmdocs://openai/docs/overview.md
llmdocs://deepseek/en/guides/reasoning_model.md</code></pre>
        </div>
        
        <h2 id="clients">${t('mcpClients')}</h2>
        <p>${t('mcpClientsDesc')}</p>
        <div class="mcp-clients-grid">
            ${clientsHtml}
        </div>
        
        <h2 id="troubleshooting">${t('mcpTroubleshooting')}</h2>
        <p>${t('mcpTroubleshootingDesc')}</p>
        <div class="mcp-troubleshooting">
            <div class="trouble-item">
                <div class="trouble-q"><span class="trouble-icon">${icon('question')}</span> MCP SDK not found</div>
                <div class="trouble-a">Run <code>pip install mcp</code> to install the SDK.</div>
            </div>
            <div class="trouble-item">
                <div class="trouble-q"><span class="trouble-icon">${icon('question')}</span> docs-index.json not found</div>
                <div class="trouble-a">Run <code>python3 build_docs_site.py</code> to build the index.</div>
            </div>
            <div class="trouble-item">
                <div class="trouble-q"><span class="trouble-icon">${icon('question')}</span> Server not connecting</div>
                <div class="trouble-a">Check the path to <code>mcp_server.py</code> is correct and absolute.</div>
            </div>
            <div class="trouble-item">
                <div class="trouble-q"><span class="trouble-icon">${icon('question')}</span> Document not found</div>
                <div class="trouble-a">Use <code>list_docs</code> first to get the correct path format.</div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });
    
    addCopyButtons();
    
    // 配置标签切换
    document.querySelectorAll('.config-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const config = tab.dataset.config;
            document.querySelectorAll('.config-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.config-panel').forEach(panel => {
                panel.classList.toggle('active', panel.dataset.config === config);
            });
        });
    });
    
    tocList.innerHTML = `
        <li><a href="javascript:void(0)" onclick="scrollToSection('what-is-mcp')">${t('mcpWhatIs')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('installation')">${t('mcpInstall')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('configuration')">${t('mcpConfig')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('tools')">${t('mcpTools')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('examples')">${t('mcpExamples')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('resources')">${t('mcpResources')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('clients')">${t('mcpClients')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('troubleshooting')">${t('mcpTroubleshooting')}</a></li>
    `;
}
