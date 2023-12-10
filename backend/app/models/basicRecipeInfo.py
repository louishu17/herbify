from flask import current_app as app
from flask import session
from models.users import Users


class BasicRecipeInfo:
    """
    Represents basic information about a recipe.
    """

    def __init__(
        self,
        recipeID,
        postedByUserID,
        fullRecipeString,
        createdDate,
        title,
        caption,
        imageS3Filename,
        firstName,
        lastName,
        profilePicS3Filename,
        numLikes,
        userLiked,
        userRated,
    ):
        """
        Initializes a BasicRecipeInfo object.

        Args:
            recipeID (int): The ID of the recipe.
            postedByUserID (int): The ID of the user who posted the recipe.
            fullRecipeString (str): The full recipe string.
            createdDate (str): The date when the recipe was created.
            title (str): The title of the recipe.
            caption (str): The caption or description of the recipe.
            imageS3Filename (str): The filename of the recipe's image.
            firstName (str): The first name of the user who posted the recipe.
            lastName (str): The last name of the user who posted the recipe.
            profilePicS3Filename (str): The filename of the user's profile picture.
            numLikes (int): The number of likes the recipe has received.
            userLiked (bool): Indicates whether the user has liked the recipe.
            userRated (int): The rating given by the user for the recipe.
        """
        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.createdDate = createdDate
        self.title = title
        self.caption = caption
        self.imageS3Filename = imageS3Filename
        self.numLikes = numLikes
        self.userLiked = userLiked
        name = ""
        if type(firstName) == "str" and type(lastName) == "str":
            name = firstName + " " + lastName
        self.userName = str(firstName) + " " + str(lastName)
        self.firstName = firstName
        self.profilePicS3Filename = profilePicS3Filename
        self.userRated = userRated

    def to_json(self):
        """
        Converts the BasicRecipeInfo object to a JSON representation.

        Returns:
            dict: A dictionary representing the recipe information in JSON format.
        """
        return {
            "id": self.recipeID,
            "postedByUserID": self.postedByUserID,
            "title": self.title,
            "caption": self.caption,
            "imageS3Filename": self.imageS3Filename,
            "numLikes": self.numLikes,
            "userLiked": self.userLiked,
            "userName": self.userName,
            "profilePicS3Filename": self.profilePicS3Filename,
            "userRated": self.userRated,
        }

    @staticmethod
    def get(recipeID: int):
        """
        Retrieves recipe information by recipe ID from the database.

        Args:
            recipeID (int): The ID of the recipe to retrieve.

        Returns:
            BasicRecipeInfo or None: A BasicRecipeInfo object representing the recipe information,
                or None if the recipe is not found.
        """
        rows = app.db.execute(
            """
            SELECT \"recipeID\", \"postedByUserID\", \"fullRecipeString\", \"createdDate\", \"title\", \"caption\", \"imageS3Filename\", \"firstName\", \"lastName\", \"profilePicS3Filename\"
            FROM \"Recipes\"
            INNER JOIN \"Users\"
            ON \"Recipes\".\"postedByUserID\" = \"Users\".\"uid\"
            WHERE \"recipeID\" = :recipeID
            """,
            recipeID=recipeID,
        )
        num_likes_results = app.db.execute(
            """
            SELECT COUNT(*)
            FROM \"Likes\"
            WHERE \"postID\" = :recipeID
            """,
            recipeID=recipeID,
        )

        # Extract the number of likes from the query result
        num_likes = num_likes_results[0][0] if num_likes_results else 0

        # Check if User has liked message
        user_liked_recipe = Users.check_user_liked_recipe(recipeID=recipeID)

        # check what rating the user gave recipe
        print("getting user rating")
        user_rated_recipe = Users.user_rating_recipe(recipeID=recipeID)
        print(user_rated_recipe)

        if rows:
            # Combine the recipe info with the number of likes
            recipe_info = BasicRecipeInfo(
                *(rows[0]),
                numLikes=num_likes,
                userLiked=user_liked_recipe,
                userRated=user_rated_recipe
            )
            return recipe_info
        else:
            return None
