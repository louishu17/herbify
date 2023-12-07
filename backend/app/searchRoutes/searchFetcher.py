from flask import current_app as app
from models.recipes import Recipes, RecipeJSONEncoder
from models.users import Users
import json


class SearchFetcher:

    @staticmethod
    def get_by_ingredient_term(term: str, paginated=False, pageNum=0):
        search_term = '%' + term + '%'
        rows = []
        if paginated:
            lower_limit = 8 * pageNum
            upper_limit = 8 * (pageNum + 1) -1
            rows = app.db.execute('''
                SELECT * 
                FROM (
                    SELECT *, ROW_NUMBER() OVER (ORDER BY \"createdDate\" DESC) AS row_num
                    FROM (
                        SELECT DISTINCT \"Recipes\".\"recipeID\", \"postedByUserID\", \"fullRecipeString\", \"createdDate\", \"title\", \"caption\", \"imageS3Filename\"
                        FROM \"RecipeHasIngredients\"
                        INNER JOIN \"Recipes\"
                        ON \"RecipeHasIngredients\".\"recipeID\" = \"Recipes\".\"recipeID\"
                        WHERE LOWER(\"ingredient\") LIKE(:term)
                    ) AS \"RecipeIDs\"          
                ) AS \"Recipes\"
                WHERE \"row_num\" BETWEEN :lower_limit AND :upper_limit
          
                
                              ''',
                              term=search_term,
                              lower_limit = lower_limit,
                              upper_limit = upper_limit)
            print("rows are")
            print(rows)

        
        return [Recipes(*row) for row in rows]

    

    







