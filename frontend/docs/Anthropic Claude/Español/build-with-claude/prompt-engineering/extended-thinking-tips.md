# Consejos de pensamiento extendido

Estrategias avanzadas y técnicas para aprovechar al máximo las características de pensamiento extendido de Claude.

---

Esta guía proporciona estrategias avanzadas y técnicas para aprovechar al máximo las características de pensamiento extendido de Claude. El pensamiento extendido permite a Claude trabajar a través de problemas complejos paso a paso, mejorando el rendimiento en tareas difíciles.

Consulta [Modelos de pensamiento extendido](/docs/es/about-claude/models/extended-thinking-models) para obtener orientación sobre cuándo usar el pensamiento extendido.

## Antes de profundizar

Esta guía presupone que ya has decidido usar el modo de pensamiento extendido y has revisado nuestros pasos básicos sobre [cómo comenzar con el pensamiento extendido](/docs/es/about-claude/models/extended-thinking-models#getting-started-with-extended-thinking-models) así como nuestra [guía de implementación de pensamiento extendido](/docs/es/build-with-claude/extended-thinking).

### Consideraciones técnicas para el pensamiento extendido

- Los tokens de pensamiento tienen un presupuesto mínimo de 1024 tokens. Recomendamos que comiences con el presupuesto mínimo de pensamiento y aumentes incrementalmente para ajustar según tus necesidades y la complejidad de la tarea.
- Para cargas de trabajo donde el presupuesto óptimo de pensamiento está por encima de 32K, recomendamos que uses [procesamiento por lotes](/docs/es/build-with-claude/batch-processing) para evitar problemas de red. Las solicitudes que empujan al modelo a pensar por encima de 32K tokens causan solicitudes de larga duración que podrían encontrarse con tiempos de espera del sistema y límites de conexión abierta.
- El pensamiento extendido funciona mejor en inglés, aunque las salidas finales pueden estar en [cualquier idioma que Claude soporte](/docs/es/build-with-claude/multilingual-support).
- Si necesitas pensamiento por debajo del presupuesto mínimo, recomendamos usar el modo estándar, con el pensamiento desactivado, con prompting tradicional de cadena de pensamiento con etiquetas XML (como `<thinking>`). Consulta [prompting de cadena de pensamiento](/docs/es/build-with-claude/prompt-engineering/chain-of-thought).

## Técnicas de prompting para pensamiento extendido

### Usa instrucciones generales primero, luego soluciona problemas con instrucciones más paso a paso

Claude a menudo funciona mejor con instrucciones de alto nivel para simplemente pensar profundamente sobre una tarea en lugar de orientación prescriptiva paso a paso. La creatividad del modelo para abordar problemas puede superar la capacidad humana de prescribir el proceso de pensamiento óptimo.

Por ejemplo, en lugar de:

<CodeGroup>
```text User
Piensa en este problema de matemáticas paso a paso:
1. Primero, identifica las variables
2. Luego, establece la ecuación
3. A continuación, resuelve para x
...
```
</CodeGroup>

Considera:

<CodeGroup>
```text User
Por favor piensa en este problema de matemáticas minuciosamente y con gran detalle.
Considera múltiples enfoques y muestra tu razonamiento completo.
Prueba diferentes métodos si tu primer enfoque no funciona.
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Por favor piensa en este problema de matemáticas minuciosamente y con gran detalle.
Considera múltiples enfoques y muestra tu razonamiento completo.
Prueba diferentes métodos si tu primer enfoque no funciona.`
  }
  thinkingBudgetTokens={16000}
>
  Probar en Consola
</TryInConsoleButton>

Dicho esto, Claude aún puede seguir efectivamente pasos de ejecución estructurados complejos cuando sea necesario. El modelo puede manejar incluso listas más largas con instrucciones más complejas que las versiones anteriores. Recomendamos que comiences con instrucciones más generalizadas, luego leas la salida de pensamiento de Claude e iteres para proporcionar instrucciones más específicas para dirigir su pensamiento desde ahí.

### Prompting multishot con pensamiento extendido

El [prompting multishot](/docs/es/build-with-claude/prompt-engineering/multishot-prompting) funciona bien con el pensamiento extendido. Cuando proporcionas a Claude ejemplos de cómo pensar a través de problemas, seguirá patrones de razonamiento similares dentro de sus bloques de pensamiento extendido.

Puedes incluir ejemplos few-shot en tu prompt en escenarios de pensamiento extendido usando etiquetas XML como `<thinking>` o `<scratchpad>` para indicar patrones canónicos de pensamiento extendido en esos ejemplos.

Claude generalizará el patrón al proceso formal de pensamiento extendido. Sin embargo, es posible que obtengas mejores resultados dando a Claude rienda suelta para pensar de la manera que considere mejor.

Ejemplo:

<CodeGroup>
```text User
Te voy a mostrar cómo resolver un problema de matemáticas, luego quiero que resuelvas uno similar.

Problema 1: ¿Cuál es el 15% de 80?

<thinking>
Para encontrar el 15% de 80:
1. Convertir 15% a decimal: 15% = 0.15
2. Multiplicar: 0.15 × 80 = 12
</thinking>

La respuesta es 12.

Ahora resuelve este:
Problema 2: ¿Cuál es el 35% de 240?
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Te voy a mostrar cómo resolver un problema de matemáticas, luego quiero que resuelvas uno similar.

Problema 1: ¿Cuál es el 15% de 80?

<thinking>
Para encontrar el 15% de 80:
1. Convertir 15% a decimal: 15% = 0.15
2. Multiplicar: 0.15 × 80 = 12
</thinking>

La respuesta es 12.

Ahora resuelve este:
Problema 2: ¿Cuál es el 35% de 240?`
  }
  thinkingBudgetTokens={16000} 
>
  Probar en Consola
</TryInConsoleButton>

### Maximizar el seguimiento de instrucciones con pensamiento extendido
Claude muestra un seguimiento de instrucciones significativamente mejorado cuando el pensamiento extendido está habilitado. El modelo típicamente:
1. Razona sobre las instrucciones dentro del bloque de pensamiento extendido
2. Ejecuta esas instrucciones en la respuesta

Para maximizar el seguimiento de instrucciones:
- Sé claro y específico sobre lo que quieres
- Para instrucciones complejas, considera dividirlas en pasos numerados que Claude debería trabajar metódicamente
- Permite a Claude suficiente presupuesto para procesar las instrucciones completamente en su pensamiento extendido

### Usar pensamiento extendido para depurar y dirigir el comportamiento de Claude
Puedes usar la salida de pensamiento de Claude para depurar la lógica de Claude, aunque este método no siempre es perfectamente confiable.

Para hacer el mejor uso de esta metodología, recomendamos los siguientes consejos:
- No recomendamos pasar el pensamiento extendido de Claude de vuelta en el bloque de texto del usuario, ya que esto no mejora el rendimiento y puede realmente degradar los resultados.
- El prellenado de pensamiento extendido está explícitamente no permitido, y cambiar manualmente el texto de salida del modelo que sigue a su bloque de pensamiento probablemente va a degradar los resultados debido a la confusión del modelo.

Cuando el pensamiento extendido está desactivado, el [prellenado](/docs/es/build-with-claude/prompt-engineering/prefill-claudes-response) de texto de respuesta estándar `assistant` aún está permitido.

<Note>
A veces Claude puede repetir su pensamiento extendido en el texto de salida del asistente. Si quieres una respuesta limpia, instruye a Claude que no repita su pensamiento extendido y que solo produzca la respuesta.
</Note>

### Aprovechar al máximo las salidas largas y el pensamiento de forma larga

Para casos de uso de generación de conjuntos de datos, prueba prompts como "Por favor crea una tabla extremadamente detallada de..." para generar conjuntos de datos comprensivos.

Para casos de uso como generación de contenido detallado donde puedes querer generar bloques de pensamiento extendido más largos y respuestas más detalladas, prueba estos consejos:
- Aumenta tanto la longitud máxima de pensamiento extendido Y pide explícitamente salidas más largas
- Para salidas muy largas (20,000+ palabras), solicita un esquema detallado con conteos de palabras hasta el nivel de párrafo. Luego pide a Claude que indexe sus párrafos al esquema y mantenga los conteos de palabras especificados

<Warning>
No recomendamos que empujes a Claude a producir más tokens por el bien de producir tokens. Más bien, te alentamos a comenzar with un presupuesto de pensamiento pequeño y aumentar según sea necesario para encontrar la configuración óptima para tu caso de uso.
</Warning>

Aquí hay casos de uso de ejemplo donde Claude sobresale debido al pensamiento extendido más largo:

  <section title="Problemas STEM complejos">

    Los problemas STEM complejos requieren que Claude construya modelos mentales, aplique conocimiento especializado y trabaje a través de pasos lógicos secuenciales—procesos que se benefician de un tiempo de razonamiento más largo.
    
    <Tabs>
      <Tab title="Prompt estándar">
        <CodeGroup>
        ```text User
        Escribe un script de python para una pelota amarilla que rebota dentro de un cuadrado,
        asegúrate de manejar la detección de colisiones correctamente.
        Haz que el cuadrado rote lentamente.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Escribe un script de python para una pelota amarilla que rebota dentro de un cuadrado,
asegúrate de manejar la detección de colisiones correctamente.
Haz que el cuadrado rote lentamente.`
          }
          thinkingBudgetTokens={16000}
        >
          Probar en Consola
        </TryInConsoleButton>
        <Note>
        Esta tarea más simple típicamente resulta en solo unos pocos segundos de tiempo de pensamiento.
        </Note>
      </Tab>
      <Tab title="Prompt mejorado">
        <CodeGroup>
        ```text User
        Escribe un script de Python para una pelota amarilla que rebota dentro de un teseracto,
        asegurándote de manejar la detección de colisiones correctamente.
        Haz que el teseracto rote lentamente.
        Asegúrate de que la pelota se mantenga dentro del teseracto.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Escribe un script de Python para una pelota amarilla que rebota dentro de un teseracto,
asegurándote de manejar la detección de colisiones correctamente.
Haz que el teseracto rote lentamente.
Asegúrate de que la pelota se mantenga dentro del teseracto.`
          }
          thinkingBudgetTokens={16000}
        >
          Probar en Consola
        </TryInConsoleButton>
        <Note>
        Este desafío complejo de visualización 4D hace el mejor uso del tiempo de pensamiento extendido largo mientras Claude trabaja a través de la complejidad matemática y de programación.
        </Note>
      </Tab>
    </Tabs>
  
</section>
  
  <section title="Problemas de optimización con restricciones">

    La optimización con restricciones desafía a Claude a satisfacer múltiples requisitos competidores simultáneamente, lo cual se logra mejor cuando se permite un tiempo de pensamiento extendido largo para que el modelo pueda abordar metódicamente cada restricción.
    
    <Tabs>
      <Tab title="Prompt estándar">
        <CodeGroup>
        ```text User
        Planifica unas vacaciones de una semana en Japón.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt="Planifica unas vacaciones de una semana en Japón."
          thinkingBudgetTokens={16000}
        >
          Probar en Consola
        </TryInConsoleButton>
        <Note>
        Esta solicitud abierta típicamente resulta en solo unos pocos segundos de tiempo de pensamiento.
        </Note>
      </Tab>
      <Tab title="Prompt mejorado">
        <CodeGroup>
        ```text User
        Planifica un viaje de 7 días a Japón con las siguientes restricciones:
        - Presupuesto de $2,500
        - Debe incluir Tokio y Kioto
        - Necesita acomodar una dieta vegetariana
        - Preferencia por experiencias culturales sobre compras
        - Debe incluir un día de senderismo
        - No más de 2 horas de viaje entre ubicaciones por día
        - Necesita tiempo libre cada tarde para llamadas de vuelta a casa
        - Debe evitar multitudes donde sea posible
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Planifica un viaje de 7 días a Japón con las siguientes restricciones:
- Presupuesto de $2,500
- Debe incluir Tokio y Kioto
- Necesita acomodar una dieta vegetariana
- Preferencia por experiencias culturales sobre compras
- Debe incluir un día de senderismo
- No más de 2 horas de viaje entre ubicaciones por día
- Necesita tiempo libre cada tarde para llamadas de vuelta a casa
- Debe evitar multitudes donde sea posible`
          }
          thinkingBudgetTokens={16000}
        >
          Probar en Consola
        </TryInConsoleButton>
        <Note>
        Con múltiples restricciones que equilibrar, Claude naturalmente funcionará mejor cuando se le dé más espacio para pensar cómo satisfacer todos los requisitos de manera óptima.
        </Note>
      </Tab>
    </Tabs>
  
</section>
  
  <section title="Marcos de pensamiento">

    Los marcos de pensamiento estructurados dan a Claude una metodología explícita a seguir, lo cual puede funcionar mejor cuando a Claude se le da un espacio de pensamiento extendido largo para seguir cada paso.
    
    <Tabs>
      <Tab title="Prompt estándar">
        <CodeGroup>
        ```text User
        Desarrolla una estrategia comprensiva para que Microsoft
        entre al mercado de medicina personalizada para 2027.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Desarrolla una estrategia comprensiva para que Microsoft
entre al mercado de medicina personalizada para 2027.`
          }
          thinkingBudgetTokens={16000}
        >
          Probar en Consola
        </TryInConsoleButton>
        <Note>
        Esta pregunta estratégica amplia típicamente resulta en solo unos pocos segundos de tiempo de pensamiento.
        </Note>
      </Tab>
      <Tab title="Prompt mejorado">
        <CodeGroup>
        ```text User
        Desarrolla una estrategia comprensiva para que Microsoft entre
        al mercado de medicina personalizada para 2027.
        
        Comienza con:
        1. Un lienzo de Estrategia de Océano Azul
        2. Aplica las Cinco Fuerzas de Porter para identificar presiones competitivas
        
        A continuación, conduce un ejercicio de planificación de escenarios con cuatro
        futuros distintos basados en variables regulatorias y tecnológicas.
        
        Para cada escenario:
        - Desarrolla respuestas estratégicas usando la Matriz de Ansoff
        
        Finalmente, aplica el marco de Tres Horizontes para:
        - Mapear la ruta de transición
        - Identificar innovaciones disruptivas potenciales en cada etapa
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Desarrolla una estrategia comprensiva para que Microsoft entre
al mercado de medicina personalizada para 2027.

Comienza con:
1. Un lienzo de Estrategia de Océano Azul
2. Aplica las Cinco Fuerzas de Porter para identificar presiones competitivas

A continuación, conduce un ejercicio de planificación de escenarios con cuatro
futuros distintos basados en variables regulatorias y tecnológicas.

Para cada escenario:
- Desarrolla respuestas estratégicas usando la Matriz de Ansoff

Finalmente, aplica el marco de Tres Horizontes para:
- Mapear la ruta de transición
- Identificar innovaciones disruptivas potenciales en cada etapa`
          }
          thinkingBudgetTokens={16000}
        >
          Probar en Consola
        </TryInConsoleButton>
        <Note>
        Al especificar múltiples marcos analíticos que deben aplicarse secuencialmente, el tiempo de pensamiento aumenta naturalmente mientras Claude trabaja a través de cada marco metódicamente.
        </Note>
      </Tab>
    </Tabs>
  
</section>

### Haz que Claude reflexione y verifique su trabajo para mejorar la consistencia y el manejo de errores
Puedes usar prompting de lenguaje natural simple para mejorar la consistencia y reducir errores:
1. Pide a Claude que verifique su trabajo con una prueba simple antes de declarar una tarea completa
2. Instruye al modelo para analizar si su paso anterior logró el resultado esperado
3. Para tareas de codificación, pide a Claude que ejecute casos de prueba en su pensamiento extendido

Ejemplo:

<CodeGroup>
```text User
Escribe una función para calcular el factorial de un número.
Antes de terminar, por favor verifica tu solución con casos de prueba para:
- n=0
- n=1
- n=5
- n=10
Y arregla cualquier problema que encuentres.
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Escribe una función para calcular el factorial de un número.
Antes de terminar, por favor verifica tu solución con casos de prueba para:
- n=0
- n=1
- n=5
- n=10
Y arregla cualquier problema que encuentres.`
  }
  thinkingBudgetTokens={16000}
>
  Probar en Consola
</TryInConsoleButton>

## Próximos pasos

<CardGroup>
  <Card title="Libro de recetas de pensamiento extendido" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    Explora ejemplos prácticos de pensamiento extendido en nuestro libro de recetas.
  </Card>
  <Card title="Guía de pensamiento extendido" icon="code" href="/docs/es/build-with-claude/extended-thinking">
    Ve la documentación técnica completa para implementar pensamiento extendido.
  </Card>
</CardGroup>