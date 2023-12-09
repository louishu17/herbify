from flask import request, jsonify, Blueprint, session
from models.recipes import Recipes, RecipeJSONEncoder
from flask_cors import cross_origin
from models.users import Users
from models.follows import Follows
from models.recipes import Recipes

profile_blueprint = Blueprint("profile", __name__)


@profile_blueprint.route("/profile/<path:userId>", methods=["GET"])
@cross_origin(supports_credentials=True)
def profile(userId):
    print("getting profile")
    userId = int(userId)

    try:
        if userId == -1:
            user_email = session["user"]
            user = Users.get(user_email)
        else:
            user = Users.get_by_uid(userId)

        user_info = Users.to_json(user)
        num_followers = Follows.get_followers(user.uid)
        num_following = Follows.get_following(user.uid)

        recipes = Recipes.get_by_user(user.uid)
        serialized_recipes = [obj.to_json_recipe() for obj in recipes]
        return (
            jsonify(
                {
                    "user": [user_info],
                    "followers": num_followers,
                    "following": num_following,
                    "recipes": serialized_recipes,
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@profile_blueprint.route("/curr_session", methods=["GET"])
@cross_origin(supports_credentials=True)
def curr_session():
    print("getting sessionID")
    try:
        user_id = Users.get_current_user_id()
        return jsonify({"session_id": user_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@profile_blueprint.route("/following/<path:profileId>", methods=["GET"])
@cross_origin(supports_credentials=True)
def following(profileId):
    print("checking following")
    try:
        is_following = Follows.check_following(profileId)

        return jsonify({"is_following": is_following}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@profile_blueprint.route("/follow/<path:profileId>", methods=["POST"])
@cross_origin(supports_credentials=True)
def follow(profileId):
    print("following")
    try:
        has_followed = Follows.follow(profileId)
        if not has_followed:
            return jsonify({"error": "error in following"}), 500

        return jsonify({}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@profile_blueprint.route("/unfollow/<path:profileId>", methods=["POST"])
@cross_origin(supports_credentials=True)
def unfollow(profileId):
    print("unfollowing")
    try:
        has_unfollowed = Follows.unfollow(profileId)
        if not has_unfollowed:
            return jsonify({"error": "error in unfollowing"}), 500
        return jsonify({}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@profile_blueprint.route("/followed_by_users/<path:profileId>", methods=["GET"])
@cross_origin(supports_credentials=True)
def followed_by_users(profileId):
    try:
        followed_by = Follows.get_followed_by(profileId)
        return jsonify({"users": followed_by}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@profile_blueprint.route("/following_users/<path:profileId>", methods=["GET"])
@cross_origin(supports_credentials=True)
def following_users(profileId):
    try:
        following_users = Follows.get_following_users(profileId)
        return jsonify({"users": following_users}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@profile_blueprint.route("/users_liked_by_current/<path:profileId>", methods=["GET"])
@cross_origin(supports_credentials=True)
def users_liked_by_current(profileId):
    print("getting users liked by current user")

    try:
        liked_users = Recipes.get_user_liked_recipes(profileId)

        return jsonify({"recipes": liked_users}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
