# Ventanas de contexto

Comprende cómo funcionan las ventanas de contexto en Claude, incluyendo el pensamiento extendido y el uso de herramientas.

---

## Entendiendo la ventana de contexto

La "ventana de contexto" se refiere a la totalidad de la cantidad de texto que un modelo de lenguaje puede mirar hacia atrás y referenciar al generar texto nuevo, más el texto nuevo que genera. Esto es diferente del gran corpus de datos en el que se entrenó el modelo de lenguaje, y en su lugar representa una "memoria de trabajo" para el modelo. Una ventana de contexto más grande permite que el modelo entienda y responda a indicaciones más complejas y largas, mientras que una ventana de contexto más pequeña puede limitar la capacidad del modelo para manejar indicaciones más largas o mantener coherencia en conversaciones extendidas.

El diagrama a continuación ilustra el comportamiento estándar de la ventana de contexto para solicitudes de API<sup>1</sup>:

![Diagrama de ventana de contexto](/docs/images/context-window.svg)

_<sup>1</sup>Para interfaces de chat, como [claude.ai](https://claude.ai/), las ventanas de contexto también se pueden configurar en un sistema de "primero en entrar, primero en salir" continuo._

* **Acumulación progresiva de tokens:** A medida que la conversación avanza a través de turnos, cada mensaje del usuario y respuesta del asistente se acumulan dentro de la ventana de contexto. Los turnos anteriores se preservan completamente.
* **Patrón de crecimiento lineal:** El uso del contexto crece linealmente con cada turno, con los turnos anteriores preservados completamente.
* **Capacidad de 200K tokens:** La ventana de contexto total disponible (200,000 tokens) representa la capacidad máxima para almacenar el historial de conversación y generar nueva salida desde Claude.
* **Flujo de entrada-salida:** Cada turno consta de:
  - **Fase de entrada:** Contiene todo el historial de conversación anterior más el mensaje del usuario actual
  - **Fase de salida:** Genera una respuesta de texto que se convierte en parte de una entrada futura

## La ventana de contexto con pensamiento extendido

Cuando se utiliza [pensamiento extendido](/docs/es/build-with-claude/extended-thinking), todos los tokens de entrada y salida, incluyendo los tokens utilizados para pensar, cuentan hacia el límite de la ventana de contexto, con algunos matices en situaciones de múltiples turnos.

Los tokens del presupuesto de pensamiento son un subconjunto de su parámetro `max_tokens`, se facturan como tokens de salida y cuentan hacia los límites de velocidad.

Sin embargo, los bloques de pensamiento anteriores se eliminan automáticamente del cálculo de la ventana de contexto por la API de Claude y no son parte del historial de conversación que el modelo "ve" en turnos posteriores, preservando la capacidad de tokens para el contenido de conversación real.

El diagrama a continuación demuestra la gestión especializada de tokens cuando se habilita el pensamiento extendido:

![Diagrama de ventana de contexto con pensamiento extendido](/docs/images/context-window-thinking.svg)

* **Eliminación del pensamiento extendido:** Los bloques de pensamiento extendido (mostrados en gris oscuro) se generan durante la fase de salida de cada turno, **pero no se llevan adelante como tokens de entrada para turnos posteriores**. No necesita eliminar los bloques de pensamiento usted mismo. La API de Claude lo hace automáticamente si los devuelve.
* **Detalles de implementación técnica:**
  - La API excluye automáticamente los bloques de pensamiento de turnos anteriores cuando los devuelve como parte del historial de conversación.
  - Los tokens de pensamiento extendido se facturan como tokens de salida solo una vez, durante su generación.
  - El cálculo efectivo de la ventana de contexto se convierte en: `context_window = (input_tokens - previous_thinking_tokens) + current_turn_tokens`.
  - Los tokens de pensamiento incluyen tanto bloques `thinking` como bloques `redacted_thinking`.

Esta arquitectura es eficiente en tokens y permite un razonamiento extenso sin desperdicio de tokens, ya que los bloques de pensamiento pueden ser sustanciales en longitud.

<Note>
Puede leer más sobre la ventana de contexto y el pensamiento extendido en nuestra [guía de pensamiento extendido](/docs/es/build-with-claude/extended-thinking).
</Note>

## La ventana de contexto con pensamiento extendido y uso de herramientas

El diagrama a continuación ilustra la gestión de tokens de la ventana de contexto cuando se combina el pensamiento extendido con el uso de herramientas:

![Diagrama de ventana de contexto con pensamiento extendido y uso de herramientas](/docs/images/context-window-thinking-tools.svg)

<Steps>
  <Step title="Arquitectura del primer turno">
    - **Componentes de entrada:** Configuración de herramientas y mensaje del usuario
    - **Componentes de salida:** Pensamiento extendido + respuesta de texto + solicitud de uso de herramienta
    - **Cálculo de tokens:** Todos los componentes de entrada y salida cuentan hacia la ventana de contexto, y todos los componentes de salida se facturan como tokens de salida.
  </Step>
  <Step title="Manejo de resultados de herramientas (turno 2)">
    - **Componentes de entrada:** Cada bloque del primer turno así como el `tool_result`. El bloque de pensamiento extendido **debe** ser devuelto con los resultados de herramientas correspondientes. Este es el único caso en el que **tiene que** devolver bloques de pensamiento.
    - **Componentes de salida:** Después de que los resultados de herramientas se hayan devuelto a Claude, Claude responderá solo con texto (sin pensamiento extendido adicional hasta el próximo mensaje `user`).
    - **Cálculo de tokens:** Todos los componentes de entrada y salida cuentan hacia la ventana de contexto, y todos los componentes de salida se facturan como tokens de salida.
  </Step>
  <Step title="Tercer paso">
    - **Componentes de entrada:** Todas las entradas y la salida del turno anterior se llevan adelante con la excepción del bloque de pensamiento, que se puede descartar ahora que Claude ha completado todo el ciclo de uso de herramientas. La API eliminará automáticamente el bloque de pensamiento por usted si lo devuelve, o puede sentirse libre de eliminarlo usted mismo en esta etapa. Este es también donde agregaría el próximo turno `User`.
    - **Componentes de salida:** Dado que hay un nuevo turno `User` fuera del ciclo de uso de herramientas, Claude generará un nuevo bloque de pensamiento extendido y continuará desde allí.
    - **Cálculo de tokens:** Los tokens de pensamiento anteriores se eliminan automáticamente de los cálculos de la ventana de contexto. Todos los demás bloques anteriores aún cuentan como parte de la ventana de tokens, y el bloque de pensamiento en el turno `Assistant` actual cuenta como parte de la ventana de contexto.
  </Step>
</Steps>

* **Consideraciones para el uso de herramientas con pensamiento extendido:**
  - Al publicar resultados de herramientas, el bloque de pensamiento completo sin modificar que acompaña a esa solicitud de herramienta específica (incluyendo porciones de firma/redactadas) debe incluirse.
  - El cálculo efectivo de la ventana de contexto para pensamiento extendido con uso de herramientas se convierte en: `context_window = input_tokens + current_turn_tokens`.
  - El sistema utiliza firmas criptográficas para verificar la autenticidad del bloque de pensamiento. No preservar bloques de pensamiento durante el uso de herramientas puede romper la continuidad del razonamiento de Claude. Por lo tanto, si modifica bloques de pensamiento, la API devolverá un error.

<Note>
Los modelos Claude 4 admiten [pensamiento intercalado](/docs/es/build-with-claude/extended-thinking#interleaved-thinking), que permite a Claude pensar entre llamadas de herramientas y hacer un razonamiento más sofisticado después de recibir resultados de herramientas.

Claude Sonnet 3.7 no admite pensamiento intercalado, por lo que no hay intercalación de pensamiento extendido y llamadas de herramientas sin un turno de usuario no `tool_result` en medio.

Para más información sobre el uso de herramientas con pensamiento extendido, consulte nuestra [guía de pensamiento extendido](/docs/es/build-with-claude/extended-thinking#extended-thinking-with-tool-use).
</Note>

## Ventana de contexto de 1M de tokens

Claude Sonnet 4 y 4.5 admiten una ventana de contexto de 1 millón de tokens. Esta ventana de contexto extendida le permite procesar documentos mucho más grandes, mantener conversaciones más largas y trabajar con bases de código más extensas.

<Note>
La ventana de contexto de 1M de tokens está actualmente en beta para organizaciones en [nivel de uso](/docs/es/api/rate-limits) 4 y organizaciones con límites de velocidad personalizados. La ventana de contexto de 1M de tokens solo está disponible para Claude Sonnet 4 y Sonnet 4.5.
</Note>

Para usar la ventana de contexto de 1M de tokens, incluya el [encabezado beta](/docs/es/api/beta-headers) `context-1m-2025-08-07` en sus solicitudes de API:

<CodeGroup>

```python Python
from anthropic import Anthropic

client = Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Process this large document..."}
    ],
    betas=["context-1m-2025-08-07"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const msg = await anthropic.beta.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Process this large document...' }
  ],
  betas: ['context-1m-2025-08-07']
});
```

```bash cURL
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: context-1m-2025-08-07" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Process this large document..."}
    ]
  }'
```

</CodeGroup>

**Consideraciones importantes:**
- **Estado beta**: Esta es una característica beta sujeta a cambios. Las características y precios pueden modificarse o eliminarse en futuras versiones.
- **Requisito de nivel de uso**: La ventana de contexto de 1M de tokens está disponible para organizaciones en [nivel de uso](/docs/es/api/rate-limits) 4 y organizaciones con límites de velocidad personalizados. Las organizaciones de nivel inferior deben avanzar al nivel de uso 4 para acceder a esta característica.
- **Disponibilidad**: La ventana de contexto de 1M de tokens está actualmente disponible en la API de Claude, [Microsoft Foundry](/docs/es/build-with-claude/claude-in-microsoft-foundry), [Amazon Bedrock](/docs/es/build-with-claude/claude-on-amazon-bedrock) y [Google Cloud's Vertex AI](/docs/es/build-with-claude/claude-on-vertex-ai).
- **Precios**: Las solicitudes que exceden 200K tokens se facturan automáticamente a tasas premium (2x entrada, 1.5x salida). Consulte la [documentación de precios](/docs/es/about-claude/pricing#long-context-pricing) para obtener detalles.
- **Límites de velocidad**: Las solicitudes de contexto largo tienen límites de velocidad dedicados. Consulte la [documentación de límites de velocidad](/docs/es/api/rate-limits#long-context-rate-limits) para obtener detalles.
- **Consideraciones multimodales**: Al procesar un gran número de imágenes o pdfs, tenga en cuenta que los archivos pueden variar en el uso de tokens. Al emparejar un indicador grande con un gran número de imágenes, puede alcanzar [límites de tamaño de solicitud](/docs/es/api/overview#request-size-limits).

## Conciencia de contexto en Claude Sonnet 4.5 y Haiku 4.5

Claude Sonnet 4.5 y Claude Haiku 4.5 cuentan con **conciencia de contexto**, lo que permite a estos modelos rastrear su ventana de contexto restante (es decir, "presupuesto de tokens") a lo largo de una conversación. Esto permite a Claude ejecutar tareas y gestionar el contexto de manera más efectiva al comprender cuánto espacio tiene para trabajar. Claude está entrenado de forma nativa para usar este contexto precisamente para persistir en la tarea hasta el final, en lugar de tener que adivinar cuántos tokens quedan. Para un modelo, la falta de conciencia de contexto es como competir en un programa de cocina sin un reloj. Los modelos Claude 4.5 cambian esto al informar explícitamente al modelo sobre su contexto restante, para que pueda aprovechar al máximo los tokens disponibles.

**Cómo funciona:**

Al inicio de una conversación, Claude recibe información sobre su ventana de contexto total:

```
<budget:token_budget>200000</budget:token_budget>
```

El presupuesto se establece en 200K tokens (estándar), 500K tokens (Claude.ai Enterprise) o 1M tokens (beta, para organizaciones elegibles).

Después de cada llamada de herramienta, Claude recibe una actualización sobre la capacidad restante:

```
<system_warning>Token usage: 35000/200000; 165000 remaining</system_warning>
```

Esta conciencia ayuda a Claude a determinar cuánta capacidad queda para trabajar y permite una ejecución más efectiva en tareas de larga duración. Los tokens de imagen se incluyen en estos presupuestos.

**Beneficios:**

La conciencia de contexto es particularmente valiosa para:
- Sesiones de agente de larga duración que requieren enfoque sostenido
- Flujos de trabajo de múltiples ventanas de contexto donde las transiciones de estado importan
- Tareas complejas que requieren una gestión cuidadosa de tokens

Para orientación sobre indicaciones para aprovechar la conciencia de contexto, consulte nuestra [guía de mejores prácticas de Claude 4](/docs/es/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).

## Gestión de ventanas de contexto con modelos Claude más nuevos

En modelos Claude más nuevos (comenzando con Claude Sonnet 3.7), si la suma de tokens de indicación y tokens de salida excede la ventana de contexto del modelo, el sistema devolverá un error de validación en lugar de truncar silenciosamente el contexto. Este cambio proporciona un comportamiento más predecible pero requiere una gestión de tokens más cuidadosa.

Para planificar el uso de tokens y asegurar que se mantenga dentro de los límites de la ventana de contexto, puede usar la [API de conteo de tokens](/docs/es/build-with-claude/token-counting) para estimar cuántos tokens usarán sus mensajes antes de enviarlos a Claude.

Consulte nuestra tabla de [comparación de modelos](/docs/es/about-claude/models/overview#model-comparison-table) para obtener una lista de tamaños de ventana de contexto por modelo.

# Próximos pasos
<CardGroup cols={2}>
  <Card title="Tabla de comparación de modelos" icon="scales" href="/docs/es/about-claude/models/overview#model-comparison-table">
    Consulte nuestra tabla de comparación de modelos para obtener una lista de tamaños de ventana de contexto y precios de tokens de entrada/salida por modelo.
  </Card>
  <Card title="Descripción general del pensamiento extendido" icon="settings" href="/docs/es/build-with-claude/extended-thinking">
    Obtenga más información sobre cómo funciona el pensamiento extendido y cómo implementarlo junto con otras características como el uso de herramientas y el almacenamiento en caché de indicaciones.
  </Card>
</CardGroup>