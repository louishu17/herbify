from sqlalchemy import create_engine, Column, Integer, String, Date, DateTime, Float, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = 'postgresql://herbert123:picklesgalore@rds-postgresql-herbify.c0j4yuovxdsu.us-east-2.rds.amazonaws.com/postgres'

engine = create_engine(DATABASE_URL, echo=True)

Base = declarative_base()

class Users(Base):
    __tablename__ = 'Users'

    uid = Column(Integer, primary_key=True)
    firstName = Column(String)
    middleName = Column(String)
    lastName = Column(String)
    suffix = Column(String)
    dateOfBirth = Column(Date)
    pronouns = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    phoneNumber = Column(String)
    creationDate = Column(DateTime)
    bio = Column(String)
    profilePicS3Filename = Column(String)

class Recipes(Base):
    __tablename__ = 'Recipes'

    recipeID = Column(Integer, primary_key=True)
    postedByUserID = Column(Integer, ForeignKey('Users.uid'))
    fullRecipeString = Column(String)
    createdDate = Column(DateTime)
    imageS3Filename = Column(String)
    
    user = relationship('Users', back_populates='recipes')

class Ingredients(Base):
    __tablename__ = 'Ingredients'

    ingredientID = Column(Integer, primary_key=True)
    name = Column(String)

class RecipeHasIngredients(Base):
    __tablename__ = 'RecipeHasIngredients'

    recipeID = Column(Integer, ForeignKey('Recipes.recipeID'), primary_key=True)
    ingredientID = Column(Integer, ForeignKey('Ingredients.ingredientID'), primary_key=True)

class RecipeHasSteps(Base):
    __tablename__ = 'RecipeHasSteps'

    recipeID = Column(Integer, ForeignKey('Recipes.recipeID'))
    stepNumber = Column(Integer, primary_key=True)
    stepDescription = Column(String)

class Likes(Base):
    __tablename__ = 'Likes'

    postID = Column(Integer, primary_key=True)
    likedByUserID = Column(Integer, ForeignKey('Users.uid'), primary_key=True)

class Comments(Base):
    __tablename__ = 'Comments'

    postID = Column(Integer, ForeignKey('Recipes.recipeID'), primary_key=True)
    commentedByUserID = Column(Integer, ForeignKey('Users.uid'), primary_key=True)
    comment = Column(String)
    timestamp = Column(DateTime)

class Ratings(Base):
    __tablename__ = 'Ratings'

    RecipeID = Column(Integer, ForeignKey('Recipes.recipeID'), primary_key=True)
    RatedByUserID = Column(Integer, ForeignKey('Users.uid'), primary_key=True)
    rating = Column(Float)

class Follows(Base):
    __tablename__ = 'Follows'

    followerID = Column(Integer, ForeignKey('Users.uid'), primary_key=True)
    followedID = Column(Integer, ForeignKey('Users.uid'), primary_key=True)

class Images(Base):
    __tablename__ = 'Images'

    imageID = Column(Integer, primary_key=True)
    recipeID = Column(Integer, ForeignKey('Recipes.recipeID'))
    path = Column(String)

# Create the tables
Base.metadata.create_all(engine)

# Create a session to interact with the database
Session = sessionmaker(bind=engine)
session = Session()