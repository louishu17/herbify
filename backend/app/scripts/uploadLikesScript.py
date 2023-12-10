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

    try:
        for i in range(10001):
            user_id = random.randint(1, 1000)
            recipe_id = random.randint(1, 1000)

            # Check if the tuple already exists using EXISTS
            cur.execute(
                'SELECT EXISTS(SELECT 1 FROM \"Likes\" WHERE \"postID\" = %s AND \"likedByUserID\" = %s)',
                (user_id, recipe_id)
            )
            exists = cur.fetchone()['exists']

            # If the tuple does not exist, insert a new record
            if not exists:
                cur.execute(
                    'INSERT INTO \"Likes\" (\"postID\", \"likedByUserID\") VALUES (%s, %s)',
                    (user_id, recipe_id)
                )

            # Commit changes in batches
            if i % 100 == 0:
                conn.commit()

        # Final commit for any remaining records
        conn.commit()
        
        print("Records inserted successfully")
    except Exception as e:
        # Rollback in case of error
        conn.rollback()
        print(f"An error occurred: {e}")
    finally:
        # Close the cursor and connection to so the server can allocate
        # bandwidth to other requests
        cur.close()
        conn.close()

if __name__ == "__main__":
    uploadLikes()
