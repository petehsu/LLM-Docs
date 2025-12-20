# Claude 시작하기

Claude API에 첫 번째 호출을 하고 간단한 웹 검색 어시스턴트를 구축하세요

---

## 전제 조건

- Anthropic [Console 계정](/)
- [API 키](/settings/keys)

## API 호출

<Tabs>
  <Tab title="cURL">
    <Steps>
      <Step title="API 키 설정">
        [Claude Console](/settings/keys)에서 API 키를 가져오고 환경 변수로 설정하세요:

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="첫 번째 API 호출 만들기">
        이 명령을 실행하여 간단한 웹 검색 어시스턴트를 만드세요:

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

        **예제 출력:**
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
      <Step title="API 키 설정">
        [Claude Console](/settings/keys)에서 API 키를 가져오고 환경 변수로 설정하세요:

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="SDK 설치">
        Anthropic Python SDK를 설치하세요:

        ```bash
        pip install anthropic
        ```
      </Step>

      <Step title="코드 생성">
        이를 `quickstart.py`로 저장하세요:

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

      <Step title="코드 실행">
        ```bash
        python quickstart.py
        ```

        **예제 출력:**
        ```python
        [TextBlock(text='Here are some effective search strategies for finding the latest renewable energy developments:\n\n**Search Terms to Use:**\n- "renewable energy news 2024"\n- "clean energy breakthroughs"\n- "solar/wind/battery technology advances"\n- "energy storage innovations"\n- "green hydrogen developments"\n- "renewable energy policy updates"\n\n**Reliable Sources to Check:**\n- **News & Analysis:** Reuters Energy, Bloomberg New Energy Finance, Greentech Media, Energy Storage News\n- **Industry Publications:** Renewable Energy World, PV Magazine, Wind Power Engineering\n- **Research Organizations:** International Energy Agency (IEA), National Renewable Energy Laboratory (NREL)\n- **Government Sources:** Department of Energy websites, EPA clean energy updates\n\n**Specific Topics to Explore:**\n- Perovskite and next-gen solar cells\n- Offshore wind expansion\n- Grid-scale battery storage\n- Green hydrogen production\n- Carbon capture technologies\n- Smart grid innovations\n- Energy policy changes and incentives...', type='text')]
        ```
      </Step>
    </Steps>
  </Tab>

  <Tab title="TypeScript">
    <Steps>
      <Step title="API 키 설정">
        [Claude Console](/settings/keys)에서 API 키를 가져오고 환경 변수로 설정하세요:

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="SDK 설치">
        Anthropic TypeScript SDK를 설치하세요:

        ```bash
        npm install @anthropic-ai/sdk
        ```
      </Step>

      <Step title="코드 생성">
        이를 `quickstart.ts`로 저장하세요:

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

      <Step title="코드 실행">
        ```bash
        npx tsx quickstart.ts
        ```

        **예제 출력:**
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
      <Step title="API 키 설정">
        [Claude Console](/settings/keys)에서 API 키를 가져오고 환경 변수로 설정하세요:

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="SDK 설치">
        프로젝트에 Anthropic Java SDK를 추가하세요. 먼저 [Maven Central](https://central.sonatype.com/artifact/com.anthropic/anthropic-java)에서 현재 버전을 찾으세요.

        **Gradle:**
        ```groovy
        implementation("com.anthropic:anthropic-java:1.0.0")
        ```

        **Maven:**
        ```xml
        <dependency>
          <groupId>com.anthropic</groupId>
          <artifactId>anthropic-java</artifactId>
          <version>1.0.0</version>
        </dependency>
        ```
      </Step>

      <Step title="코드 생성">
        이를 `QuickStart.java`로 저장하세요:

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

      <Step title="코드 실행">
        ```bash
        javac QuickStart.java
        java QuickStart
        ```

        **예제 출력:**
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

## 다음 단계

이제 첫 번째 Claude API 요청을 했으므로 다른 가능성을 탐색할 시간입니다:

<CardGroup cols={3}>
  <Card title="메시지 작업" icon="messages" href="/docs/ko/build-with-claude/working-with-messages">
    Messages API의 일반적인 패턴을 알아보세요.
  </Card>
  <Card title="기능 개요" icon="brain" href="/docs/ko/api/overview">
    Claude의 고급 기능과 기능을 탐색하세요.
  </Card>
  <Card title="클라이언트 SDK" icon="code-brackets" href="/docs/ko/api/client-sdks">
    Anthropic 클라이언트 라이브러리를 발견하세요.
  </Card>
  <Card title="Claude Cookbook" icon="chef-hat" href="https://github.com/anthropics/anthropic-cookbook">
    대화형 Jupyter 노트북으로 배우세요.
  </Card>
</CardGroup>