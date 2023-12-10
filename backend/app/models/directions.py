from flask import current_app as app
import json


class RecipeDirection:
    """
    Represents a step or direction in a recipe.

    Attributes:
        recipeID (int): The ID of the recipe to which this direction belongs.
        stepNumber (int): The step number in the recipe's instructions.
        stepDescription (str): The description or content of the step.

    Methods:
        getDirectionsForRecipe(recipeID: int):
            Retrieves a list of RecipeDirection objects for a given recipe ID.

    Usage:
        # Create a new RecipeDirection object
        direction = RecipeDirection(recipeID, stepNumber, stepDescription)

        # Retrieve a list of directions for a specific recipe
        directions_list = RecipeDirection.getDirectionsForRecipe(recipeID)
    """

    def __init__(self, recipeID, stepNumber, stepDescription):
        """
        Initializes a RecipeDirection object with the provided attributes.
        """
        self.recipeID = recipeID
        self.stepNumber = stepNumber
        self.stepDescription = stepDescription

    @staticmethod
    def getDirectionsForRecipe(recipeID: int):
        """
        Retrieves a list of RecipeDirection objects for a given recipe ID.

        Args:
            recipeID (int): The ID of the recipe for which directions are retrieved.

        Returns:
            list: A list of RecipeDirection objects representing the recipe's directions.
        """
        # Use placeholders for parameters in the SQL query and pass parameters separately
        query = """
        SELECT *
        FROM \"RecipeHasSteps\"
        WHERE \"recipeID\" = :recipeID
        """

        # Use the execute method with parameter binding
        rows = app.db.execute(query, recipeID=recipeID)
        print(rows)
        return (
            [
                RecipeDirection(row.recipeID, row.stepNumber, row.stepDescription)
                for row in rows
            ]
            if rows
            else []
        )
