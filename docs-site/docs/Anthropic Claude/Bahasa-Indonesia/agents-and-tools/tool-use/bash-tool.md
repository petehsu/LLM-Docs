# Alat bash

Alat bash memungkinkan Claude untuk menjalankan perintah shell dalam sesi bash yang persisten, memungkinkan operasi sistem, eksekusi skrip, dan otomasi baris perintah.

---

Alat bash memungkinkan Claude untuk menjalankan perintah shell dalam sesi bash yang persisten, memungkinkan operasi sistem, eksekusi skrip, dan otomasi baris perintah.

## Ikhtisar

Alat bash menyediakan Claude dengan:
- Sesi bash persisten yang mempertahankan status
- Kemampuan untuk menjalankan perintah shell apa pun
- Akses ke variabel lingkungan dan direktori kerja
- Kemampuan perantaian perintah dan skrip

## Kompatibilitas model

| Model | Versi Alat |
|-------|--------------|
| Model Claude 4 dan Sonnet 3.7 ([deprecated](/docs/id/about-claude/model-deprecations)) | `bash_20250124` |

<Warning>
Versi alat yang lebih lama tidak dijamin kompatibel mundur dengan model yang lebih baru. Selalu gunakan versi alat yang sesuai dengan versi model Anda.
</Warning>

## Kasus penggunaan

- **Alur kerja pengembangan**: Jalankan perintah build, tes, dan alat pengembangan
- **Otomasi sistem**: Jalankan skrip, kelola file, otomatisasi tugas
- **Pemrosesan data**: Proses file, jalankan skrip analisis, kelola dataset
- **Penyiapan lingkungan**: Instal paket, konfigurasi lingkungan

## Mulai cepat

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "bash_20250124",
            "name": "bash"
        }
    ],
    messages=[
        {"role": "user", "content": "List all Python files in the current directory."}
    ]
)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "List all Python files in the current directory."
      }
    ]
  }'
```
</CodeGroup>

## Cara kerjanya

Alat bash mempertahankan sesi yang persisten:

1. Claude menentukan perintah apa yang akan dijalankan
2. Anda menjalankan perintah di shell bash
3. Kembalikan output (stdout dan stderr) ke Claude
4. Status sesi bertahan di antara perintah (variabel lingkungan, direktori kerja)

## Parameter

| Parameter | Diperlukan | Deskripsi |
|-----------|----------|-------------|
| `command` | Ya* | Perintah bash yang akan dijalankan |
| `restart` | Tidak | Atur ke `true` untuk memulai ulang sesi bash |

*Diperlukan kecuali menggunakan `restart`

<section title="Contoh penggunaan">

```json
// Jalankan perintah
{
  "command": "ls -la *.py"
}

// Mulai ulang sesi
{
  "restart": true
}
```

</section>

## Contoh: Otomasi multi-langkah

Claude dapat merantai perintah untuk menyelesaikan tugas kompleks:

```python
# Permintaan pengguna
"Install the requests library and create a simple Python script that fetches a joke from an API, then run it."

# Alat Claude menggunakan:
# 1. Instal paket
{"command": "pip install requests"}

# 2. Buat skrip
{"command": "cat > fetch_joke.py << 'EOF'\nimport requests\nresponse = requests.get('https://official-joke-api.appspot.com/random_joke')\njoke = response.json()\nprint(f\"Setup: {joke['setup']}\")\nprint(f\"Punchline: {joke['punchline']}\")\nEOF"}

# 3. Jalankan skrip
{"command": "python fetch_joke.py"}
```

Sesi mempertahankan status di antara perintah, jadi file yang dibuat di langkah 2 tersedia di langkah 3.

***

## Implementasikan alat bash

Alat bash diimplementasikan sebagai alat tanpa skema. Saat menggunakan alat ini, Anda tidak perlu menyediakan skema input seperti alat lainnya; skema sudah tertanam dalam model Claude dan tidak dapat dimodifikasi.

<Steps>
  <Step title="Siapkan lingkungan bash">
    Buat sesi bash persisten yang dapat berinteraksi dengan Claude:
    ```python
    import subprocess
    import threading
    import queue
    
    class BashSession:
        def __init__(self):
            self.process = subprocess.Popen(
                ['/bin/bash'],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0
            )
            self.output_queue = queue.Queue()
            self.error_queue = queue.Queue()
            self._start_readers()
    ```
  </Step>
  <Step title="Tangani eksekusi perintah">
    Buat fungsi untuk menjalankan perintah dan menangkap output:
    ```python
    def execute_command(self, command):
        # Kirim perintah ke bash
        self.process.stdin.write(command + '\n')
        self.process.stdin.flush()
        
        # Tangkap output dengan timeout
        output = self._read_output(timeout=10)
        return output
    ```
  </Step>
  <Step title="Proses panggilan alat Claude">
    Ekstrak dan jalankan perintah dari respons Claude:
    ```python
    for content in response.content:
        if content.type == "tool_use" and content.name == "bash":
            if content.input.get("restart"):
                bash_session.restart()
                result = "Bash session restarted"
            else:
                command = content.input.get("command")
                result = bash_session.execute_command(command)
            
            # Kembalikan hasil ke Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="Implementasikan langkah-langkah keamanan">
    Tambahkan validasi dan pembatasan:
    ```python
    def validate_command(command):
        # Blokir perintah berbahaya
        dangerous_patterns = ['rm -rf /', 'format', ':(){:|:&};:']
        for pattern in dangerous_patterns:
            if pattern in command:
                return False, f"Command contains dangerous pattern: {pattern}"
        
        # Tambahkan validasi lebih lanjut sesuai kebutuhan
        return True, None
    ```
  </Step>
</Steps>

### Tangani kesalahan

Saat mengimplementasikan alat bash, tangani berbagai skenario kesalahan:

<section title="Timeout eksekusi perintah">

Jika perintah memakan waktu terlalu lama untuk dieksekusi:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Command timed out after 30 seconds",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Perintah tidak ditemukan">

Jika perintah tidak ada:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: nonexistentcommand: command not found",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Izin ditolak">

Jika ada masalah izin:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: /root/sensitive-file: Permission denied",
      "is_error": true
    }
  ]
}
```

</section>

### Ikuti praktik terbaik implementasi

<section title="Gunakan timeout perintah">

Implementasikan timeout untuk mencegah perintah yang menggantung:
```python
def execute_with_timeout(command, timeout=30):
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=timeout
        )
        return result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return f"Command timed out after {timeout} seconds"
```

</section>

<section title="Pertahankan status sesi">

Jaga sesi bash tetap persisten untuk mempertahankan variabel lingkungan dan direktori kerja:
```python
# Perintah yang dijalankan dalam sesi yang sama mempertahankan status
commands = [
    "cd /tmp",
    "echo 'Hello' > test.txt",
    "cat test.txt"  # Ini berfungsi karena kami masih berada di /tmp
]
```

</section>

<section title="Tangani output besar">

Potong output yang sangat besar untuk mencegah masalah batas token:
```python
def truncate_output(output, max_lines=100):
    lines = output.split('\n')
    if len(lines) > max_lines:
        truncated = '\n'.join(lines[:max_lines])
        return f"{truncated}\n\n... Output truncated ({len(lines)} total lines) ..."
    return output
```

</section>

<section title="Catat semua perintah">

Simpan jejak audit perintah yang dieksekusi:
```python
import logging

def log_command(command, output, user_id):
    logging.info(f"User {user_id} executed: {command}")
    logging.info(f"Output: {output[:200]}...")  # Catat 200 karakter pertama
```

</section>

<section title="Sanitasi output">

Hapus informasi sensitif dari output perintah:
```python
def sanitize_output(output):
    # Hapus potensi rahasia atau kredensial
    import re
    # Contoh: Hapus kredensial AWS
    output = re.sub(r'aws_access_key_id\s*=\s*\S+', 'aws_access_key_id=***', output)
    output = re.sub(r'aws_secret_access_key\s*=\s*\S+', 'aws_secret_access_key=***', output)
    return output
```

</section>

## Keamanan

<Warning>
Alat bash menyediakan akses sistem langsung. Implementasikan langkah-langkah keamanan penting ini:
- Menjalankan di lingkungan terisolasi (Docker/VM)
- Mengimplementasikan penyaringan perintah dan daftar izin
- Menetapkan batas sumber daya (CPU, memori, disk)
- Mencatat semua perintah yang dieksekusi
</Warning>

### Rekomendasi utama
- Gunakan `ulimit` untuk menetapkan batasan sumber daya
- Saring perintah berbahaya (`sudo`, `rm -rf`, dll.)
- Jalankan dengan izin pengguna minimal
- Pantau dan catat semua eksekusi perintah

## Harga

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

Lihat [harga penggunaan alat](/docs/id/agents-and-tools/tool-use/overview#pricing) untuk detail harga lengkap.

## Pola umum

### Alur kerja pengembangan
- Menjalankan tes: `pytest && coverage report`
- Membangun proyek: `npm install && npm run build`
- Operasi Git: `git status && git add . && git commit -m "message"`

### Operasi file
- Memproses data: `wc -l *.csv && ls -lh *.csv`
- Mencari file: `find . -name "*.py" | xargs grep "pattern"`
- Membuat cadangan: `tar -czf backup.tar.gz ./data`

### Tugas sistem
- Memeriksa sumber daya: `df -h && free -m`
- Manajemen proses: `ps aux | grep python`
- Penyiapan lingkungan: `export PATH=$PATH:/new/path && echo $PATH`

## Keterbatasan

- **Tidak ada perintah interaktif**: Tidak dapat menangani `vim`, `less`, atau permintaan kata sandi
- **Tidak ada aplikasi GUI**: Hanya baris perintah
- **Cakupan sesi**: Bertahan dalam percakapan, hilang di antara panggilan API
- **Batas output**: Output besar mungkin dipotong
- **Tidak ada streaming**: Hasil dikembalikan setelah selesai

## Menggabungkan dengan alat lain

Alat bash paling kuat ketika digabungkan dengan [editor teks](/docs/id/agents-and-tools/tool-use/text-editor-tool) dan alat lainnya.

## Langkah berikutnya

<CardGroup cols={2}>
  <Card
    title="Ikhtisar penggunaan alat"
    icon="tool"
    href="/docs/id/agents-and-tools/tool-use/overview"
  >
    Pelajari tentang penggunaan alat dengan Claude
  </Card>

  <Card
    title="Alat editor teks"
    icon="file"
    href="/docs/id/agents-and-tools/tool-use/text-editor-tool"
  >
    Lihat dan edit file teks dengan Claude
  </Card>
</CardGroup>