# 出力の一貫性を向上させる

Claudeの応答をより一貫性のあるものにする方法

---

<Tip>
**JSON スキーマの準拠を保証するために**

Claudeが常に特定のスキーマに準拠した有効なJSONを出力する必要がある場合は、以下のプロンプトエンジニアリング技法の代わりに[構造化出力](/docs/ja/build-with-claude/structured-outputs)を使用してください。構造化出力は、スキーマ準拠を保証し、このユースケースのために特別に設計されています。

以下の技法は、一般的な出力の一貫性が必要な場合、または厳密なJSONスキーマを超える柔軟性が必要な場合に役立ちます。
</Tip>

Claudeの応答をより一貫性のあるものにする方法は以下の通りです：

## 目的の出力形式を指定する
JSON、XML、またはカスタムテンプレートを使用して、目的の出力形式を正確に定義し、Claudeが必要なすべての出力フォーマット要素を理解するようにします。

<section title="例：顧客フィードバックの標準化">

    | Role | Content |
    | ---- | ------- |
    | User | あなたはカスタマーインサイトAIです。このフィードバックを分析し、JSON形式で出力してください。キーは「sentiment」（positive/negative/neutral）、「key_issues」（リスト）、「action_items」（「team」と「task」を含む辞書のリスト）です。<br/><br/>「3年間のロイヤルユーザーですが、最近のUIアップデートは最悪です。基本的な機能を見つけることが宝探しのようになってしまいました。さらに、新しい「プレミアム」価格設定は法外です。これが早急に修正されない限り、乗り換えを検討しています。」 |
    | Assistant | \{<br/>  "sentiment": "negative",<br/>  "key_issues": [<br/>    "最近のアップデートによるUI/UXの悪化",<br/>    "基本的な機能を見つけるのが困難",<br/>    "認識される高い価格設定（新しい「プレミアム」ティア）"<br/>  ],<br/>  "action_items": [<br/>    \{<br/>      "team": "Product",<br/>      "task": "ユーザビリティテストを実施し、調査結果に基づいてUIを反復改善する"<br/>    \},<br/>    \{<br/>      "team": "UX",<br/>      "task": "機能発見ガイドまたはオンボーディングフローを作成する"<br/>    \},<br/>    \{<br/>      "team": "Marketing",<br/>      "task": "価格戦略を見直し、価値提案を伝える"<br/>    \},<br/>    \{<br/>      "team": "Customer Success",<br/>      "task": "ユーザーに連絡し、チャーン防止のための譲歩を提供する"<br/>    \}<br/>  ]<br/>\} |

</section>

## Claudeの応答を事前入力する
`Assistant`ターンを目的の形式で事前入力します。このトリックはClaudeのフレンドリーな前置きをバイパスし、構造を強制します。

<section title="例：日次売上レポート">

    | Role | Content |
    | ---- | ------- |
    | User | あなたは洞察力のある営業インテリジェンスAIです。本日の売上レポートを生成してください。<br/><br/>レポートを次のように構成してください：<br/><br/>\<report><br/>    \<summary><br/>        \<metric name="total_revenue">\$0.00\</metric><br/>        \<metric name="units_sold">0\</metric><br/>        \<metric name="avg_order_value">\$0.00\</metric><br/>    \</summary><br/>    \<top_products><br/>        \<br/>            \<name>Product Name\</name><br/>            \<revenue>\$0.00\</revenue><br/>            \<units>0\</units><br/>        \</product><br/>        ...<br/>    \</top_products><br/>    \<regional_performance><br/>        \<region><br/>            \<name>Region Name\</name><br/>            \<revenue>\$0.00\</revenue><br/>            \<growth>0.0%\</growth><br/>        \</region><br/>        ...<br/>    \</regional_performance><br/>    \<action_items><br/>        \<item>Action item.\</item><br/>        ...<br/>    \</action_items><br/>\</report> |
    | Assistant (prefill) | \<report><br/>    \<summary><br/>        \<metric name= |
    | Assistant | "total_revenue">\$842,567.00\</metric><br/>        \<metric name="units_sold">15,238\</metric><br/>        \<metric name="avg_order_value">\$55.29\</metric><br/>    \</summary><br/>    \<top_products><br/>        \<br/>            \<name>AcmeGuard Pro\</name><br/>            \<revenue>\$325,890.00\</revenue><br/>            \<units>3,621\</units><br/>        \</product><br/>        \<br/>            \<name>AcmeVault Enterprise\</name><br/>            \<revenue>\$254,400.00\</revenue><br/>            \<units>1,272\</units><br/>        \</product><br/>        \<br/>            \<name>AcmeBoost XL\</name><br/>            \<revenue>\$147,690.00\</revenue><br/>            \<units>4,923\</units><br/>        \</product><br/>    \</top_products><br/>    \<regional_performance><br/>        \<region><br/>            \<name>APAC\</name><br/>            \<revenue>\$258,960.00\</revenue><br/>            \<growth>12.8%\</growth><br/>        \</region><br/>        \<region><br/>            \<name>EMEA\</name><br/>            \<revenue>\$325,478.00\</revenue><br/>            \<growth>3.2%\</growth><br/>        \</region><br/>        \<region><br/>            \<name>Americas\</name><br/>            \<revenue>\$258,129.00\</revenue><br/>            \<growth>-2.1%\</growth><br/>        \</region><br/>    \</regional_performance><br/>    \<action_items><br/>        \<item>Americas の売上低下を調査し、地域営業チームミーティングをスケジュールする。\</item><br/>        \<item>APAC での成長を活かすため、CloudGuard Pro のロールアウトを加速させる。\</item><br/>        \<item>NetBoost XL の価格設定を見直す。高い出荷量だが低い売上。\</item><br/>    \</action_items><br/>\</report> |

