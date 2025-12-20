# 编辑视频

## 场景介绍

基于原有生成视频进行进一步调整和优化。

## 方案

首先，我们有一个原始视频

推荐使用 [CogVideoX](/cn/guide/models/video-generation/cogvideox-3) 生成视频

案例用的视频：

<video src="https://sfile.chatglm.cn/testpath/video/12e68db5-51d4-5570-a704-792f135ce74c_0.mp4" controls />

### 第一步、使用 GLM-4V-Plus

注意必须要用英文提问，后续多轮对话也是。

代码示例：

```
import base64
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="YOUR API KEY") # 填写您自己的 APIKey
response = client.chat.completions.create(
    model="glm-4v-plus",  # 填写需要调用的模型名称
    messages=[
      {
        "role": "user",
        "content": [
          {
            "type": "video_url",
            "video_url": {
                "url" : "https://sfile.chatglm.cn/testpath/video/12e68db5-51d4-5570-a704-792f135ce74c_0.mp4"
            }
          },
          {
            "type": "text",
            "text": "Please describe this video in detail."
          }
        ]
      }
    ]
)
print(response.choices[0].message)
```

模型输出：

```
CompletionMessage(content="A vibrant purple parrot with a red beak and ringed eyes is perched on a balcony railing, gazing out over a cityscape at dusk. The scene is serene, with the bird's feathers contrasting against the softly blurred urban backdrop. As time passes, the bird's profile is highlighted against the twilight sky, suggesting a moment of quiet contemplation. The city lights begin to twinkle, adding a warm glow to the cool dusk above. The parrot's demeanor is poised, embodying a serene yet lively spirit against the urban setting.", role='assistant', tool_calls=None)
```

### 第二步、鹦鹉的颜色太暗了

鹦鹉的颜色太暗了和 GLM-4V-Plus 说换个颜色吧。

代码示例：

```
import base64
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="YOUR API KEY") # 填写您自己的 APIKey
response = client.chat.completions.create(
    model="glm-4v-plus",  # 填写需要调用的模型名称
    messages=[
      {
        "role": "user",
        "content": [
          {
            "type": "video_url",
            "video_url": {
                "url" : "https://sfile.chatglm.cn/testpath/video/12e68db5-51d4-5570-a704-792f135ce74c_0.mp4"
            }
          },
          {
            "type": "text",
            "text": "Please describe this video in detail."
          }
        ]
      },
        {
            "content": [
                {
                    "text": "A vibrant purple parrot with a red beak and ringed eyes is perched on a balcony railing, gazing out over a cityscape at dusk. The scene is serene, with the bird's feathers contrasting against the softly blurred urban backdrop. As time passes, the bird's profile is highlighted against the twilight sky, suggesting a moment of quiet contemplation. The city lights begin to twinkle, adding a warm glow to the cool dusk above. The parrot's demeanor is poised, embodying a serene yet lively spirit against the urban setting.",
                    "type": "text"
                }
            ],
            "role": "assistant"
        },
        {
            "content": [
                {
                    "text": "Change the purple parrot to white parrot.",
                    "type": "text"
                }
            ],
            "role": "user"
        }
    ]
)
print(response.choices[0].message)
```

模型输出：

```
CompletionMessage(content="A white parrot with a striking red beak and ringed eyes is perched on a balcony railing, gazing out over a cityscape at dusk. The scene is serene, with the bird's feathers contrasting against the softly blurred urban backdrop. As time passes, the bird's profile is highlighted against the twilight sky, suggesting a moment of quiet contemplation. The city lights begin to twinkle, adding a warm glow to the cool dusk above. The parrot's demeanor is poised, embodying a serene yet lively spirit against the urban setting.", role='assistant', tool_calls=None)
```

### 第三步、Magic！修改视频

用 GLM-4V-Plus 模型输出作为 prompt 给 CogVideoX 生成视频

代码示例：

