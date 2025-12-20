# 音乐生成创意玩法

> MiniMax 音乐生成模型在咪咕彩铃和小红书玩法。

## 解决方案

### 咪咕彩铃玩法

**彩铃个性化定制**

1. 用户可通过咪咕彩铃平台，上传个人干声（`voice_id`）、伴奏（`instrumental_id`）及歌词（`lyrics`），调用 **Music Generation ​API** 生成个性化彩铃
2. 支持 **TTS、声音唱歌模式、​ 文生音色唱歌模式、清唱模式**等，生成后的成品可直接设置为个人彩铃

   <Warning>
     版权提醒：干声、伴奏及歌词需用户自行确保版权合规
   </Warning>

**AI 热门歌曲歌单生成**

1. 平台可根据热门曲风标签（如流行、R\&B、摇滚、古风）自动生成 AI 翻唱歌曲，用于彩铃推荐
2. 通过 文生音色接口 配合流行度排行数据，批量合成多个不同音色版本，满足用户的差异化需求

**互动玩法：彩铃+BGM**

1. 支持在咪咕 App 内录制语音并加 BGM，形成“语音铃声”玩法，例如节日祝福、情侣对话等
2. 可调用 BGM 模式（仅伴奏）+TTS 生成，带来沉浸式铃声体验

### 小红书玩法

**音乐笔记制作**

1. 用户可在小红书直接输入歌词+选择曲风，调用 Music Generation API 生成歌曲音频，再配合图片或短视频发布音乐笔记
2. 曲风支持 16 种，可切换试听，系统将自动渲染成视频封面+ BGM 成品

**唱聊玩法**

1. 在小红书的群聊功能中，输入歌词 → 选择曲风 → 实时生成歌曲并发送至群聊
2. 支持 AI 生成封面图（结合文生图 API）+音乐同步生成，方便直接转发或发布

**声聊+音乐配音**

1. 用户输入文字，AI 按选择的音色（voice\_id）生成配音，同时可叠加 BGM
2. 适合剧情类短视频、Vlog 解说、情绪类分享等

## 使用示例

1. TTS 声音歌唱模式

<CodeGroup dropdown>
  ```python  theme={null}
  {
    "voice_id": "xxxx",
    "instrumental_id": "yyyy",
    "lyrics": "这里是一段歌词文本",
    "output_format": "mp3"
  }
  ```
</CodeGroup>

2. BGM 模式（无干声）

<CodeGroup dropdown>
  ```python  theme={null}
  {
  "reference_instrumental": "zzzz",
  "output_format": "mp3"
  }
  ```
</CodeGroup>

3. 文生音色+合成

<CodeGroup dropdown>
  ```python  theme={null}
  {
    "voice_gender": "female",
    "voice_age": "young",
    "voice_description": "甜美、清亮",
    "instrumental_id": "yyyy",
    "lyrics": "这里是一段歌词文本"
  }
  ```
</CodeGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt