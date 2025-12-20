# FAQs

> Coding Plan Details

**Q: How is the "reset every 5 hours" calculated?**

**A**: It is a dynamic rate limit. The system calculates your total prompt usage within the current 5-hours window. Any usage from more than 5 hours ago is automatically released from the count.

***

**Q: Why is "1 prompt ≈ 15 model calls"?**

**A**: In an AI coding tool, a single action you take (like requesting code completion or an explanation) may be broken down by the tool into multiple, consecutive interactions with the AI model behind the scenes (e.g., fetching context, generating suggestions, refining suggestions, etc.).

To simplify billing, we bundle these backend calls into a single "prompt" count. This means that 1 "prompt" within your plan actually covers multiple complex model invocations.

***

**Q: Can the Coding Plan API Key and the standard Open Platform API Key be used interchangeably for text models?**

**A**: No, they cannot.

* **Coding Plan API Key:** Is exclusively for the Coding Plan subscription. Usage is measured by the number of "prompts" and is subject to the 5-hours limit.

* **Other Open Platform API Keys:** Are used for all other text-based AI services (including when you switch to pay-as-you-go within a coding tool). Billing is based on actual token consumption and depletes your account balance.


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimax.io/docs/llms.txt