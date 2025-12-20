[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2Fvector%2Fembedding)

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

API REFERENCE

* SDK Calling

  [+ Installation](/dev/api/devguide/sdk-install)

  [+ Authentication](/dev/api/devguide/sdk-auth)

  [+ sdk\_example](/dev/api/devguide/sdk_example)

* HTTP Request

  [+ API Request](/dev/api/http-call/http-para)

  [+ Authentication](/dev/api/http-call/http-auth)

* More Frameworks

  [+ OpenAI SDK](/dev/api/thirdparty-frame/openai-sdk)

  [+ Langchain SDK](/dev/api/thirdparty-frame/langchain-sdk)

APIs

* Language models

  [+ GLM-4 Models](/dev/api/normal-model/glm-4)

  [+ GLM-4V Models](/dev/api/normal-model/glm-4v)

* Reasoning models

  [+ GLM-Z1](/dev/api/Reasoning-models/glm-z1)

* Video Generation

  [+ CogVideoX](/dev/api/videomodel/cogvideox)

  [+ CogVideoX-3](/dev/api/videomodel/cogvideox-3)

  [+ Vidu Models](/dev/api/videomodel/vidu)

* Audio-Video

  [+ GLM-4-Voice](/dev/api/rtav/GLM-4-Voice)

  [+ GLM-Realtime](/dev/api/rtav/GLM-Realtime)

  [+ GLM-ASR](/dev/api/rtav/glm-asr)

* Reasoning models

  [+ GLM-4.1V-Thinking](/dev/api/visual-reasoning-model/GLM-4.1V-Thinking)

* Agent

  [+ TranslationAgent](/dev/api/agent/general_translation)

  [+ Professional Document Translation](/dev/api/agent/doc_translation_agent)

  [+ Social Science and Literary Translation](/dev/api/agent/social_literature_translation_agent)

  [+ Subtitle Translation for Film and Television](/dev/api/agent/subtitle_translation_agent)

  [+ Social Media Translation](/dev/api/agent/social_translation_agent)

  [+ AI Drawing](/dev/api/agent/ai_drawing_agent)

  [+ AI Comics](/dev/api/agent/cartoon_generator_agent)

  [+ Popular Special Effects Videos](/dev/api/agent/vidu_template_agent)

  [+ Resume and Job Matching Assistant](/dev/api/agent/job_matching_agent)

  [+ Customer Service Script Quality Inspection](/dev/api/agent/service_check_agent)

  [+ Sales Quality Inspection](/dev/api/agent/sales_check_agent)

  [+ Bill Recognition](/dev/api/agent/receipt_recognition_agent)

  [+ Clothes Recognition](/dev/api/agent/clothes_recognition_agent)

  [+ Contract Analysis](/dev/api/agent/contract_parser_agent)

  [+ Tendering Analysis Agent](/dev/api/agent/bidding_parser_agent)

  [+ Winning Bid Analysis Agent](/dev/api/agent/bidwin_parser_agent)

  [+ Intelligent Problem Solving](/dev/api/agent/intelligent_education_solve_agent)

  [+ Homework Grading](/dev/api/agent/intelligent_education_correction_agent)

* search-tool

  [+ Web Search API](/dev/api/search-tool/web-search)

  [+ Web Search in Chat](/dev/api/search-tool/websearch-in-chat)

  [+ Search Agent](/dev/api/search-tool/agent-search)

* Image Generation

  [+ CogView-4](/dev/api/image-model/cogview)

* Agent Model

  [+ GLM-4-AllTools](/dev/api/intelligent-agent-model/glm-4-alltools)

  [+ GLM-4-Assistant](/dev/api/intelligent-agent-model/assistantapi)

* Code Programming

  [+ CodeGeeX-4](/dev/api/code-model/codegeex-4)

* Embedding

  [+ Embedding](/dev/api/vector/embedding)

* Moderations

  [+ moderations](/dev/api/moderations/moderations)

* Role-playing

  [+ CharGLM-4](/dev/api/super-humanoid/charglm-4)

  [+ Emohaa](/dev/api/super-humanoid/emohaa)

* Agent Development Platform

  [+ 【New】qingliuagent](/dev/api/Agent_Platform/newagent)

  [+ agent](/dev/api/Agent_Platform/agent)

  [+ qingliuSDK](/dev/api/Agent_Platform/agentsdk)

  [+ Knowledge](/dev/api/Agent_Platform/knowledge)

  [+ FinAgent](/dev/api/Agent_Platform/FinAgent)

* Batch

  [+ Batch](/dev/api/batch-api/batch)

* Data Management

  [+ File Management](/dev/api/knowlage-manage/queryfile)

  [+ File content extraction](/dev/api/knowlage-manage/queryextract)

  [+ Rerank](/dev/api/knowlage-manage/rerank)

* Error Codes

  [+ HTTP Status Codes](/dev/api/error-code/error-code-v4)

  [+ Model Error Codes](/dev/api/error-code/service-error)

More

[* Libraries](/dev/api/libraries)

[* API Pricing](/dev/api/product-billing)

[* Tokenizer](/dev/api/tokenizer)

[* Parameter Description](/dev/api/parameter-description)

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

# Embedding

Model Encoding: embedding-2, embedding-3

Text embedding model: Transforms input text into vector representations for integration with vector databases as external knowledge bases for large models. Click to view [product pricing](https://www.bigmodel.cn/pricing) .  
embedding-3: Supports custom vector dimensions, recommended options are 256, 512, 1024, or 2048 dimensions.

## Synchronous Call

#### API Request

| Type | Description |
| --- | --- |
| Transfer Mode | https |
| Request URL | https://open.bigmodel.cn/api/paas/v4/embeddings |
| Call Method | Synchronous call, waits for the model to complete execution and returns the final result |
| Character Encoding | UTF-8 |
| API Request Format | JSON |
| Response Format | JSON |
| API Request Type | POST |
| Development Language | Any programming language capable of making HTTP requests |

### Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| model | String | Yes | Model encoding |
| input | String or Array | Yes | Text to be vectorized, supports string arrays.  embedding-2 supports a maximum of 512 tokens per request, with a total array length not exceeding 8K;  embedding-3 supports a maximum of 2048 tokens per request. |
| dimensions | Integer | No | Vector dimensions default to 2048. Embedding-3 model supports custom vector dimensions, recommended options are 256, 512, 1024, or 2048 dimensions. |

### Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| model | String | Model encoding |
| object | Long | Result type, currently “list” |
| data | List<Object> | Model-generated array results |
| index | Integer | Result index |
| object | String | Result type, currently “embedding” |
| embedding | ListObject | Embedding processing result, returns an array of vectorized representations |
| usage | Object | Token statistics for this model call |
| prompt\_tokens | Integer | Number of tokens in user input |
| completion\_tokens | Integer | Number of tokens in model output |
| total\_tokens | Integer | Total number of tokens |

### Call Example

#### Request Example

```
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="your api key") 
response = client.embeddings.create(
    model="embedding-3", # Specify the model encoding to be called
    input=[
        "The food was very delicious, and the service was friendly.",
        "This movie is both thrilling and exciting.",
        "Reading books is a great way to expand knowledge."
    ],
)
print(response)
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

#### Response Example

```
{
    "model": "embedding-3",
    "data": [
        {
            "embedding": [
                -0.02675454691052437,
                0.019060475751757622,
                ...... 
                -0.005519774276763201,
                0.014949671924114227
            ],
            "index": 0,
            "object": "embedding"
        },
        ...
        {
            "embedding": [
                -0.02675454691052437,
                0.019060475751757622,
                ...... 
                -0.005519774276763201,
                0.014949671924114227
            ],
            "index": 2,
            "object": "embedding"
        }
    ],
    "object": "list",
    "usage": {
        "completion_tokens": 0,
        "prompt_tokens": 100,
        "total_tokens": 100
    }
}
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

Table of contents

Synchronous Call

Request Parameters

Response Parameters

Call Example