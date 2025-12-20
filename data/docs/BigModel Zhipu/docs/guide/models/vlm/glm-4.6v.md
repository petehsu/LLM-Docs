# GLM-4.6V

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-list.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 概览 </div>

GLM-4.6V 系列是 GLM 系列在多模态方向上的一次重要迭代，包含 GLM-4.6V（旗舰版）、GLM-4.6V-FlashX（轻量高速版）、[GLM-4.6V-Flash](/cn/guide/models/free/glm-4.6v-flash)（完全免费）。它将训练时上下文窗口提升到128k tokens，在**视觉理解精度上达到同参数规模 SOTA**，并首次在模型架构中将 **Function Call（工具调用）能力原生融入视觉模型**，打通从「视觉感知」到「可执行行动（Action）」的链路，为真实业务场景中的多模态 Agent 提供统一的技术底座。

<Tabs>
  <Tab title="GLM-4.6V">
    <CardGroup cols={2}>
      <Card title="定位" icon={<svg style={{maskImage: "url(/resource/icon/star.svg)", WebkitMaskImage: "url(/resource/icon/star.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        旗舰视觉推理（106B）
      </Card>

      <Card title="输入模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        视频、图像、文本、文件
      </Card>

      <Card title="输出模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        文本
      </Card>

      <Card title="上下文窗口" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        128K
      </Card>
    </CardGroup>
  </Tab>

  <Tab title="GLM-4.6V-FlashX">
    <CardGroup cols={2}>
      <Card title="定位" icon={<svg style={{maskImage: "url(/resource/icon/star.svg)", WebkitMaskImage: "url(/resource/icon/star.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        轻量高速（9B）
      </Card>

      <Card title="输入模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        视频、图像、文本、文件
      </Card>

      <Card title="输出模态" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        文本
      </Card>

      <Card title="上下文窗口" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
        128K
      </Card>
    </CardGroup>
  </Tab>
</Tabs>

<Tip>
  GLM-4.6V 系列价格详情请前往[价格界面](https://open.bigmodel.cn/pricing)
</Tip>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/bolt.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 能力支持 </div>

<CardGroup cols={3}>
  <Card title="深度思考" href="/cn/guide/capabilities/thinking" icon={<svg style={{maskImage: "url(/resource/icon/brain.svg)", WebkitMaskImage: "url(/resource/icon/brain.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    支持开启或关闭思考模式，可灵活开关深层推理分析
  </Card>

  <Card title="视觉理解" icon={<svg style={{maskImage: "url(/resource/icon/eye.svg)", WebkitMaskImage: "url(/resource/icon/eye.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    强大的视觉理解能力，支持图片，视频，文件
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
</CardGroup>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/stars.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 推荐场景 </div>

<Tabs>
  <Tab title="图片理解">
    **图片OCR信息提取、图片内容理解与其相关属性提取**

    | **典型场景**                                 | **功能项**                   | **能力描述**                                                                                |
    | :--------------------------------------- | :------------------------ | :-------------------------------------------------------------------------------------- |
    | 发票、证件、手写表单录入                             | **通用OCR识别**               | 支持印刷体、手写体、楷体、艺术字等                                                                       |
    | 工程造价清单、海关报关单、财务报表                        | **复杂表格解析**                | 多层表头、合并单元格、跨页表格智能识别                                                                     |
    | 手机随手拍、现场拍摄单据                             | **抗干扰识别**                 | 应对透视变形、模糊、光照不均、复杂背景、折痕、污渍等干扰场景                                                          |
    | 商品价格采集、洗衣工厂分拣、货架陈列检测                     | **商品属性识别**                | 自动识别品牌、类目、材质、颜色、款式等多维属性                                                                 |
    | 社交平台内容打标、优质内容筛选、广告素材分析                   | **图像内容分析**                | 识别图片中的场景类型、人物行为、氛围情绪、拍摄角度等高阶语义                                                          |
    | 手机屏幕质检、商品质控、工业检测                         | **瑕疵缺陷检测**                | 检测污渍、破损、变形、色差、划痕等质量问题                                                                   |
    | AIGC社区辅助用户生成相似风格图片、设计素材库的风格化标签提取、创意灵感库构建 | **图片反推提示词(Image2Prompt)** | 深度理解画面内容、风格、构图、光影，反向生成高质量的AI绘画提示词，便于复用或二次创作                                             |
    | 养殖企业、工程施工现场                              | **物体检测与计数**               | 精准识别并定位图片或视频画面中的一个或多个特定目标物体，返回每个目标的位置坐标、尺寸和类别，并支持对指定类别物体进行高精度计数，尤其适用于目标密集、遮挡、尺寸多变的复杂场景。 |
  </Tab>

  <Tab title="视频理解">
    **多模态时序融合、动态内容分析**

    | **典型场景**                       | **功能项**       | **能力描述**                                                       |
    | :----------------------------- | :------------ | :------------------------------------------------------------- |
    | 短视频平台内容分发、优质内容筛选、视频审核、广告植入检测   | **视频内容标签**    | 自动识别视频主题、风格、情绪、内容类型，支持多标签输出                                    |
    | 视频摘要生成、封面推荐、精彩集锦制作             | **关键帧提取**     | 智能识别视频中的精彩片段、转场点、关键信息帧                                         |
    | 长视频导航、精彩片段索引、会议记录、教学视频章节划分     | **事件时间轴构建**   | 自动生成视频内容的时间轴与章节划分，提取关键事件节点                                     |
    | 视频二创、剪辑辅助、广告脚本提取、影视制作参考、新人创作指导 | **智能分镜与脚本生成** | 自动将视频切分为有意义的镜头段落，识别镜头类型（特写/全景/运动镜头等），分析叙事结构，生成分镜脚本和拍摄建议        |
    | 短视频创作指导、MCN机构选题策划、平台内容运营、创作者培训 | **爆款视频热点拆解**  | 深度分析爆款视频的成功要素，拆解出"黄金3秒钩子"、"情绪起伏曲线"、"爆点时刻"等创作密码，输出可复用的创作模板内容洞察  |
    | 门店合规监控、工业生产合规性监测               | **视频巡检**      | 对实时视频流或录像文件进行 7x24 小时自动化监测，精准识别特定事件、违规行为、目标状态等，支持自定义检测规则与多场景适配 |
    | 视频搜索、内容审核、教学辅助                 | **视频问答**      | 基于视频内容进行自然语言问答，精准定位答案所在时间段                                     |
  </Tab>

  <Tab title="文档/复杂图表问答">
    **进行复杂版式理解、多格式适配、智能问答、跨页逻辑重建**

    | **典型场景**                                                   | **优势功能**    | **能力描述**                                                  |
    | :--------------------------------------------------------- | :---------- | :-------------------------------------------------------- |
    | 合同扫描件、公章盖章文件、历史档案、现场拍摄文件                                   | **抗干扰识别**   | 穿透红章、斜水印、背景噪声、褶皱污渍等干扰项，稳定识别手写体、楷体、艺术字等多种字体                |
    | -   多栏排版、页眉页脚、目录索引自动识别<br />-   复杂学术论文解析<br />-   杂志期刊内容提取 | **版式还原与重构** | 深度理解原文档排版逻辑，保留段落层级、字体样式、对齐方式等格式信息，输出结构化JSON/Markdown/HTML |
    | 长篇合同、多页报表、连续性条款解析                                          | **跨页逻辑理解**  | 自动识别跨页表格、段落续接、章节延续等跨页元素,重建完整逻辑结构                          |
    | "报表中XX项目的利润率是多少""今年营收的同比增长率是多少"                            | **文档智能问答**  | 对文档(含复杂的图表、公式数据)进行深度理解，支持自然语言提问并精准定位答案来源                  |
    | -   合同版本比对<br />-   财报年度分析<br />-   政策文件变更追踪               | **多文档关联分析** | 跨文档提取信息并进行关联比对，发现一致性、矛盾点、演变趋势                             |
  </Tab>
</Tabs>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/gauge-high.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 使用资源 </div>

[体验中心](https://www.bigmodel.cn/trialcenter/modeltrial/visual?modelCode=glm-4.6v)：快速测试模型在业务场景上的效果<br />
[接口文档](/api-reference/%E6%A8%A1%E5%9E%8B-api/%E5%AF%B9%E8%AF%9D%E8%A1%A5%E5%85%A8)：API 调用方式

**MCP 工具**：

* [万物识别 MCP](https://bigmodel.cn/marketplace/detail/052df9a6e824)：能够对图片中的地点与人物信息进行快速识别与分析。支持整图识别和对图片局部区域进行精准识别<br />
* [图像搜索 MCP](https://bigmodel.cn/marketplace/detail/d7e84d0318b0)：能够快速返回图片及网页相关信息，支持文本搜索、图片搜索、反向图片搜索及区域搜索等多种检索方式<br />
* [图像处理 MCP](https://bigmodel.cn/marketplace/detail/25a98db16370)：提供便捷、高效的图像处理（如裁剪、获取Url、画框等）能力

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 详细介绍 </div>

<Steps>
  <Step title="原生多模态工具调用" titleSize="h3">
    传统工具调用大多基于纯文本，在面对图像、视频、复杂文档等多模态内容时，需要多次中间转换，带来信息损失和工程复杂度。
    GLM-4.6V 从设计之初就围绕 「图像即参数，结果即上下文」 ，构建了原生多模态工具调用能力：

    * 输入多模态：图像、截图、文档页面等可以直接作为工具参数，无需先转为文字描述再解析，减少链路损耗。
    * 输出多模态：对于工具返回的统计图表、渲染后网页截图、检索到的商品图片等结果，模型能够再次进行视觉理解，将其纳入后续推理链路。
      模型原生支持基于视觉输入的工具调用，完整打通从感知到理解到执行的闭环。这使得 GLM-4.6V 能够应对图文混排输出、商品识别与好价推荐、以及辅助型 Agent 场景等更复杂的视觉任务。

    <Tabs>
      <Tab title="场景1：智能图文混排与内容创作">
        在内容创作与知识分发场景中，GLM-4.6V 可以从多模态输入中，自动构建高质量图文输出：无论是直接输入图文混杂的论文、研报、PPT，还是只给出一个主题，模型都能生成结构清晰、图文并茂的社交媒体内容。

        * 复杂图文理解：接收包含文本、图表、公式的文档，准确抽取结构化关键信息。
        * 多模态工具调用：在生成内容过程中，自动调用检索/搜索类工具，为每一段落寻找候选图片，或从原文中截取关键配图。
        * 图文混排输出与质量控制：对候选图片进行「视觉审核」，评估其与文字内容的相关性与质量，自动过滤无关或低质图片，输出可直接用于公众号、社交媒体或知识库的结构化图文结果。

        这一流程中，多模态理解、工具调用与质量控制均由 GLM-4.6V 模型独立在同一推理链路内完成。

        <video className="m-0 p-1" src="https://cdn.bigmodel.cn/static/4.6v/Case-推文-1208.m4v" controls />

        ⬆️案例1：仅输入主题，生成图文资讯

        <video className="m-0 p-1" src="https://cdn.bigmodel.cn/static/4.6v/Case-图文-1208.m4v" controls />

        ⬆️案例2：输入论文，生成图文并茂的科普文章
      </Tab>

      <Tab title="场景2：视觉驱动的识图购物与导购 Agent">
        在电商购物场景中，GLM-4.6V 模型可以独立完成从「看图」、「比价」、「生成导购清单」的完整链路。

        * **意图识别与任务规划：** 用户上传一张街拍图并发出「搜同款」等指令时，模型识别出购物意图，并自主规划调用 `image_search` 等相关工具。
        * **异构数据清洗与对齐：** 在京东、唯品会、拼多多等平台返回的多模态、非结构化结果基础上，模型自动完成信息清洗、字段归一化与结果对齐，过滤噪声和重复项。
        * **多模态导购结果生成：** 最终生成一张标准化 Markdown 导购表格，包含平台与店铺来源、价格、商品缩略图、匹配度与差异说明，以及可直接跳转的购买链接。

        <video className="m-0 p-1" src="https://cdn.bigmodel.cn/static/4.6v/Case-买同款-1208.m4v" controls />
      </Tab>

      <Tab title="场景3：前端复刻与多轮视觉交互开发">
        我们重点优化了 GLM-4.6V 在前端复刻与多轮视觉交互修改方面的能力，帮助开发者缩短「设计稿到可运行页面」的链路：

        * **像素级前端复刻：** 上传网页截图或设计稿后，模型可精准识别布局、组件与配色，生成高质量 HTML / CSS / JS 代码，实现接近像素级的页面还原。
        * **视觉交互调试：** 支持基于截图的多轮视觉交互。用户可以在生成的网页截图上圈选区域并发出自然语言指令（如「把这个按钮向左移一点，颜色改成深蓝」），模型自动定位并修正对应代码片段。

        通过 GLM Coding Plan 的视觉 MCP 协议，这一能力可以集成进现有 IDE、设计工具或内部工程平台，大幅提升前端迭代效率。

        <video className="m-0 p-1" src="https://cdn.bigmodel.cn/static/4.6v/Case-小红书-1208.m4v" controls />
      </Tab>

      <Tab title="场景4：长上下文的文档与视频理解">
        GLM-4.6V 将视觉编码器与语言模型的上下文对齐能力提升至128k，模型拥有了“过目不忘”的长记忆力。在实际应用中，128k上下文约等于150页的复杂文档、200页PPT或一小时视频，能够在单次推理中处理多个长文档或长视频。

        在下列案例中，用户一次输入 4 家上市公司的财报，GLM-4.6V 可以跨文档统一抽取核心指标，并理解报表与图表中的隐性信号，自动汇总成一张对比分析表，在长窗口条件下依然保持关键信息不丢失。

        <video className="m-0 p-1" src="https://cdn.bigmodel.cn/static/4.6v/Case-财报-1208.m4v" controls />

        上述能力同样适用于长视频内容的理解与定位：

        在长视频理解场景下，GLM-4.6V 既能对整段内容进行全局梳理，又能结合时序线索做细粒度推理，精准定位关键时间点，例如自动完成一场足球比赛的进球事件与比分时间轴总结。

        <video className="m-0 p-1" src="https://cdn.bigmodel.cn/static/4.6v/Case-球赛-1208.m4v" controls />
      </Tab>
    </Tabs>
  </Step>

  <Step title="同规模开源 SOTA" stepNumber={2} titleSize="h3">
    GLM-4.6V 在 MMBench、MathVista、OCRBench 等 30+ 主流多模态评测基准 上进行了验证，较上一代模型取得显著提升。在同等参数规模下，模型在多模态交互、逻辑推理和长上下文等关键能力上取得 SOTA 表现。其中9B版本的GLM-4.6V-Flash整体表现超过Qwen3-VL-8B，106B参数12B激活的GLM-4.6V表现比肩2倍参数量的Qwen3-VL-235B。

    ![Description](https://cdn.bigmodel.cn/markdown/1765165989046glm-4.6v-1.jpeg?attname=glm-4.6v-1.jpeg)
  </Step>
</Steps>

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
        "model": "glm-4.6v",
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
        "model": "glm-4.6v",
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
        model="glm-4.6v",  # 填写需要调用的模型名称
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
        model="glm-4.6v",  # 填写需要调用的模型名称
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
    implementation 'ai.z.openapi:zai-sdk:0.1.0'
    ```

    **基础调用**

    ```java  theme={null}
    import ai.z.openapi.ZhipuAiClient;
    import ai.z.openapi.service.model.*;
    import ai.z.openapi.core.Constants;
    import java.util.Arrays;

    public class GLM46VExample {
        public static void main(String[] args) {
            String apiKey = ""; // 请填写您自己的APIKey
            ZhipuAiClient client = ZhipuAiClient.builder()
                .apiKey(apiKey)
                .build();

            ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
                .model("glm-4.6v")
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

    public class GLM46VStreamExample {
        public static void main(String[] args) {
            String apiKey = ""; // 请填写您自己的APIKey
            ZhipuAiClient client = ZhipuAiClient.builder()
                .apiKey(apiKey)
                .build();

            ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
                .model("glm-4.6v")
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
        model="glm-4.6v",  # 填写需要调用的模型名称
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
        model="glm-4.6v",  # 填写需要调用的模型名称
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
        "model": "glm-4.6v",
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
        "model": "glm-4.6v",
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
        "model": "glm-4.6v",
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
        model="glm-4.6v",
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
        model="glm-4.6v",
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
        model="glm-4.6v",
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
        model="glm-4.6v",
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
    implementation 'ai.z.openapi:zai-sdk:0.1.0'
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
                .model("glm-4.6v")
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
                .model("glm-4.6v")
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
                .model("glm-4.6v")
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
                .model("glm-4.6v")
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