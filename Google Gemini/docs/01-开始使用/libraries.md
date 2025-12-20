| We have updated our[Terms of Service](https://ai.google.dev/gemini-api/terms).

When building with the Gemini API, we recommend using the**Google GenAI SDK** . These are the official, production-ready libraries that we develop and maintain for the most popular languages. They are in[General Availability](https://ai.google.dev/gemini-api/docs/libraries#new-libraries)and used in all our official documentation and examples.
| **Note:** If you're using one of our legacy libraries, we strongly recommend you[migrate](https://ai.google.dev/gemini-api/docs/migrate)to the Google GenAI SDK. Review the[legacy libraries](https://ai.google.dev/gemini-api/docs/libraries#previous-sdks)section for more information.

If you're new to the Gemini API, follow our[quickstart guide](https://ai.google.dev/gemini-api/docs/quickstart)to get started.

## Language support and installation

The Google GenAI SDK is available for the Python, JavaScript/TypeScript, Go and Java languages. You can install each language's library using package managers, or visit their GitHub repos for further engagement:  

### Python

- Library:[`google-genai`](https://pypi.org/project/google-genai)

- GitHub Repository:[googleapis/python-genai](https://github.com/googleapis/python-genai)

- Installation:`pip install google-genai`

### JavaScript

- Library:[`@google/genai`](https://www.npmjs.com/package/@google/genai)

- GitHub Repository:[googleapis/js-genai](https://github.com/googleapis/js-genai)

- Installation:`npm install @google/genai`

### Go

- Library:[`google.golang.org/genai`](https://pkg.go.dev/google.golang.org/genai)

- GitHub Repository:[googleapis/go-genai](https://github.com/googleapis/go-genai)

- Installation:`go get google.golang.org/genai`

### Java

- Library:`google-genai`

- GitHub Repository:[googleapis/java-genai](https://github.com/googleapis/java-genai)

- Installation: If you're using Maven, add the following to your dependencies:

    <dependencies>
      <dependency>
        <groupId>com.google.genai</groupId>
        <artifactId>google-genai</artifactId>
        <version>1.0.0</version>
      </dependency>
    </dependencies>

### C#

- Library:`Google.GenAI`

- GitHub Repository:[googleapis/dotnet-genai](https://googleapis.github.io/dotnet-genai/)

- Installation:`dotnet add package Google.GenAI`

## General availability

We started rolling out Google GenAI SDK, a new set of libraries to access Gemini API, in late 2024 when we launched Gemini 2.0.

As of May 2025, they reached General Availability (GA) across all supported platforms and are the recommended libraries to access the Gemini API. They are stable, fully supported for production use, and are actively maintained. They provide access to the latest features, and offer the best performance working with Gemini.

If you're using one of our legacy libraries, we strongly recommend you migrate so that you can access the latest features and get the best performance working with Gemini. Review the[legacy libraries](https://ai.google.dev/gemini-api/docs/libraries#previous-sdks)section for more information.

## Legacy libraries and migration

If you are using one of our legacy libraries, we recommend that you[migrate to the new libraries](https://ai.google.dev/gemini-api/docs/migrate).

The legacy libraries don't provide access to recent features (such as[Live API](https://ai.google.dev/gemini-api/docs/live)and[Veo](https://ai.google.dev/gemini-api/docs/video)) and are on a deprecation path. They will stop receiving updates on November 30th, 2025, the feature gaps will grow and potential bugs may no longer get fixed.

Each legacy library's support status varies, detailed in the following table:

|         Language          |                                     Legacy library                                      |                         Support status                         |                                                        Recommended library                                                        |
|---------------------------|-----------------------------------------------------------------------------------------|----------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| **Python**                | [google-generativeai](https://github.com/google-gemini/deprecated-generative-ai-python) | All support, including bug fixes, ends on November 30th, 2025. | [google-genai](https://github.com/googleapis/python-genai)                                                                        |
| **JavaScript/TypeScript** | [@google/generativeai](https://github.com/google-gemini/generative-ai-js)               | All support, including bug fixes, ends on November 30th, 2025. | [@google/genai](https://github.com/googleapis/js-genai)                                                                           |
| **Go**                    | [google.golang.org/generative-ai](https://github.com/google/generative-ai-go)           | All support, including bug fixes, ends on November 30th, 2025. | [google.golang.org/genai](https://github.com/googleapis/go-genai)                                                                 |
| **Dart and Flutter**      | [google_generative_ai](https://pub.dev/packages/google_generative_ai/install)           | Not actively maintained                                        | Use trusted community or third party libraries, like[firebase_ai](https://pub.dev/packages/firebase_ai), or access using REST API |
| **Swift**                 | [generative-ai-swift](https://github.com/google/generative-ai-swift)                    | Not actively maintained                                        | Use[Firebase AI Logic](https://firebase.google.com/products/firebase-ai-logic)                                                    |
| **Android**               | [generative-ai-android](https://github.com/google-gemini/generative-ai-android)         | Not actively maintained                                        | Use[Firebase AI Logic](https://firebase.google.com/products/firebase-ai-logic)                                                    |

**Note for Java developers:** There was no legacy Google-provided Java SDK for the Gemini API, so no migration from a previous Google library is required. You can start directly with the new library in the[Language support and installation](https://ai.google.dev/gemini-api/docs/libraries#install)section.

## Prompt templates for code generation

Generative models (e.g., Gemini, Claude) and AI-powered IDEs (e.g., Cursor) may produce code for the Gemini API using outdated or deprecated libraries due to their training data cutoff. For the generated code to use the latest, recommended libraries, provide version and usage guidance directly in your prompts. You can use the templates below to provide the necessary context:

- [Python](https://github.com/googleapis/python-genai/blob/main/codegen_instructions.md)

- [JavaScript/TypeScript](https://github.com/googleapis/js-genai/blob/main/codegen_instructions.md)