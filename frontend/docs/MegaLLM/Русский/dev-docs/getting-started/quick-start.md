# Быстрый старт

> Начните работу с MegaLLM API всего за несколько минут. Это руководство проведет вас через первоначальную настройку и ваш первый API-вызов.

<Info>
  **Требования**: Вам понадобится API-ключ MegaLLM для использования наших сервисов.
</Info>

## Установка

<Steps>
  <Step title="Получите ваш API-ключ">
    Сначала вам нужно получить ваш API-ключ MegaLLM. Этот ключ будет использоваться для аутентификации всех ваших API-запросов.

    ```bash  theme={null}
    export MEGALLM_API_KEY="your-api-key"
    ```

    См. наше [руководство по аутентификации](/ru/dev-docs/getting-started/authentication) для подробных инструкций по получению API-ключа.
  </Step>

  <Step title="Выберите формат API">
    MegaLLM поддерживает как OpenAI, так и Anthropic форматы API. Выберите тот, который лучше всего подходит для ваших нужд:

    <Tabs>
      <Tab title="Формат OpenAI">
        Установите базовый URL для использования OpenAI-совместимых эндпоинтов:

        ```bash  theme={null}
        export MEGALLM_BASE_URL="https://ai.megallm.io/v1"
        # Используйте ваш API-ключ MegaLLM
        export MEGALLM_API_KEY="your-api-key"
        ```
      </Tab>

      <Tab title="Формат Anthropic">
        Установите базовый URL для использования Anthropic-совместимых эндпоинтов:

        ```bash  theme={null}
        export ANTHROPIC_BASE_URL="https://ai.megallm.io"
        export ANTHROPIC_API_KEY=$MEGALLM_API_KEY
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="Сделайте ваш первый запрос">
    Теперь вы готовы сделать ваш первый API-вызов!

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

  <Step title="Проверьте вашу настройку">
    Если все настроено правильно, вы должны получить ответ, подобный этому:

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

## Следующие шаги

<CardGroup cols={2}>
  <Card title="Аутентификация" icon="key" href="/ru/dev-docs/getting-started/authentication">
    Узнайте о методах аутентификации и управлении API-ключами
  </Card>

  <Card title="OpenAI API" icon="code" href="/ru/dev-docs/openai/overview">
    Изучите OpenAI-совместимые эндпоинты
  </Card>

  <Card title="Anthropic API" icon="message-bot" href="/ru/dev-docs/anthropic/overview">
    Откройте для себя возможности Anthropic Claude API
  </Card>

  <Card title="Лучшие практики" icon="star" href="/ru/home/faq">
    Часто задаваемые вопросы и лучшие практики
  </Card>
</CardGroup>

## Распространенные проблемы

<Warning>
  **Ограничение скорости запросов**: Если вы столкнулись с ошибками ограничения скорости, ознакомьтесь с нашим [FAQ](/ru/home/faq) для получения рекомендаций.
</Warning>

<Warning>
  **Ошибка аутентификации**: Убедитесь, что ваш API-ключ действителен и имеет необходимые разрешения. Проверьте наше [руководство по аутентификации](/ru/dev-docs/getting-started/authentication) для решений.
</Warning>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt