# Ikhtisar model

Claude adalah keluarga model bahasa besar canggih yang dikembangkan oleh Anthropic. Panduan ini memperkenalkan model kami dan membandingkan kinerja mereka.

---

## Memilih model

Jika Anda tidak yakin model mana yang akan digunakan, kami merekomendasikan untuk memulai dengan **Claude Sonnet 4.5**. Model ini menawarkan keseimbangan terbaik antara kecerdasan, kecepatan, dan biaya untuk sebagian besar kasus penggunaan, dengan kinerja luar biasa dalam tugas pengkodean dan agentic.

Semua model Claude saat ini mendukung input teks dan gambar, output teks, kemampuan multibahasa, dan visi. Model tersedia melalui Anthropic API, AWS Bedrock, dan Google Vertex AI.

Setelah Anda memilih model, [pelajari cara membuat panggilan API pertama Anda](/docs/id/get-started).

### Perbandingan model terbaru

| Fitur | Claude Sonnet 4.5 | Claude Haiku 4.5 | Claude Opus 4.5 |
|:--------|:------------------|:-----------------|:----------------|
| **Deskripsi** | Model cerdas kami untuk agen kompleks dan pengkodean | Model tercepat kami dengan kecerdasan mendekati frontier | Model premium yang menggabungkan kecerdasan maksimal dengan kinerja praktis |
| **Claude API ID** | claude-sonnet-4-5-20250929 | claude-haiku-4-5-20251001 | claude-opus-4-5-20251101 |
| **Claude API alias**<sup>1</sup> | claude-sonnet-4-5 | claude-haiku-4-5 | claude-opus-4-5 |
| **AWS Bedrock ID** | anthropic.claude-sonnet-4-5-20250929-v1:0 | anthropic.claude-haiku-4-5-20251001-v1:0 | anthropic.claude-opus-4-5-20251101-v1:0 |
| **GCP Vertex AI ID** | claude-sonnet-4-5@20250929 | claude-haiku-4-5@20251001 | claude-opus-4-5@20251101 |
| **Harga**<sup>2</sup> | \$3 / input MTok<br/>\$15 / output MTok | \$1 / input MTok<br/>\$5 / output MTok | \$5 / input MTok<br/>\$25 / output MTok |
| **[Extended thinking](/docs/id/build-with-claude/extended-thinking)** | Ya | Ya | Ya |
| **[Priority Tier](/docs/id/api/service-tiers)** | Ya | Ya | Ya |
| **Latensi komparatif** | Cepat | Tercepat | Sedang |
| **Jendela konteks** | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> / <br/> <Tooltip tooltipContent="~750K words \ ~3.4M unicode characters">1M tokens</Tooltip> (beta)<sup>3</sup> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> |
| **Output maksimal** | 64K tokens | 64K tokens | 64K tokens |
| **Cutoff pengetahuan yang dapat diandalkan** | Jan 2025<sup>4</sup> | Feb 2025 | May 2025<sup>4</sup> |
| **Cutoff data pelatihan** | Jul 2025 | Jul 2025 | Aug 2025 |

_<sup>1 - Alias secara otomatis menunjuk ke snapshot model terbaru. Ketika kami merilis snapshot model baru, kami memigrasikan alias untuk menunjuk ke versi model terbaru, biasanya dalam seminggu setelah rilis baru. Meskipun alias berguna untuk eksperimen, kami merekomendasikan menggunakan versi model spesifik (misalnya, `claude-sonnet-4-5-20250929`) dalam aplikasi produksi untuk memastikan perilaku yang konsisten.</sup>_

_<sup>2 - Lihat [halaman harga](/docs/id/about-claude/pricing) kami untuk informasi harga lengkap termasuk diskon batch API, tingkat prompt caching, biaya extended thinking, dan biaya pemrosesan visi.</sup>_

_<sup>3 - Claude Sonnet 4.5 mendukung [jendela konteks 1M token](/docs/id/build-with-claude/context-windows#1m-token-context-window) saat menggunakan header beta `context-1m-2025-08-07`. [Harga konteks panjang](/docs/id/about-claude/pricing#long-context-pricing) berlaku untuk permintaan yang melebihi 200K token.</sup>_

_<sup>4 - **Cutoff pengetahuan yang dapat diandalkan** menunjukkan tanggal hingga mana pengetahuan model paling luas dan dapat diandalkan. **Cutoff data pelatihan** adalah rentang tanggal yang lebih luas dari data pelatihan yang digunakan. Misalnya, Claude Sonnet 4.5 dilatih pada informasi yang tersedia untuk publik hingga Juli 2025, tetapi pengetahuannya paling luas dan dapat diandalkan hingga Januari 2025. Untuk informasi lebih lanjut, lihat [Transparency Hub Anthropic](https://www.anthropic.com/transparency).</sup>_

<Note>Model dengan tanggal snapshot yang sama (misalnya, 20240620) identik di semua platform dan tidak berubah. Tanggal snapshot dalam nama model memastikan konsistensi dan memungkinkan pengembang untuk mengandalkan kinerja stabil di berbagai lingkungan.</Note>

<Note>Mulai dengan **Claude Sonnet 4.5 dan semua model masa depan**, AWS Bedrock dan Google Vertex AI menawarkan dua jenis endpoint: **global endpoints** (perutean dinamis untuk ketersediaan maksimal) dan **regional endpoints** (perutean data terjamin melalui wilayah geografis tertentu). Untuk informasi lebih lanjut, lihat [bagian harga platform pihak ketiga](/docs/id/about-claude/pricing#third-party-platform-pricing).</Note>

<section title="Model legacy">

Model berikut masih tersedia tetapi kami merekomendasikan migrasi ke model saat ini untuk kinerja yang ditingkatkan:

| Fitur | Claude Opus 4.1 | Claude Sonnet 4 | Claude Sonnet 3.7 | Claude Opus 4 | Claude Haiku 3.5 | Claude Haiku 3 |
|:--------|:----------------|:----------------|:------------------|:--------------|:-----------------|:---------------|
| **Claude API ID** | claude-opus-4-1-20250805 | claude-sonnet-4-20250514 | claude-3-7-sonnet-20250219 | claude-opus-4-20250514 | claude-3-5-haiku-20241022 | claude-3-haiku-20240307 |
| **Claude API alias** | claude-opus-4-1 | claude-sonnet-4-0 | claude-3-7-sonnet-latest | claude-opus-4-0 | claude-3-5-haiku-latest | — |
| **AWS Bedrock ID** | anthropic.claude-opus-4-1-20250805-v1:0 | anthropic.claude-sonnet-4-20250514-v1:0 | anthropic.claude-3-7-sonnet-20250219-v1:0 | anthropic.claude-opus-4-20250514-v1:0 | anthropic.claude-3-5-haiku-20241022-v1:0 | anthropic.claude-3-haiku-20240307-v1:0 |
| **GCP Vertex AI ID** | claude-opus-4-1@20250805 | claude-sonnet-4@20250514 | claude-3-7-sonnet@20250219 | claude-opus-4@20250514 | claude-3-5-haiku@20241022 | claude-3-haiku@20240307 |
| **Harga** | \$15 / input MTok<br/>\$75 / output MTok | \$3 / input MTok<br/>\$15 / output MTok | \$3 / input MTok<br/>\$15 / output MTok | \$15 / input MTok<br/>\$75 / output MTok | \$0.80 / input MTok<br/>\$4 / output MTok | \$0.25 / input MTok<br/>\$1.25 / output MTok |
| **[Extended thinking](/docs/id/build-with-claude/extended-thinking)** | Ya | Ya | Ya | Ya | Tidak | Tidak |
| **[Priority Tier](/docs/id/api/service-tiers)** | Ya | Ya | Ya | Ya | Ya | Tidak |
| **Latensi komparatif** | Sedang | Cepat | Cepat | Sedang | Tercepat | Cepat |
| **Jendela konteks** | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> / <br/> <Tooltip tooltipContent="~750K words \ ~3.4M unicode characters">1M tokens</Tooltip> (beta)<sup>1</sup> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~215K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> |
| **Output maksimal** | 32K tokens | 64K tokens | 64K tokens / 128K tokens (beta)<sup>4</sup> | 32K tokens | 8K tokens | 4K tokens |
| **Cutoff pengetahuan yang dapat diandalkan** | Jan 2025<sup>2</sup> | Jan 2025<sup>2</sup> | Oct 2024<sup>2</sup> | Jan 2025<sup>2</sup> | <sup>3</sup> | <sup>3</sup> |
| **Cutoff data pelatihan** | Mar 2025 | Mar 2025 | Nov 2024 | Mar 2025 | Jul 2024 | Aug 2023 |

_<sup>1 - Claude Sonnet 4 mendukung [jendela konteks 1M token](/docs/id/build-with-claude/context-windows#1m-token-context-window) saat menggunakan header beta `context-1m-2025-08-07`. [Harga konteks panjang](/docs/id/about-claude/pricing#long-context-pricing) berlaku untuk permintaan yang melebihi 200K token.</sup>_

_<sup>2 - **Cutoff pengetahuan yang dapat diandalkan** menunjukkan tanggal hingga mana pengetahuan model paling luas dan dapat diandalkan. **Cutoff data pelatihan** adalah rentang tanggal yang lebih luas dari data pelatihan yang digunakan.</sup>_

_<sup>3 - Beberapa model Haiku memiliki tanggal cutoff data pelatihan tunggal.</sup>_

_<sup>4 - Sertakan header beta `output-128k-2025-02-19` dalam permintaan API Anda untuk meningkatkan panjang token output maksimal menjadi 128K token untuk Claude Sonnet 3.7. Kami sangat menyarankan menggunakan [streaming Messages API](/docs/id/build-with-claude/streaming) kami untuk menghindari timeout saat menghasilkan output yang lebih panjang. Lihat panduan kami tentang [permintaan panjang](/docs/id/api/errors#long-requests) untuk detail lebih lanjut.</sup>_

</section>

## Kinerja prompt dan output

Model Claude 4 unggul dalam:
- **Kinerja**: Hasil tingkat atas dalam penalaran, pengkodean, tugas multibahasa, penanganan konteks panjang, kejujuran, dan pemrosesan gambar. Lihat [posting blog Claude 4](http://www.anthropic.com/news/claude-4) untuk informasi lebih lanjut.
- **Respons yang menarik**: Model Claude ideal untuk aplikasi yang memerlukan interaksi yang kaya dan mirip manusia.

    - Jika Anda lebih suka respons yang lebih ringkas, Anda dapat menyesuaikan prompt Anda untuk memandu model menuju panjang output yang diinginkan. Lihat [panduan rekayasa prompt](/docs/id/build-with-claude/prompt-engineering) kami untuk detail.
    - Untuk praktik terbaik prompt Claude 4 spesifik, lihat [panduan praktik terbaik Claude 4](/docs/id/build-with-claude/prompt-engineering/claude-4-best-practices) kami.
- **Kualitas output**: Saat bermigrasi dari generasi model sebelumnya ke Claude 4, Anda mungkin melihat peningkatan yang lebih besar dalam kinerja keseluruhan.

## Bermigrasi ke Claude 4.5

Jika Anda saat ini menggunakan model Claude 3, kami merekomendasikan migrasi ke Claude 4.5 untuk memanfaatkan kecerdasan yang ditingkatkan dan kemampuan yang ditingkatkan. Untuk instruksi migrasi terperinci, lihat [Bermigrasi ke Claude 4.5](/docs/id/about-claude/models/migrating-to-claude-4).

## Mulai dengan Claude

Jika Anda siap untuk mulai menjelajahi apa yang dapat dilakukan Claude untuk Anda, mari kita selami! Baik Anda seorang pengembang yang ingin mengintegrasikan Claude ke dalam aplikasi Anda atau pengguna yang ingin mengalami kekuatan AI secara langsung, kami siap membantu Anda.

<Note>Ingin mengobrol dengan Claude? Kunjungi [claude.ai](http://www.claude.ai)!</Note>

<CardGroup cols={3}>
  <Card title="Intro to Claude" icon="check" href="/docs/id/intro">
    Jelajahi kemampuan Claude dan alur pengembangan.
  </Card>
  <Card title="Quickstart" icon="lightning" href="/docs/id/get-started">
    Pelajari cara membuat panggilan API pertama Anda dalam hitungan menit.
  </Card>
  <Card title="Claude Console" icon="code" href="/">
    Buat dan uji prompt yang kuat langsung di browser Anda.
  </Card>
</CardGroup>

Jika Anda memiliki pertanyaan atau memerlukan bantuan, jangan ragu untuk menghubungi [tim dukungan](https://support.claude.com/) kami atau berkonsultasi dengan [komunitas Discord](https://www.anthropic.com/discord).