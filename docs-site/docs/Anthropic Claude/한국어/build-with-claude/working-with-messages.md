# Messages API 사용하기

Messages API를 효과적으로 사용하기 위한 실용적인 패턴과 예제

---

이 가이드는 기본 요청, 다중 턴 대화, 프리필 기법, 비전 기능을 포함하여 Messages API로 작업하기 위한 일반적인 패턴을 다룹니다. 완전한 API 사양은 [Messages API 참조](/docs/ko/api/messages)를 참조하세요.

## 기본 요청 및 응답

<CodeGroup>
  ```bash Shell
  #!/bin/sh
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 1024,
      "messages": [
          {"role": "user", "content": "Hello, Claude"}
      ]
  }'
  ```

  ```python Python
  import anthropic

  message = anthropic.Anthropic().messages.create(
      model="claude-sonnet-4-5",
      max_tokens=1024,
      messages=[
          {"role": "user", "content": "Hello, Claude"}
      ]
  )
  print(message)
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {"role": "user", "content": "Hello, Claude"}
    ]
  });
  console.log(message);
  ```
</CodeGroup>

```json JSON
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello!"
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 12,
    "output_tokens": 6
  }
}
```

## 여러 대화 턴

Messages API는 상태 비저장이므로 항상 전체 대화 기록을 API에 전송합니다. 이 패턴을 사용하여 시간이 지남에 따라 대화를 구축할 수 있습니다. 이전 대화 턴이 반드시 Claude에서 실제로 시작될 필요는 없습니다. 합성 `assistant` 메시지를 사용할 수 있습니다.

<CodeGroup>
```bash Shell
#!/bin/sh
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {"role": "user", "content": "Hello, Claude"},
        {"role": "assistant", "content": "Hello!"},
        {"role": "user", "content": "Can you describe LLMs to me?"}

    ]
}'
```

```python Python
import anthropic

message = anthropic.Anthropic().messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"},
        {"role": "assistant", "content": "Hello!"},
        {"role": "user", "content": "Can you describe LLMs to me?"}
    ],
)
print(message)

```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    {"role": "user", "content": "Hello, Claude"},
    {"role": "assistant", "content": "Hello!"},
    {"role": "user", "content": "Can you describe LLMs to me?"}
  ]
});
```
</CodeGroup>

```json JSON
{
    "id": "msg_018gCsTGsXkYJVqYPxTgDHBU",
    "type": "message",
    "role": "assistant",
    "content": [
        {
            "type": "text",
            "text": "Sure, I'd be happy to provide..."
        }
    ],
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 30,
      "output_tokens": 309
    }
}
```

## Claude의 입에 말을 넣기

입력 메시지 목록의 마지막 위치에서 Claude의 응답 일부를 미리 채울 수 있습니다. 이를 사용하여 Claude의 응답을 형성할 수 있습니다. 아래 예제는 `"max_tokens": 1`을 사용하여 Claude에서 단일 객관식 답변을 얻습니다.

<CodeGroup>
  ```bash Shell
  #!/bin/sh
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 1,
      "messages": [
          {"role": "user", "content": "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"},
          {"role": "assistant", "content": "The answer is ("}
      ]
  }'
  ```

  ```python Python
  import anthropic

  message = anthropic.Anthropic().messages.create(
      model="claude-sonnet-4-5",
      max_tokens=1,
      messages=[
          {"role": "user", "content": "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"},
          {"role": "assistant", "content": "The answer is ("}
      ]
  )
  print(message)
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1,
    messages: [
      {"role": "user", "content": "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"},
      {"role": "assistant", "content": "The answer is ("}
    ]
  });
  console.log(message);
  ```
</CodeGroup>

```json JSON
{
  "id": "msg_01Q8Faay6S7QPTvEUUQARt7h",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "C"
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "max_tokens",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 42,
    "output_tokens": 1
  }
}
```

프리필 기법에 대한 자세한 정보는 [프리필 가이드](/docs/ko/build-with-claude/prompt-engineering/prefill-claudes-response)를 참조하세요.

## 비전

Claude는 요청에서 텍스트와 이미지를 모두 읽을 수 있습니다. 이미지에 대해 `base64` 및 `url` 소스 유형을 모두 지원하며, `image/jpeg`, `image/png`, `image/gif` 및 `image/webp` 미디어 유형을 지원합니다. 자세한 내용은 [비전 가이드](/docs/ko/build-with-claude/vision)를 참조하세요.

<CodeGroup>
  ```bash Shell
  #!/bin/sh

  # Option 1: Base64-encoded image
  IMAGE_URL="https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
  IMAGE_MEDIA_TYPE="image/jpeg"
  IMAGE_BASE64=$(curl "$IMAGE_URL" | base64)

  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 1024,
      "messages": [
          {"role": "user", "content": [
              {"type": "image", "source": {
                  "type": "base64",
                  "media_type": "'$IMAGE_MEDIA_TYPE'",
                  "data": "'$IMAGE_BASE64'"
              }},
              {"type": "text", "text": "What is in the above image?"}
          ]}
      ]
  }'

  # Option 2: URL-referenced image
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 1024,
      "messages": [
          {"role": "user", "content": [
              {"type": "image", "source": {
                  "type": "url",
                  "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
              }},
              {"type": "text", "text": "What is in the above image?"}
          ]}
      ]
  }'
  ```

  ```python Python
  import anthropic
  import base64
  import httpx

  # Option 1: Base64-encoded image
  image_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
  image_media_type = "image/jpeg"
  image_data = base64.standard_b64encode(httpx.get(image_url).content).decode("utf-8")

  message = anthropic.Anthropic().messages.create(
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
                          "media_type": image_media_type,
                          "data": image_data,
                      },
                  },
                  {
                      "type": "text",
                      "text": "What is in the above image?"
                  }
              ],
          }
      ],
  )
  print(message)

  # Option 2: URL-referenced image
  message_from_url = anthropic.Anthropic().messages.create(
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
                      "text": "What is in the above image?"
                  }
              ],
          }
      ],
  )
  print(message_from_url)
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  // Option 1: Base64-encoded image
  const image_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
  const image_media_type = "image/jpeg"
  const image_array_buffer = await ((await fetch(image_url)).arrayBuffer());
  const image_data = Buffer.from(image_array_buffer).toString('base64');

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
          {
              "role": "user",
              "content": [
                  {
                      "type": "image",
                      "source": {
                          "type": "base64",
                          "media_type": image_media_type,
                          "data": image_data,
                      },
                  },
                  {
                      "type": "text",
                      "text": "What is in the above image?"
                  }
              ],
          }
        ]
  });
  console.log(message);

  // Option 2: URL-referenced image
  const messageFromUrl = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
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
                      "text": "What is in the above image?"
                  }
              ],
          }
        ]
  });
  console.log(messageFromUrl);
  ```
</CodeGroup>

```json JSON
{
  "id": "msg_01EcyWo6m4hyW8KHs2y2pei5",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "This image shows an ant, specifically a close-up view of an ant. The ant is shown in detail, with its distinct head, antennae, and legs clearly visible. The image is focused on capturing the intricate details and features of the ant, likely taken with a macro lens to get an extreme close-up perspective."
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 1551,
    "output_tokens": 71
  }
}
```

## 도구 사용 및 컴퓨터 사용

Messages API로 도구를 사용하는 방법의 예제는 [가이드](/docs/ko/agents-and-tools/tool-use/overview)를 참조하세요.
Messages API로 데스크톱 컴퓨터 환경을 제어하는 방법의 예제는 [컴퓨터 사용 가이드](/docs/ko/agents-and-tools/tool-use/computer-use-tool)를 참조하세요.
보장된 JSON 출력의 경우 [구조화된 출력](/docs/ko/build-with-claude/structured-outputs)을 참조하세요.