#### Guides

# Prompt Engineering for Grok Code Fast 1

## For developers using agentic coding tools

`grok-code-fast-1` is a lightweight agentic model which is designed to excel as your pair-programmer inside most common coding tools. To optimize your experience, we present a few guidelines so that you can fly through your day-to-day coding tasks.

### Provide the necessary context

Most coding tools will gather the necessary context for you on their own. However, it is oftentimes better to be specific by selecting the specific code you want to use as context. This allows `grok-code-fast-1` to focus on your task and prevent unnecessary deviations. Try to specify relevant file paths, project structures, or dependencies and avoid providing irrelevant context.

* No-context prompt to avoid
  > Make error handling better
* Good prompt with specified context
  > My error codes are defined in @errors.ts, can you use that as reference to add proper error handling and error codes to @sql.ts where I am making queries

### Set explicit goals and requirements

Clearly define your goals and the specific problem you want `grok-code-fast-1` to solve. Detailed and concrete queries can lead to better performance. Try to avoid vague or underspecified prompts, as they can result in suboptimal results.

* Vague prompt to avoid
  > Create a food tracker
* Good, detailed prompt
  > Create a food tracker which shows the breakdown of calorie consumption per day divided by different nutrients when I enter a food item. Make it such that I can see an overview as well as get high level trends.

### Continually refine your prompts

`grok-code-fast-1` is a highly efficient model, delivering up to 4x the speed and 1/10th the cost of other leading agentic models. This enables you to test your complex ideas at an unprecedented speed and affordability. Even if the initial output isn’t perfect, we strongly suggest taking advantage of the uniquely rapid and cost-effective iteration to refine your query—using the suggestions above (e.g., adding more context) or by referencing the specific failures from the first attempt.

* Good prompt example with refinement
  > The previous approach didn’t consider the IO heavy process which can block the main thread, we might want to run it in its own threadloop such that it does not block the event loop instead of just using the async lib version

### Assign agentic tasks

We encourage users to try `grok-code-fast-1` for agentic-style tasks rather than one-shot queries. Our Grok 4 models are more suited for one-shot Q\&A while `grok-code-fast-1` is your ideal companion for navigating large mountains of code with tools to deliver you precise answers.

A good way to think about this is:

* `grok-code-fast-1` is great at working quickly and tirelessly to find you the answer or implement the required change.
* Grok 4 is best for diving deep into complex concepts and tough debugging when you provide all the necessary context upfront.

## For developers building coding agents via the xAI API

With `grok-code-fast-1`, we wanted to bring an agentic coding model into the hands of developers. Outside of our launch partners, we welcome all developers to try out `grok-code-fast-1` in tool-call-heavy domains as the fast speed and low cost makes it both efficient and affordable for using many tools to figure out the correct answer.

As mentioned in the blog post, `grok-code-fast-1` is a reasoning model with interleaved tool-calling during its thinking. We also send summarized thinking via the OpenAI-compatible API for better UX support. More API details can be found at https://docs.x.ai/docs/guides/function-calling.

### Reasoning content

`grok-code-fast-1` is a reasoning model, and we expose its thinking trace via `chunk.choices[0].delta.reasoning_content`. Please note that the thinking traces are only accessible when using streaming mode.

### Use native tool calling

`grok-code-fast-1` offers first-party support for native tool-calling and was specifically designed with native tool-calling in mind. We encourage you to use it instead of XML-based tool-call outputs, which may hurt performance.

### Give a detailed system prompt

Be thorough and give many details in your system prompt. A well-written system prompt which describes the task, expectations, and edge-cases the model should be aware of can make a night-and-day difference. For more inspiration, refer to the User Best Practices above.

### Introduce context to the model

`grok-code-fast-1` is accustomed to seeing a lot of context in the initial user prompt. We recommend developers to use XML tags or Markdown-formatted content to mark various sections of the context and to add clarity to certain sections. Descriptive Markdown headings/XML tags and their corresponding definitions will allow `grok-code-fast-1` to use the context more effectively.

### Optimize for cache hits

Our cache hits are a big contributor to `grok-code-fast-1`’s fast inference speed. In agentic tasks where the model uses multiple tools in sequence, most of the prefix remains the same and thus is automatically retrieved from the cache to speed up inference. We recommend against changing or augmenting the prompt history, as that could lead to cache misses and therefore significantly slower inference speeds.


