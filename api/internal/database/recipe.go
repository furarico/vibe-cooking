package database

import (
	"time"

	"github.com/furarico/vibe-cooking-recipe-api/internal/domain"
	"github.com/nrednav/cuid2"
	"gorm.io/gorm"
)

func generateID() string {
	return cuid2.Generate()
}

type Recipe struct {
	ID          string    `gorm:"primaryKey;type:varchar(30)"`
	Title       string    `gorm:"type:varchar(255);default:''"`
	Description string    `gorm:"type:text;default:''"`
	PrepTime    int       `gorm:"type:int"`           // 準備時間（分）
	CookTime    int       `gorm:"type:int"`           // 調理時間（分）
	Servings    int       `gorm:"type:int"`           // 人数分
	ImageURL    *string   `gorm:"type:varchar(2048)"` // nullable
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime"`

	// Relations
	Ingredients  []Ingredient  `gorm:"foreignKey:RecipeID"`
	Instructions []Instruction `gorm:"foreignKey:RecipeID"`
}

func (r *Recipe) BeforeCreate(tx *gorm.DB) error {
	if r.ID == "" {
		r.ID = generateID()
	}
	return nil
}

func (Recipe) TableName() string {
	return "recipes"
}

func (r *Recipe) ConvertToDomainRecipe() domain.Recipe {
	return domain.Recipe{
		ID:           r.ID,
		Title:        r.Title,
		Description:  r.Description,
		ImageURL:     r.ImageURL,
		Ingredients:  convertToDomainIngredients(r.Ingredients),
		Instructions: convertToDomainInstructions(r.Instructions),
	}
}
