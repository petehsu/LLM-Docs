# GLM-ASR-2512

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-list.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 概览 </div>

GLM-ASR-2512 是智谱新一代语音识别模型，支持将语音实时转换为高质量文字。无论是日常聊天、会议记录、工作文档，还是包含专业术语的场景，都能精准识别与转换，大幅提升输入与记录效率。模型在多场景、多口音条件下依旧保持行业领先的识别表现，字符错误率（CER）仅为 0.0717，带来既快速又可靠的语音输入体验。

<CardGroup cols={3}>
  <Card title="输入模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    音频
  </Card>

  <Card title="输出模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    文本
  </Card>

  <Card title="上传文件限制" icon={<svg style={{maskImage: "url(/resource/icon/gauge-high.svg)", WebkitMaskImage: "url(/resource/icon/gauge-high.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    文件大小 ≤ 25 MB、音频时长 ≤ 30 秒
  </Card>
</CardGroup>

<Tip>
  模型价格详情请前往[价格界面](https://open.bigmodel.cn/pricing)
</Tip>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/stars.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 推荐场景 </div>

<AccordionGroup>
  <Accordion title="实时会议纪要" defaultOpen="true">
    实时转录线上会议，自动整理结构化纪要，大幅提升效率。
  </Accordion>

  <Accordion title="客服质检与工单处理">
    高精度转写客服通话内容，提升质检效率并支持多场景分析。
  </Accordion>

  <Accordion title="视频直播字幕">
    为新闻直播、教育课程或视频会议提供实时同步字幕，保证低延迟与高准确率。
  </Accordion>

  <Accordion title="办公文档输入">
    语音快速生成工作文档、邮件、方案草稿，大幅提升输入速度。
  </Accordion>

  <Accordion title="多语言沟通与翻译">
    支持跨语言语音理解，应用于跨境交流、在线会议与教学场景。
  </Accordion>

  <Accordion title="医疗病历录入">
    实时识别大量医学专业术语，支持医生口述病历录入，快速生成电子病历。
  </Accordion>
</AccordionGroup>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/gauge-high.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 使用资源 </div>

[体验中心](https://bigmodel.cn/trialcenter/modeltrial/voice)：快速测试模型在业务场景上的效果<br />
[接口文档](/api-reference/%E6%A8%A1%E5%9E%8B-api/%E8%AF%AD%E9%9F%B3%E8%BD%AC%E6%96%87%E6%9C%AC)：API 调用方式

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 详细介绍 </div>

<Steps>
  <Step title="产品优势" titleSize="h3">
    * 精准识别：在最新竞品评估中，GLM-ASR-2512 的字符错误率（CER）仅为 0.0717，达到国际领先水平，比肩全球顶尖语音识别模型。
    * 高效自定义词典：模型支持用户通过简易配置，快速导入专属词汇、项目代号（如 AutoGLM、智谱AI输入法）及生僻人名地名等。只需在设置中添加一次，即可告别反复修改的痛点。
    * 复杂场景优势：无论是中英混合表达、指令化文本、行业专有名词，还是长句、口语化表达等复杂场景，GLM-ASR-2512 都能稳定输出高质量文字，整体表现显著优于竞品。
  </Step>

  <Step title="支持语言" stepNumber={2} titleSize="h3">
    GLM-ASR-2512 具备出色的多语言与方言处理能力，能够精准转录全球多种主流语言及地区性口语：

    * 中文：支持普通话，以及四川话、粤语、闽南语、吴语等主要方言
    * 英语：支持美式、英式等多种口音
    * 其他支持语言：法语、德语、日语、韩语、西班牙语、阿拉伯语等数十种全球常用语言
  </Step>
</Steps>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/star.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 应用示例 </div>

<Tabs>
  <Tab title="专业会议记录">
    模型能够自动区分中英文语境，精准识别数字与单位组合，智能解析不连贯语句（如重复、卡顿），输出逻辑完整的文本，为后续的会议总结和工作安排提供可靠依据。

    | 特殊场景      | 原始音频                                                                | 输出结果                                                                                   |
    | :-------- | :------------------------------------------------------------------ | :------------------------------------------------------------------------------------- |
    | 数据+术语+中英文 | <audio src="/resource/audio/会议记录.wav" type="audio/mpeg" controls /> | excel二零一九使用升序降序做排序操作，活动单元格应该选定a工作表的任何地方，b数据清单的任何地方，c排序依据数据列的任意单元格，d数据清单标题行的任意单元格，应该选哪个 |
  </Tab>

  <Tab title="语音搜索--车辆导航">
    模型能够智能判别方言，并不受环境音干扰，准确理解指令含义，快速返回精准的文字结果。

    | 特殊场景            | 原始音频                                                                | 输出结果                                           |
    | :-------------- | :------------------------------------------------------------------ | :--------------------------------------------- |
    | 纯文字+天津话方言+环境音干扰 | <audio src="/resource/audio/车辆导航.wav" type="audio/mpeg" controls /> | 我想去趟潘家园，去潘家园那块儿的停车场。给我规划一条不堵的路线，最好这路上也没有什么红绿灯。 |
  </Tab>

  <Tab title="课堂内容转录">
    模型能够精准解析带口音的英语，同时克服噪音干扰，即使英语发音不标准，它也能依据真实语言环境进行矫正后输出，还原课堂真实场景，便于后续复习。

    | 特殊场景                 | 原始音频                                                                | 输出结果                                                                                       |
    | :------------------- | :------------------------------------------------------------------ | :----------------------------------------------------------------------------------------- |
    | 纯文字+有口音英语（中式英语）+噪音环境 | <audio src="/resource/audio/英语日常.wav" type="audio/mpeg" controls /> | OK, now please tell me, how do you know from this picture that its location is bangladesh? |
  </Tab>

  <Tab title="游戏语音">
    模型能够精确解析玩家黑话，无缝切换中英文语境，流式转写战术交流的同时不影响游戏的流畅性。

    | 特殊场景        | 原始音频                                                                | 输出结果                |
    | :---------- | :------------------------------------------------------------------ | :------------------ |
    | 游戏黑话+中英文+口音 | <audio src="/resource/audio/游戏场景.wav" type="audio/mpeg" controls /> | 六六六牛啊这切c操作太秀了一波了一波了 |
  </Tab>
</Tabs>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-code.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 调用示例 </div>

<Tabs>
  <Tab title="cURL">
    **基础调用**

    ```bash  theme={null}
    curl --request POST \
        --url https://open.bigmodel.cn/api/paas/v4/audio/transcriptions \
        --header 'Authorization: Bearer API_Key' \
        --header 'Content-Type: multipart/form-data' \
        --form model=glm-asr-2512 \
        --form stream=false \
        --form file=@example-file
    ```

    **流式调用**

    ```bash  theme={null}
    curl --request POST \
      --url https://open.bigmodel.cn/api/paas/v4/audio/transcriptions \
      --header 'Authorization: Bearer API_Key' \
      --header 'Content-Type: multipart/form-data' \
      --form model=glm-asr-2512 \
      --form stream=true \
      --form file=@example-file
    ```
  </Tab>
</Tabs>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt