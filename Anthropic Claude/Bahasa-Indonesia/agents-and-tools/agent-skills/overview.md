# Agent Skills

Agent Skills adalah kemampuan modular yang memperluas fungsionalitas Claude. Setiap Skill mengemas instruksi, metadata, dan sumber daya opsional (skrip, template) yang Claude gunakan secara otomatis ketika relevan.

---

## Mengapa menggunakan Skills

Skills adalah sumber daya berbasis filesystem yang dapat digunakan kembali dan memberikan Claude keahlian khusus domain: alur kerja, konteks, dan praktik terbaik yang mengubah agen tujuan umum menjadi spesialis. Tidak seperti prompt (instruksi tingkat percakapan untuk tugas sekali jalan), Skills dimuat sesuai permintaan dan menghilangkan kebutuhan untuk berulang kali memberikan panduan yang sama di berbagai percakapan.

**Manfaat utama**:
- **Spesialisasi Claude**: Sesuaikan kemampuan untuk tugas khusus domain
- **Kurangi pengulangan**: Buat sekali, gunakan secara otomatis
- **Komposisi kemampuan**: Gabungkan Skills untuk membangun alur kerja yang kompleks

<Note>
Untuk pendalaman arsitektur dan aplikasi dunia nyata dari Agent Skills, baca blog teknik kami: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).
</Note>

## Menggunakan Skills

Anthropic menyediakan Agent Skills yang telah dibangun sebelumnya untuk tugas dokumen umum (PowerPoint, Excel, Word, PDF), dan Anda dapat membuat Skills kustom Anda sendiri. Keduanya bekerja dengan cara yang sama. Claude secara otomatis menggunakannya ketika relevan dengan permintaan Anda.

**Pre-built Agent Skills** tersedia untuk semua pengguna di claude.ai dan melalui Claude API. Lihat bagian [Available Skills](#available-skills) di bawah untuk daftar lengkap.

**Custom Skills** memungkinkan Anda mengemas keahlian domain dan pengetahuan organisasi. Mereka tersedia di seluruh produk Claude: buat di Claude Code, unggah melalui API, atau tambahkan di pengaturan claude.ai.

<Note>
**Mulai sekarang:**
- Untuk Pre-built Agent Skills: Lihat [tutorial quickstart](/docs/id/agents-and-tools/agent-skills/quickstart) untuk mulai menggunakan PowerPoint, Excel, Word, dan PDF skills di API
- Untuk Custom Skills: Lihat [Agent Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills) untuk mempelajari cara membuat Skills Anda sendiri
</Note>

## Cara kerja Skills

Skills memanfaatkan lingkungan VM Claude untuk memberikan kemampuan di luar apa yang mungkin dengan prompt saja. Claude beroperasi di mesin virtual dengan akses filesystem, memungkinkan Skills ada sebagai direktori yang berisi instruksi, kode yang dapat dieksekusi, dan materi referensi, diatur seperti panduan onboarding yang akan Anda buat untuk anggota tim baru.

Arsitektur berbasis filesystem ini memungkinkan **progressive disclosure**: Claude memuat informasi dalam tahap sesuai kebutuhan, daripada mengonsumsi konteks di awal.

### Tiga jenis konten Skill, tiga tingkat pemuatan

Skills dapat berisi tiga jenis konten, masing-masing dimuat pada waktu yang berbeda:

### Level 1: Metadata (selalu dimuat)

**Jenis konten: Instruksi**. Frontmatter YAML Skill menyediakan informasi penemuan:

```yaml
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
---
```

Claude memuat metadata ini saat startup dan memasukkannya dalam system prompt. Pendekatan ringan ini berarti Anda dapat menginstal banyak Skills tanpa penalti konteks; Claude hanya tahu setiap Skill ada dan kapan menggunakannya.

### Level 2: Instruksi (dimuat saat dipicu)

**Jenis konten: Instruksi**. Badan utama SKILL.md berisi pengetahuan prosedural: alur kerja, praktik terbaik, dan panduan:

````markdown
# PDF Processing

## Quick start

Use pdfplumber to extract text from PDFs:

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

For advanced form filling, see [FORMS.md](FORMS.md).
````

Ketika Anda meminta sesuatu yang cocok dengan deskripsi Skill, Claude membaca SKILL.md dari filesystem melalui bash. Hanya kemudian konten ini memasuki jendela konteks.

### Level 3: Sumber daya dan kode (dimuat sesuai kebutuhan)

**Jenis konten: Instruksi, kode, dan sumber daya**. Skills dapat menggabungkan materi tambahan:

```
pdf-skill/
├── SKILL.md (main instructions)
├── FORMS.md (form-filling guide)
├── REFERENCE.md (detailed API reference)
└── scripts/
    └── fill_form.py (utility script)
```

**Instruksi**: File markdown tambahan (FORMS.md, REFERENCE.md) yang berisi panduan khusus dan alur kerja

**Kode**: Skrip yang dapat dieksekusi (fill_form.py, validate.py) yang Claude jalankan melalui bash; skrip menyediakan operasi deterministik tanpa mengonsumsi konteks

**Sumber daya**: Materi referensi seperti skema database, dokumentasi API, template, atau contoh

Claude mengakses file ini hanya ketika direferensikan. Model filesystem berarti setiap jenis konten memiliki kekuatan berbeda: instruksi untuk panduan fleksibel, kode untuk keandalan, sumber daya untuk pencarian faktual.

| Level | Kapan Dimuat | Biaya Token | Konten |
|---|---|---|---|
| **Level 1: Metadata** | Selalu (saat startup) | ~100 token per Skill | `name` dan `description` dari frontmatter YAML |
| **Level 2: Instruksi** | Saat Skill dipicu | Di bawah 5k token | Badan SKILL.md dengan instruksi dan panduan |
| **Level 3+: Sumber daya** | Sesuai kebutuhan | Efektif tidak terbatas | File bundel yang dieksekusi melalui bash tanpa memuat konten ke dalam konteks |

Progressive disclosure memastikan hanya konten relevan yang menempati jendela konteks pada waktu tertentu.

### Arsitektur Skills

Skills berjalan di lingkungan eksekusi kode di mana Claude memiliki akses filesystem, perintah bash, dan kemampuan eksekusi kode. Pikirkan seperti ini: Skills ada sebagai direktori di mesin virtual, dan Claude berinteraksi dengan mereka menggunakan perintah bash yang sama yang akan Anda gunakan untuk menavigasi file di komputer Anda.

![Agent Skills Architecture - showing how Skills integrate with the agent's configuration and virtual machine](/docs/images/agent-skills-architecture.png)

**Bagaimana Claude mengakses konten Skill:**

Ketika Skill dipicu, Claude menggunakan bash untuk membaca SKILL.md dari filesystem, membawa instruksinya ke jendela konteks. Jika instruksi tersebut mereferensikan file lain (seperti FORMS.md atau skema database), Claude membaca file tersebut juga menggunakan perintah bash tambahan. Ketika instruksi menyebutkan skrip yang dapat dieksekusi, Claude menjalankannya melalui bash dan menerima hanya output (kode skrip itu sendiri tidak pernah memasuki konteks).

**Apa yang arsitektur ini memungkinkan:**

**Akses file sesuai permintaan**: Claude membaca hanya file yang diperlukan untuk setiap tugas spesifik. Skill dapat mencakup puluhan file referensi, tetapi jika tugas Anda hanya membutuhkan skema penjualan, Claude memuat hanya file itu. Sisanya tetap di filesystem mengonsumsi nol token.

**Eksekusi skrip yang efisien**: Ketika Claude menjalankan `validate_form.py`, kode skrip tidak pernah dimuat ke jendela konteks. Hanya output skrip (seperti "Validation passed" atau pesan kesalahan spesifik) mengonsumsi token. Ini membuat skrip jauh lebih efisien daripada membuat Claude menghasilkan kode setara dengan cepat.

**Tidak ada batasan praktis pada konten bundel**: Karena file tidak mengonsumsi konteks sampai diakses, Skills dapat mencakup dokumentasi API komprehensif, dataset besar, contoh ekstensif, atau materi referensi apa pun yang Anda butuhkan. Tidak ada penalti konteks untuk konten bundel yang tidak digunakan.

Model berbasis filesystem ini adalah apa yang membuat progressive disclosure bekerja. Claude menavigasi Skill Anda seperti Anda mereferensikan bagian spesifik dari panduan onboarding, mengakses persis apa yang setiap tugas butuhkan.

### Contoh: Memuat skill pemrosesan PDF

Berikut adalah cara Claude memuat dan menggunakan skill pemrosesan PDF:

1. **Startup**: System prompt mencakup: `PDF Processing - Extract text and tables from PDF files, fill forms, merge documents`
2. **Permintaan pengguna**: "Extract the text from this PDF and summarize it"
3. **Claude memanggil**: `bash: read pdf-skill/SKILL.md` → Instruksi dimuat ke dalam konteks
4. **Claude menentukan**: Pengisian formulir tidak diperlukan, jadi FORMS.md tidak dibaca
5. **Claude mengeksekusi**: Menggunakan instruksi dari SKILL.md untuk menyelesaikan tugas

![Skills loading into context window - showing the progressive loading of skill metadata and content](/docs/images/agent-skills-context-window.png)

Diagram menunjukkan:
1. Status default dengan system prompt dan metadata skill yang telah dimuat sebelumnya
2. Claude memicu skill dengan membaca SKILL.md melalui bash
3. Claude secara opsional membaca file bundel tambahan seperti FORMS.md sesuai kebutuhan
4. Claude melanjutkan dengan tugas

Pemuatan dinamis ini memastikan hanya konten skill relevan yang menempati jendela konteks.

## Di mana Skills bekerja

Skills tersedia di seluruh produk agen Claude:

### Claude API

Claude API mendukung baik Pre-built Agent Skills maupun Custom Skills. Keduanya bekerja identik: tentukan `skill_id` yang relevan dalam parameter `container` bersama dengan alat eksekusi kode.

**Prasyarat**: Menggunakan Skills melalui API memerlukan tiga header beta:
- `code-execution-2025-08-25` - Skills berjalan di kontainer eksekusi kode
- `skills-2025-10-02` - Mengaktifkan fungsionalitas Skills
- `files-api-2025-04-14` - Diperlukan untuk mengunggah/mengunduh file ke/dari kontainer

Gunakan Pre-built Agent Skills dengan mereferensikan `skill_id` mereka (misalnya, `pptx`, `xlsx`), atau buat dan unggah milik Anda sendiri melalui Skills API (endpoint `/v1/skills`). Custom Skills dibagikan di seluruh organisasi.

Untuk mempelajari lebih lanjut, lihat [Use Skills with the Claude API](/docs/id/build-with-claude/skills-guide).

### Claude Code

[Claude Code](https://code.claude.com/docs/overview) hanya mendukung Custom Skills.

**Custom Skills**: Buat Skills sebagai direktori dengan file SKILL.md. Claude menemukan dan menggunakannya secara otomatis.

Custom Skills di Claude Code berbasis filesystem dan tidak memerlukan unggahan API.

Untuk mempelajari lebih lanjut, lihat [Use Skills in Claude Code](https://code.claude.com/docs/skills).

### Claude Agent SDK

[Claude Agent SDK](/docs/id/agent-sdk/overview) mendukung Custom Skills melalui konfigurasi berbasis filesystem.

**Custom Skills**: Buat Skills sebagai direktori dengan file SKILL.md di `.claude/skills/`. Aktifkan Skills dengan menyertakan `"Skill"` dalam konfigurasi `allowed_tools` Anda.

Skills di Agent SDK kemudian secara otomatis ditemukan ketika SDK berjalan.

Untuk mempelajari lebih lanjut, lihat [Agent Skills in the SDK](/docs/id/agent-sdk/skills).

### Claude.ai

[Claude.ai](https://claude.ai) mendukung baik Pre-built Agent Skills maupun Custom Skills.

**Pre-built Agent Skills**: Skills ini sudah bekerja di balik layar ketika Anda membuat dokumen. Claude menggunakannya tanpa memerlukan pengaturan apa pun.

**Custom Skills**: Unggah Skills Anda sendiri sebagai file zip melalui Settings > Features. Tersedia di paket Pro, Max, Team, dan Enterprise dengan eksekusi kode diaktifkan. Custom Skills individual untuk setiap pengguna; mereka tidak dibagikan di seluruh organisasi dan tidak dapat dikelola secara terpusat oleh admin.

Untuk mempelajari lebih lanjut tentang menggunakan Skills di Claude.ai, lihat sumber daya berikut di Claude Help Center:
- [What are Skills?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Using Skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [How to create custom Skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Tech Claude your way of working using Skills](https://support.claude.com/en/articles/12580051-teach-claude-your-way-of-working-using-skills)

## Struktur Skill

Setiap Skill memerlukan file `SKILL.md` dengan frontmatter YAML:

```yaml
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
[Clear, step-by-step guidance for Claude to follow]

## Examples
[Concrete examples of using this Skill]
```

**Bidang yang diperlukan**: `name` dan `description`

**Persyaratan bidang**:

`name`:
- Maksimal 64 karakter
- Harus berisi hanya huruf kecil, angka, dan tanda hubung
- Tidak dapat berisi tag XML
- Tidak dapat berisi kata-kata yang dicadangkan: "anthropic", "claude"

`description`:
- Harus tidak kosong
- Maksimal 1024 karakter
- Tidak dapat berisi tag XML

`description` harus mencakup baik apa yang dilakukan Skill dan kapan Claude harus menggunakannya. Untuk panduan penulisan lengkap, lihat [panduan praktik terbaik](/docs/id/agents-and-tools/agent-skills/best-practices).

## Pertimbangan keamanan

Kami sangat merekomendasikan menggunakan Skills hanya dari sumber terpercaya: yang Anda buat sendiri atau dapatkan dari Anthropic. Skills memberikan Claude kemampuan baru melalui instruksi dan kode, dan meskipun ini membuatnya kuat, ini juga berarti Skill berbahaya dapat mengarahkan Claude untuk memanggil alat atau mengeksekusi kode dengan cara yang tidak sesuai dengan tujuan Skill yang dinyatakan.

<Warning>
Jika Anda harus menggunakan Skill dari sumber yang tidak terpercaya atau tidak dikenal, berhati-hatilah dan audit secara menyeluruh sebelum digunakan. Tergantung pada akses apa yang Claude miliki saat mengeksekusi Skill, Skill berbahaya dapat menyebabkan eksfiltrasi data, akses sistem yang tidak sah, atau risiko keamanan lainnya.
</Warning>

**Pertimbangan keamanan utama**:
- **Audit secara menyeluruh**: Tinjau semua file yang digabungkan dalam Skill: SKILL.md, skrip, gambar, dan sumber daya lainnya. Cari pola yang tidak biasa seperti panggilan jaringan yang tidak terduga, pola akses file, atau operasi yang tidak sesuai dengan tujuan Skill yang dinyatakan
- **Sumber eksternal berisiko**: Skills yang mengambil data dari URL eksternal menimbulkan risiko khusus, karena konten yang diambil mungkin berisi instruksi berbahaya. Bahkan Skills yang dapat dipercaya dapat dikompromikan jika dependensi eksternal mereka berubah seiring waktu
- **Penyalahgunaan alat**: Skill berbahaya dapat memanggil alat (operasi file, perintah bash, eksekusi kode) dengan cara yang berbahaya
- **Eksposur data**: Skills dengan akses ke data sensitif dapat dirancang untuk membocorkan informasi ke sistem eksternal
- **Perlakukan seperti menginstal perangkat lunak**: Hanya gunakan Skills dari sumber terpercaya. Berhati-hatilah terutama saat mengintegrasikan Skills ke dalam sistem produksi dengan akses ke data sensitif atau operasi kritis

## Available Skills

### Pre-built Agent Skills

Pre-built Agent Skills berikut tersedia untuk penggunaan segera:

- **PowerPoint (pptx)**: Buat presentasi, edit slide, analisis konten presentasi
- **Excel (xlsx)**: Buat spreadsheet, analisis data, hasilkan laporan dengan bagan
- **Word (docx)**: Buat dokumen, edit konten, format teks
- **PDF (pdf)**: Hasilkan dokumen PDF dan laporan yang diformat

Skills ini tersedia di Claude API dan claude.ai. Lihat [tutorial quickstart](/docs/id/agents-and-tools/agent-skills/quickstart) untuk mulai menggunakannya di API.

### Contoh Custom Skills

Untuk contoh lengkap Custom Skills, lihat [Skills cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills).

## Batasan dan kendala

Memahami batasan ini membantu Anda merencanakan penyebaran Skills secara efektif.

### Ketersediaan lintas permukaan

**Custom Skills tidak disinkronkan di seluruh permukaan**. Skills yang diunggah ke satu permukaan tidak secara otomatis tersedia di permukaan lain:

- Skills yang diunggah ke Claude.ai harus diunggah secara terpisah ke API
- Skills yang diunggah melalui API tidak tersedia di Claude.ai
- Claude Code Skills berbasis filesystem dan terpisah dari Claude.ai dan API

Anda perlu mengelola dan mengunggah Skills secara terpisah untuk setiap permukaan tempat Anda ingin menggunakannya.

### Ruang lingkup berbagi

Skills memiliki model berbagi berbeda tergantung di mana Anda menggunakannya:
- **Claude.ai**: Hanya pengguna individual; setiap anggota tim harus mengunggah secara terpisah
- **Claude API**: Di seluruh workspace; semua anggota workspace dapat mengakses Skills yang diunggah
- **Claude Code**: Personal (`~/.claude/skills/`) atau berbasis proyek (`.claude/skills/`)

Claude.ai saat ini tidak mendukung manajemen admin terpusat atau distribusi Custom Skills di seluruh organisasi.

### Kendala lingkungan runtime

Skills berjalan di kontainer eksekusi kode dengan batasan ini:

- **Tidak ada akses jaringan**: Skills tidak dapat membuat panggilan API eksternal atau mengakses internet
- **Tidak ada instalasi paket runtime**: Hanya paket yang telah diinstal sebelumnya yang tersedia. Anda tidak dapat menginstal paket baru selama eksekusi.
- **Hanya dependensi yang telah dikonfigurasi sebelumnya**: Periksa [dokumentasi alat eksekusi kode](/docs/id/agents-and-tools/tool-use/code-execution-tool) untuk daftar paket yang tersedia

Rencanakan Skills Anda untuk bekerja dalam batasan ini.

## Langkah berikutnya

<CardGroup cols={2}>
  <Card
    title="Mulai dengan Agent Skills"
    icon="graduation-cap"
    href="/docs/id/agents-and-tools/agent-skills/quickstart"
  >
    Buat Skill pertama Anda
  </Card>
  <Card
    title="Panduan API"
    icon="code"
    href="/docs/id/build-with-claude/skills-guide"
  >
    Gunakan Skills dengan Claude API
  </Card>
  <Card
    title="Gunakan Skills di Claude Code"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Buat dan kelola Custom Skills di Claude Code
  </Card>
  <Card
    title="Gunakan Skills di Agent SDK"
    icon="cube"
    href="/docs/id/agent-sdk/skills"
  >
    Gunakan Skills secara terprogram di TypeScript dan Python
  </Card>
  <Card
    title="Praktik terbaik penulisan"
    icon="lightbulb"
    href="/docs/id/agents-and-tools/agent-skills/best-practices"
  >
    Tulis Skills yang dapat digunakan Claude secara efektif
  </Card>
</CardGroup>