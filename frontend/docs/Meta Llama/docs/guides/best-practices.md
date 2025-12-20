# Llama API

Documentation

Log in

Search

## Get started

[Overview](/docs/overview)

[Quickstart](/docs/quickstart)

## Essentials

[Models](/docs/models)

[API keys](/docs/api-keys)

[SDKs & libraries](/docs/sdks)

[Rate limits](/docs/rate-limits)

## Features

[Chat completion](/docs/features/chat-completion)

[Image understanding](/docs/features/image-understanding)

[Structured output](/docs/features/structured-output)

[Tool calling](/docs/features/tool-calling)

[OpenAI compatibility](/docs/features/compatibility)

[Moderation](/docs/features/moderation)

[Fine-tuning & evaluation](/docs/features/fine-tuning)

## Guides

[Chat & conversation](/docs/guides/chat-guide)

[Tool calling](/docs/guides/tool-guide)

[Moderation & security](/docs/guides/moderation-guide)

[Best practices](/docs/guides/best-practices)

## API reference

[Chat completion](/docs/api/chat)

[Models](/docs/api/models)

[Moderations](/docs/api/moderations)

## Resources

[Data commitments](/docs/trust/data-commitments)

[Legal](/legal)

# Best practices

## Overview

The language models available on Llama API are powerful and flexible tools. These guidelines will help you get the most out of Llama API and avoid common pitfalls when working with models.

## Prompting

## Write clear instructions

The most critical thing to keep in mind when working with models is to ask for exactly what you want.If you want the output formatted in a specific way, or if you want the model to exclude certain topics in its answer, include this information in your prompt using clear and unambiguous language. For instance, instead of "what cities are near bodies of water?", ask "give me 10 cities near bodies of water, formatted in a table with their populations, countries, and areas".If you want a shorter or longer response, simply request it. If you don't provide enough information, the model will do its best to guess what you want, but the more specific you are, the more likely you'll get exactly what you're looking for.

## Provide examples and context

Providing several good examples can significantly enhance model performance for most tasks. Referred to as few-shot or in-context learning, this allows the model to understand your specific task without having to modify the model itself.When providing examples, select ones that cover a wide variety of cases, rather than similar examples. Think of it as teaching a student, where each example should demonstrate something new.You can also provide relevant reference information in the prompt. If you want the model to base its answer on existing information, include that information alongside your query, either in the system prompt or the user text. For example, you might want to classify which company project a meeting belongs to based on the meeting title and description, but meeting titles and descriptions alone are often insufficient for an accurate classification. Include a list of projects and their descriptions in the prompt, then ask the system to use that information to make a determination.

System: You are a helpful assistant that can determine which project a meeting belongs to based on the meeting title and description.

Marketing Project Examples: {examples}

Sales Project Examples: {examples}

Engineering Project Examples: {examples}

User: Project 'Sunshine' budget meeting for the month of March

Assistant: Marketing Project

Enter to Rename, Shift+Enter to Preview

## Simplify the task

Breaking complex tasks into simpler steps improves a model’s ability to complete tasks successfully. Use the output from a previous response as input to the next one—chat completions make it easy to maintain state across responses.Consider the task of determining if a message is appropriate for a forum thread. Break this down into two simpler tasks:

1. Determine if the message is obviously spam or offensive.
2. Determine if the message is on-topic.

System: You are a helpful assistant that can determine if a message is appropriate for a given forum thread. First, determine if a given message should be automatically removed from the thread—anything offensive or obviously spam should be removed. In this case, end your response with "REMOVE". If the message is not offensive or spam, then reason about whether the message is on-topic for the thread. If it is on-topic, respond with "on-topic". If it is off-topic, respond with "off-topic".

User: Forum thread: {thread}

Message: {message}

Assistant: The message is advertising a product and has a link to the user's affiliate link. This is spam and should be removed. REMOVE.

Enter to Rename, Shift+Enter to Preview

By reasoning about the task this way, you break it down into two simpler tasks that are easier for the model to handle, and also short-circuit the task if the message is obviously spam or offensive, saving tokens and improving latency.

## Allow the model to think

When a task requires problem solving or reasoning, allowing the model to think via chain-of-thought prompting improves results. Chain-of-thought prompting encourages the AI to reason step by step about the problem, which usually leads to more accurate outcomes.Chain-of-thought prompting is useful for:

* •Logic, mathematics, coding, or reasoning problems
* •When the model must narrow down several possible responses to a single Answering
* •When a specific and complex output structure is necessary
* •For debugging or understanding where the model is making mistakes

In some cases, such as simple fact recall, editing/revising existing text, or creative tasks, chain of thought may not be necessary. Introducing it may simply introduce additional unnecessary token generation that will add to your cost and latency. As general guidance, try writing your query without having the model think, and then introduce thinking if you find you need better results.Without thinking:

User: I am driving from New York to Chicago, which is an 800 mile drive. I leave at 6am. I initially get caught in traffic and drive for an hour going 30 mph, then I drive another 3 hours going 80 mph. Then I take a 30 minute stop, followed by another 3 hours going 75 mph. If I drive at 70 mph the rest of the drive, what time will I arrive? Just give me your answer.

Assistant: You will arrive at 6:51 PM.

Enter to Rename, Shift+Enter to Preview

With thinking:

User: I am driving from New York to Chicago, which is an 800 mile drive. I leave at 6am. I initially get caught in traffic and drive for an hour going 30 mph, then I drive another 3 hours going 80 mph. Then I take a 30 minute stop, followed by another 3 hours going 75 mph. If I drive at 70 mph the rest of the drive, what time will I arrive? Reason out your answer step by step.

Assistant: To determine the arrival time, let's break down the drive into segments and calculate the distance covered and time taken for each segment.

First segment: 1 hour at 30 mph

Distance = Speed × Time = 30 mph × 1 hour = 30 miles

Time taken = 1 hour

Current time = 6am + 1 hour = 7am

Second segment: 3 hours at 80 mph

Distance = Speed × Time = 80 mph × 3 hours = 240 miles

Time taken = 3 hours

Current time = 7am + 3 hours = 10am

Total distance covered so far = 30 miles + 240 miles = 270 miles

30-minute stop

Current time = 10am + 0.5 hours = 10:30am

No distance covered during the stop.

Third segment: 3 hours at 75 mph

Distance = Speed × Time = 75 mph × 3 hours = 225 miles

Time taken = 3 hours

Current time = 10:30am + 3 hours = 1:30pm

Total distance covered so far = 270 miles + 225 miles = 495 miles

Remaining distance at 70 mph

Total distance to be covered = 800 miles

Distance covered so far = 495 miles

Remaining distance = 800 miles - 495 miles = 305 miles

Time taken to cover the remaining distance = Distance / Speed = 305 miles / 70 mph = 4.36 hours (approximately)

Current time = 1:30pm

Time taken for the remaining distance = 4.36 hours

Arrival time = 1:30pm + 4.36 hours ≈ 5:54pm

So, you will arrive in Chicago at approximately 5:54pm.

Enter to Rename, Shift+Enter to Preview

## Let the model call for help

Large language models are not necessarily strong at all tasks. To supplement the limitations of LLMs, allow the system to use external tools instead of requiring the model to provide an answer it may not be confident about. For example, complex arithmetic is challenging for LLMs (and humans), but trivial for a simple calculator. Providing a calculator to the model via [tool calling](/docs/features/tool-calling) dramatically improves the system's overall accuracy.

## Model selection

## Choosing important criteria

When selecting a model for a task, you typically balance cost against capabilities. Smaller models cost less and run faster, but may offer unacceptably low performance depending on the task. Best practice dictates first understanding accuracy or quality requirements, then working from there to reach your cost targets. It's difficult to understand if a model solves your problem without seeing performance on a representative amount of real-world data. Simply trying a few example queries provides insufficient insight on how the model will perform on a full-sized workload.Before running experiments, document the rough requirements for both cost and accuracy. Determine what an acceptable performance number looks like based on the task. Often, you can relax accuracy requirements by making small changes to the overall product or system outside of the AI service. For example, instead of automatically routing a user to a specific customer service agent, prompt the user with "based on your problem, it's recommended you chat with {service department}, if this seems wrong click here".

## Solve your task

Once you understand your system requirements, develop a small evaluation dataset to capture the performance of different models on your task. Using the most powerful model available, test a variety of prompts and see if you reach the desired accuracy. Experiment with providing a variety of examples to the model in a few-shot setting. If successful, move on to optimization. If you cannot reach your targets using the most powerful model, consider:

* •If you need to provide more than a few dozen examples, you can use fine tuning to adjust the actual weights of the model. While this requires more up-front work compared to simply providing examples, performance typically will be better and costs will be lower.
* •Use techniques like [tool calling](/docs/features/tool-calling) or retrieval-augmented generation to assist the model in retrieving the relevant information it needs to answer your query.

## Optimize for cost and run-time

After you have a model and prompt setup that works for your use case, optimize for cost and run-time. Starting from the larger model, use smaller and smaller models to determine at which point the model becomes too small to perform your task well. If you still need a less expensive or faster model, you have several options:

1. Continue to iterate your prompting setup with more examples. If you are close to your targets, this is a great choice.
2. Minimize your required tokens, especially output tokens. For example, ask the model to be more terse.
3. Split up or simplify your task to something the smaller model can complete effectively.
4. Distill a smaller model by collecting responses from the larger one and fine-tuning the smaller.

## Evaluation

## The importance of evaluation

Evaluating and understanding a model's performance on your task is critically important for making improvements or avoiding failures. As the saying goes, you can't improve what you don't measure, and for model performance this is especially true. However, setting up a robust assessment system can appear simpler than it actually is, so spend time and effort on evaluation from the start.

