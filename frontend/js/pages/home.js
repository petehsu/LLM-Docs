// ============ 首页渲染 ============

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
