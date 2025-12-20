// ============ Firebase 统计分析 ============
// 实时在线人数、浏览量、下载量统计

// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyCcVtqY72F0GZkWX9D3RDxQvdgq2t-ZG5E",
    authDomain: "llm-docs-8c6a0.firebaseapp.com",
    databaseURL: "https://llm-docs-8c6a0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "llm-docs-8c6a0",
    storageBucket: "llm-docs-8c6a0.firebasestorage.app",
    messagingSenderId: "201452393860",
    appId: "1:201452393860:web:de8b2a431d94c4b91139d1",
    measurementId: "G-X6V7F4XWCE"
};

// 全局变量
let firebaseApp = null;
let firebaseDb = null;
let currentSessionId = null;
let analyticsDocPath = null;
let onlineCountCallback = null;
let networkTimeOffset = 0; // 网络时间与本地时间的偏移量（毫秒）

// 生成唯一会话 ID
function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
}

// 获取网络时间（使用 worldtimeapi.org）
async function fetchNetworkTime() {
    const apis = [
        'https://worldtimeapi.org/api/timezone/Etc/UTC',
        'https://timeapi.io/api/Time/current/zone?timeZone=UTC'
    ];
    
    for (const api of apis) {
        try {
            const localBefore = Date.now();
            const response = await fetch(api, { timeout: 5000 });
            const localAfter = Date.now();
            const data = await response.json();
            
            let serverTime;
            if (api.includes('worldtimeapi')) {
                serverTime = new Date(data.utc_datetime).getTime();
            } else {
                serverTime = new Date(data.dateTime).getTime();
            }
            
            // 计算网络延迟的一半作为补偿
            const latency = (localAfter - localBefore) / 2;
            const localMid = localBefore + latency;
            
            // 计算偏移量
            networkTimeOffset = serverTime - localMid;
            console.log('Network time synced, offset:', networkTimeOffset, 'ms');
            return true;
        } catch (error) {
            console.warn('Failed to fetch time from', api, error);
        }
    }
    
    console.warn('All time APIs failed, using local time');
    return false;
}

// 获取精准的当前时间戳
function getAccurateTimestamp() {
    return Date.now() + networkTimeOffset;
}

// 格式化精准时间为字符串（UTC）
function formatAccurateTime(timestamp) {
    const date = new Date(timestamp || getAccurateTimestamp());
    return date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}

// 初始化 Firebase
async function initFirebaseAnalytics() {
    try {
        // 先同步网络时间
        await fetchNetworkTime();
        
        // 动态加载 Firebase SDK
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
        const { getDatabase, ref, set, onValue, onDisconnect, increment, serverTimestamp, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
        
        // 初始化 Firebase
        firebaseApp = initializeApp(firebaseConfig);
        firebaseDb = getDatabase(firebaseApp);
        
        // 生成会话 ID
        currentSessionId = generateSessionId();
        
        // 存储数据库方法到全局
        window.firebaseDb = firebaseDb;
        window.firebaseRef = ref;
        window.firebaseSet = set;
        window.firebaseOnValue = onValue;
        window.firebaseOnDisconnect = onDisconnect;
        window.firebaseIncrement = increment;
        window.firebaseServerTimestamp = serverTimestamp;
        window.firebaseGet = get;
        
        // 注册在线状态
        registerPresence();
        
        // 监听全站在线人数
        watchOnlineCount();
        
        console.log('Firebase Analytics initialized');
        return true;
    } catch (error) {
        console.error('Firebase init error:', error);
        return false;
    }
}

// 注册在线状态（Presence）
function registerPresence() {
    if (!firebaseDb || !currentSessionId) return;
    
    const presenceRef = firebaseRef(firebaseDb, `presence/${currentSessionId}`);
    const connectedRef = firebaseRef(firebaseDb, '.info/connected');
    
    firebaseOnValue(connectedRef, (snapshot) => {
        if (snapshot.val() === true) {
            // 设置在线状态
            firebaseSet(presenceRef, {
                online: true,
                lastSeen: getAccurateTimestamp(),
                page: location.hash || '#'
            });
            
            // 断开连接时自动删除
            firebaseOnDisconnect(presenceRef).remove();
        }
    });
    
    // 定期更新心跳
    setInterval(() => {
        if (firebaseDb && currentSessionId) {
            firebaseSet(presenceRef, {
                online: true,
                lastSeen: getAccurateTimestamp(),
                page: location.hash || '#'
            });
        }
    }, 30000); // 每30秒更新一次
}

// 监听全站在线人数
function watchOnlineCount() {
    if (!firebaseDb) return;
    
    const presenceRef = firebaseRef(firebaseDb, 'presence');
    
    firebaseOnValue(presenceRef, (snapshot) => {
        const data = snapshot.val();
        const count = data ? Object.keys(data).length : 0;
        updateOnlineCountUI(count);
    });
}

// 更新在线人数 UI
function updateOnlineCountUI(count) {
    const el = document.getElementById('online-count');
    if (el) {
        el.textContent = count;
        el.closest('.online-indicator')?.classList.add('active');
    }
}

// 记录并获取总访问量
async function trackTotalVisits() {
    if (!firebaseDb) return 0;
    
    const visitsRef = firebaseRef(firebaseDb, 'stats/totalVisits');
    const sessionKey = 'llm_docs_visited';
    
    try {
        // 检查是否是新访客（本次会话）
        if (!sessionStorage.getItem(sessionKey)) {
            sessionStorage.setItem(sessionKey, '1');
            
            // 增加总访问量
            const snapshot = await firebaseGet(visitsRef);
            const currentVisits = snapshot.val() || 0;
            await firebaseSet(visitsRef, currentVisits + 1);
        }
        
        // 获取并显示总访问量
        const snapshot = await firebaseGet(visitsRef);
        const totalVisits = snapshot.val() || 0;
        updateTotalVisitsUI(totalVisits);
        
        return totalVisits;
    } catch (error) {
        console.error('Track total visits error:', error);
        return 0;
    }
}

// 更新总访问量 UI
function updateTotalVisitsUI(count) {
    const el = document.getElementById('total-visits');
    if (el) {
        el.textContent = formatStatNumber(count);
    }
}

// ============ 留言板功能 ============

// 发送留言
async function postComment(content, nickname) {
    if (!firebaseDb || !content.trim()) return null;
    
    const commentId = 'msg_' + getAccurateTimestamp() + '_' + Math.random().toString(36).substring(2, 9);
    const commentRef = firebaseRef(firebaseDb, `comments/${commentId}`);
    
    const comment = {
        id: commentId,
        content: content.trim().substring(0, 500), // 限制500字
        nickname: (nickname || '').trim().substring(0, 20) || getRandomNickname(),
        timestamp: getAccurateTimestamp(),
        page: location.hash || '#'
    };
    
    try {
        await firebaseSet(commentRef, comment);
        return comment;
    } catch (error) {
        console.error('Post comment error:', error);
        return null;
    }
}

// 获取留言列表
async function getComments(limit = 50) {
    if (!firebaseDb) return [];
    
    try {
        const commentsRef = firebaseRef(firebaseDb, 'comments');
        const snapshot = await firebaseGet(commentsRef);
        const data = snapshot.val();
        
        if (!data) return [];
        
        // 转换为数组并按时间倒序
        const comments = Object.values(data)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
        
        return comments;
    } catch (error) {
        console.error('Get comments error:', error);
        return [];
    }
}

// 监听新留言
function watchComments(callback) {
    if (!firebaseDb) return null;
    
    const commentsRef = firebaseRef(firebaseDb, 'comments');
    
    return firebaseOnValue(commentsRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            callback([]);
            return;
        }
        
        const comments = Object.values(data)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 50);
        
        callback(comments);
    });
}

// 生成随机昵称
function getRandomNickname() {
    const adjectives = ['Happy', 'Clever', 'Swift', 'Bright', 'Cool', 'Smart', 'Lucky', 'Brave'];
    const nouns = ['Coder', 'Dev', 'Hacker', 'Ninja', 'Wizard', 'Master', 'Pro', 'Guru'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj}${noun}${Math.floor(Math.random() * 100)}`;
}

// 格式化留言时间
function formatCommentTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return t('justNow') || 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + (t('minutesAgo') || 'm ago');
    if (diff < 86400000) return Math.floor(diff / 3600000) + (t('hoursAgo') || 'h ago');
    if (diff < 604800000) return Math.floor(diff / 86400000) + (t('daysAgo') || 'd ago');
    
    return new Date(timestamp).toLocaleDateString();
}

// 记录页面浏览
async function trackPageView(docPath) {
    if (!firebaseDb || !docPath) return;
    
    // 规范化路径
    const normalizedPath = docPath.replace(/[.#$[\]]/g, '_');
    const statsRef = firebaseRef(firebaseDb, `stats/views/${normalizedPath}`);
    
    try {
        // 增加浏览量
        const snapshot = await firebaseGet(statsRef);
        const currentViews = snapshot.val() || 0;
        await firebaseSet(statsRef, currentViews + 1);
        
        // 更新当前文档的在线阅读人数
        if (analyticsDocPath !== docPath) {
            // 离开上一个文档
            if (analyticsDocPath) {
                const oldReadingRef = firebaseRef(firebaseDb, `reading/${analyticsDocPath.replace(/[.#$[\]]/g, '_')}/${currentSessionId}`);
                await firebaseSet(oldReadingRef, null);
            }
            
            // 进入新文档
            analyticsDocPath = docPath;
            const readingRef = firebaseRef(firebaseDb, `reading/${normalizedPath}/${currentSessionId}`);
            await firebaseSet(readingRef, { time: getAccurateTimestamp() });
            firebaseOnDisconnect(readingRef).remove();
        }
        
        return currentViews + 1;
    } catch (error) {
        console.error('Track page view error:', error);
        return 0;
    }
}

// 记录下载
async function trackDownload(docPath) {
    if (!firebaseDb || !docPath) return;
    
    const normalizedPath = docPath.replace(/[.#$[\]]/g, '_');
    const statsRef = firebaseRef(firebaseDb, `stats/downloads/${normalizedPath}`);
    
    try {
        const snapshot = await firebaseGet(statsRef);
        const currentDownloads = snapshot.val() || 0;
        await firebaseSet(statsRef, currentDownloads + 1);
        return currentDownloads + 1;
    } catch (error) {
        console.error('Track download error:', error);
        return 0;
    }
}

// 获取文档统计
async function getDocStats(docPath) {
    if (!firebaseDb || !docPath) return { views: 0, downloads: 0, reading: 0 };
    
    const normalizedPath = docPath.replace(/[.#$[\]]/g, '_');
    
    try {
        const [viewsSnap, downloadsSnap, readingSnap] = await Promise.all([
            firebaseGet(firebaseRef(firebaseDb, `stats/views/${normalizedPath}`)),
            firebaseGet(firebaseRef(firebaseDb, `stats/downloads/${normalizedPath}`)),
            firebaseGet(firebaseRef(firebaseDb, `reading/${normalizedPath}`))
        ]);
        
        const readingData = readingSnap.val();
        const readingCount = readingData ? Object.keys(readingData).length : 0;
        
        return {
            views: viewsSnap.val() || 0,
            downloads: downloadsSnap.val() || 0,
            reading: readingCount
        };
    } catch (error) {
        console.error('Get doc stats error:', error);
        return { views: 0, downloads: 0, reading: 0 };
    }
}

// 监听文档实时阅读人数
function watchDocReading(docPath, callback) {
    if (!firebaseDb || !docPath) return null;
    
    const normalizedPath = docPath.replace(/[.#$[\]]/g, '_');
    const readingRef = firebaseRef(firebaseDb, `reading/${normalizedPath}`);
    
    return firebaseOnValue(readingRef, (snapshot) => {
        const data = snapshot.val();
        const count = data ? Object.keys(data).length : 0;
        callback(count);
    });
}

// 格式化统计数字
function formatStatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// 导出函数
window.initFirebaseAnalytics = initFirebaseAnalytics;
window.trackPageView = trackPageView;
window.trackDownload = trackDownload;
window.trackTotalVisits = trackTotalVisits;
window.getDocStats = getDocStats;
window.watchDocReading = watchDocReading;
window.formatStatNumber = formatStatNumber;
window.postComment = postComment;
window.getComments = getComments;
window.watchComments = watchComments;
window.formatCommentTime = formatCommentTime;
window.getAccurateTimestamp = getAccurateTimestamp;
window.formatAccurateTime = formatAccurateTime;
window.fetchNetworkTime = fetchNetworkTime;
