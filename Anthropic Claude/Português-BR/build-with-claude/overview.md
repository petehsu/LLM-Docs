# Visão geral dos recursos

Explore os recursos e capacidades avançadas do Claude.

---

## Capacidades principais

Esses recursos aprimoram as habilidades fundamentais do Claude para processar, analisar e gerar conteúdo em vários formatos e casos de uso.

| Recurso | Descrição | Disponibilidade |
|---------|-------------|--------------|
| [Janela de contexto de 1M de tokens](/docs/pt-BR/build-with-claude/context-windows#1m-token-context-window) | Uma janela de contexto estendida que permite processar documentos muito maiores, manter conversas mais longas e trabalhar com bases de código mais extensas. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Agent Skills](/docs/pt-BR/agents-and-tools/agent-skills/overview) | Estenda as capacidades do Claude com Skills. Use Skills pré-construídas (PowerPoint, Excel, Word, PDF) ou crie Skills personalizadas com instruções e scripts. As Skills usam divulgação progressiva para gerenciar eficientemente o contexto. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Processamento em lote](/docs/pt-BR/build-with-claude/batch-processing) | Processe grandes volumes de solicitações de forma assíncrona para economizar custos. Envie lotes com um grande número de consultas por lote. As chamadas da API em lote custam 50% menos do que as chamadas da API padrão. | <PlatformAvailability claudeApi bedrock vertexAi /> |
| [Citações](/docs/pt-BR/build-with-claude/citations) | Fundamente as respostas do Claude em documentos de origem. Com Citações, o Claude pode fornecer referências detalhadas às frases e passagens exatas que usa para gerar respostas, levando a saídas mais verificáveis e confiáveis. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Edição de contexto](/docs/pt-BR/build-with-claude/context-editing) | Gerencie automaticamente o contexto da conversa com estratégias configuráveis. Suporta limpeza de resultados de ferramentas ao se aproximar dos limites de tokens e gerenciamento de blocos de pensamento em conversas de pensamento estendido. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Esforço](/docs/pt-BR/build-with-claude/effort) | Controle quantos tokens o Claude usa ao responder com o parâmetro de esforço, equilibrando entre a minuciosidade da resposta e a eficiência de tokens. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking) | Capacidades de raciocínio aprimoradas para tarefas complexas, fornecendo transparência no processo de pensamento passo a passo do Claude antes de entregar sua resposta final. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [API de Arquivos](/docs/pt-BR/build-with-claude/files) | Carregue e gerencie arquivos para usar com Claude sem fazer upload novamente do conteúdo a cada solicitação. Suporta PDFs, imagens e arquivos de texto. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Suporte a PDF](/docs/pt-BR/build-with-claude/pdf-support) | Processe e analise conteúdo textual e visual de documentos PDF. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Cache de prompt (5m)](/docs/pt-BR/build-with-claude/prompt-caching) | Forneça ao Claude mais conhecimento de fundo e exemplos de saída para reduzir custos e latência. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Cache de prompt (1hr)](/docs/pt-BR/build-with-claude/prompt-caching#1-hour-cache-duration) | Duração de cache estendida de 1 hora para contexto menos frequentemente acessado, mas importante, complementando o cache padrão de 5 minutos. | <PlatformAvailability claudeApi azureAi /> |
| [Resultados de pesquisa](/docs/pt-BR/build-with-claude/search-results) | Ative citações naturais para aplicações RAG fornecendo resultados de pesquisa com atribuição de fonte apropriada. Alcance citações de qualidade de pesquisa na web para bases de conhecimento personalizadas e ferramentas. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Saídas estruturadas](/docs/pt-BR/build-with-claude/structured-outputs) | Garanta conformidade de esquema com duas abordagens: saídas JSON para respostas de dados estruturados e uso rigoroso de ferramentas para entradas de ferramentas validadas. Disponível em Sonnet 4.5, Opus 4.1, Opus 4.5 e Haiku 4.5. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Contagem de tokens](/docs/pt-BR/api/messages-count-tokens) | A contagem de tokens permite determinar o número de tokens em uma mensagem antes de enviá-la ao Claude, ajudando você a tomar decisões informadas sobre seus prompts e uso. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Uso de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/overview) | Permita que o Claude interaja com ferramentas e APIs externas para executar uma variedade maior de tarefas. Para uma lista de ferramentas suportadas, consulte [a tabela de Ferramentas](#tools). | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |

## Ferramentas

Esses recursos permitem que o Claude interaja com sistemas externos, execute código e execute tarefas automatizadas através de várias interfaces de ferramentas.

| Recurso | Descrição | Disponibilidade |
|---------|-------------|--------------|
| [Bash](/docs/pt-BR/agents-and-tools/tool-use/bash-tool) | Execute comandos e scripts bash para interagir com o shell do sistema e executar operações de linha de comando. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Execução de código](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool) | Execute código Python em um ambiente isolado para análise avançada de dados. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Chamada de ferramenta programática](/docs/pt-BR/agents-and-tools/tool-use/programmatic-tool-calling) | Permita que o Claude chame suas ferramentas programaticamente de dentro de contêineres de execução de código, reduzindo latência e consumo de tokens para fluxos de trabalho com múltiplas ferramentas. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Uso de computador](/docs/pt-BR/agents-and-tools/tool-use/computer-use-tool) | Controle interfaces de computador capturando capturas de tela e emitindo comandos de mouse e teclado. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Streaming de ferramenta de granularidade fina](/docs/pt-BR/agents-and-tools/tool-use/fine-grained-tool-streaming) | Transmita parâmetros de uso de ferramenta sem buffering/validação JSON, reduzindo latência para receber parâmetros grandes. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Conector MCP](/docs/pt-BR/agents-and-tools/mcp-connector) | Conecte-se a servidores [MCP](/docs/pt-BR/mcp) remotos diretamente da API de Mensagens sem um cliente MCP separado. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Memória](/docs/pt-BR/agents-and-tools/tool-use/memory-tool) | Permita que o Claude armazene e recupere informações entre conversas. Construa bases de conhecimento ao longo do tempo, mantenha contexto do projeto e aprenda com interações passadas. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Editor de texto](/docs/pt-BR/agents-and-tools/tool-use/text-editor-tool) | Crie e edite arquivos de texto com uma interface de editor de texto integrada para tarefas de manipulação de arquivos. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Pesquisa de ferramenta](/docs/pt-BR/agents-and-tools/tool-use/tool-search-tool) | Dimensione para milhares de ferramentas descobrindo e carregando ferramentas dinamicamente sob demanda usando pesquisa baseada em regex, otimizando o uso de contexto e melhorando a precisão da seleção de ferramentas. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Busca na web](/docs/pt-BR/agents-and-tools/tool-use/web-fetch-tool) | Recupere conteúdo completo de páginas da web e documentos PDF especificados para análise aprofundada. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Pesquisa na web](/docs/pt-BR/agents-and-tools/tool-use/web-search-tool) | Aumente o conhecimento abrangente do Claude com dados atuais e do mundo real de toda a web. | <PlatformAvailability claudeApi vertexAi azureAi /> |