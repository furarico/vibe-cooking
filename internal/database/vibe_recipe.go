package database

import (
	"time"

	"gorm.io/gorm"
)

// VibeRecipe はVibeレシピのモデル
type VibeRecipe struct {
	ID        string    `gorm:"primaryKey;type:varchar(30)"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
	// Relations
	Recipes          []Recipe          `gorm:"many2many:vibe_recipe_recipes;"`
	VibeInstructions []VibeInstruction `gorm:"foreignKey:VibeRecipeID"`
}

// BeforeCreate はレコード作成前にIDを生成する
func (v *VibeRecipe) BeforeCreate(tx *gorm.DB) error {
	if v.ID == "" {
		v.ID = generateID()
	}
	return nil
}

// TableName はテーブル名を指定する
func (VibeRecipe) TableName() string {
	return "vibe_recipes"
}
