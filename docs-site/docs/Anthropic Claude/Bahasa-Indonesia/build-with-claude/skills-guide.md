# Menggunakan Agent Skills dengan API

Pelajari cara menggunakan Agent Skills untuk memperluas kemampuan Claude melalui API.

---

Agent Skills memperluas kemampuan Claude melalui folder terorganisir yang berisi instruksi, skrip, dan sumber daya. Panduan ini menunjukkan cara menggunakan Skills yang sudah dibuat sebelumnya dan Skills khusus dengan Claude API.

<Note>
Untuk referensi API lengkap termasuk skema permintaan/respons dan semua parameter, lihat:
- [Referensi API Manajemen Skill](/docs/id/api/skills/list-skills) - Operasi CRUD untuk Skills
- [Referensi API Versi Skill](/docs/id/api/skills/list-skill-versions) - Manajemen versi
</Note>

## Tautan Cepat

<CardGroup cols={2}>
  <Card
    title="Mulai dengan Agent Skills"
    icon="rocket"
    href="/docs/id/agents-and-tools/agent-skills/quickstart"
  >
    Buat Skill pertama Anda
  </Card>
  <Card
    title="Buat Skills Khusus"
    icon="hammer"
    href="/docs/id/agents-and-tools/agent-skills/best-practices"
  >
    Praktik terbaik untuk membuat Skills
  </Card>
</CardGroup>

## Ikhtisar

<Note>
Untuk pendalaman mendalam tentang arsitektur dan aplikasi dunia nyata dari Agent Skills, baca blog teknik kami: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).
</Note>

Skills terintegrasi dengan Messages API melalui alat eksekusi kode. Baik menggunakan Skills yang sudah dibuat sebelumnya yang dikelola oleh Anthropic atau Skills khusus yang telah Anda unggah, bentuk integrasi identik—keduanya memerlukan eksekusi kode dan menggunakan struktur `container` yang sama.

### Menggunakan Skills

Skills terintegrasi secara identik dalam Messages API terlepas dari sumbernya. Anda menentukan Skills dalam parameter `container` dengan `skill_id`, `type`, dan `version` opsional, dan mereka dijalankan di lingkungan eksekusi kode.

**Anda dapat menggunakan Skills dari dua sumber:**

| Aspek | Skills Anthropic | Skills Khusus |
|---|---|---|
| **Nilai type** | `anthropic` | `custom` |
| **ID Skill** | Nama pendek: `pptx`, `xlsx`, `docx`, `pdf` | Dihasilkan: `skill_01AbCdEfGhIjKlMnOpQrStUv` |
| **Format versi** | Berbasis tanggal: `20251013` atau `latest` | Stempel waktu epoch: `1759178010641129` atau `latest` |
| **Manajemen** | Dibuat sebelumnya dan dikelola oleh Anthropic | Unggah dan kelola melalui [Skills API](/docs/id/api/skills/create-skill) |
| **Ketersediaan** | Tersedia untuk semua pengguna | Pribadi untuk ruang kerja Anda |

Kedua sumber skill dikembalikan oleh [endpoint List Skills](/docs/id/api/skills/list-skills) (gunakan parameter `source` untuk memfilter). Bentuk integrasi dan lingkungan eksekusi identik—satu-satunya perbedaan adalah dari mana Skills berasal dan bagaimana mereka dikelola.

### Prasyarat

Untuk menggunakan Skills, Anda memerlukan:

1. **Kunci API Anthropic** dari [Konsol](/settings/keys)
2. **Header Beta**:
   - `code-execution-2025-08-25` - Mengaktifkan eksekusi kode (diperlukan untuk Skills)
   - `skills-2025-10-02` - Mengaktifkan Skills API
   - `files-api-2025-04-14` - Untuk mengunggah/mengunduh file ke/dari container
3. **Alat eksekusi kode** diaktifkan dalam permintaan Anda

---

## Menggunakan Skills dalam Pesan

### Parameter Container

Skills ditentukan menggunakan parameter `container` dalam Messages API. Anda dapat menyertakan hingga 8 Skills per permintaan.

Strukturnya identik untuk Skills Anthropic dan khusus—tentukan `type` dan `skill_id` yang diperlukan, dan secara opsional sertakan `version` untuk menyematkan ke versi tertentu:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "pptx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create a presentation about renewable energy"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'pptx',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Create a presentation about renewable energy'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "pptx",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Create a presentation about renewable energy"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

### Mengunduh File yang Dihasilkan

Ketika Skills membuat dokumen (Excel, PowerPoint, PDF, Word), mereka mengembalikan atribut `file_id` dalam respons. Anda harus menggunakan Files API untuk mengunduh file-file ini.

**Cara kerjanya:**
1. Skills membuat file selama eksekusi kode
2. Respons mencakup `file_id` untuk setiap file yang dibuat
3. Gunakan Files API untuk mengunduh konten file sebenarnya
4. Simpan secara lokal atau proses sesuai kebutuhan

**Contoh: Membuat dan mengunduh file Excel**

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Langkah 1: Gunakan Skill untuk membuat file
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create an Excel file with a simple budget spreadsheet"
    }],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# Langkah 2: Ekstrak ID file dari respons
def extract_file_ids(response):
    file_ids = []
    for item in response.content:
        if item.type == 'bash_code_execution_tool_result':
            content_item = item.content
            if content_item.type == 'bash_code_execution_result':
                for file in content_item.content:
                    if hasattr(file, 'file_id'):
                        file_ids.append(file.file_id)
    return file_ids

# Langkah 3: Unduh file menggunakan Files API
for file_id in extract_file_ids(response):
    file_metadata = client.beta.files.retrieve_metadata(
        file_id=file_id,
        betas=["files-api-2025-04-14"]
    )
    file_content = client.beta.files.download(
        file_id=file_id,
        betas=["files-api-2025-04-14"]
    )

    # Langkah 4: Simpan ke disk
    file_content.write_to_file(file_metadata.filename)
    print(f"Downloaded: {file_metadata.filename}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Langkah 1: Gunakan Skill untuk membuat file
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'}
    ]
  },
  messages: [{
    role: 'user',
    content: 'Create an Excel file with a simple budget spreadsheet'
  }],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// Langkah 2: Ekstrak ID file dari respons
function extractFileIds(response: any): string[] {
  const fileIds: string[] = [];
  for (const item of response.content) {
    if (item.type === 'bash_code_execution_tool_result') {
      const contentItem = item.content;
      if (contentItem.type === 'bash_code_execution_result') {
        for (const file of contentItem.content) {
          if ('file_id' in file) {
            fileIds.push(file.file_id);
          }
        }
      }
    }
  }
  return fileIds;
}

// Langkah 3: Unduh file menggunakan Files API
const fs = require('fs');
for (const fileId of extractFileIds(response)) {
  const fileMetadata = await client.beta.files.retrieve_metadata(fileId, {
    betas: ['files-api-2025-04-14']
  });
  const fileContent = await client.beta.files.download(fileId, {
    betas: ['files-api-2025-04-14']
  });

  // Langkah 4: Simpan ke disk
  fs.writeFileSync(fileMetadata.filename, Buffer.from(await fileContent.arrayBuffer()));
  console.log(`Downloaded: ${fileMetadata.filename}`);
}
```

```bash Shell
# Langkah 1: Gunakan Skill untuk membuat file
RESPONSE=$(curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Create an Excel file with a simple budget spreadsheet"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }')

# Langkah 2: Ekstrak file_id dari respons (menggunakan jq)
FILE_ID=$(echo "$RESPONSE" | jq -r '.content[] | select(.type=="bash_code_execution_tool_result") | .content | select(.type=="bash_code_execution_result") | .content[] | select(.file_id) | .file_id')

# Langkah 3: Dapatkan nama file dari metadata
FILENAME=$(curl "https://api.anthropic.com/v1/files/$FILE_ID" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" | jq -r '.filename')

# Langkah 4: Unduh file menggunakan Files API
curl "https://api.anthropic.com/v1/files/$FILE_ID/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output "$FILENAME"

echo "Downloaded: $FILENAME"
```
</CodeGroup>

**Operasi Files API tambahan:**

<CodeGroup>
```python Python
# Dapatkan metadata file
file_info = client.beta.files.retrieve_metadata(
    file_id=file_id,
    betas=["files-api-2025-04-14"]
)
print(f"Filename: {file_info.filename}, Size: {file_info.size_bytes} bytes")

# Daftar semua file
files = client.beta.files.list(betas=["files-api-2025-04-14"])
for file in files.data:
    print(f"{file.filename} - {file.created_at}")

# Hapus file
client.beta.files.delete(
    file_id=file_id,
    betas=["files-api-2025-04-14"]
)
```

```typescript TypeScript
// Dapatkan metadata file
const fileInfo = await client.beta.files.retrieve_metadata(fileId, {
  betas: ['files-api-2025-04-14']
});
console.log(`Filename: ${fileInfo.filename}, Size: ${fileInfo.size_bytes} bytes`);

// Daftar semua file
const files = await client.beta.files.list({
  betas: ['files-api-2025-04-14']
});
for (const file of files.data) {
  console.log(`${file.filename} - ${file.created_at}`);
}

// Hapus file
await client.beta.files.delete(fileId, {
  betas: ['files-api-2025-04-14']
});
```

```bash Shell
# Dapatkan metadata file
curl "https://api.anthropic.com/v1/files/$FILE_ID" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"

# Daftar semua file
curl "https://api.anthropic.com/v1/files" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"

# Hapus file
curl -X DELETE "https://api.anthropic.com/v1/files/$FILE_ID" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```
</CodeGroup>

<Note>
Untuk detail lengkap tentang Files API, lihat [dokumentasi Files API](/docs/id/api/files-content).
</Note>

### Percakapan Multi-Turn

Gunakan kembali container yang sama di beberapa pesan dengan menentukan ID container:

<CodeGroup>
```python Python
# Permintaan pertama membuat container
response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    messages=[{"role": "user", "content": "Analyze this sales data"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# Lanjutkan percakapan dengan container yang sama
messages = [
    {"role": "user", "content": "Analyze this sales data"},
    {"role": "assistant", "content": response1.content},
    {"role": "user", "content": "What was the total revenue?"}
]

response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "id": response1.container.id,  # Gunakan kembali container
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    messages=messages,
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

```typescript TypeScript
// Permintaan pertama membuat container
const response1 = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'}
    ]
  },
  messages: [{role: 'user', content: 'Analyze this sales data'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// Lanjutkan percakapan dengan container yang sama
const messages = [
  {role: 'user', content: 'Analyze this sales data'},
  {role: 'assistant', content: response1.content},
  {role: 'user', content: 'What was the total revenue?'}
];

const response2 = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    id: response1.container.id,  // Gunakan kembali container
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'}
    ]
  },
  messages,
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});
```
</CodeGroup>

### Operasi Berjalan Lama

Skills dapat melakukan operasi yang memerlukan beberapa turn. Tangani alasan penghentian `pause_turn`:

<CodeGroup>
```python Python
messages = [{"role": "user", "content": "Process this large dataset"}]
max_retries = 10

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "custom", "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv", "version": "latest"}
        ]
    },
    messages=messages,
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# Tangani pause_turn untuk operasi panjang
for i in range(max_retries):
    if response.stop_reason != "pause_turn":
        break

    messages.append({"role": "assistant", "content": response.content})
    response = client.beta.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4096,
        betas=["code-execution-2025-08-25", "skills-2025-10-02"],
        container={
            "id": response.container.id,
            "skills": [
                {"type": "custom", "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv", "version": "latest"}
            ]
        },
        messages=messages,
        tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
    )
```

```typescript TypeScript
let messages = [{role: 'user' as const, content: 'Process this large dataset'}];
const maxRetries = 10;

let response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {type: 'custom', skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv', version: 'latest'}
    ]
  },
  messages,
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// Tangani pause_turn untuk operasi panjang
for (let i = 0; i < maxRetries; i++) {
  if (response.stop_reason !== 'pause_turn') {
    break;
  }

  messages.push({role: 'assistant', content: response.content});
  response = await client.beta.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
    container: {
      id: response.container.id,
      skills: [
        {type: 'custom', skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv', version: 'latest'}
      ]
    },
    messages,
    tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
  });
}
```

```bash Shell
# Permintaan awal
RESPONSE=$(curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "custom",
          "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Process this large dataset"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }')

# Periksa stop_reason dan tangani pause_turn dalam loop
STOP_REASON=$(echo "$RESPONSE" | jq -r '.stop_reason')
CONTAINER_ID=$(echo "$RESPONSE" | jq -r '.container.id')

while [ "$STOP_REASON" = "pause_turn" ]; do
  # Lanjutkan dengan container yang sama
  RESPONSE=$(curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
    -H "content-type: application/json" \
    -d "{
      \"model\": \"claude-sonnet-4-5-20250929\",
      \"max_tokens\": 4096,
      \"container\": {
        \"id\": \"$CONTAINER_ID\",
        \"skills\": [{
          \"type\": \"custom\",
          \"skill_id\": \"skill_01AbCdEfGhIjKlMnOpQrStUv\",
          \"version\": \"latest\"
        }]
      },
      \"messages\": [/* include conversation history */],
      \"tools\": [{
        \"type\": \"code_execution_20250825\",
        \"name\": \"code_execution\"
      }]
    }")

  STOP_REASON=$(echo "$RESPONSE" | jq -r '.stop_reason')
done
```
</CodeGroup>

<Note>
Respons mungkin mencakup alasan penghentian `pause_turn`, yang menunjukkan bahwa API menjeda operasi Skill yang berjalan lama. Anda dapat memberikan respons kembali apa adanya dalam permintaan berikutnya untuk membiarkan Claude melanjutkan giliran, atau ubah konten jika Anda ingin menghentikan percakapan dan memberikan panduan tambahan.
</Note>

### Menggunakan Beberapa Skills

Gabungkan beberapa Skills dalam satu permintaan untuk menangani alur kerja yang kompleks:

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "xlsx",
                "version": "latest"
            },
            {
                "type": "anthropic",
                "skill_id": "pptx",
                "version": "latest"
            },
            {
                "type": "custom",
                "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Analyze sales data and create a presentation"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'xlsx',
        version: 'latest'
      },
      {
        type: 'anthropic',
        skill_id: 'pptx',
        version: 'latest'
      },
      {
        type: 'custom',
        skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Analyze sales data and create a presentation'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "xlsx",
          "version": "latest"
        },
        {
          "type": "anthropic",
          "skill_id": "pptx",
          "version": "latest"
        },
        {
          "type": "custom",
          "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Analyze sales data and create a presentation"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

---

## Mengelola Skills Khusus

### Membuat Skill

Unggah Skill khusus Anda untuk membuatnya tersedia di ruang kerja Anda. Anda dapat mengunggah menggunakan jalur direktori atau objek file individual.

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Opsi 1: Menggunakan pembantu files_from_dir (hanya Python, direkomendasikan)
from anthropic.lib import files_from_dir

skill = client.beta.skills.create(
    display_title="Financial Analysis",
    files=files_from_dir("/path/to/financial_analysis_skill"),
    betas=["skills-2025-10-02"]
)

# Opsi 2: Menggunakan file zip
skill = client.beta.skills.create(
    display_title="Financial Analysis",
    files=[("skill.zip", open("financial_analysis_skill.zip", "rb"))],
    betas=["skills-2025-10-02"]
)

# Opsi 3: Menggunakan tuple file (nama file, konten file, tipe mime)
skill = client.beta.skills.create(
    display_title="Financial Analysis",
    files=[
        ("financial_skill/SKILL.md", open("financial_skill/SKILL.md", "rb"), "text/markdown"),
        ("financial_skill/analyze.py", open("financial_skill/analyze.py", "rb"), "text/x-python"),
    ],
    betas=["skills-2025-10-02"]
)

print(f"Created skill: {skill.id}")
print(f"Latest version: {skill.latest_version}")
```

```typescript TypeScript
import Anthropic, { toFile } from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic();

// Opsi 1: Menggunakan file zip
const skill = await client.beta.skills.create({
  displayTitle: 'Financial Analysis',
  files: [
    await toFile(
      fs.createReadStream('financial_analysis_skill.zip'),
      'skill.zip'
    )
  ],
  betas: ['skills-2025-10-02']
});

// Opsi 2: Menggunakan objek file individual
const skill = await client.beta.skills.create({
  displayTitle: 'Financial Analysis',
  files: [
    await toFile(
      fs.createReadStream('financial_skill/SKILL.md'),
      'financial_skill/SKILL.md',
      { type: 'text/markdown' }
    ),
    await toFile(
      fs.createReadStream('financial_skill/analyze.py'),
      'financial_skill/analyze.py',
      { type: 'text/x-python' }
    ),
  ],
  betas: ['skills-2025-10-02']
});

console.log(`Created skill: ${skill.id}`);
console.log(`Latest version: ${skill.latest_version}`);
```

```bash Shell
curl -X POST "https://api.anthropic.com/v1/skills" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02" \
  -F "display_title=Financial Analysis" \
  -F "files[]=@financial_skill/SKILL.md;filename=financial_skill/SKILL.md" \
  -F "files[]=@financial_skill/analyze.py;filename=financial_skill/analyze.py"
```
</CodeGroup>

**Persyaratan:**
- Harus menyertakan file SKILL.md di tingkat atas
- Semua file harus menentukan direktori root umum dalam jalur mereka
- Total ukuran unggahan harus di bawah 8MB
- Persyaratan frontmatter YAML:
  - `name`: Maksimal 64 karakter, hanya huruf kecil/angka/tanda hubung, tanpa tag XML, tanpa kata yang dicadangkan ("anthropic", "claude")
  - `description`: Maksimal 1024 karakter, tidak kosong, tanpa tag XML

Untuk skema permintaan/respons lengkap, lihat [referensi API Create Skill](/docs/id/api/skills/create-skill).

### Daftar Skills

Ambil semua Skills yang tersedia untuk ruang kerja Anda, termasuk Skills yang sudah dibuat sebelumnya oleh Anthropic dan Skills khusus Anda. Gunakan parameter `source` untuk memfilter berdasarkan jenis skill:

<CodeGroup>
```python Python
# Daftar semua Skills
skills = client.beta.skills.list(
    betas=["skills-2025-10-02"]
)

for skill in skills.data:
    print(f"{skill.id}: {skill.display_title} (source: {skill.source})")

# Daftar hanya Skills khusus
custom_skills = client.beta.skills.list(
    source="custom",
    betas=["skills-2025-10-02"]
)
```

```typescript TypeScript
// Daftar semua Skills
const skills = await client.beta.skills.list({
  betas: ['skills-2025-10-02']
});

for (const skill of skills.data) {
  console.log(`${skill.id}: ${skill.display_title} (source: ${skill.source})`);
}

// Daftar hanya Skills khusus
const customSkills = await client.beta.skills.list({
  source: 'custom',
  betas: ['skills-2025-10-02']
});
```

```bash Shell
# Daftar semua Skills
curl "https://api.anthropic.com/v1/skills" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"

# Daftar hanya Skills khusus
curl "https://api.anthropic.com/v1/skills?source=custom" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```
</CodeGroup>

Lihat [referensi API List Skills](/docs/id/api/skills/list-skills) untuk opsi paginasi dan pemfilteran.

### Mengambil Skill

Dapatkan detail tentang Skill tertentu:

<CodeGroup>
```python Python
skill = client.beta.skills.retrieve(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    betas=["skills-2025-10-02"]
)

print(f"Skill: {skill.display_title}")
print(f"Latest version: {skill.latest_version}")
print(f"Created: {skill.created_at}")
```

```typescript TypeScript
const skill = await client.beta.skills.retrieve(
  'skill_01AbCdEfGhIjKlMnOpQrStUv',
  { betas: ['skills-2025-10-02'] }
);

console.log(`Skill: ${skill.display_title}`);
console.log(`Latest version: ${skill.latest_version}`);
console.log(`Created: ${skill.created_at}`);
```

```bash Shell
curl "https://api.anthropic.com/v1/skills/skill_01AbCdEfGhIjKlMnOpQrStUv" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```
</CodeGroup>

### Menghapus Skill

Untuk menghapus Skill, Anda harus terlebih dahulu menghapus semua versinya:

<CodeGroup>
```python Python
# Langkah 1: Hapus semua versi
versions = client.beta.skills.versions.list(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    betas=["skills-2025-10-02"]
)

for version in versions.data:
    client.beta.skills.versions.delete(
        skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
        version=version.version,
        betas=["skills-2025-10-02"]
    )

# Langkah 2: Hapus Skill
client.beta.skills.delete(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    betas=["skills-2025-10-02"]
)
```

```typescript TypeScript
// Langkah 1: Hapus semua versi
const versions = await client.beta.skills.versions.list(
  'skill_01AbCdEfGhIjKlMnOpQrStUv',
  { betas: ['skills-2025-10-02'] }
);

for (const version of versions.data) {
  await client.beta.skills.versions.delete(
    'skill_01AbCdEfGhIjKlMnOpQrStUv',
    version.version,
    { betas: ['skills-2025-10-02'] }
  );
}

// Langkah 2: Hapus Skill
await client.beta.skills.delete(
  'skill_01AbCdEfGhIjKlMnOpQrStUv',
  { betas: ['skills-2025-10-02'] }
);
```

```bash Shell
# Hapus semua versi terlebih dahulu, kemudian hapus Skill
curl -X DELETE "https://api.anthropic.com/v1/skills/skill_01AbCdEfGhIjKlMnOpQrStUv" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```
</CodeGroup>

Mencoba menghapus Skill dengan versi yang ada akan mengembalikan kesalahan 400.

### Versioning

Skills mendukung versioning untuk mengelola pembaruan dengan aman:

**Skills yang Dikelola Anthropic**:
- Versi menggunakan format tanggal: `20251013`
- Versi baru dirilis saat pembaruan dilakukan
- Tentukan versi yang tepat untuk stabilitas

**Skills Khusus**:
- Stempel waktu epoch yang dihasilkan secara otomatis: `1759178010641129`
- Gunakan `"latest"` untuk selalu mendapatkan versi terbaru
- Buat versi baru saat memperbarui file Skill

<CodeGroup>
```python Python
# Buat versi baru
from anthropic.lib import files_from_dir

new_version = client.beta.skills.versions.create(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    files=files_from_dir("/path/to/updated_skill"),
    betas=["skills-2025-10-02"]
)

# Gunakan versi tertentu
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [{
            "type": "custom",
            "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
            "version": new_version.version
        }]
    },
    messages=[{"role": "user", "content": "Use updated Skill"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# Gunakan versi terbaru
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [{
            "type": "custom",
            "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
            "version": "latest"
        }]
    },
    messages=[{"role": "user", "content": "Use latest Skill version"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

```typescript TypeScript
// Buat versi baru menggunakan file zip
const fs = require('fs');

const newVersion = await client.beta.skills.versions.create(
  'skill_01AbCdEfGhIjKlMnOpQrStUv',
  {
    files: [
      fs.createReadStream('updated_skill.zip')
    ],
    betas: ['skills-2025-10-02']
  }
);

// Gunakan versi tertentu
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [{
      type: 'custom',
      skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv',
      version: newVersion.version
    }]
  },
  messages: [{role: 'user', content: 'Use updated Skill'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// Gunakan versi terbaru
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [{
      type: 'custom',
      skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv',
      version: 'latest'
    }]
  },
  messages: [{role: 'user', content: 'Use latest Skill version'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});
```

```bash Shell
# Buat versi baru
NEW_VERSION=$(curl -X POST "https://api.anthropic.com/v1/skills/skill_01AbCdEfGhIjKlMnOpQrStUv/versions" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02" \
  -F "files[]=@updated_skill/SKILL.md;filename=updated_skill/SKILL.md")

VERSION_NUMBER=$(echo "$NEW_VERSION" | jq -r '.version')

# Gunakan versi tertentu
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d "{
    \"model\": \"claude-sonnet-4-5-20250929\",
    \"max_tokens\": 4096,
    \"container\": {
      \"skills\": [{
        \"type\": \"custom\",
        \"skill_id\": \"skill_01AbCdEfGhIjKlMnOpQrStUv\",
        \"version\": \"$VERSION_NUMBER\"
      }]
    },
    \"messages\": [{\"role\": \"user\", \"content\": \"Use updated Skill\"}],
    \"tools\": [{\"type\": \"code_execution_20250825\", \"name\": \"code_execution\"}]
  }"

# Gunakan versi terbaru
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [{
        "type": "custom",
        "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
        "version": "latest"
      }]
    },
    "messages": [{"role": "user", "content": "Use latest Skill version"}],
    "tools": [{"type": "code_execution_20250825", "name": "code_execution"}]
  }'
```
</CodeGroup>

Lihat [referensi API Create Skill Version](/docs/id/api/skills/create-skill-version) untuk detail lengkap.

---

## Bagaimana Skills Dimuat

Ketika Anda menentukan Skills dalam container:

1. **Penemuan Metadata**: Claude melihat metadata untuk setiap Skill (nama, deskripsi) dalam prompt sistem
2. **Pemuatan File**: File Skill disalin ke dalam container di `/skills/{directory}/`
3. **Penggunaan Otomatis**: Claude secara otomatis memuat dan menggunakan Skills ketika relevan dengan permintaan Anda
4. **Komposisi**: Beberapa Skills bersama-sama untuk alur kerja yang kompleks

Arsitektur pengungkapan progresif memastikan penggunaan konteks yang efisien—Claude hanya memuat instruksi Skill lengkap ketika diperlukan.

---

## Kasus Penggunaan

### Skills Organisasi

**Brand & Komunikasi**
- Terapkan pemformatan khusus perusahaan (warna, font, tata letak) ke dokumen
- Hasilkan komunikasi mengikuti template organisasi
- Pastikan panduan merek yang konsisten di semua output

**Manajemen Proyek**
- Struktur catatan dengan format khusus perusahaan (OKR, log keputusan)
- Hasilkan tugas mengikuti konvensi tim
- Buat ringkasan pertemuan dan pembaruan status standar

**Operasi Bisnis**
- Buat laporan, proposal, dan analisis standar perusahaan
- Jalankan prosedur analitik khusus perusahaan
- Hasilkan model keuangan mengikuti template organisasi

### Skills Pribadi

**Pembuatan Konten**
- Template dokumen khusus
- Pemformatan dan styling khusus
- Pembuatan konten khusus domain

**Analisis Data**
- Pipeline pemrosesan data khusus
- Template visualisasi khusus
- Metode analitik khusus industri

**Pengembangan & Otomasi**
- Template pembuatan kode
- Kerangka kerja pengujian
- Alur kerja penerapan

### Contoh: Pemodelan Keuangan

Gabungkan Skills Excel dan analisis DCF khusus:

<CodeGroup>
```python Python
# Buat Skill analisis DCF khusus
from anthropic.lib import files_from_dir

dcf_skill = client.beta.skills.create(
    display_title="DCF Analysis",
    files=files_from_dir("/path/to/dcf_skill"),
    betas=["skills-2025-10-02"]
)

# Gunakan dengan Excel untuk membuat model keuangan
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"},
            {"type": "custom", "skill_id": dcf_skill.id, "version": "latest"}
        ]
    },
    messages=[{
        "role": "user",
        "content": "Build a DCF valuation model for a SaaS company with the attached financials"
    }],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

```typescript TypeScript
// Buat Skill analisis DCF khusus
import { toFile } from '@anthropic-ai/sdk';
import fs from 'fs';

const dcfSkill = await client.beta.skills.create({
  displayTitle: 'DCF Analysis',
  files: [
    await toFile(fs.createReadStream('dcf_skill.zip'), 'skill.zip')
  ],
  betas: ['skills-2025-10-02']
});

// Gunakan dengan Excel untuk membuat model keuangan
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'},
      {type: 'custom', skill_id: dcfSkill.id, version: 'latest'}
    ]
  },
  messages: [{
    role: 'user',
    content: 'Build a DCF valuation model for a SaaS company with the attached financials'
  }],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});
```

```bash Shell
# Buat Skill analisis DCF khusus
DCF_SKILL=$(curl -X POST "https://api.anthropic.com/v1/skills" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02" \
  -F "display_title=DCF Analysis" \
  -F "files[]=@dcf_skill/SKILL.md;filename=dcf_skill/SKILL.md")

DCF_SKILL_ID=$(echo "$DCF_SKILL" | jq -r '.id')

# Gunakan dengan Excel untuk membuat model keuangan
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d "{
    \"model\": \"claude-sonnet-4-5-20250929\",
    \"max_tokens\": 4096,
    \"container\": {
      \"skills\": [
        {
          \"type\": \"anthropic\",
          \"skill_id\": \"xlsx\",
          \"version\": \"latest\"
        },
        {
          \"type\": \"custom\",
          \"skill_id\": \"$DCF_SKILL_ID\",
          \"version\": \"latest\"
        }
      ]
    },
    \"messages\": [{
      \"role\": \"user\",
      \"content\": \"Build a DCF valuation model for a SaaS company with the attached financials\"
    }],
    \"tools\": [{
      \"type\": \"code_execution_20250825\",
      \"name\": \"code_execution\"
    }]
  }"
```
</CodeGroup>

---

## Batas dan Kendala

### Batas Permintaan
- **Maksimal Skills per permintaan**: 8
- **Ukuran unggahan Skill maksimal**: 8MB (semua file digabungkan)
- **Persyaratan frontmatter YAML**:
  - `name`: Maksimal 64 karakter, hanya huruf kecil/angka/tanda hubung, tanpa tag XML, tanpa kata yang dicadangkan
  - `description`: Maksimal 1024 karakter, tidak kosong, tanpa tag XML

### Kendala Lingkungan
Skills berjalan di container eksekusi kode dengan batasan ini:
- **Tidak ada akses jaringan** - Tidak dapat membuat panggilan API eksternal
- **Tidak ada instalasi paket runtime** - Hanya paket yang sudah diinstal sebelumnya tersedia
- **Lingkungan terisolasi** - Setiap permintaan mendapatkan container segar

Lihat [dokumentasi alat eksekusi kode](/docs/id/agents-and-tools/tool-use/code-execution-tool) untuk paket yang tersedia.

---

## Praktik Terbaik

### Kapan Menggunakan Beberapa Skills

Gabungkan Skills ketika tugas melibatkan beberapa jenis dokumen atau domain:

**Kasus penggunaan yang baik:**
- Analisis data (Excel) + pembuatan presentasi (PowerPoint)
- Pembuatan laporan (Word) + ekspor ke PDF
- Logika domain khusus + pembuatan dokumen

**Hindari:**
- Menyertakan Skills yang tidak digunakan (berdampak pada kinerja)

### Strategi Manajemen Versi

**Untuk produksi:**
```python
# Sematkan ke versi tertentu untuk stabilitas
container={
    "skills": [{
        "type": "custom",
        "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
        "version": "1759178010641129"  # Versi tertentu
    }]
}
```

**Untuk pengembangan:**
```python
# Gunakan latest untuk pengembangan aktif
container={
    "skills": [{
        "type": "custom",
        "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
        "version": "latest"  # Selalu dapatkan yang terbaru
    }]
}
```

### Pertimbangan Caching Prompt

Saat menggunakan prompt caching, perhatikan bahwa mengubah daftar Skills dalam container Anda akan memecahkan cache:

<CodeGroup>
```python Python
# Permintaan pertama membuat cache
response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02", "prompt-caching-2024-07-31"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    messages=[{"role": "user", "content": "Analyze sales data"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# Menambah/menghapus Skills memecahkan cache
response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02", "prompt-caching-2024-07-31"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"},
            {"type": "anthropic", "skill_id": "pptx", "version": "latest"}  # Cache miss
        ]
    },
    messages=[{"role": "user", "content": "Create a presentation"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

```typescript TypeScript
// Permintaan pertama membuat cache
const response1 = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02', 'prompt-caching-2024-07-31'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'}
    ]
  },
  messages: [{role: 'user', content: 'Analyze sales data'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// Menambah/menghapus Skills memecahkan cache
const response2 = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02', 'prompt-caching-2024-07-31'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'},
      {type: 'anthropic', skill_id: 'pptx', version: 'latest'}  // Cache miss
    ]
  },
  messages: [{role: 'user', content: 'Create a presentation'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});
```

```bash Shell
# Permintaan pertama membuat cache
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02,prompt-caching-2024-07-31" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
      ]
    },
    "messages": [{"role": "user", "content": "Analyze sales data"}],
    "tools": [{"type": "code_execution_20250825", "name": "code_execution"}]
  }'

# Menambah/menghapus Skills memecahkan cache
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02,prompt-caching-2024-07-31" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {"type": "anthropic", "skill_id": "xlsx", "version": "latest"},
        {"type": "anthropic", "skill_id": "pptx", "version": "latest"}
      ]
    },
    "messages": [{"role": "user", "content": "Create a presentation"}],
    "tools": [{"type": "code_execution_20250825", "name": "code_execution"}]
  }'
```
</CodeGroup>

Untuk kinerja caching terbaik, pertahankan daftar Skills Anda tetap konsisten di seluruh permintaan.

### Penanganan Kesalahan

Tangani kesalahan terkait Skill dengan baik:

<CodeGroup>
```python Python
try:
    response = client.beta.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4096,
        betas=["code-execution-2025-08-25", "skills-2025-10-02"],
        container={
            "skills": [
                {"type": "custom", "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv", "version": "latest"}
            ]
        },
        messages=[{"role": "user", "content": "Process data"}],
        tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
    )
except anthropic.BadRequestError as e:
    if "skill" in str(e):
        print(f"Skill error: {e}")
        # Tangani kesalahan khusus skill
    else:
        raise
```

```typescript TypeScript
try {
  const response = await client.beta.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
    container: {
      skills: [
        {type: 'custom', skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv', version: 'latest'}
      ]
    },
    messages: [{role: 'user', content: 'Process data'}],
    tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
  });
} catch (error) {
  if (error instanceof Anthropic.BadRequestError && error.message.includes('skill')) {
    console.error(`Skill error: ${error.message}`);
    // Tangani kesalahan khusus skill
  } else {
    throw error;
  }
}
```
</CodeGroup>

---

## Langkah Berikutnya

<CardGroup cols={2}>
  <Card
    title="Referensi API"
    icon="book"
    href="/docs/id/api/skills/create-skill"
  >
    Referensi API lengkap dengan semua endpoint
  </Card>
  <Card
    title="Panduan Penulisan"
    icon="edit"
    href="/docs/id/agents-and-tools/agent-skills/best-practices"
  >
    Praktik terbaik untuk menulis Skills yang efektif
  </Card>
  <Card
    title="Alat Eksekusi Kode"
    icon="terminal"
    href="/docs/id/agents-and-tools/tool-use/code-execution-tool"
  >
    Pelajari tentang lingkungan eksekusi kode
  </Card>
</CardGroup>