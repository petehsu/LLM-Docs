# 構造化された出力

エージェントワークフローから検証済みのJSON結果を取得

---

構造化された出力は、Claude の応答を特定のスキーマに従うように制限し、ダウンストリーム処理のための有効で解析可能な出力を保証します。2 つの補完的な機能が利用可能です:

- **JSON 出力** (`output_format`): Claude の応答を特定の JSON 形式で取得
- **厳密なツール使用** (`strict: true`): ツール名と入力のスキーマ検証を保証

これらの機能は、同じリクエスト内で独立して、または一緒に使用できます。

<Note>
構造化された出力は現在、Claude API のパブリックベータ機能として、Claude Sonnet 4.5、Claude Opus 4.1、Claude Opus 4.5、および Claude Haiku 4.5 で利用可能です。

この機能を使用するには、[ベータヘッダー](/docs/ja/api/beta-headers) `structured-outputs-2025-11-13` を設定してください。
</Note>

<Tip>
このフォーム[form](https://forms.gle/BFnYc6iCkWoRzFgk7)を使用してフィードバックを共有してください。
</Tip>

## 構造化された出力を使用する理由

構造化された出力がない場合、Claude は不正な形式の JSON 応答または無効なツール入力を生成し、アプリケーションを破壊する可能性があります。注意深いプロンプトを使用しても、以下の問題が発生する可能性があります:
- 無効な JSON 構文からの解析エラー
- 必須フィールドの欠落
- 一貫性のないデータ型
- エラー処理と再試行が必要なスキーマ違反

構造化された出力は、制約付きデコーディングを通じてスキーマ準拠の応答を保証します:
- **常に有効**: `JSON.parse()` エラーはもうありません
- **型安全**: フィールド型と必須フィールドが保証されます
- **信頼性**: スキーマ違反の再試行は不要です

## JSON 出力

JSON 出力は Claude の応答形式を制御し、Claude がスキーマに一致する有効な JSON を返すことを保証します。以下の場合に JSON 出力を使用してください:

- Claude の応答形式を制御したい
- 画像またはテキストからデータを抽出したい
- 構造化されたレポートを生成したい
- API 応答をフォーマットしたい

### クイックスタート

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

**応答形式:** `response.content[0].text` のスキーマに一致する有効な JSON

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "plan_interest": "Enterprise",
  "demo_requested": true
}
```

### 仕組み

<Steps>
  <Step title="JSON スキーマを定義する">
    Claude が従うべき構造を説明する JSON スキーマを作成します。スキーマは標準 JSON Schema 形式を使用していますが、いくつかの制限があります ([JSON スキーマの制限](#json-schema-limitations)を参照)。
  </Step>
  <Step title="output_format パラメータを追加する">
    API リクエストに `output_format` パラメータを含め、`type: "json_schema"` とスキーマ定義を指定します。
  </Step>
  <Step title="ベータヘッダーを含める">
    リクエストに `anthropic-beta: structured-outputs-2025-11-13` ヘッダーを追加します。
  </Step>
  <Step title="応答を解析する">
    Claude の応答はスキーマに一致する有効な JSON となり、`response.content[0].text` で返されます。
  </Step>
</Steps>

### SDK で JSON 出力を操作する

Python および TypeScript SDK は、スキーマ変換、自動検証、および一般的なスキーマライブラリとの統合を含む、JSON 出力の操作を容易にするヘルパーを提供します。

#### Pydantic と Zod の使用

Python および TypeScript 開発者の場合、生の JSON スキーマを記述する代わりに、Pydantic や Zod などの使い慣れたスキーマ定義ツールを使用できます。

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

#### SDK 固有のメソッド

**Python: `client.beta.messages.parse()` (推奨)**

`parse()` メソッドは Pydantic モデルを自動的に変換し、応答を検証し、`parsed_output` 属性を返します。

<Note>
`parse()` メソッドは `client.messages` ではなく `client.beta.messages` で利用可能です。
</Note>

<section title="使用例">

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

**Python: `transform_schema()` ヘルパー**

スキーマを送信する前に手動で変換する必要がある場合、または Pydantic で生成されたスキーマを変更したい場合に使用します。`client.beta.messages.parse()` は提供されたスキーマを自動的に変換しますが、これは変換されたスキーマを提供するため、さらにカスタマイズできます。

<section title="使用例">

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

#### SDK 変換の仕組み

Python および TypeScript SDK は、サポートされていない機能を持つスキーマを自動的に変換します:

1. **サポートされていない制約を削除** (例: `minimum`、`maximum`、`minLength`、`maxLength`)
2. **説明を更新** 制約情報を含める (例: "100 以上である必要があります")、制約が構造化された出力で直接サポートされていない場合
3. **すべてのオブジェクトに `additionalProperties: false` を追加**
4. **文字列形式をサポートされているリストのみにフィルタリング**
5. **元のスキーマに対して応答を検証** (すべての制約を含む)

これは、Claude が簡略化されたスキーマを受け取ることを意味しますが、コードは検証を通じてすべての制約を強制します。

**例:** `minimum: 100` を持つ Pydantic フィールドは、送信されたスキーマではプレーン整数になりますが、説明は「100 以上である必要があります」に更新され、SDK は元の制約に対して応答を検証します。

### 一般的なユースケース

<section title="データ抽出">

非構造化テキストから構造化データを抽出:

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

構造化されたカテゴリでコンテンツを分類:

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

<section title="API 応答フォーマット">

API 対応の応答を生成:

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

## 厳密なツール使用

厳密なツール使用はツールパラメータを検証し、Claude が正しく型付けされた引数でツールを呼び出すことを保証します。以下の場合に厳密なツール使用を使用してください:

- ツールパラメータを検証したい
- エージェンティックワークフローを構築したい
- 型安全な関数呼び出しを保証したい
- ネストされたプロパティを持つ複雑なツールを処理したい

### エージェントにとって厳密なツール使用が重要な理由

信頼性の高いエージェンティックシステムを構築するには、スキーマの準拠を保証する必要があります。厳密モードがない場合、Claude は互換性のない型 (`"2"` の代わりに `2`) または必須フィールドの欠落を返す可能性があり、関数を破壊し、ランタイムエラーを引き起こします。

厳密なツール使用は型安全なパラメータを保証します:
- 関数は毎回正しく型付けされた引数を受け取ります
- ツール呼び出しを検証して再試行する必要がありません
- 本番環境対応のエージェントが規模に応じて一貫して動作します

例えば、予約システムが `passengers: int` を必要とするとします。厳密モードがない場合、Claude は `passengers: "two"` または `passengers: "2"` を提供する可能性があります。`strict: true` を使用すると、応答は常に `passengers: 2` を含みます。

### クイックスタート

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

**応答形式:** `response.content[x].input` で検証された入力を持つツール使用ブロック

```json
{
  "type": "tool_use",
  "name": "get_weather",
  "input": {
    "location": "San Francisco, CA"
  }
}
```

**保証:**
- ツール `input` は `input_schema` に厳密に従います
- ツール `name` は常に有効です (提供されたツールまたはサーバーツールから)

### 仕組み

<Steps>
  <Step title="ツールスキーマを定義する">
    ツールの `input_schema` 用に JSON スキーマを作成します。スキーマは標準 JSON Schema 形式を使用していますが、いくつかの制限があります ([JSON スキーマの制限](#json-schema-limitations)を参照)。
  </Step>
  <Step title="strict: true を追加する">
    ツール定義で `"strict": true` をトップレベルプロパティとして設定し、`name`、`description`、`input_schema` と並べて配置します。
  </Step>
  <Step title="ベータヘッダーを含める">
    リクエストに `anthropic-beta: structured-outputs-2025-11-13` ヘッダーを追加します。
  </Step>
  <Step title="ツール呼び出しを処理する">
    Claude がツールを使用するとき、tool_use ブロック内の `input` フィールドは `input_schema` に厳密に従い、`name` は常に有効です。
  </Step>
</Steps>

### 一般的なユースケース

<section title="検証されたツール入力">

ツールパラメータがスキーマに正確に一致することを確認:

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

<section title="複数の検証されたツールを持つエージェンティックワークフロー">

保証されたツールパラメータを持つ信頼性の高いマルチステップエージェントを構築:

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

## 両方の機能を一緒に使用する

JSON 出力と厳密なツール使用は異なる問題を解決し、一緒に使用できます:

- **JSON 出力** Claude の応答形式を制御します (Claude が何を言うか)
- **厳密なツール使用** ツールパラメータを検証します (Claude がどのように関数を呼び出すか)

組み合わせると、Claude は保証された有効なパラメータを持つツールを呼び出し、構造化された JSON 応答を返すことができます。これは、信頼性の高いツール呼び出しと構造化された最終出力の両方が必要なエージェンティックワークフローに役立ちます。

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

## 重要な考慮事項

### 文法コンパイルとキャッシング

構造化された出力は、コンパイルされた文法アーティファクトを使用した制約付きサンプリングを使用します。これにより、認識する必要があるいくつかのパフォーマンス特性が導入されます:

- **最初のリクエストレイテンシ**: 特定のスキーマを初めて使用するとき、文法がコンパイルされている間に追加のレイテンシが発生します
- **自動キャッシング**: コンパイルされた文法は最後の使用から 24 時間キャッシュされ、その後のリクエストがはるかに高速になります
- **キャッシュ無効化**: 以下を変更した場合、キャッシュは無効化されます:
  - JSON スキーマ構造
  - リクエスト内のツールセット (構造化された出力とツール使用の両方を使用する場合)
  - `name` または `description` フィールドのみを変更してもキャッシュは無効化されません

### プロンプト変更とトークンコスト

構造化された出力を使用する場合、Claude は自動的に予想される出力形式を説明する追加のシステムプロンプトを受け取ります。これは以下を意味します:

- 入力トークン数がわずかに増加します
- 注入されたプロンプトは他のシステムプロンプトと同様にトークンがかかります
- `output_format` パラメータを変更すると、その会話スレッドの [プロンプトキャッシュ](/docs/ja/build-with-claude/prompt-caching) が無効化されます

### JSON スキーマの制限

構造化された出力は標準 JSON Schema をサポートしていますが、いくつかの制限があります。JSON 出力と厳密なツール使用の両方がこれらの制限を共有します。

<section title="サポートされている機能">

- すべての基本型: object、array、string、integer、number、boolean、null
- `enum` (文字列、数値、ブール値、またはヌルのみ - 複雑な型ではない)
- `const`
- `anyOf` および `allOf` (制限あり - `$ref` を持つ `allOf` はサポートされていません)
- `$ref`、`$def`、および `definitions` (外部 `$ref` はサポートされていません)
- すべてのサポートされている型の `default` プロパティ
- `required` および `additionalProperties` (`additionalProperties` はオブジェクトに対して `false` に設定する必要があります)
- 文字列形式: `date-time`、`time`、`date`、`duration`、`email`、`hostname`、`uri`、`ipv4`、`ipv6`、`uuid`
- 配列 `minItems` (0 と 1 の値のみサポート)

</section>

<section title="サポートされていない">

- 再帰的スキーマ
- 列挙内の複雑な型
- 外部 `$ref` (例: `'$ref': 'http://...'`)
- 数値制約 (`minimum`、`maximum`、`multipleOf` など)
- 文字列制約 (`minLength`、`maxLength`)
- 0 または 1 の `minItems` を超える配列制約
- `additionalProperties` が `false` 以外に設定されている

サポートされていない機能を使用する場合、詳細を含む 400 エラーが表示されます。

</section>

<section title="パターンサポート (正規表現)">

**サポートされている正規表現機能:**
- 完全一致 (`^...$`) と部分一致
- 量指定子: `*`、`+`、`?`、シンプルな `{n,m}` ケース
- 文字クラス: `[]`、`.`、`\d`、`\w`、`\s`
- グループ: `(...)`

**サポートされていない:**
- グループへの後方参照 (例: `\1`、`\2`)
- 先読み/後読みアサーション (例: `(?=...)`、`(?!...)`)
- 単語境界: `\b`、`\B`
- 複雑な `{n,m}` 量指定子と大きな範囲

シンプルな正規表現パターンはうまく機能します。複雑なパターンは 400 エラーになる可能性があります。

</section>

<Tip>
Python および TypeScript SDK は、サポートされていない機能を削除し、フィールド説明に制約を追加することで、スキーマを自動的に変換できます。詳細については、[SDK 固有のメソッド](#sdk-specific-methods)を参照してください。
</Tip>

### 無効な出力

構造化された出力はほとんどの場合、スキーマ準拠を保証しますが、出力がスキーマに一致しないシナリオがあります:

**拒否** (`stop_reason: "refusal"`)

Claude は構造化された出力を使用する場合でも、安全性と有用性のプロパティを維持します。Claude が安全上の理由でリクエストを拒否する場合:

- 応答は `stop_reason: "refusal"` を持ちます
- 200 ステータスコードを受け取ります
- 生成されたトークンに対して課金されます
- 拒否メッセージがスキーマ制約よりも優先されるため、出力がスキーマに一致しない可能性があります

**トークン制限に達した** (`stop_reason: "max_tokens"`)

`max_tokens` 制限に達したため応答が切断された場合:

- 応答は `stop_reason: "max_tokens"` を持ちます
- 出力は不完全で、スキーマに一致しない可能性があります
- より高い `max_tokens` 値で再試行して、完全な構造化出力を取得します

### スキーマ検証エラー

スキーマがサポートされていない機能を使用しているか、複雑すぎる場合、400 エラーが表示されます:

**"スキーマ内の再帰定義が多すぎます"**
- 原因: スキーマに過度な、または循環的な再帰定義があります
- 解決策: スキーマ構造を簡素化し、ネストの深さを減らします

**"スキーマが複雑すぎます"**
- 原因: スキーマが複雑さの制限を超えています
- 解決策: より小さなスキーマに分割し、構造を簡素化するか、`strict: true` としてマークされたツールの数を減らします

永続的な問題がある有効なスキーマについては、スキーマ定義を含めて [サポートに連絡](https://support.claude.com/en/articles/9015913-how-to-get-support) してください。

## 機能の互換性

**動作:**
- **[バッチ処理](/docs/ja/build-with-claude/batch-processing)**: 50% 割引で規模に応じて構造化された出力を処理
- **[トークンカウント](/docs/ja/build-with-claude/token-counting)**: コンパイルなしでトークンをカウント
- **[ストリーミング](/docs/ja/build-with-claude/streaming)**: 通常の応答のように構造化された出力をストリーム
- **組み合わせ使用**: 同じリクエスト内で JSON 出力 (`output_format`) と厳密なツール使用 (`strict: true`) を一緒に使用

**互換性なし:**
- **[引用](/docs/ja/build-with-claude/citations)**: 引用はテキストと引用ブロックをインターリーブする必要があり、これは厳密な JSON スキーマ制約と競合します。`output_format` で引用が有効な場合、400 エラーを返します。
- **[メッセージプリフィリング](/docs/ja/build-with-claude/prompt-engineering/prefill-claudes-response)**: JSON 出力と互換性がありません

<Tip>
**文法スコープ**: 文法は Claude の直接出力にのみ適用され、ツール使用呼び出し、ツール結果、または思考タグ ([拡張思考](/docs/ja/build-with-claude/extended-thinking) を使用する場合) には適用されません。文法状態はセクション間でリセットされ、Claude が自由に考えることができながら、最終応答で構造化された出力を生成できます。
</Tip>