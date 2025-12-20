# Creative Ways to Play with Music Generation

> How MiniMax’s Music Generation Model is Used on RedNote

Based on MiniMax's music and speech models, creative music gameplay is implemented on the RedNote platforms.

## Solution

### RedNote Gameplay

**Creating Music Notes**

1. Users can directly input lyrics + select a music genre on RedNote, call the Music Generation API to generate song audio, and then post a music note with images or short videos.
2. Supports 16 music genres, which can be switched and previewed. The system will automatically render it into a finished product with a video cover + BGM.

**Sing & Chat Gameplay**

1. In Rednote‘s group chat feature, users can input lyrics → select a genre → generate a song in real-time and send it to the group chat.
2. Supports simultaneous generation of an AI-generated cover image (in conjunction with a text-to-image API) and music, making it easy to forward or post directly.

**Voice Chat + Music Dubbing**

1. The user inputs text, and the AI generates a voiceover with the selected timbre (`voice_id`), which can be overlaid with BGM.
2. Suitable for story-based short videos, vlog narrations, emotional sharing, etc.

## Usage Examples

1. TTS Voice Singing Mode

<CodeGroup dropdown>
  ```json  theme={null}
  {
    "voice_id": "xxxx",
    "instrumental_id": "yyyy",
    "lyrics": "This is a line of lyrics",
    "output_format": "mp3"
  }
  ```
</CodeGroup>

2. BGM Mode (No Dry Vocals)

<CodeGroup dropdown>
  ```json  theme={null}
  {
    "reference_instrumental": "zzzz",
    "output_format": "mp3"
  }
  ```
</CodeGroup>

3. Text-to-Timbre + Synthesis

<CodeGroup dropdown>
  ```json  theme={null}
  {
    "voice_gender": "female",
    "voice_age": "young",
    "voice_description": "sweet, clear",
    "instrumental_id": "yyyy",
    "lyrics": "This is a line of lyrics"
  }
  ```
</CodeGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimax.io/docs/llms.txt