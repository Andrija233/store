import {createSlice} from "@reduxjs/toolkit";
import { updateCart } from "../../../utils/cart";

const initialState = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {cartItems: [], shippingAddress: {}, paymentMethod : "PayPal"};

const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        addToCart(state, action) {
            const {user, rating, numReviews, reviews, ...item} = action.payload;
            const existingItem = state.cartItems.find((i) => i._id === item._id);
            if (existingItem) {
                state.cartItems = state.cartItems.map((i) => i._id === existingItem._id ? item : i);
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            return updateCart(state, item);
        },
        removeFromCart(state, action) {
            state.cartItems = state.cartItems.filter((i) => i._id !== action.payload);
            return updateCart(state);   
        },

        saveShippingAddress(state, action) {
            state.shippingAddress = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
        },

        savePaymentMethod(state, action) {
            state.paymentMethod = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
        },

        clearCartItems (state) {
            state.cartItems = [];
            localStorage.setItem('cart', JSON.stringify(state));
        },

        resetCart: (state) => (state = initialState),
    }
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems, resetCart } = cartSlice.actions;
export default cartSlice.reducer;