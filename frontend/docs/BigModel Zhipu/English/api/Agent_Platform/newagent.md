[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2FAgent_Platform%2Fnewagent)

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

# Non-Streaming [API Integration] Agent Interface Support

## 1. Service Address

> Root Path of Service Address: https://open.bigmodel.cn/api/llm-application/open

## 2. Authentication Method

> Detailed explanation and example of HTTP authentication: https://open.bigmodel.cn/dev/api/http-call/http-auth

### 2.1 Authentication Using API Key

```
curl --location --request POST 'https://open.bigmodel.cn/api/llm-application/open/v2/application/{app_id}/conversation' \
--header 'Authorization: Bearer <你的apikey>' \
--header 'Content-Type: application/json'
```

1  
2  
3  
4

### 2.2 Authentication Using Authorization Token

The current platform authorization token is generated by the user side. The generation of the authorization token uses the creation method provided in the standard JWT (for detailed reference: <https://jwt.io/introduction>).

---

# 3. HTTP Requests

## 3.1 Retrieve Input Parameters for Agent (Application)

#### Interface Request

| Transmission Method | HTTPS |
| --- | --- |
| Request URL | /v2/application/{app\_id}/variables |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Request Format | PATH |
| Response Format | JSON |
| Request Type | GET |

#### Interface Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| app\_id | string | Yes | Agent (Application) ID: Obtain from the “My Agents” list page |

##### Request Example

```
curl -X GET "https://open.bigmodel.cn/api/llm-application/open/v2/application/1798627097909080064/variables" -H "accept: */*" -H "Authorization: Bearer <你的apikey>"
```

1

#### Interface Response Parameters

`data`: List<KeyValuePair>

**KeyValuePair Detailed Fields:**

| Parameter Name | Type | Description |
| --- | --- | --- |
| id | string | Variable ID |
| name | string | Variable Name |
| type | string | Variable Type Input: Text Input selection\_list: Dropdown List upload\_file: File Upload upload\_image: Image Upload (Image Limit: Each image must be under 5MB in size and not exceed 6000\*6000 pixels. Supported formats: jpg, png, jpeg.) upload\_video: Video Upload (Video Limit: Video size must be within 20MB and duration must not exceed 30 seconds. Supported video types: mp4.) upload\_audio: Audio Upload |
| tips | string | Prompt Word |
| allow\_values | List<string> | Dropdown options, present when `type = selection\_list` |

##### Response Example

```
{
    "data": [
        {
            "id": "1737528844760777790",
            "type": "input",
            "name": "用户输入",
            "tips": "",
            "allowed_values": [],
            "input_template": {
                "options": []
            }
        },
        {
            "id": "1736994966033888703",
            "type": "upload_audio",
            "name": "音频",
            "tips": "",
            "allowed_values": [],
            "input_template": {
                "options": []
            }
        },
        {
            "id": "1737528754381717495",
            "type": "upload_file",
            "name": "文件",
            "tips": "",
            "allowed_values": [],
            "input_template": {
                "options": []
            }
        },
        {
            "id": "1737528765211104338",
            "type": "upload_image",
            "name": "图片",
            "tips": "",
            "allowed_values": [],
            "input_template": {
                "options": []
            }
        },
        {
            "id": "1737528778264408584",
            "type": "upload_video",
            "name": "视频",
            "tips": "",
            "allowed_values": [],
            "input_template": {
                "options": []
            }
        },
        {
            "id": "1737528785258146224",
            "type": "selection_list",
            "name": "类型",
            "tips": "",
            "allowed_values": [
                "类型1",
                "类型2"
            ],
            "input_template": {
                "options": []
            }
        }
    ],
    "code": 200,
    "message": "请求成功",
    "timestamp": 1737528881255
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

## 3.2 File Upload

> For text-based agents (applications) with a file upload component in the input parameters, this interface is required.

#### Interface Request

| Transmission Method | HTTPS |
| --- | --- |
| Request URL | /v2/application/file\_upload |
| Invocation Method | Synchronous return of upload success, requires requesting the file parsing status interface to obtain parsing results |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | POST |

#### Interface Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| app\_id | string | Yes | Agent (Application) ID |
| upload\_unit\_id | string | No | (Required for text-based, not for dialogue temporary file uploads) Upload file component ID: Use the agent parameter interface from 3.1 to query and return the parameter variable ID |
| files | File Array | Yes | Text-based file upload: Dialogue temporary file upload: (Requires `conversation\_id` and `file\_type` to be uploaded together): |
| conversation\_id | Long | No | When uploading temporary files for dialogue-type applications, a new session must first be created through 3.4, and the session ID must be assigned to this parameter (Required for dialogue-type temporary file uploads, not for text-based) |
| file\_type | Integer | No | 1: Excel, 2: Document, 3: Audio |

##### Request Example

For text-based uploads:

```
curl --location --request POST 'https://open.bigmodel.cn/api//llm-application/open/v2/application/file_upload' \
--header 'Authorization: Bearer <你的apikey>' \
--form 'app_id="1879719151359188992"' \
--form 'files=@"/Users/kimmy/Downloads/audio.wav"' \
--form 'upload_unit_id="1737528754381717495"' \
--form 'file_type="3"'
```

1  
2  
3  
4  
5  
6

对话类上传临时文件

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

#### Interface Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| success\_info | list<T> | Successfully uploaded files |
| fail\_info | list<R> | Failed uploads |

**T:**

| Parameter Name | Type | Description |
| --- | --- | --- |
| file\_id | string | File ID |
| file\_name | string | File Name |

**R:**

| Parameter Name | Type | Description |
| --- | --- | --- |
| file\_name | string | File Name |
| fail\_reason | string | Failure Reason |

##### Response Example

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

## 3.3 Retrieve File Parsing Status

> After uploading files for text-based agents (applications), use this interface to obtain file parsing results.

#### Interface Request

| Transmission Method | HTTPS |
| --- | --- |
| Request URL | /v2/application/file\_stat |
| Invocation Method | Synchronous call, wait for return result |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | POST |

#### Interface Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| app\_id | string | Yes | Agent (Application) ID |
| file\_ids | list<string> | Yes | List of File IDs |

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
| code | int | Document Parsing Status 0: Processing 1: Success 11000: Document Does Not Exist 11001: No Text Parsed 11002: Knowledge Unavailable, File Encrypted or Corrupted 11003: Maximum Character Limit is 50,000 11009: File ID Does Not Exist |
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
13

## 3.4 Create New Session

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request URL | /v2/application/{app\_id}/conversation |
| Call Method | Synchronous Call, Wait for Return Result |
| Character Encoding | UTF-8 |
| Interface Request Format | PATH |
| Response Format | JSON |
| Interface Request Type | POST |

#### Interface Path Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| app\_id | string | Yes | Intelligent Agent (Application) ID |

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
9

## 3.5 Create Dialogue or Text Application Inference Interface V3

### Interface Request

| Transmission Method | https |
| --- | --- |
| Request URL | /v3/application/invoke |
| Call Method | Synchronous Call, Wait for Return Result or SSE Call |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON or Standard Stream Event |
| Interface Request Type | POST |

### Input Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| app\_id | String | Yes | Application ID |
| conversation\_id | String | No | Session ID, a new session is created by default if not provided (same functionality as 3.4 interface) |
| third\_request\_id | String | No | Third-party Request ID (passed when calling plugins, used for troubleshooting) |
| stream | Boolean | No | Default true, synchronous call when false |
| messages | List<Object> | Yes | User Input List |
| role | String | No | Required for dialogue application requests: user (user input), assistant (model return) |
| content | List<Object> | Yes | Specific Content |
| type | String | Yes | input: Textupload\_file: Fileupload\_image: Imageupload\_video: Videoselection\_list: Dropdown List of Options |
| value | String | Yes | User Input or Dropdown Option or File ID/Image Video URL concatenated with ,(English comma) |
| key | String | No | Field Name (required for text application requests) |
| document\_ids | List<string> | No | Applicable to Q&A applications: used for knowledge filtering, default application configuration is used if not provided |
| knowledge\_ids | List<string> | No | Applicable to Q&A applications: used for knowledge filtering, default application configuration is used if not provided |
| send\_log\_event | boolean | No | Whether to push process logs in real-time, primarily based on application configuration, default is false (do not push) |

##### Request Example

##### Text Input:

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/v3/application/invoke' \
--header 'Authorization: <你的APIkey>' \
--header 'Content-Type: application/json' \
--data '{
    "app_id": "1848309397651148800",
    "stream": true,
    "send_log_event": false,
    "messages": [
        {
             "role": "user",
            "content": [
                {
                    "key": "query",
                    "value": "文中讲了",
                    "type": "input"
                },
                {
                    "type": "upload_file",
                    "value": "1877326548760145920",
                    "key": "文件"
                }
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

##### Dialogue Input:

```
curl --location 'https://open.bigmodel.cn/api/llm-application/open/v3/application/invoke' \
--header 'Authorization: <你的APIkey>' \
--header 'Content-Type: application/json' \
--data '{
    "app_id": 1855923672330727424,
    "conversation_id":"1882000954497335296",
    "stream": false,
    "send_log_event": true,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "value": "文中说了什么",
                    "type": "input"
                }
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

### Response

[DONE] indicates the end of the response

#### Response Parameters

| Name | Type | Description |
| --- | --- | --- |
| req\_id | string | Request ID |
| conversation\_id | String | Session ID |
| app\_id | String | Intelligent Agent (Application) ID |
| choices | List | Incremental return information |
| index | Integer | Result index |
| finish\_reason | String | stop: Normal enderror: Returned when execution fails, reason for model inference termination |
| delta | Object | Current session output message body Message |
| content | MessageData | Model push message |
| event | object | Orchestration node execution process log event |
| node\_id | String | Node ID |
| node\_name | String | Node name |
| type | String | type = node\_processing, model input content to contenttype = tool\_processing,tool\_finish, tool input and output content to tool\_callstype = node\_finish, model output text content to content |
| content | MessageData | Input/Output |
| time | integer | Milliseconds |
| tool\_calls | Object | Tool message body |
| messages | Object | Synchronous call result |
| content | MessageData | Synchronous result |
| event | List<Object> | Orchestration node execution process log event |
| type | String | type = node\_processing, model input content to contenttype = tool\_processing,tool\_finish, tool input and output content to tool\_callstype = node\_finish, model output text content to content |
| content | String | Model output text content |
| time | integer | Milliseconds |
| tool\_calls | toolCallsData | Tool message body |
| usage | List<OpenUsageData> | Token count statistics for this call. Returned at the end |
| model | String | Inference model |
| node\_name | String | Node name |
| input\_token\_count | Integer | Number of input tokens |
| output\_token\_count | Integer | Number of output tokens |
| total\_token\_count | Integer | Total number of tokens |
| error\_msg | ErrorCodeEnum | Exception information, format: {“code”: error code, “message”: error message} |

