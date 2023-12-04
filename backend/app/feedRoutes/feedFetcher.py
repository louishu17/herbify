from flask import current_app as app
from models.recipes import Recipes, RecipeJSONEncoder
from models.users import Users
import json

class FeedFetcher:
    def __init__(self, recipeID, postedByUserID, fullRecipeString, createdDate, title, caption, imageS3Filename="none", row_num=0):
        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.createdDate = createdDate
        self.title = title
        self.caption = caption
        self.imageS3Filename = imageS3Filename
        

    @staticmethod
    def get_x_most_recent(x: int):
        rows = app.db.execute('''
            SELECT *
            FROM "Recipes"
            ORDER BY "Recipes"."createdDate" DESC
            LIMIT :x
            ''',
                              x=x)

        recipe_info_list = []
        for row in rows:
            recipeID = row[0]

            likes_info = Recipes.get_likes_info(recipeID)
            num_likes = likes_info[0]
            user_liked = likes_info[1]
            recipe_info = Recipes(*row, numLikes=num_likes, userLiked=user_liked)
            recipe_info_list.append(recipe_info)

        return recipe_info_list
    
    def get_ith_set_of_most_recent_feed_recipes(i : int):
        lower_limit = 8 * i
        upper_limit = 8 * (i + 1) -1
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

        recipe_info_list = []
        for row in rows:
            recipeID = row[0]

            likes_info = Recipes.get_likes_info(recipeID)
            num_likes = likes_info[0]
            user_liked = likes_info[1]
            recipe_info = Recipes(*row, numLikes=num_likes, userLiked=user_liked)
            recipe_info_list.append(recipe_info)

        return recipe_info_list

    def get_ith_set_of_most_recent_feed_recipes_from_ppl_you_follow(i : int):
        uid = Users.get_current_user_id()
        lower_limit = 8 * i
        upper_limit = 8 * (i + 1) -1
        rows = app.db.execute('''
            SELECT \"recipeID\", \"postedByUserID\", \"fullRecipeString\", \"createdDate\", \"title\", \"caption\", \"imageS3Filename\"
            FROM (
                SELECT *, ROW_NUMBER() OVER (ORDER BY "Recipes"."createdDate" DESC) AS row_num
                FROM "Recipes"
                INNER JOIN (
                    SELECT \"followedID\"
                    FROM \"Follows\"
                    WHERE \"followerID\" = :uid
                    ) AS \"MyFollowing\"
                ON \"Recipes\".\"postedByUserID\" = \"MyFollowing\".\"followedID\"
            ) AS ranked_posts
            WHERE row_num BETWEEN :lower_limit AND :upper_limit;
                              ''',
                              uid = uid,
                              lower_limit = lower_limit,
                              upper_limit = upper_limit)

        recipe_info_list = []
        for row in rows:
            recipeID = row[0]

            likes_info = Recipes.get_likes_info(recipeID)
            num_likes = likes_info[0]
            user_liked = likes_info[1]

            recipe_info = Recipes(*row, numLikes=num_likes, userLiked=user_liked)
            recipe_info_list.append(recipe_info)

        return recipe_info_list
    

    







