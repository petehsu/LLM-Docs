# Pemanggilan alat secara terprogram

Memungkinkan Claude menulis kode yang memanggil alat Anda secara terprogram dalam kontainer eksekusi kode, mengurangi latensi dan konsumsi token.

---

Pemanggilan alat secara terprogram memungkinkan Claude menulis kode yang memanggil alat Anda secara terprogram dalam kontainer [eksekusi kode](/docs/id/agents-and-tools/tool-use/code-execution-tool), daripada memerlukan putaran bolak-balik melalui model untuk setiap pemanggilan alat. Ini mengurangi latensi untuk alur kerja multi-alat dan mengurangi konsumsi token dengan memungkinkan Claude memfilter atau memproses data sebelum mencapai jendela konteks model.

<Note>
Pemanggilan alat secara terprogram saat ini dalam beta publik.

Untuk menggunakan fitur ini, tambahkan [header beta](/docs/id/api/beta-headers) `"advanced-tool-use-2025-11-20"` ke permintaan API Anda.

Fitur ini memerlukan alat eksekusi kode untuk diaktifkan.
</Note>

## Kompatibilitas model

Pemanggilan alat secara terprogram tersedia di model berikut:

| Model | Versi Alat |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |

<Warning>
Pemanggilan alat secara terprogram tersedia melalui Claude API dan Microsoft Foundry.
</Warning>

## Mulai cepat

Berikut adalah contoh sederhana di mana Claude secara terprogram menanyakan database beberapa kali dan mengagregasi hasil:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
            }
        ],
        "tools": [
            {
                "type": "code_execution_20250825",
                "name": "code_execution"
            },
            {
                "name": "query_database",
                "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "sql": {
                            "type": "string",
                            "description": "SQL query to execute"
                        }
                    },
                    "required": ["sql"]
                },
                "allowed_callers": ["code_execution_20250825"]
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "sql": {
                        "type": "string",
                        "description": "SQL query to execute"
                    }
                },
                "required": ["sql"]
            },
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
      }
    ],
    tools: [
      {
        type: "code_execution_20250825",
        name: "code_execution"
      },
      {
        name: "query_database",
        description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        input_schema: {
          type: "object",
          properties: {
            sql: {
              type: "string",
              description: "SQL query to execute"
            }
          },
          required: ["sql"]
        },
        allowed_callers: ["code_execution_20250825"]
      }
    ]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## Cara kerja pemanggilan alat secara terprogram

Ketika Anda mengonfigurasi alat untuk dapat dipanggil dari eksekusi kode dan Claude memutuskan untuk menggunakan alat tersebut:

1. Claude menulis kode Python yang memanggil alat sebagai fungsi, berpotensi termasuk beberapa pemanggilan alat dan logika pra/pasca-pemrosesan
2. Claude menjalankan kode ini dalam kontainer bersandal melalui eksekusi kode
3. Ketika fungsi alat dipanggil, eksekusi kode dijeda dan API mengembalikan blok `tool_use`
4. Anda memberikan hasil alat, dan eksekusi kode berlanjut (hasil perantara tidak dimuat ke jendela konteks Claude)
5. Setelah semua eksekusi kode selesai, Claude menerima output akhir dan melanjutkan pekerjaan pada tugas

Pendekatan ini sangat berguna untuk:
- **Pemrosesan data besar**: Filtrasi atau agregasi hasil alat sebelum mencapai konteks Claude
- **Alur kerja multi-langkah**: Hemat token dan latensi dengan memanggil alat secara serial atau dalam loop tanpa sampling Claude di antara pemanggilan alat
- **Logika bersyarat**: Buat keputusan berdasarkan hasil alat perantara

<Note>
Alat khusus dikonversi ke fungsi Python asinkron untuk mendukung pemanggilan alat paralel. Ketika Claude menulis kode yang memanggil alat Anda, ia menggunakan `await` (misalnya, `result = await query_database("<sql>")`) dan secara otomatis menyertakan fungsi pembungkus asinkron yang sesuai.

Pembungkus asinkron dihilangkan dari contoh kode dalam dokumentasi ini untuk kejelasan.
</Note>

## Konsep inti

### Bidang `allowed_callers`

Bidang `allowed_callers` menentukan konteks mana yang dapat memanggil alat:

```json
{
  "name": "query_database",
  "description": "Execute a SQL query against the database",
  "input_schema": {...},
  "allowed_callers": ["code_execution_20250825"]
}
```

