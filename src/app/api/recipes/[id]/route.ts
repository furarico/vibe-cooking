import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { recipeSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: params.id
      },
      include: {
        ingredients: true,
        instructions: {
          orderBy: {
            step: 'asc'
          }
        }
      }
    })

    if (!recipe) {
      return NextResponse.json(
        { error: 'レシピが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('レシピの取得エラー:', error)
    return NextResponse.json(
      { error: 'レシピの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = recipeSchema.parse(body)

    await prisma.ingredient.deleteMany({
      where: {
        recipeId: params.id
      }
    })

    await prisma.instruction.deleteMany({
      where: {
        recipeId: params.id
      }
    })

    const recipe = await prisma.recipe.update({
      where: {
        id: params.id
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
            notes: ingredient.notes
          }))
        },
        instructions: {
          create: validatedData.instructions.map(instruction => ({
            step: instruction.step,
            description: instruction.description,
            imageUrl: instruction.imageUrl,
            estimatedTime: instruction.estimatedTime
          }))
        }
      },
      include: {
        ingredients: true,
        instructions: {
          orderBy: {
            step: 'asc'
          }
        }
      }
    })

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('レシピの更新エラー:', error)
    return NextResponse.json(
      { error: 'レシピの更新に失敗しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.recipe.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'レシピが削除されました' })
  } catch (error) {
    console.error('レシピの削除エラー:', error)
    return NextResponse.json(
      { error: 'レシピの削除に失敗しました' },
      { status: 500 }
    )
  }
}