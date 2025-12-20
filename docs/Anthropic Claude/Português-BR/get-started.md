# Comece com Claude

Faça sua primeira chamada de API para Claude e crie um assistente simples de busca na web

---

## Pré-requisitos

- Uma conta do [Console](/) da Anthropic
- Uma [chave de API](/settings/keys)

## Chamar a API

<Tabs>
  <Tab title="cURL">
    <Steps>
      <Step title="Defina sua chave de API">
        Obtenha sua chave de API no [Console Claude](/settings/keys) e defina-a como uma variável de ambiente:

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="Faça sua primeira chamada de API">
        Execute este comando para criar um assistente simples de busca na web:

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

        **Exemplo de saída:**
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
      <Step title="Defina sua chave de API">
        Obtenha sua chave de API no [Console Claude](/settings/keys) e defina-a como uma variável de ambiente:

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="Instale o SDK">
        Instale o SDK Python da Anthropic:

        ```bash
        pip install anthropic
        ```
      </Step>

      <Step title="Crie seu código">
        Salve isto como `quickstart.py`:

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

      <Step title="Execute seu código">
        ```bash
        python quickstart.py
        ```

        **Exemplo de saída:**
        ```python
        [TextBlock(text='Here are some effective search strategies for finding the latest renewable energy developments:\n\n**Search Terms to Use:**\n- "renewable energy news 2024"\n- "clean energy breakthroughs"\n- "solar/wind/battery technology advances"\n- "energy storage innovations"\n- "green hydrogen developments"\n- "renewable energy policy updates"\n\n**Reliable Sources to Check:**\n- **News & Analysis:** Reuters Energy, Bloomberg New Energy Finance, Greentech Media, Energy Storage News\n- **Industry Publications:** Renewable Energy World, PV Magazine, Wind Power Engineering\n- **Research Organizations:** International Energy Agency (IEA), National Renewable Energy Laboratory (NREL)\n- **Government Sources:** Department of Energy websites, EPA clean energy updates\n\n**Specific Topics to Explore:**\n- Perovskite and next-gen solar cells\n- Offshore wind expansion\n- Grid-scale battery storage\n- Green hydrogen production\n- Carbon capture technologies\n- Smart grid innovations\n- Energy policy changes and incentives...', type='text')]
        ```
      </Step>
    </Steps>
  </Tab>

  <Tab title="TypeScript">
    <Steps>
      <Step title="Defina sua chave de API">
        Obtenha sua chave de API no [Console Claude](/settings/keys) e defina-a como uma variável de ambiente:

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="Instale o SDK">
        Instale o SDK TypeScript da Anthropic:

        ```bash
        npm install @anthropic-ai/sdk
        ```
      </Step>

      <Step title="Crie seu código">
        Salve isto como `quickstart.ts`:

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

      <Step title="Execute seu código">
        ```bash
        npx tsx quickstart.ts
        ```

        **Exemplo de saída:**
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
      <Step title="Defina sua chave de API">
        Obtenha sua chave de API no [Console Claude](/settings/keys) e defina-a como uma variável de ambiente:

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="Instale o SDK">
        Adicione o SDK Java da Anthropic ao seu projeto. Primeiro, encontre a versão atual no [Maven Central](https://central.sonatype.com/artifact/com.anthropic/anthropic-java).

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

      <Step title="Crie seu código">
        Salve isto como `QuickStart.java`:

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

      <Step title="Execute seu código">
        ```bash
        javac QuickStart.java
        java QuickStart
        ```

        **Exemplo de saída:**
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

## Próximas etapas

Agora que você fez sua primeira solicitação de API Claude, é hora de explorar o que mais é possível:

<CardGroup cols={3}>
  <Card title="Trabalhando com Mensagens" icon="messages" href="/docs/pt-BR/build-with-claude/working-with-messages">
    Aprenda padrões comuns para a API de Mensagens.
  </Card>
  <Card title="Visão Geral de Recursos" icon="brain" href="/docs/pt-BR/api/overview">
    Explore os recursos e capacidades avançadas do Claude.
  </Card>
  <Card title="SDKs de Cliente" icon="code-brackets" href="/docs/pt-BR/api/client-sdks">
    Descubra as bibliotecas de cliente da Anthropic.
  </Card>
  <Card title="Claude Cookbook" icon="chef-hat" href="https://github.com/anthropics/anthropic-cookbook">
    Aprenda com notebooks Jupyter interativos.
  </Card>
</CardGroup>