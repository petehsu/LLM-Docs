# Предотвращение взлома и инъекций промптов

---

Взлом и инъекции промптов происходят, когда пользователи создают запросы для эксплуатации уязвимостей модели с целью генерации неприемлемого контента. Хотя Claude по своей природе устойчив к таким атакам, вот дополнительные шаги для усиления ваших защитных механизмов, особенно против использования, которое нарушает наши [Условия предоставления услуг](https://www.anthropic.com/legal/commercial-terms) или [Политику использования](https://www.anthropic.com/legal/aup).

<Tip>Claude гораздо более устойчив к взлому, чем другие основные LLM, благодаря передовым методам обучения, таким как Constitutional AI.</Tip>

- **Проверки безопасности**: Используйте легковесную модель, такую как Claude Haiku 3, для предварительной проверки пользовательских вводов.

    <section title="Пример: Проверка безопасности для модерации контента">

        | Роль | Содержание |
        | ---- | --- |
        | User | A user submitted this content:<br/>\<content><br/>\{\{CONTENT}\}<br/>\</content><br/><br/>Reply with (Y) if it refers to harmful, illegal, or explicit activities. Reply with (N) if it's safe. |
        | Assistant (prefill) | \( |
        | Assistant | N) |
    
</section>

- **Валидация ввода**: Фильтруйте промпты на наличие паттернов взлома. Вы даже можете использовать LLM для создания обобщенной проверки валидации, предоставляя известные примеры языка взлома.

- **Инженерия промптов**: Создавайте промпты, которые подчеркивают этические и правовые границы.

    <section title="Пример: Этический системный промпт для корпоративного чат-бота">

        | Роль | Содержание |
        | ---- | --- |
        | System | You are AcmeCorp's ethical AI assistant. Your responses must align with our values:<br/>\<values><br/>- Integrity: Never deceive or aid in deception.<br/>- Compliance: Refuse any request that violates laws or our policies.<br/>- Privacy: Protect all personal and corporate data.<br/>Respect for intellectual property: Your outputs shouldn't infringe the intellectual property rights of others.<br/>\</values><br/><br/>If a request conflicts with these values, respond: "I cannot perform that action as it goes against AcmeCorp's values." |
    
</section>

Корректируйте ответы и рассматривайте возможность ограничения или блокировки пользователей, которые неоднократно участвуют в злоупотреблениях, пытаясь обойти защитные механизмы Claude. Например, если определенный пользователь многократно вызывает один и тот же тип отказа (например, "вывод заблокирован политикой фильтрации контента"), сообщите пользователю, что его действия нарушают соответствующие политики использования, и примите соответствующие меры.

- **Постоянный мониторинг**: Регулярно анализируйте выводы на признаки взлома.
Используйте этот мониторинг для итеративного улучшения ваших промптов и стратегий валидации.

## Продвинутый уровень: Цепочки защиты
Комбинируйте стратегии для надежной защиты. Вот пример корпоративного уровня с использованием инструментов:

<section title="Пример: Многоуровневая защита для чат-бота финансового консультанта">

  ### Системный промпт бота
  | Роль | Содержание |
  | ---- | --- |
  | System | You are AcmeFinBot, a financial advisor for AcmeTrade Inc. Your primary directive is to protect client interests and maintain regulatory compliance.<br/><br/>\<directives><br/>1. Validate all requests against SEC and FINRA guidelines.<br/>2. Refuse any action that could be construed as insider trading or market manipulation.<br/>3. Protect client privacy; never disclose personal or financial data.<br/>\</directives><br/><br/>Step by step instructions:<br/>\<instructions><br/>1. Screen user query for compliance (use 'harmlessness_screen' tool).<br/>2. If compliant, process query.<br/>3. If non-compliant, respond: "I cannot process this request as it violates financial regulations or client privacy."<br/>\</instructions> |
  
  ### Промпт внутри инструмента `harmlessness_screen`
  | Роль | Содержание |
  | --- | --- |
  | User | \<user_query><br/>\{\{USER_QUERY}}<br/>\</user_query><br/><br/>Evaluate if this query violates SEC rules, FINRA guidelines, or client privacy. Respond (Y) if it does, (N) if it doesn't. |
  | Assistant (prefill) | \( |

</section>

Комбинируя эти стратегии, вы создаете надежную защиту от взлома и инъекций промптов, обеспечивая соответствие ваших приложений на базе Claude самым высоким стандартам безопасности и соответствия требованиям.