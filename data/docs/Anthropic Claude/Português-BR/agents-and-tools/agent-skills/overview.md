# Agent Skills

Agent Skills são capacidades modulares que estendem a funcionalidade do Claude. Cada Skill empacota instruções, metadados e recursos opcionais (scripts, templates) que Claude usa automaticamente quando relevante.

---

## Por que usar Skills

Skills são recursos reutilizáveis baseados em sistema de arquivos que fornecem ao Claude expertise específica de domínio: fluxos de trabalho, contexto e melhores práticas que transformam agentes de propósito geral em especialistas. Diferentemente de prompts (instruções em nível de conversa para tarefas pontuais), Skills carregam sob demanda e eliminam a necessidade de fornecer repetidamente a mesma orientação em múltiplas conversas.

**Benefícios principais**:
- **Especialize Claude**: Adapte capacidades para tarefas específicas de domínio
- **Reduza repetição**: Crie uma vez, use automaticamente
- **Componha capacidades**: Combine Skills para construir fluxos de trabalho complexos

<Note>
Para uma análise profunda da arquitetura e aplicações do mundo real de Agent Skills, leia nosso blog de engenharia: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).
</Note>

## Usando Skills

Anthropic fornece Agent Skills pré-construídas para tarefas comuns de documentos (PowerPoint, Excel, Word, PDF), e você pode criar suas próprias Skills personalizadas. Ambas funcionam da mesma forma. Claude as usa automaticamente quando relevante para sua solicitação.

