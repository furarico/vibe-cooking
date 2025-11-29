import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";

using Http;
using OpenAPI;

@service(#{ title: "App BFF Service" })
@info(#{ version: "1.0.0" })
@server("https://bff.api.vibe-cooking.app", "Production")
@server("https://stg.bff.api.vibe-cooking.app", "Staging")
@server("https://dev.bff.api.vibe-cooking.app", "Development")
@server("http://localhost:8080", "Local")
namespace AppBFFService {
  /**
   * フィルター条件を指定してレシピ一覧を取得
   */
  @route("/recipes")
  @get
  @summary("レシピ一覧取得")
  op getRecipes(
    /**
     * テキスト検索
     */
    @query q?: string,
  ): Body<{
    recipes: Recipe[];
  }>;

  /**
   * IDで指定されたレシピの詳細を取得
   */
  @route("/recipes/{id}")
  @get
  @summary("レシピ詳細取得")
  op getRecipeById(
    /**
     * レシピID
     */
    @path id: string,
  ): Recipe | NotFoundResponse;

  /**
   * 指定されたレシピIDsからバイブレシピを作成
   */
  @route("/vibe-recipe")
  @post
  @summary("バイブレシピ作成")
  op createVibeRecipe(
    @body body: {
      recipeIds: string[];
    },
  ): Recipe | (CreatedResponse & Recipe) | BadRequestResponse;
}
