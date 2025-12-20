# Usar plantillas de prompts y variables

---

Al implementar una aplicación basada en LLM con Claude, tus llamadas a la API típicamente consistirán en dos tipos de contenido:
- **Contenido fijo:** Instrucciones estáticas o contexto que permanecen constantes a través de múltiples interacciones
- **Contenido variable:** Elementos dinámicos que cambian con cada solicitud o conversación, tales como:
    - Entradas del usuario
    - Contenido recuperado para Generación Aumentada por Recuperación (RAG)
    - Contexto de conversación como el historial de cuenta del usuario
    - Datos generados por el sistema como resultados de uso de herramientas alimentados desde otras llamadas independientes a Claude

Una **plantilla de prompt** combina estas partes fijas y variables, usando marcadores de posición para el contenido dinámico. En la [Consola de Claude](/), estos marcadores de posición se denotan con **\{\{corchetes dobles\}\}**, haciéndolos fácilmente identificables y permitiendo pruebas rápidas de diferentes valores.

---

# Cuándo usar plantillas de prompts y variables
Siempre debes usar plantillas de prompts y variables cuando esperes que cualquier parte de tu prompt se repita en otra llamada a Claude (solo a través de la API o la [Consola de Claude](/). [claude.ai](https://claude.ai/) actualmente no soporta plantillas de prompts o variables).

Las plantillas de prompts ofrecen varios beneficios:
- **Consistencia:** Asegurar una estructura consistente para tus prompts a través de múltiples interacciones
- **Eficiencia:** Intercambiar fácilmente contenido variable sin reescribir todo el prompt
- **Capacidad de prueba:** Probar rápidamente diferentes entradas y casos extremos cambiando solo la porción variable
- **Escalabilidad:** Simplificar la gestión de prompts a medida que tu aplicación crece en complejidad
- **Control de versiones:** Rastrear fácilmente cambios en la estructura de tu prompt a lo largo del tiempo manteniendo pestañas solo en la parte central de tu prompt, separada de las entradas dinámicas

La [Consola de Claude](/) usa intensivamente plantillas de prompts y variables para soportar características y herramientas para todo lo anterior, como con el:
- **[Generador de prompts](/docs/es/build-with-claude/prompt-engineering/prompt-generator):** Decide qué variables necesita tu prompt y las incluye en la plantilla que produce
- **[Mejorador de prompts](/docs/es/build-with-claude/prompt-engineering/prompt-improver):** Toma tu plantilla existente, incluyendo todas las variables, y las mantiene en la plantilla mejorada que produce
- **[Herramienta de evaluación](/docs/es/test-and-evaluate/eval-tool):** Te permite probar, escalar y rastrear versiones de tus prompts fácilmente separando las porciones variables y fijas de tu plantilla de prompt

---

# Ejemplo de plantilla de prompt

Consideremos una aplicación simple que traduce texto en inglés al español. El texto traducido sería variable ya que esperarías que este texto cambie entre usuarios o llamadas a Claude. Este texto traducido podría ser recuperado dinámicamente de bases de datos o de la entrada del usuario.

Así, para tu aplicación de traducción, podrías usar esta plantilla de prompt simple:
```
Traduce este texto del inglés al español: {{text}}
```

---

## Próximos pasos

<CardGroup cols={2}>
  <Card title="Generar un prompt" icon="link" href="/docs/es/build-with-claude/prompt-engineering/prompt-generator">
    Aprende sobre el generador de prompts en la Consola de Claude y prueba tu habilidad para hacer que Claude genere un prompt para ti.
  </Card>
  <Card title="Aplicar etiquetas XML" icon="link" href="/docs/es/build-with-claude/prompt-engineering/use-xml-tags">
    Si quieres mejorar tu juego de variables de prompt, envuélvelas en etiquetas XML.
  </Card>
  <Card title="Consola de Claude" icon="link" href="/">
    Echa un vistazo a la miríada de herramientas de desarrollo de prompts disponibles en la Consola de Claude.
  </Card>
</CardGroup>