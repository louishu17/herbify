from flask import request, jsonify, Blueprint
from models.directions import RecipeDirection
from flask_cors import cross_origin

# Create a Blueprint with a dynamic parameter 'recipeID'
directions_blueprint = Blueprint('directions_blueprint', __name__)

@directions_blueprint.route('/recipe/<int:recipeID>/directions', methods=['GET'])
@cross_origin()
def feed(recipeID):
    print(f"Getting directions for recipe {recipeID}")
    # You can use 'recipeID' in your code to fetch specific directions
    # For example:
    # directions = Recipedirection.query.filter_by(recipe_id=recipeID).all()
    # Then, jsonify and return the directions
    # return jsonify([direction.serialize() for direction in directions])
    # Replace the above lines with your specific logic


    try:
        directions = RecipeDirection.getDirectionsForRecipe(recipeID=recipeID)
        directions = sorted(directions, key=lambda d : d.stepNumber)

        return jsonify({'directions' : [direction.stepDescription for direction in directions]}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500