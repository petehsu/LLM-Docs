# 引用

Claudeが文書に関する質問に答える際に詳細な引用を提供し、回答における情報源の追跡と検証を支援する機能について説明します。

---

Claudeは文書に関する質問に答える際に詳細な引用を提供することができ、回答における情報源の追跡と検証を支援します。

Haiku 3を除く、すべての[アクティブモデル](/docs/ja/about-claude/models/overview)が引用をサポートしています。

<Warning>
*Claude Sonnet 3.7での引用*

Claude Sonnet 3.7は、ユーザーからのより明示的な指示なしには、他のClaudeモデルと比較して引用を行う可能性が低い場合があります。Claude Sonnet 3.7で引用を使用する場合、`user`ターンに「回答を引用で裏付けてください。」などの追加指示を含めることをお勧めします。

また、モデルが回答を構造化するよう求められた場合、その形式内で引用を使用するよう明示的に指示されない限り、引用を使用する可能性は低いことも観察されています。例えば、モデルが回答で`<result>`タグを使用するよう求められた場合、「`<result>`タグ内でも常に回答で引用を使用してください。」のような指示を追加する必要があります。
</Warning>
<Tip>
  引用機能に関するフィードバックやご提案は、こちらの[フォーム](https://forms.gle/9n9hSrKnKe3rpowH9)でお聞かせください。
</Tip>

Messages APIで引用を使用する方法の例を以下に示します：

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "document",
            "source": {
              "type": "text",
              "media_type": "text/plain",
              "data": "The grass is green. The sky is blue."
            },
            "title": "My Document",
            "context": "This is a trustworthy document.",
            "citations": {"enabled": true}
          },
          {
            "type": "text",
            "text": "What color is the grass and sky?"
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
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": "The grass is green. The sky is blue."
                    },
                    "title": "My Document",
                    "context": "This is a trustworthy document.",
                    "citations": {"enabled": True}
                },
                {
                    "type": "text",
                    "text": "What color is the grass and sky?"
                }
            ]
        }
    ]
)
print(response)
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.*;

