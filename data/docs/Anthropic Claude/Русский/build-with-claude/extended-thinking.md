# Создание с расширенным мышлением

Расширенное мышление дает Claude улучшенные возможности рассуждения для сложных задач, обеспечивая различные уровни прозрачности его пошагового процесса мышления перед тем, как он предоставит окончательный ответ.

---

Расширенное мышление дает Claude улучшенные возможности рассуждения для сложных задач, обеспечивая различные уровни прозрачности его пошагового процесса мышления перед тем, как он предоставит окончательный ответ.

## Поддерживаемые модели

Расширенное мышление поддерживается в следующих моделях:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([устарела](/docs/ru/about-claude/model-deprecations))
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

<Note>
Поведение API отличается между моделями Claude Sonnet 3.7 и Claude 4, но формы API остаются абсолютно одинаковыми.

Для получения дополнительной информации см. [Различия в мышлении между версиями моделей](#differences-in-thinking-across-model-versions).
</Note>

## Как работает расширенное мышление

Когда расширенное мышление включено, Claude создает блоки содержимого `thinking`, где выводит свои внутренние рассуждения. Claude использует идеи из этих рассуждений перед тем, как создать окончательный ответ.

Ответ API будет включать блоки содержимого `thinking`, за которыми следуют блоки содержимого `text`.

Вот пример формата ответа по умолчанию:

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

Для получения дополнительной информации о формате ответа расширенного мышления см. [Справочник API Messages](/docs/ru/api/messages).

## Как использовать расширенное мышление

Вот пример использования расширенного мышления в Messages API:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 16000,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
    },
    "messages": [
        {
            "role": "user",
            "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
    }]
)

# The response will contain summarized thinking blocks and text blocks
for block in response.content:
    if block.type == "thinking":
        print(f"\nThinking summary: {block.thinking}")
    elif block.type == "text":
        print(f"\nResponse: {block.text}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "Are there an infinite number of prime numbers such that n mod 4 == 3?"
  }]
});

// The response will contain summarized thinking blocks and text blocks
for (const block of response.content) {
  if (block.type === "thinking") {
    console.log(`\nThinking summary: ${block.thinking}`);
  } else if (block.type === "text") {
    console.log(`\nResponse: ${block.text}`);
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.*;

public class SimpleThinkingExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("Are there an infinite number of prime numbers such that n mod 4 == 3?")
                        .build()
        );

        System.out.println(response);
    }
}
```

</CodeGroup>

Чтобы включить расширенное мышление, добавьте объект `thinking` с параметром `type`, установленным на `enabled`, и `budget_tokens` на указанный бюджет токенов для расширенного мышления.

Параметр `budget_tokens` определяет максимальное количество токенов, которые Claude может использовать для своего внутреннего процесса рассуждения. В моделях Claude 4 это ограничение применяется к полным токенам мышления, а не к [суммированному выводу](#summarized-thinking). Большие бюджеты могут улучшить качество ответа, позволяя более тщательный анализ сложных проблем, хотя Claude может не использовать весь выделенный бюджет, особенно при значениях выше 32k.

`budget_tokens` должен быть установлен на значение меньше, чем `max_tokens`. Однако при использовании [чередующегося мышления с инструментами](#interleaved-thinking), вы можете превысить это ограничение, так как лимит токенов становится вашим всем контекстным окном (200k токенов).

### Суммированное мышление

С включенным расширенным мышлением Messages API для моделей Claude 4 возвращает сводку полного процесса мышления Claude. Суммированное мышление обеспечивает полные преимущества интеллекта расширенного мышления, предотвращая неправомерное использование.

Вот некоторые важные соображения для суммированного мышления:

- Вам выставляется счет за полные токены мышления, созданные исходным запросом, а не за токены сводки.
- Количество выставленных токенов вывода **не совпадет** с количеством токенов, которые вы видите в ответе.
- Первые несколько строк вывода мышления более подробны, предоставляя детальные рассуждения, которые особенно полезны для целей инженерии подсказок.
- По мере того как Anthropic стремится улучшить функцию расширенного мышления, поведение суммирования может измениться.
- Суммирование сохраняет ключевые идеи процесса мышления Claude с минимальной добавленной задержкой, обеспечивая потоковый пользовательский опыт и легкую миграцию с Claude Sonnet 3.7 на модели Claude 4.
- Суммирование обрабатывается другой моделью, чем та, которую вы указываете в своих запросах. Модель мышления не видит суммированный вывод.

<Note>
Claude Sonnet 3.7 продолжает возвращать полный вывод мышления.

В редких случаях, когда вам нужен доступ к полному выводу мышления для моделей Claude 4, [свяжитесь с нашей командой продаж](mailto:sales@anthropic.com).
</Note>

### Потоковое мышление

Вы можете передавать ответы расширенного мышления, используя [события, отправляемые сервером (SSE)](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents).

Когда потоковая передача включена для расширенного мышления, вы получаете содержимое мышления через события `thinking_delta`.

Для получения дополнительной документации по потоковой передаче через Messages API см. [Потоковые сообщения](/docs/ru/build-with-claude/streaming).

Вот как обрабатывать потоковую передачу с мышлением:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 16000,
    "stream": true,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
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
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "What is 27 * 453?"}],
) as stream:
    thinking_started = False
    response_started = False

    for event in stream:
        if event.type == "content_block_start":
            print(f"\nStarting {event.content_block.type} block...")
            # Reset flags for each new block
            thinking_started = False
            response_started = False
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                if not thinking_started:
                    print("Thinking: ", end="", flush=True)
                    thinking_started = True
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                if not response_started:
                    print("Response: ", end="", flush=True)
                    response_started = True
                print(event.delta.text, end="", flush=True)
        elif event.type == "content_block_stop":
            print("\nBlock complete.")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const stream = await client.messages.stream({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "What is 27 * 453?"
  }]
});

let thinkingStarted = false;
let responseStarted = false;

for await (const event of stream) {
  if (event.type === 'content_block_start') {
    console.log(`\nStarting ${event.content_block.type} block...`);
    // Reset flags for each new block
    thinkingStarted = false;
    responseStarted = false;
  } else if (event.type === 'content_block_delta') {
    if (event.delta.type === 'thinking_delta') {
      if (!thinkingStarted) {
        process.stdout.write('Thinking: ');
        thinkingStarted = true;
      }
      process.stdout.write(event.delta.thinking);
    } else if (event.delta.type === 'text_delta') {
      if (!responseStarted) {
        process.stdout.write('Response: ');
        responseStarted = true;
      }
      process.stdout.write(event.delta.text);
    }
  } else if (event.type === 'content_block_stop') {
    console.log('\nBlock complete.');
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaRawMessageStreamEvent;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.messages.Model;

public class SimpleThinkingStreamingExample {
    private static boolean thinkingStarted = false;
    private static boolean responseStarted = false;
    
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams createParams = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_0)
                .maxTokens(16000)
                .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                .addUserMessage("What is 27 * 453?")
                .build();

        try (StreamResponse<BetaRawMessageStreamEvent> streamResponse =
                     client.beta().messages().createStreaming(createParams)) {
            streamResponse.stream()
                    .forEach(event -> {
                        if (event.isContentBlockStart()) {
                            System.out.printf("\nStarting %s block...%n",
                                    event.asContentBlockStart()._type());
                            // Reset flags for each new block
                            thinkingStarted = false;
                            responseStarted = false;
                        } else if (event.isContentBlockDelta()) {
                            var delta = event.asContentBlockDelta().delta();
                            if (delta.isBetaThinking()) {
                                if (!thinkingStarted) {
                                    System.out.print("Thinking: ");
                                    thinkingStarted = true;
                                }
                                System.out.print(delta.asBetaThinking().thinking());
                                System.out.flush();
                            } else if (delta.isBetaText()) {
                                if (!responseStarted) {
                                    System.out.print("Response: ");
                                    responseStarted = true;
                                }
                                System.out.print(delta.asBetaText().text());
                                System.out.flush();
                            }
                        } else if (event.isContentBlockStop()) {
                            System.out.println("\nBlock complete.");
                        }
                    });
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton userPrompt="What is 27 * 453?" thinkingBudgetTokens={16000}>
  Попробуйте в консоли
</TryInConsoleButton>

Пример вывода потоковой передачи:
```json
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step:\n\n1. First break down 27 * 453"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n2. 453 = 400 + 50 + 3"}}

// Additional thinking deltas...

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "27 * 453 = 12,231"}}

// Additional text deltas...

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

<Note>
При использовании потоковой передачи с включенным мышлением вы можете заметить, что текст иногда поступает в больших блоках, чередуясь с меньшей доставкой токен за токеном. Это ожидаемое поведение, особенно для содержимого мышления.

Система потоковой передачи должна обрабатывать содержимое партиями для оптимальной производительности, что может привести к этому "прерывистому" шаблону доставки с возможными задержками между событиями потоковой передачи. Мы постоянно работаем над улучшением этого опыта, с будущими обновлениями, сосредоточенными на более плавной потоковой передаче содержимого мышления.
</Note>

## Расширенное мышление с использованием инструментов

Расширенное мышление можно использовать наряду с [использованием инструментов](/docs/ru/agents-and-tools/tool-use/overview), позволяя Claude рассуждать о выборе инструментов и обработке результатов.

При использовании расширенного мышления с использованием инструментов помните о следующих ограничениях:

1. **Ограничение выбора инструмента**: Использование инструментов с мышлением поддерживает только `tool_choice: {"type": "auto"}` (по умолчанию) или `tool_choice: {"type": "none"}`. Использование `tool_choice: {"type": "any"}` или `tool_choice: {"type": "tool", "name": "..."}` приведет к ошибке, потому что эти опции принуждают использование инструментов, что несовместимо с расширенным мышлением.

2. **Сохранение блоков мышления**: Во время использования инструментов вы должны передать блоки `thinking` обратно в API для последнего сообщения ассистента. Включите полный неизмененный блок обратно в API для поддержания непрерывности рассуждений.

### Переключение режимов мышления в разговорах

Вы не можете переключать мышление в середине хода ассистента, включая во время циклов использования инструментов. Весь ход ассистента должен работать в одном режиме мышления:

- **Если мышление включено**, финальный ход ассистента должен начинаться с блока мышления.
- **Если мышление отключено**, финальный ход ассистента не должен содержать никаких блоков мышления

С точки зрения модели, **циклы использования инструментов являются частью хода ассистента**. Ход ассистента не завершается, пока Claude не завершит свой полный ответ, который может включать несколько вызовов инструментов и результатов.

Например, эта последовательность является частью **одного хода ассистента**:
```
User: "What's the weather in Paris?"
Assistant: [thinking] + [tool_use: get_weather]
User: [tool_result: "20°C, sunny"]
Assistant: [text: "The weather in Paris is 20°C and sunny"]
```

Хотя есть несколько сообщений API, цикл использования инструментов концептуально является частью одного непрерывного ответа ассистента.

#### Распространенные сценарии ошибок

Вы можете столкнуться с этой ошибкой:
```
Expected `thinking` or `redacted_thinking`, but found `tool_use`.
When `thinking` is enabled, a final `assistant` message must start
with a thinking block (preceding the lastmost set of `tool_use` and
`tool_result` blocks).
```

Это обычно происходит, когда:
1. У вас было мышление **отключено** во время последовательности использования инструментов
2. Вы хотите включить мышление снова
3. Ваше последнее сообщение ассистента содержит блоки использования инструментов, но нет блока мышления

#### Практическое руководство

**✗ Недействительно: Переключение мышления сразу после использования инструмента**
```
User: "What's the weather?"
Assistant: [tool_use] (thinking disabled)
User: [tool_result]
// Cannot enable thinking here - still in the same assistant turn
```

**✓ Действительно: Завершите ход ассистента сначала**
```
User: "What's the weather?"
Assistant: [tool_use] (thinking disabled)
User: [tool_result]
Assistant: [text: "It's sunny"] 
User: "What about tomorrow?" (thinking disabled)
Assistant: [thinking] + [text: "..."] (thinking enabled - new turn)
```

**Лучшая практика**: Спланируйте вашу стратегию мышления в начале каждого хода, а не пытайтесь переключаться в середине хода.

