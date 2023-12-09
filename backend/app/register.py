from flask import request, jsonify, Blueprint, session
from datetime import datetime
from werkzeug.security import generate_password_hash
from models.users import Users
from flask_cors import cross_origin

register_blueprint = Blueprint('register', __name__)

@register_blueprint.route('/register', methods=['POST'])
@cross_origin(supports_credentials=True)
def register():
    print("registering")

    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Check if the email is already registered
        # existing_user = Users.query.filter_by(email=email).first()
        existing_user = Users.get(email=email)

        if existing_user:
            return jsonify({'message': 'Email already registered'}), 400

        # Generate a new UID (You can cache this using a database query)
        # last_user = Users.query.order_by(Users.uid.desc()).first()
        last_user_uid = Users.get_last_uid()
        new_uid = 1 if not last_user_uid else last_user_uid + 1

        # Create a new user with NULL or empty values for optional fields
        # new_user = Users(
        #     uid=new_uid,
        #     email=email,
        #     password=generate_password_hash(password, method='sha256'),
        #     creationDate=datetime.now()
        # )

        # app.db.session.add(new_user)
        # app.db.session.commit()
        Users.add_user(uid=new_uid, email=email, password=generate_password_hash(password, method='sha256'), creationDate=datetime.now())

        session['user'] = email
        print("test")

        return jsonify({'message': 'Registration successful'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500