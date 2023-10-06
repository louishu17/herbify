from flask import current_app as app
import json

class RecipeDirection:
    def __init__(self, recipeID, stepNumber, stepDescription):
        self.recipeID = recipeID
        self.stepNumber = stepNumber
        self.stepDescription = stepDescription
        


    @staticmethod
    def getDirectionsForRecipe(recipeID: int):
        # Use placeholders for parameters in the SQL query and pass parameters separately
        query = '''
        SELECT *
        FROM \"RecipeHasSteps\"
        WHERE \"recipeID\" = :recipeID
        '''
        
        # Use the execute method with parameter binding
        rows = app.db.execute(query, recipeID=recipeID)
        print(rows)
        return [RecipeDirection(row.recipeID, row.stepNumber, row.stepDescription) for row in rows ]if rows else []



