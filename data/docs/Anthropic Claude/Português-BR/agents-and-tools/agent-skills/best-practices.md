# Melhores práticas de autoria de Skills

Aprenda como escrever Skills eficazes que Claude pode descobrir e usar com sucesso.

---

Skills boas são concisas, bem estruturadas e testadas com uso real. Este guia fornece decisões práticas de autoria para ajudá-lo a escrever Skills que Claude possa descobrir e usar efetivamente.

Para informações conceituais sobre como Skills funcionam, consulte a [visão geral de Skills](/docs/pt-BR/agents-and-tools/agent-skills/overview).

## Princípios principais

### Concisão é fundamental

A [janela de contexto](/docs/pt-BR/build-with-claude/context-windows) é um bem público. Sua Skill compartilha a janela de contexto com tudo mais que Claude precisa saber, incluindo:
- O prompt do sistema
- Histórico de conversa
- Metadados de outras Skills
- Sua solicitação real

Nem todo token em sua Skill tem um custo imediato. Na inicialização, apenas os metadados (nome e descrição) de todas as Skills são pré-carregados. Claude lê SKILL.md apenas quando a Skill se torna relevante, e lê arquivos adicionais conforme necessário. No entanto, ser conciso em SKILL.md ainda importa: uma vez que Claude a carrega, cada token compete com o histórico de conversa e outro contexto.

**Suposição padrão**: Claude já é muito inteligente

Adicione apenas contexto que Claude não tenha. Questione cada informação:
- "Claude realmente precisa dessa explicação?"
- "Posso assumir que Claude sabe disso?"
- "Este parágrafo justifica seu custo em tokens?"

**Bom exemplo: Conciso** (aproximadamente 50 tokens):
````markdown
## Extrair texto de PDF

Use pdfplumber para extração de texto:

```python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
````

**Mau exemplo: Muito verboso** (aproximadamente 150 tokens):
```markdown
## Extrair texto de PDF

PDF (Portable Document Format) são um formato de arquivo comum que contém
texto, imagens e outro conteúdo. Para extrair texto de um PDF, você precisará
usar uma biblioteca. Existem muitas bibliotecas disponíveis para processamento
de PDF, mas recomendamos pdfplumber porque é fácil de usar e funciona bem na
maioria dos casos. Primeiro, você precisará instalá-la usando pip. Então você
pode usar o código abaixo...
```

A versão concisa assume que Claude sabe o que são PDFs e como as bibliotecas funcionam.

### Defina graus apropriados de liberdade

Corresponda o nível de especificidade à fragilidade e variabilidade da tarefa.

**Alta liberdade** (instruções baseadas em texto):

Use quando:
- Múltiplas abordagens são válidas
- Decisões dependem do contexto
- Heurísticas guiam a abordagem

Exemplo:
```markdown
## Processo de revisão de código

1. Analise a estrutura e organização do código
2. Verifique possíveis bugs ou casos extremos
3. Sugira melhorias para legibilidade e manutenibilidade
4. Verifique a aderência às convenções do projeto
```

**Liberdade média** (pseudocódigo ou scripts com parâmetros):

Use quando:
- Um padrão preferido existe
- Alguma variação é aceitável
- A configuração afeta o comportamento

Exemplo:
````markdown
## Gerar relatório

Use este modelo e customize conforme necessário:

```python
def generate_report(data, format="markdown", include_charts=True):
    # Processar dados
    # Gerar saída no formato especificado
    # Opcionalmente incluir visualizações
```
````

**Baixa liberdade** (scripts específicos, poucos ou nenhum parâmetro):

Use quando:
- Operações são frágeis e propensas a erros
- Consistência é crítica
- Uma sequência específica deve ser seguida

Exemplo:
````markdown
## Migração de banco de dados

Execute exatamente este script:

```bash
python scripts/migrate.py --verify --backup
```

Não modifique o comando ou adicione flags adicionais.
````

**Analogia**: Pense em Claude como um robô explorando um caminho:
- **Ponte estreita com precipícios em ambos os lados**: Há apenas um caminho seguro para frente. Forneça proteções específicas e instruções exatas (baixa liberdade). Exemplo: migrações de banco de dados que devem ser executadas em sequência exata.
- **Campo aberto sem perigos**: Muitos caminhos levam ao sucesso. Dê direção geral e confie que Claude encontrará a melhor rota (alta liberdade). Exemplo: revisões de código onde o contexto determina a melhor abordagem.

### Teste com todos os modelos que você planeja usar

Skills atuam como adições aos modelos, então a eficácia depende do modelo subjacente. Teste sua Skill com todos os modelos que você planeja usá-la.

**Considerações de teste por modelo**:
- **Claude Haiku** (rápido, econômico): A Skill fornece orientação suficiente?
- **Claude Sonnet** (equilibrado): A Skill é clara e eficiente?
- **Claude Opus** (raciocínio poderoso): A Skill evita sobre-explicar?

O que funciona perfeitamente para Opus pode precisar de mais detalhes para Haiku. Se você planeja usar sua Skill em múltiplos modelos, procure por instruções que funcionem bem com todos eles.

## Estrutura de Skill

<Note>
**Frontmatter YAML**: O frontmatter de SKILL.md requer dois campos:

`name`:
- Máximo 64 caracteres
- Deve conter apenas letras minúsculas, números e hífens
- Não pode conter tags XML
- Não pode conter palavras reservadas: "anthropic", "claude"

`description`:
- Deve ser não-vazio
- Máximo 1024 caracteres
- Não pode conter tags XML
- Deve descrever o que a Skill faz e quando usá-la

Para detalhes completos da estrutura de Skill, consulte a [visão geral de Skills](/docs/pt-BR/agents-and-tools/agent-skills/overview#skill-structure).
</Note>

### Convenções de nomenclatura

Use padrões de nomenclatura consistentes para facilitar a referência e discussão de Skills. Recomendamos usar **forma de gerúndio** (verbo + -ing) para nomes de Skills, pois isso descreve claramente a atividade ou capacidade que a Skill fornece.

Lembre-se de que o campo `name` deve usar apenas letras minúsculas, números e hífens.

**Bons exemplos de nomenclatura (forma de gerúndio)**:
- `processing-pdfs`
- `analyzing-spreadsheets`
- `managing-databases`
- `testing-code`
- `writing-documentation`

**Alternativas aceitáveis**:
- Frases nominais: `pdf-processing`, `spreadsheet-analysis`
- Orientado por ação: `process-pdfs`, `analyze-spreadsheets`

**Evite**:
- Nomes vagos: `helper`, `utils`, `tools`
- Muito genérico: `documents`, `data`, `files`
- Palavras reservadas: `anthropic-helper`, `claude-tools`
- Padrões inconsistentes dentro de sua coleção de skills

Nomenclatura consistente facilita:
- Referenciar Skills em documentação e conversas
- Entender o que uma Skill faz à primeira vista
- Organizar e pesquisar através de múltiplas Skills
- Manter uma biblioteca de skills profissional e coesa

### Escrevendo descrições eficazes

O campo `description` permite a descoberta de Skill e deve incluir tanto o que a Skill faz quanto quando usá-la.

<Warning>
**Sempre escreva em terceira pessoa**. A descrição é injetada no prompt do sistema, e ponto de vista inconsistente pode causar problemas de descoberta.

- **Bom:** "Processa arquivos Excel e gera relatórios"
- **Evite:** "Posso ajudá-lo a processar arquivos Excel"
- **Evite:** "Você pode usar isso para processar arquivos Excel"
</Warning>

**Seja específico e inclua termos-chave**. Inclua tanto o que a Skill faz quanto gatilhos/contextos específicos para quando usá-la.

Cada Skill tem exatamente um campo de descrição. A descrição é crítica para seleção de skill: Claude a usa para escolher a Skill certa de potencialmente 100+ Skills disponíveis. Sua descrição deve fornecer detalhes suficientes para Claude saber quando selecionar esta Skill, enquanto o resto de SKILL.md fornece os detalhes de implementação.

Exemplos eficazes:

**Skill de processamento de PDF:**
```yaml
description: Extrai texto e tabelas de arquivos PDF, preenche formulários, mescla documentos. Use ao trabalhar com arquivos PDF ou quando o usuário menciona PDFs, formulários ou extração de documentos.
```

**Skill de análise de Excel:**
```yaml
description: Analisa planilhas Excel, cria tabelas dinâmicas, gera gráficos. Use ao analisar arquivos Excel, planilhas, dados tabulares ou arquivos .xlsx.
```

**Skill de auxiliar de commit Git:**
```yaml
description: Gera mensagens de commit descritivas analisando diffs do git. Use quando o usuário pede ajuda para escrever mensagens de commit ou revisar alterações preparadas.
```

Evite descrições vagas como estas:

```yaml
description: Ajuda com documentos
```
```yaml
description: Processa dados
```
```yaml
description: Faz coisas com arquivos
```

### Padrões de divulgação progressiva

SKILL.md serve como uma visão geral que aponta Claude para materiais detalhados conforme necessário, como um índice em um guia de integração. Para uma explicação de como a divulgação progressiva funciona, consulte [Como Skills funcionam](/docs/pt-BR/agents-and-tools/agent-skills/overview#how-skills-work) na visão geral.

**Orientação prática:**
- Mantenha o corpo de SKILL.md abaixo de 500 linhas para desempenho ideal
- Divida o conteúdo em arquivos separados ao se aproximar deste limite
- Use os padrões abaixo para organizar instruções, código e recursos efetivamente

#### Visão geral visual: Do simples ao complexo

Uma Skill básica começa com apenas um arquivo SKILL.md contendo metadados e instruções:

![Arquivo SKILL.md simples mostrando frontmatter YAML e corpo markdown](/docs/images/agent-skills-simple-file.png)

Conforme sua Skill cresce, você pode agrupar conteúdo adicional que Claude carrega apenas quando necessário:

![Agrupando arquivos de referência adicionais como reference.md e forms.md.](/docs/images/agent-skills-bundling-content.png)

A estrutura de diretório completa de Skill pode parecer assim:

```
pdf/
├── SKILL.md              # Instruções principais (carregadas quando acionadas)
├── FORMS.md              # Guia de preenchimento de formulário (carregado conforme necessário)
├── reference.md          # Referência de API (carregada conforme necessário)
├── examples.md           # Exemplos de uso (carregados conforme necessário)
└── scripts/
    ├── analyze_form.py   # Script utilitário (executado, não carregado)
    ├── fill_form.py      # Script de preenchimento de formulário
    └── validate.py       # Script de validação
```

#### Padrão 1: Guia de alto nível com referências

````markdown
---
name: pdf-processing
description: Extrai texto e tabelas de arquivos PDF, preenche formulários e mescla documentos. Use ao trabalhar com arquivos PDF ou quando o usuário menciona PDFs, formulários ou extração de documentos.
---

# Processamento de PDF

## Início rápido

Extraia texto com pdfplumber:
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

## Recursos avançados

**Preenchimento de formulário**: Consulte [FORMS.md](FORMS.md) para guia completo
**Referência de API**: Consulte [REFERENCE.md](REFERENCE.md) para todos os métodos
**Exemplos**: Consulte [EXAMPLES.md](EXAMPLES.md) para padrões comuns
````

Claude carrega FORMS.md, REFERENCE.md ou EXAMPLES.md apenas quando necessário.

#### Padrão 2: Organização específica de domínio

Para Skills com múltiplos domínios, organize o conteúdo por domínio para evitar carregar contexto irrelevante. Quando um usuário pergunta sobre métricas de vendas, Claude só precisa ler esquemas relacionados a vendas, não dados de finanças ou marketing. Isso mantém o uso de tokens baixo e o contexto focado.

```
bigquery-skill/
├── SKILL.md (visão geral e navegação)
└── reference/
    ├── finance.md (receita, métricas de faturamento)
    ├── sales.md (oportunidades, pipeline)
    ├── product.md (uso de API, recursos)
    └── marketing.md (campanhas, atribuição)
```

````markdown SKILL.md
# Análise de dados BigQuery

## Conjuntos de dados disponíveis

**Finanças**: Receita, ARR, faturamento → Consulte [reference/finance.md](reference/finance.md)
**Vendas**: Oportunidades, pipeline, contas → Consulte [reference/sales.md](reference/sales.md)
**Produto**: Uso de API, recursos, adoção → Consulte [reference/product.md](reference/product.md)
**Marketing**: Campanhas, atribuição, email → Consulte [reference/marketing.md](reference/marketing.md)

## Busca rápida

Encontre métricas específicas usando grep:

```bash
grep -i "revenue" reference/finance.md
grep -i "pipeline" reference/sales.md
grep -i "api usage" reference/product.md
```
````

#### Padrão 3: Detalhes condicionais

Mostre conteúdo básico, vincule a conteúdo avançado:

```markdown
# Processamento de DOCX

## Criando documentos

Use docx-js para novos documentos. Consulte [DOCX-JS.md](DOCX-JS.md).

## Editando documentos

Para edições simples, modifique o XML diretamente.

**Para alterações rastreadas**: Consulte [REDLINING.md](REDLINING.md)
**Para detalhes de OOXML**: Consulte [OOXML.md](OOXML.md)
```

Claude lê REDLINING.md ou OOXML.md apenas quando o usuário precisa desses recursos.

### Evite referências profundamente aninhadas

Claude pode ler parcialmente arquivos quando são referenciados de outros arquivos referenciados. Ao encontrar referências aninhadas, Claude pode usar comandos como `head -100` para visualizar conteúdo em vez de ler arquivos inteiros, resultando em informações incompletas.

**Mantenha referências um nível de profundidade de SKILL.md**. Todos os arquivos de referência devem vincular diretamente de SKILL.md para garantir que Claude leia arquivos completos quando necessário.

**Mau exemplo: Muito profundo**:
```markdown
# SKILL.md
Consulte [advanced.md](advanced.md)...

# advanced.md
Consulte [details.md](details.md)...

# details.md
Aqui está a informação real...
```

**Bom exemplo: Um nível de profundidade**:
```markdown
# SKILL.md

**Uso básico**: [instruções em SKILL.md]
**Recursos avançados**: Consulte [advanced.md](advanced.md)
**Referência de API**: Consulte [reference.md](reference.md)
**Exemplos**: Consulte [examples.md](examples.md)
```

### Estruture arquivos de referência mais longos com índice

Para arquivos de referência com mais de 100 linhas, inclua um índice no topo. Isso garante que Claude possa ver o escopo completo de informações disponíveis mesmo ao visualizar com leituras parciais.

**Exemplo**:
```markdown
# Referência de API

## Conteúdo
- Autenticação e configuração
- Métodos principais (criar, ler, atualizar, deletar)
- Recursos avançados (operações em lote, webhooks)
- Padrões de tratamento de erros
- Exemplos de código

## Autenticação e configuração
...

## Métodos principais
...
```

Claude pode então ler o arquivo completo ou pular para seções específicas conforme necessário.

Para detalhes sobre como essa arquitetura baseada em sistema de arquivos permite divulgação progressiva, consulte a seção [Ambiente de execução](#runtime-environment) na seção Avançado abaixo.

## Fluxos de trabalho e loops de feedback

### Use fluxos de trabalho para tarefas complexas

Divida operações complexas em etapas claras e sequenciais. Para fluxos de trabalho particularmente complexos, forneça uma lista de verificação que Claude possa copiar em sua resposta e marcar conforme progride.

**Exemplo 1: Fluxo de trabalho de síntese de pesquisa** (para Skills sem código):

````markdown
## Fluxo de trabalho de síntese de pesquisa

Copie esta lista de verificação e rastreie seu progresso:

```
Progresso da Pesquisa:
- [ ] Etapa 1: Leia todos os documentos de origem
- [ ] Etapa 2: Identifique temas principais
- [ ] Etapa 3: Referência cruzada de afirmações
- [ ] Etapa 4: Crie resumo estruturado
- [ ] Etapa 5: Verifique citações
```

**Etapa 1: Leia todos os documentos de origem**

Revise cada documento no diretório `sources/`. Anote os argumentos principais e evidências de suporte.

**Etapa 2: Identifique temas principais**

Procure por padrões entre fontes. Quais temas aparecem repetidamente? Onde as fontes concordam ou discordam?

**Etapa 3: Referência cruzada de afirmações**

Para cada afirmação principal, verifique se aparece no material de origem. Anote qual fonte suporta cada ponto.

**Etapa 4: Crie resumo estruturado**

Organize descobertas por tema. Inclua:
- Afirmação principal
- Evidência de suporte de fontes
- Pontos de vista conflitantes (se houver)

**Etapa 5: Verifique citações**

Verifique se cada afirmação referencia o documento de origem correto. Se as citações estiverem incompletas, retorne à Etapa 3.
````

Este exemplo mostra como fluxos de trabalho se aplicam a tarefas de análise que não requerem código. O padrão de lista de verificação funciona para qualquer processo complexo e multi-etapas.

**Exemplo 2: Fluxo de trabalho de preenchimento de formulário PDF** (para Skills com código):

````markdown
## Fluxo de trabalho de preenchimento de formulário PDF

Copie esta lista de verificação e marque itens conforme os completa:

```
Progresso da Tarefa:
- [ ] Etapa 1: Analise o formulário (execute analyze_form.py)
- [ ] Etapa 2: Crie mapeamento de campo (edite fields.json)
- [ ] Etapa 3: Valide mapeamento (execute validate_fields.py)
- [ ] Etapa 4: Preencha o formulário (execute fill_form.py)
- [ ] Etapa 5: Verifique saída (execute verify_output.py)
```

**Etapa 1: Analise o formulário**

Execute: `python scripts/analyze_form.py input.pdf`

Isso extrai campos de formulário e suas localizações, salvando em `fields.json`.

**Etapa 2: Crie mapeamento de campo**

Edite `fields.json` para adicionar valores para cada campo.

**Etapa 3: Valide mapeamento**

Execute: `python scripts/validate_fields.py fields.json`

Corrija erros de validação antes de continuar.

**Etapa 4: Preencha o formulário**

Execute: `python scripts/fill_form.py input.pdf fields.json output.pdf`

**Etapa 5: Verifique saída**

Execute: `python scripts/verify_output.py output.pdf`

Se a verificação falhar, retorne à Etapa 2.
````

Etapas claras evitam que Claude pule validação crítica. A lista de verificação ajuda tanto Claude quanto você a rastrear o progresso através de fluxos de trabalho multi-etapas.

### Implemente loops de feedback

**Padrão comum**: Execute validador → corrija erros → repita

Este padrão melhora muito a qualidade da saída.

**Exemplo 1: Conformidade com guia de estilo** (para Skills sem código):

```markdown
## Processo de revisão de conteúdo

1. Rascunhe seu conteúdo seguindo as diretrizes em STYLE_GUIDE.md
2. Revise contra a lista de verificação:
   - Verifique consistência de terminologia
   - Verifique se exemplos seguem o formato padrão
   - Confirme que todas as seções necessárias estão presentes
3. Se problemas encontrados:
   - Anote cada problema com referência de seção específica
   - Revise o conteúdo
   - Revise a lista de verificação novamente
4. Proceda apenas quando todos os requisitos forem atendidos
5. Finalize e salve o documento
```

Isso mostra o padrão de loop de validação usando documentos de referência em vez de scripts. O "validador" é STYLE_GUIDE.md, e Claude realiza a verificação lendo e comparando.

**Exemplo 2: Processo de edição de documento** (para Skills com código):

```markdown
## Processo de edição de documento

1. Faça suas edições em `word/document.xml`
2. **Valide imediatamente**: `python ooxml/scripts/validate.py unpacked_dir/`
3. Se a validação falhar:
   - Revise a mensagem de erro cuidadosamente
   - Corrija os problemas no XML
   - Execute a validação novamente
4. **Proceda apenas quando a validação passar**
5. Reconstrua: `python ooxml/scripts/pack.py unpacked_dir/ output.docx`
6. Teste o documento de saída
```

O loop de validação captura erros cedo.

## Diretrizes de conteúdo

### Evite informações sensíveis ao tempo

Não inclua informações que ficarão desatualizadas:

**Mau exemplo: Sensível ao tempo** (ficará errado):
```markdown
Se você estiver fazendo isso antes de agosto de 2025, use a API antiga.
Após agosto de 2025, use a nova API.
```

**Bom exemplo** (use seção "padrões antigos"):
```markdown
## Método atual

Use o endpoint da API v2: `api.example.com/v2/messages`

## Padrões antigos

<details>
<summary>API v1 legada (descontinuada 2025-08)</summary>

A API v1 usava: `api.example.com/v1/messages`

Este endpoint não é mais suportado.
</details>
```

A seção de padrões antigos fornece contexto histórico sem desorganizar o conteúdo principal.

### Use terminologia consistente

Escolha um termo e use-o em toda a Skill:

**Bom - Consistente**:
- Sempre "endpoint de API"
- Sempre "campo"
- Sempre "extrair"

**Ruim - Inconsistente**:
- Misture "endpoint de API", "URL", "rota de API", "caminho"
- Misture "campo", "caixa", "elemento", "controle"
- Misture "extrair", "puxar", "obter", "recuperar"

Consistência ajuda Claude a entender e seguir instruções.

## Padrões comuns

### Padrão de modelo

Forneça modelos para formato de saída. Corresponda o nível de rigidez às suas necessidades.

**Para requisitos estritos** (como respostas de API ou formatos de dados):

````markdown
## Estrutura de relatório

SEMPRE use esta estrutura de modelo exata:

```markdown
# [Título da Análise]

## Resumo executivo
[Visão geral de um parágrafo das descobertas principais]

## Descobertas principais
- Descoberta 1 com dados de suporte
- Descoberta 2 com dados de suporte
- Descoberta 3 com dados de suporte

## Recomendações
1. Recomendação acionável específica
2. Recomendação acionável específica
```
````

**Para orientação flexível** (quando adaptação é útil):

````markdown
## Estrutura de relatório

Aqui está um formato padrão sensato, mas use seu melhor julgamento com base na análise:

```markdown
# [Título da Análise]

## Resumo executivo
[Visão geral]

## Descobertas principais
[Adapte seções com base no que você descobrir]

## Recomendações
[Personalize para o contexto específico]
```

Ajuste seções conforme necessário para o tipo de análise específico.
````

### Padrão de exemplos

Para Skills onde a qualidade da saída depende de ver exemplos, forneça pares entrada/saída assim como em prompting regular:

````markdown
## Formato de mensagem de commit

Gere mensagens de commit seguindo estes exemplos:

**Exemplo 1:**
Entrada: Adicionada autenticação de usuário com tokens JWT
Saída:
```
feat(auth): implementar autenticação baseada em JWT

Adicionar endpoint de login e middleware de validação de token
```

**Exemplo 2:**
Entrada: Corrigido bug onde datas eram exibidas incorretamente em relatórios
Saída:
```
fix(reports): corrigir formatação de data na conversão de fuso horário

Usar timestamps UTC consistentemente em toda a geração de relatórios
```

**Exemplo 3:**
Entrada: Atualizadas dependências e refatorado tratamento de erros
Saída:
```
chore: atualizar dependências e refatorar tratamento de erros

