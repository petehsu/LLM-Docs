# Konektor MCP

Fitur konektor Model Context Protocol (MCP) Claude memungkinkan Anda terhubung ke server MCP jarak jauh langsung dari Messages API tanpa klien MCP terpisah.

---

Fitur konektor Model Context Protocol (MCP) Claude memungkinkan Anda terhubung ke server MCP jarak jauh langsung dari Messages API tanpa klien MCP terpisah.

<Note>
  **Versi saat ini**: Fitur ini memerlukan header beta: `"anthropic-beta": "mcp-client-2025-11-20"`

  Versi sebelumnya (`mcp-client-2025-04-04`) sudah tidak digunakan lagi. Lihat [dokumentasi versi yang tidak digunakan lagi](#deprecated-version-mcp-client-2025-04-04) di bawah.
</Note>

## Fitur utama

- **Integrasi API langsung**: Terhubung ke server MCP tanpa mengimplementasikan klien MCP
- **Dukungan pemanggilan alat**: Akses alat MCP melalui Messages API
- **Konfigurasi alat yang fleksibel**: Aktifkan semua alat, daftar putih alat tertentu, atau daftar hitam alat yang tidak diinginkan
- **Konfigurasi per-alat**: Konfigurasi alat individual dengan pengaturan khusus
- **Autentikasi OAuth**: Dukungan untuk token Bearer OAuth untuk server yang diautentikasi
- **Server ganda**: Terhubung ke beberapa server MCP dalam satu permintaan

## Keterbatasan

- Dari kumpulan fitur [spesifikasi MCP](https://modelcontextprotocol.io/introduction#explore-mcp), hanya [pemanggilan alat](https://modelcontextprotocol.io/docs/concepts/tools) yang saat ini didukung.
- Server harus terbuka untuk publik melalui HTTP (mendukung transportasi HTTP Streamable dan SSE). Server STDIO lokal tidak dapat terhubung secara langsung.
- Konektor MCP saat ini tidak didukung di Amazon Bedrock dan Google Vertex.

## Menggunakan konektor MCP di Messages API

Konektor MCP menggunakan dua komponen:

1. **Definisi Server MCP** (array `mcp_servers`): Menentukan detail koneksi server (URL, autentikasi)
2. **Set Alat MCP** (array `tools`): Mengonfigurasi alat mana yang akan diaktifkan dan cara mengonfigurasinya

### Contoh dasar

Contoh ini mengaktifkan semua alat dari server MCP dengan konfigurasi default:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: mcp-client-2025-11-20" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1000,
    "messages": [{"role": "user", "content": "What tools do you have available?"}],
    "mcp_servers": [
      {
        "type": "url",
        "url": "https://example-server.modelcontextprotocol.io/sse",
        "name": "example-mcp",
        "authorization_token": "YOUR_TOKEN"
      }
    ],
    "tools": [
      {
        "type": "mcp_toolset",
        "mcp_server_name": "example-mcp"
      }
    ]
  }'
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "What tools do you have available?",
    },
  ],
  mcp_servers: [
    {
      type: "url",
      url: "https://example-server.modelcontextprotocol.io/sse",
      name: "example-mcp",
      authorization_token: "YOUR_TOKEN",
    },
  ],
  tools: [
    {
      type: "mcp_toolset",
      mcp_server_name: "example-mcp",
    },
  ],
  betas: ["mcp-client-2025-11-20"],
});
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1000,
    messages=[{
        "role": "user",
        "content": "What tools do you have available?"
    }],
    mcp_servers=[{
        "type": "url",
        "url": "https://mcp.example.com/sse",
        "name": "example-mcp",
        "authorization_token": "YOUR_TOKEN"
    }],
    tools=[{
        "type": "mcp_toolset",
        "mcp_server_name": "example-mcp"
    }],
    betas=["mcp-client-2025-11-20"]
)
```
</CodeGroup>

## Konfigurasi server MCP

Setiap server MCP dalam array `mcp_servers` menentukan detail koneksi:

```json
{
  "type": "url",
  "url": "https://example-server.modelcontextprotocol.io/sse",
  "name": "example-mcp",
  "authorization_token": "YOUR_TOKEN"
}
```

### Deskripsi bidang

| Properti | Tipe | Diperlukan | Deskripsi |
|----------|------|----------|-------------|
| `type` | string | Ya | Saat ini hanya "url" yang didukung |
| `url` | string | Ya | URL server MCP. Harus dimulai dengan https:// |
| `name` | string | Ya | Pengidentifikasi unik untuk server MCP ini. Harus direferensikan oleh tepat satu MCPToolset dalam array `tools`. |
| `authorization_token` | string | Tidak | Token otorisasi OAuth jika diperlukan oleh server MCP. Lihat [spesifikasi MCP](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization). |

## Konfigurasi set alat MCP

MCPToolset berada dalam array `tools` dan mengonfigurasi alat mana dari server MCP yang diaktifkan dan cara mengonfigurasinya.

### Struktur dasar

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "example-mcp",
  "default_config": {
    "enabled": true,
    "defer_loading": false
  },
  "configs": {
    "specific_tool_name": {
      "enabled": true,
      "defer_loading": true
    }
  }
}
```

### Deskripsi bidang

| Properti | Tipe | Diperlukan | Deskripsi |
|----------|------|----------|-------------|
| `type` | string | Ya | Harus "mcp_toolset" |
| `mcp_server_name` | string | Ya | Harus cocok dengan nama server yang ditentukan dalam array `mcp_servers` |
| `default_config` | object | Tidak | Konfigurasi default yang diterapkan ke semua alat dalam set ini. Konfigurasi alat individual dalam `configs` akan mengganti default ini. |
| `configs` | object | Tidak | Penggantian konfigurasi per-alat. Kunci adalah nama alat, nilai adalah objek konfigurasi. |
| `cache_control` | object | Tidak | Konfigurasi titik henti cache untuk set alat ini |

### Opsi konfigurasi alat

Setiap alat (baik dikonfigurasi dalam `default_config` atau dalam `configs`) mendukung bidang berikut:

| Properti | Tipe | Default | Deskripsi |
|----------|------|---------|-------------|
| `enabled` | boolean | `true` | Apakah alat ini diaktifkan |
| `defer_loading` | boolean | `false` | Jika true, deskripsi alat tidak dikirim ke model awalnya. Digunakan dengan [Alat Pencarian Alat](/agents-and-tools/tool-search-tool). |

### Penggabungan konfigurasi

Nilai konfigurasi digabungkan dengan urutan prioritas ini (tertinggi ke terendah):

1. Pengaturan khusus alat dalam `configs`
2. Set-level `default_config`
3. Default sistem

Contoh:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "defer_loading": true
  },
  "configs": {
    "search_events": {
      "enabled": false
    }
  }
}
```

Menghasilkan:
- `search_events`: `enabled: false` (dari configs), `defer_loading: true` (dari default_config)
- Semua alat lainnya: `enabled: true` (default sistem), `defer_loading: true` (dari default_config)

## Pola konfigurasi umum

### Aktifkan semua alat dengan konfigurasi default

Pola paling sederhana - aktifkan semua alat dari server:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
}
```

### Daftar putih - Aktifkan hanya alat tertentu

Atur `enabled: false` sebagai default, kemudian secara eksplisit aktifkan alat tertentu:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "enabled": false
  },
  "configs": {
    "search_events": {
      "enabled": true
    },
    "create_event": {
      "enabled": true
    }
  }
}
```

### Daftar hitam - Nonaktifkan alat tertentu

Aktifkan semua alat secara default, kemudian secara eksplisit nonaktifkan alat yang tidak diinginkan:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "configs": {
    "delete_all_events": {
      "enabled": false
    },
    "share_calendar_publicly": {
      "enabled": false
    }
  }
}
```

### Campuran - Daftar putih dengan konfigurasi per-alat

Gabungkan daftar putih dengan konfigurasi khusus untuk setiap alat:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "enabled": false,
    "defer_loading": true
  },
  "configs": {
    "search_events": {
      "enabled": true,
      "defer_loading": false
    },
    "list_events": {
      "enabled": true
    }
  }
}
```

Dalam contoh ini:
- `search_events` diaktifkan dengan `defer_loading: false`
- `list_events` diaktifkan dengan `defer_loading: true` (diwarisi dari default_config)
- Semua alat lainnya dinonaktifkan

## Aturan validasi

API memberlakukan aturan validasi ini:

- **Server harus ada**: `mcp_server_name` dalam MCPToolset harus cocok dengan server yang ditentukan dalam array `mcp_servers`
- **Server harus digunakan**: Setiap server MCP yang ditentukan dalam `mcp_servers` harus direferensikan oleh tepat satu MCPToolset
- **Toolset unik per server**: Setiap server MCP hanya dapat direferensikan oleh satu MCPToolset
- **Nama alat yang tidak dikenal**: Jika nama alat dalam `configs` tidak ada di server MCP, peringatan backend dicatat tetapi tidak ada kesalahan yang dikembalikan (server MCP mungkin memiliki ketersediaan alat yang dinamis)

## Jenis konten respons

Ketika Claude menggunakan alat MCP, respons akan mencakup dua jenis blok konten baru:

### Blok Penggunaan Alat MCP

```json
{
  "type": "mcp_tool_use",
  "id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "name": "echo",
  "server_name": "example-mcp",
  "input": { "param1": "value1", "param2": "value2" }
}
```

### Blok Hasil Alat MCP

```json
{
  "type": "mcp_tool_result",
  "tool_use_id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "is_error": false,
  "content": [
    {
      "type": "text",
      "text": "Hello"
    }
  ]
}
```

## Server MCP ganda

Anda dapat terhubung ke beberapa server MCP dengan menyertakan beberapa definisi server dalam `mcp_servers` dan MCPToolset yang sesuai untuk masing-masing dalam array `tools`:

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": "Use tools from both mcp-server-1 and mcp-server-2 to complete this task"
    }
  ],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example1.com/sse",
      "name": "mcp-server-1",
      "authorization_token": "TOKEN1"
    },
    {
      "type": "url",
      "url": "https://mcp.example2.com/sse",
      "name": "mcp-server-2",
      "authorization_token": "TOKEN2"
    }
  ],
  "tools": [
    {
      "type": "mcp_toolset",
      "mcp_server_name": "mcp-server-1"
    },
    {
      "type": "mcp_toolset",
      "mcp_server_name": "mcp-server-2",
      "default_config": {
        "defer_loading": true
      }
    }
  ]
}
```

## Autentikasi

Untuk server MCP yang memerlukan autentikasi OAuth, Anda perlu mendapatkan token akses. Beta konektor MCP mendukung melewatkan parameter `authorization_token` dalam definisi server MCP.
Konsumen API diharapkan menangani alur OAuth dan mendapatkan token akses sebelum melakukan panggilan API, serta menyegarkan token sesuai kebutuhan.

### Mendapatkan token akses untuk pengujian

Inspektur MCP dapat memandu Anda melalui proses mendapatkan token akses untuk tujuan pengujian.

1. Jalankan inspektur dengan perintah berikut. Anda perlu Node.js terinstal di mesin Anda.

   ```bash
   npx @modelcontextprotocol/inspector
   ```

2. Di bilah sisi di sebelah kiri, untuk "Jenis transportasi", pilih "SSE" atau "HTTP Streamable".
3. Masukkan URL server MCP.
4. Di area kanan, klik tombol "Buka Pengaturan Autentikasi" setelah "Perlu mengonfigurasi autentikasi?".
5. Klik "Alur OAuth Cepat" dan otorisasi di layar OAuth.
6. Ikuti langkah-langkah di bagian "Kemajuan Alur OAuth" dari inspektur dan klik "Lanjutkan" hingga Anda mencapai "Autentikasi selesai".
7. Salin nilai `access_token`.
8. Tempel ke bidang `authorization_token` dalam konfigurasi server MCP Anda.

### Menggunakan token akses

Setelah Anda mendapatkan token akses menggunakan alur OAuth di atas, Anda dapat menggunakannya dalam konfigurasi server MCP Anda:

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "authenticated-server",
      "authorization_token": "YOUR_ACCESS_TOKEN_HERE"
    }
  ]
}
```

Untuk penjelasan terperinci tentang alur OAuth, lihat [bagian Otorisasi](https://modelcontextprotocol.io/docs/concepts/authentication) dalam spesifikasi MCP.

## Panduan migrasi

Jika Anda menggunakan header beta `mcp-client-2025-04-04` yang tidak digunakan lagi, ikuti panduan ini untuk bermigrasi ke versi baru.

### Perubahan utama

1. **Header beta baru**: Ubah dari `mcp-client-2025-04-04` menjadi `mcp-client-2025-11-20`
2. **Konfigurasi alat dipindahkan**: Konfigurasi alat sekarang berada dalam array `tools` sebagai objek MCPToolset, bukan dalam definisi server MCP
3. **Konfigurasi lebih fleksibel**: Pola baru mendukung daftar putih, daftar hitam, dan konfigurasi per-alat

### Langkah-langkah migrasi

**Sebelumnya (tidak digunakan lagi):**

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [...],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example.com/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN",
      "tool_configuration": {
        "enabled": true,
        "allowed_tools": ["tool1", "tool2"]
      }
    }
  ]
}
```

**Sesudahnya (saat ini):**

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [...],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example.com/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN"
    }
  ],
  "tools": [
    {
      "type": "mcp_toolset",
      "mcp_server_name": "example-mcp",
      "default_config": {
        "enabled": false
      },
      "configs": {
        "tool1": {
          "enabled": true
        },
        "tool2": {
          "enabled": true
        }
      }
    }
  ]
}
```

### Pola migrasi umum

| Pola lama | Pola baru |
|-------------|-------------|
| Tidak ada `tool_configuration` (semua alat diaktifkan) | MCPToolset tanpa `default_config` atau `configs` |
| `tool_configuration.enabled: false` | MCPToolset dengan `default_config.enabled: false` |
| `tool_configuration.allowed_tools: [...]` | MCPToolset dengan `default_config.enabled: false` dan alat tertentu diaktifkan dalam `configs` |

## Versi yang tidak digunakan lagi: mcp-client-2025-04-04

<Note type="warning">
  Versi ini tidak digunakan lagi. Silakan bermigrasi ke `mcp-client-2025-11-20` menggunakan [panduan migrasi](#migration-guide) di atas.
</Note>

Versi sebelumnya dari konektor MCP menyertakan konfigurasi alat langsung dalam definisi server MCP:

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN",
      "tool_configuration": {
        "enabled": true,
        "allowed_tools": ["example_tool_1", "example_tool_2"]
      }
    }
  ]
}
```

### Deskripsi bidang yang tidak digunakan lagi

| Properti | Tipe | Deskripsi |
|----------|------|-------------|
| `tool_configuration` | object | **Tidak digunakan lagi**: Gunakan MCPToolset dalam array `tools` sebagai gantinya |
| `tool_configuration.enabled` | boolean | **Tidak digunakan lagi**: Gunakan `default_config.enabled` dalam MCPToolset |
| `tool_configuration.allowed_tools` | array | **Tidak digunakan lagi**: Gunakan pola daftar putih dengan `configs` dalam MCPToolset |