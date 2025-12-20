// ============ 事件日志页面渲染 ============

// 事件类型图标映射
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

// 格式化时间戳 - 精准的年月日时分秒 UTC 格式
function formatEventTime(isoTime) {
    const date = new Date(isoTime);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
}

// 计算下次爬取时间（UTC 2:00 或 14:00）
function getNextCrawlTime() {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();
    
    let nextHour;
    if (utcHour < 2) {
        nextHour = 2;
    } else if (utcHour < 14) {
        nextHour = 14;
    } else {
        nextHour = 2; // 明天 2:00
    }
    
    const next = new Date(now);
    next.setUTCHours(nextHour, 0, 0, 0);
    
    if (nextHour === 2 && utcHour >= 14) {
        next.setUTCDate(next.getUTCDate() + 1);
    }
    
    return next;
}

// 格式化倒计时
function formatCountdown(ms) {
    if (ms <= 0) return '0:00:00';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 格式化相对时间
function formatRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp * 1000;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}${t('daysAgo')}`;
    if (hours > 0) return `${hours}${t('hoursAgo')}`;
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes > 0) return `${minutes}${t('minutesAgo')}`;
    return t('justNow');
}

// 倒计时定时器
let countdownInterval = null;

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    
    const updateCountdown = () => {
        const el = document.getElementById('next-crawl-countdown');
        if (!el) return;
        
        const next = getNextCrawlTime();
        const remaining = next.getTime() - Date.now();
        el.textContent = formatCountdown(remaining);
        
        // 更新下次爬取时间显示
        const timeEl = document.getElementById('next-crawl-time');
        if (timeEl) {
            timeEl.textContent = formatEventTime(next.toISOString());
        }
    };
    
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// 渲染事件日志页面
async function renderEventsPage() {
    const wrapper = document.getElementById('content-wrapper');
    const tocList = document.getElementById('toc-list');
    
    // 加载爬取状态
    let crawlStatus = {};
    try {
        const statusRes = await fetch('crawl-status.json?' + Date.now());
        crawlStatus = await statusRes.json();
    } catch (e) {
        crawlStatus = {};
    }
    
    // 加载事件数据
    try {
        const response = await fetch('crawl-events.json?' + Date.now());
        crawlEvents = await response.json();
    } catch (e) {
        crawlEvents = [];
    }
    
    const sortedEvents = [...crawlEvents].reverse();
    
    // 统计
    const stats = {
        total: sortedEvents.length,
        success: sortedEvents.filter(e => e.type === 'success').length,
        error: sortedEvents.filter(e => e.type === 'error').length,
        today: sortedEvents.filter(e => {
            const eventDate = new Date(e.timestamp).toDateString();
            return eventDate === new Date().toDateString();
        }).length,
    };
    
    // 厂商统计
    const vendorStats = {};
    sortedEvents.forEach(e => {
        if (e.vendorId && e.vendorId !== 'system') {
            if (!vendorStats[e.vendorName]) {
                vendorStats[e.vendorName] = { success: 0, error: 0, total: 0, vendorId: e.vendorId };
            }
            vendorStats[e.vendorName].total++;
            if (e.type === 'success') vendorStats[e.vendorName].success++;
            if (e.type === 'error') vendorStats[e.vendorName].error++;
        }
    });
    
    // 计算系统健康度
    const totalVendors = Object.keys(crawlStatus).length;
    const healthyVendors = Object.values(crawlStatus).filter(s => s.success).length;
    const healthPercent = totalVendors > 0 ? Math.round((healthyVendors / totalVendors) * 100) : 0;
    
    // 找到最后一次爬取
    const lastCrawlEntry = Object.entries(crawlStatus).sort((a, b) => b[1].lastCrawl - a[1].lastCrawl)[0];
    const lastCrawlTime = lastCrawlEntry ? lastCrawlEntry[1].lastCrawlTime : null;
    
    // 厂商健康状态卡片
    const vendorHealthHtml = Object.entries(crawlStatus)
        .sort((a, b) => b[1].lastCrawl - a[1].lastCrawl)
        .map(([vendorId, status]) => {
            const statusClass = status.success ? 'healthy' : 'unhealthy';
            const statusIcon = status.success ? icon('success') : icon('error');
            const autoIcon = status.auto ? `<span class="auto-badge" title="${t('autoCrawl')}">${icon('auto')}</span>` : '';
            const relTime = formatRelativeTime(status.lastCrawl);
            
            return `
                <div class="vendor-health-card ${statusClass}">
                    <div class="vendor-health-header">
                        <span class="vendor-health-name">${vendorId}</span>
                        ${autoIcon}
                    </div>
                    <div class="vendor-health-status">
                        ${statusIcon}
                        <span class="vendor-health-time">${relTime}</span>
                    </div>
                </div>
            `;
        }).join('');
    
    // 事件列表
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
    
    // 厂商统计列表
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
        
        <h2 id="crawl-dashboard">${t('crawlDashboard')}</h2>
        <div class="crawl-dashboard">
            <div class="dashboard-card countdown-card">
                <div class="dashboard-card-icon">${icon('clock')}</div>
                <div class="dashboard-card-content">
                    <div class="dashboard-card-label">${t('nextCrawl')}</div>
                    <div class="dashboard-card-value countdown" id="next-crawl-countdown">--:--:--</div>
                    <div class="dashboard-card-sub" id="next-crawl-time">--</div>
                </div>
            </div>
            <div class="dashboard-card last-crawl-card">
                <div class="dashboard-card-icon">${icon('history')}</div>
                <div class="dashboard-card-content">
                    <div class="dashboard-card-label">${t('lastCrawl')}</div>
                    <div class="dashboard-card-value">${lastCrawlTime ? formatEventTime(lastCrawlTime) : '--'}</div>
                    <div class="dashboard-card-sub">${lastCrawlEntry ? lastCrawlEntry[0] : ''}</div>
                </div>
            </div>
            <div class="dashboard-card health-card">
                <div class="dashboard-card-icon">${icon('health')}</div>
                <div class="dashboard-card-content">
                    <div class="dashboard-card-label">${t('systemHealth')}</div>
                    <div class="dashboard-card-value">
                        <span class="health-percent ${healthPercent === 100 ? 'perfect' : healthPercent >= 80 ? 'good' : 'warning'}">${healthPercent}%</span>
                    </div>
                    <div class="dashboard-card-sub">${healthyVendors}/${totalVendors} ${t('vendorsHealthy')}</div>
                </div>
            </div>
            <div class="dashboard-card schedule-card">
                <div class="dashboard-card-icon">${icon('schedule')}</div>
                <div class="dashboard-card-content">
                    <div class="dashboard-card-label">${t('crawlSchedule')}</div>
                    <div class="dashboard-card-value">12h</div>
                    <div class="dashboard-card-sub">UTC 02:00 / 14:00</div>
                </div>
            </div>
        </div>
        
        <h2 id="vendor-health">${t('vendorHealth')}</h2>
        <div class="vendor-health-grid">
            ${vendorHealthHtml || `<div class="no-stats">${t('noStats')}</div>`}
        </div>
        
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
    
    // 启动倒计时
    startCountdown();
    
    tocList.innerHTML = `
        <li><a href="javascript:void(0)" onclick="scrollToSection('crawl-dashboard')">${t('crawlDashboard')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('vendor-health')">${t('vendorHealth')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('stats')">${t('eventStats')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('vendor-stats')">${t('vendorStats')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('event-log')">${t('eventLog')}</a></li>
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
