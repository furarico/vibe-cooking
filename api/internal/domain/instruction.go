package domain

type Instruction struct {
	ID            string
	RecipeID      string
	Step          int
	Title         string
	Description   string
	AudioURL      *string
	TimerDuration *float64
}

func NewInstruction(id string, recipeID string, step int, title string, description string, audioURL *string, timerDuration *float64) *Instruction {
	return &Instruction{
		ID:            id,
		RecipeID:      recipeID,
		Step:          step,
		Title:         title,
		Description:   description,
		AudioURL:      audioURL,
		TimerDuration: timerDuration,
	}
}
