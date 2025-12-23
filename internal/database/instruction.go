package database

import "gorm.io/gorm"

// Instruction は手順のモデル
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

// BeforeCreate はレコード作成前にIDを生成する
func (i *Instruction) BeforeCreate(tx *gorm.DB) error {
	if i.ID == "" {
		i.ID = generateID()
	}
	return nil
}

// TableName はテーブル名を指定する
func (Instruction) TableName() string {
	return "instructions"
}
