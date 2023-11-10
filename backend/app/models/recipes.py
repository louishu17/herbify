from flask import current_app as app
import json

class Recipes:
    def __init__(self, recipeID, postedByUserID, fullRecipeString, createdDate, title, caption, imageS3Filename="none", row_num=0):
        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.createdDate = createdDate
        self.title = title
        self.caption = caption
        self.imageS3Filename = imageS3Filename
        

    def to_feed_json(self):
        return {
            "id" : self.recipeID,
            "title" : self.title,
            "caption" : self.caption,
            "imageS3Filename" : self.imageS3Filename
        }
    
    def to_json_recipe(self):
        return {
            "recipeID" : self.recipeID,
            "postedByUserID" : self.postedByUserID,
            "createdDate" : self.createdDate,
            "title" : self.title,
            "caption" : self.caption,
            "imageS3Filename": self.imageS3Filename
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
    def get_by_term(term: str):
        search_term = '%' + term + '%'
        rows = app.db.execute(f'''
SELECT *
FROM \"Recipes\"
WHERE LOWER(title) LIKE LOWER(:term)
''', 
                        term=search_term)
        print("rows are " + str(rows))
        return [Recipes(*row) for row in rows]
    
    
    @staticmethod
    def get_by_user(uid: int):
        print('getting by user ' + str(uid))
        rows = app.db.execute(f'''
SELECT *
FROM \"Recipes\"
WHERE \"postedByUserID\" = :uid
''', 
                        uid=uid)
        print(rows)
        print("rows are " + str(rows))
        return [Recipes(*row) for row in rows]

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
    
    def get_ith_set_of_feed_recipes(i : int):
        lower_limit = 8 * i
        upper_limit = 8 * (i + 1)
        rows = app.db.execute('''
SELECT *
FROM (
    SELECT *, ROW_NUMBER() OVER (ORDER BY "Recipes"."createdDate" DESC) AS row_num
    FROM "Recipes"
) AS ranked_posts
WHERE row_num BETWEEN :lower_limit AND :upper_limit;
                              ''',
                              lower_limit = lower_limit,
                              upper_limit = upper_limit)
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
    def add_recipe(recipeID, postedByUserID, createdDate, title, caption, imageS3Filename):
        print('adding recipe')

        try:
            app.db.execute('''
            INSERT INTO \"Recipes\"
                        VALUES (:recipeID, :postedByUserID, :fullRecipeString, :createdDate, :title, :caption, :imageS3Filename)
            ''',
                           recipeID=recipeID,
                           postedByUserID=postedByUserID,
                           fullRecipeString="Cheeseburgers",
                           createdDate=createdDate,
                           title=title,
                           caption=caption,
                           imageS3Filename=imageS3Filename)
            print("added recipe")
        except Exception as e:
            print(e)
            app.db.rollback()
            raise e
    
    @staticmethod
    def add_ingredients(recipeID, ingredients):
        print('adding ingredients')
        try:
            for ingredient in ingredients:
                app.db.execute('''
                    INSERT INTO \"RecipeHasIngredients\"
                                VALUES (:recipeID, :ingredient)
                    ''',
                                recipeID=recipeID,
                                ingredient=ingredient)
            print("added ingredients")

        except Exception as e:
            print(e)
            app.db.rollback()
            raise e
    
    @staticmethod
    def add_steps(recipeID, steps):
        print('adding steps')
        try:
            for i, step in enumerate(steps):
                app.db.execute('''
                    INSERT INTO \"RecipeHasSteps\"
                                VALUES (:recipeID, :stepNum, :step)
                    ''',
                                recipeID=recipeID,
                                stepNum=i,
                                step=step)
            print("added steps")
        except Exception as e:
            print(e)
            app.db.rollback()
            raise e
        


class RecipeJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Recipes):
            # Define how to serialize the object
            return obj.to_feed_json()
        return super(RecipeJSONEncoder, self).default(obj)

