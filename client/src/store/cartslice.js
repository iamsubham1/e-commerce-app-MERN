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

export const fetchProducts = () => async dispatch => {
    dispatch(setItemsLoading(true));
    try {
        const JWT = 'your_jwt_token_here';
        const response = await axios.get('http://localhost:8080/api/product/allproducts', {
            headers: {
                JWT: JWT
            }
        });
        dispatch(setItemsLoading(false));
        dispatch(addProducts(response.data));
    } catch (error) {
        dispatch(setItemsLoading(false));
        dispatch(setItemsError(error.message));
    }
};

export const addProducts = products => dispatch => {
    dispatch({ type: 'cart/addProducts', payload: products });
};

export default cartSlice.reducer;
