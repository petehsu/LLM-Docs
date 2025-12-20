// 厂商配置 - 使用本地 SVG Logo
const VENDORS = [
    {
        id: 'openai',
        name: 'OpenAI',
        logo: 'logos/openai.svg',
        desc: {
            en: 'GPT-4, GPT-5, DALL-E models',
            zh: 'GPT-4, GPT-5, DALL-E 等模型',
            ja: 'GPT-4, GPT-5, DALL-E モデル'
        },
        folder: 'OpenAI/docs',
        languages: [
            { code: 'en', name: 'English', folder: '' }
        ]
    },
    {
        id: 'anthropic',
        name: 'Anthropic Claude',
        logo: 'logos/anthropic.svg',
        desc: {
            en: 'Claude series models',
            zh: 'Claude 系列模型',
            ja: 'Claude シリーズモデル'
        },
        folder: 'Anthropic Claude',
        languages: [
            { code: 'en', name: 'English', folder: 'English' },
            { code: 'zh-CN', name: '简体中文', folder: '简体中文' },
            { code: 'zh-TW', name: '繁體中文', folder: '繁體中文' },
            { code: 'ja', name: '日本語', folder: '日本語' },
            { code: 'ko', name: '한국어', folder: '한국어' },
            { code: 'de', name: 'Deutsch', folder: 'Deutsch' },
            { code: 'es', name: 'Español', folder: 'Español' },
            { code: 'fr', name: 'Français', folder: 'Français' },
            { code: 'it', name: 'Italiano', folder: 'Italiano' },
            { code: 'pt-BR', name: 'Português', folder: 'Português' },
            { code: 'ru', name: 'Русский', folder: 'Русский' },
            { code: 'id', name: 'Indonesia', folder: 'Indonesia' },
        ]
    },
    {
        id: 'google',
        name: 'Google Gemini',
        logo: 'logos/google.svg',
        desc: {
            en: 'Gemini Pro, Ultra models',
            zh: 'Gemini Pro, Ultra 等模型',
            ja: 'Gemini Pro, Ultra モデル'
        },
        folder: 'Google Gemini/docs',
        languages: [
            { code: 'zh', name: '中文', folder: '' }
        ]
    },
    {
        id: 'meta',
        name: 'Meta Llama',
        logo: 'logos/meta.svg',
        desc: {
            en: 'Llama open-source models',
            zh: 'Llama 开源模型系列',
            ja: 'Llama オープンソースモデル'
        },
        folder: 'Meta Llama/docs',
        languages: [
            { code: 'en', name: 'English', folder: '' }
        ]
    },
    {
        id: 'xai',
        name: 'xAI Grok',
        logo: 'logos/xai.svg',
        desc: {
            en: 'Grok series models',
            zh: 'Grok 系列模型',
            ja: 'Grok シリーズモデル'
        },
        folder: 'X Grok/docs',
        languages: [
            { code: 'en', name: 'English', folder: '' }
        ]
    },
    {
        id: 'moonshot',
        name: 'Moonshot Kimi',
        logo: 'logos/moonshot.svg',
        desc: {
            en: 'Kimi AI assistant',
            zh: 'Kimi 智能助手',
            ja: 'Kimi AIアシスタント'
        },
        folder: 'Moonshot Kimi',
        languages: [
            { code: 'zh', name: '简体中文', folder: '简体中文' },
            { code: 'en', name: 'English', folder: 'English' }
        ]
    },
    {
        id: 'zhipu',
        name: 'Zhipu BigModel',
        logo: 'logos/zhipu.svg',
        desc: {
            en: 'GLM series models',
            zh: 'GLM 系列模型',
            ja: 'GLM シリーズモデル'
        },
        folder: 'BigModel Zhipu',
        languages: [
            { code: 'zh', name: '简体中文', folder: 'docs' },
            { code: 'en', name: 'English', folder: 'English' }
        ]
    },
    {
        id: 'minimax',
        name: 'MiniMax',
        logo: 'logos/minimax.svg',
        desc: {
            en: 'MiniMax models',
            zh: 'MiniMax 模型',
            ja: 'MiniMax モデル'
        },
        folder: 'MiniMax',
        languages: [
            { code: 'en', name: 'English', folder: 'English' },
            { code: 'zh', name: '简体中文', folder: '简体中文' }
        ]
    },
    {
        id: 'megallm',
        name: 'MegaLLM',
        logo: 'logos/megallm.svg',
        desc: {
            en: '70+ models aggregation platform',
            zh: '70+ 模型聚合平台',
            ja: '70+ モデル集約プラットフォーム'
        },
        folder: 'MegaLLM',
        languages: [
            { code: 'en', name: 'English', folder: 'English' },
            { code: 'zh', name: '简体中文', folder: '简体中文' },
            { code: 'ru', name: 'Русский', folder: 'Русский' },
            { code: 'models', name: '📊 Models', folder: 'models' }
        ]
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        logo: 'logos/deepseek.svg',
        desc: {
            en: 'DeepSeek-V3, DeepSeek-R1 models',
            zh: 'DeepSeek-V3, DeepSeek-R1 模型',
            ja: 'DeepSeek-V3, DeepSeek-R1 モデル'
        },
        folder: 'DeepSeek',
        languages: [
            { code: 'en', name: 'English', folder: 'English' },
            { code: 'zh', name: '简体中文', folder: '简体中文' }
        ]
    }
];

function getVendorDesc(vendor) {
    return vendor.desc[currentLang] || vendor.desc.en || '';
}
