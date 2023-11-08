from flask import Blueprint, request, jsonify, session
from models.recipes import Recipes
from models.users import Users
from datetime import datetime
from flask_cors import cross_origin
create_recipe_blueprint = Blueprint('create-recipe', __name__)
@create_recipe_blueprint.route('/create-recipe', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_recipe():
    print("creating recipe")
    try:
        data = request.get_json()
        if 'user' not in session:
            print("User not in session")
            return jsonify({'message': 'You must be logged in to create a recipe'}), 401
        user_email = session['user']
        user = Users.get(user_email)
        userID = user.uid
        title = data.get('title')
        caption = data.get('caption')
        ingredients = data.get('ingredients')
        steps = data.get('steps')

        last_recipe_id = Recipes.get_last_recipe_id()
        new_recipe_id = 1 if not last_recipe_id else last_recipe_id + 1

        # Get the uploaded image file
        imageS3Filename = "none"
        if 'imageFile' in request.files:
            image_file = request.files['imageFile']

            imageS3Filename = "recipes/recipe-" + str(new_recipe_id) + "-" + str(int(random.random() * 10000)) + "." + image_file.filename.split(".")[-1]
            s3.upload_fileobj(image_file, "herbify-images", imageS3Filename)
        

        

        Recipes.add_recipe(recipeID=new_recipe_id, postedByUserID=userID, createdDate=datetime.now(), title=title, caption=caption, imageS3Filename=imageS3Filename)
        Recipes.add_ingredients(recipeID=new_recipe_id, ingredients=ingredients)
        Recipes.add_steps(recipeID=new_recipe_id, steps=steps)

        return jsonify({'message': 'Recipe created successfully'}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

