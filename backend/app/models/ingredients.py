from flask import current_app as app
import json


class RecipeIngredient:
    """
    Represents an ingredient used in a recipe.

    Attributes:
        recipeID (int): The ID of the recipe to which this ingredient belongs.
        ingredient (str): The name or description of the ingredient.

    Methods:
        getIngredientsForRecipe(recipeID: int):
            Retrieves a list of RecipeIngredient objects for a given recipe ID.

    Usage:
        # Create a new RecipeIngredient object
        ingredient = RecipeIngredient(recipeID, ingredient)

        # Retrieve a list of ingredients for a specific recipe
        ingredients_list = RecipeIngredient.getIngredientsForRecipe(recipeID)
    """

    def __init__(self, recipeID, ingredient):
        """
        Initializes a RecipeIngredient object with the provided attributes.
        """
        self.recipeID = recipeID
        self.ingredient = ingredient

    @staticmethod
    def getIngredientsForRecipe(recipeID: int):
        """
        Retrieves a list of RecipeIngredient objects for a given recipe ID.

        Args:
            recipeID (int): The ID of the recipe for which ingredients are retrieved.

        Returns:
            list: A list of RecipeIngredient objects representing the recipe's ingredients.
        """
        # Use placeholders for parameters in the SQL query and pass parameters separately
        query = """
        SELECT *
        FROM \"RecipeHasIngredients\"
        WHERE \"recipeID\" = :recipeID
        """

        # Use the execute method with parameter binding
        rows = app.db.execute(query, recipeID=recipeID)
        print(rows)
        return (
            [RecipeIngredient(row.recipeID, row.ingredient) for row in rows]
            if rows
            else []
        )
