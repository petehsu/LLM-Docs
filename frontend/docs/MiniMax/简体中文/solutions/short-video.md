# 数字人·短视频·短剧

> 利用MiniMax Text & Speech API 让创作更高效、更生动。

小冰、闪剪智能、出门问问、蝉镜数字人、快手、逗哥配音等创作者与企业，正在利用 **MiniMax-Text-01** 与 ​**MiniMax-Speech-02**​，为数字人、短视频、短剧提供全流程 AI 创作能力。

## 解决方案

### 文案创作与翻译

1. 使用 **MiniMax-Text-01** 自动生成短视频台词、剧情对白、短剧脚本。
2. 支持中英等多语种互译，轻松做国际化发行。

### 声音复刻与配音

1. 用 **MiniMax-Speech-02** 克隆演员、主播或品牌数字人的专属声音。
2. 实现超拟人 TTS 语音合成，情感、语调、节奏自然流畅。

### 多角色语音塑造 ​

1. 短剧中不同角色可分别绑定不同声音模型，实现多人对话自然切换。

## 业务价值

<Columns cols={2}>
  <Card title="显著降低成本" icon="award">
    减少真人录音与配音次数，节约时间与预算
  </Card>

  <Card title="统一风格" icon="award">
    保持数字人、短视频系列的声音与语气一致性
  </Card>

  <Card title="快速上线" icon="award">
    台词生成 + 即时语音合成，创作周期从数天缩短到数小时
  </Card>

  <Card title="国际化触达" icon="award">
    支持多语言语音生成，助力出海
  </Card>
</Columns>

## 核心 API 能力

1. **声音复刻：用于角色声音复刻**

[语音复刻接口 ：https://api.minimaxi.com/v1/voice\_clone](/api-reference/voice-cloning-intro)

2. **文本生成：生成台词和脚本**

[文本生成接口 ：https://api.minimaxi.com/v1/chat/completions](/api-reference/text-intro)

3. **语音合成：获取合成音频**

[语音合成接口 ：https://api.minimaxi.com/v1/t2a\_v2](/api-reference/speech-t2a-intro)

## 使用示例

1. **角色音色复刻**

<CodeGroup dropdown>
  ```python  theme={null}
  import json

  import requests

  group_id = "your group id"
  api_key = "your api key"

  #复刻音频上传
  url = f'https://api.minimaxi.com/v1/files/upload?GroupId={group_id}'
  headers1 = {
      'authority': 'api.minimaxi.com',
      'Authorization': f'Bearer {api_key}'
  }

  data = {
      'purpose': 'voice_clone'
  }

  files = {
      'file': open('output.mp3', 'rb')
  }
  response = requests.post(url, headers=headers1, data=data, files=files)
  file_id = response.json().get("file").get("file_id")
  print(file_id)

  #示例音频上传
  url = f'https://api.minimaxi.com/v1/files/upload?GroupId={group_id}'
  headers1 = {
      'authority': 'api.minimaxi.com',
      'Authorization': f'Bearer {api_key}'
  }

  data = {
      'purpose': 'prompt_audio'
  }

  files = {
      'file': open('prompt.mp3', 'rb')
  }
  response = requests.post(url, headers=headers1, data=data, files=files)
  prompt_file_id = response.json().get("file").get("file_id")
  print(prompt_file_id)


  #音频复刻
  url = f'https://api.minimaxi.com/v1/voice_clone?GroupId={group_id}'
  payload2 = json.dumps({
    "file_id": file_id,
    "voice_id": "test1234"
  })
  headers2 = {
    'Authorization': f'Bearer {api_key}',
    'content-type': 'application/json'
  }
  response = requests.request("POST", url, headers=headers2, data=payload2)
  print(response.text)
  ```
</CodeGroup>

2. **生成台词与脚本**

<CodeGroup dropdown>
  ```python  theme={null}
  import requests

  api_key = "请填写您的api_key"

  url = "https://api.minimaxi.com/v1/chat/completions"
  headers = {
      "Authorization": f"Bearer {api_key}",
      "Content-Type": "application/json"
  }

  # 输入中文文本
  chinese_text = input("请输入中文短剧文案：")

  payload = {
      "model": "MiniMax-M1",
      "messages": [
          {
              "role": "system",
              "name": "Translator",
              "content": "你是一个擅长翻译的编剧。请将用户输入的中文翻译为英文，保持口语化、贴近短剧对白氛围，不能直译，要自然顺畅。"
          },
          {
              "role": "user",
              "name": "用户",
              "content": chinese_text
          }
      ]
  }

  response = requests.post(url, headers=headers, json=payload)

  print("状态码:", response.status_code)
  print("返回结果:")
  print(response.text)
  ```
</CodeGroup>

3. **获取合成音频**

<CodeGroup dropdown>
  ```python  theme={null}
  import requests
  import json

  group_id = "请填写您的group_id"
  api_key = "请填写您的api_key"

  url = f"https://api.minimaxi.com/v1/t2a_v2?GroupId={group_id}"

  payload = json.dumps({
    "model":"speech-2.6-hd",
    "text":"真正的危险不是计算机开始像人一样思考，而是人开始像计算机一样思考。计算机只是可以帮我们处理一些简单事务。",
    "stream":False,
    "voice_setting":{
      "voice_id":"male-qn-qingse",
      "speed":1,
      "vol":1,
      "pitch":0,
      "emotion":"happy"
    },
    "pronunciation_dict":{
      "tone":[
          "处理/(chu3)(li3)", "危险/dangerous"
      ]
    },
    "audio_setting":{
      "sample_rate":32000,
      "bitrate":128000,
      "format":"mp3",
      "channel":1
    }
  })
  headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
  }

  response = requests.request("POST", url, stream=True, headers=headers, data=payload)
  parsed_json = json.loads(response.text)

  # 获取audio字段的值
  audio_value = bytes.fromhex(parsed_json['data']['audio'])
  with open('output.mp3', 'wb') as f:
      f.write(audio_value)
  ```
</CodeGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt