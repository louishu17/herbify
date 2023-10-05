from flask import Flask
from flask_swagger_ui import get_swaggerui_blueprint
from connection import setup_db_connection
from sqlalchemy.ext.automap import automap_base
from models.recipes import Recipes
from swagger_setup import setup_swagger
from register import register_blueprint

Base = automap_base()


app = Flask(__name__)

app.register_blueprint(register_blueprint)

setup_db_connection(app)
setup_swagger(app)

@app.route('/data/list', methods=['GET'])
def return_top_recipes():
    return Recipes.get_x_most_recent(5)

@app.route('/')
def hell():
    rows = app.db.execute("""
SELECT * FROM \"Likes\";
""")
    for row in rows:
        print(row)

    return rows



