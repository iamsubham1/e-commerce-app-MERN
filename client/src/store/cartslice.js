// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        addToCart: (state, action) => {
            state.items.push(action.payload);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item !== action.payload);
        },
        clearCart: state => {
            state.items = [];
        },
        setItemsLoading: (state, action) => {
            state.loading = action.payload;
        },
        setItemsError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { addToCart, removeFromCart, clearCart, setItemsLoading, setItemsError } = cartSlice.actions;



export default cartSlice.reducer;
