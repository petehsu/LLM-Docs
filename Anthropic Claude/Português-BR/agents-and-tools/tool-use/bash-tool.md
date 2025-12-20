# Ferramenta bash

A ferramenta bash permite que Claude execute comandos shell em uma sessão bash persistente, permitindo operações de sistema, execução de scripts e automação de linha de comando.

---

A ferramenta bash permite que Claude execute comandos shell em uma sessão bash persistente, permitindo operações de sistema, execução de scripts e automação de linha de comando.

## Visão geral

A ferramenta bash fornece a Claude:
- Sessão bash persistente que mantém o estado
- Capacidade de executar qualquer comando shell
- Acesso a variáveis de ambiente e diretório de trabalho
- Capacidades de encadeamento de comandos e scripts

## Compatibilidade de modelos

| Modelo | Versão da ferramenta |
|-------|--------------|
| Modelos Claude 4 e Sonnet 3.7 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations)) | `bash_20250124` |

<Warning>
Versões mais antigas da ferramenta não são garantidas como compatíveis com versões mais recentes de modelos. Sempre use a versão da ferramenta que corresponde à sua versão de modelo.
</Warning>

## Casos de uso

- **Fluxos de trabalho de desenvolvimento**: Execute comandos de compilação, testes e ferramentas de desenvolvimento
- **Automação de sistema**: Execute scripts, gerencie arquivos, automatize tarefas
- **Processamento de dados**: Processe arquivos, execute scripts de análise, gerencie conjuntos de dados
- **Configuração de ambiente**: Instale pacotes, configure ambientes

## Início rápido

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "bash_20250124",
            "name": "bash"
        }
    ],
    messages=[
        {"role": "user", "content": "List all Python files in the current directory."}
    ]
)
```

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
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "List all Python files in the current directory."
      }
    ]
  }'
```
</CodeGroup>

## Como funciona

A ferramenta bash mantém uma sessão persistente:

1. Claude determina qual comando executar
2. Você executa o comando em um shell bash
3. Retorna a saída (stdout e stderr) para Claude
4. O estado da sessão persiste entre comandos (variáveis de ambiente, diretório de trabalho)

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|----------|-------------|
| `command` | Sim* | O comando bash a executar |
| `restart` | Não | Defina como `true` para reiniciar a sessão bash |

*Obrigatório a menos que esteja usando `restart`

<section title="Exemplo de uso">

```json
// Executar um comando
{
  "command": "ls -la *.py"
}

// Reiniciar a sessão
{
  "restart": true
}
```

</section>

## Exemplo: Automação em várias etapas

Claude pode encadear comandos para completar tarefas complexas:

```python
# Solicitação do usuário
"Install the requests library and create a simple Python script that fetches a joke from an API, then run it."

# A ferramenta de Claude usa:
# 1. Instalar pacote
{"command": "pip install requests"}

# 2. Criar script
{"command": "cat > fetch_joke.py << 'EOF'\nimport requests\nresponse = requests.get('https://official-joke-api.appspot.com/random_joke')\njoke = response.json()\nprint(f\"Setup: {joke['setup']}\")\nprint(f\"Punchline: {joke['punchline']}\")\nEOF"}

# 3. Executar script
{"command": "python fetch_joke.py"}
```

A sessão mantém o estado entre comandos, portanto, os arquivos criados na etapa 2 estão disponíveis na etapa 3.

***

## Implementar a ferramenta bash

A ferramenta bash é implementada como uma ferramenta sem esquema. Ao usar esta ferramenta, você não precisa fornecer um esquema de entrada como com outras ferramentas; o esquema é incorporado ao modelo de Claude e não pode ser modificado.

<Steps>
  <Step title="Configurar um ambiente bash">
    Crie uma sessão bash persistente com a qual Claude possa interagir:
    ```python
    import subprocess
    import threading
    import queue
    
    class BashSession:
        def __init__(self):
            self.process = subprocess.Popen(
                ['/bin/bash'],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0
            )
            self.output_queue = queue.Queue()
            self.error_queue = queue.Queue()
            self._start_readers()
    ```
  </Step>
  <Step title="Lidar com execução de comandos">
    Crie uma função para executar comandos e capturar a saída:
    ```python
    def execute_command(self, command):
        # Enviar comando para bash
        self.process.stdin.write(command + '\n')
        self.process.stdin.flush()
        
        # Capturar saída com timeout
        output = self._read_output(timeout=10)
        return output
    ```
  </Step>
  <Step title="Processar chamadas de ferramentas de Claude">
    Extraia e execute comandos das respostas de Claude:
    ```python
    for content in response.content:
        if content.type == "tool_use" and content.name == "bash":
            if content.input.get("restart"):
                bash_session.restart()
                result = "Bash session restarted"
            else:
                command = content.input.get("command")
                result = bash_session.execute_command(command)
            
            # Retornar resultado para Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="Implementar medidas de segurança">
    Adicione validação e restrições:
    ```python
    def validate_command(command):
        # Bloquear comandos perigosos
        dangerous_patterns = ['rm -rf /', 'format', ':(){:|:&};:']
        for pattern in dangerous_patterns:
            if pattern in command:
                return False, f"Command contains dangerous pattern: {pattern}"
        
        # Adicionar mais validação conforme necessário
        return True, None
    ```
  </Step>
</Steps>

### Lidar com erros

Ao implementar a ferramenta bash, trate vários cenários de erro:

<section title="Timeout de execução de comando">

Se um comando levar muito tempo para executar:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Command timed out after 30 seconds",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Comando não encontrado">

Se um comando não existir:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: nonexistentcommand: command not found",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Permissão negada">

Se houver problemas de permissão:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: /root/sensitive-file: Permission denied",
      "is_error": true
    }
  ]
}
```

</section>

### Seguir as melhores práticas de implementação

<section title="Usar timeouts de comando">

Implemente timeouts para evitar comandos travados:
```python
def execute_with_timeout(command, timeout=30):
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=timeout
        )
        return result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return f"Command timed out after {timeout} seconds"
```

</section>

<section title="Manter estado da sessão">

Mantenha a sessão bash persistente para manter variáveis de ambiente e diretório de trabalho:
```python
# Comandos executados na mesma sessão mantêm o estado
commands = [
    "cd /tmp",
    "echo 'Hello' > test.txt",
    "cat test.txt"  # Isso funciona porque ainda estamos em /tmp
]
```

</section>

<section title="Lidar com saídas grandes">

Truncar saídas muito grandes para evitar problemas de limite de tokens:
```python
def truncate_output(output, max_lines=100):
    lines = output.split('\n')
    if len(lines) > max_lines:
        truncated = '\n'.join(lines[:max_lines])
        return f"{truncated}\n\n... Output truncated ({len(lines)} total lines) ..."
    return output
```

</section>

<section title="Registrar todos os comandos">

Mantenha um registro de auditoria dos comandos executados:
```python
import logging

def log_command(command, output, user_id):
    logging.info(f"User {user_id} executed: {command}")
    logging.info(f"Output: {output[:200]}...")  # Registrar primeiros 200 caracteres
```

</section>

<section title="Sanitizar saídas">

Remova informações sensíveis das saídas de comando:
```python
def sanitize_output(output):
    # Remover possíveis segredos ou credenciais
    import re
    # Exemplo: Remover credenciais AWS
    output = re.sub(r'aws_access_key_id\s*=\s*\S+', 'aws_access_key_id=***', output)
    output = re.sub(r'aws_secret_access_key\s*=\s*\S+', 'aws_secret_access_key=***', output)
    return output
```

</section>

## Segurança

<Warning>
A ferramenta bash fornece acesso direto ao sistema. Implemente estas medidas de segurança essenciais:
- Executar em ambientes isolados (Docker/VM)
- Implementar filtragem de comandos e listas de permissão
- Definir limites de recursos (CPU, memória, disco)
- Registrar todos os comandos executados
</Warning>

### Recomendações principais
- Use `ulimit` para definir restrições de recursos
- Filtre comandos perigosos (`sudo`, `rm -rf`, etc.)
- Execute com permissões mínimas de usuário
- Monitore e registre toda execução de comando

## Preços

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

Veja [preços de uso de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/overview#pricing) para detalhes completos de preços.

## Padrões comuns

### Fluxos de trabalho de desenvolvimento
- Executar testes: `pytest && coverage report`
- Compilar projetos: `npm install && npm run build`
- Operações Git: `git status && git add . && git commit -m "message"`

### Operações de arquivo
- Processar dados: `wc -l *.csv && ls -lh *.csv`
- Pesquisar arquivos: `find . -name "*.py" | xargs grep "pattern"`
- Criar backups: `tar -czf backup.tar.gz ./data`

### Tarefas de sistema
- Verificar recursos: `df -h && free -m`
- Gerenciamento de processos: `ps aux | grep python`
- Configuração de ambiente: `export PATH=$PATH:/new/path && echo $PATH`

## Limitações

- **Sem comandos interativos**: Não pode lidar com `vim`, `less` ou prompts de senha
- **Sem aplicações GUI**: Apenas linha de comando
- **Escopo de sessão**: Persiste dentro da conversa, perdido entre chamadas de API
- **Limites de saída**: Saídas grandes podem ser truncadas
- **Sem streaming**: Resultados retornados após conclusão

## Combinando com outras ferramentas

A ferramenta bash é mais poderosa quando combinada com o [editor de texto](/docs/pt-BR/agents-and-tools/tool-use/text-editor-tool) e outras ferramentas.

## Próximos passos

<CardGroup cols={2}>
  <Card
    title="Visão geral de uso de ferramentas"
    icon="tool"
    href="/docs/pt-BR/agents-and-tools/tool-use/overview"
  >
    Saiba mais sobre uso de ferramentas com Claude
  </Card>

  <Card
    title="Ferramenta editor de texto"
    icon="file"
    href="/docs/pt-BR/agents-and-tools/tool-use/text-editor-tool"
  >
    Visualize e edite arquivos de texto com Claude
  </Card>
</CardGroup>