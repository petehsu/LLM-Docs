# ビジョン

Claudeのビジョン機能により、画像を理解および分析できるようになり、マルチモーダルインタラクションの興味深い可能性が開かれます。

---

このガイドでは、Claudeで画像を操作する方法について説明します。ベストプラクティス、コード例、および留意すべき制限事項が含まれています。

---

## ビジョンの使用方法

Claudeのビジョン機能は以下の方法で使用できます：

- [claude.ai](https://claude.ai/)。ファイルのように画像をアップロードするか、チャットウィンドウに画像を直接ドラッグアンドドロップします。
- [Console Workbench](/workbench/)。すべてのユーザーメッセージブロックの右上に画像を追加するボタンが表示されます。
- **APIリクエスト**。このガイドの例を参照してください。

---

## アップロード前に

### 基本と制限

1つのリクエストに複数の画像を含めることができます（[claude.ai](https://claude.ai/)では最大20枚、APIリクエストでは最大100枚）。Claudeは応答を作成する際に提供されたすべての画像を分析します。これは画像を比較または対比するのに役立つ場合があります。

8000x8000 pxより大きい画像を送信すると、拒否されます。1つのAPIリクエストで20枚以上の画像を送信する場合、この制限は2000x2000 pxです。

<Note>
APIは1リクエストあたり100枚の画像をサポートしていますが、標準エンドポイントには[32MBのリクエストサイズ制限](/docs/ja/api/overview#request-size-limits)があります。
</Note>

### 画像サイズの評価

最適なパフォーマンスのために、アップロード前に画像が大きすぎる場合はサイズを変更することをお勧めします。画像の長辺が1568ピクセルを超える場合、または画像が約1,600トークンを超える場合、最初にアスペクト比を保持しながらスケールダウンされ、サイズ制限内に収まるようになります。

入力画像が大きすぎてサイズを変更する必要がある場合、モデルのパフォーマンスが向上することなく、[time-to-first-token](/docs/ja/about-claude/glossary)のレイテンシが増加します。200ピクセル未満の非常に小さい画像は、パフォーマンスを低下させる可能性があります。

<Tip>
  [time-to-first-token](/docs/ja/about-claude/glossary)を改善するために、画像を最大1.15メガピクセル（両方の寸法で1568ピクセル以内）にサイズ変更することをお勧めします。
</Tip>

以下は、一般的なアスペクト比でサイズ変更されないAPIが受け入れる最大画像サイズの表です。Claude Sonnet 4.5では、これらの画像は約1,600トークンを使用し、1,000枚あたり約$4.80です。

| アスペクト比 | 画像サイズ    |
| ------------ | ------------ |
| 1&#58;1      | 1092x1092 px |
| 3&#58;4      | 951x1268 px  |
| 2&#58;3      | 896x1344 px  |
| 9&#58;16     | 819x1456 px  |
| 1&#58;2      | 784x1568 px  |

### 画像コストの計算

Claudeへのリクエストに含める各画像は、トークン使用量にカウントされます。概算コストを計算するには、概算画像トークン数に、使用している[モデルのトークンあたりの価格](https://claude.com/pricing)を掛けます。

画像をサイズ変更する必要がない場合、このアルゴリズムを使用してトークン数を推定できます：`tokens = (width px * height px)/750`

以下は、Claude Sonnet 4.5のトークンあたり$3（100万入力トークンあたり）の価格に基づいて、APIのサイズ制限内のさまざまな画像サイズの概算トークン化とコストの例です：

| 画像サイズ                    | トークン数 | 画像あたりのコスト | 1,000枚あたりのコスト |
| ----------------------------- | ------------ | ------------ | ---------------- |
| 200x200 px(0.04メガピクセル)   | \~54         | \~$0.00016   | \~$0.16          |
| 1000x1000 px(1メガピクセル)     | \~1334       | \~$0.004     | \~$4.00          |
| 1092x1092 px(1.19メガピクセル) | \~1590       | \~$0.0048    | \~$4.80          |

### 画像品質の確保

Claudeに画像を提供する場合、最良の結果を得るために以下の点に注意してください：

- **画像形式**：サポートされている画像形式を使用してください：JPEG、PNG、GIF、またはWebP。
- **画像の明確さ**：画像が明確で、ぼやけたりピクセル化されたりしていないことを確認してください。
- **テキスト**：画像に重要なテキストが含まれている場合は、読みやすく、小さすぎないことを確認してください。テキストを拡大するためだけに重要な視覚的コンテキストをトリミングしないでください。

---

## プロンプトの例

Claudeとのテキストベースのインタラクションでうまく機能する[プロンプティング技術](/docs/ja/build-with-claude/prompt-engineering/overview)の多くは、画像ベースのプロンプトにも適用できます。

これらの例は、画像を含むベストプラクティスプロンプト構造を示しています。

<Tip>
  ドキュメント-クエリの配置と同様に、Claudeは画像がテキストの前に来るときに最も良く機能します。テキストの後に配置された画像またはテキストと補間された画像は依然として良好に機能しますが、ユースケースが許可する場合は、画像-テキスト構造をお勧めします。
</Tip>

### プロンプト例について

以下の例は、さまざまなプログラミング言語とアプローチを使用してClaudeのビジョン機能を使用する方法を示しています。Claudeに画像を提供する方法は3つあります：

1. `image`コンテンツブロック内のbase64エンコードされた画像として
2. オンラインでホストされている画像へのURL参照として
3. Files APIを使用（1回アップロード、複数回使用）

base64の例プロンプトは、これらの変数を使用します：

<CodeGroup>
```bash Shell
    # URLベースの画像の場合、JSONリクエストでURLを直接使用できます
    
    # base64エンコードされた画像の場合、最初に画像をエンコードする必要があります
    # bashで画像をbase64にエンコードする方法の例：
    BASE64_IMAGE_DATA=$(curl -s "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg" | base64)
    
    # エンコードされたデータはAPIコールで使用できるようになります
```

```python Python
import base64
import httpx

# base64エンコードされた画像の場合
image1_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
image1_media_type = "image/jpeg"
image1_data = base64.standard_b64encode(httpx.get(image1_url).content).decode("utf-8")

image2_url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg"
image2_media_type = "image/jpeg"
image2_data = base64.standard_b64encode(httpx.get(image2_url).content).decode("utf-8")

# URLベースの画像の場合、リクエストでURLを直接使用できます
```

```typescript TypeScript
import axios from 'axios';

// base64エンコードされた画像の場合
async function getBase64Image(url: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

// 使用方法
async function prepareImages() {
  const imageData = await getBase64Image('https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg');
  // これでAPIコールでimageDataを使用できます
}

// URLベースの画像の場合、リクエストでURLを直接使用できます
```

```java Java
import java.io.IOException;
import java.util.Base64;
import java.io.InputStream;
import java.net.URL;

public class ImageHandlingExample {

    public static void main(String[] args) throws IOException, InterruptedException {
        // base64エンコードされた画像の場合
        String image1Url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg";
        String image1MediaType = "image/jpeg";
        String image1Data = downloadAndEncodeImage(image1Url);

        String image2Url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg";
        String image2MediaType = "image/jpeg";
        String image2Data = downloadAndEncodeImage(image2Url);

        // URLベースの画像の場合、リクエストでURLを直接使用できます
    }

    private static String downloadAndEncodeImage(String imageUrl) throws IOException {
        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            return Base64.getEncoder().encodeToString(inputStream.readAllBytes());
        }
    }

}
```
</CodeGroup>

以下は、base64エンコードされた画像とURL参照を使用してMessages APIリクエストに画像を含める方法の例です：

### Base64エンコードされた画像の例

<CodeGroup>
    ```bash Shell
    curl https://api.anthropic.com/v1/messages \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -H "content-type: application/json" \
      -d '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "image",
                "source": {
                  "type": "base64",
                  "media_type": "image/jpeg",
                  "data": "'"$BASE64_IMAGE_DATA"'"
                }
              },
              {
                "type": "text",
                "text": "Describe this image."
              }
            ]
          }
        ]
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
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image1_media_type,
                            "data": image1_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Describe this image."
                    }
                ],
            }
        ],
    )
    print(message)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    async function main() {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: imageData, // Base64-encoded image data as string
                }
              },
              {
                type: "text",
                text: "Describe this image."
              }
            ]
          }
        ]
      });
      
      console.log(message);
    }

    main();
    ```

    ```java Java
    import java.io.IOException;
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.*;

    public class VisionExample {
        public static void main(String[] args) throws IOException, InterruptedException {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();
            String imageData = ""; // // Base64-encoded image data as string

            List<ContentBlockParam> contentBlockParams = List.of(
                    ContentBlockParam.ofImage(
                            ImageBlockParam.builder()
                                    .source(Base64ImageSource.builder()
                                            .data(imageData)
                                            .build())
                                    .build()
                    ),
                    ContentBlockParam.ofText(TextBlockParam.builder()
                            .text("Describe this image.")
                            .build())
            );
            Message message = client.messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_SONNET_4_5_LATEST)
                            .maxTokens(1024)
                            .addUserMessageOfBlockParams(contentBlockParams)
                            .build()
            );

            System.out.println(message);
        }
    }
    ```
</CodeGroup>

### URLベースの画像の例

<CodeGroup>
    ```bash Shell
    curl https://api.anthropic.com/v1/messages \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -H "content-type: application/json" \
      -d '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "image",
                "source": {
                  "type": "url",
                  "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
                }
              },
              {
                "type": "text",
                "text": "Describe this image."
              }
            ]
          }
        ]
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
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "Describe this image."
                    }
                ],
            }
        ],
    )
    print(message)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    async function main() {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "url",
                  url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
                }
              },
              {
                type: "text",
                text: "Describe this image."
              }
            ]
          }
        ]
      });
      
      console.log(message);
    }

    main();
    ```
    ```java Java
    import java.io.IOException;
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.*;

    public class VisionExample {

        public static void main(String[] args) throws IOException, InterruptedException {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            List<ContentBlockParam> contentBlockParams = List.of(
                    ContentBlockParam.ofImage(
                            ImageBlockParam.builder()
                                    .source(UrlImageSource.builder()
                                            .url("https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg")
                                            .build())
                                    .build()
                    ),
                    ContentBlockParam.ofText(TextBlockParam.builder()
                            .text("Describe this image.")
                            .build())
            );
            Message message = client.messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_SONNET_4_5_LATEST)
                            .maxTokens(1024)
                            .addUserMessageOfBlockParams(contentBlockParams)
                            .build()
            );
            System.out.println(message);
        }
    }
    ```
</CodeGroup>

### Files API画像の例

繰り返し使用する画像や、エンコーディングのオーバーヘッドを回避したい場合は、[Files API](/docs/ja/build-with-claude/files)を使用してください：

<CodeGroup>
```bash Shell
# まず、画像をFiles APIにアップロードします
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@image.jpg"

# 次に、返されたfile_idをメッセージで使用します
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "image",
            "source": {
              "type": "file",
              "file_id": "file_abc123"
            }
          },
          {
            "type": "text",
            "text": "Describe this image."
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# 画像ファイルをアップロードします
with open("image.jpg", "rb") as f:
    file_upload = client.beta.files.upload(file=("image.jpg", f, "image/jpeg"))

# アップロードされたファイルをメッセージで使用します
message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["files-api-2025-04-14"],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "file",
                        "file_id": file_upload.id
                    }
                },
                {
                    "type": "text",
                    "text": "Describe this image."
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
  // 画像ファイルをアップロードします
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('image.jpg'), undefined, { type: "image/jpeg" })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // アップロードされたファイルをメッセージで使用します
  const response = await anthropic.beta.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    betas: ['files-api-2025-04-14'],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'file',
              file_id: fileUpload.id
            }
          },
          {
            type: 'text',
            text: 'Describe this image.'
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

public class ImageFilesExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // 画像ファイルをアップロードします
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("image.jpg")))
                .build());

        // アップロードされたファイルをメッセージで使用します
        ImageBlockParam imageParam = ImageBlockParam.builder()
                .fileSource(file.id())
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_5_LATEST)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(
                        List.of(
                                ContentBlockParam.ofImage(imageParam),
                                ContentBlockParam.ofText(
                                        TextBlockParam.builder()
                                                .text("Describe this image.")
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

詳細なコード例とパラメータについては、[Messages APIの例](/docs/ja/api/messages)を参照してください。

<section title="例：1つの画像">

画像を、それらについての質問やそれらを使用するタスクの指示の前にプロンプトに配置することが最適です。

Claudeに1つの画像を説明するよう依頼します。

| ロール | コンテンツ                        |
| ---- | ------------------------------ |
| ユーザー | \[画像\] この画像を説明してください。 |

<Tabs>
  <Tab title="Base64を使用">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image1_media_type,
                            "data": image1_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Describe this image."
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
  <Tab title="URLを使用">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "Describe this image."
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
</Tabs>

</section>
<section title="例：複数の画像">

複数の画像がある場合は、各画像を`Image 1:`と`Image 2:`などで紹介します。画像間またはプロンプトと画像の間に改行は必要ありません。

複数の画像の違いをClaudeに説明するよう依頼します。
| ロール | コンテンツ |
| ---- | ------------------------------------------------------------------------- |
| ユーザー | 画像1：\[画像1\] 画像2：\[画像2\] これらの画像はどのように異なりますか？ |

<Tabs>
  <Tab title="Base64を使用">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Image 1:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image1_media_type,
                            "data": image1_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Image 2:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image2_media_type,
                            "data": image2_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "How are these images different?"
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
  <Tab title="URLを使用">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Image 1:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "Image 2:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "How are these images different?"
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
</Tabs>

</section>
<section title="例：システムプロンプト付きの複数の画像">

複数の画像の違いをClaudeに説明するよう依頼しながら、応答方法についてのシステムプロンプトを提供します。

| コンテンツ |                                                                           |
| ------- | ------------------------------------------------------------------------- |
| システム  | スペイン語でのみ応答してください。                                                  |
| ユーザー    | 画像1：\[画像1\] 画像2：\[画像2\] これらの画像はどのように異なりますか？ |

<Tabs>
  <Tab title="Base64を使用">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        system="Respond only in Spanish.",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Image 1:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image1_media_type,
                            "data": image1_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Image 2:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image2_media_type,
                            "data": image2_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "How are these images different?"
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
  <Tab title="URLを使用">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        system="Respond only in Spanish.",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Image 1:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "Image 2:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "How are these images different?"
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
</Tabs>

</section>
<section title="例：2つの会話ターンにわたる4つの画像">

Claudeのビジョン機能は、画像とテキストを混在させるマルチモーダル会話で輝きます。Claudeとの拡張的なやり取りを行い、任意の時点で新しい画像またはフォローアップの質問を追加できます。これにより、反復的な画像分析、比較、またはビジュアルと他の知識の組み合わせのための強力なワークフローが可能になります。

2つの画像を対比するようClaudeに依頼し、最初の画像と2つの新しい画像を比較するフォローアップの質問をします。
| ロール | コンテンツ |
| --------- | ------------------------------------------------------------------------------------ |
| ユーザー | 画像1：\[画像1\] 画像2：\[画像2\] これらの画像はどのように異なりますか？ |
| アシスタント | \[Claudeの応答\] |
| ユーザー | 画像1：\[画像3\] 画像2：\[画像4\] これらの画像は最初の2つと似ていますか？ |
| アシスタント | \[Claudeの応答\] |

APIを使用する場合、新しい画像を標準的な[マルチターン会話](/docs/ja/api/messages)構造の一部として`user`ロールのメッセージ配列に挿入するだけです。

</section>

---

## 制限事項

Claudeの画像理解機能は最先端ですが、認識すべき制限事項があります：

- **人物の識別**：Claude[は使用できません](https://www.anthropic.com/legal/aup)画像内の人物を識別（つまり、名前を付ける）するために、そうすることを拒否します。
- **精度**：Claudeは、低品質、回転、または200ピクセル未満の非常に小さい画像を解釈する際に、幻覚を見たり、間違いを犯したりする可能性があります。
- **空間推論**：Claudeの空間推論能力は限定的です。アナログ時計の文字盤を読むやチェスの駒の正確な位置を説明するなど、正確なローカライゼーションまたはレイアウトが必要なタスクで苦労する可能性があります。
- **カウント**：Claudeは画像内のオブジェクトの概算数を提供できますが、特に多数の小さなオブジェクトの場合、常に正確であるとは限りません。
- **AI生成画像**：Claudeは画像がAI生成されているかどうかを知らず、尋ねられた場合は間違っている可能性があります。偽造または合成画像を検出するために信頼しないでください。
- **不適切なコンテンツ**：Claudeは、当社の[利用可能ポリシー](https://www.anthropic.com/legal/aup)に違反する不適切または露骨な画像を処理しません。
- **医療アプリケーション**：Claudeは一般的な医療画像を分析できますが、CTやMRIなどの複雑な診断スキャンを解釈するように設計されていません。Claudeの出力は、専門的な医学的助言または診断の代替と見なされるべきではありません。

特に高リスクのユースケースでは、Claudeの画像解釈を常に慎重に確認および検証してください。完全な精度が必要なタスクや、人間の監視なしに機密の画像分析を使用しないでください。

---

## FAQ

  <section title="Claudeはどのような画像ファイル形式をサポートしていますか？">

    Claudeは現在、JPEG、PNG、GIF、WebP画像形式をサポートしています。具体的には以下の通りです：
    - `image/jpeg`
    - `image/png`
    - `image/gif`
    - `image/webp`
  
</section>

{" "}

<section title="ClaudeはURLから画像を読み込むことができますか？">

  はい、ClaudeはこれでAPIのURLイメージソースブロックを使用してURLから画像を処理できるようになりました。
  APIリクエストで「base64」の代わりに「url」ソースタイプを使用するだけです。
  例：
  ```json
  {
    "type": "image",
    "source": {
      "type": "url",
      "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
    }
  }
  ```

</section>

  <section title="アップロードできる画像ファイルサイズに制限はありますか？">

    はい、制限があります：
    - API：画像あたり最大5MB
    - claude.ai：画像あたり最大10MB

    これらの制限を超える画像はAPIを使用する場合、拒否されエラーが返されます。

  
</section>

  <section title="1つのリクエストに何枚の画像を含めることができますか？">

    画像の制限は以下の通りです：
    - Messages API：リクエストあたり最大100枚の画像
    - claude.ai：ターンあたり最大20枚の画像

    これらの制限を超えるリクエストは拒否されエラーが返されます。

  
</section>

{" "}

<section title="Claudeは画像メタデータを読み込みますか？">

  いいえ、Claudeは渡された画像からメタデータを解析または受け取ることはありません。

</section>

{" "}

<section title="アップロードした画像を削除できますか？">

  いいえ。画像アップロードは一時的なものであり、APIリクエストの期間を超えて保存されません。アップロードされた画像は処理後に自動的に削除されます。

</section>

{" "}

<section title="画像アップロードのデータプライバシーに関する詳細はどこで確認できますか？">

  アップロードされた画像およびその他のデータの取り扱い方法については、プライバシーポリシーページをご参照ください。アップロードされた画像をモデルのトレーニングに使用することはありません。

</section>

  <section title="Claudeの画像解釈が間違っているように見える場合はどうすればよいですか？">

    Claudeの画像解釈が正確でないように見える場合：
    1. 画像が明確で高品質で、正しい向きであることを確認してください。
    2. プロンプトエンジニアリング技術を試して結果を改善してください。
    3. 問題が解決しない場合は、claude.aiで出力にフラグを立てる（親指上/下）か、サポートチームに連絡してください。

    ご意見は改善に役立ちます！

  
</section>

  <section title="Claudeは画像を生成または編集できますか？">

    いいえ、Claudeは画像理解モデルのみです。画像を解釈および分析することはできますが、画像を生成、作成、編集、操作、または作成することはできません。
  
</section>

---

## ビジョン機能をさらに深く掘り下げる

Claudeを使用して画像で構築を開始する準備はできていますか？以下は役立つリソースです：

- [マルチモーダルクックブック](https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal)：このクックブックには、[画像の開始方法](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/getting%5Fstarted%5Fwith%5Fvision.ipynb)と[ベストプラクティス技術](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/best%5Fpractices%5Ffor%5Fvision.ipynb)に関するヒントがあり、画像を使用した最高品質のパフォーマンスを確保します。[チャートの解釈と分析](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/reading%5Fcharts%5Fgraphs%5Fpowerpoints.ipynb)や[フォームからのコンテンツ抽出](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/how%5Fto%5Ftranscribe%5Ftext.ipynb)などのタスクを実行するために、Claudeに画像を効果的にプロンプトする方法を確認してください。
- [APIリファレンス](/docs/ja/api/messages)：Messages APIのドキュメントにアクセスして、[画像を含むAPIコール](/docs/ja/build-with-claude/working-with-messages#vision)の例を確認してください。

ご質問がある場合は、[サポートチーム](https://support.claude.com/)にお気軽にお問い合わせください。また、[開発者コミュニティ](https://www.anthropic.com/discord)に参加して、他のクリエイターと交流し、Anthropicの専門家からサポートを受けることもできます。