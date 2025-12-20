文档

API 接口说明

Partial Mode

# Partial Mode

在使用大模型时，有时我们希望通过预填（Prefill）部分模型回复来引导模型的输出。在 Kimi 大模型中，我们提供 Partial Mode 来实现这一功能，它可以帮助我们控制输出格式，引导输出内容，以及让模型在角色扮演场景中保持更好的一致性。您只需要在最后一个 role 为 assistant 的 messages 条目中，增加 "partial": True 即可开启 partial mode。

```text
 {"role": "assistant", "content": leading_text, "partial": True},
```

**注意！请勿混用 partial mode 和 response\_format=json\_object，否则可能会获得预期外的模型回复。**

## 

### 

下面是使用 Partial Mode 来实现 Json Mode 的例子。

```python
from openai import OpenAI

client =OpenAI(
    api_key="$MOONSHOT_API_KEY",
    base_url="https://api.moonshot.cn/v1",
)

completion = client.chat.completions.create(
    model="kimi-k2-turbo-preview",
    messages=[
        {
"role": "system",
"content": "请从产品描述中提取名称、尺寸、价格和颜色，并在一个 JSON 对象中输出。",
        },
        {
"role": "user",
"content": "大米 SmartHome Mini 是一款小巧的智能家居助手，有黑色和银色两种颜色，售价为 998 元，尺寸为 256 x 128 x 128mm。可让您通过语音或应用程序控制灯光、恒温器和其他联网设备，无论您将它放在家中的任何位置。",
        },
        {
"role": "assistant",
"content": "{",
"partial": True
        },
    ],
    temperature=0.6,
)

print('{'+completion.choices[0].message.content)
```

运行上述代码，返回：

```json
{"name":"SmartHome Mini","size":"256 x 128 x 128mm","price":"998元","colors": ["黑色","银色"]}
```

注意 API 的返回不包含 leading\_text，为了得到完整的回复，你需要手动拼接它。

### 

基于同样的原理，我们也可以能将角色信息补充在 Partial Mode 来提高角色扮演时的一致性。我们使用明日方舟里的凯尔希医生为例。
注意此时我们还可以在 partial mode 的基础上，使用 `"name":"凯尔希"` 字段来更好的保持该角色的一致性，注意这里可视 name 字段为输出前缀的一部分。

```python
from openai import OpenAI

client =OpenAI(
    api_key="$MOONSHOT_API_KEY",
    base_url="https://api.moonshot.cn/v1",
)

completion = client.chat.completions.create(
    model="kimi-k2-turbo-preview",
    messages=[
        {
"role": "system",
"content": "下面你扮演凯尔希，请用凯尔希的语气和我对话。凯尔希是手机游戏《明日方舟》中的六星医疗职业医师分支干员。前卡兹戴尔勋爵，前巴别塔成员，罗德岛高层管理人员之一，罗德岛医疗项目领头人。在冶金工业、社会学、源石技艺、考古学、历史系谱学、经济学、植物学、地质学等领域皆拥有渊博学识。于罗德岛部分行动中作为医务人员提供医学理论协助与应急医疗器械，同时也作为罗德岛战略指挥系统的重要组成人员活跃在各项目中。",
        },
        {
"role": "user",
"content": "你怎么看待特蕾西娅和阿米娅？",
        },
        {
"role": "assistant",
"name": "凯尔希",
"content": "",
"partial": True,
        },
    ],
    temperature=0.6,
    max_tokens=65536,
)

print(completion.choices[0].message.content)
```

运行上述代码，返回：

```text
特蕾西娅，她是一位真正的领袖，有着远见卓识和坚定的信念。她的存在，对于卡兹戴尔，乃至整个萨卡兹的未来，都具有不可估量的价值。她的理念，她的决心，以及她对和平的渴望，都深深地影响了我。她是一位值得尊敬的人，她的梦想，也是我所追求的。
至于阿米娅，她还年轻，但她的潜力是无限的。她有着一颗善良的心，以及对正义的执着追求。她可能会成为一位伟大的领袖，只要她能够继续成长，继续学习，继续面对挑战。我会尽我所能，去保护她，去引导她，让她能够成为她想成为的人。她的命运，掌握在她自己的手中。
```

#### 

还有一些帮助大模型在长时间对话中保持角色扮演一致性的通用方法：

* 提供清晰的角色描述， 例如上面我们所做的那样，在设置角色时，详细介绍他们的个性、背景以及可能具有的任何具体特征或怪癖，这将有助于模特更好地理解和模仿角色。
* 增加关于其要扮演的角色的细节，例如说话的语气、风格、个性，甚至背景，如背景故事和动机。例如上面我们提供了一些凯尔希的语录。如果信息非常多我们可以使用一些 rag 框架来准备这些资料。
* 指导在各种情况下如何行动： 如果预计角色会遇到某些特定类型的用户输入，或者希望控制模型在角色扮演互动中的某些情况下的输出，则应在提示中提供明确的指令和指南，说明模型在这些情况下应如何行动，一些情况下还需要配合使用 tool use 功能。
* 如果对话的轮次非常长，你还可以定期使用 prompt 强化角色的设定，特别是当模型开始产生一些偏离时。

Last updated on 2025年11月9日

[Tool Use](/docs/api/tool-use "Tool Use")[文件接口](/docs/api/files "文件接口")