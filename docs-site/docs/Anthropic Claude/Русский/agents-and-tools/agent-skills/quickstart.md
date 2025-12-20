# Начало работы с Agent Skills в API

Узнайте, как использовать Agent Skills для создания документов с помощью Claude API менее чем за 10 минут.

---

Это руководство показывает вам, как использовать Agent Skills для создания презентации PowerPoint. Вы узнаете, как включить Skills, сделать простой запрос и получить доступ к созданному файлу.

## Предварительные требования

- [Ключ API Anthropic](/settings/keys)
- Python 3.7+ или установленный curl
- Базовое знакомство с выполнением запросов API

## Что такое Agent Skills?

Предварительно созданные Agent Skills расширяют возможности Claude специализированной экспертизой для задач, таких как создание документов, анализ данных и обработка файлов. Anthropic предоставляет следующие предварительно созданные Agent Skills в API:

- **PowerPoint (pptx)**: Создание и редактирование презентаций
- **Excel (xlsx)**: Создание и анализ электронных таблиц
- **Word (docx)**: Создание и редактирование документов
- **PDF (pdf)**: Создание PDF-документов

<Note>
**Хотите создать пользовательские Skills?** Смотрите [Agent Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills) для примеров создания собственных Skills с экспертизой в конкретной области.
</Note>

## Шаг 1: Список доступных Skills

Сначала давайте посмотрим, какие Skills доступны. Мы будем использовать Skills API для списка всех управляемых Anthropic Skills:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# List Anthropic-managed Skills
skills = client.beta.skills.list(
    source="anthropic",
    betas=["skills-2025-10-02"]
)

