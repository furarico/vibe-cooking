'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ChefHat, Clock, Edit, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface Recipe {
  id: string;
  title: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  imageUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  ingredients: Array<{
    id: string;
    name: string;
    amount: number;
    unit: string;
    notes?: string;
  }>;
  instructions: Array<{
    id: string;
    step: number;
    description: string;
    imageUrl?: string;
    estimatedTime?: number;
    audioUrl?: string;
  }>;
}

interface RecipeDetailProps {
  recipeId: string;
  onBack: () => void;
  onEdit?: (recipe: Recipe) => void;
}

export function RecipeDetail({ recipeId, onBack, onEdit }: RecipeDetailProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipeDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/recipes/${recipeId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('レシピが見つかりません');
        }
        throw new Error('レシピの取得に失敗しました');
      }

      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error('レシピ詳細の取得エラー:', error);
      setError(error instanceof Error ? error.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchRecipeDetail();
  }, [fetchRecipeDetail]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">レシピを読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          レシピ一覧に戻る
        </Button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">レシピが見つかりません</div>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          レシピ一覧に戻る
        </Button>
      </div>
    );
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          戻る
        </Button>
        {onEdit && recipe && (
          <Button onClick={() => onEdit(recipe)} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            編集
          </Button>
        )}
      </div>

      {/* メイン情報 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-6">
            {recipe.imageUrl && (
              <div className="lg:w-1/3">
                <div className="aspect-video overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-2xl mb-3">{recipe.title}</CardTitle>
              {recipe.description && (
                <p className="text-muted-foreground mb-4">
                  {recipe.description}
                </p>
              )}

              <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                {totalTime > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>合計 {totalTime}分</span>
                  </div>
                )}
                {recipe.prepTime && <div>準備 {recipe.prepTime}分</div>}
                {recipe.cookTime && <div>調理 {recipe.cookTime}分</div>}
                {recipe.servings && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings}人分</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4" />
                  <span>{recipe.instructions.length}手順</span>
                </div>
              </div>

              {recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 材料 */}
      <Card>
        <CardHeader>
          <CardTitle>材料</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recipe.ingredients.map(ingredient => (
              <div
                key={ingredient.id}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <span className="font-medium">{ingredient.name}</span>
                <span className="text-muted-foreground">
                  {ingredient.amount} {ingredient.unit}
                  {ingredient.notes && (
                    <span className="text-xs ml-2 text-gray-500">
                      ({ingredient.notes})
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 手順 */}
      <Card>
        <CardHeader>
          <CardTitle>作り方</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recipe.instructions.map(instruction => (
              <div key={instruction.id} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                  {instruction.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {instruction.estimatedTime && (
                      <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                        約{instruction.estimatedTime}分
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {instruction.description}
                  </p>
                  {instruction.imageUrl && (
                    <div className="mt-3">
                      <div className="aspect-video max-w-md overflow-hidden rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={instruction.imageUrl}
                          alt={`手順 ${instruction.step}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {instruction.audioUrl && (
                    <div className="mt-3">
                      <audio controls className="w-full max-w-md">
                        <source src={instruction.audioUrl} type="audio/mpeg" />
                        お使いのブラウザは音声再生に対応していません。
                      </audio>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
