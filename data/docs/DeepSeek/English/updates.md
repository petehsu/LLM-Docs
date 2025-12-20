# Change Log

On this page

# Change Log

* * *

## Date: 2025-12-01​

### DeepSeek-V3.2​

Both `deepseek-chat` and `deepseek-reasoner` have been upgraded to DeepSeek-V3.2.

  * `deepseek-chat` corresponds to DeepSeek-V3.2's **non-thinking mode**
  * `deepseek-reasoner` corresponds to DeepSeek-V3.2's **thinking mode**

### DeepSeek-V3.2-Speciale​

DeepSeek-V3.2-Speciale is served via a temporary endpoint: base_url="<https://api.deepseek.com/v3.2_speciale_expires_on_20251215>". Same pricing as V3.2, no tool calls, available until Dec 15th, 2025, 15:59 (UTC Time).

For more details, please refer to [this documentation](</news/news251201>).

* * *

## Date: 2025-09-29​

### DeepSeek-V3.2-Exp​

Both `deepseek-chat` and `deepseek-reasoner` have been upgraded to DeepSeek-V3.2-Exp.

  * `deepseek-chat` corresponds to DeepSeek-V3.2-Exp's **non-thinking mode**
  * `deepseek-reasoner` corresponds to DeepSeek-V3.2-Exp's **thinking mode**

For more details, please refer to [this documentation](</news/news250929>).

* * *

## Date: 2025-09-22​

### DeepSeek-V3.1-Terminus​

**Both`deepseek-chat` and `deepseek-reasoner` have been upgraded to DeepSeek-V3.1-Terminus.** `deepseek-chat` corresponds to DeepSeek-V3.1-Terminus's **non-thinking mode** , while `deepseek-reasoner` corresponds to its **thinking mode**.

This update maintains the model's original capabilities while addressing issues reported by users, including:

  * Language consistency: Reduced occurrences of Chinese-English mixing and occasional abnormal characters;
  * Agent capabilities: Further optimized the performance of the Code Agent and Search Agent.

* * *

## Date: 2025-08-21​

### DeepSeek-V3.1​

**Both`deepseek-chat` and `deepseek-reasoner` have been upgraded to DeepSeek-V3.1.** `deepseek-chat` corresponds to DeepSeek-V3.1's **non-thinking mode** , while `deepseek-reasoner` corresponds to its **thinking mode**.

  * Key updates in DeepSeek-V3.1:
    * **Hybrid reasoning architecture** : A single model supports both thinking mode and non-thinking mode
    * **Improved reasoning efficiency** : Compared to DeepSeek-R1-0528, DeepSeek-V3.1-Think provides answers in significantly less time
    * **Enhanced agent capabilities** : With post-training optimization, the new model achieves major improvements in tool usage and intelligent agent tasks
      * SWE-bench Verified: 66.0
      * SWE-bench Multilingual: 54.5
      * Terminal-bench: 31.3

* * *

## Date: 2025-05-28​

### deepseek-reasoner​

**`deepseek-reasoner` Model Upgraded to DeepSeek-R1-0528:**

  * **Enhanced Reasoning Capabilities**
    * Significant benchmark improvements (Pass@1)
      * AIME 2025: 70.0 → 87.5 (+17.5)
      * GPQA: 71.5 → 81.0 (+9.5)
      * LCB_v6: 63.5 → 73.3 (+9.8)
      * Aider: 57.0 → 71.6 (+14.6)
    * Note: Complex reasoning tasks may consume more tokens compared to legacy R1 version.
  * **Optimized Front-end Development**
    * Generated web pages and games now feature improved aesthetics.
  * **Reduced Hallucinations**
    * Significantly suppressed hallucination issues present in legacy R1 version.
  * **JSON Output & Function Calling Support**
    * Function call performance:
      * Tau-bench score: 53.5 (Airline) / 63.9 (Retail)

* * *

## Date: 2025-03-24​

### deepseek-chat​

**`deepseek-chat` Model Upgraded to DeepSeek-V3-0324:**

  * **Enhanced Reasoning Capabilities**

    * Significant improvements in benchmark performance:
      * MMLU-Pro: 75.9 → 81.2 (+5.3)
      * GPQA: 59.1 → 68.4 (+9.3)
      * AIME: 39.6 → 59.4 (+19.8)
      * LiveCodeBench: 39.2 → 49.2 (+10.0)
  * **Optimized Front-End Web Development**

    * Improved accuracy in code generation
    * More aesthetically pleasing web pages and game front-ends
  * **Upgraded Chinese Writing Proficiency**

    * Enhanced style and content quality:
      * Aligned with the R1 writing style
      * Better quality in medium-to-long-form writing
  * **Feature Enhancements**

    * Improved multi-turn interactive rewriting
    * Optimized translation quality and letter writing
  * **Improved Chinese Search Capabilities**

    * Enhanced report analysis requests with more detailed outputs
  * **Function Calling Improvements**

    * Increased accuracy in Function Calling, fixing issues from previous V3 versions

* * *

## Date: 2025-01-20​

### deepseek-reasoner​

  * `deepseek-reasoner` is our new model DeepSeek-R1. You can invoke DeepSeek-V3 by specifying `model='deepseek-reasoner'`.
  * For details, please refer to: [DeepSeek-R1 Release](</news/news250120>)
  * For guides, please refer to: [Thinking Mode](</guides/thinking_mode>)

* * *

## Date: 2024-12-26​

### deepseek-chat​

  * The `deepseek-chat` model has been upgraded to DeepSeek-V3. The API remains unchanged. You can invoke DeepSeek-V3 by specifying `model='deepseek-chat'`.
  * For details, please refer to: [introducing DeepSeek-V3](</news/news1226>)

* * *

## Date: 2024-12-10​

### deepseek-chat​

The deepseek-chat model has been upgraded to **DeepSeek-V2.5-1210** , with improvements across various capabilities. Relevant benchmarking results include:

  * Mathematical: Performance on the MATH-500 benchmark has improved from 74.8% to 82.8% .
  * Coding: Accuracy on the LiveCodebench (08.01 - 12.01) benchmark has increased from 29.2% to 34.38% .
  * Writing and Reasoning: Corresponding improvements have been observed in internal test datasets.

Additionally, the new version of the model has optimized the user experience for file upload and webpage summarization functionalities.

* * *

## Date: 2024-09-05​

### `deepseek-coder` & `deepseek-chat` Upgraded to DeepSeek V2.5 Model​

The DeepSeek V2 Chat and DeepSeek Coder V2 models have been merged and upgraded into the new model, DeepSeek V2.5.

For backward compatibility, API users can access the new model through either `deepseek-coder` or `deepseek-chat`.

The new model significantly surpasses the previous versions in both general capabilities and code abilities.

**The new model better aligns with human preferences and has been optimized in various areas such as writing tasks and instruction following:**

  * ArenaHard win rate improved from 68.3% to 76.3%
  * AlpacaEval 2.0 LC win rate increased from 46.61% to 50.52%
  * MT-Bench score rose from 8.84 to 9.02
  * AlignBench score increased from 7.88 to 8.04

**The new model has further enhanced its code generation capabilities based on the original Coder model, optimized for common programming application scenarios, and achieved the following results on the standard test set:**

  * HumanEval: 89%
  * LiveCodeBench (January-September): 41%

* * *

## Date: 2024-08-02​

### API Launches Context Caching on Disk Technology​

The DeepSeek API has innovatively adopted hard disk caching, reducing prices by another order of magnitude.

For more details on the update, please refer to the documentation [Context Caching is Available 2024/08/02](</news/news0802>).

* * *

## Date: 2024-07-25​

### New API Features​

  * **Update API /chat/completions**
    * JSON Mode
    * Function Calling
    * Chat Prefix Completion（Beta）
    * 8K `max_tokens`（Beta）
  * **New API /completions**
    * FIM Completion（Beta）

For more details, please check the documentation [New API Features 2024/07/25](</news/news0725>)

* * *

## Date: 2024-07-24​

### deepseek-coder​

The `deepseek-coder` model has been upgraded to DeepSeek-Coder-V2-0724.

* * *

## Date: 2024-06-28​

### deepseek-chat​

The `deepseek-chat` model has been upgraded to DeepSeek-V2-0628.

Model's reasoning capabilities have improved, as shown in relevant benchmarks:

  * Coding: HumanEval Pass@1 79.88% -> 84.76%
  * Mathematics: MATH ACC@1 55.02% -> 71.02%
  * Reasoning: BBH 78.56% -> 83.40%

In the Arena-Hard evaluation, the win rate against GPT-4-0314 increased from 41.6% to 68.3%.

The model's role-playing capabilities have significantly enhanced, allowing it to act as different characters as requested during conversations.

* * *

## Date: 2024-06-14​

### deepseek-coder​

The `deepseek-coder` model has been upgraded to DeepSeek-Coder-V2-0614, significantly enhancing its coding capabilities. It has reached the level of GPT-4-Turbo-0409 in code generation, code understanding, code debugging, and code completion. Additionally, it possesses excellent mathematical and reasoning abilities, and its general capabilities are on par with DeepSeek-V2-0517.

* * *

## Date: 2024-05-17​

### deepseek-chat​

The `deepseek-chat` model has been upgraded to DeepSeek-V2-0517. The model has seen a significant improvement in following instructions, with the IFEval Benchmark Prompt-Level accuracy jumping from 63.9% to 77.6%. Additionally, on API end, we have optimized model ability to follow instruction filled in the ``system" part. This optimization has significantly elevated the user experience across a variety of tasks, including immersive translation, Retrieval-Augmented Generation (RAG), and more.

The model's accuracy in outputting JSON format has been enhanced. In our internal test set, the JSON parsing rate increased from 78% to 85%. By introducing appropriate regular expressions, the JSON parsing rate was further improved to 97%.