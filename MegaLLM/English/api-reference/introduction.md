# API Reference

> Welcome to the MegaLLM API reference documentation. MegaLLM provides unified access to 70+ AI models through OpenAI-compatible and Anthropic-compatible REST APIs.

## Base URLs

MegaLLM supports two API formats:

<CardGroup cols={2}>
  <Card title="OpenAI Format" icon="robot">
    ```
    https://ai.megallm.io/v1
    ```

    Compatible with OpenAI SDKs and tools
  </Card>

  <Card title="Anthropic Format" icon="message-bot">
    ```
    https://ai.megallm.io
    ```

    Compatible with Anthropic Claude SDKs
  </Card>
</CardGroup>

## Authentication

All API endpoints require authentication using one of these methods:

### Bearer Token (Recommended)

```http  theme={null}
Authorization: Bearer YOUR_API_KEY
```

### API Key Header (Anthropic Format)

```http  theme={null}
x-api-key: YOUR_API_KEY
anthropic-version: 2023-06-01
```

<Info>
  Get your API key from the [MegaLLM Dashboard](https://megallm.io/dashboard/overview).
</Info>

## Core Endpoints

<CardGroup cols={2}>
  <Card title="Chat Completions" icon="comments" href="/en/api-reference/post-chat-completions">
    OpenAI-compatible chat API with streaming, function calling, and vision support
  </Card>

  <Card title="Messages" icon="message" href="/en/api-reference/post-v1-messages">
    Anthropic-compatible API with extended thinking, tools, and prompt caching
  </Card>

  <Card title="Models" icon="list" href="/en/api-reference/get-models">
    List all 70+ AI models with capabilities, pricing, and context windows
  </Card>
</CardGroup>

## Advanced Features

<CardGroup cols={2}>
  <Card title="Streaming" icon="stream" href="/en/api-reference/endpoint/streaming">
    Real-time streaming responses with Server-Sent Events
  </Card>

  <Card title="Function Calling" icon="function" href="/en/api-reference/endpoint/function-calling">
    Enable AI to interact with external tools and APIs
  </Card>

  <Card title="Authentication Guide" icon="shield" href="/en/dev-docs/getting-started/authentication">
    Comprehensive authentication methods and security best practices
  </Card>
</CardGroup>

## Quick Start

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';

    const openai = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Hello!' }]
    });
    ```
  </Tab>

  <Tab title="cURL">
    ```bash  theme={null}
    curl https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Hello!"}]
      }'
    ```
  </Tab>
</Tabs>

## Rate Limits

Rate limits vary by plan tier:

| Tier       | Requests/min | Tokens/min | Concurrent |
| ---------- | ------------ | ---------- | ---------- |
| Basic      | 60           | 90K        | 10         |
| Pro        | 300          | 450K       | 40         |
| Enterprise | Custom       | Custom     | Custom     |

## SDK Support

MegaLLM is compatible with popular AI SDKs:

* **Python**: `openai`, `anthropic`, `langchain`
* **JavaScript/TypeScript**: `openai`, `@anthropic-ai/sdk`
* **Go**: `go-openai`
* **Ruby**: `anthropic-rb`
* **Rust**: `async-openai`
* **Java**: `openai-java`
* **C#**: `OpenAI-DotNet`

## Need Help?

<CardGroup cols={2}>
  <Card title="Developer Docs" icon="file-lines" href="/en/dev-docs/overview">
    Comprehensive guides and tutorials
  </Card>

  <Card title="Models Catalog" icon="robot" href="/en/home/models">
    Browse all 70+ available models
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt