from flask import current_app as app
from flask import session
from models.users import Users

class BasicRecipeInfo:
    def __init__(self, recipeID, postedByUserID, fullRecipeString, createdDate, title, caption, imageS3Filename, firstName, lastName, profilePicS3Filename, numLikes, userLiked):
        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.createdDate = createdDate
        self.title = title
        self.caption = caption
        self.imageS3Filename = imageS3Filename
        self.numLikes = numLikes
        self.userLiked = userLiked
        name = ""
        if (type(firstName) == 'str' and type(lastName) == 'str'):
            name = firstName + " " + lastName
        self.userName = str(firstName) + " " + str(lastName)
        self.firstName = firstName
        self.profilePicS3Filename = profilePicS3Filename

    def to_json(self):
        return {
            "id" : self.recipeID,
            "postedByUserID" : self.postedByUserID,
            "title" : self.title,
            "caption" : self.caption,
            "imageS3Filename" : self.imageS3Filename,
            "numLikes": self.numLikes,
            "userLiked": self.userLiked,
            "userName" : self.userName,
            "profilePicS3Filename" : self.profilePicS3Filename
        }

    @staticmethod
    def get(recipeID: int):
        rows = app.db.execute('''
            SELECT \"recipeID\", \"postedByUserID\", \"fullRecipeString\", \"createdDate\", \"title\", \"caption\", \"imageS3Filename\", \"firstName\", \"lastName\", \"profilePicS3Filename\"
            FROM \"Recipes\"
            INNER JOIN \"Users\"
            ON \"Recipes\".\"postedByUserID\" = \"Users\".\"uid\"
            WHERE \"recipeID\" = :recipeID

            ''',
                              recipeID=recipeID)
        num_likes_results = app.db.execute('''
            SELECT COUNT(*)
            FROM \"Likes\"
            WHERE \"postID\" = :recipeID
            ''',
                              recipeID=recipeID)


        # Extract the number of likes from the query result
        num_likes = num_likes_results[0][0] if num_likes_results else 0

        # Check if User has liked message
        user_liked_recipe = Users.check_user_liked_recipe(recipeID=recipeID)

        if rows:
            # Combine the recipe info with the number of likes
            recipe_info = BasicRecipeInfo(*(rows[0]), numLikes = num_likes, userLiked = user_liked_recipe)
            return recipe_info
        else:
            return None