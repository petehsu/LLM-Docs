# Messages

> The Messages API is the core interface for interacting with Claude models. Send messages and receive AI-generated responses with support for conversations, tool use, and vision.

## Basic Usage

<CodeGroup>
  ```python Python theme={null}
  from anthropic import Anthropic

  client = Anthropic(
      base_url="https://ai.megallm.io",
      api_key="your-api-key"
  )

  message = client.messages.create(
      model="claude-3.5-sonnet",
      max_tokens=100,
      messages=[
          {
              "role": "user",
              "content": "What are the primary colors?"
          }
      ]
  )

  print(message.content[0].text)
  ```

  ```javascript JavaScript theme={null}
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic({
    baseURL: 'https://ai.megallm.io',
    apiKey: process.env.MEGALLM_API_KEY,
  });

  const message = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: 'What are the primary colors?'
      }
    ]
  });

  console.log(message.content[0].text);
  ```

  ```bash cURL theme={null}
  curl https://ai.megallm.io/v1/messages \
    -H "x-api-key: $MEGALLM_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-3-sonnet-20240229",
      "max_tokens": 100,
      "messages": [
        {
          "role": "user",
          "content": "What are the primary colors?"
        }
      ]
    }'
  ```

  ```ruby Ruby theme={null}
  require 'anthropic'

  client = Anthropic::Client.new(
    base_url: 'https://ai.megallm.io',
    api_key: ENV['MEGALLM_API_KEY']
  )

  message = client.messages.create(
    model: 'claude-3-sonnet-20240229',
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: 'What are the primary colors?'
      }
    ]
  )

  puts message.content.first.text
  ```
</CodeGroup>

## Message Structure

### Content Types

Messages can contain different types of content:

```python  theme={null}
# Simple text message
message = {
    "role": "user",
    "content": "Hello, Claude!"
}

# Multi-part message with text and image
message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "What's in this image?"
        },
        {
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/jpeg",
                "data": "base64_encoded_image_data"
            }
        }
    ]
}
```

### System Messages

System messages set the assistant's behavior:

```python  theme={null}
message = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=200,
    system="""You are a helpful coding assistant.
    Always provide code examples when explaining concepts.
    Use Python unless specified otherwise.""",
    messages=[
        {
            "role": "user",
            "content": "Explain list comprehensions"
        }
    ]
)
```

## Advanced Features

### Multi-turn Conversations

Build context-aware conversations:

```python  theme={null}
class Conversation:
    def __init__(self, client, model="claude-3-sonnet-20240229"):
        self.client = client
        self.model = model
        self.messages = []
        self.system = "You are a helpful assistant."

    def add_user_message(self, content):
        self.messages.append({"role": "user", "content": content})

    def get_response(self, max_tokens=200):
        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            system=self.system,
            messages=self.messages
        )

        assistant_content = response.content[0].text
        self.messages.append({"role": "assistant", "content": assistant_content})

        return assistant_content

# Usage
conv = Conversation(client)
conv.system = "You are a math tutor."

print(conv.get_response("What is calculus?"))
print(conv.get_response("Can you give me an example?"))
print(conv.get_response("How is it different from algebra?"))
```

### Prefilled Responses

Guide the assistant's response format:

```python  theme={null}
messages = [
    {"role": "user", "content": "Write a haiku about programming"},
    {"role": "assistant", "content": "Here's a haiku about programming:\n\n"}  # Prefill
]

response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=50,
    messages=messages
)

# The response will continue from the prefilled content
```

### Token Counting

Estimate token usage before sending:

```python  theme={null}
def estimate_tokens(messages):
    """Rough estimation of token count"""
    total = 0
    for message in messages:
        if isinstance(message["content"], str):
            # Rough estimate: 1 token ≈ 4 characters
            total += len(message["content"]) // 4
        elif isinstance(message["content"], list):
            for part in message["content"]:
                if part["type"] == "text":
                    total += len(part["text"]) // 4
    return total

# Check before sending
token_estimate = estimate_tokens(messages)
if token_estimate > 180000:  # Leave room for response
    print("Warning: Approaching context limit")
```

## Response Handling

### Parse Response Content

```python  theme={null}
response = client.messages.create(...)

# Handle different content types
for content_block in response.content:
    if content_block.type == "text":
        print(f"Text: {content_block.text}")
    elif content_block.type == "tool_use":
        print(f"Tool call: {content_block.name}")
        print(f"Arguments: {content_block.input}")
```

### Error Handling

```python  theme={null}
from anthropic import APIError, RateLimitError, APIConnectionError

def safe_message_create(client, **kwargs):
    max_retries = 3
    retry_delay = 1

    for attempt in range(max_retries):
        try:
            return client.messages.create(**kwargs)

        except RateLimitError as e:
            if attempt < max_retries - 1:
                time.sleep(retry_delay * (2 ** attempt))
                continue
            raise e

        except APIConnectionError as e:
            print(f"Connection error: {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
                continue
            raise e

        except APIError as e:
            print(f"API error: {e}")
            raise e
```

## Common Patterns

### Structured Data Extraction

```python  theme={null}
def extract_information(text):
    response = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=300,
        system="Extract information and return as JSON.",
        messages=[
            {
                "role": "user",
                "content": f"""Extract the following from this text:
                - Names (list)
                - Dates (list)
                - Locations (list)
                - Key facts (list)

                Return as JSON.

                Text: {text}"""
            }
        ],
        temperature=0  # Consistent formatting
    )

    import json
    return json.loads(response.content[0].text)
```

### Translation

```python  theme={null}
def translate(text, target_language="Spanish"):
    response = client.messages.create(
        model="claude-3.5-sonnet",  # Fast model for translation
        max_tokens=500,
        messages=[
            {
                "role": "user",
                "content": f"Translate to {target_language}:\n\n{text}"
            }
        ],
        temperature=0.3
    )
    return response.content[0].text
```

### Summarization

```python  theme={null}
def summarize(text, style="bullet_points"):
    styles = {
        "bullet_points": "Create a bullet-point summary",
        "paragraph": "Write a concise paragraph summary",
        "executive": "Write an executive summary",
        "eli5": "Explain like I'm 5"
    }

    response = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=300,
        system="You are a professional summarizer.",
        messages=[
            {
                "role": "user",
                "content": f"{styles.get(style, styles['bullet_points'])}:\n\n{text}"
            }
        ],
        temperature=0.3
    )
    return response.content[0].text
```

## Best Practices

<Tip>
  **Token Efficiency**: Claude models have large context windows but being concise in prompts saves tokens and improves response time.
</Tip>

### 1. Clear Instructions

````python  theme={null}
# Good - Clear and specific
messages = [{
    "role": "user",
    "content": """Analyze this Python code:
    1. Identify any bugs
    2. Suggest performance improvements
    3. Rate code quality (1-10)

    Code:
    ```python
    def fibonacci(n):
        if n <= 1:
            return n
        return fibonacci(n-1) + fibonacci(n-2)
    ```"""
}]

# Less effective - Vague
messages = [{
    "role": "user",
    "content": "Look at this fibonacci function and tell me about it"
}]
````

### 2. Temperature Settings

```python  theme={null}
# Factual/analytical tasks
response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=200,
    temperature=0,  # Deterministic
    messages=messages
)

# Creative tasks
response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=200,
    temperature=0.8,  # More creative
    messages=messages
)
```

### 3. Model Selection

| Use Case         | Recommended Model | Why                  |
| ---------------- | ----------------- | -------------------- |
| Complex analysis | claude-3-opus     | Best reasoning       |
| General tasks    | claude-3-sonnet   | Balanced performance |
| High volume      | claude-3-haiku    | Fast and efficient   |
| Code generation  | claude-3-sonnet   | Good balance         |

## Rate Limiting

Implement proper rate limiting:

```python  theme={null}
from threading import Lock
from collections import deque
import time

class RateLimiter:
    def __init__(self, max_requests=50, window=60):
        self.max_requests = max_requests
        self.window = window
        self.requests = deque()
        self.lock = Lock()

    def wait_if_needed(self):
        with self.lock:
            now = time.time()
            # Remove old requests
            while self.requests and self.requests[0] < now - self.window:
                self.requests.popleft()

            if len(self.requests) >= self.max_requests:
                sleep_time = self.window - (now - self.requests[0])
                if sleep_time > 0:
                    time.sleep(sleep_time)
                    return self.wait_if_needed()

            self.requests.append(now)

# Usage
rate_limiter = RateLimiter(max_requests=50, window=60)

def create_message(**kwargs):
    rate_limiter.wait_if_needed()
    return client.messages.create(**kwargs)
```

## Next Steps

* Learn about [Tool Use](/anthropic/tool-use) for function calling
* Explore [Vision](/anthropic/vision) capabilities
* Implement [Streaming](/anthropic/streaming) for real-time responses


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt