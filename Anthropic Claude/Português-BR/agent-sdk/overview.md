# Visão geral do Agent SDK

Construa agentes de IA em produção com Claude Code como uma biblioteca

---

<Note>
O Claude Code SDK foi renomeado para Claude Agent SDK. Se você está migrando do SDK antigo, consulte o [Guia de Migração](/docs/pt-BR/agent-sdk/migration-guide).
</Note>

Construa agentes de IA que leem arquivos autonomamente, executam comandos, pesquisam a web, editam código e muito mais. O Agent SDK oferece as mesmas ferramentas, loop de agente e gerenciamento de contexto que alimentam o Claude Code, programável em Python e TypeScript.

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"])
    ):
        print(message)  # Claude reads the file, finds the bug, edits it

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);  // Claude reads the file, finds the bug, edits it
}
```
</CodeGroup>

O Agent SDK inclui ferramentas integradas para ler arquivos, executar comandos e editar código, para que seu agente possa começar a trabalhar imediatamente sem que você implemente a execução de ferramentas. Mergulhe no guia de início rápido ou explore agentes reais construídos com o SDK:

<CardGroup cols={2}>
  <Card title="Guia de Início Rápido" icon="play" href="/docs/pt-BR/agent-sdk/quickstart">
    Construa um agente de correção de bugs em minutos
  </Card>
  <Card title="Agentes de exemplo" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    Assistente de email, agente de pesquisa e muito mais
  </Card>
</CardGroup>

## Capacidades

Tudo o que torna o Claude Code poderoso está disponível no SDK:

<Tabs>
  <Tab title="Ferramentas integradas">
    Seu agente pode ler arquivos, executar comandos e pesquisar bases de código imediatamente. As ferramentas principais incluem:

    | Ferramenta | O que faz |
    |------|--------------|
    | **Read** | Ler qualquer arquivo no diretório de trabalho |
    | **Write** | Criar novos arquivos |
    | **Edit** | Fazer edições precisas em arquivos existentes |
    | **Bash** | Executar comandos de terminal, scripts, operações git |
    | **Glob** | Encontrar arquivos por padrão (`**/*.ts`, `src/**/*.py`) |
    | **Grep** | Pesquisar conteúdo de arquivos com regex |
    | **WebSearch** | Pesquisar a web por informações atuais |
    | **WebFetch** | Buscar e analisar conteúdo de páginas da web |

    Este exemplo cria um agente que pesquisa sua base de código por comentários TODO:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Find all TODO comments and create a summary",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Find all TODO comments and create a summary",
      options: { allowedTools: ["Read", "Glob", "Grep"] }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

  </Tab>
  <Tab title="Hooks">
    Execute código personalizado em pontos-chave do ciclo de vida do agente. Os hooks podem executar comandos shell ou scripts personalizados para validar, registrar, bloquear ou transformar o comportamento do agente.

    **Hooks disponíveis:** `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit` e muito mais.

    Este exemplo registra todas as alterações de arquivo em um arquivo de auditoria:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Suggest improvements to utils.py",
            options=ClaudeAgentOptions(
                permission_mode="acceptEdits",
                hooks={
                    "PostToolUse": [{
                        "matcher": "Edit|Write",
                        "hooks": [{"type": "command", "command": "echo \"$(date): file modified\" >> ./audit.log"}]
                    }]
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Suggest improvements to utils.py",
      options: {
        permissionMode: "acceptEdits",
        hooks: {
          PostToolUse: [{
            matcher: "Edit|Write",
            hooks: [{ type: "command", command: "echo \"$(date): file modified\" >> ./audit.log" }]
          }]
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Saiba mais sobre hooks →](/docs/pt-BR/agent-sdk/hooks)
  </Tab>
  <Tab title="Subagentes">
    Crie agentes especializados para lidar com subtarefas focadas. Seu agente principal delega trabalho e os subagentes relatam resultados.

    Ative a ferramenta `Task` para permitir que Claude crie subagentes quando decidir que uma tarefa é complexa o suficiente para se beneficiar da delegação. Claude determina automaticamente quando usar subagentes com base na complexidade da tarefa.

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Analyze this codebase for security vulnerabilities",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep", "Task"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Analyze this codebase for security vulnerabilities",
      options: {
        allowedTools: ["Read", "Glob", "Grep", "Task"]
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    Você também pode definir tipos de agentes personalizados com a opção `agents` para padrões de delegação mais especializados.

    [Saiba mais sobre subagentes →](/docs/pt-BR/agent-sdk/subagents)
  </Tab>
  <Tab title="MCP">
    Conecte-se a sistemas externos via Model Context Protocol: bancos de dados, navegadores, APIs e [centenas mais](https://github.com/modelcontextprotocol/servers).

    Este exemplo conecta o [servidor Playwright MCP](https://github.com/microsoft/playwright-mcp) para dar ao seu agente capacidades de automação de navegador:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Open example.com and describe what you see",
            options=ClaudeAgentOptions(
                mcp_servers={
                    "playwright": {"command": "npx", "args": ["@playwright/mcp@latest"]}
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Open example.com and describe what you see",
      options: {
        mcpServers: {
          playwright: { command: "npx", args: ["@playwright/mcp@latest"] }
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Saiba mais sobre MCP →](/docs/pt-BR/agent-sdk/mcp)
  </Tab>
  <Tab title="Permissões">
    Controle exatamente quais ferramentas seu agente pode usar. Permita operações seguras, bloqueie operações perigosas ou exija aprovação para ações sensíveis.

    Este exemplo cria um agente somente leitura que pode analisar mas não modificar código:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Review this code for best practices",
            options=ClaudeAgentOptions(
                allowed_tools=["Read", "Glob", "Grep"],
                permission_mode="bypassPermissions"
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Review this code for best practices",
      options: {
        allowedTools: ["Read", "Glob", "Grep"],
        permissionMode: "bypassPermissions"
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Saiba mais sobre permissões →](/docs/pt-BR/agent-sdk/permissions)
  </Tab>
  <Tab title="Sessões">
    Mantenha contexto em múltiplas trocas. Claude se lembra de arquivos lidos, análises realizadas e histórico de conversa. Retome sessões depois ou divida-as para explorar diferentes abordagens.

    Este exemplo captura o ID da sessão da primeira consulta e depois retoma para continuar com contexto completo:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        session_id = None

        # First query: capture the session ID
        async for message in query(
            prompt="Read the authentication module",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob"])
        ):
            if hasattr(message, 'subtype') and message.subtype == 'init':
                session_id = message.data.get('session_id')

        # Resume with full context from the first query
        async for message in query(
            prompt="Now find all places that call it",  # "it" = auth module
            options=ClaudeAgentOptions(resume=session_id)
        ):
            pass

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    let sessionId: string | undefined;

    // First query: capture the session ID
    for await (const message of query({
      prompt: "Read the authentication module",
      options: { allowedTools: ["Read", "Glob"] }
    })) {
      if (message.type === "system" && message.subtype === "init") {
        sessionId = message.session_id;
      }
    }

    // Resume with full context from the first query
    for await (const message of query({
      prompt: "Now find all places that call it",  // "it" = auth module
      options: { resume: sessionId }
    })) {
      // Process messages...
    }
    ```
    </CodeGroup>

    [Saiba mais sobre sessões →](/docs/pt-BR/agent-sdk/sessions)
  </Tab>
</Tabs>

### Recursos do Claude Code

O SDK também suporta a configuração baseada em sistema de arquivos do Claude Code. Para usar esses recursos, defina `setting_sources=["project"]` (Python) ou `settingSources: ['project']` (TypeScript) em suas opções.

| Recurso | Descrição | Localização |
|---------|-------------|----------|
| [Skills](/docs/pt-BR/agent-sdk/skills) | Capacidades especializadas definidas em Markdown | `.claude/skills/SKILL.md` |
| [Slash commands](/docs/pt-BR/agent-sdk/slash-commands) | Comandos personalizados para tarefas comuns | `.claude/commands/*.md` |
| [Memory](/docs/pt-BR/agent-sdk/modifying-system-prompts) | Contexto do projeto e instruções | `CLAUDE.md` ou `.claude/CLAUDE.md` |
| [Plugins](/docs/pt-BR/agent-sdk/plugins) | Estenda com comandos personalizados, agentes e servidores MCP | Programático via opção `plugins` |

## Comece agora

<Steps>
  <Step title="Instale Claude Code">
    O SDK usa Claude Code como seu tempo de execução:

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

    Consulte [Claude Code setup](https://docs.anthropic.com/en/docs/claude-code/setup) para Windows e outras opções.
  </Step>
  <Step title="Instale o SDK">
    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python">
        ```bash
        pip install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>
  <Step title="Defina sua chave de API">
    ```bash
    export ANTHROPIC_API_KEY=your-api-key
    ```
    Obtenha sua chave no [Console](https://console.anthropic.com/).

    O SDK também suporta autenticação via provedores de API de terceiros:

    - **Amazon Bedrock**: Defina a variável de ambiente `CLAUDE_CODE_USE_BEDROCK=1` e configure as credenciais da AWS
    - **Google Vertex AI**: Defina a variável de ambiente `CLAUDE_CODE_USE_VERTEX=1` e configure as credenciais do Google Cloud
    - **Microsoft Foundry**: Defina a variável de ambiente `CLAUDE_CODE_USE_FOUNDRY=1` e configure as credenciais do Azure

    <Note>
    A menos que previamente aprovado, não permitimos que desenvolvedores terceirizados ofereçam login Claude.ai ou limites de taxa para seus produtos, incluindo agentes construídos no Claude Agent SDK. Use os métodos de autenticação de chave de API descritos neste documento.
    </Note>
  </Step>
  <Step title="Execute seu primeiro agente">
    Este exemplo cria um agente que lista arquivos em seu diretório atual usando ferramentas integradas.

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="What files are in this directory?",
            options=ClaudeAgentOptions(allowed_tools=["Bash", "Glob"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "What files are in this directory?",
      options: { allowedTools: ["Bash", "Glob"] },
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Step>
</Steps>

**Pronto para construir?** Siga o [Guia de Início Rápido](/docs/pt-BR/agent-sdk/quickstart) para criar um agente que encontra e corrige bugs em minutos.

## Compare o Agent SDK com outras ferramentas Claude

A plataforma Claude oferece múltiplas maneiras de construir com Claude. Veja como o Agent SDK se encaixa:

<Tabs>
  <Tab title="Agent SDK vs Client SDK">
    O [Anthropic Client SDK](/docs/pt-BR/api/client-sdks) oferece acesso direto à API: você envia prompts e implementa a execução de ferramentas você mesmo. O **Agent SDK** oferece Claude com execução de ferramentas integrada.

    Com o Client SDK, você implementa um loop de ferramentas. Com o Agent SDK, Claude o gerencia:

    <CodeGroup>
    ```python Python
    # Client SDK: You implement the tool loop
    response = client.messages.create(...)
    while response.stop_reason == "tool_use":
        result = your_tool_executor(response.tool_use)
        response = client.messages.create(tool_result=result, ...)

    # Agent SDK: Claude handles tools autonomously
    async for message in query(prompt="Fix the bug in auth.py"):
        print(message)
    ```

    ```typescript TypeScript
    // Client SDK: You implement the tool loop
    let response = await client.messages.create({...});
    while (response.stop_reason === "tool_use") {
      const result = yourToolExecutor(response.tool_use);
      response = await client.messages.create({ tool_result: result, ... });
    }

    // Agent SDK: Claude handles tools autonomously
    for await (const message of query({ prompt: "Fix the bug in auth.py" })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Tab>
  <Tab title="Agent SDK vs Claude Code CLI">
    Mesmas capacidades, interface diferente:

    | Caso de uso | Melhor escolha |
    |----------|-------------|
    | Desenvolvimento interativo | CLI |
    | Pipelines CI/CD | SDK |
    | Aplicações personalizadas | SDK |
    | Tarefas únicas | CLI |
    | Automação em produção | SDK |

    Muitos times usam ambos: CLI para desenvolvimento diário, SDK para produção. Os fluxos de trabalho se traduzem diretamente entre eles.
  </Tab>
</Tabs>

## Changelog

Veja o changelog completo para atualizações do SDK, correções de bugs e novos recursos:

- **TypeScript SDK**: [Ver CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md)
- **Python SDK**: [Ver CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-python/blob/main/CHANGELOG.md)

## Reportando bugs

Se você encontrar bugs ou problemas com o Agent SDK:

- **TypeScript SDK**: [Reporte problemas no GitHub](https://github.com/anthropics/claude-agent-sdk-typescript/issues)
- **Python SDK**: [Reporte problemas no GitHub](https://github.com/anthropics/claude-agent-sdk-python/issues)

## Diretrizes de marca

Para parceiros que integram o Claude Agent SDK, o uso da marca Claude é opcional. Ao referenciar Claude em seu produto:

**Permitido:**
- "Claude Agent" (preferido para menus suspensos)
- "Claude" (quando dentro de um menu já rotulado como "Agents")
- "{YourAgentName} Powered by Claude" (se você tiver um nome de agente existente)

**Não permitido:**
- "Claude Code" ou "Claude Code Agent"
- Arte ASCII com marca Claude Code ou elementos visuais que imitam Claude Code

Seu produto deve manter sua própria marca e não parecer ser Claude Code ou qualquer produto Anthropic. Para dúvidas sobre conformidade de marca, entre em contato com nosso [time de vendas](https://www.anthropic.com/contact-sales).

## Licença e termos

O uso do Claude Agent SDK é regido pelos [Termos de Serviço Comerciais da Anthropic](https://www.anthropic.com/legal/commercial-terms), incluindo quando você o usa para alimentar produtos e serviços que você disponibiliza para seus próprios clientes e usuários finais, exceto na medida em que um componente ou dependência específica seja coberta por uma licença diferente conforme indicado no arquivo LICENSE desse componente.

## Próximos passos

<CardGroup cols={2}>
  <Card title="Guia de Início Rápido" icon="play" href="/docs/pt-BR/agent-sdk/quickstart">
    Construa um agente que encontra e corrige bugs em minutos
  </Card>
  <Card title="Agentes de exemplo" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    Assistente de email, agente de pesquisa e muito mais
  </Card>
  <Card title="TypeScript SDK" icon="code" href="/docs/pt-BR/agent-sdk/typescript">
    Referência completa da API TypeScript e exemplos
  </Card>
  <Card title="Python SDK" icon="code" href="/docs/pt-BR/agent-sdk/python">
    Referência completa da API Python e exemplos
  </Card>
</CardGroup>