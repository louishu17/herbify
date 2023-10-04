from flask import Flask
from flask_swagger_ui import get_swaggerui_blueprint
from connection import establish_db_connection




app = Flask(__name__)

SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "herbify-swagger"
    }
)
app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)

db = establish_db_connection(app)

@app.route('/data/list', methods=['GET'])
def hello():
    print(db.query.all())
    return '<h1>Hello, World!</h1>'

@app.route('/')
def hell():
    # users = db.session.execute(db.select(User).order_by(User.username)).scalars()
    return '<h1>Hello, World!</h1>'

# create recipe
# list ten recipes
# search for recipes
# login info


