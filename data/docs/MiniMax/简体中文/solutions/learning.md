# 拍照识图互动学习

> 在面向儿童的早教与启蒙学习场景中，利用 MiniMax 文本-图像理解能力 与 MiniMax-Speech-02 语音合成技术，让孩子们“拍一拍，就能学”。

在面向儿童的早教与启蒙学习场景中，利用 **MiniMax 文本-图像理解能力** 与 ​**MiniMax-Speech-02 语音合成技术**​，让孩子们“拍一拍，就能学”。

## 解决方案

**1. 拍照识图**

* 相机拍摄任意物体，调用 文本大模型的图像理解能力，快速识别物体类别、特征与背景知识。

**2. 知识讲解与外语学习**

* 模型将识别结果转化为适合儿童理解的简短知识卡片。
* 同时调用 **MiniMax-Speech-02** 超拟人 TTS，用温暖亲切的声音进行讲解。

**3. 双语/多语交互**

* 支持英语、日语等多语言输出，帮助孩子边玩边学，提升外语听力与口语兴趣。

**4. 趣味问答**

* AI 语音助手可根据识别的物品发起互动问答，例如“你知道长颈鹿的脖子为什么那么长吗？”

## 业务价值

<Columns cols={2}>
  <Card title="沉浸式学习" icon="award">
    视觉识别 + 语音互动，让学习体验更直观、更有趣
  </Card>

  <Card title="多语言启蒙" icon="award">
    自然融入双语学习场景，帮助孩子早期掌握外语词汇与发音
  </Card>

  <Card title="自适应内容" icon="award">
    根据不同年龄段，自动调整讲解的难度与语言长度
  </Card>

  <Card title="延展性强" icon="award">
    除日常物品外，还可识别动植物、交通工具、科学器材等多类事物
  </Card>
</Columns>

## 核心 API 能力

1. 文本合成接口: 输入图片，进行识别
2. 语音合成接口: 将识别讲解结果，转化成语音

## 使用示例

**1. 图像理解与语音合成**

<CodeGroup dropdown>
  ```python  theme={null}
  import base64
  import requests
  import json

  group_id = "请填写您的group_id"
  api_key = "请填写您的_api_key"

  # 1. 上传图片并识别
  def recognize_image(image_path):
      with open(image_path, "rb") as img_file:
          img_base64 = base64.b64encode(img_file.read()).decode("utf-8")

      url = f"https://api.minimaxi.com/v1/chat/completions"
      headers = {
          "Authorization": f"Bearer {api_key}",
          "Content-Type": "application/json"
      }
      payload = {
          "model": "MiniMax-Text-01",
          "messages": [
              {
                  "role": "system",
                  "content": (
                      "你是一个专门为小朋友讲解的智能老师。\n"
                      "你的任务是：识别图片中的物体，并用简单有趣的方式做解释。\n"
                      "回答必须同时包含中文和英文。\n"
                      "中文要温柔、亲切；英文要简短、易懂。\n"
                      "比如：'这是一个苹果，它是一种甜甜的水果。'\n"
                      "英文：'This is an apple. It is a sweet fruit.'"
                  )
              },
              {
                  "role": "user",
                  "content": f"请识别并讲解这个图片: [图片base64:{img_base64}]"
              }
          ]
      }

      response = requests.post(url, headers=headers, data=json.dumps(payload))
      result = response.json()
      text_output = result["choices"][0]["message"]["content"]
      return text_output
  ```
</CodeGroup>

**2. 将识别讲解结果转成语音**

<CodeGroup dropdown>
  ```python  theme={null}

  def text_to_speech(text, output_file="output.mp3"):
    url = f"https://api.minimaxi.com/v1/t2a_v2?GroupId={group_id}"
    payload = json.dumps({
        "model": "speech-2.5-hd-preview",
        "text": text,
        "stream": False,
        "voice_setting": {
            "voice_id": "male-qn-qingse",
            "speed": 1,
            "vol": 1,
            "pitch": 0,
            "emotion": "happy"
        },
        "audio_setting": {
            "sample_rate": 32000,
            "bitrate": 128000,
            "format": "mp3",
            "channel": 1
        }
    })
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    response = requests.post(url, headers=headers, data=payload)
    parsed_json = response.json()
    audio_value = bytes.fromhex(parsed_json["data"]["audio"])
    with open(output_file, "wb") as f:
        f.write(audio_value)
    print(f"语音已保存为 {output_file}")

  # ==== Demo运行 ====
  if __name__ == "__main__":
    explain_text = recognize_image("test.jpg")  # 输入图片
    print("识别讲解结果：\n", explain_text)

    text_to_speech(explain_text, "output.mp3")

  ```
</CodeGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt