# 사용량 및 비용 API

Usage & Cost Admin API를 통해 조직의 API 사용량 및 비용 데이터에 프로그래밍 방식으로 접근합니다.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

Usage & Cost Admin API는 조직의 과거 API 사용량 및 비용 데이터에 대한 프로그래밍 방식의 세분화된 접근을 제공합니다. 이 데이터는 Claude Console의 [사용량](/usage) 및 [비용](/cost) 페이지에서 사용할 수 있는 정보와 유사합니다.

이 API를 통해 Claude 구현을 더 잘 모니터링, 분석 및 최적화할 수 있습니다:

* **정확한 사용량 추적:** 응답 토큰 계산에만 의존하지 않고 정확한 토큰 수 및 사용 패턴 확보
* **비용 조정:** 내부 기록과 Anthropic 청구 정보 일치 (재무 및 회계 팀용)
* **제품 성능 및 개선:** 제품 성능을 모니터링하면서 시스템 변경이 성능을 개선했는지 측정하거나 알림 설정
* **[속도 제한](/docs/ko/api/rate-limits) 및 [우선순위 계층](/docs/ko/api/service-tiers#get-started-with-priority-tier) 최적화:** [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching) 또는 특정 프롬프트와 같은 기능을 최적화하여 할당된 용량을 최대한 활용하거나 전용 용량 구매
* **고급 분석:** Console에서 사용할 수 있는 것보다 더 깊이 있는 데이터 분석 수행

<Check>
  **Admin API 키 필수**
  
  이 API는 [Admin API](/docs/ko/build-with-claude/administration-api)의 일부입니다. 이 엔드포인트는 표준 API 키와 다른 Admin API 키(`sk-ant-admin...`로 시작)가 필요합니다. 관리자 역할을 가진 조직 구성원만 [Claude Console](/settings/admin-keys)을 통해 Admin API 키를 프로비저닝할 수 있습니다.
</Check>

## 파트너 솔루션

주요 관찰성 플랫폼은 사용자 정의 코드를 작성하지 않고도 Claude API 사용량 및 비용을 모니터링하기 위한 즉시 사용 가능한 통합을 제공합니다. 이러한 통합은 대시보드, 알림 및 분석을 제공하여 API 사용량을 효과적으로 관리할 수 있도록 도와줍니다.

<CardGroup cols={3}>
  <Card title="CloudZero" icon="chart" href="https://docs.cloudzero.com/docs/connections-anthropic">
    비용 추적 및 예측을 위한 클라우드 인텔리전스 플랫폼
  </Card>
  <Card title="Datadog" icon="chart" href="https://docs.datadoghq.com/integrations/anthropic/">
    자동 추적 및 모니터링을 포함한 LLM 관찰성
  </Card>
  <Card title="Grafana Cloud" icon="chart" href="https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-anthropic/">
    기본 제공 대시보드 및 알림을 통한 쉬운 LLM 관찰성을 위한 에이전트리스 통합
  </Card>
  <Card title="Honeycomb" icon="polygon" href="https://docs.honeycomb.io/integrations/anthropic-usage-monitoring/">
    OpenTelemetry를 통한 고급 쿼리 및 시각화
  </Card>
  <Card title="Vantage" icon="chart" href="https://docs.vantage.sh/connecting_anthropic">
    LLM 비용 및 사용량 관찰성을 위한 FinOps 플랫폼
  </Card>
</CardGroup>

## 빠른 시작

지난 7일간의 조직 일일 사용량 확보:

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-08T00:00:00Z&\
ending_at=2025-01-15T00:00:00Z&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
  **통합을 위해 User-Agent 헤더 설정**
  
  통합을 구축하는 경우 User-Agent 헤더를 설정하여 사용 패턴을 이해하는 데 도움을 주세요:
  ```
  User-Agent: YourApp/1.0.0 (https://yourapp.com)
  ```
</Tip>

## 사용량 API

`/v1/organizations/usage_report/messages` 엔드포인트를 사용하여 모델, 워크스페이스 및 서비스 계층별 상세 분석을 통해 조직 전체의 토큰 소비를 추적합니다.

### 주요 개념

- **시간 버킷**: 고정 간격(`1m`, `1h` 또는 `1d`)으로 사용량 데이터 집계
- **토큰 추적**: 캐시되지 않은 입력, 캐시된 입력, 캐시 생성 및 출력 토큰 측정
- **필터링 및 그룹화**: API 키, 워크스페이스, 모델, 서비스 계층 또는 컨텍스트 윈도우별로 필터링하고 이러한 차원별로 결과 그룹화
- **서버 도구 사용**: 웹 검색과 같은 서버 측 도구의 사용량 추적

전체 매개변수 세부 정보 및 응답 스키마는 [사용량 API 참조](/docs/ko/api/admin-api/usage-cost/get-messages-usage-report)를 참조하세요.

### 기본 예제

#### 모델별 일일 사용량

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
group_by[]=model&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### 필터링을 포함한 시간별 사용량

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-15T00:00:00Z&\
ending_at=2025-01-15T23:59:59Z&\
models[]=claude-sonnet-4-5-20250929&\
service_tiers[]=batch&\
context_window[]=0-200k&\
bucket_width=1h" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### API 키 및 워크스페이스별 사용량 필터링

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
api_key_ids[]=apikey_01Rj2N8SVvo6BePZj99NhmiT&\
api_key_ids[]=apikey_01ABC123DEF456GHI789JKL&\
workspace_ids[]=wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ&\
workspace_ids[]=wrkspc_01XYZ789ABC123DEF456MNO&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
조직의 API 키 ID를 검색하려면 [API 키 나열](/docs/ko/api/admin-api/apikeys/list-api-keys) 엔드포인트를 사용하세요.

조직의 워크스페이스 ID를 검색하려면 [워크스페이스 나열](/docs/ko/api/admin-api/workspaces/list-workspaces) 엔드포인트를 사용하거나 Anthropic Console에서 조직의 워크스페이스 ID를 찾으세요.
</Tip>

### 시간 세분성 제한

| 세분성 | 기본 제한 | 최대 제한 | 사용 사례 |
|-------------|---------------|---------------|----------|
| `1m` | 60개 버킷 | 1440개 버킷 | 실시간 모니터링 |
| `1h` | 24개 버킷 | 168개 버킷 | 일일 패턴 |
| `1d` | 7개 버킷 | 31개 버킷 | 주간/월간 보고서 |

## 비용 API

`/v1/organizations/cost_report` 엔드포인트를 사용하여 USD의 서비스 수준 비용 분석을 검색합니다.

### 주요 개념

- **통화**: 모든 비용은 USD로 표시되며 최소 단위(센트)의 십진수 문자열로 보고됨
- **비용 유형**: 토큰 사용, 웹 검색 및 코드 실행 비용 추적
- **그룹화**: 워크스페이스 또는 설명별로 비용을 그룹화하여 상세 분석
- **시간 버킷**: 일일 세분성만(`1d`)

전체 매개변수 세부 정보 및 응답 스키마는 [비용 API 참조](/docs/ko/api/admin-api/usage-cost/get-cost-report)를 참조하세요.

<Warning>
  우선순위 계층 비용은 다른 청구 모델을 사용하며 비용 엔드포인트에 포함되지 않습니다. 사용량 엔드포인트를 통해 우선순위 계층 사용량을 추적하세요.
</Warning>

### 기본 예제

```bash
curl "https://api.anthropic.com/v1/organizations/cost_report?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
group_by[]=workspace_id&\
group_by[]=description" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## 페이지 매김

두 엔드포인트 모두 대규모 데이터 세트에 대한 페이지 매김을 지원합니다:

1. 초기 요청 수행
2. `has_more`가 `true`인 경우 다음 요청에서 `next_page` 값 사용
3. `has_more`가 `false`가 될 때까지 계속

```bash
# 첫 번째 요청
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# 응답 포함: "has_more": true, "next_page": "page_xyz..."

# 페이지 매김을 사용한 다음 요청
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7&\
page=page_xyz..." \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## 일반적인 사용 사례

[anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook)에서 상세한 구현을 살펴보세요:

- **일일 사용량 보고서**: 토큰 소비 추세 추적
- **비용 귀속**: 차지백을 위해 워크스페이스별 비용 할당
- **캐시 효율성**: 프롬프트 캐싱 측정 및 최적화
- **예산 모니터링**: 지출 임계값에 대한 알림 설정
- **CSV 내보내기**: 재무 팀을 위한 보고서 생성

## 자주 묻는 질문

### 데이터는 얼마나 최신인가요?
사용량 및 비용 데이터는 일반적으로 API 요청 완료 후 5분 이내에 나타나지만 지연이 더 길 수도 있습니다.

### 권장되는 폴링 빈도는 무엇인가요?
API는 지속적인 사용을 위해 분당 한 번 폴링을 지원합니다. 짧은 버스트(예: 페이지가 매겨진 데이터 다운로드)의 경우 더 자주 폴링하는 것이 허용됩니다. 자주 업데이트가 필요한 대시보드의 결과를 캐시하세요.

### 코드 실행 사용량을 추적하려면 어떻게 하나요?
코드 실행 비용은 설명 필드의 `Code Execution Usage` 아래에 그룹화된 비용 엔드포인트에 나타납니다. 코드 실행은 사용량 엔드포인트에 포함되지 않습니다.

### 우선순위 계층 사용량을 추적하려면 어떻게 하나요?
사용량 엔드포인트에서 `service_tier`로 필터링하거나 그룹화하고 `priority` 값을 찾으세요. 우선순위 계층 비용은 비용 엔드포인트에서 사용할 수 없습니다.

### Workbench 사용량은 어떻게 되나요?
Workbench의 API 사용량은 API 키와 연결되지 않으므로 해당 차원별로 그룹화할 때도 `api_key_id`는 `null`입니다.

### 기본 워크스페이스는 어떻게 표현되나요?
기본 워크스페이스에 귀속된 사용량 및 비용은 `workspace_id`에 대해 `null` 값을 가집니다.

### Claude Code의 사용자별 비용 분석을 어떻게 얻나요?

[Claude Code Analytics API](/docs/ko/build-with-claude/claude-code-analytics-api)를 사용하세요. 이는 많은 API 키로 비용을 분석할 때의 성능 제한 없이 사용자별 예상 비용 및 생산성 메트릭을 제공합니다. 많은 키가 있는 일반 API 사용의 경우 [사용량 API](#usage-api)를 사용하여 토큰 소비를 비용 대리로 추적하세요.

## 참고 항목
사용량 및 비용 API는 사용자에게 더 나은 경험을 제공하고, 비용을 관리하며, 속도 제한을 보존하는 데 도움이 될 수 있습니다. 이러한 다른 기능에 대해 자세히 알아보세요:

- [Admin API 개요](/docs/ko/build-with-claude/administration-api)
- [Admin API 참조](/docs/ko/api/admin)
- [가격 책정](/docs/ko/about-claude/pricing)
- [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching) - 캐싱으로 비용 최적화
- [배치 처리](/docs/ko/build-with-claude/batch-processing) - 배치 요청에 50% 할인
- [속도 제한](/docs/ko/api/rate-limits) - 사용 계층 이해