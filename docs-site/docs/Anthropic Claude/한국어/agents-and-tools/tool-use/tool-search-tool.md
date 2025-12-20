# 도구 검색 도구

Claude가 수백 개 또는 수천 개의 도구로 작업할 수 있도록 하는 도구 검색 도구에 대해 알아봅니다.

---

도구 검색 도구를 사용하면 Claude가 수백 개 또는 수천 개의 도구로 작업할 수 있으며, 필요에 따라 동적으로 도구를 발견하고 로드할 수 있습니다. 모든 도구 정의를 미리 컨텍스트 윈도우에 로드하는 대신, Claude는 도구 카탈로그(도구 이름, 설명, 인수 이름 및 인수 설명 포함)를 검색하고 필요한 도구만 로드합니다.

이 접근 방식은 도구 라이브러리가 확장될 때 두 가지 중요한 문제를 해결합니다:

- **컨텍스트 효율성**: 도구 정의는 컨텍스트 윈도우의 대부분을 차지할 수 있습니다(50개 도구 ≈ 10-20K 토큰). 이는 실제 작업을 위한 공간을 줄입니다
- **도구 선택 정확도**: Claude의 도구 올바른 선택 능력은 30-50개 이상의 기존 사용 가능한 도구가 있으면 크게 저하됩니다

이것은 서버 측 도구로 제공되지만, 클라이언트 측 도구 검색 기능을 직접 구현할 수도 있습니다. 자세한 내용은 [사용자 정의 도구 검색 구현](#custom-tool-search-implementation)을 참조하세요.

<Note>
도구 검색 도구는 현재 공개 베타 상태입니다. 공급자에 맞는 적절한 [베타 헤더](/docs/ko/api/beta-headers)를 포함하세요:

| 공급자                 | 베타 헤더                    | 지원되는 모델                       |
| ------------------------ | ------------------------------ | -------------------------------------- |
| Claude API<br/>Microsoft Foundry  | `advanced-tool-use-2025-11-20` | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Google Cloud의 Vertex AI | `tool-search-tool-2025-10-19`  | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Amazon Bedrock           | `tool-search-tool-2025-10-19`  | Claude Opus 4.5                        |
</Note>

<Warning>
  Amazon Bedrock에서는 서버 측 도구 검색이 [invoke API](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-runtime_example_bedrock-runtime_InvokeModel_AnthropicClaude_section.html)를 통해서만 사용 가능하며, converse API는 지원하지 않습니다.
</Warning>

자신의 검색 구현에서 `tool_reference` 블록을 반환하여 [클라이언트 측 도구 검색](#custom-tool-search-implementation)을 구현할 수도 있습니다.

## 도구 검색 작동 방식

도구 검색에는 두 가지 변형이 있습니다:

- **Regex** (`tool_search_tool_regex_20251119`): Claude가 도구를 검색하기 위해 정규식 패턴을 구성합니다
- **BM25** (`tool_search_tool_bm25_20251119`): Claude가 자연어 쿼리를 사용하여 도구를 검색합니다

도구 검색 도구를 활성화하면:

1. 도구 목록에 도구 검색 도구(예: `tool_search_tool_regex_20251119` 또는 `tool_search_tool_bm25_20251119`)를 포함합니다
2. 즉시 로드되지 않아야 하는 도구에 대해 `defer_loading: true`를 사용하여 모든 도구 정의를 제공합니다
3. Claude는 처음에 도구 검색 도구와 지연되지 않은 도구만 봅니다
4. Claude가 추가 도구가 필요하면 도구 검색 도구를 사용하여 검색합니다
5. API는 3-5개의 가장 관련성 높은 `tool_reference` 블록을 반환합니다
6. 이러한 참조는 자동으로 전체 도구 정의로 확장됩니다
7. Claude는 발견된 도구 중에서 선택하고 호출합니다

이렇게 하면 컨텍스트 윈도우를 효율적으로 유지하면서 높은 도구 선택 정확도를 유지할 수 있습니다.

## 빠른 시작

지연된 도구를 사용한 간단한 예제입니다:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in San Francisco?"
            }
        ],
        "tools": [
            {
                "type": "tool_search_tool_regex_20251119",
                "name": "tool_search_tool_regex"
            },
            {
                "name": "get_weather",
                "description": "Get the weather at a specific location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string"},
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"]
                        }
                    },
                    "required": ["location"]
                },
                "defer_loading": true
            },
            {
                "name": "search_files",
                "description": "Search through files in the workspace",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "file_types": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["query"]
                },
                "defer_loading": true
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "What is the weather in San Francisco?"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get the weather at a specific location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            },
            "defer_loading": True
        },
        {
            "name": "search_files",
            "description": "Search through files in the workspace",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "file_types": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["query"]
            },
            "defer_loading": True
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: "What is the weather in San Francisco?",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        name: "get_weather",
        description: "Get the weather at a specific location",
        input_schema: {
          type: "object",
          properties: {
            location: { type: "string" },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
            },
          },
          required: ["location"],
        },
        defer_loading: true,
      },
      {
        name: "search_files",
        description: "Search through files in the workspace",
        input_schema: {
          type: "object",
          properties: {
            query: { type: "string" },
            file_types: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["query"],
        },
        defer_loading: true,
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

## 도구 정의

도구 검색 도구에는 두 가지 변형이 있습니다:

```json JSON
{
  "type": "tool_search_tool_regex_20251119",
  "name": "tool_search_tool_regex"
}
```

```json JSON
{
  "type": "tool_search_tool_bm25_20251119",
  "name": "tool_search_tool_bm25"
}
```

<Warning>
**Regex 변형 쿼리 형식: Python 정규식, 자연어 아님**

`tool_search_tool_regex_20251119`를 사용할 때, Claude는 자연어 쿼리가 아닌 Python의 `re.search()` 구문을 사용하여 정규식 패턴을 구성합니다. 일반적인 패턴:

- `"weather"` - "weather"를 포함하는 도구 이름/설명과 일치
- `"get_.*_data"` - `get_user_data`, `get_weather_data` 같은 도구와 일치
- `"database.*query|query.*database"` - 유연성을 위한 OR 패턴
- `"(?i)slack"` - 대소문자를 구분하지 않는 검색

최대 쿼리 길이: 200자

</Warning>

<Note>
**BM25 변형 쿼리 형식: 자연어**

`tool_search_tool_bm25_20251119`를 사용할 때, Claude는 자연어 쿼리를 사용하여 도구를 검색합니다.

</Note>

### 지연된 도구 로드

`defer_loading: true`를 추가하여 도구를 온디맨드 로드로 표시합니다:

```json JSON
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string" },
      "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] }
    },
    "required": ["location"]
  },
  "defer_loading": true
}
```

**주요 포인트:**

- `defer_loading`이 없는 도구는 즉시 컨텍스트에 로드됩니다
- `defer_loading: true`가 있는 도구는 Claude가 검색을 통해 발견할 때만 로드됩니다
- 도구 검색 도구 자체는 **절대** `defer_loading: true`를 가져서는 안 됩니다
- 최적의 성능을 위해 가장 자주 사용되는 3-5개 도구를 지연되지 않은 상태로 유지하세요

두 도구 검색 변형(`regex` 및 `bm25`)은 도구 이름, 설명, 인수 이름 및 인수 설명을 검색합니다.

## 응답 형식

Claude가 도구 검색 도구를 사용할 때, 응답에는 새로운 블록 유형이 포함됩니다:

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll search for tools to help with the weather information."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01ABC123",
      "name": "tool_search_tool_regex",
      "input": {
        "query": "weather"
      }
    },
    {
      "type": "tool_search_tool_result",
      "tool_use_id": "srvtoolu_01ABC123",
      "content": {
        "type": "tool_search_tool_search_result",
        "tool_references": [{ "type": "tool_reference", "tool_name": "get_weather" }]
      }
    },
    {
      "type": "text",
      "text": "I found a weather tool. Let me get the weather for San Francisco."
    },
    {
      "type": "tool_use",
      "id": "toolu_01XYZ789",
      "name": "get_weather",
      "input": { "location": "San Francisco", "unit": "fahrenheit" }
    }
  ],
  "stop_reason": "tool_use"
}
```

### 응답 이해하기

- **`server_tool_use`**: Claude가 도구 검색 도구를 호출하고 있음을 나타냅니다
- **`tool_search_tool_result`**: 중첩된 `tool_search_tool_search_result` 객체가 있는 검색 결과를 포함합니다
- **`tool_references`**: 발견된 도구를 가리키는 `tool_reference` 객체의 배열
- **`tool_use`**: Claude가 발견된 도구를 호출합니다

`tool_reference` 블록은 Claude에게 표시되기 전에 자동으로 전체 도구 정의로 확장됩니다. 이 확장을 직접 처리할 필요가 없습니다. `tools` 매개변수에 모든 일치하는 도구 정의를 제공하는 한 API에서 자동으로 발생합니다.

## MCP 통합

도구 검색 도구는 [MCP 서버](/docs/ko/agents-and-tools/mcp-connector)와 함께 작동합니다. API 요청에 `"mcp-client-2025-11-20"` [베타 헤더](/docs/ko/api/beta-headers)를 추가한 다음, `default_config`와 함께 `mcp_toolset`을 사용하여 MCP 도구 로드를 지연시킵니다:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "anthropic-beta: advanced-tool-use-2025-11-20,mcp-client-2025-11-20" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 2048,
    "mcp_servers": [
      {
        "type": "url",
        "name": "database-server",
        "url": "https://mcp-db.example.com"
      }
    ],
    "tools": [
      {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
      },
      {
        "type": "mcp_toolset",
        "mcp_server_name": "database-server",
        "default_config": {
          "defer_loading": true
        },
        "configs": {
          "search_events": {
            "defer_loading": false
          }
        }
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "What events are in my database?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens=2048,
    mcp_servers=[
        {
            "type": "url",
            "name": "database-server",
            "url": "https://mcp-db.example.com"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "type": "mcp_toolset",
            "mcp_server_name": "database-server",
            "default_config": {
                "defer_loading": True
            },
            "configs": {
                "search_events": {
                    "defer_loading": False
                }
            }
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What events are in my database?"
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens: 2048,
    mcp_servers: [
      {
        type: "url",
        name: "database-server",
        url: "https://mcp-db.example.com",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        type: "mcp_toolset",
        mcp_server_name: "database-server",
        default_config: {
          defer_loading: true,
        },
        configs: {
          search_events: {
            defer_loading: false,
          },
        },
      },
    ],
    messages: [
      {
        role: "user",
        content: "What events are in my database?",
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

**MCP 구성 옵션:**

- `default_config.defer_loading`: MCP 서버의 모든 도구에 대한 기본값 설정
- `configs`: 이름으로 특정 도구에 대한 기본값 재정의
- 도구 검색과 함께 여러 MCP 서버를 결합하여 대규모 도구 라이브러리 구성

## 사용자 정의 도구 검색 구현

사용자 정의 도구(예: 임베딩 또는 의미론적 검색 사용)에서 `tool_reference` 블록을 반환하여 자신의 도구 검색 로직을 구현할 수 있습니다:

```json JSON
{
  "type": "tool_search_tool_result",
  "tool_use_id": "toolu_custom_search",
  "content": {
    "type": "tool_search_tool_search_result",
    "tool_references": [{ "type": "tool_reference", "tool_name": "discovered_tool_name" }]
  }
}
```

참조된 모든 도구는 `defer_loading: true`를 사용하여 최상위 `tools` 매개변수에 해당하는 도구 정의를 가져야 합니다. 이 접근 방식을 사용하면 도구 검색 시스템과의 호환성을 유지하면서 더 정교한 검색 알고리즘을 사용할 수 있습니다.

임베딩을 사용한 완전한 예제는 [임베딩을 사용한 도구 검색 쿡북](https://github.com/anthropics/anthropic-cookbook)을 참조하세요.

## 오류 처리

<Note>
  도구 검색 도구는 [도구 사용 예제](/docs/ko/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples)와 호환되지 않습니다.
  도구 사용 예제를 제공해야 하는 경우, 도구 검색 없이 표준 도구 호출을 사용하세요.
</Note>

### HTTP 오류(400 상태)

이러한 오류는 요청이 처리되는 것을 방지합니다:

**모든 도구가 지연됨:**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "All tools have defer_loading set. At least one tool must be non-deferred."
  }
}
```

**누락된 도구 정의:**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Tool reference 'unknown_tool' has no corresponding tool definition"
  }
}
```

### 도구 결과 오류(200 상태)

도구 실행 중 오류는 200 응답을 반환하며 본문에 오류 정보가 포함됩니다:

```json JSON
{
  "type": "tool_result",
  "tool_use_id": "srvtoolu_01ABC123",
  "content": {
    "type": "tool_search_tool_result_error",
    "error_code": "invalid_pattern"
  }
}
```

**오류 코드:**

- `too_many_requests`: 도구 검색 작업에 대한 속도 제한 초과
- `invalid_pattern`: 잘못된 형식의 정규식 패턴
- `pattern_too_long`: 패턴이 200자 제한을 초과
- `unavailable`: 도구 검색 서비스가 일시적으로 사용 불가능

### 일반적인 실수

<section title="400 오류: 모든 도구가 지연됨">

**원인**: 검색 도구를 포함한 모든 도구에 `defer_loading: true`를 설정했습니다

**해결책**: 도구 검색 도구에서 `defer_loading`을 제거합니다:

```json
{
  "type": "tool_search_tool_regex_20251119", // 여기에 defer_loading이 없음
  "name": "tool_search_tool_regex"
}
```

</section>

<section title="400 오류: 누락된 도구 정의">

**원인**: `tool_reference`가 `tools` 배열에 없는 도구를 가리킵니다

**해결책**: 발견될 수 있는 모든 도구가 완전한 정의를 가지고 있는지 확인합니다:

```json
{
  "name": "my_tool",
  "description": "Full description here",
  "input_schema": {
    /* complete schema */
  },
  "defer_loading": true
}
```

</section>

<section title="Claude가 예상되는 도구를 찾지 못함">

**원인**: 도구 이름 또는 설명이 정규식 패턴과 일치하지 않습니다

**디버깅 단계:**

1. 도구 이름과 설명을 확인하세요. Claude는 두 필드를 모두 검색합니다
2. 패턴을 테스트합니다: `import re; re.search(r"your_pattern", "tool_name")`
3. 기본적으로 검색은 대소문자를 구분합니다(`(?i)`를 사용하여 대소문자를 구분하지 않게 함)
4. Claude는 정확한 일치가 아닌 `".*weather.*"` 같은 광범위한 패턴을 사용합니다

**팁**: 도구 설명에 일반적인 키워드를 추가하여 발견 가능성을 개선합니다

</section>

## 프롬프트 캐싱

도구 검색은 [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching)과 함께 작동합니다. 다중 턴 대화를 최적화하기 위해 `cache_control` 중단점을 추가합니다:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# 도구 검색을 사용한 첫 번째 요청
messages = [
    {
        "role": "user",
        "content": "What's the weather in Seattle?"
    }
]

response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

# Claude의 응답을 대화에 추가
messages.append({
    "role": "assistant",
    "content": response1.content
})

# 캐시 중단점을 사용한 두 번째 요청
messages.append({
    "role": "user",
    "content": "What about New York?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```
