文档

入门指南

自动断线重连

# 自动断线重连

因为并发限制、复杂的网络环境等情况，一些时候我们的连接可能因为一些预期外的状况而中断，通常这种偶发的中断并不会持续很久，我们希望在这种情况下业务依然可以稳定运行，使用简单的代码即可实现断线重连的需求。

```python
from openai import OpenAI
import time

client =OpenAI(
    api_key ="$MOONSHOT_API_KEY",
    base_url ="https://api.moonshot.cn/v1",
)

defchat_once(msgs):
    response = client.chat.completions.create(
        model ="kimi-k2-turbo-preview",
        messages = msgs,
        temperature =0.6,
    )
return response.choices[0].message.content

defchat(input:str,max_attempts:int=100) ->str:
    messages = [
{"role":"system","content":"你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"},
    ]

# 我们将用户最新的问题构造成一个 message（role=user），并添加到 messages 的尾部
    messages.append({
"role": "user",
"content": input,	
	})
    st_time = time.time()
for i inrange(max_attempts):
print(f"Attempts: {i+1}/{max_attempts}")
try:
            response =chat_once(messages)
            ed_time = time.time()
print("Query Succuess!")
print(f"Query Time: {ed_time-st_time}")
return response
exceptExceptionas e:
print(e)
            time.sleep(1)
continue

print("Query Failed.")
return

print(chat("你好，请给我讲一个童话故事。"))
```

上面的代码实现了一个简单的断线重连功能，最多重复 100 次，每次连接之间等待 1s，你也可以根据具体的需求更改这些数值以及满足重试的条件。

Last updated on 2025年11月9日

[使用视觉模型](/docs/guide/use-kimi-vision-model "使用视觉模型")[流式输出指南](/docs/guide/utilize-the-streaming-output-feature-of-kimi-api "流式输出指南")