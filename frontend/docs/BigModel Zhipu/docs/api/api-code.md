# 错误码

调用智谱AI 开放平台 API 时，接收到的响应码由两部分组成：外层是 HTTP 状态码，内层是响应体正文中的定义的业务错误码，提供了更具体的错误描述。

## HTTP 状态错误码

| 状态码 | 原因                                       | 解决方法                                                                  |
| :-- | :--------------------------------------- | :-------------------------------------------------------------------- |
| 200 | 业务处理成功                                   | -                                                                     |
| 400 | 参数错误                                     | 检查接口参数是否正确                                                            |
| 400 | 文件内容异常                                   | 检查 jsonl 文件内容是否符合要求                                                   |
| 401 | 鉴权失败或 Token 超时                           | 确认 API KEY 和鉴权 token 是否正确生成                                           |
| 404 | 微调功能未开放                                  | 联系客服以开通此功能                                                            |
| 404 | 微调任务不存在                                  | 确保微调任务 ID 正确                                                          |
| 429 | 接口请求并发超额                                 | 调整请求频率或联系商务扩大并发数                                                      |
| 429 | 上传文件频率过快                                 | 短暂等待后重新请求                                                             |
| 429 | 账户余额已用完                                  | 进行账户充值以确保余额充足                                                         |
| 429 | 账户异常                                     | 账户存违规行为，请联系平台客服或[service@zhipuai.cn](mailto:service@zhipuai.cn)解除相关锁定 |
| 429 | 终端账号异常                                   | 终端用户存在违规行为，账号已被锁定                                                     |
| 434 | 暂无 API 权限，微调 API 及文件管理 API 为内测阶段，我们会尽快开放 | 等待接口正式开放或请联系平台客服申请内测                                                  |
| 435 | 文件大小超过 100MB                             | 使用小于 100MB 的 jsonl 文件或分批上传                                            |
| 500 | 服务器处理请求时发生错误                             | 稍后重试或联系客服                                                             |

## 业务错误码

| 错误分类       | 错误码  | 错误信息                                                                                                          |
| :--------- | :--- | :------------------------------------------------------------------------------------------------------------ |
| 基础错误       | 500  | 内部错误                                                                                                          |
| 身份验证错误     | 1000 | 身份验证失败                                                                                                        |
|            | 1001 | Header 中未收到 Authentication 参数，无法进行身份验证                                                                        |
|            | 1002 | Authentication Token 非法，请确认 Authentication Token 正确传递                                                         |
|            | 1003 | Authentication Token 已过期，请重新生成/获取                                                                             |
|            | 1004 | 通过 Authentication Token 的验证失败                                                                                 |
|            | 1100 | 账户读写                                                                                                          |
| 账户错误       | 1110 | 您的账户当前处于非活动状态。请检查账户信息                                                                                         |
|            | 1111 | 您的账户不存在                                                                                                       |
|            | 1112 | 您的账户已被锁定，请联系客服解锁                                                                                              |
|            | 1113 | 您的账户已欠费，请充值后重试                                                                                                |
|            | 1120 | 无法成功访问您的账户，请稍后重试                                                                                              |
|            | 1121 | 账户存违规行为，账号已被锁定                                                                                                |
| API 调用错误   | 1200 | API 调用错误                                                                                                      |
|            | 1210 | API 调用参数有误，请检查文档                                                                                              |
|            | 1211 | 模型不存在，请检查模型代码                                                                                                 |
|            | 1212 | 当前模型不支持 `${method}` 调用方式                                                                                      |
|            | 1213 | 未正常接收到 `${field}` 参数                                                                                          |
|            | 1214 | `${field}` 参数非法。请检查文档                                                                                         |
|            | 1215 | `${field1}` 与 `${field2}` 不能同时设置，请检查文档                                                                        |
|            | 1220 | 您无权访问 `${API_name}`                                                                                           |
|            | 1221 | API `${API_name}` 已下线                                                                                         |
|            | 1222 | API `${API_name}` 不存在                                                                                         |
|            | 1230 | API 调用流程出错                                                                                                    |
|            | 1231 | 您已有请求：`${request_id}`                                                                                         |
|            | 1234 | 网络错误，错误id：`${error_id}`，请联系客服                                                                                 |
| API 策略阻止错误 | 1300 | API 调用被策略阻止                                                                                                   |
|            | 1301 | 系统检测到输入或生成内容可能包含不安全或敏感内容，请您避免输入易产生敏感内容的提示语，感谢您的配合                                                             |
|            | 1302 | 您当前使用该 API 的并发数过高，请降低并发，或联系客服增加限额                                                                             |
|            | 1303 | 您当前使用该 API 的频率过高，请降低频率，或联系客服增加限额                                                                              |
|            | 1304 | 该 API 已达今日调用次数限额，如有更多需求，请联系客服购买                                                                               |
|            | 1305 | 该 API 已触发流量限制                                                                                                 |
|            | 1308 | 已达到 `${number}` `${unit}` 的使用上限。您的限额将在 `${next_flush_time}` 重置。                                               |
|            | 1309 | 您的 GLM Coding Plan 套餐已到期，暂无法使用，前往官方续订后即可恢复 [https://bigmodel.cn/claude-code](https://bigmodel.cn/claude-code) |

## 错误响应示例

以下是 curl 请求的响应报文，其中 401 是 HTTP 状态码，1002 是业务错误码。

```
* We are completely uploaded and fine
< HTTP/2 401
< date: Wed, 20 Mar 2024 03:06:05 GMT
< content-type: application/json
< set-cookie: acw_tc=76b20****a0e42;path=/;HttpOnly;Max-Age=1800
< server: nginx/1.21.6
< vary: Origin
< vary: Access-Control-Request-Method
< vary: Access-Control-Request-Headers
<
* Connection #0 to host open.bigmodel.cn left intact
{"error":{"code":"1002","message":"Authorization Token非法，请确认Authorization Token正确传递。"}}
```

> **注：** 使用流式（SSE）调用时，如果 API 在推理过程中异常终止，不会返回上述错误码，而是在响应体的 `finish_reason` 参数中返回异常原因，详情请参考 `finish_reason` 的参数说明。


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt