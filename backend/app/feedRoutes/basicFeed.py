from flask import request, jsonify, Blueprint
from models.recipes import Recipes, RecipeJSONEncoder
from flask_cors import cross_origin
from feedRoutes.feedFetcher import FeedFetcher
from flask import current_app as app

basic_feed_blueprint = Blueprint("basic feed", __name__)


@basic_feed_blueprint.route("/feed", methods=["GET"])
@cross_origin(supports_credentials=True)
def feed():
    """
    Retrieve the basic feed containing the most recent recipes.

    Returns:
        Response: A JSON response containing the most recent recipes in the basic feed.

    Raises:
        Exception: If there is an error while retrieving the feed.
    """
    print("getting feed")

    try:
        recipes = FeedFetcher.get_x_most_recent(8)
        serialized_objects = [obj.to_feed_json() for obj in recipes]

        return jsonify({"descriptions": serialized_objects}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
