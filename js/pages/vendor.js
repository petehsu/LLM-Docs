// ============ 厂商页面渲染 ============

function renderVendorPage(vendor) {
    const wrapper = document.getElementById('content-wrapper');
    const vendorDocs = docsIndex[vendor.id] || { languages: {}, totalDocs: 0 };
    
    // 默认选择第一个语言
    const defaultLang = vendor.languages[0];
    currentDocLang = defaultLang.code;
    
    // 语言标签
    const langTabsHtml = vendor.languages.length > 1 ? `
        <div class="lang-tabs">
            <span class="lang-tabs-label">${t('selectLanguage')}:</span>
            ${vendor.languages.map(lang => `
                <button class="lang-tab ${lang.code === currentDocLang ? 'active' : ''}" 
                        data-lang="${lang.code}" 
                        onclick="switchDocLang('${vendor.id}', '${lang.code}')">
                    ${lang.name}
                </button>
            `).join('')}
        </div>
    ` : '';
    
    wrapper.innerHTML = `
        <div class="breadcrumb">
            <a href="#">${t('home')}</a>
            <span class="breadcrumb-sep">/</span>
            <span>${vendor.name}</span>
        </div>
        
        <div class="vendor-header">
            <img src="${vendor.logo}" alt="${vendor.name}" class="vendor-logo" onerror="this.style.display='none'">
            <div class="vendor-header-info">
                <h1>${vendor.name}</h1>
                <p class="lead">${getVendorDesc(vendor)}</p>
            </div>
            <button class="download-vendor-btn" onclick="downloadVendorDocs('${vendor.id}', this)">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                ${t('downloadVendor')}
            </button>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${vendorDocs.totalDocs}</div>
                <div class="stat-label">${t('statDocs')}</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${vendor.languages.length}</div>
                <div class="stat-label">${t('statLanguages')}</div>
            </div>
        </div>
        
        ${langTabsHtml}
        
        <h2>${t('docList')}</h2>
        <div id="doc-list-container"></div>
    `;
    
    renderDocList(vendor, currentDocLang);
    renderCategoryTOC(vendor, currentDocLang);
}

function switchDocLang(vendorId, langCode) {
    currentDocLang = langCode;
    
    document.querySelectorAll('.lang-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.lang === langCode);
    });
    
    const vendor = VENDORS.find(v => v.id === vendorId);
    if (vendor) {
        renderDocList(vendor, langCode);
        renderCategoryTOC(vendor, langCode);
    }
}

function renderCategoryTOC(vendor, langCode) {
    const tocList = document.getElementById('toc-list');
    const vendorDocs = docsIndex[vendor.id] || { languages: {} };
    const langDocs = vendorDocs.languages?.[langCode] || [];
    
    if (langDocs.length === 0) {
        tocList.innerHTML = `<li class="toc-empty">${t('noToc')}</li>`;
        return;
    }
    
    const folders = new Set();
    langDocs.forEach(doc => {
        const folder = doc.folder || t('rootFolder');
        folders.add(folder);
    });
    
    const sortedFolders = Array.from(folders).sort((a, b) => {
        if (a === t('rootFolder') || a === 'Root' || a === '根目录') return -1;
        if (b === t('rootFolder') || b === 'Root' || b === '根目录') return 1;
        return a.localeCompare(b);
    });
    
    tocList.innerHTML = sortedFolders.map(folder => {
        const count = langDocs.filter(d => (d.folder || t('rootFolder')) === folder).length;
        const folderId = `folder-${folder.replace(/[^a-zA-Z0-9]/g, '_')}`;
        return `
            <li class="toc-category">
                <a href="javascript:void(0)" onclick="scrollToFolder('${folderId}')">
                    <span class="toc-folder-icon">${icon('folder')}</span>
                    <span class="toc-folder-name">${folder}</span>
                    <span class="toc-folder-count">${count}</span>
                </a>
            </li>
        `;
    }).join('');
}

function renderDocList(vendor, langCode) {
    const container = document.getElementById('doc-list-container');
    const vendorDocs = docsIndex[vendor.id] || { languages: {} };
    const langDocs = vendorDocs.languages?.[langCode] || [];
    
    if (langDocs.length === 0) {
        container.innerHTML = `<p class="no-docs">${t('docNotFoundDesc')}</p>`;
        return;
    }
    
    // MegaLLM models 特殊处理
    if (vendor.id === 'megallm' && langCode === 'models') {
        renderModelsGrid(container, vendor, langDocs);
        return;
    }
    
    // 按文件夹分组
    const docsByFolder = {};
    langDocs.forEach(doc => {
        const folder = doc.folder || t('rootFolder');
        if (!docsByFolder[folder]) {
            docsByFolder[folder] = [];
        }
        docsByFolder[folder].push(doc);
    });
    
    const sortedFolders = Object.keys(docsByFolder).sort((a, b) => {
        if (a === t('rootFolder') || a === 'Root' || a === '根目录' || a === '') return -1;
        if (b === t('rootFolder') || b === 'Root' || b === '根目录' || b === '') return 1;
        return a.localeCompare(b);
    });
    
    let html = '';
    sortedFolders.forEach(folder => {
        const docs = docsByFolder[folder];
        const folderId = `folder-${folder.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const escapedFolder = folder.replace(/'/g, "\\'");
        html += `
            <div class="doc-folder" id="${folderId}">
                <h3 class="doc-folder-title">
                    <span class="folder-icon">${icon('folder')}</span> ${folder} <span class="folder-count">(${docs.length})</span>
                    <button class="folder-download-btn" onclick="event.stopPropagation(); downloadFolderDocs('${vendor.id}', '${langCode}', '${escapedFolder}', this)" title="${t('downloadFolder')}">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                        </svg>
                    </button>
                </h3>
                <ul class="doc-list">
                    ${docs.map(doc => `
                        <li class="doc-item">
                            <a href="#${vendor.id}/${langCode}/${doc.path}" class="doc-link">
                                <span class="doc-title">${doc.title || doc.name}</span>
                                <span class="doc-path">${doc.path}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 渲染模型网格（MegaLLM 专用）
async function renderModelsGrid(container, vendor, docs) {
    // 显示加载状态
    container.innerHTML = `<div class="loading-models"><span class="spinner"></span> Loading models...</div>`;
    
    const modelsByProvider = {};
    
    // 过滤掉 README
    const modelDocs = docs.filter(doc => doc.name !== 'README.md');
    
    // 并行请求所有模型文件
    const fetchPromises = modelDocs.map(async (doc) => {
        try {
            const response = await fetch(`docs/${vendor.folder}/models/${doc.path}`);
            if (!response.ok) return null;
            
            const content = await response.text();
            const providerMatch = content.match(/>\s*Provider:\s*(\w+)/);
            const provider = providerMatch ? providerMatch[1] : 'Other';
            const modelIdMatch = content.match(/```\s*\n([^\n`]+)\n\s*```/);
            const modelId = modelIdMatch ? modelIdMatch[1].trim() : doc.name.replace('.md', '');
            const inputPriceMatch = content.match(/Input\s*\|\s*\$?([\d.]+)/);
            const outputPriceMatch = content.match(/Output\s*\|\s*\$?([\d.]+)/);
            const contextMatch = content.match(/Context Window\s*\|\s*([\d,]+)/);
            
            return {
                provider,
                model: {
                    name: doc.title || doc.name.replace('.md', ''),
                    path: doc.path,
                    modelId: modelId,
                    inputPrice: inputPriceMatch ? inputPriceMatch[1] : '-',
                    outputPrice: outputPriceMatch ? outputPriceMatch[1] : '-',
                    context: contextMatch ? contextMatch[1] : '-'
                }
            };
        } catch (e) {
            console.log('Error parsing model:', doc.name, e);
            return null;
        }
    });
    
    // 等待所有请求完成
    const results = await Promise.all(fetchPromises);
    
    // 按 provider 分组
    results.forEach(result => {
        if (!result) return;
        if (!modelsByProvider[result.provider]) {
            modelsByProvider[result.provider] = [];
        }
        modelsByProvider[result.provider].push(result.model);
    });
    
    const providerOrder = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'DeepSeek', 'Alibaba', 'Mistral AI', 'Moonshot', 'Zhipu', 'MiniMax', 'xAI', 'Other'];
    const sortedProviders = Object.keys(modelsByProvider).sort((a, b) => {
        const aIdx = providerOrder.indexOf(a);
        const bIdx = providerOrder.indexOf(b);
        if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
    });
    
    let html = '<div class="models-container">';
    
    for (const provider of sortedProviders) {
        const models = modelsByProvider[provider];
        html += `
            <div class="models-provider-section">
                <h3 class="models-provider-title">${provider} <span class="models-count">(${models.length})</span></h3>
                <div class="models-table-wrapper">
                    <table class="models-table">
                        <thead>
                            <tr>
                                <th>Model</th>
                                <th>Model ID</th>
                                <th>Input</th>
                                <th>Output</th>
                                <th>Context</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${models.map(m => `
                                <tr>
                                    <td>
                                        <a href="#megallm/models/${m.path}" class="model-name-link">${m.name}</a>
                                    </td>
                                    <td>
                                        <code class="model-id" onclick="copyModelId('${m.modelId}', this)" title="Click to copy">${m.modelId}</code>
                                    </td>
                                    <td class="price-cell">${m.inputPrice}/M</td>
                                    <td class="price-cell">${m.outputPrice}/M</td>
                                    <td>${m.context}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// 复制 Model ID
async function copyModelId(modelId, element) {
    try {
        await navigator.clipboard.writeText(modelId);
        const original = element.textContent;
        element.textContent = '✓ Copied!';
        element.classList.add('copied');
        setTimeout(() => {
            element.textContent = original;
            element.classList.remove('copied');
        }, 1500);
    } catch (err) {
        console.error('Copy failed:', err);
    }
}
