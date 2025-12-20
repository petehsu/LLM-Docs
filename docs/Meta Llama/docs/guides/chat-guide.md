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

# Chat and conversation with Llama API

This tutorial introduces you to building conversational applications and question answering systems using Llama API. You will learn the core concepts behind conversational AI and how to implement them effectively for your projects.

## Understanding chat completion

Llama API offers a chat completion endpoint that enables you to build sophisticated conversational interfaces. Chat completion is a fundamental capability of large language models (LLMs) that enables natural, interactive conversations. Unlike simple text completion, chat completion maintains the context of a conversation over multiple turns, enabling responses that are more coherent and contextually relevant. The endpoint accepts a sequence of messages, each with a designated role (system, user, or assistant), and generates appropriate responses based on this conversation history.

## System messages

System messages provide high-level instructions to the model about how it should behave throughout the conversation. These messages guide the model's overall behavior, tone, and capabilities. For example, you may instruct the model to act as a helpful customer service agent, a language tutor, or a specialized domain expert.

## User and assistant messages

User messages represent inputs from your application's users, while assistant messages represent the model's previous responses. By maintaining this sequence of messages, the model can track the conversation flow and generate contextually appropriate responses.

## Building conversational applications

## Prerequisites

Before you begin, ensure you have:

* •A valid Llama API key
* •Python 3.7 or higher

## Setting up your environment

To make API calls, you will need to set up authentication using your Llama API key, which you will store in an environment variable for now.Set up your Python environment for making API calls as shown below:

Python

1

2

3

4

5

6

7

8

9

import json

import os

import requests

# Load API key from environment variable; this should be set in advance

LLAMA\_API\_KEY = os.environ.get('LLAMA\_API\_KEY')

# Define the base URL

BASE\_URL = "https://api.llama.com/v1"

Enter to Rename, Shift+Enter to Preview

API keys should be handled securely. Avoid hard-coding them in your application. See [API keys](/docs/api-keys) for more information on how to handle keys in production code.

## Discovering available models

Llama API offers a range of [models](/docs/models), each with different capabilities, context lengths, and performance characteristics. Before getting started on your application, you should explore the available models and choose those that best fit your needs. In some use cases, deploying multiple models in tandem can be optimal - using powerful models for task-planning tasks and lighter models for executing on them.Different models offer trade-offs between response quality, latency, and cost. Smaller models typically respond faster and cost less, while larger models often produce higher quality responses, especially for complex tasks or specialized domains.The easiest way to explore available models is through the [API Playground](/playground), where you can test different models interactively. Alternatively, you can query the [models endpoint](/docs/api/models) to retrieve a list of available models:

Python

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

11

12

def get\_available\_models():

headers = {

"Authorization": f"Bearer {LLAMA\_API\_KEY}"

}

response = requests.get(f"{BASE\_URL}/models", headers=headers)

return response.json()

# Get and display available models

models = get\_available\_models()

for model in models.get("data", []):

print(f"Model ID: {model['id']}, Owner: {model['owned\_by']}")

Enter to Rename, Shift+Enter to Preview

## Creating a simple conversation

A conversational application comprises two main components: a way to specify prompts to the model and a way to process and display responses from the model.The simplest conversation consists of just two inputs: a system prompt that defines the model's behavior and a user message containing a query. While basic, this pattern serves as the foundation for more complex conversational applications.When making a chat completion request, you will need to specify two parameters:

* •`model`: The specific model variant to use
* •`messages`: An array of messages that contain user, system or assistant text

Additional parameters can be specified as listed in the [chat completion API reference](/docs/api/chat) page.Implement a basic conversation as follows:

Python

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

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

def chat\_completion(messages, model="Llama-3.3-8B-Instruct", max\_tokens=256):

headers = {

"Content-Type": "application/json",

"Authorization": f"Bearer {LLAMA\_API\_KEY}"

}

payload = {

"messages": messages,

"model": model,

"max\_tokens": max\_tokens,

"stream": False

}

response = requests.post(

f"{BASE\_URL}/chat/completions",

headers=headers,

json=payload

)

return response.json()

# Example conversation

messages = [

{"role": "system", "content": "You are a helpful assistant that provides concise answers."},

{"role": "user", "content": "What is the capital of France?"}

]

response = chat\_completion(messages)

print(json.dumps(response, indent=2))

Enter to Rename, Shift+Enter to Preview

The system message isn't actually required here, but it is often useful to give the model guidance that informs how it should respond to the user's message.

## Building multi-turn conversations

Real-world conversational applications typically involve multiple turns of dialogue between the user and the assistant. To create a conversation that flows naturally, you need to maintain the conversation history across these interactions.Building on the `chat_completion` function defined above, when a user sends a message, you append it to the conversation history and send the entire history to the model. When the model responds, you append its response to the history as well. This approach ensures that the model can use the full context of the conversation to generate a response.A multi-turn conversation requires a more complex implementation in order to maintain conversation state between user interactions and correctly format and organize message history.Here is an implementation of a simple loop that handles conversation state:

Python

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

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

def conversation\_loop(system\_prompt):

# Initialize conversation history with system prompt

conversation = [

{"role": "system", "content": system\_prompt}

]

while True:

# Get user input

user\_input = input("\nYou: ").strip()

if(len(user\_input) == 0):

break

# Display user input

print(f"\nYou: {user\_input}")

# Add user message to conversation

conversation.append({"role": "user", "content": user\_input})

# Get response from API

response = chat\_completion(conversation)

try:

# Extract assistant's message

assistant\_content = response["completion\_message"]["content"]["text"]

assistant\_stop\_reason = response["completion\_message"]["stop\_reason"]

# Display response

print(f"\nAssistant: {assistant\_content}")

# Add assistant's response to conversation history

conversation.append({

"role": "assistant",

"content": assistant\_content,

"stop\_reason": assistant\_stop\_reason

})

except KeyError as e:

print(f"Error parsing response: {e}")

print(f"Raw response: {response}")

# Start conversation with a specific system prompt

conversation\_loop("You are an expert chef who gives brief, practical cooking advice.")

Enter to Rename, Shift+Enter to Preview

## Memory management for extended conversations

Using conversation history ensures that a model can refer back to previous exchanges when generating a response. However, as conversations continue, the history size grows, potentially leading to several important challenges, including:

* •Token limits: All language models have a maximum context length (token limit) they can process. You can view Llama's token limits in the [model documentation on llama.com](https://www.llama.com/docs/model-cards-and-prompt-formats). Once your conversation history exceeds this limit, the model will no longer be able to process the entire conversation, leading to errors or truncated context.
* •Cost considerations: Longer prompts consume more tokens, which typically translates to higher API costs. Managing conversation length can help keep costs down
* •Latency and responsiveness: Longer prompts can increase the time it takes for the model to generate a response, potentially leading to a less responsive user experience

To address these challenges, you can implement a sliding window approach to conversation history, which involves:

1. Setting a maximum number of messages to retain in the history.
2. Always keeping the system message to maintain consistent behavior.
3. Retaining only the most recent N messages when the history exceeds the limit.

This strategy ensures that your conversations remain within token limits while preserving the most relevant context for generating responses, and is particularly valuable for long-running conversations or applications where users may engage in extended dialogues.Here is how to implement a conversation loop with memory management:

Python

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

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

def managed\_conversation\_loop(system\_prompt, max\_history=10):

# Initialize conversation history with system prompt

conversation = [

{"role": "system", "content": system\_prompt}

]

while True:

# Get user input

user\_input = input("\nYou: ").strip()

if(len(user\_input) == 0):

break

# Display user input

print(f"\nYou: {user\_input}")

# Add user message to conversation

conversation.append({"role": "user", "content": user\_input})

# Manage conversation length by keeping only recent messages

if len(conversation) > max\_history:

# Always keep system prompt (index 0)

conversation\_window = conversation[-(max\_history):]

conversation = [conversation[0]] + conversation\_window

print(f"Conversation length: {len(conversation)}")

# Get response from API

response = chat\_completion(conversation)

try:

# Extract assistant's message

assistant\_content = response["completion\_message"]["content"]["text"]

assistant\_stop\_reason = response["completion\_message"]["stop\_reason"]

# Display response

print(f"\nAssistant: {assistant\_content}")

# Add assistant's response to conversation history

conversation.append({

"role": "assistant",

"content": assistant\_content,

"stop\_reason": assistant\_stop\_reason

})

except KeyError as e:

print(f"Error parsing response: {e}")

print(f"Raw response: {response}")

# Start conversation with memory management

managed\_conversation\_loop("You are a helpful assistant.", max\_history=10)

Enter to Rename, Shift+Enter to Preview

For more sophisticated applications, you may consider more advanced memory management strategies:

* •Selective retention: Keep important messages based on relevance rather than just recency
* •Summarization: Periodically summarize older parts of the conversation to preserve their semantic content while reducing token count
* •Hierarchical memory: Maintain different levels of memory (e.g., short-term and long-term) with different retention policies

## Enhancing user experience with streaming responses

Traditional request-response patterns can lead to noticeable latency in conversational applications, especially when generating longer responses. Users must wait for the complete response to be generated before seeing any output, which can create a less natural conversation experience.Streaming offers a solution to this problem by delivering the model's response in real-time as it is being generated, token-by-token. This approach brings several benefits:

* •Improved perceived responsiveness: Users see the beginning of the response immediately, making the interaction feel more responsive
* •More natural conversation flow: The gradual appearance of text mimics human typing, creating a more natural dialogue experience
* •Earlier user processing: Users can begin reading and processing the response before it has completed

Llama API supports streaming through Server-Sent Events (SSE), an approach that allows the server to push updates to the client as they become available.To implement streaming, you will need to:

1. Set the `stream` parameter to `true` in your API request.
2. Process the stream of events from the API response.
3. Extract and display each token as it arrives.

Implement streaming chat completions as follows:

Python

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

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

import json

import os

import requests

# Load API key from environment variable; this should be set in advance

LLAMA\_API\_KEY = os.environ.get('LLAMA\_API\_KEY')

# Define the base URL

BASE\_URL = "https://api.llama.com/v1"

# Headers and payload setup

headers = {

"Content-Type": "application/json",

"Authorization": f"Bearer {LLAMA\_API\_KEY}",

"Accept": "text/event-stream"

}

payload = {

"model": "Llama-3.3-8B-Instruct",

"messages": [

{"role": "system", "content": "You are a helpful assistant."},

{"role": "user", "content": "Hello, how are you?"}

],

"stream": True

}

# Send the request

response = requests.post(

f"{BASE\_URL}/chat/completions",

headers=headers,

json=payload,

stream=True

)

# Collect and process the full response

full\_response = ""

for chunk in response.iter\_lines():

if chunk:

try:

# Decode the chunk and parse JSON

# The first 6 characters are "data: ", so we skip them

# to get the actual JSON data

# Note: The response may not always be valid JSON, so we handle that

decoded\_chunk = chunk.decode("utf-8")[6:]

data = json.loads(decoded\_chunk)

if "event" in data:

if data["event"]["event\_type"] == "progress":

token = data["event"]["delta"]["text"]

full\_response += token

print(token, end="", flush=True)

elif data["event"]["event\_type"] == "complete":

break

except json.JSONDecodeError as e:

print("JSONDecodeError", e)

Enter to Rename, Shift+Enter to Preview

## Summarization and Q&A systems

## Understanding text summarization

Text summarization is the process of condensing a source text into a shorter version while preserving key information and the overall meaning. When using language models like Llama for summarization, you are leveraging their ability to understand context and identify the most salient points in a document.There are two primary approaches to summarization:

1. Extractive summarization: Identifying and directly extracting the most important sentences or phrases from the original text
2. Abstractive summarization: Generating new text that captures the essence of the original content, potentially using different phrasing

Effective summarization has numerous applications:

* •Condensing lengthy articles, reports, or documentation
* •Creating executive summaries of business documents
* •Generating content previews or snippets
* •Distilling key points from meeting transcripts or conversations

Implement a basic text summarization function using the chat completion endpoint:

Python

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

11

12

13

14

15

16

17

18

19

20

21

22

23

def summarize\_text(text, model="Llama-3.3-8B-Instruct", max\_tokens=150):

messages = [

{"role": "system", "content": "You are a summarization assistant. Create concise summaries that capture the key points of the provided text."},

{"role": "user", "content": f"Summarize the following text in a concise manner:\n\n{text}"}

]

response = chat\_completion(messages, model=model, max\_tokens=max\_tokens)

try:

assistant\_message = response["completion\_message"]

summary = assistant\_message["content"]["text"] if isinstance(assistant\_message["content"], dict) else assistant\_message["content"]

return summary

except KeyError as e:

print(f"Error parsing response: {e}")

return None

# Example usage

long\_text = """

Climate change is one of the most pressing challenges of our time. It refers to long-term shifts in temperatures and weather patterns, mainly caused by human activities, especially the burning of fossil fuels. These activities produce heat-trapping gases such as carbon dioxide, methane, and nitrous oxide, which warm the Earth's surface. The effects of climate change include rising sea levels, extreme weather events, biodiversity loss, and threats to food security. Addressing climate change requires both mitigation strategies to reduce greenhouse gas emissions and adaptation measures to adjust to the changes that are already occurring.

"""

summary = summarize\_text(long\_text)

print(f"Summary: {summary}")

Enter to Rename, Shift+Enter to Preview

## Customizing summarization with specific instructions

Rather than requiring specialized parameters or configurations, you can simply describe the type of summary you want in plain language.This approach, often called prompt engineering, allows you to control various aspects of the summary:

* •Length and verbosity: Request summaries of specific lengths or word counts
* •Format and structure: Specify the desired format (bullet points, paragraphs, etc.)
* •Focus and perspective: Direct the model to emphasize particular aspects or themes
* •Tone and style: Request summaries with specific tones (formal, conversational, etc.)

By providing clear, specific instructions, you can tailor the summarization process to your exact needs without having to change the underlying code.Implement a customizable summarization function:

Python

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

11

12

13

14

15

16

17

18

19

20

def custom\_summarize(text, instruction, model="Llama-3.3-8B-Instruct", max\_tokens=200):

messages = [

{"role": "system", "content": "You are a summarization assistant. Create concise summaries that capture the key points of the provided text."},

{"role": "user", "content": f"{instruction}\n\nText to process:\n{text}"}

]

response = chat\_completion(messages, model=model, max\_tokens=max\_tokens)

try:

assistant\_message = response["completion\_message"]

result = assistant\_message["content"]["text"] if isinstance(assistant\_message["content"], dict) else assistant\_message["content"]

return result

except KeyError as e:

print(f"Error parsing response: {e}")

return None

# Example usage

instruction = "Summarize the following text in 3 bullet points focusing on solutions mentioned."

custom\_result = custom\_summarize(long\_text, instruction)

print(f"Summary: {custom\_result}")

Enter to Rename, Shift+Enter to Preview

## Building question-answering systems

Question-answering (Q&A) systems allow users to query a body of information using natural language questions and receive precise answers. Unlike traditional search engines that return documents or links, Q&A systems aim to provide direct, concise answers to specific questions.The core principle behind Q&A systems is context-based inference, which is the ability to extract relevant information from a provided context and formulate an appropriate response to a query. This approach is particularly valuable when:

* •Users need specific facts rather than general information.
* •The information source is lengthy or complex.
* •Quick, precise answers are required without extensive reading.

When implementing a Q&A system with Llama API, you will typically provide:

1. A context document containing relevant information.
2. A specific question to be answered.
3. Instructions for how the model should approach the question.

It is important to instruct the model to rely solely on the provided context rather than its general knowledge, especially for specialized domains or when factual accuracy is critical. It is often good practice to set the system message to explicitly instruct the model to use only the provided context.Implement a basic Q&A function:

Python

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

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

def answer\_question(context, question, model="Llama-3.3-8B-Instruct", max\_tokens=150):

messages = [

{"role": "system", "content": "You are a precise question-answering assistant. When answering questions, use only the information provided in the context. If the answer cannot be determined from the context, say so."},

{"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}

]

response = chat\_completion(messages, model=model, max\_tokens=max\_tokens)

try:

assistant\_message = response["completion\_message"]

answer = assistant\_message["content"]["text"] if isinstance(assistant\_message["content"], dict) else assistant\_message["content"]

return answer

except KeyError as e:

print(f"Error parsing response: {e}")

return None

# Example usage

document = """

The Eiffel Tower is a wrought-iron lattice tower located on the Champ de Mars in Paris, France.

It was named after the engineer Gustave Eiffel, whose company designed and built the tower from 1887 to 1889.

It was initially criticized by some of France's leading artists and intellectuals for its design,

but it has since become a global cultural icon of France and one of the most recognizable structures in the world.

The Eiffel Tower is the most-visited paid monument in the world; 6.91 million people ascended it in 2015.

The tower is 330 meters (1,083 ft) tall, about the same height as an 81-story building, and the tallest structure in Paris.

"""

question = "How tall is the Eiffel Tower?"

answer = answer\_question(document, question)

print(f"Question: {question}\nAnswer: {answer}")

Enter to Rename, Shift+Enter to Preview

## Implementing RAG for enhanced question answering

Retrieval Augmented Generation (RAG) combines information retrieval with text generation to create more capable Q&A systems. Rather than relying on a single document as context, RAG systems retrieve relevant documents or passages from a larger corpus based on the query, then use these retrieved documents as context for generating an answer.This approach offers several significant advantages:

* •Scale: Can answer questions across large document collections
* •Relevance: Focuses only on information pertinent to the specific question
* •Factual grounding: Anchors responses in retrieved content rather than relying solely on the model's parameters
* •Transparency: Makes it clearer where information is coming from

In a production environment, you would typically use a vector database, semantic search, or a hybrid of both systems for the retrieval component.Implement a simplified version using keyword matching:

Python

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

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

def simple\_rag\_system(documents, question, model="Llama-3.3-8B-Instruct", max\_tokens=200):

# Simple keyword-based retrieval for the sake of demonstration.

relevant\_docs = []

keywords = question.lower().split()

for doc in documents:

# Calculate simple relevance score based on keyword matches

score = sum(1 for keyword in keywords if keyword in doc.lower())

if score > 0:

relevant\_docs.append((doc, score))

# Sort by relevance score and take top 2

relevant\_docs.sort(key=lambda x: x[1], reverse=True)

top\_docs = [doc for doc, \_ in relevant\_docs[:2]]

if not top\_docs:

return "No relevant information found."

# Combine documents for context

combined\_context = "\n\n".join(top\_docs)

# Use Q&A function with combined context

return answer\_question(combined\_context, question, model, max\_tokens)

# Example usage

documents = [

"Paris is the capital and most populous city of France. It has an estimated population of 2,175,601 residents as of 2018, and is one of Europe's major centers of finance, diplomacy, commerce, fashion, and arts.",

"The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower from 1887 to 1889.",

"The Louvre Museum is the world's largest art museum and a historic monument in Paris, France. A central landmark of the city, it is located on the Right Bank of the Seine.",

"Lyon is the third-largest city of France. It is located at the confluence of the rivers Rhône and Saône, about 470 km south of Paris."

]

question = "What is the Eiffel Tower named after?"

rag\_answer = simple\_rag\_system(documents, question)

print(f"RAG Answer: {rag\_answer}")

Enter to Rename, Shift+Enter to Preview

A comprehensive RAG implementation would include:

* •Document preprocessing and chunking
* •Vector embeddings for semantic matching
* •Efficient vector storage and retrieval
* •Re-ranking of retrieved documents
* •Generation with proper attribution

Although this simple implementation uses keyword matching, it demonstrates the core principle of RAG: retrieving relevant context dynamically based on the question, and then using that context to generate a precise answer.

Was this page helpful?

[Understanding chat completion](#understanding-chat-completion)

[Building conversational applications](#building-conversational-applications)

[Summarization and Q&A systems](#summarization-and-q&a-systems)