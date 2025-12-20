# コンピュータ使用ツール

Claudeがコンピュータ環境と対話するためのコンピュータ使用ツール。スクリーンショット機能とマウス/キーボード制御を提供します。

---

Claudeはコンピュータ使用ツールを通じてコンピュータ環境と対話できます。このツールはスクリーンショット機能とマウス/キーボード制御を提供し、自律的なデスクトップ操作を可能にします。

<Note>
コンピュータ使用は現在ベータ版であり、[ベータヘッダー](/docs/ja/api/beta-headers)が必要です:
- Claude Opus 4.5の場合は`"computer-use-2025-11-24"`
- Claude Sonnet 4.5、Haiku 4.5、Opus 4.1、Sonnet 4、Opus 4、Sonnet 3.7の場合は`"computer-use-2025-01-24"`（[非推奨](/docs/ja/about-claude/model-deprecations)）
</Note>

## 概要

コンピュータ使用はベータ機能で、Claudeがデスクトップ環境と対話できるようにします。このツールは以下を提供します:

- **スクリーンショットキャプチャ**: 現在画面に表示されているものを確認
- **マウス制御**: クリック、ドラッグ、カーソル移動
- **キーボード入力**: テキスト入力とキーボードショートカット
- **デスクトップオートメーション**: あらゆるアプリケーションやインターフェースと対話

コンピュータ使用はbashやテキストエディタなどの他のツールで拡張でき、より包括的なオートメーションワークフローが可能ですが、コンピュータ使用は特にコンピュータ使用ツールのデスクトップ環境を見て制御する機能を指します。

## モデル互換性

コンピュータ使用は以下のClaudeモデルで利用可能です:

| モデル | ツールバージョン | ベータフラグ |
|-------|--------------|-----------|
| Claude Opus 4.5 | `computer_20251124` | `computer-use-2025-11-24` |
| その他すべてのサポートモデル | `computer_20250124` | `computer-use-2025-01-24` |

<Note>
Claude Opus 4.5は、詳細なスクリーン領域検査用のズームアクションを含む新機能を備えた`computer_20251124`ツールバージョンを導入しています。その他すべてのモデル（Sonnet 4.5、Haiku 4.5、Sonnet 4、Opus 4、Opus 4.1、Sonnet 3.7）は`computer_20250124`ツールバージョンを使用します。
</Note>

<Warning>
古いツールバージョンは、新しいモデルとの下位互換性が保証されていません。常にモデルバージョンに対応するツールバージョンを使用してください。
</Warning>

## セキュリティに関する考慮事項

<Warning>
コンピュータ使用はベータ機能で、標準的なAPI機能とは異なるユニークなリスクがあります。インターネットと対話する場合、これらのリスクはさらに高まります。リスクを最小化するために、以下のような予防措置を検討してください:

1. 直接的なシステム攻撃や事故を防ぐため、最小限の権限を持つ専用の仮想マシンまたはコンテナを使用します。
2. 情報盗難を防ぐため、アカウントログイン情報などの機密データへのアクセスをモデルに与えないようにします。
3. 悪意のあるコンテンツへの露出を減らすため、インターネットアクセスをドメインのホワイトリストに制限します。
4. 実世界に意味のある結果をもたらす可能性のある決定、およびクッキーの受け入れ、金融取引の実行、利用規約への同意など肯定的な同意が必要なタスクについては、人間に確認を求めます。

状況によっては、Claudeはユーザーの指示と矛盾していても、コンテンツ内で見つかったコマンドに従う場合があります。例えば、Webページ内または画像に含まれるClaude指示は、ユーザーの指示をオーバーライドしたり、Claudeが間違いを犯す原因となる可能性があります。Claudeをプロンプトインジェクション関連のリスクから保護するため、機密データとアクションから隔離することをお勧めします。

私たちはモデルをこれらのプロンプトインジェクションに耐性を持つようにトレーニングし、追加の防御層を追加しました。コンピュータ使用ツールを使用する場合、プロンプトインジェクションの可能性がある場合を自動的にフラグを立てるために、プロンプトに対して分類器を自動的に実行します。これらの分類器がスクリーンショット内でプロンプトインジェクションの可能性を特定した場合、次のアクションに進む前にユーザーの確認を求めるようにモデルを自動的に誘導します。この追加の保護がすべてのユースケースに理想的ではないことを認識しています（例えば、人間がループに含まれていないユースケース）。オプトアウトしてオフにしたい場合は、[お問い合わせください](https://support.claude.com/en/)。

プロンプトインジェクション関連のリスクを回避するため、Claudeを機密データとアクションから隔離することをお勧めします。

最後に、独自の製品でコンピュータ使用を有効にする前に、エンドユーザーに関連するリスクを通知し、同意を得てください。

</Warning>

<Card
  title="コンピュータ使用リファレンス実装"
  icon="computer"
  href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
>

Webインターフェース、Dockerコンテナ、ツール実装例、エージェントループを含むコンピュータ使用リファレンス実装で素早く開始できます。

**注**: 実装はClaude 4モデルとClaude Sonnet 3.7の両方の新しいツールを含むように更新されています。これらの新機能にアクセスするには、必ずリポジトリの最新バージョンをプルしてください。

</Card>

<Tip>
  [このフォーム](https://forms.gle/BT1hpBrqDPDUrCqo7)を使用して、モデル応答の品質、API自体、またはドキュメントの品質についてフィードバックを提供してください。皆様からのご意見をお待ちしています!
</Tip>

## クイックスタート

コンピュータ使用を開始する方法は以下の通りです:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",  # または別の互換モデル
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
    messages=[{"role": "user", "content": "Save a picture of a cat to my desktop."}],
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
        "content": "Save a picture of a cat to my desktop."
      }
    ]
  }'
```
</CodeGroup>

<Note>
ベータヘッダーはコンピュータ使用ツールにのみ必要です。

上記の例は3つのツールすべてが一緒に使用されている場合を示しており、コンピュータ使用ツールが含まれているため、ベータヘッダーが必要です。
</Note>

---

## コンピュータ使用の仕組み

<Steps>
  <Step
    title="1. Claudeにコンピュータ使用ツールとユーザープロンプトを提供する"
    icon="tool"
  >
    - APIリクエストにコンピュータ使用ツール（およびオプションで他のツール）を追加します。
    - デスクトップ操作が必要なユーザープロンプトを含めます。例えば、「デスクトップに猫の写真を保存してください」など。
  </Step>
  <Step title="2. Claudeがコンピュータ使用ツールを使用することを決定する" icon="wrench">
    - Claudeはコンピュータ使用ツールがユーザーのクエリに役立つかどうかを評価します。
    - はいの場合、Claudeは適切にフォーマットされたツール使用リクエストを構築します。
    - APIレスポンスは`stop_reason`が`tool_use`となり、Claudeの意図を示します。
  </Step>
  <Step
    title="3. ツール入力を抽出し、コンピュータ上でツールを評価し、結果を返す"
    icon="computer"
  >
    - あなたの側で、Claudeのリクエストからツール名と入力を抽出します。
    - コンテナまたは仮想マシン上でツールを使用します。
    - `tool_result`コンテンツブロックを含む新しい`user`メッセージで会話を続けます。
  </Step>
  <Step
    title="4. Claudeはタスクが完了するまでコンピュータ使用ツールの呼び出しを続ける"
    icon="arrows-clockwise"
  >
    - Claudeはツール結果を分析して、さらにツール使用が必要か、タスクが完了したかを判断します。
    - Claudeが別のツールが必要だと判断した場合、別の`tool_use` `stop_reason`で応答し、ステップ3に戻る必要があります。
    - そうでない場合、ユーザーへのテキスト応答を作成します。
  </Step>
</Steps>

ユーザー入力なしでステップ3と4の繰り返しを「エージェントループ」と呼びます。つまり、Claudeがツール使用リクエストで応答し、アプリケーションがそのリクエストの評価結果でClaudeに応答します。

### コンピューティング環境

コンピュータ使用には、Claudeがアプリケーションとウェブと安全に対話できるサンドボックス化されたコンピューティング環境が必要です。この環境には以下が含まれます:

1. **仮想ディスプレイ**: 仮想X11ディスプレイサーバー（Xvfbを使用）で、Claudeがスクリーンショットを通じて見て、マウス/キーボードアクションで制御するデスクトップインターフェースをレンダリングします。

2. **デスクトップ環境**: Linuxで実行される軽量UI（ウィンドウマネージャーMutter、パネルTint2）で、Claudeが対話するための一貫したグラフィカルインターフェースを提供します。

3. **アプリケーション**: Firefox、LibreOffice、テキストエディタ、ファイルマネージャなど、Claudeがタスク完了に使用できるプリインストールされたLinuxアプリケーション。

4. **ツール実装**: Claudeの抽象的なツールリクエスト（「マウスを移動」や「スクリーンショットを撮る」など）を仮想環境での実際の操作に変換する統合コード。

5. **エージェントループ**: Claudeと環境間の通信を処理し、Claudeのアクションを環境に送信し、結果（スクリーンショット、コマンド出力）をClaudeに返すプログラム。

コンピュータ使用を使用する場合、Claudeはこの環境に直接接続しません。代わりに、アプリケーションが:

1. Claudeのツール使用リクエストを受け取ります
2. それらをコンピューティング環境のアクションに変換します
3. 結果（スクリーンショット、コマンド出力など）をキャプチャします
4. これらの結果をClaudeに返します

セキュリティと隔離のため、リファレンス実装はすべてをDockerコンテナ内で実行し、環境の表示と対話のための適切なポートマッピングを備えています。

---

## コンピュータ使用の実装方法

### リファレンス実装から開始する

コンピュータ使用を素早く開始するために必要なすべてを含む[リファレンス実装](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)を構築しました:

- Claudeでのコンピュータ使用に適した[コンテナ化環境](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile)
- [コンピュータ使用ツール](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools)の実装
- Claude APIと対話し、コンピュータ使用ツールを実行する[エージェントループ](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py)
- コンテナ、エージェントループ、ツールと対話するWebインターフェース。

### マルチエージェントループの理解

コンピュータ使用の中核は「エージェントループ」です。Claudeがツールアクションをリクエストし、アプリケーションがそれらを実行し、結果をClaudeに返すサイクルです。簡略化された例を以下に示します:

```python
async def sampling_loop(
    *,
    model: str,
    messages: list[dict],
    api_key: str,
    max_tokens: int = 4096,
    tool_version: str,
    thinking_budget: int | None = None,
    max_iterations: int = 10,  # 無限ループを防ぐため反復制限を追加
):
    """
    Claudeコンピュータ使用対話用のシンプルなエージェントループ。

    この関数は以下の間のやり取りを処理します:
    1. ユーザーメッセージをClaudeに送信
    2. Claudeがツール使用をリクエスト
    3. アプリケーションがそれらのツールを実行
    4. ツール結果をClaudeに送信
    """
    # ツールとAPIパラメータを設定
    client = Anthropic(api_key=api_key)
    beta_flag = "computer-use-2025-01-24" if "20250124" in tool_version else "computer-use-2024-10-22"

    # ツールを設定 - これらは他の場所で既に初期化されているはずです
    tools = [
        {"type": f"computer_{tool_version}", "name": "computer", "display_width_px": 1024, "display_height_px": 768},
        {"type": f"text_editor_{tool_version}", "name": "str_replace_editor"},
        {"type": f"bash_{tool_version}", "name": "bash"}
    ]

    # メインエージェントループ（実行不可能なAPIコストを防ぐため反復制限付き）
    iterations = 0
    while True and iterations < max_iterations:
        iterations += 1
        # オプションの思考パラメータを設定（Claude Sonnet 3.7用）
        thinking = None
        if thinking_budget:
            thinking = {"type": "enabled", "budget_tokens": thinking_budget}

        # Claude APIを呼び出す
        response = client.beta.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
            tools=tools,
            betas=[beta_flag],
            thinking=thinking
        )

        # Claudeの応答を会話履歴に追加
        response_content = response.content
        messages.append({"role": "assistant", "content": response_content})

        # Claudeがツールを使用したかどうかを確認
        tool_results = []
        for block in response_content:
            if block.type == "tool_use":
                # 実際のアプリケーションでは、ここでツールを実行します
                # 例: result = run_tool(block.name, block.input)
                result = {"result": "Tool executed successfully"}

                # Claudeの結果をフォーマット
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        # ツールが使用されなかった場合、Claudeは完了 - 最終メッセージを返す
        if not tool_results:
            return messages

        # 次のClaudeイテレーション用にメッセージにツール結果を追加
        messages.append({"role": "user", "content": tool_results})
```

ループは、Claudeがツールをリクエストせずに応答するか（タスク完了）、最大反復制限に達するまで続きます。このセーフガードは、予期しないAPIコストをもたらす可能性のある無限ループを防ぎます。

リファレンス実装を試してから、このドキュメントの残りを読むことをお勧めします。

### プロンプティングでモデルパフォーマンスを最適化する

最高品質の出力を得るためのいくつかのヒントを以下に示します:

1. シンプルで明確に定義されたタスクを指定し、各ステップに対して明示的な指示を提供します。
2. Claudeは明示的に結果を確認せずにアクションの結果を想定することがあります。これを防ぐために、Claudeに`各ステップの後、スクリーンショットを撮り、正しい結果を達成したかどうかを慎重に評価してください。明示的に思考を示してください：「ステップXを評価しました...」。正しくない場合は、もう一度試してください。ステップが正しく実行されたことを確認した場合のみ、次のステップに進んでください。`とプロンプトを入力します。
3. 一部のUI要素（ドロップダウンやスクロールバーなど）は、マウス移動を使用してClaudeが操作するのが難しい場合があります。これが発生した場合は、モデルにキーボードショートカットを使用するようにプロンプトを入力してみてください。
4. 繰り返し可能なタスクまたはUI操作の場合、成功した結果のスクリーンショットとツール呼び出しの例をプロンプトに含めます。
5. モデルがログインする必要がある場合、ユーザー名とパスワードを`<robot_credentials>`などのxmlタグ内のプロンプトで提供します。ログインが必要なアプリケーション内でコンピュータ使用を使用すると、プロンプトインジェクションの結果として悪い結果のリスクが増加します。モデルにログイン認証情報を提供する前に、[プロンプトインジェクション軽減ガイド](/docs/ja/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)を確認してください。

<Tip>
  明確な問題のセットに繰り返し遭遇する場合、またはClaudeが完了する必要があるタスクを事前に知っている場合は、システムプロンプトを使用して、Claudeにタスクを成功させる方法に関する明示的なヒントまたは指示を提供します。
</Tip>

### システムプロンプト

Anthropic定義のツールの1つがClaude APIを通じてリクエストされると、コンピュータ使用固有のシステムプロンプトが生成されます。これは[ツール使用システムプロンプト](/docs/ja/agents-and-tools/tool-use/implement-tool-use#tool-use-system-prompt)に似ていますが、以下で始まります:

> You have access to a set of functions you can use to answer the user's question. This includes access to a sandboxed computing environment. You do NOT currently have the ability to inspect files or interact with external resources, except by invoking the below functions.

通常のツール使用と同様に、ユーザー提供の`system_prompt`フィールドは依然として尊重され、結合されたシステムプロンプトの構築で使用されます。

### 利用可能なアクション

コンピュータ使用ツールは以下のアクションをサポートしています:

**基本アクション（すべてのバージョン）**
- **screenshot** - 現在のディスプレイをキャプチャ
- **left_click** - 座標`[x, y]`でクリック
- **type** - テキスト文字列を入力
- **key** - キーまたはキーの組み合わせを押す（例："ctrl+s"）
- **mouse_move** - カーソルを座標に移動

**拡張アクション（`computer_20250124`）**
Claude 4モデルとClaude Sonnet 3.7で利用可能:
- **scroll** - 任意の方向にスクロール、量制御可能
- **left_click_drag** - 座標間でクリックしてドラッグ
- **right_click**、**middle_click** - 追加のマウスボタン
- **double_click**、**triple_click** - 複数クリック
- **left_mouse_down**、**left_mouse_up** - 細粒度のクリック制御
- **hold_key** - 他のアクションを実行中にキーを保持
- **wait** - アクション間で一時停止

**拡張アクション（`computer_20251124`）**
Claude Opus 4.5で利用可能:
- `computer_20250124`のすべてのアクション
- **zoom** - スクリーン領域を全解像度で表示。ツール定義で`enable_zoom: true`が必要。検査する領域の左上と右下の角を定義する座標`[x1, y1, x2, y2]`を持つ`region`パラメータを取ります。

<section title="アクション例">

```json
// スクリーンショットを撮る
{
  "action": "screenshot"
}

// 位置でクリック
{
  "action": "left_click",
  "coordinate": [500, 300]
}

// テキストを入力
{
  "action": "type",
  "text": "Hello, world!"
}

// 下にスクロール（Claude 4/3.7）
{
  "action": "scroll",
  "coordinate": [500, 400],
  "scroll_direction": "down",
  "scroll_amount": 3
}

// 領域にズーム詳細表示（Opus 4.5）
{
  "action": "zoom",
  "region": [100, 200, 400, 350]
}
```

</section>

### ツールパラメータ

| パラメータ | 必須 | 説明 |
|-----------|----------|-------------|
| `type` | はい | ツールバージョン（`computer_20251124`、`computer_20250124`、または`computer_20241022`） |
| `name` | はい | 「computer」である必要があります |
| `display_width_px` | はい | ディスプレイ幅（ピクセル） |
| `display_height_px` | はい | ディスプレイ高さ（ピクセル） |
| `display_number` | いいえ | X11環境のディスプレイ番号 |
| `enable_zoom` | いいえ | ズームアクションを有効にする（`computer_20251124`のみ）。Claudeが特定のスクリーン領域にズームできるようにするには`true`に設定します。デフォルト: `false` |

<Note>
**重要**: コンピュータ使用ツールはアプリケーションで明示的に実行する必要があります。Claudeは直接実行できません。スクリーンショットキャプチャ、マウス移動、キーボード入力、およびClaudeのリクエストに基づく他のアクションの実装はあなたの責任です。
</Note>

### Claude 4モデルとClaude Sonnet 3.7で思考機能を有効にする

Claude Sonnet 3.7は新しい「思考」機能を導入しました。これにより、複雑なタスクに取り組む際のモデルの推論プロセスを見ることができます。この機能は、Claudeが問題にどのようにアプローチしているかを理解するのに役立ち、デバッグや教育目的に特に価値があります。

思考を有効にするには、APIリクエストに`thinking`パラメータを追加します:

```json
"thinking": {
  "type": "enabled",
  "budget_tokens": 1024
}
```

`budget_tokens`パラメータは、Claudeが思考に使用できるトークン数を指定します。これは全体的な`max_tokens`予算から差し引かれます。

思考が有効な場合、Claudeは応答の一部として推論プロセスを返します。これは以下に役立ちます:

1. モデルの意思決定プロセスを理解する
2. 潜在的な問題または誤解を特定する
3. Claudeの問題解決へのアプローチから学ぶ
4. 複雑なマルチステップ操作への可視性を向上させる

思考出力がどのように見えるかの例を以下に示します:

```
[思考]
猫の写真をデスクトップに保存する必要があります。これをステップに分解しましょう:

1. まず、スクリーンショットを撮ってデスクトップに何があるかを確認します
2. 次に、猫の画像を検索するWebブラウザを探します
3. 適切な画像を見つけた後、デスクトップに保存する必要があります

スクリーンショットを撮って、何が利用可能かを確認することから始めましょう...
```

### コンピュータ使用を他のツールで拡張する

コンピュータ使用ツールは他のツールと組み合わせて、より強力なオートメーションワークフローを作成できます。これは以下が必要な場合に特に役立ちます:
- システムコマンドを実行する（[bashツール](/docs/ja/agents-and-tools/tool-use/bash-tool)）
- 設定ファイルまたはスクリプトを編集する（[テキストエディタツール](/docs/ja/agents-and-tools/tool-use/text-editor-tool)）
- カスタムAPIまたはサービスと統合する（カスタムツール）

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
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Find flights from San Francisco to a place with warmer weather."
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
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        },
    ],
    messages=[{"role": "user", "content": "Find flights from San Francisco to a place with warmer weather."}],
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
        description: "Get the current weather in a given location",
        input_schema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA"
            },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
              description: "The unit of temperature, either 'celsius' or 'fahrenheit'"
            }
          },
          required: ["location"]
        }
      },
  ],
  messages: [{ role: "user", content: "Find flights from San Francisco to a place with warmer weather." }],
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
                        .description("Get the current weather in a given location")
                        .inputSchema(BetaTool.InputSchema.builder()
                                .properties(
                                        JsonValue.from(
                                                Map.of(
                                                        "location", Map.of(
                                                                "type", "string",
                                                                "description", "The city and state, e.g. San Francisco, CA"
                                                        ),
                                                        "unit", Map.of(
                                                                "type", "string",
                                                                "enum", List.of("celsius", "fahrenheit"),
                                                                "description", "The unit of temperature, either 'celsius' or 'fahrenheit'"
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
                .addUserMessage("Find flights from San Francisco to a place with warmer weather.")
                .addBeta("computer-use-2025-01-24")
                .build();

        BetaMessage message = client.beta().messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

### カスタムコンピュータ使用環境を構築する

[リファレンス実装](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)は、コンピュータ使用を開始するのに役立つように設計されています。Claudeがコンピュータを使用するために必要なすべてのコンポーネントが含まれています。ただし、ニーズに合わせてコンピュータ使用のための独自の環境を構築できます。以下が必要です：

- Claudeでのコンピュータ使用に適した仮想化またはコンテナ化環境
- Anthropic定義のコンピュータ使用ツールの少なくとも1つの実装
- Claude APIと相互作用し、ツール実装を使用して`tool_use`結果を実行するエージェントループ
- エージェントループを開始するためのユーザー入力を許可するAPIまたはUI

#### コンピュータ使用ツールを実装する

コンピュータ使用ツールはスキーマレスツールとして実装されます。このツールを使用する場合、他のツールのような入力スキーマを提供する必要はありません。スキーマはClaudeのモデルに組み込まれており、変更することはできません。

<Steps>
  <Step title="コンピューティング環境をセットアップする">
    Claudeが相互作用する仮想ディスプレイを作成するか、既存のディスプレイに接続します。これは通常、Xvfb（X Virtual Framebuffer）または同様のテクノロジーのセットアップを含みます。
  </Step>
  <Step title="アクションハンドラーを実装する">
    Claudeがリクエストする可能性のある各アクションタイプを処理する関数を作成します：
    ```python
    def handle_computer_action(action_type, params):
        if action_type == "screenshot":
            return capture_screenshot()
        elif action_type == "left_click":
            x, y = params["coordinate"]
            return click_at(x, y)
        elif action_type == "type":
            return type_text(params["text"])
        # ... handle other actions
    ```
  </Step>
  <Step title="Claudeのツール呼び出しを処理する">
    Claudeの応答からツール呼び出しを抽出して実行します：
    ```python
    for content in response.content:
        if content.type == "tool_use":
            action = content.input["action"]
            result = handle_computer_action(action, content.input)
            
            # Return result to Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="エージェントループを実装する">
    Claudeがタスクを完了するまで続くループを作成します：
    ```python
    while True:
        response = client.beta.messages.create(...)
        
        # Check if Claude used any tools
        tool_results = process_tool_calls(response)
        
        if not tool_results:
            # No more tool use, task complete
            break
            
        # Continue conversation with tool results
        messages.append({"role": "user", "content": tool_results})
    ```
  </Step>
