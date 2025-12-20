# プロンプトキャッシング

プロンプトキャッシングは、プロンプト内の特定のプレフィックスから再開することで、API使用を最適化する強力な機能です。

---

プロンプトキャッシングは、プロンプト内の特定のプレフィックスから再開することで、API使用を最適化する強力な機能です。このアプローチにより、反復的なタスクや一貫した要素を持つプロンプトの処理時間とコストが大幅に削減されます。

Messages APIで`cache_control`ブロックを使用してプロンプトキャッシングを実装する方法の例を以下に示します。

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
      },
      {
        "type": "text",
        "text": "<the entire contents of Pride and Prejudice>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Analyze the major themes in Pride and Prejudice."
      }
    ]
  }'

# Call the model again with the same inputs up to the cache checkpoint
curl https://api.anthropic.com/v1/messages # rest of input
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
      },
      {
        "type": "text",
        "text": "<the entire contents of 'Pride and Prejudice'>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    messages=[{"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}],
)
print(response.usage.model_dump_json())

# Call the model again with the same inputs up to the cache checkpoint
response = client.messages.create(.....)
print(response.usage.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
    },
    {
      type: "text",
      text: "<the entire contents of 'Pride and Prejudice'>",
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [
    {
      role: "user",
      content: "Analyze the major themes in 'Pride and Prejudice'."
    }
  ]
});
console.log(response.usage);

