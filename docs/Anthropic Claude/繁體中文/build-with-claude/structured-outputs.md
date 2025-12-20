# 結構化輸出

從代理工作流程中獲取經過驗證的 JSON 結果

---

結構化輸出限制 Claude 的回應遵循特定的架構，確保有效、可解析的輸出以供下游處理。有兩個互補的功能可用：

- **JSON 輸出** (`output_format`)：以特定的 JSON 格式獲取 Claude 的回應
- **嚴格工具使用** (`strict: true`)：保證工具名稱和輸入的架構驗證

這些功能可以獨立使用，也可以在同一個請求中一起使用。

<Note>
結構化輸出目前在 Claude API 中作為公開測試版功能提供，適用於 Claude Sonnet 4.5、Claude Opus 4.1、Claude Opus 4.5 和 Claude Haiku 4.5。

若要使用此功能，請設定 [測試版標頭](/docs/zh-TW/api/beta-headers) `structured-outputs-2025-11-13`。
</Note>

<Tip>
使用此 [表單](https://forms.gle/BFnYc6iCkWoRzFgk7) 分享回饋。
</Tip>

## 為什麼使用結構化輸出

沒有結構化輸出，Claude 可能會生成格式不正確的 JSON 回應或無效的工具輸入，導致應用程式中斷。即使進行仔細的提示，您也可能遇到：
- 來自無效 JSON 語法的解析錯誤
- 缺少必需欄位
- 不一致的資料類型
- 需要錯誤處理和重試的架構違規

結構化輸出通過受限解碼保證架構相容的回應：
- **始終有效**：不再有 `JSON.parse()` 錯誤
- **類型安全**：保證欄位類型和必需欄位
- **可靠**：不需要因架構違規而重試

## JSON 輸出

JSON 輸出控制 Claude 的回應格式，確保 Claude 返回與您的架構相符的有效 JSON。當您需要以下情況時，請使用 JSON 輸出：

- 控制 Claude 的回應格式
- 從圖像或文本中提取資料
- 生成結構化報告
- 格式化 API 回應

### 快速開始

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: structured-outputs-2025-11-13" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
      }
    ],
    "output_format": {
      "type": "json_schema",
      "schema": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "email": {"type": "string"},
          "plan_interest": {"type": "string"},
          "demo_requested": {"type": "boolean"}
        },
        "required": ["name", "email", "plan_interest", "demo_requested"],
        "additionalProperties": false
      }
    }
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {
            "role": "user",
            "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
        }
    ],
    output_format={
        "type": "json_schema",
        "schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "email": {"type": "string"},
                "plan_interest": {"type": "string"},
                "demo_requested": {"type": "boolean"}
            },
            "required": ["name", "email", "plan_interest", "demo_requested"],
            "additionalProperties": False
        }
    }
)
print(response.content[0].text)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  betas: ["structured-outputs-2025-11-13"],
  messages: [
    {
      role: "user",
      content: "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
    }
  ],
  output_format: {
    type: "json_schema",
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        plan_interest: { type: "string" },
        demo_requested: { type: "boolean" }
      },
      required: ["name", "email", "plan_interest", "demo_requested"],
      additionalProperties: false
    }
  }
});
console.log(response.content[0].text);
```

</CodeGroup>

**回應格式：** 在 `response.content[0].text` 中與您的架構相符的有效 JSON

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "plan_interest": "Enterprise",
  "demo_requested": true
}
```

### 運作方式

<Steps>
  <Step title="定義您的 JSON 架構">
    建立一個 JSON 架構，描述您希望 Claude 遵循的結構。該架構使用標準 JSON Schema 格式，但有一些限制（請參閱 [JSON Schema 限制](#json-schema-limitations)）。
  </Step>
  <Step title="新增 output_format 參數">
    在您的 API 請求中包含 `output_format` 參數，其中 `type: "json_schema"` 和您的架構定義。
  </Step>
  <Step title="包含測試版標頭">
    將 `anthropic-beta: structured-outputs-2025-11-13` 標頭新增到您的請求中。
  </Step>
  <Step title="解析回應">
    Claude 的回應將是與您的架構相符的有效 JSON，在 `response.content[0].text` 中返回。
  </Step>
</Steps>

### 在 SDK 中使用 JSON 輸出

Python 和 TypeScript SDK 提供了幫助程式，使得使用 JSON 輸出變得更容易，包括架構轉換、自動驗證和與流行架構庫的整合。

#### 使用 Pydantic 和 Zod

對於 Python 和 TypeScript 開發人員，您可以使用熟悉的架構定義工具（如 Pydantic 和 Zod），而不是編寫原始 JSON 架構。

<CodeGroup>

```python Python
from pydantic import BaseModel
from anthropic import Anthropic, transform_schema

class ContactInfo(BaseModel):
    name: str
    email: str
    plan_interest: str
    demo_requested: bool

client = Anthropic()

# With .create() - requires transform_schema()
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {
            "role": "user",
            "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
        }
    ],
    output_format={
        "type": "json_schema",
        "schema": transform_schema(ContactInfo),
    }
)

print(response.content[0].text)

# With .parse() - can pass Pydantic model directly
response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {
            "role": "user",
            "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
        }
    ],
    output_format=ContactInfo,
)

print(response.parsed_output)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';

const ContactInfoSchema = z.object({
  name: z.string(),
  email: z.string(),
  plan_interest: z.string(),
  demo_requested: z.boolean(),
});

const client = new Anthropic();

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  betas: ["structured-outputs-2025-11-13"],
  messages: [
    {
      role: "user",
      content: "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
    }
  ],
  output_format: betaZodOutputFormat(ContactInfoSchema),
});

// Automatically parsed and validated
console.log(response.parsed_output);
```

</CodeGroup>

#### SDK 特定方法

**Python：`client.beta.messages.parse()` （推薦）**

`parse()` 方法自動轉換您的 Pydantic 模型、驗證回應，並返回 `parsed_output` 屬性。

<Note>
`parse()` 方法在 `client.beta.messages` 上可用，而不是在 `client.messages` 上。
</Note>

<section title="使用範例">

```python
from pydantic import BaseModel
import anthropic

class ContactInfo(BaseModel):
    name: str
    email: str
    plan_interest: str

client = anthropic.Anthropic()

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    max_tokens=1024,
    messages=[{"role": "user", "content": "..."}],
    output_format=ContactInfo,
)

# Access the parsed output directly
contact = response.parsed_output
print(contact.name, contact.email)
```

</section>

**Python：`transform_schema()` 幫助程式**

用於當您需要在發送前手動轉換架構，或當您想修改 Pydantic 生成的架構時。與 `client.beta.messages.parse()` 不同，後者自動轉換提供的架構，這給您轉換後的架構，以便您可以進一步自訂它。

<section title="使用範例">

```python
from anthropic import transform_schema
from pydantic import TypeAdapter

# First convert Pydantic model to JSON schema, then transform
schema = TypeAdapter(ContactInfo).json_schema()
schema = transform_schema(schema)
# Modify schema if needed
schema["properties"]["custom_field"] = {"type": "string"}

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    max_tokens=1024,
    output_format=schema,
    messages=[{"role": "user", "content": "..."}],
)
```

</section>

#### SDK 轉換如何運作

Python 和 TypeScript SDK 自動轉換具有不支援功能的架構：

1. **移除不支援的約束**（例如 `minimum`、`maximum`、`minLength`、`maxLength`）
2. **更新描述**，包含約束資訊（例如「必須至少 100」），當結構化輸出不直接支援該約束時
3. **將 `additionalProperties: false` 新增**到所有物件
4. **篩選字串格式**為僅支援的清單
5. **驗證回應**是否符合您的原始架構（包含所有約束）

這意味著 Claude 收到簡化的架構，但您的程式碼仍然通過驗證強制執行所有約束。

**範例：** 具有 `minimum: 100` 的 Pydantic 欄位在發送的架構中變成純整數，但描述會更新為「必須至少 100」，SDK 會根據原始約束驗證回應。

### 常見使用案例

<section title="資料提取">

從非結構化文本中提取結構化資料：

<CodeGroup>

```python Python
from pydantic import BaseModel
from typing import List

class Invoice(BaseModel):
    invoice_number: str
    date: str
    total_amount: float
    line_items: List[dict]
    customer_name: str

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    output_format=Invoice,
    messages=[{"role": "user", "content": f"Extract invoice data from: {invoice_text}"}]
)
```

```typescript TypeScript
import { z } from 'zod';

const InvoiceSchema = z.object({
  invoice_number: z.string(),
  date: z.string(),
  total_amount: z.number(),
  line_items: z.array(z.record(z.any())),
  customer_name: z.string(),
});

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  output_format: InvoiceSchema,
  messages: [{"role": "user", "content": `Extract invoice data from: ${invoiceText}`}]
});
```

</CodeGroup>

</section>

<section title="分類">

使用結構化類別進行內容分類：

<CodeGroup>

```python Python
from pydantic import BaseModel
from typing import List

class Classification(BaseModel):
    category: str
    confidence: float
    tags: List[str]
    sentiment: str

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    output_format=Classification,
    messages=[{"role": "user", "content": f"Classify this feedback: {feedback_text}"}]
)
```

```typescript TypeScript
import { z } from 'zod';

const ClassificationSchema = z.object({
  category: z.string(),
  confidence: z.number(),
  tags: z.array(z.string()),
  sentiment: z.string(),
});

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  output_format: ClassificationSchema,
  messages: [{"role": "user", "content": `Classify this feedback: ${feedbackText}`}]
});
```

</CodeGroup>

</section>

<section title="API 回應格式化">

生成 API 就緒的回應：

<CodeGroup>

```python Python
from pydantic import BaseModel
from typing import List, Optional

class APIResponse(BaseModel):
    status: str
    data: dict
    errors: Optional[List[dict]]
    metadata: dict

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    output_format=APIResponse,
    messages=[{"role": "user", "content": "Process this request: ..."}]
)
```

```typescript TypeScript
import { z } from 'zod';

const APIResponseSchema = z.object({
  status: z.string(),
  data: z.record(z.any()),
  errors: z.array(z.record(z.any())).optional(),
  metadata: z.record(z.any()),
});

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  output_format: APIResponseSchema,
  messages: [{"role": "user", "content": "Process this request: ..."}]
});
```

</CodeGroup>

</section>

## 嚴格工具使用

嚴格工具使用驗證工具參數，確保 Claude 使用正確類型的引數呼叫您的函式。當您需要以下情況時，請使用嚴格工具使用：

- 驗證工具參數
- 建立代理工作流程
- 確保類型安全的函式呼叫
- 處理具有嵌套屬性的複雜工具

### 為什麼嚴格工具使用對代理很重要

建立可靠的代理系統需要保證架構相容性。沒有嚴格模式，Claude 可能會返回不相容的類型（`"2"` 而不是 `2`）或缺少必需欄位，導致函式中斷並造成執行時錯誤。

嚴格工具使用保證類型安全的參數：
- 函式每次都會收到正確類型的引數
- 不需要驗證和重試工具呼叫
- 生產就緒的代理，可在規模上一致運作

例如，假設預訂系統需要 `passengers: int`。沒有嚴格模式，Claude 可能會提供 `passengers: "two"` 或 `passengers: "2"`。使用 `strict: true`，回應將始終包含 `passengers: 2`。

### 快速開始

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: structured-outputs-2025-11-13" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "What is the weather in San Francisco?"}
    ],
    "tools": [{
      "name": "get_weather",
      "description": "Get the current weather in a given location",
      "strict": true,
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "The city and state, e.g. San Francisco, CA"
          },
          "unit": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"]
          }
        },
        "required": ["location"],
        "additionalProperties": false
      }
    }]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {"role": "user", "content": "What's the weather like in San Francisco?"}
    ],
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "strict": True,  # Enable strict mode
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"],
                "additionalProperties": False
            }
        }
    ]
)
print(response.content)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  betas: ["structured-outputs-2025-11-13"],
  messages: [
    {
      role: "user",
      content: "What's the weather like in San Francisco?"
    }
  ],
  tools: [{
    name: "get_weather",
    description: "Get the current weather in a given location",
    strict: true,  // Enable strict mode
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA"
        },
        unit: {
          type: "string",
          enum: ["celsius", "fahrenheit"]
        }
      },
      required: ["location"],
      additionalProperties: false
    }
  }]
});
console.log(response.content);
```

</CodeGroup>

**回應格式：** 在 `response.content[x].input` 中具有經過驗證的輸入的工具使用區塊

```json
{
  "type": "tool_use",
  "name": "get_weather",
  "input": {
    "location": "San Francisco, CA"
  }
}
```

**保證：**
- 工具 `input` 嚴格遵循 `input_schema`
- 工具 `name` 始終有效（來自提供的工具或伺服器工具）

### 運作方式

<Steps>
  <Step title="定義您的工具架構">
    為您的工具的 `input_schema` 建立一個 JSON 架構。該架構使用標準 JSON Schema 格式，但有一些限制（請參閱 [JSON Schema 限制](#json-schema-limitations)）。
  </Step>
  <Step title="新增 strict: true">
    在您的工具定義中設定 `"strict": true` 作為頂級屬性，與 `name`、`description` 和 `input_schema` 一起。
  </Step>
  <Step title="包含測試版標頭">
    將 `anthropic-beta: structured-outputs-2025-11-13` 標頭新增到您的請求中。
  </Step>
  <Step title="處理工具呼叫">
    當 Claude 使用工具時，工具使用區塊中的 `input` 欄位將嚴格遵循您的 `input_schema`，`name` 將始終有效。
  </Step>
</Steps>

### 常見使用案例

<section title="經過驗證的工具輸入">

確保工具參數完全符合您的架構：

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    messages=[{"role": "user", "content": "Search for flights to Tokyo"}],
    tools=[{
        "name": "search_flights",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "destination": {"type": "string"},
                "departure_date": {"type": "string", "format": "date"},
                "passengers": {"type": "integer", "enum": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            },
            "required": ["destination", "departure_date"],
            "additionalProperties": False
        }
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  messages: [{"role": "user", "content": "Search for flights to Tokyo"}],
  tools: [{
    name: "search_flights",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        destination: {type: "string"},
        departure_date: {type: "string", format: "date"},
        passengers: {type: "integer", enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      },
      required: ["destination", "departure_date"],
      additionalProperties: false
    }
  }]
});
```

</CodeGroup>

</section>

<section title="具有多個經過驗證工具的代理工作流程">

使用保證的工具參數建立可靠的多步驟代理：

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    messages=[{"role": "user", "content": "Help me plan a trip to Paris for 2 people"}],
    tools=[
        {
            "name": "search_flights",
            "strict": True,
            "input_schema": {
                "type": "object",
                "properties": {
                    "origin": {"type": "string"},
                    "destination": {"type": "string"},
                    "departure_date": {"type": "string", "format": "date"},
                    "travelers": {"type": "integer", "enum": [1, 2, 3, 4, 5, 6]}
                },
                "required": ["origin", "destination", "departure_date"],
                "additionalProperties": False
            }
        },
        {
            "name": "search_hotels",
            "strict": True,
            "input_schema": {
                "type": "object",
                "properties": {
                    "city": {"type": "string"},
                    "check_in": {"type": "string", "format": "date"},
                    "guests": {"type": "integer", "enum": [1, 2, 3, 4]}
                },
                "required": ["city", "check_in"],
                "additionalProperties": False
            }
        }
    ]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  messages: [{"role": "user", "content": "Help me plan a trip to Paris for 2 people"}],
  tools: [
    {
      name: "search_flights",
      strict: true,
      input_schema: {
        type: "object",
        properties: {
          origin: {type: "string"},
          destination: {type: "string"},
          departure_date: {type: "string", format: "date"},
          travelers: {type: "integer", enum: [1, 2, 3, 4, 5, 6]}
        },
        required: ["origin", "destination", "departure_date"],
        additionalProperties: false
      }
    },
    {
      name: "search_hotels",
      strict: true,
      input_schema: {
        type: "object",
        properties: {
          city: {type: "string"},
          check_in: {type: "string", format: "date"},
          guests: {type: "integer", enum: [1, 2, 3, 4]}
        },
        required: ["city", "check_in"],
        additionalProperties: false
      }
    }
  ]
});
```

</CodeGroup>

</section>

## 同時使用兩個功能

JSON 輸出和嚴格工具使用解決不同的問題，可以一起使用：

- **JSON 輸出**控制 Claude 的回應格式（Claude 說什麼）
- **嚴格工具使用**驗證工具參數（Claude 如何呼叫您的函式）

結合使用時，Claude 可以使用保證有效的參數呼叫工具，並返回結構化的 JSON 回應。這對於需要可靠工具呼叫和結構化最終輸出的代理工作流程很有用。

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    max_tokens=1024,
    messages=[{"role": "user", "content": "Help me plan a trip to Paris for next month"}],
    # JSON outputs: structured response format
    output_format={
        "type": "json_schema",
        "schema": {
            "type": "object",
            "properties": {
                "summary": {"type": "string"},
                "next_steps": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["summary", "next_steps"],
            "additionalProperties": False
        }
    },
    # Strict tool use: guaranteed tool parameters
    tools=[{
        "name": "search_flights",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "destination": {"type": "string"},
                "date": {"type": "string", "format": "date"}
            },
            "required": ["destination", "date"],
            "additionalProperties": False
        }
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  max_tokens: 1024,
  messages: [{ role: "user", content: "Help me plan a trip to Paris for next month" }],
  // JSON outputs: structured response format
  output_format: {
    type: "json_schema",
    schema: {
      type: "object",
      properties: {
        summary: { type: "string" },
        next_steps: { type: "array", items: { type: "string" } }
      },
      required: ["summary", "next_steps"],
      additionalProperties: false
    }
  },
  // Strict tool use: guaranteed tool parameters
  tools: [{
    name: "search_flights",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        destination: { type: "string" },
        date: { type: "string", format: "date" }
      },
      required: ["destination", "date"],
      additionalProperties: false
    }
  }]
});
```

