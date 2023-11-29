from flask import current_app as app
import json

class BasicRecipeInfo:
    def __init__(self, recipeID, postedByUserID, fullRecipeString, createdDate, title, caption, imageS3Filename, numLikes):
        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.createdDate = createdDate
        self.title = title
        self.caption = caption
        self.imageS3Filename = imageS3Filename
        self.numLikes = numLikes
        

    def to_json(self):
        return {
            "id" : self.recipeID,
            "title" : self.title,
            "caption" : self.caption,
            "imageS3Filename" : self.imageS3Filename,
            "numLikes": self.numLikes
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
        # Extract the number of likes from the query result
        num_likes = num_likes_results[0][0] if num_likes_results else 0

        if rows:
            # Combine the recipe info with the number of likes
            recipe_info = BasicRecipeInfo(*(rows[0]), numLikes = num_likes)
            return recipe_info
        else:
            return None