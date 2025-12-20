# Panduan Cepat

Mulai dengan Python atau TypeScript Agent SDK untuk membangun agen AI yang bekerja secara otonom

---

Gunakan Agent SDK untuk membangun agen AI yang membaca kode Anda, menemukan bug, dan memperbaikinya, semuanya tanpa intervensi manual.

**Yang akan Anda lakukan:**
1. Siapkan proyek dengan Agent SDK
2. Buat file dengan beberapa kode yang berisi bug
3. Jalankan agen yang menemukan dan memperbaiki bug secara otomatis

## Prasyarat

- **Node.js 18+** atau **Python 3.10+**
- Akun **Anthropic** ([daftar di sini](https://console.anthropic.com/))

## Penyiapan

<Steps>
  <Step title="Instal Claude Code">
    Agent SDK menggunakan Claude Code sebagai runtime-nya. Instal untuk platform Anda:

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

    Setelah menginstal Claude Code di mesin Anda, jalankan `claude` di terminal Anda dan ikuti petunjuk untuk autentikasi. SDK akan menggunakan autentikasi ini secara otomatis.

    <Tip>
    Untuk informasi lebih lanjut tentang instalasi Claude Code, lihat [penyiapan Claude Code](https://docs.anthropic.com/en/docs/claude-code/setup).
    </Tip>
  </Step>

  <Step title="Buat folder proyek">
    Buat direktori baru untuk panduan cepat ini:

    ```bash
    mkdir my-agent && cd my-agent
    ```

    Untuk proyek Anda sendiri, Anda dapat menjalankan SDK dari folder apa pun; SDK akan memiliki akses ke file di direktori tersebut dan subdirektorinya secara default.
  </Step>

  <Step title="Instal SDK">
    Instal paket Agent SDK untuk bahasa Anda:

    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (uv)">
        [uv](https://docs.astral.sh/uv/) adalah pengelola paket Python yang cepat dan menangani lingkungan virtual secara otomatis:
        ```bash
        uv init && uv add claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (pip)">
        Buat lingkungan virtual terlebih dahulu, kemudian instal:
        ```bash
        python3 -m venv .venv && source .venv/bin/activate
        pip3 install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="Atur kunci API Anda">
    Jika Anda telah mengautentikasi Claude Code (dengan menjalankan `claude` di terminal Anda), SDK menggunakan autentikasi tersebut secara otomatis.

    Jika tidak, Anda memerlukan kunci API, yang dapat Anda dapatkan dari [Konsol Anthropic](https://console.anthropic.com/).

    Buat file `.env` di direktori proyek Anda dan simpan kunci API di sana:

    ```bash
    ANTHROPIC_API_KEY=your-api-key
    ```

    <Note>
    **Menggunakan Amazon Bedrock, Google Vertex AI, atau Microsoft Azure?** Lihat panduan penyiapan untuk [Bedrock](https://code.claude.com/docs/en/amazon-bedrock), [Vertex AI](https://code.claude.com/docs/en/google-vertex-ai), atau [Azure AI Foundry](https://code.claude.com/docs/en/azure-ai-foundry).

    Kecuali telah disetujui sebelumnya, kami tidak mengizinkan pengembang pihak ketiga untuk menawarkan login Claude.ai atau batas laju untuk produk mereka, termasuk agen yang dibangun di atas Claude Agent SDK. Silakan gunakan metode autentikasi kunci API yang dijelaskan dalam dokumen ini.
    </Note>
  </Step>
</Steps>

## Buat file dengan bug

Panduan cepat ini memandu Anda melalui pembuatan agen yang dapat menemukan dan memperbaiki bug dalam kode. Pertama, Anda memerlukan file dengan beberapa bug yang disengaja untuk diperbaiki oleh agen. Buat `utils.py` di direktori `my-agent` dan tempel kode berikut:

```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

def get_user_name(user):
    return user["name"].upper()
```

Kode ini memiliki dua bug:
1. `calculate_average([])` mogok dengan pembagian oleh nol
2. `get_user_name(None)` mogok dengan TypeError

## Bangun agen yang menemukan dan memperbaiki bug

Buat `agent.py` jika Anda menggunakan Python SDK, atau `agent.ts` untuk TypeScript:

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

async def main():
    # Agentic loop: streams messages as Claude works
    async for message in query(
        prompt="Review utils.py for bugs that would cause crashes. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],  # Tools Claude can use
            permission_mode="acceptEdits"            # Auto-approve file edits
        )
    ):
        # Print human-readable output
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)              # Claude's reasoning
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")   # Tool being called
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")      # Final result

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Agentic loop: streams messages as Claude works
for await (const message of query({
  prompt: "Review utils.py for bugs that would cause crashes. Fix any issues you find.",
  options: {
    allowedTools: ["Read", "Edit", "Glob"],  // Tools Claude can use
    permissionMode: "acceptEdits"            // Auto-approve file edits
  }
})) {
  // Print human-readable output
  if (message.type === "assistant" && message.message?.content) {
    for (const block of message.message.content) {
      if ("text" in block) {
        console.log(block.text);             // Claude's reasoning
      } else if ("name" in block) {
        console.log(`Tool: ${block.name}`);  // Tool being called
      }
    }
  } else if (message.type === "result") {
    console.log(`Done: ${message.subtype}`); // Final result
  }
}
```
</CodeGroup>

Kode ini memiliki tiga bagian utama:

1. **`query`**: titik masuk utama yang membuat loop agentic. Ini mengembalikan iterator async, jadi Anda menggunakan `async for` untuk streaming pesan saat Claude bekerja. Lihat API lengkap di referensi SDK [Python](/docs/id/agent-sdk/python#query) atau [TypeScript](/docs/id/agent-sdk/typescript#query).

2. **`prompt`**: apa yang ingin Anda lakukan Claude. Claude mengetahui alat mana yang harus digunakan berdasarkan tugas.

3. **`options`**: konfigurasi untuk agen. Contoh ini menggunakan `allowedTools` untuk membatasi Claude ke `Read`, `Edit`, dan `Glob`, dan `permissionMode: "acceptEdits"` untuk auto-approve perubahan file. Opsi lainnya termasuk `systemPrompt`, `mcpServers`, dan lainnya. Lihat semua opsi untuk [Python](/docs/id/agent-sdk/python#claudeagentoptions) atau [TypeScript](/docs/id/agent-sdk/typescript#claudeagentoptions).

Loop `async for` terus berjalan saat Claude berpikir, memanggil alat, mengamati hasil, dan memutuskan apa yang harus dilakukan selanjutnya. Setiap iterasi menghasilkan pesan: penalaran Claude, panggilan alat, hasil alat, atau hasil akhir. SDK menangani orkestrasi (eksekusi alat, manajemen konteks, percobaan ulang) sehingga Anda hanya mengonsumsi aliran. Loop berakhir ketika Claude menyelesaikan tugas atau mengalami kesalahan.

Penanganan pesan di dalam loop memfilter untuk output yang dapat dibaca manusia. Tanpa pemfilteran, Anda akan melihat objek pesan mentah termasuk inisialisasi sistem dan status internal, yang berguna untuk debugging tetapi berisik sebaliknya.

<Note>
Contoh ini menggunakan streaming untuk menampilkan kemajuan secara real-time. Jika Anda tidak memerlukan output langsung (misalnya untuk pekerjaan latar belakang atau pipeline CI), Anda dapat mengumpulkan semua pesan sekaligus. Lihat [Streaming vs. mode single-turn](/docs/id/agent-sdk/streaming-vs-single-mode) untuk detail.
</Note>

### Jalankan agen Anda

Agen Anda siap. Jalankan dengan perintah berikut:

<CodeGroup>
```bash Python
python3 agent.py
```

```bash TypeScript
npx tsx agent.ts
```
</CodeGroup>

Setelah menjalankan, periksa `utils.py`. Anda akan melihat kode defensif yang menangani daftar kosong dan pengguna null. Agen Anda secara otonom:

1. **Membaca** `utils.py` untuk memahami kode
2. **Menganalisis** logika dan mengidentifikasi kasus tepi yang akan mogok
3. **Mengedit** file untuk menambahkan penanganan kesalahan yang tepat

Inilah yang membuat Agent SDK berbeda: Claude menjalankan alat secara langsung alih-alih meminta Anda untuk mengimplementasikannya.

<Note>
Jika Anda melihat "Claude Code not found", [instal Claude Code](#instal-claude-code) dan mulai ulang terminal Anda. Untuk "API key not found", [atur kunci API Anda](#atur-kunci-api-anda). Lihat [panduan pemecahan masalah lengkap](https://docs.anthropic.com/en/docs/claude-code/troubleshooting) untuk bantuan lebih lanjut.
</Note>

### Coba prompt lain

Sekarang agen Anda sudah siap, coba beberapa prompt berbeda:

- `"Add docstrings to all functions in utils.py"`
- `"Add type hints to all functions in utils.py"`
- `"Create a README.md documenting the functions in utils.py"`

### Sesuaikan agen Anda

Anda dapat memodifikasi perilaku agen dengan mengubah opsi. Berikut adalah beberapa contoh:

**Tambahkan kemampuan pencarian web:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "WebSearch"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "WebSearch"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

**Berikan Claude prompt sistem kustom:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob"],
    permission_mode="acceptEdits",
    system_prompt="You are a senior Python developer. Always follow PEP 8 style guidelines."
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob"],
  permissionMode: "acceptEdits",
  systemPrompt: "You are a senior Python developer. Always follow PEP 8 style guidelines."
}
```
</CodeGroup>

**Jalankan perintah di terminal:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "Bash"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "Bash"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

Dengan `Bash` diaktifkan, coba: `"Write unit tests for utils.py, run them, and fix any failures"`

## Konsep kunci

**Alat** mengontrol apa yang dapat dilakukan agen Anda:

| Alat | Apa yang dapat dilakukan agen |
|-------|----------------------|
| `Read`, `Glob`, `Grep` | Analisis hanya-baca |
| `Read`, `Edit`, `Glob` | Analisis dan modifikasi kode |
| `Read`, `Edit`, `Bash`, `Glob`, `Grep` | Otomasi penuh |

**Mode izin** mengontrol berapa banyak pengawasan manusia yang Anda inginkan:

| Mode | Perilaku | Kasus penggunaan |
|------|----------|----------|
| `acceptEdits` | Auto-approves file edits, asks for other actions | Alur kerja pengembangan terpercaya |
| `bypassPermissions` | Berjalan tanpa prompt | Pipeline CI/CD, otomasi |
| `default` | Memerlukan callback `canUseTool` untuk menangani persetujuan | Alur persetujuan kustom |

Contoh di atas menggunakan mode `acceptEdits`, yang auto-approves operasi file sehingga agen dapat berjalan tanpa prompt interaktif. Jika Anda ingin meminta pengguna untuk persetujuan, gunakan mode `default` dan sediakan callback [`canUseTool`](/docs/id/agent-sdk/permissions#canusetool) yang mengumpulkan input pengguna. Untuk kontrol lebih, lihat [Izin](/docs/id/agent-sdk/permissions).

## Langkah berikutnya

Sekarang Anda telah membuat agen pertama Anda, pelajari cara memperluas kemampuannya dan menyesuaikannya dengan kasus penggunaan Anda:

- **[Izin](/docs/id/agent-sdk/permissions)**: kontrol apa yang dapat dilakukan agen Anda dan kapan memerlukan persetujuan
- **[Hooks](/docs/id/agent-sdk/hooks)**: jalankan kode kustom sebelum atau sesudah panggilan alat
- **[Sesi](/docs/id/agent-sdk/sessions)**: bangun agen multi-turn yang mempertahankan konteks
- **[Server MCP](/docs/id/agent-sdk/mcp)**: terhubung ke database, browser, API, dan sistem eksternal lainnya
- **[Hosting](/docs/id/agent-sdk/hosting)**: sebarkan agen ke Docker, cloud, dan CI/CD
- **[Agen contoh](https://github.com/anthropics/claude-agent-sdk-demos)**: lihat contoh lengkap: asisten email, agen penelitian, dan lainnya