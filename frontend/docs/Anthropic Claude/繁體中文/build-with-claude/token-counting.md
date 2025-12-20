# Token 計數

---

Token 計數讓您能夠在將訊息發送給 Claude 之前確定訊息中的 token 數量，幫助您對提示和使用做出明智的決策。透過 token 計數，您可以
- 主動管理速率限制和成本
- 做出智慧的模型路由決策
- 優化提示以達到特定長度
---

## 如何計算訊息 token

[token 計數](/docs/zh-TW/api/messages-count-tokens)端點接受與建立訊息相同的結構化輸入列表，包括支援系統提示、[工具](/docs/zh-TW/agents-and-tools/tool-use/overview)、[圖像](/docs/zh-TW/build-with-claude/vision)和 [PDF](/docs/zh-TW/build-with-claude/pdf-support)。回應包含輸入 token 的總數。

<Note>
token 計數應被視為**估計值**。在某些情況下，建立訊息時使用的實際輸入 token 數量可能會有少量差異。

Token 計數可能包括 Anthropic 為系統優化自動添加的 token。**您不會為系統添加的 token 付費**。計費僅反映您的內容。
</Note>

### 支援的模型
所有[活躍模型](/docs/zh-TW/about-claude/models/overview)都支援 token 計數。

### 計算基本訊息中的 token

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

### 計算包含工具的訊息中的 token

<Note>
[伺服器工具](/docs/zh-TW/agents-and-tools/tool-use/overview#server-tools) token 計數僅適用於第一次採樣呼叫。
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

### 計算包含圖像的訊息中的 token

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

### 計算包含延伸思考的訊息中的 token

<Note>
請參閱[這裡](/docs/zh-TW/build-with-claude/extended-thinking#how-context-window-is-calculated-with-extended-thinking)了解更多關於延伸思考如何計算上下文視窗的詳細資訊
- 來自**先前**助理回合的思考區塊會被忽略，**不會**計入您的輸入 token
- **當前**助理回合的思考**會**計入您的輸入 token
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

### 計算包含 PDF 的訊息中的 token

<Note>
Token 計數支援 PDF，具有與 Messages API 相同的[限制](/docs/zh-TW/build-with-claude/pdf-support#pdf-support-limitations)。
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

## 定價和速率限制

Token 計數**免費使用**，但受到基於您的[使用層級](/docs/zh-TW/api/rate-limits#rate-limits)的每分鐘請求數速率限制。如果您需要更高的限制，請透過 [Claude Console](/settings/limits) 聯繫銷售團隊。

| 使用層級 | 每分鐘請求數 (RPM) |
|---|---|
| 1          | 100                       |
| 2          | 2,000                     |
| 3          | 4,000                     |
| 4          | 8,000                     |

<Note>
  Token 計數和訊息建立有獨立的速率限制 -- 其中一個的使用不會計入另一個的限制。
</Note>

---
## 常見問題

  <section title="Token 計數是否使用提示快取？">

    不，token 計數提供估計值而不使用快取邏輯。雖然您可以在 token 計數請求中提供 `cache_control` 區塊，但提示快取僅在實際訊息建立期間發生。
  
</section>