from flask import current_app as app


class Recipes:
    def __init__(self, recipeID, postedByUserID, fullRecipeString, createdDate, user):
        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.fullRecipeString = fullRecipeString
        self.createdDate = createdDate
        
        self.user = user

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
