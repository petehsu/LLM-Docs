# Code generation

Learn how to use OpenAI Codex models to generate code.

Copy page

Writing, reviewing, editing, and answering questions about code is one of the primary use cases for OpenAI models today. This guide walks through your options for code generation.

**Codex** is OpenAI's series of AI coding tools that help developers move faster by delegating tasks to powerful cloud and local coding agents. Interact with Codex in a variety of interfaces: in your IDE, through the CLI, on web and mobile sites, or in your CI/CD pipelines with the SDK. Codex is the best way to get agentic software engineering on your projects.

**Codex models** are LLMs specifically trained at coding tasks. They power Codex, and you can use them to create coding-specific applications. For example, let your *end users* generate code.

## Get started

[![Use Codex for out-of-the-box coding agents](https://cdn.openai.com/API/docs/images/build.png)

Use Codex for out-of-the-box coding agents

Connect your codebase Codex and accelerate your projects using software engineering agents.](#use-codex)[![Integrate with coding models](https://cdn.openai.com/API/docs/images/build.png)

Integrate with coding models

Use OpenAI models in your application. Add them to a model picker, for instance.](#integrate-with-coding-models)

## Use Codex

Codex has an interface in the browser, similar to ChatGPT, where you can kick off coding tasks that run in the cloud. Visit [chatgpt.com/codex](https://chatgpt.com/codex) to use it.

Codex also has an IDE extension, CLI, and SDK to help you create coding tasks in whichever environment makes the most sense for you. For example, the SDK is useful for using Codex in CI/CD pipelines. The CLI, on the other hand, runs locally from your terminal and can read, modify, and run code on your machine.

See the [Codex docs](https://developers.openai.com/codex) for quickstarts, reference, pricing, and more information.

## Integrate with coding models

OpenAI has several models trained specifically to work with code. GPT-5.1-Codex-Max is our best agentic coding model. That said, many OpenAI models excel at writing and editing code as well as other tasks. Use a Codex model if you *only* want it for coding-related work.

Here's an example that calls GPT-5.1-Codex-Max, the model that powers Codex:

Slower, high reasoning tasks

python

```
1
2
3
4
5
6
7
8
9
10
import OpenAI from "openai";
const openai = new OpenAI();

const result = await openai.responses.create({
  model: "gpt-5.1-codex-max",
  input: "Find the null pointer exception: ...your code here...",
  reasoning: { effort: "high" },
});

console.log(result.output_text);
```

```
1
2
3
4
5
6
7
8
9
10
from openai import OpenAI
client = OpenAI()

result = client.responses.create(
    model="gpt-5.1-codex-max",
    input="Find the null pointer exception: ...your code here...",
    reasoning={ "effort": "high" },
)

print(result.output_text)
```

```
1
2
3
4
5
6
7
8
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.1-codex-max",
    "input": "Find the null pointer exception: ...your code here...",
    "reasoning": { "effort": "high" }
  }'
```

Learn more about GPT-5.1-Codex-Max in the [blog post](https://openai.com/index/gpt-5-1-codex-max/). Read the [GPT-5.1-Codex-Max prompting guide](https://cookbook.openai.com/examples/gpt-5/gpt-5-1-codex-max_prompting_guide) to start building with it.

## Next steps

* Visit the [Codex docs](https://developers.openai.com/codex) to learn what you can do with Codex, set up Codex in whichever interface you choose, or find more details.
* See the [GPT-5.1.-Codex-Max prompting guide](https://cookbook.openai.com/examples/gpt-5/gpt-5-1-codex-max_prompting_guide) for best practices on maximizing performance.
* Learn more about [GPT-5.1 and its variants](/docs/guides/latest-model).
* Visit the [GPT-5.1-Codex-Max model page](/docs/models/gpt-5.1-codex-max) to compare models.