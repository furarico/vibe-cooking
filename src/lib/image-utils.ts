import sharp from 'sharp';
import { copyFileInR2, deleteFromR2, uploadToR2 } from './r2';

export interface ImageProcessingOptions {
  buffer: Buffer;
  originalName: string;
}

export interface ProcessedImage {
  buffer: Buffer;
  filename: string;
  contentType: string;
}

const TARGET_WIDTH = 1920;
const TARGET_HEIGHT = 1080;
const TARGET_RATIO = TARGET_WIDTH / TARGET_HEIGHT;

export async function processImage(
  options: ImageProcessingOptions
): Promise<ProcessedImage> {
  const { buffer } = options;

  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('画像のメタデータを取得できませんでした');
    }

    // 縦画像の場合はエラー
    if (metadata.width < metadata.height) {
      throw new Error(
        '縦画像はサポートされていません。横画像をアップロードしてください。'
      );
    }

    // 規定サイズに満たない場合はエラー
    if (metadata.width < TARGET_WIDTH || metadata.height < TARGET_HEIGHT) {
      throw new Error(
        `画像サイズが小さすぎます。最小サイズ: ${TARGET_WIDTH}x${TARGET_HEIGHT}px`
      );
    }

    const currentRatio = metadata.width / metadata.height;
    let processedImage = image;

    // 縦横比が異なる場合は中央でトリミング
    if (Math.abs(currentRatio - TARGET_RATIO) > 0.01) {
      if (currentRatio > TARGET_RATIO) {
        // 横に長い場合：高さに合わせて幅をトリミング
        const newWidth = Math.round(metadata.height * TARGET_RATIO);
        const left = Math.round((metadata.width - newWidth) / 2);
        processedImage = processedImage.extract({
          left,
          top: 0,
          width: newWidth,
          height: metadata.height,
        });
      } else {
        // 縦に長い場合：幅に合わせて高さをトリミング
        const newHeight = Math.round(metadata.width / TARGET_RATIO);
        const top = Math.round((metadata.height - newHeight) / 2);
        processedImage = processedImage.extract({
          left: 0,
          top,
          width: metadata.width,
          height: newHeight,
        });
      }
    }

    // 規定サイズにリサイズしてwebpに変換
    const processedBuffer = await processedImage
      .resize(TARGET_WIDTH, TARGET_HEIGHT)
      .webp({ quality: 85 })
      .toBuffer();

    const filename = `images/recipe_thumbnails/${Date.now()}.webp`;

    return {
      buffer: processedBuffer,
      filename,
      contentType: 'image/webp',
    };
  } catch (error) {
    console.error('画像処理エラー:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('画像の処理に失敗しました');
  }
}

export async function uploadImageToR2(
  buffer: Buffer,
  originalName: string
): Promise<string> {
  const processedImage = await processImage({ buffer, originalName });

  return uploadToR2({
    key: processedImage.filename,
    buffer: processedImage.buffer,
    contentType: processedImage.contentType,
  });
}

export async function deleteImageFromR2(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  try {
    // パブリックURLからキーを抽出
    const url = new URL(imageUrl);
    const key = url.pathname.substring(1); // 先頭の '/' を除去

    // recipe_thumbnailsディレクトリの画像のみ削除（安全性のため）
    if (key.startsWith('images/recipe_thumbnails/')) {
      await deleteFromR2(key);
    }
  } catch (error) {
    console.error('画像削除エラー:', error);
    // 削除エラーは致命的ではないため、エラーを投げずにログのみ出力
  }
}

export function generateImageKey(recipeId: string): string {
  return `images/recipe_thumbnails/${recipeId}.webp`;
}

export async function uploadRecipeImage(
  buffer: Buffer,
  originalName: string,
  recipeId: string
): Promise<string> {
  const processedImage = await processImage({ buffer, originalName });

  // レシピIDベースのファイル名を使用
  const filename = generateImageKey(recipeId);

  return uploadToR2({
    key: filename,
    buffer: processedImage.buffer,
    contentType: processedImage.contentType,
  });
}

export async function renameImageToRecipeId(
  currentImageUrl: string,
  recipeId: string
): Promise<string> {
  if (!currentImageUrl) return currentImageUrl;

  try {
    // 現在のファイルのキーを抽出
    const url = new URL(currentImageUrl);
    const currentKey = url.pathname.substring(1); // 先頭の '/' を除去

    // 新しいキー（レシピIDベース）を生成
    const newKey = generateImageKey(recipeId);

    // 既に正しいファイル名の場合はそのまま返す
    if (currentKey === newKey) {
      return currentImageUrl;
    }

    // recipe_thumbnailsディレクトリの画像のみ処理（安全性のため）
    if (!currentKey.startsWith('images/recipe_thumbnails/')) {
      console.warn(
        'recipe_thumbnails以外の画像はリネームしません:',
        currentKey
      );
      return currentImageUrl;
    }

    // ファイルをコピー
    await copyFileInR2(currentKey, newKey);

    // 古いファイルを削除
    await deleteFromR2(currentKey);

    // 新しいURLを生成して返す
    return currentImageUrl.replace(currentKey, newKey);
  } catch (error) {
    console.error('画像ファイル名変更エラー:', error);
    // エラーが発生しても元のURLを返す（画像は使用可能なため）
    return currentImageUrl;
  }
}
