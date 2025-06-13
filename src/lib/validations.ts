import { z } from 'zod';

export const recipeSchema = z.object({
  title: z.string().min(1, '料理名は必須です'),
  description: z.string().optional(),
  prepTime: z.number().min(0).optional(),
  cookTime: z.number().min(0).optional(),
  servings: z.number().min(1).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, '材料名は必須です'),
      amount: z.number().min(0, '分量は0以上である必要があります'),
      unit: z.string().min(1, '単位は必須です'),
      notes: z.string().optional(),
    })
  ),
  instructions: z.array(
    z.object({
      step: z.number().min(1),
      description: z.string().min(1, '手順の説明は必須です'),
      imageUrl: z.string().url().optional().or(z.literal('')),
      estimatedTime: z.number().min(0).optional(),
    })
  ),
});

export type RecipeFormData = z.infer<typeof recipeSchema>;
