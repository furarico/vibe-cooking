package database

import "gorm.io/gorm"

// Ingredient は材料のモデル
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

// BeforeCreate はレコード作成前にIDを生成する
func (i *Ingredient) BeforeCreate(tx *gorm.DB) error {
	if i.ID == "" {
		i.ID = generateID()
	}
	return nil
}

// TableName はテーブル名を指定する
func (Ingredient) TableName() string {
	return "ingredients"
}
