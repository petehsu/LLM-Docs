# Usando la Herramienta de Evaluación

La [Consola de Claude](/dashboard) cuenta con una **herramienta de Evaluación** que te permite probar tus prompts bajo varios escenarios.

---

## Accediendo a la Función de Evaluación

Para comenzar con la herramienta de Evaluación:

1. Abre la Consola de Claude y navega al editor de prompts.
2. Después de componer tu prompt, busca la pestaña 'Evaluate' en la parte superior de la pantalla.

![Accediendo a la Función de Evaluación](/docs/images/access_evaluate.png)

<Tip>
Asegúrate de que tu prompt incluya al menos 1-2 variables dinámicas usando la sintaxis de llaves dobles: \{\{variable\}\}. Esto es requerido para crear conjuntos de prueba de evaluación.
</Tip>

## Generando Prompts

La Consola ofrece un [generador de prompts](/docs/es/build-with-claude/prompt-engineering/prompt-generator) integrado impulsado por Claude Opus 4.1:

<Steps>
  <Step title="Haz clic en 'Generate Prompt'">
    Hacer clic en la herramienta auxiliar 'Generate Prompt' abrirá un modal que te permite ingresar la información de tu tarea.
  </Step>
  <Step title="Describe tu tarea">
    Describe tu tarea deseada (por ejemplo, "Clasificar solicitudes de soporte al cliente entrantes") con tanto o tan poco detalle como desees. Mientras más contexto incluyas, más puede Claude adaptar su prompt generado a tus necesidades específicas.
  </Step>
  <Step title="Genera tu prompt">
    Hacer clic en el botón naranja 'Generate Prompt' en la parte inferior hará que Claude genere un prompt de alta calidad para ti. Luego puedes mejorar aún más esos prompts usando la pantalla de Evaluación en la Consola.
  </Step>
</Steps>

Esta función hace más fácil crear prompts con la sintaxis de variables apropiada para la evaluación.

![Generador de Prompts](/docs/images/promptgenerator.png)

## Creando Casos de Prueba

Cuando accedes a la pantalla de Evaluación, tienes varias opciones para crear casos de prueba:

1. Haz clic en el botón '+ Add Row' en la parte inferior izquierda para agregar manualmente un caso.
2. Usa la función 'Generate Test Case' para que Claude genere automáticamente casos de prueba para ti.
3. Importa casos de prueba desde un archivo CSV.

Para usar la función 'Generate Test Case':

<Steps>
  <Step title="Haz clic en 'Generate Test Case'">
    Claude generará casos de prueba para ti, una fila a la vez por cada vez que hagas clic en el botón.
  </Step>
  <Step title="Edita la lógica de generación (opcional)">
    También puedes editar la lógica de generación de casos de prueba haciendo clic en la flecha desplegable a la derecha del botón 'Generate Test Case', luego en 'Show generation logic' en la parte superior de la ventana de Variables que aparece. Es posible que tengas que hacer clic en `Generate' en la parte superior derecha de esta ventana para poblar la lógica de generación inicial.
    
    Editar esto te permite personalizar y ajustar finamente los casos de prueba que Claude genera con mayor precisión y especificidad.
  </Step>
</Steps>

Aquí hay un ejemplo de una pantalla de Evaluación poblada con varios casos de prueba:

![Pantalla de Evaluación Poblada](/docs/images/eval_populated.png)

<Note>
Si actualizas tu texto de prompt original, puedes volver a ejecutar toda la suite de evaluación contra el nuevo prompt para ver cómo los cambios afectan el rendimiento en todos los casos de prueba.
</Note>

## Consejos para una Evaluación Efectiva

<section title="Estructura de Prompt para Evaluación">

Para aprovechar al máximo la herramienta de Evaluación, estructura tus prompts con formatos claros de entrada y salida. Por ejemplo:

```
En esta tarea, generarás una historia linda de una oración que incorpore dos elementos: un color y un sonido.
El color a incluir en la historia es:
<color>
{{COLOR}}
</color>
El sonido a incluir en la historia es:
<sound>
{{SOUND}}
</sound>
Aquí están los pasos para generar la historia:
1. Piensa en un objeto, animal o escena que esté comúnmente asociado con el color proporcionado. Por ejemplo, si el color es "azul", podrías pensar en el cielo, el océano o un pájaro azul.
2. Imagina una acción simple, evento o escena que involucre el objeto/animal/escena coloreado que identificaste y el sonido proporcionado. Por ejemplo, si el color es "azul" y el sonido es "silbido", podrías imaginar un pájaro azul silbando una melodía.
3. Describe la acción, evento o escena que imaginaste en una sola oración concisa. Enfócate en hacer la oración linda, evocativa e imaginativa. Por ejemplo: "Un alegre pájaro azul silbó una melodía alegre mientras se elevaba por el cielo azul."
Por favor mantén tu historia en solo una oración. Apunta a hacer esa oración tan encantadora y atractiva como sea posible mientras incorporas naturalmente el color y sonido dados.
Escribe tu historia completa de una oración dentro de etiquetas <story>.

```

Esta estructura hace fácil variar las entradas (\{\{COLOR\}\} y \{\{SOUND\}\}) y evaluar las salidas consistentemente.

</section>

<Tip>
Usa la herramienta auxiliar 'Generate a prompt' en la Consola para crear rápidamente prompts con la sintaxis de variables apropiada para la evaluación.
</Tip>

## Entendiendo y comparando resultados

La herramienta de Evaluación ofrece varias funciones para ayudarte a refinar tus prompts:

1. **Comparación lado a lado**: Compara las salidas de dos o más prompts para ver rápidamente el impacto de tus cambios.
2. **Calificación de calidad**: Califica la calidad de respuesta en una escala de 5 puntos para rastrear mejoras en la calidad de respuesta por prompt.
3. **Versionado de prompts**: Crea nuevas versiones de tu prompt y vuelve a ejecutar la suite de pruebas para iterar rápidamente y mejorar resultados.

Al revisar resultados a través de casos de prueba y comparar diferentes versiones de prompts, puedes detectar patrones y hacer ajustes informados a tu prompt de manera más eficiente.

¡Comienza a evaluar tus prompts hoy para construir aplicaciones de IA más robustas con Claude!