- Atualizar lodash para 4.17.21
- Padronizar formato de resposta de erro em todos os endpoints
```

Siga este estilo: tipo(escopo): descrição breve, depois explicação detalhada.
````

Exemplos ajudam Claude a entender o estilo desejado e nível de detalhe mais claramente do que apenas descrições.

### Padrão de fluxo de trabalho condicional

Guie Claude através de pontos de decisão:

```markdown
## Fluxo de trabalho de modificação de documento

1. Determine o tipo de modificação:

   **Criando novo conteúdo?** → Siga "Fluxo de trabalho de criação" abaixo
   **Editando conteúdo existente?** → Siga "Fluxo de trabalho de edição" abaixo

2. Fluxo de trabalho de criação:
   - Use biblioteca docx-js
   - Construa documento do zero
   - Exporte para formato .docx

3. Fluxo de trabalho de edição:
   - Desempacote documento existente
   - Modifique XML diretamente
   - Valide após cada alteração
   - Reempacote quando completo
```

<Tip>
Se fluxos de trabalho ficarem grandes ou complicados com muitas etapas, considere movê-los para arquivos separados e diga a Claude para ler o arquivo apropriado com base na tarefa em questão.
</Tip>

## Avaliação e iteração

### Construa avaliações primeiro

**Crie avaliações ANTES de escrever documentação extensa.** Isso garante que sua Skill resolva problemas reais em vez de documentar imaginários.

**Desenvolvimento orientado por avaliação:**
1. **Identifique lacunas**: Execute Claude em tarefas representativas sem uma Skill. Documente falhas específicas ou contexto faltante
2. **Crie avaliações**: Construa três cenários que testem essas lacunas
3. **Estabeleça linha de base**: Meça o desempenho de Claude sem a Skill
4. **Escreva instruções mínimas**: Crie apenas conteúdo suficiente para abordar as lacunas e passar nas avaliações
5. **Itere**: Execute avaliações, compare com linha de base e refine

Esta abordagem garante que você está resolvendo problemas reais em vez de antecipar requisitos que podem nunca se materializar.

**Estrutura de avaliação**:
```json
{
  "skills": ["pdf-processing"],
  "query": "Extraia todo o texto deste arquivo PDF e salve-o em output.txt",
  "files": ["test-files/document.pdf"],
  "expected_behavior": [
    "Lê com sucesso o arquivo PDF usando uma biblioteca apropriada de processamento de PDF ou ferramenta de linha de comando",
    "Extrai conteúdo de texto de todas as páginas no documento sem perder nenhuma página",
    "Salva o texto extraído em um arquivo chamado output.txt em um formato claro e legível"
  ]
}
```

<Note>
Este exemplo demonstra uma avaliação orientada por dados com uma rubrica de teste simples. Atualmente não fornecemos uma forma integrada de executar essas avaliações. Os usuários podem criar seu próprio sistema de avaliação. Avaliações são sua fonte de verdade para medir a eficácia de Skill.
</Note>

### Desenvolva Skills iterativamente com Claude

O processo mais eficaz de desenvolvimento de Skill envolve Claude em si. Trabalhe com uma instância de Claude ("Claude A") para criar uma Skill que será usada por outras instâncias ("Claude B"). Claude A ajuda você a projetar e refinar instruções, enquanto Claude B as testa em tarefas reais. Isso funciona porque modelos Claude entendem tanto como escrever instruções eficazes de agente quanto que informações os agentes precisam.

**Criando uma nova Skill:**

1. **Complete uma tarefa sem uma Skill**: Trabalhe através de um problema com Claude A usando prompting normal. Conforme você trabalha, você naturalmente fornecerá contexto, explicará preferências e compartilhará conhecimento procedural. Observe que informações você fornece repetidamente.

2. **Identifique o padrão reutilizável**: Após completar a tarefa, identifique que contexto você forneceu que seria útil para tarefas futuras similares.

   **Exemplo**: Se você trabalhou através de uma análise BigQuery, você pode ter fornecido nomes de tabelas, definições de campo, regras de filtragem (como "sempre excluir contas de teste") e padrões de consulta comuns.

3. **Peça a Claude A para criar uma Skill**: "Crie uma Skill que capture este padrão de análise BigQuery que acabamos de usar. Inclua os esquemas de tabela, convenções de nomenclatura e a regra sobre filtragem de contas de teste."

   <Tip>
   Modelos Claude entendem o formato e estrutura de Skill nativamente. Você não precisa de prompts de sistema especiais ou uma "skill de escrita de skills" para conseguir que Claude ajude a criar Skills. Simplesmente peça a Claude para criar uma Skill e ela gerará conteúdo SKILL.md adequadamente estruturado com frontmatter apropriado e conteúdo de corpo.
   </Tip>

4. **Revise por concisão**: Verifique que Claude A não adicionou explicações desnecessárias. Pergunte: "Remova a explicação sobre o que taxa de vitória significa - Claude já sabe disso."

5. **Melhore arquitetura de informação**: Peça a Claude A para organizar o conteúdo mais efetivamente. Por exemplo: "Organize isso para que o esquema de tabela esteja em um arquivo de referência separado. Podemos adicionar mais tabelas depois."

6. **Teste em tarefas similares**: Use a Skill com Claude B (uma instância fresca com a Skill carregada) em casos de uso relacionados. Observe se Claude B encontra a informação certa, aplica regras corretamente e lida com a tarefa com sucesso.

7. **Itere com base em observação**: Se Claude B lutar ou perder algo, retorne a Claude A com especificidades: "Quando Claude usou esta Skill, esqueceu de filtrar por data para Q4. Devemos adicionar uma seção sobre padrões de filtragem de data?"

**Iterando em Skills existentes:**

O mesmo padrão hierárquico continua ao melhorar Skills. Você alterna entre:
- **Trabalhar com Claude A** (o especialista que ajuda a refinar a Skill)
- **Testar com Claude B** (o agente usando a Skill para realizar trabalho real)
- **Observar comportamento de Claude B** e trazer insights de volta a Claude A

1. **Use a Skill em fluxos de trabalho reais**: Dê a Claude B (com a Skill carregada) tarefas reais, não cenários de teste

2. **Observe o comportamento de Claude B**: Anote onde ele lutar, suceder ou fazer escolhas inesperadas

   **Exemplo de observação**: "Quando pedi a Claude B um relatório de vendas regional, ele escreveu a consulta mas esqueceu de filtrar contas de teste, mesmo que a Skill mencione esta regra."

3. **Retorne a Claude A para melhorias**: Compartilhe o SKILL.md atual e descreva o que você observou. Pergunte: "Observei que Claude B esqueceu de filtrar contas de teste quando pedi um relatório regional. A Skill menciona filtragem, mas talvez não seja proeminente o suficiente?"

4. **Revise sugestões de Claude A**: Claude A pode sugerir reorganizar para tornar regras mais proeminentes, usar linguagem mais forte como "DEVE filtrar" em vez de "sempre filtrar", ou reestruturar a seção de fluxo de trabalho.

5. **Aplique e teste mudanças**: Atualize a Skill com refinamentos de Claude A, depois teste novamente com Claude B em solicitações similares

6. **Repita com base em uso**: Continue este ciclo de observar-refinar-testar conforme você encontra novos cenários. Cada iteração melhora a Skill com base em comportamento real de agente, não suposições.

**Coletando feedback de equipe:**

1. Compartilhe Skills com colegas de equipe e observe seu uso
2. Pergunte: A Skill é acionada quando esperado? As instruções são claras? O que está faltando?
3. Incorpore feedback para abordar pontos cegos em seus próprios padrões de uso

**Por que esta abordagem funciona**: Claude A entende necessidades de agente, você fornece expertise de domínio, Claude B revela lacunas através de uso real, e refinamento iterativo melhora Skills com base em comportamento observado em vez de suposições.

### Observe como Claude navega Skills

Conforme você itera em Skills, preste atenção em como Claude realmente as usa na prática. Observe:

- **Caminhos de exploração inesperados**: Claude lê arquivos em uma ordem que você não antecipou? Isso pode indicar que sua estrutura não é tão intuitiva quanto você pensava
- **Conexões perdidas**: Claude falha em seguir referências para arquivos importantes? Seus links podem precisar ser mais explícitos ou proeminentes
- **Dependência excessiva de certas seções**: Se Claude repetidamente lê o mesmo arquivo, considere se esse conteúdo deveria estar no SKILL.md principal em vez disso
- **Conteúdo ignorado**: Se Claude nunca acessa um arquivo agrupado, pode ser desnecessário ou mal sinalizado nas instruções principais

Itere com base nessas observações em vez de suposições. O 'name' e 'description' nos metadados de sua Skill são particularmente críticos. Claude os usa ao decidir se acionar a Skill em resposta à tarefa atual. Certifique-se de que descrevem claramente o que a Skill faz e quando deve ser usada.

## Anti-padrões a evitar

### Evite caminhos de estilo Windows

Sempre use barras para frente em caminhos de arquivo, mesmo no Windows:

- ✓ **Bom**: `scripts/helper.py`, `reference/guide.md`
- ✗ **Evite**: `scripts\helper.py`, `reference\guide.md`

Caminhos de estilo Unix funcionam em todas as plataformas, enquanto caminhos de estilo Windows causam erros em sistemas Unix.

### Evite oferecer muitas opções

Não apresente múltiplas abordagens a menos que necessário:

````markdown
**Mau exemplo: Muitas escolhas** (confuso):
"Você pode usar pypdf, ou pdfplumber, ou PyMuPDF, ou pdf2image, ou..."

**Bom exemplo: Forneça um padrão** (com escape hatch):
"Use pdfplumber para extração de texto:
```python
import pdfplumber
```

Para PDFs digitalizados que requerem OCR, use pdf2image com pytesseract em vez disso."
````

## Avançado: Skills com código executável

As seções abaixo focam em Skills que incluem scripts executáveis. Se sua Skill usa apenas instruções markdown, pule para [Lista de verificação para Skills eficazes](#checklist-for-effective-skills).

### Resolva, não transfira

Ao escrever scripts para Skills, trate condições de erro em vez de transferir para Claude.

**Bom exemplo: Trate erros explicitamente**:
```python
def process_file(path):
    """Processa um arquivo, criando-o se não existir."""
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        # Crie arquivo com conteúdo padrão em vez de falhar
        print(f"Arquivo {path} não encontrado, criando padrão")
        with open(path, 'w') as f:
            f.write('')
        return ''
    except PermissionError:
        # Forneça alternativa em vez de falhar
        print(f"Não é possível acessar {path}, usando padrão")
        return ''
```

**Mau exemplo: Transfira para Claude**:
```python
def process_file(path):
    # Apenas falhe e deixe Claude descobrir
    return open(path).read()
```

Parâmetros de configuração também devem ser justificados e documentados para evitar "constantes voodoo" (lei de Ousterhout). Se você não sabe o valor certo, como Claude o determinará?

**Bom exemplo: Auto-documentado**:
```python
# Requisições HTTP normalmente completam em 30 segundos
# Timeout mais longo considera conexões lentas
REQUEST_TIMEOUT = 30

# Três tentativas equilibram confiabilidade vs velocidade
# A maioria das falhas intermitentes se resolve na segunda tentativa
MAX_RETRIES = 3
```

**Mau exemplo: Números mágicos**:
```python
TIMEOUT = 47  # Por que 47?
RETRIES = 5   # Por que 5?
```

### Forneça scripts utilitários

Mesmo que Claude pudesse escrever um script, scripts pré-feitos oferecem vantagens:

**Benefícios de scripts utilitários**:
- Mais confiáveis do que código gerado
- Economizam tokens (sem necessidade de incluir código em contexto)
- Economizam tempo (sem geração de código necessária)
- Garantem consistência entre usos

![Agrupando scripts executáveis junto com arquivos de instrução](/docs/images/agent-skills-executable-scripts.png)

O diagrama acima mostra como scripts executáveis funcionam junto com arquivos de instrução. O arquivo de instrução (forms.md) referencia o script, e Claude pode executá-lo sem carregar seu conteúdo em contexto.

**Distinção importante**: Deixe claro em suas instruções se Claude deve:
- **Executar o script** (mais comum): "Execute `analyze_form.py` para extrair campos"
- **Lê-lo como referência** (para lógica complexa): "Consulte `analyze_form.py` para o algoritmo de extração de campo"

Para a maioria dos scripts utilitários, execução é preferida porque é mais confiável e eficiente. Consulte a seção [Ambiente de execução](#runtime-environment) abaixo para detalhes sobre como execução de script funciona.

**Exemplo**:
````markdown
## Scripts utilitários

**analyze_form.py**: Extrai todos os campos de formulário de PDF

```bash
python scripts/analyze_form.py input.pdf > fields.json
```

Formato de saída:
```json
{
  "field_name": {"type": "text", "x": 100, "y": 200},
  "signature": {"type": "sig", "x": 150, "y": 500}
}
```

**validate_boxes.py**: Verifica caixas delimitadoras sobrepostas

```bash
python scripts/validate_boxes.py fields.json
# Retorna: "OK" ou lista conflitos
```

**fill_form.py**: Aplica valores de campo a PDF

```bash
python scripts/fill_form.py input.pdf fields.json output.pdf
```
````

### Use análise visual

Quando entradas podem ser renderizadas como imagens, tenha Claude analisá-las:

````markdown
## Análise de layout de formulário

1. Converta PDF em imagens:
   ```bash
   python scripts/pdf_to_images.py form.pdf
   ```

2. Analise cada imagem de página para identificar campos de formulário
3. Claude pode ver localizações e tipos de campo visualmente
````

<Note>
Neste exemplo, você precisaria escrever o script `pdf_to_images.py`.
</Note>

As capacidades de visão de Claude ajudam a entender layouts e estruturas.

### Crie saídas intermediárias verificáveis

Quando Claude realiza tarefas complexas e abertas, pode cometer erros. O padrão "plano-validar-executar" captura erros cedo tendo Claude primeiro criar um plano em formato estruturado, depois validar esse plano com um script antes de executá-lo.

**Exemplo**: Imagine pedir a Claude para atualizar 50 campos de formulário em um PDF com base em uma planilha. Sem validação, Claude pode referenciar campos inexistentes, criar valores conflitantes, perder campos necessários ou aplicar atualizações incorretamente.

**Solução**: Use o padrão de fluxo de trabalho mostrado acima (preenchimento de formulário PDF), mas adicione um arquivo intermediário `changes.json` que seja validado antes de aplicar alterações. O fluxo de trabalho se torna: analisar → **criar arquivo de plano** → **validar plano** → executar → verificar.

**Por que este padrão funciona:**
- **Captura erros cedo**: Validação encontra problemas antes que alterações sejam aplicadas
- **Verificável por máquina**: Scripts fornecem verificação objetiva
- **Planejamento reversível**: Claude pode iterar no plano sem tocar originais
- **Depuração clara**: Mensagens de erro apontam para problemas específicos

**Quando usar**: Operações em lote, alterações destrutivas, regras de validação complexas, operações de alto risco.

**Dica de implementação**: Faça scripts de validação verbosos com mensagens de erro específicas como "Campo 'signature_date' não encontrado. Campos disponíveis: customer_name, order_total, signature_date_signed" para ajudar Claude a corrigir problemas.

### Empacote dependências

Skills executam no ambiente de execução de código com limitações específicas de plataforma:

- **claude.ai**: Pode instalar pacotes de npm e PyPI e puxar de repositórios GitHub
- **API Anthropic**: Não tem acesso à rede e sem instalação de pacote em tempo de execução

Liste pacotes necessários em seu SKILL.md e verifique se estão disponíveis na [documentação da ferramenta de execução de código](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool).

### Ambiente de execução

Skills executam em um ambiente de execução de código com acesso ao sistema de arquivos, comandos bash e capacidades de execução de código. Para a explicação conceitual dessa arquitetura, consulte [A arquitetura de Skills](/docs/pt-BR/agents-and-tools/agent-skills/overview#the-skills-architecture) na visão geral.

**Como isso afeta sua autoria:**

**Como Claude acessa Skills:**

1. **Metadados pré-carregados**: Na inicialização, o nome e descrição do frontmatter YAML de todas as Skills são carregados no prompt do sistema
2. **Arquivos lidos sob demanda**: Claude usa ferramentas bash Read para acessar SKILL.md e outros arquivos do sistema de arquivos quando necessário
3. **Scripts executados eficientemente**: Scripts utilitários podem ser executados via bash sem carregar seu conteúdo completo em contexto. Apenas a saída do script consome tokens
4. **Sem penalidade de contexto para arquivos grandes**: Arquivos de referência, dados ou documentação não consomem tokens de contexto até serem realmente lidos

- **Caminhos de arquivo importam**: Claude navega seu diretório de skill como um sistema de arquivos. Use barras para frente (`reference/guide.md`), não barras invertidas
- **Nomeie arquivos descritivamente**: Use nomes que indiquem conteúdo: `form_validation_rules.md`, não `doc2.md`
- **Organize para descoberta**: Estruture diretórios por domínio ou recurso
  - Bom: `reference/finance.md`, `reference/sales.md`
  - Ruim: `docs/file1.md`, `docs/file2.md`
- **Agrupe recursos abrangentes**: Inclua documentação de API completa, exemplos extensivos, conjuntos de dados grandes; sem penalidade de contexto até serem acessados
- **Prefira scripts para operações determinísticas**: Escreva `validate_form.py` em vez de pedir a Claude para gerar código de validação
- **Deixe clara a intenção de execução**:
  - "Execute `analyze_form.py` para extrair campos" (executar)
  - "Consulte `analyze_form.py` para o algoritmo de extração" (ler como referência)
- **Teste padrões de acesso a arquivo**: Verifique que Claude pode navegar sua estrutura de diretório testando com solicitações reais

**Exemplo:**

```
bigquery-skill/
├── SKILL.md (visão geral, aponta para arquivos de referência)
└── reference/
    ├── finance.md (métricas de receita)
    ├── sales.md (dados de pipeline)
    └── product.md (análise de uso)
```

Quando o usuário pergunta sobre receita, Claude lê SKILL.md, vê a referência a `reference/finance.md` e invoca bash para ler apenas esse arquivo. Os arquivos sales.md e product.md permanecem no sistema de arquivos, consumindo zero tokens de contexto até serem necessários. Este modelo baseado em sistema de arquivos é o que permite divulgação progressiva. Claude pode navegar e carregar seletivamente exatamente o que cada tarefa requer.

Para detalhes técnicos completos, consulte [Como Skills funcionam](/docs/pt-BR/agents-and-tools/agent-skills/overview#how-skills-work) na visão geral de Skills.

### Referências de ferramenta MCP

Se sua Skill usa ferramentas MCP (Model Context Protocol), sempre use nomes de ferramenta totalmente qualificados para evitar erros "ferramenta não encontrada".

**Formato**: `ServerName:tool_name`

**Exemplo**:
```markdown
Use a ferramenta BigQuery:bigquery_schema para recuperar esquemas de tabela.
Use a ferramenta GitHub:create_issue para criar problemas.
```

Onde:
- `BigQuery` e `GitHub` são nomes de servidor MCP
- `bigquery_schema` e `create_issue` são os nomes de ferramenta dentro desses servidores

Sem o prefixo de servidor, Claude pode falhar em localizar a ferramenta, especialmente quando múltiplos servidores MCP estão disponíveis.

### Evite assumir que ferramentas estão instaladas

Não assuma que pacotes estão disponíveis:

````markdown
**Mau exemplo: Assume instalação**:
"Use a biblioteca pdf para processar o arquivo."

**Bom exemplo: Explícito sobre dependências**:
"Instale pacote necessário: `pip install pypdf`

Então use-o:
```python
from pypdf import PdfReader
reader = PdfReader("file.pdf")
```"
````

## Notas técnicas

### Requisitos de frontmatter YAML

O frontmatter de SKILL.md requer campos `name` e `description` com regras de validação específicas:
- `name`: Máximo 64 caracteres, apenas letras minúsculas/números/hífens, sem tags XML, sem palavras reservadas
- `description`: Máximo 1024 caracteres, não-vazio, sem tags XML

Consulte a [visão geral de Skills](/docs/pt-BR/agents-and-tools/agent-skills/overview#skill-structure) para detalhes completos de estrutura.

### Orçamentos de token

Mantenha o corpo de SKILL.md abaixo de 500 linhas para desempenho ideal. Se seu conteúdo exceder isso, divida-o em arquivos separados usando os padrões de divulgação progressiva descritos anteriormente. Para detalhes arquiteturais, consulte a [visão geral de Skills](/docs/pt-BR/agents-and-tools/agent-skills/overview#how-skills-work).

## Lista de verificação para Skills eficazes

Antes de compartilhar uma Skill, verifique:

### Qualidade principal
- [ ] Descrição é específica e inclui termos-chave
- [ ] Descrição inclui tanto o que a Skill faz quanto quando usá-la
- [ ] Corpo de SKILL.md está abaixo de 500 linhas
- [ ] Detalhes adicionais estão em arquivos separados (se necessário)
- [ ] Sem informações sensíveis ao tempo (ou em seção "padrões antigos")
- [ ] Terminologia consistente em toda
- [ ] Exemplos são concretos, não abstratos
- [ ] Referências de arquivo estão um nível de profundidade
- [ ] Divulgação progressiva usada apropriadamente
- [ ] Fluxos de trabalho têm etapas claras

### Código e scripts
- [ ] Scripts resolvem problemas em vez de transferir para Claude
- [ ] Tratamento de erro é explícito e útil
- [ ] Sem "constantes voodoo" (todos os valores justificados)
- [ ] Pacotes necessários listados em instruções e verificados como disponíveis
- [ ] Scripts têm documentação clara
- [ ] Sem caminhos de estilo Windows (todas barras para frente)
- [ ] Etapas de validação/verificação para operações críticas
- [ ] Loops de feedback incluídos para tarefas críticas de qualidade

### Teste
- [ ] Pelo menos três avaliações criadas
- [ ] Testado com Haiku, Sonnet e Opus
- [ ] Testado com cenários de uso real
- [ ] Feedback de equipe incorporado (se aplicável)

## Próximos passos

<CardGroup cols={2}>
  <Card
    title="Comece com Agent Skills"
    icon="rocket"
    href="/docs/pt-BR/agents-and-tools/agent-skills/quickstart"
  >
    Crie sua primeira Skill
  </Card>
  <Card
    title="Use Skills no Claude Code"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Crie e gerencie Skills no Claude Code
  </Card>
  <Card
    title="Use Skills no Agent SDK"
    icon="cube"
    href="/docs/pt-BR/agent-sdk/skills"
  >
    Use Skills programaticamente em TypeScript e Python
  </Card>
  <Card
    title="Use Skills com a API"
    icon="code"
    href="/docs/pt-BR/build-with-claude/skills-guide"
  >
    Carregue e use Skills programaticamente
  </Card>
</CardGroup>