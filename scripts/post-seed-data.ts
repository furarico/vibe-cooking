import { z } from 'zod'

// APIエンドポイントのベースURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'

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
  ingredients: z.array(z.object({
    name: z.string().min(1),
    amount: z.number(),
    unit: z.string(),
    notes: z.string().optional()
  })),
  instructions: z.array(z.object({
    step: z.number().min(1),
    title: z.string().optional(),
    description: z.string().min(1),
    estimatedTime: z.number().optional(),
    imageUrl: z.string().optional()
  }))
})

type Recipe = z.infer<typeof recipeSchema>

// カテゴリデータ
const categories = [
  { name: "魚料理" },
  { name: "肉料理" },
  { name: "パスタ・麺類" },
  { name: "サラダ" },
  { name: "中華料理" },
  { name: "煮込み料理" },
  { name: "朝食・デザート" },
  { name: "揚げ物" },
  { name: "ご飯もの・丼物" },
  { name: "汁物・スープ" },
  { name: "炒め物" },
  { name: "副菜" },
  { name: "多国籍料理" }
]

// シードレシピデータ
const seedRecipes: Recipe[] = [
  {
    title: "チキンカレー",
    description: "本格的なスパイスを使った美味しいチキンカレーです",
    prepTime: 20,
    cookTime: 40,
    servings: 4,
    tags: ["カレー", "チキン", "辛い"],
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500",
    ingredients: [
      { name: "チキン", amount: 400, unit: "g" },
      { name: "玉ねぎ", amount: 2, unit: "個" },
      { name: "トマト缶", amount: 1, unit: "缶" },
      { name: "ココナッツミルク", amount: 400, unit: "ml" },
      { name: "カレー粉", amount: 2, unit: "大さじ" },
      { name: "ガラムマサラ", amount: 1, unit: "小さじ" },
      { name: "ショウガ", amount: 1, unit: "かけ", notes: "みじん切り" },
      { name: "ニンニク", amount: 2, unit: "かけ", notes: "みじん切り" }
    ],
    instructions: [
      {
        step: 1,
        title: "野菜を切る",
        description: "玉ねぎを薄切りにし、ショウガとニンニクをみじん切りにする",
        estimatedTime: 10
      },
      {
        step: 2,
        title: "チキンを切る",
        description: "チキンを一口大に切る",
        estimatedTime: 5
      },
      {
        step: 3,
        title: "チキンを炒める",
        description: "フライパンに油を熱し、チキンを炒めて取り出す",
        estimatedTime: 8
      },
      {
        step: 4,
        title: "野菜を炒める",
        description: "同じフライパンで玉ねぎ、ショウガ、ニンニクを炒める",
        estimatedTime: 7
      },
      {
        step: 5,
        title: "スパイスを加える",
        description: "カレー粉とガラムマサラを加えて香りを出す",
        estimatedTime: 2
      },
      {
        step: 6,
        title: "カレーを煮込む",
        description: "トマト缶とココナッツミルクを加え、チキンを戻して煮込む",
        estimatedTime: 20
      }
    ]
  },
  {
    title: "パスタアラビアータ",
    description: "ピリ辛トマトソースのシンプルなパスタです",
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    tags: ["パスタ", "辛い", "イタリアン"],
    imageUrl: "https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=500",
    ingredients: [
      { name: "スパゲッティ", amount: 200, unit: "g" },
      { name: "トマト缶", amount: 1, unit: "缶" },
      { name: "ニンニク", amount: 3, unit: "かけ", notes: "スライス" },
      { name: "鷹の爪", amount: 2, unit: "本" },
      { name: "オリーブオイル", amount: 3, unit: "大さじ" },
      { name: "パルメザンチーズ", amount: 30, unit: "g", notes: "削ったもの" },
      { name: "パセリ", amount: 1, unit: "束", notes: "みじん切り" }
    ],
    instructions: [
      {
        step: 1,
        title: "パスタを茹でる",
        description: "パスタを茹でる（袋の表示時間より1分短く）",
        estimatedTime: 8
      },
      {
        step: 2,
        title: "香味野菜を炒める",
        description: "フライパンにオリーブオイル、ニンニク、鷹の爪を入れて弱火で加熱",
        estimatedTime: 3
      },
      {
        step: 3,
        title: "トマト缶を加えて煮詰める",
        description: "トマト缶を加えて中火で煮詰める",
        estimatedTime: 5
      },
      {
        step: 4,
        title: "パスタを合わせる",
        description: "茹で上がったパスタとパスタの茹で汁を加えて混ぜる",
        estimatedTime: 2
      },
      {
        step: 5,
        title: "盛り付け",
        description: "パルメザンチーズとパセリを振りかけて完成",
        estimatedTime: 1
      }
    ]
  },
  {
    title: "サーモンのハーブ焼き",
    description: "ローズマリーとレモンが香る、シンプルでヘルシーなサーモン料理",
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    tags: ["魚", "ヘルシー", "洋風"],
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500",
    ingredients: [
      { name: "生鮭切り身", amount: 2, unit: "切れ" },
      { name: "ローズマリー", amount: 2, unit: "枝", notes: "生" },
      { name: "レモン", amount: 0.5, unit: "個" },
      { name: "オリーブオイル", amount: 1, unit: "大さじ" },
      { name: "塩", amount: 0.5, unit: "小さじ" },
      { name: "黒こしょう", amount: 0.25, unit: "小さじ" }
    ],
    instructions: [
      {
        step: 1,
        title: "下準備",
        description: "サーモンの水気を拭き取り、塩こしょうを振る。レモンは薄切りにする。",
        estimatedTime: 5
      },
      {
        step: 2,
        title: "焼く",
        description: "フライパンにオリーブオイルを熱し、サーモンとローズマリー、レモンを並べて焼く。",
        estimatedTime: 10
      },
      {
        step: 3,
        title: "火を通す",
        description: "サーモンに火が通るまで両面を焼き、レモンを絞って完成。",
        estimatedTime: 5
      }
    ]
  }
]

// レシピをPOSTする関数
async function postRecipe(recipe: Recipe): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipe)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const result = await response.json()
    console.log(`✅ レシピ「${recipe.title}」を作成しました (ID: ${result.id})`)
  } catch (error) {
    console.error(`❌ レシピ「${recipe.title}」の作成に失敗しました:`, error)
    throw error
  }
}

// メイン実行関数
async function main() {
  console.log('🚀 シードデータのPOST開始...')
  console.log(`📡 API endpoint: ${API_BASE_URL}/api/recipes`)
  console.log(`📋 投稿予定レシピ数: ${seedRecipes.length}件`)
  console.log()

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < seedRecipes.length; i++) {
    const recipe = seedRecipes[i]
    
    try {
      console.log(`📝 [${i + 1}/${seedRecipes.length}] 投稿中: ${recipe.title}`)
      
      // バリデーション
      recipeSchema.parse(recipe)
      
      // POST実行
      await postRecipe(recipe)
      successCount++
      
      // API負荷軽減のため少し待機
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (error) {
      console.error(`❌ [${i + 1}/${seedRecipes.length}] エラー: ${recipe.title}`)
      console.error(error)
      errorCount++
    }
    
    console.log()
  }

  console.log('📊 実行結果:')
  console.log(`  ✅ 成功: ${successCount}件`)
  console.log(`  ❌ 失敗: ${errorCount}件`)
  console.log(`  📋 総数: ${seedRecipes.length}件`)
  
  if (errorCount > 0) {
    console.log('\n⚠️  一部のレシピでエラーが発生しました。ログを確認してください。')
    process.exit(1)
  } else {
    console.log('\n🎉 すべてのレシピが正常に投稿されました！')
    process.exit(0)
  }
}

// スクリプト実行
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 予期しないエラーが発生しました:', error)
    process.exit(1)
  })
}

export { seedRecipes, postRecipe, main }