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
        const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmFtIiwib3JkZXJzIjpbIjY2MDJmMjJjY2UyZGNiZGI2YjI5OGRhMiIsIjY2MDJmMzE3NDZhY2Q0ZjMwYWI1NWIyZiIsIjY2MTI5MmRiMDEwMDBkNjZjOGU1YjRjNyIsIjY2MTI5MzA2YzMzYTFhYWEzMTkzOTEwOSIsIjY2MTJiZTExNzFlY2QwMGI4YzdkNDAyMyIsIjY2MTJiZTdmOTIzMmUyYjAzNDJkOTJhNCIsIjY2MTJiZWU5MzYyMWRmYThjNmRkOTAyZiIsIjY2MTJjMzA0ZjRiYWY5ZjM4ZGQ4YzIyNiIsIjY2MTJjMzRjZjRiYWY5ZjM4ZGQ4YzIzNiIsIjY2MTJjMzcxNDFmZWQyNzdjZGNlMzM1MSIsIjY2MTJjNWI0NGU0ZGM1OTkwYjU2OGU5NyIsIjY2MTJjNjBkYjc3OTdhNTQ4ZjUzMTk0MSIsIjY2MTJkMTc2ZjUzZTQyNzBmOTk2NzJkZSIsIjY2MTJkMTg2MzNkMmJkMTZlMjFkOWU2NSIsIjY2MTJkMWIwNjA5NTJiMDkxNzVlMzQxYyIsIjY2MTJkMWJiYmE5ZjhiOTQzNzljNmRhNyIsIjY2MTJkMWNlY2VlNGRjYmY3NDJjM2M1NyIsIjY2MTJkM2E4NDk2MGYwNDBmZGY4YzJhMCIsIjY2MTJkM2NlNDk2MGYwNDBmZGY4YzJhYyIsIjY2MTJkM2ZiOGYwOWE5ZWJmMGUzMjAwZCIsIjY2MTJkNDI4ZDgwZjkyZWZmYTMyMzc2NCIsIjY2MTJkNDNmZDgwZjkyZWZmYTMyMzc3MCIsIjY2MTJkNDlkM2Q4YjYzMzQxOGVmMDE4YSIsIjY2MTJkNTI2ZDNiZTE0MDExZDQyN2RjOCIsIjY2MTJkNjczZDBkYTZlNzJlNzE3MzdjYiIsIjY2MTJkNzk0ZTExODE4YzZkNGNjMjI1NCIsIjY2MTJkN2FkYmU0Mzk0MjE2ZjA0MjA3MyIsIjY2MTJkODA3OTJiZWE1MDdkMTRlMjc4OCIsIjY2MTJkODJmYmU2YmFhZTI5NGNlOTc3YiIsIjY2MTJkODViM2JkZmE5MDBlYmIwNjZlYSIsIjY2MTJkODg1ZTc1NzQ1M2RjOTE1YzQ2MSIsIjY2MTJkOTI5N2U4YWI4NmE4NDIyNzRkZSIsIjY2MTJkOTM5N2U4YWI4NmE4NDIyNzRlOCIsIjY2MTJkYTI5YTBkOTRmMzNjMzM4MTQ2ZCJdLCJfaWQiOiI2NWZiZGM3N2JkZDA2NzI1NmUxNDlkYTYiLCJlbWFpbCI6InJhbUBnbWFpbC5jb20iLCJpYXQiOjE3MTMwMjcyNzN9.hCZvOAnMWJBgVyV2L5vq8kxHWFR-9fIYKbUBvx9q_Qw';
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
