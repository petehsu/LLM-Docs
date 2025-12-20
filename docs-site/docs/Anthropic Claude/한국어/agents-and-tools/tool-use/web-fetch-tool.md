# 웹 페치 도구

Claude가 지정된 웹 페이지 및 PDF 문서에서 전체 콘텐츠를 검색할 수 있는 웹 페치 도구

---

웹 페치 도구를 사용하면 Claude가 지정된 웹 페이지 및 PDF 문서에서 전체 콘텐츠를 검색할 수 있습니다.

<Note>
웹 페치 도구는 현재 베타 버전입니다. 이를 활성화하려면 API 요청에서 베타 헤더 `web-fetch-2025-09-10`을 사용하세요.

모델 응답의 품질, API 자체 또는 문서의 품질에 대한 피드백을 제공하려면 [이 양식](https://forms.gle/NhWcgmkcvPCMmPE86)을 사용하세요.
</Note>

<Warning>
Claude가 신뢰할 수 없는 입력을 민감한 데이터와 함께 처리하는 환경에서 웹 페치 도구를 활성화하면 데이터 유출 위험이 발생합니다. 신뢰할 수 있는 환경에서만 이 도구를 사용하거나 민감하지 않은 데이터를 처리할 때만 사용하는 것을 권장합니다.

유출 위험을 최소화하기 위해 Claude는 동적으로 URL을 구성할 수 없습니다. Claude는 사용자가 명시적으로 제공한 URL 또는 이전 웹 검색 또는 웹 페치 결과에서 나온 URL만 페치할 수 있습니다. 그러나 이 도구를 사용할 때 신중하게 고려해야 할 잔여 위험이 여전히 있습니다.

데이터 유출이 우려되는 경우 다음을 고려하세요:
- 웹 페치 도구를 완전히 비활성화
- `max_uses` 매개변수를 사용하여 요청 수 제한
- `allowed_domains` 매개변수를 사용하여 알려진 안전한 도메인으로 제한
</Warning>

## 지원되는 모델

웹 페치는 다음에서 사용 가능합니다:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([deprecated](/docs/ko/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## 웹 페치 작동 방식

API 요청에 웹 페치 도구를 추가하면:

1. Claude는 프롬프트 및 사용 가능한 URL을 기반으로 콘텐츠를 페치할 시기를 결정합니다.
2. API는 지정된 URL에서 전체 텍스트 콘텐츠를 검색합니다.
3. PDF의 경우 자동 텍스트 추출이 수행됩니다.
4. Claude는 페치된 콘텐츠를 분석하고 선택적 인용과 함께 응답을 제공합니다.

<Note>
웹 페치 도구는 현재 Javascript를 통해 동적으로 렌더링되는 웹 사이트를 지원하지 않습니다.
</Note>

## 웹 페치 사용 방법

API 요청에 웹 페치 도구를 제공하세요:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: web-fetch-2025-09-10" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "Please analyze the content at https://example.com/article"
            }
        ],
        "tools": [{
            "type": "web_fetch_20250910",
            "name": "web_fetch",
            "max_uses": 5
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Please analyze the content at https://example.com/article"
        }
    ],
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch",
        "max_uses": 5
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "Please analyze the content at https://example.com/article"
      }
    ],
    tools: [{
      type: "web_fetch_20250910",
      name: "web_fetch",
      max_uses: 5
    }],
    headers: {
      "anthropic-beta": "web-fetch-2025-09-10"
    }
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### 도구 정의

웹 페치 도구는 다음 매개변수를 지원합니다:

```json JSON
{
  "type": "web_fetch_20250910",
  "name": "web_fetch",

  // 선택사항: 요청당 페치 수 제한
  "max_uses": 10,

  // 선택사항: 이 도메인에서만 페치
  "allowed_domains": ["example.com", "docs.example.com"],

  // 선택사항: 이 도메인에서 절대 페치하지 않음
  "blocked_domains": ["private.example.com"],

  // 선택사항: 페치된 콘텐츠에 대한 인용 활성화
  "citations": {
    "enabled": true
  },

  // 선택사항: 토큰 단위의 최대 콘텐츠 길이
  "max_content_tokens": 100000
}
```

#### 최대 사용 횟수

`max_uses` 매개변수는 수행되는 웹 페치 수를 제한합니다. Claude가 허용된 것보다 더 많은 페치를 시도하면 `web_fetch_tool_result`는 `max_uses_exceeded` 오류 코드가 있는 오류가 됩니다. 현재 기본 제한이 없습니다.

#### 도메인 필터링

도메인 필터를 사용할 때:

- 도메인에는 HTTP/HTTPS 스키마가 포함되지 않아야 합니다 (`https://example.com` 대신 `example.com` 사용)
- 서브도메인이 자동으로 포함됩니다 (`example.com`은 `docs.example.com`을 포함)
- 서브경로가 지원됩니다 (`example.com/blog`)
- `allowed_domains` 또는 `blocked_domains` 중 하나를 사용할 수 있지만 같은 요청에서 둘 다 사용할 수는 없습니다.

<Warning>
도메인 이름의 유니코드 문자는 다양한 스크립트의 시각적으로 유사한 문자가 도메인 필터를 우회할 수 있는 동형 공격을 통해 보안 취약점을 만들 수 있습니다. 예를 들어 `аmazon.com` (키릴 문자 'а' 사용)은 `amazon.com`과 동일하게 보일 수 있지만 다른 도메인을 나타냅니다.

도메인 허용/차단 목록을 구성할 때:
- 가능하면 ASCII 전용 도메인 이름 사용
- URL 파서가 유니코드 정규화를 다르게 처리할 수 있음을 고려
- 잠재적 동형 변형으로 도메인 필터 테스트
- 의심스러운 유니코드 문자에 대해 도메인 구성을 정기적으로 감사
</Warning>

#### 콘텐츠 제한

`max_content_tokens` 매개변수는 컨텍스트에 포함될 콘텐츠의 양을 제한합니다. 페치된 콘텐츠가 이 제한을 초과하면 잘립니다. 이는 큰 문서를 페치할 때 토큰 사용을 제어하는 데 도움이 됩니다.

<Note>
`max_content_tokens` 매개변수 제한은 대략적입니다. 실제 입력 토큰 수는 약간 다를 수 있습니다.
</Note>

#### 인용

웹 검색과 달리 인용이 항상 활성화되는 경우와 달리 웹 페치의 경우 인용은 선택사항입니다. `"citations": {"enabled": true}`를 설정하여 Claude가 페치된 문서의 특정 구절을 인용하도록 활성화하세요.

<Note>
API 출력을 최종 사용자에게 직접 표시할 때 원본 소스에 대한 인용을 포함해야 합니다. API 출력을 수정하는 경우, 자신의 자료와 재처리 및/또는 결합하여 최종 사용자에게 표시하기 전에 법무팀과 상담하여 적절하게 인용을 표시하세요.
</Note>

### 응답

다음은 응답 구조의 예입니다:

```json
{
  "role": "assistant",
  "content": [
    // 1. Claude의 페치 결정
    {
      "type": "text",
      "text": "I'll fetch the content from the article to analyze it."
    },
    // 2. 페치 요청
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01234567890abcdef",
      "name": "web_fetch",
      "input": {
        "url": "https://example.com/article"
      }
    },
    // 3. 페치 결과
    {
      "type": "web_fetch_tool_result",
      "tool_use_id": "srvtoolu_01234567890abcdef",
      "content": {
        "type": "web_fetch_result",
        "url": "https://example.com/article",
        "content": {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "Full text content of the article..."
          },
          "title": "Article Title",
          "citations": {"enabled": true}
        },
        "retrieved_at": "2025-08-25T10:30:00Z"
      }
    },
    // 4. Claude의 인용과 함께한 분석 (활성화된 경우)
    {
      "text": "Based on the article, ",
      "type": "text"
    },
    {
      "text": "the main argument presented is that artificial intelligence will transform healthcare",
      "type": "text",
      "citations": [
        {
          "type": "char_location",
          "document_index": 0,
          "document_title": "Article Title",
          "start_char_index": 1234,
          "end_char_index": 1456,
          "cited_text": "Artificial intelligence is poised to revolutionize healthcare delivery..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 25039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_fetch_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### 페치 결과

페치 결과에는 다음이 포함됩니다:

- `url`: 페치된 URL
- `content`: 페치된 콘텐츠를 포함하는 문서 블록
- `retrieved_at`: 콘텐츠가 검색된 타임스탬프

<Note>
웹 페치 도구는 성능을 개선하고 중복 요청을 줄이기 위해 결과를 캐시합니다. 이는 반환된 콘텐츠가 항상 URL에서 사용 가능한 최신 버전이 아닐 수 있음을 의미합니다. 캐시 동작은 자동으로 관리되며 다양한 콘텐츠 유형 및 사용 패턴에 최적화하기 위해 시간이 지남에 따라 변경될 수 있습니다.
</Note>

PDF 문서의 경우 콘텐츠는 base64 인코딩 데이터로 반환됩니다:

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_02",
  "content": {
    "type": "web_fetch_result",
    "url": "https://example.com/paper.pdf",
    "content": {
      "type": "document",
      "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmo..."
      },
      "citations": {"enabled": true}
    },
    "retrieved_at": "2025-08-25T10:30:02Z"
  }
}
```

#### 오류

웹 페치 도구에서 오류가 발생하면 Claude API는 응답 본문에 표현된 오류와 함께 200 (성공) 응답을 반환합니다:

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_a93jad",
  "content": {
    "type": "web_fetch_tool_error",
    "error_code": "url_not_accessible"
  }
}
```

가능한 오류 코드는 다음과 같습니다:

- `invalid_input`: 잘못된 URL 형식
- `url_too_long`: URL이 최대 길이(250자)를 초과
- `url_not_allowed`: URL이 도메인 필터링 규칙 및 모델 제한에 의해 차단됨
- `url_not_accessible`: 콘텐츠 페치 실패 (HTTP 오류)
- `too_many_requests`: 속도 제한 초과
- `unsupported_content_type`: 지원되지 않는 콘텐츠 유형 (텍스트 및 PDF만 지원)
- `max_uses_exceeded`: 최대 웹 페치 도구 사용 횟수 초과
- `unavailable`: 내부 오류 발생

## URL 검증

보안상의 이유로 웹 페치 도구는 이전에 대화 컨텍스트에 나타난 URL만 페치할 수 있습니다. 여기에는 다음이 포함됩니다:

- 사용자 메시지의 URL
- 클라이언트 측 도구 결과의 URL
- 이전 웹 검색 또는 웹 페치 결과의 URL

도구는 Claude가 생성하는 임의의 URL이나 컨테이너 기반 서버 도구(코드 실행, Bash 등)의 URL을 페치할 수 없습니다.

## 검색 및 페치 결합

웹 페치는 웹 검색과 원활하게 작동하여 포괄적인 정보 수집을 수행합니다:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Find recent articles about quantum computing and analyze the most relevant one in detail"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        },
        {
            "type": "web_fetch_20250910",
            "name": "web_fetch",
            "max_uses": 5,
            "citations": {"enabled": True}
        }
    ],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)
```

이 워크플로우에서 Claude는:
1. 웹 검색을 사용하여 관련 기사 찾기
2. 가장 유망한 결과 선택
3. 웹 페치를 사용하여 전체 콘텐츠 검색
4. 인용과 함께 상세한 분석 제공

## 프롬프트 캐싱

웹 페치는 [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching)과 함께 작동합니다. 프롬프트 캐싱을 활성화하려면 요청에 `cache_control` 중단점을 추가하세요. 캐시된 페치 결과는 대화 턴 전체에서 재사용할 수 있습니다.

```python
import anthropic

client = anthropic.Anthropic()

# 웹 페치를 사용한 첫 번째 요청
messages = [
    {
        "role": "user",
        "content": "Analyze this research paper: https://arxiv.org/abs/2024.12345"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# Claude의 응답을 대화에 추가
messages.append({
    "role": "assistant",
    "content": response1.content
})

# 캐시 중단점이 있는 두 번째 요청
messages.append({
    "role": "user",
    "content": "What methodology does the paper use?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# 두 번째 응답은 캐시된 페치 결과의 이점을 누립니다
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

## 스트리밍

스트리밍이 활성화되면 페치 이벤트는 콘텐츠 검색 중 일시 중지와 함께 스트림의 일부입니다:

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Claude의 페치 결정

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_fetch"}}

// 페치 URL 스트리밍
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"url\":\"https://example.com/article\"}"}}

// 페치 실행 중 일시 중지

// 페치 결과 스트리밍
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_fetch_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "web_fetch_result", "url": "https://example.com/article", "content": {"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "Article content..."}}}}}

// Claude의 응답 계속...
```

## 배치 요청

[메시지 배치 API](/docs/ko/build-with-claude/batch-processing)에 웹 페치 도구를 포함할 수 있습니다. 메시지 배치 API를 통한 웹 페치 도구 호출은 일반 메시지 API 요청과 동일하게 가격이 책정됩니다.

## 사용 및 가격 책정

Web fetch usage has **no additional charges** beyond standard token costs:

```json
"usage": {
  "input_tokens": 25039,
  "output_tokens": 931,
  "cache_read_input_tokens": 0,
  "cache_creation_input_tokens": 0,
  "server_tool_use": {
    "web_fetch_requests": 1
  }
}
```

The web fetch tool is available on the Claude API at **no additional cost**. You only pay standard token costs for the fetched content that becomes part of your conversation context.

To protect against inadvertently fetching large content that would consume excessive tokens, use the `max_content_tokens` parameter to set appropriate limits based on your use case and budget considerations.

Example token usage for typical content:
- Average web page (10KB): ~2,500 tokens
- Large documentation page (100KB): ~25,000 tokens  
- Research paper PDF (500KB): ~125,000 tokens