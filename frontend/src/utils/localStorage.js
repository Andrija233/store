

// retrieve favorites from a localStorage
export const getFavoritesFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

// Add a product to localStorage
export const addFavoriteToLocalStorage = (product) => {
    const favorites = getFavoritesFromLocalStorage();
    if(!favorites.find((item) => item._id === product._id)) {
        favorites.push(product);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }
}


// remove product from a localStorage
export const removeFavoriteFromLocalStorage = (product) => {
    const favorites = getFavoritesFromLocalStorage();
    const updatedFavorites = favorites.filter((item) => item._id !== product._id);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
}


