# 가격 책정

Anthropic의 모델 및 기능에 대한 가격 책정 구조에 대해 알아보세요

---

이 페이지는 Anthropic의 모델 및 기능에 대한 자세한 가격 책정 정보를 제공합니다. 모든 가격은 USD입니다.

가장 최신의 가격 책정 정보는 [claude.com/pricing](https://claude.com/pricing)을 방문하세요.

## 모델 가격 책정

다음 표는 다양한 사용 계층에 걸친 모든 Claude 모델의 가격 책정을 보여줍니다:

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
MTok = 백만 토큰. "Base Input Tokens" 열은 표준 입력 가격을 보여주고, "Cache Writes"와 "Cache Hits"는 [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching)에 특정하며, "Output Tokens"는 출력 가격을 보여줍니다. 프롬프트 캐싱은 다양한 사용 사례에 대한 비용을 최적화하기 위해 5분(기본값) 및 1시간 캐시 지속 시간을 모두 제공합니다.

위의 표는 프롬프트 캐싱에 대한 다음 가격 책정 승수를 반영합니다:
- 5분 캐시 쓰기 토큰은 기본 입력 토큰 가격의 1.25배입니다
- 1시간 캐시 쓰기 토큰은 기본 입력 토큰 가격의 2배입니다
- 캐시 읽기 토큰은 기본 입력 토큰 가격의 0.1배입니다
</Note>

## 제3자 플랫폼 가격 책정

Claude 모델은 [AWS Bedrock](/docs/ko/build-with-claude/claude-on-amazon-bedrock), [Google Vertex AI](/docs/ko/build-with-claude/claude-on-vertex-ai), 및 [Microsoft Foundry](/docs/ko/build-with-claude/claude-in-microsoft-foundry)에서 사용할 수 있습니다. 공식 가격 책정은 다음을 방문하세요:
- [AWS Bedrock 가격 책정](https://aws.amazon.com/bedrock/pricing/)
- [Google Vertex AI 가격 책정](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- [Microsoft Foundry 가격 책정](https://azure.microsoft.com/en-us/pricing/details/ai-foundry/#pricing)

<Note>
**Claude 4.5 모델 이상의 지역 엔드포인트 가격 책정**

Claude Sonnet 4.5 및 Haiku 4.5부터 AWS Bedrock과 Google Vertex AI는 두 가지 엔드포인트 유형을 제공합니다:
- **글로벌 엔드포인트**: 최대 가용성을 위한 지역 간 동적 라우팅
- **지역 엔드포인트**: 특정 지리적 지역 내에서 보장되는 데이터 라우팅

지역 엔드포인트는 글로벌 엔드포인트보다 10% 프리미엄을 포함합니다. **Claude API (1P)는 기본적으로 글로벌이며 이 변경의 영향을 받지 않습니다.** Claude API는 글로벌 전용입니다(다른 제공자의 글로벌 엔드포인트 제공 및 가격 책정과 동등함).

**범위**: 이 가격 책정 구조는 Claude Sonnet 4.5, Haiku 4.5 및 모든 향후 모델에 적용됩니다. 이전 모델(Claude Sonnet 4, Opus 4 및 이전 릴리스)은 기존 가격 책정을 유지합니다.

구현 세부 사항 및 코드 예제:
- [AWS Bedrock 글로벌 대 지역 엔드포인트](/docs/ko/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Google Vertex AI 글로벌 대 지역 엔드포인트](/docs/ko/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)
</Note>

## 기능별 가격 책정

### 배치 처리

Batch API는 입력 및 출력 토큰 모두에 대해 50% 할인으로 대량의 요청을 비동기식으로 처리할 수 있습니다.

| Model             | Batch input      | Batch output    |
|-------------------|------------------|-----------------|
| Claude Opus 4.5     | $2.50 / MTok     | $12.50 / MTok   |
| Claude Opus 4.1     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Opus 4     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Sonnet 4.5   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 4   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok     | $7.50 / MTok    |
| Claude Haiku 4.5  | $0.50 / MTok     | $2.50 / MTok    |
| Claude Haiku 3.5  | $0.40 / MTok     | $2 / MTok       |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))  | $7.50 / MTok     | $37.50 / MTok   |
| Claude Haiku 3    | $0.125 / MTok    | $0.625 / MTok   |

배치 처리에 대한 자세한 정보는 [배치 처리 문서](/docs/ko/build-with-claude/batch-processing)를 참조하세요.

### 긴 컨텍스트 가격 책정

Claude Sonnet 4 또는 Sonnet 4.5를 [1M 토큰 컨텍스트 윈도우 활성화](/docs/ko/build-with-claude/context-windows#1m-token-context-window)와 함께 사용할 때, 200K 입력 토큰을 초과하는 요청은 자동으로 프리미엄 긴 컨텍스트 요금으로 청구됩니다:

<Note>
1M 토큰 컨텍스트 윈도우는 현재 [사용 계층](/docs/ko/api/rate-limits) 4의 조직 및 사용자 정의 속도 제한이 있는 조직에 대해 베타 버전입니다. 1M 토큰 컨텍스트 윈도우는 Claude Sonnet 4 및 Sonnet 4.5에서만 사용할 수 있습니다.
</Note>

| ≤ 200K 입력 토큰 | > 200K 입력 토큰 |
|-----------------------------------|-------------------------------------|
| 입력: $3 / MTok | 입력: $6 / MTok |
| 출력: $15 / MTok | 출력: $22.50 / MTok |

긴 컨텍스트 가격 책정은 다른 가격 책정 수정자와 함께 적용됩니다:
- [Batch API 50% 할인](#batch-processing)은 긴 컨텍스트 가격 책정에 적용됩니다
- [프롬프트 캐싱 승수](#model-pricing)는 긴 컨텍스트 가격 책정 위에 적용됩니다

<Note>
베타 플래그가 활성화된 경우에도 200K 미만의 입력 토큰이 있는 요청은 표준 요금으로 청구됩니다. 요청이 200K 입력 토큰을 초과하면 모든 토큰이 프리미엄 가격으로 청구됩니다.

200K 임계값은 입력 토큰(캐시 읽기/쓰기 포함)에만 기반합니다. 출력 토큰 수는 가격 책정 계층 선택에 영향을 주지 않지만, 입력 임계값을 초과할 때 출력 토큰은 더 높은 요금으로 청구됩니다.
</Note>

API 요청이 1M 컨텍스트 윈도우 요금으로 청구되었는지 확인하려면 API 응답의 `usage` 객체를 검토하세요:

```json
{
  "usage": {
    "input_tokens": 250000,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 500
  }
}
```

다음을 합산하여 총 입력 토큰을 계산하세요:
- `input_tokens`
- `cache_creation_input_tokens` (프롬프트 캐싱을 사용하는 경우)
- `cache_read_input_tokens` (프롬프트 캐싱을 사용하는 경우)

합계가 200,000 토큰을 초과하면 전체 요청이 1M 컨텍스트 요금으로 청구되었습니다.

`usage` 객체에 대한 자세한 정보는 [API 응답 문서](/docs/ko/api/messages#response-usage)를 참조하세요.

### 도구 사용 가격 책정

Tool use requests are priced based on:
1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

Client-side tools are priced the same as any other Claude API request, while server-side tools may incur additional charges based on their specific usage.

The additional tokens from tool use come from:

- The `tools` parameter in API requests (tool names, descriptions, and schemas)
- `tool_use` content blocks in API requests and responses
- `tool_result` content blocks in API requests

When you use `tools`, we also automatically include a special system prompt for the model which enables tool use. The number of tool use tokens required for each model are listed below (excluding the additional tokens listed above). Note that the table assumes at least 1 tool is provided. If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.

| Model                    | Tool choice                                          | Tool use system prompt token count          |
|--------------------------|------------------------------------------------------|---------------------------------------------|
| Claude Opus 4.5            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4.1            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4.5          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))        | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 4.5         | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 3.5         | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))            | `auto`, `none`<hr />`any`, `tool`   | 530 tokens<hr />281 tokens |
| Claude Sonnet 3          | `auto`, `none`<hr />`any`, `tool`   | 159 tokens<hr />235 tokens |
| Claude Haiku 3           | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |

These token counts are added to your normal input and output tokens to calculate the total cost of a request.

현재 모델별 가격은 위의 [모델 가격 책정](#model-pricing) 섹션을 참조하세요.

도구 사용 구현 및 모범 사례에 대한 자세한 정보는 [도구 사용 문서](/docs/ko/agents-and-tools/tool-use/overview)를 참조하세요.

### 특정 도구 가격 책정

#### Bash 도구

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

완전한 가격 책정 세부 사항은 [도구 사용 가격 책정](#tool-use-pricing)을 참조하세요.

#### 코드 실행 도구

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

#### 텍스트 편집기 도구

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

완전한 가격 책정 세부 사항은 [도구 사용 가격 책정](#tool-use-pricing)을 참조하세요.

#### 웹 검색 도구

Web search usage is charged in addition to token usage:

```json
"usage": {
  "input_tokens": 105,
  "output_tokens": 6039,
  "cache_read_input_tokens": 7123,
  "cache_creation_input_tokens": 7345,
  "server_tool_use": {
    "web_search_requests": 1
  }
}
```

Web search is available on the Claude API for **$10 per 1,000 searches**, plus standard token costs for search-generated content. Web search results retrieved throughout a conversation are counted as input tokens, in search iterations executed during a single turn and in subsequent conversation turns.

Each web search counts as one use, regardless of the number of results returned. If an error occurs during web search, the web search will not be billed.

#### 웹 가져오기 도구

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

#### 컴퓨터 사용 도구

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## 에이전트 사용 사례 가격 책정 예제

에이전트 애플리케이션의 가격 책정을 이해하는 것은 Claude로 구축할 때 중요합니다. 이러한 실제 예제는 다양한 에이전트 패턴에 대한 비용을 추정하는 데 도움이 될 수 있습니다.

### 고객 지원 에이전트 예제

고객 지원 에이전트를 구축할 때 비용이 어떻게 분류될 수 있는지는 다음과 같습니다:

<Note>
  10,000개의 지원 티켓 처리를 위한 예제 계산:
  - 대화당 평균 ~3,700 토큰
  - Claude Sonnet 4.5를 $3/MTok 입력, $15/MTok 출력으로 사용
  - 총 비용: 10,000개 티켓당 약 $22.20
</Note>

이 계산에 대한 자세한 설명은 [고객 지원 에이전트 가이드](/docs/ko/about-claude/use-case-guides/customer-support-chat)를 참조하세요.

### 일반 에이전트 워크플로우 가격 책정

여러 단계가 있는 더 복잡한 에이전트 아키텍처의 경우:

1. **초기 요청 처리**
   - 일반적인 입력: 500-1,000 토큰
   - 처리 비용: 요청당 약 $0.003

2. **메모리 및 컨텍스트 검색**
   - 검색된 컨텍스트: 2,000-5,000 토큰
   - 검색당 비용: 작업당 약 $0.015

3. **작업 계획 및 실행**
   - 계획 토큰: 1,000-2,000
   - 실행 피드백: 500-1,000
   - 결합 비용: 작업당 약 $0.045

에이전트 가격 책정 패턴에 대한 포괄적인 가이드는 [에이전트 사용 사례 가이드](/docs/ko/about-claude/use-case-guides)를 참조하세요.

### 비용 최적화 전략

Claude로 에이전트를 구축할 때:

1. **적절한 모델 사용**: 간단한 작업에는 Haiku, 복잡한 추론에는 Sonnet 선택
2. **프롬프트 캐싱 구현**: 반복되는 컨텍스트에 대한 비용 감소
3. **배치 작업**: 시간에 민감하지 않은 작업에 Batch API 사용
4. **사용 패턴 모니터링**: 토큰 소비를 추적하여 최적화 기회 파악

<Tip>
  대량의 에이전트 애플리케이션의 경우 사용자 정의 가격 책정 약정을 위해 [엔터프라이즈 영업팀](https://claude.com/contact-sales)에 문의하는 것을 고려하세요.
</Tip>

## 추가 가격 책정 고려 사항

### 속도 제한

속도 제한은 사용 계층에 따라 다르며 수행할 수 있는 요청 수에 영향을 줍니다:

- **계층 1**: 기본 제한이 있는 진입 수준 사용
- **계층 2**: 성장하는 애플리케이션을 위한 증가된 제한
- **계층 3**: 확립된 애플리케이션을 위한 더 높은 제한
- **계층 4**: 최대 표준 제한
- **엔터프라이즈**: 사용자 정의 제한 사용 가능

자세한 속도 제한 정보는 [속도 제한 문서](/docs/ko/api/rate-limits)를 참조하세요.

더 높은 속도 제한 또는 사용자 정의 가격 책정 약정을 원하면 [영업팀에 문의하세요](https://claude.com/contact-sales).

### 볼륨 할인

대량 사용자에게 볼륨 할인을 사용할 수 있습니다. 이는 경우별로 협상됩니다.

- 표준 계층은 위에 표시된 가격을 사용합니다
- 엔터프라이즈 고객은 사용자 정의 가격 책정을 위해 [영업팀에 문의](mailto:sales@anthropic.com)할 수 있습니다
- 학술 및 연구 할인을 사용할 수 있습니다

### 엔터프라이즈 가격 책정

특정 요구 사항이 있는 엔터프라이즈 고객의 경우:

- 사용자 정의 속도 제한
- 볼륨 할인
- 전담 지원
- 사용자 정의 약관

[sales@anthropic.com](mailto:sales@anthropic.com)의 영업팀에 문의하거나 [Claude Console](/settings/limits)을 통해 엔터프라이즈 가격 책정 옵션을 논의하세요.

## 청구 및 결제

- 청구는 실제 사용량을 기반으로 월별로 계산됩니다
- 결제는 USD로 처리됩니다
- 신용 카드 및 송장 옵션 사용 가능
- [Claude Console](/)에서 사용 추적 가능

## 자주 묻는 질문

**토큰 사용량은 어떻게 계산되나요?**

토큰은 모델이 처리하는 텍스트 조각입니다. 대략적인 추정으로 1 토큰은 영어로 약 4자 또는 0.75단어입니다. 정확한 수는 언어 및 콘텐츠 유형에 따라 다릅니다.

**무료 계층이나 평가판이 있나요?**

신규 사용자는 API를 테스트할 수 있는 소량의 무료 크레딧을 받습니다. 엔터프라이즈 평가를 위한 연장된 평가판에 대한 정보는 [영업팀에 문의](mailto:sales@anthropic.com)하세요.

**할인은 어떻게 적용되나요?**

Batch API 및 프롬프트 캐싱 할인을 결합할 수 있습니다. 예를 들어 두 기능을 함께 사용하면 표준 API 호출과 비교하여 상당한 비용 절감을 제공합니다.

**어떤 결제 방법이 허용되나요?**

표준 계정의 경우 주요 신용 카드를 허용합니다. 엔터프라이즈 고객은 송장 및 기타 결제 방법을 준비할 수 있습니다.

가격 책정에 대한 추가 질문은 [support@anthropic.com](mailto:support@anthropic.com)에 문의하세요.