import { generateInstructionAudios } from '@/lib/audio-utils';
import { renameImageToRecipeId } from '@/lib/image-utils';
import { prisma } from '@/lib/prisma';
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

    // 画像ファイル名をレシピIDに変更（非同期で実行）
    if (recipe.imageUrl) {
      renameImageToRecipeId(recipe.imageUrl, recipe.id)
        .then(async newImageUrl => {
          if (newImageUrl !== recipe.imageUrl) {
            await prisma.recipe.update({
              where: { id: recipe.id },
              data: { imageUrl: newImageUrl },
            });
            console.log(`レシピ画像のファイル名を変更しました: ${recipe.id}`);
          }
        })
        .catch(error => {
          console.error('画像ファイル名変更エラー:', error);
        });
    }

    // 音声生成とアップロードを非同期で実行（エラーが発生してもレシピ作成は継続）
    generateInstructionAudios(recipe.id, recipe.instructions).catch(error => {
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
