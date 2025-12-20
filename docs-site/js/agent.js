// ============ Agent Module ============

let agentMode = false;
let agentMessages = [];
let isAgentStreaming = false;

// ============ 增强的 System Prompt ============
function buildSystemPrompt() {
    // 获取文档统计
    const docStats = getDocumentationStats();
    const scriptInfo = getScriptsSummary();
    const toolDefs = typeof getToolDefinitions === 'function' ? getToolDefinitions() : [];
    
    return `You are **LLM Docs Agent**, an expert AI assistant specialized in:
1. **LLM API Documentation** - Deep knowledge of 10 major LLM providers' APIs
2. **Web Crawling & Scraping** - Expert in extracting documentation from various web frameworks
3. **Code Generation** - Writing Python crawlers, API clients, and automation scripts
4. **Prompt Engineering** - Crafting effective prompts for different models

## Your Knowledge Base
${docStats}

## Available Crawler Scripts
${scriptInfo}

## Your Capabilities
You can help users with:
- Understanding and comparing LLM APIs (OpenAI, Anthropic, Google, DeepSeek, etc.)
- Writing code to interact with LLM APIs
- Creating web crawlers for documentation sites
- Analyzing documentation structure and URL patterns
- Prompt engineering and optimization
- Function calling and tool use implementation

## Tool Usage
You have access to these tools. To use a tool, wrap your call in <tool_call> tags:

${toolDefs.map(t => `### ${t.name}
${t.description}
Parameters: ${JSON.stringify(t.parameters, null, 2)}`).join('\n\n')}

Example tool call:
<tool_call>
{"name": "search_docs", "arguments": {"query": "function calling", "limit": 5}}
</tool_call>

## Response Guidelines
1. Be concise and practical
2. Use code blocks with language tags for code
3. When writing crawlers, consider:
   - URL patterns and Markdown endpoints
   - JavaScript-rendered pages (need Playwright/Selenium)
   - Rate limiting and error handling
   - Multi-language support
4. For API comparisons, highlight key differences
5. When asked about prompts, reference best practices from the documentation

## Code Execution
When you write JavaScript code, it can be executed in the browser sandbox. Python code is for reference/download only.

Remember: You have access to 1600+ documents across 10 LLM providers in 12 languages. Use search_docs to find relevant information.`;
}

// 获取文档统计信息
function getDocumentationStats() {
    let totalDocs = 0;
    const vendorStats = [];
    
    for (const vendor of VENDORS) {
        const vendorDocs = docsIndex[vendor.id];
        if (!vendorDocs) continue;
        
        let count = 0;
        const languages = [];
        
        if (vendorDocs.languages) {
            for (const [lang, docs] of Object.entries(vendorDocs.languages)) {
                count += docs.length;
                languages.push(lang);
            }
        }
        
        if (count > 0) {
            totalDocs += count;
            vendorStats.push(`- **${vendor.name}**: ${count} docs (${languages.join(', ')})`);
        }
    }
    
    return `Total: ${totalDocs} documents from ${VENDORS.length} vendors
${vendorStats.join('\n')}`;
}

// 获取脚本摘要
function getScriptsSummary() {
    if (typeof CRAWLER_SCRIPTS === 'undefined') return 'Scripts info not available';
    
    const crawlers = CRAWLER_SCRIPTS.map(s => 
        `- ${s.vendor}: \`${s.script}\` (${s.deps})`
    ).join('\n');
    
    return `Crawler scripts available:
${crawlers}

Key frameworks used:
- **requests**: Direct HTTP for sites with Markdown endpoints
- **playwright**: For JavaScript-rendered SPAs (React, Vue, Next.js)
- **selenium + undetected-chromedriver**: For Cloudflare-protected sites
- **markdownify/html2text**: HTML to Markdown conversion`;
}

// Initialize Agent UI
function initAgent() {
    createAgentButton();
    createAgentMessagesContainer();
    createCodePanel();
}