</section>

## 例で制約を付ける
目的の出力の例を提供します。これは抽象的な指示よりもClaudeの理解をより良く訓練します。

<section title="例：一貫した市場インテリジェンスの生成">

    | Role | Content |
    | ---- | ------- |
    | User | 市場インテリジェンスAIとして、競合他社に関するデータを分析するのがあなたのタスクです。以下は競合他社データです：<br/>\<data><br/>\{\{DATA}}<br/>\</data><br/><br/>この例の形式に従って出力してください：<br/><br/>\<competitor><br/>  \<name>Rival Inc\</name><br/>  \<overview>50語の要約。\</overview><br/>  \<swot><br/>    \<strengths>- 箇条書き\</strengths><br/>    \<weaknesses>- 箇条書き\</weaknesses><br/>    \<opportunities>- 箇条書き\</opportunities><br/>    \<threats>- 箇条書き\</threats><br/>  \</swot><br/>  \<strategy>30語の戦略的対応。\</strategy><br/>\</competitor><br/><br/>それでは、この形式を使用して AcmeGiant と AcmeDataCo を分析してください。 |
    | Assistant | \<competitor><br/>  \<name>AcmeGiant\</name><br/>  \<overview>消費者向けおよびエンタープライズ製品の広大なエコシステムを持つグローバルテックリーダー。イノベーション、強力なブランド、統合されたハードウェア、ソフトウェア、サービスを通じた深い顧客ロックインで知られています。\</overview><br/>  \<swot><br/>    \<strengths><br/>      - 継続的なイノベーションを推進する膨大なR&D予算<br/>      - ロイヤルな顧客ベースと強力なブランド認知度<br/>      - シナジー的な製品エコシステムが切り替えコストを増加させる<br/>    \</strengths><br/>    \<weaknesses><br/>      - 高い価格は価格に敏感な顧客を遠ざける可能性がある<br/>      - エンタープライズ固有のカスタマイズニーズへの対応が遅い<br/>      - 複数の市場でのプライバシーの懸念と規制精査<br/>    \</weaknesses><br/>    \<opportunities><br/>      - AIおよびML機能の需要の増加<br/>      - 新興市場への拡大<br/>      - 製品またはタレントギャップを埋めるための買収<br/>    \</opportunities><br/>    \<threats><br/>      - クラウドネイティブ競合他社の急速な台頭<br/>      - 独占禁止法訴訟と規制措置<br/>      - スタートアップと競合他社によるタレント引き抜き<br/>    \</threats><br/>  \</swot><br/>  \<strategy>当社の機動力とカスタマイズに焦点を当てます。マーケティングで TechGiant の遅いエンタープライズ対応とプライバシー問題をターゲットにします。\</strategy><br/>\</competitor><br/><br/>\<competitor><br/>  \<name>AcmeDataCo\</name><br/>  \<overview>データ分析と可視化の新興スター。直感的なセルフサービスBIツールをフリーミアムモデルで提供し、スタートアップとエンタープライズチームの両方にアピールしています。\</overview><br/>  \<swot><br/>    \<strengths><br/>      - ユーザーフレンドリーなインターフェースは専門的なトレーニングの必要性を軽減<br/>      - フリーミアムモデルはエントリーバリアを低下させ、ウイルス成長を促進<br/>      - データ駆動型決定の台頭に対する強力なプロダクト・マーケット・フィット<br/>    \</strengths><br/>    \<weaknesses><br/>      - 確立されたBIツールと比較して高度な分析が限定的<br/>      - 非常に大規模なデータセットでのスケーリング問題が報告されている<br/>      - サードパーティクラウドインフラストラクチャ（AWS）に依存<br/>    \</weaknesses><br/>    \<opportunities><br/>      - 予測分析とAI駆動型インサイトへの拡大<br/>      - 補完的なテックベンダーとの戦略的提携の形成<br/>      - 業界固有のソリューション向けのカスタマイズ可能なダッシュボード<br/>    \</opportunities><br/>    \<threats><br/>      - 市場飽和。セルフサービスBIに多くの新規参入者<br/>      - エンタープライズBIの大手企業がより使いやすいツールを開発中<br/>      - データプライバシー規制がコンプライアンスの複雑性を増加させている<br/>    \</threats><br/>  \</swot><br/>  \<strategy>当社の堅牢なエンタープライズ機能とデータガバナンスを強調します。DataCo のスケール制限に苦しむアカウントをターゲットにします。\</strategy><br/>\</competitor> |

</section>

## 一貫性のためにレトリーバルを使用する
一貫したコンテキストが必要なタスク（チャットボット、ナレッジベースなど）の場合、レトリーバルを使用してClaudeの応答を固定情報セットに基づかせます。

<section title="例：IT サポートの一貫性の向上">

    | Role | Content |
    | ---- | ------- |
    | User | あなたはナレッジベースデータを参照する当社のITサポートAIです。以下はナレッジベースのエントリです：<br/><br/>\<kb><br/>  \<entry><br/>    \<id>1\</id><br/>    \<title>Active Directory パスワードをリセット\</title><br/>    \<content>1. password.ourcompany.com にアクセス<br/>2. ユーザー名を入力<br/>3. 「パスワードを忘れた」をクリック<br/>4. メール指示に従う\</content><br/>  \</entry><br/>  \<entry><br/>    \<id>2\</id><br/>    \<title>VPN に接続\</title><br/>    \<content>1. ソフトウェアセンターから GlobalProtect をインストール<br/>2. GlobalProtect を開き、「vpn.ourcompany.com」を入力<br/>3. AD 認証情報を使用してログイン\</content><br/>  \</entry><br/>\</kb><br/><br/>ユーザーを支援する際は、常にナレッジベースを最初に確認してください。この形式で応答してください：<br/><br/>\<response><br/>  \<kb_entry>使用されたナレッジベースエントリ\</kb_entry><br/>  \<answer>あなたの応答\</answer><br/>\</response> ナレッジベースを正しく使用する方法を確認するために、自分自身のためにいくつかのテスト質問を作成し、それらに答えてください。 |
    | Assistant | 了解しました。ナレッジベースを使用して一貫した応答を提供します。いくつかのシナリオでテストしてみましょう。<br/><br/>ユーザー：メールにログインできません。パスワードを忘れたと思います。<br/><br/>\<response><br/>  \<kb_entry>1: Active Directory パスワードをリセット\</kb_entry><br/>  \<answer>メールへのログインに問題があり、パスワードを忘れたとのことですね。心配しないでください。これは一般的な問題です。メールアクセスに使用される Active Directory パスワードをリセットするには、以下の手順に従ってください：<br/><br/>1. password.ourcompany.com にアクセス<br/>2. ユーザー名を入力（メールアドレスと同じ）<br/>3. 「パスワードを忘れた」リンクをクリック<br/>4. パスワードをリセットするための指示が記載されたメールを受け取ります。指示に従ってください。<br/><br/>リセット後、メールにログインできるようになります。さらにサポートが必要な場合はお知らせください。\</answer><br/>\</response><br/><br/>ユーザー：今日は在宅勤務です。内部リソースにアクセスするにはどうすればよいですか？<br/><br/>\<response><br/>  \<kb_entry>2: VPN に接続\</kb_entry><br/>  \<answer>良い質問です！在宅勤務中に内部リソースにアクセスするには、当社の会社 VPN（仮想プライベートネットワーク）に接続する必要があります。セットアップ方法は以下の通りです：<br/><br/>1. まず、GlobalProtect VPN クライアントをインストールします。これはソフトウェアセンターで見つけることができます。<br/>2. インストール後、GlobalProtect アプリケーションを開きます。<br/>3. サーバーフィールドに「vpn.ourcompany.com」を入力します。<br/>4. メール用に使用するのと同じユーザー名とパスワードである Active Directory（AD）認証情報を使用してログインします。<br/><br/>接続すると、オフィスにいるかのようにすべての内部リソースへの安全なアクセスが得られます。セットアップ中に問題が発生した場合はお知らせください。\</answer><br/>\</response> |

</section>

## 複雑なタスクのためにプロンプトをチェーンする
複雑なタスクを小さな一貫性のあるサブタスクに分割します。各サブタスクはClaudeの全注意を受け、スケーリングされたワークフロー全体での一貫性エラーを削減します。