**Agent Skills pré-construídas** estão disponíveis para todos os usuários em claude.ai e via Claude API. Veja a seção [Available Skills](#available-skills) abaixo para a lista completa.

**Custom Skills** permitem que você empacote expertise de domínio e conhecimento organizacional. Estão disponíveis em todos os produtos Claude: crie-as em Claude Code, carregue-as via API ou adicione-as nas configurações de claude.ai.

<Note>
**Comece agora:**
- Para Agent Skills pré-construídas: Veja o [tutorial de início rápido](/docs/pt-BR/agents-and-tools/agent-skills/quickstart) para começar a usar PowerPoint, Excel, Word e PDF skills na API
- Para Custom Skills: Veja o [Agent Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills) para aprender como criar suas próprias Skills
</Note>

## Como Skills funcionam

Skills aproveitam o ambiente VM do Claude para fornecer capacidades além do que é possível apenas com prompts. Claude opera em uma máquina virtual com acesso ao sistema de arquivos, permitindo que Skills existam como diretórios contendo instruções, código executável e materiais de referência, organizados como um guia de integração que você criaria para um novo membro da equipe.

Esta arquitetura baseada em sistema de arquivos permite **divulgação progressiva**: Claude carrega informações em estágios conforme necessário, em vez de consumir contexto antecipadamente.

### Três tipos de conteúdo de Skill, três níveis de carregamento

Skills podem conter três tipos de conteúdo, cada um carregado em momentos diferentes:

### Nível 1: Metadados (sempre carregados)

**Tipo de conteúdo: Instruções**. O frontmatter YAML da Skill fornece informações de descoberta:

```yaml
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
---
```

Claude carrega esses metadados na inicialização e os inclui no prompt do sistema. Esta abordagem leve significa que você pode instalar muitas Skills sem penalidade de contexto; Claude apenas sabe que cada Skill existe e quando usá-la.

### Nível 2: Instruções (carregadas quando acionadas)

**Tipo de conteúdo: Instruções**. O corpo principal de SKILL.md contém conhecimento processual: fluxos de trabalho, melhores práticas e orientação:

````markdown
# PDF Processing

## Quick start

Use pdfplumber to extract text from PDFs:

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

For advanced form filling, see [FORMS.md](FORMS.md).
````

Quando você solicita algo que corresponde à descrição de uma Skill, Claude lê SKILL.md do sistema de arquivos via bash. Apenas então este conteúdo entra na janela de contexto.

### Nível 3: Recursos e código (carregados conforme necessário)

**Tipos de conteúdo: Instruções, código e recursos**. Skills podem agrupar materiais adicionais:

```
pdf-skill/
├── SKILL.md (main instructions)
├── FORMS.md (form-filling guide)
├── REFERENCE.md (detailed API reference)
└── scripts/
    └── fill_form.py (utility script)
```

**Instruções**: Arquivos markdown adicionais (FORMS.md, REFERENCE.md) contendo orientação especializada e fluxos de trabalho

**Código**: Scripts executáveis (fill_form.py, validate.py) que Claude executa via bash; scripts fornecem operações determinísticas sem consumir contexto

**Recursos**: Materiais de referência como esquemas de banco de dados, documentação de API, templates ou exemplos

Claude acessa esses arquivos apenas quando referenciados. O modelo de sistema de arquivos significa que cada tipo de conteúdo tem diferentes pontos fortes: instruções para orientação flexível, código para confiabilidade, recursos para consulta factual.

| Nível | Quando Carregado | Custo de Token | Conteúdo |
|---|---|---|---|
| **Nível 1: Metadados** | Sempre (na inicialização) | ~100 tokens por Skill | `name` e `description` do frontmatter YAML |
| **Nível 2: Instruções** | Quando Skill é acionada | Menos de 5k tokens | Corpo de SKILL.md com instruções e orientação |
| **Nível 3+: Recursos** | Conforme necessário | Efetivamente ilimitado | Arquivos agrupados executados via bash sem carregar conteúdos em contexto |

A divulgação progressiva garante que apenas conteúdo relevante ocupe a janela de contexto em qualquer momento.

### A arquitetura de Skills

Skills executam em um ambiente de execução de código onde Claude tem acesso ao sistema de arquivos, comandos bash e capacidades de execução de código. Pense assim: Skills existem como diretórios em uma máquina virtual, e Claude interage com elas usando os mesmos comandos bash que você usaria para navegar arquivos em seu computador.

![Agent Skills Architecture - showing how Skills integrate with the agent's configuration and virtual machine](/docs/images/agent-skills-architecture.png)

**Como Claude acessa conteúdo de Skill:**

Quando uma Skill é acionada, Claude usa bash para ler SKILL.md do sistema de arquivos, trazendo suas instruções para a janela de contexto. Se essas instruções referenciarem outros arquivos (como FORMS.md ou um esquema de banco de dados), Claude lê esses arquivos também usando comandos bash adicionais. Quando instruções mencionam scripts executáveis, Claude os executa via bash e recebe apenas a saída (o código do script nunca entra em contexto).

**O que esta arquitetura permite:**

**Acesso a arquivo sob demanda**: Claude lê apenas os arquivos necessários para cada tarefa específica. Uma Skill pode incluir dezenas de arquivos de referência, mas se sua tarefa precisar apenas do esquema de vendas, Claude carrega apenas esse arquivo. O resto permanece no sistema de arquivos consumindo zero tokens.

**Execução eficiente de script**: Quando Claude executa `validate_form.py`, o código do script nunca carrega na janela de contexto. Apenas a saída do script (como "Validation passed" ou mensagens de erro específicas) consome tokens. Isso torna scripts muito mais eficientes do que ter Claude gerar código equivalente em tempo real.

**Sem limite prático em conteúdo agrupado**: Porque arquivos não consomem contexto até serem acessados, Skills podem incluir documentação abrangente de API, grandes conjuntos de dados, exemplos extensivos ou qualquer material de referência que você precise. Não há penalidade de contexto para conteúdo agrupado que não é usado.

Este modelo baseado em sistema de arquivos é o que faz a divulgação progressiva funcionar. Claude navega sua Skill como você consultaria seções específicas de um guia de integração, acessando exatamente o que cada tarefa requer.

### Exemplo: Carregando uma skill de processamento de PDF

Aqui está como Claude carrega e usa uma skill de processamento de PDF:

1. **Inicialização**: O prompt do sistema inclui: `PDF Processing - Extract text and tables from PDF files, fill forms, merge documents`
2. **Solicitação do usuário**: "Extract the text from this PDF and summarize it"
3. **Claude invoca**: `bash: read pdf-skill/SKILL.md` → Instruções carregadas em contexto
4. **Claude determina**: Preenchimento de formulário não é necessário, então FORMS.md não é lido
5. **Claude executa**: Usa instruções de SKILL.md para completar a tarefa

![Skills loading into context window - showing the progressive loading of skill metadata and content](/docs/images/agent-skills-context-window.png)

O diagrama mostra:
1. Estado padrão com prompt do sistema e metadados de skill pré-carregados
2. Claude aciona a skill lendo SKILL.md via bash
3. Claude opcionalmente lê arquivos agrupados adicionais como FORMS.md conforme necessário
4. Claude prossegue com a tarefa

Este carregamento dinâmico garante que apenas conteúdo de skill relevante ocupe a janela de contexto.

## Onde Skills funcionam

Skills estão disponíveis em todos os produtos de agente Claude:

### Claude API

A Claude API suporta tanto Agent Skills pré-construídas quanto Custom Skills. Ambas funcionam de forma idêntica: especifique o `skill_id` relevante no parâmetro `container` junto com a ferramenta de execução de código.

**Pré-requisitos**: Usar Skills via API requer três headers beta:
- `code-execution-2025-08-25` - Skills executam no contêiner de execução de código
- `skills-2025-10-02` - Habilita funcionalidade de Skills
- `files-api-2025-04-14` - Necessário para carregar/baixar arquivos para/do contêiner

Use Agent Skills pré-construídas referenciando seu `skill_id` (por exemplo, `pptx`, `xlsx`), ou crie e carregue as suas via Skills API (endpoints `/v1/skills`). Custom Skills são compartilhadas em toda a organização.

Para saber mais, veja [Use Skills with the Claude API](/docs/pt-BR/build-with-claude/skills-guide).

### Claude Code

[Claude Code](https://code.claude.com/docs/overview) suporta apenas Custom Skills.

**Custom Skills**: Crie Skills como diretórios com arquivos SKILL.md. Claude as descobre e usa automaticamente.

Custom Skills em Claude Code são baseadas em sistema de arquivos e não requerem uploads de API.

Para saber mais, veja [Use Skills in Claude Code](https://code.claude.com/docs/skills).

### Claude Agent SDK

O [Claude Agent SDK](/docs/pt-BR/agent-sdk/overview) suporta Custom Skills através de configuração baseada em sistema de arquivos.

**Custom Skills**: Crie Skills como diretórios com arquivos SKILL.md em `.claude/skills/`. Habilite Skills incluindo `"Skill"` em sua configuração `allowed_tools`.

Skills no Agent SDK são então automaticamente descobertas quando o SDK é executado.

Para saber mais, veja [Agent Skills in the SDK](/docs/pt-BR/agent-sdk/skills).

### Claude.ai

[Claude.ai](https://claude.ai) suporta tanto Agent Skills pré-construídas quanto Custom Skills.

**Agent Skills pré-construídas**: Essas Skills já estão funcionando nos bastidores quando você cria documentos. Claude as usa sem exigir nenhuma configuração.

**Custom Skills**: Carregue suas próprias Skills como arquivos zip através de Settings > Features. Disponível em planos Pro, Max, Team e Enterprise com execução de código habilitada. Custom Skills são individuais para cada usuário; não são compartilhadas em toda a organização e não podem ser gerenciadas centralmente por administradores.

Para saber mais sobre usar Skills em Claude.ai, veja os seguintes recursos no Claude Help Center:
- [What are Skills?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Using Skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [How to create custom Skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Tech Claude your way of working using Skills](https://support.claude.com/en/articles/12580051-teach-claude-your-way-of-working-using-skills)

## Estrutura de Skill

Toda Skill requer um arquivo `SKILL.md` com frontmatter YAML:

```yaml
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
[Clear, step-by-step guidance for Claude to follow]

## Examples
[Concrete examples of using this Skill]
```

**Campos obrigatórios**: `name` e `description`

**Requisitos de campo**:

`name`:
- Máximo 64 caracteres
- Deve conter apenas letras minúsculas, números e hífens
- Não pode conter tags XML
- Não pode conter palavras reservadas: "anthropic", "claude"

`description`:
- Deve ser não-vazio
- Máximo 1024 caracteres
- Não pode conter tags XML

A `description` deve incluir tanto o que a Skill faz quanto quando Claude deve usá-la. Para orientação completa de autoria, veja o [guia de melhores práticas](/docs/pt-BR/agents-and-tools/agent-skills/best-practices).

## Considerações de segurança

Recomendamos fortemente usar Skills apenas de fontes confiáveis: aquelas que você criou ou obteve de Anthropic. Skills fornecem ao Claude novas capacidades através de instruções e código, e embora isso as torne poderosas, também significa que uma Skill maliciosa pode direcionar Claude para invocar ferramentas ou executar código de formas que não correspondem ao propósito declarado da Skill.

<Warning>
Se você deve usar uma Skill de uma fonte desconhecida ou não confiável, exerça extrema cautela e a audite completamente antes de usar. Dependendo de qual acesso Claude tem ao executar a Skill, Skills maliciosas podem levar a exfiltração de dados, acesso não autorizado ao sistema ou outros riscos de segurança.
</Warning>

**Considerações principais de segurança**:
- **Audite completamente**: Revise todos os arquivos agrupados na Skill: SKILL.md, scripts, imagens e outros recursos. Procure por padrões incomuns como chamadas de rede inesperadas, padrões de acesso a arquivos ou operações que não correspondem ao propósito declarado da Skill
- **Fontes externas são arriscadas**: Skills que buscam dados de URLs externas apresentam risco particular, pois conteúdo buscado pode conter instruções maliciosas. Mesmo Skills confiáveis podem ser comprometidas se suas dependências externas mudarem ao longo do tempo
- **Uso indevido de ferramentas**: Skills maliciosas podem invocar ferramentas (operações de arquivo, comandos bash, execução de código) de formas prejudiciais
- **Exposição de dados**: Skills com acesso a dados sensíveis podem ser projetadas para vazar informações para sistemas externos
- **Trate como instalar software**: Use apenas Skills de fontes confiáveis. Tenha especial cuidado ao integrar Skills em sistemas de produção com acesso a dados sensíveis ou operações críticas

## Available Skills

### Agent Skills pré-construídas

As seguintes Agent Skills pré-construídas estão disponíveis para uso imediato:

- **PowerPoint (pptx)**: Crie apresentações, edite slides, analise conteúdo de apresentação
- **Excel (xlsx)**: Crie planilhas, analise dados, gere relatórios com gráficos
- **Word (docx)**: Crie documentos, edite conteúdo, formate texto
- **PDF (pdf)**: Gere documentos PDF formatados e relatórios

Essas Skills estão disponíveis na Claude API e claude.ai. Veja o [tutorial de início rápido](/docs/pt-BR/agents-and-tools/agent-skills/quickstart) para começar a usá-las na API.

### Exemplos de Custom Skills

Para exemplos completos de Custom Skills, veja o [Skills cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills).

## Limitações e restrições

Entender essas limitações ajuda você a planejar sua implantação de Skills efetivamente.

### Disponibilidade entre superfícies

**Custom Skills não sincronizam entre superfícies**. Skills carregadas em uma superfície não estão automaticamente disponíveis em outras:

- Skills carregadas em Claude.ai devem ser carregadas separadamente na API
- Skills carregadas via API não estão disponíveis em Claude.ai
- Skills de Claude Code são baseadas em sistema de arquivos e separadas de Claude.ai e API

Você precisará gerenciar e carregar Skills separadamente para cada superfície onde deseja usá-las.

### Escopo de compartilhamento

Skills têm diferentes modelos de compartilhamento dependendo de onde você as usa:
- **Claude.ai**: Apenas usuário individual; cada membro da equipe deve carregar separadamente
- **Claude API**: Em toda a área de trabalho; todos os membros da área de trabalho podem acessar Skills carregadas
- **Claude Code**: Pessoal (`~/.claude/skills/`) ou baseado em projeto (`.claude/skills/`)

Claude.ai não suporta atualmente gerenciamento centralizado de administrador ou distribuição em toda a organização de Custom Skills.

### Restrições de ambiente de tempo de execução

Skills executam no contêiner de execução de código com essas limitações:

- **Sem acesso à rede**: Skills não podem fazer chamadas de API externas ou acessar a internet
- **Sem instalação de pacote em tempo de execução**: Apenas pacotes pré-instalados estão disponíveis. Você não pode instalar novos pacotes durante a execução.
- **Apenas dependências pré-configuradas**: Verifique a [documentação da ferramenta de execução de código](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool) para a lista de pacotes disponíveis

Planeje suas Skills para funcionar dentro dessas restrições.

## Próximos passos

<CardGroup cols={2}>
  <Card
    title="Comece com Agent Skills"
    icon="graduation-cap"
    href="/docs/pt-BR/agents-and-tools/agent-skills/quickstart"
  >
    Crie sua primeira Skill
  </Card>
  <Card
    title="Guia de API"
    icon="code"
    href="/docs/pt-BR/build-with-claude/skills-guide"
  >
    Use Skills com a Claude API
  </Card>
  <Card
    title="Use Skills em Claude Code"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Crie e gerencie Custom Skills em Claude Code
  </Card>
  <Card
    title="Use Skills no Agent SDK"
    icon="cube"
    href="/docs/pt-BR/agent-sdk/skills"
  >
    Use Skills programaticamente em TypeScript e Python
  </Card>
  <Card
    title="Melhores práticas de autoria"
    icon="lightbulb"
    href="/docs/pt-BR/agents-and-tools/agent-skills/best-practices"
  >
    Escreva Skills que Claude pode usar efetivamente
  </Card>
</CardGroup>