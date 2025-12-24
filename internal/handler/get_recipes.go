package handler

import (
	"context"
	"fmt"

	api "github.com/furarico/vibe-cooking-recipe-api/generated"
	"github.com/furarico/vibe-cooking-recipe-api/internal/domain"
)

// RecipeHandler はレシピのHTTPハンドラー
type RecipeHandler struct {
	service RecipeService
}

type RecipeService interface {
	GetRecipes(params api.GetRecipesParams) ([]domain.Recipe, error)
}

// NewRecipeHandler は新しいRecipeHandlerを生成する
func NewRecipeHandler(service RecipeService) *RecipeHandler {
	return &RecipeHandler{
		service: service,
	}
}

// GetRecipes レシピ一覧取得 (StrictServerInterface 用)
func (h *RecipeHandler) GetRecipes(ctx context.Context, request api.GetRecipesRequestObject) (api.GetRecipesResponseObject, error) {
	domainRecipes, err := h.service.GetRecipes(request.Params)
	if err != nil {
		return nil, fmt.Errorf("failed to get recipes: %w", err)
	}

	// ドメインモデルをAPIモデルに変換
	apiRecipes := ToAPIRecipes(domainRecipes)

	return api.GetRecipes200JSONResponse{
		Recipes: apiRecipes,
	}, nil
}
