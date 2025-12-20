// ============ 脚本配置数据 ============

// 爬虫脚本配置
const CRAWLER_SCRIPTS = [
    {
        vendor: 'OpenAI',
        script: 'download_openai_uc.py',
        deps: 'undetected-chromedriver, selenium, markdownify',
        docCount: 51,
        desc: { en: 'Bypass Cloudflare protection', zh: '绕过 Cloudflare 人机验证', ja: 'Cloudflare保護をバイパス' }
    },
    {
        vendor: 'Anthropic Claude',
        script: 'batch_download_docs.py',
        deps: 'requests',
        docCount: 963,
        desc: { en: 'Direct Markdown download', zh: '直接下载 Markdown', ja: '直接Markdownダウンロード' }
    },
    {
        vendor: 'Google Gemini',
        script: 'batch_download_docs.py',
        deps: 'requests',
        docCount: 67,
        desc: { en: 'Direct Markdown download', zh: '直接下载 Markdown', ja: '直接Markdownダウンロード' }
    },
    {
        vendor: 'Meta Llama',
        script: 'download_meta.py',
        deps: 'playwright, markdownify',
        docCount: 22,
        desc: { en: 'Playwright rendering', zh: 'Playwright 渲染', ja: 'Playwrightレンダリング' }
    },
    {
        vendor: 'xAI Grok',
        script: 'download_grok.py',
        deps: 'requests',
        docCount: 59,
        desc: { en: 'From llms.txt', zh: '从 llms.txt 获取', ja: 'llms.txtから取得' }
    },
    {
        vendor: 'Moonshot Kimi',
        script: 'download_moonshot.py',
        deps: 'playwright, markdownify',
        docCount: 72,
        desc: { en: 'Playwright rendering', zh: 'Playwright 渲染', ja: 'Playwrightレンダリング' }
    },
    {
        vendor: 'Zhipu BigModel',
        script: 'download_zhipu.py / download_zhipu_en.py',
        deps: 'requests / playwright, markdownify',
        docCount: 242,
        desc: { en: 'Chinese: Mintlify, English: Vue SPA', zh: '中文站: Mintlify, 英文站: Vue SPA', ja: '中国語: Mintlify, 英語: Vue SPA' }
    },
    {
        vendor: 'MiniMax',
        script: 'download_minimax.py',
        deps: 'requests',
        docCount: 84,
        desc: { en: 'Mintlify framework', zh: 'Mintlify 框架', ja: 'Mintlifyフレームワーク' }
    },
    {
        vendor: 'MegaLLM',
        script: 'download_megallm.py',
        deps: 'requests',
        docCount: 156,
        desc: { en: 'From llms.txt + models', zh: '从 llms.txt + 模型列表', ja: 'llms.txt + モデルリスト' }
    },
    {
        vendor: 'DeepSeek',
        script: 'download_deepseek.py',
        deps: 'selenium, html2text',
        docCount: 61,
        desc: { en: 'Docusaurus framework', zh: 'Docusaurus 框架', ja: 'Docusaurusフレームワーク' }
    }
];

// 探测脚本配置
const EXPLORE_SCRIPTS = [
    {
        script: 'explore/explore_claude.py',
        target: 'Claude',
        deps: 'requests',
        desc: { en: 'Analyze Claude docs structure', zh: '分析 Claude 文档结构', ja: 'Claude文書構造を分析' }
    },
    {
        script: 'explore/explore_gemini.py',
        target: 'Gemini',
        deps: 'requests',
        desc: { en: 'Analyze Gemini docs structure', zh: '分析 Gemini 文档结构', ja: 'Gemini文書構造を分析' }
    },
    {
        script: 'explore/explore_openai.py',
        target: 'OpenAI',
        deps: 'playwright',
        desc: { en: 'Analyze OpenAI docs structure', zh: '分析 OpenAI 文档结构', ja: 'OpenAI文書構造を分析' }
    },
    {
        script: 'explore/explore_zhipu.py',
        target: 'Zhipu',
        deps: 'requests',
        desc: { en: 'Analyze Zhipu docs structure', zh: '分析智谱文档结构', ja: 'Zhipu文書構造を分析' }
    },
    {
        script: 'explore/explore_moonshot.py',
        target: 'Moonshot',
        deps: 'playwright',
        desc: { en: 'Analyze Moonshot docs structure', zh: '分析 Moonshot 文档结构', ja: 'Moonshot文書構造を分析' }
    },
    {
        script: 'explore/explore_megallm_models.py',
        target: 'MegaLLM',
        deps: 'requests',
        desc: { en: 'Explore MegaLLM model API', zh: '探测 MegaLLM 模型 API', ja: 'MegaLLMモデルAPIを探索' }
    }
];

// 测试脚本配置
const TEST_SCRIPTS = [
    {
        script: 'test/test_claude_md.py',
        target: 'Claude',
        deps: 'requests',
        desc: { en: 'Test Claude Markdown URL format', zh: '测试 Claude Markdown URL 格式', ja: 'Claude Markdown URL形式をテスト' }
    },
    {
        script: 'test/test_megallm.py',
        target: 'MegaLLM',
        deps: 'requests',
        desc: { en: 'Test MegaLLM URL format', zh: '测试 MegaLLM URL 格式', ja: 'MegaLLM URL形式をテスト' }
    },
    {
        script: 'test/test_megallm_lang.py',
        target: 'MegaLLM',
        deps: 'requests',
        desc: { en: 'Test MegaLLM multi-language support', zh: '测试 MegaLLM 多语言支持', ja: 'MegaLLM多言語サポートをテスト' }
    },
    {
        script: 'test/test_minimax.py',
        target: 'MiniMax',
        deps: 'requests',
        desc: { en: 'Test MiniMax URL format', zh: '测试 MiniMax URL 格式', ja: 'MiniMax URL形式をテスト' }
    },
    {
        script: 'test/test_meta.py',
        target: 'Meta',
        deps: 'requests',
        desc: { en: 'Test Meta Llama URL format', zh: '测试 Meta Llama URL 格式', ja: 'Meta Llama URL形式をテスト' }
    }
];

// 工具脚本配置
const UTIL_SCRIPTS = [
    {
        script: 'utils/verify_minimax.py',
        target: 'MiniMax',
        deps: '-',
        desc: { en: 'Verify MiniMax download quality', zh: '验证 MiniMax 下载质量', ja: 'MiniMaxダウンロード品質を検証' }
    },
    {
        script: 'utils/verify_zhipu.py',
        target: 'Zhipu',
        deps: '-',
        desc: { en: 'Verify Zhipu download quality', zh: '验证智谱下载质量', ja: 'Zhipuダウンロード品質を検証' }
    },
    {
        script: 'utils/fix_claude_html.py',
        target: 'Claude',
        deps: 'requests',
        desc: { en: 'Fix Claude HTML error files', zh: '修复 Claude HTML 错误文件', ja: 'Claude HTMLエラーファイルを修正' }
    },
    {
        script: 'utils/extract_zhipu_links.py',
        target: 'Zhipu',
        deps: '-',
        desc: { en: 'Extract Zhipu doc links from HTML', zh: '从 HTML 提取智谱文档链接', ja: 'HTMLからZhipuリンクを抽出' }
    },
    {
        script: 'utils/scrape_megallm_models.py',
        target: 'MegaLLM',
        deps: 'playwright',
        desc: { en: 'Scrape MegaLLM model list (login required)', zh: '爬取 MegaLLM 模型列表（需登录）', ja: 'MegaLLMモデルリストをスクレイプ' }
    },
    {
        script: 'utils/parse_megallm_models.py',
        target: 'MegaLLM',
        deps: 'beautifulsoup4',
        desc: { en: 'Parse MegaLLM models from saved HTML', zh: '从保存的 HTML 解析 MegaLLM 模型', ja: '保存されたHTMLからモデルを解析' }
    }
];

// 核心脚本配置
const CORE_SCRIPTS = [
    {
        script: 'build_docs_site.py',
        deps: '-',
        desc: { en: 'Build docs index and copy files to site', zh: '构建文档索引并复制文件到网站', ja: '文書インデックスを構築しサイトにコピー' }
    },
    {
        script: 'mcp_server.py',
        deps: 'mcp',
        desc: { en: 'MCP server for AI assistants to read docs', zh: 'MCP 服务器，让 AI 助手读取文档', ja: 'AIアシスタント用MCPサーバー' }
    },
    {
        script: 'auto_crawler.py',
        deps: '-',
        desc: { en: 'Unified crawler scheduler with event logging', zh: '统一爬虫调度器，带事件日志', ja: '統合クローラースケジューラー' }
    }
];

// 获取所有脚本的统一列表
function getAllScripts() {
    const scripts = [];
    
    // 爬虫脚本
    CRAWLER_SCRIPTS.forEach(s => {
        const scriptNames = s.script.split(' / ');
        scriptNames.forEach(name => {
            scripts.push({
                path: name.trim(),
                category: 'crawler',
                categoryName: { en: 'Crawler Scripts', zh: '爬虫脚本', ja: 'クローラースクリプト' },
                vendor: s.vendor,
                deps: s.deps,
                docCount: s.docCount,
                desc: s.desc
            });
        });
    });
    
    // 核心脚本
    CORE_SCRIPTS.forEach(s => {
        scripts.push({
            path: s.script,
            category: 'core',
            categoryName: { en: 'Core Scripts', zh: '核心脚本', ja: 'コアスクリプト' },
            deps: s.deps,
            desc: s.desc
        });
    });
    
    // 探测脚本
    EXPLORE_SCRIPTS.forEach(s => {
        scripts.push({
            path: s.script,
            category: 'explore',
            categoryName: { en: 'Explore Scripts', zh: '探测脚本', ja: '探索スクリプト' },
            target: s.target,
            deps: s.deps,
            desc: s.desc
        });
    });
    
    // 测试脚本
    TEST_SCRIPTS.forEach(s => {
        scripts.push({
            path: s.script,
            category: 'test',
            categoryName: { en: 'Test Scripts', zh: '测试脚本', ja: 'テストスクリプト' },
            target: s.target,
            deps: s.deps,
            desc: s.desc
        });
    });
    
    // 工具脚本
    UTIL_SCRIPTS.forEach(s => {
        scripts.push({
            path: s.script,
            category: 'utils',
            categoryName: { en: 'Utility Scripts', zh: '工具脚本', ja: 'ユーティリティスクリプト' },
            target: s.target,
            deps: s.deps,
            desc: s.desc
        });
    });
    
    return scripts;
}
