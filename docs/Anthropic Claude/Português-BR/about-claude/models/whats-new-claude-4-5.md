# O que há de novo no Claude 4.5

Conheça os três novos modelos Claude 4.5 e seus recursos, incluindo melhorias de inteligência, capacidades de agentes e novos recursos de API.

---

Claude 4.5 introduz três modelos projetados para diferentes casos de uso:

- **Claude Opus 4.5**: Nosso modelo mais inteligente combinando capacidade máxima com desempenho prático. Apresenta um ponto de preço mais acessível do que os modelos Opus anteriores. Disponível com uma janela de contexto de 200k tokens.
- **Claude Sonnet 4.5**: Nosso melhor modelo para agentes complexos e codificação, com a inteligência mais alta em a maioria das tarefas. Disponível com uma janela de contexto de 200k e 1M (beta) tokens.
- **Claude Haiku 4.5**: Nosso modelo Haiku mais rápido e mais inteligente com desempenho próximo à fronteira. Disponível com uma janela de contexto de 200k tokens.

## Principais melhorias no Opus 4.5 em relação ao Opus 4.1

### Inteligência máxima

Claude Opus 4.5 representa nosso modelo mais inteligente, combinando capacidade máxima com desempenho prático. Ele oferece melhorias significativas em raciocínio, codificação e tarefas complexas de resolução de problemas, mantendo os resultados de alta qualidade esperados da família Opus.

### Parâmetro de esforço

Claude Opus 4.5 é o único modelo que suporta o [parâmetro de esforço](/docs/pt-BR/build-with-claude/effort), permitindo que você controle quantos tokens Claude usa ao responder. Isso lhe dá a capacidade de fazer trade-offs entre a minuciosidade da resposta e a eficiência de tokens com um único modelo.

O parâmetro de esforço afeta todos os tokens na resposta, incluindo respostas de texto, chamadas de ferramentas e pensamento estendido. Você pode escolher entre:
- **Esforço alto**: Máxima minuciosidade para análise complexa e explicações detalhadas
- **Esforço médio**: Abordagem equilibrada para a maioria dos casos de uso em produção
- **Esforço baixo**: Respostas mais eficientes em tokens para automação de alto volume

### Excelência em uso de computador

Claude Opus 4.5 introduz [capacidades aprimoradas de uso de computador](/docs/pt-BR/agents-and-tools/tool-use/computer-use-tool) com uma nova ação de zoom que permite inspeção detalhada de regiões específicas da tela em resolução completa. Isso permite que Claude examine elementos de UI refinados, texto pequeno e informações visuais detalhadas que podem estar pouco claras em capturas de tela padrão.

A capacidade de zoom é particularmente valiosa para:
- Inspecionar pequenos elementos e controles de UI
- Ler letras miúdas ou texto detalhado
- Analisar interfaces complexas com informações densas
- Verificar detalhes visuais precisos antes de tomar ações

### Desempenho prático

Claude Opus 4.5 oferece inteligência de ponta a um [ponto de preço mais acessível](/docs/pt-BR/about-claude/pricing) do que os modelos Opus anteriores, tornando capacidades avançadas de IA disponíveis para uma gama mais ampla de aplicações e casos de uso.

### Preservação de blocos de pensamento

Claude Opus 4.5 [preserva automaticamente todos os blocos de pensamento anteriores](/docs/pt-BR/build-with-claude/extended-thinking#thinking-block-preservation-in-claude-opus-4-5) ao longo das conversas, mantendo continuidade de raciocínio em interações multi-turno estendidas e sessões de uso de ferramentas. Isso garante que Claude possa aproveitar efetivamente seu histórico de raciocínio completo ao trabalhar em tarefas complexas e de longa duração.

## Principais melhorias no Sonnet 4.5 em relação ao Sonnet 4

### Excelência em codificação

Claude Sonnet 4.5 é nosso melhor modelo de codificação até o momento, com melhorias significativas em todo o ciclo de vida do desenvolvimento:

- **Desempenho SWE-bench Verified**: Estado avançado da arte em benchmarks de codificação
- **Planejamento aprimorado e design de sistema**: Melhores decisões arquitetônicas e organização de código
- **Engenharia de segurança melhorada**: Práticas de segurança mais robustas e detecção de vulnerabilidades
- **Melhor seguimento de instruções**: Aderência mais precisa às especificações e requisitos de codificação

<Note>
Claude Sonnet 4.5 tem desempenho significativamente melhor em tarefas de codificação quando o [pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking) está ativado. O pensamento estendido está desativado por padrão, mas recomendamos ativá-lo para trabalho de codificação complexo. Esteja ciente de que o pensamento estendido impacta a [eficiência do cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching#caching-with-thinking-blocks). Veja o [guia de migração](/docs/pt-BR/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations) para detalhes de configuração.
</Note>

### Capacidades de agentes

Claude Sonnet 4.5 introduz avanços significativos em capacidades de agentes:

- **Operação autônoma estendida**: Sonnet 4.5 pode trabalhar independentemente por horas mantendo clareza e foco no progresso incremental. O modelo faz avanços constantes em algumas tarefas por vez em vez de tentar tudo de uma vez. Ele fornece atualizações de progresso baseadas em fatos que refletem com precisão o que foi realizado.
- **Conscientização de contexto**: Claude agora rastreia seu uso de tokens ao longo das conversas, recebendo atualizações após cada chamada de ferramenta. Essa conscientização ajuda a prevenir abandono prematuro de tarefas e permite execução mais eficaz em tarefas de longa duração. Veja [Conscientização de contexto](/docs/pt-BR/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5) para detalhes técnicos e [orientação de prompting](/docs/pt-BR/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).
- **Uso aprimorado de ferramentas**: O modelo usa mais efetivamente chamadas de ferramentas paralelas, disparando múltiplas buscas especulativas simultaneamente durante pesquisa e lendo vários arquivos de uma vez para construir contexto mais rapidamente. Coordenação melhorada entre múltiplas ferramentas e fontes de informação permite que o modelo aproveite efetivamente uma ampla gama de capacidades em fluxos de trabalho de busca e codificação agenticos.
- **Gerenciamento avançado de contexto**: Sonnet 4.5 mantém rastreamento de estado excepcional em arquivos externos, preservando orientação de objetivo entre sessões. Combinado com uso mais eficaz da janela de contexto e nossos novos recursos de API de gerenciamento de contexto, o modelo trata otimamente informações em sessões estendidas para manter coerência ao longo do tempo.

<Note>A conscientização de contexto está disponível em Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 e Opus 4.5.</Note>

### Estilo de comunicação e interação

Claude Sonnet 4.5 tem uma abordagem de comunicação refinada que é concisa, direta e natural. Ele fornece atualizações de progresso baseadas em fatos e pode pular resumos verbosos após chamadas de ferramentas para manter o momentum do fluxo de trabalho (embora isso possa ser ajustado com prompting).

Para orientação detalhada sobre como trabalhar com esse estilo de comunicação, veja [Melhores práticas do Claude 4](/docs/pt-BR/build-with-claude/prompt-engineering/claude-4-best-practices).

### Geração de conteúdo criativo

Claude Sonnet 4.5 se destaca em tarefas de conteúdo criativo:

- **Apresentações e animações**: Corresponde ou supera Claude Opus 4.1 e Opus 4.5 para criar slides e conteúdo visual
- **Toque criativo**: Produz resultado polido e profissional com forte seguimento de instruções
- **Qualidade na primeira tentativa**: Gera conteúdo utilizável e bem projetado em tentativas iniciais

## Principais melhorias no Haiku 4.5 em relação ao Haiku 3.5

Claude Haiku 4.5 representa um salto transformador para a família de modelos Haiku, trazendo capacidades de fronteira para nossa classe de modelo mais rápida:

### Inteligência próxima à fronteira com velocidade relâmpago

Claude Haiku 4.5 oferece desempenho próximo à fronteira correspondendo ao desempenho do Sonnet 4 a custo significativamente menor e velocidade mais rápida:

- **Inteligência próxima à fronteira**: Corresponde ao desempenho do Sonnet 4 em raciocínio, codificação e tarefas complexas
- **Velocidade aprimorada**: Mais do que o dobro da velocidade do Sonnet 4, com otimizações para tokens de saída por segundo (OTPS)
- **Custo-desempenho ideal**: Inteligência próxima à fronteira a um terço do custo, ideal para implantações de alto volume

### Capacidades de pensamento estendido

Claude Haiku 4.5 é o **primeiro modelo Haiku** a suportar pensamento estendido, trazendo capacidades avançadas de raciocínio para a família Haiku:

- **Raciocínio em velocidade**: Acesso ao processo de raciocínio interno do Claude para resolução de problemas complexos
- **Sumarização de pensamento**: Saída de pensamento sumarizada para implantações prontas para produção
- **Pensamento intercalado**: Pensar entre chamadas de ferramentas para fluxos de trabalho multi-etapa mais sofisticados
- **Controle de orçamento**: Configure orçamentos de tokens de pensamento para equilibrar profundidade de raciocínio com velocidade

O pensamento estendido deve ser ativado explicitamente adicionando um parâmetro `thinking` às suas solicitações de API. Veja a [documentação de pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking) para detalhes de implementação.

<Note>
Claude Haiku 4.5 tem desempenho significativamente melhor em tarefas de codificação e raciocínio quando o [pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking) está ativado. O pensamento estendido está desativado por padrão, mas recomendamos ativá-lo para resolução de problemas complexos, trabalho de codificação e raciocínio multi-etapa. Esteja ciente de que o pensamento estendido impacta a [eficiência do cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching#caching-with-thinking-blocks). Veja o [guia de migração](/docs/pt-BR/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations) para detalhes de configuração.
</Note>

<Note>Disponível em Claude Sonnet 3.7, Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 e Opus 4.5.</Note>

### Conscientização de contexto

Claude Haiku 4.5 apresenta **conscientização de contexto**, permitindo que o modelo rastreie sua janela de contexto restante ao longo de uma conversa:

- **Rastreamento de orçamento de tokens**: Claude recebe atualizações em tempo real sobre capacidade de contexto restante após cada chamada de ferramenta
- **Melhor persistência de tarefas**: O modelo pode executar tarefas mais efetivamente compreendendo espaço de trabalho disponível
- **Fluxos de trabalho de janela de contexto múltiplo**: Tratamento melhorado de transições de estado em sessões estendidas

Este é o primeiro modelo Haiku com capacidades nativas de conscientização de contexto. Para orientação de prompting, veja [Melhores práticas do Claude 4](/docs/pt-BR/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).

<Note>Disponível em Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 e Opus 4.5.</Note>

### Codificação forte e uso de ferramentas

Claude Haiku 4.5 oferece capacidades robustas de codificação esperadas de modelos Claude modernos:

- **Proficiência em codificação**: Desempenho forte em geração de código, depuração e tarefas de refatoração
- **Suporte completo a ferramentas**: Compatível com todas as ferramentas Claude 4 incluindo bash, execução de código, editor de texto, busca na web e uso de computador
- **Uso aprimorado de computador**: Otimizado para interação autônoma de desktop e fluxos de trabalho de automação de navegador
- **Execução paralela de ferramentas**: Coordenação eficiente entre múltiplas ferramentas para fluxos de trabalho complexos

Haiku 4.5 é projetado para casos de uso que exigem inteligência e eficiência:

- **Aplicações em tempo real**: Tempos de resposta rápidos para experiências de usuário interativas
- **Processamento de alto volume**: Inteligência econômica para implantações em larga escala
- **Implementações de camada gratuita**: Qualidade de modelo premium a preço acessível
- **Arquiteturas de sub-agentes**: Agentes rápidos e inteligentes para sistemas multi-agentes
- **Uso de computador em escala**: Automação econômica de desktop e navegador autônoma

## Novos recursos de API

### Chamada de ferramenta programática (Beta)

[Chamada de ferramenta programática](/docs/pt-BR/agents-and-tools/tool-use/programmatic-tool-calling) permite que Claude escreva código que chama suas ferramentas programaticamente dentro de um contêiner de execução de código, em vez de exigir viagens de ida e volta através do modelo para cada invocação de ferramenta. Isso reduz significativamente a latência para fluxos de trabalho multi-ferramenta e diminui o consumo de tokens permitindo que Claude filtre ou processe dados antes que atinjam a janela de contexto do modelo.

```python
tools=[
    {
        "type": "code_execution_20250825",
        "name": "code_execution"
    },
    {
        "name": "query_database",
        "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"]  # Enable programmatic calling
    }
]
```

Principais benefícios:
- **Latência reduzida**: Elimine viagens de ida e volta do modelo entre chamadas de ferramentas
- **Eficiência de tokens**: Processe e filtre resultados de ferramentas programaticamente antes de retornar ao Claude
- **Fluxos de trabalho complexos**: Suporte a loops, lógica condicional e processamento em lote

<Note>Disponível em Claude Opus 4.5 e Claude Sonnet 4.5. Requer [cabeçalho beta](/docs/pt-BR/api/beta-headers): `advanced-tool-use-2025-11-20`</Note>

### Ferramenta de busca de ferramentas (Beta)

A [ferramenta de busca de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/tool-search-tool) permite que Claude trabalhe com centenas ou milhares de ferramentas descobrindo e carregando-as dinamicamente sob demanda. Em vez de carregar todas as definições de ferramentas na janela de contexto antecipadamente, Claude busca seu catálogo de ferramentas e carrega apenas as ferramentas que precisa.

Duas variantes de busca estão disponíveis:
- **Regex** (`tool_search_tool_regex_20251119`): Claude constrói padrões regex para buscar nomes de ferramentas, descrições e argumentos
- **BM25** (`tool_search_tool_bm25_20251119`): Claude usa consultas em linguagem natural para buscar ferramentas

```python
tools=[
    {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
    },
    {
        "name": "get_weather",
        "description": "Get the weather at a specific location",
        "input_schema": {...},
        "defer_loading": True  # Load on-demand via search
    }
]
```

Esta abordagem resolve dois desafios críticos:
- **Eficiência de contexto**: Economize 10-20K tokens não carregando todas as definições de ferramentas antecipadamente
- **Precisão de seleção de ferramentas**: Mantenha alta precisão mesmo com 100+ ferramentas disponíveis

<Note>Disponível em Claude Opus 4.5 e Claude Sonnet 4.5. Requer [cabeçalho beta](/docs/pt-BR/api/beta-headers): `advanced-tool-use-2025-11-20`</Note>

### Parâmetro de esforço (Beta)

O [parâmetro de esforço](/docs/pt-BR/build-with-claude/effort) permite que você controle quantos tokens Claude usa ao responder, fazendo trade-offs entre minuciosidade de resposta e eficiência de tokens:

```python
response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    output_config={
        "effort": "medium"  # "low", "medium", or "high"
    }
)
```

O parâmetro de esforço afeta todos os tokens na resposta, incluindo respostas de texto, chamadas de ferramentas e pensamento estendido. Níveis de esforço mais baixos produzem respostas mais concisas com explicações mínimas, enquanto esforço mais alto fornece raciocínio detalhado e respostas abrangentes.

<Note>Disponível exclusivamente em Claude Opus 4.5. Requer [cabeçalho beta](/docs/pt-BR/api/beta-headers): `effort-2025-11-24`</Note>

### Exemplos de uso de ferramentas (Beta)

[Exemplos de uso de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples) permitem que você forneça exemplos concretos de entradas de ferramentas válidas para ajudar Claude a entender como usar suas ferramentas mais efetivamente. Isso é particularmente útil para ferramentas complexas com objetos aninhados, parâmetros opcionais ou entradas sensíveis a formato.

```python
tools=[
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {...},
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
                "location": "New York, NY"  # Demonstrates optional 'unit' parameter
            }
        ]
    }
]
```

Exemplos são incluídos no prompt junto com seu esquema de ferramenta, mostrando ao Claude padrões concretos para chamadas de ferramentas bem formadas. Cada exemplo deve ser válido de acordo com o `input_schema` da ferramenta.

<Note>Disponível em Claude Sonnet 4.5, Haiku 4.5, Opus 4.5, Opus 4.1 e Opus 4. Requer [cabeçalho beta](/docs/pt-BR/api/beta-headers): `advanced-tool-use-2025-11-20`.</Note>

### Ferramenta de memória (Beta)

A nova [ferramenta de memória](/docs/pt-BR/agents-and-tools/tool-use/memory-tool) permite que Claude armazene e recupere informações fora da janela de contexto:

```python
tools=[
    {
        "type": "memory_20250818",
        "name": "memory"
    }
]
```

Isso permite:
- Construir bases de conhecimento ao longo do tempo
- Manter estado de projeto entre sessões
- Preservar contexto efetivamente ilimitado através de armazenamento baseado em arquivo

<Note>Disponível em Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 e Opus 4.5. Requer [cabeçalho beta](/docs/pt-BR/api/beta-headers): `context-management-2025-06-27`</Note>

### Edição de contexto

Use [edição de contexto](/docs/pt-BR/build-with-claude/context-editing) para gerenciamento inteligente de contexto através de limpeza automática de chamadas de ferramentas:

```python
response = client.beta.messages.create(
    betas=["context-management-2025-06-27"],
    model="claude-sonnet-4-5",  # or claude-haiku-4-5
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {"type": "input_tokens", "value": 500},
                "keep": {"type": "tool_uses", "value": 2},
                "clear_at_least": {"type": "input_tokens", "value": 100}
            }
        ]
    },
    tools=[...]
)
```

Este recurso remove automaticamente chamadas de ferramentas e resultados mais antigos ao se aproximar dos limites de tokens, ajudando a gerenciar contexto em sessões de agentes de longa duração.

<Note>Disponível em Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 e Opus 4.5. Requer [cabeçalho beta](/docs/pt-BR/api/beta-headers): `context-management-2025-06-27`</Note>

### Razões de parada aprimoradas

Os modelos Claude 4.5 introduzem uma nova razão de parada `model_context_window_exceeded` que indica explicitamente quando a geração parou devido ao atingimento do limite da janela de contexto, em vez do limite `max_tokens` solicitado. Isso torna mais fácil lidar com limites de janela de contexto na lógica da sua aplicação.

```json
{
  "stop_reason": "model_context_window_exceeded",
  "usage": {
    "input_tokens": 150000,
    "output_tokens": 49950
  }
}
```

### Tratamento aprimorado de parâmetros de ferramentas

Os modelos Claude 4.5 incluem uma correção de bug que preserva formatação intencional em parâmetros de string de chamada de ferramenta. Anteriormente, quebras de linha finais em parâmetros de string às vezes eram incorretamente removidas. Esta correção garante que ferramentas que exigem formatação precisa (como editores de texto) recebam parâmetros exatamente como pretendido.

<Note>
Esta é uma melhoria nos bastidores sem mudanças de API necessárias. No entanto, ferramentas com parâmetros de string podem agora receber valores com quebras de linha finais que foram anteriormente removidas.
</Note>

**Exemplo:**

```json
// Antes: Quebra de linha final acidentalmente removida
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit"
  }
}

// Depois: Quebra de linha final preservada como pretendido
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit\n"
  }
}
```

### Otimizações de contagem de tokens

Os modelos Claude 4.5 incluem otimizações automáticas para melhorar o desempenho do modelo. Essas otimizações podem adicionar pequenas quantidades de tokens às solicitações, mas **você não é cobrado por esses tokens adicionados pelo sistema**.

## Recursos introduzidos no Claude 4

Os seguintes recursos foram introduzidos no Claude 4 e estão disponíveis em todos os modelos Claude 4, incluindo Claude Sonnet 4.5 e Claude Haiku 4.5.

### Nova razão de parada de recusa

Os modelos Claude 4 introduzem uma nova razão de parada `refusal` para conteúdo que o modelo se recusa a gerar por razões de segurança:

```json
{
  "id": "msg_014XEDjypDjFzgKVWdFUXxZP",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-5",
  "content": [{"type": "text", "text": "I would be happy to assist you. You can "}],
  "stop_reason": "refusal",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 564,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 22
  }
}
```

Ao usar modelos Claude 4, você deve atualizar sua aplicação para [lidar com razões de parada `refusal`](/docs/pt-BR/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals).

### Pensamento sumarizado

Com pensamento estendido ativado, a API de Mensagens para modelos Claude 4 retorna um resumo do processo de pensamento completo do Claude. O pensamento sumarizado fornece os benefícios de inteligência completa do pensamento estendido, enquanto previne uso indevido.

Enquanto a API é consistente entre modelos Claude 3.7 e 4, respostas de streaming para pensamento estendido podem retornar em um padrão de entrega "chunky", com possíveis atrasos entre eventos de streaming.

<Note>
A sumarização é processada por um modelo diferente daquele que você alvo em suas solicitações. O modelo de pensamento não vê a saída sumarizada.
</Note>

Para mais informações, veja a [documentação de pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking#summarized-thinking).

### Pensamento intercalado

Os modelos Claude 4 suportam intercalação de uso de ferramentas com pensamento estendido, permitindo conversas mais naturais onde usos de ferramentas e respostas podem ser misturados com mensagens regulares.

<Note>
O pensamento intercalado está em beta. Para ativar o pensamento intercalado, adicione o [cabeçalho beta](/docs/pt-BR/api/beta-headers) `interleaved-thinking-2025-05-14` à sua solicitação de API.
</Note>

Para mais informações, veja a [documentação de pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking#interleaved-thinking).

### Diferenças comportamentais

Os modelos Claude 4 têm mudanças comportamentais notáveis que podem afetar como você estrutura prompts:

#### Mudanças no estilo de comunicação

- **Mais conciso e direto**: Os modelos Claude 4 se comunicam mais eficientemente, com explicações menos verbosas
- **Tom mais natural**: As respostas são ligeiramente mais conversacionais e menos parecidas com máquina
- **Focado em eficiência**: Pode pular resumos detalhados após completar ações para manter o momentum do fluxo de trabalho (você pode solicitar mais detalhes se necessário)

#### Seguimento de instruções

Os modelos Claude 4 são treinados para seguimento preciso de instruções e exigem direção mais explícita:

- **Seja explícito sobre ações**: Use linguagem direta como "Faça essas mudanças" ou "Implemente esse recurso" em vez de "Você pode sugerir mudanças" se quiser que Claude tome ação
- **Declare comportamentos desejados claramente**: Claude seguirá instruções precisamente, então ser específico sobre o que você quer ajuda a alcançar melhores resultados

Para orientação abrangente sobre como trabalhar com esses modelos, veja [Melhores práticas de engenharia de prompt do Claude 4](/docs/pt-BR/build-with-claude/prompt-engineering/claude-4-best-practices).

### Ferramenta de editor de texto atualizada

A ferramenta de editor de texto foi atualizada para modelos Claude 4 com as seguintes mudanças:

- **Tipo de ferramenta**: `text_editor_20250728`
- **Nome da ferramenta**: `str_replace_based_edit_tool`
- O comando `undo_edit` não é mais suportado

<Note>
A ferramenta de editor de texto `str_replace_editor` permanece a mesma para Claude Sonnet 3.7.
</Note>

Se você está migrando do Claude Sonnet 3.7 e usando a ferramenta de editor de texto:

```python
# Claude Sonnet 3.7
tools=[
    {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
    }
]

# Modelos Claude 4
tools=[
    {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
    }
]
```

Para mais informações, veja a [documentação da ferramenta de editor de texto](/docs/pt-BR/agents-and-tools/tool-use/text-editor-tool).

### Ferramenta de execução de código atualizada

Se você está usando a ferramenta de execução de código, certifique-se de estar usando a versão mais recente `code_execution_20250825`, que adiciona comandos Bash e capacidades de manipulação de arquivos.

A versão legada `code_execution_20250522` (apenas Python) ainda está disponível mas não é recomendada para novas implementações.

Para instruções de migração, veja a [documentação da ferramenta de execução de código](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version).

## Preços e disponibilidade

### Preços

Os modelos Claude 4.5 mantêm preços competitivos:

| Modelo | Entrada | Saída |
|--------|---------|-------|
| Claude Opus 4.5 | $5 por milhão de tokens | $25 por milhão de tokens |
| Claude Sonnet 4.5 | $3 por milhão de tokens | $15 por milhão de tokens |
| Claude Haiku 4.5 | $1 por milhão de tokens | $5 por milhão de tokens |

Para mais detalhes, veja a [documentação de preços](/docs/pt-BR/about-claude/pricing).

### Preços de plataforma de terceiros

A partir dos modelos Claude 4.5 (Opus 4.5, Sonnet 4.5 e Haiku 4.5), AWS Bedrock e Google Vertex AI oferecem dois tipos de endpoints:

- **Endpoints globais**: Roteamento dinâmico para máxima disponibilidade
- **Endpoints regionais**: Roteamento de dados garantido através de regiões geográficas específicas com um **prêmio de preço de 10%**

**Este preço regional se aplica a todos os modelos Claude 4.5: Opus 4.5, Sonnet 4.5 e Haiku 4.5.**

**A Claude API (1P) é global por padrão e não é afetada por essa mudança.** A Claude API é apenas global (equivalente à oferta de endpoint global e preço de outros provedores).

Para detalhes de implementação e orientação de migração:
- [Endpoints globais vs regionais do AWS Bedrock](/docs/pt-BR/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Endpoints globais vs regionais do Google Vertex AI](/docs/pt-BR/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)

### Disponibilidade

Os modelos Claude 4.5 estão disponíveis em:

| Modelo | Claude API | Amazon Bedrock | Google Cloud Vertex AI |
|--------|-----------|----------------|------------------------|
| Claude Opus 4.5 | `claude-opus-4-5-20251101` | `anthropic.claude-opus-4-5-20251101-v1:0` | `claude-opus-4-5@20251101` |
| Claude Sonnet 4.5 | `claude-sonnet-4-5-20250929` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `claude-sonnet-4-5@20250929` |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | `anthropic.claude-haiku-4-5-20251001-v1:0` | `claude-haiku-4-5@20251001` |

Também disponível através das plataformas Claude.ai e Claude Code.

## Guia de migração

Mudanças significativas e requisitos de migração variam dependendo de qual modelo você está atualizando. Para instruções de migração detalhadas, incluindo guias passo a passo, mudanças significativas e listas de verificação de migração, veja [Migrando para Claude 4.5](/docs/pt-BR/about-claude/models/migrating-to-claude-4).

O guia de migração cobre os seguintes cenários:
- **Claude Sonnet 3.7 → Sonnet 4.5**: Caminho de migração completo com mudanças significativas
- **Claude Haiku 3.5 → Haiku 4.5**: Caminho de migração completo com mudanças significativas
- **Claude Sonnet 4 → Sonnet 4.5**: Atualização rápida com mudanças mínimas
- **Claude Opus 4.1 → Sonnet 4.5**: Atualização perfeita sem mudanças significativas
- **Claude Opus 4.1 → Opus 4.5**: Atualização perfeita sem mudanças significativas
- **Claude Opus 4.5 → Sonnet 4.5**: Downgrade perfeito sem mudanças significativas

## Próximos passos

<CardGroup cols={3}>
  <Card title="Melhores práticas" icon="lightbulb" href="/docs/pt-BR/build-with-claude/prompt-engineering/claude-4-best-practices">
    Aprenda técnicas de engenharia de prompt para modelos Claude 4.5
  </Card>
  <Card title="Visão geral do modelo" icon="table" href="/docs/pt-BR/about-claude/models/overview">
    Compare modelos Claude 4.5 com outros modelos Claude
  </Card>
  <Card title="Guia de migração" icon="arrow-right-arrow-left" href="/docs/pt-BR/about-claude/models/migrating-to-claude-4">
    Atualize de modelos anteriores
  </Card>
</CardGroup>