// Create Agent button (毛玻璃效果圆形按钮，在搜索框旁边)
function createAgentButton() {
    const floatingSearch = document.querySelector('.floating-search');
    if (!floatingSearch) {
        setTimeout(createAgentButton, 200);
        return;
    }

    if (document.querySelector('.agent-toggle-btn')) return;

    const agentBtn = document.createElement('button');
    agentBtn.className = 'agent-toggle-btn';
    agentBtn.title = t('openAgent');
    agentBtn.innerHTML = `<img src="logos/llmdocs-logo.svg" alt="Agent" class="agent-logo">`;
    agentBtn.onclick = toggleAgentMode;

    // 插入到 floating-search 末尾（在搜索框旁边）
    floatingSearch.appendChild(agentBtn);
}

// Create messages container (显示在搜索框上方)
function createAgentMessagesContainer() {
    if (document.getElementById('agent-messages-container')) return;

    const searchWrapper = document.querySelector('.search-input-wrapper');
    if (!searchWrapper) {
        setTimeout(createAgentMessagesContainer, 200);
        return;
    }

    const container = document.createElement('div');
    container.id = 'agent-messages-container';
    container.className = 'agent-messages-container';
    container.innerHTML = `
        <div class="agent-messages-inner" id="agent-messages"></div>
    `;

    searchWrapper.insertBefore(container, searchWrapper.firstChild);
}

// Create code panel (右侧悬浮代码面板 - 极简结构)
function createCodePanel() {
    if (document.getElementById('code-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'code-panel';
    panel.className = 'code-panel';
    panel.innerHTML = `
        <div class="code-panel-header">
            <span class="code-panel-title">${t('codePreview')}</span>
            <button class="code-panel-close" onclick="closeCodePanel()">
                ${icon('close')}
            </button>
        </div>
        <div class="code-panel-body" id="code-panel-code"></div>
    `;

    document.body.appendChild(panel);
}

// Toggle Agent mode
function toggleAgentMode() {
    const searchInput = document.getElementById('floating-search-input');
    const searchWrapper = document.querySelector('.search-input-wrapper');
    const agentBtn = document.querySelector('.agent-toggle-btn');
    let messagesContainer = document.getElementById('agent-messages-container');
    const searchResults = document.getElementById('search-results-container');

    // 如果消息容器不存在，先创建
    if (!messagesContainer) {
        createAgentMessagesContainer();
        messagesContainer = document.getElementById('agent-messages-container');
    }

    // 空值检查
    if (!searchWrapper || !agentBtn || !searchInput) {
        console.warn('Agent UI elements not found, retrying...');
        setTimeout(toggleAgentMode, 200);
        return;
    }

    agentMode = !agentMode;

    if (agentMode) {
        // 进入 Agent 模式
        searchWrapper.classList.add('agent-mode');
        agentBtn.classList.add('active');
        if (messagesContainer) messagesContainer.classList.add('show');

        // 隐藏搜索结果
        if (searchResults) searchResults.classList.remove('show');

        // 修改输入框
        searchInput.placeholder = t('agentPlaceholder');
        searchInput.value = '';

        // 移除搜索事件，添加 Agent 事件
        searchInput.removeEventListener('input', handleSearch);
        searchInput.addEventListener('keydown', handleAgentKeydown);

        // 显示欢迎消息
        if (agentMessages.length === 0) {
            showWelcomeMessage();
        }
    } else {
        // 退出 Agent 模式
        searchWrapper.classList.remove('agent-mode');
        agentBtn.classList.remove('active');
        if (messagesContainer) messagesContainer.classList.remove('show');

        // 恢复搜索功能
        searchInput.placeholder = t('searchPlaceholder');
        searchInput.value = '';

        searchInput.removeEventListener('keydown', handleAgentKeydown);
        searchInput.addEventListener('input', debounce(handleSearch, 150));

        // 关闭代码面板
        closeCodePanel();
    }
}

// Show welcome message
function showWelcomeMessage() {
    const messagesDiv = document.getElementById('agent-messages');
    messagesDiv.innerHTML = `
        <div class="agent-welcome-msg">
            <div class="welcome-icon">
                <img src="logos/llmdocs-logo.svg" alt="Agent">
            </div>
            <div class="welcome-text">
                <strong>${t('agentWelcome')}</strong>
                <p>${t('agentWelcomeDesc')}</p>
            </div>
        </div>
    `;
}

// Handle Agent keydown
function handleAgentKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAgentMessage();
    }
    if (e.key === 'Escape') {
        toggleAgentMode();
    }
}

