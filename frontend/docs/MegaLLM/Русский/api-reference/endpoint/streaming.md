# Потоковая передача

> Потоковая передача ответов ИИ в реальном времени с использованием Server-Sent Events (SSE) для улучшения пользовательского опыта в интерактивных приложениях.

## Обзор

Потоковая передача позволяет получать токены ответа по мере их генерации, а не ждать полного ответа. Это идеально подходит для:

* **Чат-ботов** - Отображение ответов по мере их ввода
* **Живых ассистентов** - Показ прогресса в реальном времени
* **Длинных ответов** - Немедленное начало отображения контента
* **Лучшего UX** - Снижение воспринимаемой задержки

## Как это работает

<Steps>
  <Step title="Включение потоковой передачи">
    Установите `stream: true` в вашем запросе
  </Step>

  <Step title="Получение фрагментов">
    Получайте токены ответа постепенно через SSE
  </Step>

  <Step title="Обработка событий">
    Парсите события `data:` содержащие фрагменты JSON
  </Step>

  <Step title="Обработка завершения">
    Следите за сигналом `[DONE]`, чтобы узнать о завершении
  </Step>
</Steps>

## Конечные точки

Потоковая передача работает с обоими форматами API:

```
POST https://ai.megallm.io/v1/chat/completions
POST https://ai.megallm.io/v1/messages
```

Обе конечные точки поддерживают параметр `stream: true`.

## Формат запроса

### Формат OpenAI

```json  theme={null}
{
  "model": "gpt-4",
  "messages": [
    {"role": "user", "content": "Расскажи мне историю"}
  ],
  "stream": true
}
```

### Формат Anthropic

```json  theme={null}
{
  "model": "claude-3.5-sonnet",
  "max_tokens": 500,
  "messages": [
    {"role": "user", "content": "Расскажи мне историю"}
  ],
  "stream": true
}
```

## Формат ответа

### Структура потока событий

Ответы отправляются как Server-Sent Events:

```
data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","created":1677858242,"model":"gpt-4","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","created":1677858242,"model":"gpt-4","choices":[{"index":0,"delta":{"content":"Однажды"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","created":1677858242,"model":"gpt-4","choices":[{"index":0,"delta":{"content":" давным"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","created":1677858242,"model":"gpt-4","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

### Жизненный цикл потока

1. **Начальный фрагмент** - Содержит роль:

```json  theme={null}
{"choices": [{"delta": {"role": "assistant"}}]}
```

2. **Фрагменты контента** - Инкрементальный текст:

```json  theme={null}
{"choices": [{"delta": {"content": "Привет"}}]}
{"choices": [{"delta": {"content": " мир"}}]}
```

3. **Финальный фрагмент** - Включает finish\_reason:

```json  theme={null}
{"choices": [{"delta": {}, "finish_reason": "stop"}]}
```

4. **Завершение потока**:

```
data: [DONE]
```

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
            {"role": "user", "content": "Расскажи мне историю"}
        ],
        stream=True
    )

    # Обработка потока
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
            messages=[{"role": "user", "content": "Расскажи мне историю"}],
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
        messages: [{ role: 'user', content: 'Расскажи мне историю' }],
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
          messages: [{ role: 'user', content: 'Расскажи мне историю' }],
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
              // Отображение контента пользователю
              document.getElementById('output').innerHTML += content;
            } catch (e) {
              console.error('Ошибка парсинга:', e);
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
                // Обработка ошибок парсинга
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
        "messages": [{"role": "user", "content": "Расскажи мне историю"}],
        "stream": true
      }'
    ```

    Обработка с помощью jq:

    ```bash  theme={null}
    curl -N https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Расскажи мне шутку"}],
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

## Расширенные функции

### Вызов функций с потоковой передачей

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

# Выполнение функции при завершении
if function_call["name"]:
    result = execute_function(function_call)
```

### Отслеживание прогресса

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

progress = StreamProgress()

for chunk in stream:
    progress.update(chunk)
    # Обработка фрагмента...

print(f"\nСтатистика: {progress.get_stats()}")
```

### Буферизация для производительности

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
buffer.flush(); // Финальная очистка
```

## Обработка ошибок

<Warning>
  Потоковые соединения могут прерваться в середине потока. Всегда реализуйте логику повторных попыток.
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
                print(f"Поток прерван, повтор через {wait_time}с...")
                time.sleep(wait_time)
                # Продолжение с частичного ответа
                messages.append({"role": "assistant", "content": full_response})
                messages.append({"role": "user", "content": "продолжи"})
            else:
                raise e
```

## Лучшие практики

1. **Буферизация для обновлений UI** - Не обновляйте DOM для каждого фрагмента (пакетная обработка улучшает производительность)
2. **Показывайте индикаторы загрузки** - Отображайте индикаторы печати во время потоковой передачи
3. **Реализуйте таймауты** - Устанавливайте разумные таймауты для соединений
4. **Обрабатывайте прерывания** - Используйте логику повторных попыток с экспоненциальной задержкой
5. **Освобождайте ресурсы** - Всегда правильно закрывайте потоки
6. **Тестируйте сценарии ошибок** - Убедитесь, что ваше приложение корректно обрабатывает сбои сети

## Советы по производительности

<Tip>
  Объединяйте небольшие фрагменты перед обновлением UI, чтобы избежать избыточных обновлений DOM.
</Tip>

* Используйте `flush=True` в print Python для немедленного вывода
* Реализуйте debouncing для частых обновлений UI
* Рассмотрите виртуализацию для длинных ответов
* Используйте Web Workers для парсинга в браузерах
* Отслеживайте использование памяти для длинных потоков

## Связанное

* [API завершений чата](/ru/api-reference/post-chat-completions) - API потоковой передачи совместимое с OpenAI
* [API сообщений](/ru/api-reference/post-v1-messages) - API потоковой передачи совместимое с Anthropic
* [Вызов функций](/ru/api-reference/endpoint/function-calling) - Использование функций с потоковой передачей
* [Аутентификация](/ru/dev-docs/getting-started/authentication) - Методы аутентификации API


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt