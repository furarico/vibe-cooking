import { prisma } from '@/lib/prisma';
import { deleteFromR2, uploadAudioToR2 } from '@/lib/r2';
import { generateAudioFileName, generateSpeech } from '@/lib/tts';

export interface InstructionWithAudio {
  id: string;
  step: number;
  description: string;
}

export async function generateInstructionAudios(
  instructions: InstructionWithAudio[]
): Promise<void> {
  await Promise.all(
    instructions.map(async instruction => {
      try {
        if (instruction.description.trim()) {
          // TTS音声生成
          const audioBuffer = await generateSpeech({
            text: instruction.description,
          });

          // R2にアップロード
          const fileName = generateAudioFileName();
          const audioUrl = await uploadAudioToR2(audioBuffer, fileName);

          // データベースを更新
          await prisma.instruction.update({
            where: { id: instruction.id },
            data: { audioUrl },
          });
        }
      } catch (audioError) {
        console.error(`手順${instruction.step}の音声生成エラー:`, audioError);
        // 音声生成エラーはログのみで処理を継続
      }
    })
  );
}

export async function deleteInstructionAudio(audioUrl: string): Promise<void> {
  if (!audioUrl) return;

  try {
    // パブリックURLからキーを抽出
    const url = new URL(audioUrl);
    const key = url.pathname.substring(1); // 先頭の '/' を除去

    // audio/instructionsディレクトリの音声のみ削除（安全性のため）
    if (key.startsWith('audio/instructions/')) {
      await deleteFromR2(key);
    }
  } catch (error) {
    console.warn(`音声ファイル削除をスキップ: ${audioUrl}`, error);
  }
}

export async function deleteAllInstructionAudios(
  audioUrls: string[]
): Promise<void> {
  await Promise.all(
    audioUrls.map(audioUrl => deleteInstructionAudio(audioUrl))
  );
}
