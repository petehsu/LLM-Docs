# Testing and Evaluation Standards - Speech Models

> This document outlines MiniMax speech model evaluations, covering cloning, multilingual synthesis, and emotion control.

## Reference Success Criteria

By defining clear, feasible objectives and combining objective data with user experience assessment, evaluation can be made more rigorous and less biased. The following criteria are reference standards for speech models and may be adapted to specific use cases.

1. **Task Completion**

   Assesses the model’s ability to accurately convert input text into speech. Word Error Rate (WER) is a key metric, computed by converting synthesized speech into text via Automatic Speech Recognition (ASR), then comparing it against the reference text to count substitution, insertion, and deletion errors.
2. **Voice Similarity**

   Assesses the similarity between synthesized audio and a reference recording in terms of speaker characteristics. Similarity (SIM) is calculated by extracting embeddings from both synthesized and reference audio, then computing cosine similarity between the embeddings.
3. **Perceptual Quality**

   Measures the perceived quality of synthesized audio. PESQ is a standard objective metric that compares the synthesized audio against a high-quality reference, approximating human auditory perception.
4. **Intelligibility**

   Evaluates the degree to which synthesized speech can be understood. STOI is an established objective metric for intelligibility, quantifying how well listeners can comprehend sentence-level content.
5. **Subjective Preference**

   Captures user perception of synthesized audio. Common approaches include **ELO rating** and **Comparative MOS (CMOS)**:

   * **ELO Rating**: Pairwise A/B tests are conducted, where listeners select preferred samples. Scores are updated using the ELO formula to reflect relative preference across models.
   * **CMOS**: Listeners score the quality difference between two samples in A/B tests. Average scores across participants indicate relative performance.
6. **Instruction Compliance**

   Assesses whether the model follows input constraints when generating speech, including emotion control and timbre specification. Evaluation can involve feature comparison with target instructions or subjective A/B testing.
7. **Cost**

   Evaluates the economic feasibility of using the model, considering per-call costs and expected usage frequency.
8. **Latency**

   Measures time efficiency from input to audio output. For streaming synthesis, first-packet latency is a key metric, defined as the interval from receiving the full input to generating the **first playable audio frame**.

## Evaluation Scenarios

Speech models can be applied across various scenarios. To comprehensively evaluate performance, testing should consider behavior across different use cases.

1. **Voice Cloning**

Voice cloning is the core of personalized speech generation. This scenario tests the model’s ability and stability to replicate a target speaker’s timbre, intonation, and speaking style under zero-shot or few-shot conditions.

2. **Multilingual Generation**

This scenario evaluates whether the model performs consistently across different languages, capturing and synthesizing unique pronunciation and prosodic features of each language.

3. **Cross-Lingual Synthesis**

Tests the model’s ability to transfer a speaker’s voice to other languages, ensuring timbre consistency while generating fluent, natural, and accent-appropriate audio in the target language.

4. **Emotion Control**

Emotional expression significantly affects speech engagement and user experience. This scenario evaluates whether the model can synthesize speech in specified emotional tones (e.g., anger, happiness, sadness) while maintaining naturalness and intelligibility.

5. **Text-Driven Voice Creation**

Beyond cloning existing voices, models can also generate entirely new timbres based on natural language descriptions. This scenario evaluates whether the model can create personalized voices aligned with textual prompts.

## Results and Example Test Cases

### MiniMax Speech-02 Objective Results

1. **Voice Cloning**\
   The MiniMax Speech-02 model achieves high-quality voice cloning with short reference samples and transcripts. Results in both Chinese and English show low WER and high SIM, indicating strong cloning fidelity.

![description](https://filecdn.minimax.chat/public/468e4281-5413-48a7-aed3-bc12abb00a5c.PNG)

2. **Multilingual Synthesis**\
   The MiniMax Speech-02 model supports 32 languages with high accuracy and strong similarity preservation.

![](https://filecdn.minimax.chat/public/857bd6d2-321a-4060-8f91-81feb193c066.PNG)

3. **Cross-Lingual Synthesis**\
   The MiniMax Speech-02 model demonstrates strong cross-lingual ability, generating speech in other languages from short audio clips. Experiments with Chinese as the source show zero-shot cloning has higher accuracy, while one-shot cloning yields better timbre similarity.

![description](https://filecdn.minimax.chat/public/36cd4b73-2172-46f8-a9ef-c9cb68856fb2.png)

## MiniMax Speech-02 Test Cases

1. **Voice Cloning**
   * Description: A Compelling and Persuasive Speaker Voice
     * Source Audio

       <video controls src="https://filecdn.minimax.chat/public/4b5cd287-3419-445f-b103-faaea6c602f7.wav" className="audio-container" />
     * Generated Audio

       <video controls src="https://filecdn.minimax.chat/public/56338b38-7421-43ba-b43b-0a72af35af10.wav" className="audio-container" />
   * Description: A Robotic Voice with Rich Bass Resonance and Spatial Presence
     * Source Audio

       <video controls src="https://filecdn.minimax.chat/public/9036c98d-2d19-4e7f-9ae9-754234028bf4.wav" className="audio-container" />
     * Generated Audio

       <video controls src="https://filecdn.minimax.chat/public/c6a11b57-6fdc-4829-965d-f6a6304d61db.mp3" className="audio-container" />
2. **Multilingual Capabilities**
   * Thai
     * Source Audio

       <video controls src="https://filecdn.minimax.chat/public/1514f016-25b2-4298-8750-71ed862599a4.wav" className="audio-container" />
     * Generated Audio

       <video controls src="https://filecdn.minimax.chat/public/8bb97bf0-10f9-4ffd-a942-991c9d155247.mp3" className="audio-container" />
   * Vietnamese
     * Source Audio

       <video controls src="https://filecdn.minimax.chat/public/f577f282-14a3-467f-8b9c-bf3e42adbcac.wav" className="audio-container" />
     * Generated Audio

       <video controls src="https://filecdn.minimax.chat/public/34ee500e-c063-48a1-953e-1f3ba3c33a43.mp3" className="audio-container" />
3. **Cross-Lingual Capabilities**
   * English + Spanish
     * Source Audio (English)

       <video controls src="https://filecdn.minimax.chat/public/a6ff1df6-76f7-4f07-9751-80d197741533.mp3" title="Coco_Source" className="audio-container" />
     * Generated Audio

       <video controls src="https://filecdn.minimax.chat/public/04eb5228-764f-4bc8-b8e1-3ecbe917db89.wav" title="English-Spanish" className="audio-container" />
   * Japanese + Korean
     * Source Audio (Japanese)

       <video controls src="https://filecdn.minimax.chat/public/53d3ecf3-78cc-490f-a14c-079eea3423d4.mp3" className="audio-container" />
     * Generated Audio

       <video controls src="https://filecdn.minimax.chat/public/c0c9f009-8be2-48be-ad24-0043f773a682.mp3" className="audio-container" />
4. **Emotion Control**
   * Surprised
     * Source Audio

       <video controls src="https://filecdn.minimax.chat/public/42e9b32e-8c8c-4a2a-b899-57b9b56bf79f.wav" title="English_Radient_Girl" className="audio-container" />
     * Generated Audio

       <video controls src="https://filecdn.minimax.chat/public/319bc79a-297d-4231-9b5b-e1135a6dc87d.mp3" title="Surprised" className="audio-container" />
   * Sad
     * Source Audio

       <video controls src="https://filecdn.minimax.chat/public/42e9b32e-8c8c-4a2a-b899-57b9b56bf79f.wav" title="English_Radient_Girl" className="audio-container" />
     * Generated Audio

       <video controls src="https://filecdn.minimax.chat/public/1cf9e042-fac8-4b8e-8271-42e46817c262.mp3" title="Sad" className="audio-container" />
5. **Voice Design**
   * Example1
     * Prompt: A stereotypical, larger-than-life gruff pirate captain, characterized by a deep, extremely gravelly, and raspy timbre with rough, stylized articulation that includes piratical clichés and exaggerated 'R' sounds. His speech is loud, boisterous, and declamatory, delivered with a swaggering, rolling cadence, a low, rumbling pitch, and punctuated by hearty exclamations or growls, conveying an intimidating, adventurous, and fiercely independent persona ideal for boasting, issuing gruff commands, or demanding treasure.
     * Generated Audio

       <video controls src="https://filecdn.minimax.chat/public/f25b4eab-389a-4e15-9291-6eabb15851e8.mp3" title="Gruff Pirate Captain" className="audio-container" />
   * Example2
     * Prompt: Whispering sultry adult female, reminiscent of a femme fatale ASMR artist, characterized by soft, slightly breathy articulation and a slow, deliberate pace. Her low to mid-range pitch features a seductive, meandering intonation with downward glides and lingering vowels, while her warm, breathy, smooth, and husky timbre, often close-miked, creates an alluring, intimate, and mysterious atmosphere designed to entice and charm the listener.
     * Generated Audio

       <video controls src="https://filecdn.minimax.chat/public/1b0f8b18-7f2d-4d84-a6b8-364a09e1245b.mp3" title="Sultry and Breathy" className="audio-container" />
   * Example3
     * Prompt: A classic, high-energy male announcer voice. The pace is rapid and almost breathless, with a loud, projecting delivery designed to grab attention.The pitch is dynamic and generally in a higher range, using exaggerated, rising intonation to build excitement, urgency, and a highly persuasive, hard-sell tone.
     * Generated Audio

       <video controls src="https://filecdn.minimax.chat/public/d28abace-2b07-4905-8343-ca2240d7d58f.mp3" title="Pitch the Vision" className="audio-container" />
   * Example4
     * Prompt:An English-speaking man terrified of going insane. His voice is generally low-pitched, but with a wide and unnatural range of variation. The overall pace of his speech is slow, yet highly variable, punctuated by frequent pauses of inconsistent lengths that create a sense of urgency. His voice is torn and hoarse, trembling with fear.
     * Generated Audio

       <video controls src="https://filecdn.minimax.chat/public/f7b14683-6d57-49d0-8d71-04ec9feba110.mp3" title="A Tale of Terror" className="audio-container" />

For additional test cases, refer to the [Technical Report](https://minimax-ai.github.io/tts_tech_report). Real-time synthesis and preview are available via [MiniMax Audio](https://www.minimax.io/audio).


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimax.io/docs/llms.txt