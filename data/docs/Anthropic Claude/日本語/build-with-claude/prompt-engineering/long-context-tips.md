# 長いコンテキストプロンプティングのヒント

Claude の拡張コンテキストウィンドウを効果的に活用するためのガイド

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Claude の拡張コンテキストウィンドウ（Claude 3 モデルの場合 200K トークン）により、複雑でデータが豊富なタスクを処理できます。このガイドは、この力を効果的に活用するのに役立ちます。

## 長いコンテキストプロンプトの重要なヒント

- **長形式データを上部に配置する**: 長いドキュメントと入力（約 20K 以上のトークン）をプロンプトの上部、クエリ、指示、および例の上に配置します。これにより、すべてのモデルで Claude のパフォーマンスが大幅に向上する可能性があります。

    <Note>テストでは、特に複雑なマルチドキュメント入力の場合、最後のクエリでレスポンスの品質が最大 30% 向上する可能性があります。</Note>

- **XML タグを使用してドキュメントコンテンツとメタデータを構造化する**: 複数のドキュメントを使用する場合、各ドキュメントを `<document>` タグで囲み、明確にするために `<document_content>` と `<source>`（およびその他のメタデータ）サブタグを使用します。

    <section title="マルチドキュメント構造の例">

    ```xml
    <documents>
      <document index="1">
        <source>annual_report_2023.pdf</source>
        <document_content>
          {{ANNUAL_REPORT}}
        </document_content>
      </document>
      <document index="2">
        <source>competitor_analysis_q2.xlsx</source>
        <document_content>
          {{COMPETITOR_ANALYSIS}}
        </document_content>
      </document>
    </documents>

    年次報告書と競合分析を分析します。戦略的な利点を特定し、Q3 の焦点領域を推奨します。
    ```
    
</section>

- **引用でレスポンスを根拠づける**: 長いドキュメントタスクの場合、Claude にタスクを実行する前に、ドキュメントの関連部分を最初に引用するよう依頼します。これにより、Claude がドキュメントの残りのコンテンツの「ノイズ」を切り抜けるのに役立ちます。

    <section title="引用抽出の例">

    ```xml
    あなたは AI 医師アシスタントです。あなたのタスクは、医師が患者の可能な病気を診断するのを支援することです。

    <documents>
      <document index="1">
        <source>patient_symptoms.txt</source>
        <document_content>
          {{PATIENT_SYMPTOMS}}
        </document_content>
      </document>
      <document index="2">
        <source>patient_records.txt</source>
        <document_content>
          {{PATIENT_RECORDS}}
        </document_content>
      </document>
      <document index="3">
        <source>patient01_appt_history.txt</source>
        <document_content>
          {{PATIENT01_APPOINTMENT_HISTORY}}
        </document_content>
      </document>
    </documents>

    患者の報告された症状の診断に関連する患者記録と予約履歴から引用を見つけます。これらを <quotes> タグに配置します。次に、これらの引用に基づいて、医師が患者の症状を診断するのに役立つすべての情報をリストします。診断情報を <info> タグに配置します。
    ```
    
</section>

***

<CardGroup cols={3}>
  <Card title="プロンプトライブラリ" icon="link" href="/docs/ja/resources/prompt-library/library">
    様々なタスクとユースケースのための厳選されたプロンプトの選択肢から着想を得てください。
  </Card>
  <Card title="GitHub プロンプティングチュートリアル" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    ドキュメントに記載されているプロンプトエンジニアリングの概念をカバーする例が豊富なチュートリアルです。
  </Card>
  <Card title="Google Sheets プロンプティングチュートリアル" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    インタラクティブなスプレッドシートを使用したプロンプトエンジニアリングチュートリアルの軽量版です。
  </Card>
</CardGroup>