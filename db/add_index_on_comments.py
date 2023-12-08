import psycopg2

# Replace with your actual database credentials
conn = psycopg2.connect(
    database="postgres",
    user="herbert123",
    password="picklesgalore",
    host="rds-postgresql-herbify.c0j4yuovxdsu.us-east-2.rds.amazonaws.com",
    port="5432"
)

cur = conn.cursor()

# Create an index for the parent_id column
cur.execute("CREATE INDEX parent_id_idx ON \"Comments\" (parent_id);")

# Create an index for the post_id column
cur.execute("CREATE INDEX post_id_idx ON \"Comments\" (post_id);")

conn.commit()
cur.close()
conn.close()
