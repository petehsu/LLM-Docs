# Подсчет токенов

Определите количество токенов в сообщении перед отправкой в Claude, чтобы принимать обоснованные решения о ваших промптах и использовании.

---

Подсчет токенов позволяет вам определить количество токенов в сообщении перед отправкой его в Claude, помогая принимать обоснованные решения о ваших промптах и использовании. С помощью подсчета токенов вы можете:
- Проактивно управлять ограничениями скорости и затратами
- Принимать умные решения о маршрутизации моделей
- Оптимизировать промпты до определенной длины
---

## Как подсчитать токены сообщения

Эндпоинт [подсчета токенов](/docs/ru/api/messages-count-tokens) принимает тот же структурированный список входных данных для создания сообщения, включая поддержку системных промптов, [инструментов](/docs/ru/agents-and-tools/tool-use/overview), [изображений](/docs/ru/build-with-claude/vision) и [PDF](/docs/ru/build-with-claude/pdf-support). Ответ содержит общее количество входных токенов.

<Note>
Количество токенов следует считать **оценкой**. В некоторых случаях фактическое количество входных токенов, используемых при создании сообщения, может отличаться на небольшое количество.

Количество токенов может включать токены, добавленные автоматически Anthropic для системных оптимизаций. **Вы не платите за системные токены**. Биллинг отражает только ваш контент.
</Note>

### Поддерживаемые модели
Все [активные модели](/docs/ru/about-claude/models/overview) поддерживают подсчет токенов.

### Подсчет токенов в базовых сообщениях

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.count_tokens(
    model="claude-sonnet-4-5",
    system="You are a scientist",
    messages=[{
        "role": "user",
        "content": "Hello, Claude"
    }],
)

print(response.json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.countTokens({
  model: 'claude-sonnet-4-5',
  system: 'You are a scientist',
  messages: [{
    role: 'user',
    content: 'Hello, Claude'
  }]
});

console.log(response);
```

```bash Shell
curl https://api.anthropic.com/v1/messages/count_tokens \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "content-type: application/json" \
    --header "anthropic-version: 2023-06-01" \
    --data '{
      "model": "claude-sonnet-4-5",
      "system": "You are a scientist",
      "messages": [{
        "role": "user",
        "content": "Hello, Claude"
      }]
    }'
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.MessageCountTokensParams;
import com.anthropic.models.messages.MessageTokensCount;
import com.anthropic.models.messages.Model;

public class CountTokensExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCountTokensParams params = MessageCountTokensParams.builder()
                .model(Model.CLAUDE_SONNET_4_20250514)
                .system("You are a scientist")
                .addUserMessage("Hello, Claude")
                .build();

        MessageTokensCount count = client.messages().countTokens(params);
        System.out.println(count);
    }
}
```
</CodeGroup>

```json JSON
{ "input_tokens": 14 }
```

### Подсчет токенов в сообщениях с инструментами

<Note>
Количество токенов [серверных инструментов](/docs/ru/agents-and-tools/tool-use/overview#server-tools) применяется только к первому вызову выборки.
</Note>

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.count_tokens(
    model="claude-sonnet-4-5",
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    }
                },
                "required": ["location"],
            },
        }
    ],
    messages=[{"role": "user", "content": "What's the weather like in San Francisco?"}]
)

print(response.json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.countTokens({
  model: 'claude-sonnet-4-5',
  tools: [
    {
      name: "get_weather",
      description: "Get the current weather in a given location",
      input_schema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          }
        },
        required: ["location"],
      }
    }
  ],
  messages: [{ role: "user", content: "What's the weather like in San Francisco?" }]
});

console.log(response);
```

```bash Shell
curl https://api.anthropic.com/v1/messages/count_tokens \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "content-type: application/json" \
    --header "anthropic-version: 2023-06-01" \
    --data '{
      "model": "claude-sonnet-4-5",
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
      "messages": [
        {
          "role": "user",
          "content": "What'\''s the weather like in San Francisco?"
        }
      ]
    }'
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.MessageCountTokensParams;
import com.anthropic.models.messages.MessageTokensCount;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;

public class CountTokensWithToolsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of(
 "type", "string",
 "description", "The city and state, e.g. San Francisco, CA"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        MessageCountTokensParams params = MessageCountTokensParams.builder()
                .model(Model.CLAUDE_SONNET_4_20250514)
                .addTool(Tool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(schema)
                        .build())
                .addUserMessage("What's the weather like in San Francisco?")
                .build();

        MessageTokensCount count = client.messages().countTokens(params);
        System.out.println(count);
    }
}
```
</CodeGroup>

```json JSON
{ "input_tokens": 403 }
```

### Подсчет токенов в сообщениях с изображениями

<CodeGroup>
```bash Shell
#!/bin/sh

IMAGE_URL="https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
IMAGE_MEDIA_TYPE="image/jpeg"
IMAGE_BASE64=$(curl "$IMAGE_URL" | base64)

curl https://api.anthropic.com/v1/messages/count_tokens \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "messages": [
        {"role": "user", "content": [
            {"type": "image", "source": {
                "type": "base64",
                "media_type": "'$IMAGE_MEDIA_TYPE'",
                "data": "'$IMAGE_BASE64'"
            }},
            {"type": "text", "text": "Describe this image"}
        ]}
    ]
}'
```

```python Python
import anthropic
import base64
import httpx

image_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
image_media_type = "image/jpeg"
image_data = base64.standard_b64encode(httpx.get(image_url).content).decode("utf-8")

client = anthropic.Anthropic()

response = client.messages.count_tokens(
    model="claude-sonnet-4-5",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": image_media_type,
                        "data": image_data,
                    },
                },
                {
                    "type": "text",
                    "text": "Describe this image"
                }
            ],
        }
    ],
)
print(response.json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const image_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
const image_media_type = "image/jpeg"
const image_array_buffer = await ((await fetch(image_url)).arrayBuffer());
const image_data = Buffer.from(image_array_buffer).toString('base64');

const response = await anthropic.messages.countTokens({
  model: 'claude-sonnet-4-5',
  messages: [
    {
      "role": "user",
      "content": [
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": image_media_type,
            "data": image_data,
          },
        }
      ],
    },
    {
      "type": "text",
      "text": "Describe this image"
    }
  ]
});
console.log(response);
```

```java Java
import java.util.Base64;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Base64ImageSource;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.ImageBlockParam;
import com.anthropic.models.messages.MessageCountTokensParams;
import com.anthropic.models.messages.MessageTokensCount;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class CountTokensImageExample {

    public static void main(String[] args) throws Exception {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        String imageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg";
        String imageMediaType = "image/jpeg";

        HttpClient httpClient = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(imageUrl))
                .build();
        byte[] imageBytes = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray()).body();
        String imageBase64 = Base64.getEncoder().encodeToString(imageBytes);

        ContentBlockParam imageBlock = ContentBlockParam.ofImage(
                ImageBlockParam.builder()
                        .source(Base64ImageSource.builder()
 .mediaType(Base64ImageSource.MediaType.IMAGE_JPEG)
 .data(imageBase64)
 .build())
                        .build());

        ContentBlockParam textBlock = ContentBlockParam.ofText(
                TextBlockParam.builder()
                        .text("Describe this image")
                        .build());

        MessageCountTokensParams params = MessageCountTokensParams.builder()
                .model(Model.CLAUDE_SONNET_4_20250514)
                .addUserMessageOfBlockParams(List.of(imageBlock, textBlock))
                .build();

        MessageTokensCount count = client.messages().countTokens(params);
        System.out.println(count);
    }
}
```
</CodeGroup>

```json JSON
{ "input_tokens": 1551 }
```

### Подсчет токенов в сообщениях с расширенным мышлением

<Note>
См. [здесь](/docs/ru/build-with-claude/extended-thinking#how-context-window-is-calculated-with-extended-thinking) для получения более подробной информации о том, как рассчитывается контекстное окно с расширенным мышлением
- Блоки мышления из **предыдущих** ходов ассистента игнорируются и **не** засчитываются в ваши входные токены
- Мышление **текущего** хода ассистента **засчитывается** в ваши входные токены
</Note>

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages/count_tokens \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "content-type: application/json" \
    --header "anthropic-version: 2023-06-01" \
    --data '{
      "model": "claude-sonnet-4-5",
      "thinking": {
        "type": "enabled",
        "budget_tokens": 16000
      },
      "messages": [
        {
          "role": "user",
          "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
        },
        {
          "role": "assistant",
          "content": [
            {
              "type": "thinking",
              "thinking": "This is a nice number theory question. Lets think about it step by step...",
              "signature": "EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV..."
            },
            {
              "type": "text",
              "text": "Yes, there are infinitely many prime numbers p such that p mod 4 = 3..."
            }
          ]
        },
        {
          "role": "user",
          "content": "Can you write a formal proof?"
        }
      ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.count_tokens(
    model="claude-sonnet-4-5",
    thinking={
        "type": "enabled",
        "budget_tokens": 16000
    },
    messages=[
        {
            "role": "user",
            "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "thinking",
                    "thinking": "This is a nice number theory question. Let's think about it step by step...",
                    "signature": "EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV..."
                },
                {
                  "type": "text",
                  "text": "Yes, there are infinitely many prime numbers p such that p mod 4 = 3..."
                }
            ]
        },
        {
            "role": "user",
            "content": "Can you write a formal proof?"
        }
    ]
)

