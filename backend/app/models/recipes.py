from flask import current_app as app


class Recipes:
    def __init__(self, recipeID, postedByUserID, createdDate):
        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.createdDate = createdDate

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
    
    @staticmethod
    def get_last_recipe_id():
        print("getting last recipe id")
        max_recipe_id = app.db.execute('''
        SELECT MAX("recipeID")
        FROM "Recipes"
        ''')
        return max_recipe_id[0][0] if max_recipe_id[0][0] else None


    @staticmethod
    def add_recipe(recipeID, postedByUserID, createdDate):
        print('adding recipe')
        try:
            app.db.execute('''
            INSERT INTO \"Recipes\"
                        VALUES (:recipeID, :postedByUserID, :fullRecipeString, :createdDate)
            ''',
                           recipeID=recipeID,
                           postedByUserID=postedByUserID,
                           fullRecipeString="Cheeseburgers",
                           createdDate=createdDate)
            print("added recipe")
        except Exception as e:
            print(e)
            app.db.rollback()
            raise e
        

