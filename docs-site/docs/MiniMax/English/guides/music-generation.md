# Music Generation

> The Music Generation API can create a complete song with vocals based on a text description and lyrics.  

Use the `prompt` parameter to define the music’s style, mood, and scenario, and the `lyrics` parameter to provide the vocal content.\
This feature is ideal for quickly generating unique theme songs for videos, games, or applications.

## Example: Text-to-Music Creation

```python  theme={null}
import requests
import os

url = "https://api.minimax.io/v1/music_generation"
api_key = os.environ["MINIMAX_API_KEY"]
headers = {"Authorization": f"Bearer {api_key}"}

payload = {
    "model": "music-2.0",
    "prompt": "This is a contemporary R&B/Pop track with distinct Trap influences, radiating a confident, assertive, and empowered energy. It features a bright, clear, and agile female vocal with a polished and heavily processed modern sound. The singer's rhythmic and confident delivery is defined by the heavy and stylistic use of Auto-Tune, creating its signature character. Extensive backing vocals, including layered harmonies and ad-libs built upon stacked unison vocals, produce a rich and full texture, enhanced by moderate reverb for a spacious feel. Set at a tempo of 80 BPM, the arrangement is driven by a dominant 808 bassline and electronic drums with intricate hi-hat patterns and sharp claps, while atmospheric synth pads and subtle sound effects craft a dynamic backdrop. This track is perfect for clubbing, parties, driving with the windows down, or a workout session, making it an essential addition to any confidence-boosting playlist.",
    "lyrics": "[chorus]\nSummit, i reached the summit\nI'm the peak with the fire, they all want from it\nSpill a bit of my glow, like a comet\nI ain't worried 'bout hills, you just plummet\nSummit, i reached the summit\nObsidian shards 'round my throat, now they run from it\nAin't no wonder why the valleys all run from it\nI'm awake, from the summit\n[verse]\nI know what i hold\nAnd i'm about to erupt, yeah\nA story untold, yeah\nI know you won't interrupt it\nKeep your eyes on the rise, no surprise that i'm bright\nGot one stream for the sea, other stream for the night\nI be flowin', you're erodin'\nSwear you're slowin', i'm explodin'\nPressure's growin', growin', growin'\n[interlude]\nSummit, i reached the summit\nI'm the peak with the fire, they all want from it\nSpill a bit of my glow, like a comet\nI ain't worried 'bout stone\n[verse]\nI ain't worried 'bout nada\nUnless it's new earth, unless it's magma\nUnless it's deep core, a new nirvana\nUnless it's shaping a new savanna\nI wanna feel like i'm mother gaia\nI wanna feel like i'm way up\nRumbling, grumbling 'til the world pay up\nMade another island, no layups\nStay hot every single day i wake up\n[chorus]\nSummit, i reached the summit\nI'm the peak with the fire, they all want from it\nSpill a bit of my glow, like a comet\nI ain't worried 'bout hills, you just plummet\nSummit, i reached the summit\nObsidian shards 'round my throat, now they run from it\nAin't no wonder why the valleys all run from it\nI'm awake, from the summit\n[outro]\nSummit\nRooo-ar",
    "audio_setting": {
        "sample_rate": 44100,
        "bitrate": 256000,
        "format": "mp3"
    },
}

response = requests.post(url, headers=headers, json=payload)
response.raise_for_status()
audio_hex = response.json()["data"]["audio"]

with open("output.mp3", "wb") as f:
f.write(bytes.fromhex(audio_hex))
```

## The generated audio

<video controls className="w-full aspect-video rounded-xl audio-container" src="https://filecdn.minimax.chat/public/43dda88b-d96b-4506-a1f1-fd8cfb28cf94.mp3" />

## Recommended Reading

<Columns cols={2}>
  <Card title="Music Generation" icon="book-open" href="/api-reference/music-generation" arrow="true" cta="Click here">
    Use this API to generate a song from lyrics and a prompt.
  </Card>

  <Card title="Highlights and Showcases of the Music 2.0" icon="book-open" href="/guides/music-showcase" arrow="true" cta="Click here">
    The Music 2.0 model precisely captures the delicate emotions of human vocals and the dynamic tension of instruments.
  </Card>

  <Card title="Pricing" icon="book-open" href="/guides/pricing#audio" arrow="true" cta="Click here">
    Detailed information on model pricing and API packages.
  </Card>

  <Card title="Rate Limits" icon="book-open" href="/guides/rate-limits#3-rate-limits-for-our-api" arrow="true" cta="Click here">
    Rate limits are restrictions that our API imposes on the number of times a user or client can access our services within a specified period of time.
  </Card>
</Columns>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimax.io/docs/llms.txt