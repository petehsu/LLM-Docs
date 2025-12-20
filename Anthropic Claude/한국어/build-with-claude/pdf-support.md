# PDF 지원

Claude로 PDF를 처리하세요. 문서에서 텍스트를 추출하고, 차트를 분석하며, 시각적 콘텐츠를 이해할 수 있습니다.

---

이제 제공하는 PDF의 모든 텍스트, 그림, 차트, 표에 대해 Claude에게 질문할 수 있습니다. 몇 가지 사용 사례 예시:
- 재무 보고서 분석 및 차트/표 이해
- 법률 문서에서 핵심 정보 추출
- 문서 번역 지원
- 문서 정보를 구조화된 형식으로 변환

## 시작하기 전에

### PDF 요구사항 확인
Claude는 모든 표준 PDF와 작동합니다. 하지만 PDF 지원을 사용할 때 요청 크기가 다음 요구사항을 충족하는지 확인해야 합니다:

| 요구사항 | 제한 |
|---|---|
| 최대 요청 크기 | 32MB |
| 요청당 최대 페이지 수 | 100 |
| 형식 | 표준 PDF (비밀번호/암호화 없음) |

두 제한 모두 PDF와 함께 전송되는 다른 콘텐츠를 포함한 전체 요청 페이로드에 적용됩니다.

