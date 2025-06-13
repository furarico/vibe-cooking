import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Clock, Users } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  imageUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  ingredients: Array<{
    id: string;
    name: string;
    amount: number;
    unit: string;
    notes?: string;
  }>;
  instructions: Array<{
    id: string;
    step: number;
    description: string;
    imageUrl?: string;
    estimatedTime?: number;
  }>;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick?.(recipe)}
    >
      {recipe.imageUrl && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
        {recipe.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {recipe.description}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          {totalTime > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{totalTime}分</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings}人分</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" />
            <span>{recipe.instructions.length}手順</span>
          </div>
        </div>

        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {recipe.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{recipe.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
