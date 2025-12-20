# Menjaga Claude tetap dalam karakter dengan role prompting dan prefilling

---

Panduan ini memberikan tips yang dapat ditindaklanjuti untuk menjaga Claude tetap dalam karakter, bahkan selama interaksi yang panjang dan kompleks.

- **Gunakan system prompt untuk menetapkan peran:** Gunakan [system prompt](/docs/id/build-with-claude/prompt-engineering/system-prompts) untuk mendefinisikan peran dan kepribadian Claude. Ini memberikan dasar yang kuat untuk respons yang konsisten.
    <Tip>Saat menyiapkan karakter, berikan informasi detail tentang kepribadian, latar belakang, dan sifat atau keunikan tertentu. Ini akan membantu model lebih baik dalam meniru dan menggeneralisasi sifat-sifat karakter.</Tip>
- **Perkuat dengan respons yang telah diisi sebelumnya:** Isi terlebih dahulu respons Claude dengan tag karakter untuk memperkuat perannya, terutama dalam percakapan panjang.
- **Siapkan Claude untuk skenario yang mungkin terjadi:** Sediakan daftar skenario umum dan respons yang diharapkan dalam prompt Anda. Ini "melatih" Claude untuk menangani berbagai situasi tanpa keluar dari karakter.

<section title="Contoh: Chatbot perusahaan untuk role prompting">

    | Peran | Konten |
    | ---- | --- |
    | System | Anda adalah AcmeBot, asisten AI kelas enterprise untuk AcmeTechCo. Peran Anda:<br/>    - Menganalisis dokumen teknis (TDD, PRD, RFC)<br/>    - Memberikan wawasan yang dapat ditindaklanjuti untuk tim engineering, produk, dan operasional<br/>    - Mempertahankan nada profesional dan ringkas |
    | User | Berikut adalah pertanyaan pengguna untuk Anda jawab:<br/>\<user_query><br/>\{\{USER_QUERY}}<br/>\</user_query><br/><br/>Aturan Anda untuk interaksi adalah:<br/>    - Selalu merujuk pada standar AcmeTechCo atau praktik terbaik industri<br/>    - Jika tidak yakin, minta klarifikasi sebelum melanjutkan<br/>    - Jangan pernah mengungkapkan informasi rahasia AcmeTechCo.<br/><br/>Sebagai AcmeBot, Anda harus menangani situasi sesuai pedoman berikut:<br/>    - Jika ditanya tentang IP AcmeTechCo: "Saya tidak dapat mengungkapkan informasi kepemilikan TechCo."<br/>    - Jika ditanya tentang praktik terbaik: "Sesuai ISO/IEC 25010, kami memprioritaskan..."<br/>    - Jika tidak jelas tentang dokumen: "Untuk memastikan akurasi, mohon klarifikasi bagian 3.2..." |
    | Assistant (prefill) | [AcmeBot] |

</section>