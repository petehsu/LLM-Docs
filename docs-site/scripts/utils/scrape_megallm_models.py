#!/usr/bin/env python3
"""
爬取 MegaLLM 模型列表页面，生成规范的 Markdown 文件

页面: https://megallm.io/dashboard/models

使用方法:
1. 运行脚本: python3 scrape_megallm_models.py
2. 在弹出的浏览器窗口中登录
3. 登录成功后在终端按 Enter 继续
"""

import sys
import json
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

sys.stdout.reconfigure(line_buffering=True)

OUTPUT_DIR = "MegaLLM/models"


def generate_model_markdown(model):
    """生成单个模型的 Markdown 文件"""
    name = model.get('name', 'Unknown')
    provider = model.get('provider', 'Unknown')
    model_id = model.get('id', '')
    description = model.get('description', '')
    
    input_price = model.get('input_price', 'N/A')
    output_price = model.get('output_price', 'N/A')
    context_window = model.get('context_window', 'N/A')
    max_output = model.get('max_output', 'N/A')
    capabilities = model.get('capabilities', [])
    
    md = f"""# {name}

> {provider}

{description}

## Pricing

| Type | Price |
|------|-------|
| Input | {input_price} |
| Output | {output_price} |

## Context

| Parameter | Value |
|-----------|-------|
| Context Window | {context_window} |
| Max Output | {max_output} |

## Capabilities

"""
    if capabilities:
        for cap in capabilities:
            md += f"- {cap}\n"
    else:
        md += "- N/A\n"
    
    md += f"""
## Model ID

```
{model_id}
```
"""
    return md


JS_EXTRACT_MODELS = """
() => {
    const models = [];
    const cards = document.querySelectorAll('[class*="card"], [class*="model"]');
    
    cards.forEach(card => {
        const text = card.innerText || '';
        if (!text.includes('Model ID') && !text.includes('Copy ID')) return;
        
        const model = {};
        const nameEl = card.querySelector('h2, h3, [class*="title"], [class*="name"]');
        if (nameEl) model.name = nameEl.innerText.trim();
        
        const lines = text.split('\\n').map(l => l.trim()).filter(l => l);
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Provider
            const providers = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral', 'xAI', 'DeepSeek', 'Alibaba', 'minimax'];
            if (providers.some(p => line.includes(p))) {
                if (!model.provider) model.provider = line;
            }
            
            // Description
            if (line.includes('language model') || line.includes('capabilities') || line.includes('reasoning')) {
                if (!model.description) model.description = line;
            }
            
            // Pricing - look for dollar amounts
            if (line.includes('/M') && line.length < 20) {
                if (!model.input_price) model.input_price = line;
                else if (!model.output_price) model.output_price = line;
            }
            
            // Context window
            if (line.includes('tokens') && !line.includes('Max')) {
                if (!model.context_window) model.context_window = line;
            }
            
            // Max output
            if ((line.includes('Max Output') || line.includes('Max')) && lines[i+1] && lines[i+1].includes('tokens')) {
                model.max_output = lines[i+1];
            }
            
            // Model ID
            if (line === 'Model ID' && lines[i+1]) {
                model.id = lines[i+1];
            }
        }
        
        // Capabilities
        const capabilities = [];
        const capLabels = card.querySelectorAll('[class*="badge"], [class*="tag"], [class*="chip"]');
        capLabels.forEach(label => {
            const cap = label.innerText.trim();
            if (cap && !cap.includes('/M') && !cap.includes('tokens') && cap.length < 20) {
                capabilities.push(cap);
            }
        });
        if (capabilities.length > 0) model.capabilities = capabilities;
        
        if (model.name && model.id) {
            models.push(model);
        }
    });
    
    return models;
}
"""


async def scrape_models():
    """爬取模型列表"""
    print("=" * 50)
    print("MegaLLM 模型列表爬取工具")
    print("=" * 50)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False,
            proxy={"server": "http://127.0.0.1:10808"}
        )
        context = await browser.new_context(
            user_agent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
        )
        page = await context.new_page()
        
        print("\n🔐 打开登录页面...")
        print("   请在浏览器窗口中登录，登录成功后按 Enter 继续...")
        await page.goto("https://megallm.io/login", timeout=60000)
        
        input("   [按 Enter 继续爬取模型列表]")
        
        print("\n📋 加载模型列表页面...")
        await page.goto("https://megallm.io/dashboard/models", timeout=120000)
        
        print("   等待模型卡片加载...")
        try:
            await page.wait_for_selector('[class*="card"]', timeout=30000)
        except Exception:
            print("   未找到卡片，等待更长时间...")
        
        await page.wait_for_timeout(5000)
        
        print("📊 提取模型数据...")
        models = await page.evaluate(JS_EXTRACT_MODELS)
        
        print(f"   发现 {len(models)} 个模型")
        
        if not models:
            print("\n⚠️ 未能提取模型数据，保存页面...")
            content = await page.content()
            with open('megallm_models_page.html', 'w', encoding='utf-8') as f:
                f.write(content)
            print("   已保存到 megallm_models_page.html")
            await browser.close()
            return
        
        with open('megallm_models.json', 'w', encoding='utf-8') as f:
            json.dump(models, f, indent=2, ensure_ascii=False)
        print("   已保存到 megallm_models.json")
        
        print(f"\n📝 生成 Markdown 文件...")
        Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
        
        for model in models:
            name = model.get('name', 'unknown')
            filename = name.lower().replace(' ', '-').replace('/', '-').replace('.', '-')
            filepath = f"{OUTPUT_DIR}/{filename}.md"
            
            md_content = generate_model_markdown(model)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(md_content)
            print(f"    ✓ {name}")
        
        # Index file
        index_md = "# MegaLLM Models\n\n"
        index_md += f"Total: {len(models)} models\n\n"
        index_md += "| Model | Provider | Model ID |\n"
        index_md += "|-------|----------|----------|\n"
        for model in models:
            name = model.get('name', '')
            provider = model.get('provider', '')
            model_id = model.get('id', '')
            filename = name.lower().replace(' ', '-').replace('/', '-').replace('.', '-')
            index_md += f"| [{name}]({filename}.md) | {provider} | `{model_id}` |\n"
        
        with open(f"{OUTPUT_DIR}/README.md", 'w', encoding='utf-8') as f:
            f.write(index_md)
        
        await browser.close()
        print(f"\n✅ 完成: {len(models)} 个模型")


if __name__ == "__main__":
    asyncio.run(scrape_models())
