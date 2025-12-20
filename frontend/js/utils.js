// ============ 工具函数 ============

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

// HTML 转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 转义正则特殊字符
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 滚动到指定区域（不改变 hash）
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// 滚动到指定文件夹
function scrollToFolder(folderId) {
    const element = document.getElementById(folderId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// 清理 MDX 组件，转换为纯 Markdown
function cleanMdx(markdown) {
    let cleaned = markdown;
    
    // 移除 JSX 组件标签
    cleaned = cleaned.replace(/<DocsSearchBar\s*\/>/g, '');
    cleaned = cleaned.replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, '');
    cleaned = cleaned.replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, '');
    
    // 移除 import 语句
    cleaned = cleaned.replace(/^import\s+.*$/gm, '');
    
    // 移除 export 语句
    cleaned = cleaned.replace(/^export\s+.*$/gm, '');
    
    // 移除 frontmatter
    cleaned = cleaned.replace(/^---[\s\S]*?---\n*/m, '');
    
    // 清理多余空行
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    return cleaned.trim();
}

// 获取厂商描述
function getVendorDesc(vendor) {
    const descs = {
        'openai': { en: 'GPT-4, GPT-4o, Assistants API', zh: 'GPT-4, GPT-4o, Assistants API', ja: 'GPT-4, GPT-4o, Assistants API' },
        'anthropic': { en: 'Claude 3.5, Claude 4, Multi-language', zh: 'Claude 3.5, Claude 4, 多语言支持', ja: 'Claude 3.5, Claude 4, 多言語対応' },
        'google': { en: 'Gemini 2.0, Gemini 1.5', zh: 'Gemini 2.0, Gemini 1.5', ja: 'Gemini 2.0, Gemini 1.5' },
        'meta': { en: 'Llama 3.3, Llama 4', zh: 'Llama 3.3, Llama 4', ja: 'Llama 3.3, Llama 4' },
        'xai': { en: 'Grok-2, Grok-3', zh: 'Grok-2, Grok-3', ja: 'Grok-2, Grok-3' },
        'moonshot': { en: 'Kimi, Moonshot API', zh: 'Kimi, Moonshot API', ja: 'Kimi, Moonshot API' },
        'zhipu': { en: 'GLM-4, ChatGLM', zh: 'GLM-4, ChatGLM', ja: 'GLM-4, ChatGLM' },
        'minimax': { en: 'abab6.5, MiniMax API', zh: 'abab6.5, MiniMax API', ja: 'abab6.5, MiniMax API' },
        'megallm': { en: '70+ LLMs, Unified API', zh: '70+ 大模型, 统一 API', ja: '70+ LLM, 統一API' },
        'deepseek': { en: 'DeepSeek-V3, DeepSeek-R1', zh: 'DeepSeek-V3, DeepSeek-R1', ja: 'DeepSeek-V3, DeepSeek-R1' },
    };
    return descs[vendor.id]?.[currentLang] || descs[vendor.id]?.en || '';
}

// 获取厂商的爬取状态
function getVendorCrawlStatus(vendorId) {
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
