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
    CREATE TABLE IF NOT EXISTS \"Comments\" (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        parent_id INTEGER NULL REFERENCES \"Comments\"(id),
        post_id INTEGER NOT NULL REFERENCES \"Recipes\"(\"recipeID\")
    );
    '''

    cursor.execute(create_table_query)
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
