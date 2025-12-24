package service

import (
	api "github.com/furarico/vibe-cooking-recipe-api/generated"
	"github.com/furarico/vibe-cooking-recipe-api/internal/domain"
)

type RecipeRepository interface {
	FindAll() ([]domain.Recipe, error)
}

// RecipeService はレシピのビジネスロジックを担当する
type RecipeService struct {
	repository RecipeRepository
}

// NewRecipeService は新しいRecipeServiceを生成する
func NewRecipeService(repository RecipeRepository) *RecipeService {
	return &RecipeService{
		repository: repository,
	}
}

// GetRecipes はレシピ一覧を取得する（ドメインモデルを返す）
func (s *RecipeService) GetRecipes(params api.GetRecipesParams) ([]domain.Recipe, error) {
	domainRecipes, err := s.repository.FindAll()
	if err != nil {
		return nil, err
	}

	return domainRecipes, nil
}
