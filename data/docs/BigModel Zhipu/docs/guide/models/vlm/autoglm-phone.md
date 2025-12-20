# AutoGLM-Phone

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-list.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 概览 </div>

AutoGLM-Phone 是一个基于视觉语言模型的 AI 手机智能助理框架。它能以多模态方式理解屏幕内容，并通过 ADB 自动操控设备。用户只需用自然语言下指令，如“打开小红书搜美食”，模型即可解析意图、理解界面并自动规划、执行操作流程，无需手动点击。

<Tip>
  新模型上线，限时免费！
</Tip>

<CardGroup cols={2}>
  <Card title="输入" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-right.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-right.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    需要完成的任务指令
  </Card>

  <Card title="输出" icon={<svg style={{maskImage: "url(/resource/icon/arrow-down-left.svg)", WebkitMaskImage: "url(/resource/icon/arrow-down-left.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    任务行动完成
  </Card>

  <Card title="支持的语言" icon={<svg style={{maskImage: "url(/resource/icon/brain.svg)", WebkitMaskImage: "url(/resource/icon/brain.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    中文
  </Card>

  <Card title="支持操控的硬件设备" icon={<svg style={{maskImage: "url(/resource/icon/puzzle-piece.svg)", WebkitMaskImage: "url(/resource/icon/puzzle-piece.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    Android 系统的手机
  </Card>
</CardGroup>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/stars.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 推荐场景 </div>

<Tabs>
  <Tab title="外卖选购">
    1. 外卖下单：
       * 在淘宝上的闪购帮我查找库迪咖啡的经典拿铁并下单
    2. 再来一单：
       * 用美团再点一单最近的外卖。
  </Tab>

  <Tab title="商品购买">
    1. 商品下单：
       * 帮我在京东下单购买小米手环九pro
    2. 评价查询：
       * 打开拼多多应用，搜索笔记本，查看销量最高的笔记本商品的评价。
  </Tab>

  <Tab title="出行服务">
    1. 路线规划：
       * 规划一条从重庆解放碑到重庆火锅博物馆的步行路线。
    2. 周边查询：
       * 圆明园周围有停车场吗
    3. 订机票/车票/门票：
       * 帮我查一下明天广州到北京的机票
    4. 订酒店：
       * 帮我预定一晚靠近合生汇地铁口的五星级酒店
  </Tab>

  <Tab title="资讯新闻">
    1. 搜索：
       * 帮我用汽水音乐搜一下《平凡之路》这首歌来听听
    2. 播放：
       * 用番茄小说帮我播放一本悬疑题材的有声书
    3. 点赞/评论/收藏：
       * 去哔哩哔哩搜索英雄联盟直播并播放，评论ig加油
  </Tab>

  <Tab title="租房找房">
    1. 按条件找房
       * 我在上海黄浦区附近上班，帮我查找周边的合租，我的预算为2500元到3500元之间，我想找个南朝向，户型为三居。
  </Tab>
</Tabs>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/gauge-high.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 使用资源 </div>

[接口文档](/api-reference/%E6%A8%A1%E5%9E%8B-api/%E5%AF%B9%E8%AF%9D%E8%A1%A5%E5%85%A8)：API 调用方式

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 详细介绍 </div>

<Steps>
  <Step title="模型亮点" titleSize="h3">
    * **技术全面性**：核心技术是 AutoGLM 多模态模型 + ADB 设备控制， 集成了视觉理解、任务规划、工具调用等完整能力栈；
    * **商业化验证**：已在诸多合作以及测试中验证了实用性和稳定性；
    * **应用价值**：真正的端到端智能，实现"所说即所得"的手机控制体验。
  </Step>

  <Step title="支持的应用" stepNumber={2} titleSize="h3">
    AutoGLM-Phone 支持 50+ 款主流中文应用，以下列举部分：

    | **分类** | **应用**          |
    | :----- | :-------------- |
    | 社交通讯   | 微信、QQ、微博        |
    | 电商购物   | 淘宝、京东、拼多多       |
    | 美食外卖   | 美团、饿了么、肯德基      |
    | 出行旅游   | 携程、12306、滴滴出行   |
    | 视频娱乐   | bilibili、抖音、爱奇艺 |
    | 音乐音频   | 网易云音乐、QQ音乐、喜马拉雅 |
    | 生活服务   | 大众点评、高德地图、百度地图  |
    | 内容社区   | 小红书、知乎、豆瓣       |

    全量支持的应用，可到 [开源项目](https://github.com/zai-org/Open-AutoGLM/blob/main/README.md#%E6%94%AF%E6%8C%81%E7%9A%84%E5%BA%94%E7%94%A8) 中运行脚本查看（欢迎点亮星星～）
  </Step>

  <Step title="可执行的操作" stepNumber={3} titleSize="h3">
    | 操作           | 描述              |
    | :----------- | :-------------- |
    | `Launch`     | 启动应用            |
    | `Tap`        | 点击指定坐标          |
    | `Type`       | 输入文本            |
    | `Swipe`      | 滑动屏幕            |
    | `Back`       | 返回上一页           |
    | `Home`       | 返回桌面            |
    | `Long Press` | 长按              |
    | `Double Tap` | 双击              |
    | `Wait`       | 等待页面加载          |
    | `Take_over`  | 请求人工接管（登录/验证码等） |
  </Step>
</Steps>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/ballot.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 应用示例 </div>

<Tabs>
  <Tab title="外卖选购">
    <video src="https://cdn.bigmodel.cn/static/autoglm/autoglm-1.mp4" controls />

    > 帮我在美团点一杯冰豆花
  </Tab>

  <Tab title="商品比价">
    <video src="https://cdn.bigmodel.cn/static/autoglm/autoglm-2.mp4" controls />

    > 给我对比一下“32K显示器”哪个购物平台便宜，找一个最便宜的下单
  </Tab>

  <Tab title="播客播放">
    <video src="https://cdn.bigmodel.cn/static/autoglm/autoglm-3.mp4" controls />

    > 帮我看一下小宇宙上，晚点聊这周更新了没，把最新一期帮我放到播放列表，我一会路上要听
  </Tab>

  <Tab title="餐厅预订">
    <video src="https://cdn.bigmodel.cn/static/autoglm/autoglm-4.mp4" controls />

    > 给我在美团预订一个今晚上19:30日料餐厅
  </Tab>

  <Tab title="差旅场景">
    <video src="https://cdn.bigmodel.cn/static/autoglm/autoglm-5.mp4" controls />

    > 我下周一要出差，你现在飞书上帮我给太宰发一条请假消息“我下一周要出差，需要请个假”，然后再去携程上帮我预定一张下周一从北京到广州的高铁票
  </Tab>

  <Tab title="制定旅游路线">
    <video src="https://cdn.bigmodel.cn/static/autoglm/autoglm-6.mp4" controls />

    > 我下周六要去长春玩，帮我总结下当前页面上推荐的景点，到高德地图上收藏一下这几个景点，特别是具体看看博物馆门票价格，再去12306上订一张上午十点从北京去长春的高铁票，把相关信息整理好给我
  </Tab>
</Tabs>

## <div className="flex items-center"> <svg style={{maskImage: "url(/resource/icon/rectangle-code.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} /> 调用指南 </div>

### 环境准备

#### 1. Python 环境

建议使用 Python 3.10

#### 2. ADB (Android Debug Bridge)

* 下载官方 ADB 安装包并解压到自定义路径
  [https://developer.android.com/tools/releases/platform-tools?hl=zh-cn](https://developer.android.com/tools/releases/platform-tools?hl=zh-cn)
* 配置环境变量：
  * MacOS：`export PATH=${PATH}:~/Downloads/platform-tools`
  * Windows：参考 [第三方教程](https://blog.csdn.net/x2584179909/article/details/108319973) 配置环境变量
* 验证adb是否安装成功:

```
# adb --version

Android Debug Bridge version 1.0.41
Version 36.0.0-13206524
Installed as /opt/homebrew/bin/adb
Running on Darwin 22.4.0 (arm64)
```

#### 3. Android 设备配置

* Android 7.0+ 的设备或模拟器
* 启用开发者模式：设置-关于手机-版本号连续点击10次
* 启用 USB 调试：设置-开发者选项-USB调试

<div style={{ display: "flex", gap: "12px" }}>
  <img src="https://cdn.bigmodel.cn/markdown/1765450065050image.png?attname=image.png" style={{ height: "400px", width: "180px" }} />

  <img src="https://cdn.bigmodel.cn/markdown/1765450098878image.png?attname=image.png" style={{ height: "400px", width: "180px" }} />
</div>

#### 4. 安装 ADB Keyboard

下载 ADBKeyboard.apk 并在设备中安装，安装后到设置-输入法中启用 ADB Keyboard

[https://github.com/senzhk/ADBKeyBoard/blob/master/ADBKeyboard.apk](https://github.com/senzhk/ADBKeyBoard/blob/master/ADBKeyboard.apk)

<div style={{ display: "flex", gap: "12px" }}>
  <img src="https://cdn.bigmodel.cn/markdown/1765450110671image.png?attname=image.png" style={{ height: "400px", width: "180px" }} />

  <img src="https://cdn.bigmodel.cn/markdown/1765450120391image.png?attname=image.png" style={{ height: "400px", width: "180px" }} />
</div>

### 🔨 部署准备

#### 1. 仓库克隆

```
git clone https://github.com/zai-org/Open-AutoGLM.git
```

#### 2. 安装依赖

```
pip install -r requirements.txt
pip install -e .
```

#### 3. 配置 ADB 连接

```
# 检查已连接的设备
adb devices
# 输出应显示你的设备，如：emulator-5554   device
```

#### 4. 配置模型 API

```
python main.py --base-url https://open.bigmodel.cn/api/paas/v4 --model "autoglm-phone" --apikey "你的apikey" "打开美团搜索附近的火锅店"
```


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt