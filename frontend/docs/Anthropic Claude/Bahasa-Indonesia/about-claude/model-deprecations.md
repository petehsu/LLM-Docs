# Penghentian model

Informasi tentang penghentian model Anthropic, termasuk status model, tanggal pensiun, dan panduan migrasi.

---

Saat kami meluncurkan model yang lebih aman dan lebih mampu, kami secara teratur menghentikan model yang lebih lama. Aplikasi yang mengandalkan model Anthropic mungkin memerlukan pembaruan sesekali untuk terus berfungsi. Pelanggan yang terdampak akan selalu diberitahu melalui email dan dalam dokumentasi kami.

Halaman ini mencantumkan semua penghentian API, bersama dengan pengganti yang direkomendasikan.

## Ikhtisar

Anthropic menggunakan istilah berikut untuk menggambarkan siklus hidup model kami:
- **Aktif**: Model sepenuhnya didukung dan direkomendasikan untuk digunakan.
- **Warisan**: Model tidak akan lagi menerima pembaruan dan mungkin akan dihentikan di masa depan.
- **Dihentikan**: Model tidak lagi tersedia untuk pelanggan baru tetapi terus tersedia untuk pengguna yang ada hingga pensiun. Kami menetapkan tanggal pensiun pada titik ini.
- **Pensiun**: Model tidak lagi tersedia untuk digunakan. Permintaan ke model yang pensiun akan gagal.

<Warning>
Harap perhatikan bahwa model yang dihentikan kemungkinan akan kurang andal daripada model aktif. Kami mendesak Anda untuk memindahkan beban kerja ke model aktif untuk mempertahankan tingkat dukungan dan keandalan tertinggi.
</Warning>

## Migrasi ke pengganti

Setelah model dihentikan, harap migrasikan semua penggunaan ke pengganti yang sesuai sebelum tanggal pensiun. Permintaan ke model setelah tanggal pensiun akan gagal.

Untuk membantu mengukur kinerja model pengganti pada tugas Anda, kami merekomendasikan pengujian menyeluruh aplikasi Anda dengan model baru jauh sebelum tanggal pensiun.

Untuk instruksi khusus tentang migrasi dari Claude 3.7 ke model Claude 4.5, lihat [Migrasi ke Claude 4.5](/docs/id/about-claude/models/migrating-to-claude-4).

## Pemberitahuan

Anthropic memberitahu pelanggan dengan penerapan aktif untuk model dengan pensiun yang akan datang. Kami memberikan pemberitahuan setidaknya 60 hari sebelum pensiun model untuk model yang dirilis secara publik.

## Audit penggunaan model

Untuk membantu mengidentifikasi penggunaan model yang dihentikan, pelanggan dapat mengakses audit penggunaan API mereka. Ikuti langkah-langkah berikut:

1. Buka halaman [Penggunaan](/settings/usage) di Konsol
2. Klik tombol "Ekspor"
3. Tinjau CSV yang diunduh untuk melihat penggunaan yang dipecah berdasarkan kunci API dan model

Audit ini akan membantu Anda menemukan instance apa pun di mana aplikasi Anda masih menggunakan model yang dihentikan, memungkinkan Anda memprioritaskan pembaruan ke model yang lebih baru sebelum tanggal pensiun.

## Praktik terbaik

1. Secara teratur periksa dokumentasi kami untuk pembaruan tentang penghentian model.
2. Uji aplikasi Anda dengan model yang lebih baru jauh sebelum tanggal pensiun model saat ini.
3. Perbarui kode Anda untuk menggunakan model pengganti yang direkomendasikan sesegera mungkin.
4. Hubungi tim dukungan kami jika Anda memerlukan bantuan dengan migrasi atau memiliki pertanyaan apa pun.

## Kelemahan penghentian dan mitigasi

Kami saat ini menghentikan dan menonaktifkan model untuk memastikan kapasitas untuk rilis model baru. Kami menyadari bahwa ini memiliki kelemahan:
- Pengguna yang menghargai model tertentu harus bermigrasi ke versi baru
- Peneliti kehilangan akses ke model untuk studi berkelanjutan dan komparatif
- Pensiun model memperkenalkan risiko terkait keselamatan dan kesejahteraan model

Pada beberapa titik, kami berharap dapat membuat model masa lalu tersedia untuk umum lagi. Sementara itu, kami telah berkomitmen untuk pelestarian jangka panjang bobot model dan tindakan lain untuk membantu mengurangi dampak ini. Untuk detail lebih lanjut, lihat [Komitmen pada Penghentian dan Pelestarian Model](https://www.anthropic.com/research/deprecation-commitments).

## Status model

Semua model yang dirilis secara publik tercantum di bawah dengan statusnya:

| Nama Model API              | Status Saat Ini | Dihentikan        | Tanggal Pensiun Tentatif |
|:----------------------------|:----------------|:------------------|:-------------------------|
| `claude-3-opus-20240229`    | Dihentikan      | 30 Juni 2025      | 5 Januari 2026           |
| `claude-3-haiku-20240307`   | Aktif           | N/A               | Tidak lebih awal dari 7 Maret 2025 |
| `claude-3-5-haiku-20241022` | Aktif           | N/A               | Tidak lebih awal dari 22 Oktober 2025 |
| `claude-3-7-sonnet-20250219`| Dihentikan      | 28 Oktober 2025   | 19 Februari 2026         |
| `claude-sonnet-4-20250514`  | Aktif           | N/A               | Tidak lebih awal dari 14 Mei 2026 |
| `claude-opus-4-20250514`    | Aktif           | N/A               | Tidak lebih awal dari 14 Mei 2026 |
| `claude-opus-4-1-20250805`  | Aktif           | N/A               | Tidak lebih awal dari 5 Agustus 2026 |
| `claude-sonnet-4-5-20250929`| Aktif           | N/A               | Tidak lebih awal dari 29 September 2026 |
| `claude-haiku-4-5-20251001` | Aktif           | N/A               | Tidak lebih awal dari 15 Oktober 2026 |
| `claude-opus-4-5-20251101`  | Aktif           | N/A               | Tidak lebih awal dari 24 November 2026 |

## Riwayat penghentian

Semua penghentian tercantum di bawah, dengan pengumuman terbaru di bagian atas.

### 2025-10-28: Model Claude Sonnet 3.7

Pada 28 Oktober 2025, kami memberitahu pengembang yang menggunakan model Claude Sonnet 3.7 tentang pensiun yang akan datang di Claude API.

| Tanggal Pensiun             | Model yang Dihentikan       | Pengganti yang Direkomendasikan  |
|:----------------------------|:----------------------------|:--------------------------------|
| 19 Februari 2026            | `claude-3-7-sonnet-20250219`| `claude-sonnet-4-5-20250929`     |

### 2025-08-13: Model Claude Sonnet 3.5

<Note>
Model ini pensiun pada 28 Oktober 2025.
</Note>

Pada 13 Agustus 2025, kami memberitahu pengembang yang menggunakan model Claude Sonnet 3.5 tentang pensiun yang akan datang.

| Tanggal Pensiun             | Model yang Dihentikan       | Pengganti yang Direkomendasikan  |
|:----------------------------|:----------------------------|:--------------------------------|
| 28 Oktober 2025             | `claude-3-5-sonnet-20240620`| `claude-sonnet-4-5-20250929`     |
| 28 Oktober 2025             | `claude-3-5-sonnet-20241022`| `claude-sonnet-4-5-20250929`     |

### 2025-06-30: Model Claude Opus 3

Pada 30 Juni 2025, kami memberitahu pengembang yang menggunakan model Claude Opus 3 tentang pensiun yang akan datang.

| Tanggal Pensiun             | Model yang Dihentikan       | Pengganti yang Direkomendasikan  |
|:----------------------------|:----------------------------|:--------------------------------|
| 5 Januari 2026              | `claude-3-opus-20240229`    | `claude-opus-4-1-20250805`      |

### 2025-01-21: Model Claude 2, Claude 2.1, dan Claude Sonnet 3

<Note>
Model ini pensiun pada 21 Juli 2025.
</Note>

Pada 21 Januari 2025, kami memberitahu pengembang yang menggunakan model Claude 2, Claude 2.1, dan Claude Sonnet 3 tentang pensiun yang akan datang.

| Tanggal Pensiun             | Model yang Dihentikan       | Pengganti yang Direkomendasikan  |
|:----------------------------|:----------------------------|:--------------------------------|
| 21 Juli 2025                | `claude-2.0`                | `claude-sonnet-4-5-20250929`      |
| 21 Juli 2025                | `claude-2.1`                | `claude-sonnet-4-5-20250929`      |
| 21 Juli 2025                | `claude-3-sonnet-20240229`  | `claude-sonnet-4-5-20250929`      |

### 2024-09-04: Model Claude 1 dan Instant

<Note>
Model ini pensiun pada 6 November 2024.
</Note>

Pada 4 September 2024, kami memberitahu pengembang yang menggunakan model Claude 1 dan Instant tentang pensiun yang akan datang.

| Tanggal Pensiun             | Model yang Dihentikan       | Pengganti yang Direkomendasikan |
|:----------------------------|:--------------------------|:---------------------------|
| 6 November 2024             | `claude-1.0`               | `claude-3-5-haiku-20241022`|
| 6 November 2024             | `claude-1.1`               | `claude-3-5-haiku-20241022`|
| 6 November 2024             | `claude-1.2`               | `claude-3-5-haiku-20241022`|
| 6 November 2024             | `claude-1.3`               | `claude-3-5-haiku-20241022`|
| 6 November 2024             | `claude-instant-1.0`       | `claude-3-5-haiku-20241022`|
| 6 November 2024             | `claude-instant-1.1`       | `claude-3-5-haiku-20241022`|
| 6 November 2024             | `claude-instant-1.2`       | `claude-3-5-haiku-20241022`|