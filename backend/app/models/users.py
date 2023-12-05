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
        profilePicS3Filename=None,
        row_num=None,
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
        self.profilePicS3Filename = profilePicS3Filename

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
    def get_by_uid(uid):
        rows = app.db.execute(
            """
        SELECT *
        FROM \"Users\"
        WHERE uid = :uid
        """,
            uid=uid,
        )
        return Users(*(rows[0])) if rows else None

    @staticmethod
    def get_by_uid(uid):
        rows = app.db.execute(
            """
        SELECT *
        FROM \"Users\"
        WHERE uid = :uid
        """,
            uid=uid,
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
    def to_json(curr_user):
        return {
            "uid": curr_user.uid,
            "firstName": curr_user.firstName,
            "middleName": curr_user.middleName,
            "lastName": curr_user.lastName,
            "suffix": curr_user.suffix,
            "dateOfBirth": curr_user.dateOfBirth,
            "pronouns": curr_user.pronouns,
            "email": curr_user.email,
            "phoneNumber": curr_user.phoneNumber,
            "creationDate": curr_user.creationDate,
            "bio": curr_user.bio,
            "profilePicS3Filename" : curr_user.profilePicS3Filename
        }

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

    @staticmethod
    def get_by_term(term: str, paginated=False, pageNum=0):
        search_term = "%" + term + "%"
        if paginated:
            lower_limit = 8 * pageNum
            upper_limit = 8 * (pageNum + 1) -1
            rows = app.db.execute('''
                SELECT *
                FROM (
                    SELECT *, ROW_NUMBER() OVER (ORDER BY \"Users\".\"firstName\" DESC) AS row_num
                    FROM \"Users\"
                    WHERE LOWER(\"firstName\") LIKE LOWER(:term)
                ) AS ranked_posts
                WHERE row_num BETWEEN :lower_limit AND :upper_limit;
                              ''',
                              term=search_term,
                              lower_limit = lower_limit,
                              upper_limit = upper_limit)
        else :
            rows = app.db.execute(f"""
                SELECT *
                FROM \"Users\"
                WHERE LOWER(\"firstName\") LIKE LOWER(:term)
                        """,
                            term=search_term,
                        )
        return [Users(*row) for row in rows]
    

    @staticmethod
    def check_user_liked_recipe(recipeID: int):
        # Check if the current user has liked the recipe
        user_id = Users.get_current_user_id()

        if user_id is not None:
            user_liked_recipe_result = app.db.execute('''
    SELECT EXISTS (SELECT 1 FROM \"Likes\"
    WHERE \"postID\" = :recipeID AND \"likedByUserID\" = :userID)
    ''',
                                recipeID=recipeID, userID=user_id)
            # if there is a row from user_liked_recipe_result, then the user has liked the recipe
            return user_liked_recipe_result[0][0]
        
        return False
