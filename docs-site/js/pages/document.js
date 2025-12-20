// ============ 文档页面渲染 ============

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
        
        // 清理 MDX 组件
        markdown = cleanMdx(markdown);
        
        const html = marked.parse(markdown);
        
        // 提取标题
        const titleMatch = markdown.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : actualPath;
        
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
        
        addCopyButtons();
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
        return `<li class="${isH3 ? 'toc-h3' : ''}"><a href="javascript:void(0)" onclick="scrollToSection('${id}')">${heading.textContent}</a></li>`;
    }).join('');
}

// 添加代码复制按钮
function addCopyButtons() {
    document.querySelectorAll('.markdown-body pre').forEach(pre => {
        if (pre.parentElement.classList.contains('code-block-wrapper')) return;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        
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
