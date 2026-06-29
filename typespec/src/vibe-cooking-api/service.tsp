import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";

using Http;
using OpenAPI;

/**
 * Vibe CookingのためのAPI
 */
@service(#{ title: "Vibe Cooking Service" })
@info(#{
  version: "1.0.0",
  contact: #{ name: "Vibe Cooking", email: "contact@vibe-cooking.app" },
})
@server("https://vibe-cooking.app/api", "Production")
@server("https://stg.vibe-cooking.app/api", "Staging")
@server("https://dev.vibe-cooking.app/api", "Development")
@server("http://localhost:8080/api", "Local")
namespace VibeCookingService {
  /**
   * フィルター条件を指定してレシピ一覧を取得
   */
  @route("/recipes")
  @get
  @summary("レシピ一覧取得")
  op getRecipes(
    /**
     * テキスト検索（レシピタイトル、説明、材料名、手順で検索）
     */
    @query(#{ explode: true }) q?: string,

    /**
     * タグフィルター（カンマ区切りで複数指定可能、全て含むレシピを取得）
     */
    @query(#{ explode: true }) tag?: string,

    /**
     * カテゴリ名でフィルター
     */
    @query(#{ explode: true }) category?: string,

    /**
     * カテゴリIDでフィルター
     */
    @query(#{ explode: true }) categoryId?: string,
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
   * 全てのカテゴリ一覧を取得
   */
  @route("/categories")
  @get
  @summary("カテゴリ一覧取得")
  op getCategories(): Body<{
    categories: Category[];
  }>;

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
  ): VibeRecipe | (CreatedResponse & VibeRecipe) | BadRequestResponse;
}
