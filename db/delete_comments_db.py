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

    delete_table_query = "DROP TABLE IF EXISTS \"Comments\";"
    cursor.execute(delete_table_query)
    connection.commit()
    print("Table deleted successfully")

except psycopg2.OperationalError as e:
    print(f"Error: {e}")
    exit(1)

except psycopg2.Error as e:
    connection.rollback()
    print(f"Error: {e}")

finally:
    cursor.close()
    connection.close()
