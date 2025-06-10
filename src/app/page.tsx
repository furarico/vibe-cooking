'use client'

import { useState } from 'react'
import { RecipeForm } from '@/components/recipe-form'
import { RecipeList } from '@/components/recipe-list'
import { type RecipeFormData } from '@/lib/validations'

export default function Home() {
  const [showForm, setShowForm] = useState(false)

  const handleSubmitRecipe = async (data: RecipeFormData) => {
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('レシピの保存に失敗しました')
      }

      setShowForm(false)
      window.location.reload()
    } catch (error) {
      console.error('レシピの保存エラー:', error)
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">レシピマネージャー</h1>
          <p className="text-gray-600">お気に入りのレシピを管理しましょう</p>
        </header>

        {showForm ? (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setShowForm(false)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← レシピ一覧に戻る
              </button>
            </div>
            <RecipeForm onSubmit={handleSubmitRecipe} />
          </div>
        ) : (
          <RecipeList onAddRecipe={() => setShowForm(true)} />
        )}
      </div>
    </div>
  )
}
