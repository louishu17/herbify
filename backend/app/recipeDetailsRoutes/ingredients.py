from flask import request, jsonify, Blueprint
from models.ingredients import RecipeIngredient
from flask_cors import cross_origin

# Create a Blueprint with a dynamic parameter 'recipeID'
ingredients_blueprint = Blueprint('ingredients_blueprint', __name__)

@ingredients_blueprint.route('/recipe/<int:recipeID>/ingredients', methods=['GET'])
@cross_origin()
def feed(recipeID):
    print(f"Getting ingredients for recipe {recipeID}")
    # You can use 'recipeID' in your code to fetch specific ingredients
    # For example:
    # ingredients = RecipeIngredient.query.filter_by(recipe_id=recipeID).all()
    # Then, jsonify and return the ingredients
    # return jsonify([ingredient.serialize() for ingredient in ingredients])
    # Replace the above lines with your specific logic


    try:
        ingredients = RecipeIngredient.getIngredientsForRecipe(recipeID=recipeID)

        return jsonify({'ingredients' : [ingredient.ingredient for ingredient in ingredients]}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500