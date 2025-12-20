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

# Fine-tuning and evaluation (Preview)

Fine-tuning is available as a limited preview. Register your interest by creating a support ticket in the [Support hub](/support).

Fine-tuning improves the performance of a pre-trained model for a particular use case, by training it on a specialized dataset. This helps in adapting general-purpose models to industry-specific or task-specific needs.Llama API offers a range of pre-trained models with different parameter sizes. Large-parameter models often perform better but take longer to generate responses and cost more than smaller models.With fine-tuning, you can optimize a smaller model to match or exceed the performance of a larger model.

## How it works

Fine-tuning involves training a pre-trained [base model](#choosing-a-base-model) on a domain-specific [dataset](#preparing-a-dataset) that you supply, then verifying the performance of the fine-tuned model by running [evaluations](#evaluation). Once the fine-tuned model meets your performance expectations, you can use it directly on Llama API, or [download your model](#downloading-a-model) and deploy it on your own infrastructure.

## When to fine-tune

Fine-tuning an 8 billion parameter Llama model has many advantages over using a larger model, including:

* •Reducing inference costs while maintaining quality
* •Increasing inference speeds for low-latency or high-throughput applications
* •Improving performance on domain-specific knowledge (e.g., legal, medical, finance), particularly if you have data that was not included in the original model training set.

## Datasets

## Preparing a dataset

A fine-tuning dataset comprises a set of prompts and responses that show the model how it should respond to requests.Your dataset should consist of several hundred examples of high-quality questions and responses in the same format used in the [chat completions](/docs/api/chat) endpoint, which is a list of messages with each message containing `role` and `content` key-values. The examples in your dataset should closely align with your targeted use case.Depending on your use case, you may want to provide [single-turn](#single-turn-datasets) or [multi-turn](#multi-turn-datasets) examples in your dataset.

## Managing datasets

Under the Datasets tab, you can manage the uploaded datasets used in fine-tuning and evaluation jobs. You can view dataset details, delete and download the dataset file there.

## Dataset format

There are some restrictions on the format of a dataset which you should follow:

* •Each example is a dictionary with a key of `messages` and a list of messages as the value.
* •Your fine-tuning dataset should have at least 10 examples, but you will likely get better results with at least several hundred examples. Data quality is more important than quantity for fine-tuning.
* •The list of messages should interleave user `messages` and `assistant` messages.
* •A `system` message is optional, but it must be the first message if it exists.
* •The list of messages must end with an `assistant` message.
* •The maximum sequence length for tokenized input list of messages is 8192 tokens, after which the input will be truncated.
* •The maximum dataset size supported for fine-tuning is 1GB.

## Dataset examples

## Single-turn datasets

A single-turn dataset can be used to train models for tasks such as a Q\&A chatbot or a classifier. The desired answer from the model is based on a system prompt and a single previous message.The input prompts will consist of a `system` message and a `user` message, and the expected output (label) will be the subsequent `assistant` message.

{"messages": [{ "role": "system", "content": "You are a helpful AI assistant. Please help answer the following question." }, { "role": "user", "content": "What's the capital of UK?" }, { "role": "assistant", "content": "London." }]}

{"messages": [{ "role": "system", "content": "You are a helpful AI assistant. Please help answer the following question." }, { "role": "user", "content": "Who is the CEO of Meta?" }, { "role": "assistant", "content": "Mark Zuckerberg" }]}

{"messages": [{ "role": "system", "content": "You are a helpful AI assistant. Please help answer the following question."},{ "role": "user", "content": "Where is the headquarter of Meta?" },{ "role": "assistant", "content": "Menlo Park" }]}

Enter to Rename, Shift+Enter to Preview

{"messages": [{ "role": "system", "content": "You are a judger to determine if the following math expression is correct or not." }, { "role": "user", "content": "1 + 1 = 2" }, { "role": "assistant", "content": "correct." }] }

{"messages": [{ "role": "system", "content": "You are a judger to determine if the following math expression is correct or not." },{ "role": "user", "content": "2 + 3 = 6" },{ "role": "assistant", "content": "wrong" }]}

{"messages": [{ "role": "system", "content": "You are a judger to determine if the following math expression is correct or not." },{ "role": "user", "content": "1+ 2 = 3" }, { "role": "assistant", "content": "correct" }]}

Enter to Rename, Shift+Enter to Preview

You can find a complete example single-turn fine-tuning dataset for a real-world tax preparation use case here: [example\_finetune\_dataset.jsonl](https://gist.github.com/SLR722/dd03fe85ab67261db1913c0441713486)

## Multi-turn datasets

A multi-turn dataset can be used to fine-tune a model that acts as a conversational chatbot, where the desired answer from the model is based on a complete conversation history.In a multi-turn dataset, you should include the entire conversation history, and the final `assistant` message will be used as the expected output (label).

{"messages": [{ "role": "system", "content": "You are a friendly chatbot." },{ "role": "user", "content": "What's the weather today?" },{ "role": "assistant", "content": "It will be raining today." }, { "role": "user", "content": "Is it suitable for hiking?" }, { "role": "assistant", "content": "Remember to bring an umbrella if you plan to hike." }]}

{"messages": [{ "role": "system", "content": "You are a friendly chatbot." },{ "role": "user", "content": "How is the stock market today?" },{ "role": "assistant", "content": "The market increased 1% today" },{ "role": "user", "content": "Then, shall I buy some stock? " },{ "role": "assistant", "content": "Sorry, I cannot provide investment suggestions" }]}

Enter to Rename, Shift+Enter to Preview

## Fine-tuning a model

## Choosing a base model

To fine-tune a model, you start by selecting a pre-trained base model. Currently one base model is available for fine-tuning: Llama 3.3 8B Instruct.

## Configuring hyperparameters

Hyperparameters are variables that are used to manage model training. You can customize the hyperparameters to tailor the training process to suit your needsBelow are the hyperparameters that you can customize for your fine-tuning job:

1. Epochs: The number of times to loop through the whole training dataset (the training data will be reshuffled after each epoch).
2. Batch size: The number of training examples within a batch to update model parameters. A larger batch size means the model parameters are updated less frequently but with lower variance.
3. Learning rate multiplier: The scaling factor for learning rate (base value is 3e-4). A larger learning rate may lead to faster convergence but can overshoot the optimal point, causing the loss to increase significantly. A smaller learning rate may lead to more stable convergence but can result in slow training or getting stuck in local minima.

## Creating a fine-tuning job

Follow the steps below to fine-tune your model:

1. In the API dashboard, go to the Fine-tuning tab to create a new fine-tuning job, or to view all the existing fine-tuning jobs under your team.
2. Click the Create button to create a new fine-tuning job. Upload your [prepared dataset](#preparing-a-dataset), or select an existing dataset for your team from the dropdown list.
3. Optionally check the Split data checkbox to automatically extract a portion of your dataset to be used for evaluation later. Selecting this option means that you don’t have to worry about separately generating an evaluation dataset.
4. Configure your fine-tuning job by specifying the base model to train, naming your job and [configuring hyperparameters](#configuring-hyperparameters).
5. Start your job. You can view the job metadata and job progress in the Job tab. You can also navigate to the Metrics tab to see the learning curve, and the Logs tab for job event logs.
6. After the job finishes, you can try out your fine-tuned model in the Playground, or evaluate it with the [evaluation flow](#evaluation).

## Using a fine-tuned model

## Using your model with Llama API

Your fine-tuned model will be available for use with Llama API, in the same way that base models are available. Simply change the model name in your API call to the name of your fine-tuned model and call the API in the same way you would for any other model.Fine-tuned models are deployed and hosted on dedicated servers which may not have the same performance optimization as the base models. You may find slightly slower response times using fine-tuned models.

If you haven’t used your model before, or haven’t used it in a while, your first API call could take up to 10 seconds while the model loads, or during periods of heavy traffic on the platform.

## Downloading a model

Your fine-tuned model can be downloaded from the fine-tuning job page and used on your own infrastructure or a cloud inference service that supports model uploads. The downloaded model will be in Hugging Face format.Follow these steps to download your model:

1. Click the three dots at the top right of the fine-tuned job page. It will show two dropdown options: Download model and Delete.
2. Click the Download model option - the Download fine-tuned model pop-up will appear with details about the file size.
3. Click the Download button to download the model.

## Deleting a model

Fine-tune jobs and their associated data and model files can be deleted from the job detail page as follows:

1. Click the three dots at the top right of the fine-tuned job page. It will show two dropdown options: Download model and Delete.
2. Click the Delete option.
3. Confirm the deletion.

## Evaluation

Evaluating a model allows you to see how well it performs against a set of evaluation criteria.

1. Click the Evaluation tab to create a new evaluation run.
2. Name your job, choose the model you want to evaluate, and select an uploaded dataset to evaluate the model against.
3. Add one or more graders that will score your model’s outputs against specific criteria, such as string-matching or semantic similarity.
4. Kick off your job, which will run batch inference to generate model outputs and grade-score them.
5. When the job completes, check out the summary of your graders. You can inspect the results in more detail.

If you have already run an evaluation job, and want to re-run new graders against the same candidate model responses. You can select a dataset tagged with (Existing Responses). This will skip batch inference on your candidate model, and re-run grading with your new grader configurations.

Was this page helpful?

[How it works](#how-it-works)

[When to fine-tune](#when-to-fine-tune)

[Datasets](#datasets)

[Fine-tuning a model](#fine-tuning-a-model)

[Using a fine-tuned model](#using-a-fine-tuned-model)

[Evaluation](#evaluation)