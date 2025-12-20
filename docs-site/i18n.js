// 多语言支持
const I18N = {
    en: {
        // Header
        search: 'Search docs...',
        
        // Sidebar
        vendors: 'Vendors',
        techDocs: 'Technical Docs',
        
        // TOC
        onThisPage: 'On this page',
        noToc: 'No headings',
        
        // Home page
        homeTitle: 'LLM API Documentation Hub',
        homeDesc: 'Aggregated API documentation from major LLM providers for developers.',
        selectVendor: 'Select a Vendor',
        selectVendorDesc: 'Click a card below to browse API documentation.',
        
        // Stats
        statVendors: 'Vendors',
        statDocs: 'Documents',
        statLanguages: 'Languages',
        
        // Vendor page
        docList: 'Documentation',
        rootFolder: 'Root',
        
        // Doc page
        home: 'Home',
        docNotFound: 'Document Not Found',
        docNotFoundDesc: 'The requested document does not exist.',
        backToList: 'Back to document list',
        
        // Language tabs
        selectLanguage: 'Language',
        
        // Code copy
        copy: 'Copy',
        copied: 'Copied!',
        
        // Tech docs page
        techDocsTitle: 'Technical Documentation',
        techDocsDesc: 'Project documentation and crawler scripts for downloading LLM API docs.',
        projectDocs: 'Project Documentation',
        crawlerScripts: 'Crawler Scripts',
        downloadScript: 'Download',
        viewReadme: 'View README',
        dependencies: 'Dependencies',
        docCount: 'Documents',
        scriptDesc: 'Download script',
        
        // Auto crawl
        autoCrawl: 'Auto crawl',
        manualCrawl: 'Manual crawl',
        neverCrawled: 'Not crawled yet',
        crawlStatus: 'Crawl Status',
        crawlType: 'Type',
        status: 'Status',
        lastCrawl: 'Last Crawl',
        crawlSuccess: 'Success',
        crawlFailed: 'Failed',
        autoCrawler: 'Auto Crawler',
        autoCrawlerDesc: 'Unified crawler scheduler for all vendors',
        
        // Events page
        events: 'Events',
        eventsTitle: 'Crawler Events',
        eventsDesc: 'Real-time crawler activity log with detailed information.',
        eventStats: 'Statistics',
        totalEvents: 'Total Events',
        successEvents: 'Successful',
        errorEvents: 'Errors',
        todayEvents: 'Today',
        vendorStats: 'By Vendor',
        eventLog: 'Event Log',
        noEvents: 'No events recorded yet.',
        noStats: 'No statistics available.',
        all: 'All',
        success: 'Success',
        errors: 'Errors',
        starts: 'Starts',
        system: 'System',
        showing: 'Showing',
        refresh: 'Refresh',
        today: 'Today',
        yesterday: 'Yesterday',
        
        // MCP page
        mcpSetup: 'MCP Setup',
        mcpTitle: 'MCP Server Integration',
        mcpDesc: 'Connect AI assistants to read all LLM API documentation via Model Context Protocol.',
        mcpWhatIs: 'What is MCP?',
        mcpWhatIsDesc: 'Model Context Protocol (MCP) is an open standard that enables AI assistants to securely access external data sources and tools. With our MCP server, AI assistants can search and read all 1600+ LLM API documents.',
        mcpFeatures: 'Features',
        mcpFeature1: 'List all LLM vendors and their documentation',
        mcpFeature2: 'Read full document content in Markdown',
        mcpFeature3: 'Search across all documentation',
        mcpFeature4: 'Get collection statistics',
        mcpInstall: 'Installation',
        mcpConfig: 'Configuration',
        mcpConfigDesc: 'Add to your MCP client configuration file:',
        mcpTools: 'Available Tools',
        mcpToolName: 'Tool',
        mcpToolDesc: 'Description',
        mcpToolParams: 'Parameters',
        mcpExamples: 'Usage Examples',
        mcpResources: 'Resource URIs',
        mcpResourcesDesc: 'The MCP server also supports resource URIs for direct access:',
        mcpClients: 'Supported Clients',
        mcpClientsDesc: 'MCP is supported by various AI assistants and IDEs:',
        mcpTroubleshooting: 'Troubleshooting',
        mcpTroubleshootingDesc: 'Common issues and solutions:',
        
        // Download
        download: 'Download',
        downloadAll: 'Download All',
        downloadVendor: 'Download All Docs',
        downloadFolder: 'Download Folder',
        downloadDoc: 'Download',
        copyMarkdown: 'Copy Markdown',
        downloading: 'Downloading...',
        packaging: 'Packaging...',
        downloadComplete: 'Download Complete!',
        downloadFailed: 'Download Failed',
        
        // Search
        searchPlaceholder: 'Search documents...',
        searchHint: 'Type to search across all documentation',
        searchNoResults: 'No results found',
        searchNavigate: 'Navigate',
        searchSelect: 'Select',
        searchClose: 'Close',
    },
    zh: {
        search: '搜索文档...',
        vendors: '厂商',
        techDocs: '技术文档',
        onThisPage: '本页目录',
        noToc: '无目录',
        homeTitle: '大模型 API 文档聚合',
        homeDesc: '收集整理各家大模型厂商的 API 文档，方便开发者查阅和对比。',
        selectVendor: '选择厂商',
        selectVendorDesc: '点击下方卡片，浏览对应厂商的 API 文档。',
        statVendors: '厂商',
        statDocs: '文档',
        statLanguages: '语言',
        docList: '文档列表',
        rootFolder: '根目录',
        home: '首页',
        docNotFound: '文档未找到',
        docNotFoundDesc: '请求的文档不存在。',
        backToList: '返回文档列表',
        selectLanguage: '语言',
        copy: '复制',
        copied: '已复制!',
        techDocsTitle: '技术文档',
        techDocsDesc: '项目文档和爬虫脚本，用于下载各家大模型 API 文档。',
        projectDocs: '项目文档',
        crawlerScripts: '爬虫脚本',
        downloadScript: '下载',
        viewReadme: '查看 README',
        dependencies: '依赖',
        docCount: '文档数',
        scriptDesc: '下载脚本',
        
        // Auto crawl
        autoCrawl: '自动爬取',
        manualCrawl: '手动爬取',
        neverCrawled: '尚未爬取',
        crawlStatus: '爬取状态',
        crawlType: '类型',
        status: '状态',
        lastCrawl: '最后爬取',
        crawlSuccess: '成功',
        crawlFailed: '失败',
        crawlHint: '自动爬虫无需浏览器即可运行。手动爬虫需要 Selenium/Playwright 浏览器环境。',
        autoCrawler: '自动爬虫',
        autoCrawlerDesc: '统一的爬虫调度器',
        
        // Events page
        events: '事件',
        eventsTitle: '爬虫事件',
        eventsDesc: '实时爬虫活动日志，包含详细信息。',
        eventStats: '统计信息',
        totalEvents: '总事件数',
        successEvents: '成功',
        errorEvents: '错误',
        todayEvents: '今日',
        vendorStats: '按厂商',
        eventLog: '事件日志',
        noEvents: '暂无事件记录。',
        noStats: '暂无统计数据。',
        all: '全部',
        success: '成功',
        errors: '错误',
        starts: '启动',
        system: '系统',
        showing: '显示',
        refresh: '刷新',
        today: '今天',
        yesterday: '昨天',
        
        // MCP page
        mcpSetup: 'MCP 配置',
        mcpTitle: 'MCP 服务器集成',
        mcpDesc: '通过 Model Context Protocol 让 AI 助手读取所有大模型 API 文档。',
        mcpWhatIs: '什么是 MCP？',
        mcpWhatIsDesc: 'Model Context Protocol (MCP) 是一个开放标准，让 AI 助手能够安全地访问外部数据源和工具。通过我们的 MCP 服务器，AI 助手可以搜索和读取所有 1600+ 篇大模型 API 文档。',
        mcpFeatures: '功能特性',
        mcpFeature1: '列出所有大模型厂商及其文档',
        mcpFeature2: '读取完整的 Markdown 文档内容',
        mcpFeature3: '跨所有文档搜索',
        mcpFeature4: '获取文档集合统计信息',
        mcpInstall: '安装',
        mcpConfig: '配置',
        mcpConfigDesc: '添加到你的 MCP 客户端配置文件：',
        mcpTools: '可用工具',
        mcpToolName: '工具',
        mcpToolDesc: '描述',
        mcpToolParams: '参数',
        mcpExamples: '使用示例',
        mcpResources: '资源 URI',
        mcpResourcesDesc: 'MCP 服务器还支持资源 URI 直接访问：',
        mcpClients: '支持的客户端',
        mcpClientsDesc: 'MCP 被多种 AI 助手和 IDE 支持：',
        mcpTroubleshooting: '故障排除',
        mcpTroubleshootingDesc: '常见问题和解决方案：',
        
        // Download
        download: '下载',
        downloadAll: '下载全部',
        downloadVendor: '下载所有文档',
        downloadFolder: '下载此分类',
        downloadDoc: '下载',
        copyMarkdown: '复制 Markdown',
        downloading: '下载中...',
        packaging: '打包中...',
        downloadComplete: '下载完成！',
        downloadFailed: '下载失败',
        
        // Search
        searchPlaceholder: '搜索文档...',
        searchHint: '输入关键词搜索所有文档',
        searchNoResults: '未找到结果',
        searchNavigate: '导航',
        searchSelect: '选择',
        searchClose: '关闭',
    },
    ja: {
        search: 'ドキュメントを検索...',
        vendors: 'ベンダー',
        techDocs: '技術ドキュメント',
        onThisPage: 'このページの内容',
        noToc: '目次なし',
        homeTitle: 'LLM API ドキュメントハブ',
        homeDesc: '主要なLLMプロバイダーのAPIドキュメントを集約。',
        selectVendor: 'ベンダーを選択',
        selectVendorDesc: 'カードをクリックしてAPIドキュメントを閲覧。',
        statVendors: 'ベンダー',
        statDocs: 'ドキュメント',
        statLanguages: '言語',
        docList: 'ドキュメント一覧',
        rootFolder: 'ルート',
        home: 'ホーム',
        docNotFound: 'ドキュメントが見つかりません',
        docNotFoundDesc: 'リクエストされたドキュメントは存在しません。',
        backToList: 'ドキュメント一覧に戻る',
        selectLanguage: '言語',
        copy: 'コピー',
        copied: 'コピー済み!',
        techDocsTitle: '技術ドキュメント',
        techDocsDesc: 'プロジェクトドキュメントとクローラースクリプト。',
        projectDocs: 'プロジェクトドキュメント',
        crawlerScripts: 'クローラースクリプト',
        downloadScript: 'ダウンロード',
        viewReadme: 'READMEを見る',
        dependencies: '依存関係',
        docCount: 'ドキュメント数',
        scriptDesc: 'ダウンロードスクリプト',
        
        // Auto crawl
        autoCrawl: '自動クロール',
        manualCrawl: '手動クロール',
        neverCrawled: '未クロール',
        crawlStatus: 'クロール状態',
        crawlType: 'タイプ',
        status: '状態',
        lastCrawl: '最終クロール',
        crawlSuccess: '成功',
        crawlFailed: '失敗',
        crawlHint: '自動クローラーはブラウザ不要。手動クローラーはSelenium/Playwrightが必要。',
        autoCrawler: '自動クローラー',
        autoCrawlerDesc: '統合クローラースケジューラー',
        
        // Events page
        events: 'イベント',
        eventsTitle: 'クローラーイベント',
        eventsDesc: 'リアルタイムクローラー活動ログ。',
        eventStats: '統計',
        totalEvents: '総イベント数',
        successEvents: '成功',
        errorEvents: 'エラー',
        todayEvents: '今日',
        vendorStats: 'ベンダー別',
        eventLog: 'イベントログ',
        noEvents: 'イベントはまだありません。',
        noStats: '統計データがありません。',
        all: 'すべて',
        success: '成功',
        errors: 'エラー',
        starts: '開始',
        system: 'システム',
        showing: '表示中',
        refresh: '更新',
        today: '今日',
        yesterday: '昨日',
        
        // MCP page
        mcpSetup: 'MCP設定',
        mcpTitle: 'MCPサーバー統合',
        mcpDesc: 'Model Context Protocolを通じてAIアシスタントがすべてのLLM APIドキュメントを読み取れるようにします。',
        mcpWhatIs: 'MCPとは？',
        mcpWhatIsDesc: 'Model Context Protocol (MCP) は、AIアシスタントが外部データソースやツールに安全にアクセスできるようにするオープンスタンダードです。当MCPサーバーを使用すると、AIアシスタントは1600以上のLLM APIドキュメントを検索・閲覧できます。',
        mcpFeatures: '機能',
        mcpFeature1: 'すべてのLLMベンダーとドキュメントを一覧表示',
        mcpFeature2: 'Markdown形式で完全なドキュメントを読み取り',
        mcpFeature3: 'すべてのドキュメントを横断検索',
        mcpFeature4: 'コレクション統計を取得',
        mcpInstall: 'インストール',
        mcpConfig: '設定',
        mcpConfigDesc: 'MCPクライアント設定ファイルに追加：',
        mcpTools: '利用可能なツール',
        mcpToolName: 'ツール',
        mcpToolDesc: '説明',
        mcpToolParams: 'パラメータ',
        mcpExamples: '使用例',
        mcpResources: 'リソースURI',
        mcpResourcesDesc: 'MCPサーバーはリソースURIによる直接アクセスもサポート：',
        mcpClients: '対応クライアント',
        mcpClientsDesc: 'MCPは様々なAIアシスタントやIDEでサポートされています：',
        mcpTroubleshooting: 'トラブルシューティング',
        mcpTroubleshootingDesc: 'よくある問題と解決策：',
        
        // Download
        download: 'ダウンロード',
        downloadAll: 'すべてダウンロード',
        downloadVendor: 'すべてのドキュメントをダウンロード',
        downloadFolder: 'フォルダをダウンロード',
        downloadDoc: 'ダウンロード',
        copyMarkdown: 'Markdownをコピー',
        downloading: 'ダウンロード中...',
        packaging: 'パッケージ中...',
        downloadComplete: 'ダウンロード完了！',
        downloadFailed: 'ダウンロード失敗',
        
        // Search
        searchPlaceholder: 'ドキュメントを検索...',
        searchHint: 'キーワードを入力してすべてのドキュメントを検索',
        searchNoResults: '結果が見つかりません',
        searchNavigate: 'ナビゲート',
        searchSelect: '選択',
        searchClose: '閉じる',
    }
};

let currentLang = 'en';

function t(key) {
    return I18N[currentLang]?.[key] || I18N.en[key] || key;
}

function setLanguage(lang) {
    if (!I18N[lang]) lang = 'en';
    currentLang = lang;
    localStorage.setItem('site-lang', lang);
    document.documentElement.lang = lang;
    
    // Update all i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    
    // Update language button group
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Re-render current page
    if (typeof handleHashChange === 'function') {
        handleHashChange();
    }
}

function initI18n() {
    const savedLang = localStorage.getItem('site-lang');
    const browserLang = navigator.language.split('-')[0];
    const defaultLang = savedLang || (I18N[browserLang] ? browserLang : 'en');
    
    // Setup language button group
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    
    setLanguage(defaultLang);
}
