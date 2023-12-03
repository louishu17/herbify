from flask import current_app as app
from flask import session
from models.users import Users

class BasicRecipeInfo:
    def __init__(self, recipeID, postedByUserID, fullRecipeString, createdDate, title, caption, imageS3Filename, numLikes, userLiked):
        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.createdDate = createdDate
        self.title = title
        self.caption = caption
        self.imageS3Filename = imageS3Filename
        self.numLikes = numLikes
        self.userLiked = userLiked
        

    def to_json(self):
        return {
            "id" : self.recipeID,
            "title" : self.title,
            "caption" : self.caption,
            "imageS3Filename" : self.imageS3Filename,
            "numLikes": self.numLikes,
            "userLiked": self.userLiked
        }

    @staticmethod
    def get(recipeID: int):
        rows = app.db.execute('''
SELECT *
FROM \"Recipes\"
WHERE \"recipeID\" = :recipeID
''',
                              recipeID=recipeID)
        num_likes_results = app.db.execute('''
SELECT COUNT(*)
FROM \"Likes\"
WHERE \"postID\" = :recipeID
''',
                              recipeID=recipeID)

        # Check if the current user has liked the recipe
        user_id = Users.get_current_user_id()
        if user_id:
            print("current user id is " + str(user_id))
            user_liked_recipe_result = app.db.execute('''
    SELECT * FROM \"Likes\"
    WHERE \"postID\" = :recipeID AND \"likedByUserID\" = :userID
    ''',
                                recipeID=recipeID, userID=user_id)
            # if there is a row from user_liked_recipe_result, then the user has liked the recipe
            if user_liked_recipe_result:
                user_liked_recipe_result = True
            else:
                user_liked_recipe_result = False
            
        else:
            print("no current user")
            user_liked_recipe_result = False


        # Extract the number of likes from the query result
        num_likes = num_likes_results[0][0] if num_likes_results else 0

        if rows:
            # Combine the recipe info with the number of likes
            recipe_info = BasicRecipeInfo(*(rows[0]), numLikes = num_likes, userLiked = user_liked_recipe_result)
            return recipe_info
        else:
            return None