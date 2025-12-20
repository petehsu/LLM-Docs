# Messages

> Messages API 是与 Claude 模型交互的核心接口。发送消息并接收 AI 生成的响应,支持对话、工具使用和视觉。

## 基本用法

<CodeGroup>
  ```python Python theme={null}
  from anthropic import Anthropic

  client = Anthropic(
      base_url="https://ai.megallm.io",
      api_key="your-api-key"
  )

  message = client.messages.create(
      model="claude-3.5-sonnet",
      max_tokens=100,
      messages=[
          {
              "role": "user",
              "content": "What are the primary colors?"
          }
      ]
  )

  print(message.content[0].text)
  ```

  ```javascript JavaScript theme={null}
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic({
    baseURL: 'https://ai.megallm.io',
    apiKey: process.env.MEGALLM_API_KEY,
  });

  const message = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: 'What are the primary colors?'
      }
    ]
  });

  console.log(message.content[0].text);
  ```

  ```bash cURL theme={null}
  curl https://ai.megallm.io/v1/messages \
    -H "x-api-key: $MEGALLM_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-3-sonnet-20240229",
      "max_tokens": 100,
      "messages": [
        {
          "role": "user",
          "content": "What are the primary colors?"
        }
      ]
    }'
  ```

  ```ruby Ruby theme={null}
  require 'anthropic'

  client = Anthropic::Client.new(
    base_url: 'https://ai.megallm.io',
    api_key: ENV['MEGALLM_API_KEY']
  )

  message = client.messages.create(
    model: 'claude-3-sonnet-20240229',
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: 'What are the primary colors?'
      }
    ]
  )

  puts message.content.first.text
  ```
</CodeGroup>

## 消息结构

### 内容类型

消息可以包含不同类型的内容:

```python  theme={null}
# 简单的文本消息
message = {
    "role": "user",
    "content": "Hello, Claude!"
}

# 包含文本和图像的多部分消息
message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "What's in this image?"
        },
        {
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/jpeg",
                "data": "base64_encoded_image_data"
            }
        }
    ]
}
```

### 系统消息

系统消息设置助手的行为:

```python  theme={null}
message = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=200,
    system="""您是一位乐于助人的编码助手。
    在解释概念时始终提供代码示例。
    除非另有说明,否则使用 Python。""",
    messages=[
        {
            "role": "user",
            "content": "Explain list comprehensions"
        }
    ]
)
```

## 高级功能

### 多轮对话

构建上下文感知的对话:

```python  theme={null}
class Conversation:
    def __init__(self, client, model="claude-3-sonnet-20240229"):
        self.client = client
        self.model = model
        self.messages = []
        self.system = "You are a helpful assistant."

    def add_user_message(self, content):
        self.messages.append({"role": "user", "content": content})

    def get_response(self, max_tokens=200):
        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            system=self.system,
            messages=self.messages
        )

        assistant_content = response.content[0].text
        self.messages.append({"role": "assistant", "content": assistant_content})

        return assistant_content

# 使用示例
conv = Conversation(client)
conv.system = "You are a math tutor."

print(conv.get_response("What is calculus?"))
print(conv.get_response("Can you give me an example?"))
print(conv.get_response("How is it different from algebra?"))
```

### 预填充响应

指导助手的响应格式:

```python  theme={null}
messages = [
    {"role": "user", "content": "Write a haiku about programming"},
    {"role": "assistant", "content": "Here's a haiku about programming:\n\n"}  # 预填充
]

response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=50,
    messages=messages
)

# 响应将从预填充的内容继续
```

### 令牌计数

在发送之前估计令牌使用量:

```python  theme={null}
def estimate_tokens(messages):
    """令牌数量的粗略估计"""
    total = 0
    for message in messages:
        if isinstance(message["content"], str):
            # 粗略估计: 1 个令牌 ≈ 4 个字符
            total += len(message["content"]) // 4
        elif isinstance(message["content"], list):
            for part in message["content"]:
                if part["type"] == "text":
                    total += len(part["text"]) // 4
    return total

# 发送前检查
token_estimate = estimate_tokens(messages)
if token_estimate > 180000:  # 为响应留出空间
    print("Warning: Approaching context limit")
```

## 响应处理

### 解析响应内容

```python  theme={null}
response = client.messages.create(...)

# 处理不同的内容类型
for content_block in response.content:
    if content_block.type == "text":
        print(f"Text: {content_block.text}")
    elif content_block.type == "tool_use":
        print(f"Tool call: {content_block.name}")
        print(f"Arguments: {content_block.input}")
```

### 错误处理

```python  theme={null}
from anthropic import APIError, RateLimitError, APIConnectionError

def safe_message_create(client, **kwargs):
    max_retries = 3
    retry_delay = 1

    for attempt in range(max_retries):
        try:
            return client.messages.create(**kwargs)

        except RateLimitError as e:
            if attempt < max_retries - 1:
                time.sleep(retry_delay * (2 ** attempt))
                continue
            raise e

        except APIConnectionError as e:
            print(f"Connection error: {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
                continue
            raise e

        except APIError as e:
            print(f"API error: {e}")
            raise e
```

## 常见模式

### 结构化数据提取

```python  theme={null}
def extract_information(text):
    response = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=300,
        system="提取信息并以 JSON 格式返回。",
        messages=[
            {
                "role": "user",
                "content": f"""从这段文本中提取以下内容:
                - 名称 (列表)
                - 日期 (列表)
                - 位置 (列表)
                - 关键事实 (列表)

                以 JSON 格式返回。

                文本: {text}"""
            }
        ],
        temperature=0  # 一致的格式
    )

    import json
    return json.loads(response.content[0].text)
```

### 翻译

```python  theme={null}
def translate(text, target_language="Spanish"):
    response = client.messages.create(
        model="claude-3.5-sonnet",  # 快速翻译模型
        max_tokens=500,
        messages=[
            {
                "role": "user",
                "content": f"Translate to {target_language}:\n\n{text}"
            }
        ],
        temperature=0.3
    )
    return response.content[0].text
```

### 摘要

```python  theme={null}
def summarize(text, style="bullet_points"):
    styles = {
        "bullet_points": "创建要点摘要",
        "paragraph": "编写简洁的段落摘要",
        "executive": "编写执行摘要",
        "eli5": "用简单的语言解释"
    }

    response = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=300,
        system="您是一位专业的摘要员。",
        messages=[
            {
                "role": "user",
                "content": f"{styles.get(style, styles['bullet_points'])}:\n\n{text}"
            }
        ],
        temperature=0.3
    )
    return response.content[0].text
```

## 最佳实践

<Tip>
  **令牌效率**: Claude 模型具有大的上下文窗口,但在提示中简洁可以节省令牌并提高响应时间。
</Tip>

### 1. 清晰的指令

````python  theme={null}
# 好的 - 清晰而具体
messages = [{
    "role": "user",
    "content": """分析这段 Python 代码:
    1. 识别任何错误
    2. 建议性能改进
    3. 评估代码质量 (1-10)

    代码:
    ```python
    def fibonacci(n):
        if n <= 1:
            return n
        return fibonacci(n-1) + fibonacci(n-2)
    ```"""
}]

# 不太有效 - 模糊
messages = [{
    "role": "user",
    "content": "Look at this fibonacci function and tell me about it"
}]
````

### 2. 温度设置

```python  theme={null}
# 事实性/分析性任务
response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=200,
    temperature=0,  # 确定性的
    messages=messages
)

# 创意任务
response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=200,
    temperature=0.8,  # 更有创造性
    messages=messages
)
```

### 3. 模型选择

| 使用场景 | 推荐模型            | 原因     |
| ---- | --------------- | ------ |
| 复杂分析 | claude-3-opus   | 最佳推理能力 |
| 常规任务 | claude-3-sonnet | 平衡性能   |
| 大量请求 | claude-3-haiku  | 快速高效   |
| 代码生成 | claude-3-sonnet | 良好平衡   |

## 速率限制

实施适当的速率限制:

```python  theme={null}
from threading import Lock
from collections import deque
import time

class RateLimiter:
    def __init__(self, max_requests=50, window=60):
        self.max_requests = max_requests
        self.window = window
        self.requests = deque()
        self.lock = Lock()

    def wait_if_needed(self):
        with self.lock:
            now = time.time()
            # 移除旧请求
            while self.requests and self.requests[0] < now - self.window:
                self.requests.popleft()

            if len(self.requests) >= self.max_requests:
                sleep_time = self.window - (now - self.requests[0])
                if sleep_time > 0:
                    time.sleep(sleep_time)
                    return self.wait_if_needed()

            self.requests.append(now)

# 使用示例
rate_limiter = RateLimiter(max_requests=50, window=60)

def create_message(**kwargs):
    rate_limiter.wait_if_needed()
    return client.messages.create(**kwargs)
```

## 下一步

* 了解[工具使用](/cn/anthropic/tool-use)以进行函数调用
* 探索[视觉](/cn/anthropic/vision)功能
* 实现[流式传输](/cn/anthropic/streaming)以获得实时响应


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt