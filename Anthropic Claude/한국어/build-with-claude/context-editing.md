# 컨텍스트 편집

대화 컨텍스트가 증가함에 따라 컨텍스트 편집으로 자동으로 관리합니다.

---

## 개요

컨텍스트 편집을 사용하면 대화 컨텍스트가 증가함에 따라 자동으로 관리하여 비용을 최적화하고 컨텍스트 윈도우 제한 내에 머물 수 있습니다. 서버 측 API 전략, 클라이언트 측 SDK 기능 또는 둘 다를 함께 사용할 수 있습니다.

| 접근 방식 | 실행 위치 | 전략 | 작동 방식 |
|----------|---------------|------------|--------------|
| **서버 측** | API | 도구 결과 지우기 (`clear_tool_uses_20250919`)<br/>생각 블록 지우기 (`clear_thinking_20251015`) | 프롬프트가 Claude에 도달하기 전에 적용됩니다. 대화 기록에서 특정 콘텐츠를 지웁니다. 각 전략은 독립적으로 구성할 수 있습니다. |
| **클라이언트 측** | SDK | 압축 | [`tool_runner`](/docs/ko/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)를 사용할 때 [Python 및 TypeScript SDK](/docs/ko/api/client-sdks)에서 사용 가능합니다. 요약을 생성하고 전체 대화 기록을 바꿉니다. 아래의 [압축](#client-side-compaction-sdk)을 참조하세요. |

## 개요

컨텍스트 편집을 사용하면 대화 컨텍스트가 증가함에 따라 자동으로 관리하여 비용을 최적화하고 컨텍스트 윈도우 제한 내에 머물 수 있습니다. 서버 측 API 전략, 클라이언트 측 SDK 기능 또는 둘 다를 함께 사용할 수 있습니다.

| 접근 방식 | 실행 위치 | 전략 | 작동 방식 |
|----------|---------------|------------|--------------|
| **서버 측** | API | 도구 결과 지우기 (`clear_tool_uses_20250919`)<br/>생각 블록 지우기 (`clear_thinking_20251015`) | 프롬프트가 Claude에 도달하기 전에 적용됩니다. 대화 기록에서 특정 콘텐츠를 지웁니다. 각 전략은 독립적으로 구성할 수 있습니다. |
| **클라이언트 측** | SDK | 압축 | [`tool_runner`](/docs/ko/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)를 사용할 때 [Python 및 TypeScript SDK](/docs/ko/api/client-sdks)에서 사용 가능합니다. 요약을 생성하고 전체 대화 기록을 바꿉니다. 아래의 [압축](#client-side-compaction-sdk)을 참조하세요. |

## 서버 측 전략

<Note>
컨텍스트 편집은 현재 도구 결과 지우기 및 생각 블록 지우기 지원으로 베타 상태입니다. 이를 활성화하려면 API 요청에서 베타 헤더 `context-management-2025-06-27`을 사용하세요.

이 기능에 대한 피드백을 공유하려면 [피드백 양식](https://forms.gle/YXC2EKGMhjN1c4L88)을 통해 연락해 주세요.
</Note>

## 개요

컨텍스트 편집을 사용하면 대화 컨텍스트가 증가함에 따라 자동으로 관리하여 비용을 최적화하고 컨텍스트 윈도우 제한 내에 머물 수 있습니다. 서버 측 API 전략, 클라이언트 측 SDK 기능 또는 둘 다를 함께 사용할 수 있습니다.

| 접근 방식 | 실행 위치 | 전략 | 작동 방식 |
|----------|---------------|------------|--------------|
| **서버 측** | API | 도구 결과 지우기 (`clear_tool_uses_20250919`)<br/>생각 블록 지우기 (`clear_thinking_20251015`) | 프롬프트가 Claude에 도달하기 전에 적용됩니다. 대화 기록에서 특정 콘텐츠를 지웁니다. 각 전략은 독립적으로 구성할 수 있습니다. |
| **클라이언트 측** | SDK | 압축 | [`tool_runner`](/docs/ko/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)를 사용할 때 [Python 및 TypeScript SDK](/docs/ko/api/client-sdks)에서 사용 가능합니다. 요약을 생성하고 전체 대화 기록을 바꿉니다. 아래의 [압축](#client-side-compaction-sdk)을 참조하세요. |

## 서버 측 전략

<Note>
컨텍스트 편집은 현재 도구 결과 지우기 및 생각 블록 지우기 지원으로 베타 상태입니다. 이를 활성화하려면 API 요청에서 베타 헤더 `context-management-2025-06-27`을 사용하세요.

이 기능에 대한 피드백을 공유하려면 [피드백 양식](https://forms.gle/YXC2EKGMhjN1c4L88)을 통해 연락해 주세요.
</Note>

### 도구 결과 지우기

`clear_tool_uses_20250919` 전략은 대화 컨텍스트가 구성된 임계값을 초과할 때 도구 결과를 지웁니다. 활성화되면 API는 시간 순서대로 가장 오래된 도구 결과를 자동으로 지우고 도구 결과가 제거되었음을 Claude에 알리기 위해 자리 표시자 텍스트로 바꿉니다. 기본적으로 도구 결과만 지워집니다. `clear_tool_inputs`를 true로 설정하여 도구 결과와 도구 호출(도구 사용 매개변수)을 모두 선택적으로 지울 수 있습니다.

## 개요

컨텍스트 편집을 사용하면 대화 컨텍스트가 증가함에 따라 자동으로 관리하여 비용을 최적화하고 컨텍스트 윈도우 제한 내에 머물 수 있습니다. 서버 측 API 전략, 클라이언트 측 SDK 기능 또는 둘 다를 함께 사용할 수 있습니다.

| 접근 방식 | 실행 위치 | 전략 | 작동 방식 |
|----------|---------------|------------|--------------|
| **서버 측** | API | 도구 결과 지우기 (`clear_tool_uses_20250919`)<br/>생각 블록 지우기 (`clear_thinking_20251015`) | 프롬프트가 Claude에 도달하기 전에 적용됩니다. 대화 기록에서 특정 콘텐츠를 지웁니다. 각 전략은 독립적으로 구성할 수 있습니다. |
| **클라이언트 측** | SDK | 압축 | [`tool_runner`](/docs/ko/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)를 사용할 때 [Python 및 TypeScript SDK](/docs/ko/api/client-sdks)에서 사용 가능합니다. 요약을 생성하고 전체 대화 기록을 바꿉니다. 아래의 [압축](#client-side-compaction-sdk)을 참조하세요. |

## 서버 측 전략

<Note>
컨텍스트 편집은 현재 도구 결과 지우기 및 생각 블록 지우기 지원으로 베타 상태입니다. 이를 활성화하려면 API 요청에서 베타 헤더 `context-management-2025-06-27`을 사용하세요.

이 기능에 대한 피드백을 공유하려면 [피드백 양식](https://forms.gle/YXC2EKGMhjN1c4L88)을 통해 연락해 주세요.
</Note>

### 도구 결과 지우기

`clear_tool_uses_20250919` 전략은 대화 컨텍스트가 구성된 임계값을 초과할 때 도구 결과를 지웁니다. 활성화되면 API는 시간 순서대로 가장 오래된 도구 결과를 자동으로 지우고 도구 결과가 제거되었음을 Claude에 알리기 위해 자리 표시자 텍스트로 바꿉니다. 기본적으로 도구 결과만 지워집니다. `clear_tool_inputs`를 true로 설정하여 도구 결과와 도구 호출(도구 사용 매개변수)을 모두 선택적으로 지울 수 있습니다.

### 생각 블록 지우기

`clear_thinking_20251015` 전략은 확장된 생각이 활성화된 경우 대화에서 `thinking` 블록을 관리합니다. 이 전략은 이전 턴의 오래된 생각 블록을 자동으로 지웁니다.

<Tip>
**기본 동작**: 확장된 생각이 `clear_thinking_20251015` 전략을 구성하지 않고 활성화되면 API는 자동으로 마지막 어시스턴트 턴의 생각 블록만 유지합니다(`keep: {type: "thinking_turns", value: 1}`과 동등).

캐시 히트를 최대화하려면 `keep: "all"`을 설정하여 모든 생각 블록을 보존하세요.
</Tip>

<Note>
어시스턴트 대화 턴은 여러 콘텐츠 블록(예: 도구 사용 시)과 여러 생각 블록(예: [인터리브된 생각](/docs/ko/build-with-claude/extended-thinking#interleaved-thinking)과 함께)을 포함할 수 있습니다.
</Note>

<Tip>
**컨텍스트 편집은 서버 측에서 발생합니다**

컨텍스트 편집은 프롬프트가 Claude에 도달하기 전에 **서버 측**에서 적용됩니다. 클라이언트 애플리케이션은 전체, 수정되지 않은 대화 기록을 유지합니다. 편집된 버전과 클라이언트 상태를 동기화할 필요가 없습니다. 평소처럼 로컬에서 전체 대화 기록을 계속 관리하세요.
</Tip>

<Tip>
**컨텍스트 편집 및 프롬프트 캐싱**

컨텍스트 편집과 [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching)의 상호작용은 전략에 따라 다릅니다:

- **도구 결과 지우기**: 콘텐츠가 지워질 때 캐시된 프롬프트 접두사를 무효화합니다. 이를 고려하여 캐시 무효화를 가치 있게 만들 만큼 충분한 토큰을 지우는 것을 권장합니다. `clear_at_least` 매개변수를 사용하여 매번 최소한 지워지는 토큰 수를 보장하세요. 콘텐츠가 지워질 때마다 캐시 쓰기 비용이 발생하지만 후속 요청은 새로 캐시된 접두사를 재사용할 수 있습니다.

- **생각 블록 지우기**: 생각 블록이 컨텍스트에 **유지**되면(지워지지 않음) 프롬프트 캐시가 보존되어 캐시 히트를 활성화하고 입력 토큰 비용을 줄입니다. 생각 블록이 **지워지면** 캐시는 지우기가 발생하는 지점에서 무효화됩니다. 캐시 성능 또는 컨텍스트 윈도우 가용성을 우선시할지 여부에 따라 `keep` 매개변수를 구성하세요.
</Tip>

## 개요

컨텍스트 편집을 사용하면 대화 컨텍스트가 증가함에 따라 자동으로 관리하여 비용을 최적화하고 컨텍스트 윈도우 제한 내에 머물 수 있습니다. 서버 측 API 전략, 클라이언트 측 SDK 기능 또는 둘 다를 함께 사용할 수 있습니다.

| 접근 방식 | 실행 위치 | 전략 | 작동 방식 |
|----------|---------------|------------|--------------|
| **서버 측** | API | 도구 결과 지우기 (`clear_tool_uses_20250919`)<br/>생각 블록 지우기 (`clear_thinking_20251015`) | 프롬프트가 Claude에 도달하기 전에 적용됩니다. 대화 기록에서 특정 콘텐츠를 지웁니다. 각 전략은 독립적으로 구성할 수 있습니다. |
| **클라이언트 측** | SDK | 압축 | [`tool_runner`](/docs/ko/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)를 사용할 때 [Python 및 TypeScript SDK](/docs/ko/api/client-sdks)에서 사용 가능합니다. 요약을 생성하고 전체 대화 기록을 바꿉니다. 아래의 [압축](#client-side-compaction-sdk)을 참조하세요. |

## 서버 측 전략

<Note>
컨텍스트 편집은 현재 도구 결과 지우기 및 생각 블록 지우기 지원으로 베타 상태입니다. 이를 활성화하려면 API 요청에서 베타 헤더 `context-management-2025-06-27`을 사용하세요.

이 기능에 대한 피드백을 공유하려면 [피드백 양식](https://forms.gle/YXC2EKGMhjN1c4L88)을 통해 연락해 주세요.
</Note>

### 도구 결과 지우기

`clear_tool_uses_20250919` 전략은 대화 컨텍스트가 구성된 임계값을 초과할 때 도구 결과를 지웁니다. 활성화되면 API는 시간 순서대로 가장 오래된 도구 결과를 자동으로 지우고 도구 결과가 제거되었음을 Claude에 알리기 위해 자리 표시자 텍스트로 바꿉니다. 기본적으로 도구 결과만 지워집니다. `clear_tool_inputs`를 true로 설정하여 도구 결과와 도구 호출(도구 사용 매개변수)을 모두 선택적으로 지울 수 있습니다.

### 생각 블록 지우기

`clear_thinking_20251015` 전략은 확장된 생각이 활성화된 경우 대화에서 `thinking` 블록을 관리합니다. 이 전략은 이전 턴의 오래된 생각 블록을 자동으로 지웁니다.

<Tip>
**기본 동작**: 확장된 생각이 `clear_thinking_20251015` 전략을 구성하지 않고 활성화되면 API는 자동으로 마지막 어시스턴트 턴의 생각 블록만 유지합니다(`keep: {type: "thinking_turns", value: 1}`과 동등).

캐시 히트를 최대화하려면 `keep: "all"`을 설정하여 모든 생각 블록을 보존하세요.
</Tip>

<Note>
어시스턴트 대화 턴은 여러 콘텐츠 블록(예: 도구 사용 시)과 여러 생각 블록(예: [인터리브된 생각](/docs/ko/build-with-claude/extended-thinking#interleaved-thinking)과 함께)을 포함할 수 있습니다.
</Note>

<Tip>
**컨텍스트 편집은 서버 측에서 발생합니다**

컨텍스트 편집은 프롬프트가 Claude에 도달하기 전에 **서버 측**에서 적용됩니다. 클라이언트 애플리케이션은 전체, 수정되지 않은 대화 기록을 유지합니다. 편집된 버전과 클라이언트 상태를 동기화할 필요가 없습니다. 평소처럼 로컬에서 전체 대화 기록을 계속 관리하세요.
</Tip>

<Tip>
**컨텍스트 편집 및 프롬프트 캐싱**

컨텍스트 편집과 [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching)의 상호작용은 전략에 따라 다릅니다:

- **도구 결과 지우기**: 콘텐츠가 지워질 때 캐시된 프롬프트 접두사를 무효화합니다. 이를 고려하여 캐시 무효화를 가치 있게 만들 만큼 충분한 토큰을 지우는 것을 권장합니다. `clear_at_least` 매개변수를 사용하여 매번 최소한 지워지는 토큰 수를 보장하세요. 콘텐츠가 지워질 때마다 캐시 쓰기 비용이 발생하지만 후속 요청은 새로 캐시된 접두사를 재사용할 수 있습니다.

- **생각 블록 지우기**: 생각 블록이 컨텍스트에 **유지**되면(지워지지 않음) 프롬프트 캐시가 보존되어 캐시 히트를 활성화하고 입력 토큰 비용을 줄입니다. 생각 블록이 **지워지면** 캐시는 지우기가 발생하는 지점에서 무효화됩니다. 캐시 성능 또는 컨텍스트 윈도우 가용성을 우선시할지 여부에 따라 `keep` 매개변수를 구성하세요.
</Tip>

## 지원되는 모델

컨텍스트 편집은 다음에서 사용 가능합니다:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## 개요

컨텍스트 편집을 사용하면 대화 컨텍스트가 증가함에 따라 자동으로 관리하여 비용을 최적화하고 컨텍스트 윈도우 제한 내에 머물 수 있습니다. 서버 측 API 전략, 클라이언트 측 SDK 기능 또는 둘 다를 함께 사용할 수 있습니다.

| 접근 방식 | 실행 위치 | 전략 | 작동 방식 |
|----------|---------------|------------|--------------|
| **서버 측** | API | 도구 결과 지우기 (`clear_tool_uses_20250919`)<br/>생각 블록 지우기 (`clear_thinking_20251015`) | 프롬프트가 Claude에 도달하기 전에 적용됩니다. 대화 기록에서 특정 콘텐츠를 지웁니다. 각 전략은 독립적으로 구성할 수 있습니다. |
| **클라이언트 측** | SDK | 압축 | [`tool_runner`](/docs/ko/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)를 사용할 때 [Python 및 TypeScript SDK](/docs/ko/api/client-sdks)에서 사용 가능합니다. 요약을 생성하고 전체 대화 기록을 바꿉니다. 아래의 [압축](#client-side-compaction-sdk)을 참조하세요. |

## 서버 측 전략

<Note>
컨텍스트 편집은 현재 도구 결과 지우기 및 생각 블록 지우기 지원으로 베타 상태입니다. 이를 활성화하려면 API 요청에서 베타 헤더 `context-management-2025-06-27`을 사용하세요.

이 기능에 대한 피드백을 공유하려면 [피드백 양식](https://forms.gle/YXC2EKGMhjN1c4L88)을 통해 연락해 주세요.
</Note>

### 도구 결과 지우기

`clear_tool_uses_20250919` 전략은 대화 컨텍스트가 구성된 임계값을 초과할 때 도구 결과를 지웁니다. 활성화되면 API는 시간 순서대로 가장 오래된 도구 결과를 자동으로 지우고 도구 결과가 제거되었음을 Claude에 알리기 위해 자리 표시자 텍스트로 바꿉니다. 기본적으로 도구 결과만 지워집니다. `clear_tool_inputs`를 true로 설정하여 도구 결과와 도구 호출(도구 사용 매개변수)을 모두 선택적으로 지울 수 있습니다.

### 생각 블록 지우기

`clear_thinking_20251015` 전략은 확장된 생각이 활성화된 경우 대화에서 `thinking` 블록을 관리합니다. 이 전략은 이전 턴의 오래된 생각 블록을 자동으로 지웁니다.

<Tip>
**기본 동작**: 확장된 생각이 `clear_thinking_20251015` 전략을 구성하지 않고 활성화되면 API는 자동으로 마지막 어시스턴트 턴의 생각 블록만 유지합니다(`keep: {type: "thinking_turns", value: 1}`과 동등).

캐시 히트를 최대화하려면 `keep: "all"`을 설정하여 모든 생각 블록을 보존하세요.
</Tip>

<Note>
어시스턴트 대화 턴은 여러 콘텐츠 블록(예: 도구 사용 시)과 여러 생각 블록(예: [인터리브된 생각](/docs/ko/build-with-claude/extended-thinking#interleaved-thinking)과 함께)을 포함할 수 있습니다.
</Note>

<Tip>
**컨텍스트 편집은 서버 측에서 발생합니다**

컨텍스트 편집은 프롬프트가 Claude에 도달하기 전에 **서버 측**에서 적용됩니다. 클라이언트 애플리케이션은 전체, 수정되지 않은 대화 기록을 유지합니다. 편집된 버전과 클라이언트 상태를 동기화할 필요가 없습니다. 평소처럼 로컬에서 전체 대화 기록을 계속 관리하세요.
</Tip>

<Tip>
**컨텍스트 편집 및 프롬프트 캐싱**

컨텍스트 편집과 [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching)의 상호작용은 전략에 따라 다릅니다:

- **도구 결과 지우기**: 콘텐츠가 지워질 때 캐시된 프롬프트 접두사를 무효화합니다. 이를 고려하여 캐시 무효화를 가치 있게 만들 만큼 충분한 토큰을 지우는 것을 권장합니다. `clear_at_least` 매개변수를 사용하여 매번 최소한 지워지는 토큰 수를 보장하세요. 콘텐츠가 지워질 때마다 캐시 쓰기 비용이 발생하지만 후속 요청은 새로 캐시된 접두사를 재사용할 수 있습니다.

- **생각 블록 지우기**: 생각 블록이 컨텍스트에 **유지**되면(지워지지 않음) 프롬프트 캐시가 보존되어 캐시 히트를 활성화하고 입력 토큰 비용을 줄입니다. 생각 블록이 **지워지면** 캐시는 지우기가 발생하는 지점에서 무효화됩니다. 캐시 성능 또는 컨텍스트 윈도우 가용성을 우선시할지 여부에 따라 `keep` 매개변수를 구성하세요.
</Tip>

## 지원되는 모델

컨텍스트 편집은 다음에서 사용 가능합니다:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## 도구 결과 지우기 사용

도구 결과 지우기를 활성화하는 가장 간단한 방법은 전략 유형만 지정하는 것입니다. 다른 모든 [구성 옵션](#configuration-options-for-tool-result-clearing)은 기본값을 사용합니다:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

## 개요

컨텍스트 편집을 사용하면 대화 컨텍스트가 증가함에 따라 자동으로 관리하여 비용을 최적화하고 컨텍스트 윈도우 제한 내에 머물 수 있습니다. 서버 측 API 전략, 클라이언트 측 SDK 기능 또는 둘 다를 함께 사용할 수 있습니다.

| 접근 방식 | 실행 위치 | 전략 | 작동 방식 |
|----------|---------------|------------|--------------|
| **서버 측** | API | 도구 결과 지우기 (`clear_tool_uses_20250919`)<br/>생각 블록 지우기 (`clear_thinking_20251015`) | 프롬프트가 Claude에 도달하기 전에 적용됩니다. 대화 기록에서 특정 콘텐츠를 지웁니다. 각 전략은 독립적으로 구성할 수 있습니다. |
| **클라이언트 측** | SDK | 압축 | [`tool_runner`](/docs/ko/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)를 사용할 때 [Python 및 TypeScript SDK](/docs/ko/api/client-sdks)에서 사용 가능합니다. 요약을 생성하고 전체 대화 기록을 바꿉니다. 아래의 [압축](#client-side-compaction-sdk)을 참조하세요. |

## 서버 측 전략

<Note>
컨텍스트 편집은 현재 도구 결과 지우기 및 생각 블록 지우기 지원으로 베타 상태입니다. 이를 활성화하려면 API 요청에서 베타 헤더 `context-management-2025-06-27`을 사용하세요.

이 기능에 대한 피드백을 공유하려면 [피드백 양식](https://forms.gle/YXC2EKGMhjN1c4L88)을 통해 연락해 주세요.
</Note>

### 도구 결과 지우기

`clear_tool_uses_20250919` 전략은 대화 컨텍스트가 구성된 임계값을 초과할 때 도구 결과를 지웁니다. 활성화되면 API는 시간 순서대로 가장 오래된 도구 결과를 자동으로 지우고 도구 결과가 제거되었음을 Claude에 알리기 위해 자리 표시자 텍스트로 바꿉니다. 기본적으로 도구 결과만 지워집니다. `clear_tool_inputs`를 true로 설정하여 도구 결과와 도구 호출(도구 사용 매개변수)을 모두 선택적으로 지울 수 있습니다.

### 생각 블록 지우기

`clear_thinking_20251015` 전략은 확장된 생각이 활성화된 경우 대화에서 `thinking` 블록을 관리합니다. 이 전략은 이전 턴의 오래된 생각 블록을 자동으로 지웁니다.

<Tip>
**기본 동작**: 확장된 생각이 `clear_thinking_20251015` 전략을 구성하지 않고 활성화되면 API는 자동으로 마지막 어시스턴트 턴의 생각 블록만 유지합니다(`keep: {type: "thinking_turns", value: 1}`과 동등).

캐시 히트를 최대화하려면 `keep: "all"`을 설정하여 모든 생각 블록을 보존하세요.
</Tip>

<Note>
어시스턴트 대화 턴은 여러 콘텐츠 블록(예: 도구 사용 시)과 여러 생각 블록(예: [인터리브된 생각](/docs/ko/build-with-claude/extended-thinking#interleaved-thinking)과 함께)을 포함할 수 있습니다.
</Note>

<Tip>
**컨텍스트 편집은 서버 측에서 발생합니다**

컨텍스트 편집은 프롬프트가 Claude에 도달하기 전에 **서버 측**에서 적용됩니다. 클라이언트 애플리케이션은 전체, 수정되지 않은 대화 기록을 유지합니다. 편집된 버전과 클라이언트 상태를 동기화할 필요가 없습니다. 평소처럼 로컬에서 전체 대화 기록을 계속 관리하세요.
</Tip>

<Tip>
**컨텍스트 편집 및 프롬프트 캐싱**

컨텍스트 편집과 [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching)의 상호작용은 전략에 따라 다릅니다:

- **도구 결과 지우기**: 콘텐츠가 지워질 때 캐시된 프롬프트 접두사를 무효화합니다. 이를 고려하여 캐시 무효화를 가치 있게 만들 만큼 충분한 토큰을 지우는 것을 권장합니다. `clear_at_least` 매개변수를 사용하여 매번 최소한 지워지는 토큰 수를 보장하세요. 콘텐츠가 지워질 때마다 캐시 쓰기 비용이 발생하지만 후속 요청은 새로 캐시된 접두사를 재사용할 수 있습니다.

- **생각 블록 지우기**: 생각 블록이 컨텍스트에 **유지**되면(지워지지 않음) 프롬프트 캐시가 보존되어 캐시 히트를 활성화하고 입력 토큰 비용을 줄입니다. 생각 블록이 **지워지면** 캐시는 지우기가 발생하는 지점에서 무효화됩니다. 캐시 성능 또는 컨텍스트 윈도우 가용성을 우선시할지 여부에 따라 `keep` 매개변수를 구성하세요.
</Tip>

## 지원되는 모델

컨텍스트 편집은 다음에서 사용 가능합니다:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## 도구 결과 지우기 사용

도구 결과 지우기를 활성화하는 가장 간단한 방법은 전략 유형만 지정하는 것입니다. 다른 모든 [구성 옵션](#configuration-options-for-tool-result-clearing)은 기본값을 사용합니다:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### 고급 구성

추가 매개변수로 도구 결과 지우기 동작을 사용자 정의할 수 있습니다:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## 개요

컨텍스트 편집을 사용하면 대화 컨텍스트가 증가함에 따라 자동으로 관리할 수 있으므로 비용을 최적화하고 컨텍스트 윈도우 제한 내에 머물 수 있습니다. 서버 측 API 전략, 클라이언트 측 SDK 기능 또는 둘 다를 함께 사용할 수 있습니다.

| 접근 방식 | 실행 위치 | 전략 | 작동 방식 |
|----------|---------------|------------|--------------|
| **서버 측** | API | 도구 결과 삭제(`clear_tool_uses_20250919`)<br/>사고 블록 삭제(`clear_thinking_20251015`) | 프롬프트가 Claude에 도달하기 전에 적용됩니다. 대화 기록에서 특정 콘텐츠를 삭제합니다. 각 전략은 독립적으로 구성할 수 있습니다. |
| **클라이언트 측** | SDK | 압축 | [`tool_runner`](/docs/ko/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)를 사용할 때 [Python 및 TypeScript SDK](/docs/ko/api/client-sdks)에서 사용 가능합니다. 요약을 생성하고 전체 대화 기록을 바꿉니다. 아래의 [압축](#client-side-compaction-sdk)을 참조하세요. |

## 서버 측 전략

<Note>
컨텍스트 편집은 현재 베타 버전이며 도구 결과 삭제 및 사고 블록 삭제를 지원합니다. 이를 활성화하려면 API 요청에서 베타 헤더 `context-management-2025-06-27`을 사용하세요.

이 기능에 대한 피드백을 공유하려면 [피드백 양식](https://forms.gle/YXC2EKGMhjN1c4L88)을 통해 연락해 주세요.
</Note>

### 도구 결과 삭제

`clear_tool_uses_20250919` 전략은 대화 컨텍스트가 구성된 임계값을 초과할 때 도구 결과를 삭제합니다. 활성화되면 API는 시간순으로 가장 오래된 도구 결과를 자동으로 삭제하고 도구 결과가 제거되었음을 Claude에 알리기 위해 자리 표시자 텍스트로 바꿉니다. 기본적으로 도구 결과만 삭제됩니다. `clear_tool_inputs`를 true로 설정하여 도구 결과와 도구 호출(도구 사용 매개변수)을 모두 선택적으로 삭제할 수 있습니다.

### 사고 블록 삭제

`clear_thinking_20251015` 전략은 확장 사고가 활성화되었을 때 대화의 `thinking` 블록을 관리합니다. 이 전략은 이전 턴의 오래된 사고 블록을 자동으로 삭제합니다.

<Tip>
**기본 동작**: 확장 사고가 `clear_thinking_20251015` 전략을 구성하지 않고 활성화되면 API는 자동으로 마지막 어시스턴트 턴의 사고 블록만 유지합니다(`keep: {type: "thinking_turns", value: 1}`과 동등).

캐시 히트를 최대화하려면 `keep: "all"`을 설정하여 모든 사고 블록을 보존하세요.
</Tip>

<Note>
어시스턴트 대화 턴에는 여러 콘텐츠 블록(예: 도구 사용 시)과 여러 사고 블록(예: [인터리브된 사고](/docs/ko/build-with-claude/extended-thinking#interleaved-thinking)가 포함될 수 있습니다.
</Note>

<Tip>
**컨텍스트 편집은 서버 측에서 발생합니다**

컨텍스트 편집은 프롬프트가 Claude에 도달하기 전에 **서버 측**에서 적용됩니다. 클라이언트 애플리케이션은 전체, 수정되지 않은 대화 기록을 유지합니다. 편집된 버전과 클라이언트 상태를 동기화할 필요가 없습니다. 평소처럼 로컬에서 전체 대화 기록을 계속 관리하세요.
</Tip>

<Tip>
**컨텍스트 편집 및 프롬프트 캐싱**

컨텍스트 편집과 [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching)의 상호작용은 전략에 따라 다릅니다:

- **도구 결과 삭제**: 콘텐츠가 삭제될 때 캐시된 프롬프트 접두사를 무효화합니다. 이를 고려하려면 캐시 무효화를 가치 있게 만들기 위해 충분한 토큰을 삭제하는 것이 좋습니다. `clear_at_least` 매개변수를 사용하여 매번 최소한 지정된 수의 토큰이 삭제되도록 하세요. 콘텐츠가 삭제될 때마다 캐시 쓰기 비용이 발생하지만 이후 요청은 새로 캐시된 접두사를 재사용할 수 있습니다.

- **사고 블록 삭제**: 사고 블록이 컨텍스트에 **유지**될 때(삭제되지 않음) 프롬프트 캐시가 보존되어 캐시 히트를 활성화하고 입력 토큰 비용을 줄입니다. 사고 블록이 **삭제**될 때 캐시는 삭제가 발생하는 지점에서 무효화됩니다. 캐시 성능 또는 컨텍스트 윈도우 가용성을 우선시할지 여부에 따라 `keep` 매개변수를 구성하세요.
</Tip>

## 지원되는 모델

컨텍스트 편집은 다음에서 사용 가능합니다:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## 도구 결과 삭제 사용

도구 결과 삭제를 활성화하는 가장 간단한 방법은 전략 유형만 지정하는 것입니다. 다른 모든 [구성 옵션](#configuration-options-for-tool-result-clearing)은 기본값을 사용합니다:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### 고급 구성

도구 결과 삭제 동작을 추가 매개변수로 사용자 정의할 수 있습니다:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## 사고 블록 삭제 사용

확장 사고가 활성화되었을 때 컨텍스트와 프롬프트 캐싱을 효과적으로 관리하려면 사고 블록 삭제를 활성화하세요:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 1024,
        "messages": [...],
        "thinking": {
            "type": "enabled",
            "budget_tokens": 10000
        },
        "context_management": {
            "edits": [
                {
                    "type": "clear_thinking_20251015",
                    "keep": {
                        "type": "thinking_turns",
                        "value": 2
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      }
    ]
  }
});
```

</CodeGroup>

### 사고 블록 삭제를 위한 구성 옵션

`clear_thinking_20251015` 전략은 다음 구성을 지원합니다:

| 구성 옵션 | 기본값 | 설명 |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | 보존할 최근 어시스턴트 턴의 개수를 정의합니다. 마지막 N개 턴을 유지하려면 `{type: "thinking_turns", value: N}`을 사용하세요(N > 0이어야 함). 모든 사고 블록을 유지하려면 `"all"`을 사용하세요. |

**예제 구성:**

```json
// 마지막 3개 어시스턴트 턴의 사고 블록 유지
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// 모든 사고 블록 유지(캐시 히트 최대화)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 사고 블록 삭제를 위한 구성 옵션

`clear_thinking_20251015` 전략은 다음 구성을 지원합니다:

| 구성 옵션 | 기본값 | 설명 |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | 보존할 최근 어시스턴트 턴의 개수를 정의합니다. 마지막 N개 턴을 유지하려면 `{type: "thinking_turns", value: N}`을 사용하세요(N > 0이어야 함). 모든 사고 블록을 유지하려면 `"all"`을 사용하세요. |

**예제 구성:**

```json
// 마지막 3개 어시스턴트 턴의 사고 블록 유지
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// 모든 사고 블록 유지(캐시 히트 최대화)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 전략 결합

사고 블록 삭제와 도구 결과 삭제를 함께 사용할 수 있습니다:

<Note>
여러 전략을 사용할 때 `clear_thinking_20251015` 전략은 `edits` 배열에서 먼저 나열되어야 합니다.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

### 사고 블록 삭제를 위한 구성 옵션

`clear_thinking_20251015` 전략은 다음 구성을 지원합니다:

| 구성 옵션 | 기본값 | 설명 |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | 보존할 최근 어시스턴트 턴의 개수를 정의합니다. 마지막 N개 턴을 유지하려면 `{type: "thinking_turns", value: N}`을 사용하세요(N > 0이어야 함). 모든 사고 블록을 유지하려면 `"all"`을 사용하세요. |

**예제 구성:**

```json
// 마지막 3개 어시스턴트 턴의 사고 블록 유지
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// 모든 사고 블록 유지(캐시 히트 최대화)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 전략 결합

사고 블록 삭제와 도구 결과 삭제를 함께 사용할 수 있습니다:

<Note>
여러 전략을 사용할 때 `clear_thinking_20251015` 전략은 `edits` 배열에서 먼저 나열되어야 합니다.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## 도구 결과 삭제를 위한 구성 옵션

| 구성 옵션 | 기본값 | 설명 |
|---------------------|---------|-------------|
| `trigger` | 100,000 입력 토큰 | 컨텍스트 편집 전략이 활성화되는 시점을 정의합니다. 프롬프트가 이 임계값을 초과하면 삭제가 시작됩니다. 이 값을 `input_tokens` 또는 `tool_uses`로 지정할 수 있습니다. |
| `keep` | 3개 도구 사용 | 삭제가 발생한 후 유지할 최근 도구 사용/결과 쌍의 개수를 정의합니다. API는 가장 오래된 도구 상호작용을 먼저 제거하고 가장 최근의 것을 보존합니다. |
| `clear_at_least` | 없음 | 전략이 활성화될 때마다 최소한 삭제되는 토큰 수를 보장합니다. API가 지정된 양 이상을 삭제할 수 없으면 전략이 적용되지 않습니다. 이는 컨텍스트 삭제가 프롬프트 캐시를 깨뜨릴 가치가 있는지 결정하는 데 도움이 됩니다. |
| `exclude_tools` | 없음 | 도구 사용 및 결과가 절대 삭제되지 않아야 하는 도구 이름 목록입니다. 중요한 컨텍스트를 보존하는 데 유용합니다. |
| `clear_tool_inputs` | `false` | 도구 결과와 함께 도구 호출 매개변수를 삭제할지 여부를 제어합니다. 기본적으로 Claude의 원래 도구 호출을 표시하면서 도구 결과만 삭제됩니다. |

### 사고 블록 삭제를 위한 구성 옵션

`clear_thinking_20251015` 전략은 다음 구성을 지원합니다:

| 구성 옵션 | 기본값 | 설명 |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | 보존할 최근 어시스턴트 턴의 개수를 정의합니다. 마지막 N개 턴을 유지하려면 `{type: "thinking_turns", value: N}`을 사용하세요(N > 0이어야 함). 모든 사고 블록을 유지하려면 `"all"`을 사용하세요. |

**예제 구성:**

```json
// 마지막 3개 어시스턴트 턴의 사고 블록 유지
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// 모든 사고 블록 유지(캐시 히트 최대화)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 전략 결합

사고 블록 삭제와 도구 결과 삭제를 함께 사용할 수 있습니다:

<Note>
여러 전략을 사용할 때 `clear_thinking_20251015` 전략은 `edits` 배열에서 먼저 나열되어야 합니다.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## 도구 결과 삭제를 위한 구성 옵션

| 구성 옵션 | 기본값 | 설명 |
|---------------------|---------|-------------|
| `trigger` | 100,000 입력 토큰 | 컨텍스트 편집 전략이 활성화되는 시점을 정의합니다. 프롬프트가 이 임계값을 초과하면 삭제가 시작됩니다. 이 값을 `input_tokens` 또는 `tool_uses`로 지정할 수 있습니다. |
| `keep` | 3개 도구 사용 | 삭제가 발생한 후 유지할 최근 도구 사용/결과 쌍의 개수를 정의합니다. API는 가장 오래된 도구 상호작용을 먼저 제거하고 가장 최근의 것을 보존합니다. |
| `clear_at_least` | 없음 | 전략이 활성화될 때마다 최소한 삭제되는 토큰 수를 보장합니다. API가 지정된 양 이상을 삭제할 수 없으면 전략이 적용되지 않습니다. 이는 컨텍스트 삭제가 프롬프트 캐시를 깨뜨릴 가치가 있는지 결정하는 데 도움이 됩니다. |
| `exclude_tools` | 없음 | 도구 사용 및 결과가 절대 삭제되지 않아야 하는 도구 이름 목록입니다. 중요한 컨텍스트를 보존하는 데 유용합니다. |
| `clear_tool_inputs` | `false` | 도구 결과와 함께 도구 호출 매개변수를 삭제할지 여부를 제어합니다. 기본적으로 Claude의 원래 도구 호출을 표시하면서 도구 결과만 삭제됩니다. |

## 컨텍스트 편집 응답

`context_management` 응답 필드를 사용하여 요청에 적용된 컨텍스트 편집과 삭제된 콘텐츠 및 입력 토큰에 대한 유용한 통계를 확인할 수 있습니다.

```json 응답
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // `clear_thinking_20251015` 사용 시
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // `clear_tool_uses_20250919` 사용 시
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

스트리밍 응답의 경우 컨텍스트 편집은 최종 `message_delta` 이벤트에 포함됩니다:

```json 스트리밍 응답
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

### 생각 블록 지우기 구성 옵션

`clear_thinking_20251015` 전략은 다음 구성을 지원합니다:

| 구성 옵션 | 기본값 | 설명 |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | 생각 블록이 있는 최근 어시스턴트 턴을 몇 개 보존할지 정의합니다. 마지막 N개 턴을 유지하려면 `{type: "thinking_turns", value: N}`을 사용하세요. 여기서 N은 0보다 커야 하며, 모든 생각 블록을 유지하려면 `"all"`을 사용하세요. |

**예제 구성:**

```json
// 마지막 3개 어시스턴트 턴의 생각 블록 유지
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// 모든 생각 블록 유지 (캐시 히트 최대화)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 전략 결합

생각 블록 지우기와 도구 결과 지우기를 함께 사용할 수 있습니다:

<Note>
여러 전략을 사용할 때는 `clear_thinking_20251015` 전략이 `edits` 배열에서 먼저 나열되어야 합니다.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## 도구 결과 지우기 구성 옵션

| 구성 옵션 | 기본값 | 설명 |
|---------------------|---------|-------------|
| `trigger` | 100,000 입력 토큰 | 컨텍스트 편집 전략이 활성화되는 시점을 정의합니다. 프롬프트가 이 임계값을 초과하면 지우기가 시작됩니다. 이 값을 `input_tokens` 또는 `tool_uses`로 지정할 수 있습니다. |
| `keep` | 3개 도구 사용 | 지우기가 발생한 후 유지할 최근 도구 사용/결과 쌍의 개수를 정의합니다. API는 가장 오래된 도구 상호작용을 먼저 제거하여 가장 최근의 것을 보존합니다. |
| `clear_at_least` | 없음 | 전략이 활성화될 때마다 최소한 지워야 할 토큰 수를 보장합니다. API가 지정된 양 이상을 지울 수 없으면 전략이 적용되지 않습니다. 이는 컨텍스트 지우기가 프롬프트 캐시를 깨뜨릴 가치가 있는지 결정하는 데 도움이 됩니다. |
| `exclude_tools` | 없음 | 도구 사용 및 결과가 절대 지워지지 않아야 할 도구 이름 목록입니다. 중요한 컨텍스트를 보존하는 데 유용합니다. |
| `clear_tool_inputs` | `false` | 도구 결과와 함께 도구 호출 매개변수를 지울지 여부를 제어합니다. 기본적으로 Claude의 원본 도구 호출을 표시하면서 도구 결과만 지워집니다. |

## 컨텍스트 편집 응답

`context_management` 응답 필드를 사용하여 요청에 적용된 컨텍스트 편집과 지워진 콘텐츠 및 입력 토큰에 대한 유용한 통계를 확인할 수 있습니다.

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // `clear_thinking_20251015` 사용 시
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // `clear_tool_uses_20250919` 사용 시
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

스트리밍 응답의 경우 컨텍스트 편집이 최종 `message_delta` 이벤트에 포함됩니다:

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

## 토큰 계산

[토큰 계산](/docs/ko/build-with-claude/token-counting) 엔드포인트는 컨텍스트 관리를 지원하므로 컨텍스트 편집이 적용된 후 프롬프트가 사용할 토큰 수를 미리 볼 수 있습니다.

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages/count_tokens \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "messages": [
            {
                "role": "user",
                "content": "Continue our conversation..."
            }
        ],
        "tools": [...],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 5
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.count_tokens(
    model="claude-sonnet-4-5",
    messages=[
        {
            "role": "user",
            "content": "Continue our conversation..."
        }
    ],
    tools=[...],  # Your tool definitions
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)

print(f"Original tokens: {response.context_management['original_input_tokens']}")
print(f"After clearing: {response.input_tokens}")
print(f"Savings: {response.context_management['original_input_tokens'] - response.input_tokens} tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.countTokens({
  model: "claude-sonnet-4-5",
  messages: [
    {
      role: "user",
      content: "Continue our conversation..."
    }
  ],
  tools: [...],  // Your tool definitions
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});

console.log(`Original tokens: ${response.context_management?.original_input_tokens}`);
console.log(`After clearing: ${response.input_tokens}`);
console.log(`Savings: ${(response.context_management?.original_input_tokens || 0) - response.input_tokens} tokens`);
```
</CodeGroup>

```json Response
{
    "input_tokens": 25000,
    "context_management": {
        "original_input_tokens": 70000
    }
}
```

응답은 컨텍스트 관리가 적용된 후의 최종 토큰 수(`input_tokens`)와 지우기가 발생하기 전의 원본 토큰 수(`original_input_tokens`)를 모두 표시합니다.

## 메모리 도구와 함께 사용

컨텍스트 편집은 [메모리 도구](/docs/ko/agents-and-tools/tool-use/memory-tool)와 결합할 수 있습니다. 대화 컨텍스트가 구성된 지우기 임계값에 접근하면 Claude는 중요한 정보를 보존하도록 자동 경고를 받습니다. 이를 통해 Claude는 도구 결과나 컨텍스트가 대화 기록에서 지워지기 전에 메모리 파일에 저장할 수 있습니다.

이 조합을 통해 다음을 수행할 수 있습니다:

- **중요한 컨텍스트 보존**: Claude는 도구 결과에서 필수 정보를 메모리 파일에 작성한 후 해당 결과가 지워질 수 있습니다
- **장기 실행 워크플로우 유지**: 정보를 영구 저장소로 오프로드하여 컨텍스트 제한을 초과할 수 있는 에이전트 워크플로우를 활성화합니다
- **필요에 따라 정보 액세스**: Claude는 활성 컨텍스트 윈도우에 모든 것을 유지하는 대신 필요할 때 메모리 파일에서 이전에 지워진 정보를 조회할 수 있습니다

예를 들어, Claude가 많은 작업을 수행하는 파일 편집 워크플로우에서 Claude는 컨텍스트가 증가함에 따라 완료된 변경 사항을 메모리 파일로 요약할 수 있습니다. 도구 결과가 지워지면 Claude는 메모리 시스템을 통해 해당 정보에 계속 액세스할 수 있으며 효과적으로 계속 작업할 수 있습니다.

두 기능을 함께 사용하려면 API 요청에서 활성화하세요:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## 클라이언트 측 압축 (SDK)

<Note>
압축은 [`tool_runner` 메서드](/docs/ko/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)를 사용할 때 [Python 및 TypeScript SDK](/docs/ko/api/client-sdks)에서 사용 가능합니다.
</Note>

압축은 토큰 사용량이 너무 커지면 요약을 생성하여 대화 컨텍스트를 자동으로 관리하는 SDK 기능입니다. 콘텐츠를 지우는 서버 측 컨텍스트 편집 전략과 달리 압축은 Claude에게 대화 기록을 요약하도록 지시한 다음 전체 기록을 해당 요약으로 바꿉니다. 이를 통해 Claude는 [컨텍스트 윈도우](/docs/ko/build-with-claude/context-windows)를 초과할 수 있는 장기 실행 작업을 계속할 수 있습니다.

### 압축 작동 방식

압축이 활성화되면 SDK는 각 모델 응답 후 토큰 사용량을 모니터링합니다:

1. **임계값 확인**: SDK는 총 토큰을 `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`로 계산합니다
2. **요약 생성**: 임계값을 초과하면 요약 프롬프트가 사용자 턴으로 주입되고 Claude는 `<summary></summary>` 태그로 래핑된 구조화된 요약을 생성합니다
3. **컨텍스트 교체**: SDK는 요약을 추출하고 전체 메시지 기록을 이로 바꿉니다
4. **계속**: 대화는 요약에서 재개되고 Claude는 중단된 부분부터 계속합니다

### 압축 사용

`tool_runner` 호출에 `compaction_control`을 추가하세요:

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### 압축 중 발생하는 일

대화가 증가하면서 메시지 기록이 누적됩니다:

**압축 전 (100k 토큰에 접근 중):**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

토큰이 임계값을 초과하면 SDK는 요약 요청을 주입하고 Claude는 요약을 생성합니다. 그러면 전체 기록이 교체됩니다:

**압축 후 (~2-3k 토큰으로 돌아감):**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude는 이 요약에서 원본 대화 기록인 것처럼 계속 작업합니다.

### 구성 옵션

| 매개변수 | 유형 | 필수 | 기본값 | 설명 |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | 예 | - | 자동 압축 활성화 여부 |
| `context_token_threshold` | number | 아니오 | 100,000 | 압축이 트리거되는 토큰 수 |
| `model` | string | 아니오 | 메인 모델과 동일 | 요약 생성에 사용할 모델 |
| `summary_prompt` | string | 아니오 | 아래 참조 | 요약 생성을 위한 사용자 정의 프롬프트 |

#### 토큰 임계값 선택

임계값은 압축이 발생하는 시점을 결정합니다. 낮은 임계값은 더 작은 컨텍스트 윈도우로 더 자주 압축됨을 의미합니다. 높은 임계값은 더 많은 컨텍스트를 허용하지만 제한에 도달할 위험이 있습니다.

<CodeGroup>

```python Python
# 메모리 제약 시나리오에서 더 자주 압축
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# 더 많은 컨텍스트가 필요할 때 덜 자주 압축
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// 메모리 제약 시나리오에서 더 자주 압축
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// 더 많은 컨텍스트가 필요할 때 덜 자주 압축
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### 요약을 위해 다른 모델 사용

요약 생성을 위해 더 빠르거나 저렴한 모델을 사용할 수 있습니다:

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### 사용자 정의 요약 프롬프트

도메인별 요구 사항을 위해 사용자 정의 프롬프트를 제공할 수 있습니다. 프롬프트는 Claude에게 요약을 `<summary></summary>` 태그로 래핑하도록 지시해야 합니다.

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

## 메모리 도구와 함께 사용하기

컨텍스트 편집은 [메모리 도구](/docs/ko/agents-and-tools/tool-use/memory-tool)와 결합할 수 있습니다. 대화 컨텍스트가 구성된 지우기 임계값에 접근하면 Claude는 중요한 정보를 보존하도록 자동 경고를 받습니다. 이를 통해 Claude는 도구 결과나 컨텍스트가 대화 기록에서 지워지기 전에 메모리 파일에 저장할 수 있습니다.

이 조합을 통해 다음을 수행할 수 있습니다:

- **중요한 컨텍스트 보존**: Claude는 도구 결과의 필수 정보를 메모리 파일에 작성한 후 해당 결과가 지워질 수 있습니다
- **장기 실행 워크플로우 유지**: 정보를 지속적인 저장소로 오프로드하여 컨텍스트 제한을 초과할 수 있는 에이전트 워크플로우를 활성화합니다
- **필요에 따라 정보 액세스**: Claude는 활성 컨텍스트 윈도우에 모든 것을 유지하는 대신 필요할 때 메모리 파일에서 이전에 지워진 정보를 조회할 수 있습니다

예를 들어, Claude가 많은 작업을 수행하는 파일 편집 워크플로우에서 Claude는 컨텍스트가 증가함에 따라 완료된 변경 사항을 메모리 파일로 요약할 수 있습니다. 도구 결과가 지워지면 Claude는 메모리 시스템을 통해 해당 정보에 대한 액세스를 유지하고 효과적으로 계속 작업할 수 있습니다.

두 기능을 함께 사용하려면 API 요청에서 이를 활성화하세요:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## 클라이언트 측 압축 (SDK)

<Note>
압축은 [`tool_runner` 메서드](/docs/ko/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)를 사용할 때 [Python 및 TypeScript SDK](/docs/ko/api/client-sdks)에서 사용 가능합니다.
</Note>

압축은 토큰 사용량이 너무 커질 때 요약을 생성하여 대화 컨텍스트를 자동으로 관리하는 SDK 기능입니다. 콘텐츠를 지우는 서버 측 컨텍스트 편집 전략과 달리 압축은 Claude에게 대화 기록을 요약하도록 지시한 다음 전체 기록을 해당 요약으로 바꿉니다. 이를 통해 Claude는 [컨텍스트 윈도우](/docs/ko/build-with-claude/context-windows)를 초과할 수 있는 장기 실행 작업을 계속 수행할 수 있습니다.

### 압축 작동 방식

압축이 활성화되면 SDK는 각 모델 응답 후 토큰 사용량을 모니터링합니다:

1. **임계값 확인**: SDK는 총 토큰을 `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`로 계산합니다
2. **요약 생성**: 임계값을 초과하면 요약 프롬프트가 사용자 턴으로 주입되고 Claude는 `<summary></summary>` 태그로 래핑된 구조화된 요약을 생성합니다
3. **컨텍스트 교체**: SDK는 요약을 추출하고 전체 메시지 기록을 이로 바꿉니다
4. **계속**: 대화는 요약에서 재개되고 Claude는 중단한 지점에서 계속합니다

### 압축 사용

`tool_runner` 호출에 `compaction_control`을 추가합니다:

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### 압축 중에 발생하는 일

대화가 증가함에 따라 메시지 기록이 누적됩니다:

**압축 전 (100k 토큰에 접근 중):**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

토큰이 임계값을 초과하면 SDK는 요약 요청을 주입하고 Claude는 요약을 생성합니다. 그러면 전체 기록이 바뀝니다:

**압축 후 (~2-3k 토큰으로 돌아감):**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude는 이 요약에서 원래 대화 기록인 것처럼 작업을 계속합니다.

### 구성 옵션

| 매개변수 | 유형 | 필수 | 기본값 | 설명 |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | 예 | - | 자동 압축 활성화 여부 |
| `context_token_threshold` | number | 아니오 | 100,000 | 압축이 트리거되는 토큰 수 |
| `model` | string | 아니오 | 메인 모델과 동일 | 요약 생성에 사용할 모델 |
| `summary_prompt` | string | 아니오 | 아래 참조 | 요약 생성을 위한 사용자 정의 프롬프트 |

#### 토큰 임계값 선택

임계값은 압축이 발생하는 시기를 결정합니다. 낮은 임계값은 더 작은 컨텍스트 윈도우로 더 자주 압축됨을 의미합니다. 높은 임계값은 더 많은 컨텍스트를 허용하지만 제한에 도달할 위험이 있습니다.

<CodeGroup>

```python Python
# More frequent compaction for memory-constrained scenarios
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Less frequent compaction when you need more context
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// More frequent compaction for memory-constrained scenarios
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Less frequent compaction when you need more context
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### 요약을 위해 다른 모델 사용

요약 생성을 위해 더 빠르거나 저렴한 모델을 사용할 수 있습니다:

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### 사용자 정의 요약 프롬프트

도메인별 요구 사항에 대한 사용자 정의 프롬프트를 제공할 수 있습니다. 프롬프트는 Claude에게 요약을 `<summary></summary>` 태그로 래핑하도록 지시해야 합니다.

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

### 기본 요약 프롬프트

기본 제공 요약 프롬프트는 Claude에게 다음을 포함하는 구조화된 계속 요약을 작성하도록 지시합니다:

1. **작업 개요**: 사용자의 핵심 요청, 성공 기준 및 제약 조건
2. **현재 상태**: 완료된 사항, 수정된 파일 및 생성된 아티팩트
3. **중요한 발견**: 기술적 제약 조건, 내린 결정, 해결된 오류 및 실패한 접근 방식
4. **다음 단계**: 필요한 구체적 조치, 차단 요소 및 우선 순위
5. **보존할 컨텍스트**: 사용자 기본 설정, 도메인별 세부 정보 및 약속

이 구조는 Claude가 중요한 컨텍스트를 잃지 않거나 실수를 반복하지 않고 효율적으로 작업을 재개할 수 있게 합니다.

<section title="전체 기본 프롬프트 보기">

```
You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:

1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified

2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced

3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)

4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain

5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user

Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.

Wrap your summary in <summary></summary> tags.
```

</section>

### 제한 사항

#### 서버 측 도구

<Warning>
압축은 [웹 검색](/docs/ko/agents-and-tools/tool-use/web-search-tool) 또는 [웹 가져오기](/docs/ko/agents-and-tools/tool-use/web-fetch-tool)와 같은 서버 측 도구를 사용할 때 특별한 고려가 필요합니다.
</Warning>

서버 측 도구를 사용할 때 SDK는 토큰 사용량을 잘못 계산하여 압축이 잘못된 시간에 트리거될 수 있습니다.

예를 들어 웹 검색 작업 후 API 응답은 다음과 같을 수 있습니다:

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

SDK는 총 사용량을 63,000 + 270,000 = 333,000 토큰으로 계산합니다. 그러나 `cache_read_input_tokens` 값은 실제 대화 컨텍스트가 아닌 서버 측 도구에서 만든 여러 내부 API 호출의 누적 읽기를 포함합니다. 실제 컨텍스트 길이는 63,000 `input_tokens`일 수 있지만 SDK는 333k를 보고 조기에 압축을 트리거합니다.

**해결 방법:**

- [토큰 계산](/docs/ko/build-with-claude/token-counting) 엔드포인트를 사용하여 정확한 컨텍스트 길이를 얻습니다
- 서버 측 도구를 광범위하게 사용할 때 압축을 피합니다

#### 도구 사용 엣지 케이스

도구 사용 응답이 보류 중일 때 압축이 트리거되면 SDK는 요약을 생성하기 전에 메시지 기록에서 도구 사용 블록을 제거합니다. Claude는 요약에서 재개한 후 필요하면 도구 호출을 다시 발행합니다.

### 제한 사항

#### 서버 측 도구

<Warning>
압축은 [웹 검색](/docs/ko/agents-and-tools/tool-use/web-search-tool) 또는 [웹 가져오기](/docs/ko/agents-and-tools/tool-use/web-fetch-tool)와 같은 서버 측 도구를 사용할 때 특별한 고려가 필요합니다.
</Warning>

서버 측 도구를 사용할 때 SDK는 토큰 사용량을 잘못 계산하여 압축이 잘못된 시간에 트리거될 수 있습니다.

예를 들어 웹 검색 작업 후 API 응답은 다음과 같을 수 있습니다:

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

SDK는 총 사용량을 63,000 + 270,000 = 333,000 토큰으로 계산합니다. 그러나 `cache_read_input_tokens` 값은 실제 대화 컨텍스트가 아닌 서버 측 도구에서 만든 여러 내부 API 호출의 누적 읽기를 포함합니다. 실제 컨텍스트 길이는 63,000 `input_tokens`일 수 있지만 SDK는 333k를 보고 조기에 압축을 트리거합니다.

**해결 방법:**

- [토큰 계산](/docs/ko/build-with-claude/token-counting) 엔드포인트를 사용하여 정확한 컨텍스트 길이를 얻습니다
- 서버 측 도구를 광범위하게 사용할 때 압축을 피합니다

#### 도구 사용 엣지 케이스

도구 사용 응답이 보류 중일 때 압축이 트리거되면 SDK는 요약을 생성하기 전에 메시지 기록에서 도구 사용 블록을 제거합니다. Claude는 요약에서 재개한 후 필요하면 도구 호출을 다시 발행합니다.

### 압축 모니터링

로깅을 활성화하여 압축이 발생하는 시기를 추적합니다:

<CodeGroup>

```python Python
import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger("anthropic.lib.tools").setLevel(logging.INFO)

# Logs will show:
# INFO: Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
# INFO: Compaction complete. New token usage: 2500
```

```typescript TypeScript
// The SDK logs compaction events to the console
// You'll see messages like:
// Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
// Compaction complete. New token usage: 2500
```

</CodeGroup>

### 제한 사항

#### 서버 측 도구

<Warning>
압축은 [웹 검색](/docs/ko/agents-and-tools/tool-use/web-search-tool) 또는 [웹 가져오기](/docs/ko/agents-and-tools/tool-use/web-fetch-tool)와 같은 서버 측 도구를 사용할 때 특별한 고려가 필요합니다.
</Warning>

서버 측 도구를 사용할 때 SDK는 토큰 사용량을 잘못 계산하여 압축이 잘못된 시간에 트리거될 수 있습니다.

예를 들어 웹 검색 작업 후 API 응답은 다음과 같을 수 있습니다:

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

SDK는 총 사용량을 63,000 + 270,000 = 333,000 토큰으로 계산합니다. 그러나 `cache_read_input_tokens` 값은 실제 대화 컨텍스트가 아닌 서버 측 도구에서 만든 여러 내부 API 호출의 누적 읽기를 포함합니다. 실제 컨텍스트 길이는 63,000 `input_tokens`일 수 있지만 SDK는 333k를 보고 조기에 압축을 트리거합니다.

**해결 방법:**

- [토큰 계산](/docs/ko/build-with-claude/token-counting) 엔드포인트를 사용하여 정확한 컨텍스트 길이를 얻습니다
- 서버 측 도구를 광범위하게 사용할 때 압축을 피합니다

#### 도구 사용 엣지 케이스

도구 사용 응답이 보류 중일 때 압축이 트리거되면 SDK는 요약을 생성하기 전에 메시지 기록에서 도구 사용 블록을 제거합니다. Claude는 요약에서 재개한 후 필요하면 도구 호출을 다시 발행합니다.

### 압축을 사용할 시기

**좋은 사용 사례:**

- 많은 파일이나 데이터 소스를 처리하는 장기 실행 에이전트 작업
- 많은 양의 정보를 누적하는 연구 워크플로우
- 명확하고 측정 가능한 진행 상황이 있는 다단계 작업
- 대화 외부에서 지속되는 아티팩트(파일, 보고서)를 생성하는 작업

**덜 이상적인 사용 사례:**

- 초기 대화 세부 정보의 정확한 회상이 필요한 작업
- 서버 측 도구를 광범위하게 사용하는 워크플로우
- 많은 변수에 걸쳐 정확한 상태를 유지해야 하는 작업