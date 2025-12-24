package handler

import (
	api "github.com/furarico/vibe-cooking-recipe-api/generated"
	"github.com/furarico/vibe-cooking-recipe-api/internal/domain"
)

// ToAPIRecipe は domain.Recipe を api.Recipe に変換する
func ToAPIRecipe(domainRecipe domain.Recipe) api.Recipe {
	// Ingredients の変換
	apiIngredients := make([]api.Ingredient, 0, len(domainRecipe.Ingredients))
	for _, domainIngredient := range domainRecipe.Ingredients {
		apiIngredients = append(apiIngredients, api.Ingredient{
			Id:     domainIngredient.ID,
			Name:   domainIngredient.Name,
			Amount: float32(domainIngredient.Amount),
			Unit:   domainIngredient.Unit,
			Notes:  domainIngredient.Notes,
		})
	}

	// Instructions の変換
	apiInstructions := make([]api.Instruction, 0, len(domainRecipe.Instructions))
	for _, domainInstruction := range domainRecipe.Instructions {
		apiInstructions = append(apiInstructions, api.Instruction{
			Id:            domainInstruction.ID,
			RecipeId:      domainInstruction.RecipeID,
			Step:          domainInstruction.Step,
			Title:         domainInstruction.Title,
			Description:   domainInstruction.Description,
			AudioUrl:      domainInstruction.AudioURL,
			TimerDuration: domainInstruction.TimerDuration,
		})
	}

	return api.Recipe{
		Id:           domainRecipe.ID,
		Title:        domainRecipe.Title,
		Description:  domainRecipe.Description,
		ImageUrl:     domainRecipe.ImageURL,
		Ingredients:  apiIngredients,
		Instructions: apiInstructions,
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
