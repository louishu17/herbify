from flask import current_app as app
from models.users import Users


class Follows:
    @staticmethod
    def get_followers(curr_uid):
        print("getting num followers")
        num_followers = app.db.execute(
            """
        SELECT COUNT(*)
        FROM \"Follows\"
        WHERE \"followedID\" = :curr_uid
        """,
            curr_uid=curr_uid,
        )

        return num_followers[0][0] if num_followers else None

    @staticmethod
    def get_following(curr_uid):
        print("getting num following")
        num_following = app.db.execute(
            """
        SELECT COUNT(*)
        FROM \"Follows\"
        WHERE \"followerID\" = :curr_uid
        """,
            curr_uid=curr_uid,
        )
        return num_following[0][0] if num_following else None

    @staticmethod
    def check_following(profile_uid):
        print(f"checking if {profile_uid} is followed")
        session_id = Users.get_current_user_id()
        num_following = app.db.execute(
            """
        SELECT COUNT(*)
        FROM \"Follows\"
        WHERE \"followedID\" = :profile_uid AND \"followerID\" = :session_id
        """,
            profile_uid=profile_uid,
            session_id=session_id,
        )
        
        return True if num_following[0][0] else False

    @staticmethod
    def follow(profile_uid):
        print(f"following {profile_uid}")
        session_id = Users.get_current_user_id()
        if Follows.check_following(profile_uid):
            return False
        num_following = app.db.execute(
            """
        INSERT INTO \"Follows\"
                        VALUES (:session_id, :profile_uid)
        """,
            session_id=session_id,
            profile_uid=profile_uid,
        )
        
        return True
    
    @staticmethod
    def unfollow(profile_uid):
        print(f"following {profile_uid}")
        session_id = Users.get_current_user_id()
        if not Follows.check_following(profile_uid):
            return False
        num_following = app.db.execute(
            """
        DELETE FROM \"Follows\"
                        WHERE \"followedID\" = :profile_uid AND \"followerID\" = :session_id
        """,
            session_id=session_id,
            profile_uid=profile_uid,
        )
        
        return True
    
    @staticmethod
    def get_followed_by(profile_uid):
        print(f"getting followed by {profile_uid}")
        followed_by = app.db.execute(
            '''
        SELECT \"followerID\", \"firstName\"
        FROM \"Follows\", \"Users\"
        WHERE \"followedID\" = :profile_uid AND \"followerID\" = \"Users\".uid
        ''',
            profile_uid=profile_uid,
        )
        
        return [{"uid": follower.followerID, "firstName": follower.firstName} for follower in followed_by] if followed_by else None
        
    @staticmethod
    def get_following_users(profile_uid):
        print(f"getting following users for {profile_uid}")
        following_users = app.db.execute(
            '''
        SELECT \"followedID\", \"firstName\"
        FROM \"Follows\", \"Users\"
        WHERE \"followerID\" = :profile_uid AND \"followedID\" = \"Users\".uid
        ''',
            profile_uid=profile_uid,
        )
        
        return [{"uid": follower.followedID, "firstName": follower.firstName} for follower in following_users] if following_users else None