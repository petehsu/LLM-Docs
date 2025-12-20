[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2FAgent_Platform%2Fagent)

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

# Intelligent Agent Development Platform API

# 1. Service Address

> Service root URL: https://open.bigmodel.cn/api/llm-application/open

# 2. Authentication Method

> Detailed introduction and examples of HTTP authentication::https://open.bigmodel.cn/dev/api/http-call/http-auth

## 2.1 Authenticate Using API Key

```
curl --location --request POST 'https://open.bigmodel.cn/api/llm-application/open/v2/application/{app_id}/conversation' \
--header 'Authorization: Bearer <你的apikey>' \
--header 'Content-Type: application/json'
```

1  
2  
3  
4

## 2.2 Authenticate Using Auth Token The current platform’s authentication token is generated by the client. The auth token is created using the standard JWT (JSON Web Token) method（for details, refer to: <https://jwt.io/introduction>）

# 3. HTTP Request

## 3.1 Get Intelligent Agent (Application) Input Parameters

#### API Request

| Transmission Method | https |
| --- | --- |
| Request URL | /v2/application/{app\_id}/variables |
| Invocation Method | Synchronous call, waiting for the result |
| Character Encoding | UTF-8 |
| Request Format | PATH |
| Response Format | JSON |
| Request Type | GET |

#### Interface Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| app\_id | string | Yes | Intelligent agent (application) ID; location: My Intelligent Agents list page |

##### Request Example

```
curl -X GET "https://open.bigmodel.cn/api/llm-application/open/v2/application/1798627097909080064/variables" -H "accept: */*" -H "Authorization: Bearer <你的apikey>"
```

1

#### API Response Parameters

data: List<KeyValuePair>

KeyValuePair Fields:

| Parameter Name | Type | Description |
| --- | --- | --- |
| id | string | Parameter ID |
| name | string | Parameter name |
| type | string | Parameter typeInput: Text input selection\_list: Dropdown list upload\_file: File upload upload\_image: Image upload upload\_video: Video upload input\_template: Input template |
| tips | string | Prompt |
| input\_template | InputTemplate | Input template, available when type = input\_template |
| allow\_values | List<string> | Dropdown options, available when type = selection\_list |

InputTemplate

| Parameter Name | Type | Description |
| --- | --- | --- |
| options | List<KeyValuePair> | Parameter list |
| splicing\_template | string | Input template |

##### Response Example

```
{
    "data": [
        {
            "id": "17168644381937541201",
            "type": "input",
            "name": "用户提问"
        },
        {
            "id": "1716864438193754501",
            "type": "input_template",
            "name": "输入模版",
            "input_template": {
                "options": [
                    {
                        "id": "1716864438193754501",
                        "type": "input",
                        "name": "用户问题"
                    }

                ],
                "splicing_template": "组变量:{{组变量}}"
            }
        }
    ],
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
28

## 3.2 File Upload

> For text - based agents with file upload components, use this interface.

#### Request

| Transfer Mode | https |
| --- | --- |
| Request URL | /v2/application/file\_upload |
| Invocation Method | Synchronous return of upload success, get parsing result via file status interface |
| Character Encoding | UTF-8 |
| Request Format | multipart/form-data |
| Response Format | JSON |
| Request Type | POST |

#### Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| app\_id | string | Yes | Agent ID |
| upload\_unit\_id | string | No | For creation-type requests, this parameter is mandatory; for conversation-type temporary file uploads, this parameter is not required. It can be obtained from the update\_all API response of the intelligent agent’s page using JSONPath.；jsonpath：$.node\_list[0].input\_data.creation\_option[?(@.type == ‘upload\_file’)].id |
| files | File Array | Yes | Supported file formats: pdf,docx,doc,.xlsx,txt |
| conversation\_id | Long | No | When uploading temporary files for conversation-type requests, you must first create a new session and assign the session ID to this parameter (mandatory for conversation-type uploads; not required for creation-type requests). |
| file\_type | Integer | No | file\_type=1 Excel，file\_type=2 Document ， file\_type = 3 Audio |

##### Request Example

Creation-Type Upload

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/v2/application/file_upload' \
--header 'Authorization: Bearer <你的apikey>' \
--form 'app_id="1791378613740900352"' \
--form 'upload_unit_id="1721632525680249608"' \
--form 'files=@"/Users/Downloads/xxx.pdf"'
```

1  
2  
3  
4  
5

Conversation-Type Temporary File Upload

```
curl --location --request POST 'https://open.bigmodel.cn/api//llm-application/open/v2/application/file_upload' \
--header 'Authorization: Bearer <你的apikey>' \
--form 'app_id="1866015867339526144"' \
--form 'files=@"/Users/kimmy/Downloads/教育学的教学方法.docx"' \
--form 'conversation_id="1866682332635897856"' \
--form 'file_type="2"'
```

1  
2  
3  
4  
5  
6

#### Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| success\_info | list<T> | Successful uploads |
| fail\_info | list<R> | Failed uploads |

T:

| Parameter Name | Type | Description |
| --- | --- | --- |
| file\_id | string | File ID |
| file\_name | string | File name |

R:

| Parameter Name | Type | Description |
| --- | --- | --- |
| file\_name | string | File name |
| fail\_reason | string | Failure reason |

##### Request Example

```
{
    "data": {
        "success_info": [
            {
                "file_id": "1815286446093897728",
                "file_name": "xxx.pdf"
            }
        ],
        "fail_info": [
            {
                "file_name": "xxx.xlsx",
                "fail_reason": "不支持的文档类型"
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

## 3.3 Get File Parsing Status

> After uploading a file to the text-based intelligent agent (application), call this interface to obtain the file parsing results.

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request URL | /v2/application/file\_stat |
| Call Method | Synchronous call, wait for return results |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | POST |

#### Interface Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| app\_id | string | Yes | Intelligent agent (application) ID |
| file\_ids | list<string> | Yes | List of file IDs |

##### Request Example

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/v2/application/file_stat' \
--header 'Authorization: Bearer <你的apikey>' \
--header 'Content-Type: application/json' \
--data '{
    "app_id": "1791378613740900352",
    "file_ids": [
        "1815286446093897728"
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

#### Interface Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| file\_id | string | File ID |
| code | int | Document parsing status——0: Processing; 1: Success; 11000: Document does not exist; 11001: No text parsed; 11002: Knowledge unavailable, file encrypted or corrupted; 11003: Maximum character limit is 50,000; 11009: File ID does not exist |
| msg | string | Description |

##### Response Example

```
{
    "data": [
        {
            "file_id": "1815286446093897728",
            "code": 0,
            "msg": "成功"
        }
    ],
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

## 3.4 Create New Session

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request URL | /v2/application/{app\_id}/conversation |
| Call Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Request Format | PATH |
| Response Format | JSON |
| Request Type | POST |

#### Interface Path Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| app\_id | string | Yes | Intelligent agent (application) ID |

##### Request Example

```
curl --location --request POST 'https://open.bigmodel.cn/api/llm-application/open/v2/application/1791378613740900352/conversation' \
--header 'Authorization: Bearer <你的apikey>'
```

1  
2

#### Interface Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| conversation\_id | string | Session ID |

##### Response Example

```
{
  "data": {
    "conversation_id": "123121"
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

## 3.5 Create Dialogue or Text Request

**Only incremental mode is supported**

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request URL | /v2/application/generate\_request\_id |
| Call Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | POST |

#### Interface Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| app\_id | string | Yes | Intelligent agent (application) ID |
| conversation\_id | string | Yes | Session ID |
| document\_ids | List<string> | No | For Q&A intelligent agents (applications): Used for knowledge filtering, if not passed, the default configuration of the intelligent agent (application) is used |
| knowledge\_ids | List<string> | No | For Q&A intelligent agents (applications): Used for knowledge filtering, if not passed, the default configuration of the intelligent agent (application) is used |
| key\_value\_pairs | List<KeyValuePair> | Yes | Input parameters |

KeyValuePair

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | Yes | Component ID (variable ID in the return parameters of interface 3.1) |
| name | string | Yes | Component name |
| type | string | Yes | Component type Input: Text input selection\_list: Dropdown box upload\_file: File upload upload\_image: Image upload upload\_video: Video upload input\_template: Input template |
| value | string | No | Required when the component value type is Input or selection\_list |
| files | List<string> | No | When the component type is upload\_file, it represents the text file ID; when the component type is upload\_image, it represents the image URL; when the component type is upload\_video, it represents the video URL; |
| ivfiles | List<IVFile> | No | Image or video list, valid for dialogue intelligent agents (applications) |
| input\_templates | List<InputTemplate> | No | List of input template groups, at least one group, up to 10 groups, list maximum 10 |

IVFile

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| type | int | Yes | 1: Image 2: Video |
| url | string | Yes | Image or video URL |

InputTemplate

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| options | List<KeyValuePair> | Yes | List of variables in the input template |
| splicing\_template | string | Yes | Input template |

##### Text Request Example

###### General Example (Non-multimodal)

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/v2/application/generate_request_id' \
--header 'accept: */*' \
--header 'Authorization: Bearer <你的apikey>' \
--header 'Content-Type: application/json' \
--data '{
    "app_id": "1795285588048564224",
    "conversation_id": "29539",
    "key_value_pairs": [
        {
            "id": "1717573423871286673",
            "type": "input_template",
            "name": "输入模版",
            "input_templates": [
                {
                    "options": [
                        {
                            "id": "1717573423871754759",
                            "type": "input",
                            "name": "变量一",
                            "value": "变量一的值"
                        },
                        {
                            "id": "1717573490077738478",
                            "type": "input",
                            "name": "变量二",
                            "value": "变量二的值"
                        },
                        {
                            "id": "1717573520205563704",
                            "type": "upload_file",
                            "name": "上传文件二",
                            "files": [
                                "1798264910346702848"
                            ]
                        }
                    ]
                },
                {
                    "options": [
                        {
                            "id": "1717573423871754759",
                            "type": "input",
                            "name": "变量一",
                            "value": "变量一的值"
                        },
                        {
                            "id": "1717573490077738478",
                            "type": "input",
                            "name": "变量二",
                            "value": "变量二的值"
                        },
                        {
                            "id": "1717573520205563704",
                            "type": "upload_file",
                            "name": "上传文件二",
                            "files": [
                                "1798264910346702848"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "1717573400789920478",
            "type": "upload_file",
            "name": "上传文件",
            "files": [
                "1798296235480858624"
            ]
        },
        {
            "id": "1717573981843972472",
            "type": "selection_list",
            "name": "输入问题",
            "value": "随机输出一个问题"
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
53  
54  
55  
56  
57  
58  
59  
60  
61  
62  
63  
64  
65  
66  
67  
68  
69  
70  
71  
72  
73  
74  
75  
76  
77  
78  
79

###### Multimodal Request Example (Image/Video)

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/v2/application/generate_request_id' \
--header 'accept: */*' \
--header 'Authorization: Bearer <你的apikey>' \
--header 'Content-Type: application/json' \
--data '{
    "app_id": "1832382067447615488",
    "conversation_id": "1832657028347228160",
    "key_value_pairs": [
        {
            "id": "1725708921173231122",
            "type": "input",
            "name": "用户",
            "value": "图片内容是什么"
        },
        {
            "id": "1725708931123522623",
            "type": "upload_image",
            "name": "图片",
            "files": [
                "https://cdn.bigmodel.cn/image/E2A4C01982504545BA68ACB29B36F886.jpeg",
                "https://cdn.bigmodel.cn/image/E2A4C01982504545BA68ACB29B36F887.jpeg"
            ]
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

##### Dialogue-based Intelligent Agent (Application) Request Example

Note: All parameters for dialogue-based interactions are the same.

###### Standard Example (Non-Multimodal)

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/v2/application/generate_request_id' \
--header 'accept: */*' \
--header 'Authorization: Bearer <你的apikey>' \
--header 'Content-Type: application/json' \
--data '{
    "app_id": "1808684265458843648",
    "conversation_id": "424319",
    "key_value_pairs": [
        {
            "id": "user",
            "type": "input",
            "name": "用户提问",
            "value": "你叫什么名字"
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
14  
15  
16

###### Multimodal Request Example (Image/Video)

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/v2/application/generate_request_id' \
--header 'accept: */*' \
--header 'Authorization: Bearer <你的apikey>' \
--header 'Content-Type: application/json' \
--data '{
    "app_id": "1832379565041954816",
    "conversation_id": "1832656170683363328",
    "key_value_pairs": [
        {
            "id": "user",
            "ivfiles": [
                {
                    "type": 1,
                    "url": "https://cdn.bigmodel.cn/image/8179C36FD0844628A53770A9E86AE997.jpeg"
                }
            ],
            "name": "用户",
            "type": "input",
            "value": "图片内容是什么"
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
14  
15  
16  
17  
18  
19  
20  
21  
22

#### Interface Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| id | string | Unique ID used to call the interface for retrieving dialogue or text results |

##### Response Example

```
{
  "data": {
    "id": "123121"
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

## 3.6 Retrieve Dialogue or Text Results

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request URL | /v2/model-api/{id}/sse-invoke |
| Invocation Method | SSE |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | Standard Event Stream |
| Request Type | POST |
| Request Headers | accept:text/event-stream |

#### Path Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | Yes | The ID returned by the interface for creating dialogue or text requests |

##### Request Example

```
curl --location --request POST 'https://open.bigmodel.cn/api/llm-application/open/v2/model-api/{id}/sse-invoke' \
--header 'Authorization: Bearer <你的apikey>'
```

1  
2

#### Interface Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| event | string | Event type: add, finish, errorhandle |
| id | string | Request ID |
| data | DataJson | Response data |

**DataJson**

| Parameter Name | Type | Description |
| --- | --- | --- |
| msg | string | Model response message (allTools file information) |
| extra\_input | ExtraInput | Node execution log: such as triggered agent tool actions, node transitions, etc. |
| usage | Usage | Token consumption, present when event is finish or errorhandle |
| type | String | text: Text content, Image: Image generation model, video: Video generation model, execution\_output: allTools model file |
| url | String | Video/Image URL (present for image/video generation models) |
| cover\_url | String | Video cover URL (present for video generation models) |
| status | String | PROCESSING/SUCCESS/ERROR (present for image/video generation models) |
| node\_id | String | Present for video generation models |

**ExtraInput**

| Parameter Name | Type | Description |
| --- | --- | --- |
| request\_id | string | Request ID |
| node\_id | string | Node ID |
| push\_type | string | Log push type: node: node-level log, block: block-level log within a node |
| node\_data | NodeData | Node-level log data: node start, completion logs |
| block\_data | BlockData | Block-level log data within a node: node exceptions, actions, knowledge base queries, etc. |

**NodeData**

| Parameter Name | Type | Description |
| --- | --- | --- |
| node\_type | int | Node type |
| node\_id | string | Node ID |
| node\_name | string | Node name |
| node\_status | string | Node status: processing: in progress, finished: completed, warning: warning issued and continued, conversation: in conversation, error: exception |
| node\_dur | string | Node duration in seconds, one decimal place |
| node\_log\_list | List<ExtraInput> | List of event logs within the current node |

**BlockData**

| Parameter Name | Type | Description |
| --- | --- | --- |
| input | string | Current node input data (for allTools model, code content is as follows: “{\“msg\”:\”.pyplot\“,\“type\”:\“code\”,\“recipient\”:\“python\”}”) |
| block\_status | string | Block status: auth: authorization required, processing: in progress, finished: completed, error: exception |
| block\_type | string | Block log type: input: node input log, action: called plugin, output: node output log |
| out\_put | OutPut | Node output |
| error\_msg | string | Exception message: present when block log type is error |
| block\_dur | string | Total block duration in seconds, one decimal place |

**OutPut**

| Parameter Name | Type | Description |
| --- | --- | --- |
| function\_exec\_time | string | Function execution time in seconds, one decimal place |
| model\_exec\_time | string | Model execution time in seconds, one decimal place |
| out\_content | string | Output content |

**Usage**

| Parameter Name | Type | Description |
| --- | --- | --- |
| completion\_tokens | int | Output tokens consumed |
| prompt\_tokens | int | Input tokens consumed |
| total\_tokens | int | Total tokens consumed |

##### Response Example

```
event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"extra_input":{"request_id":"396FW4Q-DaHWNb4k_l7Yb","node_id":"1795285588048564225","push_type":"node","node_data":{"node_type":4,"node_name":"097a428a905247edb77f9efadbf68e25","node_status":"processing","node_id":"1795285588048564225","node_dur":"0","node_log_list":[]},"block_data":{"id2_req":{}}}}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"extra_input":{"request_id":"396FW4Q-DaHWNb4k_l7Yb","node_id":"1795285588048564225","push_type":"node","node_data":{"node_type":4,"node_name":"097a428a905247edb77f9efadbf68e25","node_status":"finished","node_id":"1795285588048564225","node_dur":"0.1","node_log_list":[]},"block_data":{"id2_req":{}}}}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"extra_input":{"request_id":"396FW4Q-DaHWNb4k_l7Yb","node_id":"1716864417441963831","push_type":"node","node_data":{"node_type":1,"node_name":"LLM","node_status":"processing","node_id":"1716864417441963831","node_dur":"0","node_log_list":[]},"block_data":{"id2_req":{}}}}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"当然"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"可以"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"。"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"不过"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"，"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"请您"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"先"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"提供"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"一些"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"内容"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"，"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"这样"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"我"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"才能"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"根据"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"这些"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"内容"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"回答"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"您"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"的问题"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"msg":"。"}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"extra_input":{"request_id":"396FW4Q-DaHWNb4k_l7Yb","push_type":"block","block_data":{"input":"根据内容, 回答随机输出一个问题","block_status":"finished","block_type":"input"}}}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"extra_input":{"request_id":"396FW4Q-DaHWNb4k_l7Yb","push_type":"block","block_data":{"block_status":"finished","block_type":"output","out_put":{"out_content":"当然可以。不过，请您先提供一些内容，这样我才能根据这些内容回答您的问题。"},"block_dur":"4.0"}}}

event:add
id:396FW4Q-DaHWNb4k_l7Yb
data:{"extra_input":{"request_id":"396FW4Q-DaHWNb4k_l7Yb","node_id":"1716864417441963831","push_type":"node","node_data":{"node_type":1,"node_name":"LLM","node_status":"finished","node_id":"1716864417441963831","node_dur":"4.1","node_log_list":[{"request_id":"396FW4Q-DaHWNb4k_l7Yb","push_type":"block","block_data":{"input":"根据内容, 回答随机输出一个问题","block_status":"finished","block_type":"input"}},{"request_id":"396FW4Q-DaHWNb4k_l7Yb","push_type":"block","block_data":{"block_status":"finished","block_type":"output","out_put":{"out_content":"当然可以。不过，请您先提供一些内容，这样我才能根据这些内容回答您的问题。"},"block_dur":"4.0"}}]},"block_data":{"id2_req":{}}}}

event:finish
id:396FW4Q-DaHWNb4k_l7Yb
data:
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
53  
54  
55  
56  
57  
58  
59  
60  
61  
62  
63  
64  
65  
66  
67  
68  
69  
70  
71  
72  
73  
74  
75  
76  
77  
78  
79  
80  
81  
82  
83  
84  
85  
86  
87  
88  
89  
90  
91  
92  
93  
94  
95  
96  
97  
98  
99  
100  
101  
102  
103  
104  
105  
106  
107  
108  
109  
110  
111  
112  
113

#### Text-to-Image Response Example

```
event:add
id:C7R_4S8h0zsIK271Ir84z
data:{"extra_input":{"request_id":"C7R_4S8h0zsIK271Ir84z","node_id":"1848299969262596097","push_type":"node","node_data":{"node_type":4,"node_name":"097a428a905247edb77f9efadbf68e25","node_status":"processing","node_id":"1848299969262596097","node_dur":"0","node_log_list":[]},"block_data":{"id2_req":{}}}}

event:add
id:C7R_4S8h0zsIK271Ir84z
data:{"extra_input":{"request_id":"C7R_4S8h0zsIK271Ir84z","node_id":"1848299969262596097","push_type":"node","node_data":{"node_type":4,"node_name":"097a428a905247edb77f9efadbf68e25","node_status":"finished","node_id":"1848299969262596097","node_dur":"0.1","node_log_list":[{"request_id":"C7R_4S8h0zsIK271Ir84z","push_type":"block","block_data":{"input":"一只狗","block_status":"finished","block_type":"input","timestamp":1736735830537,"id2_req":{}}}]},"block_data":{"id2_req":{}}}}

event:add
id:C7R_4S8h0zsIK271Ir84z
data:{"extra_input":{"request_id":"C7R_4S8h0zsIK271Ir84z","node_id":"1729504062874627101","push_type":"node","node_data":{"node_type":1,"node_name":"LLM","node_status":"processing","node_id":"1729504062874627101","node_dur":"0","node_log_list":[]},"block_data":{"id2_req":{}}}}

event:add
id:C7R_4S8h0zsIK271Ir84z
data:{"extra_input":{"request_id":"C7R_4S8h0zsIK271Ir84z","node_id":"1729504062874627101","push_type":"block","block_data":{"input":"{\"name\":\"文生图\",\"key\":\"文生图\",\"funType\":\"4\"}","block_status":"processing","block_type":"action","id2_req":{}}}}

event:add
id:C7R_4S8h0zsIK271Ir84z
data:{"msg":"","type":"image","url":"https://aigc-files.bigmodel.cn/api/cogview/202501131037104a646117cdcf4f2a_0.png","status":"SUCCESS"}

event:add
id:C7R_4S8h0zsIK271Ir84z
data:{"extra_input":{"request_id":"C7R_4S8h0zsIK271Ir84z","node_id":"1729504062874627101","push_type":"block","block_data":{"input":"{\"name\":\"文生图\",\"key\":\"文生图\",\"funType\":\"4\"}","block_status":"finished","block_type":"action","out_put":{"out_content":"{\"request\":\"question: \\\"一只狗\\\"\",\"response\":\"https://aigc-files.bigmodel.cn/api/cogview/202501131037104a646117cdcf4f2a_0.png\",\"recipient\":\"\"}","id2_rst":{}},"id2_req":{}}}}

event:add
id:C7R_4S8h0zsIK271Ir84z
data:{"extra_input":{"request_id":"C7R_4S8h0zsIK271Ir84z","push_type":"block","block_data":{"block_status":"finished","block_type":"output","out_put":{"out_content":"https://aigc-files.bigmodel.cn/api/cogview/202501131037104a646117cdcf4f2a_0.png"},"block_dur":"8.3"}}}

event:add
id:C7R_4S8h0zsIK271Ir84z
data:{"extra_input":{"request_id":"C7R_4S8h0zsIK271Ir84z","node_id":"1729504062874627101","push_type":"node","node_data":{"node_type":1,"node_name":"LLM","node_status":"finished","node_id":"1729504062874627101","node_dur":"8.3","node_log_list":[{"request_id":"C7R_4S8h0zsIK271Ir84z","push_type":"block","block_data":{"input":"一只狗","block_status":"finished","block_type":"input","timestamp":1736735830579,"id2_req":{}}},{"request_id":"C7R_4S8h0zsIK271Ir84z","push_type":"block","block_data":{"input":"一只狗","block_status":"finished","block_type":"input","timestamp":1736735830582,"id2_req":{}}},{"request_id":"C7R_4S8h0zsIK271Ir84z","node_id":"1729504062874627101","push_type":"block","block_data":{"input":"{\"name\":\"文生图\",\"key\":\"文生图\",\"funType\":\"4\"}","block_status":"processing","block_type":"action","id2_req":{}}},{"request_id":"C7R_4S8h0zsIK271Ir84z","node_id":"1729504062874627101","push_type":"block","block_data":{"input":"{\"name\":\"文生图\",\"key\":\"文生图\",\"funType\":\"4\"}","block_status":"finished","block_type":"action","out_put":{"out_content":"{\"request\":\"question: \\\"一只狗\\\"\",\"response\":\"https://aigc-files.bigmodel.cn/api/cogview/202501131037104a646117cdcf4f2a_0.png\",\"recipient\":\"\"}","id2_rst":{}},"id2_req":{}}},{"request_id":"C7R_4S8h0zsIK271Ir84z","push_type":"block","block_data":{"block_status":"finished","block_type":"output","out_put":{"out_content":"https://aigc-files.bigmodel.cn/api/cogview/202501131037104a646117cdcf4f2a_0.png","id2_rst":{}},"block_dur":"8.3","id2_req":{}}}]},"block_data":{"id2_req":{}}}}

event:finish
id:C7R_4S8h0zsIK271Ir84z
data:{"msg":"","usage":{"prompt_tokens":0,"completion_tokens":0,"total_tokens":0}}
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

#### Video Generation Response Example

```
event:add
id:C-FFaLkDja9ZcFKjqshEW
data:{"extra_input":{"request_id":"C-FFaLkDja9ZcFKjqshEW","node_id":"1838551923675058177","push_type":"node","node_data":{"node_type":4,"node_name":"097a428a905247edb77f9efadbf68e25","node_status":"processing","node_id":"1838551923675058177","node_dur":"0","node_log_list":[]},"block_data":{"id2_req":{}}}}

event:add
id:C-FFaLkDja9ZcFKjqshEW
data:{"extra_input":{"request_id":"C-FFaLkDja9ZcFKjqshEW","node_id":"1838551923675058177","push_type":"node","node_data":{"node_type":4,"node_name":"097a428a905247edb77f9efadbf68e25","node_status":"finished","node_id":"1838551923675058177","node_dur":"0.1","node_log_list":[{"request_id":"C-FFaLkDja9ZcFKjqshEW","push_type":"block","block_data":{"input":"一只狗","block_status":"finished","block_type":"input","timestamp":1736736177264,"id2_req":{}}}]},"block_data":{"id2_req":{}}}}

event:add
id:C-FFaLkDja9ZcFKjqshEW
data:{"extra_input":{"request_id":"C-FFaLkDja9ZcFKjqshEW","node_id":"1727322585001172311","push_type":"node","node_data":{"node_type":1,"node_name":"LLM","node_status":"processing","node_id":"1727322585001172311","node_dur":"0","node_log_list":[]},"block_data":{"id2_req":{}}}}

event:add
id:C-FFaLkDja9ZcFKjqshEW
data:{"msg":"","type":"video","url":"","cover_url":"","status":"PROCESSING","node_id":1727322585001172311}

event:add
id:C-FFaLkDja9ZcFKjqshEW
data:{"msg":"","type":"video","url":"https://aigc-files.bigmodel.cn/api/cogvideo/18f185d2-d158-11ef-858e-224f297da9a7_0.mp4","cover_url":"https://aigc-files.bigmodel.cn/api/cogvideo/18f185d2-d158-11ef-858e-224f297da9a7_cover_0.jpeg","status":"SUCCESS","node_id":1727322585001172311}

event:add
id:C-FFaLkDja9ZcFKjqshEW
data:{"extra_input":{"request_id":"C-FFaLkDja9ZcFKjqshEW","push_type":"block","block_data":{"block_status":"finished","block_type":"output","out_put":{"out_content":"[\n  \"SUCCESS\",\n  [\n    {\n      \"url\": \"https://aigc-files.bigmodel.cn/api/cogvideo/18f185d2-d158-11ef-858e-224f297da9a7_0.mp4\",\n      \"cover_image_url\": \"https://aigc-files.bigmodel.cn/api/cogvideo/18f185d2-d158-11ef-858e-224f297da9a7_cover_0.jpeg\"\n    }\n  ]\n]"},"block_dur":"63.2"}}}

event:add
id:C-FFaLkDja9ZcFKjqshEW
data:{"extra_input":{"request_id":"C-FFaLkDja9ZcFKjqshEW","node_id":"1727322585001172311","push_type":"node","node_data":{"node_type":1,"node_name":"LLM","node_status":"finished","node_id":"1727322585001172311","node_dur":"63.3","node_log_list":[{"request_id":"C-FFaLkDja9ZcFKjqshEW","push_type":"block","block_data":{"input":"\n生成内容：一只狗","block_status":"finished","block_type":"input","timestamp":1736736177365,"id2_req":{}}},{"request_id":"C-FFaLkDja9ZcFKjqshEW","node_id":"1727322585001172311","block_data":{"block_status":"processing","id2_req":{}}},{"request_id":"C-FFaLkDja9ZcFKjqshEW","node_id":"1727322585001172311","block_data":{"block_status":"processing","id2_req":{}}},{"request_id":"C-FFaLkDja9ZcFKjqshEW","push_type":"block","block_data":{"block_status":"finished","block_type":"output","out_put":{"out_content":"[\n  \"SUCCESS\",\n  [\n    {\n      \"url\": \"https://aigc-files.bigmodel.cn/api/cogvideo/18f185d2-d158-11ef-858e-224f297da9a7_0.mp4\",\n      \"cover_image_url\": \"https://aigc-files.bigmodel.cn/api/cogvideo/18f185d2-d158-11ef-858e-224f297da9a7_cover_0.jpeg\"\n    }\n  ]\n]","id2_rst":{}},"block_dur":"63.2","id2_req":{}}}]},"block_data":{"id2_req":{}}}}

event:finish
id:C-FFaLkDja9ZcFKjqshEW
data:{"msg":"","usage":{"prompt_tokens":0,"completion_tokens":0,"total_tokens":0}}
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

#### allTools Response Example

## 3.7 Knowledge Base Slice Reference Location Information

Used to obtain the slice location information matched by the dialogue with the intelligent agent (application).

Currently, only PDF and Excel are supported for displaying slice location information.

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request URL | /v2/application/slice\_info |
| Invocation Method | Synchronous call, wait for return results |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | POST |

#### Interface Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| request\_id | string | Yes | The ID returned by the interface for creating dialogue or text requests |
| node\_id | string | Yes | Node ID |

#### Interface Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| document\_slices | list<DocumentSlices> | Knowledge slice information |
| has\_old\_document | boolean | Whether there are historical documents without slice location information; true: documents with hide\_positions as true can be re-vectorized; false: no need to pay attention |
| images | List | List of images |

**DocumentSlices:**

| Parameter Name | Type | Description |
| --- | --- | --- |
| document | Document | Knowledge information |
| slice\_info | List<Slice> | Slice information |
| hide\_positions | boolean | Whether historical document slices lack location information; true: re-vectorization is needed to obtain location information, see Re-vectorization Interface; false: no need to pay attention |

**Image:**

| Parameter Name | Type | Description |
| --- | --- | --- |
| text | string | Image name |
| cos\_url | string | Image URL |

**Document:**

| Parameter Name | Type | Description |
| --- | --- | --- |
| id | string | Unique knowledge ID |
| name | string | Knowledge name |
| url | string | Knowledge URL |
| dtype | int | Knowledge type, see Unified Structure |

**Slice:**

| Parameter Name | Type | Description |
| --- | --- | --- |
| document\_id | string | Unique knowledge ID |
| position | Position | PDF slice location information |
| line | int | Sheet row number |
| sheet\_name | string | Sheet name |
| text | string | Slice content |

Note: PDF knowledge uses position location information; Excel uses line and sheet\_name location information.

**Position:**

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
                        "text":"你好【示意图序号_xxxx】你好你好你好你好你好你好你好你好你好"
                    }
                ],
                "hide_positions":false,
                "images":[{"text":"【示意图序号_xxxx】", "cos_url":"地址"}]
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

## 3.8 Recommended Questions

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request URL | /open/history\_session\_record/{app\_id}/{conversation\_id} |
| Invocation Method | Synchronous call, wait for return results |
| Character Encoding | UTF-8 |
| Request Format | PATH |
| Response Format | JSON |
| Request Type | GET |

#### Interface Path Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| app\_id | String | Yes | Application ID |
| conversation\_id | String | Yes | Conversation ID |

##### Request Example

```
curl --location --request GET 'https://open.bigmodel.cn/api//llm-application/open/history_session_record/1866015867339526144/92452' \
--header 'Authorization: Bearer <你的apikey>'
```

1  
2

#### Interface Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| problems | Object | List of recommended questions |

##### Response Example

```
{
    "data": {
        "problems": [
            "这些教学方法在实际教学中如何具体应用？",
            "有没有关于这些教学方法的成功案例分享？",
            "如何根据不同学生的特点选择合适的教学方法？"
        ]
    },
    "code": 200,
    "message": "请求成功",
    "timestamp": 1733800641097
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

# 4. Intelligent Agent (Application) Dialogue Process Steps

1. Use the interface [Create a New Session](https://zhipu-ai.feishu.cn/wiki/M9KNwFbnMiyyfXkD3TTcZiy7nZw#PEcMdcaojoFpvgxW3unchpB7n3c)

   1. If the parameter list includes file upload variables, you need to call the 3.2 interface to upload knowledge files.
   2. After uploading the file, call the 3.3 interface to get the file parsing status, and determine if the file has been parsed. Only after the parsing is complete can you proceed with the subsequent process.
2. Use the 3.5 interface [Create a Dialogue Request](https://zhipu-ai.feishu.cn/wiki/M9KNwFbnMiyyfXkD3TTcZiy7nZw#GMiBdu6EYouKbPx1JDsc75cAnGf)  to create a dialogue request based on the intelligent agent (application) & session.

   1. The dialogue parameters are consistent, and you can directly construct the call according to the [example](https://zhipu-ai.feishu.cn/wiki/M9KNwFbnMiyyfXkD3TTcZiy7nZw#QizZdpWSWolOzrxXdcVco8C5n7d)  without needing to use the 3.1 interface to get the parameter list.
   2. The call parameters for each text-based intelligent agent (application) are related to the agent (application) and need to be obtained using the 3.1 interface [Get Intelligent Agent (Application) Input Parameters](https://zhipu-ai.feishu.cn/wiki/M9KNwFbnMiyyfXkD3TTcZiy7nZw#WUlNd48tQoUtp0xwCNGcPDINnte) .
3. Use the 3.6 interface [Retrieve Dialogue or Text Results](https://zhipu-ai.feishu.cn/wiki/M9KNwFbnMiyyfXkD3TTcZiy7nZw#RrCydIT82oUI2GxKmgLcOqzInob)  to stream the results.

**Note:**

Session - Used to manage chat context, only the latest user input needs to be provided for each dialogue.

Table of contents

2.1 Authenticate Using API Key

2.2 Authenticate Using Auth Token
The current platform’s authentication token is generated by the client. The auth token is created using the standard JWT (JSON Web Token) method（for details, refer to: https://jwt.io/introduction）

3.1 Get Intelligent Agent (Application) Input Parameters

3.2 File Upload

3.3 Get File Parsing Status

3.4 Create New Session

3.5 Create Dialogue or Text Request

3.6 Retrieve Dialogue or Text Results

3.7 Knowledge Base Slice Reference Location Information

3.8 Recommended Questions