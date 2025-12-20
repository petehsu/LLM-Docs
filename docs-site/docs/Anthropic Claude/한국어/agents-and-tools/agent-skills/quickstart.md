# API에서 Agent Skills 시작하기

Claude API를 사용하여 Agent Skills로 문서를 만드는 방법을 10분 이내에 배웁니다.

---

이 튜토리얼은 Agent Skills를 사용하여 PowerPoint 프레젠테이션을 만드는 방법을 보여줍니다. Skills를 활성화하고, 간단한 요청을 하고, 생성된 파일에 액세스하는 방법을 배우게 됩니다.

## 필수 조건

- [Anthropic API 키](/settings/keys)
- Python 3.7+ 또는 curl 설치
- API 요청 만들기에 대한 기본 지식

## Agent Skills란 무엇입니까?

사전 구축된 Agent Skills는 문서 생성, 데이터 분석, 파일 처리와 같은 작업을 위한 전문 기술로 Claude의 기능을 확장합니다. Anthropic은 API에서 다음과 같은 사전 구축된 Agent Skills를 제공합니다:

- **PowerPoint (pptx)**: 프레젠테이션 생성 및 편집
- **Excel (xlsx)**: 스프레드시트 생성 및 분석
- **Word (docx)**: 문서 생성 및 편집
- **PDF (pdf)**: PDF 문서 생성

<Note>
**사용자 정의 Skills를 만들고 싶으신가요?** 도메인별 전문 지식을 가진 자신의 Skills를 구축하는 예제는 [Agent Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills)을 참조하세요.
</Note>

## 1단계: 사용 가능한 Skills 나열

먼저 사용 가능한 Skills를 확인해봅시다. Skills API를 사용하여 모든 Anthropic 관리 Skills를 나열합니다:

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

다음 Skills를 볼 수 있습니다: `pptx`, `xlsx`, `docx`, 그리고 `pdf`.

이 API는 각 Skill의 메타데이터(이름과 설명)를 반환합니다. Claude는 시작 시 이 메타데이터를 로드하여 사용 가능한 Skills를 알 수 있습니다. 이것은 Claude가 전체 지침을 아직 로드하지 않고 Skills를 발견하는 **점진적 공개**의 첫 번째 수준입니다.

## 2단계: 프레젠테이션 만들기

이제 PowerPoint Skill을 사용하여 재생 에너지에 대한 프레젠테이션을 만들겠습니다. Messages API에서 `container` 매개변수를 사용하여 Skills를 지정합니다:

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

각 부분이 하는 일을 분석해봅시다:

- **`container.skills`**: Claude가 사용할 수 있는 Skills를 지정합니다
- **`type: "anthropic"`**: 이것이 Anthropic 관리 Skill임을 나타냅니다
- **`skill_id: "pptx"`**: PowerPoint Skill 식별자
- **`version: "latest"`**: Skill 버전을 가장 최근에 게시된 버전으로 설정합니다
- **`tools`**: 코드 실행을 활성화합니다(Skills에 필수)
- **베타 헤더**: `code-execution-2025-08-25` 및 `skills-2025-10-02`

이 요청을 하면 Claude는 자동으로 작업을 관련 Skill과 일치시킵니다. 프레젠테이션을 요청했으므로 Claude는 PowerPoint Skill이 관련이 있다고 판단하고 전체 지침을 로드합니다: 점진적 공개의 두 번째 수준입니다. 그런 다음 Claude는 Skill의 코드를 실행하여 프레젠테이션을 만듭니다.

## 3단계: 생성된 파일 다운로드

프레젠테이션은 코드 실행 컨테이너에서 생성되었고 파일로 저장되었습니다. 응답에는 파일 ID가 있는 파일 참조가 포함됩니다. 파일 ID를 추출하고 Files API를 사용하여 다운로드합니다:

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
생성된 파일 작업에 대한 전체 세부 정보는 [코드 실행 도구 설명서](/docs/ko/agents-and-tools/tool-use/code-execution-tool#retrieve-generated-files)를 참조하세요.
</Note>

## 더 많은 예제 시도

이제 Skills로 첫 번째 문서를 만들었으므로 다음 변형을 시도해보세요:

### 스프레드시트 만들기

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

### Word 문서 만들기

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

### PDF 생성

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

## 다음 단계

이제 사전 구축된 Agent Skills를 사용했으므로 다음을 수행할 수 있습니다:

<CardGroup cols={2}>
  <Card
    title="API 가이드"
    icon="book"
    href="/docs/ko/build-with-claude/skills-guide"
  >
    Claude API와 함께 Skills 사용
  </Card>
  <Card
    title="사용자 정의 Skills 만들기"
    icon="code"
    href="/docs/ko/api/skills/create-skill"
  >
    특수한 작업을 위해 자신의 Skills 업로드
  </Card>
  <Card
    title="작성 가이드"
    icon="edit"
    href="/docs/ko/agents-and-tools/agent-skills/best-practices"
  >
    효과적인 Skills 작성을 위한 모범 사례 학습
  </Card>
  <Card
    title="Claude Code에서 Skills 사용"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Claude Code의 Skills에 대해 알아보기
  </Card>
  <Card
    title="Agent SDK에서 Skills 사용"
    icon="cube"
    href="/docs/ko/agent-sdk/skills"
  >
    TypeScript 및 Python에서 프로그래밍 방식으로 Skills 사용
  </Card>
  <Card
    title="Agent Skills Cookbook"
    icon="book"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/skills/README.md"
  >
    예제 Skills 및 구현 패턴 탐색
  </Card>
</CardGroup>