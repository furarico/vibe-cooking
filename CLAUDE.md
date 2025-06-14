# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) 向けガイダンスです。

## コマンド

### 開発用
- `pnpm dev` - Turbopackを使用した開発サーバーの起動
- `pnpm build` - アプリケーションのビルド
- `pnpm start` - 本番環境サーバーの起動
- `pnpm lint` - ESLintの実行
- `pnpm format` - ESLintの自動修正とPrettierでのフォーマット実行

### データベース
- `pnpm db:generate` - Prismaクライアントの生成（`npx prisma generate`のエイリアス）
- `npx prisma migrate dev` - 開発環境でのマイグレーション適用
- `npx prisma studio` - データベース管理用Prisma Studioの起動
- `pnpm seed:post` - シードデータ後処理スクリプトの実行

## アーキテクチャ

このプロジェクトは高機能なNext.js 15レシピ管理アプリケーションです：

- **フロントエンド**: React 19 + TypeScript、Tailwind CSS 4、shadcn/uiコンポーネント
- **バックエンド**: Next.js App Router APIルート
- **データベース**: PostgreSQL with Prisma ORM
- **フォーム**: React Hook Form + Zod バリデーション
- **音声**: Google Cloud Text-to-Speech による手順読み上げ
- **ストレージ**: Cloudflare R2 による音声ファイル保存

### 主な機能

**音声手順機能**:
- Google Cloud Text-to-Speechを使用した調理手順の自動音声生成
- Cloudflare R2での音声ファイル保存とパブリックURL提供
- 日本語音声対応（ja-JP-Neural2-B音声）

**ファイルストレージ**:
- Cloudflare R2統合によるオーディオファイル管理
- 手順削除時の音声ファイル自動クリーンアップ
- 音声再生用パブリックURL生成

### データベーススキーマ (prisma/schema.prisma)

**Recipeモデル**:
- `id`, `title`, `description` - 基本レシピ情報
- `prepTime`, `cookTime`, `servings` - 時間と人数分情報
- `imageUrl` - レシピ画像URL
- `tags` - レシピタグ配列
- `categoryId` - オプションのカテゴリ関連付け

**Ingredientモデル**:
- `name`, `amount`, `unit` - 材料詳細
- `notes` - オプションの材料メモ
- レシピとのカスケード削除

**Instructionモデル**:
- `step` - 手順の順序番号
- `title` - 手順整理用タイトル
- `description` - 詳細な手順テキスト
- `imageUrl` - オプションの工程画像
- `audioUrl` - 生成されたTTS音声URL
- `estimatedTime` - この工程の推定時間
- レシピとのカスケード削除

**Categoryモデル**:
- `name` - カテゴリ名（例：ご飯、おかず、デザート、汁物）
- レシピとの一対多関係

### API構造

- `/api/recipes` - GET（全件取得）、POST（音声生成付き新規作成）
- `/api/recipes/[id]` - GET、PUT（音声再生成付き更新）、DELETE（音声ファイルクリーンアップ）

### フォームバリデーション

`src/lib/validations.ts`のZodスキーマによる全レシピデータ検証：
- 必須フィールド: レシピタイトル、材料名・分量・単位、手順説明
- オプションフィールド: 時間、人数分、画像、メモ
- 画像URLのURL形式検証

### コアライブラリ

**音声処理 (src/lib/)**:
- `tts.ts` - Google Cloud Text-to-Speech統合
- `r2.ts` - Cloudflare R2ストレージ操作
- `audio-utils.ts` - 音声ファイル管理ユーティリティ

**データベース**:
- `prisma.ts` - 開発環境ホットリロード対応シングルトンパターンPrismaクライアント

### コンポーネント構造

**レシピコンポーネント**:
- `recipe-form.tsx` - メインのレシピ作成・編集フォーム
- `recipe-list.tsx` - 検索・フィルター機能付きレシピ一覧
- `recipe-card.tsx` - 個別レシピプレビューカード
- `recipe-detail.tsx` - 音声再生機能付き詳細レシピビュー

**UIコンポーネント**:
- `src/components/ui/` - shadcn/uiコンポーネント（button、form、input、selectなど）
- 全コンポーネントでTypeScript使用、React 19パターン準拠

### 必要な環境変数

- `MAIN_DATABASE_URL` - PostgreSQLデータベース接続
- `SHADOW_DATABASE_URL` - マイグレーション用シャドウデータベース
- `GOOGLE_APPLICATION_CREDENTIALS` - Google Cloudサービスアカウントキーパス
- `R2_ENDPOINT` - Cloudflare R2エンドポイントURL
- `R2_ACCESS_KEY_ID` - Cloudflare R2アクセスキー
- `R2_SECRET_ACCESS_KEY` - Cloudflare R2シークレットキー
- `R2_BUCKET_NAME` - Cloudflare R2バケット名
- `R2_PUBLIC_URL` - R2バケットアクセス用パブリックURL