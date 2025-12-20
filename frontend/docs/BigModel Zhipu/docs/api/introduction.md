# 使用概述

<Info>
  API 参考文档描述了您可以用来与 智谱AI 开放平台交互的 RESTful API 详情信息，您也可以通过点击 Try it 按钮调试 API。
</Info>

智谱AI 开放平台提供标准的 HTTP API 接口，支持多种编程语言和开发环境，同时也提供 [SDKs](/cn/guide/develop/python/introduction) 方便开发者调用。

## API 端点

智谱AI 开放平台的通用 API 端点如下：

```
https://open.bigmodel.cn/api/paas/v4
```

<Warning>
  注意：使用 [GLM 编码套餐](/cn/coding-plan/overview) 时，需要配置专属的 \
  Coding 端点 - [https://open.bigmodel.cn/api/coding/paas/v4](https://open.bigmodel.cn/api/coding/paas/v4) \
  而非通用端点 - [https://open.bigmodel.cn/api/paas/v4/](https://open.bigmodel.cn/api/paas/v4/) \
  注意：Coding API 端点仅限 Coding 场景，并不适用通用 API 场景，请区分使用。
</Warning>

## 身份验证

开放平台 API 使用标准的 **HTTP Bearer** 进行身份验证。
认证需要 API 密钥，您可以在 [API Keys 页面](https://bigmodel.cn/usercenter/proj-mgmt/apikeys) 创建或管理。

API 密钥应通过 HTTP 请求头中的 HTTP Bearer 身份验证提供。

```
Authorization: Bearer YOUR_API_KEY
```

<Tip>
  建议将 API Key 设置为环境变量替代硬编码到代码中，以提高安全性。
</Tip>

## 调试工具

在 API 详情页面，右上方有丰富的 **调用示例**，可以点击切换查看不同场景的示例。<br />
提供 API 调试工具允许开发者快速尝试 API 调用。只需在 API 详情页面点击 **Try it** 即可开始。

* 在 API 详情页面，有许多交互选项，有些交互按钮可能不容易发现需要您留意，例如 **切换输入类型下拉框**、**切换标签页** 和 **添加新内容** 等。
* 您可以点击 **Add an item** 或 **Add new property** 来添加 API 需要的更多属性。
* **注意**: 当切换不同标签页后，您需要重新输入或重新切换之前的属性值。

## 调用示例

<Tabs>
  <Tab title="cURL">
    ```bash  theme={null}
    curl -X POST "https://open.bigmodel.cn/api/paas/v4/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -d '{
        "model": "glm-4.6",
        "messages": [
            {
                "role": "system",
                "content": "你是一个有用的AI助手。"
            },
            {
                "role": "user",
                "content": "你好，请介绍一下自己。"
            }
        ],
        "temperature": 1.0,
        "stream": true
    }'
    ```
  </Tab>

  <Tab title="Python SDK">
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

    **使用示例**

    ```python  theme={null}
    from zai import ZhipuAiClient

    # 初始化客户端
    client = ZhipuAiClient(api_key="YOUR_API_KEY")

    # 创建聊天完成请求
    response = client.chat.completions.create(
        model="glm-4.6",
        messages=[
            {
                "role": "system",
                "content": "你是一个有用的AI助手。"
            },
            {
                "role": "user",
                "content": "你好，请介绍一下自己。"
            }
        ],
        temperature=0.6
    )

    # 获取回复
    print(response.choices[0].message.content)
    ```
  </Tab>

  <Tab title="Java SDK">
    **安装 SDK**

    **Maven**

    ```xml  theme={null}
    <dependency>
        <groupId>ai.z.openapi</groupId>
        <artifactId>zai-sdk</artifactId>
        <version>0.1.3</version>
    </dependency>
    ```

    **Gradle (Groovy)**

    ```groovy  theme={null}
    implementation 'ai.z.openapi:zai-sdk:0.1.3'
    ```

    **使用示例**

    ```java  theme={null}
    import ai.z.openapi.ZhipuAiClient;
    import ai.z.openapi.service.model.*;
    import java.util.Arrays;

    public class QuickStart {
        public static void main(String[] args) {
            // 初始化客户端
            ZhipuAiClient client = ZhipuAiClient.builder()
                .apiKey("YOUR_API_KEY")
                .build();

            // 创建聊天完成请求
            ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
                .model("glm-4.6")
                .messages(Arrays.asList(
                    ChatMessage.builder()
                        .role(ChatMessageRole.USER.value())
                        .content("Hello, who are you?")
                        .build()
                ))
                .stream(false)
                .temperature(0.6f)
                .maxTokens(1024)
                .build();

            // 发送请求
            ChatCompletionResponse response = client.chat().createChatCompletion(request);

            // 获取回复
            System.out.println(response.getData().getChoices().get(0).getMessage());
        }
    }
    ```
  </Tab>

  <Tab title="Python SDK(旧)">
    **安装 SDK**

    ```bash  theme={null}
    # 安装最新版本
    pip install zhipuai

    # 或指定版本
    pip install zhipuai==2.1.5.20250726
    ```

    **验证安装**

    ```python  theme={null}
    import zhipuai
    print(zhipuai.__version__)
    ```

    **使用示例**

    ```python  theme={null}
    from zhipuai import ZhipuAI

    client = ZhipuAI(api_key="YOUR_API_KEY")
    response = client.chat.completions.create(
        model="glm-4.6",
        messages=[
            {
                "role": "system",
                "content": "你是一个有用的AI助手。"
            },
            {
                "role": "user",
                "content": "你好，请介绍一下自己。"
            }
        ]
    )
    print(response.choices[0].message.content)
    ```
  </Tab>
</Tabs>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt