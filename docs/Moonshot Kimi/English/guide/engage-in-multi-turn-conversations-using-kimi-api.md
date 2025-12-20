文档

入门指南

多轮对话指南

# 使用 Kimi API 进行多轮对话

Kimi API 与 Kimi 智能助手不同，**API 本身不具有记忆功能，它是无状态的**，这意味着，当你多次请求 API 时，Kimi 大模型并不知道你前一次请求的内容，也不会记忆任何请求的上下文信息。例如，你在前一次请求中告诉 Kimi 大模型你今年 27 岁，在下一次请求中，Kimi 大模型并不会记住你 27 岁这件事。

因此，我们需要手动维护每次请求的上下文，即 Context，把上一次请求过的内容手动加入到下一次请求中，让 Kimi 大模型能正确看到此前我们都聊了什么。我们将改造上一章节中使用的示例，来展示如何通过维护 messages 列表让 Kimi 大模型拥有记忆，并实现多轮对话功能。

*注：我们将实现多轮对话的要点以注释的形式添加到代码中。*

```python
from openai import OpenAI

client =OpenAI(
    api_key ="MOONSHOT_API_KEY", # 在这里将 MOONSHOT_API_KEY 替换为你从 Kimi 开放平台申请的 API Key
    base_url ="https://api.moonshot.cn/v1",
)

# 我们定义一个全局变量 messages，用于记录我们和 Kimi 大模型产生的历史对话消息
# 在 messages 中，既包含我们向 Kimi 大模型提出的问题（role=user），也包括 Kimi 大模型给我们的回复（role=assistant）
# 当然，也包括初始的 System Prompt（role=system）
# messages 中的消息按时间顺序从小到大排列
messages = [
{"role":"system","content":"你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"},
]

defchat(input:str) ->str:
"""
	chat 函数支持多轮对话，每次调用 chat 函数与 Kimi 大模型对话时，Kimi 大模型都会”看到“此前已经
	产生的历史对话消息，换句话说，Kimi 大模型拥有了记忆。
	"""

global messages

# 我们将用户最新的问题构造成一个 message（role=user），并添加到 messages 的尾部
	messages.append({
"role": "user",
"content": input,	
	})

# 携带 messages 与 Kimi 大模型对话
	completion = client.chat.completions.create(
        model="kimi-k2-turbo-preview",
        messages=messages,
        temperature=0.6,
    )

# 通过 API 我们获得了 Kimi 大模型给予我们的回复消息（role=assistant）
    assistant_message = completion.choices[0].message

# 为了让 Kimi 大模型拥有完整的记忆，我们必须将 Kimi 大模型返回给我们的消息也添加到 messages 中
    messages.append(assistant_message)

return assistant_message.content

print(chat("你好，我今年 27 岁。"))
print(chat("你知道我今年几岁吗？"))# 在这里，Kimi 大模型根据此前的上下文信息，将会知道你今年的年龄是 27 岁
```

我们回顾一下上述代码中的要点：

* Kimi API 本身没有上下文记忆功能，我们需要通过 API 中的 messages 参数，手动将”之前聊了什么“告知 Kimi 大模型；
* 在 messages 中，既要存储我们向 Kimi 大模型提出的问题消息（role=user），也要存储 Kimi 大模型给我们的回复消息（role=assistant）；

需要注意的是，在上述代码中，随着 `chat` 调用次数的不断增多，`messages` 列表的长度也在不断增加，这意味着每次请求所消耗的 Tokens 数量也在不断增加，并且最终会在某个时间点，`messages` 中的消息所占用的 Tokens 超过了 Kimi 大模型支持的上下文窗口大小。我们推荐你使用某种策略来保持 `messages` 列表的消息数量在一个可控的范围内，例如，每次只保留最新的 20 条消息作为本次请求的上下文。

我们给出一个示例，以便于你能顺利理解如何控制上下文长度，请注意关注 `make_messages` 函数是如何运作的：

```python
from openai import OpenAI

client =OpenAI(
    api_key ="MOONSHOT_API_KEY", # 在这里将 MOONSHOT_API_KEY 替换为你从 Kimi 开放平台申请的 API Key
    base_url ="https://api.moonshot.cn/v1",
)

# 我们将 System Messages 单独放置在一个列表中，这是因为每次请求都应该携带 System Messages
system_messages = [
{"role":"system","content":"你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"},
]

# 我们定义一个全局变量 messages，用于记录我们和 Kimi 大模型产生的历史对话消息
# 在 messages 中，既包含我们向 Kimi 大模型提出的问题（role=user），也包括 Kimi 大模型给我们的回复（role=assistant）
# messages 中的消息按时间顺序从小到大排列
messages = []

defmake_messages(input:str,n:int=20) -> list[dict]:
"""
	使用 make_messaegs 控制每次请求的消息数量，使其保持在一个合理的范围内，例如默认值是 20。在构建消息列表
	的过程中，我们会先添加 System Prompt，这是因为无论如何对消息进行截断，System Prompt 都是必不可少
	的内容，再获取 messages —— 即历史记录中，最新的 n 条消息作为请求使用的消息，在大部分场景中，这样
	能保证请求的消息所占用的 Tokens 数量不超过模型上下文窗口。
	"""
# 首先，我们将用户最新的问题构造成一个 message（role=user），并添加到 messages 的尾部
	messages.append({
"role": "user",
"content": input,	
	})

# new_messages 是我们下一次请求使用的消息列表，现在让我们来构建它
	new_messages = []

# 每次请求都需要携带 System Messages，因此我们需要先把 system_messages 添加到消息列表中；
# 注意，即使对消息进行截断，也应该注意保证 System Messages 仍然在 messages 列表中。
	new_messages.extend(system_messages)

# 在这里，当历史消息超过 n 条时，我们仅保留最新的 n 条消息
iflen(messages)> n:
		messages = messages[-n:]

	new_messages.extend(messages)
return new_messages

defchat(input:str) ->str:
"""
	chat 函数支持多轮对话，每次调用 chat 函数与 Kimi 大模型对话时，Kimi 大模型都会”看到“此前已经
	产生的历史对话消息，换句话说，Kimi 大模型拥有了记忆。
	"""

# 携带 messages 与 Kimi 大模型对话
	completion = client.chat.completions.create(
        model="kimi-k2-turbo-preview",
        messages=make_messages(input),
        temperature=0.6,
    )

# 通过 API 我们获得了 Kimi 大模型给予我们的回复消息（role=assistant）
    assistant_message = completion.choices[0].message

# 为了让 Kimi 大模型拥有完整的记忆，我们必须将 Kimi 大模型返回给我们的消息也添加到 messages 中
    messages.append(assistant_message)

return assistant_message.content

print(chat("你好，我今年 27 岁。"))
print(chat("你知道我今年几岁吗？"))# 在这里，Kimi 大模型根据此前的上下文信息，将会知道你今年的年龄是 27 岁
```

请注意，上述的代码示例仅考虑了最简单的调用场景，在实际的业务代码逻辑中，你可能需要考虑更多的场景和边界，例如：

* 并发场景下可能需要额外的读写锁；
* 针对多用户场景，需要为每个用户单独维护 messages 列表；
* 你可能需要对 messages 列表进行持久化；
* 你可能仍然需要更精确的方式计算 messages 列表中需要保留多少条消息；
* 你可能想对被遗弃的消息做一次总结，并生成一条新的消息加入到 messages 列表中；
* ……

Last updated on 2025年11月9日

[调试工具使用说明](/docs/guide/use-moonpalace "调试工具使用说明")[使用视觉模型](/docs/guide/use-kimi-vision-model "使用视觉模型")