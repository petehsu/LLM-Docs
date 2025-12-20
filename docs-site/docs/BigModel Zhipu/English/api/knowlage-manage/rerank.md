[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2Fknowlage-manage%2Frerank)

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

# Rerank

Rerank is used for text reranking. It receives a user’s query text and a list of candidate texts, calculates the relevance scores between the candidate texts and the query text using a model, and returns the scores. It is suitable for scenarios such as intelligent question answering and information retrieval.Click to view [product pricing](https://www.bigmodel.cn/pricing) .

## **API Request**

| Transfer Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/rerank |
| Call Method | Synchronous call, waiting for the system to complete execution and return the final result |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | POST |
| Development Language | Any development language that can initiate HTTP requests |

## Request Parameters

| **Parameter Name** | **Type** | **Required** | **Parameter Description** |
| --- | --- | --- | --- |
| model | String | Yes | The model code to be called defaults to rerank. |
| query | String | Yes | Query text, used to match with candidate texts. Maximum length is 4096 characters. |
| top\_n | Integer | No | Returns the top n results with the highest scores. Default is 0, which returns all results. |
| documents | List<String> | Yes | Array of candidate texts to be scored. Maximum of 128 items, with each item having a maximum length of 4096 characters. |
| return\_documents | Boolean | No | Whether to return the original texts. Default is FALSE. |
| return\_raw\_scores | Boolean | No | Whether to return raw scores. Default is FALSE. |
| request\_id | String | No | Unique identifier for each request, provided by the client. If not provided, the platform will generate one. |
| user\_id | String | No | Unique ID of the end user, helping the platform intervene in cases of violations, illegal or harmful content generation, or abuse. ID length requirement: minimum 6 characters, maximum 128 characters. [Learn more](https://bigmodel.cn/dev/howuse/securityaudit) |

## Response Parameters

| **Parameter Name** | **Type** | **Parameter Description** |
| --- | --- | --- |
| request\_id | String | Task ID submitted by the user or generated by the platform |
| id | String | Task order ID generated by the Zhipu AI Open Platform. Use this ID when querying the request result. |
| results | List<Object> | Rerank reordering results |
| index | Integer | Sorting index |
| relevance\_score | Float | Document relevance score |
| document | String | Original document |
| usage | Object | Token count statistics for this model call |
| prompt\_tokens | Integer | **Calculation Formula**: `prompt_tokens = tokens(query) × len(documents) + sum(tokens(documents))`  **Example**:  Assume:  - `query` has 10 tokens.  - There are 5 documents, each with 50, 30, 20, 40, and 60 tokens respectively.  Then:  `prompt_tokens = 10 × 5 + (50 + 30 + 20 + 40 + 60) = 50 + 200 = 250` **Summary**: The number of tokens in `query` is multiplied by the number of documents, so be cautious about increased costs when using a large number of documents or long `query`. |
| total\_tokens | Integer | Total number of tokens |

## HTTP Call Example

```
curl --location --request POST 'https://open.bigmodel.cn/api/paas/v4/rerank' \
--header 'Authorization: Your_apikey' \
--header 'User-Agent: Apifox/1.0.0 (https://apifox.com)' \
--header 'Content-Type: application/json' \
--data-raw '{
    "request_id": "1111111111",
    "query": "What is the capital of the United States?",
    "top_n": 3,
    "documents": [
        "Carson City is the capital city of the American state of Nevada.",
        "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district."
    ],
    "return_documents": true,
    "return_raw_scores": true
}'
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

## Response Example

```
{
    "created": 1732083164,
    "id": "20241120141244890ab4ee4af84acf",
    "request_id": "1111111111",
    "results": [
        {
            "document": "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district.",
            "index": 1,
            "relevance_score": 0.99866986
        },
        {
            "document": "Carson City is the capital city of the American state of Nevada.",
            "index": 0,
            "relevance_score": 0.001294368
        }
    ],
    "usage": {
        "prompt_tokens": 72,
        "total_tokens": 72
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

Table of contents

API Request

Request Parameters

Response Parameters

HTTP Call Example

Response Example