[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fhowuse%2Fbatchapi)

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

# Batch API Overview

The Batch API is designed for scenarios that do not require immediate feedback and involve processing a large number of requests using large models. Through the Batch API, developers can submit a large number of tasks via files, with a 50% price reduction, no concurrency limits, and tasks completed within 24 hours. Typical application scenarios include:

* **Article Classification**: Adding classification labels to a large number of articles, posts, or product descriptions.
* **Sentiment Analysis**: Evaluating the sentiment倾向 of customer feedback, social media posts, and product reviews.
* **Document Processing**: Generating summaries, extracting key information, or translating a large number of documents.
* **Information Extraction**: Identifying and extracting key content from text data.

This guide will walk you through how to use the Batch API with practical examples.

## Batch API Tutorial

We will use GLM-4 to classify product reviews into positive, neutral, or negative sentiments and add specific issue labels (such as product defects, delivery delays, customer service attitude, etc.). The expected result format is as follows:

```
{
    "分类标签": "负面", 
    "特定问题标签": "产品缺陷" 
}
```

1  
2  
3  
4

### Creating a Batch File

The format of the Batch file should be .jsonl, with each request occupying one line (JSON object). Each line contains the details of a single API request. Each request is defined as follows:

#### glm-4

```
{
    "custom_id": "request-1", #每个请求必须包含custom_id且是唯一的，用来将结果和输入进行匹配
    "method": "POST",
    "url": "/v4/chat/completions", 
    "body": {
        "model": "glm-4", #每个batch文件只能包含对单个模型的请求,支持 glm-4-0520 glm-4-air、glm-4-flash、glm-4、glm-3-turbo.
        "messages": [
            {"role": "system","content": "你是一个意图分类器."},
            {"role": "user", "content": """
            # 任务：对以下用户评论进行情感分类和特定问题标签标注，只输出结果，
            # 评论：review = "订单处理速度太慢，等了很久才发货。"
            # 输出格式：
            {
            "分类标签": " ", 
            "特定问题标注": " " 
            }
            """
            }
        ],
        "temperature": 0.1
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

#### glm-4v

```
{
  "custom_id": "request-1", #每个请求必须包含custom_id且是唯一的，用来将结果和输入进行匹配
  "method": "POST",
  "url": "/v4/chat/completions",
  "body": {
      "model": "glm-4v",
      "messages": [
          {
              "role": "system",
              "content": "You are a helpful assistant."
          },
          {
              "role": "user",
              "content": [
                  {
                      "type": "text",
                      "text": "请描述图中的内容。"
                  },
                  {
                      "type": "image_url",
                      "image_url": {"url": "url地址或base64编码"}
                  }
              ]
          }
      ],
      "max_tokens": 1000
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

#### cogview-3

```
{
  "custom_id": "request-1", #每个请求必须包含custom_id且是唯一的，用来将结果和输入进行匹配
  "method": "POST",
  "url": "/v4/images/generations",
  "body": {
      "model": "cogview-3",
      "prompt": "一只可爱的小猫咪"
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

#### cogvideox

```
{
    "custom_id": "request-1",
    "method": "POST",
    "url": "/v4/videos/generations",
    "body": {
        "model": "cogvideox",
        "prompt": "比得兔开小汽车，游走在马路上，脸上的表情充满开心喜悦。"，
        "image_url": "图片地址或base64"
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

#### embedding-2

```
{
  "custom_id": "request-1", #每个请求必须包含custom_id且是唯一的，用来将结果和输入进行匹配
  "method": "POST",
  "url": "/v4/embeddings",
  "body": {
      "model": "embedding-2",
      "input": "你好"
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

#### embedding-3

```
{
    "custom_id": "request-1",
    "method": "POST",
    "url": "/v4/embeddings",
    "body": {
        "model": "embedding-3",
        "input": "你好",
        "dimensions": "1024"
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

For tips on constructing high-quality prompts, please refer to [Prompt Engineering](https://open.bigmodel.cn/dev/howuse/prompt?promptEngineer=promptEngineer') .

The constructed .jsonl file is as follows. This example includes 10 requests, with a single file supporting up to 50,000 requests and a size not exceeding 100M:

```
{"custom_id": "request-1", "method": "POST", "url": "/v4/chat/completions", "body": {"model": "glm-4", "messages": [{"role": "system", "content": "你是一个意图分类器."},{"role": "user", "content": "#任务：对以下用户评论进行情感分类和特定问题标签标注，只输出结果，# 评论：review = \"订单处理速度太慢，等了很久才发货。\"# 输出格式：'''{\"分类标签\": \" \", \"特定问题标注\": \" \" } '''"}]}}
{"custom_id": "request-2", "method": "POST", "url": "/v4/chat/completions", "body": {"model": "glm-4", "messages": [{"role": "system", "content": "你是一个意图分类器."},{"role": "user", "content": "#任务：对以下用户评论进行情感分类和特定问题标签标注，只输出结果，# 评论：review = \",商品有点小瑕疵，不过客服处理得很快，总体满意。\",# 输出格式：'''{\",分类标签\": \" \", \"特定问题标注\": \" \" } '''"}]}}
{"custom_id": "request-3", "method": "POST", "url": "/v4/chat/completions", "body": {"model": "glm-4", "messages": [{"role": "system", "content": "你是一个意图分类器."},{"role": "user", "content": "#任务：对以下用户评论进行情感分类和特定问题标签标注，只输出结果，# 评论：review = \"这款产品性价比很高，非常满意。\"# 输出格式：'''{\"分类标签\": \" \", \"特定问题标注\": \" \" } '''"}]}}
{"custom_id": "request-4", "method": "POST", "url": "/v4/chat/completions", "body": {"model": "glm-4", "messages": [{"role": "system", "content": "你是一个意图分类器."},{"role": "user", "content": "#任务：对以下用户评论进行情感分类和特定问题标签标注，只输出结果，# 评论：review = \"说明书写得不清楚，看了半天也不知道怎么用。\"# 输出格式：'''{\"分类标签\": \" \", \"特定问题标注\": \" \" } '''"}]}}
{"custom_id": "request-5", "method": "POST", "url": "/v4/chat/completions", "body": {"model": "glm-4", "messages": [{"role": "system", "content": "你是一个意图分类器."},{"role": "user", "content": "#任务：对以下用户评论进行情感分类和特定问题标签标注，只输出结果，# 评论：review = \"总体还不错，但价格偏高，不太划算。\"# 输出格式：'''{\"分类标签\": \" \", \"特定问题标注\": \" \" } '''"}]}}
{"custom_id": "request-6", "method": "POST", "url": "/v4/chat/completions", "body": {"model": "glm-4", "messages": [{"role": "system", "content": "你是一个意图分类器."},{"role": "user", "content": "#任务：对以下用户评论进行情感分类和特定问题标签标注，只输出结果，# 评论：review = \"物流速度很慢，等了两个星期才收到货 \"# 输出格式：'''{\"分类标签\": \" \", \"特定问题标注\": \" \" } '''"}]}}
{"custom_id": "request-7", "method": "POST", "url": "/v4/chat/completions", "body": {"model": "glm-4", "messages": [{"role": "system", "content": "你是一个意图分类器."},{"role": "user", "content": "#任务：对以下用户评论进行情感分类和特定问题标签标注，只输出结果，# 评论：review = \"收到的产品跟描述不符，有些失望。\"# 输出格式：'''{\"分类标签\": \" \", \"特定问题标注\": \" \" } '''"}]}}
{"custom_id": "request-8", "method": "POST", "url": "/v4/chat/completions", "body": {"model": "glm-4", "messages": [{"role": "system", "content": "你是一个意图分类器."},{"role": "user", "content": "#任务：对以下用户评论进行情感分类和特定问题标签标注，只输出结果，# 评论：review = \"客服很耐心，解决问题很快，感谢！\"# 输出格式：'''{\"分类标签\": \" \", \"特定问题标注\": \" \" } '''"}]}}
{"custom_id": "request-9", "method": "POST", "url": "/v4/chat/completions", "body": {"model": "glm-4", "messages": [{"role": "system", "content": "你是一个意图分类器."},{"role": "user", "content": "#任务：对以下用户评论进行情感分类和特定问题标签标注，只输出结果，# 评论：review = \"包装太简单，商品在运输过程中被压坏了。\"# 输出格式：'''{\"分类标签\": \" \", \"特定问题标注\": \" \" } '''"}]}}
{"custom_id": "request-10", "method": "POST", "url": "/v4/chat/completions", "body": {"model": "glm-4", "messages": [{"role": "system", "content": "你是一个意图分类器."},{"role": "user", "content": "#任务：对以下用户评论进行情感分类和特定问题标签标注，只输出结果，# 评论：review = \"产品质量不错，但是颜色和图片上的不一样\"# 输出格式：'''{\"分类标签\": \" \", \"特定问题标注\": \" \" } '''"}]}}
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

### Uploading the File

Upload the Batch file via file management and obtain the file ID.

```
from zhipuai import ZhipuAI
 
client = ZhipuAI(api_key="") # Please fill in your own APIKey
  
result = client.files.create(
    file=open("product_reviews.jsonl", "rb"),
    purpose="batch"
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

### Creating a Batch Task

After successfully uploading the input file, you can create a Batch task using the Batch file’s id. In this example, we assume the file ID is `file_123`.

```
from zhipuai import ZhipuAI
 
client = ZhipuAI()  # Fill in your own APIKey
 
create = client.batches.create(
    input_file_id="file_123",
    endpoint="/v4/chat/completions", 
    completion_window="24h", # Completion time only supports 24 hours
    metadata={
        "description": "Sentiment classification"
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
13

### Checking Batch Status

The Batch task will be processed within 24 hours, with the status “completed” indicating that the task is finished.

```
batch_job = client.batches.retrieve("batch_id")
print(batch_job)
```

1  
2

| Status | Description |
| --- | --- |
| validating | The file is being validated, and the Batch task has not started. |
| failed | The file did not pass validation. |
| in\_progress | The file has been successfully validated, and the Batch task is in progress. |
| finalizing | The Batch task is completed, and the results are being prepared. |
| completed | The Batch task is completed, and the results are ready. |
| expired | The Batch task did not complete within 24 hours. |
| cancelling | The Batch task is being cancelled. |
| cancelled | The Batch task has been cancelled. |

### Downloading Batch Results

Once the Batch task is completed, you can download the results using the `output_file_id` field in the Batch object and save it locally.

Note: The system only retains your data for 30 days. Please download and back up your data in time, as files will be automatically deleted after expiration and cannot be recovered.

```
from zhipuai import ZhipuAI
 
client = ZhipuAI()  # Fill in your own APIKey
# client.files.content returns _legacy_response.HttpxBinaryResponseContent instance
content = client.files.content("file-456") 
 
# Use the write_to_file method to write the returned results to a file
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

The final processed results are as follows:

```
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":26,"prompt_tokens":89,"total_tokens":115},"model":"glm-4","id":"8668357533850320547","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"负面\",\n  \"特定问题标注\": \"订单处理慢\"\n}\n```"}}],"request_id":"615-request-1"}},"custom_id":"request-1","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":22,"prompt_tokens":94,"total_tokens":116},"model":"glm-4","id":"8668368425887509080","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n \"分类标签\": \"负面\",\n \"特定问题标注\": \"产品缺陷\"\n}\n```"}}],"request_id":"616-request-2"}},"custom_id":"request-2","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":25,"prompt_tokens":86,"total_tokens":111},"model":"glm-4","id":"8668355815863214980","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"正面\",\n  \"特定问题标注\": \"性价比\"\n}\n```"}}],"request_id":"617-request-3"}},"custom_id":"request-3","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":28,"prompt_tokens":89,"total_tokens":117},"model":"glm-4","id":"8668355815863214981","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"负面\",\n  \"特定问题标注\": \"说明文档不清晰\"\n}\n```"}}],"request_id":"618-request-4"}},"custom_id":"request-4","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":26,"prompt_tokens":88,"total_tokens":114},"model":"glm-4","id":"8668357533850320546","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"中性\",\n  \"特定问题标注\": \"价格问题\"\n}\n```"}}],"request_id":"619-request-5"}},"custom_id":"request-5","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":26,"prompt_tokens":90,"total_tokens":116},"model":"glm-4","id":"8668356159460662846","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"负面\",\n  \"特定问题标注\": \"配送延迟\"\n}\n```"}}],"request_id":"620-request-6"}},"custom_id":"request-6","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":27,"prompt_tokens":88,"total_tokens":115},"model":"glm-4","id":"8668357671289274638","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"负面\",\n  \"特定问题标注\": \"产品描述不符\"\n}\n```"}}],"request_id":"621-request-7"}},"custom_id":"request-7","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959702,"usage":{"completion_tokens":26,"prompt_tokens":87,"total_tokens":113},"model":"glm-4","id":"8668355644064514872","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"正面\",```json
{"response":{"status_code":200,"body":{"created":1715959702,"usage":{"completion_tokens":26,"prompt_tokens":87,"total_tokens":113},"model":"glm-4","id":"8668355644064514872","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"正面\",\n  \"特定问题标注\": \"客服态度\"\n}\n```"}}],"request_id":"622-request-8"}},"custom_id":"request-8","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":29,"prompt_tokens":90,"total_tokens":119},"model":"glm-4","id":"8668357671289274639","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"负面\",\n  \"特定问题标注\": \"包装问题, 产品损坏\"\n}\n```"}}],"request_id":"623-request-9"}},"custom_id":"request-9","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":27,"prompt_tokens":87,"total_tokens":114},"model":"glm-4","id":"8668355644064514871","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"正面\",\n  \"特定问题标注\": \"产品描述不符\"\n}\n```"}}],"request_id":"624-request-10"}},"custom_id":"request-10","id":"batch_1791490810192076800"}
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

