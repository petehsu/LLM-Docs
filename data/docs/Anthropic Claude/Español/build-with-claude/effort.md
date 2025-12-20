# Esfuerzo

Controla cuántos tokens usa Claude al responder con el parámetro effort, equilibrando entre la exhaustividad de la respuesta y la eficiencia de tokens.

---

El parámetro effort te permite controlar cuán dispuesto está Claude a gastar tokens al responder a solicitudes. Esto te da la capacidad de equilibrar entre la exhaustividad de la respuesta y la eficiencia de tokens, todo con un único modelo.

<Note>
  El parámetro effort está actualmente en beta y solo es compatible con Claude Opus 4.5.

  Debes incluir el [encabezado beta](/docs/es/api/beta-headers) `effort-2025-11-24` al usar esta función.
</Note>

## Cómo funciona el esfuerzo

Por defecto, Claude usa el máximo esfuerzo, gastando tantos tokens como sea necesario para el mejor resultado posible. Al reducir el nivel de esfuerzo, puedes instruir a Claude para que sea más conservador con el uso de tokens, optimizando para velocidad y costo mientras aceptas una reducción en la capacidad.

<Tip>
Establecer `effort` a `"high"` produce exactamente el mismo comportamiento que omitir el parámetro `effort` por completo.
</Tip>

El parámetro effort afecta **todos los tokens** en la respuesta, incluyendo:

- Respuestas de texto y explicaciones
- Llamadas a herramientas y argumentos de funciones
- Pensamiento extendido (cuando está habilitado)

Este enfoque tiene dos ventajas principales:

1. No requiere que el pensamiento esté habilitado para usarlo.
2. Puede afectar todo el gasto de tokens incluyendo llamadas a herramientas. Por ejemplo, un esfuerzo menor significaría que Claude hace menos llamadas a herramientas. Esto proporciona un grado mucho mayor de control sobre la eficiencia.

### Niveles de esfuerzo

| Nivel    | Descripción                                                                                                                      | Caso de uso típico                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `high`   | Máxima capacidad. Claude usa tantos tokens como sea necesario para el mejor resultado posible. Equivalente a no establecer el parámetro.  | Razonamiento complejo, problemas de codificación difíciles, tareas agentivas                           |
| `medium` | Enfoque equilibrado con ahorros de tokens moderados. | Tareas agentivas que requieren un equilibrio entre velocidad, costo y rendimiento                                                         |
| `low`    | Más eficiente. Ahorros significativos de tokens con alguna reducción de capacidad. | Tareas más simples que necesitan la mejor velocidad y los costos más bajos, como subagentos                     |

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

## ¿Cuándo debo ajustar el parámetro effort?

- Usa **high effort** (el predeterminado) cuando necesites el mejor trabajo de Claude: razonamiento complejo, análisis matizado, problemas de codificación difíciles, o cualquier tarea donde la calidad sea la prioridad principal.
- Usa **medium effort** como una opción equilibrada cuando quieras un rendimiento sólido sin el gasto completo de tokens del high effort.
- Usa **low effort** cuando estés optimizando para velocidad (porque Claude responde con menos tokens) o costo, por ejemplo, tareas simples de clasificación, búsquedas rápidas, o casos de uso de alto volumen donde las mejoras marginales de calidad no justifican latencia adicional o gasto.

## Esfuerzo con uso de herramientas

Al usar herramientas, el parámetro effort afecta tanto las explicaciones alrededor de las llamadas a herramientas como las llamadas a herramientas en sí. Los niveles de esfuerzo más bajos tienden a:

- Combinar múltiples operaciones en menos llamadas a herramientas
- Hacer menos llamadas a herramientas
- Proceder directamente a la acción sin preámbulo
- Usar mensajes de confirmación concisos después de la finalización

Los niveles de esfuerzo más altos pueden:

- Hacer más llamadas a herramientas
- Explicar el plan antes de tomar acción
- Proporcionar resúmenes detallados de cambios
- Incluir comentarios de código más completos

## Esfuerzo con pensamiento extendido

El parámetro effort funciona junto con el presupuesto de tokens de pensamiento cuando el pensamiento extendido está habilitado. Estos dos controles sirven propósitos diferentes:

- **Parámetro effort**: Controla cómo Claude gasta todos los tokens, incluyendo tokens de pensamiento, respuestas de texto y llamadas a herramientas
- **Presupuesto de tokens de pensamiento**: Establece un límite máximo en tokens de pensamiento específicamente

El parámetro effort puede usarse con o sin pensamiento extendido habilitado. Cuando ambos están configurados:

1. Primero determina el nivel de esfuerzo apropiado para tu tarea
2. Luego establece el presupuesto de tokens de pensamiento basado en la complejidad de la tarea

Para el mejor rendimiento en tareas de razonamiento complejo, usa high effort (el predeterminado) con un presupuesto de tokens de pensamiento alto. Esto permite a Claude pensar a fondo y proporcionar respuestas completas.

## Mejores prácticas

1. **Comienza con high**: Usa niveles de esfuerzo más bajos para equilibrar rendimiento con eficiencia de tokens.
2. **Usa low para tareas sensibles a la velocidad o simples**: Cuando la latencia importa o las tareas son directas, low effort puede reducir significativamente los tiempos de respuesta y los costos.
3. **Prueba tu caso de uso**: El impacto de los niveles de esfuerzo varía según el tipo de tarea. Evalúa el rendimiento en tus casos de uso específicos antes de implementar.
4. **Considera esfuerzo dinámico**: Ajusta el esfuerzo basado en la complejidad de la tarea. Las consultas simples pueden justificar low effort mientras que la codificación agentiva y el razonamiento complejo se benefician de high effort.