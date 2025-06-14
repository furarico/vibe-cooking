'use client';

import { RecipeDetail } from '@/components/recipe-detail';
import { RecipeForm } from '@/components/recipe-form';
import { RecipeList } from '@/components/recipe-list';
import { type RecipeFormData } from '@/lib/validations';
import { useState } from 'react';

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
  }>;
}

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const handleSubmitRecipe = async (data: RecipeFormData) => {
    try {
      const url = editingRecipe
        ? `/api/recipes/${editingRecipe.id}`
        : '/api/recipes';
      const method = editingRecipe ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          editingRecipe
            ? 'レシピの更新に失敗しました'
            : 'レシピの保存に失敗しました'
        );
      }

      setShowForm(false);
      setEditingRecipe(null);
      window.location.reload();
    } catch (error) {
      console.error(
        editingRecipe ? 'レシピの更新エラー:' : 'レシピの保存エラー:',
        error
      );
      throw error;
    }
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipeId(recipe.id);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setSelectedRecipeId(null);
    setShowForm(true);
  };

  const handleBackToList = () => {
    setSelectedRecipeId(null);
    setShowForm(false);
    setEditingRecipe(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            レシピマネージャー
          </h1>
          <p className="text-gray-600">お気に入りのレシピを管理しましょう</p>
        </header>

        {selectedRecipeId ? (
          <RecipeDetail
            recipeId={selectedRecipeId}
            onBack={handleBackToList}
            onEdit={handleEditRecipe}
          />
        ) : showForm ? (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setShowForm(false)}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                ← レシピ一覧に戻る
              </button>
            </div>
            <RecipeForm
              onSubmit={handleSubmitRecipe}
              isEditing={!!editingRecipe}
              defaultValues={
                editingRecipe
                  ? {
                      title: editingRecipe.title || '',
                      description: editingRecipe.description || '',
                      prepTime: editingRecipe.prepTime || undefined,
                      cookTime: editingRecipe.cookTime || undefined,
                      servings: editingRecipe.servings || undefined,
                      imageUrl: editingRecipe.imageUrl || '',
                      tags: editingRecipe.tags || [],
                      ingredients: editingRecipe.ingredients.map(
                        ingredient => ({
                          ...ingredient,
                          notes: ingredient.notes || '',
                        })
                      ),
                      instructions: editingRecipe.instructions.map(
                        instruction => ({
                          ...instruction,
                          imageUrl: instruction.imageUrl || '',
                          estimatedTime: instruction.estimatedTime || undefined,
                        })
                      ),
                    }
                  : undefined
              }
            />
          </div>
        ) : (
          <RecipeList
            onAddRecipe={() => setShowForm(true)}
            onViewRecipe={handleViewRecipe}
          />
        )}
      </div>
    </div>
  );
}
