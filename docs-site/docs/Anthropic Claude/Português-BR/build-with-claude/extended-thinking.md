# Construindo com pensamento estendido

O pensamento estendido oferece ao Claude capacidades de raciocínio aprimoradas para tarefas complexas, enquanto fornece vários níveis de transparência em seu processo de pensamento passo a passo antes de entregar sua resposta final.

---

O pensamento estendido oferece ao Claude capacidades de raciocínio aprimoradas para tarefas complexas, enquanto fornece vários níveis de transparência em seu processo de pensamento passo a passo antes de entregar sua resposta final.

## Modelos suportados

O pensamento estendido é suportado nos seguintes modelos:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([descontinuado](/docs/pt-BR/about-claude/model-deprecations))
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

<Note>
O comportamento da API difere entre os modelos Claude Sonnet 3.7 e Claude 4, mas as formas da API permanecem exatamente as mesmas.

Para mais informações, consulte [Diferenças no pensamento entre versões de modelos](#differences-in-thinking-across-model-versions).
</Note>

## Como funciona o pensamento estendido

Quando o pensamento estendido é ativado, Claude cria blocos de conteúdo `thinking` onde produz seu raciocínio interno. Claude incorpora insights deste raciocínio antes de elaborar uma resposta final.

A resposta da API incluirá blocos de conteúdo `thinking`, seguidos por blocos de conteúdo `text`.

Aqui está um exemplo do formato de resposta padrão:

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

Para mais informações sobre o formato de resposta do pensamento estendido, consulte a [Referência da API de Mensagens](/docs/pt-BR/api/messages).

## Como usar o pensamento estendido

Aqui está um exemplo de uso do pensamento estendido na API de Mensagens:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 16000,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
    },
    "messages": [
        {
            "role": "user",
            "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
    }]
)

# The response will contain summarized thinking blocks and text blocks
for block in response.content:
    if block.type == "thinking":
        print(f"\nThinking summary: {block.thinking}")
    elif block.type == "text":
        print(f"\nResponse: {block.text}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "Are there an infinite number of prime numbers such that n mod 4 == 3?"
  }]
});

// The response will contain summarized thinking blocks and text blocks
for (const block of response.content) {
  if (block.type === "thinking") {
    console.log(`\nThinking summary: ${block.thinking}`);
  } else if (block.type === "text") {
    console.log(`\nResponse: ${block.text}`);
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.*;

public class SimpleThinkingExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("Are there an infinite number of prime numbers such that n mod 4 == 3?")
                        .build()
        );

        System.out.println(response);
    }
}
```

</CodeGroup>

Para ativar o pensamento estendido, adicione um objeto `thinking`, com o parâmetro `type` definido como `enabled` e o `budget_tokens` para um orçamento de token especificado para pensamento estendido.

O parâmetro `budget_tokens` determina o número máximo de tokens que Claude pode usar para seu processo de raciocínio interno. Nos modelos Claude 4, este limite se aplica aos tokens de pensamento completo, e não à [saída resumida](#summarized-thinking). Orçamentos maiores podem melhorar a qualidade da resposta ao permitir análise mais completa para problemas complexos, embora Claude possa não usar todo o orçamento alocado, especialmente em intervalos acima de 32k.

`budget_tokens` deve ser definido para um valor menor que `max_tokens`. No entanto, ao usar [pensamento intercalado com ferramentas](#interleaved-thinking), você pode exceder este limite, pois o limite de token se torna sua janela de contexto inteira (200k tokens).

### Pensamento resumido

Com o pensamento estendido ativado, a API de Mensagens para modelos Claude 4 retorna um resumo do processo de pensamento completo de Claude. O pensamento resumido fornece os benefícios completos de inteligência do pensamento estendido, enquanto previne abuso.

Aqui estão algumas considerações importantes para pensamento resumido:

- Você é cobrado pelos tokens de pensamento completo gerados pela solicitação original, não pelos tokens de resumo.
- A contagem de tokens de saída faturada **não corresponderá** à contagem de tokens que você vê na resposta.
- As primeiras linhas de saída de pensamento são mais verbosas, fornecendo raciocínio detalhado que é particularmente útil para fins de engenharia de prompt.
- Conforme a Anthropic busca melhorar o recurso de pensamento estendido, o comportamento de resumo está sujeito a mudanças.
- A resumição preserva as ideias-chave do processo de pensamento de Claude com latência mínima adicionada, permitindo uma experiência de usuário transmissível e migração fácil de Claude Sonnet 3.7 para modelos Claude 4.
- A resumição é processada por um modelo diferente daquele que você direciona em suas solicitações. O modelo de pensamento não vê a saída resumida.

<Note>
Claude Sonnet 3.7 continua retornando saída de pensamento completo.

Em casos raros onde você precisa de acesso à saída de pensamento completo para modelos Claude 4, [entre em contato com nossa equipe de vendas](mailto:sales@anthropic.com).
</Note>

### Pensamento em streaming

Você pode fazer streaming de respostas de pensamento estendido usando [eventos enviados pelo servidor (SSE)](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents).

Quando o streaming está ativado para pensamento estendido, você recebe conteúdo de pensamento via eventos `thinking_delta`.

Para mais documentação sobre streaming via API de Mensagens, consulte [Streaming de Mensagens](/docs/pt-BR/build-with-claude/streaming).

Aqui está como lidar com streaming com pensamento:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 16000,
    "stream": true,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
    },
    "messages": [
        {
            "role": "user",
            "content": "What is 27 * 453?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "What is 27 * 453?"}],
) as stream:
    thinking_started = False
    response_started = False

    for event in stream:
        if event.type == "content_block_start":
            print(f"\nStarting {event.content_block.type} block...")
            # Reset flags for each new block
            thinking_started = False
            response_started = False
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                if not thinking_started:
                    print("Thinking: ", end="", flush=True)
                    thinking_started = True
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                if not response_started:
                    print("Response: ", end="", flush=True)
                    response_started = True
                print(event.delta.text, end="", flush=True)
        elif event.type == "content_block_stop":
            print("\nBlock complete.")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const stream = await client.messages.stream({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "What is 27 * 453?"
  }]
});

let thinkingStarted = false;
let responseStarted = false;

for await (const event of stream) {
  if (event.type === 'content_block_start') {
    console.log(`\nStarting ${event.content_block.type} block...`);
    // Reset flags for each new block
    thinkingStarted = false;
    responseStarted = false;
  } else if (event.type === 'content_block_delta') {
    if (event.delta.type === 'thinking_delta') {
      if (!thinkingStarted) {
        process.stdout.write('Thinking: ');
        thinkingStarted = true;
      }
      process.stdout.write(event.delta.thinking);
    } else if (event.delta.type === 'text_delta') {
      if (!responseStarted) {
        process.stdout.write('Response: ');
        responseStarted = true;
      }
      process.stdout.write(event.delta.text);
    }
  } else if (event.type === 'content_block_stop') {
    console.log('\nBlock complete.');
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaRawMessageStreamEvent;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.messages.Model;

public class SimpleThinkingStreamingExample {
    private static boolean thinkingStarted = false;
    private static boolean responseStarted = false;
    
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams createParams = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_0)
                .maxTokens(16000)
                .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                .addUserMessage("What is 27 * 453?")
                .build();

        try (StreamResponse<BetaRawMessageStreamEvent> streamResponse =
                     client.beta().messages().createStreaming(createParams)) {
            streamResponse.stream()
                    .forEach(event -> {
                        if (event.isContentBlockStart()) {
                            System.out.printf("\nStarting %s block...%n",
                                    event.asContentBlockStart()._type());
                            // Reset flags for each new block
                            thinkingStarted = false;
                            responseStarted = false;
                        } else if (event.isContentBlockDelta()) {
                            var delta = event.asContentBlockDelta().delta();
                            if (delta.isBetaThinking()) {
                                if (!thinkingStarted) {
                                    System.out.print("Thinking: ");
                                    thinkingStarted = true;
                                }
                                System.out.print(delta.asBetaThinking().thinking());
                                System.out.flush();
                            } else if (delta.isBetaText()) {
                                if (!responseStarted) {
                                    System.out.print("Response: ");
                                    responseStarted = true;
                                }
                                System.out.print(delta.asBetaText().text());
                                System.out.flush();
                            }
                        } else if (event.isContentBlockStop()) {
                            System.out.println("\nBlock complete.");
                        }
                    });
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton userPrompt="What is 27 * 453?" thinkingBudgetTokens={16000}>
  Tente no Console
</TryInConsoleButton>

Exemplo de saída de streaming:
```json
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step:\n\n1. First break down 27 * 453"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n2. 453 = 400 + 50 + 3"}}

// Additional thinking deltas...

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "27 * 453 = 12,231"}}

// Additional text deltas...

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

<Note>
Ao usar streaming com pensamento ativado, você pode notar que o texto às vezes chega em pedaços maiores alternando com entrega token por token. Este é o comportamento esperado, especialmente para conteúdo de pensamento.

O sistema de streaming precisa processar conteúdo em lotes para desempenho ideal, o que pode resultar neste padrão de entrega "em pedaços", com possíveis atrasos entre eventos de streaming. Estamos continuamente trabalhando para melhorar esta experiência, com futuras atualizações focadas em fazer o conteúdo de pensamento fazer streaming mais suavemente.
</Note>

## Pensamento estendido com uso de ferramentas

O pensamento estendido pode ser usado junto com [uso de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/overview), permitindo que Claude raciocine através da seleção de ferramentas e processamento de resultados.

Ao usar pensamento estendido com uso de ferramentas, esteja ciente das seguintes limitações:

1. **Limitação de escolha de ferramenta**: O uso de ferramentas com pensamento suporta apenas `tool_choice: {"type": "auto"}` (o padrão) ou `tool_choice: {"type": "none"}`. Usar `tool_choice: {"type": "any"}` ou `tool_choice: {"type": "tool", "name": "..."}` resultará em um erro porque estas opções forçam o uso de ferramentas, que é incompatível com pensamento estendido.

2. **Preservando blocos de pensamento**: Durante o uso de ferramentas, você deve passar blocos `thinking` de volta para a API para a última mensagem do assistente. Inclua o bloco completo não modificado de volta para a API para manter a continuidade de raciocínio.

### Alternando modos de pensamento em conversas

Você não pode alternar pensamento no meio de um turno do assistente, incluindo durante loops de uso de ferramentas. O turno inteiro do assistente deve operar em um único modo de pensamento:

- **Se o pensamento está ativado**, o turno final do assistente deve começar com um bloco de pensamento.
- **Se o pensamento está desativado**, o turno final do assistente não deve conter nenhum bloco de pensamento

Do ponto de vista do modelo, **loops de uso de ferramentas fazem parte do turno do assistente**. Um turno do assistente não se completa até que Claude termine sua resposta completa, que pode incluir múltiplas chamadas de ferramentas e resultados.

Por exemplo, esta sequência é toda parte de um **único turno do assistente**:
```
User: "What's the weather in Paris?"
Assistant: [thinking] + [tool_use: get_weather]
User: [tool_result: "20°C, sunny"]
Assistant: [text: "The weather in Paris is 20°C and sunny"]
```

Embora haja múltiplas mensagens da API, o loop de uso de ferramentas é conceitualmente parte de uma resposta contínua do assistente.

#### Cenários de erro comuns

Você pode encontrar este erro:
```
Expected `thinking` or `redacted_thinking`, but found `tool_use`.
When `thinking` is enabled, a final `assistant` message must start
with a thinking block (preceding the lastmost set of `tool_use` and
`tool_result` blocks).
```

Isto tipicamente ocorre quando:
1. Você tinha pensamento **desativado** durante uma sequência de uso de ferramentas
2. Você quer ativar pensamento novamente
3. Sua última mensagem do assistente contém blocos de uso de ferramentas mas nenhum bloco de pensamento

#### Orientação prática

**✗ Inválido: Alternando pensamento imediatamente após uso de ferramentas**
```
User: "What's the weather?"
Assistant: [tool_use] (thinking disabled)
User: [tool_result]
// Cannot enable thinking here - still in the same assistant turn
```

**✓ Válido: Complete o turno do assistente primeiro**
```
User: "What's the weather?"
Assistant: [tool_use] (thinking disabled)
User: [tool_result]
Assistant: [text: "It's sunny"] 
User: "What about tomorrow?" (thinking disabled)
Assistant: [thinking] + [text: "..."] (thinking enabled - new turn)
```

**Melhor prática**: Planeje sua estratégia de pensamento no início de cada turno em vez de tentar alternar no meio do turno.

<Note>
Alternar modos de pensamento também invalida o cache de prompt para histórico de mensagens. Para mais detalhes, consulte a seção [Pensamento estendido com cache de prompt](#extended-thinking-with-prompt-caching).
</Note>

<section title="Exemplo: Passando blocos de pensamento com resultados de ferramentas">

Aqui está um exemplo prático mostrando como preservar blocos de pensamento ao fornecer resultados de ferramentas:

<CodeGroup>
```python Python
weather_tool = {
    "name": "get_weather",
    "description": "Get current weather for a location",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {"type": "string"}
        },
        "required": ["location"]
    }
}

# First request - Claude responds with thinking and tool request
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "What's the weather in Paris?"}
    ]
)
```

```typescript TypeScript
const weatherTool = {
  name: "get_weather",
  description: "Get current weather for a location",
  input_schema: {
    type: "object",
    properties: {
      location: { type: "string" }
    },
    required: ["location"]
  }
};

// First request - Claude responds with thinking and tool request
const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "What's the weather in Paris?" }
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaTool;
import com.anthropic.models.beta.messages.BetaTool.InputSchema;
import com.anthropic.models.messages.Model;

public class ThinkingWithToolsExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of("type", "string")
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        BetaTool weatherTool = BetaTool.builder()
                .name("get_weather")
                .description("Get current weather for a location")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("What's the weather in Paris?")
                        .build()
        );

        System.out.println(response);
    }
}
```
</CodeGroup>

A resposta da API incluirá blocos de pensamento, texto e tool_use:

```json
{
    "content": [
        {
            "type": "thinking",
            "thinking": "The user wants to know the current weather in Paris. I have access to a function `get_weather`...",
            "signature": "BDaL4VrbR2Oj0hO4XpJxT28J5TILnCrrUXoKiiNBZW9P+nr8XSj1zuZzAl4egiCCpQNvfyUuFFJP5CncdYZEQPPmLxYsNrcs...."
        },
        {
            "type": "text",
            "text": "I can help you get the current weather information for Paris. Let me check that for you"
        },
        {
            "type": "tool_use",
            "id": "toolu_01CswdEQBMshySk6Y9DFKrfq",
            "name": "get_weather",
            "input": {
                "location": "Paris"
            }
        }
    ]
}
```

Agora vamos continuar a conversa e usar a ferramenta

<CodeGroup>
```python Python
# Extract thinking block and tool use block
thinking_block = next((block for block in response.content
                      if block.type == 'thinking'), None)
tool_use_block = next((block for block in response.content
                      if block.type == 'tool_use'), None)

# Call your actual weather API, here is where your actual API call would go
# let's pretend this is what we get back
weather_data = {"temperature": 88}

# Second request - Include thinking block and tool result
# No new thinking blocks will be generated in the response
continuation = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "What's the weather in Paris?"},
        # notice that the thinking_block is passed in as well as the tool_use_block
        # if this is not passed in, an error is raised
        {"role": "assistant", "content": [thinking_block, tool_use_block]},
        {"role": "user", "content": [{
            "type": "tool_result",
            "tool_use_id": tool_use_block.id,
            "content": f"Current temperature: {weather_data['temperature']}°F"
        }]}
    ]
)
```

```typescript TypeScript
// Extract thinking block and tool use block
const thinkingBlock = response.content.find(block =>
  block.type === 'thinking');
const toolUseBlock = response.content.find(block =>
  block.type === 'tool_use');

// Call your actual weather API, here is where your actual API call would go
// let's pretend this is what we get back
const weatherData = { temperature: 88 };

// Second request - Include thinking block and tool result
// No new thinking blocks will be generated in the response
const continuation = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "What's the weather in Paris?" },
    // notice that the thinkingBlock is passed in as well as the toolUseBlock
    // if this is not passed in, an error is raised
    { role: "assistant", content: [thinkingBlock, toolUseBlock] },
    { role: "user", content: [{
      type: "tool_result",
      tool_use_id: toolUseBlock.id,
      content: `Current temperature: ${weatherData.temperature}°F`
    }]}
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.BetaTool.InputSchema;
import com.anthropic.models.messages.Model;

public class ThinkingToolsResultExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of("type", "string")
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        BetaTool weatherTool = BetaTool.builder()
                .name("get_weather")
                .description("Get current weather for a location")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("What's the weather in Paris?")
                        .build()
        );

        // Extract thinking block and tool use block
        Optional<BetaThinkingBlock> thinkingBlockOpt = response.content().stream()
                .filter(BetaContentBlock::isThinking)
                .map(BetaContentBlock::asThinking)
                .findFirst();

        Optional<BetaToolUseBlock> toolUseBlockOpt = response.content().stream()
                .filter(BetaContentBlock::isToolUse)
                .map(BetaContentBlock::asToolUse)
                .findFirst();

        if (thinkingBlockOpt.isPresent() && toolUseBlockOpt.isPresent()) {
            BetaThinkingBlock thinkingBlock = thinkingBlockOpt.get();
            BetaToolUseBlock toolUseBlock = toolUseBlockOpt.get();

            // Call your actual weather API, here is where your actual API call would go
            // let's pretend this is what we get back
            Map<String, Object> weatherData = Map.of("temperature", 88);

            // Second request - Include thinking block and tool result
            // No new thinking blocks will be generated in the response
            BetaMessage continuation = client.beta().messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_OPUS_4_0)
                            .maxTokens(16000)
                            .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                            .addTool(weatherTool)
                            .addUserMessage("What's the weather in Paris?")
                            .addAssistantMessageOfBetaContentBlockParams(
                                    // notice that the thinkingBlock is passed in as well as the toolUseBlock
                                    // if this is not passed in, an error is raised
                                    List.of(
                                            BetaContentBlockParam.ofThinking(thinkingBlock.toParam()),
                                            BetaContentBlockParam.ofToolUse(toolUseBlock.toParam())
                                    )
                            )
                            .addUserMessageOfBetaContentBlockParams(List.of(
                                    BetaContentBlockParam.ofToolResult(
                                            BetaToolResultBlockParam.builder()
                                                    .toolUseId(toolUseBlock.id())
                                                    .content(String.format("Current temperature: %d°F", (Integer)weatherData.get("temperature")))
                                                    .build()
                                    )
                            ))
                            .build()
            );

            System.out.println(continuation);
        }
    }
}
```
</CodeGroup>

A resposta da API agora incluirá **apenas** texto

```json
{
    "content": [
        {
            "type": "text",
            "text": "Currently in Paris, the temperature is 88°F (31°C)"
        }
    ]
}
```

</section>

### Preservando blocos de pensamento

Durante o uso de ferramentas, você deve passar blocos `thinking` de volta para a API, e você deve incluir o bloco completo não modificado de volta para a API. Isto é crítico para manter o fluxo de raciocínio do modelo e a integridade da conversa.

<Tip>
Embora você possa omitir blocos `thinking` de turnos anteriores do `assistant`, sugerimos sempre passar de volta todos os blocos de pensamento para a API para qualquer conversa multi-turno. A API irá:
- Filtrar automaticamente os blocos de pensamento fornecidos
- Usar os blocos de pensamento relevantes necessários para preservar o raciocínio do modelo
- Cobrar apenas pelos tokens de entrada para os blocos mostrados ao Claude
</Tip>

<Note>
Ao alternar modos de pensamento durante uma conversa, lembre-se que o turno inteiro do assistente (incluindo loops de uso de ferramentas) deve operar em um único modo de pensamento. Para mais detalhes, consulte [Alternando modos de pensamento em conversas](#toggling-thinking-modes-in-conversations).
</Note>

Quando Claude invoca ferramentas, está pausando sua construção de uma resposta para aguardar informações externas. Quando resultados de ferramentas são retornados, Claude continuará construindo essa resposta existente. Isto necessita preservar blocos de pensamento durante o uso de ferramentas, por um par de razões:

1. **Continuidade de raciocínio**: Os blocos de pensamento capturam o raciocínio passo a passo de Claude que levou a solicitações de ferramentas. Quando você publica resultados de ferramentas, incluir o pensamento original garante que Claude possa continuar seu raciocínio de onde parou.

2. **Manutenção de contexto**: Embora resultados de ferramentas apareçam como mensagens de usuário na estrutura da API, eles fazem parte de um fluxo de raciocínio contínuo. Preservar blocos de pensamento mantém este fluxo conceitual através de múltiplas chamadas de API. Para mais informações sobre gerenciamento de contexto, consulte nosso [guia sobre janelas de contexto](/docs/pt-BR/build-with-claude/context-windows).

**Importante**: Ao fornecer blocos `thinking`, a sequência inteira de blocos `thinking` consecutivos deve corresponder aos resultados gerados pelo modelo durante a solicitação original; você não pode reorganizar ou modificar a sequência destes blocos.

### Pensamento intercalado

O pensamento estendido com uso de ferramentas em modelos Claude 4 suporta pensamento intercalado, que permite que Claude pense entre chamadas de ferramentas e faça raciocínios mais sofisticados após receber resultados de ferramentas.

Com pensamento intercalado, Claude pode:
- Raciocinar sobre os resultados de uma chamada de ferramenta antes de decidir o que fazer a seguir
- Encadear múltiplas chamadas de ferramentas com etapas de raciocínio no meio
- Tomar decisões mais nuançadas com base em resultados intermediários

Para ativar o pensamento intercalado, adicione [o cabeçalho beta](/docs/pt-BR/api/beta-headers) `interleaved-thinking-2025-05-14` à sua solicitação de API.

Aqui estão algumas considerações importantes para pensamento intercalado:
- Com pensamento intercalado, o `budget_tokens` pode exceder o parâmetro `max_tokens`, pois representa o orçamento total em todos os blocos de pensamento dentro de um turno do assistente.
- O pensamento intercalado é suportado apenas para [ferramentas usadas via Messages API](/docs/pt-BR/agents-and-tools/tool-use/overview).
- O pensamento intercalado é suportado apenas para modelos Claude 4, com o cabeçalho beta `interleaved-thinking-2025-05-14`.
- Chamadas diretas para a Claude API permitem que você passe `interleaved-thinking-2025-05-14` em solicitações para qualquer modelo, sem efeito.
- Em plataformas de terceiros (por exemplo, [Amazon Bedrock](/docs/pt-BR/build-with-claude/claude-on-amazon-bedrock) e [Vertex AI](/docs/pt-BR/build-with-claude/claude-on-vertex-ai)), se você passar `interleaved-thinking-2025-05-14` para qualquer modelo além de Claude Opus 4.5, Claude Opus 4.1, Opus 4 ou Sonnet 4, sua solicitação falhará.

<section title="Uso de ferramentas sem pensamento intercalado">

Sem pensamento intercalado, Claude pensa uma vez no início do turno do assistente. As respostas subsequentes após resultados de ferramentas continuam sem novos blocos de pensamento.

```
User: "What's the total revenue if we sold 150 units at $50 each,
       and how does this compare to our average monthly revenue?"

Turn 1: [thinking] "I need to calculate 150 * $50, then check the database..."
        [tool_use: calculator] { "expression": "150 * 50" }
  ↓ tool result: "7500"

Turn 2: [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
        ↑ no thinking block
  ↓ tool result: "5200"

Turn 3: [text] "The total revenue is $7,500, which is 44% above your
        average monthly revenue of $5,200."
        ↑ no thinking block
```

</section>

<section title="Uso de ferramentas com pensamento intercalado">

Com pensamento intercalado ativado, Claude pode pensar após receber cada resultado de ferramenta, permitindo que ele raciocine sobre resultados intermediários antes de continuar.

```
User: "What's the total revenue if we sold 150 units at $50 each,
       and how does this compare to our average monthly revenue?"

Turn 1: [thinking] "I need to calculate 150 * $50 first..."
        [tool_use: calculator] { "expression": "150 * 50" }
  ↓ tool result: "7500"

Turn 2: [thinking] "Got $7,500. Now I should query the database to compare..."
        [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
        ↑ thinking after receiving calculator result
  ↓ tool result: "5200"

Turn 3: [thinking] "$7,500 vs $5,200 average - that's a 44% increase..."
        [text] "The total revenue is $7,500, which is 44% above your
        average monthly revenue of $5,200."
        ↑ thinking before final answer
```

</section>

## Pensamento estendido com cache de prompt

[Cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching) com pensamento tem várias considerações importantes:

<Tip>
Tarefas de pensamento estendido geralmente levam mais de 5 minutos para serem concluídas. Considere usar a [duração de cache de 1 hora](/docs/pt-BR/build-with-claude/prompt-caching#1-hour-cache-duration) para manter acertos de cache em sessões de pensamento mais longas e fluxos de trabalho com múltiplas etapas.
</Tip>

**Remoção de contexto de bloco de pensamento**
- Blocos de pensamento de turnos anteriores são removidos do contexto, o que pode afetar pontos de interrupção de cache
- Ao continuar conversas com uso de ferramentas, blocos de pensamento são armazenados em cache e contam como tokens de entrada quando lidos do cache
- Isso cria uma compensação: enquanto blocos de pensamento não consomem espaço de janela de contexto visualmente, eles ainda contam para seu uso de tokens de entrada quando armazenados em cache
- Se o pensamento for desativado, as solicitações falharão se você passar conteúdo de pensamento no turno atual de uso de ferramentas. Em outros contextos, o conteúdo de pensamento passado para a API é simplesmente ignorado

**Padrões de invalidação de cache**
- Alterações em parâmetros de pensamento (ativado/desativado ou alocação de orçamento) invalidam pontos de interrupção de cache de mensagem
- [Pensamento intercalado](#interleaved-thinking) amplifica a invalidação de cache, pois blocos de pensamento podem ocorrer entre múltiplas [chamadas de ferramentas](#extended-thinking-with-tool-use)
- Prompts de sistema e ferramentas permanecem em cache apesar de alterações de parâmetros de pensamento ou remoção de bloco

<Note>
Embora blocos de pensamento sejam removidos para cache e cálculos de contexto, eles devem ser preservados ao continuar conversas com [uso de ferramentas](#extended-thinking-with-tool-use), especialmente com [pensamento intercalado](#interleaved-thinking).
</Note>

### Compreendendo o comportamento de cache de bloco de pensamento

Ao usar pensamento estendido com uso de ferramentas, blocos de pensamento exibem comportamento de cache específico que afeta a contagem de tokens:

**Como funciona:**

1. O cache ocorre apenas quando você faz uma solicitação subsequente que inclui resultados de ferramentas
2. Quando a solicitação subsequente é feita, o histórico de conversas anterior (incluindo blocos de pensamento) pode ser armazenado em cache
3. Esses blocos de pensamento em cache contam como tokens de entrada em suas métricas de uso quando lidos do cache
4. Quando um bloco de usuário de resultado não-ferramenta é incluído, todos os blocos de pensamento anteriores são ignorados e removidos do contexto

**Fluxo de exemplo detalhado:**

**Solicitação 1:**
```
User: "What's the weather in Paris?"
```
**Resposta 1:**
```
[thinking_block_1] + [tool_use block 1]
```

**Solicitação 2:**
```
User: ["What's the weather in Paris?"], 
Assistant: [thinking_block_1] + [tool_use block 1], 
User: [tool_result_1, cache=True]
```
**Resposta 2:**
```
[thinking_block_2] + [text block 2]
```
A Solicitação 2 escreve um cache do conteúdo da solicitação (não da resposta). O cache inclui a mensagem de usuário original, o primeiro bloco de pensamento, bloco de uso de ferramenta e o resultado da ferramenta.

**Solicitação 3:**
```
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
```
Para Claude Opus 4.5 e posterior, todos os blocos de pensamento anteriores são mantidos por padrão. Para modelos mais antigos, como um bloco de usuário de resultado não-ferramenta foi incluído, todos os blocos de pensamento anteriores são ignorados. Esta solicitação será processada da mesma forma que:
```
User: ["What's the weather in Paris?"],
Assistant: [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [text block 2],
User: [Text response, cache=True]
```

**Pontos-chave:**
- Este comportamento de cache acontece automaticamente, mesmo sem marcadores `cache_control` explícitos
- Este comportamento é consistente se usar pensamento regular ou pensamento intercalado

<section title="Cache de prompt de sistema (preservado quando o pensamento muda)">

<CodeGroup>
```python Python
from anthropic import Anthropic
import requests
from bs4 import BeautifulSoup

client = Anthropic()

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return text

# Fetch the content of the article
book_url = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"
book_content = fetch_article_content(book_url)
# Use just enough text for caching (first few chapters)
LARGE_TEXT = book_content[:5000]

SYSTEM_PROMPT=[
    {
        "type": "text",
        "text": "You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.",
    },
    {
        "type": "text",
        "text": LARGE_TEXT,
        "cache_control": {"type": "ephemeral"}
    }
]

MESSAGES = [
    {
        "role": "user",
        "content": "Analyze the tone of this passage."
    }
]

# First request - establish cache
print("First request - establishing cache")
response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    system=SYSTEM_PROMPT,
    messages=MESSAGES
)

print(f"First response usage: {response1.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response1.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the characters in this passage."
})
# Second request - same thinking parameters (cache hit expected)
print("\nSecond request - same thinking parameters (cache hit expected)")
response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    system=SYSTEM_PROMPT,
    messages=MESSAGES
)

print(f"Second response usage: {response2.usage}")

# Third request - different thinking parameters (cache miss for messages)
print("\nThird request - different thinking parameters (cache miss for messages)")
response3 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 8000  # Changed thinking budget
    },
    system=SYSTEM_PROMPT,  # System prompt remains cached
    messages=MESSAGES  # Messages cache is invalidated
)

print(f"Third response usage: {response3.usage}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic();

async function fetchArticleContent(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Remove script and style elements
  $('script, style').remove();
  
  // Get text
  let text = $.text();
  
  // Break into lines and remove leading and trailing space on each
  const lines = text.split('\n').map(line => line.trim());
  // Drop blank lines
  text = lines.filter(line => line.length > 0).join('\n');
  
  return text;
}

// Fetch the content of the article
const bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
const bookContent = await fetchArticleContent(bookUrl);
// Use just enough text for caching (first few chapters)
const LARGE_TEXT = bookContent.slice(0, 5000);

const SYSTEM_PROMPT = [
  {
    type: "text",
    text: "You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.",
  },
  {
    type: "text",
    text: LARGE_TEXT,
    cache_control: { type: "ephemeral" }
  }
];

const MESSAGES = [
  {
    role: "user",
    content: "Analyze the tone of this passage."
  }
];

// First request - establish cache
console.log("First request - establishing cache");
const response1 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 4000
  },
  system: SYSTEM_PROMPT,
  messages: MESSAGES
});

console.log(`First response usage: ${response1.usage}`);

MESSAGES.push({
  role: "assistant",
  content: response1.content
});
MESSAGES.push({
  role: "user",
  content: "Analyze the characters in this passage."
});

// Second request - same thinking parameters (cache hit expected)
console.log("\nSecond request - same thinking parameters (cache hit expected)");
const response2 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 4000
  },
  system: SYSTEM_PROMPT,
  messages: MESSAGES
});

console.log(`Second response usage: ${response2.usage}`);

// Third request - different thinking parameters (cache miss for messages)
console.log("\nThird request - different thinking parameters (cache miss for messages)");
const response3 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 8000  // Changed thinking budget
  },
  system: SYSTEM_PROMPT,  // System prompt remains cached
  messages: MESSAGES  // Messages cache is invalidated
});

console.log(`Third response usage: ${response3.usage}`);
```
</CodeGroup>

</section>
<section title="Cache de mensagens (invalidado quando o pensamento muda)">

<CodeGroup>
```python Python
from anthropic import Anthropic
import requests
from bs4 import BeautifulSoup

client = Anthropic()

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return text

# Fetch the content of the article
book_url = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"
book_content = fetch_article_content(book_url)
# Use just enough text for caching (first few chapters)
LARGE_TEXT = book_content[:5000]

# No system prompt - caching in messages instead
MESSAGES = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": LARGE_TEXT,
                "cache_control": {"type": "ephemeral"},
            },
            {
                "type": "text",
                "text": "Analyze the tone of this passage."
            }
        ]
    }
]

# First request - establish cache
print("First request - establishing cache")
response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    messages=MESSAGES
)

print(f"First response usage: {response1.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response1.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the characters in this passage."
})
# Second request - same thinking parameters (cache hit expected)
print("\nSecond request - same thinking parameters (cache hit expected)")
response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000  # Same thinking budget
    },
    messages=MESSAGES
)

print(f"Second response usage: {response2.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response2.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the setting in this passage."
})

# Third request - different thinking budget (cache miss expected)
print("\nThird request - different thinking budget (cache miss expected)")
response3 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 8000  # Different thinking budget breaks cache
    },
    messages=MESSAGES
)

print(f"Third response usage: {response3.usage}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic();

async function fetchArticleContent(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Remove script and style elements
  $('script, style').remove();

  // Get text
  let text = $.text();

  // Clean up text (break into lines, remove whitespace)
  const lines = text.split('\n').map(line => line.trim());
  const chunks = lines.flatMap(line => line.split('  ').map(phrase => phrase.trim()));
  text = chunks.filter(chunk => chunk).join('\n');

  return text;
}

async function main() {
  // Fetch the content of the article
  const bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
  const bookContent = await fetchArticleContent(bookUrl);
  // Use just enough text for caching (first few chapters)
  const LARGE_TEXT = bookContent.substring(0, 5000);

  // No system prompt - caching in messages instead
  let MESSAGES = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: LARGE_TEXT,
          cache_control: {type: "ephemeral"},
        },
        {
          type: "text",
          text: "Analyze the tone of this passage."
        }
      ]
    }
  ];

  // First request - establish cache
  console.log("First request - establishing cache");
  const response1 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 4000
    },
    messages: MESSAGES
  });

  console.log(`First response usage: `, response1.usage);

  MESSAGES = [
    ...MESSAGES,
    {
      role: "assistant",
      content: response1.content
    },
    {
      role: "user",
      content: "Analyze the characters in this passage."
    }
  ];

  // Second request - same thinking parameters (cache hit expected)
  console.log("\nSecond request - same thinking parameters (cache hit expected)");
  const response2 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 4000  // Same thinking budget
    },
    messages: MESSAGES
  });

  console.log(`Second response usage: `, response2.usage);

  MESSAGES = [
    ...MESSAGES,
    {
      role: "assistant",
      content: response2.content
    },
    {
      role: "user",
      content: "Analyze the setting in this passage."
    }
  ];

  // Third request - different thinking budget (cache miss expected)
  console.log("\nThird request - different thinking budget (cache miss expected)");
  const response3 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 8000  // Different thinking budget breaks cache
    },
    messages: MESSAGES
  });

  console.log(`Third response usage: `, response3.usage);
}

main().catch(console.error);
```

```java Java
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Arrays;
import java.util.regex.Pattern;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;

import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

public class ThinkingCacheExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Fetch the content of the article
        String bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
        String bookContent = fetchArticleContent(bookUrl);
        // Use just enough text for caching (first few chapters)
        String largeText = bookContent.substring(0, 5000);

        List<BetaTextBlockParam> systemPrompt = List.of(
                BetaTextBlockParam.builder()
                        .text("You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.")
                        .build(),
                BetaTextBlockParam.builder()
                        .text(largeText)
                        .cacheControl(BetaCacheControlEphemeral.builder().build())
                        .build()
        );

        List<BetaMessageParam> messages = new ArrayList<>();
        messages.add(BetaMessageParam.builder()
                .role(BetaMessageParam.Role.USER)
                .content("Analyze the tone of this passage.")
                .build());

        // First request - establish cache
        System.out.println("First request - establishing cache");
        BetaMessage response1 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(4000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .messages(messages)
                        .build()
        );

        System.out.println("First response usage: " + response1.usage());

        // Second request - same thinking parameters (cache hit expected)
        System.out.println("\nSecond request - same thinking parameters (cache hit expected)");
        BetaMessage response2 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(4000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .addMessage(response1)
                        .addUserMessage("Analyze the characters in this passage.")
                        .messages(messages)
                        .build()
        );

        System.out.println("Second response usage: " + response2.usage());

        // Third request - different thinking budget (cache hit expected because system prompt caching)
        System.out.println("\nThird request - different thinking budget (cache hit expected)");
        BetaMessage response3 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(8000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .addMessage(response1)
                        .addUserMessage("Analyze the characters in this passage.")
                        .addMessage(response2)
                        .addUserMessage("Analyze the setting in this passage.")
                        .build()
        );

        System.out.println("Third response usage: " + response3.usage());
    }

    private static String fetchArticleContent(String url) throws IOException {
        // Fetch HTML content
        String htmlContent = fetchHtml(url);

        // Remove script and style elements
        String noScriptStyle = removeElements(htmlContent, "script", "style");

        // Extract text (simple approach - remove HTML tags)
        String text = removeHtmlTags(noScriptStyle);

        // Clean up text (break into lines, remove whitespace)
        List<String> lines = Arrays.asList(text.split("\n"));
        List<String> trimmedLines = lines.stream()
                .map(String::trim)
                .collect(toList());

        // Split on double spaces and flatten
        List<String> chunks = trimmedLines.stream()
                .flatMap(line -> Arrays.stream(line.split("  "))
                        .map(String::trim))
                .collect(toList());

        // Filter empty chunks and join with newlines
        return chunks.stream()
                .filter(chunk -> !chunk.isEmpty())
                .collect(joining("\n"));
    }

    /**
     * Fetches HTML content from a URL
     */
    private static String fetchHtml(String urlString) throws IOException {
        try (InputStream inputStream = new URL(urlString).openStream()) {
            StringBuilder content = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    content.append(line).append("\n");
                }
            }
            return content.toString();
        }
    }

    /**
     * Removes specified HTML elements and their content
     */
    private static String removeElements(String html, String... elementNames) {
        String result = html;
        for (String element : elementNames) {
            // Pattern to match <element>...</element> and self-closing tags
            String pattern = "<" + element + "\\s*[^>]*>.*?</" + element + ">|<" + element + "\\s*[^>]*/?>";
            result = Pattern.compile(pattern, Pattern.DOTALL).matcher(result).replaceAll("");
        }
        return result;
    }

    /**
     * Removes all HTML tags from content
     */
    private static String removeHtmlTags(String html) {
        // Replace <br> and <p> tags with newlines for better text formatting
        String withLineBreaks = html.replaceAll("<br\\s*/?\\s*>|</?p\\s*[^>]*>", "\n");

        // Remove remaining HTML tags
        String noTags = withLineBreaks.replaceAll("<[^>]*>", "");

        // Decode HTML entities (simplified for common entities)
        return decodeHtmlEntities(noTags);
    }

    /**
     * Simple HTML entity decoder for common entities
     */
    private static String decodeHtmlEntities(String text) {
        return text
                .replaceAll("&nbsp;", " ")
                .replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("&quot;", "\"")
                .replaceAll("&#39;", "'")
                .replaceAll("&hellip;", "...")
                .replaceAll("&mdash;", "—");
    }

}
```
</CodeGroup>

Aqui está a saída do script (você pode ver números ligeiramente diferentes)

```
First request - establishing cache
First response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 17, output_tokens: 700 }

Second request - same thinking parameters (cache hit expected)

Second response usage: { cache_creation_input_tokens: 0, cache_read_input_tokens: 1370, input_tokens: 303, output_tokens: 874 }

Third request - different thinking budget (cache miss expected)
Third response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 747, output_tokens: 619 }
```

Este exemplo demonstra que quando o cache é configurado na matriz de mensagens, alterar os parâmetros de pensamento (budget_tokens aumentado de 4000 para 8000) **invalida o cache**. A terceira solicitação não mostra acerto de cache com `cache_creation_input_tokens=1370` e `cache_read_input_tokens=0`, provando que o cache baseado em mensagens é invalidado quando os parâmetros de pensamento mudam.

</section>

## Max tokens e tamanho da janela de contexto com pensamento estendido

Em modelos Claude mais antigos (anteriores ao Claude Sonnet 3.7), se a soma de tokens de prompt e `max_tokens` excedesse a janela de contexto do modelo, o sistema ajustaria automaticamente `max_tokens` para caber dentro do limite de contexto. Isso significava que você poderia definir um grande valor de `max_tokens` e o sistema o reduziria silenciosamente conforme necessário.

Com modelos Claude 3.7 e 4, `max_tokens` (que inclui seu orçamento de pensamento quando o pensamento está ativado) é aplicado como um limite rigoroso. O sistema agora retornará um erro de validação se tokens de prompt + `max_tokens` exceder o tamanho da janela de contexto.

<Note>
Você pode ler nosso [guia sobre janelas de contexto](/docs/pt-BR/build-with-claude/context-windows) para uma análise mais profunda.
</Note>

### A janela de contexto com pensamento estendido

Ao calcular o uso da janela de contexto com pensamento ativado, há algumas considerações a serem observadas:

- Blocos de pensamento de turnos anteriores são removidos e não contam para sua janela de contexto
- O pensamento do turno atual conta para seu limite de `max_tokens` para esse turno

O diagrama abaixo demonstra o gerenciamento especializado de tokens quando o pensamento estendido está ativado:

![Context window diagram with extended thinking](/docs/images/context-window-thinking.svg)

A janela de contexto efetiva é calculada como:

```
context window =
  (current input tokens - previous thinking tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

Recomendamos usar a [API de contagem de tokens](/docs/pt-BR/build-with-claude/token-counting) para obter contagens de tokens precisas para seu caso de uso específico, especialmente ao trabalhar com conversas com múltiplos turnos que incluem pensamento.

### A janela de contexto com pensamento estendido e uso de ferramentas

Ao usar pensamento estendido com uso de ferramentas, blocos de pensamento devem ser explicitamente preservados e retornados com os resultados das ferramentas.

O cálculo efetivo da janela de contexto para pensamento estendido com uso de ferramentas se torna:

```
context window =
  (current input tokens + previous thinking tokens + tool use tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

O diagrama abaixo ilustra o gerenciamento de tokens para pensamento estendido com uso de ferramentas:

![Context window diagram with extended thinking and tool use](/docs/images/context-window-thinking-tools.svg)

### Gerenciando tokens com pensamento estendido

Dado o comportamento da janela de contexto e `max_tokens` com pensamento estendido em modelos Claude 3.7 e 4, você pode precisar:

- Monitorar e gerenciar mais ativamente seu uso de tokens
- Ajustar valores de `max_tokens` conforme o comprimento do seu prompt muda
- Potencialmente usar os [endpoints de contagem de tokens](/docs/pt-BR/build-with-claude/token-counting) com mais frequência
- Estar ciente de que blocos de pensamento anteriores não se acumulam em sua janela de contexto

Esta mudança foi feita para fornecer comportamento mais previsível e transparente, especialmente conforme os limites de tokens máximos aumentaram significativamente.

## Criptografia de pensamento

O conteúdo completo do pensamento é criptografado e retornado no campo `signature`. Este campo é usado para verificar que blocos de pensamento foram gerados por Claude quando passados de volta para a API.

<Note>
É apenas estritamente necessário enviar de volta blocos de pensamento ao usar [ferramentas com pensamento estendido](#extended-thinking-with-tool-use). Caso contrário, você pode omitir blocos de pensamento de turnos anteriores, ou deixar a API removê-los para você se você os passar de volta.

Se enviar de volta blocos de pensamento, recomendamos passar tudo de volta como você recebeu para consistência e para evitar possíveis problemas.
</Note>

Aqui estão algumas considerações importantes sobre criptografia de pensamento:
- Ao [fazer streaming de respostas](#streaming-thinking), a assinatura é adicionada via `signature_delta` dentro de um evento `content_block_delta` logo antes do evento `content_block_stop`.
- Valores de `signature` são significativamente mais longos em modelos Claude 4 do que em modelos anteriores.
- O campo `signature` é um campo opaco e não deve ser interpretado ou analisado - ele existe apenas para fins de verificação.
- Valores de `signature` são compatíveis entre plataformas (Claude APIs, [Amazon Bedrock](/docs/pt-BR/build-with-claude/claude-on-amazon-bedrock) e [Vertex AI](/docs/pt-BR/build-with-claude/claude-on-vertex-ai)). Valores gerados em uma plataforma serão compatíveis com outra.

### Redação de pensamento

Ocasionalmente, o raciocínio interno de Claude será sinalizado por nossos sistemas de segurança. Quando isso ocorre, criptografamos parte ou todo o bloco `thinking` e o retornamos como um bloco `redacted_thinking`. Os blocos `redacted_thinking` são descriptografados quando passados de volta para a API, permitindo que Claude continue sua resposta sem perder contexto.

Ao construir aplicações voltadas para o cliente que usam pensamento estendido:

- Esteja ciente de que os blocos de pensamento redatado contêm conteúdo criptografado que não é legível por humanos
- Considere fornecer uma explicação simples como: "Parte do raciocínio interno de Claude foi automaticamente criptografada por razões de segurança. Isso não afeta a qualidade das respostas."
- Se mostrar blocos de pensamento aos usuários, você pode filtrar blocos redatados enquanto preserva blocos de pensamento normais
- Seja transparente que usar recursos de pensamento estendido pode ocasionalmente resultar em algum raciocínio sendo criptografado
- Implemente tratamento de erros apropriado para gerenciar graciosamente o pensamento redatado sem quebrar sua interface

Aqui está um exemplo mostrando blocos de pensamento normais e redatados:

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "redacted_thinking",
      "data": "EmwKAhgBEgy3va3pzix/LafPsn4aDFIT2Xlxh0L5L8rLVyIwxtE3rAFBa8cr3qpPkNRj2YfWXGmKDxH4mPnZ5sQ7vB9URj2pLmN3kF8/dW5hR7xJ0aP1oLs9yTcMnKVf2wRpEGjH9XZaBt4UvDcPrQ..."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

<Note>
Ver blocos de pensamento redatado em sua saída é um comportamento esperado. O modelo ainda pode usar esse raciocínio redatado para informar suas respostas enquanto mantém proteções de segurança.

Se você precisar testar o tratamento de pensamento redatado em sua aplicação, você pode usar esta string de teste especial como seu prompt: `ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB`
</Note>

Ao passar blocos `thinking` e `redacted_thinking` de volta para a API em uma conversa com múltiplos turnos, você deve incluir o bloco completo e não modificado de volta para a API para o último turno do assistente. Isso é crítico para manter o fluxo de raciocínio do modelo. Sugerimos sempre passar todos os blocos de pensamento de volta para a API. Para mais detalhes, consulte a seção [Preservando blocos de pensamento](#preserving-thinking-blocks) acima.

<section title="Exemplo: Trabalhando com blocos de pensamento redatado">

Este exemplo demonstra como lidar com blocos `redacted_thinking` que podem aparecer em respostas quando o raciocínio interno de Claude contém conteúdo sinalizado por sistemas de segurança:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Using a special prompt that triggers redacted thinking (for demonstration purposes only)
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
    }]
)

# Identify redacted thinking blocks
has_redacted_thinking = any(
    block.type == "redacted_thinking" for block in response.content
)

if has_redacted_thinking:
    print("Response contains redacted thinking blocks")
    # These blocks are still usable in subsequent requests

    # Extract all blocks (both redacted and non-redacted)
    all_thinking_blocks = [
        block for block in response.content
        if block.type in ["thinking", "redacted_thinking"]
    ]

    # When passing to subsequent requests, include all blocks without modification
    # This preserves the integrity of Claude's reasoning

    print(f"Found {len(all_thinking_blocks)} thinking blocks total")
    print(f"These blocks are still billable as output tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Using a special prompt that triggers redacted thinking (for demonstration purposes only)
const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
  }]
});

// Identify redacted thinking blocks
const hasRedactedThinking = response.content.some(
  block => block.type === "redacted_thinking"
);

if (hasRedactedThinking) {
  console.log("Response contains redacted thinking blocks");
  // These blocks are still usable in subsequent requests

  // Extract all blocks (both redacted and non-redacted)
  const allThinkingBlocks = response.content.filter(
    block => block.type === "thinking" || block.type === "redacted_thinking"
  );

  // When passing to subsequent requests, include all blocks without modification
  // This preserves the integrity of Claude's reasoning

  console.log(`Found ${allThinkingBlocks.length} thinking blocks total`);
  console.log(`These blocks are still billable as output tokens`);
}
```

```java Java
import java.util.List;

import static java.util.stream.Collectors.toList;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.BetaContentBlock;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.messages.Model;

public class RedactedThinkingExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Using a special prompt that triggers redacted thinking (for demonstration purposes only)
        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_SONNET_4_5)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB")
                        .build()
        );

        // Identify redacted thinking blocks
        boolean hasRedactedThinking = response.content().stream()
                .anyMatch(BetaContentBlock::isRedactedThinking);

        if (hasRedactedThinking) {
            System.out.println("Response contains redacted thinking blocks");
            // These blocks are still usable in subsequent requests
            // Extract all blocks (both redacted and non-redacted)
            List<BetaContentBlock> allThinkingBlocks = response.content().stream()
                    .filter(block -> block.isThinking() ||
                            block.isRedactedThinking())
                    .collect(toList());

            // When passing to subsequent requests, include all blocks without modification
            // This preserves the integrity of Claude's reasoning
            System.out.println("Found " + allThinkingBlocks.size() + " thinking blocks total");
            System.out.println("These blocks are still billable as output tokens");
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton
  userPrompt="ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
  thinkingBudgetTokens={16000}
>
  Tente no Console
</TryInConsoleButton>

</section>

## Diferenças no pensamento entre versões de modelo

A API de Mensagens lida com pensamento de forma diferente entre os modelos Claude Sonnet 3.7 e Claude 4, principalmente no comportamento de redação e sumarização.

Veja a tabela abaixo para uma comparação condensada:

| Recurso | Claude Sonnet 3.7 | Modelos Claude 4 (pré-Opus 4.5) | Claude Opus 4.5 e posterior |
|---------|------------------|-------------------------------|--------------------------|
| **Saída de Pensamento** | Retorna saída de pensamento completa | Retorna pensamento sumarizado | Retorna pensamento sumarizado |
| **Pensamento Intercalado** | Não suportado | Suportado com cabeçalho beta `interleaved-thinking-2025-05-14` | Suportado com cabeçalho beta `interleaved-thinking-2025-05-14` |
| **Preservação de Bloco de Pensamento** | Não preservado entre turnos | Não preservado entre turnos | **Preservado por padrão** (habilita otimização de cache, economia de tokens) |

### Preservação de bloco de pensamento no Claude Opus 4.5

Claude Opus 4.5 introduz um novo comportamento padrão: **blocos de pensamento de turnos anteriores do assistente são preservados no contexto do modelo por padrão**. Isso difere dos modelos anteriores, que removem blocos de pensamento de turnos anteriores.

**Benefícios da preservação de blocos de pensamento:**

- **Otimização de cache**: Ao usar uso de ferramenta, blocos de pensamento preservados habilitam acertos de cache, pois são passados de volta com resultados de ferramenta e armazenados em cache incrementalmente entre o turno do assistente, resultando em economia de tokens em fluxos de trabalho com múltiplas etapas
- **Sem impacto na inteligência**: Preservar blocos de pensamento não tem efeito negativo no desempenho do modelo

**Considerações importantes:**

- **Uso de contexto**: Conversas longas consumirão mais espaço de contexto, pois blocos de pensamento são retidos no contexto
- **Comportamento automático**: Este é o comportamento padrão para Claude Opus 4.5—nenhuma alteração de código ou cabeçalhos beta são necessários
- **Compatibilidade com versões anteriores**: Para aproveitar este recurso, continue passando blocos de pensamento completos e não modificados de volta para a API como você faria para uso de ferramenta

<Note>
Para modelos anteriores (Claude Sonnet 4.5, Opus 4.1, etc.), blocos de pensamento de turnos anteriores continuam sendo removidos do contexto. O comportamento existente descrito na seção [Pensamento estendido com cache de prompt](#extended-thinking-with-prompt-caching) se aplica a esses modelos.
</Note>

## Preços

Para informações completas de preços, incluindo taxas base, gravações de cache, acertos de cache e tokens de saída, consulte a [página de preços](/docs/pt-BR/about-claude/pricing).

O processo de pensamento incorre em cobranças por:
- Tokens usados durante o pensamento (tokens de saída)
- Blocos de pensamento do último turno do assistente incluídos em solicitações subsequentes (tokens de entrada)
- Tokens de saída de texto padrão

<Note>
Quando o pensamento estendido está habilitado, um prompt de sistema especializado é automaticamente incluído para suportar este recurso.
</Note>

Ao usar pensamento sumarizado:
- **Tokens de entrada**: Tokens em sua solicitação original (exclui tokens de pensamento de turnos anteriores)
- **Tokens de saída (cobrados)**: Os tokens de pensamento originais que Claude gerou internamente
- **Tokens de saída (visíveis)**: Os tokens de pensamento sumarizado que você vê na resposta
- **Sem cobrança**: Tokens usados para gerar o resumo

<Warning>
A contagem de tokens de saída cobrada **não** corresponderá à contagem de tokens visível na resposta. Você é cobrado pelo processo de pensamento completo, não pelo resumo que você vê.
</Warning>

## Melhores práticas e considerações para pensamento estendido

### Trabalhando com orçamentos de pensamento

- **Otimização de orçamento:** O orçamento mínimo é 1.024 tokens. Sugerimos começar no mínimo e aumentar o orçamento de pensamento incrementalmente para encontrar o intervalo ideal para seu caso de uso. Contagens de tokens mais altas habilitam raciocínio mais abrangente, mas com retornos diminuindo dependendo da tarefa. Aumentar o orçamento pode melhorar a qualidade da resposta em troca de latência aumentada. Para tarefas críticas, teste diferentes configurações para encontrar o equilíbrio ideal. Observe que o orçamento de pensamento é um alvo em vez de um limite rigoroso—o uso real de tokens pode variar com base na tarefa.
- **Pontos de partida:** Comece com orçamentos de pensamento maiores (16k+ tokens) para tarefas complexas e ajuste com base em suas necessidades.
- **Orçamentos grandes:** Para orçamentos de pensamento acima de 32k, recomendamos usar [processamento em lote](/docs/pt-BR/build-with-claude/batch-processing) para evitar problemas de rede. Solicitações que empurram o modelo para pensar acima de 32k tokens causam solicitações de longa duração que podem atingir limites de tempo limite do sistema e limites de conexão aberta.
- **Rastreamento de uso de tokens:** Monitore o uso de tokens de pensamento para otimizar custos e desempenho.

### Considerações de desempenho

- **Tempos de resposta:** Esteja preparado para tempos de resposta potencialmente mais longos devido ao processamento adicional necessário para o processo de raciocínio. Considere que gerar blocos de pensamento pode aumentar o tempo de resposta geral.
- **Requisitos de streaming:** Streaming é necessário quando `max_tokens` é maior que 21.333. Ao fazer streaming, esteja preparado para lidar com blocos de conteúdo de pensamento e texto conforme chegam.

### Compatibilidade de recursos

- Pensamento não é compatível com modificações de `temperature` ou `top_k`, bem como [uso forçado de ferramenta](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#forcing-tool-use).
- Quando o pensamento está habilitado, você pode definir `top_p` para valores entre 1 e 0,95.
- Você não pode pré-preenchimento de respostas quando o pensamento está habilitado.
- Alterações no orçamento de pensamento invalidam prefixos de prompt em cache que incluem mensagens. No entanto, prompts de sistema em cache e definições de ferramenta continuarão funcionando quando os parâmetros de pensamento mudarem.

### Diretrizes de uso

- **Seleção de tarefa:** Use pensamento estendido para tarefas particularmente complexas que se beneficiam de raciocínio passo a passo, como matemática, codificação e análise.
- **Tratamento de contexto:** Você não precisa remover blocos de pensamento anteriores você mesmo. A API Claude automaticamente ignora blocos de pensamento de turnos anteriores e eles não são incluídos ao calcular o uso de contexto.
- **Engenharia de prompt:** Revise nossas [dicas de prompt de pensamento estendido](/docs/pt-BR/build-with-claude/prompt-engineering/extended-thinking-tips) se você quiser maximizar as capacidades de pensamento de Claude.

## Próximos passos

<CardGroup>
  <Card title="Tente o livro de receitas de pensamento estendido" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    Explore exemplos práticos de pensamento em nosso livro de receitas.
  </Card>
  <Card title="Dicas de prompt de pensamento estendido" icon="code" href="/docs/pt-BR/build-with-claude/prompt-engineering/extended-thinking-tips">
    Aprenda as melhores práticas de engenharia de prompt para pensamento estendido.
  </Card>
</CardGroup>