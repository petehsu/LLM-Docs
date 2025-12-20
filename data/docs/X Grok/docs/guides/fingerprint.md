#### Guides

# Fingerprint

For each request to the xAI API, the response body will include a unique `system_fingerprint` value. This fingerprint serves as an identifier for the current state of the backend system's configuration.

Example:

```bash
curl https://api.x.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
        "messages": [
          {
            "role": "system",
            "content": "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy."
          },
          {
            "role": "user",
            "content": "What is the meaning of life, the universe, and everything?"
          }
        ],
        "model": "grok-4",
        "stream": false,
        "temperature": 0
      }'
```

Response:

```json
{..., "system_fingerprint":"fp_6ca29cf396"}
```

You can automate your system to keep track of the `system_fingerprint` along with token consumption and other metrics.

## Usage of fingerprint

* **Monitoring System Changes:** The system fingerprint acts as a version control for the backend configuration. If any part of the backend system—such as model parameters, server settings, or even the underlying infrastructure—changes, the fingerprint will also change. This allows developers to track when and how the system has evolved over time. This is crucial for debugging, performance optimization, and ensuring consistency in API responses.
* **Security and Integrity:** The fingerprint can be used to ensure the integrity of the response. If a response's fingerprint matches the expected one based on a recent system configuration, it helps in verifying that the data hasn't been tampered with during transmission or that the service hasn't been compromised. **The fingerprint will change over time and it is expected.**
* **Compliance and Auditing:** For regulated environments, this fingerprint can serve as part of an audit trail, showing when specific configurations were in use for compliance purposes.


