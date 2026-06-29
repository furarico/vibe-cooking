package database

import (
	"github.com/furarico/vibe-cooking-recipe-api/internal/domain"
	"gorm.io/gorm"
)

type Instruction struct {
	ID            string   `gorm:"primaryKey;type:varchar(30)"`
	Step          int      `gorm:"type:int;not null"`
	Title         string   `gorm:"type:varchar(255);not null"`
	Description   string   `gorm:"type:text;not null"`
	ImageURL      *string  `gorm:"type:varchar(2048)"`
	AudioURL      *string  `gorm:"type:varchar(2048)"`
	EstimatedTime *int     `gorm:"type:int"`           // 推定時間（分）
	TimerDuration *float64 `gorm:"type:decimal(10,2)"` // 推定時間（秒）
	RecipeID      string   `gorm:"type:varchar(30);not null;index"`

	// Relations
	Recipe Recipe `gorm:"foreignKey:RecipeID"`
}

func (i *Instruction) BeforeCreate(tx *gorm.DB) error {
	if i.ID == "" {
		i.ID = generateID()
	}
	return nil
}

func (Instruction) TableName() string {
	return "instructions"
}

func (i *Instruction) convertToDomainInstruction() domain.Instruction {
	return domain.Instruction{
		ID:            i.ID,
		RecipeID:      i.RecipeID,
		Step:          i.Step,
		Title:         i.Title,
		Description:   i.Description,
		AudioURL:      i.AudioURL,
		TimerDuration: i.TimerDuration,
	}
}

func convertToDomainInstructions(dbInstructions []Instruction) []domain.Instruction {
	domainInstructions := make([]domain.Instruction, 0, len(dbInstructions))
	for _, dbInstruction := range dbInstructions {
		domainInstructions = append(domainInstructions, dbInstruction.convertToDomainInstruction())
	}
	return domainInstructions
}
