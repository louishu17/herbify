from flask import current_app as app
import json
from models.users import Users


class Recipes:
    """
    Represents a recipe along with its attributes and related database operations.

    Attributes:
        recipeID (int): The unique identifier for the recipe.
        postedByUserID (int): The user ID of the user who posted the recipe.
        fullRecipeString (str): The full text description of the recipe.
        createdDate (datetime): The date and time when the recipe was created.
        title (str): The title of the recipe.
        caption (str): A short description or caption for the recipe.
        imageS3Filename (str): The filename of the recipe's image.
        hours (int): The number of hours required to prepare the recipe (default is 0).
        minutes (int): The number of minutes required to prepare the recipe (default is 0).
        numLikes (int): The number of likes the recipe has received (default is 0).
        userLiked (bool): Indicates whether the currently authenticated user has liked the recipe (default is False).
        isGlutenFree (bool): Indicates whether the recipe is gluten-free (default is False).
        isVegan (bool): Indicates whether the recipe is vegan (default is False).
        isHighProtein (bool): Indicates whether the recipe is high in protein (default is False).
        isKidFriendly (bool): Indicates whether the recipe is kid-friendly (default is False).
        isVegetarian (bool): Indicates whether the recipe is vegetarian (default is False).
        isKeto (bool): Indicates whether the recipe is keto-friendly (default is False).
        isSpicy (bool): Indicates whether the recipe is spicy (default is False).
        isHealthy (bool): Indicates whether the recipe is considered healthy (default is False).
        isDairyFree (bool): Indicates whether the recipe is dairy-free (default is False).
        isNutFree (bool): Indicates whether the recipe is nut-free (default is False).

    Methods:
        to_json_recipe():
            Converts the recipe object to a JSON representation.

        get(recipeID: int):
            Retrieves a recipe object by its ID.

        get_by_term(term: str, filters: [], paginated=False, pageNum=0):
            Retrieves recipes that match a search term, optionally paginated and optionally filtered by tag.

        get_by_user(uid: int):
            Retrieves recipes posted by a specific user.

        get_x_most_recent(x: int):
            Retrieves the x most recent recipes.

        get_likes_info(recipeID: int):
            Retrieves information about the number of likes and whether the user has liked the recipe.

        get_last_recipe_id():
            Retrieves the ID of the last recipe added to the database.

        add_recipe(...):
            Adds a new recipe to the database.

        add_ingredients(recipeID, ingredients):
            Adds ingredients to a recipe.

        add_steps(recipeID, steps):
            Adds steps to a recipe.

        like_recipe(recipeID, userID):
            Records that a user has liked a recipe.

        unlike_recipe(recipeID, userID):
            Removes a user's like from a recipe.

        rate_recipe(recipeID, userID, rating):
            Records a user's rating for a recipe.

        get_user_liked_recipes(user_id: int):
            Retrieves recipes liked by a user.
    """

    def __init__(
        self,
        recipeID,
        postedByUserID,
        fullRecipeString,
        createdDate,
        title,
        caption,
        imageS3Filename="none",
        hours=0,
        minutes=0,
        row_num=0,
        numLikes=0,
        userLiked=False,
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
        Initializes a Recipes object with the provided attributes.
        """

        self.recipeID = recipeID
        self.postedByUserID = postedByUserID
        self.createdDate = createdDate
        self.title = title
        self.caption = caption
        self.imageS3Filename = imageS3Filename

        self.hours = hours
        self.minutes = minutes

        self.numLikes = numLikes
        self.userLiked = userLiked

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

    def to_json_recipe(self):
        """
        Converts the recipe object to a JSON representation.

        Returns:
            dict: A dictionary containing the recipe's attributes in JSON format.
        """

        return {
            "recipeID": self.recipeID,
            "postedByUserID": self.postedByUserID,
            "createdDate": self.createdDate,
            "title": self.title,
            "caption": self.caption,
            "imageS3Filename": self.imageS3Filename,
        }

    @staticmethod
    def get(recipeID: int):
        """
        Retrieves a recipe object by its ID.

        Args:
            recipeID (int): The unique ID of the recipe to retrieve.

        Returns:
            Recipes: A Recipes object representing the retrieved recipe or None if not found.
        """

        rows = app.db.execute(
            """
SELECT *
FROM \"Recipes\"
WHERE recipeID = :recipeID
""",
            id=recipeID,
        )
        return Recipes(*(rows[0])) if rows else None

    @staticmethod
    def get_by_term(term: str, filters=None, paginated=False, pageNum=0):
        """
        Retrieves recipes that match a search term, optionally filtered and paginated.

        Args:
            term (str): The search term to match recipes.
            filters (list of str, optional): List of filters to apply. Defaults to None.
            paginated (bool, optional): If True, paginates the results. Defaults to False.
            pageNum (int, optional): The page number for paginated results. Defaults to 0.

        Returns:
            list: A list of Recipes objects representing the matching recipes.
        """

        search_term = "%" + term + "%"
        rows = []

        # Define a dictionary to map filters to their corresponding database columns
        filter_mapping = {
            "Vegan": "isVegan",
            "Gluten-Free": "isGlutenFree",
            "High-Protein": "isHighProtein",
            "Keto": "isKeto",
            "Kid-Friendly": "isKidFriendly",
            "Nut-Free": "isNutFree",
            "Spicy": "isSpicy",
            "Vegetarian": "isVegetarian",
        }

        # Build the SQL query dynamically based on selected filters
        query = f"""
            SELECT *
            FROM \"Recipes\"
            WHERE LOWER(title) LIKE LOWER(:term)
        """

        if filters:
            # Add filter conditions to the query
            filter_conditions = []
            for filter_option in filters:
                if filter_option in filter_mapping:
                    column_name = filter_mapping[filter_option]
                    filter_conditions.append(f"CAST({column_name} AS BOOLEAN) = TRUE")

            if filter_conditions:
                query += " AND " + " AND ".join(filter_conditions)

        if paginated:
            lower_limit = 8 * pageNum
            upper_limit = 8 * (pageNum + 1) - 1
            query = f"""
                SELECT *
                FROM (
                    SELECT *, ROW_NUMBER() OVER (ORDER BY \"createdDate\" DESC) AS row_num
                    FROM ({query}) AS filtered_recipes
                ) AS ranked_posts
                WHERE row_num BETWEEN :lower_limit AND :upper_limit;
            """

            rows = app.db.execute(
                query,
                term=search_term,
                lower_limit=lower_limit,
                upper_limit=upper_limit,
            )

        else:
            rows = app.db.execute(query, term=search_term)

        return [Recipes(*row) for row in rows]

    @staticmethod
    def get_by_user(uid: int):
        """
        Retrieves recipes posted by a specific user.

        Args:
            uid (int): The user ID of the user whose recipes to retrieve.

        Returns:
            list: A list of Recipes objects representing the user's recipes.
        """

        print("getting by user " + str(uid))
        rows = app.db.execute(
            f"""
SELECT *
FROM \"Recipes\"
WHERE \"postedByUserID\" = :uid
""",
            uid=uid,
        )
        return [Recipes(*row) for row in rows]

    @staticmethod
    def get_x_most_recent(x: int):
        """
        Retrieves the x most recent recipes.

        Args:
            x (int): The number of most recent recipes to retrieve.

        Returns:
            list: A list of Recipes objects representing the most recent recipes.
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
        return [Recipes(*row) for row in rows]

    @staticmethod
    def get_likes_info(recipeID: int):
        """
        Retrieves information about the number of likes and whether the user has liked the recipe.

        Args:
            recipeID (int): The ID of the recipe for which to retrieve like information.

        Returns:
            tuple: A tuple containing the number of likes and a boolean indicating whether the user has liked the recipe.
        """

        # Query for number of likes
        num_likes_results = app.db.execute(
            """
SELECT COUNT(*)
FROM \"Likes\"
WHERE \"postID\" = :recipeID
""",
            recipeID=recipeID,
        )
        num_likes = num_likes_results[0][0] if num_likes_results else 0

        # Check if User has liked message
        try:
            user_liked_recipe = Users.check_user_liked_recipe(recipeID)
        except Exception as e:
            user_liked_recipe = False
        return (num_likes, user_liked_recipe)

    @staticmethod
    def get_last_recipe_id():
        """
        Retrieves the ID of the last recipe added to the database.

        Returns:
            int: The ID of the last recipe added or None if no recipes exist.
        """

        print("getting last recipe id")
        max_recipe_id = app.db.execute(
            """
        SELECT MAX("recipeID")
        FROM "Recipes"
        """
        )
        return max_recipe_id[0][0] if max_recipe_id[0][0] else None

    @staticmethod
    def add_recipe(
        recipeID,
        postedByUserID,
        createdDate,
        title,
        caption,
        imageS3Filename,
        hours,
        minutes,
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
        Adds a new recipe to the database.

        Args:
            recipeID (int): The unique ID of the recipe.
            postedByUserID (int): The user ID of the user who posted the recipe.
            createdDate: The date and time when the recipe was created.
            title (str): The title of the recipe.
            caption (str): A short description or caption for the recipe.
            imageS3Filename (str): The filename of the recipe's image.
            hours (int): The number of hours required to prepare the recipe.
            minutes (int): The number of minutes required to prepare the recipe.
            isGlutenFree (bool, optional): Indicates whether the recipe is gluten-free. Defaults to False.
            isVegan (bool, optional): Indicates whether the recipe is vegan. Defaults to False.
            isHighProtein (bool, optional): Indicates whether the recipe is high in protein. Defaults to False.
            isKidFriendly (bool, optional): Indicates whether the recipe is kid-friendly. Defaults to False.
            isVegetarian (bool, optional): Indicates whether the recipe is vegetarian. Defaults to False.
            isKeto (bool, optional): Indicates whether the recipe is keto-friendly. Defaults to False.
            isSpicy (bool, optional): Indicates whether the recipe is spicy. Defaults to False.
            isHealthy (bool, optional): Indicates whether the recipe is considered healthy. Defaults to False.
            isDairyFree (bool, optional): Indicates whether the recipe is dairy-free. Defaults to False.
            isNutFree (bool, optional): Indicates whether the recipe is nut-free. Defaults to False.
        """

        print("adding recipe")

        try:
            app.db.execute(
                """
            INSERT INTO \"Recipes\"
                        VALUES (:recipeID, :postedByUserID, :fullRecipeString, :createdDate, :title, :caption, :imageS3Filename, :isGlutenFree, :isVegan, :isHighProtein, :isKidFriendly, :isVegetarian, :isKeto, :isSpicy, :isHealthy, :isDairyFree, :isNutFree, :hours, :minutes)
            """,
                recipeID=recipeID,
                postedByUserID=postedByUserID,
                fullRecipeString="Cheeseburgers",
                createdDate=createdDate,
                title=title,
                caption=caption,
                imageS3Filename=imageS3Filename,
                isGlutenFree=isGlutenFree,
                isVegan=isVegan,
                isHighProtein=isHighProtein,
                isKidFriendly=isKidFriendly,
                isVegetarian=isVegetarian,
                isKeto=isKeto,
                isSpicy=isSpicy,
                isHealthy=isHealthy,
                isDairyFree=isDairyFree,
                isNutFree=isNutFree,
                hours=hours,
                minutes=minutes,
            )
            print("added recipe")
        except Exception as e:
            print(e)
            app.db.rollback()
            raise e

    @staticmethod
    def add_ingredients(recipeID, ingredients):
        """
        Adds ingredients to a recipe.

        Args:
            recipeID (int): The ID of the recipe to which ingredients are added.
            ingredients (list): A list of ingredient names or descriptions to be added.
        """

        print("adding ingredients")
        try:
            for ingredient in ingredients:
                app.db.execute(
                    """
                    INSERT INTO \"RecipeHasIngredients\"
                                VALUES (:recipeID, :ingredient)
                    """,
                    recipeID=recipeID,
                    ingredient=ingredient,
                )
            ("added ingredients")

        except Exception as e:
            print(e)
            app.db.rollback()
            raise e

    @staticmethod
    def add_steps(recipeID, steps):
        """
        Adds steps to a recipe.

        Args:
            recipeID (int): The ID of the recipe to which steps are added.
            steps (list): A list of recipe steps or instructions to be added.
        """

        try:
            for i, step in enumerate(steps):
                app.db.execute(
                    """
                    INSERT INTO \"RecipeHasSteps\"
                                VALUES (:recipeID, :stepNum, :step)
                    """,
                    recipeID=recipeID,
                    stepNum=i,
                    step=step,
                )
            print("added steps")
        except Exception as e:
            print(e)
            app.db.rollback()
            raise e

    @staticmethod
    def like_recipe(recipeID, userID):
        """
        Records that a user has liked a recipe.

        Args:
            recipeID (int): The ID of the recipe to be liked.
            userID (int): The ID of the user who likes the recipe.
        """

        try:
            app.db.execute(
                """
                INSERT INTO \"Likes\"
                            VALUES (:recipeID, :userID)
                """,
                recipeID=recipeID,
                userID=userID,
            )
        except Exception as e:
            print(e)
            app.db.rollback()
            raise e

    @staticmethod
    def unlike_recipe(recipeID, userID):
        """
        Removes a user's like from a recipe.

        Args:
            recipeID (int): The ID of the recipe from which the like is removed.
            userID (int): The ID of the user whose like is removed.
        """

        try:
            print("db unliking recipe")
            try:
                app.db.execute(
                    """DELETE FROM \"Likes\"
                                WHERE \"postID\" = :recipeID AND \"likedByUserID\" = :userID
                    """,
                    recipeID=recipeID,
                    userID=userID,
                )
            except Exception as e:
                print(e)
                app.db.rollback()
                raise e
            print("db unliked recipe")
        except Exception as e:
            print(e)
            app.db.rollback()
            raise e

    @staticmethod
    def rate_recipe(recipeID, userID, rating):
        """
        Records a user's rating for a recipe.

        Args:
            recipeID (int): The ID of the recipe to be rated.
            userID (int): The ID of the user who rates the recipe.
            rating (int): The user's rating score for the recipe.
        """

        try:
            app.db.execute(
                """
                INSERT INTO "Ratings" (\"RecipeID\", \"RatedByUserID\", \"rating\")
                VALUES (:recipeID, :userID, :rating)
                ON CONFLICT (\"RecipeID\", \"RatedByUserID\")
                DO UPDATE SET \"rating\" = :rating
                """,
                recipeID=recipeID,
                userID=userID,
                rating=rating,
            )
            print("rated recipe")
        except Exception as e:
            print(e)
            app.db.rollback()
            raise e

    @staticmethod
    def get_user_liked_recipes(user_id: int):
        """
        Retrieves recipes liked by a user.

        Args:
            user_id (int): The user ID of the user whose liked recipes are retrieved.

        Returns:
            list: A list of dictionaries containing information about liked recipes.
        """

        # Select post id from Likes and then select the recipe from the Recipes table

        if user_id is not None:
            rows = app.db.execute(
                """
    SELECT *
    FROM \"Recipes\"
    WHERE \"recipeID\" IN (SELECT \"postID\" FROM \"Likes\" WHERE \"likedByUserID\" = :userID)
                                  """,
                userID=user_id,
            )

            return (
                [
                    {
                        "title": recipe.title,
                        "caption": recipe.caption,
                        "imageS3Filename": recipe.imageS3Filename,
                        "recipeID": recipe.recipeID,
                        "postedByUserID": recipe.postedByUserID,
                    }
                    for recipe in rows
                ]
                if rows
                else [None]
            )

        return []


class RecipeJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Recipes):
            # Define how to serialize the object
            return obj.to_json_recipe()
        return super(RecipeJSONEncoder, self).default(obj)
