import { z } from 'zod';

// APIエンドポイントのベースURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// API用のレシピスキーマ（バリデーション用）
const recipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().optional(),
  prepTime: z.number().min(0),
  cookTime: z.number().min(0),
  servings: z.number().min(1),
  tags: z.array(z.string()),
  imageUrl: z.string().optional(),
  ingredients: z.array(
    z.object({
      name: z.string().min(1),
      amount: z.number(),
      unit: z.string(),
      notes: z.string().optional(),
    })
  ),
  instructions: z.array(
    z.object({
      step: z.number().min(1),
      title: z.string().optional(),
      description: z.string().min(1),
      estimatedTime: z.number().optional(),
      imageUrl: z.string().optional(),
    })
  ),
});

type Recipe = z.infer<typeof recipeSchema>;

// カテゴリデータ
const categories = [
  { name: '魚料理' },
  { name: '肉料理' },
  { name: 'パスタ・麺類' },
  { name: 'サラダ' },
  { name: '中華料理' },
  { name: '煮込み料理' },
  { name: '朝食・デザート' },
  { name: '揚げ物' },
  { name: 'ご飯もの・丼物' },
  { name: '汁物・スープ' },
  { name: '炒め物' },
  { name: '副菜' },
  { name: '多国籍料理' },
];

// シードレシピデータ
const seedRecipes: Recipe[] = [
  {
    title: '鶏ひき肉とレンコンのつくね',
    description: 'シャキシャキとしたレンコンの食感が楽しいつくね。',
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    tags: ['肉料理', '和食', 'つくね'],
    ingredients: [
      { name: '鶏ひき肉', amount: 200, unit: 'g' },
      { name: 'レンコン', amount: 80, unit: 'g', notes: '粗みじん切り' },
      {
        name: '長ねぎ（白い部分）',
        amount: 0.25,
        unit: '本',
        notes: 'みじん切り',
      },
      { name: '卵', amount: 0.5, unit: '個' },
      { name: '片栗粉', amount: 1, unit: '大さじ' },
      { name: '醤油', amount: 1.5, unit: '大さじ' },
      { name: 'みりん', amount: 1.5, unit: '大さじ' },
      { name: '酒', amount: 1, unit: '大さじ' },
      { name: 'サラダ油', amount: 1, unit: '大さじ' },
    ],
    instructions: [
      {
        step: 1,
        description:
          '鶏ひき肉、レンコン、長ねぎ、卵、片栗粉を混ぜてよくこね、成形する。',
        estimatedTime: 10,
      },
      {
        step: 2,
        description: 'フライパンに油を熱し、つくねを両面焼く。',
        estimatedTime: 7,
      },
      {
        step: 3,
        description: '混ぜ合わせた調味料を加えて煮絡める。',
        estimatedTime: 3,
      },
    ],
  },
];

// レシピをPOSTする関数
async function postRecipe(recipe: Recipe): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(
      `✅ レシピ「${recipe.title}」を作成しました (ID: ${result.id})`
    );
  } catch (error) {
    console.error(`❌ レシピ「${recipe.title}」の作成に失敗しました:`, error);
    throw error;
  }
}

// メイン実行関数
async function main() {
  console.log('🚀 シードデータのPOST開始...');
  console.log(`📡 API endpoint: ${API_BASE_URL}/api/recipes`);
  console.log(`📋 投稿予定レシピ数: ${seedRecipes.length}件`);
  console.log();

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < seedRecipes.length; i++) {
    const recipe = seedRecipes[i];
    // Remove imageUrl property as per user request
    const { imageUrl, ...recipeWithoutImage } = recipe;

    try {
      console.log(
        `📝 [${i + 1}/${seedRecipes.length}] 投稿中: ${recipe.title}`
      );

      // バリデーション
      recipeSchema.parse(recipeWithoutImage); // Validate without imageUrl

      // POST実行
      await postRecipe(recipeWithoutImage as Recipe); // Cast back to Recipe for postRecipe
      successCount++;

      // API負荷軽減のため少し待機
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(
        `❌ [${i + 1}/${seedRecipes.length}] エラー: ${recipe.title}`
      );
      console.error(error);
      errorCount++;
    }

    console.log();
  }

  console.log('📊 実行結果:');
  console.log(`  ✅ 成功: ${successCount}件`);
  console.log(`  ❌ 失敗: ${errorCount}件`);
  console.log(`  📋 総数: ${seedRecipes.length}件`);

  if (errorCount > 0) {
    console.log(
      '\n⚠️  一部のレシピでエラーが発生しました。ログを確認してください。'
    );
    process.exit(1);
  } else {
    console.log('\n🎉 すべてのレシピが正常に投稿されました！');
    process.exit(0);
  }
}

// スクリプト実行
if (require.main === module) {
  main().catch(error => {
    console.error('💥 予期しないエラーが発生しました:', error);
    process.exit(1);
  });
}

export { main, postRecipe, seedRecipes };
