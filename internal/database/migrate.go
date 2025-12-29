package database

import "gorm.io/gorm"

// AutoMigrate はすべてのモデルのマイグレーションを実行する
func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&Ingredient{},
		&Instruction{},
		&VibeRecipe{},
		&Recipe{},
		&VibeInstruction{},
	)
}
