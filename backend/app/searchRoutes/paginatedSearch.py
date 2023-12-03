from flask import request, jsonify, Blueprint
from models.recipes import Recipes, RecipeJSONEncoder
from flask_cors import cross_origin
from models.users import Users

paginated_search_blueprint = Blueprint("paginated search", __name__)


@paginated_search_blueprint.route("/search/<int:pageNum>", methods=["GET"])
@cross_origin()
def paginated_search(pageNum):
    print("getting paginated search")

    try:
        args = request.args
        term = args.get("term")
        recipes = Recipes.get_by_term(term, paginated=True, pageNum=pageNum)
        serialized_recipies = [obj.to_json_recipe() for obj in recipes]
        return jsonify({"results": serialized_recipies}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@paginated_search_blueprint.route("/search_user/<int:pageNum>", methods=["GET"])
@cross_origin()
def search_user(pageNum):
    print("getting search for user")

    try:
        args = request.args
        term = args.get("term")
        users = Users.get_by_term(term)
        serialized_users = [Users.to_json(obj) for obj in users]
        return jsonify({"results": serialized_users}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
