// 文档索引
let docsIndex = {};

// 爬取状态
let crawlStatus = {};

// 事件日志
let crawlEvents = [];

// 当前状态
let currentVendor = null;
let currentDocLang = null;

// 当前文档内容（用于复制和下载）
let currentDocContent = '';
let currentDocPath = '';

// ============ SVG 图标 ============
const ICONS = {
    // 爬取状态
    auto: '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2"/></svg>',
    manual: '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
    pending: '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 2"/></svg>',
    success: '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
    error: '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    
    // 文件夹和文档
    folder: '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>',
    doc: '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>',
    
    // 事件类型
    info: '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
    warning: '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
    start: '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    complete: '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>',
    skip: '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>',
    
    // MCP 功能
    list: '<svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>',
    read: '<svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>',
    search: '<svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
    stats: '<svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>',
    
    // 问题
    question: '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>',
    
    // 系统
    system: '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>',
};

// 获取图标 HTML
function icon(name, size = 14) {
    return ICONS[name] || '';
}

// ============ 下载功能 ============

// 下载单个文件
function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 复制文档内容
async function copyDocContent() {
    if (!currentDocContent) return;
    try {
        await navigator.clipboard.writeText(currentDocContent);
        showToast(t('copied'));
    } catch (err) {
        console.error('Copy failed:', err);
        showToast(t('downloadFailed'));
    }
}

// 下载当前文档
function downloadCurrentDoc() {
    if (!currentDocContent || !currentDocPath) return;
    const filename = currentDocPath.split('/').pop() || 'document.md';
    downloadFile(currentDocContent, filename);
}

// 显示提示消息
function showToast(message, duration = 2000) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

// 更新下载按钮状态
function setDownloadBtnLoading(btn, loading) {
    if (loading) {
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = `<span class="spinner"></span> ${t('packaging')}`;
        btn.disabled = true;
    } else {
        btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
        btn.disabled = false;
    }
}

// 打包下载厂商所有文档
async function downloadVendorDocs(vendorId, btn) {
    const vendor = VENDORS.find(v => v.id === vendorId);
    if (!vendor) return;
    
    const vendorDocs = docsIndex[vendorId];
    if (!vendorDocs || !vendorDocs.languages) {
        showToast(t('downloadFailed'));
        return;
    }
    
    if (btn) setDownloadBtnLoading(btn, true);
    showToast(t('downloading'));
    
    try {
        const zip = new JSZip();
        let count = 0;
        
        for (const [langCode, docs] of Object.entries(vendorDocs.languages)) {
            const langConfig = vendor.languages.find(l => l.code === langCode);
            
            for (const doc of docs) {
                let filePath;
                if (langConfig?.folder) {
                    filePath = `docs/${vendor.folder}/${langConfig.folder}/${doc.path}`;
                } else {
                    filePath = `docs/${vendor.folder}/${doc.path}`;
                }
                
                try {
                    const response = await fetch(filePath);
                    if (response.ok) {
                        const content = await response.text();
                        // 保持目录结构
                        const zipPath = `${vendor.name}/${langCode}/${doc.path}`;
                        zip.file(zipPath, content);
                        count++;
                    }
                } catch (e) {
                    console.log('Failed to fetch:', filePath);
                }
            }
        }
        
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${vendor.name}-docs.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`${t('downloadComplete')} (${count} files)`);
    } catch (err) {
        console.error('Download failed:', err);
        showToast(t('downloadFailed'));
    } finally {
        if (btn) setDownloadBtnLoading(btn, false);
    }
}

// 打包下载文件夹内的文档
async function downloadFolderDocs(vendorId, langCode, folder, btn) {
    const vendor = VENDORS.find(v => v.id === vendorId);
    if (!vendor) return;
    
    const vendorDocs = docsIndex[vendorId];
    const langDocs = vendorDocs?.languages?.[langCode] || [];
    const folderDocs = langDocs.filter(d => (d.folder || t('rootFolder')) === folder);
    
    if (folderDocs.length === 0) {
        showToast(t('downloadFailed'));
        return;
    }
    
    if (btn) setDownloadBtnLoading(btn, true);
    showToast(t('downloading'));
    
    try {
        const zip = new JSZip();
        const langConfig = vendor.languages.find(l => l.code === langCode);
        let count = 0;
        
        for (const doc of folderDocs) {
            let filePath;
            if (langConfig?.folder) {
                filePath = `docs/${vendor.folder}/${langConfig.folder}/${doc.path}`;
            } else {
                filePath = `docs/${vendor.folder}/${doc.path}`;
            }
            
            try {
                const response = await fetch(filePath);
                if (response.ok) {
                    const content = await response.text();
                    zip.file(doc.path, content);
                    count++;
                }
            } catch (e) {
                console.log('Failed to fetch:', filePath);
            }
        }
        
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeFolderName = folder.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
        a.download = `${vendor.name}-${safeFolderName}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`${t('downloadComplete')} (${count} files)`);
    } catch (err) {
        console.error('Download failed:', err);
        showToast(t('downloadFailed'));
    } finally {
        if (btn) setDownloadBtnLoading(btn, false);
    }
}

// 打包下载所有文档
async function downloadAllDocs(btn) {
    if (btn) setDownloadBtnLoading(btn, true);
    showToast(t('downloading'));
    
    try {
        const zip = new JSZip();
        let count = 0;
        
        for (const vendor of VENDORS) {
            const vendorDocs = docsIndex[vendor.id];
            if (!vendorDocs || !vendorDocs.languages) continue;
            
            for (const [langCode, docs] of Object.entries(vendorDocs.languages)) {
                const langConfig = vendor.languages.find(l => l.code === langCode);
                
                for (const doc of docs) {
                    let filePath;
                    if (langConfig?.folder) {
                        filePath = `docs/${vendor.folder}/${langConfig.folder}/${doc.path}`;
                    } else {
                        filePath = `docs/${vendor.folder}/${doc.path}`;
                    }
                    
                    try {
                        const response = await fetch(filePath);
                        if (response.ok) {
                            const content = await response.text();
                            const zipPath = `${vendor.name}/${langCode}/${doc.path}`;
                            zip.file(zipPath, content);
                            count++;
                        }
                    } catch (e) {
                        console.log('Failed to fetch:', filePath);
                    }
                }
            }
        }
        
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'LLM-API-Docs-All.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`${t('downloadComplete')} (${count} files)`);
    } catch (err) {
        console.error('Download failed:', err);
        showToast(t('downloadFailed'));
    } finally {
        if (btn) setDownloadBtnLoading(btn, false);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    // 初始化主题
    initTheme();
    
    // 加载文档索引
    try {
        const response = await fetch('docs-index.json');
        docsIndex = await response.json();
    } catch (e) {
        console.log('No docs index found');
        docsIndex = {};
    }
    
    // 加载爬取状态
    try {
        const response = await fetch('crawl-status.json');
        crawlStatus = await response.json();
    } catch (e) {
        console.log('No crawl status found');
        crawlStatus = {};
    }
    
    // 加载事件日志
    try {
        const response = await fetch('crawl-events.json');
        crawlEvents = await response.json();
    } catch (e) {
        console.log('No crawl events found');
        crawlEvents = [];
    }
    
    // 初始化 i18n
    initI18n();
    
    // 渲染侧边栏
    renderSidebar();
    
    // 初始化搜索
    initSearch();
    
    // 处理 URL hash
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    // 搜索快捷键
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
        if (e.key === 'Escape') {
            closeSearch();
        }
    });
});

// 获取厂商的爬取状态
function getVendorCrawlStatus(vendorId) {
    // 映射 vendor id 到 crawler id
    const idMap = {
        'openai': 'openai',
        'anthropic': 'claude',
        'google': 'gemini',
        'meta': 'meta',
        'xai': 'grok',
        'moonshot': 'moonshot',
        'zhipu': 'zhipu',
        'minimax': 'minimax',
        'megallm': 'megallm',
        'deepseek': 'deepseek',
    };
    const crawlerId = idMap[vendorId];
    return crawlStatus[crawlerId] || null;
}

// 格式化时间差
function formatTimeAgo(isoTime) {
    if (!isoTime) return '';
    const date = new Date(isoTime);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

// 主题切换
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(theme);
    
    // 监听主题切换按钮
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // 切换代码高亮样式
    const lightStyle = document.getElementById('hljs-light');
    const darkStyle = document.getElementById('hljs-dark');
    if (lightStyle && darkStyle) {
        if (theme === 'dark') {
            lightStyle.disabled = true;
            darkStyle.disabled = false;
        } else {
            lightStyle.disabled = false;
            darkStyle.disabled = true;
        }
    }
    
    // 更新 favicon
    if (typeof updateFavicon === 'function') {
        updateFavicon(theme === 'dark');
    }
}

function renderSidebar() {
    const vendorList = document.getElementById('vendor-list');
    vendorList.innerHTML = VENDORS.map(vendor => {
        const docCount = docsIndex[vendor.id]?.totalDocs || 0;
        const status = getVendorCrawlStatus(vendor.id);
        
        // 根据爬取类型显示不同图标
        let crawlIcon = '';
        if (status) {
            if (status.auto) {
                crawlIcon = `<span class="crawl-icon auto" title="${t('autoCrawl')}: ${formatTimeAgo(status?.lastCrawlTime)}">${icon('auto')}</span>`;
            } else {
                crawlIcon = `<span class="crawl-icon manual" title="${t('manualCrawl')}: ${formatTimeAgo(status?.lastCrawlTime)}">${icon('manual')}</span>`;
            }
        } else {
            crawlIcon = `<span class="crawl-icon pending" title="${t('neverCrawled')}">${icon('pending')}</span>`;
        }
        
        return `
            <li class="nav-item">
                <a href="#${vendor.id}" class="nav-link" data-vendor="${vendor.id}">
                    <img src="${vendor.logo}" alt="${vendor.name}" class="nav-icon" onerror="this.style.display='none'">
                    <span class="nav-text">${vendor.name}</span>
                    ${crawlIcon}
                    <span class="nav-count">${docCount}</span>
                </a>
            </li>
        `;
    }).join('');
}

function handleHashChange() {
    const hash = location.hash.slice(1);
    
    if (!hash) {
        renderHomePage();
        updateActiveNav(null);
        return;
    }
    
    // 技术文档页面
    if (hash === 'tech-docs' || hash.startsWith('tech-docs/')) {
        renderTechDocsPage(hash);
        updateActiveNav('tech-docs');
        return;
    }
    
    // 事件日志页面
    if (hash === 'events') {
        renderEventsPage();
        updateActiveNav('events');
        return;
    }
    
    // MCP 配置页面
    if (hash === 'mcp') {
        renderMcpPage();
        updateActiveNav('mcp');
        return;
    }
    
    const parts = hash.split('/');
    const vendorId = parts[0];
    const docPath = parts.slice(1).join('/');
    
    const vendor = VENDORS.find(v => v.id === vendorId);
    if (!vendor) {
        renderHomePage();
        return;
    }
    
    currentVendor = vendor;
    updateActiveNav(vendorId);
    
    if (docPath) {
        loadDocument(vendor, docPath);
    } else {
        renderVendorPage(vendor);
    }
}

function updateActiveNav(vendorId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.vendor === vendorId);
    });
}

function renderHomePage() {
    const wrapper = document.getElementById('content-wrapper');
    
    let totalDocs = 0;
    VENDORS.forEach(vendor => {
        totalDocs += docsIndex[vendor.id]?.totalDocs || 0;
    });
    
    const statsHtml = `
        <div class="stat-card">
            <div class="stat-value">${VENDORS.length}</div>
            <div class="stat-label">${t('statVendors')}</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${totalDocs}</div>
            <div class="stat-label">${t('statDocs')}</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">12</div>
            <div class="stat-label">${t('statLanguages')}</div>
        </div>
    `;
    
    const vendorCardsHtml = VENDORS.map(vendor => {
        const docCount = docsIndex[vendor.id]?.totalDocs || 0;
        const langCount = vendor.languages.length;
        const status = getVendorCrawlStatus(vendor.id);
        
        // 根据爬取类型显示不同图标和状态
        let crawlBadge = '';
        let crawlInfo = '';
        
        if (status) {
            if (status.auto) {
                crawlBadge = `<span class="crawl-badge auto" title="${t('autoCrawl')}">${icon('auto')}</span>`;
            } else {
                crawlBadge = `<span class="crawl-badge manual" title="${t('manualCrawl')}">${icon('manual')}</span>`;
            }
            crawlInfo = `<span class="crawl-time">${formatTimeAgo(status?.lastCrawlTime)}</span>`;
        } else {
            crawlBadge = `<span class="crawl-badge pending" title="${t('neverCrawled')}">${icon('pending')}</span>`;
        }
        
        return `
            <div class="vendor-card" onclick="location.hash='${vendor.id}'">
                <div class="vendor-card-header">
                    <img src="${vendor.logo}" alt="${vendor.name}" class="vendor-card-logo" onerror="this.style.display='none'">
                    <span class="vendor-card-title">${vendor.name}</span>
                    ${crawlBadge}
                </div>
                <div class="vendor-card-desc">${getVendorDesc(vendor)}</div>
                <div class="vendor-card-stats">
                    <span>${docCount} ${t('statDocs')}</span>
                    <span>${langCount} ${t('statLanguages')}</span>
                    ${crawlInfo}
                </div>
            </div>
        `;
    }).join('');
    
    wrapper.innerHTML = `
        <div class="page-header-with-action">
            <div>
                <h1>${t('homeTitle')}</h1>
                <p class="lead">${t('homeDesc')}</p>
            </div>
            <button class="download-all-btn" onclick="downloadAllDocs(this)">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                ${t('downloadAll')}
            </button>
        </div>
        
        <div class="stats-grid">${statsHtml}</div>
        
        <h2>${t('selectVendor')}</h2>
        <p>${t('selectVendorDesc')}</p>
        
        <div class="vendor-cards">${vendorCardsHtml}</div>
    `;
    
    // Clear TOC
    document.getElementById('toc-list').innerHTML = '';
}

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
    
    // 渲染文档列表
    renderDocList(vendor, currentDocLang);
    
    // 渲染分类目录到右侧 TOC
    renderCategoryTOC(vendor, currentDocLang);
}

function switchDocLang(vendorId, langCode) {
    currentDocLang = langCode;
    
    // 更新标签状态
    document.querySelectorAll('.lang-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.lang === langCode);
    });
    
    // 重新渲染文档列表
    const vendor = VENDORS.find(v => v.id === vendorId);
    if (vendor) {
        renderDocList(vendor, langCode);
        renderCategoryTOC(vendor, langCode);
    }
}

// 渲染分类目录到右侧 TOC
function renderCategoryTOC(vendor, langCode) {
    const tocList = document.getElementById('toc-list');
    const vendorDocs = docsIndex[vendor.id] || { languages: {} };
    const langDocs = vendorDocs.languages?.[langCode] || [];
    
    if (langDocs.length === 0) {
        tocList.innerHTML = `<li class="toc-empty">${t('noToc')}</li>`;
        return;
    }
    
    // 收集所有文件夹
    const folders = new Set();
    langDocs.forEach(doc => {
        const folder = doc.folder || t('rootFolder');
        folders.add(folder);
    });
    
    // 按文件夹排序
    const sortedFolders = Array.from(folders).sort((a, b) => {
        // Root 放最前面
        if (a === t('rootFolder') || a === 'Root' || a === '根目录') return -1;
        if (b === t('rootFolder') || b === 'Root' || b === '根目录') return 1;
        return a.localeCompare(b);
    });
    
    // 生成 TOC HTML - 使用 javascript:void(0) 避免 hash 变化
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

// 滚动到指定文件夹
function scrollToFolder(folderId) {
    const element = document.getElementById(folderId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function renderDocList(vendor, langCode) {
    const container = document.getElementById('doc-list-container');
    const vendorDocs = docsIndex[vendor.id] || { languages: {} };
    const langDocs = vendorDocs.languages?.[langCode] || [];
    
    if (langDocs.length === 0) {
        container.innerHTML = `<p class="no-docs">${t('docNotFoundDesc')}</p>`;
        return;
    }
    
    // MegaLLM models 特殊处理 - 按厂商分组的模型卡片
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
    
    // 排序文件夹（Root 在前）
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
    // 从文件名提取模型信息并按厂商分组
    const modelsByProvider = {};
    
    // 解析每个模型文件获取详细信息
    for (const doc of docs) {
        if (doc.name === 'README.md') continue;
        
        try {
            const response = await fetch(`docs/${vendor.folder}/models/${doc.path}`);
            if (!response.ok) continue;
            
            const content = await response.text();
            
            // 提取 Provider
            const providerMatch = content.match(/>\s*Provider:\s*(\w+)/);
            const provider = providerMatch ? providerMatch[1] : 'Other';
            
            // 提取 Model ID
            const modelIdMatch = content.match(/```\s*\n([^\n`]+)\n\s*```/);
            const modelId = modelIdMatch ? modelIdMatch[1].trim() : doc.name.replace('.md', '');
            
            // 提取价格
            const inputPriceMatch = content.match(/Input\s*\|\s*\$?([\d.]+)/);
            const outputPriceMatch = content.match(/Output\s*\|\s*\$?([\d.]+)/);
            
            // 提取 Context
            const contextMatch = content.match(/Context Window\s*\|\s*([\d,]+)/);
            
            if (!modelsByProvider[provider]) {
                modelsByProvider[provider] = [];
            }
            
            modelsByProvider[provider].push({
                name: doc.title || doc.name.replace('.md', ''),
                path: doc.path,
                modelId: modelId,
                inputPrice: inputPriceMatch ? inputPriceMatch[1] : '-',
                outputPrice: outputPriceMatch ? outputPriceMatch[1] : '-',
                context: contextMatch ? contextMatch[1] : '-'
            });
        } catch (e) {
            console.log('Error parsing model:', doc.name, e);
        }
    }
    
    // 按厂商排序
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
                                    <td class="price-cell">$${m.inputPrice}/M</td>
                                    <td class="price-cell">$${m.outputPrice}/M</td>
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

// 清理 MDX 组件，转换为纯 Markdown
function cleanMdx(markdown) {
    let cleaned = markdown;
    
    // 移除 export 语句（React 组件定义）
    cleaned = cleaned.replace(/^export\s+const\s+\w+\s*=[\s\S]*?^};?\s*$/gm, '');
    
    // 移除 JSX 组件调用 <ComponentName ... />
    cleaned = cleaned.replace(/<(ModelsCatalog|[A-Z]\w+)\s*\/>/g, '');
    
    // 转换 <Info>, <Warning>, <Tip>, <Note> 为引用块
    cleaned = cleaned.replace(/<(Info|Warning|Tip|Note)>\s*([\s\S]*?)\s*<\/\1>/gi, (_, tag, content) => {
        const prefix = tag.toLowerCase() === 'warning' ? '**Warning**' : 
                       tag.toLowerCase() === 'tip' ? '**Tip**' :
                       tag.toLowerCase() === 'note' ? '**Note**' : '**Info**';
        return `> ${prefix}: ${content.trim().replace(/\n/g, '\n> ')}`;
    });
    
    // 转换 <Card> 为列表项
    cleaned = cleaned.replace(/<Card\s+title="([^"]+)"[^>]*>([\s\S]*?)<\/Card>/gi, (_, title, content) => {
        const cleanContent = content.replace(/<[^>]+>/g, '').trim();
        return `- **${title}**: ${cleanContent}`;
    });
    
    // 移除 <CardGroup> 包装
    cleaned = cleaned.replace(/<\/?CardGroup[^>]*>/gi, '');
    
    // 转换 <CodeGroup> 为普通代码块
    cleaned = cleaned.replace(/<\/?CodeGroup>/gi, '');
    
    // 清理代码块中的 theme={null}
    cleaned = cleaned.replace(/```(\w+)\s+theme=\{null\}/g, '```$1');
    
    // 移除空行过多
    cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n');
    
    return cleaned;
}

async function loadDocument(vendor, docPath) {
    const wrapper = document.getElementById('content-wrapper');
    
    // 解析路径：langCode/actual/path.md
    const pathParts = docPath.split('/');
    const langCode = pathParts[0];
    const actualPath = pathParts.slice(1).join('/');
    
    // 找到语言配置
    const langConfig = vendor.languages.find(l => l.code === langCode);
    if (!langConfig) {
        renderDocNotFound(vendor, docPath);
        return;
    }
    
    // 构建文件路径
    let filePath;
    if (langConfig.folder) {
        filePath = `docs/${vendor.folder}/${langConfig.folder}/${actualPath}`;
    } else {
        filePath = `docs/${vendor.folder}/${actualPath}`;
    }
    
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('Not found');
        
        let markdown = await response.text();
        
        // 保存当前文档内容用于复制和下载
        currentDocContent = markdown;
        currentDocPath = actualPath;
        
        // 清理 MDX 组件（主要针对 MegaLLM）
        markdown = cleanMdx(markdown);
        
        const html = marked.parse(markdown);
        
        // 提取标题
        const titleMatch = markdown.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : actualPath;
        
        // 获取文件名
        const filename = actualPath.split('/').pop() || 'document.md';
        
        // 语言标签
        const langTabsHtml = vendor.languages.length > 1 ? `
            <div class="lang-tabs">
                <span class="lang-tabs-label">${t('selectLanguage')}:</span>
                ${vendor.languages.map(lang => `
                    <button class="lang-tab ${lang.code === langCode ? 'active' : ''}" 
                            onclick="location.hash='${vendor.id}/${lang.code}/${actualPath}'">
                        ${lang.name}
                    </button>
                `).join('')}
            </div>
        ` : '';
        
        wrapper.innerHTML = `
            <div class="breadcrumb">
                <a href="#">${t('home')}</a>
                <span class="breadcrumb-sep">/</span>
                <a href="#${vendor.id}">${vendor.name}</a>
                <span class="breadcrumb-sep">/</span>
                <span>${title}</span>
            </div>
            
            <div class="doc-actions">
                ${langTabsHtml}
                <div class="doc-action-buttons">
                    <button class="doc-action-btn" onclick="copyDocContent()" title="${t('copyMarkdown')}">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                        </svg>
                        ${t('copyMarkdown')}
                    </button>
                    <button class="doc-action-btn" onclick="downloadCurrentDoc()" title="${t('downloadDoc')}">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                        </svg>
                        ${t('downloadDoc')}
                    </button>
                </div>
            </div>
            
            <article class="markdown-body">
                ${html}
            </article>
        `;
        
        // 代码高亮
        document.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
        
        // 添加代码复制按钮
        addCopyButtons();
        
        // 生成目录
        generateTOC();
        
    } catch (error) {
        renderDocNotFound(vendor, docPath);
    }
}

