# Alat computer use

Claude dapat berinteraksi dengan lingkungan komputer melalui alat computer use, yang menyediakan kemampuan screenshot dan kontrol mouse/keyboard untuk interaksi desktop otonom.

---

Claude dapat berinteraksi dengan lingkungan komputer melalui alat computer use, yang menyediakan kemampuan screenshot dan kontrol mouse/keyboard untuk interaksi desktop otonom.

<Note>
Computer use saat ini dalam beta dan memerlukan [beta header](/docs/id/api/beta-headers):
- `"computer-use-2025-11-24"` untuk Claude Opus 4.5
- `"computer-use-2025-01-24"` untuk Claude Sonnet 4.5, Haiku 4.5, Opus 4.1, Sonnet 4, Opus 4, dan Sonnet 3.7 ([deprecated](/docs/id/about-claude/model-deprecations))
</Note>

## Ikhtisar

Computer use adalah fitur beta yang memungkinkan Claude berinteraksi dengan lingkungan desktop. Alat ini menyediakan:

- **Penangkapan screenshot**: Lihat apa yang saat ini ditampilkan di layar
- **Kontrol mouse**: Klik, seret, dan pindahkan kursor
- **Input keyboard**: Ketik teks dan gunakan pintasan keyboard
- **Otomasi desktop**: Berinteraksi dengan aplikasi atau antarmuka apa pun

Meskipun computer use dapat ditingkatkan dengan alat lain seperti bash dan editor teks untuk alur kerja otomasi yang lebih komprehensif, computer use secara khusus mengacu pada kemampuan alat computer use untuk melihat dan mengontrol lingkungan desktop.

## Kompatibilitas model

Computer use tersedia untuk model Claude berikut:

| Model | Versi Alat | Bendera Beta |
|-------|-----------|-------------|
| Claude Opus 4.5 | `computer_20251124` | `computer-use-2025-11-24` |
| Semua model yang didukung lainnya | `computer_20250124` | `computer-use-2025-01-24` |

<Note>
Claude Opus 4.5 memperkenalkan versi alat `computer_20251124` dengan kemampuan baru termasuk aksi zoom untuk inspeksi wilayah layar yang detail. Semua model lainnya (Sonnet 4.5, Haiku 4.5, Sonnet 4, Opus 4, Opus 4.1, dan Sonnet 3.7) menggunakan versi alat `computer_20250124`.
</Note>

<Warning>
Versi alat yang lebih lama tidak dijamin kompatibel mundur dengan model yang lebih baru. Selalu gunakan versi alat yang sesuai dengan versi model Anda.
</Warning>

## Pertimbangan keamanan

<Warning>
Computer use adalah fitur beta dengan risiko unik yang berbeda dari fitur API standar. Risiko ini meningkat ketika berinteraksi dengan internet. Untuk meminimalkan risiko, pertimbangkan untuk mengambil tindakan pencegahan seperti:

1. Gunakan mesin virtual atau kontainer khusus dengan hak istimewa minimal untuk mencegah serangan sistem langsung atau kecelakaan.
2. Hindari memberikan model akses ke data sensitif, seperti informasi login akun, untuk mencegah pencurian informasi.
3. Batasi akses internet ke daftar putih domain untuk mengurangi paparan terhadap konten berbahaya.
4. Minta manusia untuk mengonfirmasi keputusan yang mungkin menghasilkan konsekuensi dunia nyata yang bermakna serta tugas apa pun yang memerlukan persetujuan afirmatif, seperti menerima cookie, melaksanakan transaksi keuangan, atau menyetujui syarat layanan.

Dalam beberapa keadaan, Claude akan mengikuti perintah yang ditemukan dalam konten bahkan jika bertentangan dengan instruksi pengguna. Misalnya, instruksi Claude di halaman web atau yang terdapat dalam gambar dapat mengganti instruksi atau menyebabkan Claude membuat kesalahan. Kami menyarankan untuk mengambil tindakan pencegahan untuk mengisolasi Claude dari data dan tindakan sensitif untuk menghindari risiko terkait injeksi prompt.

