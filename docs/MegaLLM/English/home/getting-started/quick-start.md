# Quick Start

> Get started with MegaLLM in just 2 minutes. This guide will help you make your first API call.

## 1. Get Your API Key

<Steps>
  <Step title="Sign Up">
    Visit [megallm.io/auth/signup](https://megallm.io/auth/signup) and create an account
  </Step>

  <Step title="Navigate to Dashboard">
    Go to [megallm.io/dashboard](https://megallm.io/dashboard/overview)
  </Step>

  <Step title="Generate API Key">
    Click "Create New API Key" in the API Keys section
  </Step>

  <Step title="Copy Key">
    Copy your key (starts with `sk-mega-`) and save it securely
  </Step>
</Steps>

<Warning>
  Keep your API key secret! Never commit it to version control or share it publicly.
</Warning>

## 2. Make Your First Request

Choose your preferred method:

<Tabs>
  <Tab title="Python">
    ```bash  theme={null}
    # Install OpenAI SDK
    pip install openai
    ```

    ```python  theme={null}
    from openai import OpenAI

    # Initialize client
    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-megallm-api-key"  # Replace with your key
    )

    # Make a request
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "Say hello!"}
        ]
    )

    print(response.choices[0].message.content)
    ```
  </Tab>

  <Tab title="JavaScript">
    ```bash  theme={null}
    # Install OpenAI SDK
    npm install openai
    ```

    ```javascript  theme={null}
    import OpenAI from 'openai';

    // Initialize client
    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: 'your-megallm-api-key' // Replace with your key
    });

    // Make a request
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: 'Say hello!' }
      ]
    });

    console.log(response.choices[0].message.content);
    ```
  </Tab>

  <Tab title="cURL">
    ```bash  theme={null}
    curl https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer YOUR_MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [
          {"role": "user", "content": "Say hello!"}
        ]
      }'
    ```
  </Tab>

  <Tab title="CLI">
    ```bash  theme={null}
    # Install MegaLLM CLI
    npx megallm@latest

    # Follow the interactive setup
    ```

    See [CLI Documentation](/cli/overview) for details.
  </Tab>
</Tabs>

## 3. Try Different Models

One of MegaLLM's superpowers is instant model switching. Just change the `model` parameter:

```python  theme={null}
# Try GPT-4
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Explain quantum computing"}]
)

# Switch to Claude
response = client.chat.completions.create(
    model="claude-opus-4-1-20250805",
    messages=[{"role": "user", "content": "Explain quantum computing"}]
)

# Try Gemini
response = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[{"role": "user", "content": "Explain quantum computing"}]
)
```

<Info>
  Browse all available models at [Models Catalog](/home/models)
</Info>

## What's Next?

<CardGroup cols={2}>
  <Card title="Complete Setup" icon="screwdriver-wrench" href="/en/home/getting-started/setup">
    Environment variables and configuration
  </Card>

  <Card title="First Request Tutorial" icon="brackets-curly" href="/en/home/getting-started/first-request">
    Detailed walkthrough with examples
  </Card>

  <Card title="Browse Models" icon="grid-2-plus" href="/en/home/models">
    Explore all 70+ available models
  </Card>

  <Card title="API Reference" icon="book-atlas" href="/en/api-reference/introduction">
    Complete API documentation
  </Card>
</CardGroup>

## Common Questions

<AccordionGroup>
  <Accordion title="Which model should I use?">
    Start with `gpt-4` for general use, `claude-3.5-sonnet` for long context, or `gpt-3.5-turbo` for speed and cost efficiency.

    See [Models Catalog](/home/models) for detailed comparisons.
  </Accordion>

  <Accordion title="How much does it cost?">
    You pay only for what you use. Different models have different pricing. Most testing can be done for under \$1.

    Check current pricing in your [Dashboard](https://megallm.io/dashboard/overview).
  </Accordion>

  <Accordion title="Can I use my existing OpenAI/Anthropic code?">
    Yes! Just change the base URL. All your existing code works without modification.
  </Accordion>

  <Accordion title="What if a model is down?">
    MegaLLM has automatic failover. If a model is unavailable, you can quickly switch to an alternative.
  </Accordion>
</AccordionGroup>

## Need Help?

* **Full Tutorial**: [First Request Guide](/home/getting-started/first-request)
* **Documentation**: [Developer Docs](/dev-docs/overview)
* **FAQ**: [Common Questions](/home/faq)
* **Support**: [support@megallm.io](mailto:support@megallm.io)
* **Discord**: [Join Community](https://discord.gg/devsindia)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt