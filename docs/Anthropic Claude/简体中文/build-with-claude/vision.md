# 视觉

Claude的视觉功能允许它理解和分析图像，为多模态交互开启了令人兴奋的可能性。

---

本指南介绍如何在Claude中处理图像，包括最佳实践、代码示例和需要注意的限制。

---

## 如何使用视觉功能

通过以下方式使用Claude的视觉功能：

- [claude.ai](https://claude.ai/)。上传图像就像上传文件一样，或直接将图像拖放到聊天窗口中。
- [Console Workbench](/workbench/)。在每个用户消息块的右上角会出现一个添加图像的按钮。
- **API请求**。请参阅本指南中的示例。

---

## 上传前

### 基础知识和限制

您可以在单个请求中包含多个图像（[claude.ai](https://claude.ai/)最多20个，API请求最多100个）。Claude在制定响应时会分析所有提供的图像。这对于比较或对比图像很有帮助。

如果您提交的图像大于8000x8000像素，它将被拒绝。如果您在一个API请求中提交超过20个图像，此限制为2000x2000像素。

<Note>
虽然API支持每个请求100个图像，但标准端点有[32MB请求大小限制](/docs/zh-CN/api/overview#request-size-limits)。
</Note>

### 评估图像大小

为了获得最佳性能，如果图像过大，我们建议在上传前调整其大小。如果您的图像长边超过1568像素，或您的图像超过约1,600个令牌，它将首先被缩小，保持宽高比，直到在大小限制内。

如果您的输入图像过大需要调整大小，这将增加[首个令牌的延迟时间](/docs/zh-CN/about-claude/glossary)，而不会为您提供任何额外的模型性能。任何边小于200像素的非常小的图像可能会降低性能。

<Tip>
  为了改进[首个令牌的延迟时间](/docs/zh-CN/about-claude/glossary)，我们建议
  将图像调整为不超过1.15百万像素（且在两个维度上都在1568像素内）。
</Tip>

以下是我们的API接受的最大图像大小表，这些图像不会因常见宽高比而被调整大小。使用Claude Sonnet 4.5，这些图像使用约1,600个令牌，每1000个图像约4.80美元。

| 宽高比 | 图像大小   |
| ------------ | ------------ |
| 1&#58;1      | 1092x1092 px |
| 3&#58;4      | 951x1268 px  |
| 2&#58;3      | 896x1344 px  |
| 9&#58;16     | 819x1456 px  |
| 1&#58;2      | 784x1568 px  |

### 计算图像成本

您在请求Claude时包含的每个图像都计入您的令牌使用量。要计算大约成本，请将大约的图像令牌数乘以您使用的[模型的每令牌价格](https://claude.com/pricing)。

如果您的图像不需要调整大小，您可以通过此算法估计使用的令牌数：`tokens = (width px * height px)/750`

以下是基于Claude Sonnet 4.5每百万输入令牌3美元的价格，在我们的API大小限制内不同图像大小的大约令牌化和成本示例：

| 图像大小                    | 令牌数 | 每个图像成本 | 每1000个图像成本 |
| ----------------------------- | ------------ | ------------ | ---------------- |
| 200x200 px(0.04百万像素)   | \~54         | \~$0.00016   | \~$0.16          |
| 1000x1000 px(1百万像素)     | \~1334       | \~$0.004     | \~$4.00          |
| 1092x1092 px(1.19百万像素) | \~1590       | \~$0.0048    | \~$4.80          |

### 确保图像质量

向Claude提供图像时，请记住以下几点以获得最佳结果：

- **图像格式**：使用支持的图像格式：JPEG、PNG、GIF或WebP。
- **图像清晰度**：确保图像清晰，不会太模糊或像素化。
- **文本**：如果图像包含重要文本，请确保其清晰且不会太小。避免仅为了放大文本而裁剪掉关键的视觉背景。

---

## 提示示例

许多[对Claude的文本交互有效的提示技术](/docs/zh-CN/build-with-claude/prompt-engineering/overview)也可以应用于基于图像的提示。

这些示例演示了涉及图像的最佳实践提示结构。

<Tip>
  就像文档查询放置一样，Claude在图像出现在文本之前时效果最好。
  图像放在文本之后或与文本交错仍然会表现良好，但如果您的用例允许，
  我们建议采用先图像后文本的结构。
</Tip>

### 关于提示示例

以下示例演示了如何使用各种编程语言和方法使用Claude的视觉功能。您可以通过三种方式向Claude提供图像：

1. 作为`image`内容块中的base64编码图像
2. 作为对在线托管图像的URL引用
3. 使用Files API（上传一次，多次使用）

base64示例提示使用这些变量：

<CodeGroup>
```bash Shell
    # 对于基于URL的图像，您可以直接在JSON请求中使用URL
    
    # 对于base64编码的图像，您需要首先对图像进行编码
    # 在bash中将图像编码为base64的示例：
    BASE64_IMAGE_DATA=$(curl -s "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg" | base64)
    
    # 编码的数据现在可以在您的API调用中使用
```

```python Python
import base64
import httpx

# 对于base64编码的图像
image1_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
image1_media_type = "image/jpeg"
image1_data = base64.standard_b64encode(httpx.get(image1_url).content).decode("utf-8")

image2_url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg"
image2_media_type = "image/jpeg"
image2_data = base64.standard_b64encode(httpx.get(image2_url).content).decode("utf-8")

# 对于基于URL的图像，您可以直接在请求中使用URL
```

```typescript TypeScript
import axios from 'axios';

// 对于base64编码的图像
async function getBase64Image(url: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

// 使用
async function prepareImages() {
  const imageData = await getBase64Image('https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg');
  // 现在您可以在API调用中使用imageData
}

// 对于基于URL的图像，您可以直接在请求中使用URL
```

```java Java
import java.io.IOException;
import java.util.Base64;
import java.io.InputStream;
import java.net.URL;

public class ImageHandlingExample {

    public static void main(String[] args) throws IOException, InterruptedException {
        // 对于base64编码的图像
        String image1Url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg";
        String image1MediaType = "image/jpeg";
        String image1Data = downloadAndEncodeImage(image1Url);

        String image2Url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg";
        String image2MediaType = "image/jpeg";
        String image2Data = downloadAndEncodeImage(image2Url);

        // 对于基于URL的图像，您可以直接在请求中使用URL
    }

    private static String downloadAndEncodeImage(String imageUrl) throws IOException {
        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            return Base64.getEncoder().encodeToString(inputStream.readAllBytes());
        }
    }

}
```
</CodeGroup>

以下是如何使用base64编码的图像和URL引用在Messages API请求中包含图像的示例：

### Base64编码的图像示例

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

### 基于URL的图像示例

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

### Files API图像示例

对于您将重复使用的图像或想要避免编码开销的情况，请使用[Files API](/docs/zh-CN/build-with-claude/files)：

<CodeGroup>
```bash Shell
# 首先，将您的图像上传到Files API
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@image.jpg"

# 然后在您的消息中使用返回的file_id
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

# 上传图像文件
with open("image.jpg", "rb") as f:
    file_upload = client.beta.files.upload(file=("image.jpg", f, "image/jpeg"))

# 在消息中使用上传的文件
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
  // 上传图像文件
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('image.jpg'), undefined, { type: "image/jpeg" })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // 在消息中使用上传的文件
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

        // 上传图像文件
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("image.jpg")))
                .build());

        // 在消息中使用上传的文件
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

有关更多示例代码和参数详情，请参阅[Messages API示例](/docs/zh-CN/api/messages)。

<section title="示例：一个图像">

最好将图像放在提示中比关于它们的问题或使用它们的任务说明更早的位置。

要求Claude描述一个图像。

| 角色 | 内容                        |
| ---- | ------------------------------ |
| 用户 | \[Image\] Describe this image. |

<Tabs>
  <Tab title="使用Base64">
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
  <Tab title="使用URL">
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
<section title="示例：多个图像">

在有多个图像的情况下，使用`Image 1:`和`Image 2:`等方式介绍每个图像。图像之间或图像与提示之间不需要换行。

要求Claude描述多个图像之间的差异。
| 角色 | 内容 |
| ---- | ------------------------------------------------------------------------- |
| 用户 | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |

<Tabs>
  <Tab title="使用Base64">
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
  <Tab title="使用URL">
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
<section title="示例：多个图像和系统提示">

要求Claude描述多个图像之间的差异，同时给它一个系统提示来说明如何响应。

| 内容 |                                                                           |
| ------- | ------------------------------------------------------------------------- |
| 系统 | Respond only in Spanish.                                                  |
| 用户    | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |

<Tabs>
  <Tab title="使用Base64">
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
  <Tab title="使用URL">
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
<section title="示例：两个对话轮次中的四个图像">

Claude的视觉功能在混合图像和文本的多模态对话中表现出色。您可以与Claude进行扩展的来回交流，随时添加新图像或后续问题。这为迭代图像分析、比较或将视觉与其他知识相结合的强大工作流程提供了支持。

要求Claude对比两个图像，然后提出一个后续问题，将第一个图像与两个新图像进行比较。
| 角色 | 内容 |
| --------- | ------------------------------------------------------------------------------------ |
| 用户 | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |
| 助手 | \[Claude's response\] |
| 用户 | Image 1: \[Image 3\] Image 2: \[Image 4\] Are these images similar to the first two? |
| 助手 | \[Claude's response\] |

使用API时，只需将新图像插入到标准[多轮对话](/docs/zh-CN/api/messages)结构中`user`角色的Messages数组中。

</section>

---

## 限制

虽然Claude的图像理解能力是最先进的，但需要注意一些限制：

- **人员识别**：Claude[不能用于](/docs/zh-CN/legal/aup)识别（即命名）图像中的人员，并将拒绝这样做。
- **准确性**：Claude在解释低质量、旋转或非常小的图像（小于200像素）时可能会产生幻觉或犯错误。
- **空间推理**：Claude的空间推理能力有限。它可能在需要精确定位或布局的任务中遇到困难，例如读取模拟时钟面或描述国际象棋棋子的确切位置。
- **计数**：Claude可以给出图像中对象的大约数量，但可能不总是精确准确，特别是对于大量小对象。
- **AI生成的图像**：Claude不知道图像是否是AI生成的，如果被问到可能会不正确。不要依赖它来检测虚假或合成图像。
- **不当内容**：Claude不会处理违反我们[可接受使用政策](https://www.anthropic.com/legal/aup)的不当或露骨图像。
- **医疗保健应用**：虽然Claude可以分析一般医学图像，但它不是为解释复杂的诊断扫描（如CT或MRI）而设计的。Claude的输出不应被视为专业医疗建议或诊断的替代品。

始终仔细审查和验证Claude的图像解释，特别是对于高风险用例。不要在没有人工监督的情况下使用Claude进行需要完美精度或敏感图像分析的任务。

---

## 常见问题

  <section title="Claude 支持哪些图像文件类型？">

    Claude 目前支持 JPEG、PNG、GIF 和 WebP 图像格式，具体如下：
    - `image/jpeg`
    - `image/png`
    - `image/gif`
    - `image/webp`
  
</section>

{" "}

<section title="Claude 能读取图像 URL 吗？">

  是的，Claude 现在可以通过 API 中的 URL 图像源块处理来自 URL 的图像。
  只需在 API 请求中使用 "url" 源类型而不是 "base64"。 
  示例：
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

  <section title="我上传的图像文件大小有限制吗？">

    是的，有限制：
    - API：每个图像最大 5MB
    - claude.ai：每个图像最大 10MB

    超过这些限制的图像将被拒绝，使用我们的 API 时会返回错误。

  
</section>

  <section title="一个请求中我可以包含多少张图像？">

    图像限制如下：
    - Messages API：每个请求最多 100 张图像
    - claude.ai：每轮最多 20 张图像

    超过这些限制的请求将被拒绝并返回错误。

  
</section>

{" "}

<section title="Claude 会读取图像元数据吗？">

  不会，Claude 不会解析或接收从传递给它的图像中获取的任何元数据。

</section>

{" "}

<section title="我可以删除上传的图像吗？">

  不可以。图像上传是临时的，不会在 API 请求期间之外存储。上传的图像在处理后会自动删除。

</section>

{" "}

<section title="我在哪里可以找到有关图像上传数据隐私的详细信息？">

  请参考我们的隐私政策页面，了解我们如何处理上传的图像和其他数据。我们不使用上传的图像来训练我们的模型。

</section>

  <section title="如果 Claude 的图像解释似乎有误怎么办？">

    如果 Claude 的图像解释似乎不正确：
    1. 确保图像清晰、高质量且方向正确。
    2. 尝试使用提示工程技术来改进结果。
    3. 如果问题仍然存在，请在 claude.ai 中标记输出（竖起大拇指/竖起大拇指向下）或联系我们的支持团队。

    您的反馈帮助我们改进！

  
</section>

  <section title="Claude 可以生成或编辑图像吗？">

    不可以，Claude 是一个图像理解模型。它可以解释和分析图像，但不能生成、产生、编辑、操纵或创建图像。
  
</section>

---

## 深入了解视觉功能

准备好使用 Claude 开始使用图像进行构建了吗？以下是一些有用的资源：

- [多模态食谱](https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal)：此食谱包含有关[图像入门](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/getting%5Fstarted%5Fwith%5Fvision.ipynb)和[最佳实践技术](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/best%5Fpractices%5Ffor%5Fvision.ipynb)的提示，以确保图像的最高质量性能。了解如何有效地使用图像提示 Claude 来执行任务，例如[解释和分析图表](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/reading%5Fcharts%5Fgraphs%5Fpowerpoints.ipynb)或[从表单中提取内容](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/how%5Fto%5Ftranscribe%5Ftext.ipynb)。
- [API 参考](/docs/zh-CN/api/messages)：访问我们的 Messages API 文档，包括涉及图像的示例 [API 调用](/docs/zh-CN/build-with-claude/working-with-messages#vision)。

如果您有任何其他问题，请随时联系我们的[支持团队](https://support.claude.com/)。您也可以加入我们的[开发者社区](https://www.anthropic.com/discord)，与其他创作者联系并获得 Anthropic 专家的帮助。