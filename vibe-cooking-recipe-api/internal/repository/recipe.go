package repository

import (
	"github.com/furarico/vibe-cooking-recipe-api/internal/database"
	"github.com/furarico/vibe-cooking-recipe-api/internal/domain"
	"gorm.io/gorm"
)

type RecipeRepository struct {
	db *gorm.DB
}

func NewRecipeRepository(db *gorm.DB) *RecipeRepository {
	return &RecipeRepository{db: db}
}

func (r *RecipeRepository) FindAll() ([]domain.Recipe, error) {
	var dbRecipes []database.Recipe
	if err := r.db.Preload("Ingredients").Preload("Instructions").Find(&dbRecipes).Error; err != nil {
		return nil, err
	}

	domainRecipes := make([]domain.Recipe, 0, len(dbRecipes))
	for _, dbRecipe := range dbRecipes {
		domainRecipes = append(domainRecipes, dbRecipe.ConvertToDomainRecipe())
	}

	return domainRecipes, nil
}
