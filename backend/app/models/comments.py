from flask import current_app as app


class RecipeComment:
    """
    Represents a comment on a recipe post.

    Attributes:
        id (int): The unique identifier for the comment.
        text (str): The text content of the comment.
        user_id (int): The ID of the user who posted the comment.
        parent_id (int): The ID of the parent comment, if this is a reply; otherwise, None.
        post_id (int): The ID of the recipe post to which the comment belongs.
        firstName (str): The first name of the user who posted the comment.
        profilePicS3Filename (str): The filename of the user's profile picture.
        timestamp (str): The timestamp indicating when the comment was posted.

    Methods:
        add_comment(text, user_id, parent_id, post_id):
            Adds a new comment to the database for a given recipe post.

        format_comments(post_id, comment_id=None):
            Retrieves and formats comments for a given recipe post or a specific comment.

    Usage:
        # Create a new comment object
        comment = RecipeComment(id, text, user_id, parent_id, post_id, timestamp, firstName, profilePicS3Filename)

        # Add a new comment to the database
        RecipeComment.add_comment(text, user_id, parent_id, post_id)

        # Retrieve and format comments for a recipe post
        formatted_comments = RecipeComment.format_comments(post_id)

        # Retrieve and format replies to a specific comment
        formatted_replies = RecipeComment.format_comments(post_id, comment_id)
    """

    def __init__(
        self,
        id,
        text,
        user_id,
        parent_id,
        post_id,
        timestamp,
        firstName,
        profilePicS3Filename,
    ):
        """
        Initializes a RecipeComment object with the provided attributes.
        """
        self.id = id
        self.text = text
        self.user_id = user_id
        self.parent_id = parent_id
        self.post_id = post_id
        self.firstName = firstName
        self.profilePicS3Filename = profilePicS3Filename
        self.timestamp = timestamp

    def __repr__(self):
        """
        Returns a string representation of the comment object.
        """
        return f"<Comment {self.id}>"

    @staticmethod
    def add_comment(text, user_id, parent_id, post_id):
        """
        Adds a new comment to the database for a given recipe post.

        Args:
            text (str): The text content of the comment.
            user_id (int): The ID of the user who posted the comment.
            parent_id (int): The ID of the parent comment, if this is a reply; otherwise, None.
            post_id (int): The ID of the recipe post to which the comment belongs.
        """
        print("adding comment")
        try:
            app.db.execute(
                """
            INSERT INTO \"Comments\" (text, user_id, parent_id, post_id)
            VALUES (:text, :user_id, :parent_id, :post_id)
            """,
                text=text,
                user_id=user_id,
                parent_id=parent_id,
                post_id=post_id,
            )
            print("added comment")
        except Exception as e:
            print(e)
            app.db.rollback()
            raise e

    @staticmethod
    def format_comments(post_id, comment_id=None):
        """
        Retrieves and formats comments for a given recipe post or a specific comment.

        Args:
            post_id (int): The ID of the recipe post for which comments are retrieved.
            comment_id (int, optional): The ID of a specific comment for which replies are retrieved. Default is None.

        Returns:
            list: A list of dictionaries representing the formatted comments and their replies.
        """
        print("getting comments")
        try:
            if comment_id is None:
                query = """
                    SELECT c.*, u.\"firstName\", u.\"profilePicS3Filename\"
                    FROM \"Comments\" c
                    JOIN \"Users\" u ON c.user_id = u.uid
                    WHERE c.parent_id IS NULL AND c.post_id = :post_id
                """
                comments = app.db.execute(query, post_id=post_id)
            else:
                query = """
                    SELECT c.*, u.\"firstName\", u.\"profilePicS3Filename\"
                    FROM \"Comments\" c
                    JOIN \"Users\" u ON c.user_id = u.uid
                    WHERE c.parent_id = :comment_id AND c.post_id = :post_id
                """
                comments = app.db.execute(query, comment_id=comment_id, post_id=post_id)

            print(comments)
            comments = (
                [
                    RecipeComment(
                        comment.id,
                        comment.text,
                        comment.user_id,
                        comment.parent_id,
                        comment.post_id,
                        comment.timestamp,
                        comment.firstName,
                        comment.profilePicS3Filename,
                    )
                    for comment in comments
                ]
                if comments
                else []
            )

            formatted_comments = []
            for comment in comments:
                formatted_comments.append(
                    {
                        "id": comment.id,
                        "text": comment.text,
                        "user_id": comment.user_id,
                        "parent_id": comment.parent_id,
                        "post_id": comment.post_id,
                        "timestamp": comment.timestamp,
                        "firstName": comment.firstName,
                        "profilePicS3Filename": comment.profilePicS3Filename,
                        "replies": RecipeComment.format_comments(post_id, comment.id),
                    }
                )

            return formatted_comments
        except Exception as e:
            print(e)
            app.db.rollback()
            raise e
