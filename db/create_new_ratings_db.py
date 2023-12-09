import psycopg2

try:
    connection = psycopg2.connect(
        database="postgres",
        user="herbert123",
        password="picklesgalore",
        host="rds-postgresql-herbify.c0j4yuovxdsu.us-east-2.rds.amazonaws.com",
        port="5432"
    )


    cursor = connection.cursor()

    create_table_query = '''
    CREATE TABLE \"Ratings\" (
       \"ratingID\" SERIAL PRIMARY KEY,
        \"user_id\" INT REFERENCES \"Users\"(uid),
        recipeID INT REFERENCES \"Recipes\"(recipeID),
        rating INT CHECK (rating >= 1 AND rating <= 5)
    );
    '''
    

    cursor.execute(create_table_query)
    cursor.execute("CREATE INDEX user_id_idx ON \"Ratings\" (user_id);")
    cursor.execute("CREATE INDEX recipeID_idx ON \"Ratings\" (recipeID);")
    cursor.execute("CREATE INDEX idx_ratings_recipeid_rating ON Ratings(recipeID, rating);")
    connection.commit()
    print("Table created successfully")

except psycopg2.OperationalError as e:
    print(f"Error: {e}")
    exit(1)

except psycopg2.Error as e:
    connection.rollback()
    print(f"Error: {e}")

finally:
    cursor.close()
    connection.close()
