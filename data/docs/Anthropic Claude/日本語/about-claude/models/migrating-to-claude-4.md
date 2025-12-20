# Claude 4.5への移行

Claude 4.5モデルへの移行ガイド

---

このガイドでは、Claude 4.5モデルへの2つの主要な移行パスについて説明します：

- **Claude Sonnet 3.7 → Claude Sonnet 4.5**: 推論、コーディング、長時間実行エージェント機能で業界最高水準の知能を備えた最も知能の高いモデル
- **Claude Haiku 3.5 → Claude Haiku 4.5**: リアルタイムアプリケーションと大量の知能処理向けに、フロンティア水準に近いパフォーマンスを備えた最速で最も知能の高いHaikuモデル

両方の移行には、実装の更新が必要な破壊的変更が含まれています。このガイドでは、各移行パスについて段階的な手順と明確にマークされた破壊的変更を説明します。

移行を開始する前に、[Claude 4.5の新機能](/docs/ja/about-claude/models/whats-new-claude-4-5)を確認して、拡張思考、コンテキスト認識、動作改善を含む、これらのモデルで利用可能な新機能と機能を理解することをお勧めします。

## Claude Sonnet 3.7からClaude Sonnet 4.5への移行

Claude Sonnet 4.5は最も知能の高いモデルで、推論、コーディング、長時間実行の自律エージェント向けに業界最高水準のパフォーマンスを提供します。この移行には、実装の更新が必要な複数の破壊的変更が含まれています。

### 移行手順

1. **モデル名を更新します：**
   ```python
   # 前（Claude Sonnet 3.7）
   model="claude-3-7-sonnet-20250219"

   # 後（Claude Sonnet 4.5）
   model="claude-sonnet-4-5-20250929"
   ```

2. **サンプリングパラメータを更新します**

   <Warning>
   これはClaude Sonnet 3.7からの破壊的変更です。
   </Warning>

   `temperature`または`top_p`のいずれかのみを使用し、両方は使用しないでください：

   ```python
   # 前（Claude Sonnet 3.7）- これはSonnet 4.5でエラーになります
   response = client.messages.create(
       model="claude-3-7-sonnet-20250219",
       temperature=0.7,
       top_p=0.9,  # 両方は使用できません
       ...
   )

   # 後（Claude Sonnet 4.5）
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       temperature=0.7,  # temperatureまたはtop_pを使用し、両方は使用しません
       ...
   )
   ```

3. **新しい`refusal`停止理由を処理します**

   アプリケーションを更新して、[`refusal`停止理由を処理](/docs/ja/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals)します：

   ```python
   response = client.messages.create(...)

   if response.stop_reason == "refusal":
       # 拒否を適切に処理します
       pass
   ```

4. **テキストエディタツールを更新します（該当する場合）**

   <Warning>
   これはClaude Sonnet 3.7からの破壊的変更です。
   </Warning>

   `text_editor_20250728`（タイプ）と`str_replace_based_edit_tool`（名前）に更新します。`undo_edit`コマンドを使用するコードを削除します。
   
   ```python
   # 前（Claude Sonnet 3.7）
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # 後（Claude Sonnet 4.5）
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   詳細については、[テキストエディタツールドキュメント](/docs/ja/agents-and-tools/tool-use/text-editor-tool)を参照してください。

5. **コード実行ツールを更新します（該当する場合）**

   `code_execution_20250825`にアップグレードします。レガシーバージョン`code_execution_20250522`は引き続き機能しますが、推奨されません。移行手順については、[コード実行ツールドキュメント](/docs/ja/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version)を参照してください。

6. **トークン効率的なツール使用ベータヘッダーを削除します**

   トークン効率的なツール使用はClaude 3.7 Sonnetでのみ機能するベータ機能です。すべてのClaude 4モデルには組み込みのトークン効率的なツール使用があるため、ベータヘッダーを含める必要がなくなります。

   リクエストから`token-efficient-tools-2025-02-19` [ベータヘッダー](/docs/ja/api/beta-headers)を削除します：

   ```python
   # 前（Claude Sonnet 3.7）
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["token-efficient-tools-2025-02-19"],  # これを削除します
       ...
   )

   # 後（Claude Sonnet 4.5）
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # トークン効率的なツールベータヘッダーなし
       ...
   )
   ```

7. **拡張出力ベータヘッダーを削除します**

   拡張出力用の`output-128k-2025-02-19` [ベータヘッダー](/docs/ja/api/beta-headers)はClaude Sonnet 3.7でのみ利用可能です。

   リクエストからこのヘッダーを削除します：

   ```python
   # 前（Claude Sonnet 3.7）
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["output-128k-2025-02-19"],  # これを削除します
       ...
   )

   # 後（Claude Sonnet 4.5）
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # output-128kベータヘッダーなし
       ...
   )
   ```

8. **動作変更のためにプロンプトを更新します**

   Claude Sonnet 4.5はより簡潔で直接的なコミュニケーションスタイルを持ち、明示的な指示が必要です。最適化ガイダンスについては、[Claude 4プロンプトエンジニアリングベストプラクティス](/docs/ja/build-with-claude/prompt-engineering/claude-4-best-practices)を確認してください。

9. **複雑なタスク向けに拡張思考を有効にすることを検討します**

   コーディングと推論タスクで大幅なパフォーマンス向上のために[拡張思考](/docs/ja/build-with-claude/extended-thinking)を有効にします（デフォルトでは無効）：

   ```python
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 10000},
       messages=[...]
   )
   ```

   <Note>
   拡張思考は[プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching#caching-with-thinking-blocks)の効率に影響します。
   </Note>

10. **実装をテストします**

    本番環境にデプロイする前に開発環境でテストして、すべての破壊的変更が適切に処理されていることを確認します。

### Sonnet 3.7 → 4.5移行チェックリスト

- [ ] モデルIDを`claude-sonnet-4-5-20250929`に更新
- [ ] **破壊的変更**: サンプリングパラメータを更新して、`temperature`または`top_p`のみを使用し、両方は使用しない
- [ ] 新しい`refusal`停止理由をアプリケーションで処理
- [ ] **破壊的変更**: テキストエディタツールを`text_editor_20250728`と`str_replace_based_edit_tool`に更新（該当する場合）
- [ ] **破壊的変更**: `undo_edit`コマンドを使用するコードを削除（該当する場合）
- [ ] コード実行ツールを`code_execution_20250825`に更新（該当する場合）
- [ ] `token-efficient-tools-2025-02-19`ベータヘッダーを削除（該当する場合）
- [ ] `output-128k-2025-02-19`ベータヘッダーを削除（該当する場合）
- [ ] [Claude 4ベストプラクティス](/docs/ja/build-with-claude/prompt-engineering/claude-4-best-practices)に従ってプロンプトを確認および更新
- [ ] 複雑な推論タスク向けに拡張思考を有効にすることを検討
- [ ] `model_context_window_exceeded`停止理由を処理（Sonnet 4.5固有）
- [ ] 長時間実行エージェント向けにメモリツールを有効にすることを検討（ベータ）
- [ ] コンテキスト編集用に自動ツール呼び出しクリアを使用することを検討（ベータ）
- [ ] 本番環境へのデプロイ前に開発環境でテスト

### Claude Sonnet 3.7から削除された機能

- **トークン効率的なツール使用**: `token-efficient-tools-2025-02-19`ベータヘッダーはClaude 3.7 Sonnetでのみ機能し、Claude 4モデルではサポートされていません（ステップ6を参照）
- **拡張出力**: `output-128k-2025-02-19`ベータヘッダーはサポートされていません（ステップ7を参照）

両方のヘッダーはClaude 4リクエストに含めることができますが、効果はありません。

## Claude Haiku 3.5からClaude Haiku 4.5への移行

Claude Haiku 4.5は最速で最も知能の高いHaikuモデルで、フロンティア水準に近いパフォーマンスを備え、インタラクティブアプリケーション向けのリアルタイムパフォーマンスと大量の知能処理向けにプレミアムモデル品質を提供します。この移行には、実装の更新が必要な複数の破壊的変更が含まれています。

新機能の完全な概要については、[Claude 4.5の新機能](/docs/ja/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5)を参照してください。

<Note>
Haiku 4.5の価格は入力トークン100万あたり$1、出力トークン100万あたり$5です。詳細については、[Claude価格](/docs/ja/about-claude/pricing)を参照してください。
</Note>

### 移行手順

1. **モデル名を更新します：**
   ```python
   # 前（Haiku 3.5）
   model="claude-3-5-haiku-20241022"

   # 後（Haiku 4.5）
   model="claude-haiku-4-5-20251001"
   ```

2. **ツールバージョンを更新します（該当する場合）**

   <Warning>
   これはClaude Haiku 3.5からの破壊的変更です。
   </Warning>

   Haiku 4.5は最新のツールバージョンのみをサポートしています：

   ```python
   # 前（Haiku 3.5）
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # 後（Haiku 4.5）
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   - **テキストエディタ**: `text_editor_20250728`と`str_replace_based_edit_tool`を使用
   - **コード実行**: `code_execution_20250825`を使用
   - `undo_edit`コマンドを使用するコードを削除

