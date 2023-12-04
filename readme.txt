Group members: Keith Cressman, Herbert Wang, Louis Hu, Frankie Willard
Github link : https://github.com/louishu17/herbify
Video link: https://drive.google.com/file/d/1D03nNjuHMaJPCVEgMi4eFi-yp6xkvv3j/view?usp=sharing


Keith: 
I focused on working with images. I created an S3 bucket to store our images, and created policies so that anybody with the frontend access key can view our images, but only the backend server with its secret key can upload/delete. I then set up frontend code to fetch images directly from the bucket, and backend code to upload images to the bucket. When a user creates a recipe, the frontend sends the image to the backend, then the backend uploads the image. 
I also worked on pagination for the feed. You can now load more recipes rather than being stuck with the top 8. This required changes on frontend and backend. 

Herb
I worked on the profile page. I set up a frontend page for a user’s profile, and a backend API to fetch the data for their profile. I also cleaned up the feed UI, making it look nicer.  

Louis
I first focused on User sessions. I setup Redis and Flask Cors to keep track of user sessions properly, so when a user logins, the session is stored in Redis, and the cookie is set on the client, so future requests are sent with the cookie. This allowed the server to recognize who is making the requests, by querying our Redis cache. Then we were able to fill in postedByUserID when the User creates a recipe, which tells us which user creates the recipe, as well as allow the User to view their own profile page (protected pages). 
I also created the scripts to fill in our database so our PostgreSQL DBs were more similar to production size. This included a script to create 1000 random users, and a script to parse a large recipes dataset csv (https://www.kaggle.com/datasets/pes12017000148/food-ingredients-and-recipe-dataset-with-images) that included images, and adding those recipes with ingredients and instructions info to our respective recipes databases (Recipes, RecipesHasSteps, and RecipesHasIngredients) as well as recipe images to our S3 bucket. 

Frankie
I worked on setting up the user profile settings, which included updating the user with relevant info such as first name, last name, date of birth, pronouns, and bio. I also worked on making the UI better on the frontend in the form for creating recipes and introducing backward compatibility with previous features integration with user sessions. 
