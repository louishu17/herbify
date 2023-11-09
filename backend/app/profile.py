from flask import request, jsonify, Blueprint, session
from models.recipes import Recipes, RecipeJSONEncoder
from flask_cors import cross_origin
from models.users import Users

profile_blueprint = Blueprint('profile', __name__)

@profile_blueprint.route('/profile/<path:userId>', methods=['GET'])
@cross_origin()
def profile(userId):
    print("getting profile")
    userId = int(userId)

    try:
        if userId == -1:
            print("hiii")
            # user_email = session['user']
            
            # user = Users.get(user_email)
            user = Users.get_by_uid(3)
            user_info = Users.to_json(user)

        else:
            print('blah')
            user_email = session['user']
            user = Users.get(user_email)
            user_info = user.to_json()
        print("hi")
        num_followers = Users.get_followers(user.uid)
        num_following = Users.get_following(user.uid)
        

        recipes = Recipes.get_by_user(user.uid)
        print("the recipes are" + str(recipes))
        serialized_recipies = [obj.to_json_recipe() for obj in recipes]
        return jsonify({'user': [user_info], 
                        'followers': num_followers, 
                        'following': num_following, 
                        'recipies' : serialized_recipies}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500