3. **サンプリングパラメータを更新します**

   <Warning>
   これはClaude Haiku 3.5からの破壊的変更です。
   </Warning>

   `temperature`または`top_p`のいずれかのみを使用し、両方は使用しないでください：

   ```python
   # 前（Haiku 3.5）- これはHaiku 4.5でエラーになります
   response = client.messages.create(
       model="claude-3-5-haiku-20241022",
       temperature=0.7,
       top_p=0.9,  # 両方は使用できません
       ...
   )

   # 後（Haiku 4.5）
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       temperature=0.7,  # temperatureまたはtop_pを使用し、両方は使用しません
       ...
   )
   ```

4. **新しいレート制限を確認します**

   Haiku 4.5はHaiku 3.5とは異なるレート制限があります。詳細については、[レート制限ドキュメント](/docs/ja/api/rate-limits)を参照してください。

5. **新しい`refusal`停止理由を処理します**

   アプリケーションを更新して、[拒否停止理由を処理](/docs/ja/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals)します。

6. **複雑なタスク向けに拡張思考を有効にすることを検討します**

   コーディングと推論タスクで大幅なパフォーマンス向上のために[拡張思考](/docs/ja/build-with-claude/extended-thinking)を有効にします（デフォルトでは無効）：

   ```python
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 5000},
       messages=[...]
   )
   ```
   <Note>
   拡張思考は[プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching#caching-with-thinking-blocks)の効率に影響します。
   </Note>

7. **新しい機能を探索します**

   [Claude 4.5の新機能](/docs/ja/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5)でコンテキスト認識、増加した出力容量（64Kトークン）、より高い知能、改善された速度の詳細を参照してください。

8. **実装をテストします**

   本番環境にデプロイする前に開発環境でテストして、すべての破壊的変更が適切に処理されていることを確認します。

### Haiku 3.5 → 4.5移行チェックリスト

- [ ] モデルIDを`claude-haiku-4-5-20251001`に更新
- [ ] **破壊的変更**: ツールバージョンを最新に更新（例：`text_editor_20250728`、`code_execution_20250825`）- レガシーバージョンはサポートされていません
- [ ] **破壊的変更**: `undo_edit`コマンドを使用するコードを削除（該当する場合）
- [ ] **破壊的変更**: サンプリングパラメータを更新して、`temperature`または`top_p`のみを使用し、両方は使用しない
- [ ] 新しいレート制限を確認および調整（Haiku 3.5とは別）
- [ ] 新しい`refusal`停止理由をアプリケーションで処理
- [ ] 複雑な推論タスク向けに拡張思考を有効にすることを検討（新機能）
- [ ] 長いセッションでのより良いトークン管理のためにコンテキスト認識を活用
- [ ] より大きな応答に対応（最大出力が8Kから64Kトークンに増加）
- [ ] [Claude 4ベストプラクティス](/docs/ja/build-with-claude/prompt-engineering/claude-4-best-practices)に従ってプロンプトを確認および更新
- [ ] 本番環境へのデプロイ前に開発環境でテスト

## Sonnet 4.5とHaiku 4.5の選択

Claude Sonnet 4.5とClaude Haiku 4.5は両方とも異なる強みを持つ強力なClaude 4モデルです：

### Claude Sonnet 4.5を選択（最も知能の高い）：

- **複雑な推論と分析**: 高度なタスク向けの業界最高水準の知能
- **長時間実行の自律エージェント**: 長期間独立して動作するエージェント向けの優れたパフォーマンス
- **高度なコーディングタスク**: 高度な計画とセキュリティエンジニアリングを備えた最強のコーディングモデル
- **大規模コンテキストワークフロー**: メモリツールとコンテキスト編集機能を備えた拡張コンテキスト管理
- **最大機能が必要なタスク**: 知能と精度が最優先事項の場合

### Claude Haiku 4.5を選択（最速で最も知能の高いHaiku）：

- **リアルタイムアプリケーション**: フロンティア水準に近いパフォーマンスを備えたインタラクティブユーザー体験向けの高速応答時間
- **大量の知能処理**: 改善された速度を備えた規模での費用対効果の高い知能
- **コスト敏感なデプロイメント**: より低い価格ポイントでのフロンティア水準に近いパフォーマンス
- **サブエージェントアーキテクチャ**: マルチエージェントシステム向けの高速で知能の高いエージェント
- **規模でのコンピュータ使用**: 費用対効果の高い自律デスクトップおよびブラウザ自動化
- **速度が必要なタスク**: フロンティア水準に近い知能を維持しながら低レイテンシが重要な場合

### 拡張思考の推奨事項

Claude 4モデル、特にSonnetとHaiku 4.5は、コーディングと複雑な推論タスク向けに[拡張思考](/docs/ja/build-with-claude/extended-thinking)を使用する場合、大幅なパフォーマンス向上を示します。拡張思考は**デフォルトでは無効**ですが、要求の厳しい作業向けに有効にすることをお勧めします。

**重要**: 拡張思考は[プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching#caching-with-thinking-blocks)の効率に影響します。非ツール結果コンテンツが会話に追加されると、思考ブロックはキャッシュから削除され、マルチターン会話でコストが増加する可能性があります。パフォーマンスの利点がキャッシング上のトレードオフを上回る場合に思考を有効にすることをお勧めします。

## その他の移行シナリオ

上記の主要な移行パス（Sonnet 3.7 → 4.5およびHaiku 3.5 → 4.5）は最も一般的なアップグレードを表しています。ただし、他のClaudeモデルからClaude 4.5に移行している可能性があります。このセクションではそれらのシナリオについて説明します。

### Claude Sonnet 4 → Sonnet 4.5からの移行

**破壊的変更**: 同じリクエストで`temperature`と`top_p`の両方を指定することはできません。

他のすべてのAPI呼び出しは変更なしで機能します。モデルIDを更新し、必要に応じてサンプリングパラメータを調整します：

```python
# 前（Claude Sonnet 4）
model="claude-sonnet-4-20250514"

# 後（Claude Sonnet 4.5）
model="claude-sonnet-4-5-20250929"
```

### Claude Opus 4.1 → Sonnet 4.5からの移行

**破壊的変更なし。** すべてのAPI呼び出しは変更なしで機能します。

単にモデルIDを更新します：

```python
# 前（Claude Opus 4.1）
model="claude-opus-4-1-20250805"

# 後（Claude Sonnet 4.5）
model="claude-sonnet-4-5-20250929"
```

Claude Sonnet 4.5は推論、コーディング、長時間実行エージェント機能で業界最高水準の知能を備えた最も知能の高いモデルです。ほとんどのユースケースでOpus 4.1と比較して優れたパフォーマンスを提供します。

### Claude Opus 4.1 → Opus 4.5からの移行

**破壊的変更なし。** すべてのAPI呼び出しは変更なしで機能します。

単にモデルIDを更新します：

```python
# 前（Claude Opus 4.1）
model="claude-opus-4-1-20250805"

# 後（Claude Opus 4.5）
model="claude-opus-4-5-20251101"
```

Claude Opus 4.5は最も知能の高いモデルで、最大機能と実用的なパフォーマンスを組み合わせています。ビジョン、コーディング、コンピュータ使用で段階的な改善を備え、Opus 4.1よりもアクセスしやすい価格ポイントで提供されます。複雑な専門的なタスクとプロフェッショナルソフトウェアエンジニアリングに最適です。

<Note>
多くのモデル参照を持つコードベースの場合、[Claude Codeプラグイン](https://github.com/anthropics/claude-code/tree/main/plugins/claude-opus-4-5-migration)がOpus 4.5への移行を自動化するために利用可能です。
</Note>

### Claude 4.5モデル間での移行

**破壊的変更なし。** すべてのAPI呼び出しは変更なしで機能します。

単にモデルIDを更新します。

## ヘルプが必要ですか？

- 詳細な仕様については、[APIドキュメント](/docs/ja/api/overview)を確認してください
- パフォーマンス比較については、[モデル機能](/docs/ja/about-claude/models/overview)を確認してください
- APIの更新については、[APIリリースノート](/docs/ja/release-notes/api)を確認してください
- 移行中に問題が発生した場合はサポートに連絡してください