# Agent Skills

Agent Skillsは、Claudeの機能を拡張するモジュール型の機能です。各Skillは、Claudeが関連する場合に自動的に使用する指示、メタデータ、およびオプションのリソース（スクリプト、テンプレート）をパッケージ化します。

---

## Skillsを使用する理由

Skillsは、Claudeに領域固有の専門知識を提供する再利用可能なファイルシステムベースのリソースです。ワークフロー、コンテキスト、ベストプラクティスにより、汎用エージェントを専門家に変えます。プロンプト（1回限りのタスク用の会話レベルの指示）とは異なり、Skillsはオンデマンドで読み込まれ、複数の会話で同じガイダンスを繰り返し提供する必要がなくなります。

**主な利点**:
- **Claudeを専門化する**: 領域固有のタスク用に機能をカスタマイズする
- **繰り返しを削減する**: 1回作成して、自動的に使用する
- **機能を組み合わせる**: Skillsを組み合わせて複雑なワークフローを構築する

<Note>
Agent Skillsのアーキテクチャと実世界での応用についての詳細は、エンジニアリングブログをご覧ください: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)。
</Note>

## Skillsの使用

Anthropicは、一般的なドキュメントタスク（PowerPoint、Excel、Word、PDF）用の事前構築されたAgent Skillsを提供しており、独自のカスタムSkillsを作成することもできます。どちらも同じ方法で機能します。Claudeはリクエストに関連する場合、自動的にそれらを使用します。

**事前構築されたAgent Skills**は、claude.aiおよびClaude APIを通じてすべてのユーザーが利用できます。完全なリストについては、以下の[利用可能なSkills](#available-skills)セクションを参照してください。

**カスタムSkills**を使用すると、領域の専門知識と組織の知識をパッケージ化できます。これらはClaudeのすべての製品で利用可能です。Claude Codeで作成するか、APIを通じてアップロードするか、claude.aiの設定に追加します。

<Note>
**はじめに:**
- 事前構築されたAgent Skillsの場合: [クイックスタートチュートリアル](/docs/ja/agents-and-tools/agent-skills/quickstart)を参照して、APIでPowerPoint、Excel、Word、およびPDF Skillsの使用を開始してください
- カスタムSkillsの場合: [Agent Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills)を参照して、独自のSkillsを作成する方法を学んでください
</Note>

## Skillsの仕組み

SkillsはClaudeのVM環境を活用して、プロンプトだけでは不可能な機能を提供します。Claudeは仮想マシンで動作し、ファイルシステムアクセスを備えており、Skillsは指示、実行可能コード、参考資料を含むディレクトリとして存在し、新しいチームメンバー用に作成するオンボーディングガイドのように整理されています。

このファイルシステムベースのアーキテクチャは、**段階的な情報開示**を実現します。Claudeは事前にコンテキストを消費するのではなく、必要に応じて段階的に情報を読み込みます。

### 3つのタイプのSkillコンテンツ、3つのレベルの読み込み

Skillsには3つのタイプのコンテンツを含めることができ、それぞれ異なる時間に読み込まれます:

### レベル1: メタデータ（常に読み込まれる）

**コンテンツタイプ: 指示**。SkillのYAMLフロントマターは検出情報を提供します:

```yaml
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
---
```

Claudeはこのメタデータをスタートアップ時に読み込み、システムプロンプトに含めます。この軽量なアプローチにより、コンテキストペナルティなしに多くのSkillsをインストールできます。Claudeは各Skillが存在し、いつ使用するかを知っているだけです。

### レベル2: 指示（トリガーされたときに読み込まれる）

**コンテンツタイプ: 指示**。SKILL.mdのメインボディには、手続き的な知識が含まれています。ワークフロー、ベストプラクティス、ガイダンス:

````markdown
# PDF Processing

## Quick start

Use pdfplumber to extract text from PDFs:

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

For advanced form filling, see [FORMS.md](FORMS.md).
````

Skillの説明に一致するものをリクエストすると、Claudeはbashを介してファイルシステムからSKILL.mdを読み込みます。その後、このコンテンツがコンテキストウィンドウに入ります。

### レベル3: リソースとコード（必要に応じて読み込まれる）

**コンテンツタイプ: 指示、コード、リソース**。Skillsは追加の資料をバンドルできます:

```
pdf-skill/
├── SKILL.md (main instructions)
├── FORMS.md (form-filling guide)
├── REFERENCE.md (detailed API reference)
└── scripts/
    └── fill_form.py (utility script)
```

**指示**: 特殊なガイダンスとワークフローを含む追加のマークダウンファイル（FORMS.md、REFERENCE.md）

**コード**: Claudeがbashを介して実行する実行可能スクリプト（fill_form.py、validate.py）。スクリプトはコンテキストを消費せずに決定論的な操作を提供します

**リソース**: データベーススキーマ、APIドキュメント、テンプレート、例などの参考資料

Claudeはこれらのファイルに参照されたときのみアクセスします。ファイルシステムモデルは、各コンテンツタイプが異なる強みを持つことを意味します。指示は柔軟なガイダンス用、コードは信頼性用、リソースは事実上の参照用です。

| レベル | 読み込まれるタイミング | トークンコスト | コンテンツ |
|---|---|---|---|
| **レベル1: メタデータ** | 常に（スタートアップ時） | Skill当たり約100トークン | YAMLフロントマターの`name`と`description` |
| **レベル2: 指示** | Skillがトリガーされたとき | 5000トークン未満 | 指示とガイダンスを含むSKILL.mdボディ |
| **レベル3以上: リソース** | 必要に応じて | 実質的に無制限 | bashを介して実行されるバンドルファイル、コンテキストに読み込まれない |

段階的な情報開示により、任意の時点で関連するコンテンツのみがコンテキストウィンドウを占有することが保証されます。

### Skillsアーキテクチャ

Skillsはコード実行環境で実行され、Claudeはファイルシステムアクセス、bashコマンド、コード実行機能を備えています。これは次のようなものです。Skillsは仮想マシン上のディレクトリとして存在し、Claudeはコンピュータ上のファイルをナビゲートするのに使用するのと同じbashコマンドを使用してそれらと相互作用します。

![Agent Skills Architecture - showing how Skills integrate with the agent's configuration and virtual machine](/docs/images/agent-skills-architecture.png)

**Claudeがスキルコンテンツにアクセスする方法:**

Skillがトリガーされると、Claudeはbashを使用してファイルシステムからSKILL.mdを読み込み、その指示をコンテキストウィンドウに取り込みます。これらの指示が他のファイル（FORMS.mdやデータベーススキーマなど）を参照している場合、Claudeは追加のbashコマンドを使用してそれらのファイルも読み込みます。指示が実行可能スクリプトに言及している場合、Claudeはそれらをbashを介して実行し、出力のみを受け取ります（スクリプトコード自体はコンテキストに入りません）。

**このアーキテクチャが実現するもの:**

**オンデマンドファイルアクセス**: Claudeは各特定のタスクに必要なファイルのみを読み込みます。Skillには数十の参照ファイルを含めることができますが、タスクが販売スキーマのみを必要とする場合、Claudeはそのファイルのみを読み込みます。残りはファイルシステムに残り、ゼロトークンを消費します。

**効率的なスクリプト実行**: Claudeが`validate_form.py`を実行すると、スクリプトのコードはコンテキストウィンドウに読み込まれません。スクリプトの出力のみ（「検証に成功しました」や特定のエラーメッセージなど）がトークンを消費します。これにより、スクリプトはClaudeが同等のコードをその場で生成するよりもはるかに効率的になります。

**バンドルコンテンツに実質的な制限なし**: ファイルはアクセスされるまでコンテキストを消費しないため、Skillsは包括的なAPIドキュメント、大規模なデータセット、広範な例、または必要な参考資料を含めることができます。使用されていないバンドルコンテンツのコンテキストペナルティはありません。

このファイルシステムベースのモデルが段階的な情報開示を機能させるものです。Claudeはオンボーディングガイドの特定のセクションを参照するのと同じように、各タスクが必要とするものに正確にアクセスして、Skillをナビゲートします。

### 例: PDFプロセッシングスキルの読み込み

Claudeがどのようにして、PDFプロセッシングスキルを読み込んで使用するかを示します:

1. **スタートアップ**: システムプロンプトに含まれるもの: `PDF Processing - Extract text and tables from PDF files, fill forms, merge documents`
2. **ユーザーリクエスト**: 「このPDFからテキストを抽出して要約してください」
3. **Claudeが呼び出す**: `bash: read pdf-skill/SKILL.md` → 指示がコンテキストに読み込まれる
4. **Claudeが判断する**: フォーム入力は必要ないため、FORMS.mdは読み込まれない
5. **Claudeが実行する**: SKILL.mdからの指示を使用してタスクを完了する

![Skills loading into context window - showing the progressive loading of skill metadata and content](/docs/images/agent-skills-context-window.png)

図は以下を示しています:
1. システムプロンプトとスキルメタデータが事前に読み込まれたデフォルト状態
2. Claudeがbashを介してSKILL.mdを読み込むことでスキルをトリガーする
3. Claudeが必要に応じてFORMS.mdなどの追加バンドルファイルを読み込む
4. Claudeがタスクを進める

この動的読み込みにより、関連するスキルコンテンツのみがコンテキストウィンドウを占有することが保証されます。

## Skillsが機能する場所

Skillsはクラウドのエージェント製品全体で利用可能です:

### Claude API

Claude APIは、事前構築されたAgent SkillsとカスタムSkillsの両方をサポートしています。どちらも同じように機能します。`container`パラメータでコード実行ツールとともに関連する`skill_id`を指定します。

**前提条件**: APIを介してSkillsを使用するには、3つのベータヘッダーが必要です:
- `code-execution-2025-08-25` - Skillsはコード実行コンテナで実行される
- `skills-2025-10-02` - Skillsの機能を有効にする
- `files-api-2025-04-14` - コンテナへのファイルのアップロード/ダウンロードに必要

事前構築されたAgent Skillsは、その`skill_id`（例：`pptx`、`xlsx`）を参照することで使用するか、Skills API（`/v1/skills`エンドポイント）を介して独自のものを作成およびアップロードします。カスタムSkillsは組織全体で共有されます。

詳細については、[Claude APIでSkillsを使用する](/docs/ja/build-with-claude/skills-guide)を参照してください。

### Claude Code

[Claude Code](https://code.claude.com/docs/overview)はカスタムSkillsのみをサポートしています。

**カスタムSkills**: SKILL.mdファイルを含むディレクトリとしてSkillsを作成します。Claudeはそれらを自動的に検出して使用します。

Claude CodeのカスタムSkillsはファイルシステムベースであり、APIアップロードは必要ありません。

詳細については、[Claude CodeでSkillsを使用する](https://code.claude.com/docs/skills)を参照してください。

### Claude Agent SDK

[Claude Agent SDK](/docs/ja/agent-sdk/overview)はファイルシステムベースの設定を通じてカスタムSkillsをサポートしています。

**カスタムSkills**: `.claude/skills/`にSKILL.mdファイルを含むディレクトリとしてSkillsを作成します。`allowed_tools`設定に`"Skill"`を含めることでSkillsを有効にします。

Agent SDKのSkillsは、SDKが実行されるときに自動的に検出されます。

詳細については、[SDK内のAgent Skills](/docs/ja/agent-sdk/skills)を参照してください。

### Claude.ai

[Claude.ai](https://claude.ai)は、事前構築されたAgent SkillsとカスタムSkillsの両方をサポートしています。

**事前構築されたAgent Skills**: これらのSkillsは、ドキュメントを作成するときにバックグラウンドで既に機能しています。Claudeはセットアップを必要とせずにそれらを使用します。

**カスタムSkills**: Settings > Featuresを通じてzipファイルとして独自のSkillsをアップロードします。コード実行が有効になっているPro、Max、Team、およびEnterpriseプランで利用可能です。カスタムSkillsは各ユーザーに個別のものであり、組織全体で共有されず、管理者によって一元管理することはできません。

Claude.aiでSkillsを使用する方法の詳細については、Claude Help Centerの以下のリソースを参照してください:
- [Skillsとは何ですか?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Claude内でSkillsを使用する](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [カスタムSkillsを作成する方法](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Skillsを使用してClaudeの作業方法を教える](https://support.claude.com/en/articles/12580051-teach-claude-your-way-of-working-using-skills)

## Skillの構造

すべてのSkillには、YAMLフロントマターを含む`SKILL.md`ファイルが必要です:

```yaml
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
[Clear, step-by-step guidance for Claude to follow]

## Examples
[Concrete examples of using this Skill]
```

**必須フィールド**: `name`と`description`

**フィールド要件**:

`name`:
- 最大64文字
- 小文字、数字、ハイフンのみを含む必要があります
- XMLタグを含めることはできません
- 予約語を含めることはできません: 「anthropic」、「claude」

`description`:
- 空にすることはできません
- 最大1024文字
- XMLタグを含めることはできません

`description`には、Skillが何をするか、およびClaudeがいつそれを使用すべきかの両方を含める必要があります。完全なオーサリングガイダンスについては、[ベストプラクティスガイド](/docs/ja/agents-and-tools/agent-skills/best-practices)を参照してください。

## セキュリティに関する考慮事項

Skillsは信頼できるソースからのみ使用することを強くお勧めします。自分で作成したか、Anthropicから取得したものです。Skillsは指示とコードを通じてClaudeに新しい機能を提供し、これにより強力になりますが、悪意のあるSkillがClaudeにツールを呼び出すか、Skillの記載目的と一致しない方法でコードを実行するよう指示できることも意味します。

<Warning>
信頼できない、または不明なソースからSkillを使用する必要がある場合は、細心の注意を払い、使用前に徹底的に監査してください。Claudeがスキルを実行するときにアクセスできるものに応じて、悪意のあるSkillsはデータ流出、不正なシステムアクセス、またはその他のセキュリティリスクにつながる可能性があります。
</Warning>

**主なセキュリティに関する考慮事項**:
- **徹底的に監査する**: Skillにバンドルされているすべてのファイルを確認します。SKILL.md、スクリプト、画像、およびその他のリソース。予期しないネットワーク呼び出し、ファイルアクセスパターン、またはSkillの記載目的と一致しない操作などの異常なパターンを探します
- **外部ソースはリスク**: 外部URLからデータを取得するSkillsは特に危険です。取得されたコンテンツに悪意のある指示が含まれている可能性があるためです。信頼できるSkillsでも、外部依存関係が時間とともに変わると侵害される可能性があります
- **ツールの悪用**: 悪意のあるSkillsは、有害な方法でツール（ファイル操作、bashコマンド、コード実行）を呼び出すことができます
- **データ露出**: 機密データへのアクセス権を持つSkillsは、情報を外部システムに漏らすように設計される可能性があります
- **ソフトウェアのインストールのように扱う**: 信頼できるソースからのみSkillsを使用してください。機密データまたは重要な操作へのアクセス権を持つ本番システムにSkillsを統合する場合は特に注意してください

## 利用可能なSkills

### 事前構築されたAgent Skills

以下の事前構築されたAgent Skillsは、すぐに使用できます:

- **PowerPoint (pptx)**: プレゼンテーションを作成し、スライドを編集し、プレゼンテーションコンテンツを分析する
- **Excel (xlsx)**: スプレッドシートを作成し、データを分析し、チャート付きレポートを生成する
- **Word (docx)**: ドキュメントを作成し、コンテンツを編集し、テキストをフォーマットする
- **PDF (pdf)**: フォーマットされたPDFドキュメントとレポートを生成する

これらのSkillsはClaude APIおよびclaude.aiで利用可能です。[クイックスタートチュートリアル](/docs/ja/agents-and-tools/agent-skills/quickstart)を参照して、APIでそれらの使用を開始してください。

### カスタムSkillsの例

カスタムSkillsの完全な例については、[Skills cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills)を参照してください。

## 制限事項と制約

これらの制限事項を理解することは、Skillsのデプロイメントを効果的に計画するのに役立ちます。

### クロスサーフェス可用性

**カスタムSkillsはサーフェス間で同期されません**。1つのサーフェスにアップロードされたSkillsは、他のサーフェスで自動的に利用可能になりません:

- Claude.aiにアップロードされたSkillsはAPIに別途アップロードする必要があります
- APIを介してアップロードされたSkillsはClaude.aiで利用できません
- Claude Code Skillsはファイルシステムベースであり、Claude.aiとAPIの両方から分離されています

Skillsを使用する各サーフェスに対して、Skillsを個別に管理およびアップロードする必要があります。

### 共有スコープ

Skillsは、使用する場所に応じて異なる共有モデルを持ちます:
- **Claude.ai**: 個別ユーザーのみ。各チームメンバーは個別にアップロードする必要があります
- **Claude API**: ワークスペース全体。すべてのワークスペースメンバーはアップロードされたSkillsにアクセスできます
- **Claude Code**: 個人（`~/.claude/skills/`）またはプロジェクトベース（`.claude/skills/`）

Claude.aiは現在、カスタムSkillsの一元管理または組織全体の配布をサポートしていません。

### ランタイム環境の制約

Skillsはコード実行コンテナで実行され、以下の制限があります:

- **ネットワークアクセスなし**: Skillsは外部API呼び出しを行ったり、インターネットにアクセスしたりすることはできません
- **ランタイムパッケージのインストールなし**: 事前にインストールされたパッケージのみが利用可能です。実行中に新しいパッケージをインストールすることはできません。
- **事前設定された依存関係のみ**: [コード実行ツールドキュメント](/docs/ja/agents-and-tools/tool-use/code-execution-tool)で利用可能なパッケージのリストを確認してください

これらの制約内で機能するようにSkillsを計画してください。

## 次のステップ

<CardGroup cols={2}>
  <Card
    title="Agent Skillsを始める"
    icon="graduation-cap"
    href="/docs/ja/agents-and-tools/agent-skills/quickstart"
  >
    最初のSkillを作成する
  </Card>
  <Card
    title="APIガイド"
    icon="code"
    href="/docs/ja/build-with-claude/skills-guide"
  >
    Claude APIでSkillsを使用する
  </Card>
  <Card
    title="Claude CodeでSkillsを使用する"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Claude CodeでカスタムSkillsを作成および管理する
  </Card>
  <Card
    title="Agent SDKでSkillsを使用する"
    icon="cube"
    href="/docs/ja/agent-sdk/skills"
  >
    TypeScriptとPythonでSkillsをプログラムで使用する
  </Card>
  <Card
    title="オーサリングのベストプラクティス"
    icon="lightbulb"
    href="/docs/ja/agents-and-tools/agent-skills/best-practices"
  >
    Claudeが効果的に使用できるSkillsを書く
  </Card>
</CardGroup>