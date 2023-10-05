from flask import current_app as app

class Users:
    def __init__(self, uid, firstName=None, middleName=None, lastName=None, suffix=None, dateOfBirth=None, pronouns=None, email=None, password=None, phoneNumber=None, creationDate=None, bio=None):
        self.uid = uid
        self.firstName = firstName
        self.middleName = middleName
        self.lastName = lastName
        self.suffix = suffix
        self.dateOfBirth = dateOfBirth
        self.pronouns = pronouns
        self.email = email
        self.password = password
        self.phoneNumber = phoneNumber
        self.creationDate = creationDate
        self.bio = bio
    
    @staticmethod
    def get(email):
        rows = app.db.execute('''
        SELECT *
        FROM \"Users\"
        WHERE email = :email
        ''',
                        email=email)
        return Users(*(rows[0])) if rows else None
    
    @staticmethod
    def get_password_from_user(email):
        password = app.db.execute('''
        SELECT password
        FROM \"Users\"
        WHERE email = :email
        ''',
                        email=email)
        
        return password[0][0] if password else None

    @staticmethod
    def get_last_uid():
        print("getting last uid")
        max_uid = app.db.execute('''
        SELECT MAX(uid)
        FROM \"Users\"
        ''')
        return max_uid[0][0] if max_uid[0][0] else None

    @staticmethod
    def add_user(uid, firstName=None, middleName=None, lastName=None, suffix=None, dateOfBirth=None, pronouns=None, email=None, password=None, phoneNumber=None, creationDate=None, bio=None):
        print('adding users')
        try:
            app.db.execute('''
            INSERT INTO \"Users\"
                        VALUES (:uid, :firstName, :middleName, :lastName, :suffix, :dateOfBirth, :pronouns, :email, :password, :phoneNumber, :creationDate, :bio)
            ''', 
                uid=uid,
                firstName=firstName,
                middleName=middleName,
                lastName=lastName,
                suffix=suffix,
                dateOfBirth=dateOfBirth,
                pronouns=pronouns,
                email=email,
                password=password,
                phoneNumber=phoneNumber,
                creationDate=creationDate,
                bio=bio)

            print('added users')

            return {"message": "User added successfully"}, 201
        except Exception as e:
            print(f"Error adding user: {str(e)}")
            return {"error": "Failed to add user"}, 500 


