import random
import psycopg2
from psycopg2.extras import RealDictCursor

# Database credentials
DB_USER = "herbert123"
DB_PASSWORD = "picklesgalore"
DB_HOST = "rds-postgresql-herbify.c0j4yuovxdsu.us-east-2.rds.amazonaws.com"
DB_PORT = "5432"
DB_NAME = "postgres"

def uploadLikes():
    # Establish a database connection
    conn = psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
    )
    # Create a cursor object using the cursor() method
    cur = conn.cursor(cursor_factory=RealDictCursor)


    for i in range(10001):
        try:
            user_id = random.randint(1, 1000)
            recipe_id = random.randint(20, 1000)
            rating = random.randint(1, 5)

            # Check if the tuple already exists using EXISTS
            cur.execute(
                'SELECT EXISTS(SELECT 1 FROM \"Ratings\" WHERE \"RecipeID\" = %s AND \"RatedByUserID\" = %s)',
                (recipe_id, user_id)
            )
            exists = cur.fetchone()['exists']

            # If the tuple does not exist, insert a new record
            if not exists:
                cur.execute(
                    'INSERT INTO \"Ratings\" (\"RecipeID\", \"RatedByUserID\", \"rating\" ) VALUES (%s, %s, %s)',
                    (recipe_id,user_id , rating)
                )

            # Commit changes in batches
            if i % 100 == 0:
                conn.commit()
        except Exception as e:
            raise e


    # Final commit for any remaining records
    conn.commit()
    
    print("Records inserted successfully")
    cur.close()
    conn.close()

if __name__ == "__main__":
    uploadLikes()
