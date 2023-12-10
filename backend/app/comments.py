from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models.comments import RecipeComment
from models.users import Users


add_comment_blueprint = Blueprint('comment-recipe', __name__)

@add_comment_blueprint.route('/comment', methods=['POST'])
@cross_origin(supports_credentials=True)
def add_comment():
    print("adding comment")
    try:
        data = request.get_json()
        user_id = Users.get_current_user_id()
        if not user_id:
            print("User not in session")
            return jsonify({'message': 'You must be logged in to comment on a recipe'}), 401
        if 'parentID' not in data:
            parent_id = None
        else:
            parent_id = data['parentID']
        recipeID = data['recipeID'] 
        text = data['text']
        RecipeComment.add_comment(text=text, user_id=user_id,  parent_id=parent_id, post_id=recipeID)
        print("added comment")
        return jsonify({'message': 'Comment added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


    
