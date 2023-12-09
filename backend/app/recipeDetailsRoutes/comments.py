
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin

from models.comments import RecipeComment

get_comments_blueprint = Blueprint('get-comments', __name__)

@get_comments_blueprint.route('/recipe/<int:recipeID>/comments', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_comments(recipeID):
    print("getting comments")
    try:
        comments = RecipeComment.format_comments(post_id = recipeID)
        return jsonify({'comments': comments}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500