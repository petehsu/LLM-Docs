# 工具调用

<Tip>
  工具调用（Function Calling）允许 AI 模型调用外部函数和 API，极大扩展了智能体的能力边界，使其能够执行具体操作和获取实时数据。
</Tip>

## 功能特性

函数调用功能为 AI 模型提供了与外部系统交互的能力，支持多种复杂的应用场景和集成需求。

### 核心参数说明

* **`tools`**: 定义可调用的函数列表，包含函数名、描述和参数规范
* **`tool_choice`**: 控制函数调用策略， 默认且仅支持 `auto`
* **`model`**: 使用支持函数调用的模型，如 `glm-4-plus`、`glm-4.6` 等

### 响应参数说明

函数调用响应中的关键字段：

* **`tool_calls`**: 包含模型决定调用的函数信息
* **`function.name`**: 被调用的函数名称
* **`function.arguments`**: 函数调用参数（JSON 格式字符串）
* **`id`**: 工具调用的唯一标识符

## 代码示例

通过定义函数工具和处理函数调用，可以让 AI 模型执行各种外部操作：

<Tabs>
  <Tab title="Python SDK">
    **安装 SDK**

    ```bash  theme={null}
    # 安装最新版本
    pip install zai-sdk

    # 或指定版本
    pip install zai-sdk==0.1.0
    ```

    **验证安装**

    ```python  theme={null}
    import zai
    print(zai.__version__)
    ```

    **完整示例**

    ```python  theme={null}
    import json
    from zai import ZhipuAiClient

    # 初始化客户端
    client = ZhipuAiClient(api_key='您的apikey')

    # 定义天气查询函数
    def get_weather(city: str) -> dict:
        """获取指定城市的天气信息"""
        # 这里应该调用真实的天气 API
        weather_data = {
            "city": city,
            "temperature": "22°C",
            "condition": "晴天",
            "humidity": "65%",
            "wind_speed": "5 km/h"
        }
        return weather_data

    # 定义函数工具
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "获取指定城市的当前天气信息",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": {
                            "type": "string",
                            "description": "城市名称，例如：北京、上海"
                        }
                    },
                    "required": ["city"]
                }
            }
        }
    ]

    # 发起对话请求
    response = client.chat.completions.create(
        model="glm-4-plus",  # 使用支持函数调用的模型
        messages=[
            {"role": "user", "content": "北京今天天气怎么样？"}
        ],
        tools=tools,         # 传入函数工具
        tool_choice="auto"   # 自动选择是否调用函数
    )

    # 处理函数调用
    message = response.choices[0].message
    messages = [{"role": "user", "content": "北京今天天气怎么样？"}]
    messages.append(message.model_dump())

    if message.tool_calls:
        for tool_call in message.tool_calls:
            if tool_call.function.name == "get_weather":
                # 解析参数并调用函数
                args = json.loads(tool_call.function.arguments)
                weather_result = get_weather(args.get("city"))
                
                # 将函数结果返回给模型
                messages.append({
                    "role": "tool",
                    "content": json.dumps(weather_result, ensure_ascii=False),
                    "tool_call_id": tool_call.id
                })
        
        # 获取最终回答
        final_response = client.chat.completions.create(
            model="glm-4-plus",
            messages=messages,
            tools=tools
        )
        
        print(final_response.choices[0].message.content)
    else:
        print(message.content)
    ```
  </Tab>
</Tabs>

## 场景示例

<Warning>
  在使用函数调用时，请确保对外部 API 和数据库操作进行适当的安全验证和权限控制。
</Warning>

<Accordion title="多功能助手">
  ```python  theme={null}
  import json
  import requests
  from datetime import datetime
  from zai import ZhipuAiClient

  class FunctionAgent:
      def __init__(self, api_key):
          self.client = ZhipuAiClient(api_key=api_key)
          self.tools = self._define_tools()
      
      def _define_tools(self):
          return [
              {
                  "type": "function",
                  "function": {
                      "name": "get_current_time",
                      "description": "获取当前时间",
                      "parameters": {
                          "type": "object",
                          "properties": {},
                          "required": []
                      }
                  }
              },
              {
                  "type": "function",
                  "function": {
                      "name": "calculate",
                      "description": "执行数学计算",
                      "parameters": {
                          "type": "object",
                          "properties": {
                              "expression": {
                                  "type": "string",
                                  "description": "数学表达式，如：2+3*4"
                              }
                          },
                          "required": ["expression"]
                      }
                  }
              },
              {
                  "type": "function",
                  "function": {
                      "name": "search_web",
                      "description": "搜索网络信息",
                      "parameters": {
                          "type": "object",
                          "properties": {
                              "query": {
                                  "type": "string",
                                  "description": "搜索关键词"
                              }
                          },
                          "required": ["query"]
                      }
                  }
              }
          ]
      
      def get_current_time(self):
          """获取当前时间"""
          return {
              "current_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
              "timezone": "Asia/Shanghai"
          }
      
      def calculate(self, expression: str):
          """安全的数学计算"""
          try:
              # 简单的安全检查
              allowed_chars = set('0123456789+-*/().')
              if not all(c in allowed_chars or c.isspace() for c in expression):
                  return {"error": "表达式包含不允许的字符"}
              
              result = eval(expression)
              return {
                  "expression": expression,
                  "result": result
              }
          except Exception as e:
              return {"error": f"计算错误: {str(e)}"}
      
      def search_web(self, query: str):
          """模拟网络搜索"""
          # 这里应该调用真实的搜索 API
          return {
              "query": query,
              "results": [
                  {"title": f"关于{query}的搜索结果1", "url": "https://example1.com"},
                  {"title": f"关于{query}的搜索结果2", "url": "https://example2.com"}
              ]
          }
      
      def execute_function(self, function_name: str, arguments: dict):
          """执行函数调用"""
          if function_name == "get_current_time":
              return self.get_current_time()
          elif function_name == "calculate":
              return self.calculate(arguments.get("expression", ""))
          elif function_name == "search_web":
              return self.search_web(arguments.get("query", ""))
          else:
              return {"error": f"未知函数: {function_name}"}
      
      def chat(self, user_message: str):
          """处理用户消息"""
          messages = [{"role": "user", "content": user_message}]
          
          response = self.client.chat.completions.create(
              model="glm-4-plus",
              messages=messages,
              tools=self.tools,
              tool_choice="auto"
          )
          
          message = response.choices[0].message
          messages.append(message.model_dump())
          
          # 处理函数调用
          if message.tool_calls:
              for tool_call in message.tool_calls:
                  function_name = tool_call.function.name
                  arguments = json.loads(tool_call.function.arguments)
                  
                  # 执行函数
                  result = self.execute_function(function_name, arguments)
                  
                  # 添加函数结果
                  messages.append({
                      "role": "tool",
                      "content": json.dumps(result, ensure_ascii=False),
                      "tool_call_id": tool_call.id
                  })
              
              # 获取最终回答
              final_response = self.client.chat.completions.create(
                  model="glm-4-plus",
                  messages=messages,
                  tools=self.tools
              )
              
              return final_response.choices[0].message.content
          else:
              return message.content

  # 使用示例
  agent = FunctionAgent("your_api_key")

  # 测试不同类型的请求
  print(agent.chat("现在几点了？"))
  print(agent.chat("帮我计算 15 * 23 + 7"))
  print(agent.chat("搜索一下人工智能的最新发展"))
  ```
</Accordion>

<Accordion title="数据库查询">
  ```python  theme={null}
  import sqlite3

  def query_database(sql: str) -> dict:
      """执行数据库查询"""
      try:
          conn = sqlite3.connect('example.db')
          cursor = conn.cursor()
          cursor.execute(sql)
          results = cursor.fetchall()
          conn.close()
          
          return {
              "success": True,
              "data": results,
              "row_count": len(results)
          }
      except Exception as e:
          return {
              "success": False,
              "error": str(e)
          }

  # 函数定义
  db_tool = {
      "type": "function",
      "function": {
          "name": "query_database",
          "description": "执行SQL查询",
          "parameters": {
              "type": "object",
              "properties": {
                  "sql": {
                      "type": "string",
                      "description": "SQL查询语句"
                  }
              },
              "required": ["sql"]
          }
      }
  }
  ```
</Accordion>

<Accordion title="文件操作">
  ```python  theme={null}
  import os
  import json

  def file_operations(operation: str, file_path: str, content: str = None) -> dict:
      """文件操作函数"""
      try:
          if operation == "read":
              with open(file_path, 'r', encoding='utf-8') as f:
                  content = f.read()
              return {"success": True, "content": content}
          
          elif operation == "write":
              with open(file_path, 'w', encoding='utf-8') as f:
                  f.write(content)
              return {"success": True, "message": "文件写入成功"}
          
          elif operation == "list":
              files = os.listdir(file_path)
              return {"success": True, "files": files}
          
          else:
              return {"success": False, "error": "不支持的操作"}
      
      except Exception as e:
          return {"success": False, "error": str(e)}

  # 函数定义
  file_tool = {
      "type": "function",
      "function": {
          "name": "file_operations",
          "description": "执行文件操作",
          "parameters": {
              "type": "object",
              "properties": {
                  "operation": {
                      "type": "string",
                      "enum": ["read", "write", "list"],
                      "description": "操作类型"
                  },
                  "file_path": {
                      "type": "string",
                      "description": "文件路径"
                  },
                  "content": {
                      "type": "string",
                      "description": "写入的内容（仅写入操作需要）"
                  }
              },
              "required": ["operation", "file_path"]
          }
      }
  }
  ```
</Accordion>

<Accordion title="API集成">
  ```python  theme={null}
  import requests

  def call_external_api(url: str, method: str = "GET", headers: dict = None, data: dict = None) -> dict:
      """调用外部 API"""
      try:
          if method.upper() == "GET":
              response = requests.get(url, headers=headers, params=data)
          elif method.upper() == "POST":
              response = requests.post(url, headers=headers, json=data)
          else:
              return {"success": False, "error": "不支持的HTTP方法"}
          
          return {
              "success": True,
              "status_code": response.status_code,
              "data": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
          }
      
      except Exception as e:
          return {"success": False, "error": str(e)}

  # 函数定义
  api_tool = {
      "type": "function",
      "function": {
          "name": "call_external_api",
          "description": "调用外部 API",
          "parameters": {
              "type": "object",
              "properties": {
                  "url": {
                      "type": "string",
                      "description": "API 端点 URL"
                  },
                  "method": {
                      "type": "string",
                      "enum": ["GET", "POST"],
                      "description": "HTTP 方法"
                  },
                  "headers": {
                      "type": "object",
                      "description": "请求头"
                  },
                  "data": {
                      "type": "object",
                      "description": "请求数据"
                  }
              },
              "required": ["url"]
          }
      }
  }
  ```
</Accordion>

## 实践建议

<CardGroup cols={2}>
  <Card title="函数设计原则" icon={<svg style={{maskImage: "url(/resource/icon/code.svg)", WebkitMaskImage: "url(/resource/icon/code.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    * 单一职责：每个函数只做一件事
    * 清晰命名：函数名和参数名要有意义
    * 完整描述：提供详细的函数和参数描述
  </Card>

  <Card title="安全考虑" icon={<svg style={{maskImage: "url(/resource/icon/shield.svg)", WebkitMaskImage: "url(/resource/icon/shield.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    * 输入验证：严格验证所有输入参数
    * 权限控制：限制函数的访问权限
    * 日志记录：记录函数调用日志
  </Card>
</CardGroup>

### 参数设计

```python  theme={null}
# 好的参数设计
{
    "type": "object",
    "properties": {
        "city": {
            "type": "string",
            "description": "城市名称，支持中英文，如：北京、Beijing",
            "examples": ["北京", "上海", "New York"]
        },
        "unit": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"],
            "description": "温度单位",
            "default": "celsius"
        }
    },
    "required": ["city"]
}
```

### 错误处理

```python  theme={null}
def robust_function(param: str) -> dict:
    """健壮的函数实现"""
    try:
        # 参数验证
        if not param or not isinstance(param, str):
            return {
                "success": False,
                "error": "参数无效",
                "error_code": "INVALID_PARAM"
            }
        
        # 业务逻辑
        result = process_data(param)
        
        return {
            "success": True,
            "data": result,
            "timestamp": datetime.now().isoformat()
        }
    
    except ValueError as e:
        return {
            "success": False,
            "error": f"数据错误: {str(e)}",
            "error_code": "DATA_ERROR"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"系统错误: {str(e)}",
            "error_code": "SYSTEM_ERROR"
        }
```

### 输入验证

```python  theme={null}
def secure_function(user_input: str) -> dict:
    """安全的函数实现"""
    # 输入长度限制
    if len(user_input) > 1000:
        return {"error": "输入过长"}
    
    # 危险字符过滤
    dangerous_chars = ['<', '>', '&', '"', "'"]
    if any(char in user_input for char in dangerous_chars):
        return {"error": "输入包含危险字符"}
    
    # SQL 注入防护
    sql_keywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT']
    if any(keyword in user_input.upper() for keyword in sql_keywords):
        return {"error": "输入包含危险关键词"}
    
    return {"success": True, "processed_input": user_input}
```

### 权限控制

```python  theme={null}
def check_permissions(user_id: str, operation: str) -> bool:
    """检查用户权限"""
    user_permissions = get_user_permissions(user_id)
    return operation in user_permissions

def protected_function(user_id: str, operation: str, data: dict) -> dict:
    """需要权限验证的函数"""
    if not check_permissions(user_id, operation):
        return {
            "success": False,
            "error": "权限不足",
            "error_code": "PERMISSION_DENIED"
        }
    
    # 执行操作
    return perform_operation(operation, data)
```

<Tip>
  建议为每个函数提供详细的文档和示例，帮助模型更好地理解函数的用途和使用方法。
</Tip>

<Warning>
  函数调用涉及代码执行，请确保实现适当的安全措施，包括输入验证、权限控制和错误处理。
</Warning>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt