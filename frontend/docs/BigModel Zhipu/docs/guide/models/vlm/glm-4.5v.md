# GLM-4.5V

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-list.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 概览 </div>

GLM-4.5V 是智谱基于 MOE 架构的视觉推理模型，以 106B 的总参数量和 12B 激活参数量，在各类基准测试中达到全球同级别开源多模态模型 SOTA，涵盖图像、视频、文档理解及 GUI 任务等常见任务。

<CardGroup cols={2}>
  <Card title="定位" icon={<svg style={{maskImage: "url(/resource/icon/star.svg)", WebkitMaskImage: "url(/resource/icon/star.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    视觉推理
  </Card>

  <Card title="输入模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    视频、图像、文本、文件
  </Card>

  <Card title="输出模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    文本
  </Card>

  <Card title="上下文窗口" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    64K
  </Card>
</CardGroup>

<Tip>
  GLM-4.5V 价格详情请前往[价格界面](https://open.bigmodel.cn/pricing)
</Tip>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/bolt.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 能力支持 </div>

<CardGroup cols={3}>
  <Card title="深度思考" href="/cn/guide/capabilities/thinking" icon={<svg style={{maskImage: "url(/resource/icon/brain.svg)", WebkitMaskImage: "url(/resource/icon/brain.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    启用深度思考模式，提供更深层次的推理分析
  </Card>

  <Card title="视觉理解" icon={<svg style={{maskImage: "url(/resource/icon/eye.svg)", WebkitMaskImage: "url(/resource/icon/eye.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    强大的视觉理解能力，支持图片，视频，文件
  </Card>

  <Card title="流式输出" href="/cn/guide/capabilities/streaming" icon={<svg style={{maskImage: "url(/resource/icon/maximize.svg)", WebkitMaskImage: "url(/resource/icon/maximize.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    支持实时流式响应，提升用户交互体验
  </Card>

  <Card title="上下文缓存" href="/cn/guide/capabilities/cache" icon={<svg style={{maskImage: "url(/resource/icon/database.svg)", WebkitMaskImage: "url(/resource/icon/database.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    智能缓存机制，优化长对话性能
  </Card>
</CardGroup>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/stars.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 推荐场景 </div>

<AccordionGroup>
  <Accordion title="前端复刻">
    支持将网页截图或完整浏览录屏输入模型，自动解析布局与交互逻辑，高精度还原页面元素与二级页面结构，生成可交互的 HTML 代码，便于直接使用或二次优化。
  </Accordion>

  <Accordion title="Grounding">
    可根据文本描述精准定位指定人物或物体，支持按外貌、衣着等多条件组合筛选。适用于安检、质检、内容审核、遥感监测等实业场景，定位精度高。
  </Accordion>

  <Accordion title="GUI Agent">
    识别并理解屏幕画面，执行点击、滑动等操作指令，精准完成如 PPT 修改、Word 编辑等任务，全程自动化，适用于各类办公场景，为智能体操作任务提供可靠支持。
  </Accordion>

  <Accordion title="复杂长文档解读">
    支持对长文档进行深度解析，处理文本、表格、图形等多模态内容，可总结、翻译、提取关键信息，并在原有观点基础上提出新见解，适用于研报分析、科研、教育等专业场景。
  </Accordion>

  <Accordion title="图像识别与推理">
    结合强推理能力与丰富世界知识，在无需搜索的情况下推断图像背景信息。支持将图表、曲线等内容转为结构化数据，精确还原内容与布局，适用于无电子版表格的快速数字化处理，避免手动录入的繁琐与错误。
  </Accordion>

  <Accordion title="视频理解">
    支持解析长时视频内容，精准识别并推理视频中的时间线、人物关系、事件发展及因果逻辑，适用于安防监控、影视内容分析、舆情事件追踪等领域，实现高效的视频信息抽取与洞察。
  </Accordion>

  <Accordion title="学科解题">
    具备图文感知、知识储备与推理能力，能够解决复杂的图文结合题目，适用于 K12 教育场景中的解题和讲解需求。
  </Accordion>
</AccordionGroup>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/gauge-high.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 使用资源 </div>

[体验中心](https://www.bigmodel.cn/trialcenter/modeltrial/visual?modelCode=glm-4.5v)：快速测试模型在业务场景上的效果<br />
[接口文档](/api-reference/%E6%A8%A1%E5%9E%8B-api/%E5%AF%B9%E8%AF%9D%E8%A1%A5%E5%85%A8)：API 调用方式

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 详细介绍 </div>

<Steps>
  <Step title="开源多模态 SOTA" titleSize="h3">
    GLM-4.5V 基于 GLM-4.5-Air，延续 GLM-4.1V-Thinking 技术路线进行迭代升级，在 41 个公开视觉多模态榜单中综合效果达到同级别开源模型 SOTA 性能，涵盖图像、视频、文档理解及 GUI 任务等常见任务。

    ![Description](https://cdn.bigmodel.cn/markdown/1754969019359glm-4.5v-16.jpeg?attname=glm-4.5v-16.jpeg)
  </Step>

  <Step title="支持 Thinking 和 Non-Thinking" stepNumber={2} titleSize="h3">
    GLM-4.5V 新增“思考模式”开关，用户可在快速响应与深度推理之间自由切换，根据任务需求灵活平衡处理速度与输出质量。
  </Step>
</Steps>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/ballot.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 应用示例 </div>

<Tabs>
  <Tab title="视频前端复刻">
    <CardGroup cols={2}>
      <Card title="输入" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        <video className="m-0 p-1" src="https://cdn.bigmodel.cn/static/glm-4.5-video1.mp4" controls />

        prompt：帮我生成这个video中所展示的html code ，需要包含视频中的点击、跳转、交互等
      </Card>

      <Card title="输出" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        代码略.

        渲染后的网页截图:

        ![Description](https://cdn.bigmodel.cn/markdown/1754968553435glm-4.5v-2.png?attname=glm-4.5v-2.png)

        <br />

        ![Description](https://cdn.bigmodel.cn/markdown/1754968563556glm-4.5v-3.png?attname=glm-4.5v-3.png)
      </Card>
    </CardGroup>
  </Tab>

  <Tab title="图片翻译">
    <CardGroup cols={2}>
      <Card title="输入" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        ![Description](https://cdn.bigmodel.cn/markdown/1754968574466glm-4.5v-4.png?attname=glm-4.5v-4.png)

        prompt：将图中的文字翻译成中文
      </Card>

      <Card title="输出" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        翻译结果：

        ![Description](https://cdn.bigmodel.cn/markdown/1754968584020glm-4.5v-5.png?attname=glm-4.5v-5.png)
      </Card>
    </CardGroup>
  </Tab>

  <Tab title="GUI Agent">
    <CardGroup cols={2}>
      <Card title="输入" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        ![Description](https://cdn.bigmodel.cn/markdown/1754968632215glm-4.5v-6.png?attname=glm-4.5v-6.png)

        prompt：Modify the data in the first row on slide 4 to "89", "21", "900" and "None"
      </Card>

      <Card title="输出" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        修改结果：

        ![Description](https://cdn.bigmodel.cn/markdown/1754968746754glm-4.5v-7.png?attname=glm-4.5v-7.png)
      </Card>
    </CardGroup>
  </Tab>

  <Tab title="图表转换">
    <CardGroup cols={2}>
      <Card title="输入" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        ![Description](https://cdn.bigmodel.cn/markdown/1754968758489glm-4.5v-8.png?attname=glm-4.5v-8.png)

        prompt：将图中的表格转为markdown格式
      </Card>

      <Card title="输出" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        代码略.

        渲染后的结果：

        ![Description](https://cdn.bigmodel.cn/markdown/1754968768530glm-4.5v-9.png?attname=glm-4.5v-9.png)
      </Card>
    </CardGroup>
  </Tab>

  <Tab title="学科解题">
    <CardGroup cols={2}>
      <Card title="输入" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        ![Description](https://cdn.bigmodel.cn/markdown/1754968775084glm-4.5v-10.png?attname=glm-4.5v-10.png)

        prompt：解题
      </Card>

      <Card title="输出" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        ```json  theme={null}
        ### 解题过程：\n\n
        #### 题目分析：\n
        圆形金属线圈静止，匀强磁场绕直径轴匀速
        转动，等效于线圈在磁场中切割磁感线，产
        生正弦式交变电动势。线圈内阻忽略不计，
        故电动势全部作用于变压器原线圈。变压器
        为理想变压器，电压表测量副线圈电压，电
        流表测量副线圈电流。\n\n\n
        #### 选项逐一分析：\n
        ##### **A. 图示位置磁场
        方向与线圈平面垂直，电流表示数为0**  
        \n图示位置为中性面，磁通量最大，但磁
        通量变化率为零，感应电动势瞬时值为0。
        然而，电流表测量的是有效值（非瞬时值），
        交流电的有效值不为零，故A错误。\n\n
        ##### 
        （其余内容省略...）
        ### 最终答案：B
        ```
      </Card>
    </CardGroup>
  </Tab>

  <Tab title="文档解读">
    <CardGroup cols={2}>
      <Card title="输入" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        ![Description](https://cdn.bigmodel.cn/markdown/1754968781822glm-4.5v-11.png?attname=glm-4.5v-11.png)

        prompt：总结这篇研报的主要观点，并从专业的角度对其进行补充，得出对AI未来发展前景的预测。
      </Card>

      <Card title="输出" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        ```markdown  theme={null}
        一、研报核心观点总结
        该研报围绕**AI发展的“新 Scaling、新范
        式、新 TAM”**展开，核心观点如下：
        1. 模型层：预训练 Scaling Law 有望开启
        新起点
        预训练阶段仍是模型性能提升的关键，但传
        统 Transformer 架构面临参数扩张放缓的瓶
        颈。近期新架构（如腾讯 Turbo-S 的
        Transformer-Mamba 混合架构、Google 
        Gemini Diffusion 的扩散模型）的出现，
        以及数据量（Meta Llama 4、
        Google Gemini 达 2 万亿 token 级）和算力
        集群（OpenAI 星际之门、xAI Colossus）
        的支持，为预训练 Scaling Law 的延续提供
        了新路径。
        理论上，Ilya Sutskever 提出“模型架构改
        进可能是 Scaling Law 的新方向”，若能突破
        现有架构限制，模型性能有望进一步提升。
        （其余内容省略...）
        ```
      </Card>
    </CardGroup>
  </Tab>

  <Tab title="Grounding">
    <CardGroup cols={2}>
      <Card title="输入" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        ![Description](https://cdn.bigmodel.cn/markdown/1754968795362glm-4.5v-12.png?attname=glm-4.5v-12.png)

        prompt：Tell me the position of the couple in the picture. The short-haired guy is wearing a pink top and blue shorts, and the girl is in a cyan dress. Answer in \[x1,y1,x2,y2] format.
      </Card>

      <Card title="输出" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        ```expandable expandable theme={null}
        The position of the couple in the
        picture, where the short-haired 
        guy is wearing a pink top and blue
        shorts, and the girl is in a cyan 
        dress, is [835,626,931,883].
        ```

        渲染后的结果：

        ![Description](https://cdn.bigmodel.cn/markdown/1754968823292glm-4.5v-13.png?attname=glm-4.5v-13.png)
      </Card>
    </CardGroup>
  </Tab>
</Tabs>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-code.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 调用示例 </div>

### 基础与流式

<Tabs>
  <Tab title="cURL">
    **基础调用**

    ```bash  theme={null}
    curl -X POST \
      https://open.bigmodel.cn/api/paas/v4/chat/completions \
      -H "Authorization: Bearer your-api-key" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "glm-4.5v",
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "image_url",
                "image_url": {
                  "url": "https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG"
                }
              },
              {
                "type": "text",
                "text": "Where is the second bottle of beer from the right on the table?  Provide coordinates in [[xmin,ymin,xmax,ymax]] format"
              }
            ]
          }
        ],
        "thinking": {
          "type":"enabled"
        }
      }'
    ```

    **流式调用**

    ```bash  theme={null}
    curl -X POST \
      https://open.bigmodel.cn/api/paas/v4/chat/completions \
      -H "Authorization: Bearer your-api-key" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "glm-4.5v",
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "image_url",
                "image_url": {
                  "url": "https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG"
                }
              },
              {
                "type": "text",
                "text": "Where is the second bottle of beer from the right on the table?  Provide coordinates in [[xmin,ymin,xmax,ymax]] format"
              }
            ]
          }
        ],
        "thinking": {
          "type":"enabled"
        },
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

    client = ZhipuAiClient(api_key="")  # 填写您自己的 APIKey
    response = client.chat.completions.create(
        model="glm-4.5v",  # 填写需要调用的模型名称
        messages=[
            {
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG"
                        }
                    },
                    {
                        "type": "text",
                        "text": "Where is the second bottle of beer from the right on the table?  Provide coordinates in [[xmin,ymin,xmax,ymax]] format"
                    }
                ],
                "role": "user"
            }
        ],
        thinking={
            "type":"enabled"
        }
    )
    print(response.choices[0].message)
    ```

    **流式调用**

    ```python  theme={null}
    from zai import ZhipuAiClient

    client = ZhipuAiClient(api_key="")  # 填写您自己的APIKey
    response = client.chat.completions.create(
        model="glm-4.5v",  # 填写需要调用的模型名称
        messages=[
            {
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG"
                        }
                    },
                    {
                        "type": "text",
                        "text": "Where is the second bottle of beer from the right on the table?  Provide coordinates in [[xmin,ymin,xmax,ymax]] format"
                    }
                ],
                "role": "user"
            }
        ],
        thinking={
            "type":"enabled"
        },
        stream=True
    )

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
    import ai.z.openapi.service.model.*;
    import ai.z.openapi.core.Constants;
    import java.util.Arrays;

    public class GLM45VExample {
        public static void main(String[] args) {
            String apiKey = ""; // 请填写您自己的APIKey
            ZhipuAiClient client = ZhipuAiClient.builder()
                .apiKey(apiKey)
                .build();

            ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
                .model("glm-4.5v")
                .messages(Arrays.asList(
                    ChatMessage.builder()
                        .role(ChatMessageRole.USER.value())
                        .content(Arrays.asList(
                            MessageContent.builder()
                                .type("text")
                                .text("描述下这张图片")
                                .build(),
                            MessageContent.builder()
                                .type("image_url")
                                .imageUrl(ImageUrl.builder()
                                .url("https://aigc-files.bigmodel.cn/api/cogview/20250723213827da171a419b9b4906_0.png")
                                .build())
                        .build()))
                    .build()))
                .build();

            ChatCompletionResponse response = client.chat().createChatCompletion(request);

            if (response.isSuccess()) {
                Object reply = response.getData().getChoices().get(0).getMessage();
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
    import ai.z.openapi.service.model.*;
    import ai.z.openapi.core.Constants;
    import java.util.Arrays;

    public class GLM45VStreamExample {
        public static void main(String[] args) {
            String apiKey = ""; // 请填写您自己的APIKey
            ZhipuAiClient client = ZhipuAiClient.builder()
                .apiKey(apiKey)
                .build();

            ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
                .model("glm-4.5v")
                .messages(Arrays.asList(
                    ChatMessage.builder()
                        .role(ChatMessageRole.USER.value())
                        .content(Arrays.asList(
                            MessageContent.builder()
                                .type("text")
                                .text("Where is the second bottle of beer from the right on the table?  Provide coordinates in [[xmin,ymin,xmax,ymax]] format")
                                .build(),
                            MessageContent.builder()
                                .type("image_url")
                                .imageUrl(ImageUrl.builder()
                                .url("https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG")
                                .build())
                        .build()))
                    .build()))
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
    **更新 SDK 至 2.1.5.20250726**

    ```bash  theme={null}
    # 安装最新版本
    pip install zhipuai

    # 或指定版本
    pip install zhipuai==2.1.5.20250726
    ```

    **基础调用**

    ```Python  theme={null}
    from zhipuai import ZhipuAI

    client = ZhipuAI(api_key="your-api-key")  # 填写您自己的APIKey

    response = client.chat.completions.create(
        model="glm-4.5v",  # 填写需要调用的模型名称
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "请帮我解决这个题目，给出详细过程和答案"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "传入图片的 url 地址"
                        }
                    }
                ]
            }
        ]
    )

    print(response.choices[0].message)
    ```

    **流式调用**

    ```python  theme={null}
    from zhipuai import ZhipuAI

    client = ZhipuAI(api_key="your-api-key")  # 填写您自己的APIKey

    response = client.chat.completions.create(
        model="glm-4.5v",  # 填写需要调用的模型名称
        messages=[
            {
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG"
                        }
                    },
                    {
                        "type": "text",
                        "text": "Where is the second bottle of beer from the right on the table?  Provide coordinates in [[xmin,ymin,xmax,ymax]] format"
                    }
                ],
                "role": "user"
            }
        ],
        thinking={
            "type":"enabled"
        },
        stream=True
    )

    for chunk in response:
        if chunk.choices[0].delta.reasoning_content:
            print(chunk.choices[0].delta.reasoning_content, end='', flush=True)

        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end='', flush=True)
    ```
  </Tab>
</Tabs>

### 多模态理解

> 不支持同时理解文件、视频和图像。

<Tabs>
  <Tab title="cURL">
    **图片理解**

    ```bash  theme={null}
    curl -X POST \
      https://open.bigmodel.cn/api/paas/v4/chat/completions \
      -H "Authorization: Bearer your-api-key" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "glm-4.5v",
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "image_url",
                "image_url": {
                  "url": "https://cdn.bigmodel.cn/static/logo/register.png"
                }
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": "https://cdn.bigmodel.cn/static/logo/api-key.png"
                }
              },
              {
                "type": "text",
                "text": "What are the pics talk about?"
              }
            ]
          }
        ],
        "thinking": {
          "type": "enabled"
        }
      }'
    ```

    **视频理解**

    ```bash  theme={null}
    curl -X POST \
      https://open.bigmodel.cn/api/paas/v4/chat/completions \
      -H "Authorization: Bearer your-api-key" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "glm-4.5v",
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "video_url",
                "video_url": {
                  "url": "https://cdn.bigmodel.cn/agent-demos/lark/113123.mov"
                }
              },
              {
                "type": "text",
                "text": "What are the video show about?"
              }
            ]
          }
        ],
        "thinking": {
          "type": "enabled"
        }
      }'
    ```

    **文件理解**

    ```bash  theme={null}
    curl -X POST \
      https://open.bigmodel.cn/api/paas/v4/chat/completions \
      -H "Authorization: Bearer your-api-key" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "glm-4.5v",
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "file_url",
                "file_url": {
                  "url": "https://cdn.bigmodel.cn/static/demo/demo2.txt"
                }
              },
              {
                "type": "file_url",
                "file_url": {
                  "url": "https://cdn.bigmodel.cn/static/demo/demo1.pdf"
                }
              },
              {
                "type": "text",
                "text": "What are the files show about?"
              }
            ]
          }
        ],
        "thinking": {
          "type": "enabled"
        }
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

    **图片理解**

    ```python  theme={null}
    from zai import ZhipuAiClient

    client = ZhipuAiClient(api_key="your-api-key")  # 填写您自己的APIKey
    response = client.chat.completions.create(
        model="glm-4.5v",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://cdn.bigmodel.cn/static/logo/register.png"
                        }
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://cdn.bigmodel.cn/static/logo/api-key.png"
                        }
                    },
                    {
                        "type": "text",
                        "text": "What are the pics talk about?"
                    }
                ]
            }
        ],
        thinking={
            "type": "enabled"
        }
    )
    print(response.choices[0].message)
    ```

    **传入 Base64 图片**

    ```python  theme={null}
    from zai import ZhipuAiClient
    import base64

    client = ZhipuAiClient(api_key="your-api-key")  # 填写您自己的APIKey

    img_path = "your/path/xxx.png"
    with open(img_path, "rb") as img_file:
        img_base = base64.b64encode(img_file.read()).decode("utf-8")

    response = client.chat.completions.create(
        model="glm-4.5v",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": img_base
                        }
                    },
                    {
                        "type": "text",
                        "text": "请描述这个图片"
                    }
                ]
            }
        ],
        thinking={
            "type": "enabled"
        }
    )
    print(response.choices[0].message)
    ```

    **视频理解**

    ```python  theme={null}
    from zai import ZhipuAiClient

    client = ZhipuAiClient(api_key="your-api-key")  # 填写您自己的APIKey
    response = client.chat.completions.create(
        model="glm-4.5v",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "video_url",
                        "video_url": {
                            "url": "https://cdn.bigmodel.cn/agent-demos/lark/113123.mov"
                        }
                    },
                    {
                        "type": "text",
                        "text": "What are the video show about?"
                    }
                ]
            }
        ],
        thinking={
            "type": "enabled"
        }
    )
    print(response.choices[0].message)
    ```

    **文件理解**

    ```python  theme={null}
    from zai import ZhipuAiClient

    client = ZhipuAiClient(api_key="your-api-key")  # 填写您自己的APIKey
    response = client.chat.completions.create(
        model="glm-4.5v",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "file_url",
                        "file_url": {
                            "url": "https://cdn.bigmodel.cn/static/demo/demo2.txt"
                        }
                    },
                    {
                        "type": "file_url",
                        "file_url": {
                            "url": "https://cdn.bigmodel.cn/static/demo/demo1.pdf"
                        }
                    },
                    {
                        "type": "text",
                        "text": "What are the files show about?"
                    }
                ]
            }
        ],
        thinking={
            "type": "enabled"
        }
    )
    print(response.choices[0].message)
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

    **图片理解**

    ```java  theme={null}
    import ai.z.openapi.ZhipuAiClient;
    import ai.z.openapi.service.model.*;
    import java.util.Arrays;

    public class MultiModalImageExample {
        public static void main(String[] args) {
            String apiKey = "your-api-key"; // 请填写您自己的APIKey
            ZhipuAiClient client = ZhipuAiClient.builder()
                .apiKey(apiKey)
                .build();

            ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
                .model("glm-4.5v")
                .messages(Arrays.asList(
                    ChatMessage.builder()
                        .role(ChatMessageRole.USER.value())
                        .content(Arrays.asList(
                            MessageContent.builder()
                                .type("image_url")
                                .imageUrl(ImageUrl.builder()
                                    .url("https://cdn.bigmodel.cn/static/logo/register.png")
                                    .build())
                                .build(),
                            MessageContent.builder()
                                .type("image_url")
                                .imageUrl(ImageUrl.builder()
                                    .url("https://cdn.bigmodel.cn/static/logo/api-key.png")
                                    .build())
                                .build(),
                            MessageContent.builder()
                                .type("text")
                                .text("What are the pics talk about?")
                                .build()
                        ))
                        .build()
                ))
                .thinking(ChatThinking.builder()
                    .type("enabled")
                    .build())
                .build();

            ChatCompletionResponse response = client.chat().createChatCompletion(request);

            if (response.isSuccess()) {
                Object reply = response.getData().getChoices().get(0).getMessage();
                System.out.println(reply);
            } else {
                System.err.println("错误: " + response.getMsg());
            }
        }
    }
    ```

    **传入 Base64 图片**

    ```java  theme={null}
    import ai.z.openapi.ZhipuAiClient;
    import ai.z.openapi.service.model.*;
    import java.io.File;
    import java.io.IOException;
    import java.nio.file.Files;
    import java.util.Arrays;
    import java.util.Base64;

    public class Base64ImageExample {
        public static void main(String[] args) throws IOException {
            String apiKey = "your-api-key"; // 请填写您自己的APIKey
            ZhipuAiClient client = ZhipuAiClient.builder().apiKey(apiKey).build();

            String file = ClassLoader.getSystemResource("your/path/xxx.png").getFile();
            byte[] bytes = Files.readAllBytes(new File(file).toPath());
            Base64.Encoder encoder = Base64.getEncoder();
            String base64 = encoder.encodeToString(bytes);

            ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
                .model("glm-4.5v")
                .messages(Arrays.asList(
                    ChatMessage.builder()
                        .role(ChatMessageRole.USER.value())
                        .content(Arrays.asList(
                            MessageContent.builder()
                                .type("image_url")
                                .imageUrl(ImageUrl.builder()
                                    .url(base64)
                                    .build())
                                .build(),
                            MessageContent.builder()
                                .type("text")
                                .text("What are the pics talk about?")
                                .build()))
                        .build()))
                .thinking(ChatThinking.builder().type("enabled").build())
                .build();

            ChatCompletionResponse response = client.chat().createChatCompletion(request);

            if (response.isSuccess()) {
                Object reply = response.getData().getChoices().get(0).getMessage();
                System.out.println(reply);
            } else {
                System.err.println("错误: " + response.getMsg());
            }
        }
    }
    ```

    **视频理解**

    ```java  theme={null}
    import ai.z.openapi.ZhipuAiClient;
    import ai.z.openapi.service.model.*;
    import java.util.Arrays;

    public class MultiModalVideoExample {
        public static void main(String[] args) {
            String apiKey = "your-api-key"; // 请填写您自己的APIKey
            ZhipuAiClient client = ZhipuAiClient.builder()
                .apiKey(apiKey)
                .build();

            ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
                .model("glm-4.5v")
                .messages(Arrays.asList(
                    ChatMessage.builder()
                        .role(ChatMessageRole.USER.value())
                        .content(Arrays.asList(
                            MessageContent.builder()
                                .type("video_url")
                                .videoUrl(VideoUrl.builder()
                                    .url("https://cdn.bigmodel.cn/agent-demos/lark/113123.mov")
                                    .build())
                                .build(),
                            MessageContent.builder()
                                .type("text")
                                .text("What are the video show about?")
                                .build()
                        ))
                        .build()
                ))
                .thinking(ChatThinking.builder()
                    .type("enabled")
                    .build())
                .build();

            ChatCompletionResponse response = client.chat().createChatCompletion(request);

            if (response.isSuccess()) {
                Object reply = response.getData().getChoices().get(0).getMessage();
                System.out.println(reply);
            } else {
                System.err.println("错误: " + response.getMsg());
            }
        }
    }
    ```

    **文件理解**

    ```java  theme={null}
    import ai.z.openapi.ZhipuAiClient;
    import ai.z.openapi.service.model.*;
    import java.util.Arrays;

    public class MultiModalFileExample {
        public static void main(String[] args) {
            String apiKey = "your-api-key"; // 请填写您自己的APIKey
            ZhipuAiClient client = ZhipuAiClient.builder()
                .apiKey(apiKey)
                .build();

            ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
                .model("glm-4.5v")
                .messages(Arrays.asList(
                    ChatMessage.builder()
                        .role(ChatMessageRole.USER.value())
                        .content(Arrays.asList(
                            MessageContent.builder()
                                .type("file_url")
                                .fileUrl(FileUrl.builder()
                                    .url("https://cdn.bigmodel.cn/static/demo/demo2.txt")
                                    .build())
                                .build(),
                            MessageContent.builder()
                                .type("file_url")
                                .fileUrl(FileUrl.builder()
                                    .url("https://cdn.bigmodel.cn/static/demo/demo1.pdf")
                                    .build())
                                .build(),
                            MessageContent.builder()
                                .type("text")
                                .text("What are the files show about?")
                                .build()
                        ))
                        .build()
                ))
                .thinking(ChatThinking.builder()
                    .type("enabled")
                    .build())
                .build();

            ChatCompletionResponse response = client.chat().createChatCompletion(request);

            if (response.isSuccess()) {
                Object reply = response.getData().getChoices().get(0).getMessage();
                System.out.println(reply);
            } else {
                System.err.println("错误: " + response.getMsg());
            }
        }
    }
    ```
  </Tab>
</Tabs>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt