# Esforço

Controle quantos tokens Claude usa ao responder com o parâmetro effort, equilibrando entre a minuciosidade da resposta e a eficiência de tokens.

---

O parâmetro effort permite que você controle o quão disposto Claude está em gastar tokens ao responder a solicitações. Isso lhe dá a capacidade de equilibrar entre a minuciosidade da resposta e a eficiência de tokens, tudo com um único modelo.

<Note>
  O parâmetro effort está atualmente em beta e é suportado apenas por Claude Opus 4.5.

  Você deve incluir o [cabeçalho beta](/docs/pt-BR/api/beta-headers) `effort-2025-11-24` ao usar este recurso.
</Note>

## Como o esforço funciona

Por padrão, Claude usa esforço máximo—gastando quantos tokens forem necessários para o melhor resultado possível. Ao reduzir o nível de esforço, você pode instruir Claude a ser mais conservador com o uso de tokens, otimizando para velocidade e custo enquanto aceita alguma redução na capacidade.

<Tip>
Configurar `effort` para `"high"` produz exatamente o mesmo comportamento que omitir o parâmetro `effort` inteiramente.
</Tip>

O parâmetro effort afeta **todos os tokens** na resposta, incluindo:

- Respostas de texto e explicações
- Chamadas de ferramentas e argumentos de função
- Pensamento estendido (quando habilitado)

Esta abordagem tem duas grandes vantagens:

1. Não requer que o pensamento esteja habilitado para usá-lo.
2. Pode afetar todo o gasto de tokens, incluindo chamadas de ferramentas. Por exemplo, esforço menor significaria que Claude faz menos chamadas de ferramentas. Isso oferece um grau muito maior de controle sobre a eficiência.

### Níveis de esforço

| Nível    | Descrição                                                                                                                      | Caso de uso típico                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `high`   | Capacidade máxima. Claude usa quantos tokens forem necessários para o melhor resultado possível. Equivalente a não configurar o parâmetro.  | Raciocínio complexo, problemas de codificação difíceis, tarefas de agente                           |
| `medium` | Abordagem equilibrada com economia moderada de tokens. | Tarefas de agente que requerem um equilíbrio entre velocidade, custo e desempenho                                                         |
| `low`    | Mais eficiente. Economia significativa de tokens com alguma redução de capacidade. | Tarefas mais simples que precisam da melhor velocidade e menores custos, como subagentos                     |

## Uso básico

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Analyze the trade-offs between microservices and monolithic architectures"
    }],
    output_config={
        "effort": "medium"
    }
)

print(response.content[0].text)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: "claude-opus-4-5-20251101",
  betas: ["effort-2025-11-24"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Analyze the trade-offs between microservices and monolithic architectures"
  }],
  output_config: {
    effort: "medium"
  }
});

console.log(response.content[0].text);
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: effort-2025-11-24" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-opus-4-5-20251101",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures"
        }],
        "output_config": {
            "effort": "medium"
        }
    }'
```

</CodeGroup>

## Quando devo ajustar o parâmetro effort?

- Use **high effort** (o padrão) quando você precisa do melhor trabalho de Claude—raciocínio complexo, análise nuançada, problemas de codificação difíceis, ou qualquer tarefa onde a qualidade é a prioridade máxima.
- Use **medium effort** como uma opção equilibrada quando você quer um desempenho sólido sem o gasto total de tokens do high effort.
- Use **low effort** quando você está otimizando para velocidade (porque Claude responde com menos tokens) ou custo—por exemplo, tarefas simples de classificação, buscas rápidas, ou casos de uso de alto volume onde melhorias marginais de qualidade não justificam latência adicional ou gasto.

## Esforço com uso de ferramentas

Ao usar ferramentas, o parâmetro effort afeta tanto as explicações em torno das chamadas de ferramentas quanto as chamadas de ferramentas em si. Níveis de esforço mais baixos tendem a:

- Combinar múltiplas operações em menos chamadas de ferramentas
- Fazer menos chamadas de ferramentas
- Proceder diretamente à ação sem preâmbulo
- Usar mensagens de confirmação tersas após a conclusão

Níveis de esforço mais altos podem:

- Fazer mais chamadas de ferramentas
- Explicar o plano antes de tomar ação
- Fornecer resumos detalhados de mudanças
- Incluir comentários de código mais abrangentes

## Esforço com pensamento estendido

O parâmetro effort funciona junto com o orçamento de tokens de pensamento quando o pensamento estendido está habilitado. Esses dois controles servem a propósitos diferentes:

- **Parâmetro effort**: Controla como Claude gasta todos os tokens—incluindo tokens de pensamento, respostas de texto e chamadas de ferramentas
- **Orçamento de tokens de pensamento**: Define um limite máximo em tokens de pensamento especificamente

O parâmetro effort pode ser usado com ou sem pensamento estendido habilitado. Quando ambos estão configurados:

1. Primeiro determine o nível de esforço apropriado para sua tarefa
2. Depois defina o orçamento de tokens de pensamento com base na complexidade da tarefa

Para melhor desempenho em tarefas de raciocínio complexo, use high effort (o padrão) com um orçamento de tokens de pensamento alto. Isso permite que Claude pense minuciosamente e forneça respostas abrangentes.

## Melhores práticas

1. **Comece com high**: Use níveis de esforço mais baixos para equilibrar desempenho com eficiência de tokens.
2. **Use low para tarefas sensíveis à velocidade ou simples**: Quando a latência importa ou as tarefas são diretas, low effort pode reduzir significativamente os tempos de resposta e custos.
3. **Teste seu caso de uso**: O impacto dos níveis de esforço varia por tipo de tarefa. Avalie o desempenho em seus casos de uso específicos antes de implantar.
4. **Considere esforço dinâmico**: Ajuste o esforço com base na complexidade da tarefa. Consultas simples podem justificar low effort enquanto codificação de agente e raciocínio complexo se beneficiam de high effort.