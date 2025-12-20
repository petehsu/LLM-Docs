# Migrar para Claude Agent SDK

Guia para migrar os SDKs TypeScript e Python do Claude Code para o Claude Agent SDK

---

## Visão Geral

O Claude Code SDK foi renomeado para o **Claude Agent SDK** e sua documentação foi reorganizada. Esta mudança reflete as capacidades mais amplas do SDK para construir agentes de IA além de apenas tarefas de codificação.

## O Que Mudou

| Aspecto                   | Antigo                      | Novo                             |
| :----------------------- | :-------------------------- | :------------------------------- |
| **Nome do Pacote (TS/JS)** | `@anthropic-ai/claude-code` | `@anthropic-ai/claude-agent-sdk` |
| **Pacote Python**       | `claude-code-sdk`           | `claude-agent-sdk`               |
| **Local da Documentação** | Documentação do Claude Code | Guia de API → Seção Agent SDK |

<Note>
**Mudanças na Documentação:** A documentação do Agent SDK foi movida da documentação do Claude Code para o Guia de API em uma seção dedicada [Agent SDK](/docs/pt-BR/agent-sdk/overview). A documentação do Claude Code agora se concentra na ferramenta CLI e recursos de automação.
</Note>

## Etapas de Migração

### Para Projetos TypeScript/JavaScript

**1. Desinstale o pacote antigo:**

```bash
npm uninstall @anthropic-ai/claude-code
```

**2. Instale o novo pacote:**

```bash
npm install @anthropic-ai/claude-agent-sdk
```

**3. Atualize suas importações:**

Altere todas as importações de `@anthropic-ai/claude-code` para `@anthropic-ai/claude-agent-sdk`:

```typescript
// Antes
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-code";

// Depois
import {
  query,
  tool,
  createSdkMcpServer,
} from "@anthropic-ai/claude-agent-sdk";
```

**4. Atualize as dependências do package.json:**

Se você tiver o pacote listado em seu `package.json`, atualize-o:

```json
// Antes
{
  "dependencies": {
    "@anthropic-ai/claude-code": "^1.0.0"
  }
}

// Depois
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.1.0"
  }
}
```

É isso! Nenhuma outra alteração de código é necessária.

### Para Projetos Python

**1. Desinstale o pacote antigo:**

```bash
pip uninstall claude-code-sdk
```

**2. Instale o novo pacote:**

```bash
pip install claude-agent-sdk
```

**3. Atualize suas importações:**

Altere todas as importações de `claude_code_sdk` para `claude_agent_sdk`:

```python
# Antes
from claude_code_sdk import query, ClaudeCodeOptions

# Depois
from claude_agent_sdk import query, ClaudeAgentOptions
```

**4. Atualize os nomes dos tipos:**

Altere `ClaudeCodeOptions` para `ClaudeAgentOptions`:

```python
# Antes
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5"
)

# Depois
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5"
)
```

**5. Revise [mudanças significativas](#breaking-changes)**

Faça as alterações de código necessárias para concluir a migração.

## Mudanças significativas

<Warning>
Para melhorar o isolamento e a configuração explícita, o Claude Agent SDK v0.1.0 introduz mudanças significativas para usuários que migram do Claude Code SDK. Revise esta seção cuidadosamente antes de migrar.
</Warning>

### Python: ClaudeCodeOptions renomeado para ClaudeAgentOptions

**O que mudou:** O tipo do SDK Python `ClaudeCodeOptions` foi renomeado para `ClaudeAgentOptions`.

**Migração:**

```python
# ANTES (v0.0.x)
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)

# DEPOIS (v0.1.0)
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)
```

**Por que isso mudou:** O nome do tipo agora corresponde à marca "Claude Agent SDK" e fornece consistência nas convenções de nomenclatura do SDK.

### Prompt do sistema não é mais padrão

**O que mudou:** O SDK não usa mais o prompt do sistema do Claude Code por padrão.

**Migração:**

<CodeGroup>

```typescript TypeScript
// ANTES (v0.0.x) - Usava o prompt do sistema do Claude Code por padrão
const result = query({ prompt: "Hello" });

// DEPOIS (v0.1.0) - Usa prompt do sistema vazio por padrão
// Para obter o comportamento antigo, solicite explicitamente a predefinição do Claude Code:
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: { type: "preset", preset: "claude_code" }
  }
});

// Ou use um prompt do sistema personalizado:
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: "You are a helpful coding assistant"
  }
});
```

```python Python
# ANTES (v0.0.x) - Usava o prompt do sistema do Claude Code por padrão
async for message in query(prompt="Hello"):
    print(message)

# DEPOIS (v0.1.0) - Usa prompt do sistema vazio por padrão
# Para obter o comportamento antigo, solicite explicitamente a predefinição do Claude Code:
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt={"type": "preset", "preset": "claude_code"}  # Use a predefinição
    )
):
    print(message)

# Ou use um prompt do sistema personalizado:
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt="You are a helpful coding assistant"
    )
):
    print(message)
```

</CodeGroup>

**Por que isso mudou:** Fornece melhor controle e isolamento para aplicações do SDK. Agora você pode construir agentes com comportamento personalizado sem herdar as instruções focadas em CLI do Claude Code.

### Fontes de Configurações Não Carregadas por Padrão

**O que mudou:** O SDK não lê mais as configurações do sistema de arquivos (CLAUDE.md, settings.json, comandos de barra, etc.) por padrão.

**Migração:**

<CodeGroup>

```typescript TypeScript
// ANTES (v0.0.x) - Carregava todas as configurações automaticamente
const result = query({ prompt: "Hello" });
// Leria de:
// - ~/.claude/settings.json (usuário)
// - .claude/settings.json (projeto)
// - .claude/settings.local.json (local)
// - Arquivos CLAUDE.md
// - Comandos de barra personalizados

// DEPOIS (v0.1.0) - Nenhuma configuração carregada por padrão
// Para obter o comportamento antigo:
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["user", "project", "local"]
  }
});

// Ou carregue apenas fontes específicas:
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["project"]  // Apenas configurações do projeto
  }
});
```

```python Python
# ANTES (v0.0.x) - Carregava todas as configurações automaticamente
async for message in query(prompt="Hello"):
    print(message)
# Leria de:
# - ~/.claude/settings.json (usuário)
# - .claude/settings.json (projeto)
# - .claude/settings.local.json (local)
# - Arquivos CLAUDE.md
# - Comandos de barra personalizados

# DEPOIS (v0.1.0) - Nenhuma configuração carregada por padrão
# Para obter o comportamento antigo:
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["user", "project", "local"]
    )
):
    print(message)

# Ou carregue apenas fontes específicas:
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["project"]  # Apenas configurações do projeto
    )
):
    print(message)
```

</CodeGroup>

**Por que isso mudou:** Garante que as aplicações do SDK tenham comportamento previsível independente das configurações do sistema de arquivos local. Isso é especialmente importante para:
- **Ambientes CI/CD** - Comportamento consistente sem personalizações locais
- **Aplicações implantadas** - Sem dependência de configurações do sistema de arquivos
- **Testes** - Ambientes de teste isolados
- **Sistemas multi-tenant** - Evitar vazamento de configurações entre usuários

<Note>
**Compatibilidade com versões anteriores:** Se sua aplicação dependia de configurações do sistema de arquivos (comandos de barra personalizados, instruções CLAUDE.md, etc.), adicione `settingSources: ['user', 'project', 'local']` às suas opções.
</Note>

## Por Que a Renomeação?

O Claude Code SDK foi originalmente projetado para tarefas de codificação, mas evoluiu para um framework poderoso para construir todos os tipos de agentes de IA. O novo nome "Claude Agent SDK" reflete melhor suas capacidades:

- Construir agentes de negócios (assistentes jurídicos, consultores financeiros, suporte ao cliente)
- Criar agentes de codificação especializados (bots SRE, revisores de segurança, agentes de revisão de código)
- Desenvolver agentes personalizados para qualquer domínio com uso de ferramentas, integração MCP e muito mais

## Obtendo Ajuda

Se você encontrar algum problema durante a migração:

**Para TypeScript/JavaScript:**

1. Verifique se todas as importações foram atualizadas para usar `@anthropic-ai/claude-agent-sdk`
2. Verifique se seu package.json tem o novo nome do pacote
3. Execute `npm install` para garantir que as dependências sejam atualizadas

**Para Python:**

1. Verifique se todas as importações foram atualizadas para usar `claude_agent_sdk`
2. Verifique se seu requirements.txt ou pyproject.toml tem o novo nome do pacote
3. Execute `pip install claude-agent-sdk` para garantir que o pacote seja instalado

## Próximas Etapas

- Explore a [Visão Geral do Agent SDK](/docs/pt-BR/agent-sdk/overview) para aprender sobre os recursos disponíveis
- Confira a [Referência do SDK TypeScript](/docs/pt-BR/agent-sdk/typescript) para documentação detalhada da API
- Revise a [Referência do SDK Python](/docs/pt-BR/agent-sdk/python) para documentação específica do Python
- Saiba mais sobre [Ferramentas Personalizadas](/docs/pt-BR/agent-sdk/custom-tools) e [Integração MCP](/docs/pt-BR/agent-sdk/mcp)