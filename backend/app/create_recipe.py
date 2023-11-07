from flask import Blueprint, request, jsonify
from models.recipes import Recipes
from datetime import datetime
from flask_cors import cross_origin
import json
import boto3


s3 = boto3.client('s3',
                  aws_access_key_id='AKIAU27D2SNFHMEYHDEU',
                  aws_secret_access_key='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',
                  region_name='us-east-1')

create_recipe_blueprint = Blueprint('create-recipe', __name__)
@create_recipe_blueprint.route('/create-recipe', methods=['POST'])
@cross_origin()
def create_recipe():
    print("creating recipe")
    try:
        non_image_data = request.form['nonImageData']
        recipe_data = json.loads(non_image_data)

        userID = recipe_data['postedByUserID']
        title = recipe_data['title']
        caption = recipe_data['caption']
        ingredients = recipe_data['ingredients']
        steps = recipe_data['steps']
        last_recipe_id = Recipes.get_last_recipe_id()
        new_recipe_id = 1 if not last_recipe_id else last_recipe_id + 1

        # Get the uploaded image file
        
        if 'imageFile' in request.files:
            print("image file is defined")
            image_file = request.files['imageFile']
            print(image_file.filename)
            s3_filename = "recipes/recipe-" + str(new_recipe_id) + "." + image_file.filename.split(".")[-1]
            s3.upload_fileobj(image_file, "herbify-images", s3_filename)
        

        

        Recipes.add_recipe(recipeID=new_recipe_id, postedByUserID=userID, createdDate=datetime.now(), title=title, caption=caption)
        Recipes.add_ingredients(recipeID=new_recipe_id, ingredients=ingredients)
        Recipes.add_steps(recipeID=new_recipe_id, steps=steps)

        return jsonify({'message': 'Recipe created successfully'}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

