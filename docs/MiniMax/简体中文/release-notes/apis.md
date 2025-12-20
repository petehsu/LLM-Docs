# 功能更新

> 本文档汇总MiniMax开放平台接口更新动态，助力开发者了解平台最新能力，提升应用体验。

### 2025 年 10 月 28 日

* **视频生成接口**，新增 **MiniMax-Hailuo-2.3** 和 **MiniMax-Hailuo-2.3-Fast** 两个模型
* **MiniMax-Hailuo-2.3** 模型支持文生视频（T2V）和图生视频（I2V）两种生成模式
* **MiniMax-Hailuo-2.3-Fast** 模型支持图生视频（I2V）生成模式
* 两个模型均支持 768P（6s，10s）和 1080P（6s）分辨率

### 2025 年 09 月 23 日

* T2A v2 接口，支持控制音频恒定比特率编码
* 在 audio\_setting 参数下新增二级参数 force\_cbr，bool 类型，将此参数设置为 `ture`，可控制以恒定比特率（CBR）进行音频编码

### 2025 年 08 月 28 日

* 视频生成接口，MiniMax-Hailuo-02 首尾帧生成功能上线
* 新增参数“**last\_frame\_image**” string 类型，来控制视频结束帧画面
* 支持 768P（6s，10s），1080P（6s）

### 2025 年 08 月 02 日

* 视频生成接口，MiniMax-Hailuo-02 图生视频功能，支持 512 分辨率
* 512 分辨率下，支持设置 6s、10s 生成视频时长
* 新增参数“**fast\_pretreatment**” bool 类型，用于控制扩写模型选择，打开情况下能缩短扩写消耗的时长

### 2025 年 07 月 19 日

* 声音效果器功能上线，通过 voice\_modify 参数，实现音高、音强、音效等调节
* 效果器功能支持同步语音合成接口（含 Http, Websocket）、异步长文本语音合成接口

### 2025 年 07 月 15 日

* 视频 Agent API 上线，支持生成模板同款视频
* 11 个视频模版，持续更新
* 欢迎访问[视频模板列表](/faq/video-agent-templates)了解详细内容

### 2025 年 06 月 12 日

* 音色设计（Voice Design）上线，支持文本描述生成音色
* 原有文生音色接口维持不变，继续提供服务，但不再维护迭代，目前已收至历史接口目录中

### 2025 年 04 月 25 日

* image-01 模型新增**width**、**height**参数，支持用户自定义生成图片宽、高尺寸，满足用户更多生图尺寸需求


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt