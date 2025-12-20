# Effort

effortパラメータを使用してClaudeの応答時にトークン使用量を制御し、応答の詳細さとトークン効率のバランスを取ります。

---

effortパラメータを使用すると、リクエストに応答する際にClaudeがトークンを使用することにどの程度積極的であるかを制御できます。これにより、単一のモデルで応答の詳細さとトークン効率のバランスを取ることができます。

<Note>
  effortパラメータは現在ベータ版であり、Claude Opus 4.5でのみサポートされています。

  この機能を使用する場合は、[ベータヘッダー](/docs/ja/api/beta-headers) `effort-2025-11-24` を含める必要があります。
</Note>

## effortの仕組み

デフォルトでは、Claudeは最大限の努力を使用します。つまり、最良の結果を得るために必要なだけのトークンを使用します。effortレベルを下げることで、Claudeにトークン使用をより慎重にするよう指示し、速度とコストを最適化しながら、機能の低下を受け入れることができます。

<Tip>
`effort` を `"high"` に設定すると、`effort` パラメータを完全に省略した場合とまったく同じ動作が得られます。
</Tip>

effortパラメータは、以下を含む**すべてのトークン**に影響します：

- テキスト応答と説明
- ツール呼び出しと関数の引数
- 拡張思考（有効な場合）

このアプローチには2つの大きな利点があります：

1. 使用するために思考を有効にする必要がありません。
2. ツール呼び出しを含むすべてのトークン支出に影響を与えることができます。たとえば、低いeffortはClaudeがより少ないツール呼び出しを行うことを意味します。これにより、効率性をより細かく制御できます。

### Effortレベル

| レベル    | 説明                                                                                                                      | 典型的な使用例                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `high`   | 最大機能。Claudeは最良の結果を得るために必要なだけのトークンを使用します。パラメータを設定しない場合と同等です。  | 複雑な推論、難しいコーディング問題、エージェント的なタスク                           |
| `medium` | 適度なトークン節約を伴うバランスの取れたアプローチ。 | 速度、コスト、パフォーマンスのバランスが必要なエージェント的なタスク                                                         |
| `low`    | 最も効率的。機能の低下を伴う大幅なトークン節約。 | サブエージェントなど、最高の速度と最低コストが必要なより単純なタスク                     |

## 基本的な使用方法

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Analyze the trade-offs between microservices and monolithic architectures"
    }],
    output_config={
        "effort": "medium"
    }
)

print(response.content[0].text)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: "claude-opus-4-5-20251101",
  betas: ["effort-2025-11-24"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Analyze the trade-offs between microservices and monolithic architectures"
  }],
  output_config: {
    effort: "medium"
  }
});

console.log(response.content[0].text);
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: effort-2025-11-24" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-opus-4-5-20251101",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures"
        }],
        "output_config": {
            "effort": "medium"
        }
    }'
```

</CodeGroup>

## effortパラメータをいつ調整すべきですか？

- **高いeffort**（デフォルト）を使用するのは、Claudeの最高の仕事が必要な場合です。複雑な推論、微妙な分析、難しいコーディング問題、または品質が最優先事項であるあらゆるタスク。
- **中程度のeffort**をバランスの取れたオプションとして使用します。高いeffortの完全なトークン支出なしで、堅実なパフォーマンスが必要な場合。
- **低いeffort**を使用するのは、速度（Claudeがより少ないトークンで応答するため）またはコストを最適化している場合です。たとえば、単純な分類タスク、クイックルックアップ、または限界的な品質改善が追加のレイテンシーまたは支出を正当化しない大量使用ケース。

## ツール使用時のeffort

ツールを使用する場合、effortパラメータはツール呼び出しの周囲の説明とツール呼び出し自体の両方に影響します。低いeffortレベルは傾向として：

- 複数の操作をより少ないツール呼び出しに組み合わせる
- より少ないツール呼び出しを行う
- 前置きなしに直接アクションに進む
- 完了後に簡潔な確認メッセージを使用する

高いeffortレベルは以下を行う可能性があります：

- より多くのツール呼び出しを行う
- アクションを取る前に計画を説明する
- 変更の詳細な要約を提供する
- より包括的なコードコメントを含める

## 拡張思考を使用したeffort

effortパラメータは、拡張思考が有効な場合、思考トークン予算と一緒に機能します。これら2つのコントロールは異なる目的を果たします：

- **Effortパラメータ**：思考トークン、テキスト応答、ツール呼び出しを含むすべてのトークンをClaudeがどのように使用するかを制御します
- **思考トークン予算**：特に思考トークンの最大制限を設定します

effortパラメータは、拡張思考が有効であるかどうかに関わらず使用できます。両方が構成されている場合：

1. まずタスクに適切なeffortレベルを決定します
2. 次に、タスクの複雑さに基づいて思考トークン予算を設定します

複雑な推論タスクで最高のパフォーマンスを得るには、高いeffort（デフォルト）と高い思考トークン予算を使用します。これにより、Claudeは徹底的に考え、包括的な応答を提供できます。

## ベストプラクティス

1. **高いeffortから始める**：パフォーマンスをトークン効率と引き換えにするために、低いeffortレベルを使用します。
2. **速度に敏感なタスクまたは単純なタスクに低いeffortを使用する**：レイテンシーが重要な場合またはタスクが単純な場合、低いeffortは応答時間とコストを大幅に削減できます。
3. **ユースケースをテストする**：effortレベルの影響はタスクタイプによって異なります。デプロイする前に、特定のユースケースでパフォーマンスを評価します。
4. **動的effortを検討する**：タスクの複雑さに基づいてeffortを調整します。単純なクエリは低いeffortを保証する可能性がありますが、エージェント的なコーディングと複雑な推論は高いeffortから利益を得ます。