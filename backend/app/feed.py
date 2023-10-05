from flask import request, jsonify, Blueprint
from models.recipes import Recipes, RecipeJSONEncoder
from flask_cors import cross_origin

feed_blueprint = Blueprint('feed', __name__)

@feed_blueprint.route('/feed', methods=['GET'])
@cross_origin()
def feed():
    print("getting feed")

    try:
        recipes = Recipes.get_x_most_recent(8)
        print("full recipe string below")
        print(recipes[0].fullRecipeString)
        serialized_objects = [obj.to_json() for obj in recipes]
        print(serialized_objects)
        return jsonify({'descriptions' : serialized_objects}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500