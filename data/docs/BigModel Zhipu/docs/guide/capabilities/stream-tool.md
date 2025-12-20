# 工具流式输出

<Tip>
  流式工具调用（Stream Tool Call）是 Z.ai 最新模型 GLM-4.6 的独有特性，允许在工具调用过程中实时获取推理过程、回答内容和工具调用信息，提供更好的用户体验和实时反馈。
</Tip>

## 功能特性

工具调用在最新 GLM-4.6 模型中现在支持开启响应的流式输出。这允许开发者在调用 `chat.completions` 时，在不进行缓冲或JSON验证的情况下流式传输工具使用参数，从而减少调用延迟，提供更好的用户体验。

### 核心参数说明

* **`stream=True`**: 启用流式输出，必须设置为 `True`
* **`tool_stream=True`**: 启用工具调用流式输出
* **`model`**: 使用支持工具调用的模型，仅限 `glm-4.6`

### 响应参数说明

流式响应中的 `delta` 对象包含以下字段：

* **`reasoning_content`**: 模型推理过程的文本内容
* **`content`**: 模型回答的文本内容
* **`tool_calls`**: 工具调用信息，包含函数名和参数

## 代码示例

通过设置 `tool_stream=True` 参数，可以启用流式工具调用功能：

<Tabs>
  <Tab title="Python SDK">
    **安装 SDK**

    ```bash  theme={null}
    # 安装最新版本
    pip install zai-sdk

    # 或指定版本
    pip install zai-sdk==0.1.0
    ```

    **验证安装**

    ```python  theme={null}
    import zai
    print(zai.__version__)
    ```

    **完整示例**

    ```python  theme={null}
    from zai import ZhipuAiClient

    # 初始化客户端
    client = ZhipuAiClient(api_key='您的apikey')

    # 创建流式工具调用请求
    response = client.chat.completions.create(
        model="glm-4.6",  # 使用支持工具调用的模型
        messages=[
            {"role": "user", "content": "北京天气怎么样"},
        ],
        tools=[
            {
                "type": "function",
                "function": {
                    "name": "get_weather",
                    "description": "获取指定地点当前的天气情况",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "location": {"type": "string", "description": "城市，例如：北京、上海"},
                            "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                        },
                        "required": ["location"]
                    }
                }
            }
        ],
        stream=True,        # 启用流式输出
        tool_stream=True    # 启用工具调用流式输出
    )

    # 初始化变量用于收集流式数据
    reasoning_content = ""      # 推理过程内容
    content = ""               # 回答内容
    final_tool_calls = {}      # 工具调用信息
    reasoning_started = False  # 推理过程开始标志
    content_started = False    # 内容输出开始标志

    # 处理流式响应
    for chunk in response:
        if not chunk.choices:
            continue

        delta = chunk.choices[0].delta

        # 处理流式推理过程输出
        if hasattr(delta, 'reasoning_content') and delta.reasoning_content:
            if not reasoning_started and delta.reasoning_content.strip():
                print("\n🧠 思考过程：")
                reasoning_started = True
            reasoning_content += delta.reasoning_content
            print(delta.reasoning_content, end="", flush=True)

        # 处理流式回答内容输出
        if hasattr(delta, 'content') and delta.content:
            if not content_started and delta.content.strip():
                print("\n\n💬 回答内容：")
                content_started = True
            content += delta.content
            print(delta.content, end="", flush=True)

        # 处理流式工具调用信息
        if delta.tool_calls:
            for tool_call in delta.tool_calls:
                index = tool_call.index
                if index not in final_tool_calls:
                    # 新的工具调用
                    final_tool_calls[index] = tool_call
                    final_tool_calls[index].function.arguments = tool_call.function.arguments
                else:
                    # 追加工具调用参数（流式构建）
                    final_tool_calls[index].function.arguments += tool_call.function.arguments

    # 输出最终的工具调用信息
    if final_tool_calls:
        print("\n📋 命中 Function Calls :")
        for index, tool_call in final_tool_calls.items():
            print(f"  {index}: 函数名: {tool_call.function.name}, 参数: {tool_call.function.arguments}")
    ```
  </Tab>
</Tabs>

## 应用场景

<CardGroup cols={2}>
  <Card title="智能客服系统" icon={<svg style={{maskImage: "url(/resource/icon/headset.svg)", WebkitMaskImage: "url(/resource/icon/headset.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    * 实时显示查询进度
    * 改善等待体验
  </Card>

  <Card title="代码助手" icon={<svg style={{maskImage: "url(/resource/icon/code.svg)", WebkitMaskImage: "url(/resource/icon/code.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    * 实时代码分析过程
    * 显示工具调用链
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt