from flask import request, jsonify, Blueprint, current_app as app
from leaderboard.leaderboardFetcher import Leader, LeaderboardFetcher, LeaderJSONEncoder
from feedRoutes.feedFetcher import RecipeOnFeed, RecipeOnFeedJSONEncoder
from flask_cors import cross_origin

leaderboard_blueprint = Blueprint("leaderboard", __name__)


@leaderboard_blueprint.route("/leading_users", methods=["GET"])
@cross_origin()
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
@cross_origin()
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


@leaderboard_blueprint.route("/create_view", methods=["GET"])
@cross_origin()
def create_recipes_view():
    """
    Create a view in the database for leaderboard by posts.

    Returns:
        JSON response indicating the status of view creation.
    """
    print("getting leaderboard by posts")

    try:
        app.db.execute(
            """
            CREATE VIEW RecipesForFeed AS (
                -- Your SQL query here
            )
            """
        )
        leaders = LeaderboardFetcher.get_leaders()
        serialized_objects = [obj.to_json() for obj in leaders]

        return jsonify({"leaders": serialized_objects}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@leaderboard_blueprint.route("/delete_view", methods=["GET"])
@cross_origin()
def delete_recipes_view():
    """
    Delete a view in the database for leaderboard by posts.

    Returns:
        JSON response indicating the status of view deletion.
    """
    print("getting leaderboard by posts")

    try:
        rows = app.db.execute(
            """
            DROP VIEW RecipesForFeedd
            """
        )
        print(rows)
        leaders = LeaderboardFetcher.get_leaders()
        serialized_objects = [obj.to_json() for obj in leaders]

        return jsonify({"leaders": serialized_objects}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
