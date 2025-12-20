// ============ 关于页面渲染 ============

function renderAboutPage() {
    const wrapper = document.getElementById('content-wrapper');
    const tocList = document.getElementById('toc-list');
    
    wrapper.innerHTML = `
        <div class="breadcrumb">
            <a href="#">${t('home')}</a>
            <span class="breadcrumb-sep">/</span>
            <span>${t('about')}</span>
        </div>
        
        <h1>${t('aboutTitle')}</h1>
        
        <div class="about-hero">
            <div class="about-logo">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
            </div>
            <div class="about-info">
                <h2>LLM Docs</h2>
                <p class="about-tagline">${t('aboutTagline')}</p>
                <p class="about-built">${t('builtOn')} 2024-12-19</p>
            </div>
        </div>
        
        <h2 id="introduction">${t('aboutIntro')}</h2>
        <p>${t('aboutIntroDesc')}</p>
        
        <h2 id="features">${t('aboutFeatures')}</h2>
        <ul class="about-features-list">
            <li>${t('aboutFeature1')}</li>
            <li>${t('aboutFeature2')}</li>
            <li>${t('aboutFeature3')}</li>
            <li>${t('aboutFeature4')}</li>
            <li>${t('aboutFeature5')}</li>
        </ul>
        
        <h2 id="motivation">${t('aboutMotivation')}</h2>
        <p>${t('aboutMotivationDesc')}</p>
        
        <h2 id="tech-stack">${t('aboutTechStack')}</h2>
        <div class="tech-stack-grid">
            <div class="tech-item">
                <strong>Frontend</strong>
                <span>HTML, CSS, JavaScript (Vanilla)</span>
            </div>
            <div class="tech-item">
                <strong>Hosting</strong>
                <span>GitHub Pages, Vercel</span>
            </div>
            <div class="tech-item">
                <strong>Database</strong>
                <span>Firebase Realtime Database</span>
            </div>
            <div class="tech-item">
                <strong>Crawler</strong>
                <span>Python (requests, BeautifulSoup)</span>
            </div>
            <div class="tech-item">
                <strong>CI/CD</strong>
                <span>GitHub Actions</span>
            </div>
            <div class="tech-item">
                <strong>MCP</strong>
                <span>Model Context Protocol</span>
            </div>
        </div>
        
        <h2 id="disclaimer">${t('disclaimer')}</h2>
        <div class="disclaimer-box">
            <p>${t('disclaimerText1')}</p>
            <p>${t('disclaimerText2')}</p>
            <p>${t('disclaimerText3')}</p>
        </div>
        
        <h2 id="contact">${t('aboutContact')}</h2>
        <p>${t('aboutContactDesc')}</p>
        <ul class="contact-list">
            <li><strong>GitHub:</strong> <a href="https://github.com/petehsu/LLM-Docs" target="_blank">github.com/petehsu/LLM-Docs</a></li>
            <li><strong>Issues:</strong> <a href="https://github.com/petehsu/LLM-Docs/issues" target="_blank">Report a bug or request a feature</a></li>
        </ul>
        
        <h2 id="license">${t('aboutLicense')}</h2>
        <p>${t('aboutLicenseDesc')}</p>
    `;
    
    tocList.innerHTML = `
        <li><a href="javascript:void(0)" onclick="scrollToSection('introduction')">${t('aboutIntro')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('features')">${t('aboutFeatures')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('motivation')">${t('aboutMotivation')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('tech-stack')">${t('aboutTechStack')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('disclaimer')">${t('disclaimer')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('contact')">${t('aboutContact')}</a></li>
        <li><a href="javascript:void(0)" onclick="scrollToSection('license')">${t('aboutLicense')}</a></li>
    `;
}