public class DocumentExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        PlainTextSource source = PlainTextSource.builder()
                .data("The grass is green. The sky is blue.")
                .build();

        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .source(source)
                .title("My Document")
                .context("This is a trustworthy document.")
                .citations(CitationsConfigParam.builder().enabled(true).build())
                .build();
        
        TextBlockParam textBlockParam = TextBlockParam.builder()
                .text("What color is the grass and sky?")
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(List.of(ContentBlockParam.ofDocument(documentParam), ContentBlockParam.ofText(textBlockParam)))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```

</CodeGroup>

<Tip>
**プロンプトベースのアプローチとの比較**

プロンプトベースの引用ソリューションと比較して、引用機能には以下の利点があります：
- **コスト削減：** プロンプトベースのアプローチでClaudeに直接引用を出力させる場合、`cited_text`が出力トークンにカウントされないため、コスト削減が見込める場合があります。
- **引用の信頼性向上：** 引用を上記の各レスポンス形式に解析し、`cited_text`を抽出するため、引用は提供された文書への有効なポインタを含むことが保証されます。
- **引用品質の向上：** 私たちの評価では、引用機能は純粋にプロンプトベースのアプローチと比較して、文書から最も関連性の高い引用を引用する可能性が大幅に高いことがわかりました。
</Tip>

---

## 引用の仕組み

以下の手順でClaudeに引用を統合します：

<Steps>
  <Step title="文書を提供し、引用を有効にする">
    - サポートされている形式のいずれかで文書を含める：[PDF](#pdf-documents)、[プレーンテキスト](#plain-text-documents)、または[カスタムコンテンツ](#custom-content-documents)文書
    - 各文書で`citations.enabled=true`を設定します。現在、引用はリクエスト内のすべての文書で有効にするか、すべてで無効にする必要があります。
    - 現在はテキスト引用のみがサポートされており、画像引用はまだ利用できないことに注意してください。
  </Step>
  <Step title="文書が処理される">
    - 文書の内容は、可能な引用の最小粒度を定義するために「チャンク化」されます。例えば、文章チャンク化により、Claudeは単一の文章を引用したり、複数の連続する文章を連鎖させて段落（またはそれ以上）を引用したりできます！
      - **PDFの場合：** [PDFサポート](/docs/ja/build-with-claude/pdf-support)で説明されているようにテキストが抽出され、コンテンツは文章にチャンク化されます。PDFからの画像の引用は現在サポートされていません。
      - **プレーンテキスト文書の場合：** コンテンツは引用可能な文章にチャンク化されます。
      - **カスタムコンテンツ文書の場合：** 提供されたコンテンツブロックがそのまま使用され、追加のチャンク化は行われません。
  </Step>
  <Step title="Claudeが引用付きの回答を提供する">
    - 回答には、Claudeが行う主張とその主張を支持する引用のリストを含む複数のテキストブロックが含まれる場合があります。
    - 引用はソース文書内の特定の場所を参照します。これらの引用の形式は、引用される文書のタイプによって異なります。
      - **PDFの場合：** 引用にはページ番号範囲（1インデックス）が含まれます。
      - **プレーンテキスト文書の場合：** 引用には文字インデックス範囲（0インデックス）が含まれます。
      - **カスタムコンテンツ文書の場合：** 引用には、提供された元のコンテンツリストに対応するコンテンツブロックインデックス範囲（0インデックス）が含まれます。
    - 文書インデックスは参照ソースを示すために提供され、元のリクエスト内のすべての文書のリストに従って0インデックスです。
  </Step>
</Steps>

<Tip>
  **自動チャンク化 vs カスタムコンテンツ**

  デフォルトでは、プレーンテキストとPDF文書は自動的に文章にチャンク化されます。引用の粒度をより細かく制御する必要がある場合（例：箇条書きや転写記録）は、代わりにカスタムコンテンツ文書を使用してください。詳細については[文書タイプ](#document-types)を参照してください。

  例えば、ClaudeがRAGチャンクから特定の文章を引用できるようにしたい場合は、各RAGチャンクをプレーンテキスト文書に入れる必要があります。そうでなければ、追加のチャンク化を行いたくない場合や、追加のチャンク化をカスタマイズしたい場合は、RAGチャンクをカスタムコンテンツ文書に入れることができます。
</Tip>

### 引用可能コンテンツ vs 引用不可能コンテンツ

- 文書の`source`コンテンツ内にあるテキストは引用可能です。
- `title`と`context`は、モデルに渡されるがコンテンツの引用には使用されないオプションフィールドです。
- `title`は長さに制限があるため、文書メタデータをテキストまたは文字列化されたjsonとして保存するために`context`フィールドが有用な場合があります。

### 引用インデックス
- 文書インデックスは、リクエスト内のすべての文書コンテンツブロックのリスト（すべてのメッセージにまたがる）から0インデックスです。
- 文字インデックスは、排他的終了インデックスを持つ0インデックスです。
- ページ番号は、排他的終了ページ番号を持つ1インデックスです。
- コンテンツブロックインデックスは、カスタムコンテンツ文書で提供された`content`リストからの排他的終了インデックスを持つ0インデックスです。

### トークンコスト
- 引用を有効にすると、システムプロンプトの追加と文書チャンク化により、入力トークンがわずかに増加します。
- ただし、引用機能は出力トークンに対して非常に効率的です。内部的には、モデルは標準化された形式で引用を出力し、それが引用テキストと文書位置インデックスに解析されます。`cited_text`フィールドは便宜上提供されており、出力トークンにはカウントされません。
- 後続の会話ターンで渡し返される場合、`cited_text`も入力トークンにカウントされません。

### 機能互換性
引用は、[プロンプトキャッシュ](/docs/ja/build-with-claude/prompt-caching)、[トークンカウント](/docs/ja/build-with-claude/token-counting)、[バッチ処理](/docs/ja/build-with-claude/batch-processing)を含む他のAPI機能と連携して動作します。

#### 引用でのプロンプトキャッシュの使用

引用とプロンプトキャッシュは効果的に組み合わせて使用できます。

レスポンスで生成される引用ブロックは直接キャッシュできませんが、それらが参照するソース文書はキャッシュできます。パフォーマンスを最適化するには、トップレベルの文書コンテンツブロックに`cache_control`を適用してください。

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# 長い文書コンテンツ（例：技術文書）
long_document = "This is a very long document with thousands of words..." + " ... " * 1000  # キャッシュ可能な最小長

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": long_document
                    },
                    "citations": {"enabled": True},
                    "cache_control": {"type": "ephemeral"}  # 文書コンテンツをキャッシュ
                },
                {
                    "type": "text",
                    "text": "What does this document say about API features?"
                }
            ]
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// 長い文書コンテンツ（例：技術文書）
const longDocument = "This is a very long document with thousands of words..." + " ... ".repeat(1000);  // キャッシュ可能な最小長

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "document",
          source: {
            type: "text",
            media_type: "text/plain",
            data: longDocument
          },
          citations: { enabled: true },
          cache_control: { type: "ephemeral" }  // 文書コンテンツをキャッシュ
        },
        {
          type: "text",
          text: "What does this document say about API features?"
        }
      ]
    }
  ]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": "This is a very long document with thousands of words..."
                    },
                    "citations": {"enabled": true},
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "What does this document say about API features?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

この例では：
- 文書コンテンツは文書ブロックの`cache_control`を使用してキャッシュされます
- 文書で引用が有効になっています
- Claudeはキャッシュされた文書コンテンツの恩恵を受けながら引用付きの回答を生成できます
- 同じ文書を使用する後続のリクエストは、キャッシュされたコンテンツの恩恵を受けます

## 文書タイプ

### 文書タイプの選択

引用用に3つの文書タイプをサポートしています。文書はメッセージ内で直接提供する（base64、テキスト、またはURL）か、[Files API](/docs/ja/build-with-claude/files)経由でアップロードして`file_id`で参照できます：

| タイプ | 最適な用途 | チャンク化 | 引用形式 |
| :--- | :--- | :--- | :--- |
| プレーンテキスト | シンプルなテキスト文書、散文 | 文章 | 文字インデックス（0インデックス） |
| PDF | テキストコンテンツを含むPDFファイル | 文章 | ページ番号（1インデックス） |
| カスタムコンテンツ | リスト、転写記録、特別な書式設定、より細かい引用 | 追加チャンク化なし | ブロックインデックス（0インデックス） |

<Note>
.csv、.xlsx、.docx、.md、.txtファイルは文書ブロックとしてサポートされていません。これらをプレーンテキストに変換し、メッセージコンテンツに直接含めてください。[他のファイル形式での作業](/docs/ja/build-with-claude/files#working-with-other-file-formats)を参照してください。
</Note>

### プレーンテキスト文書

プレーンテキスト文書は自動的に文章にチャンク化されます。インラインまたは`file_id`による参照で提供できます：

<Tabs>
<Tab title="インラインテキスト">
```python
{
    "type": "document",
    "source": {
        "type": "text",
        "media_type": "text/plain",
        "data": "Plain text content..."
    },
    "title": "Document Title", # オプション
    "context": "Context about the document that will not be cited from", # オプション
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="Files API">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Document Title", # オプション
    "context": "Context about the document that will not be cited from", # オプション
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="プレーンテキスト引用の例">

```python
{
    "type": "char_location",
    "cited_text": "The exact text being cited", # 出力トークンにカウントされない
    "document_index": 0,
    "document_title": "Document Title",
    "start_char_index": 0,    # 0インデックス
    "end_char_index": 50      # 排他的
}
```

</section>

### PDF文書

PDF文書はbase64エンコードされたデータまたは`file_id`で提供できます。PDFテキストが抽出され、文章にチャンク化されます。画像引用はまだサポートされていないため、文書のスキャンで抽出可能なテキストを含まないPDFは引用できません。

<Tabs>
<Tab title="Base64">
```python
{
    "type": "document",
    "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": base64_encoded_pdf_data
    },
    "title": "Document Title", # オプション
    "context": "Context about the document that will not be cited from", # オプション
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="Files API">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Document Title", # オプション
    "context": "Context about the document that will not be cited from", # オプション
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="PDF引用の例">

```python
{
    "type": "page_location",
    "cited_text": "The exact text being cited", # 出力トークンにカウントされない
    "document_index": 0,     
    "document_title": "Document Title", 
    "start_page_number": 1,  # 1インデックス
    "end_page_number": 2     # 排他的
}
```

</section>

### カスタムコンテンツ文書

カスタムコンテンツ文書は引用の粒度を制御できます。追加のチャンク化は行われず、提供されたコンテンツブロックに従ってチャンクがモデルに提供されます。

```python
{
    "type": "document",
    "source": {
        "type": "content",
        "content": [
            {"type": "text", "text": "First chunk"},
            {"type": "text", "text": "Second chunk"}
        ]
    },
    "title": "Document Title", # オプション
    "context": "Context about the document that will not be cited from", # オプション
    "citations": {"enabled": True}
}
```

<section title="引用の例">

```python
{
    "type": "content_block_location",
    "cited_text": "The exact text being cited", # 出力トークンにカウントされない
    "document_index": 0,
    "document_title": "Document Title",
    "start_block_index": 0,   # 0インデックス
    "end_block_index": 1      # 排他的
}
```

</section>

---

## レスポンス構造

引用が有効な場合、レスポンスには引用付きの複数のテキストブロックが含まれます：

```python
{
    "content": [
        {
            "type": "text",
            "text": "According to the document, "
        },
        {
            "type": "text",
            "text": "the grass is green",
            "citations": [{
                "type": "char_location",
                "cited_text": "The grass is green.",
                "document_index": 0,
                "document_title": "Example Document",
                "start_char_index": 0,
                "end_char_index": 20
            }]
        },
        {
            "type": "text",
            "text": " and "
        },
        {
            "type": "text",
            "text": "the sky is blue",
            "citations": [{
                "type": "char_location",
                "cited_text": "The sky is blue.",
                "document_index": 0,
                "document_title": "Example Document",
                "start_char_index": 20,
                "end_char_index": 36
            }]
        },
        {
            "type": "text",
            "text": ". Information from page 5 states that ",
        },
        {
            "type": "text",
            "text": "water is essential",
            "citations": [{
                "type": "page_location",
                "cited_text": "Water is essential for life.",
                "document_index": 1,
                "document_title": "PDF Document",
                "start_page_number": 5,
                "end_page_number": 6
            }]
        },
        {
            "type": "text",
            "text": ". The custom document mentions ",
        },
        {
            "type": "text",
            "text": "important findings",
            "citations": [{
                "type": "content_block_location",
                "cited_text": "These are important findings.",
                "document_index": 2,
                "document_title": "Custom Content Document",
                "start_block_index": 0,
                "end_block_index": 1
            }]
        }
    ]
}
```

### ストリーミングサポート

ストリーミングレスポンスでは、現在の`text`コンテンツブロックの`citations`リストに追加される単一の引用を含む`citations_delta`タイプを追加しました。

<section title="ストリーミングイベントの例">

```python
event: message_start
data: {"type": "message_start", ...}

event: content_block_start
data: {"type": "content_block_start", "index": 0, ...}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, 
       "delta": {"type": "text_delta", "text": "According to..."}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0,
       "delta": {"type": "citations_delta", 
                 "citation": {
                     "type": "char_location",
                     "cited_text": "...",
                     "document_index": 0,
                     ...
                 }}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_stop
data: {"type": "message_stop"}
```

</section>