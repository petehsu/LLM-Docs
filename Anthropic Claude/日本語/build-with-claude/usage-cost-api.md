# 使用状況とコスト API

Usage & Cost Admin API を使用して、組織の API 使用状況とコスト データにプログラムでアクセスします。

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

Usage & Cost Admin API は、組織の過去の API 使用状況とコスト データへのプログラムによるきめ細かいアクセスを提供します。このデータは、Claude Console の [使用状況](/usage) および [コスト](/cost) ページで利用可能な情報と同様です。

この API により、Claude の実装をより適切に監視、分析、最適化できます。

* **正確な使用状況追跡:** レスポンス トークン カウントのみに依存するのではなく、正確なトークン数と使用パターンを取得します
* **コスト調整:** 内部記録を Anthropic の請求と照合して、財務および会計チームをサポートします
* **製品パフォーマンスと改善:** 製品パフォーマンスを監視しながら、システムの変更がそれを改善したかどうかを測定するか、アラートを設定します
* **[レート制限](/docs/ja/api/rate-limits) および [優先度層](/docs/ja/api/service-tiers#get-started-with-priority-tier) の最適化:** [プロンプト キャッシング](/docs/ja/build-with-claude/prompt-caching) や特定のプロンプトなどの機能を最適化して、割り当てられた容量を最大限に活用するか、専用容量を購入します。
* **高度な分析:** Console で利用可能なものより深いデータ分析を実行します

<Check>
  **Admin API キーが必要です**
  
  この API は [Admin API](/docs/ja/build-with-claude/administration-api) の一部です。これらのエンドポイントには、標準 API キーとは異なる Admin API キー (`sk-ant-admin...` で始まる) が必要です。管理者ロールを持つ組織メンバーのみが、[Claude Console](/settings/admin-keys) を通じて Admin API キーをプロビジョニングできます。
</Check>

## パートナー ソリューション

主要な可観測性プラットフォームは、カスタム コードを記述することなく Claude API の使用状況とコストを監視するための、すぐに使用できる統合を提供しています。これらの統合は、ダッシュボード、アラート、分析を提供して、API 使用状況を効果的に管理するのに役立ちます。

<CardGroup cols={3}>
  <Card title="CloudZero" icon="chart" href="https://docs.cloudzero.com/docs/connections-anthropic">
    コスト追跡と予測のためのクラウド インテリジェンス プラットフォーム
  </Card>
  <Card title="Datadog" icon="chart" href="https://docs.datadoghq.com/integrations/anthropic/">
    自動トレースと監視を備えた LLM 可観測性
  </Card>
  <Card title="Grafana Cloud" icon="chart" href="https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-anthropic/">
    すぐに使用できるダッシュボードとアラートを備えた、簡単な LLM 可観測性のためのエージェントレス統合
  </Card>
  <Card title="Honeycomb" icon="polygon" href="https://docs.honeycomb.io/integrations/anthropic-usage-monitoring/">
    OpenTelemetry を通じた高度なクエリと可視化
  </Card>
  <Card title="Vantage" icon="chart" href="https://docs.vantage.sh/connecting_anthropic">
    LLM コスト & 使用状況可観測性のための FinOps プラットフォーム
  </Card>
</CardGroup>

## クイック スタート

過去 7 日間の組織の日次使用状況を取得します。

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-08T00:00:00Z&\
ending_at=2025-01-15T00:00:00Z&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
  **統合用に User-Agent ヘッダーを設定します**
  
  統合を構築している場合は、User-Agent ヘッダーを設定して、使用パターンを理解するのに役立てます。
  ```
  User-Agent: YourApp/1.0.0 (https://yourapp.com)
  ```
</Tip>

## 使用状況 API

`/v1/organizations/usage_report/messages` エンドポイントを使用して、モデル、ワークスペース、サービス層による詳細な内訳を含む、組織全体のトークン消費を追跡します。

### 主要な概念

- **時間バケット:** 固定間隔 (`1m`、`1h`、または `1d`) でデータを集計します
- **トークン追跡:** キャッシュされていない入力、キャッシュされた入力、キャッシュ作成、および出力トークンを測定します
- **フィルタリングとグループ化:** API キー、ワークスペース、モデル、サービス層、またはコンテキスト ウィンドウでフィルタリングし、これらの次元で結果をグループ化します
- **サーバー ツール使用状況:** Web 検索などのサーバー側ツールの使用状況を追跡します

完全なパラメータの詳細とレスポンス スキーマについては、[使用状況 API リファレンス](/docs/ja/api/admin-api/usage-cost/get-messages-usage-report) を参照してください。

### 基本的な例

#### モデル別の日次使用状況

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
group_by[]=model&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### フィルタリング付きの時間単位の使用状況

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-15T00:00:00Z&\
ending_at=2025-01-15T23:59:59Z&\
models[]=claude-sonnet-4-5-20250929&\
service_tiers[]=batch&\
context_window[]=0-200k&\
bucket_width=1h" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### API キーとワークスペースで使用状況をフィルタリングします

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
api_key_ids[]=apikey_01Rj2N8SVvo6BePZj99NhmiT&\
api_key_ids[]=apikey_01ABC123DEF456GHI789JKL&\
workspace_ids[]=wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ&\
workspace_ids[]=wrkspc_01XYZ789ABC123DEF456MNO&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
組織の API キー ID を取得するには、[API キーのリスト](/docs/ja/api/admin-api/apikeys/list-api-keys) エンドポイントを使用します。

組織のワークスペース ID を取得するには、[ワークスペースのリスト](/docs/ja/api/admin-api/workspaces/list-workspaces) エンドポイントを使用するか、Anthropic Console で組織のワークスペース ID を見つけます。
</Tip>

### 時間粒度の制限

| 粒度 | デフォルト制限 | 最大制限 | ユース ケース |
|-------------|---------------|---------------|----------|
| `1m` | 60 バケット | 1440 バケット | リアルタイム監視 |
| `1h` | 24 バケット | 168 バケット | 日次パターン |
| `1d` | 7 バケット | 31 バケット | 週次/月次レポート |

## コスト API

`/v1/organizations/cost_report` エンドポイントを使用して、USD でのサービス レベルのコスト内訳を取得します。

### 主要な概念

- **通貨:** すべてのコストは USD で、最小単位 (セント) の 10 進文字列として報告されます
- **コスト タイプ:** トークン使用状況、Web 検索、およびコード実行コストを追跡します
- **グループ化:** ワークスペースまたは説明でコストをグループ化して、詳細な内訳を取得します
- **時間バケット:** 日次粒度のみ (`1d`)

完全なパラメータの詳細とレスポンス スキーマについては、[コスト API リファレンス](/docs/ja/api/admin-api/usage-cost/get-cost-report) を参照してください。

<Warning>
  優先度層のコストは異なる請求モデルを使用しており、コスト エンドポイントには含まれていません。使用状況エンドポイントを通じて優先度層の使用状況を追跡します。
</Warning>

### 基本的な例

```bash
curl "https://api.anthropic.com/v1/organizations/cost_report?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
group_by[]=workspace_id&\
group_by[]=description" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## ページネーション

両方のエンドポイントは、大規模なデータセットのページネーションをサポートしています。

1. 初期リクエストを実行します
2. `has_more` が `true` の場合、次のリクエストで `next_page` 値を使用します
3. `has_more` が `false` になるまで続けます

```bash
# 最初のリクエスト
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# レスポンスに含まれるもの: "has_more": true, "next_page": "page_xyz..."

# ページネーション付きの次のリクエスト
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7&\
page=page_xyz..." \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## 一般的なユース ケース

[anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook) で詳細な実装を確認します。

- **日次使用状況レポート:** トークン消費トレンドを追跡します
- **コスト配分:** チャージバック用にワークスペース別に費用を配分します
- **キャッシュ効率:** プロンプト キャッシングを測定および最適化します
- **予算監視:** 支出しきい値のアラートを設定します
- **CSV エクスポート:** 財務チーム向けのレポートを生成します

## よくある質問

### データはどのくらい新しいですか?
使用状況とコスト データは通常、API リクエスト完了後 5 分以内に表示されますが、遅延がより長くなる場合もあります。

### 推奨されるポーリング頻度は?
API は継続的な使用のために 1 分ごとのポーリングをサポートしています。短いバースト (ページネーション データのダウンロードなど) の場合、より頻繁なポーリングが許容されます。頻繁な更新が必要なダッシュボードの結果をキャッシュします。

### コード実行の使用状況を追跡するにはどうすればよいですか?
コード実行コストはコスト エンドポイントに表示され、説明フィールドの `Code Execution Usage` の下にグループ化されます。コード実行は使用状況エンドポイントに含まれていません。

### 優先度層の使用状況を追跡するにはどうすればよいですか?
使用状況エンドポイントで `service_tier` でフィルタリングまたはグループ化し、`priority` 値を探します。優先度層のコストはコスト エンドポイントでは利用できません。

### Workbench の使用状況はどうなりますか?
Workbench からの API 使用状況は API キーに関連付けられていないため、その次元でグループ化する場合でも `api_key_id` は `null` になります。

### デフォルト ワークスペースはどのように表現されますか?
デフォルト ワークスペースに帰属する使用状況とコストは、`workspace_id` に `null` 値を持ちます。

### Claude Code のユーザーごとのコスト内訳を取得するにはどうすればよいですか?

[Claude Code Analytics API](/docs/ja/build-with-claude/claude-code-analytics-api) を使用します。これは、多くの API キーでコストを分解する際のパフォーマンス制限なしに、ユーザーごとの推定コストと生産性メトリクスを提供します。多くのキーを持つ一般的な API 使用の場合、[使用状況 API](#usage-api) を使用してトークン消費をコスト プロキシとして追跡します。

## 関連項目
使用状況とコスト API は、ユーザーにより良いエクスペリエンスを提供し、コストを管理し、レート制限を保持するのに役立つために使用できます。これらの他の機能の詳細については、以下をご覧ください。

- [Admin API の概要](/docs/ja/build-with-claude/administration-api)
- [Admin API リファレンス](/docs/ja/api/admin)
- [価格](/docs/ja/about-claude/pricing)
- [プロンプト キャッシング](/docs/ja/build-with-claude/prompt-caching) - キャッシングでコストを最適化します
- [バッチ処理](/docs/ja/build-with-claude/batch-processing) - バッチ リクエストで 50% 割引
- [レート制限](/docs/ja/api/rate-limits) - 使用状況層を理解します