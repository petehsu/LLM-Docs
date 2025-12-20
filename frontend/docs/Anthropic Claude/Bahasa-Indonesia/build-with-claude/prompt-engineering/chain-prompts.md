# Rantai prompt kompleks untuk performa yang lebih kuat

Pelajari cara memecah tugas kompleks menjadi subtask yang dapat dikelola untuk hasil yang lebih akurat dan dapat dilacak.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Saat bekerja dengan tugas-tugas kompleks, Claude terkadang dapat mengabaikan sesuatu jika Anda mencoba menangani semuanya dalam satu prompt. Chain of thought (CoT) prompting sangat bagus, tetapi bagaimana jika tugas Anda memiliki beberapa langkah yang berbeda yang masing-masing memerlukan pemikiran mendalam?

Masuki prompt chaining: memecah tugas-tugas kompleks menjadi subtask yang lebih kecil dan dapat dikelola.

## Mengapa rantai prompt?

1. **Akurasi**: Setiap subtask mendapatkan perhatian penuh Claude, mengurangi kesalahan.
2. **Kejelasan**: Subtask yang lebih sederhana berarti instruksi dan output yang lebih jelas.
3. **Ketertelusuran**: Mudah menunjuk dan memperbaiki masalah dalam rantai prompt Anda.

***

## Kapan rantai prompt

Gunakan prompt chaining untuk tugas multi-langkah seperti sintesis penelitian, analisis dokumen, atau pembuatan konten iteratif. Ketika tugas melibatkan beberapa transformasi, kutipan, atau instruksi, chaining mencegah Claude dari menghilangkan atau salah menangani langkah-langkah. 

**Ingat:** Setiap tautan dalam rantai mendapatkan perhatian penuh Claude!

<Tip>**Tips debugging**: Jika Claude melewatkan langkah atau berkinerja buruk, isolasikan langkah itu dalam prompt tersendiri. Ini memungkinkan Anda untuk menyempurnakan langkah-langkah yang bermasalah tanpa mengulang seluruh tugas.</Tip>

***

## Cara rantai prompt

1. **Identifikasi subtask**: Pecahkan tugas Anda menjadi langkah-langkah yang berbeda dan berurutan.
2. **Struktur dengan XML untuk handoff yang jelas**: Gunakan tag XML untuk meneruskan output antar prompt.
3. **Miliki tujuan single-task**: Setiap subtask harus memiliki satu tujuan yang jelas.
4. **Iterasi**: Perbaiki subtask berdasarkan performa Claude.

### Contoh alur kerja yang dirantai:
- **Analisis multi-langkah**: Lihat contoh hukum dan bisnis di bawah.
- **Pipeline pembuatan konten**: Penelitian → Outline → Draft → Edit → Format.
- **Pemrosesan data**: Extract → Transform → Analyze → Visualize.
- **Pengambilan keputusan**: Gather info → List options → Analyze each → Recommend.
- **Loop verifikasi**: Generate content → Review → Refine → Re-review.

<Tip>**Tips optimasi**: Untuk tugas dengan subtask independen (seperti menganalisis beberapa dokumen), buat prompt terpisah dan jalankan secara paralel untuk kecepatan.</Tip>

### Lanjutan: Rantai self-correction

