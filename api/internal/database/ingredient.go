package database

import (
	"github.com/furarico/vibe-cooking-recipe-api/internal/domain"
	"gorm.io/gorm"
)

type Ingredient struct {
	ID       string  `gorm:"primaryKey;type:varchar(30)"`
	Name     string  `gorm:"type:varchar(255);not null"`  // 材料名
	Amount   float64 `gorm:"type:decimal(10,2);not null"` // 分量
	Unit     string  `gorm:"type:varchar(50);not null"`   // 単位
	Notes    *string `gorm:"type:text"`                   // 備考
	RecipeID string  `gorm:"type:varchar(30);not null;index"`

	// Relations
	Recipe Recipe `gorm:"foreignKey:RecipeID"`
}

func (i *Ingredient) BeforeCreate(tx *gorm.DB) error {
	if i.ID == "" {
		i.ID = generateID()
	}
	return nil
}

func (Ingredient) TableName() string {
	return "ingredients"
}

func (i *Ingredient) convertToDomainIngredient() domain.Ingredient {
	return domain.Ingredient{
		ID:     i.ID,
		Name:   i.Name,
		Amount: i.Amount,
		Unit:   i.Unit,
		Notes:  i.Notes,
	}
}

func convertToDomainIngredients(dbIngredients []Ingredient) []domain.Ingredient {
	domainIngredients := make([]domain.Ingredient, 0, len(dbIngredients))
	for _, dbIngredient := range dbIngredients {
		domainIngredients = append(domainIngredients, dbIngredient.convertToDomainIngredient())
	}
	return domainIngredients
}
