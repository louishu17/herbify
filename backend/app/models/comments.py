from flask import current_app as app

class RecipeComment:
    def __init__(self, id, text, user_id, parent_id, post_id):
        self.id = id
        self.text = text
        self.user_id = user_id
        self.parent_id = parent_id
        self.post_id = post_id
    
    def __repr__(self):
        return f'<Comment {self.id}>'
    

    @staticmethod
    def add_comment(text, user_id, parent_id, post_id):
        print("adding comment")
        try:
            app.db.execute('''
            INSERT INTO \"Comments\" (text, user_id, parent_id, post_id)
            VALUES (:text, :user_id, :parent_id, :post_id)
            ''', text=text, user_id=user_id, parent_id=parent_id, post_id=post_id)
            print("added comment")
        except Exception as e:
            print(e)
            app.db.rollback()
            raise e
    

    @staticmethod
    def format_comments(post_id, comment_id = None):
        print("getting comments")
        try:
            if comment_id is None:
                query = '''
                    SELECT *
                    FROM "Comments"
                    WHERE parent_id IS NULL AND post_id = :post_id
                '''
                comments = app.db.execute(query, post_id=post_id)
            else:
                query = '''
                    SELECT *
                    FROM "Comments"
                    WHERE parent_id = :comment_id AND post_id = :post_id
                '''
                comments = app.db.execute(query, comment_id=comment_id, post_id=post_id)

            print(comments)
            comments = [RecipeComment(comment.id, comment.text, comment.user_id, comment.parent_id, comment.post_id) for comment in comments] if comments else []
            
            formatted_comments = []
            for comment in comments:
                formatted_comments.append({
                    "id": comment.id,
                    "text": comment.text,
                    "user_id": comment.user_id,
                    "parent_id": comment.parent_id,
                    "post_id": comment.post_id,
                    "replies": RecipeComment.format_comments(post_id, comment.id)
                })

            return formatted_comments
        except Exception as e:
            print(e)
            app.db.rollback()
            raise e
        




