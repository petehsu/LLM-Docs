# 视频生成

> Prompt 工程视频生成模型

> 提示词的精确度与细节水平直接影响视频内容的质量。采用**结构化提示词**可以极大提升视频内容的符合度和专业性。

以下是构建提示词的关键组成部分：

**提示词 = (镜头语言 + 景别角度 + 光影) + 主体 (主体描述) + 主体运动 + 场景 (场景描述) + (氛围)**

* **镜头语言**: 通过镜头的各种应用以及镜头之间的衔接和切换来传达故事或信息，并创造出特定的视觉效果和情感氛围。如镜头平移，推近、拉远、升降拍摄、摇摄、跟随拍摄、手持拍摄、无人机航拍等;
* **景别角度**：控制相机与被摄对象之间距离和角度，实现不同的视觉效果和情感表达。如大全景、中景、近景 、鸟瞰视角 、跟随视角、鱼眼效果等;
* **光影**: 光影是赋予摄影作品灵魂的关键元素，光影的运用可以使照片更具深度，更具情感，我们可以通过光影创造出富有层次感和情感表达力的作品。如自然光、丁达尔效应、柔和散射、硬光直射 、逆光剪影、三点布光等;
* **主体**: 主体是视频中的主要表现对象。如儿童、狮子、向日葵，汽车、城堡等;
* **主体描述**: 对主体外貌细节和肢体姿态等的描述，如人物的服饰、动物的毛色、植物的颜色、物体的状态和建筑的风格;
* **主体运动**: 对主体运动状态的描述，包括静止和运动等，运动状态不宜过于复杂，符合 6s 视频内可以展现的画面即可，
* **场景**: 场景是主体所处的环境，包括前景、背景等;
* **场景描述**: 对主体所处环境的细节描述。如都市环境、乡村风光、工业区等;
* **氛围**: 对预期视频画面的氛围描述。如喧嚣繁忙、悬疑惊悚、宁静舒适等;

## 提示词技巧

* **关键词重复**：在提示的不同部分重复或强化关键词有助于提高输出的一致性。如摄像机以**超高速**镜头**快速**飞过森林。
* **聚焦内容**：提示词应集中在视频中应有的内容上。如：冷清的街道，而不是"没有人的街道"。
* **使用智能体**：使用 [提示词智能体](https://chatglm.cn/main/gdetail/669911fe0bef38883947d3c6) 帮助你生成专业提示词。

## 文生视频示例

### Prompt

比得兔（主体）开小汽车（主体描述），
游走在马路上（环境描述），
脸上的表情充满开心喜悦（氛围设定）

### 视频

<video src="https://sfile.chatglm.cn/testpath/video/4d81e8a7-b6c5-5658-b3d2-95656903476d_0.mp4" controls />

### Prompt

一个金发碧眼的女人站在水里（环境描述），
一群粉红色的水母从水里游向天空（动作）

### 视频

<video src="https://sfile.chatglm.cn/testpath/video/ea6590b2-cc71-5a3b-b728-6322fda5d5b4_0.mp4" controls />

### Prompt

夜晚的丛林中，一只猫头鹰站在枯树枝上（环境描述），
猫头鹰的眼睛在月光下闪闪发亮（动作）。
背景是一片寂静的森林。

### 视频

<video src="https://sfile.chatglm.cn/testpath/video/cb850ab9-fe6b-5745-9eeb-2895d08eb9a3_0.mp4" controls />

### Prompt

深海里（环境描述）的一艘沉船（主体），
电影质感，由远到近（镜头语言）

### 视频

<video src="https://sfile.chatglm.cn/testpath/video/1aa1515f-1193-58bf-83d7-3bd62b765f62_0.mp4" controls />

### Prompt

特写镜头（镜头描述），傍晚的微光（光线运用），
一只鹦鹉站在阳台的栏杆上，
鹦鹉有着紫色的羽毛和粉色的喙（主体描述），
背景是都市的高楼大厦（环境描述）。

### 视频

<video src="https://sfile.chatglm.cn/testpath/video/61cf829a-0741-56d7-89b6-0c5ae4e51287_0.mp4" controls />

## 图生视频示例

CogVideoX 可以将用户提供的静态图像转化为 6 秒的动态视频。为达到最佳效果，推荐上传比例为 **3:2** 的图片，并且文件格式为 PNG 或 JPEG，文件大小不超过 5MB。**提示词建议使用"主体（背景）+ 运动描述"的表达方式。**

以下为基于图片及对应Prompt生成的视频效果，每张图片搭配文字描述作为生成指令，最终输出对应视频内容：

### 案例1：星空缓慢旋转

**Prompt图片**：

![星空缓慢旋转](https://cdn.bigmodel.cn/static/platform/images/usage-guide/cogvideo/1.png)

\
**生成指令**：星空缓慢旋转\
**对应生成视频**：

<video src="https://cdn.bigmodel.cn/static/platform/videos/usage-guide/cogvideo/1.mp4" controls />

### 案例2：风吹动她的头发

**Prompt图片**：

![风吹动她的头发](https://cdn.bigmodel.cn/static/platform/images/usage-guide/cogvideo/2.png)

\
**生成指令**：风吹动她的头发\
**对应生成视频**：

<video src="https://cdn.bigmodel.cn/static/platform/videos/usage-guide/cogvideo/3.mp4" controls />

### 案例3：鸭子在游动

**Prompt图片**：

![鸭子在游动](https://cdn.bigmodel.cn/static/platform/images/usage-guide/cogvideo/3.png)

\
**生成指令**：鸭子在游动\
**对应生成视频**：

<video src="https://cdn.bigmodel.cn/static/platform/videos/usage-guide/cogvideo/2.mp4" controls />


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt