'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onError?: (error: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onError,
  label = '画像',
  placeholder = 'https://example.com/image.jpg',
  required = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(value || '');
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '画像のアップロードに失敗しました');
      }

      const result = await response.json();
      const imageUrl = result.imageUrl;

      setPreviewUrl(imageUrl);
      onChange(imageUrl);
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '画像のアップロードに失敗しました';
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    onChange(url);
  };

  const handleClear = () => {
    setPreviewUrl('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <FormItem>
      <FormLabel>
        {label} {required && '*'}
      </FormLabel>
      <FormControl>
        <div className="space-y-4">
          {/* モード切り替えボタン */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={inputMode === 'upload' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('upload')}
            >
              アップロード
            </Button>
            <Button
              type="button"
              variant={inputMode === 'url' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('url')}
            >
              URL入力
            </Button>
          </div>

          {/* アップロードモード */}
          {inputMode === 'upload' && (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileSelect}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    アップロード中...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    画像を選択
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                JPEG、PNG、WebP形式をサポート（最大10MB）
                <br />
                横画像のみ対応。1920x1080pxに自動リサイズされます。
              </p>
            </div>
          )}

          {/* URL入力モード */}
          {inputMode === 'url' && (
            <div className="flex gap-2">
              <Input
                placeholder={placeholder}
                value={previewUrl}
                onChange={e => handleUrlChange(e.target.value)}
              />
              {previewUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* プレビュー */}
          {previewUrl && (
            <div className="relative w-full max-w-md">
              <div className="relative aspect-video rounded-lg overflow-hidden border">
                <Image
                  src={previewUrl}
                  alt="プレビュー"
                  fill
                  className="object-cover"
                  onError={() => {
                    setPreviewUrl('');
                    onChange('');
                    onError?.('画像の読み込みに失敗しました');
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
