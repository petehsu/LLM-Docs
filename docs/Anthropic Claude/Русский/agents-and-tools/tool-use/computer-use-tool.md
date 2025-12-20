# Инструмент компьютерного взаимодействия

Claude может взаимодействовать с компьютерными окружениями через инструмент компьютерного взаимодействия, который предоставляет возможности снятия скриншотов и управления мышью/клавиатурой для автономного взаимодействия с рабочим столом.

---

Claude может взаимодействовать с компьютерными окружениями через инструмент компьютерного взаимодействия, который предоставляет возможности снятия скриншотов и управления мышью/клавиатурой для автономного взаимодействия с рабочим столом.

<Note>
Компьютерное взаимодействие в настоящее время находится в бета-версии и требует [бета-заголовок](/docs/ru/api/beta-headers):
- `"computer-use-2025-11-24"` для Claude Opus 4.5
- `"computer-use-2025-01-24"` для Claude Sonnet 4.5, Haiku 4.5, Opus 4.1, Sonnet 4, Opus 4 и Sonnet 3.7 ([устарело](/docs/ru/about-claude/model-deprecations))
</Note>

## Обзор

Компьютерное взаимодействие — это бета-функция, которая позволяет Claude взаимодействовать с окружениями рабочего стола. Этот инструмент предоставляет:

- **Снятие скриншотов**: Просмотр того, что в настоящее время отображается на экране
- **Управление мышью**: Клики, перетаскивание и перемещение курсора
- **Ввод с клавиатуры**: Ввод текста и использование сочетаний клавиш
- **Автоматизация рабочего стола**: Взаимодействие с любым приложением или интерфейсом

Хотя компьютерное взаимодействие может быть дополнено другими инструментами, такими как bash и текстовый редактор для более комплексных рабочих процессов автоматизации, компьютерное взаимодействие конкретно относится к возможности инструмента компьютерного взаимодействия видеть и управлять окружениями рабочего стола.

## Совместимость моделей

Компьютерное взаимодействие доступно для следующих моделей Claude:

| Модель | Версия инструмента | Флаг бета-версии |
|-------|--------------|-----------|
| Claude Opus 4.5 | `computer_20251124` | `computer-use-2025-11-24` |
| Все остальные поддерживаемые модели | `computer_20250124` | `computer-use-2025-01-24` |

<Note>
Claude Opus 4.5 представляет версию инструмента `computer_20251124` с новыми возможностями, включая действие масштабирования для детального изучения областей экрана. Все остальные модели (Sonnet 4.5, Haiku 4.5, Sonnet 4, Opus 4, Opus 4.1 и Sonnet 3.7) используют версию инструмента `computer_20250124`.
</Note>

<Warning>
Старые версии инструментов не гарантированно совместимы в обратном направлении с более новыми моделями. Всегда используйте версию инструмента, которая соответствует вашей версии модели.
</Warning>

## Соображения безопасности

<Warning>
Компьютерное взаимодействие — это бета-функция с уникальными рисками, отличными от стандартных функций API. Эти риски повышаются при взаимодействии с интернетом. Чтобы минимизировать риски, рассмотрите возможность принятия мер предосторожности, таких как:

1. Используйте выделенную виртуальную машину или контейнер с минимальными привилегиями, чтобы предотвратить прямые атаки на систему или случайные ошибки.
2. Избегайте предоставления модели доступа к конфиденциальным данным, таким как информация для входа в учетную запись, чтобы предотвратить кражу информации.
3. Ограничьте доступ в интернет списком разрешенных доменов, чтобы снизить воздействие вредоносного контента.
4. Попросите человека подтвердить решения, которые могут привести к значительным реальным последствиям, а также любые задачи, требующие явного согласия, такие как принятие файлов cookie, выполнение финансовых транзакций или согласие с условиями обслуживания.

В некоторых случаях Claude будет следовать командам, найденным в контенте, даже если это противоречит инструкциям пользователя. Например, инструкции Claude на веб-страницах или содержащиеся в изображениях могут переопределить инструкции или привести к ошибкам Claude. Мы рекомендуем принять меры предосторожности для изоляции Claude от конфиденциальных данных и действий, чтобы избежать рисков, связанных с внедрением подсказок.

