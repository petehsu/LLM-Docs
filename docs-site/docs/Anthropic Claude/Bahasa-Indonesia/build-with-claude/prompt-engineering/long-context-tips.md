# Tips prompting konteks panjang

Panduan untuk memanfaatkan jendela konteks panjang Claude secara efektif untuk menangani tugas-tugas kompleks dan kaya data.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Jendela konteks panjang Claude (200K token untuk model Claude 3) memungkinkan penanganan tugas-tugas kompleks dan kaya data. Panduan ini akan membantu Anda memanfaatkan kekuatan ini secara efektif.

## Tips penting untuk prompt konteks panjang

- **Letakkan data longform di bagian atas**: Tempatkan dokumen panjang dan input Anda (~20K+ token) di dekat bagian atas prompt Anda, di atas pertanyaan, instruksi, dan contoh Anda. Ini dapat meningkatkan performa Claude secara signifikan di semua model.

    <Note>Pertanyaan di akhir dapat meningkatkan kualitas respons hingga 30% dalam tes, terutama dengan input multi-dokumen yang kompleks.</Note>

- **Struktur konten dokumen dan metadata dengan tag XML**: Saat menggunakan beberapa dokumen, bungkus setiap dokumen dalam tag `<document>` dengan subtag `<document_content>` dan `<source>` (dan metadata lainnya) untuk kejelasan.

    <section title="Contoh struktur multi-dokumen">

    ```xml
    <documents>
      <document index="1">
        <source>annual_report_2023.pdf</source>
        <document_content>
          {{ANNUAL_REPORT}}
        </document_content>
      </document>
      <document index="2">
        <source>competitor_analysis_q2.xlsx</source>
        <document_content>
          {{COMPETITOR_ANALYSIS}}
        </document_content>
      </document>
    </documents>

    Analisis laporan tahunan dan analisis pesaing. Identifikasi keunggulan strategis dan rekomendasikan area fokus Q3.
    ```
    
</section>

- **Dasarkan respons dalam kutipan**: Untuk tugas dokumen panjang, minta Claude untuk mengutip bagian-bagian relevan dari dokumen terlebih dahulu sebelum menjalankan tugasnya. Ini membantu Claude menembus "kebisingan" dari sisa konten dokumen.

    <section title="Contoh ekstraksi kutipan">

    ```xml
    Anda adalah asisten dokter AI. Tugas Anda adalah membantu dokter mendiagnosis kemungkinan penyakit pasien.

    <documents>
      <document index="1">
        <source>patient_symptoms.txt</source>
        <document_content>
          {{PATIENT_SYMPTOMS}}
        </document_content>
      </document>
      <document index="2">
        <source>patient_records.txt</source>
        <document_content>
          {{PATIENT_RECORDS}}
        </document_content>
      </document>
      <document index="3">
        <source>patient01_appt_history.txt</source>
        <document_content>
          {{PATIENT01_APPOINTMENT_HISTORY}}
        </document_content>
      </document>
    </documents>

    Temukan kutipan dari catatan pasien dan riwayat janji temu yang relevan untuk mendiagnosis gejala yang dilaporkan pasien. Tempatkan ini dalam tag <quotes>. Kemudian, berdasarkan kutipan ini, daftarkan semua informasi yang akan membantu dokter mendiagnosis gejala pasien. Tempatkan informasi diagnostik Anda dalam tag <info>.
    ```
    
</section>

***

<CardGroup cols={3}>
  <Card title="Perpustakaan prompt" icon="link" href="/docs/id/resources/prompt-library/library">
    Dapatkan inspirasi dari pilihan prompt yang dikurasi untuk berbagai tugas dan kasus penggunaan.
  </Card>
  <Card title="Tutorial prompting GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Tutorial yang penuh dengan contoh yang mencakup konsep prompt engineering yang ditemukan di dokumen kami.
  </Card>
  <Card title="Tutorial prompting Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Versi yang lebih ringan dari tutorial prompt engineering kami melalui spreadsheet interaktif.
  </Card>
</CardGroup>