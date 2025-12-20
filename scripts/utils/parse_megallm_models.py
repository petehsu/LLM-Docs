#!/usr/bin/env python3
"""
从保存的 HTML 文件解析 MegaLLM 模型数据 - 完整版
"""

import re
import json
from pathlib import Path
from bs4 import BeautifulSoup

HTML_FILE = "model-list/megallm-models.html"
OUTPUT_DIR = "MegaLLM/models"


def parse_models():
    print("=" * 50)
    print("解析 MegaLLM 模型数据")
    print("=" * 50)
    
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    text = soup.get_text()
    
    # 数据格式示例:
    # GPT-4.1OpenAIchatAdvanced language model...PricingInput$2.00/MOutput$8.00/MContext WindowContext128,000 tokensMax Output16,384 tokensCapabilitiesVisionFunctionsStreamingStructuredModel IDgpt-4.1Copy IDTry it
    
    # 用 Model ID 分割，每个模型以 "Copy IDTry it" 结尾
    # 正则匹配每个模型块
    pattern = r'([A-Za-z0-9\-\./\s]+?)(?:OpenAI|Anthropic|Google|Meta|Mistral AI|Xai|DeepSeek|Alibaba|minimax|moonshotai|glm)[a-z]*chat[A-Za-z0-9\s\-\./]+?Pricing.*?Model ID([a-zA-Z0-9\-\./_:]+)Copy ID'
    
    # 更简单的方法：按 "Copy IDTry it" 分割
    blocks = text.split('Copy IDTry it')
    
    models = []
    
    for block in blocks:
        if 'Model ID' not in block or 'Pricing' not in block:
            continue
        
        model = {}
        
        # 提取 Model ID
        model_id_match = re.search(r'Model ID([a-zA-Z0-9\-\./_:]+)', block)
        if model_id_match:
            model['id'] = model_id_match.group(1)
        else:
            continue
        
        # 提取价格
        input_match = re.search(r'Input\$?([\d\.]+)/M', block)
        output_match = re.search(r'Output\$?([\d\.]+)/M', block)
        if input_match:
            model['input_price'] = f"${input_match.group(1)}/M"
        if output_match:
            model['output_price'] = f"${output_match.group(1)}/M"
        
        # 提取 Context Window
        context_match = re.search(r'Context([\d,]+)\s*tokens', block)
        if context_match:
            model['context_window'] = f"{context_match.group(1)} tokens"
        
        # 提取 Max Output
        max_output_match = re.search(r'Max Output([\d,]+)\s*tokens', block)
        if max_output_match:
            model['max_output'] = f"{max_output_match.group(1)} tokens"
        
        # 提取 Capabilities
        caps = []
        if 'Vision' in block:
            caps.append('Vision')
        if 'Functions' in block:
            caps.append('Functions')
        if 'Streaming' in block:
            caps.append('Streaming')
        if 'Structured' in block:
            caps.append('Structured')
        model['capabilities'] = caps
        
        # 提取 Provider
        providers = {
            'OpenAI': 'OpenAI',
            'Anthropic': 'Anthropic', 
            'Google': 'Google',
            'Meta': 'Meta',
            'Mistral AI': 'Mistral AI',
            'Xai': 'xAI',
            'DeepSeek': 'DeepSeek',
            'Alibaba': 'Alibaba',
            'moonshotai': 'Moonshot',
            'minimaxai': 'MiniMax',
            'glm': 'Zhipu'
        }
        
        for key, value in providers.items():
            if key in block:
                model['provider'] = value
                break
        
        if 'provider' not in model:
            model['provider'] = 'Unknown'
        
        # 提取名称和描述
        # 名称在 Provider 之前
        name_patterns = [
            (r'(GPT-[\d\.]+\s*\w*)', 'OpenAI'),
            (r'(Claude\s+\w+\s+[\d\.]+)', 'Anthropic'),
            (r'(Gemini\s+[\d\.]+\s*\w*)', 'Google'),
            (r'(Llama\s*[\d\.]+\s*\w+\s*\([^)]+\))', 'Meta'),
            (r'(grok-[\d\.\-\w]+)', 'xAI'),
            (r'(Qwen[\d\s\w\-]+)', 'Alibaba'),
        ]
        
        # 从 Model ID 推断名称
        mid = model['id']
        if mid.startswith('gpt-'):
            model['name'] = mid.upper().replace('-', ' ').replace('GPT ', 'GPT-')
        elif mid.startswith('claude-'):
            parts = mid.split('-')
            # claude-opus-4-1-20250805 -> Claude Opus 4.1
            if len(parts) >= 3:
                variant = parts[1].title()  # opus, sonnet, haiku
                version = parts[2]
                if len(parts) > 3 and parts[3].isdigit() and len(parts[3]) == 1:
                    version = f"{parts[2]}.{parts[3]}"
                model['name'] = f"Claude {variant} {version}"
        elif mid.startswith('gemini-'):
            model['name'] = mid.replace('-', ' ').title()
        elif mid.startswith('llama'):
            model['name'] = mid.replace('-', ' ').title()
        elif mid.startswith('grok-'):
            model['name'] = mid.replace('-', ' ').title()
        elif '/' in mid:
            # moonshotai/kimi-k2-instruct-0905
            model['name'] = mid.split('/')[-1].replace('-', ' ').title()
        else:
            model['name'] = mid.replace('-', ' ').title()
        
        # 提取描述
        desc_match = re.search(r'chat([A-Za-z0-9\s\-\.]+?)Pricing', block)
        if desc_match:
            model['description'] = desc_match.group(1).strip()
        
        # 提取类型 (chat/code)
        if 'code' in block.lower() and 'coder' in mid.lower():
            model['type'] = 'code'
        else:
            model['type'] = 'chat'
        
        models.append(model)
    
    print(f"提取到 {len(models)} 个模型")
    return models


