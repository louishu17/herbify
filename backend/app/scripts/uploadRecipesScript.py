import random
from PIL import Image
import pandas as pd
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import boto3
from datetime import datetime
import io
import ast

s3 = boto3.client(
    "s3",
    aws_access_key_id="AKIAU27D2SNFHMEYHDEU",
    aws_secret_access_key="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",
    region_name="us-east-1",
)
# Database credentials
DB_USER = "herbert123"
DB_PASSWORD = "picklesgalore"
DB_HOST = "rds-postgresql-herbify.c0j4yuovxdsu.us-east-2.rds.amazonaws.com"
DB_PORT = "5432"
DB_NAME = "postgres"


def load_image(image_folder_path, image_name):
    """
    Load an image from the specified folder and return it as a PIL image object.

    Args:
        image_folder_path (str): The path to the folder containing the images.
        image_name (str): The name of the image file (without extension).

    Returns:
        PIL.Image.Image: The loaded image as a PIL image object, or None if the file doesn't exist.

    """
    # Construct the full file path
    file_path = os.path.join(image_folder_path, image_name) + ".jpg"
    try:
        # Open the image file using PIL and return the image object
        with Image.open(file_path) as img:
            return img.copy()  # Use copy to avoid a closed file error
    except FileNotFoundError:
        # Return None or raise an error if the file doesn't exist
        return None


def custom_string_to_list(input_str):
    """
    Convert a custom-formatted string to a list of elements.

    Args:
        input_str (str): The input string containing elements enclosed in single quotes and separated by commas.

    Returns:
        list: A list of elements extracted from the input string.

    """

    # Removing the brackets from the string
    input_str = input_str[1:-1]
    # Splitting the string by "', '" to get the individual elements
    list_elements = input_str.split("', '")
    # Processing the first and last element to remove the extra quote
    list_elements[0] = list_elements[0][1:]
    list_elements[-1] = list_elements[-1][:-1]
    return list_elements


def upload_recipes():
    """
    Upload recipes from a CSV file to a PostgreSQL database along with associated images.

    This function reads a CSV file containing recipe information and images,
    processes the data, and inserts it into a PostgreSQL database.
    It also uploads images to an AWS S3 bucket and stores the S3 file paths in the database.

    Args:
        None

    Returns:
        None

    """
    # Establish a database connection
    conn = psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
    )
    # Create a cursor object using the cursor() method
    cur = conn.cursor(cursor_factory=RealDictCursor)
    # Define the path to the CSV file and the image folder
    csv_file_path = "/Users/louishu/herbify/Food_Ingredients_and_Recipe_Dataset_with_Image_Name_Mapping.csv"
    image_folder_path = "/Users/louishu/herbify/food_images"  # Assuming this is the path to the image folder

    # Load the CSV file into a DataFrame
    df = pd.read_csv(csv_file_path)
    # Check if the 'image_name' column exists in the DataFrame
    # Assuming 'df' is your DataFrame and 'image_folder_path' is the path to your images folder
    if "Image_Name" in df.columns:
        # Add a new column to the DataFrame containing the image objects
        df["image_object"] = df["Image_Name"].apply(
            lambda x: load_image(image_folder_path, x)
        )

        # Display the first few rows of the DataFrame to confirm
        output = df.head()
    else:
        output = "The 'Image_Name' column does not exist in the provided DataFrame."

    print(df.columns)
    for row in df.itertuples(name="Pandas"):
        try:
            title = row.Title
            ingredients = custom_string_to_list(row.Ingredients)
            instructions = row.Instructions.split("\n")
            image_object = row.image_object

            userID = random.randint(1, 1000)
            cur.execute('SELECT MAX("recipeID") FROM "Recipes"')
            result = cur.fetchone()
            last_recipe_id = result["max"] if result["max"] is not None else 0
            new_recipe_id = last_recipe_id + 1
            print("new recipe id is " + str(new_recipe_id))
            print("uploading image")
            if image_object:
                # Save the image object to a BytesIO object
                if image_object.mode != "RGB":
                    image_object = image_object.convert("RGB")
                img_byte_arr = io.BytesIO()
                image_object.save(img_byte_arr, format="JPEG")
                img_byte_arr.seek(0)  # Move to the beginning of the BytesIO object

                imageS3Filename = (
                    "recipes/recipe-"
                    + str(new_recipe_id)
                    + "-"
                    + str(int(random.random() * 10000))
                    + ".jpg"
                )
                s3.upload_fileobj(img_byte_arr, "herbify-images", imageS3Filename)
            print("image uploaded")
            print("uploading recipe")
            cur.execute(
                """
                INSERT INTO "Recipes"
                (\"recipeID\", \"postedByUserID\", \"fullRecipeString\", \"createdDate\", \"title\", \"caption\", \"imageS3Filename\")
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    new_recipe_id,
                    userID,
                    "Cheeseburgers",
                    datetime.now(),
                    title,
                    "original caption made by " + str(userID),
                    imageS3Filename,
                ),
            )
            print("recipe uploaded")

            print("uploading ingredients and steps")
            for ingredient in ingredients:
                cur.execute(
                    """
                    INSERT INTO "RecipeHasIngredients"
                    (\"recipeID\", \"ingredient\")
                    VALUES (%s, %s)
                    """,
                    (new_recipe_id, ingredient),
                )
            print("ingredients uploaded")
            for i, step in enumerate(instructions):
                cur.execute(
                    """
                    INSERT INTO "RecipeHasSteps"
                    (\"recipeID\", \"stepNumber\", \"stepDescription\")
                    VALUES (%s, %s, %s)
                    """,
                    (new_recipe_id, i, step),
                )
            print("steps uploaded")

            conn.commit()
        except Exception as e:
            print(f"An error occurred: {e}")
            conn.rollback()
    print("done")


if __name__ == "__main__":
    upload_recipes()
