# Потоковая передача

> Потоковая передача завершений чата в реальном времени для более интерактивного пользовательского опыта. Идеально для чат-ботов, живых ассистентов и отзывчивых приложений.

<Info>
  **Server-Sent Events (SSE)**: Потоковая передача использует формат SSE с типом контента `text/event-stream`.
</Info>

## Как работает потоковая передача

<Steps>
  <Step title="Включение потоковой передачи">
    Установите `stream: true` в вашем запросе для получения инкрементных ответов.
  </Step>

  <Step title="Получение фрагментов">
    Получайте токены ответа по мере их генерации, не дожидаясь завершения.
  </Step>

  <Step title="Обработка событий">
    Обрабатывайте события `data:` содержащие JSON-фрагменты до сигнала `[DONE]`.
  </Step>
</Steps>

## Примеры реализации

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    # Создание потокового завершения
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "Write a haiku about programming"}
        ],
        stream=True
    )

    # Обработка потока
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="")
    ```

    ### С асинхронной поддержкой

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

    ### Реализация для браузера

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
                // Обработка ошибок парсинга
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
    # Потоковая передача с curl и построчная обработка
    curl -N https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $GITHUB_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Tell me a joke"}],
        "stream": true
      }' | while read -r line; do
        if [[ $line == data:* ]]; then
          # Извлечение JSON из строки data
          json="${line:6}"
          if [[ $json != "[DONE]" ]]; then
            # Парсинг и отображение контента (требуется jq)
            echo -n $(echo "$json" | jq -r '.choices[0].delta.content // ""')
          fi
        fi
      done
    ```
  </Tab>
</Tabs>

## Формат событий потока

### События Delta

Каждый фрагмент потока следует этому формату:

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

### Жизненный цикл потока

1. **Начальный фрагмент** - Содержит роль, но не контент:

```json  theme={null}
data: {"choices": [{"delta": {"role": "assistant"}}]}
```

2. **Фрагменты контента** - Инкрементный текст:

```json  theme={null}
data: {"choices": [{"delta": {"content": "Hello, "}}]}
data: {"choices": [{"delta": {"content": "how "}}]}
data: {"choices": [{"delta": {"content": "are "}}]}
data: {"choices": [{"delta": {"content": "you?"}}]}
```

3. **Финальный фрагмент** - Включает finish\_reason:

```json  theme={null}
data: {"choices": [{"delta": {}, "finish_reason": "stop"}]}
```

4. **Сигнал окончания потока**:

```
data: [DONE]
```

## Расширенные возможности потоковой передачи

### Вызов функций в потоках

Потоковая передача вызовов функций по мере их генерации:

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

### Отслеживание прогресса

```python  theme={null}
class StreamProgress:
    def __init__(self):
        self.tokens = 0
        self.chunks = 0
        self.start_time = time.time()

    def update(self, chunk):
        self.chunks += 1
        if chunk.choices[0].delta.content:
            # Приблизительный подсчет токенов
            self.tokens += len(chunk.choices[0].delta.content.split())

    def get_stats(self):
        elapsed = time.time() - self.start_time
        return {
            "chunks": self.chunks,
            "tokens": self.tokens,
            "time": elapsed,
            "tokens_per_second": self.tokens / elapsed if elapsed > 0 else 0
        }

# Использование
progress = StreamProgress()

for chunk in stream:
    progress.update(chunk)
    # Обработка фрагмента...

print(progress.get_stats())
```

## Обработка ошибок в потоках

<Warning>
  Потоковые соединения могут прерываться в середине потока. Всегда реализуйте правильную обработку ошибок.
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

            return  # Успех

        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt  # Экспоненциальная задержка
                print(f"Stream interrupted, retrying in {wait_time}s...")
                time.sleep(wait_time)
                # Добавить частичный ответ для продолжения
                messages.append({"role": "assistant", "content": full_response})
                messages.append({"role": "user", "content": "continue"})
            else:
                raise e
```

## Оптимизация производительности

### Стратегия буферизации

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

// Использование
const buffer = new StreamBuffer((text) => {
  document.getElementById('output').innerHTML += text;
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  buffer.add(content);
}
buffer.flush(); // Финальная очистка буфера
```

## Сценарии использования

### Интерфейс живого чата

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
        print()  # Новая строка после ответа
```

### Перевод в реальном времени

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

## Лучшие практики

1. **Обрабатывайте прерывания соединений** - Реализуйте логику повторных попыток с экспоненциальной задержкой
2. **Буферизация для обновлений UI** - Не обновляйте DOM для каждого фрагмента, чтобы избежать проблем с производительностью
3. **Показывайте индикаторы загрузки** - Отображайте индикаторы печати или прогресс-бары
4. **Реализуйте таймауты** - Установите разумные таймауты для потоковых соединений
5. **Очищайте ресурсы** - Всегда правильно закрывайте потоки, чтобы избежать утечек памяти

## Следующие шаги

* Реализуйте [вызов функций](/ru/dev-docs/openai/function-calling) с потоковой передачей
* Узнайте о [структурированном выводе](/ru/openai/structured-output) для валидированных ответов
* Изучите [эмбеддинги](/ru/openai/embeddings) для семантического поиска


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt