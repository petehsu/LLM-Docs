# Plataforma de Desenvolvedor Claude

Atualizações da Plataforma de Desenvolvedor Claude, incluindo a API Claude, SDKs de cliente e o Console Claude.

---

<Tip>
Para notas de lançamento sobre Claude Apps, consulte as [Notas de lançamento para Claude Apps no Centro de Ajuda Claude](https://support.claude.com/en/articles/12138966-release-notes).

Para atualizações do Claude Code, consulte o [CHANGELOG.md completo](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) no repositório `claude-code`.
</Tip>

### 4 de dezembro de 2025
- [Saídas estruturadas](/docs/pt-BR/build-with-claude/structured-outputs) agora suporta Claude Haiku 4.5.

### 24 de novembro de 2025
- Lançamos [Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5), nosso modelo mais inteligente combinando capacidade máxima com desempenho prático. Ideal para tarefas especializadas complexas, engenharia de software profissional e agentes avançados. Apresenta melhorias significativas em visão, codificação e uso de computador a um preço mais acessível do que modelos Opus anteriores. Saiba mais em nossa [documentação de Modelos e Preços](/docs/pt-BR/about-claude/models).
- Lançamos [chamada de ferramenta programática](/docs/pt-BR/agents-and-tools/tool-use/programmatic-tool-calling) em beta público, permitindo que Claude chame ferramentas de dentro da execução de código para reduzir latência e uso de tokens em fluxos de trabalho com múltiplas ferramentas.
- Lançamos a [ferramenta de busca de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/tool-search-tool) em beta público, permitindo que Claude descubra e carregue ferramentas dinamicamente sob demanda de grandes catálogos de ferramentas.
- Lançamos o [parâmetro de esforço](/docs/pt-BR/build-with-claude/effort) em beta público para Claude Opus 4.5, permitindo que você controle o uso de tokens negociando entre a minuciosidade e eficiência da resposta.
- Adicionamos [compactação do lado do cliente](/docs/pt-BR/build-with-claude/context-editing#client-side-compaction-sdk) aos nossos SDKs Python e TypeScript, gerenciando automaticamente o contexto de conversa através de resumo ao usar `tool_runner`.

### 21 de novembro de 2025
- Os blocos de conteúdo de resultados de busca agora estão geralmente disponíveis no Amazon Bedrock. Saiba mais em nossa [documentação de resultados de busca](/docs/pt-BR/build-with-claude/search-results).

### 19 de novembro de 2025
- Lançamos uma **nova plataforma de documentação** em [platform.claude.com/docs](https://platform.claude.com/docs). Nossa documentação agora fica lado a lado com o Console Claude, fornecendo uma experiência de desenvolvedor unificada. O site de documentação anterior em docs.claude.com será redirecionado para a nova localização.

### 18 de novembro de 2025
- Lançamos **Claude no Microsoft Foundry**, trazendo modelos Claude para clientes Azure com faturamento Azure e autenticação OAuth. Acesse a API Messages completa incluindo pensamento estendido, cache de prompt (5 minutos e 1 hora), suporte a PDF, API de Arquivos, Agent Skills e uso de ferramentas. Saiba mais em nossa [documentação do Microsoft Foundry](/docs/pt-BR/build-with-claude/claude-in-microsoft-foundry).

### 14 de novembro de 2025
- Lançamos [saídas estruturadas](/docs/pt-BR/build-with-claude/structured-outputs) em beta público, fornecendo conformidade de esquema garantida para as respostas do Claude. Use saídas JSON para respostas de dados estruturados ou uso rigoroso de ferramentas para entradas de ferramentas validadas. Disponível para Claude Sonnet 4.5 e Claude Opus 4.1. Para ativar, use o cabeçalho beta `structured-outputs-2025-11-13`.

### 28 de outubro de 2025
- Anunciamos a descontinuação do modelo Claude Sonnet 3.7. Leia mais em [nossa documentação](/docs/pt-BR/about-claude/model-deprecations).
- Descontinuamos os modelos Claude Sonnet 3.5. Todas as solicitações para esses modelos agora retornarão um erro.
- Expandimos a edição de contexto com limpeza de bloco de pensamento (`clear_thinking_20251015`), permitindo gerenciamento automático de blocos de pensamento. Saiba mais em nossa [documentação de edição de contexto](/docs/pt-BR/build-with-claude/context-editing).

### 16 de outubro de 2025
- Lançamos [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (`skills-2025-10-02` beta), uma nova forma de estender as capacidades do Claude. Skills são pastas organizadas de instruções, scripts e recursos que Claude carrega dinamicamente para executar tarefas especializadas. O lançamento inicial inclui:
  - **Skills Gerenciadas pela Anthropic**: Skills pré-construídas para trabalhar com arquivos PowerPoint (.pptx), Excel (.xlsx), Word (.docx) e PDF
  - **Skills Personalizadas**: Carregue seus próprios Skills através da API de Skills (endpoints `/v1/skills`) para empacotar expertise de domínio e fluxos de trabalho organizacionais
  - Skills requerem que a [ferramenta de execução de código](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool) esteja ativada
  - Saiba mais em nossa [documentação de Agent Skills](/docs/pt-BR/agents-and-tools/agent-skills/overview) e [referência de API](/docs/pt-BR/api/skills/create-skill)

### 15 de outubro de 2025
- Lançamos [Claude Haiku 4.5](https://www.anthropic.com/news/claude-haiku-4-5), nosso modelo Haiku mais rápido e inteligente com desempenho próximo à fronteira. Ideal para aplicações em tempo real, processamento de alto volume e implantações sensíveis a custos que requerem raciocínio forte. Saiba mais em nossa [documentação de Modelos e Preços](/docs/pt-BR/about-claude/models).

### 29 de setembro de 2025
- Lançamos [Claude Sonnet 4.5](https://www.anthropic.com/news/claude-sonnet-4-5), nosso melhor modelo para agentes complexos e codificação, com a inteligência mais alta em a maioria das tarefas. Saiba mais em [O que há de novo no Claude 4.5](/docs/pt-BR/about-claude/models/whats-new-claude-4-5).
- Introduzimos [preços de endpoint global](/docs/pt-BR/about-claude/pricing#third-party-platform-pricing) para AWS Bedrock e Google Vertex AI. O preço da API Claude (1P) não é afetado.
- Introduzimos um novo motivo de parada `model_context_window_exceeded` que permite solicitar o máximo de tokens possível sem calcular o tamanho da entrada. Saiba mais em nossa [documentação de tratamento de motivos de parada](/docs/pt-BR/build-with-claude/handling-stop-reasons).
- Lançamos a ferramenta de memória em beta, permitindo que Claude armazene e consulte informações entre conversas. Saiba mais em nossa [documentação da ferramenta de memória](/docs/pt-BR/agents-and-tools/tool-use/memory-tool).
- Lançamos edição de contexto em beta, fornecendo estratégias para gerenciar automaticamente o contexto de conversa. O lançamento inicial suporta limpeza de resultados e chamadas de ferramentas mais antigas ao se aproximar dos limites de tokens. Saiba mais em nossa [documentação de edição de contexto](/docs/pt-BR/build-with-claude/context-editing).

### 17 de setembro de 2025
- Lançamos auxiliares de ferramentas em beta para os SDKs Python e TypeScript, simplificando a criação e execução de ferramentas com validação de entrada type-safe e um executor de ferramentas para tratamento automatizado de ferramentas em conversas. Para detalhes, consulte a documentação para [o SDK Python](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md) e [o SDK TypeScript](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers).

### 16 de setembro de 2025
- Unificamos nossas ofertas de desenvolvedor sob a marca Claude. Você deve ver nomes e URLs atualizados em toda nossa plataforma e documentação, mas **nossas interfaces de desenvolvedor permanecerão as mesmas**. Aqui estão algumas mudanças notáveis:
  - Console Anthropic ([console.anthropic.com](https://console.anthropic.com)) → Console Claude ([platform.claude.com](https://platform.claude.com)). O console estará disponível em ambas as URLs até 16 de dezembro de 2025. Após essa data, [console.anthropic.com](https://console.anthropic.com) será automaticamente redirecionado para [platform.claude.com](https://platform.claude.com).
  - Documentação Anthropic ([docs.claude.com](https://docs.claude.com)) → Documentação Claude ([docs.claude.com](https://docs.claude.com))
  - Centro de Ajuda Anthropic ([support.claude.com](https://support.claude.com)) → Centro de Ajuda Claude ([support.claude.com](https://support.claude.com))
  - Endpoints de API, cabeçalhos, variáveis de ambiente e SDKs permanecem os mesmos. Suas integrações existentes continuarão funcionando sem nenhuma alteração.

### 10 de setembro de 2025
- Lançamos a ferramenta de busca na web em beta, permitindo que Claude recupere conteúdo completo de páginas da web e documentos PDF especificados. Saiba mais em nossa [documentação da ferramenta de busca na web](/docs/pt-BR/agents-and-tools/tool-use/web-fetch-tool).
- Lançamos a [API de Análise do Claude Code](/docs/pt-BR/build-with-claude/claude-code-analytics-api), permitindo que organizações acessem programaticamente métricas de uso agregadas diárias para Claude Code, incluindo métricas de produtividade, estatísticas de uso de ferramentas e dados de custo.

### 8 de setembro de 2025
- Lançamos uma versão beta do [SDK C#](https://github.com/anthropics/anthropic-sdk-csharp).

### 5 de setembro de 2025
- Lançamos [gráficos de limite de taxa](/docs/pt-BR/api/rate-limits#monitoring-your-rate-limits-in-the-console) na página [Uso](https://console.anthropic.com/settings/usage) do Console, permitindo que você monitore seu uso de limite de taxa de API e taxas de cache ao longo do tempo.

### 3 de setembro de 2025
- Lançamos suporte para documentos citáveis em resultados de ferramentas do lado do cliente. Saiba mais em nossa [documentação de uso de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use).

### 2 de setembro de 2025
- Lançamos v2 da [Ferramenta de Execução de Código](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool) em beta público, substituindo a ferramenta original apenas para Python com execução de comando Bash e capacidades de manipulação direta de arquivos, incluindo escrita de código em outras linguagens.

### 27 de agosto de 2025
- Lançamos uma versão beta do [SDK PHP](https://github.com/anthropics/anthropic-sdk-php).

### 26 de agosto de 2025
- Aumentamos os limites de taxa na [janela de contexto de 1M de tokens](/docs/pt-BR/build-with-claude/context-windows#1m-token-context-window) para Claude Sonnet 4 na API Claude. Para mais informações, consulte [Limites de taxa de contexto longo](/docs/pt-BR/api/rate-limits#long-context-rate-limits).
- A janela de contexto de 1m de tokens agora está disponível no Vertex AI do Google Cloud. Para mais informações, consulte [Claude no Vertex AI](/docs/pt-BR/build-with-claude/claude-on-vertex-ai).

### 19 de agosto de 2025
- IDs de solicitação agora estão incluídos diretamente nos corpos de resposta de erro ao lado do cabeçalho `request-id` existente. Saiba mais em nossa [documentação de erros](/docs/pt-BR/api/errors#error-shapes).

### 18 de agosto de 2025
- Lançamos a [API de Uso e Custo](/docs/pt-BR/build-with-claude/usage-cost-api), permitindo que administradores monitorem programaticamente dados de uso e custo de sua organização.
- Adicionamos um novo endpoint à API Admin para recuperar informações da organização. Para detalhes, consulte a [referência da API Admin de Informações da Organização](/docs/pt-BR/api/admin-api/organization/get-me).

### 13 de agosto de 2025
- Anunciamos a descontinuação dos modelos Claude Sonnet 3.5 (`claude-3-5-sonnet-20240620` e `claude-3-5-sonnet-20241022`). Esses modelos serão descontinuados em 28 de outubro de 2025. Recomendamos migrar para Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) para melhor desempenho e capacidades. Leia mais na [documentação de Descontinuações de Modelos](/docs/pt-BR/about-claude/model-deprecations).
- A duração de cache de 1 hora para cache de prompt agora está geralmente disponível. Você pode agora usar o TTL de cache estendido sem um cabeçalho beta. Saiba mais em nossa [documentação de cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching#1-hour-cache-duration).

### 12 de agosto de 2025
- Lançamos suporte beta para uma [janela de contexto de 1M de tokens](/docs/pt-BR/build-with-claude/context-windows#1m-token-context-window) em Claude Sonnet 4 na API Claude e Amazon Bedrock.

### 11 de agosto de 2025
- Alguns clientes podem encontrar erros 429 (`rate_limit_error`) [erros](/docs/pt-BR/api/errors) após um aumento acentuado no uso da API devido a limites de aceleração na API. Anteriormente, erros 529 (`overloaded_error`) ocorreriam em cenários semelhantes.

### 8 de agosto de 2025
- Os blocos de conteúdo de resultados de busca agora estão geralmente disponíveis na API Claude e no Vertex AI do Google Cloud. Este recurso permite citações naturais para aplicações RAG com atribuição adequada de fonte. O cabeçalho beta `search-results-2025-06-09` não é mais necessário. Saiba mais em nossa [documentação de resultados de busca](/docs/pt-BR/build-with-claude/search-results).

### 5 de agosto de 2025
- Lançamos [Claude Opus 4.1](https://www.anthropic.com/news/claude-opus-4-1), uma atualização incremental do Claude Opus 4 com capacidades aprimoradas e melhorias de desempenho.<sup>*</sup> Saiba mais em nossa [documentação de Modelos e Preços](/docs/pt-BR/about-claude/models).

_<sup>* - Opus 4.1 não permite que os parâmetros `temperature` e `top_p` sejam especificados simultaneamente. Por favor, use apenas um. </sup>_

### 28 de julho de 2025
- Lançamos `text_editor_20250728`, uma ferramenta de editor de texto atualizada que corrige alguns problemas das versões anteriores e adiciona um parâmetro `max_characters` opcional que permite controlar o comprimento de truncamento ao visualizar arquivos grandes.

### 24 de julho de 2025
- Aumentamos [limites de taxa](/docs/pt-BR/api/rate-limits) para Claude Opus 4 na API Claude para lhe dar mais capacidade de construir e escalar com Claude. Para clientes com [limites de taxa de nível de uso 1-4](/docs/pt-BR/api/rate-limits#rate-limits), essas mudanças se aplicam imediatamente à sua conta - nenhuma ação necessária.

### 21 de julho de 2025
- Descontinuamos os modelos Claude 2.0, Claude 2.1 e Claude Sonnet 3. Todas as solicitações para esses modelos agora retornarão um erro. Leia mais em [nossa documentação](/docs/pt-BR/about-claude/model-deprecations).

### 17 de julho de 2025
- Aumentamos [limites de taxa](/docs/pt-BR/api/rate-limits) para Claude Sonnet 4 na API Claude para lhe dar mais capacidade de construir e escalar com Claude. Para clientes com [limites de taxa de nível de uso 1-4](/docs/pt-BR/api/rate-limits#rate-limits), essas mudanças se aplicam imediatamente à sua conta - nenhuma ação necessária.

### 3 de julho de 2025
- Lançamos blocos de conteúdo de resultados de busca em beta, permitindo citações naturais para aplicações RAG. As ferramentas agora podem retornar resultados de busca com atribuição adequada de fonte, e Claude citará automaticamente essas fontes em suas respostas - correspondendo à qualidade de citação da busca na web. Isso elimina a necessidade de soluções alternativas de documentos em aplicações de base de conhecimento personalizada. Saiba mais em nossa [documentação de resultados de busca](/docs/pt-BR/build-with-claude/search-results). Para ativar este recurso, use o cabeçalho beta `search-results-2025-06-09`.

### 30 de junho de 2025
- Anunciamos a descontinuação do modelo Claude Opus 3. Leia mais em [nossa documentação](/docs/pt-BR/about-claude/model-deprecations).

### 23 de junho de 2025
- Usuários do Console com a função Desenvolvedor agora podem acessar a página [Custo](https://console.anthropic.com/settings/cost). Anteriormente, a função Desenvolvedor permitia acesso à página [Uso](https://console.anthropic.com/settings/usage), mas não à página Custo.

### 11 de junho de 2025
- Lançamos [streaming de ferramentas de granulação fina](/docs/pt-BR/agents-and-tools/tool-use/fine-grained-tool-streaming) em beta público, um recurso que permite que Claude transmita parâmetros de uso de ferramentas sem buffering / validação JSON. Para ativar streaming de ferramentas de granulação fina, use o [cabeçalho beta](/docs/pt-BR/api/beta-headers) `fine-grained-tool-streaming-2025-05-14`.

### 22 de maio de 2025
- Lançamos [Claude Opus 4 e Claude Sonnet 4](http://www.anthropic.com/news/claude-4), nossos modelos mais recentes com capacidades de pensamento estendido. Saiba mais em nossa [documentação de Modelos e Preços](/docs/pt-BR/about-claude/models).
- O comportamento padrão do [pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking) em modelos Claude 4 retorna um resumo do processo de pensamento completo do Claude, com o pensamento completo criptografado e retornado no campo `signature` da saída do bloco `thinking`.
- Lançamos [pensamento intercalado](/docs/pt-BR/build-with-claude/extended-thinking#interleaved-thinking) em beta público, um recurso que permite que Claude pense entre chamadas de ferramentas. Para ativar pensamento intercalado, use o [cabeçalho beta](/docs/pt-BR/api/beta-headers) `interleaved-thinking-2025-05-14`.
- Lançamos a [API de Arquivos](/docs/pt-BR/build-with-claude/files) em beta público, permitindo que você carregue arquivos e os referencie na API Messages e ferramenta de execução de código.
- Lançamos a [ferramenta de execução de código](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool) em beta público, uma ferramenta que permite que Claude execute código Python em um ambiente seguro e isolado.
- Lançamos o [conector MCP](/docs/pt-BR/agents-and-tools/mcp-connector) em beta público, um recurso que permite conectar-se a servidores MCP remotos diretamente da API Messages. 
- Para aumentar a qualidade da resposta e diminuir erros de ferramentas, alteramos o valor padrão do parâmetro `top_p` [amostragem nucleus](https://en.wikipedia.org/wiki/Top-p_sampling) na API Messages de 0.999 para 0.99 para todos os modelos. Para reverter essa mudança, defina `top_p` para 0.999. 
    Além disso, quando o pensamento estendido está ativado, você agora pode definir `top_p` para valores entre 0.95 e 1.
- Movemos nosso [SDK Go](https://github.com/anthropics/anthropic-sdk-go) de beta para GA.
- Incluímos granularidade em nível de minuto e hora na página [Uso](https://console.anthropic.com/settings/usage) do Console ao lado de taxas de erro 429 na página Uso.

### 21 de maio de 2025
- Movemos nosso [SDK Ruby](https://github.com/anthropics/anthropic-sdk-ruby) de beta para GA.

### 7 de maio de 2025
- Lançamos uma ferramenta de busca na web na API, permitindo que Claude acesse informações atualizadas da web. Saiba mais em nossa [documentação da ferramenta de busca na web](/docs/pt-BR/agents-and-tools/tool-use/web-search-tool).

### 1º de maio de 2025
- O controle de cache agora deve ser especificado diretamente no bloco `content` pai de `tool_result` e `document.source`. Para compatibilidade com versões anteriores, se o controle de cache for detectado no último bloco em `tool_result.content` ou `document.source.content`, ele será automaticamente aplicado ao bloco pai. O controle de cache em qualquer outro bloco dentro de `tool_result.content` e `document.source.content` resultará em um erro de validação.

### 9 de abril de 2025
- Lançamos uma versão beta do [SDK Ruby](https://github.com/anthropics/anthropic-sdk-ruby)

### 31 de março de 2025
- Movemos nosso [SDK Java](https://github.com/anthropics/anthropic-sdk-java) de beta para GA.
- Movemos nosso [SDK Go](https://github.com/anthropics/anthropic-sdk-go) de alfa para beta.

### 27 de fevereiro de 2025
- Adicionamos blocos de fonte de URL para imagens e PDFs na API Messages. Você agora pode referenciar imagens e PDFs diretamente via URL em vez de ter que codificá-los em base64. Saiba mais em nossa [documentação de visão](/docs/pt-BR/build-with-claude/vision) e [documentação de suporte a PDF](/docs/pt-BR/build-with-claude/pdf-support).
- Adicionamos suporte para uma opção `none` ao parâmetro `tool_choice` na API Messages que impede Claude de chamar qualquer ferramenta. Além disso, você não é mais obrigado a fornecer nenhuma `tools` ao incluir blocos `tool_use` e `tool_result`.
- Lançamos um endpoint de API compatível com OpenAI, permitindo que você teste modelos Claude apenas alterando sua chave de API, URL base e nome do modelo em integrações OpenAI existentes. Esta camada de compatibilidade suporta funcionalidade de conclusões de chat principal. Saiba mais em nossa [documentação de compatibilidade do SDK OpenAI](/docs/pt-BR/api/openai-sdk).

### 24 de fevereiro de 2025
- Lançamos [Claude Sonnet 3.7](http://www.anthropic.com/news/claude-3-7-sonnet), nosso modelo mais inteligente até agora. Claude Sonnet 3.7 pode produzir respostas quase instantâneas ou mostrar seu pensamento estendido passo a passo. Um modelo, duas formas de pensar. Saiba mais sobre todos os modelos Claude em nossa [documentação de Modelos e Preços](/docs/pt-BR/about-claude/models).
- Adicionamos suporte de visão ao Claude Haiku 3.5, permitindo que o modelo analise e compreenda imagens.
- Lançamos uma implementação de uso de ferramentas eficiente em tokens, melhorando o desempenho geral ao usar ferramentas com Claude. Saiba mais em nossa [documentação de uso de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/overview).
- Alteramos a temperatura padrão no [Console](https://console.anthropic.com/workbench) para novos prompts de 0 para 1 para consistência com a temperatura padrão na API. Os prompts salvos existentes não são alterados.
- Lançamos versões atualizadas de nossas ferramentas que desacoplam as ferramentas de edição de texto e bash do prompt do sistema de uso de computador:
  - `bash_20250124`: Mesma funcionalidade da versão anterior, mas independente do uso de computador. Não requer um cabeçalho beta.
  - `text_editor_20250124`: Mesma funcionalidade da versão anterior, mas independente do uso de computador. Não requer um cabeçalho beta.
  - `computer_20250124`: Ferramenta de uso de computador atualizada com novas opções de comando incluindo "hold_key", "left_mouse_down", "left_mouse_up", "scroll", "triple_click" e "wait". Esta ferramenta requer o cabeçalho anthropic-beta "computer-use-2025-01-24".
  Saiba mais em nossa [documentação de uso de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/overview).

### 10 de fevereiro de 2025
- Adicionamos o cabeçalho de resposta `anthropic-organization-id` a todas as respostas de API. Este cabeçalho fornece o ID da organização associado à chave de API usada na solicitação.

### 31 de janeiro de 2025

- Movemos nosso [SDK Java](https://github.com/anthropics/anthropic-sdk-java) de alfa para beta.

### 23 de janeiro de 2025

- Lançamos capacidade de citações na API, permitindo que Claude forneça atribuição de fonte para informações. Saiba mais em nossa [documentação de citações](/docs/pt-BR/build-with-claude/citations).
- Adicionamos suporte para documentos de texto simples e documentos de conteúdo personalizado na API Messages.

### 21 de janeiro de 2025

- Anunciamos a descontinuação dos modelos Claude 2, Claude 2.1 e Claude Sonnet 3. Leia mais em [nossa documentação](/docs/pt-BR/about-claude/model-deprecations).

### 15 de janeiro de 2025

- Atualizamos [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching) para ser mais fácil de usar. Agora, quando você define um ponto de interrupção de cache, leremos automaticamente do seu prefixo em cache mais longo anterior.
- Você agora pode colocar palavras na boca do Claude ao usar ferramentas.

### 10 de janeiro de 2025

- Otimizamos o suporte para [cache de prompt na API de Lotes de Mensagens](/docs/pt-BR/build-with-claude/batch-processing#using-prompt-caching-with-message-batches) para melhorar a taxa de acerto de cache.

### 19 de dezembro de 2024

- Adicionamos suporte para um [endpoint de exclusão](/docs/pt-BR/api/deleting-message-batches) na API de Lotes de Mensagens

### 17 de dezembro de 2024
Os seguintes recursos agora estão geralmente disponíveis na API Claude:

- [API de Modelos](/docs/pt-BR/api/models-list): Consulte modelos disponíveis, valide IDs de modelo e resolva [aliases de modelo](/docs/pt-BR/about-claude/models#model-names) para seus IDs de modelo canônicos.
- [API de Lotes de Mensagens](/docs/pt-BR/build-with-claude/batch-processing): Processe grandes lotes de mensagens de forma assíncrona a 50% do custo padrão da API.
- [API de Contagem de Tokens](/docs/pt-BR/build-with-claude/token-counting): Calcule contagens de tokens para Mensagens antes de enviá-las para Claude.
- [Cache de Prompt](/docs/pt-BR/build-with-claude/prompt-caching): Reduza custos em até 90% e latência em até 80% ao armazenar em cache e reutilizar conteúdo de prompt.
- [Suporte a PDF](/docs/pt-BR/build-with-claude/pdf-support): Processe PDFs para analisar conteúdo textual e visual dentro de documentos.

Também lançamos novos SDKs oficiais:
- [SDK Java](https://github.com/anthropics/anthropic-sdk-java) (alfa)
- [SDK Go](https://github.com/anthropics/anthropic-sdk-go) (alfa)

### 4 de dezembro de 2024

- Adicionamos a capacidade de agrupar por chave de API às páginas [Uso](https://console.anthropic.com/settings/usage) e [Custo](https://console.anthropic.com/settings/cost) do [Console de Desenvolvedor](https://console.anthropic.com)
- Adicionamos duas novas colunas **Último uso em** e **Custo** e a capacidade de classificar por qualquer coluna na página [Chaves de API](https://console.anthropic.com/settings/keys) do [Console de Desenvolvedor](https://console.anthropic.com)

### 21 de novembro de 2024

- Lançamos a [API Admin](/docs/pt-BR/build-with-claude/administration-api), permitindo que usuários gerenciem programaticamente os recursos de sua organização.

### 20 de novembro de 2024

- Atualizamos nossos limites de taxa para a API Messages. Substituímos o limite de taxa de tokens por minuto por novos limites de taxa de tokens de entrada e saída por minuto. Leia mais em nossa [documentação](/docs/pt-BR/api/rate-limits).
- Adicionamos suporte para [uso de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/overview) no [Workbench](https://console.anthropic.com/workbench).

### 13 de novembro de 2024

- Adicionamos suporte a PDF para todos os modelos Claude Sonnet 3.5. Leia mais em nossa [documentação](/docs/pt-BR/build-with-claude/pdf-support).

### 6 de novembro de 2024

- Descontinuamos os modelos Claude 1 e Instant. Leia mais em [nossa documentação](/docs/pt-BR/about-claude/model-deprecations).

### 4 de novembro de 2024

- [Claude Haiku 3.5](https://www.anthropic.com/claude/haiku) agora está disponível na API Claude como um modelo apenas de texto.

### 1º de novembro de 2024

- Adicionamos suporte a PDF para uso com o novo Claude Sonnet 3.5. Leia mais em nossa [documentação](/docs/pt-BR/build-with-claude/pdf-support).
- Também adicionamos contagem de tokens, que permite determinar o número total de tokens em uma Mensagem, antes de enviá-la para Claude. Leia mais em nossa [documentação](/docs/pt-BR/build-with-claude/token-counting).

### 22 de outubro de 2024

- Adicionamos ferramentas de uso de computador definidas pela Anthropic à nossa API para uso com o novo Claude Sonnet 3.5. Leia mais em nossa [documentação](/docs/pt-BR/agents-and-tools/tool-use/computer-use-tool).
- Claude Sonnet 3.5, nosso modelo mais inteligente até agora, acabou de receber uma atualização e agora está disponível na API Claude. Leia mais [aqui](https://www.anthropic.com/claude/sonnet).

### 8 de outubro de 2024

- A API de Lotes de Mensagens agora está disponível em beta. Processe grandes lotes de consultas de forma assíncrona na API Claude por 50% menos custo. Leia mais em nossa [documentação](/docs/pt-BR/build-with-claude/batch-processing).
- Afrouxamos restrições na ordenação de turnos `user`/`assistant` em nossa API Messages. Mensagens `user`/`assistant` consecutivas serão combinadas em uma única mensagem em vez de gerar erro, e não exigimos mais que a primeira mensagem de entrada seja uma mensagem `user`.
- Descontinuamos os planos Build e Scale em favor de um conjunto de recursos padrão (anteriormente referido como Build), juntamente com recursos adicionais que estão disponíveis através de vendas. Leia mais [aqui](https://claude.com/platform/api).

### 3 de outubro de 2024

- Adicionamos a capacidade de desabilitar o uso paralelo de ferramentas na API. Defina `disable_parallel_tool_use: true` no campo `tool_choice` para garantir que Claude use no máximo uma ferramenta. Leia mais em nossa [documentação](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use).

### 10 de setembro de 2024

- Adicionamos Workspaces ao [Console de Desenvolvedor](https://console.anthropic.com). Workspaces permitem que você defina limites de gastos ou taxa personalizados, agrupe chaves de API, rastreie uso por projeto e controle acesso com funções de usuário. Leia mais em nosso [post do blog](https://www.anthropic.com/news/workspaces).

### 4 de setembro de 2024

- Anunciamos a descontinuação dos modelos Claude 1. Leia mais em [nossa documentação](/docs/pt-BR/about-claude/model-deprecations).

### 22 de agosto de 2024

- Adicionamos suporte para uso do SDK em navegadores retornando cabeçalhos CORS nas respostas de API. Defina `dangerouslyAllowBrowser: true` na instanciação do SDK para ativar este recurso.

### 19 de agosto de 2024

- Movemos saídas de 8.192 tokens de beta para disponibilidade geral para Claude Sonnet 3.5.

### 14 de agosto de 2024

- [Cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching) agora está disponível como um recurso beta na API Claude. Armazene em cache e reutilize prompts para reduzir latência em até 80% e custos em até 90%.

### 15 de julho de 2024

- Gere saídas de até 8.192 tokens de comprimento do Claude Sonnet 3.5 com o novo cabeçalho `anthropic-beta: max-tokens-3-5-sonnet-2024-07-15`.

### 9 de julho de 2024

- Gere automaticamente casos de teste para seus prompts usando Claude no [Console de Desenvolvedor](https://console.anthropic.com).
- Compare as saídas de diferentes prompts lado a lado no novo modo de comparação de saída no [Console de Desenvolvedor](https://console.anthropic.com).

### 27 de junho de 2024

- Visualize uso de API e faturamento dividido por valor em dólar, contagem de tokens e chaves de API nas novas abas [Uso](https://console.anthropic.com/settings/usage) e [Custo](https://console.anthropic.com/settings/cost) no [Console de Desenvolvedor](https://console.anthropic.com).
- Visualize seus limites de taxa de API atuais na nova aba [Limites de Taxa](https://console.anthropic.com/settings/limits) no [Console de Desenvolvedor](https://console.anthropic.com).

### 20 de junho de 2024

- [Claude Sonnet 3.5](http://anthropic.com/news/claude-3-5-sonnet), nosso modelo mais inteligente até agora, agora está geralmente disponível em toda a API Claude, Amazon Bedrock e Google Vertex AI.

### 30 de maio de 2024

- [Uso de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/overview) agora está geralmente disponível em toda a API Claude, Amazon Bedrock e Google Vertex AI.

### 10 de maio de 2024

- Nossa ferramenta geradora de prompts agora está disponível no [Console de Desenvolvedor](https://console.anthropic.com). O Gerador de Prompts facilita guiar Claude para gerar prompts de alta qualidade adaptados às suas tarefas específicas. Leia mais em nosso [post do blog](https://www.anthropic.com/news/prompt-generator).