// Call the model again with the same inputs up to the cache checkpoint
const new_response = await client.messages.create(...)
console.log(new_response.usage);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class PromptCachingExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                .build(),
                        TextBlockParam.builder()
                                .text("<the entire contents of 'Pride and Prejudice'>")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("Analyze the major themes in 'Pride and Prejudice'.")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.usage());
    }
}
```
</CodeGroup>

```json JSON
{"cache_creation_input_tokens":188086,"cache_read_input_tokens":0,"input_tokens":21,"output_tokens":393}
{"cache_creation_input_tokens":0,"cache_read_input_tokens":188086,"input_tokens":21,"output_tokens":393}
```

この例では、「Pride and Prejudice」のテキスト全体が`cache_control`パラメータを使用してキャッシュされています。これにより、複数のAPI呼び出しでこの大きなテキストを再処理することなく再利用できます。ユーザーメッセージのみを変更することで、キャッシュされたコンテンツを利用しながら本に関するさまざまな質問をすることができ、より高速な応答と効率の向上につながります。

---

## プロンプトキャッシングの仕組み

プロンプトキャッシングを有効にしてリクエストを送信すると：

1. システムは、指定されたキャッシュブレークポイントまでのプロンプトプレフィックスが最近のクエリからすでにキャッシュされているかどうかをチェックします。
2. 見つかった場合は、キャッシュされたバージョンを使用して、処理時間とコストを削減します。
3. そうでない場合は、完全なプロンプトを処理し、応答が開始されたらプレフィックスをキャッシュします。

これは特に以下の場合に有用です：
- 多くの例を含むプロンプト
- 大量のコンテキストまたは背景情報
- 一貫した指示を持つ反復的なタスク
- 長いマルチターン会話

デフォルトでは、キャッシュの有効期間は5分です。キャッシュされたコンテンツが使用されるたびに、追加費用なしでキャッシュが更新されます。

<Note>
5分が短すぎる場合、Anthropicは[追加費用で](#pricing)1時間のキャッシュ期間も提供しています。

詳細については、[1時間のキャッシュ期間](#1-hour-cache-duration)を参照してください。
</Note>

<Tip>
  **プロンプトキャッシングは完全なプレフィックスをキャッシュします**

プロンプトキャッシングは、`tools`、`system`、`messages`（この順序で）を含む完全なプロンプトを参照し、`cache_control`で指定されたブロックまでを含みます。

</Tip>

---
## 価格設定

プロンプトキャッシングは新しい価格設定構造を導入しています。以下の表は、サポートされている各モデルのトークンあたりの価格を示しています：

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
上記の表は、プロンプトキャッシングの以下の価格乗数を反映しています：
- 5分キャッシュ書き込みトークンは基本入力トークン価格の1.25倍
- 1時間キャッシュ書き込みトークンは基本入力トークン価格の2倍
- キャッシュ読み取りトークンは基本入力トークン価格の0.1倍
</Note>

---
## プロンプトキャッシングの実装方法

### サポートされているモデル

プロンプトキャッシングは現在以下でサポートされています：
- Claude Opus 4.5
- Claude Opus 4.1
- Claude Opus 4
- Claude Sonnet 4.5
- Claude Sonnet 4
- Claude Sonnet 3.7 ([非推奨](/docs/ja/about-claude/model-deprecations))
- Claude Haiku 4.5
- Claude Haiku 3.5
- Claude Haiku 3
- Claude Opus 3 ([非推奨](/docs/ja/about-claude/model-deprecations))

### プロンプトの構造化

静的コンテンツ（ツール定義、システム指示、コンテキスト、例）をプロンプトの最初に配置します。`cache_control`パラメータを使用して、キャッシング用の再利用可能なコンテンツの終了をマークします。

キャッシュプレフィックスは次の順序で作成されます：`tools`、`system`、`messages`。この順序は、各レベルが前のレベルに基づいて構築される階層を形成します。

#### 自動プレフィックスチェックの仕組み

静的コンテンツの終了時に1つのキャッシュブレークポイントを使用でき、システムは自動的にキャッシュされたブロックの最長一致シーケンスを見つけます。これがどのように機能するかを理解することは、キャッシング戦略を最適化するのに役立ちます。

**3つの核となる原則：**

1. **キャッシュキーは累積的です**：`cache_control`でブロックを明示的にキャッシュすると、キャッシュハッシュキーは会話内のすべての前のブロックを順序付けてハッシュすることで生成されます。これは、各ブロックのキャッシュがそれより前のすべてのコンテンツに依存することを意味します。

2. **逆順シーケンシャルチェック**：システムは明示的なブレークポイントから逆方向に作業して、各前のブロックを逆順でチェックすることで、キャッシュヒットをチェックします。これにより、可能な限り最長のキャッシュヒットが得られます。

3. **20ブロックのルックバックウィンドウ**：システムは各明示的な`cache_control`ブレークポイントの前の最大20ブロックのみをチェックします。20ブロックをチェックしても一致が見つからない場合、チェックを停止し、次の明示的なブレークポイント（存在する場合）に移動します。

**例：ルックバックウィンドウの理解**

30個のコンテンツブロックを持つ会話を考えてください。ここで、`cache_control`をブロック30にのみ設定します：

- **前のブロックに変更がなくブロック31を送信する場合**：システムはブロック30をチェックします（一致！）。ブロック30でキャッシュヒットが得られ、ブロック31のみが処理される必要があります。

- **ブロック25を変更してブロック31を送信する場合**：システムはブロック30 → 29 → 28... → 25（一致なし）→ 24（一致！）から逆方向にチェックします。ブロック24は変更されていないため、ブロック24でキャッシュヒットが得られ、ブロック25～30のみが再処理される必要があります。

- **ブロック5を変更してブロック31を送信する場合**：システムはブロック30 → 29 → 28... → 11（チェック#20）から逆方向にチェックします。20回のチェック後に一致が見つからないため、チェックを停止します。ブロック5は20ブロックのウィンドウを超えているため、キャッシュヒットは発生せず、すべてのブロックが再処理される必要があります。ただし、ブロック5に明示的な`cache_control`ブレークポイントを設定していた場合、システムはそのブレークポイントから継続してチェックします：ブロック5（一致なし）→ ブロック4（一致！）。これにより、ブロック4でキャッシュヒットが可能になり、編集可能なコンテンツの前にブレークポイントを配置する理由が示されます。

**重要なポイント**：キャッシュヒットの可能性を最大化するために、会話の終了時に明示的なキャッシュブレークポイントを常に設定してください。さらに、編集可能な可能性のあるコンテンツブロックの直前にブレークポイントを設定して、これらのセクションが独立してキャッシュできるようにしてください。

#### 複数のブレークポイントを使用する場合

以下の場合は、最大4つのキャッシュブレークポイントを定義できます：
- 異なる頻度で変更される異なるセクションをキャッシュする（例：ツールはめったに変更されませんが、コンテキストは毎日更新されます）
- キャッシュされる内容をより正確に制御する
- 最終ブレークポイントの前の20ブロック以上のコンテンツのキャッシングを確保する
- 編集可能なコンテンツの前にブレークポイントを配置して、20ブロックウィンドウを超えた変更が発生した場合でもキャッシュヒットを保証する

<Note>
**重要な制限**：プロンプトにキャッシュブレークポイントの前に20個以上のコンテンツブロックがあり、それより前のコンテンツを変更する場合、追加の明示的なブレークポイントをそのコンテンツの近くに追加しない限り、キャッシュヒットは得られません。
</Note>

### キャッシュの制限
最小キャッシュ可能プロンプト長は：
- Claude Opus 4.5の場合は4096トークン
- Claude Opus 4.1、Claude Opus 4、Claude Sonnet 4.5、Claude Sonnet 4、Claude Sonnet 3.7（[非推奨](/docs/ja/about-claude/model-deprecations)）、Claude Opus 3（[非推奨](/docs/ja/about-claude/model-deprecations)）の場合は1024トークン
- Claude Haiku 4.5の場合は4096トークン
- Claude Haiku 3.5およびClaude Haiku 3の場合は2048トークン

より短いプロンプトは、`cache_control`でマークされていても、キャッシュできません。このトークン数より少ないトークンをキャッシュするリクエストは、キャッシングなしで処理されます。プロンプトがキャッシュされたかどうかを確認するには、応答使用[フィールド](/docs/ja/build-with-claude/prompt-caching#tracking-cache-performance)を参照してください。

並行リクエストの場合、キャッシュエントリは最初の応答が開始された後にのみ利用可能になることに注意してください。並行リクエストのキャッシュヒットが必要な場合は、最初の応答を待ってから後続のリクエストを送信してください。

現在、「ephemeral」は唯一サポートされているキャッシュタイプであり、デフォルトでは5分の有効期間があります。

### キャッシュブレークポイントコストの理解

**キャッシュブレークポイント自体はコストを追加しません。** 以下の場合にのみ課金されます：
- **キャッシュ書き込み**：新しいコンテンツがキャッシュに書き込まれる場合（5分TTLの場合、基本入力トークンより25%多い）
- **キャッシュ読み取り**：キャッシュされたコンテンツが使用される場合（基本入力トークン価格の10%）
- **通常の入力トークン**：キャッシュされていないコンテンツの場合

より多くの`cache_control`ブレークポイントを追加しても、コストは増加しません。実際にキャッシュされて読み取られるコンテンツに基づいて同じ金額を支払います。ブレークポイントは、どのセクションを独立してキャッシュできるかを制御するだけです。

### キャッシュできるもの
リクエスト内のほとんどのブロックは、`cache_control`でキャッシング用に指定できます。これには以下が含まれます：

- ツール：`tools`配列内のツール定義
- システムメッセージ：`system`配列内のコンテンツブロック
- テキストメッセージ：`messages.content`配列内のコンテンツブロック（ユーターンとアシスタントターンの両方）
- 画像とドキュメント：ユーターンの`messages.content`配列内のコンテンツブロック
- ツール使用とツール結果：`messages.content`配列内のコンテンツブロック（ユーターンとアシスタントターンの両方）

これらの各要素は、`cache_control`でマークして、リクエストのその部分のキャッシングを有効にできます。

### キャッシュできないもの
ほとんどのリクエストブロックはキャッシュできますが、いくつかの例外があります：

- シンキングブロックは`cache_control`で直接キャッシュできません。ただし、シンキングブロックは、前のアシスタントターンに表示される場合、他のコンテンツと一緒にキャッシュできます。この方法でキャッシュされる場合、キャッシュから読み取られるときに入力トークンとしてカウントされます。
- サブコンテンツブロック（[引用](/docs/ja/build-with-claude/citations)など）自体は`cache_control`で直接キャッシュできません。代わりに、トップレベルのブロックをキャッシュしてください。

    引用の場合、引用のソース資料として機能するトップレベルのドキュメントコンテンツブロックをキャッシュできます。これにより、引用をキャッシュするドキュメントをキャッシュすることで、プロンプトキャッシングを引用で効果的に使用できます。
- 空のテキストブロックはキャッシュできません。

### キャッシュを無効にするもの

キャッシュされたコンテンツへの変更は、キャッシュの一部またはすべてを無効にする可能性があります。

[プロンプトの構造化](#structuring-your-prompt)で説明されているように、キャッシュは階層に従います：`tools` → `system` → `messages`。各レベルでの変更は、そのレベルとそれ以降のすべてのレベルを無効にします。

以下の表は、異なるタイプの変更によってキャッシュのどの部分が無効になるかを示しています。✘はキャッシュが無効になることを示し、✓はキャッシュが有効なままであることを示します。

| 変更内容 | ツールキャッシュ | システムキャッシュ | メッセージキャッシュ | 影響 |
|------------|------------------|---------------|----------------|-------------|
| **ツール定義** | ✘ | ✘ | ✘ | ツール定義（名前、説明、パラメータ）を変更すると、キャッシュ全体が無効になります |
| **ウェブ検索トグル** | ✓ | ✘ | ✘ | ウェブ検索を有効/無効にするとシステムプロンプトが変更されます |
| **引用トグル** | ✓ | ✘ | ✘ | 引用を有効/無効にするとシステムプロンプトが変更されます |
| **ツール選択** | ✓ | ✓ | ✘ | `tool_choice`パラメータへの変更はメッセージブロックのみに影響します |
| **画像** | ✓ | ✓ | ✘ | プロンプト内の任意の場所で画像を追加/削除するとメッセージブロックに影響します |
| **シンキングパラメータ** | ✓ | ✓ | ✘ | 拡張シンキング設定（有効/無効、予算）への変更はメッセージブロックに影響します |
| **拡張シンキングリクエストに渡される非ツール結果** | ✓ | ✓ | ✘ | 拡張シンキングが有効な場合にリクエストで非ツール結果が渡されると、以前キャッシュされたすべてのシンキングブロックがコンテキストから削除され、それらのシンキングブロックに続くコンテキスト内のメッセージはキャッシュから削除されます。詳細については、[シンキングブロックでのキャッシング](#caching-with-thinking-blocks)を参照してください。 |

### キャッシュパフォーマンスの追跡

これらのAPIレスポンスフィールドを使用してキャッシュパフォーマンスを監視します。レスポンス内の`usage`内（または[ストリーミング](/docs/ja/build-with-claude/streaming)の場合は`message_start`イベント）：

- `cache_creation_input_tokens`：新しいエントリを作成するときにキャッシュに書き込まれたトークン数。
- `cache_read_input_tokens`：このリクエストのキャッシュから取得されたトークン数。
- `input_tokens`：キャッシュから読み取られたり、キャッシュを作成するために使用されなかった入力トークン数（つまり、最後のキャッシュブレークポイント後のトークン）。

<Note>
**トークン分解の理解**

`input_tokens`フィールドは、リクエスト内の**最後のキャッシュブレークポイント後**に来るトークンのみを表します。送信したすべての入力トークンではありません。

総入力トークンを計算するには：
```
total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
```

**空間的説明：**
- `cache_read_input_tokens` = ブレークポイント前のトークンはすでにキャッシュされています（読み取り）
- `cache_creation_input_tokens` = ブレークポイント前のトークンが今キャッシュされています（書き込み）
- `input_tokens` = 最後のブレークポイント後のトークン（キャッシュの対象外）

**例**：キャッシュされたコンテンツの100,000トークン（キャッシュから読み取り）、キャッシュされている新しいコンテンツの0トークン、ユーザーメッセージの50トークン（キャッシュブレークポイント後）を持つリクエストがある場合：
- `cache_read_input_tokens`：100,000
- `cache_creation_input_tokens`：0
- `input_tokens`：50
- **処理された総入力トークン**：100,050トークン

これは、キャッシングを効果的に使用する場合、`input_tokens`は総入力よりもはるかに小さくなるため、コストとレート制限の両方を理解するために重要です。
</Note>

### 効果的なキャッシングのベストプラクティス

プロンプトキャッシングパフォーマンスを最適化するには：

- システム指示、背景情報、大規模なコンテキスト、または頻繁なツール定義などの安定した再利用可能なコンテンツをキャッシュします。
- キャッシュされたコンテンツをプロンプトの最初に配置して、最高のパフォーマンスを得ます。
- キャッシュブレークポイントを戦略的に使用して、異なるキャッシュ可能なプレフィックスセクションを分離します。
- 会話の終了時と編集可能なコンテンツの直前にキャッシュブレークポイントを設定して、キャッシュヒット率を最大化します。特に20個以上のコンテンツブロックを持つプロンプトを使用する場合。
- キャッシュヒット率を定期的に分析し、必要に応じて戦略を調整します。

### 異なるユースケースの最適化

シナリオに合わせてプロンプトキャッシング戦略をカスタマイズします：

- 会話エージェント：長い指示またはアップロードされたドキュメントを含む拡張会話のコストとレイテンシを削減します。
- コーディングアシスタント：関連するセクションまたはコードベースの要約版をプロンプトに保持することで、オートコンプリートとコードベースQ&Aを改善します。
- 大規模ドキュメント処理：応答レイテンシを増加させることなく、画像を含む完全な長形式資料をプロンプトに組み込みます。
- 詳細な指示セット：Claudeの応答を微調整するために、広範な指示、手順、例のリストを共有します。開発者は通常、プロンプトに1～2つの例を含めますが、プロンプトキャッシングを使用すると、20以上の多様で高品質な回答の例を含めることで、さらに優れたパフォーマンスを得ることができます。
- エージェンティックツール使用：複数のツール呼び出しと反復的なコード変更を含むシナリオのパフォーマンスを向上させます。各ステップは通常、新しいAPI呼び出しが必要です。
- 本、論文、ドキュメント、ポッドキャストトランスクリプト、その他の長形式コンテンツとの対話：ドキュメント全体をプロンプトに埋め込み、ユーザーが質問できるようにすることで、あらゆるナレッジベースを活用します。

### 一般的な問題のトラブルシューティング

予期しない動作が発生している場合：

- キャッシュされたセクションが同一であり、呼び出し全体で同じ場所に`cache_control`でマークされていることを確認します
- 呼び出しがキャッシュの有効期間内（デフォルトでは5分）に行われていることを確認します
- `tool_choice`と画像の使用が呼び出し間で一貫していることを確認します
- 最小トークン数をキャッシュしていることを確認します
- システムは自動的に前のコンテンツブロック境界でキャッシュヒットをチェックします（ブレークポイントの前の約20ブロック）。20個以上のコンテンツブロックを持つプロンプトの場合、すべてのコンテンツをキャッシュできるようにするために、プロンプトの前の方に追加の`cache_control`パラメータが必要な場合があります
- `tool_use`コンテンツブロック内のキーが安定した順序を持っていることを確認します。一部の言語（例：Swift、Go）はJSON変換中にキー順序をランダム化し、キャッシュを破壊します

<Note>
`tool_choice`への変更またはプロンプト内の任意の場所での画像の有無への変更は、キャッシュを無効にし、新しいキャッシュエントリを作成する必要があります。キャッシュ無効化の詳細については、[キャッシュを無効にするもの](#what-invalidates-the-cache)を参照してください。
</Note>

### シンキングブロックでのキャッシング

[拡張シンキング](/docs/ja/build-with-claude/extended-thinking)をプロンプトキャッシングと一緒に使用する場合、シンキングブロックには特別な動作があります：

**他のコンテンツと一緒に自動キャッシング**：シンキングブロックは`cache_control`で明示的にマークできませんが、ツール結果を使用して後続のAPI呼び出しを行うときに、リクエストコンテンツの一部としてキャッシュされます。これは通常、ツール使用中にシンキングブロックを会話に戻すときに発生します。

**入力トークンカウント**：シンキングブロックがキャッシュから読み取られる場合、使用メトリクスで入力トークンとしてカウントされます。これはコスト計算とトークン予算にとって重要です。

**キャッシュ無効化パターン**：
- ツール結果のみがユーザーメッセージとして提供される場合、キャッシュは有効なままです
- 非ツール結果のユーザーコンテンツが追加される場合、キャッシュが無効になり、すべての前のシンキングブロックが削除されます
- このキャッシング動作は、明示的な`cache_control`マーカーなしでも発生します

キャッシュ無効化の詳細については、[キャッシュを無効にするもの](#what-invalidates-the-cache)を参照してください。

**ツール使用の例**：
```
リクエスト1：ユーザー：「パリの天気は？」
応答：[thinking_block_1] + [tool_use block 1]

リクエスト2：
ユーザー：[「パリの天気は？」]、
アシスタント：[thinking_block_1] + [tool_use block 1]、
ユーザー：[tool_result_1、cache=True]
応答：[thinking_block_2] + [text block 2]
# リクエスト2はリクエストコンテンツをキャッシュします（応答ではなく）
# キャッシュには以下が含まれます：ユーザーメッセージ、thinking_block_1、tool_use block 1、tool_result_1

リクエスト3：
ユーザー：[「パリの天気は？」]、
アシスタント：[thinking_block_1] + [tool_use block 1]、
ユーザー：[tool_result_1、cache=True]、
アシスタント：[thinking_block_2] + [text block 2]、
ユーザー：[テキスト応答、cache=True]
# 非ツール結果ユーザーブロックは新しいアシスタントループを指定します
# このリクエストは、シンキングブロックが存在しないかのように処理されます
```

非ツール結果ユーザーブロックが含まれる場合、新しいアシスタントループを指定し、すべての前のシンキングブロックがコンテキストから削除されます。

詳細については、[拡張シンキングドキュメント](/docs/ja/build-with-claude/extended-thinking#understanding-thinking-block-caching-behavior)を参照してください。

---
## キャッシュストレージと共有

- **組織の分離**：キャッシュは組織間で分離されています。異なる組織は、同一のプロンプトを使用していても、キャッシュを共有することはありません。

- **完全一致**：キャッシュヒットには、キャッシュコントロールでマークされたブロックまでを含む、すべてのテキストと画像を含む100%同一のプロンプトセグメントが必要です。

- **出力トークン生成**：プロンプトキャッシングは出力トークン生成に影響しません。受け取る応答は、プロンプトキャッシングが使用されていない場合に得られるものと同じになります。

---
## 1時間のキャッシュ期間

5分が短すぎる場合、Anthropicは[追加費用で](#pricing)1時間のキャッシュ期間も提供しています。

拡張キャッシュを使用するには、`cache_control`定義に`ttl`を含めます：
```json
"cache_control": {
    "type": "ephemeral",
    "ttl": "5m" | "1h"
}
```

レスポンスには、以下のような詳細なキャッシュ情報が含まれます：
```json
{
    "usage": {
        "input_tokens": ...,
        "cache_read_input_tokens": ...,
        "cache_creation_input_tokens": ...,
        "output_tokens": ...,

        "cache_creation": {
            "ephemeral_5m_input_tokens": 456,
            "ephemeral_1h_input_tokens": 100,
        }
    }
}
```

現在の`cache_creation_input_tokens`フィールドは、`cache_creation`オブジェクト内の値の合計に等しいことに注意してください。

### 1時間キャッシュを使用する場合

定期的なペースで使用されるプロンプト（つまり、5分ごとより頻繁に使用されるシステムプロンプト）がある場合は、5分キャッシュを引き続き使用してください。これは追加費用なしで引き続き更新されるためです。

1時間キャッシュは、以下のシナリオで最適に使用されます：
- 5分より頻繁に使用される可能性は低いが、1時間ごとより頻繁に使用される可能性があるプロンプトがある場合。例えば、エージェント側エージェントが5分以上かかる場合、またはユーザーとの長いチャット会話を保存していて、一般的にそのユーザーが次の5分以内に応答しない可能性がある場合。
- レイテンシが重要で、後続のプロンプトが5分を超えて送信される可能性がある場合。
- レート制限の利用を改善したい場合。キャッシュヒットはレート制限に対して差し引かれません。

<Note>
5分と1時間のキャッシュはレイテンシに関して同じように動作します。通常、長いドキュメントの場合、最初のトークンまでの時間が改善されます。
</Note>

### 異なるTTLの混合

同じリクエストで1時間と5分のキャッシュコントロールの両方を使用できますが、重要な制約があります：より長いTTLを持つキャッシュエントリは、より短いTTLの前に表示される必要があります（つまり、1時間のキャッシュエントリは5分のキャッシュエントリの前に表示される必要があります）。

TTLを混合する場合、プロンプト内の3つの請求位置を決定します：
1. 位置`A`：最高キャッシュヒット時のトークンカウント（ヒットがない場合は0）。
2. 位置`B`：`A`の後の最高1時間`cache_control`ブロック時のトークンカウント（存在しない場合は`A`に等しい）。
3. 位置`C`：最後の`cache_control`ブロック時のトークンカウント。

<Note>
`B`および/または`C`が`A`より大きい場合、`A`が最高キャッシュヒットであるため、必然的にキャッシュミスになります。
</Note>

以下の場合に課金されます：
1. 位置`A`のキャッシュ読み取りトークン。
2. 位置`(B - A)`の1時間キャッシュ書き込みトークン。
3. 位置`(C - B)`の5分キャッシュ書き込みトークン。

以下は3つの例です。これは3つのリクエストの入力トークンを示しており、それぞれが異なるキャッシュヒットとキャッシュミスを持っています。各々は、結果として異なる計算された価格を持ち、色付きボックスで示されています。
![TTLの混合図](/docs/images/prompt-cache-mixed-ttl.svg)

---

## プロンプトキャッシングの例

プロンプトキャッシングを始めるのに役立つように、詳細な例とベストプラクティスを含む[プロンプトキャッシングクックブック](https://github.com/anthropics/anthropic-cookbook/blob/main/misc/prompt_caching.ipynb)を用意しました。

以下は、様々なプロンプトキャッシングパターンを示すコードスニペットをいくつか含めています。これらの例は、異なるシナリオでキャッシングを実装する方法を示し、この機能の実用的な応用を理解するのに役立ちます：

<section title="大規模コンテキストキャッシングの例">

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing legal documents."
    },
    {
        "type": "text",
        "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
        "cache_control": {"type": "ephemeral"}
    }
  ],
  messages: [
    {
        "role": "user",
        "content": "What are the key terms and conditions in this agreement?"
    }
  ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class LegalDocumentAnalysisExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing legal documents.")
                                .build(),
                        TextBlockParam.builder()
                                .text("Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("What are the key terms and conditions in this agreement?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>
この例は基本的なプロンプトキャッシングの使用方法を示しており、法的文書の全文をプレフィックスとしてキャッシュしながら、ユーザーの指示はキャッシュされていない状態を保ちます。

最初のリクエストの場合：
- `input_tokens`：ユーザーメッセージのみのトークン数
- `cache_creation_input_tokens`：法的文書を含むシステムメッセージ全体のトークン数
- `cache_read_input_tokens`：0（最初のリクエストではキャッシュヒットなし）

キャッシュの有効期間内の後続リクエストの場合：
- `input_tokens`：ユーザーメッセージのみのトークン数
- `cache_creation_input_tokens`：0（新しいキャッシュ作成なし）
- `cache_read_input_tokens`：キャッシュされたシステムメッセージ全体のトークン数

</section>
<section title="ツール定義のキャッシング">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
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
                        "description": "The unit of temperature, either celsius or fahrenheit"
                    }
                },
                "required": ["location"]
            }
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What is the weather and time in New York?"
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
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
            },
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools=[
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
            },
        },
        // many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages: [
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;

public class ToolsWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Weather tool schema
        InputSchema weatherSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of(
                                "type", "string",
                                "description", "The city and state, e.g. San Francisco, CA"
                        ),
                        "unit", Map.of(
                                "type", "string",
                                "enum", List.of("celsius", "fahrenheit"),
                                "description", "The unit of temperature, either celsius or fahrenheit"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        // Time tool schema
        InputSchema timeSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "timezone", Map.of(
                                "type", "string",
                                "description", "The IANA time zone name, e.g. America/Los_Angeles"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addTool(Tool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(weatherSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_time")
                        .description("Get the current time in a given time zone")
                        .inputSchema(timeSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                .addUserMessage("What is the weather and time in New York?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

この例では、ツール定義のキャッシングを示しています。

`cache_control`パラメータは最後のツール（`get_time`）に配置され、すべてのツールを静的プレフィックスの一部として指定します。

これは、`get_weather`を含むすべてのツール定義と、`get_time`の前に定義された他のツールが、単一のプレフィックスとしてキャッシュされることを意味します。

このアプローチは、複数のリクエスト間で再利用したい一貫したツールセットがある場合に便利です。毎回それらを再処理する必要がありません。

最初のリクエストの場合：
- `input_tokens`：ユーザーメッセージのトークン数
- `cache_creation_input_tokens`：すべてのツール定義とシステムプロンプトのトークン数
- `cache_read_input_tokens`：0（最初のリクエストではキャッシュヒットなし）

キャッシュの有効期間内の後続リクエストの場合：
- `input_tokens`：ユーザーメッセージのトークン数
- `cache_creation_input_tokens`：0（新しいキャッシュ作成なし）
- `cache_read_input_tokens`：すべてのキャッシュされたツール定義とシステムプロンプトのトークン数

</section>

<section title="マルチターン会話の継続">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        # ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        // ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class ConversationWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Create ephemeral system prompt
        TextBlockParam systemPrompt = TextBlockParam.builder()
                .text("...long system prompt")
                .cacheControl(CacheControlEphemeral.builder().build())
                .build();

        // Create message params
        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(systemPrompt))
                // First user message (without cache control)
                .addUserMessage("Hello, can you tell me more about the solar system?")
                // Assistant response
                .addAssistantMessage("Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?")
                // Second user message (with cache control)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Good to know.")
                                .build()),
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Tell me more about Mars.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

この例では、マルチターン会話でプロンプトキャッシングを使用する方法を示しています。

各ターンの間に、最後のメッセージの最後のブロックを`cache_control`でマークして、会話を段階的にキャッシュできるようにします。システムは自動的に以前にキャッシュされたブロックの最長シーケンスを検索して使用します。つまり、以前に`cache_control`ブロックでマークされたブロックは、後で`cache_control`でマークされていなくても、5分以内にヒットした場合はキャッシュヒット（およびキャッシュリフレッシュ！）と見なされます。

さらに、`cache_control`パラメータはシステムメッセージに配置されていることに注意してください。これは、キャッシュから削除された場合（5分以上使用されない場合）、次のリクエストでキャッシュに追加されるようにするためです。

このアプローチは、同じ情報を繰り返し処理することなく、進行中の会話でコンテキストを維持するのに便利です。

これが正しく設定されている場合、各リクエストの使用応答に以下が表示されます：
- `input_tokens`：新しいユーザーメッセージのトークン数（最小限になります）
- `cache_creation_input_tokens`：新しいアシスタントとユーザーのターンのトークン数
- `cache_read_input_tokens`：前のターンまでの会話のトークン数

</section>

<section title="すべてをまとめる：複数のキャッシュブレークポイント">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "system": [
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    system=[
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools: [
        {
            name: "search_documents",
            description: "Search through the knowledge base",
            input_schema: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search query"
                    }
                },
                required: ["query"]
            }
        },
        {
            name: "get_document",
            description: "Retrieve a specific document by ID",
            input_schema: {
                type: "object",
                properties: {
                    doc_id: {
                        type: "string",
                        description: "Document ID"
                    }
                },
                required: ["doc_id"]
            },
            cache_control: { type: "ephemeral" }
        }
    ],
    system: [
        {
            type: "text",
            text: "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            cache_control: { type: "ephemeral" }
        },
        {
            type: "text",
            text: "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            cache_control: { type: "ephemeral" }
        }
    ],
    messages: [
        {
            role: "user",
            content: "Can you search for information about Mars rovers?"
        },
        {
            role: "assistant",
            content: [
                {
                    type: "tool_use",
                    id: "tool_1",
                    name: "search_documents",
                    input: { query: "Mars rovers" }
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "tool_result",
                    tool_use_id: "tool_1",
                    content: "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Yes, please tell me about the Perseverance rover specifically.",
                    cache_control: { type: "ephemeral" }
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlockParam;

public class MultipleCacheBreakpointsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Search tool schema
        InputSchema searchSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "query", Map.of(
                                "type", "string",
                                "description", "Search query"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("query")))
                .build();

        // Get document tool schema
        InputSchema getDocSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "doc_id", Map.of(
                                "type", "string",
                                "description", "Document ID"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("doc_id")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                // Tools with cache control on the last one
                .addTool(Tool.builder()
                        .name("search_documents")
                        .description("Search through the knowledge base")
                        .inputSchema(searchSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_document")
                        .description("Retrieve a specific document by ID")
                        .inputSchema(getDocSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                // System prompts with cache control on instructions and context separately
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build(),
                        TextBlockParam.builder()
                                .text("# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                // Conversation history
                .addUserMessage("Can you search for information about Mars rovers?")
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                .id("tool_1")
                                .name("search_documents")
                                .input(JsonValue.from(Map.of("query", "Mars rovers")))
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                .toolUseId("tool_1")
                                .content("Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)")
                                .build())
                ))
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document.")
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Yes, please tell me about the Perseverance rover specifically.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

この包括的な例は、プロンプトのさまざまな部分を最適化するために利用可能な4つのキャッシュブレークポイントをすべて使用する方法を示しています：

1. **ツールキャッシュ**（キャッシュブレークポイント1）：最後のツール定義の`cache_control`パラメータは、すべてのツール定義をキャッシュします。

2. **再利用可能な指示キャッシュ**（キャッシュブレークポイント2）：システムプロンプトの静的指示は個別にキャッシュされます。これらの指示はリクエスト間でめったに変わりません。

3. **RAGコンテキストキャッシュ**（キャッシュブレークポイント3）：ナレッジベースドキュメントは独立してキャッシュされ、ツールや指示キャッシュを無効化することなくRAGドキュメントを更新できます。

4. **会話履歴キャッシュ**（キャッシュブレークポイント4）：アシスタントの応答は`cache_control`でマークされ、会話が進むにつれて段階的なキャッシングを有効にします。

このアプローチは最大の柔軟性を提供します：
- 最後のユーザーメッセージのみを更新する場合、4つのキャッシュセグメントすべてが再利用されます
- RAGドキュメントを更新しても同じツールと指示を保つ場合、最初の2つのキャッシュセグメントが再利用されます
- 会話を変更しても同じツール、指示、ドキュメントを保つ場合、最初の3つのセグメントが再利用されます
- 各キャッシュブレークポイントは、アプリケーションで何が変わるかに基づいて独立して無効化できます

最初のリクエストの場合：
- `input_tokens`：最後のユーザーメッセージのトークン数
- `cache_creation_input_tokens`：すべてのキャッシュセグメント（ツール+指示+RAGドキュメント+会話履歴）のトークン数
- `cache_read_input_tokens`：0（キャッシュヒットなし）

後続のリクエストで新しいユーザーメッセージのみの場合：
- `input_tokens`：新しいユーザーメッセージのみのトークン数
- `cache_creation_input_tokens`：会話履歴に追加された新しいトークン
- `cache_read_input_tokens`：以前にキャッシュされたすべてのトークン（ツール+指示+RAGドキュメント+前の会話）

このパターンは特に以下に強力です：
- 大規模なドキュメントコンテキストを持つRAGアプリケーション
- 複数のツールを使用するエージェントシステム
- コンテキストを維持する必要がある長時間実行される会話
- プロンプトのさまざまな部分を独立して最適化する必要があるアプリケーション

</section>

---
## FAQ

  <section title="複数のキャッシュブレークポイントが必要ですか、それとも最後に1つあれば十分ですか？">

    **ほとんどの場合、静的コンテンツの最後に単一のキャッシュブレークポイントがあれば十分です。** システムは自動的にすべての前のコンテンツブロック境界（ブレークポイントの前の最大20ブロック）でキャッシュヒットをチェックし、キャッシュされたブロックの最長マッチングシーケンスを使用します。

    複数のブレークポイントが必要な場合は以下の場合のみです：
    - 目的のキャッシュポイントの前に20を超えるコンテンツブロックがある
    - 異なる頻度で更新されるセクションを独立してキャッシュしたい
    - コスト最適化のためにキャッシュされるものを明示的に制御する必要がある

    例：システム指示（めったに変わらない）とRAGコンテキスト（毎日変わる）がある場合、2つのブレークポイントを使用して個別にキャッシュすることができます。
  
</section>

  <section title="キャッシュブレークポイントは追加コストを追加しますか？">

    いいえ、キャッシュブレークポイント自体は無料です。支払うのは以下のみです：
    - キャッシュへのコンテンツ書き込み（5分TTLの場合、基本入力トークンより25%多い）
    - キャッシュからの読み取り（基本入力トークン価格の10%）
    - キャッシュされていないコンテンツの通常の入力トークン

    ブレークポイントの数は価格に影響しません。キャッシュされて読み取られるコンテンツの量のみが重要です。
  
</section>

  <section title="使用フィールドから合計入力トークンを計算するにはどうすればよいですか？">

    使用応答には、合計入力を表す3つの個別の入力トークンフィールドが含まれます：

    ```
    total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
    ```

    - `cache_read_input_tokens`：キャッシュから取得されたトークン（キャッシュブレークポイントの前のキャッシュされたすべてのもの）
    - `cache_creation_input_tokens`：キャッシュブレークポイントで書き込まれている新しいトークン
    - `input_tokens`：最後のキャッシュブレークポイント**後の**キャッシュされていないトークン

    **重要：** `input_tokens`はすべての入力トークンを表していません。最後のキャッシュブレークポイント後の部分のみです。キャッシュされたコンテンツがある場合、`input_tokens`は通常、合計入力よりはるかに小さくなります。

    **例：** 200Kトークンドキュメントがキャッシュされ、50トークンのユーザー質問がある場合：
    - `cache_read_input_tokens`：200,000
    - `cache_creation_input_tokens`：0
    - `input_tokens`：50
    - **合計**：200,050トークン

    このブレークダウンは、コストとレート制限の使用の両方を理解するために重要です。詳細については、[キャッシュパフォーマンスの追跡](#tracking-cache-performance)を参照してください。
  
</section>

  <section title="キャッシュの有効期間は何ですか？">

    キャッシュのデフォルト最小有効期間（TTL）は5分です。この有効期間は、キャッシュされたコンテンツが使用されるたびにリフレッシュされます。

    5分が短すぎる場合、Anthropicは[1時間キャッシュTTL](#1-hour-cache-duration)も提供しています。
  
</section>

  <section title="何個のキャッシュブレークポイントを使用できますか？">

    プロンプトで最大4つのキャッシュブレークポイント（`cache_control`パラメータを使用）を定義できます。
  
</section>

  <section title="プロンプトキャッシングはすべてのモデルで利用可能ですか？">

    いいえ、プロンプトキャッシングは現在、Claude Opus 4.5、Claude Opus 4.1、Claude Opus 4、Claude Sonnet 4.5、Claude Sonnet 4、Claude Sonnet 3.7（[非推奨](/docs/ja/about-claude/model-deprecations)）、Claude Haiku 4.5、Claude Haiku 3.5、Claude Haiku 3、およびClaude Opus 3（[非推奨](/docs/ja/about-claude/model-deprecations)）でのみ利用可能です。
  
</section>

  <section title="プロンプトキャッシングは拡張思考とどのように機能しますか？">

    キャッシュされたシステムプロンプトとツールは、思考パラメータが変更されるときに再利用されます。ただし、思考の変更（有効化/無効化またはバジェット変更）は、メッセージコンテンツを含む以前にキャッシュされたプロンプトプレフィックスを無効化します。

    キャッシュ無効化の詳細については、[キャッシュを無効化するもの](#what-invalidates-the-cache)を参照してください。

    拡張思考の詳細（ツール使用とプロンプトキャッシングとの相互作用を含む）については、[拡張思考ドキュメント](/docs/ja/build-with-claude/extended-thinking#extended-thinking-and-prompt-caching)を参照してください。
  
</section>

  <section title="プロンプトキャッシングを有効にするにはどうすればよいですか？">

    プロンプトキャッシングを有効にするには、APIリクエストに少なくとも1つの`cache_control`ブレークポイントを含めます。
  
</section>

  <section title="プロンプトキャッシングを他のAPI機能と一緒に使用できますか？">

    はい、プロンプトキャッシングはツール使用やビジョン機能などの他のAPI機能と一緒に使用できます。ただし、プロンプトの画像の有無を変更したり、ツール使用設定を変更したりするとキャッシュが破損します。

    キャッシュ無効化の詳細については、[キャッシュを無効化するもの](#what-invalidates-the-cache)を参照してください。
  
</section>

  <section title="プロンプトキャッシングは価格にどのように影響しますか？">

    プロンプトキャッシングは新しい価格構造を導入し、キャッシュ書き込みは基本入力トークンより25%多いコストがかかり、キャッシュヒットは基本入力トークン価格の10%のみです。
  
</section>

  <section title="キャッシュを手動でクリアできますか？">

    現在、キャッシュを手動でクリアする方法はありません。キャッシュされたプレフィックスは、最小5分の非アクティブ後に自動的に期限切れになります。
  
</section>

  <section title="キャッシング戦略の有効性を追跡するにはどうすればよいですか？">

    APIレスポンスの`cache_creation_input_tokens`および`cache_read_input_tokens`フィールドを使用してキャッシュパフォーマンスを監視できます。
  
</section>

  <section title="キャッシュを破損させるものは何ですか？">

    キャッシュ無効化の詳細については、[キャッシュを無効化するもの](#what-invalidates-the-cache)を参照してください。新しいキャッシュエントリの作成が必要な変更のリストを含みます。
  
</section>

  <section title="プロンプトキャッシングはプライバシーとデータ分離をどのように処理しますか？">

プロンプトキャッシングは強力なプライバシーとデータ分離対策で設計されています：

1. キャッシュキーは、キャッシュコントロールポイントまでのプロンプトの暗号化ハッシュを使用して生成されます。これは、同一のプロンプトを持つリクエストのみが特定のキャッシュにアクセスできることを意味します。

2. キャッシュは組織固有です。同じ組織内のユーザーは、同一のプロンプトを使用する場合、同じキャッシュにアクセスできますが、キャッシュは異なる組織間では共有されません。同一のプロンプトであっても共有されません。

3. キャッシング機構は、各ユニークな会話またはコンテキストの整合性とプライバシーを維持するように設計されています。

4. プロンプトのどこにでも`cache_control`を使用しても安全です。コスト効率のために、可変性の高い部分（例：ユーザーの任意の入力）をキャッシングから除外する方が良いです。

これらの対策により、プロンプトキャッシングはパフォーマンス上の利点を提供しながらデータプライバシーとセキュリティを維持します。
  
</section>
  <section title="Batches APIでプロンプトキャッシングを使用できますか？">

    はい、[Batches API](/docs/ja/build-with-claude/batch-processing)リクエストでプロンプトキャッシングを使用することは可能です。ただし、非同期バッチリクエストは同時に任意の順序で処理される可能性があるため、キャッシュヒットはベストエフォート基準で提供されます。

    [1時間キャッシュ](#1-hour-cache-duration)はキャッシュヒットを改善するのに役立ちます。最も費用効果的な使用方法は以下の通りです：
    - 共有プレフィックスを持つメッセージリクエストのセットを収集します。
    - この共有プレフィックスと1時間キャッシュブロックを持つ単一のリクエストのみでバッチリクエストを送信します。これは1時間キャッシュに書き込まれます。
    - これが完了したら、すぐに残りのリクエストを送信します。完了時期を知るためにジョブを監視する必要があります。

    これは通常、5分キャッシュを使用するよりも優れています。バッチリクエストは5分から1時間の間に完了することが一般的だからです。これらのキャッシュヒット率を改善し、このプロセスをより簡単にする方法を検討しています。
  
</section>
  <section title="Pythonで`AttributeError: 'Beta' object has no attribute 'prompt_caching'`エラーが表示されるのはなぜですか？">

  このエラーは通常、SDKをアップグレードしたか、古いコード例を使用している場合に表示されます。プロンプトキャッシングは一般利用可能になったため、ベータプレフィックスは不要になりました。以下の代わりに：
    <CodeGroup>
      ```python Python
      python client.beta.prompt_caching.messages.create(...)
      ```
    </CodeGroup>
    単に以下を使用します：
    <CodeGroup>
      ```python Python
      python client.messages.create(...)
      ```
    </CodeGroup>
  
</section>
  <section title="TypeScriptで'TypeError: Cannot read properties of undefined (reading 'messages')'が表示されるのはなぜですか？">

  このエラーは通常、SDKをアップグレードしたか、古いコード例を使用している場合に表示されます。プロンプトキャッシングは一般利用可能になったため、ベータプレフィックスは不要になりました。以下の代わりに：

      ```typescript TypeScript
      client.beta.promptCaching.messages.create(...)
      ```

      単に以下を使用します：

      ```typescript
      client.messages.create(...)
      ```
  
</section>