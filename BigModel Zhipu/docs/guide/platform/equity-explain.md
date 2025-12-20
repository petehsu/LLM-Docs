# 用户权益

> 了解智谱AI 用户权益体系，通过积分提升等级，享受模型计费折扣和平台服务。

**最新版本生效日期**：2025年11月1日

<Info>
  开发者通过获取积分来提升用户权益等级。凭用户权益等级享受模型计费折扣、智谱新产品体验、智谱平台服务等8类平台权益内容。
</Info>

## 积分获取规则

<Steps>
  <Step title="消耗现金余额">
    通过调用模型 API 接口、模型训练、模型部署等消耗现金余额获得积分
  </Step>

  <Step title="购买资源包">
    购买产品资源包时获得对应积分
  </Step>

  <Step title="一比一兑换">
    花费金额与积分按1:1比例兑换
  </Step>
</Steps>

<Warning>
  需注意，赠金账户的余额消耗不会换算到积分内。若用户发生退款动作，积分将对应变化。例如，发生退款后，在退款当月，积分将减去退款金额。
</Warning>

## 用户权益使用

当开发者提升用户权益等级后将获得：

<CardGroup cols={1}>
  <Card title="并发提升" icon={<svg style={{maskImage: "url(/resource/icon/bolt.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    实时推理官方模型的并发将相应增加
  </Card>
</CardGroup>

<Note>
  相关适用模型及具体折扣可通过当前权益等级查看。
</Note>

## 权益等级计算规则

### 等级权益说明

| 等级   | 积分范围              | 主要权益 |
| :--- | :---------------- | :--- |
| V0等级 | \[0, 2,000)       | 基础服务 |
| V1等级 | \[2,000, 10,000)  | 并发权益 |
| V2等级 | \[10,000, 50,000) | 更高并发 |
| V3等级 | >= 50,000         | 最高并发 |

### 等级更新机制

<Info>
  平台将于 T+1 日 06:00:00 更新积分，并根据用户最近三个月的最高积分确定本月的用户权益等级。
</Info>

### 积分兑换规则

若用户参与了其他形式的折扣活动，在计算积分时，会按照折扣前的金额进行计算。例如，实时推理时获得9折优惠，花费90元时，积分将按9折前的100元记录对应积分100。避免因为折扣原因导致积分下滑。

<Warning>
  Batch 推理按实际扣费金额计算积分。
</Warning>

## 常见问题

<AccordionGroup>
  <Accordion title="用户权益逻辑生效时间？">
    本逻辑从2025.11.1日 00:00:00 开始生效。
  </Accordion>

  <Accordion title="如何查看我的用户权益等级？">
    您可以在[用户权益页面](https://bigmodel.cn/usercenter/equity-mgmt/user-rights)查看自己的积分与用户权益等级。
  </Accordion>

  <Accordion title="消耗资源包中的 Tokens 会增加积分么？">
    不会，仅通过消耗现金余额、或三方支付购买产品时，才能产生积分。
  </Accordion>

  <Accordion title="使用 Batch API 会增加积分么？">
    若 Batch API 调用时消耗的是现金余额（不含赠金），则会积累积分。
  </Accordion>
</AccordionGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt