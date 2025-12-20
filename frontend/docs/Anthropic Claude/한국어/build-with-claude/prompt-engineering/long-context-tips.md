# 긴 컨텍스트 프롬프팅 팁

Claude의 확장된 컨텍스트 윈도우를 효과적으로 활용하기 위한 필수 팁과 모범 사례

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Claude의 확장된 컨텍스트 윈도우(Claude 3 모델의 경우 200K 토큰)는 복잡하고 데이터가 풍부한 작업을 처리할 수 있게 해줍니다. 이 가이드는 이러한 강력한 기능을 효과적으로 활용하는 데 도움이 될 것입니다.

## 긴 컨텍스트 프롬프트의 필수 팁

- **긴 형식의 데이터를 맨 위에 배치**: 긴 문서와 입력(약 20K+ 토큰)을 프롬프트의 맨 위에, 쿼리, 지시사항 및 예제 위에 배치하세요. 이는 모든 모델에서 Claude의 성능을 크게 향상시킬 수 있습니다.

    <Note>테스트에서 끝에 있는 쿼리는 응답 품질을 최대 30%까지 개선할 수 있으며, 특히 복잡한 다중 문서 입력의 경우 더욱 그렇습니다.</Note>

- **XML 태그로 문서 콘텐츠 및 메타데이터 구조화**: 여러 문서를 사용할 때 각 문서를 `<document>` 태그로 감싸고 명확성을 위해 `<document_content>` 및 `<source>`(및 기타 메타데이터) 하위 태그를 사용하세요.

    <section title="다중 문서 구조 예제">

    ```xml
    <documents>
      <document index="1">
        <source>annual_report_2023.pdf</source>
        <document_content>
          {{ANNUAL_REPORT}}
        </document_content>
      </document>
      <document index="2">
        <source>competitor_analysis_q2.xlsx</source>
        <document_content>
          {{COMPETITOR_ANALYSIS}}
        </document_content>
      </document>
    </documents>

    연간 보고서와 경쟁사 분석을 분석하세요. 전략적 이점을 파악하고 Q3 초점 영역을 추천하세요.
    ```
    
</section>

- **인용문으로 응답 근거 제시**: 긴 문서 작업의 경우 Claude에게 작업을 수행하기 전에 먼저 문서의 관련 부분을 인용하도록 요청하세요. 이는 Claude가 문서의 나머지 콘텐츠의 "노이즈"를 제거하는 데 도움이 됩니다.

    <section title="인용문 추출 예제">

    ```xml
    당신은 AI 의사 보조입니다. 당신의 작업은 의사들이 가능한 환자 질병을 진단하도록 돕는 것입니다.

    <documents>
      <document index="1">
        <source>patient_symptoms.txt</source>
        <document_content>
          {{PATIENT_SYMPTOMS}}
        </document_content>
      </document>
      <document index="2">
        <source>patient_records.txt</source>
        <document_content>
          {{PATIENT_RECORDS}}
        </document_content>
      </document>
      <document index="3">
        <source>patient01_appt_history.txt</source>
        <document_content>
          {{PATIENT01_APPOINTMENT_HISTORY}}
        </document_content>
      </document>
    </documents>

    환자의 보고된 증상 진단과 관련된 환자 기록 및 진료 이력에서 인용문을 찾으세요. 이를 <quotes> 태그에 배치하세요. 그런 다음 이러한 인용문을 기반으로 의사가 환자의 증상을 진단하는 데 도움이 될 모든 정보를 나열하세요. 진단 정보를 <info> 태그에 배치하세요.
    ```
    
</section>

***

<CardGroup cols={3}>
  <Card title="프롬프트 라이브러리" icon="link" href="/docs/ko/resources/prompt-library/library">
    다양한 작업 및 사용 사례를 위한 엄선된 프롬프트 선택으로 영감을 얻으세요.
  </Card>
  <Card title="GitHub 프롬프팅 튜토리얼" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    우리 문서에서 찾을 수 있는 프롬프트 엔지니어링 개념을 다루는 예제가 풍부한 튜토리얼입니다.
  </Card>
  <Card title="Google Sheets 프롬프팅 튜토리얼" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    대화형 스프레드시트를 통한 프롬프트 엔지니어링 튜토리얼의 더 가벼운 버전입니다.
  </Card>
</CardGroup>