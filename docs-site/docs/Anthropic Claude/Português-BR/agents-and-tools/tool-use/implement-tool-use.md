# Como implementar o uso de ferramentas

Guia completo sobre como implementar o uso de ferramentas com Claude, incluindo definições de ferramentas, exemplos e práticas recomendadas.

---

## Escolhendo um modelo

Recomendamos usar o Claude Sonnet (4.5) ou Claude Opus (4.1) mais recente para ferramentas complexas e consultas ambíguas; eles lidam melhor com múltiplas ferramentas e buscam esclarecimentos quando necessário.

Use modelos Claude Haiku para ferramentas diretas, mas observe que eles podem inferir parâmetros ausentes.

<Tip>
Se estiver usando Claude com uso de ferramentas e pensamento estendido, consulte nosso guia [aqui](/docs/pt-BR/build-with-claude/extended-thinking) para mais informações.
</Tip>

## Especificando ferramentas do cliente

As ferramentas do cliente (tanto as definidas pela Anthropic quanto as definidas pelo usuário) são especificadas no parâmetro `tools` de nível superior da solicitação da API. Cada definição de ferramenta inclui:

| Parâmetro      | Descrição                                                                                         |
| :------------- | :-------------------------------------------------------------------------------------------------- |
| `name`         | O nome da ferramenta. Deve corresponder à regex `^[a-zA-Z0-9_-]{1,64}$`.                                 |
| `description`  | Uma descrição detalhada em texto simples do que a ferramenta faz, quando deve ser usada e como se comporta. |
| `input_schema` | Um objeto [JSON Schema](https://json-schema.org/) que define os parâmetros esperados para a ferramenta.     |
| `input_examples` | (Opcional, beta) Uma matriz de objetos de entrada de exemplo para ajudar Claude a entender como usar a ferramenta. Veja [Fornecendo exemplos de uso de ferramentas](#providing-tool-use-examples). |

<section title="Exemplo de definição de ferramenta simples">

```json JSON
{
  "name": "get_weather",
  "description": "Get the current weather in a given location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "The city and state, e.g. San Francisco, CA"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
      }
    },
    "required": ["location"]
  }
}
```

Esta ferramenta, nomeada `get_weather`, espera um objeto de entrada com uma string `location` obrigatória e uma string `unit` opcional que deve ser "celsius" ou "fahrenheit".

</section>

### Prompt do sistema de uso de ferramentas

Quando você chama a API Claude com o parâmetro `tools`, construímos um prompt do sistema especial a partir das definições de ferramentas, configuração de ferramentas e qualquer prompt do sistema especificado pelo usuário. O prompt construído é projetado para instruir o modelo a usar a(s) ferramenta(s) especificada(s) e fornecer o contexto necessário para que a ferramenta funcione adequadamente:

```
In this environment you have access to a set of tools you can use to answer the user's question.
{{ FORMATTING INSTRUCTIONS }}
String and scalar parameters should be specified as is, while lists and objects should use JSON format. Note that spaces for string values are not stripped. The output is not expected to be valid XML and is parsed with regular expressions.
Here are the functions available in JSONSchema format:
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

### Práticas recomendadas para definições de ferramentas

Para obter o melhor desempenho do Claude ao usar ferramentas, siga estas diretrizes:

- **Forneça descrições extremamente detalhadas.** Este é de longe o fator mais importante no desempenho da ferramenta. Suas descrições devem explicar cada detalhe sobre a ferramenta, incluindo:
  - O que a ferramenta faz
  - Quando deve ser usada (e quando não deve)
  - O que cada parâmetro significa e como afeta o comportamento da ferramenta
  - Quaisquer ressalvas ou limitações importantes, como quais informações a ferramenta não retorna se o nome da ferramenta for pouco claro. Quanto mais contexto você puder fornecer ao Claude sobre suas ferramentas, melhor ele será em decidir quando e como usá-las. Procure por pelo menos 3-4 frases por descrição de ferramenta, mais se a ferramenta for complexa.
- **Priorize descrições, mas considere usar `input_examples` para ferramentas complexas.** Descrições claras são mais importantes, mas para ferramentas com entradas complexas, objetos aninhados ou parâmetros sensíveis ao formato, você pode usar o campo `input_examples` (beta) para fornecer exemplos validados por esquema. Veja [Fornecendo exemplos de uso de ferramentas](#providing-tool-use-examples) para detalhes.

<section title="Exemplo de uma boa descrição de ferramenta">

```json JSON
{
  "name": "get_stock_price",
  "description": "Retrieves the current stock price for a given ticker symbol. The ticker symbol must be a valid symbol for a publicly traded company on a major US stock exchange like NYSE or NASDAQ. The tool will return the latest trade price in USD. It should be used when the user asks about the current or most recent price of a specific stock. It will not provide any other information about the stock or company.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string",
        "description": "The stock ticker symbol, e.g. AAPL for Apple Inc."
      }
    },
    "required": ["ticker"]
  }
}
```

</section>

<section title="Exemplo de descrição de ferramenta ruim">

```json JSON
{
  "name": "get_stock_price",
  "description": "Gets the stock price for a ticker.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string"
      }
    },
    "required": ["ticker"]
  }
}
```

</section>

A boa descrição explica claramente o que a ferramenta faz, quando usá-la, quais dados ela retorna e o que o parâmetro `ticker` significa. A descrição ruim é muito breve e deixa Claude com muitas questões em aberto sobre o comportamento e o uso da ferramenta.

## Fornecendo exemplos de uso de ferramentas

Você pode fornecer exemplos concretos de entradas de ferramentas válidas para ajudar Claude a entender como usar suas ferramentas de forma mais eficaz. Isso é particularmente útil para ferramentas complexas com objetos aninhados, parâmetros opcionais ou entradas sensíveis ao formato.

<Info>
Exemplos de uso de ferramentas é um recurso beta. Inclua o [cabeçalho beta](/docs/pt-BR/api/beta-headers) apropriado para seu provedor:

| Provedor | Cabeçalho beta | Modelos suportados |
|----------|-------------|------------------|
| Claude API,<br/>Microsoft Foundry | `advanced-tool-use-2025-11-20` | Todos os modelos |
| Vertex AI,<br/>Amazon Bedrock | `tool-examples-2025-10-29` | Apenas Claude Opus 4.5 |
</Info>

### Uso básico

Adicione um campo `input_examples` opcional à sua definição de ferramenta com uma matriz de objetos de entrada de exemplo. Cada exemplo deve ser válido de acordo com o `input_schema` da ferramenta:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    betas=["advanced-tool-use-2025-11-20"],
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature"
                    }
                },
                "required": ["location"]
            },
            "input_examples": [
                {
                    "location": "San Francisco, CA",
                    "unit": "fahrenheit"
                },
                {
                    "location": "Tokyo, Japan",
                    "unit": "celsius"
                },
                {
                    "location": "New York, NY"  # 'unit' is optional
                }
            ]
        }
    ],
    messages=[
        {"role": "user", "content": "What's the weather like in San Francisco?"}
    ]
)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  betas: ["advanced-tool-use-2025-11-20"],
  tools: [
    {
      name: "get_weather",
      description: "Get the current weather in a given location",
      input_schema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "The unit of temperature",
          },
        },
        required: ["location"],
      },
      input_examples: [
        {
          location: "San Francisco, CA",
          unit: "fahrenheit",
        },
        {
          location: "Tokyo, Japan",
          unit: "celsius",
        },
        {
          location: "New York, NY",
          // Demonstrates that 'unit' is optional
        },
      ],
    },
  ],
  messages: [{ role: "user", content: "What's the weather like in San Francisco?" }],
});
```
</CodeGroup>

Os exemplos são incluídos no prompt ao lado do seu esquema de ferramenta, mostrando ao Claude padrões concretos para chamadas de ferramenta bem formadas. Isso ajuda Claude a entender quando incluir parâmetros opcionais, quais formatos usar e como estruturar entradas complexas.

### Requisitos e limitações

- **Validação de esquema** - Cada exemplo deve ser válido de acordo com o `input_schema` da ferramenta. Exemplos inválidos retornam um erro 400
- **Não suportado para ferramentas do lado do servidor** - Apenas ferramentas definidas pelo usuário podem ter exemplos de entrada
- **Custo de token** - Os exemplos adicionam aos tokens de prompt: ~20-50 tokens para exemplos simples, ~100-200 tokens para objetos aninhados complexos

## Executor de ferramentas (beta)

O executor de ferramentas fornece uma solução pronta para executar ferramentas com Claude. Em vez de lidar manualmente com chamadas de ferramentas, resultados de ferramentas e gerenciamento de conversas, o executor de ferramentas automaticamente:

- Executa ferramentas quando Claude as chama
- Lida com o ciclo de solicitação/resposta
- Gerencia o estado da conversa
- Fornece segurança de tipo e validação

Recomendamos que você use o executor de ferramentas para a maioria das implementações de uso de ferramentas.

<Note>
O executor de ferramentas está atualmente em beta e disponível nos SDKs [Python](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md), [TypeScript](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers) e [Ruby](https://github.com/anthropics/anthropic-sdk-ruby/blob/main/helpers.md#3-auto-looping-tool-runner-beta).
</Note>

<Tip>
**Gerenciamento automático de contexto com compactação**

O executor de ferramentas suporta [compactação](/docs/pt-BR/build-with-claude/context-editing#client-side-compaction-sdk) automática, que gera resumos quando o uso de tokens excede um limite. Isso permite que tarefas agentes de longa duração continuem além dos limites da janela de contexto.
</Tip>

<Tabs>
<Tab title="Python">

### Uso básico

Use o decorador `@beta_tool` para definir ferramentas e `client.beta.messages.tool_runner()` para executá-las.

<Note>
Se você estiver usando o cliente assíncrono, substitua `@beta_tool` por `@beta_async_tool` e defina a função com `async def`.
</Note>

```python
import anthropic
import json
from anthropic import beta_tool

# Initialize client
client = anthropic.Anthropic()

# Define tools using the decorator
@beta_tool
def get_weather(location: str, unit: str = "fahrenheit") -> str:
    """Get the current weather in a given location.

    Args:
        location: The city and state, e.g. San Francisco, CA
        unit: Temperature unit, either 'celsius' or 'fahrenheit'
    """
    # In a full implementation, you'd call a weather API here
    return json.dumps({"temperature": "20°C", "condition": "Sunny"})

@beta_tool
def calculate_sum(a: int, b: int) -> str:
    """Add two numbers together.

    Args:
        a: First number
        b: Second number
    """
    return str(a + b)

# Use the tool runner
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather, calculate_sum],
    messages=[
        {"role": "user", "content": "What's the weather like in Paris? Also, what's 15 + 27?"}
    ]
)
for message in runner:
    print(message.content[0].text)
```

A função decorada deve retornar um bloco de conteúdo ou matriz de blocos de conteúdo, incluindo texto, imagens ou blocos de documento. Isso permite que ferramentas retornem respostas ricas e multimodais. Strings retornadas serão convertidas em um bloco de conteúdo de texto.
Se você quiser retornar um objeto JSON estruturado para Claude, codifique-o como uma string JSON antes de retorná-lo. Números, booleanos ou outras primitivas não-string também devem ser convertidas para strings.

O decorador `@beta_tool` inspecionará os argumentos da função e a docstring para extrair uma representação de esquema json da função fornecida, no exemplo acima `calculate_sum` será transformado em:

```json
{
  "name": "calculate_sum",
  "description": "Adds two integers together.",
  "input_schema": {
    "additionalProperties": false,
    "properties": {
      "left": {
        "description": "The first integer to add.",
        "title": "Left",
        "type": "integer"
      },
      "right": {
        "description": "The second integer to add.",
        "title": "Right",
        "type": "integer"
      }
    },
    "required": ["left", "right"],
    "type": "object"
  }
}
```

### Iterando sobre o executor de ferramentas

O executor de ferramentas retornado por `tool_runner()` é iterável, que você pode iterar com um loop `for`. Isso é frequentemente referido como um "loop de chamada de ferramenta".
Cada iteração do loop produz uma mensagem que foi retornada por Claude.

Depois que seu código tem a chance de processar a mensagem atual dentro do loop, o executor de ferramentas verificará a mensagem para ver se Claude solicitou um uso de ferramenta. Se assim for, ele chamará a ferramenta e enviará o resultado da ferramenta de volta para Claude automaticamente, depois produzirá a próxima mensagem do Claude para iniciar a próxima iteração do seu loop.

Você pode encerrar o loop em qualquer iteração com uma simples instrução `break`. O executor de ferramentas fará loop até que Claude retorne uma mensagem sem um uso de ferramenta.

Se você não se importa com mensagens intermediárias, em vez de usar um loop, você pode chamar o método `until_done()`, que retornará a mensagem final do Claude:

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather, calculate_sum],
    messages=[
        {"role": "user", "content": "What's the weather like in Paris? Also, what's 15 + 27?"}
    ]
)
final_message = runner.until_done()
print(final_message.content[0].text)
```

### Uso avançado

Dentro do loop, você tem a capacidade de personalizar totalmente a próxima solicitação do executor de ferramentas para a API de Mensagens.
O método `runner.generate_tool_call_response()` chamará a ferramenta (se Claude acionou um uso de ferramenta) e lhe dará acesso ao resultado da ferramenta que será enviado de volta para a API de Mensagens.
Os métodos `runner.set_messages_params()` e `runner.append_messages()` permitem que você modifique os parâmetros para a próxima solicitação da API de Mensagens.

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather],
    messages=[{"role": "user", "content": "What's the weather in San Francisco?"}]
)
for message in runner:
    # Get the tool response that will be sent
    tool_response = runner.generate_tool_call_response()

    # Customize the next request
    runner.set_messages_params(lambda params: {
        **params,
        "max_tokens": 2048  # Increase tokens for next request
    })

    # Or add additional messages
    runner.append_messages(
        {"role": "user", "content": "Please be concise in your response."}
    )
```

### Streaming

Ao habilitar streaming com `stream=True`, cada valor emitido pelo executor de ferramentas é um `BetaMessageStream` conforme retornado de `anthropic.messages.stream()`. O `BetaMessageStream` é em si iterável e produz eventos de streaming da API de Mensagens.

