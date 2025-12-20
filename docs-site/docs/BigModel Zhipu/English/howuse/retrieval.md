[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fhowuse%2Fretrieval)

GLM Model Fully Upgraded

Invite friends & Get rewards

Get up to 200M Tokens

![大模型](https://cdn.bigmodel.cn/static/platform/images/logo/white_logo.png)

Try Zhipu’s New Flagship

GLM-4.6!

### Sign Up to Unlock AI capabilities

* Expert at coding, agents, reasoning, and more
* Get 20 millionfree Tokens on registration

Scan code

![智谱AI](https://cdn.bigmodel.cn/static/platform/images/activity/university/pop_right_bottom_new.png)

绑定手机号

确 定

[Welcome](/dev/welcome)  [Guide](/dev/howuse)  [API Documentation](/dev/api)  [Guidelines](/dev/guidelines)  [ReleaseNotes](/dev/releasenotes)  [FAQs](/dev/faq)  [Model Benefit](/dev/activities) 

`⌘``K`

GET STARTED

[* Overview](/dev/howuse/introduction)

[* Models](/dev/howuse/model)

[* Scenario Examples](/dev/howuse/openpower)

LEARN ABOUT MODELS

* Language Model

  [+ GLM-4-Plus](/dev/howuse/llm/glm-4-plus)

  [+ GLM-4-Air-250414](/dev/howuse/llm/GLM-4-Air-250414)

  [+ GLM-4-AirX](/dev/howuse/llm/GLM-4-AirX)

  [+ GLM-4-Long](/dev/howuse/llm/GLM-4-Long)

  [+ GLM-4-FlashX-250414](/dev/howuse/llm/GLM-4-FlashX-250414)

* Reasoning Model

  [+ GLM-Z1-Air](/dev/howuse/reasoning_models/GLM-Z1-Air)

  [+ GLM-Z1-AirX](/dev/howuse/reasoning_models/GLM-Z1-AirX)

  [+ GLM-Z1-FlashX](/dev/howuse/reasoning_models/GLM-Z1-FlashX)

* Visual Language Model

  [+ GLM-4V-Plus-0111](/dev/howuse/vlm/GLM-4V-Plus-0111)

* GLM-4.1V-Thinking

  [+ GLM-4.1V-Thinking](/dev/howuse/visual-reasoning-model/glm-4.1v-thinking)

* Image Generation Model

  [+ CogView-4](/dev/howuse/image-generation-model/cogview-4)

* Video Generation Model

  [+ CogVideoX-3](/dev/howuse/video-generation-model/CogVideoX-3)

  [+ CogVideoX-2](/dev/howuse/video-generation-model/CogVideoX-2)

  [+ Vidu Q1](/dev/howuse/video-generation-model/ViduQ1)

  [+ Vidu 2](/dev/howuse/video-generation-model/Vidu2)

* Audio and Video Model

  [+ GLM-Realtime](/dev/howuse/audio-and-video-model/GLM-Realtime)

  [+ GLM-4-Voice](/dev/howuse/audio-and-video-model/GLM-4-Voice)

  [+ GLM-ASR](/dev/howuse/audio-and-video-model/GLM-ASR)

CAPABILITIES

[* Web Search](/dev/howuse/websearch)

[* Function Call](/dev/howuse/functioncall)

[* Retrieval](/dev/howuse/retrieval)

[* Fine-tuning](/dev/howuse/finetuning)

[* FileQA](/dev/howuse/fileqa)

[* evaluator](/dev/howuse/model_evaluator)

[* Batch](/dev/howuse/batchapi)

[* Sandbox](/dev/howuse/glm4-toolkit)

[* JSON Format](/dev/howuse/jsonformat)

Agent Development Platform

[* help\_document](/dev/howuse/help_document)

GUIDES

[* Prompt Engineering](/dev/howuse/prompt)

[* Content security](/dev/howuse/securityaudit)

[* Model Migrate](/dev/howuse/model-migration)

[* User Benefits](/dev/howuse/equity-explain)

[* Model Filing](/dev/howuse/Filing)

POLICIES

[* User Agreement](/dev/howuse/useragreement)

[* Privacy Policy](/dev/howuse/privacypolicy)

[* Platform Agreement](/dev/howuse/serviceagreement)

[* Recharge Agreement](/dev/howuse/rechargeagreement)

[* Termination Agreement](/dev/howuse/termination-agreement)

[* Account Change](/dev/howuse/subjectchanage)

[* University X Plan - Application Instructions](/dev/howuse/application-agreement)

[* AI Principle](/dev/howuse/principle)

[* Security & Risk](/dev/howuse/safetytips)

[FAQ](//docs.bigmodel.cn/cn/faq) 

Customer Service

[Work Order](/ticket-submit) 

Consultation

[400-6883-991](tel:4006883991)

Weekdays 9:30-18:00

Help Center 

![ZHIPU·AI](https://cdn.bigmodel.cn/static/platform/images/qr-code/technical_community.png)

##### Scan via Wechat

User Group

# Enhanced Retrieval

By retrieving relevant knowledge from a knowledge base before generating answers with a large language model, and then inputting the relevant knowledge as background information to the large model, the accuracy and relevance of the content can be effectively improved.

## Usage

### Building a Knowledge Base

This is used to manage files, supporting the upload of multiple files and calling them after associating with a knowledge base ID. The maximum capacity of the knowledge base is 1G. For calling methods, please refer to the [API documentation](https://bigmodel.cn/dev/api/Agent_Platform/knowledge) .

#### Example of Calling

```
from zhipuai import ZhipuAI
 
client = ZhipuAI(api_key="") # Please fill in your own APIKey
 
result = client.knowledge.create(
    embedding_id=3,
    name="knowledge name",
    description="knowledge description"
)
print(result.id)
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10

### Uploading Files

Supports uploading doc, docx, pdf, and xlsx type files to the knowledge base, with support for customizing the size and rules of file slicing. The file size must not exceed 50MB.

#### Example of Calling

```
from zhipuai import ZhipuAI
 
client = ZhipuAI(api_key="") # Please fill in your own APIKey
 
resp = client.knowledge.document.create(
    file=open("xxx.xlsx", "rb"),
    purpose="retrieval",
    knowledge_id="1798330146986561536",
    sentence_size=202,
    custom_separator=["\n"]
)
print(resp)
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12

### Calling the Knowledge Base via Tools

After creating a knowledge base, you will obtain a knowledge base ID. When calling the model service, input the knowledge base ID to enable the large model to access relevant content to respond to user queries.

#### Example of Calling

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # Please fill in your own APIKey
response = client.chat.completions.create(
    model="glm-4",  # Fill in the name of the model you need to call
    messages=[
        {"role": "user", "content": "你好！你叫什么名字"},
    ],
    tools=[
            {
                "type": "retrieval",
                "retrieval": {
                    "knowledge_id": "your knowledge id",
                    "prompt_template": "Find the answer to the question\n\"\"\"\n{{question}}\n\"\"\"\nfrom the document\n\"\"\"\n{{knowledge}}\n\"\"\"\nIf the answer is found, use only the document sentences to answer the question. If the answer is not found, use your own knowledge to answer and inform the user that the information is not from the document.\nDo not repeat the question, just start answering."
                }
            }
            ],
    stream=True,
)
for chunk in response:
    print(chunk.choices[0].delta)
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20

Table of contents

Usage

Building a Knowledge Base

Uploading Files

Calling the Knowledge Base via Tools