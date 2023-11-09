from flask import request, jsonify, Blueprint
from models.recipes import Recipes, RecipeJSONEncoder
from flask_cors import cross_origin

search_blueprint = Blueprint('search', __name__)

@search_blueprint.route('/search', methods=['GET'])
@cross_origin()
def search():
    print("getting search")

    try:
        args = request.args
        term = args.get('term')
        recipes = Recipes.get_by_term(term)
        serialized_recipies = [obj.to_json_recipe() for obj in recipes]
        return jsonify({'results' : serialized_recipies}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500