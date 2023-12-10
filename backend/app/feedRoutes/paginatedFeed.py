from flask import request, jsonify, Blueprint
from models.recipes import Recipes, RecipeJSONEncoder
from feedRoutes.feedFetcher import FeedFetcher
from flask_cors import cross_origin

paginated_feed_blueprint = Blueprint("paginated feed", __name__)


@paginated_feed_blueprint.route("/feed/<int:pageNum>", methods=["GET"])
@cross_origin(supports_credentials=True)
def feed(pageNum):
    """
    Retrieve a specific set of the most recent paginated feed recipes.

    Args:
        pageNum (int): The page number or index of the set to retrieve.

    Returns:
        Response: A JSON response containing a list of RecipeOnFeed objects representing the specified set of recipes.
    """
    print("getting feed")

    try:
        recipes = FeedFetcher.get_ith_set_of_most_recent_feed_recipes(pageNum)
        serialized_objects = [obj.to_feed_json() for obj in recipes]

        return jsonify({"descriptions": serialized_objects}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@paginated_feed_blueprint.route("/customized_feed/<int:pageNum>", methods=["GET"])
@cross_origin(supports_credentials=True)
def customized_feed(pageNum):
    """
    Retrieve a specific set of the most recent customized feed recipes from people you follow.

    Args:
        pageNum (int): The page number or index of the set to retrieve.

    Returns:
        Response: A JSON response containing a list of RecipeOnFeed objects representing the specified set of recipes from people you follow.
    """
    print("getting customized feed")

    try:
        recipes = (
            FeedFetcher.get_ith_set_of_most_recent_feed_recipes_from_ppl_you_follow(
                pageNum
            )
        )
        serialized_objects = [obj.to_feed_json() for obj in recipes]

        return jsonify({"descriptions": serialized_objects}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