Você pode usar `message_stream.get_final_message()` para deixar o SDK fazer a acumulação de eventos de streaming na mensagem final para você.

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[calculate_sum],
    messages=[{"role": "user", "content": "What is 15 + 27?"}],
    stream=True
)

# When streaming, the runner returns BetaMessageStream
for message_stream in runner:
    for event in message_stream:
        print('event:', event)
    print('message:', message_stream.get_final_message())

print(runner.until_done())
```

</Tab>
<Tab title="TypeScript (Zod)">

### Uso básico

Use `betaZodTool()` para definições de ferramentas type-safe com validação Zod (requer Zod 3.25.0 ou superior).

```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { betaZodTool, betaTool } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';

const anthropic = new Anthropic();

// Using betaZodTool (requires Zod 3.25.0+)
const getWeatherTool = betaZodTool({
  name: 'get_weather',
  description: 'Get the current weather in a given location',
  inputSchema: z.object({
    location: z.string().describe('The city and state, e.g. San Francisco, CA'),
    unit: z.enum(['celsius', 'fahrenheit']).default('fahrenheit')
      .describe('Temperature unit')
  }),
  run: async (input) => {
    // In a full implementation, you'd call a weather API here
    return JSON.stringify({temperature: '20°C', condition: 'Sunny'});
  }
});

// Use the tool runner
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    {
      role: 'user',
      content: "What's the weather like in Paris?"
    }
  ]
});

// Process messages as they come in
for await (const message of runner) {
  console.log(message.content[0].text);
}
```

A função `run` deve retornar um bloco de conteúdo ou matriz de blocos de conteúdo, incluindo texto, imagens ou blocos de documento. Isso permite que ferramentas retornem respostas ricas e multimodais. Strings retornadas serão convertidas em um bloco de conteúdo de texto.
Se você quiser retornar um objeto JSON estruturado para Claude, codifique-o como uma string JSON antes de retorná-lo. Números, booleanos ou outras primitivas não-string também devem ser convertidas para strings.

### Iterando sobre o executor de ferramentas

O executor de ferramentas retornado por `toolRunner()` é um iterável assíncrono, que você pode iterar com um loop `for await ... of`. Isso é frequentemente referido como um "loop de chamada de ferramenta".
Cada iteração do loop produz uma mensagem que foi retornada por Claude.

Depois que seu código teve a chance de processar a mensagem atual dentro do loop, o executor de ferramentas verificará a mensagem para ver se Claude solicitou um uso de ferramenta. Se assim for, ele chamará a ferramenta e enviará o resultado da ferramenta de volta para Claude automaticamente, depois produzirá a próxima mensagem do Claude para iniciar a próxima iteração do seu loop.

Você pode encerrar o loop em qualquer iteração com uma simples instrução `break`. O executor de ferramentas fará loop até que Claude retorne uma mensagem sem um uso de ferramenta.

Se você não se importa com mensagens intermediárias, em vez de usar um loop, você pode simplesmente `await` o executor de ferramentas, que retornará a mensagem final do Claude.

### Uso avançado

Dentro do loop, você tem a capacidade de personalizar totalmente a próxima solicitação do executor de ferramentas para a API de Mensagens.
O método `runner.generateToolResponse()` chamará a ferramenta (se Claude acionou um uso de ferramenta) e lhe dará acesso ao resultado da ferramenta que será enviado de volta para a API de Mensagens.
Os métodos `runner.setMessagesParams()` e `runner.pushMessages()` permitem que você modifique os parâmetros para a próxima solicitação da API de Mensagens. Os parâmetros atuais estão disponíveis em `runner.params`.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    { role: 'user', content: "What's the weather in San Francisco?" }
  ]
});

for await (const message of runner) {
  // Get the tool response that will be sent
  const toolResponse = await runner.generateToolResponse();

  // Customize the next request
  runner.setMessagesParams(params => ({
    ...params,
    max_tokens: 2048  // Increase tokens for next request
  }));

  // Or add additional messages
  runner.pushMessages(
    { role: 'user', content: 'Please be concise in your response.' }
  );
}
```

### Streaming

Ao habilitar streaming com `stream: true`, cada valor emitido pelo executor de ferramentas é um `MessageStream` conforme retornado de `anthropic.messages.stream()`. O `MessageStream` é em si um iterável assíncrono que produz eventos de streaming da API de Mensagens.

Você pode usar `messageStream.finalMessage()` para deixar o SDK fazer a acumulação de eventos de streaming na mensagem final para você.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'What is the weather in San Francisco?' }],
  tools: [calculatorTool],
  stream: true,
});

// When streaming, the runner returns BetaMessageStream
for await (const messageStream of runner) {
  for await (const event of messageStream) {
    console.log('event:', event);
  }
  console.log('message:', await messageStream.finalMessage());
}

console.log(await runner);
```

</Tab>
<Tab title="TypeScript (JSON Schema)">

### Uso básico

Use `betaTool()` para definições de ferramentas type-safe baseadas em esquemas JSON. TypeScript e seu editor estarão cientes do tipo do parâmetro `input` para autocompletar.

<Note>
A entrada gerada por Claude não será validada em tempo de execução. Execute a validação dentro da função `run` se necessário.
</Note>

```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { betaZodTool, betaTool } from '@anthropic-ai/sdk/helpers/beta/json-schema';
import { z } from 'zod';

const anthropic = new Anthropic();

// Using betaTool with JSON schema (no Zod required)
const calculateSumTool = betaTool({
  name: 'calculate_sum',
  description: 'Add two numbers together',
  inputSchema: {
    type: 'object',
    properties: {
      a: { type: 'number', description: 'First number' },
      b: { type: 'number', description: 'Second number' }
    },
    required: ['a', 'b']
  },
  run: async (input) => {
    return String(input.a + input.b);
  }
});

// Use the tool runner
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool, calculateSumTool],
  messages: [
    {
      role: 'user',
      content: "What's 15 + 27?"
    }
  ]
});

// Process messages as they come in
for await (const message of runner) {
  console.log(message.content[0].text);
}
```

A função `run` deve retornar qualquer bloco de conteúdo ou matriz de blocos de conteúdo, incluindo texto, imagem ou blocos de documento. Isso permite que ferramentas retornem respostas ricas e multimodais. Strings retornadas serão convertidas em um bloco de conteúdo de texto.
Se você quiser retornar um objeto JSON estruturado para Claude, codifique-o como uma string JSON antes de retorná-lo. Números, booleanos ou outras primitivas não-string também devem ser convertidas para strings.

### Iterando sobre o executor de ferramentas

O executor de ferramentas retornado por `toolRunner()` é um iterável assíncrono, que você pode iterar com um loop `for await ... of`. Isso é frequentemente referido como um "loop de chamada de ferramenta".
Cada iteração do loop produz uma mensagem que foi retornada por Claude.

Depois que seu código teve a chance de processar a mensagem atual dentro do loop, o executor de ferramentas verificará a mensagem para ver se Claude solicitou um uso de ferramenta. Se assim for, ele chamará a ferramenta e enviará o resultado da ferramenta de volta para Claude automaticamente, depois produzirá a próxima mensagem do Claude para iniciar a próxima iteração do seu loop.

Você pode encerrar o loop em qualquer iteração com uma simples instrução `break`. O executor de ferramentas fará loop até que Claude retorne uma mensagem sem um uso de ferramenta.

Se você não se importa com mensagens intermediárias, em vez de usar um loop, você pode simplesmente `await` o executor de ferramentas, que retornará a mensagem final do Claude.

### Uso avançado

Dentro do loop, você tem a capacidade de personalizar totalmente a próxima solicitação do executor de ferramentas para a API de Mensagens.
O método `runner.generateToolResponse()` chamará a ferramenta (se Claude acionou um uso de ferramenta) e lhe dará acesso ao resultado da ferramenta que será enviado de volta para a API de Mensagens.
Os métodos `runner.setMessagesParams()` e `runner.pushMessages()` permitem que você modifique os parâmetros para a próxima solicitação da API de Mensagens. Os parâmetros atuais estão disponíveis em `runner.params`.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    { role: 'user', content: "What's the weather in San Francisco?" }
  ]
});

for await (const message of runner) {
  // Get the tool response that will be sent
  const toolResponse = await runner.generateToolResponse();

  // Customize the next request
  runner.setMessagesParams(params => ({
    ...params,
    max_tokens: 2048  // Increase tokens for next request
  }));

  // Or add additional messages
  runner.pushMessages(
    { role: 'user', content: 'Please be concise in your response.' }
  );
}
```

### Streaming

Ao habilitar streaming com `stream: true`, cada valor emitido pelo executor de ferramentas é um `MessageStream` conforme retornado de `anthropic.messages.stream()`. O `MessageStream` é em si um iterável assíncrono que produz eventos de streaming da API de Mensagens.

Você pode usar `messageStream.finalMessage()` para deixar o SDK fazer a acumulação de eventos de streaming na mensagem final para você.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'What is the weather in San Francisco?' }],
  tools: [calculatorTool],
  stream: true,
});

// When streaming, the runner returns BetaMessageStream
for await (const messageStream of runner) {
  for await (const event of messageStream) {
    console.log('event:', event);
  }
  console.log('message:', await messageStream.finalMessage());
}

console.log(await runner);
```

</Tab>
<Tab title="Ruby">

### Uso básico

Defina ferramentas usando `Anthropic::BaseTool` com um esquema de entrada, depois use `client.beta.messages.tool_runner` para executá-las.

```ruby
require "anthropic"

# Initialize client
client = Anthropic::Client.new

# Define input schema
class GetWeatherInput < Anthropic::BaseModel
  required :location, String, doc: "The city and state, e.g. San Francisco, CA"
  optional :unit, Anthropic::InputSchema::EnumOf["celsius", "fahrenheit"],
           doc: "Temperature unit"
end

# Define tool
class GetWeather < Anthropic::BaseTool
  doc "Get the current weather in a given location"
  input_schema GetWeatherInput

  def call(input)
    # In a full implementation, you'd call a weather API here
    JSON.generate({temperature: "20°C", condition: "Sunny"})
  end
end

class CalculateSumInput < Anthropic::BaseModel
  required :a, Integer, doc: "First number"
  required :b, Integer, doc: "Second number"
end

class CalculateSum < Anthropic::BaseTool
  doc "Add two numbers together"
  input_schema CalculateSumInput

  def call(input)
    (input.a + input.b).to_s
  end
end

# Use the tool runner
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new, CalculateSum.new],
  messages: [
    {role: "user", content: "What's the weather like in Paris? Also, what's 15 + 27?"}
  ]
)

runner.each_message do |message|
  message.content.each do |block|
    puts block.text if block.respond_to?(:text)
  end
end
```

O método `call` deve retornar uma string ou uma matriz de blocos de conteúdo. Se você quiser retornar um objeto JSON estruturado para Claude, codifique-o como uma string JSON antes de retorná-lo.

A classe `Anthropic::BaseTool` usa o método `doc` para a descrição da ferramenta e `input_schema` para definir os parâmetros esperados. O SDK converterá automaticamente isso para o formato de esquema JSON apropriado.

### Iterando sobre o executor de ferramentas

O executor de ferramentas fornece um método `each_message` que produz cada mensagem conforme a conversa progride. Isso é frequentemente referido como um "loop de chamada de ferramenta".

Depois que seu código tem a chance de processar a mensagem atual, o executor de ferramentas verificará se Claude solicitou um uso de ferramenta. Se assim for, ele chamará a ferramenta e enviará o resultado da ferramenta de volta para Claude automaticamente, depois produzirá a próxima mensagem.

Se você não se importa com mensagens intermediárias, você pode usar o método `run_until_finished` para obter todas as mensagens de uma vez:

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new, CalculateSum.new],
  messages: [
    {role: "user", content: "What's the weather like in Paris? Also, what's 15 + 27?"}
  ]
)

all_messages = runner.run_until_finished
all_messages.each { |msg| puts msg.content }
```

### Uso avançado

O executor de ferramentas fornece vários métodos para personalizar o comportamento:

- `#next_message` - Avance manualmente pela conversa uma mensagem por vez
- `#feed_messages` - Injete mensagens adicionais no meio da conversa
- `#params` - Acesse ou modifique os parâmetros de solicitação atuais

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new],
  messages: [{role: "user", content: "What's the weather in San Francisco?"}]
)

# Manual step-by-step control
message = runner.next_message
puts message.content

# Inject follow-up messages
runner.feed_messages([
  {role: "user", content: "Also check Boston"}
])

# Access current parameters
puts runner.params
```

### Streaming

Ao usar streaming, itere com `each_streaming` para receber eventos em tempo real:

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [CalculateSum.new],
  messages: [{role: "user", content: "What is 15 + 27?"}]
)

runner.each_streaming do |event|
  case event
  when Anthropic::Streaming::TextEvent
    print event.text
  when Anthropic::Streaming::ToolUseEvent
    puts "\nTool called: #{event.tool_name}"
  end
end
```

</Tab>
</Tabs>

<Note>
O executor de ferramentas do SDK está em beta. O resto deste documento cobre a implementação manual de ferramentas.
</Note>

## Controlando a saída do Claude

### Forçando o uso de ferramentas

Em alguns casos, você pode querer que Claude use uma ferramenta específica para responder à pergunta do usuário, mesmo que Claude pense que pode fornecer uma resposta sem usar uma ferramenta. Você pode fazer isso especificando a ferramenta no campo `tool_choice` assim:

```
tool_choice = {"type": "tool", "name": "get_weather"}
```

Ao trabalhar com o parâmetro tool_choice, temos quatro opções possíveis:

- `auto` permite que Claude decida se deve chamar qualquer ferramenta fornecida ou não. Este é o valor padrão quando `tools` são fornecidas.
- `any` diz ao Claude que ele deve usar uma das ferramentas fornecidas, mas não força uma ferramenta particular.
- `tool` permite que forçemos Claude a sempre usar uma ferramenta particular.
- `none` impede que Claude use qualquer ferramenta. Este é o valor padrão quando nenhuma `tools` é fornecida.

<Note>
Ao usar [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching#what-invalidates-the-cache), mudanças no parâmetro `tool_choice` invalidarão blocos de mensagens em cache. Definições de ferramentas e prompts do sistema permanecem em cache, mas o conteúdo da mensagem deve ser reprocessado.
</Note>

Este diagrama ilustra como cada opção funciona:

<Frame>
  ![Image](/docs/images/tool_choice.png)
</Frame>

Observe que quando você tem `tool_choice` como `any` ou `tool`, preencheremos previamente a mensagem do assistente para forçar o uso de uma ferramenta. Isso significa que os modelos não emitirão uma resposta em linguagem natural ou explicação antes dos blocos de conteúdo `tool_use`, mesmo se explicitamente solicitado.

<Note>
Ao usar [pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking) com uso de ferramentas, `tool_choice: {"type": "any"}` e `tool_choice: {"type": "tool", "name": "..."}` não são suportados e resultarão em um erro. Apenas `tool_choice: {"type": "auto"}` (o padrão) e `tool_choice: {"type": "none"}` são compatíveis com pensamento estendido.
</Note>

Nossos testes mostraram que isso não deve reduzir o desempenho. Se você gostaria que o modelo fornecesse contexto em linguagem natural ou explicações enquanto ainda solicitava que o modelo use uma ferramenta específica, você pode usar `{"type": "auto"}` para `tool_choice` (o padrão) e adicionar instruções explícitas em uma mensagem `user`. Por exemplo: `What's the weather like in London? Use the get_weather tool in your response.`

<Tip>
**Chamadas de ferramentas garantidas com ferramentas estritas**

Combine `tool_choice: {"type": "any"}` com [uso de ferramentas estritas](/docs/pt-BR/build-with-claude/structured-outputs) para garantir que uma de suas ferramentas será chamada E que as entradas da ferramenta seguem estritamente seu esquema. Defina `strict: true` em suas definições de ferramentas para habilitar a validação de esquema.
</Tip>

### Saída JSON

As ferramentas não precisam necessariamente ser funções do cliente — você pode usar ferramentas sempre que quiser que o modelo retorne uma saída JSON que siga um esquema fornecido. Por exemplo, você pode usar uma ferramenta `record_summary` com um esquema particular. Veja [Uso de ferramentas com Claude](/docs/pt-BR/agents-and-tools/tool-use/overview) para um exemplo completo de funcionamento.

### Respostas do modelo com ferramentas

Ao usar ferramentas, Claude frequentemente comentará sobre o que está fazendo ou responderá naturalmente ao usuário antes de invocar ferramentas.

Por exemplo, dado o prompt "Qual é o tempo em San Francisco agora, e que horas são lá?", Claude pode responder com:

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll help you check the current weather and time in San Francisco."
    },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA"}
    }
  ]
}
```

Este estilo de resposta natural ajuda os usuários a entender o que Claude está fazendo e cria uma interação mais conversacional. Você pode orientar o estilo e o conteúdo dessas respostas através de seus prompts de sistema e fornecendo `<examples>` em seus prompts.

É importante notar que Claude pode usar várias frases e abordagens ao explicar suas ações. Seu código deve tratar essas respostas como qualquer outro texto gerado pelo assistente, e não depender de convenções de formatação específicas.

### Uso paralelo de ferramentas

Por padrão, Claude pode usar múltiplas ferramentas para responder a uma consulta do usuário. Você pode desabilitar esse comportamento por:

- Configurando `disable_parallel_tool_use=true` quando o tipo de tool_choice é `auto`, o que garante que Claude use **no máximo uma** ferramenta
- Configurando `disable_parallel_tool_use=true` quando o tipo de tool_choice é `any` ou `tool`, o que garante que Claude use **exatamente uma** ferramenta

<section title="Exemplo completo de uso paralelo de ferramentas">

<Note>
**Mais simples com Tool runner**: O exemplo abaixo mostra manipulação manual de ferramentas paralelas. Para a maioria dos casos de uso, [tool runner](#tool-runner-beta) manipula automaticamente a execução paralela de ferramentas com muito menos código.
</Note>

Aqui está um exemplo completo mostrando como formatar corretamente chamadas de ferramentas paralelas no histórico de mensagens:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Define tools
tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_time",
        "description": "Get the current time in a given timezone",
        "input_schema": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string",
                    "description": "The timezone, e.g. America/New_York"
                }
            },
            "required": ["timezone"]
        }
    }
]

# Initial request
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    messages=[
        {
            "role": "user",
            "content": "What's the weather in SF and NYC, and what time is it there?"
        }
    ]
)

# Claude's response with parallel tool calls
print("Claude wants to use tools:", response.stop_reason == "tool_use")
print("Number of tool calls:", len([c for c in response.content if c.type == "tool_use"]))

# Build the conversation with tool results
messages = [
    {
        "role": "user",
        "content": "What's the weather in SF and NYC, and what time is it there?"
    },
    {
        "role": "assistant",
        "content": response.content  # Contains multiple tool_use blocks
    },
    {
        "role": "user",
        "content": [
            {
                "type": "tool_result",
                "tool_use_id": "toolu_01",  # Must match the ID from tool_use
                "content": "San Francisco: 68°F, partly cloudy"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_02",
                "content": "New York: 45°F, clear skies"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_03",
                "content": "San Francisco time: 2:30 PM PST"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_04",
                "content": "New York time: 5:30 PM EST"
            }
        ]
    }
]

# Get final response
final_response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    messages=messages
)

print(final_response.content[0].text)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Define tools
const tools = [
  {
    name: "get_weather",
    description: "Get the current weather in a given location",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA"
        }
      },
      required: ["location"]
    }
  },
  {
    name: "get_time",
    description: "Get the current time in a given timezone",
    input_schema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "The timezone, e.g. America/New_York"
        }
      },
      required: ["timezone"]
    }
  }
];

// Initial request
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: tools,
  messages: [
    {
      role: "user",
      content: "What's the weather in SF and NYC, and what time is it there?"
    }
  ]
});

// Build conversation with tool results
const messages = [
  {
    role: "user",
    content: "What's the weather in SF and NYC, and what time is it there?"
  },
  {
    role: "assistant",
    content: response.content  // Contains multiple tool_use blocks
  },
  {
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: "toolu_01",  // Must match the ID from tool_use
        content: "San Francisco: 68°F, partly cloudy"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_02",
        content: "New York: 45°F, clear skies"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_03",
        content: "San Francisco time: 2:30 PM PST"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_04",
        content: "New York time: 5:30 PM EST"
      }
    ]
  }
];

// Get final response
const finalResponse = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: tools,
  messages: messages
});

console.log(finalResponse.content[0].text);
```
</CodeGroup>

A mensagem do assistente com chamadas de ferramentas paralelas seria assim:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll check the weather and time for both San Francisco and New York City."
    },
    {
      "type": "tool_use",
      "id": "toolu_01",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA"}
    },
    {
      "type": "tool_use",
      "id": "toolu_02",
      "name": "get_weather",
      "input": {"location": "New York, NY"}
    },
    {
      "type": "tool_use",
      "id": "toolu_03",
      "name": "get_time",
      "input": {"timezone": "America/Los_Angeles"}
    },
    {
      "type": "tool_use",
      "id": "toolu_04",
      "name": "get_time",
      "input": {"timezone": "America/New_York"}
    }
  ]
}
```

</section>
<section title="Script de teste completo para ferramentas paralelas">

Aqui está um script completo e executável para testar e verificar se as chamadas de ferramentas paralelas estão funcionando corretamente:

<CodeGroup>
```python Python
#!/usr/bin/env python3
"""Test script to verify parallel tool calls with the Claude API"""

import os
from anthropic import Anthropic

# Initialize client
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# Define tools
tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_time",
        "description": "Get the current time in a given timezone",
        "input_schema": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string",
                    "description": "The timezone, e.g. America/New_York"
                }
            },
            "required": ["timezone"]
        }
    }
]

# Test conversation with parallel tool calls
messages = [
    {
        "role": "user",
        "content": "What's the weather in SF and NYC, and what time is it there?"
    }
]

# Make initial request
print("Requesting parallel tool calls...")
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=tools
)

# Check for parallel tool calls
tool_uses = [block for block in response.content if block.type == "tool_use"]
print(f"\n✓ Claude made {len(tool_uses)} tool calls")

if len(tool_uses) > 1:
    print("✓ Parallel tool calls detected!")
    for tool in tool_uses:
        print(f"  - {tool.name}: {tool.input}")
else:
    print("✗ No parallel tool calls detected")

# Simulate tool execution and format results correctly
tool_results = []
for tool_use in tool_uses:
    if tool_use.name == "get_weather":
        if "San Francisco" in str(tool_use.input):
            result = "San Francisco: 68°F, partly cloudy"
        else:
            result = "New York: 45°F, clear skies"
    else:  # get_time
        if "Los_Angeles" in str(tool_use.input):
            result = "2:30 PM PST"
        else:
            result = "5:30 PM EST"

    tool_results.append({
        "type": "tool_result",
        "tool_use_id": tool_use.id,
        "content": result
    })

# Continue conversation with tool results
messages.extend([
    {"role": "assistant", "content": response.content},
    {"role": "user", "content": tool_results}  # All results in one message!
])

# Get final response
print("\nGetting final response...")
final_response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=tools
)

print(f"\nClaude's response:\n{final_response.content[0].text}")

# Verify formatting
print("\n--- Verification ---")
print(f"✓ Tool results sent in single user message: {len(tool_results)} results")
print("✓ No text before tool results in content array")
print("✓ Conversation formatted correctly for future parallel tool use")
```

```typescript TypeScript
#!/usr/bin/env node
// Test script to verify parallel tool calls with the Claude API

import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Define tools
const tools = [
  {
    name: "get_weather",
    description: "Get the current weather in a given location",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA"
        }
      },
      required: ["location"]
    }
  },
  {
    name: "get_time",
    description: "Get the current time in a given timezone",
    input_schema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "The timezone, e.g. America/New_York"
        }
      },
      required: ["timezone"]
    }
  }
];

async function testParallelTools() {
  // Make initial request
  console.log("Requesting parallel tool calls...");
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: "What's the weather in SF and NYC, and what time is it there?"
    }],
    tools: tools
  });

  // Check for parallel tool calls
  const toolUses = response.content.filter(block => block.type === "tool_use");
  console.log(`\n✓ Claude made ${toolUses.length} tool calls`);

  if (toolUses.length > 1) {
    console.log("✓ Parallel tool calls detected!");
    toolUses.forEach(tool => {
      console.log(`  - ${tool.name}: ${JSON.stringify(tool.input)}`);
    });
  } else {
    console.log("✗ No parallel tool calls detected");
  }

  // Simulate tool execution and format results correctly
  const toolResults = toolUses.map(toolUse => {
    let result;
    if (toolUse.name === "get_weather") {
      result = toolUse.input.location.includes("San Francisco")
        ? "San Francisco: 68°F, partly cloudy"
        : "New York: 45°F, clear skies";
    } else {
      result = toolUse.input.timezone.includes("Los_Angeles")
        ? "2:30 PM PST"
        : "5:30 PM EST";
    }

    return {
      type: "tool_result",
      tool_use_id: toolUse.id,
      content: result
    };
  });

  // Get final response with correct formatting
  console.log("\nGetting final response...");
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      { role: "user", content: "What's the weather in SF and NYC, and what time is it there?" },
      { role: "assistant", content: response.content },
      { role: "user", content: toolResults }  // All results in one message!
    ],
    tools: tools
  });

  console.log(`\nClaude's response:\n${finalResponse.content[0].text}`);

  // Verify formatting
  console.log("\n--- Verification ---");
  console.log(`✓ Tool results sent in single user message: ${toolResults.length} results`);
  console.log("✓ No text before tool results in content array");
  console.log("✓ Conversation formatted correctly for future parallel tool use");
}

testParallelTools().catch(console.error);
```
</CodeGroup>

Este script demonstra:
- Como formatar corretamente chamadas de ferramentas paralelas e resultados
- Como verificar que chamadas paralelas estão sendo feitas
- A estrutura de mensagem correta que incentiva o uso futuro de ferramentas paralelas
- Erros comuns a evitar (como texto antes dos resultados das ferramentas)

Execute este script para testar sua implementação e garantir que Claude está fazendo chamadas de ferramentas paralelas de forma eficaz.

</section>

#### Maximizando o uso paralelo de ferramentas

Embora os modelos Claude 4 tenham excelentes capacidades de uso paralelo de ferramentas por padrão, você pode aumentar a probabilidade de execução paralela de ferramentas em todos os modelos com prompting direcionado:

<section title="Prompts de sistema para uso paralelo de ferramentas">

Para modelos Claude 4 (Opus 4 e Sonnet 4), adicione isto ao seu prompt de sistema:
```text
For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
```

Para uso ainda mais forte de ferramentas paralelas (recomendado se o padrão não for suficiente), use:
```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially. Prioritize calling tools in parallel whenever possible. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. When running multiple read-only commands like `ls` or `list_dir`, always run all of the commands in parallel. Err on the side of maximizing parallel tool calls rather than running too many tools sequentially.
</use_parallel_tool_calls>
```

</section>
<section title="Prompting de mensagem do usuário">

Você também pode incentivar o uso paralelo de ferramentas em mensagens de usuário específicas:

```python
# Instead of:
"What's the weather in Paris? Also check London."

# Use:
"Check the weather in Paris and London simultaneously."

# Or be explicit:
"Please use parallel tool calls to get the weather for Paris, London, and Tokyo at the same time."
```

</section>

<Warning>
**Uso paralelo de ferramentas com Claude Sonnet 3.7**

Claude Sonnet 3.7 pode ser menos provável de fazer chamadas de ferramentas paralelas em uma resposta, mesmo quando você não tiver definido `disable_parallel_tool_use`. Recomendamos [atualizar para modelos Claude 4](/docs/pt-BR/about-claude/models/migrating-to-claude-4), que têm uso de ferramentas eficiente em tokens e chamadas de ferramentas paralelas melhoradas.

Se você ainda estiver usando Claude Sonnet 3.7, você pode habilitar o [cabeçalho beta](/docs/pt-BR/api/beta-headers) `token-efficient-tools-2025-02-19`, que ajuda a incentivar Claude a usar ferramentas paralelas. Você também pode introduzir uma "ferramenta em lote" que pode atuar como uma meta-ferramenta para envolver invocações para outras ferramentas simultaneamente.

Veja [este exemplo](https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/parallel_tools_claude_3_7_sonnet.ipynb) em nosso cookbook para como usar essa solução alternativa.

</Warning>

## Manipulando blocos de conteúdo de uso de ferramentas e resultado de ferramentas

<Note>
**Mais simples com Tool runner**: A manipulação manual de ferramentas descrita nesta seção é gerenciada automaticamente por [tool runner](#tool-runner-beta). Use esta seção quando você precisar de controle personalizado sobre a execução de ferramentas.
</Note>

A resposta do Claude difere dependendo se ele usa uma ferramenta de cliente ou servidor.

### Manipulando resultados de ferramentas de cliente

A resposta terá um `stop_reason` de `tool_use` e um ou mais blocos de conteúdo `tool_use` que incluem:

- `id`: Um identificador único para este bloco de uso de ferramenta particular. Isso será usado para corresponder aos resultados da ferramenta mais tarde.
- `name`: O nome da ferramenta sendo usada.
- `input`: Um objeto contendo a entrada sendo passada para a ferramenta, em conformidade com o `input_schema` da ferramenta.

<section title="Exemplo de resposta da API com um bloco de conteúdo `tool_use`">

```json JSON
{
  "id": "msg_01Aq9w938a90dw8q",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll check the current weather in San Francisco for you."
    },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA", "unit": "celsius"}
    }
  ]
}
```

</section>

Quando você recebe uma resposta de uso de ferramenta para uma ferramenta de cliente, você deve:

1. Extrair o `name`, `id` e `input` do bloco `tool_use`.
2. Executar a ferramenta real em sua base de código correspondente a esse nome de ferramenta, passando a `input` da ferramenta.
3. Continuar a conversa enviando uma nova mensagem com o `role` de `user` e um bloco `content` contendo o tipo `tool_result` e as seguintes informações:
   - `tool_use_id`: O `id` da solicitação de uso de ferramenta para a qual este é um resultado.
   - `content`: O resultado da ferramenta, como uma string (por exemplo, `"content": "15 degrees"`), uma lista de blocos de conteúdo aninhados (por exemplo, `"content": [{"type": "text", "text": "15 degrees"}]`), ou uma lista de blocos de documento (por exemplo, `"content": ["type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "15 degrees"}]`). Esses blocos de conteúdo podem usar os tipos `text`, `image` ou `document`.
   - `is_error` (opcional): Defina como `true` se a execução da ferramenta resultou em um erro.

<Note>
**Requisitos importantes de formatação**:
- Os blocos de resultado da ferramenta devem vir imediatamente após seus blocos de uso de ferramenta correspondentes no histórico de mensagens. Você não pode incluir nenhuma mensagem entre a mensagem de uso de ferramenta do assistente e a mensagem de resultado de ferramenta do usuário.
- Na mensagem do usuário contendo resultados de ferramentas, os blocos tool_result devem vir PRIMEIRO na matriz de conteúdo. Qualquer texto deve vir DEPOIS de todos os resultados das ferramentas.

Por exemplo, isto causará um erro 400:
```json
{"role": "user", "content": [
  {"type": "text", "text": "Here are the results:"},  // ❌ Text before tool_result
  {"type": "tool_result", "tool_use_id": "toolu_01", ...}
]}
```

Isto está correto:
```json
{"role": "user", "content": [
  {"type": "tool_result", "tool_use_id": "toolu_01", ...},
  {"type": "text", "text": "What should I do next?"}  // ✅ Text after tool_result
]}
```

Se você receber um erro como "tool_use ids were found without tool_result blocks immediately after", verifique se seus resultados de ferramentas estão formatados corretamente.
</Note>

<section title="Exemplo de resultado de ferramenta bem-sucedido">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "15 degrees"
    }
  ]
}
```

</section>

<section title="Exemplo de resultado de ferramenta com imagens">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": [
        {"type": "text", "text": "15 degrees"},
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": "/9j/4AAQSkZJRg...",
          }
        }
      ]
    }
  ]
}
```

</section>
<section title="Exemplo de resultado de ferramenta vazio">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
    }
  ]
}
```

</section>

<section title="Exemplo de resultado de ferramenta com documentos">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": [
        {"type": "text", "text": "The weather is"},
        {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "15 degrees"
          }
        }
      ]
    }
  ]
}
```

</section>

Após receber o resultado da ferramenta, Claude usará essas informações para continuar gerando uma resposta ao prompt original do usuário.

### Manipulando resultados de ferramentas de servidor

Claude executa a ferramenta internamente e incorpora os resultados diretamente em sua resposta sem exigir interação adicional do usuário.

<Tip>
  **Diferenças de outras APIs**

Ao contrário de APIs que separam o uso de ferramentas ou usam funções especiais como `tool` ou `function`, a API Claude integra ferramentas diretamente na estrutura de mensagem `user` e `assistant`.

As mensagens contêm matrizes de blocos `text`, `image`, `tool_use` e `tool_result`. As mensagens `user` incluem conteúdo de cliente e `tool_result`, enquanto as mensagens `assistant` contêm conteúdo gerado por IA e `tool_use`.

</Tip>

### Manipulando o motivo de parada `max_tokens`

Se a [resposta do Claude for cortada devido ao limite `max_tokens`](/docs/pt-BR/build-with-claude/handling-stop-reasons#max-tokens), e a resposta truncada contiver um bloco de uso de ferramenta incompleto, você precisará tentar novamente a solicitação com um valor `max_tokens` mais alto para obter o uso de ferramenta completo.

<CodeGroup>
```python Python
# Check if response was truncated during tool use
if response.stop_reason == "max_tokens":
    # Check if the last content block is an incomplete tool_use
    last_block = response.content[-1]
    if last_block.type == "tool_use":
        # Send the request with higher max_tokens
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=4096,  # Increased limit
            messages=messages,
            tools=tools
        )
```

```typescript TypeScript
// Check if response was truncated during tool use
if (response.stop_reason === "max_tokens") {
  // Check if the last content block is an incomplete tool_use
  const lastBlock = response.content[response.content.length - 1];
  if (lastBlock.type === "tool_use") {
    // Send the request with higher max_tokens
    response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096, // Increased limit
      messages: messages,
      tools: tools
    });
  }
}
```
</CodeGroup>

#### Manipulando o motivo de parada `pause_turn`

Ao usar ferramentas de servidor como busca na web, a API pode retornar um motivo de parada `pause_turn`, indicando que a API pausou uma volta longa.

Aqui está como manipular o motivo de parada `pause_turn`:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Initial request with web search
response = client.messages.create(
    model="claude-3-7-sonnet-latest",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Search for comprehensive information about quantum computing breakthroughs in 2025"
        }
    ],
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 10
    }]
)

