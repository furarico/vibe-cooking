import {
  CopyObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export interface UploadOptions {
  key: string;
  buffer: Buffer;
  contentType: string;
}

export async function uploadToR2(options: UploadOptions): Promise<string> {
  const { key, buffer, contentType } = options;
  const bucketName = process.env.R2_BUCKET_NAME!;
  const publicUrl = process.env.R2_PUBLIC_URL!;

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000', // 1年間キャッシュ
    });

    await r2Client.send(command);

    // 公開URLを生成
    const fileUrl = `${publicUrl}/${key}`;
    return fileUrl;
  } catch (error) {
    console.error('R2アップロードエラー:', error);
    throw new Error('ファイルのアップロードに失敗しました');
  }
}

export async function uploadAudioToR2(
  audioBuffer: Buffer,
  fileName: string
): Promise<string> {
  return uploadToR2({
    key: fileName,
    buffer: audioBuffer,
    contentType: 'audio/mpeg',
  });
}

export async function deleteFromR2(key: string): Promise<void> {
  const bucketName = process.env.R2_BUCKET_NAME!;

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('R2削除エラー:', error);
    throw new Error('ファイルの削除に失敗しました');
  }
}

export async function deleteAudioFromR2(fileName: string): Promise<void> {
  return deleteFromR2(fileName);
}

export async function deleteInstructionAudios(
  recipeId: string,
  instructionIds: string[]
): Promise<void> {
  const deletePromises = instructionIds.map(async instructionId => {
    // tts.tsのgenerateAudioFileName関数と同じパスを使用
    const fileName = `audio/instructions/${recipeId}/${instructionId}.mp3`;
    try {
      await deleteAudioFromR2(fileName);
    } catch (error) {
      // 個別のファイル削除エラーはログのみ（ファイルが存在しない場合も含む）
      console.warn(`音声ファイル削除をスキップ: ${fileName}`, error);
    }
  });

  try {
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('複数音声ファイルの削除エラー:', error);
    // 個別エラーはすでにキャッチ済みなので、ここでは何もしない
  }
}

export async function copyFileInR2(
  sourceKey: string,
  destKey: string
): Promise<void> {
  const bucketName = process.env.R2_BUCKET_NAME!;

  try {
    // S3互換のCopyObjectを使用
    const command = new CopyObjectCommand({
      Bucket: bucketName,
      CopySource: `${bucketName}/${sourceKey}`,
      Key: destKey,
      CacheControl: 'public, max-age=31536000', // 1年間キャッシュ
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('R2ファイルコピーエラー:', error);
    throw new Error(
      `ファイルのコピーに失敗しました: ${sourceKey} -> ${destKey}`
    );
  }
}
