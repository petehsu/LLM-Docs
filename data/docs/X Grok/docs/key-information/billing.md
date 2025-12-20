#### Key Information

# Manage Billing

\*\*Ensure you are in the desired team before changing billing information. When you save the billing information or make a purchase for the first time, the billing information is saved to the team you are in and shared with its members.

There are two ways of billing:

* **Prepaid credits:** You can pre-purchase credits for your team. Your API consumption will be deducted from remaining prepaid credits available.
* **Monthly invoiced billing:** xAI will generate a monthly invoice based on your API consumption, when you don't have available prepaid credits. xAI will charge your default payment method with the invoiced amount at the end of each month.

**Monthly invoiced billing is disabled by default, with default Invoiced Spending Limit of $0.** This will introduce service disruption when you have consumed all of your prepaid credits. To enable monthly invoiced billing, set a higher than $0 Invoiced Spending Limit at [Billing -> API Credits](https://console.x.ai/team/default/billing) on xAI Console.

Your API consumption will be accounted for in the following order:

* Free/Promotional credits
* Prepaid credits
* Monthly invoiced billing (if Invoiced Spending Limit > $0)

**Any prepaid credits and added payment method will be made available to the team you made the purchase in.**

## Prepaid credits



You can only purchase prepaid credits with Guest Checkout at the moment, due to regulatory
requirements.

This is the most common way to build with xAI API. Before using API, you purchase a given amount of credits. When you use the API, xAI will track your consumption and deduct the amount from the credits available in your account.

You can add prepaid credits on the xAI Console [Billing -> API Credits](https://console.x.ai/team/default/billing) page.

On the same page, you can view the remaining prepaid credits, enter promo code, as well as any free credits granted by xAI team.

Note: When you make the purchase via bank transfer instead of credit card, the payment will take 2-3 business days to process. You will be granted with credits after the process has completed.

## Monthly invoiced billing and invoiced billing limit

Enterprise customers might find it beneficial to enroll in monthly invoiced billing to avoid disruption to their services.

When you have set a **$0 invoiced billing limit** (default), xAI will only use your available prepaid credits. **Your API requests will be automatically rejected once your prepaid credits are depleted.**

If you want to use monthly billing, you can **increase your invoiced billing limit** on [Billing -> API Credits](https://console.x.ai/team/default/billing) page. xAI will attempt to use your prepaid credits first, and the remaining amount will be charged to your default payment method at the end of the month. This ensures you won't experience interruption while consuming the API.

Once your monthly invoiced billing amount has reached the invoiced billing limit, you won't be able to get response until you have raised the invoiced billing limit.

## Saving payment method

When you make a purchase, we automatically keep it on file to make your next purchase easier. You can also manually add payment method on xAI Console [Billing -> Billing details -> Add Payment Information](https://console.x.ai/team/default/billing).

Currently we don't allow user to remove the last payment method on file. There might be changes in the future.

## Invoices

You can view your invoices for prepaid credits and monthly invoices on [Billing -> Invoices](https://console.x.ai/team/default/billing/invoices).

## Billing address and tax information

Enter your billing information carefully, as it will appear on your invoices. We are not able to
regenerate the invoices at the moment.

Your billing address and tax information will be displayed on the invoice. On [Billing -> Payment](https://console.x.ai/team/default/billing), you can also add/change your billing address. When you add/change billing address, you can optionally add your organization's tax information.


