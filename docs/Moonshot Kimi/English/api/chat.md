文档

API 接口说明

Chat

# 基本信息

## 

```text
https://api.moonshot.cn
```

Moonshot 提供基于 HTTP 的 API 服务接入，并且对大部分 API，我们兼容了 OpenAI SDK。

# 快速开始

## 

OpenAI 官方 SDK 支持 [Python (opens in a new tab)](https://github.com/openai/openai-python) 和 [Node.js (opens in a new tab)](https://github.com/openai/openai-node) 两种语言，使用 OpenAI SDK 和 Curl 与 API 进行交互的代码如下：

```python
from openai import OpenAI

client =OpenAI(
    api_key ="$MOONSHOT_API_KEY",
    base_url ="https://api.moonshot.cn/v1",
)

completion = client.chat.completions.create(
    model ="kimi-k2-turbo-preview",
    messages = [
        {"role": "system", "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"},
        {"role": "user", "content": "你好，我叫李雷，1+1等于多少？"}
    ],
    temperature =0.6,
)

print(completion.choices[0].message.content)
```

其中 $MOONSHOT\_API\_KEY 需要替换为您在平台上创建的 API Key。

使用 OpenAI SDK 时运行文档中的代码时，需要保证 Python 版本至少为 3.7.1，Node.js 版本至少为 18，OpenAI SDK 版本不低于 1.0.0。

```bash
pipinstall--upgrade'openai>=1.0'
```

> 我们可以这样简单检验下自己库的版本：
>
> ```bash
> python-c'import openai; print("version =",openai.__version__)'
> # 输出可能是 version = 1.10.0，表示当前 python 实际使用了 openai 的 v1.10.0 的库
> ```

## 

上面的单轮对话的例子中语言模型将用户信息列表作为输入，并将模型生成的信息作为输出返回。
有时我们也可以将模型输出的结果继续作为输入的一部分以实现多轮对话，下面是一组简单的实现多轮对话的例子：

```python
from openai import OpenAI

client =OpenAI(
    api_key ="$MOONSHOT_API_KEY",
    base_url ="https://api.moonshot.cn/v1",
)

history = [
{"role":"system","content":"你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"}
]

defchat(query,history):
    history.append({
"role": "user", 
"content": query
    })
    completion = client.chat.completions.create(
        model="kimi-k2-turbo-preview",
        messages=history,
        temperature=0.6,
    )
    result = completion.choices[0].message.content
    history.append({
"role": "assistant",
"content": result
    })
return result

print(chat("地球的自转周期是多少？", history))
print(chat("月球呢？", history))
```

值得注意的是，随着对话的进行，模型每次需要传入的 token 都会线性增加，必要时，需要一些策略进行优化，例如只保留最近几轮对话。

# API 说明

## 

### 

```text
POST https://api.moonshot.cn/v1/chat/completions
```

### 

#### 

```json
{
"model":"kimi-k2-turbo-preview",
"messages": [
        {
"role":"system",
"content":"你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"
        },
        { "role":"user","content":"你好，我叫李雷，1+1等于多少？" }
    ],
"temperature":0.6
}
```

#### 

| 字段 | 是否必须 | 说明 | 类型 | 取值 |
| --- | --- | --- | --- | --- |
| messages | required | 包含迄今为止对话的消息列表 | List[Dict] | 这是一个结构体的列表，每个元素类似如下：`{"role": "user", "content": "你好"}` role 只支持 `system`,`user`,`assistant` 其一，content 不得为空 |
| model | required | Model ID, 可以通过 List Models 获取 | string | 目前是 `kimi-k2-0905-preview`, `kimi-k2-0711-preview`, `kimi-k2-turbo-preview`, `kimi-k2-thinking-turbo`, `kimi-k2-thinking`, `moonshot-v1-8k`,`moonshot-v1-32k`,`moonshot-v1-128k`, `moonshot-v1-auto`,`kimi-latest`,`moonshot-v1-8k-vision-preview`,`moonshot-v1-32k-vision-preview`,`moonshot-v1-128k-vision-preview`其一 |
| max\_tokens | optional | 聊天完成时生成的最大 token 数。如果到生成了最大 token 数个结果仍然没有结束，finish reason 会是 "length", 否则会是 "stop" | int | 这个值建议按需给个合理的值，如果不给的话，我们会给一个不错的整数比如 1024。**特别要注意的是**，这个 `max_tokens` 是指您期待我们**返回**的 token 长度，而不是输入 + 输出的总长度。比如对一个 `moonshot-v1-8k` 模型，它的最大输入 + 输出总长度是 8192，当输入 messages 总长度为 4096 的时候，您最多只能设置为 4096，否则我们服务会返回不合法的输入参数（ invalid\_request\_error ），并拒绝回答。如果您希望获得“输入的精确 token 数”，可以使用下面的“计算 Token” API 使用我们的计算器获得计数 |
| temperature | optional | 使用什么采样温度，介于 0 和 1 之间。较高的值（如 0.7）将使输出更加随机，而较低的值（如 0.2）将使其更加集中和确定性。 | float | 设置值域须为 `[0, 1]` ，`moonshot-v1` 系列模型默认为 0.0，`kimi-k2` 系列模型默认为 0.6， `kimi-k2-thinking` 系列模型默认为 1.0。 |
| top\_p | optional | 另一种采样方法，即模型考虑概率质量为 top\_p 的标记的结果。因此，0.1 意味着只考虑概率质量最高的 10% 的标记。一般情况下，我们建议改变这一点或温度，但不建议 同时改变 | float | 默认 1.0 |
| n | optional | 为每条输入消息生成多少个结果 | int | 默认为 1，不得大于 5。特别的，当 temperature 非常小靠近 0 的时候，我们只能返回 1 个结果，如果这个时候 n 已经设置并且 > 1，我们的服务会返回不合法的输入参数(invalid\_request\_error) |
| presence\_penalty | optional | 存在惩罚，介于-2.0到2.0之间的数字。正值会根据新生成的词汇是否出现在文本中来进行惩罚，增加模型讨论新话题的可能性 | float | 默认为 0 |
| frequency\_penalty | optional | 频率惩罚，介于-2.0到2.0之间的数字。正值会根据新生成的词汇在文本中现有的频率来进行惩罚，减少模型一字不差重复同样话语的可能性 | float | 默认为 0 |
| response\_format | optional | 设置为 `{"type": "json_object"}` 可启用 JSON 模式，从而保证模型生成的信息是有效的 JSON。当你将 response\_format 设置为 `{"type": "json_object"}` 时，**你需要在 prompt 中明确地引导模型输出 JSON 格式的内容，并告知模型该 JSON 的具体格式，否则将可能导致不符合预期的结果**。 | object | 默认为 {"type": "text"} |
| stop | optional | 停止词，当全匹配这个（组）词后会停止输出，这个（组）词本身不会输出。最多不能超过 5 个字符串，每个字符串不得超过 32 字节 | String, List[String] | 默认 null |
| stream | optional | 是否流式返回 | bool | 默认 false, 可选 true |

### 

对非 stream 格式的，返回类似如下：

```json
{
"id":"cmpl-04ea926191a14749b7f2c7a48a68abc6",
"object":"chat.completion",
"created":1698999496,
"model":"kimi-k2-turbo-preview",
"choices": [
        {
"index":0,
"message": {
"role":"assistant",
"content":" 你好，李雷！1+1等于2。如果你有其他问题，请随时提问！"
            },
"finish_reason":"stop"
        }
    ],
"usage": {
"prompt_tokens":19,
"completion_tokens":21,
"total_tokens":40,
"cached_tokens":10  # 缓存命中的 token 数量，只有支持自动缓存的模型会返回该字段
    }
}
```

对 stream 格式的，返回类似如下：

```json
data: {"id":"cmpl-1305b94c570f447fbde3180560736287","object":"chat.completion.chunk","created":1698999575,"model":"kimi-k2-turbo-preview","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

data: {"id":"cmpl-1305b94c570f447fbde3180560736287","object":"chat.completion.chunk","created":1698999575,"model":"kimi-k2-turbo-preview","choices":[{"index":0,"delta":{"content":"你好"},"finish_reason":null}]}

...

data: {"id":"cmpl-1305b94c570f447fbde3180560736287","object":"chat.completion.chunk","created":1698999575,"model":"kimi-k2-turbo-preview","choices":[{"index":0,"delta":{"content":"。"},"finish_reason":null}]}

data: {"id":"cmpl-1305b94c570f447fbde3180560736287","object":"chat.completion.chunk","created":1698999575,"model":"kimi-k2-turbo-preview","choices":[{"index":0,"delta":{},"finish_reason":"stop","usage":{"prompt_tokens":19,"completion_tokens":13,"total_tokens":32}}]}

data: [DONE]
```

### 

对简单调用，见前面。对流式调用，可以参考如下代码片段：

```python
from openai import OpenAI

client =OpenAI(
    api_key ="$MOONSHOT_API_KEY",
    base_url ="https://api.moonshot.cn/v1",
)

response = client.chat.completions.create(
    model="kimi-k2-turbo-preview",
    messages=[
        {
"role": "system",
"content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。",
        },
        {"role": "user", "content": "你好，我叫李雷，1+1等于多少？"},
    ],
    temperature=0.6,
    stream=True,
)

collected_messages = []
for idx, chunk inenumerate(response):
# print("Chunk received, value: ", chunk)
    chunk_message = chunk.choices[0].delta
ifnot chunk_message.content:
continue
    collected_messages.append(chunk_message)# save the message
print(f"#{idx}: {''.join([m.content for m in collected_messages])}")
print(f"Full conversation received: {''.join([m.content for m in collected_messages])}")
```

### 

#### 

```json
{
"model":"moonshot-v1-8k-vision-preview",
"messages":
    [
        {
"role":"system",
"content":"你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"
        },
        {
"role":"user",
"content":
            [
                {
"type":"image_url",
"image_url":
                    {
"url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABhCAYAAAApxKSdAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAUUSURBVHgB7Z29bhtHFIWPHQN2J7lKqnhYpYvpIukCbJEAKQJEegLReYFIT0DrCSI9QEDqCSIDaQIEIOukiJwyza5SJWlId3FFz+HuGmuSSw6p+dlZ3g84luhdUeI9M3fmziyXgBCUe/DHYY0Wj/tgWmjV42zFcWe4MIBBPNJ6qqW0uvAbXFvQgKzQK62bQhkaCIPc10q1Zi3XH1o/IG9cwUm0RogrgDY1KmLgHYX9DvyiBvDYI77XmiD+oLlQHw7hIDoCMBOt1U9w0BsU9mOAtaUUFk3oQoIfzAQFCf5dNMEdTFCQ4NtQih1NSIGgf3ibxOJt5UrAB1gNK72vIdjiI61HWr+YnNxDXK0rJiULsV65GJeiIescLSTTeobKSutiCuojX8kU3MBx4I3WeNVBBRl4fWiCyoB8v2JAAkk9PmDwT8sH1TEghRjgC27scCx41wO43KAg+ILxTvhNaUACwTc04Z0B30LwzTzm5Rjw3sgseIG1wGMawMBPIOQcqvzrNIMHOg9Q5KK953O90/rFC+BhJRH8PQZ+fu7SjC7HAIV95yu99vjlxfvBJx8nwHd6IfNJAkccOjHg6OgIs9lsra6vr2GTNE03/k7q8HAhyJ/2gM9O65/4kT7/mwEcoZwYsPQiV3BwcABb9Ho9KKU2njccDjGdLlxx+InBBPBAAR86ydRPaIC9SASi3+8bnXd+fr78nw8NJ39uDJjXAVFPP7dp/VmWLR9g6w6Huo/IOTk5MTpvZesn/93AiP/dXCwd9SyILT9Jko3n1bZ+8s8rGPGvoVHbEXcPMM39V1dX9Qd/19PPNxta959D4HUGF0RrAFs/8/8mxuPxXLUwtfx2WX+cxdivZ3DFA0SKldZPuPTAKrikbOlMOX+9zFu/Q2iAQoSY5H7mfeb/tXCT8MdneU9wNNCuQUXZA0ynnrUznyqOcrspUY4BJunHqPU3gOgMsNr6G0B0BpgUXrG0fhKVAaaF1/HxMWIhKgNMcj9Tz82Nk6rVGdav/tJ5eraJ0Wi01XPq1r/xOS8uLkJc6XYnRTMNXdf62eIvLy+jyftVghnQ7Xahe8FW59fBTRYOzosDNI1hJdz0lBQkBflkMBjMU5iL13pXRb8fYAJrB/a2db0oFHthAOEUliaYFHE+aaUBdZsvvFhApyM0idYZwOCvW4JmIWdSzPmidQaYrAGZ7iX4oFUGnJ2dGdUCTRqMozeANQCLsE6nA10JG/0Mx4KmDMbBCjEWR2yxu8LAM98vXelmCA2ovVLCI8EMYODWbpbvCXtTBzQVMSAwYkBgxIDAtNKAXWdGIRADAiMpKDA0IIMQikx6QGDEgMCIAYGRMSAsMgaEhgbcQgjFa+kBYZnIGBCWWzEgLPNBOJ6Fk/aR8Y5ZCvktKwX/PJZ7xoVjfs+4chYU11tK2sE85qUBLyH4Zh5z6QHhGPOf6r2j+TEbcgdFP2RaHX5TrYQlDflj5RXE5Q1cG/lWnhYpReUGKdUewGnRmhvnCJbgmxey8sHiZ8iwF3AsUBBckKHI/SWLq6HsBc8huML4DiK80D6WnBqLzN68UFCmopheYJOVYgcU5FOVbAVfYUcUZGoaLPglCtITdg2+tZUFBTFh2+ArWEYh/7z0WIIQSiM43lt5AWAmWhLHylN4QmkNEXfAbGqEQKsHSfHLYwiSq8AnaAAKeaW3D8VbijwNW5nh3IN9FPI/jnpaPKZi2/SfFuJu4W3x9RqWL+N5C+7ruKpBAgLkAAAAAElFTkSuQmCC"
                    }
                },
                {
"type":"text",
"text":"请描述这个图片"
                }
            ]
        }
    ],
"temperature":0.6
}
```

#### 

当使用 Vision 模型时，`message.content` 字段将由 `str` 变更为 `List[Object[str, any]]`，其中，`List` 中每个元素的字段说明如下：

| 参数名称 | 是否必须 | 说明 | 类型 |
| --- | --- | --- | --- |
| type | required | 仅支持文本类型(text)或图片类型(image\_url) | string |
| image\_url | required | 用于传输图片的对象 | Dict[str, any] |

其中，`image_url` 参数的字段说明如下：

| 参数名称 | 是否必须 | 说明 | 类型 |
| --- | --- | --- | --- |
| url | required | 使用 base64 编码的图片内容 | string |

#### 

```python
import os
import base64

from openai import OpenAI

client =OpenAI(
    api_key = os.environ.get("MOONSHOT_API_KEY"), 
    base_url ="https://api.moonshot.cn/v1"，
)

# 对图片进行base64编码
withopen("您的图片地址", 'rb')as f:
    img_base = base64.b64encode(f.read()).decode('utf-8')

response = client.chat.completions.create(
    model="moonshot-v1-8k-vision-preview", 
    messages=[
        {
"role": "user",
"content": [
                {
"type": "image_url",
"image_url": {
"url": f"data:image/jpeg;base64,{img_base}"
                    }
                },
                {
"type": "text",
"text": "请描述这个图片"
                }
            ]
        }
    ]
)
print(response.choices[0].message.content)
```

## 

### 

```text
GET https://api.moonshot.cn/v1/models
```

### 

```python
from openai import OpenAI

client =OpenAI(
    api_key ="$MOONSHOT_API_KEY",
    base_url ="https://api.moonshot.cn/v1",
)

model_list = client.models.list()
model_data = model_list.data

for i, model inenumerate(model_data):
print(f"model[{i}]:", model.id)
```

## 

以下是一组错误返回的例子：

```text
{
    "error": {
        "type": "content_filter",
        "message": "The request was rejected because it was considered high risk"
    }
}
```

下面是主要错误的说明：

| HTTP Status Code | error type | error message | 详细描述 |
| --- | --- | --- | --- |
| 400 | content\_filter | The request was rejected because it was considered high risk | 内容审查拒绝，您的输入或生成内容可能包含不安全或敏感内容，请您避免输入易产生敏感内容的提示语，谢谢 |
| 400 | invalid\_request\_error | Invalid request: {error\_details} | 请求无效，通常是您请求格式错误或者缺少必要参数，请检查后重试 |
| 400 | invalid\_request\_error | Input token length too long | 请求中的 tokens 长度过长，请求不要超过模型 tokens 的最长限制 |
| 400 | invalid\_request\_error | Your request exceeded model token limit : {max\_model\_length} | 请求的 tokens 数和设置的 max\_tokens 加和超过了模型规格长度，请检查请求体的规格或选择合适长度的模型 |
| 400 | invalid\_request\_error | Invalid purpose: only 'file-extract' accepted | 请求中的目的（purpose）不正确，当前只接受 'file-extract'，请修改后重新请求 |
| 400 | invalid\_request\_error | File size is too large, max file size is 100MB, please confirm and re-upload the file | 上传的文件大小超过了限制，请重新上传 |
| 400 | invalid\_request\_error | File size is zero, please confirm and re-upload the file | 上传的文件大小为 0，请重新上传 |
| 400 | invalid\_request\_error | The number of files you have uploaded exceeded the max file count {max\_file\_count}, please delete previous uploaded files | 上传的文件总数超限，请删除不用的早期的文件后重新上传 |
| 401 | invalid\_authentication\_error | Invalid Authentication | 鉴权失败，请检查 apikey 是否正确，请修改后重试 |
| 401 | incorrect\_api\_key\_error | Incorrect API key provided | 鉴权失败，请检查 apikey 是否提供以及 apikey 是否正确，请修改后重试 |
| 429 | exceeded\_current\_quota\_error | Your account {organization-id}<{ak-id}> is suspended, please check your plan and billing details | 账户余额不足，已停用，请检查您的账户余额 |
| 403 | permission\_denied\_error | The API you are accessing is not open | 访问的 API 暂未开放 |
| 403 | permission\_denied\_error | You are not allowed to get other user info | 访问其他用户信息的行为不被允许，请检查 |
| 404 | resource\_not\_found\_error | Not found the model {model-id} or Permission denied | 不存在此模型或者没有授权访问此模型，请检查后重试 |
| 429 | engine\_overloaded\_error | The engine is currently overloaded, please try again later | 当前并发请求过多，节点限流中，请稍后重试；建议充值升级 tier，享受更丝滑的体验 |
| 429 | exceeded\_current\_quota\_error | You exceeded your current token quota: <{organization\_id}> {token\_credit}, please check your account balance | 账户额度不足，请检查账户余额，保证账户余额可匹配您 tokens 的消耗费用后重试 |
| 429 | rate\_limit\_reached\_error | Your account {organization-id}<{ak-id}> request reached organization max concurrency: {Concurrency}, please try again after {time} seconds | 请求触发了账户并发个数的限制，请等待指定时间后重试 |
| 429 | rate\_limit\_reached\_error | Your account {organization-id}<{ak-id}> request reached organization max RPM: {RPM}, please try again after {time} seconds | 请求触发了账户 RPM 速率限制，请等待指定时间后重试 |
| 429 | rate\_limit\_reached\_error | Your account {organization-id}<{ak-id}> request reached organization TPM rate limit, current:{current\_tpm}, limit:{max\_tpm} | 请求触发了账户 TPM 速率限制，请等待指定时间后重试 |
| 429 | rate\_limit\_reached\_error | Your account {organization-id}<{ak-id}> request reached organization TPD rate limit, current:{current\_tpd}, limit:{max\_tpd} | 请求触发了账户 TPD 速率限制，请等待指定时间后重试 |
| 500 | server\_error | Failed to extract file: {error} | 解析文件失败，请重试 |
| 500 | unexpected\_output | invalid state transition | 内部错误，请联系管理员 |

Last updated on 2025年12月11日

[使用手册](/docs/introduction "使用手册")[Tool Use](/docs/api/tool-use "Tool Use")