# Советы по работе с длинным контекстом

Советы по эффективному использованию расширенного контекстного окна Claude для обработки сложных задач с большим объемом данных.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Расширенное контекстное окно Claude (200K токенов для моделей Claude 3) позволяет обрабатывать сложные задачи, богатые данными. Это руководство поможет вам эффективно использовать эту мощь.

## Основные советы для промптов с длинным контекстом

- **Размещайте длинные данные в начале**: Поместите ваши длинные документы и входные данные (~20K+ токенов) в начало вашего промпта, выше вашего запроса, инструкций и примеров. Это может значительно улучшить производительность Claude во всех моделях.

    <Note>Запросы в конце могут улучшить качество ответа на 30% в тестах, особенно со сложными многодокументными входными данными.</Note>

- **Структурируйте содержимое документа и метаданные с помощью XML-тегов**: При использовании нескольких документов оберните каждый документ в теги `<document>` с подтегами `<document_content>` и `<source>` (и другие метаданные) для ясности.

    <section title="Пример структуры многодокументного формата">

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

    Analyze the annual report and competitor analysis. Identify strategic advantages and recommend Q3 focus areas.
    ```
    
</section>

- **Основывайте ответы на цитатах**: Для задач с длинными документами попросите Claude сначала привести соответствующие части документов в виде цитат, прежде чем выполнять свою задачу. Это помогает Claude пробиться сквозь "шум" остального содержимого документа.

    <section title="Пример извлечения цитат">

    ```xml
    You are an AI physician's assistant. Your task is to help doctors diagnose possible patient illnesses.

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

    Find quotes from the patient records and appointment history that are relevant to diagnosing the patient's reported symptoms. Place these in <quotes> tags. Then, based on these quotes, list all information that would help the doctor diagnose the patient's symptoms. Place your diagnostic information in <info> tags.
    ```
    
</section>

***

<CardGroup cols={3}>
  <Card title="Библиотека промптов" icon="link" href="/docs/ru/resources/prompt-library/library">
    Вдохновитесь подобранной коллекцией промптов для различных задач и вариантов использования.
  </Card>
  <Card title="Учебник по промптингу на GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Учебник, наполненный примерами, который охватывает концепции инженерии промптов, найденные в нашей документации.
  </Card>
  <Card title="Учебник по промптингу в Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Облегченная версия нашего учебника по инженерии промптов через интерактивную электронную таблицу.
  </Card>
</CardGroup>