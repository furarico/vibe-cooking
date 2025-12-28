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
	return domain.Recipe{
		ID:           dbRecipe.ID,
		Title:        dbRecipe.Title,
		Description:  dbRecipe.Description,
		ImageURL:     dbRecipe.ImageURL,
		Ingredients:  convertToDomainIngredients(dbRecipe.Ingredients),
		Instructions: convertToDomainInstructions(dbRecipe.Instructions),
	}
}

// convertToDomainIngredients は database.Ingredient のスライスを domain.Ingredient のスライスに変換する
func convertToDomainIngredients(dbIngredients []database.Ingredient) []domain.Ingredient {
	domainIngredients := make([]domain.Ingredient, 0, len(dbIngredients))
	for _, dbIngredient := range dbIngredients {
		domainIngredients = append(domainIngredients, convertToDomainIngredient(dbIngredient))
	}
	return domainIngredients
}

// convertToDomainIngredient は database.Ingredient を domain.Ingredient に変換する
func convertToDomainIngredient(dbIngredient database.Ingredient) domain.Ingredient {
	return domain.Ingredient{
		ID:     dbIngredient.ID,
		Name:   dbIngredient.Name,
		Amount: dbIngredient.Amount,
		Unit:   dbIngredient.Unit,
		Notes:  dbIngredient.Notes,
	}
}

// convertToDomainInstructions は database.Instruction のスライスを domain.Instruction のスライスに変換する
func convertToDomainInstructions(dbInstructions []database.Instruction) []domain.Instruction {
	domainInstructions := make([]domain.Instruction, 0, len(dbInstructions))
	for _, dbInstruction := range dbInstructions {
		domainInstructions = append(domainInstructions, convertToDomainInstruction(dbInstruction))
	}
	return domainInstructions
}

// convertToDomainInstruction は database.Instruction を domain.Instruction に変換する
func convertToDomainInstruction(dbInstruction database.Instruction) domain.Instruction {
	return domain.Instruction{
		ID:            dbInstruction.ID,
		RecipeID:      dbInstruction.RecipeID,
		Step:          dbInstruction.Step,
		Title:         dbInstruction.Title,
		Description:   dbInstruction.Description,
		AudioURL:      dbInstruction.AudioURL,
		TimerDuration: dbInstruction.TimerDuration,
	}
}
