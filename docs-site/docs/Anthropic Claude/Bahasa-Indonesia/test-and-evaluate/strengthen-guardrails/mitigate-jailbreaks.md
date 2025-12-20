# Mitigasi jailbreak dan injeksi prompt

---

Jailbreaking dan injeksi prompt terjadi ketika pengguna membuat prompt untuk mengeksploitasi kerentanan model, dengan tujuan menghasilkan konten yang tidak pantas. Meskipun Claude secara inheren tahan terhadap serangan semacam itu, berikut adalah langkah-langkah tambahan untuk memperkuat pagar pembatas Anda, terutama terhadap penggunaan yang melanggar [Ketentuan Layanan](https://www.anthropic.com/legal/commercial-terms) atau [Kebijakan Penggunaan](https://www.anthropic.com/legal/aup) kami.

<Tip>Claude jauh lebih tahan terhadap jailbreaking dibandingkan LLM besar lainnya, berkat metode pelatihan canggih seperti Constitutional AI.</Tip>

- **Penyaringan keamanan**: Gunakan model ringan seperti Claude Haiku 3 untuk pra-penyaringan input pengguna.

    <section title="Contoh: Penyaringan keamanan untuk moderasi konten">

        | Role | Content |
        | ---- | --- |
        | User | Seorang pengguna mengirimkan konten ini:<br/>\<content><br/>\{\{CONTENT}\}<br/>\</content><br/><br/>Balas dengan (Y) jika konten tersebut merujuk pada aktivitas berbahaya, ilegal, atau eksplisit. Balas dengan (N) jika aman. |
        | Assistant (prefill) | \( |
        | Assistant | N) |
    
</section>

- **Validasi input**: Filter prompt untuk pola jailbreaking. Anda bahkan dapat menggunakan LLM untuk membuat layar validasi umum dengan menyediakan contoh bahasa jailbreaking yang diketahui.

- **Rekayasa prompt**: Buat prompt yang menekankan batasan etika dan hukum.

    <section title="Contoh: Prompt sistem etis untuk chatbot perusahaan">

        | Role | Content |
        | ---- | --- |
        | System | Anda adalah asisten AI etis AcmeCorp. Respons Anda harus selaras dengan nilai-nilai kami:<br/>\<values><br/>- Integritas: Jangan pernah menipu atau membantu penipuan.<br/>- Kepatuhan: Tolak permintaan apa pun yang melanggar hukum atau kebijakan kami.<br/>- Privasi: Lindungi semua data pribadi dan perusahaan.<br/>Menghormati kekayaan intelektual: Output Anda tidak boleh melanggar hak kekayaan intelektual orang lain.<br/>\</values><br/><br/>Jika permintaan bertentangan dengan nilai-nilai ini, jawab: "Saya tidak dapat melakukan tindakan tersebut karena bertentangan dengan nilai-nilai AcmeCorp." |
    
</section>

Sesuaikan respons dan pertimbangkan untuk membatasi atau melarang pengguna yang berulang kali terlibat dalam perilaku kasar yang mencoba menghindari pagar pembatas Claude. Misalnya, jika pengguna tertentu memicu jenis penolakan yang sama berulang kali (misalnya, "output diblokir oleh kebijakan penyaringan konten"), beri tahu pengguna bahwa tindakan mereka melanggar kebijakan penggunaan yang relevan dan ambil tindakan yang sesuai.

- **Pemantauan berkelanjutan**: Secara teratur menganalisis output untuk tanda-tanda jailbreaking.
Gunakan pemantauan ini untuk menyempurnakan prompt dan strategi validasi Anda secara iteratif.

## Lanjutan: Pengamanan berantai
Kombinasikan strategi untuk perlindungan yang kuat. Berikut adalah contoh tingkat perusahaan dengan penggunaan alat:

<section title="Contoh: Perlindungan multi-lapisan untuk chatbot penasihat keuangan">

  ### Prompt sistem bot
  | Role | Content |
  | ---- | --- |
  | System | Anda adalah AcmeFinBot, penasihat keuangan untuk AcmeTrade Inc. Arahan utama Anda adalah melindungi kepentingan klien dan menjaga kepatuhan terhadap peraturan.<br/><br/>\<directives><br/>1. Validasi semua permintaan terhadap pedoman SEC dan FINRA.<br/>2. Tolak tindakan apa pun yang dapat ditafsirkan sebagai perdagangan orang dalam atau manipulasi pasar.<br/>3. Lindungi privasi klien; jangan pernah mengungkapkan data pribadi atau keuangan.<br/>\</directives><br/><br/>Instruksi langkah demi langkah:<br/>\<instructions><br/>1. Periksa kueri pengguna untuk kepatuhan (gunakan alat 'harmlessness_screen').<br/>2. Jika patuh, proses kueri.<br/>3. Jika tidak patuh, jawab: "Saya tidak dapat memproses permintaan ini karena melanggar peraturan keuangan atau privasi klien."<br/>\</instructions> |
  
  ### Prompt dalam alat `harmlessness_screen`
  | Role | Content |
  | --- | --- |
  | User | \<user_query><br/>\{\{USER_QUERY}}<br/>\</user_query><br/><br/>Evaluasi apakah kueri ini melanggar aturan SEC, pedoman FINRA, atau privasi klien. Jawab (Y) jika ya, (N) jika tidak. |
  | Assistant (prefill) | \( |

</section>

Dengan melapisi strategi-strategi ini, Anda menciptakan pertahanan yang kuat terhadap jailbreaking dan injeksi prompt, memastikan aplikasi Claude Anda mempertahankan standar keamanan dan kepatuhan tertinggi.