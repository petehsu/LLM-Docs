# Ferramenta de editor de texto

Claude pode usar uma ferramenta de editor de texto definida pela Anthropic para visualizar e modificar arquivos de texto, ajudando você a depurar, corrigir e melhorar seu código ou outros documentos de texto.

---

Claude pode usar uma ferramenta de editor de texto definida pela Anthropic para visualizar e modificar arquivos de texto, ajudando você a depurar, corrigir e melhorar seu código ou outros documentos de texto. Isso permite que Claude interaja diretamente com seus arquivos, fornecendo assistência prática em vez de apenas sugerir mudanças.

## Compatibilidade de modelos

| Modelo | Versão da Ferramenta |
|-------|--------------|
| Modelos Claude 4.x | `text_editor_20250728` |
| Claude Sonnet 3.7 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations)) | `text_editor_20250124` |

<Warning>
A ferramenta `text_editor_20250728` para modelos Claude 4 não inclui o comando `undo_edit`. Se você precisar dessa funcionalidade, será necessário usar Claude Sonnet 3.7 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations)).
</Warning>

<Warning>
Versões mais antigas da ferramenta não têm garantia de compatibilidade com versões mais recentes dos modelos. Sempre use a versão da ferramenta que corresponde à versão do seu modelo.
</Warning>

## Quando usar a ferramenta de editor de texto

Alguns exemplos de quando usar a ferramenta de editor de texto são:
- **Depuração de código**: Peça ao Claude para identificar e corrigir bugs em seu código, desde erros de sintaxe até problemas de lógica.
- **Refatoração de código**: Deixe Claude melhorar a estrutura, legibilidade e desempenho do seu código através de edições direcionadas.
- **Geração de documentação**: Peça ao Claude para adicionar docstrings, comentários ou arquivos README ao seu código.
- **Criação de testes**: Peça ao Claude para criar testes unitários para seu código com base em sua compreensão da implementação.

## Use a ferramenta de editor de texto

<Tabs>
<Tab title="Claude 4">
Forneça a ferramenta de editor de texto (nomeada `str_replace_based_edit_tool`) ao Claude usando a API de Mensagens.

Você pode opcionalmente especificar um parâmetro `max_characters` para controlar o truncamento ao visualizar arquivos grandes.

<Note>
`max_characters` é compatível apenas com `text_editor_20250728` e versões posteriores da ferramenta de editor de texto.
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
Forneça a ferramenta de editor de texto (nomeada `str_replace_editor`) ao Claude usando a API de Mensagens:
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

A ferramenta de editor de texto pode ser usada da seguinte forma:

<Steps>
  <Step title="Forneça ao Claude a ferramenta de editor de texto e um prompt do usuário">
    - Inclua a ferramenta de editor de texto em sua solicitação de API
    - Forneça um prompt do usuário que pode exigir examinar ou modificar arquivos, como "Você pode corrigir o erro de sintaxe no meu código?"
  </Step>
  <Step title="Claude usa a ferramenta para examinar arquivos ou diretórios">
    - Claude avalia o que precisa examinar e usa o comando `view` para examinar o conteúdo do arquivo ou listar o conteúdo do diretório
    - A resposta da API conterá um bloco de conteúdo `tool_use` com o comando `view`
  </Step>
  <Step title="Execute o comando view e retorne os resultados">
    - Extraia o caminho do arquivo ou diretório da solicitação de uso de ferramenta do Claude
    - Leia o conteúdo do arquivo ou liste o conteúdo do diretório
    - Se um parâmetro `max_characters` foi especificado na configuração da ferramenta, truncue o conteúdo do arquivo para esse comprimento
    - Retorne os resultados ao Claude continuando a conversa com uma nova mensagem `user` contendo um bloco de conteúdo `tool_result`
  </Step>
  <Step title="Claude usa a ferramenta para modificar arquivos">
    - Após examinar o arquivo ou diretório, Claude pode usar um comando como `str_replace` para fazer alterações ou `insert` para adicionar texto em um número de linha específico.
    - Se Claude usar o comando `str_replace`, Claude constrói uma solicitação de uso de ferramenta adequadamente formatada com o texto antigo e o novo texto para substituí-lo
  </Step>
  <Step title="Execute a edição e retorne os resultados">
    - Extraia o caminho do arquivo, o texto antigo e o novo texto da solicitação de uso de ferramenta do Claude
    - Execute a substituição de texto no arquivo
    - Retorne os resultados ao Claude
  </Step>
  <Step title="Claude fornece sua análise e explicação">
    - Após examinar e possivelmente editar os arquivos, Claude fornece uma explicação completa do que encontrou e quais alterações fez
  </Step>
</Steps>

### Comandos da ferramenta de editor de texto

A ferramenta de editor de texto suporta vários comandos para visualizar e modificar arquivos:

#### view

O comando `view` permite que Claude examine o conteúdo de um arquivo ou liste o conteúdo de um diretório. Ele pode ler o arquivo inteiro ou um intervalo específico de linhas.

Parâmetros:
- `command`: Deve ser "view"
- `path`: O caminho para o arquivo ou diretório a visualizar
- `view_range` (opcional): Uma matriz de dois inteiros especificando os números de linha inicial e final a visualizar. Os números de linha são indexados a partir de 1, e -1 para a linha final significa ler até o final do arquivo. Este parâmetro se aplica apenas ao visualizar arquivos, não diretórios.

<section title="Exemplos de comandos view">

```json
// Exemplo para visualizar um arquivo
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "view",
    "path": "primes.py"
  }
}

// Exemplo para visualizar um diretório
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

O comando `str_replace` permite que Claude substitua uma string específica em um arquivo por uma nova string. Isso é usado para fazer edições precisas.

Parâmetros:
- `command`: Deve ser "str_replace"
- `path`: O caminho para o arquivo a modificar
- `old_str`: O texto a substituir (deve corresponder exatamente, incluindo espaços em branco e indentação)
- `new_str`: O novo texto a inserir no lugar do texto antigo

<section title="Exemplo de comando str_replace">

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

O comando `create` permite que Claude crie um novo arquivo com conteúdo especificado.

Parâmetros:
- `command`: Deve ser "create"
- `path`: O caminho onde o novo arquivo deve ser criado
- `file_text`: O conteúdo a escrever no novo arquivo

<section title="Exemplo de comando create">

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

O comando `insert` permite que Claude insira texto em um local específico em um arquivo.

Parâmetros:
- `command`: Deve ser "insert"
- `path`: O caminho para o arquivo a modificar
- `insert_line`: O número da linha após a qual inserir o texto (0 para o início do arquivo)
- `new_str`: O texto a inserir

<section title="Exemplo de comando insert">

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

O comando `undo_edit` permite que Claude reverta a última edição feita em um arquivo.

<Note>
Este comando está disponível apenas em Claude Sonnet 3.7 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations)). Não é suportado em modelos Claude 4 usando o `text_editor_20250728`.
</Note>

Parâmetros:
- `command`: Deve ser "undo_edit"
- `path`: O caminho para o arquivo cuja última edição deve ser desfeita

<section title="Exemplo de comando undo_edit">

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

### Exemplo: Corrigindo um erro de sintaxe com a ferramenta de editor de texto

<Tabs>
<Tab title="Claude 4">

Este exemplo demonstra como modelos Claude 4 usam a ferramenta de editor de texto para corrigir um erro de sintaxe em um arquivo Python.

Primeiro, sua aplicação fornece ao Claude a ferramenta de editor de texto e um prompt para corrigir um erro de sintaxe:

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

Claude usará a ferramenta de editor de texto primeiro para visualizar o arquivo:

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

Sua aplicação deve então ler o arquivo e retornar seu conteúdo ao Claude:

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
**Números de linha**

No exemplo acima, o resultado da ferramenta `view` inclui o conteúdo do arquivo com números de linha precedendo cada linha (por exemplo, "1: def is_prime(n):"). Os números de linha não são obrigatórios, mas são essenciais para usar com sucesso o parâmetro `view_range` para examinar seções específicas de arquivos e o parâmetro `insert_line` para adicionar conteúdo em locais precisos.
</Tip>

Claude identificará o erro de sintaxe e usará o comando `str_replace` para corrigi-lo:

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

Sua aplicação deve então fazer a edição e retornar o resultado:

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

Finalmente, Claude fornecerá uma explicação completa da correção:

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
Este exemplo demonstra como Claude Sonnet 3.7 usa a ferramenta de editor de texto para corrigir um erro de sintaxe em um arquivo Python.

Primeiro, sua aplicação fornece ao Claude a ferramenta de editor de texto e um prompt para corrigir um erro de sintaxe:

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
Os exemplos de Claude Sonnet 3.7 seguem o mesmo formato que os exemplos de Claude 4 acima, usando as mesmas chamadas de ferramenta e respostas, mas com o tipo de ferramenta `text_editor_20250124` e o nome `str_replace_editor`.
</Note>
</Tab>
</Tabs>

***

## Implementar a ferramenta editor de texto

A ferramenta editor de texto é implementada como uma ferramenta sem esquema. Ao usar esta ferramenta, você não precisa fornecer um esquema de entrada como com outras ferramentas; o esquema é integrado ao modelo Claude e não pode ser modificado.

O tipo de ferramenta depende da versão do modelo:
- **Claude 4**: `type: "text_editor_20250728"`
- **Claude Sonnet 3.7**: `type: "text_editor_20250124"`

<Steps>
  <Step title="Inicializar sua implementação do editor">
    Crie funções auxiliares para lidar com operações de arquivo, como leitura, escrita e modificação de arquivos. Considere implementar funcionalidade de backup para recuperação de erros.
  </Step>
  <Step title="Lidar com chamadas de ferramenta do editor">
    Crie uma função que processa chamadas de ferramenta do Claude com base no tipo de comando:
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
  <Step title="Implementar medidas de segurança">
    Adicione validação e verificações de segurança:
    - Valide caminhos de arquivo para evitar travessia de diretório
    - Crie backups antes de fazer alterações
    - Trate erros com elegância
    - Implemente verificações de permissões
  </Step>
  <Step title="Processar respostas do Claude">
    Extraia e trate chamadas de ferramenta das respostas do Claude:
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
Ao implementar a ferramenta editor de texto, tenha em mente:

1. **Segurança**: A ferramenta tem acesso ao seu sistema de arquivos local, portanto implemente medidas de segurança apropriadas.
2. **Backup**: Sempre crie backups antes de permitir edições em arquivos importantes.
3. **Validação**: Valide todas as entradas para evitar alterações não intencionais.
4. **Correspondência única**: Certifique-se de que as substituições correspondem exatamente a um local para evitar edições não intencionais.
</Warning>

### Lidar com erros

Ao usar a ferramenta editor de texto, vários erros podem ocorrer. Aqui está orientação sobre como tratá-los:

<section title="Arquivo não encontrado">

Se Claude tentar visualizar ou modificar um arquivo que não existe, retorne uma mensagem de erro apropriada no `tool_result`:

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

<section title="Múltiplas correspondências para substituição">

Se o comando `str_replace` do Claude corresponder a vários locais no arquivo, retorne uma mensagem de erro apropriada:

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

<section title="Nenhuma correspondência para substituição">

Se o comando `str_replace` do Claude não corresponder a nenhum texto no arquivo, retorne uma mensagem de erro apropriada:

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

<section title="Erros de permissão">

Se houver problemas de permissão ao criar, ler ou modificar arquivos, retorne uma mensagem de erro apropriada:

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

### Seguir as melhores práticas de implementação

<section title="Fornecer contexto claro">

Ao pedir ao Claude para corrigir ou modificar código, seja específico sobre quais arquivos precisam ser examinados ou quais problemas precisam ser abordados. Um contexto claro ajuda Claude a identificar os arquivos corretos e fazer alterações apropriadas.

**Prompt menos útil**: "Você pode corrigir meu código?"

**Prompt melhor**: "Há um erro de sintaxe no meu arquivo primes.py que impede sua execução. Você pode corrigi-lo?"

</section>

<section title="Ser explícito sobre caminhos de arquivo">

Especifique caminhos de arquivo claramente quando necessário, especialmente se você estiver trabalhando com vários arquivos ou arquivos em diretórios diferentes.

**Prompt menos útil**: "Revise meu arquivo auxiliar"

**Prompt melhor**: "Você pode verificar meu arquivo utils/helpers.py para problemas de desempenho?"

</section>

<section title="Criar backups antes de editar">

Implemente um sistema de backup em sua aplicação que crie cópias de arquivos antes de permitir que Claude os edite, especialmente para código importante ou de produção.

```python
def backup_file(file_path):
    """Create a backup of a file before editing."""
    backup_path = f"{file_path}.backup"
    if os.path.exists(file_path):
        with open(file_path, 'r') as src, open(backup_path, 'w') as dst:
            dst.write(src.read())
```

</section>

<section title="Lidar com substituição de texto única com cuidado">

O comando `str_replace` requer uma correspondência exata para o texto a ser substituído. Sua aplicação deve garantir que haja exatamente uma correspondência para o texto antigo ou fornecer mensagens de erro apropriadas.
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

<section title="Verificar alterações">

Após Claude fazer alterações em um arquivo, verifique as alterações executando testes ou verificando se o código ainda funciona conforme esperado.
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

## Preços e uso de tokens

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

Para informações mais detalhadas sobre preços de ferramentas, consulte [Preços de uso de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/overview#pricing).

## Integrar a ferramenta editor de texto com outras ferramentas

A ferramenta editor de texto pode ser usada junto com outras ferramentas Claude. Ao combinar ferramentas, certifique-se de:
- Corresponder a versão da ferramenta com o modelo que você está usando
- Contabilizar o uso de tokens adicional para todas as ferramentas incluídas em sua solicitação

## Registro de alterações

| Data | Versão | Alterações |
| ---- | ------- | ------- |
| 28 de julho de 2025 | `text_editor_20250728` | Lançamento de uma ferramenta editor de texto atualizada que corrige alguns problemas e adiciona um parâmetro `max_characters` opcional. É idêntica a `text_editor_20250429`. |
| 29 de abril de 2025 | `text_editor_20250429` | Lançamento da ferramenta editor de texto para Claude 4. Esta versão remove o comando `undo_edit` mas mantém todas as outras capacidades. O nome da ferramenta foi atualizado para refletir sua arquitetura baseada em str_replace. |
| 13 de março de 2025 | `text_editor_20250124` | Introdução da documentação da ferramenta editor de texto independente. Esta versão é otimizada para Claude Sonnet 3.7 mas tem capacidades idênticas à versão anterior. |
| 22 de outubro de 2024 | `text_editor_20241022` | Lançamento inicial da ferramenta editor de texto com Claude Sonnet 3.5 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations)). Fornece capacidades para visualizar, criar e editar arquivos através dos comandos `view`, `create`, `str_replace`, `insert` e `undo_edit`. |

## Próximos passos

Aqui estão algumas ideias de como usar a ferramenta editor de texto de formas mais convenientes e poderosas:

- **Integrar com seu fluxo de trabalho de desenvolvimento**: Construa a ferramenta editor de texto em suas ferramentas de desenvolvimento ou IDE
- **Criar um sistema de revisão de código**: Tenha Claude revisar seu código e fazer melhorias
- **Construir um assistente de depuração**: Crie um sistema onde Claude possa ajudá-lo a diagnosticar e corrigir problemas em seu código
- **Implementar conversão de formato de arquivo**: Deixe Claude ajudá-lo a converter arquivos de um formato para outro
- **Automatizar documentação**: Configure fluxos de trabalho para Claude documentar automaticamente seu código

Conforme você constrói aplicações com a ferramenta editor de texto, estamos animados para ver como você aproveita as capacidades do Claude para aprimorar seu fluxo de trabalho de desenvolvimento e produtividade.

<CardGroup cols={3}>
  <Card
    title="Visão geral de uso de ferramentas"
    icon="wrench"
    href="/docs/pt-BR/agents-and-tools/tool-use/overview"
  >
    Aprenda como implementar fluxos de trabalho de ferramentas para uso com Claude.
  </Card>

  <Card
    title="Ferramenta Bash"
    icon="terminal"
    href="/docs/pt-BR/agents-and-tools/tool-use/bash-tool"
  >
    Execute comandos shell com Claude.
  </Card>
</CardGroup>