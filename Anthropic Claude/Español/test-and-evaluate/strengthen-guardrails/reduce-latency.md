# Reducir la latencia

---

La latencia se refiere al tiempo que tarda el modelo en procesar un prompt y generar una salida. La latencia puede verse influenciada por varios factores, como el tamaño del modelo, la complejidad del prompt y la infraestructura subyacente que respalda el modelo y el punto de interacción.

<Note>
Siempre es mejor primero diseñar un prompt que funcione bien sin restricciones del modelo o del prompt, y luego probar estrategias de reducción de latencia después. Tratar de reducir la latencia prematuramente podría impedirte descubrir cómo se ve el máximo rendimiento.
</Note>

---

## Cómo medir la latencia

Al discutir la latencia, puedes encontrarte con varios términos y mediciones:

- **Latencia base**: Este es el tiempo que tarda el modelo en procesar el prompt y generar la respuesta, sin considerar los tokens de entrada y salida por segundo. Proporciona una idea general de la velocidad del modelo.
- **Tiempo hasta el primer token (TTFT)**: Esta métrica mide el tiempo que tarda el modelo en generar el primer token de la respuesta, desde cuando se envió el prompt. Es particularmente relevante cuando estás usando streaming (más sobre eso después) y quieres proporcionar una experiencia receptiva a tus usuarios.

Para una comprensión más profunda de estos términos, consulta nuestro [glosario](/docs/es/about-claude/glossary).

---

## Cómo reducir la latencia

### 1. Elegir el modelo correcto

Una de las formas más directas de reducir la latencia es seleccionar el modelo apropiado para tu caso de uso. Anthropic ofrece una [gama de modelos](/docs/es/about-claude/models/overview) con diferentes capacidades y características de rendimiento. Considera tus requisitos específicos y elige el modelo que mejor se adapte a tus necesidades en términos de velocidad y calidad de salida.

Para aplicaciones críticas en velocidad, **Claude Haiku 4.5** ofrece los tiempos de respuesta más rápidos mientras mantiene alta inteligencia:

```python
import anthropic

client = anthropic.Anthropic()

# Para aplicaciones sensibles al tiempo, usa Claude Haiku 4.5
message = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=100,
    messages=[{
        "role": "user",
        "content": "Summarize this customer feedback in 2 sentences: [feedback text]"
    }]
)
```

Para más detalles sobre las métricas de modelos, consulta nuestra página de [resumen de modelos](/docs/es/about-claude/models/overview).

### 2. Optimizar la longitud del prompt y la salida

Minimiza el número de tokens tanto en tu prompt de entrada como en la salida esperada, mientras mantienes un alto rendimiento. Cuantos menos tokens tenga que procesar y generar el modelo, más rápida será la respuesta.

Aquí tienes algunos consejos para ayudarte a optimizar tus prompts y salidas:

- **Sé claro pero conciso**: Apunta a transmitir tu intención de manera clara y concisa en el prompt. Evita detalles innecesarios o información redundante, mientras tienes en cuenta que [claude carece de contexto](/docs/es/build-with-claude/prompt-engineering/be-clear-and-direct) sobre tu caso de uso y puede no hacer los saltos de lógica previstos si las instrucciones no son claras.
- **Pide respuestas más cortas**: Pide a Claude directamente que sea conciso. La familia de modelos Claude 3 ha mejorado la capacidad de dirección sobre generaciones anteriores. Si Claude está generando una longitud no deseada, pide a Claude que [controle su locuacidad](/docs/es/build-with-claude/prompt-engineering/be-clear-and-direct).
  <Tip> Debido a cómo los LLMs cuentan [tokens](/docs/es/about-claude/glossary#tokens) en lugar de palabras, pedir un conteo exacto de palabras o un límite de conteo de palabras no es una estrategia tan efectiva como pedir límites de conteo de párrafos o oraciones.</Tip>
- **Establece límites de salida apropiados**: Usa el parámetro `max_tokens` para establecer un límite estricto en la longitud máxima de la respuesta generada. Esto evita que Claude genere salidas excesivamente largas.
  > **Nota**: Cuando la respuesta alcanza `max_tokens` tokens, la respuesta será cortada, quizás a mitad de oración o a mitad de palabra, por lo que esta es una técnica contundente que puede requerir post-procesamiento y generalmente es más apropiada para respuestas de opción múltiple o respuestas cortas donde la respuesta viene justo al principio.
- **Experimenta con la temperatura**: El [parámetro](/docs/es/api/messages) `temperature` controla la aleatoriedad de la salida. Valores más bajos (por ejemplo, 0.2) a veces pueden llevar a respuestas más enfocadas y más cortas, mientras que valores más altos (por ejemplo, 0.8) pueden resultar en salidas más diversas pero potencialmente más largas.

Encontrar el equilibrio correcto entre claridad del prompt, calidad de salida y conteo de tokens puede requerir algo de experimentación.

### 3. Aprovechar el streaming

El streaming es una característica que permite al modelo comenzar a enviar de vuelta su respuesta antes de que la salida completa esté terminada. Esto puede mejorar significativamente la capacidad de respuesta percibida de tu aplicación, ya que los usuarios pueden ver la salida del modelo en tiempo real.

Con el streaming habilitado, puedes procesar la salida del modelo a medida que llega, actualizando tu interfaz de usuario o realizando otras tareas en paralelo. Esto puede mejorar enormemente la experiencia del usuario y hacer que tu aplicación se sienta más interactiva y receptiva.

Visita [streaming Messages](/docs/es/build-with-claude/streaming) para aprender sobre cómo puedes implementar streaming para tu caso de uso.