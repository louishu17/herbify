from flask import current_app as app, jsonify
import json
from feedRoutes.feedFetcher import RecipeOnFeed, RecipeOnFeedJSONEncoder


class Leader:
    def __init__(self, uid, firstName=None, lastName=None, numberOfFollowers=0, profilePicS3Filename=""):
        self.name = firstName + " " + lastName
        self.uid = uid
        self.numberOfFollowers=numberOfFollowers
        self.profilePicS3Filename=profilePicS3Filename

    def to_json(self):
        return {
            "name": self.name,
            "uid": self.uid,
            "numberOfFollowers" : self.numberOfFollowers,
            "profilePicS3Filename" : self.profilePicS3Filename
        }

class LeaderboardFetcher:
        

    def get_leaders():
        rows = app.db.execute('''

                            WITH \"MostFollowedUsers\" AS (
                               SELECT \"followedID\", COUNT(*) as \"numberOfFollowers\"
                               FROM \"Follows\"
                               GROUP BY \"followedID\"
                               ORDER BY \"numberOfFollowers\" DESC
                               LIMIT 10
                            )
                            SELECT \"uid\", \"firstName\", \"lastName\", \"numberOfFollowers\", \"profilePicS3Filename\"
                            FROM \"Users\"
                            INNER JOIN \"MostFollowedUsers\"
                            ON \"Users\".\"uid\" = \"MostFollowedUsers\".\"followedID\"
                            ORDER BY \"numberOfFollowers\" DESC

                               

                               ''')              
        return [Leader(*row) for row in rows]
    
    def get_leading_posts():
        rows = app.db.execute('''
            SELECT * FROM RecipesForFeed
            ORDER BY numLikes DESC
            LIMIT 10
            
        ''')
        recipes = [RecipeOnFeed(*row) for row in rows]
        return recipes




class LeaderJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Leader):
            # Define how to serialize the object
            return obj.to_json()
        return super(LeaderJSONEncoder, self).default(obj)

