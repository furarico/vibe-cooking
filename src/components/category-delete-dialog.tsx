'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface CategoryDeleteDialogProps {
  category: Category;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function CategoryDeleteDialog({
  category,
  onConfirm,
  onCancel,
}: CategoryDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('カテゴリの削除に失敗しました:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          カテゴリを削除
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            「<span className="font-semibold">{category.name}</span>
            」を削除しますか？
          </p>
          <p className="text-sm text-muted-foreground">
            この操作は取り消すことができません。
          </p>

          <div className="flex gap-2 pt-2">
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? '削除中...' : '削除する'}
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
              キャンセル
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
