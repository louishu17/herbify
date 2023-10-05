from flask import current_app as app
import json

class Recipes:
    def __init__(self, recipeID, postedByUserID, fullRecipeString, createdDate, title, caption):
        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.fullRecipeString = fullRecipeString
        self.createdDate = createdDate
        self.title = title
        self.caption = caption
        

    def to_json(self):
        return {
            "id" : self.recipeID,
            "title" : self.title,
            "caption" : self.caption
        }

    @staticmethod
    def get(recipeID: int):
        rows = app.db.execute('''
SELECT *
FROM \"Recipes\"
WHERE recipeID = :recipeID
''',
                              id=recipeID)
        return Recipes(*(rows[0])) if rows else None

    @staticmethod
    def get_x_most_recent(x: int):
        rows = app.db.execute('''
SELECT *
FROM "Recipes"
ORDER BY "Recipes"."createdDate" DESC
LIMIT :x
''',
                              x=x)
        return [Recipes(*row) for row in rows]


class RecipeJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Recipes):
            # Define how to serialize the object
            return obj.to_json()  # Assuming you have a to_json() method
        return super(RecipeJSONEncoder, self).default(obj)