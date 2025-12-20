# Migrasi ke Claude Agent SDK

Panduan untuk migrasi Claude Code TypeScript dan Python SDKs ke Claude Agent SDK

---

## Ikhtisar

Claude Code SDK telah diubah namanya menjadi **Claude Agent SDK** dan dokumentasinya telah diatur ulang. Perubahan ini mencerminkan kemampuan SDK yang lebih luas untuk membangun agen AI di luar sekadar tugas pengkodean.

## Apa yang Berubah

| Aspek                   | Lama                         | Baru                              |
| :----------------------- | :-------------------------- | :------------------------------- |
| **Nama Paket (TS/JS)** | `@anthropic-ai/claude-code` | `@anthropic-ai/claude-agent-sdk` |
| **Paket Python**       | `claude-code-sdk`           | `claude-agent-sdk`               |
| **Lokasi Dokumentasi** | Dokumentasi Claude Code | API Guide → Bagian Agent SDK |

<Note>
**Perubahan Dokumentasi:** Dokumentasi Agent SDK telah dipindahkan dari dokumentasi Claude Code ke API Guide di bawah bagian [Agent SDK](/docs/id/agent-sdk/overview) yang didedikasikan. Dokumentasi Claude Code sekarang fokus pada alat CLI dan fitur otomasi.
</Note>

## Langkah-Langkah Migrasi

### Untuk Proyek TypeScript/JavaScript

**1. Uninstall paket lama:**

```bash
npm uninstall @anthropic-ai/claude-code
```

**2. Install paket baru:**

```bash
npm install @anthropic-ai/claude-agent-sdk
```

**3. Perbarui impor Anda:**

Ubah semua impor dari `@anthropic-ai/claude-code` ke `@anthropic-ai/claude-agent-sdk`:

```typescript
// Sebelumnya
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-code";

// Sesudahnya
import {
  query,
  tool,
  createSdkMcpServer,
} from "@anthropic-ai/claude-agent-sdk";
```

**4. Perbarui dependensi package.json:**

Jika Anda memiliki paket yang tercantum di `package.json` Anda, perbarui:

```json
// Sebelumnya
{
  "dependencies": {
    "@anthropic-ai/claude-code": "^1.0.0"
  }
}

// Sesudahnya
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.1.0"
  }
}
```

Itu saja! Tidak ada perubahan kode lain yang diperlukan.

### Untuk Proyek Python

**1. Uninstall paket lama:**

```bash
pip uninstall claude-code-sdk
```

**2. Install paket baru:**

```bash
pip install claude-agent-sdk
```

**3. Perbarui impor Anda:**

Ubah semua impor dari `claude_code_sdk` ke `claude_agent_sdk`:

```python
# Sebelumnya
from claude_code_sdk import query, ClaudeCodeOptions

# Sesudahnya
from claude_agent_sdk import query, ClaudeAgentOptions
```

**4. Perbarui nama tipe:**

Ubah `ClaudeCodeOptions` menjadi `ClaudeAgentOptions`:

```python
# Sebelumnya
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5"
)

# Sesudahnya
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5"
)
```

**5. Tinjau [perubahan yang merusak](#breaking-changes)**

Buat perubahan kode apa pun yang diperlukan untuk menyelesaikan migrasi.

## Perubahan yang merusak

<Warning>
Untuk meningkatkan isolasi dan konfigurasi eksplisit, Claude Agent SDK v0.1.0 memperkenalkan perubahan yang merusak bagi pengguna yang bermigrasi dari Claude Code SDK. Tinjau bagian ini dengan cermat sebelum bermigrasi.
</Warning>

### Python: ClaudeCodeOptions diubah nama menjadi ClaudeAgentOptions

**Apa yang berubah:** Tipe SDK Python `ClaudeCodeOptions` telah diubah nama menjadi `ClaudeAgentOptions`.

**Migrasi:**

```python
# SEBELUMNYA (v0.0.x)
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)

# SESUDAHNYA (v0.1.0)
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)
```

**Mengapa ini berubah:** Nama tipe sekarang cocok dengan branding "Claude Agent SDK" dan memberikan konsistensi di seluruh konvensi penamaan SDK.

### Prompt sistem tidak lagi default

**Apa yang berubah:** SDK tidak lagi menggunakan prompt sistem Claude Code secara default.

**Migrasi:**

<CodeGroup>

```typescript TypeScript
// SEBELUMNYA (v0.0.x) - Menggunakan prompt sistem Claude Code secara default
const result = query({ prompt: "Hello" });

// SESUDAHNYA (v0.1.0) - Menggunakan prompt sistem kosong secara default
// Untuk mendapatkan perilaku lama, secara eksplisit minta preset Claude Code:
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: { type: "preset", preset: "claude_code" }
  }
});

// Atau gunakan prompt sistem kustom:
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: "You are a helpful coding assistant"
  }
});
```

```python Python
# SEBELUMNYA (v0.0.x) - Menggunakan prompt sistem Claude Code secara default
async for message in query(prompt="Hello"):
    print(message)

# SESUDAHNYA (v0.1.0) - Menggunakan prompt sistem kosong secara default
# Untuk mendapatkan perilaku lama, secara eksplisit minta preset Claude Code:
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt={"type": "preset", "preset": "claude_code"}  # Gunakan preset
    )
):
    print(message)

# Atau gunakan prompt sistem kustom:
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt="You are a helpful coding assistant"
    )
):
    print(message)
```

</CodeGroup>

**Mengapa ini berubah:** Memberikan kontrol dan isolasi yang lebih baik untuk aplikasi SDK. Anda sekarang dapat membangun agen dengan perilaku kustom tanpa mewarisi instruksi yang berfokus pada CLI Claude Code.

### Sumber Pengaturan Tidak Lagi Dimuat Secara Default

**Apa yang berubah:** SDK tidak lagi membaca dari pengaturan sistem file (CLAUDE.md, settings.json, perintah slash, dll.) secara default.

**Migrasi:**

<CodeGroup>

```typescript TypeScript
// SEBELUMNYA (v0.0.x) - Memuat semua pengaturan secara otomatis
const result = query({ prompt: "Hello" });
// Akan membaca dari:
// - ~/.claude/settings.json (pengguna)
// - .claude/settings.json (proyek)
// - .claude/settings.local.json (lokal)
// - File CLAUDE.md
// - Perintah slash kustom

// SESUDAHNYA (v0.1.0) - Tidak ada pengaturan yang dimuat secara default
// Untuk mendapatkan perilaku lama:
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["user", "project", "local"]
  }
});

// Atau muat hanya sumber tertentu:
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["project"]  // Hanya pengaturan proyek
  }
});
```

```python Python
# SEBELUMNYA (v0.0.x) - Memuat semua pengaturan secara otomatis
async for message in query(prompt="Hello"):
    print(message)
# Akan membaca dari:
# - ~/.claude/settings.json (pengguna)
# - .claude/settings.json (proyek)
# - .claude/settings.local.json (lokal)
# - File CLAUDE.md
# - Perintah slash kustom

# SESUDAHNYA (v0.1.0) - Tidak ada pengaturan yang dimuat secara default
# Untuk mendapatkan perilaku lama:
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["user", "project", "local"]
    )
):
    print(message)

# Atau muat hanya sumber tertentu:
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["project"]  # Hanya pengaturan proyek
    )
):
    print(message)
```

</CodeGroup>

**Mengapa ini berubah:** Memastikan aplikasi SDK memiliki perilaku yang dapat diprediksi terlepas dari konfigurasi sistem file lokal. Ini sangat penting untuk:
- **Lingkungan CI/CD** - Perilaku konsisten tanpa kustomisasi lokal
- **Aplikasi yang digunakan** - Tidak ada ketergantungan pada pengaturan sistem file
- **Pengujian** - Lingkungan pengujian yang terisolasi
- **Sistem multi-penyewa** - Cegah kebocoran pengaturan antar pengguna

<Note>
**Kompatibilitas mundur:** Jika aplikasi Anda bergantung pada pengaturan sistem file (perintah slash kustom, instruksi CLAUDE.md, dll.), tambahkan `settingSources: ['user', 'project', 'local']` ke opsi Anda.
</Note>

## Mengapa Pengubahan Nama?

Claude Code SDK awalnya dirancang untuk tugas pengkodean, tetapi telah berkembang menjadi kerangka kerja yang kuat untuk membangun semua jenis agen AI. Nama baru "Claude Agent SDK" lebih mencerminkan kemampuannya:

- Membangun agen bisnis (asisten hukum, penasihat keuangan, dukungan pelanggan)
- Membuat agen pengkodean khusus (bot SRE, pengulas keamanan, agen tinjauan kode)
- Mengembangkan agen kustom untuk domain apa pun dengan penggunaan alat, integrasi MCP, dan banyak lagi

## Mendapatkan Bantuan

Jika Anda mengalami masalah apa pun selama migrasi:

**Untuk TypeScript/JavaScript:**

1. Periksa bahwa semua impor diperbarui untuk menggunakan `@anthropic-ai/claude-agent-sdk`
2. Verifikasi package.json Anda memiliki nama paket baru
3. Jalankan `npm install` untuk memastikan dependensi diperbarui

**Untuk Python:**

1. Periksa bahwa semua impor diperbarui untuk menggunakan `claude_agent_sdk`
2. Verifikasi requirements.txt atau pyproject.toml Anda memiliki nama paket baru
3. Jalankan `pip install claude-agent-sdk` untuk memastikan paket terinstal

## Langkah Berikutnya

- Jelajahi [Ikhtisar Agent SDK](/docs/id/agent-sdk/overview) untuk mempelajari fitur yang tersedia
- Lihat [Referensi SDK TypeScript](/docs/id/agent-sdk/typescript) untuk dokumentasi API terperinci
- Tinjau [Referensi SDK Python](/docs/id/agent-sdk/python) untuk dokumentasi khusus Python
- Pelajari tentang [Alat Kustom](/docs/id/agent-sdk/custom-tools) dan [Integrasi MCP](/docs/id/agent-sdk/mcp)