# Transmisión de herramientas de grano fino

Aprende cómo usar la transmisión de grano fino para parámetros de herramientas en Claude

---

El uso de herramientas ahora admite [transmisión](/docs/es/build-with-claude/streaming) de grano fino para valores de parámetros. Esto permite a los desarrolladores transmitir parámetros de uso de herramientas sin almacenamiento en búfer / validación JSON, reduciendo la latencia para comenzar a recibir parámetros grandes.

La transmisión de herramientas de grano fino está disponible a través de la API de Claude, AWS Bedrock, Google Cloud's Vertex AI y Microsoft Foundry.

<Note>
La transmisión de herramientas de grano fino es una característica beta. Asegúrate de evaluar tus respuestas antes de usarla en producción.

Por favor usa [este formulario](https://forms.gle/D4Fjr7GvQRzfTZT96) para proporcionar comentarios sobre la calidad de las respuestas del modelo, la API en sí, o la calidad de la documentación—¡no podemos esperar a escuchar de ti!
</Note>

<Warning>
Al usar la transmisión de herramientas de grano fino, es posible que recibas entradas JSON inválidas o parciales. Asegúrate de tener en cuenta estos casos extremos en tu código.
</Warning>

## Cómo usar la transmisión de herramientas de grano fino

Para usar esta característica beta, simplemente agrega el encabezado beta `fine-grained-tool-streaming-2025-05-14` a una solicitud de uso de herramientas y activa la transmisión.

Aquí hay un ejemplo de cómo usar la transmisión de herramientas de grano fino con la API:

<CodeGroup>

  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: fine-grained-tool-streaming-2025-05-14" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 65536,
      "tools": [
        {
          "name": "make_file",
          "description": "Write text to a file",
          "input_schema": {
            "type": "object",
            "properties": {
              "filename": {
                "type": "string",
                "description": "The filename to write text to"
              },
              "lines_of_text": {
                "type": "array",
                "description": "An array of lines of text to write to the file"
              }
            },
            "required": ["filename", "lines_of_text"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Can you write a long poem and make a file called poem.txt?"
        }
      ],
      "stream": true
    }' | jq '.usage'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.beta.messages.stream(
      max_tokens=65536,
      model="claude-sonnet-4-5",
      tools=[{
        "name": "make_file",
        "description": "Write text to a file",
        "input_schema": {
          "type": "object",
          "properties": {
            "filename": {
              "type": "string",
              "description": "The filename to write text to"
            },
            "lines_of_text": {
              "type": "array",
              "description": "An array of lines of text to write to the file"
            }
          },
          "required": ["filename", "lines_of_text"]
        }
      }],
      messages=[{
        "role": "user",
        "content": "Can you write a long poem and make a file called poem.txt?"
      }],
      betas=["fine-grained-tool-streaming-2025-05-14"]
  )

  print(response.usage)
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.beta.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 65536,
    tools: [{
      "name": "make_file",
      "description": "Write text to a file",
      "input_schema": {
        "type": "object",
        "properties": {
          "filename": {
            "type": "string",
            "description": "The filename to write text to"
          },
          "lines_of_text": {
            "type": "array",
            "description": "An array of lines of text to write to the file"
          }
        },
        "required": ["filename", "lines_of_text"]
      }
    }],
    messages: [{ 
      role: "user", 
      content: "Can you write a long poem and make a file called poem.txt?" 
    }],
    betas: ["fine-grained-tool-streaming-2025-05-14"]
  });

  console.log(message.usage);
  ```
</CodeGroup>

En este ejemplo, la transmisión de herramientas de grano fino permite a Claude transmitir las líneas de un poema largo en la llamada de herramienta `make_file` sin almacenamiento en búfer para validar si el parámetro `lines_of_text` es JSON válido. Esto significa que puedes ver el parámetro transmitirse a medida que llega, sin tener que esperar a que todo el parámetro se almacene en búfer y se valide.

<Note>
Con la transmisión de herramientas de grano fino, los fragmentos de uso de herramientas comienzan a transmitirse más rápido, y a menudo son más largos y contienen menos saltos de palabra. Esto se debe a diferencias en el comportamiento de fragmentación.

Ejemplo:

Sin transmisión de grano fino (retraso de 15s):
```
Chunk 1: '{"'
Chunk 2: 'query": "Ty'
Chunk 3: 'peScri'
Chunk 4: 'pt 5.0 5.1 '
Chunk 5: '5.2 5'
Chunk 6: '.3'
Chunk 8: ' new f'
Chunk 9: 'eatur'
...
```

Con transmisión de grano fino (retraso de 3s):
```
Chunk 1: '{"query": "TypeScript 5.0 5.1 5.2 5.3'
Chunk 2: ' new features comparison'
```
</Note>

<Warning>
Debido a que la transmisión de grano fino envía parámetros sin almacenamiento en búfer o validación JSON, no hay garantía de que la transmisión resultante se complete en una cadena JSON válida.
En particular, si se alcanza la [razón de parada](/docs/es/build-with-claude/handling-stop-reasons) `max_tokens`, la transmisión puede terminar a mitad de un parámetro y puede estar incompleta. Generalmente tendrás que escribir soporte específico para manejar cuando se alcanza `max_tokens`.
</Warning>

## Manejo de JSON inválido en respuestas de herramientas

Al usar la transmisión de herramientas de grano fino, es posible que recibas JSON inválido o incompleto del modelo. Si necesitas pasar este JSON inválido de vuelta al modelo en un bloque de respuesta de error, puedes envolverlo en un objeto JSON para garantizar el manejo adecuado (con una clave razonable). Por ejemplo:

```json
{
  "INVALID_JSON": "<your invalid json string>"
}
```

Este enfoque ayuda al modelo a entender que el contenido es JSON inválido mientras preserva los datos malformados originales para propósitos de depuración.

<Note>
Al envolver JSON inválido, asegúrate de escapar adecuadamente cualquier comilla o carácter especial en la cadena JSON inválida para mantener una estructura JSON válida en el objeto contenedor.
</Note>