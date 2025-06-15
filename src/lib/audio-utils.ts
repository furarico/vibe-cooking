import { prisma } from '@/lib/prisma';
import { deleteFromR2, uploadAudioToR2 } from '@/lib/r2';
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

export async function deleteInstructionAudio(
  recipeId: string,
  instructionId: string
): Promise<void> {
  try {
    const fileName = generateAudioFileName(recipeId, instructionId);
    await deleteFromR2(fileName);
  } catch (error) {
    console.warn(`音声ファイル削除をスキップ: ${recipeId}/${instructionId}`, error);
  }
}

export async function deleteAllInstructionAudios(
  recipeId: string,
  instructionIds: string[]
): Promise<void> {
  await Promise.all(
    instructionIds.map(instructionId =>
      deleteInstructionAudio(recipeId, instructionId)
    )
  );
}
