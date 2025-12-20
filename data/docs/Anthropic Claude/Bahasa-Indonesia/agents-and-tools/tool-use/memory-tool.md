# Alat memori

Alat memori memungkinkan Claude menyimpan dan mengambil informasi di seluruh percakapan melalui direktori file memori.

---

Alat memori memungkinkan Claude menyimpan dan mengambil informasi di seluruh percakapan melalui direktori file memori. Claude dapat membuat, membaca, memperbarui, dan menghapus file yang bertahan di antara sesi, memungkinkannya membangun pengetahuan seiring waktu tanpa menyimpan semuanya di jendela konteks.

Alat memori beroperasi di sisi klien—Anda mengontrol di mana dan bagaimana data disimpan melalui infrastruktur Anda sendiri.

<Note>
Alat memori saat ini dalam beta. Untuk mengaktifkannya, gunakan header beta `context-management-2025-06-27` dalam permintaan API Anda.

Silakan hubungi kami melalui [formulir umpan balik](https://forms.gle/YXC2EKGMhjN1c4L88) kami untuk berbagi umpan balik Anda tentang fitur ini.
</Note>

## Kasus penggunaan

- Pertahankan konteks proyek di seluruh eksekusi agen yang berbeda
- Belajar dari interaksi, keputusan, dan umpan balik masa lalu
- Bangun basis pengetahuan seiring waktu
- Aktifkan pembelajaran lintas percakapan di mana Claude meningkat dalam alur kerja berulang

## Cara kerjanya

Ketika diaktifkan, Claude secara otomatis memeriksa direktori memorinya sebelum memulai tugas. Claude dapat membuat, membaca, memperbarui, dan menghapus file di direktori `/memories` untuk menyimpan apa yang dipelajarinya saat bekerja, kemudian mereferensikan memori tersebut dalam percakapan masa depan untuk menangani tugas serupa dengan lebih efektif atau melanjutkan dari mana ia berhenti.

Karena ini adalah alat sisi klien, Claude membuat panggilan alat untuk melakukan operasi memori, dan aplikasi Anda menjalankan operasi tersebut secara lokal. Ini memberi Anda kontrol penuh atas di mana dan bagaimana memori disimpan. Untuk keamanan, Anda harus membatasi semua operasi memori ke direktori `/memories`.

### Contoh: Cara kerja panggilan alat memori

Ketika Anda meminta Claude membantu dengan tugas, Claude secara otomatis memeriksa direktori memorinya terlebih dahulu. Berikut adalah tampilan interaksi tipikal:

**1. Permintaan pengguna:**
```
"Bantu saya merespons tiket layanan pelanggan ini."
```

**2. Claude memeriksa direktori memori:**
```
"Saya akan membantu Anda merespons tiket layanan pelanggan. Biarkan saya memeriksa memori saya untuk konteks sebelumnya apa pun."
```

Claude memanggil alat memori:
```json
{
  "type": "tool_use",
  "id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories"
  }
}
```

**3. Aplikasi Anda mengembalikan isi direktori:**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": "Berikut adalah file dan direktori hingga 2 level dalam /memories, tidak termasuk item tersembunyi dan node_modules:\n4.0K\t/memories\n1.5K\t/memories/customer_service_guidelines.xml\n2.0K\t/memories/refund_policies.xml"
}
```

**4. Claude membaca file yang relevan:**
```json
{
  "type": "tool_use",
  "id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories/customer_service_guidelines.xml"
  }
}
```

**5. Aplikasi Anda mengembalikan isi file:**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": "Berikut adalah isi /memories/customer_service_guidelines.xml dengan nomor baris:\n     1\t<guidelines>\n     2\t<addressing_customers>\n     3\t- Selalu panggil pelanggan dengan nama depan mereka\n     4\t- Gunakan bahasa yang berempati\n..."
}
```

**6. Claude menggunakan memori untuk membantu:**
```
"Berdasarkan panduan layanan pelanggan Anda, saya dapat membantu Anda membuat respons. Silakan bagikan detail tiket..."
```

## Model yang didukung

Alat memori tersedia di:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Memulai

Untuk menggunakan alat memori:

1. Sertakan header beta `context-management-2025-06-27` dalam permintaan API Anda
2. Tambahkan alat memori ke permintaan Anda
3. Implementasikan penangan sisi klien untuk operasi memori

<Note>
Untuk menangani operasi alat memori di aplikasi Anda, Anda perlu mengimplementasikan penangan untuk setiap perintah memori. SDK kami menyediakan pembantu alat memori yang menangani antarmuka alat—Anda dapat membuat subkelas `BetaAbstractMemoryTool` (Python) atau menggunakan `betaMemoryTool` (TypeScript) untuk mengimplementasikan backend memori Anda sendiri (berbasis file, database, penyimpanan cloud, file terenkripsi, dll.).

Untuk contoh yang berfungsi, lihat:
- Python: [examples/memory/basic.py](https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/memory/basic.py)
- TypeScript: [examples/tools-helpers-memory.ts](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/examples/tools-helpers-memory.ts)
</Note>

## Penggunaan dasar

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "I'\''m working on a Python web scraper that keeps crashing with a timeout error. Here'\''s the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
            }
        ],
        "tools": [{
            "type": "memory_20250818",
            "name": "memory"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
        }
    ],
    tools=[{
        "type": "memory_20250818",
        "name": "memory"
    }],
    betas=["context-management-2025-06-27"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 2048,
  messages: [
    {
      role: "user",
      content: "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
    }
  ],
  tools: [{
    type: "memory_20250818",
    name: "memory"
  }],
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

## Perintah alat

Implementasi sisi klien Anda perlu menangani perintah alat memori ini. Meskipun spesifikasi ini menjelaskan perilaku yang direkomendasikan yang paling dikenal Claude, Anda dapat memodifikasi implementasi Anda dan mengembalikan string sesuai kebutuhan untuk kasus penggunaan Anda.

### view
Menampilkan isi direktori atau isi file dengan rentang baris opsional:

```json
{
  "command": "view",
  "path": "/memories",
  "view_range": [1, 10]  // Opsional: lihat baris tertentu
}
```

#### Nilai pengembalian

**Untuk direktori:** Kembalikan daftar yang menunjukkan file dan direktori dengan ukurannya:
```
Berikut adalah file dan direktori hingga 2 level dalam {path}, tidak termasuk item tersembunyi dan node_modules:
{size}    {path}
{size}    {path}/{filename1}
{size}    {path}/{filename2}
```

- Daftar file hingga 2 level dalam
- Tampilkan ukuran yang dapat dibaca manusia (misalnya, `5.5K`, `1.2M`)
- Kecualikan item tersembunyi (file yang dimulai dengan `.`) dan `node_modules`
- Gunakan karakter tab antara ukuran dan jalur

**Untuk file:** Kembalikan isi file dengan header dan nomor baris:
```
Berikut adalah isi {path} dengan nomor baris:
{line_numbers}{tab}{content}
```

Pemformatan nomor baris:
- **Lebar**: 6 karakter, rata kanan dengan padding spasi
- **Pemisah**: Karakter tab antara nomor baris dan konten
- **Pengindeksan**: 1-diindeks (baris pertama adalah baris 1)
- **Batas baris**: File dengan lebih dari 999.999 baris harus mengembalikan kesalahan: `"File {path} exceeds maximum line limit of 999,999 lines."`

**Contoh output:**
```
Berikut adalah isi /memories/notes.txt dengan nomor baris:
     1	Hello World
     2	This is line two
    10	Line ten
   100	Line one hundred
```

#### Penanganan kesalahan

- **File/direktori tidak ada**: `"The path {path} does not exist. Please provide a valid path."`

### create
Buat file baru:

```json
{
  "command": "create",
  "path": "/memories/notes.txt",
  "file_text": "Meeting notes:\n- Discussed project timeline\n- Next steps defined\n"
}
```

#### Nilai pengembalian

- **Sukses**: `"File created successfully at: {path}"`

#### Penanganan kesalahan

- **File sudah ada**: `"Error: File {path} already exists"`

### str_replace
Ganti teks dalam file:

```json
{
  "command": "str_replace",
  "path": "/memories/preferences.txt",
  "old_str": "Favorite color: blue",
  "new_str": "Favorite color: green"
}
```

#### Nilai pengembalian

- **Sukses**: `"The memory file has been edited."` diikuti dengan cuplikan file yang diedit dengan nomor baris

#### Penanganan kesalahan

- **File tidak ada**: `"Error: The path {path} does not exist. Please provide a valid path."`
- **Teks tidak ditemukan**: ``"No replacement was performed, old_str `{old_str}` did not appear verbatim in {path}."``
- **Teks duplikat**: Ketika `old_str` muncul beberapa kali, kembalikan: ``"No replacement was performed. Multiple occurrences of old_str `{old_str}` in lines: {line_numbers}. Please ensure it is unique"``

#### Penanganan direktori

Jika jalurnya adalah direktori, kembalikan kesalahan "file tidak ada".

### insert
Sisipkan teks pada baris tertentu:

```json
{
  "command": "insert",
  "path": "/memories/todo.txt",
  "insert_line": 2,
  "insert_text": "- Review memory tool documentation\n"
}
```

#### Nilai pengembalian

- **Sukses**: `"The file {path} has been edited."`

#### Penanganan kesalahan

- **File tidak ada**: `"Error: The path {path} does not exist"`
- **Nomor baris tidak valid**: ``"Error: Invalid `insert_line` parameter: {insert_line}. It should be within the range of lines of the file: [0, {n_lines}]"``

#### Penanganan direktori

Jika jalurnya adalah direktori, kembalikan kesalahan "file tidak ada".

### delete
Hapus file atau direktori:

```json
{
  "command": "delete",
  "path": "/memories/old_file.txt"
}
```

#### Nilai pengembalian

- **Sukses**: `"Successfully deleted {path}"`

#### Penanganan kesalahan

- **File/direktori tidak ada**: `"Error: The path {path} does not exist"`

#### Penanganan direktori

Menghapus direktori dan semua isinya secara rekursif.

### rename
Ubah nama atau pindahkan file/direktori:

```json
{
  "command": "rename",
  "old_path": "/memories/draft.txt",
  "new_path": "/memories/final.txt"
}
```

#### Nilai pengembalian

- **Sukses**: `"Successfully renamed {old_path} to {new_path}"`

#### Penanganan kesalahan

- **Sumber tidak ada**: `"Error: The path {old_path} does not exist"`
- **Tujuan sudah ada**: Kembalikan kesalahan (jangan timpa): `"Error: The destination {new_path} already exists"`

#### Penanganan direktori

Mengubah nama direktori.

## Panduan prompting

Kami secara otomatis menyertakan instruksi ini ke prompt sistem ketika alat memori disertakan:

```
IMPORTANT: ALWAYS VIEW YOUR MEMORY DIRECTORY BEFORE DOING ANYTHING ELSE.
MEMORY PROTOCOL:
1. Use the `view` command of your `memory` tool to check for earlier progress.
2. ... (work on the task) ...
     - As you make progress, record status / progress / thoughts etc in your memory.
ASSUME INTERRUPTION: Your context window might be reset at any moment, so you risk losing any progress that is not recorded in your memory directory.
```

Jika Anda mengamati Claude membuat file memori yang berantakan, Anda dapat menyertakan instruksi ini:

> Catatan: saat mengedit folder memori Anda, selalu coba simpan kontennya tetap terkini, koheren, dan terorganisir. Anda dapat mengubah nama atau menghapus file yang tidak lagi relevan. Jangan buat file baru kecuali diperlukan.

Anda juga dapat memandu apa yang Claude tulis ke memori, misalnya, "Hanya tulis informasi yang relevan dengan \<topic\> dalam sistem memori Anda."

## Pertimbangan keamanan

Berikut adalah masalah keamanan penting saat mengimplementasikan penyimpanan memori Anda:

### Informasi sensitif
Claude biasanya akan menolak untuk menuliskan informasi sensitif dalam file memori. Namun, Anda mungkin ingin mengimplementasikan validasi yang lebih ketat yang menghilangkan informasi yang berpotensi sensitif.

### Ukuran penyimpanan file
Pertimbangkan pelacakan ukuran file memori dan mencegah file tumbuh terlalu besar. Pertimbangkan menambahkan jumlah karakter maksimum yang dapat dikembalikan perintah baca memori, dan biarkan Claude membuat halaman melalui konten.

### Kedaluwarsa memori
Pertimbangkan untuk menghapus file memori secara berkala yang belum diakses dalam waktu yang lama.

### Perlindungan traversal jalur

<Warning>
Input jalur berbahaya dapat mencoba mengakses file di luar direktori `/memories`. Implementasi Anda **HARUS** memvalidasi semua jalur untuk mencegah serangan traversal direktori.
</Warning>

Pertimbangkan perlindungan ini:

- Validasi bahwa semua jalur dimulai dengan `/memories`
- Selesaikan jalur ke bentuk kanonik mereka dan verifikasi mereka tetap berada dalam direktori memori
- Tolak jalur yang berisi urutan seperti `../`, `..\\`, atau pola traversal lainnya
- Perhatikan urutan traversal yang dikodekan URL (`%2e%2e%2f`)
- Gunakan utilitas keamanan jalur bawaan bahasa Anda (misalnya, `pathlib.Path.resolve()` dan `relative_to()` Python)

## Penanganan kesalahan

Alat memori menggunakan pola penanganan kesalahan yang serupa dengan [alat editor teks](/docs/id/agents-and-tools/tool-use/text-editor-tool#handle-errors). Lihat bagian perintah alat individual di atas untuk pesan kesalahan terperinci dan perilaku. Kesalahan umum termasuk file tidak ditemukan, kesalahan izin, jalur tidak valid, dan kecocokan teks duplikat.

## Menggunakan dengan Context Editing

Alat memori dapat dikombinasikan dengan [context editing](/docs/id/build-with-claude/context-editing), yang secara otomatis menghapus hasil alat lama ketika konteks percakapan tumbuh melampaui ambang yang dikonfigurasi. Kombinasi ini memungkinkan alur kerja agentic jangka panjang yang sebaliknya akan melampaui batas konteks.

### Cara mereka bekerja bersama

Ketika context editing diaktifkan dan percakapan Anda mendekati ambang pembersihan, Claude secara otomatis menerima notifikasi peringatan. Ini mendorong Claude untuk menyimpan informasi penting dari hasil alat ke file memori sebelum hasil tersebut dihapus dari jendela konteks.

Setelah hasil alat dihapus, Claude dapat mengambil informasi yang disimpan dari file memori kapan pun diperlukan, secara efektif memperlakukan memori sebagai perpanjangan dari konteks kerjanya. Ini memungkinkan Claude untuk:

- Melanjutkan alur kerja multi-langkah yang kompleks tanpa kehilangan informasi kritis
- Mereferensikan pekerjaan dan keputusan masa lalu bahkan setelah hasil alat dihapus
- Mempertahankan konteks yang koheren di seluruh percakapan yang akan melampaui batas konteks tipikal
- Membangun basis pengetahuan seiring waktu sambil menjaga jendela konteks aktif tetap dapat dikelola

### Contoh alur kerja

Pertimbangkan proyek refactoring kode dengan banyak operasi file:

1. Claude membuat banyak edit ke file, menghasilkan banyak hasil alat
2. Saat konteks tumbuh dan mendekati ambang Anda, Claude menerima peringatan
3. Claude merangkum perubahan yang dibuat sejauh ini ke file memori (misalnya, `/memories/refactoring_progress.xml`)
4. Context editing menghapus hasil alat yang lebih lama secara otomatis
5. Claude terus bekerja, mereferensikan file memori ketika perlu mengingat perubahan apa yang sudah selesai
6. Alur kerja dapat berlanjut tanpa batas, dengan Claude mengelola konteks aktif dan memori persisten

### Konfigurasi

Untuk menggunakan kedua fitur bersama:

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
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 100000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 3
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
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 100000
        },
        keep: {
          type: "tool_uses",
          value: 3
        }
      }
    ]
  }
});
```

</CodeGroup>

Anda juga dapat mengecualikan panggilan alat memori dari dihapus untuk memastikan Claude selalu memiliki akses ke operasi memori terbaru:

<CodeGroup>

```python Python
context_management={
    "edits": [
        {
            "type": "clear_tool_uses_20250919",
            "exclude_tools": ["memory"]
        }
    ]
}
```

```typescript TypeScript
context_management: {
  edits: [
    {
      type: "clear_tool_uses_20250919",
      exclude_tools: ["memory"]
    }
  ]
}
```

</CodeGroup>