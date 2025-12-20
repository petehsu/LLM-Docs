# MegaLLM Documentation

> Welcome to MegaLLM - the universal AI platform that connects 70+ large language models through a single, powerful API.

<Info>
  **One API, Unlimited Possibilities**: Access GPT-5, Claude Opus 4.1, Gemini 2.5 Pro, and more models without juggling multiple providers.
</Info>

## What is MegaLLM?

MegaLLM is your **"super-API"** for AI. Instead of integrating with OpenAI, Anthropic, Google, and other providers separately, you get access to all their models through one unified interface.

### Why MegaLLM?

* **Instant Model Switching**: Change models with one parameter
* **Automatic Fallbacks**: Never go down when one model fails
* **Unified Billing**: One invoice for all your AI usage
* **Zero Integration Overhead**: Drop-in replacement for existing code

## Quick Start

<CardGroup cols={2}>
  <Card title="Models Catalog" icon="grid-2-plus" href="/en/home/models">
    Browse 70+ AI models with pricing and capabilities
  </Card>

  <Card title="Quick Start" icon="rocket-launch" href="/en/dev-docs/getting-started/quick-start">
    Get your API key and make your first request
  </Card>

  <Card title="OpenAI API" icon="brackets-curly" href="/en/dev-docs/openai/overview">
    Use OpenAI-compatible endpoints with any model
  </Card>

  <Card title="Anthropic API" icon="comments" href="/en/dev-docs/anthropic/overview">
    Access Claude models with Anthropic format
  </Card>
</CardGroup>

## Core Features

<CardGroup cols={3}>
  <Card title="Automatic Fallback" icon="arrows-rotate" href="/en/home/faq">
    Ensure high availability with intelligent model switching
  </Card>

  <Card title="Authentication" icon="shield-halved" href="/en/dev-docs/getting-started/authentication">
    Simple API key management and security
  </Card>

  <Card title="FAQ" icon="circle-info" href="/en/home/faq">
    Frequently asked questions and troubleshooting
  </Card>
</CardGroup>

## Who Uses MegaLLM?

### Developers

* Experiment with different models without rewriting code
* Reduce integration complexity from weeks to minutes
* Build more robust applications with automatic fallbacks

### Businesses

* Ensure high availability for customer-facing AI features
* Optimize costs across multiple model providers
* Future-proof AI investments with provider flexibility

### Researchers

* Access cutting-edge models as they're released
* Run comprehensive evaluations and benchmarks
* Test model performance across different tasks

## Example: Switching Models

```python  theme={null}
from openai import OpenAI

client = OpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key="your-api-key"
)

# Try GPT-5 for complex reasoning
response = client.chat.completions.create(
    model="gpt-5",
    messages=[{"role": "user", "content": "Analyze this data..."}]
)

# Switch to Claude for analysis
response = client.chat.completions.create(
    model="claude-3.7-sonnet",
    messages=[{"role": "user", "content": "Analyze this data..."}]
)

# Use Claude for creative writing
response = client.chat.completions.create(
    model="claude-opus-4-1-20250805",
    messages=[{"role": "user", "content": "Write a story about..."}]
)
```

## Popular Model Combinations

| Use Case             | Primary Model            | Fallback Models                  | Why                  |
| -------------------- | ------------------------ | -------------------------------- | -------------------- |
| **Chatbots**         | gpt-4o-mini              | gpt-3.5-turbo, claude-3.5-sonnet | Fast, cost-effective |
| **Code Generation**  | gpt-5                    | claude-3.7-sonnet, gpt-4o        | Specialized for code |
| **Analysis**         | claude-opus-4-1-20250805 | gpt-5, gemini-2.5-pro            | Best reasoning       |
| **Creative Writing** | claude-opus-4-1-20250805 | gpt-5, claude-sonnet-4           | Creative excellence  |

## Getting Started

<Tip>
  **Ready to get started?** Head to our [Quick Start guide](/dev-docs/getting-started/quick-start) to make your first API call in minutes.
</Tip>

### 3-Step Setup

1. **Get API Key**: Sign up and get your MegaLLM API key
2. **Choose Format**: Use OpenAI or Anthropic API format
3. **Start Building**: Make your first request to any of 70+ models

## Need Help?

* **Browse our guides**: Comprehensive documentation for every feature
* **Check the FAQ**: Common questions and solutions
* **Contact support**: [support@megallm.io](mailto:support@megallm.io) for technical assistance
* **Use search**: Press Cmd+K to search all documentation


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt