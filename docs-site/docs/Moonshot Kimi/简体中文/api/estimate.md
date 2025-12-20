文档

API 接口说明

计算 Token

# 计算 Token

## 

```text
POST https://api.moonshot.cn/v1/tokenizers/estimate-token-count
```

## 

estimate-token-count 的输入结构体和 chat completion 基本一致。

## 

```json
{
"model":"kimi-k2-turbo-preview",
"messages": [
        {
"role":"system",
"content":"你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"
        },
        { "role":"user","content":"你好，我叫李雷，1+1等于多少？" }
    ]
}
```

## 

| 字段 | 说明 | 类型 | 取值 |
| --- | --- | --- | --- |
| messages | 包含迄今为止对话的消息列表。 | List[Dict] | 这是一个结构体的列表，每个元素类似如下：`json{"role": "user", "content": "你好"}` role 只支持 `system`,`user`,`assistant` 其一，content 不得为空 |
| model | Model ID， 可以通过 List Models 获取 | string | 目前是 `kimi-k2-0905-preview`,`kimi-k2-0711-preview`, `kimi-k2-turbo-preview`,`moonshot-v1-8k`,`moonshot-v1-32k`,`moonshot-v1-128k`, `moonshot-v1-auto`,`kimi-latest`,`moonshot-v1-8k-vision-preview`,`moonshot-v1-32k-vision-preview`,`moonshot-v1-128k-vision-preview` 其一 |

## 

```bash
curl'https://api.moonshot.cn/v1/tokenizers/estimate-token-count' \
-H"Content-Type: application/json" \
-H"Authorization: Bearer $MOONSHOT_API_KEY" \
-d'{
    "model": "kimi-k2-turbo-preview",
    "messages": [
        {
            "role": "system",
            "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"
        },
        {
            "role": "user",
            "content": "你好，我叫李雷，1+1等于多少？"
        }
    ]
}'
```

## 

```json
{
"data": {
"total_tokens":80
    }
}
```

当没有 error 字段，可以取 data.total\_tokens 作为计算结果

Last updated on 2025年11月11日

[文件接口](/docs/api/files "文件接口")[查询余额](/docs/api/balance "查询余额")