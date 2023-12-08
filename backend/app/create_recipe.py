from flask import Blueprint, request, jsonify, session
from models.recipes import Recipes
from models.users import Users
from datetime import datetime
from flask_cors import cross_origin
import json
import boto3
import random

s3 = boto3.client(
    "s3",
    aws_access_key_id="AKIAU27D2SNFHMEYHDEU",
    aws_secret_access_key="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",
    region_name="us-east-1",
)

create_recipe_blueprint = Blueprint("create-recipe", __name__)


@create_recipe_blueprint.route("/create-recipe", methods=["POST"])
@cross_origin(supports_credentials=True)
def create_recipe():
    print("creating recipe")
    try:
        non_image_data = request.form["nonImageData"]
        recipe_data = json.loads(non_image_data)

        title = recipe_data["title"]
        caption = recipe_data["caption"]
        ingredients = recipe_data["ingredients"]
        steps = recipe_data["steps"]

        hours = recipe_data["hours"]
        minutes = recipe_data["minutes"]

        tags = set(recipe_data["tags"])

        # tags
        isGlutenFree = "Gluten Free" in tags
        isVegan = "Vegan" in tags
        isHighProtein = "High Protein" in tags
        isKidFriendly = "Kid-Friendly" in tags
        isVegetarian = "Vegetarian" in tags
        isKeto = "Keto" in tags
        isSpicy = "Spicy" in tags
        isHealthy = "Healthy" in tags
        isDairyFree = "Dairy-Free" in tags
        isNutFree = "Nut-Free" in tags

        last_recipe_id = Recipes.get_last_recipe_id()
        new_recipe_id = 1 if not last_recipe_id else last_recipe_id + 1

        if "user" not in session:
            print("User not in session")
            return jsonify({"message": "You must be logged in to create a recipe"}), 401

        user_email = session["user"]
        user = Users.get(user_email)
        userID = user.uid

        last_recipe_id = Recipes.get_last_recipe_id()
        new_recipe_id = 1 if not last_recipe_id else last_recipe_id + 1

        # Get the uploaded image file
        imageS3Filename = "none"
        if "imageFile" in request.files:
            image_file = request.files["imageFile"]

            imageS3Filename = (
                "recipes/recipe-"
                + str(new_recipe_id)
                + "-"
                + str(int(random.random() * 10000))
                + "."
                + image_file.filename.split(".")[-1]
            )
            s3.upload_fileobj(image_file, "herbify-images", imageS3Filename)

        Recipes.add_recipe(
            recipeID=new_recipe_id,
            postedByUserID=userID,
            createdDate=datetime.now(),
            title=title,
            caption=caption,
            imageS3Filename=imageS3Filename,
            hours=hours,
            minutes=minutes,
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
        )
        Recipes.add_ingredients(recipeID=new_recipe_id, ingredients=ingredients)
        Recipes.add_steps(recipeID=new_recipe_id, steps=steps)

        return jsonify({"message": "Recipe created successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
