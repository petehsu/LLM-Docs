# APIでAgent Skillsを始める

10分以内にClaude APIでAgent Skillsを使用してドキュメントを作成する方法を学びます。

---

このチュートリアルでは、Agent Skillsを使用してPowerPointプレゼンテーションを作成する方法を説明します。Skillsを有効にする方法、簡単なリクエストを作成する方法、生成されたファイルにアクセスする方法を学びます。

## 前提条件

- [Anthropic APIキー](/settings/keys)
- Python 3.7以上またはcurlがインストールされていること
- APIリクエストの基本的な知識

## Agent Skillsとは何ですか？

事前構築されたAgent Skillsは、ドキュメント作成、データ分析、ファイル処理などのタスク用の専門的な専門知識でClaudeの機能を拡張します。Anthropicは、APIで以下の事前構築されたAgent Skillsを提供しています：

- **PowerPoint (pptx)**: プレゼンテーションを作成および編集
- **Excel (xlsx)**: スプレッドシートを作成および分析
- **Word (docx)**: ドキュメントを作成および編集
- **PDF (pdf)**: PDFドキュメントを生成

<Note>
**カスタムSkillsを作成したいですか？** ドメイン固有の専門知識を持つ独自のSkillsを構築する例については、[Agent Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills)を参照してください。
</Note>

## ステップ1: 利用可能なSkillsをリストアップ

まず、利用可能なSkillsを確認しましょう。Skills APIを使用してすべてのAnthropicが管理するSkillsをリストアップします：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Anthropicが管理するSkillsをリストアップ
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

// Anthropicが管理するSkillsをリストアップ
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

以下のSkillsが表示されます：`pptx`、`xlsx`、`docx`、および`pdf`。

このAPIは各Skillのメタデータ（名前と説明）を返します。Claudeはこのメタデータをスタートアップ時に読み込んで、利用可能なSkillsを知ります。これは**段階的な情報開示**の最初のレベルであり、Claudeは完全な指示をまだ読み込まずにSkillsを発見します。

## ステップ2: プレゼンテーションを作成

次に、PowerPoint Skillを使用して再生可能エネルギーについてのプレゼンテーションを作成します。Messages APIで`container`パラメータを使用してSkillsを指定します：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# PowerPoint Skillでメッセージを作成
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

// PowerPoint Skillでメッセージを作成
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

各部分が何をするかを分解してみましょう：

- **`container.skills`**: Claudeが使用できるSkillsを指定
- **`type: "anthropic"`**: これがAnthropicが管理するSkillであることを示す
- **`skill_id: "pptx"`**: PowerPoint Skillの識別子
- **`version: "latest"`**: Skillバージョンを最新公開版に設定
- **`tools`**: コード実行を有効にする（Skillsに必須）
- **ベータヘッダー**: `code-execution-2025-08-25`と`skills-2025-10-02`

このリクエストを作成すると、Claudeは自動的にタスクを関連するSkillにマッチングします。プレゼンテーションをリクエストしたため、Claudeはそれが関連していると判断し、PowerPoint Skillの完全な指示を読み込みます。これは段階的な情報開示の2番目のレベルです。その後、Claudeはプレゼンテーションを作成するためにSkillのコードを実行します。

## ステップ3: 作成されたファイルをダウンロード

プレゼンテーションはコード実行コンテナで作成され、ファイルとして保存されました。レスポンスにはファイルIDを含むファイル参照が含まれています。ファイルIDを抽出し、Files APIを使用してダウンロードします：

<CodeGroup>
```python Python
# レスポンスからファイルIDを抽出
file_id = None
for block in response.content:
    if block.type == 'tool_use' and block.name == 'code_execution':
        # ファイルIDはツール結果に含まれている
        for result_block in block.content:
            if hasattr(result_block, 'file_id'):
                file_id = result_block.file_id
                break

if file_id:
    # ファイルをダウンロード
    file_content = client.beta.files.download(
        file_id=file_id,
        betas=["files-api-2025-04-14"]
    )

    # ディスクに保存
    with open("renewable_energy.pptx", "wb") as f:
        file_content.write_to_file(f.name)

    print(f"Presentation saved to renewable_energy.pptx")
```

```typescript TypeScript
// レスポンスからファイルIDを抽出
let fileId: string | null = null;
for (const block of response.content) {
  if (block.type === 'tool_use' && block.name === 'code_execution') {
    // ファイルIDはツール結果に含まれている
    for (const resultBlock of block.content) {
      if ('file_id' in resultBlock) {
        fileId = resultBlock.file_id;
        break;
      }
    }
  }
}

if (fileId) {
  // ファイルをダウンロード
  const fileContent = await client.beta.files.download(fileId, {
    betas: ['files-api-2025-04-14']
  });

  // ディスクに保存
  const fs = require('fs');
  fs.writeFileSync('renewable_energy.pptx', Buffer.from(await fileContent.arrayBuffer()));

  console.log('Presentation saved to renewable_energy.pptx');
}
```

```bash Shell
# レスポンスからfile_idを抽出（jqを使用）
FILE_ID=$(echo "$RESPONSE" | jq -r '.content[] | select(.type=="tool_use" and .name=="code_execution") | .content[] | select(.file_id) | .file_id')

# ファイルをダウンロード
curl "https://api.anthropic.com/v1/files/$FILE_ID/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output renewable_energy.pptx

echo "Presentation saved to renewable_energy.pptx"
```
</CodeGroup>

<Note>
生成されたファイルの操作に関する完全な詳細については、[コード実行ツールのドキュメント](/docs/ja/agents-and-tools/tool-use/code-execution-tool#retrieve-generated-files)を参照してください。
</Note>

## さらに多くの例を試す

Skillsで最初のドキュメントを作成したので、これらのバリエーションを試してください：

### スプレッドシートを作成

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

### Wordドキュメントを作成

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

### PDFを生成

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

## 次のステップ

事前構築されたAgent Skillsを使用したので、以下のことができます：

<CardGroup cols={2}>
  <Card
    title="APIガイド"
    icon="book"
    href="/docs/ja/build-with-claude/skills-guide"
  >
    Claude APIでSkillsを使用
  </Card>
  <Card
    title="カスタムSkillsを作成"
    icon="code"
    href="/docs/ja/api/skills/create-skill"
  >
    専門的なタスク用に独自のSkillsをアップロード
  </Card>
  <Card
    title="オーサリングガイド"
    icon="edit"
    href="/docs/ja/agents-and-tools/agent-skills/best-practices"
  >
    効果的なSkillsを作成するためのベストプラクティスを学ぶ
  </Card>
  <Card
    title="Claude CodeでSkillsを使用"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Claude CodeでのSkillsについて学ぶ
  </Card>
  <Card
    title="Agent SDKでSkillsを使用"
    icon="cube"
    href="/docs/ja/agent-sdk/skills"
  >
    TypeScriptとPythonでSkillsをプログラムで使用
  </Card>
  <Card
    title="Agent Skills Cookbook"
    icon="book"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/skills/README.md"
  >
    サンプルSkillsと実装パターンを探索
  </Card>
</CardGroup>