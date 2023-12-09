from flask import Blueprint, request, jsonify, session
from flask_cors import cross_origin
from models.recipes import Recipes
from models.users import Users

rate_recipe_blueprint = Blueprint('rate-recipe', __name__)

@rate_recipe_blueprint.route('/recipe/<int:recipeID>/rate-recipe', methods=['POST'])
@cross_origin(supports_credentials=True)
def like_recipe(recipeID):
    print("rating recipe")
    try:
        data = request.get_json()
        rating = data['rating']
        user_id = Users.get_current_user_id()
        if not user_id:
            print("User not in session")
            return jsonify({'message': 'You must be logged in to rate a recipe'}), 401

        Recipes.rate_recipe(recipeID=recipeID, userID=user_id, rating=rating)
        return jsonify({'message': 'Recipe rated successfully'}), 201
    
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

