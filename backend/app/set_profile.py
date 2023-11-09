from flask import request, jsonify, Blueprint
from datetime import datetime
from werkzeug.security import generate_password_hash
from models.users import Users
from flask_cors import cross_origin
from flask import session

set_profile_blueprint = Blueprint("set-profile", __name__)


@set_profile_blueprint.route("/set-profile", methods=["POST"])
@cross_origin(supports_credentials=True)
def set_profile():
    print("setting profile")

    try:
        # Get current uid from user session
        # uid = session.get("uid")
        print("getting user from session")

        if 'user' not in session:
            print("User not in session")
            return jsonify({"message": "You must be logged in to set your profile"}), 401
        email = session["user"]
        print("grabbing data of user " + email)
        data = request.get_json()
        firstName = data.get("firstName")
        middleName = data.get("middleName")
        lastName = data.get("lastName")
        suffix = data.get("suffix")
        dateOfBirth = data.get("dateOfBirth")
        pronouns = data.get("pronouns")
        phoneNumber = data.get("phoneNumber")
        bio = data.get("bio")

        # Do not update email, password, or creationDate
        # Password can be reset using the reset password endpoint
        print("updating user")
        Users.update_user(
            email=email,
            firstName=firstName,
            middleName=middleName,
            lastName=lastName,
            suffix=suffix,
            dateOfBirth=dateOfBirth,
            pronouns=pronouns,
            phoneNumber=phoneNumber,
            bio=bio,
        )

        print("test")

        return jsonify({"message": "Registration successful"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500