```
import time
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="YOUR API KEY")  # 填写您自己的 APIKey

def zhipu_cogvideo(prompt_in):
    T1 = time.time() # 基准时间
    response = client.videos.generations(
        model="cogvideox",
        prompt=prompt_in
    )
    print(response)
    task_id = response.id
    task_status = response.task_status
    get_cnt = 0
    while task_status == 'PROCESSING' and get_cnt <= 40: # 超时时间
        result_response = client.videos.retrieve_videos_result(
            id=task_id
        )
        T2 = time.time() # 运行时间
        run_time_s = (T2 - T1)
        print("生成视频中，已运行", round(run_time_s, 2), "秒：", result_response)
        task_status = result_response.task_status
        time.sleep(15)
        get_cnt += 1
    T3 = time.time() # 完成响应
    finish_time_s = (T3 - T1)
    print("视频：【", prompt_in, "】生成完毕\n耗时：", round(finish_time_s, 3))
    return result_response



if __name__ == '__main__':

    text = "A white parrot with a striking red beak and ringed eyes is perched on a balcony railing, gazing out over a cityscape at dusk. The scene is serene, with the bird's feathers contrasting against the softly blurred urban backdrop. As time passes, the bird's profile is highlighted against the twilight sky, suggesting a moment of quiet contemplation. The city lights begin to twinkle, adding a warm glow to the cool dusk above. The parrot's demeanor is poised, embodying a serene yet lively spirit against the urban setting."
    print("#####\n", zhipu_cogvideo(text).video_result[0].url)
```

<video src="https://sfile.chatglm.cn/testpath/video/7046a519-d3b5-55c0-8ed7-72c577915ac8_0.mp4" controls />

### 第四步、还不够？背景不好看

更换颜色太简单，让 GLM-4V-Plus 把背景换成森林

代码示例：

```
import base64
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="YOUR API KEY") # 填写您自己的 APIKey
response = client.chat.completions.create(
    model="glm-4v-plus",  # 填写需要调用的模型名称
    messages=[
      {
        "role": "user",
        "content": [
          {
            "type": "video_url",
            "video_url": {
                "url" : "https://sfile.chatglm.cn/testpath/video/12e68db5-51d4-5570-a704-792f135ce74c_0.mp4"
            }
          },
          {
            "type": "text",
            "text": "Please describe this video in detail."
          }
        ]
      },
        {
            "content": [
                {
                    "text": "A vibrant purple parrot with a red beak and ringed eyes is perched on a balcony railing, gazing out over a cityscape at dusk. The scene is serene, with the bird's feathers contrasting against the softly blurred urban backdrop. As time passes, the bird's profile is highlighted against the twilight sky, suggesting a moment of quiet contemplation. The city lights begin to twinkle, adding a warm glow to the cool dusk above. The parrot's demeanor is poised, embodying a serene yet lively spirit against the urban setting.",
                    "type": "text"
                }
            ],
            "role": "assistant"
        },
        {
            "content": [
                {
                    "text": "Change the purple parrot to white parrot.",
                    "type": "text"
                }
            ],
            "role": "user"
        },
        {
            "content": [
                {
                    "text": "A white parrot with a striking red beak and ringed eyes is perched on a balcony railing, gazing out over a cityscape at dusk. The scene is serene, with the bird's feathers contrasting against the softly blurred urban backdrop. As time passes, the bird's profile is highlighted against the twilight sky, suggesting a moment of quiet contemplation. The city lights begin to twinkle, adding a warm glow to the cool dusk above. The parrot's demeanor is poised, embodying a serene yet lively spirit against the urban setting.",
                    "type": "text"
                }
            ],
            "role": "assistant"
        },
        {
            "content": [
                {
                    "text": "Change background to a rainy forest.",
                    "type": "text"
                }
            ],
            "role": "user"
        }
    ]
)
print(response.choices[0].message)
```

模型输出：

```
CompletionMessage(content="A white parrot with a striking red beak and ringed eyes is perched on a branch in a rainy forest, gazing out over the lush greenery. The scene is serene, with the bird's feathers contrasting against the softly blurred backdrop of the rainy forest. As time passes, the bird's profile is highlighted against the misty sky, suggesting a moment of quiet contemplation. The raindrops begin to fall, adding a soothing sound to the peaceful atmosphere. The parrot's demeanor is poised, embodying a serene yet lively spirit against the natural setting.", role='assistant', tool_calls=None)
```

### 第五步、言出法随！

再次用 CogVideoX 生成视频，代码示同上。

生成视频：

<video src="https://sfile.chatglm.cn/testpath/video/8d365892-970c-543a-8f72-934e02632588_0.mp4" controls />

恭喜你，你得到一个 Prompt 修改视频的模型。当然，还有一些使用限制：

* 比如只能用英文来进行修改，是由于用中文指令会被 GLM-4V-Plus 模型拒绝。
* 又比如，该方法修改具体的、准确的视频元素效果较好，而修改模糊或者抽象的元素，视频一致性就不理想。

## 方案亮点

* 高效处理，大幅缩短制作周期
* 降低创作门槛，实现 “零经验” 制作
* 精准优化，提升内容质量
* 个性化与场景适配
* 支持复杂场景与创意拓展


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt