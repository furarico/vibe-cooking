package main

import (
	"log"

	api "github.com/furarico/vibe-cooking-recipe-api/generated"
	"github.com/furarico/vibe-cooking-recipe-api/internal/database"
	"github.com/furarico/vibe-cooking-recipe-api/internal/handler"
	"github.com/furarico/vibe-cooking-recipe-api/internal/repository"
	"github.com/furarico/vibe-cooking-recipe-api/internal/service"
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	middleware "github.com/oapi-codegen/gin-middleware"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found: %v", err)
	}

	db, err := database.ConnectWithConnectorIAMAuthN()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer func() {
		if err := database.Close(db); err != nil {
			log.Printf("Failed to close database: %v", err)
		}
	}()

	if err := database.AutoMigrate(db); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	spec, err := openapi3.NewLoader().LoadFromFile("openapi/openapi.yaml")
	if err != nil {
		log.Fatalf("Failed to load OpenAPI spec: %v", err)
	}

	spec.Servers = nil

	router := gin.Default()

	router.Use(middleware.OapiRequestValidator(spec))

	// ハンドラの登録
	recipeRepository := repository.NewRecipeRepository(db)
	recipeService := service.NewRecipeService(recipeRepository)
	recipeHandler := handler.NewRecipeHandler(recipeService)
	strictHandler := api.NewStrictHandler(recipeHandler, nil)
	api.RegisterHandlers(router, strictHandler)

	addr := ":8080"
	log.Printf("Server starting on %s", addr)
	if err := router.Run(addr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
