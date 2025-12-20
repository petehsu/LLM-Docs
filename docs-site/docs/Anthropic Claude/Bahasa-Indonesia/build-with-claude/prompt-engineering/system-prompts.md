# Memberikan Claude peran dengan system prompt

Pelajari cara menggunakan role prompting untuk meningkatkan kinerja Claude secara dramatis dengan memberikan peran spesifik melalui system parameter.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Saat menggunakan Claude, Anda dapat meningkatkan kinerjanya secara dramatis dengan menggunakan parameter `system` untuk memberikan peran kepadanya. Teknik ini, yang dikenal sebagai role prompting, adalah cara paling kuat untuk menggunakan system prompts dengan Claude.

Peran yang tepat dapat mengubah Claude dari asisten umum menjadi ahli domain virtual Anda!

<Tip>**Tips system prompt**: Gunakan parameter `system` untuk menetapkan peran Claude. Letakkan semuanya yang lain, seperti instruksi khusus tugas, di giliran `user` sebagai gantinya.</Tip>

## Mengapa menggunakan role prompting?

- **Akurasi yang ditingkatkan:** Dalam skenario kompleks seperti analisis hukum atau pemodelan keuangan, role prompting dapat secara signifikan meningkatkan kinerja Claude.
- **Nada yang disesuaikan:** Baik Anda membutuhkan singkatnya CFO atau gaya copywriter, role prompting menyesuaikan gaya komunikasi Claude.
- **Fokus yang ditingkatkan:** Dengan menetapkan konteks peran, Claude tetap lebih berada dalam batas persyaratan spesifik tugas Anda.

***

## Cara memberikan peran kepada Claude

Gunakan parameter `system` dalam [Messages API](/docs/id/api/messages) untuk menetapkan peran Claude:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=2048,
    system="You are a seasoned data scientist at a Fortune 500 company.", # <-- role prompt
    messages=[
        {"role": "user", "content": "Analyze this dataset for anomalies: <dataset>{{DATASET}}</dataset>"}
    ]
)

print(response.content)
```

<Tip>**Tips role prompting**: Bereksperimen dengan peran! Seorang `data scientist` mungkin melihat wawasan yang berbeda daripada `marketing strategist` untuk data yang sama. Seorang `data scientist specializing in customer insight analysis for Fortune 500 companies` mungkin menghasilkan hasil yang berbeda lagi!</Tip>

***

## Contoh

### Contoh 1: Analisis kontrak hukum
Tanpa peran, Claude mungkin melewatkan masalah kritis:

<section title="Analisis kontrak hukum tanpa role prompting">

| Peran | Konten |
| ---- | ------- |
| User | Analisis perjanjian lisensi perangkat lunak ini untuk potensi risiko:<br/>\<contract><br/>\{\{CONTRACT\}\}<br/>\</contract><br/><br/>Fokus pada indemnifikasi, tanggung jawab, dan kepemilikan IP. |
| Assistant | Berikut adalah ringkasan poin-poin kunci dalam perjanjian lisensi perangkat lunak:<br/><br/>1. Indemnifikasi (Bagian 8):<br/>   - Kami mengindemnifikasi vendor terhadap klaim yang timbul dari penggunaan kami.<br/><br/>2. Pembatasan Tanggung Jawab (Bagian 9):<br/>   - Ganti rugi dibatasi pada \$500.<br/><br/>3. Kepemilikan IP (Bagian 12):<br/>   - Kami mempertahankan kepemilikan modifikasi kami.<br/><br/>Secara keseluruhan, perjanjian ini tampak standar. Klausa indemnifikasi dan tanggung jawab adalah tipikal, dan kami mempertahankan hak IP kami. |

</section>

Dengan peran, Claude menangkap masalah kritis yang bisa menghabiskan jutaan:

<section title="Analisis kontrak hukum dengan role prompting">

| Peran | Konten |
| ---- | ------- |
| User | Anda adalah General Counsel dari perusahaan teknologi Fortune 500. Kami sedang mempertimbangkan perjanjian lisensi perangkat lunak ini untuk infrastruktur data inti kami:<br/>\<contract><br/>\{\{CONTRACT\}\}<br/>\</contract><br/><br/>Analisis untuk potensi risiko, fokus pada indemnifikasi, tanggung jawab, dan kepemilikan IP. Berikan pendapat profesional Anda. |
| Assistant | Saya telah meninjau perjanjian lisensi perangkat lunak, dan saya memiliki kekhawatiran serius yang dapat mengekspos perusahaan kami terhadap risiko signifikan:<br/><br/>1. Indemnifikasi (Bagian 8):<br/>   - Masalah Kritis: Kami mengindemnifikasi vendor terhadap "setiap dan semua klaim" yang timbul dari penggunaan kami.<br/>   - Risiko: Ini dapat membuat kami bertanggung jawab bahkan untuk kelalaian vendor atau cacat produk.<br/>   - Rekomendasi: Tolak. Batasi indemnitas kami pada klaim yang timbul dari pelanggaran kami terhadap perjanjian.<br/><br/>2. Pembatasan Tanggung Jawab (Bagian 9):<br/>   - Masalah Kritis: Ganti rugi dibatasi pada \$500, termasuk ganti rugi langsung.<br/>   - Risiko: Sangat tidak memadai. Kegagalan kritis dalam infrastruktur data kami dapat menghabiskan jutaan dalam kehilangan pendapatan dan kerusakan reputasi.<br/>   - Rekomendasi: Tolak. Negosiasikan untuk batas pada 12 bulan biaya untuk ganti rugi langsung, dan pengecualian untuk pelanggaran data.<br/><br/>3. Kepemilikan IP (Bagian 12):<br/>   - Masalah Kritis: Vendor mendapatkan kepemilikan bersama atas modifikasi dan integrasi kami.<br/>   - Risiko: Mereka dapat menggunakan atau menjual algoritma proprietary atau wawasan data kami kepada pesaing.<br/>   - Rekomendasi: Tolak. Kami harus mempertahankan kepemilikan penuh atas pekerjaan kami.<br/><br/>Pendapat Profesional: Jangan menandatangani perjanjian ini. Ini sangat tidak menguntungkan dan mengekspos kami terhadap tingkat risiko yang tidak dapat diterima. Jika vendor menolak untuk merundingkan kembali syarat-syarat ini, saya sangat menyarankan untuk mengeksplorasi penyedia alternatif atau mempercepat solusi in-house kami. Biaya potensial dari melanjutkan dengan perjanjian ini jauh melampaui keuntungan jangka pendek apa pun. |

</section>

### Contoh 2: Analisis keuangan
Tanpa peran, analisis Claude kurang mendalam:

<section title="Analisis keuangan tanpa role prompting">

| Peran | Konten |
| ---- | ------- |
| User | Analisis dataset keuangan Q2 kami:<br/>\<data><br/>\{\{FINANCIALS\}\}<br/>\</data><br/><br/>Sorot tren kunci dan rekomendasikan tindakan. |
| Assistant | Berikut adalah ringkasan keuangan Q2 Anda:<br/><br/>1. Pendapatan: \$15.2M, naik 22% YoY. Basis klien enterprise tumbuh 30%.<br/>2. Gross Margin: 72%, naik 3% dari Q1.<br/>3. EBITDA Margin: 18%, turun 2% karena investasi R&D.<br/>4. Cash Flow: \$4.1M operasional, \$28M dalam cadangan.<br/><br/>Secara keseluruhan, keuangan terlihat kuat dengan pertumbuhan pendapatan dan margin yang sehat. Peningkatan pengeluaran R&D berdampak pada profitabilitas tetapi dapat membuahkan hasil dalam jangka panjang. Pertahankan kursus saat ini. |

</section>

Dengan peran, Claude memberikan wawasan yang dapat ditindaklanjuti:

<section title="Analisis keuangan dengan role prompting">

| Peran | Konten |
| ---- | ------- |
| User | Anda adalah CFO dari perusahaan B2B SaaS yang berkembang pesat. Kami sedang dalam rapat dewan membahas keuangan Q2 kami:<br/>\<data><br/>\{\{FINANCIALS\}\}<br/>\</data><br/><br/>Analisis tren kunci, tandai kekhawatiran, dan rekomendasikan tindakan strategis. Investor kami menginginkan pertumbuhan agresif tetapi waspada terhadap burn rate kami. |
| Assistant | Anggota dewan, berikut adalah analisis saya tentang keuangan Q2 kami:<br/><br/>1. Pendapatan (\$15.2M, +22% YoY):<br/>   - Wawasan: Pertumbuhan enterprise (+30%) melampaui pertumbuhan keseluruhan.<br/>   - Bendera: Segmen SMB menurun 5%.<br/>   - Tindakan: Alokasikan kembali 20% anggaran pemasaran SMB ke penjualan enterprise. Tugaskan produk untuk menyederhanakan onboarding SMB.<br/><br/>2. Margin (Gross: 72%, +3% QoQ; EBITDA: 18%, -2% QoQ):<br/>   - Wawasan: Optimisasi infrastruktur meningkatkan margin kotor.<br/>   - Bendera: Pengeluaran R&D pada fitur AI mengurangi EBITDA.<br/>   - Tindakan: Tidak ada perubahan. Roadmap AI kami sangat penting untuk kesetiaan enterprise.<br/><br/>3. Kas (\$4.1M OCF, \$28M cadangan):<br/>   - Wawasan: Runway 15 bulan pada burn saat ini.<br/>   - Bendera: CAC naik 20%, mengikis LTV/CAC.<br/>   - Tindakan: Bekukan perekrutan non-esensial. Implementasikan analitik corong penjualan untuk mengurangi CAC sebesar 15% di Q3.<br/><br/>Posisi Strategis: Kami sedang menyeimbangkan antara pertumbuhan dan burn. Fokus enterprise adalah mesin pertumbuhan kami—investasikan di sana. Tetapi perhatikan churn SMB; itu bisa mengalir ke enterprise. Taruhan AI kami masuk akal, tetapi kami harus mengubahnya menjadi ARR pada Q4, atau kami potong R&D sebesar 30%.<br/><br/>Singkatnya: Perkuat enterprise, sederhanakan SMB, optimalkan penjualan, dan monetisasi AI. Pertanyaan? |

</section>

---

<CardGroup cols={3}>
  <Card title="Perpustakaan prompt" icon="link" href="/docs/id/resources/prompt-library/library">
    Dapatkan inspirasi dari pilihan prompt yang dikurasi untuk berbagai tugas dan kasus penggunaan.
  </Card>
  <Card title="Tutorial prompt GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Tutorial yang penuh dengan contoh yang mencakup konsep prompt engineering yang ditemukan dalam dokumentasi kami.
  </Card>
  <Card title="Tutorial prompt Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Versi yang lebih ringan dari tutorial prompt engineering kami melalui spreadsheet interaktif.
  </Card>
</CardGroup>