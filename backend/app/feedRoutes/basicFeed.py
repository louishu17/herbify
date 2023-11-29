from flask import request, jsonify, Blueprint
from models.recipes import Recipes, RecipeJSONEncoder
from flask_cors import cross_origin

basic_feed_blueprint = Blueprint('basic feed', __name__)

@basic_feed_blueprint.route('/feed', methods=['GET'])
@cross_origin()
def feed():
    print("getting feed")

    try:
        recipes = Recipes.get_x_most_recent(8)
        serialized_objects = [obj.to_feed_json() for obj in recipes]

        return jsonify({'descriptions' : serialized_objects}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500