# Ringkasan Agent SDK

Bangun agen AI produksi dengan Claude Code sebagai perpustakaan

---

<Note>
Claude Code SDK telah diubah nama menjadi Claude Agent SDK. Jika Anda bermigrasi dari SDK lama, lihat [Panduan Migrasi](/docs/id/agent-sdk/migration-guide).
</Note>

Bangun agen AI yang secara mandiri membaca file, menjalankan perintah, mencari web, mengedit kode, dan banyak lagi. Agent SDK memberi Anda alat yang sama, loop agen, dan manajemen konteks yang mendukung Claude Code, dapat diprogram dalam Python dan TypeScript.

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"])
    ):
        print(message)  # Claude reads the file, finds the bug, edits it

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);  // Claude reads the file, finds the bug, edits it
}
```
</CodeGroup>

Agent SDK mencakup alat bawaan untuk membaca file, menjalankan perintah, dan mengedit kode, sehingga agen Anda dapat mulai bekerja segera tanpa Anda perlu mengimplementasikan eksekusi alat. Selami panduan cepat atau jelajahi agen nyata yang dibangun dengan SDK:

<CardGroup cols={2}>
  <Card title="Panduan Cepat" icon="play" href="/docs/id/agent-sdk/quickstart">
    Bangun agen perbaikan bug dalam hitungan menit
  </Card>
  <Card title="Agen contoh" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    Asisten email, agen penelitian, dan banyak lagi
  </Card>
</CardGroup>

## Kemampuan

Semua yang membuat Claude Code kuat tersedia di SDK:

<Tabs>
  <Tab title="Alat bawaan">
    Agen Anda dapat membaca file, menjalankan perintah, dan mencari basis kode langsung dari kotak. Alat kunci meliputi:

    | Alat | Apa yang dilakukannya |
    |------|--------------|
    | **Read** | Baca file apa pun di direktori kerja |
    | **Write** | Buat file baru |
    | **Edit** | Buat pengeditan presisi ke file yang ada |
    | **Bash** | Jalankan perintah terminal, skrip, operasi git |
    | **Glob** | Temukan file berdasarkan pola (`**/*.ts`, `src/**/*.py`) |
    | **Grep** | Cari konten file dengan regex |
    | **WebSearch** | Cari web untuk informasi terkini |
    | **WebFetch** | Ambil dan parsing konten halaman web |

    Contoh ini membuat agen yang mencari komentar TODO di basis kode Anda:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Find all TODO comments and create a summary",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Find all TODO comments and create a summary",
      options: { allowedTools: ["Read", "Glob", "Grep"] }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

  </Tab>
  <Tab title="Kait">
    Jalankan kode khusus pada titik-titik kunci dalam siklus hidup agen. Kait dapat menjalankan perintah shell atau skrip khusus untuk memvalidasi, mencatat, memblokir, atau mengubah perilaku agen.

    **Kait yang tersedia:** `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`, dan banyak lagi.

    Contoh ini mencatat semua perubahan file ke file audit:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Suggest improvements to utils.py",
            options=ClaudeAgentOptions(
                permission_mode="acceptEdits",
                hooks={
                    "PostToolUse": [{
                        "matcher": "Edit|Write",
                        "hooks": [{"type": "command", "command": "echo \"$(date): file modified\" >> ./audit.log"}]
                    }]
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Suggest improvements to utils.py",
      options: {
        permissionMode: "acceptEdits",
        hooks: {
          PostToolUse: [{
            matcher: "Edit|Write",
            hooks: [{ type: "command", command: "echo \"$(date): file modified\" >> ./audit.log" }]
          }]
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Pelajari lebih lanjut tentang kait →](/docs/id/agent-sdk/hooks)
  </Tab>
  <Tab title="Subagen">
    Ciptakan agen khusus untuk menangani subtask yang terfokus. Agen utama Anda mendelegasikan pekerjaan, dan subagen melaporkan kembali dengan hasil.

    Aktifkan alat `Task` untuk membiarkan Claude menciptakan subagen ketika Claude memutuskan bahwa tugas cukup kompleks untuk mendapat manfaat dari delegasi. Claude secara otomatis menentukan kapan menggunakan subagen berdasarkan kompleksitas tugas.

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Analyze this codebase for security vulnerabilities",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep", "Task"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Analyze this codebase for security vulnerabilities",
      options: {
        allowedTools: ["Read", "Glob", "Grep", "Task"]
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    Anda juga dapat menentukan tipe agen khusus dengan opsi `agents` untuk pola delegasi yang lebih khusus.

    [Pelajari lebih lanjut tentang subagen →](/docs/id/agent-sdk/subagents)
  </Tab>
  <Tab title="MCP">
    Terhubung ke sistem eksternal melalui Model Context Protocol: database, browser, API, dan [ratusan lainnya](https://github.com/modelcontextprotocol/servers).

    Contoh ini menghubungkan [server Playwright MCP](https://github.com/microsoft/playwright-mcp) untuk memberikan agen Anda kemampuan otomasi browser:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Open example.com and describe what you see",
            options=ClaudeAgentOptions(
                mcp_servers={
                    "playwright": {"command": "npx", "args": ["@playwright/mcp@latest"]}
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Open example.com and describe what you see",
      options: {
        mcpServers: {
          playwright: { command: "npx", args: ["@playwright/mcp@latest"] }
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Pelajari lebih lanjut tentang MCP →](/docs/id/agent-sdk/mcp)
  </Tab>
  <Tab title="Izin">
    Kontrol dengan tepat alat mana yang dapat digunakan agen Anda. Izinkan operasi aman, blokir yang berbahaya, atau minta persetujuan untuk tindakan sensitif.

    Contoh ini membuat agen hanya-baca yang dapat menganalisis tetapi tidak memodifikasi kode:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Review this code for best practices",
            options=ClaudeAgentOptions(
                allowed_tools=["Read", "Glob", "Grep"],
                permission_mode="bypassPermissions"
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Review this code for best practices",
      options: {
        allowedTools: ["Read", "Glob", "Grep"],
        permissionMode: "bypassPermissions"
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Pelajari lebih lanjut tentang izin →](/docs/id/agent-sdk/permissions)
  </Tab>
  <Tab title="Sesi">
    Pertahankan konteks di seluruh pertukaran berganda. Claude mengingat file yang dibaca, analisis yang dilakukan, dan riwayat percakapan. Lanjutkan sesi nanti, atau cabangkan untuk menjelajahi pendekatan berbeda.

    Contoh ini menangkap ID sesi dari kueri pertama, kemudian melanjutkan untuk terus dengan konteks penuh:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        session_id = None

        # First query: capture the session ID
        async for message in query(
            prompt="Read the authentication module",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob"])
        ):
            if hasattr(message, 'subtype') and message.subtype == 'init':
                session_id = message.data.get('session_id')

        # Resume with full context from the first query
        async for message in query(
            prompt="Now find all places that call it",  # "it" = auth module
            options=ClaudeAgentOptions(resume=session_id)
        ):
            pass

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    let sessionId: string | undefined;

    // First query: capture the session ID
    for await (const message of query({
      prompt: "Read the authentication module",
      options: { allowedTools: ["Read", "Glob"] }
    })) {
      if (message.type === "system" && message.subtype === "init") {
        sessionId = message.session_id;
      }
    }

    // Resume with full context from the first query
    for await (const message of query({
      prompt: "Now find all places that call it",  // "it" = auth module
      options: { resume: sessionId }
    })) {
      // Process messages...
    }
    ```
    </CodeGroup>

    [Pelajari lebih lanjut tentang sesi →](/docs/id/agent-sdk/sessions)
  </Tab>
</Tabs>

### Fitur Claude Code

SDK juga mendukung konfigurasi berbasis sistem file Claude Code. Untuk menggunakan fitur ini, atur `setting_sources=["project"]` (Python) atau `settingSources: ['project']` (TypeScript) di opsi Anda.

| Fitur | Deskripsi | Lokasi |
|---------|-------------|----------|
| [Keterampilan](/docs/id/agent-sdk/skills) | Kemampuan khusus yang ditentukan dalam Markdown | `.claude/skills/SKILL.md` |
| [Perintah garis miring](/docs/id/agent-sdk/slash-commands) | Perintah khusus untuk tugas umum | `.claude/commands/*.md` |
| [Memori](/docs/id/agent-sdk/modifying-system-prompts) | Konteks proyek dan instruksi | `CLAUDE.md` atau `.claude/CLAUDE.md` |
| [Plugin](/docs/id/agent-sdk/plugins) | Perluas dengan perintah khusus, agen, dan server MCP | Programatik melalui opsi `plugins` |

## Memulai

<Steps>
  <Step title="Instal Claude Code">
    SDK menggunakan Claude Code sebagai runtime-nya:

    <Tabs>
      <Tab title="macOS/Linux/WSL">
        ```bash
        curl -fsSL https://claude.ai/install.sh | bash
        ```
      </Tab>
      <Tab title="Homebrew">
        ```bash
        brew install --cask claude-code
        ```
      </Tab>
      <Tab title="npm">
        ```bash
        npm install -g @anthropic-ai/claude-code
        ```
      </Tab>
    </Tabs>

    Lihat [pengaturan Claude Code](https://docs.anthropic.com/en/docs/claude-code/setup) untuk Windows dan opsi lainnya.
  </Step>
  <Step title="Instal SDK">
    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python">
        ```bash
        pip install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>
  <Step title="Atur kunci API Anda">
    ```bash
    export ANTHROPIC_API_KEY=your-api-key
    ```
    Dapatkan kunci Anda dari [Konsol](https://console.anthropic.com/).

    SDK juga mendukung autentikasi melalui penyedia API pihak ketiga:

    - **Amazon Bedrock**: Atur variabel lingkungan `CLAUDE_CODE_USE_BEDROCK=1` dan konfigurasikan kredensial AWS
    - **Google Vertex AI**: Atur variabel lingkungan `CLAUDE_CODE_USE_VERTEX=1` dan konfigurasikan kredensial Google Cloud
    - **Microsoft Foundry**: Atur variabel lingkungan `CLAUDE_CODE_USE_FOUNDRY=1` dan konfigurasikan kredensial Azure

    <Note>
    Kecuali telah disetujui sebelumnya, kami tidak mengizinkan pengembang pihak ketiga untuk menawarkan login Claude.ai atau batas laju untuk produk mereka, termasuk agen yang dibangun di Claude Agent SDK. Silakan gunakan metode autentikasi kunci API yang dijelaskan dalam dokumen ini.
    </Note>
  </Step>
  <Step title="Jalankan agen pertama Anda">
    Contoh ini membuat agen yang mencantumkan file di direktori saat ini menggunakan alat bawaan.

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="What files are in this directory?",
            options=ClaudeAgentOptions(allowed_tools=["Bash", "Glob"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "What files are in this directory?",
      options: { allowedTools: ["Bash", "Glob"] },
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Step>
</Steps>

**Siap untuk membangun?** Ikuti [Panduan Cepat](/docs/id/agent-sdk/quickstart) untuk membuat agen yang menemukan dan memperbaiki bug dalam hitungan menit.

## Bandingkan Agent SDK dengan alat Claude lainnya

Platform Claude menawarkan berbagai cara untuk membangun dengan Claude. Berikut cara Agent SDK cocok:

<Tabs>
  <Tab title="Agent SDK vs Client SDK">
    [Anthropic Client SDK](/docs/id/api/client-sdks) memberi Anda akses API langsung: Anda mengirim prompt dan mengimplementasikan eksekusi alat sendiri. **Agent SDK** memberi Anda Claude dengan eksekusi alat bawaan.

    Dengan Client SDK, Anda mengimplementasikan loop alat. Dengan Agent SDK, Claude menanganinya:

    <CodeGroup>
    ```python Python
    # Client SDK: You implement the tool loop
    response = client.messages.create(...)
    while response.stop_reason == "tool_use":
        result = your_tool_executor(response.tool_use)
        response = client.messages.create(tool_result=result, ...)

    # Agent SDK: Claude handles tools autonomously
    async for message in query(prompt="Fix the bug in auth.py"):
        print(message)
    ```

    ```typescript TypeScript
    // Client SDK: You implement the tool loop
    let response = await client.messages.create({...});
    while (response.stop_reason === "tool_use") {
      const result = yourToolExecutor(response.tool_use);
      response = await client.messages.create({ tool_result: result, ... });
    }

    // Agent SDK: Claude handles tools autonomously
    for await (const message of query({ prompt: "Fix the bug in auth.py" })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Tab>
  <Tab title="Agent SDK vs Claude Code CLI">
    Kemampuan yang sama, antarmuka berbeda:

    | Kasus penggunaan | Pilihan terbaik |
    |----------|-------------|
    | Pengembangan interaktif | CLI |
    | Pipa CI/CD | SDK |
    | Aplikasi khusus | SDK |
    | Tugas sekali jalan | CLI |
    | Otomasi produksi | SDK |

    Banyak tim menggunakan keduanya: CLI untuk pengembangan harian, SDK untuk produksi. Alur kerja diterjemahkan langsung di antara keduanya.
  </Tab>
</Tabs>

## Changelog

Lihat changelog lengkap untuk pembaruan SDK, perbaikan bug, dan fitur baru:

- **TypeScript SDK**: [Lihat CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md)
- **Python SDK**: [Lihat CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-python/blob/main/CHANGELOG.md)

## Melaporkan bug

Jika Anda mengalami bug atau masalah dengan Agent SDK:

- **TypeScript SDK**: [Laporkan masalah di GitHub](https://github.com/anthropics/claude-agent-sdk-typescript/issues)
- **Python SDK**: [Laporkan masalah di GitHub](https://github.com/anthropics/claude-agent-sdk-python/issues)

## Pedoman branding

Untuk mitra yang mengintegrasikan Claude Agent SDK, penggunaan branding Claude bersifat opsional. Saat mereferensikan Claude di produk Anda:

**Diizinkan:**
- "Claude Agent" (lebih disukai untuk menu dropdown)
- "Claude" (ketika sudah dalam menu berlabel "Agents")
- "{YourAgentName} Powered by Claude" (jika Anda memiliki nama agen yang ada)

**Tidak diizinkan:**
- "Claude Code" atau "Claude Code Agent"
- Seni ASCII bermerek Claude Code atau elemen visual yang meniru Claude Code

Produk Anda harus mempertahankan branding sendiri dan tidak boleh terlihat seperti Claude Code atau produk Anthropic apa pun. Untuk pertanyaan tentang kepatuhan branding, hubungi [tim penjualan](https://www.anthropic.com/contact-sales) kami.

## Lisensi dan ketentuan

Penggunaan Claude Agent SDK diatur oleh [Syarat Layanan Komersial Anthropic](https://www.anthropic.com/legal/commercial-terms), termasuk ketika Anda menggunakannya untuk memberdayakan produk dan layanan yang Anda buat tersedia untuk pelanggan dan pengguna akhir Anda sendiri, kecuali sejauh komponen atau ketergantungan tertentu dicakup oleh lisensi berbeda seperti yang ditunjukkan dalam file LICENSE komponen tersebut.

## Langkah berikutnya

<CardGroup cols={2}>
  <Card title="Panduan Cepat" icon="play" href="/docs/id/agent-sdk/quickstart">
    Bangun agen yang menemukan dan memperbaiki bug dalam hitungan menit
  </Card>
  <Card title="Agen contoh" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    Asisten email, agen penelitian, dan banyak lagi
  </Card>
  <Card title="TypeScript SDK" icon="code" href="/docs/id/agent-sdk/typescript">
    Referensi API TypeScript lengkap dan contoh
  </Card>
  <Card title="Python SDK" icon="code" href="/docs/id/agent-sdk/python">
    Referensi API Python lengkap dan contoh
  </Card>
</CardGroup>