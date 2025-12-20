#### Guides

# Code Execution Tool

The code execution tool enables Grok to write and execute Python code in real-time, dramatically expanding its capabilities beyond text generation. This powerful feature allows Grok to perform precise calculations, complex data analysis, statistical computations, and solve mathematical problems that would be impossible through text alone.

**xAI Python SDK Users**: Version 1.3.1 of the xai-sdk package is required to use the agentic tool calling API.

&#x20;The code execution tool is not yet supported in the Vercel AI SDK. Please use the xAI SDK or OpenAI SDK for this functionality.

## Key Capabilities

* **Mathematical Computations**: Solve complex equations, perform statistical analysis, and handle numerical calculations with precision
* **Data Analysis**: Process datasets, and extract insights from the prompt
* **Financial Modeling**: Build financial models, calculate risk metrics, and perform quantitative analysis
* **Scientific Computing**: Handle scientific calculations, simulations, and data transformations
* **Code Generation & Testing**: Write, test, and debug Python code snippets in real-time

## When to Use Code Execution

The code execution tool is particularly valuable for:

* **Numerical Problems**: When you need exact calculations rather than approximations
* **Data Processing**: Analyzing complex data from the prompt
* **Complex Logic**: Multi-step calculations that require intermediate results
* **Verification**: Double-checking mathematical results or validating assumptions

## SDK Support

The code execution tool is available across multiple SDKs and APIs with different naming conventions:

| SDK/API | Tool Name | Description |
|---------|-----------|-------------|
| xAI SDK | `code_execution` | Native xAI SDK implementation |
| OpenAI Responses API | `code_interpreter` | Compatible with OpenAI's API format |

## Implementation Example

Below are comprehensive examples showing how to integrate the code execution tool across different platforms and use cases.

### Basic Calculations

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import code_execution

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[code_execution()],
)

# Ask for a mathematical calculation
chat.append(user("Calculate the compound interest for $10,000 at 5% annually for 10 years"))

is_thinking = True
for response, chunk in chat.stream():
    # View the server-side tool calls as they are being made in real-time
    for tool_call in chunk.tool_calls:
        print(f"\\nCalling tool: {tool_call.function.name} with arguments: {tool_call.function.arguments}")
    if response.usage.reasoning_tokens and is_thinking:
        print(f"\\rThinking... ({response.usage.reasoning_tokens} tokens)", end="", flush=True)
    if chunk.content and is_thinking:
        print("\\n\\nFinal Response:")
        is_thinking = False
    if chunk.content and not is_thinking:
        print(chunk.content, end="", flush=True)

print("\\n\\nCitations:")
print(response.citations)
print("\\n\\nUsage:")
print(response.usage)
print(response.server_side_tool_usage)
print("\\n\\nServer Side Tool Calls:")
print(response.tool_calls)
```

```pythonOpenAISDK
import os
from openai import OpenAI

api_key = os.getenv("XAI_API_KEY")
client = OpenAI(
    api_key=api_key,
    base_url="https://api.x.ai/v1",
)

response = client.responses.create(
    model="grok-4-1-fast",
    input=[
        {
            "role": "user",
            "content": "Calculate the compound interest for $10,000 at 5% annually for 10 years",
        },
    ],
    tools=[
        {
            "type": "code_interpreter",
        },
    ],
)

print(response)
```

```pythonRequests
import os
import requests

url = "https://api.x.ai/v1/responses"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {os.getenv('XAI_API_KEY')}"
}
payload = {
    "model": "grok-4-1-fast",
    "input": [
        {
            "role": "user",
            "content": "Calculate the compound interest for $10,000 at 5% annually for 10 years"
        }
    ],
    "tools": [
        {
            "type": "code_interpreter",
        }
    ]
}
response = requests.post(url, headers=headers, json=payload)
print(response.json())
```

```bash
curl https://api.x.ai/v1/responses \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $XAI_API_KEY" \\
  -d '{
  "model": "grok-4-1-fast",
  "input": [
    {
      "role": "user",
      "content": "Calculate the compound interest for $10,000 at 5% annually for 10 years"
    }
  ],
  "tools": [
    {
      "type": "code_interpreter"
    }
  ]
}'
```

### Data Analysis

```pythonXAI
import os
from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import code_execution

client = Client(api_key=os.getenv("XAI_API_KEY"))

# Multi-turn conversation with data analysis
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[code_execution()],
)

# Step 1: Load and analyze data
chat.append(user("""
I have sales data for Q1-Q4: [120000, 135000, 98000, 156000].
Please analyze this data and create a visualization showing:
1. Quarterly trends
2. Growth rates
3. Statistical summary
"""))

print("##### Step 1: Data Analysis #####\\n")

is_thinking = True
for response, chunk in chat.stream():
    # View the server-side tool calls as they are being made in real-time
    for tool_call in chunk.tool_calls:
        print(f"\\nCalling tool: {tool_call.function.name} with arguments: {tool_call.function.arguments}")
    if response.usage.reasoning_tokens and is_thinking:
        print(f"\\rThinking... ({response.usage.reasoning_tokens} tokens)", end="", flush=True)
    if chunk.content and is_thinking:
        print("\\n\\nAnalysis Results:")
        is_thinking = False
    if chunk.content and not is_thinking:
        print(chunk.content, end="", flush=True)

print("\\n\\nCitations:")
print(response.citations)
print("\\n\\nUsage:")
print(response.usage)
print(response.server_side_tool_usage)

chat.append(response)

# Step 2: Follow-up analysis
chat.append(user("Now predict Q1 next year using linear regression"))

print("\\n\\n##### Step 2: Prediction Analysis #####\\n")

is_thinking = True
for response, chunk in chat.stream():
    # View the server-side tool calls as they are being made in real-time
    for tool_call in chunk.tool_calls:
        print(f"\\nCalling tool: {tool_call.function.name} with arguments: {tool_call.function.arguments}")
    if response.usage.reasoning_tokens and is_thinking:
        print(f"\\rThinking... ({response.usage.reasoning_tokens} tokens)", end="", flush=True)
    if chunk.content and is_thinking:
        print("\\n\\nPrediction Results:")
        is_thinking = False
    if chunk.content and not is_thinking:
        print(chunk.content, end="", flush=True)

print("\\n\\nCitations:")
print(response.citations)
print("\\n\\nUsage:")
print(response.usage)
print(response.server_side_tool_usage)
print("\\n\\nServer Side Tool Calls:")
print(response.tool_calls)
```

## Best Practices

### 1. **Be Specific in Requests**

Provide clear, detailed instructions about what you want the code to accomplish:

```pythonWithoutSDK
# Good: Specific and clear
"Calculate the correlation matrix for these variables and highlight correlations above 0.7"

# Avoid: Vague requests  
"Analyze this data"
```

### 2. **Provide Context and Data Format**

Always specify the data format and any constraints on the data, and provide as much context as possible:

```pythonWithoutSDK
# Good: Includes data format and requirements
"""
Here's my CSV data with columns: date, revenue, costs
Please calculate monthly profit margins and identify the best-performing month.
Data: [['2024-01', 50000, 35000], ['2024-02', 55000, 38000], ...]
"""
```

### 3. **Use Appropriate Model Settings**

* **Temperature**: Use lower values (0.0-0.3) for mathematical calculations
* **Model**: Use reasoning models like `grok-4-1-fast` for better code generation

## Common Use Cases

### Financial Analysis

```pythonWithoutSDK
# Portfolio optimization, risk calculations, option pricing
"Calculate the Sharpe ratio for a portfolio with returns [0.12, 0.08, -0.03, 0.15] and risk-free rate 0.02"
```

### Statistical Analysis

```pythonWithoutSDK
# Hypothesis testing, regression analysis, probability distributions
"Perform a t-test to compare these two groups and interpret the p-value: Group A: [23, 25, 28, 30], Group B: [20, 22, 24, 26]"
```

### Scientific Computing

```pythonWithoutSDK
# Simulations, numerical methods, equation solving
"Solve this differential equation using numerical methods: dy/dx = x^2 + y, with initial condition y(0) = 1"
```

## Limitations and Considerations

* **Execution Environment**: Code runs in a sandboxed Python environment with common libraries pre-installed
* **Time Limits**: Complex computations may have execution time constraints
* **Memory Usage**: Large datasets might hit memory limitations
* **Package Availability**: Most popular Python packages (NumPy, Pandas, Matplotlib, SciPy) are available
* **File I/O**: Limited file system access for security reasons

## Security Notes

* Code execution happens in a secure, isolated environment
* No access to external networks or file systems
* Temporary execution context that doesn't persist between requests
* All computations are stateless and secure


