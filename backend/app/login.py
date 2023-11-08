from flask import request, jsonify, Blueprint, session
from werkzeug.security import check_password_hash
from models.users import Users
from flask_cors import cross_origin

login_blueprint = Blueprint('login', __name__)

@login_blueprint.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():

    print("Logging in")

    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Check if the email exists in the database
        user_password = Users.get_password_from_user(email=email)

        # print(user_password)

        if user_password:
            # Check if the password matches (assuming the password was hashed during registration)
            # print(check_password_hash(user_password, password))
            if check_password_hash(user_password, password):
                # You can create a session or token for the authenticated user here
                # Return a success message or user information as needed
                session['user'] = email
                return jsonify({'message': 'Login successful'}), 200
            else:
                return jsonify({'message': 'Incorrect email or password'}), 401
        else:
            return jsonify({'message': 'Email not found'}), 402
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500
    

@login_blueprint.route('/logout', methods=['POST'])
@cross_origin()
def logout():
    session.pop('user', None)
    return jsonify({'message': 'Logout successful'}), 200

@login_blueprint.route('/@me', methods=['GET'])
@cross_origin()
def get_user():
    if 'user' in session:
        return jsonify({'user': session['user']}), 200
    else:
        return jsonify({'user': None}), 200