PDF 지원은 Claude의 비전 기능에 의존하므로, 다른 비전 작업과 동일한 [제한사항 및 고려사항](/docs/ko/build-with-claude/vision#limitations)이 적용됩니다.

### 지원되는 플랫폼 및 모델

PDF 지원은 현재 직접 API 액세스와 Google Vertex AI를 통해 지원됩니다. 모든 [활성 모델](/docs/ko/about-claude/models/overview)이 PDF 처리를 지원합니다.

PDF 지원은 이제 다음 고려사항과 함께 Amazon Bedrock에서 사용할 수 있습니다:

### Amazon Bedrock PDF 지원

Amazon Bedrock의 Converse API를 통해 PDF 지원을 사용할 때 두 가지 별개의 문서 처리 모드가 있습니다:

<Note>
**중요**: Converse API에서 Claude의 전체 시각적 PDF 이해 기능에 액세스하려면 인용을 활성화해야 합니다. 인용이 활성화되지 않으면 API는 기본 텍스트 추출만으로 되돌아갑니다. [인용 작업](/docs/ko/build-with-claude/citations)에 대해 자세히 알아보세요.
</Note>

#### 문서 처리 모드

1. **Converse Document Chat** (원래 모드 - 텍스트 추출만)
   - PDF에서 기본 텍스트 추출 제공
   - PDF 내의 이미지, 차트 또는 시각적 레이아웃을 분석할 수 없음
   - 3페이지 PDF에 대해 약 1,000개 토큰 사용
   - 인용이 활성화되지 않은 경우 자동으로 사용됨

2. **Claude PDF Chat** (새로운 모드 - 전체 시각적 이해)
   - PDF의 완전한 시각적 분석 제공
   - 차트, 그래프, 이미지 및 시각적 레이아웃을 이해하고 분석할 수 있음
   - 포괄적인 이해를 위해 각 페이지를 텍스트와 이미지 모두로 처리
   - 3페이지 PDF에 대해 약 7,000개 토큰 사용
   - **Converse API에서 인용이 활성화되어야 함**

#### 주요 제한사항

- **Converse API**: 시각적 PDF 분석에는 인용이 활성화되어야 합니다. 현재 (InvokeModel API와 달리) 인용 없이 시각적 분석을 사용할 수 있는 옵션이 없습니다.
- **InvokeModel API**: 강제 인용 없이 PDF 처리에 대한 완전한 제어를 제공합니다.

#### 일반적인 문제

고객이 Converse API를 사용할 때 Claude가 PDF의 이미지나 차트를 보지 못한다고 보고하는 경우, 인용 플래그를 활성화해야 할 가능성이 높습니다. 인용 없이는 Converse가 기본 텍스트 추출만으로 되돌아갑니다.

<Note>
이는 우리가 해결하기 위해 노력하고 있는 Converse API의 알려진 제약사항입니다. 인용 없이 시각적 PDF 분석이 필요한 애플리케이션의 경우 대신 InvokeModel API 사용을 고려하세요.
</Note>

<Note>
.csv, .xlsx, .docx, .md 또는 .txt 파일과 같은 비PDF 파일의 경우 [다른 파일 형식 작업](/docs/ko/build-with-claude/files#working-with-other-file-formats)을 참조하세요.
</Note>

***

## Claude로 PDF 처리

### 첫 번째 PDF 요청 보내기
Messages API를 사용한 간단한 예제부터 시작해보겠습니다. Claude에게 PDF를 제공하는 방법은 세 가지입니다:

1. 온라인에 호스팅된 PDF에 대한 URL 참조로
2. `document` 콘텐츠 블록에서 base64로 인코딩된 PDF로  
3. [Files API](/docs/ko/build-with-claude/files)의 `file_id`로

#### 옵션 1: URL 기반 PDF 문서

가장 간단한 접근 방식은 URL에서 PDF를 직접 참조하는 것입니다:

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

#### 옵션 2: Base64로 인코딩된 PDF 문서

로컬 시스템에서 PDF를 보내거나 URL을 사용할 수 없는 경우:

<CodeGroup>
    ```bash Shell
    # 방법 1: 원격 PDF 가져오기 및 인코딩
    curl -s "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf" | base64 | tr -d '\n' > pdf_base64.txt

    # 방법 2: 로컬 PDF 파일 인코딩
    # base64 document.pdf | tr -d '\n' > pdf_base64.txt

    # pdf_base64.txt 내용을 사용하여 JSON 요청 파일 생성
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

    # JSON 파일을 사용하여 API 요청 보내기
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

    # 먼저 PDF를 로드하고 인코딩 
    pdf_url = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
    pdf_data = base64.standard_b64encode(httpx.get(pdf_url).content).decode("utf-8")

    # 대안: 로컬 파일에서 로드
    # with open("document.pdf", "rb") as f:
    #     pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

    # base64 인코딩을 사용하여 Claude에게 보내기
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
      // 방법 1: 원격 PDF 가져오기 및 인코딩
      const pdfURL = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
      const pdfResponse = await fetch(pdfURL);
      const arrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(arrayBuffer).toString('base64');
      
      // 방법 2: 로컬 파일에서 로드
      // const pdfBase64 = fs.readFileSync('document.pdf').toString('base64');
      
      // base64로 인코딩된 PDF로 API 요청 보내기
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

            // 방법 1: 원격 PDF 다운로드 및 인코딩
            String pdfUrl = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
            HttpClient httpClient = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(pdfUrl))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            String pdfBase64 = Base64.getEncoder().encodeToString(response.body());

            // 방법 2: 로컬 파일에서 로드
            // byte[] fileBytes = Files.readAllBytes(Path.of("document.pdf"));
            // String pdfBase64 = Base64.getEncoder().encodeToString(fileBytes);

            // base64 데이터로 문서 블록 생성
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .base64PdfSource(pdfBase64)
                    .build();

            // 문서 및 텍스트 콘텐츠 블록으로 메시지 생성
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

#### 옵션 3: Files API

반복적으로 사용할 PDF나 인코딩 오버헤드를 피하고 싶을 때는 [Files API](/docs/ko/build-with-claude/files)를 사용하세요: 

<CodeGroup>
```bash Shell
# 먼저 PDF를 Files API에 업로드
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@document.pdf"

# 그런 다음 반환된 file_id를 메시지에서 사용
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

# PDF 파일 업로드
with open("document.pdf", "rb") as f:
    file_upload = client.beta.files.upload(file=("document.pdf", f, "application/pdf"))

# 업로드된 파일을 메시지에서 사용
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
  // PDF 파일 업로드
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('document.pdf'), undefined, { type: 'application/pdf' })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // 업로드된 파일을 메시지에서 사용
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

        // PDF 파일 업로드
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("document.pdf")))
                .build());

        // 업로드된 파일을 메시지에서 사용
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

### PDF 지원 작동 방식
Claude에게 PDF를 보내면 다음 단계가 발생합니다:
<Steps>
  <Step title="시스템이 문서의 내용을 추출합니다.">
    - 시스템이 문서의 각 페이지를 이미지로 변환합니다.
    - 각 페이지의 텍스트가 추출되어 각 페이지의 이미지와 함께 제공됩니다.
  </Step>
  <Step title="Claude가 문서를 더 잘 이해하기 위해 텍스트와 이미지를 모두 분석합니다.">
    - 문서는 분석을 위해 텍스트와 이미지의 조합으로 제공됩니다.
    - 이를 통해 사용자는 차트, 다이어그램 및 기타 비텍스트 콘텐츠와 같은 PDF의 시각적 요소에 대한 인사이트를 요청할 수 있습니다.
  </Step>
  <Step title="Claude가 관련이 있는 경우 PDF의 내용을 참조하여 응답합니다.">
    Claude는 응답할 때 텍스트 및 시각적 콘텐츠를 모두 참조할 수 있습니다. PDF 지원을 다음과 통합하여 성능을 더욱 향상시킬 수 있습니다:
    - **프롬프트 캐싱**: 반복 분석의 성능을 향상시키기 위해.
    - **배치 처리**: 대용량 문서 처리를 위해.
    - **도구 사용**: 문서에서 특정 정보를 추출하여 도구 입력으로 사용하기 위해.
  </Step>
</Steps>

### 비용 추정
PDF 파일의 토큰 수는 문서에서 추출된 총 텍스트와 페이지 수에 따라 달라집니다:
- 텍스트 토큰 비용: 각 페이지는 일반적으로 콘텐츠 밀도에 따라 페이지당 1,500-3,000개의 토큰을 사용합니다. 추가 PDF 수수료 없이 표준 API 가격이 적용됩니다.
- 이미지 토큰 비용: 각 페이지가 이미지로 변환되므로 동일한 [이미지 기반 비용 계산](/docs/ko/build-with-claude/vision#evaluate-image-size)이 적용됩니다.

특정 PDF의 비용을 추정하려면 [토큰 계산](/docs/ko/build-with-claude/token-counting)을 사용할 수 있습니다.

***

## PDF 처리 최적화

### 성능 향상
최적의 결과를 위해 다음 모범 사례를 따르세요:
- 요청에서 PDF를 텍스트보다 앞에 배치
- 표준 글꼴 사용
- 텍스트가 명확하고 읽기 쉬운지 확인
- 페이지를 적절한 세로 방향으로 회전
- 프롬프트에서 논리적 페이지 번호(PDF 뷰어에서) 사용
- 필요할 때 큰 PDF를 청크로 분할
- 반복 분석을 위해 프롬프트 캐싱 활성화

### 구현 확장
대용량 처리의 경우 다음 접근 방식을 고려하세요:

#### 프롬프트 캐싱 사용
반복 쿼리의 성능을 향상시키기 위해 PDF를 캐시하세요:
<CodeGroup>
```bash Shell
# pdf_base64.txt 내용을 사용하여 JSON 요청 파일 생성
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

# 그런 다음 JSON 파일을 사용하여 API 호출
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

        // PDF 파일을 base64로 읽기
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

#### 문서 배치 처리
대용량 워크플로우에는 Message Batches API를 사용하세요:
<CodeGroup>
```bash Shell
# pdf_base64.txt 내용을 사용하여 JSON 요청 파일 생성
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

# 그런 다음 JSON 파일을 사용하여 API 호출
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

        // PDF 파일을 base64로 읽기
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

## 다음 단계

<CardGroup cols={2}>
  <Card
    title="PDF 예제 시도해보기"
    icon="file"
    href="https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal"
  >
    쿡북 레시피에서 PDF 처리의 실용적인 예제를 탐색하세요.
  </Card>

  <Card
    title="API 참조 보기"
    icon="code"
    href="/docs/ko/api/messages"
  >
    PDF 지원에 대한 완전한 API 문서를 확인하세요.
  </Card>
</CardGroup>