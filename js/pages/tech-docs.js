// ============ 技术文档页面渲染 ============

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
                <td><a href="#script/${s.script}" class="script-link"><code class="script-name">${s.script}</code></a></td>
            </tr>
        `;
    }).join('');
    
    const scriptsHtml = CRAWLER_SCRIPTS.map(s => `
        <tr>
            <td><strong>${s.vendor}</strong></td>
            <td><a href="#script/${s.script}" class="script-link"><code class="script-name">${s.script}</code></a></td>
            <td class="deps-cell">${s.deps}</td>
            <td class="count-cell">${s.docCount}</td>
            <td>${s.desc[currentLang] || s.desc.en}</td>
            <td>
                <a href="scripts/${s.script}" download class="download-btn" title="${t('downloadScript')}">
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
        
        <h2 id="core-scripts">${t('coreScripts')}</h2>
        <p class="section-desc">${t('coreScriptsDesc')}</p>
        <div class="scripts-table-wrapper">
            <table class="scripts-table">
                <thead>
                    <tr>
                        <th>Script</th>
                        <th>${t('dependencies')}</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${CORE_SCRIPTS.map(s => `
                        <tr>
                            <td><a href="#script/${s.script}" class="script-link"><code class="script-name">${s.script}</code></a></td>
                            <td class="deps-cell">${s.deps}</td>
                            <td>${s.desc[currentLang] || s.desc.en}</td>
                            <td>
                                <a href="scripts/${s.script}" download class="download-btn" title="${t('downloadScript')}">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                    </svg>
                                </a>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <h2 id="explore-scripts">${t('exploreScripts')}</h2>
        <p class="section-desc">${t('exploreScriptsDesc')}</p>
        <div class="scripts-table-wrapper">
            <table class="scripts-table">
                <thead>
                    <tr>
                        <th>${t('target')}</th>
                        <th>Script</th>
                        <th>${t('dependencies')}</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${EXPLORE_SCRIPTS.map(s => `
                        <tr>
                            <td><strong>${s.target}</strong></td>
                            <td><a href="#script/${s.script}" class="script-link"><code class="script-name">${s.script}</code></a></td>
                            <td class="deps-cell">${s.deps}</td>
                            <td>${s.desc[currentLang] || s.desc.en}</td>
                            <td>
                                <a href="scripts/${s.script}" download class="download-btn" title="${t('downloadScript')}">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                    </svg>
                                </a>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <h2 id="test-scripts">${t('testScripts')}</h2>
        <p class="section-desc">${t('testScriptsDesc')}</p>
        <div class="scripts-table-wrapper">
            <table class="scripts-table">
                <thead>
                    <tr>
                        <th>${t('target')}</th>
                        <th>Script</th>
                        <th>${t('dependencies')}</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${TEST_SCRIPTS.map(s => `
                        <tr>
                            <td><strong>${s.target}</strong></td>
                            <td><a href="#script/${s.script}" class="script-link"><code class="script-name">${s.script}</code></a></td>
                            <td class="deps-cell">${s.deps}</td>
                            <td>${s.desc[currentLang] || s.desc.en}</td>
                            <td>
                                <a href="scripts/${s.script}" download class="download-btn" title="${t('downloadScript')}">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                    </svg>
                                </a>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <h2 id="util-scripts">${t('utilScripts')}</h2>
        <p class="section-desc">${t('utilScriptsDesc')}</p>
        <div class="scripts-table-wrapper">
            <table class="scripts-table">
                <thead>
                    <tr>
                        <th>${t('target')}</th>
                        <th>Script</th>
                        <th>${t('dependencies')}</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${UTIL_SCRIPTS.map(s => `
                        <tr>
                            <td><strong>${s.target}</strong></td>
                            <td><a href="#script/${s.script}" class="script-link"><code class="script-name">${s.script}</code></a></td>
                            <td class="deps-cell">${s.deps}</td>
                            <td>${s.desc[currentLang] || s.desc.en}</td>
                            <td>
                                <a href="scripts/${s.script}" download class="download-btn" title="${t('downloadScript')}">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                    </svg>
                                </a>
                            </td>
                        </tr>
                    `).join('')}
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
    
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });
    
    addCopyButtons();
    
    tocList.innerHTML = `
        <li><a href="javascript:void(0)" onclick="scrollToSection('crawl-status')">${t('crawlStatus')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('project-docs')">${t('projectDocs')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('crawler-scripts')">${t('crawlerScripts')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('core-scripts')">${t('coreScripts')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('explore-scripts')">${t('exploreScripts')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('test-scripts')">${t('testScripts')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('util-scripts')">${t('utilScripts')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('auto-crawler')">${t('autoCrawler')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('quick-start')">Quick Start</a></li>
    `;
}
