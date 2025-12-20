# OpenAI API

> MegaLLM provides full compatibility with OpenAI's API format, allowing you to use existing OpenAI SDKs and tools seamlessly.

<Info>
  **Base URL**: `https://ai.megallm.io/v1` for all OpenAI-compatible endpoints
</Info>

## Available Endpoints

<CardGroup cols={2}>
  <Card title="Chat Completions" icon="messages" href="/en/dev-docs/openai/chat-completions">
    Generate conversational responses with GPT models
  </Card>

  <Card title="Streaming" icon="stream" href="/en/dev-docs/openai/streaming">
    Real-time streaming responses with Server-Sent Events
  </Card>

  <Card title="Function Calling" icon="function" href="/en/dev-docs/openai/function-calling">
    Execute functions and tools with parallel support
  </Card>

  <Card title="Models" icon="list" href="/en/home/models">
    Browse available models and capabilities
  </Card>
</CardGroup>

## Quick Example

```python  theme={null}
from openai import OpenAI

# Initialize client
client = OpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key="your-api-key"
)

# Simple chat completion
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing in simple terms."}
    ],
    temperature=0.7,
    max_tokens=150
)

print(response.choices[0].message.content)
```

## Supported Models

| Model           | Context Window | Use Case                          |
| --------------- | -------------- | --------------------------------- |
| `gpt-4`         | 8,192 tokens   | Complex reasoning, analysis       |
| `gpt-4-32k`     | 32,768 tokens  | Long documents, extensive context |
| `gpt-4-turbo`   | 128,000 tokens | Large-scale processing            |
| `gpt-3.5-turbo` | 16,385 tokens  | Fast, cost-effective responses    |

## Features

### Full Compatibility

Drop-in replacement for OpenAI API - use your existing code without changes.

### High Performance

Fast response times with optimized infrastructure.

### Usage Tracking

Monitor your API usage and costs.

## SDK Support

MegaLLM works with all OpenAI-compatible SDKs:

* **Python**: `openai` official SDK
* **Node.js**: `openai` official SDK
* **Go**: `go-openai`
* **Rust**: `async-openai`
* **Java**: `openai-java`
* **C#**: `OpenAI-DotNet`

## Rate Limits

| Tier       | Requests/min | Tokens/min |
| ---------- | ------------ | ---------- |
| Basic      | 60           | 90,000     |
| Pro        | 300          | 450,000    |
| Enterprise | Custom       | Custom     |

## Migration Guide

Migrating from OpenAI to MegaLLM is simple:

```python  theme={null}
# Before (OpenAI)
client = OpenAI(api_key="sk-...")

# After (MegaLLM)
client = OpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key="your-api-key"
)
```

That's it! All your existing code continues to work.

## Error Handling

MegaLLM returns OpenAI-compatible error responses:

```json  theme={null}
{
  "error": {
    "message": "Invalid request parameter",
    "type": "invalid_request_error",
    "param": "temperature",
    "code": null
  }
}
```

<Tip>
  **Pro Tip**: Enable debug mode with `X-Debug: true` header to get detailed error information during development.
</Tip>

## Next Steps

* Explore [Chat Completions](/dev-docs/openai/chat-completions) for conversational AI
* Learn about [Function Calling](/dev-docs/openai/function-calling) for tool integration
* Implement [Streaming](/dev-docs/openai/streaming) for real-time responses


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt