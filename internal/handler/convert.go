package handler

import (
	api "github.com/furarico/vibe-cooking-recipe-api/generated"
	"github.com/furarico/vibe-cooking-recipe-api/internal/domain"
)

// ToAPIRecipe は domain.Recipe を api.Recipe に変換する
func ToAPIRecipe(domainRecipe domain.Recipe) api.Recipe {
	return api.Recipe{
		Id:           domainRecipe.ID,
		Title:        domainRecipe.Title,
		Description:  domainRecipe.Description,
		ImageUrl:     domainRecipe.ImageURL,
		Ingredients:  ToAPIIngredients(domainRecipe.Ingredients),
		Instructions: ToAPIInstructions(domainRecipe.Instructions),
	}
}

// ToAPIIngredients は domain.Ingredient のスライスを api.Ingredient のスライスに変換する
func ToAPIIngredients(domainIngredients []domain.Ingredient) []api.Ingredient {
	apiIngredients := make([]api.Ingredient, 0, len(domainIngredients))
	for _, domainIngredient := range domainIngredients {
		apiIngredients = append(apiIngredients, ToAPIIngredient(domainIngredient))
	}
	return apiIngredients
}

// ToAPIIngredient は domain.Ingredient を api.Ingredient に変換する
func ToAPIIngredient(domainIngredient domain.Ingredient) api.Ingredient {
	return api.Ingredient{
		Id:     domainIngredient.ID,
		Name:   domainIngredient.Name,
		Amount: float32(domainIngredient.Amount),
		Unit:   domainIngredient.Unit,
		Notes:  domainIngredient.Notes,
	}
}

// ToAPIInstructions は domain.Instruction のスライスを api.Instruction のスライスに変換する
func ToAPIInstructions(domainInstructions []domain.Instruction) []api.Instruction {
	apiInstructions := make([]api.Instruction, 0, len(domainInstructions))
	for _, domainInstruction := range domainInstructions {
		apiInstructions = append(apiInstructions, ToAPIInstruction(domainInstruction))
	}
	return apiInstructions
}

// ToAPIInstruction は domain.Instruction を api.Instruction に変換する
func ToAPIInstruction(domainInstruction domain.Instruction) api.Instruction {
	return api.Instruction{
		Id:            domainInstruction.ID,
		RecipeId:      domainInstruction.RecipeID,
		Step:          domainInstruction.Step,
		Title:         domainInstruction.Title,
		Description:   domainInstruction.Description,
		AudioUrl:      domainInstruction.AudioURL,
		TimerDuration: domainInstruction.TimerDuration,
	}
}

// ToAPIRecipes は domain.Recipe のスライスを api.Recipe のスライスに変換する
func ToAPIRecipes(domainRecipes []domain.Recipe) []api.Recipe {
	apiRecipes := make([]api.Recipe, 0, len(domainRecipes))
	for _, domainRecipe := range domainRecipes {
		apiRecipes = append(apiRecipes, ToAPIRecipe(domainRecipe))
	}
	return apiRecipes
}
