# 프로그래매틱 도구 호출

Claude가 모델을 통한 왕복 없이 코드 실행 컨테이너 내에서 프로그래매틱하게 도구를 호출하는 코드를 작성하도록 하는 방법을 알아봅니다.

---

프로그래매틱 도구 호출을 통해 Claude는 각 도구 호출마다 모델을 통한 왕복을 요구하지 않고 [코드 실행](/docs/ko/agents-and-tools/tool-use/code-execution-tool) 컨테이너 내에서 프로그래매틱하게 도구를 호출하는 코드를 작성할 수 있습니다. 이는 다중 도구 워크플로우의 지연 시간을 줄이고 Claude가 데이터를 필터링하거나 처리한 후 모델의 컨텍스트 윈도우에 도달하도록 함으로써 토큰 소비를 감소시킵니다.

<Note>
프로그래매틱 도구 호출은 현재 공개 베타 상태입니다.

이 기능을 사용하려면 API 요청에 `"advanced-tool-use-2025-11-20"` [베타 헤더](/docs/ko/api/beta-headers)를 추가하세요.

이 기능을 사용하려면 코드 실행 도구가 활성화되어 있어야 합니다.
</Note>

## 모델 호환성

프로그래매틱 도구 호출은 다음 모델에서 사용 가능합니다:

| 모델 | 도구 버전 |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |

<Warning>
프로그래매틱 도구 호출은 Claude API 및 Microsoft Foundry를 통해 사용 가능합니다.
</Warning>

## 빠른 시작

Claude가 프로그래매틱하게 데이터베이스를 여러 번 쿼리하고 결과를 집계하는 간단한 예제입니다:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
            }
        ],
        "tools": [
            {
                "type": "code_execution_20250825",
                "name": "code_execution"
            },
            {
                "name": "query_database",
                "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "sql": {
                            "type": "string",
                            "description": "SQL query to execute"
                        }
                    },
                    "required": ["sql"]
                },
                "allowed_callers": ["code_execution_20250825"]
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "sql": {
                        "type": "string",
                        "description": "SQL query to execute"
                    }
                },
                "required": ["sql"]
            },
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
      }
    ],
    tools: [
      {
        type: "code_execution_20250825",
        name: "code_execution"
      },
      {
        name: "query_database",
        description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        input_schema: {
          type: "object",
          properties: {
            sql: {
              type: "string",
              description: "SQL query to execute"
            }
          },
          required: ["sql"]
        },
        allowed_callers: ["code_execution_20250825"]
      }
    ]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## 프로그래매틱 도구 호출의 작동 원리

도구를 코드 실행에서 호출 가능하도록 구성하고 Claude가 해당 도구를 사용하기로 결정할 때:

1. Claude는 도구를 함수로 호출하는 Python 코드를 작성하며, 여러 도구 호출 및 전처리/후처리 로직을 포함할 수 있습니다
2. Claude는 코드 실행을 통해 샌드박스 컨테이너에서 이 코드를 실행합니다
3. 도구 함수가 호출되면 코드 실행이 일시 중지되고 API는 `tool_use` 블록을 반환합니다
4. 도구 결과를 제공하면 코드 실행이 계속됩니다(중간 결과는 Claude의 컨텍스트 윈도우에 로드되지 않습니다)
5. 모든 코드 실행이 완료되면 Claude는 최종 출력을 받고 작업을 계속합니다

이 접근 방식은 특히 다음에 유용합니다:
- **대규모 데이터 처리**: Claude의 컨텍스트에 도달하기 전에 도구 결과를 필터링하거나 집계합니다
- **다단계 워크플로우**: 도구 호출 사이에 Claude를 샘플링하지 않고 도구를 순차적으로 또는 루프에서 호출하여 토큰과 지연 시간을 절약합니다
- **조건부 로직**: 중간 도구 결과를 기반으로 결정을 내립니다

<Note>
사용자 정의 도구는 병렬 도구 호출을 지원하기 위해 비동기 Python 함수로 변환됩니다. Claude가 도구를 호출하는 코드를 작성할 때, `await`를 사용하며(예: `result = await query_database("<sql>")`) 자동으로 적절한 비동기 래퍼 함수를 포함합니다.

명확성을 위해 이 문서의 코드 예제에서는 비동기 래퍼가 생략되어 있습니다.
</Note>

## 핵심 개념

### `allowed_callers` 필드

`allowed_callers` 필드는 어떤 컨텍스트가 도구를 호출할 수 있는지 지정합니다:

```json
{
  "name": "query_database",
  "description": "Execute a SQL query against the database",
  "input_schema": {...},
  "allowed_callers": ["code_execution_20250825"]
}
```

**가능한 값:**
- `["direct"]` - Claude만 이 도구를 직접 호출할 수 있습니다(생략된 경우 기본값)
- `["code_execution_20250825"]` - 코드 실행 내에서만 호출 가능합니다
- `["direct", "code_execution_20250825"]` - 직접 및 코드 실행에서 모두 호출 가능합니다

<Tip>
각 도구에 대해 `["direct"]` 또는 `["code_execution_20250825"]` 중 하나를 선택하고 둘 다 활성화하지 않는 것을 권장합니다. 이는 Claude에게 도구를 최적으로 사용하는 방법에 대한 명확한 지침을 제공합니다.
</Tip>

### 응답의 `caller` 필드

모든 도구 사용 블록에는 호출 방식을 나타내는 `caller` 필드가 포함됩니다:

**직접 호출(기존 도구 사용):**
```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {"type": "direct"}
}
```

**프로그래매틱 호출:**
```json
{
  "type": "tool_use",
  "id": "toolu_xyz789",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_abc123"
  }
}
```

`tool_id`는 프로그래매틱 호출을 수행한 코드 실행 도구를 참조합니다.

### 컨테이너 수명 주기

프로그래매틱 도구 호출은 코드 실행과 동일한 컨테이너를 사용합니다:

- **컨테이너 생성**: 기존 컨테이너를 재사용하지 않는 한 각 세션에 대해 새 컨테이너가 생성됩니다
- **만료**: 컨테이너는 약 4.5분의 비활성 후 만료됩니다(변경될 수 있음)
- **컨테이너 ID**: `container` 필드를 통해 응답에서 반환됩니다
- **재사용**: 컨테이너 ID를 전달하여 요청 간 상태를 유지합니다

<Warning>
도구가 프로그래매틱하게 호출되고 컨테이너가 도구 결과를 기다리고 있을 때, 컨테이너가 만료되기 전에 응답해야 합니다. `expires_at` 필드를 모니터링하세요. 컨테이너가 만료되면 Claude는 도구 호출을 시간 초과로 처리하고 재시도할 수 있습니다.
</Warning>

## 예제 워크플로우

완전한 프로그래매틱 도구 호출 흐름이 어떻게 작동하는지 다음과 같습니다:

### 단계 1: 초기 요청

코드 실행 및 프로그래매틱 호출을 허용하는 도구와 함께 요청을 보냅니다. 프로그래매틱 호출을 활성화하려면 도구 정의에 `allowed_callers` 필드를 추가하세요.

<Note>
도구 설명에서 도구의 출력 형식에 대한 자세한 설명을 제공하세요. 도구가 JSON을 반환한다고 지정하면 Claude는 결과를 역직렬화하고 코드에서 처리하려고 시도합니다. 출력 스키마에 대해 제공하는 세부 정보가 많을수록 Claude가 응답을 프로그래매틱하게 더 잘 처리할 수 있습니다.
</Note>

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
  }],
  tools: [
    {
      type: "code_execution_20250825",
      name: "code_execution"
    },
    {
      name: "query_database",
      description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
      input_schema: {...},
      allowed_callers: ["code_execution_20250825"]
    }
  ]
});
```
</CodeGroup>

### 단계 2: 도구 호출이 있는 API 응답

Claude는 도구를 호출하는 코드를 작성합니다. API는 일시 중지되고 다음을 반환합니다:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll query the purchase history and analyze the results."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_abc123",
      "name": "code_execution",
      "input": {
        "code": "results = await query_database('<sql>')\ntop_customers = sorted(results, key=lambda x: x['revenue'], reverse=True)[:5]\nprint(f'Top 5 customers: {top_customers}')"
      }
    },
    {
      "type": "tool_use",
      "id": "toolu_def456",
      "name": "query_database",
      "input": {"sql": "<sql>"},
      "caller": {
        "type": "code_execution_20250825",
        "tool_id": "srvtoolu_abc123"
      }
    }
  ],
  "container": {
    "id": "container_xyz789",
    "expires_at": "2025-01-15T14:30:00Z"
  },
  "stop_reason": "tool_use"
}
```

### 단계 3: 도구 결과 제공

전체 대화 기록과 도구 결과를 포함하세요:

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    container="container_xyz789",  # Reuse the container
    messages=[
        {"role": "user", "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"},
        {
            "role": "assistant",
            "content": [
                {"type": "text", "text": "I'll query the purchase history and analyze the results."},
                {
                    "type": "server_tool_use",
                    "id": "srvtoolu_abc123",
                    "name": "code_execution",
                    "input": {"code": "..."}
                },
                {
                    "type": "tool_use",
                    "id": "toolu_def456",
                    "name": "query_database",
                    "input": {"sql": "<sql>"},
                    "caller": {
                        "type": "code_execution_20250825",
                        "tool_id": "srvtoolu_abc123"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_def456",
                    "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
                }
            ]
        }
    ],
    tools=[...]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  container: "container_xyz789",  // Reuse the container
  messages: [
    { role: "user", content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue" },
    {
      role: "assistant",
      content: [
        { type: "text", text: "I'll query the purchase history and analyze the results." },
        {
          type: "server_tool_use",
          id: "srvtoolu_abc123",
          name: "code_execution",
          input: { code: "..." }
        },
        {
          type: "tool_use",
          id: "toolu_def456",
          name: "query_database",
          input: { sql: "<sql>" },
          caller: {
            type: "code_execution_20250825",
            tool_id: "srvtoolu_abc123"
          }
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: "toolu_def456",
          content: "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
        }
      ]
    }
  ],
  tools: [...]
});
```
</CodeGroup>

### 단계 4: 다음 도구 호출 또는 완료

코드 실행이 계속되고 결과를 처리합니다. 추가 도구 호출이 필요한 경우 모든 도구 호출이 만족될 때까지 단계 3을 반복하세요.

### 단계 5: 최종 응답

코드 실행이 완료되면 Claude는 최종 응답을 제공합니다:

```json
{
  "content": [
    {
      "type": "code_execution_tool_result",
      "tool_use_id": "srvtoolu_abc123",
      "content": {
        "type": "code_execution_result",
        "stdout": "Top 5 customers by revenue:\n1. Customer C1: $45,000\n2. Customer C2: $38,000\n3. Customer C5: $32,000\n4. Customer C8: $28,500\n5. Customer C3: $24,000",
        "stderr": "",
        "return_code": 0,
        "content": []
      }
    },
    {
      "type": "text",
      "text": "I've analyzed the purchase history from last quarter. Your top 5 customers generated $167,500 in total revenue, with Customer C1 leading at $45,000."
    }
  ],
  "stop_reason": "end_turn"
}
```

## 고급 패턴

### 루프를 사용한 배치 처리

Claude는 여러 항목을 효율적으로 처리하는 코드를 작성할 수 있습니다:

```python
# async wrapper omitted for clarity
regions = ["West", "East", "Central", "North", "South"]
results = {}
for region in regions:
    data = await query_database(f"<sql for {region}>")
    results[region] = sum(row["revenue"] for row in data)

# Process results programmatically
top_region = max(results.items(), key=lambda x: x[1])
print(f"Top region: {top_region[0]} with ${top_region[1]:,} in revenue")
```

이 패턴:
- 모델 왕복을 N(지역당 하나)에서 1로 줄입니다
- 대규모 결과 집합을 Claude로 반환하기 전에 프로그래매틱하게 처리합니다
- 원본 데이터 대신 집계된 결론만 반환하여 토큰을 절약합니다

### 조기 종료

Claude는 성공 기준이 충족되는 즉시 처리를 중지할 수 있습니다:

```python
# async wrapper omitted for clarity
endpoints = ["us-east", "eu-west", "apac"]
for endpoint in endpoints:
    status = await check_health(endpoint)
    if status == "healthy":
        print(f"Found healthy endpoint: {endpoint}")
        break  # Stop early, don't check remaining
```

### 조건부 도구 선택

```python
# async wrapper omitted for clarity
file_info = await get_file_info(path)
if file_info["size"] < 10000:
    content = await read_full_file(path)
else:
    content = await read_file_summary(path)
print(content)
```

### 데이터 필터링

```python
# async wrapper omitted for clarity
logs = await fetch_logs(server_id)
errors = [log for log in logs if "ERROR" in log]
print(f"Found {len(errors)} errors")
for error in errors[-10:]:  # Only return last 10 errors
    print(error)
```

## 응답 형식

### 프로그래매틱 도구 호출

코드 실행이 도구를 호출할 때:

```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_xyz789"
  }
}
```

### 도구 결과 처리

도구 결과는 실행 중인 코드로 다시 전달됩니다:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_abc123",
      "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000, \"orders\": 23}, {\"customer_id\": \"C2\", \"revenue\": 38000, \"orders\": 18}, ...]"
    }
  ]
}
```

### 코드 실행 완료

모든 도구 호출이 만족되고 코드가 완료되면:

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_xyz789",
  "content": {
    "type": "code_execution_result",
    "stdout": "Analysis complete. Top 5 customers identified from 847 total records.",
    "stderr": "",
    "return_code": 0,
    "content": []
  }
}
```

## 오류 처리

### 일반적인 오류

| 오류 | 설명 | 해결 방법 |
|-------|-------------|----------|
| `invalid_tool_input` | 도구 입력이 스키마와 일치하지 않음 | 도구의 input_schema 검증 |
| `tool_not_allowed` | 도구가 요청된 호출자 유형을 허용하지 않음 | `allowed_callers`에 올바른 컨텍스트가 포함되어 있는지 확인 |
| `missing_beta_header` | PTC 베타 헤더가 제공되지 않음 | 요청에 두 베타 헤더를 추가 |

### 도구 호출 중 컨테이너 만료

도구가 응답하는 데 너무 오래 걸리면 코드 실행은 `TimeoutError`를 받습니다. Claude는 stderr에서 이를 보고 일반적으로 재시도합니다:

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_abc123",
  "content": {
    "type": "code_execution_result",
    "stdout": "",
    "stderr": "TimeoutError: Calling tool ['query_database'] timed out.",
    "return_code": 0,
    "content": []
  }
}
```

시간 초과를 방지하려면:
- 응답의 `expires_at` 필드를 모니터링하세요
- 도구 실행에 대한 시간 초과를 구현하세요
- 긴 작업을 더 작은 청크로 나누는 것을 고려하세요

### 도구 실행 오류

도구가 오류를 반환하는 경우:

```python
# Provide error information in the tool result
{
    "type": "tool_result",
    "tool_use_id": "toolu_abc123",
    "content": "Error: Query timeout - table lock exceeded 30 seconds"
}
```

Claude의 코드는 이 오류를 받고 적절하게 처리할 수 있습니다.

## 제약 및 제한 사항

### 기능 비호환성

- **구조화된 출력**: `strict: true`인 도구는 프로그래매틱 호출과 함께 지원되지 않습니다
- **도구 선택**: `tool_choice`를 통해 특정 도구의 프로그래매틱 호출을 강제할 수 없습니다
- **병렬 도구 사용**: `disable_parallel_tool_use: true`는 프로그래매틱 호출과 함께 지원되지 않습니다

### 도구 제한 사항

다음 도구는 현재 프로그래매틱하게 호출될 수 없지만 향후 릴리스에서 지원이 추가될 수 있습니다:

- 웹 검색
- 웹 가져오기
- [MCP 커넥터](/docs/ko/agents-and-tools/mcp-connector)에서 제공하는 도구

### 메시지 형식 제한 사항

프로그래매틱 도구 호출에 응답할 때 엄격한 형식 요구 사항이 있습니다:

**도구 결과만 응답**: 결과를 기다리는 프로그래매틱 도구 호출이 있는 경우 응답 메시지는 **오직** `tool_result` 블록만 포함해야 합니다. 도구 결과 후에도 텍스트 콘텐츠를 포함할 수 없습니다.

```json
// ❌ 잘못됨 - 프로그래매틱 도구 호출에 응답할 때 텍스트를 포함할 수 없음
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"},
    {"type": "text", "text": "What should I do next?"}  // This will cause an error
  ]
}

// ✅ 올바름 - 프로그래매틱 도구 호출에 응답할 때 도구 결과만
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"}
  ]
}
```

이 제한은 프로그래매틱(코드 실행) 도구 호출에 응답할 때만 적용됩니다. 일반 클라이언트 측 도구 호출의 경우 도구 결과 후에 텍스트 콘텐츠를 포함할 수 있습니다.

### 속도 제한

프로그래매틱 도구 호출은 일반 도구 호출과 동일한 속도 제한의 적용을 받습니다. 코드 실행의 각 도구 호출은 별도의 호출로 계산됩니다.

### 사용 전에 도구 결과 검증

프로그래매틱하게 호출될 사용자 정의 도구를 구현할 때:

- **도구 결과는 문자열로 반환됩니다**: 코드 스니펫이나 실행 가능한 명령을 포함한 모든 콘텐츠를 포함할 수 있습니다.
- **외부 도구 결과 검증**: 도구가 외부 소스에서 데이터를 반환하거나 사용자 입력을 수락하는 경우 출력이 코드로 해석되거나 실행될 경우 코드 주입 위험을 인식하세요.

## 토큰 효율성

프로그래매틱 도구 호출은 토큰 소비를 크게 줄일 수 있습니다:

- **프로그래매틱 호출의 도구 결과는 Claude의 컨텍스트에 추가되지 않습니다** - 최종 코드 출력만 추가됩니다
- **중간 처리는 코드에서 발생합니다** - 필터링, 집계 등이 모델 토큰을 소비하지 않습니다
- **한 번의 코드 실행에서 여러 도구 호출** - 별도의 모델 턴에 비해 오버헤드를 줄입니다

예를 들어, 10개의 도구를 직접 호출하는 것은 프로그래매틱하게 호출하고 요약을 반환하는 것의 약 10배의 토큰을 사용합니다.

## 사용 및 가격 책정

프로그래매틱 도구 호출은 코드 실행과 동일한 가격 책정을 사용합니다. 자세한 내용은 [코드 실행 가격 책정](/docs/ko/agents-and-tools/tool-use/code-execution-tool#usage-and-pricing)을 참조하세요.

<Note>
프로그래매틱 도구 호출의 토큰 계산: 프로그래매틱 호출의 도구 결과는 입력/출력 토큰 사용량에 포함되지 않습니다. 최종 코드 실행 결과와 Claude의 응답만 계산됩니다.
</Note>

## 모범 사례

### 도구 설계

- **자세한 출력 설명 제공**: Claude가 코드에서 도구 결과를 역직렬화하므로 형식(JSON 구조, 필드 유형 등)을 명확하게 문서화하세요
- **구조화된 데이터 반환**: JSON 또는 기타 쉽게 구문 분석할 수 있는 형식이 프로그래매틱 처리에 가장 적합합니다
- **응답을 간결하게 유지**: 처리 오버헤드를 최소화하기 위해 필요한 데이터만 반환하세요

### 프로그래매틱 호출을 사용할 때

**좋은 사용 사례:**
- 집계 또는 요약만 필요한 대규모 데이터 세트 처리
- 3개 이상의 종속 도구 호출이 있는 다단계 워크플로우
- 도구 결과의 필터링, 정렬 또는 변환이 필요한 작업
- 중간 데이터가 Claude의 추론에 영향을 주지 않아야 하는 작업
- 많은 항목에 걸친 병렬 작업(예: 50개 엔드포인트 확인)

**덜 이상적인 사용 사례:**
- 간단한 응답이 있는 단일 도구 호출
- 즉각적인 사용자 피드백이 필요한 도구
- 코드 실행 오버헤드가 이점을 능가할 매우 빠른 작업

### 성능 최적화

- **컨테이너 재사용**: 관련된 여러 요청을 할 때 상태를 유지하기 위해 컨테이너를 재사용하세요
- **유사한 작업 일괄 처리**: 가능한 경우 단일 코드 실행에서 유사한 작업을 일괄 처리하세요

## 문제 해결

### 일반적인 문제

**"Tool not allowed" 오류**
- 도구 정의에 `"allowed_callers": ["code_execution_20250825"]`가 포함되어 있는지 확인하세요
- 올바른 베타 헤더를 사용하고 있는지 확인하세요

**컨테이너 만료**
- 컨테이너의 수명(약 4.5분) 내에 도구 호출에 응답하는지 확인하세요
- 응답의 `expires_at` 필드를 모니터링하세요
- 더 빠른 도구 실행을 구현하는 것을 고려하세요

**베타 헤더 문제**
- 헤더가 필요합니다: `"advanced-tool-use-2025-11-20"`

**도구 결과가 올바르게 구문 분석되지 않음**
- 도구가 Claude가 역직렬화할 수 있는 문자열 데이터를 반환하는지 확인하세요
- 도구 설명에서 명확한 출력 형식 문서를 제공하세요

### 디버깅 팁

1. **모든 도구 호출 및 결과를 기록**: 흐름을 추적하세요
2. **`caller` 필드 확인**: 프로그래매틱 호출을 확인하세요
3. **컨테이너 ID 모니터링**: 적절한 재사용를 확인하세요
4. **도구를 독립적으로 테스트**: 프로그래매틱 호출을 활성화하기 전에 도구를 테스트하세요

## 프로그래매틱 도구 호출이 작동하는 이유

Claude의 훈련에는 광범위한 코드 노출이 포함되어 있어 함수 호출을 추론하고 연결하는 데 효과적입니다. 도구가 코드 실행 환경 내에서 호출 가능한 함수로 제시될 때 Claude는 이 강점을 활용하여:

- **도구 구성에 대해 자연스럽게 추론**: Python 코드를 작성하는 것처럼 자연스럽게 작업을 연결하고 종속성을 처리합니다
- **대규모 결과를 효율적으로 처리**: 대규모 도구 출력을 필터링하고 관련 데이터만 추출하거나 컨텍스트 윈도우로 반환하기 전에 중간 결과를 파일에 작성합니다
- **지연 시간을 크게 줄입니다**: 다단계 워크플로우에서 각 도구 호출 사이에 Claude를 다시 샘플링하는 오버헤드를 제거합니다

이 접근 방식은 1M 토큰 이상의 파일 처리와 같이 기존 도구 사용으로는 비실용적인 워크플로우를 가능하게 합니다. Claude가 모든 것을 대화 컨텍스트에 로드하는 대신 프로그래매틱하게 데이터로 작업할 수 있기 때문입니다.

## 대체 구현

프로그래매틱 도구 호출은 Anthropic의 관리형 코드 실행 외부에서 구현할 수 있는 일반화 가능한 패턴입니다. 다음은 접근 방식의 개요입니다:

### 클라이언트 측 직접 실행

Claude에게 코드 실행 도구를 제공하고 해당 환경에서 사용 가능한 함수를 설명합니다. Claude가 코드로 도구를 호출할 때 애플리케이션은 해당 함수가 정의된 로컬에서 실행합니다.

**장점:**
- 최소한의 재아키텍처로 구현하기 간단합니다
- 환경 및 지침에 대한 완전한 제어

**단점:**
- 샌드박스 외부에서 신뢰할 수 없는 코드를 실행합니다
- 도구 호출은 코드 주입의 벡터가 될 수 있습니다

**사용 시기**: 애플리케이션이 임의의 코드를 안전하게 실행할 수 있고, 간단한 솔루션을 원하며, Anthropic의 관리형 제공이 요구 사항에 맞지 않을 때입니다.

### 자체 관리형 샌드박스 실행

Claude의 관점에서는 동일한 접근 방식이지만 코드는 보안 제한이 있는 샌드박스 컨테이너에서 실행됩니다(예: 네트워크 송신 없음). 도구가 외부 리소스를 필요로 하는 경우 샌드박스 외부에서 도구 호출을 실행하기 위한 프로토콜이 필요합니다.

**장점:**
- 자신의 인프라에서 안전한 프로그래매틱 도구 호출
- 실행 환경에 대한 완전한 제어

**단점:**
- 구축 및 유지 관리가 복잡합니다
- 인프라 및 프로세스 간 통신 관리가 필요합니다

**사용 시기**: 보안이 중요하고 Anthropic의 관리형 솔루션이 요구 사항에 맞지 않을 때입니다.

### Anthropic 관리형 실행

Anthropic의 프로그래매틱 도구 호출은 Claude에 맞게 조정된 의견이 있는 Python 환경이 있는 샌드박스 실행의 관리형 버전입니다. Anthropic은 컨테이너 관리, 코드 실행 및 보안 도구 호출 통신을 처리합니다.

**장점:**
- 기본적으로 안전하고 보안됩니다
- 최소한의 구성으로 활성화하기 쉽습니다
- Claude에 최적화된 환경 및 지침

Claude API를 사용하는 경우 Anthropic의 관리형 솔루션을 사용하는 것을 권장합니다.

## 관련 기능

<CardGroup cols={2}>
  <Card title="코드 실행 도구" icon="code" href="/docs/ko/agents-and-tools/tool-use/code-execution-tool">
    프로그래매틱 도구 호출을 지원하는 기본 코드 실행 기능에 대해 알아봅니다.
  </Card>
  <Card title="도구 사용 개요" icon="wrench" href="/docs/ko/agents-and-tools/tool-use/overview">
    Claude를 사용한 도구 사용의 기본 사항을 이해합니다.
  </Card>
  <Card title="도구 사용 구현" icon="hammer" href="/docs/ko/agents-and-tools/tool-use/implement-tool-use">
    도구 구현을 위한 단계별 가이드입니다.
  </Card>
</CardGroup>