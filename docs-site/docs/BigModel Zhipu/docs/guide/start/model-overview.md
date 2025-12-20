# 模型概览

<Tip>
  GLM Coding 套餐全新上线！旗舰模型 GLM-4.6 包月畅享，适用于 Claude Code、Cline 等主流编程工具，1/7价格，3倍用量，独家升级支持联网搜索&多模态理解。限时特惠 ¥20/月起，手慢无，[立享好价](https://zhipuaishengchan.datasink.sensorsdata.cn/t/Pd)！
</Tip>

## 推荐模型

<CardGroup cols={3}>
  <Card title="GLM-4.6" icon={<svg style={{maskImage: "url(/resource/icon/book-open.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>} href="/cn/guide/models/text/glm-4.6">
    **最新旗舰模型**

    * 上下文提升至200K
    * 代码能力全面进阶
  </Card>

  <Card title="GLM-4.6V" icon={<svg style={{maskImage: "url(/resource/icon/glasses.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>} href="/cn/guide/models/vlm/glm-4.6v">
    **同规模SOTA的视觉模型**

    * 全面支持工具调用
    * 128K超长上下文
  </Card>

  <Card title="CogVideoX-3" icon={<svg style={{maskImage: "url(/resource/icon/video.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>} href="/cn/guide/models/video-generation/cogvideox-3">
    **高性能视频生成模型**

    * 主观清晰度大幅提升
    * 新增首尾帧生成功能
  </Card>
</CardGroup>

## 模型一览

<Tip>
  若需要看模型价格，请直接前往[价格页面](https://open.bigmodel.cn/pricing)。
</Tip>

### 文本模型

文本模型是一类专注于处理和生成自然语言的模型，涵盖了语言理解与推理能力，能够自动处理海量文本数据并进行逻辑推导。智谱的文本模型结合了强大的语言模型和推理模型，使得系统不仅能理解和生成文本内容，还能进行高层次的推理和判断。

| 模型                                                   | 定位       | 特点                                                             | 上下文  | 最大输出 |
| :--------------------------------------------------- | :------- | :------------------------------------------------------------- | :--- | :--- |
| [GLM-4.6](/cn/guide/models/text/glm-4.6)             | 高智能旗舰    | - 智谱最强性能 <br />- 高级编码能力、强大推理以及工具调用能力                           | 200K | 128K |
| [GLM-4.5](/cn/guide/models/text/glm-4.5)             | 超强性能     | - 性能优秀 <br />- 强大的推理能力、代码生成能力以及工具调用能力                          | 128K | 96K  |
| [GLM-4.5-X](/cn/guide/models/text/glm-4.5)           | 超强性能-极速版 | - 推理速度更快 <br />- 适用于搜索问答、智能助手、实时翻译等时效性较强场景                     | 128K | 96K  |
| [GLM-4.5-Air](/cn/guide/models/text/glm-4.5)         | 高性价比     | - 在推理、编码和智能体任务上表现强劲                                            | 128K | 96K  |
| [GLM-4.5-AirX](/cn/guide/models/text/glm-4.5)        | 高性价比-极速版 | - 推理速度快，且价格适中 <br />- 适用于时效性有较强要求的场景                           | 128K | 96K  |
| [GLM-4-Plus](/cn/guide/models/text/glm-4)            | 性能优秀     | - 语言理解、逻辑推理、指令遵循、长文本处理效果领先                                     | 128K | 4K   |
| [GLM-4-Air-250414](/cn/guide/models/text/glm-4)      | 高性价比     | - 快速执行复杂任务 <br />- 擅长工具调用、联网搜索、代码                              | 128K | 16K  |
| [GLM-4-Long](/cn/guide/models/text/glm-4-long)       | 超长输入     | - 支持高达 1M 的上下文长度 <br />- 能够理解和回应复杂的查询 <br />- 专为处理超长文本和记忆型任务设计 | 1M   | 4K   |
| [GLM-4-AirX](/cn/guide/models/text/glm-4)            | 极速推理     | - 超快的推理速度 <br />- 强大的推理效果                                      | 8K   | 4K   |
| [GLM-4-FlashX-250414](/cn/guide/models/text/glm-4)   | 高速低价     | - Flash 增强版本 <br />- 超快推理速度 <br />- 更快并发保障                     | 128K | 16K  |
| [GLM-4.5-Flash](/cn/guide/models/free/glm-4.5-flash) | 免费模型     | - 最新基座模型的普惠版本                                                  | 128K | 96K  |
| [GLM-4-Flash-250414](/cn/guide/models/text/glm-4)    | 免费模型     | - 超长上下文处理能力 <br />- 多语言支持 <br />- 支持外部工具调用                     | 128K | 16K  |

### 视觉模型

视觉模型是一类能处理图像或视频等视觉信息的模型，广泛应用于识别、分析与决策任务。其中，视觉理解模型侧重于看懂图像内容，如识别物体、场景和关系；而视觉推理模型进一步具备看图思考的能力，能结合视觉与语言信息完成逻辑判断、因果分析和多步推理，常用于图文问答、图像描述生成、多模态对齐等复杂任务。

| 模型                                                                       | 定位     | 特点                                                             | 上下文  | 最大输出              |
| :----------------------------------------------------------------------- | :----- | :------------------------------------------------------------- | :--- | :---------------- |
| [GLM-4.6V](/cn/guide/models/vlm/glm-4.6v)                                | 旗舰视觉推理 | - 视觉推理模型SOTA <br />- 原生支持工具调用 <br />- 超长上下文 <br />- 前端代码复刻效果提升 | 128K | 32K               |
| [GLM-4.5V](/cn/guide/models/vlm/glm-4.5v)                                | 视觉推理   | - 覆盖视频理解、复杂文件解析、前端复刻等核心场景 <br />- 新增“思考模式”开关                   | 64K  | 16K               |
| [GLM-4.1V-Thinking-FlashX](/cn/guide/models/vlm/glm-4.1v-thinking)       | 轻量视觉推理 | - 视觉推理能力 <br />- 复杂场景理解 <br />- 多步骤分析<br />- 高并发               | 64K  | 16K               |
| [GLM-4V-Plus-0111](/cn/guide/models/vlm/glm-4v-plus-0111)                | 视觉理解   | - 图像理解能力强 <br />- 支持图文对话 <br />- 场景识别准确                        | 16K  | 动态计算：<br />上下文-输入 |
| [GLM-4.6V-Flash](/cn/guide/models/free/glm-4.6v-flash)                   | 免费模型   | - 视觉推理能力 <br />- 支持工具调用 <br />- 可灵活开关思考模式                      | 128K | 32K               |
| [GLM-4.1V-Thinking-Flash](/cn/guide/models/free/glm-4.1v-thinking-flash) | 免费模型   | - 视觉推理能力 <br />- 复杂场景理解 <br />- 多步骤分析                          | 64K  | 16K               |
| [GLM-4V-Flash](/cn/guide/models/free/glm-4v-flash)                       | 免费模型   | - 图像理解 <br />- 多语言支持                                           | 16K  | 动态计算：<br />上下文-输入 |

### 图像生成模型

图像生成模型是一类通过学习海量图像数据，实现从文本生成高质量图片的模型，广泛应用于视觉内容创作、游戏美术、产品设计、医学影像合成等领域。

| 模型                                                       | 定位   | 特点                                   | 多分辨率 |
| :------------------------------------------------------- | :--- | :----------------------------------- | :--- |
| [CogView-4](/cn/guide/models/image-generation/cogview-4) | 图像生成 | - 高质量图像生成 <br />- 风格多样化 <br />- 细节丰富 | 支持   |
| [CogView-3-Flash](/cn/guide/models/free/cogview-3-flash) | 免费模型 | - 创意丰富多样 <br />- 推理速度快               | 支持   |

### 视频生成模型

视频生成模型是一类通过学习时序视觉数据，从文本、图像或其他视频素材生成动态视频内容的模型，广泛应用于影视制作、虚拟人、动画生成、数字营销等领域。

| 模型                                                           | 定位    | 特点                                                                      | 多模态支持     | 多分辨率 |
| :----------------------------------------------------------- | :---- | :---------------------------------------------------------------------- | --------- | :--- |
| [CogVideoX-3](/cn/guide/models/video-generation/cogvideox-3) | 高智能旗舰 | - 主观清晰度大幅提升<br />- 更好的指令遵循、物理真实模拟<br />- 现实、3D风格场景表现提升<br />- 新增首尾帧生成功能 | 图像、文本、首尾帧 | 支持   |
| [CogVideoX-2](/cn/guide/models/video-generation/cogvideox-2) | 高性价比  | - 支持主体进行大幅度运动 <br />- 驾驭多种艺术风格                                          | 图像、文本     | 支持   |
| [Vidu Q1](/cn/guide/models/video-generation/viduq1)          | 质量较优  | - 影视级的画质清晰度 <br />- 精准解决画面崩坏 <br />- 多艺术形态的风格 <br />- 行业标杆级转场流畅度        | 图像、文本、首尾帧 | 不支持  |
| [Vidu 2](/cn/guide/models/video-generation/vidu2)            | 高速低价  | - 速度优、性价比优 <br />- 语义增强的首尾帧衔接 <br />- 多参考图的一致性强化                        | 图像、参考、首尾帧 | 不支持  |
| [CogVideoX-Flash](/cn/guide/models/free/cogvideox-flash)     | 免费模型  | - 沉浸式AI音效 <br />- 4K 高清画质呈现 <br />- 10 秒视频时长拓展 <br />- 60fps 高帧率输出      | 图像、文本     | 支持   |

### 音视频模型

音视频模型是一类处理音频与视频信号的多模态模型，能够理解、生成或编辑视听内容，广泛应用于虚拟人、语音驱动动画、视频配音与剪辑、跨模态检索等场景。

| 模型                                                              | 定位     | 特点                                                          | 多模态支持    |
| :-------------------------------------------------------------- | :----- | :---------------------------------------------------------- | :------- |
| [GLM-TTS](/cn/guide/models/sound-and-video/glm-tts)             | 语音合成模型 | - 超拟人语音合成，情感表达增强 <br />- 非流式与流式接口                           | 文本       |
| [GLM-TTS-Clone](/cn/guide/models/sound-and-video/glm-tts-clone) | 音色克隆模型 | - 3秒音频即可生成音色 <br />- 支持普通话及轻口音<br />- 细腻的情感表达               | 文本、音频    |
| [GLM-ASR-2512](/cn/guide/models/sound-and-video/glm-asr-2512)   | 语音识别   | - 字符错误率（CER）仅为 0.0717 <br />- 支持用户自定义词汇 <br />- 支持多种主流语言和方言 | 音频       |
| [GLM-Realtime](/cn/guide/models/sound-and-video/glm-realtime)   | 实时音视频  | - 能够提供实时的视频通话功能，通话记忆时长长达2分钟 <br />- 具有跨文本、音频和视频进行实时推理的能力    | 视频、音频、文本 |
| [GLM-4-Voice](/cn/guide/models/sound-and-video/glm-4-voice)     | 语音模型   | - 直接理解和生成中英文语音，实现实时语音对话 <br />- 根据用户指令灵活调整语音的情感、语调、语速和方言等特性 | 文本、音频    |

### 向量模型

向量模型用于将高维的离散数据转换为低维的连续向量，捕捉数据的语义特征和关系。您可以使用我们的向量模型构建语义检索增强、聚类、主题建模和分类等功能。

| 模型                                                    | 定位 | 上下文 |
| :---------------------------------------------------- | :- | :-- |
| [Embedding-3](/cn/guide/models/embedding/embedding-3) | V3 | 8K  |
| [Embedding-2](/cn/guide/models/embedding/embedding-2) | V2 | 8K  |

### 其他模型

| 模型         | 定位    | 特点                               | 上下文  | 最大输出 |
| :--------- | ----- | :------------------------------- | :--- | :--- |
| CharGLM-4  | 拟人模型  | 适用于情感陪伴和虚拟角色                     | 8K   | 4K   |
| Emohaa     | 心理模型  | 具备专业咨询能力，帮助用<br />户理解情感并应对情绪问题   | 8K   | 4k   |
| CodeGeeX-4 | 代码模型  | 适用于代码自动补全任务                      | 128K | 32k  |
| Rerank     | 重排序模型 | 计算文本之间的 score 值，<br />对召回结果进行重排序 | 4K   | -    |

### 即将弃用模型

我们已经宣布了以下模型的弃用日期。在这些模型弃用后，我们会将它们自动路由至新的模型。请用户注意在弃用日期之前，将您的模型编码更新为最新版本，以确保服务的顺畅过渡。

| 模型         | 弃用时间        | 指向模型 |
| :--------- | :---------- | :--- |
| GLM-Z1系列   | 2025年11月15日 | -    |
| GLM-4-0520 | 2025年12月30日 | -    |


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt