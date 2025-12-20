// ============ 主应用入口 ============

// 全局状态
let docsIndex = {};
let crawlStatus = {};
let crawlEvents = [];
let currentVendor = null;
let currentDocLang = null;
let currentDocContent = '';
let currentDocPath = '';

// ============ 初始化 ============

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

// ============ 主题切换 ============

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(theme);
    
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
}

// ============ 侧边栏 ============

function renderSidebar() {
    const vendorList = document.getElementById('vendor-list');
    vendorList.innerHTML = VENDORS.map(vendor => {
        const docCount = docsIndex[vendor.id]?.totalDocs || 0;
        const status = getVendorCrawlStatus(vendor.id);
        
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

// ============ 路由处理 ============

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
    
    // 脚本详情页面
    if (hash.startsWith('script/')) {
        const scriptPath = hash.slice(7);
        renderScriptDetailPage(scriptPath);
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
    
    // 设置页面
    if (hash === 'settings') {
        renderSettingsPage();
        updateActiveNav('settings');
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

// 关闭搜索（兼容旧代码）
function closeSearch() {
    closeSearchResults();
}
