# Anthropic API

On this page

# Anthropic API

To meet the demand for using the Anthropic API ecosystem, our API has added support for the Anthropic API format. With simple configuration, you can integrate the capabilities of DeepSeek into the Anthropic API ecosystem.

## Use DeepSeek in Claude Code​

  1. Install Claude Code

    
    
    npm install -g @anthropic-ai/claude-code  
    

  2. Config Environment Variables

    
    
    export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic  
    export ANTHROPIC_AUTH_TOKEN=${YOUR_API_KEY}  
    export API_TIMEOUT_MS=600000  
    export ANTHROPIC_MODEL=deepseek-chat  
    export ANTHROPIC_SMALL_FAST_MODEL=deepseek-chat  
    export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1  
    

Note: The `API_TIMEOUT_MS` parameter is configured to prevent excessively long outputs that could cause the Claude Code client to time out. Here, we set the timeout duration to 10 minutes.

  3. Enter the Project Directory, and Execute Claude Code

    
    
    cd my-project  
    claude  
    

![](https://cdn.deepseek.com/api-docs/cc_example.png)

## Invoke DeepSeek Model via Anthropic API​

  1. Install Anthropic SDK

    
    
    pip install anthropic  
    

  2. Config Environment Variables

    
    
    export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic  
    export ANTHROPIC_API_KEY=${DEEPSEEK_API_KEY}  
    

  3. Invoke the API

    
    
    import anthropic  
      
    client = anthropic.Anthropic()  
      
    message = client.messages.create(  
        model="deepseek-chat",  
        max_tokens=1000,  
        system="You are a helpful assistant.",  
        messages=[  
            {  
                "role": "user",  
                "content": [  
                    {  
                        "type": "text",  
                        "text": "Hi, how are you?"  
                    }  
                ]  
            }  
        ]  
    )  
    print(message.content)  
    

**Note:** When you pass an unsupported model name to DeepSeek's Anthropic API, the API backend will automatically map it to the `deepseek-chat` model.

## Anthropic API Compatibility Details​

### HTTP Header​

Field| Support Status  
---|---  
anthropic-beta| Ignored  
anthropic-version| Ignored  
x-api-key| Fully Supported  
  
### Simple Fields​

Field| Support Status  
---|---  
model| Use DeepSeek Model Instead  
max_tokens| Fully Supported  
container| Ignored  
mcp_servers| Ignored  
metadata| Ignored  
service_tier| Ignored  
stop_sequences| Fully Supported  
stream| Fully Supported  
system| Fully Supported  
temperature| Fully Supported (range [0.0 ~ 2.0])  
thinking| Supported (`budget_tokens` is ignored)  
top_k| Ignored  
top_p| Fully Supported  
  
### Tool Fields​

#### tools​

Field| Support Status  
---|---  
name| Fully Supported  
input_schema| Fully Supported  
description| Fully Supported  
cache_control| Ignored  
  
#### tool_choice​

Value| Support Status  
---|---  
none| Fully Supported  
auto| Supported (`disable_parallel_tool_use` is ignored)  
any| Supported (`disable_parallel_tool_use` is ignored)  
tool| Supported (`disable_parallel_tool_use` is ignored)  
  
### Message Fields​

Field| Variant| Sub-Field| Support Status  
---|---|---|---  
content |  string | | Fully Supported  
array, type="text"|  text |  Fully Supported   
cache_control |  Ignored   
citations |  Ignored   
array, type="image" | |  Not Supported   
array, type = "document" | |  Not Supported   
array, type = "search_result" | |  Not Supported   
array, type = "thinking" | |  Supported   
array, type="redacted_thinking" | |  Not Supported   
array, type = "tool_use" |  id |  Fully Supported   
input |  Fully Supported   
name |  Fully Supported   
cache_control |  Ignored   
array, type = "tool_result" |  tool_use_id |  Fully Supported   
content |  Fully Supported   
cache_control |  Ignored   
is_error |  Ignored   
array, type = "server_tool_use" | |  Not Supported   
array, type = "web_search_tool_result" | |  Not Supported   
array, type = "code_execution_tool_result" | |  Not Supported   
array, type = "mcp_tool_use" | |  Not Supported   
array, type = "mcp_tool_result" | |  Not Supported   
array, type = "container_upload" | |  Not Supported