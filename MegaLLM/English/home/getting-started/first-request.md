# First Request

> Let's build a simple AI application step-by-step. You'll learn how to make requests, handle responses, and work with different models.

## Prerequisites

* MegaLLM API key ([Get one here](https://megallm.io/dashboard/overview))
* Python 3.7+ or Node.js 14+ installed
* Basic programming knowledge

## Step 1: Create Project

<Tabs>
  <Tab title="Python">
    ```bash  theme={null}
    # Create directory
    mkdir my-first-ai-app
    cd my-first-ai-app

    # Create virtual environment
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate

    # Install dependencies
    pip install openai python-dotenv
    ```
  </Tab>

  <Tab title="JavaScript">
    ```bash  theme={null}
    # Create directory
    mkdir my-first-ai-app
    cd my-first-ai-app

    # Initialize project
    npm init -y

    # Install dependencies
    npm install openai dotenv
    ```
  </Tab>
</Tabs>

## Step 2: Store API Key

Create a `.env` file:

```bash  theme={null}
MEGALLM_API_KEY=your-api-key-here
```

<Warning>
  Add `.env` to `.gitignore` to avoid committing your API key!
</Warning>

## Step 3: Basic Request

<Tabs>
  <Tab title="Python">
    Create `app.py`:

    ```python  theme={null}
    import os
    from dotenv import load_dotenv
    from openai import OpenAI

    # Load environment variables
    load_dotenv()

    # Initialize client
    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    # Make a request
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "What is MegaLLM?"}
        ]
    )

    # Print response
    print(response.choices[0].message.content)
    ```

    Run it:

    ```bash  theme={null}
    python app.py
    ```
  </Tab>

  <Tab title="JavaScript">
    Create `app.js`:

    ```javascript  theme={null}
    import OpenAI from 'openai';
    import dotenv from 'dotenv';

    // Load environment variables
    dotenv.config();

    // Initialize client
    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY
    });

    // Make a request
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: 'What is MegaLLM?' }
      ]
    });

    // Print response
    console.log(response.choices[0].message.content);
    ```

    Update `package.json`:

    ```json  theme={null}
    {
      "type": "module"
    }
    ```

    Run it:

    ```bash  theme={null}
    node app.js
    ```
  </Tab>
</Tabs>

## Step 4: Add Conversation Context

Let's make it conversational:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    import os
    from dotenv import load_dotenv
    from openai import OpenAI

    load_dotenv()

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    # Conversation history
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is Python?"}
    ]

    # First response
    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages
    )

    # Add to history
    assistant_message = response.choices[0].message.content
    messages.append({"role": "assistant", "content": assistant_message})
    print(f"Assistant: {assistant_message}\n")

    # Follow-up question
    messages.append({"role": "user", "content": "What are its key features?"})

    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages
    )

    print(f"Assistant: {response.choices[0].message.content}")
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';
    import dotenv from 'dotenv';

    dotenv.config();

    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY
    });

    // Conversation history
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is JavaScript?' }
    ];

    // First response
    let response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: messages
    });

    // Add to history
    const assistantMessage = response.choices[0].message.content;
    messages.push({ role: 'assistant', content: assistantMessage });
    console.log(`Assistant: ${assistantMessage}\n`);

    // Follow-up question
    messages.push({ role: 'user', content: 'What are its key features?' });

    response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: messages
    });

    console.log(`Assistant: ${response.choices[0].message.content}`);
    ```
  </Tab>
</Tabs>

## Step 5: Try Different Models

Switch models by changing the `model` parameter:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    models = ["gpt-4", "claude-3.5-sonnet", "gemini-2.5-pro"]

    for model in models:
        print(f"\n--- Using {model} ---")
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "user", "content": "Explain quantum computing in one sentence."}
            ]
        )
        print(response.choices[0].message.content)
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    const models = ['gpt-4', 'claude-3.5-sonnet', 'gemini-2.5-pro'];

    for (const model of models) {
      console.log(`\n--- Using ${model} ---`);
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          { role: 'user', content: 'Explain quantum computing in one sentence.' }
        ]
      });
      console.log(response.choices[0].message.content);
    }
    ```
  </Tab>
</Tabs>

## Step 6: Add Parameters

Customize the response with parameters:

```python  theme={null}
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "Write a short poem about AI"}
    ],
    temperature=0.9,      # Higher = more creative
    max_tokens=100,       # Limit response length
    top_p=0.95,          # Nucleus sampling
    frequency_penalty=0.5 # Reduce repetition
)
```

## Step 7: Error Handling

Add proper error handling:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI, AuthenticationError, RateLimitError

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": "Hello!"}]
        )
        print(response.choices[0].message.content)

    except AuthenticationError:
        print("<Icon icon="xmark" /> Invalid API key")
    except RateLimitError:
        print("<Icon icon="xmark" /> Rate limit exceeded")
    except Exception as e:
        print(f"<Icon icon="xmark" /> Error: {e}")
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Hello!' }]
      });
      console.log(response.choices[0].message.content);

    } catch (error) {
      if (error.status === 401) {
        console.log('<Icon icon="xmark" /> Invalid API key');
      } else if (error.status === 429) {
        console.log('<Icon icon="xmark" /> Rate limit exceeded');
      } else {
        console.log(`<Icon icon="xmark" /> Error: ${error.message}`);
      }
    }
    ```
  </Tab>
</Tabs>

## Step 8: Interactive Chat

Build a simple chatbot:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    import os
    from dotenv import load_dotenv
    from openai import OpenAI

    load_dotenv()

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    messages = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]

    print("Chat with AI (type 'quit' to exit)\n")

    while True:
        user_input = input("You: ")

        if user_input.lower() == 'quit':
            break

        messages.append({"role": "user", "content": user_input})

        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages
        )

        assistant_message = response.choices[0].message.content
        messages.append({"role": "assistant", "content": assistant_message})

        print(f"AI: {assistant_message}\n")
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';
    import dotenv from 'dotenv';
    import readline from 'readline';

    dotenv.config();

    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY
    });

    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' }
    ];

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("Chat with AI (type 'quit' to exit)\n");

    function chat() {
      rl.question('You: ', async (userInput) => {
        if (userInput.toLowerCase() === 'quit') {
          rl.close();
          return;
        }

        messages.push({ role: 'user', content: userInput });

        const response = await client.chat.completions.create({
          model: 'gpt-4',
          messages: messages
        });

        const assistantMessage = response.choices[0].message.content;
        messages.push({ role: 'assistant', content: assistantMessage });

        console.log(`AI: ${assistantMessage}\n`);
        chat();
      });
    }

    chat();
    ```
  </Tab>
</Tabs>

## Understanding the Response

The API returns a rich response object:

```json  theme={null}
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
```

## Next Steps

<CardGroup cols={2}>
  <Card title="Streaming" icon="stream" href="/en/api-reference/endpoint/streaming">
    Real-time streaming responses
  </Card>

  <Card title="Function Calling" icon="function" href="/en/api-reference/endpoint/function-calling">
    Let AI use external tools
  </Card>

  <Card title="Browse Models" icon="layer-group" href="/en/home/models">
    Explore all available models
  </Card>

  <Card title="Best Practices" icon="star" href="/en/home/getting-started/next-steps">
    Tips for production apps
  </Card>
</CardGroup>

## Troubleshooting

<AccordionGroup>
  <Accordion title="Import errors">
    Make sure you installed the SDK:

    ```bash  theme={null}
    pip install openai  # Python
    npm install openai  # JavaScript
    ```
  </Accordion>

  <Accordion title="401 Authentication error">
    * Check your API key is correct
    * Verify `.env` file is in the same directory
    * Make sure you called `load_dotenv()` (Python) or `dotenv.config()` (JS)
  </Accordion>

  <Accordion title="Rate limit errors">
    * You're making too many requests
    * Add delays between requests
    * Consider upgrading your plan
  </Accordion>

  <Accordion title="Slow responses">
    * Try a faster model like `gpt-3.5-turbo`
    * Reduce `max_tokens`
    * Use streaming for better UX
  </Accordion>
</AccordionGroup>

## Need Help?

* **FAQ**: [Common Questions](/home/faq)
* **API Reference**: [Complete Documentation](/api-reference/introduction)
* **Support**: [support@megallm.io](mailto:support@megallm.io)
* **Discord**: [Join Community](https://discord.gg/devsindia)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt