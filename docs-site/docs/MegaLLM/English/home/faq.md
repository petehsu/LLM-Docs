# FAQ

> Find answers to common questions about MegaLLM - the universal AI platform connecting 70+ models.

## General

<AccordionGroup>
  <Accordion title="What is MegaLLM?">
    MegaLLM is a universal AI platform that connects 70+ large language models from leading providers like OpenAI, Anthropic, and Google through a single API. Think of it as your "super-API" for AI - instead of integrating with multiple providers separately, you get access to all models through one unified interface.
  </Accordion>

  <Accordion title="How many models does MegaLLM support?">
    We currently support 70+ models including:

    * **OpenAI**: gpt-5, gpt-4.1, gpt-4o, gpt-3.5-turbo
    * **Anthropic**: claude-opus-4-1-20250805, claude-sonnet-4, claude-3.5-sonnet, claude-3.7-sonnet
    * **Google**: gemini-2.5-pro, gemini-2.0-flash-001
    * **Embedding Models**: Various text embedding options

    New models are added regularly as they become available.
  </Accordion>

  <Accordion title="Can I switch between models instantly?">
    Yes! Switching models is as simple as changing one parameter in your API call. You can also set up automatic fallbacks between models.

    ```python  theme={null}
    # Switch models instantly
    response = client.chat.completions.create(
        model="gpt-5",  # Change this to any supported model ID
        messages=[{"role": "user", "content": "Hello!"}]
    )
    ```
  </Accordion>

  <Accordion title="Do I need separate accounts for each AI provider?">
    No! That's the beauty of MegaLLM. You only need one MegaLLM account to access all 70+ models. We handle the complexity of managing multiple provider relationships, so you don't have to.
  </Accordion>
</AccordionGroup>

## Platform Features

<AccordionGroup>
  <Accordion title="What makes MegaLLM different from using providers directly?">
    MegaLLM offers several unique advantages:

    1. **One API for All**: Access 70+ models through a single, consistent interface
    2. **Automatic Fallbacks**: If one model fails, automatically switch to another
    3. **Unified Billing**: One invoice for all your AI usage
    4. **Performance Optimization**: Intelligent routing and load balancing
    5. **Cost Management**: Optimize spending across different models
  </Accordion>

  <Accordion title="How do automatic fallbacks work?">
    When you configure fallback models, MegaLLM automatically routes your request to backup models if the primary model encounters issues like:

    * Rate limits
    * Temporary outages
    * Timeout errors
    * Capacity constraints

    This ensures your application never goes down due to a single model failure.

    ```python  theme={null}
    response = client.chat.completions.create(
        model="gpt-5",
        messages=messages,
        fallback_models=["claude-opus-4-1-20250805", "gemini-2.5-pro"]
    )
    ```
  </Accordion>
</AccordionGroup>

## Pricing & Billing

<AccordionGroup>
  <Accordion title="How does pricing work?">
    You pay based on actual token usage, just like with individual providers. However, MegaLLM offers several advantages:

    * **Unified Billing**: One invoice for all models
    * **Volume Discounts**: Better rates for high usage
    * **Cost Optimization**: Tools to minimize spending
    * **Transparent Pricing**: Clear cost breakdown by model

    See our [Models page](/home/models) for detailed pricing information.
  </Accordion>

  <Accordion title="Is MegaLLM more expensive than using providers directly?">
    For most users, MegaLLM offers better value because:

    1. **Volume Pricing**: We pass on volume discounts to customers
    2. **Reduced Development Costs**: No need to integrate with multiple APIs
    3. **Operational Savings**: Less monitoring, fewer rate limit issues
    4. **Fallback Benefits**: Higher uptime means less lost revenue

    Plus, you save significant engineering time by not having to manage multiple provider integrations.
  </Accordion>

  <Accordion title="Can I set spending limits?">
    Yes! MegaLLM provides comprehensive cost controls:

    * Daily/monthly spending limits
    * Per-model budget allocation
    * Usage alerts and notifications
    * Cost optimization recommendations
    * Automatic fallback to cheaper models when limits are reached
  </Accordion>
</AccordionGroup>

## Technical Integration

<AccordionGroup>
  <Accordion title="Is MegaLLM compatible with existing OpenAI code?">
    Yes! MegaLLM is fully compatible with OpenAI's API format. Migration is typically just changing the base URL:

    ```python  theme={null}
    # Before (OpenAI)
    client = OpenAI(api_key="sk-...")

    # After (MegaLLM)
    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-megallm-key"
    )
    ```

    All your existing code continues to work unchanged.
  </Accordion>

  <Accordion title="What about Anthropic compatibility?">
    We also support Anthropic's API format perfectly:

    ```python  theme={null}
    # Anthropic format works too
    client = Anthropic(
        base_url="https://ai.megallm.io",
        api_key="your-megallm-key"
    )
    ```

    You can even mix and match - use OpenAI format to access Claude models, or vice versa.
  </Accordion>

  <Accordion title="How do I handle different model capabilities?">
    Different models have different strengths. MegaLLM makes it easy to route requests to the best model for each task:

    ```python  theme={null}
    # Code generation
    code_response = client.chat.completions.create(
        model="gpt-5",  # Great for code
        messages=[{"role": "user", "content": "Write a Python function..."}]
    )

    # Creative writing
    creative_response = client.chat.completions.create(
        model="claude-opus-4-1-20250805",  # Great for creative tasks
        messages=[{"role": "user", "content": "Write a story..."}]
    )

    # Fast responses
    quick_response = client.chat.completions.create(
        model="gpt-4o-mini",  # Fast and efficient
        messages=[{"role": "user", "content": "Quick question..."}]
    )
    ```
  </Accordion>

  <Accordion title="What about rate limits?">
    MegaLLM significantly reduces rate limit issues:

    1. **Distributed Load**: Requests are distributed across multiple providers
    2. **Automatic Fallbacks**: Switch to available models when limits hit
    3. **Intelligent Routing**: Route requests to models with available capacity
    4. **Rate Limit Prediction**: Avoid hitting limits with predictive routing

    You'll experience much higher effective rate limits than any single provider.
  </Accordion>
</AccordionGroup>

## Use Cases

<AccordionGroup>
  <Accordion title="Who benefits most from MegaLLM?">
    MegaLLM is perfect for:

    **Developers**:

    * Experiment with different models without rewriting code
    * Reduce integration complexity
    * Faster time to market

    **Businesses**:

    * Ensure high availability with fallbacks
    * Optimize costs across providers
    * Future-proof AI investments

    **Researchers**:

    * Access cutting-edge models as they're released
    * Run comprehensive evaluations
    * Test model performance across different tasks
  </Accordion>

  <Accordion title="Can I use MegaLLM for production applications?">
    Absolutely! MegaLLM is designed for production use with:

    * 99.9% uptime SLA
    * Enterprise security and compliance
    * 24/7 monitoring and support
    * Automatic scaling and load balancing
    * Comprehensive logging and analytics

    Many companies use MegaLLM to power their production AI features.
  </Accordion>

  <Accordion title="How do I choose the right model for my use case?">
    Check out our [Models page](/home/models) for detailed guidance. Generally:

    * **Fast responses**: gpt-4o-mini, gemini-2.0-flash-001
    * **Complex reasoning**: gpt-5, claude-opus-4-1-20250805
    * **Code generation**: gpt-5, claude-3.7-sonnet
    * **Creative writing**: claude-opus-4-1-20250805, gpt-5
    * **Cost-effective**: gpt-4o-mini, gemini-2.0-flash-001

    You can also test different models with your specific prompts to find the best fit.
  </Accordion>
</AccordionGroup>

## Support & Getting Started

<AccordionGroup>
  <Accordion title="How do I get started?">
    Getting started is simple:

    1. **Sign up** for a MegaLLM account
    2. **Get your API key** from the dashboard
    3. **Choose your integration method** (OpenAI or Anthropic format)
    4. **Make your first API call**

    Check our [Quick Start guide](/dev-docs/getting-started/quick-start) for detailed instructions.
  </Accordion>

  <Accordion title="Do you offer support?">
    Yes! We provide:

    * **Documentation**: Comprehensive guides and tutorials
    * **Community Support**: Discord community and forums
    * **Email Support**: Technical assistance for all users
    * **Enterprise Support**: Dedicated support for enterprise customers
    * **Professional Services**: Custom integration assistance

    Contact us at [support@megallm.io](mailto:support@megallm.io) for any questions.
  </Accordion>

  <Accordion title="Can I migrate from my current provider?">
    Migration is typically very straightforward since we maintain API compatibility. We also offer:

    * **Migration guides** for popular providers
    * **Free migration assistance** for enterprise customers
    * **Gradual migration tools** to test before fully switching
    * **Cost comparison tools** to optimize your setup

    Most customers can migrate in under an hour.
  </Accordion>
</AccordionGroup>

<Info>
  **Still have questions?** Check our [documentation](/home/introduction) or reach out to our team at [support@megallm.io](mailto:support@megallm.io)
</Info>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt