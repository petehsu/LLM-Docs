# Usa nuestro mejorador de prompts para optimizar tus prompts

---

<Note>
Nuestro mejorador de prompts es compatible con todos los modelos de Claude, incluyendo aquellos con capacidades de pensamiento extendido. Para consejos de prompting específicos para modelos de pensamiento extendido, consulta [aquí](/docs/es/build-with-claude/extended-thinking).
</Note>

El mejorador de prompts te ayuda a iterar y mejorar rápidamente tus prompts a través de análisis y mejora automatizados. Sobresale en hacer que los prompts sean más robustos para tareas complejas que requieren alta precisión.

<Frame>
  ![Image](/docs/images/prompt_improver.png)
</Frame>

## Antes de comenzar

Necesitarás:
- Una [plantilla de prompt](/docs/es/build-with-claude/prompt-engineering/prompt-templates-and-variables) para mejorar
- Retroalimentación sobre problemas actuales con las salidas de Claude (opcional pero recomendado)
- Entradas de ejemplo y salidas ideales (opcional pero recomendado)

## Cómo funciona el mejorador de prompts

El mejorador de prompts mejora tus prompts en 4 pasos:

1. **Identificación de ejemplos**: Localiza y extrae ejemplos de tu plantilla de prompt
2. **Borrador inicial**: Crea una plantilla estructurada con secciones claras y etiquetas XML
3. **Refinamiento de cadena de pensamiento**: Añade y refina instrucciones detalladas de razonamiento
4. **Mejora de ejemplos**: Actualiza los ejemplos para demostrar el nuevo proceso de razonamiento

Puedes ver estos pasos suceder en tiempo real en el modal de mejora.

## Lo que obtienes

El mejorador de prompts genera plantillas con:
- Instrucciones detalladas de cadena de pensamiento que guían el proceso de razonamiento de Claude y típicamente mejoran su rendimiento
- Organización clara usando etiquetas XML para separar diferentes componentes
- Formato estandarizado de ejemplos que demuestra razonamiento paso a paso desde la entrada hasta la salida
- Prellenados estratégicos que guían las respuestas iniciales de Claude

<Note>
Aunque los ejemplos aparecen por separado en la interfaz de usuario de Workbench, se incluyen al inicio del primer mensaje del usuario en la llamada real de la API. Ve el formato crudo haciendo clic en "**\<\/\> Get Code**" o inserta ejemplos como texto crudo a través de la caja de Ejemplos.
</Note>

## Cómo usar el mejorador de prompts

1. Envía tu plantilla de prompt
2. Añade cualquier retroalimentación sobre problemas con las salidas actuales de Claude (ej., "los resúmenes son demasiado básicos para audiencias expertas")
3. Incluye entradas de ejemplo y salidas ideales
4. Revisa el prompt mejorado

## Generar ejemplos de prueba

¿No tienes ejemplos aún? Usa nuestro [Generador de Casos de Prueba](/docs/es/test-and-evaluate/eval-tool#creating-test-cases) para:
1. Generar entradas de muestra
2. Obtener las respuestas de Claude
3. Editar las respuestas para que coincidan con tus salidas ideales
4. Añadir los ejemplos pulidos a tu prompt

## Cuándo usar el mejorador de prompts

El mejorador de prompts funciona mejor para:
- Tareas complejas que requieren razonamiento detallado
- Situaciones donde la precisión es más importante que la velocidad
- Problemas donde las salidas actuales de Claude necesitan mejora significativa

<Note>
Para aplicaciones sensibles a la latencia o al costo, considera usar prompts más simples. El mejorador de prompts crea plantillas que producen respuestas más largas, más completas, pero más lentas.
</Note>

## Ejemplo de mejora

Aquí está cómo el mejorador de prompts mejora un prompt básico de clasificación:

<section title="Prompt original">

```
De la siguiente lista de títulos de artículos de Wikipedia, identifica de qué artículo provino esta oración.
Responde solo con el título del artículo y nada más.

Títulos de artículos:
{{titles}}

Oración a clasificar:
{{sentence}}
```

</section>

<section title="Prompt mejorado">

```
Eres un sistema inteligente de clasificación de texto especializado en hacer coincidir oraciones con títulos de artículos de Wikipedia. Tu tarea es identificar a qué artículo de Wikipedia pertenece más probablemente una oración dada, basándote en una lista proporcionada de títulos de artículos.

Primero, revisa la siguiente lista de títulos de artículos de Wikipedia:
<article_titles>
{{titles}}
</article_titles>

Ahora, considera esta oración que necesita ser clasificada:
<sentence_to_classify>
{{sentence}}
</sentence_to_classify>

Tu objetivo es determinar qué título de artículo de la lista proporcionada mejor coincide con la oración dada. Sigue estos pasos:

1. Lista los conceptos clave de la oración
2. Compara cada concepto clave con los títulos de los artículos
3. Clasifica los 3 títulos más relevantes y explica por qué son relevantes
4. Selecciona el título de artículo más apropiado que mejor abarque o se relacione con el contenido de la oración

Envuelve tu análisis en etiquetas <analysis>. Incluye lo siguiente:
- Lista de conceptos clave de la oración
- Comparación de cada concepto clave con los títulos de los artículos
- Clasificación de los 3 títulos más relevantes con explicaciones
- Tu elección final y razonamiento

Después de tu análisis, proporciona tu respuesta final: el único título de artículo de Wikipedia más apropiado de la lista.

Produce solo el título del artículo elegido, sin ningún texto adicional o explicación.
```

</section>

Observa cómo el prompt mejorado:
- Añade instrucciones claras de razonamiento paso a paso
- Usa etiquetas XML para organizar el contenido
- Proporciona requisitos explícitos de formato de salida
- Guía a Claude a través del proceso de análisis

## Solución de problemas

Problemas comunes y soluciones:

- **Los ejemplos no aparecen en la salida**: Verifica que los ejemplos estén correctamente formateados con etiquetas XML y aparezcan al inicio del primer mensaje del usuario
- **La cadena de pensamiento es demasiado verbosa**: Añade instrucciones específicas sobre la longitud deseada de la salida y el nivel de detalle
- **Los pasos de razonamiento no coinciden con tus necesidades**: Modifica la sección de pasos para que coincida con tu caso de uso específico

***

## Próximos pasos

<CardGroup cols={3}>
  <Card title="Biblioteca de prompts" icon="link" href="/docs/es/resources/prompt-library/library">
    Inspírate con prompts de ejemplo para varias tareas.
  </Card>
  <Card title="Tutorial de prompting en GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Aprende las mejores prácticas de prompting con nuestro tutorial interactivo.
  </Card>
  <Card title="Prueba tus prompts" icon="link" href="/docs/es/test-and-evaluate/eval-tool">
    Usa nuestra herramienta de evaluación para probar tus prompts mejorados.
  </Card>
</CardGroup>