// Send message
async function sendAgentMessage() {
    const input = document.getElementById('floating-search-input');
    const message = input.value.trim();

    if (!message || isAgentStreaming) return;

    // Check API config
    const settings = getSettings();
    const apiKey = settings.apiKeys[settings.provider];

    if (!apiKey) {
        showToast(t('configureApiFirst'));
        location.hash = 'settings';
        return;
    }

    // Add user message
    addMessage('user', message);
    input.value = '';

    agentMessages.push({ role: 'user', content: message });

    // Stream response
    await streamResponse();
}

// Add message to UI
function addMessage(role, content, isStreaming = false) {
    const messagesDiv = document.getElementById('agent-messages');

    // Remove welcome message
    const welcome = messagesDiv.querySelector('.agent-welcome-msg');
    if (welcome) welcome.remove();

    const msgDiv = document.createElement('div');
    msgDiv.className = `agent-msg ${role}`;

    if (role === 'user') {
        msgDiv.innerHTML = `<div class="msg-content">${escapeHtml(content)}</div>`;
    } else {
        msgDiv.innerHTML = `
            <div class="msg-avatar"><img src="logos/llmdocs-logo.svg" alt="AI"></div>
            <div class="msg-content">${isStreaming ? '<span class="typing-cursor"></span>' : formatResponse(content)}</div>
        `;
    }

    if (isStreaming) msgDiv.id = 'streaming-msg';

    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    return msgDiv;
}

// Format response
function formatResponse(content) {
    let html = escapeHtml(content);
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\n/g, '<br>');
    return html;
}

// Stream response from API
async function streamResponse() {
    const settings = getSettings();
    const providerId = settings.provider;
    const provider = API_PROVIDERS[providerId];
    const apiKey = settings.apiKeys[providerId];

    let model, baseUrl;
    if (providerId === 'custom') {
        model = settings.customConfig?.modelId;
        baseUrl = settings.customConfig?.baseUrl;
    } else {
        model = settings.selectedModels[providerId] || provider.models[0]?.id;
        baseUrl = provider.baseUrl;
    }

    // Check if using Vercel proxy
    const useVercelProxy = settings.useProxy && typeof isVercel === 'function' && isVercel();
    const useLocalProxy = settings.useProxy && !useVercelProxy;

    isAgentStreaming = true;

    const msgDiv = addMessage('assistant', '', true);
    const contentDiv = msgDiv.querySelector('.msg-content');

    let fullResponse = '';
    let codeBuffer = '';
    let inCodeBlock = false;

    try {
        const headers = provider.headers(apiKey);
        const endpoint =
            typeof provider.endpoint === 'function' ? provider.endpoint(model, apiKey) : provider.endpoint;

        // 使用增强的 system prompt
        const systemPrompt = {
            role: 'system',
            content: buildSystemPrompt(),
        };

        const messages = [systemPrompt, ...agentMessages];
        const body = provider.formatRequest(messages, model);

        let response;
        
        if (useVercelProxy) {
            // Vercel proxy: send request through /api/proxy
            // Note: streaming won't work through proxy, disable it
            body.stream = false;
            response = await fetch('/api/proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetUrl: `${baseUrl}${endpoint}`,
                    headers: headers,
                    body: body,
                }),
            });
        } else if (useLocalProxy) {
            // Local proxy
            const actualBaseUrl = getApiUrl(baseUrl, true);
            response = await fetch(`${actualBaseUrl}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
        } else {
            // Direct call
            response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
        }

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        if (body.stream && response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const json = JSON.parse(data);
                            let text = '';

                            if (providerId === 'anthropic') {
                                if (json.type === 'content_block_delta') {
                                    text = json.delta?.text || '';
                                }
                            } else {
                                text = json.choices?.[0]?.delta?.content || '';
                            }

                            if (text) {
                                fullResponse += text;
                                contentDiv.innerHTML =
                                    formatResponse(fullResponse) + '<span class="typing-cursor"></span>';

                                // Check for code blocks
                                if (text.includes('```')) {
                                    inCodeBlock = !inCodeBlock;
                                    if (inCodeBlock) {
                                        openCodePanel();
                                        codeBuffer = '';
                                    }
                                }

                                if (inCodeBlock) {
                                    codeBuffer += text;
                                    updateCodePanel(codeBuffer);
                                }

                                msgDiv.parentElement.scrollTop = msgDiv.parentElement.scrollHeight;
                            }
                        } catch {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } else {
            const data = await response.json();
            let text = '';

            if (providerId === 'anthropic') {
                text = data.content?.[0]?.text || '';
            } else if (providerId === 'google') {
                text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            } else {
                text = data.choices?.[0]?.message?.content || '';
            }

            fullResponse = text;
        }

        contentDiv.innerHTML = formatResponse(fullResponse);
        msgDiv.id = '';

        agentMessages.push({ role: 'assistant', content: fullResponse });

        // Highlight code
        msgDiv.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        // 处理工具调用
        await handleToolCalls(fullResponse, msgDiv);

    } catch (err) {
        let errorMsg = err.message;
        
        // 检测 CORS 错误
        if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
            const isGitHubPages = window.location.hostname.includes('github.io');
            if (isGitHubPages) {
                errorMsg = t('corsErrorGitHub') || 'CORS error: AI Agent requires a proxy server. Please run locally with proxy-server.py or use Settings to configure a CORS-enabled API endpoint.';
            } else {
                errorMsg = t('corsError') || 'CORS error: Please enable proxy in Settings or run proxy-server.py locally.';
            }
        }
        
        contentDiv.innerHTML = `<span class="error-msg">${t('agentError')}: ${errorMsg}</span>`;
    }

    isAgentStreaming = false;
}

// 处理工具调用
async function handleToolCalls(response, msgDiv) {
    if (typeof parseToolCalls !== 'function') return;
    
    const toolCalls = parseToolCalls(response);
    if (toolCalls.length === 0) return;

    for (const call of toolCalls) {
        // 显示工具调用状态
        const toolStatus = document.createElement('div');
        toolStatus.className = 'tool-call-status';
        toolStatus.innerHTML = `<span class="tool-icon">🔧</span> Executing: ${call.name}...`;
        msgDiv.appendChild(toolStatus);

        try {
            const result = await executeToolCall(call);
            
            // 更新状态
            toolStatus.innerHTML = `<span class="tool-icon">✓</span> ${call.name}: ${result.success ? 'Success' : 'Failed'}`;
            
            // 如果是代码执行，显示结果
            if (call.name === 'execute_code' && result.success) {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'tool-result';
                resultDiv.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
                msgDiv.appendChild(resultDiv);
            }
            
            // 将结果添加到对话历史
            agentMessages.push({
                role: 'user',
                content: `Tool result for ${call.name}: ${JSON.stringify(result)}`
            });
            
        } catch (err) {
            toolStatus.innerHTML = `<span class="tool-icon">✗</span> ${call.name}: Error - ${err.message}`;
        }
    }
}

// Open code panel (悬浮窗样式)
function openCodePanel() {
    const panel = document.getElementById('code-panel');
    panel.classList.add('open');
}

// Close code panel
function closeCodePanel() {
    const panel = document.getElementById('code-panel');
    panel.classList.remove('open');
}

// Update code panel content
function updateCodePanel(code) {
    const codeEl = document.getElementById('code-panel-code');
    const match = code.match(/```(\w*)\n?([\s\S]*)/);
    if (match) {
        const lang = match[1] || 'plaintext';
        const codeText = match[2];
        // 使用 hljs 高亮但不让它添加背景
        const highlighted = hljs.highlight(codeText, { language: lang, ignoreIllegals: true });
        codeEl.innerHTML = `<pre><code class="hljs">${highlighted.value}</code></pre>`;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initAgent, 100);
});
