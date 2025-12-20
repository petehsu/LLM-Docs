# Herramienta de editor de texto

Claude puede usar una herramienta de editor de texto definida por Anthropic para ver y modificar archivos de texto, ayudándote a depurar, corregir y mejorar tu código u otros documentos de texto.

---

Claude puede usar una herramienta de editor de texto definida por Anthropic para ver y modificar archivos de texto, ayudándote a depurar, corregir y mejorar tu código u otros documentos de texto. Esto permite que Claude interactúe directamente con tus archivos, proporcionando asistencia práctica en lugar de solo sugerir cambios.

## Compatibilidad de modelos

| Modelo | Versión de herramienta |
|-------|--------------|
| Modelos Claude 4.x | `text_editor_20250728` |
| Claude Sonnet 3.7 ([deprecated](/docs/es/about-claude/model-deprecations)) | `text_editor_20250124` |

<Warning>
La herramienta `text_editor_20250728` para modelos Claude 4 no incluye el comando `undo_edit`. Si requieres esta funcionalidad, necesitarás usar Claude Sonnet 3.7 ([deprecated](/docs/es/about-claude/model-deprecations)).
</Warning>

<Warning>
Las versiones antiguas de herramientas no están garantizadas para ser compatibles hacia atrás con modelos más nuevos. Siempre usa la versión de herramienta que corresponda a tu versión de modelo.
</Warning>

## Cuándo usar la herramienta de editor de texto

Algunos ejemplos de cuándo usar la herramienta de editor de texto son:
- **Depuración de código**: Haz que Claude identifique y corrija errores en tu código, desde errores de sintaxis hasta problemas de lógica.
- **Refactorización de código**: Permite que Claude mejore la estructura de tu código, legibilidad y rendimiento a través de ediciones dirigidas.
- **Generación de documentación**: Pide a Claude que agregue docstrings, comentarios o archivos README a tu base de código.
- **Creación de pruebas**: Haz que Claude cree pruebas unitarias para tu código basándose en su comprensión de la implementación.

## Usar la herramienta de editor de texto

<Tabs>
<Tab title="Claude 4">
Proporciona la herramienta de editor de texto (llamada `str_replace_based_edit_tool`) a Claude usando la API de Mensajes.

Opcionalmente puedes especificar un parámetro `max_characters` para controlar el truncamiento al ver archivos grandes.

<Note>
`max_characters` solo es compatible con `text_editor_20250728` y versiones posteriores de la herramienta de editor de texto.
</Note>

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool",
        "max_characters": 10000
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_0)
                .maxTokens(1024)
                .addTool(editorTool)
                .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                .build();

        Message message = client.messages().create(params);
    }
}
```
</CodeGroup>
</Tab>
<Tab title="Claude Sonnet 3.7">
Proporciona la herramienta de editor de texto (llamada `str_replace_editor`) a Claude usando la API de Mensajes:
<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-3-7-sonnet-20250219",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250124",
            "name": "str_replace_editor"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-3-7-sonnet-20250219",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250124",
      name: "str_replace_editor"
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolTextEditor20250124;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolTextEditor20250124 editorTool = ToolTextEditor20250124.builder()
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_3_7_SONNET_LATEST)
                .maxTokens(1024)
                .addTool(editorTool)
                .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                .build();

        Message message = client.messages().create(params);
    }
}
```
</CodeGroup>
</Tab>
</Tabs>

La herramienta de editor de texto se puede usar de la siguiente manera:

<Steps>
  <Step title="Proporciona a Claude la herramienta de editor de texto y un mensaje del usuario">
    - Incluye la herramienta de editor de texto en tu solicitud de API
    - Proporciona un mensaje del usuario que pueda requerir examinar o modificar archivos, como "¿Puedes corregir el error de sintaxis en mi código?"
  </Step>
  <Step title="Claude usa la herramienta para examinar archivos o directorios">
    - Claude evalúa qué necesita examinar y usa el comando `view` para examinar el contenido de archivos o listar el contenido de directorios
    - La respuesta de la API contendrá un bloque de contenido `tool_use` con el comando `view`
  </Step>
  <Step title="Ejecuta el comando view y devuelve los resultados">
    - Extrae la ruta del archivo o directorio de la solicitud de uso de herramienta de Claude
    - Lee el contenido del archivo o lista el contenido del directorio
    - Si se especificó un parámetro `max_characters` en la configuración de la herramienta, trunca el contenido del archivo a esa longitud
    - Devuelve los resultados a Claude continuando la conversación con un nuevo mensaje `user` que contiene un bloque de contenido `tool_result`
  </Step>
  <Step title="Claude usa la herramienta para modificar archivos">
    - Después de examinar el archivo o directorio, Claude puede usar un comando como `str_replace` para hacer cambios o `insert` para agregar texto en un número de línea específico.
    - Si Claude usa el comando `str_replace`, Claude construye una solicitud de uso de herramienta correctamente formateada con el texto antiguo y el texto nuevo para reemplazarlo
  </Step>
  <Step title="Ejecuta la edición y devuelve los resultados">
    - Extrae la ruta del archivo, el texto antiguo y el texto nuevo de la solicitud de uso de herramienta de Claude
    - Realiza el reemplazo de texto en el archivo
    - Devuelve los resultados a Claude
  </Step>
  <Step title="Claude proporciona su análisis y explicación">
    - Después de examinar y posiblemente editar los archivos, Claude proporciona una explicación completa de lo que encontró y qué cambios realizó
  </Step>
</Steps>

### Comandos de la herramienta de editor de texto

La herramienta de editor de texto admite varios comandos para ver y modificar archivos:

#### view

El comando `view` permite a Claude examinar el contenido de un archivo o listar el contenido de un directorio. Puede leer el archivo completo o un rango específico de líneas.

Parámetros:
- `command`: Debe ser "view"
- `path`: La ruta al archivo o directorio a ver
- `view_range` (opcional): Una matriz de dos enteros que especifican los números de línea de inicio y fin a ver. Los números de línea son indexados desde 1, y -1 para la línea final significa leer hasta el final del archivo. Este parámetro solo se aplica al ver archivos, no directorios.

<section title="Ejemplos de comandos view">

```json
// Ejemplo para ver un archivo
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "view",
    "path": "primes.py"
  }
}

// Ejemplo para ver un directorio
{
  "type": "tool_use",
  "id": "toolu_02B19r91rw91mr917835mr9",
  "name": "str_replace_editor",
  "input": {
    "command": "view",
    "path": "src/"
  }
}
```

</section>

#### str_replace

El comando `str_replace` permite a Claude reemplazar una cadena específica en un archivo con una nueva cadena. Esto se usa para hacer ediciones precisas.

Parámetros:
- `command`: Debe ser "str_replace"
- `path`: La ruta al archivo a modificar
- `old_str`: El texto a reemplazar (debe coincidir exactamente, incluyendo espacios en blanco e indentación)
- `new_str`: El nuevo texto a insertar en lugar del texto antiguo

<section title="Ejemplo de comando str_replace">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "str_replace",
    "path": "primes.py",
    "old_str": "for num in range(2, limit + 1)",
    "new_str": "for num in range(2, limit + 1):"
  }
}
```

</section>

#### create

El comando `create` permite a Claude crear un nuevo archivo con contenido especificado.

Parámetros:
- `command`: Debe ser "create"
- `path`: La ruta donde se debe crear el nuevo archivo
- `file_text`: El contenido a escribir en el nuevo archivo

<section title="Ejemplo de comando create">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "create",
    "path": "test_primes.py",
    "file_text": "import unittest\nimport primes\n\nclass TestPrimes(unittest.TestCase):\n    def test_is_prime(self):\n        self.assertTrue(primes.is_prime(2))\n        self.assertTrue(primes.is_prime(3))\n        self.assertFalse(primes.is_prime(4))\n\nif __name__ == '__main__':\n    unittest.main()"
  }
}
```

</section>

#### insert

El comando `insert` permite a Claude insertar texto en una ubicación específica en un archivo.

Parámetros:
- `command`: Debe ser "insert"
- `path`: La ruta al archivo a modificar
- `insert_line`: El número de línea después del cual insertar el texto (0 para el inicio del archivo)
- `new_str`: El texto a insertar

<section title="Ejemplo de comando insert">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "insert",
    "path": "primes.py",
    "insert_line": 0,
    "new_str": "\"\"\"Module for working with prime numbers.\n\nThis module provides functions to check if a number is prime\nand to generate a list of prime numbers up to a given limit.\n\"\"\"\n"
  }
}
```

</section>

#### undo_edit

El comando `undo_edit` permite a Claude revertir la última edición realizada en un archivo.

<Note>
Este comando solo está disponible en Claude Sonnet 3.7 ([deprecated](/docs/es/about-claude/model-deprecations)). No es compatible con modelos Claude 4 que usan `text_editor_20250728`.
</Note>

Parámetros:
- `command`: Debe ser "undo_edit"
- `path`: La ruta al archivo cuya última edición debe deshacerse

<section title="Ejemplo de comando undo_edit">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "undo_edit",
    "path": "primes.py"
  }
}
```

</section>

### Ejemplo: Corregir un error de sintaxis con la herramienta de editor de texto

<Tabs>
<Tab title="Claude 4">

Este ejemplo demuestra cómo los modelos Claude 4 usan la herramienta de editor de texto para corregir un error de sintaxis en un archivo Python.

Primero, tu aplicación proporciona a Claude la herramienta de editor de texto y un mensaje para corregir un error de sintaxis:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool"
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_0)
                .maxTokens(1024)
                .addTool(editorTool)
                .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                .build();

        Message message = client.messages().create(params);
    }
}
```
</CodeGroup>

Claude usará la herramienta de editor de texto primero para ver el archivo:

```json
{
  "id": "msg_01XAbCDeFgHiJkLmNoPQrStU",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
    },
    {
      "type": "tool_use",
      "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
      "name": "str_replace_based_edit_tool",
      "input": {
        "command": "view",
        "path": "primes.py"
      }
    }
  ]
}
```

Tu aplicación debe entonces leer el archivo y devolver su contenido a Claude:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      },
      {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I'\''ll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
                },
                {
                    "type": "tool_use",
                    "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "name": "str_replace_based_edit_tool",
                    "input": {
                        "command": "view",
                        "path": "primes.py"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "content": "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
                }
            ]
        }
    ]
  }'
```

```python Python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
                },
                {
                    "type": "tool_use",
                    "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "name": "str_replace_based_edit_tool",
                    "input": {
                        "command": "view",
                        "path": "primes.py"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "content": "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
                }
            ]
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool"
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    },
    {
      role: "assistant",
      content: [
          {
              type: "text",
              text: "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
          },
          {
              type: "tool_use",
              id: "toolu_01AbCdEfGhIjKlMnOpQrStU",
              name: "str_replace_based_edit_tool",
              input: {
                  command: "view",
                  path: "primes.py"
              }
          }
      ]
    },
    {
      role: "user",
      content: [
          {
              type: "tool_result",
              tool_use_id: "toolu_01AbCdEfGhIjKlMnOpQrStU",
              content: "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
          }
      ]
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
            .build();

        MessageCreateParams params = MessageCreateParams.builder()
            .model(Model.CLAUDE_SONNET_4_0)
            .maxTokens(1024)
            .addTool(editorTool)
            .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
            .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

<Tip>
**Números de línea**

En el ejemplo anterior, el resultado de la herramienta `view` incluye el contenido del archivo con números de línea antepuestos a cada línea (por ejemplo, "1: def is_prime(n):"). Los números de línea no son obligatorios, pero son esenciales para usar exitosamente el parámetro `view_range` para examinar secciones específicas de archivos y el parámetro `insert_line` para agregar contenido en ubicaciones precisas.
</Tip>

Claude identificará el error de sintaxis y usará el comando `str_replace` para corregirlo:

```json
{
  "id": "msg_01VwXyZAbCdEfGhIjKlMnO",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
    },
    {
      "type": "tool_use",
      "id": "toolu_01PqRsTuVwXyZAbCdEfGh",
      "name": "str_replace_based_edit_tool",
      "input": {
        "command": "str_replace",
        "path": "primes.py",
        "old_str": "    for num in range(2, limit + 1)",
        "new_str": "    for num in range(2, limit + 1):"
      }
    }
  ]
}
```

Tu aplicación debe entonces hacer la edición y devolver el resultado:

<CodeGroup>
```python Python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool"
        }
    ],
    messages=[
        # Previous messages...
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
                },
                {
                    "type": "tool_use",
                    "id": "toolu_01PqRsTuVwXyZAbCdEfGh",
                    "name": "str_replace_based_edit_tool",
                    "input": {
                        "command": "str_replace",
                        "path": "primes.py",
                        "old_str": "    for num in range(2, limit + 1)",
                        "new_str": "    for num in range(2, limit + 1):"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_01PqRsTuVwXyZAbCdEfGh",
                    "content": "Successfully replaced text at exactly one location."
                }
            ]
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool"
    }
  ],
  messages: [
    // Previous messages...
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
        },
        {
          type: "tool_use",
          id: "toolu_01PqRsTuVwXyZAbCdEfGh",
          name: "str_replace_based_edit_tool",
          input: {
            command: "str_replace",
            path: "primes.py",
            old_str: "    for num in range(2, limit + 1)",
            new_str: "    for num in range(2, limit + 1):"
          }
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: "toolu_01PqRsTuVwXyZAbCdEfGh",
          content: "Successfully replaced text at exactly one location."
        }
      ]
    }
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.MessageParam;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;
import com.anthropic.models.messages.ToolUseBlockParam;

public class TextEditorConversationExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_0)
                .maxTokens(1024)
                .addTool(ToolStrReplaceBasedEditTool20250728.builder()
                        .build())
                // Previous messages would go here
                .addAssistantMessageOfBlockParams(
                        List.of(
                                ContentBlockParam.ofText(TextBlockParam.builder()
                                        .text("I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you.")
                                        .build()),
                                ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                        .id("toolu_01PqRsTuVwXyZAbCdEfGh")
                                        .name("str_replace_based_edit_tool")
                                        .input(JsonValue.from(Map.of(
                                                "command", "str_replace",
                                                "path", "primes.py",
                                                "old_str", "    for num in range(2, limit + 1)",
                                                "new_str", "    for num in range(2, limit + 1):"
                                        )))
                                        .build()
                                )
                        )
                )
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                .toolUseId("toolu_01PqRsTuVwXyZAbCdEfGh")
                                .content("Successfully replaced text at exactly one location.")
                                .build()
                        )
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

Finalmente, Claude proporcionará una explicación completa de la corrección:

```json
{
  "id": "msg_01IjKlMnOpQrStUvWxYzAb",
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I've fixed the syntax error in your primes.py file. The issue was in the `get_primes` function at line 19. There was a missing colon (:) at the end of the for loop line.\n\nHere's what I changed:\n\nFrom:\n```python\nfor num in range(2, limit + 1)\n```\n\nTo:\n```python\nfor num in range(2, limit + 1):\n```\n\nIn Python, a colon is required at the end of statements that start a new code block, such as for loops, if statements, function definitions, etc. Without the colon, Python raises a syntax error because it doesn't know where the code block begins.\n\nYour code should now run correctly. The function will properly generate a list of prime numbers up to the specified limit."
    }
  ]
}
```
</Tab>

<Tab title="Claude Sonnet 3.7">
Este ejemplo demuestra cómo Claude Sonnet 3.7 usa la herramienta de editor de texto para corregir un error de sintaxis en un archivo Python.

Primero, tu aplicación proporciona a Claude la herramienta de editor de texto y un mensaje para corregir un error de sintaxis:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250124",
            "name": "str_replace_editor"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)

print(response)
```

<Note>
Los ejemplos de Claude Sonnet 3.7 siguen el mismo formato que los ejemplos de Claude 4 anteriores, usando las mismas llamadas de herramienta y respuestas pero con el tipo de herramienta `text_editor_20250124` y el nombre `str_replace_editor`.
</Note>
</Tab>
</Tabs>

***

## Implementar la herramienta del editor de texto

La herramienta del editor de texto se implementa como una herramienta sin esquema. Cuando usas esta herramienta, no necesitas proporcionar un esquema de entrada como con otras herramientas; el esquema está integrado en el modelo de Claude y no se puede modificar.

El tipo de herramienta depende de la versión del modelo:
- **Claude 4**: `type: "text_editor_20250728"`
- **Claude Sonnet 3.7**: `type: "text_editor_20250124"`

<Steps>
  <Step title="Inicializar tu implementación del editor">
    Crea funciones auxiliares para manejar operaciones de archivos como lectura, escritura y modificación de archivos. Considera implementar funcionalidad de copia de seguridad para recuperarte de errores.
  </Step>
  <Step title="Manejar llamadas de herramientas del editor">
    Crea una función que procese llamadas de herramientas de Claude basadas en el tipo de comando:
    ```python
    def handle_editor_tool(tool_call, model_version):
        input_params = tool_call.input
        command = input_params.get('command', '')
        file_path = input_params.get('path', '')
        
        if command == 'view':
            # Read and return file contents
            pass
        elif command == 'str_replace':
            # Replace text in file
            pass
        elif command == 'create':
            # Create new file
            pass
        elif command == 'insert':
            # Insert text at location
            pass
        elif command == 'undo_edit':
            # Check if it's a Claude 4 model
            if 'str_replace_based_edit_tool' in model_version:
                return {"error": "undo_edit command is not supported in Claude 4"}
            # Restore from backup for Claude 3.7
            pass
    ```
  </Step>
  <Step title="Implementar medidas de seguridad">
    Añade validación y controles de seguridad:
    - Valida rutas de archivos para prevenir traversal de directorios
    - Crea copias de seguridad antes de hacer cambios
    - Maneja errores correctamente
    - Implementa controles de permisos
  </Step>
  <Step title="Procesar respuestas de Claude">
    Extrae y maneja llamadas de herramientas de las respuestas de Claude:
    ```python
    # Process tool use in Claude's response
    for content in response.content:
        if content.type == "tool_use":
            # Execute the tool based on command
            result = handle_editor_tool(content)
            
            # Return result to Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
</Steps>

<Warning>
Cuando implementes la herramienta del editor de texto, ten en cuenta:

1. **Seguridad**: La herramienta tiene acceso a tu sistema de archivos local, así que implementa medidas de seguridad adecuadas.
2. **Copia de seguridad**: Siempre crea copias de seguridad antes de permitir ediciones en archivos importantes.
3. **Validación**: Valida todas las entradas para prevenir cambios no intencionados.
4. **Coincidencia única**: Asegúrate de que los reemplazos coincidan exactamente en una ubicación para evitar ediciones no intencionadas.
</Warning>

### Manejar errores

Cuando usas la herramienta del editor de texto, pueden ocurrir varios errores. Aquí hay orientación sobre cómo manejarlos:

<section title="Archivo no encontrado">

Si Claude intenta ver o modificar un archivo que no existe, devuelve un mensaje de error apropiado en `tool_result`:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: File not found",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Múltiples coincidencias para reemplazo">

Si el comando `str_replace` de Claude coincide con múltiples ubicaciones en el archivo, devuelve un mensaje de error apropiado:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Found 3 matches for replacement text. Please provide more context to make a unique match.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Sin coincidencias para reemplazo">

Si el comando `str_replace` de Claude no coincide con ningún texto en el archivo, devuelve un mensaje de error apropiado:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: No match found for replacement. Please check your text and try again.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Errores de permisos">

Si hay problemas de permisos al crear, leer o modificar archivos, devuelve un mensaje de error apropiado:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Permission denied. Cannot write to file.",
      "is_error": true
    }
  ]
}
```

</section>

### Seguir las mejores prácticas de implementación

<section title="Proporcionar contexto claro">

Cuando pidas a Claude que corrija o modifique código, sé específico sobre qué archivos necesitan ser examinados o qué problemas necesitan ser abordados. El contexto claro ayuda a Claude a identificar los archivos correctos y hacer cambios apropiados.

**Indicación menos útil**: "¿Puedes arreglar mi código?"

**Indicación mejor**: "Hay un error de sintaxis en mi archivo primes.py que impide que se ejecute. ¿Puedes arreglarlo?"

</section>

<section title="Ser explícito sobre rutas de archivos">

Especifica rutas de archivos claramente cuando sea necesario, especialmente si estás trabajando con múltiples archivos o archivos en diferentes directorios.

**Indicación menos útil**: "Revisa mi archivo auxiliar"

**Indicación mejor**: "¿Puedes revisar mi archivo utils/helpers.py para detectar problemas de rendimiento?"

</section>

<section title="Crear copias de seguridad antes de editar">

Implementa un sistema de copia de seguridad en tu aplicación que cree copias de archivos antes de permitir que Claude los edite, especialmente para código importante o de producción.

```python
def backup_file(file_path):
    """Create a backup of a file before editing."""
    backup_path = f"{file_path}.backup"
    if os.path.exists(file_path):
        with open(file_path, 'r') as src, open(backup_path, 'w') as dst:
            dst.write(src.read())
```

</section>

<section title="Manejar el reemplazo de texto único cuidadosamente">

El comando `str_replace` requiere una coincidencia exacta para el texto a ser reemplazado. Tu aplicación debe asegurar que haya exactamente una coincidencia para el texto antiguo o proporcionar mensajes de error apropiados.
```python
def safe_replace(file_path, old_text, new_text):
    """Replace text only if there's exactly one match."""
    with open(file_path, 'r') as f:
        content = f.read()
    
    count = content.count(old_text)
    if count == 0:
        return "Error: No match found"
    elif count > 1:
        return f"Error: Found {count} matches"
    else:
        new_content = content.replace(old_text, new_text)
        with open(file_path, 'w') as f:
            f.write(new_content)
        return "Successfully replaced text"
```

</section>

<section title="Verificar cambios">

Después de que Claude haga cambios en un archivo, verifica los cambios ejecutando pruebas o comprobando que el código siga funcionando como se esperaba.
```python
def verify_changes(file_path):
    """Run tests or checks after making changes."""
    try:
        # For Python files, check for syntax errors
        if file_path.endswith('.py'):
            import ast
            with open(file_path, 'r') as f:
                ast.parse(f.read())
            return "Syntax check passed"
    except Exception as e:
        return f"Verification failed: {str(e)}"
```

</section>

---

## Precios y uso de tokens

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

Para obtener información más detallada sobre precios de herramientas, consulta [Precios de uso de herramientas](/docs/es/agents-and-tools/tool-use/overview#pricing).

## Integrar la herramienta del editor de texto con otras herramientas

La herramienta del editor de texto se puede usar junto con otras herramientas de Claude. Cuando combines herramientas, asegúrate de:
- Coincidir la versión de la herramienta con el modelo que estés usando
- Contabilizar el uso de tokens adicional para todas las herramientas incluidas en tu solicitud

## Registro de cambios

| Fecha | Versión | Cambios |
| ---- | ------- | ------- |
| 28 de julio de 2025 | `text_editor_20250728` | Lanzamiento de una herramienta de editor de texto actualizada que corrige algunos problemas y añade un parámetro `max_characters` opcional. Es idéntica a `text_editor_20250429` de otra manera. |
| 29 de abril de 2025 | `text_editor_20250429` | Lanzamiento de la herramienta de editor de texto para Claude 4. Esta versión elimina el comando `undo_edit` pero mantiene todas las otras capacidades. El nombre de la herramienta ha sido actualizado para reflejar su arquitectura basada en str_replace. |
| 13 de marzo de 2025 | `text_editor_20250124` | Introducción de documentación de herramienta de editor de texto independiente. Esta versión está optimizada para Claude Sonnet 3.7 pero tiene capacidades idénticas a la versión anterior. |
| 22 de octubre de 2024 | `text_editor_20241022` | Lanzamiento inicial de la herramienta de editor de texto con Claude Sonnet 3.5 ([retirado](/docs/es/about-claude/model-deprecations)). Proporciona capacidades para ver, crear y editar archivos a través de los comandos `view`, `create`, `str_replace`, `insert` y `undo_edit`. |

## Próximos pasos

Aquí hay algunas ideas sobre cómo usar la herramienta del editor de texto de formas más convenientes y poderosas:

- **Integrar con tu flujo de trabajo de desarrollo**: Construye la herramienta del editor de texto en tus herramientas de desarrollo o IDE
- **Crear un sistema de revisión de código**: Haz que Claude revise tu código y haga mejoras
- **Construir un asistente de depuración**: Crea un sistema donde Claude pueda ayudarte a diagnosticar y arreglar problemas en tu código
- **Implementar conversión de formato de archivo**: Deja que Claude te ayude a convertir archivos de un formato a otro
- **Automatizar documentación**: Configura flujos de trabajo para que Claude documente automáticamente tu código

A medida que construyas aplicaciones con la herramienta del editor de texto, estamos emocionados de ver cómo aprovechas las capacidades de Claude para mejorar tu flujo de trabajo de desarrollo y productividad.

<CardGroup cols={3}>
  <Card
    title="Descripción general del uso de herramientas"
    icon="wrench"
    href="/docs/es/agents-and-tools/tool-use/overview"
  >
    Aprende cómo implementar flujos de trabajo de herramientas para usar con Claude.
  </Card>

  <Card
    title="Herramienta Bash"
    icon="terminal"
    href="/docs/es/agents-and-tools/tool-use/bash-tool"
  >
    Ejecuta comandos de shell con Claude.
  </Card>
</CardGroup>