<Note>
Переключение режимов мышления также делает недействительным кэширование подсказок для истории сообщений. Для получения дополнительной информации см. раздел [Расширенное мышление с кэшированием подсказок](#extended-thinking-with-prompt-caching).
</Note>

<section title="Пример: Передача блоков мышления с результатами инструментов">

Вот практический пример, показывающий, как сохранить блоки мышления при предоставлении результатов инструментов:

<CodeGroup>
```python Python
weather_tool = {
    "name": "get_weather",
    "description": "Get current weather for a location",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {"type": "string"}
        },
        "required": ["location"]
    }
}

# First request - Claude responds with thinking and tool request
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "What's the weather in Paris?"}
    ]
)
```

```typescript TypeScript
const weatherTool = {
  name: "get_weather",
  description: "Get current weather for a location",
  input_schema: {
    type: "object",
    properties: {
      location: { type: "string" }
    },
    required: ["location"]
  }
};

// First request - Claude responds with thinking and tool request
const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "What's the weather in Paris?" }
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaTool;
import com.anthropic.models.beta.messages.BetaTool.InputSchema;
import com.anthropic.models.messages.Model;

public class ThinkingWithToolsExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of("type", "string")
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        BetaTool weatherTool = BetaTool.builder()
                .name("get_weather")
                .description("Get current weather for a location")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("What's the weather in Paris?")
                        .build()
        );

        System.out.println(response);
    }
}
```
</CodeGroup>

Ответ API будет включать блоки мышления, текста и tool_use:

```json
{
    "content": [
        {
            "type": "thinking",
            "thinking": "The user wants to know the current weather in Paris. I have access to a function `get_weather`...",
            "signature": "BDaL4VrbR2Oj0hO4XpJxT28J5TILnCrrUXoKiiNBZW9P+nr8XSj1zuZzAl4egiCCpQNvfyUuFFJP5CncdYZEQPPmLxYsNrcs...."
        },
        {
            "type": "text",
            "text": "I can help you get the current weather information for Paris. Let me check that for you"
        },
        {
            "type": "tool_use",
            "id": "toolu_01CswdEQBMshySk6Y9DFKrfq",
            "name": "get_weather",
            "input": {
                "location": "Paris"
            }
        }
    ]
}
```

Теперь давайте продолжим разговор и используем инструмент

<CodeGroup>
```python Python
# Extract thinking block and tool use block
thinking_block = next((block for block in response.content
                      if block.type == 'thinking'), None)
tool_use_block = next((block for block in response.content
                      if block.type == 'tool_use'), None)

# Call your actual weather API, here is where your actual API call would go
# let's pretend this is what we get back
weather_data = {"temperature": 88}

# Second request - Include thinking block and tool result
# No new thinking blocks will be generated in the response
continuation = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "What's the weather in Paris?"},
        # notice that the thinking_block is passed in as well as the tool_use_block
        # if this is not passed in, an error is raised
        {"role": "assistant", "content": [thinking_block, tool_use_block]},
        {"role": "user", "content": [{
            "type": "tool_result",
            "tool_use_id": tool_use_block.id,
            "content": f"Current temperature: {weather_data['temperature']}°F"
        }]}
    ]
)
```

```typescript TypeScript
// Extract thinking block and tool use block
const thinkingBlock = response.content.find(block =>
  block.type === 'thinking');
const toolUseBlock = response.content.find(block =>
  block.type === 'tool_use');

// Call your actual weather API, here is where your actual API call would go
// let's pretend this is what we get back
const weatherData = { temperature: 88 };

// Second request - Include thinking block and tool result
// No new thinking blocks will be generated in the response
const continuation = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "What's the weather in Paris?" },
    // notice that the thinkingBlock is passed in as well as the toolUseBlock
    // if this is not passed in, an error is raised
    { role: "assistant", content: [thinkingBlock, toolUseBlock] },
    { role: "user", content: [{
      type: "tool_result",
      tool_use_id: toolUseBlock.id,
      content: `Current temperature: ${weatherData.temperature}°F`
    }]}
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.BetaTool.InputSchema;
import com.anthropic.models.messages.Model;

public class ThinkingToolsResultExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of("type", "string")
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        BetaTool weatherTool = BetaTool.builder()
                .name("get_weather")
                .description("Get current weather for a location")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("What's the weather in Paris?")
                        .build()
        );

        // Extract thinking block and tool use block
        Optional<BetaThinkingBlock> thinkingBlockOpt = response.content().stream()
                .filter(BetaContentBlock::isThinking)
                .map(BetaContentBlock::asThinking)
                .findFirst();

        Optional<BetaToolUseBlock> toolUseBlockOpt = response.content().stream()
                .filter(BetaContentBlock::isToolUse)
                .map(BetaContentBlock::asToolUse)
                .findFirst();

        if (thinkingBlockOpt.isPresent() && toolUseBlockOpt.isPresent()) {
            BetaThinkingBlock thinkingBlock = thinkingBlockOpt.get();
            BetaToolUseBlock toolUseBlock = toolUseBlockOpt.get();

            // Call your actual weather API, here is where your actual API call would go
            // let's pretend this is what we get back
            Map<String, Object> weatherData = Map.of("temperature", 88);

            // Second request - Include thinking block and tool result
            // No new thinking blocks will be generated in the response
            BetaMessage continuation = client.beta().messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_OPUS_4_0)
                            .maxTokens(16000)
                            .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                            .addTool(weatherTool)
                            .addUserMessage("What's the weather in Paris?")
                            .addAssistantMessageOfBetaContentBlockParams(
                                    // notice that the thinkingBlock is passed in as well as the toolUseBlock
                                    // if this is not passed in, an error is raised
                                    List.of(
                                            BetaContentBlockParam.ofThinking(thinkingBlock.toParam()),
                                            BetaContentBlockParam.ofToolUse(toolUseBlock.toParam())
                                    )
                            )
                            .addUserMessageOfBetaContentBlockParams(List.of(
                                    BetaContentBlockParam.ofToolResult(
                                            BetaToolResultBlockParam.builder()
                                                    .toolUseId(toolUseBlock.id())
                                                    .content(String.format("Current temperature: %d°F", (Integer)weatherData.get("temperature")))
                                                    .build()
                                    )
                            ))
                            .build()
            );

            System.out.println(continuation);
        }
    }
}
```
</CodeGroup>

Ответ API теперь будет **только** включать текст

```json
{
    "content": [
        {
            "type": "text",
            "text": "Currently in Paris, the temperature is 88°F (31°C)"
        }
    ]
}
```

</section>

### Сохранение блоков мышления

Во время использования инструментов вы должны передать блоки `thinking` обратно в API, и вы должны включить полный неизмененный блок обратно в API. Это критично для поддержания потока рассуждений модели и целостности разговора.

<Tip>
Хотя вы можете опустить блоки `thinking` из предыдущих ходов роли `assistant`, мы предлагаем всегда передавать все блоки мышления обратно в API для любого многоходового разговора. API будет:
- Автоматически фильтровать предоставленные блоки мышления
- Использовать релевантные блоки мышления, необходимые для сохранения рассуждений модели
- Выставлять счет только за входные токены для блоков, показанных Claude
</Tip>

<Note>
При переключении режимов мышления во время разговора помните, что весь ход ассистента (включая циклы использования инструментов) должен работать в одном режиме мышления. Для получения дополнительной информации см. [Переключение режимов мышления в разговорах](#toggling-thinking-modes-in-conversations).
</Note>

Когда Claude вызывает инструменты, он приостанавливает построение ответа, чтобы ожидать внешней информации. Когда возвращаются результаты инструментов, Claude продолжит построение этого существующего ответа. Это требует сохранения блоков мышления во время использования инструментов по нескольким причинам:

1. **Непрерывность рассуждений**: Блоки мышления захватывают пошаговые рассуждения Claude, которые привели к запросам инструментов. Когда вы отправляете результаты инструментов, включение исходного мышления гарантирует, что Claude может продолжить свои рассуждения с того момента, где он остановился.

2. **Поддержание контекста**: Хотя результаты инструментов отображаются как пользовательские сообщения в структуре API, они являются частью непрерывного потока рассуждений. Сохранение блоков мышления поддерживает этот концептуальный поток через несколько вызовов API. Для получения дополнительной информации об управлении контекстом см. наше [руководство по контекстным окнам](/docs/ru/build-with-claude/context-windows).

**Важно**: При предоставлении блоков `thinking`, вся последовательность последовательных блоков `thinking` должна соответствовать выходам, созданным моделью во время исходного запроса; вы не можете переставлять или изменять последовательность этих блоков.

### Перемежающееся мышление

Расширенное мышление с использованием инструментов в моделях Claude 4 поддерживает перемежающееся мышление, которое позволяет Claude думать между вызовами инструментов и проводить более сложные рассуждения после получения результатов инструментов.

С перемежающимся мышлением Claude может:
- Рассуждать о результатах вызова инструмента перед тем, как решить, что делать дальше
- Связывать несколько вызовов инструментов с этапами рассуждения между ними
- Принимать более тонкие решения на основе промежуточных результатов

Чтобы включить перемежающееся мышление, добавьте [заголовок бета-версии](/docs/ru/api/beta-headers) `interleaved-thinking-2025-05-14` в ваш запрос API.

Вот некоторые важные соображения для перемежающегося мышления:
- С перемежающимся мышлением `budget_tokens` может превышать параметр `max_tokens`, так как он представляет общий бюджет для всех блоков мышления в одном ходу помощника.
- Перемежающееся мышление поддерживается только для [инструментов, используемых через Messages API](/docs/ru/agents-and-tools/tool-use/overview).
- Перемежающееся мышление поддерживается только для моделей Claude 4 с заголовком бета-версии `interleaved-thinking-2025-05-14`.
- Прямые вызовы API Claude позволяют вам передавать `interleaved-thinking-2025-05-14` в запросах к любой модели без каких-либо эффектов.
- На платформах третьих сторон (например, [Amazon Bedrock](/docs/ru/build-with-claude/claude-on-amazon-bedrock) и [Vertex AI](/docs/ru/build-with-claude/claude-on-vertex-ai)), если вы передаете `interleaved-thinking-2025-05-14` к любой модели, кроме Claude Opus 4.5, Claude Opus 4.1, Opus 4 или Sonnet 4, ваш запрос будет отклонен.

<section title="Использование инструментов без перемежающегося мышления">

Без перемежающегося мышления Claude думает один раз в начале хода помощника. Последующие ответы после результатов инструментов продолжаются без новых блоков мышления.

```
User: "What's the total revenue if we sold 150 units at $50 each,
       and how does this compare to our average monthly revenue?"

Turn 1: [thinking] "I need to calculate 150 * $50, then check the database..."
        [tool_use: calculator] { "expression": "150 * 50" }
  ↓ tool result: "7500"

Turn 2: [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
        ↑ no thinking block
  ↓ tool result: "5200"

Turn 3: [text] "The total revenue is $7,500, which is 44% above your
        average monthly revenue of $5,200."
        ↑ no thinking block
```

</section>

<section title="Использование инструментов с перемежающимся мышлением">

С включенным перемежающимся мышлением Claude может думать после получения каждого результата инструмента, позволяя ему рассуждать о промежуточных результатах перед продолжением.

```
User: "What's the total revenue if we sold 150 units at $50 each,
       and how does this compare to our average monthly revenue?"

Turn 1: [thinking] "I need to calculate 150 * $50 first..."
        [tool_use: calculator] { "expression": "150 * 50" }
  ↓ tool result: "7500"

Turn 2: [thinking] "Got $7,500. Now I should query the database to compare..."
        [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
        ↑ thinking after receiving calculator result
  ↓ tool result: "5200"

Turn 3: [thinking] "$7,500 vs $5,200 average - that's a 44% increase..."
        [text] "The total revenue is $7,500, which is 44% above your
        average monthly revenue of $5,200."
        ↑ thinking before final answer
```

</section>

## Расширенное мышление с кешированием подсказок

[Кеширование подсказок](/docs/ru/build-with-claude/prompt-caching) с мышлением имеет несколько важных соображений:

<Tip>
Задачи расширенного мышления часто занимают более 5 минут. Рассмотрите возможность использования [длительности кеша в 1 час](/docs/ru/build-with-claude/prompt-caching#1-hour-cache-duration) для сохранения попаданий кеша во время длительных сеансов мышления и многоэтапных рабочих процессов.
</Tip>

**Удаление контекста блока мышления**
- Блоки мышления из предыдущих ходов удаляются из контекста, что может повлиять на точки разрыва кеша
- При продолжении разговоров с использованием инструментов блоки мышления кешируются и учитываются как входные токены при чтении из кеша
- Это создает компромисс: хотя блоки мышления не потребляют пространство контекстного окна визуально, они все еще учитываются в использовании входных токенов при кешировании
- Если мышление отключено, запросы будут отклонены, если вы передаете содержимое мышления в текущем ходе использования инструмента. В других контекстах содержимое мышления, переданное в API, просто игнорируется

**Шаблоны инвалидации кеша**
- Изменения параметров мышления (включено/отключено или распределение бюджета) инвалидируют точки разрыва кеша сообщений
- [Перемежающееся мышление](#interleaved-thinking) усиливает инвалидацию кеша, так как блоки мышления могут возникать между несколькими [вызовами инструментов](#extended-thinking-with-tool-use)
- Системные подсказки и инструменты остаются кешированными несмотря на изменения параметров мышления или удаление блоков

<Note>
Хотя блоки мышления удаляются для кеширования и расчетов контекста, они должны быть сохранены при продолжении разговоров с [использованием инструментов](#extended-thinking-with-tool-use), особенно с [перемежающимся мышлением](#interleaved-thinking).
</Note>

### Понимание поведения кеширования блока мышления

При использовании расширенного мышления с использованием инструментов блоки мышления демонстрируют специфическое поведение кеширования, которое влияет на подсчет токенов:

**Как это работает:**

1. Кеширование происходит только при выполнении последующего запроса, который включает результаты инструментов
2. Когда выполняется последующий запрос, предыдущая история разговора (включая блоки мышления) может быть кеширована
3. Эти кешированные блоки мышления учитываются как входные токены в ваших метриках использования при чтении из кеша
4. Когда включен блок результата, не связанный с инструментом, все предыдущие блоки мышления игнорируются и удаляются из контекста

**Подробный пример потока:**

**Запрос 1:**
```
User: "What's the weather in Paris?"
```
**Ответ 1:**
```
[thinking_block_1] + [tool_use block 1]
```

**Запрос 2:**
```
User: ["What's the weather in Paris?"], 
Assistant: [thinking_block_1] + [tool_use block 1], 
User: [tool_result_1, cache=True]
```
**Ответ 2:**
```
[thinking_block_2] + [text block 2]
```
Запрос 2 записывает кеш содержимого запроса (не ответа). Кеш включает исходное сообщение пользователя, первый блок мышления, блок использования инструмента и результат инструмента.

**Запрос 3:**
```
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
```
Для Claude Opus 4.5 и более поздних версий все предыдущие блоки мышления сохраняются по умолчанию. Для более старых моделей, поскольку был включен блок результата, не связанный с инструментом, все предыдущие блоки мышления игнорируются. Этот запрос будет обработан так же, как:
```
User: ["What's the weather in Paris?"],
Assistant: [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [text block 2],
User: [Text response, cache=True]
```

**Ключевые моменты:**
- Это поведение кеширования происходит автоматически, даже без явных маркеров `cache_control`
- Это поведение согласуется независимо от использования обычного мышления или перемежающегося мышления

<section title="Кеширование системной подсказки (сохраняется при изменении мышления)">

<CodeGroup>
```python Python
from anthropic import Anthropic
import requests
from bs4 import BeautifulSoup

client = Anthropic()

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return text

# Fetch the content of the article
book_url = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"
book_content = fetch_article_content(book_url)
# Use just enough text for caching (first few chapters)
LARGE_TEXT = book_content[:5000]

SYSTEM_PROMPT=[
    {
        "type": "text",
        "text": "You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.",
    },
    {
        "type": "text",
        "text": LARGE_TEXT,
        "cache_control": {"type": "ephemeral"}
    }
]

MESSAGES = [
    {
        "role": "user",
        "content": "Analyze the tone of this passage."
    }
]

# First request - establish cache
print("First request - establishing cache")
response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    system=SYSTEM_PROMPT,
    messages=MESSAGES
)

print(f"First response usage: {response1.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response1.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the characters in this passage."
})
# Second request - same thinking parameters (cache hit expected)
print("\nSecond request - same thinking parameters (cache hit expected)")
response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    system=SYSTEM_PROMPT,
    messages=MESSAGES
)

print(f"Second response usage: {response2.usage}")

# Third request - different thinking parameters (cache miss for messages)
print("\nThird request - different thinking parameters (cache miss for messages)")
response3 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 8000  # Changed thinking budget
    },
    system=SYSTEM_PROMPT,  # System prompt remains cached
    messages=MESSAGES  # Messages cache is invalidated
)

print(f"Third response usage: {response3.usage}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic();

async function fetchArticleContent(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Remove script and style elements
  $('script, style').remove();
  
  // Get text
  let text = $.text();
  
  // Break into lines and remove leading and trailing space on each
  const lines = text.split('\n').map(line => line.trim());
  // Drop blank lines
  text = lines.filter(line => line.length > 0).join('\n');
  
  return text;
}

// Fetch the content of the article
const bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
const bookContent = await fetchArticleContent(bookUrl);
// Use just enough text for caching (first few chapters)
const LARGE_TEXT = bookContent.slice(0, 5000);

const SYSTEM_PROMPT = [
  {
    type: "text",
    text: "You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.",
  },
  {
    type: "text",
    text: LARGE_TEXT,
    cache_control: { type: "ephemeral" }
  }
];

const MESSAGES = [
  {
    role: "user",
    content: "Analyze the tone of this passage."
  }
];

// First request - establish cache
console.log("First request - establishing cache");
const response1 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 4000
  },
  system: SYSTEM_PROMPT,
  messages: MESSAGES
});

console.log(`First response usage: ${response1.usage}`);

MESSAGES.push({
  role: "assistant",
  content: response1.content
});
MESSAGES.push({
  role: "user",
  content: "Analyze the characters in this passage."
});

// Second request - same thinking parameters (cache hit expected)
console.log("\nSecond request - same thinking parameters (cache hit expected)");
const response2 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 4000
  },
  system: SYSTEM_PROMPT,
  messages: MESSAGES
});

console.log(`Second response usage: ${response2.usage}`);

// Third request - different thinking parameters (cache miss for messages)
console.log("\nThird request - different thinking parameters (cache miss for messages)");
const response3 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 8000  // Changed thinking budget
  },
  system: SYSTEM_PROMPT,  // System prompt remains cached
  messages: MESSAGES  // Messages cache is invalidated
});

console.log(`Third response usage: ${response3.usage}`);
```
</CodeGroup>

</section>
<section title="Кеширование сообщений (инвалидируется при изменении мышления)">

<CodeGroup>
```python Python
from anthropic import Anthropic
import requests
from bs4 import BeautifulSoup

client = Anthropic()

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return text

# Fetch the content of the article
book_url = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"
book_content = fetch_article_content(book_url)
# Use just enough text for caching (first few chapters)
LARGE_TEXT = book_content[:5000]

# No system prompt - caching in messages instead
MESSAGES = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": LARGE_TEXT,
                "cache_control": {"type": "ephemeral"},
            },
            {
                "type": "text",
                "text": "Analyze the tone of this passage."
            }
        ]
    }
]

# First request - establish cache
print("First request - establishing cache")
response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    messages=MESSAGES
)

print(f"First response usage: {response1.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response1.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the characters in this passage."
})
# Second request - same thinking parameters (cache hit expected)
print("\nSecond request - same thinking parameters (cache hit expected)")
response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000  # Same thinking budget
    },
    messages=MESSAGES
)

print(f"Second response usage: {response2.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response2.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the setting in this passage."
})

# Third request - different thinking budget (cache miss expected)
print("\nThird request - different thinking budget (cache miss expected)")
response3 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 8000  # Different thinking budget breaks cache
    },
    messages=MESSAGES
)

print(f"Third response usage: {response3.usage}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic();

async function fetchArticleContent(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Remove script and style elements
  $('script, style').remove();

  // Get text
  let text = $.text();

  // Clean up text (break into lines, remove whitespace)
  const lines = text.split('\n').map(line => line.trim());
  const chunks = lines.flatMap(line => line.split('  ').map(phrase => phrase.trim()));
  text = chunks.filter(chunk => chunk).join('\n');

  return text;
}

async function main() {
  // Fetch the content of the article
  const bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
  const bookContent = await fetchArticleContent(bookUrl);
  // Use just enough text for caching (first few chapters)
  const LARGE_TEXT = bookContent.substring(0, 5000);

  // No system prompt - caching in messages instead
  let MESSAGES = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: LARGE_TEXT,
          cache_control: {type: "ephemeral"},
        },
        {
          type: "text",
          text: "Analyze the tone of this passage."
        }
      ]
    }
  ];

  // First request - establish cache
  console.log("First request - establishing cache");
  const response1 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 4000
    },
    messages: MESSAGES
  });

  console.log(`First response usage: `, response1.usage);

  MESSAGES = [
    ...MESSAGES,
    {
      role: "assistant",
      content: response1.content
    },
    {
      role: "user",
      content: "Analyze the characters in this passage."
    }
  ];

  // Second request - same thinking parameters (cache hit expected)
  console.log("\nSecond request - same thinking parameters (cache hit expected)");
  const response2 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 4000  // Same thinking budget
    },
    messages: MESSAGES
  });

  console.log(`Second response usage: `, response2.usage);

  MESSAGES = [
    ...MESSAGES,
    {
      role: "assistant",
      content: response2.content
    },
    {
      role: "user",
      content: "Analyze the setting in this passage."
    }
  ];

  // Third request - different thinking budget (cache miss expected)
  console.log("\nThird request - different thinking budget (cache miss expected)");
  const response3 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 8000  // Different thinking budget breaks cache
    },
    messages: MESSAGES
  });

  console.log(`Third response usage: `, response3.usage);
}

main().catch(console.error);
```

```java Java
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Arrays;
import java.util.regex.Pattern;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;

import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

public class ThinkingCacheExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Fetch the content of the article
        String bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
        String bookContent = fetchArticleContent(bookUrl);
        // Use just enough text for caching (first few chapters)
        String largeText = bookContent.substring(0, 5000);

        List<BetaTextBlockParam> systemPrompt = List.of(
                BetaTextBlockParam.builder()
                        .text("You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.")
                        .build(),
                BetaTextBlockParam.builder()
                        .text(largeText)
                        .cacheControl(BetaCacheControlEphemeral.builder().build())
                        .build()
        );

        List<BetaMessageParam> messages = new ArrayList<>();
        messages.add(BetaMessageParam.builder()
                .role(BetaMessageParam.Role.USER)
                .content("Analyze the tone of this passage.")
                .build());

        // First request - establish cache
        System.out.println("First request - establishing cache");
        BetaMessage response1 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(4000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .messages(messages)
                        .build()
        );

        System.out.println("First response usage: " + response1.usage());

        // Second request - same thinking parameters (cache hit expected)
        System.out.println("\nSecond request - same thinking parameters (cache hit expected)");
        BetaMessage response2 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(4000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .addMessage(response1)
                        .addUserMessage("Analyze the characters in this passage.")
                        .messages(messages)
                        .build()
        );

        System.out.println("Second response usage: " + response2.usage());

        // Third request - different thinking budget (cache hit expected because system prompt caching)
        System.out.println("\nThird request - different thinking budget (cache hit expected)");
        BetaMessage response3 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(8000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .addMessage(response1)
                        .addUserMessage("Analyze the characters in this passage.")
                        .addMessage(response2)
                        .addUserMessage("Analyze the setting in this passage.")
                        .build()
        );

        System.out.println("Third response usage: " + response3.usage());
    }

    private static String fetchArticleContent(String url) throws IOException {
        // Fetch HTML content
        String htmlContent = fetchHtml(url);

        // Remove script and style elements
        String noScriptStyle = removeElements(htmlContent, "script", "style");

        // Extract text (simple approach - remove HTML tags)
        String text = removeHtmlTags(noScriptStyle);

        // Clean up text (break into lines, remove whitespace)
        List<String> lines = Arrays.asList(text.split("\n"));
        List<String> trimmedLines = lines.stream()
                .map(String::trim)
                .collect(toList());

        // Split on double spaces and flatten
        List<String> chunks = trimmedLines.stream()
                .flatMap(line -> Arrays.stream(line.split("  "))
                        .map(String::trim))
                .collect(toList());

        // Filter empty chunks and join with newlines
        return chunks.stream()
                .filter(chunk -> !chunk.isEmpty())
                .collect(joining("\n"));
    }

    /**
     * Fetches HTML content from a URL
     */
    private static String fetchHtml(String urlString) throws IOException {
        try (InputStream inputStream = new URL(urlString).openStream()) {
            StringBuilder content = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    content.append(line).append("\n");
                }
            }
            return content.toString();
        }
    }

    /**
     * Removes specified HTML elements and their content
     */
    private static String removeElements(String html, String... elementNames) {
        String result = html;
        for (String element : elementNames) {
            // Pattern to match <element>...</element> and self-closing tags
            String pattern = "<" + element + "\\s*[^>]*>.*?</" + element + ">|<" + element + "\\s*[^>]*/?>";
            result = Pattern.compile(pattern, Pattern.DOTALL).matcher(result).replaceAll("");
        }
        return result;
    }

    /**
     * Removes all HTML tags from content
     */
    private static String removeHtmlTags(String html) {
        // Replace <br> and <p> tags with newlines for better text formatting
        String withLineBreaks = html.replaceAll("<br\\s*/?\\s*>|</?p\\s*[^>]*>", "\n");

        // Remove remaining HTML tags
        String noTags = withLineBreaks.replaceAll("<[^>]*>", "");

        // Decode HTML entities (simplified for common entities)
        return decodeHtmlEntities(noTags);
    }

    /**
     * Simple HTML entity decoder for common entities
     */
    private static String decodeHtmlEntities(String text) {
        return text
                .replaceAll("&nbsp;", " ")
                .replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("&quot;", "\"")
                .replaceAll("&#39;", "'")
                .replaceAll("&hellip;", "...")
                .replaceAll("&mdash;", "—");
    }

}
```
</CodeGroup>

Вот результат выполнения скрипта (вы можете увидеть немного другие числа)

```
First request - establishing cache
First response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 17, output_tokens: 700 }

Second request - same thinking parameters (cache hit expected)

Second response usage: { cache_creation_input_tokens: 0, cache_read_input_tokens: 1370, input_tokens: 303, output_tokens: 874 }

Third request - different thinking budget (cache miss expected)
Third response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 747, output_tokens: 619 }
```

Этот пример демонстрирует, что когда кеширование установлено в массиве сообщений, изменение параметров мышления (budget_tokens увеличен с 4000 до 8000) **инвалидирует кеш**. Третий запрос показывает отсутствие попадания кеша с `cache_creation_input_tokens=1370` и `cache_read_input_tokens=0`, доказывая, что кеширование на основе сообщений инвалидируется при изменении параметров мышления.

</section>

## Максимальное количество токенов и размер контекстного окна с расширенным мышлением

В более старых моделях Claude (до Claude Sonnet 3.7), если сумма токенов подсказки и `max_tokens` превышала контекстное окно модели, система автоматически корректировала `max_tokens` для соответствия лимиту контекста. Это означало, что вы могли установить большое значение `max_tokens`, и система молча уменьшала бы его по мере необходимости.

С моделями Claude 3.7 и 4, `max_tokens` (который включает ваш бюджет мышления при включенном мышлении) применяется как строгий лимит. Система теперь вернет ошибку валидации, если токены подсказки + `max_tokens` превышает размер контекстного окна.

<Note>
Вы можете прочитать наше [руководство по контекстным окнам](/docs/ru/build-with-claude/context-windows) для более глубокого погружения.
</Note>

### Контекстное окно с расширенным мышлением

При расчете использования контекстного окна с включенным мышлением необходимо учитывать некоторые моменты:

- Блоки мышления из предыдущих ходов удаляются и не учитываются в вашем контекстном окне
- Мышление текущего хода учитывается в вашем лимите `max_tokens` для этого хода

Диаграмма ниже демонстрирует специализированное управление токенами при включенном расширенном мышлении:

![Context window diagram with extended thinking](/docs/images/context-window-thinking.svg)

Эффективное контекстное окно рассчитывается как:

```
context window =
  (current input tokens - previous thinking tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

Мы рекомендуем использовать [API подсчета токенов](/docs/ru/build-with-claude/token-counting) для получения точных подсчетов токенов для вашего конкретного случая использования, особенно при работе с многоходовыми разговорами, которые включают мышление.

### Контекстное окно с расширенным мышлением и использованием инструментов

При использовании расширенного мышления с использованием инструментов блоки мышления должны быть явно сохранены и возвращены с результатами инструментов.

Расчет эффективного контекстного окна для расширенного мышления с использованием инструментов становится: 

```
context window =
  (current input tokens + previous thinking tokens + tool use tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

Диаграмма ниже иллюстрирует управление токенами для расширенного мышления с использованием инструментов:

![Context window diagram with extended thinking and tool use](/docs/images/context-window-thinking-tools.svg)

### Управление токенами с расширенным мышлением

Учитывая поведение контекстного окна и `max_tokens` с расширенным мышлением в моделях Claude 3.7 и 4, вам может потребоваться:

- Более активно отслеживать и управлять использованием токенов
- Корректировать значения `max_tokens` по мере изменения длины подсказки
- Потенциально использовать [конечные точки подсчета токенов](/docs/ru/build-with-claude/token-counting) более часто
- Помнить, что предыдущие блоки мышления не накапливаются в вашем контекстном окне

Это изменение было сделано для обеспечения более предсказуемого и прозрачного поведения, особенно поскольку максимальные лимиты токенов значительно увеличились.

## Шифрование мышления

Полное содержимое мышления зашифровано и возвращается в поле `signature`. Это поле используется для проверки того, что блоки мышления были созданы Claude при передаче обратно в API. 

<Note>
Строго необходимо отправлять обратно блоки мышления только при использовании [инструментов с расширенным мышлением](#extended-thinking-with-tool-use). В противном случае вы можете опустить блоки мышления из предыдущих ходов или позволить API удалить их, если вы передадите их обратно. 

Если вы отправляете обратно блоки мышления, мы рекомендуем передавать все обратно так, как вы это получили, для согласованности и избежания потенциальных проблем.
</Note>

Вот некоторые важные соображения по шифрованию мышления:
- При [потоковой передаче ответов](#streaming-thinking) подпись добавляется через `signature_delta` внутри события `content_block_delta` непосредственно перед событием `content_block_stop`.
- Значения `signature` значительно длиннее в моделях Claude 4, чем в предыдущих моделях.
- Поле `signature` является непрозрачным полем и не должно интерпретироваться или анализироваться - оно существует исключительно в целях проверки.
- Значения `signature` совместимы между платформами (Claude API, [Amazon Bedrock](/docs/ru/build-with-claude/claude-on-amazon-bedrock) и [Vertex AI](/docs/ru/build-with-claude/claude-on-vertex-ai)). Значения, созданные на одной платформе, будут совместимы с другой.

### Редактирование мышления

Иногда внутреннее рассуждение Claude будет отмечено нашими системами безопасности. Когда это происходит, мы шифруем часть или весь блок `thinking` и возвращаем его вам как блок `redacted_thinking`. Блоки `redacted_thinking` расшифровываются при передаче обратно в API, позволяя Claude продолжить свой ответ без потери контекста.

При создании приложений, ориентированных на пользователей, которые используют расширенное мышление:

- Помните, что блоки redacted thinking содержат зашифрованный контент, который не является читаемым для человека
- Рассмотрите возможность предоставления простого объяснения, например: "Часть внутреннего рассуждения Claude была автоматически зашифрована в целях безопасности. Это не влияет на качество ответов."
- Если вы показываете блоки мышления пользователям, вы можете отфильтровать редактируемые блоки, сохраняя при этом обычные блоки мышления
- Будьте прозрачны в том, что использование функций расширенного мышления может иногда привести к шифрованию некоторого рассуждения
- Реализуйте надлежащую обработку ошибок для корректного управления редактируемым мышлением без нарушения вашего пользовательского интерфейса

Вот пример, показывающий как обычные, так и редактируемые блоки мышления:

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "redacted_thinking",
      "data": "EmwKAhgBEgy3va3pzix/LafPsn4aDFIT2Xlxh0L5L8rLVyIwxtE3rAFBa8cr3qpPkNRj2YfWXGmKDxH4mPnZ5sQ7vB9URj2pLmN3kF8/dW5hR7xJ0aP1oLs9yTcMnKVf2wRpEGjH9XZaBt4UvDcPrQ..."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

<Note>
Появление редактируемых блоков мышления в вашем выводе — это ожидаемое поведение. Модель все еще может использовать это редактируемое рассуждение для информирования своих ответов, сохраняя при этом защиту безопасности.

Если вам нужно протестировать обработку редактируемого мышления в вашем приложении, вы можете использовать эту специальную тестовую строку в качестве подсказки: `ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB`
</Note>

При передаче блоков `thinking` и `redacted_thinking` обратно в API в многоходовом разговоре вы должны включить полный неизменённый блок обратно в API для последнего хода ассистента. Это критически важно для сохранения потока рассуждений модели. Мы рекомендуем всегда передавать все блоки мышления в API. Для получения дополнительной информации см. раздел [Сохранение блоков мышления](#preserving-thinking-blocks) выше.

<section title="Пример: Работа с редактируемыми блоками мышления">

Этот пример демонстрирует, как обрабатывать блоки `redacted_thinking`, которые могут появиться в ответах, когда внутреннее рассуждение Claude содержит контент, отмеченный системами безопасности:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Using a special prompt that triggers redacted thinking (for demonstration purposes only)
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
    }]
)

# Identify redacted thinking blocks
has_redacted_thinking = any(
    block.type == "redacted_thinking" for block in response.content
)

if has_redacted_thinking:
    print("Response contains redacted thinking blocks")
    # These blocks are still usable in subsequent requests

    # Extract all blocks (both redacted and non-redacted)
    all_thinking_blocks = [
        block for block in response.content
        if block.type in ["thinking", "redacted_thinking"]
    ]

    # When passing to subsequent requests, include all blocks without modification
    # This preserves the integrity of Claude's reasoning

    print(f"Found {len(all_thinking_blocks)} thinking blocks total")
    print(f"These blocks are still billable as output tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Using a special prompt that triggers redacted thinking (for demonstration purposes only)
const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
  }]
});

// Identify redacted thinking blocks
const hasRedactedThinking = response.content.some(
  block => block.type === "redacted_thinking"
);

if (hasRedactedThinking) {
  console.log("Response contains redacted thinking blocks");
  // These blocks are still usable in subsequent requests

  // Extract all blocks (both redacted and non-redacted)
  const allThinkingBlocks = response.content.filter(
    block => block.type === "thinking" || block.type === "redacted_thinking"
  );

  // When passing to subsequent requests, include all blocks without modification
  // This preserves the integrity of Claude's reasoning

  console.log(`Found ${allThinkingBlocks.length} thinking blocks total`);
  console.log(`These blocks are still billable as output tokens`);
}
```

```java Java
import java.util.List;

import static java.util.stream.Collectors.toList;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.BetaContentBlock;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.messages.Model;

public class RedactedThinkingExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Using a special prompt that triggers redacted thinking (for demonstration purposes only)
        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_SONNET_4_5)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB")
                        .build()
        );

        // Identify redacted thinking blocks
        boolean hasRedactedThinking = response.content().stream()
                .anyMatch(BetaContentBlock::isRedactedThinking);

        if (hasRedactedThinking) {
            System.out.println("Response contains redacted thinking blocks");
            // These blocks are still usable in subsequent requests
            // Extract all blocks (both redacted and non-redacted)
            List<BetaContentBlock> allThinkingBlocks = response.content().stream()
                    .filter(block -> block.isThinking() ||
                            block.isRedactedThinking())
                    .collect(toList());

            // When passing to subsequent requests, include all blocks without modification
            // This preserves the integrity of Claude's reasoning
            System.out.println("Found " + allThinkingBlocks.size() + " thinking blocks total");
            System.out.println("These blocks are still billable as output tokens");
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton
  userPrompt="ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
  thinkingBudgetTokens={16000}
>
  Попробуйте в консоли
</TryInConsoleButton>

</section>

## Различия в мышлении между версиями моделей

Messages API обрабатывает мышление по-разному в моделях Claude Sonnet 3.7 и Claude 4, в основном в поведении редактирования и суммирования.

См. таблицу ниже для сокращённого сравнения:

| Функция | Claude Sonnet 3.7 | Claude 4 Models (pre-Opus 4.5) | Claude Opus 4.5 и позже |
|---------|------------------|-------------------------------|--------------------------|
| **Вывод мышления** | Возвращает полный вывод мышления | Возвращает суммированное мышление | Возвращает суммированное мышление |
| **Чередующееся мышление** | Не поддерживается | Поддерживается с заголовком бета-версии `interleaved-thinking-2025-05-14` | Поддерживается с заголовком бета-версии `interleaved-thinking-2025-05-14` |
| **Сохранение блока мышления** | Не сохраняется между ходами | Не сохраняется между ходами | **Сохраняется по умолчанию** (включает оптимизацию кэша, экономию токенов) |

### Сохранение блока мышления в Claude Opus 4.5

Claude Opus 4.5 вводит новое поведение по умолчанию: **блоки мышления из предыдущих ходов ассистента сохраняются в контексте модели по умолчанию**. Это отличается от более ранних моделей, которые удаляют блоки мышления из предыдущих ходов.

**Преимущества сохранения блока мышления:**

- **Оптимизация кэша**: При использовании инструментов сохранённые блоки мышления позволяют попадать в кэш, так как они передаются обратно с результатами инструментов и кэшируются постепенно на протяжении хода ассистента, что приводит к экономии токенов в многошаговых рабочих процессах
- **Без влияния на интеллект**: Сохранение блоков мышления не оказывает отрицательного влияния на производительность модели

**Важные соображения:**

- **Использование контекста**: Длинные разговоры будут потреблять больше пространства контекста, так как блоки мышления сохраняются в контексте
- **Автоматическое поведение**: Это поведение по умолчанию для Claude Opus 4.5 — не требуются изменения кода или заголовки бета-версии
- **Обратная совместимость**: Чтобы использовать эту функцию, продолжайте передавать полные неизменённые блоки мышления обратно в API, как вы делали бы для использования инструментов

<Note>
Для более ранних моделей (Claude Sonnet 4.5, Opus 4.1 и т. д.) блоки мышления из предыдущих ходов продолжают удаляться из контекста. Существующее поведение, описанное в разделе [Расширенное мышление с кэшированием подсказок](#extended-thinking-with-prompt-caching), применяется к этим моделям.
</Note>

## Цены

Для получения полной информации о ценах, включая базовые ставки, записи в кэш, попадания в кэш и выходные токены, см. [страницу цен](/docs/ru/about-claude/pricing).

Процесс мышления влечёт за собой расходы на:
- Токены, используемые во время мышления (выходные токены)
- Блоки мышления из последнего хода ассистента, включённые в последующие запросы (входные токены)
- Стандартные токены текстового вывода

<Note>
Когда расширенное мышление включено, специализированная системная подсказка автоматически включается для поддержки этой функции.
</Note>

При использовании суммированного мышления:
- **Входные токены**: Токены в вашем исходном запросе (исключает токены мышления из предыдущих ходов)
- **Выходные токены (выставлены счётом)**: Исходные токены мышления, которые Claude сгенерировал внутри
- **Выходные токены (видимые)**: Суммированные токены мышления, которые вы видите в ответе
- **Без платежа**: Токены, используемые для создания резюме

<Warning>
Количество выходных токенов, выставленных счётом, **не будет** совпадать с видимым количеством токенов в ответе. Вам выставляется счёт за полный процесс мышления, а не за резюме, которое вы видите.
</Warning>

## Лучшие практики и соображения для расширенного мышления

### Работа с бюджетами мышления

- **Оптимизация бюджета:** Минимальный бюджет составляет 1024 токена. Мы рекомендуем начать с минимума и постепенно увеличивать бюджет мышления, чтобы найти оптимальный диапазон для вашего варианта использования. Более высокие количества токенов позволяют более комплексное рассуждение, но с убывающей отдачей в зависимости от задачи. Увеличение бюджета может улучшить качество ответа в обмен на увеличенную задержку. Для критических задач протестируйте различные параметры, чтобы найти оптимальный баланс. Обратите внимание, что бюджет мышления является целевым показателем, а не строгим ограничением — фактическое использование токенов может варьироваться в зависимости от задачи.
- **Начальные точки:** Начните с больших бюджетов мышления (16k+ токенов) для сложных задач и отрегулируйте в зависимости от ваших потребностей.
- **Большие бюджеты:** Для бюджетов мышления выше 32k мы рекомендуем использовать [пакетную обработку](/docs/ru/build-with-claude/batch-processing) во избежание проблем с сетью. Запросы, которые заставляют модель думать выше 32k токенов, вызывают долгоживущие запросы, которые могут столкнуться с истечением времени ожидания системы и ограничениями открытых соединений.
- **Отслеживание использования токенов:** Отслеживайте использование токенов мышления для оптимизации затрат и производительности.

### Соображения производительности

- **Время ответа:** Будьте готовы к потенциально более длительному времени ответа из-за дополнительной обработки, необходимой для процесса рассуждения. Учитывайте, что создание блоков мышления может увеличить общее время ответа.
- **Требования потоковой передачи:** Потоковая передача требуется, когда `max_tokens` больше 21 333. При потоковой передаче будьте готовы обрабатывать как блоки мышления, так и текстовые блоки контента по мере их поступления.

### Совместимость функций

- Мышление несовместимо с модификациями `temperature` или `top_k`, а также с [принудительным использованием инструментов](/docs/ru/agents-and-tools/tool-use/implement-tool-use#forcing-tool-use).
- Когда мышление включено, вы можете установить `top_p` на значения между 1 и 0,95.
- Вы не можете предварительно заполнить ответы, когда мышление включено.
- Изменения в бюджете мышления делают недействительными кэшированные префиксы подсказок, которые включают сообщения. Однако кэшированные системные подсказки и определения инструментов продолжат работать при изменении параметров мышления.

### Рекомендации по использованию

- **Выбор задачи:** Используйте расширенное мышление для особенно сложных задач, которые выигрывают от пошагового рассуждения, таких как математика, кодирование и анализ.
- **Обработка контекста:** Вам не нужно самостоятельно удалять предыдущие блоки мышления. API Claude автоматически игнорирует блоки мышления из предыдущих ходов, и они не включаются при расчёте использования контекста.
- **Инженерия подсказок:** Ознакомьтесь с нашими [советами по инженерии подсказок расширенного мышления](/docs/ru/build-with-claude/prompt-engineering/extended-thinking-tips), если вы хотите максимизировать возможности мышления Claude.

## Следующие шаги

<CardGroup>
  <Card title="Попробуйте кулинарную книгу расширенного мышления" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    Изучите практические примеры мышления в нашей кулинарной книге.
  </Card>
  <Card title="Советы по инженерии подсказок расширенного мышления" icon="code" href="/docs/ru/build-with-claude/prompt-engineering/extended-thinking-tips">
    Изучите лучшие практики инженерии подсказок для расширенного мышления.
  </Card>
</CardGroup>