**Nilai yang mungkin:**
- `["direct"]` - Hanya Claude yang dapat memanggil alat ini secara langsung (default jika dihilangkan)
- `["code_execution_20250825"]` - Hanya dapat dipanggil dari dalam eksekusi kode
- `["direct", "code_execution_20250825"]` - Dapat dipanggil baik secara langsung maupun dari eksekusi kode

<Tip>
Kami merekomendasikan memilih baik `["direct"]` atau `["code_execution_20250825"]` untuk setiap alat daripada mengaktifkan keduanya, karena ini memberikan panduan yang lebih jelas kepada Claude tentang cara terbaik menggunakan alat.
</Tip>

### Bidang `caller` dalam respons

Setiap blok penggunaan alat menyertakan bidang `caller` yang menunjukkan cara dipanggil:

**Pemanggilan langsung (penggunaan alat tradisional):**
```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {"type": "direct"}
}
```

**Pemanggilan terprogram:**
```json
{
  "type": "tool_use",
  "id": "toolu_xyz789",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_abc123"
  }
}
```

`tool_id` mereferensikan alat eksekusi kode yang membuat pemanggilan terprogram.

### Siklus hidup kontainer

Pemanggilan alat secara terprogram menggunakan kontainer yang sama dengan eksekusi kode:

- **Pembuatan kontainer**: Kontainer baru dibuat untuk setiap sesi kecuali Anda menggunakan kembali yang sudah ada
- **Kedaluwarsa**: Kontainer kedaluwarsa setelah sekitar 4,5 menit tidak aktif (dapat berubah)
- **ID Kontainer**: Dikembalikan dalam respons melalui bidang `container`
- **Penggunaan kembali**: Teruskan ID kontainer untuk mempertahankan status di seluruh permintaan

<Warning>
Ketika alat dipanggil secara terprogram dan kontainer menunggu hasil alat Anda, Anda harus merespons sebelum kontainer kedaluwarsa. Pantau bidang `expires_at`. Jika kontainer kedaluwarsa, Claude mungkin memperlakukan pemanggilan alat sebagai waktu habis dan mencoba lagi.
</Warning>

## Alur kerja contoh

Berikut adalah cara alur pemanggilan alat secara terprogram yang lengkap bekerja:

### Langkah 1: Permintaan awal

Kirim permintaan dengan eksekusi kode dan alat yang memungkinkan pemanggilan terprogram. Untuk mengaktifkan pemanggilan terprogram, tambahkan bidang `allowed_callers` ke definisi alat Anda.

<Note>
Berikan deskripsi terperinci tentang format output alat Anda dalam deskripsi alat. Jika Anda menentukan bahwa alat mengembalikan JSON, Claude akan mencoba mendeserialisasi dan memproses hasilnya dalam kode. Semakin detail yang Anda berikan tentang skema output, semakin baik Claude dapat menangani respons secara terprogram.
</Note>

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
  }],
  tools: [
    {
      type: "code_execution_20250825",
      name: "code_execution"
    },
    {
      name: "query_database",
      description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
      input_schema: {...},
      allowed_callers: ["code_execution_20250825"]
    }
  ]
});
```
</CodeGroup>

### Langkah 2: Respons API dengan pemanggilan alat

Claude menulis kode yang memanggil alat Anda. API dijeda dan mengembalikan:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll query the purchase history and analyze the results."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_abc123",
      "name": "code_execution",
      "input": {
        "code": "results = await query_database('<sql>')\ntop_customers = sorted(results, key=lambda x: x['revenue'], reverse=True)[:5]\nprint(f'Top 5 customers: {top_customers}')"
      }
    },
    {
      "type": "tool_use",
      "id": "toolu_def456",
      "name": "query_database",
      "input": {"sql": "\<sql\>"},
      "caller": {
        "type": "code_execution_20250825",
        "tool_id": "srvtoolu_abc123"
      }
    }
  ],
  "container": {
    "id": "container_xyz789",
    "expires_at": "2025-01-15T14:30:00Z"
  },
  "stop_reason": "tool_use"
}
```

### Langkah 3: Berikan hasil alat

Sertakan riwayat percakapan lengkap ditambah hasil alat Anda:

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    container="container_xyz789",  # Reuse the container
    messages=[
        {"role": "user", "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"},
        {
            "role": "assistant",
            "content": [
                {"type": "text", "text": "I'll query the purchase history and analyze the results."},
                {
                    "type": "server_tool_use",
                    "id": "srvtoolu_abc123",
                    "name": "code_execution",
                    "input": {"code": "..."}
                },
                {
                    "type": "tool_use",
                    "id": "toolu_def456",
                    "name": "query_database",
                    "input": {"sql": "\<sql\>"},
                    "caller": {
                        "type": "code_execution_20250825",
                        "tool_id": "srvtoolu_abc123"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_def456",
                    "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
                }
            ]
        }
    ],
    tools=[...]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  container: "container_xyz789",  // Reuse the container
  messages: [
    { role: "user", content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue" },
    {
      role: "assistant",
      content: [
        { type: "text", text: "I'll query the purchase history and analyze the results." },
        {
          type: "server_tool_use",
          id: "srvtoolu_abc123",
          name: "code_execution",
          input: { code: "..." }
        },
        {
          type: "tool_use",
          id: "toolu_def456",
          name: "query_database",
          input: { sql: "\<sql\>" },
          caller: {
            type: "code_execution_20250825",
            tool_id: "srvtoolu_abc123"
          }
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: "toolu_def456",
          content: "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
        }
      ]
    }
  ],
  tools: [...]
});
```
</CodeGroup>

### Langkah 4: Pemanggilan alat berikutnya atau penyelesaian

Eksekusi kode berlanjut dan memproses hasil. Jika pemanggilan alat tambahan diperlukan, ulangi Langkah 3 hingga semua pemanggilan alat terpenuhi.

### Langkah 5: Respons akhir

Setelah eksekusi kode selesai, Claude memberikan respons akhir:

```json
{
  "content": [
    {
      "type": "code_execution_tool_result",
      "tool_use_id": "srvtoolu_abc123",
      "content": {
        "type": "code_execution_result",
        "stdout": "Top 5 customers by revenue:\n1. Customer C1: $45,000\n2. Customer C2: $38,000\n3. Customer C5: $32,000\n4. Customer C8: $28,500\n5. Customer C3: $24,000",
        "stderr": "",
        "return_code": 0,
        "content": []
      }
    },
    {
      "type": "text",
      "text": "I've analyzed the purchase history from last quarter. Your top 5 customers generated $167,500 in total revenue, with Customer C1 leading at $45,000."
    }
  ],
  "stop_reason": "end_turn"
}
```

## Pola lanjutan

### Pemrosesan batch dengan loop

Claude dapat menulis kode yang memproses beberapa item secara efisien:

```python
# async wrapper omitted for clarity
regions = ["West", "East", "Central", "North", "South"]
results = {}
for region in regions:
    data = await query_database(f"<sql for {region}>")
    results[region] = sum(row["revenue"] for row in data)

# Process results programmatically
top_region = max(results.items(), key=lambda x: x[1])
print(f"Top region: {top_region[0]} with ${top_region[1]:,} in revenue")
```

Pola ini:
- Mengurangi putaran model dari N (satu per wilayah) menjadi 1
- Memproses set hasil besar secara terprogram sebelum kembali ke Claude
- Menghemat token dengan hanya mengembalikan kesimpulan yang diagregasi daripada data mentah

### Penghentian awal

Claude dapat berhenti memproses segera setelah kriteria kesuksesan terpenuhi:

```python
# async wrapper omitted for clarity
endpoints = ["us-east", "eu-west", "apac"]
for endpoint in endpoints:
    status = await check_health(endpoint)
    if status == "healthy":
        print(f"Found healthy endpoint: {endpoint}")
        break  # Stop early, don't check remaining
```

### Pemilihan alat bersyarat

```python
# async wrapper omitted for clarity
file_info = await get_file_info(path)
if file_info["size"] < 10000:
    content = await read_full_file(path)
else:
    content = await read_file_summary(path)
print(content)
```

### Penyaringan data

```python
# async wrapper omitted for clarity
logs = await fetch_logs(server_id)
errors = [log for log in logs if "ERROR" in log]
print(f"Found {len(errors)} errors")
for error in errors[-10:]:  # Only return last 10 errors
    print(error)
```

## Format respons

### Pemanggilan alat terprogram

Ketika eksekusi kode memanggil alat:

```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_xyz789"
  }
}
```

### Penanganan hasil alat

Hasil alat Anda dilewatkan kembali ke kode yang sedang berjalan:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_abc123",
      "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000, \"orders\": 23}, {\"customer_id\": \"C2\", \"revenue\": 38000, \"orders\": 18}, ...]"
    }
  ]
}
```

### Penyelesaian eksekusi kode

Ketika semua pemanggilan alat terpenuhi dan kode selesai:

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_xyz789",
  "content": {
    "type": "code_execution_result",
    "stdout": "Analysis complete. Top 5 customers identified from 847 total records.",
    "stderr": "",
    "return_code": 0,
    "content": []
  }
}
```

## Penanganan kesalahan

### Kesalahan umum

| Kesalahan | Deskripsi | Solusi |
|-------|-------------|----------|
| `invalid_tool_input` | Input alat tidak cocok dengan skema | Validasi input_schema alat Anda |
| `tool_not_allowed` | Alat tidak memungkinkan jenis pemanggil yang diminta | Periksa `allowed_callers` mencakup konteks yang tepat |
| `missing_beta_header` | Header beta PTC tidak disediakan | Tambahkan kedua header beta ke permintaan Anda |

### Kedaluwarsa kontainer selama pemanggilan alat

Jika alat Anda memakan waktu terlalu lama untuk merespons, eksekusi kode akan menerima `TimeoutError`. Claude melihat ini di stderr dan biasanya akan mencoba lagi:

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_abc123",
  "content": {
    "type": "code_execution_result",
    "stdout": "",
    "stderr": "TimeoutError: Calling tool ['query_database'] timed out.",
    "return_code": 0,
    "content": []
  }
}
```

Untuk mencegah waktu habis:
- Pantau bidang `expires_at` dalam respons
- Implementasikan waktu habis untuk eksekusi alat Anda
- Pertimbangkan untuk memecah operasi panjang menjadi potongan yang lebih kecil

### Kesalahan eksekusi alat

Jika alat Anda mengembalikan kesalahan:

```python
# Provide error information in the tool result
{
    "type": "tool_result",
    "tool_use_id": "toolu_abc123",
    "content": "Error: Query timeout - table lock exceeded 30 seconds"
}
```

Kode Claude akan menerima kesalahan ini dan dapat menanganinya dengan tepat.

## Batasan dan keterbatasan

### Ketidakcocokan fitur

- **Output terstruktur**: Alat dengan `strict: true` tidak didukung dengan pemanggilan terprogram
- **Pilihan alat**: Anda tidak dapat memaksa pemanggilan terprogram alat tertentu melalui `tool_choice`
- **Penggunaan alat paralel**: `disable_parallel_tool_use: true` tidak didukung dengan pemanggilan terprogram

### Pembatasan alat

Alat berikut saat ini tidak dapat dipanggil secara terprogram, tetapi dukungan dapat ditambahkan di rilis mendatang:

- Pencarian web
- Pengambilan web
- Alat yang disediakan oleh [konektor MCP](/docs/id/agents-and-tools/mcp-connector)

### Pembatasan pemformatan pesan

Saat merespons pemanggilan alat terprogram, ada persyaratan pemformatan yang ketat:

**Respons hanya hasil alat**: Jika ada pemanggilan alat terprogram yang tertunda menunggu hasil, pesan respons Anda harus berisi **hanya** blok `tool_result`. Anda tidak dapat menyertakan konten teks apa pun, bahkan setelah hasil alat.

```json
// ❌ TIDAK VALID - Tidak dapat menyertakan teks saat merespons pemanggilan alat terprogram
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"},
    {"type": "text", "text": "What should I do next?"}  // This will cause an error
  ]
}

// ✅ VALID - Hanya hasil alat saat merespons pemanggilan alat terprogram
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"}
  ]
}
```

Pembatasan ini hanya berlaku saat merespons pemanggilan alat terprogram (eksekusi kode). Untuk pemanggilan alat sisi klien biasa, Anda dapat menyertakan konten teks setelah hasil alat.

### Batas laju

Pemanggilan alat secara terprogram tunduk pada batas laju yang sama dengan pemanggilan alat biasa. Setiap pemanggilan alat dari eksekusi kode dihitung sebagai pemanggilan terpisah.

### Validasi hasil alat sebelum digunakan

Saat mengimplementasikan alat khusus yang akan dipanggil secara terprogram:

- **Hasil alat dikembalikan sebagai string**: Mereka dapat berisi konten apa pun, termasuk cuplikan kode atau perintah yang dapat dieksekusi yang dapat diproses oleh lingkungan eksekusi.
- **Validasi hasil alat eksternal**: Jika alat Anda mengembalikan data dari sumber eksternal atau menerima input pengguna, waspadai risiko injeksi kode jika output akan diinterpretasikan atau dieksekusi sebagai kode.

## Efisiensi token

Pemanggilan alat secara terprogram dapat secara signifikan mengurangi konsumsi token:

- **Hasil alat dari pemanggilan terprogram tidak ditambahkan ke konteks Claude** - hanya output kode akhir
- **Pemrosesan perantara terjadi dalam kode** - penyaringan, agregasi, dll. tidak mengonsumsi token model
- **Beberapa pemanggilan alat dalam satu eksekusi kode** - mengurangi overhead dibandingkan dengan putaran model terpisah

Misalnya, memanggil 10 alat secara langsung menggunakan ~10x token dari memanggilan mereka secara terprogram dan mengembalikan ringkasan.

## Penggunaan dan harga

Pemanggilan alat secara terprogram menggunakan harga yang sama dengan eksekusi kode. Lihat [harga eksekusi kode](/docs/id/agents-and-tools/tool-use/code-execution-tool#usage-and-pricing) untuk detail.

<Note>
Penghitungan token untuk pemanggilan alat terprogram: Hasil alat dari pemanggilan terprogram tidak dihitung terhadap penggunaan token input/output Anda. Hanya hasil eksekusi kode akhir dan respons Claude yang dihitung.
</Note>

## Praktik terbaik

### Desain alat

- **Berikan deskripsi output terperinci**: Karena Claude mendeserialisasi hasil alat dalam kode, dokumentasikan dengan jelas formatnya (struktur JSON, jenis bidang, dll.)
- **Kembalikan data terstruktur**: Format JSON atau format yang mudah diuraikan lainnya paling baik untuk pemrosesan terprogram
- **Jaga respons tetap ringkas**: Kembalikan hanya data yang diperlukan untuk meminimalkan overhead pemrosesan

### Kapan menggunakan pemanggilan terprogram

**Kasus penggunaan yang baik:**
- Memproses dataset besar di mana Anda hanya memerlukan agregat atau ringkasan
- Alur kerja multi-langkah dengan 3+ pemanggilan alat yang bergantung
- Operasi yang memerlukan penyaringan, pengurutan, atau transformasi hasil alat
- Tugas di mana data perantara tidak boleh mempengaruhi penalaran Claude
- Operasi paralel di banyak item (misalnya, memeriksa 50 titik akhir)

**Kasus penggunaan yang kurang ideal:**
- Pemanggilan alat tunggal dengan respons sederhana
- Alat yang memerlukan umpan balik pengguna segera
- Operasi yang sangat cepat di mana overhead eksekusi kode akan mengungguli manfaatnya

### Optimasi kinerja

- **Gunakan kembali kontainer** saat membuat beberapa permintaan terkait untuk mempertahankan status
- **Batch operasi serupa** dalam satu eksekusi kode jika memungkinkan

## Pemecahan masalah

### Masalah umum

**Kesalahan "Alat tidak diizinkan"**
- Verifikasi definisi alat Anda mencakup `"allowed_callers": ["code_execution_20250825"]`
- Periksa bahwa Anda menggunakan header beta yang benar

**Kedaluwarsa kontainer**
- Pastikan Anda merespons pemanggilan alat dalam masa hidup kontainer (~4,5 menit)
- Pantau bidang `expires_at` dalam respons
- Pertimbangkan untuk mengimplementasikan eksekusi alat yang lebih cepat

**Masalah header beta**
- Anda memerlukan header: `"advanced-tool-use-2025-11-20"`

**Hasil alat tidak diuraikan dengan benar**
- Pastikan alat Anda mengembalikan data string yang dapat dideserialisasi Claude
- Berikan dokumentasi format output yang jelas dalam deskripsi alat Anda

### Tips debugging

1. **Catat semua pemanggilan alat dan hasil** untuk melacak alur
2. **Periksa bidang `caller`** untuk mengkonfirmasi pemanggilan terprogram
3. **Pantau ID kontainer** untuk memastikan penggunaan kembali yang tepat
4. **Uji alat secara independen** sebelum mengaktifkan pemanggilan terprogram

## Mengapa pemanggilan alat secara terprogram berfungsi

Pelatihan Claude mencakup paparan ekstensif terhadap kode, menjadikannya efektif dalam penalaran melalui dan perantaian pemanggilan fungsi. Ketika alat disajikan sebagai fungsi yang dapat dipanggil dalam lingkungan eksekusi kode, Claude dapat memanfaatkan kekuatan ini untuk:

- **Bernalar secara alami tentang komposisi alat**: Operasi rantai dan tangani dependensi senatural menulis kode Python apa pun
- **Memproses hasil besar secara efisien**: Saring output alat besar, ekstrak hanya data yang relevan, atau tulis hasil perantara ke file sebelum mengembalikan ringkasan ke jendela konteks
- **Kurangi latensi secara signifikan**: Hilangkan overhead pengambilan sampel ulang Claude antara setiap pemanggilan alat dalam alur kerja multi-langkah

Pendekatan ini memungkinkan alur kerja yang akan tidak praktis dengan penggunaan alat tradisional—seperti memproses file lebih dari 1M token—dengan memungkinkan Claude bekerja dengan data secara terprogram daripada memuat semuanya ke dalam konteks percakapan.

## Implementasi alternatif

Pemanggilan alat secara terprogram adalah pola yang dapat digeneralisasi yang dapat diimplementasikan di luar eksekusi kode yang dikelola Anthropic. Berikut adalah gambaran umum pendekatan:

### Eksekusi langsung sisi klien

Berikan Claude dengan alat eksekusi kode dan jelaskan fungsi apa yang tersedia di lingkungan itu. Ketika Claude memanggil alat dengan kode, aplikasi Anda menjalankannya secara lokal di mana fungsi tersebut didefinisikan.

**Keuntungan:**
- Sederhana untuk diimplementasikan dengan minimal re-architecting
- Kontrol penuh atas lingkungan dan instruksi

**Kerugian:**
- Menjalankan kode yang tidak dipercaya di luar sandbox
- Pemanggilan alat dapat menjadi vektor untuk injeksi kode

**Gunakan ketika:** Aplikasi Anda dapat dengan aman menjalankan kode arbitrer, Anda menginginkan solusi sederhana, dan penawaran Anthropic yang dikelola tidak sesuai dengan kebutuhan Anda.

### Eksekusi bersandal yang dikelola sendiri

Pendekatan yang sama dari perspektif Claude, tetapi kode berjalan dalam kontainer bersandal dengan pembatasan keamanan (misalnya, tidak ada egress jaringan). Jika alat Anda memerlukan sumber daya eksternal, Anda akan memerlukan protokol untuk menjalankan pemanggilan alat di luar sandbox.

**Keuntungan:**
- Pemanggilan alat terprogram yang aman di infrastruktur Anda sendiri
- Kontrol penuh atas lingkungan eksekusi

**Kerugian:**
- Kompleks untuk dibangun dan dipertahankan
- Memerlukan pengelolaan infrastruktur dan komunikasi antar proses

**Gunakan ketika:** Keamanan sangat penting dan solusi Anthropic yang dikelola tidak sesuai dengan persyaratan Anda.

### Eksekusi yang dikelola Anthropic

Pemanggilan alat secara terprogram Anthropic adalah versi yang dikelola dari eksekusi bersandal dengan lingkungan Python yang berpandangan untuk Claude. Anthropic menangani manajemen kontainer, eksekusi kode, dan komunikasi pemanggilan alat yang aman.

**Keuntungan:**
- Aman dan aman secara default
- Mudah diaktifkan dengan konfigurasi minimal
- Lingkungan dan instruksi dioptimalkan untuk Claude

Kami merekomendasikan menggunakan solusi yang dikelola Anthropic jika Anda menggunakan Claude API.

## Fitur terkait

<CardGroup cols={2}>
  <Card title="Alat Eksekusi Kode" icon="code" href="/docs/id/agents-and-tools/tool-use/code-execution-tool">
    Pelajari tentang kemampuan eksekusi kode yang mendasari yang mendukung pemanggilan alat secara terprogram.
  </Card>
  <Card title="Gambaran Umum Penggunaan Alat" icon="wrench" href="/docs/id/agents-and-tools/tool-use/overview">
    Pahami dasar-dasar penggunaan alat dengan Claude.
  </Card>
  <Card title="Implementasikan Penggunaan Alat" icon="hammer" href="/docs/id/agents-and-tools/tool-use/implement-tool-use">
    Panduan langkah demi langkah untuk mengimplementasikan alat.
  </Card>
</CardGroup>