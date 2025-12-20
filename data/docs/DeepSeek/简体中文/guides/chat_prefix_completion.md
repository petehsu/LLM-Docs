# 对话前缀续写（Beta）

本页总览  
  
# 对话前缀续写（Beta）

对话前缀续写沿用 [Chat Completion API](</zh-cn/api/create-chat-completion>)，用户提供 assistant 开头的消息，来让模型补全其余的消息。

## 注意事项​

  1. 使用对话前缀续写时，用户需确保 `messages` 列表里最后一条消息的 `role` 为 `assistant`，并设置最后一条消息的 `prefix` 参数为 `True`。
  2. 用户需要设置 `base_url="https://api.deepseek.com/beta"` 来开启 Beta 功能。

## 样例代码​

下面给出了对话前缀续写的完整 Python 代码样例。在这个例子中，我们设置 `assistant` 开头的消息为 `"```python\n"` 来强制模型输出 python 代码，并设置 `stop` 参数为 `['```']` 来避免模型的额外解释。
    
    
    from openai import OpenAI  
      
    client = OpenAI(  
        api_key="<your api key>",  
        base_url="https://api.deepseek.com/beta",  
    )  
      
    messages = [  
        {"role": "user", "content": "Please write quick sort code"},  
        {"role": "assistant", "content": "```python\n", "prefix": True}  
    ]  
    response = client.chat.completions.create(  
        model="deepseek-chat",  
        messages=messages,  
        stop=["```"],  
    )  
    print(response.choices[0].message.content)