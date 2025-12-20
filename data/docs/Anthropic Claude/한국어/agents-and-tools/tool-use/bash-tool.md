# Bash 도구

Claude가 지속적인 bash 세션에서 셸 명령을 실행할 수 있게 해주는 bash 도구에 대해 알아봅니다.

---

bash 도구를 사용하면 Claude가 지속적인 bash 세션에서 셸 명령을 실행할 수 있으므로 시스템 작업, 스크립트 실행 및 명령줄 자동화가 가능합니다.

## 개요

bash 도구는 Claude에게 다음을 제공합니다:
- 상태를 유지하는 지속적인 bash 세션
- 모든 셸 명령 실행 능력
- 환경 변수 및 작업 디렉토리에 대한 액세스
- 명령 체이닝 및 스크립팅 기능

## 모델 호환성

| 모델 | 도구 버전 |
|-------|--------------|
| Claude 4 모델 및 Sonnet 3.7 ([지원 중단됨](/docs/ko/about-claude/model-deprecations)) | `bash_20250124` |

<Warning>
이전 도구 버전은 최신 모델과의 하위 호환성이 보장되지 않습니다. 항상 모델 버전에 해당하는 도구 버전을 사용하세요.
</Warning>

## 사용 사례

- **개발 워크플로우**: 빌드 명령, 테스트 및 개발 도구 실행
- **시스템 자동화**: 스크립트 실행, 파일 관리, 작업 자동화
- **데이터 처리**: 파일 처리, 분석 스크립트 실행, 데이터셋 관리
- **환경 설정**: 패키지 설치, 환경 구성

## 빠른 시작

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

## 작동 방식

bash 도구는 지속적인 세션을 유지합니다:

1. Claude가 실행할 명령을 결정합니다
2. bash 셸에서 명령을 실행합니다
3. 출력(stdout 및 stderr)을 Claude에게 반환합니다
4. 세션 상태는 명령 간에 유지됩니다(환경 변수, 작업 디렉토리)

## 매개변수

| 매개변수 | 필수 | 설명 |
|-----------|----------|-------------|
| `command` | 예* | 실행할 bash 명령 |
| `restart` | 아니오 | bash 세션을 다시 시작하려면 `true`로 설정 |

*`restart`를 사용하지 않는 한 필수

<section title="사용 예시">

```json
// 명령 실행
{
  "command": "ls -la *.py"
}

// 세션 다시 시작
{
  "restart": true
}
```

</section>

## 예시: 다단계 자동화

Claude는 복잡한 작업을 완료하기 위해 명령을 체이닝할 수 있습니다:

```python
# 사용자 요청
"Install the requests library and create a simple Python script that fetches a joke from an API, then run it."

# Claude의 도구 사용:
# 1. 패키지 설치
{"command": "pip install requests"}

# 2. 스크립트 생성
{"command": "cat > fetch_joke.py << 'EOF'\nimport requests\nresponse = requests.get('https://official-joke-api.appspot.com/random_joke')\njoke = response.json()\nprint(f\"Setup: {joke['setup']}\")\nprint(f\"Punchline: {joke['punchline']}\")\nEOF"}

# 3. 스크립트 실행
{"command": "python fetch_joke.py"}
```

세션은 명령 간에 상태를 유지하므로 2단계에서 생성된 파일을 3단계에서 사용할 수 있습니다.

***

## bash 도구 구현

bash 도구는 스키마 없는 도구로 구현됩니다. 이 도구를 사용할 때 다른 도구와 달리 입력 스키마를 제공할 필요가 없습니다. 스키마는 Claude의 모델에 내장되어 있으며 수정할 수 없습니다.

<Steps>
  <Step title="bash 환경 설정">
    Claude가 상호작용할 수 있는 지속적인 bash 세션을 만듭니다:
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
  <Step title="명령 실행 처리">
    명령을 실행하고 출력을 캡처하는 함수를 만듭니다:
    ```python
    def execute_command(self, command):
        # bash에 명령 전송
        self.process.stdin.write(command + '\n')
        self.process.stdin.flush()
        
        # 타임아웃으로 출력 캡처
        output = self._read_output(timeout=10)
        return output
    ```
  </Step>
  <Step title="Claude의 도구 호출 처리">
    Claude의 응답에서 명령을 추출하고 실행합니다:
    ```python
    for content in response.content:
        if content.type == "tool_use" and content.name == "bash":
            if content.input.get("restart"):
                bash_session.restart()
                result = "Bash session restarted"
            else:
                command = content.input.get("command")
                result = bash_session.execute_command(command)
            
            # Claude에 결과 반환
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="안전 조치 구현">
    검증 및 제한을 추가합니다:
    ```python
    def validate_command(command):
        # 위험한 명령 차단
        dangerous_patterns = ['rm -rf /', 'format', ':(){:|:&};:']
        for pattern in dangerous_patterns:
            if pattern in command:
                return False, f"Command contains dangerous pattern: {pattern}"
        
        # 필요에 따라 더 많은 검증 추가
        return True, None
    ```
  </Step>
</Steps>

### 오류 처리

bash 도구를 구현할 때 다양한 오류 시나리오를 처리합니다:

<section title="명령 실행 타임아웃">

명령 실행이 너무 오래 걸리는 경우:

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

<section title="명령을 찾을 수 없음">

명령이 존재하지 않는 경우:

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

<section title="권한 거부">

권한 문제가 있는 경우:

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

### 구현 모범 사례 따르기

<section title="명령 타임아웃 사용">

명령이 중단되는 것을 방지하기 위해 타임아웃을 구현합니다:
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

<section title="세션 상태 유지">

bash 세션을 지속적으로 유지하여 환경 변수 및 작업 디렉토리를 유지합니다:
```python
# 같은 세션에서 실행되는 명령은 상태를 유지합니다
commands = [
    "cd /tmp",
    "echo 'Hello' > test.txt",
    "cat test.txt"  # 우리가 여전히 /tmp에 있기 때문에 작동합니다
]
```

</section>

<section title="큰 출력 처리">

토큰 제한 문제를 방지하기 위해 매우 큰 출력을 자릅니다:
```python
def truncate_output(output, max_lines=100):
    lines = output.split('\n')
    if len(lines) > max_lines:
        truncated = '\n'.join(lines[:max_lines])
        return f"{truncated}\n\n... Output truncated ({len(lines)} total lines) ..."
    return output
```

</section>

<section title="모든 명령 로깅">

실행된 명령의 감사 추적을 유지합니다:
```python
import logging

def log_command(command, output, user_id):
    logging.info(f"User {user_id} executed: {command}")
    logging.info(f"Output: {output[:200]}...")  # 처음 200자 로깅
```

</section>

<section title="출력 정제">

명령 출력에서 민감한 정보를 제거합니다:
```python
def sanitize_output(output):
    # 잠재적 비밀 또는 자격증명 제거
    import re
    # 예: AWS 자격증명 제거
    output = re.sub(r'aws_access_key_id\s*=\s*\S+', 'aws_access_key_id=***', output)
    output = re.sub(r'aws_secret_access_key\s*=\s*\S+', 'aws_secret_access_key=***', output)
    return output
```

</section>

## 보안

<Warning>
bash 도구는 직접적인 시스템 액세스를 제공합니다. 다음 필수 안전 조치를 구현하세요:
- 격리된 환경(Docker/VM)에서 실행
- 명령 필터링 및 허용 목록 구현
- 리소스 제한 설정(CPU, 메모리, 디스크)
- 실행된 모든 명령 로깅
</Warning>

### 주요 권장사항
- `ulimit`을 사용하여 리소스 제약 설정
- 위험한 명령 필터링(`sudo`, `rm -rf` 등)
- 최소 사용자 권한으로 실행
- 모든 명령 실행 모니터링 및 로깅

## 가격 책정

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

완전한 가격 책정 세부사항은 [도구 사용 가격 책정](/docs/ko/agents-and-tools/tool-use/overview#pricing)을 참조하세요.

## 일반적인 패턴

### 개발 워크플로우
- 테스트 실행: `pytest && coverage report`
- 프로젝트 빌드: `npm install && npm run build`
- Git 작업: `git status && git add . && git commit -m "message"`

### 파일 작업
- 데이터 처리: `wc -l *.csv && ls -lh *.csv`
- 파일 검색: `find . -name "*.py" | xargs grep "pattern"`
- 백업 생성: `tar -czf backup.tar.gz ./data`

### 시스템 작업
- 리소스 확인: `df -h && free -m`
- 프로세스 관리: `ps aux | grep python`
- 환경 설정: `export PATH=$PATH:/new/path && echo $PATH`

## 제한사항

- **대화형 명령 없음**: `vim`, `less` 또는 암호 프롬프트를 처리할 수 없음
- **GUI 애플리케이션 없음**: 명령줄만 가능
- **세션 범위**: 대화 내에서 지속되며 API 호출 간에 손실됨
- **출력 제한**: 큰 출력이 잘릴 수 있음
- **스트리밍 없음**: 완료 후 결과 반환

## 다른 도구와 결합

bash 도구는 [텍스트 편집기](/docs/ko/agents-and-tools/tool-use/text-editor-tool) 및 다른 도구와 결합할 때 가장 강력합니다.

## 다음 단계

<CardGroup cols={2}>
  <Card
    title="도구 사용 개요"
    icon="tool"
    href="/docs/ko/agents-and-tools/tool-use/overview"
  >
    Claude와 함께 도구 사용에 대해 알아봅니다
  </Card>

  <Card
    title="텍스트 편집기 도구"
    icon="file"
    href="/docs/ko/agents-and-tools/tool-use/text-editor-tool"
  >
    Claude로 텍스트 파일 보기 및 편집
  </Card>
</CardGroup>