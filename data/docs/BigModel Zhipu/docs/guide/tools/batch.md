# 批量处理

<Info>
  Batch API 专为处理大规模数据请求而设计，适用于无需即时反馈的任务。通过 Batch API，开发者可以通过文件提交大量任务，且价格降低 50%（GLM-4-Flash 免费）、无并发限制。
</Info>

## 典型应用场景

<CardGroup cols={3}>
  <Card title="文章分类" icon={<svg style={{maskImage: "url(/resource/icon/brain.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    为大量文章、帖子或产品描述添加分类标签。
  </Card>

  <Card title="情感分析" icon={<svg style={{maskImage: "url(/resource/icon/function.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    评估客户反馈、社交媒体帖子和商品评价的情感倾向。
  </Card>

  <Card title="信息提取" icon={<svg style={{maskImage: "url(/resource/icon/arrow-up.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    从文本数据中识别和抽取关键内容。
  </Card>
</CardGroup>

## 批量使用教程

我们将通过一个情感分析的实际案例来演示如何使用 Batch API。在这个示例中，我们将使用 GLM-4 对商品评价进行情感分类（正面、中性、负面），并添加特定问题标签（如产品缺陷、配送延迟、客服态度等）。

### 步骤 1：创建 Batch 文件

Batch 文件的格式应为 `.jsonl`，其中每个请求占据一行（JSON 对象）。每一行包含 API 单个请求的详细信息。

#### GLM-4-PLUS 文本处理示例

```json  theme={null}
{
    "custom_id": "request-1",
    "method": "POST",
    "url": "/v4/chat/completions", 
    "body": {
        "model": "glm-4-plus",
        "messages": [
            {"role": "system","content": "你是一个意图分类器."},
            {"role": "user", "content": "# 任务：对以下用户评论进行情感分类和特定问题标签标注，只输出结果，# 评论：review = 订单处理速度太慢，等了很久才发货。# 输出格式：{ \"分类标签\": \" \",\"特定问题标注\": \" \"}"}
        ],
        "temperature": 0.1
    }
}
```

#### GLM-4V-PLUS 图像处理示例

```json  theme={null}
{
  "custom_id": "request-1",
  "method": "POST",
  "url": "/v4/chat/completions",
  "body": {
      "model": "glm-4v-plus",
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

#### CogView-3 图像生成示例

```json  theme={null}
{
  "custom_id": "request-1",
  "method": "POST",
  "url": "/v4/images/generations",
  "body": {
      "model": "cogview-3",
      "prompt": "一只可爱的小猫咪"
  }
}
```

#### Embedding 向量化示例

```json  theme={null}
{
  "custom_id": "request-1",
  "method": "POST",
  "url": "/v4/embeddings",
  "body": {
      "model": "embedding-2",
      "input": "你好"
  }
}
```

#### JSONL文件示例

构建的 .jsonl 文件如下，本示例中包含 10 个请求，单个文件最多支持 50000 个请求且大小不超过 100M：

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

### 步骤 2：上传 Batch 文件

首先需要将准备好的 `.jsonl` 文件上传到平台：

<Tabs>
  <Tab title="python">
    ```python  theme={null}
    from zai import ZhipuAiClient

    client = ZhipuAiClient(api_key="your-api-key")

    # 上传批处理文件
    file_object = client.files.create(
        file=open("batch_requests.jsonl", "rb"),
        purpose="batch"
    )
    print(file_object)
    ```
  </Tab>
</Tabs>

### 步骤 3：创建 Batch 任务

使用上传文件的 ID 创建批处理任务：

<Tabs>
  <Tab title="python">
    ```python  theme={null}
    from zai import ZhipuAiClient

    client = ZhipuAiClient(api_key="your-api-key")
    # 创建批处理任务
    batch = client.batches.create(
        input_file_id=file_object.id,
        endpoint="/v4/chat/completions",
        auto_delete_input_file=True,
        metadata={
            "description": "商品评价情感分析",
            "project": "sentiment_analysis"
        }
    )
    print(batch)
    ```
  </Tab>
</Tabs>

### 步骤 4：监控任务状态

定期检查批处理任务的执行状态：

<Tabs>
  <Tab title="python">
    ```python  theme={null}
    import time
    from zai import ZhipuAiClient

    client = ZhipuAiClient(api_key="your-api-key")

    # 检查任务状态
    while True:
        batch_status = client.batches.retrieve("your_batch_id")
        print(f"任务状态: {batch_status.status}")
        
        if batch_status.status == "completed":
            print("任务完成！")
            break
        elif batch_status.status in ["failed", "expired", "cancelled"]:
            print(f"任务失败，状态: {batch_status.status}")
            break
        
        time.sleep(30)  # 等待30秒后再次检查
    ```
  </Tab>
</Tabs>

|      状态      |           描述          |
| :----------: | :-------------------: |
|  validating  |  文件正在验证中，Batch 任务未开始  |
|    failed    |        文件未通过验证        |
| in\_progress | 文件已成功验证，Batch 任务正在进行中 |
|  finalizing  |  Batch 任务已完成，结果正在准备中  |
|   completed  |   Batch 任务已完成，结果已准备好  |
|    expired   |      Batch 任务未能完成     |
|  cancelling  |     Batch 任务正在取消中     |
|   cancelled  |      Batch 任务已取消      |

### 步骤 5：下载结果

Batch 任务完成后，您可以使用 Batch 对象中的 output\_file\_id 字段下载结果，并将其保存到本地。

1. 系统会对 Batch 结果文件分开保存，请分别进行下载：

* output\_file\_id：保存成功执行请求的输出文件的ID。
* error\_file\_id：保存出现错误请求的输出文件的ID。

2. 系统只保留您的数据30天。请及时下载和备份您的数据，过期后文件将自动删除，无法恢复。

<Tabs>
  <Tab title="python">
    ```python  theme={null}
    # 下载结果文件
    if batch_status.status == "completed":
        result_content = client.files.content(batch_status.output_file_id)
        result_content.write_to_file("batch_results.jsonl")
        print("结果文件下载完成: batch_results.jsonl")
        
        # 如果有错误文件，也可以下载
        if batch_status.error_file_id:
            error_content = client.files.content(batch_status.error_file_id)
            error_content.write_to_file("batch_errors.jsonl")
            print("错误文件下载完成: batch_errors.jsonl")
    ```
  </Tab>
</Tabs>

最终处理完成的结果如下：

````
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":26,"prompt_tokens":89,"total_tokens":115},"model":"glm-4","id":"8668357533850320547","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"负面\",\n  \"特定问题标注\": \"订单处理慢\"\n}\n```"}}],"request_id":"615-request-1"}},"custom_id":"request-1","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":22,"prompt_tokens":94,"total_tokens":116},"model":"glm-4","id":"8668368425887509080","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n \"分类标签\": \"负面\",\n \"特定问题标注\": \"产品缺陷\"\n}\n```"}}],"request_id":"616-request-2"}},"custom_id":"request-2","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":25,"prompt_tokens":86,"total_tokens":111},"model":"glm-4","id":"8668355815863214980","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"正面\",\n  \"特定问题标注\": \"性价比\"\n}\n```"}}],"request_id":"617-request-3"}},"custom_id":"request-3","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":28,"prompt_tokens":89,"total_tokens":117},"model":"glm-4","id":"8668355815863214981","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"负面\",\n  \"特定问题标注\": \"说明文档不清晰\"\n}\n```"}}],"request_id":"618-request-4"}},"custom_id":"request-4","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":26,"prompt_tokens":88,"total_tokens":114},"model":"glm-4","id":"8668357533850320546","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"中性\",\n  \"特定问题标注\": \"价格问题\"\n}\n```"}}],"request_id":"619-request-5"}},"custom_id":"request-5","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":26,"prompt_tokens":90,"total_tokens":116},"model":"glm-4","id":"8668356159460662846","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"负面\",\n  \"特定问题标注\": \"配送延迟\"\n}\n```"}}],"request_id":"620-request-6"}},"custom_id":"request-6","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":27,"prompt_tokens":88,"total_tokens":115},"model":"glm-4","id":"8668357671289274638","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"负面\",\n  \"特定问题标注\": \"产品描述不符\"\n}\n```"}}],"request_id":"621-request-7"}},"custom_id":"request-7","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959702,"usage":{"completion_tokens":26,"prompt_tokens":87,"total_tokens":113},"model":"glm-4","id":"8668355644064514872","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"正面\",\n  \"特定问题标注\": \"客服态度\"\n}\n```"}}],"request_id":"622-request-8"}},"custom_id":"request-8","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":29,"prompt_tokens":90,"total_tokens":119},"model":"glm-4","id":"8668357671289274639","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"负面\",\n  \"特定问题标注\": \"包装问题, 产品损坏\"\n}\n```"}}],"request_id":"623-request-9"}},"custom_id":"request-9","id":"batch_1791490810192076800"}
{"response":{"status_code":200,"body":{"created":1715959701,"usage":{"completion_tokens":27,"prompt_tokens":87,"total_tokens":114},"model":"glm-4","id":"8668355644064514871","choices":[{"finish_reason":"stop","index":0,"message":{"role":"assistant","content":"```json\n{\n  \"分类标签\": \"正面\",\n  \"特定问题标注\": \"产品描述不符\"\n}\n```"}}],"request_id":"624-request-10"}},"custom_id":"request-10","id":"batch_1791490810192076800"}

