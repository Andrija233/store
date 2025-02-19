import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
    name: "favorites",
    initialState: [],
    reducers: {
        addToFavorites: (state, action) => {
            // check if the item is already in the favorite list
            if(!state.some((item) => item._id === action.payload._id)) {
                state.push(action.payload);
            }
        },
        removeFromFavorites: (state, action) => {
            // remove the item with matching ID from the favorite list
            return state.filter((item) => item._id !== action.payload._id);
        },
        setFavorites: (state, action) => {
            // set the favorites from localStorage
            return action.payload;
        },
    },
});

export const { addToFavorites, removeFromFavorites, setFavorites } = favoriteSlice.actions;
export const selectFavoriteProduct = (state) => state.favorites;

export default favoriteSlice.reducer;