# GLM-TTS

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-list.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 概览 </div>

GLM-TTS 语音合成模型以新一代智谱语音大模型为核心，突破传统语音合成框架，通过上下文智能预判文本情绪与语调，显著提升语音自然度与表现力，让合成语音具备真实情感与生命力。GLM‑TTS 在架构上采用两阶段生成，并在训练中引入基于 GRPO 的强化学习方案，在公开评测的「字错误率」和「情感表达」上取得开源 SOTA 表现。

<CardGroup cols={2}>
  <Card title="输入模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    文本
  </Card>

  <Card title="输出模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    音频
  </Card>
</CardGroup>

<Tip>
  模型价格详情请前往[价格界面](https://open.bigmodel.cn/pricing)!
</Tip>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/stars.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 推荐场景 </div>

<AccordionGroup>
  <Accordion title="智能客服" defaultOpen="true">
    全链路柔性服务，降低用户抵触感。依托超拟人语音的情感适配与自然对话能力，覆盖客服全场景。
  </Accordion>

  <Accordion title="有声阅读">
    沉浸式 “解放双眼”，适配多元需求。突破传统 “听书” 局限，以超拟人语音的 “角色化演绎 + 情感随内容动态调整” 能力，打造个性化阅读体验。
  </Accordion>

  <Accordion title="智能交互助手">
    通过超拟人语音的真实情感衔接与场景化语调调整，让智能硬件摆脱 “工具属性”。
  </Accordion>

  <Accordion title="教育领域">
    场景化教学，提升学习沉浸感。
  </Accordion>

  <Accordion title="职场办公">
    高效信息传递，解放双手。会议纪要转语音、邮件 / 文档播报、智能待办提醒。
  </Accordion>

  <Accordion title="文旅领域">
    沉浸式体验，替代 “传统导游”，如景区智能导览、酒店智能服务、文旅内容科普。
  </Accordion>
</AccordionGroup>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/gauge-high.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 使用资源 </div>

[体验中心](https://audio.z.ai/)：快速测试模型在业务场景上的效果<br />
[接口文档](/api-reference/%E6%A8%A1%E5%9E%8B-api/%E6%96%87%E6%9C%AC%E8%BD%AC%E8%AF%AD%E9%9F%B3)：API 调用方式

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 详细介绍 </div>

GLM-TTS 结合了 text2token 大语言模型和 token2wav 扩散模型，突破传统语音合成框架。相比传统技术，GLM-TTS 在口语自然度、拟人化还原、语句衔接和韵律节奏上全面升级，尤其在情感表达上精准呈现，为客户打造生动、富感染力的听觉体验，实现从“清晰传递”到“情感共鸣”的跨越。

<Steps>
  <Steps>
    <Step title="超拟人语音合成，情感表达增强" stepNumber={1} titleSize="h3">
      依托新一代语音大模型，根据上下文智能预测文本的情感、语调等信息，提升合成语音的自然度和表现力。
    </Step>

    <Step title="支持非流式、流式接口" stepNumber={2} titleSize="h3">
      非流式适合完整文本一次性合成，流式支持在文本生成过程中实时输出语音，实现低延迟的交互式体验。
    </Step>

    <Step title="快速响应" stepNumber={3} titleSize="h3">
      流式接口返回响应结果，首帧响应速度可达400ms以内。
    </Step>

    <Step title="动态调参数" stepNumber={4} titleSize="h3">
      支持随心调节语速、音量等参数，满足复杂场景要求。
    </Step>
  </Steps>
</Steps>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/star.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 可选音色 </div>

| 角色     | 音色示例                                                                    |
| :----- | :---------------------------------------------------------------------- |
| 彤彤（默认） | <audio src="/resource/audio/tongtong.wav" type="audio/mpeg" controls /> |
| 小陈     | <audio src="/resource/audio/xiaochen.wav" type="audio/mpeg" controls /> |
| 锤锤     | <audio src="/resource/audio/chuichui.wav" type="audio/mpeg" controls /> |
| jam    | <audio src="/resource/audio/jam.wav" type="audio/mpeg" controls />      |
| kazi   | <audio src="/resource/audio/kazi.wav" type="audio/mpeg" controls />     |
| douji  | <audio src="/resource/audio/douji.wav" type="audio/mpeg" controls />    |
| luodo  | <audio src="/resource/audio/luodo.wav" type="audio/mpeg" controls />    |

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/ballot.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 应用示例 </div>

<Tabs>
  <Tab title="单音色超拟人TTS">
    | 文本                                                           | 音频                                                                      |
    | :----------------------------------------------------------- | :---------------------------------------------------------------------- |
    | 我叫小智呀～ 是不是刚才有点小委屈呀？跟我说说嘛，我听着呢～                               | <audio src="/resource/audio/cogtts-1.wav" type="audio/mpeg" controls /> |
    | 哎呀，可别这么说自己呀！你是不是最近遇到啥事儿了，感觉没做好才这么想的？其实啊，谁还没个手忙脚乱、犯迷糊的时候呢。    | <audio src="/resource/audio/cogtts-2.wav" type="audio/mpeg" controls /> |
    | 初中时看天空的感觉真的很不一样哎！那时候好像总觉得天空特别大，云朵会变成各种形状，傍晚的晚霞能看半天，连星星都比现在亮。 | <audio src="/resource/audio/cogtts-3.wav" type="audio/mpeg" controls /> |
  </Tab>

  <Tab title="超情感表达TTS">
    | 文本                                  | 音频                                                                      |
    | :---------------------------------- | :---------------------------------------------------------------------- |
    | 开心：拆开快递看到那只限量款玩偶时，我笑得差点蹦起来，实在太开心啦！  | <audio src="/resource/audio/cogtts-4.wav" type="audio/mpeg" controls /> |
    | 悲伤：我精心养了三年的花突然枯萎，我忍不住哭了起来，实在太难过了。   | <audio src="/resource/audio/cogtts-5.wav" type="audio/mpeg" controls /> |
    | 担心：天气预报说有暴雨，还没回家的孩子不知道有没有带伞，好担心啊。   | <audio src="/resource/audio/cogtts-6.wav" type="audio/mpeg" controls /> |
    | 疲惫：哎，盯着电脑屏幕改了五版方案，我现在连抬手揉眼睛的力气都快没了。 | <audio src="/resource/audio/cogtts-7.wav" type="audio/mpeg" controls /> |
  </Tab>
</Tabs>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-code.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 调用示例 </div>

<Tabs>
  <Tab title="cURL">
    **基础调用**

    ```bash  theme={null}
    curl -X POST "https://open.bigmodel.cn/api/paas/v4/audio/speech" \
        -H "Authorization: Bearer API Key" \
        -H "Content-Type: application/json" \
        -d '{
              "model": "glm-tts",
              "input": "你好呀,欢迎来到智谱开放平台",
              "voice": "female",
              "speed": 1.0,
              "volume": 1.0,
              "response_format": "wav"
        }' \
    --output speech.wav
    ```

    **流式调用及响应示例**

    ```bash  theme={null}
    curl -X POST "https://open.bigmodel.cn/api/paas/v4/audio/speech" \
        -H "Authorization: Bearer API Key" \
        -H "Content-Type: application/json" \
        -d '{
              "model": "glm-tts",
              "input": "你好呀,欢迎来到智谱开放平台",
              "voice": "female",
              "response_format": "pcm",
              "encode_format": "base64",
              "stream": true,
              "speed": 1.0,
              "volume": 1.0
        }' \

    data: {"id":"202507151937066dbff80cdc994b58","created":1752579443,"model":"glm-tts","choices":[{"index":0,"delta":{"role":"assistant","return_sample_rate": 24000,"content":"AgAAAAEAAAAAAAEAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAgABAAEAAQABAAEAAQABAAEAAQABAAAAAQABAAEAAQAAAAAAAAD////////+//7//v/+//7//v/+//7//v/+//3//v/+//7//v////7/AAABAAEAAAAAAAQAAAAAAAAAAAAAAAQABAAEAAQAAAAEA///////////+//7//v/+//////8AAP//AAAAAAAQFjQVUBfEEVAS4AwkDfgI3ArIBEwGvAFgAKQAMAM7/mv97/1j/Q/8p/+7+sv5s/i/+Dv7L/Xz9Rv0e/Qn9Df0g/UX90d/I3+sv+u/jX/fwEXAlb9Bvs="}}]}
    data: {"id":"202507151937066dbff80cdc994b58","created":1752579443,"model":"glm-tts","choices":[{"index":1,"delta":{"role":"assistant","return_sample_rate": 24000,"content":"AgAAAAEAAAAAAAEAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAgABAAEAAQABAAEAAQABAAEAAQABAAAAAQABAAEAAQAAAAAAAAD////////+//7//v/+//7//v/+//7//v/+//3//v/+//7//v////7/AAABAAEAAgACAAMABAAEAAQABAAEAAQAAwADAAIAAQABAAAA//8AAP7////9//7//f/9//3//f/+//7//////wAAAQACAAEAAgACAAEAAAAAAP///v/+//3//f/8//7//f/9//7//f/+//7//v/8//7//f/+/wEAAQACAAMABAAFAAQABQAFAAQABAABAAEAAQD//////////wAAAQAAAAIAAwACAAIAAgABAAAA//8AAP7//f/+//3//P/9//3//v////7//v///////v/9//3//v/b9Bvs="}}]}
    data: {"choices":[{"finish_reason":"stop","index":2}],"created":1752579445091,"id":"202507151937066dbff80cdc994b58","model":"glm-tts"}
    ```

    **异常调用示例**

    ```
    curl -X POST "https://open.bigmodel.cn/api/paas/v4/audio/speech" \
        -H "Authorization: Bearer API Key" \
        -H "Content-Type: application/json" \
        -d '{
              "model": "glm-tts",
              "input": "你好呀,欢迎来到智谱开放平台",
              "voice": "test",
              "response_format": "pcm",
              "encode_format": "base64",
              "stream": true,
              "speed": 1.0,
              "volume": 1.0
        }' \

    data: {"error":{"code":"1214","message":"音色id不存在"}}
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
    from pathlib import Path

    client = ZhipuAiClient(api_key="")  # 请填写您自己的APIKey
    speech_file_path = "" # 请填写您输出文件的保存路径
    response = client.audio.speech(
        model="glm-tts",
        input="你好呀,欢迎来到智谱开放平台",
        voice="female",
        response_format="wav",
        speed=1.0,
        volume=1.0
    )
    response.stream_to_file(speech_file_path)
    ```

    **流式调用**

    ```
    api_key = "YOUR API KEY" # 填写您自己的APIKey
    def main():
        client = ZhipuAiClient(api_key=api_key)
        try:
            response = client.audio.speech(
                model='glm-tts',
                input='大家好，欢迎到来智谱开放平台',
                voice='female',
                stream=True,
                response_format='pcm',
                encode_format='base64',
                speed=1.0,
                volume=1.0
            )
            for chunk in response:
                for choice in chunk.choices:
                    index = choice.index
                    is_finished = choice.finish_reason
                    if is_finished == "stop":
                        break
                    audio_delta = choice.delta.content
                    print(f"{index}.audio_delta={audio_delta[:64]}..., length={len(audio_delta)}")
        except Exception as e:
            print(e)
    if __name__ == '__main__':
        main()
    ```
  </Tab>
</Tabs>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt