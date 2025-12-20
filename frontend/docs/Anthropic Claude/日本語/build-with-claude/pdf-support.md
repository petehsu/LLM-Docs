# PDFサポート

ClaudeでPDFを処理します。テキストの抽出、チャートの分析、ドキュメントからの視覚的コンテンツの理解を行います。

---

提供されたPDF内のテキスト、画像、チャート、表について、Claudeに質問できるようになりました。使用例の一部：
- 財務レポートの分析とチャート/表の理解
- 法的文書からの重要情報の抽出
- 文書の翻訳支援
- 文書情報の構造化フォーマットへの変換

## 始める前に

### PDF要件の確認
Claudeは標準的なPDFで動作します。ただし、PDFサポートを使用する際は、リクエストサイズが以下の要件を満たしていることを確認してください：

| 要件 | 制限 |
|---|---|
| 最大リクエストサイズ | 32MB |
| リクエストあたりの最大ページ数 | 100 |
| フォーマット | 標準PDF（パスワード/暗号化なし） |

両方の制限は、PDFと一緒に送信される他のコンテンツを含む、リクエストペイロード全体に適用されることにご注意ください。

PDFサポートはClaudeのビジョン機能に依存しているため、他のビジョンタスクと同じ[制限と考慮事項](/docs/ja/build-with-claude/vision#limitations)が適用されます。

### サポートされているプラットフォームとモデル

PDFサポートは現在、直接API アクセスとGoogle Vertex AIを通じてサポートされています。すべての[アクティブモデル](/docs/ja/about-claude/models/overview)がPDF処理をサポートしています。

PDFサポートは以下の考慮事項とともに、Amazon Bedrockで利用可能になりました：

### Amazon Bedrock PDFサポート

Amazon BedrockのConverse APIを通じてPDFサポートを使用する場合、2つの異なるドキュメント処理モードがあります：

<Note>
**重要**: Converse APIでClaudeの完全な視覚的PDF理解機能にアクセスするには、引用を有効にする必要があります。引用を有効にしないと、APIは基本的なテキスト抽出のみにフォールバックします。[引用の使用](/docs/ja/build-with-claude/citations)について詳しく学んでください。
</Note>

#### ドキュメント処理モード

1. **Converse Document Chat**（元のモード - テキスト抽出のみ）
   - PDFからの基本的なテキスト抽出を提供
   - PDF内の画像、チャート、視覚的レイアウトを分析できません
   - 3ページのPDFで約1,000トークンを使用
   - 引用が有効でない場合に自動的に使用されます

2. **Claude PDF Chat**（新しいモード - 完全な視覚的理解）
   - PDFの完全な視覚的分析を提供
   - チャート、グラフ、画像、視覚的レイアウトを理解・分析できます
   - 包括的な理解のために各ページをテキストと画像の両方として処理
   - 3ページのPDFで約7,000トークンを使用
   - **Converse APIで引用を有効にする必要があります**

#### 主な制限

- **Converse API**: 視覚的PDF分析には引用を有効にする必要があります。現在、引用なしで視覚的分析を使用するオプションはありません（InvokeModel APIとは異なります）。
- **InvokeModel API**: 強制的な引用なしでPDF処理を完全に制御できます。

#### よくある問題

Converse APIを使用している際に、顧客がClaudeがPDF内の画像やチャートを見ていないと報告する場合、引用フラグを有効にする必要がある可能性があります。引用フラグがないと、Converseは基本的なテキスト抽出のみにフォールバックします。

<Note>
これはConverse APIの既知の制約であり、対処に取り組んでいます。引用なしで視覚的PDF分析が必要なアプリケーションの場合は、代わりにInvokeModel APIの使用を検討してください。
</Note>

<Note>
.csv、.xlsx、.docx、.md、.txtファイルなどのPDF以外のファイルについては、[他のファイル形式の使用](/docs/ja/build-with-claude/files#working-with-other-file-formats)をご覧ください。
</Note>

***

## ClaudeでPDFを処理する

### 最初のPDFリクエストを送信する
Messages APIを使用したシンプルな例から始めましょう。Claudeに3つの方法でPDFを提供できます：

1. オンラインでホストされているPDFへのURL参照として
2. `document`コンテンツブロック内のbase64エンコードされたPDFとして
3. [Files API](/docs/ja/build-with-claude/files)からの`file_id`によって

#### オプション1: URLベースのPDFドキュメント

最もシンプルなアプローチは、URLから直接PDFを参照することです：

<CodeGroup>
   ```bash Shell
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [{
                "type": "document",
                "source": {
                    "type": "url",
                    "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                }
            },
            {
                "type": "text",
                "text": "What are the key findings in this document?"
            }]
        }]
    }'
    ```
    ```python Python
    import anthropic

    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "url",
                            "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                        }
                    },
                    {
                        "type": "text",
                        "text": "What are the key findings in this document?"
                    }
                ]
            }
        ],
    )

    print(message.content)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const anthropic = new Anthropic();
    
    async function main() {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'url',
                  url: 'https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf',
                },
              },
              {
                type: 'text',
                text: 'What are the key findings in this document?',
              },
            ],
          },
        ],
      });
      
      console.log(response);
    }
    
    main();
    ```
    ```java Java
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.*;

    public class PdfExample {
        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Create document block with URL
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .urlPdfSource("https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf")
                    .build();

            // Create a message with document and text content blocks
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("What are the key findings in this document?")
 .build()
 )
                            )
                    )
                    .build();

            Message message = client.messages().create(params);
            System.out.println(message.content());
        }
    }
    ```
</CodeGroup>

#### オプション2: Base64エンコードされたPDFドキュメント

ローカルシステムからPDFを送信する必要がある場合や、URLが利用できない場合：

<CodeGroup>
    ```bash Shell
    # 方法1: リモートPDFを取得してエンコードする
    curl -s "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf" | base64 | tr -d '\n' > pdf_base64.txt

    # 方法2: ローカルPDFファイルをエンコードする
    # base64 document.pdf | tr -d '\n' > pdf_base64.txt

    # pdf_base64.txtの内容を使用してJSONリクエストファイルを作成する
    jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [{
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": $PDF_BASE64
                }
            },
            {
                "type": "text",
                "text": "What are the key findings in this document?"
            }]
        }]
    }' > request.json

    # JSONファイルを使用してAPIリクエストを送信する
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d @request.json
    ```
    ```python Python
    import anthropic
    import base64
    import httpx

    # まず、PDFを読み込んでエンコードする
    pdf_url = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
    pdf_data = base64.standard_b64encode(httpx.get(pdf_url).content).decode("utf-8")

    # 代替案: ローカルファイルから読み込む
    # with open("document.pdf", "rb") as f:
    #     pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

    # base64エンコーディングを使用してClaudeに送信する
    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_data
                        }
                    },
                    {
                        "type": "text",
                        "text": "What are the key findings in this document?"
                    }
                ]
            }
        ],
    )

    print(message.content)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';
    import fetch from 'node-fetch';
    import fs from 'fs';

    async function main() {
      // 方法1: リモートPDFを取得してエンコードする
      const pdfURL = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
      const pdfResponse = await fetch(pdfURL);
      const arrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(arrayBuffer).toString('base64');
      
      // 方法2: ローカルファイルから読み込む
      // const pdfBase64 = fs.readFileSync('document.pdf').toString('base64');
      
      // base64エンコードされたPDFでAPIリクエストを送信する
      const anthropic = new Anthropic();
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'What are the key findings in this document?',
              },
            ],
          },
        ],
      });
      
      console.log(response);
    }
    
    main();
    ```

    ```java Java
    import java.io.IOException;
    import java.net.URI;
    import java.net.http.HttpClient;
    import java.net.http.HttpRequest;
    import java.net.http.HttpResponse;
    import java.util.Base64;
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.ContentBlockParam;
    import com.anthropic.models.messages.DocumentBlockParam;
    import com.anthropic.models.messages.Message;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.Model;
    import com.anthropic.models.messages.TextBlockParam;

    public class PdfExample {
        public static void main(String[] args) throws IOException, InterruptedException {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // 方法1: リモートPDFをダウンロードしてエンコードする
            String pdfUrl = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
            HttpClient httpClient = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(pdfUrl))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            String pdfBase64 = Base64.getEncoder().encodeToString(response.body());

            // 方法2: ローカルファイルから読み込む
            // byte[] fileBytes = Files.readAllBytes(Path.of("document.pdf"));
            // String pdfBase64 = Base64.getEncoder().encodeToString(fileBytes);

            // base64データでドキュメントブロックを作成する
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .base64PdfSource(pdfBase64)
                    .build();

            // ドキュメントとテキストコンテンツブロックでメッセージを作成する
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(TextBlockParam.builder().text("What are the key findings in this document?").build())
                            )
                    )
                    .build();

            Message message = client.messages().create(params);
            message.content().stream()
                    .flatMap(contentBlock -> contentBlock.text().stream())
                    .forEach(textBlock -> System.out.println(textBlock.text()));
        }
    }
    ```

</CodeGroup>

#### オプション3: Files API

繰り返し使用するPDFや、エンコーディングのオーバーヘッドを避けたい場合は、[Files API](/docs/ja/build-with-claude/files)を使用してください：

<CodeGroup>
```bash Shell
# まず、PDFをFiles APIにアップロードする
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@document.pdf"

# 次に、返されたfile_idをメッセージで使用する
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -d '{
    "model": "claude-sonnet-4-5", 
    "max_tokens": 1024,
    "messages": [{
      "role": "user",
      "content": [{
        "type": "document",
        "source": {
          "type": "file",
          "file_id": "file_abc123"
        }
      },
      {
        "type": "text",
        "text": "What are the key findings in this document?"
      }]
    }]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# PDFファイルをアップロードする
with open("document.pdf", "rb") as f:
    file_upload = client.beta.files.upload(file=("document.pdf", f, "application/pdf"))

# アップロードされたファイルをメッセージで使用する
message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["files-api-2025-04-14"],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": file_upload.id
                    }
                },
                {
                    "type": "text",
                    "text": "What are the key findings in this document?"
                }
            ]
        }
    ],
)

print(message.content)
```

```typescript TypeScript
import { Anthropic, toFile } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function main() {
  // PDFファイルをアップロードする
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('document.pdf'), undefined, { type: 'application/pdf' })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // アップロードされたファイルをメッセージで使用する
  const response = await anthropic.beta.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    betas: ['files-api-2025-04-14'],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'file',
              file_id: fileUpload.id
            }
          },
          {
            type: 'text',
            text: 'What are the key findings in this document?'
          }
        ]
      }
    ]
  });

  console.log(response);
}

main();
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.File;
import com.anthropic.models.files.FileUploadParams;
import com.anthropic.models.messages.*;

public class PdfFilesExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // PDFファイルをアップロードする
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("document.pdf")))
                .build());

        // アップロードされたファイルをメッセージで使用する
        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .fileSource(file.id())
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(
                        List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("What are the key findings in this document?")
 .build()
 )
                        )
                )
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.content());
    }
}
```
</CodeGroup>

### PDFサポートの仕組み
PDFをClaudeに送信すると、以下のステップが実行されます：
<Steps>
  <Step title="システムがドキュメントの内容を抽出します。">
    - システムはドキュメントの各ページを画像に変換します。
    - 各ページからテキストが抽出され、各ページの画像と一緒に提供されます。
  </Step>
  <Step title="Claudeはテキストと画像の両方を分析して、ドキュメントをより良く理解します。">
    - ドキュメントは分析のためにテキストと画像の組み合わせとして提供されます。
    - これにより、ユーザーはチャート、図表、その他の非テキストコンテンツなど、PDFの視覚的要素についての洞察を求めることができます。
  </Step>
  <Step title="Claudeは関連する場合、PDFの内容を参照して応答します。">
    Claudeは応答する際に、テキストと視覚的コンテンツの両方を参照できます。以下と統合することで、パフォーマンスをさらに向上させることができます：
    - **プロンプトキャッシング**: 繰り返し分析のパフォーマンスを向上させるため。
    - **バッチ処理**: 大量のドキュメント処理のため。
    - **ツール使用**: ドキュメントから特定の情報を抽出してツール入力として使用するため。
  </Step>
</Steps>

### コストを見積もる
PDFファイルのトークン数は、ドキュメントから抽出された総テキストとページ数に依存します：
- テキストトークンコスト: 各ページは通常、コンテンツ密度に応じて1ページあたり1,500-3,000トークンを使用します。標準API価格が適用され、追加のPDF料金はありません。
- 画像トークンコスト: 各ページが画像に変換されるため、同じ[画像ベースのコスト計算](/docs/ja/build-with-claude/vision#evaluate-image-size)が適用されます。

[トークンカウント](/docs/ja/build-with-claude/token-counting)を使用して、特定のPDFのコストを見積もることができます。

***

## PDF処理を最適化する

### パフォーマンスを向上させる
最適な結果を得るために、以下のベストプラクティスに従ってください：
- リクエストでテキストの前にPDFを配置する
- 標準フォントを使用する
- テキストが明確で読みやすいことを確認する
- ページを適切な正立方向に回転させる
- プロンプトで論理的なページ番号（PDFビューアーから）を使用する
- 必要に応じて大きなPDFをチャンクに分割する
- 繰り返し分析のためにプロンプトキャッシングを有効にする

### 実装をスケールする
大量処理の場合、以下のアプローチを検討してください：

#### プロンプトキャッシングを使用する
繰り返しクエリのパフォーマンスを向上させるためにPDFをキャッシュする：
<CodeGroup>
```bash Shell
# pdf_base64.txtの内容を使用してJSONリクエストファイルを作成する
jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [{
        "role": "user",
        "content": [{
            "type": "document",
            "source": {
                "type": "base64",
                "media_type": "application/pdf",
                "data": $PDF_BASE64
            },
            "cache_control": {
              "type": "ephemeral"
            }
        },
        {
            "type": "text",
            "text": "Which model has the highest human preference win rates across each use-case?"
        }]
    }]
}' > request.json

# 次にJSONファイルを使用してAPI呼び出しを行う
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @request.json
```
```python Python
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "base64",
                        "media_type": "application/pdf",
                        "data": pdf_data
                    },
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "Analyze this document."
                }
            ]
        }
    ],
)
```

```typescript TypeScript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    {
      content: [
        {
          type: 'document',
          source: {
            media_type: 'application/pdf',
            type: 'base64',
            data: pdfBase64,
          },
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          text: 'Which model has the highest human preference win rates across each use-case?',
        },
      ],
      role: 'user',
    },
  ],
});
console.log(response);
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Base64PdfSource;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.DocumentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class MessagesDocumentExample {

    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // PDFファイルをbase64として読み込む
        byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
        String pdfBase64 = new String(pdfBytes);

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .cacheControl(CacheControlEphemeral.builder().build())
 .build()),
                        ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Which model has the highest human preference win rates across each use-case?")
 .build())
                ))
                .build();


        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

#### ドキュメントバッチを処理する
大量ワークフローにはMessage Batches APIを使用する：
<CodeGroup>
```bash Shell
# pdf_base64.txtの内容を使用してJSONリクエストファイルを作成する
jq -n --rawfile PDF_BASE64 pdf_base64.txt '
{
  "requests": [
      {
          "custom_id": "my-first-request",
          "params": {
              "model": "claude-sonnet-4-5",
              "max_tokens": 1024,
              "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": $PDF_BASE64
                            }
                        },
                        {
                            "type": "text",
                            "text": "Which model has the highest human preference win rates across each use-case?"
                        }
                    ]
                }
              ]
          }
      },
      {
          "custom_id": "my-second-request",
          "params": {
              "model": "claude-sonnet-4-5",
              "max_tokens": 1024,
              "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": $PDF_BASE64
                            }
                        },
                        {
                            "type": "text",
                            "text": "Extract 5 key insights from this document."
                        }
                    ]
                }
              ]
          }
      }
  ]
}
' > request.json

# 次にJSONファイルを使用してAPI呼び出しを行う
curl https://api.anthropic.com/v1/messages/batches \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @request.json
```
```python Python
message_batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "doc1",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
 "type": "document",
 "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": pdf_data
 }
                            },
                            {
 "type": "text",
 "text": "Summarize this document."
                            }
                        ]
                    }
                ]
            }
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.messages.batches.create({
  requests: [
    {
      custom_id: 'my-first-request',
      params: {
        max_tokens: 1024,
        messages: [
          {
            content: [
              {
                type: 'document',
                source: {
                  media_type: 'application/pdf',
                  type: 'base64',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'Which model has the highest human preference win rates across each use-case?',
              },
            ],
            role: 'user',
          },
        ],
        model: 'claude-sonnet-4-5',
      },
    },
    {
      custom_id: 'my-second-request',
      params: {
        max_tokens: 1024,
        messages: [
          {
            content: [
              {
                type: 'document',
                source: {
                  media_type: 'application/pdf',
                  type: 'base64',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'Extract 5 key insights from this document.',
              },
            ],
            role: 'user',
          },
        ],
        model: 'claude-sonnet-4-5',
      },
    }
  ],
});
console.log(response);
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.*;
import com.anthropic.models.messages.batches.*;

public class MessagesBatchDocumentExample {

    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // PDFファイルをbase64として読み込む
        byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
        String pdfBase64 = new String(pdfBytes);

        BatchCreateParams params = BatchCreateParams.builder()
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-first-request")
                        .params(BatchCreateParams.Request.Params.builder()
 .model(Model.CLAUDE_OPUS_4_20250514)
 .maxTokens(1024)
 .addUserMessageOfBlockParams(List.of(
 ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .build()
 ),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Which model has the highest human preference win rates across each use-case?")
 .build()
 )
 ))
 .build())
                        .build())
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-second-request")
                        .params(BatchCreateParams.Request.Params.builder()
 .model(Model.CLAUDE_OPUS_4_20250514)
 .maxTokens(1024)
 .addUserMessageOfBlockParams(List.of(
 ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .build()
 ),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Extract 5 key insights from this document.")
 .build()
 )
 ))
 .build())
                        .build())
                .build();

        MessageBatch batch = client.messages().batches().create(params);
        System.out.println(batch);
    }
}
```
</CodeGroup>

## 次のステップ

<CardGroup cols={2}>
  <Card
    title="PDFの例を試す"
    icon="file"
    href="https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal"
  >
    クックブックレシピでPDF処理の実用的な例を探索してください。
  </Card>

  <Card
    title="APIリファレンスを表示"
    icon="code"
    href="/docs/ja/api/messages"
  >
    PDFサポートの完全なAPIドキュメントをご覧ください。
  </Card>
</CardGroup>