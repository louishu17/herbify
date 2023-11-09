from flask import current_app as app
from datetime import datetime
from flask import session

class Users:
    def __init__(
        self,
        uid,
        firstName=None,
        middleName=None,
        lastName=None,
        suffix=None,
        dateOfBirth=None,
        pronouns=None,
        email=None,
        password=None,
        phoneNumber=None,
        creationDate=None,
        bio=None,
    ):
        self.uid = uid
        self.firstName = firstName
        self.middleName = middleName
        self.lastName = lastName
        self.suffix = suffix
        self.dateOfBirth = dateOfBirth
        self.pronouns = pronouns
        self.email = email
        self.password = password
        self.phoneNumber = phoneNumber
        self.creationDate = creationDate
        self.bio = bio

    @staticmethod
    def get_current_user_id():
        user_email = session.get("user")

        if not user_email:
            return None

        user = Users.get(email=user_email)
        return user.uid

    @staticmethod
    def get(email):
        rows = app.db.execute(
            """
        SELECT *
        FROM \"Users\"
        WHERE email = :email
        """,
            email=email,
        )
        return Users(*(rows[0])) if rows else None

    @staticmethod
    def get_password_from_user(email):
        password = app.db.execute(
            """
        SELECT password
        FROM \"Users\"
        WHERE email = :email
        """,
            email=email,
        )

        return password[0][0] if password else None

    @staticmethod
    def get_last_uid():
        print("getting last uid")
        max_uid = app.db.execute(
            """
        SELECT MAX(uid)
        FROM \"Users\"
        """
        )
        return max_uid[0][0] if max_uid[0][0] else None

    @staticmethod
    def add_user(
        uid,
        firstName=None,
        middleName=None,
        lastName=None,
        suffix=None,
        dateOfBirth=None,
        pronouns=None,
        email=None,
        password=None,
        phoneNumber=None,
        creationDate=None,
        bio=None,
    ):
        print("adding users")
        try:
            app.db.execute(
                """
            INSERT INTO \"Users\"
                        VALUES (:uid, :firstName, :middleName, :lastName, :suffix, :dateOfBirth, :pronouns, :email, :password, :phoneNumber, :creationDate, :bio)
            """,
                uid=uid,
                firstName=firstName,
                middleName=middleName,
                lastName=lastName,
                suffix=suffix,
                dateOfBirth=dateOfBirth,
                pronouns=pronouns,
                email=email,
                password=password,
                phoneNumber=phoneNumber,
                creationDate=creationDate,
                bio=bio,
            )

            print("added users")

            return {"message": "User added successfully"}, 201
        except Exception as e:
            print(f"Error adding user: {str(e)}")
            return {"error": "Failed to add user"}, 500

    @staticmethod
    def update_user(email, **kwargs):
        print("updating user")

        if "dateOfBirth" in kwargs:
            # Parse dateOfBirth and format it for PostgreSQL
            date_of_birth = datetime.strptime(
                kwargs["dateOfBirth"], "%m/%d/%Y"
            ).strftime("%Y-%m-%d")
            kwargs["dateOfBirth"] = date_of_birth
        
        print("date of birth parsed")

        try:
            update_fields = []
            for column, value in kwargs.items():
                if value is not None:
                    update_fields.append(f'"{column}" = :{column}')

            if update_fields:
                update_query = f"""
                    UPDATE \"Users\"
                    SET {', '.join(update_fields)}
                    WHERE \"email\" = :email
                """
                app.db.execute(update_query, email=email, **kwargs)
                print("updated user")
                return {"message": "User updated successfully"}, 200
            else:
                print("No fields to update")
                return {"message": "No fields to update"}, 200
        except Exception as e:
            print(f"Error updating user: {str(e)}")
            return {"error": "Failed to update user"}, 500
