# GLM-Z1

<Note>
  GLM-Z1 系列模型已下线，建议选择最新旗舰文本模型 [GLM-4.6](/cn/guide/models/text/glm-4.6)，该模型同样支持思考模式。
</Note>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-list.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 概览 </div>

GLM-Z1 系列包含Air、AirX、FlashX、Flash这四个模型。

1. GLM-Z1-Air 是一款具备深度思考能力的推理模型。该模型通过推理数据增强和对齐优化，数理推理能力显著增强，适合高频调用场景。GLM-Z1-AirX 为该模型的高速版。
2. GLM-Z1-FlashX 具有超快推理速度和更快并发保障，极致性价比，进一步降低推理模型的使用门槛，是免费推理模型 GLM-Z1-Flash 的增强版本。

<Tabs>
  <Tab title="GLM-Z1-Air">
    <CardGroup cols={3}>
      <Card title="定位" icon={<svg style={{maskImage: "url(/resource/icon/star.svg)", WebkitMaskImage: "url(/resource/icon/star.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        高性价比
      </Card>

      <Card title="价格" icon={<svg style={{maskImage: "url(/resource/icon/coins.svg)", WebkitMaskImage: "url(/resource/icon/coins.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        0.5 元 / 百万 Tokens
      </Card>

      <Card title="输入模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        文本
      </Card>

      <Card title="输出模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        文本
      </Card>

      <Card title="上下文窗口" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        128K
      </Card>

      <Card title="最大输出 Tokens" icon={<svg style={{maskImage: "url(/resource/icon/maximize.svg)", WebkitMaskImage: "url(/resource/icon/maximize.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        32K
      </Card>
    </CardGroup>
  </Tab>

  <Tab title="GLM-Z1-AirX">
    <CardGroup cols={3}>
      <Card title="定位" icon={<svg style={{maskImage: "url(/resource/icon/star.svg)", WebkitMaskImage: "url(/resource/icon/star.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        极速推理
      </Card>

      <Card title="价格" icon={<svg style={{maskImage: "url(/resource/icon/coins.svg)", WebkitMaskImage: "url(/resource/icon/coins.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        5 元 / 百万 Tokens
      </Card>

      <Card title="输入模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        文本
      </Card>

      <Card title="输出模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        文本
      </Card>

      <Card title="上下文窗口" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        32K
      </Card>

      <Card title="最大输出Tokens" icon={<svg style={{maskImage: "url(/resource/icon/maximize.svg)", WebkitMaskImage: "url(/resource/icon/maximize.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        30K
      </Card>
    </CardGroup>
  </Tab>

  <Tab title="GLM-Z1-FlashX">
    <CardGroup cols={3}>
      <Card title="定位" icon={<svg style={{maskImage: "url(/resource/icon/star.svg)", WebkitMaskImage: "url(/resource/icon/star.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        高速低价
      </Card>

      <Card title="价格" icon={<svg style={{maskImage: "url(/resource/icon/coins.svg)", WebkitMaskImage: "url(/resource/icon/coins.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        0.1 元 / 百万 Tokens
      </Card>

      <Card title="输入模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        文本
      </Card>

      <Card title="输出模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        文本
      </Card>

      <Card title="上下文窗口" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        128K
      </Card>

      <Card title="最大输出Tokens" icon={<svg style={{maskImage: "url(/resource/icon/maximize.svg)", WebkitMaskImage: "url(/resource/icon/maximize.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        32K
      </Card>
    </CardGroup>
  </Tab>

  <Tab title="GLM-Z1-Flash">
    <CardGroup cols={3}>
      <Card title="定位" icon={<svg style={{maskImage: "url(/resource/icon/star.svg)", WebkitMaskImage: "url(/resource/icon/star.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        免费版
      </Card>

      <Card title="价格" icon={<svg style={{maskImage: "url(/resource/icon/coins.svg)", WebkitMaskImage: "url(/resource/icon/coins.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        /
      </Card>

      <Card title="输入模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        文本
      </Card>

      <Card title="输出模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        文本
      </Card>

      <Card title="上下文窗口" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        128K
      </Card>

      <Card title="最大输出Tokens" icon={<svg style={{maskImage: "url(/resource/icon/maximize.svg)", WebkitMaskImage: "url(/resource/icon/maximize.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        32K
      </Card>
    </CardGroup>
  </Tab>
</Tabs>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/bolt.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 能力支持 </div>

<CardGroup cols={3}>
  <Card title="内置深度思考" icon={<svg style={{maskImage: "url(/resource/icon/brain.svg)", WebkitMaskImage: "url(/resource/icon/brain.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    默认内置深度思考，提供更深层次的推理分析
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

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/stars.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 推荐场景 </div>

<AccordionGroup>
  <Accordion title="人岗匹配" defaultOpen="true">
    快速、精准地提取简历中的技能与岗位要求，结合专业度、技能、经验等维度生成量化匹配度报告，为企业招聘提供科学依据。
  </Accordion>

  <Accordion title="剧本创作">
    生成完整剧本内容，覆盖角色对白、场景转换与情节冲突设计等多类型创作需求，支持连续剧集剧情结构与情感的衔接。（推荐与[搜索工具](/cn/guide/tools/web-search)结合，获取热点、流行趋势、社会关注，让剧本紧跟潮流）
  </Accordion>

  <Accordion title="文献对比分析">
    自动化解析海量文献的核心观点与数据，精准识别跨文献的研究方法异同及结论关联性，输出结构化对比结论与分析报告。
  </Accordion>

  <Accordion title="小语种数据合成">
    支持用户通过少量的优质小语种种子数据，利用数据合成功能合成大量的类似数据，使得合成的小语种语料不高度相似且不掺杂其他信息。
  </Accordion>
</AccordionGroup>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/gauge-high.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 使用资源 </div>

[体验中心](https://www.bigmodel.cn/trialcenter/modeltrial/text?modelCode=glm-z1-air)：快速测试模型在业务场景上的效果<br />
[接口文档](/api-reference/%E6%A8%A1%E5%9E%8B-api/%E5%AF%B9%E8%AF%9D%E8%A1%A5%E5%85%A8)：API 调用方式

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 详细介绍 </div>

<Steps>
  <Step title="GLM-Z1-Air" icon={<svg style={{maskImage: "url(/resource/icon/star.svg)", WebkitMaskImage: "url(/resource/icon/star.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    GLM-Z1-Air 在 GLM-4-Air-250414 的基础上，采用了冷启动与扩展强化学习策略，并针对数学、代码、逻辑等关键任务进行了深度优化训练。与基础模型相比，GLM-Z1-Air 的数理能力和复杂问题解决能力得到显著增强。此外，训练中整合了基于对战排序反馈的通用强化学习技术，有效提升了模型的通用能力。

    在部分任务上，GLM-Z1-Air 通过在 AIME 24/25、LiveCodeBench、GPQA 等基准测试中的评估，展现了较强的数理推理能力，能够支持解决更广泛复杂任务。

    ![Description](https://cdn.bigmodel.cn/markdown/1748596207466z1air.png?attname=z1air.png)
  </Step>

  <Step title="GLM-Z1-AirX" icon={<svg style={{maskImage: "url(/resource/icon/star.svg)", WebkitMaskImage: "url(/resource/icon/star.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    GLM-Z1-AirX 在训练中整合了基于对战排序反馈的通用强化学习技术，有效提升了模型的通用能力。该模型具备强大的复杂推理能力，在逻辑推理、数学、编程等领域表现优异，推理速度极快远超同类模型。GLM-Z1-AirX 专为高频调用场景设计，在实时数据分析、智能客服等高并发业务中，可实时响应显著降低用户等待耗时。

    ![Description](https://cdn.bigmodel.cn/markdown/1748596799908airX.png?attname=airX.png)
  </Step>

  <Step title="GLM-Z1-FlashX" icon={<svg style={{maskImage: "url(/resource/icon/star.svg)", WebkitMaskImage: "url(/resource/icon/star.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    GLM-Z1-FlashX 作为轻量化解决方案，在保留 GLM-Z1-Air 完整技术栈的前提下，更轻量级、更高速、更优惠。虽然参数量更少，但 GLM-Z1-FlashX 在数学逻辑推理、长文档处理、代码生成等复杂任务中依然表现出色，整体性能已跻身同尺寸开源模型的领先水平。 GLM-Z1-FlashX 为开发者提供低门槛 AI 实验与轻量化部署支持，兼顾推理效率与推理成本，尤其适合高频调用场景。
  </Step>
</Steps>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-code.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 调用示例 </div>

以下是一个完整的调用示例，以 GLM-Z1-Air 模型为例。

<Tabs>
  <Tab title="cURL">
    **基础调用**

    ```bash  theme={null}
    curl -X POST "https://open.bigmodel.cn/api/paas/v4/chat/completions" \
         -H "Authorization: Bearer your-api-key" \
         -H "Content-Type: application/json" \
         -d '{
           "model": "glm-z1-air",
           "messages": [
             {
               "role": "system",
               "content": "你是一个擅长创作潮流剧集剧本的 AI，生成覆盖角色对白、场景转换与情节冲突设计等多类型创作需求的剧本内容，支持连续剧集剧情结构与情感的衔接，且能紧密结合当下热点、流行趋势和社会关注。"
             },
             {
               "role": "user",
               "content": "创作一个围绕当代年轻人创业与情感纠葛的剧集剧本开篇，包含第一集和第二集的内容，要体现当下年轻人对梦想的追求、创业的艰辛，以及复杂的情感关系，可结合2024 - 2025年的热点元素。"
             }
           ],
           "max_tokens": 4096,
           "temperature": 0.7
         }'
    ```

    **流式调用**

    ```bash  theme={null}
    curl -X POST "https://open.bigmodel.cn/api/paas/v4/chat/completions" \
         -H "Authorization: Bearer your-api-key" \
         -H "Content-Type: application/json" \
         -d '{
           "model": "glm-z1-air",
           "messages": [
             {
               "role": "system",
               "content": "你是一个擅长创作潮流剧集剧本的AI，生成覆盖角色对白、场景转换与情节冲突设计等多类型创作需求的剧本内容，支持连续剧集剧情结构与情感的衔接，且能紧密结合当下热点、流行趋势和社会关注。"
             },
             {
               "role": "user",
               "content": "创作一个围绕当代年轻人创业与情感纠葛的剧集剧本开篇，包含第一集和第二集的内容，要体现当下年轻人对梦想的追求、创业的艰辛，以及复杂的情感关系，可结合2024 - 2025年的热点元素。"
             }
           ],
           "max_tokens": 4096,
           "temperature": 0.7,
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

    **基础调用**

    ```python  theme={null}
    from zai import ZhipuAiClient
    client = ZhipuAiClient(api_key="your-api-key")  # 请填写您自己的 APIKey
    response = client.chat.completions.create(
        model="glm-z1-air",  # 请填写您要调用的模型名称
        messages=[
            {"role": "system", "content": "你是一个擅长创作潮流剧集剧本的AI，生成覆盖角色对白、场景转换与情节冲突设计等多类型创作需求的剧本内容，支持连续剧集剧情结构与情感的衔接，且能紧密结合当下热点、流行趋势和社会关注。"},
            {"role": "user", "content": "创作一个围绕当代年轻人创业与情感纠葛的剧集剧本开篇，包含第一集和第二集的内容，要体现当下年轻人对梦想的追求、创业的艰辛，以及复杂的情感关系，可结合2024 - 2025年的热点元素。"},
        ],
        max_tokens=4096,
        temperature=0.7
    )
    print(response.choices[0].message.content)
    ```

    **流式调用**

    ```python  theme={null}
    from zai import ZhipuAiClient
    client = ZhipuAiClient(api_key="your-api-key")  # 请填写您自己的APIKey

    stream = client.chat.completions.create(
        model="glm-z1-air",
        messages=[
            {"role": "system", "content": "你是一个擅长创作潮流剧集剧本的AI，生成覆盖角色对白、场景转换与情节冲突设计等多类型创作需求的剧本内容，支持连续剧集剧情结构与情感的衔接，且能紧密结合当下热点、流行趋势和社会关注。"},
            {"role": "user", "content": "创作一个围绕当代年轻人创业与情感纠葛的剧集剧本开篇，包含第一集和第二集的内容，要体现当下年轻人对梦想的追求、创业的艰辛，以及复杂的情感关系，可结合2024 - 2025年的热点元素。"},
        ],
        max_tokens=4096,
        temperature=0.7,
        stream=True
    )

    for chunk in stream:
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="")
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
    import java.util.Arrays;

    public class GLMZAirExample {
        public static void main(String[] args) {
            String apiKey = ""; // 请填写您自己的APIKey
            ZhipuAiClient client = ZhipuAiClient.builder()
                .apiKey(apiKey)
                .build();
            
            ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
                .model("glm-z1-air")
                .messages(Arrays.asList(
                    ChatMessage.builder()
                        .role(ChatMessageRole.SYSTEM.value())
                        .content("你是一个擅长创作潮流剧集剧本的AI，生成覆盖角色对白、场景转换与情节冲突设计等多类型创作需求的剧本内容，支持连续剧集剧情结构与情感的衔接，且能紧密结合当下热点、流行趋势和社会关注。")
                        .build(),
                    ChatMessage.builder()
                        .role(ChatMessageRole.USER.value())
                        .content("创作一个围绕当代年轻人创业与情感纠葛的剧集剧本开篇，包含第一集和第二集的内容，要体现当下年轻人对梦想的追求、创业的艰辛，以及复杂的情感关系，可结合2024 - 2025年的热点元素。")
                        .build()
                ))
                .maxTokens(4096)
                .temperature(0.7f)
                .build();
            
            ChatCompletionResponse response = client.chat().createChatCompletion(request);
            
            if (response.isSuccess()) {
                Object reply = response.getData().getChoices().get(0).getMessage().getContent();
                System.out.println(reply);
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
    import ai.z.openapi.service.model.Delta;
    import java.util.Arrays;

    public class GLMZAirStreamExample {
        public static void main(String[] args) {
            String apiKey = ""; // 请填写您自己的APIKey
            ZhipuAiClient client = ZhipuAiClient.builder()
                .apiKey(apiKey)
                .build();
            
            ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
                .model("glm-z1-air")
                .messages(Arrays.asList(
                    ChatMessage.builder()
                        .role(ChatMessageRole.SYSTEM.value())
                        .content("你是一个擅长创作潮流剧集剧本的AI，生成覆盖角色对白、场景转换与情节冲突设计等多类型创作需求的剧本内容，支持连续剧集剧情结构与情感的衔接，且能紧密结合当下热点、流行趋势和社会关注。")
                        .build(),
                    ChatMessage.builder()
                        .role(ChatMessageRole.USER.value())
                        .content("创作一个围绕当代年轻人创业与情感纠葛的剧集剧本开篇，包含第一集和第二集的内容，要体现当下年轻人对梦想的追求、创业的艰辛，以及复杂的情感关系，可结合2024 - 2025年的热点元素。")
                        .build()
                ))
                .maxTokens(4096)
                .temperature(0.7f)
                .stream(true)
                .build();

            ChatCompletionResponse response = client.chat().createChatCompletion(request);

            if (response.isSuccess()) {
                response.getFlowable().subscribe(
                    // Process streaming message data
                    data -> {
                        if (data.getChoices() != null && !data.getChoices().isEmpty()) {
                            Delta delta = data.getChoices().get(0).getDelta();
                            System.out.print(delta + "\n");
                    }},
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
    **基础调用**

    ```python  theme={null}
    import zhipuai
    client = ZhipuAI(api_key="your-api-key")

    response = client.chat.completions.create(
        model="glm-z1-air",
        messages=[
            {"role": "system", "content": "你是一个擅长创作潮流剧集剧本的AI，生成覆盖角色对白、场景转换与情节冲突设计等多类型创作需求的剧本内容，支持连续剧集剧情结构与情感的衔接，且能紧密结合当下热点、流行趋势和社会关注。"},
            {"role": "user", "content": "创作一个围绕当代年轻人创业与情感纠葛的剧集剧本开篇，包含第一集和第二集的内容，要体现当下年轻人对梦想的追求、创业的艰辛，以及复杂的情感关系，可结合2024 - 2025年的热点元素。"}
        ],
        max_tokens=4096,
        temperature=0.7
    )
    print(response.choices[0].message.content)
    ```

    **流式调用**

    ```python  theme={null}
    import zhipuai
    client = ZhipuAI(api_key="your-api-key")

    response = client.chat.completions.create(
        model="glm-z1-air",
        messages=[
            {"role": "system", "content": "你是一个擅长创作潮流剧集剧本的AI，生成覆盖角色对白、场景转换与情节冲突设计等多类型创作需求的剧本内容，支持连续剧集剧情结构与情感的衔接，且能紧密结合当下热点、流行趋势和社会关注。"},
            {"role": "user", "content": "创作一个围绕当代年轻人创业与情感纠葛的剧集剧本开篇，包含第一集和第二集的内容，要体现当下年轻人对梦想的追求、创业的艰辛，以及复杂的情感关系，可结合2024 - 2025年的热点元素。"}
        ],
        max_tokens=4096,
        temperature=0.7,
        stream=True
    )

    for chunk in response:
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="")
    ```
  </Tab>
</Tabs>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/square-user.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 用户并发权益 </div>

API 调用会受到速率限制，当前我们限制的维度是请求并发数量（在途请求任务数量）。不同等级的用户并发保障如下。

<Tabs>
  <Tab title="GLM-Z1-Air">
    | V0 | V1 | V2 | V3 |
    | :- | :- | :- | :- |
    | 30 | 40 | 50 | 60 |
  </Tab>

  <Tab title="GLM-Z1-AirX">
    | V0 | V1 | V2 | V3 |
    | :- | :- | :- | :- |
    | 30 | 40 | 50 | 60 |
  </Tab>

  <Tab title="GLM-Z1-FlashX">
    | V0 | V1  | V2  | V3  |
    | :- | :-- | :-- | :-- |
    | 50 | 100 | 150 | 200 |
  </Tab>

  <Tab title="GLM-Z1-Flash">
    | V0 | V1 | V2 | V3 |
    | :- | :- | :- | :- |
    | 30 | 40 | 50 | 60 |
  </Tab>
</Tabs>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt