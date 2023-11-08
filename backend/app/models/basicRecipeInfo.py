from flask import current_app as app
import json

class BasicRecipeInfo:
    def __init__(self, recipeID, postedByUserID, fullRecipeString, createdDate, title, caption, imageS3Filename):
        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.createdDate = createdDate
        self.title = title
        self.caption = caption
        self.imageS3Filename = imageS3Filename
        

    def to_json(self):
        return {
            "id" : self.recipeID,
            "title" : self.title,
            "caption" : self.caption,
            "imageS3Filename" : self.imageS3Filename
        }

    @staticmethod
    def get(recipeID: int):
        rows = app.db.execute('''
SELECT *
FROM \"Recipes\"
WHERE \"recipeID\" = :recipeID
''',
                              recipeID=recipeID)
        return BasicRecipeInfo(*(rows[0])) if rows else None