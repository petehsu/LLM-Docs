# Cache de prompt

O cache de prompt é um recurso poderoso que otimiza o uso da API permitindo retomar a partir de prefixos específicos em seus prompts.

---

O cache de prompt é um recurso poderoso que otimiza o uso da API permitindo retomar a partir de prefixos específicos em seus prompts. Esta abordagem reduz significativamente o tempo de processamento e os custos para tarefas repetitivas ou prompts com elementos consistentes.

Aqui está um exemplo de como implementar o cache de prompt com a API Messages usando um bloco `cache_control`:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
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
      {
        "role": "user",
        "content": "Analyze the major themes in Pride and Prejudice."
      }
    ]
  }'

# Call the model again with the same inputs up to the cache checkpoint
curl https://api.anthropic.com/v1/messages # rest of input
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
      },
      {
        "type": "text",
        "text": "<the entire contents of 'Pride and Prejudice'>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    messages=[{"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}],
)
print(response.usage.model_dump_json())

# Call the model again with the same inputs up to the cache checkpoint
response = client.messages.create(.....)
print(response.usage.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
    },
    {
      type: "text",
      text: "<the entire contents of 'Pride and Prejudice'>",
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [
    {
      role: "user",
      content: "Analyze the major themes in 'Pride and Prejudice'."
    }
  ]
});
console.log(response.usage);

// Call the model again with the same inputs up to the cache checkpoint
const new_response = await client.messages.create(...)
console.log(new_response.usage);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class PromptCachingExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                .build(),
                        TextBlockParam.builder()
                                .text("<the entire contents of 'Pride and Prejudice'>")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("Analyze the major themes in 'Pride and Prejudice'.")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.usage());
    }
}
```
</CodeGroup>

```json JSON
{"cache_creation_input_tokens":188086,"cache_read_input_tokens":0,"input_tokens":21,"output_tokens":393}
{"cache_creation_input_tokens":0,"cache_read_input_tokens":188086,"input_tokens":21,"output_tokens":393}
```

Neste exemplo, o texto completo de "Pride and Prejudice" é armazenado em cache usando o parâmetro `cache_control`. Isso permite reutilizar este texto grande em várias chamadas de API sem reprocessá-lo cada vez. Alterar apenas a mensagem do usuário permite fazer várias perguntas sobre o livro enquanto utiliza o conteúdo em cache, resultando em respostas mais rápidas e eficiência melhorada.

---

## Como funciona o cache de prompt

Quando você envia uma solicitação com o cache de prompt ativado:

1. O sistema verifica se um prefixo de prompt, até um ponto de interrupção de cache especificado, já está em cache de uma consulta recente.
2. Se encontrado, ele usa a versão em cache, reduzindo o tempo de processamento e os custos.
3. Caso contrário, ele processa o prompt completo e armazena o prefixo em cache assim que a resposta começa.

Isso é especialmente útil para:
- Prompts com muitos exemplos
- Grandes quantidades de contexto ou informações de fundo
- Tarefas repetitivas com instruções consistentes
- Conversas longas com múltiplos turnos

Por padrão, o cache tem um tempo de vida de 5 minutos. O cache é atualizado sem custo adicional cada vez que o conteúdo em cache é usado.

<Note>
Se você achar que 5 minutos é muito curto, a Anthropic também oferece uma duração de cache de 1 hora [com custo adicional](#pricing).

Para mais informações, consulte [duração de cache de 1 hora](#1-hour-cache-duration).
</Note>

<Tip>
  **O cache de prompt armazena o prefixo completo em cache**

O cache de prompt referencia o prompt inteiro - `tools`, `system` e `messages` (nessa ordem) até e incluindo o bloco designado com `cache_control`.

</Tip>

---
## Preços

O cache de prompt introduz uma nova estrutura de preços. A tabela abaixo mostra o preço por milhão de tokens para cada modelo suportado:

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
A tabela acima reflete os seguintes multiplicadores de preço para cache de prompt:
- Tokens de escrita de cache de 5 minutos são 1,25 vezes o preço de tokens de entrada base
- Tokens de escrita de cache de 1 hora são 2 vezes o preço de tokens de entrada base
- Tokens de leitura de cache são 0,1 vezes o preço de tokens de entrada base
</Note>

---
## Como implementar o cache de prompt

### Modelos suportados

O cache de prompt é atualmente suportado em:
- Claude Opus 4.5
- Claude Opus 4.1
- Claude Opus 4
- Claude Sonnet 4.5
- Claude Sonnet 4
- Claude Sonnet 3.7 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations))
- Claude Haiku 4.5
- Claude Haiku 3.5
- Claude Haiku 3
- Claude Opus 3 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations))

### Estruturando seu prompt

Coloque conteúdo estático (definições de ferramentas, instruções do sistema, contexto, exemplos) no início do seu prompt. Marque o final do conteúdo reutilizável para cache usando o parâmetro `cache_control`.

Os prefixos de cache são criados na seguinte ordem: `tools`, `system`, depois `messages`. Esta ordem forma uma hierarquia onde cada nível se baseia nos anteriores.

#### Como funciona a verificação automática de prefixo

Você pode usar apenas um ponto de interrupção de cache no final do seu conteúdo estático, e o sistema encontrará automaticamente a sequência mais longa de blocos em cache correspondentes. Entender como isso funciona ajuda você a otimizar sua estratégia de cache.

**Três princípios principais:**

1. **As chaves de cache são cumulativas**: Quando você armazena explicitamente um bloco em cache com `cache_control`, a chave de hash do cache é gerada fazendo hash de todos os blocos anteriores na conversa sequencialmente. Isso significa que o cache para cada bloco depende de todo o conteúdo que veio antes dele.

2. **Verificação sequencial para trás**: O sistema verifica se há acertos de cache trabalhando para trás a partir do seu ponto de interrupção explícito, verificando cada bloco anterior em ordem reversa. Isso garante que você obtenha o acerto de cache mais longo possível.

3. **Janela de lookback de 20 blocos**: O sistema verifica apenas até 20 blocos antes de cada ponto de interrupção `cache_control` explícito. Após verificar 20 blocos sem uma correspondência, ele para de verificar e passa para o próximo ponto de interrupção explícito (se houver).

**Exemplo: Entendendo a janela de lookback**

Considere uma conversa com 30 blocos de conteúdo onde você define `cache_control` apenas no bloco 30:

- **Se você enviar o bloco 31 sem alterações nos blocos anteriores**: O sistema verifica o bloco 30 (correspondência!). Você obtém um acerto de cache no bloco 30, e apenas o bloco 31 precisa de processamento.

- **Se você modificar o bloco 25 e enviar o bloco 31**: O sistema verifica para trás do bloco 30 → 29 → 28... → 25 (sem correspondência) → 24 (correspondência!). Como o bloco 24 não foi alterado, você obtém um acerto de cache no bloco 24, e apenas os blocos 25-30 precisam ser reprocessados.

- **Se você modificar o bloco 5 e enviar o bloco 31**: O sistema verifica para trás do bloco 30 → 29 → 28... → 11 (verificação #20). Após 20 verificações sem encontrar uma correspondência, ele para de procurar. Como o bloco 5 está além da janela de 20 blocos, nenhum acerto de cache ocorre e todos os blocos precisam ser reprocessados. No entanto, se você tivesse definido um ponto de interrupção `cache_control` explícito no bloco 5, o sistema continuaria verificando a partir desse ponto de interrupção: bloco 5 (sem correspondência) → bloco 4 (correspondência!). Isso permite um acerto de cache no bloco 4, demonstrando por que você deve colocar pontos de interrupção antes do conteúdo editável.

**Conclusão principal**: Sempre defina um ponto de interrupção de cache explícito no final da sua conversa para maximizar suas chances de acertos de cache. Além disso, defina pontos de interrupção logo antes dos blocos de conteúdo que podem ser editáveis para garantir que essas seções possam ser armazenadas em cache independentemente.

#### Quando usar múltiplos pontos de interrupção

Você pode definir até 4 pontos de interrupção de cache se quiser:
- Armazenar em cache diferentes seções que mudam em frequências diferentes (por exemplo, ferramentas raramente mudam, mas o contexto é atualizado diariamente)
- Ter mais controle sobre exatamente o que é armazenado em cache
- Garantir cache para conteúdo mais de 20 blocos antes do seu ponto de interrupção final
- Colocar pontos de interrupção antes do conteúdo editável para garantir acertos de cache mesmo quando ocorrem alterações além da janela de 20 blocos

<Note>
**Limitação importante**: Se seu prompt tiver mais de 20 blocos de conteúdo antes do seu ponto de interrupção de cache, e você modificar conteúdo anterior a esses 20 blocos, você não obterá um acerto de cache a menos que adicione pontos de interrupção explícitos adicionais mais próximos a esse conteúdo.
</Note>

### Limitações de cache
O comprimento mínimo de prompt armazenável em cache é:
- 4096 tokens para Claude Opus 4.5
- 1024 tokens para Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4.5, Claude Sonnet 4, Claude Sonnet 3.7 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations)) e Claude Opus 3 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations))
- 4096 tokens para Claude Haiku 4.5
- 2048 tokens para Claude Haiku 3.5 e Claude Haiku 3

Prompts mais curtos não podem ser armazenados em cache, mesmo se marcados com `cache_control`. Qualquer solicitação para armazenar em cache menos do que este número de tokens será processada sem cache. Para ver se um prompt foi armazenado em cache, consulte os [campos](/docs/pt-BR/build-with-claude/prompt-caching#tracking-cache-performance) de uso da resposta.

Para solicitações simultâneas, observe que uma entrada de cache só fica disponível após o início da primeira resposta. Se você precisar de acertos de cache para solicitações paralelas, aguarde a primeira resposta antes de enviar solicitações subsequentes.

Atualmente, "ephemeral" é o único tipo de cache suportado, que por padrão tem um tempo de vida de 5 minutos.

### Entendendo os custos do ponto de interrupção de cache

**Os pontos de interrupção de cache em si não adicionam nenhum custo.** Você é cobrado apenas por:
- **Escritas de cache**: Quando novo conteúdo é escrito no cache (25% mais do que tokens de entrada base para TTL de 5 minutos)
- **Leituras de cache**: Quando conteúdo em cache é usado (10% do preço de token de entrada base)
- **Tokens de entrada regulares**: Para qualquer conteúdo não armazenado em cache

Adicionar mais pontos de interrupção `cache_control` não aumenta seus custos - você ainda paga a mesma quantidade com base no que é realmente armazenado em cache e lido. Os pontos de interrupção simplesmente lhe dão controle sobre quais seções podem ser armazenadas em cache independentemente.

### O que pode ser armazenado em cache
A maioria dos blocos na solicitação pode ser designada para cache com `cache_control`. Isso inclui:

- Ferramentas: Definições de ferramentas no array `tools`
- Mensagens do sistema: Blocos de conteúdo no array `system`
- Mensagens de texto: Blocos de conteúdo no array `messages.content`, para turnos de usuário e assistente
- Imagens e documentos: Blocos de conteúdo no array `messages.content`, em turnos de usuário
- Uso de ferramentas e resultados de ferramentas: Blocos de conteúdo no array `messages.content`, em turnos de usuário e assistente

Cada um desses elementos pode ser marcado com `cache_control` para ativar o cache para essa parte da solicitação.

### O que não pode ser armazenado em cache
Embora a maioria dos blocos de solicitação possa ser armazenada em cache, existem algumas exceções:

- Blocos de pensamento não podem ser armazenados em cache diretamente com `cache_control`. No entanto, blocos de pensamento PODEM ser armazenados em cache junto com outro conteúdo quando aparecem em turnos de assistente anteriores. Quando armazenados em cache desta forma, eles CONTAM como tokens de entrada quando lidos do cache.
- Blocos de sub-conteúdo (como [citações](/docs/pt-BR/build-with-claude/citations)) em si não podem ser armazenados em cache diretamente. Em vez disso, armazene em cache o bloco de nível superior.

    No caso de citações, os blocos de conteúdo de documento de nível superior que servem como material de origem para citações podem ser armazenados em cache. Isso permite que você use cache de prompt com citações efetivamente armazenando em cache os documentos que as citações referenciarem.
- Blocos de texto vazios não podem ser armazenados em cache.

### O que invalida o cache

Modificações no conteúdo em cache podem invalidar parte ou todo o cache.

Conforme descrito em [Estruturando seu prompt](#structuring-your-prompt), o cache segue a hierarquia: `tools` → `system` → `messages`. Alterações em cada nível invalidam esse nível e todos os níveis subsequentes.

A tabela a seguir mostra quais partes do cache são invalidadas por diferentes tipos de alterações. ✘ indica que o cache é invalidado, enquanto ✓ indica que o cache permanece válido.

| O que muda | Cache de ferramentas | Cache do sistema | Cache de mensagens | Impacto |
|------------|------------------|---------------|----------------|-------------|
| **Definições de ferramentas** | ✘ | ✘ | ✘ | Modificar definições de ferramentas (nomes, descrições, parâmetros) invalida todo o cache |
| **Alternância de pesquisa na web** | ✓ | ✘ | ✘ | Ativar/desativar pesquisa na web modifica o prompt do sistema |
| **Alternância de citações** | ✓ | ✘ | ✘ | Ativar/desativar citações modifica o prompt do sistema |
| **Escolha de ferramenta** | ✓ | ✓ | ✘ | Alterações no parâmetro `tool_choice` afetam apenas blocos de mensagem |
| **Imagens** | ✓ | ✓ | ✘ | Adicionar/remover imagens em qualquer lugar no prompt afeta blocos de mensagem |
| **Parâmetros de pensamento** | ✓ | ✓ | ✘ | Alterações nas configurações de pensamento estendido (ativar/desativar, orçamento) afetam blocos de mensagem |
| **Resultados não-ferramenta passados para solicitações de pensamento estendido** | ✓ | ✓ | ✘ | Quando resultados não-ferramenta são passados em solicitações enquanto o pensamento estendido está ativado, todos os blocos de pensamento previamente em cache são removidos do contexto, e quaisquer mensagens no contexto que seguem esses blocos de pensamento são removidas do cache. Para mais detalhes, consulte [Cache com blocos de pensamento](#caching-with-thinking-blocks). |

### Rastreando o desempenho do cache

Monitore o desempenho do cache usando esses campos de resposta da API, dentro de `usage` na resposta (ou evento `message_start` se [streaming](/docs/pt-BR/build-with-claude/streaming)):

- `cache_creation_input_tokens`: Número de tokens escritos no cache ao criar uma nova entrada.
- `cache_read_input_tokens`: Número de tokens recuperados do cache para esta solicitação.
- `input_tokens`: Número de tokens de entrada que não foram lidos ou usados para criar um cache (ou seja, tokens após o último ponto de interrupção de cache).

<Note>
**Entendendo a divisão de tokens**

O campo `input_tokens` representa apenas os tokens que vêm **após o último ponto de interrupção de cache** em sua solicitação - não todos os tokens de entrada que você enviou.

Para calcular o total de tokens de entrada:
```
total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
```

**Explicação espacial:**
- `cache_read_input_tokens` = tokens antes do ponto de interrupção já em cache (leituras)
- `cache_creation_input_tokens` = tokens antes do ponto de interrupção sendo armazenados em cache agora (escritas)
- `input_tokens` = tokens após seu último ponto de interrupção (não elegíveis para cache)

**Exemplo:** Se você tiver uma solicitação com 100.000 tokens de conteúdo em cache (lido do cache), 0 tokens de novo conteúdo sendo armazenado em cache e 50 tokens em sua mensagem de usuário (após o ponto de interrupção de cache):
- `cache_read_input_tokens`: 100.000
- `cache_creation_input_tokens`: 0
- `input_tokens`: 50
- **Total de tokens de entrada processados**: 100.050 tokens

Isso é importante para entender tanto custos quanto limites de taxa, pois `input_tokens` será tipicamente muito menor do que seu total de entrada ao usar cache efetivamente.
</Note>

### Melhores práticas para cache efetivo

Para otimizar o desempenho do cache de prompt:

- Armazene em cache conteúdo estável e reutilizável como instruções do sistema, informações de fundo, contextos grandes ou definições de ferramentas frequentes.
- Coloque conteúdo em cache no início do prompt para melhor desempenho.
- Use pontos de interrupção de cache estrategicamente para separar diferentes seções de prefixo armazenável em cache.
- Defina pontos de interrupção de cache no final de conversas e logo antes do conteúdo editável para maximizar taxas de acerto de cache, especialmente ao trabalhar com prompts que têm mais de 20 blocos de conteúdo.
- Analise regularmente as taxas de acerto de cache e ajuste sua estratégia conforme necessário.

### Otimizando para diferentes casos de uso

Adapte sua estratégia de cache de prompt ao seu cenário:

- Agentes conversacionais: Reduza custo e latência para conversas estendidas, especialmente aquelas com instruções longas ou documentos carregados.
- Assistentes de codificação: Melhore o preenchimento automático e perguntas sobre base de código mantendo seções relevantes ou uma versão resumida da base de código no prompt.
- Processamento de documentos grandes: Incorpore material completo de longa forma incluindo imagens em seu prompt sem aumentar a latência de resposta.
- Conjuntos de instruções detalhadas: Compartilhe listas extensas de instruções, procedimentos e exemplos para ajustar as respostas do Claude. Os desenvolvedores frequentemente incluem um ou dois exemplos no prompt, mas com cache de prompt você pode obter desempenho ainda melhor incluindo 20+ exemplos diversos de respostas de alta qualidade.
- Uso de ferramentas agêntico: Melhore o desempenho para cenários envolvendo múltiplas chamadas de ferramenta e alterações de código iterativas, onde cada etapa normalmente requer uma nova chamada de API.
- Converse com livros, artigos, documentação, transcrições de podcasts e outro conteúdo de longa forma: Traga qualquer base de conhecimento à vida incorporando o(s) documento(s) inteiro(s) no prompt e deixando os usuários fazerem perguntas a ele.

### Resolvendo problemas comuns

Se experimentar comportamento inesperado:

- Certifique-se de que as seções em cache são idênticas e marcadas com cache_control nos mesmos locais em todas as chamadas
- Verifique se as chamadas são feitas dentro do tempo de vida do cache (5 minutos por padrão)
- Verifique se `tool_choice` e o uso de imagem permanecem consistentes entre chamadas
- Valide que você está armazenando em cache pelo menos o número mínimo de tokens
- O sistema verifica automaticamente acertos de cache em limites de blocos de conteúdo anteriores (até ~20 blocos antes do seu ponto de interrupção). Para prompts com mais de 20 blocos de conteúdo, você pode precisar de parâmetros `cache_control` adicionais no início do prompt para garantir que todo o conteúdo possa ser armazenado em cache
- Verifique se as chaves em seus blocos de conteúdo `tool_use` têm ordenação estável, pois algumas linguagens (por exemplo, Swift, Go) randomizam a ordem das chaves durante a conversão JSON, quebrando caches

<Note>
Alterações em `tool_choice` ou a presença/ausência de imagens em qualquer lugar no prompt invalidarão o cache, exigindo que uma nova entrada de cache seja criada. Para mais detalhes sobre invalidação de cache, consulte [O que invalida o cache](#what-invalidates-the-cache).
</Note>

### Cache com blocos de pensamento

Ao usar [pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking) com cache de prompt, blocos de pensamento têm comportamento especial:

**Cache automático junto com outro conteúdo**: Embora blocos de pensamento não possam ser explicitamente marcados com `cache_control`, eles são armazenados em cache como parte do conteúdo da solicitação quando você faz chamadas de API subsequentes com resultados de ferramentas. Isso ocorre comumente durante o uso de ferramentas quando você passa blocos de pensamento de volta para continuar a conversa.

**Contagem de tokens de entrada**: Quando blocos de pensamento são lidos do cache, eles contam como tokens de entrada em suas métricas de uso. Isso é importante para cálculo de custo e orçamento de tokens.

**Padrões de invalidação de cache**:
- O cache permanece válido quando apenas resultados de ferramentas são fornecidos como mensagens de usuário
- O cache é invalidado quando conteúdo de usuário não-resultado-de-ferramenta é adicionado, causando que todos os blocos de pensamento anteriores sejam removidos
- Este comportamento de cache ocorre mesmo sem marcadores `cache_control` explícitos

Para mais detalhes sobre invalidação de cache, consulte [O que invalida o cache](#what-invalidates-the-cache).

**Exemplo com uso de ferramentas**:
```
Request 1: User: "What's the weather in Paris?"
Response: [thinking_block_1] + [tool_use block 1]

Request 2:
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True]
Response: [thinking_block_2] + [text block 2]
# Request 2 caches its request content (not the response)
# The cache includes: user message, thinking_block_1, tool_use block 1, and tool_result_1

Request 3:
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
# Non-tool-result user block causes all thinking blocks to be ignored
# This request is processed as if thinking blocks were never present
```

Quando um bloco de usuário não-resultado-de-ferramenta é incluído, ele designa um novo loop de assistente e todos os blocos de pensamento anteriores são removidos do contexto.

Para informações mais detalhadas, consulte a [documentação de pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking#understanding-thinking-block-caching-behavior).

---
## Armazenamento e compartilhamento de cache

- **Isolamento de organização**: Os caches são isolados entre organizações. Diferentes organizações nunca compartilham caches, mesmo que usem prompts idênticos.

- **Correspondência exata**: Acertos de cache requerem segmentos de prompt 100% idênticos, incluindo todo o texto e imagens até e incluindo o bloco marcado com controle de cache.

- **Geração de token de saída**: O cache de prompt não tem efeito na geração de token de saída. A resposta que você recebe será idêntica ao que você obteria se o cache de prompt não fosse usado.

---
## Duração de cache de 1 hora

Se você achar que 5 minutos é muito curto, a Anthropic também oferece uma duração de cache de 1 hora [com custo adicional](#pricing).

Para usar o cache estendido, inclua `ttl` na definição `cache_control` assim:
```json
"cache_control": {
    "type": "ephemeral",
    "ttl": "5m" | "1h"
}
```

A resposta incluirá informações detalhadas de cache como a seguinte:
```json
{
    "usage": {
        "input_tokens": ...,
        "cache_read_input_tokens": ...,
        "cache_creation_input_tokens": ...,
        "output_tokens": ...,

        "cache_creation": {
            "ephemeral_5m_input_tokens": 456,
            "ephemeral_1h_input_tokens": 100,
        }
    }
}
```

Observe que o campo `cache_creation_input_tokens` atual é igual à soma dos valores no objeto `cache_creation`.

### Quando usar o cache de 1 hora

Se você tiver prompts que são usados em uma cadência regular (ou seja, prompts do sistema que são usados com mais frequência do que a cada 5 minutos), continue usando o cache de 5 minutos, pois isso continuará sendo atualizado sem custo adicional.

O cache de 1 hora é melhor usado nos seguintes cenários:
- Quando você tem prompts que provavelmente são usados com menos frequência do que 5 minutos, mas mais frequentemente do que a cada hora. Por exemplo, quando um agente lateral agêntico levará mais de 5 minutos, ou ao armazenar uma conversa de chat longa com um usuário e você geralmente espera que esse usuário possa não responder nos próximos 5 minutos.
- Quando a latência é importante e seus prompts de acompanhamento podem ser enviados além de 5 minutos.
- Quando você quer melhorar sua utilização de limite de taxa, pois acertos de cache não são deduzidos do seu limite de taxa.

<Note>
O cache de 5 minutos e 1 hora se comportam da mesma forma com relação à latência. Você geralmente verá tempo-para-primeiro-token melhorado para documentos longos.
</Note>

### Misturando diferentes TTLs

Você pode usar controles de cache de 1 hora e 5 minutos na mesma solicitação, mas com uma restrição importante: Entradas de cache com TTL mais longo devem aparecer antes de TTLs mais curtos (ou seja, uma entrada de cache de 1 hora deve aparecer antes de qualquer entrada de cache de 5 minutos).

Ao misturar TTLs, determinamos três locais de cobrança em seu prompt:
1. Posição `A`: A contagem de tokens no acerto de cache mais alto (ou 0 se nenhum acerto).
2. Posição `B`: A contagem de tokens no bloco `cache_control` de 1 hora mais alto após `A` (ou igual a `A` se nenhum existir).
3. Posição `C`: A contagem de tokens no último bloco `cache_control`.

<Note>
Se `B` e/ou `C` forem maiores que `A`, eles serão necessariamente acertos de cache perdidos, porque `A` é o acerto de cache mais alto.
</Note>

Você será cobrado por:
1. Tokens de leitura de cache para `A`.
2. Tokens de escrita de cache de 1 hora para `(B - A)`.
3. Tokens de escrita de cache de 5 minutos para `(C - B)`.

Aqui estão 3 exemplos. Isso mostra os tokens de entrada de 3 solicitações, cada uma com diferentes acertos de cache e acertos de cache perdidos. Cada uma tem uma cobrança calculada diferente, mostrada nas caixas coloridas, como resultado.
![Diagrama de mistura de TTLs](/docs/images/prompt-cache-mixed-ttl.svg)

---

## Exemplos de cache de prompt

Para ajudá-lo a começar com o cache de prompt, preparamos um [livro de receitas de cache de prompt](https://github.com/anthropics/anthropic-cookbook/blob/main/misc/prompt_caching.ipynb) com exemplos detalhados e melhores práticas.

Abaixo, incluímos vários trechos de código que demonstram vários padrões de cache de prompt. Estes exemplos demonstram como implementar o cache em diferentes cenários, ajudando você a entender as aplicações práticas deste recurso:

<section title="Exemplo de cache de contexto grande">

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing legal documents."
    },
    {
        "type": "text",
        "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
        "cache_control": {"type": "ephemeral"}
    }
  ],
  messages: [
    {
        "role": "user",
        "content": "What are the key terms and conditions in this agreement?"
    }
  ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class LegalDocumentAnalysisExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing legal documents.")
                                .build(),
                        TextBlockParam.builder()
                                .text("Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("What are the key terms and conditions in this agreement?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>
Este exemplo demonstra o uso básico do cache de prompt, armazenando em cache o texto completo do contrato legal como um prefixo enquanto mantém a instrução do usuário sem cache.

Para a primeira solicitação:
- `input_tokens`: Número de tokens apenas na mensagem do usuário
- `cache_creation_input_tokens`: Número de tokens em toda a mensagem do sistema, incluindo o documento legal
- `cache_read_input_tokens`: 0 (sem acerto de cache na primeira solicitação)

Para solicitações subsequentes dentro do tempo de vida do cache:
- `input_tokens`: Número de tokens apenas na mensagem do usuário
- `cache_creation_input_tokens`: 0 (sem nova criação de cache)
- `cache_read_input_tokens`: Número de tokens em toda a mensagem do sistema em cache

</section>
<section title="Cache de definições de ferramentas">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
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
                        "description": "The unit of temperature, either celsius or fahrenheit"
                    }
                },
                "required": ["location"]
            }
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What is the weather and time in New York?"
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
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
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"]
            },
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
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
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"]
            },
        },
        // many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages: [
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;

public class ToolsWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Weather tool schema
        InputSchema weatherSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of(
                                "type", "string",
                                "description", "The city and state, e.g. San Francisco, CA"
                        ),
                        "unit", Map.of(
                                "type", "string",
                                "enum", List.of("celsius", "fahrenheit"),
                                "description", "The unit of temperature, either celsius or fahrenheit"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        // Time tool schema
        InputSchema timeSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "timezone", Map.of(
                                "type", "string",
                                "description", "The IANA time zone name, e.g. America/Los_Angeles"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addTool(Tool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(weatherSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_time")
                        .description("Get the current time in a given time zone")
                        .inputSchema(timeSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                .addUserMessage("What is the weather and time in New York?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

Neste exemplo, demonstramos o cache de definições de ferramentas.

O parâmetro `cache_control` é colocado na ferramenta final (`get_time`) para designar todas as ferramentas como parte do prefixo estático.

Isso significa que todas as definições de ferramentas, incluindo `get_weather` e qualquer outra ferramenta definida antes de `get_time`, serão armazenadas em cache como um único prefixo.

Esta abordagem é útil quando você tem um conjunto consistente de ferramentas que deseja reutilizar em várias solicitações sem reprocessá-las cada vez.

Para a primeira solicitação:
- `input_tokens`: Número de tokens na mensagem do usuário
- `cache_creation_input_tokens`: Número de tokens em todas as definições de ferramentas e prompt do sistema
- `cache_read_input_tokens`: 0 (sem acerto de cache na primeira solicitação)

Para solicitações subsequentes dentro do tempo de vida do cache:
- `input_tokens`: Número de tokens na mensagem do usuário
- `cache_creation_input_tokens`: 0 (sem nova criação de cache)
- `cache_read_input_tokens`: Número de tokens em todas as definições de ferramentas em cache e prompt do sistema

</section>

<section title="Continuando uma conversa com múltiplos turnos">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        # ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        // ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class ConversationWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Create ephemeral system prompt
        TextBlockParam systemPrompt = TextBlockParam.builder()
                .text("...long system prompt")
                .cacheControl(CacheControlEphemeral.builder().build())
                .build();

        // Create message params
        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(systemPrompt))
                // First user message (without cache control)
                .addUserMessage("Hello, can you tell me more about the solar system?")
                // Assistant response
                .addAssistantMessage("Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?")
                // Second user message (with cache control)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Good to know.")
                                .build()),
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Tell me more about Mars.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

Neste exemplo, demonstramos como usar o cache de prompt em uma conversa com múltiplos turnos.

Durante cada turno, marcamos o bloco final da mensagem final com `cache_control` para que a conversa possa ser armazenada em cache incrementalmente. O sistema verificará automaticamente e usará a sequência mais longa de blocos em cache previamente para mensagens de acompanhamento. Ou seja, blocos que foram marcados anteriormente com um bloco `cache_control` não são marcados posteriormente, mas ainda serão considerados um acerto de cache (e também uma atualização de cache!) se forem atingidos dentro de 5 minutos.

Além disso, observe que o parâmetro `cache_control` é colocado na mensagem do sistema. Isso é para garantir que, se isso for removido do cache (após não ser usado por mais de 5 minutos), ele será adicionado novamente ao cache na próxima solicitação.

Esta abordagem é útil para manter o contexto em conversas contínuas sem reprocessar repetidamente as mesmas informações.

Quando isso é configurado corretamente, você deve ver o seguinte na resposta de uso de cada solicitação:
- `input_tokens`: Número de tokens na nova mensagem do usuário (será mínimo)
- `cache_creation_input_tokens`: Número de tokens nos novos turnos do assistente e do usuário
- `cache_read_input_tokens`: Número de tokens na conversa até o turno anterior

</section>

<section title="Juntando tudo: Múltiplos pontos de interrupção de cache">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "system": [
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    system=[
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools: [
        {
            name: "search_documents",
            description: "Search through the knowledge base",
            input_schema: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search query"
                    }
                },
                required: ["query"]
            }
        },
        {
            name: "get_document",
            description: "Retrieve a specific document by ID",
            input_schema: {
                type: "object",
                properties: {
                    doc_id: {
                        type: "string",
                        description: "Document ID"
                    }
                },
                required: ["doc_id"]
            },
            cache_control: { type: "ephemeral" }
        }
    ],
    system: [
        {
            type: "text",
            text: "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            cache_control: { type: "ephemeral" }
        },
        {
            type: "text",
            text: "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            cache_control: { type: "ephemeral" }
        }
    ],
    messages: [
        {
            role: "user",
            content: "Can you search for information about Mars rovers?"
        },
        {
            role: "assistant",
            content: [
                {
                    type: "tool_use",
                    id: "tool_1",
                    name: "search_documents",
                    input: { query: "Mars rovers" }
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "tool_result",
                    tool_use_id: "tool_1",
                    content: "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Yes, please tell me about the Perseverance rover specifically.",
                    cache_control: { type: "ephemeral" }
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlockParam;

public class MultipleCacheBreakpointsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Search tool schema
        InputSchema searchSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "query", Map.of(
                                "type", "string",
                                "description", "Search query"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("query")))
                .build();

        // Get document tool schema
        InputSchema getDocSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "doc_id", Map.of(
                                "type", "string",
                                "description", "Document ID"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("doc_id")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                // Tools with cache control on the last one
                .addTool(Tool.builder()
                        .name("search_documents")
                        .description("Search through the knowledge base")
                        .inputSchema(searchSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_document")
                        .description("Retrieve a specific document by ID")
                        .inputSchema(getDocSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                // System prompts with cache control on instructions and context separately
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build(),
                        TextBlockParam.builder()
                                .text("# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                // Conversation history
                .addUserMessage("Can you search for information about Mars rovers?")
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                .id("tool_1")
                                .name("search_documents")
                                .input(JsonValue.from(Map.of("query", "Mars rovers")))
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                .toolUseId("tool_1")
                                .content("Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)")
                                .build())
                ))
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document.")
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Yes, please tell me about the Perseverance rover specifically.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

Este exemplo abrangente demonstra como usar todos os 4 pontos de interrupção de cache disponíveis para otimizar diferentes partes do seu prompt:

1. **Cache de ferramentas** (ponto de interrupção de cache 1): O parâmetro `cache_control` na última definição de ferramenta armazena em cache todas as definições de ferramentas.

2. **Cache de instruções reutilizáveis** (ponto de interrupção de cache 2): As instruções estáticas no prompt do sistema são armazenadas em cache separadamente. Essas instruções raramente mudam entre solicitações.

3. **Cache de contexto RAG** (ponto de interrupção de cache 3): Os documentos da base de conhecimento são armazenados em cache independentemente, permitindo que você atualize os documentos RAG sem invalidar o cache de ferramentas ou instruções.

4. **Cache de histórico de conversa** (ponto de interrupção de cache 4): A resposta do assistente é marcada com `cache_control` para permitir o cache incremental da conversa conforme ela progride.

Esta abordagem oferece máxima flexibilidade:
- Se você apenas atualizar a mensagem final do usuário, todos os quatro segmentos de cache serão reutilizados
- Se você atualizar os documentos RAG mas mantiver as mesmas ferramentas e instruções, os dois primeiros segmentos de cache serão reutilizados
- Se você alterar a conversa mas mantiver as mesmas ferramentas, instruções e documentos, os três primeiros segmentos serão reutilizados
- Cada ponto de interrupção de cache pode ser invalidado independentemente com base no que muda em sua aplicação

Para a primeira solicitação:
- `input_tokens`: Tokens na mensagem final do usuário
- `cache_creation_input_tokens`: Tokens em todos os segmentos em cache (ferramentas + instruções + documentos RAG + histórico de conversa)
- `cache_read_input_tokens`: 0 (sem acertos de cache)

Para solicitações subsequentes com apenas uma nova mensagem do usuário:
- `input_tokens`: Tokens apenas na nova mensagem do usuário
- `cache_creation_input_tokens`: Qualquer novo token adicionado ao histórico de conversa
- `cache_read_input_tokens`: Todos os tokens em cache anteriormente (ferramentas + instruções + documentos RAG + conversa anterior)

Este padrão é especialmente poderoso para:
- Aplicações RAG com contextos de documentos grandes
- Sistemas de agentes que usam múltiplas ferramentas
- Conversas de longa duração que precisam manter contexto
- Aplicações que precisam otimizar diferentes partes do prompt independentemente

</section>

---
## Perguntas Frequentes

  <section title="Preciso de múltiplos pontos de interrupção de cache ou um no final é suficiente?">

    **Na maioria dos casos, um único ponto de interrupção de cache no final do seu conteúdo estático é suficiente.** O sistema verifica automaticamente acertos de cache em todos os limites de blocos de conteúdo anteriores (até 20 blocos antes do seu ponto de interrupção) e usa a sequência mais longa de blocos em cache correspondente.

    Você só precisa de múltiplos pontos de interrupção se:
    - Você tiver mais de 20 blocos de conteúdo antes do seu ponto de cache desejado
    - Você quiser armazenar em cache seções que são atualizadas em frequências diferentes independentemente
    - Você precisar de controle explícito sobre o que é armazenado em cache para otimização de custos

    Exemplo: Se você tiver instruções do sistema (raramente mudam) e contexto RAG (muda diariamente), você pode usar dois pontos de interrupção para armazená-los em cache separadamente.
  
</section>

  <section title="Os pontos de interrupção de cache adicionam custo extra?">

    Não, os pontos de interrupção de cache em si são gratuitos. Você só paga por:
    - Escrever conteúdo no cache (25% mais que tokens de entrada base para TTL de 5 minutos)
    - Ler do cache (10% do preço do token de entrada base)
    - Tokens de entrada regulares para conteúdo não armazenado em cache

    O número de pontos de interrupção não afeta o preço - apenas a quantidade de conteúdo armazenado em cache e lido importa.
  
</section>

  <section title="Como calculo o total de tokens de entrada dos campos de uso?">

    A resposta de uso inclui três campos separados de tokens de entrada que juntos representam sua entrada total:

    ```
    total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
    ```

    - `cache_read_input_tokens`: Tokens recuperados do cache (tudo antes dos pontos de interrupção de cache que foi armazenado em cache)
    - `cache_creation_input_tokens`: Novos tokens sendo escritos no cache (nos pontos de interrupção de cache)
    - `input_tokens`: Tokens **após o último ponto de interrupção de cache** que não são armazenados em cache

    **Importante:** `input_tokens` NÃO representa todos os tokens de entrada - apenas a porção após seu último ponto de interrupção de cache. Se você tiver conteúdo em cache, `input_tokens` será tipicamente muito menor que sua entrada total.

    **Exemplo:** Com um documento de 200K tokens em cache e uma pergunta do usuário de 50 tokens:
    - `cache_read_input_tokens`: 200.000
    - `cache_creation_input_tokens`: 0
    - `input_tokens`: 50
    - **Total**: 200.050 tokens

    Este detalhamento é crítico para entender tanto seus custos quanto o uso do limite de taxa. Veja [Rastreando o desempenho do cache](#tracking-cache-performance) para mais detalhes.
  
</section>

  <section title="Qual é o tempo de vida do cache?">

    O tempo de vida padrão mínimo (TTL) do cache é 5 minutos. Este tempo de vida é atualizado cada vez que o conteúdo em cache é usado.

    Se você achar que 5 minutos é muito curto, Anthropic também oferece um [TTL de cache de 1 hora](#1-hour-cache-duration).
  
</section>

  <section title="Quantos pontos de interrupção de cache posso usar?">

    Você pode definir até 4 pontos de interrupção de cache (usando parâmetros `cache_control`) em seu prompt.
  
</section>

  <section title="O cache de prompt está disponível para todos os modelos?">

    Não, o cache de prompt está disponível atualmente apenas para Claude Opus 4.5, Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4.5, Claude Sonnet 4, Claude Sonnet 3.7 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations)), Claude Haiku 4.5, Claude Haiku 3.5, Claude Haiku 3 e Claude Opus 3 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations)).
  
</section>

  <section title="Como o cache de prompt funciona com pensamento estendido?">

    Prompts do sistema em cache e ferramentas serão reutilizados quando os parâmetros de pensamento mudam. No entanto, mudanças de pensamento (ativar/desativar ou mudanças de orçamento) invalidarão prefixos de prompt em cache anteriormente com conteúdo de mensagens.

    Para mais detalhes sobre invalidação de cache, veja [O que invalida o cache](#what-invalidates-the-cache).

    Para mais sobre pensamento estendido, incluindo sua interação com uso de ferramentas e cache de prompt, veja a [documentação de pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking#extended-thinking-and-prompt-caching).
  
</section>

  <section title="Como habilito o cache de prompt?">

    Para habilitar o cache de prompt, inclua pelo menos um ponto de interrupção `cache_control` em sua solicitação de API.
  
</section>

  <section title="Posso usar cache de prompt com outros recursos de API?">

    Sim, o cache de prompt pode ser usado junto com outros recursos de API como uso de ferramentas e capacidades de visão. No entanto, alterar se há imagens em um prompt ou modificar configurações de uso de ferramentas quebrará o cache.

    Para mais detalhes sobre invalidação de cache, veja [O que invalida o cache](#what-invalidates-the-cache).
  
</section>

  <section title="Como o cache de prompt afeta o preço?">

    O cache de prompt introduz uma nova estrutura de preço onde as gravações em cache custam 25% mais que tokens de entrada base, enquanto os acertos de cache custam apenas 10% do preço do token de entrada base.
  
</section>

  <section title="Posso limpar manualmente o cache?">

    Atualmente, não há como limpar manualmente o cache. Os prefixos em cache expiram automaticamente após um mínimo de 5 minutos de inatividade.
  
</section>

  <section title="Como posso rastrear a eficácia da minha estratégia de cache?">

    Você pode monitorar o desempenho do cache usando os campos `cache_creation_input_tokens` e `cache_read_input_tokens` na resposta da API.
  
</section>

  <section title="O que pode quebrar o cache?">

    Veja [O que invalida o cache](#what-invalidates-the-cache) para mais detalhes sobre invalidação de cache, incluindo uma lista de mudanças que exigem a criação de uma nova entrada de cache.
  
</section>

  <section title="Como o cache de prompt lida com privacidade e separação de dados?">

O cache de prompt é projetado com fortes medidas de privacidade e separação de dados:

1. As chaves de cache são geradas usando um hash criptográfico dos prompts até o ponto de controle de cache. Isso significa que apenas solicitações com prompts idênticos podem acessar um cache específico.

2. Os caches são específicos da organização. Usuários dentro da mesma organização podem acessar o mesmo cache se usarem prompts idênticos, mas os caches não são compartilhados entre diferentes organizações, mesmo para prompts idênticos.

3. O mecanismo de cache é projetado para manter a integridade e privacidade de cada conversa ou contexto único.

4. É seguro usar `cache_control` em qualquer lugar em seus prompts. Para eficiência de custo, é melhor excluir partes altamente variáveis (por exemplo, entrada arbitrária do usuário) do cache.

Essas medidas garantem que o cache de prompt mantenha a privacidade e segurança dos dados enquanto oferece benefícios de desempenho.
  
</section>
  <section title="Posso usar cache de prompt com a API de Lotes?">

    Sim, é possível usar cache de prompt com suas solicitações da [API de Lotes](/docs/pt-BR/build-with-claude/batch-processing). No entanto, como solicitações de lote assíncronas podem ser processadas simultaneamente e em qualquer ordem, os acertos de cache são fornecidos em base de melhor esforço.

    O [cache de 1 hora](#1-hour-cache-duration) pode ajudar a melhorar seus acertos de cache. A forma mais econômica de usá-lo é a seguinte:
    - Reúna um conjunto de solicitações de mensagens que têm um prefixo compartilhado.
    - Envie uma solicitação de lote com apenas uma solicitação que tenha este prefixo compartilhado e um bloco de cache de 1 hora. Isso será gravado no cache de 1 hora.
    - Assim que isso for concluído, envie o resto das solicitações. Você terá que monitorar o trabalho para saber quando ele é concluído.

    Isso é tipicamente melhor que usar o cache de 5 minutos simplesmente porque é comum que solicitações de lote levem entre 5 minutos e 1 hora para serem concluídas. Estamos considerando maneiras de melhorar essas taxas de acerto de cache e tornar esse processo mais direto.
  
</section>
  <section title="Por que estou vendo o erro `AttributeError: 'Beta' object has no attribute 'prompt_caching'` em Python?">

  Este erro geralmente aparece quando você atualizou seu SDK ou está usando exemplos de código desatualizados. O cache de prompt agora está geralmente disponível, portanto você não precisa mais do prefixo beta. Em vez de:
    <CodeGroup>
      ```python Python
      python client.beta.prompt_caching.messages.create(...)
      ```
    </CodeGroup>
    Simplesmente use:
    <CodeGroup>
      ```python Python
      python client.messages.create(...)
      ```
    </CodeGroup>
  
</section>
  <section title="Por que estou vendo 'TypeError: Cannot read properties of undefined (reading 'messages')'?">

  Este erro geralmente aparece quando você atualizou seu SDK ou está usando exemplos de código desatualizados. O cache de prompt agora está geralmente disponível, portanto você não precisa mais do prefixo beta. Em vez de:

      ```typescript TypeScript
      client.beta.promptCaching.messages.create(...)
      ```

      Simplesmente use:

      ```typescript
      client.messages.create(...)
      ```
  
</section>