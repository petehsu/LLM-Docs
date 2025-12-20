# Обзор моделей

Claude — это семейство передовых больших языковых моделей, разработанных Anthropic. Это руководство представляет наши модели и сравнивает их производительность.

---

## Выбор модели

Если вы не уверены, какую модель использовать, мы рекомендуем начать с **Claude Sonnet 4.5**. Она предлагает лучший баланс интеллекта, скорости и стоимости для большинства случаев использования с исключительной производительностью в задачах кодирования и агентных операциях.

Все текущие модели Claude поддерживают текстовый и графический ввод, текстовый вывод, многоязычные возможности и зрение. Модели доступны через API Anthropic, AWS Bedrock и Google Vertex AI.

После выбора модели [узнайте, как сделать ваш первый вызов API](/docs/ru/get-started).

### Сравнение последних моделей

| Функция | Claude Sonnet 4.5 | Claude Haiku 4.5 | Claude Opus 4.5 |
|:--------|:------------------|:-----------------|:----------------|
| **Описание** | Наша умная модель для сложных агентов и кодирования | Наша самая быстрая модель с близкой к передовой интеллектуальностью | Премиум-модель, сочетающая максимальный интеллект с практической производительностью |
| **Claude API ID** | claude-sonnet-4-5-20250929 | claude-haiku-4-5-20251001 | claude-opus-4-5-20251101 |
| **Claude API alias**<sup>1</sup> | claude-sonnet-4-5 | claude-haiku-4-5 | claude-opus-4-5 |
| **AWS Bedrock ID** | anthropic.claude-sonnet-4-5-20250929-v1:0 | anthropic.claude-haiku-4-5-20251001-v1:0 | anthropic.claude-opus-4-5-20251101-v1:0 |
| **GCP Vertex AI ID** | claude-sonnet-4-5@20250929 | claude-haiku-4-5@20251001 | claude-opus-4-5@20251101 |
| **Цены**<sup>2</sup> | \$3 / input MTok<br/>\$15 / output MTok | \$1 / input MTok<br/>\$5 / output MTok | \$5 / input MTok<br/>\$25 / output MTok |
| **[Расширенное мышление](/docs/ru/build-with-claude/extended-thinking)** | Да | Да | Да |
| **[Приоритетный уровень](/docs/ru/api/service-tiers)** | Да | Да | Да |
| **Сравнительная задержка** | Быстро | Самая быстрая | Умеренно |
| **Контекстное окно** | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> / <br/> <Tooltip tooltipContent="~750K words \ ~3.4M unicode characters">1M tokens</Tooltip> (beta)<sup>3</sup> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> |
| **Максимальный вывод** | 64K tokens | 64K tokens | 64K tokens |
| **Надежная дата знаний** | Jan 2025<sup>4</sup> | Feb 2025 | May 2025<sup>4</sup> |
| **Дата отсечки данных обучения** | Jul 2025 | Jul 2025 | Aug 2025 |

_<sup>1 - Aliases автоматически указывают на самый последний снимок модели. Когда мы выпускаем новые снимки моделей, мы переводим aliases на указание на новейшую версию модели, обычно в течение недели после нового выпуска. Хотя aliases полезны для экспериментов, мы рекомендуем использовать конкретные версии моделей (например, `claude-sonnet-4-5-20250929`) в производственных приложениях для обеспечения согласованного поведения.</sup>_

_<sup>2 - См. нашу [страницу цен](/docs/ru/about-claude/pricing) для получения полной информации о ценах, включая скидки API пакетной обработки, ставки кэширования подсказок, затраты на расширенное мышление и сборы за обработку видения.</sup>_

_<sup>3 - Claude Sonnet 4.5 поддерживает [контекстное окно в 1M токенов](/docs/ru/build-with-claude/context-windows#1m-token-context-window) при использовании заголовка beta `context-1m-2025-08-07`. [Цены на длинный контекст](/docs/ru/about-claude/pricing#long-context-pricing) применяются к запросам, превышающим 200K токенов.</sup>_

_<sup>4 - **Надежная дата знаний** указывает дату, до которой знания модели наиболее обширны и надежны. **Дата отсечки данных обучения** — это более широкий диапазон дат данных обучения, используемых. Например, Claude Sonnet 4.5 была обучена на общедоступной информации до июля 2025 года, но ее знания наиболее обширны и надежны до января 2025 года. Для получения дополнительной информации см. [Transparency Hub Anthropic](https://www.anthropic.com/transparency).</sup>_

<Note>Модели с одинаковой датой снимка (например, 20240620) идентичны на всех платформах и не изменяются. Дата снимка в названии модели обеспечивает согласованность и позволяет разработчикам полагаться на стабильную производительность в разных средах.</Note>

<Note>Начиная с **Claude Sonnet 4.5 и всех будущих моделей**, AWS Bedrock и Google Vertex AI предлагают два типа конечных точек: **глобальные конечные точки** (динамическая маршрутизация для максимальной доступности) и **региональные конечные точки** (гарантированная маршрутизация данных через определенные географические регионы). Для получения дополнительной информации см. [раздел цен третьих сторон](/docs/ru/about-claude/pricing#third-party-platform-pricing).</Note>

<section title="Устаревшие модели">

Следующие модели все еще доступны, но мы рекомендуем перейти на текущие модели для улучшенной производительности:

| Функция | Claude Opus 4.1 | Claude Sonnet 4 | Claude Sonnet 3.7 | Claude Opus 4 | Claude Haiku 3.5 | Claude Haiku 3 |
|:--------|:----------------|:----------------|:------------------|:--------------|:-----------------|:---------------|
| **Claude API ID** | claude-opus-4-1-20250805 | claude-sonnet-4-20250514 | claude-3-7-sonnet-20250219 | claude-opus-4-20250514 | claude-3-5-haiku-20241022 | claude-3-haiku-20240307 |
| **Claude API alias** | claude-opus-4-1 | claude-sonnet-4-0 | claude-3-7-sonnet-latest | claude-opus-4-0 | claude-3-5-haiku-latest | — |
| **AWS Bedrock ID** | anthropic.claude-opus-4-1-20250805-v1:0 | anthropic.claude-sonnet-4-20250514-v1:0 | anthropic.claude-3-7-sonnet-20250219-v1:0 | anthropic.claude-opus-4-20250514-v1:0 | anthropic.claude-3-5-haiku-20241022-v1:0 | anthropic.claude-3-haiku-20240307-v1:0 |
| **GCP Vertex AI ID** | claude-opus-4-1@20250805 | claude-sonnet-4@20250514 | claude-3-7-sonnet@20250219 | claude-opus-4@20250514 | claude-3-5-haiku@20241022 | claude-3-haiku@20240307 |
| **Цены** | \$15 / input MTok<br/>\$75 / output MTok | \$3 / input MTok<br/>\$15 / output MTok | \$3 / input MTok<br/>\$15 / output MTok | \$15 / input MTok<br/>\$75 / output MTok | \$0.80 / input MTok<br/>\$4 / output MTok | \$0.25 / input MTok<br/>\$1.25 / output MTok |
| **[Расширенное мышление](/docs/ru/build-with-claude/extended-thinking)** | Да | Да | Да | Да | Нет | Нет |
| **[Приоритетный уровень](/docs/ru/api/service-tiers)** | Да | Да | Да | Да | Да | Нет |
| **Сравнительная задержка** | Умеренно | Быстро | Быстро | Умеренно | Самая быстрая | Быстро |
| **Контекстное окно** | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> / <br/> <Tooltip tooltipContent="~750K words \ ~3.4M unicode characters">1M tokens</Tooltip> (beta)<sup>1</sup> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~215K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> |
| **Максимальный вывод** | 32K tokens | 64K tokens | 64K tokens / 128K tokens (beta)<sup>4</sup> | 32K tokens | 8K tokens | 4K tokens |
| **Надежная дата знаний** | Jan 2025<sup>2</sup> | Jan 2025<sup>2</sup> | Oct 2024<sup>2</sup> | Jan 2025<sup>2</sup> | <sup>3</sup> | <sup>3</sup> |
| **Дата отсечки данных обучения** | Mar 2025 | Mar 2025 | Nov 2024 | Mar 2025 | Jul 2024 | Aug 2023 |

_<sup>1 - Claude Sonnet 4 поддерживает [контекстное окно в 1M токенов](/docs/ru/build-with-claude/context-windows#1m-token-context-window) при использовании заголовка beta `context-1m-2025-08-07`. [Цены на длинный контекст](/docs/ru/about-claude/pricing#long-context-pricing) применяются к запросам, превышающим 200K токенов.</sup>_

_<sup>2 - **Надежная дата знаний** указывает дату, до которой знания модели наиболее обширны и надежны. **Дата отсечки данных обучения** — это более широкий диапазон дат данных обучения, используемых.</sup>_

_<sup>3 - Некоторые модели Haiku имеют одну дату отсечки данных обучения.</sup>_

_<sup>4 - Включите заголовок beta `output-128k-2025-02-19` в ваш запрос API, чтобы увеличить максимальную длину выходного токена до 128K токенов для Claude Sonnet 3.7. Мы настоятельно рекомендуем использовать наш [потоковый Messages API](/docs/ru/build-with-claude/streaming), чтобы избежать тайм-аутов при создании более длинных выходов. Дополнительные сведения см. в нашем руководстве по [длинным запросам](/docs/ru/api/errors#long-requests).</sup>_

</section>

## Производительность подсказок и вывода

Модели Claude 4 превосходны в:
- **Производительность**: Результаты высочайшего уровня в рассуждениях, кодировании, многоязычных задачах, обработке длинного контекста, честности и обработке изображений. Дополнительную информацию см. в [блоге Claude 4](http://www.anthropic.com/news/claude-4).
- **Привлекательные ответы**: Модели Claude идеальны для приложений, требующих богатого, человекоподобного взаимодействия.

    - Если вы предпочитаете более краткие ответы, вы можете отрегулировать свои подсказки, чтобы направить модель к желаемой длине вывода. Подробности см. в наших [руководствах по инженерии подсказок](/docs/ru/build-with-claude/prompt-engineering).
    - Для конкретных лучших практик подсказок Claude 4 см. наше [руководство лучших практик Claude 4](/docs/ru/build-with-claude/prompt-engineering/claude-4-best-practices).
- **Качество вывода**: При переходе с предыдущих поколений моделей на Claude 4 вы можете заметить большие улучшения в общей производительности.

## Переход на Claude 4.5

Если вы в настоящее время используете модели Claude 3, мы рекомендуем перейти на Claude 4.5, чтобы воспользоваться улучшенным интеллектом и расширенными возможностями. Подробные инструкции по миграции см. в разделе [Переход на Claude 4.5](/docs/ru/about-claude/models/migrating-to-claude-4).

## Начните работу с Claude

Если вы готовы начать изучение того, что Claude может сделать для вас, давайте начнем! Независимо от того, являетесь ли вы разработчиком, желающим интегрировать Claude в свои приложения, или пользователем, желающим испытать мощь искусственного интеллекта на собственном опыте, мы вас поддержим.

<Note>Хотите поговорить с Claude? Посетите [claude.ai](http://www.claude.ai)!</Note>

<CardGroup cols={3}>
  <Card title="Введение в Claude" icon="check" href="/docs/ru/intro">
    Изучите возможности Claude и процесс разработки.
  </Card>
  <Card title="Быстрый старт" icon="lightning" href="/docs/ru/get-started">
    Узнайте, как сделать ваш первый вызов API за несколько минут.
  </Card>
  <Card title="Claude Console" icon="code" href="/">
    Создавайте и тестируйте мощные подсказки прямо в вашем браузере.
  </Card>
</CardGroup>

Если у вас есть вопросы или вам нужна помощь, не стесняйтесь обращаться к нашей [команде поддержки](https://support.claude.com/) или обратитесь к [сообществу Discord](https://www.anthropic.com/discord).