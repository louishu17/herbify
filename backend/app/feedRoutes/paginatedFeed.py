from flask import request, jsonify, Blueprint
from models.recipes import Recipes, RecipeJSONEncoder
from feedRoutes.feedFetcher import FeedFetcher
from flask_cors import cross_origin

paginated_feed_blueprint = Blueprint('paginated feed', __name__)


    
@paginated_feed_blueprint.route('/feed/<int:pageNum>', methods=['GET'])
@cross_origin()
def feed(pageNum):
    print("getting feed")

    try:
        recipes = FeedFetcher.get_ith_set_of_most_recent_feed_recipes(pageNum)
        serialized_objects = [obj.to_feed_json() for obj in recipes]

        return jsonify({'descriptions' : serialized_objects}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@paginated_feed_blueprint.route('/customized_feed/<int:pageNum>', methods=['GET'])
@cross_origin(supports_credentials=True)
def customized_feed(pageNum):
    print("getting customized feed")

    try:
        recipes = FeedFetcher.get_ith_set_of_most_recent_feed_recipes_from_ppl_you_follow(pageNum)
        serialized_objects = [obj.to_feed_json() for obj in recipes]

        return jsonify({'descriptions' : serialized_objects}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500