# HTTP API 调用

智谱AI 提供基于 RESTful 架构的应用程序接口，通过标准的 HTTP 协议与智谱AI 的模型服务进行交互。无论您使用什么编程语言或开发框架，都可以通过 HTTP 请求来调用智谱AI 的各种 AI 模型。

### 核心优势

<CardGroup cols={2}>
  <Card title="跨平台兼容" icon={<svg style={{maskImage: "url(/resource/icon/globe.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    支持所有支持 HTTP 协议的编程语言和平台
  </Card>

  <Card title="标准协议" icon={<svg style={{maskImage: "url(/resource/icon/shield-check.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    基于 RESTful 设计，遵循 HTTP 标准，易于理解和使用
  </Card>

  <Card title="灵活集成" icon={<svg style={{maskImage: "url(/resource/icon/puzzle-piece.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    可以集成到任何现有的应用程序和系统中
  </Card>

  <Card title="实时调用" icon={<svg style={{maskImage: "url(/resource/icon/bolt.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    支持同步和异步调用，满足不同场景需求
  </Card>
</CardGroup>

## 获取 API Key

1. 访问 [智谱AI 开放平台](https://bigmodel.cn)
2. 注册并登录您的账户
3. 在 [API Keys](https://bigmodel.cn/usercenter/proj-mgmt/apikeys) 管理页面创建 API Key
4. 复制您的 API Key 以供使用

<Tip>
  建议将 API Key 设置为环境变量替代硬编码到代码中，以提高安全性。
</Tip>

## API 基础信息

### 请求端点(通用API)

```
https://open.bigmodel.cn/api/paas/v4/
```

<Warning>
  注意：使用 [GLM 编码套餐](/cn/coding-plan/overview) 时，需要配置专属的 \
  Coding 端点 - [https://open.bigmodel.cn/api/coding/paas/v4](https://open.bigmodel.cn/api/coding/paas/v4) \
  而非通用端点 - [https://open.bigmodel.cn/api/paas/v4/](https://open.bigmodel.cn/api/paas/v4/) \
  注意：Coding API 端点仅限 Coding 场景，并不适用通用 API 场景，请区分使用。
</Warning>

### 请求头要求

<mcreference link="https://bigmodel.cn/dev/api/http-call/http-para" index="0">0</mcreference>

```http  theme={null}
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

### 支持的鉴权方式

<Tabs>
  <Tab title="API Key 鉴权">
    最简单的鉴权方式，直接使用您的 API Key：

    ```bash  theme={null}
    curl --location 'https://open.bigmodel.cn/api/paas/v4/chat/completions' \
    --header 'Authorization: Bearer YOUR_API_KEY' \
    --header 'Content-Type: application/json' \
    --data '{
        "model": "glm-4.6",
        "messages": [
            {
                "role": "user",
                "content": "你好"
            }
        ]
    }'
    ```
  </Tab>

  <Tab title="JWT Token 鉴权">
    使用 JWT Token 进行鉴权，适合需要更高安全性的场景：
    安装依赖 PyJWT

    ```shell  theme={null}
    pip install PyJWT
    ```

    ```python  theme={null}
    import time
    import jwt

    def generate_token(apikey: str, exp_seconds: int):
        try:
            id, secret = apikey.split(".")
        except Exception as e:
            raise Exception("invalid apikey", e)

        payload = {
            "api_key": id,
            "exp": int(round(time.time() * 1000)) + exp_seconds * 1000,
            "timestamp": int(round(time.time() * 1000)),
        }

        return jwt.encode(
            payload,
            secret,
            algorithm="HS256",
            headers={"alg": "HS256", "sign_type": "SIGN"},
        )

    # 使用生成的 token
    token = generate_token("your-api-key", 3600)  # 1 小时有效期
    ```
  </Tab>
</Tabs>

## 基础调用示例

### 简单对话

```bash  theme={null}
curl --location 'https://open.bigmodel.cn/api/paas/v4/chat/completions' \
--header 'Authorization: Bearer YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "model": "glm-4.6",
    "messages": [
        {
            "role": "user",
            "content": "请介绍一下人工智能的发展历程"
        }
    ],
    "temperature": 1.0,
    "max_tokens": 1024
}'
```

### 流式响应

```bash  theme={null}
curl --location 'https://open.bigmodel.cn/api/paas/v4/chat/completions' \
--header 'Authorization: Bearer YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "model": "glm-4.6",
    "messages": [
        {
            "role": "user",
            "content": "写一首关于春天的诗"
        }
    ],
    "stream": true
}'
```

### 多轮对话

```bash  theme={null}
curl --location 'https://open.bigmodel.cn/api/paas/v4/chat/completions' \
--header 'Authorization: Bearer YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "model": "glm-4.6",
    "messages": [
        {
            "role": "system",
            "content": "你是一个专业的编程助手"
        },
        {
            "role": "user",
            "content": "什么是递归？"
        },
        {
            "role": "assistant",
            "content": "递归是一种编程技术，函数调用自身来解决问题..."
        },
        {
            "role": "user",
            "content": "能给我一个 Python 递归的例子吗？"
        }
    ]
}'
```

## 常用编程语言示例

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    import requests
    import json

    def call_zhipu_api(messages, model="glm-4.6"):
        url = "https://open.bigmodel.cn/api/paas/v4/chat/completions"

        headers = {
            "Authorization": "Bearer YOUR_API_KEY",
            "Content-Type": "application/json"
        }

        data = {
            "model": model,
            "messages": messages,
            "temperature": 1.0
        }

        response = requests.post(url, headers=headers, json=data)

        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API调用失败: {response.status_code}, {response.text}")

    # 使用示例
    messages = [
        {"role": "user", "content": "你好，请介绍一下自己"}
    ]

    result = call_zhipu_api(messages)
    print(result['choices'][0]['message']['content'])
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    async function callZhipuAPI(messages, model = 'glm-4.6') {
        const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer YOUR_API_KEY',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: 0.6
            })
        });

        if (!response.ok) {
            throw new Error(`API 调用失败: ${response.status}`);
        }

        return await response.json();
    }

    // 使用示例
    const messages = [
        { role: 'user', content: '你好，请介绍一下自己' }
    ];

    callZhipuAPI(messages)
        .then(result => {
            console.log(result.choices[0].message.content);
        })
        .catch(error => {
            console.error('错误:', error);
        });
    ```
  </Tab>

  <Tab title="Java">
    ```java  theme={null}
    import com.fasterxml.jackson.databind.ObjectMapper;
    import okhttp3.MediaType;
    import okhttp3.OkHttpClient;
    import okhttp3.Request;
    import okhttp3.RequestBody;
    import okhttp3.Response;
    import java.util.Collections;
    import java.util.HashMap;
    import java.util.Map;

    public class AgentExample {

        public static void main(String[] args) throws Exception {

            OkHttpClient client = new OkHttpClient();
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> messages = new HashMap<>(8);
            messages.put("role", "user");
            messages.put("content", "你好，请介绍一下自己");
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "glm-4.6");
            requestBody.put("messages", Collections.singletonList(messages));
            requestBody.put("temperature", 0.6);

            String jsonBody = mapper.writeValueAsString(requestBody);
            MediaType JSON = MediaType.get("application/json; charset=utf-8");
            RequestBody body = RequestBody.create(JSON, jsonBody);
            Request request = new Request.Builder()
                .url("https://open.bigmodel.cn/api/paas/v4/chat/completions")
                .addHeader("Authorization", "Bearer your_api_key")
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();
            try (Response response = client.newCall(request).execute()) {
                System.out.println(response.body().string());
            }
        }
    }
    ```
  </Tab>
</Tabs>

## 错误处理

### 常见错误码

| 错误码 | 说明      | 解决方案            |
| --- | ------- | --------------- |
| 401 | 未授权     | 检查 API Key 是否正确 |
| 429 | 请求过于频繁  | 降低请求频率，实施重试机制   |
| 500 | 服务器内部错误 | 稍后重试，如持续出现请联系支持 |

更多错误码和解决方案请参考 [API 错误码文档](/cn/faq/api-code)

## 实践建议

<CardGroup cols={2}>
  <Card title="安全性">
    * 妥善保管 API Key，不要在代码中硬编码
    * 使用环境变量或配置文件存储敏感信息
    * 定期轮换 API Key
  </Card>

  <Card title="性能优化">
    * 实施连接池和会话复用
    * 合理设置超时时间
    * 使用异步请求处理高并发场景
  </Card>

  <Card title="错误处理">
    * 实施指数退避重试机制
    * 记录详细的错误日志
    * 设置合理的超时和重试次数
  </Card>

  <Card title="监控">
    * 监控 API 调用频率和成功率
    * 跟踪响应时间和错误率
    * 设置告警机制
  </Card>
</CardGroup>

## 更多资源

<CardGroup cols={2}>
  <Card title="API 文档" icon={<svg style={{maskImage: "url(/resource/icon/book.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>} href="/cn/api/introduction">
    查看完整的 API 接口文档和参数说明
  </Card>

  <Card title="技术支持" icon={<svg style={{maskImage: "url(/resource/icon/headset.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>} href="https://bigmodel.cn/online-book/customerService">
    获取技术支持和帮助
  </Card>
</CardGroup>

<Note>
  建议在生产环境中使用 HTTPS 协议，并实施适当的安全措施来保护您的 API 密钥和数据传输。
</Note>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt