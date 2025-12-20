This guide contains everything you need to get started with enabling logging for your existing Gemini API applications. In this guide you'll learn how to view logs from an existing or new application in the Google AI Studio dashboard to better understand model behavior and how users may be interacting with your applications. Use logging to observe, debug, and*optionally share usage feedback with Google to help improve Gemini across developer use cases* .^[\*](https://ai.google.dev/gemini-api/docs/logs-policy)^

All`GenerateContent`and`StreamGenerateContent`API calls are supported, including those made through[OpenAI compatibility](https://ai.google.dev/gemini-api/docs/openai)endpoints.

## 1. Enable logging in Google AI Studio

Before you begin, ensure you have a billing-enabled project that you own.

1. Open the logs page in Google[AI Studio](https://aistudio.google.com/logs).
2. Choose your project from the drop-down and press the enable button to enable logging for all requests by default.

![](https://ai.google.dev/static/gemini-api/docs/images/logs-state.png)

You can enable or disable logging for all projects or for specific projects, and change these preferences at any time through Google AI Studio. To enable or disable logging per request, you can set the following configurations in your application code.

## 2. Logging per request

To disable logging per request, having already opted-in at a project level through Google AI Studio:  

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [
          {
            "parts": [
              {
                "text": "Explain how AI works in a few words"
              }
            ]
          }
        ],
        logging_behavior: LOGGING_DISABLED
      }'

To opt-in to logging per request, having not already opted-in at a project level through Google AI Studio:  

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [
          {
            "parts": [
              {
                "text": "Explain how AI works in a few words"
              }
            ]
          }
        ],
        logging_behavior: LOGGING_ENABLED_DEFAULT
      }'

## 3. View logs in AI Studio

1. Go to[AI Studio](https://aistudio.google.com/logs).
2. Select the project you've enabled logging for.
3. You should see your logs appear in the table in reverse chronological order.

![](https://storage.googleapis.com/generativeai-downloads/images/nano-bana-logs.gif)

Click on an entry for a full page view of the request and response pair. You can inspect the full prompt, the complete response from Gemini, and the context from the previous turn. Note that each project has a default storage limit of up to 1,000 logs, and logs not saved in datasets will expire after 55 days. If your project reaches its storage limit you will be promoted to delete logs.

## 4. Curate and share datasets

- From the logs table, locate the filter bar at the top to select a property to filter by.
- From your filtered view of logs use the checkboxes to select all or a few of the logs.
- Click the "Create Dataset" button that appears at the top of the list.
- Give your new dataset a descriptive name and optional description.
- You will see the dataset you just created with the curated set of logs.

![](https://storage.googleapis.com/generativeai-downloads/images/sales-dataset.gif)

Datasets can be helpful for a number of different use cases.

- **Curating challenge sets:**Drive future improvements that target areas where you want your AI to improve.
- **Curate sample sets:**For example, a sample from real usage to generate responses from another model, or a collection of edge cases for routine checks before deployment.
- **Evaluation sets:**Sets that are representative of real usage across important capabilities, for comparison across other models or system instruction iterations.

You can help drive progress in AI research, the Gemini API, and Google AI Studio by choosing to share your datasets as demonstration examples. This allows us to refine our models in diverse contexts and create AI systems that remain useful to developers across many fields and applications

## Next steps \& what to test

Now that you have logging enabled, here are a few things to try:

- **Prototype with session history:** Leverage[AI Studio Build](https://aistudio.google.com/apps)to vibe code apps and add your API key to enable a history of user logs.
- **Re-run logs with the Gemini Batch API:** Use datasets for response sampling and evaluation of models or application logic by re-running logs via the[Gemini Batch API](https://github.com/google-gemini/cookbook/blob/main/examples/Datasets.ipynb).

## Compatibility

Logging is not currently supported for the following:

- Imagen and Veo
- Inputs containing videos, GIFs or PDFs