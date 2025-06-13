import { TextToSpeechClient } from '@google-cloud/text-to-speech'

const client = new TextToSpeechClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
})

export interface TTSOptions {
  text: string
  languageCode?: string
  voiceName?: string
  audioEncoding?: 'MP3' | 'LINEAR16' | 'OGG_OPUS'
}

export async function generateSpeech(options: TTSOptions): Promise<Buffer> {
  const {
    text,
    languageCode = 'ja-JP',
    voiceName = 'ja-JP-Neural2-B',
    audioEncoding = 'MP3'
  } = options

  const request = {
    input: { text },
    voice: {
      languageCode,
      name: voiceName,
    },
    audioConfig: {
      audioEncoding: audioEncoding as 'MP3' | 'LINEAR16' | 'OGG_OPUS',
    },
  }

  try {
    const [response] = await client.synthesizeSpeech(request)
    
    if (!response.audioContent) {
      throw new Error('音声生成に失敗しました')
    }

    return Buffer.from(response.audioContent)
  } catch (error) {
    console.error('Google TTS エラー:', error)
    throw new Error('音声生成に失敗しました')
  }
}

export function generateAudioFileName(text: string, recipeId: string, step: number): string {
  const hash = Buffer.from(text).toString('base64').substring(0, 8)
  const timestamp = Date.now()
  return `instructions/${recipeId}/step-${step}-${hash}-${timestamp}.mp3`
}