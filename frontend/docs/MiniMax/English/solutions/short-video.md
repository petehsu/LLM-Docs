#  Digital Humans · Short Videos · Short Dramas

> Boost Creation Efficiency and Liveliness with MiniMax Text & Speech APIs

Creators and enterprises like Xiaoice, FlashCut AI, Mobvoi, Chan Mirror Digital Human, Kuaishou, and Doug's Dubbing are leveraging **MiniMax-Text-01** and **MiniMax-Speech-02** to provide full-process AI creation capabilities for digital humans, short videos, and short dramas.

## Solution

### Content Creation & Translation

1. Use **MiniMax-Text-01** to automatically generate short video scripts, drama dialogues, and short play scripts.
2. Supports multi-language translation (e.g., Chinese to English) for easy international distribution.

### Voice Cloning & Dubbing

1. Use **MiniMax-Speech-02** to clone the unique voices of actors, anchors, or brand digital humans.
2. Achieve hyper-realistic TTS voice synthesis with natural emotions, intonations, and rhythms.

### Multi-Character Voice Shaping

1. Different characters in short dramas can be assigned different voice models, enabling natural switching between multiple speakers.

## Business Value

<Columns cols={2}>
  <Card title="Significantly Reduce Costs" icon="award">
    Minimize live recording and dubbing sessions, saving time and budget.
  </Card>

  <Card title="Maintain Consistent Style" icon="award">
    Ensure consistent voice and tone across digital humans and short video series.
  </Card>

  <Card title="Rapid Deployment" icon="award">
    Script generation + instant voice synthesis shortens creation cycles from days to hours.
  </Card>

  <Card title="International Reach" icon="award">
    Supports multi-language voice generation, aiding global expansion.
  </Card>
</Columns>

## Core API Capabilities

1. Voice Cloning: For cloning character voices

   [POST https://api.minimax.io/v1/voice\_clone](/api-reference/voice-cloning-clone)

2. Text Generation: Generate scripts and dialogues

   [POST https://api.minimax.io/v1/text/chatcompletion\_v2](/api-reference/text-post)

3. Speech Synthesis: Obtain synthesized audio

   [POST https://api.minimax.io/v1/t2a\_v2](/api-reference/speech-t2a-http)

## Usage Examples

1. Character Voice Cloning

<CodeGroup dropdown>
  ```python  theme={null}
  import json

  import requests

  group_id = "your group id"
  api_key = "your api key"

  # Uploading audio for cloning
  url = f'https://api.minimax.io/v1/files/upload?GroupId={group_id}'
  headers1 = {
      'authority': 'api.minimax.io',
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

  # Uploading example audio
  url = f'https://api.minimax.io/v1/files/upload?GroupId={group_id}'
  headers1 = {
      'authority': 'api.minimax.io',
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

  # Voice cloning
  url = f'https://minimax.io/v1/voice_clone?GroupId={group_id}'
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

2. Generating Scripts and Dialogues

<CodeGroup dropdown>
  ```python  theme={null}
  import requests

  api_key = "Please fill in your api_key"

  url = "https://api.minimax.io/v1/chat/completions"
  headers = {
      "Authorization": f"Bearer {api_key}",
      "Content-Type": "application/json"
  }

  # Input Chinese text
  chinese_text = input("Please enter the Chinese short drama script: ")

  payload = {
      "model": "MiniMax-M1",
      "messages": [
          {
              "role": "system",
              "name": "Translator",
              "content": "You are a screenwriter skilled in translation. Please translate the user's Chinese input into English, keeping it colloquial, close to short drama dialogue, not a literal translation, and natural and smooth."
          },
          {
              "role": "user",
              "name": "User",
              "content": chinese_text
          }
      ]
  }

  response = requests.post(url, headers=headers, json=payload)

  print("Status Code:", response.status_code)
  print("Result:")
  print(response.text)
  ```
</CodeGroup>

3. Getting Synthesized Audio

<CodeGroup dropdown>
  ```python  theme={null}
  import requests
  import json

  group_id = "Please fill in your group_id"
  api_key = "Please fill in your api_key"

  url = f"https://api.minimax.io/v1/t2a_v2"

  payload = json.dumps({
    "model":"speech-2.6-hd",
    "text":"The real danger is not that computers will begin to think like humans, but that humans will begin to think like computers. Computers are simply tools that can help us handle simple tasks.",
    "stream":False,
    "voice_setting":{
      "voice_id":"English_expressive_narrator",
      "speed":1,
      "vol":1,
      "pitch":0,
      "emotion":"happy"
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

  # Get the value of the audio field
  audio_value = bytes.fromhex(parsed_json['data']['audio'])
  with open('output.mp3', 'wb') as f:
      f.write(audio_value)
  ```
</CodeGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimax.io/docs/llms.txt