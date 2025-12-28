package domain

type Recipe struct {
	ID           string
	Title        string
	Description  string
	ImageURL     *string
	Ingredients  []Ingredient
	Instructions []Instruction
}

func NewRecipe(id string, title string, description string, imageURL *string, ingredients []Ingredient, instructions []Instruction) *Recipe {
	return &Recipe{
		ID:           id,
		Title:        title,
		Description:  description,
		ImageURL:     imageURL,
		Ingredients:  ingredients,
		Instructions: instructions,
	}
}