</CodeGroup>

시스템은 전체 대화 기록 전체에서 tool_reference 블록을 자동으로 확장하므로 Claude는 재검색 없이 후속 턴에서 발견된 도구를 재사용할 수 있습니다.

## 스트리밍

스트리밍이 활성화되면 스트림의 일부로 도구 검색 이벤트를 받게 됩니다:

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "tool_search_tool_regex"}}

// 검색 쿼리 스트리밍
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"weather\"}"}}

// 검색 실행 중 일시 중지

// 검색 결과 스트리밍
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "tool_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "tool_search_tool_search_result", "tool_references": [{"type": "tool_reference", "tool_name": "get_weather"}]}}}

// Claude가 발견된 도구로 계속 진행
```

## 배치 요청

[메시지 배치 API](/docs/ko/build-with-claude/batch-processing)에 도구 검색 도구를 포함할 수 있습니다. 메시지 배치 API를 통한 도구 검색 작업은 일반 메시지 API 요청과 동일하게 가격이 책정됩니다.

## 제한 및 모범 사례

### 제한

- **최대 도구**: 카탈로그에 10,000개 도구
- **검색 결과**: 검색당 3-5개의 가장 관련성 높은 도구 반환
- **패턴 길이**: 정규식 패턴의 최대 200자
- **모델 지원**: Sonnet 4.0+, Opus 4.0+ 만 지원(Haiku 미지원)

### 도구 검색을 사용할 때

**좋은 사용 사례:**

- 시스템에서 10개 이상의 도구 사용 가능
- 도구 정의가 >10K 토큰 소비
- 대규모 도구 세트에서 도구 선택 정확도 문제 발생
- MCP 기반 시스템 구축(200개 이상의 도구)
- 시간이 지남에 따라 도구 라이브러리 증가

**기존 도구 호출이 더 나을 때:**

- 총 10개 미만의 도구
- 모든 도구가 모든 요청에서 자주 사용됨
- 매우 작은 도구 정의(\<100 토큰 총합)

### 최적화 팁

- 가장 자주 사용되는 3-5개 도구를 지연되지 않은 상태로 유지
- 명확하고 설명적인 도구 이름과 설명 작성
- 사용자가 작업을 설명하는 방식과 일치하는 의미론적 키워드를 설명에 추가
- 사용 가능한 도구 카테고리를 설명하는 시스템 프롬프트 섹션 추가: "Slack, GitHub 및 Jira와 상호 작용하기 위해 도구를 검색할 수 있습니다"
- Claude가 발견하는 도구를 모니터링하여 설명 개선

## 사용

도구 검색 도구 사용은 응답 사용 객체에서 추적됩니다:

```json JSON
{
  "usage": {
    "input_tokens": 1024,
    "output_tokens": 256,
    "server_tool_use": {
      "tool_search_requests": 2
    }
  }
}
```