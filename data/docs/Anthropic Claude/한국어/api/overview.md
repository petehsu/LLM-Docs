# API 개요

Claude API는 Claude 모델에 대한 프로그래밍 방식의 액세스를 제공하는 RESTful API입니다.

---

Claude API는 `https://api.anthropic.com`의 RESTful API로, Claude 모델에 대한 프로그래밍 방식의 액세스를 제공합니다. 기본 API는 대화형 상호작용을 위한 Messages API(`POST /v1/messages`)입니다.

<Note>
**Claude를 처음 사용하시나요?** [시작하기](/docs/ko/get-started)에서 필수 요구사항과 첫 번째 API 호출을 확인하거나, [Messages 작업](/docs/ko/build-with-claude/working-with-messages)에서 요청/응답 패턴과 예제를 참조하세요.
</Note>

## 필수 요구사항

Claude API를 사용하려면 다음이 필요합니다:

- [Anthropic Console 계정](https://console.anthropic.com)
- [API 키](/settings/keys)

단계별 설정 지침은 [시작하기](/docs/ko/get-started)를 참조하세요.

## 사용 가능한 API

Claude API에는 다음 API가 포함됩니다:

**일반 공개:**
- **[Messages API](/docs/ko/api/messages)**: Claude에 메시지를 보내 대화형 상호작용 수행 (`POST /v1/messages`)
- **[Message Batches API](/docs/ko/api/creating-message-batches)**: 50% 비용 절감으로 대량의 Messages 요청을 비동기적으로 처리 (`POST /v1/messages/batches`)
- **[Token Counting API](/docs/ko/api/messages-count-tokens)**: 비용과 속도 제한을 관리하기 위해 메시지의 토큰 수 계산 (`POST /v1/messages/count_tokens`)
- **[Models API](/docs/ko/api/models-list)**: 사용 가능한 Claude 모델 및 세부 정보 나열 (`GET /v1/models`)

**베타:**
- **[Files API](/docs/ko/api/files-create)**: 여러 API 호출에서 사용할 파일 업로드 및 관리 (`POST /v1/files`, `GET /v1/files`)
- **[Skills API](/docs/ko/api/skills/create-skill)**: 사용자 정의 에이전트 스킬 생성 및 관리 (`POST /v1/skills`, `GET /v1/skills`)

모든 엔드포인트, 매개변수 및 응답 스키마가 포함된 완전한 API 참조는 네비게이션에 나열된 API 참조 페이지를 탐색하세요. 베타 기능에 액세스하려면 [베타 헤더](/docs/ko/api/beta-headers)를 참조하세요.

## 인증

Claude API에 대한 모든 요청에는 다음 헤더가 포함되어야 합니다:

| 헤더 | 값 | 필수 |
|--------|-------|----------|
| `x-api-key` | Console의 API 키 | 예 |
| `anthropic-version` | API 버전 (예: `2023-06-01`) | 예 |
| `content-type` | `application/json` | 예 |

[Client SDKs](#client-sdks)를 사용하는 경우 SDK가 이러한 헤더를 자동으로 전송합니다. API 버전 관리 세부 정보는 [API 버전](/docs/ko/api/versioning)을 참조하세요.

### API 키 가져오기

API는 웹 [Console](https://console.anthropic.com/)을 통해 제공됩니다. [Workbench](https://console.anthropic.com/workbench)를 사용하여 브라우저에서 API를 시도한 후 [Account Settings](https://console.anthropic.com/settings/keys)에서 API 키를 생성할 수 있습니다. [워크스페이스](https://console.anthropic.com/settings/workspaces)를 사용하여 API 키를 분할하고 [지출을 제어](/docs/ko/api/rate-limits)할 수 있습니다.

## Client SDK

Anthropic은 인증, 요청 형식 지정, 오류 처리 등을 처리하여 API 통합을 단순화하는 공식 SDK를 제공합니다.

**이점**:
- 자동 헤더 관리 (x-api-key, anthropic-version, content-type)
- 타입 안전 요청 및 응답 처리
- 기본 제공 재시도 로직 및 오류 처리
- 스트리밍 지원
- 요청 타임아웃 및 연결 관리

**예제** (Python):
```python
from anthropic import Anthropic

client = Anthropic()  # 환경에서 ANTHROPIC_API_KEY를 읽음
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}]
)
```

Client SDK 목록 및 각각의 설치 지침은 [Client SDKs](/docs/ko/api/client-sdks)를 참조하세요.

## Claude API 대 타사 플랫폼

Claude는 Anthropic의 직접 API와 파트너 플랫폼을 통해 사용할 수 있습니다. 인프라, 규정 준수 요구사항 및 가격 책정 기본 설정에 따라 선택하세요.

### Claude API

- 최신 모델 및 기능에 **직접 액세스**
- **Anthropic 청구 및 지원**
- **최적 사용 대상**: 새로운 통합, 전체 기능 액세스, Anthropic과의 직접 관계

### 타사 플랫폼 API

AWS, Google Cloud 또는 Microsoft Azure를 통해 Claude에 액세스:
- 클라우드 제공자 청구 및 IAM과 **통합**
- 직접 API와 **기능 지연 또는 차이가 있을 수 있음**
- **최적 사용 대상**: 기존 클라우드 약정, 특정 규정 준수 요구사항, 통합 클라우드 청구

| 플랫폼 | 제공자 | 문서 |
|----------|----------|---------------|
| Amazon Bedrock | AWS | [Amazon Bedrock의 Claude](/docs/ko/build-with-claude/claude-on-amazon-bedrock) |
| Vertex AI | Google Cloud | [Vertex AI의 Claude](/docs/ko/build-with-claude/claude-on-vertex-ai) |
| Azure AI | Microsoft Azure | [Azure AI의 Claude](/docs/ko/build-with-claude/claude-in-microsoft-foundry) |

<Note>
플랫폼 간 기능 가용성은 [기능 개요](/docs/ko/build-with-claude/overview)를 참조하세요.
</Note>

## 요청 및 응답 형식

### 요청 크기 제한

API는 엔드포인트에 따라 다른 최대 요청 크기를 가집니다:

| 엔드포인트 | 최대 크기 |
|----------|--------------|
| 표준 엔드포인트 (Messages, Token Counting) | 32 MB |
| [Batch API](/docs/ko/build-with-claude/batch-processing) | 256 MB |
| [Files API](/docs/ko/build-with-claude/files) | 500 MB |

이러한 제한을 초과하면 413 `request_too_large` 오류가 발생합니다.

### 응답 헤더

Claude API는 모든 응답에 다음 헤더를 포함합니다:

- `request-id`: 요청에 대한 전역적으로 고유한 식별자
- `anthropic-organization-id`: 요청에 사용된 API 키와 연결된 조직 ID

## 속도 제한 및 가용성

### 속도 제한

API는 오용을 방지하고 용량을 관리하기 위해 속도 제한 및 지출 제한을 적용합니다. 제한은 API를 사용함에 따라 자동으로 증가하는 사용 계층으로 구성됩니다. 각 계층에는 다음이 있습니다:

- **지출 제한**: API 사용에 대한 최대 월간 비용
- **속도 제한**: 분당 최대 요청 수 (RPM) 및 분당 최대 토큰 수 (TPM)

[Console](/settings/limits)에서 조직의 현재 제한을 볼 수 있습니다. 더 높은 제한 또는 Priority Tier (약정된 지출이 있는 향상된 서비스 수준)를 원하면 Console을 통해 영업팀에 문의하세요.

제한, 계층 및 속도 제한에 사용되는 토큰 버킷 알고리즘에 대한 자세한 정보는 [속도 제한](/docs/ko/api/rate-limits)을 참조하세요.

### 가용성

Claude API는 전 세계 [많은 국가 및 지역](/docs/ko/api/supported-regions)에서 사용 가능합니다. 지원되는 지역 페이지를 확인하여 귀하의 위치에서 가용성을 확인하세요.

## 기본 예제

다음은 Messages API를 사용한 최소 요청입니다:

```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

**응답:**
```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I assist you today?"
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 12,
    "output_tokens": 8
  }
}
```

완전한 예제 및 튜토리얼은 [시작하기](/docs/ko/get-started) 및 [Messages 작업](/docs/ko/build-with-claude/working-with-messages)을 참조하세요.

## 다음 단계

<CardGroup cols={3}>
  <Card title="시작하기" icon="rocket" href="/docs/ko/get-started">
    필수 요구사항, 단계별 튜토리얼 및 여러 언어의 예제
  </Card>
  <Card title="Messages 작업" icon="message" href="/docs/ko/build-with-claude/working-with-messages">
    요청/응답 패턴, 다중 턴 대화 및 모범 사례
  </Card>
  <Card title="Messages API 참조" icon="book" href="/docs/ko/api/messages">
    완전한 API 사양: 매개변수, 응답 및 오류 코드
  </Card>
  <Card title="Client SDKs" icon="code" href="/docs/ko/api/client-sdks">
    Python, TypeScript, Java, Go, C#, Ruby 및 PHP에 대한 설치 가이드
  </Card>
  <Card title="기능 개요" icon="grid" href="/docs/ko/build-with-claude/overview">
    기능 탐색: 캐싱, 비전, 도구 사용, 스트리밍 등
  </Card>
  <Card title="속도 제한" icon="gauge" href="/docs/ko/api/rate-limits">
    사용 계층, 지출 제한 및 토큰 버킷 알고리즘을 사용한 속도 제한
  </Card>
</CardGroup>