Мы обучили модель сопротивляться этим внедрениям подсказок и добавили дополнительный уровень защиты. Если вы используете наши инструменты компьютерного взаимодействия, мы автоматически запустим классификаторы на ваших подсказках, чтобы отметить потенциальные случаи внедрения подсказок. Когда эти классификаторы выявляют потенциальные внедрения подсказок на скриншотах, они автоматически направляют модель на запрос подтверждения пользователя перед выполнением следующего действия. Мы признаем, что эта дополнительная защита не будет идеальной для каждого случая использования (например, для случаев использования без участия человека), поэтому, если вы хотите отказаться и отключить это, пожалуйста, [свяжитесь с нами](https://support.claude.com/en/).

Мы по-прежнему рекомендуем принять меры предосторожности для изоляции Claude от конфиденциальных данных и действий, чтобы избежать рисков, связанных с внедрением подсказок.

Наконец, пожалуйста, информируйте конечных пользователей о соответствующих рисках и получайте их согласие перед включением компьютерного взаимодействия в ваших собственных продуктах.

</Warning>

<Card
  title="Эталонная реализация компьютерного взаимодействия"
  icon="computer"
  href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
>

Начните быстро с нашей эталонной реализацией компьютерного взаимодействия, которая включает веб-интерфейс, контейнер Docker, примеры реализации инструментов и цикл агента.

**Примечание:** Реализация была обновлена, чтобы включить новые инструменты как для моделей Claude 4, так и для Claude Sonnet 3.7. Обязательно загрузите последнюю версию репозитория, чтобы получить доступ к этим новым функциям.

</Card>

<Tip>
  Пожалуйста, используйте [эту форму](https://forms.gle/BT1hpBrqDPDUrCqo7) для предоставления
  отзывов о качестве ответов модели, самом API или качестве
  документации — мы не можем дождаться услышать от вас!
</Tip>

## Быстрый старт

Вот как начать работу с компьютерным взаимодействием:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",  # или другая совместимая модель
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        }
    ],
    messages=[{"role": "user", "content": "Сохраните фотографию кошки на мой рабочий стол."}],
    betas=["computer-use-2025-01-24"]
)
print(response)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: computer-use-2025-01-24" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "computer_20250124",
        "name": "computer",
        "display_width_px": 1024,
        "display_height_px": 768,
        "display_number": 1
      },
      {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      },
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Сохраните фотографию кошки на мой рабочий стол."
      }
    ]
  }'
```
</CodeGroup>

<Note>
Бета-заголовок требуется только для инструмента компьютерного взаимодействия.

Приведенный выше пример показывает все три инструмента, используемые вместе, что требует бета-заголовка, потому что он включает инструмент компьютерного взаимодействия.
</Note>

---

## Как работает компьютерное взаимодействие

<Steps>
  <Step
    title="1. Предоставьте Claude инструмент компьютерного взаимодействия и подсказку пользователя"
    icon="tool"
  >
    - Добавьте инструмент компьютерного взаимодействия (и опционально другие инструменты) в ваш запрос API.
    - Включите подсказку пользователя, которая требует взаимодействия с рабочим столом, например, "Сохраните фотографию кошки на мой рабочий стол."
  </Step>
  <Step title="2. Claude решает использовать инструмент компьютерного взаимодействия" icon="wrench">
    - Claude оценивает, может ли инструмент компьютерного взаимодействия помочь с запросом пользователя.
    - Если да, Claude создает правильно отформатированный запрос использования инструмента.
    - Ответ API имеет `stop_reason` значение `tool_use`, сигнализирующее о намерении Claude.
  </Step>
  <Step
    title="3. Извлеките входные данные инструмента, оцените инструмент на компьютере и верните результаты"
    icon="computer"
  >
    - С вашей стороны извлеките имя инструмента и входные данные из запроса Claude.
    - Используйте инструмент в контейнере или виртуальной машине.
    - Продолжите разговор с новым сообщением `user` содержащим блок содержимого `tool_result`.
  </Step>
  <Step
    title="4. Claude продолжает вызывать инструменты компьютерного взаимодействия до завершения задачи"
    icon="arrows-clockwise"
  >
    - Claude анализирует результаты инструмента, чтобы определить, требуется ли дополнительное использование инструмента или задача завершена.
    - Если Claude решит, что ему нужен другой инструмент, он ответит с другим `stop_reason` значением `tool_use` и вы должны вернуться к шагу 3.
    - В противном случае он создает текстовый ответ пользователю.
  </Step>
</Steps>

Мы называем повторение шагов 3 и 4 без ввода пользователя "циклом агента" — то есть Claude отвечает запросом использования инструмента, а ваше приложение отвечает Claude результатами оценки этого запроса.

### Вычислительное окружение

Компьютерное взаимодействие требует изолированного вычислительного окружения, где Claude может безопасно взаимодействовать с приложениями и веб-сайтами. Это окружение включает:

1. **Виртуальный дисплей**: Виртуальный сервер дисплея X11 (использующий Xvfb), который отображает интерфейс рабочего стола, который Claude будет видеть через скриншоты и управлять с помощью действий мыши/клавиатуры.

2. **Окружение рабочего стола**: Легкий пользовательский интерфейс с оконным менеджером (Mutter) и панелью (Tint2), работающий на Linux, который предоставляет согласованный графический интерфейс для взаимодействия Claude.

3. **Приложения**: Предустановленные приложения Linux, такие как Firefox, LibreOffice, текстовые редакторы и файловые менеджеры, которые Claude может использовать для выполнения задач.

4. **Реализации инструментов**: Код интеграции, который переводит абстрактные запросы инструментов Claude (такие как "переместить мышь" или "сделать скриншот") в фактические операции в виртуальном окружении.

5. **Цикл агента**: Программа, которая обрабатывает связь между Claude и окружением, отправляя действия Claude в окружение и возвращая результаты (скриншоты, выходные данные команд) обратно Claude.

Когда вы используете компьютерное взаимодействие, Claude не подключается напрямую к этому окружению. Вместо этого ваше приложение:

1. Получает запросы использования инструмента от Claude
2. Переводит их в действия в вашем вычислительном окружении
3. Захватывает результаты (скриншоты, выходные данные команд и т. д.)
4. Возвращает эти результаты Claude

Для безопасности и изоляции эталонная реализация запускает все это внутри контейнера Docker с соответствующими сопоставлениями портов для просмотра и взаимодействия с окружением.

---

## Как реализовать компьютерное взаимодействие

### Начните с нашей эталонной реализацией

Мы создали [эталонную реализацию](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo), которая включает все необходимое для быстрого начала работы с компьютерным взаимодействием:

- [Контейнеризованное окружение](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile) подходящее для компьютерного взаимодействия с Claude
- Реализации [инструментов компьютерного взаимодействия](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools)
- [Цикл агента](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py), который взаимодействует с API Claude и выполняет инструменты компьютерного взаимодействия
- Веб-интерфейс для взаимодействия с контейнером, циклом агента и инструментами.

### Понимание цикла мультиагента

Основой компьютерного взаимодействия является "цикл агента" — цикл, в котором Claude запрашивает действия инструмента, ваше приложение их выполняет и возвращает результаты Claude. Вот упрощенный пример:

```python
async def sampling_loop(
    *,
    model: str,
    messages: list[dict],
    api_key: str,
    max_tokens: int = 4096,
    tool_version: str,
    thinking_budget: int | None = None,
    max_iterations: int = 10,  # Добавьте ограничение итераций, чтобы предотвратить бесконечные циклы
):
    """
    Простой цикл агента для взаимодействия Claude с компьютером.

    Эта функция обрабатывает обмен между:
    1. Отправкой сообщений пользователя Claude
    2. Claude запрашивает использование инструментов
    3. Ваше приложение выполняет эти инструменты
    4. Отправкой результатов инструментов обратно Claude
    """
    # Настройка инструментов и параметров API
    client = Anthropic(api_key=api_key)
    beta_flag = "computer-use-2025-01-24" if "20250124" in tool_version else "computer-use-2024-10-22"

    # Настройка инструментов — вы должны уже иметь их инициализированными где-то еще
    tools = [
        {"type": f"computer_{tool_version}", "name": "computer", "display_width_px": 1024, "display_height_px": 768},
        {"type": f"text_editor_{tool_version}", "name": "str_replace_editor"},
        {"type": f"bash_{tool_version}", "name": "bash"}
    ]

    # Основной цикл агента (с ограничением итераций, чтобы предотвратить неконтролируемые затраты API)
    iterations = 0
    while True and iterations < max_iterations:
        iterations += 1
        # Настройка дополнительного параметра мышления (для Claude Sonnet 3.7)
        thinking = None
        if thinking_budget:
            thinking = {"type": "enabled", "budget_tokens": thinking_budget}

        # Вызов API Claude
        response = client.beta.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
            tools=tools,
            betas=[beta_flag],
            thinking=thinking
        )

        # Добавьте ответ Claude в историю разговора
        response_content = response.content
        messages.append({"role": "assistant", "content": response_content})

        # Проверьте, использовал ли Claude какие-либо инструменты
        tool_results = []
        for block in response_content:
            if block.type == "tool_use":
                # В реальном приложении вы бы выполнили инструмент здесь
                # Например: result = run_tool(block.name, block.input)
                result = {"result": "Tool executed successfully"}

                # Отформатируйте результат для Claude
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        # Если инструменты не использовались, Claude готов — верните финальные сообщения
        if not tool_results:
            return messages

        # Добавьте результаты инструментов в сообщения для следующей итерации с Claude
        messages.append({"role": "user", "content": tool_results})
```

Цикл продолжается до тех пор, пока Claude не ответит без запроса каких-либо инструментов (завершение задачи) или не будет достигнут максимальный предел итераций. Эта защита предотвращает потенциальные бесконечные циклы, которые могут привести к неожиданным затратам на API.

Мы рекомендуем попробовать эталонную реализацию перед чтением остальной части этой документации.

### Оптимизируйте производительность модели с помощью подсказок

Вот несколько советов о том, как получить лучшее качество выходных данных:

1. Укажите простые, четко определенные задачи и предоставьте явные инструкции для каждого шага.
2. Claude иногда предполагает результаты своих действий без явной проверки их результатов. Чтобы предотвратить это, вы можете подсказать Claude с помощью `После каждого шага сделайте скриншот и тщательно оцените, достигли ли вы правильного результата. Явно покажите свое мышление: "Я оценил шаг X..." Если это неправильно, попробуйте снова. Только когда вы подтвердите, что шаг был выполнен правильно, переходите к следующему.`
3. Некоторые элементы пользовательского интерфейса (такие как раскрывающиеся списки и полосы прокрутки) могут быть сложными для Claude при манипулировании с помощью движений мыши. Если вы столкнетесь с этим, попробуйте подсказать модели использовать сочетания клавиш.
4. Для повторяемых задач или взаимодействий пользовательского интерфейса включите примеры скриншотов и вызовов инструментов успешных результатов в вашу подсказку.
5. Если вам нужно, чтобы модель вошла в систему, предоставьте ей имя пользователя и пароль в вашей подсказке внутри тегов xml, таких как `<robot_credentials>`. Использование компьютерного взаимодействия в приложениях, требующих входа, увеличивает риск плохих результатов из-за внедрения подсказок. Пожалуйста, ознакомьтесь с нашим [руководством по смягчению внедрения подсказок](/docs/ru/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks) перед предоставлением модели учетных данных для входа.

<Tip>
  Если вы неоднократно сталкиваетесь с четким набором проблем или заранее знаете задачи,
  которые Claude должен будет выполнить, используйте системную подсказку, чтобы предоставить Claude
  явные советы или инструкции о том, как успешно выполнить задачи.
</Tip>

### Системные подсказки

Когда один из инструментов, определенных Anthropic, запрашивается через API Claude, генерируется системная подсказка, специфичная для компьютерного взаимодействия. Она похожа на [системную подсказку использования инструмента](/docs/ru/agents-and-tools/tool-use/implement-tool-use#tool-use-system-prompt), но начинается с:

> У вас есть доступ к набору функций, которые вы можете использовать для ответа на вопрос пользователя. Это включает доступ к изолированному вычислительному окружению. В настоящее время у вас нет возможности проверять файлы или взаимодействовать с внешними ресурсами, кроме как путем вызова приведенных ниже функций.

Как и при обычном использовании инструментов, поле `system_prompt`, предоставленное пользователем, по-прежнему соблюдается и используется при построении объединенной системной подсказки.

### Доступные действия

Инструмент компьютерного взаимодействия поддерживает эти действия:

**Базовые действия (все версии)**
- **screenshot** — Захватить текущий дисплей
- **left_click** — Клик в координатах `[x, y]`
- **type** — Ввести текстовую строку
- **key** — Нажать клавишу или комбинацию клавиш (например, "ctrl+s")
- **mouse_move** — Переместить курсор в координаты

**Расширенные действия (`computer_20250124`)**
Доступны в моделях Claude 4 и Claude Sonnet 3.7:
- **scroll** — Прокрутка в любом направлении с контролем количества
- **left_click_drag** — Клик и перетаскивание между координатами
- **right_click**, **middle_click** — Дополнительные кнопки мыши
- **double_click**, **triple_click** — Множественные клики
- **left_mouse_down**, **left_mouse_up** — Точный контроль клика
- **hold_key** — Удерживайте клавишу при выполнении других действий
- **wait** — Пауза между действиями

**Расширенные действия (`computer_20251124`)**
Доступны в Claude Opus 4.5:
- Все действия из `computer_20250124`
- **zoom** — Просмотр определенной области экрана в полном разрешении. Требует `enable_zoom: true` в определении инструмента. Принимает параметр `region` с координатами `[x1, y1, x2, y2]`, определяющими верхний левый и нижний правый углы области для проверки.

<section title="Примеры действий">

```json
// Сделать скриншот
{
  "action": "screenshot"
}

// Клик в позицию
{
  "action": "left_click",
  "coordinate": [500, 300]
}

// Ввести текст
{
  "action": "type",
  "text": "Hello, world!"
}

// Прокрутка вниз (Claude 4/3.7)
{
  "action": "scroll",
  "coordinate": [500, 400],
  "scroll_direction": "down",
  "scroll_amount": 3
}

// Масштабирование для просмотра региона в деталях (Opus 4.5)
{
  "action": "zoom",
  "region": [100, 200, 400, 350]
}
```

</section>

### Параметры инструмента

| Параметр | Обязательный | Описание |
|-----------|----------|-------------|
| `type` | Да | Версия инструмента (`computer_20251124`, `computer_20250124` или `computer_20241022`) |
| `name` | Да | Должно быть "computer" |
| `display_width_px` | Да | Ширина дисплея в пикселях |
| `display_height_px` | Да | Высота дисплея в пикселях |
| `display_number` | Нет | Номер дисплея для окружений X11 |
| `enable_zoom` | Нет | Включить действие масштабирования (`computer_20251124` только). Установите значение `true`, чтобы позволить Claude масштабировать определенные области экрана. По умолчанию: `false` |

<Note>
**Важно**: Инструмент компьютерного взаимодействия должен быть явно выполнен вашим приложением — Claude не может выполнить его напрямую. Вы несете ответственность за реализацию захвата скриншотов, движений мыши, вводов с клавиатуры и других действий на основе запросов Claude.
</Note>

### Включите возможность мышления в моделях Claude 4 и Claude Sonnet 3.7

Claude Sonnet 3.7 представил новую возможность "мышления", которая позволяет вам видеть процесс рассуждения модели при работе над сложными задачами. Эта функция помогает вам понять, как Claude подходит к проблеме, и может быть особенно ценна для отладки или образовательных целей.

Чтобы включить мышление, добавьте параметр `thinking` в ваш запрос API:

```json
"thinking": {
  "type": "enabled",
  "budget_tokens": 1024
}
```

Параметр `budget_tokens` указывает, сколько токенов Claude может использовать для мышления. Это вычитается из вашего общего бюджета `max_tokens`.

Когда мышление включено, Claude вернет свой процесс рассуждения как часть ответа, что может помочь вам:

1. Понять процесс принятия решений модели
2. Выявить потенциальные проблемы или неправильные представления
3. Учиться на подходе Claude к решению проблем
4. Получить больше видимости в сложные многошаговые операции

Вот пример того, как может выглядеть выходные данные мышления:

```
[Мышление]
Мне нужно сохранить фотографию кошки на рабочий стол. Давайте разберемся на шаги:

1. Сначала я сделаю скриншот, чтобы увидеть, что находится на рабочем столе
2. Затем я буду искать веб-браузер для поиска изображений кошек
3. После нахождения подходящего изображения мне нужно будет сохранить его на рабочий стол

Давайте начнем со скриншота, чтобы увидеть, что доступно...
```

### Дополнение компьютерного взаимодействия другими инструментами

Инструмент компьютерного взаимодействия может быть объединен с другими инструментами для создания более мощных рабочих процессов автоматизации. Это особенно полезно, когда вам нужно:
- Выполнять системные команды ([инструмент bash](/docs/ru/agents-and-tools/tool-use/bash-tool))
- Редактировать файлы конфигурации или скрипты ([инструмент текстового редактора](/docs/ru/agents-and-tools/tool-use/text-editor-tool))
- Интегрироваться с пользовательскими API или сервисами (пользовательские инструменты)

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: computer-use-2025-01-24" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 2000,
      "tools": [
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Получить текущую погоду в заданном месте",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "Город и штат, например Сан-Франциско, Калифорния"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "Единица температуры, либо 'celsius', либо 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Найдите рейсы из Сан-Франциско в место с более теплой погодой."
        }
      ],
      "thinking": {
        "type": "enabled",
        "budget_tokens": 1024
      }
    }'
  ```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Получить текущую погоду в заданном месте",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "Город и штат, например Сан-Франциско, Калифорния"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "Единица температуры, либо 'celsius', либо 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        },
    ],
    messages=[{"role": "user", "content": "Найдите рейсы из Сан-Франциско в место с более теплой погодой."}],
    betas=["computer-use-2025-01-24"],
    thinking={"type": "enabled", "budget_tokens": 1024},
)
print(response)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
      {
        type: "computer_20250124",
        name: "computer",
        display_width_px: 1024,
        display_height_px: 768,
        display_number: 1,
      },
      {
        type: "text_editor_20250728",
        name: "str_replace_based_edit_tool"
      },
      {
        type: "bash_20250124",
        name: "bash"
      },
      {
        name: "get_weather",
        description: "Получить текущую погоду в заданном месте",
        input_schema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "Город и штат, например Сан-Франциско, Калифорния"
            },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
              description: "Единица температуры, либо 'celsius', либо 'fahrenheit'"
            }
          },
          required: ["location"]
        }
      },
  ],
  messages: [{ role: "user", content: "Найдите рейсы из Сан-Франциско в место с более теплой погодой." }],
  betas: ["computer-use-2025-01-24"],
  thinking: { type: "enabled", budget_tokens: 1024 },
});
console.log(message);
```
```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaToolBash20250124;
import com.anthropic.models.beta.messages.BetaToolComputerUse20250124;
import com.anthropic.models.beta.messages.BetaToolTextEditor20250124;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaThinkingConfigParam;
import com.anthropic.models.beta.messages.BetaTool;

public class MultipleToolsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model("claude-sonnet-4-5")
                .maxTokens(1024)
                .addTool(BetaToolComputerUse20250124.builder()
                        .displayWidthPx(1024)
                        .displayHeightPx(768)
                        .displayNumber(1)
                        .build())
                .addTool(BetaToolTextEditor20250124.builder()
                        .build())
                .addTool(BetaToolBash20250124.builder()
                        .build())
                .addTool(BetaTool.builder()
                        .name("get_weather")
                        .description("Получить текущую погоду в заданном месте")
                        .inputSchema(BetaTool.InputSchema.builder()
                                .properties(
                                        JsonValue.from(
                                                Map.of(
                                                        "location", Map.of(
                                                                "type", "string",
                                                                "description", "Город и штат, например Сан-Франциско, Калифорния"
                                                        ),
                                                        "unit", Map.of(
                                                                "type", "string",
                                                                "enum", List.of("celsius", "fahrenheit"),
                                                                "description", "Единица температуры, либо 'celsius', либо 'fahrenheit'"
                                                        )
                                                )
                                        ))
                                .build()
                        )
                        .build())
                .thinking(BetaThinkingConfigParam.ofEnabled(
                        BetaThinkingConfigEnabled.builder()
                                .budgetTokens(1024)
                                .build()
                ))
                .addUserMessage("Найдите рейсы из Сан-Франциско в место с более теплой погодой.")
                .addBeta("computer-use-2025-01-24")
                .build();

        BetaMessage message = client.beta().messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

### Создание пользовательской среды компьютерного использования

[Эталонная реализация](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) предназначена для помощи в начале работы с компьютерным использованием. Она включает все компоненты, необходимые для использования Claude на компьютере. Однако вы можете создать свою собственную среду для компьютерного использования в соответствии с вашими потребностями. Вам потребуется:

- Виртуализированная или контейнеризированная среда, подходящая для компьютерного использования с Claude
- Реализация по крайней мере одного из инструментов компьютерного использования, определённых Anthropic
- Цикл агента, который взаимодействует с API Claude и выполняет результаты `tool_use` с использованием ваших реализаций инструментов
- API или пользовательский интерфейс, который позволяет вводить данные пользователем для запуска цикла агента

#### Реализация инструмента компьютерного использования

Инструмент компьютерного использования реализован как инструмент без схемы. При использовании этого инструмента вам не нужно предоставлять схему ввода, как с другими инструментами; схема встроена в модель Claude и не может быть изменена.

<Steps>
  <Step title="Настройка вычислительной среды">
    Создайте виртуальный дисплей или подключитесь к существующему дисплею, с которым будет взаимодействовать Claude. Обычно это включает настройку Xvfb (X Virtual Framebuffer) или аналогичной технологии.
  </Step>
  <Step title="Реализация обработчиков действий">
    Создайте функции для обработки каждого типа действия, которое может запросить Claude:
    ```python
    def handle_computer_action(action_type, params):
        if action_type == "screenshot":
            return capture_screenshot()
        elif action_type == "left_click":
            x, y = params["coordinate"]
            return click_at(x, y)
        elif action_type == "type":
            return type_text(params["text"])
        # ... обработка других действий
    ```
  </Step>
  <Step title="Обработка вызовов инструментов Claude">
    Извлеките и выполните вызовы инструментов из ответов Claude:
    ```python
    for content in response.content:
        if content.type == "tool_use":
            action = content.input["action"]
            result = handle_computer_action(action, content.input)
            
            # Возврат результата Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="Реализация цикла агента">
    Создайте цикл, который продолжается до завершения задачи Claude:
    ```python
    while True:
        response = client.beta.messages.create(...)
        
        # Проверка, использовал ли Claude какие-либо инструменты
        tool_results = process_tool_calls(response)
        
        if not tool_results:
            # Больше нет использования инструментов, задача завершена
            break
            
        # Продолжение разговора с результатами инструментов
        messages.append({"role": "user", "content": tool_results})
    ```
  </Step>
</Steps>

#### Обработка ошибок

При реализации инструмента компьютерного использования могут возникнуть различные ошибки. Вот как их обрабатывать:

<section title="Ошибка захвата скриншота">

Если захват скриншота не удаётся, верните соответствующее сообщение об ошибке:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to capture screenshot. Display may be locked or unavailable.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Неверные координаты">

Если Claude предоставляет координаты вне границ дисплея:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Coordinates (1200, 900) are outside display bounds (1024x768).",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Ошибка выполнения действия">

Если действие не удаётся выполнить:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to perform click action. The application may be unresponsive.",
      "is_error": true
    }
  ]
}
```

