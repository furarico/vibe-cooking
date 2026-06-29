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

### 自動実行
- `pnpm predev` - 開発サーバー起動前にPrismaクライアント生成
- `pnpm prebuild` - ビルド前にPrismaクライアント生成

## アーキテクチャ

このプロジェクトは高機能なNext.js 15レシピ管理アプリケーションです：

- **フロントエンド**: React 19 + TypeScript、Tailwind CSS 4、shadcn/uiコンポーネント
- **バックエンド**: Next.js App Router APIルート
- **データベース**: PostgreSQL with Prisma ORM
- **フォーム**: React Hook Form + Zod バリデーション
- **音声**: Google Cloud Text-to-Speech による手順読み上げ
- **ストレージ**: Cloudflare R2 による音声・画像ファイル保存
- **画像処理**: Sharp による画像リサイズ・最適化

### 主な機能

**音声手順機能**:
- Google Cloud Text-to-Speechを使用した調理手順の自動音声生成
- Cloudflare R2での音声ファイル保存とパブリックURL提供
- 日本語音声対応（ja-JP-Neural2-B音声）
- レシピ削除・更新時の音声ファイル自動クリーンアップ

**画像管理機能**:
- 画像アップロードAPIによる直接アップロード
- Sharpを使用した自動画像処理（1920×1080にリサイズ、WebP変換）
- 横画像のみ対応、縦画像は自動検出してエラー表示
- レシピID基準のファイル名自動変更機能
- プレビュー機能付きドラッグ&ドロップアップロード

**カテゴリ管理機能**:
- カテゴリのCRUD操作（作成・編集・削除）
- レシピとカテゴリの関連付け
- カテゴリ重複チェック機能

**ファイルストレージ**:
- Cloudflare R2統合による音声・画像ファイル管理
- 手順削除時の音声ファイル自動クリーンアップ
- 画像削除時の自動ファイル削除
- パブリックURL生成機能

### データベーススキーマ (prisma/schema.prisma)

**Recipeモデル**:
- `id`, `title`, `description` - 基本レシピ情報
- `prepTime`, `cookTime`, `servings` - 時間と人数分情報
- `imageUrl` - レシピ画像URL
- `tags` - レシピタグ配列
- `categoryId` - カテゴリとの関連付け（オプション）
- `createdAt`, `updatedAt` - タイムスタンプ

**Ingredientモデル**:
- `name`, `amount`, `unit` - 材料詳細
- `notes` - オプションの材料メモ
- レシピとのカスケード削除

**Instructionモデル**:
- `step` - 手順の順序番号
- `title` - 手順整理用タイトル（デフォルト空文字）
- `description` - 詳細な手順テキスト
- `imageUrl` - オプションの工程画像
- `audioUrl` - 生成されたTTS音声URL
- `estimatedTime` - この工程の推定時間
- レシピとのカスケード削除

**Categoryモデル**:
- `id` - 一意識別子
- `name` - カテゴリ名（例：ご飯、おかず、デザート、汁物）
- レシピとの一対多関係

### API構造

**レシピAPI**:
- `/api/recipes` - GET（全件取得）、POST（音声生成付き新規作成）
- `/api/recipes/[id]` - GET、PUT（音声再生成付き更新）、DELETE（音声・画像ファイルクリーンアップ）

**カテゴリAPI**:
- `/api/categories` - GET（全件取得）、POST（新規作成）
- `/api/categories/[id]` - PUT（更新）、DELETE（削除）

**アップロードAPI**:
- `/api/upload/image` - POST（画像アップロード、自動処理、R2保存）

### フォームバリデーション

`src/lib/validations.ts`のZodスキーマによるデータ検証：

**レシピスキーマ**:
- 必須フィールド: レシピタイトル、材料名・分量・単位、手順説明
- オプションフィールド: 時間、人数分、画像、メモ
- 画像URLのURL形式検証
- 配列フィールド: ingredients, instructions, tags

**カテゴリスキーマ**:
- 必須フィールド: カテゴリ名（1-50文字）

### コアライブラリ

**音声処理 (src/lib/)**:
- `tts.ts` - Google Cloud Text-to-Speech統合
- `audio-utils.ts` - 音声ファイル管理・一括生成ユーティリティ

**画像処理 (src/lib/)**:
- `image-utils.ts` - Sharp画像処理、R2アップロード、ファイル名変更機能
- 自動リサイズ（1920×1080）、WebP変換
- 縦画像検出・エラーハンドリング

**ストレージ (src/lib/)**:
- `r2.ts` - Cloudflare R2ストレージ操作（アップロード、削除、コピー）

**データベース**:
- `prisma.ts` - 開発環境ホットリロード対応シングルトンパターンPrismaクライアント

**その他**:
- `constants.ts` - アプリケーション定数
- `utils.ts` - 共通ユーティリティ関数

### コンポーネント構造

**レシピコンポーネント**:
- `recipe-form.tsx` - メインのレシピ作成・編集フォーム
- `recipe-list.tsx` - 検索・フィルター機能付きレシピ一覧
- `recipe-card.tsx` - 個別レシピプレビューカード
- `recipe-detail.tsx` - 音声再生機能付き詳細レシピビュー

**カテゴリコンポーネント**:
- `category-form.tsx` - カテゴリ作成フォーム
- `category-edit-form.tsx` - カテゴリ編集フォーム
- `category-delete-dialog.tsx` - カテゴリ削除確認ダイアログ

**UIコンポーネント**:
- `src/components/ui/` - shadcn/uiコンポーネント（button、form、input、selectなど）
- `image-upload.tsx` - 画像アップロード専用コンポーネント（ドラッグ&ドロップ、プレビュー機能）
- 全コンポーネントでTypeScript使用、React 19パターン準拠

### ページ構造

- `/` - レシピ一覧ページ（メインページ）
- `/categories` - カテゴリ管理ページ（CRUD操作）

### 必要な環境変数

**データベース**:
- `MAIN_DATABASE_URL` - PostgreSQLデータベース接続
- `SHADOW_DATABASE_URL` - マイグレーション用シャドウデータベース

**Google Cloud**:
- `GOOGLE_CLOUD_PROJECT` - Google Cloudプロジェクト名
- `GOOGLE_APPLICATION_CREDENTIALS` - Google Cloudサービスアカウントキーパス
- `GOOGLE_CLOUD_QUOTA_PROJECT` - クォータプロジェクト（オプション）

**Cloudflare R2**:
- `R2_ACCESS_KEY_ID` - Cloudflare R2アクセスキー
- `R2_SECRET_ACCESS_KEY` - Cloudflare R2シークレットキー
- `R2_ENDPOINT` - Cloudflare R2エンドポイントURL
- `R2_BUCKET_NAME` - Cloudflare R2バケット名
- `R2_PUBLIC_URL` - R2バケットアクセス用パブリックURL

### 設定ファイル

- `.env.development.example` - 開発環境用環境変数テンプレート
- `.env.production.example` - 本番環境用環境変数テンプレート
- `components.json` - shadcn/ui設定
- `next.config.ts` - Next.js設定
- `tailwind.config.js` - Tailwind CSS設定
- `tsconfig.json` - TypeScript設定

### 最新の機能追加・修正

- 音声ファイル削除のパス不一致修正
- 画像アップロード機能の完全実装
- カテゴリCRUD機能の追加
- レシピ編集・削除機能の改善
- 画像・音声ファイルの自動クリーンアップ機能