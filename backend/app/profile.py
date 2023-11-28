from flask import request, jsonify, Blueprint, session
from models.recipes import Recipes, RecipeJSONEncoder
from flask_cors import cross_origin
from models.users import Users

profile_blueprint = Blueprint('profile', __name__)

@profile_blueprint.route('/profile/<path:userId>', methods=['GET'])
@cross_origin(supports_credentials=True)
def profile(userId):
    print("getting profile")
    userId = int(userId)

    try:
        if userId == -1:
            user_email = session['user']
            user = Users.get(user_email)
        else:
            user = Users.get_by_uid(userId)
        
        user_info = Users.to_json(user)
        num_followers = Users.get_followers(user.uid)
        num_following = Users.get_following(user.uid)
        

        recipes = Recipes.get_by_user(user.uid)
        print("the recipes are" + str(recipes))
        serialized_recipes = [obj.to_json_recipe() for obj in recipes]
        return jsonify({'user': [user_info], 
                        'followers': num_followers, 
                        'following': num_following, 
                        'recipes' : serialized_recipes}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

# @profile_blueprint.route('/profile/session', methods=['GET'])
# @cross_origin(supports_credentials=True)
# def session():
#     print("getting sessionID")
#     try:
#         user_id = Users.get_current_user_id()
            
#         return jsonify({'session_id': user_id}), 201
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# @profile_blueprint.route('/profile/following/<path:profileId>', methods=['GET'])
# @cross_origin(supports_credentials=True)
# def following(profileId):
#     print("checking following")
#     try:
#         is_following = Users.check_following(profileId)
        
#         return jsonify({'is_following': is_following}), 201
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500