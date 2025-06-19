'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ChefHat, Clock, Edit, Trash2, Users } from 'lucide-react';
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
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
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
  onDelete?: (recipeId: string) => void;
}

export function RecipeDetail({
  recipeId,
  onBack,
  onEdit,
  onDelete,
}: RecipeDetailProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!onDelete || !recipe) return;

    try {
      setIsDeleting(true);
      await onDelete(recipe.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('削除エラー:', error);
    } finally {
      setIsDeleting(false);
    }
  };

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
  const imageUrl =
    recipe.imageUrl || process.env.NEXT_PUBLIC_DEFAULT_IMAGE_URL || '';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          戻る
        </Button>
        <div className="flex gap-2">
          {onEdit && recipe && (
            <Button onClick={() => onEdit(recipe)} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              編集
            </Button>
          )}
          {onDelete && recipe && (
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              削除
            </Button>
          )}
        </div>
      </div>

      {/* メイン情報 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3">
              <div className="aspect-video overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
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

              <div className="space-y-3">
                {recipe.category && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      カテゴリ:
                    </span>
                    <Badge variant="outline">{recipe.category.name}</Badge>
                  </div>
                )}
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

      {/* 削除確認ダイアログ */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              レシピを削除しますか？
            </h3>
            <p className="text-gray-600 mb-6">
              「{recipe?.title}
              」を削除します。この操作は取り消すことができません。
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowDeleteDialog(false)}
                variant="outline"
                disabled={isDeleting}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                disabled={isDeleting}
              >
                {isDeleting ? '削除中...' : '削除する'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
