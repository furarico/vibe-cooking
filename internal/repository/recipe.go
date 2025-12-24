package repository

import (
	"github.com/furarico/vibe-cooking-recipe-api/internal/database"
	"github.com/furarico/vibe-cooking-recipe-api/internal/domain"
	"gorm.io/gorm"
)

// RecipeRepository はレシピのデータアクセスを担当する
type RecipeRepository struct {
	db *gorm.DB
}

// NewRecipeRepository は新しいRecipeRepositoryを生成する
func NewRecipeRepository(db *gorm.DB) *RecipeRepository {
	return &RecipeRepository{db: db}
}

// FindAll はすべてのレシピを取得する（ドメインモデルを返す）
func (r *RecipeRepository) FindAll() ([]domain.Recipe, error) {
	var dbRecipes []database.Recipe
	if err := r.db.Preload("Ingredients").Preload("Instructions").Find(&dbRecipes).Error; err != nil {
		return nil, err
	}

	domainRecipes := make([]domain.Recipe, 0, len(dbRecipes))
	for _, dbRecipe := range dbRecipes {
		domainRecipes = append(domainRecipes, convertToDomainRecipe(dbRecipe))
	}

	return domainRecipes, nil
}

// convertToDomainRecipe は database.Recipe を domain.Recipe に変換する
func convertToDomainRecipe(dbRecipe database.Recipe) domain.Recipe {
	// Ingredients の変換
	domainIngredients := make([]domain.Ingredient, 0, len(dbRecipe.Ingredients))
	for _, dbIngredient := range dbRecipe.Ingredients {
		domainIngredients = append(domainIngredients, domain.Ingredient{
			ID:     dbIngredient.ID,
			Name:   dbIngredient.Name,
			Amount: dbIngredient.Amount,
			Unit:   dbIngredient.Unit,
			Notes:  dbIngredient.Notes,
		})
	}

	// Instructions の変換
	domainInstructions := make([]domain.Instruction, 0, len(dbRecipe.Instructions))
	for _, dbInstruction := range dbRecipe.Instructions {
		domainInstructions = append(domainInstructions, domain.Instruction{
			ID:            dbInstruction.ID,
			RecipeID:      dbInstruction.RecipeID,
			Step:          dbInstruction.Step,
			Title:         dbInstruction.Title,
			Description:   dbInstruction.Description,
			AudioURL:      dbInstruction.AudioURL,
			TimerDuration: dbInstruction.TimerDuration,
		})
	}

	return domain.Recipe{
		ID:           dbRecipe.ID,
		Title:        dbRecipe.Title,
		Description:  dbRecipe.Description,
		ImageURL:     dbRecipe.ImageURL,
		Ingredients:  domainIngredients,
		Instructions: domainInstructions,
	}
}
