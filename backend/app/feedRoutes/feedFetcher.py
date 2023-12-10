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
        """
        Initialize a RecipeOnFeed object.

        Args:
            recipeID (int): The unique identifier of the recipe.
            postedByUserID (int): The user ID of the user who posted the recipe.
            fullRecipeString (str): The full recipe string.
            createdDate (str): The creation date of the recipe.
            title (str): The title of the recipe.
            caption (str): The caption or description of the recipe.
            imageS3Filename (str, optional): The filename of the recipe image. Defaults to "none".
            firstName (str, optional): The first name of the user who posted the recipe. Defaults to an empty string.
            lastName (str, optional): The last name of the user who posted the recipe. Defaults to an empty string.
            profilePicS3Filename (str, optional): The filename of the user's profile picture. Defaults to an empty string.
            numLikes (int, optional): The number of likes the recipe has received. Defaults to 0.
            userLiked (bool, optional): Indicates whether the current user has liked the recipe. Defaults to False.
            hours (int, optional): The number of hours required to prepare the recipe. Defaults to 0.
            minutes (int, optional): The number of minutes required to prepare the recipe. Defaults to 0.
            isGlutenFree (bool, optional): Indicates if the recipe is gluten-free. Defaults to False.
            isVegan (bool, optional): Indicates if the recipe is vegan. Defaults to False.
            isHighProtein (bool, optional): Indicates if the recipe is high in protein. Defaults to False.
            isKidFriendly (bool, optional): Indicates if the recipe is kid-friendly. Defaults to False.
            isVegetarian (bool, optional): Indicates if the recipe is vegetarian. Defaults to False.
            isKeto (bool, optional): Indicates if the recipe is keto-friendly. Defaults to False.
            isSpicy (bool, optional): Indicates if the recipe is spicy. Defaults to False.
            isHealthy (bool, optional): Indicates if the recipe is healthy. Defaults to False.
            isDairyFree (bool, optional): Indicates if the recipe is dairy-free. Defaults to False.
            isNutFree (bool, optional): Indicates if the recipe is nut-free. Defaults to False.

        """
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
        """
        Convert the RecipeOnFeed object to a JSON representation.

        Returns:
            dict: A JSON dictionary representing the RecipeOnFeed object.
        """
        name = ""
        if type(self.firstName) == "str" and type(self.lastName) == "str":
            name = self.firstName + " " + self.lastName
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
        """
        Add like information to a list of rows containing recipe information.

        Args:
            rows (list): A list of rows containing recipe information.

        Returns:
            list: A list of RecipeOnFeed objects with added like information.
        """
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
        """
        Serialize a Python object to a JSON-formatted string.

        Args:
            obj (Any): The Python object to serialize.

        Returns:
            str: A JSON-formatted string representing the serialized object.
        """
        if isinstance(obj, RecipeOnFeed):
            # Define how to serialize the object
            return obj.to_feed_json()
        return super(RecipeOnFeedJSONEncoder, self).default(obj)


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
        """
        Initialize a FeedFetcher object.

        Args:
            recipeID (int): The unique identifier of the recipe.
            postedByUserID (int): The user ID of the user who posted the recipe.
            fullRecipeString (str): The full recipe string.
            createdDate (str): The creation date of the recipe.
            title (str): The title of the recipe.
            caption (str): The caption or description of the recipe.
            imageS3Filename (str, optional): The filename of the recipe image. Defaults to "none".
            row_num (int, optional): The row number. Defaults to 0.
            hours (int, optional): The number of hours required to prepare the recipe. Defaults to 0.
            minutes (int, optional): The number of minutes required to prepare the recipe. Defaults to 0.
            isGlutenFree (bool, optional): Indicates if the recipe is gluten-free. Defaults to False.
            isVegan (bool, optional): Indicates if the recipe is vegan. Defaults to False.
            isHighProtein (bool, optional): Indicates if the recipe is high in protein. Defaults to False.
            isKidFriendly (bool, optional): Indicates if the recipe is kid-friendly. Defaults to False.
            isVegetarian (bool, optional): Indicates if the recipe is vegetarian. Defaults to False.
            isKeto (bool, optional): Indicates if the recipe is keto-friendly. Defaults to False.
            isSpicy (bool, optional): Indicates if the recipe is spicy. Defaults to False.
            isHealthy (bool, optional): Indicates if the recipe is healthy. Defaults to False.
            isDairyFree (bool, optional): Indicates if the recipe is dairy-free. Defaults to False.
            isNutFree (bool, optional): Indicates if the recipe is nut-free. Defaults to False.

        """
        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.createdDate = createdDate
        self.title = title
        self.caption = caption
        self.imageS3Filename = imageS3Filename
        self.hours = hours
        self.minutes = minutes
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
        """
        Retrieve a list of the most recent recipes.

        Args:
            x (int): The number of recipes to retrieve.

        Returns:
            list: A list of RecipeOnFeed objects representing the most recent recipes.
        """
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
        """
        Retrieve a specific set of the most recent feed recipes.

        Args:
            i (int): The index of the set to retrieve.

        Returns:
            list: A list of RecipeOnFeed objects representing the specified set of recipes.
        """
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
        """
        Retrieve a specific set of the most recent feed recipes from people you follow.

        Args:
            i (int): The index of the set to retrieve.

        Returns:
            list: A list of RecipeOnFeed objects representing the specified set of recipes from people you follow.
        """

        uid = Users.get_current_user_id()
        # uid = 19
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
