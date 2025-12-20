文档

API 接口说明

查询余额

# 查询余额

## 

```text
GET https://api.moonshot.cn/v1/users/me/balance
```

## 

```bash
curlhttps://api.moonshot.cn/v1/users/me/balance-H"Authorization: Bearer $MOONSHOT_API_KEY"
```

## 

```json
{
"code":0,
"data": {
"available_balance":49.58894,
"voucher_balance":46.58893,
"cash_balance":3.00001
  },
"scode":"0x0",
"status":true
}
```

## 

| 字段 | 说明 | 类型 | 单位 |
| --- | --- | --- | --- |
| available\_balance | 可用余额，包括现金余额和代金券余额, 当它小于等于 0 时, 用户不可调用推理 API | float | 人民币元（CNY） |
| voucher\_balance | 代金券余额, 不会为负数 | float | 人民币元（CNY） |
| cash\_balance | 现金余额, 可能为负数, 代表用户欠费, 当它为负数时, `available_balance` 为 `voucher_balance` 的值 | float | 人民币元（CNY） |

Last updated on 2025年11月9日

[计算 Token](/docs/api/estimate "计算 Token")[模型推理定价](/docs/pricing/chat "模型推理定价")