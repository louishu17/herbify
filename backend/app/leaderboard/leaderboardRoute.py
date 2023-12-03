from flask import request, jsonify, Blueprint

from leaderboard.leaderboardFetcher import Leader, Leaderboard, LeaderJSONEncoder
from flask_cors import cross_origin

leaderboard_blueprint = Blueprint('leaderboard', __name__)


    
@leaderboard_blueprint.route('/leaderboard', methods=['GET'])
@cross_origin()
def leaderboard():
    print("getting leaderboard")

    try:
        leaders = Leaderboard.get_leaders()
        serialized_objects = [obj.to_json() for obj in leaders]

        return jsonify({'leaders' : serialized_objects}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500