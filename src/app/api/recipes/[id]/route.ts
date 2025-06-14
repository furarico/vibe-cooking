import { generateInstructionAudios } from '@/lib/audio-utils';
import { prisma } from '@/lib/prisma';
import { deleteInstructionAudios } from '@/lib/r2';
import { recipeSchema } from '@/lib/validations';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: (await params).id,
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

    if (!recipe) {
      return NextResponse.json(
        { error: 'レシピが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('レシピの取得エラー:', error);
    return NextResponse.json(
      { error: 'レシピの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const validatedData = recipeSchema.parse(body);
    const recipeId = (await params).id;

    // 既存の手順を取得して音声ファイルのクリーンアップを準備
    const existingInstructions = await prisma.instruction.findMany({
      where: {
        recipeId,
      },
      select: {
        id: true,
        audioUrl: true,
      },
    });

    // 音声ファイルがある手順のIDを収集
    const instructionIdsWithAudio = existingInstructions
      .filter(instruction => instruction.audioUrl)
      .map(instruction => instruction.id);

    // データベースから既存の材料と手順を削除
    await prisma.ingredient.deleteMany({
      where: {
        recipeId,
      },
    });

    await prisma.instruction.deleteMany({
      where: {
        recipeId,
      },
    });

    // R2から既存の音声ファイルを削除（非同期で実行、エラーが発生してもレシピ更新は継続）
    if (instructionIdsWithAudio.length > 0) {
      deleteInstructionAudios(recipeId, instructionIdsWithAudio).catch(error => {
        console.error('既存音声ファイルの削除エラー:', error);
        // エラーはログのみで処理を継続
      });
    }

    const recipe = await prisma.recipe.update({
      where: {
        id: recipeId,
      },
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

    // 音声生成とアップロードを非同期で実行（エラーが発生してもレシピ更新は継続）
    generateInstructionAudios(recipe.id, recipe.instructions).catch(error => {
      console.error('音声生成の一括処理エラー:', error);
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('レシピの更新エラー:', error);
    return NextResponse.json(
      { error: 'レシピの更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const recipeId = (await params).id;

    // 削除前に既存の手順を取得して音声ファイルのクリーンアップを準備
    const existingInstructions = await prisma.instruction.findMany({
      where: {
        recipeId,
      },
      select: {
        id: true,
        audioUrl: true,
      },
    });

    // 音声ファイルがある手順のIDを収集
    const instructionIdsWithAudio = existingInstructions
      .filter(instruction => instruction.audioUrl)
      .map(instruction => instruction.id);

    // データベースからレシピを削除（カスケード削除により関連する材料と手順も削除される）
    await prisma.recipe.delete({
      where: {
        id: recipeId,
      },
    });

    // R2から音声ファイルを削除（非同期で実行、エラーが発生してもレシピ削除は成功として扱う）
    if (instructionIdsWithAudio.length > 0) {
      deleteInstructionAudios(recipeId, instructionIdsWithAudio).catch(error => {
        console.error('削除されたレシピの音声ファイル削除エラー:', error);
        // エラーはログのみで処理を継続
      });
    }

    return NextResponse.json({ message: 'レシピが削除されました' });
  } catch (error) {
    console.error('レシピの削除エラー:', error);
    return NextResponse.json(
      { error: 'レシピの削除に失敗しました' },
      { status: 500 }
    );
  }
}
