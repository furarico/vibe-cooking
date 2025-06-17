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
    title: 'チキンカレー',
    description: '本格的なスパイスを使った美味しいチキンカレーです',
    prepTime: 20,
    cookTime: 40,
    servings: 4,
    tags: ['カレー', 'チキン', '辛い'],
    imageUrl:
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500', // Example URL, will be removed if user wants no image URLs
    ingredients: [
      { name: 'チキン', amount: 400, unit: 'g' },
      { name: '玉ねぎ', amount: 2, unit: '個' },
      { name: 'トマト缶', amount: 1, unit: '缶' },
      { name: 'ココナッツミルク', amount: 400, unit: 'ml' },
      { name: 'カレー粉', amount: 2, unit: '大さじ' },
      { name: 'ガラムマサラ', amount: 1, unit: '小さじ' },
      { name: 'ショウガ', amount: 1, unit: 'かけ', notes: 'みじん切り' },
      { name: 'ニンニク', amount: 2, unit: 'かけ', notes: 'みじん切り' },
    ],
    instructions: [
      {
        step: 1,
        title: '野菜を切る',
        description: '玉ねぎを薄切りにし、ショウガとニンニクをみじん切りにする',
        estimatedTime: 10,
      },
      {
        step: 2,
        title: 'チキンを切る',
        description: 'チキンを一口大に切る',
        estimatedTime: 5,
      },
      {
        step: 3,
        title: 'チキンを炒める',
        description: 'フライパンに油を熱し、チキンを炒めて取り出す',
        estimatedTime: 8,
      },
      {
        step: 4,
        title: '野菜を炒める',
        description: '同じフライパンで玉ねぎ、ショウガ、ニンニクを炒める',
        estimatedTime: 7,
      },
      {
        step: 5,
        title: 'スパイスを加える',
        description: 'カレー粉とガラムマサラを加えて香りを出す',
        estimatedTime: 2,
      },
      {
        step: 6,
        title: 'カレーを煮込む',
        description: 'トマト缶とココナッツミルクを加え、チキンを戻して煮込む',
        estimatedTime: 20,
      },
    ],
  },
  {
    title: 'パスタアラビアータ',
    description: 'ピリ辛トマトソースのシンプルなパスタです',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    tags: ['パスタ', '辛い', 'イタリアン'],
    imageUrl:
      'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=500', // Example URL
    ingredients: [
      { name: 'スパゲッティ', amount: 200, unit: 'g' },
      { name: 'トマト缶', amount: 1, unit: '缶' },
      { name: 'ニンニク', amount: 3, unit: 'かけ', notes: 'スライス' },
      { name: '鷹の爪', amount: 2, unit: '本' },
      { name: 'オリーブオイル', amount: 3, unit: '大さじ' },
      { name: 'パルメザンチーズ', amount: 30, unit: 'g', notes: '削ったもの' },
      { name: 'パセリ', amount: 1, unit: '束', notes: 'みじん切り' },
    ],
    instructions: [
      {
        step: 1,
        title: 'パスタを茹でる',
        description: 'パスタを茹でる（袋の表示時間より1分短く）',
        estimatedTime: 8,
      },
      {
        step: 2,
        title: '香味野菜を炒める',
        description:
          'フライパンにオリーブオイル、ニンニク、鷹の爪を入れて弱火で加熱',
        estimatedTime: 3,
      },
      {
        step: 3,
        title: 'トマト缶を加えて煮詰める',
        description: 'トマト缶を加えて中火で煮詰める',
        estimatedTime: 5,
      },
      {
        step: 4,
        title: 'パスタを合わせる',
        description: '茹で上がったパスタとパスタの茹で汁を加えて混ぜる',
        estimatedTime: 2,
      },
      {
        step: 5,
        title: '盛り付け',
        description: 'パルメザンチーズとパセリを振りかけて完成',
        estimatedTime: 1,
      },
    ],
  },
  {
    title: 'サーモンのハーブ焼き',
    description: 'ローズマリーとレモンが香る、シンプルでヘルシーなサーモン料理',
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    tags: ['魚', 'ヘルシー', '洋風'],
    imageUrl:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500', // Example URL
    ingredients: [
      { name: '生鮭切り身', amount: 2, unit: '切れ' },
      { name: 'ローズマリー', amount: 2, unit: '枝', notes: '生' },
      { name: 'レモン', amount: 0.5, unit: '個' },
      { name: 'オリーブオイル', amount: 1, unit: '大さじ' },
      { name: '塩', amount: 0.5, unit: '小さじ' },
      { name: '黒こしょう', amount: 0.25, unit: '小さじ' },
    ],
    instructions: [
      {
        step: 1,
        title: '下準備',
        description:
          'サーモンの水気を拭き取り、塩こしょうを振る。レモンは薄切りにする。',
        estimatedTime: 5,
      },
      {
        step: 2,
        title: '焼く',
        description:
          'フライパンにオリーブオイルを熱し、サーモンとローズマリー、レモンを並べて焼く。',
        estimatedTime: 10,
      },
      {
        step: 3,
        title: '火を通す',
        description: 'サーモンに火が通るまで両面を焼き、レモンを絞って完成。',
        estimatedTime: 5,
      },
    ],
  },
  {
    title: '豚の生姜焼き',
    description: 'ご飯が進む定番の和食メニューです。',
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    tags: ['肉', '和食', '定番'],
    ingredients: [
      { name: '豚ロース薄切り', amount: 250, unit: 'g' },
      { name: '玉ねぎ', amount: 0.5, unit: '個', notes: '薄切り' },
      { name: '生姜', amount: 1, unit: 'かけ', notes: 'すりおろし' },
      { name: '醤油', amount: 2, unit: '大さじ' },
      { name: 'みりん', amount: 2, unit: '大さじ' },
      { name: '料理酒', amount: 1, unit: '大さじ' },
      { name: '砂糖', amount: 0.5, unit: '大さじ' },
      { name: 'サラダ油', amount: 1, unit: '大さじ' },
    ],
    instructions: [
      {
        step: 1,
        description: '豚肉に下味をつけ、玉ねぎを切る。',
        estimatedTime: 3,
      },
      {
        step: 2,
        description: 'フライパンで豚肉を炒め、色が変わったら玉ねぎを加える。',
        estimatedTime: 5,
      },
      {
        step: 3,
        description: '調味料を加えて煮絡める。',
        estimatedTime: 2,
      },
    ],
  },
  {
    title: '鶏肉と野菜の黒酢炒め',
    description: '彩り豊かな野菜と鶏肉を黒酢あんで絡めた一品。',
    prepTime: 15,
    cookTime: 15,
    servings: 3,
    tags: ['肉', '中華', 'ヘルシー'],
    ingredients: [
      { name: '鶏もも肉', amount: 300, unit: 'g' },
      { name: 'パプリカ（赤・黄）', amount: 1, unit: '個ずつ' },
      { name: 'ピーマン', amount: 2, unit: '個' },
      { name: '玉ねぎ', amount: 0.5, unit: '個' },
      { name: '黒酢', amount: 3, unit: '大さじ' },
      { name: '醤油', amount: 2, unit: '大さじ' },
      { name: '砂糖', amount: 1.5, unit: '大さじ' },
      { name: '片栗粉', amount: 1, unit: '大さじ' },
      { name: 'ごま油', amount: 1, unit: '大さじ' },
    ],
    instructions: [
      {
        step: 1,
        description: '鶏肉と野菜を食べやすい大きさに切る。',
        estimatedTime: 5,
      },
      {
        step: 2,
        description: '鶏肉に片栗粉をまぶし、ごま油で炒める。',
        estimatedTime: 5,
      },
      {
        step: 3,
        description: '野菜を加えて炒め、調味料を混ぜた黒酢あんを加えて絡める。',
        estimatedTime: 5,
      },
    ],
  },
  {
    title: 'ほうれん草とベーコンのキッシュ',
    description: 'パーティーにもぴったりの、見栄えの良いキッシュ。',
    prepTime: 20,
    cookTime: 40,
    servings: 6,
    tags: ['洋食', 'パーティー', '卵'],
    ingredients: [
      { name: '冷凍パイシート', amount: 1, unit: '枚' },
      { name: 'ほうれん草', amount: 200, unit: 'g' },
      { name: 'ベーコン', amount: 80, unit: 'g', notes: '短冊切り' },
      { name: '卵', amount: 2, unit: '個' },
      { name: '生クリーム', amount: 100, unit: 'ml' },
      { name: '牛乳', amount: 50, unit: 'ml' },
      { name: 'ピザ用チーズ', amount: 50, unit: 'g' },
      { name: '塩こしょう', amount: 1, unit: '少々' },
    ],
    instructions: [
      {
        step: 1,
        description: 'パイシートを型に敷き、フォークで穴を開ける。',
        estimatedTime: 5,
      },
      {
        step: 2,
        description: 'ほうれん草とベーコンを炒め、水気を切る。',
        estimatedTime: 5,
      },
      {
        step: 3,
        description:
          '卵、生クリーム、牛乳、塩こしょうを混ぜ、具材とチーズを加える。',
        estimatedTime: 5,
      },
      {
        step: 4,
        description: 'パイシートに流し込み、オーブンで焼き色がつくまで焼く。',
        estimatedTime: 25,
      },
    ],
  },
  {
    title: '簡単シーザーサラダ',
    description: '手軽に作れる定番のシーザーサラダ。',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    tags: ['サラダ', 'ヘルシー', '洋食'],
    ingredients: [
      { name: 'レタス', amount: 0.5, unit: '個' },
      { name: 'クルトン', amount: 20, unit: 'g' },
      { name: 'パルメザンチーズ', amount: 20, unit: 'g', notes: '削ったもの' },
      {
        name: 'ベーコン',
        amount: 50,
        unit: 'g',
        notes: 'カリカリに焼いたもの',
      },
      { name: 'シーザードレッシング', amount: 3, unit: '大さじ' },
    ],
    instructions: [
      {
        step: 1,
        description: 'レタスを食べやすい大きさにちぎり、水気をしっかり切る。',
        estimatedTime: 5,
      },
      {
        step: 2,
        description: '全ての材料をボウルに入れ、ドレッシングで和える。',
        estimatedTime: 5,
      },
    ],
  },
  {
    title: '和風きのこと鶏肉の炊き込みご飯',
    description: 'きのこの香りが食欲をそそる、優しい味の炊き込みご飯。',
    prepTime: 10,
    cookTime: 40,
    servings: 4,
    tags: ['ご飯もの', '和食', 'きのこ'],
    ingredients: [
      { name: '米', amount: 2, unit: '合' },
      { name: '鶏もも肉', amount: 150, unit: 'g' },
      { name: 'しめじ', amount: 1, unit: 'パック' },
      { name: 'まいたけ', amount: 1, unit: 'パック' },
      { name: '人参', amount: 0.3, unit: '本', notes: '細切り' },
      { name: '醤油', amount: 2, unit: '大さじ' },
      { name: 'みりん', amount: 2, unit: '大さじ' },
      { name: 'だし汁', amount: 360, unit: 'ml' },
    ],
    instructions: [
      {
        step: 1,
        description: '米を研ぎ、だし汁、醤油、みりんを加えて30分浸水させる。',
        estimatedTime: 5,
      },
      {
        step: 2,
        description: '鶏肉と野菜を切って炊飯器に入れ、炊飯する。',
        estimatedTime: 5,
      },
      {
        step: 3,
        description: '炊き上がったら軽く混ぜて蒸らす。',
        estimatedTime: 30,
      },
    ],
  },
  {
    title: '簡単ミネストローネ',
    description: '野菜たっぷりで栄養満点！体が温まるスープ。',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    tags: ['汁物', '野菜', '洋食'],
    ingredients: [
      { name: '玉ねぎ', amount: 1, unit: '個' },
      { name: '人参', amount: 1, unit: '本' },
      { name: 'セロリ', amount: 0.5, unit: '本' },
      { name: 'キャベツ', amount: 100, unit: 'g' },
      { name: 'トマト缶', amount: 1, unit: '缶' },
      { name: '水', amount: 500, unit: 'ml' },
      { name: 'コンソメキューブ', amount: 1, unit: '個' },
      { name: 'オリーブオイル', amount: 1, unit: '大さじ' },
      { name: '塩こしょう', amount: 1, unit: '少々' },
    ],
    instructions: [
      {
        step: 1,
        description: '野菜を全て1cm角に切る。',
        estimatedTime: 10,
      },
      {
        step: 2,
        description: '鍋にオリーブオイルを熱し、野菜を炒める。',
        estimatedTime: 5,
      },
      {
        step: 3,
        description: 'トマト缶、水、コンソメを加えて煮込む。',
        estimatedTime: 10,
      },
      {
        step: 4,
        description: '塩こしょうで味を調える。',
        estimatedTime: 1,
      },
    ],
  },
  {
    title: '麻婆豆腐',
    description: 'ご飯が止まらない！本格的な辛さが特徴の麻婆豆腐。',
    prepTime: 10,
    cookTime: 15,
    servings: 3,
    tags: ['中華', '辛い', '豆腐'],
    ingredients: [
      { name: '豚ひき肉', amount: 150, unit: 'g' },
      { name: '木綿豆腐', amount: 300, unit: 'g' },
      { name: '長ねぎ', amount: 0.5, unit: '本', notes: 'みじん切り' },
      { name: 'ニンニク', amount: 1, unit: 'かけ', notes: 'みじん切り' },
      { name: '豆板醤', amount: 1, unit: '小さじ' },
      { name: '甜麺醤', amount: 1, unit: '大さじ' },
      { name: '豆鼓醤', amount: 0.5, unit: '小さじ' },
      { name: '鶏ガラスープ', amount: 200, unit: 'ml' },
      { name: '水溶き片栗粉', amount: 2, unit: '大さじ' },
      { name: 'ラー油', amount: 1, unit: '小さじ', notes: 'お好みで' },
    ],
    instructions: [
      {
        step: 1,
        description: '豆腐を一口大に切り、ひき肉と長ねぎ、ニンニクを準備する。',
        estimatedTime: 5,
      },
      {
        step: 2,
        description:
          'フライパンでひき肉を炒め、豆板醤、甜麺醤、豆鼓醤、ニンニク、長ねぎを加えて香りを出す。',
        estimatedTime: 5,
      },
      {
        step: 3,
        description:
          '鶏ガラスープと豆腐を加えて煮込み、水溶き片栗粉でとろみをつける。',
        estimatedTime: 5,
      },
      {
        step: 4,
        description: 'お好みでラー油を回しかける。',
        estimatedTime: 1,
      },
    ],
  },
  {
    title: 'タラのムニエル',
    description: '外はカリッと、中はふっくら。バターの香りが食欲をそそります。',
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    tags: ['魚', '洋食', '簡単'],
    ingredients: [
      { name: '生タラ切り身', amount: 2, unit: '切れ' },
      { name: '薄力粉', amount: 3, unit: '大さじ' },
      { name: 'バター', amount: 20, unit: 'g' },
      { name: 'オリーブオイル', amount: 1, unit: '大さじ' },
      { name: '塩こしょう', amount: 1, unit: '少々' },
      { name: 'レモン', amount: 0.25, unit: '個', notes: 'お好みで' },
    ],
    instructions: [
      {
        step: 1,
        description: 'タラの水気を拭き取り、塩こしょうをして薄力粉をまぶす。',
        estimatedTime: 3,
      },
      {
        step: 2,
        description: 'フライパンにオリーブオイルとバターを熱し、タラを焼く。',
        estimatedTime: 7,
      },
      {
        step: 3,
        description: '両面に焼き色がついたら完成。お好みでレモンを絞る。',
        estimatedTime: 1,
      },
    ],
  },
  {
    title: '鶏むね肉の棒棒鶏（バンバンジー）',
    description: 'ヘルシーなのに満足感たっぷり！ごまだれが美味しい中華冷菜。',
    prepTime: 20,
    cookTime: 15,
    servings: 2,
    tags: ['肉', '中華', 'ヘルシー', '副菜'],
    ingredients: [
      { name: '鶏むね肉', amount: 200, unit: 'g' },
      { name: 'きゅうり', amount: 1, unit: '本' },
      { name: '長ねぎ（白い部分）', amount: 0.25, unit: '本' },
      { name: 'すりごま', amount: 2, unit: '大さじ' },
      { name: '醤油', amount: 2, unit: '大さじ' },
      { name: '酢', amount: 1, unit: '大さじ' },
      { name: '砂糖', amount: 1, unit: '小さじ' },
      { name: 'ごま油', amount: 1, unit: '小さじ' },
      { name: 'ラー油', amount: 0.5, unit: '小さじ', notes: 'お好みで' },
    ],
    instructions: [
      {
        step: 1,
        description:
          '鶏むね肉を茹でて冷まし、手で裂く。きゅうりは千切り、長ねぎは白髪ねぎにする。',
        estimatedTime: 15,
      },
      {
        step: 2,
        description: 'ごまだれの材料を全て混ぜ合わせる。',
        estimatedTime: 3,
      },
      {
        step: 3,
        description: '鶏肉ときゅうりを盛り付け、ごまだれをかける。',
        estimatedTime: 2,
      },
    ],
  },
  {
    title: 'トマトとモッツァレラチーズのカプレーゼ',
    description: 'イタリアンの定番！シンプルながらも美味しい前菜。',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    tags: ['サラダ', 'イタリアン', '前菜'],
    ingredients: [
      { name: 'トマト', amount: 2, unit: '個' },
      { name: 'モッツァレラチーズ', amount: 100, unit: 'g' },
      { name: 'バジル', amount: 5, unit: '枚' },
      { name: 'オリーブオイル', amount: 1, unit: '大さじ' },
      { name: '塩こしょう', amount: 1, unit: '少々' },
    ],
    instructions: [
      {
        step: 1,
        description: 'トマトとモッツァレラチーズを薄切りにする。',
        estimatedTime: 5,
      },
      {
        step: 2,
        description: 'お皿にトマト、モッツァレラチーズ、バジルを交互に並べる。',
        estimatedTime: 3,
      },
      {
        step: 3,
        description: 'オリーブオイルと塩こしょうをかける。',
        estimatedTime: 2,
      },
    ],
  },
  {
    title: 'ナスとひき肉の味噌炒め',
    description: '甘辛い味噌味がご飯によく合う、ナスを使った炒め物。',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    tags: ['炒め物', '和食', 'なす'],
    ingredients: [
      { name: 'ナス', amount: 2, unit: '本' },
      { name: '豚ひき肉', amount: 100, unit: 'g' },
      { name: 'ピーマン', amount: 1, unit: '個' },
      { name: '味噌', amount: 1.5, unit: '大さじ' },
      { name: '砂糖', amount: 1, unit: '大さじ' },
      { name: 'みりん', amount: 1, unit: '大さじ' },
      { name: '酒', amount: 1, unit: '大さじ' },
      { name: 'サラダ油', amount: 1, unit: '大さじ' },
    ],
    instructions: [
      {
        step: 1,
        description: 'ナスとピーマンを食べやすい大きさに切る。',
        estimatedTime: 5,
      },
      {
        step: 2,
        description: 'フライパンに油を熱し、ひき肉とナス、ピーマンを炒める。',
        estimatedTime: 7,
      },
      {
        step: 3,
        description: '混ぜ合わせた調味料を加えて、全体に味が絡むまで炒める。',
        estimatedTime: 3,
      },
    ],
  },
  {
    title: '簡単フレンチトースト',
    description: '朝食やおやつにぴったり。ふわふわのフレンチトースト。',
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    tags: ['朝食', 'デザート', '簡単'],
    ingredients: [
      { name: '食パン（6枚切り）', amount: 2, unit: '枚' },
      { name: '卵', amount: 1, unit: '個' },
      { name: '牛乳', amount: 100, unit: 'ml' },
      { name: '砂糖', amount: 1, unit: '大さじ' },
      { name: 'バター', amount: 10, unit: 'g' },
      {
        name: 'メープルシロップ',
        amount: 1,
        unit: '大さじ',
        notes: 'お好みで',
      },
    ],
    instructions: [
      {
        step: 1,
        description: '卵、牛乳、砂糖を混ぜ、食パンを浸す。',
        estimatedTime: 5,
      },
      {
        step: 2,
        description: 'フライパンにバターを熱し、パンを両面焼く。',
        estimatedTime: 5,
      },
      {
        step: 3,
        description: 'お好みでメープルシロップをかける。',
        estimatedTime: 1,
      },
    ],
  },
  {
    title: '鶏肉の唐揚げ',
    description: 'ジューシーでカリッと揚がった、みんな大好き唐揚げ。',
    prepTime: 20,
    cookTime: 10,
    servings: 3,
    tags: ['揚げ物', '肉', '定番'],
    ingredients: [
      { name: '鶏もも肉', amount: 300, unit: 'g' },
      { name: '醤油', amount: 2, unit: '大さじ' },
      { name: '酒', amount: 1, unit: '大さじ' },
      { name: '生姜', amount: 1, unit: 'かけ', notes: 'すりおろし' },
      { name: 'ニンニク', amount: 0.5, unit: 'かけ', notes: 'すりおろし' },
      { name: '片栗粉', amount: 4, unit: '大さじ' },
      { name: '揚げ油', amount: 1, unit: '適量' },
    ],
    instructions: [
      {
        step: 1,
        description:
          '鶏肉を一口大に切り、醤油、酒、生姜、ニンニクで下味をつける。',
        estimatedTime: 10,
      },
      {
        step: 2,
        description: '片栗粉をまぶし、170度の油で揚げる。',
        estimatedTime: 10,
      },
      {
        step: 3,
        description: '二度揚げするとよりカリッと仕上がる。',
        estimatedTime: 5,
      },
    ],
  },
  {
    title: '豚バラ大根',
    description: '味がしっかり染みた、ご飯にもお酒にも合う煮込み料理。',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    tags: ['煮込み料理', '肉', '和食'],
    ingredients: [
      { name: '豚バラブロック肉', amount: 300, unit: 'g' },
      { name: '大根', amount: 400, unit: 'g' },
      { name: '水', amount: 400, unit: 'ml' },
      { name: '醤油', amount: 3, unit: '大さじ' },
      { name: 'みりん', amount: 3, unit: '大さじ' },
      { name: '砂糖', amount: 1.5, unit: '大さじ' },
      { name: '生姜', amount: 0.5, unit: 'かけ', notes: '薄切り' },
    ],
    instructions: [
      {
        step: 1,
        description:
          '大根は厚めのいちょう切りにし、下茹でする。豚バラ肉は食べやすい大きさに切る。',
        estimatedTime: 10,
      },
      {
        step: 2,
        description: '鍋に豚肉、大根、水、調味料、生姜を入れ、煮込む。',
        estimatedTime: 20,
      },
      {
        step: 3,
        description: '大根が柔らかくなり、味が染みたら完成。',
        estimatedTime: 10,
      },
    ],
  },
  {
    title: 'えびとブロッコリーのアヒージョ',
    description: 'ワインに合うおしゃれな一品。バゲットを添えて。',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    tags: ['多国籍料理', 'シーフード', 'パーティー'],
    ingredients: [
      { name: 'むきえび', amount: 150, unit: 'g' },
      { name: 'ブロッコリー', amount: 100, unit: 'g' },
      { name: 'マッシュルーム', amount: 6, unit: '個' },
      { name: 'ニンニク', amount: 3, unit: 'かけ', notes: 'スライス' },
      { name: '鷹の爪', amount: 1, unit: '本' },
      { name: 'オリーブオイル', amount: 200, unit: 'ml' },
      { name: '塩', amount: 0.5, unit: '小さじ' },
    ],
    instructions: [
      {
        step: 1,
        description:
          'えびは背わたを取り、ブロッコリーは小房に分け、マッシュルームは半分に切る。',
        estimatedTime: 5,
      },
      {
        step: 2,
        description:
          '耐熱皿に全ての材料とオリーブオイル、塩を入れ、ニンニクと鷹の爪を散らす。',
        estimatedTime: 5,
      },
      {
        step: 3,
        description:
          'オーブントースターまたはグリルで、えびに火が通るまで焼く。',
        estimatedTime: 10,
      },
    ],
  },
  {
    title: 'きゅうりとワカメの酢の物',
    description: '箸休めにぴったりのさっぱりとした和え物。',
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    tags: ['副菜', '和食', 'ヘルシー'],
    ingredients: [
      { name: 'きゅうり', amount: 1, unit: '本' },
      { name: '乾燥ワカメ', amount: 5, unit: 'g' },
      { name: '酢', amount: 2, unit: '大さじ' },
      { name: '砂糖', amount: 1, unit: '大さじ' },
      { name: '醤油', amount: 0.5, unit: '大さじ' },
      { name: '塩', amount: 0.25, unit: '小さじ', notes: 'きゅうり用' },
    ],
    instructions: [
      {
        step: 1,
        description:
          'きゅうりを薄切りにし、塩もみして水気を絞る。乾燥ワカメは水で戻して水気を切る。',
        estimatedTime: 5,
      },
      {
        step: 2,
        description: '酢、砂糖、醤油を混ぜ合わせ、きゅうりとワカメを和える。',
        estimatedTime: 2,
      },
    ],
  },
  {
    title: '豚肉とキャベツの味噌炒め',
    description: '甘辛い味噌ダレが食欲をそそる、ご飯によく合う一品。',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    tags: ['炒め物', '肉', '和食'],
    ingredients: [
      { name: '豚こま切れ肉', amount: 200, unit: 'g' },
      { name: 'キャベツ', amount: 200, unit: 'g' },
      { name: 'ピーマン', amount: 1, unit: '個' },
      { name: '味噌', amount: 1.5, unit: '大さじ' },
      { name: '砂糖', amount: 1, unit: '大さじ' },
      { name: 'みりん', amount: 1, unit: '大さじ' },
      { name: '酒', amount: 1, unit: '大さじ' },
      { name: 'サラダ油', amount: 1, unit: '大さじ' },
    ],
    instructions: [
      {
        step: 1,
        description: 'キャベツはざく切り、ピーマンは細切りにする。',
        estimatedTime: 5,
      },
      {
        step: 2,
        description: 'フライパンに油を熱し、豚肉を炒める。',
        estimatedTime: 5,
      },
      {
        step: 3,
        description:
          'キャベツ、ピーマンを加えて炒め、混ぜ合わせた調味料を加えて全体に絡める。',
        estimatedTime: 5,
      },
    ],
  },
  {
    title: '鮭の塩焼き',
    description: 'シンプルながらも奥深い、定番の和食。',
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    tags: ['魚料理', '和食', 'シンプル'],
    ingredients: [
      { name: '生鮭切り身', amount: 1, unit: '切れ' },
      { name: '塩', amount: 0.5, unit: '小さじ' },
    ],
    instructions: [
      {
        step: 1,
        description: '鮭の水気をキッチンペーパーで拭き取り、両面に塩を振る。',
        estimatedTime: 2,
      },
      {
        step: 2,
        description: 'グリルまたはフライパンで両面に焼き色がつくまで焼く。',
        estimatedTime: 8,
      },
    ],
  },
  {
    title: 'きつねうどん',
    description: '甘辛いお揚げが美味しい、ほっとする一杯。',
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    tags: ['麺類', '和食', '簡単'],
    ingredients: [
      { name: '冷凍うどん', amount: 1, unit: '玉' },
      { name: '油揚げ', amount: 1, unit: '枚' },
      { name: 'だし汁', amount: 300, unit: 'ml' },
      { name: '醤油', amount: 1, unit: '大さじ' },
      { name: 'みりん', amount: 1, unit: '大さじ' },
      { name: '砂糖', amount: 0.5, unit: '大さじ' },
      { name: 'ねぎ', amount: 1, unit: '適量', notes: '小口切り' },
    ],
    instructions: [
      {
        step: 1,
        description: '油揚げは熱湯をかけて油抜きし、食べやすい大きさに切る。',
        estimatedTime: 3,
      },
      {
        step: 2,
        description: '鍋にだし汁、醤油、みりん、砂糖、油揚げを入れて煮る。',
        estimatedTime: 5,
      },
      {
        step: 3,
        description:
          '別の鍋でうどんを茹で、器に盛り、煮たお揚げとねぎを乗せる。',
        estimatedTime: 5,
      },
    ],
  },
  {
    title: 'ニラの卵とじ',
    description: '手軽に作れて栄養満点！ご飯が進む副菜。',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    tags: ['副菜', '卵', '簡単'],
    ingredients: [
      { name: 'ニラ', amount: 1, unit: '束' },
      { name: '卵', amount: 2, unit: '個' },
      { name: 'めんつゆ（2倍濃縮）', amount: 3, unit: '大さじ' },
      { name: '水', amount: 50, unit: 'ml' },
      { name: 'ごま油', amount: 1, unit: '小さじ' },
    ],
    instructions: [
      {
        step: 1,
        description: 'ニラは3cm長さに切る。卵は溶きほぐす。',
        estimatedTime: 2,
      },
      {
        step: 2,
        description: 'フライパンにごま油を熱し、ニラを炒める。',
        estimatedTime: 3,
      },
      {
        step: 3,
        description: 'めんつゆと水を加えて煮立たせ、溶き卵を回し入れる。',
        estimatedTime: 5,
      },
    ],
  },
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
