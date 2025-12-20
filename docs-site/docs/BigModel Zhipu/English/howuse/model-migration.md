[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fhowuse%2Fmodel-migration)

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

# OpenAI Model Migration (Relocation Plan)

This guide explains how to quickly migrate from OpenAI models to ZhipuAI, using examples to help you complete the migration process. Additionally, ZhipuAI offers a “Special Relocation Plan” for OpenAI API users, making it easy to switch to domestic large models. [Get the benefits now](https://open.bigmodel.cn/online-book/migration?utm_source=UsageGuide&utm_medium=UsageGuide&utm_campaign=UsageGuide&channel_track_key=MFNt7mtj&&aa=)

|  | Relocation Plan |
| --- | --- |
| Special Benefits | 150 million Tokens (50 million GLM-4 and 100 million GLM-4-Air); Series migration training from OpenAI to GLM; |
| High Usage Benefits | OpenAI-equivalent Token giveaway plan (no upper limit); OpenAI-equivalent concurrency scale; Matching high-level membership policies, up to 60% off; Exclusive relocation consultants and 5-person/day technical expert support; Assistance with filing and training. |

## Basic Toolkit

The OpenAI SDK provides a ready-to-use tool for calling, and we have backend-compatible with all OpenAI endpoints, offering a convenient migration method. You only need to replace the `api_key` and `base_url` to use our models.

### Switch API Endpoint

```
from openai import OpenAI 
 
client = OpenAI(
    api_key="your zhipuai api key",
    base_url="https://open.bigmodel.cn/api/paas/v4/"
) 
 
response = client.chat.completions.create(
    model="glm-4",  
    messages=[    
        {"role": "system", "content": "You are a smart and creative novel writer"},    
        {"role": "user", "content": "Please write a short fairy tale as the king of fairy tales."} 
    ],
    top_p=0.7,
    temperature=0.9
 ) 
 
 print(response.choices[0].message)
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

### Use ZhipuAI Official SDK

Some features of ZhipuAI require you to call through the official SDK, which you can install via pypi.

```
pip install zhipuai
```

1

#### Example Calls

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # Fill in your own APIKey
response = client.chat.completions.create(
    model="glm-4",  # Fill in the model name you need to call
    messages=[
        {"role": "user", "content": "As a marketing expert, please create an attractive slogan for the ZhipuAI open platform"},
        {"role": "assistant", "content": "Of course, to create an attractive slogan, please tell me some information about your product"},
        {"role": "user", "content": "ZhipuAI Open Platform"},
        {"role": "assistant", "content": "Intelligence for the future, infinite drawing - ZhipuAI, making innovation within reach!"},
        {"role": "user", "content": "Create a more precise and attractive slogan"}
    ],
)
print(response.choices[0].message)
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

## Open Source Frameworks

In terms of agent and related task framework migration, we support the quick migration of the langchain framework. We provide the langchain-zhipuai extension tool, offering support adaptation for BaseChatModel and Embeddings. LangChain users can quickly complete the migration using the following examples:

### Install langchain-zhipuai

Download link: https://github.com/MetaGLM/langchain-zhipuai/releases

Before using, please set the environment variable ZHIPUAI\_API\_KEY to your ZhipuAI API Key.

### Migrate to ChatZhipuAI

```
from langchain_zhipuai.agents.zhipuai_all_tools.base import _get_assistants_tool
from langchain_zhipuai.chat_models import ChatZhipuAI
from langchain.agents import tool
from langchain.tools.shell import ShellTool
from pydantic.v1 import BaseModel, Extra, Field
from langchain import hub
from langchain_zhipuai.agents.all_tools_bind.base import create_zhipuai_tools_agent
from langchain_zhipuai.agent_toolkits import BaseToolOutput
from langchain_zhipuai.agents.all_tools_agent import ZhipuAiAllToolsAgentExecutor
 
 
@tool
def shell(query: str = Field(description="The command to execute")):
    """Use Shell to execute system shell commands"""
    tool = ShellTool()
    return BaseToolOutput(tool.run(tool_input=query))
 
llm = ChatZhipuAI(api_key="") # You can specify the apikey here
 
tools = [
    _get_assistants_tool(shell),
    {"type": "code_interpreter", "code_interpreter": {"sandbox": "none"}},
    {"type": "web_browser"},
    {"type": "drawing_tool"},
]
llm_with_all_tools = llm.bind(
    tools=tools
)
 
prompt = hub.pull("zhipuai-all-tools-chat/zhipuai-all-tools-agent")
agent = create_zhipuai_tools_agent(
    prompt=prompt, llm_with_all_tools=llm_with_all_tools
)
 
agent_executor = ZhipuAiAllToolsAgentExecutor(
    agent=agent,
    tools=[shell] ,
    verbose=True,
    return_intermediate_steps=True,
)
 
agent_executor.invoke(
    {
        "input": "Hello",
        "chat_history": [],
    }
)
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
21  
22  
23  
24  
25  
26  
27  
28  
29  
30  
31  
32  
33  
34  
35  
36  
37  
38  
39  
40  
41  
42  
43  
44  
45  
46  
47

### Compatible with Vector Databases

We provide a compatible Embedding calling method with OpenAI. When using Embeddings related to vector libraries, you only need to replace the Embedding instance with ZhipuAIEmbeddings.

```
from langchain_zhipuai.embeddings.base import ZhipuAIEmbeddings
 
"""Test zhipuai embeddings."""
documents = ["foo bar"]
embedding = ZhipuAIEmbeddings()
output = embedding.embed_documents(documents)
# len(output) == 1
# len(output[0]) == 1024
```

1  
2  
3  
4  
5  
6  
7  
8

Table of contents

Basic Toolkit

Switch API Endpoint

Use ZhipuAI Official SDK

Open Source Frameworks

Install langchain-zhipuai

Migrate to ChatZhipuAI

Compatible with Vector Databases