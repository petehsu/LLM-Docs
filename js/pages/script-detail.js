// ============ 脚本详情页面渲染 ============

async function renderScriptDetailPage(scriptPath) {
    const wrapper = document.getElementById('content-wrapper');
    const tocList = document.getElementById('toc-list');
    
    // 查找脚本信息
    const allScripts = getAllScripts();
    const scriptInfo = allScripts.find(s => s.path === scriptPath);
    
    if (!scriptInfo) {
        wrapper.innerHTML = `
            <div class="breadcrumb">
                <a href="#">${t('home')}</a>
                <span class="breadcrumb-sep">/</span>
                <a href="#tech-docs">${t('techDocs')}</a>
                <span class="breadcrumb-sep">/</span>
                <span>Script Not Found</span>
            </div>
            <h1>Script Not Found</h1>
            <p>The requested script "${scriptPath}" was not found.</p>
            <p><a href="#tech-docs">${t('backToList')}</a></p>
        `;
        tocList.innerHTML = '';
        return;
    }
    
    // 加载脚本源代码
    let sourceCode = '';
    let loadError = null;
    try {
        const response = await fetch(`scripts/${scriptPath}`);
        if (response.ok) {
            sourceCode = await response.text();
        } else {
            loadError = `HTTP ${response.status}`;
        }
    } catch (e) {
        loadError = e.message;
    }
    
    const scriptName = scriptPath.split('/').pop();
    const categoryName = scriptInfo.categoryName[currentLang] || scriptInfo.categoryName.en;
    const description = scriptInfo.desc[currentLang] || scriptInfo.desc.en;
    
    // 提取脚本的 docstring 作为详细说明
    let docstring = '';
    const docstringMatch = sourceCode.match(/^#!/m) ? 
        sourceCode.match(/"""([\s\S]*?)"""|'''([\s\S]*?)'''/m) : null;
    if (docstringMatch) {
        docstring = (docstringMatch[1] || docstringMatch[2] || '').trim();
    }
    
    // 统计代码行数
    const lineCount = sourceCode ? sourceCode.split('\n').length : 0;
    
    wrapper.innerHTML = `
        <div class="breadcrumb">
            <a href="#">${t('home')}</a>
            <span class="breadcrumb-sep">/</span>
            <a href="#tech-docs">${t('techDocs')}</a>
            <span class="breadcrumb-sep">/</span>
            <span>${scriptName}</span>
        </div>
        
        <h1>${scriptName}</h1>
        <p class="lead">${description}</p>
        
        <h2 id="info">${t('scriptInfo') || 'Script Info'}</h2>
        <div class="script-info-grid">
            <div class="script-info-item">
                <span class="info-label">${t('category') || 'Category'}</span>
                <span class="info-value">${categoryName}</span>
            </div>
            ${scriptInfo.vendor ? `
            <div class="script-info-item">
                <span class="info-label">Vendor</span>
                <span class="info-value">${scriptInfo.vendor}</span>
            </div>
            ` : ''}
            ${scriptInfo.target ? `
            <div class="script-info-item">
                <span class="info-label">${t('target')}</span>
                <span class="info-value">${scriptInfo.target}</span>
            </div>
            ` : ''}
            <div class="script-info-item">
                <span class="info-label">${t('dependencies')}</span>
                <span class="info-value"><code>${scriptInfo.deps}</code></span>
            </div>
            ${scriptInfo.docCount ? `
            <div class="script-info-item">
                <span class="info-label">${t('docCount')}</span>
                <span class="info-value">${scriptInfo.docCount}</span>
            </div>
            ` : ''}
            <div class="script-info-item">
                <span class="info-label">${t('lines') || 'Lines'}</span>
                <span class="info-value">${lineCount}</span>
            </div>
        </div>
        
        ${docstring ? `
        <h2 id="description">${t('description') || 'Description'}</h2>
        <div class="markdown-body">
            <p>${docstring.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}
        
        <h2 id="download">${t('downloadScript')}</h2>
        <div class="download-section">
            <a href="scripts/${scriptPath}" download class="download-btn-large">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                ${t('downloadScript')} ${scriptName}
            </a>
        </div>
        
        <h2 id="source">${t('sourceCode') || 'Source Code'}</h2>
        ${loadError ? `
        <div class="error-box">
            <p>Failed to load source code: ${loadError}</p>
        </div>
        ` : `
        <div class="markdown-body">
            <pre><code class="language-python">${escapeHtml(sourceCode)}</code></pre>
        </div>
        `}
    `;
    
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });
    
    addCopyButtons();
    
    tocList.innerHTML = `
        <li><a href="javascript:void(0)" onclick="scrollToSection('info')">${t('scriptInfo') || 'Script Info'}</a></li>
        ${docstring ? `<li><a href="javascript:void(0)" onclick="scrollToSection('description')">${t('description') || 'Description'}</a></li>` : ''}
        <li><a href="javascript:void(0)" onclick="scrollToSection('download')">${t('downloadScript')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('source')">${t('sourceCode') || 'Source Code'}</a></li>
    `;
}
