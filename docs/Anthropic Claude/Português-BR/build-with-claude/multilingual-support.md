# Suporte multilíngue

Claude se destaca em tarefas em múltiplos idiomas, mantendo um desempenho forte entre idiomas em relação ao inglês.

---

## Visão geral

Claude demonstra capacidades multilíngues robustas, com desempenho particularmente forte em tarefas zero-shot entre idiomas. O modelo mantém desempenho relativo consistente em idiomas amplamente falados e de recursos limitados, tornando-o uma escolha confiável para aplicações multilíngues.

Observe que Claude é capaz em muitos idiomas além daqueles avaliados abaixo. Encorajamos testes com qualquer idioma relevante para seus casos de uso específicos.

## Dados de desempenho

Abaixo estão os scores de avaliação zero-shot chain-of-thought para Claude 4, Claude 3.7 Sonnet e modelos Claude 3.5 em diferentes idiomas, mostrados como um percentual relativo ao desempenho em inglês (100%):

| Idioma | Claude Opus 4<sup>1</sup> | Claude Sonnet 4<sup>1</sup> | Claude Sonnet 3.7 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations))<sup>1</sup> | Claude Haiku 3.5|
|---|---|---|---|---|
| Inglês (linha de base, fixado em 100%) | 100% | 100% | 100% | 100% |
| Espanhol | 98.0% | 97.5% | 97.6% | 94.6% |
| Português (Brasil) | 97.3% | 97.2% | 97.3% | 94.6% |
| Italiano | 97.5% | 97.3% | 97.2% | 95.0% |
| Francês | 97.7% | 97.1% | 96.9% | 95.3% |
| Indonésio | 97.2% | 96.2% | 96.3% | 91.2% |
| Alemão | 97.1% | 94.7% | 96.2% | 92.5% |
| Árabe | 96.9% | 96.1% | 95.4% | 84.7% |
| Chinês (Simplificado) | 96.7% | 95.9% | 95.3% | 90.9% |
| Coreano | 96.4% | 95.9% | 95.2% | 89.1% |
| Japonês | 96.2% | 95.6% | 95.0% | 90.8% |
| Hindi | 96.7% | 95.8% | 94.2% | 80.1% |
| Bengali | 95.2% | 94.4% | 92.4% | 72.9% |
| Suaíli | 89.5% | 87.1% | 89.2% | 64.7% |
| Iorubá | 78.9% | 76.4% | 76.7% | 46.1% |

<sup>1</sup> Com [pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking).

<Note>
Essas métricas são baseadas em conjuntos de testes MMLU (Massive Multitask Language Understanding) em inglês que foram traduzidos para 14 idiomas adicionais por tradutores humanos profissionais, conforme documentado no [repositório simple-evals do OpenAI](https://github.com/openai/simple-evals/blob/main/multilingual_mmlu_benchmark_results.md). O uso de tradutores humanos para esta avaliação garante traduções de alta qualidade, particularmente importante para idiomas com menos recursos digitais.
</Note>

***

## Melhores práticas

Ao trabalhar com conteúdo multilíngue:

1. **Forneça contexto claro de idioma**: Embora Claude possa detectar o idioma de destino automaticamente, declarar explicitamente o idioma de entrada/saída desejado melhora a confiabilidade. Para maior fluência, você pode solicitar ao Claude que use "fala idiomática como se fosse um falante nativo."
2. **Use scripts nativos**: Envie texto em seu script nativo em vez de transliteração para resultados ideais
3. **Considere o contexto cultural**: A comunicação eficaz geralmente requer consciência cultural e regional além da pura tradução

Também sugerimos seguir nossas [diretrizes gerais de engenharia de prompts](/docs/pt-BR/build-with-claude/prompt-engineering/overview) para melhorar melhor o desempenho do Claude.

***

## Considerações de suporte de idioma

- Claude processa entrada e gera saída na maioria dos idiomas mundiais que usam caracteres Unicode padrão
- O desempenho varia por idioma, com capacidades particularmente fortes em idiomas amplamente falados
- Mesmo em idiomas com menos recursos digitais, Claude mantém capacidades significativas

<CardGroup cols={2}>
  <Card title="Guia de Engenharia de Prompts" icon="edit" href="/docs/pt-BR/build-with-claude/prompt-engineering/overview">
    Domine a arte de criar prompts para aproveitar ao máximo o Claude.
  </Card>
  <Card title="Biblioteca de Prompts" icon="books" href="/docs/pt-BR/resources/prompt-library">
    Encontre uma ampla gama de prompts pré-elaborados para várias tarefas e indústrias. Perfeito para inspiração ou inicializações rápidas.
  </Card>
</CardGroup>