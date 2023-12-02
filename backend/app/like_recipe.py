from flask import Blueprint, request, jsonify, session
from flask_cors import cross_origin
from models.recipes import Recipes
from models.users import Users

like_recipe_blueprint = Blueprint('like-recipe', __name__)
unlike_recipe_blueprint = Blueprint('unlike-recipe', __name__)

@like_recipe_blueprint.route('/like-recipe', methods=['POST'])
@cross_origin(supports_credentials=True)
def like_recipe():
    print("liking recipe")
    try:
        recipeID = request.json['recipeID']
        if 'user' not in session:
            print("User not in session")
            return jsonify({'message': 'You must be logged in to like a recipe'}), 401
        user_email = session['user']
        user = Users.get(user_email)
        userID = user.uid

        Recipes.like_recipe(recipeID=recipeID, userID=userID)

        return jsonify({'message': 'Recipe liked successfully'}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@unlike_recipe_blueprint.route('/unlike-recipe', methods=['POST'])
@cross_origin(supports_credentials=True)
def unlike_recipe():
    print("unliking recipe")
    try:
        recipeID = request.json['recipeID']
        if 'user' not in session:
            print("User not in session")
            return jsonify({'message': 'You must be logged in to unlike a recipe'}), 401
        user_email = session['user']
        user = Users.get(user_email)
        userID = user.uid

        Recipes.unlike_recipe(recipeID=recipeID, userID=userID)

        return jsonify({'message': 'Recipe unliked successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

