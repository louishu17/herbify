from flask import Blueprint, jsonify, request
from flask_cors import cross_origin

from models.comments import RecipeComment

get_comments_blueprint = Blueprint("get-comments", __name__)


@get_comments_blueprint.route("/recipe/<int:recipeID>/comments", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_comments(recipeID):
    """
    Retrieve comments for a specific recipe based on the provided recipe ID.

    Args:
        recipeID (int): The unique identifier of the recipe for which to retrieve comments.

    Returns:
        Response: A JSON response containing comments for the specified recipe.
    """
    print("getting comments")
    try:
        comments = RecipeComment.format_comments(post_id=recipeID)
        return jsonify({"comments": comments}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
