from flask import current_app as app

class Users:
    def __init__(self, uid, firstName, middleName, lastName, suffix, dateOfBirth, pronouns, email, password, phoneNumber, creationDate, bio):
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