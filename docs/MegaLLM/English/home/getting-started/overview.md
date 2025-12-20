# Getting Started

> Get up and running with MegaLLM in just a few minutes. Access 70+ AI models through one unified API.

## Quick Navigation

<CardGroup cols={2}>
  <Card title="Quick Start" icon="bolt-lightning" href="/en/home/getting-started/quick-start">
    Make your first API call in 2 minutes
  </Card>

  <Card title="Setup Guide" icon="screwdriver-wrench" href="/en/home/getting-started/setup">
    Complete setup and configuration
  </Card>

  <Card title="First Request" icon="brackets-curly" href="/en/home/getting-started/first-request">
    Your first AI request step-by-step
  </Card>

  <Card title="Next Steps" icon="arrow-right-long" href="/en/home/getting-started/next-steps">
    What to do after getting started
  </Card>
</CardGroup>

## What is MegaLLM?

MegaLLM is a universal AI platform that provides access to 70+ large language models through a single API. Instead of managing multiple API keys and integrations, you get:

* **One API** for all models
* **One bill** for all usage
* **One integration** to maintain

### Supported Models

* **OpenAI**: GPT-4, GPT-5, GPT-3.5 Turbo
* **Anthropic**: Claude Opus 4, Claude Sonnet, Claude Haiku
* **Google**: Gemini 2.5 Pro, Gemini Flash
* **Meta**: Llama 3 70B, Llama 3 8B
* **And 60+ more models!**

## Why Choose MegaLLM?

<AccordionGroup>
  <Accordion title="Universal Access">
    Access all major AI models through one API. No need to integrate with multiple providers separately.
  </Accordion>

  <Accordion title="Simple Integration">
    Drop-in replacement for OpenAI and Anthropic SDKs. Just change the base URL and you're ready to go.
  </Accordion>

  <Accordion title="Automatic Fallbacks">
    Built-in failover ensures your application keeps running even when a model is down.
  </Accordion>

  <Accordion title="Cost Optimization">
    Easily switch between models to optimize for cost, speed, or quality without code changes.
  </Accordion>

  <Accordion title="One Bill">
    Unified billing across all providers. Track usage and costs in one dashboard.
  </Accordion>
</AccordionGroup>

## 3-Step Setup

<Steps>
  <Step title="Get API Key">
    Sign up at [megallm.io](https://megallm.io) and generate your API key
  </Step>

  <Step title="Install SDK">
    Use the OpenAI or Anthropic SDK you already know

    ```bash  theme={null}
    pip install openai
    # or
    pip install anthropic
    ```
  </Step>

  <Step title="Make Request">
    Point to MegaLLM and start using any model

    ```python  theme={null}
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-megallm-api-key"
    )
    ```
  </Step>
</Steps>

## Choose Your Path

<Tabs>
  <Tab title="I'm New to AI">
    Perfect! Start here:

    1. [Quick Start Guide](/home/getting-started/quick-start) - Get your API key and make your first request
    2. [First Request Tutorial](/home/getting-started/first-request) - Step-by-step walkthrough
    3. [Browse Models](/home/models) - Explore available models
    4. [FAQ](/home/faq) - Common questions
  </Tab>

  <Tab title="I Use OpenAI">
    Great! Switching is easy:

    1. Get your MegaLLM API key
    2. Change your base URL to `https://ai.megallm.io/v1`
    3. That's it! All your code works the same

    See: [OpenAI Migration Guide](/dev-docs/openai/overview)
  </Tab>

  <Tab title="I Use Anthropic">
    Awesome! Migration is simple:

    1. Get your MegaLLM API key
    2. Change your base URL to `https://ai.megallm.io`
    3. Done! Use Claude and 70+ other models

    See: [Anthropic Migration Guide](/dev-docs/anthropic/overview)
  </Tab>

  <Tab title="I'm a Developer">
    Let's dive in:

    1. [API Reference](/api-reference/introduction) - Complete API docs
    2. [OpenAI API](/dev-docs/openai/overview) - OpenAI-compatible endpoints
    3. [Anthropic API](/dev-docs/anthropic/overview) - Anthropic-compatible endpoints
    4. [Streaming](/api-reference/endpoint/streaming) - Real-time responses
    5. [Function Calling](/api-reference/endpoint/function-calling) - Tool use
  </Tab>
</Tabs>

## Next Steps

<CardGroup cols={2}>
  <Card title="Quick Start" icon="bolt-lightning" href="/en/home/getting-started/quick-start">
    Make your first request in 2 minutes
  </Card>

  <Card title="View All Models" icon="grid-2-plus" href="/en/home/models">
    Browse 70+ available AI models
  </Card>

  <Card title="Developer Docs" icon="file-lines" href="/en/dev-docs/overview">
    Comprehensive API documentation
  </Card>

  <Card title="CLI Tool" icon="square-terminal" href="/en/cli/overview">
    Set up AI coding assistants
  </Card>
</CardGroup>

## Need Help?

* **Documentation**: Complete guides and tutorials
* **FAQ**: [Common questions](/home/faq)
* **Support**: [support@megallm.io](mailto:support@megallm.io)
* **Discord**: [Join our community](https://discord.gg/devsindia)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt