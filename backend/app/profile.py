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
        print(f'user is {userId}')
        print('num followers is:')
        print(num_followers)
        num_following = Users.get_following(user.uid)
        print('num following is:')
        print(num_following)
        

        recipes = Recipes.get_by_user(user.uid)
        serialized_recipes = [obj.to_json_recipe() for obj in recipes]
        return jsonify({'user': [user_info], 
                        'followers': num_followers, 
                        'following': num_following, 
                        'recipes' : serialized_recipes}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@profile_blueprint.route('/session', methods=['GET'])
@cross_origin(supports_credentials=True)
def session():
    print("getting sessionID")
    try:
        user_id = 3
        # user_id = Users.get_current_user_id()
        # print(user_id)
            
        return jsonify({'session_id': user_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@profile_blueprint.route('/following/<path:profileId>', methods=['GET'])
@cross_origin(supports_credentials=True)
def following(profileId):
    print("checking following")
    try:
        is_following = Users.check_following(profileId)
        
        return jsonify({'is_following': is_following}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@profile_blueprint.route('/follow/<path:profileId>', methods=['POST'])
@cross_origin(supports_credentials=True)
def follow(profileId):
    print("following")
    try:
        has_followed = Users.follow(profileId)
        if not has_followed:
            return jsonify({'error': 'error in following'}), 500
        
        return jsonify({}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@profile_blueprint.route('/unfollow/<path:profileId>', methods=['POST'])
@cross_origin(supports_credentials=True)
def unfollow(profileId):
    print("unfollowing")
    try:
        has_unfollowed = Users.unfollow(profileId)
        if not has_unfollowed:
            return jsonify({'error': 'error in unfollowing'}), 500
        return jsonify({}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500