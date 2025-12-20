# Потоковые сообщения

Узнайте, как использовать потоковую передачу для получения инкрементальных ответов от Claude с использованием server-sent events (SSE).

---

При создании сообщения вы можете установить `"stream": true` для инкрементальной потоковой передачи ответа с использованием [server-sent events](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents) (SSE).

## Потоковая передача с SDK

Наши SDK для [Python](https://github.com/anthropics/anthropic-sdk-python) и [TypeScript](https://github.com/anthropics/anthropic-sdk-typescript) предлагают несколько способов потоковой передачи. Python SDK поддерживает как синхронные, так и асинхронные потоки. Подробности смотрите в документации каждого SDK.

<CodeGroup>
    ```python Python
    import anthropic

    client = anthropic.Anthropic()

    with client.messages.stream(
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello"}],
        model="claude-sonnet-4-5",
    ) as stream:
      for text in stream.text_stream:
          print(text, end="", flush=True)
    ```

    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const client = new Anthropic();

    await client.messages.stream({
        messages: [{role: 'user', content: "Hello"}],
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
    }).on('text', (text) => {
        console.log(text);
    });
    ```
</CodeGroup>

## Типы событий

Каждое server-sent событие включает именованный тип события и связанные JSON данные. Каждое событие будет использовать имя SSE события (например, `event: message_stop`) и включать соответствующий `type` события в своих данных.

Каждый поток использует следующий поток событий:

1. `message_start`: содержит объект `Message` с пустым `content`.
2. Серия блоков контента, каждый из которых имеет `content_block_start`, одно или более событий `content_block_delta` и событие `content_block_stop`. Каждый блок контента будет иметь `index`, который соответствует его индексу в финальном массиве `content` сообщения.
3. Одно или более событий `message_delta`, указывающих на изменения верхнего уровня в финальном объекте `Message`.
4. Финальное событие `message_stop`.

  <Warning>
  Количество токенов, показанное в поле `usage` события `message_delta`, является *кумулятивным*.
  </Warning>

### Ping события

Потоки событий также могут включать любое количество событий `ping`.

### События ошибок

Мы можем иногда отправлять [ошибки](/docs/ru/api/errors) в потоке событий. Например, в периоды высокой нагрузки вы можете получить `overloaded_error`, который обычно соответствует HTTP 529 в не-потоковом контексте:

```json Example error
event: error
data: {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}}
```

### Другие события

В соответствии с нашей [политикой версионирования](/docs/ru/api/versioning), мы можем добавлять новые типы событий, и ваш код должен корректно обрабатывать неизвестные типы событий.

## Типы дельт блоков контента

Каждое событие `content_block_delta` содержит `delta` типа, который обновляет блок `content` по заданному `index`.

### Текстовая дельта

Дельта блока контента `text` выглядит так:
```json Text delta
event: content_block_delta
data: {"type": "content_block_delta","index": 0,"delta": {"type": "text_delta", "text": "ello frien"}}
```

### Дельта входного JSON

Дельты для блоков контента `tool_use` соответствуют обновлениям поля `input` блока. Для поддержки максимальной детализации дельты являются _частичными JSON строками_, тогда как финальный `tool_use.input` всегда является _объектом_.

Вы можете накапливать строковые дельты и парсить JSON после получения события `content_block_stop`, используя библиотеку типа [Pydantic](https://docs.pydantic.dev/latest/concepts/json/#partial-json-parsing) для частичного парсинга JSON, или используя наши [SDK](/docs/ru/api/client-sdks), которые предоставляют помощники для доступа к парсированным инкрементальным значениям.

Дельта блока контента `tool_use` выглядит так:
```json Input JSON delta
event: content_block_delta
data: {"type": "content_block_delta","index": 1,"delta": {"type": "input_json_delta","partial_json": "{\"location\": \"San Fra"}}}
```
Примечание: Наши текущие модели поддерживают только выдачу одного полного ключа и значения свойства из `input` за раз. Таким образом, при использовании инструментов могут быть задержки между потоковыми событиями, пока модель работает. Как только ключ и значение `input` накоплены, мы выдаем их как несколько событий `content_block_delta` с разбитым на части частичным json, чтобы формат мог автоматически поддерживать более тонкую детализацию в будущих моделях.

### Дельта размышлений

При использовании [расширенных размышлений](/docs/ru/build-with-claude/extended-thinking#streaming-thinking) с включенной потоковой передачей, вы будете получать контент размышлений через события `thinking_delta`. Эти дельты соответствуют полю `thinking` блоков контента `thinking`.

Для контента размышлений специальное событие `signature_delta` отправляется непосредственно перед событием `content_block_stop`. Эта подпись используется для проверки целостности блока размышлений.

Типичная дельта размышлений выглядит так:
```json Thinking delta
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step:\n\n1. First break down 27 * 453"}}
```

Дельта подписи выглядит так:
```json Signature delta
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}
```

## Полный HTTP потоковый ответ

Мы настоятельно рекомендуем использовать наши [клиентские SDK](/docs/ru/api/client-sdks) при использовании потокового режима. Однако, если вы создаете прямую интеграцию с API, вам нужно будет обрабатывать эти события самостоятельно.

Потоковый ответ состоит из:
1. События `message_start`
2. Потенциально нескольких блоков контента, каждый из которых содержит:
    - Событие `content_block_start`
    - Потенциально несколько событий `content_block_delta`
    - Событие `content_block_stop`
3. События `message_delta`
4. События `message_stop`

Также могут быть события `ping`, разбросанные по всему ответу. Смотрите [Типы событий](#типы-событий) для более подробной информации о формате.

### Базовый потоковый запрос

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --data \
'{
  "model": "claude-sonnet-4-5",
  "messages": [{"role": "user", "content": "Hello"}],
  "max_tokens": 256,
  "stream": true
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    messages=[{"role": "user", "content": "Hello"}],
    max_tokens=256,
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type": "message_start", "message": {"id": "msg_1nZdL29xx5MUA1yADyHTEsnR8uuvGzszyY", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5-20250929", "stop_reason": null, "stop_sequence": null, "usage": {"input_tokens": 25, "output_tokens": 1}}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "!"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence":null}, "usage": {"output_tokens": 15}}

event: message_stop
data: {"type": "message_stop"}

```

### Потоковый запрос с использованием инструментов

<Tip>
Использование инструментов теперь поддерживает детализированную потоковую передачу для значений параметров как бета-функцию. Для более подробной информации смотрите [Детализированная потоковая передача инструментов](/docs/ru/agents-and-tools/tool-use/fine-grained-tool-streaming).
</Tip>

В этом запросе мы просим Claude использовать инструмент, чтобы сообщить нам погоду.

<CodeGroup>
```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 1024,
      "tools": [
        {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              }
            },
            "required": ["location"]
          }
        }
      ],
      "tool_choice": {"type": "any"},
      "messages": [
        {
          "role": "user",
          "content": "What is the weather like in San Francisco?"
        }
      ],
      "stream": true
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    }
]

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "any"},
    messages=[
        {
            "role": "user",
            "content": "What is the weather like in San Francisco?"
        }
    ],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type":"message_start","message":{"id":"msg_014p7gG3wDgGV9EUtLvnow3U","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","stop_sequence":null,"usage":{"input_tokens":472,"output_tokens":2},"content":[],"stop_reason":null}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Okay"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" let"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"'s"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" check"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" the"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" for"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" San"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" Francisco"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" CA"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":":"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"tool_use","id":"toolu_01T1x1fJ34qAmk2tNTrN7Up6","name":"get_weather","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"location\":"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" \"San"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" Francisc"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"o,"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" CA\""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":", "}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"\"unit\": \"fah"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"renheit\"}"}}

event: content_block_stop
data: {"type":"content_block_stop","index":1}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"tool_use","stop_sequence":null},"usage":{"output_tokens":89}}

event: message_stop
data: {"type":"message_stop"}
```

### Потоковый запрос с расширенными размышлениями

В этом запросе мы включаем расширенные размышления с потоковой передачей, чтобы увидеть пошаговые рассуждения Claude.

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 20000,
    "stream": true,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 16000
    },
    "messages": [
        {
            "role": "user",
            "content": "What is 27 * 453?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 16000
    },
    messages=[
        {
            "role": "user",
            "content": "What is 27 * 453?"
        }
    ],
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5-20250929", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step:\n\n1. First break down 27 * 453"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n2. 453 = 400 + 50 + 3"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n3. 27 * 400 = 10,800"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n4. 27 * 50 = 1,350"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n5. 27 * 3 = 81"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n6. 10,800 + 1,350 + 81 = 12,231"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "27 * 453 = 12,231"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

### Потоковый запрос с использованием инструмента веб-поиска

В этом запросе мы просим Claude найти в интернете текущую информацию о погоде.

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "stream": true,
    "tools": [
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 5
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What is the weather like in New York City today?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 5
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What is the weather like in New York City today?"
        }
    ],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type":"message_start","message":{"id":"msg_01G...","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":2679,"cache_creation_input_tokens":0,"cache_read_input_tokens":0,"output_tokens":3}}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"I'll check"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" the current weather in New York City for you"}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"."}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"server_tool_use","id":"srvtoolu_014hJH82Qum7Td6UV8gDXThB","name":"web_search","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"query"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"\":"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" \"weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" NY"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"C to"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"day\"}"}}

event: content_block_stop
data: {"type":"content_block_stop","index":1 }

event: content_block_start
data: {"type":"content_block_start","index":2,"content_block":{"type":"web_search_tool_result","tool_use_id":"srvtoolu_014hJH82Qum7Td6UV8gDXThB","content":[{"type":"web_search_result","title":"Weather in New York City in May 2025 (New York) - detailed Weather Forecast for a month","url":"https://world-weather.info/forecast/usa/new_york/may-2025/","encrypted_content":"Ev0DCioIAxgCIiQ3NmU4ZmI4OC1k...","page_age":null},...]}}

event: content_block_stop
data: {"type":"content_block_stop","index":2}

event: content_block_start
data: {"type":"content_block_start","index":3,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":"Here's the current weather information for New York"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":" City:\n\n# Weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":" in New York City"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":"\n\n"}}

...

event: content_block_stop
data: {"type":"content_block_stop","index":17}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"input_tokens":10682,"cache_creation_input_tokens":0,"cache_read_input_tokens":0,"output_tokens":510,"server_tool_use":{"web_search_requests":1}}}

event: message_stop
data: {"type":"message_stop"}
```

## Восстановление после ошибок

Когда потоковый запрос прерывается из-за проблем с сетью, таймаутов или других ошибок, вы можете восстановиться, возобновив с того места, где поток был прерван. Этот подход избавляет вас от необходимости повторной обработки всего ответа.

Базовая стратегия восстановления включает:

1. **Захват частичного ответа**: Сохраните весь контент, который был успешно получен до возникновения ошибки
2. **Создание запроса продолжения**: Создайте новый API запрос, который включает частичный ответ ассистента как начало нового сообщения ассистента
3. **Возобновление потоковой передачи**: Продолжите получение остальной части ответа с того места, где он был прерван

### Лучшие практики восстановления после ошибок

1. **Используйте возможности SDK**: Используйте встроенные в SDK возможности накопления сообщений и обработки ошибок
2. **Обрабатывайте типы контента**: Помните, что сообщения могут содержать несколько блоков контента (`text`, `tool_use`, `thinking`). Блоки использования инструментов и расширенных размышлений не могут быть частично восстановлены. Вы можете возобновить потоковую передачу с самого последнего текстового блока.