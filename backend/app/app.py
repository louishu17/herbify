from flask import Flask
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
from feed import feed_blueprint
from search import search_blueprint
from flask_cors import CORS, cross_origin

Base = automap_base()

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.register_blueprint(register_blueprint)
app.register_blueprint(login_blueprint)
app.register_blueprint(create_recipe_blueprint)
app.register_blueprint(feed_blueprint)
app.register_blueprint(search_blueprint)
app.register_blueprint(ingredients_blueprint)
app.register_blueprint(directions_blueprint)
app.register_blueprint(basicInfo_blueprint)

setup_db_connection(app)
setup_swagger(app)

@app.route('/data/list', methods=['GET'])
def return_top_recipes():
    return Recipes.get_x_most_recent(5)

