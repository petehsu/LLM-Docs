# 智谱AI输入法

## 产品简介

<Tip>
  智谱AI输入法是一款基于先进AI技术的智能语音输入助手，通过简单的Fn快捷键操作，即可将您的语音实时转换为高质量文字。产品可在微信、飞书、Word、代码编辑器等各类输入框中使用，无论是日常聊天、工作文档还是专业术语，都能准确识别并转换，大幅提升您的输入效率。**（现已同时支持 macOS 与 Windows 系统）**
</Tip>

<Note>
  所有 GLM Coding 套餐用户可享**智谱AI输入法**使用权益，且在套餐有效期内不限量使用。使用和套餐账号「相同手机号」注册激活[智谱AI输入法](https://autoglm.zhipuai.cn/autotyper/)并成功登陆后，即可看到权益生效，未绑定手机号的可在账号设置中绑定。
</Note>

<CardGroup cols={3}>
  <Card title="精准识别" icon={<svg style={{maskImage: "url(/resource/icon/shield-check.svg)", WebkitMaskImage: "url(/resource/icon/shield-check.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    错误率极低，专属词汇、中英混合、行业术语识别表现优异
  </Card>

  <Card title="内置多重人设" icon={<svg style={{maskImage: "url(/resource/icon/stars.svg)", WebkitMaskImage: "url(/resource/icon/stars.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    在菜单栏一键切换不同内置人设，适应不同对话场景
  </Card>

  <Card title="语音召唤AI" icon={<svg style={{maskImage: "url(/resource/icon/headset.svg)", WebkitMaskImage: "url(/resource/icon/headset.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    选中文本或轻呼 “小凹”，即可唤醒GLM模型，通过语音直接下达复杂任务指令
  </Card>
</CardGroup>

## 使用方法

### 1. 安装与设置

<Info>
  现已同时支持 macOS 与 Windows 系统
</Info>

* 访问[智谱AI输入法](https://autoglm.zhipuai.cn/autotyper/)官网下载并安装应用
* 使用与 GLM Coding Plan 套餐相同手机号登录
* 使用邀请码激活账号（邀请码：CYFEU88M）
* 完成新手引导，了解基本操作（新手引导很重要！）
* 设置偏好人设和语音输入快捷键
* 设置专属热词： 在设置菜单中找到“词典”，添加您常用的专属名词，让识别更默契。

![Description](https://cdn.bigmodel.cn/markdown/1764643928622Gemini_Generated_Image_utwr2xutwr2xutwr.png?attname=Gemini_Generated_Image_utwr2xutwr2xutwr.png)

### 2. 基本操作

* 在任意输入框中，按住 Fn键(MAC)/右Control或者Alt+空格(Win) 激活语音输入
* 说话内容将实时转换为文字
* 松开 Fn键(MAC)/右Control或者Alt+空格(Win)，文字自动输入到光标位置

### 3. 高级功能

* 切换不同人设，适应不同场景
* 选中文本，按住 Fn键(MAC)/右Control或者Alt+空格(Win) 激活语音输入，发出指令
* 按住 Fn键(MAC)/右Control或者Alt+空格(Win)，语音唤起“小凹”，随后发出指令，立即解决任务；（“小凹，给我做一个北京3天的旅游攻略”）
* 使用历史记录查看和管理之前的输入

## Voice Coding 场景案例

<Note>
  在「人设」页选中「命令行大神」即可复现以下CASE。
</Note>

### 一、 运维与监控：高频操作零延迟

<Tip>
  解决痛点：日常敲击次数最多、最枯燥的指令，用语音瞬间完成。
</Tip>

<Tabs>
  <Tab title="Case 1：进程与资源监控">
    * 语音指令：“显示所有 python 进程。”
    * 智谱AI输入法：`ps aux | grep python`
    * 语音指令：“查看当前文件夹硬盘占用。”
    * 智谱AI输入法：`du -sh` .

    <video controls src="https://cdn.bigmodel.cn/static/autotyper/autotyper-1.mp4" />

    <p align="center">显示所有 python 进程</p>

    <video controls src="https://cdn.bigmodel.cn/static/autotyper/autotyper-2.mp4" />

    <p align="center">查看当前文件夹硬盘占用</p>
  </Tab>

  <Tab title="Case 2：可视化依赖分析">
    * 语音指令：“树形结构显示进程间依赖。”
    * 智谱AI输入法：`ps -ef --forest` (或 `pstree`)

    <video controls src="https://cdn.bigmodel.cn/static/autotyper/autotyper-3.mp4" />

    <p align="center">以树形结构显示进程间依赖关系</p>
  </Tab>
</Tabs>

### 二、 复杂命令与工具：告别参数记忆

<Tip>
  解决痛点：工具极其强大，但参数极其难记，手写极易出错。
</Tip>

<Tabs>
  <Tab title="Case 3：多媒体黑科技（🌟 重点推荐）">
    * 语音指令：“把 demo.mp4 转成 GIF，只要前 3 秒，宽度缩放到 320。”
    * 智谱AI输入法：`ffmpeg -i demo.mp4 -t 3 -vf scale=320:-1 output.gif`

    <video controls src="https://cdn.bigmodel.cn/static/autotyper/autotyper-4.mp4" />

    <p align="center">把这个视频转成 GIF，只要前 5 秒，缩放到 320 宽</p>
  </Tab>

  <Tab title="Case 4：Python 环境管理">
    * 语音指令：“pip 安装 transformer库”
    * 智谱AI输入法： `pip install transformers`

    <video controls src="https://cdn.bigmodel.cn/static/autotyper/autotyper-5.mp4" />

    <p align="center">pip安装transformer库</p>
  </Tab>
</Tabs>

### 三、 数据库查询

<Tip>
  解决痛点：跳过样板代码，直接将业务逻辑转换为 SQL 语句
</Tip>

<Tabs>
  <Tab title="Case 5：MySQL">
    * 语音指令：“查询用户表中年龄大于 30 且部门是‘技术部’的人。”
    * 智谱AI输入法：
      `SELECT * FROM employees WHERE age > 30 AND department = '技术部';`

    <video controls src="https://cdn.bigmodel.cn/static/autotyper/autotyper-6.mp4" />

    <p align="center">查询30岁以上并且在技术部的所有人的数据</p>
  </Tab>
</Tabs>

### 四、 趣味与实用

<Tip>
  好玩，爱玩
</Tip>

<Tabs>
  <Tab title="Case 6：一句话查天气">
    * 语音指令：“查一下北京今天的天气。”
    * 智谱AI输入法：`curl wttr.in/beijing`

    <video controls src="https://cdn.bigmodel.cn/static/autotyper/autotyper-7.mp4" />

    <p align="center">查一下北京今天的天气</p>
  </Tab>

  <Tab title="Case 7：一句话查汇率">
    * 语音指令：“查询一下人民币对美元的汇率”
    * 智谱AI输入法：`curl -s "https://api.exchangerate-api.com/v4/latest/CNY" | grep -o '"USD":[0-9.]*' | cut -d: -f2`

    <video controls src="https://cdn.bigmodel.cn/static/autotyper/autotyper-8.mov" />

    <p align="center">查一下人民币兑美元的汇率</p>
  </Tab>
</Tabs>

## 更多场景案例

<Tabs>
  <Tab title="一句话完成数学计算">
    <video controls src="https://cdn.bigmodel.cn/static/autotyper/autotyper-9.mp4" />
  </Tab>

  <Tab title="一句话查找遗忘的linux指令">
    <video controls src="https://cdn.bigmodel.cn/static/autotyper/autotyper-10.mov" />
  </Tab>

  <Tab title="把这个视频转成 GIF，只要前 5 秒，缩放到 320 宽">
    <video controls src="https://cdn.bigmodel.cn/static/autotyper/autotyper-11.mp4" />
  </Tab>

  <Tab title="快速重新排版">
    <video controls src="https://cdn.bigmodel.cn/static/autotyper/autotyper-12.mp4" />
  </Tab>

  <Tab title="快速翻译">
    <video controls src="https://cdn.bigmodel.cn/static/autotyper/autotyper-13.mp4" />
  </Tab>
</Tabs>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt