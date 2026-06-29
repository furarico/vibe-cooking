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
    title: 'とろとろ卵の絶品オムライス',
    description:
      'カフェのようなとろとろ卵が楽しめるオムライスのレシピです。バター香るケチャップライスと、ふわふわ半熟卵の組み合わせは、大人も子どもも大満足間違いなし！おうちで本格的なオムライスをぜひ試してみてください。',
    prepTime: 20,
    cookTime: 15,
    servings: 1,
    tags: ['卵料理', '洋食', 'ご飯もの', '定番'],
    ingredients: [
      { name: '温かいご飯', amount: 200, unit: 'g' },
      { name: '鶏もも肉', amount: 50, unit: 'g', notes: '1cm角に切る' },
      { name: '玉ねぎ', amount: 0.25, unit: '個', notes: 'みじん切り' },
      { name: 'マッシュルーム', amount: 2, unit: '個', notes: '薄切り' },
      { name: 'バター', amount: 10, unit: 'g' },
      { name: 'ケチャップ', amount: 3, unit: '大さじ' },
      { name: '塩', amount: 0.25, unit: '小さじ' },
      { name: 'こしょう', amount: 0.25, unit: '小さじ' },
      { name: '卵', amount: 3, unit: '個' },
      { name: '牛乳', amount: 1, unit: '大さじ' },
      { name: 'サラダ油', amount: 1, unit: '大さじ' },
      {
        name: 'パセリ（みじん切り）',
        amount: 1,
        unit: 'g',
        notes: '飾り用、お好みで',
      },
    ],
    instructions: [
      {
        step: 1,
        description:
          '鶏もも肉は1cm角に、玉ねぎはみじん切りに、マッシュルームは薄切りにします。',
      },
      {
        step: 2,
        description:
          'フライパンにバター（5g）を熱し、鶏もも肉、玉ねぎ、マッシュルームを炒めます。',
      },
      {
        step: 3,
        description:
          '鶏肉に火が通り、玉ねぎがしんなりしたら温かいご飯を加えてほぐします。',
      },
      {
        step: 4,
        description:
          'ケチャップ（3大さじ）、塩、こしょうで味を調え、全体が均一になるように炒め合わせます。これでケチャップライスの完成です。一旦皿に移しておきましょう。',
      },
      {
        step: 5,
        description:
          'ボウルに卵（3個）を割り入れ、牛乳、塩、こしょうを加えてよく混ぜ合わせます。箸をボウルの底につけたまま、卵液を泡立てないように白身を切るイメージで混ぜるのがポイントです。',
      },
      {
        step: 6,
        description:
          '別のフライパン（直径20〜24cmがおすすめ）にサラダ油と残りのバター（5g）を入れ、中火で熱します。バターが溶けてフツフツと泡立ってきたら火を少し弱めます。',
      },
      {
        step: 7,
        description:
          '卵液を一気に流し入れ、菜箸やゴムベラで大きく円を描くように混ぜます。卵のフチが固まり始めたら、少し火からおろして余熱で調理を進めると、とろとろの半熟に仕上がります。',
      },
      {
        step: 8,
        description:
          'ケチャップライスの上に半熟卵を滑らせるように乗せます。形を整えるように、キッチンペーパーなどを使って軽く包み込むと綺麗に仕上がります。',
      },
      {
        step: 9,
        description:
          'お好みで上からケチャップ（分量外）をかけ、パセリのみじん切りを散らしたら完成です。',
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
