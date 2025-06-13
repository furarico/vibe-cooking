import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient();

export interface TTSOptions {
  text: string;
  languageCode?: string;
  voiceName?: string;
  audioEncoding?: 'MP3' | 'LINEAR16' | 'OGG_OPUS';
}

export async function generateSpeech(options: TTSOptions): Promise<Buffer> {
  const {
    text,
    languageCode = 'ja-JP',
    voiceName = 'ja-JP-Neural2-B',
    audioEncoding = 'MP3',
  } = options;

  const request = {
    input: { text },
    voice: {
      languageCode,
      name: voiceName,
    },
    audioConfig: {
      audioEncoding: audioEncoding as 'MP3' | 'LINEAR16' | 'OGG_OPUS',
    },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error('音声生成に失敗しました');
    }

    return Buffer.from(response.audioContent);
  } catch (error) {
    console.error('Google TTS エラー:', error);
    throw new Error('音声生成に失敗しました');
  }
}

export function generateAudioFileName(
  recipeId: string,
  instructionId: string
): string {
  return `instructions/${recipeId}/${instructionId}.mp3`;
}
