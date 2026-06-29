'use client';

import { CategoryDeleteDialog } from '@/components/category-delete-dialog';
import { CategoryEditForm } from '@/components/category-edit-form';
import { CategoryForm } from '@/components/category-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type CategoryFormData } from '@/lib/validations';
import { ArrowLeft, Edit3, Plus, Tag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface CategoriesResponse {
  categories: Category[];
}

type DialogMode = 'add' | 'edit' | 'delete' | null;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/categories');

      if (!response.ok) {
        throw new Error('カテゴリの取得に失敗しました');
      }

      const data: CategoriesResponse = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('カテゴリ取得エラー:', error);
      setError(error instanceof Error ? error.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (data: CategoryFormData) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'カテゴリの作成に失敗しました');
      }

      // 成功したらダイアログを閉じて、カテゴリ一覧を再取得
      setDialogMode(null);
      await fetchCategories();
    } catch (error) {
      console.error('カテゴリ作成エラー:', error);
      throw error; // フォームコンポーネントでエラーハンドリング
    }
  };

  const handleEditCategory = async (data: CategoryFormData) => {
    if (!selectedCategory) return;

    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'カテゴリの更新に失敗しました');
      }

      // 成功したらダイアログを閉じて、カテゴリ一覧を再取得
      setDialogMode(null);
      setSelectedCategory(null);
      await fetchCategories();
    } catch (error) {
      console.error('カテゴリ更新エラー:', error);
      throw error; // フォームコンポーネントでエラーハンドリング
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'カテゴリの削除に失敗しました');
      }

      // 成功したらダイアログを閉じて、カテゴリ一覧を再取得
      setDialogMode(null);
      setSelectedCategory(null);
      await fetchCategories();
    } catch (error) {
      console.error('カテゴリ削除エラー:', error);
      throw error;
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setDialogMode('edit');
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setDialogMode('delete');
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedCategory(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-lg">カテゴリを読み込み中...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">{error}</div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ホームに戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ホームに戻る
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Tag className="h-8 w-8" />
                カテゴリ一覧
              </h1>
              <p className="text-gray-600">
                料理のカテゴリを確認できます（{categories.length}件）
              </p>
            </div>
            <Button
              onClick={() => setDialogMode('add')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              カテゴリを追加
            </Button>
          </div>
        </header>

        {/* ダイアログ表示 */}
        {dialogMode && (
          <div className="mb-8 flex justify-center">
            {dialogMode === 'add' && (
              <CategoryForm
                onSubmit={handleAddCategory}
                onCancel={closeDialog}
              />
            )}
            {dialogMode === 'edit' && selectedCategory && (
              <CategoryEditForm
                category={selectedCategory}
                onSubmit={handleEditCategory}
                onCancel={closeDialog}
              />
            )}
            {dialogMode === 'delete' && selectedCategory && (
              <CategoryDeleteDialog
                category={selectedCategory}
                onConfirm={handleDeleteCategory}
                onCancel={closeDialog}
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map(category => (
            <Card
              key={category.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-sm">
                    {category.name}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(category)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  カテゴリ: {category.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">カテゴリが見つかりません</div>
            <Button
              onClick={() => setDialogMode('add')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              最初のカテゴリを追加
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