#### Message Body (MessageData):

| msg | Object | Inference Content |
| --- | --- | --- |
| type | String | text, image, video, all\_tools; when type = text, msg is a string; for other types, see the following explanation |

AllToolsMsg: Message body for type all\_tools

| code | String | Code |
| --- | --- | --- |
| file | String | File URL |
| text | String | Inference content |

VideoOrImageMsg: Message body for type image or video

| url | String | Generated video URL/generated image URL |
| --- | --- | --- |
| coverUrl | String | Video cover URL |

##### Inference Text

```
{
    "type":"text",
    "msg":"你好，我能帮助....."
}
```

1  
2  
3  
4

#### Log Tool Information: toolCallsData

##### Function Call Log: FunToolCallsData (only present in the event when the agent uses plugins)

| Name | Type | Description |
| --- | --- | --- |
| action\_key | String | Name of the function called by the model. |
| params | String | Call parameters |
| output | String | Return content of the API request, JSON string |

###### Example of Function Call Result

```
{
    "event": [
        {
            "node_id": "1733728098607963012",
            "node_name": "Agent_001",
            "type": "node_processing",
            "content": "北京市海淀区到长沙市芙蓉区的快递费",
            "time": 1737536175165
        },
        {
            "node_id": "1733728098607963012",
            "node_name": "Agent_001",
            "type": "tool_processing",
            "tool_calls": {
                "type": "function",
                "tool_calls_data": {
                    "action_key": "查询快递运费_691",
                    "params": "{\"origin_address\": \"北京市海淀区\", \"dest_address\": \"长沙市芙蓉区\", \"weight\": \"1\", \"time\": \"2023-04-14 10:00:00\"}"
                }
            },
            "time": 1737536176446
        },
        {
            "node_id": "1733728098607963012",
            "node_name": "Agent_001",
            "type": "tool_finish",
            "tool_calls": {
                "type": "function",
                "tool_calls_data": {
                    "action_key": "查询快递运费_691",
                    "params": "{\"origin_address\": \"北京市海淀区\", \"dest_address\": \"长沙市芙蓉区\", \"weight\": \"1\", \"time\": \"2023-04-14 10:00:00\"}",
                    "output": "{\"showapi_res_error\":\"\",\"showapi_res_code\":0,\"showapi_res_body\":{\"result\":[{\"com\":\"yunda\",\"list\":[{\"time\":\"\",\"currencyName\":\"人民币\",\"weight\":1,\"price\":13.0,\"weightUnit\":\"kg\",\"freightName\":\"\"}]},{\"com\":\"shentong\",\"list\":[{\"time\":\"\",\"currencyName\":\"人民币\",\"weight\":1,\"price\":8,\"weightUnit\":\"kg\",\"freightName\":\"\"}]}],\"ret_code\":0,\"msg\":\"查询成功\"}}"
                }
            }
        },
        {
            "node_id": "1733728098607963012",
            "node_name": "Agent_001",
            "type": "node_finish",
            "content": "根据查询结果，从北京市海淀区到长沙市芙蓉区的快递费用如下：- 韵达快递：13元人民币（1公斤）\n- 申通快递：8元人民币（1公斤）请注意，这些价格是基于1公斤的重量计算的，如果您的包裹重量不同，费用可能会有所变化。同时，实际费用可能会因为快递公司的具体收费标准、优惠活动或其他因素而有所不同，建议在寄送前向快递公司确认具体费用。",
            "time": 1737536181963
        }
    ]
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

##### Knowledge Base Query Log: KnowToolCallsData

| Name | Type | Description |
| --- | --- | --- |
| input | String | Search Keyword |
| slice\_info | String | Slice Content |

###### Example of Knowledge Base Query Result

```
{
    "event": [
        {
            "node_id": "1737534740182364809",
            "node_name": "LLM_001",
            "type": "node_processing",
            "content": "月湖在哪里",
            "time": 1737535668353
        },
        {
            "node_id": "1737534740182364809",
            "node_name": "LLM_001",
            "type": "tool_processing",
            "tool_calls": {
                "type": "retrieval",
                "tool_calls_data": {
                    "input": "月湖在哪里"
                }
            },
            "time": 1737535668368
        },
        {
            "node_id": "1737534740182364809",
            "node_name": "LLM_001",
            "type": "tool_finish",
            "tool_calls": {
                "type": "retrieval",
                "tool_calls_data": {
                    "slice_info": "[\"作文：美丽的月湖\\n月湖又名西湖，是我们宁波市区著名的风景名胜区。它在宁波市城区的西南。四周绿树成荫，新建的住宅小区环绕着它，绿杨翠柳、一池碧波。虽不闻管弦之声，亦不见白鸥破水，却在平实之中含着优美静谧。月湖有宋朝建成的十洲胜景：湖东的竹屿、月岛和菊花洲，湖中的花屿、竹洲、柳汀和芳草洲，湖西的烟屿、雪汀和芙蓉洲。有宋明朝筑成的三堤和七桥，湖北的偃月堤，湖中的广生堤，湖南的桃花堤。七桥指的是花屿与烟屿间的湖心西桥，柳汀至烟屿间的幢幢西桥，柳订至菊花洲间的幢幢东桥，雪汀与芙蓉洲间的虹娇，笑蓉洲至月湖北滨间的衰绣桥，菊花洲至月湖北滨间的四明桥。十洲与三堤七桥交相辉映，美不胜收。\\n月湖边的宁波二中，是我们宁波的一所名校，它培养了著名的老一辈革命家陈修良、中科院院长路甬祥、著名城建专家叶如棠、著名经济学家罗精奋，以及著名的华裔女作家於梨华等。\\n月湖边经常有丰富的社区活动，我们知道的“月湖文化艺术月”，有朗诵音乐会、月湖知识竞赛、“情系月湖”摄影比赛，有关月湖的影展、画展及京剧、古乐、茶艺等表演。游月湖的时候，不经意间也许你就会发现文化的痕迹。\\n春天的时候，万物复苏，湖边桃红柳绿，迎春花娇艳欲滴，三月三，风筝在湖边高高飞扬，孩子们脱去了沉重的冬装雀跃在湖边。\\n夏天的时候，月湖的湖水清澈碧绿，岸边鸟语花香，浓荫遮蔽，隐约可见鱼儿在水下穿梭，夜间和周末，有爱好戏曲的市民在亭子里吹拉弹唱，或者纳凉聊天，湖水倒映着月影，清波荡漾。\\n秋天的月湖，又是另一翻成熟的景象，而冬天的月湖，安详沉静，静静地等待着春天的到来。我爱美丽的月湖。\\n\"]"
                }
            }
        },
        {
            "node_id": "1737534740182364809",
            "node_name": "LLM_001",
            "type": "node_finish",
            "content": "月湖位于中国浙江省宁波市区西南部，是宁波市区著名的风景名胜区。四周环境优美，被新建的住宅小区和绿树环绕，是一个集自然美景与文化底蕴于一体的地方。",
            "time": 1737535670588
        }
    ]
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

##### Online Search Log: List<OpenWebSearchData>

| Name | Type | Description |
| --- | --- | --- |
| input | String | Search Keyword |
| refer | String | Reference Name |
| title | String | Title of Search Result |
| link | String | Web Link of Search Result |
| content | String | Quoted Text Content from Search Result Web Page |
| media | String | Name of the Source Website of the Search Result |
| icon | String | Icon of the Source Website |

###### Example of Online Search Result

```
{
    "event": [
        {
            "node_id": "1737534740182364809",
            "node_name": "LLM_001",
            "type": "node_processing",
            "content": "月湖在哪里",
            "time": 1737534811518
        },
        {
            "node_id": "1737534740182364809",
            "node_name": "LLM_001",
            "type": "tool_processing",
            "tool_calls": {
                "type": "web_search",
                "tool_calls_data": [
                    {
                        "input": "月湖在哪里"
                    }
                ]
            },
            "time": 1737534821272
        },
        {
            "node_id": "1737534740182364809",
            "node_name": "LLM_001",
            "type": "tool_finish",
            "tool_calls": {
                "type": "web_search",
                "tool_calls_data": [
                    {
                        "refer": "ref_1",
                        "title": "月湖公园：浠城的“水云间”",
                        "link": "https://new.qq.com/rain/a/20210321A06UEJ00",
                        "content": "月湖公园：浠城的水云间”\n巩新民\n在浠水县城，有一处令人神往的好地方，那是梦中的伊甸园”，是市民的水云间”。这个地方就是月湖公园。\n2月6日，久违的阳光洒满浠川。好长时间没外出走动，下午，我约好友到月湖公园转了一圈，忘却了烦忧，远离了喧嚣，愉悦了心情，锻炼了身体，收获很多，感受很深。\n月湖孕育了月湖公园\n月湖，位于麻桥月山脚下，背倚月山，月湖”由此得名。月湖是镶嵌在北城新区的明珠，好似浠城的当家塘”，地位如同东湖之于武汉，西湖之于杭州，遗爱湖之于黄州。\n历史上的月湖是一片荒湖。由于位置低，人们形象地称之为脚盆底”。\n脚盆底，一直是灾害与贫穷的代名词。据浠水县政协研究室主任刘卫国著《饶兴礼办社记》描述：1959年冬天以前，脚盆底的最低处常年积水，丛生着荸荠苗、饭架草、龙须草、菱角禾、刺角禾、水马料，还有其他不出名的野草。曾流传这样的歌谣：家靠脚盆底，年年要讨米，要想日子过得好，除非日头从西起。”\n2012年9月，浠水北城新区正式启动建设，规划理念是山水一脉、城水相生、都市水湾、楚韵新城”，形成以月湖为中心的滨水新城，东至丽文北路，南至红烛路，西至丁麻路，背靠月山，规划总面积4.8平方公里（7214亩），其中建设用地面积6168亩，水域和其他用地面积1045亩。\n月湖公园位于北城新区的核心地段，是县城最大的湖景公园，规划占地面积80万平方米，投资2.5亿元，是浠水对外的一张亮丽名片。随着北城新区建设的推进，依托月湖而建的月湖公园终于走出了蓝图，走到了老百姓身边。\n四季有景 环境怡人\n月湖水质清澈，碧波荡漾，由上、中、下三湖组成，三湖相通，融为一体。在注重生态保护前",
                        "media": "腾讯新闻",
                        "icon": "https://sfile.chatglm.cn/searchImage/new_qq_com_icon.jpg"
                    },
                    {
                        "refer": "ref_8",
                        "title": "我的旅行日记：环游中国day151，宁波（发布时间：2024-05-13 23:24:26）",
                        "link": "https://zhuanlan.zhihu.com/p/697291644",
                        "content": "宁波最知名的景点非天一阁莫属，这是中国现存最古老的私人藏书楼，由明代范钦所建，已有近500年历史，得益于范家后代的努力，宁波虽饱经战火但阁楼仍屹立不倒。现今天一阁虽兼并了附近的一些祠堂建筑，但规模依然很小，与旁边的月湖一并评为5A景区，门票30块钱不算贵。天一阁最初的功用为藏书，但现在可供参观的部分只有北库房能看到一些藏书的书柜，在屋内可以闻到浓浓的芸草气味。天一阁藏书多为地方志族谱家谱，对于考古研究价值很高，实际普通人参观起来没什么吸引力，好在除了藏书阁外还有一些园林建筑以及其它阁楼或历史可供游览。秦氏支祠有个非常华丽的祠堂，据记载修建时花费了20万两银元。秦氏支祠旁边为麻将起源地陈列馆，这是国内第一个以麻将为主题的专题陈列馆，介绍了麻将和牌的起源，还陈列了各种国家和材质的麻将牌，比较有意思。天一阁毕竟为5A景区，非节假日也能遇到很多老年旅游团。离开天一阁向东穿过月湖金汇小镇前往月湖，月湖金汇小镇路牌上写的是诗情湖西，不知是要开发作景区还是做什么用，多为民国风建筑，时值中午天气很热并未见到多少游人。宁波，古为明州，有日月二湖，为避朱明讳，取海定则波宁”改名宁波。月湖是个月牙形湖泊，南北长不到2km，风景秀丽，沿湖西侧南下前往南塘老街，湖边绿柳成荫，微风吹拂带来丝丝凉意。南塘老街，穿越百年的历史街区，是个特色美食街区，游人非常多。街后的南郊河水很脏，但有廊檐可供遮阳休息，有不少人在此乘凉小憩。离开南塘老街北上穿过长春门文化公园到达月湖东岸，长春门处也有些清末民初的建筑遗存。沿月湖边北上至院士林，这里为纪念宁波籍的118位院士种有118棵大",
                        "media": "知乎专栏",
                        "icon": "https://sfile.chatglm.cn/searchImage/zhuanlan_zhihu_com_icon.jpg"
                    }
                ]
            }
        },
        {
            "node_id": "1737534740182364809",
            "node_name": "LLM_001",
            "type": "node_finish",
            "content": "月湖是中国多个城市中出现的湖泊名称，根据您提供的信息，至少在以下两个城市中出现了月湖：\n\n1. 浠水县城：根据[1]的信息，月湖位于湖北省浠水县城，是该县城的一处重要景观，被誉为浠城的“水云间”。月湖公园是依托月湖而建的一座湖景公园，对当地居民的生活质量提升有着重要作用。\n\n2. 宁波市：根据[2][6]的信息，宁波市的月湖位于市中心，是宁波的一个重要景点，有“相当于杭州的西湖”之称。月湖分为南北园，是宁波市“江南特色”的体现，湖边有许多历史建筑和文化遗址。\n\n因此，月湖的位置不是单一的，需要根据具体城市来判定。",
            "time": 1737534821288
        }
    ]
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
53  
54  
55  
56  
57  
58

#### 

### Response Example

#### Stream Request Response Example ( “stream”: true)

Do Not Send Logs: “send\_log\_event”: false

```
data:{"request_id":"KD1Ozaekh5IfYqFvTc4IF","conversation_id":"98933","choices":[{"index":0,"delta":{"content":{"type":"text","msg":"一只"}}}]}

data:{"request_id":"KD1Ozaekh5IfYqFvTc4IF","conversation_id":"98933","choices":[{"index":0,"delta":{"content":{"type":"text","msg":"狗"}}}]}

data:{"request_id":"KD1Ozaekh5IfYqFvTc4IF","conversation_id":"98933","choices":[{"index":0,"delta":{"content":{"type":"text","msg":"通常"}}}]}

..........

data:{"request_id":"KD1Ozaekh5IfYqFvTc4IF","conversation_id":"98933","choices":[{"index":0,"finish_reason":"stop"}]}

data:[DONE]
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

发送日志：“send\_log\_event”: true

```
data:{"request_id":"0SZ5nvKALcBwXXVqj0sn5","conversation_id":"99421","choices":[{"index":0,"delta":{"event":{"node_id":"172924931494931026","node_name":"节点1","type":"node_processing","content":"将url的值以json格式输出","time":1736577879194}}}]}

data:{"request_id":"0SZ5nvKALcBwXXVqj0sn5","conversation_id":"99421","choices":[{"index":0,"delta":{"event":{"node_id":"172924931494931026","node_name":"节点1","type":"node_finish","content":"```json\n\n{\n    \"url\": \"https://i.imgur.com/0Z9e5e9.jpg\"\n}\n\n```","time":1736577883028}}}]}

data:{"request_id":"0SZ5nvKALcBwXXVqj0sn5","conversation_id":"99421","choices":[{"index":0,"delta":{"event":{"node_id":"1729216784530778786","node_name":"变量","type":"node_processing","content":"{}","time":1736577889647}}}]}

data:{"request_id":"0SZ5nvKALcBwXXVqj0sn5","conversation_id":"99421","choices":[{"index":0,"delta":{"event":{"node_id":"1729216784530778786","node_name":"变量","type":"node_finish","content":"{\"status\":\"success\",\"reason\":\"\",\"data\":{\"que\":\"[{\\\"url\\\":\\\"https://cdn.bigmodel.cn/knowledge_test/image/CE3E02C30B5B414A912A9A60AD72D5E7.jpeg\\\"}]\"}}","time":1736577889718}}}]}

data:{"request_id":"0SZ5nvKALcBwXXVqj0sn5","conversation_id":"99421","choices":[{"index":0,"delta":{"event":{"node_id":"1729235637996950176","node_name":"分支判断","type":"node_processing","content":"que-[{\"url\":\"https://cdn.bigmodel.cn/knowledge_test/image/CE3E02C30B5B414A912A9A60AD72D5E7.jpeg\"}]","time":1736577889979}}}]}

data:{"request_id":"0SZ5nvKALcBwXXVqj0sn5","conversation_id":"99421","choices":[{"index":0,"delta":{"event":{"node_id":"1729235637996950176","node_name":"分支判断","type":"node_finish","content":"LLM_305","time":1736577890006}}}]}

data:{"request_id":"0SZ5nvKALcBwXXVqj0sn5","conversation_id":"99421","choices":[{"index":0,"delta":{"event":{"node_id":"1729594451363926483","node_name":"LLM_305","type":"node_processing","content":"图上有什么","time":1736577890366}}}]}

data:{"request_id":"0SZ5nvKALcBwXXVqj0sn5","conversation_id":"99421","choices":[{"index":0,"delta":{"content":{"type":"text","msg":"这是一"}}}]}

data:{"request_id":"0SZ5nvKALcBwXXVqj0sn5","conversation_id":"99421","choices":[{"index":0,"delta":{"content":{"type":"text","msg":"张"}}}]}

data:{"request_id":"0SZ5nvKALcBwXXVqj0sn5","conversation_id":"99421","choices":[{"index":0,"delta":{"content":{"type":"text","msg":"描绘"}}}]}

..........

data:{"request_id":"0SZ5nvKALcBwXXVqj0sn5","conversation_id":"99421","choices":[{"index":0,"delta":{"content":{"type":"text","msg":"的感觉"}}}]}

data:{"request_id":"0SZ5nvKALcBwXXVqj0sn5","conversation_id":"99421","choices":[{"index":0,"delta":{"content":{"type":"text","msg":"。"}}}]}

data:{"request_id":"0SZ5nvKALcBwXXVqj0sn5","conversation_id":"99421","choices":[{"index":0,"delta":{"event":{"node_id":"1729594451363926483","node_name":"LLM_305","type":"node_finish","content":"这是一张描绘了一个年轻女孩的插图。她戴着眼镜，头发是棕色的，略带一些卷曲，披散在肩膀上。她的眼睛看起来很专注，脸上的表情平静。她穿着一件灰色的连帽衫，领子处似乎有一些拉链。整体色调给人一种温暖而宁静的感觉。","time":1736577894738}}}]}

data:{"request_id":"0SZ5nvKALcBwXXVqj0sn5","conversation_id":"99421","choices":[{"index":0,"finish_reason":"stop"}]}

data:[DONE]
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

#### Synchronous Request Response Example ( “stream”: false)

Do Not Send Logs: “send\_log\_event”: false

```
{
    "request_id": "IqGJyAc8L4Tjd7vQihwIS",
    "conversation_id": "99424",
    "choices": [
        {
            "index": 0,
            "finish_reason": "stop",
            "messages": {
                "content": {
                    "type": "text",
                    "msg": "这是一张描绘了一个年轻女孩的插图。她戴着眼镜，头发是棕色的，略带一些卷曲，披散在肩膀上。她的眼睛看起来很专注，脸上的表情平静。她穿着一件灰色的连帽衫，领子处似乎有一些拉链。整体色调给人一种温暖而宁静的感觉。"
                },
                "event": []
            },
            "usage": [
                {
                    "model": "glm-4v-plus",
                    "nodeName": "节点1",
                    "inputTokenCount": 1669,
                    "outputTokenCount": 27,
                    "totalTokenCount": 1696
                },
                {
                    "model": "glm-4v",
                    "nodeName": "LLM_305",
                    "inputTokenCount": 1671,
                    "outputTokenCount": 69,
                    "totalTokenCount": 1740
                }
            ]
        }
    ]
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

Send Logs: “send\_log\_event”: true

```
{
    "request_id": "p6cUz2mzwRN-q-TNL4AQK",
    "conversation_id": "99422",
    "choices": [
        {
            "index": 0,
            "finish_reason": "stop",
            "messages": {
                "content": {
                    "type": "text",
                    "msg": "这是一张描绘了一个年轻女孩的插图。她戴着眼镜，头发是棕色的，略带一些卷曲，披散在肩膀上。她的眼睛看起来很专注，脸上的表情平静。她穿着一件灰色的连帽衫，领子处似乎有一些拉链。整体色调给人一种温暖而宁静的感觉。"
                },
                "event": [
                    {
                        "node_id": "172924931494931026",
                        "node_name": "节点1",
                        "type": "node_processing",
                        "content": "将url的值以json格式输出",
                        "time": 1736578122560
                    },
                    {
                        "node_id": "172924931494931026",
                        "node_name": "节点1",
                        "type": "node_finish",
                        "content": "```json\n\n{\n    \"url\": \"https://i.imgur.com/6e9e9e9.jpg\"\n}\n\n```",
                        "time": 1736578124778
                    },
                    {
                        "node_id": "1729216784530778786",
                        "node_name": "变量",
                        "type": "node_processing",
                        "content": "{}",
                        "time": 1736578125096
                    },
                    {
                        "node_id": "1729216784530778786",
                        "node_name": "变量",
                        "type": "node_finish",
                        "content": "{\"status\":\"success\",\"reason\":\"\",\"data\":{\"que\":\"[{\\\"url\\\":\\\"https://cdn.bigmodel.cn/knowledge_test/image/CE3E02C30B5B414A912A9A60AD72D5E7.jpeg\\\"}]\"}}",
                        "time": 1736578125170
                    },
                    {
                        "node_id": "1729235637996950176",
                        "node_name": "分支判断",
                        "type": "node_processing",
                        "content": "que-[{\"url\":\"https://cdn.bigmodel.cn/knowledge_test/image/CE3E02C30B5B414A912A9A60AD72D5E7.jpeg\"}]",
                        "time": 1736578125450
                    },
                    {
                        "node_id": "1729235637996950176",
                        "node_name": "分支判断",
                        "type": "node_finish",
                        "content": "LLM_305",
                        "time": 1736578125465
                    },
                    {
                        "node_id": "1729594451363926483",
                        "node_name": "LLM_305",
                        "type": "node_processing",
                        "content": "图上有什么",
                        "time": 1736578125849
                    },
                    {
                        "node_id": "1729594451363926483",
                        "node_name": "LLM_305",
                        "type": "node_finish",
                        "content": "这是一张描绘了一个年轻女孩的插图。她戴着眼镜，头发是棕色的，略带一些卷曲，披散在肩膀上。她的眼睛看起来很专注，脸上的表情平静。她穿着一件灰色的连帽衫，领子处似乎有一些拉链。整体色调给人一种温暖而宁静的感觉。",
                        "time": 1736578132855
                    }
                ]
            },
            "usage": [
                {
                    "model": "glm-4v-plus",
                    "nodeName": "节点1",
                    "inputTokenCount": 1669,
                    "outputTokenCount": 27,
                    "totalTokenCount": 1696
                },
                {
                    "model": "glm-4v",
                    "nodeName": "LLM_305",
                    "inputTokenCount": 1671,
                    "outputTokenCount": 69,
                    "totalTokenCount": 1740
                }
            ]
        }
    ]
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

## 3.6 Knowledge Base Slice Reference Location Information

Used to obtain the slice location information matched by the dialogue with the intelligent agent (application)

Currently, only PDF and Excel are supported for displaying slice location information

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request URL | /v2/application/slice\_info |
| Call Method | Synchronous Call, Wait for Return Result |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | POST |

#### Interface Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| request\_id | string | Yes | ID returned by the create dialogue or text request interface |
| node\_id | string | Yes | Node ID |

#### Interface Return Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| document\_slices | list<DocumentSlices> | Knowledge slice information |
| has\_old\_document | boolean | Whether there are historical documents without slice locationstrue: Can find documents with hide\_positions as true for re-vectorizationfalse: No need to pay attention |
| images | List<Image> | Image list |

DocumentSlices:

| Parameter Name | Type | Description |
| --- | --- | --- |
| document | Document | Knowledge information |
| slice\_info | List<Slice> | Slice information |
| hide\_positions | boolean | Whether there are historical document slices without location information; true: Need to re-vectorize to obtain location information, see Re-vectorization Interface;false: No need to pay attention |

Image:

| Parameter Name | Type | Description |
| --- | --- | --- |
| text | string | Image name |
| cos\_url | string | Image URL |

Document:

| Parameter Name | Type | Description |
| --- | --- | --- |
| id | string | Unique knowledge ID |
| name | string | Knowledge name |
| url | string | Knowledge URL |
| dtype | int | Knowledge type, see unified structure |

Slice:

| Parameter Name | Type | Description |
| --- | --- | --- |
| document\_id | string | Unique knowledge ID |
| position | Position | PDF slice location information |
| line | int | Sheet row number |
| sheet\_name | string | Sheet name |
| text | string | Slice content |

Note: PDF knowledge uses position location information; Excel uses line and sheet\_name location information

Position:

| Parameter Name | Type | Description |
| --- | --- | --- |
| x0 | decimal | Distance from the left to the row left |
| x1 | decimal | Distance from the character top to the top |
| top | decimal | Distance from the character top to the top |
| bottom | decimal | Distance from the character bottom to the top |
| page | int | Page number |
| height | decimal | Page height |
| width | decimal | Page width |

##### Example

```
{
    "data": {
        "document_slices": [
            {
                "document": {
                    "id": "171128203689965971",
                    "name": "xx.pdf",
                    "url": "https://cdn.bigmodel.cn/knowledge_test/xx.pdf",
                    "dtype": 3
                },
                "slice_info": [
                    {
                        "document_id": "171128203689965971",
                        "position": {
                            "x0": 90,
                            "x1": 267.46999999999997,
                            "top": 293.293,
                            "bottom": 303.24300000000005,
                            "page": 6,
                            "height": 841.9,
                            "width": 595.3
                        },
                        "text": "你好你好你好你好你好你好你好你好你好你好"
                    }
                ],
                "hide_positions": false,
                "images": [
                    {
                        "text": "图片名称",
                        "cos_url": "地址"
                    }
                ]
            },
            {
                "document": {
                    "id": "171128203689965971",
                    "name": "xx.docx",
                    "url": "https://cdn.bigmodel.cn/knowledge_test/xx.docx",
                    "dtype": 6
                },
                "slice_info": [
                    {
                        "document_id": "171128203689965971",
                        "line": 1,
                        "sheet_name": "sheet1",
                        "text": "你好你好你好你好你好你好你好你好你好你好"
                    }
                ],
                "hide_positions": false
            }
        ],
        "has_old_document": false
    },
    "code": 200,
    "message": "请求成功",
    "timestamp": 1697438393502
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
53  
54  
55  
56  
57

## 3.7 Recommended Questions

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request URL | /open/history\_session\_record/{app\_id}/{conversation\_id} |
| Call Method | Synchronous Call, Wait for Return Result |
| Character Encoding | UTF-8 |
| Interface Request Format | PATH |
| Response Format | JSON |
| Interface Request Type | GET |

#### Interface Path Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| app\_id | String | Yes | Application ID |
| conversation\_id | String | Yes | Session ID |

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
| problems | Object | List of Recommended Questions |

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

1. Preliminary Steps

   1. Use the interface [Create New Session](https://zhipu-ai.feishu.cn/wiki/Wsr1wXmHXicO3AkdZPVcBANbnvb?fromScene=spaceOverview#share-UUSlddf4RoNv29xX8H3chnVLn3c)  based on the business scenario, optional step, the application inference interface creates a new session by default.
   2. If the parameter list includes file upload variables, you need to call the 3.2 interface to upload knowledge files.
   3. After uploading the file, call the 3.3 [Get File Parsing Status](https://zhipu-ai.feishu.cn/wiki/Wsr1wXmHXicO3AkdZPVcBANbnvb?fromScene=spaceOverview#share-N7jRd0EKDoSMUGx77ascNqQ3njc)  interface to determine if the file has been parsed. Only after parsing is complete can subsequent processes be carried out.
2. Use the 3.5 interface [Create Dialogue Request](https://zhipu-ai.feishu.cn/wiki/Wsr1wXmHXicO3AkdZPVcBANbnvb?fromScene=spaceOverview#share-DPEhdmIXBoOWyGx2PLgcVOBPnjb)  to create a dialogue request based on the intelligent agent (application) & session and obtain results.

   1. Dialogue parameters are consistent, and you can directly construct the call according to the [example](https://zhipu-ai.feishu.cn/wiki/Wsr1wXmHXicO3AkdZPVcBANbnvb?fromScene=spaceOverview#share-Parqdndbko2pdnxrWLbcuVsanLb)  parameters without using 3.1 to obtain the parameter list.
   2. The call parameters for each text-based intelligent agent (application) are related to the intelligent agent (application), and you need to use the 3.1 interface [Get Intelligent Agent (Application) Input Parameters](https://zhipu-ai.feishu.cn/wiki/Wsr1wXmHXicO3AkdZPVcBANbnvb?fromScene=spaceOverview#share-K7V7dybAUokuUsxGtAPcA8IEnue)  to obtain them.

ps:

Session - Used to manage chat context, only the latest user input is required for each dialogue.

Table of contents

1. Service Address

2. Authentication Method

2.1 Authentication Using API Key

2.2 Authentication Using Authorization Token

3.1 Retrieve Input Parameters for Agent (Application)

3.2 File Upload

3.3 Retrieve File Parsing Status

3.4 Create New Session

3.5 Create Dialogue or Text Application Inference Interface V3

Interface Request

Input Parameters

Response

Response Example

3.6 Knowledge Base Slice Reference Location Information

3.7 Recommended Questions