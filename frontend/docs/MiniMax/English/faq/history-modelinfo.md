# Historical Model Pricing and Rate Limit Look-up

This document serves as a reference for the historical pricing and rate limits of foundational AI models.

# Price

## Text

| API                    | Model           | Input Price                                                                                  | Output Price      |
| :--------------------- | :-------------- | :------------------------------------------------------------------------------------------- | :---------------- |
| **Chat Completion v2** | MiniMax-M1      | • \$0.4 / 1M tokens (if input ≤200K tokens)<br />• \$1.3 / 1M tokens (if input >200K tokens) | \$2.2 / 1M tokens |
| **Chat Completion v2** | MiniMax-Text-01 | • \$0.2 / 1M tokens                                                                          | \$1.1 / 1M tokens |
| **Batch**              | MiniMax-M1      | • \$0.2 / 1M tokens (if input ≤200K tokens)<br />• \$0.7 / 1M tokens (if input >200K tokens) | \$1.1 / 1M tokens |

## Video Agent

| Template ID                 | Template Name                         | Price             |
| :-------------------------- | :------------------------------------ | :---------------- |
| 392747428568649728          | Diving                                | \$0.40 per video  |
| 393488336655310850          | Climbing                              | \$0.40 per video  |
| 393769180141805569          | Run for Life                          | \$0.45 per video  |
| 397087679467597833          | Transformers                          | \$0.45 per video  |
| 393881433990066176          | Still rings routine                   | \$0.45 per video  |
| 393498001241890824          | Weightlifting                         | \$0.45 per video  |
| 393876118804459526          | Male Model Try-On Ad                  | \$1.00 per video  |
| 393866076583718914          | Female Model Try-On Ad                | \$1.00 per video  |
| 393879757702918151          | McDonald's Delivery Pet               | \$1.10 per video  |
| 394176968202485769          | Miniature Set Ad                      | \$1.40 per video  |
| 394514820878671878          | Anime Life Sim                        | \$1.50 per video  |
| 397017167949312007          | Pet Pilot                             | \$2.00 per video  |
| 394875727173492739          | Art Fonts                             | \$0.35 per video  |
| 394220989629177861          | Drinkfall                             | \$0.70 per video  |
| 393853165953970178          | E-commerce Display Ad                 | \$0.86 per video  |
| 401431836934868999          | 3D character product presentation     | \$1.08 per video  |

# Rate Limits

## Text

| API                   | Model                 | RPM         | TPM               |
| :-------------------- | :-------------------- | :---------- | :---------------- |
| Chat Completion       | MiniMax-M1            | 120         | 720,000           |
| Chat Completion       | MiniMax-Text-01       | 120         | 720,000           |


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimax.io/docs/llms.txt