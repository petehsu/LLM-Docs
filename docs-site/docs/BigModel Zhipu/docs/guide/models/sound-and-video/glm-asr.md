# GLM-ASR

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-list.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 概览 </div>

GLM-ASR 是智谱新一代语音识别模型，相较于传统 ASR 模型，GLM-ASR 在上下文智能理解、抗噪性能及多语言转录等方面取得了显著提升，可以被广泛地应用于各类语音转文本的场景中。

<CardGroup cols={3}>
  <Card title="价格" icon={<svg style={{maskImage: "url(/resource/icon/coins.svg)", WebkitMaskImage: "url(/resource/icon/coins.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    0.06 元/分钟
  </Card>

  <Card title="输入模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    音频
  </Card>

  <Card title="输出模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    文本
  </Card>
</CardGroup>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/stars.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 推荐场景 </div>

<AccordionGroup>
  <Accordion title="客户服务" defaultOpen="true">
    实时记录客户语音需求，并方便事后查询，提升服务响应效率与质量。
  </Accordion>

  <Accordion title="人机交互">
    通过语音指令控制智能设备（如家居、机器人），实现“动口不动手”的无缝交互体验。
  </Accordion>

  <Accordion title="会议转写">
    生成精准会议与课堂记录，支持中英文混杂、专业术语识别，助力高效复盘与知识沉淀。
  </Accordion>

  <Accordion title="字幕生成">
    一键为音视频添加高精度字幕，适配会议直播、影视剪辑、线上课程等多场景需求。
  </Accordion>

  <Accordion title="游戏语言">
    精准识别玩家高频术语与“游戏黑话”，流式转写语音指令与战术交流，助力边玩边聊不卡顿。
  </Accordion>

  <Accordion title="内容质检">
    将录音智能转写为文本，基于规则库实时检测违规内容并预警，同步分析语音数据挖掘潜在业务价值。
  </Accordion>

  <Accordion title="语音搜索">
    车载导航、移动端场景中，快速响应方言或带口音指令，解放双手提升搜索效率。
  </Accordion>
</AccordionGroup>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/gauge-high.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 使用资源 </div>

[接口文档](/api-reference/%E6%A8%A1%E5%9E%8B-api/%E8%AF%AD%E9%9F%B3%E8%BD%AC%E6%96%87%E6%9C%AC)：API 调用方式

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 详细介绍 </div>

作为一款基于上下文深度理解的语音转文本模型，GLM-ASR 不仅能够将音频精准转录为符合语言习惯的流畅文本，更在复杂噪音环境中展现出卓越的抗干扰能力，为您提供一系列语音转文本的新惊喜：

<Steps>
  <Step title="上下文智能理解" titleSize="h3">
    依托先进的语言建模技术，模型可结合上下文语境优化输出结果，显著提升文本的流畅性与可读性，让转录内容更贴近真实表达。
  </Step>

  <Step title="强抗噪性能" stepNumber={2} titleSize="h3">
    即使在非语言类噪声（如机械声、环境杂音）干扰下，模型仍能保持高精度识别，避免误判与漏识，适应多场景需求。
  </Step>

  <Step title="多语言多方言覆盖" stepNumber={3} titleSize="h3">
    支持中文、英语及8种中国地方方言（东北官话、胶辽官话、北京官话、冀鲁官话、中原官话、江淮官话、兰银官话和西南官话），打破地域沟通壁垒，满足多样化语音交互需求。
  </Step>
</Steps>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-code.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 调用示例 </div>

<Tabs>
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

    **调用示例**

    ```python  theme={null}
    from zai import ZhipuAiClient

    client = ZhipuAiClient(api_key="")  # 请填写您自己的 APIKey

    input_wav_path = "speech.wav"  # 你的 WAV 文件路径

    with open(input_wav_path, "rb") as audio_data:
        response = client.audio.transcriptions.create(
        model="glm-asr",
        file=audio_data,
        stream=True
        )

        for chunk in response:
            if chunk.type == "transcript.text.delta":
                print(chunk.delta, end="", flush=True)
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

    **调用示例**

    ```java  theme={null}
      import ai.z.openapi.ZhipuAiClient;
      import ai.z.openapi.core.Constants;
      import ai.z.openapi.service.audio.AudioTranscriptionRequest;
      import ai.z.openapi.service.audio.AudioTranscriptionResponse;
      import java.io.File;
      import java.io.IOException;

      public class GLMASRExample {
          public static void main(String[] args) throws IOException {
              ZhipuAiClient client = ZhipuAiClient.builder().apiKey("your_api_key").build();
              File audioFile = new File("your_path-asr.wav");
              AudioTranscriptionRequest request = AudioTranscriptionRequest.builder()
                  .model(Constants.ModelGLMASR)
                  .file(audioFile)
                  .stream(false)
                  .build();

              AudioTranscriptionResponse response = client.audio().createTranscription(request);
              System.out.println(response.getData());
          }
    }
    ```
  </Tab>

  <Tab title="旧版 Python">
    ```python  theme={null}
    from zhipuai import ZhipuAI

    client = ZhipuAI(api_key="your-api-key")  # 填写您自己的 APIKey
    with open("asr1.wav", "rb") as audio_file:
        transcriptResponse = client.audio.transcriptions.create(
            model="glm-asr",
            file=audio_file,
            stream=False
    )
    for item in transcriptResponse:
        print(item)
    ```
  </Tab>

  <Tab title="输出示例">
    ```json  theme={null}
    {
        "id": "20250605132035222ead927d794645",
        "object": "chat.completion",
        "created": 1749187238,
        "model": "glm-asr",
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": "你好，这是我的语音输入测试"
                },
                "finish_reason": "stop"
            }
        ],
        "usage": {
            "prompt_tokens": 107,
            "completion_tokens": 340,
            "total_tokens": 447
        },
        "request_id": "20250605132035222ead927d794645"
    }
    ```
  </Tab>
</Tabs>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/square-user.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 用户并发权益 </div>

API 调用会受到速率限制，当前我们限制的维度是请求并发数量（在途请求任务数量）。不同等级的用户并发保障如下。

| V0 | V1 | V2 | V3 |
| :- | :- | :- | :- |
| 5  | 10 | 15 | 20 |


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt