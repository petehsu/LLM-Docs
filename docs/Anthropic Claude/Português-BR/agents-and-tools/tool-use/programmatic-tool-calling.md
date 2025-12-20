# Chamada de ferramentas programática

Permita que Claude chame suas ferramentas programaticamente dentro de um contêiner de execução de código, reduzindo latência e consumo de tokens em fluxos de trabalho com múltiplas ferramentas.

---

A chamada de ferramentas programática permite que Claude escreva código que chama suas ferramentas programaticamente dentro de um [contêiner de execução de código](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool), em vez de exigir viagens de ida e volta através do modelo para cada invocação de ferramenta. Isso reduz a latência para fluxos de trabalho com múltiplas ferramentas e diminui o consumo de tokens ao permitir que Claude filtre ou processe dados antes que atinjam a janela de contexto do modelo.

<Note>
A chamada de ferramentas programática está atualmente em beta público.

Para usar este recurso, adicione o [cabeçalho beta](/docs/pt-BR/api/beta-headers) `"advanced-tool-use-2025-11-20"` às suas solicitações de API.

Este recurso requer que a ferramenta de execução de código esteja habilitada.
</Note>

## Compatibilidade de modelos

A chamada de ferramentas programática está disponível nos seguintes modelos:

| Modelo | Versão da Ferramenta |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |

<Warning>
A chamada de ferramentas programática está disponível via Claude API e Microsoft Foundry.
</Warning>

## Início rápido

Aqui está um exemplo simples onde Claude consulta programaticamente um banco de dados várias vezes e agrega resultados:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
            }
        ],
        "tools": [
            {
                "type": "code_execution_20250825",
                "name": "code_execution"
            },
            {
                "name": "query_database",
                "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "sql": {
                            "type": "string",
                            "description": "SQL query to execute"
                        }
                    },
                    "required": ["sql"]
                },
                "allowed_callers": ["code_execution_20250825"]
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "sql": {
                        "type": "string",
                        "description": "SQL query to execute"
                    }
                },
                "required": ["sql"]
            },
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
      }
    ],
    tools: [
      {
        type: "code_execution_20250825",
        name: "code_execution"
      },
      {
        name: "query_database",
        description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        input_schema: {
          type: "object",
          properties: {
            sql: {
              type: "string",
              description: "SQL query to execute"
            }
          },
          required: ["sql"]
        },
        allowed_callers: ["code_execution_20250825"]
      }
    ]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## Como funciona a chamada de ferramentas programática

Quando você configura uma ferramenta para ser chamável a partir da execução de código e Claude decide usar essa ferramenta:

1. Claude escreve código Python que invoca a ferramenta como uma função, potencialmente incluindo múltiplas chamadas de ferramenta e lógica de pré/pós-processamento
2. Claude executa este código em um contêiner em sandbox via execução de código
3. Quando uma função de ferramenta é chamada, a execução de código pausa e a API retorna um bloco `tool_use`
4. Você fornece o resultado da ferramenta, e a execução de código continua (resultados intermediários não são carregados na janela de contexto do Claude)
5. Após a conclusão de toda a execução de código, Claude recebe a saída final e continua trabalhando na tarefa

Esta abordagem é particularmente útil para:
- **Processamento de grandes dados**: Filtre ou agregue resultados de ferramentas antes que atinjam o contexto do Claude
- **Fluxos de trabalho em várias etapas**: Economize tokens e latência chamando ferramentas em série ou em um loop sem amostrar Claude entre chamadas de ferramentas
- **Lógica condicional**: Tome decisões com base em resultados intermediários de ferramentas

<Note>
As ferramentas personalizadas são convertidas em funções Python assíncronas para suportar chamadas de ferramentas paralelas. Quando Claude escreve código que chama suas ferramentas, ele usa `await` (por exemplo, `result = await query_database("<sql>")`) e inclui automaticamente a função wrapper assíncrona apropriada.

O wrapper assíncrono é omitido dos exemplos de código nesta documentação para clareza.
</Note>

## Conceitos principais

### O campo `allowed_callers`

O campo `allowed_callers` especifica quais contextos podem invocar uma ferramenta:

```json
{
  "name": "query_database",
  "description": "Execute a SQL query against the database",
  "input_schema": {...},
  "allowed_callers": ["code_execution_20250825"]
}
```

**Valores possíveis:**
- `["direct"]` - Apenas Claude pode chamar esta ferramenta diretamente (padrão se omitido)
- `["code_execution_20250825"]` - Apenas chamável de dentro da execução de código
- `["direct", "code_execution_20250825"]` - Chamável tanto diretamente quanto de execução de código

<Tip>
Recomendamos escolher `["direct"]` ou `["code_execution_20250825"]` para cada ferramenta em vez de habilitar ambas, pois isso fornece orientação mais clara ao Claude sobre como melhor usar a ferramenta.
</Tip>

### O campo `caller` em respostas

Cada bloco de uso de ferramenta inclui um campo `caller` indicando como foi invocado:

**Invocação direta (uso de ferramenta tradicional):**
```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {"type": "direct"}
}
```

**Invocação programática:**
```json
{
  "type": "tool_use",
  "id": "toolu_xyz789",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_abc123"
  }
}
```

O `tool_id` referencia a ferramenta de execução de código que fez a chamada programática.

### Ciclo de vida do contêiner

A chamada de ferramentas programática usa os mesmos contêineres que a execução de código:

- **Criação de contêiner**: Um novo contêiner é criado para cada sessão, a menos que você reutilize um existente
- **Expiração**: Os contêineres expiram após aproximadamente 4,5 minutos de inatividade (sujeito a alterações)
- **ID do contêiner**: Retornado em respostas via campo `container`
- **Reutilização**: Passe o ID do contêiner para manter o estado entre solicitações

<Warning>
Quando uma ferramenta é chamada programaticamente e o contêiner está aguardando seu resultado de ferramenta, você deve responder antes que o contêiner expire. Monitore o campo `expires_at`. Se o contêiner expirar, Claude pode tratar a chamada de ferramenta como expirada e tentar novamente.
</Warning>

## Fluxo de trabalho de exemplo

Aqui está como funciona um fluxo completo de chamada de ferramentas programática:

### Etapa 1: Solicitação inicial

Envie uma solicitação com execução de código e uma ferramenta que permite chamada programática. Para habilitar a chamada programática, adicione o campo `allowed_callers` à sua definição de ferramenta.

<Note>
Forneça descrições detalhadas do formato de saída de sua ferramenta na descrição da ferramenta. Se você especificar que a ferramenta retorna JSON, Claude tentará desserializar e processar o resultado em código. Quanto mais detalhes você fornecer sobre o esquema de saída, melhor Claude poderá lidar com a resposta programaticamente.
</Note>

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
  }],
  tools: [
    {
      type: "code_execution_20250825",
      name: "code_execution"
    },
    {
      name: "query_database",
      description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
      input_schema: {...},
      allowed_callers: ["code_execution_20250825"]
    }
  ]
});
```
</CodeGroup>

### Etapa 2: Resposta da API com chamada de ferramenta

Claude escreve código que chama sua ferramenta. A API pausa e retorna:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll query the purchase history and analyze the results."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_abc123",
      "name": "code_execution",
      "input": {
        "code": "results = await query_database('<sql>')\ntop_customers = sorted(results, key=lambda x: x['revenue'], reverse=True)[:5]\nprint(f'Top 5 customers: {top_customers}')"
      }
    },
    {
      "type": "tool_use",
      "id": "toolu_def456",
      "name": "query_database",
      "input": {"sql": "\<sql\>"},
      "caller": {
        "type": "code_execution_20250825",
        "tool_id": "srvtoolu_abc123"
      }
    }
  ],
  "container": {
    "id": "container_xyz789",
    "expires_at": "2025-01-15T14:30:00Z"
  },
  "stop_reason": "tool_use"
}
```

### Etapa 3: Fornecer resultado da ferramenta

Inclua o histórico completo da conversa mais seu resultado de ferramenta:

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    container="container_xyz789",  # Reuse the container
    messages=[
        {"role": "user", "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"},
        {
            "role": "assistant",
            "content": [
                {"type": "text", "text": "I'll query the purchase history and analyze the results."},
                {
                    "type": "server_tool_use",
                    "id": "srvtoolu_abc123",
                    "name": "code_execution",
                    "input": {"code": "..."}
                },
                {
                    "type": "tool_use",
                    "id": "toolu_def456",
                    "name": "query_database",
                    "input": {"sql": "\<sql\>"},
                    "caller": {
                        "type": "code_execution_20250825",
                        "tool_id": "srvtoolu_abc123"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_def456",
                    "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
                }
            ]
        }
    ],
    tools=[...]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  container: "container_xyz789",  // Reuse the container
  messages: [
    { role: "user", content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue" },
    {
      role: "assistant",
      content: [
        { type: "text", text: "I'll query the purchase history and analyze the results." },
        {
          type: "server_tool_use",
          id: "srvtoolu_abc123",
          name: "code_execution",
          input: { code: "..." }
        },
        {
          type: "tool_use",
          id: "toolu_def456",
          name: "query_database",
          input: { sql: "\<sql\>" },
          caller: {
            type: "code_execution_20250825",
            tool_id: "srvtoolu_abc123"
          }
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: "toolu_def456",
          content: "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
        }
      ]
    }
  ],
  tools: [...]
});
```
</CodeGroup>

### Etapa 4: Próxima chamada de ferramenta ou conclusão

A execução de código continua e processa os resultados. Se chamadas de ferramenta adicionais forem necessárias, repita a Etapa 3 até que todas as chamadas de ferramenta sejam satisfeitas.

### Etapa 5: Resposta final

Após a conclusão da execução de código, Claude fornece a resposta final:

```json
{
  "content": [
    {
      "type": "code_execution_tool_result",
      "tool_use_id": "srvtoolu_abc123",
      "content": {
        "type": "code_execution_result",
        "stdout": "Top 5 customers by revenue:\n1. Customer C1: $45,000\n2. Customer C2: $38,000\n3. Customer C5: $32,000\n4. Customer C8: $28,500\n5. Customer C3: $24,000",
        "stderr": "",
        "return_code": 0,
        "content": []
      }
    },
    {
      "type": "text",
      "text": "I've analyzed the purchase history from last quarter. Your top 5 customers generated $167,500 in total revenue, with Customer C1 leading at $45,000."
    }
  ],
  "stop_reason": "end_turn"
}
```

## Padrões avançados

### Processamento em lote com loops

Claude pode escrever código que processa múltiplos itens eficientemente:

```python
# async wrapper omitted for clarity
regions = ["West", "East", "Central", "North", "South"]
results = {}
for region in regions:
    data = await query_database(f"<sql for {region}>")
    results[region] = sum(row["revenue"] for row in data)

# Process results programmatically
top_region = max(results.items(), key=lambda x: x[1])
print(f"Top region: {top_region[0]} with ${top_region[1]:,} in revenue")
```

Este padrão:
- Reduz viagens de modelo de N (uma por região) para 1
- Processa grandes conjuntos de resultados programaticamente antes de retornar ao Claude
- Economiza tokens retornando apenas conclusões agregadas em vez de dados brutos

### Encerramento antecipado

Claude pode parar de processar assim que os critérios de sucesso forem atendidos:

```python
# async wrapper omitted for clarity
endpoints = ["us-east", "eu-west", "apac"]
for endpoint in endpoints:
    status = await check_health(endpoint)
    if status == "healthy":
        print(f"Found healthy endpoint: {endpoint}")
        break  # Stop early, don't check remaining
```

### Seleção condicional de ferramenta

```python
# async wrapper omitted for clarity
file_info = await get_file_info(path)
if file_info["size"] < 10000:
    content = await read_full_file(path)
else:
    content = await read_file_summary(path)
print(content)
```

### Filtragem de dados

```python
# async wrapper omitted for clarity
logs = await fetch_logs(server_id)
errors = [log for log in logs if "ERROR" in log]
print(f"Found {len(errors)} errors")
for error in errors[-10:]:  # Only return last 10 errors
    print(error)
```

## Formato de resposta

### Chamada de ferramenta programática

Quando a execução de código chama uma ferramenta:

```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_xyz789"
  }
}
```

### Tratamento de resultado de ferramenta

Seu resultado de ferramenta é passado de volta para o código em execução:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_abc123",
      "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000, \"orders\": 23}, {\"customer_id\": \"C2\", \"revenue\": 38000, \"orders\": 18}, ...]"
    }
  ]
}
```

### Conclusão da execução de código

Quando todas as chamadas de ferramenta são satisfeitas e o código é concluído:

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_xyz789",
  "content": {
    "type": "code_execution_result",
    "stdout": "Analysis complete. Top 5 customers identified from 847 total records.",
    "stderr": "",
    "return_code": 0,
    "content": []
  }
}
```

## Tratamento de erros

### Erros comuns

| Erro | Descrição | Solução |
|-------|-------------|----------|
| `invalid_tool_input` | A entrada da ferramenta não corresponde ao esquema | Valide o input_schema de sua ferramenta |
| `tool_not_allowed` | A ferramenta não permite o tipo de chamador solicitado | Verifique se `allowed_callers` inclui os contextos corretos |
| `missing_beta_header` | Cabeçalho beta PTC não fornecido | Adicione ambos os cabeçalhos beta à sua solicitação |

### Expiração de contêiner durante chamada de ferramenta

Se sua ferramenta levar muito tempo para responder, a execução de código receberá um `TimeoutError`. Claude vê isso em stderr e normalmente tentará novamente:

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_abc123",
  "content": {
    "type": "code_execution_result",
    "stdout": "",
    "stderr": "TimeoutError: Calling tool ['query_database'] timed out.",
    "return_code": 0,
    "content": []
  }
}
```

Para evitar timeouts:
- Monitore o campo `expires_at` em respostas
- Implemente timeouts para sua execução de ferramenta
- Considere dividir operações longas em pedaços menores

### Erros de execução de ferramenta

Se sua ferramenta retornar um erro:

```python
# Provide error information in the tool result
{
    "type": "tool_result",
    "tool_use_id": "toolu_abc123",
    "content": "Error: Query timeout - table lock exceeded 30 seconds"
}
```

O código do Claude receberá este erro e poderá tratá-lo apropriadamente.

## Restrições e limitações

### Incompatibilidades de recursos

- **Saídas estruturadas**: Ferramentas com `strict: true` não são suportadas com chamada programática
- **Escolha de ferramenta**: Você não pode forçar a chamada programática de uma ferramenta específica via `tool_choice`
- **Uso de ferramenta paralela**: `disable_parallel_tool_use: true` não é suportado com chamada programática

### Restrições de ferramenta

As seguintes ferramentas não podem ser chamadas programaticamente no momento, mas o suporte pode ser adicionado em versões futuras:

- Busca na web
- Busca na web
- Ferramentas fornecidas por um [conector MCP](/docs/pt-BR/agents-and-tools/mcp-connector)

### Restrições de formatação de mensagem

Ao responder a chamadas de ferramentas programáticas, há requisitos rigorosos de formatação:

**Respostas apenas de resultado de ferramenta**: Se houver chamadas de ferramentas programáticas pendentes aguardando resultados, sua mensagem de resposta deve conter **apenas** blocos `tool_result`. Você não pode incluir nenhum conteúdo de texto, mesmo após os resultados da ferramenta.

```json
// ❌ INVÁLIDO - Não pode incluir texto ao responder a chamadas de ferramentas programáticas
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"},
    {"type": "text", "text": "What should I do next?"}  // This will cause an error
  ]
}

// ✅ VÁLIDO - Apenas resultados de ferramentas ao responder a chamadas de ferramentas programáticas
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"}
  ]
}
```

Esta restrição se aplica apenas ao responder a chamadas de ferramentas programáticas (execução de código). Para chamadas de ferramentas regulares do lado do cliente, você pode incluir conteúdo de texto após resultados de ferramentas.

### Limites de taxa

As chamadas de ferramentas programáticas estão sujeitas aos mesmos limites de taxa que as chamadas de ferramentas regulares. Cada chamada de ferramenta da execução de código conta como uma invocação separada.

### Validar resultados de ferramentas antes do uso

Ao implementar ferramentas personalizadas que serão chamadas programaticamente:

- **Resultados de ferramentas são retornados como strings**: Podem conter qualquer conteúdo, incluindo trechos de código ou comandos executáveis que podem ser processados pelo ambiente de execução.
- **Validar resultados de ferramentas externas**: Se sua ferramenta retorna dados de fontes externas ou aceita entrada do usuário, esteja ciente dos riscos de injeção de código se a saída for interpretada ou executada como código.

## Eficiência de tokens

A chamada de ferramentas programática pode reduzir significativamente o consumo de tokens:

- **Resultados de ferramentas de chamadas programáticas não são adicionados ao contexto do Claude** - apenas a saída final do código
- **Processamento intermediário acontece em código** - filtragem, agregação, etc. não consomem tokens do modelo
- **Múltiplas chamadas de ferramenta em uma execução de código** - reduz overhead comparado a turnos de modelo separados

Por exemplo, chamar 10 ferramentas diretamente usa ~10x os tokens de chamá-las programaticamente e retornar um resumo.

## Uso e preços

A chamada de ferramentas programática usa o mesmo preço que a execução de código. Veja o [preço de execução de código](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool#usage-and-pricing) para detalhes.

<Note>
Contagem de tokens para chamadas de ferramentas programáticas: Resultados de ferramentas de invocações programáticas não contam para seu uso de tokens de entrada/saída. Apenas o resultado final da execução de código e a resposta do Claude contam.
</Note>

## Melhores práticas

### Design de ferramenta

- **Forneça descrições detalhadas de saída**: Como Claude desserializa resultados de ferramentas em código, documente claramente o formato (estrutura JSON, tipos de campo, etc.)
- **Retorne dados estruturados**: JSON ou outros formatos facilmente analisáveis funcionam melhor para processamento programático
- **Mantenha respostas concisas**: Retorne apenas dados necessários para minimizar overhead de processamento

### Quando usar chamada programática

**Bons casos de uso:**
- Processamento de grandes conjuntos de dados onde você só precisa de agregados ou resumos
- Fluxos de trabalho em várias etapas com 3+ chamadas de ferramentas dependentes
- Operações que exigem filtragem, classificação ou transformação de resultados de ferramentas
- Tarefas onde dados intermediários não devem influenciar o raciocínio do Claude
- Operações paralelas em muitos itens (por exemplo, verificar 50 endpoints)

**Casos de uso menos ideais:**
- Chamadas de ferramenta única com respostas simples
- Ferramentas que precisam de feedback imediato do usuário
- Operações muito rápidas onde o overhead de execução de código superaria o benefício

### Otimização de desempenho

- **Reutilize contêineres** ao fazer múltiplas solicitações relacionadas para manter o estado
- **Agrupe operações similares** em uma única execução de código quando possível

## Solução de problemas

### Problemas comuns

**Erro "Tool not allowed"**
- Verifique se sua definição de ferramenta inclui `"allowed_callers": ["code_execution_20250825"]`
- Verifique se você está usando os cabeçalhos beta corretos

**Expiração de contêiner**
- Certifique-se de responder a chamadas de ferramentas dentro da vida útil do contêiner (~4,5 minutos)
- Monitore o campo `expires_at` em respostas
- Considere implementar execução de ferramenta mais rápida

**Problemas de cabeçalho beta**
- Você precisa do cabeçalho: `"advanced-tool-use-2025-11-20"`

**Resultado de ferramenta não analisado corretamente**
- Certifique-se de que sua ferramenta retorna dados de string que Claude pode desserializar
- Forneça documentação clara de formato de saída na descrição de sua ferramenta

### Dicas de depuração

1. **Registre todas as chamadas de ferramentas e resultados** para rastrear o fluxo
2. **Verifique o campo `caller`** para confirmar invocação programática
3. **Monitore IDs de contêiner** para garantir reutilização adequada
4. **Teste ferramentas independentemente** antes de habilitar chamada programática

## Por que a chamada de ferramentas programática funciona

O treinamento do Claude inclui exposição extensiva a código, tornando-o eficaz no raciocínio através e encadeamento de chamadas de função. Quando ferramentas são apresentadas como funções chamáveis dentro de um ambiente de execução de código, Claude pode aproveitar essa força para:

- **Raciocinar naturalmente sobre composição de ferramentas**: Encadear operações e lidar com dependências tão naturalmente quanto escrever qualquer código Python
- **Processar grandes resultados eficientemente**: Filtrar grandes saídas de ferramentas, extrair apenas dados relevantes, ou escrever resultados intermediários em arquivos antes de retornar resumos à janela de contexto
- **Reduzir latência significativamente**: Eliminar o overhead de re-amostragem do Claude entre cada chamada de ferramenta em fluxos de trabalho em várias etapas

Esta abordagem permite fluxos de trabalho que seriam impraticáveis com uso de ferramenta tradicional—como processar arquivos com mais de 1M tokens—ao permitir que Claude trabalhe com dados programaticamente em vez de carregar tudo no contexto da conversa.

## Implementações alternativas

A chamada de ferramentas programática é um padrão generalizável que pode ser implementado fora da execução de código gerenciada da Anthropic. Aqui está uma visão geral das abordagens:

### Execução direta do lado do cliente

Forneça ao Claude uma ferramenta de execução de código e descreva quais funções estão disponíveis nesse ambiente. Quando Claude invoca a ferramenta com código, sua aplicação a executa localmente onde essas funções são definidas.

**Vantagens:**
- Simples de implementar com re-arquitetura mínima
- Controle total sobre o ambiente e instruções

**Desvantagens:**
- Executa código não confiável fora de um sandbox
- Invocações de ferramentas podem ser vetores para injeção de código

**Use quando:** Sua aplicação pode executar com segurança código arbitrário, você quer uma solução simples, e a oferta gerenciada da Anthropic não se encaixa em suas necessidades.

### Execução em sandbox auto-gerenciada

A mesma abordagem da perspectiva do Claude, mas o código é executado em um contêiner em sandbox com restrições de segurança (por exemplo, sem saída de rede). Se suas ferramentas exigem recursos externos, você precisará de um protocolo para executar chamadas de ferramentas fora do sandbox.

**Vantagens:**
- Chamada de ferramenta programática segura em sua própria infraestrutura
- Controle total sobre o ambiente de execução

**Desvantagens:**
- Complexo de construir e manter
- Requer gerenciamento de infraestrutura e comunicação entre processos

**Use quando:** Segurança é crítica e a solução gerenciada da Anthropic não se encaixa em suas necessidades.

### Execução gerenciada pela Anthropic

A chamada de ferramentas programática da Anthropic é uma versão gerenciada de execução em sandbox com um ambiente Python opinativo ajustado para Claude. A Anthropic lida com gerenciamento de contêiner, execução de código e comunicação segura de invocação de ferramentas.

**Vantagens:**
- Seguro por padrão
- Fácil de habilitar com configuração mínima
- Ambiente e instruções otimizados para Claude

Recomendamos usar a solução gerenciada da Anthropic se você estiver usando a Claude API.

## Recursos relacionados

<CardGroup cols={2}>
  <Card title="Ferramenta de Execução de Código" icon="code" href="/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool">
    Saiba mais sobre a capacidade de execução de código subjacente que alimenta a chamada de ferramentas programática.
  </Card>
  <Card title="Visão Geral de Uso de Ferramentas" icon="wrench" href="/docs/pt-BR/agents-and-tools/tool-use/overview">
    Entenda os fundamentos do uso de ferramentas com Claude.
  </Card>
  <Card title="Implementar Uso de Ferramentas" icon="hammer" href="/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use">
    Guia passo a passo para implementar ferramentas.
  </Card>
</CardGroup>