</section>

#### Обработка масштабирования координат для более высоких разрешений

API ограничивает изображения максимум 1568 пикселями на самом длинном краю и примерно 1,15 мегапиксела в целом (см. [изменение размера изображения](/docs/ru/build-with-claude/vision#evaluate-image-size) для получения подробной информации). Например, экран 1512x982 уменьшается примерно до 1330x864. Claude анализирует это меньшее изображение и возвращает координаты в этом пространстве, но ваш инструмент выполняет клики в исходном пространстве экрана.

Это может привести к тому, что координаты клика Claude не попадут в свои цели, если вы не обработаете преобразование координат.

Чтобы исправить это, измените размер скриншотов самостоятельно и масштабируйте координаты Claude обратно:

<CodeGroup>
```python Python
import math

def get_scale_factor(width, height):
    """Calculate scale factor to meet API constraints."""
    long_edge = max(width, height)
    total_pixels = width * height

    long_edge_scale = 1568 / long_edge
    total_pixels_scale = math.sqrt(1_150_000 / total_pixels)

    return min(1.0, long_edge_scale, total_pixels_scale)

# When capturing screenshot
scale = get_scale_factor(screen_width, screen_height)
scaled_width = int(screen_width * scale)
scaled_height = int(screen_height * scale)

# Resize image to scaled dimensions before sending to Claude
screenshot = capture_and_resize(scaled_width, scaled_height)

# When handling Claude's coordinates, scale them back up
def execute_click(x, y):
    screen_x = x / scale
    screen_y = y / scale
    perform_click(screen_x, screen_y)
```

```typescript TypeScript
const MAX_LONG_EDGE = 1568;
const MAX_PIXELS = 1_150_000;

function getScaleFactor(width: number, height: number): number {
  const longEdge = Math.max(width, height);
  const totalPixels = width * height;

  const longEdgeScale = MAX_LONG_EDGE / longEdge;
  const totalPixelsScale = Math.sqrt(MAX_PIXELS / totalPixels);

  return Math.min(1.0, longEdgeScale, totalPixelsScale);
}

// When capturing screenshot
const scale = getScaleFactor(screenWidth, screenHeight);
const scaledWidth = Math.floor(screenWidth * scale);
const scaledHeight = Math.floor(screenHeight * scale);

// Resize image to scaled dimensions before sending to Claude
const screenshot = captureAndResize(scaledWidth, scaledHeight);

// When handling Claude's coordinates, scale them back up
function executeClick(x: number, y: number): void {
  const screenX = x / scale;
  const screenY = y / scale;
  performClick(screenX, screenY);
}
```
</CodeGroup>

#### Следуйте лучшим практикам реализации

<section title="Используйте подходящее разрешение дисплея">

Установите размеры дисплея, которые соответствуют вашему варианту использования, оставаясь в рекомендуемых пределах:
- Для общих задач рабочего стола: 1024x768 или 1280x720
- Для веб-приложений: 1280x800 или 1366x768
- Избегайте разрешений выше 1920x1080, чтобы предотвратить проблемы с производительностью

</section>

<section title="Реализация надлежащей обработки скриншотов">

При возврате скриншотов Claude:
- Кодируйте скриншоты как base64 PNG или JPEG
- Рассмотрите возможность сжатия больших скриншотов для улучшения производительности
- Включите соответствующие метаданные, такие как временная метка или состояние дисплея
- Если используются более высокие разрешения, убедитесь, что координаты точно масштабируются

</section>

<section title="Добавление задержек действий">

Некоторым приложениям требуется время для ответа на действия:
```python
def click_and_wait(x, y, wait_time=0.5):
    click_at(x, y)
    time.sleep(wait_time)  # Allow UI to update
```

</section>

<section title="Проверка действий перед выполнением">

Проверьте, что запрашиваемые действия безопасны и действительны:
```python
def validate_action(action_type, params):
    if action_type == "left_click":
        x, y = params.get("coordinate", (0, 0))
        if not (0 <= x < display_width and 0 <= y < display_height):
            return False, "Coordinates out of bounds"
    return True, None
```

</section>

<section title="Логирование действий для отладки">

Ведите журнал всех действий для устранения неполадок:
```python
import logging

def log_action(action_type, params, result):
    logging.info(f"Action: {action_type}, Params: {params}, Result: {result}")
```

</section>

---

## Понимание ограничений компьютерного использования

Функциональность компьютерного использования находится в бета-версии. Хотя возможности Claude передовые, разработчики должны знать о её ограничениях:

1. **Задержка**: текущая задержка компьютерного использования для взаимодействия человека и ИИ может быть слишком медленной по сравнению с обычными действиями на компьютере, направляемыми человеком. Мы рекомендуем сосредоточиться на вариантах использования, где скорость не критична (например, сбор справочной информации, автоматизированное тестирование программного обеспечения) в доверенных средах.
2. **Точность и надёжность компьютерного зрения**: Claude может допустить ошибки или галлюцинировать при выводе конкретных координат при создании действий. Claude Sonnet 3.7 вводит возможность мышления, которая может помочь вам понять рассуждения модели и выявить потенциальные проблемы.
3. **Точность и надёжность выбора инструмента**: Claude может допустить ошибки или галлюцинировать при выборе инструментов при создании действий или предпринять неожиданные действия для решения проблем. Кроме того, надёжность может быть ниже при взаимодействии с нишевыми приложениями или несколькими приложениями одновременно. Мы рекомендуем пользователям тщательно подсказывать модель при запросе сложных задач.
4. **Надёжность прокрутки**: Claude Sonnet 3.7 представил специальные действия прокрутки с управлением направлением, которые улучшают надёжность. Модель теперь может явно прокручивать в любом направлении (вверх/вниз/влево/вправо) на указанное количество.
5. **Взаимодействие с электронными таблицами**: Клики мышью для взаимодействия с электронными таблицами улучшены в Claude Sonnet 3.7 с добавлением более точных действий управления мышью, таких как `left_mouse_down`, `left_mouse_up` и новая поддержка клавиш-модификаторов. Выбор ячеек может быть более надёжным при использовании этих детальных элементов управления и комбинировании клавиш-модификаторов с кликами.
6. **Создание учётной записи и создание контента на социальных и коммуникационных платформах**: Хотя Claude будет посещать веб-сайты, мы ограничиваем его способность создавать учётные записи или создавать и делиться контентом или иным образом участвовать в выдаче себя за человека на веб-сайтах и платформах социальных сетей. Мы можем обновить эту возможность в будущем.
7. **Уязвимости**: Уязвимости, такие как взлом или внедрение подсказок, могут сохраняться в системах передовых ИИ, включая бета-версию API компьютерного использования. В некоторых случаях Claude будет следовать командам, найденным в контенте, иногда даже в конфликте с инструкциями пользователя. Например, инструкции Claude на веб-страницах или содержащиеся в изображениях могут переопределить инструкции или привести к ошибкам Claude. Мы рекомендуем:
   a. Ограничение компьютерного использования доверенными средами, такими как виртуальные машины или контейнеры с минимальными привилегиями
   b. Избегание предоставления доступа к компьютерному использованию к чувствительным учётным записям или данным без строгого надзора
   c. Информирование конечных пользователей об соответствующих рисках и получение их согласия перед включением или запросом разрешений, необходимых для функций компьютерного использования в ваших приложениях
8. **Неправомерные или незаконные действия**: В соответствии с условиями обслуживания Anthropic вы не должны использовать компьютерное использование для нарушения каких-либо законов или нашей Политики приемлемого использования.

Всегда тщательно проверяйте и верифицируйте действия и журналы компьютерного использования Claude. Не используйте Claude для задач, требующих идеальной точности или чувствительной информации пользователя без надзора человека.

---

## Цены

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## Следующие шаги

<CardGroup cols={2}>
  <Card
    title="Эталонная реализация"
    icon="github-logo"
    href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
  >
    Начните быстро с нашей полной реализацией на основе Docker
  </Card>
  <Card
    title="Документация инструмента"
    icon="tool"
    href="/docs/ru/agents-and-tools/tool-use/overview"
  >
    Узнайте больше об использовании инструментов и создании пользовательских инструментов
  </Card>
</CardGroup>