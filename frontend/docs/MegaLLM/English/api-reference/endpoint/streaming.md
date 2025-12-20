# Streaming

> Stream AI responses in real-time using Server-Sent Events (SSE) for improved user experience in interactive applications.

## Overview

Streaming allows you to receive response tokens as they're generated, rather than waiting for the complete response. This is perfect for:

* **Chatbots** - Display responses as they're typed
* **Live assistants** - Show progress in real-time
* **Long responses** - Start displaying content immediately
* **Better UX** - Reduce perceived latency

## How It Works

<Steps>
  <Step title="Enable Streaming">
    Set `stream: true` in your request
  </Step>

  <Step title="Receive Chunks">
    Get response tokens incrementally via SSE
  </Step>

  <Step title="Process Events">
    Parse `data:` events containing JSON chunks
  </Step>

  <Step title="Handle Completion">
    Watch for `[DONE]` signal to know when complete
  </Step>
</Steps>

## Endpoints

Streaming works with both API formats:

```
POST https://ai.megallm.io/v1/chat/completions
POST https://ai.megallm.io/v1/messages
```

Both endpoints support the `stream: true` parameter.

## Request Format

### OpenAI Format

```json  theme={null}
{
  "model": "gpt-4",
  "messages": [
    {"role": "user", "content": "Tell me a story"}
  ],
  "stream": true
}
```

### Anthropic Format

```json  theme={null}
{
  "model": "claude-3.5-sonnet",
  "max_tokens": 500,
  "messages": [
    {"role": "user", "content": "Tell me a story"}
  ],
  "stream": true
}
```

## Response Format

### Event Stream Structure

Responses are sent as Server-Sent Events:

```
data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","created":1677858242,"model":"gpt-4","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","created":1677858242,"model":"gpt-4","choices":[{"index":0,"delta":{"content":"Once"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","created":1677858242,"model":"gpt-4","choices":[{"index":0,"delta":{"content":" upon"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","created":1677858242,"model":"gpt-4","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

### Stream Lifecycle

1. **Initial chunk** - Contains role:

```json  theme={null}
{"choices": [{"delta": {"role": "assistant"}}]}
```

2. **Content chunks** - Incremental text:

```json  theme={null}
{"choices": [{"delta": {"content": "Hello"}}]}
{"choices": [{"delta": {"content": " world"}}]}
```

3. **Final chunk** - Includes finish\_reason:

```json  theme={null}
{"choices": [{"delta": {}, "finish_reason": "stop"}]}
```

4. **Stream end**:

```
data: [DONE]
```

## Implementation Examples

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    # Create streaming completion
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "Tell me a story"}
        ],
        stream=True
    )

    # Process the stream
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="", flush=True)
    ```

    ### Async Python

    ```python  theme={null}
    import asyncio
    from openai import AsyncOpenAI

    client = AsyncOpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    async def stream_chat():
        stream = await client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": "Tell me a story"}],
            stream=True
        )

        async for chunk in stream:
            if chunk.choices[0].delta.content:
                print(chunk.choices[0].delta.content, end="", flush=True)

    asyncio.run(stream_chat())
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';

    const openai = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY,
    });

    async function streamChat() {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Tell me a story' }],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        process.stdout.write(content);
      }
    }

    streamChat();
    ```
  </Tab>

  <Tab title="Browser">
    ```javascript  theme={null}
    async function streamChatInBrowser() {
      const response = await fetch('https://ai.megallm.io/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: 'Tell me a story' }],
          stream: true,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const json = JSON.parse(data);
              const content = json.choices[0]?.delta?.content || '';
              // Display content to user
              document.getElementById('output').innerHTML += content;
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }
    }
    ```
  </Tab>

  <Tab title="React">
    ```jsx  theme={null}
    import { useState } from 'react';

    function StreamingChat() {
      const [messages, setMessages] = useState([]);
      const [streaming, setStreaming] = useState(false);
      const [currentResponse, setCurrentResponse] = useState('');

      const sendMessage = async (content) => {
        setStreaming(true);
        setCurrentResponse('');

        const response = await fetch('https://ai.megallm.io/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [...messages, { role: 'user', content }],
            stream: true,
          }),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                setMessages(prev => [...prev,
                  { role: 'user', content },
                  { role: 'assistant', content: accumulated }
                ]);
                setStreaming(false);
                return;
              }

              try {
                const json = JSON.parse(data);
                const content = json.choices[0]?.delta?.content || '';
                accumulated += content;
                setCurrentResponse(accumulated);
              } catch (e) {
                // Handle parse errors
              }
            }
          }
        }
      };

      return (
        <div>
          {messages.map((msg, i) => (
            <div key={i} className={msg.role}>
              {msg.content}
            </div>
          ))}
          {streaming && (
            <div className="assistant">
              {currentResponse}
              <span className="cursor">▊</span>
            </div>
          )}
        </div>
      );
    }
    ```
  </Tab>

  <Tab title="cURL">
    ```bash  theme={null}
    curl -N https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Tell me a story"}],
        "stream": true
      }'
    ```

    Process with jq:

    ```bash  theme={null}
    curl -N https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Tell me a joke"}],
        "stream": true
      }' | while read -r line; do
        if [[ $line == data:* ]]; then
          json="${line:6}"
          if [[ $json != "[DONE]" ]]; then
            echo -n $(echo "$json" | jq -r '.choices[0].delta.content // ""')
          fi
        fi
      done
    ```
  </Tab>
</Tabs>

## Advanced Features

### Function Calling with Streaming

```python  theme={null}
stream = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    stream=True
)

function_call = {"name": "", "arguments": ""}

for chunk in stream:
    delta = chunk.choices[0].delta

    if delta.tool_calls:
        tool_call = delta.tool_calls[0]
        if tool_call.function.name:
            function_call["name"] = tool_call.function.name
        if tool_call.function.arguments:
            function_call["arguments"] += tool_call.function.arguments

    elif delta.content:
        print(delta.content, end="", flush=True)

# Execute function when complete
if function_call["name"]:
    result = execute_function(function_call)
```

### Progress Tracking

```python  theme={null}
import time

class StreamProgress:
    def __init__(self):
        self.tokens = 0
        self.chunks = 0
        self.start_time = time.time()

    def update(self, chunk):
        self.chunks += 1
        if chunk.choices[0].delta.content:
            # Approximate token count
            self.tokens += len(chunk.choices[0].delta.content.split())

    def get_stats(self):
        elapsed = time.time() - self.start_time
        return {
            "chunks": self.chunks,
            "tokens": self.tokens,
            "time": elapsed,
            "tokens_per_second": self.tokens / elapsed if elapsed > 0 else 0
        }

progress = StreamProgress()

for chunk in stream:
    progress.update(chunk)
    # Process chunk...

print(f"\nStats: {progress.get_stats()}")
```

### Buffering for Performance

```javascript  theme={null}
class StreamBuffer {
  constructor(onFlush, bufferSize = 10, flushInterval = 100) {
    this.buffer = [];
    this.onFlush = onFlush;
    this.bufferSize = bufferSize;
    this.flushInterval = flushInterval;
    this.timer = null;
  }

  add(chunk) {
    this.buffer.push(chunk);

    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  flush() {
    if (this.buffer.length > 0) {
      this.onFlush(this.buffer.join(''));
      this.buffer = [];
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

// Usage
const buffer = new StreamBuffer((text) => {
  document.getElementById('output').innerHTML += text;
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  buffer.add(content);
}
buffer.flush(); // Final flush
```

## Error Handling

<Warning>
  Streaming connections can fail mid-stream. Always implement retry logic.
</Warning>

```python  theme={null}
import time

def stream_with_retry(client, messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            stream = client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                stream=True
            )

            full_response = ""
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield content

            return  # Success

        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt  # Exponential backoff
                print(f"Stream interrupted, retrying in {wait_time}s...")
                time.sleep(wait_time)
                # Continue from partial response
                messages.append({"role": "assistant", "content": full_response})
                messages.append({"role": "user", "content": "continue"})
            else:
                raise e
```

## Best Practices

1. **Buffer for UI updates** - Don't update DOM for every chunk (batching improves performance)
2. **Show loading indicators** - Display typing indicators during streaming
3. **Implement timeouts** - Set reasonable timeouts for connections
4. **Handle interruptions** - Use retry logic with exponential backoff
5. **Clean up resources** - Always close streams properly
6. **Test error scenarios** - Ensure your app handles network failures gracefully

## Performance Tips

<Tip>
  Buffer small chunks together before updating the UI to avoid excessive DOM updates.
</Tip>

* Use `flush=True` in Python's print for immediate output
* Implement debouncing for frequent UI updates
* Consider virtualization for long responses
* Use Web Workers for parsing in browsers
* Monitor memory usage for long streams

## Related

* [Chat Completions API](/api-reference/post-chat-completions) - OpenAI-compatible streaming API
* [Messages API](/api-reference/post-v1-messages) - Anthropic-compatible streaming API
* [Function Calling](/api-reference/endpoint/function-calling) - Using functions with streaming
* [Authentication](/dev-docs/getting-started/authentication) - API authentication methods


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt