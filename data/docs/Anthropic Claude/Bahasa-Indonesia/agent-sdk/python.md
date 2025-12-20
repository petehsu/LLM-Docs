# Agent SDK reference - Python

Referensi API lengkap untuk Python Agent SDK, termasuk semua fungsi, tipe, dan kelas.

---

## Instalasi

```bash
pip install claude-agent-sdk
```

## Memilih Antara `query()` dan `ClaudeSDKClient`

Python SDK menyediakan dua cara untuk berinteraksi dengan Claude Code:

### Perbandingan Cepat

| Fitur               | `query()`                     | `ClaudeSDKClient`                  |
| :------------------ | :---------------------------- | :--------------------------------- |
| **Sesi**            | Membuat sesi baru setiap kali | Menggunakan kembali sesi yang sama |
| **Percakapan**      | Pertukaran tunggal             | Pertukaran ganda dalam konteks yang sama |
| **Koneksi**         | Dikelola secara otomatis       | Kontrol manual                     |
| **Input Streaming** | ✅ Didukung                   | ✅ Didukung                       |
| **Interupsi**       | ❌ Tidak didukung              | ✅ Didukung                       |
| **Hooks**           | ❌ Tidak didukung              | ✅ Didukung                       |
| **Alat Kustom**     | ❌ Tidak didukung              | ✅ Didukung                       |
| **Lanjutkan Chat**  | ❌ Sesi baru setiap kali      | ✅ Mempertahankan percakapan      |
| **Kasus Penggunaan**| Tugas sekali jalan             | Percakapan berkelanjutan           |

### Kapan Menggunakan `query()` (Sesi Baru Setiap Kali)

**Terbaik untuk:**

- Pertanyaan sekali jalan di mana Anda tidak memerlukan riwayat percakapan
- Tugas independen yang tidak memerlukan konteks dari pertukaran sebelumnya
- Skrip otomasi sederhana
- Ketika Anda menginginkan awal yang segar setiap kali

### Kapan Menggunakan `ClaudeSDKClient` (Percakapan Berkelanjutan)

**Terbaik untuk:**

- **Melanjutkan percakapan** - Ketika Anda memerlukan Claude untuk mengingat konteks
- **Pertanyaan lanjutan** - Membangun berdasarkan respons sebelumnya
- **Aplikasi interaktif** - Antarmuka obrolan, REPL
- **Logika berbasis respons** - Ketika tindakan berikutnya bergantung pada respons Claude
- **Kontrol sesi** - Mengelola siklus hidup percakapan secara eksplisit

## Fungsi

### `query()`

Membuat sesi baru untuk setiap interaksi dengan Claude Code. Mengembalikan iterator async yang menghasilkan pesan saat tiba. Setiap panggilan ke `query()` dimulai segar tanpa memori interaksi sebelumnya.

```python
async def query(
    *,
    prompt: str | AsyncIterable[dict[str, Any]],
    options: ClaudeAgentOptions | None = None
) -> AsyncIterator[Message]
```

#### Parameter

| Parameter | Tipe                         | Deskripsi                                                                |
| :-------- | :--------------------------- | :------------------------------------------------------------------------- |
| `prompt`  | `str \| AsyncIterable[dict]` | Prompt input sebagai string atau iterable async untuk mode streaming          |
| `options` | `ClaudeAgentOptions \| None` | Objek konfigurasi opsional (default ke `ClaudeAgentOptions()` jika None) |

#### Pengembalian

Mengembalikan `AsyncIterator[Message]` yang menghasilkan pesan dari percakapan.

#### Contoh - Dengan opsi

```python

import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    options = ClaudeAgentOptions(
        system_prompt="You are an expert Python developer",
        permission_mode='acceptEdits',
        cwd="/home/user/project"
    )

    async for message in query(
        prompt="Create a Python web server",
        options=options
    ):
        print(message)


asyncio.run(main())
```

### `tool()`

Dekorator untuk mendefinisikan alat MCP dengan keamanan tipe.

```python
def tool(
    name: str,
    description: str,
    input_schema: type | dict[str, Any]
) -> Callable[[Callable[[Any], Awaitable[dict[str, Any]]]], SdkMcpTool[Any]]
```

#### Parameter

| Parameter      | Tipe                     | Deskripsi                                             |
| :------------- | :----------------------- | :------------------------------------------------------ |
| `name`         | `str`                    | Pengenal unik untuk alat                          |
| `description`  | `str`                    | Deskripsi yang dapat dibaca manusia tentang apa yang dilakukan alat        |
| `input_schema` | `type \| dict[str, Any]` | Skema yang mendefinisikan parameter input alat (lihat di bawah) |

#### Opsi Input Schema

1. **Pemetaan tipe sederhana** (direkomendasikan):

   ```python
   {"text": str, "count": int, "enabled": bool}
   ```

2. **Format JSON Schema** (untuk validasi kompleks):
   ```python
   {
       "type": "object",
       "properties": {
           "text": {"type": "string"},
           "count": {"type": "integer", "minimum": 0}
       },
       "required": ["text"]
   }
   ```

#### Pengembalian

Fungsi dekorator yang membungkus implementasi alat dan mengembalikan instance `SdkMcpTool`.

#### Contoh

```python
from claude_agent_sdk import tool
from typing import Any

@tool("greet", "Greet a user", {"name": str})
async def greet(args: dict[str, Any]) -> dict[str, Any]:
    return {
        "content": [{
            "type": "text",
            "text": f"Hello, {args['name']}!"
        }]
    }
```

### `create_sdk_mcp_server()`

Buat server MCP dalam proses yang berjalan dalam aplikasi Python Anda.

```python
def create_sdk_mcp_server(
    name: str,
    version: str = "1.0.0",
    tools: list[SdkMcpTool[Any]] | None = None
) -> McpSdkServerConfig
```

#### Parameter

| Parameter | Tipe                            | Default   | Deskripsi                                           |
| :-------- | :------------------------------ | :-------- | :---------------------------------------------------- |
| `name`    | `str`                           | -         | Pengenal unik untuk server                      |
| `version` | `str`                           | `"1.0.0"` | String versi server                                 |
| `tools`   | `list[SdkMcpTool[Any]] \| None` | `None`    | Daftar fungsi alat yang dibuat dengan dekorator `@tool` |

#### Pengembalian

Mengembalikan objek `McpSdkServerConfig` yang dapat diteruskan ke `ClaudeAgentOptions.mcp_servers`.

#### Contoh

```python
from claude_agent_sdk import tool, create_sdk_mcp_server

@tool("add", "Add two numbers", {"a": float, "b": float})
async def add(args):
    return {
        "content": [{
            "type": "text",
            "text": f"Sum: {args['a'] + args['b']}"
        }]
    }

@tool("multiply", "Multiply two numbers", {"a": float, "b": float})
async def multiply(args):
    return {
        "content": [{
            "type": "text",
            "text": f"Product: {args['a'] * args['b']}"
        }]
    }

calculator = create_sdk_mcp_server(
    name="calculator",
    version="2.0.0",
    tools=[add, multiply]  # Pass decorated functions
)

# Use with Claude
options = ClaudeAgentOptions(
    mcp_servers={"calc": calculator},
    allowed_tools=["mcp__calc__add", "mcp__calc__multiply"]
)
```

## Kelas

### `ClaudeSDKClient`

**Mempertahankan sesi percakapan di seluruh pertukaran ganda.** Ini adalah setara Python dari cara fungsi `query()` SDK TypeScript bekerja secara internal - ini membuat objek klien yang dapat melanjutkan percakapan.

#### Fitur Utama

- **Kontinuitas Sesi**: Mempertahankan konteks percakapan di seluruh panggilan `query()` ganda
- **Percakapan yang Sama**: Claude mengingat pesan sebelumnya dalam sesi
- **Dukungan Interupsi**: Dapat menghentikan Claude di tengah eksekusi
- **Siklus Hidup Eksplisit**: Anda mengontrol kapan sesi dimulai dan berakhir
- **Alur Berbasis Respons**: Dapat bereaksi terhadap respons dan mengirim tindak lanjut
- **Alat Kustom & Hooks**: Mendukung alat kustom (dibuat dengan dekorator `@tool`) dan hooks

```python
class ClaudeSDKClient:
    def __init__(self, options: ClaudeAgentOptions | None = None)
    async def connect(self, prompt: str | AsyncIterable[dict] | None = None) -> None
    async def query(self, prompt: str | AsyncIterable[dict], session_id: str = "default") -> None
    async def receive_messages(self) -> AsyncIterator[Message]
    async def receive_response(self) -> AsyncIterator[Message]
    async def interrupt(self) -> None
    async def disconnect(self) -> None
```

#### Metode

| Metode                      | Deskripsi                                                         |
| :-------------------------- | :------------------------------------------------------------------ |
| `__init__(options)`         | Inisialisasi klien dengan konfigurasi opsional                   |
| `connect(prompt)`           | Terhubung ke Claude dengan prompt awal opsional atau aliran pesan |
| `query(prompt, session_id)` | Kirim permintaan baru dalam mode streaming                                |
| `receive_messages()`        | Terima semua pesan dari Claude sebagai iterator async               |
| `receive_response()`        | Terima pesan hingga dan termasuk ResultMessage                |
| `interrupt()`               | Kirim sinyal interupsi (hanya bekerja dalam mode streaming)                |
| `disconnect()`              | Putuskan sambungan dari Claude                                              |

#### Dukungan Context Manager

Klien dapat digunakan sebagai context manager async untuk manajemen koneksi otomatis:

```python
async with ClaudeSDKClient() as client:
    await client.query("Hello Claude")
    async for message in client.receive_response():
        print(message)
```

> **Penting:** Saat melakukan iterasi atas pesan, hindari menggunakan `break` untuk keluar lebih awal karena ini dapat menyebabkan masalah pembersihan asyncio. Sebaliknya, biarkan iterasi selesai secara alami atau gunakan flag untuk melacak kapan Anda telah menemukan apa yang Anda butuhkan.

#### Contoh - Melanjutkan percakapan

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient, AssistantMessage, TextBlock, ResultMessage

async def main():
    async with ClaudeSDKClient() as client:
        # First question
        await client.query("What's the capital of France?")

        # Process response
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Claude: {block.text}")

        # Follow-up question - Claude remembers the previous context
        await client.query("What's the population of that city?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Claude: {block.text}")

        # Another follow-up - still in the same conversation
        await client.query("What are some famous landmarks there?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Claude: {block.text}")

asyncio.run(main())
```

#### Contoh - Input streaming dengan ClaudeSDKClient

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient

async def message_stream():
    """Generate messages dynamically."""
    yield {"type": "text", "text": "Analyze the following data:"}
    await asyncio.sleep(0.5)
    yield {"type": "text", "text": "Temperature: 25°C"}
    await asyncio.sleep(0.5)
    yield {"type": "text", "text": "Humidity: 60%"}
    await asyncio.sleep(0.5)
    yield {"type": "text", "text": "What patterns do you see?"}

async def main():
    async with ClaudeSDKClient() as client:
        # Stream input to Claude
        await client.query(message_stream())

        # Process response
        async for message in client.receive_response():
            print(message)

        # Follow-up in same session
        await client.query("Should we be concerned about these readings?")

        async for message in client.receive_response():
            print(message)

asyncio.run(main())
```

#### Contoh - Menggunakan interupsi

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions

async def interruptible_task():
    options = ClaudeAgentOptions(
        allowed_tools=["Bash"],
        permission_mode="acceptEdits"
    )

    async with ClaudeSDKClient(options=options) as client:
        # Start a long-running task
        await client.query("Count from 1 to 100 slowly")

        # Let it run for a bit
        await asyncio.sleep(2)

        # Interrupt the task
        await client.interrupt()
        print("Task interrupted!")

        # Send a new command
        await client.query("Just say hello instead")

        async for message in client.receive_response():
            # Process the new response
            pass

asyncio.run(interruptible_task())
```

#### Contoh - Kontrol izin lanjutan

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions
)

async def custom_permission_handler(
    tool_name: str,
    input_data: dict,
    context: dict
):
    """Custom logic for tool permissions."""

    # Block writes to system directories
    if tool_name == "Write" and input_data.get("file_path", "").startswith("/system/"):
        return {
            "behavior": "deny",
            "message": "System directory write not allowed",
            "interrupt": True
        }

    # Redirect sensitive file operations
    if tool_name in ["Write", "Edit"] and "config" in input_data.get("file_path", ""):
        safe_path = f"./sandbox/{input_data['file_path']}"
        return {
            "behavior": "allow",
            "updatedInput": {**input_data, "file_path": safe_path}
        }

    # Allow everything else
    return {
        "behavior": "allow",
        "updatedInput": input_data
    }

async def main():
    options = ClaudeAgentOptions(
        can_use_tool=custom_permission_handler,
        allowed_tools=["Read", "Write", "Edit"]
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query("Update the system config file")

        async for message in client.receive_response():
            # Will use sandbox path instead
            print(message)

asyncio.run(main())
```

## Tipe

### `SdkMcpTool`

Definisi untuk alat MCP SDK yang dibuat dengan dekorator `@tool`.

```python
@dataclass
class SdkMcpTool(Generic[T]):
    name: str
    description: str
    input_schema: type[T] | dict[str, Any]
    handler: Callable[[T], Awaitable[dict[str, Any]]]
```

| Properti       | Tipe                                       | Deskripsi                                |
| :------------- | :----------------------------------------- | :----------------------------------------- |
| `name`         | `str`                                      | Pengenal unik untuk alat             |
| `description`  | `str`                                      | Deskripsi yang dapat dibaca manusia                 |
| `input_schema` | `type[T] \| dict[str, Any]`                | Skema untuk validasi input                |
| `handler`      | `Callable[[T], Awaitable[dict[str, Any]]]` | Fungsi async yang menangani eksekusi alat |

### `ClaudeAgentOptions`

Dataclass konfigurasi untuk kueri Claude Code.

```python
@dataclass
class ClaudeAgentOptions:
    allowed_tools: list[str] = field(default_factory=list)
    system_prompt: str | SystemPromptPreset | None = None
    mcp_servers: dict[str, McpServerConfig] | str | Path = field(default_factory=dict)
    permission_mode: PermissionMode | None = None
    continue_conversation: bool = False
    resume: str | None = None
    max_turns: int | None = None
    disallowed_tools: list[str] = field(default_factory=list)
    model: str | None = None
    output_format: OutputFormat | None = None
    permission_prompt_tool_name: str | None = None
    cwd: str | Path | None = None
    settings: str | None = None
    add_dirs: list[str | Path] = field(default_factory=list)
    env: dict[str, str] = field(default_factory=dict)
    extra_args: dict[str, str | None] = field(default_factory=dict)
    max_buffer_size: int | None = None
    debug_stderr: Any = sys.stderr  # Deprecated
    stderr: Callable[[str], None] | None = None
    can_use_tool: CanUseTool | None = None
    hooks: dict[HookEvent, list[HookMatcher]] | None = None
    user: str | None = None
    include_partial_messages: bool = False
    fork_session: bool = False
    agents: dict[str, AgentDefinition] | None = None
    setting_sources: list[SettingSource] | None = None
```

| Properti                      | Tipe                                         | Default              | Deskripsi                                                                                                                                                                             |
| :---------------------------- | :------------------------------------------- | :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowed_tools`               | `list[str]`                                  | `[]`                 | Daftar nama alat yang diizinkan                                                                                                                                                              |
| `system_prompt`               | `str \| SystemPromptPreset \| None`          | `None`               | Konfigurasi prompt sistem. Lewatkan string untuk prompt kustom, atau gunakan `{"type": "preset", "preset": "claude_code"}` untuk prompt sistem Claude Code. Tambahkan `"append"` untuk memperluas preset |
| `mcp_servers`                 | `dict[str, McpServerConfig] \| str \| Path`  | `{}`                 | Konfigurasi server MCP atau jalur ke file konfigurasi                                                                                                                                        |
| `permission_mode`             | `PermissionMode \| None`                     | `None`               | Mode izin untuk penggunaan alat                                                                                                                                                          |
| `continue_conversation`       | `bool`                                       | `False`              | Lanjutkan percakapan paling baru                                                                                                                                                                   |
| `resume`                      | `str \| None`                                | `None`               | ID sesi untuk dilanjutkan                                                                                                                                                                    |
| `max_turns`                   | `int \| None`                                | `None`               | Jumlah maksimum putaran percakapan                                                                                                                                                              |
| `disallowed_tools`            | `list[str]`                                  | `[]`                 | Daftar nama alat yang tidak diizinkan                                                                                                                                                           |
| `model`                       | `str \| None`                                | `None`               | Model Claude yang akan digunakan                                                                                                                                                                     |
| `output_format`               | [`OutputFormat`](#outputformat) ` \| None`   | `None`               | Tentukan format output untuk hasil agen. Lihat [Structured outputs](/docs/id/agent-sdk/structured-outputs) untuk detail                                                                    |
| `permission_prompt_tool_name` | `str \| None`                                | `None`               | Nama alat MCP untuk prompt izin                                                                                                                                                        |
| `cwd`                         | `str \| Path \| None`                        | `None`               | Direktori kerja saat ini                                                                                                                                                               |
| `settings`                    | `str \| None`                                | `None`               | Jalur ke file pengaturan                                                                                                                                                                   |
| `add_dirs`                    | `list[str \| Path]`                          | `[]`                 | Direktori tambahan yang dapat diakses Claude                                                                                                                                                |
| `env`                         | `dict[str, str]`                             | `{}`                 | Variabel lingkungan                                                                                                                                                                   |
| `extra_args`                  | `dict[str, str \| None]`                     | `{}`                 | Argumen CLI tambahan untuk diteruskan langsung ke CLI                                                                                                                                    |
| `max_buffer_size`             | `int \| None`                                | `None`               | Jumlah byte maksimum saat membuffer stdout CLI                                                                                                                                                 |
| `debug_stderr`                | `Any`                                        | `sys.stderr`         | _Deprecated_ - Objek seperti file untuk output debug. Gunakan callback `stderr` sebagai gantinya                                                                                                         |
| `stderr`                      | `Callable[[str], None] \| None`              | `None`               | Fungsi callback untuk output stderr dari CLI                                                                                                                                            |
| `can_use_tool`                | `CanUseTool \| None`                         | `None`               | Fungsi callback izin alat                                                                                                                                                       |
| `hooks`                       | `dict[HookEvent, list[HookMatcher]] \| None` | `None`               | Konfigurasi hook untuk mengintersepsi acara                                                                                                                                             |
| `user`                        | `str \| None`                                | `None`               | Pengenal pengguna                                                                                                                                                                         |
| `include_partial_messages`    | `bool`                                       | `False`              | Sertakan acara streaming pesan parsial                                                                                                                                                |
| `fork_session`                | `bool`                                       | `False`              | Saat melanjutkan dengan `resume`, fork ke ID sesi baru alih-alih melanjutkan sesi asli                                                                                        |
| `agents`                      | `dict[str, AgentDefinition] \| None`         | `None`               | Subagen yang didefinisikan secara terprogram                                                                                                                                      |
| `plugins`                     | `list[SdkPluginConfig]`                      | `[]`                 | Muat plugin kustom dari jalur lokal. Lihat [Plugins](/docs/id/agent-sdk/plugins) untuk detail                                                                                             |
| `sandbox`                     | [`SandboxSettings`](#sandboxsettings) ` \| None` | `None`              | Konfigurasi perilaku sandbox secara terprogram. Lihat [Sandbox settings](#sandboxsettings) untuk detail                                        |
| `setting_sources`             | `list[SettingSource] \| None`                | `None` (no settings) | Kontrol pengaturan sistem file mana yang akan dimuat. Saat dihilangkan, tidak ada pengaturan yang dimuat. **Catatan:** Harus menyertakan `"project"` untuk memuat file CLAUDE.md                                             |

### `OutputFormat`

Konfigurasi untuk validasi output terstruktur.

```python
class OutputFormat(TypedDict):
    type: Literal["json_schema"]
    schema: dict[str, Any]
```

| Bidang   | Diperlukan | Deskripsi                                    |
| :------- | :------- | :--------------------------------------------- |
| `type`   | Ya      | Harus `"json_schema"` untuk validasi JSON Schema |
| `schema` | Ya      | Definisi JSON Schema untuk validasi output   |

### `SystemPromptPreset`

Konfigurasi untuk menggunakan prompt sistem preset Claude Code dengan penambahan opsional.

```python
class SystemPromptPreset(TypedDict):
    type: Literal["preset"]
    preset: Literal["claude_code"]
    append: NotRequired[str]
```

| Bidang   | Diperlukan | Deskripsi                                                   |
| :------- | :------- | :------------------------------------------------------------ |
| `type`   | Ya      | Harus `"preset"` untuk menggunakan prompt sistem preset              |
| `preset` | Ya      | Harus `"claude_code"` untuk menggunakan prompt sistem Claude Code    |
| `append` | Tidak       | Instruksi tambahan untuk ditambahkan ke prompt sistem preset |

### `SettingSource`

Mengontrol sumber konfigurasi berbasis sistem file mana yang dimuat pengaturan SDK.

```python
SettingSource = Literal["user", "project", "local"]
```

| Nilai       | Deskripsi                                  | Lokasi                      |
| :---------- | :------------------------------------------- | :---------------------------- |
| `"user"`    | Pengaturan pengguna global                         | `~/.claude/settings.json`     |
| `"project"` | Pengaturan proyek bersama (dikontrol versi) | `.claude/settings.json`       |
| `"local"`   | Pengaturan proyek lokal (gitignored)          | `.claude/settings.local.json` |

#### Perilaku default

Ketika `setting_sources` **dihilangkan** atau **`None`**, SDK **tidak** memuat pengaturan sistem file apa pun. Ini memberikan isolasi untuk aplikasi SDK.

#### Mengapa menggunakan setting_sources?

**Muat semua pengaturan sistem file (perilaku warisan):**

```python
# Load all settings like SDK v0.0.x did
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Analyze this code",
    options=ClaudeAgentOptions(
        setting_sources=["user", "project", "local"]  # Load all settings
    )
):
    print(message)
```

**Muat hanya sumber pengaturan tertentu:**

```python
# Load only project settings, ignore user and local
async for message in query(
    prompt="Run CI checks",
    options=ClaudeAgentOptions(
        setting_sources=["project"]  # Only .claude/settings.json
    )
):
    print(message)
```

**Lingkungan pengujian dan CI:**

```python
# Ensure consistent behavior in CI by excluding local settings
async for message in query(
    prompt="Run tests",
    options=ClaudeAgentOptions(
        setting_sources=["project"],  # Only team-shared settings
        permission_mode="bypassPermissions"
    )
):
    print(message)
```

**Aplikasi hanya SDK:**

```python
# Define everything programmatically (default behavior)
# No filesystem dependencies - setting_sources defaults to None
async for message in query(
    prompt="Review this PR",
    options=ClaudeAgentOptions(
        # setting_sources=None is the default, no need to specify
        agents={ /* ... */ },
        mcp_servers={ /* ... */ },
        allowed_tools=["Read", "Grep", "Glob"]
    )
):
    print(message)
```

**Memuat instruksi proyek CLAUDE.md:**

```python
# Load project settings to include CLAUDE.md files
async for message in query(
    prompt="Add a new feature following project conventions",
    options=ClaudeAgentOptions(
        system_prompt={
            "type": "preset",
            "preset": "claude_code"  # Use Claude Code's system prompt
        },
        setting_sources=["project"],  # Required to load CLAUDE.md from project
        allowed_tools=["Read", "Write", "Edit"]
    )
):
    print(message)
```

#### Preseden pengaturan

Ketika beberapa sumber dimuat, pengaturan digabungkan dengan preseden ini (tertinggi ke terendah):

1. Pengaturan lokal (`.claude/settings.local.json`)
2. Pengaturan proyek (`.claude/settings.json`)
3. Pengaturan pengguna (`~/.claude/settings.json`)

Opsi terprogram (seperti `agents`, `allowed_tools`) selalu menimpa pengaturan sistem file.

### `AgentDefinition`

Konfigurasi untuk subagen yang didefinisikan secara terprogram.

```python
@dataclass
class AgentDefinition:
    description: str
    prompt: str
    tools: list[str] | None = None
    model: Literal["sonnet", "opus", "haiku", "inherit"] | None = None
```

| Bidang         | Diperlukan | Deskripsi                                                    |
| :------------ | :------- | :------------------------------------------------------------- |
| `description` | Ya      | Deskripsi bahasa alami tentang kapan menggunakan agen ini         |
| `tools`       | Tidak       | Larik nama alat yang diizinkan. Jika dihilangkan, mewarisi semua alat    |
| `prompt`      | Ya      | Prompt sistem agen                                      |
| `model`       | Tidak       | Penggantian model untuk agen ini. Jika dihilangkan, menggunakan model utama |

### `PermissionMode`

Mode izin untuk mengontrol eksekusi alat.

```python
PermissionMode = Literal[
    "default",           # Standard permission behavior
    "acceptEdits",       # Auto-accept file edits
    "plan",              # Planning mode - no execution
    "bypassPermissions"  # Bypass all permission checks (use with caution)
]
```

### `McpSdkServerConfig`

Konfigurasi untuk server MCP SDK yang dibuat dengan `create_sdk_mcp_server()`.

```python
class McpSdkServerConfig(TypedDict):
    type: Literal["sdk"]
    name: str
    instance: Any  # MCP Server instance
```

### `McpServerConfig`

Tipe union untuk konfigurasi server MCP.

```python
McpServerConfig = McpStdioServerConfig | McpSSEServerConfig | McpHttpServerConfig | McpSdkServerConfig
```

#### `McpStdioServerConfig`

```python
class McpStdioServerConfig(TypedDict):
    type: NotRequired[Literal["stdio"]]  # Optional for backwards compatibility
    command: str
    args: NotRequired[list[str]]
    env: NotRequired[dict[str, str]]
```

#### `McpSSEServerConfig`

```python
class McpSSEServerConfig(TypedDict):
    type: Literal["sse"]
    url: str
    headers: NotRequired[dict[str, str]]
```

#### `McpHttpServerConfig`

```python
class McpHttpServerConfig(TypedDict):
    type: Literal["http"]
    url: str
    headers: NotRequired[dict[str, str]]
```

### `SdkPluginConfig`

Konfigurasi untuk memuat plugin dalam SDK.

```python
class SdkPluginConfig(TypedDict):
    type: Literal["local"]
    path: str
```

| Bidang | Tipe | Deskripsi |
|:------|:-----|:------------|
| `type` | `Literal["local"]` | Harus `"local"` (hanya plugin lokal yang didukung saat ini) |
| `path` | `str` | Jalur absolut atau relatif ke direktori plugin |

**Contoh:**
```python
plugins=[
    {"type": "local", "path": "./my-plugin"},
    {"type": "local", "path": "/absolute/path/to/plugin"}
]
```

Untuk informasi lengkap tentang membuat dan menggunakan plugin, lihat [Plugins](/docs/id/agent-sdk/plugins).

## Tipe Pesan

### `Message`

Tipe union dari semua pesan yang mungkin.

```python
Message = UserMessage | AssistantMessage | SystemMessage | ResultMessage
```

### `UserMessage`

Pesan input pengguna.

```python
@dataclass
class UserMessage:
    content: str | list[ContentBlock]
```

### `AssistantMessage`

Pesan respons asisten dengan blok konten.

```python
@dataclass
class AssistantMessage:
    content: list[ContentBlock]
    model: str
```

### `SystemMessage`

Pesan sistem dengan metadata.

```python
@dataclass
class SystemMessage:
    subtype: str
    data: dict[str, Any]
```

### `ResultMessage`

Pesan hasil akhir dengan informasi biaya dan penggunaan.

```python
@dataclass
class ResultMessage:
    subtype: str
    duration_ms: int
    duration_api_ms: int
    is_error: bool
    num_turns: int
    session_id: str
    total_cost_usd: float | None = None
    usage: dict[str, Any] | None = None
    result: str | None = None
```

## Tipe Blok Konten

### `ContentBlock`

Tipe union dari semua blok konten.

```python
ContentBlock = TextBlock | ThinkingBlock | ToolUseBlock | ToolResultBlock
```

### `TextBlock`

Blok konten teks.

```python
@dataclass
class TextBlock:
    text: str
```

### `ThinkingBlock`

Blok konten pemikiran (untuk model dengan kemampuan pemikiran).

```python
@dataclass
class ThinkingBlock:
    thinking: str
    signature: str
```

### `ToolUseBlock`

Blok permintaan penggunaan alat.

```python
@dataclass
class ToolUseBlock:
    id: str
    name: str
    input: dict[str, Any]
```

### `ToolResultBlock`

Blok hasil eksekusi alat.

```python
@dataclass
class ToolResultBlock:
    tool_use_id: str
    content: str | list[dict[str, Any]] | None = None
    is_error: bool | None = None
```

## Jenis Kesalahan

### `ClaudeSDKError`

Kelas pengecualian dasar untuk semua kesalahan SDK.

```python
class ClaudeSDKError(Exception):
    """Base error for Claude SDK."""
```

### `CLINotFoundError`

Dimunculkan ketika Claude Code CLI tidak diinstal atau tidak ditemukan.

```python
class CLINotFoundError(CLIConnectionError):
    def __init__(self, message: str = "Claude Code not found", cli_path: str | None = None):
        """
        Args:
            message: Error message (default: "Claude Code not found")
            cli_path: Optional path to the CLI that was not found
        """
```

### `CLIConnectionError`

Dimunculkan ketika koneksi ke Claude Code gagal.

```python
class CLIConnectionError(ClaudeSDKError):
    """Failed to connect to Claude Code."""
```

### `ProcessError`

Dimunculkan ketika proses Claude Code gagal.

```python
class ProcessError(ClaudeSDKError):
    def __init__(self, message: str, exit_code: int | None = None, stderr: str | None = None):
        self.exit_code = exit_code
        self.stderr = stderr
```

### `CLIJSONDecodeError`

Dimunculkan ketika penguraian JSON gagal.

```python
class CLIJSONDecodeError(ClaudeSDKError):
    def __init__(self, line: str, original_error: Exception):
        """
        Args:
            line: The line that failed to parse
            original_error: The original JSON decode exception
        """
        self.line = line
        self.original_error = original_error
```

## Jenis Hook

Untuk panduan komprehensif tentang penggunaan hook dengan contoh dan pola umum, lihat [panduan Hook](/docs/id/agent-sdk/hooks).

### `HookEvent`

Jenis peristiwa hook yang didukung. Perhatikan bahwa karena keterbatasan penyiapan, Python SDK tidak mendukung hook SessionStart, SessionEnd, dan Notification.

```python
HookEvent = Literal[
    "PreToolUse",      # Called before tool execution
    "PostToolUse",     # Called after tool execution
    "UserPromptSubmit", # Called when user submits a prompt
    "Stop",            # Called when stopping execution
    "SubagentStop",    # Called when a subagent stops
    "PreCompact"       # Called before message compaction
]
```

### `HookCallback`

Definisi tipe untuk fungsi callback hook.

```python
HookCallback = Callable[
    [dict[str, Any], str | None, HookContext],
    Awaitable[dict[str, Any]]
]
```

Parameter:

- `input_data`: Data input spesifik hook (lihat [panduan Hook](/docs/id/agent-sdk/hooks#input-data))
- `tool_use_id`: Pengidentifikasi penggunaan alat opsional (untuk hook terkait alat)
- `context`: Konteks hook dengan informasi tambahan

Mengembalikan kamus yang mungkin berisi:

- `decision`: `"block"` untuk memblokir tindakan
- `systemMessage`: Pesan sistem untuk ditambahkan ke transkrip
- `hookSpecificOutput`: Data output spesifik hook

### `HookContext`

Informasi konteks yang diteruskan ke callback hook.

```python
@dataclass
class HookContext:
    signal: Any | None = None  # Future: abort signal support
```

### `HookMatcher`

Konfigurasi untuk mencocokkan hook ke peristiwa atau alat tertentu.

```python
@dataclass
class HookMatcher:
    matcher: str | None = None        # Tool name or pattern to match (e.g., "Bash", "Write|Edit")
    hooks: list[HookCallback] = field(default_factory=list)  # List of callbacks to execute
    timeout: float | None = None        # Timeout in seconds for all hooks in this matcher (default: 60)
```

### Contoh Penggunaan Hook

Contoh ini mendaftarkan dua hook: satu yang memblokir perintah bash berbahaya seperti `rm -rf /`, dan yang lain yang mencatat semua penggunaan alat untuk audit. Hook keamanan hanya berjalan pada perintah Bash (melalui `matcher`), sementara hook logging berjalan pada semua alat.

```python
from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher, HookContext
from typing import Any

async def validate_bash_command(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Validate and potentially block dangerous bash commands."""
    if input_data['tool_name'] == 'Bash':
        command = input_data['tool_input'].get('command', '')
        if 'rm -rf /' in command:
            return {
                'hookSpecificOutput': {
                    'hookEventName': 'PreToolUse',
                    'permissionDecision': 'deny',
                    'permissionDecisionReason': 'Dangerous command blocked'
                }
            }
    return {}

async def log_tool_use(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Log all tool usage for auditing."""
    print(f"Tool used: {input_data.get('tool_name')}")
    return {}

options = ClaudeAgentOptions(
    hooks={
        'PreToolUse': [
            HookMatcher(matcher='Bash', hooks=[validate_bash_command], timeout=120),  # 2 min for validation
            HookMatcher(hooks=[log_tool_use])  # Applies to all tools (default 60s timeout)
        ],
        'PostToolUse': [
            HookMatcher(hooks=[log_tool_use])
        ]
    }
)

async for message in query(
    prompt="Analyze this codebase",
    options=options
):
    print(message)
```

## Jenis Input/Output Alat

Dokumentasi skema input/output untuk semua alat Claude Code bawaan. Meskipun Python SDK tidak mengekspor ini sebagai tipe, mereka mewakili struktur input dan output alat dalam pesan.

### Task

**Nama alat:** `Task`

**Input:**

```python
{
    "description": str,      # A short (3-5 word) description of the task
    "prompt": str,           # The task for the agent to perform
    "subagent_type": str     # The type of specialized agent to use
}
```

**Output:**

```python
{
    "result": str,                    # Final result from the subagent
    "usage": dict | None,             # Token usage statistics
    "total_cost_usd": float | None,  # Total cost in USD
    "duration_ms": int | None         # Execution duration in milliseconds
}
```

### Bash

**Nama alat:** `Bash`

**Input:**

```python
{
    "command": str,                  # The command to execute
    "timeout": int | None,           # Optional timeout in milliseconds (max 600000)
    "description": str | None,       # Clear, concise description (5-10 words)
    "run_in_background": bool | None # Set to true to run in background
}
```

**Output:**

```python
{
    "output": str,              # Combined stdout and stderr output
    "exitCode": int,            # Exit code of the command
    "killed": bool | None,      # Whether command was killed due to timeout
    "shellId": str | None       # Shell ID for background processes
}
```

### Edit

**Nama alat:** `Edit`

**Input:**

```python
{
    "file_path": str,           # The absolute path to the file to modify
    "old_string": str,          # The text to replace
    "new_string": str,          # The text to replace it with
    "replace_all": bool | None  # Replace all occurrences (default False)
}
```

**Output:**

```python
{
    "message": str,      # Confirmation message
    "replacements": int, # Number of replacements made
    "file_path": str     # File path that was edited
}
```

### Read

**Nama alat:** `Read`

**Input:**

```python
{
    "file_path": str,       # The absolute path to the file to read
    "offset": int | None,   # The line number to start reading from
    "limit": int | None     # The number of lines to read
}
```

**Output (File teks):**

```python
{
    "content": str,         # File contents with line numbers
    "total_lines": int,     # Total number of lines in file
    "lines_returned": int   # Lines actually returned
}
```

**Output (Gambar):**

```python
{
    "image": str,       # Base64 encoded image data
    "mime_type": str,   # Image MIME type
    "file_size": int    # File size in bytes
}
```

### Write

**Nama alat:** `Write`

**Input:**

```python
{
    "file_path": str,  # The absolute path to the file to write
    "content": str     # The content to write to the file
}
```

**Output:**

```python
{
    "message": str,        # Success message
    "bytes_written": int,  # Number of bytes written
    "file_path": str       # File path that was written
}
```

### Glob

**Nama alat:** `Glob`

**Input:**

```python
{
    "pattern": str,       # The glob pattern to match files against
    "path": str | None    # The directory to search in (defaults to cwd)
}
```

**Output:**

```python
{
    "matches": list[str],  # Array of matching file paths
    "count": int,          # Number of matches found
    "search_path": str     # Search directory used
}
```

### Grep

**Nama alat:** `Grep`

**Input:**

```python
{
    "pattern": str,                    # The regular expression pattern
    "path": str | None,                # File or directory to search in
    "glob": str | None,                # Glob pattern to filter files
    "type": str | None,                # File type to search
    "output_mode": str | None,         # "content", "files_with_matches", or "count"
    "-i": bool | None,                 # Case insensitive search
    "-n": bool | None,                 # Show line numbers
    "-B": int | None,                  # Lines to show before each match
    "-A": int | None,                  # Lines to show after each match
    "-C": int | None,                  # Lines to show before and after
    "head_limit": int | None,          # Limit output to first N lines/entries
    "multiline": bool | None           # Enable multiline mode
}
```

**Output (mode konten):**

```python
{
    "matches": [
        {
            "file": str,
            "line_number": int | None,
            "line": str,
            "before_context": list[str] | None,
            "after_context": list[str] | None
        }
    ],
    "total_matches": int
}
```

**Output (mode files_with_matches):**

```python
{
    "files": list[str],  # Files containing matches
    "count": int         # Number of files with matches
}
```

### NotebookEdit

**Nama alat:** `NotebookEdit`

**Input:**

```python
{
    "notebook_path": str,                     # Absolute path to the Jupyter notebook
    "cell_id": str | None,                    # The ID of the cell to edit
    "new_source": str,                        # The new source for the cell
    "cell_type": "code" | "markdown" | None,  # The type of the cell
    "edit_mode": "replace" | "insert" | "delete" | None  # Edit operation type
}
```

**Output:**

```python
{
    "message": str,                              # Success message
    "edit_type": "replaced" | "inserted" | "deleted",  # Type of edit performed
    "cell_id": str | None,                       # Cell ID that was affected
    "total_cells": int                           # Total cells in notebook after edit
}
```

### WebFetch

**Nama alat:** `WebFetch`

**Input:**

```python
{
    "url": str,     # The URL to fetch content from
    "prompt": str   # The prompt to run on the fetched content
}
```

**Output:**

```python
{
    "response": str,           # AI model's response to the prompt
    "url": str,                # URL that was fetched
    "final_url": str | None,   # Final URL after redirects
    "status_code": int | None  # HTTP status code
}
```

### WebSearch

**Nama alat:** `WebSearch`

**Input:**

```python
{
    "query": str,                        # The search query to use
    "allowed_domains": list[str] | None, # Only include results from these domains
    "blocked_domains": list[str] | None  # Never include results from these domains
}
```

**Output:**

```python
{
    "results": [
        {
            "title": str,
            "url": str,
            "snippet": str,
            "metadata": dict | None
        }
    ],
    "total_results": int,
    "query": str
}
```

### TodoWrite

**Nama alat:** `TodoWrite`

**Input:**

```python
{
    "todos": [
        {
            "content": str,                              # The task description
            "status": "pending" | "in_progress" | "completed",  # Task status
            "activeForm": str                            # Active form of the description
        }
    ]
}
```

**Output:**

```python
{
    "message": str,  # Success message
    "stats": {
        "total": int,
        "pending": int,
        "in_progress": int,
        "completed": int
    }
}
```

### BashOutput

**Nama alat:** `BashOutput`

**Input:**

```python
{
    "bash_id": str,       # The ID of the background shell
    "filter": str | None  # Optional regex to filter output lines
}
```

**Output:**

```python
{
    "output": str,                                      # New output since last check
    "status": "running" | "completed" | "failed",       # Current shell status
    "exitCode": int | None                              # Exit code when completed
}
```

### KillBash

**Nama alat:** `KillBash`

**Input:**

```python
{
    "shell_id": str  # The ID of the background shell to kill
}
```

**Output:**

```python
{
    "message": str,  # Success message
    "shell_id": str  # ID of the killed shell
}
```

### ExitPlanMode

**Nama alat:** `ExitPlanMode`

**Input:**

```python
{
    "plan": str  # The plan to run by the user for approval
}
```

**Output:**

```python
{
    "message": str,          # Confirmation message
    "approved": bool | None  # Whether user approved the plan
}
```

### ListMcpResources

**Nama alat:** `ListMcpResources`

**Input:**

```python
{
    "server": str | None  # Optional server name to filter resources by
}
```

**Output:**

```python
{
    "resources": [
        {
            "uri": str,
            "name": str,
            "description": str | None,
            "mimeType": str | None,
            "server": str
        }
    ],
    "total": int
}
```

### ReadMcpResource

**Nama alat:** `ReadMcpResource`

**Input:**

```python
{
    "server": str,  # The MCP server name
    "uri": str      # The resource URI to read
}
```

**Output:**

```python
{
    "contents": [
        {
            "uri": str,
            "mimeType": str | None,
            "text": str | None,
            "blob": str | None
        }
    ],
    "server": str
}
```

## Fitur Lanjutan dengan ClaudeSDKClient

### Membangun Antarmuka Percakapan Berkelanjutan

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, AssistantMessage, TextBlock
import asyncio

class ConversationSession:
    """Maintains a single conversation session with Claude."""

    def __init__(self, options: ClaudeAgentOptions = None):
        self.client = ClaudeSDKClient(options)
        self.turn_count = 0

    async def start(self):
        await self.client.connect()
        print("Starting conversation session. Claude will remember context.")
        print("Commands: 'exit' to quit, 'interrupt' to stop current task, 'new' for new session")

        while True:
            user_input = input(f"\n[Turn {self.turn_count + 1}] You: ")

            if user_input.lower() == 'exit':
                break
            elif user_input.lower() == 'interrupt':
                await self.client.interrupt()
                print("Task interrupted!")
                continue
            elif user_input.lower() == 'new':
                # Disconnect and reconnect for a fresh session
                await self.client.disconnect()
                await self.client.connect()
                self.turn_count = 0
                print("Started new conversation session (previous context cleared)")
                continue

            # Send message - Claude remembers all previous messages in this session
            await self.client.query(user_input)
            self.turn_count += 1

            # Process response
            print(f"[Turn {self.turn_count}] Claude: ", end="")
            async for message in self.client.receive_response():
                if isinstance(message, AssistantMessage):
                    for block in message.content:
                        if isinstance(block, TextBlock):
                            print(block.text, end="")
            print()  # New line after response

        await self.client.disconnect()
        print(f"Conversation ended after {self.turn_count} turns.")

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Bash"],
        permission_mode="acceptEdits"
    )
    session = ConversationSession(options)
    await session.start()

# Example conversation:
# Turn 1 - You: "Create a file called hello.py"
# Turn 1 - Claude: "I'll create a hello.py file for you..."
# Turn 2 - You: "What's in that file?"
# Turn 2 - Claude: "The hello.py file I just created contains..." (remembers!)
# Turn 3 - You: "Add a main function to it"
# Turn 3 - Claude: "I'll add a main function to hello.py..." (knows which file!)

asyncio.run(main())
```

### Menggunakan Hook untuk Modifikasi Perilaku

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions,
    HookMatcher,
    HookContext
)
import asyncio
from typing import Any

async def pre_tool_logger(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Log all tool usage before execution."""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[PRE-TOOL] About to use: {tool_name}")

    # You can modify or block the tool execution here
    if tool_name == "Bash" and "rm -rf" in str(input_data.get('tool_input', {})):
        return {
            'hookSpecificOutput': {
                'hookEventName': 'PreToolUse',
                'permissionDecision': 'deny',
                'permissionDecisionReason': 'Dangerous command blocked'
            }
        }
    return {}

async def post_tool_logger(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Log results after tool execution."""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[POST-TOOL] Completed: {tool_name}")
    return {}

async def user_prompt_modifier(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Add context to user prompts."""
    original_prompt = input_data.get('prompt', '')

    # Add timestamp to all prompts
    from datetime import datetime
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return {
        'hookSpecificOutput': {
            'hookEventName': 'UserPromptSubmit',
            'updatedPrompt': f"[{timestamp}] {original_prompt}"
        }
    }

async def main():
    options = ClaudeAgentOptions(
        hooks={
            'PreToolUse': [
                HookMatcher(hooks=[pre_tool_logger]),
                HookMatcher(matcher='Bash', hooks=[pre_tool_logger])
            ],
            'PostToolUse': [
                HookMatcher(hooks=[post_tool_logger])
            ],
            'UserPromptSubmit': [
                HookMatcher(hooks=[user_prompt_modifier])
            ]
        },
        allowed_tools=["Read", "Write", "Bash"]
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query("List files in current directory")

        async for message in client.receive_response():
            # Hooks will automatically log tool usage
            pass

asyncio.run(main())
```

### Pemantauan Kemajuan Real-time

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions,
    AssistantMessage,
    ToolUseBlock,
    ToolResultBlock,
    TextBlock
)
import asyncio

async def monitor_progress():
    options = ClaudeAgentOptions(
        allowed_tools=["Write", "Bash"],
        permission_mode="acceptEdits"
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query(
            "Create 5 Python files with different sorting algorithms"
        )

        # Monitor progress in real-time
        files_created = []
        async for message in client.receive_messages():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, ToolUseBlock):
                        if block.name == "Write":
                            file_path = block.input.get("file_path", "")
                            print(f"🔨 Creating: {file_path}")
                    elif isinstance(block, ToolResultBlock):
                        print(f"✅ Completed tool execution")
                    elif isinstance(block, TextBlock):
                        print(f"💭 Claude says: {block.text[:100]}...")

            # Check if we've received the final result
            if hasattr(message, 'subtype') and message.subtype in ['success', 'error']:
                print(f"\n🎯 Task completed!")
                break

asyncio.run(monitor_progress())
```

## Contoh Penggunaan

### Operasi file dasar (menggunakan query)

```python
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ToolUseBlock
import asyncio

async def create_project():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Bash"],
        permission_mode='acceptEdits',
        cwd="/home/user/project"
    )

    async for message in query(
        prompt="Create a Python project structure with setup.py",
        options=options
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, ToolUseBlock):
                    print(f"Using tool: {block.name}")

asyncio.run(create_project())
```

### Penanganan kesalahan

```python
from claude_agent_sdk import (
    query,
    CLINotFoundError,
    ProcessError,
    CLIJSONDecodeError
)

try:
    async for message in query(prompt="Hello"):
        print(message)
except CLINotFoundError:
    print("Please install Claude Code: npm install -g @anthropic-ai/claude-code")
except ProcessError as e:
    print(f"Process failed with exit code: {e.exit_code}")
except CLIJSONDecodeError as e:
    print(f"Failed to parse response: {e}")
```

### Mode streaming dengan klien

```python
from claude_agent_sdk import ClaudeSDKClient
import asyncio

async def interactive_session():
    async with ClaudeSDKClient() as client:
        # Send initial message
        await client.query("What's the weather like?")

        # Process responses
        async for msg in client.receive_response():
            print(msg)

        # Send follow-up
        await client.query("Tell me more about that")

        # Process follow-up response
        async for msg in client.receive_response():
            print(msg)

asyncio.run(interactive_session())
```

### Menggunakan alat kustom dengan ClaudeSDKClient

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions,
    tool,
    create_sdk_mcp_server,
    AssistantMessage,
    TextBlock
)
import asyncio
from typing import Any

# Define custom tools with @tool decorator
@tool("calculate", "Perform mathematical calculations", {"expression": str})
async def calculate(args: dict[str, Any]) -> dict[str, Any]:
    try:
        result = eval(args["expression"], {"__builtins__": {}})
        return {
            "content": [{
                "type": "text",
                "text": f"Result: {result}"
            }]
        }
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": f"Error: {str(e)}"
            }],
            "is_error": True
        }

@tool("get_time", "Get current time", {})
async def get_time(args: dict[str, Any]) -> dict[str, Any]:
    from datetime import datetime
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {
        "content": [{
            "type": "text",
            "text": f"Current time: {current_time}"
        }]
    }

async def main():
    # Create SDK MCP server with custom tools
    my_server = create_sdk_mcp_server(
        name="utilities",
        version="1.0.0",
        tools=[calculate, get_time]
    )

    # Configure options with the server
    options = ClaudeAgentOptions(
        mcp_servers={"utils": my_server},
        allowed_tools=[
            "mcp__utils__calculate",
            "mcp__utils__get_time"
        ]
    )

    # Use ClaudeSDKClient for interactive tool usage
    async with ClaudeSDKClient(options=options) as client:
        await client.query("What's 123 * 456?")

        # Process calculation response
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Calculation: {block.text}")

        # Follow up with time query
        await client.query("What time is it now?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Time: {block.text}")

asyncio.run(main())
```

## Konfigurasi Sandbox

### `SandboxSettings`

Konfigurasi untuk perilaku sandbox. Gunakan ini untuk mengaktifkan sandboxing perintah dan mengonfigurasi pembatasan jaringan secara terprogram.

```python
class SandboxSettings(TypedDict, total=False):
    enabled: bool
    autoAllowBashIfSandboxed: bool
    excludedCommands: list[str]
    allowUnsandboxedCommands: bool
    network: SandboxNetworkConfig
    ignoreViolations: SandboxIgnoreViolations
    enableWeakerNestedSandbox: bool
```

| Properti | Tipe | Default | Deskripsi |
| :------- | :--- | :------ | :---------- |
| `enabled` | `bool` | `False` | Aktifkan mode sandbox untuk eksekusi perintah |
| `autoAllowBashIfSandboxed` | `bool` | `False` | Persetujuan otomatis perintah bash ketika sandbox diaktifkan |
| `excludedCommands` | `list[str]` | `[]` | Perintah yang selalu melewati pembatasan sandbox (misalnya, `["docker"]`). Ini berjalan tanpa sandbox secara otomatis tanpa keterlibatan model |
| `allowUnsandboxedCommands` | `bool` | `False` | Izinkan model untuk meminta menjalankan perintah di luar sandbox. Ketika `True`, model dapat mengatur `dangerouslyDisableSandbox` dalam input alat, yang kembali ke [sistem izin](#permissions-fallback-for-unsandboxed-commands) |
| `network` | [`SandboxNetworkConfig`](#sandboxnetworkconfig) | `None` | Konfigurasi sandbox spesifik jaringan |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `None` | Konfigurasi pelanggaran sandbox mana yang akan diabaikan |
| `enableWeakerNestedSandbox` | `bool` | `False` | Aktifkan sandbox bersarang yang lebih lemah untuk kompatibilitas |

<Note>
**Pembatasan akses sistem file dan jaringan** TIDAK dikonfigurasi melalui pengaturan sandbox. Sebaliknya, mereka berasal dari [aturan izin](https://code.claude.com/docs/en/settings#permission-settings):

- **Pembatasan baca sistem file**: Aturan penolakan baca
- **Pembatasan tulis sistem file**: Aturan izin/penolakan edit
- **Pembatasan jaringan**: Aturan izin/penolakan WebFetch

Gunakan pengaturan sandbox untuk sandboxing eksekusi perintah, dan aturan izin untuk kontrol akses sistem file dan jaringan.
</Note>

#### Contoh penggunaan

```python
from claude_agent_sdk import query, ClaudeAgentOptions, SandboxSettings

sandbox_settings: SandboxSettings = {
    "enabled": True,
    "autoAllowBashIfSandboxed": True,
    "excludedCommands": ["docker"],
    "network": {
        "allowLocalBinding": True,
        "allowUnixSockets": ["/var/run/docker.sock"]
    }
}

async for message in query(
    prompt="Build and test my project",
    options=ClaudeAgentOptions(sandbox=sandbox_settings)
):
    print(message)
```

### `SandboxNetworkConfig`

Konfigurasi spesifik jaringan untuk mode sandbox.

```python
class SandboxNetworkConfig(TypedDict, total=False):
    allowLocalBinding: bool
    allowUnixSockets: list[str]
    allowAllUnixSockets: bool
    httpProxyPort: int
    socksProxyPort: int
```

| Properti | Tipe | Default | Deskripsi |
| :------- | :--- | :------ | :---------- |
| `allowLocalBinding` | `bool` | `False` | Izinkan proses untuk mengikat ke port lokal (misalnya, untuk server dev) |
| `allowUnixSockets` | `list[str]` | `[]` | Jalur soket Unix yang dapat diakses proses (misalnya, soket Docker) |
| `allowAllUnixSockets` | `bool` | `False` | Izinkan akses ke semua soket Unix |
| `httpProxyPort` | `int` | `None` | Port proxy HTTP untuk permintaan jaringan |
| `socksProxyPort` | `int` | `None` | Port proxy SOCKS untuk permintaan jaringan |

### `SandboxIgnoreViolations`

Konfigurasi untuk mengabaikan pelanggaran sandbox tertentu.

```python
class SandboxIgnoreViolations(TypedDict, total=False):
    file: list[str]
    network: list[str]
```

| Properti | Tipe | Default | Deskripsi |
| :------- | :--- | :------ | :---------- |
| `file` | `list[str]` | `[]` | Pola jalur file untuk mengabaikan pelanggaran |
| `network` | `list[str]` | `[]` | Pola jaringan untuk mengabaikan pelanggaran |

### Fallback Izin untuk Perintah Tanpa Sandbox

Ketika `allowUnsandboxedCommands` diaktifkan, model dapat meminta untuk menjalankan perintah di luar sandbox dengan mengatur `dangerouslyDisableSandbox: True` dalam input alat. Permintaan ini kembali ke sistem izin yang ada, berarti handler `can_use_tool` Anda akan dipanggil, memungkinkan Anda menerapkan logika otorisasi kustom.

<Note>
**`excludedCommands` vs `allowUnsandboxedCommands`:**
- `excludedCommands`: Daftar statis perintah yang selalu melewati sandbox secara otomatis (misalnya, `["docker"]`). Model tidak memiliki kontrol atas ini.
- `allowUnsandboxedCommands`: Memungkinkan model memutuskan pada waktu runtime apakah akan meminta eksekusi tanpa sandbox dengan mengatur `dangerouslyDisableSandbox: True` dalam input alat.
</Note>

```python
from claude_agent_sdk import query, ClaudeAgentOptions

async def can_use_tool(tool: str, input: dict) -> bool:
    # Check if the model is requesting to bypass the sandbox
    if tool == "Bash" and input.get("dangerouslyDisableSandbox"):
        # The model wants to run this command outside the sandbox
        print(f"Unsandboxed command requested: {input.get('command')}")

        # Return True to allow, False to deny
        return is_command_authorized(input.get("command"))
    return True

async def main():
    async for message in query(
        prompt="Deploy my application",
        options=ClaudeAgentOptions(
            sandbox={
                "enabled": True,
                "allowUnsandboxedCommands": True  # Model can request unsandboxed execution
            },
            permission_mode="default",
            can_use_tool=can_use_tool
        )
    ):
        print(message)
```

Pola ini memungkinkan Anda untuk:

- **Audit permintaan model**: Catat ketika model meminta eksekusi tanpa sandbox
- **Implementasi allowlist**: Hanya izinkan perintah tertentu untuk berjalan tanpa sandbox
- **Tambahkan alur kerja persetujuan**: Memerlukan otorisasi eksplisit untuk operasi istimewa

<Warning>
Perintah yang berjalan dengan `dangerouslyDisableSandbox: True` memiliki akses sistem penuh. Pastikan handler `can_use_tool` Anda memvalidasi permintaan ini dengan hati-hati.
</Warning>

## Lihat juga

- [Panduan Python SDK](/docs/id/agent-sdk/python) - Tutorial dan contoh
- [Ikhtisar SDK](/docs/id/agent-sdk/overview) - Konsep SDK umum
- [Referensi TypeScript SDK](/docs/id/agent-sdk/typescript) - Dokumentasi SDK TypeScript
- [Referensi CLI](https://code.claude.com/docs/en/cli-reference) - Antarmuka baris perintah
- [Alur kerja umum](https://code.claude.com/docs/en/common-workflows) - Panduan langkah demi langkah