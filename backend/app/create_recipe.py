from flask import Blueprint, request, jsonify
from models.recipes import Recipes
from datetime import datetime
from flask_cors import cross_origin

create_recipe_blueprint = Blueprint('create-recipe', __name__)

@create_recipe_blueprint.route('/create-recipe', methods=['POST'])
@cross_origin()
def create_recipe():
    print("creating recipe")
    try:
        data = request.get_json()

        last_recipe_id = Recipes.get_last_recipe_id()
        new_recipe_id = 1 if not last_recipe_id else last_recipe_id + 1

        Recipes.add_recipe(recipeID=new_recipe_id, postedByUserID=data.get('postedByUserID'), createdDate=datetime.now())

        return jsonify({'message': 'Recipe created successfully'}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

