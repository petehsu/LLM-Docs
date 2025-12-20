# Начало работы

> Начните работу с MegaLLM всего за несколько минут. Получите доступ к более чем 70 моделям ИИ через единый API.

## Быстрая навигация

<CardGroup cols={2}>
  <Card title="Быстрый старт" icon="bolt-lightning" href="/ru/home/getting-started/quick-start">
    Сделайте свой первый вызов API за 2 минуты
  </Card>

  <Card title="Руководство по настройке" icon="screwdriver-wrench" href="/ru/home/getting-started/setup">
    Полная настройка и конфигурация
  </Card>

  <Card title="Первый запрос" icon="brackets-curly" href="/ru/home/getting-started/first-request">
    Ваш первый AI запрос шаг за шагом
  </Card>

  <Card title="Следующие шаги" icon="arrow-right-long" href="/ru/home/getting-started/next-steps">
    Что делать после начала работы
  </Card>
</CardGroup>

## Что такое MegaLLM?

MegaLLM — это универсальная платформа ИИ, которая предоставляет доступ к более чем 70 большим языковым моделям через единый API. Вместо управления множеством API-ключей и интеграций, вы получаете:

* **Один API** для всех моделей
* **Один счет** для всего использования
* **Одна интеграция** для поддержки

### Поддерживаемые модели

* **OpenAI**: GPT-4, GPT-5, GPT-3.5 Turbo
* **Anthropic**: Claude Opus 4, Claude Sonnet, Claude Haiku
* **Google**: Gemini 2.5 Pro, Gemini Flash
* **Meta**: Llama 3 70B, Llama 3 8B
* **И более 60 других моделей!**

## Почему стоит выбрать MegaLLM?

<AccordionGroup>
  <Accordion title="Универсальный доступ">
    Доступ ко всем основным моделям ИИ через один API. Не нужно интегрироваться с несколькими провайдерами отдельно.
  </Accordion>

  <Accordion title="Простая интеграция">
    Прямая замена для OpenAI и Anthropic SDK. Просто измените базовый URL, и вы готовы к работе.
  </Accordion>

  <Accordion title="Автоматические резервные варианты">
    Встроенный механизм переключения гарантирует, что ваше приложение продолжит работать, даже если модель недоступна.
  </Accordion>

  <Accordion title="Оптимизация затрат">
    Легко переключайтесь между моделями для оптимизации стоимости, скорости или качества без изменения кода.
  </Accordion>

  <Accordion title="Один счет">
    Единый биллинг для всех провайдеров. Отслеживайте использование и затраты в одной панели управления.
  </Accordion>
</AccordionGroup>

## Настройка в 3 шага

<Steps>
  <Step title="Получите API-ключ">
    Зарегистрируйтесь на [megallm.io](https://megallm.io) и сгенерируйте свой API-ключ
  </Step>

  <Step title="Установите SDK">
    Используйте OpenAI или Anthropic SDK, который вы уже знаете

    ```bash  theme={null}
    pip install openai
    # или
    pip install anthropic
    ```
  </Step>

  <Step title="Сделайте запрос">
    Направьте на MegaLLM и начните использовать любую модель

    ```python  theme={null}
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-megallm-api-key"
    )
    ```
  </Step>
</Steps>

## Выберите свой путь

<Tabs>
  <Tab title="Я новичок в ИИ">
    Отлично! Начните здесь:

    1. [Руководство по быстрому старту](/ru/home/getting-started/quick-start) - Получите свой API-ключ и сделайте первый запрос
    2. [Учебник по первому запросу](/ru/home/getting-started/first-request) - Пошаговое руководство
    3. [Просмотр моделей](/ru/home/models) - Изучите доступные модели
    4. [FAQ](/ru/home/faq) - Часто задаваемые вопросы
  </Tab>

  <Tab title="Я использую OpenAI">
    Отлично! Переход прост:

    1. Получите свой API-ключ MegaLLM
    2. Измените базовый URL на `https://ai.megallm.io/v1`
    3. Вот и всё! Весь ваш код работает так же

    См.: [Руководство по миграции с OpenAI](/ru/dev-docs/openai/overview)
  </Tab>

  <Tab title="Я использую Anthropic">
    Замечательно! Миграция проста:

    1. Получите свой API-ключ MegaLLM
    2. Измените базовый URL на `https://ai.megallm.io`
    3. Готово! Используйте Claude и более 70 других моделей

    См.: [Руководство по миграции с Anthropic](/ru/dev-docs/anthropic/overview)
  </Tab>

  <Tab title="Я разработчик">
    Давайте погрузимся:

    1. [Справочник API](/ru/api-reference/introduction) - Полная документация API
    2. [OpenAI API](/ru/dev-docs/openai/overview) - OpenAI-совместимые эндпоинты
    3. [Anthropic API](/ru/dev-docs/anthropic/overview) - Anthropic-совместимые эндпоинты
    4. [Потоковая передача](/ru/api-reference/endpoint/streaming) - Ответы в реальном времени
    5. [Вызов функций](/ru/api-reference/endpoint/function-calling) - Использование инструментов
  </Tab>
</Tabs>

## Следующие шаги

<CardGroup cols={2}>
  <Card title="Быстрый старт" icon="bolt-lightning" href="/ru/home/getting-started/quick-start">
    Сделайте свой первый запрос за 2 минуты
  </Card>

  <Card title="Просмотреть все модели" icon="grid-2-plus" href="/ru/home/models">
    Просмотрите более 70 доступных моделей ИИ
  </Card>

  <Card title="Документация для разработчиков" icon="file-lines" href="/ru/dev-docs/overview">
    Полная документация API
  </Card>

  <Card title="CLI инструмент" icon="square-terminal" href="/ru/cli/overview">
    Настройте AI-ассистенты для кодирования
  </Card>
</CardGroup>

## Нужна помощь?

* **Документация**: Полные руководства и учебники
* **FAQ**: [Часто задаваемые вопросы](/ru/home/faq)
* **Поддержка**: [support@megallm.io](mailto:support@megallm.io)
* **Discord**: [Присоединяйтесь к нашему сообществу](https://discord.gg/devsindia)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt