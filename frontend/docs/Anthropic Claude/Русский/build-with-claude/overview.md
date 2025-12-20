# Обзор функций

Изучите передовые функции и возможности Claude.

---

## Основные возможности

Эти функции расширяют фундаментальные способности Claude по обработке, анализу и генерации контента в различных форматах и сценариях использования.

| Функция | Описание | Доступность |
|---------|-------------|--------------|
| [Контекстное окно в 1 млн токенов](/docs/ru/build-with-claude/context-windows#1m-token-context-window) | Расширенное контекстное окно, которое позволяет вам обрабатывать гораздо более крупные документы, поддерживать более длительные беседы и работать с более обширными кодовыми базами. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Agent Skills](/docs/ru/agents-and-tools/agent-skills/overview) | Расширьте возможности Claude с помощью Skills. Используйте предварительно созданные Skills (PowerPoint, Excel, Word, PDF) или создавайте пользовательские Skills с инструкциями и скриптами. Skills используют прогрессивное раскрытие для эффективного управления контекстом. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Пакетная обработка](/docs/ru/build-with-claude/batch-processing) | Обрабатывайте большие объемы запросов асинхронно для экономии затрат. Отправляйте пакеты с большим количеством запросов в каждом пакете. Вызовы API пакетной обработки стоят на 50% дешевле, чем стандартные вызовы API. | <PlatformAvailability claudeApi bedrock vertexAi /> |
| [Цитирование](/docs/ru/build-with-claude/citations) | Обоснуйте ответы Claude исходными документами. С помощью Citations Claude может предоставлять подробные ссылки на точные предложения и отрывки, которые он использует для генерации ответов, что приводит к более проверяемым и надежным результатам. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Редактирование контекста](/docs/ru/build-with-claude/context-editing) | Автоматически управляйте контекстом беседы с помощью настраиваемых стратегий. Поддерживает очистку результатов инструментов при приближении к лимитам токенов и управление блоками размышлений в беседах с расширенным мышлением. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Effort](/docs/ru/build-with-claude/effort) | Контролируйте, сколько токенов Claude использует при ответе с помощью параметра effort, балансируя между полнотой ответа и эффективностью использования токенов. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Расширенное мышление](/docs/ru/build-with-claude/extended-thinking) | Улучшенные возможности рассуждения для сложных задач, обеспечивающие прозрачность пошагового процесса мышления Claude перед предоставлением окончательного ответа. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Files API](/docs/ru/build-with-claude/files) | Загружайте и управляйте файлами для использования с Claude без повторной загрузки контента с каждым запросом. Поддерживает PDF, изображения и текстовые файлы. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Поддержка PDF](/docs/ru/build-with-claude/pdf-support) | Обрабатывайте и анализируйте текстовый и визуальный контент из документов PDF. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Кэширование подсказок (5 мин)](/docs/ru/build-with-claude/prompt-caching) | Предоставьте Claude больше справочных знаний и примеры выходных данных для снижения затрат и задержки. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Кэширование подсказок (1 час)](/docs/ru/build-with-claude/prompt-caching#1-hour-cache-duration) | Расширенная длительность кэша в 1 час для менее часто используемого, но важного контекста, дополняющего стандартный кэш на 5 минут. | <PlatformAvailability claudeApi azureAi /> |
| [Результаты поиска](/docs/ru/build-with-claude/search-results) | Включите естественное цитирование для приложений RAG, предоставляя результаты поиска с надлежащей атрибуцией источника. Достигайте цитирования качества веб-поиска для пользовательских баз знаний и инструментов. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Структурированные выходные данные](/docs/ru/build-with-claude/structured-outputs) | Гарантируйте соответствие схеме двумя подходами: выходные данные JSON для ответов со структурированными данными и строгое использование инструментов для проверенных входных данных инструментов. Доступно на Sonnet 4.5, Opus 4.1, Opus 4.5 и Haiku 4.5. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Подсчет токенов](/docs/ru/api/messages-count-tokens) | Подсчет токенов позволяет вам определить количество токенов в сообщении перед отправкой его в Claude, помогая вам принимать обоснованные решения о ваших подсказках и использовании. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Использование инструментов](/docs/ru/agents-and-tools/tool-use/overview) | Позволяйте Claude взаимодействовать с внешними инструментами и API для выполнения более широкого спектра задач. Список поддерживаемых инструментов см. в [таблице Tools](#tools). | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |

## Инструменты

Эти функции позволяют Claude взаимодействовать с внешними системами, выполнять код и выполнять автоматизированные задачи через различные интерфейсы инструментов.

| Функция | Описание | Доступность |
|---------|-------------|--------------|
| [Bash](/docs/ru/agents-and-tools/tool-use/bash-tool) | Выполняйте команды bash и скрипты для взаимодействия с системной оболочкой и выполнения операций командной строки. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Выполнение кода](/docs/ru/agents-and-tools/tool-use/code-execution-tool) | Запускайте код Python в изолированной среде для расширенного анализа данных. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Программный вызов инструментов](/docs/ru/agents-and-tools/tool-use/programmatic-tool-calling) | Позволяйте Claude вызывать ваши инструменты программно из контейнеров выполнения кода, снижая задержку и потребление токенов для рабочих процессов с несколькими инструментами. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Использование компьютера](/docs/ru/agents-and-tools/tool-use/computer-use-tool) | Управляйте компьютерными интерфейсами, делая снимки экрана и издавая команды мыши и клавиатуры. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Потоковая передача инструментов с точной детализацией](/docs/ru/agents-and-tools/tool-use/fine-grained-tool-streaming) | Потоковая передача параметров использования инструментов без буферизации/проверки JSON, снижение задержки при получении больших параметров. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [MCP connector](/docs/ru/agents-and-tools/mcp-connector) | Подключайтесь к удаленным серверам [MCP](/docs/ru/mcp) непосредственно из Messages API без отдельного клиента MCP. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Memory](/docs/ru/agents-and-tools/tool-use/memory-tool) | Позволяйте Claude сохранять и извлекать информацию в разных беседах. Создавайте базы знаний с течением времени, поддерживайте контекст проекта и учитесь на прошлых взаимодействиях. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Текстовый редактор](/docs/ru/agents-and-tools/tool-use/text-editor-tool) | Создавайте и редактируйте текстовые файлы с помощью встроенного интерфейса текстового редактора для задач манипуляции файлами. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Поиск инструментов](/docs/ru/agents-and-tools/tool-use/tool-search-tool) | Масштабируйте до тысяч инструментов, динамически обнаруживая и загружая инструменты по требованию с помощью поиска на основе регулярных выражений, оптимизируя использование контекста и улучшая точность выбора инструментов. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Web fetch](/docs/ru/agents-and-tools/tool-use/web-fetch-tool) | Получайте полный контент с указанных веб-страниц и документов PDF для углубленного анализа. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Web search](/docs/ru/agents-and-tools/tool-use/web-search-tool) | Дополните обширные знания Claude текущими, реальными данными со всего веб-сайта. | <PlatformAvailability claudeApi vertexAi azureAi /> |