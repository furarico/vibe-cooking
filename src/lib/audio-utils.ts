import { prisma } from '@/lib/prisma';
import { uploadAudioToR2 } from '@/lib/r2';
import { generateAudioFileName, generateSpeech } from '@/lib/tts';

export interface InstructionWithAudio {
  id: string;
  step: number;
  description: string;
}

export async function generateInstructionAudios(
  recipeId: string,
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
          const fileName = generateAudioFileName(recipeId, instruction.id);
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