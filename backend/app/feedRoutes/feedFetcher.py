from flask import current_app as app
from models.recipes import Recipes, RecipeJSONEncoder
from models.users import Users
import json


class RecipeOnFeed:
    def __init__(
        self,
        recipeID,
        postedByUserID,
        fullRecipeString,
        createdDate,
        title,
        caption,
        imageS3Filename="none",
        firstName="",
        lastName="",
        profilePicS3Filename="",
        numLikes=0,
        userLiked=False,
        hours=0,
        minutes=0,
        isGlutenFree=False,
        isVegan=False,
        isHighProtein=False,
        isKidFriendly=False,
        isVegetarian=False,
        isKeto=False,
        isSpicy=False,
        isHealthy=False,
        isDairyFree=False,
        isNutFree=False,
    ):
        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.createdDate = createdDate
        self.title = title
        self.caption = caption
        self.imageS3Filename = imageS3Filename
        self.numLikes = numLikes
        self.userLiked = userLiked
        self.firstName = firstName
        self.lastName = lastName
        self.profilePicS3Filename = profilePicS3Filename

        self.hours = hours
        self.minutes = minutes

        # 'Gluten Free', 'Vegan', 'High Protein', 'Kid-Friendly', 'Vegetarian', 'Keto', 'Spicy', 'Healthy', 'Dairy-Free', 'Nut-Free',
        self.isGlutenFree = isGlutenFree
        self.isVegan = isVegan
        self.isHighProtein = isHighProtein
        self.isKidFriendly = isKidFriendly
        self.isVegetarian = isVegetarian
        self.isKeto = isKeto
        self.isSpicy = isSpicy
        self.isHealthy = isHealthy
        self.isDairyFree = isDairyFree
        self.isNutFree = isNutFree

    def to_feed_json(self):
        name = ""
        try:
            name = self.firstName + " " + self.lastName
        except: 
            name=""
        return {
            "recipeID": self.recipeID,
            "title": self.title,
            "caption": self.caption,
            "imageS3Filename": self.imageS3Filename,
            "numLikes": self.numLikes,
            "userLiked": self.userLiked,
            "postedByUserID": self.postedByUserID,
            "nameOfPoster": name,
            "profilePicS3Filename": self.profilePicS3Filename,
            "hours": self.hours,
            "minutes": self.minutes,
            "isGlutenFree": self.isGlutenFree,
            "isVegan": self.isVegan,
            "isHighProtein": self.isHighProtein,
            "isKidFriendly": self.isKidFriendly,
            "isVegetarian": self.isVegetarian,
            "isKeto": self.isKeto,
            "isSpicy": self.isSpicy,
            "isHealthy": self.isHealthy,
            "isDairyFree": self.isDairyFree,
            "isNutFree": self.isNutFree,
        }

    @staticmethod
    def add_likes_info(rows):
        recipe_info_list = []
        for row in rows:
            recipeID = row[0]

            likes_info = Recipes.get_likes_info(recipeID)
            num_likes = likes_info[0]
            user_liked = likes_info[1]

            recipe_info = RecipeOnFeed(*row, numLikes=num_likes, userLiked=user_liked)
            recipe_info_list.append(recipe_info)

        return recipe_info_list


class RecipeOnFeedJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, RecipeOnFeed):
            # Define how to serialize the object
            return obj.to_feed_json()
        return super(RecipeOnFeedSONEncoder, self).default(obj)


class FeedFetcher:
    def __init__(
        self,
        recipeID,
        postedByUserID,
        fullRecipeString,
        createdDate,
        title,
        caption,
        imageS3Filename="none",
        row_num=0,
        hours=0,
        minutes=0,
        isGlutenFree=False,
        isVegan=False,
        isHighProtein=False,
        isKidFriendly=False,
        isVegetarian=False,
        isKeto=False,
        isSpicy=False,
        isHealthy=False,
        isDairyFree=False,
        isNutFree=False,
    ):
        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.createdDate = createdDate
        self.title = title
        self.caption = caption
        self.imageS3Filename = imageS3Filename

        self.hours = hours
        self.minutes = minutes

        # 'Gluten Free', 'Vegan', 'High Protein', 'Kid-Friendly', 'Vegetarian', 'Keto', 'Spicy', 'Healthy', 'Dairy-Free', 'Nut-Free',
        self.isGlutenFree = isGlutenFree
        self.isVegan = isVegan
        self.isHighProtein = isHighProtein
        self.isKidFriendly = isKidFriendly
        self.isVegetarian = isVegetarian
        self.isKeto = isKeto
        self.isSpicy = isSpicy
        self.isHealthy = isHealthy
        self.isDairyFree = isDairyFree
        self.isNutFree = isNutFree

    @staticmethod
    def get_x_most_recent(x: int):
        rows = app.db.execute(
            """
            SELECT *
            FROM "Recipes"
            ORDER BY "Recipes"."createdDate" DESC
            LIMIT :x
            """,
            x=x,
        )

        recipe_info_list = RecipeOnFeed.add_likes_info(rows)

        return recipe_info_list

    def get_ith_set_of_most_recent_feed_recipes(i: int):
        lower_limit = 8 * i
        upper_limit = 8 * (i + 1) - 1
        rows = app.db.execute(
            """
            WITH \"PostsToReturn\" AS (
                SELECT *
                FROM (
                    SELECT *, ROW_NUMBER() OVER (ORDER BY "Recipes"."createdDate" DESC) AS row_num
                    FROM "Recipes"
                ) AS ranked_posts
                WHERE row_num BETWEEN :lower_limit AND :upper_limit
            )
            SELECT \"recipeID\", \"postedByUserID\", \"fullRecipeString\", \"createdDate\", \"title\", \"caption\", \"imageS3Filename\", \"firstName\", \"lastName\", \"profilePicS3Filename\"
            FROM \"PostsToReturn\"
            INNER JOIN \"Users\"
            ON \"PostsToReturn\".\"postedByUserID\" = \"Users\".\"uid\"
                              """,
            lower_limit=lower_limit,
            upper_limit=upper_limit,
        )

        recipe_info_list = RecipeOnFeed.add_likes_info(rows)

        return recipe_info_list

    def get_ith_set_of_most_recent_feed_recipes_from_ppl_you_follow(i: int):
        uid = Users.get_current_user_id()
        #uid = 19
        lower_limit = 8 * i
        upper_limit = 8 * (i + 1) - 1
        rows = app.db.execute(
            """
            WITH \"PostsToReturn\" AS (
                SELECT \"recipeID\", \"postedByUserID\", \"fullRecipeString\", \"createdDate\", \"title\", \"caption\", \"imageS3Filename\"
                FROM (
                    SELECT *, ROW_NUMBER() OVER (ORDER BY \"Recipes\".\"createdDate\" DESC) AS \"row_num\"
                    FROM "Recipes"
                    INNER JOIN (
                        SELECT \"followedID\"
                        FROM \"Follows\"
                        WHERE \"followerID\" = :uid
                        ) AS \"MyFollowing\"
                    ON \"Recipes\".\"postedByUserID\" = \"MyFollowing\".\"followedID\"
                ) AS ranked_posts
                WHERE \"row_num\" BETWEEN :lower_limit AND :upper_limit
            ) 
            SELECT \"recipeID\", \"postedByUserID\", \"fullRecipeString\", \"createdDate\", \"title\", \"caption\", \"imageS3Filename\", \"firstName\", \"lastName\", \"profilePicS3Filename\"
            FROM \"PostsToReturn\"
            INNER JOIN \"Users\"
            ON \"PostsToReturn\".\"postedByUserID\" = \"Users\".\"uid\"

                              """,
            uid=uid,
            lower_limit=lower_limit,
            upper_limit=upper_limit,
        )

        recipe_info_list = RecipeOnFeed.add_likes_info(rows)

        return recipe_info_list
