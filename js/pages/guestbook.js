// ============ 留言板页面渲染 ============

// 渲染留言板页面
async function renderGuestbookPage() {
    const wrapper = document.getElementById('content-wrapper');
    const tocList = document.getElementById('toc-list');
    
    wrapper.innerHTML = `
        <div class="breadcrumb">
            <a href="#">${t('home')}</a>
            <span class="breadcrumb-sep">/</span>
            <span>${t('guestbook')}</span>
        </div>
        
        <h1>${t('guestbookTitle')}</h1>
        <p class="lead">${t('guestbookDesc')}</p>
        
        <div class="guestbook-form">
            <div class="form-row">
                <input type="text" id="comment-nickname" class="form-input" 
                       placeholder="${t('nicknamePlaceholder')}" maxlength="20">
            </div>
            <div class="form-row">
                <textarea id="comment-content" class="form-textarea" 
                          placeholder="${t('messagePlaceholder')}" maxlength="500" rows="3"></textarea>
            </div>
            <div class="form-row form-actions">
                <span class="char-count"><span id="char-count">0</span>/500</span>
                <button class="submit-btn" id="submit-comment" onclick="submitComment()">
                    ${t('submit')}
                </button>
            </div>
        </div>
        
        <h2 id="messages">${t('recentMessages')}</h2>
        <div class="comments-list" id="comments-list">
            <div class="loading-comments">${t('loading')}...</div>
        </div>
    `;
    
    // 字数统计
    const textarea = document.getElementById('comment-content');
    const charCount = document.getElementById('char-count');
    if (textarea && charCount) {
        textarea.addEventListener('input', () => {
            charCount.textContent = textarea.value.length;
        });
    }
    
    // 加载留言
    loadComments();
    
    // 监听实时留言
    if (typeof watchComments === 'function') {
        watchComments(renderComments);
    }
    
    tocList.innerHTML = `
        <li><a href="javascript:void(0)" onclick="scrollToSection('messages')">${t('recentMessages')}</a></li>
    `;
}

// 提交留言
async function submitComment() {
    const nicknameInput = document.getElementById('comment-nickname');
    const contentInput = document.getElementById('comment-content');
    const submitBtn = document.getElementById('submit-comment');
    
    const nickname = nicknameInput?.value?.trim() || '';
    const content = contentInput?.value?.trim() || '';
    
    if (!content) {
        showToast(t('emptyMessage'));
        return;
    }
    
    // 禁用按钮
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = t('submitting');
    }
    
    try {
        const comment = await postComment(content, nickname);
        
        if (comment) {
            // 清空输入
            if (contentInput) contentInput.value = '';
            if (nicknameInput) nicknameInput.value = '';
            document.getElementById('char-count').textContent = '0';
            
            showToast(t('commentPosted'));
        } else {
            showToast(t('commentFailed'));
        }
    } catch (error) {
        console.error('Submit comment error:', error);
        showToast(t('commentFailed'));
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = t('submit');
        }
    }
}

// 加载留言
async function loadComments() {
    if (typeof getComments !== 'function') {
        renderComments([]);
        return;
    }
    
    try {
        const comments = await getComments(50);
        renderComments(comments);
    } catch (error) {
        console.error('Load comments error:', error);
        renderComments([]);
    }
}

// 渲染留言列表
function renderComments(comments) {
    const container = document.getElementById('comments-list');
    if (!container) return;
    
    if (!comments || comments.length === 0) {
        container.innerHTML = `<div class="no-comments">${t('noComments')}</div>`;
        return;
    }
    
    container.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-avatar" style="background: ${getAvatarColor(comment.nickname)}">${getAvatarLetter(comment.nickname)}</span>
                <span class="comment-nickname">${escapeHtml(comment.nickname)}</span>
                <span class="comment-time">${formatCommentTime(comment.timestamp)}</span>
            </div>
            <div class="comment-content">${escapeHtml(comment.content)}</div>
        </div>
    `).join('');
}

// 获取头像字母
function getAvatarLetter(nickname) {
    if (!nickname) return 'A';
    return nickname.charAt(0).toUpperCase();
}

// 获取头像颜色
function getAvatarColor(nickname) {
    const colors = ['#10a37f', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];
    const hash = (nickname || 'A').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}

// HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
