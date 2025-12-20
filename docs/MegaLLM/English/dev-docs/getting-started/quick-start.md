# Quick Start

> Get up and running with MegaLLM API in just a few minutes. This guide will walk you through the initial setup and your first API call.

<Info>
  **Prerequisites**: You'll need a MegaLLM API key to use our services.
</Info>

## Installation

<Steps>
  <Step title="Get Your API Key">
    First, you'll need to obtain your MegaLLM API key. This key will be used to authenticate all your API requests.

    ```bash  theme={null}
    export MEGALLM_API_KEY="your-api-key"
    ```

    See our [Authentication Guide](/dev-docs/getting-started/authentication) for detailed instructions on obtaining your API key.
  </Step>

  <Step title="Choose Your API Format">
    MegaLLM supports both OpenAI and Anthropic API formats. Choose the one that best fits your needs:

    <Tabs>
      <Tab title="OpenAI Format">
        Set your base URL to use OpenAI-compatible endpoints:

        ```bash  theme={null}
        export MEGALLM_BASE_URL="https://ai.megallm.io/v1"
        # Use your MegaLLM API key
        export MEGALLM_API_KEY="your-api-key"
        ```
      </Tab>

      <Tab title="Anthropic Format">
        Set your base URL to use Anthropic-compatible endpoints:

        ```bash  theme={null}
        export ANTHROPIC_BASE_URL="https://ai.megallm.io"
        export ANTHROPIC_API_KEY=$MEGALLM_API_KEY
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="Make Your First Request">
    Now you're ready to make your first API call!

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

  <Step title="Verify Your Setup">
    If everything is set up correctly, you should receive a response like this:

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

## Next Steps

<CardGroup cols={2}>
  <Card title="Authentication" icon="key" href="/en/dev-docs/getting-started/authentication">
    Learn about authentication methods and API key management
  </Card>

  <Card title="OpenAI API" icon="code" href="/en/dev-docs/openai/overview">
    Explore the OpenAI-compatible endpoints
  </Card>

  <Card title="Anthropic API" icon="message-bot" href="/en/dev-docs/anthropic/overview">
    Discover Anthropic Claude API features
  </Card>

  <Card title="Best Practices" icon="star" href="/en/home/faq">
    Common questions and best practices
  </Card>
</CardGroup>

## Common Issues

<Warning>
  **Rate Limiting**: If you encounter rate limit errors, check our [FAQ](/home/faq) for guidance.
</Warning>

<Warning>
  **Authentication Failed**: Make sure your API key is valid and has the necessary permissions. Check our [Authentication Guide](/dev-docs/getting-started/authentication) for solutions.
</Warning>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt