import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from werkzeug.security import generate_password_hash

# Database credentials
DB_USER = "herbert123"
DB_PASSWORD = "picklesgalore"
DB_HOST = "rds-postgresql-herbify.c0j4yuovxdsu.us-east-2.rds.amazonaws.com"
DB_PORT = "5432"
DB_NAME = "postgres"


def uploadUsers():
    """
    Upload user data to a PostgreSQL database.

    This function inserts user records with randomly generated names and email addresses
    into a PostgreSQL database. It also hashes the password using the SHA-256 method
    and includes other user information such as middle name, date of birth, pronouns,
    phone number, and bio.

    Args:
        None

    Returns:
        None

    """

    # Establish a database connection
    conn = psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
    )
    # Create a cursor object using the cursor() method
    cur = conn.cursor(cursor_factory=RealDictCursor)

    middle_name = "Faye"
    suffix = ""
    email_domain = "@gmail.com"
    dateOfBirth = "01/01/2000"
    pronouns = "she/her/hers"
    phoneNumber = "1234567890"
    password = generate_password_hash("password123", method="sha256")
    bio = "I love Herbify!"

    try:
        for i in range(1001):
            first_name = "Alicia" + str(i)
            last_name = "Jackson" + str(i)
            email = first_name + "." + last_name + email_domain

            # Get the last used user ID
            cur.execute('SELECT MAX(uid) FROM "Users"')
            result = cur.fetchone()
            last_user_uid = result["max"] if result["max"] is not None else 0
            new_uid = last_user_uid + 1

            # Insert a new record
            cur.execute(
                """
                INSERT INTO \"Users\" (uid, \"firstName\", \"middleName\", \"lastName\", \"suffix\", \"dateOfBirth\", \"pronouns\", \"email\", \"password\", \"phoneNumber\", \"creationDate\", bio)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    new_uid,
                    first_name,
                    middle_name,
                    last_name,
                    suffix,
                    dateOfBirth,
                    pronouns,
                    email,
                    password,
                    phoneNumber,
                    datetime.now(),
                    bio,
                ),
            )
            # Commit the changes to the database
            conn.commit()

        print("done")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close the cursor and connection to so the server can allocate
        # bandwidth to other requests
        cur.close()
        conn.close()


if __name__ == "__main__":
    uploadUsers()
