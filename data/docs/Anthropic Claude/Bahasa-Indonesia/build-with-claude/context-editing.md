# Pengeditan konteks

Kelola konteks percakapan secara otomatis saat berkembang dengan pengeditan konteks.

---

## Ringkasan

Pengeditan konteks memungkinkan Anda mengelola konteks percakapan secara otomatis saat berkembang, membantu Anda mengoptimalkan biaya dan tetap berada dalam batas jendela konteks. Anda dapat menggunakan strategi API sisi server, fitur SDK sisi klien, atau keduanya bersama-sama.

| Pendekatan | Tempat berjalan | Strategi | Cara kerjanya |
|----------|---------------|------------|--------------|
| **Sisi server** | API | Pembersihan hasil alat (`clear_tool_uses_20250919`)<br/>Pembersihan blok pemikiran (`clear_thinking_20251015`) | Diterapkan sebelum prompt mencapai Claude. Menghapus konten tertentu dari riwayat percakapan. Setiap strategi dapat dikonfigurasi secara independen. |
| **Sisi klien** | SDK | Pemadatan | Tersedia di [SDK Python dan TypeScript](/docs/id/api/client-sdks) saat menggunakan [`tool_runner`](/docs/id/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Menghasilkan ringkasan dan mengganti riwayat percakapan lengkap. Lihat [Pemadatan](#client-side-compaction-sdk) di bawah. |

## Strategi sisi server

<Note>
Pengeditan konteks saat ini dalam beta dengan dukungan untuk pembersihan hasil alat dan pembersihan blok pemikiran. Untuk mengaktifkannya, gunakan header beta `context-management-2025-06-27` dalam permintaan API Anda.

Silakan hubungi kami melalui [formulir umpan balik](https://forms.gle/YXC2EKGMhjN1c4L88) kami untuk berbagi umpan balik Anda tentang fitur ini.
</Note>

### Pembersihan hasil alat

Strategi `clear_tool_uses_20250919` menghapus hasil alat ketika konteks percakapan tumbuh melampaui ambang batas yang dikonfigurasi. Ketika diaktifkan, API secara otomatis menghapus hasil alat tertua dalam urutan kronologis, menggantinya dengan teks placeholder untuk memberi tahu Claude bahwa hasil alat telah dihapus. Secara default, hanya hasil alat yang dihapus. Anda dapat secara opsional menghapus hasil alat dan panggilan alat (parameter penggunaan alat) dengan menetapkan `clear_tool_inputs` ke true.

### Pembersihan blok pemikiran

Strategi `clear_thinking_20251015` mengelola blok `thinking` dalam percakapan ketika pemikiran yang diperluas diaktifkan. Strategi ini secara otomatis menghapus blok pemikiran yang lebih lama dari putaran sebelumnya.

<Tip>
**Perilaku default**: Ketika pemikiran yang diperluas diaktifkan tanpa mengonfigurasi strategi `clear_thinking_20251015`, API secara otomatis menyimpan hanya blok pemikiran dari putaran asisten terakhir (setara dengan `keep: {type: "thinking_turns", value: 1}`).

Untuk memaksimalkan cache hits, pertahankan semua blok pemikiran dengan menetapkan `keep: "all"`.
</Tip>

<Note>
Putaran percakapan asisten mungkin mencakup beberapa blok konten (misalnya saat menggunakan alat) dan beberapa blok pemikiran (misalnya dengan [pemikiran yang disisipi](/docs/id/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**Pengeditan konteks terjadi sisi server**

Pengeditan konteks diterapkan **sisi server** sebelum prompt mencapai Claude. Aplikasi klien Anda mempertahankan riwayat percakapan lengkap yang tidak dimodifikasi—Anda tidak perlu menyinkronkan status klien Anda dengan versi yang diedit. Terus kelola riwayat percakapan lengkap Anda secara lokal seperti biasanya.
</Tip>

<Tip>
**Pengeditan konteks dan caching prompt**

Interaksi pengeditan konteks dengan [caching prompt](/docs/id/build-with-claude/prompt-caching) bervariasi menurut strategi:

- **Pembersihan hasil alat**: Membatalkan prefix prompt yang di-cache ketika konten dihapus. Untuk memperhitungkan hal ini, kami merekomendasikan menghapus cukup token untuk membuat pembatalan cache layak dilakukan. Gunakan parameter `clear_at_least` untuk memastikan jumlah token minimum dihapus setiap kali. Anda akan dikenakan biaya penulisan cache setiap kali konten dihapus, tetapi permintaan berikutnya dapat menggunakan kembali prefix yang baru di-cache.

- **Pembersihan blok pemikiran**: Ketika blok pemikiran **disimpan** dalam konteks (tidak dihapus), cache prompt dipertahankan, memungkinkan cache hits dan mengurangi biaya token input. Ketika blok pemikiran **dihapus**, cache dibatalkan pada titik di mana penghapusan terjadi. Konfigurasikan parameter `keep` berdasarkan apakah Anda ingin memprioritaskan kinerja cache atau ketersediaan jendela konteks.
</Tip>

## Model yang didukung

Pengeditan konteks tersedia di:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Penggunaan pembersihan hasil alat

Cara paling sederhana untuk mengaktifkan pembersihan hasil alat adalah dengan menentukan hanya jenis strategi, karena semua [opsi konfigurasi](#configuration-options-for-tool-result-clearing) lainnya akan menggunakan nilai default mereka:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### Konfigurasi lanjutan

Anda dapat menyesuaikan perilaku pembersihan hasil alat dengan parameter tambahan:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## Ikhtisar

Pengeditan konteks memungkinkan Anda mengelola konteks percakapan secara otomatis saat berkembang, membantu Anda mengoptimalkan biaya dan tetap berada dalam batas jendela konteks. Anda dapat menggunakan strategi API sisi server, fitur SDK sisi klien, atau keduanya bersama-sama.

| Pendekatan | Tempat dijalankan | Strategi | Cara kerjanya |
|----------|---------------|------------|--------------|
| **Sisi server** | API | Pembersihan hasil alat (`clear_tool_uses_20250919`)<br/>Pembersihan blok pemikiran (`clear_thinking_20251015`) | Diterapkan sebelum prompt mencapai Claude. Menghapus konten spesifik dari riwayat percakapan. Setiap strategi dapat dikonfigurasi secara independen. |
| **Sisi klien** | SDK | Pemadatan | Tersedia di [Python dan TypeScript SDKs](/docs/id/api/client-sdks) saat menggunakan [`tool_runner`](/docs/id/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Menghasilkan ringkasan dan mengganti riwayat percakapan lengkap. Lihat [Pemadatan](#client-side-compaction-sdk) di bawah. |

## Strategi sisi server

<Note>
Pengeditan konteks saat ini dalam beta dengan dukungan untuk pembersihan hasil alat dan pembersihan blok pemikiran. Untuk mengaktifkannya, gunakan header beta `context-management-2025-06-27` dalam permintaan API Anda.

Silakan hubungi kami melalui [formulir umpan balik](https://forms.gle/YXC2EKGMhjN1c4L88) kami untuk berbagi umpan balik Anda tentang fitur ini.
</Note>

### Pembersihan hasil alat

Strategi `clear_tool_uses_20250919` menghapus hasil alat ketika konteks percakapan tumbuh melampaui ambang batas yang Anda konfigurasi. Ketika diaktifkan, API secara otomatis menghapus hasil alat tertua dalam urutan kronologis, menggantinya dengan teks placeholder untuk membiarkan Claude tahu bahwa hasil alat telah dihapus. Secara default, hanya hasil alat yang dihapus. Anda dapat secara opsional menghapus baik hasil alat maupun panggilan alat (parameter penggunaan alat) dengan menetapkan `clear_tool_inputs` ke true.

### Pembersihan blok pemikiran

Strategi `clear_thinking_20251015` mengelola blok `thinking` dalam percakapan ketika pemikiran yang diperluas diaktifkan. Strategi ini secara otomatis menghapus blok pemikiran yang lebih lama dari giliran sebelumnya.

<Tip>
**Perilaku default**: Ketika pemikiran yang diperluas diaktifkan tanpa mengonfigurasi strategi `clear_thinking_20251015`, API secara otomatis menyimpan hanya blok pemikiran dari giliran asisten terakhir (setara dengan `keep: {type: "thinking_turns", value: 1}`).

Untuk memaksimalkan cache hits, pertahankan semua blok pemikiran dengan menetapkan `keep: "all"`.
</Tip>

<Note>
Giliran percakapan asisten mungkin mencakup beberapa blok konten (misalnya saat menggunakan alat) dan beberapa blok pemikiran (misalnya dengan [pemikiran yang disisipi](/docs/id/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**Pengeditan konteks terjadi sisi server**

Pengeditan konteks diterapkan **sisi server** sebelum prompt mencapai Claude. Aplikasi klien Anda mempertahankan riwayat percakapan lengkap yang tidak dimodifikasi—Anda tidak perlu menyinkronkan status klien Anda dengan versi yang diedit. Terus kelola riwayat percakapan lengkap Anda secara lokal seperti biasanya.
</Tip>

<Tip>
**Pengeditan konteks dan caching prompt**

Interaksi pengeditan konteks dengan [caching prompt](/docs/id/build-with-claude/prompt-caching) bervariasi menurut strategi:

- **Pembersihan hasil alat**: Membatalkan prefiks prompt yang di-cache ketika konten dihapus. Untuk memperhitungkan hal ini, kami merekomendasikan menghapus cukup token untuk membuat pembatalan cache layak dilakukan. Gunakan parameter `clear_at_least` untuk memastikan jumlah token minimum dihapus setiap kali. Anda akan menimbulkan biaya penulisan cache setiap kali konten dihapus, tetapi permintaan berikutnya dapat menggunakan kembali prefiks yang baru di-cache.

- **Pembersihan blok pemikiran**: Ketika blok pemikiran **disimpan** dalam konteks (tidak dihapus), cache prompt dipertahankan, memungkinkan cache hits dan mengurangi biaya token input. Ketika blok pemikiran **dihapus**, cache dibatalkan pada titik di mana pembersihan terjadi. Konfigurasikan parameter `keep` berdasarkan apakah Anda ingin memprioritaskan kinerja cache atau ketersediaan jendela konteks.
</Tip>

## Model yang didukung

Pengeditan konteks tersedia di:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Penggunaan pembersihan hasil alat

Cara paling sederhana untuk mengaktifkan pembersihan hasil alat adalah dengan menentukan hanya jenis strategi, karena semua [opsi konfigurasi](#configuration-options-for-tool-result-clearing) lainnya akan menggunakan nilai default mereka:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### Konfigurasi lanjutan

Anda dapat menyesuaikan perilaku pembersihan hasil alat dengan parameter tambahan:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## Penggunaan pembersihan blok pemikiran

Aktifkan pembersihan blok pemikiran untuk mengelola konteks dan caching prompt secara efektif ketika pemikiran yang diperluas diaktifkan:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 1024,
        "messages": [...],
        "thinking": {
            "type": "enabled",
            "budget_tokens": 10000
        },
        "context_management": {
            "edits": [
                {
                    "type": "clear_thinking_20251015",
                    "keep": {
                        "type": "thinking_turns",
                        "value": 2
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      }
    ]
  }
});
```

</CodeGroup>

### Opsi konfigurasi untuk pembersihan blok pemikiran

Strategi `clear_thinking_20251015` mendukung konfigurasi berikut:

| Opsi konfigurasi | Default | Deskripsi |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Mendefinisikan berapa banyak giliran asisten terbaru dengan blok pemikiran yang akan dipertahankan. Gunakan `{type: "thinking_turns", value: N}` di mana N harus > 0 untuk menyimpan N giliran terakhir, atau `"all"` untuk menyimpan semua blok pemikiran. |

**Contoh konfigurasi:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Opsi konfigurasi untuk pembersihan blok pemikiran

Strategi `clear_thinking_20251015` mendukung konfigurasi berikut:

| Opsi konfigurasi | Default | Deskripsi |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Mendefinisikan berapa banyak giliran asisten terbaru dengan blok pemikiran yang akan dipertahankan. Gunakan `{type: "thinking_turns", value: N}` di mana N harus > 0 untuk menyimpan N giliran terakhir, atau `"all"` untuk menyimpan semua blok pemikiran. |

**Contoh konfigurasi:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Menggabungkan strategi

Anda dapat menggunakan pembersihan blok pemikiran dan pembersihan hasil alat bersama-sama:

<Note>
Saat menggunakan beberapa strategi, strategi `clear_thinking_20251015` harus didaftar terlebih dahulu dalam array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

### Opsi konfigurasi untuk pembersihan blok pemikiran

Strategi `clear_thinking_20251015` mendukung konfigurasi berikut:

| Opsi konfigurasi | Default | Deskripsi |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Mendefinisikan berapa banyak giliran asisten terbaru dengan blok pemikiran yang akan dipertahankan. Gunakan `{type: "thinking_turns", value: N}` di mana N harus > 0 untuk menyimpan N giliran terakhir, atau `"all"` untuk menyimpan semua blok pemikiran. |

**Contoh konfigurasi:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Menggabungkan strategi

Anda dapat menggunakan pembersihan blok pemikiran dan pembersihan hasil alat bersama-sama:

<Note>
Saat menggunakan beberapa strategi, strategi `clear_thinking_20251015` harus didaftar terlebih dahulu dalam array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Opsi konfigurasi untuk pembersihan hasil alat

| Opsi konfigurasi | Default | Deskripsi |
|---------------------|---------|-------------|
| `trigger` | 100.000 token input | Mendefinisikan kapan strategi pengeditan konteks diaktifkan. Setelah prompt melebihi ambang batas ini, pembersihan akan dimulai. Anda dapat menentukan nilai ini dalam `input_tokens` atau `tool_uses`. |
| `keep` | 3 penggunaan alat | Mendefinisikan berapa banyak pasangan penggunaan alat/hasil terbaru yang akan disimpan setelah pembersihan terjadi. API menghapus interaksi alat tertua terlebih dahulu, menyimpan yang paling baru. |
| `clear_at_least` | Tidak ada | Memastikan jumlah token minimum dihapus setiap kali strategi diaktifkan. Jika API tidak dapat menghapus setidaknya jumlah yang ditentukan, strategi tidak akan diterapkan. Ini membantu menentukan apakah pembersihan konteks layak untuk memecahkan cache prompt Anda. |
| `exclude_tools` | Tidak ada | Daftar nama alat yang penggunaan alat dan hasilnya tidak boleh pernah dihapus. Berguna untuk menyimpan konteks penting. |
| `clear_tool_inputs` | `false` | Mengontrol apakah parameter panggilan alat dihapus bersama dengan hasil alat. Secara default, hanya hasil alat yang dihapus sambil menjaga panggilan alat asli Claude tetap terlihat. |

### Opsi konfigurasi untuk pembersihan blok pemikiran

Strategi `clear_thinking_20251015` mendukung konfigurasi berikut:

| Opsi konfigurasi | Default | Deskripsi |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Mendefinisikan berapa banyak giliran asisten terbaru dengan blok pemikiran yang akan dipertahankan. Gunakan `{type: "thinking_turns", value: N}` di mana N harus > 0 untuk menyimpan N giliran terakhir, atau `"all"` untuk menyimpan semua blok pemikiran. |

**Contoh konfigurasi:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Menggabungkan strategi

Anda dapat menggunakan pembersihan blok pemikiran dan pembersihan hasil alat bersama-sama:

<Note>
Saat menggunakan beberapa strategi, strategi `clear_thinking_20251015` harus didaftar terlebih dahulu dalam array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Opsi konfigurasi untuk pembersihan hasil alat

| Opsi konfigurasi | Default | Deskripsi |
|---------------------|---------|-------------|
| `trigger` | 100.000 token input | Mendefinisikan kapan strategi pengeditan konteks diaktifkan. Setelah prompt melebihi ambang batas ini, pembersihan akan dimulai. Anda dapat menentukan nilai ini dalam `input_tokens` atau `tool_uses`. |
| `keep` | 3 penggunaan alat | Mendefinisikan berapa banyak pasangan penggunaan alat/hasil terbaru yang akan disimpan setelah pembersihan terjadi. API menghapus interaksi alat tertua terlebih dahulu, menyimpan yang paling baru. |
| `clear_at_least` | Tidak ada | Memastikan jumlah token minimum dihapus setiap kali strategi diaktifkan. Jika API tidak dapat menghapus setidaknya jumlah yang ditentukan, strategi tidak akan diterapkan. Ini membantu menentukan apakah pembersihan konteks layak untuk memecahkan cache prompt Anda. |
| `exclude_tools` | Tidak ada | Daftar nama alat yang penggunaan alat dan hasilnya tidak boleh pernah dihapus. Berguna untuk menyimpan konteks penting. |
| `clear_tool_inputs` | `false` | Mengontrol apakah parameter panggilan alat dihapus bersama dengan hasil alat. Secara default, hanya hasil alat yang dihapus sambil menjaga panggilan alat asli Claude tetap terlihat. |

## Respons pengeditan konteks

Anda dapat melihat pengeditan konteks mana yang diterapkan pada permintaan Anda menggunakan bidang respons `context_management`, bersama dengan statistik yang membantu tentang konten dan token input yang dihapus.

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // When using `clear_thinking_20251015`
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // When using `clear_tool_uses_20250919`
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

Untuk respons streaming, pengeditan konteks akan disertakan dalam acara `message_delta` terakhir:

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

### Opsi konfigurasi untuk penghapusan blok pemikiran

Strategi `clear_thinking_20251015` mendukung konfigurasi berikut:

| Opsi konfigurasi | Default | Deskripsi |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Menentukan berapa banyak putaran asisten terbaru dengan blok pemikiran yang akan dipertahankan. Gunakan `{type: "thinking_turns", value: N}` di mana N harus > 0 untuk mempertahankan N putaran terakhir, atau `"all"` untuk mempertahankan semua blok pemikiran. |

**Contoh konfigurasi:**

```json
// Pertahankan blok pemikiran dari 3 putaran asisten terakhir
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Pertahankan semua blok pemikiran (memaksimalkan cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Menggabungkan strategi

Anda dapat menggunakan penghapusan blok pemikiran dan penghapusan hasil alat bersama-sama:

<Note>
Saat menggunakan beberapa strategi, strategi `clear_thinking_20251015` harus didaftarkan terlebih dahulu dalam array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Opsi konfigurasi untuk penghapusan hasil alat

| Opsi konfigurasi | Default | Deskripsi |
|---------------------|---------|-------------|
| `trigger` | 100.000 token input | Menentukan kapan strategi pengeditan konteks diaktifkan. Setelah prompt melebihi ambang batas ini, penghapusan akan dimulai. Anda dapat menentukan nilai ini dalam `input_tokens` atau `tool_uses`. |
| `keep` | 3 penggunaan alat | Menentukan berapa banyak pasangan penggunaan alat/hasil terbaru yang akan dipertahankan setelah penghapusan terjadi. API menghapus interaksi alat tertua terlebih dahulu, mempertahankan yang paling baru. |
| `clear_at_least` | Tidak ada | Memastikan jumlah token minimum dihapus setiap kali strategi diaktifkan. Jika API tidak dapat menghapus setidaknya jumlah yang ditentukan, strategi tidak akan diterapkan. Ini membantu menentukan apakah penghapusan konteks layak memecahkan cache prompt Anda. |
| `exclude_tools` | Tidak ada | Daftar nama alat yang penggunaan alat dan hasilnya tidak boleh pernah dihapus. Berguna untuk mempertahankan konteks penting. |
| `clear_tool_inputs` | `false` | Mengontrol apakah parameter panggilan alat dihapus bersama dengan hasil alat. Secara default, hanya hasil alat yang dihapus sambil menjaga panggilan alat asli Claude tetap terlihat. |

## Respons pengeditan konteks

Anda dapat melihat pengeditan konteks mana yang diterapkan pada permintaan Anda menggunakan field respons `context_management`, bersama dengan statistik berguna tentang konten dan token input yang dihapus.

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // Saat menggunakan `clear_thinking_20251015`
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // Saat menggunakan `clear_tool_uses_20250919`
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

Untuk respons streaming, pengeditan konteks akan disertakan dalam event `message_delta` terakhir:

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

## Penghitungan token

Endpoint [penghitungan token](/docs/id/build-with-claude/token-counting) mendukung manajemen konteks, memungkinkan Anda melihat pratinjau berapa banyak token yang akan digunakan prompt Anda setelah pengeditan konteks diterapkan.

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages/count_tokens \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "messages": [
            {
                "role": "user",
                "content": "Continue our conversation..."
            }
        ],
        "tools": [...],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 5
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.count_tokens(
    model="claude-sonnet-4-5",
    messages=[
        {
            "role": "user",
            "content": "Continue our conversation..."
        }
    ],
    tools=[...],  # Your tool definitions
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)

print(f"Original tokens: {response.context_management['original_input_tokens']}")
print(f"After clearing: {response.input_tokens}")
print(f"Savings: {response.context_management['original_input_tokens'] - response.input_tokens} tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.countTokens({
  model: "claude-sonnet-4-5",
  messages: [
    {
      role: "user",
      content: "Continue our conversation..."
    }
  ],
  tools: [...],  // Your tool definitions
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});

console.log(`Original tokens: ${response.context_management?.original_input_tokens}`);
console.log(`After clearing: ${response.input_tokens}`);
console.log(`Savings: ${(response.context_management?.original_input_tokens || 0) - response.input_tokens} tokens`);
```
</CodeGroup>

```json Response
{
    "input_tokens": 25000,
    "context_management": {
        "original_input_tokens": 70000
    }
}
```

Respons menunjukkan baik jumlah token akhir setelah manajemen konteks diterapkan (`input_tokens`) dan jumlah token asli sebelum penghapusan apa pun terjadi (`original_input_tokens`).

## Menggunakan dengan Alat Memori

Pengeditan konteks dapat digabungkan dengan [alat memori](/docs/id/agents-and-tools/tool-use/memory-tool). Ketika konteks percakapan Anda mendekati ambang batas penghapusan yang dikonfigurasi, Claude menerima peringatan otomatis untuk mempertahankan informasi penting. Ini memungkinkan Claude menyimpan hasil alat atau konteks ke file memori sebelum dihapus dari riwayat percakapan.

Kombinasi ini memungkinkan Anda untuk:

- **Mempertahankan konteks penting**: Claude dapat menulis informasi penting dari hasil alat ke file memori sebelum hasil tersebut dihapus
- **Mempertahankan alur kerja jangka panjang**: Aktifkan alur kerja agentic yang sebaliknya akan melebihi batas konteks dengan memindahkan informasi ke penyimpanan persisten
- **Mengakses informasi sesuai permintaan**: Claude dapat mencari informasi yang sebelumnya dihapus dari file memori saat diperlukan, daripada menyimpan semuanya di jendela konteks aktif

Misalnya, dalam alur kerja pengeditan file di mana Claude melakukan banyak operasi, Claude dapat merangkum perubahan yang selesai ke file memori saat konteks berkembang. Ketika hasil alat dihapus, Claude mempertahankan akses ke informasi tersebut melalui sistem memorinya dan dapat terus bekerja secara efektif.

Untuk menggunakan kedua fitur bersama-sama, aktifkan keduanya dalam permintaan API Anda:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## Pemadatan sisi klien (SDK)

<Note>
Pemadatan tersedia di [SDK Python dan TypeScript](/docs/id/api/client-sdks) saat menggunakan [metode `tool_runner`](/docs/id/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta).
</Note>

Pemadatan adalah fitur SDK yang secara otomatis mengelola konteks percakapan dengan menghasilkan ringkasan ketika penggunaan token terlalu besar. Tidak seperti strategi pengeditan konteks sisi server yang menghapus konten, pemadatan menginstruksikan Claude untuk merangkum riwayat percakapan, kemudian mengganti riwayat lengkap dengan ringkasan tersebut. Ini memungkinkan Claude untuk terus mengerjakan tugas jangka panjang yang sebaliknya akan melebihi [jendela konteks](/docs/id/build-with-claude/context-windows).

### Cara kerja pemadatan

Ketika pemadatan diaktifkan, SDK memantau penggunaan token setelah setiap respons model:

1. **Pemeriksaan ambang batas**: SDK menghitung total token sebagai `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **Pembuatan ringkasan**: Ketika ambang batas terlampaui, prompt ringkasan disuntikkan sebagai putaran pengguna, dan Claude menghasilkan ringkasan terstruktur yang dibungkus dalam tag `<summary></summary>`
3. **Penggantian konteks**: SDK mengekstrak ringkasan dan mengganti seluruh riwayat pesan dengannya
4. **Kelanjutan**: Percakapan dilanjutkan dari ringkasan, dengan Claude melanjutkan dari tempat ia berhenti

### Menggunakan pemadatan

Tambahkan `compaction_control` ke panggilan `tool_runner` Anda:

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### Apa yang terjadi selama pemadatan

Saat percakapan berkembang, riwayat pesan terakumulasi:

**Sebelum pemadatan (mendekati 100k token):**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

Ketika token melebihi ambang batas, SDK menyuntikkan permintaan ringkasan dan Claude menghasilkan ringkasan. Seluruh riwayat kemudian diganti:

**Setelah pemadatan (kembali ke ~2-3k token):**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude terus bekerja dari ringkasan ini seolah-olah itu adalah riwayat percakapan asli.

### Opsi konfigurasi

| Parameter | Tipe | Diperlukan | Default | Deskripsi |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | Ya | - | Apakah akan mengaktifkan pemadatan otomatis |
| `context_token_threshold` | number | Tidak | 100.000 | Jumlah token di mana pemadatan dipicu |
| `model` | string | Tidak | Model yang sama seperti model utama | Model yang digunakan untuk menghasilkan ringkasan |
| `summary_prompt` | string | Tidak | Lihat di bawah | Prompt khusus untuk pembuatan ringkasan |

#### Memilih ambang batas token

Ambang batas menentukan kapan pemadatan terjadi. Ambang batas yang lebih rendah berarti pemadatan lebih sering dengan jendela konteks yang lebih kecil. Ambang batas yang lebih tinggi memungkinkan lebih banyak konteks tetapi berisiko mencapai batas.

<CodeGroup>

```python Python
# Pemadatan lebih sering untuk skenario dengan keterbatasan memori
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Pemadatan lebih jarang ketika Anda membutuhkan lebih banyak konteks
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// Pemadatan lebih sering untuk skenario dengan keterbatasan memori
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Pemadatan lebih jarang ketika Anda membutuhkan lebih banyak konteks
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### Menggunakan model berbeda untuk ringkasan

Anda dapat menggunakan model yang lebih cepat atau lebih murah untuk menghasilkan ringkasan:

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### Prompt ringkasan khusus

Anda dapat memberikan prompt khusus untuk kebutuhan spesifik domain. Prompt Anda harus menginstruksikan Claude untuk membungkus ringkasannya dalam tag `<summary></summary>`.

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

## Menggunakan dengan Alat Memori

Pengeditan konteks dapat digabungkan dengan [alat memori](/docs/id/agents-and-tools/tool-use/memory-tool). Ketika konteks percakapan Anda mendekati ambang batas pembersihan yang dikonfigurasi, Claude menerima peringatan otomatis untuk menyimpan informasi penting. Ini memungkinkan Claude untuk menyimpan hasil alat atau konteks ke file memorinya sebelum dihapus dari riwayat percakapan.

Kombinasi ini memungkinkan Anda untuk:

- **Menyimpan konteks penting**: Claude dapat menulis informasi penting dari hasil alat ke file memori sebelum hasil tersebut dihapus
- **Mempertahankan alur kerja jangka panjang**: Aktifkan alur kerja agentic yang sebaliknya akan melampaui batas konteks dengan memindahkan informasi ke penyimpanan persisten
- **Mengakses informasi sesuai permintaan**: Claude dapat mencari informasi yang sebelumnya dihapus dari file memori saat diperlukan, daripada menyimpan semuanya di jendela konteks aktif

Misalnya, dalam alur kerja pengeditan file di mana Claude melakukan banyak operasi, Claude dapat merangkum perubahan yang selesai ke file memori saat konteks berkembang. Ketika hasil alat dihapus, Claude mempertahankan akses ke informasi tersebut melalui sistem memorinya dan dapat terus bekerja secara efektif.

Untuk menggunakan kedua fitur bersama-sama, aktifkan keduanya dalam permintaan API Anda:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## Pemadatan sisi klien (SDK)

<Note>
Pemadatan tersedia di [SDK Python dan TypeScript](/docs/id/api/client-sdks) saat menggunakan [metode `tool_runner`](/docs/id/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta).
</Note>

Pemadatan adalah fitur SDK yang secara otomatis mengelola konteks percakapan dengan menghasilkan ringkasan ketika penggunaan token tumbuh terlalu besar. Tidak seperti strategi pengeditan konteks sisi server yang menghapus konten, pemadatan menginstruksikan Claude untuk merangkum riwayat percakapan, kemudian mengganti riwayat lengkap dengan ringkasan tersebut. Ini memungkinkan Claude untuk terus bekerja pada tugas jangka panjang yang sebaliknya akan melampaui [jendela konteks](/docs/id/build-with-claude/context-windows).

### Cara kerja pemadatan

Ketika pemadatan diaktifkan, SDK memantau penggunaan token setelah setiap respons model:

1. **Pemeriksaan ambang batas**: SDK menghitung total token sebagai `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **Pembuatan ringkasan**: Ketika ambang batas terlampaui, prompt ringkasan disuntikkan sebagai giliran pengguna, dan Claude menghasilkan ringkasan terstruktur yang dibungkus dalam tag `<summary></summary>`
3. **Penggantian konteks**: SDK mengekstrak ringkasan dan mengganti seluruh riwayat pesan dengannya
4. **Kelanjutan**: Percakapan dilanjutkan dari ringkasan, dengan Claude melanjutkan dari tempat ia berhenti

### Menggunakan pemadatan

Tambahkan `compaction_control` ke panggilan `tool_runner` Anda:

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### Apa yang terjadi selama pemadatan

Seiring pertumbuhan percakapan, riwayat pesan terakumulasi:

**Sebelum pemadatan (mendekati 100k token):**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

Ketika token melebihi ambang batas, SDK menyuntikkan permintaan ringkasan dan Claude menghasilkan ringkasan. Seluruh riwayat kemudian diganti:

**Setelah pemadatan (kembali ke ~2-3k token):**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude melanjutkan bekerja dari ringkasan ini seolah-olah itu adalah riwayat percakapan asli.

### Opsi konfigurasi

| Parameter | Tipe | Diperlukan | Default | Deskripsi |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | Ya | - | Apakah akan mengaktifkan pemadatan otomatis |
| `context_token_threshold` | number | Tidak | 100,000 | Jumlah token di mana pemadatan dipicu |
| `model` | string | Tidak | Model yang sama dengan model utama | Model yang digunakan untuk menghasilkan ringkasan |
| `summary_prompt` | string | Tidak | Lihat di bawah | Prompt khusus untuk pembuatan ringkasan |

#### Memilih ambang batas token

Ambang batas menentukan kapan pemadatan terjadi. Ambang batas yang lebih rendah berarti pemadatan lebih sering dengan jendela konteks yang lebih kecil. Ambang batas yang lebih tinggi memungkinkan lebih banyak konteks tetapi berisiko mencapai batas.

<CodeGroup>

```python Python
# More frequent compaction for memory-constrained scenarios
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Less frequent compaction when you need more context
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// More frequent compaction for memory-constrained scenarios
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Less frequent compaction when you need more context
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### Menggunakan model berbeda untuk ringkasan

Anda dapat menggunakan model yang lebih cepat atau lebih murah untuk menghasilkan ringkasan:

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### Prompt ringkasan khusus

Anda dapat memberikan prompt khusus untuk kebutuhan spesifik domain. Prompt Anda harus menginstruksikan Claude untuk membungkus ringkasannya dalam tag `<summary></summary>`.

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

### Prompt ringkasan default

Prompt ringkasan bawaan menginstruksikan Claude untuk membuat ringkasan kelanjutan terstruktur yang mencakup:

1. **Ikhtisar Tugas**: Permintaan inti pengguna, kriteria kesuksesan, dan batasan
2. **Status Saat Ini**: Apa yang telah diselesaikan, file yang dimodifikasi, dan artefak yang dihasilkan
3. **Penemuan Penting**: Batasan teknis, keputusan yang dibuat, kesalahan yang diselesaikan, dan pendekatan yang gagal
4. **Langkah Berikutnya**: Tindakan spesifik yang diperlukan, pemblokir, dan urutan prioritas
5. **Konteks untuk Dipertahankan**: Preferensi pengguna, detail spesifik domain, dan komitmen yang dibuat

Struktur ini memungkinkan Claude untuk melanjutkan pekerjaan secara efisien tanpa kehilangan konteks penting atau mengulangi kesalahan.

<section title="Lihat prompt default lengkap">

```
You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:

1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified

2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced

3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)

4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain

5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user

Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.

Wrap your summary in <summary></summary> tags.
```

</section>

### Keterbatasan

#### Alat sisi server

<Warning>
Pemadatan memerlukan pertimbangan khusus saat menggunakan alat sisi server seperti [pencarian web](/docs/id/agents-and-tools/tool-use/web-search-tool) atau [pengambilan web](/docs/id/agents-and-tools/tool-use/web-fetch-tool).
</Warning>

Saat menggunakan alat sisi server, SDK mungkin menghitung penggunaan token secara tidak benar, menyebabkan pemadatan dipicu pada waktu yang salah.

Misalnya, setelah operasi pencarian web, respons API mungkin menunjukkan:

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

SDK menghitung total penggunaan sebagai 63.000 + 270.000 = 333.000 token. Namun, nilai `cache_read_input_tokens` mencakup pembacaan terakumulasi dari beberapa panggilan API internal yang dibuat oleh alat sisi server, bukan konteks percakapan aktual Anda. Panjang konteks nyata Anda mungkin hanya 63.000 `input_tokens`, tetapi SDK melihat 333k dan memicu pemadatan secara prematur.

**Solusi alternatif:**

- Gunakan titik akhir [penghitungan token](/docs/id/build-with-claude/token-counting) untuk mendapatkan panjang konteks yang akurat
- Hindari pemadatan saat menggunakan alat sisi server secara ekstensif

#### Kasus tepi penggunaan alat

Ketika pemadatan dipicu saat respons penggunaan alat tertunda, SDK menghapus blok penggunaan alat dari riwayat pesan sebelum menghasilkan ringkasan. Claude akan mengeluarkan kembali panggilan alat setelah melanjutkan dari ringkasan jika masih diperlukan.

### Pemantauan pemadatan

Aktifkan logging untuk melacak kapan pemadatan terjadi:

<CodeGroup>

```python Python
import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger("anthropic.lib.tools").setLevel(logging.INFO)

# Logs will show:
# INFO: Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
# INFO: Compaction complete. New token usage: 2500
```

```typescript TypeScript
// The SDK logs compaction events to the console
// You'll see messages like:
// Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
// Compaction complete. New token usage: 2500
```

</CodeGroup>

### Kapan menggunakan pemadatan

**Kasus penggunaan yang baik:**

- Tugas agen jangka panjang yang memproses banyak file atau sumber data
- Alur kerja penelitian yang mengumpulkan sejumlah besar informasi
- Tugas multi-langkah dengan kemajuan yang jelas dan terukur
- Tugas yang menghasilkan artefak (file, laporan) yang bertahan di luar percakapan

**Kasus penggunaan yang kurang ideal:**

- Tugas yang memerlukan ingatan presisi dari detail percakapan awal
- Alur kerja yang menggunakan alat sisi server secara ekstensif
- Tugas yang perlu mempertahankan status yang tepat di banyak variabel