# Check if the response has pause_turn stop reason
if response.stop_reason == "pause_turn":
    # Continue the conversation with the paused content
    messages = [
        {"role": "user", "content": "Search for comprehensive information about quantum computing breakthroughs in 2025"},
        {"role": "assistant", "content": response.content}
    ]

    # Send the continuation request
    continuation = client.messages.create(
        model="claude-3-7-sonnet-latest",
        max_tokens=1024,
        messages=messages,
        tools=[{
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 10
        }]
    )

    print(continuation)
else:
    print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Initial request with web search
const response = await anthropic.messages.create({
  model: "claude-3-7-sonnet-latest",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "Search for comprehensive information about quantum computing breakthroughs in 2025"
    }
  ],
  tools: [{
    type: "web_search_20250305",
    name: "web_search",
    max_uses: 10
  }]
});

// Check if the response has pause_turn stop reason
if (response.stop_reason === "pause_turn") {
  // Continue the conversation with the paused content
  const messages = [
    { role: "user", content: "Search for comprehensive information about quantum computing breakthroughs in 2025" },
    { role: "assistant", content: response.content }
  ];

  // Send the continuation request
  const continuation = await anthropic.messages.create({
    model: "claude-3-7-sonnet-latest",
    max_tokens: 1024,
    messages: messages,
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 10
    }]
  });

  console.log(continuation);
} else {
  console.log(response);
}
```
</CodeGroup>

Ao manipular `pause_turn`:
- **Continuar a conversa**: Passe a resposta pausada como está em uma solicitação subsequente para permitir que Claude continue sua volta
- **Modificar se necessário**: Você pode opcionalmente modificar o conteúdo antes de continuar se quiser interromper ou redirecionar a conversa
- **Preservar estado da ferramenta**: Inclua as mesmas ferramentas na solicitação de continuação para manter a funcionalidade

## Resolvendo problemas de erros

<Note>
**Manipulação de erros integrada**: [Tool runner](#tool-runner-beta) fornece manipulação automática de erros para a maioria dos cenários comuns. Esta seção cobre manipulação manual de erros para casos de uso avançados.
</Note>

Existem alguns tipos diferentes de erros que podem ocorrer ao usar ferramentas com Claude:

<section title="Erro de execução de ferramenta">

Se a ferramenta em si lançar um erro durante a execução (por exemplo, um erro de rede ao buscar dados de tempo), você pode retornar a mensagem de erro no `content` junto com `"is_error": true`:

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "ConnectionError: the weather service API is not available (HTTP 500)",
      "is_error": true
    }
  ]
}
```

Claude então incorporará esse erro em sua resposta ao usuário, por exemplo, "Desculpe, não consegui recuperar o tempo atual porque o serviço de API de tempo não está disponível. Por favor, tente novamente mais tarde."

</section>
<section title="Nome de ferramenta inválido">

Se a tentativa de Claude de usar uma ferramenta for inválida (por exemplo, parâmetros obrigatórios ausentes), geralmente significa que não havia informações suficientes para Claude usar a ferramenta corretamente. Sua melhor aposta durante o desenvolvimento é tentar a solicitação novamente com valores `description` mais detalhados em suas definições de ferramentas.

No entanto, você também pode continuar a conversa para frente com um `tool_result` que indica o erro, e Claude tentará usar a ferramenta novamente com as informações ausentes preenchidas:

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Missing required 'location' parameter",
      "is_error": true
    }
  ]
}
```

Se uma solicitação de ferramenta for inválida ou estiver faltando parâmetros, Claude tentará novamente 2-3 vezes com correções antes de se desculpar com o usuário.

<Tip>
Para eliminar completamente chamadas de ferramentas inválidas, use [uso de ferramentas rigoroso](/docs/pt-BR/build-with-claude/structured-outputs) com `strict: true` em suas definições de ferramentas. Isso garante que as entradas de ferramentas sempre corresponderão ao seu esquema exatamente, evitando parâmetros ausentes e incompatibilidades de tipo.
</Tip>

</section>
<section title="Tags \<search_quality_reflection>">

Para evitar que Claude reflita sobre a qualidade dos resultados de busca com tags \<search_quality_reflection>, adicione "Do not reflect on the quality of the returned search results in your response" ao seu prompt.

</section>
<section title="Erros de ferramentas de servidor">

Quando ferramentas de servidor encontram erros (por exemplo, problemas de rede com Web Search), Claude manipulará esses erros de forma transparente e tentará fornecer uma resposta alternativa ou explicação ao usuário. Ao contrário das ferramentas de cliente, você não precisa manipular resultados `is_error` para ferramentas de servidor.

Para busca na web especificamente, os códigos de erro possíveis incluem:
- `too_many_requests`: Limite de taxa excedido
- `invalid_input`: Parâmetro de consulta de busca inválido
- `max_uses_exceeded`: Máximo de usos da ferramenta de busca na web excedido
- `query_too_long`: Consulta excede o comprimento máximo
- `unavailable`: Um erro interno ocorreu

</section>
<section title="Chamadas de ferramentas paralelas não funcionando">

Se Claude não estiver fazendo chamadas de ferramentas paralelas quando esperado, verifique esses problemas comuns:

**1. Formatação incorreta de resultado de ferramenta**

O problema mais comum é formatar incorretamente os resultados das ferramentas no histórico de conversa. Isso "ensina" Claude a evitar chamadas paralelas.

Especificamente para uso paralelo de ferramentas:
- ❌ **Errado**: Enviar mensagens de usuário separadas para cada resultado de ferramenta
- ✅ **Correto**: Todos os resultados de ferramentas devem estar em uma única mensagem de usuário

```json
// ❌ This reduces parallel tool use
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1]},
  {"role": "user", "content": [tool_result_2]}  // Separate message
]

// ✅ This maintains parallel tool use
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1, tool_result_2]}  // Single message
]
```

Veja os [requisitos gerais de formatação acima](#handling-tool-use-and-tool-result-content-blocks) para outras regras de formatação.

**2. Prompting fraco**

O prompting padrão pode não ser suficiente. Use linguagem mais forte:

```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations,
invoke all relevant tools simultaneously rather than sequentially.
Prioritize calling tools in parallel whenever possible.
</use_parallel_tool_calls>
```

**3. Medindo uso de ferramentas paralelas**

Para verificar se as chamadas de ferramentas paralelas estão funcionando:

```python
# Calculate average tools per tool-calling message
tool_call_messages = [msg for msg in messages if any(
    block.type == "tool_use" for block in msg.content
)]
total_tool_calls = sum(
    len([b for b in msg.content if b.type == "tool_use"])
    for msg in tool_call_messages
)
avg_tools_per_message = total_tool_calls / len(tool_call_messages)
print(f"Average tools per message: {avg_tools_per_message}")
# Should be > 1.0 if parallel calls are working
```

**4. Comportamento específico do modelo**

- Claude Opus 4.5, Opus 4.1 e Sonnet 4: Excelentes em uso paralelo de ferramentas com prompting mínimo
- Claude Sonnet 3.7: Pode precisar de prompting mais forte ou do [cabeçalho beta](/docs/pt-BR/api/beta-headers) `token-efficient-tools-2025-02-19`. Considere [atualizar para Claude 4](/docs/pt-BR/about-claude/models/migrating-to-claude-4).
- Claude Haiku: Menos provável de usar ferramentas paralelas sem prompting explícito

</section>