for skill in skills.data:
    print(f"{skill.id}: {skill.display_title}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// List Anthropic-managed Skills
const skills = await client.beta.skills.list({
  source: 'anthropic',
  betas: ['skills-2025-10-02']
});

for (const skill of skills.data) {
  console.log(`${skill.id}: ${skill.display_title}`);
}
```

```bash Shell
curl "https://api.anthropic.com/v1/skills?source=anthropic" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```
</CodeGroup>

Вы видите следующие Skills: `pptx`, `xlsx`, `docx` и `pdf`.

Этот API возвращает метаданные каждого Skill: его имя и описание. Claude загружает эти метаданные при запуске, чтобы знать, какие Skills доступны. Это первый уровень **прогрессивного раскрытия**, где Claude обнаруживает Skills без загрузки их полных инструкций.

## Шаг 2: Создание презентации

Теперь мы будем использовать PowerPoint Skill для создания презентации об возобновляемых источниках энергии. Мы указываем Skills, используя параметр `container` в Messages API:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Create a message with the PowerPoint Skill
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "pptx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create a presentation about renewable energy with 5 slides"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

print(response.content)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Create a message with the PowerPoint Skill
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'pptx',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Create a presentation about renewable energy with 5 slides'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});

console.log(response.content);
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "pptx",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Create a presentation about renewable energy with 5 slides"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

Давайте разберемся, что делает каждая часть:

- **`container.skills`**: Указывает, какие Skills может использовать Claude
- **`type: "anthropic"`**: Указывает, что это управляемый Anthropic Skill
- **`skill_id: "pptx"`**: Идентификатор PowerPoint Skill
- **`version: "latest"`**: Версия Skill установлена на самую недавно опубликованную
- **`tools`**: Включает выполнение кода (требуется для Skills)
- **Заголовки Beta**: `code-execution-2025-08-25` и `skills-2025-10-02`

Когда вы делаете этот запрос, Claude автоматически сопоставляет вашу задачу с соответствующим Skill. Поскольку вы попросили презентацию, Claude определяет, что PowerPoint Skill релевантен, и загружает его полные инструкции: второй уровень прогрессивного раскрытия. Затем Claude выполняет код Skill для создания вашей презентации.

## Шаг 3: Загрузка созданного файла

Презентация была создана в контейнере выполнения кода и сохранена как файл. Ответ включает ссылку на файл с ID файла. Извлеките ID файла и загрузите его, используя Files API:

<CodeGroup>
```python Python
# Extract file ID from response
file_id = None
for block in response.content:
    if block.type == 'tool_use' and block.name == 'code_execution':
        # File ID is in the tool result
        for result_block in block.content:
            if hasattr(result_block, 'file_id'):
                file_id = result_block.file_id
                break

if file_id:
    # Download the file
    file_content = client.beta.files.download(
        file_id=file_id,
        betas=["files-api-2025-04-14"]
    )

    # Save to disk
    with open("renewable_energy.pptx", "wb") as f:
        file_content.write_to_file(f.name)

    print(f"Presentation saved to renewable_energy.pptx")
```

```typescript TypeScript
// Extract file ID from response
let fileId: string | null = null;
for (const block of response.content) {
  if (block.type === 'tool_use' && block.name === 'code_execution') {
    // File ID is in the tool result
    for (const resultBlock of block.content) {
      if ('file_id' in resultBlock) {
        fileId = resultBlock.file_id;
        break;
      }
    }
  }
}

if (fileId) {
  // Download the file
  const fileContent = await client.beta.files.download(fileId, {
    betas: ['files-api-2025-04-14']
  });

  // Save to disk
  const fs = require('fs');
  fs.writeFileSync('renewable_energy.pptx', Buffer.from(await fileContent.arrayBuffer()));

  console.log('Presentation saved to renewable_energy.pptx');
}
```

```bash Shell
# Extract file_id from response (using jq)
FILE_ID=$(echo "$RESPONSE" | jq -r '.content[] | select(.type=="tool_use" and .name=="code_execution") | .content[] | select(.file_id) | .file_id')

# Download the file
curl "https://api.anthropic.com/v1/files/$FILE_ID/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output renewable_energy.pptx

echo "Presentation saved to renewable_energy.pptx"
```
</CodeGroup>

<Note>
Для полной информации о работе с созданными файлами смотрите [документацию инструмента выполнения кода](/docs/ru/agents-and-tools/tool-use/code-execution-tool#retrieve-generated-files).
</Note>

## Попробуйте больше примеров

Теперь, когда вы создали свой первый документ с Skills, попробуйте эти варианты:

### Создание электронной таблицы

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "xlsx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create a quarterly sales tracking spreadsheet with sample data"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'xlsx',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Create a quarterly sales tracking spreadsheet with sample data'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "xlsx",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Create a quarterly sales tracking spreadsheet with sample data"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

### Создание документа Word

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "docx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Write a 2-page report on the benefits of renewable energy"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'docx',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Write a 2-page report on the benefits of renewable energy'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "docx",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Write a 2-page report on the benefits of renewable energy"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

### Создание PDF

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "pdf",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Generate a PDF invoice template"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'pdf',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Generate a PDF invoice template'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "pdf",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Generate a PDF invoice template"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

## Следующие шаги

Теперь, когда вы использовали предварительно созданные Agent Skills, вы можете:

<CardGroup cols={2}>
  <Card
    title="API Guide"
    icon="book"
    href="/docs/ru/build-with-claude/skills-guide"
  >
    Использование Skills с Claude API
  </Card>
  <Card
    title="Create Custom Skills"
    icon="code"
    href="/docs/ru/api/skills/create-skill"
  >
    Загрузите свои собственные Skills для специализированных задач
  </Card>
  <Card
    title="Authoring Guide"
    icon="edit"
    href="/docs/ru/agents-and-tools/agent-skills/best-practices"
  >
    Изучите лучшие практики написания эффективных Skills
  </Card>
  <Card
    title="Use Skills in Claude Code"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Узнайте о Skills в Claude Code
  </Card>
  <Card
    title="Use Skills in the Agent SDK"
    icon="cube"
    href="/docs/ru/agent-sdk/skills"
  >
    Используйте Skills программно в TypeScript и Python
  </Card>
  <Card
    title="Agent Skills Cookbook"
    icon="book"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/skills/README.md"
  >
    Изучите примеры Skills и шаблоны реализации
  </Card>
</CardGroup>