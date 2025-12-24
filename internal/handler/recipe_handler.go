package handler

import (
	api "github.com/furarico/vibe-cooking-recipe-api/generated"
	"github.com/gin-gonic/gin"
)

type RecipeHandler struct{}

func NewRecipeHandler() *RecipeHandler {
	return &RecipeHandler{}
}

// GetRecipes レシピ一覧取得
func (h *RecipeHandler) GetRecipes(c *gin.Context, params api.GetRecipesParams) {
	recipes := []api.Recipe{
		{
			Id:          "1",
			Title:       "サンプルレシピ",
			Description: "これはサンプルレシピです",
			Ingredients: []api.Ingredient{
				{
					Id:     "ingredient-1",
					Name:   "トマト",
					Amount: 2,
					Unit:   "個",
				},
			},
			Instructions: []api.Instruction{
				{
					Id:          "instruction-1",
					RecipeId:    "1",
					Step:        1,
					Title:       "材料を準備する",
					Description: "トマトを切る",
				},
			},
		},
	}

	c.JSON(200, gin.H{
		"recipes": recipes,
	})
}
