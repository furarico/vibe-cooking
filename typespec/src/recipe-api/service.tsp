import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";

using Http;
using OpenAPI;

@service(#{ title: "Recipe Service" })
@info(#{ version: "1.0.0" })
@server("https://recipe-api.vibe-cooking.app", "Production")
@server("https://stg.recipe-api.vibe-cooking.app", "Staging")
@server("https://dev.recipe-api.vibe-cooking.app", "Development")
@server("http://localhost:8080", "Local")
namespace RecipeService {
  /**
   * レシピ一覧を取得
   *
   * idsが指定されている場合は、指定されたレシピIDのレシピを返却
   *
   * isVibeRecipeがtrueの場合は、バイブレシピを返却
   */
  @route("/recipes")
  @get
  @summary("レシピ一覧取得")
  op getRecipes(
    /**
     * レシピIDの配列
     */
    @query ids?: string[],

    /**
     * バイブレシピかどうか
     */
    @query isVibeRecipe?: boolean = false,
  ): Body<{
    recipes: Recipe[];
  }>;
}
