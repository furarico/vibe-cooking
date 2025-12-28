package database

import "gorm.io/gorm"

// AutoMigrate はすべてのモデルのマイグレーションを実行する
func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&Recipe{},
		&Ingredient{},
		&Instruction{},
		&VibeRecipe{},
		&VibeInstruction{},
	)
}
