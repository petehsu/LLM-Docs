This page provides suggestions for troubleshooting Google AI Studio if you
encounter issues.

## Understand 403 Access Restricted errors

If you see a 403 Access Restricted error, you are using Google AI Studio in a
way that does not follow the [Terms of Service](https://ai.google.dev/terms). One common reason is
you are not located in a [supported region](https://ai.google.dev/available_regions).

## Resolve No Content responses on Google AI Studio

A warning **No Content** message appears on
Google AI Studio if the content is blocked for any reason. To see more details,
hold the pointer over **No Content** and click
warning **Safety**.

If the response was blocked due to [safety settings](https://ai.google.dev/docs/safety_setting) and
you considered the [safety risks](https://ai.google.dev/docs/safety_guidance) for your use case, you
can modify the
[safety settings](https://ai.google.dev/docs/safety_setting#safety_settings_in_makersuite)
to influence the returned response.

If the response was blocked but not due to the safety settings, the query or
response may violate the [Terms of Service](https://ai.google.dev/terms) or be otherwise unsupported.

## Check token usage and limits

When you have a prompt open, the **Text Preview** button at the bottom of the
screen shows the current tokens used for the content of your prompt and the
maximum token count for the model being used.