package domain

type Ingredient struct {
	ID     string
	Name   string
	Amount float64
	Unit   string
	Notes  *string
}

func NewIngredient(id string, name string, amount float64, unit string, notes *string) *Ingredient {
	return &Ingredient{
		ID:     id,
		Name:   name,
		Amount: amount,
		Unit:   unit,
		Notes:  notes,
	}
}
