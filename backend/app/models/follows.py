from flask import current_app as app
from models.users import Users


class Follows:
    """
    Provides functionality for managing user followers and following relationships.

    Methods:
        get_followers(curr_uid):
            Retrieves the number of followers for a user with the specified user ID.

        get_following(curr_uid):
            Retrieves the number of users that the specified user is following.

        check_following(profile_uid):
            Checks if the currently authenticated user is following a given profile.

        follow(profile_uid):
            Follows a specified user's profile.

        unfollow(profile_uid):
            Unfollows a specified user's profile.

        get_followed_by(profile_uid):
            Retrieves a list of users who are following a specified profile.

        get_following_users(profile_uid):
            Retrieves a list of users whom the specified user is following.
    """

    @staticmethod
    def get_followers(curr_uid):
        """
        Retrieves the number of followers for a user with the specified user ID.

        Args:
            curr_uid (int): The user ID for which followers are counted.

        Returns:
            int or None: The number of followers or None if no followers are found.
        """
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
        """
        Retrieves the number of users that the specified user is following.

        Args:
            curr_uid (int): The user ID of the user whose following count is retrieved.

        Returns:
            int or None: The number of users being followed or None if no following relationships are found.
        """
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
        """
        Checks if the currently authenticated user is following a given profile.

        Args:
            profile_uid (int): The user ID of the profile to be checked.

        Returns:
            bool: True if the authenticated user is following the profile; otherwise, False.
        """
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
        """
        Follows a specified user's profile.

        Args:
            profile_uid (int): The user ID of the profile to be followed.

        Returns:
            bool: True if the follow operation is successful; otherwise, False.
        """
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
        """
        Unfollows a specified user's profile.

        Args:
            profile_uid (int): The user ID of the profile to be unfollowed.

        Returns:
            bool: True if the unfollow operation is successful; otherwise, False.
        """
        print(f"unfollowing {profile_uid}")
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
        """
        Retrieves a list of users who are following a specified profile.

        Args:
            profile_uid (int): The user ID of the profile for which followers are retrieved.

        Returns:
            list or None: A list of dictionaries containing follower information, or None if no followers are found.
        """
        print(f"getting followed by {profile_uid}")
        followed_by = app.db.execute(
            """
        SELECT \"followerID\", \"firstName\", \"profilePicS3Filename\"
        FROM \"Follows\", \"Users\"
        WHERE \"followedID\" = :profile_uid AND \"followerID\" = \"Users\".uid
        """,
            profile_uid=profile_uid,
        )

        return (
            [
                {
                    "uid": follower.followerID,
                    "firstName": follower.firstName,
                    "profilePicS3Filename": follower.profilePicS3Filename,
                }
                for follower in followed_by
            ]
            if followed_by
            else None
        )

    @staticmethod
    def get_following_users(profile_uid):
        """
        Retrieves a list of users whom the specified user is following.

        Args:
            profile_uid (int): The user ID of the user whose following relationships are retrieved.

        Returns:
            list or None: A list of dictionaries containing user information, or None if no following relationships are found.
        """
        print(f"getting following users for {profile_uid}")
        following_users = app.db.execute(
            """
        SELECT \"followedID\", \"firstName\", \"profilePicS3Filename\"
        FROM \"Follows\", \"Users\"
        WHERE \"followerID\" = :profile_uid AND \"followedID\" = \"Users\".uid
        """,
            profile_uid=profile_uid,
        )

        return (
            [
                {
                    "uid": follower.followedID,
                    "firstName": follower.firstName,
                    "profilePicS3Filename": follower.profilePicS3Filename,
                }
                for follower in following_users
            ]
            if following_users
            else None
        )
