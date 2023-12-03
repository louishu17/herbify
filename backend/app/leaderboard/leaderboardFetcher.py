from flask import current_app as app
import json


class Leader:
    def __init__(self, uid, firstName=None, lastName=None, numberOfFollowers=0):
        self.name = firstName + " " + lastName
        self.uid = uid
        self.numberOfFollowers=numberOfFollowers

    def to_json(self):
        return {
            "name": self.name,
            "uid": self.uid,
            "numberOfFollowers" : self.numberOfFollowers
        }

class Leaderboard:
        

    def get_leaders():
        rows = app.db.execute('''

                            WITH \"MostFollowedUsers\" AS (
                               SELECT \"followedID\", COUNT(*) as \"numberOfFollowers\"
                               FROM \"Follows\"
                               GROUP BY \"followedID\"
                               ORDER BY \"numberOfFollowers\" DESC
                               LIMIT 10
                            )
                            SELECT \"uid\", \"firstName\", \"lastName\", \"numberOfFollowers\" 
                            FROM \"Users\"
                            INNER JOIN \"MostFollowedUsers\"
                            ON \"Users\".\"uid\" = \"MostFollowedUsers\".\"followedID\"
                            ORDER BY \"numberOfFollowers\" DESC

                               

                               ''')              
        return [Leader(*row) for row in rows]





class LeaderJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Leader):
            # Define how to serialize the object
            return obj.to_feed_json()
        return super(LeaderJSONEncoder, self).default(obj)

