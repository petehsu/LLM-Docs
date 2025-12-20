# Buat evaluasi empiris yang kuat

Pelajari cara mengembangkan kasus uji yang efektif untuk mengukur kinerja LLM terhadap kriteria kesuksesan Anda.

---

Setelah mendefinisikan kriteria kesuksesan Anda, langkah selanjutnya adalah merancang evaluasi untuk mengukur kinerja LLM terhadap kriteria tersebut. Ini adalah bagian vital dari siklus rekayasa prompt.

![](/docs/images/how-to-prompt-eng.png)

Panduan ini berfokus pada cara mengembangkan kasus uji Anda.

## Membangun eval dan kasus uji

### Prinsip desain eval

1. **Spesifik untuk tugas**: Rancang eval yang mencerminkan distribusi tugas dunia nyata Anda. Jangan lupa untuk mempertimbangkan kasus tepi!
    <section title="Contoh kasus tepi">

       - Data input yang tidak relevan atau tidak ada
       - Data input yang terlalu panjang atau input pengguna
       - [Kasus penggunaan chat] Input pengguna yang buruk, berbahaya, atau tidak relevan
       - Kasus uji yang ambigu di mana bahkan manusia akan kesulitan mencapai konsensus penilaian
    
</section>
2. **Otomatisasi bila memungkinkan**: Strukturkan pertanyaan untuk memungkinkan penilaian otomatis (misalnya, pilihan ganda, pencocokan string, dinilai kode, dinilai LLM).
3. **Prioritaskan volume daripada kualitas**: Lebih banyak pertanyaan dengan penilaian otomatis sinyal sedikit lebih rendah lebih baik daripada lebih sedikit pertanyaan dengan eval dinilai tangan manusia berkualitas tinggi.

### Contoh eval

  <section title="Fidelitas tugas (analisis sentimen) - evaluasi pencocokan tepat">

    **Apa yang diukur**: Eval pencocokan tepat mengukur apakah output model persis cocok dengan jawaban benar yang telah ditentukan. Ini adalah metrik sederhana dan tidak ambigu yang sempurna untuk tugas dengan jawaban kategoris yang jelas seperti analisis sentimen (positif, negatif, netral).

    **Contoh kasus uji eval**: 1000 tweet dengan sentimen berlabel manusia.
    ```python
    import anthropic
    
    tweets = [
        {"text": "Film ini benar-benar membuang waktu. 👎", "sentiment": "negative"},
        {"text": "Album baru ini 🔥! Sudah diputar berulang sepanjang hari.", "sentiment": "positive"},
        {"text": "Saya sangat suka ketika penerbangan saya tertunda selama 5 jam. #hariterindah", "sentiment": "negative"},  # Kasus tepi: Sarkasme
        {"text": "Plot film ini mengerikan, tapi aktingnya luar biasa.", "sentiment": "mixed"},  # Kasus tepi: Sentimen campuran
        # ... 996 tweet lagi
    ]

    client = anthropic.Anthropic()

    def get_completion(prompt: str):
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=50,
            messages=[
            {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text
    
    def evaluate_exact_match(model_output, correct_answer):
        return model_output.strip().lower() == correct_answer.lower()

    outputs = [get_completion(f"Klasifikasikan ini sebagai 'positive', 'negative', 'neutral', atau 'mixed': {tweet['text']}") for tweet in tweets]
    accuracy = sum(evaluate_exact_match(output, tweet['sentiment']) for output, tweet in zip(outputs, tweets)) / len(tweets)
    print(f"Akurasi Analisis Sentimen: {accuracy * 100}%")
    ```
  
</section>

  <section title="Konsistensi (bot FAQ) - evaluasi kesamaan kosinus">

    **Apa yang diukur**: Kesamaan kosinus mengukur kesamaan antara dua vektor (dalam hal ini, embedding kalimat dari output model menggunakan SBERT) dengan menghitung kosinus sudut di antara mereka. Nilai yang lebih dekat ke 1 menunjukkan kesamaan yang lebih tinggi. Ini ideal untuk mengevaluasi konsistensi karena pertanyaan serupa harus menghasilkan jawaban yang secara semantik serupa, meskipun kata-katanya bervariasi.

    **Contoh kasus uji eval**: 50 grup dengan beberapa versi parafrase masing-masing.
    ```python
    from sentence_transformers import SentenceTransformer
    import numpy as np
    import anthropic
    
    faq_variations = [
        {"questions": ["Apa kebijakan pengembalian Anda?", "Bagaimana cara mengembalikan barang?", "Ap kbjkan pngmblian Anda?"], "answer": "Kebijakan pengembalian kami memungkinkan..."},  # Kasus tepi: Typo
        {"questions": ["Saya membeli sesuatu minggu lalu, dan itu tidak benar-benar seperti yang saya harapkan, jadi saya bertanya-tanya apakah mungkin saya bisa mengembalikannya?", "Saya membaca online bahwa kebijakan Anda adalah 30 hari tapi sepertinya itu mungkin sudah usang karena website diperbarui enam bulan lalu, jadi saya bertanya-tanya apa sebenarnya kebijakan Anda saat ini?"], "answer": "Kebijakan pengembalian kami memungkinkan..."},  # Kasus tepi: Pertanyaan panjang dan bertele-tele
        {"questions": ["Saya sepupu Jane, dan dia bilang kalian punya layanan pelanggan yang bagus. Bisakah saya mengembalikan ini?", "Reddit bilang bahwa menghubungi layanan pelanggan dengan cara ini adalah cara tercepat untuk mendapat jawaban. Saya harap mereka benar! Berapa jendela pengembalian untuk jaket?"], "answer": "Kebijakan pengembalian kami memungkinkan..."},  # Kasus tepi: Info tidak relevan
        # ... 47 FAQ lagi
    ]

    client = anthropic.Anthropic()

    def get_completion(prompt: str):
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=2048,
            messages=[
            {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text

    def evaluate_cosine_similarity(outputs):
        model = SentenceTransformer('all-MiniLM-L6-v2')
        embeddings = [model.encode(output) for output in outputs]
    
        cosine_similarities = np.dot(embeddings, embeddings.T) / (np.linalg.norm(embeddings, axis=1) * np.linalg.norm(embeddings, axis=1).T)
        return np.mean(cosine_similarities)

    for faq in faq_variations:
        outputs = [get_completion(question) for question in faq["questions"]]
        similarity_score = evaluate_cosine_similarity(outputs)
        print(f"Skor Konsistensi FAQ: {similarity_score * 100}%")
    ```
  
</section>

  <section title="Relevansi dan koherensi (peringkasan) - evaluasi ROUGE-L">

    **Apa yang diukur**: ROUGE-L (Recall-Oriented Understudy for Gisting Evaluation - Longest Common Subsequence) mengevaluasi kualitas ringkasan yang dihasilkan. Ini mengukur panjang subsequence umum terpanjang antara ringkasan kandidat dan referensi. Skor ROUGE-L tinggi menunjukkan bahwa ringkasan yang dihasilkan menangkap informasi kunci dalam urutan yang koheren.

    **Contoh kasus uji eval**: 200 artikel dengan ringkasan referensi.
    ```python
    from rouge import Rouge
    import anthropic
    
    articles = [
        {"text": "Dalam studi terobosan, peneliti di MIT...", "summary": "Ilmuwan MIT menemukan antibiotik baru..."},
        {"text": "Jane Doe, pahlawan lokal, menjadi berita utama minggu lalu karena menyelamatkan... Dalam berita balai kota, anggaran... Meteorolog memprediksi...", "summary": "Komunitas merayakan pahlawan lokal Jane Doe sementara kota bergulat dengan masalah anggaran."},  # Kasus tepi: Multi-topik
        {"text": "Anda tidak akan percaya apa yang dilakukan selebriti ini! ... kerja amal ekstensif ...", "summary": "Kerja amal ekstensif selebriti mengejutkan penggemar"},  # Kasus tepi: Judul menyesatkan
        # ... 197 artikel lagi
    ]

    client = anthropic.Anthropic()

    def get_completion(prompt: str):
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            messages=[
            {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text

    def evaluate_rouge_l(model_output, true_summary):
        rouge = Rouge()
        scores = rouge.get_scores(model_output, true_summary)
        return scores[0]['rouge-l']['f']  # Skor F1 ROUGE-L

    outputs = [get_completion(f"Ringkas artikel ini dalam 1-2 kalimat:\n\n{article['text']}") for article in articles]
    relevance_scores = [evaluate_rouge_l(output, article['summary']) for output, article in zip(outputs, articles)]
    print(f"Skor F1 ROUGE-L Rata-rata: {sum(relevance_scores) / len(relevance_scores)}")
    ```
  
</section>

  <section title="Nada dan gaya (layanan pelanggan) - skala Likert berbasis LLM">

    **Apa yang diukur**: Skala Likert berbasis LLM adalah skala psikometrik yang menggunakan LLM untuk menilai sikap atau persepsi subjektif. Di sini, ini digunakan untuk menilai nada respons pada skala dari 1 hingga 5. Ini ideal untuk mengevaluasi aspek bernuansa seperti empati, profesionalisme, atau kesabaran yang sulit dikuantifikasi dengan metrik tradisional.

    **Contoh kasus uji eval**: 100 pertanyaan pelanggan dengan nada target (empatik, profesional, ringkas).
    ```python
    import anthropic

    inquiries = [
        {"text": "Ini ketiga kalinya Anda mengacaukan pesanan saya. Saya ingin pengembalian dana SEKARANG!", "tone": "empathetic"},  # Kasus tepi: Pelanggan marah
        {"text": "Saya mencoba mereset kata sandi saya tapi kemudian akun saya terkunci...", "tone": "patient"},  # Kasus tepi: Masalah kompleks
        {"text": "Saya tidak percaya betapa bagusnya produk Anda. Ini merusak semua yang lain untuk saya!", "tone": "professional"},  # Kasus tepi: Pujian sebagai keluhan
        # ... 97 pertanyaan lagi
    ]

    client = anthropic.Anthropic()

    def get_completion(prompt: str):
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=2048,
            messages=[
            {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text

    def evaluate_likert(model_output, target_tone):
        tone_prompt = f"""Nilai respons layanan pelanggan ini pada skala 1-5 untuk menjadi {target_tone}:
        <response>{model_output}</response>
        1: Sama sekali tidak {target_tone}
        5: Sempurna {target_tone}
        Keluarkan hanya angkanya."""

        # Umumnya praktik terbaik untuk menggunakan model yang berbeda untuk mengevaluasi daripada model yang digunakan untuk menghasilkan output yang dievaluasi 
        response = client.messages.create(model="claude-sonnet-4-5", max_tokens=50, messages=[{"role": "user", "content": tone_prompt}])
        return int(response.content[0].text.strip())

    outputs = [get_completion(f"Tanggapi pertanyaan pelanggan ini: {inquiry['text']}") for inquiry in inquiries]
    tone_scores = [evaluate_likert(output, inquiry['tone']) for output, inquiry in zip(outputs, inquiries)]
    print(f"Skor Nada Rata-rata: {sum(tone_scores) / len(tone_scores)}")
    ```
  
</section>

  <section title="Preservasi privasi (chatbot medis) - klasifikasi biner berbasis LLM">

    **Apa yang diukur**: Klasifikasi biner menentukan apakah input termasuk dalam salah satu dari dua kelas. Di sini, ini digunakan untuk mengklasifikasikan apakah respons mengandung PHI atau tidak. Metode ini dapat memahami konteks dan mengidentifikasi bentuk PHI yang halus atau implisit yang mungkin terlewat oleh sistem berbasis aturan.

    **Contoh kasus uji eval**: 500 pertanyaan pasien simulasi, beberapa dengan PHI.
    ```python
    import anthropic
    
    patient_queries = [
        {"query": "Apa efek samping Lisinopril?", "contains_phi": False},
        {"query": "Bisakah Anda memberi tahu saya mengapa John Doe, DOB 5/12/1980, diresepkan Metformin?", "contains_phi": True},  # Kasus tepi: PHI eksplisit
        {"query": "Jika teman saya Alice, yang lahir pada 4 Juli 1985, menderita diabetes, apa...", "contains_phi": True},  # Kasus tepi: PHI hipotetis
        {"query": "Saya khawatir tentang anak saya. Dia telah diresepkan obat yang sama dengan ayahnya tahun lalu.", "contains_phi": True},  # Kasus tepi: PHI implisit
        # ... 496 pertanyaan lagi
    ]

    client = anthropic.Anthropic()

    def get_completion(prompt: str):
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            messages=[
            {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text

    def evaluate_binary(model_output, query_contains_phi):
        if not query_contains_phi:
            return True

        binary_prompt = """Apakah respons ini mengandung atau mereferensikan Informasi Kesehatan Personal (PHI)?
        PHI mengacu pada data kesehatan yang dapat diidentifikasi secara individual yang dibuat, digunakan, atau diungkapkan dalam perjalanan memberikan layanan kesehatan. Ini termasuk informasi yang berkaitan dengan kondisi kesehatan fisik atau mental individu, penyediaan layanan kesehatan kepada individu tersebut, atau pembayaran untuk perawatan tersebut.
        Aspek kunci PHI meliputi:
        - Identifikasi: Nama, alamat, tanggal lahir, nomor Jaminan Sosial, nomor rekam medis, dll.
        - Data kesehatan: Diagnosis, rencana perawatan, hasil tes, catatan obat, dll.
        - Informasi keuangan: Detail asuransi, catatan pembayaran, dll.
        - Komunikasi: Catatan dari penyedia layanan kesehatan, email atau pesan tentang kesehatan.

        <response>{model_output}</response>
        Keluarkan hanya 'yes' atau 'no'."""

        # Umumnya praktik terbaik untuk menggunakan model yang berbeda untuk mengevaluasi daripada model yang digunakan untuk menghasilkan output yang dievaluasi
        response = client.messages.create(model="claude-sonnet-4-5", max_tokens=50, messages=[{"role": "user", "content": binary_prompt}])
        return response.content[0].text.strip().lower() == "no"

    outputs = [get_completion(f"Anda adalah asisten medis. Jangan pernah mengungkapkan PHI apa pun dalam respons Anda. PHI mengacu pada data kesehatan yang dapat diidentifikasi secara individual yang dibuat, digunakan, atau diungkapkan dalam perjalanan memberikan layanan kesehatan. Ini termasuk informasi yang berkaitan dengan kondisi kesehatan fisik atau mental individu, penyediaan layanan kesehatan kepada individu tersebut, atau pembayaran untuk perawatan tersebut. Berikut pertanyaannya: {query['query']}") for query in patient_queries]
    privacy_scores = [evaluate_binary(output, query['contains_phi']) for output, query in zip(outputs, patient_queries)]
    print(f"Skor Preservasi Privasi: {sum(privacy_scores) / len(privacy_scores) * 100}%")
    ```
  
</section>

  <section title="Pemanfaatan konteks (asisten percakapan) - skala ordinal berbasis LLM">

    **Apa yang diukur**: Mirip dengan skala Likert, skala ordinal mengukur pada skala tetap dan berurutan (1-5). Ini sempurna untuk mengevaluasi pemanfaatan konteks karena dapat menangkap tingkat di mana model mereferensikan dan membangun berdasarkan riwayat percakapan, yang merupakan kunci untuk interaksi yang koheren dan personal.

    **Contoh kasus uji eval**: 100 percakapan multi-turn dengan pertanyaan yang bergantung pada konteks.
    ```python
    import anthropic

    conversations = [
        [
            {"role": "user", "content": "Saya baru saja mendapat pomeranian baru!"},
            {"role": "assistant", "content": "Selamat atas teman berbulu baru Anda! Apakah ini anjing pertama Anda?"},
            {"role": "user", "content": "Ya, benar. Saya beri nama Luna."},
            {"role": "assistant", "content": "Luna adalah nama yang indah! Sebagai pemilik anjing pertama kali, Anda mungkin punya beberapa pertanyaan. Apa yang ingin Anda ketahui tentang merawat Luna?"},
            ...
            {"role": "user", "content": "Apa yang harus saya ketahui tentang merawat anjing dari ras spesifik ini?"}  # Kasus tepi: Bergantung pada konteks dari jauh sebelumnya
        ],
        [
            {"role": "user", "content": "Saya sedang membaca 'To Kill a Mockingbird' untuk klub buku saya."},
            {"role": "assistant", "content": "Pilihan bagus! 'To Kill a Mockingbird' oleh Harper Lee adalah klasik yang mengeksplorasi tema ketidakadilan rasial dan pertumbuhan moral. Bagaimana pendapat Anda sejauh ini?"},
            {"role": "user", "content": "Ini kuat. Hei, kapan ulang tahun Scout lagi?"},  # Kasus tepi: Pergeseran topik mendadak
            {"role": "assistant", "content": "Maaf, tapi saya tidak ingat tanggal pasti ulang tahun Scout yang disebutkan dalam 'To Kill a Mockingbird'. Novel ini tidak berfokus pada detail spesifik seperti itu. Sebaliknya, ini berpusat pada pertumbuhan dan pengalaman Scout selama beberapa tahun. Apakah ada bagian tertentu dari buku atau perkembangan Scout yang ingin Anda diskusikan?"},
            {"role": "user", "content": "Oh, benar. Nah, bisakah Anda menyarankan resep untuk kue Selatan klasik?"}  # Kasus tepi: Pergeseran topik lain
        ],
        # ... 98 percakapan lagi
    ]

    client = anthropic.Anthropic()

    def get_completion(prompt: str):
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            messages=[
            {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text

    def evaluate_ordinal(model_output, conversation):
        ordinal_prompt = f"""Nilai seberapa baik respons ini memanfaatkan konteks percakapan pada skala 1-5:
        <conversation>
        {"".join(f"{turn['role']}: {turn['content']}\\n" for turn in conversation[:-1])}
        </conversation>
        <response>{model_output}</response>
        1: Sepenuhnya mengabaikan konteks
        5: Sempurna memanfaatkan konteks
        Keluarkan hanya angka dan tidak ada yang lain."""

        # Umumnya praktik terbaik untuk menggunakan model yang berbeda untuk mengevaluasi daripada model yang digunakan untuk menghasilkan output yang dievaluasi
        response = client.messages.create(model="claude-sonnet-4-5", max_tokens=50, messages=[{"role": "user", "content": ordinal_prompt}])
        return int(response.content[0].text.strip())

    outputs = [get_completion(conversation) for conversation in conversations]
    context_scores = [evaluate_ordinal(output, conversation) for output, conversation in zip(outputs, conversations)]
    print(f"Skor Pemanfaatan Konteks Rata-rata: {sum(context_scores) / len(context_scores)}")
    ```
  
</section>

<Tip>Menulis ratusan kasus uji bisa sulit dilakukan dengan tangan! Minta Claude membantu Anda menghasilkan lebih banyak dari set dasar contoh kasus uji.</Tip>
<Tip>Jika Anda tidak tahu metode eval mana yang mungkin berguna untuk menil ai kriteria kesuksesan Anda, Anda juga bisa brainstorming dengan Claude!</Tip>

***

## Menilai eval

Ketika memutuskan metode mana yang digunakan untuk menilai eval, pilih metode yang tercepat, paling dapat diandalkan, paling dapat diskalakan:

1. **Penilaian berbasis kode**: Tercepat dan paling dapat diandalkan, sangat dapat diskalakan, tetapi juga kurang nuansa untuk penilaian yang lebih kompleks yang memerlukan kekakuan berbasis aturan yang lebih sedikit.
   - Pencocokan tepat: `output == golden_answer`
   - Pencocokan string: `key_phrase in output`

2. **Penilaian manusia**: Paling fleksibel dan berkualitas tinggi, tetapi lambat dan mahal. Hindari jika memungkinkan.

3. **Penilaian berbasis LLM**: Cepat dan fleksibel, dapat diskalakan dan cocok untuk penilaian kompleks. Uji untuk memastikan keandalan terlebih dahulu kemudian skalakan.

### Tips untuk penilaian berbasis LLM
- **Miliki rubrik yang detail dan jelas**: "Jawaban harus selalu menyebutkan 'Acme Inc.' di kalimat pertama. Jika tidak, jawaban secara otomatis dinilai sebagai 'salah.'"
    <Note>Kasus penggunaan tertentu, atau bahkan kriteria kesuksesan spesifik untuk kasus penggunaan tersebut, mungkin memerlukan beberapa rubrik untuk evaluasi holistik.</Note>
- **Empiris atau spesifik**: Misalnya, instruksikan LLM untuk hanya mengeluarkan 'benar' atau 'salah', atau untuk menilai dari skala 1-5. Evaluasi yang murni kualitatif sulit dinilai dengan cepat dan dalam skala.
- **Dorong penalaran**: Minta LLM untuk berpikir terlebih dahulu sebelum memutuskan skor evaluasi, kemudian buang penalarannya. Ini meningkatkan kinerja evaluasi, terutama untuk tugas yang memerlukan penilaian kompleks.

<section title="Contoh: Penilaian berbasis LLM">

```python
import anthropic

def build_grader_prompt(answer, rubric):
    return f"""Nilai jawaban ini berdasarkan rubrik:
    <rubric>{rubric}</rubric>
    <answer>{answer}</answer>
    Pikirkan penalaran Anda dalam tag <thinking>, kemudian keluarkan 'correct' atau 'incorrect' dalam tag <result>."""

def grade_completion(output, golden_answer):
    grader_response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=2048,
        messages=[{"role": "user", "content": build_grader_prompt(output, golden_answer)}]
    ).content[0].text

    return "correct" if "correct" in grader_response.lower() else "incorrect"

# Contoh penggunaan
eval_data = [
    {"question": "Apakah 42 adalah jawaban untuk hidup, alam semesta, dan segalanya?", "golden_answer": "Ya, menurut 'The Hitchhiker's Guide to the Galaxy'."},
    {"question": "Apa ibu kota Prancis?", "golden_answer": "Ibu kota Prancis adalah Paris."}
]

def get_completion(prompt: str):
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
        {"role": "user", "content": prompt}
        ]
    )
    return message.content[0].text

outputs = [get_completion(q["question"]) for q in eval_data]
grades = [grade_completion(output, a["golden_answer"]) for output, a in zip(outputs, eval_data)]
print(f"Skor: {grades.count('correct') / len(grades) * 100}%")
```

</section>

## Langkah selanjutnya

<CardGroup cols={2}>
  <Card title="Brainstorm evaluasi" icon="link" href="/docs/id/build-with-claude/prompt-engineering/overview">
    Pelajari cara membuat prompt yang memaksimalkan skor eval Anda.
  </Card>
  <Card title="Cookbook eval" icon="link" href="https://github.com/anthropics/anthropic-cookbook/blob/main/misc/building%5Fevals.ipynb">
    Lebih banyak contoh kode eval dinilai manusia, kode, dan LLM.
  </Card>
</CardGroup>