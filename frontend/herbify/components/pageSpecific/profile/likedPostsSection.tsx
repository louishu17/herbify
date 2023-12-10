if (getType === "liked") { 
    recipesList = await fetchLiked(currId);
    setIsRecipes(true);
  }