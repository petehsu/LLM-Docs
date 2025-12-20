// ============ Settings Page ============

// API Provider configurations - 每个提供商只保留最新的2个模型（基于文档中的最新信息）
const API_PROVIDERS = {
    openai: {
        name: 'OpenAI',
        logo: 'logos/openai.svg',
        baseUrl: 'https://api.openai.com/v1',
        models: [
            { id: 'gpt-4o', name: 'GPT-4o' },
            { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
        ],
        headers: (apiKey) => ({
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        }),
        endpoint: '/chat/completions',
        formatRequest: (messages, model) => ({
            model,
            messages,
            stream: true,
        }),
    },
    anthropic: {
        name: 'Anthropic Claude',
        logo: 'logos/anthropic.svg',
        baseUrl: 'https://api.anthropic.com/v1',
        models: [
            { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5' },
            { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4' },
        ],
        headers: (apiKey) => ({
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
        }),
        endpoint: '/messages',
        formatRequest: (messages, model) => ({
            model,
            max_tokens: 4096,
            messages,
            stream: true,
        }),
    },
    deepseek: {
        name: 'DeepSeek',
        logo: 'logos/deepseek.svg',
        baseUrl: 'https://api.deepseek.com',
        models: [
            { id: 'deepseek-chat', name: 'DeepSeek V3.2' },
            { id: 'deepseek-reasoner', name: 'DeepSeek R1' },
        ],
        headers: (apiKey) => ({
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        }),
        endpoint: '/chat/completions',
        formatRequest: (messages, model) => ({
            model,
            messages,
            stream: true,
        }),
    },
    google: {
        name: 'Google Gemini',
        logo: 'logos/google.svg',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        models: [
            { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
            { id: 'gemini-2.5-pro-preview-06-05', name: 'Gemini 2.5 Pro' },
        ],
        headers: () => ({
            'Content-Type': 'application/json',
        }),
        endpoint: (model, apiKey) => `/models/${model}:streamGenerateContent?key=${apiKey}`,
        formatRequest: (messages) => ({
            contents: messages.map((m) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            })),
        }),
    },
    zhipu: {
        name: 'Zhipu BigModel',
        logo: 'logos/zhipu.svg',
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
        models: [
            { id: 'glm-4-plus', name: 'GLM-4 Plus' },
            { id: 'glm-z1-air', name: 'GLM-Z1 Air' },
        ],
        headers: (apiKey) => ({
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        }),
        endpoint: '/chat/completions',
        formatRequest: (messages, model) => ({
            model,
            messages,
            stream: true,
        }),
    },
    moonshot: {
        name: 'Moonshot Kimi',
        logo: 'logos/moonshot.svg',
        baseUrl: 'https://api.moonshot.cn/v1',
        models: [
            { id: 'kimi-k2-0905-preview', name: 'Kimi K2' },
            { id: 'moonshot-v1-auto', name: 'Moonshot Auto' },
        ],
        headers: (apiKey) => ({
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        }),
        endpoint: '/chat/completions',
        formatRequest: (messages, model) => ({
            model,
            messages,
            stream: true,
        }),
    },
    minimax: {
        name: 'MiniMax',
        logo: 'logos/minimax.svg',
        baseUrl: 'https://api.minimax.chat/v1',
        models: [
            { id: 'MiniMax-M1', name: 'MiniMax M1' },
            { id: 'MiniMax-Text-01', name: 'MiniMax Text 01' },
        ],
        headers: (apiKey) => ({
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        }),
        endpoint: '/text/chatcompletion_v2',
        formatRequest: (messages, model) => ({
            model,
            messages,
            stream: true,
        }),
    },
    custom: {
        name: 'Custom',
        logo: 'logos/llmdocs-logo.svg',
        baseUrl: '',
        models: [],
        headers: (apiKey) => ({
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        }),
        endpoint: '/chat/completions',
        formatRequest: (messages, model) => ({
            model,
            messages,
            stream: true,
        }),
    },
};

// Proxy configuration
const LOCAL_PROXY_URL = 'http://localhost:8888/proxy/';
const VERCEL_PROXY_URL = '/api/proxy';

// Check if running on Vercel
function isVercel() {
    return window.location.hostname.includes('vercel.app');
}

// Check if proxy is available
async function checkProxyAvailable() {
    if (isVercel()) return true; // Vercel always has proxy
    try {
        const response = await fetch(LOCAL_PROXY_URL.slice(0, -7), { method: 'HEAD', mode: 'no-cors' });
        return true;
    } catch {
        return false;
    }
}

// Get the actual API URL (with or without proxy)
function getApiUrl(baseUrl, useProxy = false) {
    if (!useProxy) return baseUrl;
    
    if (isVercel()) {
        // On Vercel, return the proxy endpoint (we'll handle the full URL in the request)
        return VERCEL_PROXY_URL;
    }
    
    // Local proxy: Convert https://api.deepseek.com to http://localhost:8888/proxy/api.deepseek.com
    return LOCAL_PROXY_URL + baseUrl.replace(/^https?:\/\//, '');
}

// Get saved settings
function getSettings() {
    const saved = localStorage.getItem('llm-settings');
    const settings = saved
        ? JSON.parse(saved)
        : {
              provider: 'openai',
              apiKeys: {},
              selectedModels: {},
              customConfig: {
                  baseUrl: '',
                  modelId: '',
                  modelName: '',
              },
          };
    // 强制启用代理
    settings.useProxy = true;
    return settings;
}

// Save settings
function saveSettings(settings) {
    localStorage.setItem('llm-settings', JSON.stringify(settings));
}

// Render settings page
function renderSettingsPage() {
    const settings = getSettings();
    const wrapper = document.getElementById('content-wrapper');

    wrapper.innerHTML = `
        <div class="breadcrumb">
            <a href="#" onclick="location.hash='';return false;">${t('home')}</a>
            <span class="breadcrumb-sep">/</span>
            <span>${t('settings')}</span>
        </div>
        
        <h1>${t('settingsTitle')}</h1>
        <p class="lead">${t('settingsDesc')}</p>
        
        <div class="settings-container">
            <div class="settings-section" id="select-provider">
                <h2>${t('selectProvider')}</h2>
                <div class="provider-grid">
                    ${Object.entries(API_PROVIDERS)
                        .map(
                            ([id, provider]) => `
                        <div class="provider-card ${settings.provider === id ? 'selected' : ''}" 
                             data-provider="${id}" onclick="selectProvider('${id}')">
                            <img src="${provider.logo}" alt="${provider.name}" class="provider-logo">
                            <span class="provider-name">${provider.name}</span>
                            ${settings.apiKeys[id] ? '<span class="provider-configured">✓</span>' : ''}
                        </div>
                    `
                        )
                        .join('')}
                </div>
            </div>
            
            <div class="settings-section" id="api-config">
                <h2>${t('apiConfiguration')}</h2>
                <div class="config-form" id="config-form">
                    ${renderConfigForm(settings)}
                </div>
            </div>
            
            <div class="settings-section" id="test-connection">
                <h2>${t('testConnection')}</h2>
                <button class="test-btn" onclick="testApiConnection()">
                    ${icon('play')} ${t('testApi')}
                </button>
                <div id="test-result" class="test-result"></div>
            </div>
        </div>
    `;

    // Check proxy status
    checkProxyStatus();

    // Update TOC
    document.getElementById('toc-list').innerHTML = `
        <li><a href="javascript:void(0)" onclick="scrollToSection('select-provider')">${t('selectProvider')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('api-config')">${t('apiConfiguration')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('proxy-config')">${t('proxySettings') || 'Proxy'}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('test-connection')">${t('testConnection')}</a></li>
    `;
}

// Render config form for selected provider
function renderConfigForm(settings) {
    const providerId = settings.provider;
    const provider = API_PROVIDERS[providerId];
    if (!provider) return '';

    const apiKey = settings.apiKeys[providerId] || '';
    const selectedModel = settings.selectedModels[providerId] || provider.models[0]?.id || '';

    // Custom provider has different form
    if (providerId === 'custom') {
        const customConfig = settings.customConfig || {};
        return `
            <div class="form-group">
                <label>${t('baseUrl')}</label>
                <input type="text" id="custom-base-url" value="${customConfig.baseUrl || ''}" 
                       class="form-input" placeholder="https://api.example.com/v1">
            </div>
            
            <div class="form-group">
                <label>${t('modelId')}</label>
                <input type="text" id="custom-model-id" value="${customConfig.modelId || ''}" 
                       class="form-input" placeholder="gpt-4">
            </div>
            
            <div class="form-group">
                <label>${t('modelName')}</label>
                <input type="text" id="custom-model-name" value="${customConfig.modelName || ''}" 
                       class="form-input" placeholder="GPT-4">
            </div>
            
            <div class="form-group">
                <label>${t('apiKey')}</label>
                <div class="api-key-input">
                    <input type="password" id="api-key-input" value="${apiKey}" 
                           placeholder="${t('enterApiKey')}" class="form-input">
                    <button class="toggle-visibility" onclick="toggleApiKeyVisibility()">
                        ${icon('eye')}
                    </button>
                </div>
            </div>
            
            <button class="save-btn" onclick="saveApiSettings()">
                ${icon('save')} ${t('saveSettings')}
            </button>
        `;
    }

    return `
        <div class="form-group">
            <label>${t('apiKey')}</label>
            <div class="api-key-input">
                <input type="password" id="api-key-input" value="${apiKey}" 
                       placeholder="${t('enterApiKey')}" class="form-input">
                <button class="toggle-visibility" onclick="toggleApiKeyVisibility()">
                    ${icon('eye')}
                </button>
            </div>
            <p class="form-hint">${t('apiKeyHint')}</p>
        </div>
        
        <div class="form-group">
            <label>${t('selectModel')}</label>
            <div class="model-buttons" id="model-buttons">
                ${provider.models
                    .map(
                        (m) => `
                    <button type="button" class="model-btn ${selectedModel === m.id ? 'selected' : ''}" 
                            data-model-id="${m.id}" onclick="selectModel('${m.id}')">
                        ${m.name}
                    </button>
                `
                    )
                    .join('')}
            </div>
        </div>
        
        <div class="form-group">
            <label>${t('baseUrl')}</label>
            <input type="text" id="base-url-display" value="${provider.baseUrl}" 
                   class="form-input" disabled readonly>
            <p class="form-hint">${t('baseUrlFixed')}</p>
        </div>
        
        <button class="save-btn" onclick="saveApiSettings()">
            ${icon('save')} ${t('saveSettings')}
        </button>
    `;
}

// Select provider
function selectProvider(providerId) {
    const settings = getSettings();
    settings.provider = providerId;
    saveSettings(settings);

    // Update UI
    document.querySelectorAll('.provider-card').forEach((card) => {
        card.classList.toggle('selected', card.dataset.provider === providerId);
    });

    document.getElementById('config-form').innerHTML = renderConfigForm(settings);
}

// Toggle API key visibility
function toggleApiKeyVisibility() {
    const input = document.getElementById('api-key-input');
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Select model (button click)
function selectModel(modelId) {
    const settings = getSettings();
    settings.selectedModels[settings.provider] = modelId;
    saveSettings(settings);

    // Update UI
    document.querySelectorAll('.model-btn').forEach((btn) => {
        btn.classList.toggle('selected', btn.dataset.modelId === modelId);
    });
}

// Save API settings
function saveApiSettings() {
    const settings = getSettings();
    const apiKey = document.getElementById('api-key-input').value.trim();

    if (settings.provider === 'custom') {
        // Save custom config
        settings.customConfig = {
            baseUrl: document.getElementById('custom-base-url').value.trim(),
            modelId: document.getElementById('custom-model-id').value.trim(),
            modelName: document.getElementById('custom-model-name').value.trim(),
        };
    }
    // Model selection is already saved via selectModel()

    if (apiKey) {
        settings.apiKeys[settings.provider] = apiKey;
    }

    saveSettings(settings);
    showToast(t('settingsSaved'));

    // Update provider card to show configured status
    const card = document.querySelector(`.provider-card[data-provider="${settings.provider}"]`);
    if (card && apiKey && !card.querySelector('.provider-configured')) {
        card.innerHTML += '<span class="provider-configured">✓</span>';
    }
}

// Toggle proxy setting
function toggleProxy(enabled) {
    const settings = getSettings();
    settings.useProxy = enabled;
    saveSettings(settings);
    checkProxyStatus();
}

// Check proxy server status
async function checkProxyStatus() {
    const statusDiv = document.getElementById('proxy-status');
    if (!statusDiv) return;

    const settings = getSettings();
    if (!settings.useProxy) {
        statusDiv.innerHTML = `<span class="status-disabled">Proxy disabled</span>`;
        return;
    }

    statusDiv.innerHTML = `<span class="status-checking">Checking proxy...</span>`;

    try {
        const response = await fetch('http://localhost:8888/', { 
            method: 'GET',
            mode: 'cors'
        });
        statusDiv.innerHTML = `<span class="status-online">✓ Proxy server online</span>`;
    } catch {
        statusDiv.innerHTML = `<span class="status-offline">✗ Proxy server offline - Run: <code>python3 proxy-server.py</code></span>`;
    }
}

// Test API connection
async function testApiConnection() {
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

    const resultDiv = document.getElementById('test-result');

    if (!apiKey) {
        resultDiv.innerHTML = `<div class="test-error">${t('noApiKey')}</div>`;
        return;
    }

    resultDiv.innerHTML = `<div class="test-loading"><span class="spinner"></span>${t('testing')}</div>`;

    try {
        const messages = [{ role: 'user', content: 'Say "Hello" in one word.' }];
        const headers = provider.headers(apiKey);
        const endpoint =
            typeof provider.endpoint === 'function' ? provider.endpoint(model, apiKey) : provider.endpoint;
        const body = provider.formatRequest(messages, model);

        // For test, disable streaming
        if (body.stream !== undefined) body.stream = false;

        // Use proxy if enabled
        const useProxy = settings.useProxy;
        let response;

        if (useProxy && isVercel()) {
            // Vercel proxy: send request through /api/proxy
            response = await fetch(VERCEL_PROXY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetUrl: `${baseUrl}${endpoint}`,
                    headers: headers,
                    body: body,
                }),
            });
        } else if (useProxy) {
            // Local proxy
            const actualBaseUrl = getApiUrl(baseUrl, true);
            response = await fetch(`${actualBaseUrl}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
        } else {
            // Direct call (will fail due to CORS on most browsers)
            response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
        }

        if (response.ok) {
            const data = await response.json();
            resultDiv.innerHTML = `
                <div class="test-success">
                    ${icon('check')} ${t('connectionSuccess')}
                    <div class="test-response">${JSON.stringify(data, null, 2).slice(0, 500)}...</div>
                </div>
            `;
        } else {
            const error = await response.text();
            resultDiv.innerHTML = `
                <div class="test-error">
                    ${icon('error')} ${t('connectionFailed')}: ${response.status}
                    <div class="test-response">${error.slice(0, 300)}</div>
                </div>
            `;
        }
    } catch (err) {
        resultDiv.innerHTML = `
            <div class="test-error">
                ${icon('error')} ${t('connectionError')}: ${err.message}
                ${settings.useProxy && !isVercel() ? '<br><small>Make sure proxy server is running: <code>python3 proxy-server.py</code></small>' : '<br><small>Try enabling the CORS proxy in settings above.</small>'}
            </div>
        `;
    }
}
