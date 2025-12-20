# 结构化输出

<Tip>
  结构化输出（JSON 模式）可以确保 AI 返回符合预定义格式的 JSON 数据，为程序化处理 AI 输出提供可靠保障。
</Tip>

## 功能特性

结构化输出功能为 AI 模型提供了严格的数据格式控制能力，支持多种复杂的数据结构和验证需求。

### 核心参数说明

* **`response_format`**: 指定响应格式，设置为 `{"type": "json_object"}` 启用 JSON 模式
* **`model`**: 使用支持结构化输出的模型，如 `glm-4.5`、`glm-4.6` 等
* **`messages`**: 在系统消息中定义期望的 JSON 结构和字段要求

## 代码示例

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

以下是一个完整的结构化输出示例，演示如何进行情感分析并返回结构化的 JSON 结果：

```python  theme={null}
from zai import ZhipuAiClient
import json

# 初始化客户端
client = ZhipuAiClient(api_key="your-api-key")

# 基础 JSON 模式
response = client.chat.completions.create(
    model="glm-4-plus",
    messages=[
        {
            "role": "system",
            "content": """
            你是一个情感分析专家。请按照以下 JSON 格式返回分析结果：
            {
                "sentiment": "positive/negative/neutral",
                "confidence": 0.95,
                "emotions": ["joy", "excitement"],
                "keywords": ["天气", "心情"],
                "analysis": "详细分析说明"
            }
            """
        },
        {
            "role": "user",
            "content": "请分析这句话的情感：'今天天气真好，心情很愉快！'"
        }
    ],
    response_format={
        "type": "json_object"
    }
)

# 解析结果
result = json.loads(response.choices[0].message.content)
print(f"情感: {result['sentiment']}")
print(f"置信度: {result['confidence']}")
print(f"情绪: {result['emotions']}")
```

## 基础用法

<Tabs>
  <Tab title="简单JSON输出">
    **简单 JSON 输出**

    ```python  theme={null}
    from zai import ZhipuAiClient

    client = ZhipuAiClient(api_key="your-api-key")

    # 基础 JSON 模式
    response = client.chat.completions.create(
        model="glm-4-plus",
        messages=[
            {
                "role": "user",
                "content": "请分析这句话的情感：'今天天气真好，心情很愉快！'"
            }
        ],
        response_format={
            "type": "json_object"
        }
    )

    import json
    result = json.loads(response.choices[0].message.content)
    print(result)
    ```
  </Tab>

  <Tab title="指定JSON结构">
    ### 指定 JSON 结构

    ```python  theme={null}
    # 指定具体的 JSON 结构
    response = client.chat.completions.create(
        model="glm-4-plus",
        messages=[
            {
                "role": "system",
                "content": """
                你是一个情感分析专家。请按照以下 JSON 格式返回分析结果：
                {
                    "sentiment": "positive/negative/neutral",
                    "confidence": 0.95,
                    "emotions": ["joy", "excitement"],
                    "keywords": ["天气", "心情"],
                    "analysis": "详细分析说明"
                }
                """
            },
            {
                "role": "user",
                "content": "请分析这句话的情感：'今天天气真好，心情很愉快！'"
            }
        ],
        response_format={
            "type": "json_object"
        }
    )

    result = json.loads(response.choices[0].message.content)
    print(f"情感: {result['sentiment']}")
    print(f"置信度: {result['confidence']}")
    print(f"情绪: {result['emotions']}")
    ```
  </Tab>

  <Tab title="Schema验证">
    ### 使用 JSON Schema 验证

    ```python  theme={null}
    import jsonschema
    from jsonschema import validate

    # 定义 JSON Schema
    schema = {
        "type": "object",
        "properties": {
            "sentiment": {
                "type": "string",
                "enum": ["positive", "negative", "neutral"]
            },
            "confidence": {
                "type": "number",
                "minimum": 0,
                "maximum": 1
            },
            "emotions": {
                "type": "array",
                "items": {"type": "string"}
            },
            "keywords": {
                "type": "array",
                "items": {"type": "string"}
            },
            "analysis": {
                "type": "string"
            }
        },
        "required": ["sentiment", "confidence", "analysis"]
    }

    def analyze_sentiment_with_validation(text):
        """带验证的情感分析"""
        response = client.chat.completions.create(
            model="glm-4-plus",
            messages=[
                {
                    "role": "system",
                    "content": f"""
                    请按照以下 JSON Schema 格式返回情感分析结果：
                    {json.dumps(schema, indent=2, ensure_ascii=False)}
                    """
                },
                {
                    "role": "user",
                    "content": f"请分析这句话的情感：'{text}'"
                }
            ],
            response_format={"type": "json_object"}
        )
        
        try:
            result = json.loads(response.choices[0].message.content)
            # 验证 JSON 结构
            validate(instance=result, schema=schema)
            return result
        except jsonschema.exceptions.ValidationError as e:
            print(f"JSON 验证失败: {e}")
            return None
        except json.JSONDecodeError as e:
            print(f"JSON 解析失败: {e}")
            return None

    # 使用示例
    result = analyze_sentiment_with_validation("今天天气真好，心情很愉快！")
    if result:
        print("分析结果:", result)
    ```
  </Tab>
</Tabs>

## 场景示例

<Warning>
  在使用 JSON 模式进行数据提取时，请确保输入数据的质量和格式，以获得最佳的提取效果。
</Warning>

<Accordion title="数据提取和结构化完整实现">
  ```python  theme={null}
  class DataExtractor:
      def __init__(self, api_key):
          self.client = ZhipuAiClient(api_key=api_key)
      
      def extract_contact_info(self, text):
          """提取联系信息"""
          schema = {
              "type": "object",
              "properties": {
                  "contacts": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "phone": {"type": "string"},
                              "email": {"type": "string"},
                              "company": {"type": "string"},
                              "position": {"type": "string"},
                              "address": {"type": "string"}
                          },
                          "required": ["name"]
                      }
                  },
                  "total_count": {"type": "integer"},
                  "extraction_confidence": {"type": "number"}
              },
              "required": ["contacts", "total_count"]
          }
          
          response = self.client.chat.completions.create(
              model="glm-4-plus",
              messages=[
                  {
                      "role": "system",
                      "content": f"""
                      你是一个信息提取专家。请从文本中提取所有联系信息，
                      按照以下JSON格式返回：
                      {json.dumps(schema, indent=2, ensure_ascii=False)}
                      
                      注意：
                      - 如果某个字段没有信息，不要包含该字段
                      - phone字段应该是标准化的电话号码格式
                      - email字段应该是有效的邮箱地址
                      - extraction_confidence表示提取的整体置信度(0-1)
                      """
                  },
                  {
                      "role": "user",
                      "content": f"请从以下文本中提取联系信息：\n\n{text}"
                  }
              ],
              response_format={"type": "json_object"}
          )
          
          try:
              result = json.loads(response.choices[0].message.content)["properties"]
              validate(instance=result, schema=schema)
              return result
          except Exception as e:
              print(f"提取失败: {e}")
              return None
      
      def extract_product_info(self, product_description):
          """提取产品信息"""
          schema = {
              "type": "object",
              "properties": {
                  "product_name": {"type": "string"},
                  "brand": {"type": "string"},
                  "category": {"type": "string"},
                  "price": {
                      "type": "object",
                      "properties": {
                          "amount": {"type": "number"},
                          "currency": {"type": "string"},
                          "original_price": {"type": "number"},
                          "discount": {"type": "number"}
                      }
                  },
                  "specifications": {
                      "type": "object",
                      "additionalProperties": True
                  },
                  "features": {
                      "type": "array",
                      "items": {"type": "string"}
                  },
                  "availability": {
                      "type": "object",
                      "properties": {
                          "in_stock": {"type": "boolean"},
                          "quantity": {"type": "integer"},
                          "shipping_time": {"type": "string"}
                      }
                  },
                  "ratings": {
                      "type": "object",
                      "properties": {
                          "average_rating": {"type": "number"},
                          "total_reviews": {"type": "integer"}
                      }
                  }
              },
              "required": ["product_name"]
          }
          
          response = self.client.chat.completions.create(
              model="glm-4-plus",
              messages=[
                  {
                      "role": "system",
                      "content": f"""
                      请从产品描述中提取结构化信息，按照以下格式返回：
                      {json.dumps(schema, indent=2, ensure_ascii=False)}
                      
                      注意：
                      - 价格信息要准确提取数值和货币单位
                      - specifications中包含所有技术规格
                      - features列出主要功能特点
                      - 如果信息不明确，不要猜测
                      """
                  },
                  {
                      "role": "user",
                      "content": f"产品描述：\n{product_description}"
                  }
              ],
              response_format={"type": "json_object"}
          )
          
          try:
              result = json.loads(response.choices[0].message.content)
              validate(instance=result, schema=schema)
              return result
          except Exception as e:
              print(f"产品信息提取失败: {e}")
              return None
      
      def extract_event_info(self, event_text):
          """提取事件信息"""
          schema = {
              "type": "object",
              "properties": {
                  "events": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "title": {"type": "string"},
                              "description": {"type": "string"},
                              "start_time": {"type": "string"},
                              "end_time": {"type": "string"},
                              "location": {"type": "string"},
                              "organizer": {"type": "string"},
                              "participants": {
                                  "type": "array",
                                  "items": {"type": "string"}
                              },
                              "category": {"type": "string"},
                              "priority": {
                                  "type": "string",
                                  "enum": ["high", "medium", "low"]
                              },
                              "status": {
                                  "type": "string",
                                  "enum": ["scheduled", "ongoing", "completed", "cancelled"]
                              }
                          },
                          "required": ["title", "start_time"]
                      }
                  }
              },
              "required": ["events"]
          }
          
          response = self.client.chat.completions.create(
              model="glm-4-plus",
              messages=[
                  {
                      "role": "system",
                      "content": f"""
                      请从文本中提取所有事件信息，按照以下格式返回：
                      {json.dumps(schema, indent=2, ensure_ascii=False)}
                      
                      时间格式要求：
                      - 使用ISO 8601格式：YYYY-MM-DDTHH:MM:SS
                      - 如果只有日期，使用：YYYY-MM-DD
                      - 如果时间不明确，尽量推断合理的时间
                      """
                  },
                  {
                      "role": "user",
                      "content": f"请提取以下文本中的事件信息：\n\n{event_text}"
                  }
              ],
              response_format={"type": "json_object"}
          )
          
          try:
              result = json.loads(response.choices[0].message.content)
              validate(instance=result, schema=schema)
              return result
          except Exception as e:
              print(f"事件信息提取失败: {e}")
              return None

  # 使用示例
  extractor = DataExtractor("your_api_key")

  # 提取联系信息
  contact_text = """
  张三，手机：13800138000，邮箱：zhangsan@example.com，
  在北京科技有限公司担任技术总监。
  公司地址：北京市朝阳区科技园区123号。

  李四，电话：010-12345678，工作邮箱：lisi@company.com，
  是上海创新公司的产品经理。
  """

  contacts = extractor.extract_contact_info(contact_text)
  if contacts:
      print(f"提取到 {contacts['total_count']} 个联系人")
      for contact in contacts['contacts']:
          print(f"姓名: {contact['name']}")
          if 'phone' in contact:
              print(f"电话: {contact['phone']}")
  ```
</Accordion>

<Accordion title="API响应格式化完整实现">
  ```python  theme={null}
  class APIResponseFormatter:
      def __init__(self, api_key):
          self.client = ZhipuAiClient(api_key=api_key)
      
      def format_search_results(self, query, raw_results):
          """格式化搜索结果"""
          schema = {
              "type": "object",
              "properties": {
                  "query": {"type": "string"},
                  "total_results": {"type": "integer"},
                  "results": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "title": {"type": "string"},
                              "url": {"type": "string"},
                              "snippet": {"type": "string"},
                              "relevance_score": {"type": "number"},
                              "source_type": {"type": "string"},
                              "publish_date": {"type": "string"},
                              "tags": {
                                  "type": "array",
                                  "items": {"type": "string"}
                              }
                          },
                          "required": ["title", "url", "snippet"]
                      }
                  },
                  "suggestions": {
                      "type": "array",
                      "items": {"type": "string"}
                  },
                  "filters": {
                      "type": "object",
                      "properties": {
                          "date_range": {"type": "string"},
                          "source_types": {
                              "type": "array",
                              "items": {"type": "string"}
                          },
                          "languages": {
                              "type": "array",
                              "items": {"type": "string"}
                          }
                      }
                  }
              },
              "required": ["query", "total_results", "results"]
          }
          
          response = self.client.chat.completions.create(
              model="glm-4-plus",
              messages=[
                  {
                      "role": "system",
                      "content": f"""
                      请将搜索结果格式化为标准的JSON格式：
                      {json.dumps(schema, indent=2, ensure_ascii=False)}
                      
                      要求：
                      - 计算每个结果的相关性评分(0-1)
                      - 识别内容类型(article, video, image, document等)
                      - 提取发布日期(如果有)
                      - 生成相关标签
                      - 提供搜索建议
                      """
                  },
                  {
                      "role": "user",
                      "content": f"查询: {query}\n\n原始结果:\n{raw_results}"
                  }
              ],
              response_format={"type": "json_object"}
          )
          
          try:
              result = json.loads(response.choices[0].message.content)
              validate(instance=result, schema=schema)
              return result
          except Exception as e:
              print(f"格式化失败: {e}")
              return None
      
      def format_analytics_data(self, raw_data, metrics):
          """格式化分析数据"""
          schema = {
              "type": "object",
              "properties": {
                  "summary": {
                      "type": "object",
                      "properties": {
                          "total_records": {"type": "integer"},
                          "date_range": {
                              "type": "object",
                              "properties": {
                                  "start_date": {"type": "string"},
                                  "end_date": {"type": "string"}
                              }
                          },
                          "key_insights": {
                              "type": "array",
                              "items": {"type": "string"}
                          }
                      }
                  },
                  "metrics": {
                      "type": "object",
                      "additionalProperties": {
                          "type": "object",
                          "properties": {
                              "current_value": {"type": "number"},
                              "previous_value": {"type": "number"},
                              "change_percentage": {"type": "number"},
                              "trend": {
                                  "type": "string",
                                  "enum": ["up", "down", "stable"]
                              },
                              "unit": {"type": "string"}
                          }
                      }
                  },
                  "time_series": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "timestamp": {"type": "string"},
                              "values": {
                                  "type": "object",
                                  "additionalProperties": {"type": "number"}
                              }
                          }
                      }
                  },
                  "segments": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "value": {"type": "number"},
                              "percentage": {"type": "number"},
                              "color": {"type": "string"}
                          }
                      }
                  }
              },
              "required": ["summary", "metrics"]
          }
          
          response = self.client.chat.completions.create(
              model="glm-4-plus",
              messages=[
                  {
                      "role": "system",
                      "content": f"""
                      请将分析数据格式化为标准格式：
                      {json.dumps(schema, indent=2, ensure_ascii=False)}
                      
                      关注指标：{', '.join(metrics)}
                      
                      要求：
                      - 计算变化百分比和趋势
                      - 提供关键洞察
                      - 时间序列数据按时间排序
                      - 分段数据包含百分比
                      """
                  },
                  {
                      "role": "user",
                      "content": f"原始数据：\n{raw_data}"
                  }
              ],
              response_format={"type": "json_object"}
          )
          
          try:
              result = json.loads(response.choices[0].message.content)
              validate(instance=result, schema=schema)
              return result
          except Exception as e:
              print(f"分析数据格式化失败: {e}")
              return None

  # 使用示例
  formatter = APIResponseFormatter("your_api_key")

  # 格式化搜索结果
  raw_search = """
  1. Python编程入门教程 - https://example.com/python-tutorial
     详细介绍Python基础语法和编程概念...

  2. Python数据分析实战 - https://example.com/python-data
     使用pandas和numpy进行数据处理...
  """

  formatted_results = formatter.format_search_results("Python教程", raw_search)
  if formatted_results:
      print(f"找到 {formatted_results['total_results']} 个结果")
      for result in formatted_results['results']:
          print(f"标题: {result['title']}")
          print(f"相关性: {result['relevance_score']}")
  ```
</Accordion>

<Accordion title="配置管理和验证完整实现">
  ```python  theme={null}
  class ConfigurationManager:
      def __init__(self, api_key):
          self.client = ZhipuAiClient(api_key=api_key)

      def parse_config_file(self, config_text, config_type="general"):
          """解析配置文件"""
          schemas = {
              "database": {
                  "type": "object",
                  "properties": {
                      "connections": {
                          "type": "array",
                          "items": {
                              "type": "object",
                              "properties": {
                                  "name": {"type": "string"},
                                  "host": {"type": "string"},
                                  "port": {"type": "integer"},
                                  "database": {"type": "string"},
                                  "username": {"type": "string"},
                                  "ssl": {"type": "boolean"},
                                  "pool_size": {"type": "integer"}
                              },
                              "required": ["name", "host", "database"]
                          }
                      },
                      "settings": {
                          "type": "object",
                          "properties": {
                              "timeout": {"type": "integer"},
                              "retry_attempts": {"type": "integer"},
                              "log_level": {
                                  "type": "string",
                                  "enum": ["DEBUG", "INFO", "WARNING", "ERROR"]
                              }
                          }
                      }
                  },
                  "required": ["connections"]
              },
              "api": {
                  "type": "object",
                  "properties": {
                      "endpoints": {
                          "type": "array",
                          "items": {
                              "type": "object",
                              "properties": {
                                  "name": {"type": "string"},
                                  "url": {"type": "string"},
                                  "method": {
                                      "type": "string",
                                      "enum": ["GET", "POST", "PUT", "DELETE"]
                                  },
                                  "headers": {"type": "object"},
                                  "timeout": {"type": "integer"},
                                  "rate_limit": {"type": "integer"}
                              },
                              "required": ["name", "url", "method"]
                          }
                      },
                      "authentication": {
                          "type": "object",
                          "properties": {
                              "type": {
                                  "type": "string",
                                  "enum": ["bearer", "basic", "api_key"]
                              },
                              "credentials": {"type": "object"}
                          }
                      }
                  },
                  "required": ["endpoints"]
              }
          }
          
          schema = schemas.get(config_type, {
              "type": "object",
              "additionalProperties": True
          })
          
          response = self.client.chat.completions.create(
              model="glm-4-plus",
              messages=[
                  {
                      "role": "system",
                      "content": f"""
                      请解析配置文件并转换为JSON格式：
                      {json.dumps(schema, indent=2, ensure_ascii=False)}
                      
                      配置类型：{config_type}
                      
                      要求：
                      - 识别配置项和值
                      - 转换数据类型（字符串、数字、布尔值）
                      - 处理数组和嵌套对象
                      - 验证必需字段
                      - 提供默认值（如适用）
                      """
                  },
                  {
                      "role": "user",
                      "content": f"配置文件内容：\n{config_text}"
                  }
              ],
              response_format={"type": "json_object"}
          )
          
          try:
              result = json.loads(response.choices[0].message.content)
              validate(instance=result, schema=schema)
              return result
          except Exception as e:
              print(f"配置解析失败: {e}")
              return None
      
      def validate_configuration(self, config_data, validation_rules):
          """验证配置"""
          response = self.client.chat.completions.create(
              model="glm-4-plus",
              messages=[
                  {
                      "role": "system",
                      "content": f"""
                      请验证配置数据并返回验证结果：
                      
                      返回格式：
                      {{
                          "is_valid": true/false,
                          "errors": [
                              {{
                                  "field": "字段名",
                                  "error": "错误描述",
                                  "severity": "error/warning/info"
                              }}
                          ],
                          "warnings": [
                              {{
                                  "field": "字段名",
                                  "message": "警告信息"
                              }}
                          ],
                          "suggestions": [
                              "改进建议1",
                              "改进建议2"
                          ]
                      }}
                      
                      验证规则：{validation_rules}
                      """
                  },
                  {
                      "role": "user",
                      "content": f"配置数据：\n{json.dumps(config_data, indent=2, ensure_ascii=False)}"
                  }
              ],
              response_format={"type": "json_object"}
          )
          
          try:
              result = json.loads(response.choices[0].message.content)
              return result
          except Exception as e:
              print(f"配置验证失败: {e}")
              return None

  # 使用示例
  config_manager = ConfigurationManager("your_api_key")

  # 解析数据库配置
  db_config_text = """
  [database]
  host = localhost
  port = 5432
  database = myapp
  username = admin
  ssl = true
  pool_size = 10

  [settings]
  timeout = 30
  retry_attempts = 3
  log_level = INFO
  """

  config = config_manager.parse_config_file(db_config_text, "database")
  if config:
      print("解析的配置:", json.dumps(config, indent=2, ensure_ascii=False))
      
      # 验证配置
      validation_rules = [
          "端口号必须在1-65535范围内",
          "数据库名不能为空",
          "连接池大小应该大于0",
          "超时时间应该合理（1-300秒）"
      ]
      
      validation_result = config_manager.validate_configuration(config, validation_rules)
      if validation_result:
          print(f"配置有效性: {validation_result['is_valid']}")
          if validation_result['errors']:
              print("错误:", validation_result['errors'])
          if validation_result['warnings']:
              print("警告:", validation_result['warnings'])
  ```
</Accordion>

## 实践建议

<CardGroup cols={2}>
  <Card title="Schema设计原则" icon={<svg style={{maskImage: "url(/resource/icon/code.svg)", WebkitMaskImage: "url(/resource/icon/code.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    * 明确性：字段名称和类型要清晰明确
    * 完整性：包含所有必要的验证规则
    * 灵活性：考虑未来的扩展需求
  </Card>

  <Card title="错误处理策略" icon={<svg style={{maskImage: "url(/resource/icon/shield-check.svg)", WebkitMaskImage: "url(/resource/icon/shield-check.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    * 多层验证：Schema验证 + 业务逻辑验证
    * 降级方案：准备简化的备用Schema
    * 日志记录：详细记录错误信息
  </Card>
</CardGroup>

<Warning>
  JSON模式要求AI严格按照指定格式输出，但在某些复杂场景下可能影响回答的自然性。建议在功能性和用户体验之间找到平衡点。
</Warning>

<Tip>
  设计JSON Schema时，建议从简单结构开始，逐步增加复杂性。同时，为关键字段提供详细的描述和示例，有助于AI更好地理解和生成符合要求的JSON数据。
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt