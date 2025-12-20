# Iniziare con Claude

Effettua la tua prima chiamata API a Claude e crea un semplice assistente di ricerca web

---

## Prerequisiti

- Un account [Console](/) di Anthropic
- Una [chiave API](/settings/keys)

## Chiama l'API

<Tabs>
  <Tab title="cURL">
    <Steps>
      <Step title="Imposta la tua chiave API">
        Ottieni la tua chiave API dalla [Claude Console](/settings/keys) e impostala come variabile di ambiente:

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="Effettua la tua prima chiamata API">
        Esegui questo comando per creare un semplice assistente di ricerca web:

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

        **Output di esempio:**
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
      <Step title="Imposta la tua chiave API">
        Ottieni la tua chiave API dalla [Claude Console](/settings/keys) e impostala come variabile di ambiente:

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="Installa l'SDK">
        Installa l'SDK Python di Anthropic:

        ```bash
        pip install anthropic
        ```
      </Step>

      <Step title="Crea il tuo codice">
        Salva questo come `quickstart.py`:

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

      <Step title="Esegui il tuo codice">
        ```bash
        python quickstart.py
        ```

        **Output di esempio:**
        ```python
        [TextBlock(text='Here are some effective search strategies for finding the latest renewable energy developments:\n\n**Search Terms to Use:**\n- "renewable energy news 2024"\n- "clean energy breakthroughs"\n- "solar/wind/battery technology advances"\n- "energy storage innovations"\n- "green hydrogen developments"\n- "renewable energy policy updates"\n\n**Reliable Sources to Check:**\n- **News & Analysis:** Reuters Energy, Bloomberg New Energy Finance, Greentech Media, Energy Storage News\n- **Industry Publications:** Renewable Energy World, PV Magazine, Wind Power Engineering\n- **Research Organizations:** International Energy Agency (IEA), National Renewable Energy Laboratory (NREL)\n- **Government Sources:** Department of Energy websites, EPA clean energy updates\n\n**Specific Topics to Explore:**\n- Perovskite and next-gen solar cells\n- Offshore wind expansion\n- Grid-scale battery storage\n- Green hydrogen production\n- Carbon capture technologies\n- Smart grid innovations\n- Energy policy changes and incentives...', type='text')]
        ```
      </Step>
    </Steps>
  </Tab>

  <Tab title="TypeScript">
    <Steps>
      <Step title="Imposta la tua chiave API">
        Ottieni la tua chiave API dalla [Claude Console](/settings/keys) e impostala come variabile di ambiente:

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="Installa l'SDK">
        Installa l'SDK TypeScript di Anthropic:

        ```bash
        npm install @anthropic-ai/sdk
        ```
      </Step>

      <Step title="Crea il tuo codice">
        Salva questo come `quickstart.ts`:

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

      <Step title="Esegui il tuo codice">
        ```bash
        npx tsx quickstart.ts
        ```

        **Output di esempio:**
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
      <Step title="Imposta la tua chiave API">
        Ottieni la tua chiave API dalla [Claude Console](/settings/keys) e impostala come variabile di ambiente:

        ```bash
        export ANTHROPIC_API_KEY='your-api-key-here'
        ```
      </Step>

      <Step title="Installa l'SDK">
        Aggiungi l'SDK Java di Anthropic al tuo progetto. Per prima cosa trova la versione corrente su [Maven Central](https://central.sonatype.com/artifact/com.anthropic/anthropic-java).

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

      <Step title="Crea il tuo codice">
        Salva questo come `QuickStart.java`:

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

      <Step title="Esegui il tuo codice">
        ```bash
        javac QuickStart.java
        java QuickStart
        ```

        **Output di esempio:**
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

## Passaggi successivi

Ora che hai effettuato la tua prima richiesta API a Claude, è il momento di esplorare cosa altro è possibile:

<CardGroup cols={3}>
  <Card title="Lavorare con i messaggi" icon="messages" href="/docs/it/build-with-claude/working-with-messages">
    Scopri i modelli comuni per l'API Messages.
  </Card>
  <Card title="Panoramica delle funzionalità" icon="brain" href="/docs/it/api/overview">
    Esplora le funzionalità e le capacità avanzate di Claude.
  </Card>
  <Card title="SDK client" icon="code-brackets" href="/docs/it/api/client-sdks">
    Scopri le librerie client di Anthropic.
  </Card>
  <Card title="Claude Cookbook" icon="chef-hat" href="https://github.com/anthropics/anthropic-cookbook">
    Impara con i notebook Jupyter interattivi.
  </Card>
</CardGroup>