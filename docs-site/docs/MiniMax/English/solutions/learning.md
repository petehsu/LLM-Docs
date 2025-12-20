# Photo Recognition Interactive Learning

> In early education, MiniMax’s text-to-image and Speech-02 synthesis enable kids to “snap a picture and learn.”

In early childhood education and enlightenment learning scenarios, utilizing **MiniMax's text-to-image understanding capabilities** and **MiniMax-Speech-02 speech synthesis technology**, children can "snap a picture, and learn."

## Solution

**Photo Recognition**

* Take a photo of any object with the camera, call upon the text large model's image understanding capability to quickly identify the object's category, features, and background knowledge.

**Knowledge Explanation and Foreign Language Learning**

* The model converts the recognition result into a short knowledge card suitable for children's understanding.
* Simultaneously, it calls **MiniMax-Speech-02** hyper-realistic TTS to provide explanations with a warm and friendly voice.

**Bilingual/Multilingual Interaction**

* Supports English, Japanese, and other multilingual outputs, helping children learn while playing and enhancing their interest in foreign language listening and speaking.

**Fun Q\&A**

* The AI voice assistant can initiate interactive questions based on the recognized item, such as "Do you know why giraffes have such long necks?"

## Business Value

<Columns cols={2}>
  <Card title="Immersive Learning" icon="award">
    Visual recognition + voice interaction makes the learning experience more intuitive and fun.
  </Card>

  <Card title="Multilingual Enlightenment" icon="award">
    Naturally integrates bilingual learning scenarios, helping children master foreign language vocabulary and pronunciation early on.
  </Card>

  <Card title="Adaptive Content" icon="award">
    Automatically adjusts the difficulty and length of explanations according to different age groups.
  </Card>

  <Card title="Strong Scalability" icon="award">
    In addition to everyday objects, it can also recognize animals and plants, vehicles, scientific instruments, and many other types of things.
  </Card>
</Columns>

## Core API Capabilities

1. Text Synthesis Interface: Input an image for recognition.

   [POST https://api.minimax.io/v1/chat/completions](/api-reference/text-post)

2. Speech Synthesis Interface: Convert the recognized explanation into speech.

   [POST https://api.minimax.io/v1/t2a\_v2](/api-reference/speech-t2a-http)

## Usage Example

Image Understanding and Speech Synthesis

<CodeGroup dropdown>
  ```python  theme={null}
  import base64
  import requests
  import json

  group_id = "Please fill in your group_id"
  api_key = "Please fill in your_api_key"

  # 1. Upload image and recognize
  def recognize_image(image_path):
      with open(image_path, "rb") as img_file:
          img_base64 = base64.b64encode(img_file.read()).decode("utf-8")

      url = f"https://api.minimax.io/v1/chat/completions"
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
                      "You are an intelligent teacher specializing in explaining things to children.\n"
                      "Your task is to identify objects in pictures and explain them in a simple and fun way.\n"
                      "The answer must include both Chinese and English.\n"
                      "Chinese should be gentle and kind; English should be concise and easy to understand.\n"
                      "For example: '这是一个苹果，它是一种甜甜的水果。'\n"
                      "English: 'This is an apple. It is a sweet fruit.'"
                  )
              },
              {
                  "role": "user",
                  "content": f"Please identify and explain this image: [Image base64:{img_base64}]"
              }
          ]
      }

      response = requests.post(url, headers=headers, data=json.dumps(payload))
      result = response.json()
      text_output = result["choices"][0]["message"]["content"]
      return text_output

  # 2. Convert recognized explanation to speech
  def text_to_speech(text, output_file="output.mp3"):
      url = f"https://minimax.io/v1/t2a_v2"
      payload = json.dumps({
          "model": "speech-2.5-hd-preview",
          "text": text,
          "stream": False,
          "voice_setting": {
              "voice_id": "English_expressive_narrator",
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
      print(f"Speech saved as {output_file}")

  # ==== Demo Run ====
  if __name__ == "__main__":
      explain_text = recognize_image("test.jpg")  # Input image
      print("Recognition and explanation result:\n", explain_text)

      text_to_speech(explain_text, "output.mp3")
  ```
</CodeGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimax.io/docs/llms.txt