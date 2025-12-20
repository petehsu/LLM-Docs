#### Key Information

# Usage Explorer

Sometimes as a team admin, you might want to monitor the API consumption, either to track spending, or to detect anomalies. xAI Console provides an easy-to-use [Usage Explorer](https://console.x.ai/team/default/usage) for team admins to track API usage across API keys, models, etc.

## Basic usage

[Usage Explorer](https://console.x.ai/team/default/usage) page provides intuitive dropdown menus for you to customize how you want to view the consumptions.

For example, you can view your daily credit consumption with `Granularity: Daily`:

By default, the usage is calculated by cost in US Dollar. You can select Dimension -> Tokens or Dimension -> Billing items to change the dimension to token count or billing item count.

You can also see the usage with grouping. This way, you can easily compare the consumption across groups. In this case, we are trying to compare consumptions across test and production API keys, so we select `Group by: API Key`:

## Filters

The basic usage should suffice if you are only viewing general information. However, you can also use filters to conditionally display information.

The filters dropdown gives you the options to filter by a particular API key, a model, a request IP, a cluster, or the token type.


