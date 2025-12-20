# Claude 4.5의 새로운 기능

Claude 4.5는 다양한 사용 사례를 위해 설계된 세 가지 모델을 소개합니다.

---

Claude 4.5는 다양한 사용 사례를 위해 설계된 세 가지 모델을 소개합니다:

- **Claude Opus 4.5**: 최대 기능과 실용적인 성능을 결합한 가장 지능형 모델입니다. 이전 Opus 모델보다 더 접근 가능한 가격대를 제공합니다. 200k 토큰 컨텍스트 윈도우로 사용 가능합니다.
- **Claude Sonnet 4.5**: 복잡한 에이전트와 코딩을 위한 최고의 모델이며, 대부분의 작업에서 가장 높은 지능을 제공합니다. 200k 및 1M(베타) 토큰 컨텍스트 윈도우로 사용 가능합니다.
- **Claude Haiku 4.5**: 가장 빠르고 가장 지능형 Haiku 모델이며 거의 최첨단 성능을 제공합니다. 200k 토큰 컨텍스트 윈도우로 사용 가능합니다.

## Opus 4.5의 Opus 4.1 대비 주요 개선 사항

### 최대 지능

Claude Opus 4.5는 최대 기능과 실용적인 성능을 결합한 가장 지능형 모델입니다. 추론, 코딩 및 복잡한 문제 해결 작업 전반에 걸쳐 획기적인 개선을 제공하면서 Opus 제품군에서 기대되는 높은 품질의 출력을 유지합니다.

### Effort 파라미터

Claude Opus 4.5는 [effort 파라미터](/docs/ko/build-with-claude/effort)를 지원하는 유일한 모델이며, Claude가 응답할 때 사용하는 토큰 수를 제어할 수 있습니다. 이를 통해 단일 모델로 응답의 철저함과 토큰 효율성 사이의 트레이드오프를 조정할 수 있습니다.

effort 파라미터는 텍스트 응답, 도구 호출 및 확장 사고를 포함한 응답의 모든 토큰에 영향을 미칩니다. 다음 중에서 선택할 수 있습니다:
- **High effort**: 복잡한 분석 및 상세한 설명을 위한 최대 철저함
- **Medium effort**: 대부분의 프로덕션 사용 사례를 위한 균형 잡힌 접근
- **Low effort**: 대량 자동화를 위한 가장 토큰 효율적인 응답

### 컴퓨터 사용 우수성

Claude Opus 4.5는 [향상된 컴퓨터 사용 기능](/docs/ko/agents-and-tools/tool-use/computer-use-tool)을 도입하며, 특정 화면 영역을 전체 해상도로 자세히 검사할 수 있는 새로운 줌 작업을 제공합니다. 이를 통해 Claude는 표준 스크린샷에서 불명확할 수 있는 세밀한 UI 요소, 작은 텍스트 및 상세한 시각 정보를 검사할 수 있습니다.

줌 기능은 특히 다음에 유용합니다:
- 작은 UI 요소 및 컨트롤 검사
- 작은 글씨 또는 상세한 텍스트 읽기
- 밀집된 정보가 있는 복잡한 인터페이스 분석
- 작업을 수행하기 전에 정확한 시각적 세부 사항 확인

### 실용적인 성능

Claude Opus 4.5는 이전 Opus 모델보다 [더 접근 가능한 가격대](/docs/ko/about-claude/pricing)에서 플래그십 지능을 제공하므로, 더 광범위한 애플리케이션 및 사용 사례에 고급 AI 기능을 사용할 수 있습니다.

### 사고 블록 보존

Claude Opus 4.5는 [이전의 모든 사고 블록을 자동으로 보존](/docs/ko/build-with-claude/extended-thinking#thinking-block-preservation-in-claude-opus-4-5)하여 대화 전체에서 추론 연속성을 유지하고 확장된 다중 턴 상호 작용 및 도구 사용 세션 전반에 걸쳐 추론 연속성을 유지합니다. 이를 통해 Claude는 복잡하고 오래 실행되는 작업에서 작업할 때 전체 추론 기록을 효과적으로 활용할 수 있습니다.

## Sonnet 4.5의 Sonnet 4 대비 주요 개선 사항

### 코딩 우수성

Claude Sonnet 4.5는 지금까지 최고의 코딩 모델이며, 전체 개발 수명 주기 전반에 걸쳐 상당한 개선을 제공합니다:

- **SWE-bench Verified 성능**: 코딩 벤치마크에서 최첨단 고급 성능
- **향상된 계획 및 시스템 설계**: 더 나은 아키텍처 결정 및 코드 구성
- **개선된 보안 엔지니어링**: 더 강력한 보안 관행 및 취약점 탐지
- **더 나은 지시 준수**: 코딩 사양 및 요구 사항에 대한 더 정확한 준수

<Note>
Claude Sonnet 4.5는 [확장 사고](/docs/ko/build-with-claude/extended-thinking)가 활성화되었을 때 코딩 작업에서 훨씬 더 나은 성능을 발휘합니다. 확장 사고는 기본적으로 비활성화되어 있지만, 복잡한 코딩 작업에는 활성화하는 것을 권장합니다. 확장 사고가 [프롬프트 캐싱 효율성](/docs/ko/build-with-claude/prompt-caching#caching-with-thinking-blocks)에 영향을 미친다는 점에 유의하세요. 구성 세부 사항은 [마이그레이션 가이드](/docs/ko/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations)를 참조하세요.
</Note>

### 에이전트 기능

Claude Sonnet 4.5는 에이전트 기능에서 주요 진전을 소개합니다:

- **확장된 자율 작동**: Sonnet 4.5는 증분 진행에 대한 명확성과 초점을 유지하면서 몇 시간 동안 독립적으로 작업할 수 있습니다. 모델은 한 번에 모든 것을 시도하기보다는 몇 가지 작업에서 꾸준한 진전을 이룹니다. 달성한 내용을 정확하게 반영하는 사실 기반 진행 상황 업데이트를 제공합니다.
- **컨텍스트 인식**: Claude는 이제 대화 전체에서 토큰 사용량을 추적하며, 각 도구 호출 후 업데이트를 받습니다. 이러한 인식은 조기 작업 포기를 방지하고 오래 실행되는 작업에서 더 효과적인 실행을 가능하게 합니다. 기술 세부 사항은 [컨텍스트 인식](/docs/ko/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5)을 참조하고, 프롬프팅 지침은 [프롬프트 엔지니어링](/docs/ko/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows)을 참조하세요.
- **향상된 도구 사용**: 모델은 병렬 도구 호출을 더 효과적으로 사용하여 연구 중에 여러 추측 검색을 동시에 실행하고 컨텍스트를 더 빠르게 구축하기 위해 여러 파일을 한 번에 읽습니다. 여러 도구 및 정보 소스 전반에 걸친 개선된 조정을 통해 모델은 에이전트 검색 및 코딩 워크플로우에서 광범위한 기능을 효과적으로 활용할 수 있습니다.
- **고급 컨텍스트 관리**: Sonnet 4.5는 외부 파일에서 예외적인 상태 추적을 유지하여 세션 전반에 걸쳐 목표 지향성을 보존합니다. 더 효과적인 컨텍스트 윈도우 사용 및 새로운 컨텍스트 관리 API 기능과 결합하여 모델은 확장된 세션 전반에 걸쳐 정보를 최적으로 처리하여 시간 경과에 따른 일관성을 유지합니다.

<Note>컨텍스트 인식은 Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 및 Opus 4.5에서 사용 가능합니다.</Note>

### 통신 및 상호 작용 스타일

Claude Sonnet 4.5는 간결하고 직접적이며 자연스러운 정제된 통신 접근 방식을 가지고 있습니다. 사실 기반 진행 상황 업데이트를 제공하며 워크플로우 모멘텀을 유지하기 위해 도구 호출 후 자세한 요약을 건너뛸 수 있습니다(프롬프팅으로 조정할 수 있음).

이 통신 스타일로 작업하기 위한 자세한 지침은 [Claude 4 모범 사례](/docs/ko/build-with-claude/prompt-engineering/claude-4-best-practices)를 참조하세요.

### 창의적 콘텐츠 생성

Claude Sonnet 4.5는 창의적 콘텐츠 작업에서 탁월합니다:

- **프레젠테이션 및 애니메이션**: 슬라이드 및 시각적 콘텐츠 생성에서 Claude Opus 4.1 및 Opus 4.5와 동등하거나 초과
- **창의적 감각**: 강한 지시 준수로 세련되고 전문적인 출력 생성
- **첫 시도 품질**: 초기 시도에서 사용 가능하고 잘 설계된 콘텐츠 생성

## Haiku 4.5의 Haiku 3.5 대비 주요 개선 사항

Claude Haiku 4.5는 Haiku 모델 제품군을 위한 혁신적인 도약을 나타내며, 최첨단 기능을 가장 빠른 모델 클래스로 가져옵니다:

### 거의 최첨단 지능과 매우 빠른 속도

Claude Haiku 4.5는 Sonnet 4와 거의 동등한 성능을 훨씬 낮은 비용과 더 빠른 속도로 제공합니다:

- **거의 최첨단 지능**: 추론, 코딩 및 복잡한 작업 전반에 걸쳐 Sonnet 4 성능과 일치
- **향상된 속도**: Sonnet 4보다 2배 이상 빠르며, 출력 토큰당 초(OTPS) 최적화
- **최적의 비용 성능**: 거의 최첨단 지능을 1/3의 비용으로 제공하며, 대량 배포에 이상적

### 확장 사고 기능

Claude Haiku 4.5는 **첫 번째 Haiku 모델**로 확장 사고를 지원하여 Haiku 제품군에 고급 추론 기능을 제공합니다:

- **속도에서의 추론**: 복잡한 문제 해결을 위한 Claude의 내부 추론 프로세스에 대한 액세스
- **사고 요약**: 프로덕션 준비 배포를 위한 요약된 사고 출력
- **인터리브된 사고**: 더 정교한 다중 단계 워크플로우를 위해 도구 호출 사이에 생각
- **예산 제어**: 추론 깊이와 속도의 균형을 맞추기 위해 사고 토큰 예산 구성

확장 사고는 API 요청에 `thinking` 파라미터를 추가하여 명시적으로 활성화해야 합니다. 구현 세부 사항은 [확장 사고 문서](/docs/ko/build-with-claude/extended-thinking)를 참조하세요.

<Note>
Claude Haiku 4.5는 [확장 사고](/docs/ko/build-with-claude/extended-thinking)가 활성화되었을 때 코딩 및 추론 작업에서 훨씬 더 나은 성능을 발휘합니다. 확장 사고는 기본적으로 비활성화되어 있지만, 복잡한 문제 해결, 코딩 작업 및 다중 단계 추론에는 활성화하는 것을 권장합니다. 확장 사고가 [프롬프트 캐싱 효율성](/docs/ko/build-with-claude/prompt-caching#caching-with-thinking-blocks)에 영향을 미친다는 점에 유의하세요. 구성 세부 사항은 [마이그레이션 가이드](/docs/ko/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations)를 참조하세요.
</Note>

<Note>Claude Sonnet 3.7, Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 및 Opus 4.5에서 사용 가능합니다.</Note>

### 컨텍스트 인식

Claude Haiku 4.5는 **컨텍스트 인식**을 제공하여 모델이 대화 전체에서 남은 컨텍스트 윈도우를 추적할 수 있습니다:

- **토큰 예산 추적**: Claude는 각 도구 호출 후 남은 컨텍스트 용량에 대한 실시간 업데이트를 받습니다
- **더 나은 작업 지속성**: 모델은 사용 가능한 작업 공간을 이해함으로써 작업을 더 효과적으로 실행할 수 있습니다
- **다중 컨텍스트 윈도우 워크플로우**: 확장된 세션 전반에 걸친 상태 전환의 개선된 처리

이것은 기본 컨텍스트 인식 기능을 갖춘 첫 번째 Haiku 모델입니다. 프롬프팅 지침은 [Claude 4 모범 사례](/docs/ko/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows)를 참조하세요.

<Note>Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 및 Opus 4.5에서 사용 가능합니다.</Note>

### 강력한 코딩 및 도구 사용

Claude Haiku 4.5는 최신 Claude 모델에서 기대되는 강력한 코딩 기능을 제공합니다:

- **코딩 능력**: 코드 생성, 디버깅 및 리팩토링 작업 전반에 걸친 강력한 성능
- **전체 도구 지원**: bash, 코드 실행, 텍스트 편집기, 웹 검색 및 컴퓨터 사용을 포함한 모든 Claude 4 도구와 호환
- **향상된 컴퓨터 사용**: 자율 데스크톱 상호 작용 및 브라우저 자동화 워크플로우에 최적화
- **병렬 도구 실행**: 복잡한 워크플로우를 위한 여러 도구 전반에 걸친 효율적인 조정

Haiku 4.5는 지능과 효율성을 모두 요구하는 사용 사례를 위해 설계되었습니다:

- **실시간 애플리케이션**: 대화형 사용자 경험을 위한 빠른 응답 시간
- **대량 처리**: 대규모 배포를 위한 비용 효율적인 지능
- **무료 계층 구현**: 접근 가능한 가격대의 프리미엄 모델 품질
- **서브 에이전트 아키텍처**: 다중 에이전트 시스템을 위한 빠르고 지능형 에이전트
- **규모에서의 컴퓨터 사용**: 비용 효율적인 자율 데스크톱 및 브라우저 자동화

## 새로운 API 기능

### 프로그래밍 방식의 도구 호출(베타)

[프로그래밍 방식의 도구 호출](/docs/ko/agents-and-tools/tool-use/programmatic-tool-calling)을 통해 Claude는 각 도구 호출에 대해 모델을 통한 왕복을 요구하기보다는 코드 실행 컨테이너 내에서 프로그래밍 방식으로 도구를 호출하는 코드를 작성할 수 있습니다. 이는 다중 도구 워크플로우의 지연 시간을 크게 줄이고 Claude가 모델의 컨텍스트 윈도우에 도달하기 전에 데이터를 필터링하거나 처리할 수 있도록 하여 토큰 소비를 감소시킵니다.

```python
tools=[
    {
        "type": "code_execution_20250825",
        "name": "code_execution"
    },
    {
        "name": "query_database",
        "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"]  # Enable programmatic calling
    }
]
```

주요 이점:
- **감소된 지연 시간**: 도구 호출 사이의 모델 왕복 제거
- **토큰 효율성**: 도구 결과를 프로그래밍 방식으로 처리 및 필터링한 후 Claude로 반환
- **복잡한 워크플로우**: 루프, 조건부 논리 및 배치 처리 지원

<Note>Claude Opus 4.5 및 Claude Sonnet 4.5에서 사용 가능합니다. [베타 헤더](/docs/ko/api/beta-headers) 필요: `advanced-tool-use-2025-11-20`</Note>

### 도구 검색 도구(베타)

[도구 검색 도구](/docs/ko/agents-and-tools/tool-use/tool-search-tool)를 통해 Claude는 수백 또는 수천 개의 도구로 작업할 수 있으며, 필요에 따라 동적으로 도구를 발견하고 로드할 수 있습니다. 모든 도구 정의를 미리 컨텍스트 윈도우에 로드하는 대신, Claude는 도구 카탈로그를 검색하고 필요한 도구만 로드합니다.

두 가지 검색 변형을 사용할 수 있습니다:
- **Regex** (`tool_search_tool_regex_20251119`): Claude는 도구 이름, 설명 및 인수를 검색하기 위해 정규식 패턴을 구성합니다
- **BM25** (`tool_search_tool_bm25_20251119`): Claude는 자연어 쿼리를 사용하여 도구를 검색합니다

```python
tools=[
    {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
    },
    {
        "name": "get_weather",
        "description": "Get the weather at a specific location",
        "input_schema": {...},
        "defer_loading": True  # Load on-demand via search
    }
]
```

이 접근 방식은 두 가지 중요한 문제를 해결합니다:
- **컨텍스트 효율성**: 모든 도구 정의를 미리 로드하지 않음으로써 10-20K 토큰 절약
- **도구 선택 정확도**: 100개 이상의 사용 가능한 도구가 있어도 높은 정확도 유지

<Note>Claude Opus 4.5 및 Claude Sonnet 4.5에서 사용 가능합니다. [베타 헤더](/docs/ko/api/beta-headers) 필요: `advanced-tool-use-2025-11-20`</Note>

### Effort 파라미터(베타)

[effort 파라미터](/docs/ko/build-with-claude/effort)를 통해 Claude가 응답할 때 사용하는 토큰 수를 제어하여 응답의 철저함과 토큰 효율성 사이의 트레이드오프를 조정할 수 있습니다:

```python
response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    output_config={
        "effort": "medium"  # "low", "medium", or "high"
    }
)
```

effort 파라미터는 텍스트 응답, 도구 호출 및 확장 사고를 포함한 응답의 모든 토큰에 영향을 미칩니다. 낮은 effort 수준은 최소한의 설명으로 더 간결한 응답을 생성하는 반면, 높은 effort는 상세한 추론과 포괄적인 답변을 제공합니다.

<Note>Claude Opus 4.5에서만 사용 가능합니다. [베타 헤더](/docs/ko/api/beta-headers) 필요: `effort-2025-11-24`</Note>

### 도구 사용 예제(베타)

[도구 사용 예제](/docs/ko/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples)를 통해 유효한 도구 입력의 구체적인 예제를 제공하여 Claude가 도구를 더 효과적으로 사용하는 방법을 이해하도록 도울 수 있습니다. 이는 중첩된 객체, 선택적 파라미터 또는 형식에 민감한 입력이 있는 복잡한 도구에 특히 유용합니다.

```python
tools=[
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {...},
        "input_examples": [
            {
                "location": "San Francisco, CA",
                "unit": "fahrenheit"
            },
            {
                "location": "Tokyo, Japan",
                "unit": "celsius"
            },
            {
                "location": "New York, NY"  # Demonstrates optional 'unit' parameter
            }
        ]
    }
]
```

예제는 도구 스키마와 함께 프롬프트에 포함되어 Claude에게 잘 형성된 도구 호출의 구체적인 패턴을 보여줍니다. 각 예제는 도구의 `input_schema`에 따라 유효해야 합니다.

<Note>Claude Sonnet 4.5, Haiku 4.5, Opus 4.5, Opus 4.1 및 Opus 4에서 사용 가능합니다. [베타 헤더](/docs/ko/api/beta-headers) 필요: `advanced-tool-use-2025-11-20`</Note>

### 메모리 도구(베타)

새로운 [메모리 도구](/docs/ko/agents-and-tools/tool-use/memory-tool)를 통해 Claude는 컨텍스트 윈도우 외부에 정보를 저장하고 검색할 수 있습니다:

```python
tools=[
    {
        "type": "memory_20250818",
        "name": "memory"
    }
]
```

이를 통해 다음이 가능합니다:
- 시간 경과에 따른 지식 기반 구축
- 세션 전반에 걸쳐 프로젝트 상태 유지
- 파일 기반 저장소를 통해 효과적으로 무제한 컨텍스트 보존

<Note>Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 및 Opus 4.5에서 사용 가능합니다. [베타 헤더](/docs/ko/api/beta-headers) 필요: `context-management-2025-06-27`</Note>

### 컨텍스트 편집

[컨텍스트 편집](/docs/ko/build-with-claude/context-editing)을 사용하여 자동 도구 호출 지우기를 통한 지능형 컨텍스트 관리:

```python
response = client.beta.messages.create(
    betas=["context-management-2025-06-27"],
    model="claude-sonnet-4-5",  # or claude-haiku-4-5
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {"type": "input_tokens", "value": 500},
                "keep": {"type": "tool_uses", "value": 2},
                "clear_at_least": {"type": "input_tokens", "value": 100}
            }
        ]
    },
    tools=[...]
)
```

이 기능은 토큰 제한에 접근할 때 오래된 도구 호출 및 결과를 자동으로 제거하여 오래 실행되는 에이전트 세션에서 컨텍스트를 관리하는 데 도움이 됩니다.

<Note>Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 및 Opus 4.5에서 사용 가능합니다. [베타 헤더](/docs/ko/api/beta-headers) 필요: `context-management-2025-06-27`</Note>

### 향상된 중지 이유

Claude 4.5 모델은 요청된 `max_tokens` 제한이 아닌 컨텍스트 윈도우 제한으로 인해 생성이 중지되었음을 명시적으로 나타내는 새로운 `model_context_window_exceeded` 중지 이유를 도입합니다. 이를 통해 애플리케이션 논리에서 컨텍스트 윈도우 제한을 더 쉽게 처리할 수 있습니다.

```json
{
  "stop_reason": "model_context_window_exceeded",
  "usage": {
    "input_tokens": 150000,
    "output_tokens": 49950
  }
}
```

### 개선된 도구 파라미터 처리

Claude 4.5 모델은 도구 호출 문자열 파라미터에서 의도적인 형식을 보존하는 버그 수정을 포함합니다. 이전에는 문자열 파라미터의 후행 줄바꿈이 때때로 잘못 제거되었습니다. 이 수정은 정확한 형식이 필요한 도구(예: 텍스트 편집기)가 의도한 대로 정확하게 파라미터를 받도록 보장합니다.

<Note>
이는 API 변경이 필요 없는 백그라운드 개선입니다. 그러나 문자열 파라미터가 있는 도구는 이전에 제거된 후행 줄바꿈이 있는 값을 받을 수 있습니다.
</Note>

**예제:**

```json
// Before: Final newline accidentally stripped
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit"
  }
}

// After: Trailing newline preserved as intended
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit\n"
  }
}
```

### 토큰 수 최적화

Claude 4.5 모델은 모델 성능을 개선하기 위한 자동 최적화를 포함합니다. 이러한 최적화는 요청에 소량의 토큰을 추가할 수 있지만, **이러한 시스템 추가 토큰에 대해서는 청구되지 않습니다**.

## Claude 4에서 도입된 기능

다음 기능은 Claude 4에서 도입되었으며 Claude Sonnet 4.5 및 Claude Haiku 4.5를 포함한 Claude 4 모델 전반에 걸쳐 사용 가능합니다.

### 새로운 거부 중지 이유

Claude 4 모델은 모델이 안전상의 이유로 생성을 거부하는 콘텐츠에 대한 새로운 `refusal` 중지 이유를 도입합니다:

```json
{
  "id": "msg_014XEDjypDjFzgKVWdFUXxZP",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-5",
  "content": [{"type": "text", "text": "I would be happy to assist you. You can "}],
  "stop_reason": "refusal",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 564,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 22
  }
}
```

Claude 4 모델을 사용할 때는 [거부 중지 이유를 처리](/docs/ko/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals)하도록 애플리케이션을 업데이트해야 합니다.

### 요약된 사고

확장 사고가 활성화되면, Claude 4 모델의 Messages API는 Claude의 전체 사고 프로세스의 요약을 반환합니다. 요약된 사고는 확장 사고의 전체 지능 이점을 제공하면서 오용을 방지합니다.

API는 Claude 3.7 및 4 모델 전반에 걸쳐 일관되지만, 확장 사고에 대한 스트리밍 응답은 "청크" 전달 패턴으로 반환될 수 있으며, 스트리밍 이벤트 사이에 가능한 지연이 있을 수 있습니다.

<Note>
요약은 요청에서 대상으로 지정한 모델과 다른 모델에 의해 처리됩니다. 사고 모델은 요약된 출력을 보지 않습니다.
</Note>

자세한 내용은 [확장 사고 문서](/docs/ko/build-with-claude/extended-thinking#summarized-thinking)를 참조하세요.

### 인터리브된 사고

Claude 4 모델은 확장 사고와 도구 사용을 인터리브하는 것을 지원하여 도구 사용 및 응답을 일반 메시지와 혼합할 수 있는 더 자연스러운 대화를 가능하게 합니다.

<Note>
인터리브된 사고는 베타 상태입니다. 인터리브된 사고를 활성화하려면 API 요청에 [베타 헤더](/docs/ko/api/beta-headers) `interleaved-thinking-2025-05-14`를 추가하세요.
</Note>

자세한 내용은 [확장 사고 문서](/docs/ko/build-with-claude/extended-thinking#interleaved-thinking)를 참조하세요.

### 행동 차이

Claude 4 모델은 프롬프트 구조 방식에 영향을 미칠 수 있는 주목할 만한 행동 변화를 가지고 있습니다:

#### 통신 스타일 변화

- **더 간결하고 직접적**: Claude 4 모델은 더 효율적으로 통신하며, 덜 자세한 설명을 제공합니다
- **더 자연스러운 톤**: 응답은 약간 더 대화체이고 덜 기계적입니다
- **효율성 중심**: 워크플로우 모멘텀을 유지하기 위해 작업 완료 후 상세한 요약을 건너뛸 수 있습니다(필요하면 더 많은 세부 사항을 요청할 수 있습니다)

#### 지시 준수

Claude 4 모델은 정확한 지시 준수를 위해 훈련되었으며 더 명시적인 방향이 필요합니다:

- **작업에 대해 명시적**: Claude가 조치를 취하기를 원하면 "이러한 변경을 수행하세요" 또는 "이 기능을 구현하세요"와 같은 직접적인 언어를 사용하세요. "변경을 제안할 수 있습니까?"보다는
- **원하는 행동을 명확하게 명시**: Claude는 지시를 정확하게 따르므로, 원하는 것에 대해 구체적이면 더 나은 결과를 얻을 수 있습니다

이러한 모델로 작업하기 위한 포괄적인 지침은 [Claude 4 프롬프트 엔지니어링 모범 사례](/docs/ko/build-with-claude/prompt-engineering/claude-4-best-practices)를 참조하세요.

### 업데이트된 텍스트 편집기 도구

텍스트 편집기 도구는 Claude 4 모델에 대해 다음과 같은 변경 사항으로 업데이트되었습니다:

- **도구 유형**: `text_editor_20250728`
- **도구 이름**: `str_replace_based_edit_tool`
- `undo_edit` 명령은 더 이상 지원되지 않습니다

<Note>
`str_replace_editor` 텍스트 편집기 도구는 Claude Sonnet 3.7의 경우 동일하게 유지됩니다.
</Note>

Claude Sonnet 3.7에서 마이그레이션하고 텍스트 편집기 도구를 사용하는 경우:

```python
# Claude Sonnet 3.7
tools=[
    {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
    }
]

# Claude 4 models
tools=[
    {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
    }
]
```

자세한 내용은 [텍스트 편집기 도구 문서](/docs/ko/agents-and-tools/tool-use/text-editor-tool)를 참조하세요.

### 업데이트된 코드 실행 도구

코드 실행 도구를 사용하는 경우, Bash 명령 및 파일 조작 기능을 추가하는 최신 버전 `code_execution_20250825`를 사용하고 있는지 확인하세요.

레거시 버전 `code_execution_20250522`(Python만)는 여전히 사용 가능하지만 새로운 구현에는 권장되지 않습니다.

마이그레이션 지침은 [코드 실행 도구 문서](/docs/ko/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version)를 참조하세요.

## 가격 및 가용성

### 가격

Claude 4.5 모델은 경쟁력 있는 가격을 유지합니다:

| 모델 | 입력 | 출력 |
|-------|-------|--------|
| Claude Opus 4.5 | 백만 토큰당 $5 | 백만 토큰당 $25 |
| Claude Sonnet 4.5 | 백만 토큰당 $3 | 백만 토큰당 $15 |
| Claude Haiku 4.5 | 백만 토큰당 $1 | 백만 토큰당 $5 |

자세한 내용은 [가격 문서](/docs/ko/about-claude/pricing)를 참조하세요.

### 제3자 플랫폼 가격

Claude 4.5 모델(Opus 4.5, Sonnet 4.5 및 Haiku 4.5)부터 AWS Bedrock 및 Google Vertex AI는 두 가지 엔드포인트 유형을 제공합니다:

- **글로벌 엔드포인트**: 최대 가용성을 위한 동적 라우팅
- **지역 엔드포인트**: 특정 지리적 영역을 통한 보장된 데이터 라우팅(10% 가격 프리미엄 포함)

**이 지역 가격은 모든 Claude 4.5 모델에 적용됩니다: Opus 4.5, Sonnet 4.5 및 Haiku 4.5.**

**Claude API(1P)는 기본적으로 글로벌이며 이 변경의 영향을 받지 않습니다.** Claude API는 글로벌 전용입니다(다른 제공자의 글로벌 엔드포인트 제공 및 가격과 동등).

구현 세부 사항 및 마이그레이션 지침:
- [AWS Bedrock 글로벌 대 지역 엔드포인트](/docs/ko/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Google Vertex AI 글로벌 대 지역 엔드포인트](/docs/ko/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)

### 가용성

Claude 4.5 모델은 다음에서 사용 가능합니다:

| 모델 | Claude API | Amazon Bedrock | Google Cloud Vertex AI |
|-------|-----------|----------------|------------------------|
| Claude Opus 4.5 | `claude-opus-4-5-20251101` | `anthropic.claude-opus-4-5-20251101-v1:0` | `claude-opus-4-5@20251101` |
| Claude Sonnet 4.5 | `claude-sonnet-4-5-20250929` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `claude-sonnet-4-5@20250929` |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | `anthropic.claude-haiku-4-5-20251001-v1:0` | `claude-haiku-4-5@20251001` |

Claude.ai 및 Claude Code 플랫폼을 통해서도 사용 가능합니다.

## 마이그레이션 가이드

주요 변경 사항 및 마이그레이션 요구 사항은 업그레이드하는 모델에 따라 다릅니다. 단계별 가이드, 주요 변경 사항 및 마이그레이션 체크리스트를 포함한 자세한 마이그레이션 지침은 [Claude 4.5로 마이그레이션](/docs/ko/about-claude/models/migrating-to-claude-4)을 참조하세요.

마이그레이션 가이드는 다음 시나리오를 다룹니다:
- **Claude Sonnet 3.7 → Sonnet 4.5**: 주요 변경 사항이 있는 완전한 마이그레이션 경로
- **Claude Haiku 3.5 → Haiku 4.5**: 주요 변경 사항이 있는 완전한 마이그레이션 경로
- **Claude Sonnet 4 → Sonnet 4.5**: 최소한의 변경으로 빠른 업그레이드
- **Claude Opus 4.1 → Sonnet 4.5**: 주요 변경 사항이 없는 원활한 업그레이드
- **Claude Opus 4.1 → Opus 4.5**: 주요 변경 사항이 없는 원활한 업그레이드
- **Claude Opus 4.5 → Sonnet 4.5**: 주요 변경 사항이 없는 원활한 다운그레이드

## 다음 단계

<CardGroup cols={3}>
  <Card title="모범 사례" icon="lightbulb" href="/docs/ko/build-with-claude/prompt-engineering/claude-4-best-practices">
    Claude 4.5 모델을 위한 프롬프트 엔지니어링 기법 학습
  </Card>
  <Card title="모델 개요" icon="table" href="/docs/ko/about-claude/models/overview">
    Claude 4.5 모델을 다른 Claude 모델과 비교
  </Card>
  <Card title="마이그레이션 가이드" icon="arrow-right-arrow-left" href="/docs/ko/about-claude/models/migrating-to-claude-4">
    이전 모델에서 업그레이드
  </Card>
</CardGroup>