### Deleting Files

When uploading Batch files, you can upload a maximum of 100 files at a time. If you have a large number of tasks, please delete the processed files in time to continue uploading new files.

```
from zhipuai import ZhipuAI
 
client = ZhipuAI(api_key="") # Please fill in your own APIKey
 
result = client.file.delete(
    id="文件id"         
)
```

1  
2  
3  
4  
5  
6  
7

## Frequently Asked Questions

#### Which models are supported by the Batch API?

* GLM-4-Flash
* GLM-4-Air
* GLM-3-Turbo
* Embedding-2
* Embedding-3
* GLM-4-0520
* GLM-4
* GLM-4-FLash
* Cogview-3
* CogVideoX
* GLM-4V

#### What is the pricing for the Batch API?

The price is 50% of the standard API. Refer to [Product Pricing](https://open.bigmodel.cn/pricing) .

#### What are the concurrency limits for the Batch API?

The Batch API has separate concurrency limits from the existing model concurrency limits. The Batch API introduces two new limits:

* A single Batch file can contain up to 50,000 requests and must not exceed 100M.
* Each model has a maximum queue limit for Batch. When the request queue limit is reached, please wait for the current tasks to complete before submitting new tasks.

| Model | Batch Queue Limit |
| --- | --- |
| GLM-4-Flash | 1 million |
| GLM-4-Air | 1 million |
| GLM-3-Turbo | 200,000 |
| Embedding-2 | 200,000 |
| Embedding-3 | 200,000 |
| GLM-4-0520 | 50,000 |
| GLM-4 | 50,000 |
| GLM-4-FLash | 50,000 |
| Cogview-3 | 3,000 |
| CogVideoX | 1,000 |
| GLM-4V | 1,000 |

#### How to perform real-name authentication before calling the Batch API?

Real-name authentication is required to call the Batch API. Please complete personal or enterprise authentication on the [Real-name Authentication](https://open.bigmodel.cn/usercenter/auth)  page. After successful authentication, you will receive 5 million free tokens.

#### How is expiration handled for Batch?

If the Batch does not complete in time, it will be marked as expired; the uncompleted requests in the batch will be cancelled. For the completed requests in the batch, users can retrieve them via files and need to pay for the tokens consumed by these requests.

#### What are the storage limits for Batch files?

A maximum of 100 Batch files can be uploaded. The system only retains your files for 30 days; after expiration, the files will be automatically deleted and cannot be recovered.

#### How to delete Batch files?

Please go to the [Batch Data](https://open.bigmodel.cn/console/batch/dataset)  page to delete files, or delete them via the API.

#### More Questions

If the above content does not resolve your issue, please join the open platform community.

![img](https://open.bigmodel.cn/img/community.02407eb9.png)

Table of contents

Batch API Tutorial

Creating a Batch File

Uploading the File

Creating a Batch Task

Checking Batch Status

Downloading Batch Results

Deleting Files

Frequently Asked Questions