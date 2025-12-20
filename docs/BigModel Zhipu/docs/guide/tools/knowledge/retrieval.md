# 对话调用知识库

<Info>
  通过在大语言模型生成答案之前，先从知识库中检索相关知识，然后将相关知识作为背景信息输入给大模型，有效地提升内容的准确性和相关性。
</Info>

## 构建知识库

用于管理知识文件，支持上传多个文件，并通过知识库 ID 后进行关联调用。知识库最大容量为 1G。

<Frame>
  ![know](https://cdn.bigmodel.cn/markdown/1756439490036knowledge.png)
</Frame>

## 对话调用关联知识库

创建知识库后，您获得一个知识库 ID。调用模型服务时，传入知识库 ID，使大模型能获取相关内容以响应用户查询。

#### 调用示例

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

    client = ZhipuAiClient(api_key="your-api-key") # 请填写您自己的 APIKey
    response = client.chat.completions.create(
        model="glm-4.6",  # 填写需要调用的模型名称
        messages=[
            {"role": "user", "content": "你好！你叫什么名字"},
        ],
        tools=[
                {
                    "type": "retrieval",
                    "retrieval": {
                        "knowledge_id": "your knowledge id",
                        "prompt_template": "从文档\n\"\"\"\n{{knowledge}}\n\"\"\"\n中找问题\n\"\"\"\n{{question}}\n\"\"\"\n的答案，找到答案就仅使用文档语句回答问题，找不到答案就用自身知识回答并且告诉用户该信息不是来自文档。\n不要复述问题，直接开始回答。"
                    }
                }
                ],
        stream=True,
    )
    for chunk in response:
        print(chunk.choices[0].delta.content, end='', flush=True)
    ```
  </Tab>

  <Tab title="python(旧)">
    ```python  theme={null}
    from zhipuai import ZhipuAI

    client = ZhipuAI(api_key="your-api-key") # 请填写您自己的 APIKey
    response = client.chat.completions.create(
        model="glm-4.6",  # 填写需要调用的模型名称
        messages=[
            {"role": "user", "content": "你好！你叫什么名字"},
        ],
        tools=[
                {
                    "type": "retrieval",
                    "retrieval": {
                        "knowledge_id": "your knowledge id",
                        "prompt_template": "从文档\n\"\"\"\n{{knowledge}}\n\"\"\"\n中找问题\n\"\"\"\n{{question}}\n\"\"\"\n的答案，找到答案就仅使用文档语句回答问题，找不到答案就用自身知识回答并且告诉用户该信息不是来自文档。\n不要复述问题，直接开始回答。"
                    }
                }
                ],
        stream=True,
    )
    for chunk in response:
        print(chunk.choices[0].delta.content, end='', flush=True)
    ```
  </Tab>
</Tabs>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt