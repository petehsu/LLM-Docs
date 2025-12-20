# Anthropic API

> MegaLLM provides full compatibility with Anthropic's Claude API format, enabling you to use Claude models through our infrastructure.

<Info>
  **Base URL**: `https://ai.megallm.io` for all Anthropic-compatible endpoints
</Info>

## Available Endpoints

<CardGroup cols={2}>
  <Card title="Messages" icon="message" href="/en/dev-docs/anthropic/messages">
    Create conversational messages with Claude models
  </Card>

  <Card title="Function Calling" icon="wrench" href="/en/api-reference/endpoint/function-calling">
    Enable Claude to interact with external tools and functions
  </Card>
</CardGroup>

## Quick Example

```python  theme={null}
from anthropic import Anthropic

# Initialize client
client = Anthropic(
    base_url="https://ai.megallm.io",
    api_key="your-api-key"
)

# Create a message
message = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Explain the theory of relativity in simple terms"
        }
    ]
)

print(message.content[0].text)
```

## Supported Models

| Model ID                   | Context Window | Use Case                   |
| -------------------------- | -------------- | -------------------------- |
| `claude-opus-4-1-20250805` | 200K tokens    | Complex analysis, research |
| `claude-3.5-sonnet`        | 200K tokens    | Balanced performance       |
| `claude-3.7-sonnet`        | 200K tokens    | Fast, efficient responses  |
| `claude-sonnet-4`          | 200K tokens    | Advanced generation        |

## Features

### Advanced Reasoning

Claude's sophisticated reasoning capabilities for complex tasks.

### Large Context Window

Process up to 200K tokens for extensive document analysis.

### Tool Use

Native support for function calling and tool integration.

### Vision Capabilities

Analyze images and visual content alongside text.

## SDK Support

MegaLLM works with Anthropic-compatible SDKs:

* **Python**: `anthropic` official SDK
* **TypeScript/JavaScript**: `@anthropic-ai/sdk`
* **Go**: Community SDKs
* **Ruby**: `anthropic-rb`

## Key Differences from OpenAI

### Message Format

Anthropic uses a slightly different message format:

```python  theme={null}
# Anthropic format
messages = [
    {
        "role": "user",
        "content": "Hello, Claude!"
    }
]

# System messages are separate
system = "You are a helpful assistant"

message = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=100,
    system=system,  # System prompt is separate
    messages=messages
)
```

### Response Format

```python  theme={null}
# Anthropic response structure
response = {
    "id": "msg_123",
    "type": "message",
    "role": "assistant",
    "content": [
        {
            "type": "text",
            "text": "Hello! How can I help you today?"
        }
    ],
    "model": "claude-3.5-sonnet",
    "usage": {
        "input_tokens": 10,
        "output_tokens": 25
    }
}
```

### Tool Use Format

```python  theme={null}
tools = [
    {
        "name": "get_weather",
        "description": "Get weather for a location",
        "input_schema": {  # Note: input_schema, not parameters
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City name"
                }
            },
            "required": ["location"]
        }
    }
]
```

## Migration Guide

Migrating from Anthropic to MegaLLM:

```python  theme={null}
# Before (Anthropic Cloud)
client = Anthropic(api_key="sk-ant-...")

# After (MegaLLM)
client = Anthropic(
    base_url="https://ai.megallm.io",
    api_key="your-api-key"
)
```

All your existing Anthropic code continues to work!

## Authentication

Use the `x-api-key` header for Anthropic format:

```bash  theme={null}
curl https://ai.megallm.io/v1/messages \
  -H "x-api-key: $MEGALLM_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3.5-sonnet",
    "max_tokens": 100,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

## Rate Limits

| Tier       | Requests/min | Tokens/min | Concurrent |
| ---------- | ------------ | ---------- | ---------- |
| Basic      | 50           | 100,000    | 10         |
| Pro        | 200          | 400,000    | 40         |
| Enterprise | Custom       | Custom     | Custom     |

## Error Handling

MegaLLM returns Anthropic-compatible error responses:

```json  theme={null}
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## Advanced Features

### Conversation History

Maintain context across multiple turns:

```python  theme={null}
conversation = []

def chat(user_input):
    conversation.append({"role": "user", "content": user_input})

    response = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=150,
        messages=conversation
    )

    assistant_message = response.content[0].text
    conversation.append({"role": "assistant", "content": assistant_message})

    return assistant_message

# Usage
print(chat("What's the capital of France?"))
print(chat("What's its population?"))  # Knows "its" refers to Paris
```

### Temperature and Sampling

Control response creativity:

```python  theme={null}
# More deterministic
response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=100,
    temperature=0.0,  # Very consistent
    messages=messages
)

# More creative
response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=100,
    temperature=1.0,  # More varied
    top_p=0.95,       # Nucleus sampling
    messages=messages
)
```

## Use Cases

### Document Analysis

```python  theme={null}
def analyze_document(document_text):
    response = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=500,
        system="You are a document analysis expert.",
        messages=[
            {
                "role": "user",
                "content": f"""Analyze this document and provide:
                1. Main topics
                2. Key insights
                3. Summary

                Document: {document_text}"""
            }
        ]
    )
    return response.content[0].text
```

### Code Review

````python  theme={null}
def review_code(code):
    response = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=800,
        system="You are an expert code reviewer.",
        messages=[
            {
                "role": "user",
                "content": f"""Review this code for:
                - Bugs
                - Performance issues
                - Best practices
                - Security concerns

                Code:
                ```python
                {code}
                ```"""
            }
        ]
    )
    return response.content[0].text
````

<Tip>
  **Pro Tip**: Claude excels at tasks requiring careful reasoning, long context understanding, and nuanced responses.
</Tip>

## Best Practices

1. **Use System Prompts**: Claude responds well to clear system instructions
2. **Leverage Context Window**: Take advantage of the 200K token context for large documents
3. **Structured Prompts**: Use clear formatting and numbered lists for complex requests
4. **Temperature Settings**: Use lower temperatures (0-0.3) for factual tasks
5. **Model Selection**: Choose Opus for complex reasoning, Sonnet for balance, Haiku for speed

## Next Steps

* Explore [Messages API](/dev-docs/anthropic/messages) for conversational AI
* Learn about [Function Calling](/api-reference/endpoint/function-calling) for tool use
* Implement [Streaming](/api-reference/endpoint/streaming) for real-time responses


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt