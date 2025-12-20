# Guia de Início Rápido

Comece com o Agent SDK Python ou TypeScript para construir agentes de IA que funcionam autonomamente

---

Use o Agent SDK para construir um agente de IA que leia seu código, encontre bugs e os corrija, tudo sem intervenção manual.

**O que você fará:**
1. Configurar um projeto com o Agent SDK
2. Criar um arquivo com código com bugs
3. Executar um agente que encontra e corrige os bugs automaticamente

## Pré-requisitos

- **Node.js 18+** ou **Python 3.10+**
- Uma **conta Anthropic** ([inscreva-se aqui](https://console.anthropic.com/))

## Configuração

<Steps>
  <Step title="Instalar Claude Code">
    O Agent SDK usa Claude Code como seu tempo de execução. Instale-o para sua plataforma:

    <Tabs>
      <Tab title="macOS/Linux/WSL">
        ```bash
        curl -fsSL https://claude.ai/install.sh | bash
        ```
      </Tab>
      <Tab title="Homebrew">
        ```bash
        brew install --cask claude-code
        ```
      </Tab>
      <Tab title="npm">
        ```bash
        npm install -g @anthropic-ai/claude-code
        ```
      </Tab>
    </Tabs>

    Após instalar Claude Code em sua máquina, execute `claude` em seu terminal e siga os prompts para autenticar. O SDK usará essa autenticação automaticamente.

    <Tip>
    Para mais informações sobre a instalação do Claude Code, consulte [configuração do Claude Code](https://docs.anthropic.com/pt-BR/docs/claude-code/setup).
    </Tip>
  </Step>

  <Step title="Criar uma pasta de projeto">
    Crie um novo diretório para este guia de início rápido:

    ```bash
    mkdir my-agent && cd my-agent
    ```

    Para seus próprios projetos, você pode executar o SDK de qualquer pasta; ele terá acesso aos arquivos nesse diretório e seus subdiretórios por padrão.
  </Step>

  <Step title="Instalar o SDK">
    Instale o pacote Agent SDK para sua linguagem:

    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (uv)">
        [uv](https://docs.astral.sh/uv/) é um gerenciador de pacotes Python rápido que lida com ambientes virtuais automaticamente:
        ```bash
        uv init && uv add claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (pip)">
        Crie um ambiente virtual primeiro, depois instale:
        ```bash
        python3 -m venv .venv && source .venv/bin/activate
        pip3 install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="Definir sua chave de API">
    Se você já autenticou Claude Code (executando `claude` em seu terminal), o SDK usa essa autenticação automaticamente.

    Caso contrário, você precisa de uma chave de API, que pode obter no [Console Anthropic](https://console.anthropic.com/).

    Crie um arquivo `.env` em seu diretório de projeto e armazene a chave de API lá:

    ```bash
    ANTHROPIC_API_KEY=your-api-key
    ```

    <Note>
    **Usando Amazon Bedrock, Google Vertex AI ou Microsoft Azure?** Consulte os guias de configuração para [Bedrock](https://code.claude.com/docs/pt-BR/amazon-bedrock), [Vertex AI](https://code.claude.com/docs/pt-BR/google-vertex-ai) ou [Azure AI Foundry](https://code.claude.com/docs/pt-BR/azure-ai-foundry).

    A menos que previamente aprovado, não permitimos que desenvolvedores terceirizados ofereçam login Claude.ai ou limites de taxa para seus produtos, incluindo agentes construídos no Agent SDK Claude. Use os métodos de autenticação de chave de API descritos neste documento.
    </Note>
  </Step>
</Steps>

## Criar um arquivo com bugs

Este guia de início rápido o orienta na construção de um agente que pode encontrar e corrigir bugs no código. Primeiro, você precisa de um arquivo com alguns bugs intencionais para o agente corrigir. Crie `utils.py` no diretório `my-agent` e cole o seguinte código:

```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

def get_user_name(user):
    return user["name"].upper()
```

Este código tem dois bugs:
1. `calculate_average([])` falha com divisão por zero
2. `get_user_name(None)` falha com um TypeError

## Construir um agente que encontra e corrige bugs

Crie `agent.py` se estiver usando o SDK Python, ou `agent.ts` para TypeScript:

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

async def main():
    # Agentic loop: streams messages as Claude works
    async for message in query(
        prompt="Review utils.py for bugs that would cause crashes. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],  # Tools Claude can use
            permission_mode="acceptEdits"            # Auto-approve file edits
        )
    ):
        # Print human-readable output
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)              # Claude's reasoning
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")   # Tool being called
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")      # Final result

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Agentic loop: streams messages as Claude works
for await (const message of query({
  prompt: "Review utils.py for bugs that would cause crashes. Fix any issues you find.",
  options: {
    allowedTools: ["Read", "Edit", "Glob"],  // Tools Claude can use
    permissionMode: "acceptEdits"            // Auto-approve file edits
  }
})) {
  // Print human-readable output
  if (message.type === "assistant" && message.message?.content) {
    for (const block of message.message.content) {
      if ("text" in block) {
        console.log(block.text);             // Claude's reasoning
      } else if ("name" in block) {
        console.log(`Tool: ${block.name}`);  // Tool being called
      }
    }
  } else if (message.type === "result") {
    console.log(`Done: ${message.subtype}`); // Final result
  }
}
```
</CodeGroup>

Este código tem três partes principais:

1. **`query`**: o ponto de entrada principal que cria o loop agentic. Ele retorna um iterador assíncrono, então você usa `async for` para transmitir mensagens enquanto Claude trabalha. Consulte a API completa na referência do SDK [Python](/docs/pt-BR/agent-sdk/python#query) ou [TypeScript](/docs/pt-BR/agent-sdk/typescript#query).

2. **`prompt`**: o que você quer que Claude faça. Claude descobre quais ferramentas usar com base na tarefa.

3. **`options`**: configuração para o agente. Este exemplo usa `allowedTools` para restringir Claude a `Read`, `Edit` e `Glob`, e `permissionMode: "acceptEdits"` para aprovar automaticamente alterações de arquivo. Outras opções incluem `systemPrompt`, `mcpServers` e muito mais. Consulte todas as opções para [Python](/docs/pt-BR/agent-sdk/python#claudeagentoptions) ou [TypeScript](/docs/pt-BR/agent-sdk/typescript#claudeagentoptions).

O loop `async for` continua executando enquanto Claude pensa, chama ferramentas, observa resultados e decide o que fazer a seguir. Cada iteração produz uma mensagem: o raciocínio de Claude, uma chamada de ferramenta, um resultado de ferramenta ou o resultado final. O SDK lida com a orquestração (execução de ferramentas, gerenciamento de contexto, tentativas) para que você apenas consuma o fluxo. O loop termina quando Claude conclui a tarefa ou encontra um erro.

O tratamento de mensagens dentro do loop filtra a saída legível por humanos. Sem filtragem, você veria objetos de mensagem brutos, incluindo inicialização do sistema e estado interno, o que é útil para depuração, mas barulhento caso contrário.

<Note>
Este exemplo usa streaming para mostrar o progresso em tempo real. Se você não precisar de saída ao vivo (por exemplo, para trabalhos em segundo plano ou pipelines de CI), você pode coletar todas as mensagens de uma vez. Consulte [Streaming vs. modo de turno único](/docs/pt-BR/agent-sdk/streaming-vs-single-mode) para detalhes.
</Note>

### Executar seu agente

Seu agente está pronto. Execute-o com o seguinte comando:

<CodeGroup>
```bash Python
python3 agent.py
```

```bash TypeScript
npx tsx agent.ts
```
</CodeGroup>

Após executar, verifique `utils.py`. Você verá código defensivo tratando listas vazias e usuários nulos. Seu agente autonomamente:

1. **Leu** `utils.py` para entender o código
2. **Analisou** a lógica e identificou casos extremos que causariam falhas
3. **Editou** o arquivo para adicionar tratamento de erros adequado

Isto é o que torna o Agent SDK diferente: Claude executa ferramentas diretamente em vez de pedir que você as implemente.

<Note>
Se você vir "Claude Code not found", [instale Claude Code](#instalar-claude-code) e reinicie seu terminal. Para "API key not found", [defina sua chave de API](#definir-sua-chave-de-api). Consulte o [guia completo de solução de problemas](https://docs.anthropic.com/pt-BR/docs/claude-code/troubleshooting) para mais ajuda.
</Note>

### Tente outros prompts

Agora que seu agente está configurado, tente alguns prompts diferentes:

- `"Add docstrings to all functions in utils.py"`
- `"Add type hints to all functions in utils.py"`
- `"Create a README.md documenting the functions in utils.py"`

### Personalizar seu agente

Você pode modificar o comportamento do seu agente alterando as opções. Aqui estão alguns exemplos:

**Adicionar capacidade de busca na web:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "WebSearch"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "WebSearch"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

**Dar a Claude um prompt de sistema personalizado:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob"],
    permission_mode="acceptEdits",
    system_prompt="You are a senior Python developer. Always follow PEP 8 style guidelines."
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob"],
  permissionMode: "acceptEdits",
  systemPrompt: "You are a senior Python developer. Always follow PEP 8 style guidelines."
}
```
</CodeGroup>

**Executar comandos no terminal:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "Bash"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "Bash"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

Com `Bash` ativado, tente: `"Write unit tests for utils.py, run them, and fix any failures"`

## Conceitos-chave

**Ferramentas** controlam o que seu agente pode fazer:

| Ferramentas | O que o agente pode fazer |
|-------|----------------------|
| `Read`, `Glob`, `Grep` | Análise somente leitura |
| `Read`, `Edit`, `Glob` | Analisar e modificar código |
| `Read`, `Edit`, `Bash`, `Glob`, `Grep` | Automação completa |

**Modos de permissão** controlam quanto de supervisão humana você deseja:

| Modo | Comportamento | Caso de uso |
|------|----------|----------|
| `acceptEdits` | Aprova automaticamente edições de arquivo, pede outras ações | Fluxos de trabalho de desenvolvimento confiáveis |
| `bypassPermissions` | Executa sem prompts | Pipelines de CI/CD, automação |
| `default` | Requer um callback `canUseTool` para lidar com aprovação | Fluxos de aprovação personalizados |

O exemplo acima usa o modo `acceptEdits`, que aprova automaticamente operações de arquivo para que o agente possa ser executado sem prompts interativos. Se você quiser solicitar aprovação aos usuários, use o modo `default` e forneça um callback [`canUseTool`](/docs/pt-BR/agent-sdk/permissions#canusetool) que coleta entrada do usuário. Para mais controle, consulte [Permissões](/docs/pt-BR/agent-sdk/permissions).

## Próximas etapas

Agora que você criou seu primeiro agente, aprenda como estender suas capacidades e adaptá-lo ao seu caso de uso:

- **[Permissões](/docs/pt-BR/agent-sdk/permissions)**: controle o que seu agente pode fazer e quando precisa de aprovação
- **[Hooks](/docs/pt-BR/agent-sdk/hooks)**: execute código personalizado antes ou depois de chamadas de ferramenta
- **[Sessões](/docs/pt-BR/agent-sdk/sessions)**: construa agentes multi-turno que mantêm contexto
- **[Servidores MCP](/docs/pt-BR/agent-sdk/mcp)**: conecte-se a bancos de dados, navegadores, APIs e outros sistemas externos
- **[Hospedagem](/docs/pt-BR/agent-sdk/hosting)**: implante agentes no Docker, nuvem e CI/CD
- **[Agentes de exemplo](https://github.com/anthropics/claude-agent-sdk-demos)**: veja exemplos completos: assistente de email, agente de pesquisa e muito mais