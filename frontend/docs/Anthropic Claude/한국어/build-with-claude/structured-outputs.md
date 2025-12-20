# 구조화된 출력

에이전트 워크플로우에서 검증된 JSON 결과 얻기

---

구조화된 출력은 Claude의 응답을 특정 스키마를 따르도록 제한하여 다운스트림 처리를 위한 유효하고 파싱 가능한 출력을 보장합니다. 두 가지 상호 보완적인 기능을 사용할 수 있습니다:

- **JSON 출력** (`output_format`): Claude의 응답을 특정 JSON 형식으로 얻기
- **엄격한 도구 사용** (`strict: true`): 도구 이름 및 입력에 대한 스키마 검증 보장

이러한 기능은 독립적으로 또는 동일한 요청에서 함께 사용할 수 있습니다.

<Note>
구조화된 출력은 현재 Claude Sonnet 4.5, Claude Opus 4.1, Claude Opus 4.5, Claude Haiku 4.5에 대한 Claude API의 공개 베타 기능으로 사용 가능합니다.

이 기능을 사용하려면 [베타 헤더](/docs/ko/api/beta-headers) `structured-outputs-2025-11-13`을 설정하세요.
</Note>

<Tip>
이 [양식](https://forms.gle/BFnYc6iCkWoRzFgk7)을 사용하여 피드백을 공유하세요.
</Tip>

## 구조화된 출력을 사용하는 이유

구조화된 출력이 없으면 Claude는 잘못된 형식의 JSON 응답이나 애플리케이션을 중단시키는 유효하지 않은 도구 입력을 생성할 수 있습니다. 신중한 프롬프팅을 사용하더라도 다음과 같은 문제가 발생할 수 있습니다:
- 유효하지 않은 JSON 구문으로 인한 파싱 오류
- 필수 필드 누락
- 일관성 없는 데이터 타입
- 오류 처리 및 재시도가 필요한 스키마 위반

구조화된 출력은 제약된 디코딩을 통해 스키마 준수 응답을 보장합니다:
- **항상 유효함**: 더 이상 `JSON.parse()` 오류 없음
- **타입 안전**: 보장된 필드 타입 및 필수 필드
- **신뢰할 수 있음**: 스키마 위반으로 인한 재시도 불필요

## JSON 출력

JSON 출력은 Claude의 응답 형식을 제어하여 Claude가 스키마와 일치하는 유효한 JSON을 반환하도록 합니다. 다음이 필요한 경우 JSON 출력을 사용하세요:

- Claude의 응답 형식 제어
- 이미지 또는 텍스트에서 데이터 추출
- 구조화된 보고서 생성
- API 응답 형식 지정

### 빠른 시작

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

**응답 형식:** `response.content[0].text`에서 스키마와 일치하는 유효한 JSON

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "plan_interest": "Enterprise",
  "demo_requested": true
}
```

### 작동 방식

<Steps>
  <Step title="JSON 스키마 정의">
    Claude가 따를 구조를 설명하는 JSON 스키마를 만듭니다. 스키마는 표준 JSON Schema 형식을 사용하지만 일부 제한이 있습니다([JSON Schema 제한사항](#json-schema-limitations) 참조).
  </Step>
  <Step title="output_format 매개변수 추가">
    API 요청에 `output_format` 매개변수를 포함하고 `type: "json_schema"`와 스키마 정의를 지정합니다.
  </Step>
  <Step title="베타 헤더 포함">
    요청에 `anthropic-beta: structured-outputs-2025-11-13` 헤더를 추가합니다.
  </Step>
  <Step title="응답 파싱">
    Claude의 응답은 스키마와 일치하는 유효한 JSON이며 `response.content[0].text`에서 반환됩니다.
  </Step>
</Steps>

### SDK에서 JSON 출력 작업

Python 및 TypeScript SDK는 스키마 변환, 자동 검증, 인기 있는 스키마 라이브러리와의 통합을 포함하여 JSON 출력 작업을 더 쉽게 만드는 헬퍼를 제공합니다.

#### Pydantic 및 Zod 사용

Python 및 TypeScript 개발자의 경우 원시 JSON 스키마를 작성하는 대신 Pydantic 및 Zod와 같은 친숙한 스키마 정의 도구를 사용할 수 있습니다.

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

#### SDK 특정 메서드

**Python: `client.beta.messages.parse()` (권장)**

`parse()` 메서드는 Pydantic 모델을 자동으로 변환하고, 응답을 검증하며, `parsed_output` 속성을 반환합니다.

<Note>
`parse()` 메서드는 `client.messages`가 아닌 `client.beta.messages`에서 사용 가능합니다.
</Note>

<section title="사용 예시">

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

**Python: `transform_schema()` 헬퍼**

스키마를 전송하기 전에 수동으로 변환해야 하거나 Pydantic 생성 스키마를 수정하려는 경우입니다. `client.beta.messages.parse()`는 제공된 스키마를 자동으로 변환하는 것과 달리, 이는 변환된 스키마를 제공하므로 추가로 사용자 정의할 수 있습니다.

<section title="사용 예시">

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

#### SDK 변환 작동 방식

Python 및 TypeScript SDK는 지원되지 않는 기능이 있는 스키마를 자동으로 변환합니다:

1. **지원되지 않는 제약 제거** (예: `minimum`, `maximum`, `minLength`, `maxLength`)
2. **제약 정보로 설명 업데이트** (예: "최소 100이어야 함"), 제약이 구조화된 출력에서 직접 지원되지 않는 경우
3. **모든 객체에 `additionalProperties: false` 추가**
4. **지원되는 목록으로만 문자열 형식 필터링**
5. **원본 스키마에 대해 응답 검증** (모든 제약 포함)

이는 Claude가 단순화된 스키마를 수신하지만 코드가 검증을 통해 모든 제약을 계속 적용함을 의미합니다.

**예시:** `minimum: 100`이 있는 Pydantic 필드는 전송된 스키마에서 일반 정수가 되지만, 설명은 "최소 100이어야 함"으로 업데이트되고, SDK는 원본 제약에 대해 응답을 검증합니다.

### 일반적인 사용 사례

<section title="데이터 추출">

비정형 텍스트에서 구조화된 데이터 추출:

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

<section title="분류">

구조화된 카테고리로 콘텐츠 분류:

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

<section title="API 응답 형식 지정">

API 준비 응답 생성:

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

## 엄격한 도구 사용

엄격한 도구 사용은 도구 매개변수를 검증하여 Claude가 올바르게 입력된 인수로 함수를 호출하도록 합니다. 다음이 필요한 경우 엄격한 도구 사용을 사용하세요:

- 도구 매개변수 검증
- 에이전트 워크플로우 구축
- 타입 안전 함수 호출 보장
- 중첩된 속성이 있는 복잡한 도구 처리

### 에이전트를 위한 엄격한 도구 사용이 중요한 이유

신뢰할 수 있는 에이전트 시스템을 구축하려면 보장된 스키마 준수가 필요합니다. 엄격한 모드가 없으면 Claude는 호환되지 않는 타입(`"2"` 대신 `2`)이나 누락된 필수 필드를 반환하여 함수를 중단시키고 런타임 오류를 유발할 수 있습니다.

엄격한 도구 사용은 타입 안전 매개변수를 보장합니다:
- 함수는 매번 올바르게 입력된 인수를 받습니다
- 도구 호출을 검증하고 재시도할 필요가 없습니다
- 규모에서 일관되게 작동하는 프로덕션 준비 에이전트

예를 들어, 예약 시스템에 `passengers: int`가 필요하다고 가정합니다. 엄격한 모드가 없으면 Claude는 `passengers: "two"` 또는 `passengers: "2"`를 제공할 수 있습니다. `strict: true`를 사용하면 응답은 항상 `passengers: 2`를 포함합니다.

### 빠른 시작

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

**응답 형식:** `response.content[x].input`에서 검증된 입력이 있는 도구 사용 블록

```json
{
  "type": "tool_use",
  "name": "get_weather",
  "input": {
    "location": "San Francisco, CA"
  }
}
```

**보장:**
- 도구 `input`은 `input_schema`를 엄격히 따릅니다
- 도구 `name`은 항상 유효합니다 (제공된 도구 또는 서버 도구에서)

### 작동 방식

<Steps>
  <Step title="도구 스키마 정의">
    도구의 `input_schema`에 대한 JSON 스키마를 만듭니다. 스키마는 표준 JSON Schema 형식을 사용하지만 일부 제한이 있습니다([JSON Schema 제한사항](#json-schema-limitations) 참조).
  </Step>
  <Step title="strict: true 추가">
    도구 정의에서 `name`, `description`, `input_schema`와 함께 최상위 속성으로 `"strict": true`를 설정합니다.
  </Step>
  <Step title="베타 헤더 포함">
    요청에 `anthropic-beta: structured-outputs-2025-11-13` 헤더를 추가합니다.
  </Step>
  <Step title="도구 호출 처리">
    Claude가 도구를 사용할 때, tool_use 블록의 `input` 필드는 `input_schema`를 엄격히 따르고, `name`은 항상 유효합니다.
  </Step>
</Steps>

### 일반적인 사용 사례

<section title="검증된 도구 입력">

도구 매개변수가 스키마와 정확히 일치하도록 보장:

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

<section title="검증된 도구가 있는 에이전트 워크플로우">

보장된 도구 매개변수로 신뢰할 수 있는 다단계 에이전트 구축:

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

## 두 기능을 함께 사용

JSON 출력과 엄격한 도구 사용은 다양한 문제를 해결하며 함께 사용할 수 있습니다:

- **JSON 출력**은 Claude의 응답 형식을 제어합니다 (Claude가 말하는 것)
- **엄격한 도구 사용**은 도구 매개변수를 검증합니다 (Claude가 함수를 호출하는 방식)

결합하면 Claude는 보장된 유효 매개변수로 도구를 호출하고 구조화된 JSON 응답을 반환할 수 있습니다. 이는 신뢰할 수 있는 도구 호출과 구조화된 최종 출력이 모두 필요한 에이전트 워크플로우에 유용합니다.

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

## 중요한 고려사항

### 문법 컴파일 및 캐싱

구조화된 출력은 컴파일된 문법 아티팩트를 사용한 제약된 샘플링을 사용합니다. 이는 인식해야 할 일부 성능 특성을 도입합니다:

- **첫 요청 지연**: 특정 스키마를 처음 사용할 때 문법이 컴파일되는 동안 추가 지연이 발생합니다
- **자동 캐싱**: 컴파일된 문법은 마지막 사용으로부터 24시간 동안 캐시되어 후속 요청이 훨씬 빨라집니다
- **캐시 무효화**: 다음을 변경하면 캐시가 무효화됩니다:
  - JSON 스키마 구조
  - 요청의 도구 집합 (구조화된 출력과 도구 사용을 모두 사용할 때)
  - `name` 또는 `description` 필드만 변경하면 캐시가 무효화되지 않습니다

### 프롬프트 수정 및 토큰 비용

구조화된 출력을 사용할 때 Claude는 자동으로 예상 출력 형식을 설명하는 추가 시스템 프롬프트를 받습니다. 이는 다음을 의미합니다:

- 입력 토큰 수가 약간 더 높습니다
- 주입된 프롬프트는 다른 시스템 프롬프트처럼 토큰 비용이 발생합니다
- `output_format` 매개변수를 변경하면 해당 대화 스레드에 대한 [프롬프트 캐시](/docs/ko/build-with-claude/prompt-caching)가 무효화됩니다

### JSON Schema 제한사항

구조화된 출력은 표준 JSON Schema를 지원하지만 일부 제한이 있습니다. JSON 출력과 엄격한 도구 사용 모두 이러한 제한사항을 공유합니다.

<section title="지원되는 기능">

- 모든 기본 타입: object, array, string, integer, number, boolean, null
- `enum` (문자열, 숫자, 부울 또는 null만 - 복잡한 타입 없음)
- `const`
- `anyOf` 및 `allOf` (제한사항 있음 - `$ref`가 있는 `allOf`는 지원되지 않음)
- `$ref`, `$def`, `definitions` (외부 `$ref`는 지원되지 않음)
- 모든 지원되는 타입에 대한 `default` 속성
- `required` 및 `additionalProperties` (`additionalProperties`는 객체에 대해 `false`로 설정되어야 함)
- 문자열 형식: `date-time`, `time`, `date`, `duration`, `email`, `hostname`, `uri`, `ipv4`, `ipv6`, `uuid`
- 배열 `minItems` (0과 1의 값만 지원됨)

</section>

<section title="지원되지 않음">

- 재귀 스키마
- 열거형 내 복잡한 타입
- 외부 `$ref` (예: `'$ref': 'http://...'`)
- 수치 제약 (`minimum`, `maximum`, `multipleOf` 등)
- 문자열 제약 (`minLength`, `maxLength`)
- `minItems`의 0 또는 1을 초과하는 배열 제약
- `additionalProperties`를 `false` 이외의 값으로 설정

지원되지 않는 기능을 사용하면 세부 정보와 함께 400 오류를 받게 됩니다.

</section>

<section title="패턴 지원 (정규식)">

**지원되는 정규식 기능:**
- 전체 일치 (`^...$`) 및 부분 일치
- 수량자: `*`, `+`, `?`, 간단한 `{n,m}` 경우
- 문자 클래스: `[]`, `.`, `\d`, `\w`, `\s`
- 그룹: `(...)`

**지원되지 않음:**
- 그룹에 대한 역참조 (예: `\1`, `\2`)
- 전방 탐색/후방 탐색 어설션 (예: `(?=...)`, `(?!...)`)
- 단어 경계: `\b`, `\B`
- 큰 범위가 있는 복잡한 `{n,m}` 수량자

간단한 정규식 패턴은 잘 작동합니다. 복잡한 패턴은 400 오류를 초래할 수 있습니다.

</section>

<Tip>
Python 및 TypeScript SDK는 지원되지 않는 기능을 제거하고 필드 설명에 제약을 추가하여 스키마를 자동으로 변환할 수 있습니다. 자세한 내용은 [SDK 특정 메서드](#sdk-specific-methods)를 참조하세요.
</Tip>

### 유효하지 않은 출력

구조화된 출력은 대부분의 경우 스키마 준수를 보장하지만 출력이 스키마와 일치하지 않을 수 있는 시나리오가 있습니다:

**거부** (`stop_reason: "refusal"`)

Claude는 구조화된 출력을 사용할 때도 안전성 및 도움이 되는 속성을 유지합니다. Claude가 안전상의 이유로 요청을 거부하는 경우:

- 응답은 `stop_reason: "refusal"`을 가집니다
- 200 상태 코드를 받게 됩니다
- 생성된 토큰에 대해 청구됩니다
- 거부 메시지가 스키마 제약보다 우선하므로 출력이 스키마와 일치하지 않을 수 있습니다

**토큰 제한 도달** (`stop_reason: "max_tokens"`)

`max_tokens` 제한에 도달하여 응답이 잘린 경우:

- 응답은 `stop_reason: "max_tokens"`을 가집니다
- 출력이 불완전하고 스키마와 일치하지 않을 수 있습니다
- 완전한 구조화된 출력을 얻으려면 더 높은 `max_tokens` 값으로 재시도하세요

### 스키마 검증 오류

스키마가 지원되지 않는 기능을 사용하거나 너무 복잡한 경우 400 오류를 받게 됩니다:

**"스키마의 재귀 정의가 너무 많음"**
- 원인: 스키마에 과도하거나 순환적인 재귀 정의가 있음
- 해결책: 스키마 구조 단순화, 중첩 깊이 감소

**"스키마가 너무 복잡함"**
- 원인: 스키마가 복잡성 제한을 초과함
- 해결책: 더 작은 스키마로 분할, 구조 단순화, 또는 `strict: true`로 표시된 도구 수 감소

유효한 스키마의 지속적인 문제의 경우 스키마 정의와 함께 [지원팀에 문의](https://support.claude.com/en/articles/9015913-how-to-get-support)하세요.

## 기능 호환성

**작동:**
- **[배치 처리](/docs/ko/build-with-claude/batch-processing)**: 50% 할인으로 규모에 맞게 구조화된 출력 처리
- **[토큰 계산](/docs/ko/build-with-claude/token-counting)**: 컴파일 없이 토큰 계산
- **[스트리밍](/docs/ko/build-with-claude/streaming)**: 일반 응답처럼 구조화된 출력 스트리밍
- **결합 사용**: 동일한 요청에서 JSON 출력 (`output_format`)과 엄격한 도구 사용 (`strict: true`)을 함께 사용

**호환되지 않음:**
- **[인용](/docs/ko/build-with-claude/citations)**: 인용은 텍스트와 인용 블록을 인터리빙해야 하므로 엄격한 JSON 스키마 제약과 충돌합니다. `output_format`이 활성화된 경우 400 오류를 반환합니다.
- **[메시지 사전 채우기](/docs/ko/build-with-claude/prompt-engineering/prefill-claudes-response)**: JSON 출력과 호환되지 않음

<Tip>
**문법 범위**: 문법은 Claude의 직접 출력에만 적용되며, 도구 사용 호출, 도구 결과 또는 생각 태그([확장 생각](/docs/ko/build-with-claude/extended-thinking) 사용 시)에는 적용되지 않습니다. 문법 상태는 섹션 간에 재설정되어 Claude가 자유롭게 생각하면서도 최종 응답에서 구조화된 출력을 생성할 수 있습니다.
</Tip>