## Choosing an evaluation target

Before getting started, think about what types of behavior you want the model to exhibit. Specifying the inputs and expected outputs is critical, as is determining whether a response should be considered correct or not. If you're having trouble writing out or explaining any of these things, your problem likely isn't well defined, which will make evaluation difficult. Depending on your success criteria for the model's output, select one or more metrics to measure. Some example metrics:

* •Accuracy: Useful for a question with an obvious, correct answer. For example, to evaluate "determine which language this text is in".
* •Mean Opinion Score: Useful for generated output that depends on human preferences. For example, to evaluate "tell me a joke about dogs".
* •Response Length: Helpful to understand if an answer is too long or short. For example, to evaluate "summarize this novel".

## Selecting data to evaluate on

Next, select test data to evaluate your model. Selecting good test data is challenging, and you should expect to iterate on your test set as you find examples from the real world that were not previously accounted for in testing. Make your test data as representative as possible of the data you will see in the real world. Consider these points as you collect or aggregate your test data:

* •Ensure your data is representative and unbiased. For example, in a dataset of news articles, are they all from the same publisher?
* •Think about how well your dataset covers what you expect to see in the real world and what might be missing. For example, in a dataset of customer service requests, are you missing a specific language?
* •If your model is fine-tuned, do not use the same data for evaluation that you used for fine-tuning. See the [how-to guide on validation](https://www.llama.com/docs/how-to-guides/validation/) for more details.

For some problems, you may find existing datasets that match your use case, or you may need to build your own dataset from scratch. In either case, thoroughly understand what is in your dataset by exploring samples manually and ensuring it meets your expectations and assumptions.

## Scalability & performance

## Latency

Model response time is characterized by two numbers:

* •Time to first token: The time before any initial tokens are generated. The lower this time, the more responsive the model feels, even if subsequent token streaming takes longer.
* •Total runtime: The time to generate the entire response, including all tokens. This number may matter more or less depending on your use case.

The first factor in latency is typically model size—smaller models are both faster to first token and have a lower total runtime. If you can use a smaller model, you will nearly always see a reduction in latency.For a given model size, the largest contributor to latency is the total output tokens generated, as additional output tokens require additional runs of the model. If you are looking to reduce total runtime, this is almost always the first place to focus. Simply asking the model to be more terse in its reply can save seconds of runtime. While input tokens do matter (and tend to matter more for time to first token), they are less important for total runtime.

## Parallelization

In some scenarios, parallelization improves the total runtime for your task. For batch tasks, distributing the job across multiple API calls results in a speedup. Less obviously, you can parallelize a single request by breaking up the task into smaller parts. For instance, if you want to generate 5 different example documents, you can simply generate them in parallel. Sometimes you can do part of the task in parallel—for example, OCR a set of documents in parallel and then analyze the combined data in a single request.

## Moderation

## Automated moderation

Llama has been trained with safety in mind, and by default it attempts to avoid generating harmful content. However, various contexts have different requirements for safety, and you may need additional or different protection. Use the [moderations endpoint](/docs/api/moderations) to automatically moderate problematic content.

## System prompts

The system prompt is a useful mechanism for guiding Llama's output, and in many cases can constrain the AI to avoid certain topics or styles that may be inappropriate to your use case. However, do not rely on the system prompt to protect against unsafe outputs, as it is nearly always possible to convince the model to work around these constraints. Consider the system prompt one tool at your disposal to control the model's output. If it is critical not to output certain words or phrases, add hard-coded checks after the model finishes running. Additionally, do not consider your system prompt safely hidden, as it's typically possible to get a model to output its system prompt with adversarial techniques. Do not include sensitive or confidential information in your system prompt.

## Designing for mistakes

Like all generative models (and humans), Llama sometimes makes mistakes. It is critical that your system is designed with this fact in mind. Relying on perfect or near perfect model outputs will only result in undesired outcomes. Instead, design your system to be robust to some amount of error.For example, instead of directly using the model's output to make a decision, present a confirmation to the user with the decision to be executed. You may warn users that the model's output may be incorrect, or may contain surprising or confusing text. It can also be beneficial to offer users the ability to give feedback on incorrect model outputs, both informing the user that mistakes can happen and also providing you with valuable data to improve your model in the future.

## Adversarial testing

Actively test your system's ability to stay well behaved under pressure. Adversarial testing (or red teaming, in the security industry) attempts to deliberately produce incorrect outputs, bypass filters, or otherwise "break" your model. You can pretend to be a user and enter invalid or confusing input, or you can pretend to be a bad actor who is looking to misuse your model for profit. Often adversarial prompts, such as those that cause the model to ignore instructions, are saved and reused for regression testing to ensure the failures don't reoccur.

Was this page helpful?

[Overview](#overview)

[Prompting](#prompting)

[Model selection](#model-selection)

[Evaluation](#evaluation)

[Scalability & performance](#scalability-&-performance)

[Moderation](#moderation)