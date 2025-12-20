# 비전

Claude의 비전 기능을 통해 이미지를 이해하고 분석할 수 있으며, 멀티모달 상호작용의 흥미로운 가능성을 열어줍니다.

---

이 가이드는 Claude에서 이미지를 사용하는 방법, 모범 사례, 주의해야 할 제한 사항을 포함하여 설명합니다.

---

## 비전 사용 방법

Claude의 비전 기능을 다음을 통해 사용할 수 있습니다:

- [claude.ai](https://claude.ai/). 파일처럼 이미지를 업로드하거나 이미지를 채팅 창에 직접 드래그 앤 드롭합니다.
- [Console Workbench](/workbench/). 모든 사용자 메시지 블록의 오른쪽 상단에 이미지를 추가하는 버튼이 나타납니다.
- **API 요청**. 이 가이드의 예제를 참조하세요.

---

## 업로드 전에

### 기본 사항 및 제한

단일 요청에 여러 이미지를 포함할 수 있습니다([claude.ai](https://claude.ai/)의 경우 최대 20개, API 요청의 경우 100개). Claude는 응답을 작성할 때 제공된 모든 이미지를 분석합니다. 이는 이미지를 비교하거나 대조하는 데 도움이 될 수 있습니다.

8000x8000 px보다 큰 이미지를 제출하면 거부됩니다. 한 번의 API 요청에 20개 이상의 이미지를 제출하면 이 제한은 2000x2000 px입니다.

<Note>
API는 요청당 100개의 이미지를 지원하지만, 표준 엔드포인트에는 [32MB 요청 크기 제한](/docs/ko/api/overview#request-size-limits)이 있습니다.
</Note>

### 이미지 크기 평가

최적의 성능을 위해 업로드하기 전에 이미지가 너무 크면 크기를 조정하는 것이 좋습니다. 이미지의 긴 가장자리가 1568픽셀보다 크거나 이미지가 약 1,600토큰보다 크면 먼저 종횡비를 유지하면서 크기 제한 내에 들어올 때까지 축소됩니다.

입력 이미지가 너무 크고 크기를 조정해야 하는 경우 [time-to-first-token](/docs/ko/about-claude/glossary)의 지연 시간이 증가하지만 추가 모델 성능은 제공되지 않습니다. 어느 한쪽 가장자리가 200픽셀 미만인 매우 작은 이미지는 성능을 저하시킬 수 있습니다.

<Tip>
  [time-to-first-token](/docs/ko/about-claude/glossary)을 개선하려면 이미지를
  1.15메가픽셀 이하로 조정하고 두 차원 모두 1568픽셀 이내로 조정하는 것이 좋습니다.
</Tip>

다음은 일반적인 종횡비에 대해 API에서 허용하는 최대 이미지 크기 표입니다. 이 이미지들은 크기 조정되지 않습니다. Claude Sonnet 4.5를 사용하면 이러한 이미지는 약 1,600토큰을 사용하고 1,000개 이미지당 약 $4.80입니다.

| 종횡비 | 이미지 크기   |
| ------------ | ------------ |
| 1&#58;1      | 1092x1092 px |
| 3&#58;4      | 951x1268 px  |
| 2&#58;3      | 896x1344 px  |
| 9&#58;16     | 819x1456 px  |
| 1&#58;2      | 784x1568 px  |

### 이미지 비용 계산

Claude에 대한 요청에 포함하는 각 이미지는 토큰 사용량에 포함됩니다. 대략적인 비용을 계산하려면 대략적인 이미지 토큰 수에 사용 중인 [모델의 토큰당 가격](https://claude.com/pricing)을 곱하세요.

이미지를 크기 조정할 필요가 없으면 이 알고리즘을 통해 사용된 토큰 수를 추정할 수 있습니다: `tokens = (width px * height px)/750`

다음은 Claude Sonnet 4.5의 토큰당 가격 $3/백만 입력 토큰을 기반으로 API의 크기 제약 내에서 다양한 이미지 크기에 대한 대략적인 토큰화 및 비용의 예입니다:

| 이미지 크기                    | 토큰 수 | 이미지당 비용 | 1,000개 이미지당 비용 |
| ----------------------------- | ------------ | ------------ | ---------------- |
| 200x200 px(0.04 메가픽셀)   | \~54         | \~$0.00016   | \~$0.16          |
| 1000x1000 px(1 메가픽셀)     | \~1334       | \~$0.004     | \~$4.00          |
| 1092x1092 px(1.19 메가픽셀) | \~1590       | \~$0.0048    | \~$4.80          |

### 이미지 품질 보장

Claude에 이미지를 제공할 때 최상의 결과를 위해 다음을 염두에 두세요:

- **이미지 형식**: 지원되는 이미지 형식을 사용하세요: JPEG, PNG, GIF 또는 WebP.
- **이미지 선명도**: 이미지가 명확하고 흐릿하거나 픽셀화되지 않았는지 확인하세요.
- **텍스트**: 이미지에 중요한 텍스트가 포함되어 있으면 읽을 수 있고 너무 작지 않은지 확인하세요. 텍스트를 확대하기 위해 주요 시각적 맥락을 자르지 마세요.

---

## 프롬프트 예제

Claude와의 텍스트 기반 상호작용에 잘 작동하는 많은 [프롬프팅 기법](/docs/ko/build-with-claude/prompt-engineering/overview)을 이미지 기반 프롬프트에도 적용할 수 있습니다.

이 예제들은 이미지와 관련된 모범 사례 프롬프트 구조를 보여줍니다.

<Tip>
  문서-쿼리 배치와 마찬가지로 Claude는 이미지가 텍스트 앞에 올 때 가장 잘 작동합니다.
  텍스트 뒤에 배치되거나 텍스트와 섞여 있는 이미지도 여전히 잘 작동하지만,
  사용 사례가 허용하면 이미지-텍스트 구조를 권장합니다.
</Tip>

### 프롬프트 예제 정보

다음 예제들은 다양한 프로그래밍 언어와 접근 방식을 사용하여 Claude의 비전 기능을 사용하는 방법을 보여줍니다. Claude에 이미지를 제공하는 방법은 세 가지입니다:

1. `image` 콘텐츠 블록의 base64 인코딩 이미지
2. 온라인에서 호스팅되는 이미지에 대한 URL 참조
3. Files API 사용(한 번 업로드, 여러 번 사용)

base64 예제 프롬프트는 다음 변수를 사용합니다:

<CodeGroup>
```bash Shell
    # URL 기반 이미지의 경우 JSON 요청에서 URL을 직접 사용할 수 있습니다
    
    # base64 인코딩 이미지의 경우 먼저 이미지를 인코딩해야 합니다
    # bash에서 이미지를 base64로 인코딩하는 방법의 예:
    BASE64_IMAGE_DATA=$(curl -s "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg" | base64)
    
    # 인코딩된 데이터를 이제 API 호출에서 사용할 수 있습니다
```

```python Python
import base64
import httpx

# base64 인코딩 이미지의 경우
image1_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
image1_media_type = "image/jpeg"
image1_data = base64.standard_b64encode(httpx.get(image1_url).content).decode("utf-8")

image2_url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg"
image2_media_type = "image/jpeg"
image2_data = base64.standard_b64encode(httpx.get(image2_url).content).decode("utf-8")

# URL 기반 이미지의 경우 요청에서 URL을 직접 사용할 수 있습니다
```

```typescript TypeScript
import axios from 'axios';

// base64 인코딩 이미지의 경우
async function getBase64Image(url: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

// 사용법
async function prepareImages() {
  const imageData = await getBase64Image('https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg');
  // 이제 API 호출에서 imageData를 사용할 수 있습니다
}

// URL 기반 이미지의 경우 요청에서 URL을 직접 사용할 수 있습니다
```

```java Java
import java.io.IOException;
import java.util.Base64;
import java.io.InputStream;
import java.net.URL;

public class ImageHandlingExample {

    public static void main(String[] args) throws IOException, InterruptedException {
        // base64 인코딩 이미지의 경우
        String image1Url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg";
        String image1MediaType = "image/jpeg";
        String image1Data = downloadAndEncodeImage(image1Url);

        String image2Url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg";
        String image2MediaType = "image/jpeg";
        String image2Data = downloadAndEncodeImage(image2Url);

        // URL 기반 이미지의 경우 요청에서 URL을 직접 사용할 수 있습니다
    }

    private static String downloadAndEncodeImage(String imageUrl) throws IOException {
        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            return Base64.getEncoder().encodeToString(inputStream.readAllBytes());
        }
    }

}
```
</CodeGroup>

다음은 base64 인코딩 이미지 및 URL 참조를 사용하여 Messages API 요청에 이미지를 포함하는 방법의 예입니다:

### Base64 인코딩 이미지 예제

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

### URL 기반 이미지 예제

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

### Files API 이미지 예제

반복적으로 사용할 이미지나 인코딩 오버헤드를 피하고 싶을 때는 [Files API](/docs/ko/build-with-claude/files)를 사용하세요:

<CodeGroup>
```bash Shell
# 먼저 이미지를 Files API에 업로드합니다
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@image.jpg"

# 그런 다음 반환된 file_id를 메시지에서 사용합니다
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

# 이미지 파일을 업로드합니다
with open("image.jpg", "rb") as f:
    file_upload = client.beta.files.upload(file=("image.jpg", f, "image/jpeg"))

# 업로드된 파일을 메시지에서 사용합니다
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
  // 이미지 파일을 업로드합니다
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('image.jpg'), undefined, { type: "image/jpeg" })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // 업로드된 파일을 메시지에서 사용합니다
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

        // 이미지 파일을 업로드합니다
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("image.jpg")))
                .build());

        // 업로드된 파일을 메시지에서 사용합니다
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

더 많은 예제 코드 및 매개변수 세부 정보는 [Messages API 예제](/docs/ko/api/messages)를 참조하세요.

<section title="예제: 한 개의 이미지">

이미지를 프롬프트에서 이미지에 대한 질문이나 이미지를 사용하는 작업에 대한 지시사항보다 먼저 배치하는 것이 가장 좋습니다.

Claude에 한 개의 이미지를 설명하도록 요청합니다.

| 역할 | 콘텐츠                        |
| ---- | ------------------------------ |
| 사용자 | \[Image\] Describe this image. |

<Tabs>
  <Tab title="Base64 사용">
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
  <Tab title="URL 사용">
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
<section title="예제: 여러 이미지">

여러 이미지가 있는 경우 각 이미지를 `Image 1:` 및 `Image 2:` 등으로 소개합니다. 이미지 사이나 이미지와 프롬프트 사이에 줄 바꿈이 필요하지 않습니다.

Claude에 여러 이미지 간의 차이점을 설명하도록 요청합니다.
| 역할 | 콘텐츠 |
| ---- | ------------------------------------------------------------------------- |
| 사용자 | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |

<Tabs>
  <Tab title="Base64 사용">
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
  <Tab title="URL 사용">
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
<section title="예제: 시스템 프롬프트가 있는 여러 이미지">

Claude에 여러 이미지 간의 차이점을 설명하도록 요청하면서 응답 방식에 대한 시스템 프롬프트를 제공합니다.

| 콘텐츠 |                                                                           |
| ------- | ------------------------------------------------------------------------- |
| 시스템  | Respond only in Spanish.                                                  |
| 사용자    | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |

<Tabs>
  <Tab title="Base64 사용">
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
  <Tab title="URL 사용">
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
<section title="예제: 두 개의 대화 턴에 걸친 네 개의 이미지">

Claude의 비전 기능은 이미지와 텍스트를 혼합하는 멀티모달 대화에서 빛을 발합니다. Claude와 확장된 왕복 교환을 할 수 있으며, 언제든지 새로운 이미지나 후속 질문을 추가할 수 있습니다. 이를 통해 반복적인 이미지 분석, 비교 또는 시각 자료와 다른 지식을 결합하는 강력한 워크플로우를 사용할 수 있습니다.

두 개의 이미지를 대조하도록 Claude에 요청한 다음 첫 번째 이미지를 두 개의 새로운 이미지와 비교하는 후속 질문을 요청합니다.
| 역할 | 콘텐츠 |
| --------- | ------------------------------------------------------------------------------------ |
| 사용자 | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |
| 어시스턴트 | \[Claude's response\] |
| 사용자 | Image 1: \[Image 3\] Image 2: \[Image 4\] Are these images similar to the first two? |
| 어시스턴트 | \[Claude's response\] |

API를 사용할 때 새 이미지를 표준 [multiturn conversation](/docs/ko/api/messages) 구조의 일부로 `user` 역할의 메시지 배열에 삽입하면 됩니다.

</section>

---

## 제한 사항

Claude의 이미지 이해 기능은 최첨단이지만 주의해야 할 몇 가지 제한 사항이 있습니다:

- **사람 식별**: Claude는 이미지의 사람을 식별(즉, 이름을 지정)하는 데 [사용할 수 없으며](https://www.anthropic.com/legal/aup) 그렇게 하기를 거부합니다.
- **정확도**: Claude는 저품질, 회전되거나 200픽셀 미만의 매우 작은 이미지를 해석할 때 환각하거나 실수할 수 있습니다.
- **공간 추론**: Claude의 공간 추론 능력은 제한적입니다. 아날로그 시계 면 읽기나 체스 말의 정확한 위치 설명과 같이 정확한 위치 지정이나 레이아웃이 필요한 작업에서 어려움을 겪을 수 있습니다.
- **계산**: Claude는 이미지의 객체 수를 대략적으로 셀 수 있지만 특히 많은 수의 작은 객체의 경우 항상 정확하지 않을 수 있습니다.
- **AI 생성 이미지**: Claude는 이미지가 AI로 생성되었는지 알 수 없으며 물어볼 경우 잘못될 수 있습니다. 가짜 또는 합성 이미지를 감지하는 데 의존하지 마세요.
- **부적절한 콘텐츠**: Claude는 [Acceptable Use Policy](https://www.anthropic.com/legal/aup)를 위반하는 부적절하거나 명시적인 이미지를 처리하지 않습니다.
- **의료 응용**: Claude는 일반적인 의료 이미지를 분석할 수 있지만 CT 또는 MRI와 같은 복잡한 진단 스캔을 해석하도록 설계되지 않았습니다. Claude의 출력은 전문적인 의료 조언이나 진단의 대체물로 간주되어서는 안 됩니다.

특히 높은 위험도의 사용 사례에서는 항상 Claude의 이미지 해석을 신중하게 검토하고 확인하세요. 완벽한 정확도가 필요하거나 인간의 감시 없이 민감한 이미지 분석이 필요한 작업에는 Claude를 사용하지 마세요.

---

## FAQ

  <section title="Claude가 지원하는 이미지 파일 형식은 무엇입니까?">

    Claude는 현재 JPEG, PNG, GIF 및 WebP 이미지 형식을 지원합니다:
    - `image/jpeg`
    - `image/png`
    - `image/gif`
    - `image/webp`
  
</section>

{" "}

<section title="Claude가 이미지 URL을 읽을 수 있습니까?">

  예, Claude는 이제 API의 URL 이미지 소스 블록으로 URL에서 이미지를 처리할 수 있습니다.
  API 요청에서 "base64" 대신 "url" 소스 유형을 사용하면 됩니다.
  예:
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

  <section title="업로드할 수 있는 이미지 파일 크기에 제한이 있습니까?">

    예, 제한이 있습니다:
    - API: 이미지당 최대 5MB
    - claude.ai: 이미지당 최대 10MB

    이 제한을 초과하는 이미지는 거부되며 API 사용 시 오류를 반환합니다.

  
</section>

  <section title="한 번의 요청에 몇 개의 이미지를 포함할 수 있습니까?">

    이미지 제한은 다음과 같습니다:
    - Messages API: 요청당 최대 100개 이미지
    - claude.ai: 차례당 최대 20개 이미지

    이 제한을 초과하는 요청은 거부되며 오류를 반환합니다.

  
</section>

{" "}

<section title="Claude가 이미지 메타데이터를 읽습니까?">

  아니요, Claude는 전달된 이미지에서 메타데이터를 파싱하거나 받지 않습니다.

</section>

{" "}

<section title="업로드한 이미지를 삭제할 수 있습니까?">

  아니요. 이미지 업로드는 임시적이며 API 요청 기간을 초과하여 저장되지 않습니다. 업로드된 이미지는 처리된 후 자동으로 삭제됩니다.

</section>

{" "}

<section title="이미지 업로드에 대한 데이터 개인정보 보호 세부 정보는 어디에서 찾을 수 있습니까?">

  업로드된 이미지 및 기타 데이터를 처리하는 방법에 대한 정보는 개인정보 보호 정책 페이지를 참조하십시오. 우리는 업로드된 이미지를 모델 학습에 사용하지 않습니다.

</section>

  <section title="Claude의 이미지 해석이 잘못된 것 같으면 어떻게 합니까?">

    Claude의 이미지 해석이 잘못된 것 같으면:
    1. 이미지가 명확하고 고품질이며 올바르게 방향이 지정되어 있는지 확인하십시오.
    2. 프롬프트 엔지니어링 기법을 시도하여 결과를 개선하십시오.
    3. 문제가 계속되면 claude.ai에서 출력을 플래그 지정(엄지손가락 위/아래)하거나 지원팀에 문의하십시오.

    귀하의 피드백은 우리가 개선하는 데 도움이 됩니다!

  
</section>

  <section title="Claude가 이미지를 생성하거나 편집할 수 있습니까?">

    아니요, Claude는 이미지 이해 모델일 뿐입니다. 이미지를 해석하고 분석할 수 있지만 이미지를 생성, 생산, 편집, 조작 또는 생성할 수 없습니다.
  
</section>

---

## 비전에 대해 더 깊이 알아보기

Claude를 사용하여 이미지로 구축할 준비가 되셨습니까? 다음은 몇 가지 유용한 리소스입니다:

- [Multimodal cookbook](https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal): 이 cookbook에는 [이미지 시작하기](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/getting%5Fstarted%5Fwith%5Fvision.ipynb) 및 [모범 사례 기법](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/best%5Fpractices%5Ffor%5Fvision.ipynb)에 대한 팁이 있어 이미지로 최고 품질의 성능을 보장합니다. [차트 해석 및 분석](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/reading%5Fcharts%5Fgraphs%5Fpowerpoints.ipynb) 또는 [양식에서 콘텐츠 추출](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/how%5Fto%5Ftranscribe%5Ftext.ipynb)과 같은 작업을 수행하기 위해 Claude에 이미지를 효과적으로 프롬프트하는 방법을 확인하십시오.
- [API reference](/docs/ko/api/messages): Messages API에 대한 설명서를 방문하십시오. 여기에는 [이미지와 관련된 API 호출](/docs/ko/build-with-claude/working-with-messages#vision)의 예가 포함됩니다.

다른 질문이 있으시면 [지원팀](https://support.claude.com/)에 문의하십시오. [개발자 커뮤니티](https://www.anthropic.com/discord)에 참여하여 다른 제작자와 연결하고 Anthropic 전문가로부터 도움을 받을 수도 있습니다.