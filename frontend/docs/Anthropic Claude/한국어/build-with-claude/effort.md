# 노력(Effort)

노력 매개변수를 사용하여 Claude가 응답할 때 사용하는 토큰 수를 제어하고, 응답의 완전성과 토큰 효율성 사이의 균형을 조절합니다.

---

노력 매개변수를 사용하면 요청에 응답할 때 Claude가 토큰을 사용하는 데 얼마나 적극적인지를 제어할 수 있습니다. 이를 통해 단일 모델로 응답의 완전성과 토큰 효율성 사이의 균형을 조절할 수 있습니다.

<Note>
  노력 매개변수는 현재 베타 버전이며 Claude Opus 4.5에서만 지원됩니다.

  이 기능을 사용할 때는 [베타 헤더](/docs/ko/api/beta-headers) `effort-2025-11-24`를 포함해야 합니다.
</Note>

## 노력 매개변수의 작동 방식

기본적으로 Claude는 최대 노력을 사용합니다. 즉, 최고의 결과를 위해 필요한 만큼 많은 토큰을 사용합니다. 노력 수준을 낮추면 Claude가 토큰 사용을 더 보수적으로 하도록 지시하여 속도와 비용을 최적화하면서 기능의 일부 감소를 수용할 수 있습니다.

<Tip>
`effort`를 `"high"`로 설정하면 `effort` 매개변수를 생략한 것과 정확히 동일한 동작을 합니다.
</Tip>

노력 매개변수는 다음을 포함한 **모든 토큰**에 영향을 미칩니다:

- 텍스트 응답 및 설명
- 도구 호출 및 함수 인수
- 확장 사고(활성화된 경우)

이 접근 방식에는 두 가지 주요 장점이 있습니다:

1. 사용하기 위해 사고를 활성화할 필요가 없습니다.
2. 도구 호출을 포함한 모든 토큰 지출에 영향을 미칠 수 있습니다. 예를 들어, 낮은 노력은 Claude가 더 적은 도구 호출을 수행한다는 의미입니다. 이는 효율성에 대한 훨씬 더 큰 제어 수준을 제공합니다.

### 노력 수준

| 수준     | 설명                                                                                                                      | 일반적인 사용 사례                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `high`   | 최대 기능. Claude는 최고의 결과를 위해 필요한 만큼 많은 토큰을 사용합니다. 매개변수를 설정하지 않은 것과 동일합니다.  | 복잡한 추론, 어려운 코딩 문제, 에이전트 작업                           |
| `medium` | 적당한 토큰 절감을 포함한 균형 잡힌 접근 방식. | 속도, 비용 및 성능의 균형이 필요한 에이전트 작업                                                         |
| `low`    | 가장 효율적입니다. 기능 감소를 수반하는 상당한 토큰 절감. | 최고의 속도와 최저 비용이 필요한 더 간단한 작업(예: 서브에이전트)                     |

## 기본 사용법

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Analyze the trade-offs between microservices and monolithic architectures"
    }],
    output_config={
        "effort": "medium"
    }
)

print(response.content[0].text)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: "claude-opus-4-5-20251101",
  betas: ["effort-2025-11-24"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Analyze the trade-offs between microservices and monolithic architectures"
  }],
  output_config: {
    effort: "medium"
  }
});

console.log(response.content[0].text);
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: effort-2025-11-24" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-opus-4-5-20251101",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures"
        }],
        "output_config": {
            "effort": "medium"
        }
    }'
```

</CodeGroup>

## 노력 매개변수를 언제 조정해야 하나요?

- Claude의 최고의 작업이 필요할 때 **높은 노력**(기본값)을 사용하세요. 복잡한 추론, 미묘한 분석, 어려운 코딩 문제 또는 품질이 최우선인 모든 작업에 사용합니다.
- 높은 노력의 전체 토큰 지출 없이 견고한 성능을 원할 때 **중간 노력**을 균형 잡힌 옵션으로 사용하세요.
- 속도(Claude가 더 적은 토큰으로 응답하기 때문)나 비용을 최적화할 때 **낮은 노력**을 사용하세요. 예를 들어, 간단한 분류 작업, 빠른 조회 또는 한계 품질 개선이 추가 지연이나 비용을 정당화하지 않는 대량 사용 사례에 사용합니다.

## 도구 사용과 함께 노력 매개변수

도구를 사용할 때 노력 매개변수는 도구 호출 주변의 설명과 도구 호출 자체 모두에 영향을 미칩니다. 낮은 노력 수준은 다음과 같은 경향이 있습니다:

- 여러 작업을 더 적은 도구 호출로 결합
- 더 적은 도구 호출 수행
- 전문 용어 없이 직접 작업으로 진행
- 완료 후 간결한 확인 메시지 사용

높은 노력 수준은 다음과 같을 수 있습니다:

- 더 많은 도구 호출 수행
- 작업을 수행하기 전에 계획 설명
- 변경 사항에 대한 상세한 요약 제공
- 더 포괄적인 코드 주석 포함

## 확장 사고와 함께 노력 매개변수

노력 매개변수는 확장 사고가 활성화되었을 때 사고 토큰 예산과 함께 작동합니다. 이 두 가지 제어는 다른 목적을 제공합니다:

- **노력 매개변수**: Claude가 모든 토큰(사고 토큰, 텍스트 응답 및 도구 호출 포함)을 어떻게 사용하는지 제어합니다.
- **사고 토큰 예산**: 특히 사고 토큰에 대한 최대 제한을 설정합니다.

노력 매개변수는 확장 사고 활성화 여부와 관계없이 사용할 수 있습니다. 둘 다 구성된 경우:

1. 먼저 작업에 적절한 노력 수준을 결정합니다.
2. 그런 다음 작업 복잡도에 따라 사고 토큰 예산을 설정합니다.

복잡한 추론 작업에서 최고의 성능을 위해 높은 노력(기본값)을 높은 사고 토큰 예산과 함께 사용하세요. 이를 통해 Claude가 철저히 생각하고 포괄적인 응답을 제공할 수 있습니다.

## 모범 사례

1. **높은 수준부터 시작하세요**: 낮은 노력 수준을 사용하여 성능을 토큰 효율성으로 교환합니다.
2. **속도에 민감하거나 간단한 작업에 낮은 노력을 사용하세요**: 지연 시간이 중요하거나 작업이 간단할 때 낮은 노력은 응답 시간과 비용을 크게 줄일 수 있습니다.
3. **사용 사례를 테스트하세요**: 노력 수준의 영향은 작업 유형에 따라 다릅니다. 배포하기 전에 특정 사용 사례에서 성능을 평가하세요.
4. **동적 노력을 고려하세요**: 작업 복잡도에 따라 노력을 조정합니다. 간단한 쿼리는 낮은 노력을 보증할 수 있지만 에이전트 코딩 및 복잡한 추론은 높은 노력의 이점을 얻습니다.