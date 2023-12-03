from flask import current_app as app
import json
from models.users import Users

class Recipes:
    def __init__(self, recipeID, postedByUserID, fullRecipeString, createdDate, title, caption, imageS3Filename="none", row_num=0, numLikes=0, userLiked=False):
        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.createdDate = createdDate
        self.title = title
        self.caption = caption
        self.imageS3Filename = imageS3Filename
        self.numLikes = numLikes
        self.userLiked = userLiked
        

    def to_feed_json(self):
        return {
            "id" : self.recipeID,
            "title" : self.title,
            "caption" : self.caption,
            "imageS3Filename" : self.imageS3Filename,
            "numLikes": self.numLikes,
            "userLiked": self.userLiked
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
    def get_by_term(term: str, paginated=False, pageNum=0):
        search_term = '%' + term + '%'
        rows = []
        if paginated:
            lower_limit = 8 * pageNum
            upper_limit = 8 * (pageNum + 1) -1
            rows = app.db.execute('''
                SELECT *
                FROM (
                    SELECT *, ROW_NUMBER() OVER (ORDER BY \"Recipes\".\"createdDate\" DESC) AS row_num
                    FROM \"Recipes\"
                    WHERE LOWER(title) LIKE(:term)
                ) AS ranked_posts
                WHERE row_num BETWEEN :lower_limit AND :upper_limit;
                              ''',
                              term=search_term,
                              lower_limit = lower_limit,
                              upper_limit = upper_limit)
        else:
            rows = app.db.execute(f'''
                SELECT *
                FROM \"Recipes\"
                WHERE LOWER(title) LIKE LOWER(:term)
                ''', 
                            term=search_term)
        
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
    
    @staticmethod
    def get_likes_info(recipeID: int):
        print("getting likes info")
        # Query for number of likes
        num_likes_results = app.db.execute('''
SELECT COUNT(*)
FROM \"Likes\"
WHERE \"postID\" = :recipeID
''',
                            recipeID=recipeID)
        num_likes = num_likes_results[0][0] if num_likes_results else 0
        print("num likes:", num_likes)

        # Check if User has liked message
        try:
            user_liked_recipe = Users.check_user_liked_recipe(recipeID)
            print("User liked recipe:", user_liked_recipe)
        except Exception as e:
            print("Error checking if user liked recipe:", e)
            user_liked_recipe = False
        return (num_likes, user_liked_recipe)
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
            ("added ingredients")

        except Exception as e:
            print(e)
            app.db.rollback()
            raise e
    
    @staticmethod
    def add_steps(recipeID, steps):
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
    
    @staticmethod
    def like_recipe(recipeID, userID):
        try:
            app.db.execute('''
                INSERT INTO \"Likes\"
                            VALUES (:recipeID, :userID)
                ''',
                            recipeID=recipeID,
                            userID=userID)
        except Exception as e:
            print(e)
            app.db.rollback()
            raise e
    
    @staticmethod
    def unlike_recipe(recipeID, userID):
        try:
            app.db.execute('''DELETE FROM \"Likes\"
                            WHERE \"postID\" = :recipeID AND \"likedByUserID\" = :userID
                ''',
                            recipeID=recipeID,
                            userID=userID)
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

