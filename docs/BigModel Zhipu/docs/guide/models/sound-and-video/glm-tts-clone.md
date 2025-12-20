# GLM-TTS-Clone

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-list.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 概览 </div>

GLM-TTS-Clone 是智谱推出的音色克隆模型，只需 3 秒语音样本，即可学习说话者的音色与语气习惯，可在通用朗读、情感配音、教育测评、电子书、有声客服等场景中生成自然流畅、贴近真人的语音。

<CardGroup cols={2}>
  <Card title="输入模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    需要克隆音色的音频、试听文本（可选）
  </Card>

  <Card title="输出模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    音色ID、试听音频（可选）
  </Card>
</CardGroup>

<Tip>
  模型价格详情请前往[价格界面](https://open.bigmodel.cn/pricing)
</Tip>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/stars.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 推荐场景 </div>

<AccordionGroup>
  <Accordion title="教育教学" defaultOpen="true">
    适配多学科内容，准确处理多音字、生僻字和符号；讲解语气自然、有耐心，帮助学生获得更清晰的理解体验。
  </Accordion>

  <Accordion title="电子书与有声内容">
    不同角色可呈现差异化的情绪和风格，让有声书、短剧等内容更具代入感。
  </Accordion>

  <Accordion title="客服与热线服务">
    提供克制、专业、不夸张的语气风格，让用户听感更自然可信，提升服务体验。
  </Accordion>

  <Accordion title="智能设备语音交互">
    为智能音箱、车载助手等设备带来更加真人化、亲和的语音反馈，减少机器感。
  </Accordion>

  <Accordion title="企业内容与品牌声音">
    快速生成统一、可识别的品牌声音形象，用于广告、培训教材、活动播报等多类内容。
  </Accordion>
</AccordionGroup>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/gauge-high.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 使用资源 </div>

[体验中心](https://audio.z.ai/?tab=clone)：快速测试模型在业务场景上的效果<br />
[接口文档](/api-reference/%E6%A8%A1%E5%9E%8B-api/%E9%9F%B3%E8%89%B2%E5%A4%8D%E5%88%BB)：API 调用方式<br />
[GLM-TTS 使用指南](/cn/guide/models/sound-and-video/glm-tts)：可先通过 GLM-TTS-Clone 模型获取音色ID，然后用 GLM-TTS 模型生成该音色的音频

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 详细介绍 </div>

<Steps>
  <Step stepNumber={1} titleSize="h3">
    只需录制约 3 秒清晰语音，GLM-TTS-Clone 即可生成专属音色：

    * 支持普通话及轻口音日常表达；
    * 保留个人说话节奏、断句习惯和常见语气词；
    * 适配讲解、对话、播音、旁白等多种文本风格。
    * 细腻的情感表达，依托强化学习与情感标注数据能自动匹配情绪。

    以下视频中的部分声音由 GLM‑TTS生成，只需 3 秒，即可实现完美复刻：

    <video className="m-0 p-1" src="https://cdn.bigmodel.cn/static/4.6v/glmtts_demo.mp4" controls />
  </Step>
</Steps>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-code.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 调用示例 </div>

<Tabs>
  <Tab title="cURL">
    **基础调用**

    ```bash  theme={null}
    curl -X POST "https://open.bigmodel.cn/api/paas/v4/voice/clone" \
        -H "Authorization: Bearer API_Key" \
        -H "Content-Type: application/json" \
        -d '{
              "model": "glm-tts-clone",
              "voice_name": "my_custom_voice_001",
              "text": "你好，这是一段示例音频的文本内容，用于音色复刻参考。",
              "input": "欢迎使用我们的音色复刻服务，这将生成与示例音频相同音色的语音。",
              "file_id": "file_abc123def456ghi789",
              "request_id": "voice_clone_req_001"
        }'
    ```
  </Tab>
</Tabs>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt