# Claude 4.5로 마이그레이션

Claude 4.5 모델로 마이그레이션하기 위한 단계별 가이드

---

이 가이드는 Claude 4.5 모델로의 두 가지 주요 마이그레이션 경로를 다룹니다:

- **Claude Sonnet 3.7 → Claude Sonnet 4.5**: 최고 수준의 추론, 코딩 및 장시간 실행 에이전트 기능을 갖춘 가장 지능형 모델
- **Claude Haiku 3.5 → Claude Haiku 4.5**: 실시간 애플리케이션 및 대량 지능형 처리를 위한 최고 성능의 가장 빠르고 지능형 Haiku 모델

두 마이그레이션 모두 구현에 대한 업데이트가 필요한 주요 변경 사항을 포함합니다. 이 가이드는 단계별 지침과 명확하게 표시된 주요 변경 사항과 함께 각 마이그레이션 경로를 안내합니다.

마이그레이션을 시작하기 전에 [Claude 4.5의 새로운 기능](/docs/ko/about-claude/models/whats-new-claude-4-5)을 검토하여 확장 사고, 컨텍스트 인식 및 동작 개선을 포함한 이러한 모델에서 사용 가능한 새로운 기능과 기능을 이해하는 것을 권장합니다.

## Claude Sonnet 3.7에서 Claude Sonnet 4.5로 마이그레이션

Claude Sonnet 4.5는 추론, 코딩 및 장시간 실행 자율 에이전트에 대한 최고 수준의 성능을 제공하는 가장 지능형 모델입니다. 이 마이그레이션에는 구현에 대한 업데이트가 필요한 여러 주요 변경 사항이 포함됩니다.

### 마이그레이션 단계

1. **모델 이름 업데이트:**
   ```python
   # Before (Claude Sonnet 3.7)
   model="claude-3-7-sonnet-20250219"

   # After (Claude Sonnet 4.5)
   model="claude-sonnet-4-5-20250929"
   ```

2. **샘플링 매개변수 업데이트**

   <Warning>
   이것은 Claude Sonnet 3.7의 주요 변경 사항입니다.
   </Warning>

   `temperature` 또는 `top_p` 중 하나만 사용하고 둘 다 사용하지 마세요:

   ```python
   # Before (Claude Sonnet 3.7) - Sonnet 4.5에서 오류 발생
   response = client.messages.create(
       model="claude-3-7-sonnet-20250219",
       temperature=0.7,
       top_p=0.9,  # 둘 다 사용할 수 없음
       ...
   )

   # After (Claude Sonnet 4.5)
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       temperature=0.7,  # temperature 또는 top_p 중 하나만 사용, 둘 다 아님
       ...
   )
   ```

3. **새로운 `refusal` 중지 이유 처리**

   애플리케이션을 업데이트하여 [`refusal` 중지 이유를 처리](/docs/ko/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals)합니다:

   ```python
   response = client.messages.create(...)

   if response.stop_reason == "refusal":
       # 거부를 적절히 처리
       pass
   ```

4. **텍스트 편집기 도구 업데이트 (해당하는 경우)**

   <Warning>
   이것은 Claude Sonnet 3.7의 주요 변경 사항입니다.
   </Warning>

   `text_editor_20250728` (유형) 및 `str_replace_based_edit_tool` (이름)로 업데이트합니다. `undo_edit` 명령을 사용하는 모든 코드를 제거합니다.
   
   ```python
   # Before (Claude Sonnet 3.7)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # After (Claude Sonnet 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   자세한 내용은 [텍스트 편집기 도구 설명서](/docs/ko/agents-and-tools/tool-use/text-editor-tool)를 참조하세요.

5. **코드 실행 도구 업데이트 (해당하는 경우)**

   `code_execution_20250825`로 업그레이드합니다. 레거시 버전 `code_execution_20250522`는 여전히 작동하지만 권장되지 않습니다. 마이그레이션 지침은 [코드 실행 도구 설명서](/docs/ko/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version)를 참조하세요.

6. **토큰 효율적 도구 사용 베타 헤더 제거**

   토큰 효율적 도구 사용은 Claude 3.7 Sonnet에서만 작동하는 베타 기능입니다. 모든 Claude 4 모델에는 기본 제공 토큰 효율적 도구 사용이 있으므로 더 이상 베타 헤더를 포함하면 안 됩니다.

   요청에서 `token-efficient-tools-2025-02-19` [베타 헤더](/docs/ko/api/beta-headers)를 제거합니다:

   ```python
   # Before (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["token-efficient-tools-2025-02-19"],  # 이것을 제거
       ...
   )

   # After (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # 토큰 효율적 도구 베타 헤더 없음
       ...
   )
   ```

7. **확장 출력 베타 헤더 제거**

   확장 출력을 위한 `output-128k-2025-02-19` [베타 헤더](/docs/ko/api/beta-headers)는 Claude Sonnet 3.7에서만 사용 가능합니다.

   요청에서 이 헤더를 제거합니다:

   ```python
   # Before (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["output-128k-2025-02-19"],  # 이것을 제거
       ...
   )

   # After (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # output-128k 베타 헤더 없음
       ...
   )
   ```

8. **동작 변경에 대한 프롬프트 업데이트**

   Claude Sonnet 4.5는 더 간결하고 직접적인 통신 스타일을 가지며 명시적 지시가 필요합니다. 최적화 지침은 [Claude 4 프롬프트 엔지니어링 모범 사례](/docs/ko/build-with-claude/prompt-engineering/claude-4-best-practices)를 검토하세요.

9. **복잡한 작업에 대해 확장 사고 활성화 고려**

   코딩 및 추론 작업에서 상당한 성능 개선을 위해 [확장 사고](/docs/ko/build-with-claude/extended-thinking)를 활성화합니다 (기본적으로 비활성화됨):

   ```python
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 10000},
       messages=[...]
   )
   ```

   <Note>
   확장 사고는 [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching#caching-with-thinking-blocks) 효율성에 영향을 미칩니다.
   </Note>

10. **구현 테스트**

   프로덕션에 배포하기 전에 개발 환경에서 테스트하여 모든 주요 변경 사항이 올바르게 처리되는지 확인합니다.

### Sonnet 3.7 → 4.5 마이그레이션 체크리스트

- [ ] 모델 ID를 `claude-sonnet-4-5-20250929`로 업데이트
- [ ] **주요 변경**: 샘플링 매개변수를 `temperature` 또는 `top_p` 중 하나만 사용하도록 업데이트, 둘 다 아님
- [ ] 애플리케이션에서 새로운 `refusal` 중지 이유 처리
- [ ] **주요 변경**: 텍스트 편집기 도구를 `text_editor_20250728` 및 `str_replace_based_edit_tool`로 업데이트 (해당하는 경우)
- [ ] **주요 변경**: `undo_edit` 명령을 사용하는 모든 코드 제거 (해당하는 경우)
- [ ] 코드 실행 도구를 `code_execution_20250825`로 업데이트 (해당하는 경우)
- [ ] `token-efficient-tools-2025-02-19` 베타 헤더 제거 (해당하는 경우)
- [ ] `output-128k-2025-02-19` 베타 헤더 제거 (해당하는 경우)
- [ ] [Claude 4 모범 사례](/docs/ko/build-with-claude/prompt-engineering/claude-4-best-practices)에 따라 프롬프트 검토 및 업데이트
- [ ] 복잡한 추론 작업에 대해 확장 사고 활성화 고려
- [ ] `model_context_window_exceeded` 중지 이유 처리 (Sonnet 4.5 특정)
- [ ] 장시간 실행 에이전트에 대해 메모리 도구 활성화 고려 (베타)
- [ ] 컨텍스트 편집을 위해 자동 도구 호출 지우기 사용 고려 (베타)
- [ ] 프로덕션 배포 전에 개발 환경에서 테스트

### Claude Sonnet 3.7에서 제거된 기능

- **토큰 효율적 도구 사용**: `token-efficient-tools-2025-02-19` 베타 헤더는 Claude 3.7 Sonnet에서만 작동하며 Claude 4 모델에서는 지원되지 않습니다 (6단계 참조)
- **확장 출력**: `output-128k-2025-02-19` 베타 헤더는 지원되지 않습니다 (7단계 참조)

두 헤더 모두 Claude 4 요청에 포함될 수 있지만 효과가 없습니다.

## Claude Haiku 3.5에서 Claude Haiku 4.5로 마이그레이션

Claude Haiku 4.5는 최고 수준의 성능을 제공하는 가장 빠르고 지능형 Haiku 모델로, 대화형 애플리케이션 및 대량 지능형 처리를 위한 실시간 성능으로 프리미엄 모델 품질을 제공합니다. 이 마이그레이션에는 구현에 대한 업데이트가 필요한 여러 주요 변경 사항이 포함됩니다.

새로운 기능의 전체 개요는 [Claude 4.5의 새로운 기능](/docs/ko/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5)을 참조하세요.

<Note>
Haiku 4.5 가격 책정: 입력 토큰 100만 개당 $1, 출력 토큰 100만 개당 $5. 자세한 내용은 [Claude 가격 책정](/docs/ko/about-claude/pricing)을 참조하세요.
</Note>

### 마이그레이션 단계

1. **모델 이름 업데이트:**
   ```python
   # Before (Haiku 3.5)
   model="claude-3-5-haiku-20241022"

   # After (Haiku 4.5)
   model="claude-haiku-4-5-20251001"
   ```

2. **도구 버전 업데이트 (해당하는 경우)**

   <Warning>
   이것은 Claude Haiku 3.5의 주요 변경 사항입니다.
   </Warning>

   Haiku 4.5는 최신 도구 버전만 지원합니다:

   ```python
   # Before (Haiku 3.5)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # After (Haiku 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   - **텍스트 편집기**: `text_editor_20250728` 및 `str_replace_based_edit_tool` 사용
   - **코드 실행**: `code_execution_20250825` 사용
   - `undo_edit` 명령을 사용하는 모든 코드 제거

3. **샘플링 매개변수 업데이트**

   <Warning>
   이것은 Claude Haiku 3.5의 주요 변경 사항입니다.
   </Warning>

   `temperature` 또는 `top_p` 중 하나만 사용하고 둘 다 사용하지 마세요:

   ```python
   # Before (Haiku 3.5) - Haiku 4.5에서 오류 발생
   response = client.messages.create(
       model="claude-3-5-haiku-20241022",
       temperature=0.7,
       top_p=0.9,  # 둘 다 사용할 수 없음
       ...
   )

   # After (Haiku 4.5)
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       temperature=0.7,  # temperature 또는 top_p 중 하나만 사용, 둘 다 아님
       ...
   )
   ```

4. **새로운 속도 제한 검토**

   Haiku 4.5는 Haiku 3.5와 별도의 속도 제한이 있습니다. 자세한 내용은 [속도 제한 설명서](/docs/ko/api/rate-limits)를 참조하세요.

5. **새로운 `refusal` 중지 이유 처리**

   애플리케이션을 업데이트하여 [거부 중지 이유를 처리](/docs/ko/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals)합니다.

6. **복잡한 작업에 대해 확장 사고 활성화 고려**

   코딩 및 추론 작업에서 상당한 성능 개선을 위해 [확장 사고](/docs/ko/build-with-claude/extended-thinking)를 활성화합니다 (기본적으로 비활성화됨):

   ```python
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 5000},
       messages=[...]
   )
   ```
   <Note>
   확장 사고는 [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching#caching-with-thinking-blocks) 효율성에 영향을 미칩니다.
   </Note>

7. **새로운 기능 탐색**

   컨텍스트 인식, 증가된 출력 용량 (64K 토큰), 더 높은 지능 및 개선된 속도에 대한 자세한 내용은 [Claude 4.5의 새로운 기능](/docs/ko/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5)을 참조하세요.

8. **구현 테스트**

   프로덕션에 배포하기 전에 개발 환경에서 테스트하여 모든 주요 변경 사항이 올바르게 처리되는지 확인합니다.

### Haiku 3.5 → 4.5 마이그레이션 체크리스트

- [ ] 모델 ID를 `claude-haiku-4-5-20251001`로 업데이트
- [ ] **주요 변경**: 도구 버전을 최신 버전으로 업데이트 (예: `text_editor_20250728`, `code_execution_20250825`) - 레거시 버전은 지원되지 않음
- [ ] **주요 변경**: `undo_edit` 명령을 사용하는 모든 코드 제거 (해당하는 경우)
- [ ] **주요 변경**: 샘플링 매개변수를 `temperature` 또는 `top_p` 중 하나만 사용하도록 업데이트, 둘 다 아님
- [ ] 새로운 속도 제한에 대해 검토 및 조정 (Haiku 3.5와 별도)
- [ ] 애플리케이션에서 새로운 `refusal` 중지 이유 처리
- [ ] 복잡한 추론 작업에 대해 확장 사고 활성화 고려 (새로운 기능)
- [ ] 긴 세션에서 더 나은 토큰 관리를 위해 컨텍스트 인식 활용
- [ ] 더 큰 응답 준비 (최대 출력이 8K에서 64K 토큰으로 증가)
- [ ] [Claude 4 모범 사례](/docs/ko/build-with-claude/prompt-engineering/claude-4-best-practices)에 따라 프롬프트 검토 및 업데이트
- [ ] 프로덕션 배포 전에 개발 환경에서 테스트

## Sonnet 4.5와 Haiku 4.5 중 선택

Claude Sonnet 4.5와 Claude Haiku 4.5는 모두 다양한 강점을 가진 강력한 Claude 4 모델입니다:

### Claude Sonnet 4.5 선택 (가장 지능형):

- **복잡한 추론 및 분석**: 정교한 작업을 위한 최고 수준의 지능
- **장시간 실행 자율 에이전트**: 장시간 독립적으로 작동하는 에이전트를 위한 우수한 성능
- **고급 코딩 작업**: 고급 계획 및 보안 엔지니어링을 갖춘 가장 강력한 코딩 모델
- **대규모 컨텍스트 워크플로우**: 메모리 도구 및 컨텍스트 편집 기능을 갖춘 향상된 컨텍스트 관리
- **최대 기능이 필요한 작업**: 지능과 정확성이 최우선일 때

### Claude Haiku 4.5 선택 (가장 빠르고 지능형 Haiku):

- **실시간 애플리케이션**: 최고 수준의 성능에 가까운 대화형 사용자 경험을 위한 빠른 응답 시간
- **대량 지능형 처리**: 개선된 속도로 규모에 따른 비용 효율적인 지능
- **비용에 민감한 배포**: 더 낮은 가격대에서 최고 수준의 성능에 가까운 성능
- **서브 에이전트 아키텍처**: 다중 에이전트 시스템을 위한 빠르고 지능형 에이전트
- **규모에 따른 컴퓨터 사용**: 비용 효율적인 자율 데스크톱 및 브라우저 자동화
- **속도가 필요한 작업**: 최고 수준의 성능에 가까운 지능을 유지하면서 낮은 지연 시간이 중요할 때

### 확장 사고 권장 사항

Claude 4 모델, 특히 Sonnet 및 Haiku 4.5는 코딩 및 복잡한 추론 작업에 [확장 사고](/docs/ko/build-with-claude/extended-thinking)를 사용할 때 상당한 성능 개선을 보여줍니다. 확장 사고는 **기본적으로 비활성화**되지만 까다로운 작업에 대해 활성화하는 것을 권장합니다.

**중요**: 확장 사고는 [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching#caching-with-thinking-blocks) 효율성에 영향을 미칩니다. 비도구 결과 콘텐츠가 대화에 추가되면 사고 블록이 캐시에서 제거되어 다중 턴 대화에서 비용이 증가할 수 있습니다. 성능 이점이 캐싱 트레이드오프를 능가할 때 사고를 활성화하는 것을 권장합니다.

## 기타 마이그레이션 시나리오

위에서 다룬 주요 마이그레이션 경로 (Sonnet 3.7 → 4.5 및 Haiku 3.5 → 4.5)는 가장 일반적인 업그레이드를 나타냅니다. 그러나 다른 Claude 모델에서 Claude 4.5로 마이그레이션할 수 있습니다. 이 섹션에서는 이러한 시나리오를 다룹니다.

### Claude Sonnet 4 → Sonnet 4.5에서 마이그레이션

**주요 변경**: 동일한 요청에서 `temperature`와 `top_p`를 모두 지정할 수 없습니다.

다른 모든 API 호출은 수정 없이 작동합니다. 모델 ID를 업데이트하고 필요한 경우 샘플링 매개변수를 조정합니다:

```python
# Before (Claude Sonnet 4)
model="claude-sonnet-4-20250514"

# After (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

### Claude Opus 4.1 → Sonnet 4.5에서 마이그레이션

**주요 변경 사항 없음.** 모든 API 호출은 수정 없이 작동합니다.

모델 ID만 업데이트합니다:

```python
# Before (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# After (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

Claude Sonnet 4.5는 최고 수준의 추론, 코딩 및 장시간 실행 에이전트 기능을 갖춘 가장 지능형 모델입니다. 대부분의 사용 사례에서 Opus 4.1과 비교하여 우수한 성능을 제공합니다.

### Claude Opus 4.1 → Opus 4.5에서 마이그레이션

**주요 변경 사항 없음.** 모든 API 호출은 수정 없이 작동합니다.

모델 ID만 업데이트합니다:

```python
# Before (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# After (Claude Opus 4.5)
model="claude-opus-4-5-20251101"
```

Claude Opus 4.5는 최대 기능과 실용적인 성능을 결합한 가장 지능형 모델입니다. 비전, 코딩 및 컴퓨터 사용에서 단계적 개선을 특징으로 하며 Opus 4.1보다 더 접근 가능한 가격대입니다. 복잡한 전문 작업 및 전문 소프트웨어 엔지니어링에 이상적입니다.

<Note>
많은 모델 참조가 있는 코드베이스의 경우 [Claude Code 플러그인](https://github.com/anthropics/claude-code/tree/main/plugins/claude-opus-4-5-migration)을 사용하여 Opus 4.5로의 마이그레이션을 자동화할 수 있습니다.
</Note>

### Claude 4.5 모델 간 마이그레이션

**주요 변경 사항 없음.** 모든 API 호출은 수정 없이 작동합니다.

모델 ID만 업데이트합니다.

## 도움이 필요하신가요?

- 자세한 사양은 [API 설명서](/docs/ko/api/overview)를 확인하세요
- 성능 비교는 [모델 기능](/docs/ko/about-claude/models/overview)을 검토하세요
- API 업데이트는 [API 릴리스 노트](/docs/ko/release-notes/api)를 검토하세요
- 마이그레이션 중에 문제가 발생하면 지원팀에 문의하세요