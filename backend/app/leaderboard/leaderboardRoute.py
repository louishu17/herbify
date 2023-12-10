from flask import request, jsonify, Blueprint, current_app as app

from leaderboard.leaderboardFetcher import Leader, LeaderboardFetcher, LeaderJSONEncoder
from feedRoutes.feedFetcher import RecipeOnFeed, RecipeOnFeedJSONEncoder
from flask_cors import cross_origin

leaderboard_blueprint = Blueprint('leaderboard', __name__)


    
@leaderboard_blueprint.route('/leading_users', methods=['GET'])
@cross_origin()
def leading_users():
    print("getting leading users")

    try:
        leaders = LeaderboardFetcher.get_leaders()
        serialized_objects = [obj.to_json() for obj in leaders]

        return jsonify({'leaders' : serialized_objects}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@leaderboard_blueprint.route('/leading_posts', methods=['GET'])
@cross_origin()
def leading_posts():
    print("getting leading posts")

    try:
        posts = LeaderboardFetcher.get_leading_posts()
        serialized_objects = [obj.to_feed_json() for obj in posts]

        return jsonify({'descriptions' : serialized_objects}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@leaderboard_blueprint.route('/create_view', methods=['GET'])
@cross_origin()
def create_recipes_view():
    print("getting leaderboard by posts")

    try:
        app.db.execute('''
            CREATE VIEW RecipesForFeed AS (
                WITH \"RecipesWithUserNamesAndProfilePic\" AS (
                    SELECT \"recipeID\", \"firstName\", \"lastName\", \"profilePicS3Filename\"
                    FROM \"Recipes\"
                    LEFT JOIN \"Users\"
                    ON \"Recipes\".\"postedByUserID\" = \"Users\".\"uid\"
                ), \"NumLikes\" AS (
                    SELECT \"recipeID\", COALESCE(COUNT(\"Likes\".\"likedByUserID\"), 0) AS numLikes
                    FROM \"Recipes\"
                    LEFT JOIN \"Likes\"
                    ON \"Recipes\".\"recipeID\" = \"Likes\".\"postID\"
                    GROUP BY \"Recipes\".\"recipeID\" 
                ), \"RecipesWithNumLikes\" AS (
                    SELECT * 
                    FROM \"Recipes\"
                    NATURAL JOIN \"NumLikes\"
                )
                SELECT \"recipeID\", \"postedByUserID\", \"fullRecipeString\", \"createdDate\", \"title\", \"caption\", \"imageS3Filename\", \"firstName\", \"lastName\", \"profilePicS3Filename\", numLikes
                FROM \"RecipesWithNumLikes\"
                NATURAL JOIN \"RecipesWithUserNamesAndProfilePic\"
            )
                       
            
                       ''')
        leaders = LeaderboardFetcher.get_leaders()
        serialized_objects = [obj.to_json() for obj in leaders]

        return jsonify({'leaders' : serialized_objects}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@leaderboard_blueprint.route('/delete_view', methods=['GET'])
@cross_origin()
def delete_recipes_view():
    print("getting leaderboard by posts")

    try:
        rows = app.db.execute('''
            DROP VIEW RecipesForFeedd
                       ''')
        print(rows)
        leaders = LeaderboardFetcher.get_leaders()
        serialized_objects = [obj.to_json() for obj in leaders]

        return jsonify({'leaders' : serialized_objects}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
