[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2Fknowlage-manage%2Fqueryfile)

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

# File Management

## **Upload File**

Upload files for use in model fine-tuning, knowledge base, batch processing, and file extraction functionalities.

#### API Request

| Type | Description |
| --- | --- |
| Transmission Method | https |
| Request Address | https://open.bigmodel.cn/api/paas/v4/files |
| Calling Method | Synchronous call, wait for the return result |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | POST |

### **Request Parameters**

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| file | File | Yes | Full path of the file to be uploaded |
| purpose | String | Yes | \*\*Purpose of the file: **batch**: For batch task processing, supports `.jsonl` file format, file limit is 100 MB. [Batch Guide](https://bigmodel.cn/dev/howuse/batchapi)  **retrieval**: For knowledge base retrieval, supports `doc`, `docx`, `pdf`, `xlsx` file formats, file limit is 50 MB. **file-extract**: For document content extraction, supports formats including: `pdf`, `docx`, `doc`, `xls`, `xlsx`, `ppt`, `pptx`, `png`, `jpg`, `jpeg`, `csv`, file limit is 50 MB, total number of files not exceeding 100.  **code-interpreter**: For document content extraction, supports formats including: `pdf`, `docx`, `doc`, `xls`, `xlsx`, `txt`, `png`, `jpg`, `jpeg`, `csv`, file limit is 20 MB, total number of files not exceeding 100. **fine-tune**: For model fine-tuning, supports `.jsonl` file format, file limit is 512 MB. **fine-tune-function-calling**: For model fine-tuning, supports `.jsonl` file format, file limit is 512 MB.  **fine-tune-vision-cogview**: For model fine-tuning, supports `.jsonl` file format, file limit is 512 MB.  **fine-tune-vision-cogvlm**: For model fine-tuning, supports `.jsonl` file format, file limit is 512 MB.[Fine-Tuning Guide](https://bigmodel.cn/dev/api/normal-model/glm-4#fine-tuning) |
| knowledge\_id | String | No | Required when the purpose is `retrieval`, must specify `knowledge_id`, access [Knowledge Base](https://open.bigmodel.cn/knowledge)  to query `knowledge_id`. |

### Request Example

```
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="") # Please fill in your own APIKey
  
result = client.files.create(
    file=open("product_reviews.jsonl", "rb"),
    purpose="batch"    # Supports retrieval, batch, fine-tune, file-extract,code-interpreter
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

## **Delete File**

#### API Request

| Transfer Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/files/{fileID} |
| Call Method | Synchronous call, wait for the result |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | DELETE |

### Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| file\_id | string | Yes | File id |

### Request Example

```
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="") # Please fill in your own APIKey

result = client.file.delete(
    id="file_id"         # Supports retrieval, batch, fine-tune, file-extract files
)
```

1  
2  
3  
4  
5  
6  
7

## Query File List

#### API Request

| Transfer Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/pass/v4/files |
| Call Method | Synchronous call, wait for the result |
| Character Encoding | UTF-8 |
| Request Format | URL parameters |
| Response Format | JSON |
| Request Type | GET |

### Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| purpose | String | Yes | File purpose |
| knowledge\_id | String | No | Required when the file purpose is `retrieval`, provide the knowledge base ID for query. |
| page | Integer | No | Page, default 1 |
| limit | Integer | No | Number of files to query in the list, default 10 |
| after | String | No | Query files list after the specified fileID (required when the file purpose is fine-tune) |
| order | String | No | Sorting rule, optional values [desc, asc], default desc (required when the file purpose is fine-tune) |

### Request Example

```
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="") # Please fill in your own APIKey

# Request file list
result = client.files.list(
    purpose="batch",    # Supports batch, file-extract, fine-tune
)
print(result)
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

```
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="") # Please fill in your own APIKey

# Request knowledge base file list
resp = client.knowledge.document.list(
    purpose="retrieval",   # Supports retrieval
    knowledge_id="1798330146986561536"
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

## **Knowledge Base File Details**

| Transfer Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/document/{id} |
| Call Method | Synchronous call, wait for the result |
| Character Encoding | UTF-8 |
| Request Format | PATH |
| Response Format | JSON |
| Request Type | GET |

### Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| id | string | Yes | File id |

### Request Example

```
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="") # Please fill in your own APIKey

resp = client.knowledge.document.retrieve(
    document_id="1803049612567781376"  # Supports retrieval
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

## **Edit Knowledge Base File**

| Transfer Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/document/{id} |
| Call Method | Synchronous call, wait for the result |
| Character Encoding | UTF-8 |
| Request Format | PUT |
| Response Format | JSON |
| Request Type | PUT |

### **Request Parameters**

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| document\_id | string | Yes | File id, only supports files with purpose **retrieval** |
| knowledge\_type | int | Yes | Knowledge type: 1: Article knowledge: Supports pdf, url, docx 2. Q&A knowledge - Document: Supports pdf, url, docx 3. Q&A knowledge - Table: Supports xlsx 4. Product library - Table: Supports xlsx 5. Custom: Supports pdf, url, docx |
| custom\_separator | List<string> | No | Effective when the knowledge type is custom (konwledge\_type=5), default split by `\n` |
| sentence\_size | int | No | Effective when the knowledge type is custom (konwledge\_type=5), value range: 20-2000, default slice size is 300 |

### Request Example

```
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="") # Please fill in your own APIKey

resp = client.knowledge.document.edit(
    document_id="1803049612567781376",  # Supports retrieval
    knowledge_type="1",
    sentence_size=204,
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

Table of contents

Upload File

Request Parameters

Request Example

Delete File

Request Parameters

Request Example

Query File List

Request Parameters

Request Example

Knowledge Base File Details

Request Parameters

Request Example

Edit Knowledge Base File

Request Parameters

Request Example