</Steps>

#### エラーを処理する

コンピュータ使用ツールを実装する場合、さまざまなエラーが発生する可能性があります。以下はそれらを処理する方法です：

<section title="スクリーンショットキャプチャの失敗">

スクリーンショットキャプチャが失敗した場合、適切なエラーメッセージを返します：

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

<section title="無効な座標">

Claudeがディスプレイ境界外の座標を提供する場合：

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

<section title="アクション実行の失敗">

アクションの実行に失敗した場合：

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

#### より高い解像度の座標スケーリングを処理する

APIは画像を最長辺で最大1568ピクセル、合計約1.15メガピクセルに制限します（詳細は[画像のサイズ変更](/docs/ja/build-with-claude/vision#evaluate-image-size)を参照）。たとえば、1512x982スクリーンは約1330x864にダウンサンプリングされます。Claudeはこのより小さい画像を分析し、そのスペースで座標を返しますが、ツールは元のスクリーンスペースでクリックを実行します。

座標変換を処理しない限り、Claudeのクリック座標がターゲットを逃す可能性があります。

これを修正するには、スクリーンショットを自分でサイズ変更し、Claudeの座標をスケールアップします：

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

#### 実装のベストプラクティスに従う

<section title="適切なディスプレイ解像度を使用する">

推奨される制限内に留まりながら、ユースケースに合致するディスプレイ寸法を設定します：
- 一般的なデスクトップタスク：1024x768または1280x720
- Webアプリケーション：1280x800または1366x768
- パフォーマンスの問題を防ぐため、1920x1080を超える解像度は避けてください

</section>

<section title="適切なスクリーンショット処理を実装する">

スクリーンショットをClaudeに返す場合：
- スクリーンショットをBase64 PNGまたはJPEGとしてエンコードします
- パフォーマンスを向上させるため、大きなスクリーンショットの圧縮を検討します
- タイムスタンプやディスプレイ状態などの関連メタデータを含めます
- より高い解像度を使用している場合、座標が正確にスケーリングされていることを確認します

</section>

<section title="アクション遅延を追加する">

一部のアプリケーションはアクションに応答するのに時間が必要です：
```python
def click_and_wait(x, y, wait_time=0.5):
    click_at(x, y)
    time.sleep(wait_time)  # Allow UI to update
```

</section>

<section title="実行前にアクションを検証する">

リクエストされたアクションが安全で有効であることを確認します：
```python
def validate_action(action_type, params):
    if action_type == "left_click":
        x, y = params.get("coordinate", (0, 0))
        if not (0 <= x < display_width and 0 <= y < display_height):
            return False, "Coordinates out of bounds"
    return True, None
```

</section>

<section title="デバッグ用にアクションをログに記録する">

トラブルシューティング用にすべてのアクションのログを保持します：
```python
import logging

def log_action(action_type, params, result):
    logging.info(f"Action: {action_type}, Params: {params}, Result: {result}")
```

</section>

---

## コンピュータ使用の制限を理解する

コンピュータ使用機能はベータ版です。Claudeの機能は最先端ですが、開発者はその制限を認識する必要があります：

1. **レイテンシ**：現在のコンピュータ使用レイテンシは、通常の人間が指示するコンピュータアクションと比較して、人間とAIの相互作用に対して遅すぎる可能性があります。信頼できる環境で、速度が重要でないユースケース（例：背景情報の収集、自動化されたソフトウェアテスト）に焦点を当てることをお勧めします。
2. **コンピュータビジョンの精度と信頼性**：Claudeはアクションを生成する際に特定の座標を出力する際に間違いを犯したり、幻覚を見たりする可能性があります。Claude Sonnet 3.7は、モデルの推論を理解し、潜在的な問題を特定するのに役立つ思考機能を導入しています。
3. **ツール選択の精度と信頼性**：Claudeはアクションを生成する際にツールを選択する際に間違いを犯したり、幻覚を見たりする可能性があり、問題を解決するために予期しないアクションを取る可能性があります。さらに、ニッチなアプリケーションまたは複数のアプリケーションと同時に相互作用する場合、信頼性が低くなる可能性があります。複雑なタスクをリクエストする場合、ユーザーがモデルに慎重にプロンプトを与えることをお勧めします。
4. **スクロール信頼性**：Claude Sonnet 3.7は、方向制御を備えた専用スクロールアクションを導入し、信頼性を向上させました。モデルは、指定された量で任意の方向（上/下/左/右）に明示的にスクロールできるようになりました。
5. **スプレッドシート相互作用**：Claude Sonnet 3.7では、`left_mouse_down`、`left_mouse_up`などのより正確なマウス制御アクションの追加と新しい修飾キーサポートにより、スプレッドシート相互作用のマウスクリックが改善されました。これらの細粒度制御を使用し、修飾キーをクリックと組み合わせることで、セル選択をより信頼性の高いものにできます。
6. **ソーシャルおよび通信プラットフォームでのアカウント作成とコンテンツ生成**：Claudeはウェブサイトにアクセスしますが、ソーシャルメディアのウェブサイトとプラットフォーム全体でアカウントを作成したり、コンテンツを生成して共有したり、人間になりすましたりする能力を制限しています。この機能は将来更新される可能性があります。
7. **脆弱性**：ジェイルブレイクやプロンプトインジェクションなどの脆弱性は、ベータコンピュータ使用APIを含む最先端のAIシステム全体に存在する可能性があります。状況によっては、Claudeはコンテンツで見つかったコマンドに従うことがあり、ユーザーの指示と矛盾することもあります。たとえば、ウェブページまたは画像に含まれるClaudeの指示は、指示をオーバーライドしたり、Claudeが間違いを犯す原因になったりする可能性があります。以下をお勧めします：
   a. コンピュータ使用を、最小限の権限を持つ仮想マシンやコンテナなどの信頼できる環境に制限する
   b. 厳密な監視なしに、コンピュータ使用アクセスを機密アカウントまたはデータに与えることを避ける
   c. エンドユーザーに関連するリスクを通知し、アプリケーションでコンピュータ使用機能を有効にするか、必要な権限をリクエストする前に同意を得る
8. **不適切または違法なアクション**：Anthropicの利用規約に従い、コンピュータ使用を使用して法律を違反したり、当社の利用可能ポリシーに違反したりしてはいけません。

常にClaudeのコンピュータ使用アクションとログを慎重に確認および検証してください。完全な精度が必要なタスクや、人間の監視なしに機密ユーザー情報を必要とするタスクにはClaudeを使用しないでください。

---

## 価格

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

## 次のステップ

<CardGroup cols={2}>
  <Card
    title="リファレンス実装"
    icon="github-logo"
    href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
  >
    完全なDockerベースの実装で素早く開始する
  </Card>
  <Card
    title="ツールドキュメント"
    icon="tool"
    href="/docs/ja/agents-and-tools/tool-use/overview"
  >
    ツール使用とカスタムツール作成の詳細を学ぶ
  </Card>
</CardGroup>