</CodeGroup>

## 重要考量

### 文法編譯和快取

結構化輸出使用具有編譯文法成品的受限採樣。這引入了一些需要注意的效能特性：

- **首次請求延遲**：第一次使用特定架構時，在編譯文法時會有額外的延遲
- **自動快取**：編譯的文法會快取 24 小時（從上次使用開始），使後續請求快得多
- **快取失效**：如果您變更以下內容，快取將失效：
  - JSON 架構結構
  - 您請求中的工具集（使用結構化輸出和工具使用時）
  - 僅變更 `name` 或 `description` 欄位不會使快取失效

### 提示修改和令牌成本

使用結構化輸出時，Claude 會自動收到一個額外的系統提示，說明預期的輸出格式。這意味著：

- 您的輸入令牌計數將略高
- 注入的提示會像任何其他系統提示一樣消耗您的令牌
- 變更 `output_format` 參數將使該對話執行緒的任何 [提示快取](/docs/zh-TW/build-with-claude/prompt-caching) 失效

### JSON Schema 限制

結構化輸出支援標準 JSON Schema，但有一些限制。JSON 輸出和嚴格工具使用都共享這些限制。

<section title="支援的功能">

- 所有基本類型：object、array、string、integer、number、boolean、null
- `enum`（僅字串、數字、布林值或空值 - 無複雜類型）
- `const`
- `anyOf` 和 `allOf`（有限制 - 不支援帶 `$ref` 的 `allOf`）
- `$ref`、`$def` 和 `definitions`（不支援外部 `$ref`）
- 所有支援類型的 `default` 屬性
- `required` 和 `additionalProperties`（必須為物件設定為 `false`）
- 字串格式：`date-time`、`time`、`date`、`duration`、`email`、`hostname`、`uri`、`ipv4`、`ipv6`、`uuid`
- 陣列 `minItems`（僅支援值 0 和 1）

</section>

<section title="不支援">

- 遞迴架構
- 列舉中的複雜類型
- 外部 `$ref`（例如 `'$ref': 'http://...'`）
- 數值約束（`minimum`、`maximum`、`multipleOf` 等）
- 字串約束（`minLength`、`maxLength`）
- 超過 `minItems` 為 0 或 1 的陣列約束
- `additionalProperties` 設定為 `false` 以外的任何值

如果您使用不支援的功能，您將收到 400 錯誤，其中包含詳細資訊。

</section>

<section title="模式支援（正規表達式）">

**支援的正規表達式功能：**
- 完全匹配（`^...$`）和部分匹配
- 量詞：`*`、`+`、`?`、簡單 `{n,m}` 情況
- 字元類別：`[]`、`.`、`\d`、`\w`、`\s`
- 群組：`(...)`

**不支援：**
- 群組的反向參考（例如 `\1`、`\2`）
- 前瞻/後顧斷言（例如 `(?=...)`、`(?!...)`）
- 字邊界：`\b`、`\B`
- 複雜 `{n,m}` 量詞，範圍大

簡單的正規表達式模式運作良好。複雜的模式可能會導致 400 錯誤。

</section>

<Tip>
Python 和 TypeScript SDK 可以通過移除不支援的功能並將約束新增到欄位描述中來自動轉換架構。有關詳細資訊，請參閱 [SDK 特定方法](#sdk-specific-methods)。
</Tip>

### 無效輸出

雖然結構化輸出在大多數情況下保證架構相容性，但在某些情況下輸出可能不符合您的架構：

**拒絕** (`stop_reason: "refusal"`)

Claude 即使在使用結構化輸出時也保持其安全性和有用性屬性。如果 Claude 因安全原因拒絕請求：

- 回應將具有 `stop_reason: "refusal"`
- 您將收到 200 狀態碼
- 您將被計費生成的令牌
- 輸出可能不符合您的架構，因為拒絕訊息優先於架構約束

**達到令牌限制** (`stop_reason: "max_tokens"`)

如果回應因達到 `max_tokens` 限制而被截斷：

- 回應將具有 `stop_reason: "max_tokens"`
- 輸出可能不完整且不符合您的架構
- 使用更高的 `max_tokens` 值重試以獲得完整的結構化輸出

### 架構驗證錯誤

如果您的架構使用不支援的功能或過於複雜，您將收到 400 錯誤：

**「架構中有太多遞迴定義」**
- 原因：架構具有過度或循環遞迴定義
- 解決方案：簡化架構結構，減少嵌套深度

**「架構過於複雜」**
- 原因：架構超過複雜性限制
- 解決方案：分解為較小的架構、簡化結構，或減少標記為 `strict: true` 的工具數量

如有有效架構的持續問題，請 [聯絡支援](https://support.claude.com/en/articles/9015913-how-to-get-support) 並提供您的架構定義。

## 功能相容性

**適用於：**
- **[批次處理](/docs/zh-TW/build-with-claude/batch-processing)**：以 50% 折扣大規模處理結構化輸出
- **[令牌計數](/docs/zh-TW/build-with-claude/token-counting)**：計數令牌而不進行編譯
- **[串流](/docs/zh-TW/build-with-claude/streaming)**：像正常回應一樣串流結構化輸出
- **組合使用**：在同一個請求中同時使用 JSON 輸出（`output_format`）和嚴格工具使用（`strict: true`）

**不相容於：**
- **[引用](/docs/zh-TW/build-with-claude/citations)**：引用需要將引用區塊與文本交錯，這與嚴格 JSON 架構約束衝突。如果啟用引用和 `output_format`，則返回 400 錯誤。
- **[訊息預填充](/docs/zh-TW/build-with-claude/prompt-engineering/prefill-claudes-response)**：與 JSON 輸出不相容

<Tip>
**文法範圍**：文法僅適用於 Claude 的直接輸出，不適用於工具使用呼叫、工具結果或思考標籤（使用 [延伸思考](/docs/zh-TW/build-with-claude/extended-thinking) 時）。文法狀態在各部分之間重置，允許 Claude 自由思考，同時仍在最終回應中產生結構化輸出。
</Tip>