print(response.json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.countTokens({
  model: 'claude-sonnet-4-5',
  thinking: {
    'type': 'enabled',
    'budget_tokens': 16000
  },
  messages: [
    {
      'role': 'user',
      'content': 'Are there an infinite number of prime numbers such that n mod 4 == 3?'
    },
    {
      'role': 'assistant',
      'content': [
        {
          'type': 'thinking',
          'thinking': "This is a nice number theory question. Let's think about it step by step...",
          'signature': 'EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV...'
        },
        {
          'type': 'text',
          'text': 'Yes, there are infinitely many prime numbers p such that p mod 4 = 3...',
        }
      ]
    },
    {
      'role': 'user',
      'content': 'Can you write a formal proof?'
    }
  ]
});

console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.MessageCountTokensParams;
import com.anthropic.models.messages.MessageTokensCount;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.ThinkingBlockParam;

public class CountTokensThinkingExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        List<ContentBlockParam> assistantBlocks = List.of(
                ContentBlockParam.ofThinking(ThinkingBlockParam.builder()
                        .thinking("This is a nice number theory question. Let's think about it step by step...")
                        .signature("EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV...")
                        .build()),
                ContentBlockParam.ofText(TextBlockParam.builder()
                        .text("Yes, there are infinitely many prime numbers p such that p mod 4 = 3...")
                        .build())
        );

        MessageCountTokensParams params = MessageCountTokensParams.builder()
                .model(Model.CLAUDE_SONNET_4_20250514)
                .enabledThinking(16000)
                .addUserMessage("Are there an infinite number of prime numbers such that n mod 4 == 3?")
                .addAssistantMessageOfBlockParams(assistantBlocks)
                .addUserMessage("Can you write a formal proof?")
                .build();

        MessageTokensCount count = client.messages().countTokens(params);
        System.out.println(count);
    }
}
```
</CodeGroup>

```json JSON
{ "input_tokens": 88 }
```

### Подсчет токенов в сообщениях с PDF

<Note>
Подсчет токенов поддерживает PDF с теми же [ограничениями](/docs/ru/build-with-claude/pdf-support#pdf-support-limitations), что и Messages API.
</Note> 

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages/count_tokens \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "content-type: application/json" \
    --header "anthropic-version: 2023-06-01" \
    --data '{
      "model": "claude-sonnet-4-5",
      "messages": [{
        "role": "user",
        "content": [
          {
            "type": "document",
            "source": {
              "type": "base64",
              "media_type": "application/pdf",
              "data": "'$(base64 -i document.pdf)'"
            }
          },
          {
            "type": "text",
            "text": "Please summarize this document."
          }
        ]
      }]
    }'
```

```python Python
import base64
import anthropic

client = anthropic.Anthropic()

with open("document.pdf", "rb") as pdf_file:
    pdf_base64 = base64.standard_b64encode(pdf_file.read()).decode("utf-8")

response = client.messages.count_tokens(
    model="claude-sonnet-4-5",
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": pdf_base64
                }
            },
            {
                "type": "text",
                "text": "Please summarize this document."
            }
        ]
    }]
)

print(response.json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';

const client = new Anthropic();

const pdfBase64 = readFileSync('document.pdf', { encoding: 'base64' });

const response = await client.messages.countTokens({
  model: 'claude-sonnet-4-5',
  messages: [{
    role: 'user',
    content: [
      {
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: pdfBase64
        }
      },
      {
        type: 'text',
        text: 'Please summarize this document.'
      }
    ]
  }]
});

console.log(response);
```

```java Java
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Base64PdfSource;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.DocumentBlockParam;
import com.anthropic.models.messages.MessageCountTokensParams;
import com.anthropic.models.messages.MessageTokensCount;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class CountTokensPdfExample {

    public static void main(String[] args) throws Exception {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        byte[] fileBytes = Files.readAllBytes(Path.of("document.pdf"));
        String pdfBase64 = Base64.getEncoder().encodeToString(fileBytes);

        ContentBlockParam documentBlock = ContentBlockParam.ofDocument(
                DocumentBlockParam.builder()
                        .source(Base64PdfSource.builder()
 .mediaType(Base64PdfSource.MediaType.APPLICATION_PDF)
 .data(pdfBase64)
 .build())
                        .build());

        ContentBlockParam textBlock = ContentBlockParam.ofText(
                TextBlockParam.builder()
                        .text("Please summarize this document.")
                        .build());

        MessageCountTokensParams params = MessageCountTokensParams.builder()
                .model(Model.CLAUDE_SONNET_4_20250514)
                .addUserMessageOfBlockParams(List.of(documentBlock, textBlock))
                .build();

        MessageTokensCount count = client.messages().countTokens(params);
        System.out.println(count);
    }
}
```
</CodeGroup>

```json JSON
{ "input_tokens": 2188 }
```

---

## Цены и ограничения скорости

Подсчет токенов **бесплатен для использования**, но подлежит ограничениям запросов в минуту на основе вашего [уровня использования](/docs/ru/api/rate-limits#rate-limits). Если вам нужны более высокие лимиты, обратитесь в отдел продаж через [Claude Console](/settings/limits).

| Уровень использования | Запросов в минуту (RPM) |
|---|---|
| 1          | 100                       |
| 2          | 2,000                     |
| 3          | 4,000                     |
| 4          | 8,000                     |

<Note>
  Подсчет токенов и создание сообщений имеют отдельные и независимые ограничения скорости -- использование одного не засчитывается в лимиты другого.
</Note>

---
## FAQ

  <section title="Использует ли подсчет токенов кэширование промптов?">

    Нет, подсчет токенов предоставляет оценку без использования логики кэширования. Хотя вы можете предоставить блоки `cache_control` в вашем запросе подсчета токенов, кэширование промптов происходит только во время фактического создания сообщения.
  
</section>