def generate_markdown(model):
    """生成模型 Markdown 文件"""
    name = model.get('name', model.get('id', 'Unknown'))
    provider = model.get('provider', 'Unknown')
    model_id = model.get('id', '')
    description = model.get('description', '')
    input_price = model.get('input_price', 'N/A')
    output_price = model.get('output_price', 'N/A')
    context_window = model.get('context_window', 'N/A')
    max_output = model.get('max_output', 'N/A')
    capabilities = model.get('capabilities', [])
    model_type = model.get('type', 'chat')
    
    md = f"""# {name}

> Provider: {provider}  
> Type: {model_type}

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


def main():
    models = parse_models()
    
    if not models:
        print("未能提取模型数据")
        return
    
    # 保存 JSON
    with open('megallm_models.json', 'w', encoding='utf-8') as f:
        json.dump(models, f, indent=2, ensure_ascii=False)
    print(f"已保存到 megallm_models.json")
    
    # 生成 Markdown 文件
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
    
    for model in models:
        name = model.get('name', model.get('id', 'unknown'))
        filename = model.get('id', name).replace('/', '-').replace(':', '-')
        filepath = f"{OUTPUT_DIR}/{filename}.md"
        
        md_content = generate_markdown(model)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(md_content)
        print(f"  ✓ {name}")
    
    # 生成索引
    index_md = "# MegaLLM Models\n\n"
    index_md += f"Total: {len(models)} models\n\n"
    
    # 按 Provider 分组
    by_provider = {}
    for model in models:
        provider = model.get('provider', 'Unknown')
        if provider not in by_provider:
            by_provider[provider] = []
        by_provider[provider].append(model)
    
    index_md += "## By Provider\n\n"
    for provider in sorted(by_provider.keys()):
        index_md += f"- **{provider}**: {len(by_provider[provider])} models\n"
    
    index_md += "\n## All Models\n\n"
    index_md += "| Model | Provider | Input | Output | Context | Model ID |\n"
    index_md += "|-------|----------|-------|--------|---------|----------|\n"
    
    for model in models:
        name = model.get('name', '')
        provider = model.get('provider', '')
        model_id = model.get('id', '')
        input_price = model.get('input_price', 'N/A')
        output_price = model.get('output_price', 'N/A')
        context = model.get('context_window', 'N/A')
        filename = model_id.replace('/', '-').replace(':', '-')
        index_md += f"| [{name}]({filename}.md) | {provider} | {input_price} | {output_price} | {context} | `{model_id}` |\n"
    
    with open(f"{OUTPUT_DIR}/README.md", 'w', encoding='utf-8') as f:
        f.write(index_md)
    
    print(f"\n✅ 完成: {len(models)} 个模型")


if __name__ == "__main__":
    main()