Kami telah melatih model untuk menahan injeksi prompt ini dan telah menambahkan lapisan pertahanan tambahan. Jika Anda menggunakan alat computer use kami, kami akan secara otomatis menjalankan pengklasifikasi pada prompt Anda untuk menandai kemungkinan contoh injeksi prompt. Ketika pengklasifikasi ini mengidentifikasi kemungkinan injeksi prompt dalam screenshot, mereka akan secara otomatis mengarahkan model untuk meminta konfirmasi pengguna sebelum melanjutkan dengan tindakan berikutnya. Kami menyadari bahwa perlindungan tambahan ini tidak akan ideal untuk setiap kasus penggunaan (misalnya, kasus penggunaan tanpa manusia dalam loop), jadi jika Anda ingin memilih keluar dan mematikannya, silakan [hubungi kami](https://support.claude.com/en/).

Kami masih menyarankan untuk mengambil tindakan pencegahan untuk mengisolasi Claude dari data dan tindakan sensitif untuk menghindari risiko terkait injeksi prompt.

Terakhir, harap beri tahu pengguna akhir tentang risiko yang relevan dan dapatkan persetujuan mereka sebelum mengaktifkan computer use di produk Anda sendiri.

</Warning>

<Card
  title="Implementasi referensi computer use"
  icon="computer"
  href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
>

Mulai dengan cepat dengan implementasi referensi computer use kami yang mencakup antarmuka web, kontainer Docker, implementasi alat contoh, dan loop agen.

**Catatan:** Implementasi telah diperbarui untuk menyertakan alat baru untuk model Claude 4 dan Claude Sonnet 3.7. Pastikan untuk menarik versi terbaru repo untuk mengakses fitur baru ini.

</Card>

<Tip>
  Silakan gunakan [formulir ini](https://forms.gle/BT1hpBrqDPDUrCqo7) untuk memberikan
  umpan balik tentang kualitas respons model, API itu sendiri, atau kualitas
  dokumentasi - kami tidak sabar mendengar dari Anda!
</Tip>

## Mulai cepat

Berikut cara memulai dengan computer use:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",  # atau model kompatibel lainnya
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        }
    ],
    messages=[{"role": "user", "content": "Simpan gambar kucing ke desktop saya."}],
    betas=["computer-use-2025-01-24"]
)
print(response)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: computer-use-2025-01-24" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "computer_20250124",
        "name": "computer",
        "display_width_px": 1024,
        "display_height_px": 768,
        "display_number": 1
      },
      {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      },
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Simpan gambar kucing ke desktop saya."
      }
    ]
  }'
```
</CodeGroup>

<Note>
Header beta hanya diperlukan untuk alat computer use.

Contoh di atas menunjukkan ketiga alat digunakan bersama-sama, yang memerlukan header beta karena mencakup alat computer use.
</Note>

---

## Cara kerja computer use

<Steps>
  <Step
    title="1. Berikan Claude alat computer use dan prompt pengguna"
    icon="tool"
  >
    - Tambahkan alat computer use (dan secara opsional alat lainnya) ke permintaan API Anda.
    - Sertakan prompt pengguna yang memerlukan interaksi desktop, misalnya, "Simpan gambar kucing ke desktop saya."
  </Step>
  <Step title="2. Claude memutuskan untuk menggunakan alat computer use" icon="wrench">
    - Claude menilai apakah alat computer use dapat membantu dengan pertanyaan pengguna.
    - Jika ya, Claude membuat permintaan penggunaan alat yang diformat dengan benar.
    - Respons API memiliki `stop_reason` dari `tool_use`, menandakan niat Claude.
  </Step>
  <Step
    title="3. Ekstrak input alat, evaluasi alat di komputer, dan kembalikan hasil"
    icon="computer"
  >
    - Di pihak Anda, ekstrak nama alat dan input dari permintaan Claude.
    - Gunakan alat di kontainer atau Mesin Virtual.
    - Lanjutkan percakapan dengan pesan `user` baru yang berisi blok konten `tool_result`.
  </Step>
  <Step
    title="4. Claude terus memanggil alat computer use hingga menyelesaikan tugas"
    icon="arrows-clockwise"
  >
    - Claude menganalisis hasil alat untuk menentukan apakah penggunaan alat lebih lanjut diperlukan atau tugas telah selesai.
    - Jika Claude memutuskan memerlukan alat lain, ia merespons dengan `stop_reason` `tool_use` lain dan Anda harus kembali ke langkah 3.
    - Jika tidak, ia membuat respons teks kepada pengguna.
  </Step>
</Steps>

Kami menyebut pengulangan langkah 3 dan 4 tanpa input pengguna sebagai "agent loop" - yaitu, Claude merespons dengan permintaan penggunaan alat dan aplikasi Anda merespons Claude dengan hasil evaluasi permintaan tersebut.

### Lingkungan komputasi

Computer use memerlukan lingkungan komputasi bersandal di mana Claude dapat dengan aman berinteraksi dengan aplikasi dan web. Lingkungan ini mencakup:

1. **Tampilan virtual**: Server tampilan X11 virtual (menggunakan Xvfb) yang merender antarmuka desktop yang akan Claude lihat melalui screenshot dan kontrol dengan tindakan mouse/keyboard.

2. **Lingkungan desktop**: UI ringan dengan manajer jendela (Mutter) dan panel (Tint2) yang berjalan di Linux, yang menyediakan antarmuka grafis yang konsisten untuk Claude berinteraksi.

3. **Aplikasi**: Aplikasi Linux yang telah diinstal sebelumnya seperti Firefox, LibreOffice, editor teks, dan manajer file yang dapat Claude gunakan untuk menyelesaikan tugas.

4. **Implementasi alat**: Kode integrasi yang menerjemahkan permintaan alat abstrak Claude (seperti "pindahkan mouse" atau "ambil screenshot") menjadi operasi aktual di lingkungan virtual.

5. **Agent loop**: Program yang menangani komunikasi antara Claude dan lingkungan, mengirim tindakan Claude ke lingkungan dan mengembalikan hasil (screenshot, output perintah) kembali ke Claude.

Ketika Anda menggunakan computer use, Claude tidak terhubung langsung ke lingkungan ini. Sebaliknya, aplikasi Anda:

1. Menerima permintaan penggunaan alat Claude
2. Menerjemahkannya menjadi tindakan di lingkungan komputasi Anda
3. Menangkap hasil (screenshot, output perintah, dll.)
4. Mengembalikan hasil ini ke Claude

Untuk keamanan dan isolasi, implementasi referensi menjalankan semua ini di dalam kontainer Docker dengan pemetaan port yang sesuai untuk melihat dan berinteraksi dengan lingkungan.

---

## Cara mengimplementasikan computer use

### Mulai dengan implementasi referensi kami

Kami telah membangun [implementasi referensi](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) yang mencakup semua yang Anda butuhkan untuk memulai dengan cepat dengan computer use:

- [Lingkungan terkontainerisasi](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile) yang cocok untuk computer use dengan Claude
- Implementasi [alat computer use](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools)
- [Agent loop](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py) yang berinteraksi dengan Claude API dan mengeksekusi alat computer use
- Antarmuka web untuk berinteraksi dengan kontainer, agent loop, dan alat.

### Memahami multi-agent loop

Inti dari computer use adalah "agent loop" - siklus di mana Claude meminta tindakan alat, aplikasi Anda mengeksekusinya, dan mengembalikan hasil ke Claude. Berikut adalah contoh yang disederhanakan:

```python
async def sampling_loop(
    *,
    model: str,
    messages: list[dict],
    api_key: str,
    max_tokens: int = 4096,
    tool_version: str,
    thinking_budget: int | None = None,
    max_iterations: int = 10,  # Tambahkan batas iterasi untuk mencegah loop tak terbatas
):
    """
    Loop agen sederhana untuk interaksi computer use Claude.

    Fungsi ini menangani bolak-balik antara:
    1. Mengirim pesan pengguna ke Claude
    2. Claude meminta untuk menggunakan alat
    3. Aplikasi Anda mengeksekusi alat tersebut
    4. Mengirim hasil alat kembali ke Claude
    """
    # Atur alat dan parameter API
    client = Anthropic(api_key=api_key)
    beta_flag = "computer-use-2025-01-24" if "20250124" in tool_version else "computer-use-2024-10-22"

    # Konfigurasi alat - Anda seharusnya sudah menginisialisasi ini di tempat lain
    tools = [
        {"type": f"computer_{tool_version}", "name": "computer", "display_width_px": 1024, "display_height_px": 768},
        {"type": f"text_editor_{tool_version}", "name": "str_replace_editor"},
        {"type": f"bash_{tool_version}", "name": "bash"}
    ]

    # Loop agen utama (dengan batas iterasi untuk mencegah biaya API yang melonjak)
    iterations = 0
    while True and iterations < max_iterations:
        iterations += 1
        # Atur parameter thinking opsional (untuk Claude Sonnet 3.7)
        thinking = None
        if thinking_budget:
            thinking = {"type": "enabled", "budget_tokens": thinking_budget}

        # Panggil Claude API
        response = client.beta.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
            tools=tools,
            betas=[beta_flag],
            thinking=thinking
        )

        # Tambahkan respons Claude ke riwayat percakapan
        response_content = response.content
        messages.append({"role": "assistant", "content": response_content})

        # Periksa apakah Claude menggunakan alat apa pun
        tool_results = []
        for block in response_content:
            if block.type == "tool_use":
                # Dalam aplikasi nyata, Anda akan mengeksekusi alat di sini
                # Misalnya: result = run_tool(block.name, block.input)
                result = {"result": "Tool executed successfully"}

                # Format hasil untuk Claude
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        # Jika tidak ada alat yang digunakan, Claude selesai - kembalikan pesan final
        if not tool_results:
            return messages

        # Tambahkan hasil alat ke pesan untuk iterasi berikutnya dengan Claude
        messages.append({"role": "user", "content": tool_results})
```

Loop berlanjut hingga Claude merespons tanpa meminta alat apa pun (penyelesaian tugas) atau batas iterasi maksimal tercapai. Perlindungan ini mencegah loop tak terbatas potensial yang dapat menghasilkan biaya API yang tidak terduga.

Kami merekomendasikan untuk mencoba implementasi referensi terlebih dahulu sebelum membaca sisa dokumentasi ini.

### Optimalkan kinerja model dengan prompting

Berikut adalah beberapa tips tentang cara mendapatkan output berkualitas terbaik:

1. Tentukan tugas sederhana yang terdefinisi dengan baik dan berikan instruksi eksplisit untuk setiap langkah.
2. Claude kadang-kadang mengasumsikan hasil tindakannya tanpa secara eksplisit memeriksa hasilnya. Untuk mencegah ini, Anda dapat memberi prompt Claude dengan `Setelah setiap langkah, ambil screenshot dan evaluasi dengan hati-hati apakah Anda telah mencapai hasil yang benar. Tunjukkan pemikiran Anda secara eksplisit: "Saya telah mengevaluasi langkah X..." Jika tidak benar, coba lagi. Hanya ketika Anda mengonfirmasi langkah telah dieksekusi dengan benar, Anda harus melanjutkan ke langkah berikutnya.`
3. Beberapa elemen UI (seperti dropdown dan scrollbar) mungkin sulit bagi Claude untuk dimanipulasi menggunakan gerakan mouse. Jika Anda mengalami ini, coba beri prompt model untuk menggunakan pintasan keyboard.
4. Untuk tugas yang dapat diulang atau interaksi UI, sertakan contoh screenshot dan panggilan alat hasil yang berhasil dalam prompt Anda.
5. Jika Anda perlu model untuk login, berikan nama pengguna dan kata sandi dalam prompt Anda di dalam tag xml seperti `<robot_credentials>`. Menggunakan computer use dalam aplikasi yang memerlukan login meningkatkan risiko hasil buruk karena injeksi prompt. Silakan tinjau [panduan kami tentang mitigasi injeksi prompt](/docs/id/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks) sebelum memberikan model kredensial login.

<Tip>
  Jika Anda berulang kali mengalami serangkaian masalah yang jelas atau mengetahui sebelumnya tugas yang perlu Claude selesaikan, gunakan system prompt untuk memberikan Claude tips atau instruksi eksplisit tentang cara menyelesaikan tugas dengan sukses.
</Tip>

### System prompts

Ketika salah satu alat yang ditentukan Anthropic diminta melalui Claude API, system prompt khusus computer use dihasilkan. Ini mirip dengan [tool use system prompt](/docs/id/agents-and-tools/tool-use/implement-tool-use#tool-use-system-prompt) tetapi dimulai dengan:

> Anda memiliki akses ke serangkaian fungsi yang dapat Anda gunakan untuk menjawab pertanyaan pengguna. Ini termasuk akses ke lingkungan komputasi bersandal. Anda saat ini TIDAK memiliki kemampuan untuk memeriksa file atau berinteraksi dengan sumber daya eksternal, kecuali dengan memanggil fungsi di bawah ini.

Seperti dengan tool use reguler, bidang `system_prompt` yang disediakan pengguna masih dihormati dan digunakan dalam konstruksi system prompt gabungan.

### Tindakan yang tersedia

Alat computer use mendukung tindakan berikut:

**Tindakan dasar (semua versi)**
- **screenshot** - Tangkap tampilan saat ini
- **left_click** - Klik pada koordinat `[x, y]`
- **type** - Ketik string teks
- **key** - Tekan tombol atau kombinasi tombol (misalnya, "ctrl+s")
- **mouse_move** - Pindahkan kursor ke koordinat

**Tindakan yang ditingkatkan (`computer_20250124`)**
Tersedia di model Claude 4 dan Claude Sonnet 3.7:
- **scroll** - Gulir ke arah mana pun dengan kontrol jumlah
- **left_click_drag** - Klik dan seret antara koordinat
- **right_click**, **middle_click** - Tombol mouse tambahan
- **double_click**, **triple_click** - Beberapa klik
- **left_mouse_down**, **left_mouse_up** - Kontrol klik terperinci
- **hold_key** - Tahan tombol sambil melakukan tindakan lain
- **wait** - Jeda antara tindakan

**Tindakan yang ditingkatkan (`computer_20251124`)**
Tersedia di Claude Opus 4.5:
- Semua tindakan dari `computer_20250124`
- **zoom** - Lihat wilayah layar tertentu dengan resolusi penuh. Memerlukan `enable_zoom: true` dalam definisi alat. Mengambil parameter `region` dengan koordinat `[x1, y1, x2, y2]` yang menentukan sudut kiri atas dan kanan bawah area untuk diperiksa.

<section title="Contoh tindakan">

```json
// Ambil screenshot
{
  "action": "screenshot"
}

// Klik pada posisi
{
  "action": "left_click",
  "coordinate": [500, 300]
}

// Ketik teks
{
  "action": "type",
  "text": "Halo, dunia!"
}

// Gulir ke bawah (Claude 4/3.7)
{
  "action": "scroll",
  "coordinate": [500, 400],
  "scroll_direction": "down",
  "scroll_amount": 3
}

// Zoom untuk melihat wilayah secara detail (Opus 4.5)
{
  "action": "zoom",
  "region": [100, 200, 400, 350]
}
```

</section>

### Parameter alat

| Parameter | Diperlukan | Deskripsi |
|-----------|-----------|-----------|
| `type` | Ya | Versi alat (`computer_20251124`, `computer_20250124`, atau `computer_20241022`) |
| `name` | Ya | Harus "computer" |
| `display_width_px` | Ya | Lebar tampilan dalam piksel |
| `display_height_px` | Ya | Tinggi tampilan dalam piksel |
| `display_number` | Tidak | Nomor tampilan untuk lingkungan X11 |
| `enable_zoom` | Tidak | Aktifkan aksi zoom (`computer_20251124` hanya). Atur ke `true` untuk memungkinkan Claude zoom ke wilayah layar tertentu. Default: `false` |

<Note>
**Penting**: Alat computer use harus secara eksplisit dieksekusi oleh aplikasi Anda - Claude tidak dapat mengeksekusinya secara langsung. Anda bertanggung jawab untuk mengimplementasikan penangkapan screenshot, gerakan mouse, input keyboard, dan tindakan lainnya berdasarkan permintaan Claude.
</Note>

### Aktifkan kemampuan thinking di model Claude 4 dan Claude Sonnet 3.7

Claude Sonnet 3.7 memperkenalkan kemampuan "thinking" baru yang memungkinkan Anda melihat proses penalaran model saat menyelesaikan tugas kompleks. Fitur ini membantu Anda memahami bagaimana Claude mendekati masalah dan dapat sangat berharga untuk debugging atau tujuan pendidikan.

Untuk mengaktifkan thinking, tambahkan parameter `thinking` ke permintaan API Anda:

```json
"thinking": {
  "type": "enabled",
  "budget_tokens": 1024
}
```

Parameter `budget_tokens` menentukan berapa banyak token yang dapat Claude gunakan untuk thinking. Ini dikurangkan dari anggaran `max_tokens` keseluruhan Anda.

Ketika thinking diaktifkan, Claude akan mengembalikan proses penalarannya sebagai bagian dari respons, yang dapat membantu Anda:

1. Memahami proses pengambilan keputusan model
2. Mengidentifikasi masalah potensial atau kesalahpahaman
3. Belajar dari pendekatan Claude terhadap pemecahan masalah
4. Dapatkan lebih banyak visibilitas ke dalam operasi multi-langkah yang kompleks

Berikut adalah contoh dari apa yang mungkin terlihat seperti output thinking:

```
[Thinking]
Saya perlu menyimpan gambar kucing ke desktop. Mari saya uraikan ini menjadi langkah-langkah:

1. Pertama, saya akan mengambil screenshot untuk melihat apa yang ada di desktop
2. Kemudian saya akan mencari browser web untuk mencari gambar kucing
3. Setelah menemukan gambar yang cocok, saya perlu menyimpannya ke desktop

Mari saya mulai dengan mengambil screenshot untuk melihat apa yang tersedia...
```

### Augmentasi computer use dengan alat lain

Alat computer use dapat dikombinasikan dengan alat lain untuk membuat alur kerja otomasi yang lebih kuat. Ini sangat berguna ketika Anda perlu:
- Menjalankan perintah sistem ([alat bash](/docs/id/agents-and-tools/tool-use/bash-tool))
- Edit file konfigurasi atau skrip ([alat editor teks](/docs/id/agents-and-tools/tool-use/text-editor-tool))
- Integrasikan dengan API atau layanan kustom (alat kustom)

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: computer-use-2025-01-24" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 2000,
      "tools": [
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Dapatkan cuaca saat ini di lokasi tertentu",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "Kota dan negara bagian, misalnya San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "Unit suhu, baik 'celsius' atau 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Temukan penerbangan dari San Francisco ke tempat dengan cuaca yang lebih hangat."
        }
      ],
      "thinking": {
        "type": "enabled",
        "budget_tokens": 1024
      }
    }'
  ```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Dapatkan cuaca saat ini di lokasi tertentu",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "Kota dan negara bagian, misalnya San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "Unit suhu, baik 'celsius' atau 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        },
    ],
    messages=[{"role": "user", "content": "Temukan penerbangan dari San Francisco ke tempat dengan cuaca yang lebih hangat."}],
    betas=["computer-use-2025-01-24"],
    thinking={"type": "enabled", "budget_tokens": 1024},
)
print(response)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
      {
        type: "computer_20250124",
        name: "computer",
        display_width_px: 1024,
        display_height_px: 768,
        display_number: 1,
      },
      {
        type: "text_editor_20250728",
        name: "str_replace_based_edit_tool"
      },
      {
        type: "bash_20250124",
        name: "bash"
      },
      {
        name: "get_weather",
        description: "Dapatkan cuaca saat ini di lokasi tertentu",
        input_schema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "Kota dan negara bagian, misalnya San Francisco, CA"
            },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
              description: "Unit suhu, baik 'celsius' atau 'fahrenheit'"
            }
          },
          required: ["location"]
        }
      },
  ],
  messages: [{ role: "user", content: "Temukan penerbangan dari San Francisco ke tempat dengan cuaca yang lebih hangat." }],
  betas: ["computer-use-2025-01-24"],
  thinking: { type: "enabled", budget_tokens: 1024 },
});
console.log(message);
```
```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaToolBash20250124;
import com.anthropic.models.beta.messages.BetaToolComputerUse20250124;
import com.anthropic.models.beta.messages.BetaToolTextEditor20250124;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaThinkingConfigParam;
import com.anthropic.models.beta.messages.BetaTool;

public class MultipleToolsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model("claude-sonnet-4-5")
                .maxTokens(1024)
                .addTool(BetaToolComputerUse20250124.builder()
                        .displayWidthPx(1024)
                        .displayHeightPx(768)
                        .displayNumber(1)
                        .build())
                .addTool(BetaToolTextEditor20250124.builder()
                        .build())
                .addTool(BetaToolBash20250124.builder()
                        .build())
                .addTool(BetaTool.builder()
                        .name("get_weather")
                        .description("Dapatkan cuaca saat ini di lokasi tertentu")
                        .inputSchema(BetaTool.InputSchema.builder()
                                .properties(
                                        JsonValue.from(
                                                Map.of(
                                                        "location", Map.of(
                                                                "type", "string",
                                                                "description", "Kota dan negara bagian, misalnya San Francisco, CA"
                                                        ),
                                                        "unit", Map.of(
                                                                "type", "string",
                                                                "enum", List.of("celsius", "fahrenheit"),
                                                                "description", "Unit suhu, baik 'celsius' atau 'fahrenheit'"
                                                        )
                                                )
                                        ))
                                .build()
                        )
                        .build())
                .thinking(BetaThinkingConfigParam.ofEnabled(
                        BetaThinkingConfigEnabled.builder()
                                .budgetTokens(1024)
                                .build()
                ))
                .addUserMessage("Temukan penerbangan dari San Francisco ke tempat dengan cuaca yang lebih hangat.")
                .addBeta("computer-use-2025-01-24")
                .build();

        BetaMessage message = client.beta().messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

### Bangun lingkungan penggunaan komputer khusus

[Implementasi referensi](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) dirancang untuk membantu Anda memulai dengan penggunaan komputer. Ini mencakup semua komponen yang diperlukan agar Claude dapat menggunakan komputer. Namun, Anda dapat membangun lingkungan Anda sendiri untuk penggunaan komputer sesuai kebutuhan Anda. Anda akan memerlukan:

- Lingkungan virtual atau terkontainerisasi yang cocok untuk penggunaan komputer dengan Claude
- Implementasi setidaknya satu dari alat penggunaan komputer yang ditentukan oleh Anthropic
- Loop agen yang berinteraksi dengan API Claude dan menjalankan hasil `tool_use` menggunakan implementasi alat Anda
- API atau UI yang memungkinkan input pengguna untuk memulai loop agen

#### Implementasikan alat penggunaan komputer

Alat penggunaan komputer diimplementasikan sebagai alat tanpa skema. Saat menggunakan alat ini, Anda tidak perlu memberikan skema input seperti alat lainnya; skema dibangun ke dalam model Claude dan tidak dapat dimodifikasi.

<Steps>
  <Step title="Siapkan lingkungan komputasi Anda">
    Buat tampilan virtual atau sambungkan ke tampilan yang ada yang akan berinteraksi dengan Claude. Ini biasanya melibatkan pengaturan Xvfb (X Virtual Framebuffer) atau teknologi serupa.
  </Step>
  <Step title="Implementasikan penanganan tindakan">
    Buat fungsi untuk menangani setiap jenis tindakan yang mungkin diminta Claude:
    ```python
    def handle_computer_action(action_type, params):
        if action_type == "screenshot":
            return capture_screenshot()
        elif action_type == "left_click":
            x, y = params["coordinate"]
            return click_at(x, y)
        elif action_type == "type":
            return type_text(params["text"])
        # ... tangani tindakan lainnya
    ```
  </Step>
  <Step title="Proses panggilan alat Claude">
    Ekstrak dan jalankan panggilan alat dari respons Claude:
    ```python
    for content in response.content:
        if content.type == "tool_use":
            action = content.input["action"]
            result = handle_computer_action(action, content.input)
            
            # Kembalikan hasil ke Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="Implementasikan loop agen">
    Buat loop yang berlanjut sampai Claude menyelesaikan tugas:
    ```python
    while True:
        response = client.beta.messages.create(...)
        
        # Periksa apakah Claude menggunakan alat apa pun
        tool_results = process_tool_calls(response)
        
        if not tool_results:
            # Tidak ada lagi penggunaan alat, tugas selesai
            break
            
        # Lanjutkan percakapan dengan hasil alat
        messages.append({"role": "user", "content": tool_results})
    ```
  </Step>
</Steps>

#### Tangani kesalahan

Saat mengimplementasikan alat penggunaan komputer, berbagai kesalahan mungkin terjadi. Berikut cara menanganinya:

<section title="Kegagalan penangkapan tangkapan layar">

Jika penangkapan tangkapan layar gagal, kembalikan pesan kesalahan yang sesuai:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to capture screenshot. Display may be locked or unavailable.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Koordinat tidak valid">

Jika Claude memberikan koordinat di luar batas tampilan:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Coordinates (1200, 900) are outside display bounds (1024x768).",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Kegagalan eksekusi tindakan">

Jika tindakan gagal dijalankan:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to perform click action. The application may be unresponsive.",
      "is_error": true
    }
  ]
}
```

</section>

#### Tangani penskalaan koordinat untuk resolusi yang lebih tinggi

API membatasi gambar hingga maksimal 1568 piksel pada tepi terpanjang dan sekitar 1,15 megapiksel total (lihat [pengubahan ukuran gambar](/docs/id/build-with-claude/vision#evaluate-image-size) untuk detail). Misalnya, layar 1512x982 dikurangi sampel menjadi sekitar 1330x864. Claude menganalisis gambar yang lebih kecil ini dan mengembalikan koordinat dalam ruang itu, tetapi alat Anda menjalankan klik dalam ruang layar asli.

Ini dapat menyebabkan koordinat klik Claude melewatkan target mereka kecuali Anda menangani transformasi koordinat.

Untuk memperbaiki ini, ubah ukuran tangkapan layar sendiri dan skalakan koordinat Claude kembali:

<CodeGroup>
```python Python
import math

def get_scale_factor(width, height):
    """Calculate scale factor to meet API constraints."""
    long_edge = max(width, height)
    total_pixels = width * height

    long_edge_scale = 1568 / long_edge
    total_pixels_scale = math.sqrt(1_150_000 / total_pixels)

    return min(1.0, long_edge_scale, total_pixels_scale)

# When capturing screenshot
scale = get_scale_factor(screen_width, screen_height)
scaled_width = int(screen_width * scale)
scaled_height = int(screen_height * scale)

# Resize image to scaled dimensions before sending to Claude
screenshot = capture_and_resize(scaled_width, scaled_height)

# When handling Claude's coordinates, scale them back up
def execute_click(x, y):
    screen_x = x / scale
    screen_y = y / scale
    perform_click(screen_x, screen_y)
```

```typescript TypeScript
const MAX_LONG_EDGE = 1568;
const MAX_PIXELS = 1_150_000;

function getScaleFactor(width: number, height: number): number {
  const longEdge = Math.max(width, height);
  const totalPixels = width * height;

  const longEdgeScale = MAX_LONG_EDGE / longEdge;
  const totalPixelsScale = Math.sqrt(MAX_PIXELS / totalPixels);

  return Math.min(1.0, longEdgeScale, totalPixelsScale);
}

// When capturing screenshot
const scale = getScaleFactor(screenWidth, screenHeight);
const scaledWidth = Math.floor(screenWidth * scale);
const scaledHeight = Math.floor(screenHeight * scale);

// Resize image to scaled dimensions before sending to Claude
const screenshot = captureAndResize(scaledWidth, scaledHeight);

// When handling Claude's coordinates, scale them back up
function executeClick(x: number, y: number): void {
  const screenX = x / scale;
  const screenY = y / scale;
  performClick(screenX, screenY);
}
```
</CodeGroup>

#### Ikuti praktik terbaik implementasi

<section title="Gunakan resolusi tampilan yang sesuai">

Atur dimensi tampilan yang sesuai dengan kasus penggunaan Anda sambil tetap berada dalam batas yang direkomendasikan:
- Untuk tugas desktop umum: 1024x768 atau 1280x720
- Untuk aplikasi web: 1280x800 atau 1366x768
- Hindari resolusi di atas 1920x1080 untuk mencegah masalah kinerja

</section>

<section title="Implementasikan penanganan tangkapan layar yang tepat">

Saat mengembalikan tangkapan layar ke Claude:
- Enkode tangkapan layar sebagai PNG atau JPEG base64
- Pertimbangkan untuk mengompresi tangkapan layar besar untuk meningkatkan kinerja
- Sertakan metadata yang relevan seperti stempel waktu atau status tampilan
- Jika menggunakan resolusi yang lebih tinggi, pastikan koordinat diskalakan dengan akurat

</section>

<section title="Tambahkan penundaan tindakan">

Beberapa aplikasi memerlukan waktu untuk merespons tindakan:
```python
def click_and_wait(x, y, wait_time=0.5):
    click_at(x, y)
    time.sleep(wait_time)  # Allow UI to update
```

</section>

<section title="Validasi tindakan sebelum eksekusi">

Periksa bahwa tindakan yang diminta aman dan valid:
```python
def validate_action(action_type, params):
    if action_type == "left_click":
        x, y = params.get("coordinate", (0, 0))
        if not (0 <= x < display_width and 0 <= y < display_height):
            return False, "Coordinates out of bounds"
    return True, None
```

</section>

<section title="Catat tindakan untuk debugging">

Simpan log semua tindakan untuk pemecahan masalah:
```python
import logging

def log_action(action_type, params, result):
    logging.info(f"Action: {action_type}, Params: {params}, Result: {result}")
```

</section>

---

## Pahami keterbatasan penggunaan komputer

Fungsionalitas penggunaan komputer masih dalam versi beta. Meskipun kemampuan Claude terdepan, pengembang harus menyadari keterbatasannya:

1. **Latensi**: latensi penggunaan komputer saat ini untuk interaksi manusia-AI mungkin terlalu lambat dibandingkan dengan tindakan komputer yang diarahkan manusia biasa. Kami merekomendasikan fokus pada kasus penggunaan di mana kecepatan tidak kritis (misalnya, pengumpulan informasi latar belakang, pengujian perangkat lunak otomatis) di lingkungan terpercaya.
2. **Akurasi dan keandalan visi komputer**: Claude mungkin membuat kesalahan atau berhalusinasi saat menampilkan koordinat spesifik sambil menghasilkan tindakan. Claude Sonnet 3.7 memperkenalkan kemampuan pemikiran yang dapat membantu Anda memahami penalaran model dan mengidentifikasi masalah potensial.
3. **Akurasi dan keandalan pemilihan alat**: Claude mungkin membuat kesalahan atau berhalusinasi saat memilih alat sambil menghasilkan tindakan atau mengambil tindakan yang tidak terduga untuk menyelesaikan masalah. Selain itu, keandalan mungkin lebih rendah saat berinteraksi dengan aplikasi niche atau beberapa aplikasi sekaligus. Kami merekomendasikan agar pengguna dengan hati-hati memberi prompt pada model saat meminta tugas yang kompleks.
4. **Keandalan pengguliran**: Claude Sonnet 3.7 memperkenalkan tindakan pengguliran khusus dengan kontrol arah yang meningkatkan keandalan. Model sekarang dapat secara eksplisit menggulir ke arah mana pun (atas/bawah/kiri/kanan) dengan jumlah yang ditentukan.
5. **Interaksi spreadsheet**: Klik mouse untuk interaksi spreadsheet telah ditingkatkan di Claude Sonnet 3.7 dengan penambahan tindakan kontrol mouse yang lebih presisi seperti `left_mouse_down`, `left_mouse_up`, dan dukungan tombol pengubah baru. Pemilihan sel dapat lebih andal dengan menggunakan kontrol butir halus ini dan menggabungkan tombol pengubah dengan klik.
6. **Pembuatan akun dan pembuatan konten di platform media sosial dan komunikasi**: Meskipun Claude akan mengunjungi situs web, kami membatasi kemampuannya untuk membuat akun atau menghasilkan dan berbagi konten atau sebaliknya terlibat dalam peniruan manusia di seluruh situs web dan platform media sosial. Kami dapat memperbarui kemampuan ini di masa depan.
7. **Kerentanan**: Kerentanan seperti jailbreaking atau injeksi prompt mungkin tetap ada di seluruh sistem AI frontier, termasuk API penggunaan komputer beta. Dalam beberapa keadaan, Claude akan mengikuti perintah yang ditemukan dalam konten, kadang-kadang bahkan bertentangan dengan instruksi pengguna. Misalnya, instruksi Claude di halaman web atau yang terdapat dalam gambar dapat mengganti instruksi atau menyebabkan Claude membuat kesalahan. Kami merekomendasikan:
   a. Membatasi penggunaan komputer ke lingkungan terpercaya seperti mesin virtual atau kontainer dengan hak istimewa minimal
   b. Menghindari pemberian akses penggunaan komputer ke akun sensitif atau data tanpa pengawasan ketat
   c. Menginformasikan pengguna akhir tentang risiko yang relevan dan mendapatkan persetujuan mereka sebelum mengaktifkan atau meminta izin yang diperlukan untuk fitur penggunaan komputer di aplikasi Anda
8. **Tindakan yang tidak pantas atau ilegal**: Sesuai dengan syarat layanan Anthropic, Anda tidak boleh menggunakan penggunaan komputer untuk melanggar hukum apa pun atau Kebijakan Penggunaan Kami yang Dapat Diterima.

Selalu tinjau dan verifikasi dengan hati-hati tindakan dan log penggunaan komputer Claude. Jangan gunakan Claude untuk tugas yang memerlukan presisi sempurna atau informasi pengguna sensitif tanpa pengawasan manusia.

---

## Harga

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## Langkah berikutnya

<CardGroup cols={2}>
  <Card
    title="Implementasi referensi"
    icon="github-logo"
    href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
  >
    Mulai dengan cepat dengan implementasi berbasis Docker lengkap kami
  </Card>
  <Card
    title="Dokumentasi alat"
    icon="tool"
    href="/docs/id/agents-and-tools/tool-use/overview"
  >
    Pelajari lebih lanjut tentang penggunaan alat dan membuat alat khusus
  </Card>
</CardGroup>