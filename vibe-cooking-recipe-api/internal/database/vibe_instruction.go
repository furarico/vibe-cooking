package database

import (
	"time"

	"gorm.io/gorm"
)

// VibeInstruction はVibeレシピの手順のモデル
type VibeInstruction struct {
	ID            string    `gorm:"primaryKey;type:varchar(30)"`
	InstructionID string    `gorm:"type:varchar(30);not null"` // 元のInstructionのID
	Step          int       `gorm:"type:int;not null"`         // 並び替え後の手順番号
	VibeRecipeID  string    `gorm:"type:varchar(30);not null;index"`
	CreatedAt     time.Time `gorm:"autoCreateTime"`
	UpdatedAt     time.Time `gorm:"autoUpdateTime"`

	// Relations
	VibeRecipe VibeRecipe `gorm:"foreignKey:VibeRecipeID"`
}

// BeforeCreate はレコード作成前にIDを生成する
func (v *VibeInstruction) BeforeCreate(tx *gorm.DB) error {
	if v.ID == "" {
		v.ID = generateID()
	}
	return nil
}

// TableName はテーブル名を指定する
func (VibeInstruction) TableName() string {
	return "vibe_instructions"
}
