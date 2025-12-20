# 智能外呼自动化 

> 利用 MiniMax Text & Speech API 构建新一代客户触达体验。

本案例展示了领先企业如何利用 MiniMax **Text-01** 与 **Speech-2.6** API 实现外呼业务的自动化——将基于意图的脚本，快速转化为超拟真、富有情感的语音对话。

通过结合**智能客服文本生成**与 ​**超拟人语音合成**​，销售与客服团队可以在不牺牲质量的前提下，大幅提升触达效率、统一品牌话术，并实现大规模客户沟通。

## 行业痛点

<Columns cols={2}>
  <Card title="人力成本高" icon="trending-up-down">
    人工外呼需要庞大的团队，招聘与培训成本居高不下
  </Card>

  <Card title="服务质量不一致" icon="git-pull-request-closed">
    坐席人员在语气、用词和客户应对上存在差异，导致品牌体验不统一
  </Card>

  <Card title="扩展性差" icon="droplet-off">
    人工坐席在高峰期难以保持稳定表现
  </Card>

  <Card title="个性化不足" icon="wand-sparkles">
    固定脚本难以根据客户的实时反应灵活调整
  </Card>
</Columns>

## 核心目标

<Columns cols={3}>
  <Card title="保证话术一致性" icon="waves">
    确保所有外呼保持统一的语气与品牌形象
  </Card>

  <Card title="实现动态脚本生成" icon="git-compare">
    根据客户细分与活动目标，自动生成自然、符合场景的对话内容
  </Card>

  <Card title="提升运营效率" icon="bot">
    用自动化、高质量的 AI 外呼替代重复的人力工作，支持千万级别的通话规模
  </Card>
</Columns>

## 解决方案

**Text-01 智能脚本生成**

1. 针对不同行业、不同客户意图生成定制化外呼脚本。
2. 包含个性化问候、需求探查、异议处理、成交话术等环节。

**Speech2.6 声音坐席打造**​

1. 上传目标声音样本，克隆品牌专属的坐席声音。
2. 实现超拟人的 TTS 合成，具备自然的语调、情感表达与节奏控制。

**Real-time 实时联动播放**

1. 将 Text-01 输出直接对接 Speech-2.6，实现实时播放对话。
2. 根据通话内容动态调整语速、语气与重点。

## 业务价值

<Columns cols={2}>
  <Card title="显著降低成本" icon="award">
    外呼中心人力成本降低高达 80%
  </Card>

  <Card title="统一品牌声音" icon="award">
    每一次外呼都能传递同样的专业、亲和形象
  </Card>

  <Card title="大规模个性化" icon="award">
    为数百万潜在客户提供定制化沟通体验
  </Card>

  <Card title="快速上线活动" icon="award">
    从策划到外呼启动仅需数小时，而非数周
  </Card>
</Columns>

## 核心 API 能力

1. **MiniMax-Text-01 智能脚本生成：**
   * **功能：** 针对不同行业（如保险续保、招聘邀约）、不同客户意图，自动生成包含个性化问候、需求探查、异议处理、成交话术等环节的完整脚本。
2. **Speech-2.6 品牌专属声音坐席打造：**
   * **功能：** 支持上传指定声音样本（如优秀员工作为“声音模特”），克隆出品牌专属的、独一无二的 AI 坐席声音。通过超拟人的 TTS 合成技术，实现自然的语调、情感表达与节奏控制，告别生硬的“机器音”。
3. **Real-time 实时联动与动态响应：**
   * **功能：** 将 Text-01 生成的文本流式对接到 Speech-2.6，实现“边生成边播放”的低延迟对话体验。系统能根据通话中的实时内容，动态调整语速、语气和重点，实现与真人的高度相似的交互。
   * **API**​**集成示例（Text-to-Speech 流式接口）：** 代码逻辑展示了如何调用 `chatcompletion_v2` 接口，在请求中开启 `speech_output` 选项，并设置 `voice_id`。API 会以数据流（SSE）的形式同时返回文本（`content`）和音频数据（`audio_content`），前端可以实时接收并播放音频流，实现流畅对话。

## 使用示例

<CodeGroup dropdown>
  ```python  theme={null}
  import requests
  import json
  import subprocess
  from typing import Iterator
  from datetime import datetime
  import logging

  # 日志配置
  logging.basicConfig(level=logging.INFO, format='[%(asctime)s] - [%(levelname)s]  %(message)s')

  # 用于流式播放音频，需下载mpv播放器（适用 Linux/mac 系统）
  mpv_command = ["mpv", "--no-cache", "--no-terminal", "--", "fd://0"]
  mpv_process = subprocess.Popen(
      mpv_command,
      stdin=subprocess.PIPE,
      stdout=subprocess.DEVNULL,
      stderr=subprocess.DEVNULL,
  )

  token = '输入你在minimax开发者平台获取的token，前往 https://platform.minimaxi.com/user-center/basic-information/interface-key 获取'

  def ccv2_audio_stream(text) -> Iterator[bytes] :
      payload = {
      "model": "MiniMax-Text-01",
      "messages": [
          {
          "role": "system",
          "name": "MM智能助理",
          "content": "MM智能助理是一款智能小助手"
          },
          {
          "role": "user",
          "name": "用户",
          "content": text
          },
      ],
      "stream": True,
      "tools": [
          {"type":"web_search"}
      ],
      "tool_choice": "auto",
      "max_tokens": 1024,
      "stream_options": { # 开启语音输出
          "speech_output": True
      },
      "voice_setting":{
          "model":"speech-2.6-turbo",
          "voice_id":"female-tianmei"
      }
      }
      headers = {
      'Content-Type': 'application/json',
      'Authorization': f'Bearer {token}',
      }

      logging.info(f"【文本输入】{text}")

      response = requests.post("http://api.minimaxi.com/v1/chat/completions", headers=headers, json=payload, stream=True)

      logging.info(f"Get response, trace-id: {response.headers.get('Trace-Id')}")
      i = 0
      for line in response.iter_lines(decode_unicode=True):
          if not line.startswith("data:"):
              continue
          i+=1
          logging.debug(f"[sse] data chunck-{i}")
          resp = json.loads(line.strip("data:"))
          if resp.get("choices") and resp["choices"][0].get("delta"):
              delta = resp["choices"][0]["delta"]
              if delta.get("role") == "assistant": # AI 助手回复
                  if delta.get("content"):  logging.info(f"【文本输出】 {delta['content']}")
                  if delta.get("audio_content") and delta["audio_content"] != "": yield delta["audio_content"]
                  if delta.get("tool_calls") : logging.info(f"【搜索中】...")


  # 流式播放音频并保存到本地
  def audio_play(audio_stream: Iterator[bytes]) :
      audio = b""
      for chunk in audio_stream:
          if chunk is not None and chunk != '\n':
              decoded_hex = bytes.fromhex(chunk)
              mpv_process.stdin.write(decoded_hex)  # type: ignore
              mpv_process.stdin.flush()
              audio += decoded_hex

      if not audio:
          return

      now = datetime.now().strftime('%Y%m%d-%H%M%S')
      file_name = f'ccv2_audio_{now}.mp3'
      with open(file_name, 'wb') as file:
          file.write(audio)
      logging.info(f"音频文件保存成功: {file_name}")

  if __name__ == '__main__':
      audio_play(ccv2_audio_stream("请介绍自己"))
  ```
</CodeGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt