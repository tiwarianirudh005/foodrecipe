document.addEventListener("DOMContentLoaded", function () {
    let recipeID = localStorage.getItem("selectedRecipeID");
    console.log("Loaded Recipe ID:", recipeID);

    if (!recipeID) {
        console.error("No recipe ID found!");
        return;
    }

    // Fetch recipe details using the stored ID
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeID}`)
        .then(response => response.json())
        .then(data => {
            if (!data.meals) {
                console.error("Recipe not found!");
                return;
            }

            let meal = data.meals[0];
            document.getElementById("recipeTitle").innerText = meal.strMeal;
            document.getElementById("recipeImage").src = meal.strMealThumb;
            document.getElementById("recipeIngredients").innerHTML = meal.strIngredient1;
            document.getElementById("recipeInstructions").innerText = meal.strInstructions;
        })
        .catch(error => console.error("Error fetching recipe:", error));
});
