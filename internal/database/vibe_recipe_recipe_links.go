package database

import "gorm.io/gorm"

// VibeRecipeRecipe はVibeレシピとレシピの中間テーブル
type VibeRecipeRecipeLink struct {
	ID           string `gorm:"primaryKey;type:varchar(30)"`
	RecipeID     string `gorm:"type:varchar(30);not null;index"`
	VibeRecipeID string `gorm:"type:varchar(30);not null;index"`

	// Relations
	Recipe     Recipe     `gorm:"foreignKey:RecipeID"`
	VibeRecipe VibeRecipe `gorm:"foreignKey:VibeRecipeID"`
}

// BeforeCreate はレコード作成前にIDを生成する
func (v *VibeRecipeRecipeLink) BeforeCreate(tx *gorm.DB) error {
	if v.ID == "" {
		v.ID = generateID()
	}
	return nil
}

// TableName はテーブル名を指定する
func (VibeRecipeRecipeLink) TableName() string {
	return "vibe_recipe_recipe_links"
}
