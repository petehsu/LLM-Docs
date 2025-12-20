# Files API

---

Files API를 사용하면 Claude API와 함께 사용할 파일을 업로드하고 관리할 수 있으며, 각 요청마다 콘텐츠를 다시 업로드할 필요가 없습니다. 이는 [코드 실행 도구](/docs/ko/agents-and-tools/tool-use/code-execution-tool)를 사용하여 입력(예: 데이터 세트 및 문서)을 제공한 후 출력(예: 차트)을 다운로드할 때 특히 유용합니다. Files API를 사용하여 여러 API 호출에서 자주 사용되는 문서와 이미지를 계속 다시 업로드할 필요가 없도록 할 수도 있습니다. 이 가이드 외에도 [API 참조를 직접 탐색](/docs/ko/api/files-create)할 수 있습니다.

<Note>
Files API는 현재 베타 버전입니다. [피드백 양식](https://forms.gle/tisHyierGwgN4DUE9)을 통해 Files API 경험을 공유해 주시기 바랍니다.
</Note>

## 지원되는 모델

Messages 요청에서 `file_id`를 참조하는 것은 주어진 파일 유형을 지원하는 모든 모델에서 지원됩니다. 예를 들어, [이미지](/docs/ko/build-with-claude/vision)는 모든 Claude 3+ 모델에서 지원되고, [PDF](/docs/ko/build-with-claude/pdf-support)는 모든 Claude 3.5+ 모델에서 지원되며, [다양한 기타 파일 유형](/docs/ko/agents-and-tools/tool-use/code-execution-tool#supported-file-types)은 Claude 3.5 Haiku 및 모든 Claude 3.7+ 모델의 코드 실행 도구에서 지원됩니다.

Files API는 현재 Amazon Bedrock 또는 Google Vertex AI에서 지원되지 않습니다.

## Files API 작동 방식

Files API는 파일 작업을 위한 간단한 한 번 업로드, 여러 번 사용 방식을 제공합니다:

- **파일 업로드** - 보안 스토리지에 파일을 업로드하고 고유한 `file_id` 수신
- **파일 다운로드** - 스킬 또는 코드 실행 도구에서 생성된 파일 다운로드
- **파일 참조** - [Messages](/docs/ko/api/messages) 요청에서 콘텐츠를 다시 업로드하는 대신 `file_id`를 사용하여 파일 참조
- **파일 관리** - 목록 조회, 검색 및 삭제 작업으로 파일 관리

## Files API 사용 방법

<Note>
Files API를 사용하려면 베타 기능 헤더를 포함해야 합니다: `anthropic-beta: files-api-2025-04-14`.
</Note>

### 파일 업로드

향후 API 호출에서 참조할 파일을 업로드합니다:

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@/path/to/document.pdf"
```

```python Python
import anthropic

client = anthropic.Anthropic()
client.beta.files.upload(
  file=("document.pdf", open("/path/to/document.pdf", "rb"), "application/pdf"),
)
```

```typescript TypeScript
import Anthropic, { toFile } from '@anthropic-ai/sdk';
import fs from "fs";

const anthropic = new Anthropic();

await anthropic.beta.files.upload({
  file: await toFile(fs.createReadStream('/path/to/document.pdf'), undefined, { type: 'application/pdf' })
}, {
  betas: ['files-api-2025-04-14']
});
```
</CodeGroup>

파일 업로드 응답에는 다음이 포함됩니다:

```json
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "type": "file",
  "filename": "document.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 1024000,
  "created_at": "2025-01-01T00:00:00Z",
  "downloadable": false
}
```

### 메시지에서 파일 사용

업로드한 후 `file_id`를 사용하여 파일을 참조합니다:

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/messages \
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
            "type": "text",
            "text": "Please summarize this document for me."          
          },
          {
            "type": "document",
            "source": {
              "type": "file",
              "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
            }
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please summarize this document for me."
                },
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
                    }
                }
            ]
        }
    ],
    betas=["files-api-2025-04-14"],
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please summarize this document for me."
        },
        {
          type: "document",
          source: {
            type: "file",
            file_id: "file_011CNha8iCJcU1wXNR6q4V8w"
          }
        }
      ]
    }
  ],
  betas: ["files-api-2025-04-14"],
});

console.log(response);
```
</CodeGroup>

### 파일 유형 및 콘텐츠 블록

Files API는 다양한 콘텐츠 블록 유형에 해당하는 다양한 파일 유형을 지원합니다:

| 파일 유형 | MIME 유형 | 콘텐츠 블록 유형 | 사용 사례 |
| :--- | :--- | :--- | :--- |
| PDF | `application/pdf` | `document` | 텍스트 분석, 문서 처리 |
| 일반 텍스트 | `text/plain` | `document` | 텍스트 분석, 처리 |
| 이미지 | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | `image` | 이미지 분석, 시각적 작업 |
| [데이터 세트, 기타](/docs/ko/agents-and-tools/tool-use/code-execution-tool#supported-file-types) | 다양함 | `container_upload` | 데이터 분석, 시각화 생성  |

### 다른 파일 형식으로 작업

`document` 블록으로 지원되지 않는 파일 유형(.csv, .txt, .md, .docx, .xlsx)의 경우 파일을 일반 텍스트로 변환하고 콘텐츠를 메시지에 직접 포함합니다:

<CodeGroup>
```bash Shell
# 예: 텍스트 파일을 읽고 일반 텍스트로 전송
# 참고: 특수 문자가 있는 파일의 경우 base64 인코딩을 고려하세요
TEXT_CONTENT=$(cat document.txt | jq -Rs .)

curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @- <<EOF
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Here's the document content:\n\n${TEXT_CONTENT}\n\nPlease summarize this document."
        }
      ]
    }
  ]
}
EOF
```

```python Python
import pandas as pd
import anthropic

client = anthropic.Anthropic()

# 예: CSV 파일 읽기
df = pd.read_csv('data.csv')
csv_content = df.to_string()

# 메시지에서 일반 텍스트로 전송
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Here's the CSV data:\n\n{csv_content}\n\nPlease analyze this data."
                }
            ]
        }
    ]
)

print(response.content[0].text)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function analyzeDocument() {
  // 예: 텍스트 파일 읽기
  const textContent = fs.readFileSync('document.txt', 'utf-8');

  // 메시지에서 일반 텍스트로 전송
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Here's the document content:\n\n${textContent}\n\nPlease summarize this document.`
          }
        ]
      }
    ]
  });

  console.log(response.content[0].text);
}

analyzeDocument();
```
</CodeGroup>

<Note>
이미지가 포함된 .docx 파일의 경우 먼저 PDF 형식으로 변환한 후 [PDF 지원](/docs/ko/build-with-claude/pdf-support)을 사용하여 기본 제공 이미지 파싱을 활용합니다. 이를 통해 PDF 문서의 인용을 사용할 수 있습니다.
</Note>

#### 문서 블록

PDF 및 텍스트 파일의 경우 `document` 콘텐츠 블록을 사용합니다:

```json
{
  "type": "document",
  "source": {
    "type": "file",
    "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
  },
  "title": "Document Title", // 선택 사항
  "context": "Context about the document", // 선택 사항  
  "citations": {"enabled": true} // 선택 사항, 인용 활성화
}
```

#### 이미지 블록

이미지의 경우 `image` 콘텐츠 블록을 사용합니다:

```json
{
  "type": "image",
  "source": {
    "type": "file",
    "file_id": "file_011CPMxVD3fHLUhvTqtsQA5w"
  }
}
```

### 파일 관리

#### 파일 목록 조회

업로드한 파일 목록을 검색합니다:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
files = client.beta.files.list()
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const files = await anthropic.beta.files.list({
  betas: ['files-api-2025-04-14'],
});
```
</CodeGroup>

#### 파일 메타데이터 가져오기