````

### 删除文件

上传 Batch 文件时，每次最多上传 1000 个。若任务量巨大，请及时删除已处理完毕的文件，以便继续上传新文件。

```python  theme={null}
from zai import ZhipuAiClient

client = ZhipuAiClient(api_key="your-api-key")

result = client.files.delete(
    file_id="文件id"
)
```

### 文件限制

* 单个文件最多支持 50,000 个请求
* 文件大小不超过 100MB
* 每个 batch 文件只能包含对单个模型的请求
* 每个请求必须包含 `custom_id` 且是唯一的，用来将结果和输入进行匹配

## 接口信息

[接口文档](/api-reference/%E6%89%B9%E5%A4%84%E7%90%86-api/%E5%88%97%E5%87%BA%E6%89%B9%E5%A4%84%E7%90%86%E4%BB%BB%E5%8A%A1)：API 调用方式

<Tabs>
  <Tab title="创建 Batch 任务">
    ### 接口详情

    * **传输方式**: `https`
    * **请求地址**: `https://open.bigmodel.cn/api/paas/v4/batches`
    * **调用方式**: 同步调用
    * **请求格式**: `JSON`
    * **响应格式**: `JSON`
    * **接口请求类型**: `POST`

    ### 请求参数

    | 参数名称                      | 类型             | 是否必填 | 参数说明                                                                                                        |
    | :------------------------ | :------------- | :--- | :---------------------------------------------------------------------------------------------------------- |
    | input\_file\_id           | string         | 是    | 上传文件的 ID，该文件包含Batch的请求。<br />输入文件必须是 .Jsonl 格式，并且文件上传时的目的必须标记为"batch"。                                      |
    | endpoint                  | string         | 是    | Batch 中所有请求将使用的端点。<br />目前支持 `/v4/chat/completions`。                                                        |
    | completion\_window        | string         | 废弃   | 原有的时间参数已不再适用，新的任务调度策略将根据系统负载情况自动调整。<br />预计任务将在24小时内完成，如果任务超过7天未处理完，将自动取消。                                  |
    | auto\_delete\_input\_file | bool           | 否    | 是否自动删除batch原始文件，默认为True.<br /> True：执行自动删除。False：保留原始batch文件。                                               |
    | metadata                  | object or null | 否    | 用于存储与 Batch 相关的数据，如客户ID、描述或其他任务管理和跟踪所需的额外信息。<br />可附加到对象上的键值对集合最多为 16 个。每个键的长度最多为 64 个字符，每个值的长度最多为 512 个字符。 |

    ### 请求示例

    <Tabs>
      <Tab title="python">
        **安装 SDK**

        ```bash  theme={null}
        # 安装最新版本
        pip install zai-sdk

        # 或指定版本
        pip install zai-sdk==0.1.0
        ```

        **验证安装**

        ```python  theme={null}
        import zai
        print(zai.__version__)
        ```

        ```python  theme={null}
        from zai import ZhipuAiClient

        client = ZhipuAiClient(api_key="")  # 填写您自己的APIKey

        create = client.batches.create(
            input_file_id="file_123",
            endpoint="/v4/chat/completions",
            auto_delete_input_file=True,
            metadata={
                "description": "Sentiment classification"
            }
        )
        print(create)
        ```
      </Tab>

      <Tab title="python(旧)">
        ```python  theme={null}
        from zhipuai import ZhipuAI

        client = ZhipuAI(api_key="your-api-key")  # 填写您自己的APIKey

        create = client.batches.create(
            input_file_id="file_123",
            endpoint="/v4/chat/completions",
            auto_delete_input_file=True,
            metadata={
                "description": "Sentiment classification"
            }
        )
        print(create)
        ```
      </Tab>
    </Tabs>

    ### 响应内容

    返回 `Batch` 对象。
  </Tab>

  <Tab title="检索 Batch 任务">
    ### 接口详情

    * **传输方式**: `https`
    * **请求地址**: `https://open.bigmodel.cn/api/paas/v4/batches/{batch_id}`
    * **调用方式**: 同步调用
    * **请求格式**: `REST`
    * **响应格式**: `JSON`
    * **接口请求类型**: `GET`

    ### 请求参数

    | 参数名称      | 类型     | 是否必填 | 参数说明                             |
    | :-------- | :----- | :--- | :------------------------------- |
    | batch\_id | String | 必填   | 此参数为批处理任务的唯一标识符，用于指定需要检索的 Batch。 |

    ### 请求示例

    <Tabs>
      <Tab title="python">
        ```python  theme={null}
        from zai import ZhipuAiClient

        client = ZhipuAiClient(api_key="your-api-key")  # 填写您自己的APIKey

        retrieve = client.batches.retrieve("batch_123")
        print(retrieve)
        ```
      </Tab>

      <Tab title="python(旧)">
        ```python  theme={null}
        from zhipuai import ZhipuAI

        client = ZhipuAI(api_key="your-api-key")  # 填写您自己的APIKey

        retrieve = client.batches.retrieve("batch_123")
        print(retrieve)
        ```
      </Tab>
    </Tabs>

    ### 响应内容

    返回 `Batch` 对象。
  </Tab>

  <Tab title="取消 Batch 任务">
    ### 接口详情

    * **传输方式**: `https`
    * **请求地址**: `https://open.bigmodel.cn/api/paas/v4/batches/{batch_id}/cancel`
    * **调用方式**: 同步调用
    * **请求格式**: `REST`
    * **响应格式**: `JSON`
    * **接口请求类型**: `POST`

    ### 请求参数

    | 参数名称      | 类型     | 是否必填 | 参数说明                  |
    | :-------- | :----- | :--- | :-------------------- |
    | batch\_id | String | 必填   | 要取消的 Batch 任务的唯一标识符。。 |

    ### 请求示例

    <Tabs>
      <Tab title="python">
        ```python  theme={null}
        from zai import ZhipuAiClient

        client = ZhipuAiClient(api_key="")  # 填写您自己的APIKey

        cancel = client.batches.cancel("batch_123")
        print(cancel)
        ```
      </Tab>

      <Tab title="python(旧)">
        ```python  theme={null}
        from zhipuai import ZhipuAI

        client = ZhipuAI(api_key="your-api-key")  # 填写您自己的APIKey

        cancel = client.batches.cancel("batch_123")
        print(cancel)
        ```
      </Tab>
    </Tabs>

    ### 响应内容

    返回 `Batch` 对象。
  </Tab>

  <Tab title="列出 Batch 任务">
    ### 接口详情

    * **传输方式**: `https`
    * **请求地址**: `https://open.bigmodel.cn/api/paas/v4/batches`
    * **调用方式**: 同步调用
    * **请求格式**: `Query`
    * **响应格式**: `JSON`
    * **接口请求类型**: `GET`

    ### 请求参数

    | 参数名称  | 类型     | 是否必填 | 参数说明                                                                                                                 |
    | :---- | :----- | :--- | :------------------------------------------------------------------------------------------------------------------- |
    | after | String | 非必填  | 此参数用作分页游标，指定从特定对象ID之后开始检索列表。例如，如果您的上一请求返回了包含对象 `obj_foo` 的列表，并希望继续从这一点获取后续内容，可以将 `after=obj_foo` 包括在您的下一请求中以获取下一页数据。 |
    | limit | int    | 非必填  | 限制返回对象的数量。`limit` 的范围可以是 1 到 100，默认值为 20。                                                                            |

    ### 请求示例

    <Tabs>
      <Tab title="python">
        ```python  theme={null}
        from zai import ZhipuAiClient

        client = ZhipuAiClient(api_key="your-api-key")  # 填写您自己的APIKey

        # client.batches.list返回了SyncCursorPage
        batch_list = client.batches.list(limit=10)
        print(batch_list)
        # SyncCursorPage的get_next_page 可用于获取当前 after+1的数据
        next_page = batch_list.get_next_page()
        print(next_page)
        # SyncCursorPage的iter_pages 返回一个分页迭代器，可以使用collections相关api
        for batch in batch_list.iter_pages():
            print(batch)
        ```
      </Tab>

      <Tab title="python(旧)">
        ```python  theme={null}
        from zhipuai import ZhipuAI

        client = ZhipuAI(api_key="your-api-key")  # 填写您自己的APIKey

        # client.batches.list返回了SyncCursorPage
        batch_list = client.batches.list(limit=10)
        print(batch_list)
        # SyncCursorPage的get_next_page 可用于获取当前 after+1的数据
        next_page = batch_list.get_next_page()
        print(next_page)
        # SyncCursorPage的iter_pages 返回一个分页迭代器，可以使用collections相关api
        for batch in batch_list.iter_pages():
            print(batch)
        ```
      </Tab>
    </Tabs>

    ### 响应内容

    返回 `Batch` 对象。
  </Tab>

  <Tab title="下载 Batch 结果">
    完成批处理任务后，您可以通过使用Batch对象中的`output_file_id`字段对Files API发出请求，将输出文件下载到本地。

    ### 接口详情

    * **传输方式**: `https`
    * **请求地址**: `https://open.bigmodel.cn/api/paas/v4/files/{file_id}/content`
    * **调用方式**: 同步调用
    * **请求格式**: `REST`
    * **响应格式**: `FILE`
    * **接口请求类型**: `GET`

    ### 请求参数

    | 参数名称     | 类型     | 是否必填 | 参数说明                         |
    | -------- | ------ | ---- | ---------------------------- |
    | file\_id | String | 必填   | 被请求的文件的唯一标识符，用于指定要获取内容的特定文件。 |

    ### 请求示例

    <Tabs>
      <Tab title="python">
        ```python  theme={null}
        from zai import ZhipuAiClient

        client = ZhipuAiClient(api_key="")  # 填写您自己的APIKey
        # client.files.content返回 _legacy_response.HttpxBinaryResponseContent实例
        content = client.files.content("result_123")
        # 使用write_to_file方法把返回结果写入文件
        content.write_to_file("write_to_file_batchoutput.jsonl")
        ```
      </Tab>

      <Tab title="python(旧)">
        ```python  theme={null}
        from zhipuai import ZhipuAI

        client = ZhipuAI(api_key="your-api-key")  # 填写您自己的APIKey
        # client.files.content返回 _legacy_response.HttpxBinaryResponseContent实例
        content = client.files.content("result_123")
        # 使用write_to_file方法把返回结果写入文件
        content.write_to_file("write_to_file_batchoutput.jsonl")
        ```
      </Tab>
    </Tabs>

    ### 接口响应

    遵守文件流协议。
  </Tab>
</Tabs>

### Batch 对象结构

<Accordion title="点击展开/折叠 Batch 对象详细信息">
  | 字段名                | 类型      | 描述                                                                      |
  | ------------------ | ------- | ----------------------------------------------------------------------- |
  | id                 | string  | 批处理的唯一标识符。                                                              |
  | object             | string  | 对象类型，这里为 "batch"。                                                       |
  | endpoint           | string  | 批处理使用的 API 端点。                                                          |
  | input\_file\_id    | string  | 批处理使用的输入文件的ID。                                                          |
  | completion\_window | string  | 批处理应在此时间框架内完成的期限。                                                       |
  | status             | string  | 批处理的当前状态。                                                               |
  | output\_file\_id   | string  | 包含成功执行请求的输出的文件ID。                                                       |
  | error\_file\_id    | string  | 包含出现错误的请求的输出的文件ID。                                                      |
  | created\_at        | integer | 创建批处理的Unix时间戳（秒）。                                                       |
  | in\_progress\_at   | integer | 批处理开始处理的Unix时间戳（秒）。                                                     |
  | expires\_at        | integer | 批处理将过期的Unix时间戳（秒）。                                                      |
  | finalizing\_at     | integer | 批处理开始最终处理的Unix时间戳（秒）。                                                   |
  | completed\_at      | integer | 批处理完成的Unix时间戳（秒）。                                                       |
  | failed\_at         | integer | 批处理失败的Unix时间戳（秒）。                                                       |
  | expired\_at        | integer | 批处理过期的Unix时间戳（秒）。                                                       |
  | cancelling\_at     | integer | 批处理开始取消的Unix时间戳（秒）。                                                     |
  | cancelled\_at      | integer | 批处理取消完成的Unix时间戳（秒）。                                                     |
  | request\_counts    | object  | batch 请求计数。                                                             |
  | total              | integer | 批处理中的请求总数。                                                              |
  | completed          | integer | 批处理中已成功完成的请求数量。                                                         |
  | failed             | integer | 批处理中失败的请求数量。                                                            |
  | metadata           | map     | 可附加到对象上的 16 个键值对的集合。这有助于以结构化格式存储对象的附加信息。键的长度最多为 64 个字符，值的长度最多为 512 个字符。 |
</Accordion>

## 常见问题

<Accordion title="Batch API的价格如何？">
  价格是标准 API 的 50%。参考 [产品定价](https://open.bigmodel.cn/pricing)
</Accordion>

<Accordion title="Batch API 支持哪些模型和并发限制？">
  Batch API 的并发限制与现有的每个模型并发限制是分开的。Batch API 引入了两种新的限制：

  * 单个 Batch 文件中包含最多 50,000 个请求且不超过 100M。
  * 每个模型的 Batch 有最大排队限制。当达到请求队列上限时，请等待当前任务完成后再提交新任务。
  * 向量模型（Embedding-2、Embedding-3）Batch 文件请求数量限制为不超过 10000 次。

  |         模型名称        | Batch 队列限制 |
  | :-----------------: | :--------: |
  |   GLM-4-Air-250414  |    200万次   |
  | GLM-4-FlashX-250414 |    200万次   |
  |     Embedding-2     |    200万次   |
  |     Embedding-3     |    200万次   |
  |      GLM-4-Plus     |    200万次   |
  |      GLM-4-0520     |    50万次    |
  |        GLM-4        |    50万次    |
  |   Cogview-4-250304  |     1万次    |
  |     CogVideoX-2     |     1万次    |
  |        GLM-4V       |     1万次    |
  |      GLM-4-Long     |    20万次    |
  |   GLM-4V-Plus-0111  |     1万次    |
  |     GLM-4V-Plus     |     1万次    |
  |    CogView-3-Plus   |     1万次    |
</Accordion>

<Accordion title="如何在调用Batch API 前进行实名认证？">
  调用 Batch API 必须实名认证，请先前往 [实名认证](https://open.bigmodel.cn/usercenter/settings/auth) 页面完成个人认证或企业认证，成功认证后，将免费获得 500 万 tokens。
</Accordion>

<Accordion title="如何下载 Batch 结果文件？">
  当批处理任务完成后，系统会生成两个文件，请分别进行下载：

  1. **输出文件** (`output_file_id`): 包含成功执行的请求结果
  2. **错误文件** (`error_file_id`): 包含出现错误的请求信息
</Accordion>

<Accordion title="Batch 的过期如何处理？">
  如果 Batch 未能及时完成，该批次将被标记为过期状态；批次中未完成的请求将被取消。对于批次中已完成的请求，用户可以通过文件获取，并且需要支付这些请求消耗的费用。
</Accordion>

<Accordion title="Batch 文件有哪些存储限制？">
  Batch 文件最多上传 1000 个文件。系统只保留您的文件 30 天，过期后文件将自动删除，无法恢复。
</Accordion>

<Accordion title="如何删除 Batch 文件？">
  请前往 [Batch 页面](https://www.bigmodel.cn/console/batch/task) 进行删除、或通过调用接口删除。
</Accordion>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt