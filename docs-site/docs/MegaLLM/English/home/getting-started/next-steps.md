# Next Steps

> You've made your first AI request! Here's what to explore next.

## Learn Advanced Features

<CardGroup cols={2}>
  <Card title="Streaming Responses" icon="stream" href="/en/api-reference/endpoint/streaming">
    Get real-time responses as they're generated
  </Card>

  <Card title="Function Calling" icon="function" href="/en/api-reference/endpoint/function-calling">
    Let AI interact with external tools and APIs
  </Card>

  <Card title="Vision Support" icon="images" href="/en/dev-docs/openai/chat-completions">
    Process images with multimodal models
  </Card>

  <Card title="API Documentation" icon="file-code" href="/en/api-reference/introduction">
    Complete API reference and guides
  </Card>
</CardGroup>

## Explore Documentation

<CardGroup cols={2}>
  <Card title="API Reference" icon="book-atlas" href="/en/api-reference/introduction">
    Complete API documentation
  </Card>

  <Card title="OpenAI API" icon="brackets-curly" href="/en/dev-docs/openai/overview">
    OpenAI-compatible endpoints
  </Card>

  <Card title="Anthropic API" icon="comments" href="/en/dev-docs/anthropic/overview">
    Anthropic Claude-compatible endpoints
  </Card>

  <Card title="Models Catalog" icon="grid-2-plus" href="/en/home/models">
    Browse all 70+ available models
  </Card>
</CardGroup>

## Build Real Applications

### 1. Chatbot

Build an intelligent chatbot:

```python  theme={null}
from openai import OpenAI

client = OpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key="your-key"
)

def chatbot(user_message, history=[]):
    history.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model="gpt-4",
        messages=history
    )

    assistant_message = response.choices[0].message.content
    history.append({"role": "assistant", "content": assistant_message})

    return assistant_message, history
```

### 2. Content Generator

Generate blog posts, emails, or social media content:

```python  theme={null}
def generate_content(topic, content_type="blog"):
    prompts = {
        "blog": f"Write a comprehensive blog post about {topic}",
        "email": f"Write a professional email about {topic}",
        "tweet": f"Write an engaging tweet about {topic}"
    }

    response = client.chat.completions.create(
        model="claude-3.5-sonnet",
        messages=[{"role": "user", "content": prompts[content_type]}],
        temperature=0.7
    )

    return response.choices[0].message.content
```

### 3. Code Assistant

Build a coding helper:

```python  theme={null}
def code_assistant(task, language="python"):
    prompt = f"Write {language} code to {task}. Include comments and error handling."

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2  # Lower temperature for more deterministic code
    )

    return response.choices[0].message.content
```

### 4. Data Analyzer

Analyze data and generate insights:

```python  theme={null}
def analyze_data(data_description):
    prompt = f"""
    Analyze this data and provide insights:
    {data_description}

    Provide:
    1. Key findings
    2. Trends
    3. Recommendations
    """

    response = client.chat.completions.create(
        model="claude-opus-4-1-20250805",  # Best for analysis
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content
```

## Best Practices

<AccordionGroup>
  <Accordion title="Choose the Right Model">
    * **GPT-4**: Best for complex reasoning
    * **GPT-3.5 Turbo**: Fast and cost-effective
    * **Claude Opus**: Excellent for analysis and long context
    * **Claude Sonnet**: Balanced performance
    * **Gemini Pro**: Strong multimodal capabilities

    See [Models Catalog](/home/models) for detailed comparisons.
  </Accordion>

  <Accordion title="Optimize Costs">
    * Start with cheaper models for testing
    * Use `max_tokens` to limit response length
    * Cache responses when possible
    * Use streaming to improve perceived performance
    * Monitor usage in your dashboard
  </Accordion>

  <Accordion title="Handle Errors Gracefully">
    ```python  theme={null}
    from openai import OpenAI, AuthenticationError, RateLimitError
    import time

    def make_request_with_retry(messages, max_retries=3):
        for attempt in range(max_retries):
            try:
                return client.chat.completions.create(
                    model="gpt-4",
                    messages=messages
                )
            except RateLimitError:
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    raise
            except AuthenticationError:
                print("Invalid API key")
                raise
    ```
  </Accordion>

  <Accordion title="Optimize Prompts">
    * Be specific and clear
    * Provide examples when needed
    * Use system messages to set context
    * Break complex tasks into steps
    * Test different temperature settings
  </Accordion>

  <Accordion title="Manage Context">
    * Keep track of conversation history
    * Limit history to avoid token limits
    * Summarize old messages if needed
    * Use prompt caching for repeated content
  </Accordion>
</AccordionGroup>

## Production Considerations

### Security

* Store API keys in environment variables
* Never commit keys to version control
* Use different keys for dev/staging/production
* Rotate keys regularly
* Monitor usage for anomalies

### Performance

* Use streaming for better UX
* Implement caching where appropriate
* Add retry logic with exponential backoff
* Monitor response times
* Consider using webhooks for async operations

### Monitoring

* Track token usage
* Monitor error rates
* Log API requests (without sensitive data)
* Set up alerts for quota limits
* Review costs regularly

### Scaling

* Implement rate limiting
* Use queues for high-volume requests
* Cache common responses
* Consider batching requests
* Plan for failover strategies

## Join the Community

<CardGroup cols={2}>
  <Card title="Discord" icon="discord" href="https://discord.gg/devsindia">
    Chat with other developers
  </Card>

  <Card title="GitHub" icon="github" href="https://github.com/megallm">
    View examples and contribute
  </Card>

  <Card title="Twitter/X" icon="x-twitter" href="https://x.com/megallmio">
    Follow for updates
  </Card>

  <Card title="YouTube" icon="youtube" href="https://youtube.com/@Megallmio">
    Watch tutorials
  </Card>
</CardGroup>

## Get Help

<AccordionGroup>
  <Accordion title="Check the FAQ">
    Most common questions are answered in our [FAQ](/home/faq).
  </Accordion>

  <Accordion title="Read the Docs">
    Comprehensive guides available in [Developer Docs](/dev-docs/overview).
  </Accordion>

  <Accordion title="Contact Support">
    Email us at [support@megallm.io](mailto:support@megallm.io) for technical assistance.
  </Accordion>

  <Accordion title="Report Issues">
    Found a bug? Report it on [GitHub](https://github.com/megallm).
  </Accordion>
</AccordionGroup>

## Useful Resources

* **[API Reference](/api-reference/introduction)** - Complete API documentation
* **[Models Catalog](/home/models)** - All 70+ models with pricing
* **[CLI Tool](/cli/overview)** - Set up AI coding assistants
* **[FAQ](/home/faq)** - Common questions and answers
* **[Changelog](/releases/overview)** - Latest updates

## Ready to Build?

Start building your AI application today. If you need help, we're here for you!

<CardGroup cols={2}>
  <Card title="API Reference" icon="code" href="/en/api-reference/introduction">
    Complete documentation
  </Card>

  <Card title="Support" icon="envelope" href="mailto:support@megallm.io">
    Get help from our team
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt