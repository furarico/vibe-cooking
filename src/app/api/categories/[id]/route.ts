import { prisma } from '@/lib/prisma';
import { categorySchema } from '@/lib/validations';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/categories/[id] - 特定のカテゴリを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        _count: {
          select: {
            recipes: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'カテゴリが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('カテゴリ取得エラー:', error);
    return NextResponse.json(
      { error: 'カテゴリの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - カテゴリを更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // バリデーション
    const validatedData = categorySchema.parse(body);

    // カテゴリが存在するかチェック
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'カテゴリが見つかりません' },
        { status: 404 }
      );
    }

    // 同じ名前の別のカテゴリが既に存在するかチェック
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name: validatedData.name,
        id: {
          not: params.id,
        },
      },
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: 'このカテゴリ名は既に存在します' },
        { status: 409 }
      );
    }

    // カテゴリを更新
    const updatedCategory = await prisma.category.update({
      where: {
        id: params.id,
      },
      data: {
        name: validatedData.name,
      },
    });

    return NextResponse.json({
      message: 'カテゴリが正常に更新されました',
      category: updatedCategory,
    });
  } catch (error) {
    console.error('カテゴリ更新エラー:', error);

    // バリデーションエラーの場合
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: '入力データが無効です', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'カテゴリの更新に失敗しました' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - カテゴリを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // カテゴリが存在するかチェック
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        _count: {
          select: {
            recipes: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'カテゴリが見つかりません' },
        { status: 404 }
      );
    }

    // レシピが関連付けられている場合は削除を拒否
    if (existingCategory._count.recipes > 0) {
      return NextResponse.json(
        {
          error: 'このカテゴリにはレシピが関連付けられているため削除できません',
          recipeCount: existingCategory._count.recipes,
        },
        { status: 409 }
      );
    }

    // カテゴリを削除
    await prisma.category.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      message: 'カテゴリが正常に削除されました',
    });
  } catch (error) {
    console.error('カテゴリ削除エラー:', error);
    return NextResponse.json(
      { error: 'カテゴリの削除に失敗しました' },
      { status: 500 }
    );
  }
}
