import { prisma } from '@/lib/prisma';
import { categorySchema } from '@/lib/validations';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/categories - カテゴリ一覧を取得
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      categories,
    });
  } catch (error) {
    console.error('カテゴリ一覧取得エラー:', error);
    return NextResponse.json(
      { error: 'カテゴリの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// POST /api/categories - カテゴリを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validatedData = categorySchema.parse(body);

    // 同じ名前のカテゴリが既に存在するかチェック
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: validatedData.name,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'このカテゴリ名は既に存在します' },
        { status: 409 }
      );
    }

    // カテゴリを作成
    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
      },
    });

    return NextResponse.json(
      {
        message: 'カテゴリが正常に作成されました',
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('カテゴリ作成エラー:', error);

    // バリデーションエラーの場合
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: '入力データが無効です', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'カテゴリの作成に失敗しました' },
      { status: 500 }
    );
  }
}
