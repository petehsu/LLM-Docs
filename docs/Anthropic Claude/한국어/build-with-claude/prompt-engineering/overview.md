# 프롬프트 엔지니어링 개요

프롬프트 엔지니어링 기법을 사용하여 Claude의 성능을 최적화하는 방법을 알아봅니다.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

## 프롬프트 엔지니어링 전에

이 가이드는 다음을 가정합니다:
1. 사용 사례에 대한 명확한 성공 기준 정의
2. 해당 기준에 대해 경험적으로 테스트할 수 있는 방법
3. 개선하고 싶은 첫 번째 초안 프롬프트

그렇지 않다면, 먼저 그것을 설정하는 데 시간을 투자할 것을 강력히 권장합니다. [성공 기준 정의](/docs/ko/test-and-evaluate/define-success) 및 [강력한 경험적 평가 만들기](/docs/ko/test-and-evaluate/develop-tests)에서 팁과 지침을 확인하세요.

<Card title="프롬프트 생성기" icon="link" href="/dashboard">
  첫 번째 초안 프롬프트가 없으신가요? Claude 콘솔에서 프롬프트 생성기를 시도해보세요!
</Card>

***

## 프롬프트 엔지니어링을 해야 할 때

  이 가이드는 프롬프트 엔지니어링을 통해 제어할 수 있는 성공 기준에 중점을 둡니다.
  모든 성공 기준이나 실패한 평가가 프롬프트 엔지니어링으로 가장 잘 해결되는 것은 아닙니다. 예를 들어, 지연 시간과 비용은 때때로 다른 모델을 선택하여 더 쉽게 개선할 수 있습니다.

<section title="프롬프팅 vs. 파인튜닝">

  프롬프트 엔지니어링은 파인튜닝과 같은 다른 모델 동작 제어 방법보다 훨씬 빠르며, 훨씬 짧은 시간에 성능의 비약적인 향상을 가져올 수 있습니다. 파인튜닝보다 프롬프트 엔지니어링을 고려해야 할 이유는 다음과 같습니다:<br/>
  - **리소스 효율성**: 파인튜닝은 고사양 GPU와 대용량 메모리가 필요하지만, 프롬프트 엔지니어링은 텍스트 입력만 필요하므로 훨씬 더 리소스 친화적입니다.
  - **비용 효율성**: 클라우드 기반 AI 서비스의 경우, 파인튜닝은 상당한 비용이 발생합니다. 프롬프트 엔지니어링은 기본 모델을 사용하므로 일반적으로 더 저렴합니다.
  - **모델 업데이트 유지**: 제공자가 모델을 업데이트할 때, 파인튜닝된 버전은 재학습이 필요할 수 있습니다. 프롬프트는 일반적으로 변경 없이 버전 간에 작동합니다.
  - **시간 절약**: 파인튜닝은 몇 시간 또는 며칠이 걸릴 수 있습니다. 반면 프롬프트 엔지니어링은 거의 즉각적인 결과를 제공하여 빠른 문제 해결이 가능합니다.
  - **최소한의 데이터 필요**: 파인튜닝은 상당한 양의 작업별 레이블이 지정된 데이터가 필요하며, 이는 부족하거나 비쌀 수 있습니다. 프롬프트 엔지니어링은 소수 샷 또는 제로 샷 학습으로도 작동합니다.
  - **유연성 및 빠른 반복**: 다양한 접근 방식을 빠르게 시도하고, 프롬프트를 조정하고, 즉시 결과를 확인하세요. 이러한 빠른 실험은 파인튜닝으로는 어렵습니다.
  - **도메인 적응**: 재학습 없이 프롬프트에 도메인별 컨텍스트를 제공하여 모델을 새로운 도메인에 쉽게 적응시킵니다.
  - **이해도 개선**: 프롬프트 엔지니어링은 검색된 문서와 같은 외부 콘텐츠를 모델이 더 잘 이해하고 활용하도록 돕는 데 파인튜닝보다 훨씬 더 효과적입니다.
  - **일반 지식 보존**: 파인튜닝은 모델이 일반 지식을 잃는 재앙적 망각의 위험이 있습니다. 프롬프트 엔지니어링은 모델의 광범위한 기능을 유지합니다.
  - **투명성**: 프롬프트는 인간이 읽을 수 있으므로 모델이 받는 정보를 정확히 보여줍니다. 이러한 투명성은 이해 및 디버깅에 도움이 됩니다.

</section>

***

## 프롬프트 엔지니어링 방법

이 섹션의 프롬프트 엔지니어링 페이지는 가장 광범위하게 효과적인 기법부터 더 전문화된 기법까지 정렬되어 있습니다. 성능 문제를 해결할 때, 이 기법들을 순서대로 시도할 것을 권장하지만, 각 기법의 실제 영향은 사용 사례에 따라 달라질 것입니다.
1. [프롬프트 생성기](/docs/ko/build-with-claude/prompt-engineering/prompt-generator)
2. [명확하고 직접적으로](/docs/ko/build-with-claude/prompt-engineering/be-clear-and-direct)
3. [예제 사용 (멀티샷)](/docs/ko/build-with-claude/prompt-engineering/multishot-prompting)
4. [Claude가 생각하도록 하기 (사고의 연쇄)](/docs/ko/build-with-claude/prompt-engineering/chain-of-thought)
5. [XML 태그 사용](/docs/ko/build-with-claude/prompt-engineering/use-xml-tags)
6. [Claude에게 역할 부여 (시스템 프롬프트)](/docs/ko/build-with-claude/prompt-engineering/system-prompts)
7. [Claude의 응답 미리 채우기](/docs/ko/build-with-claude/prompt-engineering/prefill-claudes-response)
8. [복잡한 프롬프트 연결](/docs/ko/build-with-claude/prompt-engineering/chain-prompts)
9. [긴 컨텍스트 팁](/docs/ko/build-with-claude/prompt-engineering/long-context-tips)

***

## 프롬프트 엔지니어링 튜토리얼

대화형 학습자라면, 대신 대화형 튜토리얼에 바로 뛰어들 수 있습니다!

<CardGroup cols={2}>
  <Card title="GitHub 프롬프팅 튜토리얼" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    문서에서 찾을 수 있는 프롬프트 엔지니어링 개념을 다루는 예제가 풍부한 튜토리얼입니다.
  </Card>
  <Card title="Google Sheets 프롬프팅 튜토리얼" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    대화형 스프레드시트를 통한 프롬프트 엔지니어링 튜토리얼의 더 가벼운 버전입니다.
  </Card>
</CardGroup>