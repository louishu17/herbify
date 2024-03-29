from flask import Flask, session
from decouple import config
from flask_swagger_ui import get_swaggerui_blueprint
from connection import setup_db_connection
from sqlalchemy.ext.automap import automap_base
from models.recipes import Recipes
from swagger_setup import setup_swagger
from register import register_blueprint
from login import login_blueprint
from create_recipe import create_recipe_blueprint
from recipeDetailsRoutes.basicInfo import basicInfo_blueprint
from recipeDetailsRoutes.directions import directions_blueprint
from recipeDetailsRoutes.ingredients import ingredients_blueprint
from recipeDetailsRoutes.comments import get_comments_blueprint
from feedRoutes.basicFeed import basic_feed_blueprint
from feedRoutes.paginatedFeed import paginated_feed_blueprint
from feedRoutes.feedFetcher import FeedFetcher
from leaderboard.leaderboardRoute import leaderboard_blueprint
from searchRoutes.paginatedSearch import paginated_search_blueprint
from searchRoutes.basicSearch import basic_search_blueprint
from set_profile import set_profile_blueprint
from like_recipe import like_recipe_blueprint
from like_recipe import unlike_recipe_blueprint
from comments import add_comment_blueprint
from profile import profile_blueprint
from rate_recipe import rate_recipe_blueprint
from flask_cors import CORS, cross_origin
from flask_session import Session
import redis
import os

Base = automap_base()

app = Flask(__name__)

app.config['SECRET_KEY'] = config('SECRET_KEY')

cors = CORS(app, supports_credentials=True, origins=["http://127.0.0.1:3000", "https://herbify-ten.vercel.app", "https://herbify-git-authcheck-branch-louishu17.vercel.app"])
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_REDIS'] = redis.Redis(
    host='redis-19435.c325.us-east-1-4.ec2.cloud.redislabs.com',
    port=19435,
    password='j7mW4fQViZDYb2UgXZTddScR8ZpdviCv'
)
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'

app.register_blueprint(register_blueprint)
app.register_blueprint(login_blueprint)
app.register_blueprint(create_recipe_blueprint)
#app.register_blueprint(feed_blueprint)
app.register_blueprint(basic_feed_blueprint)
app.register_blueprint(paginated_feed_blueprint)
app.register_blueprint(set_profile_blueprint)
app.register_blueprint(basic_search_blueprint)
app.register_blueprint(ingredients_blueprint)
app.register_blueprint(directions_blueprint)
app.register_blueprint(basicInfo_blueprint)
app.register_blueprint(profile_blueprint)
app.register_blueprint(like_recipe_blueprint)
app.register_blueprint(unlike_recipe_blueprint)
app.register_blueprint(leaderboard_blueprint)
app.register_blueprint(paginated_search_blueprint)
app.register_blueprint(add_comment_blueprint)
app.register_blueprint(get_comments_blueprint)
app.register_blueprint(rate_recipe_blueprint)

setup_db_connection(app)
setup_swagger(app)

sess = Session()
sess.init_app(app)


@app.route("/data/list", methods=["GET"])
def return_top_recipes():
    return FeedFetcher.get_x_most_recent(5)


if __name__ == '__main__':
    app.run(debug=True)