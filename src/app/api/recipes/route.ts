import { prisma } from '@/lib/prisma';
import { uploadAudioToR2 } from '@/lib/r2';
import { generateAudioFileName, generateSpeech } from '@/lib/tts';
import { recipeSchema } from '@/lib/validations';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: true,
        instructions: {
          orderBy: {
            step: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error('レシピの取得エラー:', error);
    return NextResponse.json(
      { error: 'レシピの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = recipeSchema.parse(body);

    // レシピを作成（音声URLは後で更新）
    const recipe = await prisma.recipe.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        prepTime: validatedData.prepTime,
        cookTime: validatedData.cookTime,
        servings: validatedData.servings,
        imageUrl: validatedData.imageUrl,
        tags: validatedData.tags,
        ingredients: {
          create: validatedData.ingredients.map(ingredient => ({
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            notes: ingredient.notes,
          })),
        },
        instructions: {
          create: validatedData.instructions.map(instruction => ({
            step: instruction.step,
            description: instruction.description,
            imageUrl: instruction.imageUrl,
            estimatedTime: instruction.estimatedTime,
          })),
        },
      },
      include: {
        ingredients: true,
        instructions: {
          orderBy: {
            step: 'asc',
          },
        },
      },
    });

    // 音声生成とアップロードを非同期で実行（エラーが発生してもレシピ作成は継続）
    Promise.all(
      recipe.instructions.map(async instruction => {
        try {
          if (instruction.description.trim()) {
            // TTS音声生成
            const audioBuffer = await generateSpeech({
              text: instruction.description,
            });

            // R2にアップロード
            const fileName = generateAudioFileName(recipe.id, instruction.id);
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
    ).catch(error => {
      console.error('音声生成の一括処理エラー:', error);
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error('レシピの作成エラー:', error);
    return NextResponse.json(
      { error: 'レシピの作成に失敗しました' },
      { status: 500 }
    );
  }
}
