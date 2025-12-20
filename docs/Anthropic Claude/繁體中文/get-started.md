# 開始使用 Claude

進行您的第一次 API 呼叫至 Claude 並建立一個簡單的網路搜尋助手

---

## 先決條件

- 一個 Anthropic [Console 帳戶](/)
- 一個 [API 金鑰](/settings/keys)

## 呼叫 API

<Tabs>
  <Tab title="cURL">
    <Steps>
      <Step title="設定您的 API 金鑰">
        從 [Claude Console](/settings/keys) 取得您的 API 金鑰並將其設定為環境變數：

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="進行您的第一次 API 呼叫">
        執行此命令以建立一個簡單的網路搜尋助手：

        ```bash
        curl https://api.anthropic.com/v1/messages \
          -H "Content-Type: application/json" \
          -H "x-api-key: $ANTHROPIC_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -d '{
            "model": "claude-sonnet-4-5",
            "max_tokens": 1000,
            "messages": [
              {
                "role": "user", 
                "content": "What should I search for to find the latest developments in renewable energy?"
              }
            ]
          }'
        ```

        **範例輸出：**
        ```json
        {
          "id": "msg_01HCDu5LRGeP2o7s2xGmxyx8",
          "type": "message", 
          "role": "assistant",
          "content": [
            {
              "type": "text",
              "text": "Here are some effective search strategies to find the latest renewable energy developments:\n\n## Search Terms to Use:\n- \"renewable energy news 2024\"\n- \"clean energy breakthrough\"\n- \"solar/wind/battery technology advances\"\n- \"green energy innovations\"\n- \"climate tech developments\"\n- \"energy storage solutions\"\n\n## Best Sources to Check:\n\n**News & Industry Sites:**\n- Renewable Energy World\n- GreenTech Media (now Wood Mackenzie)\n- Energy Storage News\n- CleanTechnica\n- PV Magazine (for solar)\n- WindPower Engineering & Development..."
            }
          ],
          "model": "claude-sonnet-4-5",
          "stop_reason": "end_turn",
          "usage": {
            "input_tokens": 21,
            "output_tokens": 305
          }
        }
        ```
      </Step>
    </Steps>
  </Tab>

  <Tab title="Python">
    <Steps>
      <Step title="設定您的 API 金鑰">
        從 [Claude Console](/settings/keys) 取得您的 API 金鑰並將其設定為環境變數：

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="安裝 SDK">
        安裝 Anthropic Python SDK：

        ```bash
        pip install anthropic
        ```
      </Step>

      <Step title="建立您的程式碼">
        將此儲存為 `quickstart.py`：

        ```python
        import anthropic

        client = anthropic.Anthropic()

        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1000,
            messages=[
                {
                    "role": "user",
                    "content": "What should I search for to find the latest developments in renewable energy?"
                }
            ]
        )
        print(message.content)
        ```
      </Step>

      <Step title="執行您的程式碼">
        ```bash
        python quickstart.py
        ```

        **範例輸出：**
        ```python
        [TextBlock(text='Here are some effective search strategies for finding the latest renewable energy developments:\n\n**Search Terms to Use:**\n- "renewable energy news 2024"\n- "clean energy breakthroughs"\n- "solar/wind/battery technology advances"\n- "energy storage innovations"\n- "green hydrogen developments"\n- "renewable energy policy updates"\n\n**Reliable Sources to Check:**\n- **News & Analysis:** Reuters Energy, Bloomberg New Energy Finance, Greentech Media, Energy Storage News\n- **Industry Publications:** Renewable Energy World, PV Magazine, Wind Power Engineering\n- **Research Organizations:** International Energy Agency (IEA), National Renewable Energy Laboratory (NREL)\n- **Government Sources:** Department of Energy websites, EPA clean energy updates\n\n**Specific Topics to Explore:**\n- Perovskite and next-gen solar cells\n- Offshore wind expansion\n- Grid-scale battery storage\n- Green hydrogen production\n- Carbon capture technologies\n- Smart grid innovations\n- Energy policy changes and incentives...', type='text')]
        ```
      </Step>
    </Steps>
  </Tab>

  <Tab title="TypeScript">
    <Steps>
      <Step title="設定您的 API 金鑰">
        從 [Claude Console](/settings/keys) 取得您的 API 金鑰並將其設定為環境變數：

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="安裝 SDK">
        安裝 Anthropic TypeScript SDK：

        ```bash
        npm install @anthropic-ai/sdk
        ```
      </Step>

      <Step title="建立您的程式碼">
        將此儲存為 `quickstart.ts`：

        ```typescript
        import Anthropic from "@anthropic-ai/sdk";

        async function main() {
          const anthropic = new Anthropic();

          const msg = await anthropic.messages.create({
            model: "claude-sonnet-4-5",
            max_tokens: 1000,
            messages: [
              {
                role: "user",
                content: "What should I search for to find the latest developments in renewable energy?"
              }
            ]
          });
          console.log(msg);
        }

        main().catch(console.error);
        ```
      </Step>

      <Step title="執行您的程式碼">
        ```bash
        npx tsx quickstart.ts
        ```

        **範例輸出：**
        ```javascript
        {
          id: 'msg_01ThFHzad6Bh4TpQ6cHux9t8',
          type: 'message',
          role: 'assistant',
          model: 'claude-sonnet-4-5-20250929',
          content: [
            {
              type: 'text',
              text: 'Here are some effective search strategies to find the latest renewable energy developments:\n\n' +
                '## Search Terms to Use:\n' +
                '- "renewable energy news 2024"\n' +
                '- "clean energy breakthroughs"\n' +
                '- "solar wind technology advances"\n' +
                '- "energy storage innovations"\n' +
                '- "green hydrogen developments"\n' +
                '- "offshore wind projects"\n' +
                '- "battery technology renewable"\n\n' +
                '## Best Sources to Check:\n\n' +
                '**News & Industry Sites:**\n' +
                '- Renewable Energy World\n' +
                '- CleanTechnica\n' +
                '- GreenTech Media (now Wood Mackenzie)\n' +
                '- Energy Storage News\n' +
                '- PV Magazine (for solar)...'
            }
          ],
          stop_reason: 'end_turn',
          usage: {
            input_tokens: 21,
            output_tokens: 302
          }
        }
        ```
      </Step>
    </Steps>
  </Tab>

  <Tab title="Java">
    <Steps>
      <Step title="設定您的 API 金鑰">
        從 [Claude Console](/settings/keys) 取得您的 API 金鑰並將其設定為環境變數：

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="安裝 SDK">
        將 Anthropic Java SDK 新增至您的專案。首先在 [Maven Central](https://central.sonatype.com/artifact/com.anthropic/anthropic-java) 上找到目前版本。

        **Gradle：**
        ```groovy
        implementation("com.anthropic:anthropic-java:1.0.0")
        ```

        **Maven：**
        ```xml
        <dependency>
          <groupId>com.anthropic</groupId>
          <artifactId>anthropic-java</artifactId>
          <version>1.0.0</version>
        </dependency>
        ```
      </Step>

      <Step title="建立您的程式碼">
        將此儲存為 `QuickStart.java`：

        ```java
        import com.anthropic.client.AnthropicClient;
        import com.anthropic.client.okhttp.AnthropicOkHttpClient;
        import com.anthropic.models.messages.Message;
        import com.anthropic.models.messages.MessageCreateParams;

        public class QuickStart {
            public static void main(String[] args) {
                AnthropicClient client = AnthropicOkHttpClient.fromEnv();

                MessageCreateParams params = MessageCreateParams.builder()
                        .model("claude-sonnet-4-5-20250929")
                        .maxTokens(1000)
                        .addUserMessage("What should I search for to find the latest developments in renewable energy?")
                        .build();

                Message message = client.messages().create(params);
                System.out.println(message.content());
            }
        }
        ```
      </Step>

      <Step title="執行您的程式碼">
        ```bash
        javac QuickStart.java
        java QuickStart
        ```

        **範例輸出：**
        ```java
        [ContentBlock{text=TextBlock{text=Here are some effective search strategies to find the latest renewable energy developments:

        ## Search Terms to Use:
        - "renewable energy news 2024"
        - "clean energy breakthroughs"  
        - "solar/wind/battery technology advances"
        - "energy storage innovations"
        - "green hydrogen developments"
        - "renewable energy policy updates"

        ## Best Sources to Check:
        - **News & Analysis:** Reuters Energy, Bloomberg New Energy Finance, Greentech Media
        - **Industry Publications:** Renewable Energy World, PV Magazine, Wind Power Engineering
        - **Research Organizations:** International Energy Agency (IEA), National Renewable Energy Laboratory (NREL)
        - **Government Sources:** Department of Energy websites, EPA clean energy updates

        ## Specific Topics to Explore:
        - Perovskite and next-gen solar cells
        - Offshore wind expansion
        - Grid-scale battery storage
        - Green hydrogen production..., type=text}}]
        ```
      </Step>
    </Steps>
  </Tab>
</Tabs>

## 後續步驟

現在您已經進行了第一次 Claude API 請求，是時候探索還有什麼其他可能性：

<CardGroup cols={3}>
  <Card title="使用訊息" icon="messages" href="/docs/zh-TW/build-with-claude/working-with-messages">
    了解 Messages API 的常見模式。
  </Card>
  <Card title="功能概覽" icon="brain" href="/docs/zh-TW/api/overview">
    探索 Claude 的進階功能和能力。
  </Card>
  <Card title="用戶端 SDK" icon="code-brackets" href="/docs/zh-TW/api/client-sdks">
    探索 Anthropic 用戶端程式庫。
  </Card>
  <Card title="Claude 食譜" icon="chef-hat" href="https://github.com/anthropics/anthropic-cookbook">
    使用互動式 Jupyter 筆記本進行學習。
  </Card>
</CardGroup>