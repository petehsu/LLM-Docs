[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2FAgent_Platform%2Fknowledge)

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

# Knowledge Base API

> The open\_api interface differs slightly from the frontend application interface and requires reimplementation, mainly due to changes in input parameters and return data, while the internal logic remains unchanged.

baseURL: https://open.bigmodel.cn/api/llm-application/open

# 1. Unified Authentication

https://open.bigmodel.cn/dev/api/http-call/http-auth

# 2. SDK Invocation

None available at the moment.

# 3. HTTP Invocation

## 3.1 Unified JSON Return Format

| Parameter Name | Type | Description |
| --- | --- | --- |
| data | object | Interface response data |
| code | int | Error code, 200 for normal |
| message | string | Error message |

## 3.2 Unified Basic Structure

### 3.2.1 embeddingData Model Information

| Parameter Name | Type | Description |
| --- | --- | --- |
| name | string | Model name |
| description | string | Model description |
| id | int | Model id |

### 3.2.2 knowledgeData Knowledge Base Data

| Parameter Name | Type | Description |
| --- | --- | --- |
| id | string | Unique id of the knowledge base |
| embedding\_id | int | Vectorization model bound to the knowledge base |
| name | string | Knowledge base name |
| description | string | Knowledge base description |
| background | string | Background color: ‘blue’, ‘red’, ‘orange’, ‘purple’, ‘sky’, ‘green’, ‘yellow’ |
| icon | string | Knowledge base icon: ‘question’ (question mark), ‘book’ (book), ‘seal’ (seal), ‘wrench’ (wrench), ‘tag’ (tag), ‘horn’ (horn), ‘house’ (house) |
| word\_num | int | Total number of words in the knowledge base |
| length | int | Total size of the knowledge base (in bytes) |
| document\_size | int | Number of knowledge documents |

### 3.2.3 uploadDetail Upload Details

| Parameter Name | Type | Description |
| --- | --- | --- |
| key | string | Key returned by the document upload interface |
| file\_name | string | Document name |

### 3.2.4 documentData Knowledge Data

| Parameter Name | Type | Description |
| --- | --- | --- |
| id | string | Unique id of the knowledge |
| custom\_separator | List<String> | Slicing rules |
| knowledge\_type | int | Slicing method: 1. Title/paragraph slicing: supports txt, doc, pdf, url, docx, ppt, pptx, md 2. Q&A slicing: supports txt, doc, pdf, url, docx, ppt, pptx, md 3. Line slicing: supports xls, xlsx, csv 5. Custom slicing: supports txt, doc, pdf, url, docx, ppt, pptx, md 6. Page slicing: supports pdf, ppt, pptx 7. Single slicing: supports xls, xlsx, csv |
| sentence\_size | string | Slicing size |
| length | int | File size (in bytes) |
| word\_num | int | Number of words in the file |
| name | string | File name |
| url | string | File download link |
| embedding\_stat | int | 0: Vectorizing, 1: Vectorization complete, 2: Vectorization failed |
| failInfo | object | Failure reason: When embedding\_stat=2, this value will be present |

failInfo:

| Parameter Name | Type | Description |
| --- | --- | --- |
| embedding\_code | int | Failure code |
| embedding\_msg | string | Failure reason |

### 3.2.5 Application Data

| Parameter Name | Type | Description |
| --- | --- | --- |
| id | string | Unique application identifier |
| name | string | Application name |
| desc | string | Application description |
| prompt | string | Template, formatted as `{{knowledge}}xxx{{user}}`, must contain both knowledge and user, and there is only one placeholder `{{knowledge}}` and one placeholder `{{user}}` |
| top\_p | string | Default 0.7, another method of temperature sampling called nucleus sampling; The value range is: `(0.0, 1.0)` open interval, cannot be equal to 0 or 1, the default value is 0.7; The model considers the results of tokens with `top\_p` probability quality; For example: 0.1 means that the model decoder only considers taking tokens from the first 10% of the probability candidate set; It is recommended to adjust the `top\_p` or `temperature` parameters according to the application scenario, but do not adjust both parameters at the same time |
| temperature | string | Default 0.95, sampling temperature, controlling the randomness of output, must be a positive number; The value range is: `(0.0,1.0]`, cannot be equal to 0, the default value is 0.95; The larger the value, the more random and creative the output will be; The smaller the value, the more stable or deterministic the output will be; It is recommended to adjust the `top\_p` or `temperature` parameters according to the application scenario, but do not adjust both parameters at the same time |
| knowledge\_ids | list<Long> | Knowledge base ID list |
| slice\_count | int | Number of slices, default is 1 |
| model | enum | Common value range: ‘GLM-4-Plus’,‘GLM-4-Flash’,‘GLM-4-0520’,‘GLM-4-0520’,‘GLM-4-Long’,‘GLM-4-AirX’,‘GLM-4-Air’,‘GLM-4’,‘GLM-3-Turbo’,‘GLM-4-9B’,‘emohaa’,‘GLM-4-FlashX’,‘ChatGLM\_pro’ |
| icon\_color | enum | Value range: ‘blue’, ‘red’, ‘orange’, ‘purple’, ‘sky’, ‘green’, ‘yellow’ |
| icon\_type | enum | Value range: ‘robot\_assist’ (robot assistant), ‘robot\_navigate’ (robot navigation), ‘robot\_guardian’ (robot guardian), ‘robot\_service’ (robot service), ‘robot\_messenger’ (robot messenger), ‘robot\_chat’ (robot chat), ‘robot\_engineer’ (robot engineer) |

### 3.2.6 Vectorization Status

| **Status Enum Value:int** | **Parameter Description** |
| --- | --- |
| 0 | Vectorizing |
| 1 | Vectorization Successful |
| 2 | Vectorization Failed |

### 3.2.7 Vectorization Failure Status Codes

| **Status Enum Value:int** | **Parameter Description** |
| --- | --- |
| 10001 | Knowledge unavailable, knowledge base space has reached the upper limit |
| 10002 | Knowledge unavailable, knowledge base space has reached the upper limit (number of characters exceeded the limit) |

### 3.2.8 Knowledge Types

| **Enum Value:int** | **Parameter Description** |
| --- | --- |
| 1 | txt |
| 2 | doc |
| 3 | pdf |
| 4 | url |
| 5 | docx |
| 6 | xlsx |
| 7 | jpeg |
| 8 | png |
| 9 | jpg |
| 10 | mp4 |
| 11 | csv |
| 12 | ppt |
| 13 | pptx |
| 14 | md |
| 15 | xls |

## 3.3 Vector Related

### 3.3.1 Vector Model List

Used to obtain the list of currently supported vector models

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /embedding |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Interface Request Format |  |
| Response Format | JSON |
| Interface Request Type | GET |

#### Interface Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
|  |  |  |  |

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/embedding' \
--header 'accept: */*' \
--header 'Authorization: xxx'
```

1  
2  
3

#### Interface Response Parameters

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| list | list<embeddingData> | Model List |
| total | int | Total Number of Models |

##### Response Example

```
{
  "data": {
    "list": [
      {
        "name": "zhipu_embedding_v1",
        "description": "zhipu_embedding_v1",
        "id": 3
      }
    ],
    "total": 1
  },
  "code": 200,
  "message": "请求成功",
  "timestamp": 1689649504996
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

## 3.4 Knowledge Base

> The knowledge base can exist independently without relying on the application

### 3.4.1 Create Knowledge Base

Used to create a personal knowledge base

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /knowledge |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | POST |

#### Interface Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| embedding\_id | int | Yes | Vectorization model bound to the knowledge base |
| name | string | Yes | Knowledge base name |
| description | string | No | Knowledge base description |
| background | string | No | Background color: ‘blue’, ‘red’, ‘orange’, ‘purple’, ‘sky’, ‘green’, ‘yellow’ Default: ‘blue’ |
| icon | string | No | Knowledge base icon: ‘question’ (Question Mark), ‘book’ (Book), ‘seal’ (Seal), ‘wrench’ (Wrench), ‘tag’ (Tag), ‘horn’ (Horn), ‘house’ (House) Default: ‘question’ |

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/knowledge' \
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--header 'Authorization: xxx' \
--data '{
    "embedding_id": 1,
    "name": "测试知识库",
    "description": "用于测试"
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

#### Interface Response Parameters

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| id | string | Unique ID of the generated knowledge base |

##### Response Example

```
{
    "data": {
        "id": "1734786514366738432"
    },
    "code": 200,
    "message": "请求成功",
    "timestamp": 1702440310459
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

### 3.4.2 Edit Knowledge Base

Used to edit an already created personal knowledge base

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /knowledge/{id} |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Interface Request Format | PATH |
| Response Format | JSON |
| Interface Request Type | PUT |

#### Interface Path Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| id | string | Yes | Knowledge base ID |

#### Interface Request Parameters

Only pass the fields that need to be modified

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| embedding\_id | int | No | Vectorization model bound to the knowledge base |
| name | string | No | Knowledge base name |
| description | string | No | Knowledge base description |
| background | string | No | Background color: ‘blue’, ‘red’, ‘orange’, ‘purple’, ‘sky’, ‘green’, ‘yellow’ |
| icon | string | No | Knowledge base icon: ‘question’ (Question Mark), ‘book’ (Book), ‘seal’ (Seal), ‘wrench’ (Wrench), ‘tag’ (Tag), ‘horn’ (Horn), ‘house’ (House) |
| callback\_url | string | No | Callback URL (if the vector model is modified, the knowledge needs to be rebuilt, and the customer decides whether to configure the callback separately) |
| callback\_header | object | No | k-v, headers carried during callback (if the vector model is modified, the knowledge needs to be rebuilt, and the customer decides whether to configure the callback separately) |

##### Request Example

```
curl --location --request PUT 'https://open.bigmodel.cn/api/llm-application/open/knowledge/1734786514366738432' \
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--header 'Authorization: xxx' \
--data '{
    "name": "test"
}'
```

1  
2  
3  
4  
5  
6  
7

#### Interface Response Parameters

##### Response Example

```
{
  "code": 200,
  "message": "请求成功",
  "timestamp": 1689649504996
}
```

1  
2  
3  
4  
5  
6

### 3.4.3 Knowledge Base List

Used to obtain a list of personal knowledge bases

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /knowledge |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | GET |

#### Interface Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| page | int | No | Page number, default 1 |
| size | int | No | Number of items per page, default 10 |

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/knowledge' \
--header 'accept: */*' \
--header 'Authorization: xxx'
```

1  
2  
3

#### Interface Response Parameters

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| list | list<knowledgeData> | Knowledge Base List |
| total | int | Total Number of Knowledge Bases |

##### Response Example

```
{
    "data": {
        "list": [
            {
                "id": "12121212111212",
                "embedding_id": 1,
                "name": "",
                "description": "",
                "background": "",
                "icon": "",
                "document_size": 10,
                "length":10000,
                "word_num":100000
            },
        ],
        "total": 1
    },
    "code": 200,
    "message": "请求成功",
    "timestamp": 1689649504996
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

### 3.4.4 Knowledge Base Details

Used to obtain details of a personal knowledge base

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /knowledge/{id} |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Interface Request Format | PATH |
| Response Format | JSON |
| Interface Request Type | GET |

#### Interface Path Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| id | string | Yes | Based on the knowledge base ID |

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/knowledge/1734786514366738432' \
--header 'accept: */*' \
--header 'Authorization: xxx'
```

1  
2  
3

#### Interface Response Parameters Reference

#### knowledgeData

##### Response Example

```
{
    "data": {
        "id": "1734786514366738432",
        "name": "test",
        "description": "用于测试",
        "icon": "question",
        "background": "blue",
        "embedding_id": 1,
        "word_num": 0,
        "length": 0,
        "document_size": 0
    },
    "code": 200,
    "message": "请求成功",
    "timestamp": 1702440707110
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

### 3.4.5 Delete Knowledge Base

Used to delete a knowledge base

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /knowledge/{id} |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Interface Request Format | PATH |
| Response Format | JSON |
| Interface Request Type | DELETE |

#### Interface Path Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| id | string | Yes | Knowledge base ID |

##### Request Example

```
curl --location --request DELETE 'https://open.bigmodel.cn/api/llm-application/open/knowledge/1734786514366738432' \
--header 'accept: */*' \
--header 'Authorization: xxx'
```

1  
2  
3

#### Interface Response Parameters

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |

##### Response Example

```
{
  "code": 200,
  "message": "请求成功",
  "timestamp": 1689649504996
}
```

1  
2  
3  
4  
5

### 3.4.6 Knowledge Base Usage Details

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /knowledge/capacity |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Interface Request Format |  |
| Response Format | JSON |
| Interface Request Type | GET |

#### Interface Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
|  |  |  |  |

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/knowledge/capacity' \
--header 'accept: */*' \
--header 'Authorization: xxx'
```

1  
2  
3

#### Interface Response Parameters

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| used | object<T> | Used Quantity |
| total | object<T> | Total Quantity |

T:

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| word\_num | integer | Word Count |
| length | integer | Byte Count |

##### Example

```
{
    "data":{
        "used":{
            "word_num":100,
            "length":2000
        },
        "total":{
            "word_num":100000,
            "length":200000000
        }
    },
    "code":200,
    "message":"请求成功",
    "timestamp":1689649504996
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

## 3.5 Knowledge

Provides an interface for deleting by slices, adding a major category of slices

> Knowledge exists within a knowledge base; a specific knowledge base must be designated before creating knowledge.

### 3.5.1 Upload Document to Build Knowledge

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /document/upload\_document/{id} |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Interface Request Format | multipart/form-data |
| Response Format | JSON |
| Interface Request Type | POST |

#### Interface Path Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| id | string | Yes | Knowledge base ID |

#### Interface Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| files | File array | Yes | Files |
| knowledge\_type | int | No | If not passed: dynamically parses the knowledge type1. Slice by title/paragraph: supports txt, doc, pdf, url, docx, ppt, pptx, md2. Slice by Q&A pair: supports txt, doc, pdf, url, docx, ppt, pptx, md3. Slice by line: supports xls, xlsx, csv5. Custom slice: supports txt, doc, pdf, url, docx, ppt, pptx, md6. Slice by page: supports pdf, ppt, pptx7. Slice by single item: supports xls, xlsx, csv |
| custom\_separator | List<string> | No | Passed when the current knowledge type is custom (knowledge\_type=5); slice rules, default \n |
| sentence\_size | int | No | Passed when the current knowledge type is custom (knowledge\_type=5); range: 20-2000, slice size, default 300 |
| parse\_image | boolean | No | Whether to parse images, default is no |
| callback\_url | string | No | Callback URL |
| callback\_header | object | No | k-v, headers carried during callback |
| word\_num\_limit | string | No | Word count limit for this document, must be a number |
| req\_id | string | No | Unique request ID |

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/document/upload_document/1734786402936664064' \
--header 'accept: */*' \
--header 'Authorization: xxx' \
--form 'files=@"/Users/liu/Downloads/xxx.pdf"' \
--form 'files=@"/Users/liu/Downloads/xxx.docx"'
```

1  
2  
3  
4  
5

#### 接口响应参数

| 参数名称 | 类型 | 参数说明 |
| --- | --- | --- |
| successInfos | list<T> | 上传成功的文件 |
| failedInfos | list<R> | 上传失败的文件 |

T:

| 参数名称 | 类型 | 参数说明 |
| --- | --- | --- |
| documentId | int | 知识id |
| fileName | string | 文件名 |

R:

| 参数名称 | 类型 | 参数说明 |
| --- | --- | --- |
| fileName | string | 文件名 |
| failReason | string | 失败原因 |

##### 示例

```
{
    "data": {
        "successInfos": [
            {
                "documentId": "123456788990",
                "fileName": "xxx.pdf"
            },
            {
                "documentId": "123456788",
                "fileName": "xxx.docx"
            }
        ],
        "failedInfos": [
            {
                "fileName": "xxx.xlsx",
                "failReason": "不支持的文档类型"
            }
        ]
    },
    "code": 200,
    "message": "请求成功",
    "timestamp": 1690355734843
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

### 3.5.2 Edit Knowledge

Used to edit personal knowledge and rebuild knowledge

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /document/{id} |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Interface Request Format | PUT |
| Response Format | JSON |
| Interface Request Type | PUT |

#### Interface Path Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| id | string | Yes | Knowledge ID |

#### Interface Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| knowledge\_type | int | Yes | 1. Slice by title/paragraph: supports txt, doc, pdf, url, docx, ppt, pptx, md2. Slice by Q&A pair: supports txt, doc, pdf, url, docx, ppt, pptx, md3. Slice by line: supports xls, xlsx, csv5. Custom slice: supports txt, doc, pdf, url, docx, ppt, pptx, md6. Slice by page: supports pdf, ppt, pptx7. Slice by single item: supports xls, xlsx, csv |
| custom\_separator | List<string> | No | Passed when the current knowledge type is custom (knowledge\_type=5); slice rules will take effect, default \n |
| sentence\_size | int | No | Passed when the current knowledge type is custom (knowledge\_type=5); range: 20-2000, slice size, default 300 |
| callback\_url | string | No | Callback URL |
| callback\_header | object | No | k-v, headers carried during callback |

##### Request Example

```
curl --location --request PUT 'https://open.bigmodel.cn/api/llm-application/open/document/1734816157446680576' \
--header 'accept: */*' \
--header 'Authorization: xxx' \
--header 'Content-Type: application/json' \
--data '{
    "knowledge_type": 1
}'
```

1  
2  
3  
4  
5  
6  
7

#### Interface Response Parameters

##### Response Example

```
{
  "code": 200,
  "message": "请求成功",
  "timestamp": 1689649504996
}
```

1  
2  
3  
4  
5  
6

### 3.5.3 Knowledge Document List

List of knowledge documents in a specific knowledge base

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /document |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Interface Request Format | QUERY |
| Response Format | JSON |
| Interface Request Type | GET |

#### Interface Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| knowledge\_id | string | Yes | Knowledge base ID |
| page | int | No | Page, default 1 |
| size | int | No | Number of items per page, default 10 |
| word | string | No | Document name |

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/document?knowledge_id=1734786402936664064' \
--header 'accept: */*' \
--header 'Authorization: xxx'
```

1  
2  
3

#### Interface Response Parameters

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| list | list<documentData> | Model List |
| total | long | Total Number of Models |

##### Response Example

```
{
    "data": {
        "list": [
            {
                "id": "12312121212",
                "knowledge_type": 1,
                "custom_separator": [
                    "\n"
                ],
                "sentence_size": 300,
                "length": 0,
                "word_num":100,
                "name": "",
                "url": "",
                "embedding_stat": 0,
                "failInfo":{
                   "embedding_code":10002, // 见统一基础结构体: 向量化失败状态码
                   "embedding_msg":"字数超出限制"
                }
            }
        ],
        "total": 1
    },
    "code": 200,
    "message": "请求成功",
    "timestamp": 1689649504996
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

### 3.5.4 Knowledge Details

Retrieve knowledge details by ID

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /document/{id} |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | GET |

#### Interface Path Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| id | string | Yes | Knowledge ID |

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/document/1734816157446680576' \
--header 'accept: */*' \
--header 'Authorization: xxx'
```

1  
2  
3

#### Interface Response Parameters

documentData

##### Response Example

```
{
    "data":{
        "id":"12121212121212",
        "knowledge_type": 1,
        "custom_separator":
        [
            "\n"
        ],
        "sentence_size":300,
        "length":0,
        "word_num":100,
        "name":"",
        "url":"",
        "embedding_stat":0,
        "failInfo":{
            "embedding_code":10002, // 见统一基础结构体: 向量化失败状态码
            "embedding_msg":"字数超出限制"
        }
    },
    "code":200,
    "message":"请求成功",
    "timestamp":1689649504996
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

### 3.5.5 Delete Knowledge

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /document/{id} |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Interface Request Format | PATH |
| Response Format | JSON |
| Interface Request Type | DELETE |

#### Interface Path Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| id | string | Yes | Knowledge ID |

##### Request Example

```
curl --location --request DELETE 'https://open.bigmodel.cn/api/llm-application/open/document/1734816156775591936' \
--header 'accept: */*' \
--header 'Authorization: xxx'
```

1  
2  
3

#### Interface Response Parameters

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |

##### Response Example

```
{
  "code": 200,
  "message": "请求成功",
  "timestamp": 1689649504996
}
```

1  
2  
3  
4  
5  
6

### 3.5.6 Upload URL to Build Knowledge

Used to create personal knowledge web pages

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /document/upload\_url |
| Invocation Method | Synchronous call returns upload result; vectorized results require a query interface |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | POST |

#### Interface Request Parameters

| **Parameter Name** | **Type** | **Required** | **Parameter Description** |
| --- | --- | --- | --- |
| upload\_detail | list<UrlData> | Yes | URL |
| knowledge\_id | string | Yes | Knowledge base ID |

UrlData

| **Parameter Name** | **Type** | **Required** | **Parameter Description** |
| --- | --- | --- | --- |
| url | String | Yes | URL |
| knowledge\_type | integer | Yes | 1. Slice by title/paragraph: supports txt, doc, pdf, url, docx, ppt, pptx, md2. Slice by Q&A pair: supports txt, doc, pdf, url, docx, ppt, pptx, md3. Slice by line: supports xls, xlsx, csv5. Custom slice: supports txt, doc, pdf, url, docx, ppt, pptx, md6. Slice by page: supports pdf, ppt, pptx7. Slice by single item: supports xls, xlsx, csv |
| custom\_separator | List<string> | No | Passed when the current knowledge type is custom (knowledge\_type=5); slice rules will take effect, default \n |
| sentence\_size | int | No | Passed when the current knowledge type is custom (knowledge\_type=5); range: 20-2000, slice size, default 300 |
| callback\_url | string | No | Callback URL |
| callback\_header | object | No | k-v, headers carried during callback |

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/document/upload_url' \
--header 'accept: */*' \
--header 'Authorization: xxx' \
--header 'Content-Type: application/json' \
--data '{
  "knowledge_id": "1734786402936664064",
  "upload_detail": [
    {
      "knowledge_type": 1,
      "url": "https://blog.csdn.net/zmm0413/article/details/108078400"
    }
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

#### Interface Response Parameters

##### Response Example

```
{
  "data": {
        "successInfos": [
            {
                "documentId": "122121212",
                "url": "xxx.com"
            },
            {
                "documentId": "12121212121",
                "url": "xxx.com"
            }
        ],
        "failedInfos": [
            {
                "url": "xxx.com",
                "failReason": "不支持的文档类型"
            }
        ]
    },
  "code": 200,
  "message": "请求成功",
  "timestamp": 1689649504996
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

### 3.5.7 Re-Embedding

Used to re-embed documents (e.g., retries): Synchronous return of success indicates a successful call; upon completion of embedding, the `callback_url` is called for notification, or the knowledge details interface can be used to retrieve results; commonly used in URL knowledge scenarios.

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /document/embedding/{id} |
| Invocation Method | Synchronous call |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | POST |

#### Interface Path Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| id | string | Yes | Knowledge ID |

#### Interface Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| callback\_url | string | No | Callback URL |
| callback\_header | object | No | k-v, headers carried during callback |

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/document/embedding/1734888894421270528' \
--header 'accept: */*' \
--header 'Authorization: xxx' \
--header 'Content-Type: application/json' \
--header 'Cookie: acw_tc=2760775717141318326143045e072d4e274ca6e89c364b3c3179e2f6cd54df' \
--data '{}'
```

1  
2  
3  
4  
5  
6

#### Interface Response Parameters

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |

##### Response Example

```
{
  "code": 200,
  "message": "请求成功",
  "timestamp": 1689649504996
}
```

1  
2  
3  
4  
5  
6

### 3.5.8 Retrieve Image List from File Parsing

Used to obtain the mapping relationship between image sequence numbers and image links parsed from a file

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /document/slice/image\_list/{id} |
| Invocation Method | Synchronous call |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | POST |

#### Interface Path Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| id | string | Yes | Knowledge ID |

##### Request Example

```
curl -X POST "https://open.bigmodel.cn/api/llm-application/open/document/slice/image_list/213" -H "accept: */*"
```

1

#### Interface Response Parameters

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| images | list<image> | Image List |

#### image

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| text | string | Image Sequence Number |
| cos\_url | string | Image URL |

##### Response Example

```
{
    "data": {
        "images": [
            {
                "text": "【示意图序号_1829473032620613632_103】",
                "cos_url": "https://cdn.bigmodel.cn/knowledge_pdf_image/de7163a7-c67f-4e33-8810-97a6d5a83378.png"
            }
        ]
    },
    "code": 200,
    "message": "请求成功",
    "timestamp": 1725070689634
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

## 3.6 Application

> Create a dedicated application that can reference a self-built knowledge base to improve question-answering accuracy

### 3.6.1 Create Application

Used to create personal applications

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request Address | /application |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | POST |

#### Interface Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| name | string | Yes | Application Name, 1-20 characters |
| desc | string | Yes | Application Description, 0-100 characters |
| prompt | string | No | Template, format as “`{{knowledge}}xxx{{user}}`”, must include knowledge and user, with exactly one placeholder `{{knowledge}}` and one placeholder `{{user}}` |
| top\_p | string | No | Default 0.7, an alternative method to temperature sampling, known as nucleus sampling Value range: `(0.0, 1.0)` open interval, cannot be 0 or 1, default value is 0.7 The model considers results with `top_p` probability mass tokens For example: 0.1 means the model decoder only considers tokens from the top 10% probability candidate set It is recommended to adjust the `top_p` or `temperature` parameter based on the application scenario, but do not adjust both parameters simultaneously |
| temperature | string | No | Default 0.95, sampling temperature, controls the randomness of the output, must be a positive number Value range: `(0.0,1.0]`, cannot be 0, default value is 0.95 The larger the value, the more random and creative the output; the smaller the value, the more stable or deterministic the output It is recommended to adjust the `top_p` or `temperature` parameter based on the application scenario, but do not adjust both parameters simultaneously |
| knowledge\_ids | list<long> | Yes | Knowledge Base ID List |
| model | enum | No | Value range (common): ‘GLM-4-Plus’,‘GLM-4-Flash’,‘GLM-4-0520’,‘GLM-4-0520’,‘GLM-4-Long’,‘GLM-4-AirX’,‘GLM-4-Air’,‘GLM-4’,‘GLM-3-Turbo’,‘GLM-4-9B’,‘emohaa’,‘GLM-4-FlashX’,‘ChatGLM\_pro’ Default: ChatGLM\_pro |
| icon\_color | enum | No | Value range: ‘blue’, ‘red’, ‘orange’, ‘purple’, ‘sky’, ‘green’, ‘yellow’ Default: ‘blue’ |
| icon\_type | enum | No | Value range: ‘robot\_assist’ (Robot Assistant), ‘robot\_navigate’ (Robot Navigator), ‘robot\_guardian’ (Robot Guardian), ‘robot\_service’ (Robot Service), ‘robot\_messenger’ (Robot Messenger), ‘robot\_chat’ (Robot Chat), ‘robot\_engineer’ (Robot Engineer) Default: ‘robot\_assist’ |
| knowledge\_info | Knowledge | No | Knowledge Base Information |
| param\_desc | enum | No | Response Style Value Range: Default value: custom； |
| max\_token | Integer | No | Maximum Model Output Token: 1~8192 Default value: 1024 |

Knowledge:

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| slice\_config\_type | enum | No | Slice Type Value Range: |
| recall\_method | String | Yes | Recall Method Value Range: |
| rerank\_status | Integer | Yes | 0: rerank (disabled), 1: rerank (enabled)； |
| slice\_count | Integer | Yes | Slice Count must be greater than ‘0’ |
| rerank\_model\_name | String | No | Model Name |
| embedding\_recall\_ratio | Integer | No | Vectorized Retrieval Ratio |
| show\_recall\_result | Boolean | No | Whether to Display Recall Results |
| rerank\_index\_type\_list | List<IndexType> | No | Rerank Index Configuration Type List |
| recall\_index\_type\_list | List<IndexType> | No | Recall Index Configuration Type List |
| recall\_slice\_splicing\_method | String | No | Recall Slice Splicing Method |

IndexType:

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| knowledge\_id | String | No | Knowledge Base ID |
| index\_type\_id | Integer | No | Index Configuration Type ID |

##### Request Example

```
curl --location --request POST 'https://open.bigmodel.cn/api/llm-application/open/application' \
--header 'authorization: xxx' \
--header 'Cookie: sensorsdata2015jssdkchannel=%7B%22prop%22%3A%7B%22_sa_channel_landing_url%22%3A%22%22%7D%7D; bigmodel_token_staging=eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX3R5cGUiOiJQRVJTT05BTCIsInVzZXJfaWQiOjIyMzI0OTIzLCJ1c2VyX2tleSI6IjA1ZjU2NDZmLTJjN2QtNDI1Yy1iMWRmLTNhYjc0ODY5YzI0ZiIsImN1c3RvbWVyX2lkIjoiNTg4ODE3MjU4NTM3MjM1OTciLCJ1c2VybmFtZSI6IumbqOi3r-WFieWGmyJ9.HhysP7JjgPhMOuJ7VHVJVDz3yN_luTb6cvSoq1-rrbwnBRtm4BU0jFl_63_6WS3URjCPVLHp3iN1mrQyNw3Hvg; Hm_lvt_a1b1a5545a8f11fdd72d54f10971c4ea=1730962828; HMACCOUNT=3A047E4E775771C1; Hm_lpvt_a1b1a5545a8f11fdd72d54f10971c4ea=1730962865; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2258881725853723597%22%2C%22first_id%22%3A%2219300b64ef9350-0282006be0d103a-1f525636-2073600-19300b64efacf8%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTkzMDBiNjRlZjkzNTAtMDI4MjAwNmJlMGQxMDNhLTFmNTI1NjM2LTIwNzM2MDAtMTkzMDBiNjRlZmFjZjgiLCIkaWRlbnRpdHlfbG9naW5faWQiOiI1ODg4MTcyNTg1MzcyMzU5NyJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%2258881725853723597%22%7D%7D' \
--header 'content-type: application/json;charset=UTF-8' \
--data-raw '{
    "name": "11111130",
    "desc": "11111130",
    "prompt": "从文档\n\"\"\"\n{{知识}}\n\"\"\"\n中找问题\n\"\"\"\n{{用户}}\n\"\"\"\n的答案，找到答案就仅使用文档语句回答问题，找不到答案就用自身知识回答并且告诉用户该信息不是来自文档。\n\n不要复述问题，直接开始回答。",
    "temperature": 0.01,
    "top_p": 0.1,
    "knowledge_ids": [
        1855805746403495936
    ],
    "param_desc": "flexible",
    "max_token": 1024,
    "knowledge_info": {
        "model": "glm-4-plus",
        "knowledge_ids": [
            "1855805746403495936"
        ],
        "slice_config_type": "customized",
        "recall_method": "embedding",
        "recall_index_type_list": [
            {
                "knowledge_id": "1855805746403495936",
                "index_type_id": "0"
            }
        ],
        "slice_count": 8,
        "rerank_status": 0,
        "rerank_model_name": "",
        "show_recall_result": true,
        "recall_slice_splicing_method": "{{切片内容}}"
    }
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

#### Interface Response Parameters

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| id | string | Generated Unique Application ID |

##### Response Example

```
{
    "data": "1855818262969999360",
    "code": 200,
    "message": "请求成功",
    "timestamp": 1731296527991
}
```

1  
2  
3  
4  
5  
6

### 3.6.2 Edit Application

Used for editing personal applications

#### Interface Request

| Transmission Method | HTTPS |
| --- | --- |
| Request URL | /application/{id} |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | PUT |

#### Path Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | Yes | Application ID |

#### Interface Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| name | string | No | Application Name |
| desc | string | No | Application Description |
| prompt | string | No | Template, format as “`{{knowledge}}xxx{{user}}`”, must include knowledge and user, and the placeholder `{{knowledge}}` must be unique, and the placeholder `{{user}}` must be unique |
| top\_p | string | No | Default 0.7, an alternative method to temperature sampling, known as nucleus sampling Value range: `(0.0, 1.0)` open interval, cannot be equal to 0 or 1, default value is 0.7 The model considers results with `top_p` probability mass tokens For example: 0.1 means the model decoder only considers tokens from the top 10% probability candidate set It is recommended to adjust the `top_p` or `temperature` parameter according to the application scenario, but do not adjust both parameters at the same time |
| temperature | string | No | Default 0.95, sampling temperature, controls the randomness of the output, must be a positive number Value range: `(0.0,1.0]`, cannot be equal to 0, default value is 0.95 The larger the value, the more random and creative the output will be; the smaller the value, the more stable or deterministic the output will be It is recommended to adjust the `top_p` or `temperature` parameter according to the application scenario, but do not adjust both parameters at the same time |
| knowledge\_ids | list<long> | No | Knowledge base ID list |
| model | enum | No | Value range (commonly used): ‘GLM-4-Plus’,‘GLM-4-Flash’,‘GLM-4-0520’,‘GLM-4-0520’,‘GLM-4-Long’,‘GLM-4-AirX’,‘GLM-4-Air’,‘GLM-4’,‘GLM-3-Turbo’,‘GLM-4-9B’,‘emohaa’,‘GLM-4-FlashX’,‘ChatGLM\_pro’ |
| icon\_color | enum | No | Value range: ‘blue’, ‘red’, ‘orange’, ‘purple’, ‘sky’, ‘green’, ‘yellow’ |
| icon\_type | enum | No | Value range: ‘robot\_assist’ (Robot Assistant), ‘robot\_navigate’ (Robot Navigator), ‘robot\_guardian’ (Robot Guardian), ‘robot\_service’ (Robot Service), ‘robot\_messenger’ (Robot Messenger), ‘robot\_chat’ (Robot Chat), ‘robot\_engineer’ (Robot Engineer) |
| knowledge\_info | Knowledge | No | Knowledge base information |
| param\_desc | enum | No | Response style value range: ‘strict’ (Rigorous), ‘moderate’ (Moderate), ‘flexible’ (Divergent), ‘custom’ (Custom); |
| max\_token | Integer | No | Maximum model output token: 1~8192 |

#### Knowledge

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| slice\_config\_type | enum | No | Slice type value range: |
| recall\_method | String | Yes | Recall method value range: |
| rerank\_status | Integer | Yes | 0: rerank (disabled), 1: rerank (enabled); |
| slice\_count | Integer | Yes | Slice count must be greater than ‘0’ |
| rerank\_model\_name | String | No | Model name |
| embedding\_recall\_ratio | Integer | No | Vectorized retrieval ratio |
| show\_recall\_result | Boolean | No | Whether to display recall results |
| rerank\_index\_type\_list | List<IndexType> | No | Rerank index configuration type list |
| recall\_index\_type\_list | List<IndexType> | No | Recall index configuration type list |
| recall\_slice\_splicing\_method | String | No | Recall slice splicing method |

#### IndexType

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| knowledge\_id | String | No | Knowledge base ID |
| index\_type\_id | Integer | No | Index type ID |

##### Request Example

```
curl --location --request PUT 'https://open.bigmodel.cn/api/llm-application/open/application/1855818262969999360' \
--header 'accept: */*' \
--header 'Authorization: xxx' \
--header 'Content-Type: application/json' \
--data '{
    "name": "11111134",
    "desc": "11111134",
    "prompt": "从文档\n\"\"\"\n{{知识}}\n\"\"\"\n中找问题\n\"\"\"\n{{用户}}\n\"\"\"\n的答案，找到答案就仅使用文档语句回答问题，找不到答案就用自身知识回答并且告诉用户该信息不是来自文档。\n\n不要复述问题，直接开始回答。",
    "temperature": 0.01,
    "top_p": 0.1,
    "knowledge_ids": [
        1855805746403495936
    ],
    "param_desc": "flexible",
    "max_token": 1024,
    "knowledge_info": {
        "model": "glm-4-plus",
        "knowledge_ids": [
            "1855805746403495936"
        ],
        "slice_config_type": "customized",
        "recall_method": "embedding",
        "recall_index_type_list": [
            {
                "knowledge_id": "1855805746403495936",
                "index_type_id": "0"
            }
        ],
        "slice_count": 8,
        "rerank_status": 0,
        "rerank_model_name": "",
        "show_recall_result": true,
        "recall_slice_splicing_method": "{{切片内容}}"
    }
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

#### Interface Response Parameters

##### Response Example

```
{
  "code": 200,
  "message": "请求成功",
  "timestamp": 1689649504996
}
```

1  
2  
3  
4  
5

### 3.6.3 Application List

#### Interface Request

| Transmission Method | HTTPS |
| --- | --- |
| Request URL | /application |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | GET |

#### Interface Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| page | int | No | Page, default is 1 |
| size | int | No | Number of items per page, default is 20 |

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/application' \
--header 'accept: */*' \
--header 'Authorization: xxx'
```

1  
2  
3

#### Interface Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| list | list<applicationData> | Application list |
| total | int | Total number of applications |

Refer to applicationData

##### Response Example

```
{
    "data": {
        "list": [
            {
                "id": "121212121212",
                "name": "高考填报指南",
                "desc": "高考填报指南",
                "model": "chatglm130b",
                "slice_count": 2,
                "knowledge_ids":[1,2],
                "prompt": "以下是知识库内容：\n{{知识}}\n\n请根据知识库中内容回答，如果不知道答案，直接说不知道，不要乱回答\n{{用户}}",
                "top_p": "0.2",
                "temperature": "0.3"
            },
        ],
        "total": 1
    },
    "code": 200,
    "message": "请求成功",
    "timestamp": 1689665168772
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

### 3.6.4 Application View

#### Interface Request

| Transmission Method | HTTPS |
| --- | --- |
| Request URL | /application/{id} |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | GET |

#### Interface Path Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | Yes | Application ID |

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/application/1711282458583887873' \
--header 'accept: */*' \
--header 'Authorization: xxx'
```

1  
2  
3

#### Interface Response Parameters

Refer to applicationData

##### Response Example

```
{
    "data": {
        "id": "121212121212",
        "name": "高考填报指南",
        "desc": "高考填报指南",
        "model": "chatglm130b",
        "slice_count": 2,
        "knowledge_ids":[1,2],
        "prompt": "以下是知识库内容：\n{{知识}}\n\n请根据知识库中内容回答，如果不知道答案，直接说不知道，不要乱回答\n{{用户}}",
        "top_p": "0.2",
        "temperature": "0.3"
    },
    "code": 200,
    "message": "请求成功",
    "timestamp": 1689665168772
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

### 3.6.5 Delete Application

Used for deleting applications

#### Interface Request

| Transmission Method | HTTPS |
| --- | --- |
| Request URL | /application/{id} |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | DELETE |

#### Interface Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
|  |  |  |  |

##### Request Example

```
curl --location --request DELETE 'https://open.bigmodel.cn/api/llm-application/open/application/1699710846501031936' \
--header 'accept: */*' \
--header 'Authorization: xxx'
```

1  
2  
3

#### Interface Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
|  |  |  |

##### Response Example

```
{
  "code": 200,
  "message": "请求成功",
  "timestamp": 1689649504996
}
```

1  
2  
3  
4  
5  
6

## 3.7 Invoke Application

> Use the created application to call the large model

### 3.7.1 HTTP Synchronous Interface

| Transmission Method | HTTPS |
| --- | --- |
| Request URL |  |
| Invocation Method | Synchronous return result |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | POST |

#### Path Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | Yes | Application ID |

#### Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| request\_id | string | No | Unique request ID |
| incremental | bool | No | Whether to return incrementally |
| prompt | list | Yes |  |
| returnType | String | No | Used to control the type of content returned each time, defaults to `json_string` if empty or not present - `json_string` returns a standard JSON string - `text` returns raw text content |
| knowledge\_ids | list<long> | No | Knowledge base ID list: If not provided, all knowledge bases associated with the application will be used |
| document\_ids | list<long> | No | Knowledge ID list: If not provided, all knowledge bases associated with the application will be used |

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/model-api/1712773365310599168/invoke' \
--header 'accept: */*' \
--header 'Authorization: xxx' \
--header 'Content-Type: application/json' \
--data '{
  "prompt": [
    {
      "role": "user",
      "content": "今天吃什么"
    }
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

#### Interface Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| requestId | string | Request ID |
| content | String | Response content |
| token | TokenResp | Token information |

#### TokenResp

| Parameter Name | Type | Description |
| --- | --- | --- |
| usage | UsageResp | Token details |

#### UsageResp

| Parameter Name | Type | Description |
| --- | --- | --- |
| prompt\_tokens | Integer | Number of input tokens from user |
| completion\_tokens | Integer | Number of input tokens from model |
| total\_tokens | Integer | Total number of tokens |

##### Response Example

```
{
    "data": {
        "requestId": "1697192365237-497892",
        "content": "回答的内容"
        "usage": {"completion_tokens":521,"prompt_tokens":5,"total_tokens":526}
    },
    "code": 200,
    "message": "请求成功",
    "timestamp": 1697192371071
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

### 3.7.2 HTTPSSE Interface

#### Interface Request

| Transmission Method | HTTPS |
| --- | --- |
| Request URL | /model-api/{id}/sse-invoke |
| Invocation Method | SSE |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | Standard Event Stream |
| Request Type | POST |
| Request Header | accept:text/event-stream |

#### Path Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | Yes | Application ID |

#### Interface Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| request\_id | string | No | Unique request ID |
| incremental | bool | No | Whether to return incrementally |
| prompt | list | Yes |  |
| returnType | String | No | Used to control the type of content returned each time, defaults to `json_string` if empty or not present - `json_string` returns a standard JSON string - `text` returns raw text content |
| knowledge\_ids | list<long> | No | Knowledge base ID list: If not provided, all knowledge bases associated with the application will be used |
| document\_ids | list<long> | No | Knowledge ID list: If not provided, all knowledge bases associated with the application will be used |

#### Single-turn Dialogue Prompt Parameter Example

Only the prompt for the current question needs to be passed in each call.

```
[
  {
    "role": "user",
    "content": "今天吃什么"
  }
]
```

1  
2  
3  
4  
5  
6

#### Multi-turn Dialogue Prompt Parameter Example

1. Each call must include the history of the conversation, supporting up to 15 turns.
2. The list must contain an odd number of elements.

```
[
    {
        "role":"user",
        "content":"如何办理会员"
    },
    {
        "role":"assistant",
        "content":"进入app点击办理会员即可"
    },
    {
        "role":"user",
        "content":"会员费用多少"
    },
    {
        "role":"assistant",
        "content":"会员费用是10元每月"
    },
    {
        "role":"user",
        "content":"有季度会员吗"
    }
]
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

Processed prompt for the request model:

Assuming the knowledge segments include: App membership, subscription guidelines, download, registration, and login, etc., and the membership subscription rules are as follows: 10 RMB/month, 29 RMB/quarter, 100 RMB/year, etc.

```
[
    {
        "role":"user",
        "content": "从文档\"\"\" \n 某app会员, 办理须知, 下载注册登陆等等, 会员办理规则 10元/月 29元/季度, 100元/年等等 \n \"\"\" \n 中找出问题 \n \"\"\" \n 如何办理会员 \n \"\"\" \n 的答案进行回答，找不到回答:\"抱歉这个问题我无法回答。\" , 不要复述问题，直接开始回答。"
    },
    {
        "role":"assistant",
        "content":"进入app点击办理会员即可"
    },
    {
        "role":"user",
        "content":"会员费用多少"
    },
    {
        "role":"assistant",
        "content":"会员费用是10元每月"
    },
    {
        "role":"user",
        "content":"有季度会员吗"
    }
]
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

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/model-api/1712773365310599168/sse-invoke' \
--header 'accept: */*' \
--header 'Authorization: xxx' \
--header 'Content-Type: application/json' \
--data '{
  "prompt": [
    {
      "role": "user",
      "content": "今天吃什么"
    }
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

#### Interface Response Parameters

The SSE response is in the format of a string stream. Let’s first look at a specific response example.

```
id: "fb981fde-0080-4933-b87b-4a29eaba8d17"
event: "add"
data: "作为一个"

id: "fb981fde-0080-4933-b87b-4a29eaba8d17"
event: "add"
data: "大型语言模型"

id: "fb981fde-0080-4933-b87b-4a29eaba8d17"
event: "add"
data: "我可以"

... ...

Id: "fb981fde-0080-4933-b87b-4a29eaba8d17"
event: "finish"
data: "我可以"
usage: {"completion_tokens":521,"prompt_tokens":5,"total_tokens":526}
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

```
id: 消息唯一标识
event: 消息类型，add 增量，finish 结束，errorhandle 错误，interrupted 中断
data: 具体内容
usage: {"completion_tokens":521,"prompt_tokens":5,"total_tokens":526}
```

1  
2  
3  
4

| Parameter Name | Type | Description |
| --- | --- | --- |
| prompt\_tokens | Integer | Number of input tokens from user |
| completion\_tokens | Integer | Number of input tokens from model |
| total\_tokens | Integer | Total number of tokens |

## 3.8 Retrieve Recall Slice Information for a Conversation

Used to obtain the slice location information matched by the application dialogue call.

Currently, only PDF and Excel formats are supported for displaying slice location information.

#### Interface Request

| Transmission Method | HTTPS |
| --- | --- |
| Request URL | /v2/{request\_id}/slice\_info |
| Invocation Method | Synchronous Call |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | GET |

#### Path Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| request\_id | string | Yes | Unique ID returned by the application dialogue interface |

#### Interface Request Parameters

#### Interface Return Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| document\_slices | list<DocumentSlices> | Knowledge slice information |
| has\_old\_document | boolean | Whether there are historical documents without slice location information true: Documents with `hide\_positions` as true can be re-vectorized false: No need to pay attention |
| images | List<Image> | Image list |

#### DocumentSlices

| Parameter Name | Type | Description |
| --- | --- | --- |
| document | Document | Knowledge information |
| slice\_info | List<Slice> | Slice information |
| hide\_positions | boolean | Whether historical document slices lack location information; true: Re-vectorization is required to obtain location information, see Re-vectorization Interface; false: No need to pay attention |

#### Image

| Parameter Name | Type | Description |
| --- | --- | --- |
| text | string | Image name |
| cos\_url | string | Image URL |

#### Document

| Parameter Name | Type | Description |
| --- | --- | --- |
| id | string | Unique knowledge ID |
| name | string | Knowledge name |
| url | string | Knowledge URL |
| dtype | int | Knowledge type, see unified structure |

#### Slice

| Parameter Name | Type | Description |
| --- | --- | --- |
| document\_id | string | Unique knowledge ID |
| position | Position | PDF slice location information |
| line | int | Sheet row number |
| sheet\_name | string | Sheet name |
| text | string | Slice content |

**Note:** PDF knowledge uses `position` for location information; Excel uses `line` and `sheet\_name` for location information.

#### Position

| Parameter Name | Type | Description |
| --- | --- | --- |
| x0 | decimal | Distance from the left side to the left side of the row |
| x1 | decimal | Distance from the top of the character to the top |
| top | decimal | Distance from the top of the character to the top |
| bottom | decimal | Distance from the bottom of the character to the top |
| page | int | Page number |
| height | decimal | Page height |
| width | decimal | Page width |

##### Example

```
{
    "data":{
        "document_slices":[
            {
                "document":{
                    "id":"171128203689965971",
                    "name":"xx.pdf",
                    "url":"https://cdn.bigmodel.cn/knowledge_test/xx.pdf",
                    "dtype":3
                },
                "slice_info":[
                    {
                        "document_id":"171128203689965971",
                        "position":{
                            "x0":90,
                            "x1":267.46999999999997,
                            "top":293.293,
                            "bottom":303.24300000000005,
                            "page":6,
                            "height":841.9,
                            "width":595.3
                        },
                        "text":"你好你好你好你好你好你好你好你好你好你好"
                    }
                ],
                "hide_positions":false,
                "images":[{"text":"图片名称", "cos_url":"地址"}]
            },
            {
                "document":{
                    "id":"171128203689965971",
                    "name":"xx.docx",
                    "url":"https://cdn.bigmodel.cn/knowledge_test/xx.docx",
                    "dtype":6
                },
                "slice_info":[
                    {
                        "document_id":"171128203689965971",
                        "line":1,
                        "sheet_name":"sheet1",
                        "text":"你好你好你好你好你好你好你好你好你好你好"
                    }
                ],
                "hide_positions":false
            }
        ],
        "has_old_document":false
    },
    "code":200,
    "message":"请求成功",
    "timestamp":1697438393502
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
48  
49  
50  
51  
52

## 3.9 Callback Related

### 3.9.1 Customer Callback Implementation

The customer-side callback interface needs to meet the following requirements:

#### Interface Request

| Transmission Method | HTTPS |
| --- | --- |
| Request URL | Customer Callback URL |
| Invocation Method | Synchronous call, wait for return result, 2s timeout |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | POST |

#### Interface Input Parameters

| **Parameter Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| eventId | string | Yes | Event type: `knowledge_construction` for knowledge construction status event |
| event | jsonObject | Yes | Event details |

#### event

| **Parameter Name** | **Type** | **Description** |  |
| --- | --- | --- | --- |
| status | int | Vectorization result | 0: In process, 1: Success, 2: Failure |
| msg | string | Description | Success/Failure, etc. |
| documentId | string | Document ID |  |

#### Interface Response

Used to confirm whether the callback has been successfully processed and to establish retry rules

| **Parameter Name** | **Type** | **Description** |  |
| --- | --- | --- | --- |
| code | int | Callback status | 200 indicates success, other codes indicate failure |
| message | string | Description | Success/Failure, etc. |

#### Response Example

```
{
  "code": 200,
  "message": "请求成功"
}
```

1  
2  
3  
4

### 3.9.2 Set Callback Address

Used to edit the callback address.

#### Interface Request

| Transmission Method | HTTPS |
| --- | --- |
| Request URL | /callback |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | PUT |

#### Interface Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| url | string | Yes | Callback address |
| callback\_header | object | No | Key-value pairs, headers carried during callback |

#### Interface Response Parameters

##### Response Example

```
{
  "code": 200,
  "message": "请求成功",
  "timestamp": 1689649504996
}
```

1  
2  
3  
4  
5  
6

### 3.9.3 Callback Details

Retrieve the personal configuration callback address.

#### Interface Request

| Transmission Method | HTTPS |
| --- | --- |
| Request URL | /callback |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Request Format | PATH |
| Response Format | JSON |
| Request Type | GET |

#### Interface Response Parameters Reference

| Parameter Name | Type | Description |
| --- | --- | --- |
| url | string | Callback address |
| callback\_header | object | Key-value pairs, headers carried during callback |
| be\_in\_use | int | 1: Callback in use, 0: Callback not in use |

##### Response Example

```
{
    "data": {
        "url": "",
        "callback_header":{
                "xxx":"xxx"
            },
        "be_in_use": 1, // 1:正在使用回调 0:没有使用回调
    },
    "code": 200,
    "message": "请求成功",
    "timestamp": 1702440707110
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

### 3.9.4 Delete Callback Configuration

Used to cancel the callback address configuration.

#### Interface Request

| Transmission Method | HTTPS |
| --- | --- |
| Request URL | /callback |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | DELETE |

#### Interface Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
|  |  |  |  |

#### Interface Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
|  |  |  |

Table of contents

3.1 Unified JSON Return Format

3.2 Unified Basic Structure

3.2.1 embeddingData Model Information

3.2.2 knowledgeData Knowledge Base Data

3.2.3 uploadDetail Upload Details

3.2.4 documentData Knowledge Data

3.2.5 Application Data

3.2.6 Vectorization Status

3.2.7 Vectorization Failure Status Codes

3.2.8 Knowledge Types

3.3 Vector Related

3.3.1 Vector Model List

3.4 Knowledge Base

3.4.1 Create Knowledge Base

3.4.2 Edit Knowledge Base

3.4.3 Knowledge Base List

3.4.4 Knowledge Base Details

3.4.5 Delete Knowledge Base

3.4.6 Knowledge Base Usage Details

3.5 Knowledge

3.5.1 Upload Document to Build Knowledge

3.5.2 Edit Knowledge

3.5.3 Knowledge Document List

3.5.4 Knowledge Details

3.5.5 Delete Knowledge

3.5.6 Upload URL to Build Knowledge

3.5.7 Re-Embedding

3.5.8 Retrieve Image List from File Parsing

3.6 Application

3.6.1 Create Application

3.6.2 Edit Application

3.6.3 Application List

3.6.4 Application View

3.6.5 Delete Application

3.7 Invoke Application

3.7.1 HTTP Synchronous Interface

3.7.2 HTTPSSE Interface

3.8 Retrieve Recall Slice Information for a Conversation

3.9 Callback Related

3.9.1 Customer Callback Implementation

3.9.2 Set Callback Address

3.9.3 Callback Details

3.9.4 Delete Callback Configuration