# Используйте примеры (многошаговое промптирование) для управления поведением Claude

Узнайте, как использовать примеры и многошаговое промптирование для улучшения точности и согласованности ответов Claude.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Примеры — это ваше секретное оружие для получения от Claude именно того, что вам нужно. Предоставляя несколько хорошо продуманных примеров в вашем промпте, вы можете драматически улучшить точность, согласованность и качество выходных данных Claude.
Эта техника, известная как few-shot или многошаговое промптирование, особенно эффективна для задач, требующих структурированных выходных данных или соответствия определённым форматам.

<Tip>**Усильте ваши промпты**: Включите 3-5 разнообразных, релевантных примеров, чтобы показать Claude именно то, что вам нужно. Больше примеров = лучшая производительность, особенно для сложных задач.</Tip>

## Почему использовать примеры?

- **Точность**: Примеры снижают неправильное толкование инструкций.
- **Согласованность**: Примеры обеспечивают единообразную структуру и стиль.
- **Производительность**: Хорошо подобранные примеры повышают способность Claude справляться со сложными задачами.

## Создание эффективных примеров

Для максимальной эффективности убедитесь, что ваши примеры:
- **Релевантны**: Ваши примеры отражают ваш реальный случай использования.
- **Разнообразны**: Ваши примеры охватывают граничные случаи и потенциальные проблемы, и достаточно различаются, чтобы Claude не случайно не подхватил непредусмотренные закономерности.
- **Ясны**: Ваши примеры обёрнуты в теги `<example>` (если несколько, вложены в теги `<examples>`) для структуры.

<Tip>Попросите Claude оценить ваши примеры на релевантность, разнообразие или ясность. Или попросите Claude создать больше примеров на основе вашего исходного набора.</Tip>
<section title="Пример: Анализ отзывов клиентов">

    Обратите внимание, что в версии "без примеров" Claude не перечисляет несколько вариантов для каждой категории, несмотря на то, что его письменный анализ указывает на то, что есть несколько категорий для определённых отзывов. Он также включает длинное объяснение, когда мы можем этого не хотеть.

    | Роль | Без примеров | С примерами |
    | --- | --- | --- |
    | Пользователь | Проанализируйте этот отзыв клиента и категоризируйте проблемы. Используйте эти категории: UI/UX, Performance, Feature Request, Integration, Pricing и Other. Также оцените настроение (Positive/Neutral/Negative) и приоритет (High/Medium/Low).<br/><br/>Вот отзыв: \{\{FEEDBACK\}\} | Наша команда CS перегружена неструктурированными отзывами. Ваша задача — анализировать отзывы и категоризировать проблемы для наших команд продукта и инженерии. Используйте эти категории: UI/UX, Performance, Feature Request, Integration, Pricing и Other. Также оцените настроение (Positive/Neutral/Negative) и приоритет (High/Medium/Low). Вот пример:<br/><br/>\<example><br/>Input: The new dashboard is a mess! It takes forever to load, and I can't find the export button. Fix this ASAP!<br/>Category: UI/UX, Performance<br/>Sentiment: Negative<br/>Priority: High\</example><br/><br/>Теперь проанализируйте этот отзыв: \{\{FEEDBACK\}\} |
    | Ассистент (ответ Claude) | Вот анализ отзыва клиента:<br/><br/>Issue: UI/UX<br/>Sentiment: Negative<br/>Priority: High<br/>Клиент разочарован новым дизайном панели управления, который он считает загромождённым и медленно загружающимся. Он специально указывает на отсутствующую кнопку "export", которая, вероятно, является критической функцией. Эта проблема должна быть решена с высоким приоритетом.<br/><br/>Issue: Integration<br/>Sentiment: Positive<br/>Priority: Medium<br/>Клиент доволен существующей интеграцией Salesforce, но хотел бы видеть поддержку Hubspot. Это запрос функции, который можно рассмотреть для будущего обновления продукта.<br/><br/>Issue: Pricing<br/>Sentiment: Negative<br/>Priority: High<br/>Клиент считает цены неразумными, особенно для базовых функций. Он угрожает перейти к конкуренту, поэтому это проблема с высоким приоритетом, которая требует пересмотра.<br/><br/>Issue: Performance<br/>Sentiment Negative<br/>Priority: High<br/>Клиент испытывает критические проблемы с мобильным приложением, где загрузка больших файлов постоянно приводит к сбоям. Это серьёзная проблема, которая влияет на способность клиента эффективно использовать продукт, и должна быть решена с высоким приоритетом.<br/><br/>Issue: UI/UX<br/>Sentiment: Positive<br/>Priority: Low<br/>Клиент в целом доволен продуктом, особенно отмечая интуитивный интерфейс и отличную поддержку клиентов. Это положительный отзыв, который не требует немедленных действий. | Вот анализ отзыва клиента:<br/><br/>1. The new dashboard is a mess! It takes forever to load, and I can't find the export button. Fix this ASAP!<br/>Category: UI/UX, Performance<br/>Sentiment: Negative<br/>Priority: High<br/><br/>2. Love the Salesforce integration! But it'd be great if you could add Hubspot too.<br/>Category: Integration, Feature Request<br/>Sentiment: Positive<br/>Priority: Medium<br/><br/>3. Your pricing is ridiculous! $99/mo for basic features? I'm switching to Competitor X.<br/>Category: Pricing<br/>Sentiment: Negative<br/>Priority: High<br/><br/>4. The mobile app keeps crashing when I try to upload large files (>50MB). This is critical for our field agents.<br/>Category: Performance<br/>Sentiment: Negative<br/>Priority: High<br/><br/>5. Overall, I'm happy with the product. The UI is intuitive, and the customer support is top-notch. Keep it up!<br/>Category: UI/UX, Other (Customer Support)<br/>Sentiment: Positive<br/>Priority: Low |

</section>

***

<CardGroup cols={3}>
  <Card title="Библиотека промптов" icon="link" href="/docs/ru/resources/prompt-library/library">
    Вдохновитесь тщательно подобранной коллекцией промптов для различных задач и случаев использования.
  </Card>
  <Card title="Учебник по промптированию на GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Полный учебник с примерами, охватывающий концепции инженерии промптов, найденные в нашей документации.
  </Card>
  <Card title="Учебник по промптированию в Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Облегчённая версия нашего учебника по инженерии промптов через интерактивную электронную таблицу.
  </Card>
</CardGroup>