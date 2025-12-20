[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2FAgent_Platform%2FFinAgent)

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

## 1.Company Due Diligence Assistant

### 1.1 Interface Description

| Type | Description |
| --- | --- |
| Method | HTTPS |
| Request URL | https://open.bigmodel.cn/api/aico-saas/bm/v1/DueDiligenceReport |
| Calling Method | Synchronous call, wait for the model to complete execution and return the final result; or use SSE streaming call |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON or standard Stream Event |
| Request Type | POST |
| Development Language | Any development language capable of initiating an HTTP request |

### 1.2 Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| company | string | Yes | The name of the company for due diligence, 2 - 25 Chinese or English characters |
| stream | bool | No | Whether to use streaming request call |
| model | string | No | The name of the model used, optional values: ["4-Plus", "4-Air"], default value: "4-Plus" |
| temperature | float | No | Model temperature, range: 0.0 - 1.0, default value: 0.5 |

### 1.3 Streaming Response Return Value

The last message of the streaming response is the final result. The normal result is returned as:

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| event | string | Message type, the last ending message type is workflow\_finished |
| session\_id | string | The unique ID of the current session |
| step\_id | string | The unique ID of the current session workflow step |
| created | int64 | The timestamp of the session creation time, in milliseconds |
| data | object |  |
| text | array |  |
| output | string | The returned final result |
| svg | string | The flowchart of the returned final result, in SVG format |
| usage | object |  |
| total\_tokens | int | The total number of input and output tokens |
| prompt\_tokens | int | The number of tokens consumed by all model inputs |
| completion\_tokens | int | The number of tokens of the returned result |
| max\_token | string | The maximum context length supported by the model |

### 1.4 Synchronous Non - Streaming Response Return Value

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| code | int | Status code, 0 for normal |
| message | string | Return value |
| data | object |  |
| svg | string | SVG content |
| result | string | Returned content |

### 1.5 Abnormal Response Return Value

If there is a parameter error or an internal operation error, an error will be returned. The structure is:

| Parameter Name | Type | Description |
| --- | --- | --- |
| code | int | Error status code |
| message | string | Error message description |

Status Code List

| Status Code | Information Description |
| --- | --- |
| 1001 | Authentication failed |
| 1002 | Invalid user |
| 1003 | Request parameter error |
| 1004 | Sensitive input |
| 1005 | Invalid API |
| 1006 | Large model service error |
| 1007 | Workflow internal error |
| 1008 | Deep thinking internal error |
| 1009 | Database error |
| 1010 | Service internal error |

### 1.6 cURL Example

```
curl --location --request POST 'https://open.bigmodel.cn/api/aico-saas/bm/v1/DueDiligenceReport' \
--header 'authorization: YOUR_API_KEY' \
--header 'User-Agent: curl/7.71.1' \
--header 'Content-Type: application/json' \
--data-raw '{
  "company": "Beijing Zhipu Huatong Technology Co., Ltd.",
  "stream": true
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

## 2. Financial Consumer Protection Audit

### 2.1 Interface Description

| Type | Description |
| --- | --- |
| Method | HTTPS |
| Request URL | https://open.bigmodel.cn/api/aico-saas/bm/v1/ConsumerProtectionAudit |
| Calling Method | Synchronous call, wait for the model to complete execution and return the final result; or use SSE streaming call |
| Character Encoding | UTF-8 |
| Request Format | multipart/form-data |
| Response Format | JSON or standard Stream Event |
| Request Type | POST |
| Development Language | Any development language capable of initiating an HTTP form request |

### 2.2 Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| query | string | Yes | The content of the text to be audited, up to 10000 Chinese or English characters |
| image | jpg/png | No | The content of the image to be audited. At least one of the text content and the image content to be audited must be filled; upload the file in the form of a form; maximum 5MB |
| stream | bool | No | Whether to use streaming request call |
| model | string | No | The name of the model used, optional values: ["4-Plus", "4-Air"], default value: "4-Plus" |
| temperature | float | No | Model temperature, range: 0.0 - 1.0, default value: 0.5 |

### 2.3 Streaming Response Return Value

The last message of the streaming response is the final result. The normal result is returned as:

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| event | string | Message type, the last ending message type is workflow\_finished |
| session\_id | string | The unique ID of the current session |
| step\_id | string | The unique ID of the current session workflow step |
| created | int64 | The timestamp of the session creation time, in milliseconds |
| data | object |  |
| text | array |  |
| output | string | The returned final result |
| usage | object |  |
| total\_tokens | int | The total number of input and output tokens |
| prompt\_tokens | int | The number of tokens consumed by all model inputs |
| completion\_tokens | int | The number of tokens of the returned result |
| max\_token | string | The maximum context length supported by |

### 2.4 Synchronous Non-Streaming Response Return Value

| Parameter Name | Type | Description |
| --- | --- | --- |
| code | int | Status code, 0 for normal |
| message | string | Return value |
| data | object |  |
| result | string | Returned content |

### 2.5 Abnormal Response Return Value

If there is a parameter error or an internal operation error, an error will be returned. The structure is:

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| code | int | Error status code |
| message | string | Error message description |

Status Code List

| Status Code | Information Description |
| --- | --- |
| 1001 | Authentication failed |
| 1002 | Invalid user |
| 1003 | Request parameter error |
| 1004 | Sensitive input |
| 1005 | Invalid API |
| 1006 | Large model service error |
| 1007 | Workflow internal error |
| 1008 | Deep thinking internal error |
| 1009 | Database error |
| 1010 | Service internal error |

### 2.6 cURL Example

```
curl --location --request POST 'https://open.bigmodel.cn/api/aico-saas/bm/v1/ConsumerProtectionAudit' \
--header 'authorization: YOUR_API_KEY' \
--header 'User-Agent: curl/8.7.1' \
--form 'stream="true"' \
--form 'query="No credit check, low interest, high limit, same-day loan, loan with collateral"' \
--form 'image=@"/Users/i/Desktop/xiaobaoshenhe.jpg"'
```

## 3. Financial Adviser Sparring

### 3.1 Interface Description

| Type | Description |
| --- | --- |
| Method | HTTPS |
| Request URL | https://open.bigmodel.cn/api/aico-saas/bm/v1/FinancialAdviserSparring |
| Calling Method | Synchronous call, wait for the model to complete execution and return the final result; or use SSE streaming call |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON or standard Stream Event |
| Request Type | POST |
| Development Language | Any development language capable of initiating an HTTP request |

### 3.2 Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| query | string | Yes | Current conversation content, up to 2000 Chinese or English characters |
| history | array | No | Conversation history messages, up to 30 historical records |
| role | string | No | The role of historical messages, parameter is user or assistant |
| content | string | No | The content of historical messages |
| stream | bool | No | Whether to use streaming request call |
| model | string | No | The name of the model used, optional values: ["4-Plus", "4-Air"], default value: "4-Plus" |
| temperature | float | No | Model temperature, range: 0.0 - 1.0, default value: 0.5 |

### 3.3 Streaming Response Return Value

The last message of the streaming response is the final result. The normal result is returned as:

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| event | string | Message type, the last ending message type is message\_finished |
| session\_id | string | The unique ID of the current session |
| step\_id | string | The unique ID of the current session workflow step |
| created | int64 | The timestamp of the session creation time, in milliseconds |
| data | object |  |
| text | array |  |
| output | string | The returned final result |
| usage | object |  |
| total\_tokens | int | The total number of input and output tokens |
| prompt\_tokens | int | The number of tokens consumed by all model inputs |
| completion\_tokens | int | The number of tokens of all model outputs |
| max\_token | string | The maximum context length supported by the model |

### 3.4 Synchronous Non-Streaming Response Return Value

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| code | int | Status code, 0 for normal |
| message | string | Return value |
| data | object |  |
| result | string | Returned content |

### 3.5 Abnormal Response Return Value

If there is a parameter error or an internal operation error, an error will be returned. The structure is:

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| code | int | Error status code |
| message | string | Error message description |

Status Code List

| Status Code | Information Description |
| --- | --- |
| 1001 | Authentication failed |
| 1002 | Invalid user |
| 1003 | Request parameter error |
| 1004 | Sensitive input |
| 1005 | Invalid API |
| 1006 | Large model service error |
| 1007 | Workflow internal error |
| 1008 | Deep thinking internal error |
| 1009 | Database error |
| 1010 | Service internal error |

### 3.6 cURL Example

```
curl --location --request POST 'https://open.bigmodel.cn/api/aico-saas/bm/v1/FinancialAdviserSparring' \
--header 'authorization: YOUR_API_KEY' \
--header 'User-Agent: curl/8.7.1' \
--header 'Content-Type: application/json' \
--data-raw '{
  "stream": true,
  "query": "A great wealth management product",
  "history": [
    {"role": "user", "content": "As a marketing expert, please create an attractive slogan for my product"},
    {"role": "assistant", "content": "Sure, to create an attractive slogan, please tell me some information about your product"},
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hello, I am the Zhizhi AI assistant, very glad to serve you!"}
  ]
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

## 4. Financial Regulatory Dynamics Analysis Assistant

### 4.1 Interface Description

| Type | Description |
| --- | --- |
| Method | HTTPS |
| Request URL | https://open.bigmodel.cn/api/aico-saas/bm/v1/RegulatoryUpdatesTracker |
| Calling Method | Synchronous call, wait for the model to complete execution and return the final result; or use SSE streaming call |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON or standard Stream Event |
| Request Type | POST |
| Development Language | Any development language capable of initiating an HTTP request |

### 4.2 Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| query | string | Yes | Input string, 2 - 25 Chinese or English characters |
| stream | bool | No | Whether to use streaming request call |
| model | string | No | The name of the model used, optional values: ["4-Plus", "4-Air"], default value: "4-Plus" |
| temperature | float | No | Model temperature, range: 0.0 - 1.0, default value: 0.5 |

### 4.3 Streaming Response Return Value

The last message of the streaming response is the final result. The normal result is returned as:

| Parameter Name | Type | Description |
| --- | --- | --- |
| event | string | Message type, the last ending message type is workflow\_finished |
| session\_id | string | The unique ID of the current session |
| step\_id | string | The unique ID of the current session workflow step |
| created | int64 | The timestamp of the session creation time, in milliseconds |
| data | object |  |
| text | array |  |
| output | string | The returned final result |
| svg | string | The flowchart of the returned final result, in SVG format |
| usage | object |  |
| total\_tokens | int | The total number of input and output tokens |
| prompt\_tokens | int | The number of tokens consumed by all model inputs |
| completion\_tokens | int | The number of tokens of the returned result |
| max\_token | string | The maximum context length supported by the model |

### 4.4 Synchronous Non-Streaming Response Return Value

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| code | int | Status code, 0 for normal |
| message | string | Return value |
| data | object |  |
| result | string | Returned content |

### 4.5 Abnormal Response Return Value

If there is a parameter error or an internal operation error, an error will be returned. The structure is:

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| code | int | Error status code |
| message | string | Error message description |

Status Code List

| Status Code | Information Description |
| --- | --- |
| 1001 | Authentication failed |
| 1002 | Invalid user |
| 1003 | Request parameter error |
| 1004 | Sensitive input |
| 1005 | Invalid API |
| 1006 | Large model service error |
| 1007 | Workflow internal error |
| 1008 | Deep thinking internal error |
| 1009 | Database error |
| 1010 | Service internal error |

### 4.6 cURL Example

```
curl --location --request POST 'https://open.bigmodel.cn/api/aico-saas/bm/v1/RegulatoryUpdatesTracker' \
--header 'authorization: YOUR_API_KEY' \
--header 'User-Agent: curl/8.7.1' \
--header 'Content-Type: application/json' \
--data-raw '{
  "stream": true,
  "query": "Securities"
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

Table of contents

1.Company Due Diligence Assistant

1.1 Interface Description

1.2 Request Parameters

1.3 Streaming Response Return Value

1.4 Synchronous Non - Streaming Response Return Value

1.5 Abnormal Response Return Value

1.6 cURL Example

2. Financial Consumer Protection Audit

2.1 Interface Description

2.2 Request Parameters

2.3 Streaming Response Return Value

2.4 Synchronous Non-Streaming Response Return Value

2.5 Abnormal Response Return Value

2.6 cURL Example

3. Financial Adviser Sparring

3.1 Interface Description

3.2 Request Parameters

3.3 Streaming Response Return Value

3.4 Synchronous Non-Streaming Response Return Value

3.5 Abnormal Response Return Value

4. Financial Regulatory Dynamics Analysis Assistant

4.1 Interface Description

4.2 Request Parameters

4.3 Streaming Response Return Value

4.4 Synchronous Non-Streaming Response Return Value

4.5 Abnormal Response Return Value

4.6 cURL Example