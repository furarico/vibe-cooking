namespace VibeCookingService {
  model Recipe {
    id: string;
    title: string;
    description: string;
    category: Category;

    /**
     * 準備時間（分）
     */
    prepTime: integer;

    /**
     * 調理時間（分）
     */
    cookTime: integer;

    /**
     * 人数分
     */
    servings: integer;

    ingredients: Ingredient[];
    instructions: Instruction[];
    imageUrl?: url;
    tags: string[];
    createdAt: utcDateTime;
    updatedAt: utcDateTime;
  }

  model Ingredient {
    /**
     * 材料ID
     */
    id: string;

    /**
     * 材料名
     */
    name: string;

    /**
     * 分量
     */
    amount: numeric;

    /**
     * 単位
     */
    unit: string;

    /**
     * 備考
     */
    notes?: string;
  }

  model Instruction {
    /**
     * 手順ID
     */
    id: string;

    /**
     * レシピID
     */
    recipeId: string;

    /**
     * 手順番号
     */
    step: integer;

    /**
     * 手順のタイトル（例：パスタを茹でる、野菜を炒める）
     */
    title: string;

    /**
     * 手順の説明
     */
    description: string;

    /**
     * 手順の画像URL
     */
    imageUrl?: url;

    /**
     * 手順の音声URL
     */
    audioUrl?: url;

    /**
     * この手順の推定時間（分）
     */
    estimatedTime?: integer;

    /**
     * タイマーの所要時間 (秒)
     *
     * タイマーセットが必要な手順のみ値を返却
     *
     * タイマーセットが必要ない場合はnull
     */
    timerDuration?: float64;
  }

  model Category {
    /**
     * カテゴリID
     */
    id: string;

    /**
     * カテゴリ名（例：ご飯、おかず、デザート、汁物）
     */
    name: string;
  }

  model VibeRecipe {
    /**
     * VibeレシピID
     */
    id: string;

    /**
     * 関連するレシピIDの配列
     */
    recipeIds: string[];

    /**
     * Vibe手順の配列
     */
    vibeInstructions: VibeInstruction[];
  }

  model VibeInstruction {
    /**
     * バイブレシピ手順ID
     */
    id: string;

    /**
     * 手順ID
     */
    instructionId: string;

    /**
     * バイブレシピの手順番号
     */
    step: integer;

    /**
     * レシピID
     */
    recipeId: string;
  }
}