function renderDocNotFound(vendor, docPath) {
    const wrapper = document.getElementById('content-wrapper');
    wrapper.innerHTML = `
        <div class="breadcrumb">
            <a href="#">${t('home')}</a>
            <span class="breadcrumb-sep">/</span>
            <a href="#${vendor.id}">${vendor.name}</a>
        </div>
        
        <h1>${t('docNotFound')}</h1>
        <p>${t('docNotFoundDesc')}</p>
        <p><a href="#${vendor.id}">${t('backToList')}</a></p>
    `;
}

function generateTOC() {
    const tocList = document.getElementById('toc-list');
    const headings = document.querySelectorAll('.markdown-body h2, .markdown-body h3');
    
    if (headings.length === 0) {
        tocList.innerHTML = `<li class="toc-empty">${t('noToc')}</li>`;
        return;
    }
    
    tocList.innerHTML = Array.from(headings).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        const isH3 = heading.tagName === 'H3';
        return `<li class="${isH3 ? 'toc-h3' : ''}"><a href="#${id}">${heading.textContent}</a></li>`;
    }).join('');
}

// 添加代码复制按钮
function addCopyButtons() {
    document.querySelectorAll('.markdown-body pre').forEach(pre => {
        // 避免重复添加
        if (pre.parentElement.classList.contains('code-block-wrapper')) return;
        
        // 创建包装器
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        
        // 创建复制按钮
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = t('copy') || 'Copy';
        btn.onclick = async () => {
            const code = pre.querySelector('code')?.textContent || pre.textContent;
            try {
                await navigator.clipboard.writeText(code);
                btn.textContent = t('copied') || 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = t('copy') || 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                btn.textContent = 'Failed';
                setTimeout(() => {
                    btn.textContent = t('copy') || 'Copy';
                }, 2000);
            }
        };
        wrapper.appendChild(btn);
    });
}


// 爬虫脚本配置
const CRAWLER_SCRIPTS = [
    {
        vendor: 'OpenAI',
        script: 'download_openai_uc.py',
        deps: 'undetected-chromedriver, selenium, markdownify',
        docCount: 51,
        desc: { en: 'Bypass Cloudflare protection', zh: '绕过 Cloudflare 人机验证', ja: 'Cloudflare保護をバイパス' }
    },
    {
        vendor: 'Anthropic Claude',
        script: 'batch_download_docs.py',
        deps: 'requests',
        docCount: 963,
        desc: { en: 'Direct Markdown download', zh: '直接下载 Markdown', ja: '直接Markdownダウンロード' }
    },
    {
        vendor: 'Google Gemini',
        script: 'batch_download_docs.py',
        deps: 'requests',
        docCount: 67,
        desc: { en: 'Direct Markdown download', zh: '直接下载 Markdown', ja: '直接Markdownダウンロード' }
    },
    {
        vendor: 'Meta Llama',
        script: 'download_meta.py',
        deps: 'playwright, markdownify',
        docCount: 22,
        desc: { en: 'Playwright rendering', zh: 'Playwright 渲染', ja: 'Playwrightレンダリング' }
    },
    {
        vendor: 'xAI Grok',
        script: 'download_grok.py',
        deps: 'requests',
        docCount: 59,
        desc: { en: 'From llms.txt', zh: '从 llms.txt 获取', ja: 'llms.txtから取得' }
    },
    {
        vendor: 'Moonshot Kimi',
        script: 'download_moonshot.py',
        deps: 'playwright, markdownify',
        docCount: 72,
        desc: { en: 'Playwright rendering', zh: 'Playwright 渲染', ja: 'Playwrightレンダリング' }
    },
    {
        vendor: 'Zhipu BigModel',
        script: 'download_zhipu.py / download_zhipu_en.py',
        deps: 'requests / playwright, markdownify',
        docCount: 242,
        desc: { en: 'Chinese: Mintlify, English: Vue SPA', zh: '中文站: Mintlify, 英文站: Vue SPA', ja: '中国語: Mintlify, 英語: Vue SPA' }
    },
    {
        vendor: 'MiniMax',
        script: 'download_minimax.py',
        deps: 'requests',
        docCount: 84,
        desc: { en: 'Mintlify framework', zh: 'Mintlify 框架', ja: 'Mintlifyフレームワーク' }
    },
    {
        vendor: 'MegaLLM',
        script: 'download_megallm.py',
        deps: 'requests',
        docCount: 156,
        desc: { en: 'From llms.txt + models', zh: '从 llms.txt + 模型列表', ja: 'llms.txt + モデルリスト' }
    },
    {
        vendor: 'DeepSeek',
        script: 'download_deepseek.py',
        deps: 'selenium, html2text',
        docCount: 61,
        desc: { en: 'Docusaurus framework', zh: 'Docusaurus 框架', ja: 'Docusaurusフレームワーク' }
    }
];

// 渲染技术文档页面
async function renderTechDocsPage(hash) {
    const wrapper = document.getElementById('content-wrapper');
    const tocList = document.getElementById('toc-list');
    
    // 如果是查看 README
    if (hash === 'tech-docs/readme' || hash === 'tech-docs/readme-cn') {
        const isCn = hash.endsWith('-cn');
        const readmePath = isCn ? 'README_CN.md' : 'README.md';
        
        try {
            const response = await fetch(readmePath);
            if (!response.ok) throw new Error('Not found');
            
            const markdown = await response.text();
            const html = marked.parse(markdown);
            
            wrapper.innerHTML = `
                <div class="breadcrumb">
                    <a href="#">${t('home')}</a>
                    <span class="breadcrumb-sep">/</span>
                    <a href="#tech-docs">${t('techDocs')}</a>
                    <span class="breadcrumb-sep">/</span>
                    <span>README${isCn ? ' (中文)' : ''}</span>
                </div>
                
                <div class="lang-tabs">
                    <span class="lang-tabs-label">${t('selectLanguage')}:</span>
                    <button class="lang-tab ${!isCn ? 'active' : ''}" onclick="location.hash='tech-docs/readme'">English</button>
                    <button class="lang-tab ${isCn ? 'active' : ''}" onclick="location.hash='tech-docs/readme-cn'">中文</button>
                </div>
                
                <article class="markdown-body">
                    ${html}
                </article>
            `;
            
            // 代码高亮
            document.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
            
            addCopyButtons();
            generateTOC();
            return;
        } catch (e) {
            console.error('Failed to load README:', e);
        }
    }
    
    // 主技术文档页面
    // 生成爬取状态表格
    const crawlStatusHtml = CRAWLER_SCRIPTS.map(s => {
        const crawlerId = s.vendor.toLowerCase()
            .replace('anthropic claude', 'claude')
            .replace('google gemini', 'gemini')
            .replace('xai grok', 'grok')
            .replace('zhipu bigmodel (cn)', 'zhipu')
            .replace('zhipu bigmodel', 'zhipu')
            .replace('moonshot kimi', 'moonshot')
            .replace('meta llama', 'meta')
            .replace(' ', '');
        
        const status = crawlStatus[crawlerId] || {};
        const isAuto = status.auto === true;
        const lastTime = status.lastCrawlTime ? formatTimeAgo(status.lastCrawlTime) : t('neverCrawled');
        const statusIcon = status.lastCrawlTime ? (status.success ? icon('success') : icon('error')) : icon('pending');
        const typeIcon = isAuto ? icon('auto') : icon('manual');
        
        return `
            <tr>
                <td><span class="status-icon">${typeIcon}</span></td>
                <td><strong>${s.vendor}</strong></td>
                <td><span class="status-icon">${statusIcon}</span></td>
                <td>${lastTime}</td>
                <td><code class="script-name">${s.script}</code></td>
            </tr>
        `;
    }).join('');
    
    const scriptsHtml = CRAWLER_SCRIPTS.map(s => `
        <tr>
            <td><strong>${s.vendor}</strong></td>
            <td><code class="script-name">${s.script}</code></td>
            <td class="deps-cell">${s.deps}</td>
            <td class="count-cell">${s.docCount}</td>
            <td>${s.desc[currentLang] || s.desc.en}</td>
            <td>
                <a href="../${s.script}" download class="download-btn" title="${t('downloadScript')}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                </a>
            </td>
        </tr>
    `).join('');
    
    wrapper.innerHTML = `
        <div class="breadcrumb">
            <a href="#">${t('home')}</a>
            <span class="breadcrumb-sep">/</span>
            <span>${t('techDocs')}</span>
        </div>
        
        <h1>${t('techDocsTitle')}</h1>
        <p class="lead">${t('techDocsDesc')}</p>
        
        <h2 id="crawl-status">${t('crawlStatus')}</h2>
        <div class="status-legend">
            <span class="legend-item"><span class="legend-icon">${icon('auto')}</span> ${t('autoCrawl')}</span>
            <span class="legend-item"><span class="legend-icon">${icon('manual')}</span> ${t('manualCrawl')}</span>
            <span class="legend-item"><span class="legend-icon">${icon('success')}</span> ${t('crawlSuccess')}</span>
            <span class="legend-item"><span class="legend-icon">${icon('error')}</span> ${t('crawlFailed')}</span>
            <span class="legend-item"><span class="legend-icon">${icon('pending')}</span> ${t('neverCrawled')}</span>
        </div>
        <div class="scripts-table-wrapper">
            <table class="scripts-table status-table">
                <thead>
                    <tr>
                        <th>${t('crawlType')}</th>
                        <th>Vendor</th>
                        <th>${t('status')}</th>
                        <th>${t('lastCrawl')}</th>
                        <th>Script</th>
                    </tr>
                </thead>
                <tbody>
                    ${crawlStatusHtml}
                </tbody>
            </table>
        </div>
        <p class="crawl-hint">${t('crawlHint')}</p>
        
        <h2 id="project-docs">${t('projectDocs')}</h2>
        <div class="readme-cards">
            <div class="readme-card" onclick="location.hash='tech-docs/readme'">
                <div class="readme-card-icon">${icon('doc')}</div>
                <div class="readme-card-content">
                    <div class="readme-card-title">README.md</div>
                    <div class="readme-card-desc">English documentation</div>
                </div>
                <div class="readme-card-action">→</div>
            </div>
            <div class="readme-card" onclick="location.hash='tech-docs/readme-cn'">
                <div class="readme-card-icon">${icon('doc')}</div>
                <div class="readme-card-content">
                    <div class="readme-card-title">README_CN.md</div>
                    <div class="readme-card-desc">中文文档</div>
                </div>
                <div class="readme-card-action">→</div>
            </div>
        </div>
        
        <h2 id="crawler-scripts">${t('crawlerScripts')}</h2>
        <div class="scripts-table-wrapper">
            <table class="scripts-table">
                <thead>
                    <tr>
                        <th>Vendor</th>
                        <th>Script</th>
                        <th>${t('dependencies')}</th>
                        <th>${t('docCount')}</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${scriptsHtml}
                </tbody>
            </table>
        </div>
        
        <h2 id="auto-crawler">${t('autoCrawler')}</h2>
        <div class="markdown-body">
            <pre><code class="language-bash"># ${t('autoCrawlerDesc')}

# List all crawlers
python3 auto_crawler.py --list

# Show crawl status
python3 auto_crawler.py --status

# Run auto crawlers (no browser needed)
python3 auto_crawler.py

# Force re-crawl
python3 auto_crawler.py --force

# Crawl specific vendor
python3 auto_crawler.py --vendor grok

# Run all crawlers (including browser-based)
python3 auto_crawler.py --all</code></pre>
        </div>
        
        <h2 id="quick-start">Quick Start</h2>
        <div class="markdown-body">
            <pre><code class="language-bash"># Install basic dependencies
pip install requests

# For Playwright-based scripts
pip install playwright markdownify
playwright install chromium

# For OpenAI (Cloudflare bypass)
pip install undetected-chromedriver selenium markdownify

# For DeepSeek
pip install selenium html2text

# Run a download script
python3 download_grok.py</code></pre>
        </div>
    `;
    
    // 代码高亮
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });
    
    addCopyButtons();
    
    // 生成 TOC
    tocList.innerHTML = `
        <li><a href="#crawl-status">${t('crawlStatus')}</a></li>
        <li><a href="#project-docs">${t('projectDocs')}</a></li>
        <li><a href="#crawler-scripts">${t('crawlerScripts')}</a></li>
        <li><a href="#auto-crawler">${t('autoCrawler')}</a></li>
        <li><a href="#quick-start">Quick Start</a></li>
    `;
}


// ============ 事件日志页面 ============

// 事件类型图标映射 - 使用 icon() 函数
function getEventIcon(type) {
    return icon(type) || icon('info');
}

// 事件类型颜色映射
const EVENT_COLORS = {
    'info': 'var(--text-secondary)',
    'success': '#10a37f',
    'warning': '#f59e0b',
    'error': '#ef4444',
    'start': '#3b82f6',
    'complete': '#8b5cf6',
    'skip': '#6b7280',
};

// 格式化时间戳
function formatEventTime(isoTime) {
    const date = new Date(isoTime);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (diffDays === 0) {
        return `${t('today')} ${timeStr}`;
    } else if (diffDays === 1) {
        return `${t('yesterday')} ${timeStr}`;
    } else {
        return `${dateStr} ${timeStr}`;
    }
}

// 渲染事件日志页面
async function renderEventsPage() {
    const wrapper = document.getElementById('content-wrapper');
    const tocList = document.getElementById('toc-list');
    
    // 重新加载事件数据
    try {
        const response = await fetch('crawl-events.json?' + Date.now());
        crawlEvents = await response.json();
    } catch (e) {
        crawlEvents = [];
    }
    
    // 按时间倒序排列
    const sortedEvents = [...crawlEvents].reverse();
    
    // 统计信息
    const stats = {
        total: sortedEvents.length,
        success: sortedEvents.filter(e => e.type === 'success').length,
        error: sortedEvents.filter(e => e.type === 'error').length,
        today: sortedEvents.filter(e => {
            const eventDate = new Date(e.timestamp).toDateString();
            return eventDate === new Date().toDateString();
        }).length,
    };
    
    // 按厂商分组统计
    const vendorStats = {};
    sortedEvents.forEach(e => {
        if (e.vendorId && e.vendorId !== 'system') {
            if (!vendorStats[e.vendorName]) {
                vendorStats[e.vendorName] = { success: 0, error: 0, total: 0 };
            }
            vendorStats[e.vendorName].total++;
            if (e.type === 'success') vendorStats[e.vendorName].success++;
            if (e.type === 'error') vendorStats[e.vendorName].error++;
        }
    });
    
    // 生成事件列表 HTML
    const eventsHtml = sortedEvents.length === 0 
        ? `<div class="no-events">${t('noEvents')}</div>`
        : sortedEvents.slice(0, 100).map(event => {
            const eventIcon = getEventIcon(event.type);
            const color = EVENT_COLORS[event.type] || 'inherit';
            const time = formatEventTime(event.timestamp);
            const hasDetails = event.details && Object.keys(event.details).length > 0;
            
            let detailsHtml = '';
            if (hasDetails) {
                const detailItems = Object.entries(event.details).map(([key, value]) => {
                    let displayValue = value;
                    if (typeof value === 'object') {
                        displayValue = JSON.stringify(value, null, 2);
                    } else if (typeof value === 'string' && value.length > 200) {
                        displayValue = value.substring(0, 200) + '...';
                    }
                    return `<div class="event-detail-item"><span class="detail-key">${key}:</span> <span class="detail-value">${displayValue}</span></div>`;
                }).join('');
                
                detailsHtml = `
                    <div class="event-details collapsed" id="details-${event.id}">
                        <div class="event-details-content">${detailItems}</div>
                    </div>
                `;
            }
            
            return `
                <div class="event-item event-${event.type}" data-event-id="${event.id}">
                    <div class="event-header" ${hasDetails ? `onclick="toggleEventDetails(${event.id})"` : ''}>
                        <span class="event-icon" style="color: ${color}">${eventIcon}</span>
                        <span class="event-time">${time}</span>
                        <span class="event-vendor" style="color: ${color}">[${event.vendorName}]</span>
                        <span class="event-message">${event.message}</span>
                        ${hasDetails ? '<span class="event-expand">▶</span>' : ''}
                    </div>
                    ${detailsHtml}
                </div>
            `;
        }).join('');
    
    // 生成厂商统计 HTML
    const vendorStatsHtml = Object.entries(vendorStats)
        .sort((a, b) => b[1].total - a[1].total)
        .map(([name, stat]) => `
            <div class="vendor-stat-item">
                <span class="vendor-stat-name">${name}</span>
                <span class="vendor-stat-counts">
                    <span class="stat-success">${icon('success')} ${stat.success}</span>
                    <span class="stat-error">${icon('error')} ${stat.error}</span>
                </span>
            </div>
        `).join('');
    
    wrapper.innerHTML = `
        <div class="breadcrumb">
            <a href="#">${t('home')}</a>
            <span class="breadcrumb-sep">/</span>
            <span>${t('events')}</span>
        </div>
        
        <h1>${t('eventsTitle')}</h1>
        <p class="lead">${t('eventsDesc')}</p>
        
        <h2 id="stats">${t('eventStats')}</h2>
        <div class="event-stats-grid">
            <div class="event-stat-card">
                <div class="event-stat-value">${stats.total}</div>
                <div class="event-stat-label">${t('totalEvents')}</div>
            </div>
            <div class="event-stat-card success">
                <div class="event-stat-value">${stats.success}</div>
                <div class="event-stat-label">${t('successEvents')}</div>
            </div>
            <div class="event-stat-card error">
                <div class="event-stat-value">${stats.error}</div>
                <div class="event-stat-label">${t('errorEvents')}</div>
            </div>
            <div class="event-stat-card">
                <div class="event-stat-value">${stats.today}</div>
                <div class="event-stat-label">${t('todayEvents')}</div>
            </div>
        </div>
        
        <h2 id="vendor-stats">${t('vendorStats')}</h2>
        <div class="vendor-stats-list">
            ${vendorStatsHtml || `<div class="no-stats">${t('noStats')}</div>`}
        </div>
        
        <h2 id="event-log">${t('eventLog')}</h2>
        <div class="event-filters">
            <button class="filter-btn active" data-filter="all">${t('all')}</button>
            <button class="filter-btn" data-filter="success">${icon('success')} ${t('success')}</button>
            <button class="filter-btn" data-filter="error">${icon('error')} ${t('errors')}</button>
            <button class="filter-btn" data-filter="start">${icon('start')} ${t('starts')}</button>
            <button class="filter-btn" data-filter="system">${icon('system')} ${t('system')}</button>
        </div>
        <div class="events-list" id="events-list">
            ${eventsHtml}
        </div>
        
        <div class="events-footer">
            <span class="events-count">${t('showing')} ${Math.min(100, sortedEvents.length)} / ${sortedEvents.length} ${t('events').toLowerCase()}</span>
            <button class="refresh-btn" onclick="renderEventsPage()">
                <svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                ${t('refresh')}
            </button>
        </div>
    `;
    
    // 绑定过滤器事件
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterEvents(btn.dataset.filter);
        });
    });
    
    // 生成 TOC
    tocList.innerHTML = `
        <li><a href="#stats">${t('eventStats')}</a></li>
        <li><a href="#vendor-stats">${t('vendorStats')}</a></li>
        <li><a href="#event-log">${t('eventLog')}</a></li>
    `;
}

// 切换事件详情展开/收起
function toggleEventDetails(eventId) {
    const details = document.getElementById(`details-${eventId}`);
    const eventItem = details.closest('.event-item');
    const expandIcon = eventItem.querySelector('.event-expand');
    
    if (details.classList.contains('collapsed')) {
        details.classList.remove('collapsed');
        expandIcon.textContent = '▼';
    } else {
        details.classList.add('collapsed');
        expandIcon.textContent = '▶';
    }
}

// 过滤事件
function filterEvents(filter) {
    const eventItems = document.querySelectorAll('.event-item');
    
    eventItems.forEach(item => {
        if (filter === 'all') {
            item.style.display = '';
        } else if (filter === 'system') {
            const vendor = item.querySelector('.event-vendor').textContent;
            item.style.display = vendor.includes('System') ? '' : 'none';
        } else {
            item.style.display = item.classList.contains(`event-${filter}`) ? '' : 'none';
        }
    });
}


// ============ MCP 配置页面 ============

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

// MCP 客户端配置 - 使用 SVG 图标
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
    
    // 计算文档统计
    let totalDocs = 0;
    VENDORS.forEach(vendor => {
        totalDocs += docsIndex[vendor.id]?.totalDocs || 0;
    });
    
    // 工具表格
    const toolsHtml = MCP_TOOLS.map(tool => `
        <tr>
            <td><code class="tool-name">${tool.name}</code></td>
            <td>${tool.desc[currentLang] || tool.desc.en}</td>
            <td><code>${tool.params}</code></td>
        </tr>
    `).join('');
    
    // 客户端列表
    const clientsHtml = MCP_CLIENTS.map(client => `
        <div class="mcp-client-card">
            <span class="client-icon">${client.icon}</span>
            <div class="client-info">
                <div class="client-name">${client.name}</div>
                <code class="client-config">${client.config}</code>
            </div>
        </div>
    `).join('');
    
    // 示例代码
    const examplesHtml = MCP_TOOLS.map(tool => `# ${tool.name}
${tool.example}`).join('\n\n');
    
    wrapper.innerHTML = `
        <div class="breadcrumb">
            <a href="#">${t('home')}</a>
            <span class="breadcrumb-sep">/</span>
            <span>${t('mcpSetup')}</span>
        </div>
        
        <h1>${t('mcpTitle')}</h1>
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
                <div class="markdown-body">
                    <pre><code class="language-json">{
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
                <div class="markdown-body">
                    <pre><code class="language-json">{
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
                <div class="markdown-body">
                    <pre><code class="language-json">{
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
                <div class="markdown-body">
                    <pre><code class="language-json">{
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
    
    // 代码高亮
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });
    
    addCopyButtons();
    
    // 配置标签切换
    document.querySelectorAll('.config-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const config = tab.dataset.config;
            
            // 更新标签状态
            document.querySelectorAll('.config-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 更新面板显示
            document.querySelectorAll('.config-panel').forEach(panel => {
                panel.classList.toggle('active', panel.dataset.config === config);
            });
        });
    });
    
    // 生成 TOC
    tocList.innerHTML = `
        <li><a href="#what-is-mcp">${t('mcpWhatIs')}</a></li>
        <li><a href="#installation">${t('mcpInstall')}</a></li>
        <li><a href="#configuration">${t('mcpConfig')}</a></li>
        <li><a href="#tools">${t('mcpTools')}</a></li>
        <li><a href="#examples">${t('mcpExamples')}</a></li>
        <li><a href="#resources">${t('mcpResources')}</a></li>
        <li><a href="#clients">${t('mcpClients')}</a></li>
        <li><a href="#troubleshooting">${t('mcpTroubleshooting')}</a></li>
    `;
}


// ============ 搜索功能 ============

// 搜索状态
let searchResults = [];
let selectedResultIndex = -1;

// 初始化搜索
function initSearch() {
    // 创建底部悬浮搜索框
    const searchHtml = `
        <div class="floating-search">
            <div id="search-results-container" class="search-results-container"></div>
            <div class="search-input-wrapper">
                <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input type="text" id="floating-search-input" class="floating-search-input" placeholder="${t('searchPlaceholder')}" autocomplete="off">
                <div class="search-shortcut-hint">
                    <kbd>⌘</kbd><kbd>K</kbd>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', searchHtml);
    
    // 绑定搜索输入事件
    const searchInput = document.getElementById('floating-search-input');
    searchInput.addEventListener('input', debounce(handleSearch, 150));
    searchInput.addEventListener('keydown', handleSearchKeydown);
    searchInput.addEventListener('focus', () => {
        if (searchResults.length > 0) {
            document.getElementById('search-results-container').classList.add('show');
        }
    });
    
    // 点击外部关闭搜索结果
    document.addEventListener('click', (e) => {
        const floatingSearch = document.querySelector('.floating-search');
        if (floatingSearch && !floatingSearch.contains(e.target)) {
            closeSearchResults();
        }
    });
    
    // 全局键盘监听 - 任意位置打字自动聚焦搜索框
    document.addEventListener('keydown', (e) => {
        // 如果已经在输入框中，不处理
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }
        
        // 忽略功能键和组合键
        if (e.metaKey || e.ctrlKey || e.altKey) {
            return;
        }
        
        // 只处理可打印字符
        if (e.key.length === 1 && /[a-zA-Z0-9\u4e00-\u9fa5]/.test(e.key)) {
            searchInput.focus();
            // 不阻止默认行为，让字符输入到搜索框
        }
    });
}

// 防抖函数
function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// 聚焦搜索框
function openSearch() {
    const input = document.getElementById('floating-search-input');
    if (input) {
        input.focus();
        input.select();
    }
}

// 关闭搜索结果
function closeSearchResults() {
    const container = document.getElementById('search-results-container');
    if (container) {
        container.classList.remove('show');
    }
    selectedResultIndex = -1;
}

// 处理搜索
async function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();
    const container = document.getElementById('search-results-container');
    
    if (!query) {
        container.classList.remove('show');
        searchResults = [];
        selectedResultIndex = -1;
        return;
    }
    
    // 搜索所有文档
    searchResults = [];
    
    for (const vendor of VENDORS) {
        const vendorDocs = docsIndex[vendor.id];
        if (!vendorDocs || !vendorDocs.languages) continue;
        
        for (const [langCode, docs] of Object.entries(vendorDocs.languages)) {
            for (const doc of docs) {
                // 搜索标题和路径
                const title = (doc.title || doc.name || '').toLowerCase();
                const path = (doc.path || '').toLowerCase();
                
                if (title.includes(query) || path.includes(query)) {
                    searchResults.push({
                        vendor,
                        langCode,
                        doc
                    });
                }
            }
        }
    }
    
    // 限制结果数量
    searchResults = searchResults.slice(0, 20);
    
    // 渲染结果
    renderSearchResults(query);
    selectedResultIndex = -1;
}

// 渲染搜索结果
function renderSearchResults(query) {
    const container = document.getElementById('search-results-container');
    
    if (searchResults.length === 0) {
        container.innerHTML = `<div class="search-no-results">${t('searchNoResults')}</div>`;
        container.classList.add('show');
        return;
    }
    
    container.innerHTML = searchResults.map((result, index) => {
        const { vendor, langCode, doc } = result;
        const title = doc.title || doc.name || doc.path;
        
        // 高亮匹配文本
        const highlightedTitle = highlightMatch(title, query);
        
        return `
            <a href="#${vendor.id}/${langCode}/${doc.path}" 
               class="search-result-item" 
               data-index="${index}"
               onclick="closeSearchResults()">
                <div class="search-result-vendor">
                    <img src="${vendor.logo}" alt="${vendor.name}" onerror="this.style.display='none'">
                    <span>${vendor.name}</span>
                    <span>·</span>
                    <span>${langCode}</span>
                </div>
                <div class="search-result-title">${highlightedTitle}</div>
                <div class="search-result-path">${doc.path}</div>
            </a>
        `;
    }).join('');
    
    container.classList.add('show');
}

// 高亮匹配文本
function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// 转义正则特殊字符
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 处理搜索键盘事件
function handleSearchKeydown(e) {
    const results = document.querySelectorAll('.search-result-item');
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedResultIndex = Math.min(selectedResultIndex + 1, results.length - 1);
        updateSelectedResult(results);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedResultIndex = Math.max(selectedResultIndex - 1, 0);
        updateSelectedResult(results);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedResultIndex >= 0 && results[selectedResultIndex]) {
            results[selectedResultIndex].click();
        } else if (results.length > 0) {
            results[0].click();
        }
    } else if (e.key === 'Escape') {
        closeSearchResults();
        e.target.blur();
    }
}

// 更新选中的搜索结果
function updateSelectedResult(results) {
    results.forEach((item, index) => {
        item.classList.toggle('selected', index === selectedResultIndex);
    });
    
    // 滚动到可见区域
    if (results[selectedResultIndex]) {
        results[selectedResultIndex].scrollIntoView({ block: 'nearest' });
    }
}
