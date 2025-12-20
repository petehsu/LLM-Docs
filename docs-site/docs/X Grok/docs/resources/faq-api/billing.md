#### Resources / FAQ - xAI Console

# Billing

## I'm having payment issues with an Indian payment card

Unfortunately we cannot process Indian payment cards for our API service. We are working toward supporting it but you might want to consider using a third-party API in the meantime. As Grok Website and Apps' payments are handled differently, those are not affected.

## When will I be charged?

* Prepaid Credits: If you choose to use prepaid credits, you’ll be charged when you buy them. These credits will be assigned to the team you select during purchase.

* Monthly Invoiced Billing: If you set your [invoiced spending limit](billing#monthly-invoiced-billing-and-invoiced-billing-limit) above $0, any usage beyond your prepaid credits will be charged at the end of the month.

* API Usage: When you make API requests, the cost is calculated immediately. The amount is either deducted from your available prepaid credits or added to your monthly invoice if credits are exhausted.

If you change your [invoiced spending limit](billing#monthly-invoiced-billing-and-invoiced-billing-limit) to be greater than $0, you will be charged at the end of the month for any extra consumption after your prepaid credit on the team has run out.

Your API consumption will be calculated when making the requests, and the corresponding amount will be deducted from your remaining credits or added to your monthly invoice.

Check out [Billing](billing) for more information.

## Can you retroactively generate an invoice with new billing information?

We are unable to retroactively generate an invoice. Please ensure your billing information is correct on [xAI Console](https://console.x.ai) Billing -> Payment.

## Can prepaid API credits be refunded?

Unfortunately, we are not able to offer refunds on any prepaid credit purchase unless in regions required by law. For details, please visit https://x.ai/legal/terms-of-service-enterprise.

### My prompt token consumption from the API is different from the token count I get from xAI Console Tokenizer or tokenize text endpoint

The inference endpoints add pre-defined tokens to help us process the request. Therefore, these tokens would be added to the total prompt token consumption. For more information, see:
[Estimating consumption with tokenizer on xAI Console or Estimating consumption with tokenizer on xAI Console or through API](consumption-and-rate-limits#estimating-consumption-with-tokenizer-on-xai-console-or-through-api).


