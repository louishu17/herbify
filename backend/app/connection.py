from decouple import config
from db import DB

def setup_db_connection(app):

# Load database configuration from the .env file
    db_config = {
        'user': config('DB_USER'),
        'password': config('DB_PASSWORD'),
        'host': config('DB_HOST'),
        'port': config('DB_PORT'),
        'database': config('DB_NAME')
    }

    # Construct the database URL
    db_url = f"postgresql://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}"
    
    # Set the SQLAlchemy configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.db = DB(app)

    return app