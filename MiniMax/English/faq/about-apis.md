# About APIs

> Find answers to common questions about managing your MiniMax AI account.

## Q: Obtaining Your API Key

**A:** Go to [Account > Settings > API Keys](https://platform.minimax.io/user-center/basic-information/interface-key) to create and manage your API keys.

<Callout icon="lightbulb" color="#4885FF" iconType="regular">
  Your API key is an essential credential for all API calls. Do not share your API key with others, or expose it in the browser or other client-side code. In order to protect the security of your account, we may also automatically disable any API key that has leaked publicly.
</Callout>

***

## Q: Is the validity period of voice\_id only 7 days?

**A:** About the validity period of voice\_id, it’s important to clarify the following: The system-generated voice\_id is initially in an inactive state. If not activated in time, it will automatically expire 7 days after generation. To ensure the long-term validity of your voice\_id, we recommend that users synthesize audio within 7 days via the T2A v2 or T2A Large interface. This will let the system permanently save the voice\_id.

<Callout icon="lightbulb" color="#4885FF" iconType="regular">
  Previewing during voice\_clone does not activate the voice\_id.
</Callout>

***

## Q: The default value of the channel parameter

**A:** Both mono and multi-channel audio can be used normally. Mono is often chosen as the default due to its better compatibility and superior sound focus, which typically results in clearer audio quality.

***

## Q: The function of the timbre weights parameter

**A:** The timber weights parameter is primarily used in scenarios involving the mixing of multiple `voice_ids`. Its main functions include:

* Reducing copyright risks by adjusting the weights of different `voice_ids` to create unique sound effects.
* Creating new sound styles through the blending of voices, providing more possibilities for social interactions.

In practical applications, it is recommended to perform an audio cloning after adjusting the timber weights parameter to achieve a satisfactory sound, thereby generating a new and satisfactory `voice_id`.

***

## Q: The function of the language\_boosts parameter

**A:** The primary function of the `language_boosts` parameter is to help the model more accurately recognize text and synthesize audio according to different language texts (such as "Spanish", "French", "Chinese", "Chinese,Yue", etc.).

This parameter ensures that the model does not mispronounce homophones or characters that have different pronunciations in different language contexts. Under normal circumstances, the `language_boosts` parameter does not affect the accent of the cloned voice.

***

## Q: The function of the english\_normalization parameter

The `english_normalization` parameter is used for normalizing English text. When processing English text, this parameter significantly improves the model's pronunciation of numbers and dates, reducing the likelihood of mispronunciations.

However, it is important to note that using this parameter may cause a delay in the synthesized audio duration. Additionally, if the text includes mathematical formulas, this parameter will also activate the corresponding text normalization function to ensure correct pronunciation of the formulas.

***

## Q: Can I retrieve audio from a failed stream using the trace\_id?

**A:** We do not provide a service to retrieve audio through the `trace_id` at present.

***

## Q: How to query / delete voice\_id and get public voices?

**A:** We do provide **Delete Voice API** to delete client-side `voice_ids`, and **Get Voice API** to query all available `voice_ids` under the current account. This includes system voices, clone voices, voice design voices and vocal voices from the music generation API.

***

## Q: The main application scenarios for the T2A Large v2 asynchronous ultra-long text-to-speech generation interface?

This interface supports a maximum single text input of up to **1 million characters**. Its primary application scenarios include creating audiobooks for books, allowing for the efficient utilization of system idle resources to perform asynchronous batch audio synthesis tasks.

***

## Q: What is the purpose of the data.status field within the data parameter in the Response return of the T2A v2 interface?

The `data.status` field is used to indicate the status of the streaming generation process, with the following specific meanings:

* **Status 1:** Indicates that the streaming generation process is currently in progress.
* **Status 2:** Indicates that the synthesis has completed.

***

## Q: What languages does voice cloning support?

* For the original voice to be cloned: **Any language can be used.**
* For the synthesized voice after cloning: The system supports **40 languages** as listed on the official website.

<Callout icon="lightbulb" color="#4885FF" iconType="regular">
  It is best for the original voice and the target synthesis language to be the same. If they are different, there may be an accent issue. For example, if you have Trump speak Japanese, it might have an American accent.
</Callout>

## Q: Where can I find the pricing and rate limits for older or deprecated models？

For information on legacy models, please consult our dedicated [Historical Model Pricing and Rate](/faq/history-modelinfo) page for a detailed reference on their past pricing structures and usage constraints.


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimax.io/docs/llms.txt