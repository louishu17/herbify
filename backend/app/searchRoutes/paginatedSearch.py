from flask import request, jsonify, Blueprint
from models.recipes import Recipes, RecipeJSONEncoder
from flask_cors import cross_origin
from models.users import Users
from searchRoutes.searchFetcher import SearchFetcher

paginated_search_blueprint = Blueprint("paginated search", __name__)


@paginated_search_blueprint.route("/search/<int:pageNum>", methods=["GET"])
@cross_origin()
def paginated_search(pageNum):
    """
    Retrieve paginated search results for recipes based on a search term.

    Args:
        pageNum (int): The page number for paginated results.

    Returns:
        Response: A JSON response containing paginated search results (recipes) based on the provided search term.
    """
    print("getting paginated search")

    try:
        args = request.args
        term = args.get("term")
        recipes = Recipes.get_by_term(term, paginated=True, pageNum=pageNum)
        serialized_recipes = [obj.to_json_recipe() for obj in recipes]
        return jsonify({"results": serialized_recipes}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@paginated_search_blueprint.route("/search_user/<int:pageNum>", methods=["GET"])
@cross_origin()
def search_user(pageNum):
    """
    Retrieve paginated search results for users based on a search term.

    Args:
        pageNum (int): The page number for paginated results.

    Returns:
        Response: A JSON response containing paginated search results (users) based on the provided search term.
    """
    print("getting search for user")

    try:
        args = request.args
        term = args.get("term")
        users = Users.get_by_term(term, paginated=True, pageNum=pageNum)
        serialized_users = [Users.to_json(obj) for obj in users]
        return jsonify({"results": serialized_users}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@paginated_search_blueprint.route("/search_ingredient/<int:pageNum>", methods=["GET"])
@cross_origin()
def search_ingredient(pageNum):
    """
    Retrieve paginated search results for recipes by ingredient based on a search term.

    Args:
        pageNum (int): The page number for paginated results.

    Returns:
        Response: A JSON response containing paginated search results (recipes) based on the provided ingredient search term.
    """
    print("getting search for recipes by ingredient")

    try:
        args = request.args
        term = args.get("term")
        recipes = SearchFetcher.get_by_ingredient_term(
            term=term, paginated=True, pageNum=pageNum
        )
        serialized_recipes = [obj.to_json_recipe() for obj in recipes]
        return jsonify({"results": serialized_recipes}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
