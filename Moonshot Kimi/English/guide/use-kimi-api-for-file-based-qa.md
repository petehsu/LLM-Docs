文档

入门指南

文件问答指南

# 使用 Kimi API 进行文件问答

Kimi 智能助手提供了上传文件、并基于文件进行问答的能力，Kimi API 也提供了相同的实现，下面我们用一个实际例子来讲述如何通过 Kimi API 完成文件上传和文件问答：

```python
from pathlib import Path
from openai import OpenAI

client =OpenAI(
    api_key="MOONSHOT_API_KEY", # 在这里将 MOONSHOT_API_KEY 替换为你从 Kimi 开放平台申请的 API Key
    base_url="https://api.moonshot.cn/v1",
)

# moonshot.pdf 是一个示例文件, 我们支持文本文件和图片文件，对于图片文件，我们提供了 OCR 的能力
# 上传文件时，我们可以直接使用 openai 库的文件上传 API，使用标准库 pathlib 中的 Path 构造文件
# 对象，并将其传入 file 参数即可，同时将 purpose 参数设置为 file-extract；注意，目前文件上传
# 接口仅支持 file-extract 一种 purpose 值。
file_object = client.files.create(file=Path("moonshot.pdf"), purpose="file-extract")

# 获取结果
# file_content = client.files.retrieve_content(file_id=file_object.id)
# 注意，某些旧版本示例中的 retrieve_content API 在最新版本标记了 warning, 可以用下面这行代替
# （如果使用旧版本的 SDK，可以继续延用 retrieve_content API）
file_content = client.files.content(file_id=file_object.id).text

# 把文件内容通过系统提示词 system prompt 放进请求中
messages = [
{
"role":"system",
"content":"你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。",
},
{
"role":"system",
"content": file_content,# <-- 这里，我们将抽取后的文件内容（注意是文件内容，而不是文件 ID）放置在请求中
},
{"role":"user","content":"请简单介绍 moonshot.pdf 的具体内容"},
]

# 然后调用 chat-completion, 获取 Kimi 的回答
completion = client.chat.completions.create(
  model="kimi-k2-turbo-preview",
  messages=messages,
  temperature=0.6,
)

print(completion.choices[0].message)
```

让我们回顾一下文件问答的基本步骤及注意事项：

1. 通过文件上传接口 `/v1/files` 或 SDK 中的 `files.create` API 将文件上传至 Kimi 服务器；
2. 通过文件抽取接口 `/v1/files/{file_id}` 或 SDK 中的 `files.content` API 获取文件内容，此时获取的文件内容已经对齐了我们推荐的模型易于理解的格式；
3. 将文件抽取后（已经对齐格式的）文件内容（而不是文件 `id`），以系统提示词 system prompt 的形式放置在 messages 列表中；
4. 开始你对文件内容的提问；

**再次注意，请将文件内容放置在 prompt 中，而不是文件的 `file_id`。**

## 

如果你想针对多个文件内容进行提问，实现方式也非常简单，**将每个文件单独放置在一个系统提示词 system prompt 中即可**，用代码演示如下：

```python
from typing import*

import os
import json
from pathlib import Path

from openai import OpenAI

client =OpenAI(
    api_key="MOONSHOT_API_KEY", # 在这里将 MOONSHOT_API_KEY 替换为你从 Kimi 开放平台申请的 API Key
    base_url="https://api.moonshot.cn/v1",
)

defupload_files(files: List[str]) -> List[Dict[str, Any]]:
"""
    upload_files 会将传入的文件（路径）全部通过文件上传接口 '/v1/files' 上传，并获取上传后的
    文件内容生成文件 messages。每个文件会是一个独立的 message，这些 message 的 role 均为
    system，Kimi 大模型会正确识别这些 system messages 中的文件内容。

    :param files: 一个包含要上传文件的路径的列表，路径可以是绝对路径也可以是相对路径，请使用字符串
        的形式传递文件路径。
    :return: 一个包含了文件内容的 messages 列表，请将这些 messages 加入到 Context 中，
        即请求 `/v1/chat/completions` 接口时的 messages 参数中。
    """
    messages = []

# 对每个文件路径，我们都会上传文件并抽取文件内容，最后生成一个 role 为 system 的 message，并加入
# 到最终返回的 messages 列表中。
for file in files:
        file_object = client.files.create(file=Path(file), purpose="file-extract")
        file_content = client.files.content(file_id=file_object.id).text
        messages.append({
"role": "system",
"content": file_content,
        })

return messages

defmain():
    file_messages =upload_files(files=["upload_files.py"])

    messages = [
# 我们使用 * 语法，来解构 file_messages 消息，使其成为 messages 列表的前 N 条 messages。
*file_messages,
{
"role":"system",
"content":"你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，"
"准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不"
"可翻译成其他语言。",
},
{
"role":"user",
"content":"总结一下这些文件的内容。",
},
    ]

print(json.dumps(messages, indent=2, ensure_ascii=False))

    completion = client.chat.completions.create(
        model="kimi-k2-turbo-preview",
        messages=messages,
    )

print(completion.choices[0].message.content)

if__name__=='__main__':
main()
```

## 

通常而言，文件上传和文件抽取功能旨在将不同格式的文件提取成对齐了我们推荐的模型易于理解的格式，在完成文件上传和文件抽取步骤后，抽取后的内容可以进行在本地进行存储，在下一次基于文件的问答请求中，不必再次进行上传和抽取动作。

同时，由于我们对单用户的文件上传数量进行了限制（每个用户最多上传 1000 个文件），因此我们建议你在文件抽取过程进行完毕后，定期清理已上传的文件，你可以定期执行下面的代码，以清理已上传的文件：

```python
from openai import OpenAI

client =OpenAI(
    api_key="MOONSHOT_API_KEY", # 在这里将 MOONSHOT_API_KEY 替换为你从 Kimi 开放平台申请的 API Key
    base_url="https://api.moonshot.cn/v1",
)

file_list = client.files.list()

for file in file_list.data:
	client.files.delete(file_id=file.id)
```

在上述代码中，我们先通过 `files.list` API 列出所有的文件明细，并逐一通过 `files.delete` API 删除文件，定期执行这样的操作，以确保释放文件存储空间，以便后续文件上传和抽取动作能成功执行。

Last updated on 2025年11月9日

[Partial Mode 使用说明](/docs/guide/use-partial-mode-feature-of-kimi-api "Partial Mode 使用说明")[开发工作台调试模型指南](/docs/guide/use-playground-to-debug-the-model "开发工作台调试模型指南")