from flask import request, jsonify, Blueprint, current_app as app
from leaderboard.leaderboardFetcher import Leader, LeaderboardFetcher, LeaderJSONEncoder
from feedRoutes.feedFetcher import RecipeOnFeed, RecipeOnFeedJSONEncoder
from flask_cors import cross_origin

leaderboard_blueprint = Blueprint("leaderboard", __name__)


@leaderboard_blueprint.route("/leading_users", methods=["GET"])
@cross_origin(supports_credentials=True)
def leading_users():
    """
    Get a list of leading users based on some criteria.

    Returns:
        JSON response containing a list of leading users.
    """
    print("getting leading users")

    try:
        leaders = LeaderboardFetcher.get_leaders()
        serialized_objects = [obj.to_json() for obj in leaders]

        return jsonify({"leaders": serialized_objects}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@leaderboard_blueprint.route("/leading_posts", methods=["GET"])
@cross_origin(supports_credentials=True)
def leading_posts():
    """
    Get a list of leading posts based on some criteria.

    Returns:
        JSON response containing a list of leading posts.
    """
    print("getting leading posts")

    try:
        posts = LeaderboardFetcher.get_leading_posts()
        serialized_objects = [obj.to_feed_json() for obj in posts]

        return jsonify({"descriptions": serialized_objects}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

