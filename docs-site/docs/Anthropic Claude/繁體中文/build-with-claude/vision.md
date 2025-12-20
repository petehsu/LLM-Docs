# 視覺

Claude 的視覺功能允許它理解和分析圖像，為多模態互動開啟了令人興奮的可能性。

---

本指南介紹如何在 Claude 中使用圖像，包括最佳實踐、代碼示例和需要注意的限制。

---

## 如何使用視覺

通過以下方式使用 Claude 的視覺功能：

- [claude.ai](https://claude.ai/)。上傳圖像就像上傳文件一樣，或直接將圖像拖放到聊天窗口中。
- [Console Workbench](/workbench/)。在每個用戶消息塊的右上角會出現一個添加圖像的按鈕。
- **API 請求**。請參閱本指南中的示例。

---

## 上傳前

### 基礎知識和限制

您可以在單個請求中包含多個圖像（[claude.ai](https://claude.ai/) 最多 20 個，API 請求最多 100 個）。Claude 將在制定響應時分析所有提供的圖像。這對於比較或對比圖像很有幫助。

如果您提交的圖像大於 8000x8000 像素，將被拒絕。如果您在一個 API 請求中提交超過 20 個圖像，此限制為 2000x2000 像素。

<Note>
雖然 API 支持每個請求 100 個圖像，但標準端點有 [32MB 請求大小限制](/docs/zh-TW/api/overview#request-size-limits)。
</Note>

### 評估圖像大小

為了獲得最佳性能，如果圖像太大，我們建議在上傳前調整圖像大小。如果您的圖像長邊超過 1568 像素，或您的圖像超過約 1,600 個令牌，它將首先被縮小，保持寬高比，直到它在大小限制內。

如果您的輸入圖像太大需要調整大小，它將增加 [首令牌時間](/docs/zh-TW/about-claude/glossary) 的延遲，而不會為您提供任何額外的模型性能。任何邊小於 200 像素的非常小的圖像可能會降低性能。

<Tip>
  為了改進 [首令牌時間](/docs/zh-TW/about-claude/glossary)，我們建議
  將圖像調整為不超過 1.15 百萬像素（且在兩個維度上都在 1568 像素內）。
</Tip>

以下是我們的 API 接受的常見寬高比的最大圖像大小表，這些圖像不會被調整大小。使用 Claude Sonnet 4.5，這些圖像使用約 1,600 個令牌，每 1K 個圖像約 $4.80。

| 寬高比 | 圖像大小   |
| ------------ | ------------ |
| 1&#58;1      | 1092x1092 px |
| 3&#58;4      | 951x1268 px  |
| 2&#58;3      | 896x1344 px  |
| 9&#58;16     | 819x1456 px  |
| 1&#58;2      | 784x1568 px  |

### 計算圖像成本

您在請求 Claude 中包含的每個圖像都計入您的令牌使用量。要計算近似成本，請將近似圖像令牌數乘以您使用的 [模型的每令牌價格](https://claude.com/pricing)。

如果您的圖像不需要調整大小，您可以通過此算法估計使用的令牌數：`tokens = (width px * height px)/750`

以下是基於 Claude Sonnet 4.5 每令牌價格 $3 每百萬輸入令牌的 API 大小限制內不同圖像大小的近似令牌化和成本示例：

| 圖像大小                    | 令牌數 | 每個圖像成本 | 每 1K 個圖像成本 |
| ----------------------------- | ------------ | ------------ | ---------------- |
| 200x200 px(0.04 百萬像素)   | \~54         | \~$0.00016   | \~$0.16          |
| 1000x1000 px(1 百萬像素)     | \~1334       | \~$0.004     | \~$4.00          |
| 1092x1092 px(1.19 百萬像素) | \~1590       | \~$0.0048    | \~$4.80          |

### 確保圖像質量

向 Claude 提供圖像時，請記住以下幾點以獲得最佳結果：

- **圖像格式**：使用支持的圖像格式：JPEG、PNG、GIF 或 WebP。
- **圖像清晰度**：確保圖像清晰，不要太模糊或像素化。
- **文本**：如果圖像包含重要文本，請確保其清晰易讀且不要太小。避免為了放大文本而裁剪掉關鍵視覺背景。

---

## 提示示例

許多 [適用於與 Claude 進行基於文本互動的提示技術](/docs/zh-TW/build-with-claude/prompt-engineering/overview) 也可以應用於基於圖像的提示。

這些示例演示了涉及圖像的最佳實踐提示結構。

<Tip>
  就像文檔查詢放置一樣，Claude 在圖像位於文本之前時效果最好。
  放在文本之後或與文本交錯的圖像仍然會表現良好，但如果您的用例允許，
  我們建議採用圖像優先的結構。
</Tip>

### 關於提示示例

以下示例演示了如何使用各種編程語言和方法使用 Claude 的視覺功能。您可以通過三種方式向 Claude 提供圖像：

1. 作為 `image` 內容塊中的 base64 編碼圖像
2. 作為對在線託管圖像的 URL 引用
3. 使用文件 API（上傳一次，多次使用）

base64 示例提示使用這些變量：

<CodeGroup>
```bash Shell
    # 對於基於 URL 的圖像，您可以直接在 JSON 請求中使用 URL
    
    # 對於 base64 編碼的圖像，您需要先對圖像進行編碼
    # 在 bash 中將圖像編碼為 base64 的示例：
    BASE64_IMAGE_DATA=$(curl -s "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg" | base64)
    
    # 編碼的數據現在可以在您的 API 調用中使用
```

```python Python
import base64
import httpx

# 對於 base64 編碼的圖像
image1_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
image1_media_type = "image/jpeg"
image1_data = base64.standard_b64encode(httpx.get(image1_url).content).decode("utf-8")

image2_url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg"
image2_media_type = "image/jpeg"
image2_data = base64.standard_b64encode(httpx.get(image2_url).content).decode("utf-8")

# 對於基於 URL 的圖像，您可以直接在請求中使用 URL
```

```typescript TypeScript
import axios from 'axios';

// 對於 base64 編碼的圖像
async function getBase64Image(url: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

// 用法
async function prepareImages() {
  const imageData = await getBase64Image('https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg');
  // 現在您可以在 API 調用中使用 imageData
}

// 對於基於 URL 的圖像，您可以直接在請求中使用 URL
```

```java Java
import java.io.IOException;
import java.util.Base64;
import java.io.InputStream;
import java.net.URL;

public class ImageHandlingExample {

    public static void main(String[] args) throws IOException, InterruptedException {
        // 對於 base64 編碼的圖像
        String image1Url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg";
        String image1MediaType = "image/jpeg";
        String image1Data = downloadAndEncodeImage(image1Url);

        String image2Url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg";
        String image2MediaType = "image/jpeg";
        String image2Data = downloadAndEncodeImage(image2Url);

        // 對於基於 URL 的圖像，您可以直接在請求中使用 URL
    }

    private static String downloadAndEncodeImage(String imageUrl) throws IOException {
        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            return Base64.getEncoder().encodeToString(inputStream.readAllBytes());
        }
    }

}
```
</CodeGroup>

以下是如何使用 base64 編碼圖像和 URL 引用在 Messages API 請求中包含圖像的示例：

### Base64 編碼圖像示例

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

### 基於 URL 的圖像示例

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

### 文件 API 圖像示例

對於您將重複使用的圖像或當您想避免編碼開銷時，請使用 [文件 API](/docs/zh-TW/build-with-claude/files)：

<CodeGroup>
```bash Shell
# 首先，將您的圖像上傳到文件 API
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@image.jpg"

# 然後在您的消息中使用返回的 file_id
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

# 上傳圖像文件
with open("image.jpg", "rb") as f:
    file_upload = client.beta.files.upload(file=("image.jpg", f, "image/jpeg"))

# 在消息中使用上傳的文件
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
  // 上傳圖像文件
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('image.jpg'), undefined, { type: "image/jpeg" })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // 在消息中使用上傳的文件
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

        // 上傳圖像文件
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("image.jpg")))
                .build());

        // 在消息中使用上傳的文件
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

有關更多示例代碼和參數詳細信息，請參閱 [Messages API 示例](/docs/zh-TW/api/messages)。

<section title="示例：一個圖像">

最好在提示中較早放置圖像，而不是關於它們的問題或使用它們的任務的說明。

要求 Claude 描述一個圖像。

| 角色 | 內容                        |
| ---- | ------------------------------ |
| 用戶 | \[Image\] Describe this image. |

<Tabs>
  <Tab title="使用 Base64">
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
  <Tab title="使用 URL">
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
<section title="示例：多個圖像">

在有多個圖像的情況下，用 `Image 1:` 和 `Image 2:` 等介紹每個圖像。圖像之間或圖像與提示之間不需要換行。

要求 Claude 描述多個圖像之間的差異。
| 角色 | 內容 |
| ---- | ------------------------------------------------------------------------- |
| 用戶 | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |

<Tabs>
  <Tab title="使用 Base64">
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
  <Tab title="使用 URL">
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
<section title="示例：多個圖像和系統提示">

要求 Claude 描述多個圖像之間的差異，同時給它一個系統提示以了解如何響應。

| 內容 |                                                                           |
| ------- | ------------------------------------------------------------------------- |
| 系統 | Respond only in Spanish.                                                  |
| 用戶    | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |

<Tabs>
  <Tab title="使用 Base64">
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
  <Tab title="使用 URL">
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
<section title="示例：跨兩個對話輪次的四個圖像">

Claude 的視覺功能在混合圖像和文本的多模態對話中閃閃發光。您可以與 Claude 進行延長的來回交流，在任何時刻添加新圖像或後續問題。這為迭代圖像分析、比較或將視覺與其他知識結合的強大工作流程提供了支持。

要求 Claude 對比兩個圖像，然後提出一個後續問題，將第一個圖像與兩個新圖像進行比較。
| 角色 | 內容 |
| --------- | ------------------------------------------------------------------------------------ |
| 用戶 | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |
| 助手 | \[Claude's response\] |
| 用戶 | Image 1: \[Image 3\] Image 2: \[Image 4\] Are these images similar to the first two? |
| 助手 | \[Claude's response\] |

使用 API 時，只需將新圖像插入到 `user` 角色中消息數組中，作為任何標準 [多輪對話](/docs/zh-TW/api/messages) 結構的一部分。

</section>

---

## 限制

雖然 Claude 的圖像理解功能是最先進的，但需要注意一些限制：

- **人物識別**：Claude [不能用於](/docs/zh-TW/legal/aup) 識別（即命名）圖像中的人物，並將拒絕這樣做。
- **準確性**：Claude 在解釋低質量、旋轉或非常小的圖像（小於 200 像素）時可能會產生幻覺或犯錯誤。
- **空間推理**：Claude 的空間推理能力有限。它可能在需要精確定位或佈局的任務中遇到困難，例如讀取模擬時鐘面或描述國際象棋棋子的確切位置。
- **計數**：Claude 可以給出圖像中對象的近似計數，但可能並不總是精確準確，尤其是對於大量小對象。
- **AI 生成的圖像**：Claude 不知道圖像是否是 AI 生成的，如果被問到可能會不正確。不要依賴它來檢測虛假或合成圖像。
- **不當內容**：Claude 不會處理違反我們 [可接受使用政策](https://www.anthropic.com/legal/aup) 的不當或明確圖像。
- **醫療保健應用**：雖然 Claude 可以分析一般醫療圖像，但它不是為解釋複雜的診斷掃描（如 CT 或 MRI）而設計的。Claude 的輸出不應被視為專業醫療建議或診斷的替代品。

始終仔細審查和驗證 Claude 的圖像解釋，特別是對於高風險用例。不要在沒有人工監督的情況下使用 Claude 進行需要完美精度或敏感圖像分析的任務。

---

## 常見問題

  <section title="Claude 支援哪些影像檔案類型？">

    Claude 目前支援 JPEG、PNG、GIF 和 WebP 影像格式，具體如下：
    - `image/jpeg`
    - `image/png`
    - `image/gif`
    - `image/webp`
  
</section>

{" "}

<section title="Claude 可以讀取影像 URL 嗎？">

  可以，Claude 現在可以透過 API 中的 URL 影像來源區塊處理來自 URL 的影像。
  只需在 API 請求中使用 "url" 來源類型而不是 "base64"。 
  範例：
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

  <section title="我可以上傳的影像檔案大小有限制嗎？">

    是的，有限制：
    - API：每張影像最大 5MB
    - claude.ai：每張影像最大 10MB

    超過這些限制的影像將被拒絕，使用我們的 API 時會返回錯誤。

  
</section>

  <section title="我可以在一個請求中包含多少張影像？">

    影像限制如下：
    - Messages API：每個請求最多 100 張影像
    - claude.ai：每輪最多 20 張影像

    超過這些限制的請求將被拒絕並返回錯誤。

  
</section>

{" "}

<section title="Claude 會讀取影像中繼資料嗎？">

  不會，Claude 不會解析或接收從傳遞給它的影像中獲取的任何中繼資料。

</section>

{" "}

<section title="我可以刪除我上傳的影像嗎？">

  不可以。影像上傳是暫時的，不會在 API 請求期間之外儲存。上傳的影像在被處理後會自動刪除。

</section>

{" "}

<section title="我在哪裡可以找到有關影像上傳資料隱私的詳細資訊？">

  請參閱我們的隱私政策頁面，了解我們如何處理上傳的影像和其他資料。我們不使用上傳的影像來訓練我們的模型。

</section>

  <section title="如果 Claude 的影像解釋似乎有誤怎麼辦？">

    如果 Claude 的影像解釋似乎不正確：
    1. 確保影像清晰、高品質且方向正確。
    2. 嘗試提示工程技術來改進結果。
    3. 如果問題仍然存在，請在 claude.ai 中標記輸出（豎起大拇指/向下），或聯絡我們的支援團隊。

    您的回饋幫助我們改進！

  
</section>

  <section title="Claude 可以生成或編輯影像嗎？">

    不可以，Claude 是一個影像理解模型。它可以解釋和分析影像，但無法生成、製作、編輯、操作或建立影像。
  
</section>

---

## 深入探索視覺功能

準備好開始使用 Claude 的影像功能進行開發了嗎？以下是一些有用的資源：

- [多模態食譜](https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal)：此食譜包含有關[開始使用影像](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/getting%5Fstarted%5Fwith%5Fvision.ipynb)和[最佳實踐技術](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/best%5Fpractices%5Ffor%5Fvision.ipynb)的提示，以確保影像的最高品質效能。了解如何有效地使用影像提示 Claude 來執行任務，例如[解釋和分析圖表](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/reading%5Fcharts%5Fgraphs%5Fpowerpoints.ipynb)或[從表單中提取內容](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/how%5Fto%5Ftranscribe%5Ftext.ipynb)。
- [API 參考](/docs/zh-TW/api/messages)：造訪我們的 Messages API 文件，包括涉及影像的範例 [API 呼叫](/docs/zh-TW/build-with-claude/working-with-messages#vision)。

如果您有任何其他問題，請隨時聯絡我們的[支援團隊](https://support.claude.com/)。您也可以加入我們的[開發者社群](https://www.anthropic.com/discord)，與其他創作者聯繫並獲得 Anthropic 專家的幫助。