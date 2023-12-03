from flask import request, jsonify, Blueprint
from models.recipes import Recipes, RecipeJSONEncoder
from flask_cors import cross_origin
from models.users import Users

basic_search_blueprint = Blueprint("search", __name__)


@basic_search_blueprint.route("/search", methods=["GET"])
@cross_origin()
def search():
    print("getting search")

    try:
        args = request.args
        term = args.get("term")
        recipes = Recipes.get_by_term(term)
        serialized_recipies = [obj.to_json_recipe() for obj in recipes]
        return jsonify({"results": serialized_recipies}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@basic_search_blueprint.route("/search_user", methods=["GET"])
@cross_origin()
def search_user():
    print("getting search for user")

    try:
        args = request.args
        term = args.get("term")
        users = Users.get_by_term(term)
        serialized_users = [Users.to_json(obj) for obj in users]
        return jsonify({"results": serialized_users}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500