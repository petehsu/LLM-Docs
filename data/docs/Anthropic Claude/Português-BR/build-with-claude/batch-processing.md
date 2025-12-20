# Processamento em lote

Processamento em lote é uma abordagem poderosa para lidar com grandes volumes de solicitações de forma eficiente.

---

Processamento em lote é uma abordagem poderosa para lidar com grandes volumes de solicitações de forma eficiente. Em vez de processar solicitações uma de cada vez com respostas imediatas, o processamento em lote permite que você envie múltiplas solicitações juntas para processamento assíncrono. Este padrão é particularmente útil quando:

- Você precisa processar grandes volumes de dados
- Respostas imediatas não são necessárias
- Você quer otimizar para eficiência de custo
- Você está executando avaliações ou análises em larga escala

A API de Lotes de Mensagens é nossa primeira implementação deste padrão.

---

# API de Lotes de Mensagens

A API de Lotes de Mensagens é uma forma poderosa e econômica de processar de forma assíncrona grandes volumes de solicitações de [Mensagens](/docs/pt-BR/api/messages). Esta abordagem é bem adequada para tarefas que não requerem respostas imediatas, com a maioria dos lotes sendo concluídos em menos de 1 hora, enquanto reduz custos em 50% e aumenta a taxa de transferência.

Você pode [explorar a referência da API diretamente](/docs/pt-BR/api/creating-message-batches), além deste guia.

## Como funciona a API de Lotes de Mensagens

Quando você envia uma solicitação para a API de Lotes de Mensagens:

1. O sistema cria um novo Lote de Mensagens com as solicitações de Mensagens fornecidas.
2. O lote é então processado de forma assíncrona, com cada solicitação sendo tratada independentemente.
3. Você pode consultar o status do lote e recuperar resultados quando o processamento tiver terminado para todas as solicitações.

Isto é especialmente útil para operações em massa que não requerem resultados imediatos, como:
- Avaliações em larga escala: Processe milhares de casos de teste de forma eficiente.
- Moderação de conteúdo: Analise grandes volumes de conteúdo gerado pelo usuário de forma assíncrona.
- Análise de dados: Gere insights ou resumos para grandes conjuntos de dados.
- Geração de conteúdo em massa: Crie grandes quantidades de texto para vários fins (por exemplo, descrições de produtos, resumos de artigos).

### Limitações de lote
- Um Lote de Mensagens é limitado a 100.000 solicitações de Mensagens ou 256 MB de tamanho, o que for atingido primeiro.
- Processamos cada lote o mais rápido possível, com a maioria dos lotes sendo concluídos em 1 hora. Você poderá acessar os resultados do lote quando todas as mensagens tiverem sido concluídas ou após 24 horas, o que vier primeiro. Os lotes expirarão se o processamento não for concluído em 24 horas.
- Os resultados do lote estão disponíveis por 29 dias após a criação. Depois disso, você ainda poderá visualizar o Lote, mas seus resultados não estarão mais disponíveis para download.
- Os lotes estão no escopo de um [Workspace](/settings/workspaces). Você pode visualizar todos os lotes—e seus resultados—que foram criados no Workspace ao qual sua chave de API pertence.
- Os limites de taxa se aplicam tanto às solicitações HTTP da API de Lotes quanto ao número de solicitações dentro de um lote aguardando processamento. Veja [Limites de taxa da API de Lotes de Mensagens](/docs/pt-BR/api/rate-limits#message-batches-api). Além disso, podemos desacelerar o processamento com base na demanda atual e no volume de suas solicitações. Nesse caso, você pode ver mais solicitações expirando após 24 horas.
- Devido à alta taxa de transferência e processamento simultâneo, os lotes podem ultrapassar ligeiramente o [limite de gastos](/settings/limits) configurado do seu Workspace.

### Modelos suportados

Todos os [modelos ativos](/docs/pt-BR/about-claude/models/overview) suportam a API de Lotes de Mensagens.

### O que pode ser processado em lote
Qualquer solicitação que você possa fazer para a API de Mensagens pode ser incluída em um lote. Isto inclui:

- Visão
- Uso de ferramentas
- Mensagens do sistema
- Conversas multi-turno
- Qualquer recurso beta

Como cada solicitação no lote é processada independentemente, você pode misturar diferentes tipos de solicitações dentro de um único lote.

<Tip>
Como os lotes podem levar mais de 5 minutos para processar, considere usar a [duração de cache de 1 hora](/docs/pt-BR/build-with-claude/prompt-caching#1-hour-cache-duration) com cache de prompt para melhores taxas de acerto de cache ao processar lotes com contexto compartilhado.
</Tip>

---
## Preços

A API de Lotes oferece economias significativas de custos. Todo o uso é cobrado a 50% dos preços padrão da API.

| Model             | Batch input      | Batch output    |
|-------------------|------------------|-----------------|
| Claude Opus 4.5     | $2.50 / MTok     | $12.50 / MTok   |
| Claude Opus 4.1     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Opus 4     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Sonnet 4.5   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 4   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok     | $7.50 / MTok    |
| Claude Haiku 4.5  | $0.50 / MTok     | $2.50 / MTok    |
| Claude Haiku 3.5  | $0.40 / MTok     | $2 / MTok       |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))  | $7.50 / MTok     | $37.50 / MTok   |
| Claude Haiku 3    | $0.125 / MTok    | $0.625 / MTok   |

---
## Como usar a API de Lotes de Mensagens

### Prepare e crie seu lote

Um Lote de Mensagens é composto por uma lista de solicitações para criar uma Mensagem. A forma de uma solicitação individual é composta por:
- Um `custom_id` único para identificar a solicitação de Mensagens
- Um objeto `params` com os parâmetros padrão da [API de Mensagens](/docs/pt-BR/api/messages)

Você pode [criar um lote](/docs/pt-BR/api/creating-message-batches) passando esta lista para o parâmetro `requests`:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages/batches \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "requests": [
        {
            "custom_id": "my-first-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content": "Hello, world"}
                ]
            }
        },
        {
            "custom_id": "my-second-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content": "Hi again, friend"}
                ]
            }
        }
    ]
}'
```

```python Python
import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

message_batch = client.messages.batches.create(
    requests=[
        Request(
            custom_id="my-first-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                messages=[{
                    "role": "user",
                    "content": "Hello, world",
                }]
            )
        ),
        Request(
            custom_id="my-second-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                messages=[{
                    "role": "user",
                    "content": "Hi again, friend",
                }]
            )
        )
    ]
)

print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.create({
  requests: [{
    custom_id: "my-first-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {"role": "user", "content": "Hello, world"}
      ]
    }
  }, {
    custom_id: "my-second-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {"role": "user", "content": "Hi again, friend"}
      ]
    }
  }]
});

console.log(messageBatch)
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.batches.*;

public class BatchExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BatchCreateParams params = BatchCreateParams.builder()
            .addRequest(BatchCreateParams.Request.builder()
                .customId("my-first-request")
                .params(BatchCreateParams.Request.Params.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addUserMessage("Hello, world")
                    .build())
                .build())
            .addRequest(BatchCreateParams.Request.builder()
                .customId("my-second-request")
                .params(BatchCreateParams.Request.Params.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addUserMessage("Hi again, friend")
                    .build())
                .build())
            .build();

        MessageBatch messageBatch = client.messages().batches().create(params);

        System.out.println(messageBatch);
    }
}
```

</CodeGroup>

Neste exemplo, duas solicitações separadas são processadas em lote juntas para processamento assíncrono. Cada solicitação tem um `custom_id` único e contém os parâmetros padrão que você usaria para uma chamada da API de Mensagens.

<Tip>
  **Teste suas solicitações de lote com a API de Mensagens**

A validação do objeto `params` para cada solicitação de mensagem é realizada de forma assíncrona, e os erros de validação são retornados quando o processamento de todo o lote termina. Você pode garantir que está construindo sua entrada corretamente verificando a forma de sua solicitação com a [API de Mensagens](/docs/pt-BR/api/messages) primeiro.
</Tip>

Quando um lote é criado pela primeira vez, a resposta terá um status de processamento de `in_progress`.

```json JSON
{
  "id": "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
  "type": "message_batch",
  "processing_status": "in_progress",
  "request_counts": {
    "processing": 2,
    "succeeded": 0,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "ended_at": null,
  "created_at": "2024-09-24T18:37:24.100435Z",
  "expires_at": "2024-09-25T18:37:24.100435Z",
  "cancel_initiated_at": null,
  "results_url": null
}
```

### Rastreando seu lote

O campo `processing_status` do Lote de Mensagens indica o estágio em que o processamento do lote se encontra. Começa como `in_progress`, depois é atualizado para `ended` uma vez que todas as solicitações no lote terminaram o processamento e os resultados estão prontos. Você pode monitorar o estado do seu lote visitando o [Console](/settings/workspaces/default/batches), ou usando o [endpoint de recuperação](/docs/pt-BR/api/retrieving-message-batches).

#### Consultando a conclusão do Lote de Mensagens

Para consultar um Lote de Mensagens, você precisará de seu `id`, que é fornecido na resposta ao criar um lote ou listando lotes. Você pode implementar um loop de consulta que verifica o status do lote periodicamente até que o processamento tenha terminado:

<CodeGroup>
```python Python
import anthropic
import time

client = anthropic.Anthropic()

message_batch = None
while True:
    message_batch = client.messages.batches.retrieve(
        MESSAGE_BATCH_ID
    )
    if message_batch.processing_status == "ended":
        break

    print(f"Batch {MESSAGE_BATCH_ID} is still processing...")
    time.sleep(60)
print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

let messageBatch;
while (true) {
  messageBatch = await anthropic.messages.batches.retrieve(
    MESSAGE_BATCH_ID
  );
  if (messageBatch.processing_status === 'ended') {
    break;
  }

  console.log(`Batch ${messageBatch} is still processing... waiting`);
  await new Promise(resolve => setTimeout(resolve, 60_000));
}
console.log(messageBatch);
```

```bash Shell
#!/bin/sh

until [[ $(curl -s "https://api.anthropic.com/v1/messages/batches/$MESSAGE_BATCH_ID" \
          --header "x-api-key: $ANTHROPIC_API_KEY" \
          --header "anthropic-version: 2023-06-01" \
          | grep -o '"processing_status":[[:space:]]*"[^"]*"' \
          | cut -d'"' -f4) == "ended" ]]; do
    echo "Batch $MESSAGE_BATCH_ID is still processing..."
    sleep 60
done

echo "Batch $MESSAGE_BATCH_ID has finished processing"
```
</CodeGroup>

### Listando todos os Lotes de Mensagens

Você pode listar todos os Lotes de Mensagens em seu Workspace usando o [endpoint de listagem](/docs/pt-BR/api/listing-message-batches). A API suporta paginação, buscando automaticamente páginas adicionais conforme necessário:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Automatically fetches more pages as needed.
for message_batch in client.messages.batches.list(
    limit=20
):
    print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Automatically fetches more pages as needed.
for await (const messageBatch of anthropic.messages.batches.list({
  limit: 20
})) {
  console.log(messageBatch);
}
```

```bash Shell
#!/bin/sh

if ! command -v jq &> /dev/null; then
    echo "Error: This script requires jq. Please install it first."
    exit 1
fi

BASE_URL="https://api.anthropic.com/v1/messages/batches"

has_more=true
after_id=""

while [ "$has_more" = true ]; do
    # Construct URL with after_id if it exists
    if [ -n "$after_id" ]; then
        url="${BASE_URL}?limit=20&after_id=${after_id}"
    else
        url="$BASE_URL?limit=20"
    fi

    response=$(curl -s "$url" \
              --header "x-api-key: $ANTHROPIC_API_KEY" \
              --header "anthropic-version: 2023-06-01")

    # Extract values using jq
    has_more=$(echo "$response" | jq -r '.has_more')
    after_id=$(echo "$response" | jq -r '.last_id')

    # Process and print each entry in the data array
    echo "$response" | jq -c '.data[]' | while read -r entry; do
        echo "$entry" | jq '.'
    done
done
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.batches.*;

public class BatchListExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Automatically fetches more pages as needed
        for (MessageBatch messageBatch : client.messages().batches().list(
                BatchListParams.builder()
                        .limit(20)
                        .build()
        )) {
            System.out.println(messageBatch);
        }
    }
}
```
</CodeGroup>

### Recuperando resultados do lote

Uma vez que o processamento do lote termina, cada solicitação de Mensagens no lote terá um resultado. Existem 4 tipos de resultado:

| Tipo de Resultado | Descrição |
|-------------|-------------|
| `succeeded` | A solicitação foi bem-sucedida. Inclui o resultado da mensagem. |
| `errored`   | A solicitação encontrou um erro e uma mensagem não foi criada. Os erros possíveis incluem solicitações inválidas e erros internos do servidor. Você não será cobrado por essas solicitações. |
| `canceled`  | O usuário cancelou o lote antes que essa solicitação pudesse ser enviada ao modelo. Você não será cobrado por essas solicitações. |
| `expired`   | O lote atingiu sua expiração de 24 horas antes que essa solicitação pudesse ser enviada ao modelo. Você não será cobrado por essas solicitações. |

Você verá uma visão geral de seus resultados com o `request_counts` do lote, que mostra quantas solicitações atingiram cada um desses quatro estados.

Os resultados do lote estão disponíveis para download na propriedade `results_url` no Lote de Mensagens, e se a permissão da organização permitir, no Console. Devido ao tamanho potencialmente grande dos resultados, é recomendado [transmitir resultados](/docs/pt-BR/api/retrieving-message-batch-results) em vez de baixá-los todos de uma vez.

<CodeGroup>

```bash Shell
#!/bin/sh
curl "https://api.anthropic.com/v1/messages/batches/msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  | grep -o '"results_url":[[:space:]]*"[^"]*"' \
  | cut -d'"' -f4 \
  | while read -r url; do
    curl -s "$url" \
      --header "anthropic-version: 2023-06-01" \
      --header "x-api-key: $ANTHROPIC_API_KEY" \
      | sed 's/}{/}\n{/g' \
      | while IFS= read -r line
    do
      result_type=$(echo "$line" | sed -n 's/.*"result":[[:space:]]*{[[:space:]]*"type":[[:space:]]*"\([^"]*\)".*/\1/p')
      custom_id=$(echo "$line" | sed -n 's/.*"custom_id":[[:space:]]*"\([^"]*\)".*/\1/p')
      error_type=$(echo "$line" | sed -n 's/.*"error":[[:space:]]*{[[:space:]]*"type":[[:space:]]*"\([^"]*\)".*/\1/p')

      case "$result_type" in
        "succeeded")
          echo "Success! $custom_id"
          ;;
        "errored")
          if [ "$error_type" = "invalid_request" ]; then
            # Request body must be fixed before re-sending request
            echo "Validation error: $custom_id"
          else
            # Request can be retried directly
            echo "Server error: $custom_id"
          fi
          ;;
        "expired")
          echo "Expired: $line"
          ;;
      esac
    done
  done

```
```python Python
import anthropic

client = anthropic.Anthropic()

# Stream results file in memory-efficient chunks, processing one at a time
for result in client.messages.batches.results(
    "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
):
    match result.result.type:
        case "succeeded":
            print(f"Success! {result.custom_id}")
        case "errored":
            if result.result.error.type == "invalid_request":
                # Request body must be fixed before re-sending request
                print(f"Validation error {result.custom_id}")
            else:
                # Request can be retried directly
                print(f"Server error {result.custom_id}")
        case "expired":
            print(f"Request expired {result.custom_id}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Stream results file in memory-efficient chunks, processing one at a time
for await (const result of await anthropic.messages.batches.results(
    "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d"
)) {
  switch (result.result.type) {
    case 'succeeded':
      console.log(`Success! ${result.custom_id}`);
      break;
    case 'errored':
      if (result.result.error.type == "invalid_request") {
        // Request body must be fixed before re-sending request
        console.log(`Validation error: ${result.custom_id}`);
      } else {
        // Request can be retried directly
        console.log(`Server error: ${result.custom_id}`);
      }
      break;
    case 'expired':
      console.log(`Request expired: ${result.custom_id}`);
      break;
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.messages.batches.MessageBatchIndividualResponse;
import com.anthropic.models.messages.batches.BatchResultsParams;

public class BatchResultsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Stream results file in memory-efficient chunks, processing one at a time
        try (StreamResponse<MessageBatchIndividualResponse> streamResponse = client.messages()
                .batches()
                .resultsStreaming(
                        BatchResultsParams.builder()
                                .messageBatchId("msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d")
                                .build())) {

            streamResponse.stream().forEach(result -> {
                if (result.result().isSucceeded()) {
                    System.out.println("Success! " + result.customId());
                } else if (result.result().isErrored()) {
                    if (result.result().asErrored().error().error().isInvalidRequestError()) {
                        // Request body must be fixed before re-sending request
                        System.out.println("Validation error: " + result.customId());
                    } else {
                        // Request can be retried directly
                        System.out.println("Server error: " + result.customId());
                    }
                } else if (result.result().isExpired()) {
                    System.out.println("Request expired: " + result.customId());
                }
            });
        }
    }
}
```

</CodeGroup>

Os resultados estarão em formato `.jsonl`, onde cada linha é um objeto JSON válido representando o resultado de uma única solicitação no Lote de Mensagens. Para cada resultado transmitido, você pode fazer algo diferente dependendo de seu `custom_id` e tipo de resultado. Aqui está um exemplo de conjunto de resultados:

```json .jsonl file
{"custom_id":"my-second-request","result":{"type":"succeeded","message":{"id":"msg_014VwiXbi91y3JMjcpyGBHX5","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello again! It's nice to see you. How can I assist you today? Is there anything specific you'd like to chat about or any questions you have?"}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":11,"output_tokens":36}}}}
{"custom_id":"my-first-request","result":{"type":"succeeded","message":{"id":"msg_01FqfsLoHwgeFbguDgpz48m7","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello! How can I assist you today? Feel free to ask me any questions or let me know if there's anything you'd like to chat about."}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":34}}}}
```

Se seu resultado tiver um erro, seu `result.error` será definido para nossa [forma de erro](/docs/pt-BR/api/errors#error-shapes) padrão.

<Tip>
  **Os resultados do lote podem não corresponder à ordem de entrada**

Os resultados do lote podem ser retornados em qualquer ordem e podem não corresponder à ordem das solicitações quando o lote foi criado. No exemplo acima, o resultado para a segunda solicitação do lote é retornado antes da primeira. Para corresponder corretamente os resultados com suas solicitações correspondentes, sempre use o campo `custom_id`.
</Tip>

### Cancelando um Lote de Mensagens

Você pode cancelar um Lote de Mensagens que está sendo processado usando o [endpoint de cancelamento](/docs/pt-BR/api/canceling-message-batches). Imediatamente após o cancelamento, o `processing_status` de um lote será `canceling`. Você pode usar a mesma técnica de consulta descrita acima para aguardar até que o cancelamento seja finalizado. Os lotes cancelados terminam com um status de `ended` e podem conter resultados parciais para solicitações que foram processadas antes do cancelamento.

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

message_batch = client.messages.batches.cancel(
    MESSAGE_BATCH_ID,
)
print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.cancel(
    MESSAGE_BATCH_ID
);
console.log(messageBatch);
```

```bash Shell
#!/bin/sh
curl --request POST https://api.anthropic.com/v1/messages/batches/$MESSAGE_BATCH_ID/cancel \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01"
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.batches.*;

public class BatchCancelExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageBatch messageBatch = client.messages().batches().cancel(
                BatchCancelParams.builder()
                        .messageBatchId(MESSAGE_BATCH_ID)
                        .build()
        );
        System.out.println(messageBatch);
    }
}
```
</CodeGroup>

A resposta mostrará o lote em um estado `canceling`:

```json JSON
{
  "id": "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
  "type": "message_batch",
  "processing_status": "canceling",
  "request_counts": {
    "processing": 2,
    "succeeded": 0,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "ended_at": null,
  "created_at": "2024-09-24T18:37:24.100435Z",
  "expires_at": "2024-09-25T18:37:24.100435Z",
  "cancel_initiated_at": "2024-09-24T18:39:03.114875Z",
  "results_url": null
}
```

### Usando cache de prompt com Message Batches

A API Message Batches suporta cache de prompt, permitindo que você reduza potencialmente custos e tempo de processamento para solicitações em lote. Os descontos de preço do cache de prompt e Message Batches podem se acumular, fornecendo economias de custo ainda maiores quando ambos os recursos são usados juntos. No entanto, como as solicitações em lote são processadas de forma assíncrona e concorrente, os acertos de cache são fornecidos com base no melhor esforço. Os usuários normalmente experimentam taxas de acerto de cache variando de 30% a 98%, dependendo de seus padrões de tráfego.

Para maximizar a probabilidade de acertos de cache em suas solicitações em lote:

1. Inclua blocos `cache_control` idênticos em cada solicitação de Message dentro do seu lote
2. Mantenha um fluxo constante de solicitações para evitar que as entradas de cache expirem após seu tempo de vida de 5 minutos
3. Estruture suas solicitações para compartilhar o máximo possível de conteúdo em cache

Exemplo de implementação de cache de prompt em um lote:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages/batches \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "requests": [
        {
            "custom_id": "my-first-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "system": [
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                "messages": [
                    {"role": "user", "content": "Analyze the major themes in Pride and Prejudice."}
                ]
            }
        },
        {
            "custom_id": "my-second-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "system": [
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                "messages": [
                    {"role": "user", "content": "Write a summary of Pride and Prejudice."}
                ]
            }
        }
    ]
}'
```

```python Python
import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

message_batch = client.messages.batches.create(
    requests=[
        Request(
            custom_id="my-first-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                system=[
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                messages=[{
                    "role": "user",
                    "content": "Analyze the major themes in Pride and Prejudice."
                }]
            )
        ),
        Request(
            custom_id="my-second-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                system=[
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                messages=[{
                    "role": "user",
                    "content": "Write a summary of Pride and Prejudice."
                }]
            )
        )
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.create({
  requests: [{
    custom_id: "my-first-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
        },
        {
          type: "text",
          text: "<the entire contents of Pride and Prejudice>",
          cache_control: {type: "ephemeral"}
        }
      ],
      messages: [
        {"role": "user", "content": "Analyze the major themes in Pride and Prejudice."}
      ]
    }
  }, {
    custom_id: "my-second-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
        },
        {
          type: "text",
          text: "<the entire contents of Pride and Prejudice>",
          cache_control: {type: "ephemeral"}
        }
      ],
      messages: [
        {"role": "user", "content": "Write a summary of Pride and Prejudice."}
      ]
    }
  }]
});
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.batches.*;

public class BatchExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BatchCreateParams createParams = BatchCreateParams.builder()
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-first-request")
                        .params(BatchCreateParams.Request.Params.builder()
                                .model(Model.CLAUDE_OPUS_4_0)
                                .maxTokens(1024)
                                .systemOfTextBlockParams(List.of(
                                        TextBlockParam.builder()
                                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                                .build(),
                                        TextBlockParam.builder()
                                                .text("<the entire contents of Pride and Prejudice>")
                                                .cacheControl(CacheControlEphemeral.builder().build())
                                                .build()
                                ))
                                .addUserMessage("Analyze the major themes in Pride and Prejudice.")
                                .build())
                        .build())
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-second-request")
                        .params(BatchCreateParams.Request.Params.builder()
                                .model(Model.CLAUDE_OPUS_4_0)
                                .maxTokens(1024)
                                .systemOfTextBlockParams(List.of(
                                        TextBlockParam.builder()
                                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                                .build(),
                                        TextBlockParam.builder()
                                                .text("<the entire contents of Pride and Prejudice>")
                                                .cacheControl(CacheControlEphemeral.builder().build())
                                                .build()
                                ))
                                .addUserMessage("Write a summary of Pride and Prejudice.")
                                .build())
                        .build())
                .build();

        MessageBatch messageBatch = client.messages().batches().create(createParams);
    }
}
```

</CodeGroup>

Neste exemplo, ambas as solicitações no lote incluem mensagens de sistema idênticas e o texto completo de Pride and Prejudice marcado com `cache_control` para aumentar a probabilidade de acertos de cache.

### Melhores práticas para batching eficaz

Para aproveitar ao máximo a API Batches:

- Monitore o status de processamento do lote regularmente e implemente lógica de repetição apropriada para solicitações com falha.
- Use valores `custom_id` significativos para corresponder facilmente resultados com solicitações, já que a ordem não é garantida.
- Considere dividir conjuntos de dados muito grandes em múltiplos lotes para melhor gerenciabilidade.
- Faça uma execução de teste de uma única forma de solicitação com a API Messages para evitar erros de validação.

### Solução de problemas comuns

Se experimentar comportamento inesperado:

- Verifique se o tamanho total da solicitação em lote não excede 256 MB. Se o tamanho da solicitação for muito grande, você pode receber um erro 413 `request_too_large`.
- Verifique se você está usando [modelos suportados](#supported-models) para todas as solicitações no lote.
- Certifique-se de que cada solicitação no lote tenha um `custom_id` único.
- Certifique-se de que menos de 29 dias tenham passado desde o tempo `created_at` do lote (não o tempo `ended_at` de processamento). Se mais de 29 dias tiverem passado, os resultados não serão mais visualizáveis.
- Confirme que o lote não foi cancelado.

Observe que a falha de uma solicitação em um lote não afeta o processamento de outras solicitações.

---
## Armazenamento e privacidade de lotes

- **Isolamento de Workspace**: Os lotes são isolados dentro do Workspace em que foram criados. Eles só podem ser acessados por chaves de API associadas a esse Workspace, ou por usuários com permissão para visualizar lotes de Workspace no Console.

- **Disponibilidade de resultados**: Os resultados do lote estão disponíveis por 29 dias após a criação do lote, permitindo tempo amplo para recuperação e processamento.

---
## Perguntas frequentes

  <section title="Quanto tempo leva para um lote ser processado?">

    Os lotes podem levar até 24 horas para processamento, mas muitos serão concluídos mais cedo. O tempo de processamento real depende do tamanho do lote, da demanda atual e do seu volume de solicitações. É possível que um lote expire e não seja concluído dentro de 24 horas.
  
</section>

  <section title="A API Batches está disponível para todos os modelos?">

    Veja [acima](#supported-models) para a lista de modelos suportados.
  
</section>

  <section title="Posso usar a API Message Batches com outros recursos de API?">

    Sim, a API Message Batches suporta todos os recursos disponíveis na API Messages, incluindo recursos beta. No entanto, streaming não é suportado para solicitações em lote.
  
</section>

  <section title="Como a API Message Batches afeta os preços?">

    A API Message Batches oferece um desconto de 50% em todo o uso em comparação com os preços padrão da API. Isso se aplica a tokens de entrada, tokens de saída e quaisquer tokens especiais. Para mais informações sobre preços, visite nossa [página de preços](https://claude.com/pricing#anthropic-api).
  
</section>

  <section title="Posso atualizar um lote após ele ter sido enviado?">

    Não, uma vez que um lote foi enviado, ele não pode ser modificado. Se você precisar fazer alterações, deve cancelar o lote atual e enviar um novo. Observe que o cancelamento pode não ter efeito imediato.
  
</section>

  <section title="Existem limites de taxa da API Message Batches e eles interagem com os limites de taxa da API Messages?">

    A API Message Batches tem limites de taxa baseados em solicitações HTTP além de limites no número de solicitações que precisam de processamento. Veja [Limites de taxa da API Message Batches](/docs/pt-BR/api/rate-limits#message-batches-api). O uso da API Batches não afeta os limites de taxa na API Messages.
  
</section>

  <section title="Como faço para lidar com erros nas minhas solicitações em lote?">

    Quando você recupera os resultados, cada solicitação terá um campo `result` indicando se `succeeded`, `errored`, foi `canceled`, ou `expired`. Para resultados `errored`, informações de erro adicionais serão fornecidas. Veja o objeto de resposta de erro na [referência da API](/docs/pt-BR/api/creating-message-batches).
  
</section>

  <section title="Como a API Message Batches lida com privacidade e separação de dados?">

    A API Message Batches foi projetada com medidas fortes de privacidade e separação de dados:

    1. Os lotes e seus resultados são isolados dentro do Workspace em que foram criados. Isso significa que eles só podem ser acessados por chaves de API do mesmo Workspace.
    2. Cada solicitação dentro de um lote é processada independentemente, sem vazamento de dados entre solicitações.
    3. Os resultados estão disponíveis apenas por um tempo limitado (29 dias) e seguem nossa [política de retenção de dados](https://support.claude.com/en/articles/7996866-how-long-do-you-store-personal-data).
    4. O download de resultados de lote no Console pode ser desabilitado no nível da organização ou por base de Workspace.
  
</section>

  <section title="Posso usar cache de prompt na API Message Batches?">

    Sim, é possível usar cache de prompt com a API Message Batches. No entanto, como as solicitações em lote assíncronas podem ser processadas simultaneamente e em qualquer ordem, os acertos de cache são fornecidos com base no melhor esforço.
  
</section>