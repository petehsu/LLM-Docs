# Tentukan kriteria keberhasilan Anda

---

Membangun aplikasi berbasis LLM yang sukses dimulai dengan mendefinisikan kriteria keberhasilan Anda dengan jelas. Bagaimana Anda akan tahu kapan aplikasi Anda cukup baik untuk dipublikasikan?

Memiliki kriteria keberhasilan yang jelas memastikan bahwa upaya rekayasa & optimasi prompt Anda terfokus pada pencapaian tujuan spesifik dan terukur.

***

## Membangun kriteria yang kuat

Kriteria keberhasilan yang baik adalah:
- **Spesifik**: Tentukan dengan jelas apa yang ingin Anda capai. Alih-alih "kinerja yang baik," tentukan "klasifikasi sentimen yang akurat."
- **Terukur**: Gunakan metrik kuantitatif atau skala kualitatif yang terdefinisi dengan baik. Angka memberikan kejelasan dan skalabilitas, tetapi ukuran kualitatif bisa berharga jika diterapkan secara konsisten *bersamaan* dengan ukuran kuantitatif.
    - Bahkan topik "kabur" seperti etika dan keamanan dapat dikuantifikasi:
        |      | Kriteria keamanan                |
        | ---- | --- |
        | Buruk  | Output yang aman                   |
        | Baik | Kurang dari 0,1% output dari 10.000 percobaan ditandai sebagai beracun oleh filter konten kami. | 
    <section title="Contoh metrik dan metode pengukuran">

        **Metrik kuantitatif**:
            - Khusus tugas: Skor F1, skor BLEU, perplexity
            - Umum: Akurasi, presisi, recall
            - Operasional: Waktu respons (ms), uptime (%)

        **Metode kuantitatif**:
            - Pengujian A/B: Bandingkan kinerja dengan model dasar atau versi sebelumnya.
            - Umpan balik pengguna: Ukuran implisit seperti tingkat penyelesaian tugas.
            - Analisis kasus ekstrem: Persentase kasus ekstrem yang ditangani tanpa kesalahan.

        **Skala kualitatif**:
            - Skala Likert: "Nilai koherensi dari 1 (tidak masuk akal) hingga 5 (sangat logis)"
            - Rubrik ahli: Ahli bahasa menilai kualitas terjemahan berdasarkan kriteria yang ditentukan        
    
</section>
- **Dapat dicapai**: Dasarkan target Anda pada tolok ukur industri, eksperimen sebelumnya, penelitian AI, atau pengetahuan ahli. Metrik keberhasilan Anda tidak boleh tidak realistis terhadap kemampuan model frontier saat ini.
- **Relevan**: Selaraskan kriteria Anda dengan tujuan aplikasi dan kebutuhan pengguna. Akurasi kutipan yang kuat mungkin penting untuk aplikasi medis tetapi tidak terlalu penting untuk chatbot kasual.

<section title="Contoh kriteria kesetiaan tugas untuk analisis sentimen">

    |      | Kriteria |
    | ---- | --- |
    | Buruk  | Model harus mengklasifikasikan sentimen dengan baik                    |
    | Baik | Model analisis sentimen kami harus mencapai skor F1 minimal 0,85 (Terukur, Spesifik) pada set pengujian terpisah* dari 10.000 postingan Twitter yang beragam (Relevan), yang merupakan peningkatan 5% dari baseline kami saat ini (Dapat dicapai). |

    **Lebih lanjut tentang set pengujian terpisah di bagian berikutnya*

</section>

***

## Kriteria keberhasilan umum yang perlu dipertimbangkan

Berikut adalah beberapa kriteria yang mungkin penting untuk kasus penggunaan Anda. Daftar ini tidak lengkap.

  <section title="Kesetiaan tugas">

    Seberapa baik model perlu tampil pada tugas? Anda mungkin juga perlu mempertimbangkan penanganan kasus ekstrem, seperti seberapa baik model perlu tampil pada input yang jarang atau menantang.
  
</section>
  <section title="Konsistensi">

    Seberapa mirip respons model perlu untuk jenis input yang serupa? Jika pengguna mengajukan pertanyaan yang sama dua kali, seberapa penting bagi mereka untuk mendapatkan jawaban yang secara semantik serupa?
  
</section>
  <section title="Relevansi dan koherensi">

    Seberapa baik model secara langsung menjawab pertanyaan atau instruksi pengguna? Seberapa penting informasi disajikan dengan cara yang logis dan mudah diikuti?
  
</section>
  <section title="Nada dan gaya">

    Seberapa baik gaya output model sesuai dengan harapan? Seberapa tepat bahasanya untuk audiens target?
  
</section>
  <section title="Pelestarian privasi">

    Apa metrik keberhasilan untuk bagaimana model menangani informasi pribadi atau sensitif? Bisakah model mengikuti instruksi untuk tidak menggunakan atau membagikan detail tertentu?
  
</section>
  <section title="Pemanfaatan konteks">

    Seberapa efektif model menggunakan konteks yang diberikan? Seberapa baik model mereferensikan dan membangun berdasarkan informasi yang diberikan dalam riwayatnya?
  
</section>
  <section title="Latensi">

    Berapa waktu respons yang dapat diterima untuk model? Ini akan bergantung pada persyaratan real-time aplikasi Anda dan harapan pengguna.
  
</section>
  <section title="Harga">

    Berapa anggaran Anda untuk menjalankan model? Pertimbangkan faktor-faktor seperti biaya per panggilan API, ukuran model, dan frekuensi penggunaan.
  
</section>

Sebagian besar kasus penggunaan akan memerlukan evaluasi multidimensi di beberapa kriteria keberhasilan.

<section title="Contoh kriteria multidimensi untuk analisis sentimen">

    |      | Kriteria |
    | ---- | --- |
    | Buruk  | Model harus mengklasifikasikan sentimen dengan baik                    |
    | Baik | Pada set pengujian terpisah dari 10.000 postingan Twitter yang beragam, model analisis sentimen kami harus mencapai:<br/>- skor F1 minimal 0,85<br/>- 99,5% output tidak beracun<br/>- 90% kesalahan hanya akan menyebabkan ketidaknyamanan, bukan kesalahan fatal*<br/>- 95% waktu respons < 200ms |

    **Dalam kenyataannya, kita juga akan mendefinisikan apa arti "ketidaknyamanan" dan "fatal".*

</section>

***

## Langkah selanjutnya

<CardGroup cols={2}>
  <Card title="Brainstorm kriteria" icon="link" href="https://claude.ai/">
    Brainstorm kriteria keberhasilan untuk kasus penggunaan Anda dengan Claude di claude.ai.<br/><br/>**Tip**: Masukkan halaman ini ke dalam obrolan sebagai panduan untuk Claude!
  </Card>
  <Card title="Desain evaluasi" icon="link" href="/docs/id/be-clear-direct">
    Pelajari cara membangun set pengujian yang kuat untuk mengukur kinerja Claude terhadap kriteria Anda.
  </Card>
</CardGroup>