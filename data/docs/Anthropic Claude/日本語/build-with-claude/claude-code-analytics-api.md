# Claude Code Analytics API

Claude Code Analytics Admin APIを使用して、組織のClaude Code使用分析と生産性メトリクスにプログラムでアクセスします。

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

Claude Code Analytics Admin APIは、Claude Codeユーザーの日次集計使用メトリクスへのプログラマティックアクセスを提供し、組織が開発者の生産性を分析し、カスタムダッシュボードを構築できるようにします。このAPIは、基本的な[Analyticsダッシュボード](/claude-code)と複雑なOpenTelemetry統合の間のギャップを埋めます。

このAPIにより、Claude Code導入をより適切に監視、分析、最適化できます：

* **開発者生産性分析：** Claude Codeを使用したセッション、追加/削除されたコード行、コミット、プルリクエストの作成を追跡
* **ツール使用メトリクス：** 異なるClaude Codeツール（Edit、Write、NotebookEdit）の受け入れ率と拒否率を監視
* **コスト分析：** Claude モデル別に分類された推定コストとトークン使用量を表示
* **カスタムレポート：** データをエクスポートして、管理チーム向けのエグゼクティブダッシュボードとレポートを構築
* **使用状況の正当化：** Claude Code導入を社内で正当化し、拡大するためのメトリクスを提供

<Check>
  **Admin APIキーが必要です**
  
  このAPIは[Admin API](/docs/ja/build-with-claude/administration-api)の一部です。これらのエンドポイントには、標準APIキーとは異なるAdmin APIキー（`sk-ant-admin...`で始まる）が必要です。管理者ロールを持つ組織メンバーのみが、[Claude Console](/settings/admin-keys)を通じてAdmin APIキーをプロビジョニングできます。
</Check>

## クイックスタート

特定の日の組織のClaude Code分析を取得します：

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
  **統合用にUser-Agentヘッダーを設定します**
  
  統合を構築している場合は、User-Agentヘッダーを設定して、使用パターンを理解するのに役立てます：
  ```
  User-Agent: YourApp/1.0.0 (https://yourapp.com)
  ```
</Tip>

## Claude Code Analytics API

`/v1/organizations/usage_report/claude_code`エンドポイントを使用して、組織全体のClaude Code使用、生産性メトリクス、開発者アクティビティを追跡します。

### 主要な概念

- **日次集計**: `starting_at`パラメータで指定された単一日のメトリクスを返します
- **ユーザーレベルのデータ**: 各レコードは指定された日の1ユーザーのアクティビティを表します
- **生産性メトリクス**: セッション、コード行、コミット、プルリクエスト、ツール使用を追跡
- **トークンとコストデータ**: Claude モデル別に分類された使用と推定コストを監視
- **カーソルベースのページネーション**: 不透明なカーソルを使用した安定したページネーションで大規模なデータセットを処理
- **データの鮮度**: メトリクスは一貫性のため最大1時間の遅延で利用可能

完全なパラメータの詳細と応答スキーマについては、[Claude Code Analytics APIリファレンス](/docs/ja/api/admin-api/claude-code/get-claude-code-usage-report)を参照してください。

### 基本的な例

#### 特定の日の分析を取得

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### ページネーション付きで分析を取得

```bash
# 最初のリクエスト
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# レスポンスのカーソルを使用した後続リクエスト
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
page=page_MjAyNS0wNS0xNFQwMDowMDowMFo=" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

### リクエストパラメータ

| パラメータ | タイプ | 必須 | 説明 |
|-----------|------|----------|-------------|
| `starting_at` | string | はい | YYYY-MM-DD形式のUTC日付。この単一日のメトリクスのみを返します |
| `limit` | integer | いいえ | ページあたりのレコード数（デフォルト：20、最大：1000） |
| `page` | string | いいえ | 前のレスポンスの`next_page`フィールドからの不透明なカーソルトークン |

### 利用可能なメトリクス

各レスポンスレコードには、単一ユーザーの単一日のメトリクスが含まれます：

#### ディメンション
- **date**: RFC 3339形式の日付（UTCタイムスタンプ）
- **actor**: Claude Codeアクションを実行したユーザーまたはAPIキー（`email_address`を持つ`user_actor`またはapi_key_nameを持つ`api_actor`）
- **organization_id**: 組織UUID
- **customer_type**: 顧客アカウントのタイプ（APIカスタマー向けの`api`、Pro/Teamカスタマー向けの`subscription`）
- **terminal_type**: Claude Codeが使用されたターミナルまたは環境のタイプ（例：`vscode`、`iTerm.app`、`tmux`）

#### コアメトリクス
- **num_sessions**: このアクターによって開始された異なるClaude Codeセッションの数
- **lines_of_code.added**: Claude Codeによってすべてのファイル全体で追加されたコード行の総数
- **lines_of_code.removed**: Claude Codeによってすべてのファイル全体で削除されたコード行の総数
- **commits_by_claude_code**: Claude Codeのコミット機能を通じて作成されたgitコミットの数
- **pull_requests_by_claude_code**: Claude CodeのPR機能を通じて作成されたプルリクエストの数

#### ツールアクションメトリクス
ツールタイプ別のツールアクション受け入れ率と拒否率の内訳：
- **edit_tool.accepted/rejected**: ユーザーが受け入れた/拒否したEditツール提案の数
- **write_tool.accepted/rejected**: ユーザーが受け入れた/拒否したWriteツール提案の数
- **notebook_edit_tool.accepted/rejected**: ユーザーが受け入れた/拒否したNotebookEditツール提案の数

#### モデル別内訳
使用された各Claudeモデルについて：
- **model**: Claudeモデル識別子（例：`claude-sonnet-4-5-20250929`）
- **tokens.input/output**: このモデルの入力および出力トークンカウント
- **tokens.cache_read/cache_creation**: このモデルのキャッシュ関連トークン使用
- **estimated_cost.amount**: このモデルの推定コスト（米ドルセント）
- **estimated_cost.currency**: コスト金額の通貨コード（現在は常に`USD`）

### レスポンス構造

APIは次の形式でデータを返します：

```json
{
  "data": [
    {
      "date": "2025-09-01T00:00:00Z",
      "actor": {
        "type": "user_actor",
        "email_address": "developer@company.com"
      },
      "organization_id": "dc9f6c26-b22c-4831-8d01-0446bada88f1",
      "customer_type": "api",
      "terminal_type": "vscode",
      "core_metrics": {
        "num_sessions": 5,
        "lines_of_code": {
          "added": 1543,
          "removed": 892
        },
        "commits_by_claude_code": 12,
        "pull_requests_by_claude_code": 2
      },
      "tool_actions": {
        "edit_tool": {
          "accepted": 45,
          "rejected": 5
        },
        "multi_edit_tool": {
          "accepted": 12,
          "rejected": 2
        },
        "write_tool": {
          "accepted": 8,
          "rejected": 1
        },
        "notebook_edit_tool": {
          "accepted": 3,
          "rejected": 0
        }
      },
      "model_breakdown": [
        {
          "model": "claude-sonnet-4-5-20250929",
          "tokens": {
            "input": 100000,
            "output": 35000,
            "cache_read": 10000,
            "cache_creation": 5000
          },
          "estimated_cost": {
            "currency": "USD",
            "amount": 1025
          }
        }
      ]
    }
  ],
  "has_more": false,
  "next_page": null
}
```

## ページネーション

APIは、大量のユーザーを持つ組織向けのカーソルベースのページネーションをサポートしています：

1. オプションの`limit`パラメータを使用して初期リクエストを実行
2. レスポンスで`has_more`が`true`の場合、次のリクエストで`next_page`値を使用
3. `has_more`が`false`になるまで続行

カーソルは最後のレコードの位置をエンコードし、新しいデータが到着しても安定したページネーションを保証します。各ページネーションセッションは一貫したデータ境界を維持して、レコードを見落としたり重複させたりしないようにします。

## 一般的なユースケース

- **エグゼクティブダッシュボード**: 開発速度に対するClaude Codeの影響を示す高レベルレポートを作成
- **AIツール比較**: メトリクスをエクスポートして、Claude CodeとCopilotやCursorなどの他のAIコーディングツールを比較
- **開発者生産性分析**: 時間経過に伴う個人およびチームの生産性メトリクスを追跡
- **コスト追跡と配分**: 支出パターンを監視し、チームまたはプロジェクト別にコストを配分
- **導入監視**: Claude Codeから最も価値を得ているチームとユーザーを特定
- **ROI正当化**: Claude Code導入を正当化し、社内で拡大するための具体的なメトリクスを提供

## よくある質問

### 分析データはどのくらい新しいですか？
Claude Code分析データは通常、ユーザーアクティビティ完了後1時間以内に表示されます。一貫したページネーション結果を確保するため、1時間以上前のデータのみがレスポンスに含まれます。

### リアルタイムメトリクスを取得できますか？
いいえ、このAPIは日次集計メトリクスのみを提供します。リアルタイム監視については、[OpenTelemetry統合](https://code.claude.com/docs/ja/monitoring-usage)の使用を検討してください。

### データ内でユーザーはどのように識別されますか？
ユーザーは`actor`フィールドを通じて2つの方法で識別されます：
- **`user_actor`**: OAuth経由で認証するユーザーの`email_address`を含む（最も一般的）
- **`api_actor`**: APIキー経由で認証するユーザーの`api_key_name`を含む

`customer_type`フィールドは、使用がAPIカスタマー（API PAYG）からの`api`であるか、Pro/Teamプランからの`subscription`カスタマーであるかを示します。

### データ保持期間はどのくらいですか？
履歴Claude Code分析データは保持され、APIを通じてアクセス可能です。このデータに指定された削除期間はありません。

### どのClaude Codeデプロイメントがサポートされていますか？
このAPIは、Claude API（1st party）でのClaude Code使用のみを追跡します。Amazon Bedrock、Google Vertex AI、またはその他のサードパーティプラットフォームでの使用は含まれていません。

### このAPIを使用するのにコストはかかりますか？
Claude Code Analytics APIは、Admin APIへのアクセス権を持つすべての組織で無料で使用できます。

### ツール受け入れ率を計算するにはどうすればよいですか？
ツール受け入れ率 = `accepted / (accepted + rejected)`（各ツールタイプ）。たとえば、editツールが45件の受け入れと5件の拒否を示している場合、受け入れ率は90％です。

### dateパラメータに使用されるタイムゾーンは何ですか？
すべての日付はUTCです。`starting_at`パラメータはYYYY-MM-DD形式である必要があり、その日のUTC真夜中を表します。

## 関連項目

Claude Code Analytics APIは、チームの開発ワークフローを理解し、最適化するのに役立ちます。関連機能の詳細をご覧ください：

- [Admin APIの概要](/docs/ja/build-with-claude/administration-api)
- [Admin APIリファレンス](/docs/ja/api/admin)
- [Claude Code Analyticsダッシュボード](/claude-code)
- [使用量とコストAPI](/docs/ja/build-with-claude/usage-cost-api) - Anthropicのすべてのサービス全体のAPI使用を追跡
- [ID およびアクセス管理](https://code.claude.com/docs/ja/iam)
- [OpenTelemetryを使用した使用状況の監視](https://code.claude.com/docs/ja/monitoring-usage) - カスタムメトリクスとアラート用