文档

入门指南

JSON Mode 使用说明

# 使用 Kimi API 的 JSON Mode

在某些场景下，我们希望模型能以固定格式的 JSON 文档输出内容，例如当你想总结一篇文章内容时，你可能希望得到这样的结构化数据：

```json
{
"title":"文章标题",
"author":"文章作者",
"publish_time":"发布时间",
"summary":"文章总结"
}
```

如果你直接在提示词 prompt 中告诉 Kimi 大模型：”请输出 JSON 格式的内容“，Kimi 大模型能理解你的诉求，也会按要求生成 JSON 文档，但生成的内容通常会有一些瑕疵，例如在 JSON 文档之外，Kimi 还会额外地输出其他文字内容对 JSON 文档进行解释：

```text
以下是你需要的 JSON 文档

{
	"title": "文章标题",
	"author": "文章作者",
	"publish_time": "发布时间",
	"summary": "文章总结"
}
```

或是输出的 JSON 文档格式有误，无法被正确解析，例如（注意最后一行 `summary` 字段末尾的逗号）：

```text
{
	"title": "文章标题",
	"author": "文章作者",
	"publish_time": "发布时间",
	"summary": "文章总结",
}
```

这样的 JSON 文档是无法被正确解析的，为了能生成符合预期的标准且合法的 JSON 文档，我们提供了 `response_format` 参数，`response_format` 参数默认值为 `{"type": "text"}`，即普通的文本内容，该内容没有任何格式上的约束；你可以将 `response_format` 设置为 `{"type": "json_object"}` 来启用 JSON Mode，Kimi 大模型会按照要求输出一个合法的、可被正确解析的 JSON 文档。

在使用 JSON Mode 时，请遵守以下注意事项：

* 请在提示词 system prompt 或 user prompt 中告知 Kimi 大模型应该生成怎样的 JSON 文档，包括具体的字段名称、字段类型等，最好能提供示例供 Kimi 大模型参考；
* Kimi 大模型只会生成 JSON Object 类型的 JSON 文档，请不要引导 Kimi 大模型生成 JSON Array 或其他类型的 JSON 文档；
* 如果没有正确告知 Kimi 大模型需要输出的 JSON Object 的格式，Kimi 大模型会生成不符合预期的结果；

## 

我们使用一个具体的例子来说明 JSON Mode 的应用：

> 设想一下，我们在构造一个微信智能机器人客服（简称智能客服），智能客服使用 Kimi 大模型来回答客户提出的问题。我们希望智能客服不仅能回复文字消息，还能回复图片、链接卡片、语音等类型的消息；同时，在一次回复中，我们希望可以混合多种类型的消息，例如对于客户的产品咨询类问题，我们既提供文字回复，也提供产品图片，最后再附上购买链接（以链接卡片的形式）。

让我们用代码来演示这个例子中的内容：

```python
import json

from openai import OpenAI

client =OpenAI(
    api_key="MOONSHOT_API_KEY", # 在这里将 MOONSHOT_API_KEY 替换为你从 Kimi 开放平台申请的 API Key
    base_url="https://api.moonshot.cn/v1",
)

system_prompt ="""
你是月之暗面（Kimi）的智能客服，你负责回答用户提出的各种问题。请参考文档内容回复用户的问题，你的回答可以是文字、图片、链接，在一次回复中可以同时包含文字、图片、链接。

请使用如下 JSON 格式输出你的回复：

{
    "text": "文字信息",
    "image": "图片地址",
    "url": "链接地址"
}

注意，请将文字信息放置在 `text` 字段中，将图片以 `oss://` 开头的链接形式放在 `image` 字段中，将普通链接放置在 `url` 字段中。
"""

completion = client.chat.completions.create(
    model="kimi-k2-turbo-preview",
    messages=[
        {"role": "system",
"content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"},
        {"role": "system", "content": system_prompt}, # <-- 将附带输出格式的 system prompt 提交给 Kimi
        {"role": "user", "content": "你好，我叫李雷，1+1等于多少？"}
    ],
    temperature=0.6,
    response_format={"type": "json_object"}, # <-- 使用 response_format 参数指定输出格式为 json_object
)

# 由于我们设置了 JSON Mode，Kimi 大模型返回的 message.content 为序列化后的 JSON Object 字符串，
# 我们使用 json.loads 解析其内容，将其反序列化为 python 中的字典 dict。
content = json.loads(completion.choices[0].message.content)

# 解析文本内容
if"text"in content:
# 为了演示，我们将内容打印出来；
# 在真实的业务逻辑中，你可能需要调用发送文本消息的接口将生成的文本发送给用户。
print("text:", content["text"])

# 解析图片内容
if"image"in content:
# 为了演示，我们将内容打印出来；
# 在真实的业务逻辑中，你可能需要先解析图片地址，下载图片后，调用发送图片消息
# 的接口将图片发送给用户。
print("image:", content["image"])

# 解析链接
if"url"in content:
# 为了演示，我们将内容打印出来；
# 在真实的业务逻辑中，你可能需要调用发送链接卡片的接口，将链接以卡片的形式发送给用户。
print("url:", content["url"])
```

让我们再次回顾一下使用 JSON Mode 的具体步骤：

1. 在 system 或 user prompt 中定义输出 JSON 的格式，**我们推荐的最佳实践是给出具体的输出示例，并解释每个字段的具体含义**；
2. 使用 `response_format` 参数，将其设置为 `{"type": "json_object"}`；
3. 解析 Kimi 大模型返回消息中的 `content`，`message.content` 会是一个合法的被序列化成字符串的 JSON Object；

## 

如果你遇到这样的情况：

> 正确设置了 `response_format` 参数，并且在提示词 prompt 中指定了 JSON 文档的格式，但获取的 JSON 文档不完整或被截断，导致无法正确解析 JSON 文档。

我们建议你检查返回值中的 `finish_reason` 字段是否为 `length`；通常而言，较小的 `max_tokens` 值会导致模型输出内容被截断，在使用 JSON Mode 时也适用这个规则，我们建议你在预估输出的 JSON 文档大小后，设置一个合理的 `max_tokens` 值，以便能正确解析 Kimi 大模型返回的 JSON 文档。

关于 Kimi 大模型输出不完整或被截断问题的更详细说明，请参考：
[常见问题及解决方案](/docs/guide/faq)

Last updated on 2025年11月9日

[使用联网搜索工具](/docs/guide/use-web-search "使用联网搜索工具")[Partial Mode 使用说明](/docs/guide/use-partial-mode-feature-of-kimi-api "Partial Mode 使用说明")