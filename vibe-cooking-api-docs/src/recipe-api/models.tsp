namespace RecipeService {
  model Recipe {
    id: string;

    /**
     * レシピのタイトル
     */
    title: string;

    /**
     * レシピの説明
     */
    description: string;

    /**
     * 材料
     */
    ingredients: Ingredient[];

    /**
     * 手順
     */
    instructions: Instruction[];

    /**
     * レシピの画像URL
     */
    imageUrl?: url;
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
     * 手順の音声URL
     */
    audioUrl?: url;

    /**
     * タイマーの所要時間 (秒)
     *
     * タイマーセットが必要な手順のみ値を返却
     *
     * タイマーセットが必要ない場合はnull
     */
    timerDuration?: float64;
  }
}
