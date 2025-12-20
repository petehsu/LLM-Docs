# GLM-4-Flash-250414

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-list.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 概览 </div>

GLM-4-Flash-250414 语言模型是 智谱AI 首个免费的大模型 API，它在实时网页检索、长上下文处理、多语言支持等方面表现出色，适用于智能问答、摘要生成和文本数据处理等多种应用场景。

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/bolt.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 能力支持 </div>

<CardGroup cols={3}>
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

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/stars.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 功能特色 </div>

<AccordionGroup>
  <Accordion title="超长上下文" defaultOpen="true">
    模型具备 128K 上下文，单次提示词可以处理的文本长度相当于 300 页书籍。这样的能力使得 GLM-4-Flash -250414 能够更好地理解和处理长文本内容，适用于需要深入分析上下文的场景。
  </Accordion>

  <Accordion title="多语言支持">
    GLM-4-Flash-250414 拥有强大的多语言支持能力，能够支持多达 26 种语言。这为全球用户提供了多语言交互服务，拓宽了模型的应用范围。
  </Accordion>

  <Accordion title="网页检索">
    支持外部工具调用，通过网络搜索获取信息，以增强语言模型输出的质量和时效性。
  </Accordion>
</AccordionGroup>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/link.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 快捷入口 </div>

* 接口调用查看 [接口文档](/api-reference/%E6%A8%A1%E5%9E%8B-api/%E5%AF%B9%E8%AF%9D%E8%A1%A5%E5%85%A8)
* 在 [体验中心](https://www.bigmodel.cn/console/trialcenter?modelCode=glm-4-flash) 体验模型能力
* 模型[速率限制](https://www.bigmodel.cn/usercenter/proj-mgmt/rate-limits)

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/cubes.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 场景应用 </div>

<Tabs>
  <Tab title="智能写作">
    作为智能写作助手，GLM-4-Flash-250414 能够为多样化的写作场景提供专业支持。在社交媒体领域，它可以协助创作吸引眼球的小红书推文；在文学创作方面，能够提供情节构思和文字润色建议；对于商业写作，则可以帮助生成规范的报告、提案和营销文案。模型不仅能够把握不同文体的写作特点，还可以根据用户需求提供个性化的修改建议，让写作过程更加顺畅高效。通过 AI 辅助，能够显著提升写作质量和效率。

    **提示词**

    ```
    -上下文：我想推广公司的新产品。我的公司名为：智谱AI，新产品名为：ChatGLM 大模型，是一款面向大众的 AI 产品。
    -目标：帮我创建一条小红书平台的帖子，目的是吸引人们点击产品链接进行学习和体验。
    -风格：参照Dyson等成功公司的宣传风格，它们在推广类似产品时的文案风格，同时结合小红书的文案风格。
    -语调：说服性
    -受众：AI 产品在小红书上的主要受众是年轻人，活跃在互联网和 AI 领域。请针对这一群体在选择护发产品时的典型关注点来定制帖子。
    -响应：保持小红书帖子简洁而深具影响力，注意要使用emoji表情，
    **平台链接以 markdown 格式输出显示**：［智谱AI 开放平台］（https://open.bigmodel.cn/console/trialcenter）。
    **平台 logo 放在文案最下方**："D（https://s21.ax1x.com/2024/12/17/pALCRaT.png)*
    ```

    **生成结果示例**

    ```
    🌟【AI 新潮流🌟】
    亲爱的朋友们，你们是否还在为繁琐的日常事务烦恼？🤔
    智谱AI 全新力作——ChatGLM 大模型，来啦！🎉
    这款面向大众的 AI 产品，能帮你轻松应对各种挑战，让你的生活更加智能便捷！🎁

    👉【一键解锁高效生活】
    🔍精准搜索，告别无效信息
    ✏️智能写作，告别写作难题
    📚知识问答，让你成为学霸
    👨‍💻智能客服，解决你的燃眉之急

    📢📢📢还在等什么？快来体验 ChatGLM 大模型，开启你的智能生活之旅吧！🌈

    🔗点击链接，立即体验！🔗
    [智谱AI 开放平台](https://open.bigmodel.cn/console/trialcenter)

    🌈🌈🌈
    ——智谱AI，与你一起，探索 AI 无限可能！
    🔍🔍🔍
    [D](https://s21.ax1x.com/2024/12/17/pALCRaT.png)
    ```
  </Tab>

  <Tab title="智能翻译">
    GLM-4-Flash-250414 凭借其强大的自然语言处理能力，能够提供高质量的多语言翻译服务。该模型不仅可以准确把握各种语言的语义细微差别，还能敏锐理解不同文化背景下的表达习惯，从而确保翻译结果准确。在实际应用中，它支持包括中文、英语、日语、韩语等主流语言之间的互译。

    **提示词**

    ```
    翻译以下莎士比亚戏剧《罗密欧与朱丽叶》中的选段：

    "To be, or not to be: that is the question:Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune,Or to take arms against a sea of troubles And by opposing end them."
    ```

    **生成结果示例**

    ```
    生存还是毁灭，这是一个值得考虑的问题：究竟是在心灵上忍受命运的箭矢和狂暴的打击，还是拿起武器对抗那片汹涌的烦恼之海，与之抗争到底。
    ```
  </Tab>

  <Tab title="实体抽取">
    GLM-4-Flash-250414 模型具备实体提取能力，能够从非结构化的背景信息文本中提取出格式化数据，识别实体内容。这一模型具备广泛的适应性，能够处理包括法律文书在内的几十种不同类型的文档。通过简化文书处理流程，该模型显著提高了工作效率，带来了更加便捷的服务体验。以法律文书为例，我们可以看到模型的应用效果尤为显著。

    **提示词**

    ```
    你现在是一个法律专家，请你对这篇判决书的内容进行分析。不要展现分析过程，直接按照下面的格式输出
    ## 判决书内容：
    中华人民共和国最高人民法院
    指定管辖决定书
    （2017）最高法刑辖 19 号
    关于被告单位北京盘古氏投资有限公司涉嫌骗取贷款、被告人吕涛等八人涉嫌骗取贷款、骗购外汇、非国家工作人员受贿、非法拘禁、故意毁坏会计凭证、会计账簿、财务会计报告等犯罪案件，本院经审查，依照《中华人民共和国刑事诉讼法》第二十六条的规定，决定如下：指定辽宁省大连市西岗区人民法院依照刑事第一审程序对该案进行审判。  二〇一七年三月十七日
    ## 定义输出格式
    {
        "犯罪客体": {
        "涉及客体": ""
    },
        "犯罪主观要件-罪过形式": {
        "故意": "",
        "过失": ""
    },
        "犯罪主观要件": {
        "犯罪动机": "",
        "犯罪目的": "",
        "犯罪地点": ""
    },
        "犯罪客观要件": {
        "犯罪地点": "",
        "犯罪行为": "",
        "犯罪过程": ""
    },
        "适用法条": "",
        "判决结果时间": "",
        "判决刑期": "",
        "判决结果金额": ""
    }

    ```

    **生成结果示例**

    ```
    {
        "犯罪客体": {
        "涉及客体": "被告单位北京盘古氏投资有限公司涉嫌骗取贷款、被告人吕涛等八人涉嫌骗取贷款、骗购外汇、非国家工作人员受贿、非法拘禁、故意毁坏会计凭证、会计账簿、财务会计报告"
    },
        "犯罪主观要件-罪过形式": {
        "故意": "是",
        "过失": "否"
    },
        "犯罪主观要件": {
        "犯罪动机": "获取非法利益",
        "犯罪目的": "非法占有",
        "犯罪地点": "未提及"
    },
        "犯罪客观要件": {
        "犯罪地点": "未提及",
        "犯罪行为": "骗取贷款、骗购外汇、非国家工作人员受贿、非法拘禁、故意毁坏会计凭证、会计账簿、财务会计报告",
        "犯罪过程": "未提及"
    },
        "适用法条": "《中华人民共和国刑事诉讼法》第二十六条",
        "判决结果时间": "二〇一七年三月十七日",
        "判决刑期": "未提及",
        "判决结果金额": "未提及"
    }
    ```
  </Tab>
</Tabs>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt