import { deleteAllInstructionAudios, generateInstructionAudios } from '@/lib/audio-utils';
import { deleteImageFromR2, renameImageToRecipeId } from '@/lib/image-utils';
import { prisma } from '@/lib/prisma';
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

    // 既存のレシピ情報を取得（画像削除のため）
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { imageUrl: true },
    });

    // 既存の手順を取得して音声ファイルと画像のクリーンアップを準備
    const existingInstructions = await prisma.instruction.findMany({
      where: {
        recipeId,
      },
      select: {
        id: true,
        audioUrl: true,
        imageUrl: true,
      },
    });

    // 全ての既存手順のIDを収集（音声ファイルの存在に関係なく削除を試行）
    const allExistingInstructionIds = existingInstructions.map(
      instruction => instruction.id
    );

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
    if (allExistingInstructionIds.length > 0) {
      deleteAllInstructionAudios(recipeId, allExistingInstructionIds).catch(
        error => {
          console.error('既存音声ファイルの削除エラー:', error);
          // エラーはログのみで処理を継続
        }
      );
    }

    // 既存のレシピ画像が変更された場合は古い画像を削除
    if (
      existingRecipe?.imageUrl &&
      existingRecipe.imageUrl !== validatedData.imageUrl
    ) {
      deleteImageFromR2(existingRecipe.imageUrl).catch(error => {
        console.error('既存レシピ画像の削除エラー:', error);
        // エラーはログのみで処理を継続
      });
    }

    // 既存の手順画像で変更されたものを削除
    const newInstructionImageUrls = validatedData.instructions.map(
      inst => inst.imageUrl || ''
    );
    existingInstructions.forEach((existingInst, index) => {
      if (
        existingInst.imageUrl &&
        newInstructionImageUrls[index] !== existingInst.imageUrl
      ) {
        deleteImageFromR2(existingInst.imageUrl).catch(error => {
          console.error('既存手順画像の削除エラー:', error);
          // エラーはログのみで処理を継続
        });
      }
    });

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

    // 新しい画像が設定された場合、ファイル名をレシピIDに変更（非同期で実行）
    if (recipe.imageUrl && recipe.imageUrl !== existingRecipe?.imageUrl) {
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

    // 削除前に既存のレシピと手順を取得してファイルのクリーンアップを準備
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { imageUrl: true },
    });

    const existingInstructions = await prisma.instruction.findMany({
      where: {
        recipeId,
      },
      select: {
        id: true,
        audioUrl: true,
        imageUrl: true,
      },
    });

    // 全ての手順のIDを収集（音声ファイルの存在に関係なく削除を試行）
    const allInstructionIds = existingInstructions.map(
      instruction => instruction.id
    );

    // データベースからレシピを削除（カスケード削除により関連する材料と手順も削除される）
    await prisma.recipe.delete({
      where: {
        id: recipeId,
      },
    });

    // R2から音声ファイルを削除（非同期で実行、エラーが発生してもレシピ削除は成功として扱う）
    if (allInstructionIds.length > 0) {
      deleteAllInstructionAudios(recipeId, allInstructionIds).catch(error => {
        console.error('削除されたレシピの音声ファイル削除エラー:', error);
        // エラーはログのみで処理を継続
      });
    }

    // レシピ画像を削除
    if (existingRecipe?.imageUrl) {
      deleteImageFromR2(existingRecipe.imageUrl).catch(error => {
        console.error('削除されたレシピの画像ファイル削除エラー:', error);
        // エラーはログのみで処理を継続
      });
    }

    // 手順画像を削除
    existingInstructions.forEach(instruction => {
      if (instruction.imageUrl) {
        deleteImageFromR2(instruction.imageUrl).catch(error => {
          console.error('削除されたレシピの手順画像削除エラー:', error);
          // エラーはログのみで処理を継続
        });
      }
    });

    return NextResponse.json({ message: 'レシピが削除されました' });
  } catch (error) {
    console.error('レシピの削除エラー:', error);
    return NextResponse.json(
      { error: 'レシピの削除に失敗しました' },
      { status: 500 }
    );
  }
}
