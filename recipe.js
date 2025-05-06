let apiKey = "1";
let search = document.querySelector(".search-btn");

let categoryMap = {
    "Breakfast": "Breakfast",
    "Lunch": "Miscellaneous", // No direct "Lunch" category
    "Dinner": "Miscellaneous", // No direct "Dinner" category
    "Snacks": "Side", // No "Snacks", using closest match
    "Vegetarian": "Vegetarian",
    "Vegan": "Vegan",
    "Gluten-Free": "Miscellaneous", // No direct "Gluten-Free"
    "Italian": "Pasta", // No direct "Italian", using "Pasta"
    "Mexican": "Miscellaneous", // No "Mexican", using "Miscellaneous"
    "Indian": "Miscellaneous", // No "Indian", using "Miscellaneous"
    "Chinese": "Miscellaneous", // No "Chinese", using "Miscellaneous"
};

let sidebar = document.querySelector(".sidebar");
let categoryDisplay = document.querySelector(".category");

categoryDisplay.addEventListener("click", (e) =>{
    e.preventDefault();
    sidebar.classList.toggle("show"); // Toggle class
})

// -------------------------------------------.--------------------------DefaultRecipes-------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
    await loadDefaultRecipes();
});

async function loadDefaultRecipes() {
    let defaultApiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
    
    try {
        let DefaultResponse = await fetch(defaultApiUrl);
        if (!DefaultResponse.ok) throw new Error("Error fetching default recipes");

        let DefaultData = await DefaultResponse.json();
        let recipesContainer = recipeDisplay(); // Clears container

        if (DefaultData.meals) {
            createCards(DefaultData.meals.slice(0, 10), recipesContainer); // Show 10 random meals
        } else {
            recipesContainer.innerHTML = "<p>No Recipes Found</p>";
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// ---------------------------------------------------------------------------recipeBySearch--------------------------------------------------------------------------------------------

search.addEventListener("click", async () => {
    let dish = document.getElementById("dish");
    let DishName = dish.value.trim();

    if (DishName === "") {
        alert("Please enter a dish name!");
        return;
    }

    let apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${DishName}`;

    try {
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Recipe not found!");

        let data = await response.json();

        let recipesContainer = recipeDisplay(); // Now returns the container

        if (data.meals) {
            createCards(data.meals, recipesContainer);
        } else {
            recipesContainer.innerHTML = "<p>No Recipes Found</p>";
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

// ----------------------------------------------------------------------------RecipeByCategories---------------------------------------------------------------------------------------------

let categories = document.querySelectorAll(".sidebar ul li a");
categories.forEach(category => {
    category.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevents page reload

        let selectedCategory = category.textContent.trim();
        let apiCategory = categoryMap[selectedCategory];

        if (!apiCategory) {
            console.log(`Category '${selectedCategory}' not found in API.`);
            return;
        }

        let CategoryApiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${apiCategory}`;

        try {
            let categoryResponse = await fetch(CategoryApiUrl);
            if (!categoryResponse.ok) throw new Error("Recipe not found");

            let categoryData = await categoryResponse.json();
            let recipesContainer = recipeDisplay(); // Returns cleared container

            if (categoryData.meals) {
                createCards(categoryData.meals, recipesContainer);
            } else {
                recipesContainer.innerHTML = "<p>No Recipes Found</p>";
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Function to clear recipes and return the container
function recipeDisplay() {
    let recipesContainer = document.querySelector(".recipes");
    recipesContainer.innerHTML = ""; // Clear previous results
    return recipesContainer;
}

// Function to create recipe cards dynamically
function createCards(meals, container) {
    meals.forEach(meal => {
        let card = document.createElement("div");
        card.classList.add("recipe-card");

        card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p>${meal.strCategory} | ${meal.strArea}</p>
            <button onclick="viewRecipe('${meal.idMeal}')">View Recipe</button>
        `;

        container.appendChild(card);
    });
}

// Function to handle "View Recipe" button click

// storing dish name in local storage
function viewRecipe(id) {
    localStorage.setItem("selectedRecipeID", id);
    window.location.href = "instruction.html";
}

