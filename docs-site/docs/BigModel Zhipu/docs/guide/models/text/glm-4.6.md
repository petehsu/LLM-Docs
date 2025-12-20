# GLM-4.6

<Tip>
  GLM Coding 编码套餐再升级！20元起包月畅享 GLM-4.6，1/7价格，3倍用量，支持 Claude Code、Cline 等全球主流编程工具，独家升级支持多模态理解与联网搜索，极速响应，稳定可靠！[立即了解，锁定限时优惠](https://zhipuaishengchan.datasink.sensorsdata.cn/t/th) ！
</Tip>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-list.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 概览 </div>

GLM-4.6 是智谱最新的旗舰模型，其总参数量 355B，激活参数 32B。GLM-4.6 所有核心能力上均完成了对 GLM-4.5 的超越，具体如下：

* **高级编码能力**：在公开基准与真实编程任务中，GLM-4.6 的代码能力对齐 Claude Sonnet 4。
* **上下文长度**：上下文窗口由 128K→200K，适应更长的代码和智能体任务。
* **推理能力**：推理能力提升，并支持在推理过程中调用工具。
* **搜索能力**：增强了模型在工具调用和搜索智能体上的表现，在智能体框架中表现更好。
* **写作能力**：在文风、可读性与角色扮演场景中更符合人类偏好。
* **多语言翻译**：进一步增强跨语种任务的处理效果。

<CardGroup cols={2}>
  <Card title="输入模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    文本
  </Card>

  <Card title="输出模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    文本
  </Card>

  <Card title="上下文窗口" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    200K
  </Card>

  <Card title="最大输出 Tokens" icon={<svg style={{maskImage: "url(/resource/icon/maximize.svg)", WebkitMaskImage: "url(/resource/icon/maximize.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    128K
  </Card>
</CardGroup>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/bolt.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 能力支持 </div>

<CardGroup cols={3}>
  <Card title="深度思考" href="/cn/guide/capabilities/thinking" icon={<svg style={{maskImage: "url(/resource/icon/brain.svg)", WebkitMaskImage: "url(/resource/icon/brain.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    启用深度思考模式，提供更深层次的推理分析
  </Card>

  <Card title="流式输出" href="/cn/guide/capabilities/streaming" icon={<svg style={{maskImage: "url(/resource/icon/maximize.svg)", WebkitMaskImage: "url(/resource/icon/maximize.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    支持实时流式响应，提升用户交互体验
  </Card>

  <Card title="Function Call" href="/cn/guide/capabilities/function-calling" icon={<svg style={{maskImage: "url(/resource/icon/function.svg)", WebkitMaskImage: "url(/resource/icon/function.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    强大的工具调用能力，支持多种外部工具集成
  </Card>

  <Card title="上下文缓存" href="/cn/guide/capabilities/cache" icon={<svg style={{maskImage: "url(/resource/icon/database.svg)", WebkitMaskImage: "url(/resource/icon/database.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    智能缓存机制，优化长对话性能
  </Card>

  <Card title="结构化输出" href="/cn/guide/capabilities/struct-output" icon={<svg style={{maskImage: "url(/resource/icon/code.svg)", WebkitMaskImage: "url(/resource/icon/code.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    支持 JSON 等结构化格式输出，便于系统集成
  </Card>

  <Card title="MCP" icon={<svg style={{maskImage: "url(/resource/icon/box.svg)", WebkitMaskImage: "url(/resource/icon/box.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    可灵活调用外部 MCP 工具与数据源，扩展应用场景
  </Card>
</CardGroup>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/stars.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> Benchmark </div>

### 1. 综合评测

在 **8 大权威基准**：AIME 25、GPQA、LCB v6、HLE、SWE-Bench Verified、BrowseComp、Terminal-Bench、τ^2-Bench、GPQA 模型通用能力的评估中，**GLM-4.6 在大部分权威榜单表现对齐 Claude Sonnet 4**。

![Description](https://cdn.bigmodel.cn/markdown/1759227564362glm-4.6-1.png?attname=glm-4.6-1.png)

### 2. 真实编程评测

为了测试模型在实际编程任务中的能力，我们在 **Claude Code** 环境下进行了 74 个真实场景编程任务测试。结果显示，**GLM-4.6 实测超过 Claude Sonnet 4**。

![Description](https://cdn.bigmodel.cn/markdown/1759212585375glm-4.6-2.jpeg?attname=glm-4.6-2.jpeg)

在平均token消耗上，GLM-4.6 比 GLM-4.5 节省 **30%** 以上。

![Description](https://cdn.bigmodel.cn/markdown/1759212592331glm-4.6-3.jpeg?attname=glm-4.6-3.jpeg)

为确保透明性与可信度，智谱已公开全部测试题目与Agent轨迹，供业界验证与复现（链接：[https://huggingface.co/datasets/zai-org/CC-Bench-trajectories](https://huggingface.co/datasets/zai-org/CC-Bench-trajectories) ）。

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/stars.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 推荐场景 </div>

<AccordionGroup>
  <Accordion title="AI Coding">
    覆盖 Python、JavaScript、Java 等主流语言，且在前端代码的美观度、布局合理性上带来更佳表现。原生支持多类智能体任务，具备更强的自主规划和工具调用能力。在任务拆解、跨工具协作、动态调整方面表现优秀，能更灵活地应对复杂的开发或办公流程。
  </Accordion>

  <Accordion title="智慧办公">
    在 PPT 制作和办公自动化场景中，显著提升了页面呈现效果。能在逻辑结构清晰的基础上，生成更加美观、先进的版面布局，并保持内容完整性与表达准确性，适合办公自动化系统和 AI 演示工具的落地使用。
  </Accordion>

  <Accordion title="翻译与跨语言应用">
    针对小语种（法、俄、日、韩）和非正式语境的翻译效果进一步优化，尤其适合社交媒体、电商内容与短剧翻译场景。它不仅保持长篇文段的语义连贯和风格一致，还能更好地实现风格迁移和本地化表达，满足出海企业和跨境服务的多样化需求。
  </Accordion>

  <Accordion title="内容创作">
    支持小说、脚本、文案等多样化内容的生产，并通过上下文扩展与情绪调控实现更自然的表达。
  </Accordion>

  <Accordion title="虚拟角色">
    在多轮对话中保持语气和行为一致，适合应用于虚拟人、社交 AI 及品牌人格化运营，让交互更具温度和真实感。
  </Accordion>

  <Accordion title="智能搜索与深度研究">
    加强用户意图理解、工具检索、结果融合，不仅能返回更精准的搜索结果，还能对结果进行深度整合，支持 Deep Research 场景，为用户提供更具洞察力的答案。
  </Accordion>
</AccordionGroup>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/gauge-high.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 使用资源 </div>

[体验中心](https://bigmodel.cn/trialcenter/modeltrial/text?modelCode=glm-4.6)：快速测试模型在业务场景上的效果<br />
[接口文档](/api-reference/%E6%A8%A1%E5%9E%8B-api/%E5%AF%B9%E8%AF%9D%E8%A1%A5%E5%85%A8)：API 调用方式

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-code.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 调用示例 </div>

以下是完整的调用示例，帮助您快速上手 GLM-4.6 模型。

<Tabs>
  <Tab title="cURL">
    **基础调用**

    ```bash  theme={null}
    curl -X POST "https://open.bigmodel.cn/api/paas/v4/chat/completions" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer your-api-key" \
        -d '{
            "model": "glm-4.6",
            "messages": [
            {
                "role": "user",
                "content": "作为一名营销专家，请为我的产品创作一个吸引人的口号"
            },
            {
                "role": "assistant",
                "content": "当然，要创作一个吸引人的口号，请告诉我一些关于您产品的信息"
            },
            {
                "role": "user",
                "content": "智谱AI 开放平台"
            }
                ],
                "thinking": {
                "type": "enabled"
            },
                "max_tokens": 65536,
                "temperature": 1.0
            }'
    ```

    **流式调用**

    ```bash  theme={null}
    curl -X POST "https://open.bigmodel.cn/api/paas/v4/chat/completions" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer your-api-key" \
        -d '{
            "model": "glm-4.6",
            "messages": [
            {
                "role": "user",
                "content": "作为一名营销专家，请为我的产品创作一个吸引人的口号"
            },
            {
                "role": "assistant",
                "content": "当然，要创作一个吸引人的口号，请告诉我一些关于您产品的信息"
            },
            {
                "role": "user",
                "content": "智谱AI开放平台"
            }
                ],
                "thinking": {
                "type": "enabled"
            },
                "stream": true,
                "max_tokens": 65536,
                "temperature": 1.0
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

    **基础调用**

    ```python  theme={null}
    from zai import ZhipuAiClient

    client = ZhipuAiClient(api_key="your-api-key")  # 请填写您自己的 API Key

    response = client.chat.completions.create(
        model="glm-4.6",
        messages=[
            {"role": "user", "content": "作为一名营销专家，请为我的产品创作一个吸引人的口号"},
            {"role": "assistant", "content": "当然，要创作一个吸引人的口号，请告诉我一些关于您产品的信息"},
            {"role": "user", "content": "智谱AI开放平台"}
            ],
        thinking={
            "type": "enabled",    # 启用深度思考模式
        },
        max_tokens=65536,          # 最大输出 tokens
        temperature=1.0           # 控制输出的随机性
    )

    # 获取完整回复
    print(response.choices[0].message)
    ```

    **流式调用**

    ```python  theme={null}
    from zai import ZhipuAiClient

    client = ZhipuAiClient(api_key="your-api-key")  # 请填写您自己的 API Key

    response = client.chat.completions.create(
        model="glm-4.6",
        messages=[
            {"role": "user", "content": "作为一名营销专家，请为我的产品创作一个吸引人的口号"},
            {"role": "assistant", "content": "当然，要创作一个吸引人的口号，请告诉我一些关于您产品的信息"},
            {"role": "user", "content": "智谱AI开放平台"}
        ],
        thinking={
            "type": "enabled",    # 启用深度思考模式
        },
        stream=True,              # 启用流式输出
        max_tokens=65536,          # 最大输出tokens
        temperature=1.0           # 控制输出的随机性
    )

    # 流式获取回复
    for chunk in response:
    if chunk.choices[0].delta.reasoning_content:
    print(chunk.choices[0].delta.reasoning_content, end='', flush=True)

    if chunk.choices[0].delta.content:
    print(chunk.choices[0].delta.content, end='', flush=True)
    ```
  </Tab>

  <Tab title="Java">
    **安装 SDK**

    **Maven**

    ```xml  theme={null}
    <dependency>
        <groupId>ai.z.openapi</groupId>
        <artifactId>zai-sdk</artifactId>
        <version>0.1.3</version>
    </dependency>
    ```

    **Gradle (Groovy)**

    ```groovy  theme={null}
    implementation 'ai.z.openapi:zai-sdk:0.1.3'
    ```

    **基础调用**

    ```java  theme={null}
    import ai.z.openapi.ZhipuAiClient;
    import ai.z.openapi.service.model.ChatCompletionCreateParams;
    import ai.z.openapi.service.model.ChatCompletionResponse;
    import ai.z.openapi.service.model.ChatMessage;
    import ai.z.openapi.service.model.ChatMessageRole;
    import ai.z.openapi.service.model.ChatThinking;
    import java.util.Arrays;

    public class BasicChat {
        public static void main(String[] args) {
            // 初始化客户端
            ZhipuAiClient client = ZhipuAiClient.builder()
                .apiKey("your-api-key")
                .build();

            // 创建聊天完成请求
            ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
                .model("glm-4.6")
                .messages(Arrays.asList(
                    ChatMessage.builder()
                        .role(ChatMessageRole.USER.value())
                        .content("作为一名营销专家，请为我的产品创作一个吸引人的口号")
                        .build(),
                    ChatMessage.builder()
                        .role(ChatMessageRole.ASSISTANT.value())
                        .content("当然，要创作一个吸引人的口号，请告诉我一些关于您产品的信息")
                        .build(),
                    ChatMessage.builder()
                        .role(ChatMessageRole.USER.value())
                        .content("智谱AI开放平台")
                        .build()
                ))
                .thinking(ChatThinking.builder().type("enabled").build())
                .maxTokens(65536)
                .temperature(1.0f)
                .build();

            // 发送请求
            ChatCompletionResponse response = client.chat().createChatCompletion(request);

            // 获取回复
            if (response.isSuccess()) {
                Object reply = response.getData().getChoices().get(0).getMessage();
                System.out.println("AI 回复: " + reply);
            } else {
                System.err.println("错误: " + response.getMsg());
            }
        }
    }
    ```

    **流式调用**

    ```java  theme={null}
    import ai.z.openapi.ZhipuAiClient;
    import ai.z.openapi.service.model.ChatCompletionCreateParams;
    import ai.z.openapi.service.model.ChatCompletionResponse;
    import ai.z.openapi.service.model.ChatMessage;
    import ai.z.openapi.service.model.ChatMessageRole;
    import ai.z.openapi.service.model.ChatThinking;
    import ai.z.openapi.service.model.Delta;
    import java.util.Arrays;

    public class StreamingChat {
        public static void main(String[] args) {
            // 初始化客户端
            ZhipuAiClient client = ZhipuAiClient.builder()
                .apiKey("your-api-key")
                .build();

            // 创建流式聊天完成请求
            ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
                .model("glm-4.6")
                .messages(Arrays.asList(
                    ChatMessage.builder()
                        .role(ChatMessageRole.USER.value())
                        .content("作为一名营销专家，请为我的产品创作一个吸引人的口号")
                        .build(),
                    ChatMessage.builder()
                        .role(ChatMessageRole.ASSISTANT.value())
                        .content("当然，要创作一个吸引人的口号，请告诉我一些关于您产品的信息")
                        .build(),
                    ChatMessage.builder()
                        .role(ChatMessageRole.USER.value())
                        .content("智谱AI开放平台")
                        .build()
                ))
                .thinking(ChatThinking.builder().type("enabled").build())
                .stream(true)  // 启用流式输出
                .maxTokens(65536)
                .temperature(1.0f)
                .build();

            ChatCompletionResponse response = client.chat().createChatCompletion(request);

            if (response.isSuccess()) {
                response.getFlowable().subscribe(
                    // Process streaming message data
                    data -> {
                        if (data.getChoices() != null && !data.getChoices().isEmpty()) {
                            Delta delta = data.getChoices().get(0).getDelta();
                            System.out.print(delta + "\n");
                        }
                    },
                    // Process streaming response error
                    error -> System.err.println("\nStream error: " + error.getMessage()),
                    // Process streaming response completion event
                    () -> System.out.println("\nStreaming response completed")
                );
            } else {
                System.err.println("Error: " + response.getMsg());
            }
        }
    }
    ```
  </Tab>

  <Tab title="Python(旧)">
    **更新 SDK 至 2.1.5.20250726**

    ```bash  theme={null}
    # 安装最新版本
    pip install zhipuai

    # 或指定版本
    pip install zhipuai==2.1.5.20250726
    ```

    **基础调用**

    ```python  theme={null}
    from zhipuai import ZhipuAI

    client = ZhipuAI(api_key="your-api-key")  # 请填写您自己的 API Key

    response = client.chat.completions.create(
      model="glm-4.6",
      messages=[
          {"role": "user", "content": "作为一名营销专家，请为我的产品创作一个吸引人的口号"},
          {"role": "assistant", "content": "当然，要创作一个吸引人的口号，请告诉我一些关于您产品的信息"},
          {"role": "user", "content": "智谱AI开放平台"}
      ],
      thinking={
        "type": "enabled",
      },
      max_tokens=65536,
      temperature=1.0
    )

    # 获取完整回复
    print(response.choices[0].message)
    ```

    **流式调用**

    ```python  theme={null}
    from zhipuai import ZhipuAI

    client = ZhipuAI(api_key="your-api-key")  # 请填写您自己的 API Key

    response = client.chat.completions.create(
      model="glm-4.6",
      messages=[
          {"role": "user", "content": "作为一名营销专家，请为我的产品创作一个吸引人的口号"},
          {"role": "assistant", "content": "当然，要创作一个吸引人的口号，请告诉我一些关于您产品的信息"},
          {"role": "user", "content": "智谱AI开放平台"}
      ],
      thinking={
        "type": "enabled",
      },
      stream=True,              # 启用流式输出
      max_tokens=65536,
      temperature=1.0
    )

    # 流式获取回复
    for chunk in response:
    if chunk.choices[0].delta.reasoning_content:
    print(chunk.choices[0].delta.reasoning_content, end='', flush=True)

    if chunk.choices[0].delta.content:
    print(chunk.choices[0].delta.content, end='', flush=True)
    ```
  </Tab>
</Tabs>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt