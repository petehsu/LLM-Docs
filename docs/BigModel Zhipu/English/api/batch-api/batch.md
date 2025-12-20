[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2Fbatch-api%2Fbatch)

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

# Batch

The Batch API is designed for processing large-scale data requests, suitable for tasks that do not require immediate feedback. Through the Batch API, developers can submit a large number of API requests and receive the results within 24 hours, at a price that is only 50% of the standard version. Please refer to the [usage guide](https://www.bigmodel.cn/dev/howuse/batchapi) .

## Creating a Batch

**Interface Request**

| Transfer Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/batches |
| Call Method | Synchronous Call |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | POST |
| Development Language | Any development language that can initiate an HTTP request |

#### Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| input\_file\_id | string | Required | The ID of the uploaded file containing the Batch requests. The input file must be in .Jsonl format and the purpose of the file upload must be marked as “batch”. |
| endpoint | string | Required | The endpoint that all requests in the Batch will use. Currently, only `/v4/chat/completions` is supported. |
| completion\_window | string | Required | Specifies the time within which the Batch task should be completed. Currently, only “24h” is supported. |
| metadata | object or null | Optional | Used to store data related to the Batch, such as customer ID, description, or other additional information required for task management and tracking. A maximum of 16 key-value pairs can be attached to the object. Each key can be up to 64 characters long, and each value can be up to 512 characters long. |

#### Request Example

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # Fill in your own APIKey

create = client.batches.create(
    input_file_id="file_123",
    endpoint="/v4/chat/completions",
    completion_window="24h",
    metadata={
        "description": "sentiment classification"
    }
)
print(create)
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

#### Response Content

Returns a Batch object.

## Retrieving a Batch

**Interface Request**

| Transfer Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/batches/{batch\_id} |
| Call Method | Synchronous Call |
| Character Encoding | UTF-8 |
| Request Format | REST |
| Response Format | JSON |
| Interface Request Type | GET |
| Development Language | Any development language that can initiate an HTTP request |

#### Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| batch\_id | String | Required | This parameter is the unique identifier of the batch task, used to specify the Batch to be retrieved. |

#### Request Example

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # Fill in your own APIKey

retrieve = client.batches.retrieve("batch_123")
print(retrieve)
```

1  
2  
3  
4  
5

#### Response Content

Returns a Batch object.

## Cancelling a Batch

**Interface Request**

| Transfer Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/batches/{batch\_id}/cancel |
| Call Method | Synchronous Call |
| Character Encoding | UTF-8 |
| Request Format | REST |
| Response Format | JSON |
| Interface Request Type | POST |
| Development Language | Any development language that can initiate an HTTP request |

#### Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| batch\_id | String | Required | The unique identifier of the Batch task to be cancelled. |

#### Request Example

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # Fill in your own APIKey

cancel = client.batches.cancel("batch_123")
print(cancel)
```

1  
2  
3  
4  
5

#### Response Content

Returns a Batch object.

## Listing Batches

**Interface Request**

| Transfer Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/batches |
| Call Method | Synchronous Call |
| Character Encoding | UTF-8 |
| Request Format | Query |
| Response Format | JSON |
| Interface Request Type | GET |
| Development Language | Any development language that can initiate an HTTP request |

#### Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| after | String | Optional | This parameter serves as a pagination cursor, specifying to start retrieving the list after a specific object ID. For example, if your previous request returned a list containing the object `obj_foo`, and you want to continue fetching content from this point, you can include `after=obj_foo` in your next request to get the next page of data. |
| limit | int | Optional | Limits the number of returned objects. The range of `limit` can be from 1 to 100, with a default value of 20. |

#### Request Example

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # Fill in your own APIKey

# client.batches.list returns a SyncCursorPage
list = client.batches.list(limit=10)
print(list)
# SyncCursorPage's get_next_page can be used to fetch data after the current after+1
batch = list.get_next_page()
print(batch)
# SyncCursorPage's iter_pages returns a pagination iterator, which can be used with collections-related APIs
for batch in list.iter_pages():
    print(batch)
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

#### Response Content

Returns a Batch object.

## Downloading Batch Results

After the batch processing task is completed, you can download the output file to your local machine by making a request to the Files API using the `output_file_id` field in the Batch object.

**Interface Request**

| Transfer Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/files/{file\_id}/content |
| Call Method | Synchronous Call |
| Character Encoding | UTF-8 |
| Request Format | REST |
| Response Format | FILE |
| Interface Request Type | GET |
| Development Language | Any development language that can initiate an HTTP request |

#### Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| file\_id | String | Required | The unique identifier of the requested file, used to specify the particular file to get content from. |

#### Request Example

```
from zhipuai import ZhipuAI
 
client = ZhipuAI()  # Fill in your own APIKey
# client.files.content returns an instance of _legacy_response.HttpxBinaryResponseContent
content = client.files.content("result_123") 

# Use the write_to_file method to write the returned result to a file
content.write_to_file("write_to_file_batchoutput.jsonl")
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

#### **Interface Response Parameters**

Adheres to the file stream protocol.

## Batch Object

| Field Name | Type | Description |
| --- | --- | --- |
| id | string | The unique identifier of the batch. |
| object | string | The object type, here “batch”. |
| endpoint | string | The API endpoint used by the batch. |
| input\_file\_id | string | The ID of the input file used by the batch. |
| completion\_window | string | The time frame within which the batch should be completed. |
| status | string | The current status of the batch. |
| output\_file\_id | string | The file ID containing the output of successfully executed requests. |
| error\_file\_id | string | The file ID containing the output of requests that encountered errors. |
| created\_at | integer | The Unix timestamp (in seconds) when the batch was created. |
| in\_progress\_at | integer | The Unix timestamp (in seconds) when the batch started processing. |
| expires\_at | integer | The Unix timestamp (in seconds) when the batch will expire. |
| finalizing\_at | integer | The Unix timestamp (in seconds) when the batch started finalizing. |
| completed\_at | integer | The Unix timestamp (in seconds) when the batch was completed. |
| failed\_at | integer | The Unix timestamp (in seconds) when the batch failed. |
| expired\_at | integer | The Unix timestamp (in seconds) when the batch expired. |
| cancelling\_at | integer | The Unix timestamp (in seconds) when the batch started cancelling. |
| cancelled\_at | integer | The Unix timestamp (in seconds) when the batch was cancelled. |
| request\_counts | integer | The count of batch requests. |
| total | integer | The total number of requests in the batch. |
| completed | integer | The number of requests in the batch that have been successfully completed. |
| failed | integer | The number of requests in the batch that have failed. |
| metadata | map | A collection of up to 16 key-value pairs that can be attached to the object. This helps store additional information about the object in a structured format. The length of each key can be up to 64 characters, and the length of each value can be up to 512 characters. |

Table of contents

Creating a Batch

Retrieving a Batch

Cancelling a Batch

Listing Batches

Downloading Batch Results

Batch Object