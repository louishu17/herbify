from flask import current_app as app
import json
from models.basicRecipeInfo import BasicRecipeInfo

class BasicRecipeInfo:
    def __init__(self, title, author, dateCreated):
        self.title = title
        self.author = author
        self.dateCreated = dateCreated

    @staticmethod
    def getBasicRecipeInfo(recipeID: int):
        rows = app.db.execute('''
SELECT *
FROM \"Recipes\", \"Users\"
WHERE \"recipeID\" = :recipeID AND \"postedByUserID\" = \"uid\"
                              
''',
                              recipeID=recipeID)
        print(rows)
        return BasicRecipeInfo(rows[0].title, rows[0].firstName + rows[0].lastName) if rows else None