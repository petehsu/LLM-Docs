# 文本合成

> 使用本接口，调用文本模型创建对话补全。



## OpenAPI

````yaml api-reference/text/api/openapi.json post /v1/text/chatcompletion_v2
openapi: 3.1.0
info:
  title: MiniMax Text API
  description: >-
    MiniMax text generation API with support for chat completion and streaming
    output
  license:
    name: MIT
  version: 1.0.0
servers:
  - url: https://api.minimaxi.com
security:
  - bearerAuth: []
paths:
  /v1/text/chatcompletion_v2:
    post:
      tags:
        - Text Generation
      summary: Text Generation V2
      operationId: chatCompletionV2
      parameters:
        - name: Content-Type
          in: header
          required: true
          description: 请求体的媒介类型，请设置为 `application/json`，确保请求数据的格式为 JSON
          schema:
            type: string
            enum:
              - application/json
            default: application/json
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatCompletionReq'
            examples:
              Request:
                value:
                  model: MiniMax-M1
                  messages:
                    - role: system
                      name: MiniMax AI
                    - role: user
                      name: 用户
                      content: 你好
              Stream:
                value:
                  model: MiniMax-M1
                  messages:
                    - role: system
                      name: MiniMax AI
                    - role: user
                      name: 用户
                      content: 你好
                  stream: true
              Image:
                value:
                  model: MiniMax-Text-01
                  messages:
                    - role: system
                      name: MiniMax AI
                      content: >-
                        MM智能助理是一款由MiniMax自研的，没有调用其他产品的接口的大型语言模型。MiniMax是一家中国科技公司，一直致力于进行大模型相关的研究。
                    - role: user
                      name: User
                      content:
                        - type: text
                          text: 这个图代表的是什么呢
                        - type: image_url
                          image_url:
                            url: >-
                              https://cdn.hailuoai.com/prod/2024-09-18-16/user/multi_chat_file/9c0b5c14-ee88-4a5b-b503-4f626f018639.jpeg
        required: true
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChatCompletionResp'
              examples:
                Request:
                  value:
                    id: 04ecb5d9b1921ae0fb0e8da9017a5474
                    choices:
                      - finish_reason: stop
                        index: 0
                        message:
                          content: 您好！请问有什么可以帮您？
                          role: assistant
                          name: MiniMax AI
                          audio_content: ''
                          reasoning_content: ...省略
                    created: 1755153113
                    model: MiniMax-M1
                    object: chat.completion
                    usage:
                      total_tokens: 249
                      total_characters: 0
                      prompt_tokens: 26
                      completion_tokens: 223
                      completion_tokens_details:
                        reasoning_tokens: 214
                    input_sensitive: false
                    output_sensitive: false
                    input_sensitive_type: 0
                    output_sensitive_type: 0
                    output_sensitive_int: 0
                    base_resp:
                      status_code: 0
                      status_msg: ''
                Stream:
                  value:
                    - id: 02ff7eb7fe6fb505b9d5cb6945a1a98b
                      choices:
                        - index: 0
                          delta:
                            content: 你好
                            role: assistant
                      created: 1722829751
                      model: MiniMax-M1
                      object: chat.completion.chunk
                      output_sensitive: false
                      input_sensitive_type: 0
                      output_sensitive_type: 0
                    - id: 02ff7eb7fe6fb505b9d5cb6945a1a98b
                      choices:
                        - finish_reason: stop
                          index: 0
                          delta:
                            content: ！有什么可以帮助你的吗？
                            role: assistant
                      created: 1722829751
                      model: MiniMax-M1
                      object: chat.completion.chunk
                      output_sensitive: false
                      input_sensitive_type: 0
                      output_sensitive_type: 0
                    - id: 02ff7eb7fe6fb505b9d5cb6945a1a98b
                      choices:
                        - finish_reason: stop
                          index: 0
                          message:
                            content: 你好！有什么可以帮助你的吗？
                            role: assistant
                      created: 1722829751
                      model: MiniMax-M1
                      object: chat.completion
                      usage:
                        total_tokens: 73
                      input_sensitive: false
                      output_sensitive: false
                      input_sensitive_type: 0
                      output_sensitive_type: 0
                      base_resp:
                        status_code: 0
                        status_msg: ''
                Image:
                  value:
                    content: >-
                      这张图片展示了一只可爱的仓鼠，它正在喝一杯茶。仓鼠站在一个小桌子上，桌子上铺着一块编织垫子，旁边还有两盆小植物。背景中有一个时钟，整个场景看起来非常温馨和有趣。这种图片通常用来表达一种轻松、愉快和可爱的氛围，给人带来愉悦的感觉。
                    role: assistant
                    name: MiniMax AI
                    audio_content: ''
            text/event-stream:
              schema:
                $ref: '#/components/schemas/ChatCompletionResp'
              examples:
                Stream:
                  value:
                    - id: 02ff7eb7fe6fb505b9d5cb6945a1a98b
                      choices:
                        - index: 0
                          delta:
                            content: 你好
                            role: assistant
                      created: 1722829751
                      model: MiniMax-M1
                      object: chat.completion.chunk
                      output_sensitive: false
                      input_sensitive_type: 0
                      output_sensitive_type: 0
                    - id: 02ff7eb7fe6fb505b9d5cb6945a1a98b
                      choices:
                        - finish_reason: stop
                          index: 0
                          delta:
                            content: ！有什么可以帮助你的吗？
                            role: assistant
                      created: 1722829751
                      model: MiniMax-M1
                      object: chat.completion.chunk
                      output_sensitive: false
                      input_sensitive_type: 0
                      output_sensitive_type: 0
                    - id: 02ff7eb7fe6fb505b9d5cb6945a1a98b
                      choices:
                        - finish_reason: stop
                          index: 0
                          message:
                            content: 你好！有什么可以帮助你的吗？
                            role: assistant
                      created: 1722829751
                      model: MiniMax-M1
                      object: chat.completion
                      usage:
                        total_tokens: 73
                      input_sensitive: false
                      output_sensitive: false
                      input_sensitive_type: 0
                      output_sensitive_type: 0
                      base_resp:
                        status_code: 0
                        status_msg: ''
components:
  schemas:
    ChatCompletionReq:
      type: object
      required:
        - model
        - messages
      properties:
        model:
          type: string
          description: >-
            模型 ID。可选值：`MiniMax-M2`, `MiniMax-M1`, `MiniMax-Text-01`
            。注：`MiniMax-M2` 和 `MiniMax-M1` 为推理模型，为获得最佳体验建议使用流式输出
          enum:
            - MiniMax-M2
            - MiniMax-M1
            - MiniMax-Text-01
        stream:
          type: boolean
          description: 是否使用流式传输，默认为 `false`。设置为 `true` 后，响应将分批返回
          default: false
        max_tokens:
          type: integer
          format: int64
          description: >-
            废弃参数，请使用`max_completion_tokens`


            指定生成内容长度的上限（Token 数）。超过上限的内容会被截断。如果生成因 `length` 原因中断，请尝试调高此值

            默认值：`MiniMax-M2` 为 10240，`MiniMax-M1` 为 8192，`MiniMax-Text-01` 为
            2048
          minimum: 1
          deprecated: true
        max_completion_tokens:
          type: integer
          format: int64
          description: >-
            指定生成内容长度的上限（Token 数）。超过上限的内容会被截断。如果生成因 `length` 原因中断，请尝试调高此值

            默认值：`MiniMax-M2` 为 10240，`MiniMax-M1` 为 8192，`MiniMax-Text-01` 为
            2048。
          minimum: 1
        temperature:
          type: number
          format: double
          description: |-
            温度系数，影响输出随机性，取值范围 (0, 1]，取值范围 (0, 1]。值越高，输出越随机；值越低，输出越确定
            `MiniMax-M2` 推荐使用 1.0
            `MiniMax-M1` 默认值为 1.0，推荐范围 [0.8, 1.0]
            `MiniMax-Text-01` 默认值为 0.1，适用于答案明确的场景，对于文案生成等发散性场景可适当调高至 0.7-1.0
          minimum: 0
          exclusiveMinimum: 0
          maximum: 1
        top_p:
          type: number
          format: double
          description: 采样策略，影响输出随机性，取值范围 (0, 1]，各模型默认为 0.95，`MiniMax-M2` 推荐使用 0.95
          minimum: 0
          exclusiveMinimum: 0
          maximum: 1
          default: 0.95
        messages:
          type: array
          description: 包含对话历史的消息列表
          items:
            $ref: '#/components/schemas/Message'
        tools:
          type: array
          description: >-
            可供模型选择调用的工具列表。更多详情参考 [M2 工具使用 & Interleaved
            Thinking](/guides/text-m2-function-call)
          items:
            type: object
            required:
              - type
              - function
            properties:
              type:
                type: string
                description: 工具类型，当前仅支持 `function`
                enum:
                  - function
              function:
                type: object
                required:
                  - name
                  - description
                  - parameters
                properties:
                  name:
                    type: string
                    description: 函数名称
                  description:
                    type: string
                    description: 对函数功能的描述
                  parameters:
                    type: object
                    description: 函数的参数
        tool_choice:
          type: string
          description: 控制模型如何使用工具。`none` (不调用) 或 `auto` (自主决定)
          enum:
            - none
            - auto
          default: auto
        response_format:
          type: object
          description: >-
            指定模型输出的格式，当前仅 `MiniMax-Text-01` 支持此参数

            设置为 `{ "type": "json_schema", "json_schema": {...} }` 可强制模型按指定的 JSON
            Schema 结构输出
          required:
            - type
            - json_schema
          properties:
            type:
              type: string
              description: 格式类型，仅支持 `json_schema`
              enum:
                - json_schema
            json_schema:
              type: object
              description: 定义输出格式的 JSON Schema 对象
              required:
                - name
                - schema
              properties:
                name:
                  type: string
                  description: |-
                    格式名称。
                    - 须由a-z、A-Z、0-9 组成
                    - 最大长度为64字符
                  maxLength: 64
                  pattern: ^\w+$
                description:
                  type: string
                  description: 格式的描述。用于模型确定如何以该格式进行输出
                schema:
                  type: object
                  description: JSON Schema 定义。
                  required:
                    - type
                    - properties
                  properties:
                    type:
                      type: string
                      description: 取值应为 `object`
                      enum:
                        - object
                    properties:
                      type: object
                      description: |-
                        详细定义格式化输出所需的内容
                        支持的类型包括：String、Array、Enum、Number、Integer、Object、Boolean。
                        请注意，使用结构化输出时，所有字段或函数参数都必须指定为required

                        **Example:**

                        ```json
                        "json_schema": {
                          "name": "user_analysis",
                          "description": "User behavior analysis result",
                          "schema": {
                            "type": "object",
                            "properties": {
                              "analysis": {
                                "type": "string",
                                "description": "Content analysis based on rules"
                              },
                              "summary_words": {
                                "type": "array",
                                "items": {
                                  "type": "string"
                                },
                                "description": "Content keywords summary, limited to three words"
                              },
                              "content_result": {
                                "type": "string",
                                "enum": [
                                  "低俗色情违规",
                                  "广告引流违规",
                                  "违法违规",
                                  "涉政违规",
                                  "自杀自残违规",
                                  "未成年违规",
                                  "攻击辱骂违规",
                                  "其他违规",
                                  "正常"
                                ],
                                "description": "Content classification result"
                              },
                              "risk_words": {
                                "type": "array",
                                "items": {
                                  "type": "string"
                                },
                                "description": "Keywords indicating violations, emojis converted to text"
                              },
                              "correct_rate": {
                                "type": "number",
                                "description": "Credibility score, from 0.00 to 1.00"
                              },
                              "content_risk_level": {
                                "type": "string",
                                "enum": ["high", "medium", "low"],
                                "description": "Risk concentration level in content"
                              }
                            },
                            "required": [
                              "analysis",
                              "summary_words",
                              "content_result",
                              "risk_words",
                              "correct_rate",
                              "content_risk_level"
                            ]
                          }
                        }
                        ```
        stream_options:
          type: object
          properties:
            include_usage:
              type: boolean
              description: 默认为 `false`。若设为 `true`，流式响应的最后一个数据块将包含本次请求完整的 usage 统计信息
              default: false
    ChatCompletionResp:
      type: object
      properties:
        id:
          type: string
          description: 本次响应的唯一 ID
        choices:
          type: array
          description: 响应选择列表
          items:
            type: object
            properties:
              finish_reason:
                type: string
                description: >-
                  生成停止的原因：`stop` (自然结束), `length` (达到 `max_tokens` 上限),
                  `tool_calls` (调用工具)
                enum:
                  - stop
                  - length
                  - tool_calls
              index:
                type: integer
                description: 选项的索引，从 0 开始
              message:
                type: object
                description: 模型生成的完整回复
                required:
                  - content
                  - role
                properties:
                  content:
                    type: string
                    description: 文本回复内容
                  role:
                    type: string
                    description: 角色，固定为 `assistant`
                    enum:
                      - assistant
                  tool_calls:
                    type: array
                    description: 模型请求调用的工具列表
                    items:
                      type: object
                      properties:
                        id:
                          type: string
                          description: 工具调用的唯一 ID
                        type:
                          type: string
                          description: 工具类型，固定为 `function`
                          enum:
                            - function
                        function:
                          type: object
                          description: 具体的工具使用信息
                          required:
                            - name
                            - arguments
                          properties:
                            name:
                              type: string
                              description: 要调用的函数名称
                            arguments:
                              type: string
                              description: 一个 JSON 字符串，包含调用该函数的参数
        created:
          type: integer
          format: int64
          description: 响应创建的 Unix 时间戳（秒）
        model:
          type: string
          description: 本次请求使用的模型 ID
        object:
          type: string
          description: 对象类型。非流式为 `chat.completion`，流式为 `chat.completion.chunk`
          enum:
            - chat.completion
            - chat.completion.chunk
        usage:
          $ref: '#/components/schemas/Usage'
        input_sensitive:
          type: boolean
          description: 输入内容是否命中敏感词。如果输入内容严重违规，接口会返回内容违规错误信息，回复内容为空
        input_sensitive_type:
          type: integer
          format: int64
          description: >-
            输入命中敏感词类型，当input_sensitive为true时返回。取值为以下其一：1 严重违规；2 色情；3 广告；4 违禁；5
            谩骂；6 暴恐；7 其他
        output_sensitive:
          type: boolean
          description: 输出内容是否命中敏感词。如果输出内容严重违规，接口会返回内容违规错误信息，回复内容为空
        output_sensitive_type:
          type: integer
          format: int64
          description: 输出命中敏感词类型
        base_resp:
          type: object
          description: 错误状态码和详情
          properties:
            status_code:
              type: integer
              format: int64
              description: |-
                状态码

                - `1000`: 未知错误
                - `1001`: 请求超时
                - `1002`: 触发限流
                - `1004`: 鉴权失败
                - `1008`: 余额不足
                - `1013`: 服务内部错误
                - `1027`: 输出内容错误
                - `1039`:  Token 超出限制
                - `2013`: 参数错误

                更多内容可查看 [错误码查询列表](/api-reference/errorcode) 了解详情
            status_msg:
              type: string
              description: 错误详情
    Message:
      type: object
      required:
        - role
        - content
      properties:
        role:
          type: string
          enum:
            - system
            - user
            - assistant
            - tool
          description: |-
            消息发送者的角色
            - `system`: 设定模型的角色和行为
            - `user`: 用户的输入
            - `assistant`: 模型的历史回复，也可包含对工具的调用请求
            - `tool`: 工具调用的返回结果
        name:
          type: string
          description: 发送者的名称。若同一类型的角色有多个，须提供具体名称以区分
        content:
          description: 消息内容。支持 `string` 和 ` object[]` 两种类型
          oneOf:
            - type: string
              description: 纯文本输入时为 `string`
            - type: array
              description: 图文混合输入时为 `array`
              items:
                type: object
                required:
                  - type
                properties:
                  type:
                    type: string
                    enum:
                      - text
                      - image_url
                    description: 内容类型，`text` 或 `image_url`
                  text:
                    type: string
                    description: 文本内容
                  image_url:
                    type: object
                    required:
                      - url
                    properties:
                      url:
                        type: string
                        description: 图片的公网 URL 或 Base64 编码的 Data URL
        tool_calls:
          type: array
          description: 模型决定调用的工具列表。当 `role` 为 `assistant` 时出现
          items:
            type: object
            required:
              - id
              - type
              - function
            properties:
              id:
                type: string
                description: 工具调用的唯一 ID
              type:
                type: string
                description: 工具类型，固定值为 `function`
                enum:
                  - function
              function:
                type: object
                required:
                  - name
                  - arguments
                description: 具体的工具使用信息
                properties:
                  name:
                    type: string
                    description: 要调用的函数名称
                  arguments:
                    type: string
                    description: 包含函数参数的 JSON 字符串
    Usage:
      type: object
      description: 本次请求的 Token 使用情况统计
      properties:
        total_tokens:
          type: integer
          description: 消耗的总 Token 数
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |-
        `HTTP: Bearer Auth`
         - Security Scheme Type: http
         - HTTP Authorization Scheme: Bearer API_key，用于验证账户信息，可在 [账户管理>接口密钥](https://platform.minimaxi.com/user-center/basic-information/interface-key) 中查看。

````

---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt