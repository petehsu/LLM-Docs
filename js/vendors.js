// 厂商配置 - 从 JSON 动态加载
let VENDORS = [];
let siteConfig = {};

// 加载厂商配置
async function loadVendorsConfig() {
    try {
        const response = await fetch('config/vendors.json');
        const data = await response.json();
        VENDORS = data.vendors || [];
        window.VENDORS = VENDORS;
        console.log(`Loaded ${VENDORS.length} vendors from config`);
        return VENDORS;
    } catch (error) {
        console.error('Failed to load vendors config:', error);
        return [];
    }
}

// 加载站点配置
async function loadSiteConfig() {
    try {
        const response = await fetch('config/site.json');
        siteConfig = await response.json();
        console.log('Site config loaded:', siteConfig.name);
        return siteConfig;
    } catch (error) {
        console.error('Failed to load site config:', error);
        return {};
    }
}

// 加载爬虫配置
async function loadCrawlersConfig() {
    try {
        const response = await fetch('config/crawlers.json');
        const data = await response.json();
        return data.crawlers || [];
    } catch (error) {
        console.error('Failed to load crawlers config:', error);
        return [];
    }
}

// 初始化配置
async function initConfig() {
    await Promise.all([
        loadVendorsConfig(),
        loadSiteConfig()
    ]);
    return { vendors: VENDORS, site: siteConfig };
}

// 获取厂商描述
function getVendorDesc(vendor) {
    if (!vendor || !vendor.desc) return '';
    return vendor.desc[currentLang] || vendor.desc.en || '';
}

// 根据 ID 获取厂商
function getVendorById(id) {
    return VENDORS.find(v => v.id === id);
}

// 导出
window.VENDORS = VENDORS;
window.siteConfig = siteConfig;
window.loadVendorsConfig = loadVendorsConfig;
window.loadSiteConfig = loadSiteConfig;
window.loadCrawlersConfig = loadCrawlersConfig;
window.initConfig = initConfig;
window.getVendorDesc = getVendorDesc;
window.getVendorById = getVendorById;
