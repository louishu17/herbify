from flask import current_app as app
import json

class RecipeIngredient:
    def __init__(self, recipeID, ingredient):
        self.recipeID = recipeID
        self.ingredient = ingredient

        


    @staticmethod
    def getIngredientsForRecipe(recipeID: int):
        # Use placeholders for parameters in the SQL query and pass parameters separately
        query = '''
        SELECT *
        FROM \"RecipeHasIngredients\"
        WHERE \"recipeID\" = :recipeID
        '''
        
        # Use the execute method with parameter binding
        rows = app.db.execute(query, recipeID=recipeID)
        print(rows)
        return [RecipeIngredient(row.recipeID, row.ingredient) for row in rows ]if rows else []



