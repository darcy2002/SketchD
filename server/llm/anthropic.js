import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function generateCode({ imageBase64, prompt, onToken, signal }) {
  const stream = client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: imageBase64
          }
        },
        {
          type: 'text',
          text: prompt
        }
      ]
    }]
  })

  stream.on('text', (text) => {
    onToken(text)
  })

  if (signal) {
    signal.addEventListener('abort', () => {
      stream.abort()
    })
  }

  await stream.finalMessage()
}
