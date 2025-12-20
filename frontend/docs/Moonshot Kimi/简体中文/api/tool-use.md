文档

API 接口说明

Tool Use

# 工具调用

学会使用工具是智能的一个重要特征，在 Kimi 大模型中我们同样如此。Tool Use 或者 Function Calling 是 Kimi 大模型的一个重要功能，在调用 API 使用模型服务时，您可以在 Messages 中描述工具或函数，并让 Kimi 大模型智能地选择输出一个包含调用一个或多个函数所需的参数的 JSON 对象，实现让 Kimi 大模型链接使用外部工具的目的。

下面是一个简单的工具调用的例子：

```python
{
"model":"kimi-k2-turbo-preview",
"messages": [
{
"role":"user",
"content":"编程判断 3214567 是否是素数。"
}
  ],
"tools": [
{
"type":"function",
"function":{
"name":"CodeRunner",
"description":"代码执行器，支持运行 python 和 javascript 代码",
"parameters":{
"properties":{
"language":{
"type":"string",
"enum": ["python","javascript"]
},
"code":{
"type":"string",
"description":"代码写在这里"
}
},
"type":"object"
}
}
}
  ]
}
```

![上面例子的示意图](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftooluse_whiteboard_example.b33c4a6f.png&w=3840&q=75)

其中在 tools 字段，我们可以增加一组可选的工具列表。

每个工具列表必须包括一个类型，在 function 结构体中我们需要包括 name（它的需要遵守这样的正则表达式作为规范: ^[a-zA-Z\_][a-zA-Z0-9-\_]63$），这个名字如果是一个容易理解的英文可能会更加被模型所接受。以及一段 description 或者 enum，其中 description 部分介绍它能做什么功能，方便模型来判断和选择。
function 结构体中必须要有个 parameters 字段，parameters 的 root 必须是一个 object，内容是一个 json schema 的子集（之后我们会给出具体文档介绍相关技术细节）。
tools 的 function 个数目前不得超过 128 个。

和别的 API 一样，我们可以通过 Chat API 调用它。

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
        {"role": "user", "content": "编程判断 3214567 是否是素数。"}
    ],
    tools = [{
"type": "function",
"function": {
"name": "CodeRunner",
"description": "代码执行器，支持运行 python 和 javascript 代码",
"parameters": {
"properties": {
"language": {
"type": "string",
"enum": ["python", "javascript"]
                    },
"code": {
"type": "string",
"description": "代码写在这里"
                    }
                },
"type": "object"
            }
        }
    }],
    temperature =0.6,
)

print(completion.choices[0].message)
```

### 

你也可以使用一些 Agent 平台例如 [Coze (opens in a new tab)](https://coze.cn/)、[Bisheng (opens in a new tab)](https://github.com/dataelement/bisheng)、[Dify (opens in a new tab)](https://github.com/langgenius/dify/) 和 [LangChain (opens in a new tab)](https://github.com/langchain-ai/langchain) 等框架来创建和管理这些工具，并配合 Kimi 大模型设计更加复杂的工作流。

Last updated on 2025年11月9日

[Chat](/docs/api/chat "Chat")[Partial Mode](/docs/api/partial "Partial Mode")