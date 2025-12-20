# 结构化输出

从代理工作流中获取经过验证的 JSON 结果

---

结构化输出限制 Claude 的响应遵循特定的模式，确保有效的、可解析的输出用于下游处理。有两个互补的功能可用：

- **JSON 输出** (`output_format`)：获取 Claude 特定 JSON 格式的响应
- **严格工具使用** (`strict: true`)：保证工具名称和输入的模式验证

这些功能可以独立使用，也可以在同一请求中一起使用。

<Note>
结构化输出目前在 Claude API 中作为公开测试版功能提供，支持 Claude Sonnet 4.5、Claude Opus 4.1、Claude Opus 4.5 和 Claude Haiku 4.5。

要使用此功能，请设置 [beta 标头](/docs/zh-CN/api/beta-headers) `structured-outputs-2025-11-13`。
</Note>

<Tip>
使用此 [表单](https://forms.gle/BFnYc6iCkWoRzFgk7) 分享反馈。
</Tip>

## 为什么使用结构化输出

没有结构化输出，Claude 可能会生成格式错误的 JSON 响应或无效的工具输入，从而破坏您的应用程序。即使进行仔细的提示，您也可能遇到：
- 来自无效 JSON 语法的解析错误
- 缺少必需字段
- 数据类型不一致
- 需要错误处理和重试的模式违规

结构化输出通过约束解码保证模式兼容的响应：
- **始终有效**：不再有 `JSON.parse()` 错误
- **类型安全**：保证字段类型和必需字段
- **可靠**：不需要为模式违规重试

## JSON 输出

JSON 输出控制 Claude 的响应格式，确保 Claude 返回与您的模式匹配的有效 JSON。当您需要以下情况时，使用 JSON 输出：

- 控制 Claude 的响应格式
- 从图像或文本中提取数据
- 生成结构化报告
- 格式化 API 响应

### 快速开始

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

**响应格式：** 与您的模式匹配的有效 JSON，位于 `response.content[0].text` 中

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "plan_interest": "Enterprise",
  "demo_requested": true
}
```

### 工作原理

<Steps>
  <Step title="定义您的 JSON 模式">
    创建一个 JSON 模式，描述您希望 Claude 遵循的结构。该模式使用标准 JSON Schema 格式，但有一些限制（请参阅 [JSON Schema 限制](#json-schema-limitations)）。
  </Step>
  <Step title="添加 output_format 参数">
    在您的 API 请求中包含 `output_format` 参数，其中 `type: "json_schema"` 和您的模式定义。
  </Step>
  <Step title="包含 beta 标头">
    将 `anthropic-beta: structured-outputs-2025-11-13` 标头添加到您的请求中。
  </Step>
  <Step title="解析响应">
    Claude 的响应将是与您的模式匹配的有效 JSON，在 `response.content[0].text` 中返回。
  </Step>
</Steps>

### 在 SDK 中使用 JSON 输出

Python 和 TypeScript SDK 提供了帮助程序，使得使用 JSON 输出变得更容易，包括模式转换、自动验证和与流行模式库的集成。

#### 使用 Pydantic 和 Zod

对于 Python 和 TypeScript 开发人员，您可以使用熟悉的模式定义工具（如 Pydantic 和 Zod），而不是编写原始 JSON 模式。

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

**Python: `client.beta.messages.parse()` (推荐)**

`parse()` 方法自动转换您的 Pydantic 模型，验证响应，并返回 `parsed_output` 属性。

<Note>
`parse()` 方法在 `client.beta.messages` 上可用，而不是在 `client.messages` 上。
</Note>

<section title="示例用法">

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

**Python: `transform_schema()` 帮助程序**

用于在发送前手动转换模式，或当您想修改 Pydantic 生成的模式时。与 `client.beta.messages.parse()` 不同，后者自动转换提供的模式，这给您转换后的模式，以便您可以进一步自定义它。

<section title="示例用法">

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

#### SDK 转换如何工作

Python 和 TypeScript SDK 都自动转换具有不支持功能的模式：

1. **删除不支持的约束**（例如 `minimum`、`maximum`、`minLength`、`maxLength`）
2. **更新描述**，包含约束信息（例如"必须至少 100"），当约束不直接支持结构化输出时
3. **为所有对象添加 `additionalProperties: false`**
4. **过滤字符串格式**为仅支持的列表
5. **验证响应**是否符合您的原始模式（包含所有约束）

这意味着 Claude 接收简化的模式，但您的代码仍然通过验证强制执行所有约束。

**示例：** 具有 `minimum: 100` 的 Pydantic 字段在发送的模式中变成普通整数，但描述更新为"必须至少 100"，SDK 验证响应是否符合原始约束。

### 常见用例

<section title="数据提取">

从非结构化文本中提取结构化数据：

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

<section title="分类">

使用结构化类别对内容进行分类：

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

<section title="API 响应格式化">

生成 API 就绪的响应：

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

## 严格工具使用

严格工具使用验证工具参数，确保 Claude 使用正确类型的参数调用您的函数。当您需要以下情况时，使用严格工具使用：

- 验证工具参数
- 构建代理工作流
- 确保类型安全的函数调用
- 处理具有嵌套属性的复杂工具

### 为什么严格工具使用对代理很重要

构建可靠的代理系统需要保证模式一致性。没有严格模式，Claude 可能会返回不兼容的类型（`"2"` 而不是 `2`）或缺少必需字段，破坏您的函数并导致运行时错误。

严格工具使用保证类型安全的参数：
- 函数每次都接收正确类型的参数
- 不需要验证和重试工具调用
- 生产就绪的代理在规模上一致工作

例如，假设预订系统需要 `passengers: int`。没有严格模式，Claude 可能会提供 `passengers: "two"` 或 `passengers: "2"`。使用 `strict: true`，响应将始终包含 `passengers: 2`。

### 快速开始

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

**响应格式：** 在 `response.content[x].input` 中具有经过验证的输入的工具使用块

```json
{
  "type": "tool_use",
  "name": "get_weather",
  "input": {
    "location": "San Francisco, CA"
  }
}
```

**保证：**
- 工具 `input` 严格遵循 `input_schema`
- 工具 `name` 始终有效（来自提供的工具或服务器工具）

### 工作原理

<Steps>
  <Step title="定义您的工具模式">
    为您的工具的 `input_schema` 创建一个 JSON 模式。该模式使用标准 JSON Schema 格式，但有一些限制（请参阅 [JSON Schema 限制](#json-schema-limitations)）。
  </Step>
  <Step title="添加 strict: true">
    在您的工具定义中设置 `"strict": true` 作为顶级属性，与 `name`、`description` 和 `input_schema` 一起。
  </Step>
  <Step title="包含 beta 标头">
    将 `anthropic-beta: structured-outputs-2025-11-13` 标头添加到您的请求中。
  </Step>
  <Step title="处理工具调用">
    当 Claude 使用该工具时，工具使用块中的 `input` 字段将严格遵循您的 `input_schema`，`name` 将始终有效。
  </Step>
</Steps>

### 常见用例

<section title="经过验证的工具输入">

确保工具参数完全匹配您的模式：

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

<section title="具有多个经过验证工具的代理工作流">

使用保证的工具参数构建可靠的多步骤代理：

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

## 同时使用两个功能

JSON 输出和严格工具使用解决不同的问题，可以一起使用：

- **JSON 输出**控制 Claude 的响应格式（Claude 说什么）
- **严格工具使用**验证工具参数（Claude 如何调用您的函数）

结合使用时，Claude 可以使用保证有效的参数调用工具，并返回结构化的 JSON 响应。这对于需要可靠工具调用和结构化最终输出的代理工作流很有用。

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

## 重要考虑事项

### 语法编译和缓存

结构化输出使用具有编译语法工件的约束采样。这引入了一些需要注意的性能特征：

- **首次请求延迟**：第一次使用特定模式时，在编译语法时会有额外的延迟
- **自动缓存**：编译的语法从上次使用起缓存 24 小时，使后续请求快得多
- **缓存失效**：如果您更改以下内容，缓存将失效：
  - JSON 模式结构
  - 请求中的工具集（使用结构化输出和工具使用时）
  - 仅更改 `name` 或 `description` 字段不会使缓存失效

### 提示修改和令牌成本

使用结构化输出时，Claude 自动接收额外的系统提示，解释预期的输出格式。这意味着：

- 您的输入令牌计数将略高
- 注入的提示像任何其他系统提示一样花费您的令牌
- 更改 `output_format` 参数将使该对话线程的任何 [提示缓存](/docs/zh-CN/build-with-claude/prompt-caching) 失效

### JSON Schema 限制

结构化输出支持标准 JSON Schema，但有一些限制。JSON 输出和严格工具使用都共享这些限制。

<section title="支持的功能">

- 所有基本类型：object、array、string、integer、number、boolean、null
- `enum`（仅字符串、数字、布尔值或空值 - 无复杂类型）
- `const`
- `anyOf` 和 `allOf`（有限制 - 不支持带 `$ref` 的 `allOf`）
- `$ref`、`$def` 和 `definitions`（不支持外部 `$ref`）
- 所有支持类型的 `default` 属性
- `required` 和 `additionalProperties`（对象必须设置为 `false`）
- 字符串格式：`date-time`、`time`、`date`、`duration`、`email`、`hostname`、`uri`、`ipv4`、`ipv6`、`uuid`
- 数组 `minItems`（仅支持值 0 和 1）

</section>

<section title="不支持">

- 递归模式
- 枚举中的复杂类型
- 外部 `$ref`（例如 `'$ref': 'http://...'`）
- 数值约束（`minimum`、`maximum`、`multipleOf` 等）
- 字符串约束（`minLength`、`maxLength`）
- 超过 `minItems` 为 0 或 1 的数组约束
- `additionalProperties` 设置为 `false` 以外的任何值

如果您使用不支持的功能，您将收到 400 错误，其中包含详细信息。

</section>

<section title="模式支持（正则表达式）">

**支持的正则表达式功能：**
- 完全匹配（`^...$`）和部分匹配
- 量词：`*`、`+`、`?`、简单 `{n,m}` 情况
- 字符类：`[]`、`.`、`\d`、`\w`、`\s`
- 组：`(...)`

**不支持：**
- 对组的反向引用（例如 `\1`、`\2`）
- 前向/后向断言（例如 `(?=...)`、`(?!...)`）
- 单词边界：`\b`、`\B`
- 具有大范围的复杂 `{n,m}` 量词

简单的正则表达式模式效果很好。复杂的模式可能导致 400 错误。

</section>

<Tip>
Python 和 TypeScript SDK 可以通过删除不支持的功能并将约束添加到字段描述来自动转换模式。有关详细信息，请参阅 [SDK 特定方法](#sdk-specific-methods)。
</Tip>

### 无效输出

虽然结构化输出在大多数情况下保证模式合规性，但在某些情况下输出可能不匹配您的模式：

**拒绝** (`stop_reason: "refusal"`)

Claude 即使在使用结构化输出时也保持其安全性和有用性属性。如果 Claude 出于安全原因拒绝请求：

- 响应将具有 `stop_reason: "refusal"`
- 您将收到 200 状态代码
- 您将被计费生成的令牌
- 输出可能不匹配您的模式，因为拒绝消息优先于模式约束

**达到令牌限制** (`stop_reason: "max_tokens"`)

如果响应因达到 `max_tokens` 限制而被截断：

- 响应将具有 `stop_reason: "max_tokens"`
- 输出可能不完整且不匹配您的模式
- 使用更高的 `max_tokens` 值重试以获取完整的结构化输出

### 模式验证错误

如果您的模式使用不支持的功能或过于复杂，您将收到 400 错误：

**"模式中的递归定义过多"**
- 原因：模式具有过多或循环递归定义
- 解决方案：简化模式结构，减少嵌套深度

**"模式过于复杂"**
- 原因：模式超过复杂性限制
- 解决方案：分解为较小的模式，简化结构，或减少标记为 `strict: true` 的工具数量

对于有效模式的持续问题，请 [联系支持](https://support.claude.com/en/articles/9015913-how-to-get-support) 并提供您的模式定义。

## 功能兼容性

**适用于：**
- **[批处理](/docs/zh-CN/build-with-claude/batch-processing)**：以 50% 折扣大规模处理结构化输出
- **[令牌计数](/docs/zh-CN/build-with-claude/token-counting)**：计数令牌而不编译
- **[流式传输](/docs/zh-CN/build-with-claude/streaming)**：像普通响应一样流式传输结构化输出
- **组合使用**：在同一请求中一起使用 JSON 输出（`output_format`）和严格工具使用（`strict: true`）

**不兼容：**
- **[引用](/docs/zh-CN/build-with-claude/citations)**：引用需要将引用块与文本交错，这与严格 JSON 模式约束冲突。如果启用了引用的 `output_format`，返回 400 错误。
- **[消息预填充](/docs/zh-CN/build-with-claude/prompt-engineering/prefill-claudes-response)**：与 JSON 输出不兼容

<Tip>
**语法范围**：语法仅适用于 Claude 的直接输出，不适用于工具使用调用、工具结果或思考标签（使用 [扩展思考](/docs/zh-CN/build-with-claude/extended-thinking) 时）。语法状态在各部分之间重置，允许 Claude 自由思考，同时仍在最终响应中生成结构化输出。
</Tip>