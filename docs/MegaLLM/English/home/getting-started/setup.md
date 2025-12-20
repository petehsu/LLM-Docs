# Setup Guide

> Complete guide to setting up MegaLLM for your development environment.

## Environment Setup

### 1. Store Your API Key Securely

<Tabs>
  <Tab title="Linux/macOS">
    Add to your shell configuration file:

    ```bash  theme={null}
    # ~/.bashrc or ~/.zshrc
    export MEGALLM_API_KEY="your-api-key-here"
    ```

    Then reload:

    ```bash  theme={null}
    source ~/.bashrc
    # or
    source ~/.zshrc
    ```

    Or use a `.env` file:

    ```bash  theme={null}
    echo "MEGALLM_API_KEY=your-api-key-here" >> .env
    ```
  </Tab>

  <Tab title="Windows">
    **PowerShell:**

    ```powershell  theme={null}
    [System.Environment]::SetEnvironmentVariable("MEGALLM_API_KEY", "your-api-key-here", "User")
    ```

    **Command Prompt:**

    ```cmd  theme={null}
    setx MEGALLM_API_KEY "your-api-key-here"
    ```
  </Tab>

  <Tab title=".env File">
    Create a `.env` file in your project root:

    ```bash  theme={null}
    MEGALLM_API_KEY=your-api-key-here
    ```

    **Python:**

    ```python  theme={null}
    from dotenv import load_dotenv
    load_dotenv()
    ```

    **JavaScript:**

    ```javascript  theme={null}
    require('dotenv').config();
    ```

    <Warning>
      Add `.env` to your `.gitignore` to avoid committing secrets!
    </Warning>
  </Tab>
</Tabs>

### 2. Install SDK

<Tabs>
  <Tab title="Python">
    ```bash  theme={null}
    # OpenAI SDK (recommended)
    pip install openai

    # Or Anthropic SDK
    pip install anthropic

    # For environment variables
    pip install python-dotenv
    ```
  </Tab>

  <Tab title="JavaScript/TypeScript">
    ```bash  theme={null}
    # OpenAI SDK (recommended)
    npm install openai

    # Or Anthropic SDK
    npm install @anthropic-ai/sdk

    # For environment variables
    npm install dotenv
    ```
  </Tab>

  <Tab title="Go">
    ```bash  theme={null}
    go get github.com/sashabaranov/go-openai
    ```
  </Tab>

  <Tab title="Other Languages">
    MegaLLM works with any HTTP client. See [API Reference](/api-reference/introduction) for details.
  </Tab>
</Tabs>

### 3. Configure Your Client

<Tabs>
  <Tab title="Python - OpenAI Format">
    ```python  theme={null}
    import os
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    # Test the connection
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print(response.choices[0].message.content)
    ```
  </Tab>

  <Tab title="Python - Anthropic Format">
    ```python  theme={null}
    import os
    from anthropic import Anthropic

    client = Anthropic(
        base_url="https://ai.megallm.io",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    # Test the connection
    message = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=100,
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print(message.content[0].text)
    ```
  </Tab>

  <Tab title="JavaScript - OpenAI Format">
    ```javascript  theme={null}
    import OpenAI from 'openai';

    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY
    });

    // Test the connection
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Hello!' }]
    });
    console.log(response.choices[0].message.content);
    ```
  </Tab>

  <Tab title="JavaScript - Anthropic Format">
    ```javascript  theme={null}
    import Anthropic from '@anthropic-ai/sdk';

    const client = new Anthropic({
      baseURL: 'https://ai.megallm.io',
      apiKey: process.env.MEGALLM_API_KEY
    });

    // Test the connection
    const message = await client.messages.create({
      model: 'claude-3.5-sonnet',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Hello!' }]
    });
    console.log(message.content[0].text);
    ```
  </Tab>
</Tabs>

## Project Setup

### For New Projects

1. **Create project directory:**
   ```bash  theme={null}
   mkdir my-ai-project
   cd my-ai-project
   ```

2. **Initialize project:**
   ```bash  theme={null}
   # Python
   python -m venv venv
   source venv/bin/activate
   pip install openai python-dotenv

   # JavaScript
   npm init -y
   npm install openai dotenv
   ```

3. **Create .env file:**
   ```bash  theme={null}
   echo "MEGALLM_API_KEY=your-key-here" > .env
   echo ".env" >> .gitignore
   ```

4. **Create first script:**
   See [First Request Guide](/home/getting-started/first-request)

### For Existing Projects

If you're already using OpenAI or Anthropic:

1. **Update base URL:**
   ```python  theme={null}
   # Before
   client = OpenAI(api_key="sk-...")

   # After
   client = OpenAI(
       base_url="https://ai.megallm.io/v1",
       api_key="your-megallm-key"
   )
   ```

2. **That's it!** All your existing code works.

## IDE Setup

### VS Code

Install recommended extensions:

* Python extension (for Python)
* ESLint (for JavaScript)
* REST Client (for testing APIs)

### PyCharm / IntelliJ

Configure environment variables in Run Configurations.

### AI Coding Assistants

MegaLLM provides a CLI to configure AI coding tools:

```bash  theme={null}
npx megallm@latest
```

This sets up:

* Claude Code
* Codex/Windsurf
* OpenCode

See [CLI Documentation](/cli/overview) for details.

## Verify Setup

Test your configuration:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    import os
    from openai import OpenAI

    # Check API key
    api_key = os.getenv("MEGALLM_API_KEY")
    if not api_key:
        print("❌ API key not set!")
        exit(1)
    print("✅ API key found")

    # Test connection
    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=api_key
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": "Say 'Setup successful!'"}],
            max_tokens=10
        )
        print("✅ Connection successful!")
        print(f"Response: {response.choices[0].message.content}")
    except Exception as e:
        print(f"❌ Error: {e}")
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';

    // Check API key
    const apiKey = process.env.MEGALLM_API_KEY;
    if (!apiKey) {
      console.log('❌ API key not set!');
      process.exit(1);
    }
    console.log('✅ API key found');

    // Test connection
    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: apiKey
    });

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: "Say 'Setup successful!'" }],
        max_tokens: 10
      });
      console.log('✅ Connection successful!');
      console.log(`Response: ${response.choices[0].message.content}`);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    ```
  </Tab>

  <Tab title="cURL">
    ```bash  theme={null}
    curl https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Say setup successful!"}],
        "max_tokens": 10
      }'
    ```
  </Tab>
</Tabs>

## Troubleshooting

<AccordionGroup>
  <Accordion title="API key not found">
    **Problem:** Environment variable not set

    **Solution:**

    * Check variable name: `MEGALLM_API_KEY`
    * Reload shell: `source ~/.bashrc`
    * Verify: `echo $MEGALLM_API_KEY`
  </Accordion>

  <Accordion title="Authentication failed (401)">
    **Problem:** Invalid API key

    **Solution:**

    * Verify key starts with `sk-mega-`
    * Check for extra spaces
    * Generate new key at [dashboard](https://megallm.io/dashboard/overview)
  </Accordion>

  <Accordion title="Connection timeout">
    **Problem:** Network or firewall issues

    **Solution:**

    * Check internet connection
    * Verify firewall settings
    * Try without VPN
  </Accordion>

  <Accordion title="Module not found">
    **Problem:** SDK not installed

    **Solution:**

    ```bash  theme={null}
    pip install openai  # Python
    npm install openai  # JavaScript
    ```
  </Accordion>
</AccordionGroup>

## Next Steps

<CardGroup cols={2}>
  <Card title="First Request" icon="code" href="/en/home/getting-started/first-request">
    Build your first AI application
  </Card>

  <Card title="Browse Models" icon="layer-group" href="/en/home/models">
    Explore 70+ available models
  </Card>

  <Card title="API Reference" icon="file-code" href="/en/api-reference/introduction">
    Complete API documentation
  </Card>

  <Card title="Best Practices" icon="star" href="/en/home/faq">
    Tips and common questions
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt