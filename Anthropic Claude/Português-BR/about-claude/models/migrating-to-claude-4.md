# Migrando para Claude 4.5

Guia de migração para Claude 4.5 modelos

---

Este guia cobre dois caminhos de migração principais para os modelos Claude 4.5:

- **Claude Sonnet 3.7 → Claude Sonnet 4.5**: Nosso modelo mais inteligente com raciocínio de melhor classe, capacidades de codificação e agentes de longa duração
- **Claude Haiku 3.5 → Claude Haiku 4.5**: Nosso modelo Haiku mais rápido e inteligente com desempenho próximo à fronteira para aplicações em tempo real e processamento inteligente de alto volume

Ambas as migrações envolvem mudanças significativas que requerem atualizações na sua implementação. Este guia o orientará através de cada caminho de migração com instruções passo a passo e mudanças significativas claramente marcadas.

Antes de iniciar sua migração, recomendamos revisar [O que há de novo no Claude 4.5](/docs/pt-BR/about-claude/models/whats-new-claude-4-5) para entender os novos recursos e capacidades disponíveis nesses modelos, incluindo pensamento estendido, consciência de contexto e melhorias comportamentais.

## Migrando de Claude Sonnet 3.7 para Claude Sonnet 4.5

Claude Sonnet 4.5 é nosso modelo mais inteligente, oferecendo desempenho de melhor classe para raciocínio, codificação e agentes autônomos de longa duração. Esta migração inclui várias mudanças significativas que requerem atualizações na sua implementação.

### Etapas de migração

1. **Atualize o nome do seu modelo:**
   ```python
   # Antes (Claude Sonnet 3.7)
   model="claude-3-7-sonnet-20250219"

   # Depois (Claude Sonnet 4.5)
   model="claude-sonnet-4-5-20250929"
   ```

2. **Atualize os parâmetros de amostragem**

   <Warning>
   Esta é uma mudança significativa do Claude Sonnet 3.7.
   </Warning>

   Use apenas `temperature` OU `top_p`, não ambos:

   ```python
   # Antes (Claude Sonnet 3.7) - Isso resultará em erro no Sonnet 4.5
   response = client.messages.create(
       model="claude-3-7-sonnet-20250219",
       temperature=0.7,
       top_p=0.9,  # Não é possível usar ambos
       ...
   )

   # Depois (Claude Sonnet 4.5)
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       temperature=0.7,  # Use temperature OU top_p, não ambos
       ...
   )
   ```

3. **Trate a nova razão de parada `refusal`**

   Atualize sua aplicação para [tratar razões de parada `refusal`](/docs/pt-BR/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals):

   ```python
   response = client.messages.create(...)

   if response.stop_reason == "refusal":
       # Trate a recusa apropriadamente
       pass
   ```

4. **Atualize a ferramenta de editor de texto (se aplicável)**

   <Warning>
   Esta é uma mudança significativa do Claude Sonnet 3.7.
   </Warning>

   Atualize para `text_editor_20250728` (tipo) e `str_replace_based_edit_tool` (nome). Remova qualquer código usando o comando `undo_edit`.
   
   ```python
   # Antes (Claude Sonnet 3.7)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # Depois (Claude Sonnet 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   Consulte a [documentação da ferramenta de editor de texto](/docs/pt-BR/agents-and-tools/tool-use/text-editor-tool) para detalhes.

5. **Atualize a ferramenta de execução de código (se aplicável)**

   Atualize para `code_execution_20250825`. A versão legada `code_execution_20250522` ainda funciona, mas não é recomendada. Consulte a [documentação da ferramenta de execução de código](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version) para instruções de migração.

6. **Remova o cabeçalho beta de uso de ferramenta eficiente em tokens**

   O uso de ferramenta eficiente em tokens é um recurso beta que funciona apenas com Claude 3.7 Sonnet. Todos os modelos Claude 4 têm uso de ferramenta eficiente em tokens integrado, portanto você não deve mais incluir o cabeçalho beta.

   Remova o [cabeçalho beta](/docs/pt-BR/api/beta-headers) `token-efficient-tools-2025-02-19` de suas solicitações:

   ```python
   # Antes (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["token-efficient-tools-2025-02-19"],  # Remova isto
       ...
   )

   # Depois (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # Sem cabeçalho beta token-efficient-tools
       ...
   )
   ```

7. **Remova o cabeçalho beta de saída estendida**

   O [cabeçalho beta](/docs/pt-BR/api/beta-headers) `output-128k-2025-02-19` para saída estendida está disponível apenas no Claude Sonnet 3.7.

   Remova este cabeçalho de suas solicitações:

   ```python
   # Antes (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["output-128k-2025-02-19"],  # Remova isto
       ...
   )

   # Depois (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # Sem cabeçalho beta output-128k
       ...
   )
   ```

8. **Atualize seus prompts para mudanças comportamentais**

   Claude Sonnet 4.5 tem um estilo de comunicação mais conciso e direto e requer direção explícita. Revise as [melhores práticas de engenharia de prompt do Claude 4](/docs/pt-BR/build-with-claude/prompt-engineering/claude-4-best-practices) para orientação de otimização.

9. **Considere ativar o pensamento estendido para tarefas complexas**

   Ative o [pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking) para melhorias significativas de desempenho em tarefas de codificação e raciocínio (desativado por padrão):

   ```python
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 10000},
       messages=[...]
   )
   ```

   <Note>
   O pensamento estendido impacta a eficiência do [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching#caching-with-thinking-blocks).
   </Note>

10. **Teste sua implementação**

   Teste em um ambiente de desenvolvimento antes de implantar em produção para garantir que todas as mudanças significativas sejam tratadas adequadamente.

### Lista de verificação de migração Sonnet 3.7 → 4.5

- [ ] Atualize o ID do modelo para `claude-sonnet-4-5-20250929`
- [ ] **MUDANÇA SIGNIFICATIVA**: Atualize os parâmetros de amostragem para usar apenas `temperature` OU `top_p`, não ambos
- [ ] Trate a nova razão de parada `refusal` em sua aplicação
- [ ] **MUDANÇA SIGNIFICATIVA**: Atualize a ferramenta de editor de texto para `text_editor_20250728` e `str_replace_based_edit_tool` (se aplicável)
- [ ] **MUDANÇA SIGNIFICATIVA**: Remova qualquer código usando o comando `undo_edit` (se aplicável)
- [ ] Atualize a ferramenta de execução de código para `code_execution_20250825` (se aplicável)
- [ ] Remova o cabeçalho beta `token-efficient-tools-2025-02-19` (se aplicável)
- [ ] Remova o cabeçalho beta `output-128k-2025-02-19` (se aplicável)
- [ ] Revise e atualize prompts seguindo as [melhores práticas do Claude 4](/docs/pt-BR/build-with-claude/prompt-engineering/claude-4-best-practices)
- [ ] Considere ativar o pensamento estendido para tarefas complexas de raciocínio
- [ ] Trate a razão de parada `model_context_window_exceeded` (específica do Sonnet 4.5)
- [ ] Considere ativar a ferramenta de memória para agentes de longa duração (beta)
- [ ] Considere usar limpeza automática de chamadas de ferramenta para edição de contexto (beta)
- [ ] Teste em ambiente de desenvolvimento antes da implantação em produção

### Recursos removidos do Claude Sonnet 3.7

- **Uso de ferramenta eficiente em tokens**: O cabeçalho beta `token-efficient-tools-2025-02-19` funciona apenas com Claude 3.7 Sonnet e não é suportado nos modelos Claude 4 (veja a etapa 6)
- **Saída estendida**: O cabeçalho beta `output-128k-2025-02-19` não é suportado (veja a etapa 7)

Ambos os cabeçalhos podem ser incluídos em solicitações Claude 4, mas não terão efeito.

## Migrando de Claude Haiku 3.5 para Claude Haiku 4.5

Claude Haiku 4.5 é nosso modelo Haiku mais rápido e inteligente com desempenho próximo à fronteira, oferecendo qualidade de modelo premium com desempenho em tempo real para aplicações interativas e processamento inteligente de alto volume. Esta migração inclui várias mudanças significativas que requerem atualizações na sua implementação.

Para uma visão geral completa das novas capacidades, consulte [O que há de novo no Claude 4.5](/docs/pt-BR/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5).

<Note>
Preço do Haiku 4.5 $1 por milhão de tokens de entrada, $5 por milhão de tokens de saída. Consulte [Preços do Claude](/docs/pt-BR/about-claude/pricing) para detalhes.
</Note>

### Etapas de migração

1. **Atualize o nome do seu modelo:**
   ```python
   # Antes (Haiku 3.5)
   model="claude-3-5-haiku-20241022"

   # Depois (Haiku 4.5)
   model="claude-haiku-4-5-20251001"
   ```

2. **Atualize as versões de ferramentas (se aplicável)**

   <Warning>
   Esta é uma mudança significativa do Claude Haiku 3.5.
   </Warning>

   Haiku 4.5 suporta apenas as versões mais recentes de ferramentas:

   ```python
   # Antes (Haiku 3.5)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # Depois (Haiku 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   - **Editor de texto**: Use `text_editor_20250728` e `str_replace_based_edit_tool`
   - **Execução de código**: Use `code_execution_20250825`
   - Remova qualquer código usando o comando `undo_edit`

3. **Atualize os parâmetros de amostragem**

   <Warning>
   Esta é uma mudança significativa do Claude Haiku 3.5.
   </Warning>

   Use apenas `temperature` OU `top_p`, não ambos:

   ```python
   # Antes (Haiku 3.5) - Isso resultará em erro no Haiku 4.5
   response = client.messages.create(
       model="claude-3-5-haiku-20241022",
       temperature=0.7,
       top_p=0.9,  # Não é possível usar ambos
       ...
   )

   # Depois (Haiku 4.5)
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       temperature=0.7,  # Use temperature OU top_p, não ambos
       ...
   )
   ```

4. **Revise os novos limites de taxa**

   Haiku 4.5 tem limites de taxa separados do Haiku 3.5. Consulte a [documentação de limites de taxa](/docs/pt-BR/api/rate-limits) para detalhes.

5. **Trate a nova razão de parada `refusal`**

   Atualize sua aplicação para [tratar razões de parada de recusa](/docs/pt-BR/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals).

6. **Considere ativar o pensamento estendido para tarefas complexas**

   Ative o [pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking) para melhorias significativas de desempenho em tarefas de codificação e raciocínio (desativado por padrão):

   ```python
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 5000},
       messages=[...]
   )
   ```
   <Note>
   O pensamento estendido impacta a eficiência do [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching#caching-with-thinking-blocks).
   </Note>

7. **Explore novas capacidades**

   Consulte [O que há de novo no Claude 4.5](/docs/pt-BR/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5) para detalhes sobre consciência de contexto, capacidade de saída aumentada (64K tokens), inteligência mais alta e velocidade melhorada.

8. **Teste sua implementação**

   Teste em um ambiente de desenvolvimento antes de implantar em produção para garantir que todas as mudanças significativas sejam tratadas adequadamente.

### Lista de verificação de migração Haiku 3.5 → 4.5

- [ ] Atualize o ID do modelo para `claude-haiku-4-5-20251001`
- [ ] **MUDANÇA SIGNIFICATIVA**: Atualize as versões de ferramentas para as mais recentes (por exemplo, `text_editor_20250728`, `code_execution_20250825`) - versões legadas não suportadas
- [ ] **MUDANÇA SIGNIFICATIVA**: Remova qualquer código usando o comando `undo_edit` (se aplicável)
- [ ] **MUDANÇA SIGNIFICATIVA**: Atualize os parâmetros de amostragem para usar apenas `temperature` OU `top_p`, não ambos
- [ ] Revise e ajuste para novos limites de taxa (separados do Haiku 3.5)
- [ ] Trate a nova razão de parada `refusal` em sua aplicação
- [ ] Considere ativar o pensamento estendido para tarefas complexas de raciocínio (nova capacidade)
- [ ] Aproveite a consciência de contexto para melhor gerenciamento de tokens em sessões longas
- [ ] Prepare-se para respostas maiores (saída máxima aumentada de 8K para 64K tokens)
- [ ] Revise e atualize prompts seguindo as [melhores práticas do Claude 4](/docs/pt-BR/build-with-claude/prompt-engineering/claude-4-best-practices)
- [ ] Teste em ambiente de desenvolvimento antes da implantação em produção

## Escolhendo entre Sonnet 4.5 e Haiku 4.5

Tanto Claude Sonnet 4.5 quanto Claude Haiku 4.5 são modelos Claude 4 poderosos com diferentes pontos fortes:

### Escolha Claude Sonnet 4.5 (mais inteligente) para:

- **Raciocínio e análise complexos**: Inteligência de melhor classe para tarefas sofisticadas
- **Agentes autônomos de longa duração**: Desempenho superior para agentes trabalhando independentemente por períodos estendidos
- **Tarefas avançadas de codificação**: Nosso modelo de codificação mais forte com planejamento avançado e engenharia de segurança
- **Fluxos de trabalho de contexto grande**: Gerenciamento de contexto aprimorado com ferramenta de memória e capacidades de edição de contexto
- **Tarefas que requerem capacidade máxima**: Quando inteligência e precisão são as principais prioridades

### Escolha Claude Haiku 4.5 (mais rápido e mais inteligente Haiku) para:

- **Aplicações em tempo real**: Tempos de resposta rápidos para experiências de usuário interativas com desempenho próximo à fronteira
- **Processamento inteligente de alto volume**: Inteligência econômica em escala com velocidade melhorada
- **Implantações sensíveis a custos**: Desempenho próximo à fronteira a preços mais baixos
- **Arquiteturas de subagentos**: Agentes rápidos e inteligentes para sistemas multi-agentes
- **Uso de computador em escala**: Automação autônoma de desktop e navegador econômica
- **Tarefas que requerem velocidade**: Quando baixa latência é crítica mantendo inteligência próxima à fronteira

### Recomendações de pensamento estendido

Os modelos Claude 4, particularmente Sonnet e Haiku 4.5, mostram melhorias significativas de desempenho ao usar o [pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking) para tarefas de codificação e raciocínio complexo. O pensamento estendido é **desativado por padrão**, mas recomendamos ativá-lo para trabalho exigente.

**Importante**: O pensamento estendido impacta a eficiência do [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching#caching-with-thinking-blocks). Quando conteúdo não-resultado de ferramenta é adicionado a uma conversa, blocos de pensamento são removidos do cache, o que pode aumentar custos em conversas multi-turno. Recomendamos ativar o pensamento quando os benefícios de desempenho superam a compensação de cache.

## Outros cenários de migração

Os caminhos de migração principais cobertos acima (Sonnet 3.7 → 4.5 e Haiku 3.5 → 4.5) representam as atualizações mais comuns. No entanto, você pode estar migrando de outros modelos Claude para Claude 4.5. Esta seção cobre esses cenários.

### Migrando de Claude Sonnet 4 → Sonnet 4.5

**Mudança significativa**: Não é possível especificar tanto `temperature` quanto `top_p` na mesma solicitação.

Todas as outras chamadas de API funcionarão sem modificação. Atualize seu ID de modelo e ajuste os parâmetros de amostragem se necessário:

```python
# Antes (Claude Sonnet 4)
model="claude-sonnet-4-20250514"

# Depois (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

### Migrando de Claude Opus 4.1 → Sonnet 4.5

**Sem mudanças significativas.** Todas as chamadas de API funcionarão sem modificação.

Simplesmente atualize seu ID de modelo:

```python
# Antes (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# Depois (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

Claude Sonnet 4.5 é nosso modelo mais inteligente com raciocínio de melhor classe, capacidades de codificação e agentes de longa duração. Oferece desempenho superior em comparação com Opus 4.1 para a maioria dos casos de uso.

### Migrando de Claude Opus 4.1 → Opus 4.5

**Sem mudanças significativas.** Todas as chamadas de API funcionarão sem modificação.

Simplesmente atualize seu ID de modelo:

```python
# Antes (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# Depois (Claude Opus 4.5)
model="claude-opus-4-5-20251101"
```

Claude Opus 4.5 é nosso modelo mais inteligente, combinando capacidade máxima com desempenho prático. Apresenta melhorias significativas em visão, codificação e uso de computador a um preço mais acessível do que Opus 4.1. Ideal para tarefas especializadas complexas e engenharia de software profissional.

<Note>
Para bases de código com muitas referências de modelo, um [plugin Claude Code](https://github.com/anthropics/claude-code/tree/main/plugins/claude-opus-4-5-migration) está disponível para automatizar a migração para Opus 4.5.
</Note>

### Migrando entre modelos Claude 4.5

**Sem mudanças significativas.** Todas as chamadas de API funcionarão sem modificação.

Simplesmente atualize seu ID de modelo.

## Precisa de ajuda?

- Consulte nossa [documentação de API](/docs/pt-BR/api/overview) para especificações detalhadas
- Revise as [capacidades do modelo](/docs/pt-BR/about-claude/models/overview) para comparações de desempenho
- Revise as [notas de lançamento da API](/docs/pt-BR/release-notes/api) para atualizações de API
- Entre em contato com o suporte se encontrar algum problema durante a migração