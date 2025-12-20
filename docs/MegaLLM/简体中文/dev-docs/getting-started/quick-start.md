# 快速开始

> 在几分钟内开始使用 MegaLLM API。本指南将引导您完成初始设置和第一次 API 调用。

<Info>
  **前提条件**: 您需要一个 MegaLLM API 密钥才能使用我们的服务。
</Info>

## 安装

<Steps>
  <Step title="获取您的 API 密钥">
    首先,您需要获取 MegaLLM API 密钥。此密钥将用于验证您的所有 API 请求。

    ```bash  theme={null}
    export MEGALLM_API_KEY="your-api-key"
    ```

    查看我们的[身份验证指南](/cn/dev-docs/getting-started/authentication)以获取有关获取 API 密钥的详细说明。
  </Step>

  <Step title="选择您的 API 格式">
    MegaLLM 同时支持 OpenAI 和 Anthropic API 格式。选择最适合您需求的格式:

    <Tabs>
      <Tab title="OpenAI Format">
        设置您的基础 URL 以使用与 OpenAI 兼容的端点:

        ```bash  theme={null}
        export MEGALLM_BASE_URL="https://ai.megallm.io/v1"
        # 使用您的 MegaLLM API 密钥
        export MEGALLM_API_KEY="your-api-key"
        ```
      </Tab>

      <Tab title="Anthropic Format">
        设置您的基础 URL 以使用与 Anthropic 兼容的端点:

        ```bash  theme={null}
        export ANTHROPIC_BASE_URL="https://ai.megallm.io"
        export ANTHROPIC_API_KEY=$MEGALLM_API_KEY
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="发出您的第一个请求">
    现在您已准备好进行第一次 API 调用!

    <CodeGroup>
      ```bash cURL theme={null}
      curl https://ai.megallm.io/v1/chat/completions \
        -H "Authorization: Bearer $MEGALLM_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gpt-4",
          "messages": [
            {
              "role": "user",
              "content": "Hello! Can you introduce yourself?"
            }
          ],
          "max_tokens": 100
        }'
      ```

      ```python Python theme={null}
      import requests
      import os

      response = requests.post(
          "https://ai.megallm.io/v1/chat/completions",
          headers={
              "Authorization": f"Bearer {os.getenv('MEGALLM_API_KEY')}",
              "Content-Type": "application/json"
          },
          json={
              "model": "gpt-4",
              "messages": [
                  {
                      "role": "user",
                      "content": "Hello! Can you introduce yourself?"
                  }
              ],
              "max_tokens": 100
          }
      )

      print(response.json())
      ```

      ```javascript JavaScript theme={null}
      const response = await fetch("https://ai.megallm.io/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.MEGALLM_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: "Hello! Can you introduce yourself?"
            }
          ],
          max_tokens: 100
        })
      });

      const data = await response.json();
      console.log(data);
      ```

      ```go Go theme={null}
      package main

      import (
          "bytes"
          "encoding/json"
          "net/http"
          "os"
      )

      func main() {
          payload := map[string]interface{}{
              "model": "gpt-4",
              "messages": []map[string]string{
                  {
                      "role": "user",
                      "content": "Hello! Can you introduce yourself?",
                  },
              },
              "max_tokens": 100,
          }

          body, _ := json.Marshal(payload)

          req, _ := http.NewRequest("POST",
              "https://ai.megallm.io/v1/chat/completions",
              bytes.NewBuffer(body))

          req.Header.Set("Authorization", "Bearer " + os.Getenv("MEGALLM_API_KEY"))
          req.Header.Set("Content-Type", "application/json")

          client := &http.Client{}
          resp, _ := client.Do(req)
          defer resp.Body.Close()
      }
      ```
    </CodeGroup>
  </Step>

  <Step title="验证您的设置">
    如果一切设置正确,您应该会收到如下响应:

    ```json  theme={null}
    {
      "id": "chatcmpl-123",
      "object": "chat.completion",
      "created": 1677652288,
      "model": "gpt-4",
      "choices": [
        {
          "index": 0,
          "message": {
            "role": "assistant",
            "content": "Hello! I'm an AI assistant powered by MegaLLM..."
          },
          "finish_reason": "stop"
        }
      ],
      "usage": {
        "prompt_tokens": 10,
        "completion_tokens": 25,
        "total_tokens": 35
      }
    }
    ```
  </Step>
</Steps>

## 下一步

<CardGroup cols={2}>
  <Card title="身份验证" icon="key" href="/cn/dev-docs/getting-started/authentication">
    了解身份验证方法和 API 密钥管理
  </Card>

  <Card title="OpenAI API" icon="code" href="/cn/dev-docs/openai/overview">
    探索与 OpenAI 兼容的端点
  </Card>

  <Card title="Anthropic API" icon="message-bot" href="/cn/dev-docs/anthropic/overview">
    发现 Anthropic Claude API 功能
  </Card>

  <Card title="最佳实践" icon="star" href="/cn/home/faq">
    常见问题和最佳实践
  </Card>
</CardGroup>

## 常见问题

<Warning>
  **速率限制**: 如果您遇到速率限制错误,请查看我们的[常见问题](/cn/home/faq)获取指导。
</Warning>

<Warning>
  **身份验证失败**: 确保您的 API 密钥有效并具有必要的权限。查看我们的[身份验证指南](/cn/dev-docs/getting-started/authentication)以获取解决方案。
</Warning>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt