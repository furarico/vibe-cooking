package database

import (
	"time"

	"github.com/nrednav/cuid2"
	"gorm.io/gorm"
)

// generateID はユニークなIDを生成するヘルパー関数
func generateID() string {
	return cuid2.Generate()
}

// Recipe はレシピのモデル
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
	VibeRecipes  []VibeRecipe  `gorm:"many2many:vibe_recipe_recipe_link;"`
}

// BeforeCreate はレコード作成前にIDを生成する
func (r *Recipe) BeforeCreate(tx *gorm.DB) error {
	if r.ID == "" {
		r.ID = generateID()
	}
	return nil
}

// TableName はテーブル名を指定する
func (Recipe) TableName() string {
	return "recipes"
}
