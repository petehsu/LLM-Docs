// ============ 搜索功能 ============

// 搜索状态
let searchResults = [];
let selectedResultIndex = -1;

// 初始化搜索
function initSearch() {
    const searchHtml = `
        <div class="floating-search">
            <div class="search-input-wrapper">
                <div id="search-results-container" class="search-results-container"></div>
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
    
    const searchInput = document.getElementById('floating-search-input');
    searchInput.addEventListener('input', debounce(handleSearch, 150));
    searchInput.addEventListener('keydown', handleSearchKeydown);
    searchInput.addEventListener('focus', () => {
        if (searchResults.length > 0) {
            document.getElementById('search-results-container').classList.add('show');
        }
    });
    
    document.addEventListener('click', (e) => {
        const floatingSearch = document.querySelector('.floating-search');
        if (floatingSearch && !floatingSearch.contains(e.target)) {
            closeSearchResults();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }
        
        if (e.metaKey || e.ctrlKey || e.altKey) {
            return;
        }
        
        if (e.key.length === 1 && /[a-zA-Z0-9\u4e00-\u9fa5]/.test(e.key)) {
            searchInput.focus();
        }
    });
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
    // 如果在 Agent 模式下，不执行搜索
    if (typeof agentMode !== 'undefined' && agentMode) {
        return;
    }
    
    const query = e.target.value.trim().toLowerCase();
    const container = document.getElementById('search-results-container');
    
    if (!query) {
        container.classList.remove('show');
        searchResults = [];
        selectedResultIndex = -1;
        return;
    }
    
    searchResults = [];
    
    for (const vendor of VENDORS) {
        const vendorDocs = docsIndex[vendor.id];
        if (!vendorDocs || !vendorDocs.languages) continue;
        
        for (const [langCode, docs] of Object.entries(vendorDocs.languages)) {
            for (const doc of docs) {
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
    
    searchResults = searchResults.slice(0, 20);
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
    
    if (results[selectedResultIndex]) {
        results[selectedResultIndex].scrollIntoView({ block: 'nearest' });
    }
}
