# Streaming

> Stream chat completions in real-time for a more interactive user experience. Perfect for chatbots, live assistants, and responsive applications.

<Info>
  **Server-Sent Events (SSE)**: Streaming uses SSE format with `text/event-stream` content type.
</Info>

## How Streaming Works

<Steps>
  <Step title="Enable Streaming">
    Set `stream: true` in your request to receive incremental responses.
  </Step>

  <Step title="Receive Chunks">
    Get response tokens as they're generated, not waiting for completion.
  </Step>

  <Step title="Handle Events">
    Process `data:` events containing JSON chunks until `[DONE]` signal.
  </Step>
</Steps>

## Implementation Examples

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    # Create a streaming completion
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "Write a haiku about programming"}
        ],
        stream=True
    )

    # Process the stream
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="")
    ```

    ### With Async Support

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
      apiKey: process.env.GITHUB_TOKEN,
    });

    async function streamChat() {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Write a haiku about programming' }],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        process.stdout.write(content);
      }
    }

    streamChat();
    ```

    ### Browser Implementation

    ```javascript  theme={null}
    async function streamChatInBrowser() {
      const response = await fetch('https://ai.megallm.io/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: 'Hello!' }],
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
              document.getElementById('output').innerHTML += content;
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      }
    }
    ```
  </Tab>

  <Tab title="React">
    ```jsx  theme={null}
    import { useState, useCallback } from 'react';

    function StreamingChat() {
      const [messages, setMessages] = useState([]);
      const [streaming, setStreaming] = useState(false);
      const [currentResponse, setCurrentResponse] = useState('');

      const sendMessage = useCallback(async (content) => {
        setStreaming(true);
        setCurrentResponse('');

        const response = await fetch('https://ai.megallm.io/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
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
                // Handle parsing errors
              }
            }
          }
        }
      }, [messages]);

      return (
        <div>
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
          {streaming && (
            <div className="message assistant">
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
    # Stream with curl and process line by line
    curl -N https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $GITHUB_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Tell me a joke"}],
        "stream": true
      }' | while read -r line; do
        if [[ $line == data:* ]]; then
          # Extract JSON from the data line
          json="${line:6}"
          if [[ $json != "[DONE]" ]]; then
            # Parse and display content (requires jq)
            echo -n $(echo "$json" | jq -r '.choices[0].delta.content // ""')
          fi
        fi
      done
    ```
  </Tab>
</Tabs>

## Stream Event Format

### Delta Events

Each streaming chunk follows this format:

```json  theme={null}
data: {
  "id": "chatcmpl-abc123",
  "object": "chat.completion.chunk",
  "created": 1677858242,
  "model": "gpt-4",
  "choices": [
    {
      "index": 0,
      "delta": {
        "content": "Hello"
      },
      "finish_reason": null
    }
  ]
}
```

### Stream Lifecycle

1. **Initial chunk** - Contains role but no content:

```json  theme={null}
data: {"choices": [{"delta": {"role": "assistant"}}]}
```

2. **Content chunks** - Incremental text:

```json  theme={null}
data: {"choices": [{"delta": {"content": "Hello, "}}]}
data: {"choices": [{"delta": {"content": "how "}}]}
data: {"choices": [{"delta": {"content": "are "}}]}
data: {"choices": [{"delta": {"content": "you?"}}]}
```

3. **Final chunk** - Includes finish\_reason:

```json  theme={null}
data: {"choices": [{"delta": {}, "finish_reason": "stop"}]}
```

4. **Stream end signal**:

```
data: [DONE]
```

## Advanced Streaming Features

### Function Calling in Streams

Stream function calls as they're generated:

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
        print(delta.content, end="")
```

### Progress Tracking

```python  theme={null}
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

# Usage
progress = StreamProgress()

for chunk in stream:
    progress.update(chunk)
    # Process chunk...

print(progress.get_stats())
```

## Error Handling in Streams

<Warning>
  Streaming connections can fail mid-stream. Always implement proper error handling.
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
                # Append partial response to continue
                messages.append({"role": "assistant", "content": full_response})
                messages.append({"role": "user", "content": "continue"})
            else:
                raise e
```

## Performance Optimization

### Buffering Strategy

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

## Use Cases

### Live Chat Interface

```python  theme={null}
def chat_interface():
    print("Chat started. Type 'exit' to quit.")

    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == 'exit':
            break

        print("Assistant: ", end="")
        stream = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": user_input}],
            stream=True
        )

        for chunk in stream:
            if chunk.choices[0].delta.content:
                print(chunk.choices[0].delta.content, end="", flush=True)
        print()  # New line after response
```

### Real-time Translation

```python  theme={null}
def streaming_translator(text, target_language="Spanish"):
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"Translate to {target_language}. Output only the translation."},
            {"role": "user", "content": text}
        ],
        stream=True,
        temperature=0.3
    )

    translation = ""
    for chunk in stream:
        if chunk.choices[0].delta.content:
            translation += chunk.choices[0].delta.content
            yield chunk.choices[0].delta.content

    return translation
```

## Best Practices

1. **Handle connection interruptions** - Implement retry logic with exponential backoff
2. **Buffer for UI updates** - Don't update DOM for every chunk to avoid performance issues
3. **Show loading indicators** - Display typing indicators or progress bars
4. **Implement timeouts** - Set reasonable timeouts for streaming connections
5. **Clean up resources** - Always close streams properly to avoid memory leaks

## Next Steps

* Implement [Function Calling](/openai/function-calling) with streaming
* Learn about [Structured Output](/openai/structured-output) for validated responses
* Explore [Embeddings](/openai/embeddings) for semantic search


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt