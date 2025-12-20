# Gemini API

| We have updated our[Terms of Service](https://ai.google.dev/gemini-api/terms).

The fastest path from prompt to production with Gemini, Veo, Nano Banana, and more.  

### Python

    from google import genai

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents="Explain how AI works in a few words",
    )

    print(response.text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Explain how AI works in a few words",
      });
      console.log(response.text);
    }

    await main();

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "google.golang.org/genai"
    )

    func main() {
        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        result, err := client.Models.GenerateContent(
            ctx,
            "gemini-2.5-flash",
            genai.Text("Explain how AI works in a few words"),
            nil,
        )
        if err != nil {
            log.Fatal(err)
        }
        fmt.Println(result.Text())
    }

### Java

    package com.example;

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentResponse;

    public class GenerateTextFromTextInput {
      public static void main(String[] args) {
        Client client = new Client();

        GenerateContentResponse response =
            client.models.generateContent(
                "gemini-2.5-flash",
                "Explain how AI works in a few words",
                null);

        System.out.println(response.text());
      }
    }

### C#

    using System.Threading.Tasks;
    using Google.GenAI;
    using Google.GenAI.Types;

    public class GenerateContentSimpleText {
      public static async Task main() {
        var client = new Client();
        var response = await client.Models.GenerateContentAsync(
          model: "gemini-2.5-flash", contents: "Explain how AI works in a few words"
        );
        Console.WriteLine(response.Candidates[0].Content.Parts[0].Text);
      }
    }

### REST

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
        ]
      }'

[Start building](https://ai.google.dev/gemini-api/docs/quickstart)  
Follow our Quickstart guide to get an API key and make your first API call in minutes.

*** ** * ** ***

## Meet the models

[auto_awesomeGemini 3 Pro
Our most intelligent model, the best in the world for multimodal understanding, all built on state-of-the-art reasoning.](https://ai.google.dev/gemini-api/docs/models#gemini-3-pro)[sparkGemini 3 Flash
Frontier-class performance rivaling larger models at a fraction of the cost.](https://ai.google.dev/gemini-api/docs/models#gemini-3-flash)[ðNano Banana and Nano Banana Pro
State-of-the-art image generation and editing models.](https://ai.google.dev/gemini-api/docs/image-generation)[sparkGemini 2.5 Pro
Our powerful reasoning model, which excels at coding and complex reasonings tasks.](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-pro)[sparkGemini 2.5 Flash
Our most balanced model, with a 1 million token context window and more.](https://ai.google.dev/gemini-api/docs/models/gemini#gemini-2.5-flash)[sparkGemini 2.5 Flash-Lite
Our fastest and most cost-efficient multimodal model with great performance for high-frequency tasks.](https://ai.google.dev/gemini-api/docs/models/gemini#gemini-2.5-flash-lite)[video_libraryVeo 3.1
Our state-of-the-art video generation model, with native audio.](https://ai.google.dev/gemini-api/docs/video)[sparkGemini 2.5 Pro TTS
Gemini 2.5 model variant with native text-to-speech (TTS) capabilities.](https://ai.google.dev/gemini-api/docs/models/gemini#gemini-2.5-pro-tts)[sparkGemini Robotics-ER 1.5
A vision-language model (VLM) that brings Gemini's agentic capabilities to robotics and enables advanced reasoning in the physical world.](https://ai.google.dev/gemini-api/docs/robotics-overview)

## Explore Capabilities

[imagesmode
Native Image Generation (Nano Banana)
Generate and edit highly contextual images natively with Gemini 2.5 Flash Image.](https://ai.google.dev/gemini-api/docs/image-generation)[article
Long Context
Input millions of tokens to Gemini models and derive understanding from unstructured images, videos, and documents.](https://ai.google.dev/gemini-api/docs/long-context)[code
Structured Outputs
Constrain Gemini to respond with JSON, a structured data format suitable for automated processing.](https://ai.google.dev/gemini-api/docs/structured-output)[functions
Function Calling
Build agentic workflows by connecting Gemini to external APIs and tools.](https://ai.google.dev/gemini-api/docs/function-calling)[videocam
Video Generation with Veo 3.1
Create high-quality video content from text or image prompts with our state-of-the-art model.](https://ai.google.dev/gemini-api/docs/video)[android_recorder
Voice Agents with Live API
Build real-time voice applications and agents with the Live API.](https://ai.google.dev/gemini-api/docs/live)[build
Tools
Connect Gemini to the world through built-in tools like Google Search, URL Context, Google Maps, Code Execution and Computer Use.](https://ai.google.dev/gemini-api/docs/tools)[stacks
Document Understanding
Process up to 1000 pages of PDF files with full multimodal understanding or other text-based file types.](https://ai.google.dev/gemini-api/docs/document-processing)[cognition_2
Thinking
Explore how thinking capabilities improve reasoning for complex tasks and agents.](https://ai.google.dev/gemini-api/docs/thinking)

## Resources

[Google AI Studio
Test prompts, manage your API keys, monitor usage, and build prototypes in platform for AI builders.
Open Google AI Studio](https://aistudio.google.com)[groupDeveloper Community
Ask questions and find solutions from other developers and Google engineers.
Join the community](https://discuss.ai.google.dev/c/gemini-api/4)[menu_bookAPI Reference
Find detailed information about the Gemini API in the official reference documentation.
Read the API reference](https://ai.google.dev/api)