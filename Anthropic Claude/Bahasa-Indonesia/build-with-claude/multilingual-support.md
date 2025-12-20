# Dukungan multibahasa

Claude unggul dalam tugas di berbagai bahasa, mempertahankan kinerja lintas bahasa yang kuat relatif terhadap bahasa Inggris.

---

## Ikhtisar

Claude menunjukkan kemampuan multibahasa yang kuat, dengan kinerja yang sangat baik dalam tugas zero-shot di berbagai bahasa. Model mempertahankan kinerja relatif yang konsisten di seluruh bahasa yang banyak digunakan dan bahasa dengan sumber daya terbatas, menjadikannya pilihan yang dapat diandalkan untuk aplikasi multibahasa.

Perhatikan bahwa Claude mampu dalam banyak bahasa di luar yang dijadikan tolok ukur di bawah ini. Kami mendorong pengujian dengan bahasa apa pun yang relevan dengan kasus penggunaan spesifik Anda.

## Data kinerja

Di bawah ini adalah skor evaluasi chain-of-thought zero-shot untuk Claude 4, Claude 3.7 Sonnet dan model Claude 3.5 di berbagai bahasa, ditampilkan sebagai persentase relatif terhadap kinerja bahasa Inggris (100%):

| Bahasa | Claude Opus 4<sup>1</sup> | Claude Sonnet 4<sup>1</sup> | Claude Sonnet 3.7 ([deprecated](/docs/id/about-claude/model-deprecations))<sup>1</sup> | Claude Haiku 3.5|
|---|---|---|---|---|
| Bahasa Inggris (baseline, tetap 100%) | 100% | 100% | 100% | 100% |
| Spanyol | 98.0% | 97.5% | 97.6% | 94.6% |
| Portugis (Brasil) | 97.3% | 97.2% | 97.3% | 94.6% |
| Italia | 97.5% | 97.3% | 97.2% | 95.0% |
| Prancis | 97.7% | 97.1% | 96.9% | 95.3% |
| Indonesia | 97.2% | 96.2% | 96.3% | 91.2% |
| Jerman | 97.1% | 94.7% | 96.2% | 92.5% |
| Arab | 96.9% | 96.1% | 95.4% | 84.7% |
| Cina (Sederhana) | 96.7% | 95.9% | 95.3% | 90.9% |
| Korea | 96.4% | 95.9% | 95.2% | 89.1% |
| Jepang | 96.2% | 95.6% | 95.0% | 90.8% |
| Hindi | 96.7% | 95.8% | 94.2% | 80.1% |
| Bengali | 95.2% | 94.4% | 92.4% | 72.9% |
| Swahili | 89.5% | 87.1% | 89.2% | 64.7% |
| Yoruba | 78.9% | 76.4% | 76.7% | 46.1% |

<sup>1</sup> Dengan [extended thinking](/docs/id/build-with-claude/extended-thinking).

<Note>
Metrik ini didasarkan pada set tes MMLU (Massive Multitask Language Understanding) bahasa Inggris yang diterjemahkan ke 14 bahasa tambahan oleh penerjemah manusia profesional, seperti yang didokumentasikan dalam [repositori simple-evals OpenAI](https://github.com/openai/simple-evals/blob/main/multilingual_mmlu_benchmark_results.md). Penggunaan penerjemah manusia untuk evaluasi ini memastikan terjemahan berkualitas tinggi, sangat penting untuk bahasa dengan sumber daya digital yang lebih sedikit.
</Note>

***

## Praktik terbaik

Saat bekerja dengan konten multibahasa:

1. **Berikan konteks bahasa yang jelas**: Meskipun Claude dapat mendeteksi bahasa target secara otomatis, menyatakan secara eksplisit bahasa input/output yang diinginkan meningkatkan keandalan. Untuk kelancaran yang ditingkatkan, Anda dapat meminta Claude menggunakan "ucapan idiomatis seolah-olah itu adalah penutur asli."
2. **Gunakan skrip asli**: Kirimkan teks dalam skrip aslinya daripada transliterasi untuk hasil optimal
3. **Pertimbangkan konteks budaya**: Komunikasi yang efektif sering kali memerlukan kesadaran budaya dan regional di luar sekadar terjemahan

Kami juga menyarankan untuk mengikuti [panduan rekayasa prompt](/docs/id/build-with-claude/prompt-engineering/overview) umum kami untuk lebih meningkatkan kinerja Claude.

***

## Pertimbangan dukungan bahasa

- Claude memproses input dan menghasilkan output dalam sebagian besar bahasa dunia yang menggunakan karakter Unicode standar
- Kinerja bervariasi menurut bahasa, dengan kemampuan yang sangat kuat dalam bahasa yang banyak digunakan
- Bahkan dalam bahasa dengan sumber daya digital yang lebih sedikit, Claude mempertahankan kemampuan yang bermakna

<CardGroup cols={2}>
  <Card title="Panduan Rekayasa Prompt" icon="edit" href="/docs/id/build-with-claude/prompt-engineering/overview">
    Kuasai seni pembuatan prompt untuk mendapatkan hasil maksimal dari Claude.
  </Card>
  <Card title="Perpustakaan Prompt" icon="books" href="/docs/id/resources/prompt-library">
    Temukan berbagai prompt yang telah dibuat sebelumnya untuk berbagai tugas dan industri. Sempurna untuk inspirasi atau awal yang cepat.
  </Card>
</CardGroup>