특정 파일에 대한 정보를 검색합니다:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
file = client.beta.files.retrieve_metadata("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const file = await anthropic.beta.files.retrieveMetadata(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

#### 파일 삭제

작업 공간에서 파일을 제거합니다:

<CodeGroup>
```bash Shell
curl -X DELETE https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
result = client.beta.files.delete("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const result = await anthropic.beta.files.delete(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

### 파일 다운로드

스킬 또는 코드 실행 도구에서 생성된 파일을 다운로드합니다:

<CodeGroup>
```bash Shell
curl -X GET "https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output downloaded_file.txt
```

```python Python
import anthropic

client = anthropic.Anthropic()
file_content = client.beta.files.download("file_011CNha8iCJcU1wXNR6q4V8w")

# 파일에 저장
with open("downloaded_file.txt", "w") as f:
    f.write(file_content.decode('utf-8'))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

const fileContent = await anthropic.beta.files.download(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);

// 파일에 저장
fs.writeFileSync("downloaded_file.txt", fileContent);
```
</CodeGroup>

<Note>
[스킬](/docs/ko/build-with-claude/skills-guide) 또는 [코드 실행 도구](/docs/ko/agents-and-tools/tool-use/code-execution-tool)에서 생성된 파일만 다운로드할 수 있습니다. 업로드한 파일은 다운로드할 수 없습니다.
</Note>

---

## 파일 스토리지 및 제한

### 스토리지 제한

- **최대 파일 크기:** 파일당 500 MB
- **총 스토리지:** 조직당 100 GB

### 파일 수명 주기

- 파일은 API 키의 작업 공간으로 범위가 지정됩니다. 다른 API 키는 동일한 작업 공간과 연결된 다른 API 키에서 생성한 파일을 사용할 수 있습니다
- 파일은 삭제할 때까지 유지됩니다
- 삭제된 파일은 복구할 수 없습니다
- 파일은 삭제 직후 API를 통해 액세스할 수 없지만, 활성 `Messages` API 호출 및 관련 도구 사용에서 지속될 수 있습니다
- 사용자가 삭제한 파일은 [데이터 보존 정책](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data)에 따라 삭제됩니다.

---

## 오류 처리

Files API를 사용할 때 발생하는 일반적인 오류는 다음과 같습니다:

- **파일을 찾을 수 없음(404):** 지정된 `file_id`가 존재하지 않거나 액세스 권한이 없습니다
- **잘못된 파일 유형(400):** 파일 유형이 콘텐츠 블록 유형과 일치하지 않습니다(예: 문서 블록에서 이미지 파일 사용)
- **컨텍스트 윈도우 크기 초과(400):** 파일이 컨텍스트 윈도우 크기보다 큽니다(예: `/v1/messages` 요청에서 500 MB 일반 텍스트 파일 사용)
- **잘못된 파일명(400):** 파일명이 길이 요구 사항(1-255자)을 충족하지 않거나 금지된 문자(`<`, `>`, `:`, `"`, `|`, `?`, `*`, `\`, `/` 또는 유니코드 문자 0-31)를 포함합니다
- **파일이 너무 큼(413):** 파일이 500 MB 제한을 초과합니다
- **스토리지 제한 초과(403):** 조직이 100 GB 스토리지 제한에 도달했습니다

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "File not found: file_011CNha8iCJcU1wXNR6q4V8w"
  }
}
```

## 사용 및 청구

File API 작업은 **무료**입니다:
- 파일 업로드
- 파일 다운로드
- 파일 목록 조회
- 파일 메타데이터 가져오기  
- 파일 삭제

`Messages` 요청에서 사용되는 파일 콘텐츠는 입력 토큰으로 청구됩니다. [스킬](/docs/ko/build-with-claude/skills-guide) 또는 [코드 실행 도구](/docs/ko/agents-and-tools/tool-use/code-execution-tool)에서 생성된 파일만 다운로드할 수 있습니다.

### 속도 제한

베타 기간 동안:
- 파일 관련 API 호출은 분당 약 100개 요청으로 제한됩니다
- 사용 사례에 대해 더 높은 제한이 필요한 경우 [문의하세요](mailto:sales@anthropic.com)