Anda dapat rantai prompt untuk membuat Claude meninjau pekerjaan mereka sendiri! Ini menangkap kesalahan dan menyempurnakan output, terutama untuk tugas-tugas berisiko tinggi.

  <section title="Contoh: Ringkasan penelitian yang self-correcting">

    #### Prompt 1
    | Role | Content |
    | ---- | ------- |
    | User | Ringkaslah makalah penelitian medis ini.<br/><br/>\\{\{RESEARCH_PAPER}}\</paper><br/><br/>Fokus pada metodologi, temuan, dan implikasi klinis. |
    | Assistant<br/>\{\{SUMMARY}} | Metodologi: RCT double-blind dengan 500 pasien diabetes tipe 2. Kelompok A (n=250) menerima agonis dual GLP-1/GIP baru; Kelompok B (n=250) menerima agonis GLP-1 standar. Uji coba 24 minggu, endpoint utama: pengurangan HbA1c.<br/><br/>Temuan:<br/>- Kelompok A: pengurangan HbA1c rata-rata 1,8%<br/>- Kelompok B: pengurangan HbA1c rata-rata 1,1%<br/>- 68% dari Kelompok A vs. 52% dari Kelompok B mencapai HbA1c \<7%<br/>- Kelompok A: kehilangan berat badan rata-rata 5,2kg<br/>- Kelompok B: kehilangan berat badan rata-rata 3,1kg<br/><br/>Keamanan: Profil peristiwa merugikan serupa, tidak ada peristiwa serius yang dikaitkan dengan pengobatan.<br/><br/>Implikasi Klinis: Agonis dual menunjukkan kontrol glikemik yang superior dan penurunan berat badan dibandingkan dengan terapi standar. Bisa menjadi game-changer, terutama untuk diabetik obesitas. |
    
    #### Prompt 2
    | Role | Content |
    | ---- | ------- |
    | User | Tugas Anda adalah memberikan umpan balik pada ringkasan makalah penelitian. Berikut adalah ringkasan makalah penelitian medis:<br/>\<summary><br/>\{\{SUMMARY\}\}<br/>\</summary><br/><br/>Berikut adalah makalah penelitian:<br/>\<br/>\{\{RESEARCH_PAPER\}\}<br/>\</paper><br/><br/>Tinjau ringkasan ini untuk akurasi, kejelasan, dan kelengkapan pada skala A-F. |
    | Assistant<br/>\{\{FEEDBACK}} | 1. Akurasi: A<br/>   - Melaporkan dengan benar statistik kunci: pengurangan HbA1c, penurunan berat badan.<br/>   - Dengan akurat mencatat profil keamanan dan tidak ada peristiwa merugikan serius.<br/>   - Pernyataan "game-changer" dibenarkan oleh hasil yang jauh lebih baik.<br/><br/>2. Kejelasan: A-<br/>   - Ringkas dan terstruktur dengan baik dengan bagian yang jelas.<br/>   - Penggunaan bahasa perbandingan yang baik (misalnya, "naik 3% dari Q1") untuk konteks.<br/>   - Masalah kecil: Akronim seperti "RCT," "GLP-1," dan "GIP" tidak didefinisikan. Pertimbangkan untuk mengeja penggunaan pertama.<br/><br/>3. Kelengkapan: B+<br/>   - Mencakup semua area yang diminta: metodologi, temuan, implikasi klinis.<br/>   - Hilang: Karakteristik baseline kelompok (apakah mereka cocok dengan baik?).<br/>   - Hilang: Endpoint sekunder apa pun (misalnya, tekanan darah, lipid).<br/>   - Pertimbangkan: Implikasi jangka panjang atau kebutuhan penelitian lebih lanjut.<br/><br/>Secara keseluruhan, ringkasan akurat dan jelas, memberikan wawasan kunci untuk pemahaman cepat tentang studi. Untuk meningkatkan ke A+, tentukan akronim, sebutkan statistik baseline kelompok, catat hasil sekunder apa pun, dan secara singkat sentuh kebutuhan untuk studi jangka panjang. |
    
     #### Prompt 3
    | Role | Content |
    | ---- | ------- |
    | User | Tugas Anda adalah meningkatkan ringkasan makalah berdasarkan umpan balik. Berikut adalah draft pertama makalah penelitian medis:<br/>\<summary><br/>\{\{SUMMARY\}\}<br/>\</summary><br/><br/>Berikut adalah makalah penelitian:<br/>\<br/>\{\{RESEARCH_PAPER\}\}<br/>\</paper><br/><br/>Berikut adalah umpan balik:<br/>\<feedback><br/>\{\{FEEDBACK\}\}<br/>\</feedback><br/><br/>Perbarui ringkasan berdasarkan umpan balik. |
    | Assistant | Metodologi: Uji coba terkontrol acak double-blind (RCT) dengan 500 pasien diabetes tipe 2. Kelompok A (n=250) menerima agonis dual glucagon-like peptide-1/glucose-dependent insulinotropic polypeptide (GLP-1/GIP) baru; Kelompok B (n=250) menerima agonis GLP-1 standar. Endpoint utama uji coba 24 minggu adalah pengurangan HbA1c. Kelompok cocok untuk usia, BMI, dan HbA1c baseline.<br/><br/>Temuan:<br/>- Kelompok A: pengurangan HbA1c rata-rata 1,8%<br/>- Kelompok B: pengurangan HbA1c rata-rata 1,1%<br/>- 68% dari Kelompok A vs. 52% dari Kelompok B mencapai HbA1c \<7%<br/>- Kelompok A: kehilangan berat badan rata-rata 5,2kg<br/>- Kelompok B: kehilangan berat badan rata-rata 3,1kg<br/><br/>Endpoint sekunder menunjukkan peningkatan tekanan darah dan profil lipid untuk kedua kelompok, dengan Kelompok A menunjukkan hasil yang sedikit lebih baik.<br/><br/>Keamanan: Profil peristiwa merugikan serupa, tanpa peristiwa serius yang dikaitkan dengan salah satu pengobatan.<br/><br/>Implikasi Klinis: Agonis GLP-1/GIP dual menunjukkan kontrol glikemik yang superior dan penurunan berat badan dibandingkan dengan terapi GLP-1 standar. Hasil ini menunjukkan bahwa ini bisa menjadi kemajuan yang signifikan, terutama untuk diabetik obesitas. Namun, studi jangka panjang diperlukan untuk mengkonfirmasi efikasi dan keamanan yang berkelanjutan, serta untuk menyelidiki manfaat potensial pada hasil kardiovaskular. |
  
</section>

***

## Contoh

  <section title="Contoh: Menganalisis kontrak hukum (tanpa chaining)">

    Perhatikan bahwa Claude melewatkan instruksi untuk memberikan perubahan yang diusulkan dalam draft emailnya.

    | Role | Content |
    | ---- | ------- |
    | User | Anda adalah Chief Legal Officer kami. Tinjau kontrak SaaS ini untuk risiko, fokus pada privasi data, SLA, dan batas tanggung jawab.<br/><br/>\<contract><br/>\{\{CONTRACT}}<br/>\</contract><br/><br/>Kemudian buat draft email ke vendor dengan kekhawatiran Anda dan perubahan yang diusulkan. |
    | Assistant | Setelah meninjau kontrak SaaS, saya telah mengidentifikasi beberapa kekhawatiran:<br/><br/>1. Privasi Data (Bagian 7):<br/>   - Masalah: Vendor memiliki hak luas untuk menggunakan data klien untuk "peningkatan layanan."<br/>   - Risiko: Dapat menyebabkan berbagi data yang tidak sah atau monetisasi.<br/><br/>2. SLA (Bagian 5):<br/>   - Masalah: Jaminan uptime 99,5% di bawah standar industri.<br/>   - Risiko: Downtime berlebihan dapat mempengaruhi operasi kami.<br/><br/>3. Tanggung Jawab (Bagian 9):<br/>   - Masalah: Batas ditetapkan pada 3 bulan biaya.<br/>   - Risiko: Tidak memadai untuk potensi pelanggaran data atau kegagalan layanan.<br/><br/>Draft email:<br/><br/>Sayang \{\{VENDOR}},<br/><br/>Setelah meninjau perjanjian SaaS, kami memiliki kekhawatiran:<br/><br/>1. Privasi Data: Kami memerlukan bahwa data kami hanya digunakan untuk penyediaan layanan langsung, bukan "peningkatan layanan" yang luas. Silakan ubah Bagian 7.<br/><br/>2. SLA: Uptime 99,5% tidak cukup. Kami membutuhkan 99,99% dengan penalti yang jelas didefinisikan. Silakan revisi Bagian 5.<br/><br/>3. Tanggung Jawab: Batas saat ini sebesar 3 bulan biaya tidak memadai. Kami mengusulkan batas 12 bulan biaya, tanpa batas untuk pelanggaran data atau pelanggaran kesengajaan.<br/><br/>Kami menghargai kemitraan potensial kami dan percaya perubahan ini akan membuat kami siap untuk sukses. Silakan kirimkan perjanjian yang direvisi.<br/><br/>Salam hormat,<br/>\{\{CLO_NAME}} |
  
</section>

  <section title="Contoh: Menganalisis kontrak hukum (dengan chaining)">

    #### Prompt 1    
    | Role | Content |
    | ---- | ------- |
    | User | Anda adalah Chief Legal Officer kami. Tinjau kontrak SaaS ini untuk risiko, fokus pada privasi data, SLA, dan batas tanggung jawab.<br/><br/>\<contract><br/>\{\{CONTRACT}}<br/>\</contract><br/><br/>Keluarkan temuan Anda dalam tag \<risks>. |
    | Assistant<br/>\{\{CONCERNS}} | 1. Privasi Data (Bagian 7):<br/>   - Masalah: Vendor memiliki hak luas untuk menggunakan data klien untuk "peningkatan layanan."<br/>   - Risiko: Dapat menyebabkan berbagi data yang tidak sah atau monetisasi data klien.<br/>   - Dampak: Potensi pelanggaran kepercayaan klien, denda regulasi (GDPR, CCPA).<br/><br/>2. SLA (Bagian 5):<br/>   - Masalah: Jaminan uptime 99,5% di bawah standar industri (biasanya 99,99%).<br/>   - Risiko: Hingga 43,8 jam downtime per tahun vs. 52,6 menit pada 99,99%.<br/>   - Dampak: Gangguan operasional, kehilangan pendapatan, ketidakpuasan klien.<br/><br/>3. Tanggung Jawab (Bagian 9):<br/>   - Masalah: Batas tanggung jawab ditetapkan pada 3 bulan biaya.<br/>   - Risiko: Tidak memadai untuk potensi pelanggaran data, pencurian IP, atau kegagalan layanan yang berkepanjangan.<br/>   - Dampak: Kompensasi yang tidak cukup untuk kerusakan yang dapat jauh melebihi batas, seperti tuntutan class-action atau denda regulasi. |
    
    #### Prompt 2    
    | Role | Content |
    | ---- | ------- |
    | User | Buat draft email ke vendor produk SaaS yang menguraikan kekhawatiran berikut dan mengusulkan perubahan. Berikut adalah kekhawatiran:<br/>\<concerns><br/>\{\{CONCERNS\}\}<br/>\</concerns><br/><br/>|
    | Assistant<br/>\{\{EMAIL}} | Sayang \{\{VENDOR}},<br/><br/>Setelah tinjauan menyeluruh terhadap perjanjian SaaS yang diusulkan, tim hukum kami telah mengidentifikasi beberapa kekhawatiran prioritas tinggi yang harus ditangani sebelum kami dapat melanjutkan:<br/><br/>1. Privasi Data (Bagian 7):<br/>   - Saat ini: Hak luas untuk menggunakan data klien untuk "peningkatan layanan."<br/>   - Kekhawatiran: Potensi berbagi data yang tidak sah atau monetisasi.<br/>   - Perubahan yang Diusulkan: Batasi penggunaan data untuk penyediaan layanan langsung. Penggunaan apa pun untuk peningkatan, analitik, atau pemasaran harus opt-in, dapat dicabut, dan dianonimkan.<br/><br/>2. SLA (Bagian 5):<br/>   - Saat ini: Jaminan uptime 99,5%.<br/>   - Kekhawatiran: Hingga 43,8 jam downtime per tahun, berisiko gangguan operasional.<br/>   - Perubahan yang Diusulkan: Uptime 99,99% dengan kredit layanan berjenjang. Misalnya, kredit 10% untuk \<99,99%, 25% untuk \<99,9%, 50% untuk \<99,5%.<br/><br/>3. Tanggung Jawab (Bagian 9):<br/>   - Saat ini: Batas pada 3 bulan biaya.<br/>   - Kekhawatiran: Sangat tidak memadai untuk pelanggaran data, pencurian IP, atau pemadaman yang berkepanjangan.<br/>   - Perubahan yang Diusulkan: 12 bulan biaya untuk tanggung jawab umum. Tidak terbatas untuk pelanggaran data, pelanggaran kesengajaan, pelanggaran IP.<br/><br/>Perubahan ini tidak dapat dinegosiasikan bagi kami. Mereka selaras dengan standar industri dan komitmen kami terhadap keamanan data, keunggulan operasional, dan tanggung jawab fidusia. Kami menghargai potensi kemitraan kami, dan mengatasi ini akan menetapkan fondasi yang kuat.<br/><br/>Silakan tim hukum Anda meninjau dan menggabungkan perubahan ini. Kami senang berdiskusi lebih lanjut untuk memastikan pemahaman dan perjanjian bersama.<br/><br/>Salam hormat,<br/>\{\{CLO_NAME}} |
    
    #### Prompt 3    
    | Role | Content |
    | ---- | ------- |
    | User | Tugas Anda adalah meninjau email dan memberikan umpan balik. Berikut adalah email:<br/>\<email><br/>\{\{EMAIL\}\}<br/>\</email><br/><br/>Berikan umpan balik tentang nada, kejelasan, dan profesionalisme. |
    | Assistant | 1. Nada:<br/>   - Profesional dan tegas tanpa bersifat konfrontatif.<br/>   - Penggunaan "tidak dapat dinegosiasikan" kuat tetapi dibenarkan mengingat kritikalitas masalah.<br/>   - Bahasa kolaboratif ("kami menghargai," "senang berdiskusi") menyeimbangkan ketegasan, mempertahankan nada konstruktif.<br/><br/>2. Kejelasan:<br/>   - Struktur yang sangat baik: Keadaan saat ini, kekhawatiran, dan perubahan yang diusulkan untuk setiap masalah.<br/>   - Istilah teknis (misalnya, "EBITDA," "kredit layanan berjenjang") sesuai untuk konteks B2B SaaS.<br/>   - Item tindakan jelas: tim hukum vendor untuk meninjau dan menggabungkan perubahan.<br/><br/>3. Profesionalisme:<br/>   - Fokus pada manfaat bersama dan standar industri, bukan hanya permintaan kami.<br/>   - Menyebutkan tanggung jawab yang lebih luas (keamanan data, keunggulan operasional, tugas fidusia), meningkatkan diskusi.<br/>   - Menawarkan diskusi lebih lanjut, menunjukkan komitmen untuk memahami dan menyelesaikan masalah.<br/><br/>Secara keseluruhan, email mencapai keseimbangan yang tepat antara ketegasan dan kolaborasi. Ini dengan jelas menguraikan kekhawatiran kami, mengusulkan solusi spesifik, dan mempertahankan nada profesional yang berorientasi pada kemitraan. Tidak ada revisi yang diperlukan; lanjutkan dengan mengirim. |
  
</section>
  <section title="Contoh: Tinjauan strategi multitenancy">

    #### Prompt 1    
    | Role | Content |
    | ---- | ------- |
    | User | Sebagai arsitek solusi senior, tinjau dan analisis strategi multitenancy ini untuk produk SaaS enterprise baru kami.<br/><br/>\<strategy><br/>\{\{STRATEGY}}<br/>\</strategy><br/><br/>Fokus pada skalabilitas, keamanan, dan efektivitas biaya. |
    | Assistant<br/>\{\{ANALYSIS}} | 1. Skalabilitas:<br/>   + Sharding database berdasarkan tenant mengurangi kontention, mendukung pertumbuhan tinggi.<br/>   + Microservices memungkinkan penskalaan independen komponen.<br/>   - Server aplikasi bersama dapat menjadi bottleneck di bawah beban ekstrem.<br/>   - Tidak ada penyebutan auto-scaling atau load balancing untuk tier aplikasi.<br/><br/>2. Keamanan:<br/>   + Isolasi data tenant melalui sharding mengurangi kebocoran data.<br/>   + JWT dengan expiry pendek dan refresh token adalah praktik terbaik industri.<br/>   - Tidak ada penyebutan enkripsi (at rest, in transit) atau manajemen kunci.<br/>   - Strategi IAM kurang detail tentang peran, izin, atau RBAC.<br/><br/>3. Efektivitas Biaya:<br/>   + Server aplikasi bersama mengurangi biaya sumber daya idle.<br/>   + Fungsi serverless untuk tugas yang jarang terjadi mengoptimalkan biaya.<br/>   - Database per-tenant dapat meningkatkan biaya pada skala vs. database multi-tenant yang dioptimalkan.<br/>   - Tidak ada diskusi tentang reserved instances atau spot instances untuk penghematan biaya. |
    
    #### Prompt 2    
    | Role | Content |
    | ---- | ------- |
    | User | Buat dokumen tinjauan strategi untuk kepemimpinan teknik berdasarkan analisis strategi multitenancy ini.<br/><br/>\<strategy><br/>\{\{STRATEGY}}<br/>\</strategy><br/><br/>\<analysis><br/>\{\{ANALYSIS}}<br/>\</analysis><br/><br/>Sertakan ringkasan eksekutif, analisis terperinci, dan rekomendasi. |
    | Assistant<br/>\{\{STRATEGY_DOC}} | # Tinjauan Strategi Multitenancy: Produk SaaS Enterprise<br/><br/>## Ringkasan Eksekutif<br/>Strategi yang diusulkan menunjukkan fondasi yang solid dalam prinsip skalabilitas dan keamanan tetapi memiliki kesenjangan dalam detail implementasi. Ini unggul dalam isolasi data dan penskalaan tingkat komponen tetapi kekurangan penskalaan tier aplikasi yang kuat dan langkah-langkah keamanan lanjutan. Optimasi biaya ada tetapi mungkin gagal pada skala tinggi. Dengan peningkatan yang ditargetkan, strategi ini dapat secara efektif mendukung ambisi SaaS enterprise kami.<br/><br/>## Analisis Terperinci<br/><br/>### 1. Skalabilitas: B+<br/><br/>Kekuatan:<br/>- Sharding database berdasarkan tenant sangat baik. Ini meminimalkan latensi kueri, mendukung pertumbuhan data tinggi, dan memfasilitasi penskalaan per-tenant yang mulus.<br/>- Arsitektur microservices memungkinkan penskalaan komponen individual berdasarkan permintaan, penting untuk menangani beban kerja enterprise yang beragam.<br/><br/>Kelemahan:<br/>- Server aplikasi bersama berisiko menjadi bottleneck. Seiring dengan pertumbuhan jumlah tenant dan lalu lintas, ini dapat menurunkan performa di semua tenant.<br/>- Ketiadaan auto-scaling dan load balancing untuk tier aplikasi adalah pengawasan kritis. Ini penting untuk menangani lonjakan lalu lintas tanpa over-provisioning.<br/><br/>### 2. Keamanan: B-<br/><br/>Kekuatan:<br/>- Database yang di-shard menyediakan isolasi data tenant yang kuat, mengurangi risiko kebocoran data atau akses tidak sah antar tenant.<br/>- JWT dengan expiry pendek dan refresh token selaras dengan praktik terbaik OWASP, mengurangi jendela kerentanan token.<br/><br/>Kelemahan:<br/>- Tidak ada penyebutan enkripsi data at rest atau in transit (TLS 1.3). Ini tidak dapat dinegosiasikan untuk data enterprise.<br/>- Strategi manajemen kunci hilang. Bagaimana kunci enkripsi, rahasia JWT, dan kredensial DB dikelola dan dirotasi?<br/>- IAM kurang mendalam. Kami memerlukan RBAC dengan peran yang terdefinisi dengan baik, kontrol akses berbasis atribut (ABAC) untuk izin granular, dan integrasi dengan penyedia identitas enterprise (SAML, OIDC).<br/><br/>### 3. Efektivitas Biaya: B<br/><br/>Kekuatan:<br/>- Server aplikasi bersama mengurangi biaya kapasitas idle, baik untuk lalu lintas steady-state.<br/>- Serverless untuk tugas yang jarang terjadi (misalnya, pelaporan) cerdas; bayar hanya ketika sumber daya ini digunakan.<br/><br/>Kelemahan:<br/>- Database per-tenant mungkin tidak hemat biaya pada skala dibandingkan dengan database multi-tenant yang dirancang dengan baik dengan partisi data yang kuat.<br/>- Tidak ada penyebutan langkah-langkah penghematan biaya seperti reserved instances untuk beban kerja yang dapat diprediksi atau spot instances untuk tugas yang toleran terhadap kesalahan.<br/>- Kurangnya auto-scaling tier aplikasi dapat menyebabkan over-provisioning, meningkatkan biaya.<br/><br/>## Rekomendasi<br/><br/>1. **Ketahanan Tier Aplikasi**: Implementasikan auto-scaling dengan Kubernetes atau layanan cloud-native (EKS, GKE). Terapkan di seluruh zona ketersediaan dengan CDN untuk aset statis.<br/><br/>2. **Pengerasan Keamanan**:<br/>   a. Enkripsi data at rest (AES-256) dan in transit (TLS 1.3).<br/>   b. Gunakan KMS terkelola (AWS KMS, GCP KMS) untuk manajemen kunci.<br/>   c. Tingkatkan IAM dengan RBAC, ABAC, dan SAML/OIDC untuk SSO enterprise.<br/><br/>3. **Optimasi Biaya**:<br/>   a. Evaluasi database multi-tenant columnar (misalnya, Snowflake) vs. sharding pada skala.<br/>   b. Gunakan reserved instances untuk server aplikasi, spot instances untuk beban kerja non-kritis.<br/>   c. Implementasikan pemantauan proaktif dan right-sizing untuk menghindari over-provisioning.<br/><br/>4. **Proof of Concept (PoC)**: Sebelum implementasi penuh, lakukan PoC dengan simulasi skala tinggi:<br/>   a. Uji database yang di-shard vs. database multi-tenant yang dioptimalkan untuk biaya dan performa.<br/>   b. Stress-test tier aplikasi dengan lalu lintas tingkat enterprise yang disimulasikan.<br/>   c. Lakukan audit keamanan pihak ketiga, fokus pada isolasi data dan kontrol akses.<br/><br/>Dengan peningkatan ini, strategi multi-tenancy kami akan tingkat enterprise: dapat diskalakan, aman, dan hemat biaya. PoC akan memvalidasi pilihan desain kami dan menginspirasi kepercayaan pada klien enterprise kami. |
    
    #### Prompt 3    
    | Role | Content |
    | ---- | ------- |
    | User | Nilai dokumen tinjauan strategi ini untuk kejelasan, actionability, dan keselarasan dengan prioritas enterprise. <br/><br/>\<br/>\{\{PRIORITIES}}<br/>\</priorities><br/><br/>\<strategy_doc><br/>\{\{STRATEGY_DOC}}<br/>\</strategy_doc> |
    | Assistant | 1. Kejelasan: A<br/>   + Struktur yang jelas dengan Ringkasan Eksekutif, Analisis Terperinci, dan Rekomendasi.<br/>   + Analisis menggunakan sistem penilaian (B+, B-) untuk pemahaman cepat tentang kekuatan/kelemahan.<br/>   + Istilah teknis (RBAC, ABAC, TLS) dijelaskan atau dikontekstualisasikan, membantu kepemimpinan non-teknis.<br/>   + Bantuan visual (bullet points, indentasi) meningkatkan keterbacaan.<br/><br/>2. Actionability: A-<br/>   + Rekomendasi spesifik dan teknis (misalnya, "Implementasikan auto-scaling dengan Kubernetes").<br/>   + Rencana PoC dengan tujuan yang jelas memberikan roadmap.<br/>   + Hilang: Timeline, persyaratan sumber daya, atau penugasan tim untuk setiap rekomendasi.<br/>   + Pertimbangkan: Tambahkan bagian "Langkah Berikutnya" dengan tindakan segera, peran, dan timeline tingkat tinggi.<br/><br/>3. Keselarasan Enterprise: A+<br/>   + Secara langsung mengatasi prioritas enterprise:<br/>     - Skalabilitas: Membahas penanganan lonjakan lalu lintas tingkat enterprise.<br/>     - Keamanan: Fokus pada isolasi data, enkripsi, dan IAM enterprise.<br/>     - Biaya: Strategi selaras dengan enterprise FinOps (reserved instances, right-sizing).<br/>   + PoC dengan "simulasi skala tinggi" dan audit keamanan menunjukkan komitmen terhadap kualitas tingkat enterprise.<br/>   + Bahasa beresonansi dengan kekhawatiran enterprise: "risiko yang tidak dapat diterima," "tingkat enterprise," "menginspirasi kepercayaan."<br/><br/>Secara keseluruhan, dokumen unggul dalam kejelasan dan keselarasan enterprise. Actionability kuat tetapi dapat ditingkatkan ke A+ dengan bagian "Langkah Berikutnya". Kedalaman teknis, ditambah dengan penjelasan yang jelas, membuat ini sangat efektif untuk kepemimpinan teknis dan non-teknis. Pekerjaan yang bagus! |
  
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