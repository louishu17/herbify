from flask import request, jsonify, Blueprint
from models.recipes import Recipes
from models.basicRecipeInfo import BasicRecipeInfo
from flask_cors import cross_origin

# Create a Blueprint with a dynamic parameter 'recipeID'
basicInfo_blueprint = Blueprint('basicInfo_blueprint', __name__)

@basicInfo_blueprint.route('/recipe/<int:recipeID>/basicInfo', methods=['GET'])
@cross_origin(supports_credentials=True)
def feed(recipeID):
    print(f"Getting basicInfo for recipe {recipeID}")
    # You can use 'recipeID' in your code to fetch specific basicInfo
    # For example:
    # basicInfo = Recipedirection.query.filter_by(recipe_id=recipeID).all()
    # Then, jsonify and return the basicInfo
    # return jsonify([direction.serialize() for direction in basicInfo])
    # Replace the above lines with your specific logic


    try:
        recipe = BasicRecipeInfo.get(recipeID)
        
        return jsonify(recipe.to_json()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500