# Ferramenta de memória

A ferramenta de memória permite que Claude armazene e recupere informações entre conversas através de um diretório de arquivo de memória.

---

A ferramenta de memória permite que Claude armazene e recupere informações entre conversas através de um diretório de arquivo de memória. Claude pode criar, ler, atualizar e excluir arquivos que persistem entre sessões, permitindo que ele construa conhecimento ao longo do tempo sem manter tudo na janela de contexto.

A ferramenta de memória opera no lado do cliente—você controla onde e como os dados são armazenados através de sua própria infraestrutura.

<Note>
A ferramenta de memória está atualmente em beta. Para habilitá-la, use o cabeçalho beta `context-management-2025-06-27` em suas solicitações de API.

Por favor, entre em contato através de nosso [formulário de feedback](https://forms.gle/YXC2EKGMhjN1c4L88) para compartilhar seu feedback sobre este recurso.
</Note>

## Casos de uso

- Manter contexto do projeto em múltiplas execuções de agente
- Aprender com interações, decisões e feedback anteriores
- Construir bases de conhecimento ao longo do tempo
- Habilitar aprendizado entre conversas onde Claude melhora em fluxos de trabalho recorrentes

## Como funciona

Quando habilitada, Claude verifica automaticamente seu diretório de memória antes de iniciar tarefas. Claude pode criar, ler, atualizar e excluir arquivos no diretório `/memories` para armazenar o que aprende enquanto trabalha, depois referenciar essas memórias em conversas futuras para lidar com tarefas semelhantes de forma mais eficaz ou continuar de onde parou.

Como esta é uma ferramenta do lado do cliente, Claude faz chamadas de ferramenta para executar operações de memória, e sua aplicação executa essas operações localmente. Isso lhe dá controle total sobre onde e como a memória é armazenada. Por segurança, você deve restringir todas as operações de memória ao diretório `/memories`.

### Exemplo: Como funcionam as chamadas da ferramenta de memória

Quando você pede a Claude para ajudar com uma tarefa, Claude verifica automaticamente seu diretório de memória primeiro. Aqui está o que uma interação típica parece:

**1. Solicitação do usuário:**
```
"Help me respond to this customer service ticket."
```

**2. Claude verifica o diretório de memória:**
```
"I'll help you respond to the customer service ticket. Let me check my memory for any previous context."
```

Claude chama a ferramenta de memória:
```json
{
  "type": "tool_use",
  "id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories"
  }
}
```

**3. Sua aplicação retorna o conteúdo do diretório:**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": "Here're the files and directories up to 2 levels deep in /memories, excluding hidden items and node_modules:\n4.0K\t/memories\n1.5K\t/memories/customer_service_guidelines.xml\n2.0K\t/memories/refund_policies.xml"
}
```

**4. Claude lê arquivos relevantes:**
```json
{
  "type": "tool_use",
  "id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories/customer_service_guidelines.xml"
  }
}
```

**5. Sua aplicação retorna o conteúdo do arquivo:**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": "Here's the content of /memories/customer_service_guidelines.xml with line numbers:\n     1\t<guidelines>\n     2\t<addressing_customers>\n     3\t- Always address customers by their first name\n     4\t- Use empathetic language\n..."
}
```

**6. Claude usa a memória para ajudar:**
```
"Based on your customer service guidelines, I can help you craft a response. Please share the ticket details..."
```

## Modelos suportados

A ferramenta de memória está disponível em:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Começando

Para usar a ferramenta de memória:

1. Inclua o cabeçalho beta `context-management-2025-06-27` em suas solicitações de API
2. Adicione a ferramenta de memória à sua solicitação
3. Implemente manipuladores do lado do cliente para operações de memória

<Note>
Para lidar com operações da ferramenta de memória em sua aplicação, você precisa implementar manipuladores para cada comando de memória. Nossos SDKs fornecem auxiliares de ferramenta de memória que lidam com a interface da ferramenta—você pode fazer uma subclasse de `BetaAbstractMemoryTool` (Python) ou usar `betaMemoryTool` (TypeScript) para implementar seu próprio backend de memória (baseado em arquivo, banco de dados, armazenamento em nuvem, arquivos criptografados, etc.).

Para exemplos funcionais, veja:
- Python: [examples/memory/basic.py](https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/memory/basic.py)
- TypeScript: [examples/tools-helpers-memory.ts](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/examples/tools-helpers-memory.ts)
</Note>

## Uso básico

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "I'\''m working on a Python web scraper that keeps crashing with a timeout error. Here'\''s the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
            }
        ],
        "tools": [{
            "type": "memory_20250818",
            "name": "memory"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
        }
    ],
    tools=[{
        "type": "memory_20250818",
        "name": "memory"
    }],
    betas=["context-management-2025-06-27"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 2048,
  messages: [
    {
      role: "user",
      content: "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
    }
  ],
  tools: [{
    type: "memory_20250818",
    name: "memory"
  }],
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

## Comandos da ferramenta

Sua implementação do lado do cliente precisa lidar com esses comandos da ferramenta de memória. Embora essas especificações descrevam os comportamentos recomendados com os quais Claude está mais familiarizado, você pode modificar sua implementação e retornar strings conforme necessário para seu caso de uso.

### view
Mostra o conteúdo do diretório ou conteúdo do arquivo com intervalos de linhas opcionais:

```json
{
  "command": "view",
  "path": "/memories",
  "view_range": [1, 10]  // Optional: view specific lines
}
```

#### Valores de retorno

**Para diretórios:** Retorne uma listagem que mostra arquivos e diretórios com seus tamanhos:
```
Here're the files and directories up to 2 levels deep in {path}, excluding hidden items and node_modules:
{size}    {path}
{size}    {path}/{filename1}
{size}    {path}/{filename2}
```

- Lista arquivos até 2 níveis de profundidade
- Mostra tamanhos legíveis por humanos (por exemplo, `5.5K`, `1.2M`)
- Exclui itens ocultos (arquivos começando com `.`) e `node_modules`
- Usa caractere de tabulação entre tamanho e caminho

**Para arquivos:** Retorne o conteúdo do arquivo com um cabeçalho e números de linha:
```
Here's the content of {path} with line numbers:
{line_numbers}{tab}{content}
```

Formatação de número de linha:
- **Largura**: 6 caracteres, alinhados à direita com preenchimento de espaço
- **Separador**: Caractere de tabulação entre número de linha e conteúdo
- **Indexação**: Indexada em 1 (primeira linha é linha 1)
- **Limite de linha**: Arquivos com mais de 999.999 linhas devem retornar um erro: `"File {path} exceeds maximum line limit of 999,999 lines."`

**Exemplo de saída:**
```
Here's the content of /memories/notes.txt with line numbers:
     1	Hello World
     2	This is line two
    10	Line ten
   100	Line one hundred
```

#### Tratamento de erros

- **Arquivo/diretório não existe**: `"The path {path} does not exist. Please provide a valid path."`

### create
Criar um novo arquivo:

```json
{
  "command": "create",
  "path": "/memories/notes.txt",
  "file_text": "Meeting notes:\n- Discussed project timeline\n- Next steps defined\n"
}
```

#### Valores de retorno

- **Sucesso**: `"File created successfully at: {path}"`

#### Tratamento de erros

- **Arquivo já existe**: `"Error: File {path} already exists"`

### str_replace
Substituir texto em um arquivo:

```json
{
  "command": "str_replace",
  "path": "/memories/preferences.txt",
  "old_str": "Favorite color: blue",
  "new_str": "Favorite color: green"
}
```

#### Valores de retorno

- **Sucesso**: `"The memory file has been edited."` seguido por um trecho do arquivo editado com números de linha

#### Tratamento de erros

- **Arquivo não existe**: `"Error: The path {path} does not exist. Please provide a valid path."`
- **Texto não encontrado**: ``"No replacement was performed, old_str `{old_str}` did not appear verbatim in {path}."``
- **Texto duplicado**: Quando `old_str` aparece várias vezes, retorne: ``"No replacement was performed. Multiple occurrences of old_str `{old_str}` in lines: {line_numbers}. Please ensure it is unique"``

#### Tratamento de diretório

Se o caminho for um diretório, retorne um erro "arquivo não existe".

### insert
Inserir texto em uma linha específica:

```json
{
  "command": "insert",
  "path": "/memories/todo.txt",
  "insert_line": 2,
  "insert_text": "- Review memory tool documentation\n"
}
```

#### Valores de retorno

- **Sucesso**: `"The file {path} has been edited."`

#### Tratamento de erros

- **Arquivo não existe**: `"Error: The path {path} does not exist"`
- **Número de linha inválido**: ``"Error: Invalid `insert_line` parameter: {insert_line}. It should be within the range of lines of the file: [0, {n_lines}]"``

#### Tratamento de diretório

Se o caminho for um diretório, retorne um erro "arquivo não existe".

### delete
Excluir um arquivo ou diretório:

```json
{
  "command": "delete",
  "path": "/memories/old_file.txt"
}
```

#### Valores de retorno

- **Sucesso**: `"Successfully deleted {path}"`

#### Tratamento de erros

- **Arquivo/diretório não existe**: `"Error: The path {path} does not exist"`

#### Tratamento de diretório

Exclui o diretório e todo seu conteúdo recursivamente.

### rename
Renomear ou mover um arquivo/diretório:

```json
{
  "command": "rename",
  "old_path": "/memories/draft.txt",
  "new_path": "/memories/final.txt"
}
```

#### Valores de retorno

- **Sucesso**: `"Successfully renamed {old_path} to {new_path}"`

#### Tratamento de erros

- **Origem não existe**: `"Error: The path {old_path} does not exist"`
- **Destino já existe**: Retorne um erro (não sobrescreva): `"Error: The destination {new_path} already exists"`

#### Tratamento de diretório

Renomeia o diretório.

## Orientação de prompt

Incluímos automaticamente esta instrução no prompt do sistema quando a ferramenta de memória está incluída:

```
IMPORTANT: ALWAYS VIEW YOUR MEMORY DIRECTORY BEFORE DOING ANYTHING ELSE.
MEMORY PROTOCOL:
1. Use the `view` command of your `memory` tool to check for earlier progress.
2. ... (work on the task) ...
     - As you make progress, record status / progress / thoughts etc in your memory.
ASSUME INTERRUPTION: Your context window might be reset at any moment, so you risk losing any progress that is not recorded in your memory directory.
```

Se você observar Claude criando arquivos de memória desorganizados, você pode incluir esta instrução:

> Nota: ao editar sua pasta de memória, sempre tente manter seu conteúdo atualizado, coerente e organizado. Você pode renomear ou excluir arquivos que não são mais relevantes. Não crie novos arquivos a menos que seja necessário.

Você também pode orientar o que Claude escreve na memória, por exemplo, "Apenas escreva informações relevantes para \<topic\> em seu sistema de memória."

## Considerações de segurança

Aqui estão preocupações de segurança importantes ao implementar seu armazenamento de memória:

### Informações sensíveis
Claude geralmente se recusa a escrever informações sensíveis em arquivos de memória. No entanto, você pode querer implementar validação mais rigorosa que remova informações potencialmente sensíveis.

### Tamanho de armazenamento de arquivo
Considere rastrear tamanhos de arquivo de memória e impedir que arquivos cresçam muito. Considere adicionar um número máximo de caracteres que o comando de leitura de memória pode retornar e deixar Claude paginar através do conteúdo.

### Expiração de memória
Considere limpar periodicamente arquivos de memória que não foram acessados em um tempo prolongado.

### Proteção contra travessia de caminho

<Warning>
Entradas de caminho maliciosas podem tentar acessar arquivos fora do diretório `/memories`. Sua implementação **DEVE** validar todos os caminhos para evitar ataques de travessia de diretório.
</Warning>

Considere essas proteções:

- Valide que todos os caminhos começam com `/memories`
- Resolva caminhos para sua forma canônica e verifique se permanecem dentro do diretório de memória
- Rejeite caminhos contendo sequências como `../`, `..\\`, ou outros padrões de travessia
- Observe sequências de travessia codificadas em URL (`%2e%2e%2f`)
- Use utilitários de segurança de caminho integrados de sua linguagem (por exemplo, `pathlib.Path.resolve()` e `relative_to()` do Python)

## Tratamento de erros

A ferramenta de memória usa padrões de tratamento de erros semelhantes aos da [ferramenta de editor de texto](/docs/pt-BR/agents-and-tools/tool-use/text-editor-tool#handle-errors). Veja as seções de comando individual da ferramenta acima para mensagens de erro detalhadas e comportamentos. Erros comuns incluem arquivo não encontrado, erros de permissão, caminhos inválidos e correspondências de texto duplicadas.

## Usando com Context Editing

A ferramenta de memória pode ser combinada com [context editing](/docs/pt-BR/build-with-claude/context-editing), que limpa automaticamente resultados de ferramentas antigas quando o contexto da conversa cresce além de um limite configurado. Esta combinação permite fluxos de trabalho de agente de longa duração que de outra forma excederiam limites de contexto.

### Como funcionam juntos

Quando a edição de contexto está habilitada e sua conversa se aproxima do limite de limpeza, Claude recebe automaticamente uma notificação de aviso. Isso solicita a Claude preservar qualquer informação importante dos resultados da ferramenta em arquivos de memória antes que esses resultados sejam limpos da janela de contexto.

Após os resultados da ferramenta serem limpos, Claude pode recuperar as informações armazenadas dos arquivos de memória sempre que necessário, tratando efetivamente a memória como uma extensão de seu contexto de trabalho. Isso permite que Claude:

- Continue fluxos de trabalho complexos e multi-etapas sem perder informações críticas
- Referencie trabalho e decisões anteriores mesmo após resultados da ferramenta serem removidos
- Mantenha contexto coerente em conversas que excederiam limites de contexto típicos
- Construa uma base de conhecimento ao longo do tempo enquanto mantém a janela de contexto ativo gerenciável

### Exemplo de fluxo de trabalho

Considere um projeto de refatoração de código com muitas operações de arquivo:

1. Claude faz numerosas edições em arquivos, gerando muitos resultados de ferramenta
2. Conforme o contexto cresce e se aproxima de seu limite, Claude recebe um aviso
3. Claude resume as alterações feitas até agora em um arquivo de memória (por exemplo, `/memories/refactoring_progress.xml`)
4. A edição de contexto limpa automaticamente os resultados de ferramenta mais antigos
5. Claude continua trabalhando, referenciando o arquivo de memória quando precisa se lembrar de quais alterações já foram concluídas
6. O fluxo de trabalho pode continuar indefinidamente, com Claude gerenciando contexto ativo e memória persistente

### Configuração

Para usar ambos os recursos juntos:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 100000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 100000
        },
        keep: {
          type: "tool_uses",
          value: 3
        }
      }
    ]
  }
});
```

</CodeGroup>

Você também pode excluir chamadas de ferramenta de memória de serem limpas para garantir que Claude sempre tenha acesso a operações de memória recentes:

<CodeGroup>

```python Python
context_management={
    "edits": [
        {
            "type": "clear_tool_uses_20250919",
            "exclude_tools": ["memory"]
        }
    ]
}
```

```typescript TypeScript
context_management: {
  edits: [
    {
      type: "clear_tool_uses_20250919",
      exclude_tools: ["memory"]
    }
  ]
}
```

</CodeGroup>