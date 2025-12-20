# 流式消息

<Tip>
  流式消息（Streaming）允许在模型生成响应时实时获取内容，而不需要等待完整响应生成完毕。这种方式可以显著改善用户体验，特别是在生成长文本内容时，用户可以立即看到输出开始出现。
</Tip>

## 功能特性

流式消息采用增量生成机制，在生成过程中将内容分块实时传输，而非等待完整响应生成后一次性返回。这种机制使得开发者可以：

* **实时响应**：无需等待完整响应，内容逐步显示
* **改善体验**：减少用户等待时间，提供即时反馈
* **降低延迟**：内容生成即传输，减少感知延迟
* **灵活处理**：可以在接收过程中进行实时处理和展示

### 核心参数说明

* **`stream=True`**: 启用流式输出，必须设置为 `True`
* **`model`**: 支持流式输出的模型，如 `glm-4.6`、`glm-4.5` 等

### 响应格式说明

流式响应采用服务器发送事件（Server-Sent Events, SSE）格式，每个事件包含：

* `choices[0].delta.content`: 增量文本内容
* `choices[0].delta.reasoning_content`: 增量思考内容
* `choices[0].finish_reason`: 完成原因（仅在最后一个chunk中出现）
* `usage`: 令牌使用统计（仅在最后一个chunk中出现）

## 代码示例

<Tabs>
  <Tab title="cURL">
    ```bash  theme={null}
    curl --location 'https://open.bigmodel.cn/api/paas/v4/chat/completions' \
    --header 'Authorization: Bearer YOUR_API_KEY' \
    --header 'Content-Type: application/json' \
    --data '{
        "model": "glm-4.6",
        "messages": [
            {
                "role": "user",
                "content": "写一首关于春天的诗"
            }
        ],
        "stream": true
    }'
    ```
  </Tab>

  <Tab title="Python">
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

    # 创建流式消息请求
    response = client.chat.completions.create(
        model="glm-4.6",
        messages=[
            {"role": "user", "content": "写一首关于春天的诗"}
        ],
        stream=True  # 启用流式输出
    )

    # 处理流式响应
    full_content = ""
    for chunk in response:
        if not chunk.choices:
            continue
        
        delta = chunk.choices[0].delta
        
        # 处理增量内容
        if hasattr(delta, 'content') and delta.content:
            full_content += delta.content
            print(delta.content, end="", flush=True)
        
        # 检查是否完成
        if chunk.choices[0].finish_reason:
            print(f"\n\n完成原因: {chunk.choices[0].finish_reason}")
            if hasattr(chunk, 'usage') and chunk.usage:
                print(f"令牌使用: 输入 {chunk.usage.prompt_tokens}, 输出 {chunk.usage.completion_tokens}")

    print(f"\n\n完整内容:\n{full_content}")
    ```
  </Tab>
</Tabs>

### 响应示例

流式响应的格式如下：

```
data: {"id":"1","created":1677652288,"model":"glm-4.6","choices":[{"index":0,"delta":{"content":"春"},"finish_reason":null}]}

data: {"id":"1","created":1677652288,"model":"glm-4.6","choices":[{"index":0,"delta":{"content":"天"},"finish_reason":null}]}

data: {"id":"1","created":1677652288,"model":"glm-4.6","choices":[{"index":0,"delta":{"content":"来"},"finish_reason":null}]}

...

data: {"id":"1","created":1677652288,"model":"glm-4.6","choices":[{"index":0,"finish_reason":"stop","delta":{"role":"assistant","content":""}}],"usage":{"prompt_tokens":8,"completion_tokens":262,"total_tokens":270,"prompt_tokens_details":{"cached_tokens":0}}}

data: [DONE]
```

## 应用场景

<CardGroup cols={2}>
  <Card title="聊天应用" icon={<svg style={{maskImage: "url(/resource/icon/headset.svg)", WebkitMaskImage: "url(/resource/icon/headset.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    * 实时对话体验
    * 逐字显示回复
    * 减少等待时间
  </Card>

  <Card title="内容生成" icon={<svg style={{maskImage: "url(/resource/icon/feather.svg)", WebkitMaskImage: "url(/resource/icon/feather.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    * 文章写作助手
    * 代码生成工具
    * 创意内容创作
  </Card>

  <Card title="教育应用" icon={<svg style={{maskImage: "url(/resource/icon/book.svg)", WebkitMaskImage: "url(/resource/icon/book.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    * 在线答疑系统
    * 学习辅导工具
    * 知识问答平台
  </Card>

  <Card title="客服系统" icon={<svg style={{maskImage: "url(/resource/icon/users.svg)", WebkitMaskImage: "url(/resource/icon/users.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    * 智能客服机器人
    * 实时问题解答
    * 用户支持系统
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt