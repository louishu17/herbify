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

# Create new timestamp column
cur.execute("ALTER TABLE \"Comments\" ADD COLUMN timestamp TIMESTAMP DEFAULT NOW();")

conn.commit()
cur.close()
conn.close()
